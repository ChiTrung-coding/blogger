---
title: "Giám sát hệ thống với Prometheus và Grafana trên Docker"
slug: "cai-dat-monitoring-voi-prometheus-grafana"
date: "2024-05-18"
category: "IT Support"
tags: ["Prometheus", "Grafana", "Monitoring", "Docker", "DevOps"]
excerpt: "Hướng dẫn cài đặt và cấu hình hệ thống giám sát server với Prometheus, Grafana và Node Exporter."
thumbnail: "/images/IT2.jpg
published: true
---

Giám sát hệ thống (monitoring) là yếu tố không thể thiếu trong vận hành sản phẩm. Bạn cần biết server đang dùng bao nhiêu CPU, RAM, disk, có bao nhiêu request/giây và khi nào thì cần scale up.

Trong bài viết này, tôi sẽ hướng dẫn bạn thiết lập một stack monitoring hoàn chỉnh với **Prometheus + Grafana + Node Exporter** bằng Docker Compose — cùng setup mà tôi đang dùng ở môi trường production.

## Kiến trúc tổng quan

```
[Server bạn giám sát]              [Monitoring Server]
     Node Exporter (9100)  ←pull──  Prometheus (9090)
     App metrics (3000)              │
                                     ▼
                                  Grafana (3001)
                                  (Dashboard + Alert)
```

- **Node Exporter**: Thu thập metrics của OS (CPU, RAM, Disk, Network)
- **Prometheus**: "Scrape" (kéo) metrics từ các targets theo interval
- **Grafana**: Visualize dữ liệu từ Prometheus thành dashboard đẹp

## Cài đặt với Docker Compose

### Cấu trúc thư mục

```
monitoring/
├── docker-compose.yml
├── prometheus/
│   └── prometheus.yml
└── grafana/
    └── provisioning/
        └── datasources/
            └── prometheus.yml
```

### File `prometheus/prometheus.yml`

```yaml
global:
  scrape_interval: 15s      # Scrape mỗi 15 giây
  evaluation_interval: 15s  # Evaluate rules mỗi 15 giây

scrape_configs:
  # Prometheus tự giám sát chính nó
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  # Giám sát OS của monitoring server
  - job_name: 'node_exporter_local'
    static_configs:
      - targets: ['node-exporter:9100']

  # Giám sát OS của server khác
  - job_name: 'node_exporter_web'
    static_configs:
      - targets: ['192.168.1.100:9100']
        labels:
          instance: 'web-server-01'
          env: 'production'

  # Giám sát ứng dụng Node.js/Express
  - job_name: 'nodejs_app'
    static_configs:
      - targets: ['app:3000']
    metrics_path: '/metrics'
```

### File `docker-compose.yml`

```yaml
version: '3.8'

networks:
  monitoring:
    driver: bridge

volumes:
  prometheus_data:
  grafana_data:

services:
  prometheus:
    image: prom/prometheus:v2.47.0
    container_name: prometheus
    restart: unless-stopped
    volumes:
      - ./prometheus/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--storage.tsdb.retention.time=30d'
      - '--web.enable-lifecycle'
    ports:
      - "9090:9090"
    networks:
      - monitoring

  grafana:
    image: grafana/grafana:10.2.0
    container_name: grafana
    restart: unless-stopped
    environment:
      - GF_SECURITY_ADMIN_USER=admin
      - GF_SECURITY_ADMIN_PASSWORD=secretpassword
      - GF_USERS_ALLOW_SIGN_UP=false
    volumes:
      - grafana_data:/var/lib/grafana
      - ./grafana/provisioning:/etc/grafana/provisioning
    ports:
      - "3001:3000"
    networks:
      - monitoring
    depends_on:
      - prometheus

  node-exporter:
    image: prom/node-exporter:v1.7.0
    container_name: node-exporter
    restart: unless-stopped
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
    command:
      - '--path.procfs=/host/proc'
      - '--path.rootfs=/rootfs'
      - '--path.sysfs=/host/sys'
      - '--collector.filesystem.mount-points-exclude=^/(sys|proc|dev|host|etc)($$|/)'
    ports:
      - "9100:9100"
    networks:
      - monitoring
```

### Khởi động

```bash
docker compose up -d

# Kiểm tra
docker compose ps
# prometheus   running   0.0.0.0:9090->9090/tcp
# grafana      running   0.0.0.0:3001->3000/tcp
# node-exporter running  0.0.0.0:9100->9100/tcp
```

## Cấu hình Grafana

### Thêm Datasource Prometheus

Truy cập `http://localhost:3001`, đăng nhập với `admin/secretpassword`.

Vào **Configuration → Data Sources → Add data source → Prometheus**:
- URL: `http://prometheus:9090`
- Nhấn **Save & Test**

### Import Dashboard có sẵn

Grafana có kho dashboard cộng đồng tại grafana.com/dashboards. Tôi recommend:

- **Node Exporter Full** — ID: `1860` (giám sát OS rất đẹp)
- **Docker & System Monitoring** — ID: `893`

Vào **Dashboards → Import → nhập ID → Load**.

## PromQL Cơ bản

Prometheus Query Language (PromQL) dùng để query dữ liệu:

```promql
# CPU usage (%)
100 - (avg by(instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)

# Memory usage (%)
(1 - node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes) * 100

# Disk usage (%)
(1 - node_filesystem_avail_bytes{mountpoint="/"} / node_filesystem_size_bytes{mountpoint="/"}) * 100

# Network traffic (bytes/s)
rate(node_network_receive_bytes_total{device="eth0"}[5m])
```

## Thiết lập Alert

Grafana có thể gửi cảnh báo khi metrics vượt ngưỡng qua email, Slack, Telegram...

Ví dụ alert khi CPU > 80% trong 5 phút liên tục:

1. Vào Panel CPU → **Edit → Alert tab**
2. Condition: `avg() of query(A, 5m, now) IS ABOVE 80`
3. Notifications: chọn channel Slack/Email đã cấu hình

## Kết luận

Với setup Prometheus + Grafana + Node Exporter này, bạn đã có một hệ thống monitoring production-grade, miễn phí và self-hosted. Tiếp theo bạn có thể khám phá thêm:

- **Alertmanager**: Quản lý alert phức tạp hơn với routing, silencing
- **Loki**: Log aggregation (như ELK Stack nhưng nhẹ hơn)
- **Blackbox Exporter**: Monitor HTTP endpoint, ping

Chúc bạn thành công!
