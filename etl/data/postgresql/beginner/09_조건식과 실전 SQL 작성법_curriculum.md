```markdown
# 강의자료: 조건식과 실전 SQL 작성법

## 참고 링크
- [PostgreSQL Tutorial](https://neon.com/postgresql/tutorial)
- [Getting Started with PostgreSQL](https://neon.com/postgresql/postgresql-getting-started)
- [PostgreSQL What is PostgreSQL](https://neon.com/postgresql/postgresql-tutorial/postgresql-what-is-postgresql)
- [PostgreSQL Sample Database](https://neon.com/postgresql/postgresql-tutorial/postgresql-sample-database)

---

## 슬라이드 1: 🎓 강의 소개
- 주제: 조건식과 실전 SQL 작성법
- 목표: CASE, COALESCE, NULLIF, CAST를 활용하여 데이터 정제 및 NULL 처리

---

## 슬라이드 2: 📊 SQL 데이터 정제란?
- SQL 데이터 정제는 데이터의 일관성과 정확성을 유지하기 위해 수행됩니다.
- 일반적으로 NULL 값 처리, 데이터 형식 변환 등을 포함합니다.

---

## 슬라이드 3: ❓ NULL 값 처리
- NULL 값은 데이터베이스에서 '값이 없음'을 의미합니다.
- NULL이 포함된 데이터는 결과에 영향을 미칠 수 있습니다.

---

## 슬라이드 4: 🔍 CASE 문법
```sql
SELECT 
    name,
    CASE 
        WHEN score >= 90 THEN 'A'
        WHEN score >= 80 THEN 'B'
        ELSE 'C'
    END AS grade
FROM students;
```
- 주어진 조건에 따라 다양한 결과를 반환할 수 있습니다.

---

## 슬라이드 5: 🤝 COALESCE 함수
```sql
SELECT 
    name,
    COALESCE(phone, '전화번호 없음') AS phone_number
FROM contacts;
```
- 여러 인수 중 첫 번째 NULL이 아닌 값을 반환합니다.

---

## 슬라이드 6: 🔄 NULLIF 함수
```sql
SELECT 
    price,
    NULLIF(price, 0) AS price_or_null
FROM products;
```
- 두 인수가 같으면 NULL을 반환하고, 다르면 첫 번째 값을 반환합니다.

---

## 슬라이드 7: 🔣 CAST 함수
```sql
SELECT 
    name, 
    CAST(age AS VARCHAR) AS age_str
FROM users;
```
- 데이터 타입을 변환하는 데 사용됩니다.

---

## 슬라이드 8: 📚 실습 예제
- 학생 테이블에서 성적에 따라 등급을 매기고, 전화번호가 NULL인 경우 기본값을 설정해보세요!
```sql
SELECT 
    name,
    CASE 
        WHEN score >= 90 THEN 'A'
        ELSE 'B'
    END AS grade,
    COALESCE(phone, '전화번호 없음') AS phone_number
FROM students;
```

---

## 슬라이드 9: 🔑 요약
- CASE, COALESCE, NULLIF, CAST를 통해 SQL 쿼리에서 NULL을 처리하고 데이터 형식을 정제할 수 있습니다.
- 이러한 기능들을 활용해 유용한 데이터를 추출하세요!

---

## 슬라이드 10: 📅 다음 단계
- 실습을 통해 배운 내용을 적용해보세요!
- 관련 자료를 확인하여 더 깊이 있는 SQL 지식을 쌓아보세요.
```
