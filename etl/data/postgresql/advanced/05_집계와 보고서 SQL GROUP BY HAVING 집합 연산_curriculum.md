```markdown
# 집계와 보고서 SQL: GROUP BY, HAVING, 집합 연산

## 참고 링크
- [PostgreSQL Tutorial](https://neon.com/postgresql/tutorial)
- [PostgreSQL Getting Started](https://neon.com/postgresql/postgresql-getting-started)
- [PostgreSQL GROUP BY](https://neon.com/postgresql/postgresql-tutorial/postgresql-group-by)
- [PostgreSQL HAVING](https://neon.com/postgresql/postgresql-tutorial/postgresql-having)
- [PostgreSQL Set Operations](https://neon.com/postgresql/postgresql-tutorial/postgresql-union)

---

## 📊 슬라이드 1: 개요
- **주제**: 집계와 보고서 SQL
- **학습 목표**:
  - 집계 함수 및 그룹화 이해
  - 집합 연산 및 다차원 집계 활용

---

## 🛠️ 슬라이드 2: GROUP BY 기본 개념
- 데이터 집합을 특정 열에 따라 그룹화
- **예시**: 판매 데이터를 지역별로 집계
```sql
SELECT region, SUM(sales)
FROM sales_data
GROUP BY region;
```

---

## 📈 슬라이드 3: HAVING 절의 활용
- 집계 후 조건 필터링
- **예시**: 특정 지역에서의 판매량이 5000 이상인 경우
```sql
SELECT region, SUM(sales) AS total_sales
FROM sales_data
GROUP BY region
HAVING SUM(sales) > 5000;
```

---

## 🌐 슬라이드 4: UNION, INTERSECT, EXCEPT
- **UNION**: 두 쿼리의 결과를 합침
- **INTERSECT**: 두 쿼리의 공통 결과
- **EXCEPT**: 첫 번째 쿼리에서 두 번째 쿼리 결과 제외
```sql
SELECT customer_id FROM orders
UNION
SELECT customer_id FROM returns;
```

---

## 📊 슬라이드 5: GROUPING SETS
- 복잡한 다차원 집계 생성
- **예시**: 지역 및 제품별 집계
```sql
SELECT region, product, SUM(sales)
FROM sales_data
GROUP BY GROUPING SETS (
    (region, product),
    (region),
    (product)
);
```

---

## 📉 슬라이드 6: CUBE와 ROLLUP
- **CUBE**: 모든 조합의 집계 생성
- **ROLLUP**: 단계별 집계
```sql
SELECT region, product, SUM(sales)
FROM sales_data
GROUP BY CUBE (region, product);

SELECT region, product, SUM(sales)
FROM sales_data
GROUP BY ROLLUP (region, product);
```

---

## 🚀 슬라이드 7: 성능 최적화
- 인덱스 사용: GROUP BY 및 HAVING 절에 인덱스 적용
- 쿼리 계획 확인: `EXPLAIN` 명령어 활용
```sql
EXPLAIN SELECT region, SUM(sales)
FROM sales_data
GROUP BY region;
```

---

## ⚖️ 슬라이드 8: 트레이드오프
- 집계 함수 사용 시 성능 저하 가능성
- **사례**: 대규모 데이터베이스에서 GROUP BY 성능 저하
- 해결 방안: 데이터 샤딩, 파티셔닝

---

## 📚 슬라이드 9: 실무 활용 사례
- 주간 판매 보고서 자동화
- 월별 고객 분석 보고서 생성
- 복합 조건 집계 쿼리 작성

---

## 🔍 슬라이드 10: Q&A
- 질문 및 토론 시간
- 추가 자료 요청 가능
```
