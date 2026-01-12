# Deployment Guide

## Environment Variables
Ensure these are set in your deployment platform (Vercel, Railway, etc.):

- `DATABASE_URL`: Connection string to your production Postgres database.
- `AUTH_SECRET`: Generate a random string (e.g. `openssl rand -base64 32`).
- `AUTH_URL`: Your canonical URL (e.g. `https://mogvel.com`).

## Database Migration
Do NOT use `migrate dev` in production. Use `migrate deploy`.

```bash
npx prisma migrate deploy
```

## Build
The standard Next.js build command:
```bash
npm run build
```

## Seed Data
To seed production with initial defaults (if needed):
```bash
npx prisma db seed
```
