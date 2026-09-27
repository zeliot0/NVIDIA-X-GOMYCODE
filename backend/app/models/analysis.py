from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime, Float
from app.database.database import Base


class AnalysisRecord(Base):
    __tablename__ = "analyses"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, nullable=True)
    input_type = Column(String(50), nullable=False)  # text, url, image, voice, document
    source_preview = Column(String(255), nullable=True)
    risk = Column(String(20), nullable=False)        # LOW, MEDIUM, HIGH, CRITICAL
    score = Column(Integer, nullable=False)          # 0-100
    threat_type = Column(String(100), nullable=False)
    confidence = Column(Float, default=0.9)
    indicators_json = Column(Text, nullable=True)    # JSON string
    explanation = Column(Text, nullable=False)
    attacker_goal = Column(Text, nullable=True)
    recommendations_json = Column(Text, nullable=True)
    educational_tip = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
