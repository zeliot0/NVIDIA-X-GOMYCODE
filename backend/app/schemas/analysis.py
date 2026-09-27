from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field
from datetime import datetime


class TextAnalysisRequest(BaseModel):
    text: str = Field(
        ...,
        min_length=1,
        max_length=10000,
        description="The text message, email content, or communication to analyze for security threats."
    )


class UrlAnalysisRequest(BaseModel):
    url: str = Field(
        ...,
        min_length=3,
        max_length=2048,
        description="The URL or web address to analyze for security risks."
    )


class IndicatorDetail(BaseModel):
    type: str
    evidence: str
    severity: str  # low, medium, high, critical


class SecurityAnalysisResult(BaseModel):
    risk: str = Field(..., description="Overall risk level: LOW, MEDIUM, HIGH, or CRITICAL")
    score: int = Field(..., ge=0, le=100, description="Risk score from 0 (harmless) to 100 (maximum risk)")
    threat_type: str = Field(..., description="Categorized threat type (e.g., Phishing, Fake Reward, Suspicious URL, Safe)")
    confidence: float = Field(default=0.9, ge=0.0, le=1.0, description="Confidence score between 0.0 and 1.0")
    indicators: List[str] = Field(default_factory=list, description="High-level list of detected threat indicators")
    indicator_details: List[IndicatorDetail] = Field(default_factory=list, description="Detailed breakdown with evidence and severity")
    explanation: str = Field(..., description="Plain-language explanation of what was detected and why")
    attacker_goal: str = Field(..., description="Suspected objective of the attacker or scammer")
    recommendations: List[str] = Field(default_factory=list, description="Actionable immediate recommendations for the user")
    educational_tip: str = Field(..., description="Security tip explaining the tactics used and how to stay safe")
    uncertainty: Optional[str] = Field(default=None, description="Any areas where certainty is limited without further context")


class AnalysisResponse(BaseModel):
    success: bool = True
    input_type: str  # text, url, image, voice, document
    analysis: SecurityAnalysisResult
    record_id: Optional[int] = None


TextAnalysisResponse = AnalysisResponse


class ChatMessage(BaseModel):
    role: str  # user, assistant, system
    content: str


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000, description="User question for the cybersecurity coach")
    history: List[ChatMessage] = Field(default_factory=list, description="Recent conversation history")


class ChatResponse(BaseModel):
    response: str
    educational_tips: List[str] = Field(default_factory=list)
    suggested_questions: List[str] = Field(default_factory=list)


class AnalysisHistoryItem(BaseModel):
    id: int
    input_type: str
    source_preview: Optional[str]
    risk: str
    score: int
    threat_type: str
    explanation: str
    attacker_goal: Optional[str]
    indicators: List[str] = Field(default_factory=list)
    recommendations: List[str] = Field(default_factory=list)
    educational_tip: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True
