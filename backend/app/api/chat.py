from fastapi import APIRouter, HTTPException, status
from app.schemas.analysis import ChatRequest, ChatResponse
from app.services.ai_service import security_chat

router = APIRouter(
    prefix="/chat",
    tags=["Cyber Coach"]
)


@router.post(
    "",
    response_model=ChatResponse,
    status_code=status.HTTP_200_OK,
    summary="Ask questions to the SAFEAI Cybersecurity Coach",
    description="Conversational educational assistant explaining phishing, MFA, passwords, and security habits."
)
async def chat_with_coach_endpoint(payload: ChatRequest):
    try:
        history_dicts = [{"role": h.role, "content": h.content} for h in payload.history]
        result = await security_chat(payload.message, history_dicts)
        return ChatResponse(
            response=result.get("response", "I am your SAFEAI cybersecurity coach. How can I assist you with your digital security?"),
            educational_tips=result.get("educational_tips", []),
            suggested_questions=result.get("suggested_questions", [])
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error in cybersecurity coach: {str(e)}"
        )
