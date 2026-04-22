```markdown
# 고급 조회: 서브쿼리와 CTE 🌐

## 참고 링크
- [PostgreSQL Tutorial](https://neon.com/postgresql/tutorial)
- [Getting Started with PostgreSQL](https://neon.com/postgresql/postgresql-getting-started)
- [Common Table Expressions (CTE)](https://neon.com/postgresql/postgresql-tutorial/postgresql-cte)

---

## 슬라이드 1: 서브쿼리란? 🔍
- 서브쿼리는 다른 쿼리 내부에서 실행되는 쿼리입니다.
- 주 쿼리의 결과를 필터링하거나 계산하는 데 사용됩니다.
- **예제**:
  ```sql
  SELECT name 
  FROM employees 
  WHERE department_id IN (SELECT id FROM departments WHERE name = 'Sales');
  ```

---

## 슬라이드 2: 상관 서브쿼리의 이해 📊
- 상관 서브쿼리는 주 쿼리의 각 행에 대해 실행되는 서브쿼리입니다.
- 주 쿼리와 서브쿼리 간의 상관 관계가 필요합니다.
- **예제**:
  ```sql
  SELECT e.name 
  FROM employees e 
  WHERE e.salary > (SELECT AVG(salary) FROM employees WHERE department_id = e.department_id);
  ```

---

## 슬라이드 3: ANY, ALL, EXISTS 활용 📋
- **ANY**: 조건을 만족하는 값 중 하나라도 참이면 참.
- **ALL**: 모든 값이 조건을 만족해야 참.
- **EXISTS**: 서브쿼리 결과가 존재하면 참.
- **예제**:
  ```sql
  SELECT name 
  FROM employees 
  WHERE salary > ANY (SELECT salary FROM employees WHERE department_id = 1);
  ```

---

## 슬라이드 4: Common Table Expression (CTE) 소개 🛠️
- CTE는 쿼리 내에서 임시 결과 집합을 생성합니다.
- 복잡한 쿼리를 더 읽기 쉽게 만들어줍니다.
- **기본 문법**:
  ```sql
  WITH cte_name AS (
      SELECT ...
  )
  SELECT * FROM cte_name;
  ```

---

## 슬라이드 5: CTE의 장점 ✨
- 가독성 향상: 복잡한 쿼리를 정리.
- 재귀 쿼리 작성 가능: 계층적 데이터 쿼리에 유용.
- 윈도우 함수와 함께 사용 가능.

---

## 슬라이드 6: 재귀 CTE의 활용 🚀
- 재귀 CTE는 자기 자신을 참조하여 계층적 데이터를 처리합니다.
- **예제**:
  ```sql
  WITH RECURSIVE org_chart AS (
      SELECT id, name, manager_id 
      FROM employees 
      WHERE manager_id IS NULL
      UNION 
      SELECT e.id, e.name, e.manager_id 
      FROM employees e 
      INNER JOIN org_chart o ON o.id = e.manager_id
  )
  SELECT * FROM org_chart;
  ```

---

## 슬라이드 7: 성능 최적화 📈
- CTE는 쿼리 최적화에 영향을 미칠 수 있습니다.
- 서브쿼리 대신 CTE를 사용하여 쿼리의 재사용성을 높일 수 있습니다.
- 성능 테스트 필요: 쿼리 실행 계획을 분석하여 최적화.

---

## 슬라이드 8: 트레이드오프 ⚖️
- CTE는 가독성을 높이지만, 성능 저하가 발생할 수 있습니다.
- 서브쿼리의 경우, 성능이 더 좋을 수 있는 경우도 있음.
- 최적의 사용 사례를 이해하고 적용하는 것이 중요합니다.

---

## 슬라이드 9: 사례 연구: CTE 활용 예제 📊
- 복잡한 데이터 분석 시나리오에서 CTE를 활용하여 통계 및 집계 작업 수행 가능.
- **예제**:
  ```sql
  WITH film_stats AS (
      SELECT AVG(rental_rate) AS avg_rate, MAX(length) AS max_length 
      FROM films
  )
  SELECT * FROM film_stats;
  ```

---

## 슬라이드 10: 결론 및 Q&A 💬
- 서브쿼리와 CTE의 차이 및 활용법 이해.
- 성능 최적화 및 트레이드오프 고려.
- 질문이 있으면 자유롭게 해주세요!
```
