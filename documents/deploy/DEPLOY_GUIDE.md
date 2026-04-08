# Wonderfarm - Deploy Guide

> VPS: CentOS 7.9 | RAM: 3GB | IP: 171.244.201.165

## Directory Structure (VPS)

```
/var/www/wonderfarm/
├── frontend/
│   ├── main/                     # wonderfarmsieusaothanhmat.com
│   │   ├── index.html
│   │   ├── _next/
│   │   └── ...
│   └── demo/                     # demo.wonderfarmsieusaothanhmat.com
│       ├── index.html
│       ├── _next/
│       └── ...
│
└── backend/                      # Node Express + Docker (shared)
    ├── docker-compose.yml
    ├── Dockerfile
    ├── mysql-config.cnf
    ├── deploy.sh
    ├── .env
    ├── uploads/                  # User uploaded images
    └── src/
```

## Architecture

```
wonderfarmsieusaothanhmat.com          demo.wonderfarmsieusaothanhmat.com
              │                                       │
              ▼                                       ▼
         Nginx (:80 / :443)  ← Host-level, not Docker
              │
    ┌─────────┼──────────────────────────────────┐
    │         │                                  │
    │  Main site?                  Demo site?    │
    │  root: frontend/main/        root: frontend/demo/
    │         │                                  │
    │         └──────────┬───────────────────────┘
    │                    │
    │         /api/*  /socket.io/*
    │                    │
    │                    ▼
    │         proxy_pass 127.0.0.1:9456
    │                    │
    └────────────────────┼───────────────────────┘
                         ▼
              Docker Compose (backend/)
              ├── app  (wonderfarm_app)  → Node Express :9456  [max 768MB]
              └── db   (wonderfarm_db)   → MySQL 8.0 :3306     [max 1GB]
```

---

## A. Setup VPS (chi chay 1 lan)

### 1. SSH vao VPS

```bash
ssh root@171.244.201.165
```

### 2. Chay setup script

```bash
# Upload setup-vps.sh len VPS
scp setup-vps.sh root@171.244.201.165:/tmp/

# SSH vao va chay
ssh root@171.244.201.165
bash /tmp/setup-vps.sh
sudo reboot
```

Script se tu dong:

- Cai Docker, Docker Compose, Nginx, rsync
- Tao swap 4GB
- Tao cau truc thu muc `/var/www/wonderfarm/`
- Cau hinh Nginx (frontend + API proxy)
- Cau hinh Docker log rotation
- Setup resource monitoring (cron 5 phut/lan)
- Setup Docker cleanup (hang tuan)

### 3. Cau hinh Nginx (neu can chinh sua)

```bash
sudo nano /etc/nginx/sites-available/wonderfarm
sudo nginx -t
sudo systemctl reload nginx
```

---

## B. Deploy Backend

### 1. Lan dau - Clone repo

```bash
cd /var/www/wonderfarm/backend
git clone <repo-url> .
```

### 2. Cau hinh environment

```bash
cp .env.example .env
nano .env
```

Cac bien quan trong:

```env
DB_HOST=db
DB_PORT=3306
DB_NAME=main_server
DB_USERNAME=root
DB_PASSWORD=Admin123
PORT=9456
NODE_ENV=production
```

### 3. Chay deploy

```bash
cd /var/www/wonderfarm/backend
bash deploy.sh
```

Deploy script se:

1. Backup code hien tai → `/var/www/backups/`
2. Pull code moi tu git
3. Build Docker image
4. Start MySQL, doi healthy
5. Start App
6. Health check, rollback neu loi

### 4. Kiem tra

```bash
# Xem status containers
docker compose ps

# Xem logs
docker compose logs -f app
docker compose logs -f db

# Test API
curl http://127.0.0.1:9456/api/health
```

---

## C. Deploy Frontend

2 frontend rieng biet, chung 1 backend API:

| Domain | Thu muc VPS |
|--------|-------------|
| `wonderfarmsieusaothanhmat.com` | `/var/www/wonderfarm/frontend/main/` |
| `demo.wonderfarmsieusaothanhmat.com` | `/var/www/wonderfarm/frontend/demo/` |

### Deploy main site

```bash
# Build static export (tu local)
npm run build

# Rsync len VPS
rsync -avz --delete ./out/ root@171.244.201.165:/var/www/wonderfarm/frontend/main/
```

### Deploy demo site

```bash
# Build static export (tu local, repo/branch demo)
npm run build

# Rsync len VPS
rsync -avz --delete ./out/ root@171.244.201.165:/var/www/wonderfarm/frontend/demo/
```

Khong can restart bat ky service nao — Nginx serve static files truc tiep.

---

## D. Cac lenh thuong dung

### Quan ly containers

```bash
cd /var/www/wonderfarm/backend

# Restart app
docker compose restart app

# Rebuild va restart app (sau khi sua code)
docker compose up -d --build app

# Xem logs realtime
docker compose logs -f --tail=100 app

# Vao shell container
docker compose exec app sh
docker compose exec db mysql -uroot -pAdmin123 main_server
```

### Quan ly Nginx

```bash
# Test config
sudo nginx -t

# Reload (khong downtime)
sudo systemctl reload nginx

# Xem access log
sudo tail -f /var/log/nginx/access.log

# Xem error log
sudo tail -f /var/log/nginx/error.log
```

### Backup & Restore

```bash
# Backup database
docker compose exec db mysqldump -uroot -pAdmin123 main_server > backup.sql

# Restore database
docker compose exec -T db mysql -uroot -pAdmin123 main_server < backup.sql

# Xem danh sach backup
ls -la /var/www/backups/
```

### Monitor resources

```bash
# Realtime
htop

# Xem log
cat /var/log/resource-usage.log | tail -20

# Docker resource usage
docker stats
```

---

## E. Troubleshooting

| Van de | Giai phap |
|--------|-----------|
| App khong start | `docker compose logs app` — xem loi |
| MySQL khong start | `docker compose logs db` — xem loi, co the thieu disk |
| 502 Bad Gateway | App chua start xong hoac da crash, kiem tra `docker compose ps` |
| Frontend 404 | Kiem tra file ton tai: `ls /var/www/wonderfarm/frontend/main/` hoac `frontend/demo/` |
| Disk day | `docker system prune -a` va `bash /usr/local/bin/docker-cleanup.sh` |
| RAM cao | `docker stats` xem container nao dung nhieu, restart neu can |

---

## F. Memory Budget (3GB RAM)

| Component | Limit | Reserved |
|-----------|-------|----------|
| Nginx (host) | ~50MB | - |
| Node App (Docker) | 768MB | 384MB |
| MySQL (Docker) | 1GB | 512MB |
| OS + overhead | ~700MB | - |
| Swap | 4GB | - |
| **Total** | **~2.5GB** | - |
