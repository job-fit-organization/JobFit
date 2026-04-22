---
marp: true
---

# Docker 입문: 첫 컨테이너 실행과 기본 명령어 🐳

## 참고 링크
- [Docker Curriculum](https://docker-curriculum.com/)
- [Introduction to Docker](https://www.geeksforgeeks.org/devops/introduction-to-docker/)
- [Docker Installation on Ubuntu](https://www.geeksforgeeks.org/linux-unix/how-to-install-and-configure-docker-in-ubuntu/)
- [Essential Docker Commands](https://www.geeksforgeeks.org/docker-commands/)
- [Running Commands Inside Docker Container](https://www.geeksforgeeks.org/devops/running-commands-inside-docker-container/)
- [Docker Architecture](https://www.geeksforgeeks.org/devops/architecture-of-docker/)

---

## 슬라이드 1: Docker란 무엇인가? 🤔
- Docker는 컨테이너 기반의 가상화 플랫폼입니다.
- 애플리케이션과 그에 필요한 모든 것을 패키지화 합니다.
- 컨테이너는 가볍고, 빠르며, 격리된 환경을 제공합니다.

---

## 슬라이드 2: 이미지 vs 컨테이너 🔍
- **이미지**: 실행 가능한 애플리케이션의 정적 버전
- **컨테이너**: 이미지의 실행 인스턴스, 가동 중인 프로세스
- 예시: 🍕 피자 재료(이미지)와 조리된 피자(컨테이너)

---

## 슬라이드 3: Docker 설치하기 🛠️
1. Docker 패키지 업데이트
   ```bash
   sudo apt-get update
   ```
2. Docker 설치
   ```bash
   sudo apt-get install docker-ce
   ```
3. 설치 확인
   ```bash
   docker --version
   ```

---

## 슬라이드 4: 첫 컨테이너 실행하기 🚀
- Busybox 이미지를 실행:
  ```bash
  docker run -it busybox sh
  ```
- `-it`: 상호작용 모드로 컨테이너 실행

---

## 슬라이드 5: 컨테이너 생명주기 ⚙️
- 컨테이너 시작: `docker run`
- 실행 중인 컨테이너 확인: `docker ps`
- 모든 컨테이너 확인: `docker ps -a`
- 컨테이너 삭제: `docker rm <container_id>`

---

## 슬라이드 6: 기본 Docker 명령어 📝
- **docker pull**: 이미지 다운로드
  ```bash
  docker pull busybox
  ```
- **docker ps**: 실행 중인 컨테이너 목록
- **docker rm**: 특정 컨테이너 삭제

---

## 슬라이드 7: 컨테이너 내부 명령어 실행 🖥️
- 이미 실행 중인 컨테이너에 명령어 실행:
  ```bash
  docker exec -it <container_id> sh
  ```
- 예시:
  ```bash
  docker exec -it <container_id> echo "Hello from inside the container!"
  ```

---

## 슬라이드 8: 컨테이너 정리하기 🧹
- 사용하지 않는 컨테이너 삭제:
  ```bash
  docker container prune
  ```
- 특정 컨테이너 삭제: `docker rm <container_id>`

---

## 슬라이드 9: Docker 용어 정리 📚
- **이미지**: 애플리케이션 및 모든 종속성을 포함하는 패키지
- **컨테이너**: 실행 중인 이미지
- **Docker Hub**: 이미지 저장소

---

## 슬라이드 10: 실습 및 정리 🎉
- Busybox를 이용해 다양한 명령어 시도
- Docker 명령어 실습: pull, run, ps, rm
- Docker로 애플리케이션을 쉽게 배포하고 관리하세요!

---
```
