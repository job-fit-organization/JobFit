---
marp: true
---

# Docker 아키텍처와 핵심 개념

## 참고 링크
- [Docker Curriculum](https://docker-curriculum.com/)
- [Introduction to Docker](https://www.geeksforgeeks.org/devops/introduction-to-docker/)
- [How to Install and Configure Docker in Ubuntu](https://www.geeksforgeeks.org/linux-unix/how-to-install-and-configure-docker-in-ubuntu/)
- [Docker Commands](https://www.geeksforgeeks.org/docker-commands/)
- [Running Commands Inside Docker Container](https://www.geeksforgeeks.org/devops/running-commands-inside-docker-container/)
- [Architecture of Docker](https://www.geeksforgeeks.org/devops/architecture-of-docker/)
- [What is Docker Hub?](https://www.geeksforgeeks.org/devops/what-is-docker-hub/)
- [Dockerfile Syntax](https://www.geeksforgeeks.org/devops/what-is-dockerfile-syntax/)
- [What is Docker Image?](https://www.geeksforgeeks.org/devops/what-is-docker-image/)
- [How to Optimize Docker Image?](https://www.geeksforgeeks.org/devops/how-to-optimize-docker-image/)

---

## 🚀 Docker 기본 개념
- **Docker Client**: 명령을 Docker Daemon에 전달
- **Docker Daemon**: 컨테이너 생성, 관리, 삭제
- **Image**: 실행 가능한 파일 시스템 및 애플리케이션 코드 포함
- **Container**: 이미지를 기반으로 생성된 실행 환경
- **Registry**: Docker 이미지를 저장하고 배포하는 장소 (예: Docker Hub)

---

## 🏗️ Docker 아키텍처
- **클라이언트-서버 구조**: 
  - Docker Client → Docker Daemon
  - Docker Daemon이 컨테이너와 이미지를 관리
- **이미지와 컨테이너의 관계**:
  - 이미지는 읽기 전용, 컨테이너는 쓰기 가능한 파일 시스템
- **네트워크와 스토리지**:
  - 각 컨테이너는 고유한 IP와 네트워크 인터페이스를 가짐

---

## 📦 Docker 이미지 최적화
- **이미지 크기 감소**: 불필요한 파일과 의존성 제거
  ```dockerfile
  FROM node:14
  WORKDIR /app
  COPY package*.json ./
  RUN npm install --production
  COPY . .
  CMD ["node", "server.js"]
  ```
- **Layer Caching**: Docker는 각 명령어의 결과를 캐시하여 속도 향상

---

## ⚡ 성능 최적화
- **경량화**: 컨테이너는 OS 커널을 공유하여 리소스 사용을 줄임
- **빠른 시작**: 컨테이너는 몇 초 내에 실행 가능
- **리소스 분배**: 각 컨테이너에 대한 CPU 및 메모리 제한 설정 가능
  ```bash
  docker run -m 512m --cpus="1.0" myapp
  ```

---

## 🔒 보안 고려 사항
- **최소 권한 원칙 적용**: 필요 최소한의 권한으로 컨테이너 실행
  ```bash
  docker run --cap-drop=ALL --cap-add=NET_BIND_SERVICE myapp
  ```
- **이미지 취약성 스캔**: 정기적인 이미지 스캔을 통해 보안 취약점 점검

---

## 🌐 Docker 네트워킹
- **컨테이너 간 통신**: 동일 네트워크 내에서 직접 통신
- **네트워크 드라이버**: 브리지, 호스트, 오버레이 등 다양한 네트워크 모드 제공
  ```bash
  docker network create my-network
  docker run --network my-network --name app1 myapp
  docker run --network my-network --name app2 myapp
  ```

---

## 🛠️ Docker Compose의 활용
- **멀티 컨테이너 애플리케이션 정의**: `docker-compose.yml`을 통해 애플리케이션 구성
  ```yaml
  version: '3'
  services:
    web:
      image: nginx
      ports:
        - "80:80"
    db:
      image: mysql
      environment:
        MYSQL_ROOT_PASSWORD: example
  ```
- **손쉬운 배포 및 관리**: `docker-compose up`으로 모든 서비스 시작

---

## 🌟 결론
- Docker는 개발과 운영의 일관성을 제공하며, 경량화된 컨테이너화된 애플리케이션을 통해 효율성과 성능을 극대화합니다.
- **트레이드오프**: 경량성과 성능을 위한 보안 및 관리의 복잡성 증가

---

## ✨ Q&A
- 질문이 있으신가요? Docker의 다양한 기능과 활용에 대해 논의해봅시다!
```
