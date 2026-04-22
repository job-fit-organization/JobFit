---
marp: true
---

# Docker 이미지 최적화 및 Dockerfile 작성 강의자료 

## 📚 참고 링크
- [Docker Curriculum](https://docker-curriculum.com/)
- [Introduction to Docker](https://www.geeksforgeeks.org/devops/introduction-to-docker/)
- [How to Install Docker on Ubuntu](https://www.geeksforgeeks.org/linux-unix/how-to-install-and-configure-docker-in-ubuntu/)
- [Docker Commands](https://www.geeksforgeeks.org/docker-commands/)
- [Running Commands Inside Docker Container](https://www.geeksforgeeks.org/devops/running-commands-inside-docker-container/)
- [Architecture of Docker](https://www.geeksforgeeks.org/devops/architecture-of-docker/)
- [What is Docker Hub?](https://www.geeksforgeeks.org/devops/what-is-docker-hub/)
- [Dockerfile Syntax](https://www.geeksforgeeks.org/devops/what-is-dockerfile-syntax/)
- [Optimizing Docker Images](https://www.geeksforgeeks.org/devops/how-to-optimize-docker-image/)

---

## 🐳 Dockerfile의 역할
- Dockerfile은 Docker 이미지를 생성하는 데 사용되는 스크립트입니다.
- 각 명령은 새로운 레이어를 생성하며, 최종 이미지는 이러한 레이어의 집합으로 구성됩니다.
- 예시:
  ```dockerfile
  FROM ubuntu:20.04
  RUN apt-get update && apt-get install -y curl
  COPY . /app
  CMD ["python", "/app/app.py"]
  ```

---

## ⚙️ Dockerfile의 내부 동작 원리
- **FROM**: 기반 이미지를 정의합니다.
- **RUN**: 명령어를 실행하여 새로운 레이어를 만듭니다.
- **COPY**: 파일을 이미지에 복사합니다.
- **CMD**: 컨테이너가 시작될 때 실행할 기본 명령을 설정합니다.

---

## 🔍 이미지 최적화의 중요성
- 최적화된 이미지는 **전송 속도**, **디스크 공간 사용**, **보안**을 개선합니다.
- 불필요한 파일과 의존성을 제거하여 공격 표면을 줄입니다.
- 예시:
  ```dockerfile
  RUN apt-get update && apt-get install -y --no-install-recommends \
      build-essential \
      && rm -rf /var/lib/apt/lists/*
  ```

---

## 📉 Docker 이미지 최적화 기법
1. **레이어 최소화**: 여러 RUN 명령어를 결합하여 레이어 수를 줄입니다.
   ```dockerfile
   RUN apt-get update && apt-get install -y package1 package2
   ```
2. **다단계 빌드**: 빌드 과정에서만 필요한 패키지를 포함하고, 최종 이미지에는 불필요한 파일을 제거합니다.
   ```dockerfile
   FROM node:alpine AS builder
   WORKDIR /app
   COPY . .
   RUN npm install
   FROM node:alpine
   COPY --from=builder /app/dist /app
   ```

---

## 🔒 Dockerfile 보안 모범 사례
- 항상 **최신의 기본 이미지를 사용**하고 불필요한 패키지는 설치하지 않습니다.
- **RUN** 명령어에서 **--no-install-recommends** 플래그를 사용하여 불필요한 의존성을 피합니다.
- 예시:
  ```dockerfile
  RUN apk add --no-cache package
  ```

---

## ⏱️ 빌드 시간 최적화
- Dockerfile 명령어의 순서를 최적화하여 캐시를 효율적으로 활용합니다.
- 빈번하게 변경되는 명령은 아래쪽에 배치하여 캐시 효과를 극대화합니다.
- 예시:
  ```dockerfile
  COPY requirements.txt /app/
  RUN pip install -r requirements.txt
  COPY . /app/
  ```

---

## 📦 Docker 이미지 관리
- Docker Hub 및 개인 레지스트리를 활용하여 안전하게 이미지를 저장하고 배포합니다.
- **태그ging**을 통해 여러 버전을 관리할 수 있습니다.
- 예시:
  ```bash
  docker build -t myapp:latest .
  docker tag myapp:latest myregistry/myapp:v1.0
  ```

---

## 🌐 Docker Compose를 통한 멀티 컨테이너 관리
- Docker Compose를 사용하면 여러 컨테이너를 정의하고 실행할 수 있습니다.
- 예시:
  ```yaml
  version: '3'
  services:
    web:
      image: myapp
      ports:
        - "5000:5000"
    db:
      image: postgres
      environment:
        POSTGRES_PASSWORD: example
  ```

---

## 📈 성능 최적화 요약
- 이미지 최적화는 **배포 속도**, **리소스 소비**, **보안**을 개선합니다.
- 지속적인 모니터링과 최적화는 효율적인 CI/CD 파이프라인 구축에 필수적입니다.
- 결론적으로, 최적화된 Docker 이미지는 개발 및 운영 환경 모두에서 이점을 가져옵니다.
```
