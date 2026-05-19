# API - Skills

## 1. 기술 목록 조회

```http
GET /api/skills?keyword={keyword}&category={category}&difficulty={difficulty}&sort={sort}
```

## 2. 기술 상세 조회

```http
GET /api/skills/{skillId}
```

## 3. 기술 관련 직무 조회

```http
GET /api/skills/{skillId}/related-jobs
```

## 4. 설계 메모

- 기술 목록 페이지에서는 검색, 필터, 정렬 조건이 필요하다.
- 기술 카드는 기술명, 설명, 관련 직무, 난이도를 포함한다.
