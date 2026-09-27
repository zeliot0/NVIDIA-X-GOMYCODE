from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from app.schemas.analysis import AnalysisResponse
from app.services.voice_service import analyze_voice
from app.services.report_service import save_analysis_record
from app.database.database import get_db

router = APIRouter(
    prefix="/analysis",
    tags=["Analysis"]
)


@router.post(
    "/voice",
    response_model=AnalysisResponse,
    status_code=status.HTTP_200_OK,
    summary="Analyze a voice recording or audio message",
    description="Transcribes audio and evaluates conversation for social engineering, vishing, urgency, and OTP interception."
)
async def analyze_voice_endpoint(
    file: UploadFile = File(..., description="Audio file (WAV, MP3, M4A, OGG) to inspect"),
    db: Session = Depends(get_db)
):
    try:
        content = await file.read()
        result = await analyze_voice(content, file.filename or "recording.wav")
        preview_text = result.get("transcript", f"Voice recording: {file.filename}")[:80]
        record = save_analysis_record(db, input_type="voice", analysis=result, preview=preview_text)
        return AnalysisResponse(
            success=True,
            input_type="voice",
            analysis=result,
            record_id=record.id
        )
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error analyzing voice recording: {str(e)}"
        )
