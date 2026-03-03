import json
import google.generativeai as genai
from fastapi import HTTPException, status
from ..core.config import settings

class ResumeAdvisorService:
    def __init__(self):
        if settings.GEMINI_API_KEY:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            try:
                self.model = genai.GenerativeModel('gemini-2.5-flash')
            except Exception:
                self.model = genai.GenerativeModel('gemini-2.5-pro')
        else:
            self.model = None

    async def generate_resume_suggestions(self, resume_text: str, jd_text: str, missing_skills: list, match_score: float) -> dict:
        if not self.model:
            return {
                "improvement_suggestions": [],
                "overall_feedback": "Advisor service unavailable (API key missing)."
            }

        prompt = f"""
        Act as an expert career advisor. Analyze the following resume against the job description.
        
        Resume:
        {resume_text}
        
        Job Description:
        {jd_text}
        
        Identified Gaps (Missing Skills):
        {', '.join(missing_skills)}
        
        Current Match Score: {match_score}%
        
        Provide actionable, personalized suggestions to improve the resume quality and match the JD better.
        Return the result STRICTLY as a JSON object with the following structure:
        {{
            "improvement_suggestions": ["Suggestion 1", "Suggestion 2", ...],
            "overall_feedback": "A summary of the resume's strengths and weaknesses."
        }}
        """

        try:
            response = self.model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    response_mime_type="application/json",
                ),
            )
            
            try:
                result = json.loads(response.text)
                return result
            except json.JSONDecodeError:
                return {
                    "improvement_suggestions": [f"Focus on learning: {', '.join(missing_skills[:3])}"],
                    "overall_feedback": "Could not generate detailed feedback."
                }

        except Exception as e:
            print(f"Resume Advisor Error: {e}")
            return {
                "improvement_suggestions": [],
                "overall_feedback": "Service encountered an error while generating suggestions."
            }

resume_advisor_service = ResumeAdvisorService()
