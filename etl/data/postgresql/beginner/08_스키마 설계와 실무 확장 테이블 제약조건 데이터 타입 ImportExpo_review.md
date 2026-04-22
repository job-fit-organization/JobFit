# 검수 결과 — 초급자 강의자료
> Step 8: 스키마 설계와 실무 확장: 테이블, 제약조건, 데이터 타입, Import/Export

### 검수 결과: ⚠️ 경미한 문제

**종합 의견**: 전반적으로 초급자가 이해하기에 필요한 핵심 개념(테이블/제약조건/데이터 타입/Import·Export)을 담고 있으며 큰 사실 오류는 없습니다. 다만 `ALTER COLUMN ... TYPE TEXT`처럼 표현이 부정확하거나(문법 누락 가능), `COPY` 경로/권한 및 OS 경로 사용 등 초급자에게 혼동될 수 있는 부분이 있어 완전한 학습용으로는 다소 불충분합니다.

**지적 사항**:
- `ALTER TABLE 학생 ALTER COLUMN 이름 TYPE TEXT;`는 PostgreSQL 문법상 `ALTER COLUMN ... TYPE ...`는 가능하지만(버전/상황에 따라) 초급자 관점에서 혼동될 수 있으며, 보통 `ALTER COLUMN 이름 TYPE TEXT;` 외에 `USING` 필요 여부(타입 변환 시) 등 핵심 주의사항이 빠져 있습니다.
- `COPY ... FROM '/path/to/file.csv'` / `COPY ... TO '/path/to/output.csv'`는 PostgreSQL 설정 및 실행 위치(서버 경로)·권한에 따라 동작이 달라 초급자에게 “항상 되는” 것처럼 보일 수 있습니다. 서버 경로 및 권한, 또는 클라이언트에서 하는 방식(`\copy`) 언급이 없어서 설명이 불완전합니다.