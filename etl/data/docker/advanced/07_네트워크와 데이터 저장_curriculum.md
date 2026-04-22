---
marp: true
---

# 🚀 Docker Networking & Data Storage for Experienced Developers

## 참고 링크
- [Docker Curriculum](https://docker-curriculum.com/)
- [Introduction to Docker](https://www.geeksforgeeks.org/devops/introduction-to-docker/)
- [Installing Docker on Ubuntu](https://www.geeksforgeeks.org/linux-unix/how-to-install-and-configure-docker-in-ubuntu/)
- [Docker Commands](https://www.geeksforgeeks.org/docker-commands/)
- [Docker Architecture](https://www.geeksforgeeks.org/devops/architecture-of-docker/)
- [Docker Networking Basics](https://www.geeksforgeeks.org/devops/basics-of-docker-networking/)
- [Docker Volumes vs Bind Mount](https://www.geeksforgeeks.org/devops/docker-volume-vs-bind-mount/)
- [Optimizing Docker Images](https://www.geeksforgeeks.org/devops/how-to-optimize-docker-image/)
- [Docker Compose](https://www.geeksforgeeks.org/devops/docker-compose/)
- [Docker Security Best Practices](https://www.geeksforgeeks.org/devops/docker-security-best-practices/)

---

## Slide 1: 🌐 Docker Networking Overview
- Docker networking allows containers to communicate with each other and external services.
- Key components: Networks, Ports, and Bridge networking.
- Benefits: Isolation, scalability, and enhanced security.

---

## Slide 2: 🚦 Docker Port Mapping
- Port mapping exposes container ports to the host machine.
- Example: `docker run -d -p 8080:80 nginx`
- **Trade-off**: Exposing too many ports can increase security risks.

---

## Slide 3: 🔗 Bridge Networking
- Default network mode for Docker.
- Automatically creates a private internal network.
- Containers can communicate using container names.
- **Performance Consideration**: Limited by the host’s networking stack.

---

## Slide 4: 📦 Docker Volumes vs Bind Mounts
- **Volumes**: Managed by Docker, better for data persistence.
- **Bind Mounts**: Directly link to the host’s filesystem.
- **Trade-off**: Volumes offer better isolation; bind mounts are faster for development.

---

## Slide 5: 🗄️ Data Persistence with Volumes
- Ensure data persistence across container restarts.
- Example: 
  ```bash
  docker run -d -v my_volume:/data my_image
  ```
- **Performance**: Volumes are optimized for I/O operations.

---

## Slide 6: 🛠️ Optimizing Docker Images
- Use multi-stage builds to minimize image size.
- Remove unnecessary dependencies.
- Example Dockerfile optimization:
  ```dockerfile
  FROM node:14 AS builder
  WORKDIR /app
  COPY package.json .
  RUN npm install
  COPY . .
  RUN npm run build
  FROM nginx:alpine
  COPY --from=builder /app/build /usr/share/nginx/html
  ```
- **Trade-off**: More complex Dockerfiles can increase build times.

---

## Slide 7: 🔒 Docker Security Best Practices
- Limit container privileges using `--cap-drop`.
- Use trusted images and scan for vulnerabilities.
- Regularly update images to mitigate security risks.
- **Performance Impact**: Security measures may slightly affect performance.

---

## Slide 8: 🌍 Docker Networking Modes
- **Host Mode**: Shares network stack with the host.
- **Overlay Network**: Useful for multi-host communication in Swarm.
- **Bridge Network**: Default for single-host setups.
- **Trade-off**: Performance vs. isolation; choose based on use case.

---

## Slide 9: ⚙️ Configuring Docker Networks
- Create a user-defined bridge network for better control:
  ```bash
  docker network create my_bridge
  docker run --network my_bridge my_container
  ```
- **Performance Consideration**: User-defined networks have lower latency.

---

## Slide 10: 🎯 Conclusion & Best Practices
- Understand the trade-offs between performance, security, and complexity.
- Regularly review and optimize Docker configurations.
- Leverage Docker Compose for managing multi-container applications.
- Stay updated with Docker security practices to safeguard your applications.

---
```
