# CareFlow — AI-Powered Patient Triage & Diagnostic Allocation Platform

> Enterprise-grade healthcare operations platform for Apollo Hospitals Group

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)](https://tailwindcss.com)
[![Recharts](https://img.shields.io/badge/Recharts-2.12-ff6900)](https://recharts.org)
[![License](https://img.shields.io/badge/License-Enterprise-green)](LICENSE)

---

## Overview

CareFlow is a production-quality enterprise web application demonstrating AI-powered clinical workflow optimization. It serves as a comprehensive portfolio project covering Business Analysis, Project Management, Product Management, and Healthcare IT domains.

### Key Capabilities

| Module | Description |
|--------|-------------|
| 🏥 Patient Management | Registration, vitals, demographics, triage assignment |
| 🤖 AI Triage Engine | ML-powered risk scoring with explainability |
| 🔬 Diagnostic Allocation | Intelligent slot scheduling with conflict resolution |
| 📊 Executive Dashboard | Real-time KPIs, charts, machine utilization |
| 👨‍⚕️ Doctor Dashboard | Patient queue, history, priority management |
| 📈 Analytics | Power BI-style operational intelligence |
| 📋 PMO Dashboard | Sprint board, burndown, milestones, RAID log |
| 📝 BA Workspace | User stories, BRD, RTM, stakeholder matrix |
| 🗺️ Process Maps | BPMN-style As-Is / To-Be workflows |
| ⚠️ Risk Register | Heat map, mitigation tracking, escalation |
| 🌲 WBS | Expandable work breakdown structure |
| 📅 Gantt Chart | Timeline with critical path highlighting |
| 🔔 Notifications | Real-time clinical and system alerts |
| 📄 Reports | PDF/Excel/CSV export capabilities |
| ⚙️ Settings | Theme, roles, notifications, system info |

---

## Tech Stack

**Frontend**
- Next.js 14 (App Router)
- TypeScript 5.5
- Tailwind CSS 3.4
- Recharts 2.12
- Lucide React
- Zustand (state management)

**Backend** (production extension)
- Node.js + Express
- PostgreSQL
- JWT authentication
- REST API (see `/docs/api.md`)

---

## Getting Started

### Prerequisites

```bash
node >= 18.0.0
npm >= 9.0.0
```

### Installation

```bash
# Clone the repository
git clone https://github.com/careflow-health/careflow.git
cd careflow

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Hospital Director | director@careflow.in | Director@123 |
| Doctor | priya.sharma@careflow.in | Doctor@123 |
| Triage Nurse | kavita.reddy@careflow.in | Nurse@123 |
| Lab Technician | sunil.rao@careflow.in | Lab@123 |
| Administrator | admin@careflow.in | Admin@123 |

---

## Project Structure

```
careflow/
├── app/                          # Next.js App Router
│   ├── (auth)/login/             # Login page
│   ├── (dashboard)/              # Protected dashboard routes
│   │   ├── dashboard/            # Executive dashboard
│   │   ├── patients/             # Patient management
│   │   ├── triage/               # AI triage engine
│   │   ├── diagnostics/          # Diagnostic allocation
│   │   ├── doctors/              # Doctor dashboard
│   │   ├── analytics/            # Analytics (Power BI style)
│   │   ├── pmo/                  # PMO dashboard
│   │   ├── ba-workspace/         # BA workspace
│   │   ├── process-map/          # BPMN process maps
│   │   ├── risk-register/        # Risk register & heat map
│   │   ├── wbs/                  # Work breakdown structure
│   │   ├── gantt/                # Gantt chart
│   │   ├── notifications/        # Notification centre
│   │   ├── reports/              # Reports & exports
│   │   └── settings/             # Settings
│   ├── globals.css               # Global styles & CSS variables
│   └── layout.tsx                # Root layout
├── components/
│   ├── layout/                   # Sidebar, Header
│   ├── ui/                       # Reusable UI components
│   └── dashboard/                # Dashboard-specific components
├── data/                         # Mock data (500+ realistic records)
│   ├── patients.ts
│   ├── doctors.ts
│   ├── analytics.ts
│   ├── pmo.ts
│   ├── ba.ts
│   └── notifications.ts
├── lib/
│   ├── utils.ts                  # Utility functions
│   └── store.ts                  # Zustand global state
├── types/
│   └── index.ts                  # TypeScript type definitions
├── docs/
│   ├── api.md                    # REST API documentation
│   ├── schema.sql                # PostgreSQL database schema
│   ├── architecture.md           # System architecture
│   └── deployment.md             # Deployment guide
└── README.md
```

---

## Business Analysis Artifacts

All BA artifacts are embedded and viewable within the application:

- **BRD** — 12 sections, ~57 pages (viewable in BA Workspace)
- **FRD** — Functional requirements mapped to user stories
- **User Stories** — 20 stories with full acceptance criteria
- **Stakeholder Matrix** — 10 stakeholders with influence/interest mapping
- **RTM** — Requirements traced from BRD → FRD → User Story → Test Case
- **Process Maps** — As-Is (67-min avg) vs To-Be (~27-min avg) workflows

---

## Project Management Artifacts

- **WBS** — 6 phases, 30+ work packages with progress tracking
- **Gantt Chart** — 19 tasks with critical path (June 2024 – September 2024)
- **Sprint Board** — Kanban with 5 sprints (Sprints 1-3 completed, Sprint 4 active)
- **Burndown Chart** — Sprint velocity and ideal vs actual tracking
- **Risk Register** — 8 risks with 5×5 heat map
- **Milestones** — 7 key delivery milestones

---

## AI Triage Engine

The simulated ML engine (CareFlow-Triage-v3.2) processes:

**Inputs:**
- Vitals (HR, BP, Temp, SpO₂, RR)
- Patient age
- Presenting symptoms

**Outputs:**
- Triage Level (Critical/High/Medium/Low)
- Risk Score (0–100)
- Confidence % 
- Recommended Department
- Recommended Diagnostics
- Estimated Wait Time
- Feature Contribution Analysis (Explainability)

**Performance (simulated):** 97.2% accuracy · <3 second response time

---

## Deployment

See [docs/deployment.md](docs/deployment.md) for full deployment instructions.

**Quick Docker Deploy:**
```bash
docker build -t careflow .
docker run -p 3000:3000 careflow
```

**Vercel Deploy:**
```bash
npx vercel --prod
```

---

## Contributing

This is a portfolio project for demonstration purposes. For enterprise licensing, contact the CareFlow Health Technologies team.

---

## License

CareFlow Enterprise Edition — Licensed to Apollo Hospitals Group  
© 2024 CareFlow Health Technologies Pvt. Ltd.
