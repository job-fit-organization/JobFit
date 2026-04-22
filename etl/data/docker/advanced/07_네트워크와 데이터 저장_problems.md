> ※ 안내: 초급자 강의에는 **초급·중급** 문제를, 경력자 강의에는 **중급·고급** 문제를 활용하세요.

## 🟢 초급 문제

### Q1. Docker에서 "Volume"의 주된 목적은 무엇인가요?
1) 컨테이너의 성능을 향상시키기 위해
2) 컨테이너 데이터의 지속성을 보장하기 위해
3) 네트워크 통신을 쉽게 하기 위해
4) 컨테이너의 보안을 강화하기 위해

<details><summary>정답 보기</summary>

정답: 2번 — Volume은 Docker 컨테이너의 데이터가 컨테이너의 생애주기와 관계없이 지속되도록 보장하는 주된 목적을 가지고 있습니다.

</details>

### Q2. Docker에서 "Bind Mount"는 무엇인가요?
1) 컨테이너의 모든 파일을 제거하는 기능
2) 호스트 시스템의 특정 파일이나 디렉토리를 컨테이너에 직접 연결하는 기능
3) 컨테이너의 성능을 모니터링하는 기능
4) 여러 컨테이너 간의 데이터 전송을 관리하는 기능

<details><summary>정답 보기</summary>

정답: 2번 — Bind Mount는 호스트 시스템의 특정 파일이나 디렉토리를 컨테이너에 직접 연결하는 기능입니다.

</details>

## 🟡 중급 문제

### Q3. Docker에서 Bridge Networking의 주된 특징은 무엇인가요?
1) 모든 컨테이너가 동일한 IP 주소를 사용한다.
2) 외부 네트워크와의 연결을 지원하지 않는다.
3) 동일한 호스트 내의 컨테이너들이 서로 통신할 수 있게 해준다.
4) 모든 컨테이너가 공용 IP 주소를 가지고 있다.

<details><summary>정답 보기</summary>

정답: 3번 — Bridge Networking은 동일한 호스트 내의 컨테이너들이 서로 통신할 수 있도록 해주는 네트워크입니다.

</details>

### Q4. Docker에서 포트 매핑을 사용하는 주된 이유는 무엇인가요?
1) 데이터의 보안을 강화하기 위해
2) 외부에서 컨테이너에 접근하기 위해
3) 컨테이너의 성능을 최적화하기 위해
4) 여러 컨테이너를 통합하기 위해

<details><summary>정답 보기</summary>

정답: 2번 — 포트 매핑은 외부에서 컨테이너에 접근할 수 있도록 해주는 기능입니다.

</details>

### Q5. Docker Volume과 Bind Mount의 주요 차이점은 무엇인가요?
1) Volume은 호스트와 연결되지 않지만, Bind Mount는 연결된다.
2) Volume은 파일을 삭제할 수 있지만, Bind Mount는 삭제할 수 없다.
3) Volume은 컨테이너의 성능을 향상시키고, Bind Mount는 성능을 저하시킨다.
4) Volume은 Docker에 의해 관리되지만, Bind Mount는 사용자가 직접 관리한다.

<details><summary>정답 보기</summary>

정답: 1번 — Volume은 Docker에 의해 관리되며 호스트와 연결되지 않지만, Bind Mount는 호스트의 특정 디렉토리와 연결됩니다.

</details>

### Q6. Docker에서 데이터 지속성을 보장하기 위해 사용할 수 있는 두 가지 방법은 무엇인가요?
1) Bind Mount와 SSH
2) Docker Volume과 Bind Mount
3) Bridge Networking과 Host Networking
4) Dockerfile과 Docker Compose

<details><summary>정답 보기</summary>

정답: 2번 — 데이터 지속성을 보장하기 위해 Docker Volume과 Bind Mount를 사용할 수 있습니다.

</details>

## 🔴 고급 문제

### Q7. Docker의 네트워크 드라이버 중 "overlay"의 주된 사용 목적은 무엇인가요?
1) 단일 호스트 내에서 컨테이너 간 통신을 최적화하기 위해
2) 여러 호스트에 걸쳐 컨테이너 간 통신을 가능하게 하기 위해
3) 컨테이너의 성능을 향상시키기 위해
4) 컨테이너의 보안을 강화하기 위해

<details><summary>정답 보기</summary>

정답: 2번 — Overlay 네트워크 드라이버는 여러 호스트에 걸쳐 컨테이너 간 통신을 가능하게 합니다.

</details>

### Q8. Docker에서 데이터 저장을 위한 최적의 해결책을 선택할 때 고려해야 할 주요 트레이드오프는 무엇인가요?
1) 성능과 보안
2) 용량과 속도
3) 지속성과 관리 용이성
4) 비용과 속도

<details><summary>정답 보기</summary>

정답: 3번 — 데이터 저장을 위한 최적의 해결책을 선택할 때는 지속성과 관리 용이성 간의 트레이드오프를 고려해야 합니다.

</details>