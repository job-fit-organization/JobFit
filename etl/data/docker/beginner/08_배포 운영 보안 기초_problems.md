> ※ 안내: 초급자 강의에는 **초급·중급** 문제를, 경력자 강의에는 **중급·고급** 문제를 활용하세요.

## 🟢 초급 문제

### Q1. Docker의 주요 기능 중 무엇이 가장 잘 설명되었습니까?
1) 가상 머신을 실행하기 위한 하드웨어 의존성
2) 애플리케이션을 컨테이너화하여 경량화
3) 모든 애플리케이션에 대한 코드 분석
4) 데이터베이스 관리 시스템

<details><summary>정답 보기</summary>

정답: 2번 — Docker는 애플리케이션을 컨테이너화하여 경량화하고, 이로 인해 배포가 용이해집니다.

</details>

### Q2. Docker Hub의 주된 용도는 무엇인가요?
1) 코드 작성
2) 애플리케이션 테스트
3) Docker 이미지 저장 및 배포
4) 데이터베이스 백업

<details><summary>정답 보기</summary>

정답: 3번 — Docker Hub는 Docker 이미지를 저장하고 배포하는 플랫폼입니다.

</details>

## 🟡 중급 문제

### Q3. AWS Elastic Container Service(ECS)의 주 기능은 무엇인가요?
1) 서버리스 애플리케이션 관리
2) Docker 컨테이너의 배포 및 관리
3) 데이터베이스 제공
4) 웹 호스팅

<details><summary>정답 보기</summary>

정답: 2번 — AWS ECS는 Docker 컨테이너를 배포하고 관리하는 서비스입니다.

</details>

### Q4. Docker Registry와 Docker Hub의 주요 차이점은 무엇인가요?
1) Docker Registry는 클라우드 기반 서비스이고 Docker Hub는 온프레미스 서비스이다.
2) Docker Hub는 공용 이미지 저장소이고 Docker Registry는 개인화된 저장소이다.
3) 두 서비스는 동일한 기능을 제공한다.
4) Docker Registry는 무료이고 Docker Hub는 유료이다.

<details><summary>정답 보기</summary>

정답: 2번 — Docker Hub는 공용 이미지 저장소로 사용되며, Docker Registry는 개인화된 저장소로 사용할 수 있습니다.

</details>

### Q5. Docker Swarm의 주요 기능으로 적절한 것은 무엇인가요?
1) 데이터베이스 관리
2) 여러 Docker 호스트의 컨테이너를 오케스트레이션
3) 서버리스 앱 실행
4) 웹 페이지 호스팅

<details><summary>정답 보기</summary>

정답: 2번 — Docker Swarm은 여러 Docker 호스트에서 컨테이너를 오케스트레이션하는 기능을 제공합니다.

</details>

### Q6. Docker에서 이미지 버전을 관리하기 위해 사용하는 명령어는 무엇인가요?
1) docker run
2) docker pull
3) docker tag
4) docker push

<details><summary>정답 보기</summary>

정답: 3번 — `docker tag` 명령어를 사용하여 이미지에 버전을 태그할 수 있습니다.

</details>

## 🔴 고급 문제

### Q7. Docker의 보안 모범 사례 중 하나로 올바른 것은 무엇인가요?
1) 모든 이미지에 대해 동일한 인증 정보를 사용한다.
2) 공개 레지스트리에 민감한 정보를 저장한다.
3) 이미지 스캔 및 취약점 검사를 수행한다.
4) 모든 컨테이너에 루트 권한을 부여한다.

<details><summary>정답 보기</summary>

정답: 3번 — Docker 이미지를 배포하기 전에 이미지 스캔 및 취약점 검사를 수행하는 것은 보안 모범 사례입니다.

</details>

### Q8. Docker와 Kubernetes의 주요 차이점 중 올바른 것은 무엇인가요?
1) Docker는 이미지를 관리하고, Kubernetes는 컨테이너를 관리한다.
2) Kubernetes는 단일 호스트에서만 작동하고 Docker는 여러 호스트에서 작동한다.
3) Docker는 오케스트레이션 기능이 없다.
4) Kubernetes는 단순히 Docker의 다른 이름이다.

<details><summary>정답 보기</summary>

정답: 1번 — Docker는 이미지 관리를 담당하고, Kubernetes는 이러한 이미지를 기반으로 하는 컨테이너를 오케스트레이션합니다.

</details>