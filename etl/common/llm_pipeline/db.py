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
        dbname=os.getenv("PG_DB", "jobfit"),
        user=os.getenv("PG_USER", "admin"),
        password=os.getenv("PG_PASSWORD", "admin1234"),
    )


def save_quiz_to_db(
    quiz_items: List[Dict[str, Any]],
    skill: str,
    level: str,
    step: str,
    topic: str,
    objectives: str = "",
    key_contents: str = ""
) -> int:
    """
    파싱된 퀴즈 목록을 DB에 삽입한다.

    rdb_schema.sql 구조에 따라 Skill과 Curriculum 레코드를 확인/생성한 뒤,
    해당 curriculum_id를 외래키로 하여 QuizQuestion과 QuizChoice를 삽입합니다.
    """
    if not quiz_items:
        return 0

    conn = _get_connection()
    inserted = 0
    try:
        with conn:
            with conn.cursor() as cur:
                # 1) Skill 테이블 조회 또는 생성
                cur.execute(
                    "SELECT id FROM Skill WHERE skill_name = %s AND skill_level = %s",
                    (skill, level)
                )
                skill_res = cur.fetchone()
                if skill_res:
                    skill_id = skill_res[0]
                else:
                    cur.execute(
                        "INSERT INTO Skill (skill_name, skill_desc, skill_level) VALUES (%s, %s, %s) RETURNING id",
                        (skill, f"{skill} ({level}) 관련 기술", level)
                    )
                    skill_id = cur.fetchone()[0]

                # 2) Curriculum 테이블 조회 또는 생성
                curriculum_step_val = f"{skill}_{step}"
                cur.execute(
                    "SELECT id FROM Curriculum WHERE skill_id = %s AND curriculum_step = %s",
                    (skill_id, curriculum_step_val)
                )
                curr_res = cur.fetchone()
                if curr_res:
                    curriculum_id = curr_res[0]
                else:
                    cur.execute(
                        """
                        INSERT INTO Curriculum (skill_id, curriculum_step, topic, objectives, key_contents)
                        VALUES (%s, %s, %s, %s, %s)
                        RETURNING id
                        """,
                        (skill_id, curriculum_step_val, topic, objectives, key_contents)
                    )
                    curriculum_id = cur.fetchone()[0]

                # 3) 퀴즈 데이터 삽입 (QuizQuestion, QuizChoice)
                for item in quiz_items:
                    cur.execute(
                        """
                        INSERT INTO QuizQuestion (curriculum_id, difficulty, question)
                        VALUES (%s, %s, %s)
                        RETURNING id
                        """,
                        (
                            curriculum_id,
                            item.get("difficulty", "medium"),
                            item["question"],
                        ),
                    )
                    question_id = cur.fetchone()[0]

                    # 4) QuizChoice 삽입 (4개 선지)
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
                        INSERT INTO QuizChoice (question_id, choice_no, choice_text, is_correct, explanation)
                        VALUES %s
                        """,
                        choices_data,
                    )
                    inserted += 1
    finally:
        conn.close()

    return inserted
