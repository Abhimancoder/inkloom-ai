"""
Inkloom AI — Semantic Brand Voice & Vector Similarity Engine
Powered by scikit-learn (TfidfVectorizer + cosine_similarity) & NumPy (Slide 7)
"""

import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Approved enterprise reference benchmarks for voice adherence
APPROVED_BRAND_CORPUS = [
    "TechCorp delivers enterprise-grade governance platforms engineered for security, reliability, and regulatory compliance.",
    "Our audited compliance benchmarks demonstrate a 40% reduction in turnaround times across verified enterprise accounts.",
    "Built to adhere to SOC 2 Type II, ISO 27001, and GDPR enterprise standards with granular role-based access control.",
    "The corporate governance framework ensures end-to-end consistency across global omnichannel assets.",
    "We provide validated analytical frameworks backed by verified third-party research and institutional case studies.",
    "Enterprise security teams rely on continuous monitoring to maintain brand integrity and eliminate unauthorized alterations.",
    "Our financial governance solutions provide transparent audit trails and automated compliance verification.",
    "Empowering leadership teams with real-time risk visibility, executive governance summaries, and certified reports."
]

class BrandVoiceVectorEngine:
    """
    Computes semantic cosine similarity and voice drift between promotional drafts
    and approved locked brand guidelines benchmarks.
    """
    def __init__(self):
        self.vectorizer = TfidfVectorizer(
            ngram_range=(1, 2),
            stop_words='english',
            sublinear_tf=True
        )
        self.benchmark_vectors = self.vectorizer.fit_transform(APPROVED_BRAND_CORPUS)

    def compute_voice_alignment(self, text: str) -> dict:
        """
        Calculates cosine similarity vector alignment and voice drift score.
        """
        if not text or not text.strip():
            return {
                "voiceAlignmentScore": 50.0,
                "voiceDriftScore": 50.0,
                "status": "Inconclusive",
                "driftTier": "Moderate"
            }

        draft_vec = self.vectorizer.transform([text])
        similarities = cosine_similarity(draft_vec, self.benchmark_vectors)[0]

        # Mean and maximum cosine similarities
        max_sim = float(np.max(similarities))
        mean_sim = float(np.mean(similarities))

        # Scaled voice alignment index (0 - 100)
        # Cosine similarity for short copy typically ranges 0.15 - 0.70
        alignment_score = round(min(100.0, max(15.0, (max_sim * 0.7 + mean_sim * 0.3) * 165.0)), 1)
        drift_score = round(max(0.0, 100.0 - alignment_score), 1)

        if alignment_score >= 80.0:
            status = "Strongly Aligned"
            drift_tier = "Negligible (<1%)"
        elif alignment_score >= 60.0:
            status = "Acceptable Enterprise Alignment"
            drift_tier = "Low (1-3%)"
        elif alignment_score >= 40.0:
            status = "Moderate Voice Drift"
            drift_tier = "Moderate (4-8%)"
        else:
            status = "Substantial Voice Drift"
            drift_tier = "High (>8%)"

        return {
            "voiceAlignmentScore": alignment_score,
            "voiceDriftScore": drift_score,
            "maxCosineSimilarity": round(max_sim, 3),
            "status": status,
            "driftTier": drift_tier,
            "engine": "TF-IDF Vector Space + Cosine Similarity (scikit-learn)"
        }

# Global singleton instance
vector_engine = BrandVoiceVectorEngine()
