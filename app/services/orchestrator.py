import re
import asyncio
from typing import Dict, Any, List
from .resume_parser import resume_parser_service
from .skill_matcher import skill_matcher_service
from .probability_model import probability_model_service
from .ai_detector import ai_detector_service
from .resume_advisor import resume_advisor_service

class AnalysisOrchestrator:
    @staticmethod
    def _estimate_experience(text: str) -> float:
        """
        Simple heuristic to estimate years of experience from text.
        Searches for patterns like '5+ years', '3 years of experience', etc.
        """
        patterns = [
            r'(\d+)\+?\s*(?:years?|yrs?)\b',
            r'\b(?:experience|exp)\b\s*:\s*(\d+)',
        ]
        years = 0.0
        for pattern in patterns:
            matches = re.findall(pattern, text.lower())
            if matches:
                # Take the highest found number as a simple heuristic
                vals = [float(m) for m in matches if float(m) < 40] # cap at 40
                if vals:
                    years = max(years, max(vals))
        return years

    @staticmethod
    def _calculate_education_score(text: str) -> int:
        """
        Basic keyword scoring for education. 
        1: Basic, 3: Bachelor, 5: Master/PhD.
        """
        text = text.lower()
        if any(kw in text for kw in ['phd', 'doctorate', 'master', 'ms', 'mba', 'm.tech']):
            return 5
        if any(kw in text for kw in ['bachelor', 'bs', 'ba', 'b.tech', 'degree']):
            return 3
        return 1

    async def run_pipeline(self, file_content: bytes, filename: str, jd_text: str) -> Dict[str, Any]:
        # 1. Extract Text
        resume_text = await resume_parser_service.extract_text(file_content, filename)
        
        # 2. Match Skills & Score (TF-IDF)
        match_result = await skill_matcher_service.match_resume_to_jd(resume_text, jd_text)
        
        # 3. Calculate additional metrics for Probability Model
        matched_skills = match_result["matched_skills"]
        skill_count = len(matched_skills)
        years_of_experience = self._estimate_experience(resume_text)
        education_score = self._calculate_education_score(resume_text)
        
        # 4. Predict Selection Probability
        prob_features = {
            "match_score": match_result["match_score"],
            "skill_count": skill_count,
            "years_of_experience": years_of_experience,
            "education_score": education_score
        }
        selection_prob = probability_model_service.predict_probability(prob_features)
        
        # 5. Detect AI-generated content (Gemini)
        ai_detection = await ai_detector_service.detect_ai_generated(resume_text)
        
        # 6. Generate AI Suggestions
        suggestions = await resume_advisor_service.generate_resume_suggestions(
            resume_text, jd_text, match_result["missing_skills"], match_result["match_score"]
        )
        
        # 7. Generate Summary
        summary = self._generate_summary(match_result, selection_prob, ai_detection)
        
        return {
            "resume_text": resume_text,
            "match_score": match_result["match_score"],
            "matched_skills": matched_skills,
            "missing_skills": match_result["missing_skills"],
            "selection_probability": selection_prob,
            "ai_generated_probability": ai_detection["ai_generated_probability"],
            "confidence_level": ai_detection["confidence_level"],
            "ai_reasoning": ai_detection["reasoning"],
            "improvement_suggestions": suggestions["improvement_suggestions"],
            "overall_feedback": suggestions["overall_feedback"],
            "summary": summary
        }

    def _generate_summary(self, match_result: dict, prob: float, ai: dict) -> str:
        missing = match_result["missing_skills"]
        score = match_result["match_score"]
        
        suggestion = "Complete match!" if score > 80 else f"Focus on gaining: {', '.join(missing[:3])}."
        if ai["ai_generated_probability"] > 70:
            suggestion += " Note: Content appears highly AI-generated."
            
        return f"Overall Match Score: {score}%. {suggestion}"

orchestrator = AnalysisOrchestrator()
