from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_postgres import PGVector
from dotenv import load_dotenv

load_dotenv()

CONNECTION_STRING="postgresql://admin:admin1234@localhost:5432/jobfit_pgvector"

_embeddings = OpenAIEmbeddings(model="text-embedding-3-small")

def __get_context(query:str, collection_name: str, k: int = 6):
    """컬렉션명 규칙: {tech_name}"""
    store = PGVector(
        embeddings=_embeddings,
        collection_name=collection_name,
        connection=CONNECTION_STRING,
        use_jsonb=True,
    )
    retriever =  store.as_retriever(search_kwargs={"k": k})
    docs = retriever.invoke(query)
    return "\n\n".join(
        f"[출처: {d.metadata.get('source', '?')}]\n{d.page_content}"
        for d in docs
    )