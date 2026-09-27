from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime


class ReportDetail(BaseModel):
    id: int
    analysis_id: int
    summary: str
    risk: str
    score: int
    threat_type: str
    indicators: List[str]
    attacker_goal: Optional[str]
    recommendations: List[str]
    educational_tip: Optional[str]
    created_at: datetime
