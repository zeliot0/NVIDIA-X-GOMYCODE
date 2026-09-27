from fastapi import APIRouter, HTTPException, UploadFile, File, status
from pydantic import BaseModel, Field
from typing import Dict, Any, List
from app.services.tools_service import (
    audit_password,
    analyze_email_header,
    scan_qr_code,
    get_trending_threats
)

router = APIRouter(
    prefix="/tools",
    tags=["Security Tools"]
)


class PasswordAuditRequest(BaseModel):
    password: str = Field(..., max_length=500, description="Password to audit for entropy and crack-time")


class EmailHeaderRequest(BaseModel):
    raw_headers: str = Field(..., min_length=10, max_length=50000, description="Raw email headers to inspect")


@router.post("/password-audit", summary="Audit password strength, entropy, and crack time")
def password_audit_endpoint(payload: PasswordAuditRequest):
    return audit_password(payload.password)


@router.post("/email-header", summary="Inspect raw email headers for spoofing, SPF, DKIM, and DMARC")
def email_header_endpoint(payload: EmailHeaderRequest):
    try:
        return analyze_email_header(payload.raw_headers)
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Header parse error: {str(e)}")


@router.post("/qr-scan", summary="Scan and inspect a QR code for phishing (Quishing)")
async def qr_scan_endpoint(file: UploadFile = File(..., description="QR code image")):
    try:
        content = await file.read()
        return scan_qr_code(content)
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"QR scan error: {str(e)}")


@router.get("/threat-radar", summary="Get real-time global threat radar and trending scam alerts")
def threat_radar_endpoint():
    return get_trending_threats()
