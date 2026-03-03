# System Workflow & Architecture 🛠️

This document provides a technical deep-dive into the end-to-end processing logic of the **AI Resume Analyzer**. It details the journey of a resume from upload to final intelligent visualization.

---

## 🏗️ System Overview

The AI Resume Analyzer is a multi-stage evaluation engine that combines **Classical NLP**, **Statistical Machine Learning**, and **Large Language Models (LLMs)**. The system is designed to provide not just a score, but a comprehensive, explainable analysis of a candidate's suitability for a specific role.

---

## 🔄 End-to-End Workflow

### 1. Resume Submission & Text Extraction
- **Input**: User uploads a PDF or DOCX file via the React frontend.
- **Process**: The backend utilizes `PyPDF2` (for PDFs) and `python-docx` (for DOCX) to extract raw text.
- **Output**: Cleaned, UTF-8 encoded plain text string.

### 2. Semantic Analysis & Skill Matching
- **Technique**: TF-IDF (Term Frequency-Inverse Document Frequency) Vectorization.
- **Logic**: The system builds a vocabulary from both the resume and the job description.
- **Scoring**: **Cosine Similarity** is applied to the two vectors to generate a semantic match score (0-100%).
- **Gap Analysis**: Set-based comparison between extracted skills from both texts to identify "Matched" and "Missing" competencies.

### 3. Feature Engineering & Selection Prediction
- **Input**: Match Score, Skill Count, Experience Years (heuristic-based), and Education Level.
- **ML Model**: **Logistic Regression** (Binary Classification).
- **Process**: Features are normalized (0-1 scale) and passed through the trained `scikit-learn` model.
- **Output**: A probabilistic value representing the "Selection Probability."

### 4. Neural Evaluation (Generative AI)
- **Model**: Google Gemini 2.5 Flash.
- **Analysis**: The raw texts and calculated scores are sent to the LLM with a structured prompt.
- **Modules**:
    - **AI Detection**: Probability analysis based on linguistic patterns.
    - **Neural Reasoning**: Explanatory text justifying the calculated scores.
    - **Growth Blueprint**: Generates 3-5 high-impact, personalized suggestions.
- **Parsing**: Strict JSON-mode response for seamless frontend integration.

### 5. Persistence & Visualization
- **Storage**: The entire `AnalysisResult` object is persisted in **PostgreSQL**.
- **Display**: The React Dashboard receives the JSON response and renders dynamic charts (Recharts) and animated panels (Framer Motion).

---

## 🗺️ Architecture Flow Diagram

```text
[ User Interface ]  <--->  [ REST API Layer ]  <--->  [ Orchestrator ]
      (React)               (FastAPI)              (Logic Control)
                                |
      __________________________|__________________________
     |              |                    |                 |
[ NLP Engine ] [ ML Service ] [ AI Detector/Advisor ] [ PostgreSQL ]
 (TF-IDF)      (LogReg)          (Gemini 2.5)          (SQLAlchemy)
```

---

## 📡 Data Flow Explanation

1. **Client -> Server**: `Multipart/form-data` containing the binary file and JD string.
2. **Server -> Services**: The `OrchestrationService` serially triggers extraction -> matching -> prediction -> AI evaluation.
3. **Services -> Database**: **SQLAlchemy** commits the consolidated analysis model to the `resume_analyses` table.
4. **Server -> Client**: A structured JSON payload containing 10+ data points for real-time dashboard rendering.

---

## 🧠 Explainable AI (XAI) Implementation

The system bridges the gap between **Black-Box AI** and **Transparent Analytics**:

1. **Classical ML (Integrity)**: Statistical models (Logistic Regression) provide a bedrock of objective, repeatable scores based on hard features.
2. **Generative AI (Intelligence)**: LLMs (Gemini) provide the "Why" behind the "What." While the ML model gives a 75% score, the LLM explains that this is due to a strong backend foundation but limited cloud exposure.
3. **Synthesis**: By combining these two, the AI Resume Analyzer offers a "Growth Blueprint" that translates numerical data into actionable human advice.

---
*Built as a technical reference for the AI Resume Analyzer System Architecture.*
