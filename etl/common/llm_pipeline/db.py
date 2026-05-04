"""
퀴즈 데이터를 PostgreSQL에 삽입하는 모듈.

테이블 스키마는 database/quiz.sql 에서 관리합니다.
이 모듈은 ETL 파이프라인에서 생성된 퀴즈를 DB에 적재하는 역할만 담당합니다.
"""
import os
import psycopg2
from psycopg2.extras import execute_values
from typing import List, Dict, Any


def _get_connection():
    """환경변수에서 PostgreSQL 접속 정보를 읽어 연결을 반환한다."""
    return psycopg2.connect(
        host=os.getenv("PG_HOST", "localhost"),
        port=int(os.getenv("PG_PORT", "5432")),
        dbname=os.getenv("PG_DB", "jobfit_pgvector"),
        user=os.getenv("PG_USER", "admin"),
        password=os.getenv("PG_PASSWORD", "admin1234"),
    )


def save_quiz_to_db(
    quiz_items: List[Dict[str, Any]],
    skill: str,
    level: str,
    step: str,
    topic: str,
) -> int:
    """
    파싱된 퀴즈 목록을 DB에 삽입한다.

    테이블이 존재하지 않으면 psycopg2.errors.UndefinedTable 예외가 발생합니다.
    테이블 생성은 database/quiz.sql 을 먼저 실행하세요.

    Parameters
    ----------
    quiz_items : LLM이 출력한 파싱된 문제 리스트
        각 항목 구조:
        {
          "difficulty": "easy" | "medium" | "hard",
          "question": str,
          "choices": [{"no": int, "text": str}, ...],   # 4개
          "answer": int,          # 정답 no (1~4)
          "explanation": str
        }
    skill, level, step, topic : 메타데이터

    Returns
    -------
    int : 삽입된 문제 수
    """
    if not quiz_items:
        return 0

    conn = _get_connection()
    inserted = 0
    try:
        with conn:
            with conn.cursor() as cur:
                for item in quiz_items:
                    # 1) quiz_question 삽입
                    cur.execute(
                        """
                        INSERT INTO quiz_question (skill, level, step, topic, difficulty, question)
                        VALUES (%s, %s, %s, %s, %s, %s)
                        RETURNING id
                        """,
                        (
                            skill,
                            level,
                            step,
                            topic,
                            item.get("difficulty", "medium"),
                            item["question"],
                        ),
                    )
                    question_id = cur.fetchone()[0]

                    # 2) quiz_choice 삽입 (4개 선지)
                    answer_no = item.get("answer", -1)
                    explanation = item.get("explanation", "")
                    choices_data = [
                        (
                            question_id,
                            c["no"],
                            c["text"],
                            c["no"] == answer_no,
                            explanation if c["no"] == answer_no else None,
                        )
                        for c in item.get("choices", [])
                    ]
                    execute_values(
                        cur,
                        """
                        INSERT INTO quiz_choice (question_id, choice_no, choice_text, is_correct, explanation)
                        VALUES %s
                        """,
                        choices_data,
                    )
                    inserted += 1
    finally:
        conn.close()

    return inserted
