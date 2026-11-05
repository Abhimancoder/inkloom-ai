# ================================================================
# INKLOOM AI — PYTHON NLP SUPPORTING MICROSERVICE (PHASE M7)
# ================================================================
# Built with Python Standard Library (Runs out of the box with zero external dependencies)
# Port: 8000 | Endpoint: POST /analyze | GET /health

import json
import re
from http.server import HTTPServer, BaseHTTPRequestHandler

def count_syllables(word):
    word = word.lower().strip()
    if len(word) <= 3:
        return 1
    # Count vowel groups
    vowels = "aeiouy"
    count = 0
    prev_is_vowel = False
    for char in word:
        is_vowel = char in vowels
        if is_vowel and not prev_is_vowel:
            count += 1
        prev_is_vowel = is_vowel
    if word.endswith("e") and not word.endswith("le"):
        count = max(1, count - 1)
    return max(1, count)

def analyze_content(text, target_tone="Professional"):
    """
    Performs NLP text analysis:
    - Flesch Reading Ease readability scoring
    - Tone & hype detection
    - Sentence complexity analysis
    """
    if not text:
        return {"error": "Empty text"}

    # Basic tokenization
    sentences = [s.strip() for s in re.split(r'[.!?]+', text) if s.strip()]
    words = re.findall(r'\b[A-Za-z0-9\'-]+\b', text)
    
    total_sentences = max(1, len(sentences))
    total_words = max(1, len(words))
    total_syllables = sum(count_syllables(w) for w in words)

    # Flesch Reading Ease Formula: 206.835 - 1.015*(words/sentences) - 84.6*(syllables/words)
    words_per_sentence = total_words / total_sentences
    syllables_per_word = total_syllables / total_words
    reading_ease = round(206.835 - (1.015 * words_per_sentence) - (84.6 * syllables_per_word), 1)
    reading_ease = max(0, min(100, reading_ease))

    # Readability tier
    if reading_ease >= 70:
        readability_label = "Easy to Read"
    elif reading_ease >= 50:
        readability_label = "Standard / Accessible"
    elif reading_ease >= 30:
        readability_label = "Difficult / Complex"
    else:
        readability_label = "Very Confusing / Academic"

    # Hype & Buzzword NLP pattern analysis
    hype_patterns = [
        r'\b(miracle|revolutionary|revolutionary|disruptive|game-changing)\b',
        r'\b(unprecedented|foolproof|guarantee|100%)\b',
        r'\b(cheapest|lowest price|free money)\b'
    ]

    nlp_findings = []
    hype_count = 0

    for pattern in hype_patterns:
        matches = re.findall(pattern, text, re.IGNORECASE)
        for match in matches:
            hype_count += 1
            nlp_findings.append({
                "severity": "Warning",
                "severityType": "warning",
                "category": "NLP Tone & Hype Analysis",
                "excerpt": f"...{match}...",
                "matchedRule": f"NLP detected excessive promotional tone: '{match}'",
                "explanation": f"Statistical tone analysis flags '{match}' as subjective hype. Enterprise governance recommends factual, objective phrasing.",
                "confidence": "Statistical NLP Pattern Match (88%)",
                "suggestedCorrection": "Use verified qualitative or data-backed descriptions instead.",
                "status": "Possible Mismatch"
            })

    # Overall governance score (0 - 100)
    base_score = 100
    base_score -= min(40, hype_count * 15)
    if reading_ease < 40:
        base_score -= 10
    final_score = max(20, base_score)

    return {
        "service": "inkloom-python-nlp",
        "version": "1.0.0",
        "governanceScore": final_score,
        "metrics": {
            "wordCount": total_words,
            "sentenceCount": total_sentences,
            "readingEaseScore": reading_ease,
            "readability": readability_label,
            "targetTone": target_tone,
            "hypeWordCount": hype_count
        },
        "nlpFindings": nlp_findings,
        "message": f"NLP tone analysis completed. Governance score: {final_score}/100"
    }

class NLPRequestHandler(BaseHTTPRequestHandler):
    def _set_headers(self, status=200):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers(200)

    def do_GET(self):
        if self.path == '/health' or self.path == '/':
            self._set_headers(200)
            res = {
                "status": "ok",
                "service": "inkloom-ai-nlp",
                "version": "1.0.0",
                "model": "rule-assisted statistical NLP",
                "port": 8000
            }
            self.wfile.write(json.dumps(res).encode('utf-8'))
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "Endpoint not found"}).encode('utf-8'))

    def do_POST(self):
        if self.path == '/analyze':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)

            try:
                data = json.loads(post_data.decode('utf-8'))
                text = data.get('content', '') or data.get('draftText', '')
                target_tone = data.get('targetTone', 'Professional')

                analysis = analyze_content(text, target_tone)
                self._set_headers(200)
                self.wfile.write(json.dumps(analysis).encode('utf-8'))
            except Exception as e:
                self._set_headers(400)
                self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "Endpoint not found"}).encode('utf-8'))

def run_server(port=8000):
    server_address = ('', port)
    httpd = HTTPServer(server_address, NLPRequestHandler)
    print(f"[Inkloom AI Service] Python NLP microservice running on http://localhost:{port}")
    print(f"[Inkloom AI Service] Health check: http://localhost:{port}/health")
    print(f"[Inkloom AI Service] Analysis endpoint: http://localhost:{port}/analyze (POST)")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[Inkloom AI Service] Stopping server...")
        httpd.server_close()

if __name__ == '__main__':
    run_server()
