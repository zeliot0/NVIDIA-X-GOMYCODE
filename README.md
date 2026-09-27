# SAFEAI — AI-Powered Personal Cybersecurity Assistant

> *"Don't just detect the threat. Understand it."*

SAFEAI is a web-based personal cybersecurity assistant designed for ordinary internet users. It evaluates messages, links, screenshots, audio messages, and documents using a hybrid **deterministic cybersecurity engine + AI reasoning layer**, providing explainable threat insights and actionable defensive steps.

---

## 🌟 Key Features

1. **AI Text Security Analyzer**: Detects phishing, urgency traps, credential requests, OTP interception, and financial scams in English, French, and Arabic.
2. **Safe URL Analyzer**: Deconstructs web links for punycode spoofing, IP hosts, suspicious subdomains, and credential paths without visiting the malicious page.
3. **Screenshot Analyzer**: Evaluates fake login screens, brand impersonation, and fraudulent popups.
4. **Voice Message Analyzer**: Transcribes audio and evaluates vishing, phone fraud, and social engineering.
5. **Document Analyzer**: Safely extracts text from PDF, DOCX, and TXT files without executing malicious macros or scripts.
6. **Explainable AI**: Translates complex cybersecurity risks into clear, everyday language suitable for non-technical users.
7. **Actionable Protection Plan**: Generates an immediate checklist of defensive steps tailored to the specific threat.
8. **Cybersecurity Coach**: An interactive conversational AI assistant that teaches safe online habits, password hygiene, and MFA best practices.
9. **Security Scan History & Reports**: Stores previous analyses in SQLite with search, filters, and printable formal security assessment reports.

---

## 🏗️ Architecture

- **Frontend**: React 19, Vite 8, Tailwind CSS v4, Lucide React, Axios
- **Backend**: Python 3.11, FastAPI, Uvicorn, Pydantic, SQLAlchemy, Pillow, pypdf, python-docx, httpx
- **Database**: SQLite (`safeai.db`)

```text
SEE ──▶ UNDERSTAND ──▶ DETECT ──▶ EXPLAIN ──▶ PROTECT ──▶ LEARN
```

---

## 🚀 Getting Started

### 1. Backend Setup

```bash
cd backend
# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Install dependencies (if needed)
pip install -r requirements.txt

# Run the FastAPI server
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

The backend will be live at:
- **API URL**: `http://127.0.0.1:8000`
- **Swagger Documentation**: `http://127.0.0.1:8000/docs`

### 2. Frontend Setup

```bash
cd frontend
# Install dependencies
npm install

# Start Vite development server
npm run dev
```

The frontend will be live at:
- **Application URL**: `http://localhost:5173`

---

## 🧪 Quick Test Examples

### Phishing SMS (Critical Risk)
> "URGENT! Your bank account has been suspended. Click here immediately to verify your password."

### Safe Message (Low Risk)
> "Hey, are we still meeting for lunch tomorrow at noon?"

### Phishing URL
> `http://192.168.1.1/paypal-login/verify-password`

---

## 📚 Documentation
- [Architecture Guide](docs/architecture.md)
- [API Reference](docs/api.md)
- [Security & Privacy Details](docs/security.md)
