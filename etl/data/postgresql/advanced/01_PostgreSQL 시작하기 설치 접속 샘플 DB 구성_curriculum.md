
# PostgreSQL 심화 강의 자료

## 참고 링크
- [PostgreSQL 시작하기](https://neon.com/postgresql/postgresql-getting-started)
- [PostgreSQL 튜토리얼](https://neon.com/postgresql/tutorial)
- [PostgreSQL 샘플 데이터베이스](https://neon.com/postgresql/postgresql-tutorial/postgresql-sample-database)
- [PostgreSQL 설치 가이드](https://neon.com/postgresql/postgresql-getting-started/install-postgresql/)

---

## 슬라이드 1: 제목 슬라이드 🎓
### PostgreSQL 심화: 내부 동작 원리, 성능 최적화, 트레이드오프
- 강의자: [이름]
- 날짜: [날짜]

---

## 슬라이드 2: PostgreSQL의 내부 동작 원리 🧠
### PostgreSQL 아키텍처
- **클라이언트-서버 모델**: 클라이언트가 SQL 쿼리를 보내고, 서버가 처리하여 응답.
- **프로세스 모델**: 각 요청에 대해 새로운 프로세스를 생성하여 사용자 쿼리를 처리.

---

## 슬라이드 3: 데이터 저장 구조 📂
### 데이터베이스, 테이블, 인덱스
- **테이블**: 행(row)과 열(column)로 구성.
- **인덱스**: 데이터 검색 속도 향상.
  - 예: `CREATE INDEX idx_name ON table_name(column_name);`

---

## 슬라이드 4: 성능 최적화 기법 ⚙️
### 쿼리 성능 개선
- **EXPLAIN**: 쿼리 실행 계획을 분석. 
  ```sql
  EXPLAIN ANALYZE SELECT * FROM table_name WHERE condition;
  ```
- **인덱스 활용**: 적절한 인덱스 생성.
- **JOIN 최적화**: INNER JOIN과 LEFT JOIN을 적절히 활용.

---

## 슬라이드 5: 트레이드오프 이해 ⚖️
### 성능 vs. 데이터 무결성
- **정규화**: 데이터 중복 제거, 무결성 보장.
- **비정규화**: 성능 향상, 쿼리 단순화.
- 예: `SELECT * FROM orders JOIN customers ON orders.customer_id = customers.id;`

---

## 슬라이드 6: 트랜잭션 관리 🛠️
### ACID 속성
- **Atomicity**: 모든 작업이 완료되거나 전혀 수행되지 않음.
- **Consistency**: 데이터의 일관성을 보장.
- **Isolation**: 각 트랜잭션이 독립적으로 실행됨.
- **Durability**: 성공적으로 수행된 트랜잭션은 영구 저장됨.
  ```sql
  BEGIN;
  INSERT INTO table_name (column1, column2) VALUES (value1, value2);
  COMMIT;
  ```

---

## 슬라이드 7: 샘플 데이터베이스 활용 📊
### dvdrental 데이터베이스
- **구성**: 영화, 배우, 고객 데이터 포함.
- **쿼리 예제**:
  ```sql
  SELECT title, release_year FROM film WHERE release_year > 2000 ORDER BY release_year;
  ```

---

## 슬라이드 8: JSON 및 배열 처리 📄
### PostgreSQL의 JSONB 데이터 타입
- **장점**: 비정형 데이터 저장 및 쿼리 가능.
- 예: 
  ```sql
  SELECT * FROM table_name WHERE json_column->>'key' = 'value';
  ```

---

## 슬라이드 9: 고급 쿼리 기법 🔍
### 서브쿼리와 CTE
- **서브쿼리**: 쿼리 내에 포함된 쿼리.
- **CTE (Common Table Expressions)**: 가독성 향상을 위한 임시 결과 집합.
  ```sql
  WITH temp AS (
      SELECT * FROM table_name WHERE condition
  )
  SELECT * FROM temp WHERE another_condition;
  ```

---

## 슬라이드 10: 결론 및 Q&A 📞
### 요약
- PostgreSQL의 내부 동작 원리 및 성능 최적화 기법 익히기.
- 실무에서의 쿼리 최적화 및 데이터 관리 방법론.
- 질문 및 의견 공유 시간.
```
