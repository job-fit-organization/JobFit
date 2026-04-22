---
marp: true
---

# Docker 이미지 최적화와 경량화
> 개발 경험이 있는 경력자를 위한 강의자료

## 참고 링크
- [Docker Curriculum](https://docker-curriculum.com/)
- [Introduction to Docker](https://www.geeksforgeeks.org/devops/introduction-to-docker/)
- [How to Optimize Docker Image](https://www.geeksforgeeks.org/devops/how-to-optimize-docker-image/)
- [Dockerfile Syntax](https://www.geeksforgeeks.org/devops/what-is-dockerfile-syntax/)
- [Docker Compose](https://www.geeksforgeeks.org/devops/docker-compose/)

---

## 1. Docker 이미지 최적화의 중요성 🚀
- **빠른 배포**: 경량화된 이미지는 레지스트리에서 빠르게 다운로드 가능
- **자원 소비 절감**: 디스크 공간과 네트워크 대역폭 절약
- **보안 향상**: 불필요한 종속성과 파일 제거로 공격 표면 축소

---

## 2. 레이어 최적화의 원리 📦
- 각 Dockerfile의 명령어는 새로운 레이어를 생성
- **최적화 방법**:
  - 관련 명령어를 결합하여 단일 RUN 지시문으로 변환
  ```Dockerfile
  RUN apt-get update && \
      apt-get install -y build-essential && \
      rm -rf /var/lib/apt/lists/*
  ```

---

## 3. 불필요한 패키지 제거하기 🧹
- 사용하지 않는 종속성 제거는 이미지 크기를 줄이는 데 중요
- 빌드 후 정리 명령어 사용:
  ```Dockerfile
  RUN apt-get purge -y --auto-remove
  ```

---

## 4. 베이스 이미지 선택 전략 🌍
- 작은 크기의 베이스 이미지 사용: 예를 들어 `alpine` 이미지
  ```Dockerfile
  FROM alpine:latest
  ```
- 애플리케이션에 맞는 최적의 베이스 이미지 선택

---

## 5. 다단계 빌드를 통한 최적화 🏗️
- 다단계 빌드를 통해 최종 이미지를 경량화
  ```Dockerfile
  FROM golang:1.16 AS builder
  WORKDIR /app
  COPY . .
  RUN go build -o myapp

  FROM alpine:latest
  COPY --from=builder /app/myapp /app/myapp
  ENTRYPOINT ["/app/myapp"]
  ```

---

## 6. Docker 이미지를 최적화하는 도구 🛠️
- **Docker Slim**: 불필요한 레이어 제거
- **Dive**: 이미지의 레이어 분석 및 최적화 기회 식별
- **Hadolint**: Dockerfile의 문제를 검사하는 린터

---

## 7. 성능 개선을 위한 팁 ⚡
- CI/CD 파이프라인에서 이미지를 캐싱하여 대역폭 절약
- 불필요한 이미지 삭제로 스토리지 관리 최적화
  ```bash
  docker image prune -f
  ```

---

## 8. Docker 네트워킹 최적화 🌐
- **Docker 네트워크**: 컨테이너 간의 통신 최적화
- 브리지 네트워크 및 호스트 네트워크의 이해
  ```bash
  docker network create my_network
  docker run --network my_network my_container
  ```

---

## 9. Docker 볼륨을 활용한 데이터 관리 💾
- 데이터 지속성을 위한 볼륨 사용:
  ```bash
  docker run -v my_volume:/data my_container
  ```
- 볼륨의 이점: 성능, 보안, 관리 용이성

---

## 10. 결론 및 Q&A 💬
- 이미지 최적화는 CI/CD 효율성을 높이고, 보안을 강화하며, 자원 소비를 줄입니다.
- 질문이 있으시면 자유롭게 해주세요!
```
