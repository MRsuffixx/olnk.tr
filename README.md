# Personal Micro-Site Builder (olnktr)

A scalable, containerized full-stack application to build personal micro-sites (like Linktree). Users can create customizable profile pages with widgets, themes, and analytics. Public profiles are served at `/@username`.

## 🚀 Tech Stack

- **Frontend:** Next.js (App Router), TypeScript, TailwindCSS, Framer Motion
- **Backend:** NestJS, TypeScript, REST API
- **Database:** PostgreSQL + Prisma ORM
- **Cache / Rate Limiting:** Redis
- **Auth:** JWT (Access + Refresh tokens)
- **Architecture:** Turborepo monorepo, Docker Compose orchestration

## 📦 Project Structure

```text
olnktr/
├── backend/          # NestJS API (Port: 4000)
├── frontend/         # Next.js App (Port: 3000)
├── turbo.json        # Turborepo task config
├── docker-compose.yml # Container orchestration
├── .env.example      # Environment variables template
└── package.json      # Monorepo scripts
```

## 🐳 Running with Docker (Production Ready)

The entire system is containerized and managed via `docker-compose`. Absolutely no manual dependencies (like Node or Postgres) are required on your host machine.

### 1. Configure Environment

Copy the example environment file:
```bash
cp .env.example .env
```
_Edit `.env` to customize secrets, ports, and database credentials if needed. Out of the box, `.env.example` provides a working setup for local deployment._

### 2. Start Services

To build the images and start the complete stack:
```bash
npm run docker:up
# Or directly: docker-compose up -d --build
```

**What this does automatically:**
1. Starts **PostgreSQL** (waiting until healthy).
2. Starts **Redis** (waiting until healthy).
3. Builds the **backend** (NestJS), runs Prisma migrations, and optionally seeds demo data (if `SEED_DB=true`).
4. Builds the **frontend** (Next.js standalone build).
5. Serves the application on `http://localhost:3000`.

### 3. Accessing the Application

- **Frontend (Web):** http://localhost:3000
- **Backend (API):** http://localhost:4000/api
- **Demo Account:** `demo@olnktr.com` / `password123`
- **Demo Profile:** http://localhost:3000/@demo

To turn off the application:
```bash
npm run docker:down
# Or directly: docker-compose down
```

## ⚙️ Development Mode (Without Docker)

If you prefer to develop locally without Docker (e.g., using Turborepo's fast compilation):

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start Infrastructure (DB + Redis):**
   *(Ensure you have Postgres and Redis running manually, or start just those containers via a custom compose).*
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env.local
   cd backend && npx prisma db push && npm run seed && cd ..
   ```

3. **Run Concurrently:**
   ```bash
   npm run dev
   # Uses Turborepo to hot-reload both frontend and backend
   ```

## 🔒 Security & Deployment Notes (Dokploy / Coolify etc.)

This project is completely designed for zero-touch configuration in PaaS systems like Dokploy.

- **Dynamic Ports:** `API_PORT` and `WEB_PORT` dictate container exposure.
- **Standalone Frontend:** Next.js is configured with `output: "standalone"` to reduce image size by 80%.
- **Zero Hardcoded Secrets:** Every variable (JWT, DB URL, Redis) passes securely through `.env`.
- **Volumes Persistence:** Postgres data (`pgdata`) and User Uploads (`uploads`) strictly utilize Docker volumes for data safety across container restarts.
