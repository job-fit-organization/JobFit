```markdown
# 📚 PostgreSQL Advanced Topics: Views, Indexes, Functions, Triggers

## 📌 참고 링크
- [PostgreSQL Tutorial](https://neon.com/postgresql/tutorial)
- [Getting Started with PostgreSQL](https://neon.com/postgresql/postgresql-getting-started)
- [What is PostgreSQL?](https://neon.com/postgresql/postgresql-tutorial/postgresql-what-is-postgresql)
- [Sample Database](https://neon.com/postgresql/postgresql-tutorial/postgresql-sample-database)
- [Install PostgreSQL](https://neon.com/postgresql/postgresql-getting-started/install-postgresql/)
- [Connect to PostgreSQL Database](https://neon.com/postgresql/postgresql-getting-started/connect-to-postgresql-database)
- [PL/pgSQL Functions](https://neon.com/postgresql/postgresql-plpgsql)
- [Triggers in PostgreSQL](https://neon.com/postgresql/postgresql-triggers)
- [Indexes in PostgreSQL](https://neon.com/postgresql/postgresql-indexes)
- [Views in PostgreSQL](https://neon.com/postgresql/postgresql-views)

---

## 🧩 슬라이드 1: 강의 개요
- **주제**: Views, Indexes, Functions, Triggers
- **학습 목표**: PostgreSQL의 고급 기능을 이해하고 성능 최적화 방법을 익힌다.
- **핵심 내용**: 
  - PL/pgSQL
  - Triggers
  - Views
  - Indexes

---

## 🔍 슬라이드 2: Views 개요
- **정의**: 데이터베이스 내에서 쿼리 결과를 가상의 테이블로 표현
- **장점**:
  - 복잡한 쿼리 단순화
  - 보안 강화: 특정 열 숨기기
- **예제**:
  ```sql
  CREATE VIEW active_users AS
  SELECT id, username FROM users WHERE active = TRUE;
  ```

---

## ⚡️ 슬라이드 3: Views의 성능 최적화
- **물리적 뷰 vs 물질화된 뷰**:
  - 물리적 뷰: 매번 쿼리 실행
  - 물질화된 뷰: 데이터 저장, 빠른 조회
- **예제**:
  ```sql
  CREATE MATERIALIZED VIEW sales_summary AS
  SELECT product_id, SUM(sales) FROM sales GROUP BY product_id;
  ```

---

## 🔑 슬라이드 4: Indexes 개요
- **정의**: 데이터 조회 성능 향상을 위한 구조
- **종류**:
  - B-Tree, Hash, GiST 등 다양한 인덱스
- **예제**:
  ```sql
  CREATE INDEX idx_users_username ON users(username);
  ```

---

## 🏎️ 슬라이드 5: Indexes의 성능 및 트레이드오프
- **장점**: 빠른 조회 성능
- **단점**: 
  - 추가적인 쓰기 작업 비용
  - 인덱스 관리 필요
- **예제**:
  ```sql
  -- 인덱스를 사용한 성능 테스트
  EXPLAIN ANALYZE SELECT * FROM users WHERE username = 'john_doe';
  ```

---

## ⚙️ 슬라이드 6: PL/pgSQL 함수 개요
- **정의**: PostgreSQL의 프로시저 언어
- **장점**: 복잡한 비즈니스 로직 구현 가능
- **예제**:
  ```sql
  CREATE FUNCTION get_user_count() RETURNS INTEGER AS $$
  BEGIN
      RETURN (SELECT COUNT(*) FROM users);
  END;
  $$ LANGUAGE plpgsql;
  ```

---

## 🔄 슬라이드 7: Triggers 개요
- **정의**: 특정 이벤트 발생 시 자동으로 실행되는 프로시저
- **종류**:
  - BEFORE, AFTER, INSTEAD OF Triggers
- **예제**:
  ```sql
  CREATE TRIGGER update_timestamp
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
  ```

---

## 🚦 슬라이드 8: Triggers의 성능과 최적화
- **장점**: 데이터 무결성 유지
- **단점**:
  - 성능 저하 가능성
  - 복잡한 트리거 로직은 디버깅 어려움
- **예제**: 
  ```sql
  CREATE OR REPLACE FUNCTION log_update() RETURNS TRIGGER AS $$
  BEGIN
      INSERT INTO user_logs(user_id, action) VALUES (OLD.id, 'updated');
      RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;
  ```

---

## 📈 슬라이드 9: 성능 최적화 전략 요약
- **Views**: 물질화된 뷰 사용
- **Indexes**: 필요한 인덱스만 생성
- **Functions**: 로직 단순화 및 재사용
- **Triggers**: 필요한 곳에만 사용, 복잡성 줄이기

---

## 🎯 슬라이드 10: Q&A
- 질문이 있으신가요? 📩
- **참고 자료**: 위의 링크를 통해 추가 학습 가능
```
