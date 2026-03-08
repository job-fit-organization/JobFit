# JobFit Backend (Django) 로컬 세팅 안내

본 문서는 `JobFit` 프로젝트의 백엔드(Django) 환경을 로컬에서 세팅하고 실행하기 위한 가이드입니다.

---

## 🛠 필수 요구사항 (Prerequisites)

- **Python**: 3.10 이상 권장 (현재 환경: 3.13)
- **Docker Desktop**: MySQL DB 컨테이너 실행용 (사전 설치 필수)

---

## 🚀 로컬 환경 세팅 순서

### 1️⃣ Docker로 DB 컨테이너 실행

빠른 개발을 위해 DB(MySQL)는 도커 컴포즈를 이용해 실행합니다.
프로젝트 최상단 (JobFit 폴더) 터미널에서 아래 명령어를 실행하여 DB를 켭니다.

```bash
docker-compose up -d db
```
> **주의:** Docker Desktop 프로그램이 반드시 켜져 있어야 합니다.

### 2️⃣ Python 가상환경(venv) 생성

Python 패키지 충돌을 방지하기 위해 로컬 가상 환경을 사용합니다.
`backend` 폴더 내부로 이동 후 가상환경을 생성하고 진입하세요.

**Windows (PowerShell) 기준:**
```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
```

**Mac/Linux 기준:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
```
> 가상환경이 정상적으로 켜졌다면 터미널 줄 맨 앞에 `(venv)` 표시가 나타납니다.

### 3️⃣ 환경변수(`.env`) 파일 생성

백엔드에서 로컬 DB 컨테이너로 정상적으로 연결하기 위해 `backend/` 폴더 내에 `.env` 파일을 만들고 아래 내용을 입력합니다.

```env
DB_NAME=jobfit
DB_USER=myuser
DB_PASSWORD=mypassword
DB_HOST=127.0.0.1
DB_PORT=3306
```
> **참고:** Docker 내부망에서는 `db`라는 호스트 이름으로 접근하지만, 로컬에서 실행하는 파이썬(Django)은 `127.0.0.1`(localhost)로 접속해야 합니다.

### 4️⃣ 패키지 설치

필요한 파이썬 라이브러리(Django, MySQLclient 등)를 가상환경에 설치합니다.
(반드시 가상환경이 켜진 상태여야 합니다)

```bash
pip install -r requirements.txt
```

### 5️⃣ DB 마이그레이션 적용

Django에서 기본적으로 제공하는 모델들(User, Session 등)의 DB 테이블을 생성합니다.

```bash
python manage.py migrate
```

### 6️⃣ 로컬 서버 실행

모든 준비가 완료되었습니다. Django 개발 서버를 실행하세요.

```bash
python manage.py runserver
```

> 터미널에 `Starting development server at http://127.0.0.1:8000/` 문구가 출력되면 정상입니다!
> 클라이언트(Next.js)는 `http://localhost:3000` 에서 실행하고, 백엔드는 `8000` 포트에서 API 요청을 대기합니다.
