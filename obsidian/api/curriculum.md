# API - Curriculum

## 1. 기술별 커리큘럼 조회

```http
GET /api/skills/{skillId}/curriculums?userId={userId}
```

## 2. 커리큘럼 상세 조회

```http
GET /api/curriculums/{curriculumId}
```

## 3. 학습자료 조회

```http
GET /api/curriculums/{curriculumId}/material?userId={userId}
```

## 4. 학습 진행 상태 저장

```http
POST /api/users/{userId}/learning-progress
```

```json
{
  "curriculumId": 101,
  "progress": 100,
  "status": "completed"
}
```
