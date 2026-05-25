import re
import time
import requests
import trafilatura

from typing import List, Optional
from langchain_core.documents import Document


def __github_ipynb_to_raw(url: str) -> Optional[str]:
    """GitHub .ipynb 블롭 URL을 raw URL로 변환.

    github.com/user/repo/blob/branch/path/to/file.ipynb
    → raw.githubusercontent.com/user/repo/branch/path/to/file.ipynb
    """
    m = re.match(
        r"https?://github\.com/([^/]+/[^/]+)/blob/(.+\.ipynb)$",
        url, re.IGNORECASE
    )
    if not m:
        return None
    return f"https://raw.githubusercontent.com/{m.group(1)}/{m.group(2)}"

def __extract_ipynb(url: str) -> Optional[str]:
    """GitHub raw .ipynb JSON을 파싱하여 마크다운+코드 셀 텍스트 반환."""
    raw_url = __github_ipynb_to_raw(url)
    if not raw_url:
        # 이미 raw URL인 경우 그대로 사용
        if "raw.githubusercontent.com" in url and url.endswith(".ipynb"):
            raw_url = url
        else:
            return None

    response = requests.get(raw_url, timeout=15, verify=False)
    response.raise_for_status()
    notebook_data = response.json()

    parts = []
    for cell in notebook_data.get("cells", []):
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
    return "\n".join(parts) if parts else None

def __extract_general_url(url: str) -> Optional[str]:
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/123.0.0.0 Safari/537.36"
        )
    }
    response = requests.get(url, headers=headers, timeout=15, verify=False)
    response.raise_for_status()
    return trafilatura.extract(
        response.text,
        url=url, include_comments=False,
        include_tables=True,
        include_formatting=True,                
    )
    

# 2. 크롤링(= Loader): url을 입력받아 본문만 추출
def do_crawl(urls: List[str]) -> List[Document]:
    """
    - 크롤링 차단을 방지하기 위해 헤더에 User-Agent 추가
    - url이 .ipynb 파일이면 raw.githubusercontent.com을 통해 마크다운+코드 셀 텍스트로 구성된 JSON으로 변환해서 읽어옴
    - 일반 웹페이지는 trafilatura로 본문만 추출
    - 크롤링 중 오류가 발생하면 오류를 출력하고 다음 url로 넘어감
    - 크롤링 결과의 길이가 짧으면 본문 추출 실패로 간주

    - return: 벡터DB에 저장할 수 있게 문서 리스트로 반환(List[Document])
    """
    docs = []
    for url in urls:
        try:
            if url.endswith(".ipynb") or ("github.com" in url and ".ipynb" in url):
                # .ipynb 파일 처리
                page_content = __extract_ipynb(url)
            else:
                # 일반 웹페이지 처리
                page_content = __extract_general_url(url)
            
            if not page_content or len(page_content.strip()) < 150:
                print(f"    ⚠️  {url[:75]}... 본문 추출 실패 (콘텐츠 부족)")
                continue

            doc = Document(
                page_content=page_content,
                metadata={"source": url}
            )
            docs.append(doc)
            print(f"    ✅ {url[:75]}... ({len(page_content):,}자)")
            
        except Exception as e:
            print(f"    ❌ {url[:75]}... 본문 추출 실패 ({e})")

        time.sleep(0.5)
    
    return docs