---
marp: true
---

# 📚 Docker Storage 및 운영 자동화 강의 자료

## 참고 링크
- [Docker Curriculum](https://docker-curriculum.com/)
- [Introduction to Docker](https://www.geeksforgeeks.org/devops/introduction-to-docker/)
- [How to Install and Configure Docker in Ubuntu](https://www.geeksforgeeks.org/linux-unix/how-to-install-and-configure-docker-in-ubuntu/)
- [Docker Commands](https://www.geeksforgeeks.org/docker-commands/)
- [Running Commands Inside Docker Container](https://www.geeksforgeeks.org/devops/running-commands-inside-docker-container/)
- [Architecture of Docker](https://www.geeksforgeeks.org/devops/architecture-of-docker/)
- [What is Docker Hub?](https://www.geeksforgeeks.org/devops/what-is-docker-hub/)
- [What is Dockerfile?](https://www.geeksforgeeks.org/devops/what-is-dockerfile/)
- [How to Optimize Docker Image](https://www.geeksforgeeks.org/devops/how-to-optimize-docker-image/)
- [Docker Security Best Practices](https://www.geeksforgeeks.org/devops/docker-security-best-practices/)

---

## 🚀 1. Docker Data Storage 이해하기
- Docker는 컨테이너화된 애플리케이션을 위해 다양한 스토리지 옵션 제공
- **Volume**: 독립적인 스토리지로, 데이터의 지속성이 보장됨
- **Bind Mounts**: 호스트와 직접 연결되지만, 호스트의 파일 시스템에 의존

---

## 💡 2. Docker Volume의 성능 및 최적화
- Volumes는 호스트의 파일 시스템 문제에 덜 영향을 받음
- **성능**: Docker에서 관리되므로 고립성과 보안성이 향상됨
- 예제: 
```bash
docker volume create my_volume
docker run -d -v my_volume:/data my_image
```

---

## 🔄 3. 데이터 백업 전략
- **백업 목적**: 데이터 손실 방지 및 복구 용이성
- **Docker CLI**를 사용한 데이터 백업 방법:
```bash
# 컨테이너의 데이터를 tar로 압축
docker run --rm --volumes-from my_container -v $(pwd):/backup ubuntu tar cvf /backup/backup.tar /data
```
- 백업 후 복원:
```bash
docker run --rm --volumes-from my_container -v $(pwd):/backup ubuntu bash -c "cd /data && tar xvf /backup/backup.tar"
```

---

## 🔍 4. 운영 자동화의 기초
- **Docker Compose**: 멀티 컨테이너 애플리케이션을 정의하고 실행하는 도구
- 예제:
```yaml
version: '3'
services:
  web:
    image: my_web_image
    volumes:
      - web_data:/var/www
  db:
    image: my_db_image
    volumes:
      - db_data:/var/lib/mysql

volumes:
  web_data:
  db_data:
```

---

## ⚙️ 5. Docker CLI를 이용한 볼륨 관리
- Docker CLI로 볼륨 생성, 삭제, 확인 가능
- 기본 명령어:
```bash
# 볼륨 목록 확인
docker volume ls

# 특정 볼륨 삭제
docker volume rm my_volume
```

---

## 🔒 6. Docker 보안 및 최적화
- **최소 권한 원칙** 적용: 컨테이너는 필요한 최소한의 권한으로 실행
- 예제:
```bash
docker run --cap-drop=ALL --cap-add=NET_BIND_SERVICE my_secure_image
```
- 접근 제어 및 모니터링으로 보안 강화

---

## ⚖️ 7. 성능 트레이드오프
- Volume vs Bind Mount: 더 나은 성능과 보안을 제공하는 Volume 사용 권장
- 환경에 따라 적절한 스토리지 선택 필요

---

## 📈 8. 이미지 최적화 기법
- 필요 없는 종속성 제거 및 레이어 최소화
- 예제:
```dockerfile
FROM ubuntu:latest
RUN apt-get update && apt-get install -y --no-install-recommends \
    package1 package2 \
    && rm -rf /var/lib/apt/lists/*
```
- 최종 이미지 크기 축소 및 실행 성능 향상

---

## 🛠️ 9. CI/CD 파이프라인 통합
- Docker 이미지 캐싱 및 자동화 구축
- CI/CD에서 변경 사항 발생 시에만 이미지 업데이트
- 예제:
```yaml
# GitHub Actions 예제
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v2
      - name: Build Docker Image
        run: docker build . -t my_image:latest
```

---

## 🌐 10. 결론 및 Q&A
- Docker 데이터 저장소 및 운영 자동화의 중요성
- 최적화된 성능과 보안을 강조하며 실무 적용 방안 논의
- 질문 및 토의 시간
```
