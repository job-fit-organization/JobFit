from langgraph.graph import StateGraph, START, END
from common.llm_pipeline.state import State
from common.llm_pipeline.nodes import (
    generate_beginner_material_node, 
    generate_advanced_material_node,
    generate_quiz_node,
    review_beginner_node,
    review_advanced_node,
    save_files_node,
)

def build_graph() -> StateGraph:
    workflow = StateGraph(State)

    # 노드 등록
    workflow.add_node("beginner_material", generate_beginner_material_node)
    workflow.add_node("advanced_material", generate_advanced_material_node)
    workflow.add_node("quiz", generate_quiz_node)
    workflow.add_node("review_beginner", review_beginner_node)
    workflow.add_node("review_advanced", review_advanced_node)
    workflow.add_node("save", save_files_node)

    # 엣지 연결
    workflow.add_edge(START, "beginner_material")
    workflow.add_edge("beginner_material", "advanced_material")
    workflow.add_edge("advanced_material", "quiz")
    workflow.add_edge("quiz", "review_beginner")
    workflow.add_edge("review_beginner", "review_advanced")
    workflow.add_edge("review_advanced", "save")
    workflow.add_edge("save", END)

    return workflow.compile()