# 검수 결과 — 경력자 강의자료
> Step 8: 스키마 설계와 실무 확장: 테이블, 제약조건, 데이터 타입, Import/Export

### 검수 결과: ⚠️ 경미한 문제

**종합 의견**: 전체 흐름(테이블/제약/데이터타입/CSV/EXPLAIN/인덱스)과 코딩 예제는 대체로 정확하고 목표 달성에도 큰 문제는 없습니다. 다만 일부 설명이 PostgreSQL 특성(특히 FK 추가 구문, JSONB 성능/인덱싱, COPY 경로/권한 등)을 단정적으로 단순화해 오해 소지가 있습니다.

**지적 사항**:
- **FK 예시가 부정확/불완전**: `ALTER TABLE employees ADD CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES departments(id);`는 `employees`에 `department_id` 컬럼이 존재한다는 전제가 있어야 합니다(강의 문맥에서 사전 생성/전제 언급이 없음).
- **JSONB 인덱스 관련 표현의 단정성**: “JSONB는 인덱스 지원으로 검색 성능 향상”은 맞지만, 어떤 형태로 인덱싱(예: GIN/GiST, expression index)하는지에 따라 성능이 크게 달라집니다. 현재 문구는 그 조건을 충분히 설명하지 않아 오해 가능성이 있습니다.
- **COPY 예시의 실행 조건 누락**: `COPY employees FROM '/path/to/employees.csv' ...`는 서버의 파일 경로 및 권한(superuser/appropriate privileges) 제약이 있습니다. 로컬 파일처럼 동작한다고 오해할 여지가 있어 보입니다. (프로덕션에서는 `\copy` 등도 자주 쓰임)