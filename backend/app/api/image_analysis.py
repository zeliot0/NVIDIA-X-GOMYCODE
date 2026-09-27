from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from app.schemas.analysis import AnalysisResponse
from app.services.image_service import analyze_image_screenshot
from app.services.report_service import save_analysis_record
from app.database.database import get_db

router = APIRouter(
    prefix="/analysis",
    tags=["Analysis"]
)


@router.post(
    "/image",
    response_model=AnalysisResponse,
    status_code=status.HTTP_200_OK,
    summary="Analyze a screenshot or image for cybersecurity threats",
    description="Validates image file and evaluates interface elements, login spoofing, and brand impersonation."
)
async def analyze_image_endpoint(
    file: UploadFile = File(..., description="Image file (PNG, JPG, WEBP) to inspect"),
    db: Session = Depends(get_db)
):
    try:
        content = await file.read()
        result = await analyze_image_screenshot(content, file.filename or "screenshot.png", file.content_type or "")
        record = save_analysis_record(db, input_type="image", analysis=result, preview=f"Screenshot: {file.filename}")
        return AnalysisResponse(
            success=True,
            input_type="image",
            analysis=result,
            record_id=record.id
        )
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error analyzing image: {str(e)}"
        )
