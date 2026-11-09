# 🏆 Inkloom AI — Official Final Hackathon Submission Dossier

**CodeNexus 2026 Hackathon | Intelligent Brand Governance Platform**

---

## 1. Project Links & Repositories

| Deliverable | URL / Reference | Description |
| :--- | :--- | :--- |
| **🌐 Live Deployed Application** | [inkloom-ai-snowy.vercel.app](https://inkloom-ai-snowy.vercel.app/) | Production frontend deployed on Vercel |
| **📁 Source-Code Repository** | [github.com/Abhimancoder/inkloom-ai](https://github.com/Abhimancoder/inkloom-ai) | Public GitHub repo (`main` branch) |
| **🗄️ Database Cluster** | MongoDB Atlas (Cloud Cluster 0) | Dedicated multi-tenant document database |
| **📄 Team & Presentation ID** | Team Name: `ryanmishra4551` \| Team ID: `%65` | Shri Ramswaroop Memorial University |

---

## 2. Completed Improvements List (Round 3 Deliverables)

We have delivered all three promised Round 3 improvements with zero dropped constraints, plus full-stack governance enhancements:

```
┌────────────────────────────────────────────────────────────────────────┐
│                      INKLOOM AI WORKFLOW PIPELINE                      │
├────────────────────────────────────────────────────────────────────────┤
│ 1. Submission: Text Draft + Graphic Image Asset (PNG, JPG, WEBP)       │
│ 2. Unified Audit: Rules + ColorThief Swatches + WCAG Contrast Engine   │
│ 3. Findings Dashboard: Violation Excerpts + WCAG Compliance Status     │
│ 4. Contextual RAG Rewriter: Brand-Isolated Corpus + Fact Safeguards    │
│ 5. Review Queue: Mandatory Human Approval Authorization Gate           │
│ 6. Automated Dispatch: Idempotent Slack Alerts + CMS Draft Sync        │
└────────────────────────────────────────────────────────────────────────┘
```

### Improvement 1: Multi-Modal Visual Brand Governance & Asset Auditing
* **Multi-Format Graphic Asset Ingestion:** Handles PNG, JPG/JPEG, and WEBP uploads up to 10MB using server-side Multer with MIME and extension validation.
* **Dominant Color Extraction:** Uses ColorThief and Sharp to extract dominant HEX colors and calculate percentage distribution.
* **Palette Adherence:** Compares extracted colors against approved brand tokens with Euclidean color-space distance.
* **Mathematical WCAG 2.1 Contrast Engine:** Calculates relative luminance to verify contrast ratios against Level AA (4.5:1) and AAA (7.0:1) thresholds.
* **Honest Logo Clear-Space:** Transparently reports "Needs Manual Review" when bounding boxes or reference templates are ambiguous, never fabricating automated measurements.

### Improvement 2: Domain-Specific Contextual RAG Re-writing Engine
* **Curated Approved Copy Corpus:** Dedicated MongoDB collection of gold-standard, compliant copy examples. Only records with `isApproved: true` are indexed.
* **Brand-Isolated Retrieval:** Queries strictly match the target `brandProfileId` to prevent cross-brand leakage.
* **Context-Aware Paragraph Rewrites:** Rewrites non-compliant claims into enterprise-grade alternatives while preserving the original intent.
* **Strict Fact & Constraint Preservation:** Regex guards lock numbers (`100%`, `60%`), currency amounts (`$50M`), and compliance claims (`SOC-2`, `ISO 27001`).
* **Side-by-Side Comparison UI:** Interactive modal displays original text, rewritten copy, preserved facts, and cited brand proof snippets.

### Improvement 3: Headless CMS & Collaboration Webhook Connectors
* **Strict Human Approval Gate:** Webhooks dispatch **only** when a human explicitly selects "Approve" in the Review Queue. Pending or rejected drafts never trigger external dispatches.
* **Slack Collaboration Connector:** Formats and delivers Block Kit cards featuring audit scores, reviewer identity, and notes.
* **HubSpot & WordPress Draft Connectors:** Creates draft objects (`post_status="draft"`); zero auto-publishing without a human editor.
* **Idempotency Safeguard:** Custom idempotency keys (`idem_{checkId}_{provider}_approved`) prevent duplicate payouts or double-posting.
* **First-Class Simulation Mode:** Supports offline/demo testing without requiring third-party API keys.

### Bonus Full-Stack Additions
* **Continuous Monitoring Surveillance:** Automated channel scan engine for websites, LinkedIn, and ad creative.
* **Compliance Certification & Reports:** Generates audit-ready compliance certificates and downloadable JSON audit logs.
* **Inkloom Guide Assistant:** Floating in-app AI assistant powered by Groq Llama-3.3-70B.

---

## 3. Technical Details & System Architecture

### Technology Stack
* **Frontend:** React 19, Vite 8, Tailwind CSS v4, Lucide React
* **Backend:** Node.js v24, Express.js, Multer
* **Database:** MongoDB Atlas, Mongoose ODM
* **AI & NLP:** Groq Llama-3.3-70B (Server-side), Python 3.12 (FastAPI, Scikit-Learn, NumPy, Pandas, Matplotlib)
* **Image Processing:** Sharp, ColorThief

### Core Mathematical Formulas & Algorithms

#### 1. WCAG 2.1 Relative Luminance & Contrast Ratio
For each sRGB channel ($C \in \{R, G, B\}$ normalized to $[0, 1]$):
* If $C \le 0.04045 \implies C_{\text{linear}} = C / 12.92$
* Else $\implies C_{\text{linear}} = ((C + 0.055) / 1.055)^{2.4}$

Relative Luminance ($L$):
$$L = 0.2126 \cdot R_{\text{linear}} + 0.7152 \cdot G_{\text{linear}} + 0.0722 \cdot B_{\text{linear}}$$

Contrast Ratio:
$$\text{Ratio} = \frac{\max(L_1, L_2) + 0.05}{\min(L_1, L_2) + 0.05}$$

* Verified Level AA Threshold: $\ge 4.5:1$
* Verified Level AAA Threshold: $\ge 7.0:1$

#### 2. Factual Constraint Preservation Engine
The RAG rewriting engine uses tokenized regular expressions to extract and lock immutable constraints:

```javascript
const FACT_PATTERNS = [
  /\b\d+(?:\.\d+)?%/g,                                  // Percentages: "60%", "100%"
  /\$\d+(?:\.\d+)?(?:\s*(?:k|m|b|billion|million))?/gi, // Currency: "$50M", "$100"
  /\b(?:SOC-?2|ISO\s*27001|HIPAA|GDPR)\b/gi,            // Compliance standards
  /\b\d+\+?\s+(?:enterprises|customers|clients)\b/gi    // Claims: "500+ enterprises"
]
```

---

## 4. Testing Notes & Verification Logs

| Test Scenario | Verification Method | Result | Status |
| :--- | :--- | :--- | :--- |
| **Frontend Production Build** | Vite production compilation (`npm run build`) | Built 2,129 modules in 891ms | ✅ PASS |
| **Backend Route Syntax** | Node check across all routes, services, and models | 18 files verified | ✅ PASS |
| **Database Connectivity** | Live connection to MongoDB Atlas cluster | Latency: 120ms; SSL verified | ✅ PASS |
| **WCAG Contrast Ratios** | Tested pure Black/White (21:1) and Navy/White (14.25:1) | 100% mathematical accuracy | ✅ PASS |
| **Image Palette Extraction** | Extracted palette from sample marketing banners | 5 dominant colors extracted | ✅ PASS |
| **Constraint Preservation** | Audited rewrite with `60%`, `500+ enterprises`, `SOC-2` | All 3 facts preserved in output | ✅ PASS |
| **Human Approval Gate** | Tested webhook dispatch on "Changes Requested" vs "Approved" | Fired strictly on "Approved" | ✅ PASS |
| **Webhook Idempotency** | Double approval submitted for check `chk_101` | Second dispatch rejected | ✅ PASS |

---

## 5. Team-Member Contributions

* **Team Name:** `ryanmishra4551` | **Team ID:** `%65`
* **Institution:** Shri Ramswaroop Memorial University (Department of Computer Science)

```
┌────────────────────────────────────────────────────────────────────────┐
│                        TEAM CONTRIBUTION MATRIX                        │
├──────────────────────────┬──────────────────────────┬──────────────────┤
│ Member                   │ Role                     │ Key Deliverable  │
├──────────────────────────┼──────────────────────────┼──────────────────┤
│ Aryan Mishra             │ Team Leader & Full-Stack │ Frontend UI/UX,  │
│                          │ Developer                │ Reports & State  │
├──────────────────────────┼──────────────────────────┼──────────────────┤
│ Pranav Sharma            │ Backend & AI Developer   │ Node.js APIs, ML │
│                          │                          │ Service & DB     │
├──────────────────────────┼──────────────────────────┼──────────────────┤
│ Labeeba Khan             │ Research & Quality Lead  │ Brand Guidelines │
│                          │                          │ & Documentation  │
├──────────────────────────┼──────────────────────────┼──────────────────┤
│ Abhiman Singh Yadav      │ Product & Architecture   │ RAG Engine, WCAG │
│                          │ Lead                     │ & Webhook Gate   │
└──────────────────────────┴──────────────────────────┴──────────────────┘
```

1. **Aryan Mishra (Team Leader — Frontend & Full-Stack Developer):**
   * Designed the responsive Studio UI using Tailwind CSS v4 and React 19.
   * Built the New Check submission interface, continuous monitoring dashboard, and visual chart layouts.
   * Managed state coordination and API client error handling.

2. **Pranav Sharma (Participant 2 — Backend & AI Developer):**
   * Engineered the Express REST API backend and MongoDB Atlas schemas.
   * Built the Python NLP microservice for tone classification and readability scoring.
   * Implemented database auto-seeding with demo data.

3. **Labeeba Khan (Participant 3 — Research & Quality Documentation Lead):**
   * Led the research into enterprise brand guidelines (Acme Corp, TechCorp, Aldenaire).
   * Formulated the test matrices, validation checklists, and compliance requirements.
   * Drafted the pitch deck presentation and user-testing documentation.

4. **Abhiman Singh Yadav (Participant 4 — Product & Architecture Lead):**
   * Implemented the Multi-Modal Visual Auditing engine with Sharp, ColorThief, and WCAG relative luminance.
   * Designed the Contextual RAG Rewriting pipeline with regex-based fact preservation.
   * Built the Webhook Connector architecture with the human approval gate and idempotency protections.

---

## 6. Updated Presentation (PDF) Slide-by-Slide Guide

If updating your project presentation slides or PDF, use this structure:

* **Slide 1: Title & Executive Summary** — Inkloom AI: Intelligent Multi-Modal Brand Governance Platform.
* **Slide 2: The Enterprise Problem** — Uncontrolled GenAI causes brand erosion, unapproved color palettes, low WCAG contrast, and compliance exposure.
* **Slide 3: The Inkloom Solution** — Deterministic rule governance + multi-modal visual auditing + context-aware RAG rewriting.
* **Slide 4: Continuous Channel Surveillance** — Automated scanning of websites, LinkedIn, and social media creative for regression detection.
* **Slide 5: Unified Audit Results** — Side-by-side evidence with rule citations, palette breakdowns, and WCAG 2.1 compliance statuses.
* **Slide 6: Contextual RAG Rewriting** — Fact-preserving copy generation pulling strictly from verified brand copy.
* **Slide 7: Enterprise Governance & Human Gate** — Role-based authorization queue with draft-only connectors for Slack, HubSpot, and WordPress.
* **Slide 8: Technical Architecture** — React 19, Express, MongoDB Atlas, Sharp, ColorThief, and Python NLP microservice.
* **Slide 9: Verification & Test Results** — 100% build pass rate, live database synchronization, and mathematical contrast validation.
* **Slide 10: Team & Roadmap** — Team ryanmishra4551, market potential, and enterprise roadmap.
