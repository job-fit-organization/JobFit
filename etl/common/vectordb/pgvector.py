from .loader import do_crawl

from typing import List
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_postgres import PGVector

from dotenv import load_dotenv

load_dotenv()

_embedding = OpenAIEmbeddings(model="text-embedding-3-small")
CONNECTION_STRING="postgresql://admin:admin1234@localhost:5432/jobfit_pgvector"

def create_pgvector_db(collection_name: str, urls: List[str], force: bool=True) -> int:
    # 링크들을 하나씩 크롤링해서 문서화(로드)
    raw_docs = do_crawl(urls)
    if not raw_docs:
        print("크롤링된 결과가 없습니다.")
        return 0
    
    # 불러온 문서 적절히 분할
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=800, chunk_overlap=100,
        separators=["\n\n", "\n", ". ", " ", ""]
    )
    docs = splitter.split_documents(raw_docs)
    print(f"  📦 {len(raw_docs)}개 문서 → {len(docs)}개 청크")

    # 임베딩 및 벡터 DB 적재
    vectorstore = PGVector(
        connection_string=CONNECTION_STRING,
        embeddings=_embedding,
        collection_name=collection_name,
        pre_delete_collection=force,
        use_jsonb=True,
    )
    vectorstore.add_documents(docs)
    print(f"  🔷 PGVector '{collection_name}' 저장 완료 ({len(docs)}청크)")