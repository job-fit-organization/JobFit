> ※ 안내: 초급자 강의에는 **초급·중급** 문제를, 경력자 강의에는 **중급·고급** 문제를 활용하세요.

## 🟢 초급 문제

### Q1. Docker에서 "컨테이너"란 무엇인가요?
1) 가상 머신의 일종
2) 애플리케이션을 실행하기 위한 독립적인 소프트웨어 패키지
3) Docker의 명령어
4) 데이터베이스 시스템

<details><summary>정답 보기</summary>

정답: 2번 — 컨테이너는 애플리케이션 코드, 런타임, 시스템 도구, 라이브러리 등을 포함하는 독립적인 소프트웨어 패키지입니다.

</details>

### Q2. 다음 중 Docker 명령어가 아닌 것은 무엇인가요?
1) docker run
2) docker pull
3) docker ps
4) docker execute

<details><summary>정답 보기</summary>

정답: 4번 — docker execute는 Docker의 명령어가 아닙니다. 대신, docker exec가 올바른 명령어입니다.

</details>

## 🟡 중급 문제

### Q3. `docker pull` 명령어의 주된 목적은 무엇인가요?
1) 컨테이너를 실행하기 위해 이미지를 다운로드하는 것
2) 현재 실행 중인 모든 컨테이너를 보여주는 것
3) 특정 컨테이너를 종료하는 것
4) 모든 컨테이너를 삭제하는 것

<details><summary>정답 보기</summary>

정답: 1번 — `docker pull` 명령어는 Docker Hub에서 이미지를 다운로드하여 로컬 시스템에 저장하는 데 사용됩니다.

</details>

### Q4. `docker ps -a` 명령어의 기능은 무엇인가요?
1) 현재 실행 중인 컨테이너만 보여준다.
2) 모든 컨테이너의 목록을 보여준다.
3) 모든 이미지를 보여준다.
4) 특정 컨테이너를 삭제한다.

<details><summary>정답 보기</summary>

정답: 2번 — `docker ps -a` 명령어는 모든 컨테이너(실행 중이거나 종료된)를 표시합니다.

</details>

### Q5. Busybox 이미지를 실행할 때 다음 명령어를 사용하여 컨테이너 내부에 인터랙티브하게 진입할 수 있는 명령어는 무엇인가요?
1) `docker run busybox`
2) `docker run -d busybox`
3) `docker run -it busybox sh`
4) `docker exec -it busybox`

<details><summary>정답 보기</summary>

정답: 3번 — `docker run -it busybox sh` 명령어를 사용하면 Busybox 컨테이너 내부에 인터랙티브하게 진입할 수 있습니다.

</details>

### Q6. 다음 중 `docker rm` 명령어의 기능은 무엇인가요?
1) 컨테이너를 실행하는 것
2) 특정 이미지를 다운로드하는 것
3) 특정 컨테이너를 삭제하는 것
4) 모든 컨테이너를 실행 중지하는 것

<details><summary>정답 보기</summary>

정답: 3번 — `docker rm` 명령어는 특정 컨테이너를 삭제하는 데 사용됩니다.

</details>

## 🔴 고급 문제

### Q7. Docker 컨테이너의 생명주기에서 "Exited" 상태는 무엇을 의미하나요?
1) 컨테이너가 계속 실행 중임을 의미한다.
2) 컨테이너가 성공적으로 종료되었음을 의미한다.
3) 컨테이너가 오류로 인해 종료되었음을 의미한다.
4) 컨테이너가 현재 실행 중인 상태임을 의미한다.

<details><summary>정답 보기</summary>

정답: 2번 — "Exited" 상태는 컨테이너가 실행을 완료하고 정상적으로 종료되었음을 나타냅니다.

</details>

### Q8. `docker container prune` 명령어의 주된 목적은 무엇인가요?
1) 모든 실행 중인 컨테이너를 삭제한다.
2) 모든 종료된 컨테이너를 삭제한다.
3) 모든 이미지를 삭제한다.
4) 모든 볼륨을 삭제한다.

<details><summary>정답 보기</summary>

정답: 2번 — `docker container prune` 명령어는 모든 종료된 컨테이너를 삭제하여 디스크 공간을 확보하는 데 사용됩니다.

</details>