```markdown
# 조건식과 실전 SQL 작성법 📊

## 참고 링크
- [PostgreSQL Tutorial](https://neon.com/postgresql/tutorial)
- [PostgreSQL Getting Started](https://neon.com/postgresql/postgresql-getting-started)
- [What is PostgreSQL?](https://neon.com/postgresql/postgresql-tutorial/postgresql-what-is-postgresql)
- [Sample Database](https://neon.com/postgresql/postgresql-tutorial/postgresql-sample-database)

---

## 슬라이드 1: 강의 소개 🚀
- **목표**: CASE, COALESCE, NULLIF, CAST 활용
- **대상**: 개발 경험이 있는 경력자
- **핵심 내용**: 데이터 정제 및 NULL 처리

---

## 슬라이드 2: CASE 문 소개 📝
- 조건에 따라 다른 결과를 반환
- **구문 예시**:
    ```sql
    SELECT 
        employee_id,
        CASE 
            WHEN salary > 100000 THEN 'High'
            WHEN salary BETWEEN 50000 AND 100000 THEN 'Medium'
            ELSE 'Low'
        END AS salary_category
    FROM employees;
    ```
- 성능 고려: 인덱스와 함께 사용할 경우 주의 필요

---

## 슬라이드 3: COALESCE 활용 ⚙️
- NULL 값을 대체하는 함수
- **구문 예시**:
    ```sql
    SELECT 
        employee_id,
        COALESCE(phone_number, 'No Phone') AS contact_number
    FROM employees;
    ```
- **트레이드오프**: 성능이 중요한 경우, 필요 없는 NULL 처리 줄이기

---

## 슬라이드 4: NULLIF 사용법 ❓
- 두 값이 같으면 NULL 반환
- **구문 예시**:
    ```sql
    SELECT 
        employee_id,
        NULLIF(bonus, 0) AS adjusted_bonus
    FROM employees;
    ```
- 활용사례: 0으로 나누는 오류 방지

---

## 슬라이드 5: CAST 함수 👩‍💻
- 데이터 타입 변환
- **구문 예시**:
    ```sql
    SELECT 
        employee_id,
        CAST(salary AS VARCHAR) AS salary_str
    FROM employees;
    ```
- 성능 최적화: 데이터 타입 변환 시 고려할 점

---

## 슬라이드 6: 성능 최적화 전략 🔍
- **EXPLAIN 사용하기**:
    ```sql
    EXPLAIN ANALYZE SELECT * FROM employees WHERE salary > 100000;
    ```
- 쿼리 성능 분석 및 최적화 방향 설정

---

## 슬라이드 7: 트랜잭션과 성능 🎯
- 데이터 변경 시 트랜잭션 사용:
    ```sql
    BEGIN;
    UPDATE employees SET salary = salary * 1.1 WHERE department_id = 1;
    COMMIT;
    ```
- 성능 최적화를 위한 트랜잭션 관리

---

## 슬라이드 8: 데이터 정제 및 NULL 처리 사례 📊
- 실전 예시: CSV 데이터 로드 후 NULL 처리
- **구문 예시**:
    ```sql
    COPY employees FROM '/path/to/file.csv' WITH (FORMAT csv, HEADER);
    UPDATE employees SET phone_number = COALESCE(phone_number, 'Unknown') WHERE phone_number IS NULL;
    ```
- 성능 및 유지보수 고려

---

## 슬라이드 9: 복잡한 쿼리 최적화 ⚡
- **INNER JOIN과 CASE 활용**:
    ```sql
    SELECT 
        e.employee_id,
        d.department_name,
        CASE 
            WHEN e.salary IS NULL THEN 'Not Available'
            ELSE e.salary::TEXT
        END AS salary
    FROM employees e
    INNER JOIN departments d ON e.department_id = d.department_id;
    ```
- 성능 및 가독성 모두 고려

---

## 슬라이드 10: Q&A 및 마무리 🎉
- 질문 받기
- 추가 자료 및 링크 제공
- 강의 요약 및 마무리

--- 
```
