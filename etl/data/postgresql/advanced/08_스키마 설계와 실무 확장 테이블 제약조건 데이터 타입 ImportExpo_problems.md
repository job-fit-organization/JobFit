> ※ 안내: 초급자 강의에는 **초급·중급** 문제를, 경력자 강의에는 **중급·고급** 문제를 활용하세요.

## 🟢 초급 문제

### Q1. 다음 중 데이터베이스에서 '테이블'의 정의로 알맞은 것은 무엇인가?
1) 데이터베이스의 저장소로, 데이터가 구조화되어 저장되는 단위
2) 데이터를 검색하는 방법
3) 데이터베이스의 보안 프로토콜
4) 데이터베이스의 사용자 인터페이스

<details><summary>정답 보기</summary>

정답: 1번 — 해설: 테이블은 데이터베이스에서 데이터를 구조화하여 저장하는 기본 단위입니다.

</details>

### Q2. 다음 중 '기본 키(Primary Key)'의 주요 특징이 아닌 것은 무엇인가?
1) 테이블 내에서 각 행을 고유하게 식별한다.
2) NULL 값을 가질 수 있다.
3) 한 테이블에 하나만 존재할 수 있다.
4) 중복된 값을 허용하지 않는다.

<details><summary>정답 보기</summary>

정답: 2번 — 해설: 기본 키는 NULL 값을 가질 수 없으며, 테이블 내에서 각 행을 고유하게 식별해야 합니다.

</details>

## 🟡 중급 문제

### Q3. 다음 SQL 명령어 중 '테이블 추가'에 해당하는 것은 무엇인가?
1) ALTER TABLE
2) CREATE TABLE
3) DROP TABLE
4) TRUNCATE TABLE

<details><summary>정답 보기</summary>

정답: 2번 — 해설: CREATE TABLE은 새로운 테이블을 생성하는 SQL 명령어입니다.

</details>

### Q4. 아래의 SQL 명령어에서 'NOT NULL' 제약조건의 역할은 무엇인가?
```sql
CREATE TABLE students (
    student_id INT PRIMARY KEY,
    student_name VARCHAR(100) NOT NULL
);
```
1) student_name 필드에 NULL 값을 허용한다.
2) student_name 필드는 반드시 값이 있어야 한다.
3) student_id 필드가 중복될 수 있다.
4) student_name 필드는 기본 키로 설정된다.

<details><summary>정답 보기</summary>

정답: 2번 — 해설: NOT NULL 제약조건은 해당 필드에 NULL 값을 허용하지 않음을 의미합니다.

</details>

### Q5. CSV 파일을 데이터베이스 테이블로 가져오는 SQL 명령어는 무엇인가?
1) INSERT INTO
2) COPY
3) LOAD DATA
4) IMPORT

<details><summary>정답 보기</summary>

정답: 2번 — 해설: COPY 명령어는 CSV 파일을 데이터베이스 테이블로 가져오는 데 사용됩니다.

</details>

### Q6. 아래 SQL 명령어에서 'FOREIGN KEY' 제약조건의 역할은 무엇인가?
```sql
CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    customer_id INT,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);
```
1) orders 테이블의 order_id 필드는 중복될 수 없다.
2) orders 테이블의 customer_id 필드는 customers 테이블의 customer_id를 참조한다.
3) orders 테이블의 customer_id 필드는 NULL 값을 가질 수 있다.
4) orders 테이블은 반드시 customer_id를 가져야 한다.

<details><summary>정답 보기</summary>

정답: 2번 — 해설: FOREIGN KEY 제약조건은 orders 테이블의 customer_id가 customers 테이블의 customer_id를 참조하도록 설정합니다.

</details>

## 🔴 고급 문제

### Q7. PostgreSQL에서 'SERIAL' 데이터 타입의 주된 목적은 무엇인가?
1) 문자열 데이터를 저장하기 위해
2) 자동 증가하는 정수를 생성하기 위해
3) 날짜 및 시간을 저장하기 위해
4) JSON 데이터를 저장하기 위해

<details><summary>정답 보기</summary>

정답: 2번 — 해설: SERIAL 데이터 타입은 자동으로 증가하는 정수 값을 생성하여 기본 키로 사용되도록 설계되었습니다.

</details>

### Q8. 'CHECK' 제약조건을 사용하여 데이터 무결성을 유지하는 방법에 대한 설명으로 올바른 것은 무엇인가?
1) 데이터 중복을 방지한다.
2) 특정 조건을 만족해야만 데이터를 입력할 수 있다.
3) NULL 값을 허용할 수 있다.
4) 데이터 타입을 강제한다.

<details><summary>정답 보기</summary>

정답: 2번 — 해설: CHECK 제약조건은 특정 조건을 만족해야만 데이터를 입력할 수 있도록 하여 데이터 무결성을 유지합니다.

</details>