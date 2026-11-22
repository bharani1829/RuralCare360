# RuralCare 360 — Closed-Loop Healthcare System

> **From first contact to completed care.**
> A closed-loop rural healthcare coordination platform connecting patients, frontline health workers, doctors, and health facilities into one continuous care journey.

---

## 🚀 Deployment Options

### 1. Deploying on Vercel (Recommended)

1. Push code to your GitHub / GitLab repository.
2. Go to [Vercel Dashboard](https://vercel.com/new) and click **Add New Project**.
3. Import your `ruralcare-360` repository.
4. Vercel will automatically detect **Next.js** framework settings (`vercel.json` included).
5. Click **Deploy**.

---

### 2. Deploying with Docker (Containerized)

To build and run RuralCare 360 inside a Docker container:

```bash
# Build the Docker image
docker build -t ruralcare-360 .

# Run the container on port 3000
docker run -p 3000:3000 ruralcare-360
```

---

### 3. Deploying on a Custom Node.js Server / VPS

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
