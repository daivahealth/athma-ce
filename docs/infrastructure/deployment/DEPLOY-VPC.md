# Deploying Zeal On-Premises / VPC

## 1. Overview

This guide covers deploying the Zeal healthcare platform to on-premises servers or
Virtual Private Cloud (VPC) environments where you control the infrastructure directly.

### Use Cases

- **Air-gapped environments** -- Government hospitals, military medical facilities, or
  sites with no outbound internet connectivity.
- **Strict data sovereignty** -- UAE DHA/DOH/MOHAP regulations requiring PHI to remain
  within national borders on infrastructure you own.
- **Government facilities** -- Compliance frameworks that mandate on-premises hosting
  (e.g., FedRAMP-equivalent, local eGovernment policies).
- **Cost control** -- High patient volumes where predictable hardware costs beat
  per-request cloud pricing.

### Deployment Options

| Option | Best For | Complexity | HA Support |
|--------|----------|------------|------------|
| **A: Docker Compose** | Single-server, small-to-medium clinics, quickest path to production | Low | Limited (restart policies only) |
| **B: k3s** | Lightweight Kubernetes on 1-5 nodes, edge deployments, resource-constrained servers | Medium | Yes (embedded etcd, 3 server nodes) |
| **C: kubeadm** | Full Kubernetes clusters, large hospitals, existing K8s expertise on staff | High | Yes (stacked or external etcd) |

**When to use each:**

- Choose **Docker Compose** when you have a single server (or want the simplest
  possible deployment), fewer than 20 concurrent providers, and do not need
  automatic failover.
- Choose **k3s** when you need multi-node resilience but want minimal Kubernetes
  operational overhead. Ideal for clinics with 5-50 providers.
- Choose **kubeadm** when you already operate Kubernetes, need fine-grained control
  over the control plane, or are deploying across 5+ nodes in a hospital setting.

---

## 2. Prerequisites

### Hardware Requirements

| Tier | Providers | CPU | RAM | Storage | Network | Notes |
|------|-----------|-----|-----|---------|---------|-------|
| Small clinic | 1-5 | 4 cores | 16 GB | 100 GB NVMe/SSD | 1 Gbps | Single server |
| Medium practice | 5-20 | 8 cores | 32 GB | 250 GB NVMe/SSD | 1 Gbps | Single server or 2-node |
| Large hospital | 20+ | 16+ cores | 64+ GB | 500 GB+ NVMe/SSD | 10 Gbps | Multi-node cluster |

Storage notes:
- PostgreSQL data grows at roughly 1-2 GB per 10,000 encounters.
- Plan for 30 days of WAL retention for point-in-time recovery.
- Observability stack (Prometheus, Loki, Tempo) can consume 50-100 GB over 15 days of retention.
- All storage should be SSD or NVMe. Spinning disks are not recommended for database workloads.

### Software Requirements

| Component | Version | Purpose |
|-----------|---------|---------|
| Ubuntu 22.04 LTS or RHEL 9 | Latest patch | Host OS |
| Docker Engine | >= 24.0 | Container runtime |
| Docker Compose | v2 (plugin) | Container orchestration (Option A) |
| k3s | >= 1.29 | Lightweight Kubernetes (Option B) |
| kubeadm / kubelet / kubectl | >= 1.29 | Full Kubernetes (Option C) |
| Git | >= 2.30 | Clone repository |
| Node.js | 20 LTS | Building service images locally |
| OpenSSL | >= 3.0 | Certificate generation |

Install Docker on Ubuntu 22.04:

```bash
# Remove old versions
sudo apt-get remove -y docker docker-engine docker.io containerd runc

# Install prerequisites
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg lsb-release

# Add Docker GPG key and repository
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
  sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine + Compose plugin
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io \
  docker-buildx-plugin docker-compose-plugin

# Enable and start
sudo systemctl enable docker
sudo systemctl start docker

# Allow current user to run docker without sudo
sudo usermod -aG docker $USER
newgrp docker

# Verify
docker --version
docker compose version
```

---

## 3. Option A: Docker Compose Production Deployment

This section provides a complete, production-ready Docker Compose stack.

### 3.1 Production docker-compose.yml

Create `docker-compose.prod.yml` at the repository root:

```yaml
# docker-compose.prod.yml -- Zeal Healthcare Platform Production Stack
# Usage: docker compose -f docker-compose.prod.yml --env-file .env.prod up -d

version: "3.8"

x-backend-common: &backend-common
  restart: unless-stopped
  env_file: .env.prod
  networks:
    - zeal-network
  depends_on:
    postgres:
      condition: service_healthy
    redis:
      condition: service_healthy
  deploy:
    resources:
      limits:
        memory: 512M
        cpus: "0.50"
      reservations:
        memory: 256M
        cpus: "0.25"

services:
  # ===========================================================================
  # PostgreSQL -- pgvector/pgvector:pg16
  # ===========================================================================
  postgres:
    image: pgvector/pgvector:pg16
    container_name: zeal-postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: postgres
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    ports:
      - "127.0.0.1:5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init-scripts:/docker-entrypoint-initdb.d:ro
      - ./config/postgresql/postgresql.conf:/etc/postgresql/postgresql.conf:ro
      - ./config/postgresql/pg_hba.conf:/etc/postgresql/pg_hba.conf:ro
    command: >
      postgres
        -c config_file=/etc/postgresql/postgresql.conf
        -c hba_file=/etc/postgresql/pg_hba.conf
    networks:
      - zeal-network
    deploy:
      resources:
        limits:
          memory: 4G
          cpus: "2.0"
        reservations:
          memory: 2G
          cpus: "1.0"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s

  # ===========================================================================
  # Redis 7 -- caching and session store
  # ===========================================================================
  redis:
    image: redis:7-alpine
    container_name: zeal-redis
    restart: unless-stopped
    command: ["redis-server", "/usr/local/etc/redis/redis.conf"]
    ports:
      - "127.0.0.1:6379:6379"
    volumes:
      - redis_data:/data
      - ./config/redis/redis.conf:/usr/local/etc/redis/redis.conf:ro
    networks:
      - zeal-network
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: "0.50"
        reservations:
          memory: 256M
          cpus: "0.25"
    healthcheck:
      test: ["CMD", "redis-cli", "-a", "${REDIS_PASSWORD}", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 10s

  # ===========================================================================
  # Backend Services
  # ===========================================================================
  foundation:
    <<: *backend-common
    image: zeal/foundation:${IMAGE_TAG:-latest}
    container_name: zeal-foundation
    build:
      context: .
      dockerfile: backend/services/foundation/Dockerfile
    environment:
      SERVICE_NAME: foundation
      PORT: "3010"
      FOUNDATION_DATABASE_URL: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/zeal_foundation?schema=public
      REDIS_URL: redis://:${REDIS_PASSWORD}@redis:6379/0
      JWT_SECRET: ${JWT_SECRET}
      NODE_ENV: production
      OTEL_EXPORTER_OTLP_ENDPOINT: http://otel-collector:4318
    ports:
      - "127.0.0.1:3010:3010"
    healthcheck:
      test: ["CMD-SHELL", "wget -qO- http://localhost:3010/api/v1/health || exit 1"]
      interval: 15s
      timeout: 5s
      retries: 3
      start_period: 30s

  clinical:
    <<: *backend-common
    image: zeal/clinical:${IMAGE_TAG:-latest}
    container_name: zeal-clinical
    build:
      context: .
      dockerfile: backend/services/clinical/Dockerfile
    environment:
      SERVICE_NAME: clinical
      PORT: "3020"
      CLINICAL_DATABASE_URL: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/zeal_clinical?schema=public
      FOUNDATION_DATABASE_URL: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/zeal_foundation?schema=public
      REDIS_URL: redis://:${REDIS_PASSWORD}@redis:6379/1
      JWT_SECRET: ${JWT_SECRET}
      FOUNDATION_SERVICE_URL: http://foundation:3010
      NODE_ENV: production
      OTEL_EXPORTER_OTLP_ENDPOINT: http://otel-collector:4318
    ports:
      - "127.0.0.1:3020:3020"
    healthcheck:
      test: ["CMD-SHELL", "wget -qO- http://localhost:3020/api/v1/health || exit 1"]
      interval: 15s
      timeout: 5s
      retries: 3
      start_period: 30s

  rcm:
    <<: *backend-common
    image: zeal/rcm:${IMAGE_TAG:-latest}
    container_name: zeal-rcm
    build:
      context: .
      dockerfile: backend/services/rcm/Dockerfile
    environment:
      SERVICE_NAME: rcm
      PORT: "3030"
      RCM_DATABASE_URL: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/zeal_rcm?schema=public
      FOUNDATION_DATABASE_URL: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/zeal_foundation?schema=public
      REDIS_URL: redis://:${REDIS_PASSWORD}@redis:6379/2
      JWT_SECRET: ${JWT_SECRET}
      FOUNDATION_SERVICE_URL: http://foundation:3010
      NODE_ENV: production
      OTEL_EXPORTER_OTLP_ENDPOINT: http://otel-collector:4318
    ports:
      - "127.0.0.1:3030:3030"
    healthcheck:
      test: ["CMD-SHELL", "wget -qO- http://localhost:3030/api/v1/health || exit 1"]
      interval: 15s
      timeout: 5s
      retries: 3
      start_period: 30s

  analytics:
    <<: *backend-common
    image: zeal/analytics:${IMAGE_TAG:-latest}
    container_name: zeal-analytics
    build:
      context: .
      dockerfile: backend/services/analytics/Dockerfile
    environment:
      SERVICE_NAME: analytics
      PORT: "3040"
      ANALYTICS_DATABASE_URL: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/zeal_analytics?schema=public
      FOUNDATION_DATABASE_URL: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/zeal_foundation?schema=public
      REDIS_URL: redis://:${REDIS_PASSWORD}@redis:6379/3
      JWT_SECRET: ${JWT_SECRET}
      NODE_ENV: production
      OTEL_EXPORTER_OTLP_ENDPOINT: http://otel-collector:4318
    ports:
      - "127.0.0.1:3040:3040"
    healthcheck:
      test: ["CMD-SHELL", "wget -qO- http://localhost:3040/api/v1/health || exit 1"]
      interval: 15s
      timeout: 5s
      retries: 3
      start_period: 30s

  prm:
    <<: *backend-common
    image: zeal/prm:${IMAGE_TAG:-latest}
    container_name: zeal-prm
    build:
      context: .
      dockerfile: backend/services/prm/Dockerfile
    environment:
      SERVICE_NAME: prm
      PORT: "3013"
      FOUNDATION_DATABASE_URL: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/zeal_foundation?schema=public
      REDIS_URL: redis://:${REDIS_PASSWORD}@redis:6379/4
      JWT_SECRET: ${JWT_SECRET}
      NODE_ENV: production
      OTEL_EXPORTER_OTLP_ENDPOINT: http://otel-collector:4318
    ports:
      - "127.0.0.1:3013:3013"
    healthcheck:
      test: ["CMD-SHELL", "wget -qO- http://localhost:3013/api/v1/health || exit 1"]
      interval: 15s
      timeout: 5s
      retries: 3
      start_period: 30s

  ai-gateway:
    <<: *backend-common
    image: zeal/ai-gateway:${IMAGE_TAG:-latest}
    container_name: zeal-ai-gateway
    build:
      context: .
      dockerfile: backend/services/ai-gateway/Dockerfile
    environment:
      SERVICE_NAME: ai-gateway
      PORT: "3015"
      FOUNDATION_DATABASE_URL: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/zeal_foundation?schema=public
      CLINICAL_DATABASE_URL: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/zeal_clinical?schema=public
      REDIS_URL: redis://:${REDIS_PASSWORD}@redis:6379/5
      JWT_SECRET: ${JWT_SECRET}
      NODE_ENV: production
      OTEL_EXPORTER_OTLP_ENDPOINT: http://otel-collector:4318
    ports:
      - "127.0.0.1:3015:3015"
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: "1.0"
        reservations:
          memory: 512M
          cpus: "0.50"
    healthcheck:
      test: ["CMD-SHELL", "wget -qO- http://localhost:3015/api/v1/health || exit 1"]
      interval: 15s
      timeout: 5s
      retries: 3
      start_period: 30s

  # ===========================================================================
  # Frontend -- Next.js 14
  # ===========================================================================
  frontend:
    image: zeal/frontend:${IMAGE_TAG:-latest}
    container_name: zeal-frontend
    restart: unless-stopped
    build:
      context: ./frontend
      dockerfile: Dockerfile
    environment:
      NODE_ENV: production
      NEXT_PUBLIC_FOUNDATION_API_URL: http://foundation:3010/api/v1
      NEXT_PUBLIC_CLINICAL_API_URL: http://clinical:3020/api/v1
      NEXT_PUBLIC_RCM_API_URL: http://rcm:3030/api/v1
    ports:
      - "127.0.0.1:3000:3000"
    networks:
      - zeal-network
    depends_on:
      foundation:
        condition: service_healthy
      clinical:
        condition: service_healthy
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: "0.50"
        reservations:
          memory: 256M
          cpus: "0.25"
    healthcheck:
      test: ["CMD-SHELL", "wget -qO- http://localhost:3000/ || exit 1"]
      interval: 15s
      timeout: 5s
      retries: 3
      start_period: 30s

  # ===========================================================================
  # Nginx -- reverse proxy, SSL termination, routing
  # ===========================================================================
  nginx:
    image: nginx:1.25-alpine
    container_name: zeal-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./config/nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./config/nginx/conf.d:/etc/nginx/conf.d:ro
      - ./config/nginx/ssl:/etc/nginx/ssl:ro
      - nginx_logs:/var/log/nginx
    networks:
      - zeal-network
    depends_on:
      frontend:
        condition: service_healthy
      foundation:
        condition: service_healthy
      clinical:
        condition: service_healthy
      rcm:
        condition: service_healthy
    deploy:
      resources:
        limits:
          memory: 256M
          cpus: "0.25"
    healthcheck:
      test: ["CMD-SHELL", "wget -qO- http://localhost:80/health || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 3

# ===========================================================================
# Volumes
# ===========================================================================
volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local
  nginx_logs:
    driver: local

# ===========================================================================
# Networks
# ===========================================================================
networks:
  zeal-network:
    driver: bridge
    name: zeal-network
```

### 3.2 PostgreSQL Production Tuning

Create `config/postgresql/postgresql.conf`:

```ini
# config/postgresql/postgresql.conf
# Tuned for 32 GB RAM server. Scale proportionally for other sizes.

# ---- Connection Settings ----
listen_addresses = '*'
port = 5432
max_connections = 200
superuser_reserved_connections = 3

# ---- Memory ----
shared_buffers = 8GB                  # 25% of total RAM
effective_cache_size = 24GB           # 75% of total RAM
work_mem = 64MB                       # Per-operation sort/hash memory
maintenance_work_mem = 1GB            # VACUUM, CREATE INDEX
huge_pages = try

# ---- WAL ----
wal_level = replica                   # Enables PITR and replication
max_wal_senders = 5
max_wal_size = 4GB
min_wal_size = 1GB
wal_compression = on
archive_mode = on
archive_command = 'cp %p /var/lib/postgresql/wal_archive/%f'

# ---- Checkpoints ----
checkpoint_completion_target = 0.9
checkpoint_timeout = 15min

# ---- Query Planner ----
random_page_cost = 1.1                # SSD storage
effective_io_concurrency = 200        # SSD storage
default_statistics_target = 200

# ---- Parallel Query ----
max_worker_processes = 8
max_parallel_workers_per_gather = 4
max_parallel_workers = 8
max_parallel_maintenance_workers = 4

# ---- Logging ----
logging_collector = on
log_directory = 'log'
log_filename = 'postgresql-%Y-%m-%d.log'
log_rotation_age = 1d
log_rotation_size = 100MB
log_min_duration_statement = 500      # Log queries slower than 500ms
log_line_prefix = '%t [%p] %u@%d '
log_checkpoints = on
log_connections = on
log_disconnections = on
log_lock_waits = on
log_temp_files = 0

# ---- Autovacuum ----
autovacuum = on
autovacuum_max_workers = 4
autovacuum_naptime = 30s
autovacuum_vacuum_scale_factor = 0.05
autovacuum_analyze_scale_factor = 0.025

# ---- pgvector ----
# Allow sufficient work_mem for vector index builds
# maintenance_work_mem above covers CREATE INDEX for ivfflat/hnsw

# ---- Security ----
ssl = off                             # SSL handled by nginx; internal traffic only
password_encryption = scram-sha-256
```

Create `config/postgresql/pg_hba.conf`:

```
# config/postgresql/pg_hba.conf
# TYPE  DATABASE        USER            ADDRESS                 METHOD

# Local connections
local   all             all                                     scram-sha-256

# Docker network connections (172.16.0.0/12 covers Docker default ranges)
host    all             all             172.16.0.0/12           scram-sha-256

# Reject everything else
host    all             all             0.0.0.0/0               reject
```

Create the WAL archive directory on the host:

```bash
sudo mkdir -p /var/lib/zeal/wal_archive
sudo chown 999:999 /var/lib/zeal/wal_archive
```

Add the WAL archive volume to the postgres service in `docker-compose.prod.yml`:

```yaml
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init-scripts:/docker-entrypoint-initdb.d:ro
      - ./config/postgresql/postgresql.conf:/etc/postgresql/postgresql.conf:ro
      - ./config/postgresql/pg_hba.conf:/etc/postgresql/pg_hba.conf:ro
      - /var/lib/zeal/wal_archive:/var/lib/postgresql/wal_archive
```

### 3.3 Redis Production Configuration

Create `config/redis/redis.conf`:

```conf
# config/redis/redis.conf

# ---- Network ----
bind 0.0.0.0
port 6379
protected-mode yes
tcp-backlog 511
timeout 300
tcp-keepalive 60

# ---- Authentication ----
requirepass ${REDIS_PASSWORD}
# Note: replace ${REDIS_PASSWORD} with the actual password before deploying,
# or use a startup script to substitute it. Redis does not expand env vars.

# ---- Memory ----
maxmemory 1gb
maxmemory-policy allkeys-lru

# ---- Persistence (AOF) ----
appendonly yes
appendfsync everysec
appendfilename "appendonly.aof"
aof-use-rdb-preamble yes

# ---- RDB snapshots (secondary backup) ----
save 900 1
save 300 10
save 60 10000
dbfilename dump.rdb
dir /data

# ---- Logging ----
loglevel notice

# ---- Security ----
rename-command FLUSHDB ""
rename-command FLUSHALL ""
rename-command DEBUG ""
```

Because Redis does not expand environment variables in its config file, generate it at
deploy time:

```bash
# generate-redis-conf.sh
#!/usr/bin/env bash
set -euo pipefail
source .env.prod
sed "s/\${REDIS_PASSWORD}/${REDIS_PASSWORD}/" \
  config/redis/redis.conf.template > config/redis/redis.conf
chmod 600 config/redis/redis.conf
```

### 3.4 Building Service Images

Create `scripts/build-all.sh`:

```bash
#!/usr/bin/env bash
# scripts/build-all.sh -- Build all Zeal service images
set -euo pipefail

IMAGE_TAG="${1:-latest}"
REGISTRY="${DOCKER_REGISTRY:-}"   # Empty for local, or "registry.internal:5000/"

echo "==> Building Zeal images with tag: ${IMAGE_TAG}"

SERVICES=(
  "foundation:backend/services/foundation/Dockerfile:3010"
  "clinical:backend/services/clinical/Dockerfile:3020"
  "rcm:backend/services/rcm/Dockerfile:3030"
  "analytics:backend/services/analytics/Dockerfile:3040"
  "prm:backend/services/prm/Dockerfile:3013"
  "ai-gateway:backend/services/ai-gateway/Dockerfile:3015"
)

for entry in "${SERVICES[@]}"; do
  IFS=':' read -r name dockerfile port <<< "$entry"
  echo "--- Building ${REGISTRY}zeal/${name}:${IMAGE_TAG} ---"
  docker build \
    -t "${REGISTRY}zeal/${name}:${IMAGE_TAG}" \
    -f "${dockerfile}" \
    --build-arg PORT="${port}" \
    .
done

echo "--- Building ${REGISTRY}zeal/frontend:${IMAGE_TAG} ---"
docker build \
  -t "${REGISTRY}zeal/frontend:${IMAGE_TAG}" \
  ./frontend

echo "==> All images built."
docker images | grep "zeal/"
```

```bash
chmod +x scripts/build-all.sh
./scripts/build-all.sh v1.0.0
```

### 3.5 Nginx Reverse Proxy

Create `config/nginx/nginx.conf`:

```nginx
# config/nginx/nginx.conf

user  nginx;
worker_processes  auto;
worker_rlimit_nofile 65535;

error_log  /var/log/nginx/error.log warn;
pid        /var/run/nginx.pid;

events {
    worker_connections  4096;
    multi_accept on;
    use epoll;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    # ---------- Logging ----------
    log_format main '$remote_addr - $remote_user [$time_local] '
                    '"$request" $status $body_bytes_sent '
                    '"$http_referer" "$http_user_agent" '
                    'rt=$request_time uct=$upstream_connect_time '
                    'uht=$upstream_header_time urt=$upstream_response_time';

    access_log /var/log/nginx/access.log main;

    # ---------- Performance ----------
    sendfile           on;
    tcp_nopush         on;
    tcp_nodelay        on;
    keepalive_timeout  65;
    keepalive_requests 1000;
    types_hash_max_size 2048;
    client_max_body_size 50m;

    # ---------- Gzip ----------
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_min_length 256;
    gzip_types text/plain text/css application/json application/javascript
               text/xml application/xml application/xml+rss text/javascript
               image/svg+xml;

    # ---------- Rate Limiting ----------
    limit_req_zone $binary_remote_addr zone=api:10m rate=30r/s;
    limit_req_zone $binary_remote_addr zone=auth:10m rate=5r/s;
    limit_conn_zone $binary_remote_addr zone=addr:10m;

    # ---------- Security Headers (applied to all responses) ----------
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self';" always;

    # ---------- Upstream Definitions ----------
    upstream frontend {
        server frontend:3000;
        keepalive 32;
    }

    upstream foundation_api {
        server foundation:3010;
        keepalive 16;
    }

    upstream clinical_api {
        server clinical:3020;
        keepalive 16;
    }

    upstream rcm_api {
        server rcm:3030;
        keepalive 16;
    }

    upstream analytics_api {
        server analytics:3040;
        keepalive 16;
    }

    upstream prm_api {
        server prm:3013;
        keepalive 16;
    }

    upstream ai_gateway_api {
        server ai-gateway:3015;
        keepalive 16;
    }

    # ---------- HTTP -> HTTPS redirect ----------
    server {
        listen 80;
        server_name _;

        # Health check endpoint (used by load balancers / Docker health checks)
        location /health {
            access_log off;
            return 200 'OK';
            add_header Content-Type text/plain;
        }

        # ACME challenge for Let's Encrypt
        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }

        # Redirect all other traffic to HTTPS
        location / {
            return 301 https://$host$request_uri;
        }
    }

    # ---------- HTTPS server ----------
    server {
        listen 443 ssl http2;
        server_name _;

        # SSL certificates
        ssl_certificate     /etc/nginx/ssl/fullchain.pem;
        ssl_certificate_key /etc/nginx/ssl/privkey.pem;

        # SSL settings
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
        ssl_prefer_server_ciphers off;
        ssl_session_timeout 1d;
        ssl_session_cache shared:SSL:10m;
        ssl_session_tickets off;

        # OCSP stapling
        ssl_stapling on;
        ssl_stapling_verify on;

        # ---------- Foundation API ----------
        location /api/v1/foundation/ {
            limit_req zone=api burst=20 nodelay;
            limit_conn addr 50;

            proxy_pass http://foundation_api/api/v1/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_http_version 1.1;
            proxy_set_header Connection "";
            proxy_read_timeout 30s;
            proxy_send_timeout 30s;
        }

        # ---------- Clinical API ----------
        location /api/v1/clinical/ {
            limit_req zone=api burst=20 nodelay;
            limit_conn addr 50;

            proxy_pass http://clinical_api/api/v1/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_http_version 1.1;
            proxy_set_header Connection "";
            proxy_read_timeout 30s;
            proxy_send_timeout 30s;
        }

        # ---------- RCM API ----------
        location /api/v1/rcm/ {
            limit_req zone=api burst=20 nodelay;
            limit_conn addr 50;

            proxy_pass http://rcm_api/api/v1/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_http_version 1.1;
            proxy_set_header Connection "";
            proxy_read_timeout 30s;
            proxy_send_timeout 30s;
        }

        # ---------- Analytics API ----------
        location /api/v1/analytics/ {
            limit_req zone=api burst=20 nodelay;
            limit_conn addr 50;

            proxy_pass http://analytics_api/api/v1/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_http_version 1.1;
            proxy_set_header Connection "";
            proxy_read_timeout 30s;
            proxy_send_timeout 30s;
        }

        # ---------- PRM API ----------
        location /api/v1/prm/ {
            limit_req zone=api burst=20 nodelay;
            limit_conn addr 50;

            proxy_pass http://prm_api/api/v1/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_http_version 1.1;
            proxy_set_header Connection "";
            proxy_read_timeout 30s;
            proxy_send_timeout 30s;
        }

        # ---------- AI Gateway API ----------
        location /api/v1/ai/ {
            limit_req zone=api burst=10 nodelay;
            limit_conn addr 20;

            proxy_pass http://ai_gateway_api/api/v1/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_http_version 1.1;
            proxy_set_header Connection "";
            proxy_read_timeout 120s;
            proxy_send_timeout 120s;
        }

        # ---------- Auth endpoints (stricter rate limit) ----------
        location /api/v1/foundation/auth/ {
            limit_req zone=auth burst=5 nodelay;
            limit_conn addr 10;

            proxy_pass http://foundation_api/api/v1/auth/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_http_version 1.1;
            proxy_set_header Connection "";
        }

        # ---------- WebSocket support (real-time features) ----------
        location /ws/ {
            proxy_pass http://clinical_api;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_read_timeout 3600s;
            proxy_send_timeout 3600s;
        }

        # ---------- Frontend (catch-all) ----------
        location / {
            proxy_pass http://frontend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_http_version 1.1;
            proxy_set_header Connection "";
        }

        # ---------- Block sensitive paths ----------
        location ~ /\. {
            deny all;
            return 404;
        }
    }
}
```

### 3.6 SSL/TLS Configuration

**Option 1: Let's Encrypt (public-facing server)**

```bash
# Install certbot
sudo apt-get install -y certbot

# Generate certificate (stop nginx first, or use webroot)
sudo certbot certonly --standalone \
  -d zeal.yourdomain.com \
  --agree-tos \
  --email admin@yourdomain.com \
  --non-interactive

# Copy certs to nginx config directory
sudo cp /etc/letsencrypt/live/zeal.yourdomain.com/fullchain.pem config/nginx/ssl/
sudo cp /etc/letsencrypt/live/zeal.yourdomain.com/privkey.pem config/nginx/ssl/
sudo chmod 600 config/nginx/ssl/privkey.pem

# Auto-renewal cron (runs twice daily)
echo "0 0,12 * * * root certbot renew --quiet --deploy-hook 'docker compose -f docker-compose.prod.yml restart nginx'" \
  | sudo tee /etc/cron.d/certbot-renew
```

**Option 2: Self-signed certificates (air-gapped / internal)**

```bash
# Generate self-signed cert valid for 365 days
mkdir -p config/nginx/ssl

openssl req -x509 -nodes -days 365 \
  -newkey rsa:4096 \
  -keyout config/nginx/ssl/privkey.pem \
  -out config/nginx/ssl/fullchain.pem \
  -subj "/C=AE/ST=Dubai/L=Dubai/O=Zeal Healthcare/CN=zeal.local" \
  -addext "subjectAltName=DNS:zeal.local,DNS:*.zeal.local,IP:10.0.0.100"

chmod 600 config/nginx/ssl/privkey.pem
```

**Option 3: Enterprise CA certificate**

```bash
# Generate a CSR
openssl req -new -newkey rsa:4096 -nodes \
  -keyout config/nginx/ssl/privkey.pem \
  -out config/nginx/ssl/zeal.csr \
  -subj "/C=AE/ST=Dubai/L=Dubai/O=Zeal Healthcare/CN=zeal.yourdomain.com"

# Send zeal.csr to your CA. When you receive the signed cert:
cp signed-cert.pem config/nginx/ssl/fullchain.pem
chmod 600 config/nginx/ssl/privkey.pem
```

### 3.7 Environment Configuration

Create `.env.prod`:

```bash
# .env.prod -- Production environment variables
# IMPORTANT: chmod 600 .env.prod after creation

# ---- Image Tag ----
IMAGE_TAG=v1.0.0

# ---- PostgreSQL ----
POSTGRES_USER=zeal_user
POSTGRES_PASSWORD=CHANGE_ME_STRONG_PASSWORD_1
# Individual database URLs are constructed in docker-compose.prod.yml

# ---- Redis ----
REDIS_PASSWORD=CHANGE_ME_STRONG_PASSWORD_2

# ---- JWT ----
JWT_SECRET=CHANGE_ME_STRONG_SECRET_AT_LEAST_64_CHARS_LONG_abc123xyz
JWT_EXPIRES_IN=8h
JWT_REFRESH_EXPIRES_IN=7d

# ---- Service URLs (internal Docker network) ----
FOUNDATION_SERVICE_URL=http://foundation:3010
CLINICAL_SERVICE_URL=http://clinical:3020
RCM_SERVICE_URL=http://rcm:3030

# ---- Observability ----
OTEL_EXPORTER_OTLP_ENDPOINT=http://otel-collector:4318
LOG_LEVEL=info

# ---- Application ----
NODE_ENV=production
DEFAULT_LOCALE=en
SUPPORTED_LOCALES=en,ar
```

Secure the file:

```bash
chmod 600 .env.prod
```

### 3.8 Starting the Stack

```bash
# 1. Generate Redis config with actual password
./scripts/generate-redis-conf.sh

# 2. Build all images
./scripts/build-all.sh v1.0.0

# 3. Create required directories
mkdir -p config/nginx/ssl
mkdir -p /var/lib/zeal/wal_archive

# 4. Start the stack
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d

# 5. Watch startup progress
docker compose -f docker-compose.prod.yml logs -f --tail=50

# 6. Verify all services are healthy
docker compose -f docker-compose.prod.yml ps

# Expected output: all services show "healthy"
# NAME               STATUS                  PORTS
# zeal-postgres      Up (healthy)            127.0.0.1:5432->5432/tcp
# zeal-redis         Up (healthy)            127.0.0.1:6379->6379/tcp
# zeal-foundation    Up (healthy)            127.0.0.1:3010->3010/tcp
# zeal-clinical      Up (healthy)            127.0.0.1:3020->3020/tcp
# ...

# 7. Verify API endpoints respond
curl -s https://localhost/api/v1/foundation/health | jq .
curl -s https://localhost/api/v1/clinical/health | jq .

# 8. Verify frontend loads
curl -s -o /dev/null -w "%{http_code}" https://localhost/
# Expected: 200
```

---

## 4. Option B: Self-Hosted Kubernetes (k3s)

### 4.1 k3s Installation

**Single-server setup:**

```bash
# Install k3s with embedded etcd (allows future HA expansion)
curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="server \
  --cluster-init \
  --tls-san=zeal.yourdomain.com \
  --tls-san=10.0.0.100 \
  --write-kubeconfig-mode 644 \
  --disable=traefik \
  --kube-apiserver-arg=audit-log-path=/var/log/k3s-audit.log \
  --kube-apiserver-arg=audit-log-maxage=30" sh -

# Verify
sudo k3s kubectl get nodes
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml

# Install Traefik separately for more control (or use nginx-ingress)
kubectl apply -f https://raw.githubusercontent.com/traefik/traefik/v2.11/docs/content/reference/dynamic-configuration/kubernetes-crd-definition-v1.yml
```

**HA multi-server setup (3 server nodes):**

```bash
# Node 1 (first server, initializes the cluster)
curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="server \
  --cluster-init \
  --tls-san=zeal-lb.yourdomain.com \
  --write-kubeconfig-mode 644" sh -

# Get the node token
NODE_TOKEN=$(sudo cat /var/lib/rancher/k3s/server/node-token)

# Node 2 and Node 3 (join existing cluster)
curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="server \
  --server https://node1-ip:6443 \
  --token ${NODE_TOKEN} \
  --tls-san=zeal-lb.yourdomain.com \
  --write-kubeconfig-mode 644" sh -
```

**Adding agent (worker) nodes:**

```bash
# On each worker node
curl -sfL https://get.k3s.io | K3S_URL=https://node1-ip:6443 \
  K3S_TOKEN=${NODE_TOKEN} sh -
```

### 4.2 Local Container Registry

For air-gapped or internal environments, set up a local container registry:

```bash
# Option 1: Simple Docker Registry
docker run -d -p 5000:5000 \
  --restart=unless-stopped \
  --name registry \
  -v registry_data:/var/lib/registry \
  registry:2

# Tag and push images
docker tag zeal/foundation:v1.0.0 registry.internal:5000/zeal/foundation:v1.0.0
docker push registry.internal:5000/zeal/foundation:v1.0.0

# Option 2: Harbor (enterprise features -- RBAC, vulnerability scanning)
# See https://goharbor.io/docs/latest/install-config/
helm repo add harbor https://helm.goharbor.io
helm install harbor harbor/harbor \
  --set expose.type=nodePort \
  --set externalURL=https://harbor.internal \
  --set persistence.persistentVolumeClaim.registry.size=50Gi
```

Push all images with the build script:

```bash
DOCKER_REGISTRY="registry.internal:5000/" ./scripts/build-all.sh v1.0.0

# Push each image
for img in foundation clinical rcm analytics prm ai-gateway frontend; do
  docker push registry.internal:5000/zeal/${img}:v1.0.0
done
```

### 4.3 PostgreSQL on K8s

**Option 1: Bitnami Helm chart**

```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update

helm install zeal-postgres bitnami/postgresql \
  --set image.repository=pgvector/pgvector \
  --set image.tag=pg16 \
  --set auth.postgresPassword=CHANGE_ME \
  --set auth.username=zeal_user \
  --set auth.password=CHANGE_ME \
  --set primary.persistence.size=100Gi \
  --set primary.resources.requests.memory=2Gi \
  --set primary.resources.requests.cpu=1000m \
  --set primary.resources.limits.memory=4Gi \
  --set primary.resources.limits.cpu=2000m \
  --set primary.initdb.scriptsConfigMap=zeal-init-scripts \
  --namespace zeal --create-namespace
```

Create a ConfigMap from the init script:

```bash
kubectl create configmap zeal-init-scripts \
  --from-file=01-init-database.sql=init-scripts/01-init-database.sql \
  -n zeal
```

**Option 2: External PostgreSQL server**

If you run PostgreSQL on a dedicated server outside the cluster, create a Kubernetes
Service and Endpoints pointing to it:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: postgres-external
  namespace: zeal
spec:
  type: ExternalName
  externalName: db.internal.yourdomain.com
  ports:
    - port: 5432
```

### 4.4 Redis on K8s

```bash
helm install zeal-redis bitnami/redis \
  --set auth.password=CHANGE_ME \
  --set master.persistence.size=10Gi \
  --set master.resources.requests.memory=256Mi \
  --set master.resources.limits.memory=1Gi \
  --set replica.replicaCount=0 \
  --namespace zeal
```

### 4.5 Deploying Zeal Services

Create a namespace and secrets:

```bash
kubectl create namespace zeal

# Create secrets
kubectl create secret generic zeal-db-secrets -n zeal \
  --from-literal=POSTGRES_USER=zeal_user \
  --from-literal=POSTGRES_PASSWORD=CHANGE_ME \
  --from-literal=REDIS_PASSWORD=CHANGE_ME \
  --from-literal=JWT_SECRET=CHANGE_ME_64_CHARS

# Create ConfigMap for shared environment
kubectl create configmap zeal-config -n zeal \
  --from-literal=NODE_ENV=production \
  --from-literal=LOG_LEVEL=info \
  --from-literal=DEFAULT_LOCALE=en
```

Example Deployment and Service for the Foundation service (repeat pattern for all
services):

```yaml
# k8s/foundation-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: foundation
  namespace: zeal
  labels:
    app: foundation
    domain: foundation
spec:
  replicas: 2
  selector:
    matchLabels:
      app: foundation
  template:
    metadata:
      labels:
        app: foundation
    spec:
      containers:
        - name: foundation
          image: registry.internal:5000/zeal/foundation:v1.0.0
          ports:
            - containerPort: 3010
          env:
            - name: SERVICE_NAME
              value: foundation
            - name: PORT
              value: "3010"
            - name: POSTGRES_USER
              valueFrom:
                secretKeyRef:
                  name: zeal-db-secrets
                  key: POSTGRES_USER
            - name: POSTGRES_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: zeal-db-secrets
                  key: POSTGRES_PASSWORD
            - name: FOUNDATION_DATABASE_URL
              value: "postgresql://$(POSTGRES_USER):$(POSTGRES_PASSWORD)@zeal-postgres-postgresql:5432/zeal_foundation?schema=public"
            - name: REDIS_URL
              value: "redis://:$(REDIS_PASSWORD)@zeal-redis-master:6379/0"
            - name: REDIS_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: zeal-db-secrets
                  key: REDIS_PASSWORD
            - name: JWT_SECRET
              valueFrom:
                secretKeyRef:
                  name: zeal-db-secrets
                  key: JWT_SECRET
            - name: NODE_ENV
              valueFrom:
                configMapKeyRef:
                  name: zeal-config
                  key: NODE_ENV
          resources:
            requests:
              memory: 256Mi
              cpu: 250m
            limits:
              memory: 512Mi
              cpu: 500m
          readinessProbe:
            httpGet:
              path: /api/v1/health
              port: 3010
            initialDelaySeconds: 15
            periodSeconds: 10
          livenessProbe:
            httpGet:
              path: /api/v1/health
              port: 3010
            initialDelaySeconds: 30
            periodSeconds: 15
---
apiVersion: v1
kind: Service
metadata:
  name: foundation
  namespace: zeal
spec:
  selector:
    app: foundation
  ports:
    - port: 3010
      targetPort: 3010
  type: ClusterIP
```

**Traefik IngressRoute (k3s default ingress):**

```yaml
# k8s/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: zeal-ingress
  namespace: zeal
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /api/v1/$2
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/rate-limit: "30"
spec:
  tls:
    - hosts:
        - zeal.yourdomain.com
      secretName: zeal-tls
  rules:
    - host: zeal.yourdomain.com
      http:
        paths:
          - path: /api/v1/foundation(/|$)(.*)
            pathType: ImplementationSpecific
            backend:
              service:
                name: foundation
                port:
                  number: 3010
          - path: /api/v1/clinical(/|$)(.*)
            pathType: ImplementationSpecific
            backend:
              service:
                name: clinical
                port:
                  number: 3020
          - path: /api/v1/rcm(/|$)(.*)
            pathType: ImplementationSpecific
            backend:
              service:
                name: rcm
                port:
                  number: 3030
          - path: /
            pathType: Prefix
            backend:
              service:
                name: frontend
                port:
                  number: 3000
```

### 4.6 Storage

**Local Path Provisioner (default in k3s):**

k3s ships with Local Path Provisioner. Volumes are stored in `/opt/local-path-provisioner`
on the node where the pod is scheduled. Suitable for single-node deployments.

**Longhorn (distributed storage for multi-node):**

```bash
# Install Longhorn
kubectl apply -f https://raw.githubusercontent.com/longhorn/longhorn/v1.6.0/deploy/longhorn.yaml

# Wait for pods
kubectl -n longhorn-system get pods -w

# Set as default StorageClass
kubectl patch storageclass local-path -p '{"metadata":{"annotations":{"storageclass.kubernetes.io/is-default-class":"false"}}}'
kubectl patch storageclass longhorn -p '{"metadata":{"annotations":{"storageclass.kubernetes.io/is-default-class":"true"}}}'
```

### 4.7 Load Balancing

**MetalLB for bare-metal load balancing:**

```bash
kubectl apply -f https://raw.githubusercontent.com/metallb/metallb/v0.14.3/config/manifests/metallb-native.yaml

# Wait for controller
kubectl -n metallb-system wait pod --all --for=condition=Ready --timeout=120s
```

```yaml
# k8s/metallb-config.yaml
apiVersion: metallb.io/v1beta1
kind: IPAddressPool
metadata:
  name: zeal-pool
  namespace: metallb-system
spec:
  addresses:
    - 10.0.0.200-10.0.0.210    # Adjust to your network range
---
apiVersion: metallb.io/v1beta1
kind: L2Advertisement
metadata:
  name: zeal-l2
  namespace: metallb-system
spec:
  ipAddressPools:
    - zeal-pool
```

```bash
kubectl apply -f k8s/metallb-config.yaml
```

---

## 5. Option C: Self-Hosted Kubernetes (kubeadm)

### Control Plane Initialization

```bash
# On the control plane node
sudo kubeadm init \
  --pod-network-cidr=10.244.0.0/16 \
  --apiserver-cert-extra-sans=zeal-lb.yourdomain.com \
  --control-plane-endpoint=zeal-lb.yourdomain.com:6443

# Set up kubeconfig
mkdir -p $HOME/.kube
sudo cp /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

### Worker Node Join

```bash
# Use the join command printed by kubeadm init
sudo kubeadm join zeal-lb.yourdomain.com:6443 \
  --token <token> \
  --discovery-token-ca-cert-hash sha256:<hash>
```

### CNI: Calico

```bash
kubectl apply -f https://raw.githubusercontent.com/projectcalico/calico/v3.27.0/manifests/calico.yaml

# Verify nodes become Ready
kubectl get nodes -w
```

Alternatively, use Flannel:

```bash
kubectl apply -f https://github.com/flannel-io/flannel/releases/latest/download/kube-flannel.yml
```

### nginx-ingress Controller

```bash
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm install ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx --create-namespace \
  --set controller.service.type=NodePort \
  --set controller.service.nodePorts.http=30080 \
  --set controller.service.nodePorts.https=30443
```

Application deployment follows the same manifests as Section 4.5, substituting the
Ingress annotations for `nginx.ingress.kubernetes.io` (which are already shown there).

---

## 6. Networking

### Firewall Rules

```bash
# ---- External (public-facing) ----
sudo ufw allow 80/tcp    # HTTP (redirect to HTTPS)
sudo ufw allow 443/tcp   # HTTPS

# ---- Internal (cluster/management) ----
sudo ufw allow from 10.0.0.0/24 to any port 5432 proto tcp   # PostgreSQL
sudo ufw allow from 10.0.0.0/24 to any port 6379 proto tcp   # Redis
sudo ufw allow from 10.0.0.0/24 to any port 3010:3040 proto tcp  # Backend services
sudo ufw allow from 10.0.0.0/24 to any port 6443 proto tcp   # K8s API (if K8s)
sudo ufw allow from 10.0.0.0/24 to any port 9090 proto tcp   # Prometheus
sudo ufw allow from 10.0.0.0/24 to any port 3003 proto tcp   # Grafana
sudo ufw allow from 10.0.0.0/24 to any port 22 proto tcp     # SSH

# ---- Enable firewall ----
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw enable
sudo ufw status verbose
```

### DNS Configuration

**Internal DNS (with a DNS server like dnsmasq or CoreDNS):**

```
# /etc/dnsmasq.d/zeal.conf
address=/zeal.local/10.0.0.100
address=/grafana.zeal.local/10.0.0.100
```

**Air-gapped (no DNS server) -- use /etc/hosts:**

```bash
# On every client machine that needs to reach Zeal
echo "10.0.0.100  zeal.local grafana.zeal.local" | sudo tee -a /etc/hosts
```

### VPN for Remote Management (WireGuard)

```bash
# Install WireGuard on the server
sudo apt-get install -y wireguard

# Generate keys
wg genkey | tee /etc/wireguard/server_private.key | wg pubkey > /etc/wireguard/server_public.key
chmod 600 /etc/wireguard/server_private.key
```

```ini
# /etc/wireguard/wg0.conf
[Interface]
Address = 10.200.0.1/24
ListenPort = 51820
PrivateKey = <server-private-key>
PostUp = iptables -A FORWARD -i wg0 -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i wg0 -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE

[Peer]
# Admin laptop
PublicKey = <client-public-key>
AllowedIPs = 10.200.0.2/32
```

```bash
sudo systemctl enable wg-quick@wg0
sudo systemctl start wg-quick@wg0
sudo ufw allow 51820/udp
```

---

## 7. Observability

### Deploy from Existing Configuration

The observability stack is defined in
`infrastructure/observability/docker-compose.observability.yml`. Connect it to the main
application network:

```bash
# Start the observability stack alongside the main stack
docker compose \
  -f docker-compose.prod.yml \
  -f infrastructure/observability/docker-compose.observability.yml \
  --env-file .env.prod \
  up -d
```

To allow the observability stack to reach application containers, add the `zeal-network`
to the observability services. Create an override file:

```yaml
# docker-compose.observability.override.yml
version: "3.8"

services:
  otel-collector:
    networks:
      - zeal-network
      - zeal-observability

  promtail:
    networks:
      - zeal-network
      - zeal-observability

networks:
  zeal-network:
    external: true
  zeal-observability:
    driver: bridge
```

```bash
docker compose \
  -f docker-compose.prod.yml \
  -f infrastructure/observability/docker-compose.observability.yml \
  -f docker-compose.observability.override.yml \
  --env-file .env.prod \
  up -d
```

### Access Grafana

Grafana is exposed on port 3003 by default (mapped from internal 3000). Access it at:

```
https://zeal.local:3003   (or via nginx proxy if configured)
```

Default credentials: `admin` / `admin` (change immediately on first login).

### Log Rotation and Retention

The observability compose file sets Prometheus retention to 15 days. For Loki, configure
retention in `infrastructure/observability/loki-config.yaml`:

```yaml
limits_config:
  retention_period: 30d

compactor:
  retention_enabled: true
```

For Docker container logs:

```bash
# /etc/docker/daemon.json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "50m",
    "max-file": "5"
  }
}

# Restart Docker after editing
sudo systemctl restart docker
```

---

## 8. Secrets Management

### Simple: .env Files with Restricted Permissions

For small deployments, `.env.prod` with strict file permissions is acceptable:

```bash
chmod 600 .env.prod
chown root:root .env.prod
```

Generate strong passwords:

```bash
# Generate a 32-character random password
openssl rand -base64 32

# Generate all passwords at once
cat > .env.prod.passwords <<EOF
POSTGRES_PASSWORD=$(openssl rand -base64 32)
REDIS_PASSWORD=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 64)
EOF
chmod 600 .env.prod.passwords
```

### HashiCorp Vault (Self-Hosted)

```bash
# Run Vault in Docker
docker run -d --name vault \
  --cap-add=IPC_LOCK \
  -p 8200:8200 \
  -v vault_data:/vault/data \
  -e VAULT_ADDR=http://0.0.0.0:8200 \
  hashicorp/vault:1.15 server

# Initialize and unseal
export VAULT_ADDR=http://127.0.0.1:8200
vault operator init -key-shares=5 -key-threshold=3
vault operator unseal  # repeat with 3 different keys

# Store secrets
vault kv put secret/zeal/production \
  postgres_password=CHANGE_ME \
  redis_password=CHANGE_ME \
  jwt_secret=CHANGE_ME

# Retrieve secrets in a deploy script
POSTGRES_PASSWORD=$(vault kv get -field=postgres_password secret/zeal/production)
```

### Kubernetes Sealed Secrets

For Kubernetes deployments, use Sealed Secrets so encrypted secrets can be stored in Git:

```bash
# Install controller
kubectl apply -f https://github.com/bitnami-labs/sealed-secrets/releases/download/v0.25.0/controller.yaml

# Install kubeseal CLI
brew install kubeseal  # or download binary

# Encrypt a secret
kubectl create secret generic zeal-db-secrets -n zeal \
  --from-literal=POSTGRES_PASSWORD=CHANGE_ME \
  --dry-run=client -o yaml | \
  kubeseal --format yaml > k8s/sealed-secrets.yaml

kubectl apply -f k8s/sealed-secrets.yaml
```

---

## 9. Backup and Restore

### Database Backup

Create `scripts/backup-databases.sh`:

```bash
#!/usr/bin/env bash
# scripts/backup-databases.sh -- Backup all 4 Zeal domain databases
set -euo pipefail

BACKUP_DIR="/var/lib/zeal/backups/$(date +%Y-%m-%d_%H%M%S)"
RETENTION_DAYS=30
CONTAINER="zeal-postgres"

mkdir -p "${BACKUP_DIR}"

DATABASES=("zeal_foundation" "zeal_clinical" "zeal_rcm" "zeal_analytics")

for db in "${DATABASES[@]}"; do
  echo "==> Backing up ${db}..."
  docker exec "${CONTAINER}" pg_dump \
    -U zeal_user \
    -d "${db}" \
    --format=custom \
    --compress=9 \
    --verbose \
    > "${BACKUP_DIR}/${db}.dump" 2>> "${BACKUP_DIR}/backup.log"
  echo "    Size: $(du -h "${BACKUP_DIR}/${db}.dump" | cut -f1)"
done

# Global roles and tablespaces
docker exec "${CONTAINER}" pg_dumpall -U zeal_user --globals-only \
  > "${BACKUP_DIR}/globals.sql" 2>> "${BACKUP_DIR}/backup.log"

# Checksum for integrity
cd "${BACKUP_DIR}"
sha256sum *.dump globals.sql > checksums.sha256

echo "==> Backup complete: ${BACKUP_DIR}"
echo "==> Cleaning backups older than ${RETENTION_DAYS} days..."
find /var/lib/zeal/backups -maxdepth 1 -type d -mtime +${RETENTION_DAYS} -exec rm -rf {} +

echo "==> Done."
```

Schedule with cron:

```bash
chmod +x scripts/backup-databases.sh

# Daily at 2:00 AM
echo "0 2 * * * root /opt/zeal/scripts/backup-databases.sh >> /var/log/zeal-backup.log 2>&1" \
  | sudo tee /etc/cron.d/zeal-backup
```

**WAL archiving for point-in-time recovery (PITR):**

WAL archiving is configured in `postgresql.conf` (Section 3.2). The archive command
copies WAL files to `/var/lib/zeal/wal_archive`. For PITR, you need a base backup plus
WAL files:

```bash
# Take a base backup
docker exec zeal-postgres pg_basebackup \
  -U zeal_user -D /tmp/basebackup -Ft -z -P

docker cp zeal-postgres:/tmp/basebackup /var/lib/zeal/backups/basebackup-$(date +%Y%m%d)
```

### Redis Backup

```bash
#!/usr/bin/env bash
# scripts/backup-redis.sh
set -euo pipefail

BACKUP_DIR="/var/lib/zeal/backups/redis/$(date +%Y-%m-%d)"
mkdir -p "${BACKUP_DIR}"

# Trigger RDB snapshot
docker exec zeal-redis redis-cli -a "${REDIS_PASSWORD}" BGSAVE
sleep 5

# Copy RDB file
docker cp zeal-redis:/data/dump.rdb "${BACKUP_DIR}/dump.rdb"

# Copy AOF file
docker cp zeal-redis:/data/appendonly.aof "${BACKUP_DIR}/appendonly.aof"

echo "==> Redis backup complete: ${BACKUP_DIR}"
```

### Volume Backup

```bash
#!/usr/bin/env bash
# scripts/backup-volumes.sh
set -euo pipefail

BACKUP_DIR="/var/lib/zeal/backups/volumes/$(date +%Y-%m-%d)"
mkdir -p "${BACKUP_DIR}"

# Backup Docker volumes using a temporary container
for volume in postgres_data redis_data; do
  echo "==> Backing up volume: ${volume}"
  docker run --rm \
    -v "${volume}:/source:ro" \
    -v "${BACKUP_DIR}:/backup" \
    alpine tar czf "/backup/${volume}.tar.gz" -C /source .
done

echo "==> Volume backups complete: ${BACKUP_DIR}"
```

Replicate to offsite storage:

```bash
# rsync to offsite server (run after backup)
rsync -avz --delete \
  /var/lib/zeal/backups/ \
  backup-user@offsite-server:/backups/zeal/
```

### Restore Procedures

**Restore a single database from dump:**

```bash
# 1. Stop the application services (keep postgres running)
docker compose -f docker-compose.prod.yml stop foundation clinical rcm analytics prm ai-gateway frontend

# 2. Drop and recreate the target database
docker exec -it zeal-postgres psql -U zeal_user -d postgres -c "DROP DATABASE IF EXISTS zeal_clinical;"
docker exec -it zeal-postgres psql -U zeal_user -d postgres -c "CREATE DATABASE zeal_clinical OWNER zeal_user;"

# 3. Restore from dump
docker exec -i zeal-postgres pg_restore \
  -U zeal_user \
  -d zeal_clinical \
  --verbose \
  --no-owner \
  < /var/lib/zeal/backups/2026-03-20_020000/zeal_clinical.dump

# 4. Verify integrity
docker exec zeal-postgres psql -U zeal_user -d zeal_clinical \
  -c "SELECT count(*) FROM patients;"

# 5. Restart services
docker compose -f docker-compose.prod.yml up -d
```

**Full restore from base backup + WAL (PITR):**

```bash
# 1. Stop PostgreSQL
docker compose -f docker-compose.prod.yml stop postgres

# 2. Remove existing data
docker volume rm zeal_postgres_data

# 3. Create new volume and restore base backup
docker volume create zeal_postgres_data
docker run --rm \
  -v zeal_postgres_data:/var/lib/postgresql/data \
  -v /var/lib/zeal/backups/basebackup-20260320:/backup:ro \
  alpine sh -c "cd /var/lib/postgresql/data && tar xzf /backup/base.tar.gz"

# 4. Create recovery.signal and configure recovery target
# (Edit postgresql.conf or create recovery.conf as appropriate for your PG version)
docker run --rm \
  -v zeal_postgres_data:/var/lib/postgresql/data \
  alpine sh -c "
    touch /var/lib/postgresql/data/recovery.signal
    echo \"restore_command = 'cp /var/lib/postgresql/wal_archive/%f %p'\" >> /var/lib/postgresql/data/postgresql.auto.conf
    echo \"recovery_target_time = '2026-03-20 14:30:00 UTC'\" >> /var/lib/postgresql/data/postgresql.auto.conf
  "

# 5. Start PostgreSQL (it will replay WAL up to target time)
docker compose -f docker-compose.prod.yml up -d postgres

# 6. Monitor recovery
docker logs -f zeal-postgres
```

---

## 10. CI/CD

### GitHub Actions with Self-Hosted Runners

For air-gapped environments, use a self-hosted GitHub Actions runner on the deployment
server (or a build server with network access to the deployment target).

```bash
# On the build/deploy server
mkdir actions-runner && cd actions-runner
curl -o actions-runner-linux-x64.tar.gz -L \
  https://github.com/actions/runner/releases/download/v2.311.0/actions-runner-linux-x64-2.311.0-linux-x64.tar.gz
tar xzf actions-runner-linux-x64.tar.gz
./config.sh --url https://github.com/your-org/zeal --token <RUNNER_TOKEN>
sudo ./svc.sh install
sudo ./svc.sh start
```

Example workflow:

```yaml
# .github/workflows/deploy-vpc.yml
name: Deploy to VPC
on:
  push:
    tags: ['v*']

jobs:
  build-and-deploy:
    runs-on: self-hosted
    steps:
      - uses: actions/checkout@v4

      - name: Build images
        run: ./scripts/build-all.sh ${{ github.ref_name }}

      - name: Deploy
        run: |
          export IMAGE_TAG=${{ github.ref_name }}
          docker compose -f docker-compose.prod.yml --env-file .env.prod up -d

      - name: Verify health
        run: |
          sleep 30
          for svc in foundation clinical rcm analytics prm ai-gateway; do
            curl -sf http://localhost:3010/api/v1/health || exit 1
          done
```

### Manual Deployment Script

Create `scripts/deploy.sh`:

```bash
#!/usr/bin/env bash
# scripts/deploy.sh -- Deploy or update Zeal on-premises
set -euo pipefail

TAG="${1:?Usage: deploy.sh <image-tag>}"
COMPOSE_FILE="docker-compose.prod.yml"
ENV_FILE=".env.prod"

echo "==> Deploying Zeal ${TAG}"

# Update IMAGE_TAG in .env.prod
sed -i "s/^IMAGE_TAG=.*/IMAGE_TAG=${TAG}/" "${ENV_FILE}"

# Pull or build images
echo "==> Building images..."
./scripts/build-all.sh "${TAG}"

# Rolling restart (one service at a time to minimize downtime)
SERVICES=(foundation clinical rcm analytics prm ai-gateway frontend nginx)
for svc in "${SERVICES[@]}"; do
  echo "==> Restarting ${svc}..."
  docker compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" up -d --no-deps "${svc}"
  sleep 10
  docker compose -f "${COMPOSE_FILE}" ps "${svc}" | grep -q "healthy" || {
    echo "ERROR: ${svc} did not become healthy. Rolling back."
    exit 1
  }
done

echo "==> Deployment complete."
docker compose -f "${COMPOSE_FILE}" ps
```

### Blue-Green with Docker Compose Profiles

Use Compose profiles to run two versions side-by-side and switch traffic via nginx:

```bash
# Deploy new version on "green" profile (different ports)
IMAGE_TAG=v1.1.0 docker compose -f docker-compose.prod.yml --profile green up -d

# Test green deployment
curl -s http://localhost:3110/api/v1/health   # green foundation on 3110

# Switch nginx upstream to green
# (swap upstream server addresses in nginx.conf, then reload)
docker exec zeal-nginx nginx -s reload

# Tear down old "blue" version
docker compose -f docker-compose.prod.yml --profile blue down
```

---

## 11. Healthcare Compliance

### Full-Disk Encryption (LUKS)

All servers storing PHI must use full-disk encryption:

```bash
# During OS installation, select full-disk encryption with LUKS.
# For an existing system, encrypt data partitions:

# Install LUKS tools
sudo apt-get install -y cryptsetup

# Encrypt a data partition (DESTROYS existing data)
sudo cryptsetup luksFormat /dev/sdb1
sudo cryptsetup open /dev/sdb1 zeal-data
sudo mkfs.ext4 /dev/mapper/zeal-data
sudo mount /dev/mapper/zeal-data /var/lib/zeal

# Auto-mount on boot (requires keyfile or passphrase at boot)
echo "zeal-data /dev/sdb1 /root/keyfile luks" | sudo tee -a /etc/crypttab
```

### Network Segmentation (VLANs)

Separate clinical (PHI) traffic from management and public traffic:

| VLAN | Name | Subnet | Purpose |
|------|------|--------|---------|
| 10 | Management | 10.0.10.0/24 | SSH, monitoring, Grafana |
| 20 | Application | 10.0.20.0/24 | Nginx, frontend, backend services |
| 30 | Database | 10.0.30.0/24 | PostgreSQL, Redis (no external access) |
| 40 | Public | 10.0.40.0/24 | External-facing nginx only |

Configure on a managed switch and assign server NICs to appropriate VLANs. Use firewall
rules (Section 6) to restrict cross-VLAN traffic.

### Physical Security

- Servers must be in a locked room with badge or biometric access.
- Maintain an access log for the server room.
- Use tamper-evident seals on server chassis.
- Disable USB boot in BIOS; set a BIOS password.
- Use IPMI/iDRAC/iLO for remote management on a separate management VLAN.

### Audit Logging

The `zeal_analytics` database includes an append-only `audit.audit_log` table (created
by `init-scripts/01-init-database.sql`). Ensure:

- The `zeal_user` database role has INSERT-only access to the audit schema in production:

```sql
REVOKE DELETE, UPDATE ON audit.audit_log FROM zeal_user;
```

- Ship audit logs to the observability stack via Promtail for secondary retention.
- Retain audit logs for a minimum of 7 years (UAE healthcare regulation).

### Firewall Hardening

Beyond the rules in Section 6, apply:

```bash
# Limit SSH to key-based auth only
sudo sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo systemctl restart sshd

# Install fail2ban
sudo apt-get install -y fail2ban
sudo systemctl enable fail2ban

# Block ICMP from external (optional)
sudo ufw deny proto icmp from any to any
```

---

## 12. Scaling

### Docker Compose: Vertical Scaling

Docker Compose does not natively support multi-host clustering. Scale vertically by
increasing server resources, and use `deploy.resources` to allocate more to busy services:

```yaml
# Give clinical service more resources (handles most traffic)
clinical:
  deploy:
    resources:
      limits:
        memory: 1G
        cpus: "1.0"
```

Limited horizontal scaling is possible with replicas (requires a load balancer in front):

```bash
docker compose -f docker-compose.prod.yml up -d --scale clinical=3
```

### Kubernetes: Horizontal Pod Autoscaling

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: clinical-hpa
  namespace: zeal
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: clinical
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80
```

Add worker nodes to increase cluster capacity:

```bash
# k3s
curl -sfL https://get.k3s.io | K3S_URL=https://server-ip:6443 K3S_TOKEN=${TOKEN} sh -

# kubeadm
kubeadm join control-plane:6443 --token <token> --discovery-token-ca-cert-hash sha256:<hash>
```

### PostgreSQL: Connection Pooling with PgBouncer

```bash
# Add PgBouncer to docker-compose.prod.yml
pgbouncer:
  image: edoburu/pgbouncer:1.22.0
  container_name: zeal-pgbouncer
  restart: unless-stopped
  environment:
    DATABASE_URL: postgresql://zeal_user:${POSTGRES_PASSWORD}@postgres:5432/postgres
    POOL_MODE: transaction
    MAX_CLIENT_CONN: 500
    DEFAULT_POOL_SIZE: 40
    MIN_POOL_SIZE: 10
    RESERVE_POOL_SIZE: 10
  ports:
    - "127.0.0.1:6432:6432"
  networks:
    - zeal-network
  depends_on:
    postgres:
      condition: service_healthy
```

Update service DATABASE_URL entries to point to `pgbouncer:6432` instead of `postgres:5432`.

### Redis: Sentinel for HA

For production HA, deploy Redis Sentinel:

```bash
# In Kubernetes, use the Bitnami Helm chart with sentinel enabled
helm upgrade zeal-redis bitnami/redis \
  --set sentinel.enabled=true \
  --set sentinel.masterSet=zealmaster \
  --set replica.replicaCount=2 \
  -n zeal
```

---

## 13. Disaster Recovery

### RTO/RPO Targets

| Tier | RPO (Data Loss) | RTO (Downtime) | Strategy |
|------|-----------------|----------------|----------|
| Small clinic | 24 hours | 4 hours | Daily pg_dump, manual restore |
| Medium practice | 1 hour | 1 hour | WAL archiving + PITR, warm standby |
| Large hospital | 15 minutes | 15 minutes | Streaming replication, automated failover |

### Offsite Backup Replication

```bash
# Sync backups to offsite every 6 hours
# Add to cron
0 */6 * * * rsync -avz --delete /var/lib/zeal/backups/ backup@offsite:/backups/zeal/
```

### Standby Server Configuration

For medium-to-large deployments, maintain a warm standby:

```bash
# On standby server: configure PostgreSQL streaming replication
# In postgresql.conf on primary:
#   wal_level = replica (already set in Section 3.2)
#   max_wal_senders = 5 (already set)

# On standby: create base backup from primary
pg_basebackup -h primary-ip -U replication_user -D /var/lib/postgresql/data -Fp -Xs -P

# Configure standby.signal
touch /var/lib/postgresql/data/standby.signal

# In postgresql.auto.conf on standby
primary_conninfo = 'host=primary-ip port=5432 user=replication_user password=CHANGE_ME'
```

### Documented Recovery Procedures

1. **Database corruption:** Restore from latest pg_dump (Section 9).
2. **Complete server failure:** Provision new server, restore from offsite backups, deploy stack.
3. **Network partition (K8s):** Ensure etcd quorum (3+ server nodes). If lost, restore etcd from snapshot.
4. **Ransomware:** Restore from air-gapped offsite backups. Never pay.

### DR Testing Schedule

| Test | Frequency | Description |
|------|-----------|-------------|
| Backup restore | Monthly | Restore latest backup to a test server, verify data integrity |
| Failover drill | Quarterly | Simulate primary failure, promote standby, measure RTO |
| Full DR exercise | Annually | Complete rebuild from offsite backups on new hardware |

---

## 14. Cost Estimation

### Hardware + Hosting Costs (Annual)

| Tier | Hardware (one-time) | Hosting/Colocation (annual) | Total Year 1 | Total Year 2+ |
|------|--------------------|-----------------------------|---------------|----------------|
| Small clinic | $2,000-$4,000 | $1,200-$2,400 (power/internet) | $3,200-$6,400 | $1,200-$2,400 |
| Medium practice | $6,000-$12,000 | $3,600-$7,200 (colocation) | $9,600-$19,200 | $3,600-$7,200 |
| Large hospital | $25,000-$60,000 | $12,000-$24,000 (colocation) | $37,000-$84,000 | $12,000-$24,000 |

### Equivalent Cloud Costs (Annual)

| Tier | AWS/Azure/GCP (annual) | Notes |
|------|----------------------|-------|
| Small clinic | $6,000-$12,000 | 1 medium instance + RDS + ElastiCache |
| Medium practice | $18,000-$36,000 | 2-3 instances + RDS Multi-AZ + ElastiCache |
| Large hospital | $60,000-$120,000+ | EKS cluster + RDS + ElastiCache + data transfer |

**Break-even analysis:** On-premises typically reaches cost parity with cloud within
12-18 months for medium practices and 6-12 months for large hospitals. Small clinics
may find cloud more cost-effective due to lower management overhead.

**Hidden on-premises costs to consider:** Staff time for maintenance, hardware warranty
renewals, power/cooling, physical security, and insurance.

---

## 15. Troubleshooting

### Service Startup Race Conditions

If services start before PostgreSQL is ready despite `depends_on` with health checks:

```bash
# Check service logs for connection errors
docker compose -f docker-compose.prod.yml logs foundation | grep -i "error\|connect"

# Restart a specific service
docker compose -f docker-compose.prod.yml restart foundation

# Increase start_period in health checks if PostgreSQL takes long to initialize
# (especially on first boot when init-scripts run)
```

### Disk Space Management

```bash
# Check disk usage
df -h
du -sh /var/lib/docker/

# Clean unused Docker resources
docker system prune -f          # Remove stopped containers, unused networks, dangling images
docker image prune -a -f        # Remove ALL unused images (use with care)
docker volume prune -f          # Remove unused volumes (use with care)

# Check PostgreSQL data size
docker exec zeal-postgres psql -U zeal_user -d postgres -c "
  SELECT datname, pg_size_pretty(pg_database_size(datname))
  FROM pg_database WHERE datname LIKE 'zeal_%';
"

# Rotate Docker logs manually
truncate -s 0 /var/lib/docker/containers/*/*.log
```

### PostgreSQL Performance Tuning

```bash
# Check slow queries (already configured to log queries > 500ms)
docker exec zeal-postgres tail -100 /var/lib/postgresql/data/log/postgresql-*.log | grep "duration"

# Check active connections
docker exec zeal-postgres psql -U zeal_user -d postgres -c "
  SELECT datname, state, count(*)
  FROM pg_stat_activity
  GROUP BY datname, state
  ORDER BY count(*) DESC;
"

# Check for lock contention
docker exec zeal-postgres psql -U zeal_user -d postgres -c "
  SELECT blocked_locks.pid AS blocked_pid,
         blocking_locks.pid AS blocking_pid,
         blocked_activity.query AS blocked_query
  FROM pg_catalog.pg_locks blocked_locks
  JOIN pg_catalog.pg_stat_activity blocked_activity ON blocked_activity.pid = blocked_locks.pid
  JOIN pg_catalog.pg_locks blocking_locks ON blocking_locks.locktype = blocked_locks.locktype
  WHERE NOT blocked_locks.granted;
"
```

### Certificate Expiry

```bash
# Check certificate expiry date
openssl x509 -enddate -noout -in config/nginx/ssl/fullchain.pem

# Set up monitoring alert (check daily via cron)
echo '0 8 * * * root openssl x509 -enddate -noout -in /opt/zeal/config/nginx/ssl/fullchain.pem | grep -q "$(date -d "+30 days" +%b)" && echo "CERT EXPIRING SOON" | mail -s "Zeal SSL Alert" admin@yourdomain.com' | sudo tee /etc/cron.d/cert-check
```

### Network Connectivity Between Services

```bash
# Test connectivity from one container to another
docker exec zeal-foundation wget -qO- http://clinical:3020/api/v1/health

# Check DNS resolution inside containers
docker exec zeal-foundation nslookup postgres

# Inspect the Docker network
docker network inspect zeal-network

# Check for port conflicts on the host
sudo ss -tlnp | grep -E "3010|3020|3030|3040|3013|3015|5432|6379"
```

### Resource Exhaustion

```bash
# Check container resource usage
docker stats --no-stream

# Check for OOM kills
dmesg | grep -i "oom\|killed"
docker inspect zeal-clinical | grep -A5 "OOMKilled"

# Increase memory limits in docker-compose.prod.yml and restart
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d

# Check host system resources
free -h
top -bn1 | head -20
iostat -x 1 3
```

### Common Error Messages

| Error | Cause | Fix |
|-------|-------|-----|
| `FATAL: password authentication failed` | Wrong POSTGRES_PASSWORD or pg_hba.conf | Verify `.env.prod` matches pg_hba.conf allowed networks |
| `ECONNREFUSED 127.0.0.1:5432` | Service using localhost instead of Docker hostname | Use `postgres` (service name) not `localhost` in DATABASE_URL |
| `Redis connection to redis:6379 failed - NOAUTH` | Redis password not set in service env | Ensure REDIS_URL includes `:password@` |
| `ERR_SSL_PROTOCOL_ERROR` | SSL cert missing or misconfigured | Verify cert files exist at `config/nginx/ssl/` |
| `502 Bad Gateway` | Upstream service not yet healthy | Wait for health checks; check `docker compose ps` |
| `JavaScript heap out of memory` | Node.js OOM in Next.js build | Set `NODE_OPTIONS=--max-old-space-size=4096` in frontend env |
