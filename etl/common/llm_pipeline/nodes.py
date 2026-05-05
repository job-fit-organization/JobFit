import os
import re
from pathlib import Path

from langchain_core.output_parsers import StrOutputParser, JsonOutputParser

from common.llm_pipeline.retriever import __get_context
from common.llm_pipeline.prompts import (
    __get_beginner_material_prompt, __get_advanced_material_prompt,
    __get_quiz_prompt, __get_review_prompt
)
from common.llm_pipeline.models import __get_generate_llm, __get_review_llm
from common.llm_pipeline.db import save_quiz_to_db
from common.llm_pipeline.state import State

DATA_DIR = Path(__file__).parent.parent.parent / "data"

# 1. 강의 자료 생성 노드 (level에 따라 beginner/advanced 프롬프트 분기)
def generate_material_node(state: State) -> State:
    level = state["level"]
    level_label = "초급자" if level == "beginner" else "경력자"
    print(f"📝 [Step {state['step']}] {level_label}용 강의자료 생성 중... (PGVector 검색)")

    urls_md = "\n".join(f"- {u}" for u in state["urls"])

    if level == "beginner":
        query = f"{state['topic']} 기본 개념, 사용법, 예제, 입문"
        prompt = __get_beginner_material_prompt()
    else:
        query = f"{state['topic']} 내부 동작 원리, 성능 최적화, 트레이드오프, 아키텍처"
        prompt = __get_advanced_material_prompt()

    context = __get_context(query, state["skill_name"], k=10)
    llm = __get_generate_llm(os.getenv("GENERATE_MODEL"))
    chain = prompt | llm | StrOutputParser()

    result = chain.invoke({
        "urls_md": urls_md,
        "topic": state["topic"],
        "objectives": state["objectives"],
        "key_contents": state["key_contents"],
        "context": context,
    })

    return {
        "material": result
    }

# 2. 문제 생성 노드
def generate_quiz_node(state: State) -> State:
    print(f"📝 [Step {state['step']}] 문제 생성 중 (초급:중급:고급 = 1:2:1, 생성된 강의자료 기반)...")
    quiz_context = state.get("material", "")
    quiz_prompt = __get_quiz_prompt()

    # 1:2:1 비율 계산
    total = 20
    easy = total // 4
    hard = total // 4
    medium = total - easy - hard

    # JSON 배열을 바로 파싱
    quiz_chain = quiz_prompt | __get_generate_llm(os.getenv("GENERATE_MODEL")) | JsonOutputParser()
    result: list = quiz_chain.invoke({
        "total": total,
        "easy": easy,
        "medium": medium,
        "hard": hard,
        "topic": state["topic"],
        "objectives": state["objectives"],
        "key_contents": state["key_contents"],
        "context": quiz_context
    })

    print(f"   ✔ 문제 {len(result)}개 파싱 완료")
    return {
        "quiz": result
    }

# 3. 검수 노드
def review_material_node(state: State) -> State:
    if state.get("skip_review"):
        return {"review": "*(검수 생략)*"}

    REVIEW_MODEL_NM = os.getenv("REVIEW_MODEL", "gpt-4.1")
    review_model = __get_review_llm(REVIEW_MODEL_NM)
    review_prompt = __get_review_prompt()
    review_chain = review_prompt | review_model | StrOutputParser()

    level = state["level"]
    target = "처음 배우는 학생 (비전공자·입문자)" if level == "beginner" else "개발 경험이 있는 학생 (전공자·경력자)"
    level_label = "초급자" if level == "beginner" else "경력자"

    print(f"🔍 [Step {state['step']}] {level_label}용 강의자료 검수 중... (모델: {REVIEW_MODEL_NM})")
    result = review_chain.invoke({
        "target": target,
        "material": state["material"],
    })

    return {
        "review": result
    }

# 4. 결과 저장 노드
def save_files_node(state: State) -> State:
    print(f"💾 [Step {state['step']}] 파일 저장 중...")

    skill = state["skill_name"]
    level = state["level"]
    step = state["step"].zfill(2)  # 01, 02, ...
    topic_safe = re.sub(r"[^\w가-힣\s]", "", state["topic"])[:40].strip()
    step_label = f"{step}_{topic_safe}"

    # 디렉토리 생성
    level_dir = DATA_DIR / level / skill
    level_dir.mkdir(parents=True, exist_ok=True)

    # ── 강의자료
    material_path = level_dir / f"material_{step_label}.md"
    with open(material_path, "w", encoding="utf-8") as f:
        f.write(state.get("material", ""))

    # ── 검수 결과
    review_path = level_dir / f"review_{step_label}.md"
    level_label = "초급자" if level == "beginner" else "경력자"
    with open(review_path, "w", encoding="utf-8") as f:
        header = f"# 검수 결과 — {level_label} 강의자료\n> Step {state['step']}: {state['topic']}\n\n"
        f.write(header + state.get("review", ""))

    # ── 퀴즈 → DB 저장
    quiz_items = state.get("quiz", [])
    if quiz_items:
        inserted = save_quiz_to_db(
            quiz_items=quiz_items,
            skill=skill,
            level=level,
            step=state["step"],
            topic=state["topic"],
            objectives=state.get("objectives", ""),
            key_contents=state.get("key_contents", "")
        )
        print(f"  ✅ 퀴즈 {inserted}문제 DB 저장 완료 (quiz_question / quiz_choice)")
    else:
        print("  ⚠️  퀴즈 데이터 없음 — DB 저장 생략")

    print(f"  ✅ 저장 완료: {level_dir.relative_to(DATA_DIR)}/{step_label}_*")
    return {}