# RuralCare 360 — Project Documentation

## Smart India Hackathon 2026 Submission

---

## Table of Contents

1. Executive Summary
2. Problem Statement
3. Solution Overview
4. Target Users & Stakeholders
5. System Architecture
6. Key Features
7. Technology Stack
8. Implementation Details
9. Demo Walkthrough
10. Future Enhancements
11. Team & Contact

---

## 1. Executive Summary

RuralCare 360 is a closed-loop healthcare coordination platform designed to address the critical continuity gap in rural healthcare delivery. The platform connects patients, frontline health workers, doctors, and health facilities into one continuous care journey, ensuring no patient gets lost between primary health centers and tertiary hospitals.

Unlike traditional referral systems where patients disappear from the system after referral, RuralCare 360 tracks each patient from initial contact through diagnosis, treatment, and follow-up, creating a comprehensive care continuum.

**Key Achievement:** Full prototype with working closed-loop patient journey demonstration, multilingual support, and role-based access control for all healthcare stakeholders.

---

## 2. Problem Statement

Rural healthcare faces a severe continuity crisis:

### Primary Issues

1. **Fragmented Patient Records** — Medical history scattered across multiple facilities
2. **Lost Referrals** — 40% of patient referrals never complete their journey
3. **Distance Barriers** — Patients travel 30-50km for specialist care without coordination
4. **Missing Diagnostics** — Tests unavailable when patients arrive for appointments
5. **Medicine Shortages** — No real-time visibility into stock levels
6. **Poor Follow-up** — Patients lost after initial treatment

### Impact on Rural Communities

- Delayed or missed diagnoses
- Preventable complications from unmonitored chronic conditions
- Wasted resources on incomplete care cycles
- Distrust in healthcare system due to poor coordination

---

## 3. Solution Overview

RuralCare 360 provides an end-to-end digital platform that:

### Core Innovation: Closed-Loop Referrals

```
Traditional Flow:
Referral Created → Patient Leaves System → [GONE]

RuralCare 360 Flow:
Referral Created → Accepted → Appointment → Arrival → 
Diagnostics → Treatment → Follow-up → Care Closed
```

### Key Mechanisms

1. **Dynamic Facility Matching** — Real-time service availability matching
2. **Stock Visibility** — Medicine and diagnostic availability before referral
3. **Automated Follow-ups** — Task generation for frontline workers
4. **Offline-First Design** — Full functionality in low-connectivity areas

---

## 4. Target Users & Stakeholders

### Primary Users

| User Role | Responsibilities | Platform Access |
|-----------|------------------|-----------------|
| **Patients** | Track health records, view appointments, communicate with providers | Patient portal, mobile-responsive |
| **ASHA/ANM Workers** | Community outreach, data collection, follow-up tasks | Frontline worker dashboard |
| **Doctors/Specialists** | Consultations, referrals, diagnosis review | Clinical dashboard |
| **Facility Staff** | Patient registration, medicine management, queue management | Administrative panel |
| **Administrators** | Quality monitoring, analytics, system oversight | Admin dashboard |

### Integration Partners

- Primary Health Centers (PHCs)
- Rural Hospitals
- District Hospitals
- Ambulance Services
- Pharmacy Networks

---

## 5. System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    RURALCARE 360 PLATFORM                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────┐     ┌──────────────┐     ┌─────────────────┐  │
│  │   CLIENT    │     │   DASHBOARD  │     │   API LAYER     │  │
│  │             │────▶│              │────▶│                 │  │
│  │ - Web App   │     │ - React UI   │     │ - REST/GraphQL  │  │
│  │ - PWA       │     │ - Dashboards │     │ - Auth          │  │
│  └─────────────┘     └──────────────┘     └─────────────────┘  │
│                                │                   │             │
│  ┌─────────────┐     ┌──────────────┐           │             │
│  │  OFFLINE    │     │   DATA       │     ┌─────────────────┐  │
│  │   STORAGE   │◀────│   LAYER      │◀────│   DATABASE      │  │
│  │             │     │              │     │                 │  │
│  │ - localStorage          │     │ - Patient Records │  │
│  │ - Sync Queue                │     │ - Referrals     │  │
│  └─────────────┘     └──────────────┘     │ - Facilities  │  │
│                                            │ - Follow-ups  │  │
│  ┌─────────────┐     ┌──────────────┐     └─────────────────┘  │
│  │   AI ENGINES│     │   SERVICES   │                      │
│  │             │     │              │     ┌─────────────────┐  │
│  │ - Triage    │     │ - SMS        │     │   EXTERNAL      │  │
│  │ - Matching  │     │ - Notifications │  │   INTEGRATIONS  │  │
│  │ - Analytics │     │ - Reminders  │     │ - HL7/FHIR      │  │
│  └─────────────┘     └──────────────┘     │ - EMR Systems   │  │
│                                            │ - Labs          │  │
│                                            └─────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Architecture Highlights

- **Frontend:** Next.js 15 with React Server Components
- **State Management:** React Context API with localStorage persistence
- **Styling:** Tailwind CSS with Radix UI components
- **Data Layer:** Simulated database layer (demo mode)
- **Offline Support:** Service Worker with background sync
- **Security:** Role-based access control, session management

---

## 6. Key Features

### 6.1 Digital Triage Engine

**Purpose:** Risk stratification and automated decision support

**Capabilities:**
- Real-time risk assessment (LOW/MEDIUM/HIGH/CRITICAL)
- Automated priority escalation
- Clinical decision support algorithms
- Integration with vital signs data

**Example:** Ravi Kumar's hypertension case flagged as CRITICAL with SpO2 91%

### 6.2 Closed-Loop Referral Tracking

**Purpose:** End-to-end patient journey from PHC to District Hospital and back

**Tracking Stages:**
1. Patient Registered
2. Triage Completed
3. Digital Consultation
4. Specialist Referral Created
5. Referral Accepted
6. Appointment Booked
7. Patient Arrived
8. Diagnostics Completed
9. Treatment Provided
10. Follow-up Scheduled
11. Follow-up Completed
12. Case Closed

### 6.3 Facility Finder & Matching

**Key Features:**
- Service availability checking before referral
- Medicine stock status visibility
- Diagnostic equipment availability
- Distance-based matching algorithm
- Real-time queue length indicators

### 6.4 Multilingual Support

Supported Languages:
- English (default)
- Telugu (తెలుగు)
- Hindi (हिंदी)

**Implementation:**
- i18next for translation management
- Locale-aware formatting for dates/numbers
- Right-to-left support for future expansion

### 6.5 Offline-First Architecture

**Features:**
- Full local data storage via localStorage
- Automatic sync when connectivity restored
- Conflict resolution for offline edits
- IndexedDB support for larger datasets (future)

### 6.6 Emergency Care Management

**Capabilities:**
- Real-time emergency case detection
- Nearest facility routing
- Ambulance dispatch integration (planned)
- Priority escalation workflows

### 6.7 Quality & Analytics Dashboard

**KPIs Tracked:**
- Patients TODAY (84 in demo)
- Pending Referrals (8)
- Follow-ups Due (17)
- High-Risk Patients under monitoring (5)
- Medicine Alerts (4)
- Diagnostics Unavailable (3)
- Average Waiting Time (34 min)
- Referral Completion Rate (82%)

---

## 7. Technology Stack

### Frontend Technologies

| Component | Technology | Version |
|-----------|------------|---------|
| Framework | Next.js | 15.1.0 |
| Runtime | React | 19.0.0 |
| Language | TypeScript | 5.7.2 |
| Styling | Tailwind CSS | 4.0.0 |
| UI Library | Radix UI | Components |
| Icons | Lucide React | 0.468.0 |
| State | React Context | - |
| Data Fetch | SWR/React Query | Planned |
| Forms | React Hook Form | 7.53.0 |
| Validation | Zod | 3.23.8 |
| Charts | Recharts | 2.13.0 |
| i18n | i18next | 23.15.0 |

### Backend/Infrastructure

| Component | Technology |
|-----------|------------|
| API Layer | Next.js App Router |
| Database | Simulated (demo mode) |
| Auth | Session-based |
| Storage | localStorage/IndexedDB |

### DevOps & Deployment

| Component | Technology |
|-----------|------------|
| Container | Docker |
| CI/CD | GitHub Actions (planned) |
| Hosting | Vercel (recommended), Docker, or Node.js server |

---

## 8. Implementation Details

### 8.1 Data Models

**Patient Record:**
```typescript
{
  id: string;              // P-1042
  name: string;            // Ravi Kumar
  age: number;            // 54
  gender: 'male' | 'female' | 'other';
  village: string;        // Rampur
  phone: string;          // +91-9876543210
  primaryCondition: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  careStage: CareStage;   // 'follow-up'
  vitals?: Vitals;
  medicalHistory: string[];
  assignedWorker: string;
}
```

**Referral:**
```typescript
{
  id: string;              // REF-10234
  patientId: string;      // P-1042
  reason: string;
  specialty: string;        // Cardiology
  urgency: 'routine' | 'priority' | 'emergency';
  status: ReferralStatus;
  timeline: ReferralTimelineEntry[];
}
```

### 8.2 Care Stage Management

```
[Registered] → [Triaged] → [Consulted] → [Referred] → 
[Appointment] → [Arrived] → [Treated] → [Follow-up] → [Closed]
```

Each stage has:
- Status indicator
- Timestamp
- Assigned user
- Required actions

### 8.3 Risk Stratification Algorithm

**HIGH RISK Indicators:**
- Age > 50 with chronic conditions
- Vital signs abnormal
- Comorbidities present
- Emergency symptoms

**AUTOMATED PRIORITIZATION:**
- Critical patients → Immediate attention
- High-risk → Priority queue
- Medium → Routine monitoring
- Low → Standard care

---

## 9. Demo Walkthrough

### Access Points

1. **Homepage:** Visit `/login` or click "Explore Platform"
2. **Role Selection:** Choose from 5 user roles
3. **Demo Mode:** Use instant sign-in for quick testing

### Recommended Demo Journey

**Step 1: Login as Health Worker**
- Name: Asha Lakshmi
- Role: Health Worker (ASHA)
- Facility: PHC A - Rampur
- Worker ID: HW-98765

**Step 2: View Dashboard**
- See today's patients (84)
- Check pending referrals (8)
- Review high-risk alerts (5)

**Step 3: Digital Triage**
- Register new patient or view existing
- Input vital signs
- Receive risk assessment

**Step 4: Referral Process**
- Create referral to District Hospital
- Track acceptance and appointment
- Monitor patient journey completion

**Step 5: Follow-up Management**
- View due follow-ups
- Mark as completed
- Schedule new follow-ups

### Key Demo Cases Included

1. **Ravi Kumar (P-1042)** — Full closed-loop journey, hypertension to cardiology
2. **Fatima Begum (P-1043)** — High-risk pregnancy referral
3. **Venkat Rao (P-1044)** — Diabetes with complications
4. **Meena Devi (P-1045)** — Missed appointment case

---

## 10. Future Enhancements

### Phase 2 (Post-Hackathon)

1. **Real Backend Integration**
   - HL7/FHIR compliant API
   - HIPAA-compliant data storage
   - Real patient data import

2. **Teleconsultation Module**
   - Web-based video consultation
   - Audio-only option for low-bandwidth
   - Doctor notes sharing

3. **SMS/WhatsApp Integration**
   - Patient appointment reminders
   - Follow-up task notifications
   - Health education messages

4. **Advanced Analytics**
   - Predictive risk modeling
   - Resource utilization forecasting
   - Population health dashboards

5. **Mobile Application**
   - Progressive Web App (PWA) optimization
   - Native mobile app for ASHA workers
   - Offline map integration

### Phase 3 (Scale-up)

1. **AI-Powered Insights**
   - Clinical decision support
   - Drug interaction checking
   - Outcome prediction models

2. **Interoperable Systems**
   - Integration with existing EMRs
   - State health database sync
   - Insurance claim processing

3. **Community Features**
   - Patient rating system
   - Health education library
   - Tele-nutrition program

---

## 11. Team & Contact

### Project Team

**Lead Developer:** Claude (AI Assistant)  
**Collaboration:** Built with Claude Code capabilities  
**Framework:** Next.js 15 with full-stack TypeScript  

### Technical Contact
- GitHub: https://github.com/your-repo/ruralcare-360 (to be created)
- LinkedIn: Available via project repository

### Project Repository
- Framework: Next.js 15 (App Router)
- Build: `npm run build`
- Dev: `npm run dev`
- Lint: `npm run lint`

---

## Appendix A: Demo Data Summary

### Current Demo Dataset

| Entity Type | Count | Sample IDs |
|-------------|-------|------------|
| Patients | 9 | P-1042, P-1043, P-1044, P-1045, P-1046, P-1047, P-1048, P-1049 |
| Referrals | 4 | REF-10234, REF-10235, REF-10236, REF-10237 |
| Facilities | 3 | FAC-001 (PHC), FAC-002 (Rural Hosp), FAC-003 (District Hosp) |
| Follow-ups | 6 | FU-001 through FU-006 |
| Notifications | 8 | Emergency, Warning, Info, Success types |

---

## Appendix B: Deployment Instructions

### Option 1: Vercel (Recommended)

```bash
git clone <repository-url>
cd ruralcare-360
npm install
vercel
```

### Option 2: Docker

```bash
docker build -t ruralcare-360 .
docker run -p 3000:3000 ruralcare-360
```

### Option 3: Local Server

```bash
npm install
npm run build
npm run start
```

---

## Appendix C: Security Considerations

- Role-based access control
- Session management with localStorage
- Input validation with Zod
- Secure headers (X-Frame-Options, CSP, etc.)
- PIN-based authentication for demo

---

**Document Version:** 1.0  
**Last Updated:** November 2026  
**Project:** RuralCare 360 — Smart India Hackathon 2026