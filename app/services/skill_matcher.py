import re
from typing import List, Tuple
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

class SkillMatcherService:
    @staticmethod
    def _preprocess_text(text: str) -> str:
        """Basic text preprocessing for vectorization."""
        # Lowercase and remove non-alphanumeric characters but keep spaces
        text = text.lower()
        text = re.sub(r'[^a-z0-9\s]', ' ', text)
        return re.sub(r'\s+', ' ', text).strip()

    def _extract_keywords(self, text: str) -> set:
        """
        Extracts potential keywords from text. 
        In a production app, this would ideally use a predefined skills database or NLP model.
        For this implementation, we'll treat unique words in the JD as potential skills.
        """
        text = self._preprocess_text(text)
        # Filters out very short words and common stop words (implicitly via TF-IDF later if needed)
        words = set(re.findall(r'\b\w{2,}\b', text))
        return words

    async def match_resume_to_jd(self, resume_text: str, jd_text: str) -> dict:
        """
        Calculates match score using TF-IDF and Cosine Similarity.
        Extracts matched and missing skills based on keyword overlap.
        """
        # 1. Calculate Score using TF-IDF and Cosine Similarity
        vectorizer = TfidfVectorizer(stop_words='english')
        tfidf_matrix = vectorizer.fit_transform([resume_text, jd_text])
        
        # Compute cosine similarity between the two documents
        similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        match_score = round(float(similarity) * 100, 2)

        # 2. Extract Skills (Keyword Matching)
        # This is a basic approach. Better: use a curated List of skills.
        jd_keywords = self._extract_keywords(jd_text)
        resume_keywords = self._extract_keywords(resume_text)

        matched_skills = sorted(list(jd_keywords.intersection(resume_keywords)))
        missing_skills = sorted(list(jd_keywords.difference(resume_keywords)))

        # Limit missing skills to most relevant if list is too huge
        # (Heuristic: in a real app, you'd match against a known Skill Dictionary)
        
        return {
            "match_score": match_score,
            "matched_skills": matched_skills,
            "missing_skills": missing_skills
        }

skill_matcher_service = SkillMatcherService()
