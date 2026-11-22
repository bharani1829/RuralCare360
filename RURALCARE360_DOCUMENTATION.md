# RuralCare 360 — Technical Documentation

## Table of Contents
1. Overview
2. Architecture
3. Tech Stack Summary
4. Project Structure
5. Core Features
6. Data Models
7. Authentication & Authorization
8. Internationalization
9. Offline Support
10. API Endpoints
11. Development Guide
12. Deployment Guide
13. Troubleshooting

---

## 1. Overview

RuralCare 360 is a closed-loop healthcare coordination platform designed to solve the critical problem of lost referrals and fragmented care in rural India. The system provides end-to-end patient journey tracking from initial contact through diagnosis, treatment, and follow-up.

### Key Metrics
- **Referral Completion Rate**: 82%
- **Patients Tracked**: 9 demo cases
- **Healthcare Facilities**: 3 (PHC, Rural Hospital, District Hospital)
- **Care Stages Tracked**: 16 stages
- **Supported Languages**: 3 (English, Telugu, Hindi)

---

## 2. Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    RURALCARE 360 ARCHITECTURE                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────┐     ┌──────────────┐     ┌─────────────────┐  │
│  │   CLIENT    │     │   DASHBOARD  │     │   API LAYER     │  │
│  │  (Browser)  │────▶│  (React UI)  │────▶│   (Next.js)     │  │
│  │             │     │              │     │                 │  │
│  └─────────────┘     └──────┬───────┘     └────────┬────────┘  │
│                              │                        │          │
│  ┌─────────────┐     ┌──────▼───────┐     ┌────────▼────────┐  │
│  │  OFFLINE    │     │   STATE      │     │   DATABASE      │  │
│  │  STORAGE    │◀───▶│  MANAGEMENT  │◀───▶│   (Simulated)   │  │
│  │  (localStorage)   │   (Context)  │     │   demo-data.ts  │  │
│  └─────────────┘     └──────────────┘     └─────────────────┘  │
│                              │                                   │
│  ┌───────────────────────────▼─────────────────────────────┐   │
│  │              SERVICES & INTEGRATIONS                     │   │
│  │  - Digital Triage Engine                                 │   │
│  │  - Facility Matching Algorithm                           │   │
│  │  - Notification System                                   │   │
│  │  - Analytics Dashboard                                   │   │
│  │  - Emergency Care Management                             │   │
│  └───────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Architectural Principles
- **Offline-First**: Full application functionality without internet
- **Role-Based Access**: Five distinct user roles with tailored experiences
- **Progressive Enhancement**: Core features work without JavaScript
- **Mobile-First**: Responsive design for rural mobile usage

---

## 3. Tech Stack Summary

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| **Framework** | Next.js | 15.1.0 | App Router, SSR, SSG |
| **Runtime** | React | 19.0.0 | UI Library |
| **Language** | TypeScript | 5.7.2 | Type Safety |
| **Styling** | Tailwind CSS | 4.0.0 | Utility-first CSS |
| **UI Kit** | Radix UI | Components | Accessible Primitives |
| **Icons** | Lucide React | 0.468.0 | SVG Icons |
| **State** | React Context | - | Global State |
| **Forms** | React Hook Form | 7.53.0 | Form Management |
| **Validation** | Zod | 3.23.8 | Schema Validation |
| **Charts** | Recharts | 2.13.0 | Data Visualization |
| **i18n** | i18next | 23.15.0 | Localization |
| **Dates** | date-fns | 2.30.0 | Date Utilities |

---

## 4. Project Structure

```
src/
├── app/                           # Next.js App Router
│   ├── (dashboard)/              # Protected routes (middleware)
│   │   ├── dashboard/            # Main dashboard
│   │   ├── patients/             # Patient management
│   │   ├── referrals/            # Referral tracking
│   │   ├── triage/               # Digital clinical assessment
│   │   ├── facilities/           # Facility finder
│   │   ├── medicines/            # Inventory management
│   │   ├── followups/            # Task management
│   │   ├── emergency/            # Emergency care
│   │   ├── reports/              # Analytics
│   │   ├── audit/                # System audit log
│   │   └── admin/                # Admin panel
│   │
│   ├── login/                    # Authentication
│   └── page.tsx                  # Landing page
│
├── components/                   # Reusable UI components
├── lib/                           # Core libraries
│   ├── demo-data.ts               # Simulated database seed
│   ├── i18n.ts                    # Translation system
│   ├── store.ts                   # Global state context
│   └── utils.ts                   # Utility functions
│
└── styles/                       # Global styles
    └── globals.css
```

---

## 5. Core Features

### 5.1 Digital Triage Engine
Risk stratification algorithm that assesses patients and assigns priority levels:
- **LOW**: Routine care
- **MEDIUM**: Schedule within 24-48 hours
- **HIGH**: Schedule within 6-12 hours
- **CRITICAL**: Immediate attention required

### 5.2 Closed-Loop Referral Tracking
16-stage patient journey tracked from PHC to District Hospital and back
(Registered → Vitals → Triage → Consultation → Referral → Accepted → Appointment → Arrived → Diagnostics → Consultation → Treatment → Follow-up → Closed)

### 5.3 Facility Finder
Real-time matching based on service availability, medicine stock, diagnostics, distance, and queue length

### 5.4 Multilingual Interface
Instant switching between English, Telugu (తెలుగు), and Hindi (हिंदी)

---

## 6. Data Models

### Patient
```typescript
interface Patient {
  id: string;              // P-1042
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  village: string;
  phone: string;
  primaryCondition: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  lastVisit: string;
  nextFollowUp: string;
  careStage: CareStage;
  vitals?: Vitals;
  medicalHistory: string[];
  assignedWorker: string;
}
```

### Referral
```typescript
interface Referral {
  id: string;              // REF-10234
  patientId: string;
  patientName: string;
  reason: string;
  specialty: string;
  diagnosticTests: string[];
  urgency: 'routine' | 'priority' | 'emergency';
  status: ReferralStatus;
  timeline: ReferralTimelineEntry[];
}
```

### Facility
```typescript
interface Facility {
  id: string;
  name: string;
  type: 'PHC' | 'Rural Hospital' | 'District Hospital';
  distance: number;
  doctors: { name: string; specialty: string; available: boolean }[];
  diagnostics: { name: string; available: boolean; nextSlot?: string }[];
  medicines: { name: string; stock: number; threshold: number; status: string }[];
  queueLength: number;
  status: 'operational' | 'limited' | 'closed';
}
```

---

## 7. Authentication & Authorization

### User Roles
| Role | Description | Key Permissions |
|------|-------------|-----------------|
| **patient** | Patient self-service | View own records, appointments, teleconsult |
| **health-worker** | ASHA/ANM community worker | Register patients, triage, create referrals, follow-ups |
| **doctor** | Specialist/Consultant | Review referrals, consultations, prescriptions |
| **facility-staff** | Hospital/PHC staff | Patient arrivals, diagnostics, medicine management |
| **admin** | System administrator | All permissions, analytics, quality reports |

---

## 8. Development Guide

### Prerequisites
- Node.js 18+ or 20+
- npm 9+
- Git

### Setup
```bash
# Clone repository
git clone <repository-url>
cd ruralcare-360

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts
| Command | Description |
|---------|-------------|
| `npm run dev` | Development server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Production server |
| `npm run lint` | Code quality checks |

---

## 9. Deployment Guide

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Docker
```bash
docker build -t ruralcare-360 .
docker run -p 3000:3000 ruralcare-360
```

### Local Server
```bash
npm install
npm run build
npm run start
```

---

## 10. Demo Access

### Quick Login (No Registration Required)
| Role | Name | ID | PIN |
|------|------|-----|-----|
| Health Worker | Asha Lakshmi | HW-98765 | 123456 |
| Doctor | Dr. Ramesh Kumar | DOC-54321 | 123456 |
| Facility Staff | Srinivas Rao | STF-11223 | 123456 |
| Admin | Priya Sharma | ADM-00112 | 123456 |
| Patient | Rajesh Kumar | ABHA-98765 | 123456 |

**Quick Demo Flow:**
1. Visit `/login`
2. Click "Instant Sign In" button
3. Use any role to explore the platform

---

## 11. Tech Stack JSON (Copy-paste friendly)

```json
{
  "framework": "Next.js 15.1.0",
  "runtime": "React 19.0.0",
  "language": "TypeScript 5.7.2",
  "styling": "Tailwind CSS 4.0.0",
  "ui": "Radix UI Components",
  "icons": "Lucide React 0.468.0",
  "state": "React Context API",
  "forms": "React Hook Form 7.53.0",
  "validation": "Zod 3.23.8",
  "charts": "Recharts 2.13.0",
  "i18n": "i18next 23.15.0",
  "dates": "date-fns 2.30.0"
}
```

---

## 12. License

Built for Smart India Hackathon 2026. This is a demonstration prototype, not a live healthcare system.

---

**Document Version**: 1.0  
**Last Updated**: November 2026  
**Project**: RuralCare 360