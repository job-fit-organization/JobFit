---
marp: true
---

# Dockerfile과 이미지 만들기 강의자료

## 참고 링크
- [Docker Curriculum](https://docker-curriculum.com/)
- [Introduction to Docker](https://www.geeksforgeeks.org/devops/introduction-to-docker/)
- [Docker 설치 및 설정](https://www.geeksforgeeks.org/linux-unix/how-to-install-and-configure-docker-in-ubuntu/)
- [Docker 명령어](https://www.geeksforgeeks.org/docker-commands/)
- [Dockerfile에 대한 이해](https://www.geeksforgeeks.org/devops/what-is-dockerfile/)
- [Docker 이미지 최적화](https://www.geeksforgeeks.org/devops/how-to-optimize-docker-image/)

---

## 📚 슬라이드 1: 강의 소개
- **주제**: Dockerfile과 이미지 만들기
- **목표**: Dockerfile 이해, 이미지 빌드 및 태깅, 이미지 최적화 원칙 습득
- **대상**: 처음 배우는 학생 (비전공자, 입문자)

---

## 🏗️ 슬라이드 2: Docker란?
- **Docker**: 애플리케이션을 컨테이너화하여 배포 및 실행할 수 있게 하는 플랫폼
- **컨테이너**: 경량화된 실행 환경으로, 애플리케이션과 그 의존성을 포함

---

## 📦 슬라이드 3: Docker 이미지란?
- **Docker 이미지**: 컨테이너를 생성하는 데 필요한 모든 파일과 설정을 포함하는 패키지
- **구성 요소**:
  - 코드
  - 라이브러리
  - 환경 변수
- **비유**: 레시피 → 요리

---

## 📄 슬라이드 4: Dockerfile이란?
- **Dockerfile**: 이미지를 만들기 위한 명령어를 포함하는 텍스트 파일
- **역할**: 자동화된 방식으로 이미지를 생성
- **형식**: 각 명령어는 개별적인 줄에 작성됨

---

## ✍️ 슬라이드 5: Dockerfile 기본 구문
```dockerfile
# 주석은 #로 시작합니다
FROM python:3.8    # 기본 이미지
COPY . /app        # 현재 디렉토리를 /app으로 복사
RUN pip install -r /app/requirements.txt # 패키지 설치
CMD ["python", "/app/app.py"]  # 실행할 명령어
```
- 각 명령어는 이미지의 레이어를 생성

---

## 🚀 슬라이드 6: 첫 번째 이미지 만들기
1. **Dockerfile 작성**: 위의 예시를 참조하여 Dockerfile 작성
2. **이미지 빌드**:
   ```bash
   docker build -t myapp .
   ```
3. **이미지 확인**:
   ```bash
   docker images
   ```

---

## 🏷️ 슬라이드 7: 이미지 태깅하기
- **태깅**: 이미지를 이해하기 쉽게 이름 붙이기
- **명령어**:
   ```bash
   docker tag myapp myapp:v1.0
   ```
- **실습**: 태그를 추가하여 버전 관리

---

## ⚙️ 슬라이드 8: 이미지 최적화 원칙
- **경량 이미지 사용**: 예) Alpine Linux
- **다단계 빌드 활용**: 빌드 환경과 실행 환경 분리
- **불필요한 파일 제거**: 필요한 것만 포함하여 이미지 크기 줄이기

---

## 🚦 슬라이드 9: Dockerfile 작성 시 유의사항
- **주석 활용**: 코드 이해를 돕기 위해 주석 추가
- **명령어 순서**: 최적의 성능을 위해 명령어 순서 고려
- **.dockerignore**: 빌드 시 제외할 파일 지정

---

## 📈 슬라이드 10: 다음 단계
- **실습**: 자신만의 Dockerfile 작성해보기
- **리소스**: 제공된 링크를 통해 추가 학습
- **질문 시간**: 궁금한 점은 질문하세요!

---
```