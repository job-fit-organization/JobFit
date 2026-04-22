```markdown
# 데이터 변경과 무결성: INSERT, UPDATE, DELETE, Transaction

## 참고 링크
- [PostgreSQL Tutorial](https://neon.com/postgresql/tutorial)
- [PostgreSQL Getting Started](https://neon.com/postgresql/postgresql-getting-started)
- [PostgreSQL What is PostgreSQL](https://neon.com/postgresql/postgresql-tutorial/postgresql-what-is-postgresql)
- [PostgreSQL Sample Database](https://neon.com/postgresql/postgresql-tutorial/postgresql-sample-database)
- [PostgreSQL Insert Multiple Rows](https://neon.com/postgresql/postgresql-tutorial/postgresql-insert-multiple-rows)
- [PostgreSQL Merge](https://neon.com/postgresql/postgresql-tutorial/postgresql-merge)
- [PostgreSQL Transaction](https://neon.com/postgresql/postgresql-tutorial/postgresql-transaction)

---

## 슬라이드 1: 데이터 변경의 중요성 🔑
- 데이터베이스에서 데이터의 안전한 추가, 수정, 삭제는 필수
- 무결성을 보장하여 신뢰할 수 있는 데이터 유지
- 트랜잭션을 통해 데이터의 일관성 확보

---

## 슬라이드 2: INSERT 문법 및 예제 📥
- 기본 문법:
  ```sql
  INSERT INTO 테이블명 (열1, 열2) VALUES (값1, 값2);
  ```
- 다중 행 삽입 예제:
  ```sql
  INSERT INTO inventory (id, name, price) VALUES
  (1, 'Apple', 0.60),
  (2, 'Banana', 0.50);
  ```
- 성능 최적화: 다중 행 삽입은 단일 삽입에 비해 더 효율적

---

## 슬라이드 3: UPDATE 문법 및 예제 ✏️
- 기본 문법:
  ```sql
  UPDATE 테이블명 SET 열1 = 값1 WHERE 조건;
  ```
- JOIN을 이용한 업데이트:
  ```sql
  UPDATE inventory i
  SET price = p.new_price
  FROM price_updates p
  WHERE i.id = p.id;
  ```
- 성능 고려: WHERE 절 최적화 필요

---

## 슬라이드 4: DELETE 문법 및 예제 🗑️
- 기본 문법:
  ```sql
  DELETE FROM 테이블명 WHERE 조건;
  ```
- JOIN을 이용한 삭제:
  ```sql
  DELETE FROM inventory i
  USING sales s
  WHERE i.id = s.product_id AND s.date < '2023-01-01';
  ```
- 성능 고려: DELETE CASCADE 사용 시 주의

---

## 슬라이드 5: UPSERT의 개념 및 사용 🆕
- UPSERT란: 충돌 시 업데이트 또는 무시
- 문법 예제:
  ```sql
  INSERT INTO inventory (id, name, quantity)
  VALUES (1, 'Apple', 100)
  ON CONFLICT (id) DO UPDATE
  SET quantity = inventory.quantity + EXCLUDED.quantity;
  ```
- 장점: 데이터 무결성을 유지하면서 효율적인 삽입 및 수정

---

## 슬라이드 6: MERGE 문법 및 활용 사례 🔄
- MERGE 문법 소개:
  ```sql
  MERGE INTO target_table AS t
  USING source_table AS s
  ON t.id = s.id
  WHEN MATCHED THEN
    UPDATE SET t.name = s.name
  WHEN NOT MATCHED THEN
    INSERT (id, name) VALUES (s.id, s.name);
  ```
- 성능 고려: ON 조건 최적화 및 인덱싱 필요

---

## 슬라이드 7: 트랜잭션의 중요성 ⚖️
- 트랜잭션은 ACID 원칙을 따름
  - 원자성 (Atomicity)
  - 일관성 (Consistency)
  - 고립성 (Isolation)
  - 지속성 (Durability)
- 예제:
  ```sql
  BEGIN;
  INSERT INTO accounts (balance) VALUES (100);
  UPDATE accounts SET balance = balance - 50 WHERE id = 1;
  COMMIT;
  ```

---

## 슬라이드 8: 트랜잭션 관리 및 오류 처리 🚨
- ROLLBACK을 통한 오류 처리:
  ```sql
  BEGIN;
  -- 작업 수행
  IF 오류 발생 THEN
      ROLLBACK;
  ELSE
      COMMIT;
  END IF;
  ```
- 트랜잭션 격리 수준 설정: READ COMMITTED, SERIALIZABLE 등

---

## 슬라이드 9: 성능 및 최적화 고려사항 ⚙️
- 인덱스 활용: WHERE 절 및 JOIN 조건에 인덱스 적용
- 배치 처리: 대량 데이터 업데이트 시 배치 삽입/업데이트 고려
- EXPLAIN 명령어 사용: 쿼리 성능 분석
  ```sql
  EXPLAIN SELECT * FROM inventory WHERE price > 10;
  ```

---

## 슬라이드 10: 결론 및 Q&A ❓
- 데이터 변경 및 무결성 관리의 중요성
- UPSERT 및 MERGE의 활용
- 트랜잭션과 성능 최적화의 고려사항
- 질문 있으신가요?

---
```