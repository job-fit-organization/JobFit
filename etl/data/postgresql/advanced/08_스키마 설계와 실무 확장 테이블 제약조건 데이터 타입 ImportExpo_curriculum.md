```markdown
# 스키마 설계와 실무 확장: 테이블, 제약조건, 데이터 타입, Import/Export

## 참고 링크
- [PostgreSQL Tutorial](https://neon.com/postgresql/tutorial)
- [Getting Started with PostgreSQL](https://neon.com/postgresql/postgresql-getting-started)
- [What is PostgreSQL?](https://neon.com/postgresql/postgresql-tutorial/postgresql-what-is-postgresql)
- [Sample Database](https://neon.com/postgresql/postgresql-tutorial/postgresql-sample-database)
- [Install PostgreSQL](https://neon.com/postgresql/postgresql-getting-started/install-postgresql/)
- [Connect to PostgreSQL Database](https://neon.com/postgresql/postgresql-getting-started/connect-to-postgresql-database)
- [Load Sample Database](https://neon.com/postgresql/postgresql-getting-started/load-postgresql-sample-database)

---

## 🎯 강의 목표
- 테이블 설계 및 생성
- 제약조건과 데이터 타입 선택
- CSV Import/Export 수행

---

## 📊 테이블 설계: CREATE TABLE
- 기본 구문
```sql
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    hire_date DATE DEFAULT CURRENT_DATE
);
```
- 내부 동작: SERIAL은 자동 증가, PK는 중복 방지 기능 제공

---

## 🔄 테이블 변경: ALTER TABLE
- 컬럼 추가 및 삭제
```sql
ALTER TABLE employees ADD COLUMN salary NUMERIC(10, 2);
ALTER TABLE employees DROP COLUMN email;
```
- 성능 고려: 불필요한 컬럼 제거로 쿼리 최적화 가능

---

## 🔒 제약조건: PRIMARY KEY, FOREIGN KEY
- 예시: 참조 무결성 보장
```sql
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

ALTER TABLE employees ADD CONSTRAINT fk_department
FOREIGN KEY (department_id) REFERENCES departments(id);
```
- 트레이드오프: FK 제약조건은 성능에 영향, 무결성 보장

---

## ⚙️ 데이터 타입 선택
- 문자형, 숫자형, 날짜시간형
- JSON, UUID, ARRAY 등 복합 데이터 타입 활용
```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    attributes JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```
- 성능 최적화: JSONB는 인덱스 지원으로 검색 성능 향상

---

## 📥 CSV Import/Export
- 데이터 가져오기 및 내보내기
```sql
COPY employees FROM '/path/to/employees.csv' DELIMITER ',' CSV HEADER;
COPY employees TO '/path/to/employees_export.csv' DELIMITER ',' CSV HEADER;
```
- 성능 최적화: 대량 데이터 처리 시 COPY 명령어 사용

---

## 🔍 성능 진단: EXPLAIN
- 쿼리 성능 분석
```sql
EXPLAIN ANALYZE SELECT * FROM employees WHERE hire_date > '2020-01-01';
```
- 트레이드오프: 쿼리 실행 계획 분석으로 인덱스 추가 여부 결정

---

## 📈 성능 최적화 기법
- 인덱스 추가
```sql
CREATE INDEX idx_hire_date ON employees(hire_date);
```
- 내부 동작: 인덱스는 데이터 검색 속도를 향상시키지만, 쓰기 성능 감소

---

## 🧩 결론
- 스키마 설계 및 제약조건, 데이터 타입 선택은 성과에 직접적 영향을 미침
- 성능 최적화는 비즈니스 요구에 따라 균형 있게 조절 필요
- 실무에서의 적용 사례를 통해 더 깊이 이해하기

---

## 📚 추가 학습 자료
- [PostgreSQL Performance Tuning](https://neon.com/postgresql/tutorial)
- [PostgreSQL Indexing](https://neon.com/postgresql/postgresql-tutorial/postgresql-indexes)
```
