# 개발 의사결정 04. Django 통합 풀스택 디렉토리 구조 확립

본 문서는 **JobFit**의 Django 단일 풀스택 아키텍처로의 전환에 따라, 정적 에셋(Static), 템플릿(Templates) 및 기능별 장고 앱(Apps)을 가장 깔끔하고 프로덕션 표준에 맞게 관리하기 위해 **최적의 디렉토리 구조(Directory Structure)**를 규정하는 기술 설계서입니다.

---

## 1. 지향하는 구조: 글로벌 통합형 & 도메인 앱 분리 아키텍처

장고 풀스택 프로젝트에서 템플릿과 정적 파일을 각 앱 내부로 파편화하여 저장하는 것은 에셋 유지보수와 CSS/JS 공통화의 생산성을 크게 떨어뜨립니다. 
따라서, 모든 HTML과 스태틱 자원을 루트에서 통합 관리하고 기능(도메인)만 독립된 앱으로 분리하는 **글로벌 통합형 레이아웃**을 채택합니다.

```
JobFit/  (프로젝트 루트)
 ├── manage.py                   <-- Django CLI 도구
 ├── config/                     <-- 프로젝트 메인 설정 패키지
 │    ├── settings.py            <-- 글로벌 설정 (DB, Static, Templates 경로 매핑)
 │    ├── urls.py                <-- 글로벌 URL 라우터 (accounts와 learning 앱 연동)
 │    └── wsgi.py / asgi.py
 │
 ├── accounts/                   <-- [장고 앱 1] 인증 및 계정 관리 전용 도메인
 │    ├── models.py              <-- UserProfile 모델 (소셜 연동 메타데이터 포함)
 │    ├── views.py               <-- 로그인(Landing), 소셜인증 Callback, 로그아웃 뷰
 │    └── apps.py / admin.py
 │
 ├── learning/                   <-- [장고 앱 2] 서비스 코어 학습 도메인
 │    ├── models.py              <-- Job, Skill, Roadmap, Curriculum, QuizQuestion, QuizChoice, QuizAttempt, UserResponse, UserBookmark, UserNote
 │    ├── views.py               <-- ModeSelect, JobSelect, JobRoadmap, SkillList, SkillDetail, Material, QuizPlay, QuizResult, JobReset
 │    └── apps.py / admin.py
 │
 ├── static/                     <-- 글로벌 정적 자원 통합 보관소
 │    ├── css/
 │    │    └── styles.css        <-- 프로토타입의 CSS를 이식한 프리미엄 테마 시트
 │    ├── js/
 │    │    ├── app.js            <-- SVG/Vis.js 로드맵 드로잉 및 동적 인터랙션 스크립트
 │    │    └── lucide.min.js     <-- Lucide 라인 아트 아이콘 CDN 대체 스크립트
 │    └── images/
 │         └── jobs/             <-- AI 생성 직무 카드용 프리미엄 일러스트 (.png)
 │
 └── templates/                  <-- 글로벌 HTML 템플릿 통합 보관소
      ├── base.html              <-- 공통 뼈대 (Header, Footer, CSS/JS 통합 로더)
      ├── landing.html           <-- 01. 메인 / 로그인
      ├── mode_select.html       <-- 02. 직무/기술 선택 분기
      ├── job_select.html        <-- 03. 관심 직무 선택
      ├── job_roadmap.html       <-- 04. 직무 기반 기술 로드맵
      ├── skill_list.html        <-- 05. 전체 기술 목록
      ├── skill_detail.html      <-- 06. 기술 상세 / 커리큘럼
      ├── learning_material.html <-- 07. 학습자료 렌더링 (북마크/메모 포함)
      ├── quiz_play.html         <-- 08. 퀴즈 문제 풀이
      └── quiz_result.html       <-- 09. 학습 결과 / 성취도
```

---

## 2. 앱별 명확한 역할 정의 (App Domain)

프로젝트 확장성을 위해 전체 비즈니스 로직을 크게 **2개의 장고 앱**으로 단정하게 분할합니다.

### ① `accounts` (계정 및 로그인 인증 도메인)
*   **역할:** 사용자 인증, 소셜 로그인 연동, 세션 생명주기 관리
*   **모델:** `UserProfile` (소셜 토큰, 프로필 정보, 가입일 관리)
*   **뷰:** 소셜 가입 콜백, 세션 수립, 로그아웃 처리

### ② `learning` (코어 학습 및 평가 비즈니스 도메인)
*   **역할:** 직무/기술 조회, 의존성 기반 로드맵 가공, 마크다운 학습자료 출력, 가중 퀴즈 출제/채점, 진행도 및 진도율 트래킹, 오답 관리, 북마크 및 메모 영속화
*   **모델:** `Job`, `Skill`, `Roadmap`, `Curriculum`, `UserCurriculumProgress`, `QuizQuestion`, `QuizChoice`, `QuizAttempt`, `UserResponse`, `UserBookmark`, `UserNote`
*   **뷰:** 직무 선택, 로드맵(Vis.js), 기술 검색, 퀴즈 플레이, 채점 뷰

---

## 3. `settings.py` 경로 연동 설정 규칙

글로벌 정적 폴더와 템플릿 폴더가 정상적으로 작동할 수 있도록 `config/settings.py`에 적용할 표준 경로 설정 방식입니다.

```python
import os
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# 1. Templates 글로벌 폴더 연동 설정
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        # 루트 경로의 templates 폴더를 최우선으로 바라보게 설정
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# 2. Static 글로벌 폴더 연동 설정
STATIC_URL = 'static/'
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'static'),
]
# 프로덕션 배포 시 static을 모아줄 곳
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
```

---

## 4. 구조 확립의 의의

*   **템플릿 집중화:** 모든 HTML 파일을 `templates/` 한 곳에서 볼 수 있어 화면 간 레이아웃 수정 및 공통화가 획기적으로 편해집니다.
*   **자산 공유 극대화:** 프로토타입의 CSS(`styles.css`)와 JS를 모든 HTML 템플릿이 단 한 줄의 `{% static 'css/styles.css' %}` 코드로 즉시 완벽 공유합니다.
*   **깔끔한 URL 분할:** `/select-mode/` 이후의 모든 학습/평가 플로우는 `learning/urls.py`에 깔끔하게 격리되어 관리됩니다.
