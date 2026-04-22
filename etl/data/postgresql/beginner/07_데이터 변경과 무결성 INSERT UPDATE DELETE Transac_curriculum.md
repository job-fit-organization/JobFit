```markdown
# 데이터 변경과 무결성: INSERT, UPDATE, DELETE, Transaction

## 참고 링크
- [PostgreSQL Tutorial](https://neon.com/postgresql/tutorial)
- [Getting Started with PostgreSQL](https://neon.com/postgresql/postgresql-getting-started)
- [PostgreSQL What is PostgreSQL](https://neon.com/postgresql/postgresql-tutorial/postgresql-what-is-postgresql)
- [Sample Database](https://neon.com/postgresql/postgresql-tutorial/postgresql-sample-database)

---

## 슬라이드 1: 데이터베이스란? 📚
- 데이터베이스는 정보를 저장하고 관리하는 시스템입니다.
- PostgreSQL은 강력하고 오픈 소스인 관계형 데이터베이스 관리 시스템(RDBMS)입니다.

---

## 슬라이드 2: 데이터 변경의 기본 개념 🛠️
- 데이터베이스에서 데이터를 변경하는 주요 작업은:
  - **INSERT**: 데이터 추가
  - **UPDATE**: 데이터 수정
  - **DELETE**: 데이터 삭제

---

## 슬라이드 3: 데이터 추가 (INSERT) 📥
- 데이터베이스에 새로운 데이터를 추가하는 방법입니다.
```sql
INSERT INTO 테이블명 (열1, 열2) 
VALUES (값1, 값2);
```
- 예시:
```sql
INSERT INTO accounts (name, balance) 
VALUES ('Alice', 10000);
```

---

## 슬라이드 4: 여러 행 추가 (INSERT Multiple Rows) 📊
- 한 번에 여러 행을 추가할 수 있습니다.
```sql
INSERT INTO 테이블명 (열1, 열2) 
VALUES (값1, 값2), (값3, 값4);
```
- 예시:
```sql
INSERT INTO accounts (name, balance) 
VALUES ('Bob', 20000), ('Charlie', 15000);
```

---

## 슬라이드 5: 데이터 수정 (UPDATE) 🔄
- 기존 데이터를 수정하는 방법입니다.
```sql
UPDATE 테이블명 
SET 열1 = 새로운값 
WHERE 조건;
```
- 예시:
```sql
UPDATE accounts 
SET balance = 12000 
WHERE name = 'Alice';
```

---

## 슬라이드 6: 데이터 삭제 (DELETE) ❌
- 데이터를 삭제하는 방법입니다.
```sql
DELETE FROM 테이블명 
WHERE 조건;
```
- 예시:
```sql
DELETE FROM accounts 
WHERE name = 'Charlie';
```

---

## 슬라이드 7: UPSERT란? 🔄💼
- UPSERT는 데이터가 존재하면 업데이트하고, 존재하지 않으면 삽입하는 기능입니다.
```sql
INSERT INTO 테이블명 (열1, 열2) 
VALUES (값1, 값2)
ON CONFLICT (열1) 
DO UPDATE SET 열2 = 새로운값;
```
- 예시:
```sql
INSERT INTO accounts (name, balance) 
VALUES ('Alice', 13000)
ON CONFLICT (name) 
DO UPDATE SET balance = EXCLUDED.balance;
```

---

## 슬라이드 8: 트랜잭션의 이해 💼
- 트랜잭션은 데이터 변경 작업의 단위입니다.
- **BEGIN**: 트랜잭션 시작
- **COMMIT**: 변경 사항 확정
- **ROLLBACK**: 변경 사항 취소
```sql
BEGIN;
UPDATE accounts SET balance = balance - 1000 WHERE name = 'Alice';
COMMIT; -- 또는 ROLLBACK;
```

---

## 슬라이드 9: 트랜잭션의 중요성 🔒
- ACID 속성:
  - **Atomicity**: 모든 작업이 완료되거나 전혀 수행되지 않음
  - **Consistency**: 데이터가 유효하게 유지됨
  - **Isolation**: 트랜잭션 간의 간섭 없음
  - **Durability**: 완료된 트랜잭션은 영구적으로 유지됨

---

## 슬라이드 10: 요약 및 다음 단계 🚀
- 데이터 변경: INSERT, UPDATE, DELETE의 기본 이해
- UPSERT와 트랜잭션의 중요성
- 다음 단계: 더 복잡한 쿼리와 데이터베이스 설계 배우기!

---
```