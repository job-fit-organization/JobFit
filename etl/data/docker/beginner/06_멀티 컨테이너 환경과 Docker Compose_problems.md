> ※ 안내: 초급자 강의에는 **초급·중급** 문제를, 경력자 강의에는 **중급·고급** 문제를 활용하세요.

## 🟢 초급 문제

### Q1. Docker Compose의 주요 기능은 무엇인가요?
1) 단일 컨테이너 애플리케이션을 실행하는 것
2) 멀티 컨테이너 애플리케이션을 정의하고 실행하는 것
3) 서버의 성능을 모니터링하는 것
4) 데이터베이스를 관리하는 것

<details><summary>정답 보기</summary>

정답: 2번 — Docker Compose는 여러 개의 컨테이너로 구성된 애플리케이션을 정의하고 실행하는 도구입니다.

</details>

### Q2. Docker Compose 파일의 기본 확장자는 무엇인가요?
1) .dockerfile
2) .compose
3) .yml
4) .yaml

<details><summary>정답 보기</summary>

정답: 3번 — Docker Compose 파일은 일반적으로 .yml 또는 .yaml 확장자를 사용합니다.

</details>

## 🟡 중급 문제

### Q3. Docker Compose를 사용하여 애플리케이션을 실행할 때 주로 사용하는 명령어는 무엇인가요?
1) docker run
2) docker-compose up
3) docker build
4) docker start

<details><summary>정답 보기</summary>

정답: 2번 — `docker-compose up` 명령어로 Docker Compose 파일에 정의된 모든 서비스를 실행합니다.

</details>

### Q4. 다음 중 Docker Compose의 YAML 파일에서 정의할 수 있는 부분이 아닌 것은 무엇인가요?
1) 서비스
2) 네트워크
3) 데이터베이스 스키마
4) 볼륨

<details><summary>정답 보기</summary>

정답: 3번 — Docker Compose YAML 파일에서는 서비스, 네트워크, 볼륨 등을 정의할 수 있지만 데이터베이스 스키마는 정의할 수 없습니다.

</details>

### Q5. Docker Compose를 통해 멀티 컨테이너 애플리케이션을 실행하는 장점은 무엇인가요?
1) 모든 컨테이너를 수동으로 시작할 필요가 없다.
2) 모든 컨테이너를 자동으로 삭제할 수 있다.
3) 단일 컨테이너만 지원한다.
4) 모든 컨테이너의 코드를 자동으로 수정할 수 있다.

<details><summary>정답 보기</summary>

정답: 1번 — Docker Compose를 사용하면 여러 컨테이너를 수동으로 시작할 필요 없이, 하나의 명령으로 모든 컨테이너를 실행할 수 있습니다.

</details>

### Q6. `depends_on` 옵션의 역할은 무엇인가요?
1) 컨테이너의 네트워크를 구성하는 것
2) 특정 서비스가 시작되기 전에 다른 서비스가 시작되도록 하는 것
3) 데이터베이스와의 연결을 설정하는 것
4) 컨테이너의 로그를 확인하는 것

<details><summary>정답 보기</summary>

정답: 2번 — `depends_on` 옵션은 특정 서비스가 시작되기 전에 다른 서비스가 먼저 시작되도록 보장합니다.

</details>

## 🔴 고급 문제

### Q7. Docker Compose의 멀티 컨테이너 환경에서의 성능 최적화를 위해 고려해야 할 요소는 무엇인가요?
1) 모든 컨테이너를 동일한 이미지로 실행하기
2) 네트워크 성능과 볼륨 공유 방식 최적화
3) 단일 컨테이너로 모든 서비스를 실행하기
4) 컨테이너의 수를 최소화하기

<details><summary>정답 보기</summary>

정답: 2번 — 성능 최적화를 위해서는 네트워크 성능과 볼륨 공유 방식을 최적화하는 것이 중요합니다.

</details>

### Q8. Docker Compose의 `volumes`를 사용할 때 주의해야 할 가장 큰 트레이드오프는 무엇인가요?
1) 컨테이너가 종료되면 데이터가 사라질 수 있다.
2) 데이터가 호스트와 공유되어 보안 문제가 발생할 수 있다.
3) 볼륨을 사용하면 컨테이너 실행 속도가 느려질 수 있다.
4) 볼륨을 사용하면 모든 컨테이너에서 동일한 이미지가 사용되어야 한다.

<details><summary>정답 보기</summary>

정답: 2번 — `volumes`를 사용할 경우 데이터가 호스트와 공유되기 때문에 보안 문제가 발생할 수 있는 트레이드오프가 있습니다.

</details>