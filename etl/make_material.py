import os
os.environ["USER_AGENT"] = "web-agent"

from dotenv import load_dotenv
load_dotenv()

from langchain_community.document_loaders import WebBaseLoader
from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START, END

# 1. 상태 정의 (State)
# 각 노드를 거치면서 채워질 데이터의 구조를 정의합니다.
class LectureState(TypedDict):
    page_text: str
    beginner_lecture: str
    advanced_lecture: str
    examples: str

# 2. 전역 LLM 인스턴스
llm = ChatOllama(model="gemma4:e4b")
# llm = ChatGroq(
#     model="openai/gpt-oss-120b"
# )

# 3. 노드 함수들 (Nodes)
def generate_beginner_node(state: LectureState):
    print("💡 [Node: Beginner] 비전공자용 강의자료 생성 중...")
    prompt = ChatPromptTemplate.from_template(
        "너는 IT 교육 전문가야. 다음 내용을 바탕으로 '개발을 처음 배우는 학생 및 비전공자'를 위한 강의자료를 만들어줘.\n"
        "자세한 원리보다는 사용법과 핵심 개념 위주로 설명하며, 10장 이내의 PPT 슬라이드 형태(마크다운)로 작성해.\n\n본문:\n{page_text}"
    )
    chain = prompt | llm | StrOutputParser() # LCEL Chain 문법
    return {"beginner_lecture": chain.invoke({"page_text": state["page_text"]})}

def generate_advanced_node(state: LectureState):
    print("💡 [Node: Advanced] 전공자용 강의자료 생성 중...")
    prompt = ChatPromptTemplate.from_template(
        "너는 IT 교육 전문가야. 다음 내용을 바탕으로 '개발이 익숙한 학생 및 전공자'를 위한 강의자료를 만들어줘.\n"
        "깊이 있는 원리와 아키텍처 중심의 내용을 포함하여, 10장 이내의 PPT 슬라이드 형태(마크다운)로 구성해.\n\n본문:\n{page_text}"
    )
    chain = prompt | llm | StrOutputParser()
    return {"advanced_lecture": chain.invoke({"page_text": state["page_text"]})}

def generate_examples_node(state: LectureState):
    print("💡 [Node: Examples] 실습 예제 생성 중...")
    prompt = ChatPromptTemplate.from_template(
        "너는 IT 교육 전문가야. 다음 내용을 바탕으로 '상', '중', '하' 세 가지 난이도의 4지선다 객관식 실습 예제와 정답을 작성해줘.\n"
        "각 난이도별 문제의 비율은 상:중:하 = 25:50:25 로 구성해줘.\n"
        "문제의 형태는 마크다운 형식이며, 문서 최상단에 '※ 안내: 비전공자에게는 중/하 난이도를, 전공자에게는 상/중 난이도의 문제를 권장합니다.'라는 문구를 반드시 넣어.\n\n본문:\n{page_text}"
    )
    chain = prompt | llm | StrOutputParser()
    return {"examples": chain.invoke({"page_text": state["page_text"]})}

def save_files_node(state: LectureState):
    print("💾 [Node: Save] 생성된 문서 파일로 저장 중...")
    
    with open("lecture_beginner.md", "w", encoding="utf-8") as f:
        f.write(state.get("beginner_lecture", ""))
        
    with open("lecture_advanced.md", "w", encoding="utf-8") as f:
        f.write(state.get("advanced_lecture", ""))
        
    with open("lecture_examples.md", "w", encoding="utf-8") as f:
        f.write(state.get("examples", ""))
        
    print("✅ 모든 파일(비전공자용, 전공자용, 실습예제)이 성공적으로 분리 저장되었습니다.")
    return state # 상태 그대로 반환

# 4. 메인 실행 함수
def main():
    print("🌐 웹페이지 데이터를 로드합니다...")
    loader = WebBaseLoader("https://docker-curriculum.com/")
    docs = loader.load()
    page_text = docs[0].page_content

    # 'Comment' 텍스트 이전까지만 슬라이싱
    comment_index = page_text.find('Comment')
    if comment_index != -1:
        page_text = page_text[:comment_index]

    # --- LangGraph 그래프 구성 ---
    workflow = StateGraph(LectureState)

    # 노드 추가 (어떤 작업을 할지 정의)
    workflow.add_node("beginner", generate_beginner_node)
    workflow.add_node("advanced", generate_advanced_node)
    workflow.add_node("examples", generate_examples_node)
    workflow.add_node("save", save_files_node)

    # 엣지 연결 (어떤 순서로 흐를지 정의: 순차 파이프라인 형태)
    workflow.add_edge(START, "beginner")
    workflow.add_edge("beginner", "advanced")
    workflow.add_edge("advanced", "examples")
    workflow.add_edge("examples", "save")
    workflow.add_edge("save", END)

    # 그래프 컴파일
    app = workflow.compile()

    print("\n🚀 LangGraph 기반 문서 생성 파이프라인 시동!\n")
    # 그래프 실행 (초기 상태 state["page_text"] 주입)
    app.invoke({"page_text": page_text})

if __name__ == "__main__":
    main()