"""
Inkloom AI — BrandProof Compliance Risk Regressor
Powered by scikit-learn (RandomForestRegressor + Feature Extraction with NumPy)
"""

import re
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler

class ComplianceRiskRegressor:
    """
    Predicts continuous violation risk score (0-100) and discrete risk tier
    based on multi-dimensional lexical, statistical, and semantic features.
    """
    FEATURE_NAMES = [
        "superlative_density",
        "restricted_phrase_count",
        "syllables_per_word",
        "readability_penalty",
        "sentence_length_variance",
        "lexical_redundancy",
        "aggressive_punctuation"
    ]

    def __init__(self):
        self.scaler = StandardScaler()
        self.model = RandomForestRegressor(
            n_estimators=60,
            max_depth=5,
            random_state=42
        )
        self._train_baseline_model()

    def _train_baseline_model(self):
        """
        Synthesizes realistic training feature vectors and target compliance risk scores (0-100)
        reflecting real-world marketing compliance distributions.
        """
        # Baseline training data: [superlative, restricted, syl_ratio, read_pen, sent_var, lex_red, punct] -> risk_score
        X_train = np.array([
            # Low Risk Copy (Enterprise, clear, compliant)
            [0.0, 0, 1.4, 0.25, 3.2, 0.20, 0.0],
            [0.0, 0, 1.5, 0.30, 4.1, 0.22, 0.0],
            [0.0, 0, 1.3, 0.20, 2.8, 0.18, 0.0],
            [0.0, 0, 1.6, 0.35, 3.5, 0.25, 0.0],
            [0.1, 0, 1.4, 0.28, 3.0, 0.21, 0.0],

            # Moderate Risk Copy (Slightly dense or mild buzzword)
            [0.3, 0, 1.8, 0.55, 6.5, 0.35, 0.1],
            [0.2, 0, 1.7, 0.50, 5.8, 0.30, 0.0],
            [0.4, 1, 1.5, 0.45, 4.2, 0.28, 0.1],
            [0.1, 1, 1.9, 0.60, 7.0, 0.40, 0.0],

            # High Risk Copy (Superlatives, guarantees, high pressure)
            [1.2, 1, 1.6, 0.65, 8.4, 0.45, 0.4],
            [1.5, 2, 1.5, 0.70, 9.1, 0.50, 0.6],
            [1.8, 2, 1.7, 0.75, 10.2, 0.55, 0.8],
            [2.2, 3, 1.4, 0.80, 12.0, 0.60, 1.0],

            # Critical Risk Copy (Unverified claims, cheap, 100% bug free, extreme hype)
            [3.0, 3, 1.5, 0.85, 14.0, 0.65, 1.5],
            [3.5, 4, 1.6, 0.90, 15.5, 0.70, 2.0],
            [4.0, 5, 1.7, 0.95, 18.0, 0.75, 2.5]
        ])

        y_train = np.array([
            # Corresponding Risk Scores (0 - 100)
            5.0, 8.0, 6.0, 11.0, 14.0,       # Low
            32.0, 28.0, 42.0, 48.0,          # Moderate
            68.0, 74.0, 79.0, 84.0,          # High
            91.0, 96.0, 99.0                 # Critical
        ])

        X_scaled = self.scaler.fit_transform(X_train)
        self.model.fit(X_scaled, y_train)

    def extract_features(self, text: str, restricted_phrases: list = None) -> np.ndarray:
        """
        Extracts statistical & linguistic features from raw text using NumPy.
        """
        if not text:
            return np.zeros((1, len(self.FEATURE_NAMES)))

        words = re.findall(r'\b[A-Za-z0-9\'-]+\b', text.lower())
        sentences = [s.strip() for s in re.split(r'[.!?]+', text) if s.strip()]
        total_words = max(1, len(words))
        total_sentences = max(1, len(sentences))

        # 1. Superlative Density
        hype_regex = r'\b(cheapest|cheap|best|fastest|unbeatable|foolproof|guarantee|100%|miracle|revolutionary|revolutionary)\b'
        hype_matches = len(re.findall(hype_regex, text, re.IGNORECASE))
        superlative_density = (hype_matches / total_words) * 100.0

        # 2. Restricted phrase count
        if not restricted_phrases:
            restricted_phrases = ['cheap', 'guarantee', 'best in class', 'miracle', '100% bug-free']
        restricted_count = sum(1 for phrase in restricted_phrases if phrase.lower() in text.lower())

        # 3. Syllables per word
        vowels = "aeiouy"
        def count_syl(w):
            w = w.lower()
            cnt = sum(1 for i, c in enumerate(w) if c in vowels and (i == 0 or w[i-1] not in vowels))
            return max(1, cnt)
        syl_array = np.array([count_syl(w) for w in words]) if words else np.array([1])
        syllables_per_word = float(np.mean(syl_array))

        # 4. Readability penalty (Approx Flesch)
        words_per_sent = total_words / total_sentences
        reading_ease = 206.835 - (1.015 * words_per_sent) - (84.6 * syllables_per_word)
        reading_ease = max(0.0, min(100.0, reading_ease))
        readability_penalty = float((100.0 - reading_ease) / 100.0)

        # 5. Sentence length variance (NumPy standard deviation)
        sent_lengths = np.array([len(s.split()) for s in sentences]) if sentences else np.array([total_words])
        sentence_variance = float(np.std(sent_lengths)) if len(sent_lengths) > 1 else 2.0

        # 6. Lexical redundancy (1 - unique/total words)
        unique_words = len(set(words))
        lexical_redundancy = float(1.0 - (unique_words / total_words))

        # 7. Aggressive punctuation & all-caps density
        exclamations = text.count('!') + (text.count('?') > 1)
        caps_words = sum(1 for w in re.findall(r'\b[A-Z]{2,}\b', text))
        aggressive_punct = float(exclamations + caps_words * 0.5)

        raw_features = np.array([[
            superlative_density,
            restricted_count,
            syllables_per_word,
            readability_penalty,
            sentence_variance,
            lexical_redundancy,
            aggressive_punct
        ]])
        return raw_features

    def predict_risk(self, text: str, restricted_phrases: list = None) -> dict:
        """
        Executes scikit-learn Random Forest regression to predict compliance violation risk.
        """
        raw_features = self.extract_features(text, restricted_phrases)
        scaled_features = self.scaler.transform(raw_features)
        
        # Continuous risk score (0 to 100)
        predicted_risk = float(self.model.predict(scaled_features)[0])
        predicted_risk = round(max(2.0, min(99.0, predicted_risk)), 1)

        # Discrete risk tier classification
        if predicted_risk >= 75.0:
            tier = "CRITICAL"
            tier_color = "#C62828"
            action = "Immediate remediation required. Multiple severe brand governance breaches detected."
        elif predicted_risk >= 50.0:
            tier = "HIGH"
            tier_color = "#D97706"
            action = "Substantial violation risk. Unsubstantiated claims or buzzwords require review."
        elif predicted_risk >= 25.0:
            tier = "MODERATE"
            tier_color = "#176B59"
            action = "Minor tone or readability adjustments recommended before channel release."
        else:
            tier = "LOW"
            tier_color = "#2E7D32"
            action = "Compliant. High adherence to brand guidelines."

        # Compute feature importance contributions for explainable AI (XAI)
        importances = self.model.feature_importances_
        feature_breakdown = []
        for name, imp, val in zip(self.FEATURE_NAMES, importances, raw_features[0]):
            feature_breakdown.append({
                "feature": name.replace('_', ' ').title(),
                "importance": round(float(imp), 3),
                "observedValue": round(float(val), 2)
            })
        
        # Sort by importance descending
        feature_breakdown.sort(key=lambda x: x["importance"], reverse=True)

        return {
            "riskScore": predicted_risk,
            "riskTier": tier,
            "tierColor": tier_color,
            "recommendedAction": action,
            "featureContributions": feature_breakdown[:4],
            "modelEngine": "Random Forest Ensemble Regressor (scikit-learn)"
        }

# Global singleton instance
risk_regressor = ComplianceRiskRegressor()
