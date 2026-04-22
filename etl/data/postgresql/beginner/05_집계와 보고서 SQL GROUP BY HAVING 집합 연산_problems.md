> ※ 안내: 초급자 강의에는 **초급·중급** 문제를, 경력자 강의에는 **중급·고급** 문제를 활용하세요.

## 🟢 초급 문제

### Q1. SQL에서 GROUP BY 절의 주요 목적은 무엇인가요?
1) 조건에 맞는 행만 선택하기 위해
2) 여러 행을 그룹으로 묶어 집계 함수 적용하기 위해
3) 데이터베이스를 생성하기 위해
4) 데이터를 정렬하기 위해

<details><summary>정답 보기</summary>

정답: 2번 — GROUP BY는 여러 행을 그룹으로 묶고, 각 그룹에 대해 집계 함수를 적용하는 데 사용됩니다.

</details>

### Q2. HAVING 절은 주로 어떤 용도로 사용되나요?
1) WHERE 절과 같은 기능을 수행하기 위해
2) 그룹화된 데이터에 조건을 적용하기 위해
3) 데이터베이스에 새로운 데이터를 추가하기 위해
4) 모든 행을 선택하기 위해

<details><summary>정답 보기</summary>

정답: 2번 — HAVING 절은 GROUP BY로 그룹화된 결과에 대해 조건을 적용하는 데 사용됩니다.

</details>

## 🟡 중급 문제

### Q3. 다음 SQL 쿼리에서 GROUP BY 절의 역할은 무엇인가요?
```sql
SELECT department, COUNT(*) 
FROM employees 
GROUP BY department;
```
1) 모든 행을 선택하기 위해
2) 부서별로 직원 수를 세기 위해
3) 부서 이름을 정렬하기 위해
4) 직원의 평균 연봉을 계산하기 위해

<details><summary>정답 보기</summary>

정답: 2번 — 이 쿼리는 각 부서에 속한 직원 수를 세기 위해 GROUP BY 절을 사용합니다.

</details>

### Q4. UNION 연산자의 특징이 아닌 것은 무엇인가요?
1) 두 개 이상의 SELECT 문 결과를 결합한다.
2) 중복된 행을 제거한다.
3) 두 개의 쿼리 결과는 동일한 열 수를 가져야 한다.
4) 결과 집합의 행을 정렬한다.

<details><summary>정답 보기</summary>

정답: 4번 — UNION 연산자는 결과 집합의 행을 자동으로 정렬하지 않습니다.

</details>

### Q5. 다음 쿼리에서 HAVING 절의 역할은 무엇인가요?
```sql
SELECT product, SUM(sales) 
FROM sales_data 
GROUP BY product 
HAVING SUM(sales) > 1000;
```
1) 모든 제품을 선택하기 위해
2) 제품별 판매 총액이 1000을 초과하는 제품만 선택하기 위해
3) 판매 데이터를 정렬하기 위해
4) 판매 데이터를 필터링하기 위해

<details><summary>정답 보기</summary>

정답: 2번 — HAVING 절은 판매 총액이 1000을 초과하는 제품만 필터링하는 역할을 합니다.

</details>

### Q6. CUBE 연산자는 어떤 용도로 사용되나요?
1) 단일 그룹화만 수행하기 위해
2) 모든 조합의 그룹 집계를 생성하기 위해
3) 중복된 데이터를 제거하기 위해
4) 특정 조건에서 데이터를 필터링하기 위해

<details><summary>정답 보기</summary>

정답: 2번 — CUBE는 여러 차원의 모든 조합에 대해 그룹 집계를 생성하는 데 사용됩니다.

</details>

## 🔴 고급 문제

### Q7. GROUPING SETS의 장점은 무엇인가요?
1) 단일 그룹화만 지원한다.
2) 여러 개의 집계 결과를 한 번의 쿼리로 생성할 수 있다.
3) 쿼리 성능을 항상 향상시킨다.
4) 데이터베이스의 구조를 변경한다.

<details><summary>정답 보기</summary>

정답: 2번 — GROUPING SETS는 여러 개의 집계 결과를 한 번의 쿼리로 생성할 수 있는 기능을 제공합니다.

</details>

### Q8. EXCEPT 연산자의 사용 예시는 무엇인가요?
```sql
SELECT customer_id FROM orders
EXCEPT
SELECT customer_id FROM returns;
```
이 쿼리는 어떤 결과를 반환하나요?
1) 주문한 모든 고객의 ID
2) 반품하지 않은 고객의 ID
3) 반품한 고객의 ID
4) 주문과 반품 모두 한 고객의 ID

<details><summary>정답 보기</summary>

정답: 2번 — 이 쿼리는 반품하지 않은 고객의 ID를 반환합니다.

</details>