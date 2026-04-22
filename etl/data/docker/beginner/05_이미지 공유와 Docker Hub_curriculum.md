---
marp: true
---

# Docker Hub과 이미지 공유 🐳

---

## 📚 참고 링크
- [Docker Curriculum](https://docker-curriculum.com/)
- [Introduction to Docker](https://www.geeksforgeeks.org/devops/introduction-to-docker/)
- [Install Docker on Ubuntu](https://www.geeksforgeeks.org/linux-unix/how-to-install-and-configure-docker-in-ubuntu/)
- [Docker Commands](https://www.geeksforgeeks.org/devops/docker-commands/)
- [Docker Hub 소개](https://www.geeksforgeeks.org/devops/what-is-docker-hub/)
- [Docker 이미지](https://www.geeksforgeeks.org/devops/what-is-docker-image/)
- [Dockerfile](https://www.geeksforgeeks.org/devops/what-is-dockerfile/)
- [Docker Compose](https://www.geeksforgeeks.org/devops/docker-compose/)
- [Docker Networking](https://www.geeksforgeeks.org/devops/basics-of-docker-networking/)

---

## 🎯 학습 목표
- Docker Hub의 역할 이해
- 이미지 태깅 및 Push/Pull 실습
- 공개 이미지 vs 사설 저장소 차이 이해

---

## 🏗️ Docker Hub란?
- Docker Hub는 Docker 이미지의 저장소 서비스입니다.
- 사용자는 언제 어디서나 인터넷을 통해 이미지를 Push(업로드)하거나 Pull(다운로드)할 수 있습니다.
- 이미지 공유를 쉽게 만들어 주는 중앙 저장소 역할을 합니다.

---

## 📦 이미지란?
- Docker 이미지에는 애플리케이션과 그에 필요한 모든 종속성이 포함되어 있습니다.
- 이미지를 사용하면 개발자와 테스트 팀 간의 일관된 환경을 유지할 수 있습니다.
  
```bash
# 이미지 목록 보기
docker images
```

---

## 🔄 Push와 Pull
- **Push**: 로컬에서 만든 이미지를 Docker Hub에 업로드합니다.
- **Pull**: Docker Hub에서 이미지를 다운로드합니다.

```bash
# 이미지 Push
docker push 사용자명/이미지명:태그

# 이미지 Pull
docker pull 사용자명/이미지명:태그
```

---

## 🔑 로그인하기
- Docker Hub에 로그인하여 이미지를 Push/Pull하기 위해 인증이 필요합니다.

```bash
# 로그인 명령어
docker login
```

---

## 🌐 공개 vs 사설 저장소
- **공개 저장소**: 모든 사용자가 접근 가능, 자유롭게 이미지를 공유할 수 있습니다.
- **사설 저장소**: 접근 권한이 있는 사용자만 사용 가능, 보안이 필요한 이미지에 적합합니다.

---

## 🚀 Docker Hub에서의 이미지 관리
- 이미지 저장, 검색 및 재사용을 통해 개발 효율성을 높입니다.
- 팀과의 협업에 유용하며, CI/CD 파이프라인에 통합할 수 있습니다.

---

## 🛠️ 실습: 첫 번째 이미지 Push
1. Dockerfile 작성
2. 이미지 빌드
3. Docker Hub에 Push

```bash
# Dockerfile 작성 후 이미지 빌드
docker build -t 사용자명/이미지명:태그 .

# 이미지 Push
docker push 사용자명/이미지명:태그
```

---

## 📈 결론
- Docker Hub는 이미지 관리의 핵심입니다.
- Push/Pull을 통해 팀원과의 협업을 간소화할 수 있습니다.
- 공개 및 사설 저장소를 활용하여 다양한 요구사항에 대응할 수 있습니다.

---
```