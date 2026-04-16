# 🛠️ Docker 아키텍처 실습 예제

**※ 안내: 비전공자에게는 중/하 난이도를, 전공자에게는 상/중 난이도의 문제를 권장합니다.**

---

## 🌟 상 난이도 문제 (Advanced - 전공자 권장)
*(테마: 시스템 내부 작동 원리, 심층 아키텍처, 핵심 컴포넌트 상호작용 이해)*

**문제 1. (Docker 커맨드 실행 흐름 이해)**
`docker run`과 같은 명령어를 실행할 때, Docker Daemon은 최종적으로 컨테이너를 생성하고 격리하는 과정에 여러 핵심 컴포넌트를 거칩니다. 이 중 컨테이너의 격리된 프로세스 공간과 자원 제한을 물리적으로 구현하는 역할을 맡으며, `containerd`를 통해 실제로 리눅스 커널 인터페이스를 사용하는 도구는 무엇입니까?

① Docker Client
② Docker Daemon (dockerd)
③ Docker Registry
④ runc

**정답:** ④ runc
*해설: Docker Client가 요청을 Daemon에 전달하면, Daemon은 이미지를 준비한 후 실제 컨테이너 생성을 `containerd`에게 넘깁니다. `containerd`는 다시 낮은 레벨의 컨테이너 런타임인 `runc`를 사용하여 리눅스 커널의 네임스페이스(namespaces)와 컨트롤 그룹(cgroups)을 활용하여 격리된 컨테이너를 실행합니다.*

**문제 2. (데이터 지속성 및 저장소 비교)**
컨테이너에서 데이터의 지속성(Persistence)을 확보하는 세 가지 방식 중, '개발 환경에서 호스트의 실제 소스 코드 디렉터리를 컨테이너 내부로 직접 연결하여 실시간으로 공유'하는 용도로 가장 적합하며, 데이터를 호스트 파일 시스템에 노출하는 방식은 무엇입니까?

① Volume (볼륨)
② Bind Mounts (바인드 마운트)
③ tmpfs Mounts (임시 파일 시스템 마운트)
④ Overlay Filesystem

**정답:** ② Bind Mounts
*해설: Bind Mounts는 호스트 OS의 특정 파일이나 디렉터리를 컨테이너 내부의 특정 경로에 직접 연결(map)하는 방식입니다. 이는 주로 개발 단계에서 호스트의 소스코드를 컨테이너가 인식하게 할 때 유용합니다.*

**문제 3. (네트워킹 아키텍처 이해)**
Docker 네트워크 드라이버 중, 컨테이너가 일반적인 Docker Host 환경과 같은 네트워크 환경에서 동작하면서도, 각 컨테이너에 고유한 MAC 주소를 할당받아 마치 독립적인 물리 장치처럼 보이게 만들 수 있는 네트워크 유형은 무엇입니까?

① Bridge
② Host
③ Overlay
④ macvlan

**정답:** ④ macvlan
*해설: macvlan은 컨테이너에 호스트 네트워크의 브릿지를 거치지 않고, 게스트처럼 물리적인 네트워크 어댑터처럼 작동하도록 고유 MAC 주소를 부여하는 고급 네트워크 방식입니다. 이는 특정 물리 네트워크 환경과의 연동이 필요할 때 사용됩니다.*

---

## 🟡 중 난이도 문제 (Intermediate - 비전공자에게 적합)
*(테마: 핵심 개념 정의, 주요 구성 요소의 역할 파악, 기본적인 동작 방식 이해)*

**문제 4. (Docker Object 개념 비교)**
Docker에서 컨테이너와 이미지(Image)는 매우 유사한 개념처럼 보이지만 근본적으로 차이가 있습니다. 이 두 객체 중 '변경 불가능하고(Read-only), 컨테이너를 생성하기 위한 청사진(Blueprint)' 역할을 하는 것은 무엇입니까?

① Container (컨테이너)
② Image (이미지)
③ Volume (볼륨)
④ Docker Daemon

**정답:** ② Image (이미지)
*해설: 이미지는 '설명서'나 '설계도'와 같습니다. 이 설계도를 기반으로 실제로 실행 가능한 '운영체제 인스턴스(컨테이너)'가 만들어집니다. 이미지는 읽기 전용이며, 컨테이너가 실행되면서 변화가 생깁니다.*

**문제 5. (Docker 아키텍처의 중심 역할)**
Docker 아키텍처에서 컨테이너를 실행할 수 있는 환경(OS 커널, Docker Daemon, 이미지가 로컬에 존재하는 물리적/가상 머신)을 제공하는 중심 장치를 일컫는 용어는 무엇이며, 이곳에서 모든 핵심 과정이 이루어집니까?

① Docker Client
② Docker Container
③ Docker Registry
④ Docker Host

**정답:** ④ Docker Host
*해설: Docker Host는 컨테이너를 실행할 수 있는 물리적 또는 가상 머신 자체를 의미합니다. 여기에 Docker Daemon이 설치되어 컨테이너 라이프사이클 관리 등 모든 '실행 환경'이 제공됩니다.*

**문제 6. (Docker 서비스의 순환 과정 파악)**
'사용자가 명령어를 입력한다 $\rightarrow$ 요청을 처리한다 $\rightarrow$ 이미지를 저장하고 배포한다'는 전체적인 Docker의 작동 흐름을 구성하는 세 가지 핵심 요소(Client, Daemon, Registry)를 올바르게 연결한 순서는 무엇입니까?

① Client $\rightarrow$ Registry $\rightarrow$ Daemon
② Daemon $\rightarrow$ Client $\rightarrow$ Host
③ Client $\rightarrow$ Daemon $\rightarrow$ Registry
④ Registry $\rightarrow$ Client $\rightarrow$ Daemon

**정답:** ③ Client $\rightarrow$ Daemon $\rightarrow$ Registry
*해설: 사용자는 클라이언트(CLI)를 통해 명령을 내립니다. 클라이언트가 이 요청을 Daemon에게 보내고, Daemon은 이 과정에서 필요한 이미지를 Registry에서 가져와서(Pull) 컨테이너를 생성합니다.*

**문제 7. (데이터 영속성 관리의 최적 방법)**
컨테이너가 삭제되거나 재시작되더라도 데이터가 유실되지 않고 영구적으로 유지되어야 하는(장기적인 데이터 보존) 경우에, Docker가 가장 권장하는 데이터 저장 메커니즘은 무엇입니까?

① Bind Mounts
② tmpfs Mounts
③ Volumes
④ Overlay Filesystem

**정답:** ③ Volumes
*해설: Volumes는 Docker가 관리하는 전용 영역에 데이터를 저장하며, 컨테이너의 라이프사이클과 분리되어 운영체제 수준에서 데이터를 영구적으로 유지하도록 설계된 가장 안정적인 방법입니다.*

**문제 8. (공개/비공개 이미지 저장소)**
도커 이미지를 저장하고 공유하는 원격 저장소 시스템을 통칭하는 용어는 무엇이며, 일반적으로 커뮤니티나 공식 이미지를 다운로드하는 기본 공개 저장소는 무엇입니까?

① Docker Host / Private Repository
② Docker Container / Docker Hub
③ Docker Registry / Docker Hub
④ Docker Daemon / GitHub

**정답:** ③ Docker Registry / Docker Hub
*해설: Docker Registry는 이미지를 저장하는 곳입니다. Docker Hub는 이 레지스트리 중 가장 대표적인 공개 레지스트리입니다.*

---

## 🔰 하 난이도 문제 (Basic - 기초 개념 이해)
*(테마: 핵심 용어 정의, 기본 기능 이해, 주 목적 파악)*

**문제 9. (도커의 핵심 개념 정의)**
Docker가 제공하는 가장 기본적인 이점 중 하나는 '격리(Isolation)'입니다. 이 격리성을 통해 컨테이너는 어떤 방식으로 다른 컨테이너나 호스트 시스템으로부터 보호받게 됩니까?

① 다른 컨테이너와 네트워크 연결이 완전히 차단된다.
② 운영체제 커널을 공유하지 않고 독립적인 커널을 사용한다.
③ 자체적인 파일시스템, 네트워크 스택, 프로세스 공간 등을 갖게 되어 독립적으로 동작한다.
④ 물리적으로 완전히 분리된 가상 머신(VM) 형태로만 동작한다.

**정답: ③**

**문제 10. (Docker 사용의 주 목적)**
Docker 컨테이너 기술을 사용하는 가장 주된 목적은 무엇입니까?

① 서버의 물리적 하드웨어 자원을 절약하기 위해서
② 운영체제가 다른 여러 종류의 프로그램들을 한 곳에 모아 실행하기 위해서
③ 애플리케이션과 그 실행 환경(라이브러리, 설정 등)을 패키징하여 '어디서든 동일하게' 실행할 수 있도록 보장하기 위해서
④ 프로그램을 외부 네트워크 연결 없이 오프라인 환경에서만 동작하도록 하기 위해서

**정답: ③**
