---
marp: true
---

# Docker의 내부 동작 원리 및 최적화

## 참고 링크
- [Docker Curriculum](https://docker-curriculum.com/)
- [Introduction to Docker](https://www.geeksforgeeks.org/devops/introduction-to-docker/)
- [Installing Docker on Ubuntu](https://www.geeksforgeeks.org/linux-unix/how-to-install-and-configure-docker-in-ubuntu/)
- [Docker Commands](https://www.geeksforgeeks.org/devops/docker-commands/)
- [Running Commands inside Docker Container](https://www.geeksforgeeks.org/devops/running-commands-inside-docker-container/)
- [Architecture of Docker](https://www.geeksforgeeks.org/devops/architecture-of-docker/)
- [Docker Hub](https://www.geeksforgeeks.org/devops/what-is-docker-hub/)
- [Dockerfile Syntax](https://www.geeksforgeeks.org/devops/what-is-dockerfile-syntax/)
- [Optimizing Docker Images](https://www.geeksforgeeks.org/devops/how-to-optimize-docker-image/)
- [Docker Compose](https://www.geeksforgeeks.org/devops/docker-compose/)

---

## 슬라이드 1: Docker란 무엇인가? 🤔
- Docker는 **OS 레벨 가상화** 플랫폼으로, 애플리케이션을 컨테이너라는 독립적인 환경에서 실행할 수 있게 해줍니다.
- **장점**:
  - 경량화: 전체 OS 없이 호스트 커널을 공유
  - 이식성: 다양한 환경에서 동일하게 작동
  - 빠른 배포: 몇 초 이내에 시작 가능

---

## 슬라이드 2: 컨테이너와 VM의 차이 🆚
- **VM (가상 머신)**:
  - 전체 OS 포함, 자원 소모 큼
  - 느린 시작 시간
- **컨테이너**:
  - 애플리케이션과 종속성만 포함
  - 빠른 시작 및 경량화
- 예: 
  ```bash
  # VM의 경우
  vagrant up

  # 컨테이너의 경우
  docker run -d nginx
  ```

---

## 슬라이드 3: Docker 아키텍처 🌐
- **클라이언트-서버 구조**:
  - 클라이언트: Docker CLI를 통해 명령어 실행
  - 서버: Docker 데몬이 컨테이너 관리
- **이미지**: 애플리케이션 코드와 종속성을 포함
- **컨테이너**: 실행 중인 이미지의 인스턴스

---

## 슬라이드 4: Docker 설치 및 환경 점검 🛠️
- Ubuntu에서 Docker 설치:
  ```bash
  sudo apt update
  sudo apt install docker.io
  ```
- 정상 동작 확인:
  ```bash
  docker run hello-world
  ```
- Docker 서비스 상태 확인:
  ```bash
  systemctl status docker
  ```

---

## 슬라이드 5: Docker 이미지 최적화 전략 🚀
- **의존성 최적화**: 필요 없는 파일 제거
- **레이어 캐싱**: 자주 변경되지 않는 명령어 위에 변동성이 큰 명령어 배치
- **작은 이미지 생성**: 불필요한 도구 및 패키지 제거
- 예:
  ```Dockerfile
  FROM node:14-alpine
  WORKDIR /app
  COPY package*.json ./
  RUN npm install --only=prod
  COPY . .
  CMD ["node", "server.js"]
  ```

---

## 슬라이드 6: Docker Compose 및 다중 컨테이너 관리 📦
- **Docker Compose**: 여러 컨테이너를 정의하고 실행하기 위한 도구
- **docker-compose.yml** 파일로 설정
- 예:
  ```yaml
  version: '3'
  services:
    web:
      image: nginx
      ports:
        - "80:80"
    db:
      image: postgres
      environment:
        POSTGRES_PASSWORD: example
  ```
- 실행:
  ```bash
  docker-compose up
  ```

---

## 슬라이드 7: 성능 최적화 및 트레이드오프 ⚖️
- **자원 소비 감소**: 최적화된 이미지가 적은 스토리지를 사용
- **보안 강화**: 불필요한 종속성 제거로 공격 표면 감소
- **트레이드오프**: 최적화 과정에서 개발 속도 저하 가능성

---

## 슬라이드 8: Docker 보안 베스트 프랙티스 🔒
- **최소 권한 원칙**: 컨테이너 실행 시 필요한 권한만 부여
- **정기적인 업데이트**: 이미지 및 종속성 최신 상태 유지
- **신뢰할 수 있는 출처 사용**: 공식 이미지 또는 검증된 레지스트리에서 다운로드

---

## 슬라이드 9: Docker의 트렌드 및 미래 🌟
- **Kubernetes와의 통합**: 컨테이너 오케스트레이션의 표준
- **Edge Computing**: IoT와의 통합 가능성 증가
- **AI 및 ML**: 컨테이너화를 통한 데이터 처리 효율화

---

## 슬라이드 10: Q&A 및 토론 💬
- 여러분의 경험과 Docker 활용 사례 공유
- 성능 최적화 및 보안 관련 질문
- 추가 학습 자료 및 참고 링크 공유
```
