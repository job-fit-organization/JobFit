# RAG

- LLM이 답변을 생성할 때 참고할 수 있는 자료를 제공해서 답변의 정확도를 높이는 기술

## Naive RAG

- LLM에게 질문과 함께 관련 문서를 제공
- LangChain을 사용하면 chain을 생성할 때 prompt에 관련 문서를 추가해서 LLM에게 전달

### 어떤 문서를 제공할 것인가?

- 단순히 내가 가진 문서를 줄 수도 있지만, 매번 관련 문서를 찾아서 제공하는 것은 비효율적
- 따라서 미리 문서를 처리해서 저장해두고, 질문이 오면 그 질문과 가장 관련성이 높은 문서를 찾아서 제공

### 그럼 문서를 어떻게 처리해서 저장해둘 것인가?

- SQL DB는 정형화된 데이터를 저장하기에 적합하나, 문서와 같이 비정형 데이터를 저장하기에는 적합하지 않음
- 또한, 입력된 질문과 가장 관련성이 높은 문서를 찾기 위한 방법이 필요
- 이를 해결하기 위해 문서를 임베딩 벡터로 변환해서 저장하는 벡터 DB를 사용
- 입력된 질문도 임베딩 벡터로 변환하면 벡터 DB에서 유사한 벡터를 가진 문서를 찾을 수 있음

> 1. 문서 등의 비정형 데이터를 불러와 임베딩 벡터로 변환하여 벡터 DB에 저장
> 2. 사용자가 질문을 하면, 질문을 임베딩 벡터로 변환하여 벡터 DB에서 유사한 벡터를 가진 문서를 찾는 탐색기(Retriever)
> 3. LLM에게 전달하는 prompt에 검색된 문서를 추가: {context}
> 4. LLM은 입력된 질문과 검색된 {context}를 참고하여 답변 생성

## 1. 비정형 데이터를 벡터 DB에 저장하기

### 1-1. 저장할 데이터 불러오기

- LangChain에서 제공하는 DocumentLoader를 사용하면 다양한 형식의 데이터를 불러올 수 있다.
- 다양한 소스로부터 불러온 데이터는 `Document` 객체로 변환하여 다룬다.

> Document 객체
```python
from langchain_core.documents import Document

# page_content: 문서 내용
# metadata: 문서의 메타 데이터 정보를 담고 있는 딕셔너리
doc = Document(page_content="Hello World", metadata={"source": "https://example.com"})

print(len(doc))
>>> 1

# Document 객체의 데이터는 .연산자로 접근 가능
print(doc.page_content, doc.metadata)
>>> Hello World, {'source': 'https://example.com'}
```

> 텍스트 파일 -> TextLoader -> List[Document]
```python
from langchain_community.document_loaders import TextLoader

loader = TextLoader("example.txt", encoding='utf-8')
documents = loader.load()

```

> JSON 파일 -> JSONLoader

> CSV 파일 -> CSVLoader

> 웹 페이지 -> WebBaseLoader

> PDF 파일 -> PDFLoader