# Local Development Guide

## Prerequisites
- Node.js 18+
- SQLite (built-in mostly) or PostgreSQL (optional if not using SQLite mode)
- Docker Desktop (Optional, for Postgres)

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   A `.env` file has been created for you with:
   - `DATABASE_URL="file:./dev.db"` (SQLite mode enabled for no-dependency local dev)
   - `AUTH_SECRET="supersecret-change-me-in-prod"`

3. **Database Setup**
   The project is currently configured to use **SQLite** for easiest local setup.
   ```bash
   # Run migrations (creates dev.db)
   npx prisma migrate dev --name init_sqlite
   
   # Javascript/Typescript Seed
   # We configured package.json to run ts-node
   npx prisma db seed
   ```
   *The seed script creates:*
   - Vendor: `vendor@demo.com` / `password123` (Org: OfficeMax Direct)
   - Company: `company@demo.com` / `password123` (Org: Acme Corp)

4. **Run Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

## Authentication Flow
1. Go to `/company/login`.
2. Login with `company@demo.com` / `password123`.
3. You will be redirected to the Dashboard.

## Features Enabled
- **Auth**: Email/Password login via NextAuth.
- **Onboarding**: Registration automatically creates an Organization.
- **Orders**: View orders fetched from the local DB.
- **Products**: View products fetched from the local DB.

## Switching to Postgres
If you want to use Postgres (e.g. for production parity):
1. Install Docker Desktop.
2. Update `.env` with `DATABASE_URL` pointing to Postgres.
3. Update `prisma/schema.prisma` provider to `postgresql`.
4. Run `docker-compose up -d`.
5. Run `npx prisma migrate dev`.
