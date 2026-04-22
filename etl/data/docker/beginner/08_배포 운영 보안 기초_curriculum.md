---
marp: true
---

# 강의자료: Docker 기반 애플리케이션 배포 기초 🚀

## 참고 링크
- [Docker Curriculum](https://docker-curriculum.com/)
- [Introduction to Docker](https://www.geeksforgeeks.org/devops/introduction-to-docker/)
- [How to Install Docker on Ubuntu](https://www.geeksforgeeks.org/linux-unix/how-to-install-and-configure-docker-in-ubuntu/)
- [Docker Commands](https://www.geeksforgeeks.org/docker-commands/)
- [Running Commands Inside Docker Container](https://www.geeksforgeeks.org/devops/running-commands-inside-docker-container/)
- [Docker Architecture](https://www.geeksforgeeks.org/devops/architecture-of-docker/)
- [Docker Hub](https://www.geeksforgeeks.org/devops/what-is-docker-hub/)
- [Dockerfile Syntax](https://www.geeksforgeeks.org/devops/what-is-dockerfile-syntax/)
- [Docker Image](https://www.geeksforgeeks.org/devops/what-is-docker-image/)
- [Docker Security Best Practices](https://www.geeksforgeeks.org/devops/docker-security-best-practices/)

---

## 슬라이드 1: Docker란 무엇인가? 🤔
- Docker는 애플리케이션을 컨테이너화하여 실행하는 플랫폼입니다.
- 컨테이너는 소프트웨어를 패키징, 배포 및 실행하는 표준 방법을 제공합니다.
- 개발 환경과 운영 환경의 일관성을 보장합니다.
  
---

## 슬라이드 2: Docker의 이점 🌟
- **이식성**: 어떤 환경에서도 동일하게 실행 가능.
- **경량화**: 가상 머신보다 더 적은 리소스 사용.
- **빠른 배포**: 애플리케이션을 신속하게 배포하고 확장 가능.

---

## 슬라이드 3: Docker 설치하기 🛠️
1. 터미널을 열고 아래 명령어 입력:
   ```bash
   sudo apt-get update
   sudo apt-get install docker.io
   ```
2. Docker 서비스 시작:
   ```bash
   sudo systemctl start docker
   sudo systemctl enable docker
   ```

---

## 슬라이드 4: Docker 명령어 기본 📜
- **컨테이너 목록 보기**:
  ```bash
  docker ps -a
  ```
- **이미지 목록 보기**:
  ```bash
  docker images
  ```
- **컨테이너 실행**:
  ```bash
  docker run hello-world
  ```

---

## 슬라이드 5: Docker Hub란? 🌐
- Docker Hub는 공용 Docker 이미지 리포지토리입니다.
- 사용자들이 이미지 저장, 공유 및 배포할 수 있는 공간입니다.
- 예시: `docker pull ubuntu`로 Ubuntu 이미지를 다운로드 가능.

---

## 슬라이드 6: Dockerfile 개요 📄
- Dockerfile은 이미지를 구축하는 데 필요한 명령어 집합입니다.
- 예시 Dockerfile:
  ```dockerfile
  FROM ubuntu:latest
  RUN apt-get update && apt-get install -y nginx
  CMD ["nginx", "-g", "daemon off;"]
  ```

---

## 슬라이드 7: Docker 보안 기초 🔒
- **액세스 관리**: 누가 컨테이너에 접근할 수 있는지 관리.
- **이미지 스캔**: 취약점을 주기적으로 스캔하여 보안 유지.
- **최소 권한 원칙**: 필요한 권한만 부여하여 보안 강화.

---

## 슬라이드 8: Docker Registry 개념 🎨
- **공개 레지스트리**: Docker Hub 같은 공개 이미지 저장소.
- **사설 레지스트리**: 조직 내에서 사용하는 비공식 이미지 저장소.
- **이미지 푸시/풀**: 이미지를 레지스트리에 푸시하거나 가져올 수 있습니다.

---

## 슬라이드 9: Docker vs Kubernetes ⚖️
- **Docker**: 컨테이너화된 애플리케이션 실행.
- **Kubernetes**: 여러 컨테이너를 관리하고 오케스트레이션.
- **사용 사례**: 작은 애플리케이션은 Docker, 대규모 시스템은 Kubernetes.

---

## 슬라이드 10: Docker Swarm 소개 🌊
- **Docker Swarm**: Docker의 내장 오케스트레이션 툴.
- 여러 Docker 호스트를 클러스터로 묶어 관리.
- 서비스의 부하 분산 및 고가용성 제공.

---
```
