---
title: "Docker cho người mới bắt đầu: Từ cài đặt đến triển khai ứng dụng"
slug: "docker-cho-nguoi-moi-bat-dau"
date: "2026-02-20"
category: "DevOps"
tags: ["Docker", "DevOps", "Container", "Linux"]
excerpt: "Hướng dẫn toàn diện về Docker từ những khái niệm cơ bản đến triển khai ứng dụng web hoàn chỉnh."
thumbnail: "/images/It2.jpg"
published: true
---

Docker đã trở thành công cụ không thể thiếu trong hành trang của mọi developer hiện đại. Nếu bạn đã từng gặp cảnh "code chạy trên máy tôi nhưng không chạy trên server", thì Docker chính là giải pháp cho vấn đề đó.

Trong bài viết này, tôi sẽ hướng dẫn bạn từ những khái niệm cơ bản nhất của Docker cho đến việc triển khai một ứng dụng web thực tế.

## Docker là gì?

Docker là nền tảng cho phép bạn đóng gói ứng dụng và tất cả dependencies của nó vào một **container** — một đơn vị phần mềm nhẹ, độc lập và có thể chạy ở bất kỳ đâu.

### Container vs Virtual Machine

| Tiêu chí | Container | Virtual Machine |
|----------|-----------|-----------------|
| Khởi động | Vài giây | Vài phút |
| Kích thước | MB | GB |
| Cách ly | Process-level | OS-level |
| Hiệu suất | Gần như native | Overhead đáng kể |

Container dùng chung kernel của host OS, trong khi VM chạy một OS đầy đủ bên trong. Đó là lý do container nhẹ và nhanh hơn nhiều.

## Cài đặt Docker

### Trên Ubuntu/Debian

```bash
# Xóa phiên bản cũ nếu có
sudo apt remove docker docker-engine docker.io containerd runc

# Cài đặt dependencies
sudo apt update
sudo apt install ca-certificates curl gnupg

# Thêm Docker GPG key
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Thêm Docker repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Cài đặt Docker Engine
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

### Kiểm tra cài đặt

```bash
docker --version
# Docker version 24.0.7, build afdd53b

docker run hello-world
# Hello from Docker! ...
```

## Dockerfile — Định nghĩa Image

Dockerfile là file chứa các lệnh để build một Docker image. Hãy tạo một ứng dụng Node.js đơn giản:

```dockerfile
# Base image
FROM node:20-alpine

# Tạo thư mục làm việc
WORKDIR /app

# Copy package files trước (tận dụng layer cache)
COPY package*.json ./

# Cài đặt dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build ứng dụng
RUN npm run build

# Port expose
EXPOSE 3000

# Command chạy khi container start
CMD ["node", "dist/server.js"]
```

### Build và chạy image

```bash
# Build image với tag tên:phiên-bản
docker build -t my-app:1.0 .

# Chạy container
docker run -d \
  --name my-app \
  -p 3000:3000 \
  -e NODE_ENV=production \
  my-app:1.0

# Xem logs
docker logs -f my-app
```

## Docker Compose — Quản lý nhiều container

Khi ứng dụng cần nhiều service (web + database + cache), Docker Compose giúp bạn định nghĩa và chạy tất cả trong một file:

```yaml
# docker-compose.yml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=db
    depends_on:
      - db
      - redis

  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: secret
      MYSQL_DATABASE: myapp
    volumes:
      - db_data:/var/lib/mysql

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  db_data:
  redis_data:
```

```bash
# Khởi động tất cả services
docker compose up -d

# Xem trạng thái
docker compose ps

# Dừng tất cả
docker compose down
```

## Best Practices

Một số nguyên tắc khi viết Dockerfile để có image tốt hơn:

### 1. Dùng multi-stage build để giảm kích thước image

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production (chỉ copy kết quả build)
FROM node:20-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
CMD ["node", "dist/server.js"]
```

### 2. Tận dụng layer cache

Docker cache từng lệnh trong Dockerfile. Đặt những lệnh ít thay đổi (cài dependencies) trước những lệnh thay đổi thường xuyên (copy source code).

### 3. Không chạy container với user root

```dockerfile
# Tạo user riêng
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
```

## Kết luận

Docker là kỹ năng thiết yếu trong DevOps và development hiện đại. Khi đã nắm vững cơ bản, bạn có thể khám phá thêm Kubernetes để orchestrate container ở quy mô lớn hơn.

Bài viết tiếp theo tôi sẽ hướng dẫn thiết lập CI/CD pipeline với GitHub Actions và tự động deploy lên server qua Docker. Đừng bỏ lỡ nhé!
