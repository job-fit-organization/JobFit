# Neo4j

- property graph를 사용하는 그래프 데이터베이스
    - node -> label, node_property
    - relationship -> type, relationship_property

- Cypher: Neo4j의 쿼리 언어
    - SQL보다 관계 표현이 직관적이고 간결하다
    - SQL의 `SELECT * FROM people`은 Cypher로 `MATCH (p:Person) RETURN p`와 같이 작성
        - RETURN이 SQL의 SELECT에 대응
        - MATCH이 SQL의 FROM에 대응
    - label이 Person인 노드들을 모두 가져온다
    - 노드 간의 관계 표현 예시: `(p:Person)-[:WORKS_AT]->(c:Company)`
        - 여기서 노드가 ()로 표현되는데, `p`와 `c`는 변수, `:` 뒷부분이 레이블
        - 화살표가 관계이며, [] 안에서 `:` 뒷부분에 관계의 타입을 명시
        - 화살표 방향에 따라 관계의 방향이 존재함
    - 경로 탐색이 가능하다!
        - `[*1]`: 1-hop 이웃을 의미
        - `[*2]`: 2-hop 이웃을 의미
        - `[*1..2]`: 1-hop 부터 2-hop 까지의 이웃을 의미
        - `[*]`: 무제한
        - [] 앞뒤로 < 또는 >를 붙여서 관계의 방향성을 지정할 수 있음
        - `shortestPath()`: 최단 경로 탐색 함수

- GDS (Graph Data Science) 라이브러리
    - 그래프 알고리즘, 그래프 임베딩, GNN 지원 / 성능 최적화도 지원? 거대한 전체 그래프에서 내가 필요한 노드와 관계들만 지정해서 가져올 수 있기 때문
    - Neo4j에 구축한 그래프 데이터를 메모리에 올리기 위해 필요함
        - 그래프 RAG를 구현한다고 했을 때, 그래프 임베딩을 연산하려면 GDS로 그래프 데이터를 메모리로 가져와서 연산한 후에 다시 Neo4j에 저장하는 방식

# KAG (Knowledge Augmented Generation), GraphRAG

- 벡터DB는 문서 간의 연결성, 관계는 반영하지 못한다. (개별 문서 수준에서만 유사도 계산)
- GraphRAG는 이를 보완하기 위해 그래프 데이터베이스에서 사용자 질의에 관련된 정보를 탐색하여 답변 생성에 활용하는 방식
- 연결 관계로 인해 정보의 맥락이 보존되기 때문에, 복잡한 질문에도 효과적으로 답변할 수 있다.

## GraphRAG 구현 방법

### 1. 그래프 DB 구축

- 노드, 관계 설계
- Neo4j 연결 객체를 만들고, Cypher 쿼리를 사용해 데이터를 그래프 형태(노드 & 관계)로 삽입

### 2. Retriever

- 벡터DB에서 벡터를 검색하듯, Cypher 쿼리를 사용해서 그래프에서 노드와 관계를 탐색한다.
- 다만, 벡터DB에서는 자연어 질문을 벡터로 변환하고 유사도를 계산하여 검색하는 것이 가능한 반면, 그래프에서는 검색을 위해 Cypher 쿼리를 사용하므로, 자연어 질문을 Cypher 쿼리로 변환하는 과정이 핵심!
- Cypher 쿼리로 Neo4j를 탐색하는 과정은 tool로 구현! 왜냐하면 어쨌든 외부 도구(Neo4j)를 사용하는 것이니까, 그리고 SQL DB를 조회하는 것도 tool로 구현했었음

### 3. Generate

- 검색된 노드와 관계들을 바탕으로 답변 생성
- 위에서 정의한 tool을 사용할건데, 사용자 질의가 주어지면 여러 개의 그래프 탐색 도구 중 적절한 도구를 선택해서 실행 -> ReAct Agent 방식