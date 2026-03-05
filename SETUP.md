# JobFit 초기 세팅 안내 (Project Setup Guide)

본 문서는 `JobFit` 프로젝트의 초기 개발 환경 세팅 내역과 실행 방법을 안내합니다.

## 🛠 기술 스택 (Tech Stack)
- **Framework**: Next.js (App Router) + React
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: MySQL 8.0
- **Infra**: Docker & Docker Compose
- **Linting**: ESLint

---

## ⚙️ 초기 설정 내역 (Configurations)

### 1. Next.js 프로젝트 설정
- `npx create-next-app`을 통해 빈 폴더에 초기화되었습니다.
- **TypeScript**: 타입 안정성을 위해 TypeScript 기반으로 구성 (`tsconfig.json`).
- **ESLint**: 코드 린팅 기본 설정 (`eslint.config.mjs`).
- **Tailwind CSS**: 스타일링을 위한 기본 템플릿 코드 및 환경 적용 (`tailwind.config.ts`, `postcss.config.mjs`).
- **절대 경로**: `src/` 디렉토리를 사용하며, `@/*` 절대 경로(Alias) 설정 완료됨.

### 2. Docker & Database (MySQL) 설정
로컬 개발 시 별도로 DB를 설치하지 않아도 되도록, Docker 설정이 완료되어 있습니다.
- `Dockerfile`: Next.js 서버 이미지를 생성하기 위한 설정.
- `.dockerignore`: 컨테이너 내부로 불필요한 파일(`node_modules`, `.next`, `.env` 등)이 복사되는 것을 방지.
- `docker-compose.yml`:
  - `db` 서비스: MySQL 8.0 컨테이너 (포트: `3306`, 볼륨: `db_data`) 
  - `app` 서비스: Next.js 컨테이너 (포트: `3000`)
  - 환경변수로 MYSQL 접속 비밀번호가 기본 세팅되어 있습니다. (`root` / `myuser` / `mypassword`)

### 3. 환경 변수 (`.env`)
DB 접속을 위한 기본 Connection String이 세팅되었습니다.
```env
DATABASE_URL="mysql://myuser:mypassword@localhost:3306/jobfit"
```

### 4. Git 무시 파일 (`.gitignore`)
저장소에 올라가지 말아야 할 파일 목록이 정의되어 있습니다.
- `node_modules/`, 빌드 폴더(`.next/`), 환경변수(`.env`)
- VS Code 등 IDE 개인 설정 파일 (`.vscode/`, `.idea/`)

---

## 🚀 프로젝트 실행 방법 (How to run)

### 패키지 설치
최초 1회 실행해주셔야 합니다.
```bash
npm install
```

### 방법 A: 로컬에서 Next.js 실행 + DB만 Docker로 실행 (추천)
> 코드 수정 시 즉시 피드백(HMR)을 받기 위해 Next.js는 로컬에서 실행하고, DB만 Docker로 띄우는 형태입니다.
1. MySQL 컨테이너 백그라운드 실행
```bash
docker-compose up -d db
```
2. Next.js 로컬 개발 서버 실행
```bash
npm run dev
```

### 방법 B: Next.js와 DB 모두 Docker로 실행
> 컨테이너 기반으로 웹 서버와 DB를 한 번에 실행합니다.
```bash
docker-compose up -d
```
이후 `http://localhost:3000`으로 접속하여 확인합니다.
