# ============================================================
# 전체 서비스 제공을 위한 PostgreSQL + pgvector 데이터베이스
# - 관계형 DB: 직무, 기술, 로드맵, 커리큘럼, 퀴즈 관리
# - Vector DB: 강의자료 생성을 위해 참고할 웹문서 임베딩 저장
# 기반 이미지: pgvector/pgvector:pg16
# ============================================================

FROM pgvector/pgvector:pg16

# init 디렉토리에 있는 SQL 파일들은 컨테이너 최초 실행 시 자동 적용됩니다.
COPY ./init/ /docker-entrypoint-initdb.d/