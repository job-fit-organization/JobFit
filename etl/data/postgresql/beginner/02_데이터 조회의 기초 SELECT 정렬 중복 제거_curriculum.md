```markdown
# 데이터 조회의 기초: SELECT, 정렬, 중복 제거

## 📚 참고 링크
- [PostgreSQL Tutorial](https://neon.com/postgresql/tutorial)
- [PostgreSQL Getting Started](https://neon.com/postgresql/postgresql-getting-started)
- [PostgreSQL Sample Database](https://neon.com/postgresql/postgresql-tutorial/postgresql-sample-database)

---

## 1️⃣ 강의 개요
- **주제**: 데이터 조회의 기초
- **학습목표**: 단일 테이블에서 필요한 컬럼을 조회하고, 별칭·정렬·중복 제거를 적용할 수 있다.
- **핵심 내용**: SELECT, Column Aliases, ORDER BY, SELECT DISTINCT

---

## 2️⃣ SELECT 문 기초
- **기본 구문**:
  ```sql
  SELECT column1, column2 FROM table_name;
  ```
- **예시**:
  ```sql
  SELECT name, age FROM students;
  ```
- 📌 **설명**: 위의 예시는 `students` 테이블에서 `name`과 `age` 컬럼의 데이터를 조회합니다.

---

## 3️⃣ Column Aliases 사용하기
- **별칭 구문**:
  ```sql
  SELECT column_name AS alias_name FROM table_name;
  ```
- **예시**:
  ```sql
  SELECT name AS student_name FROM students;
  ```
- ✨ **설명**: `student_name`이라는 별칭을 사용하여 출력 결과를 더 이해하기 쉽게 만듭니다.

---

## 4️⃣ 데이터 정렬하기: ORDER BY
- **정렬 구문**:
  ```sql
  SELECT column1, column2 FROM table_name ORDER BY column1 ASC|DESC;
  ```
- **예시**:
  ```sql
  SELECT name, age FROM students ORDER BY age DESC;
  ```
- 🔼 **설명**: `age` 기준으로 내림차순 정렬하여 학생 정보를 표시합니다.

---

## 5️⃣ 중복 제거하기: SELECT DISTINCT
- **중복 제거 구문**:
  ```sql
  SELECT DISTINCT column_name FROM table_name;
  ```
- **예시**:
  ```sql
  SELECT DISTINCT age FROM students;
  ```
- 🚫 **설명**: `students` 테이블에서 중복되지 않는 `age` 값만 조회합니다.

---

## 6️⃣ WHERE 절로 조건 추가하기
- **조건 구문**:
  ```sql
  SELECT column1 FROM table_name WHERE condition;
  ```
- **예시**:
  ```sql
  SELECT name FROM students WHERE age > 20;
  ```
- 🔍 **설명**: `age`가 20보다 큰 학생의 이름을 조회합니다.

---

## 7️⃣ 여러 조건 결합하기: AND, OR
- **AND 조건**:
  ```sql
  SELECT * FROM table_name WHERE condition1 AND condition2;
  ```
- **OR 조건**:
  ```sql
  SELECT * FROM table_name WHERE condition1 OR condition2;
  ```
- **예시**:
  ```sql
  SELECT name FROM students WHERE age > 20 AND grade = 'A';
  ```
- 📊 **설명**: 20세 이상이면서 성적이 'A'인 학생을 조회합니다.

---

## 8️⃣ 간단한 실습 문제
- **문제**: `students` 테이블에서 `name`과 `age`를 조회하되, `age`가 18세 이상인 학생만 출력하고, 나이를 내림차순으로 정렬하세요.
- **정답 예시**:
  ```sql
  SELECT name, age FROM students WHERE age >= 18 ORDER BY age DESC;
  ```

---

## 9️⃣ Q&A 시간
- 여러분의 질문을 받습니다! 🤔
- 데이터 조회, SQL 문법 등에 대해 궁금한 점이 있다면 자유롭게 물어보세요.

---

## 🔚 마무리
- **오늘 배운 내용 요약**
  - 데이터 조회 기본
  - Column Aliases 사용법
  - 데이터 정렬 방법
  - 중복 제거 방법
- 다음 시간에는 JOIN을 통한 데이터 결합에 대해 배워봅니다! 🚀
```