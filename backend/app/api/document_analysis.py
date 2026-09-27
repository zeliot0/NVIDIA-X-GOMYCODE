from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from app.schemas.analysis import AnalysisResponse
from app.services.document_service import analyze_document
from app.services.report_service import save_analysis_record
from app.database.database import get_db

router = APIRouter(
    prefix="/analysis",
    tags=["Analysis"]
)


@router.post(
    "/document",
    response_model=AnalysisResponse,
    status_code=status.HTTP_200_OK,
    summary="Safely analyze a document (PDF, DOCX, TXT)",
    description="Extracts plain text safely without macro execution and checks for phishing, fraud, and malicious instructions."
)
async def analyze_document_endpoint(
    file: UploadFile = File(..., description="Document file (PDF, DOCX, TXT) to inspect"),
    db: Session = Depends(get_db)
):
    try:
        content = await file.read()
        result = await analyze_document(content, file.filename or "document.pdf")
        preview = result.get("extracted_preview", f"Document: {file.filename}")[:80]
        record = save_analysis_record(db, input_type="document", analysis=result, preview=preview)
        return AnalysisResponse(
            success=True,
            input_type="document",
            analysis=result,
            record_id=record.id
        )
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error analyzing document: {str(e)}"
        )
