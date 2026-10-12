# 🛡️ ToxiGuard AI `v4.2.0`

![ToxiGuard AI Architecture](toxiguard_architecture.png)

Enterprise-Grade, Autonomous AI Content Safety, Threat Detection & Real-Time Moderation Platform

[![Live Web Application](https://img.shields.io/badge/Frontend-toxiai.vercel.app-6366f1?style=for-the-badge&logo=vercel)](https://toxiai.vercel.app)
[![FastAPI Backend](https://img.shields.io/badge/Backend_API-Render-0ea5e9?style=for-the-badge&logo=render)](https://toxiguard-ai-agent-1.onrender.com/)
[![Swagger API Docs](https://img.shields.io/badge/API_Docs-Swagger_UI-22d3ee?style=for-the-badge&logo=swagger)](https://toxiguard-ai-agent-1.onrender.com/docs)
[![Chrome Extension MV3](https://img.shields.io/badge/Chrome_Extension-Manifest_V3-4285F4?style=for-the-badge&logo=googlechrome)](extension/)
[![Python 3.10+](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python)](https://python.org)
[![React 18](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-a78bfa?style=for-the-badge)](LICENSE)

## Platform Highlights

Real-Time Content Shielding • 3-Layer Hybrid AI Architecture • Token Heatmap Explainability (XAI) • Continuous Drift Monitoring • Universal Chrome Extension • Editorial Design System

---

## 📌 Table of Contents

- [📖 Executive Summary & Problem Statement](#-executive-summary--problem-statement)
- [🎯 Core Philosophy & Architectural Principles](#-core-philosophy--architectural-principles)
- [🎨 Editorial Design System & Modern Frontend](#-editorial-design-system--modern-frontend)
- [🧠 3-Layer Cascaded Hybrid AI Pipeline](#-3-layer-cascaded-hybrid-ai-pipeline)
- [💡 Deep-Dive Platform Features](#-deep-dive-platform-features)
  - [1. 3-Layer Hybrid Moderation Engine](#1-3-layer-hybrid-moderation-engine)
  - [2. Explainable AI (XAI) & Token Impact Heatmaps](#2-explainable-ai-xai--token-impact-heatmaps)
  - [3. High-Throughput Real-Time Stream Moderation](#3-high-throughput-real-time-stream-moderation)
  - [4. Automated Feedback Loop & Concept Drift Monitoring](#4-automated-feedback-loop--concept-drift-monitoring)
  - [5. Universal Chrome Extension (Manifest V3)](#5-universal-chrome-extension-manifest-v3)
  - [6. React SaaS Analytics Dashboard & Product Simulator](#6-react-saas-analytics-dashboard--product-simulator)
  - [7. Production Legal & Compliance Suite](#7-production-legal--compliance-suite)
- [⚙️ Technology Stack & "Why We Chose It"](#️-technology-stack--why-we-chose-it)
  - [Backend Stack](#backend-stack)
  - [Frontend Stack](#frontend-stack)
  - [AI / ML Stack](#ai--ml-stack)
  - [Chrome Extension Stack](#chrome-extension-stack)
- [🔄 End-to-End Execution Workflow & Data Lifecycle](#-end-to-end-execution-workflow--data-lifecycle)
- [🏗️ Complete Project Directory Structure](#️-complete-project-directory-structure)
- [🔗 Comprehensive API Reference](#-comprehensive-api-reference)
  - [Authentication Endpoints](#authentication-endpoints)
  - [Moderation & Analysis Endpoints](#moderation--analysis-endpoints)
  - [Explainability, Stream & Monitoring Endpoints](#explainability-stream--monitoring-endpoints)
- [🚀 Quick Start & Local Setup Guide](#-quick-start--local-setup-guide)
  - [Option 1: Docker (Full Stack)](#option-1-docker-full-stack)
  - [Option 2: Local Backend Setup](#option-2-local-backend-setup)
  - [Option 3: Local Frontend Setup](#option-3-local-frontend-setup)
  - [Option 4: Chrome Extension Load](#option-4-chrome-extension-load)
- [🔒 Security, Privacy & Zero-Retention Compliance](#-security-privacy--zero-retention-compliance)
- [✅ Final System Verification & Audit Checklist](#-final-system-verification--audit-checklist)
- [👨‍💻 Author & License](#-author--license)

---

## 📖 Executive Summary & Problem Statement

Modern digital communications on social media platforms, live streams, comments sections, and enterprise channels generate **billions of user posts every single day**. However, online toxicity, hate speech, cyberbullying, harassment, and abusive threats pose a constant danger to user safety, mental health, brand equity, and platform compliance.

Traditional moderation approaches fail at scale:

- ❌ **Rule-Based Filters & Dictionaries** are fast but naive, failing on obfuscated words (e.g. `k!ll`, `sh!t`), sarcasm, context-dependent phrasing, or evolving internet slang.
- ❌ **Standalone Heavy LLMs (GPT-4 / Claude)** provide deep contextual reasoning but are far too slow (~1–3 seconds per request) and prohibitively expensive ($0.01+ per call) to run on every single comment in a high-volume social feed.
- ❌ **Black-Box ML Classifiers** provide fast probability scores, but fail to provide *explainability* (why a post was flagged) or adapt when language patterns shift over time (model drift).

### The Solution: ToxiGuard AI v4.2

**ToxiGuard AI** solves this trilemma with an **Enterprise-Grade Cascaded Architecture**. It merges **sub-millisecond Regex rule processing**, **20ms ML feature classification**, and **sub-second Large Language Model (LLM) contextual reasoning** into a single self-calibrating pipeline. Paired with an unpacked **Chrome Extension**, a real-time **React SaaS Dashboard**, and **Explainable AI (XAI)** token heatmaps, ToxiGuard provides instant safety without compromising performance or privacy.

---

## 🎯 Core Philosophy & Architectural Principles

ToxiGuard AI is built around 6 fundamental design pillars:

1. **Defence-in-Depth (Cascaded Fallback)**: Never rely on a single model. If a text string is an obvious slur, resolve it in **<1ms** via Layer 1. If it requires classification, evaluate via Layer 2 in **~20ms**. Reserve deep LLM inference (Layer 3) only for complex or low-confidence edge cases.
2. **Sub-Second Real-Time Performance**: High throughput is non-negotiable. Live stream chat buffers and social media scroll hooks require instant response times to prevent abusive text from ever rendering on screen.
3. **Explainability First (XAI)**: Machine learning models should not be opaque black boxes. ToxiGuard extracts and visualizes exact token impact weights (SHAP/LIME attribution) so moderators and users understand precisely *which words* triggered a flag.
4. **Self-Correcting & Drift-Resilient**: Modern internet speech evolves rapidly. ToxiGuard includes continuous model drift tracking, confidence calibration, automated user feedback collection, and auto-retraining loops.
5. **Universal Client-Side Enforcement**: Protect users anywhere on the open web through a Manifest V3 extension featuring feed mutation observers, shadow DOM injection, floating context selection buttons, and side-panel companion controls.
6. **Zero-Retention Privacy by Design**: Moderation payloads are evaluated in volatile RAM and immediately discarded. No customer input strings are stored on disk or used to retrain public neural models.

---

## 🎨 Editorial Design System & Modern Frontend

The web interface is built to reflect **Editorial Craftsmanship meets Silicon Precision** (inspired by Stripe Press, Linear, and luxury print editorial layouts).

- **Design Tokens & Theme System**:
  - **Dark Mode**: Obsidian Midnight canvas (`#080c16`), elevated card surfaces (`#111726`), warm terracotta amber accent (`#e07a38`), and hairline dividers (`rgba(255, 255, 255, 0.09)`).
  - **Light Mode**: Tactile Japanese linen canvas (`#F4EFE8`), soft sandstone card surfaces (`#EDE7DF`), and WCAG AA-compliant terracotta brick accent (`#A35320`).
  - Seamless theme toggling via a dedicated 36×36px square switcher with custom inline SVGs.
- **Typography Hierarchy**:
  - **Display Serif**: `DM Serif Display` for hero headlines, major section headings, and brand wordmarks.
  - **Body Sans**: `DM Sans` for UI controls, inputs, body text, and navigation.
  - **Monospace**: `JetBrains Mono` for code snippets, telemetry counters, and technical pills.
- **Product-Focused Landing Experience**:
  - Working moderation feed simulator with an interactive text tester and live masking toggle.
  - Multi-language developer integration cards featuring **JavaScript**, **Python**, and **cURL** with dedicated syntax highlighting.
  - Technical FAQ accordion addressing pipeline latency, in-memory processing, and extension mechanics.

---

## 🧠 3-Layer Cascaded Hybrid AI Pipeline

The backbone of ToxiGuard AI is its 3-layer cascaded decision matrix. Text enters at the top and cascades downwards; early exit pathways ensure maximum throughput and minimum compute expenditure.

```text
                      ┌─────────────────────────────────────────┐
                      │            Incoming Raw Text            │
                      └────────────────────┬────────────────────┘
                                           │
                                           ▼
                      ┌─────────────────────────────────────────┐
                      │  Preprocessing & Sanitization Engine    │
                      │  • Lowercasing & Accents Normalization  │
                      │  • Leetspeak Regex Transformation      │
                      │  • Tokenization & Stopword Filtering    │
                      └────────────────────┬────────────────────┘
                                           │
                                           ▼
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ LAYER 1: Rule Engine & Keyword Dictionary (< 1ms Latency)                            │
│ • Deterministic Regex matching against abuse words, identity attacks, and slurs     │
│ • High-confidence early exit for obvious violations                                │
└──────────────────────────────────┬──────────────────────────────────────────────────┘
                                   │ Ambiguous or clean
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ LAYER 2: Transformer ML Classifier (~20–35ms Latency)                               │
│ • Fine-tuned DeBERTa-v3 model compiled to ONNX Runtime / TF-IDF Logistic Regression   │
│ • Calibrated multi-label toxicity probability distribution                         │
└──────────────────────────────────┬──────────────────────────────────────────────────┘
                                   │ Low confidence boundary (0.15 <= p <= 0.85)
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ LAYER 3: Contextual LLM Verification (~400–600ms Latency)                           │
│ • Targeted contextual reasoning via Gemma 4 31B / Qwen3 80B Instruct                 │
│ • Analyzes conversational nuance, sarcasm, and regional context                      │
└──────────────────────────────────┬──────────────────────────────────────────────────┘
                                   │
                                   ▼
                      ┌─────────────────────────────────────────┐
                      │    Ensemble Calibrated Output Verdict   │
                      │   is_toxic • confidence • category tags │
                      └─────────────────────────────────────────┘
```

---

## 💡 Deep-Dive Platform Features

### 1. 3-Layer Hybrid Moderation Engine

- **Backend Endpoint**: `/predict` & `/predict/ml`.
- Combines deterministic rules, neural feature embeddings, and contextual LLM verification into a unified weighted ensemble.

### 2. Explainable AI (XAI) & Token Impact Heatmaps

- **Backend Endpoint**: `/explain` powered by `backend/ml/explainability.py`.
- **Frontend Component**: `TokenHeatmap.jsx`.
- Calculates token attribution weights for each individual word in the input text, generating normalized weights from `-1.0` (strongly safe) to `+1.0` (strongly toxic).

### 3. High-Throughput Real-Time Stream Moderation

- **Backend Endpoint**: `/stream` powered by `backend/app/routes/stream.py`.
- **Frontend Component**: `StreamAnalyzer.jsx`.
- Processes multi-message arrays or live WebSocket payloads in parallel for streaming platforms and chat systems.

### 4. Automated Feedback Loop & Concept Drift Monitoring

- **Backend Endpoints**: `/feedback`, `/monitoring` powered by `drift_monitor.py` & `calibration.py`.
- Collects user reports on false positives, evaluates distribution drift over time, and triggers automated retraining when drift exceeds thresholds.

### 5. Universal Chrome Extension (Manifest V3)

- **Directory**: `extension/`.
- MutationObserver feed scanner for social platforms, text selection floating action shield (FAB), and persistent side-panel companion controls.

### 6. React SaaS Analytics Dashboard & Product Simulator

- **Directory**: `frontend/src/`.
- Real-time interactive moderation simulator, Recharts analytics visualizations, CSV bulk batch uploader, and developer API key management.

### 7. Production Legal & Compliance Suite

- **Routes**: `/privacy` (`Privacy.jsx`) & `/terms` (`Terms.jsx`).
- Complete 10-section policies detailing volatile memory evaluation, zero payload retention, GDPR/CCPA data subject rights, and extension security guarantees. Adblock-safe routing prevents client bundle blocking.

---

## ⚙️ Technology Stack & "Why We Chose It"

### Backend Stack

| Technology | Used For | Why We Chose It |
| :--- | :--- | :--- |
| **FastAPI (Python 3.10+)** | Primary REST API Framework | Native async support (`async/await`), automatic OpenAPI/Swagger documentation, Pydantic v2 data validation, and high performance. |
| **Uvicorn / Gunicorn** | ASGI Server | Enterprise-grade asynchronous concurrency handling thousands of requests/sec. |
| **SQLAlchemy** | Database ORM | Flexible abstraction supporting SQLite for local rapid dev and PostgreSQL for production. |
| **Pydantic v2** | Data Serialization & Validation | Fast Rust-backed validation ensuring strict schema enforcement across all endpoints. |
| **SlowAPI** | Rate Limiting | Protects API endpoints against brute-force key exploitation and traffic spikes. |

### Frontend Stack

| Technology | Used For | Why We Chose It |
| :--- | :--- | :--- |
| **React 18** | UI Library | Component-based SPA architecture with fast virtual DOM reconciliation for smooth updates. |
| **Vite 5** | Build Tool & Dev Server | Sub-second Instant Hot Module Replacement (HMR) and optimized rollup bundle compilation. |
| **Editorial Design System** | Styling & Theme Engine | Built with custom CSS variables, zero heavy CSS utility dependencies, and first-class Dark/Light mode tokens. |
| **Recharts** | Data Visualization | Modular SVG-based chart library providing responsive charts for analytics. |

### AI / ML Stack

| Technology | Used For | Why We Chose It |
| :--- | :--- | :--- |
| **scikit-learn** | ML Classification Pipeline | TF-IDF vectorization paired with Logistic Regression provides ultra-fast inference (~20ms) with low memory overhead. |
| **ONNX Runtime** | Deep Learning Inference | Converts heavy HuggingFace Transformers (DeBERTa) into optimized CPU execution binaries. |
| **OpenRouter API** | LLM Gateway | Provides access to top-tier open models (**Gemma 4 31B** & **Qwen3 80B**) with automated zero-downtime fallback. |
| **NLTK / TextBlob / VADER** | Text Processing & Sentiment | Fast rule-based sentiment scoring complementing ML probabilistic predictions. |

### Chrome Extension Stack

| Technology | Used For | Why We Chose It |
| :--- | :--- | :--- |
| **Manifest V3** | Extension Standard | Modern Chrome security compliance utilizing event-driven Service Workers. |
| **MutationObserver API** | DOM Monitoring | Asynchronously detects new social media feed posts without polling or degrading browser FPS. |
| **Chrome SidePanel API** | Side Panel UI | Provides a clean, persistent side panel workspace within the user's browser workflow. |

---

## 🔄 End-to-End Execution Workflow & Data Lifecycle

```text
[ User Action ]
  • Option A: Extension detects new post on Instagram feed via MutationObserver.
  • Option B: User types text into React Live Demo or calls /predict API endpoint.
         │
         ▼
[ Step 1: Preprocessing & Normalization ]
  • Raw text is lowercased, stripped of control bytes, and normalized.
  • Leetspeak substitutions are resolved (e.g., "b!tch" -> "bitch").
         │
         ▼
[ Step 2: Layer 1 Rule Engine (< 1ms) ]
  • Regex dictionaries check for hardcoded explicit slurs or violence threats.
  • IF MATCHED: Instantly tag toxic=True, confidence=1.0, source="rule_engine" -> RETURN.
         │
         ▼
[ Step 3: Layer 2 Machine Learning Classifier (~20–35ms) ]
  • Text is vectorized via TF-IDF matrix or evaluated via ONNX Transformer.
  • Model computes calibrated toxicity probability score p.
  • IF confidence is decisive (p > 0.85 OR p < 0.15): Tag toxic=(p>0.5), source="ml_classifier" -> RETURN.
         │
         ▼
[ Step 4: Layer 3 LLM Reasoning (~400–600ms) ]
  • IF text is ambiguous (0.15 <= p <= 0.85): Forward payload to OpenRouter API (Gemma 4 31B).
  • Fallback to Qwen3 80B if primary gateway times out.
  • LLM evaluates subtle context, sarcasm, and generates natural language explanation.
         │
         ▼
[ Step 5: Ensemble Merge & Explainability (XAI) ]
  • Merge layer predictions into weighted confidence score.
  • Compute SHAP/LIME token attribution weights for token heatmap generation.
         │
         ▼
[ Step 6: Response & Enforcement ]
  • API returns JSON payload to client.
  • Chrome Extension applies chosen shield action (Blur, Highlight, or Remove DOM element).
  • In-memory payload is immediately discarded; zero disk retention.
```

---

## 🏗️ Complete Project Directory Structure

```text
ToxiGuard-AI/
├── backend/                        # Python FastAPI Backend Application
│   ├── app/
│   │   ├── main.py                 # FastAPI initialization, CORS, rate limiter, route mounting
│   │   ├── core/
│   │   │   └── limiter.py          # SlowAPI rate limiter singleton instance
│   │   ├── routes/
│   │   │   ├── auth.py             # Auth endpoints (/auth/signup, /auth/login, /auth/me)
│   │   │   ├── moderation.py       # Main AI endpoints (/predict, /predict/ml)
│   │   │   ├── realtime.py         # WebSocket / chat moderation endpoints (/chat/moderate)
│   │   │   ├── explain.py          # XAI token heatmap endpoint (/explain)
│   │   │   ├── stream.py           # High-throughput stream analysis endpoint (/stream)
│   │   │   ├── feedback.py         # False positive/negative reporting endpoint (/feedback)
│   │   │   └── monitoring.py       # Drift monitoring & system metrics (/monitoring)
│   │   ├── services/
│   │   │   ├── model_service.py    # Lazy ML model loader & prediction runner
│   │   │   ├── drift_monitor.py    # Concept drift evaluation algorithm
│   │   │   ├── calibration.py      # Model confidence calibration service
│   │   │   ├── retrainer.py        # Automated ML background retraining runner
│   │   │   └── overrides.py        # Manual override rules service
│   │   └── db/                     # DB session helpers & engine connections
│   │
│   ├── ml/                         # Machine Learning Modules & Training
│   │   ├── explainability.py       # SHAP/LIME token impact attribution generator
│   │   ├── inference.py            # Optimized ML model inference pipeline
│   │   ├── train_transformer.py    # HuggingFace Transformer fine-tuning script
│   │   └── models/                 # Model output directory (.joblib / .onnx artifacts)
│   │
│   ├── utils/
│   │   ├── abuse_words.py          # Rule-based keyword dictionary + RegEx engine
│   │   ├── llm_guard.py            # OpenRouter LLM client, caching, fallback logic
│   │   ├── preprocessing.py        # Text cleaning, normalization, tokenization
│   │   └── sentiment.py            # VADER + TextBlob sentiment scoring helpers
│   │
│   ├── database.py                 # SQLAlchemy DB configuration (SQLite / PostgreSQL)
│   ├── models.py                   # User & Feedback ORM models
│   ├── auth_utils.py               # JWT generation & API key utilities
│   ├── train_model.py              # scikit-learn TF-IDF training script
│   ├── Dockerfile                  # Container build config for backend
│   ├── requirements.txt            # Main Python dependencies
│   ├── requirements-prod.txt       # Production pinned Python dependencies
│   └── runtime.txt                 # Python version specification for Render hosting
│
├── frontend/                       # React + Vite Web Application
│   ├── src/
│   │   ├── App.jsx                 # React SPA Router & route definitions
│   │   ├── main.jsx                # React root mounting entry point
│   │   ├── api.js                  # Axios client wrapper with automatic environment switching
│   │   ├── styles.css              # Global Vanilla CSS design system (tokens & utilities)
│   │   ├── components/
│   │   │   ├── LiveDemo.jsx        # Interactive real-time feed simulator on homepage
│   │   │   ├── LiveResult.jsx      # Detailed analysis result card & score badges
│   │   │   ├── Header.jsx          # 60px sticky header with theme switcher & auth controls
│   │   │   ├── ThemeToggle.jsx     # Dedicated 36x36px square sun/moon theme switcher
│   │   │   ├── Charts.jsx          # Recharts visualizations (toxicity pie & bar charts)
│   │   │   ├── AbuseTable.jsx      # Sortable/searchable historical moderation logs table
│   │   │   ├── FileUpload.jsx      # Drag-and-drop CSV batch dataset analyzer
│   │   │   ├── TokenHeatmap.jsx    # Interactive XAI token feature attribution heatmap
│   │   │   ├── StreamAnalyzer.jsx  # High-volume streaming chat feed simulator
│   │   │   ├── FeedbackWidget.jsx  # User feedback submission component
│   │   │   ├── MonitoringDashboard.jsx # Model drift & health metrics widget
│   │   │   ├── ErrorBoundary.jsx   # React crash prevention boundary
│   │   │   └── Toast.jsx           # Global UI toast notifications
│   │   └── pages/
│   │       ├── Home.jsx / Home.css         # Hero landing page with code tabs & FAQ
│   │       ├── Dashboard.jsx               # Authenticated analytics workspace
│   │       ├── Login.jsx / Login.css       # Sign in page with media panel
│   │       ├── Signup.jsx / Signup.css     # Account creation page with media panel
│   │       ├── InstallExtension.jsx/.css   # Chrome Extension installation guide
│   │       ├── Privacy.jsx                 # 10-section zero-retention Privacy Policy
│   │       ├── Terms.jsx                   # 10-section production Terms of Service
│   │       └── NotFound.jsx                # 404 error page
│   ├── package.json                # Frontend npm dependencies
│   └── vite.config.js              # Vite server & bundler configuration
│
├── extension/                      # Chrome Extension (Manifest V3)
│   ├── manifest.json               # MV3 configuration, host permissions, background scripts
│   ├── background.js               # Service Worker: background listener, alarms, sync
│   ├── content.js                  # Injected script: feed observer, selection FAB shield
│   ├── content.css                 # Injected styles: blur, highlight, and tooltip overlays
│   ├── popup.html / popup.js       # Extension toolbar popup dashboard
│   ├── popup.css                   # Deep dark glassmorphism popup UI
│   ├── options.html / options.js   # Extension settings & full analytics workspace
│   └── sidepanel.html / .js        # Chrome Side Panel companion app
│
├── docker-compose.yml              # Multi-container orchestration (Backend + Frontend)
├── system_design.md                # System design document & architecture breakdown
├── interview_prep.md               # Technical interview preparation guide
├── claim_justifications.md         # Production benchmark claim justifications
├── 1-click-install.bat             # Automated 1-click Chrome Extension launcher for Windows
├── toxiguard_architecture.png      # Full platform architecture diagram image
└── README.md                       # Comprehensive project documentation
```

---

## 🔗 Comprehensive API Reference

### Authentication Endpoints

#### 1. User Signup — `POST /auth/signup`

Creates a new account and returns a unique developer API key.

```bash
curl -X POST https://toxiguard-ai-agent-1.onrender.com/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "developer@company.com", "password": "SecurePassword123!"}'
```

#### 2. User Login — `POST /auth/login`

Authenticates credentials and returns a JWT token along with the user's API key.

```bash
curl -X POST https://toxiguard-ai-agent-1.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "developer@company.com", "password": "SecurePassword123!"}'
```

---

### Moderation & Analysis Endpoints

#### 1. Full 3-Layer Moderation — `POST /predict`

Executes complete cascaded analysis (Rule Engine $\rightarrow$ ML Classifier $\rightarrow$ LLM Reasoner).

```bash
curl -X POST https://toxiguard-ai-agent-1.onrender.com/predict \
  -H "x-api-key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"text": "You are an absolute idiot and should quit!"}'
```

**Example Response**:

```json
{
  "toxic": true,
  "confidence": 0.95,
  "severity": "high",
  "source": "llm",
  "category": "harassment",
  "abusive_words": ["idiot"],
  "sentiment": {
    "label": "negative",
    "polarity": -0.85
  },
  "llm": {
    "explanation": "Direct personal attack disparaging the recipient's intelligence.",
    "detected_phrases": ["absolute idiot"],
    "confidence": 0.95,
    "severity": "high"
  }
}
```

#### 2. Fast ML-Only Moderation — `POST /predict/ml`

Runs fast Rule + ML classification only (**~20ms response time**, bypasses LLM call).

```bash
curl -X POST https://toxiguard-ai-agent-1.onrender.com/predict/ml \
  -H "x-api-key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"text": "Have a great day everyone!"}'
```

---

### Explainability, Stream & Monitoring Endpoints

#### 1. Token Feature Attribution — `POST /explain`

Returns word-level impact weights for interactive token heatmaps.

```bash
curl -X POST https://toxiguard-ai-agent-1.onrender.com/explain \
  -H "x-api-key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"text": "This movie was terribly bad and stupid."}'
```

**Example Response**:

```json
{
  "text": "This movie was terribly bad and stupid.",
  "tokens": [
    {"word": "This", "weight": -0.02},
    {"word": "movie", "weight": 0.01},
    {"word": "was", "weight": -0.01},
    {"word": "terribly", "weight": 0.62},
    {"word": "bad", "weight": 0.74},
    {"word": "and", "weight": 0.00},
    {"word": "stupid", "weight": 0.89}
  ]
}
```

#### 2. Real-Time Stream Processing — `POST /stream`

Processes arrays of messages for high-throughput live streams.

```bash
curl -X POST https://toxiguard-ai-agent-1.onrender.com/stream \
  -H "x-api-key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"id": "1", "user": "alice", "text": "Hello world!"},
      {"id": "2", "user": "bob", "text": "Shut up u loser!"}
    ]
  }'
```

---

## 🚀 Quick Start & Local Setup Guide

### Option 1: Docker (Full Stack)

Ensure Docker and Docker Compose are installed on your system.

```bash
# 1. Clone the repository
git clone https://github.com/wraith-klu/toxiguard-ai.git
cd toxiguard-ai

# 2. Build and start all containers
docker-compose up --build
```

| Service | Local URL |
| :--- | :--- |
| **Frontend Web App** | `http://localhost:80` |
| **FastAPI Backend API** | `http://localhost:8000` |
| **Interactive Swagger Docs** | `http://localhost:8000/docs` |

---

### Option 2: Local Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate environment
# On Windows:
venv\Scripts\activate
# On macOS / Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

Create a `.env` file inside `backend/`:

```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_MODEL=google/gemma-4-31b-it:free
OPENROUTER_FALLBACK_MODEL=qwen/qwen3-next-80b-a3b-instruct:free
DATABASE_URL=sqlite:///./toxiguard.db
JWT_SECRET=your_secure_jwt_secret_key_here
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

Train ML model & run backend server:

```bash
# Train local TF-IDF model weights
python train_model.py

# Start uvicorn server
uvicorn app.main:app --reload --port 8000
```

---

### Option 3: Local Frontend Setup

```bash
cd frontend

# Install node packages
npm install
```

Create a `.env` file inside `frontend/`:

```env
VITE_BACKEND_URL=http://127.0.0.1:8000
```

Run Vite dev server:

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

---

### Option 4: Chrome Extension Load

#### Windows 1-Click Auto-Launcher

Double-click `1-click-install.bat` in the project root folder. It automatically boots Chrome with the extension pre-loaded.

#### Manual Chrome Load

1. Open Chrome and navigate to `chrome://extensions`.
2. Enable **Developer mode** (toggle in top-right corner).
3. Click **Load unpacked** and select the `extension/` folder.
4. Click the ToxiGuard shield icon in your toolbar and enter your API key!

---

## 🔒 Security, Privacy & Zero-Retention Compliance

- **Volatile Memory Evaluation**: All moderation queries are scored in RAM and immediately discarded. No customer input strings are saved to disk or relational databases.
- **No Training on User Data**: Payloads submitted through API keys or the extension are never utilized to train, retrain, or calibrate neural weights.
- **JWT & API Key Protection**: Passwords hashed using `bcrypt` / `Argon2` with salt rounds. Session tokens signed using `HS256`.
- **Per-IP & Per-Token Rate Limiting**: SlowAPI restricts unauthenticated abuse (e.g. 60 requests/minute).
- **CORS Domain Whitelisting**: Strict origin controls prevent unauthorized cross-domain browser requests.
- **Adblock-Safe Routing**: Client-side legal pages are bundle-isolated (`/privacy` and `/terms`) to prevent heuristic false positives in Brave Shields and uBlock Origin.

---

## ✅ Final System Verification & Audit Checklist

To verify that all components of the ToxiGuard AI ecosystem function properly:

| Category | Component | Status | Verification Method |
| :--- | :--- | :--- | :--- |
| **Backend** | 3-Layer Moderation Engine | `ACTIVE` | Tested `/predict` and `/predict/ml` endpoints |
| **Backend** | XAI Explainability Engine | `ACTIVE` | Verified token attribution via `/explain` |
| **Backend** | Concept Drift & Calibration | `ACTIVE` | Tested `/monitoring` and `/feedback` pipelines |
| **Frontend** | React SPA & Design System | `ACTIVE` | Compiled bundle with 0 errors (`npm run build`) |
| **Frontend** | Interactive Simulator & Tabs | `ACTIVE` | Verified `LiveDemo.jsx` & multi-lang code tabs |
| **Frontend** | Legal & Compliance Suite | `ACTIVE` | Verified `/privacy` and `/terms` adblock-safe routes |
| **Extension** | Manifest V3 Shield & Selection | `ACTIVE` | Verified `<all_urls>` injection, FAB, & side panel |
| **Docs** | Project Documentation | `COMPLETE` | Fully verified `README.md`, `system_design.md` & `claim_justifications.md` |

---

## 👨‍💻 Author & License

**Author**: Saurabh Yadav  
**Repository**: [github.com/wraith-klu/toxiguard-ai](https://github.com/wraith-klu/toxiguard-ai)  
**License**: This project is open-source software licensed under the **[MIT License](LICENSE)**.
