```markdown
# PostgreSQL 고급 조회: 서브쿼리와 CTE 📊

---

## 📚 참고 링크
- [PostgreSQL 튜토리얼](https://neon.com/postgresql/tutorial)
- [PostgreSQL 시작하기](https://neon.com/postgresql/postgresql-getting-started)
- [PostgreSQL 서브쿼리](https://neon.com/postgresql/postgresql-tutorial/postgresql-subquery)
- [PostgreSQL CTE](https://neon.com/postgresql/postgresql-tutorial/postgresql-cte)

---

## 🎯 학습 목표
- 서브쿼리와 상관 서브쿼리를 구분할 수 있다.
- CTE(공통 테이블 표현식)와 재귀 CTE를 활용할 수 있다.

---

## 🔍 서브쿼리란?
- **서브쿼리**: 다른 쿼리의 내부에서 실행되는 쿼리입니다.
- 주로 **WHERE** 또는 **FROM** 절에서 사용됩니다.

```sql
SELECT title FROM film 
WHERE film_id IN (SELECT film_id FROM film_category WHERE category_id = 1);
```

---

## 🔄 상관 서브쿼리
- **상관 서브쿼리**: 외부 쿼리의 값에 의존하는 서브쿼리입니다.
- 두 번 실행됩니다.

```sql
SELECT title FROM film f
WHERE EXISTS (SELECT * FROM film_category fc WHERE fc.film_id = f.film_id AND category_id = 1);
```

---

## 🗃️ ANY, ALL, EXISTS
- **ANY**: 조건에 맞는 값 중 하나라도 참이면 TRUE.
- **ALL**: 모든 조건을 만족해야 TRUE.
- **EXISTS**: 서브쿼리가 결과를 반환하면 TRUE.

```sql
SELECT * FROM film WHERE rental_rate < ANY (SELECT rental_rate FROM film);
SELECT * FROM film WHERE rental_rate > ALL (SELECT rental_rate FROM film);
```

---

## 📊 CTE (공통 테이블 표현식)
- **CTE**: 쿼리 내에서 임시 결과 집합을 생성합니다.
- 가독성을 높이고 복잡한 쿼리를 단순화합니다.

```sql
WITH action_films AS (
    SELECT title, length 
    FROM film 
    WHERE category_id = 1
)
SELECT * FROM action_films;
```

---

## 🔄 재귀 CTE
- 자기 참조를 통해 **계층적 데이터**를 조회합니다.
- 예: 조직도, 파일 시스템.

```sql
WITH RECURSIVE org_chart AS (
    SELECT id, name FROM employees WHERE manager_id IS NULL
    UNION ALL
    SELECT e.id, e.name FROM employees e
    JOIN org_chart o ON e.manager_id = o.id
)
SELECT * FROM org_chart;
```

---

## 💡 CTE의 장점
- 쿼리 가독성 향상
- 복잡한 쿼리를 소규모 쿼리로 나눌 수 있음
- 재귀 쿼리 사용 가능

---

## ✨ 실습: CTE 사용해보기
1. **CTE 생성**: 특정 카테고리에 속하는 영화 목록을 가져오기
2. **주 쿼리에서 CTE 사용**: 영화의 제목과 길이를 가져오기

```sql
WITH action_films AS (
    SELECT title, length FROM film WHERE category_id = 1
)
SELECT * FROM action_films;
```

---

## 🔚 마무리
- 서브쿼리와 CTE의 활용법을 통해 복잡한 데이터 조회를 간편하게!
- 실습을 통해 직접 해보세요! 🚀

---
```