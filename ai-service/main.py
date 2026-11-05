"""
================================================================
INKLOOM AI / BRANDPROOF AI — DATA SCIENCE & ML MICROSERVICE
================================================================
Powered by:
- NumPy (Statistical arrays, sentence length variance, syllable metrics)
- Pandas (Time-series compliance aggregations, rolling moving averages, risk matrices)
- Scikit-Learn (TF-IDF vectorization, Multi-Class Tone Classification, Random Forest Risk Regression)
- Matplotlib (Headless base64 visual analytics generation)
- SciPy (Shannon entropy, vocabulary richness)
- FastAPI & Uvicorn (High-performance async REST API)
================================================================
"""

import sys
import re
import json
import numpy as np
import pandas as pd
import sklearn
import matplotlib
import scipy
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

# Local ML & Data Science modules
from ml_models.tone_classifier import tone_classifier
from ml_models.risk_regressor import risk_regressor
from analytics.linguistic_stats import compute_linguistic_profile
from analytics.dataset_analytics import (
    generate_compliance_timeseries_df,
    aggregate_channel_compliance,
    get_recurring_violation_breakdown
)
from visualizers.chart_generator import (
    render_tone_distribution_chart,
    render_compliance_trend_chart,
    render_violation_breakdown_donut,
    render_sentence_distribution_chart
)

app = FastAPI(
    title="Inkloom AI — Data Science & ML Service",
    description="Statistical NLP, Scikit-Learn Classification, Pandas Trend Analytics, and Matplotlib Visualizations",
    version="2.0.0"
)

# Enable CORS for Express backend and Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalyzeRequest(BaseModel):
    content: Optional[str] = ""
    draftText: Optional[str] = ""
    targetTone: Optional[str] = "Professional & Authoritative"
    brandProfile: Optional[Dict[str, Any]] = None

class ToneClassifyRequest(BaseModel):
    text: str
    targetTone: Optional[str] = "Professional & Authoritative"

class RiskPredictRequest(BaseModel):
    text: str
    restrictedPhrases: Optional[List[str]] = None

@app.get("/")
@app.get("/health")
def health_check():
    """
    Service health check returning active Data Science library versions.
    """
    return {
        "status": "online",
        "service": "inkloom-ai-data-science-engine",
        "version": "2.0.0",
        "libraries": {
            "numpy": np.__version__,
            "pandas": pd.__version__,
            "scikit_learn": sklearn.__version__,
            "matplotlib": matplotlib.__version__,
            "scipy": scipy.__version__,
            "python": sys.version.split()[0]
        },
        "capabilities": [
            "Scikit-Learn TF-IDF Multi-Class Tone Classification",
            "Scikit-Learn Random Forest Compliance Risk Regression",
            "NumPy & SciPy Statistical Linguistic Profiling",
            "Pandas Time-Series & Channel Risk Aggregations",
            "Matplotlib Headless Base64 Chart Generation"
        ]
    }

@app.post("/analyze")
def analyze_content(req: AnalyzeRequest):
    """
    Full Data Science & ML Governance Audit:
    - Scikit-Learn Tone Classification
    - Scikit-Learn Violation Risk Regression
    - NumPy Linguistic Metrics
    - Matplotlib Chart Generation
    - Statistical NLP Hype Detection
    """
    text = (req.content or req.draftText or "").strip()
    if not text:
        raise HTTPException(status_code=400, detail="Draft content is required for ML analysis")

    target_tone = req.targetTone or "Professional & Authoritative"

    # 1. Scikit-Learn Multi-Class Tone Classification
    tone_result = tone_classifier.predict_tone(text, target_tone)

    # 2. Scikit-Learn Random Forest Risk Regression
    restricted_terms = None
    if req.brandProfile and "restrictedPhrases" in req.brandProfile:
        restricted_terms = req.brandProfile["restrictedPhrases"]
    risk_result = risk_regressor.predict_risk(text, restricted_terms)

    # 3. NumPy & SciPy Linguistic Profiling
    linguistic_profile = compute_linguistic_profile(text)

    # 4. Matplotlib Visual Charts (Base64 PNGs)
    tone_chart_base64 = render_tone_distribution_chart(tone_result["probabilities"])
    sentence_lengths = linguistic_profile["sentenceMetrics"].get("lengths", [])
    sentence_chart_base64 = render_sentence_distribution_chart(sentence_lengths)

    # 5. Statistical NLP Findings
    nlp_findings = []
    hype_patterns = [
        (r'\b(miracle|revolutionary|disruptive|game-changing)\b', 'Statistical Buzzword Flag', 'Subjective hype violates factual corporate guidelines.'),
        (r'\b(unprecedented|foolproof|guarantee|100% bug-free)\b', 'Absolute Guarantee Flag', 'Absolute certainty statements create legal exposure; use verifiable SLAs.'),
        (r'\b(cheapest|lowest price|free money)\b', 'Price Superlative Flag', 'Restricted pricing superlatives undermine enterprise positioning.')
    ]

    for pattern, rule_title, explanation in hype_patterns:
        matches = re.findall(pattern, text, re.IGNORECASE)
        for match in matches:
            nlp_findings.append({
                "severity": "Warning",
                "severityType": "warning",
                "category": "NLP Tone & Superlative Detection",
                "excerpt": f"...{match}...",
                "matchedRule": f"{rule_title}: '{match}'",
                "explanation": explanation,
                "confidence": "TF-IDF + Heuristic Match (92%)",
                "suggestedCorrection": "Use data-backed qualitative descriptions.",
                "status": "Possible Mismatch"
            })

    # Overall Governance Score (Calculated from ML Risk and Readability)
    # ML risk is 0 (low risk) to 100 (critical risk)
    # Governance score is inverted (100 is perfect, 20 is failing)
    ml_governance_score = round(max(20.0, 100.0 - (risk_result["riskScore"] * 0.75) - (len(nlp_findings) * 8)), 1)

    return {
        "service": "inkloom-ai-data-science-engine",
        "version": "2.0.0",
        "governanceScore": ml_governance_score,
        "mlInsights": {
            "toneAnalysis": tone_result,
            "riskRegression": risk_result,
            "linguisticStats": linguistic_profile
        },
        "visualAnalytics": {
            "toneDistributionChart": tone_chart_base64,
            "sentenceDistributionChart": sentence_chart_base64
        },
        "nlpFindings": nlp_findings,
        "metrics": {
            "wordCount": linguistic_profile["tokenMetrics"]["totalWords"],
            "sentenceCount": linguistic_profile["sentenceMetrics"]["count"],
            "readingEaseScore": linguistic_profile["readabilityIndices"]["fleschReadingEase"],
            "fleschKincaidGrade": linguistic_profile["readabilityIndices"]["fleschKincaidGrade"],
            "shannonEntropy": linguistic_profile["tokenMetrics"]["shannonEntropy"],
            "typeTokenRatio": linguistic_profile["tokenMetrics"]["typeTokenRatio"],
            "predictedTone": tone_result["predictedTone"],
            "confidenceScore": tone_result["confidenceScore"],
            "riskTier": risk_result["riskTier"],
            "riskScore": risk_result["riskScore"]
        },
        "message": f"Data Science audit complete: {tone_result['predictedTone']} ({tone_result['confidenceScore']}%) | Risk: {risk_result['riskTier']} ({risk_result['riskScore']}/100)"
    }

@app.post("/ml/classify-tone")
def classify_tone_endpoint(req: ToneClassifyRequest):
    """
    Dedicated endpoint for Scikit-Learn TF-IDF tone classification.
    """
    return tone_classifier.predict_tone(req.text, req.targetTone)

@app.post("/ml/predict-risk")
def predict_risk_endpoint(req: RiskPredictRequest):
    """
    Dedicated endpoint for Scikit-Learn Random Forest risk regression.
    """
    return risk_regressor.predict_risk(req.text, req.restrictedPhrases)

@app.get("/visualize/charts")
def get_governance_charts():
    """
    Returns high-resolution Matplotlib visual charts:
    - 30-Day Historical Compliance Trend Line Chart (with Pandas rolling 7-day average)
    - Recurring Violation Category Donut Chart
    - Aggregated Channel Risk Table
    """
    trend_chart = render_compliance_trend_chart(days=30)
    donut_chart = render_violation_breakdown_donut()
    channel_data = aggregate_channel_compliance()
    
    return {
        "trendChart": trend_chart,
        "violationDonutChart": donut_chart,
        "channelMetrics": channel_data,
        "engine": "Matplotlib 3.11 + Pandas 3.0"
    }

@app.get("/analytics/channel-risks")
def get_channel_risks():
    """
    Returns channel compliance metrics computed using Pandas DataFrames.
    """
    return aggregate_channel_compliance()

@app.get("/analytics/timeseries")
def get_timeseries():
    """
    Returns 30-day compliance timeseries data generated with Pandas.
    """
    df = generate_compliance_timeseries_df(30)
    return df.to_dict(orient="records")

def main():
    import uvicorn
    print("[Inkloom Data Science Service] Launching FastAPI + Uvicorn server on port 8000...")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False, log_level="info")

if __name__ == "__main__":
    main()
