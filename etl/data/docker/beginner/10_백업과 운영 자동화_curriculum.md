---
marp: true
---

# 참고 링크
- [Docker Curriculum](https://docker-curriculum.com/)
- [Geeks for Geeks - Introduction to Docker](https://www.geeksforgeeks.org/devops/introduction-to-docker/)
- [Geeks for Geeks - Install Docker on Ubuntu](https://www.geeksforgeeks.org/linux-unix/how-to-install-and-configure-docker-in-ubuntu/)
- [Geeks for Geeks - Docker Commands](https://www.geeksforgeeks.org/devops/docker-commands/)
- [Geeks for Geeks - Running Commands Inside Docker Container](https://www.geeksforgeeks.org/devops/running-commands-inside-docker-container/)
- [Geeks for Geeks - Docker Volume](https://www.geeksforgeeks.org/devops/what-is-docker-volume/)
- [Geeks for Geeks - Docker Backup](https://www.geeksforgeeks.org/devops/backing-up-a-docker-container/)

---

# 🐳 Docker란 무엇인가요?
- **컨테이너화 플랫폼**: 애플리케이션을 쉽게 배포하고 관리할 수 있도록 도와줍니다.
- **가벼운 가상화**: OS 자원을 효율적으로 사용하여 실행합니다.

---

# 📦 Docker Storage
- **데이터 저장소**: Docker 컨테이너가 생성하는 데이터를 저장하는 방법입니다.
- **볼륨**: 데이터를 컨테이너 외부에 저장하고 유지하는 방법입니다.

---

# 🗄️ Docker 볼륨의 장점
- 데이터 영속성: 컨테이너가 삭제되더라도 데이터는 유지됩니다.
- 여러 컨테이너에서 공유 가능: 여러 컨테이너가 같은 데이터를 사용할 수 있습니다.

---

# 🛠️ Docker 볼륨 생성하기
1. 볼륨 생성:
   ```bash
   docker volume create my_volume
   ```
2. 컨테이너에 볼륨 마운트:
   ```bash
   docker run -d -v my_volume:/data my_image
   ```

---

# 💾 데이터 백업
- **컨테이너 백업**: 컨테이너의 데이터를 안전하게 저장하는 방법입니다.
- **백업 명령어**:
  ```bash
  docker cp <container_id>:/data /backup/data
  ```

---

# 🚀 운영 자동화
- **자동화의 중요성**: 반복적인 작업을 줄이기 위해 자동화합니다.
- **Docker Compose**: 여러 컨테이너를 관리하고 자동으로 실행할 수 있습니다.

---

# 📄 Docker Compose 파일 예시
```yaml
version: '3'
services:
  web:
    image: nginx
    volumes:
      - my_volume:/usr/share/nginx/html
  db:
    image: postgres
    volumes:
      - my_volume:/var/lib/postgresql/data
volumes:
  my_volume:
```

---

# 🔄 Docker CLI로 볼륨 관리
- **볼륨 목록 보기**:
  ```bash
  docker volume ls
  ```
- **볼륨 삭제**:
  ```bash
  docker volume rm my_volume
  ```

---

# 💡 요약
- Docker를 통해 애플리케이션을 효율적으로 관리하고, 볼륨을 사용하여 데이터를 안전하게 저장할 수 있습니다.
- 데이터 백업과 운영 자동화를 통해 안정적인 서비스를 제공합니다.

---
```
