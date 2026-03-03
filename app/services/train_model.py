import os
import joblib
import pandas as pd
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split

def train_and_save_model():
    # 1. Create synthetic dataset
    np.random.seed(42)
    num_samples = 1000
    
    # Raw features
    raw_match_score = np.random.uniform(0, 100, num_samples)
    raw_skill_count = np.random.randint(0, 21, num_samples)
    raw_years_of_experience = np.random.uniform(0, 15, num_samples)
    raw_education_score = np.random.randint(1, 6, num_samples)
    
    # Normalized features for training as per requirements
    match_score = raw_match_score / 100.0
    skill_count = raw_skill_count / 20.0
    years_of_experience = np.clip(raw_years_of_experience / 10.0, 0, 1.0)
    education_score = (raw_education_score - 1) / 4.0 # Scale 1-5 to 0-1
    
    # Simple probability logic for synthetic data using normalized features
    logit = (2.0 * match_score + 1.5 * skill_count + 1.2 * years_of_experience + 0.8 * education_score - 2.5)
    probability = 1 / (1 + np.exp(-logit))
    shortlisted = (probability > 0.5).astype(int)
    
    df = pd.DataFrame({
        'match_score': match_score,
        'skill_count': skill_count,
        'years_of_experience': years_of_experience,
        'education_score': education_score,
        'shortlisted': shortlisted
    })
    
    # 2. Train model
    X = df.drop('shortlisted', axis=1)
    y = df['shortlisted']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Use liblinear as requested
    model = LogisticRegression(solver="liblinear")
    model.fit(X_train, y_train)
    
    # 3. Save model
    model_dir = "ml_models"
    if not os.path.exists(model_dir):
        os.makedirs(model_dir)
        
    model_path = os.path.join(model_dir, "selection_model.pkl")
    joblib.dump(model, model_path)
    print(f"Model saved to {model_path}")

if __name__ == "__main__":
    train_and_save_model()
