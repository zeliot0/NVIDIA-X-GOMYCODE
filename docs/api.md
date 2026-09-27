# SAFEAI API Documentation

Base URL: `http://127.0.0.1:8000`
Interactive Swagger Docs: `http://127.0.0.1:8000/docs`

---

## Endpoints

### 1. Health Check
`GET /health`
- **Response**: `{"status": "healthy", "service": "SAFEAI Backend"}`

---

### 2. Text / Message Security Analysis
`POST /analysis/text`
- **Body**:
  ```json
  {
    "text": "URGENT! Your bank account has been suspended. Click here to verify password."
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "input_type": "text",
    "analysis": {
      "risk": "CRITICAL",
      "score": 100,
      "threat_type": "Phishing / Credential Harvesting",
      "confidence": 0.95,
      "indicators": ["Urgency & Pressure", "Credential Request", "Financial Context", "Suspicious Action / Link"],
      "indicator_details": [...],
      "explanation": "...",
      "attacker_goal": "Steal account credentials (passwords/logins) by impersonating a trusted service.",
      "recommendations": [...],
      "educational_tip": "...",
      "uncertainty": "..."
    },
    "record_id": 1
  }
  ```

---

### 3. Safe URL Analysis
`POST /analysis/url`
- **Body**:
  ```json
  {
    "url": "http://192.168.1.1/paypal-login/verify-password"
  }
  ```
- **Response**: Standard `AnalysisResponse` object.

---

### 4. Screenshot / Image Analysis
`POST /analysis/image`
- **Content-Type**: `multipart/form-data`
- **Form Data**: `file=@screenshot.png` (Supports PNG, JPEG, WEBP)
- **Response**: Standard `AnalysisResponse` object.

---

### 5. Document Security Inspection
`POST /analysis/document`
- **Content-Type**: `multipart/form-data`
- **Form Data**: `file=@invoice.pdf` (Supports PDF, DOCX, TXT)
- **Response**: Standard `AnalysisResponse` object.

---

### 6. Voice Message / Call Analysis
`POST /analysis/voice`
- **Content-Type**: `multipart/form-data`
- **Form Data**: `file=@call.mp3` (Supports WAV, MP3, M4A, OGG)
- **Response**: Standard `AnalysisResponse` object including `transcript`.

---

### 7. Cybersecurity Coach Chat
`POST /chat`
- **Body**:
  ```json
  {
    "message": "Why should I never share an OTP?",
    "history": []
  }
  ```
- **Response**:
  ```json
  {
    "response": "...",
    "educational_tips": ["..."],
    "suggested_questions": ["..."]
  }
  ```

---

### 8. Security Scan History
`GET /reports`
- **Query Params**: `limit=50`
- **Response**: Array of historical `AnalysisHistoryItem` records.

`GET /reports/{id}`
- **Response**: Single `AnalysisHistoryItem` record with full breakdown.

`DELETE /reports/{id}`
- **Response**: `{"success": true, "message": "Report #id deleted."}`
