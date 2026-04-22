---
marp: true
---

# 네트워크와 데이터 저장
## 처음 배우는 학생(비전공자·입문자) 강의자료

### 참고 링크
- [Docker Curriculum](https://docker-curriculum.com/)
- [Introduction to Docker](https://www.geeksforgeeks.org/devops/introduction-to-docker/)
- [Docker Installation on Ubuntu](https://www.geeksforgeeks.org/linux-unix/how-to-install-and-configure-docker-in-ubuntu/)
- [Docker Commands](https://www.geeksforgeeks.org/docker-commands/)
- [Running Commands Inside Docker Container](https://www.geeksforgeeks.org/devops/running-commands-inside-docker-container/)
- [Docker Architecture](https://www.geeksforgeeks.org/devops/architecture-of-docker/)
- [What is Docker Hub?](https://www.geeksforgeeks.org/devops/what-is-docker-hub/)
- [Dockerfile Syntax](https://www.geeksforgeeks.org/devops/what-is-dockerfile-syntax/)
- [What is Docker Volume?](https://www.geeksforgeeks.org/devops/what-is-docker-volume/)
- [Docker Compose](https://www.geeksforgeeks.org/devops/docker-compose/)

---

## 슬라이드 1: Docker란? 🐳
- Docker는 컨테이너 기반의 가상화 플랫폼입니다.
- 소프트웨어를 빠르고 쉽게 배포하고 실행할 수 있도록 도와줍니다.
- 개발, 테스트, 배포 환경을 통일할 수 있습니다.

---

## 슬라이드 2: 네트워크 기본 개념 🌐
- Docker 컨테이너는 서로 통신하기 위해 네트워크를 사용합니다.
- 기본적으로는 Docker의 브리지 네트워크를 통해 통신합니다.
- 컨테이너 간의 네트워크 격리가 이루어집니다.

---

## 슬라이드 3: Docker Network 종류 🔌
- **Bridge Network**: 기본 네트워크로, 컨테이너 간의 통신을 지원합니다.
- **Host Network**: 호스트의 네트워크를 공유합니다. 성능이 좋지만, 격리가 없습니다.
- **Overlay Network**: 여러 호스트에서 컨테이너를 연결합니다.

---

## 슬라이드 4: 포트 매핑 ⚙️
- 컨테이너의 포트를 호스트의 포트와 연결하여 외부에서 접근할 수 있게 합니다.
- 예시:
  ```bash
  docker run -p 8080:80 nginx
  ```
  - 호스트의 8080 포트가 컨테이너의 80 포트와 연결됩니다.

---

## 슬라이드 5: Volume이란? 💾
- 데이터의 영속성을 제공합니다.
- 컨테이너가 삭제되어도 데이터가 남아있습니다.
- 예시: 데이터베이스 컨테이너에서 사용하는 데이터가 저장됩니다.

---

## 슬라이드 6: Bind Mount와 Volume의 차이 🔄
- **Volume**: Docker가 관리하며, 여러 컨테이너에서 공유 가능.
- **Bind Mount**: 호스트의 특정 폴더를 컨테이너에 직접 연결.
- 데이터의 접근성과 관리 방식이 다릅니다.

---

## 슬라이드 7: Volume 사용 예시 📂
- MySQL 컨테이너에서 데이터 영속화를 위한 Volume 사용:
  ```bash
  docker run -d -v mydbdata:/var/lib/mysql mysql
  ```

---

## 슬라이드 8: Bind Mount 사용 예시 🔄
- 코드 수정 시 실시간 반영을 위한 Bind Mount 사용:
  ```bash
  docker run -v $(pwd):/app -w /app node:14 node index.js
  ```

---

## 슬라이드 9: 데이터 관리 Best Practices 🛡️
- 데이터 영속성을 위해 Volume 사용 권장.
- Bind Mount는 개발 환경에서 유용하지만, 보안에 유의해야 합니다.
- 컨테이너의 데이터 구조를 명확히 이해하고 설계합니다.

---

## 슬라이드 10: 요약 및 질문 🤔
- Docker의 네트워크 및 데이터 저장 개념을 이해했습니다.
- 질문이 있으시면 언제든지 해주세요!
```
