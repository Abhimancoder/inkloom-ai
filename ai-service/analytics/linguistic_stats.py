"""
Inkloom AI — Statistical NLP & Linguistic Analytics
Powered by NumPy & SciPy for Deep Linguistic Profiling
"""

import re
import math
import numpy as np
from scipy.stats import entropy

def count_syllables(word: str) -> int:
    word = word.lower().strip()
    if len(word) <= 3:
        return 1
    vowels = "aeiouy"
    count = 0
    prev_vowel = False
    for char in word:
        is_vowel = char in vowels
        if is_vowel and not prev_vowel:
            count += 1
        prev_vowel = is_vowel
    if word.endswith("e") and not word.endswith("le"):
        count = max(1, count - 1)
    return max(1, count)

def compute_linguistic_profile(text: str) -> dict:
    """
    Computes statistical NLP and linguistic metrics using NumPy arrays and SciPy entropy.
    """
    if not text or not text.strip():
        return {
            "sentenceMetrics": {"count": 0, "meanWords": 0, "stdWords": 0, "medianWords": 0, "p90Words": 0},
            "tokenMetrics": {"totalWords": 0, "uniqueWords": 0, "typeTokenRatio": 0.0, "shannonEntropy": 0.0},
            "readabilityIndices": {"fleschReadingEase": 100, "fleschKincaidGrade": 0, "gunningFog": 0, "colemanLiau": 0}
        }

    # Sentence tokenization
    raw_sentences = [s.strip() for s in re.split(r'[.!?]+', text) if s.strip()]
    if not raw_sentences:
        raw_sentences = [text.strip()]

    # Word tokenization
    words = re.findall(r'\b[A-Za-z0-9\'-]+\b', text)
    lower_words = [w.lower() for w in words]
    total_words = max(1, len(words))
    total_sentences = max(1, len(raw_sentences))

    # 1. NUMPY STATISTICAL COMPUTATIONS: Sentence Length Distribution
    sentence_word_counts = np.array([max(1, len(re.findall(r'\b[A-Za-z0-9\'-]+\b', s))) for s in raw_sentences])
    mean_sent_len = float(np.mean(sentence_word_counts))
    std_sent_len = float(np.std(sentence_word_counts))
    median_sent_len = float(np.median(sentence_word_counts))
    p90_sent_len = float(np.percentile(sentence_word_counts, 90))

    # 2. NUMPY STATISTICAL COMPUTATIONS: Syllable Distribution
    syllable_counts = np.array([count_syllables(w) for w in words]) if words else np.array([1])
    mean_syllables = float(np.mean(syllable_counts))
    std_syllables = float(np.std(syllable_counts))
    complex_words = int(np.sum(syllable_counts >= 3))
    pct_complex = float((complex_words / total_words) * 100.0)

    # 3. SCIPY & NUMPY ENTROPY & VOCABULARY DIVERSITY
    unique_words = len(set(lower_words))
    type_token_ratio = round(float(unique_words / total_words), 3)

    # Frequency distribution for Shannon Entropy calculation
    word_freqs = {}
    for w in lower_words:
        word_freqs[w] = word_freqs.get(w, 0) + 1
    
    freq_probs = np.array(list(word_freqs.values()), dtype=np.float64) / total_words
    # Base-2 Shannon entropy measures information density and vocabulary richness
    shannon_entropy_val = float(entropy(freq_probs, base=2)) if len(freq_probs) > 0 else 0.0

    # 4. FORMAL READABILITY INDICES
    # A. Flesch Reading Ease
    flesch_ease = 206.835 - (1.015 * mean_sent_len) - (84.6 * mean_syllables)
    flesch_ease = round(max(0.0, min(100.0, flesch_ease)), 1)

    # B. Flesch-Kincaid Grade Level
    fk_grade = (0.39 * mean_sent_len) + (11.8 * mean_syllables) - 15.59
    fk_grade = round(max(1.0, fk_grade), 1)

    # C. Gunning Fog Index (Grade level required to understand)
    gunning_fog = 0.4 * (mean_sent_len + pct_complex)
    gunning_fog = round(max(1.0, gunning_fog), 1)

    # D. Coleman-Liau Index: 0.0588*L - 0.296*S - 15.8 (L = letters/100 words, S = sentences/100 words)
    letter_count = sum(len(w) for w in words)
    L = (letter_count / total_words) * 100.0
    S = (total_sentences / total_words) * 100.0
    coleman_liau = (0.0588 * L) - (0.296 * S) - 15.8
    coleman_liau = round(max(1.0, coleman_liau), 1)

    return {
        "sentenceMetrics": {
            "count": total_sentences,
            "meanWords": round(mean_sent_len, 1),
            "stdWords": round(std_sent_len, 2),
            "medianWords": round(median_sent_len, 1),
            "p90Words": round(p90_sent_len, 1),
            "lengths": sentence_word_counts.tolist()
        },
        "tokenMetrics": {
            "totalWords": total_words,
            "uniqueWords": unique_words,
            "typeTokenRatio": type_token_ratio,
            "shannonEntropy": round(shannon_entropy_val, 2),
            "meanSyllablesPerWord": round(mean_syllables, 2),
            "complexWordPercentage": round(pct_complex, 1)
        },
        "readabilityIndices": {
            "fleschReadingEase": flesch_ease,
            "fleschKincaidGrade": fk_grade,
            "gunningFog": gunning_fog,
            "colemanLiau": coleman_liau,
            "readingLabel": "Accessible" if flesch_ease >= 55 else "Complex" if flesch_ease >= 35 else "Academic"
        }
    }
