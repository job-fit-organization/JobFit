# 01. HTML 구조 정리

## 목적

`index.html`은 JobFit 정적 프로토타입의 화면 구조를 정의한다. 한 파일 안에서 여러 페이지를 `<template>`로 나누어 관리하고, JavaScript가 필요한 템플릿을 `#app` 영역에 렌더링한다.

## 주요 구조

```html
<header class="topbar">...</header>
<main id="app"></main>

<template id="landing">...</template>
<template id="choose">...</template>
<template id="job-select">...</template>
<template id="job-detail">...</template>
<template id="skill-select">...</template>
<template id="roadmap">...</template>
<template id="skill-detail">...</template>
<template id="learning">...</template>
<template id="quiz">...</template>
<template id="result">...</template>
```

## 템플릿별 역할

| 템플릿 ID | 화면 | 역할 |
|---|---|---|
| landing | 메인 / 로그인 | 서비스 소개와 시작 버튼 제공 |
| choose | 직무·기술 선택 | 학습 시작 방식을 선택 |
| job-select | 직무 선택 | 관심 직무 카드 목록 표시 |
| job-detail | 직무 상세 설명 | 직무 특징, 실제 업무, 기술 스택, 장단점 표시 |
| skill-select | 기술 선택 | 기술 목록과 필터 제공 |
| roadmap | 직무 기반 로드맵 | 직무별 필요 기술을 로드맵 형태로 표시 |
| skill-detail | 기술 상세 / 커리큘럼 | 기술 설명과 단계별 커리큘럼 표시 |
| learning | 학습자료 | 선택한 커리큘럼의 학습자료 표시 |
| quiz | 문제 풀이 | 객관식 문제 표시 및 제출 |
| result | 학습 결과 | 점수, 정답, 오답, 복습 이동 제공 |

## 관련 문서

- [[00_프로토타입_관리]]
- [[02_CSS_스타일_가이드]]
- [[03_JavaScript_화면전환_로직]]
