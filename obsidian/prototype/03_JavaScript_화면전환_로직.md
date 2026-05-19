# 03. JavaScript 화면전환 로직

## 목적

`app.js`는 정적 HTML 프로토타입에서 화면 전환, 목업 데이터 렌더링, 이벤트 처리를 담당한다.

## 핵심 상태값

```javascript
const state = {
  selectedJob: "data-scientist",
  selectedSkill: "React",
  currentQuestion: 0
};
```

## 주요 데이터

| 변수 | 역할 |
|---|---|
| `jobs` | 직무 상세 정보 목업 데이터 |
| `skills` | 기술 목록 목업 데이터 |
| `curriculum` | 기술별 커리큘럼 목업 데이터 |
| `questions` | 문제 풀이 목업 데이터 |

## 주요 함수

| 함수 | 역할 |
|---|---|
| `render(page)` | 선택한 템플릿을 `#app`에 렌더링 |
| `navigate(page)` | 화면 이동 처리 |
| `renderJobCards()` | 직무 카드 목록 렌더링 |
| `renderSkillCards()` | 기술 카드 목록과 필터 처리 |
| `renderJobDetail()` | 선택된 직무의 상세 설명 렌더링 |
| `renderSkillDetail()` | 선택된 기술의 상세 설명과 커리큘럼 렌더링 |
| `renderQuiz()` | 현재 문제 렌더링 |

## 화면 전환 방식

HTML 요소에 `data-page` 속성을 부여하면 해당 값과 같은 ID의 `<template>`로 화면이 전환된다.

```html
<button data-page="job-select">직무 선택</button>
```

JavaScript는 클릭 이벤트를 감지하여 다음과 같이 처리한다.

```javascript
const pageButton = event.target.closest("[data-page]");
if (pageButton) navigate(pageButton.dataset.page);
```

## API 연동 시 수정 포인트

현재는 목업 배열 데이터를 사용한다. 실제 API 연동 시 다음 데이터를 `fetch()`로 교체한다.

- `jobs` → `GET /api/jobs`, `GET /api/jobs/{jobId}`
- `skills` → `GET /api/skills`
- `curriculum` → `GET /api/skills/{skillId}/curriculums`
- `questions` → `GET /api/curriculums/{curriculumId}/quizzes`

## 관련 소스

- [[source/app.js]]
