from typing import Any, Dict, List, TypedDict, Literal

class State(TypedDict):
    # 입력
    skill_name: str          # 기술명 (e.g. "postgresql")
    level: Literal["beginner", "advanced"]  # 학습 난이도 (skill의 레벨)
    step: str               # 커리큘럼 step 번호
    topic: str              # 주제
    objectives: str         # 학습목표
    key_contents: str       # 핵심 내용
    urls: List[str]         # 자료 생성 시 참고 URL 목록 (JSON의 URL 전체)

    # 중간 처리 필드 없음 — PGVector에 미리 인덱싱되어 있음

    # 생성물
    material: str           # 강의자료
    quiz: List[Dict[str, Any]]  # 파싱된 문제 목록 (각 항목: question/choices/answer/explanation/difficulty)

    # 검수 결과
    review: str

    # 설정
    skip_review: bool