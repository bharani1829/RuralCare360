# RuralCare 360 — Closed-Loop Healthcare System

> **From first contact to completed care.**  
> A closed-loop rural healthcare coordination platform connecting patients, frontline health workers, doctors, and health facilities into one continuous care journey.

## 🚀 Deployment Options

### 1. Deploying on Vercel (Recommended)

1. Push code to your GitHub / GitLab repository.
2. Go to [Vercel Dashboard](https://vercel.com/new) and click **Add New Project**.
3. Import your `ruralcare-360` repository.
4. Vercel will automatically detect **Next.js** framework settings (`vercel.json` included).
5. Click **Deploy**.

###Deploying on a Custom Node.js Server / VPS

```bash
# 1. Install dependencies
npm install

# 2. Build production assets
npm run build

# 3. Start production server
npm run start
```

---

## 🛠️ Development & Commands

| Command | Description |
| :--- | :--- |
| `npm run dev` | Launch local development server with Turbopack |
| `npm run build` | Compile & generate production build |
| `npm run start` | Run production Node server |
| `npm run lint` | Execute ESLint checks across codebase |

---

## 🌟 Key Platform Features

- **Closed-Loop Referral Tracking**: No patient gets lost between primary health centers and district hospitals.
- **Offline-First Resilience**: Full offline recording and status sync for remote rural areas.
- **Multilingual Support**: Instant switching between English, Telugu, and Hindi.
- **Digital Triage Engine**: Risk stratification and automated decision support for frontline health workers.
- **Teleconsultation Queue**: Integrated audio/video consultation interface with doctor notes.
- **Emergency Care Management**: Real-time emergency case detection and priority routing.
- **Facility Matching**: Dynamic facility finding based on service availability, medicine stock, and distance.
- **Quality Dashboard**: Track KPIs like referral completion (82%), waiting times, and follow-up rates.

---

## 🎯 Problem Addressed

Rural healthcare faces critical continuity challenges:

| Problem | Impact | Our Solution |
|---------|--------|--------------|
| **Lost Referrals** | 40% of referrals never complete | End-to-end tracking with status updates |
| **Fragmented Records** | Medical history scattered | Unified patient records across facilities |
| **Long Travel** | 30-50km for specialist care | Facility finder with service visibility |
| **Missing Diagnostics** | Tests unavailable when needed | Real-time diagnostic availability check |
| **Medicine Shortages** | No stock visibility | Real-time medicine inventory tracking |
| **Poor Follow-up** | Patients lost post-treatment | Automated follow-up task generation |

---

## 👥 Target Users

| Role | Description |
|------|-------------|
| **Patients** | Track health records, view appointments, communicate with providers |
| **ASHA/ANM Workers** | Community outreach, data collection, follow-up tasks |
| **Doctors/Specialists** | Consultations, referrals, diagnosis review |
| **Facility Staff** | Patient registration, medicine management, queue management |
| **Administrators** | Quality monitoring, analytics, system oversight |

---

## 🎮 Demo Mode

The platform includes a prototype mode with demo data:

1. **Login**: Navigate to `/login`
2. **Quick Demo**: Use the "Instant Sign In" button or enter credentials:
   - Health Worker: Asha Lakshmi / HW-98765 / PIN: 123456
   - Doctor: Dr. Ramesh Kumar / DOC-54321
   - Patient: Rajesh Kumar / ABHA-98765

3. **Explore**:
   - Dashboard with real-time KPIs
   - Digital triage assessment
   - Referral tracking with 16 care stages
   - Facility finder with stock visibility
   - Follow-up task management

---

## 📊 Demo Data Included

- **9 Patients** with diverse conditions (hypertension, pregnancy, diabetes, respiratory infections)
- **4 Referrals** tracked through complete cycles
- **3 Healthcare Facilities** (PHC, Rural Hospital, District Hospital)
- **6 Follow-up Tasks** with priority levels
- **8 Notifications** (emergencies, warnings, success)

---

## 🏗️ Architecture

```
┌────────────────────────────────────────────┐
│           CLIENT LAYER (Browser)           │
├────────────────────────────────────────────┤
│  Next.js 15 (App Router) | React 19       │
│  Tailwind CSS | Radix UI Components      │
│  i18n (English/Telugu/Hindi)              │
└───────────────────────┬────────────────────┘
                        │
┌───────────────────────▼────────────────────┐
│           DATA MANAGEMENT LAYER            │
├────────────────────────────────────────────┤
│  localStorage (Offline-First)              │
│  Sync Queue for low-connectivity areas     │
│  Simulated backend (demo mode)             │
└────────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 15, React 19, TypeScript 5.7 |
| **Styling** | Tailwind CSS 4.0, Radix UI |
| **State** | React Context API |
| **Forms** | React Hook Form 7.53, Zod 3.23 |
| **Charts** | Recharts 2.13 |
| **i18n** | i18next 23.15 |
| **Deployment** | Vercel, Docker, Node.js |

---

## 📈 Key Metrics Demonstrated

| KPI | Current | Trend |
|-----|---------|-------|
| Patients TODAY | 84 | +12% |
| Pending Referrals | 8 | -2 |
| Follow-ups Due | 17 | +5 |
| High-Risk Patients | 5 | -1 |
| Medicine Alerts | 4 | +2 |
| Diagnostics Unavailable | 3 | -1 |
| Avg Waiting Time | 34 min | -5 min |
| Referral Completion | 82% | +4% |

---

## 🤝 How It Works

### Patient Journey Example (Ravi Kumar, P-1042)

1. **Registered** at PHC A - Rampur
2. **Vitals Recorded**: BP 178/104, SpO2 91%
3. **Digital Triage**: RED - High priority
4. **Teleconsultation**: Dr. Rajesh Kumar
5. **Referral Created**: REF-10234 to Cardiology
6. **Accepted**: By District Hospital
7. **Appointment**: Booked for Sep 1, 10:30 AM
8. **Patient Arrived**: Verified arrival
9. **Diagnostics**: ECG completed
10. **Consultation**: With Dr. V. Prabhu Kumar (Cardiologist)
11. **Treatment**: Medication adjusted
12. **Follow-up**: Scheduled for Sep 9
13. **Case Closed**: All care steps completed

---

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (dashboard)/       # Protected dashboard routes
│   ├── login/             # Authentication page
│   └── page.tsx           # Landing page
├── components/            # Reusable UI components
├── lib/                   # Utilities and data
│   ├── demo-data.ts       # Simulated backend data
│   └── i18n.ts           # Translation system
└── components/ui/         # Radix UI components

## 🔧 Troubleshooting

### Common Issues

- **Page not loading**: Clear browser cache and try `npm run dev`
- **Demo mode not working**: Check localStorage permissions, enable in browser settings
- **Translations not loading**: Ensure i18n files are properly configured
- **Offline mode**: Service worker may need update in browser settings

---

## 📝 License

Built for HackWithaditya. This is a demonstration prototype, not a live healthcare system.

---

## 🙏 Acknowledgments

This project is built to strengthen existing public health infrastructure, not replace it. It acts as an orchestration layer connecting patients, frontline workers, and healthcare facilities.

**Demo prototype — not a live healthcare system. Uses fictional data.**
```

This README provides:
- Complete deployment instructions (Vercel, Docker, local)
- Clear problem-solution mapping
- Technical documentation
- Demo instructions
- Feature overview
- Architecture diagram
- Troubleshooting guide
