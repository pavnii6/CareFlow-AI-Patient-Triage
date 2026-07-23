# CareFlow System Architecture

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    CAREFLOW PLATFORM                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌───────────────────────────────────────────────────┐    │
│   │              PRESENTATION LAYER                    │    │
│   │   Next.js 14 (App Router) + TypeScript + Tailwind │    │
│   │   ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌──────┐  │    │
│   │   │Dashboard│ │ Triage  │ │  PMO    │ │  BA  │  │    │
│   │   │ Module  │ │ Engine  │ │Dashboard│ │Workspace│  │    │
│   │   └─────────┘ └─────────┘ └─────────┘ └──────┘  │    │
│   └───────────────────────────────────────────────────┘    │
│                           │                                 │
│   ┌───────────────────────────────────────────────────┐    │
│   │              STATE MANAGEMENT                      │    │
│   │         Zustand + React Query                      │    │
│   └───────────────────────────────────────────────────┘    │
│                           │                                 │
│   ┌───────────────────────────────────────────────────┐    │
│   │              API GATEWAY                           │    │
│   │         Next.js API Routes / Express.js            │    │
│   │              JWT Authentication                    │    │
│   │              RBAC Middleware                       │    │
│   └───────────────────────────────────────────────────┘    │
│                           │                                 │
│   ┌───────────────┐  ┌───────────────┐  ┌───────────────┐  │
│   │   CLINICAL    │  │      AI       │  │   ANALYTICS   │  │
│   │   SERVICES    │  │   SERVICES    │  │   SERVICES    │  │
│   │  - Patient    │  │  - Triage     │  │  - KPI Calc   │  │
│   │  - Encounters │  │    Engine     │  │  - Reports    │  │
│   │  - Vitals     │  │  - Prediction │  │  - Aggregation│  │
│   │  - Scheduling │  │  - Explain    │  │               │  │
│   └───────┬───────┘  └───────┬───────┘  └───────┬───────┘  │
│           │                  │                  │           │
│   ┌───────────────────────────────────────────────────┐    │
│   │              DATA LAYER                            │    │
│   │         PostgreSQL 15 (Primary + Read Replica)     │    │
│   │         Redis (Session + Cache)                    │    │
│   │         Object Storage (Reports, Images)           │    │
│   └───────────────────────────────────────────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Component Architecture

### Frontend (Next.js)
- **App Router** — File-based routing with layout nesting
- **Server Components** — Static content, SEO optimization
- **Client Components** — Interactive dashboards, real-time updates
- **Zustand** — Global state (auth, UI preferences)
- **Recharts** — All data visualizations
- **Tailwind CSS** — Utility-first styling with CSS variables

### AI Triage Engine
- Rule-based scoring algorithm (production would use trained ML model)
- Feature extraction from vitals and symptom data
- SHAP-style feature contribution calculation for explainability
- Confidence score based on data completeness
- Fallback to rule-based when AI confidence < 70%

### Security Architecture
- JWT tokens (RS256 algorithm) with 1-hour expiry
- Refresh tokens (30-day) stored in HttpOnly cookies
- RBAC at API and UI level
- AES-256 encryption for PHI at rest
- TLS 1.3 for all transport
- Audit log for all data access and modifications

## Data Flow — Patient Triage

```
Patient Arrives
    ↓
Nurse Registration (Web Form)
    ↓
POST /patients/register
    ↓
Patient Record Created (PostgreSQL)
    ↓
POST /triage/predict
    ↓
AI Engine: Feature Extraction
    ↓
Risk Score Calculation (ML Model)
    ↓
Triage Level + Explainability
    ↓
POST /diagnostics/allocate
    ↓
Slot Allocation Engine
    ↓
Conflict Check (DB Constraint)
    ↓
Slots Confirmed
    ↓
Real-time Notification (WebSocket)
    ↓
Doctor Dashboard Updated
```

## Deployment Architecture

```
Internet → CloudFront CDN
               ↓
          Load Balancer (ALB)
         /                  \
   App Server 1        App Server 2
   (Next.js)           (Next.js)
         \                  /
          PostgreSQL Cluster
          (Primary + Replica)
               ↓
            Redis Cache
```

### Hosting Options
1. **AWS** — ECS Fargate + RDS PostgreSQL + ElastiCache
2. **Azure** — App Service + Azure Database for PostgreSQL
3. **Vercel** — Next.js frontend + Supabase PostgreSQL
4. **On-Premise** — Docker Compose + managed PostgreSQL

## Performance Targets

| Metric | Target |
|--------|--------|
| AI Triage Response | < 3 seconds |
| Dashboard Load | < 2 seconds |
| API Response (95th %ile) | < 500ms |
| Database Query (complex) | < 200ms |
| Concurrent Users | 500+ |
| Uptime SLA | 99.9% |
