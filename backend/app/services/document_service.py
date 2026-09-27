import io
from typing import Dict, Any
from app.services.security_service import analyze_text_security

try:
    from pypdf import PdfReader
except ImportError:
    PdfReader = None

try:
    from docx import Document
except ImportError:
    Document = None


async def analyze_document(file_content: bytes, filename: str) -> Dict[str, Any]:
    """
    Safely extracts plain text from PDF, DOCX, or TXT documents
    without executing macros or embedded active content, and performs security analysis.
    """
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
    extracted_text = ""

    if ext == "txt":
        try:
            extracted_text = file_content.decode("utf-8")
        except UnicodeDecodeError:
            extracted_text = file_content.decode("latin-1", errors="ignore")

    elif ext == "pdf":
        if PdfReader is None:
            raise RuntimeError("PDF reader library is not installed.")
        stream = io.BytesIO(file_content)
        reader = PdfReader(stream)
        pages_text = []
        for i, page in enumerate(reader.pages):
            page_content = page.extract_text() or ""
            pages_text.append(page_content)
            # Limit page scanning for performance & security
            if i >= 30:
                break
        extracted_text = "\n".join(pages_text)

    elif ext in ("docx", "doc"):
        if Document is None:
            raise RuntimeError("DOCX document library is not installed.")
        stream = io.BytesIO(file_content)
        doc = Document(stream)
        extracted_text = "\n".join([p.text for p in doc.paragraphs if p.text])

    else:
        raise ValueError(f"Unsupported document format: .{ext}. Supported formats: PDF, DOCX, TXT")

    if not extracted_text.strip():
        return {
            "risk": "LOW",
            "score": 0,
            "threat_type": "Empty or Scanned Document",
            "confidence": 0.8,
            "indicators": ["No readable text content extracted"],
            "indicator_details": [],
            "explanation": "No readable digital text could be extracted. The document may be empty, password-protected, or an image-only scan.",
            "attacker_goal": "Unable to determine without text content.",
            "recommendations": [
                "Verify the document origin directly with the sender before opening.",
                "Ensure your office suite disables automatic macro execution."
            ],
            "educational_tip": "Malicious documents often attempt to deliver trojans via hidden macros or disguised links. Keep automatic macro execution disabled in your software.",
            "uncertainty": "Scanned images or embedded OLE objects inside the document were not executed.",
            "extracted_preview": "",
        }

    # Run extracted text through our deterministic cybersecurity analysis engine
    analysis = analyze_text_security(extracted_text)

    # Enhance context specifically for documents
    if analysis["score"] >= 55:
        analysis["threat_type"] = f"Malicious Document Content ({analysis['threat_type']})"
        analysis["recommendations"].insert(0, "Do NOT enable macros or click embedded hyperlinks within this document.")
    else:
        analysis["recommendations"].append("Inspect embedded links and sender details carefully before executing instructions.")

    analysis["extracted_preview"] = extracted_text[:300].strip()
    return analysis
