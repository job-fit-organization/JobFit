# 02. CSS 스타일 가이드

## 목적

`styles.css`는 Figma 화면의 와이어프레임 느낌을 HTML 프로토타입에 반영하기 위한 스타일 파일이다.

## 디자인 토큰

```css
:root {
  --bg: #f7f7f5;
  --surface: #ffffff;
  --surface-alt: #f1f1ee;
  --text: #171717;
  --muted: #6f6f68;
  --line: #e2e2dd;
  --accent: #111111;
  --radius: 18px;
  --shadow: 0 12px 28px rgba(0, 0, 0, 0.07);
}
```

## 주요 컴포넌트 클래스

| 클래스 | 역할 |
|---|---|
| `.topbar` | 상단 고정 내비게이션 |
| `.page` | 각 화면의 기본 컨테이너 |
| `.hero-card` | 메인 랜딩 화면 카드 |
| `.choice-card` | 직무/기술 선택 카드 |
| `.card-grid` | 직무/기술 카드 목록 그리드 |
| `.job-hero` | 직무 상세 상단 소개 영역 |
| `.skill-hero` | 기술 상세 상단 소개 영역 |
| `.content-section` | 일반 콘텐츠 섹션 |
| `.info-grid` | 직무 특징, 추천 항목 카드 그리드 |
| `.roadmap-panel` | 로드맵 노드 영역 |
| `.node` | 로드맵 기술 노드 |
| `.curriculum-item` | 커리큘럼 단계 행 |
| `.learning-page` | 학습자료 페이지 레이아웃 |
| `.quiz-card` | 문제 풀이 카드 |
| `.metric-card` | 결과 요약 카드 |

## 반응형 기준

- 900px 이하: 2열 이상 레이아웃을 1열 또는 2열로 축소
- 560px 이하: 카드와 버튼을 세로 배치

## 관련 소스

- [[source/styles.css]]
