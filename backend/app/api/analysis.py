from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.schemas.analysis import TextAnalysisRequest, AnalysisResponse
from app.services.security_service import analyze_text_security
from app.services.ai_service import analyze_text_with_ai
from app.services.report_service import save_analysis_record
from app.database.database import get_db

router = APIRouter(
    prefix="/analysis",
    tags=["Analysis"]
)


@router.post(
    "/text",
    response_model=AnalysisResponse,
    status_code=status.HTTP_200_OK,
    summary="Analyze text or message for security threats",
    description="Analyzes input text using cybersecurity heuristics + AI reasoning to detect phishing, urgency, credential theft, and scams."
)
async def analyze_text_endpoint(payload: TextAnalysisRequest, db: Session = Depends(get_db)):
    try:
        # 1. Deterministic cybersecurity scan
        deterministic_result = analyze_text_security(payload.text)

        # 2. AI semantic assessment (enhances or confirms)
        ai_result = await analyze_text_with_ai(payload.text, deterministic_result)

        # 3. Save to database history
        record = save_analysis_record(db, input_type="text", analysis=ai_result, preview=payload.text[:80])

        return AnalysisResponse(
            success=True,
            input_type="text",
            analysis=ai_result,
            record_id=record.id
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error performing text security analysis: {str(e)}"
        )
