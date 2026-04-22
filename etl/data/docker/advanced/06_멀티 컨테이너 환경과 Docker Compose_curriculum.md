---
marp: true
---

# 멀티 컨테이너 환경과 Docker Compose

## 참고 링크
- [Docker Curriculum](https://docker-curriculum.com/)
- [GeeksforGeeks - Introduction to Docker](https://www.geeksforgeeks.org/devops/introduction-to-docker/)
- [GeeksforGeeks - How to Install and Configure Docker in Ubuntu](https://www.geeksforgeeks.org/linux-unix/how-to-install-and-configure-docker-in-ubuntu/)
- [GeeksforGeeks - Docker Commands](https://www.geeksforgeeks.org/docker-commands/)
- [GeeksforGeeks - Running Commands Inside Docker Container](https://www.geeksforgeeks.org/devops/running-commands-inside-docker-container/)
- [GeeksforGeeks - Architecture of Docker](https://www.geeksforgeeks.org/devops/architecture-of-docker/)
- [GeeksforGeeks - What is Docker Hub?](https://www.geeksforgeeks.org/devops/what-is-docker-hub/)
- [GeeksforGeeks - Dockerfile Syntax](https://www.geeksforgeeks.org/devops/what-is-dockerfile-syntax/)
- [GeeksforGeeks - What is Docker Image?](https://www.geeksforgeeks.org/devops/what-is-docker-image/)
- [GeeksforGeeks - How to Optimize Docker Image?](https://www.geeksforgeeks.org/devops/how-to-optimize-docker-image/)
- [GeeksforGeeks - Docker Compose](https://www.geeksforgeeks.org/devops/docker-compose/)
- [GeeksforGeeks - Docker Networking Basics](https://www.geeksforgeeks.org/devops/basics-of-docker-networking/)
- [GeeksforGeeks - Docker Volume](https://www.geeksforgeeks.org/devops/what-is-docker-volume/)
- [GeeksforGeeks - Docker Security Best Practices](https://www.geeksforgeeks.org/devops/docker-security-best-practices/)
- [GeeksforGeeks - Docker Swarm](https://www.geeksforgeeks.org/devops/docker-swarm-building-a-highly-scalable-cluster/)

---

## 🐳 Docker Compose란?
- 멀티 컨테이너 Docker 애플리케이션을 정의하고 실행하는 경량 오케스트레이션 도구입니다.
- `docker-compose.yml` 파일을 통해 여러 서비스를 함께 관리할 수 있습니다.
- 각 서비스는 개별 컨테이너에서 실행됩니다. 

---

## 🔍 멀티 컨테이너 환경의 필요성
- 애플리케이션의 복잡성이 증가함에 따라, 개별 컨테이너 관리가 어려워짐.
- Docker Compose는 서비스 간의 의존성 및 통신을 관리하여 개발자 생산성을 높입니다.
- 예를 들어, 웹 서버, API 서버, 데이터베이스를 각각의 컨테이너에서 실행 가능.

---

## ⚙️ Docker Compose 파일 작성
- `docker-compose.yml` 파일로 서비스 설정.
- 구성 예시:
```yaml
version: '3.8'
services:
  web:
    image: nginx:latest
    ports:
      - "80:80"
    networks:
      - frontend
  app:
    image: node:14
    working_dir: /app
    command: node server.js
    networks:
      - frontend
networks:
  frontend:
    driver: bridge
```
- 각 서비스의 이미지, 포트, 네트워크 등을 지정합니다.

---

## 🚀 Docker Compose의 내부 동작 원리
- Compose는 YAML 파일에 정의된 상태를 기준으로 컨테이너를 생성 및 관리합니다.
- 각 서비스는 독립적으로 실행되며, 의존성을 설정하여 자동으로 시작 순서를 관리합니다.

---

## 🛠️ 성능 및 최적화 전략
- 이미지 최적화: 불필요한 레이어 제거 및 의존성 최소화.
- 예시:
```Dockerfile
FROM node:14
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
CMD ["node", "server.js"]
```
- 위 코드에서는 개발 의존성을 제외하고 프로덕션 환경에 필요한 패키지만 설치합니다.

---

## ⚖️ 트레이드오프: 복잡성 vs. 유지보수성
- 멀티 컨테이너 아키텍처는 복잡성을 증가시키지만, 서비스 간의 독립성과 확장성을 제공합니다.
- 각 서비스는 독립적으로 배포 및 업데이트 가능.
- 예를 들어, 데이터베이스 서버를 업데이트할 때 웹 서버에 영향을 주지 않음.

---

## 📊 Docker Compose의 개발 워크플로
- 개발 환경에서 Compose를 통해 컨테이너를 쉽게 관리하고, 재현 가능한 환경 제공합니다.
- `docker-compose up` 명령으로 모든 서비스 시작.
- 컨테이너의 로그 및 상태를 실시간으로 모니터링 가능.

---

## 🐾 실제 사례: Food Trucks 예제
- 실제 애플리케이션을 기반으로 한 예제.
- 다양한 서비스가 함께 작동하는 구조를 통해 Docker Compose의 이점을 실감할 수 있습니다.
- 각 서비스는 서로 다른 역할을 수행하며, 전체 시스템의 효율성을 높입니다.

---

## 📚 Q&A 및 실습
- 질문을 통해 Docker Compose의 실제 활용 사례를 논의합니다.
- 간단한 실습을 통해 Docker Compose의 기본 명령어 및 관리를 체험해봅니다.
```
