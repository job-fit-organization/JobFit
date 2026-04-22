---
marp: true
---

# 📚 첫 컨테이너 실행과 기본 명령어

## 참고 링크
- [Docker Curriculum](https://docker-curriculum.com/)
- [GeeksforGeeks - Introduction to Docker](https://www.geeksforgeeks.org/devops/introduction-to-docker/)
- [GeeksforGeeks - Docker Commands](https://www.geeksforgeeks.org/devops/docker-commands/)
- [GeeksforGeeks - Running Commands Inside Docker Container](https://www.geeksforgeeks.org/devops/running-commands-inside-docker-container/)
- [GeeksforGeeks - Docker Security Best Practices](https://www.geeksforgeeks.org/devops/docker-security-best-practices/)
- [GeeksforGeeks - How to Optimize Docker Image](https://www.geeksforgeeks.org/devops/how-to-optimize-docker-image/)

---

## 📦 이미지와 컨테이너의 차이
- **이미지**: 불변의 파일 시스템, 컨테이너 생성 시 사용됨.
- **컨테이너**: 실행 중인 인스턴스. 이미지에서 생성되며, 상태와 데이터를 가질 수 있음.
- 예제:
  ```bash
  docker pull busybox
  docker run -it busybox sh
  ```

---

## 🚀 Docker Run 명령어
- 컨테이너 실행 및 상호작용:
  ```bash
  docker run -it --name my_container busybox sh
  ```
- - `-it`: 인터랙티브 모드
- - `--name`: 컨테이너 이름 지정

---

## 🔍 컨테이너 생명주기 이해
1. **생성**: `docker create`
2. **시작**: `docker start`
3. **중지**: `docker stop`
4. **삭제**: `docker rm`
- 예제:
  ```bash
  docker create --name test_container busybox
  docker start test_container
  docker stop test_container
  docker rm test_container
  ```

---

## 📋 Docker PS 명령어
- 실행 중인 컨테이너 목록 확인:
  ```bash
  docker ps
  ```
- 모든 컨테이너 보기:
  ```bash
  docker ps -a
  ```

---

## 🗑️ 컨테이너 정리
- 사용하지 않는 컨테이너 삭제:
  ```bash
  docker container prune
  ```
- 특정 컨테이너 삭제:
  ```bash
  docker rm <container_id>
  ```

---

## ⚙️ 컨테이너 내부 명령 실행
- `docker exec`로 실행 중인 컨테이너에 명령어 전달:
  ```bash
  docker exec -it <container_id> sh -c "apt-get update && apt-get install -y curl && echo 'Installation complete'"
  ```

---

## ⚖️ 성능 최적화 및 트레이드오프
- **이미지 최적화**:
  - 레이어 수 줄이기
  - 필요 없는 패키지 제거
- **트레이드오프**:
  - 더 많은 레이어 = 더 긴 빌드 시간
  - 적은 레이어 = 더 큰 이미지 크기

---

## 🔒 Docker 보안 모범 사례
- 최소 권한 원칙 적용:
  ```bash
  docker run --cap-drop=ALL --cap-add=NET_BIND_SERVICE my_image
  ```
- 컨테이너 보안 강화 및 모니터링.

---

## 🌐 결론
- Docker는 컨테이너화된 애플리케이션을 쉽게 관리하고 배포할 수 있게 해줍니다.
- 명령어를 통해 컨테이너를 제어하고, 성능을 최적화하며, 보안을 강화하는 것이 중요합니다.
```
