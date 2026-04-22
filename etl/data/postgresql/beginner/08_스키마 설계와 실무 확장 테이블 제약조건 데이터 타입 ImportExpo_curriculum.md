```markdown
# 📚 스키마 설계와 실무 확장: 테이블, 제약조건, 데이터 타입, Import/Export

## 참고 링크
- [PostgreSQL 튜토리얼](https://neon.com/postgresql/tutorial)
- [PostgreSQL 시작하기](https://neon.com/postgresql/postgresql-getting-started)
- [PostgreSQL 데이터 타입](https://neon.com/postgresql/postgresql-tutorial/postgresql-data-types)
- [CSV Import/Export](https://neon.com/postgresql/postgresql-tutorial/import-csv-file-into-posgresql-table)
- [CSV Export](https://neon.com/postgresql/postgresql-tutorial/export-postgresql-table-to-csv-file)

---

## 📖 1. PostgreSQL 소개
- **PostgreSQL**는 오픈 소스 관계형 데이터베이스 시스템입니다.
- 다양한 데이터 타입과 강력한 쿼리 기능을 지원합니다.

---

## 🛠️ 2. 테이블 생성하기
- **CREATE TABLE** 명령어로 새로운 테이블을 생성할 수 있습니다.
```sql
CREATE TABLE 학생 (
    id SERIAL PRIMARY KEY,
    이름 VARCHAR(50) NOT NULL,
    나이 INT,
    등록일 TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## ✏️ 3. 테이블 수정하기
- **ALTER TABLE**로 테이블을 수정할 수 있습니다.
- 열 추가, 삭제, 데이터 타입 변경이 가능합니다.
```sql
ALTER TABLE 학생 ADD COLUMN 이메일 VARCHAR(100);
ALTER TABLE 학생 DROP COLUMN 나이;
ALTER TABLE 학생 ALTER COLUMN 이름 TYPE TEXT;
```

---

## ❌ 4. 테이블 삭제하기
- **DROP TABLE**로 테이블을 삭제할 수 있습니다.
- **TRUNCATE TABLE**로 데이터만 삭제할 수 있습니다.
```sql
DROP TABLE 학생;
TRUNCATE TABLE 학생;
```

---

## 🔑 5. 제약 조건 이해하기
- **PRIMARY KEY**: 고유 식별자
- **FOREIGN KEY**: 다른 테이블과의 관계 설정
- **CHECK, UNIQUE, NOT NULL**: 데이터 제약 조건
```sql
CREATE TABLE 수업 (
    id SERIAL PRIMARY KEY,
    이름 VARCHAR(100) UNIQUE NOT NULL,
    학점 INT CHECK (학점 >= 0 AND 학점 <= 4)
);
```

---

## 📊 6. 다양한 데이터 타입
- PostgreSQL은 여러 데이터 타입을 지원합니다.
  - **문자형**: CHAR, VARCHAR, TEXT
  - **숫자형**: INT, DECIMAL, SERIAL
  - **날짜시간형**: DATE, TIMESTAMP
  - **JSON, UUID 등**
```sql
CREATE TABLE 제품 (
    id SERIAL PRIMARY KEY,
    이름 VARCHAR(100),
    가격 DECIMAL(10, 2),
    속성 JSON
);
```

---

## 📥 7. CSV 파일 가져오기
- CSV 파일로부터 데이터를 가져오는 방법입니다.
```sql
COPY 학생(이름, 이메일) FROM '/path/to/file.csv' DELIMITER ',' CSV HEADER;
```

---

## 📤 8. CSV 파일 내보내기
- 데이터베이스의 테이블 데이터를 CSV 파일로 내보낼 수 있습니다.
```sql
COPY 학생 TO '/path/to/output.csv' DELIMITER ',' CSV HEADER;
```

---

## 🎓 9. 실습 후 정리
- 테이블 설계 및 데이터를 조작하는 기본적인 방법을 학습했습니다.
- 제약 조건과 데이터 타입에 대한 이해도를 높였습니다.

---

## 🚀 10. 다음 단계
- 더 깊이 있는 SQL 쿼리와 데이터베이스 관리 기법 학습
- 다양한 데이터 분석 도구와의 연동 실습
```
