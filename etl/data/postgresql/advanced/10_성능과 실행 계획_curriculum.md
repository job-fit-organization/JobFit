```markdown
# 📚 PostgreSQL 성능과 실행 계획

## 참고 링크
- [PostgreSQL 튜토리얼](https://neon.com/postgresql/tutorial)
- [PostgreSQL 시작하기](https://neon.com/postgresql/postgresql-getting-started)
- [PostgreSQL 실행 계획](https://neon.com/postgresql/postgresql-tutorial/postgresql-explain)
- [PostgreSQL 쿼리 최적화](https://neon.com/postgresql/postgresql-tutorial/postgresql-select)

---

## 슬라이드 1: 강의 개요 🗂️
- **주제**: 성능과 실행 계획
- **목표**: EXPLAIN으로 쿼리 성능 분석
- **핵심 내용**
  - EXPLAIN 사용법
  - 실행 계획 해석
  - 쿼리 개선 방법

---

## 슬라이드 2: EXPLAIN 기본 사용법 🔍
- EXPLAIN 명령어를 사용하여 쿼리의 실행 계획을 확인할 수 있습니다.
- 기본 구문:
  ```sql
  EXPLAIN SELECT * FROM 테이블명 WHERE 조건;
  ```
- 예시:
  ```sql
  EXPLAIN SELECT * FROM employees WHERE department_id = 5;
  ```

---

## 슬라이드 3: 실행 계획 해석 📝
- 출력 결과 해석:
  - **Seq Scan**: 시퀀셜 스캔, 전체 테이블 스캔
  - **Index Scan**: 인덱스를 사용한 스캔
  - **Join**: 다양한 조인 방식 (Nested Loop, Hash Join 등)
- 각 노드의 **COST** 값 확인하기
  - `COST`는 예상 실행 비용을 나타냅니다.

---

## 슬라이드 4: 성능 개선의 시작점 🚀
- 느린 쿼리의 원인:
  - 인덱스 부족
  - 비효율적인 조인
  - 불필요한 데이터 선택
- 개선 방법:
  - 적절한 인덱스 추가
  - 쿼리 재작성

---

## 슬라이드 5: 예제 1 - 인덱스 활용 🔑
- 인덱스 추가 전후 비교
  ```sql
  -- 인덱스 없는 쿼리
  EXPLAIN SELECT * FROM orders WHERE customer_id = 123;

  -- 인덱스 추가 후
  CREATE INDEX idx_customer ON orders (customer_id);
  EXPLAIN SELECT * FROM orders WHERE customer_id = 123;
  ```

---

## 슬라이드 6: 예제 2 - 조인 최적화 🔄
- 조인 최적화 예시
  ```sql
  -- 비효율적인 조인
  EXPLAIN SELECT a.*, b.* FROM table_a a, table_b b WHERE a.id = b.a_id;

  -- 최적화된 조인
  EXPLAIN SELECT a.*, b.* FROM table_a a INNER JOIN table_b b ON a.id = b.a_id;
  ```

---

## 슬라이드 7: EXPLAIN ANALYZE의 활용 📊
- 실제 실행 통계 확인
  ```sql
  EXPLAIN ANALYZE SELECT * FROM products WHERE price > 100;
  ```
- `ANALYZE`를 사용하면 실제 실행 시간과 노드별 소요 시간 확인 가능

---

## 슬라이드 8: 성능 트레이드오프 ⚖️
- 인덱스 추가의 장단점:
  - **장점**: 빠른 검색 속도
  - **단점**: 쓰기 성능 저하
- 쿼리 최적화 시 고려해야 할 요소들

---

## 슬라이드 9: 성능 모니터링 도구 🔧
- PostgreSQL 성능 모니터링 도구 소개
  - pgAdmin
  - pg_stat_statements
- 성능 모니터링을 통해 지속적인 최적화 필요

---

## 슬라이드 10: 질의응답 및 결론 ❓
- 질의응답 시간
- 핵심 요약:
  - EXPLAIN으로 쿼리 분석
  - 실행 계획 해석 및 최적화 방법
  - 성능 개선의 지속적인 노력 필요
```
