from langgraph.graph import StateGraph, START, END
from common.llm_pipeline.state import State
from common.llm_pipeline.nodes import (
    generate_material_node,
    generate_quiz_node,
    review_material_node,
    revise_material_node,
    save_files_node,
)

def build_graph() -> StateGraph:
    workflow = StateGraph(State)

    # 노드 등록
    workflow.add_node("material", generate_material_node)
    workflow.add_node("review", review_material_node)
    workflow.add_node("revise", revise_material_node)
    workflow.add_node("quiz", generate_quiz_node)
    workflow.add_node("save", save_files_node)

    # 엣지 연결: material -> review -> revise -> quiz -> save
    workflow.add_edge(START, "material")
    workflow.add_edge("material", "review")
    workflow.add_edge("review", "revise")
    workflow.add_edge("revise", "quiz")
    workflow.add_edge("quiz", "save")
    workflow.add_edge("save", END)

    return workflow.compile()