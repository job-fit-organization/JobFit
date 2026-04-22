---
marp: true
---

# Docker 이미지 최적화와 경량화 🌟

## 참고 링크
- [Docker Curriculum](https://docker-curriculum.com/)
- [GeeksforGeeks - Introduction to Docker](https://www.geeksforgeeks.org/devops/introduction-to-docker/)
- [GeeksforGeeks - How to Install Docker on Ubuntu](https://www.geeksforgeeks.org/linux-unix/how-to-install-and-configure-docker-in-ubuntu/)
- [GeeksforGeeks - Docker Commands](https://www.geeksforgeeks.org/devops/docker-commands/)
- [GeeksforGeeks - What is Docker Image](https://www.geeksforgeeks.org/devops/what-is-docker-image/)
- [GeeksforGeeks - How to Optimize Docker Image](https://www.geeksforgeeks.org/devops/how-to-optimize-docker-image/)
- [GeeksforGeeks - Dockerfile Syntax](https://www.geeksforgeeks.org/devops/what-is-dockerfile-syntax/)

---

## 슬라이드 1: Docker란? 🐳
- **Docker**는 소프트웨어를 컨테이너라는 격리된 환경에서 실행하는 플랫폼입니다.
- 컨테이너는 애플리케이션과 그 의존성을 포함하여 쉽게 배포할 수 있도록 합니다.

---

## 슬라이드 2: Docker 이미지 최적화의 중요성 🛠️
- **빠른 배포**: 경량화된 이미지는 더 빠르게 다운로드되고 배포됩니다.
- **자원 절약**: 이미지 크기가 작을수록 저장 공간과 네트워크 대역폭을 절약할 수 있습니다.
- **보안 향상**: 불필요한 파일과 도구를 제거하여 보안 취약점을 줄일 수 있습니다.

---

## 슬라이드 3: 레이어 최적화 📦
- Dockerfile의 각 명령어는 새로운 레이어를 생성합니다.
- 관련 명령어를 하나의 `RUN` 명령어로 결합하여 레이어 수를 줄입니다.

```dockerfile
FROM ubuntu:20.04
RUN apt-get update && apt-get install -y \
    curl \
    vim \
    && rm -rf /var/lib/apt/lists/*
```

---

## 슬라이드 4: 불필요한 패키지 제거 🚫
- 사용하지 않는 패키지나 파일을 제거하여 이미지 크기를 줄입니다.
- `apt-get clean`과 `rm` 명령어를 사용하여 청소합니다.

```dockerfile
RUN apt-get install -y some-package \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*
```

---

## 슬라이드 5: 작은 베이스 이미지 선택 🐾
- 가장 작은 베이스 이미지를 선택하여 시작합니다.
- 예: `alpine` 이미지는 매우 경량입니다.

```dockerfile
FROM alpine:latest
RUN apk add --no-cache curl
```

---

## 슬라이드 6: 멀티 스테이지 빌드 🏗️
- 빌드 과정에서 여러 단계로 나누어 최종 이미지를 경량화합니다.
- 필요 없는 빌드 도구를 최종 이미지에서 제거할 수 있습니다.

```dockerfile
FROM golang:alpine AS builder
WORKDIR /app
COPY . .
RUN go build -o myapp

FROM alpine:latest
COPY --from=builder /app/myapp /myapp
```

---

## 슬라이드 7: Docker Hub와 이미지 관리 🌐
- **Docker Hub**는 Docker 이미지를 저장하고 공유하는 플랫폼입니다.
- 이미지 관리를 통해 필요한 이미지만 유지하고, 사용하지 않는 이미지는 삭제합니다.

---

## 슬라이드 8: 이미지 최적화 도구 🛡️
- **Docker Slim**: 불필요한 파일과 의존성을 제거합니다.
- **Dive**: 이미지 레이어를 시각화하여 최적화 기회를 찾아냅니다.
- **Hadolint**: Dockerfile 문법을 검사하여 최적화합니다.

---

## 슬라이드 9: 최적화의 예시 🔍
- 아래는 최적화된 Dockerfile의 예입니다.

```dockerfile
FROM node:14-alpine
WORKDIR /app
COPY package.json ./
RUN npm install --production
COPY . .
CMD ["node", "app.js"]
```

---

## 슬라이드 10: 요약 및 질문 🤔
- Docker 이미지를 경량화하는 방법:
  1. 레이어 최적화
  2. 불필요한 패키지 제거
  3. 작은 베이스 이미지 선택
  4. 멀티 스테이지 빌드 활용
- 질문이 있으신가요?
```
