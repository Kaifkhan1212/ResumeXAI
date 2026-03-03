import os
import joblib
import random
import pandas as pd
import numpy as np
from fastapi import HTTPException, status

class ProbabilityModelService:
    def __init__(self, model_path: str = "ml_models/selection_model.pkl"):
        self.model_path = model_path
        self.model = None
        self._load_model()

    def _load_model(self):
        """Loads the model if it exists."""
        if os.path.exists(self.model_path):
            try:
                self.model = joblib.load(self.model_path)
            except Exception as e:
                print(f"Error loading model: {e}")
                self.model = None
        else:
            print(f"Model file not found at {self.model_path}")

    def predict_probability(self, features: dict) -> float:
        """
        Predicts the selection probability based on normalized input features.
        Expected keys: match_score (0-100), skill_count (0-20), years_of_experience (0-15), education_score (1-5)
        """
        if self.model is None:
            self._load_model()
            if self.model is None:
                raise HTTPException(
                    status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                    detail="Selection model is not initialized. Please train the model first."
                )

        try:
            # 1. Normalize input features as requested
            # match_score -> divide by 100
            norm_match = features.get("match_score", 0) / 100.0
            
            # skill_count -> scale between 0-1 (assuming max 20)
            norm_skills = min(features.get("skill_count", 0) / 20.0, 1.0)
            
            # years_of_experience -> divide by 10 (max cap 10)
            norm_exp = min(features.get("years_of_experience", 0) / 10.0, 1.0)
            
            # education_score -> scale 1-5 into 0-1
            raw_edu = features.get("education_score", 1)
            norm_edu = (max(1, min(5, raw_edu)) - 1) / 4.0
            
            normalized_features = {
                'match_score': norm_match,
                'skill_count': norm_skills,
                'years_of_experience': norm_exp,
                'education_score': norm_edu
            }

            # Prepare data for prediction
            input_df = pd.DataFrame([normalized_features])
            
            # Ensure correct feature order
            feature_order = ['match_score', 'skill_count', 'years_of_experience', 'education_score']
            input_df = input_df[feature_order]
            
            # 2. Predict probability using predict_proba
            # Returns [prob_0, prob_1]
            prob_1 = self.model.predict_proba(input_df)[0][1]
            probability = float(prob_1) * 100.0
            
            # 3. Apply smoothing for realism (5-95% range)
            if probability < 5:
                # Set to random between 5-15
                probability = random.uniform(5.0, 15.0)
            elif probability > 95:
                # Cap at 95
                probability = 95.0
                
            return round(probability, 2)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error during probability prediction: {str(e)}"
            )

# Instantiate as a singleton to load once
probability_model_service = ProbabilityModelService()
