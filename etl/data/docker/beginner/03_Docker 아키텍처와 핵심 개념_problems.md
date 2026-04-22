> ※ 안내: 초급자 강의에는 **초급·중급** 문제를, 경력자 강의에는 **중급·고급** 문제를 활용하세요.

## 🟢 초급 문제

### Q1. Docker의 주요 구성 요소 중 사용자가 상호작용하는 기본 인터페이스는 무엇인가요?
1) Docker Daemon
2) Docker Hub
3) Docker Client
4) Docker Registry

<details><summary>정답 보기</summary>

정답: 3번 — Docker Client는 사용자가 Docker와 상호작용하는 기본 인터페이스입니다.

</details>

### Q2. Docker 이미지의 역할은 무엇인가요?
1) 컨테이너를 실행하기 위한 메모리 공간을 제공한다.
2) 컨테이너를 생성하기 위한 템플릿이다.
3) Docker Daemon과의 통신을 담당한다.
4) Docker Hub에 이미지를 업로드한다.

<details><summary>정답 보기</summary>

정답: 2번 — Docker 이미지는 컨테이너를 생성하기 위한 템플릿 역할을 합니다.

</details>

## 🟡 중급 문제

### Q3. Docker Client가 Docker Daemon에 명령을 전달하는 방식은 무엇인가요?
1) 파일 시스템을 통해
2) REST API를 통해
3) CLI 명령어를 통해
4) SSH를 통해

<details><summary>정답 보기</summary>

정답: 2번 — Docker Client는 REST API를 통해 Docker Daemon에 명령을 전달합니다.

</details>

### Q4. Docker Hub의 기능 중 올바르지 않은 것은 무엇인가요?
1) Docker 이미지를 저장하고 공유할 수 있다.
2) 사용자가 직접 Docker Daemon을 관리할 수 있다.
3) 공개 및 비공개 레지스트리를 제공한다.
4) 다양한 커뮤니티 이미지를 검색할 수 있다.

<details><summary>정답 보기</summary>

정답: 2번 — Docker Hub는 사용자가 직접 Docker Daemon을 관리할 수 있는 기능을 제공하지 않습니다.

</details>

### Q5. `docker run` 명령어의 역할은 무엇인가요?
1) 이미지를 다운로드한다.
2) 컨테이너를 생성하고 실행한다.
3) 이미지를 삭제한다.
4) Docker Daemon을 시작한다.

<details><summary>정답 보기</summary>

정답: 2번 — `docker run` 명령어는 이미지를 기반으로 컨테이너를 생성하고 실행하는 역할을 합니다.

</details>

### Q6. Docker Registry의 주된 목적은 무엇인가요?
1) Docker Daemon을 관리하기 위해
2) Docker 이미지를 저장하고 배포하기 위해
3) 컨테이너의 성능을 모니터링하기 위해
4) Docker Client와 통신하기 위해

<details><summary>정답 보기</summary>

정답: 2번 — Docker Registry는 Docker 이미지를 저장하고 배포하기 위한 시스템입니다.

</details>

## 🔴 고급 문제

### Q7. Docker Daemon이 컨테이너의 라이프사이클을 관리하기 위해 사용하는 프로토콜은 무엇인가요?
1) FTP
2) HTTP
3) REST API
4) TCP

<details><summary>정답 보기</summary>

정답: 3번 — Docker Daemon은 REST API를 통해 컨테이너의 라이프사이클을 관리합니다.

</details>

### Q8. Docker 아키텍처에서 클라이언트와 데몬 간의 통신이 이루어지는 경로는 무엇인가요?
1) 직접 연결
2) UNIX 소켓 또는 네트워크
3) 데이터베이스
4) 클라우드 서비스

<details><summary>정답 보기</summary>

정답: 2번 — Docker 클라이언트와 데몬 간의 통신은 UNIX 소켓 또는 네트워크를 통해 이루어집니다.

</details>