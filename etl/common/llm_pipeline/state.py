from typing import List, TypedDict

class State(TypedDict):
    # 입력
    tech_name: str          # 기술명 (e.g. "postgresql")
    step: str               # 커리큘럼 step 번호
    topic: str              # 주제
    objectives: str         # 학습목표
    key_contents: str       # 핵심 내용
    urls: List[str]         # 자료 생성 시 참고 URL 목록 (JSON의 tech 레벨 URL 전체)

    # 중간 처리 필드 없음 — PGVector에 미리 인덱싱되어 있음

    # 생성물
    beginner_material: str   # 초급자용 강의자료
    advanced_material: str   # 경력자용 강의자료
    quiz: str               # 전체 문제 (초급+중급+고급)

    # 검수 결과
    beginner_review: str
    advanced_review: str

    # 설정
    skip_review: bool