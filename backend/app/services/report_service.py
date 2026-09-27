import json
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from app.models.analysis import AnalysisRecord
from app.models.report import ReportRecord


def save_analysis_record(db: Session, input_type: str, analysis: Dict[str, Any], preview: str = "") -> AnalysisRecord:
    """
    Saves security analysis to SQLite database while sanitizing sensitive details.
    """
    indicators = analysis.get("indicators", [])
    recommendations = analysis.get("recommendations", [])

    record = AnalysisRecord(
        input_type=input_type,
        source_preview=preview[:200] if preview else f"{input_type.upper()} submission",
        risk=analysis.get("risk", "LOW"),
        score=int(analysis.get("score", 0)),
        threat_type=analysis.get("threat_type", "Unknown"),
        confidence=float(analysis.get("confidence", 0.9)),
        indicators_json=json.dumps(indicators),
        explanation=analysis.get("explanation", ""),
        attacker_goal=analysis.get("attacker_goal", ""),
        recommendations_json=json.dumps(recommendations),
        educational_tip=analysis.get("educational_tip", ""),
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    # Also generate linked report
    report = ReportRecord(
        analysis_id=record.id,
        summary=f"Analysis of {input_type.upper()}: {record.threat_type} (Risk: {record.risk})",
        attacker_goal=record.attacker_goal,
        recommendations=record.recommendations_json,
        educational_tip=record.educational_tip
    )
    db.add(report)
    db.commit()

    return record


def get_all_analyses(db: Session, limit: int = 50) -> List[Dict[str, Any]]:
    records = db.query(AnalysisRecord).order_by(AnalysisRecord.created_at.desc()).limit(limit).all()
    results = []
    for r in records:
        try:
            indicators = json.loads(r.indicators_json) if r.indicators_json else []
        except Exception:
            indicators = []

        try:
            recommendations = json.loads(r.recommendations_json) if r.recommendations_json else []
        except Exception:
            recommendations = []

        results.append({
            "id": r.id,
            "input_type": r.input_type,
            "source_preview": r.source_preview,
            "risk": r.risk,
            "score": r.score,
            "threat_type": r.threat_type,
            "explanation": r.explanation,
            "attacker_goal": r.attacker_goal,
            "indicators": indicators,
            "recommendations": recommendations,
            "educational_tip": r.educational_tip,
            "created_at": r.created_at
        })
    return results


def get_analysis_by_id(db: Session, record_id: int) -> Optional[Dict[str, Any]]:
    r = db.query(AnalysisRecord).filter(AnalysisRecord.id == record_id).first()
    if not r:
        return None

    try:
        indicators = json.loads(r.indicators_json) if r.indicators_json else []
    except Exception:
        indicators = []

    try:
        recommendations = json.loads(r.recommendations_json) if r.recommendations_json else []
    except Exception:
        recommendations = []

    return {
        "id": r.id,
        "input_type": r.input_type,
        "source_preview": r.source_preview,
        "risk": r.risk,
        "score": r.score,
        "threat_type": r.threat_type,
        "confidence": r.confidence,
        "explanation": r.explanation,
        "attacker_goal": r.attacker_goal,
        "indicators": indicators,
        "recommendations": recommendations,
        "educational_tip": r.educational_tip,
        "created_at": r.created_at
    }


def delete_analysis_by_id(db: Session, record_id: int) -> bool:
    r = db.query(AnalysisRecord).filter(AnalysisRecord.id == record_id).first()
    if not r:
        return False
    db.query(ReportRecord).filter(ReportRecord.analysis_id == record_id).delete()
    db.delete(r)
    db.commit()
    return True
