# SAFEAI System Architecture

## Overview
SAFEAI is an AI-powered personal cybersecurity assistant designed to empower internet users to detect, understand, and defend against online threats.

The core philosophy is:
> **"Don't just detect the threat. Understand it."**

## High-Level Architecture

```text
[ React + Tailwind Frontend ]
              │  (REST / JSON / Multipart)
              ▼
    [ FastAPI Backend ]
              │
    ┌─────────┴────────────────────────┐
    ▼                                  ▼
[ Deterministic Security Engine ]    [ AI Reasoning Layer ]
(Pattern matching, regex, metrics)   (LLM analysis, Vision, Whisper STT)
    │                                  │
    └─────────┬────────────────────────┘
              ▼
   [ Unified Security Assessment ]
              │
      ┌───────┴───────────────┐
      ▼                       ▼
[ Protection Plan ]    [ SQLite Database ]
(Actionable Defense)   (Analyses & Reports)
```

## Layer Breakdown

### 1. Presentation Layer (Frontend)
- **Framework**: React 19 + Vite 8
- **Styling**: Tailwind CSS v4 + Custom Cyberpunk Glows
- **Icons**: Lucide React
- **HTTP Client**: Axios with centralized error handling
- **Pages**:
  - `Home`: Overview, value proposition, and quick channel launcher.
  - `Dashboard`: Aggregated metrics, threat radar, and recent alerts.
  - `Analyze`: Multi-tab inspection suite (Text, URL, Screenshot, Document, Voice).
  - `History`: Historical threat database with full search and filtering.
  - `Report`: Formal printable/shareable security assessment dossier.
  - `Coach`: Real-time conversational AI cybersecurity tutor.

### 2. API & Services Layer (Backend)
- **Framework**: FastAPI (Python 3.11)
- **Server**: Uvicorn with auto-reload
- **Routers**:
  - `/health`: Backend heartbeat check.
  - `/analysis/text`: AI + heuristic text/message evaluation.
  - `/analysis/url`: Safe structural URL decomposition without active web visits.
  - `/analysis/image`: Visual heuristic + AI Vision screenshot analysis.
  - `/analysis/voice`: Audio transcript generation & vishing threat detection.
  - `/analysis/document`: Safe PDF, DOCX, and TXT parsing without active code execution.
  - `/chat`: Cybersecurity Coach conversational guidance.
  - `/reports`: CRUD operations on persisted security audits.

### 3. Intelligence Layer
- **Deterministic Rules**: High-precision regex pattern matchers with multi-signal synergy scoring.
- **Multilingual Support**: Supports English, French, and Arabic/Tunisian Arabic keywords.
- **AI Enhancement**: Optional OpenAI GPT-4o / GPT-4o-mini integration with structured JSON schemas.
- **Graceful Degradation**: 100% functional out-of-the-box offline using deterministic intelligence if no external API key is provided.

### 4. Data Persistence Layer
- **Database**: SQLite (`safeai.db`)
- **ORM**: SQLAlchemy
- **Tables**:
  - `analyses`: Stored analysis results, risk scores, and evidence breakdown.
  - `reports`: Associated formal summaries and defensive recommendations.
  - `users`: User profiles with hashed credentials support.
