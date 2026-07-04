# InfraWatch

InfraWatch is a server inventory and monitoring dashboard for DevOps teams.

It helps you track:

- Servers and IPs
- Domains and SSL details
- Cron jobs and last status
- Docker/systemd/nginx services
- Deployment details
- Alerts

## Tech Stack

- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express.js
- Database: PostgreSQL
- Deployment: Docker Compose + Nginx

## Local / Server Setup

### 1. Create backend env

```bash
cp backend/.env.example backend/.env
nano backend/.env
```

Update passwords before deploying.

### 2. Start app

```bash
docker compose up -d --build
```

Open:

```text
http://SERVER_IP:8080
```

### 3. Default admin

The backend creates an admin user from these env values:

```env
ADMIN_NAME=Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin@12345
```

Login using that email and password.

### 4. Check logs

```bash
docker logs -f infrawatch-backend
docker logs -f infrawatch-postgres
```

### 5. Reset database for dev only

```bash
docker compose down -v
docker compose up -d --build
```

Do not use `down -v` in production unless you intentionally want to delete database data.

## GitHub Actions

Add these repository secrets:

```text
DEV_SERVER_HOST
DEV_SERVER_USER
DEV_SERVER_SSH_KEY
DEV_BACKEND_ENV

SERVER_HOST
SERVER_USER
SERVER_SSH_KEY
BACKEND_ENV
```

Use `deploy-dev.yml` for `dev` branch and `deploy-prod.yml` for `main` branch.
