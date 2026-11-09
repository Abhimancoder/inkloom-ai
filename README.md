# 🖊️ Inkloom AI — Intelligent Brand Governance Platform

> **CodeNexus 2026 Submission** | Built with React 19, Vite 8, Tailwind CSS v4, Express, MongoDB Atlas, and Python NLP.

🌐 **Live Deployed Product:** [https://inkloom-ai-snowy.vercel.app/](https://inkloom-ai-snowy.vercel.app/)  
📁 **Public Source Code:** [https://github.com/Abhimancoder/inkloom-ai](https://github.com/Abhimancoder/inkloom-ai)

[![Live Demo](https://img.shields.io/badge/Live_Demo-inkloom--ai--snowy.vercel.app-176B59?style=for-the-badge&logo=vercel)](https://inkloom-ai-snowy.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub_Repository-Abhimancoder%2Finkloom--ai-142B4A?style=for-the-badge&logo=github)](https://github.com/Abhimancoder/inkloom-ai)
[![Round 3](https://img.shields.io/badge/Round_3-Multi--Modal%20%2B%20RAG%20%2B%20Webhooks-2E7D32?style=for-the-badge)](https://github.com/Abhimancoder/inkloom-ai)
[![Frontend](https://img.shields.io/badge/Frontend-React%2019%20%2B%20Vite%20%2B%20Tailwind-142B4A)](https://github.com/Abhimancoder/inkloom-ai)
[![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-176B59)](https://github.com/Abhimancoder/inkloom-ai)
[![Database](https://img.shields.io/badge/Database-MongoDB%20Atlas-2E7D32)](https://github.com/Abhimancoder/inkloom-ai)

---

## 📌 Problem & Purpose
Organizations struggle to keep brand communications consistent, accurate, and compliant across distributed teams, external marketing agencies, and generative AI content tools. Common issues include off-brand tone, unapproved visual color palettes, low WCAG contrast, unverified superlative claims, restricted phrases, and slow manual legal sign-off.

**Inkloom AI** provides an end-to-end multi-modal brand governance workflow:
1. **Multi-Modal Content Auditing:** Scans text copy and visual graphics (PNG, JPG, WEBP) in one unified audit.
2. **Visual Palette & WCAG Contrast Evaluation:** Extracts dominant HEX colors, calculates WCAG 2.1 contrast ratios against AA (4.5:1) and AAA (7:1) thresholds, and flags unapproved colors.
3. **Contextual RAG Re-writing:** Retrieves brand-isolated approved copy examples and generates full context-aware sentence rewrites while strictly preserving numbers, percentages, and facts.
4. **Mandatory Human Review Gate:** AI assists, but a human reviewer retains final approval authority.
5. **Headless CMS & Slack Connectors:** Human approval automatically dispatches formatted alerts to Slack and synchronizes drafts with HubSpot and WordPress (draft-only; zero auto-publish).

---

## 🚀 The Three Round 3 Major Improvements

### 1. Multi-Modal Visual Brand Governance (Asset & Color Palette Auditing)
* **Image Uploads:** Accepts PNG, JPG/JPEG, and WEBP graphic assets up to 10MB with server-side MIME and extension validation.
* **Dominant Color Extraction:** Extracts dominant color swatches and calculates surface percentage breakdown.
* **Palette Compliance:** Compares extracted colors with approved guidelines using Euclidean delta-distance tolerance.
* **WCAG 2.1 Contrast Ratio Engine:** Calculates mathematical relative luminance and contrast ratios between foreground and background elements.
* **Honest Logo Clear-Space:** When a reference logo is missing or bounding box detection is uncertain, reports an honest **"Needs manual review"** status (never fakes an automated measurement).

### 2. Domain-Specific Contextual RAG Re-writing Engine
* **Approved Copy Library:** Maintains a curated corpus of verified, high-performing brand copy. Only records with `isApproved: true` enter retrieval.
* **Brand-Isolated Retrieval:** Queries strictly within the selected `brandProfileId` to prevent cross-brand data leakage.
* **Context-Aware Paragraph Rewrites:** Replaces restricted superlative claims with full, natural alternatives aligned with the company tone.
* **Strict Fact & Constraint Preservation:** Regex extraction safeguards numbers (`100%`, `60%`), pricing (`$50M`), and compliance claims (`SOC-2`, `ISO 27001`).
* **Side-by-Side Comparison:** Interactive modal displays original vs. AI suggested rewrite with cited brand proof snippets.

### 3. Headless CMS & Collaboration Webhook Connectors (HubSpot, WordPress & Slack)
* **Strict Human Approval Gate:** Webhooks are triggered **only** upon an explicit **"Approve Content"** decision in the Review Queue. Pending or rejected drafts never fire events.
* **Slack Connector:** Dispatches formatted Block Kit cards with title, channel, reviewer notes, and audit status.
* **HubSpot & WordPress Connectors:** Synchronizes content strictly as **Drafts** (`status="draft"`). Public publication requires human CMS admin action.
* **Idempotency & Duplicate Prevention:** Idempotency keys prevent double-dispatch if an item is approved multiple times.
* **First-Class Simulation Mode:** Supports offline/demo testing without requiring live paid third-party API keys.

---

## 🎨 Fixed UI Theme — Inkloom Studio
Inkloom Studio follows a locked design system engineered for readability and high contrast:
* **Primary Navy:** `#142B4A` (Navigation, headings, primary buttons)
* **Brand Green:** `#176B59` (Accent highlights, secondary actions)
* **Page Background:** `#F5F7FA` (Light clean workspace)
* **Cards & Panels:** `#FFFFFF` (White elevated cards)
* **Main Text:** `#202833` (High-contrast dark charcoal)
* **Critical Issue:** `#C62828` (Strict violations / unapproved colors)
* **Warning / Needs Review:** `#B7791F` (Low contrast / missing terms / logo review)
* **Passed Check:** `#2E7D32` (Compliant brand elements)

---

## 🏗️ Architecture & Technology Stack

| Layer | Technology | Role |
|---|---|---|
| **Frontend** | React 19 + Vite 8 | Single-page application, interactive dashboard, RAG rewrite drawer, review queue |
| **Styling** | Tailwind CSS v4 | Responsive layout adhering to Inkloom Studio palette |
| **Icons** | Lucide React | Clean, semantic UI icons |
| **API Client** | Axios | Frontend-to-backend communication with offline fallback |
| **Backend** | Node.js v24 + Express | REST APIs, deterministic rule coordination, multer upload handling, CORS |
| **Image Engine** | colorthief + sharp | Dominant color extraction, sRGB pixel decoding |
| **Database** | MongoDB Atlas + Mongoose | Cloud document persistence for guidelines, checks, findings, copy library, and webhooks |
| **AI / NLP** | Python 3.12 Standard Library | Readability (Flesch score), statistical hype analysis, tone scoring |
| **Version Control** | Git + GitHub | Public open-source repository |

---

## 📂 Repository Structure
```text
inkloom-ai/
├── frontend/               # React 19 + Vite + Tailwind frontend application
│   ├── src/
│   │   ├── components/     # Reusable layout: Header, Sidebar
│   │   ├── data/           # Structured seed / sample demonstration data
│   │   ├── services/       # Axios API client (api.js)
│   │   ├── views/          # Core pages:
│   │   │   ├── DashboardView.jsx
│   │   │   ├── NewCheckView.jsx          # Visual asset upload + text submission
│   │   │   ├── FindingsView.jsx          # Unified findings + RAG rewrite modal
│   │   │   ├── BrandGuidelinesView.jsx
│   │   │   ├── ApprovedCopyView.jsx      # Approved copy library corpus
│   │   │   ├── ReviewQueueView.jsx       # Human approval gate with webhook trigger
│   │   │   ├── IntegrationsView.jsx      # Connector settings & dispatch audit trail
│   │   │   └── LandingPageView.jsx
│   │   ├── App.jsx         # Primary router & state coordination
│   │   └── index.css       # Tailwind theme definitions
│   └── vite.config.js
├── backend/                # Node.js + Express.js API backend
│   ├── config/             # Mongoose MongoDB Atlas connection (db.js)
│   ├── models/             # Mongoose schemas:
│   │   ├── BrandProfile.js       # Extended with approved palette & contrast targets
│   │   ├── ContentCheck.js       # Extended with visual asset metadata
│   │   ├── Finding.js            # Extended with visual findings
│   │   ├── ApprovedCopy.js       # RAG approved copy library corpus
│   │   ├── IntegrationConfig.js  # Slack, HubSpot, WordPress connector settings
│   │   ├── WebhookEvent.js       # Idempotent webhook delivery audit trail
│   │   └── ReviewDecision.js
│   ├── routes/             # REST API endpoints (profiles, checks, reviews, approved-copy, rewrites, integrations)
│   ├── services/           # Backend services:
│   │   ├── auditService.js       # Deterministic text governance engine
│   │   ├── visualAuditService.js # Dominant color extraction & WCAG contrast math
│   │   ├── ragRewriteService.js  # Contextual RAG rewriter & fact preservation
│   │   └── webhookService.js     # Webhook dispatcher with idempotency & simulation
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
npm run dev
```
*(Backend runs on `http://localhost:5000`)*

### 3. Start Optional Python NLP Service & Frontend
```bash
# Terminal 2: Python AI Service
cd ai-service
python main.py

# Terminal 3: Frontend Client
cd frontend
npm install
npm run dev
```
*(Frontend runs on `http://localhost:5173`)*

---

## 🧪 Verification & Testing Checklist

| Test Case | Description | Result |
|---|---|---|
| **Frontend Production Build** | `npm run build` client compilation | **PASSED** (2,124 modules in 1.75s, 0 errors) |
| **Backend Syntax Check** | `node --check` across all routes, services, and models | **PASSED** (17 files verified) |
| **WCAG Contrast Ratio Engine** | Tested pure black/white (21:1), navy/white (14.25:1), low contrast (1.07:1) | **PASSED** (100% mathematical accuracy) |
| **Dominant Color Extraction** | Extracted palette from `01_Landing_Page.jpg` | **PASSED** (Extracted #0E253B, #EDEFF4, #006D5A) |
| **Fact & Number Preservation** | Verified `100%`, `60%`, `$50M`, `SOC-2`, and `500+ enterprises` preserved | **PASSED** (Zero dropped constraints) |
| **Contextual RAG Rewrite** | Generated multi-sentence enterprise alternative addressing "cheap" | **PASSED** (Objective, verified wording generated) |
| **Human Approval Gate** | Tested that "Changes Requested" blocks webhooks; "Approved" dispatches | **PASSED** (Zero unauthorized dispatches) |
| **Webhook Idempotency** | Tested that duplicate approval does not fire duplicate webhooks | **PASSED** (Duplicate prevented via idempotency key) |

---

## 👥 Team Roles & Contributions
* **Abhiman Singh (UI/UX & Product Lead):** End-to-end user journey design, multi-modal findings UX, RAG comparison drawer, review queue workflow, design system adhering to locked Inkloom Studio colors.
* **Member 2 (Frontend Developer):** React 19 component architecture, Axios API integration, visual asset uploader, Approved Copy Library view, and live webhook status UI.
* **Pranav Sharma (Backend & AI Developer):** Express REST endpoints, MongoDB Mongoose schemas, WCAG contrast calculation service, RAG keyword-retrieval engine, and webhook dispatcher.
