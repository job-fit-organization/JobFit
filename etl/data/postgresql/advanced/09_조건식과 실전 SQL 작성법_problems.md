> ※ 안내: 초급자 강의에는 **초급·중급** 문제를, 경력자 강의에는 **중급·고급** 문제를 활용하세요.

## 🟢 초급 문제

### Q1. COALESCE 함수의 주요 기능은 무엇인가요?
1) 두 개의 값을 비교하여 더 큰 값을 반환한다.
2) 여러 인자 중 NULL이 아닌 첫 번째 인자를 반환한다.
3) 특정 조건에 따라 값을 선택한다.
4) 데이터 타입을 변환한다.

<details><summary>정답 보기</summary>

정답: 2번 — COALESCE 함수는 여러 인자 중 NULL이 아닌 첫 번째 인자를 반환하는 기능을 가지고 있습니다.

</details>

### Q2. CASE 표현식의 기본적인 사용 목적은 무엇인가요?
1) 데이터베이스의 모든 데이터를 삭제하기 위함이다.
2) 조건에 따라 다른 값을 반환하기 위함이다.
3) 데이터 타입을 변환하기 위함이다.
4) NULL 값을 자동으로 제거하기 위함이다.

<details><summary>정답 보기</summary>

정답: 2번 — CASE 표현식은 조건에 따라 다른 값을 반환하는 데 사용됩니다.

</details>

## 🟡 중급 문제

### Q3. 다음 SQL 쿼리에서 COALESCE 함수의 역할은 무엇인가요?
```sql
SELECT COALESCE(column1, 'default_value') AS result FROM table_name;
```
1) column1의 값이 NULL일 경우 'default_value'를 반환한다.
2) column1의 값이 NULL이 아닐 경우 NULL을 반환한다.
3) column1의 모든 값을 0으로 변환한다.
4) column1의 데이터 타입을 정수형으로 변환한다.

<details><summary>정답 보기</summary>

정답: 1번 — COALESCE 함수는 column1의 값이 NULL일 경우 'default_value'를 반환합니다.

</details>

### Q4. 다음 SQL 쿼리에서 CASE 표현식이 수행하는 작업은 무엇인가요?
```sql
SELECT 
    CASE 
        WHEN score >= 90 THEN 'A'
        WHEN score >= 80 THEN 'B'
        ELSE 'C'
    END AS grade
FROM students;
```
1) 학생의 모든 점수를 삭제한다.
2) 점수에 따라 A, B, C 등급을 부여한다.
3) 점수를 평균으로 변환한다.
4) 학생의 점수를 내림차순으로 정렬한다.

<details><summary>정답 보기</summary>

정답: 2번 — 점수에 따라 A, B, C 등급을 부여하는 작업을 수행합니다.

</details>

### Q5. NULLIF 함수의 역할은 무엇인가요?
1) 두 개의 값을 비교하여 같으면 NULL을 반환한다.
2) 두 개의 값을 비교하여 더 작은 값을 반환한다.
3) 두 개의 값을 더하여 결과를 반환한다.
4) 데이터 타입을 변환한다.

<details><summary>정답 보기</summary>

정답: 1번 — NULLIF 함수는 두 개의 값을 비교하여 같으면 NULL을 반환합니다.

</details>

### Q6. 다음 SQL 쿼리에서 CAST 함수의 사용법은 무엇인가요?
```sql
SELECT CAST(column1 AS INTEGER) FROM table_name;
```
1) column1의 값을 문자열로 변환한다.
2) column1의 값을 정수형으로 변환한다.
3) column1의 값을 실수형으로 변환한다.
4) column1의 값을 소수점 이하로 반올림한다.

<details><summary>정답 보기</summary>

정답: 2번 — CAST 함수는 column1의 값을 정수형으로 변환하는 데 사용됩니다.

</details>

## 🔴 고급 문제

### Q7. COALESCE와 CASE의 성능 차이는 무엇인가요?
1) COALESCE는 CASE보다 항상 느리다.
2) 둘은 성능상 차이가 없다.
3) CASE가 더 빠르다.
4) COALESCE는 더 많은 메모리를 사용한다.

<details><summary>정답 보기</summary>

정답: 2번 — COALESCE와 CASE는 성능상 차이가 없으며, 사용자의 선택에 따라 다르게 적용할 수 있습니다.

</details>

### Q8. SQL 쿼리에서 NULL 처리 시 고려해야 할 트레이드오프는 무엇인가요?
1) NULL 값을 처리할 때 쿼리의 복잡성이 증가하고 가독성이 떨어질 수 있다.
2) NULL 값을 사용하면 항상 성능이 향상된다.
3) NULL 처리는 데이터 무결성을 항상 보장한다.
4) 쿼리의 실행 속도는 NULL 값의 개수에 따라 변하지 않는다.

<details><summary>정답 보기</summary>

정답: 1번 — NULL 값을 처리할 때 쿼리의 복잡성이 증가하고 가독성이 떨어질 수 있습니다.

</details>