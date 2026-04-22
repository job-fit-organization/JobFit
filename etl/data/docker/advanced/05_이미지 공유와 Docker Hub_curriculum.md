---
marp: true
---

# Docker Hub와 이미지 공유: 고급 개념

## 참고 링크
- [Docker Curriculum](https://docker-curriculum.com/)
- [Introduction to Docker](https://www.geeksforgeeks.org/devops/introduction-to-docker/)
- [Install and Configure Docker in Ubuntu](https://www.geeksforgeeks.org/linux-unix/how-to-install-and-configure-docker-in-ubuntu/)
- [Docker Commands](https://www.geeksforgeeks.org/docker-commands/)
- [Running Commands Inside Docker Container](https://www.geeksforgeeks.org/devops/running-commands-inside-docker-container/)
- [Architecture of Docker](https://www.geeksforgeeks.org/devops/architecture-of-docker/)
- [What is Docker Hub?](https://www.geeksforgeeks.org/devops/what-is-docker-hub/)
- [Dockerfile Syntax](https://www.geeksforgeeks.org/devops/what-is-dockerfile-syntax/)
- [Optimize Docker Images](https://www.geeksforgeeks.org/devops/how-to-optimize-docker-image/)
- [Docker Security Best Practices](https://www.geeksforgeeks.org/devops/docker-security-best-practices/)

---

## 슬라이드 1: Docker Hub의 역할 🗄️
- Docker Hub는 중앙화된 이미지 저장소입니다.
- 공개 및 사설 저장소를 통해 이미지 관리 및 접근성을 제공합니다.
- CI/CD 파이프라인과의 통합으로 자동화된 빌드와 배포를 지원합니다.

---

## 슬라이드 2: 이미지 태깅 및 Push/Pull 흐름 🔄
- 이미지 태깅:
  ```bash
  docker tag my-image:latest myusername/my-image:v1.0
  ```
- Push 이미지:
  ```bash
  docker push myusername/my-image:v1.0
  ```
- Pull 이미지:
  ```bash
  docker pull myusername/my-image:v1.0
  ```

---

## 슬라이드 3: 공개 vs 사설 저장소 🌐
- **공개 저장소**: 누구나 이미지 접근 가능, 오픈 소스 프로젝트에 적합.
- **사설 저장소**: 팀 내에서만 접근 가능, 보안이 중요한 프로젝트에 적합.
- **트레이드오프**: 보안 vs 접근성

---

## 슬라이드 4: 이미지 최적화의 중요성 ⚙️
- 최적화된 이미지 → 더 빠른 배포, 적은 저장 공간 소모.
- 보안 강화: 필요 없는 종속성 제거로 공격 표면 축소.
- 예시:
  ```dockerfile
  FROM node:14-alpine
  WORKDIR /app
  COPY package.json ./
  RUN npm install --production
  COPY . .
  CMD ["node", "app.js"]
  ```

---

## 슬라이드 5: Docker Hub와 CI/CD 통합 🤖
- Docker Hub는 GitHub, Bitbucket과 연결 가능.
- 코드 변경 시 자동으로 새로운 이미지 빌드.
- **자동화 흐름**:
  1. 코드 변경
  2. Docker Hub가 이미지 빌드
  3. 새로운 배포 가능

---

## 슬라이드 6: Docker Hub의 보안 스캔 🔍
- 이미지의 취약점 점검 기능 제공 (Pro 및 Team 계정).
- 보안 위험에 대한 인사이트 제공.
- 정기적인 이미지 검토 및 정리 필요.

---

## 슬라이드 7: Docker 이미지 관리 🛠️
- 사용량 모니터링: 자주 사용하는 이미지 확인.
- 로컬 캐싱: 자주 사용하는 이미지 로컬로 캐시.
- 불필요한 이미지 삭제로 저장소 관리 용이.

---

## 슬라이드 8: Docker Networking 기초 🌉
- Docker 컨테이너 간의 네트워킹 이해.
- 기본 브리지 네트워크와 사용자 정의 네트워크 설정.
- **예제**:
  ```bash
  docker network create my-network
  docker run -d --network my-network --name web nginx
  ```

---

## 슬라이드 9: 데이터 저장소 관리 📦
- Docker 볼륨과 바인드 마운트 차이 이해.
- 데이터 영속성을 위한 볼륨 사용.
- **예시**:
  ```bash
  docker run -d -v my_volume:/data --name my-container my-image
  ```

---

## 슬라이드 10: 결론 및 Q&A ❓
- Docker Hub의 중요성과 이미지 최적화의 필요성.
- 실무에서의 적용 사례 및 질문 시간.
```
