# 🖊️ Inkloom AI — Intelligent Brand Governance Platform

> **Hackathon 2026 Submission** | Built with React, Vite, Tailwind CSS, Express, MongoDB Atlas, and Python NLP.

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite%20%2B%20Tailwind-142B4A)](https://github.com/Abhimancoder/inkloom-ai)
[![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-176B59)](https://github.com/Abhimancoder/inkloom-ai)
[![Database](https://img.shields.io/badge/Database-MongoDB%20Atlas-2E7D32)](https://github.com/Abhimancoder/inkloom-ai)
[![Theme](https://img.shields.io/badge/Theme-Inkloom%20Studio-142B4A)](#-fixed-ui-theme--inkloom-studio)

---

## 📌 Problem & Purpose
Organizations struggle to keep brand communications consistent, accurate, and compliant across distributed teams, external marketing agencies, and generative AI content tools. Common issues include off-brand tone, unverified superlative claims, restricted phrases, and slow manual legal sign-off.

**Inkloom AI** provides an automated brand-governance workflow:
1. **Scans Content Before Publication:** Flags restricted phrases, missing mandatory terms, and excessive promotional hype.
2. **Transparent Evidence:** Surfaces exact surrounding excerpts, matched brand rules, reasons, and suggested replacements.
3. **Preserves Original Drafts:** Suggested corrections never silently overwrite copy.
4. **Human Review Gate:** No automated publishing. A human reviewer retains the final sign-off power (Approve, Request Changes, Dismiss).

---

## 🎨 Fixed UI Theme — Inkloom Studio
Inkloom Studio follows a locked design system engineered for readability and high contrast:
* **Primary Navy:** `#142B4A` (Navigation, headings, primary buttons)
* **Brand Green:** `#176B59` (Accent highlights, secondary actions)
* **Page Background:** `#F5F7FA` (Light clean workspace)
* **Cards & Panels:** `#FFFFFF` (White elevated cards)
* **Main Text:** `#202833` (High-contrast dark charcoal)
* **Critical Issue:** `#C62828` (Strict violations / restricted phrases)
* **Warning / Needs Review:** `#B7791F` (Unverified claims / missing terms)
* **Passed Check:** `#2E7D32` (Compliant brand elements)

---

## 🏗️ Architecture & Technology Stack

| Layer | Technology | Role |
|---|---|---|
| **Frontend** | React 19 + Vite 8 | Single-page application, interactive dashboard & review queue |
| **Styling** | Tailwind CSS v4 | Responsive layout adhering to Inkloom Studio palette |
| **Icons** | Lucide React | Clean, semantic UI icons |
| **API Client** | Axios | Frontend-to-backend communication with offline fallback |
| **Backend** | Node.js + Express.js | REST APIs, deterministic rule coordination, CORS |
| **Database** | MongoDB Atlas + Mongoose | Cloud document persistence for guidelines, checks, & findings |
| **AI / NLP** | Python 3.12 Standard Library | Readability (Flesch score), statistical hype analysis, tone scoring |
| **Version Control** | Git + GitHub | Public open-source repository |

---

## 📂 Repository Structure
```text
inkloom-ai/
├── frontend/               # React + Vite + Tailwind frontend application
│   ├── src/
│   │   ├── components/     # Reusable layout: Header, Sidebar
│   │   ├── data/           # Structured seed / sample demonstration data
│   │   ├── services/       # Axios API client (api.js)
│   │   ├── views/          # Core pages (Dashboard, NewCheck, Findings, Guidelines, ReviewQueue, LandingPage)
│   │   ├── App.jsx         # Primary router & state coordination
│   │   └── index.css       # Tailwind theme definitions
│   └── vite.config.js
├── backend/                # Node.js + Express.js API backend
│   ├── config/             # Mongoose MongoDB Atlas connection (db.js)
│   ├── models/             # Mongoose schemas: BrandProfile, ContentCheck, Finding, ReviewDecision
│   ├── routes/             # REST API endpoints (profiles, checks, reviews)
│   ├── services/           # Deterministic audit engine (auditService.js)
│   └── server.js           # Server entry point
├── ai-service/             # Python NLP microservice (main.py, port 8000)
├── .env.example            # Environment template without secrets
├── .gitignore              # Protects secrets & node_modules
└── README.md
```

---

## 🚀 Quickstart: Run Locally in 3 Steps

### Prerequisites
* **Node.js LTS** (v20+ or v24)
* **Python 3.10+** (Python 3.12 tested)
* **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/Abhimancoder/inkloom-ai.git
cd inkloom-ai
```

### 2. Start Backend & Database
```bash
cd backend
npm install
# Configure your MongoDB URI in backend/.env (refer to .env.example)
npm run dev
```
👉 Backend runs on: `http://localhost:5000` (Health check: `/api/health`)

### 3. Start Frontend & AI Service (in separate terminal tabs)
```bash
# Terminal Tab 2: Start Frontend
cd frontend
npm install
npm run dev
```
👉 Frontend runs on: `http://localhost:5173`

```bash
# Terminal Tab 3 (Optional): Start Python NLP Service
cd ai-service
python main.py
```
👉 AI Service runs on: `http://localhost:8000` (Health check: `/health`)

---

## 👥 Team Roles & Contributions
* **Member 1 (User / Abhiman):** Product Design & UI/UX Lead. User journeys, design system, responsive card layouts, Findings screen architecture, review queue workflow, and application flow.
* **Member 2:** Frontend Developer. React components, Vite configuration, Axios integration, and client-side deterministic verification.
* **Member 3 (Pranav Sharma):** Backend & AI Developer. Express REST APIs, Mongoose data models, MongoDB Atlas connection, and Python FastAPI/NLP microservice.

---

## ⚖️ Safety, Privacy & Honest AI Principles
* **Evidence Before Claims:** Every flagged issue displays the exact surrounding excerpt and cited guideline.
* **Deterministic Baseline:** Restricted buzzwords and mandatory brand names are validated deterministically first. If the Python AI service is unreachable, the system gracefully falls back to deterministic checks with zero user disruption.
* **Zero Secret Leaks:** All database credentials and private tokens are isolated in server `.env` files and strictly excluded from version control.
* **Human in the Loop:** Inkloom AI provides decision assistance, not automated publishing.
