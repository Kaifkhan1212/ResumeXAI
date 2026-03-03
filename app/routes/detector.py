from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from ..services.ai_detector import ai_detector_service, AIDetectorService

router = APIRouter(tags=["AI Detection"])

class DetectorRequest(BaseModel):
    resume_text: str

class DetectorResponse(BaseModel):
    ai_generated_probability: float
    confidence_level: str
    reasoning: str

@router.post("/detect-ai", response_model=DetectorResponse)
async def detect_ai(
    request: DetectorRequest,
    service: AIDetectorService = Depends(lambda: ai_detector_service)
):
    if not request.resume_text.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Resume text must be provided."
        )

    result = await service.detect_ai_generated(request.resume_text)
    return result
