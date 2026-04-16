import os
os.environ["USER_AGENT"] = "web-agent"

from dotenv import load_dotenv
load_dotenv()

from langchain_community.document_loaders import WebBaseLoader
from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from typing import List

from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START, END

class CurriculumState(TypedDict):
    page_text: str
    curriculum: List[str]

# 2. 전역 LLM 인스턴스
llm = ChatOllama(model="gemma4:e4b")

# 3. 노드 함수들 (Nodes)
def generate_curriculum_node(state: CurriculumState):
    print("💡 [Node: Curriculum] 커리큘럼 리스트 생성 중...")
    parser = JsonOutputParser()
    prompt = ChatPromptTemplate.from_template(
        "너는 IT 교육 전문가야. 다음 내용을 바탕으로 커리큘럼 항목들을 순서대로 도출해.\n"
        "절대 다른 부가 설명 없이 오직 JSON 배열(리스트) 형태로만 출력해.\n"
        "예시: [\"Introduction\", \"Commands\", \"Dockerfile and Images\"]\n\n"
        "본문:\n{page_text}"
    )
    chain = prompt | llm | parser # JsonOutputParser로 JSON을 파이썬 리스트로 변환
    return {"curriculum": chain.invoke({"page_text": state["page_text"]})}

def save_files_node(state: CurriculumState):
    print("💾 [Node: Save] 생성된 커리큘럼 파일로 저장 중...")
    
    with open("curriculum.md", "w", encoding="utf-8") as f:
        curriculum_list = state.get("curriculum", [])
        if isinstance(curriculum_list, list):
            # 파일에는 가독성을 위해 마크다운 리스트 형태로 저장
            f.write("\n".join(f"- {item}" for item in curriculum_list))
        else:
            f.write(str(curriculum_list))
        
    print("✅ 커리큘럼이 저장되었습니다.")
    return state # 상태 그대로 반환

# 4. 그래프 빌더
def build_curriculum_graph():
    """
    LangGraph 그래프 생성
    """
    # 상태 그래프 초기화
    workflow = StateGraph(CurriculumState)

    # 노드 추가
    workflow.add_node("generate_curriculum", generate_curriculum_node)
    workflow.add_node("save_files", save_files_node)

    # 시작점 설정
    workflow.add_edge(START, "generate_curriculum")
    workflow.add_edge("generate_curriculum", "save_files")
    workflow.add_edge("save_files", END)

    # 그래프 컴파일
    app = workflow.compile()
    return app

# 5. 메인 함수
def main():
    # 1. 데이터 로드
    url = "https://www.geeksforgeeks.org/devops/docker-tutorial/"
    # url = "https://docker-curriculum.com/"
    print(f"🌐 웹페이지 데이터를 로드합니다...")
    loader = WebBaseLoader(
        url,
        header_template={
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36"
        },
        verify_ssl=False,
        requests_kwargs={
            "timeout": 10
        }
    )
    docs = loader.load()
    page_text = docs[0].page_content
    
    # 'Comment' 텍스트 이전까지만 슬라이싱
    comment_index = page_text.find('Comment')
    if comment_index != -1:
        page_text = page_text[:comment_index]

    print(f"\n🚀 LangGraph 기반 문서 생성 파이프라인 시동!")

    # 그래프 생성
    app = build_curriculum_graph()

    # 그래프 실행
    result = app.invoke({"page_text": page_text})

    # 결과 출력
    print("\n" + "="*60)
    print("✅ 커리큘럼 생성 완료!")
    print("="*60)
    print(result["curriculum"])
    print("="*60)

if __name__ == "__main__":
    main()