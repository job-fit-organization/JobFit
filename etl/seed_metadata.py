import os
import psycopg2
from dotenv import load_dotenv

# LLM을 활용해 설명을 자동 생성하기 위한 모듈
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from common.llm_pipeline.models import __get_review_llm

load_dotenv()

def _get_connection():
    return psycopg2.connect(
        host=os.getenv("PG_HOST", "localhost"),
        port=int(os.getenv("PG_PORT", "5432")),
        dbname=os.getenv("PG_DB", "jobfit"),
        user=os.getenv("PG_USER", "admin"),
        password=os.getenv("PG_PASSWORD", "admin1234"),
    )

def generate_desc(name: str, context_type: str) -> str:
    """LLM을 이용해 직무 또는 기술에 대한 짧은 설명을 생성합니다."""
    prompt = ChatPromptTemplate.from_template(
        "당신은 IT 커리어 컨설턴트입니다. '{name}' {context_type}에 대해 초보자도 이해할 수 있도록 2~3문장으로 핵심만 요약해 설명해주세요."
    )
    llm = __get_review_llm(os.getenv("REVIEW_MODEL", "gpt-5.4-mini"))
    chain = prompt | llm | StrOutputParser()
    
    print(f"[{context_type}] {name} 설명 생성 중...")
    return chain.invoke({"name": name, "context_type": context_type}).strip()

def seed_metadata():
    conn = _get_connection()
    try:
        with conn:
            with conn.cursor() as cur:
                # ======================================================
                # 1. 직무(Job) 데이터 정의 및 적재
                # ======================================================
                jobs_data = ["AI Agent", "Data Scientist"]
                job_id_map = {}
                
                print("\n🚀 [1] 직무(Job) 데이터 적재 시작...")
                for job_name in jobs_data:
                    cur.execute("SELECT id FROM Job WHERE job_name = %s", (job_name,))
                    res = cur.fetchone()
                    if res:
                        job_id_map[job_name] = res[0]
                        print(f"  - {job_name}: 이미 존재 (ID: {res[0]})")
                    else:
                        job_desc = generate_desc(job_name, "직무")
                        cur.execute(
                            "INSERT INTO Job (job_name, job_desc) VALUES (%s, %s) RETURNING id",
                            (job_name, job_desc)
                        )
                        job_id_map[job_name] = cur.fetchone()[0]
                        print(f"  - {job_name}: 생성 완료 (ID: {job_id_map[job_name]})")

                # ======================================================
                # 2. 기술(Skill) 데이터 정의 및 적재
                # ======================================================
                skills_data = [
                    # 공통
                    {"name": "postgresql", "level": "beginner"},
                    {"name": "python", "level": "beginner"},
                    {"name": "github", "level": "beginner"},
                    {"name": "linux", "level": "advanced"},
                    {"name": "docker", "level": "advanced"},
                    {"name": "aws", "level": "advanced"},
                    # AI Agent
                    {"name": "langchain", "level": "beginner"},
                    {"name": "rag", "level": "beginner"},
                    {"name": "mcp", "level": "advanced"},
                    {"name": "a2a", "level": "advanced"},
                    # Data Scientist
                    {"name": "pandas", "level": "beginner"},
                    {"name": "matplotlib", "level": "beginner"},
                    {"name": "seaborn", "level": "beginner"},
                    {"name": "ml", "level": "beginner"},
                    {"name": "timeseries", "level": "beginner"},
                    {"name": "pytorch", "level": "advanced"},
                    {"name": "huggingface", "level": "advanced"}
                ]
                skill_id_map = {}

                print("\n🚀 [2] 기술(Skill) 데이터 적재 시작...")
                for skill in skills_data:
                    s_name = skill["name"]
                    s_level = skill["level"]
                    cur.execute("SELECT id FROM Skill WHERE skill_name = %s", (s_name,))
                    res = cur.fetchone()
                    if res:
                        skill_id_map[s_name] = res[0]
                        print(f"  - {s_name}: 이미 존재 (ID: {res[0]})")
                    else:
                        skill_desc = generate_desc(s_name, "IT 기술/프레임워크")
                        cur.execute(
                            "INSERT INTO Skill (skill_name, skill_desc, skill_level) VALUES (%s, %s, %s) RETURNING id",
                            (s_name, skill_desc, s_level)
                        )
                        skill_id_map[s_name] = cur.fetchone()[0]
                        print(f"  - {s_name}: 생성 완료 (ID: {skill_id_map[s_name]})")

                # ======================================================
                # 3. 로드맵 트리(Roadmap) 적재 (직무별 선후관계)
                # ======================================================
                # 공통 기술 트리 (루트는 None)
                common_roadmaps = [
                    ("postgresql", None),
                    ("python", None),
                    ("github", None),
                    ("linux", "github"),    # github -> linux
                    ("docker", "linux"),    # linux -> docker
                    ("aws", "docker"),      # docker -> aws
                ]

                roadmaps_data = []
                
                # --- [AI Agent 로드맵 구성] ---
                # 1. 공통 스킬 추가
                for skill, parent in common_roadmaps:
                    roadmaps_data.append(("AI Agent", skill, parent))
                # 2. 특화 스킬 추가 (Python 기반 기술이므로 python 하위에 연결)
                roadmaps_data.extend([
                    ("AI Agent", "langchain", "python"),
                    ("AI Agent", "rag", "langchain"),
                    ("AI Agent", "mcp", "rag"),
                    ("AI Agent", "a2a", "mcp"),
                ])

                # --- [Data Scientist 로드맵 구성] ---
                # 1. 공통 스킬 추가
                for skill, parent in common_roadmaps:
                    roadmaps_data.append(("Data Scientist", skill, parent))
                # 2. 특화 스킬 추가 (마찬가지로 Python 하위에 연결)
                roadmaps_data.extend([
                    ("Data Scientist", "pandas", "python"),
                    ("Data Scientist", "matplotlib", "pandas"),
                    ("Data Scientist", "seaborn", "matplotlib"),
                    ("Data Scientist", "ml", "pandas"),            # pandas에서 ML 분기
                    ("Data Scientist", "timeseries", "ml"),
                    ("Data Scientist", "pytorch", "ml"),           # ML에서 PyTorch 분기
                    ("Data Scientist", "huggingface", "pytorch")
                ])

                print("\n🚀 [3] 트리형 로드맵(Roadmap) 데이터 적재 시작...")
                for job_name, skill_name, parent_skill_name in roadmaps_data:
                    job_id = job_id_map[job_name]
                    skill_id = skill_id_map[skill_name]
                    
                    parent_roadmap_id = None
                    if parent_skill_name:
                        p_skill_id = skill_id_map[parent_skill_name]
                        # 같은 직무 내에서 부모 스킬이 갖는 로드맵 ID 찾기
                        cur.execute(
                            "SELECT id FROM Roadmap WHERE job_id = %s AND skill_id = %s",
                            (job_id, p_skill_id)
                        )
                        p_res = cur.fetchone()
                        if p_res:
                            parent_roadmap_id = p_res[0]
                        else:
                            print(f"  ⚠️ 주의: {job_name}에서 {parent_skill_name} 로드맵 노드를 찾을 수 없어 루트로 지정됩니다.")

                    # 이미 삽입되었는지 확인
                    cur.execute(
                        "SELECT id FROM Roadmap WHERE job_id = %s AND skill_id = %s",
                        (job_id, skill_id)
                    )
                    if cur.fetchone():
                        print(f"  - [{job_name}] {skill_name}: 이미 맵핑됨")
                    else:
                        cur.execute(
                            "INSERT INTO Roadmap (job_id, skill_id, parent_roadmap_id) VALUES (%s, %s, %s)",
                            (job_id, skill_id, parent_roadmap_id)
                        )
                        parent_label = parent_skill_name if parent_skill_name else "ROOT(없음)"
                        print(f"  - [{job_name}] {skill_name} 맵핑 완료 (선행: {parent_label})")

                print("\n✨ 모든 메타데이터 초기화(Seed) 완료!")

    except Exception as e:
        print(f"❌ 데이터 적재 중 오류 발생: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    seed_metadata()
