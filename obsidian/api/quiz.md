# API - Quiz

## 1. 문제 목록 조회

```http
GET /api/curriculums/{curriculumId}/quizzes
```

## 2. 답변 제출

```http
POST /api/quizzes/{quizId}/submit
```

```json
{
  "userId": 1,
  "answers": [
    {
      "questionId": 1001,
      "selectedOptionId": 3
    }
  ]
}
```

## 3. 결과 조회

```http
GET /api/quizzes/{quizId}/result?userId={userId}
```
