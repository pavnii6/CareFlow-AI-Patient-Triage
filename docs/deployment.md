# CareFlow Deployment Guide

## Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL >= 15.0 (production)
- Docker (optional)

---

## Local Development

```bash
# 1. Clone repository
git clone https://github.com/careflow-health/careflow.git
cd careflow

# 2. Install dependencies
npm install

# 3. Copy environment variables
cp .env.example .env.local

# 4. Configure environment variables
# Edit .env.local with your values

# 5. Start development server
npm run dev

# App will be available at http://localhost:3000
```

## Environment Variables

```env
# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_VERSION=2.4.1

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/careflow
DATABASE_POOL_SIZE=10

# Authentication
JWT_SECRET=your-256-bit-secret-key
JWT_EXPIRY=3600
REFRESH_TOKEN_SECRET=your-refresh-secret
REFRESH_TOKEN_EXPIRY=2592000

# AI Service (production)
AI_SERVICE_URL=https://ai.careflow.in
AI_SERVICE_KEY=your-api-key
AI_MODEL_VERSION=v3.2

# Storage
STORAGE_PROVIDER=aws_s3
AWS_BUCKET=careflow-reports
AWS_REGION=ap-south-1
AWS_ACCESS_KEY=your-access-key
AWS_SECRET_KEY=your-secret-key
```

---

## Production Build

```bash
# Build for production
npm run build

# Start production server
npm start

# Or with PM2
pm2 start npm --name "careflow" -- start
pm2 save
pm2 startup
```

---

## Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./
RUN npm ci --only=production
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
# Build image
docker build -t careflow:latest .

# Run container
docker run -d \
  -p 3000:3000 \
  -e DATABASE_URL=... \
  -e JWT_SECRET=... \
  --name careflow \
  careflow:latest
```

---

## Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

Set environment variables in Vercel Dashboard → Project Settings → Environment Variables.

---

## Database Setup

```bash
# Create database
createdb careflow

# Run schema
psql -U postgres -d careflow -f docs/schema.sql

# Run seed data
psql -U postgres -d careflow -f docs/seed.sql
```

---

## Health Checks

```bash
# API health
curl https://api.careflow.in/v1/health

# Database health
curl https://api.careflow.in/v1/health/db

# AI service health
curl https://api.careflow.in/v1/health/ai
```

---

## Monitoring

Recommended monitoring stack:
- **Metrics:** Prometheus + Grafana
- **Logging:** ELK Stack (Elasticsearch + Logstash + Kibana)
- **APM:** Datadog or New Relic
- **Uptime:** UptimeRobot or Pingdom
- **Alerts:** PagerDuty integration
