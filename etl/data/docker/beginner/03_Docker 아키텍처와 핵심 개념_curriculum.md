---
marp: true
---

# Docker 아키텍처와 핵심 개념 강의 자료

## 참고 링크
- [Docker Curriculum](https://docker-curriculum.com/)
- [Introduction to Docker](https://www.geeksforgeeks.org/devops/introduction-to-docker/)
- [Install Docker on Ubuntu](https://www.geeksforgeeks.org/linux-unix/how-to-install-and-configure-docker-in-ubuntu/)
- [Docker Commands](https://www.geeksforgeeks.org/docker-commands/)
- [Running Commands Inside Docker Container](https://www.geeksforgeeks.org/devops/running-commands-inside-docker-container/)
- [Docker Architecture](https://www.geeksforgeeks.org/devops/architecture-of-docker/)
- [What is Docker Hub?](https://www.geeksforgeeks.org/devops/what-is-docker-hub/)
- [What is Dockerfile?](https://www.geeksforgeeks.org/devops/what-is-dockerfile/)

---

## 슬라이드 1: Docker란 무엇인가? 🚀
- Docker는 애플리케이션을 컨테이너라는 경량의 독립 실행 형 패키지로 배포하고 관리하는 도구입니다.
- **장점**: 이식성, 경량성, 일관성

---

## 슬라이드 2: Docker 아키텍처 개요 🏗️
- **Docker Client**: 사용자와 Docker Daemon 간의 상호작용을 담당
- **Docker Daemon**: Docker 컨테이너와 이미지를 관리하는 서버
- **Docker Registry**: Docker 이미지를 저장하고 배포하는 저장소

---

## 슬라이드 3: Docker Client와 Daemon 🔄
- **Docker Client**: 명령어를 입력하여 Docker Daemon에 요청을 보냄
- **Docker Daemon**: 요청을 처리하고 컨테이너를 생성, 관리함

---

## 슬라이드 4: Docker 이미지란? 📦
- Docker 이미지는 컨테이너를 실행하는 데 필요한 모든 파일과 설정을 포함
- **예시**: 웹 애플리케이션을 실행하기 위한 이미지

---

## 슬라이드 5: Docker 컨테이너란? 🐳
- 컨테이너는 Docker 이미지를 실행한 인스턴스
- **특징**: 독립적이며, 다른 컨테이너와 격리되어 실행됨

---

## 슬라이드 6: Docker Hub란? 🌐
- Docker Hub는 공개 및 개인 Docker 이미지를 저장하고 공유하는 클라우드 기반 서비스
- **예시**: `docker pull nginx` 명령어로 Nginx 이미지를 다운로드 가능

---

## 슬라이드 7: Dockerfile 소개 📜
- Dockerfile은 이미지를 만들기 위한 명령어를 포함한 텍스트 파일
- **주요 명령어**: `FROM`, `RUN`, `CMD`, `COPY`

---

## 슬라이드 8: 간단한 Dockerfile 예시 🛠️
```dockerfile
# 베이스 이미지 지정
FROM ubuntu:latest

# 패키지 업데이트 및 설치
RUN apt-get update && apt-get install -y curl

# 컨테이너에서 실행할 명령어
CMD ["echo", "Hello Docker!"]
```

---

## 슬라이드 9: Docker 명령어 기본 📋
- 컨테이너 실행: `docker run -it ubuntu`
- 이미지 목록 확인: `docker images`
- 컨테이너 목록 확인: `docker ps`

---

## 슬라이드 10: 요약 및 다음 단계 📅
- Docker의 기본 개념 이해
- Docker Client, Daemon, 이미지, 컨테이너, Registry의 역할 학습
- 다음 단계: 직접 Docker 설치 및 간단한 컨테이너 실행해보기!

---
```