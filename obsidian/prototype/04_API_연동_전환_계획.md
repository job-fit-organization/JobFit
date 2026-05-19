# 04. API 연동 전환 계획

## 목적

현재 정적 프로토타입은 `app.js` 내부의 목업 데이터를 사용한다. 이후 백엔드 API가 준비되면 목업 데이터를 실제 API 요청으로 교체한다.

## 전환 대상

| 현재 목업 데이터 | 전환 API | 사용 화면 |
|---|---|---|
| `jobs` | `GET /api/jobs` | 직무 선택 |
| `jobs` 상세 | `GET /api/jobs/{jobId}` | 직무 상세 설명 |
| `skills` | `GET /api/skills` | 기술 선택 |
| `curriculum` | `GET /api/skills/{skillId}/curriculums` | 기술 상세 / 커리큘럼 |
| `questions` | `GET /api/curriculums/{curriculumId}/quizzes` | 문제 풀이 |
| 채점 결과 | `POST /api/quizzes/submit` | 문제 풀이 / 학습 결과 |

## 예시: 직무 목록 API 전환

### 기존 방식

```javascript
const jobs = [
  {
    id: "data-scientist",
    name: "Data Scientist"
  }
];
```

### 전환 방식

```javascript
async function fetchJobs() {
  const response = await fetch("/api/jobs");
  const jobs = await response.json();
  return jobs;
}
```

## 예시: 직무 상세 API 전환

```javascript
async function fetchJobDetail(jobId) {
  const response = await fetch(`/api/jobs/${jobId}`);
  const job = await response.json();
  return job;
}
```

## 권장 작업 순서

1. 정적 프로토타입 화면 구조 확정
2. API 응답 JSON 구조 확정
3. 목업 데이터와 API 응답 필드명 일치
4. `app.js`의 배열 데이터를 `fetch()` 함수로 교체
5. 로딩 상태와 오류 상태 추가
6. 인증 토큰이 필요한 API에 Authorization Header 추가

## 관련 문서

- [[03_JavaScript_화면전환_로직]]
- [[../api/jobs]]
- [[../api/skills]]
- [[../api/curriculum]]
- [[../api/quiz]]
