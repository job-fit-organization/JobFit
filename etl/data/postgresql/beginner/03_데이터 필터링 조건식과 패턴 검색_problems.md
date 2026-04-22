> ※ 안내: 초급자 강의에는 **초급·중급** 문제를, 경력자 강의에는 **중급·고급** 문제를 활용하세요.

## 🟢 초급 문제

### Q1. WHERE 절의 기능은 무엇인가요?
1) 데이터베이스의 모든 테이블을 삭제하는 기능
2) 특정 조건에 맞는 행만 선택하는 기능
3) 새로운 테이블을 생성하는 기능
4) 데이터베이스의 보안을 강화하는 기능

<details><summary>정답 보기</summary>

정답: 2번 — WHERE 절은 특정 조건을 만족하는 행만 선택하여 결과를 반환하는 데 사용됩니다.

</details>

### Q2. 다음 중 LIKE 연산자의 용도는 무엇인가요?
1) 두 개의 값을 비교하는 기능
2) 특정 패턴과 일치하는 값을 찾는 기능
3) 행을 삭제하는 기능
4) 데이터베이스의 백업을 만드는 기능

<details><summary>정답 보기</summary>

정답: 2번 — LIKE 연산자는 특정 패턴에 맞는 값을 찾는 데 사용됩니다.

</details>

## 🟡 중급 문제

### Q3. 다음 쿼리에서 'A%' 패턴은 어떤 역할을 하나요?  
```sql
SELECT * FROM customers WHERE first_name LIKE 'A%';
```
1) 이름이 'A'로 시작하는 모든 고객의 정보를 검색
2) 이름이 'A'로 끝나는 모든 고객의 정보를 검색
3) 이름이 'A'를 포함하는 모든 고객의 정보를 검색
4) 이름이 'A'가 아닌 모든 고객의 정보를 검색

<details><summary>정답 보기</summary>

정답: 1번 — 'A%' 패턴은 이름이 'A'로 시작하는 모든 고객의 정보를 검색합니다.

</details>

### Q4. 다음 쿼리의 결과는 무엇인가요?  
```sql
SELECT * FROM products WHERE price BETWEEN 10 AND 20;
```
1) 가격이 10인 제품만 선택
2) 가격이 20인 제품만 선택
3) 가격이 10 이상 20 이하인 제품 선택
4) 가격이 10보다 작은 제품 선택

<details><summary>정답 보기</summary>

정답: 3번 — 가격이 10 이상 20 이하인 제품을 선택합니다.

</details>

### Q5. 다음 쿼리에서 LIMIT 절의 역할은 무엇인가요?  
```sql
SELECT * FROM orders LIMIT 5;
```
1) 모든 주문을 선택
2) 5개의 주문만 선택
3) 주문의 수를 무제한으로 설정
4) 주문을 정렬하는 기능

<details><summary>정답 보기</summary>

정답: 2번 — LIMIT 절은 쿼리 결과에서 최대 5개의 주문만 선택합니다.

</details>

### Q6. IN 연산자를 사용할 때의 예시는 다음 중 무엇인가요?  
```sql
SELECT * FROM employees WHERE department IN ('HR', 'IT', 'Finance');
```
1) HR, IT, Finance가 아닌 부서의 직원 선택
2) HR, IT, Finance 부서의 직원만 선택
3) 모든 직원 선택
4) 부서의 수를 제한하는 기능

<details><summary>정답 보기</summary>

정답: 2번 — IN 연산자는 HR, IT, Finance 부서의 직원만 선택합니다.

</details>

## 🔴 고급 문제

### Q7. 다음 쿼리에서 AND 연산자의 역할은 무엇인가요?  
```sql
SELECT * FROM students WHERE age > 18 AND grade = 'A';
```
1) 18세 이상의 학생과 18세 미만의 학생을 모두 선택
2) 18세 이상의 학생 중에서 'A' 학점을 받은 학생을 선택
3) 18세 미만의 학생 중에서 'A' 학점을 받은 학생을 선택
4) 모든 학생을 선택

<details><summary>정답 보기</summary>

정답: 2번 — AND 연산자는 두 조건이 모두 참인 경우에만 행을 선택합니다.

</details>

### Q8. 다음 쿼리의 최적화 방법으로 가장 적절한 것은 무엇인가요?  
```sql
SELECT * FROM employees WHERE last_name LIKE 'Sm%' AND first_name IS NOT NULL;
```
1) WHERE 절을 제거하여 성능 향상
2) LIKE 대신 '=' 연산자를 사용하여 성능 향상
3) 인덱스를 사용하여 last_name에 대한 검색 성능 향상
4) SELECT 절에서 모든 열을 선택하지 않고 필요한 열만 선택

<details><summary>정답 보기</summary>

정답: 3번 — last_name에 대한 인덱스를 사용하면 LIKE 검색 시 성능을 향상시킬 수 있습니다.

</details>