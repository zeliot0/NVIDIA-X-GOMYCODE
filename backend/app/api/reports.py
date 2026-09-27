from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.schemas.analysis import AnalysisHistoryItem
from app.services.report_service import get_all_analyses, get_analysis_by_id, delete_analysis_by_id
from app.database.database import get_db

router = APIRouter(
    prefix="/reports",
    tags=["Reports & History"]
)


@router.get(
    "",
    response_model=List[AnalysisHistoryItem],
    summary="List all historical security analyses",
    description="Returns the history of previous text, URL, image, document, and voice analyses."
)
def list_reports_endpoint(limit: int = 50, db: Session = Depends(get_db)):
    return get_all_analyses(db, limit=limit)


@router.get(
    "/{report_id}",
    response_model=AnalysisHistoryItem,
    summary="Get single security analysis report by ID",
    description="Fetches full detailed analysis, recommendations, and indicators for a specific report."
)
def get_report_endpoint(report_id: int, db: Session = Depends(get_db)):
    report = get_analysis_by_id(db, report_id)
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Report #{report_id} not found."
        )
    return report


@router.delete(
    "/{report_id}",
    status_code=status.HTTP_200_OK,
    summary="Delete a report from history",
    description="Removes analysis record and linked report."
)
def delete_report_endpoint(report_id: int, db: Session = Depends(get_db)):
    success = delete_analysis_by_id(db, report_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Report #{report_id} not found."
        )
    return {"success": True, "message": f"Report #{report_id} deleted."}
