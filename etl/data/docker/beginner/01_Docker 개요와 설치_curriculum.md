---
marp: true
---

# Docker 개요와 설치 강의자료

## 참고 링크
- [Docker Curriculum](https://docker-curriculum.com/)
- [GeeksforGeeks: Introduction to Docker](https://www.geeksforgeeks.org/devops/introduction-to-docker/)
- [Docker 설치 방법](https://www.geeksforgeeks.org/linux-unix/how-to-install-and-configure-docker-in-ubuntu/)
- [Docker 명령어](https://www.geeksforgeeks.org/devops/docker-commands/)
- [Docker Hub](https://www.geeksforgeeks.org/devops/what-is-docker-hub/)

---

# 🐋 Docker란 무엇인가?
- Docker는 애플리케이션을 격리된 환경에서 실행할 수 있게 해주는 **컨테이너화 플랫폼**입니다.
- 다른 애플리케이션과 자원을 공유하면서도 각 애플리케이션은 독립적으로 실행됩니다.

---

# 📦 컨테이너란 무엇인가?
- 컨테이너는 애플리케이션과 필수 요소(코드, 라이브러리 등)를 포함하는 **경량의 독립 실행형 패키지**입니다.
- 여러 컨테이너는 동일한 호스트 OS를 공유하지만 서로 격리되어 있습니다.

---

# 🤔 왜 컨테이너를 사용할까?
- **이식성**: 다양한 환경에서 일관된 성능 제공
- **효율성**: 가볍고 빠르게 실행
- **버전 관리**: 애플리케이션 버전 간의 충돌 방지
- **배포 용이성**: 복잡한 설정 없이 빠르게 배포 가능

---

# ⚙️ Docker 설치하기
1. Ubuntu에서 Docker 설치
   ```bash
   sudo apt update
   sudo apt install docker.io
   ```
2. Docker 실행 확인
   ```bash
   sudo systemctl start docker
   sudo systemctl enable docker
   sudo docker --version
   ```

---

# 🎉 Hello World 실행해보기
- Docker가 잘 설치되었는지 확인하기 위해 다음 명령어를 입력해 보세요.
   ```bash
   sudo docker run hello-world
   ```
- 성공적인 실행 메시지가 나타나면 Docker가 정상 작동하는 것입니다!

---

# 📜 Docker Hub란?
- Docker Hub는 Docker 이미지를 저장하고 공유하는 **클라우드 기반 저장소**입니다.
- 사용자는 이미지를 **푸시**하거나 **풀**하여 손쉽게 사용할 수 있습니다.

---

# 🛠️ Docker 기본 명령어
- `docker pull <이미지 이름>`: 이미지를 Docker Hub에서 다운로드
- `docker images`: 다운로드한 이미지 목록 보기
- `docker ps`: 실행 중인 컨테이너 목록 확인
- `docker run <이미지 이름>`: 컨테이너 실행

---

# 🔄 Docker의 장점 요약
- **경량성**: VM보다 훨씬 가볍고 빠르게 실행
- **이식성**: 어떤 환경에서도 동일하게 작동
- **확장성**: 필요에 따라 쉽게 확장 가능

---

# 🚀 다음 단계
- Docker의 다양한 기능을 배우고, 더 복잡한 애플리케이션을 컨테이너화해 보세요!
- Docker Compose를 사용하여 여러 컨테이너를 관리하는 방법도 배워보세요!

---
```
