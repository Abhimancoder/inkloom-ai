"""
Inkloom AI — BrandProof Machine Learning Tone Classification Engine
Powered by scikit-learn (TfidfVectorizer + LogisticRegression)
"""

import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline

# Curated benchmark dataset of diverse enterprise copywriting patterns
TRAINING_DATA = [
    # 1. Professional & Authoritative (Compliant Enterprise Tone)
    ("TechCorp delivers enterprise-grade governance platforms engineered for security, reliability, and regulatory compliance.", "Professional & Authoritative"),
    ("Our audited compliance benchmarks demonstrate a 40% reduction in governance turnaround times across audited organizations.", "Professional & Authoritative"),
    ("Built to adhere to SOC 2 Type II, ISO 27001, and GDPR enterprise standards with granular role-based access control.", "Professional & Authoritative"),
    ("The corporate governance framework ensures end-to-end consistency across global omnichannel assets.", "Professional & Authoritative"),
    ("We provide validated analytical frameworks backed by verified third-party research and institutional case studies.", "Professional & Authoritative"),
    ("Enterprise security teams rely on continuous monitoring to maintain brand integrity and eliminate unauthorized alterations.", "Professional & Authoritative"),
    ("Our financial governance solutions provide transparent audit trails and automated compliance verification.", "Professional & Authoritative"),
    ("Empowering leadership teams with real-time risk visibility, executive governance summaries, and certified reports.", "Professional & Authoritative"),

    # 2. Casual & Conversational (Friendly / B2C Tone)
    ("Hey everyone! Check out our new platform updates, we think you're going to love what we built for you.", "Casual & Conversational"),
    ("Let's grab a coffee and chat about how we can make your daily work easier and way more fun.", "Casual & Conversational"),
    ("Say goodbye to messy spreadsheets and hello to super smooth teamwork with your favorite colleagues.", "Casual & Conversational"),
    ("Drop us a note whenever you want, we are always here to help you get the most out of your tools.", "Casual & Conversational"),
    ("Just wrapped up our weekly team hangout and we have some awesome little surprises coming your way.", "Casual & Conversational"),
    ("Quick question for you guys: what is your favorite hack for staying organized during crazy busy weeks?", "Casual & Conversational"),
    ("Don't sweat the small stuff, we made this tool so simple that anyone can master it in five minutes.", "Casual & Conversational"),

    # 3. Aggressive / Superlative Hype (High Violation Risk)
    ("We are offering the best in class solution at cheap rates, guaranteed to eliminate 100% of errors forever!", "Aggressive / Superlative Hype"),
    ("This is a miracle breakthrough! The fastest revolutionary platform on earth with zero risk and free money.", "Aggressive / Superlative Hype"),
    ("Unprecedented results! Millions of customers agree we are unbeatable and foolproof for everyone.", "Aggressive / Superlative Hype"),
    ("Guaranteed 100% bug-free automation with the cheapest prices on the market, absolutely guaranteed.", "Aggressive / Superlative Hype"),
    ("The greatest product ever invented, destroying all competition with mind-blowing revolutionary features.", "Aggressive / Superlative Hype"),
    ("Free money, 100% risk-free return, lowest price anywhere, guaranteed miracle cure for your problems.", "Aggressive / Superlative Hype"),
    ("Our revolutionary disruptive platform eliminates all mistakes instantly with foolproof perfection.", "Aggressive / Superlative Hype"),

    # 4. Technical & Architecture (Developer / Engineering Heavy)
    ("The distributed microservices architecture leverages Kafka event streams, Redis caching, and Kubernetes orchestration.", "Technical & Architecture"),
    ("Our RESTful API endpoints enforce rate limiting, HMAC request signing, and low-latency P99 SLA guarantees.", "Technical & Architecture"),
    ("High-throughput asynchronous event ingestion pipeline with PostgreSQL schema migrations and MongoDB sharding.", "Technical & Architecture"),
    ("Utilizing WebAssembly execution sandboxes and zero-copy memory buffers to optimize throughput at scale.", "Technical & Architecture"),
    ("Containerized microservice pods deployed via Helm charts across multi-region AWS cloud clusters.", "Technical & Architecture"),
    ("Continuous integration and deployment pipelines trigger automated static code analysis and linting checks.", "Technical & Architecture"),

    # 5. Urgent / High-Pressure Sales (Marketing Pressure)
    ("Hurry! Limited time offer expires at midnight tonight, don't miss out on this massive exclusive discount!", "Urgent / High-Pressure Sales"),
    ("Only 3 seats remaining at this unbelievable price! Claim your voucher now before it is gone forever.", "Urgent / High-Pressure Sales"),
    ("Act immediately! Prices are going up tomorrow morning, reserve your spot today or pay double later.", "Urgent / High-Pressure Sales"),
    ("Last chance flash sale! Order right now to lock in your lifetime discount before the countdown timer hits zero.", "Urgent / High-Pressure Sales"),
    ("Don't wait another second! This exclusive one-time promotion will never be repeated again.", "Urgent / High-Pressure Sales")
]

class BrandToneClassifier:
    """
    Scikit-learn TF-IDF + LogisticRegression Multi-Class Model for Brand Voice Governance
    """
    def __init__(self):
        self.texts = [item[0] for item in TRAINING_DATA]
        self.labels = [item[1] for item in TRAINING_DATA]
        self.classes = sorted(list(set(self.labels)))
        
        self.pipeline = Pipeline([
            ('tfidf', TfidfVectorizer(
                ngram_range=(1, 2),
                stop_words='english',
                sublinear_tf=True,
                max_features=1500
            )),
            ('clf', LogisticRegression(
                C=1.5,
                max_iter=1000,
                random_state=42
            ))
        ])
        
        # Fit model on baseline corpus
        self.pipeline.fit(self.texts, self.labels)
        self.vectorizer = self.pipeline.named_steps['tfidf']
        self.classifier = self.pipeline.named_steps['clf']

    def predict_tone(self, text: str, target_tone: str = "Professional & Authoritative") -> dict:
        """
        Predicts tone distribution, confidence score, and identifies top driving TF-IDF n-grams.
        """
        if not text or not text.strip():
            return {
                "predictedTone": "Unknown",
                "confidenceScore": 0.0,
                "probabilities": {c: 0.2 for c in self.classes},
                "isToneAligned": False,
                "topDrivingFeatures": []
            }

        # Predict probabilities across all classes
        probs = self.pipeline.predict_proba([text])[0]
        prob_dict = {cls: round(float(probs[i]), 4) for i, cls in enumerate(self.classifier.classes_)}
        
        # Top predicted class
        top_idx = int(np.argmax(probs))
        predicted_class = self.classifier.classes_[top_idx]
        confidence = round(float(probs[top_idx]) * 100, 1)

        # Extract top driving n-grams using TF-IDF weights
        tfidf_vec = self.vectorizer.transform([text])
        feature_names = np.array(self.vectorizer.get_feature_names_out())
        
        driving_features = []
        if tfidf_vec.nnz > 0:
            indices = tfidf_vec.indices
            data = tfidf_vec.data
            sorted_order = np.argsort(data)[::-1][:6]
            for idx in sorted_order:
                driving_features.append({
                    "term": feature_names[indices[idx]],
                    "tfidfWeight": round(float(data[idx]), 3)
                })

        # Tone alignment check against target brand guidelines
        is_aligned = (
            predicted_class.lower().startswith(target_tone.lower()[:8])
            or (target_tone.lower() in predicted_class.lower())
        )

        return {
            "predictedTone": predicted_class,
            "confidenceScore": confidence,
            "probabilities": prob_dict,
            "targetTone": target_tone,
            "isToneAligned": is_aligned,
            "topDrivingFeatures": driving_features,
            "mlModel": "TF-IDF + Multinomial Logistic Regression (scikit-learn)"
        }

# Global singleton instance
tone_classifier = BrandToneClassifier()
