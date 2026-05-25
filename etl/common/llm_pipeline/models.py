from langchain_openai import ChatOpenAI
from dotenv import load_dotenv

load_dotenv()

def __get_generate_llm(model_nm: str):
    return ChatOpenAI(
        model=model_nm,
        temperature=0.7,
    )

def __get_review_llm(model_nm: str):
    return ChatOpenAI(
        model=model_nm,
        temperature=0.2,
    )