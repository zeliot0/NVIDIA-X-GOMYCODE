from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.schemas.analysis import UrlAnalysisRequest, AnalysisResponse
from app.services.url_service import analyze_url
from app.services.report_service import save_analysis_record
from app.database.database import get_db

router = APIRouter(
    prefix="/analysis",
    tags=["Analysis"]
)


@router.post(
    "/url",
    response_model=AnalysisResponse,
    status_code=status.HTTP_200_OK,
    summary="Safely analyze a URL for security threats",
    description="Inspects URL structure, HTTPS, domain spoofing, punycode, and suspicious paths without visiting the destination."
)
async def analyze_url_endpoint(payload: UrlAnalysisRequest, db: Session = Depends(get_db)):
    try:
        result = analyze_url(payload.url)
        record = save_analysis_record(db, input_type="url", analysis=result, preview=payload.url[:80])
        return AnalysisResponse(
            success=True,
            input_type="url",
            analysis=result,
            record_id=record.id
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error analyzing URL: {str(e)}"
        )
