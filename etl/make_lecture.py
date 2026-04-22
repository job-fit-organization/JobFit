"""
강의자료 생성 파이프라인 (LangChain + LangGraph)

JSON 커리큘럼 파일을 입력받아:
  1. 각 step의 URL을 크롤링해 본문 추출
  2. 초급자용 / 경력자용 PPT형 강의자료(마크다운) 생성
  3. 초급·중급·고급 문제 1:2:1 비율 생성
     - 초급자 강의 → 초급+중급 문제
     - 경력자 강의 → 중급+고급 문제
  4. 별도 LLM(OpenAI GPT)으로 강의자료 검수
  5. 결과 저장: data/<기술명>/<난이도>/<step>_curriculum.md / problems.md / review.md

사용법:
  python make_lecture.py                          # 기본 (postgresql, 전체 step)
  python make_lecture.py --tech postgresql        # 기술명 지정
  python make_lecture.py --steps 1 2 3            # 특정 step만 처리
  python make_lecture.py --skip-review            # 검수 생략
"""

import os
import re
import json
import argparse
from pathlib import Path
from typing import List

os.environ["USER_AGENT"] = "lecture-agent/1.0"

from dotenv import load_dotenv
load_dotenv()

from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_ollama.chat_models import ChatOllama
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_postgres.vectorstores import PGVector

from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START, END


# ──────────────────────────────────────────────
# 상수 및 경로 설정
# ──────────────────────────────────────────────
DATA_DIR = Path(__file__).parent / "data"
ETL_DATA_DIR = Path(__file__).parent / "data"

# 생성 LLM (강의자료 작성)
GENERATE_MODEL = os.getenv("GENERATE_MODEL", "gpt-4.1-mini")
# 검수 LLM (강의자료 검토)
REVIEW_MODEL = os.getenv("REVIEW_MODEL", "gpt-4.1")

# LLM 프로바이더 선택: "openai" | "ollama"
GENERATE_PROVIDER = os.getenv("GENERATE_PROVIDER", "openai").lower()
REVIEW_PROVIDER = os.getenv("REVIEW_PROVIDER", "openai").lower()

# Ollama 서버 주소 (로컬 기본값)
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")

# 문제 총 개수 기본값 (1:2:1 비율)
DEFAULT_PROBLEM_COUNT = 8  # 초급2 + 중급4 + 고급2

# PGVector 연결 문자열
PGVECTOR_URL = "postgresql://admin:admin1234@localhost:5432/jobfit_pgvector"


# ──────────────────────────────────────────────
# LangGraph 상태 정의
# ──────────────────────────────────────────────
class LectureState(TypedDict):
    # 입력
    tech_name: str          # 기술명 (e.g. "postgresql")
    step: str               # 커리큘럼 step 번호
    topic: str              # 주제
    objectives: str         # 학습목표
    key_contents: str       # 핵심 내용
    urls: List[str]         # 자료 생성 시 참고 URL 목록 (JSON의 tech 레벨 URL 전체)

    # 중간 처리 필드 없음 — PGVector에 미리 인덱싱되어 있음

    # 생성물
    beginner_lecture: str   # 초급자용 강의자료
    advanced_lecture: str   # 경력자용 강의자료
    problems: str           # 전체 문제 (초급+중급+고급)

    # 검수 결과
    beginner_review: str
    advanced_review: str

    # 설정
    skip_review: bool


# ──────────────────────────────────────────────
# LLM 팩토리 (OpenAI / Ollama 프로바이더 선택)
# ──────────────────────────────────────────────
def get_generate_llm():
    """GENERATE_PROVIDER 환경변수에 따라 생성 LLM 반환.

    openai (기본): ChatOpenAI — GENERATE_MODEL, OPENAI_API_KEY 필요
    ollama        : ChatOllama  — GENERATE_MODEL(모델명), OLLAMA_BASE_URL 필요
    """
    if GENERATE_PROVIDER == "ollama":
        return ChatOllama(
            model=GENERATE_MODEL,
            base_url=OLLAMA_BASE_URL,
            temperature=0.7,
        )
    return ChatOpenAI(
        model=GENERATE_MODEL,
        temperature=0.7,
    )


def get_review_llm():
    """REVIEW_PROVIDER 환경변수에 따라 검수 LLM 반환."""
    if REVIEW_PROVIDER == "ollama":
        return ChatOllama(
            model=REVIEW_MODEL,
            base_url=OLLAMA_BASE_URL,
            temperature=0.2,
        )
    return ChatOpenAI(
        model=REVIEW_MODEL,
        temperature=0.2,
    )


# ──────────────────────────────────────────────
# RAG 헬퍼: PGVector 빌드 & 검색
# ──────────────────────────────────────────────
_embeddings = OpenAIEmbeddings(model="text-embedding-3-small")


def retrieve_context(
    query: str,
    collection_name: str,
    k: int = 6,
) -> str:
    """PGVector에서 쿼리와 유사한 청크를 검색해 문자열로 반환.
    
    build_index.py 로 미리 인덱싱된 컬렉션을 사용합니다.
    컬렉션명 규칙: {tech_name}_{step}
    """
    store = PGVector(
        embeddings=_embeddings,
        collection_name=collection_name,
        connection=PGVECTOR_URL,
        use_jsonb=True,
        pre_delete_collection=False,
    )
    retriever = store.as_retriever(search_kwargs={"k": k})
    docs = retriever.invoke(query)
    return "\n\n".join(
        f"[출처: {d.metadata.get('source', '?')}]\n{d.page_content}"
        for d in docs
    )


# ──────────────────────────────────────────────
# 노드 1: 초급자용 강의자료 생성
# ──────────────────────────────────────────────
def generate_beginner_node(state: LectureState) -> dict:
    print(f"📝 [Step {state['step']}] 초급자용 강의자료 생성 중... (PGVector 검색)")

    collection_name = state["tech_name"]  # 기술 단위 컨렉션
    rag_query = f"{state['topic']} 기본 개념 사용법 예제 입문"
    context = retrieve_context(rag_query, collection_name, k=8)

    urls_md = "\n".join(f"- {u}" for u in state["urls"])
    prompt = ChatPromptTemplate.from_template(
        "당신은 IT 교육 전문가입니다. 아래 커리큘럼 정보와 참고 문서를 바탕으로 "
        "**처음 배우는 학생(비전공자·입문자)**을 위한 강의자료를 PPT 슬라이드 형태의 마크다운으로 작성하세요.\n\n"
        "## 작성 규칙\n"
        "- 슬라이드 10장 이내, 각 슬라이드는 `---` 구분자로 분리\n"
        "- 복잡한 내부 원리보다 **사용법·개념·예시** 위주\n"
        "- 코드 예제는 간단하고 따라하기 쉽게\n"
        "- 각 슬라이드에 이모지 활용 (가독성 향상)\n"
        "- 문서 최상단에 참고 링크 섹션 포함 (아래 URL 목록 사용)\n"
        "- 마크다운 형식으로, 나중에 LLM이 다시 읽을 수 있도록 구조적으로 작성\n\n"
        "## 참고 링크\n{urls_md}\n\n"
        "## 커리큘럼 정보\n"
        "- **주제**: {topic}\n"
        "- **학습목표**: {objectives}\n"
        "- **핵심 내용**: {key_contents}\n\n"
        "## 검색된 참고 문서 (RAG)\n{context}"
    )
    chain = prompt | get_generate_llm() | StrOutputParser()
    result = chain.invoke({
        "urls_md": urls_md,
        "topic": state["topic"],
        "objectives": state["objectives"],
        "key_contents": state["key_contents"],
        "context": context,
    })
    return {"beginner_lecture": result}


# ──────────────────────────────────────────────
# 노드 2: 경력자용 강의자료 생성
# ──────────────────────────────────────────────
def generate_advanced_node(state: LectureState) -> dict:
    print(f"📝 [Step {state['step']}] 경력자용 강의자료 생성 중... (PGVector 검색)")

    collection_name = state["tech_name"]  # 기술 단위 컨렉션
    rag_query = f"{state['topic']} 내부 동작 원리 성능 최적화 트레이드오프 아키텍처"
    context = retrieve_context(rag_query, collection_name, k=8)

    urls_md = "\n".join(f"- {u}" for u in state["urls"])
    prompt = ChatPromptTemplate.from_template(
        "당신은 IT 교육 전문가입니다. 아래 커리큘럼 정보와 참고 문서를 바탕으로 "
        "**개발 경험이 있는 경력자**를 위한 강의자료를 PPT 슬라이드 형태의 마크다운으로 작성하세요.\n\n"
        "## 작성 규칙\n"
        "- 슬라이드 10장 이내, 각 슬라이드는 `---` 구분자로 분리\n"
        "- **내부 동작 원리, 성능·최적화, 트레이드오프** 위주로 설명\n"
        "- 코드 예제는 실무 수준의 복잡한 케이스 포함\n"
        "- 각 슬라이드에 이모지 활용 (가독성 향상)\n"
        "- 문서 최상단에 참고 링크 섹션 포함 (아래 URL 목록 사용)\n"
        "- 마크다운 형식으로, 나중에 LLM이 다시 읽을 수 있도록 구조적으로 작성\n\n"
        "## 참고 링크\n{urls_md}\n\n"
        "## 커리큘럼 정보\n"
        "- **주제**: {topic}\n"
        "- **학습목표**: {objectives}\n"
        "- **핵심 내용**: {key_contents}\n\n"
        "## 검색된 참고 문서 (RAG)\n{context}"
    )
    chain = prompt | get_generate_llm() | StrOutputParser()
    result = chain.invoke({
        "urls_md": urls_md,
        "topic": state["topic"],
        "objectives": state["objectives"],
        "key_contents": state["key_contents"],
        "context": context,
    })
    return {"advanced_lecture": result}



# ──────────────────────────────────────────────
# 노드 3: 문제 생성 (1:2:1 비율)
# ──────────────────────────────────────────────
def generate_problems_node(state: LectureState) -> dict:
    print(f"📝 [Step {state['step']}] 문제 생성 중 (초급:중급:고급 = 1:2:1, PGVector 검색)...")

    collection_name = state["tech_name"]  # 기술 단위 컨렉션
    rag_query = f"{state['topic']} {state['key_contents']} 개념 정의 예제 주의사항"
    context = retrieve_context(rag_query, collection_name, k=10)

    prompt = ChatPromptTemplate.from_template(
        "당신은 IT 교육 전문가입니다. 아래 주제에 대한 4지선다 객관식 문제를 작성하세요.\n\n"
        "## 문제 구성 (총 {total}문제)\n"
        "- 🟢 초급 문제: {easy}문제 — 기본 개념·용어 이해 수준\n"
        "- 🟡 중급 문제: {medium}문제 — 실제 사용법·예제 적용 수준\n"
        "- 🔴 고급 문제: {hard}문제 — 원리 이해·최적화·트레이드오프 수준\n\n"
        "## 형식 (마크다운)\n"
        "```\n"
        "## 🟢 초급 문제\n\n"
        "### Q1. 문제 내용\n"
        "1) 보기1\n2) 보기2\n3) 보기3\n4) 보기4\n\n"
        "<details><summary>정답 보기</summary>\n\n정답: X번 — 해설 내용\n\n</details>\n"
        "```\n"
        "모든 문제는 위 형식을 따르고, 정답은 `<details>` 태그로 숨겨주세요.\n"
        "문서 최상단에 다음 안내문을 반드시 포함하세요:\n"
        "> ※ 안내: 초급자 강의에는 **초급·중급** 문제를, 경력자 강의에는 **중급·고급** 문제를 활용하세요.\n\n"
        "## 주제\n"
        "- **주제**: {topic}\n"
        "- **학습목표**: {objectives}\n"
        "- **핵심 내용**: {key_contents}\n\n"
        "## 검색된 참고 문서 (RAG)\n{context}"
    )

    # 1:2:1 비율 계산
    total = DEFAULT_PROBLEM_COUNT
    easy = total // 4
    hard = total // 4
    medium = total - easy - hard

    chain = prompt | get_generate_llm() | StrOutputParser()
    result = chain.invoke({
        "total": total,
        "easy": easy,
        "medium": medium,
        "hard": hard,
        "topic": state["topic"],
        "objectives": state["objectives"],
        "key_contents": state["key_contents"],
        "context": context,
    })
    return {"problems": result}


# ──────────────────────────────────────────────
# 노드 4: 검수 (다른 LLM 사용)
# ──────────────────────────────────────────────
REVIEW_PROMPT = ChatPromptTemplate.from_template(
    "당신은 IT 교육 콘텐츠 품질 관리 전문가입니다.\n"
    "아래 강의자료를 검토하여 **문제가 있는지 없는지**만 간결하게 평가하세요.\n"
    "단점을 억지로 만들 필요는 없으며, 명확한 오류·오개념·불완전한 설명이 있을 때만 지적하세요.\n\n"
    "## 평가 항목\n"
    "1. 사실 오류 또는 오개념 여부\n"
    "2. 학습목표 달성 가능성\n"
    "3. 대상 수준(초급/경력) 적합성\n"
    "4. 코드 예제의 정확성\n\n"
    "## 출력 형식\n"
    "```\n"
    "### 검수 결과: [✅ 문제 없음 / ⚠️ 경미한 문제 / ❌ 심각한 문제]\n\n"
    "**종합 의견**: (1~3문장)\n\n"
    "**지적 사항** (있는 경우만):\n"
    "- ...\n"
    "```\n\n"
    "## 강의자료 (대상: {target})\n\n{lecture}"
)


def review_beginner_node(state: LectureState) -> dict:
    if state.get("skip_review"):
        return {"beginner_review": "*(검수 생략)*"}
    
    print(f"🔍 [Step {state['step']}] 초급자용 강의자료 검수 중... (모델: {REVIEW_MODEL})")
    chain = REVIEW_PROMPT | get_review_llm() | StrOutputParser()
    result = chain.invoke({
        "target": "처음 배우는 학생 (초급자)",
        "lecture": state["beginner_lecture"][:5000],
    })
    return {"beginner_review": result}


def review_advanced_node(state: LectureState) -> dict:
    if state.get("skip_review"):
        return {"advanced_review": "*(검수 생략)*"}
    
    print(f"🔍 [Step {state['step']}] 경력자용 강의자료 검수 중... (모델: {REVIEW_MODEL})")
    chain = REVIEW_PROMPT | get_review_llm() | StrOutputParser()
    result = chain.invoke({
        "target": "개발 경험이 있는 경력자",
        "lecture": state["advanced_lecture"][:5000],
    })
    return {"advanced_review": result}


# ──────────────────────────────────────────────
# 노드 5: 파일 저장
# ──────────────────────────────────────────────
def save_files_node(state: LectureState) -> dict:
    print(f"💾 [Step {state['step']}] 파일 저장 중...")

    tech = state["tech_name"]
    step = state["step"].zfill(2)  # 01, 02, ...
    topic_safe = re.sub(r"[^\w가-힣\s]", "", state["topic"])[:40].strip()
    step_label = f"{step}_{topic_safe}"

    # 디렉토리 생성
    base = DATA_DIR / tech
    beginner_dir = base / "beginner"
    advanced_dir = base / "advanced"
    for d in [beginner_dir, advanced_dir]:
        d.mkdir(parents=True, exist_ok=True)

    # ── 초급자 강의자료 + 검수
    beginner_path = beginner_dir / f"{step_label}_curriculum.md"
    beginner_review_path = beginner_dir / f"{step_label}_review.md"
    with open(beginner_path, "w", encoding="utf-8") as f:
        f.write(state.get("beginner_lecture", ""))
    with open(beginner_review_path, "w", encoding="utf-8") as f:
        header = f"# 검수 결과 — 초급자 강의자료\n> Step {state['step']}: {state['topic']}\n\n"
        f.write(header + state.get("beginner_review", ""))

    # ── 경력자 강의자료 + 검수
    advanced_path = advanced_dir / f"{step_label}_curriculum.md"
    advanced_review_path = advanced_dir / f"{step_label}_review.md"
    with open(advanced_path, "w", encoding="utf-8") as f:
        f.write(state.get("advanced_lecture", ""))
    with open(advanced_review_path, "w", encoding="utf-8") as f:
        header = f"# 검수 결과 — 경력자 강의자료\n> Step {state['step']}: {state['topic']}\n\n"
        f.write(header + state.get("advanced_review", ""))

    # ── 문제 파일 (beginner + advanced 공용)
    problems_beginner = advanced_dir / f"{step_label}_problems.md"
    problems_advanced = beginner_dir / f"{step_label}_problems.md"
    problems_content = state.get("problems", "")
    for path in [problems_beginner, problems_advanced]:
        with open(path, "w", encoding="utf-8") as f:
            f.write(problems_content)

    print(f"  ✅ 저장 완료: {beginner_dir.name}/{step_label}_*")
    print(f"  ✅ 저장 완료: {advanced_dir.name}/{step_label}_*")
    return state


# ──────────────────────────────────────────────
# LangGraph 그래프 빌드
# ──────────────────────────────────────────────
def build_graph() -> StateGraph:
    workflow = StateGraph(LectureState)

    # 노드 등록 (crawl 노드 없음 — build_index.py로 미리 인덱싱)
    workflow.add_node("beginner", generate_beginner_node)
    workflow.add_node("advanced", generate_advanced_node)
    workflow.add_node("problems", generate_problems_node)
    workflow.add_node("review_beginner", review_beginner_node)
    workflow.add_node("review_advanced", review_advanced_node)
    workflow.add_node("save", save_files_node)

    # 엣지 연결
    workflow.add_edge(START, "beginner")
    workflow.add_edge("beginner", "advanced")
    workflow.add_edge("advanced", "problems")
    workflow.add_edge("problems", "review_beginner")
    workflow.add_edge("review_beginner", "review_advanced")
    workflow.add_edge("review_advanced", "save")
    workflow.add_edge("save", END)

    return workflow.compile()


# ──────────────────────────────────────────────
# 메인 실행
# ──────────────────────────────────────────────
def load_data(json_path: Path) -> dict:
    """새 JSON 구조 (tech/urls/curriculum) 로드."""
    with open(json_path, encoding="utf-8") as f:
        return json.load(f)


def main():
    parser = argparse.ArgumentParser(description="LangChain 기반 강의자료 생성 파이프라인")
    parser.add_argument(
        "--data-file",
        type=str,
        default="data/1. postgresql.json",
        help="처리할 JSON 파일 경로 (etl/ 기준 상대경로 또는 절대경로)",
    )
    parser.add_argument(
        "--tech",
        type=str,
        default=None,
        help="기술명 오버라이드 (미지정 시 파일명에서 자동 추출)",
    )
    parser.add_argument(
        "--steps",
        type=str,
        nargs="*",
        default=None,
        help="처리할 step 번호 목록 (미지정 시 전체). 예: --steps 1 2 3",
    )
    parser.add_argument(
        "--skip-review",
        action="store_true",
        help="검수 단계 생략 (빠른 테스트용)",
    )
    args = parser.parse_args()

    # 파일 경로 해석
    data_file = Path(args.data_file)
    if not data_file.is_absolute():
        data_file = Path(__file__).parent / data_file
    if not data_file.exists():
        print(f"❌ 파일을 찾을 수 없습니다: {data_file}")
        return

    data = load_data(data_file)
    tech_name = args.tech or data.get("tech", data_file.stem).lower()
    curriculum = data.get("curriculum", [])
    all_urls = data.get("urls", [])

    # step 필터
    target_steps = set(args.steps) if args.steps else None

    print("=" * 60)
    print(f"🚀 강의자료 생성 파이프라인 시작")
    print(f"   기술명  : {tech_name}")
    print(f"   데이터  : {data_file.name}")
    print(f"   총 Step : {len(curriculum)}")
    print(f"   총 URL  : {len(all_urls)}")
    print(f"   컨렉션 : {tech_name}  (기술 단위)")
    print(f"   생성 LLM: {GENERATE_MODEL}")
    print(f"   검수 LLM: {REVIEW_MODEL}")
    print(f"   검수     : {'생략' if args.skip_review else '포함'}")
    print("=" * 60)

    graph = build_graph()

    for item in curriculum:
        step_num = str(item["step"])
        if target_steps and step_num not in target_steps:
            print(f"⏭️  Step {step_num} 건너뜀")
            continue

        print(f"\n{'─'*60}")
        print(f"📚 Step {step_num}: {item['topic']}")
        print(f"{'─'*60}")

        initial_state: LectureState = {
            "tech_name": tech_name,
            "step": step_num,
            "topic": item["topic"],
            "objectives": item["objectives"],
            "key_contents": item["key_contents"],
            "urls": all_urls,  # 기술 전체 URL (프롬프트의 참고 링크 섹션용)
            "beginner_lecture": "",
            "advanced_lecture": "",
            "problems": "",
            "beginner_review": "",
            "advanced_review": "",
            "skip_review": args.skip_review,
        }

        try:
            graph.invoke(initial_state)
            print(f"✅ Step {step_num} 완료!")
        except Exception as e:
            print(f"❌ Step {step_num} 실패: {e}")
            import traceback
            traceback.print_exc()

    print("\n" + "=" * 60)
    print(f"🎉 전체 처리 완료! 결과물 위치: etl/data/{tech_name}/")
    print("=" * 60)


if __name__ == "__main__":
    main()
