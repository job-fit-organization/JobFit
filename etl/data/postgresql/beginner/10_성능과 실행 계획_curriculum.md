```markdown
# 강의자료: 성능과 실행 계획 📊

## 참고 링크
- [PostgreSQL Tutorial](https://neon.com/postgresql/tutorial)
- [Getting Started with PostgreSQL](https://neon.com/postgresql/postgresql-getting-started)
- [What is PostgreSQL?](https://neon.com/postgresql/postgresql-tutorial/postgresql-what-is-postgresql)
- [Sample Database in PostgreSQL](https://neon.com/postgresql/postgresql-tutorial/postgresql-sample-database)
- [Install PostgreSQL](https://neon.com/postgresql/postgresql-getting-started/install-postgresql/)
- [Connect to PostgreSQL Database](https://neon.com/postgresql/postgresql-getting-started/connect-to-postgresql-database)
- [Using EXPLAIN in PostgreSQL](https://neon.com/postgresql/postgresql-tutorial/postgresql-explain)

---

## 슬라이드 1: 강의 개요 📋
- 주제: 성능과 실행 계획
- 목표: EXPLAIN을 통해 느린 쿼리의 실행 계획 해석
- 핵심 내용: EXPLAIN, 실행 계획 해석, 쿼리 개선

---

## 슬라이드 2: EXPLAIN이란? ❓
- EXPLAIN은 SQL 쿼리의 실행 계획을 보여주는 명령어입니다.
- 쿼리가 어떻게 실행되는지, 어떤 방법으로 데이터를 검색하는지 분석할 수 있습니다.

---

## 슬라이드 3: EXPLAIN 사용법 🛠️
- 기본 구문:
  ```sql
  EXPLAIN SELECT * FROM 테이블명;
  ```
- 예시:
  ```sql
  EXPLAIN SELECT * FROM film;
  ```
- 이 명령어는 "film" 테이블에 대한 실행 계획을 출력합니다.

---

## 슬라이드 4: EXPLAIN 옵션 ⚙️
- 주요 옵션:
  - `ANALYZE`: 실제 실행 통계 포함
  - `VERBOSE`: 추가 정보 표시
  - `COSTS`: 비용 정보 포함
- 예시:
  ```sql
  EXPLAIN ANALYZE SELECT * FROM film;
  ```

---

## 슬라이드 5: 실행 계획 해석하기 🔍
- 실행 계획은 여러 단계로 나뉘어 있습니다:
  - **Seq Scan**: 순차 검색
  - **Index Scan**: 인덱스 검색
  - **Join**: 조인 방법 (Inner, Left, Right 등)
- 각 단계의 비용을 분석하여 최적화할 수 있습니다.

---

## 슬라이드 6: 쿼리 개선의 시작점 🚀
- 느린 쿼리를 발견하면:
  - **인덱스 추가**: 검색 속도 향상
  - **쿼리 구조 변경**: 불필요한 데이터 제거
  - **조건 추가**: WHERE 절 최적화

---

## 슬라이드 7: 성능 테스트 예시 ⚡
1. 느린 쿼리:
   ```sql
   SELECT * FROM film WHERE release_year < 2000;
   ```
2. EXPLAIN 사용:
   ```sql
   EXPLAIN ANALYZE SELECT * FROM film WHERE release_year < 2000;
   ```
3. 결과를 분석하여 개선 방안 도출

---

## 슬라이드 8: 요약 및 질문 🤔
- EXPLAIN을 통해 쿼리의 실행 계획을 이해하고 성능을 향상시킬 수 있습니다.
- 질문이 있다면 자유롭게 물어보세요!

---

## 슬라이드 9: 다음 단계 🌱
- PostgreSQL에 대한 추가 학습:
  - 다양한 쿼리 최적화 기법
  - 데이터베이스 설계 원칙
  - PostgreSQL 고급 기능 (예: 트리거, 함수)

---

## 슬라이드 10: 감사합니다! 🙏
- 강의에 참여해 주셔서 감사합니다. 
- 추가 자료나 질문이 필요하시면 언제든지 연락해 주세요!

---
```