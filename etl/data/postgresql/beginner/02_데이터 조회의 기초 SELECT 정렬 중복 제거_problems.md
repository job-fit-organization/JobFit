> ※ 안내: 초급자 강의에는 **초급·중급** 문제를, 경력자 강의에는 **중급·고급** 문제를 활용하세요.

## 🟢 초급 문제

### Q1. SQL에서 데이터를 조회하기 위해 사용하는 명령어는 무엇인가요?
1) INSERT
2) UPDATE
3) DELETE
4) SELECT

<details><summary>정답 보기</summary>

정답: 4번 — 해설: SQL에서 데이터를 조회하기 위해 사용하는 명령어는 SELECT입니다.

</details>

### Q2. SQL에서 중복된 데이터를 제거하기 위해 사용하는 키워드는 무엇인가요?
1) UNIQUE
2) NO_DUPLICATES
3) SELECT DISTINCT
4) REMOVE_DUPLICATES

<details><summary>정답 보기</summary>

정답: 3번 — 해설: 중복된 데이터를 제거하기 위해 사용되는 키워드는 SELECT DISTINCT입니다.

</details>

## 🟡 중급 문제

### Q3. 다음 SQL 쿼리의 결과는 무엇인가요?  
```sql
SELECT name FROM employees ORDER BY name DESC;
```
1) employees 테이블의 모든 이름을 오름차순으로 정렬하여 조회
2) employees 테이블의 모든 이름을 내림차순으로 정렬하여 조회
3) employees 테이블의 이름을 중복 없이 조회
4) employees 테이블의 이름을 오름차순으로 중복 없이 조회

<details><summary>정답 보기</summary>

정답: 2번 — 해설: ORDER BY 절에 DESC가 사용되어 내림차순으로 정렬합니다.

</details>

### Q4. 다음 쿼리에서 alias(별칭)를 사용하는 이유는 무엇인가요?  
```sql
SELECT name AS employee_name FROM employees;
```
1) 쿼리의 성능을 높이기 위해
2) 결과 집합에서 컬럼 이름을 더 이해하기 쉽게 만들기 위해
3) 중복된 데이터를 제거하기 위해
4) 데이터를 정렬하기 위해

<details><summary>정답 보기</summary>

정답: 2번 — 해설: alias는 결과 집합에서 컬럼 이름을 더 이해하기 쉽게 만들기 위해 사용됩니다.

</details>

### Q5. 다음 SQL 쿼리에서 DISTINCT 키워드의 용도는 무엇인가요?  
```sql
SELECT DISTINCT department FROM employees;
```
1) 모든 부서를 내림차순으로 정렬
2) 중복된 부서를 제거하고 고유한 부서만 조회
3) 부서 이름을 변경
4) 모든 부서의 데이터를 삭제

<details><summary>정답 보기</summary>

정답: 2번 — 해설: DISTINCT는 중복된 부서를 제거하고 고유한 부서만 조회하기 위해 사용됩니다.

</details>

### Q6. 다음 SQL 쿼리에서 ORDER BY 절이 없으면 어떤 결과가 발생할 수 있나요?  
```sql
SELECT name FROM employees;
```
1) 항상 같은 순서로 결과가 반환된다.
2) 결과가 랜덤한 순서로 반환될 수 있다.
3) 오류가 발생한다.
4) 결과가 중복 없이 반환된다.

<details><summary>정답 보기</summary>

정답: 2번 — 해설: ORDER BY 절이 없으면 결과는 랜덤한 순서로 반환될 수 있습니다.

</details>

## 🔴 고급 문제

### Q7. 다음 SQL 쿼리의 실행 계획을 최적화하기 위해 어떤 방법이 있을까요?  
```sql
SELECT DISTINCT name FROM employees ORDER BY name;
```
1) DISTINCT와 ORDER BY를 동시에 사용하지 않는다.
2) 인덱스를 추가하여 검색 속도를 높인다.
3) 모든 데이터를 메모리에 로드한다.
4) SELECT 쿼리의 컬럼 수를 줄인다.

<details><summary>정답 보기</summary>

정답: 2번 — 해설: 인덱스를 추가하면 DISTINCT와 ORDER BY의 성능을 향상시킬 수 있습니다.

</details>

### Q8. SQL에서 중복 제거와 정렬을 동시에 수행할 때 고려해야 할 트레이드오프는 무엇인가요?
1) 성능 저하와 데이터 정확성
2) 메모리 사용량과 CPU 사용량
3) 쿼리 복잡성과 결과 집합의 크기
4) 쿼리 실행 시간과 네트워크 대역폭

<details><summary>정답 보기</summary>

정답: 1번 — 해설: 중복 제거와 정렬을 동시에 수행하면 성능 저하가 발생할 수 있으며, 이로 인해 데이터 정확성에 영향을 미칠 수 있습니다.

</details>