"""
PGVector 인덱스 빌드 스크립트

etl/data/*.json 파일의 모든 URL을 크롤링하여
기술 단위 컬렉션으로 PGVector에 적재합니다.

컬렉션명 규칙: {skill_name}  (e.g. postgresql, docker, python)

JSON 구조:
  {
    "skill": "postgresql",
    "urls": ["url1", "url2", ...],   ← 기술 전체 URL 목록
    "curriculum": [
      {"step": "1", "topic": "...", "objectives": "...", "key_contents": "..."},
      ...
    ]
  }

사용법:
  python build_index.py                        # 전체 기술 인덱싱
  python build_index.py --skill docker python   # 특정 기술만
  python build_index.py --no-force             # 이미 있는 컬렉션 건너뜀
"""

import os
import re
import json
import argparse
import time
from pathlib import Path
from typing import List, Optional

os.environ["USER_AGENT"] = "index-builder/1.0"

from dotenv import load_dotenv
load_dotenv()

import requests
import trafilatura
from langchain_core.documents import Document
from langchain_openai import OpenAIEmbeddings
from langchain_postgres.vectorstores import PGVector
from langchain_text_splitters import RecursiveCharacterTextSplitter

import warnings

# 개발 환경에서 SSL 경고 메시지 무시 설정
warnings.filterwarnings('ignore')


# ──────────────────────────────────────────────
# 설정
# ──────────────────────────────────────────────
DATA_DIR = Path(__file__).parent / "data"

PGVECTOR_URL = "postgresql://admin:admin1234@localhost:5432/jobfit"

_splitter = RecursiveCharacterTextSplitter(
    chunk_size=800,
    chunk_overlap=100,
    separators=["\n\n", "\n", ". ", " ", ""],
)

_embeddings = OpenAIEmbeddings(model="text-embedding-3-small")


# ──────────────────────────────────────────────
# 유틸
# ──────────────────────────────────────────────
def load_data(json_path: Path) -> dict:
    with open(json_path, encoding="utf-8") as f:
        return json.load(f)


def _github_ipynb_to_raw(url: str) -> Optional[str]:
    """GitHub .ipynb 블롭 URL을 raw URL로 변환.

    github.com/user/repo/blob/branch/path/to/file.ipynb
    → raw.githubusercontent.com/user/repo/branch/path/to/file.ipynb
    """
    import re
    m = re.match(
        r"https?://github\.com/([^/]+/[^/]+)/blob/(.+\.ipynb)$",
        url, re.IGNORECASE
    )
    if not m:
        return None
    return f"https://raw.githubusercontent.com/{m.group(1)}/{m.group(2)}"


def _extract_ipynb(url: str) -> Optional[str]:
    """GitHub raw .ipynb JSON을 파싱하여 마크다운+코드 셀 텍스트 반환."""
    raw_url = _github_ipynb_to_raw(url)
    if not raw_url:
        # 이미 raw URL인 경우 그대로 사용
        if "raw.githubusercontent.com" in url and url.endswith(".ipynb"):
            raw_url = url
        else:
            return None

    resp = requests.get(raw_url, timeout=15, verify=False)
    resp.raise_for_status()
    nb = resp.json()

    parts = []
    for cell in nb.get("cells", []):
        cell_type = cell.get("cell_type", "")
        src = "".join(cell.get("source", []))
        if not src.strip():
            continue
        if cell_type == "markdown":
            parts.append(src)
        elif cell_type == "code":
            parts.append(f"```python\n{src}\n```")
            # 텍스트 출력도 포함 (에러 제외)
            for output in cell.get("outputs", []):
                if output.get("output_type") in ("stream", "execute_result"):
                    out_text = "".join(output.get("text", []))
                    if out_text.strip():
                        parts.append(f"[출력]\n{out_text}")
    return "\n\n".join(parts) if parts else None


def fetch_main_content(url: str) -> Optional[str]:
    """URL 타입에 따라 적절한 방법으로 텍스트 추출.

    - GitHub .ipynb  → raw URL로 변환 후 노트북 JSON 파싱
    - 일반 웹페이지  → trafilatura로 본문만 추출 (nav/sidebar 제거)
    """
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/123.0.0.0 Safari/537.36"
        )
    }

    # GitHub .ipynb 파일 감지
    is_ipynb = (
        url.endswith(".ipynb") or
        ("github.com" in url and ".ipynb" in url) or
        ("raw.githubusercontent.com" in url and ".ipynb" in url)
    )
    if is_ipynb:
        return _extract_ipynb(url)

    # 일반 웹페이지: trafilatura
    resp = requests.get(url, headers=headers, timeout=15, verify=False)
    resp.raise_for_status()
    return trafilatura.extract(
        resp.text,
        url=url,
        include_tables=True,
        include_formatting=True,
        favor_precision=True,
        no_fallback=False,
    )


def crawl_urls(urls: List[str]) -> List[Document]:
    """URL 목록을 크롤링하여 본문만 담은 Document 목록 반환."""
    all_docs: List[Document] = []
    for url in urls:
        try:
            text = fetch_main_content(url)
            if not text or len(text.strip()) < 100:
                print(f"    ⚠️  {url[:75]}... 본문 추출 실패 (빈 콘텐츠)")
                continue
            doc = Document(page_content=text, metadata={"source": url})
            all_docs.append(doc)
            print(f"    ✅ {url[:75]}... ({len(text):,}자)")
        except Exception as e:
            print(f"    ⚠️  {url[:75]}... 실패: {e}")
        time.sleep(0.5)
    return all_docs



def index_skill(
    skill_name: str,
    urls: List[str],
    force: bool = True,
) -> int:
    """기술 단위 URL 전체를 하나의 컬렉션에 인덱싱. 저장된 청크 수 반환."""
    collection_name = skill_name  # 컬렉션명 = 기술명

    if not force:
        try:
            store = PGVector(
                embeddings=_embeddings,
                collection_name=collection_name,
                connection=PGVECTOR_URL,
                use_jsonb=True,
                pre_delete_collection=False,
            )
            results = store.similarity_search("test", k=1)
            if results:
                print(f"  ⏭️  '{collection_name}' 이미 존재 → 건너뜀 (--force 로 덮어쓰기 가능)")
                return 0
        except Exception:
            pass

    print(f"  🌐 {len(urls)}개 URL 크롤링 시작...")
    raw_docs = crawl_urls(urls)
    if not raw_docs:
        print(f"  ❌ 크롤링 결과 없음, 건너뜀")
        return 0

    chunks = _splitter.split_documents(raw_docs)
    print(f"  📦 {len(raw_docs)}개 문서 → {len(chunks)}개 청크")

    store = PGVector(
        embeddings=_embeddings,
        collection_name=collection_name,
        connection=PGVECTOR_URL,
        use_jsonb=True,
        pre_delete_collection=force,
    )
    store.add_documents(chunks)
    print(f"  🔷 PGVector '{collection_name}' 저장 완료 ({len(chunks)}청크)")
    return len(chunks)


# ──────────────────────────────────────────────
# 메인
# ──────────────────────────────────────────────
def main():
    parser = argparse.ArgumentParser(
        description="PGVector 인덱스 빌드 — data/*.json 기술 단위로 크롤링 후 적재"
    )
    parser.add_argument(
        "--skill",
        type=str,
        nargs="*",
        default=None,
        help="처리할 기술명 목록 (미지정 시 전체). 예: --skill postgresql docker",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        default=True,
        help="기존 컬렉션 덮어쓰기 (기본값: True)",
    )
    parser.add_argument(
        "--no-force",
        action="store_false",
        dest="force",
        help="이미 있는 컬렉션은 건너뜀",
    )
    args = parser.parse_args()

    json_files = sorted(DATA_DIR.glob("*.json"))
    if not json_files:
        print(f"❌ {DATA_DIR} 에서 JSON 파일을 찾을 수 없습니다.")
        return

    # skill 필터: JSON 내부의 "skill" 필드 기준
    if args.skill:
        skill_filter = set(t.lower() for t in args.skill)
        json_files = [
            f for f in json_files
            if load_data(f).get("skill", "").lower() in skill_filter
        ]
        if not json_files:
            print(f"❌ 지정한 기술명에 해당하는 파일이 없습니다: {args.skill}")
            return

    print("=" * 65)
    print(f"🗄️  PGVector 인덱스 빌드 시작 (기술 단위 컬렉션)")
    print(f"   대상 파일  : {len(json_files)}개")
    print(f"   덮어쓰기   : {'예' if args.force else '아니오 (기존 건너뜀)'}")
    print(f"   PGVector   : {PGVECTOR_URL.split('@')[-1]}")
    print(f"   컬렉션 규칙: {{skill_name}}  (예: postgresql, docker)")
    print("=" * 65)

    total_chunks = 0
    total_skills = 0

    for json_file in json_files:
        data = load_data(json_file)
        skill_name = data.get("skill", json_file.stem).lower()
        urls = data.get("urls", [])
        curriculum = data.get("curriculum", [])

        print(f"\n{'─'*65}")
        print(f"📚 [{skill_name.upper()}]  steps={len(curriculum)}, urls={len(urls)}")
        print(f"{'─'*65}")

        n = index_skill(skill_name=skill_name, urls=urls, force=args.force)
        total_chunks += n
        total_skills += 1

    print("\n" + "=" * 65)
    print(f"🎉 인덱싱 완료!")
    print(f"   처리 기술  : {total_skills}개")
    print(f"   총 청크 수 : {total_chunks}개")
    print("=" * 65)


if __name__ == "__main__":
    main()
