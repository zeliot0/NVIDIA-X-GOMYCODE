from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime
from app.database.database import Base


class ReportRecord(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    analysis_id = Column(Integer, index=True, nullable=False)
    summary = Column(Text, nullable=False)
    attacker_goal = Column(Text, nullable=True)
    recommendations = Column(Text, nullable=True)
    educational_tip = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
