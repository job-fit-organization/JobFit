# API - Jobs

## 1. 직무 목록 조회

```http
GET /api/jobs
```

## 2. 직무 상세 조회

```http
GET /api/jobs/{jobId}
```

## 3. 직무별 기술 로드맵 조회

```http
GET /api/jobs/{jobId}/roadmap?userId={userId}
```

## 4. 사용자 선택 직무 저장

```http
POST /api/users/{userId}/selected-job
```

```json
{
  "jobId": 1
}
```
