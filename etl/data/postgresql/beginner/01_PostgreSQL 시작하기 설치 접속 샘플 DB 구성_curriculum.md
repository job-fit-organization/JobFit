```markdown
# PostgreSQL 시작하기: 설치, 접속, 샘플 DB 구성

## 참고 링크
- [PostgreSQL 개요](https://neon.com/postgresql/tutorial)
- [PostgreSQL 설치](https://neon.com/postgresql/postgresql-getting-started/install-postgresql/)
- [PostgreSQL 데이터베이스 접속](https://neon.com/postgresql/postgresql-getting-started/connect-to-postgresql-database)
- [샘플 데이터베이스 로드](https://neon.com/postgresql/postgresql-getting-started/load-postgresql-sample-database)

---

## 1. PostgreSQL이란? 📚
- 오픈 소스 관계형 데이터베이스 관리 시스템
- ACID 준수, 확장성, 다양한 데이터 타입 지원
- 웹 애플리케이션, 데이터 분석 등에 널리 사용됨

---

## 2. PostgreSQL 설치하기 💻
### Windows:
1. [PostgreSQL 다운로드](https://neon.com/postgresql/getting-started/install-postgresql/)
2. 설치 마법사 실행 후 지침에 따라 진행
3. 기본 포트 5432 확인

### macOS/Linux:
- 각 운영체제에 맞는 설치 방법을 따라하세요.

---

## 3. PostgreSQL 접속하기 🔑
- psql 명령어를 사용하여 PostgreSQL 서버에 접속
- 기본 명령어:
  ```bash
  psql -U 사용자명 -d 데이터베이스명
  ```

---

## 4. 샘플 데이터베이스 소개 🗃️
- `dvdrental`: 영화 대여점 데이터베이스
- 연습을 위해 필요한 데이터베이스로, 다양한 쿼리 연습이 가능

---

## 5. 샘플 데이터베이스 로드하기 ⬇️
1. psql에 접속 후 아래 명령어 실행:
   ```sql
   \i /path/to/dvdrental.sql
   ```
2. 데이터베이스가 성공적으로 로드되면, 확인을 위해 테이블 리스트를 조회할 수 있음:
   ```sql
   \dt
   ```

---

## 6. 데이터 조회하기 🔍
- 기본 SELECT 문법:
  ```sql
  SELECT * FROM customers;
  ```
- 특정 컬럼 조회:
  ```sql
  SELECT first_name, last_name FROM customers;
  ```

---

## 7. 데이터 필터링하기 🚦
- WHERE 절 사용:
  ```sql
  SELECT * FROM customers WHERE country = 'USA';
  ```
- 여러 조건 결합:
  ```sql
  SELECT * FROM customers WHERE country = 'USA' AND active = true;
  ```

---

## 8. 데이터 정렬하기 📊
- ORDER BY 사용:
  ```sql
  SELECT * FROM customers ORDER BY last_name ASC;
  ```
- 내림차순 정렬:
  ```sql
  SELECT * FROM customers ORDER BY last_name DESC;
  ```

---

## 9. 데이터 추가하기 ➕
- INSERT 문법:
  ```sql
  INSERT INTO customers (first_name, last_name, country) VALUES ('John', 'Doe', 'USA');
  ```

---

## 10. 요약 및 다음 단계 🔄
- PostgreSQL 설치, 접속, 데이터 조회 및 조작 방법 학습
- 다음 단계: JOIN, GROUP BY 등 고급 쿼리 학습
- 추가 자료: [PostgreSQL 공식 문서](https://neon.com/postgresql/tutorial)
```
