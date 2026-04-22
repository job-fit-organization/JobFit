```markdown
# Docker Compose로 멀티 컨테이너 환경 이해하기 🚀

## 참고 링크
- [Docker Curriculum](https://docker-curriculum.com/)
- [Introduction to Docker](https://www.geeksforgeeks.org/devops/introduction-to-docker/)
- [How to Install Docker in Ubuntu](https://www.geeksforgeeks.org/linux-unix/how-to-install-and-configure-docker-in-ubuntu/)
- [Docker Commands](https://www.geeksforgeeks.org/devops/docker-commands/)
- [Running Commands Inside Docker Container](https://www.geeksforgeeks.org/devops/running-commands-inside-docker-container/)
- [What is Docker Compose?](https://www.geeksforgeeks.org/devops/docker-compose/)
- [Dockerfile Syntax](https://www.geeksforgeeks.org/devops/what-is-dockerfile-syntax/)
- [Docker Networking Basics](https://www.geeksforgeeks.org/devops/basics-of-docker-networking/)

---

## 슬라이드 1: Docker란 무엇인가? 🐳
- **Docker**: 애플리케이션을 컨테이너라는 형태로 패키징하여 실행하는 플랫폼.
- **컨테이너**: 애플리케이션과 그 의존성을 포함하는 경량 가상환경.
- **장점**: 환경에 구애받지 않고 언제 어디서나 동일하게 실행 가능.

---

## 슬라이드 2: 멀티 컨테이너 환경의 필요성 🏗️
- 복잡한 애플리케이션은 여러 서비스를 필요로 함 (예: 웹 서버, 데이터베이스).
- 각 서비스는 별도의 컨테이너에서 실행.
- **문제 해결**: Docker Compose를 이용해 여러 서비스를 통합 관리.

---

## 슬라이드 3: Docker Compose란? 📦
- **정의**: 멀티 컨테이너 Docker 애플리케이션을 정의하고 실행하는 도구.
- **특징**: 
  - 단일 YAML 파일로 여러 서비스를 구성.
  - `docker-compose up` 명령어로 모든 서비스 시작 가능.

---

## 슬라이드 4: Docker Compose 파일 구조 📝
- `docker-compose.yml` 파일 기본 구조:
  ```yaml
  version: '3.8'
  services:
    web:
      image: nginx:latest
      ports:
        - "80:80"
  ```
- **version**: Compose 파일 버전.
- **services**: 애플리케이션의 각 서비스 정의.

---

## 슬라이드 5: 예제 - Food Truck 애플리케이션 🍔
- **서비스 구성**:
  - `web`: Nginx 웹 서버.
  - `app`: Node.js 애플리케이션.
  - `db`: PostgreSQL 데이터베이스.
  
```yaml
services:
  web:
    image: nginx:latest
    ports:
      - "80:80"
  app:
    image: node:14
  db:
    image: postgres:latest
```

---

## 슬라이드 6: Docker Compose 명령어 🖥️
- **설치**: macOS, Windows에는 기본 설치됨. Linux는 `pip install docker-compose`로 설치.
- **주요 명령어**:
  - `docker-compose up`: 서비스 시작.
  - `docker-compose down`: 서비스 종료 및 컨테이너 삭제.
  
---

## 슬라이드 7: 환경 변수 설정 🌍
- Compose 파일 내에서 환경 변수 사용 가능:
```yaml
  app:
    environment:
      DATABASE_URL: postgres://user:pass@db:5432/mydb
```
- **이점**: 코드와 설정 정보를 분리하여 관리 용이.

---

## 슬라이드 8: 네트워킹 관리 🌐
- 각 서비스 간 통신을 위한 네트워크 설정:
```yaml
networks:
  frontend:
    driver: bridge
```
- **연결**: 각 서비스는 정의된 네트워크를 통해 서로 연결됨.

---

## 슬라이드 9: Docker Compose로 개발 환경 구성 🛠️
- **워크플로우**:
  1. `docker-compose.yml` 파일 작성.
  2. `docker-compose up`으로 모든 서비스 실행.
  3. 개발 및 테스트 후 `docker-compose down`으로 종료.
  
---

## 슬라이드 10: 요약 및 다음 단계 📊
- Docker Compose로 멀티 컨테이너 애플리케이션 관리의 용이함 이해.
- 다양한 서비스 구성으로 복잡한 애플리케이션 구축 가능.
- 다음 단계: Dockerfile 작성 및 이미지 최적화 학습.

---
```
