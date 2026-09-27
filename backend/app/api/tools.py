from fastapi import APIRouter, HTTPException, UploadFile, File, status
from pydantic import BaseModel, Field
from typing import Dict, Any, List, Optional
from app.services.tools_service import (
    audit_password,
    analyze_email_header,
    scan_qr_code,
    get_trending_threats
)
from app.services.ai_service import (
    generate_incident_response_with_ai,
    audit_psychological_triggers_with_ai,
    audit_crypto_web3_with_ai,
    simulate_breach_check
)

router = APIRouter(
    prefix="/tools",
    tags=["Security Tools"]
)


class PasswordAuditRequest(BaseModel):
    password: str = Field(..., max_length=500, description="Password to audit for entropy and crack-time")


class EmailHeaderRequest(BaseModel):
    raw_headers: str = Field(..., min_length=10, max_length=50000, description="Raw email headers to inspect")


class IncidentResponseRequest(BaseModel):
    incident_type: str = Field(..., description="Type of incident (e.g. Card Phishing, Unauthorized Wire, Account Hijack)")
    details: str = Field(..., min_length=5, max_length=5000, description="What happened, what was clicked or shared")
    estimated_loss: Optional[str] = Field(default="", description="Estimated financial loss if applicable")


class PsychProfileRequest(BaseModel):
    text: str = Field(..., min_length=5, max_length=10000, description="Suspicious text or message to profile for psychological vectors")


class BreachCheckRequest(BaseModel):
    query: str = Field(..., min_length=3, max_length=255, description="Email or username to simulate dark web breach exposure")


class CryptoAuditRequest(BaseModel):
    payload: str = Field(..., min_length=3, max_length=5000, description="Smart contract call, transaction data, wallet address, or Web3 airdrop message")


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


# Beast AI Features
@router.post("/incident-response", summary="AI Incident Responder: Emergency triage & dispute letter drafting")
async def incident_response_endpoint(payload: IncidentResponseRequest):
    try:
        return await generate_incident_response_with_ai(
            incident_type=payload.incident_type,
            details=payload.details,
            estimated_loss=payload.estimated_loss or ""
        )
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Incident AI error: {str(e)}")


@router.post("/psych-profile", summary="AI Cyber-Psychologist: Manipulation vectors & cognitive bias breakdown")
async def psych_profile_endpoint(payload: PsychProfileRequest):
    try:
        return await audit_psychological_triggers_with_ai(payload.text)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Psych AI error: {str(e)}")


@router.post("/breach-check", summary="Dark Web & Data Breach Exposure Simulator")
def breach_check_endpoint(payload: BreachCheckRequest):
    return simulate_breach_check(payload.query)


@router.post("/crypto-audit", summary="AI Web3 & Smart Contract Drainer Sentry")
async def crypto_audit_endpoint(payload: CryptoAuditRequest):
    try:
        return await audit_crypto_web3_with_ai(payload.payload)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Crypto AI error: {str(e)}")
