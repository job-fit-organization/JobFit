```markdown
# 데이터 필터링: 조건식과 패턴 검색 강의 자료 📊

## 참고 링크
- [PostgreSQL 튜토리얼](https://neon.com/postgresql/tutorial)
- [PostgreSQL 시작하기](https://neon.com/postgresql/postgresql-getting-started)
- [PostgreSQL에서 데이터 필터링](https://neon.com/postgresql/postgresql-tutorial/postgresql-where)
- [PostgreSQL LIKE 연산자](https://neon.com/postgresql/postgresql-tutorial/postgresql-like)

---

## 슬라이드 1: 데이터 필터링이란? 🔍
- 데이터 필터링은 필요 없는 데이터를 제외하고 **원하는 데이터만 추출하는 과정**입니다.
- 주로 조건식(WHERE)과 패턴 검색(LIKE)을 사용하여 데이터를 관리합니다.

---

## 슬라이드 2: WHERE 절 사용하기 🚦
- **WHERE 절**은 특정 조건을 만족하는 데이터만 조회합니다.
- 예시: 특정 고객의 이름 조회
  ```sql
  SELECT * FROM customers WHERE first_name = 'John';
  ```

---

## 슬라이드 3: AND와 OR 연산자 🎯
- **AND**: 두 조건이 모두 참일 때 데이터를 반환합니다.
- **OR**: 두 조건 중 하나라도 참일 때 데이터를 반환합니다.
- 예시:
  ```sql
  SELECT * FROM customers WHERE first_name = 'John' AND last_name = 'Doe';
  ```

---

## 슬라이드 4: LIMIT와 FETCH로 결과 제한하기 ⏳
- **LIMIT**: 반환할 데이터의 행 수를 제한합니다.
- **FETCH**: 데이터의 일부를 가져옵니다.
- 예시:
  ```sql
  SELECT * FROM customers LIMIT 5;
  ```

---

## 슬라이드 5: IN 연산자 사용하기 📋
- **IN**: 특정 목록에 있는 값을 가진 데이터 조회
- 예시:
  ```sql
  SELECT * FROM customers WHERE first_name IN ('Alice', 'Bob', 'Charlie');
  ```

---

## 슬라이드 6: BETWEEN 연산자 사용하기 📏
- **BETWEEN**: 범위 내의 값을 가진 데이터 조회
- 예시:
  ```sql
  SELECT * FROM customers WHERE age BETWEEN 20 AND 30;
  ```

---

## 슬라이드 7: LIKE 연산자와 패턴 검색 🔠
- **LIKE**: 특정 패턴과 일치하는 데이터를 조회합니다.
- 와일드카드:
  - `%`: 0개 이상의 문자
  - `_`: 1개의 문자
- 예시:
  ```sql
  SELECT * FROM customers WHERE first_name LIKE 'A%';
  ```

---

## 슬라이드 8: IS NULL 사용하기 ❓
- **IS NULL**: 값이 NULL인 데이터를 조회합니다.
- 예시:
  ```sql
  SELECT * FROM customers WHERE last_name IS NULL;
  ```

---

## 슬라이드 9: 복합 조건 사용하기 🔗
- 여러 조건을 조합하여 복잡한 쿼리 작성 가능
- 예시:
  ```sql
  SELECT * FROM customers 
  WHERE (first_name LIKE 'A%' OR first_name LIKE 'B%')
  AND age BETWEEN 30 AND 40;
  ```

---

## 슬라이드 10: 실습과 Q&A 💬
- 주어진 조건으로 데이터베이스에서 직접 쿼리 실행해보기
- 궁금한 점 질문하기
- 실습 예제 제공 및 피드백

---
```
