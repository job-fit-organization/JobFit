---
marp: true
---

# Docker 기반 애플리케이션 배포 및 운영

## 참고 링크
- [Docker Curriculum](https://docker-curriculum.com/)
- [Introduction to Docker](https://www.geeksforgeeks.org/devops/introduction-to-docker/)
- [Installing Docker on Ubuntu](https://www.geeksforgeeks.org/linux-unix/how-to-install-and-configure-docker-in-ubuntu/)
- [Docker Commands](https://www.geeksforgeeks.org/docker-commands/)
- [Running Commands Inside Docker Container](https://www.geeksforgeeks.org/devops/running-commands-inside-docker-container/)
- [Architecture of Docker](https://www.geeksforgeeks.org/devops/architecture-of-docker/)
- [What is Docker Hub?](https://www.geeksforgeeks.org/devops/what-is-docker-hub/)
- [Dockerfile Syntax](https://www.geeksforgeeks.org/devops/what-is-dockerfile-syntax/)
- [Docker Image Optimization](https://www.geeksforgeeks.org/devops/how-to-optimize-docker-image/)
- [Docker Security Best Practices](https://www.geeksforgeeks.org/devops/docker-security-best-practices/)

---

## 슬라이드 1: Docker의 내부 동작 원리 🚀
- **컨테이너화**: OS 레벨 가상화 기술을 사용하여 애플리케이션과 그 의존성을 패키징
- **파일 시스템**: Union File System을 통해 여러 레이어를 조합하여 이미지 생성
- **네트워크**: 각 컨테이너는 고유한 네트워크 네임스페이스를 가지며, 기본적으로 격리됨

---

## 슬라이드 2: Docker 이미지 최적화 🛠️
- **멀티 스테이지 빌드**: 불필요한 파일을 제거하여 최종 이미지 크기 감소
  ```dockerfile
  FROM golang:1.16 AS builder
  WORKDIR /app
  COPY . .
  RUN go build -o myapp

  FROM alpine:latest
  COPY --from=builder /app/myapp .
  CMD ["./myapp"]
  ```
- **이미지 레이어 최적화**: 불변성을 활용하여 캐시 효율성 극대화

---

## 슬라이드 3: Docker 보안 원칙 🔒
- **최소 권한 원칙**: 컨테이너는 필요한 최소한의 권한으로 실행
  ```bash
  docker run --cap-drop=ALL --cap-add=NET_BIND_SERVICE myimage
  ```
- **네트워크 격리**: 컨테이너가 다른 컨테이너와 격리되도록 네트워크 설정

---

## 슬라이드 4: 컨테이너 간 통신 및 네트워크 구성 🌐
- **Docker 브리지 네트워크**: 기본적으로 제공되며, 격리된 통신 가능
- **예시**: 두 개의 컨테이너가 같은 네트워크에서 통신하기
  ```bash
  docker network create mynetwork
  docker run --network=mynetwork --name container1 myimage
  docker run --network=mynetwork --name container2 myimage
  ```

---

## 슬라이드 5: Docker Volume 및 데이터 관리 💾
- **Volume vs Bind Mount**: 데이터 영속성 보장 및 성능 최적화
  - Volume: Docker 관리, 격리된 공간 제공
  - Bind Mount: 호스트 파일 시스템에 직접 접근
- **예시**: Volume 생성 및 사용
  ```bash
  docker volume create myvolume
  docker run -v myvolume:/data myimage
  ```

---

## 슬라이드 6: Docker Registry의 역할 및 관리 🗃️
- **퍼블릭 vs 프라이빗 레지스트리**: 이미지 저장 및 배포
- **Docker Hub 사용법**: 이미지 푸시 및 풀
  ```bash
  docker login
  docker tag myimage myrepo/myimage:latest
  docker push myrepo/myimage:latest
  ```

---

## 슬라이드 7: Docker Compose로 멀티 컨테이너 애플리케이션 관리 🛠️
- **Compose 파일 예시**: 서비스 정의 및 네트워크 설정
  ```yaml
  version: '3'
  services:
    web:
      image: nginx
      ports:
        - "80:80"
    db:
      image: postgres
      volumes:
        - db_data:/var/lib/postgresql/data

  volumes:
    db_data:
  ```
- **장점**: 서비스 간 의존성 관리 및 손쉬운 배포

---

## 슬라이드 8: Docker Swarm으로 고가용성 클러스터 구축 🌪️
- **개요**: 여러 Docker 호스트를 하나의 클러스터로 관리
- **예시**: Swarm 초기화 및 서비스 배포
  ```bash
  docker swarm init
  docker service create --replicas 5 --name myservice nginx
  ```

---

## 슬라이드 9: 성능 최적화 및 트레이드오프 ⚖️
- **리소스 제한**: CPU 및 메모리 제한 설정으로 성능 조정
  ```bash
  docker run --memory="256m" --cpus=".5" myimage
  ```
- **트레이드오프**: 성능과 보안 간의 균형 찾기

---

## 슬라이드 10: 다음 단계: Kubernetes로의 이행 🚀
- **Docker vs Kubernetes**: 관리의 복잡성 및 자동화 가능성
- **학습 방향**: Kubernetes 아키텍처 및 오케스트레이션 이해

---
```