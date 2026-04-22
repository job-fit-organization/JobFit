```markdown
# PostgreSQL 입문: 여러 테이블 다루기 🗃️

---

## 참고 링크 🔗
- [PostgreSQL 튜토리얼](https://neon.com/postgresql/tutorial)
- [PostgreSQL 시작하기](https://neon.com/postgresql/postgresql-getting-started)
- [PostgreSQL JOIN 개요](https://neon.com/postgresql/tutorial/postgresql-joins)
- [PostgreSQL 샘플 데이터베이스](https://neon.com/postgresql/postgresql-tutorial/postgresql-sample-database)

---

## 1. 관계형 DB와 JOIN의 개념 🧩
- 관계형 데이터베이스는 여러 테이블 간의 관계를 통해 데이터를 관리합니다.
- JOIN은 서로 다른 테이블의 데이터를 연결하여 조회할 수 있게 해줍니다.

---

## 2. JOIN의 종류 개요 📊
1. **INNER JOIN**: 두 테이블에서 일치하는 데이터만 조회
2. **LEFT JOIN**: 왼쪽 테이블의 모든 데이터와 오른쪽 테이블의 일치하는 데이터 조회
3. **RIGHT JOIN**: 오른쪽 테이블의 모든 데이터와 왼쪽 테이블의 일치하는 데이터 조회
4. **FULL OUTER JOIN**: 양쪽 테이블의 모든 데이터 조회
5. **CROSS JOIN**: 두 테이블의 모든 조합을 조회
6. **NATURAL JOIN**: 공통 컬럼을 기반으로 자동으로 연결

---

## 3. INNER JOIN 예시 🔄
```sql
SELECT *
FROM employees
INNER JOIN departments ON employees.department_id = departments.id;
```
- 직원과 부서 테이블에서 일치하는 데이터를 조회합니다.

---

## 4. LEFT JOIN 예시 ↔️
```sql
SELECT *
FROM employees
LEFT JOIN departments ON employees.department_id = departments.id;
```
- 모든 직원 정보를 조회하며, 부서가 없는 직원도 포함합니다.

---

## 5. RIGHT JOIN 예시 ⬅️
```sql
SELECT *
FROM employees
RIGHT JOIN departments ON employees.department_id = departments.id;
```
- 모든 부서 정보를 조회하며, 부서에 소속되지 않은 직원은 NULL로 표시됩니다.

---

## 6. FULL OUTER JOIN 예시 🌐
```sql
SELECT *
FROM employees
FULL OUTER JOIN departments ON employees.department_id = departments.id;
```
- 직원과 부서의 모든 정보를 조회합니다. 일치하지 않는 데이터는 NULL로 표시됩니다.

---

## 7. CROSS JOIN 예시 🔗
```sql
SELECT *
FROM employees
CROSS JOIN departments;
```
- 직원과 부서의 모든 조합을 조회합니다. (카르테시안 곱)

---

## 8. NATURAL JOIN 예시 🌿
```sql
SELECT *
FROM employees
NATURAL JOIN departments;
```
- 공통된 컬럼을 자동으로 기준으로 하여 두 테이블의 데이터를 연결합니다.

---

## 9. 테이블 별칭 사용하기 🏷️
```sql
SELECT e.name, d.name
FROM employees AS e
JOIN departments AS d ON e.department_id = d.id;
```
- `AS` 키워드를 사용해 테이블에 별칭을 부여하여 코드 가독성을 높입니다.

---

## 10. 요약 및 다음 단계 🚀
- JOIN을 통해 여러 테이블을 효과적으로 다룰 수 있습니다.
- 다양한 JOIN을 활용하여 복잡한 데이터 쿼리를 작성해 보세요!
- 다음 강의에서는 GROUP BY와 데이터 집계에 대해 배워봅시다!

---
```