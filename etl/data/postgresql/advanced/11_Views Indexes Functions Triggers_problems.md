> ※ 안내: 초급자 강의에는 **초급·중급** 문제를, 경력자 강의에는 **중급·고급** 문제를 활용하세요.

## 🟢 초급 문제

### Q1. View의 정의는 무엇인가요?
1) 데이터베이스의 데이터를 저장하는 테이블
2) 쿼리의 결과를 저장하는 가상의 테이블
3) 데이터베이스의 성능을 향상시키는 방법
4) 데이터베이스의 구조를 정의하는 명령어

<details><summary>정답 보기</summary>

정답: 2번 — View는 쿼리의 결과를 저장하는 가상의 테이블입니다.

</details>

### Q2. Index의 주된 목적은 무엇인가요?
1) 데이터베이스에 데이터를 추가하는 것
2) 데이터 검색 속도를 향상시키기 위해
3) 데이터의 무결성을 보장하기 위해
4) 데이터베이스의 크기를 줄이기 위해

<details><summary>정답 보기</summary>

정답: 2번 — Index는 데이터 검색 속도를 향상시키기 위해 사용됩니다.

</details>

## 🟡 중급 문제

### Q3. PL/pgSQL에서 함수의 기본 구조는 어떤 형태인가요?
1) CREATE TABLE 구문
2) CREATE FUNCTION 구문
3) CREATE VIEW 구문
4) CREATE INDEX 구문

<details><summary>정답 보기</summary>

정답: 2번 — PL/pgSQL에서 함수는 CREATE FUNCTION 구문으로 정의됩니다.

</details>

### Q4. Trigger가 작동하는 순간은 언제인가요?
1) 테이블이 삭제될 때
2) 데이터가 삽입, 수정, 삭제될 때
3) 데이터베이스가 생성될 때
4) 쿼리가 실행될 때

<details><summary>정답 보기</summary>

정답: 2번 — Trigger는 데이터가 삽입, 수정, 삭제될 때 작동합니다.

</details>

### Q5. Insteadof Trigger의 주 용도는 무엇인가요?
1) 테이블을 삭제하는 것
2) View에서의 INSERT, UPDATE, DELETE 동작을 정의하는 것
3) 데이터베이스의 저장 공간을 절약하는 것
4) 데이터베이스의 성능을 모니터링하는 것

<details><summary>정답 보기</summary>

정답: 2번 — Insteadof Trigger는 View에서의 INSERT, UPDATE, DELETE 동작을 정의하는 데 사용됩니다.

</details>

### Q6. Index를 생성할 때 고려해야 할 중요한 요소는 무엇인가요?
1) 데이터베이스의 크기
2) 쿼리의 복잡성
3) 인덱스가 필요한 열의 선택
4) 데이터베이스의 모든 테이블에 인덱스를 생성하는 것

<details><summary>정답 보기</summary>

정답: 3번 — Index를 생성할 때는 인덱스가 필요한 열의 선택이 중요합니다.

</details>

## 🔴 고급 문제

### Q7. PL/pgSQL에서 커서를 사용하는 주된 목적은 무엇인가요?
1) 데이터베이스의 무결성을 보장하기 위해
2) 대량의 데이터를 한 번에 처리하기 위해
3) 결과 집합을 한 행씩 처리하기 위해
4) 데이터베이스의 성능을 향상시키기 위해

<details><summary>정답 보기</summary>

정답: 3번 — PL/pgSQL의 커서는 결과 집합을 한 행씩 처리하기 위해 사용됩니다.

</details>

### Q8. Trigger를 사용할 때 발생할 수 있는 트레이드오프는 무엇인가요?
1) 성능 저하와 데이터 무결성 강화
2) 데이터 중복과 검색 속도 향상
3) 코드 복잡성과 데이터 저장소 절약
4) 쿼리 실행 시간 단축과 데이터 무결성 저하

<details><summary>정답 보기</summary>

정답: 1번 — Trigger를 사용하면 성능 저하가 발생할 수 있지만 데이터 무결성을 강화할 수 있습니다.

</details>