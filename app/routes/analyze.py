from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from ..services.skill_matcher import skill_matcher_service, SkillMatcherService

router = APIRouter(tags=["Analysis"])

class AnalyzeRequest(BaseModel):
    resume_text: str
    job_description: str

class AnalyzeResponse(BaseModel):
    match_score: float
    matched_skills: list[str]
    missing_skills: list[str]

@router.post("/analyze-resume", response_model=AnalyzeResponse)
async def analyze_resume(
    request: AnalyzeRequest,
    service: SkillMatcherService = Depends(lambda: skill_matcher_service)
):
    if not request.resume_text.strip() or not request.job_description.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Both resume text and job description must be provided."
        )

    try:
        result = await service.match_resume_to_jd(
            request.resume_text, 
            request.job_description
        )
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred during analysis: {str(e)}"
        )
