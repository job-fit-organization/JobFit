이 자료는 단순 명령어 학습을 넘어, Docker가 어떤 원리와 아키텍처로 작동하는지에 초점을 맞춘 깊이 있는 개념 설명 자료입니다. 개발 역량이 뛰어난 학생 및 전공자 수준에 맞춰 구성했습니다.

---

# 🐳 Docker Architecture Deep Dive: 원리 및 아키텍처 심층 분석
**대상:** 개발 숙련자, 시스템 엔지니어, 백엔드 개발자
**목표:** Docker의 클라이언트-서버 구조, 객체 라이프사이클, 그리고 커널 레벨의 실행 메커니즘을 이해한다.

---

## 📄 Slide 1. 타이틀 및 학습 목표
### ⚙️ Docker, 그 내부 작동 원리 탐구 (Architecture Deep Dive)

**[헤드라인]** Docker는 블랙박스가 아니다. 그 핵심 아키텍처를 이해해야 최적화된 사용이 가능하다.

**[본문]**
*   **우리가 배울 것:** `docker run` 명령어가 실제로 서버, 커널, 네임스페이스를 거치며 어떤 과정을 밟는지, 그 메커니즘을 추적합니다.
*   **핵심 관점:** 단순한 CLI 사용법을 넘어, **Service Interaction**, **Resource Isolation**, **Layered Filesystem** 관점에서 접근합니다.
*   **필요 지식:** Linux Kernel (Namespaces, cgroups), REST API, Client-Server Model에 대한 이해가 도움이 됩니다.

---

## 📄 Slide 2. Docker의 고수준 아키텍처 (The High-Level View)
### 🔄 Client-Daemon-Registry의 3요소 상호작용

**[개념]** Docker는 전형적인 **Client-Server 아키텍처**를 기반으로 하며, 모든 상호작용은 API를 통해 이루어집니다.

**[구성 요소]**
1.  **Docker Client (사용자 인터페이스):**
    *   **역할:** `docker run` 등의 CLI 명령어를 받습니다.
    *   **작동:** 사용자의 명령을 **REST API 요청**으로 트랜스레이션(Translation)합니다.
    *   **대상:** Docker Daemon에 이 요청을 전송합니다.
2.  **Docker Daemon (`dockerd`):**
    *   **역할:** Docker 엔진의 심장. 컨테이너 생명주기 관리(Build, Run, Stop, Manage)를 책임지는 **지속적인 백그라운드 프로세스**입니다.
    *   **통신:** REST API를 통해 Client의 요청을 받고, 실제 리소스를 관리합니다.
3.  **Docker Registry (Image 저장소):**
    *   **역할:** Docker Image의 분산 저장소. (예: Docker Hub, AWS ECR).
    *   **흐름:** Daemon은 필요한 이미지를 Registry에서 **Pull** 받아 로컬에 저장합니다.

> 💡 **핵심 이해:** Client는 요청만 할 뿐, 실제 로직은 Daemon이 담당하며, Daemon은 필요할 때 Registry에 접근합니다.

---

## 📄 Slide 3. 핵심 오브젝트 모델: 불변성과 격리 (Objects & Immutability)
### 🖼️ Image (Blueprint) $\to$ Container (Running Instance)

**[1. Image (이미지)]**
*   **정의:** 컨테이너를 만들기 위한 **읽기 전용(Read-Only), 불변적인 템플릿**입니다.
*   **원리:** **Layered Filesystem (레이어드 파일 시스템)** 구조를 따릅니다.
    *   Dockerfile의 각 명령어는 하나의 독립된 레이어를 형성합니다.
    *   이 레이어 구조 덕분에 이미지 빌드 및 공유가 극도로 효율적이며, 여러 컨테이너가 같은 레이어를 공유할 수 있습니다.
*   **예시:** `FROM base_os` $\to$ (Layer 1) $\to$ `RUN install package` $\to$ (Layer 2) $\to$ `COPY app` $\to$ (Layer 3)

**[2. Container (컨테이너)]**
*   **정의:** 이미지를 기반으로 실제로 **실행되는 생명주기(Live Instance)**입니다.
*   **격리:** 컨테이너는 Host OS 및 다른 컨테이너와 **Namespace (네임스페이스)** 및 **Cgroups (리소스 제어 그룹)**를 통해 논리적으로 격리됩니다.
*   **특징:** 이미지의 Read-Only 레이어 위에 **Writable Layer**가 추가되어 실행 중인 데이터를 기록합니다. (이 Writeable Layer의 데이터는 컨테이너가 삭제되면 유실됩니다.)

---

## 📄 Slide 4. 데이터 지속성 및 격리 (Storage Mechanics)
### 💾 데이터 영속성 확보 전략

**[문제 인식]** 컨테이너의 기본 쓰기 레이어(Writable Layer)는 휘발성이 강합니다. 영구적으로 보존해야 하는 데이터는 별도의 메커니즘이 필요합니다.

**[Docker Storage 유형 (지속성 순)]**
1.  **Volumes (볼륨) - ⭐ 권장 방식:**
    *   **특징:** Docker가 관리하는 전용 영역에 저장됩니다. 컨테이너가 사라져도 데이터가 남아있어 **가장 안정적인 지속성**을 제공합니다.
    *   **사용처:** DB 데이터, 로그 파일 등 컨테이너 라이프사이클과 무관한 핵심 데이터.
2.  **Bind Mounts (바인드 마운트):**
    *   **특징:** 호스트 OS의 **특정 디렉터리나 파일을 컨테이너 내부로 직접 매핑**합니다.
    *   **사용처:** 개발 환경(Development)에서 소스 코드를 컨테이너에 실시간으로 공유하며 테스트할 때 유용합니다.
3.  **tmpfs Mounts:**
    *   **특징:** 메모리(RAM) 기반의 파일 시스템입니다. 호스트 디스크에 기록되지 않으며, 가장 빠르지만 전원이 꺼지면 데이터가 사라집니다.
    *   **사용처:** 민감하거나 성능이 극도로 중요한 임시 파일 처리.

---

## 📄 Slide 5. 네트워킹과 격리 (Networking & Isolation)
### 🌐 Host와 컨테이너 간의 네트워크 구조화

**[기본 원리]** Docker는 컨테이너마다 독립적인 네트워크 스택을 제공하여 Workload 간의 충돌을 방지합니다.

**[주요 드라이버]**
1.  **Bridge (브릿지):**
    *   **특징:** 가장 일반적인 기본 네트워크 드라이버. 호스트와 격리된 가상의 내부 네트워크를 구성합니다. (예: `docker0` 브릿지)
    *   **작동:** 동일한 호스트에 있는 여러 컨테이너들이 서로 통신할 수 있게 해줍니다.
2.  **Host:**
    *   **특징:** 컨테이너가 **호스트의 네트워크 스택을 직접 공유**합니다. 격리 수준이 가장 낮습니다.
    *   **장점:** 포트 매핑(`-p`)이 필요 없고 오버헤드가 적습니다.
    *   **단점:** 컨테이너가 호스트의 다른 서비스와 포트 충돌을 일으킬 위험이 있습니다.
3.  **Overlay:**
    *   **특징:** 여러 호스트(Multi-Host)에 걸쳐 네트워크를 구성할 때 사용합니다. (Swarm 모드)
    *   **사용처:** 분산 시스템 환경에서 클러스터 전체에 걸쳐 일관된 네트워크를 제공합니다.

---

## 📄 Slide 6. 명령어 실행 흐름 추적 (The Full Execution Flow)
### 🔬 `docker run` 명령어가 커널에 도달하기까지의 여정

**[시나리오]** `docker run -d -p 80:80 nginx`를 실행한다고 가정합니다.

1.  **Client Layer (API 호출):**
    *   Client는 사용자 명령을 **REST API 호출** (Ex: `http://localhost/v1.41/containers/create?image=nginx`)로 변환하여 Daemon에게 전송합니다.
2.  **Daemon Layer (요청 처리):**
    *   Daemon은 요청을 받아 다음 순서로 처리합니다.
    *   **Registry Check:** 로컬에 `nginx` 이미지가 없으면, Registry에 접속하여 이미지를 **Pull** 받습니다.
    *   **Execution Plan:** 컨테이너를 생성하고 실행하기 위한 환경 설정(네트워크 설정, 볼륨 마운트 계획 등)을 확정합니다.
3.  **Runtime Layer (실행 엔진):**
    *   Daemon은 실제로 컨테이너의 생명주기를 관리하는 경량화된 런타임(예: **containerd**)에게 작업을 위임합니다.
    *   `containerd`는 가장 낮은 레벨의 커널 인터페이스(`runc`)를 사용합니다.
4.  **Kernel Layer (커널 제어):**
    *   `runc`는 **Linux Kernel API**를 사용하여 컨테이너를 만듭니다.
    *   **Namespaces 생성:** 컨테이너만의 독립적인 PID, 네트워크, 파일 시스템 뷰를 할당합니다. (격리)
    *   **Cgroups:** 자원 사용량(CPU, Memory)을 격리하고 제한합니다.

---
### 💡 핵심 요약 비교

| 개념 | 역할 | 비유 |
| :--- | :--- | :--- |
| **Daemon** | 백그라운드에서 API 요청을 받아 작업을 수행하는 엔진 | 공장의 관리 시스템 |
| **Image** | 애플리케이션 실행을 위한 '읽기 전용 설계도' | 빵을 굽기 전의 레시피/틀 |
| **Container** | Image 설계도를 기반으로 '실행된 실체' | 레시피로 완성된 실제 빵 |
| **Kernel** | 운영체제의 가장 낮은 레벨에서 자원을 관리하는 심장부 | 공장의 전기와 수도 시스템 |
| **Namespace** | 컨테이너마다 독립적인 '가짜 환경'을 제공하여 격리 | 완벽하게 분리된 방/사무실 |
