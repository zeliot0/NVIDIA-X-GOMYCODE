# SAFEAI Security Architecture & Privacy Policy

## Core Security Safeguards

### 1. Zero Untrusted Execution
- **Safe URL Analysis**: The URL analysis engine **never** sends HTTP requests or visits target domains submitted by users. It decomposes URLs structurally (protocol, domain hierarchy, punycode, query parameters, IP format) to identify deceptive patterns without exposing the backend or user to web-borne exploits or drive-by malware.
- **Document Analysis**: Text is extracted strictly using memory streams via `pypdf` and `python-docx`. Macros, embedded Visual Basic scripts, and OLE active objects are **never** executed.
- **Image Analysis**: Image files are decoded purely as static pixel buffers using Pillow (`PIL`). Metadata and visual attributes are inspected without evaluating potential image payloads.

### 2. Privacy & Data Minimization
- **No Plaintext Credential Logging**: SAFEAI parses submitted text specifically to detect the *presence* of credential solicitation rather than logging sensitive user credentials.
- **Sensitive Content Sanitization**: Database records store sanitized subject summaries (`source_preview`) truncated to 80 characters, avoiding prolonged retention of private communication content.
- **API Key Confidentiality**: All AI API keys reside exclusively in the server-side environment variables (`.env`). The React client never receives, stores, or transmits external API credentials.

### 3. Input Validation & Defense-in-Depth
- **Pydantic Validation**: All incoming requests undergo strict schema validation with character length limitations.
- **File Upload Protection**: Uploaded files have maximum size caps (10MB for images, 15MB for documents, 25MB for audio) and strict MIME type / extension whitelists.
- **CORS Protection**: Access is restricted to allowed origins in development and production.
