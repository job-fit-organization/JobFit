```markdown
# 집계와 보고서 SQL: GROUP BY, HAVING, 집합 연산

## 참고 링크
- [PostgreSQL Tutorial](https://neon.com/postgresql/tutorial)
- [PostgreSQL Getting Started](https://neon.com/postgresql/postgresql-getting-started)
- [PostgreSQL GROUP BY](https://neon.com/postgresql/postgresql-tutorial/postgresql-group-by)
- [PostgreSQL HAVING](https://neon.com/postgresql/postgresql-tutorial/postgresql-having)
- [PostgreSQL Set Operations](https://neon.com/postgresql/postgresql-tutorial/postgresql-union)

---

## 📊 집계와 보고서의 중요성
- 데이터 분석 및 요약 보고서 생성에 필수
- 비즈니스 의사결정 지원
- 다양한 데이터를 집계하고 분석하는 기초 지식

---

## 📋 GROUP BY란?
- 데이터셋을 특정 컬럼의 값에 따라 그룹화
- 각 그룹에 대해 집계 함수 적용 가능
- 예시:
    ```sql
    SELECT department, COUNT(*)
    FROM employees
    GROUP BY department;
    ```

---

## 🔍 HAVING 절
- GROUP BY로 생성된 그룹에 조건을 걸기 위해 사용
- 예시:
    ```sql
    SELECT department, COUNT(*) AS employee_count
    FROM employees
    GROUP BY department
    HAVING COUNT(*) > 10;
    ```

---

## 📈 집합 연산: UNION
- 여러 쿼리의 결과를 하나로 결합
- 중복 제거
- 예시:
    ```sql
    SELECT name FROM employees
    UNION
    SELECT name FROM contractors;
    ```

---

## 🔄 집합 연산: INTERSECT
- 두 쿼리의 공통된 결과만 반환
- 예시:
    ```sql
    SELECT name FROM employees
    INTERSECT
    SELECT name FROM contractors;
    ```

---

## ❌ 집합 연산: EXCEPT
- 첫 번째 쿼리의 결과에서 두 번째 쿼리의 결과를 뺀 결과 반환
- 예시:
    ```sql
    SELECT name FROM employees
    EXCEPT
    SELECT name FROM contractors;
    ```

---

## 🛠️ GROUPING SETS
- 여러 그룹 기준을 한번에 처리
- 다양한 집계 결과를 효율적으로 생성
- 예시:
    ```sql
    SELECT department, job_title, COUNT(*)
    FROM employees
    GROUP BY GROUPING SETS ((department), (job_title), ());
    ```

---

## 📊 CUBE와 ROLLUP
- **CUBE**: 모든 조합의 집계 결과 생성
    ```sql
    SELECT department, job_title, SUM(salary)
    FROM employees
    GROUP BY CUBE (department, job_title);
    ```
- **ROLLUP**: 계층적 집계 결과 생성
    ```sql
    SELECT department, SUM(salary)
    FROM employees
    GROUP BY ROLLUP (department);
    ```

---

## 🚀 실습: 요약 보고서 만들기
1. **데이터 준비**: employees 테이블 로드
2. **쿼리 작성**: GROUP BY, HAVING, UNION 사용
3. **결과 확인**: 다양한 집계 결과 비교

---

## 📝 마무리
- 오늘 배운 내용 정리
- GROUP BY, HAVING, 집합 연산의 중요성 강조
- 실습을 통해 이해도 높이기

---
```