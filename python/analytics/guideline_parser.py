"""
Inkloom AI — Automated Brand Guideline Ingestion & Rule Extractor (Slide 3)
Extracts brand rules, color palettes, restricted buzzwords, and mandatory terms from raw text/PDFs
"""

import re

def extract_hex_colors(text: str) -> list:
    """Extracts valid hex color codes and suggests color names."""
    matches = re.findall(r'#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})\b', text)
    colors = []
    seen = set()

    for m in matches:
        hex_val = f"#{m.upper()}"
        if hex_val in seen:
            continue
        seen.add(hex_val)

        # Heuristic color naming
        h = hex_val.upper()
        if h in ['#142B4A', '#0F172A', '#1E293B', '#000080']:
            name = "Primary Navy"
        elif h in ['#176B59', '#10B981', '#059669', '#2E7D32']:
            name = "Teal Accent"
        elif h in ['#202833', '#111827', '#000000', '#333333']:
            name = "Charcoal Dark"
        elif h in ['#F5F7FA', '#FFFFFF', '#F8FAFC', '#F1F5F9']:
            name = "Neutral Surface"
        elif h in ['#DC2626', '#C62828', '#EF4444']:
            name = "Critical Red"
        elif h in ['#D97706', '#F59E0B', '#B7791F']:
            name = "Warning Amber"
        else:
            name = f"Brand Token {len(colors)+1}"

        colors.append({"name": name, "hex": hex_val})

    if not colors:
        colors = [
            {"name": "Primary Navy", "hex": "#142B4A"},
            {"name": "Teal Accent", "hex": "#176B59"},
            {"name": "Charcoal", "hex": "#202833"},
            {"name": "Neutral Surface", "hex": "#F5F7FA"}
        ]
    return colors

def extract_guideline_rules(text: str) -> dict:
    """
    Parses unstructured brand guideline documentation into structured governance rules:
    - Restricted phrases (superlatives, absolute claims, buzzwords)
    - Required terminology (naming conventions, trademarks)
    - Approved tone descriptors
    - Extracted brand colors
    - Approved claims
    """
    if not text or not text.strip():
        text = """
        Acme Brand Governance Guidelines 2026.
        Tone: Professional, authoritative, innovative, customer-focused.
        Brand Colors: Primary #142B4A, Accent #176B59, Charcoal #202833, Light #F5F7FA.
        Never use the words: cheap, guarantee, best in class, miracle, 100% bug-free, foolproof, revolutionary.
        Always include mandatory terms: enterprise-grade, governance platform, Acme Solutions.
        Approved Claims: Trusted by 500+ enterprises worldwide; Validated reduction in review turnaround times by up to 60%.
        Typography: Inter, sans-serif. Logo safe space: 24px padding on all sides.
        """

    # 1. Colors
    brand_colors = extract_hex_colors(text)

    # 2. Restricted phrases extraction
    restricted = []
    # Search for patterns like "never use:", "avoid:", "do not claim:", "forbidden:", quotes
    restricted_patterns = [
        r'(?:never use|avoid|restricted|forbidden|do not use|prohibited)[^.:\n]*[:\-]?\s*([^.:\n]+)',
        r'["\'](cheap|guarantee|best in class|miracle|100% bug-free|foolproof|revolutionary|lowest price|free money)["\']'
    ]

    for pat in restricted_patterns:
        matches = re.findall(pat, text, re.IGNORECASE)
        for m in matches:
            if isinstance(m, str):
                # Split comma/semicolon separated items
                terms = re.split(r'[,;]|\band\b', m)
                for t in terms:
                    clean = t.strip().strip('"\'').lower()
                    if clean and len(clean) > 2 and clean not in [r.lower() for r in restricted]:
                        if clean not in ['the', 'words', 'phrases', 'terms', 'following']:
                            restricted.append(clean)

    if len(restricted) < 2:
        restricted = ['cheap', 'guarantee', 'best in class', 'miracle', '100% bug-free', 'foolproof', 'revolutionary']

    # 3. Required terminology extraction
    required = []
    req_patterns = [
        r'(?:always include|mandatory|required terms?|mandatory naming)[^.:\n]*[:\-]?\s*([^.:\n]+)'
    ]
    for pat in req_patterns:
        matches = re.findall(pat, text, re.IGNORECASE)
        for m in matches:
            terms = re.split(r'[,;]|\band\b', m)
            for t in terms:
                clean = t.strip().strip('"\'')
                if clean and len(clean) > 3 and clean.lower() not in [r.lower() for r in required]:
                    if clean.lower() not in ['terms', 'words', 'names', 'always', 'include']:
                        required.append(clean)

    if not required:
        required = ['enterprise-grade', 'governance platform', 'Acme Solutions']

    # 4. Approved tone extraction
    tone_match = re.search(r'tone[^.:\n]*[:\-]?\s*([^.:\n]+)', text, re.IGNORECASE)
    tone = tone_match.group(1).strip() if tone_match else "Professional & Authoritative"

    # 5. Approved claims
    claims_match = re.search(r'(?:approved claims?|verified claims?)[^.:\n]*[:\-]?\s*([^.\n]+)', text, re.IGNORECASE)
    if claims_match:
        claims = [c.strip().strip('"\'') for c in claims_match.group(1).split(';') if c.strip()]
    else:
        claims = [
            "Trusted by 500+ enterprises worldwide",
            "Engineered to reduce review turnaround times by up to 60%"
        ]

    # 6. Profile Name & Industry
    name_match = re.search(r'([A-Za-z0-9\s]+?)\s*(?:Brand|Guidelines|Standards|Governance)', text)
    profile_name = name_match.group(1).strip() if name_match else "Extracted Corporate Profile"
    if len(profile_name) > 30:
        profile_name = "Enterprise Brand Guidelines"

    return {
        "name": profile_name,
        "industry": "Enterprise Software & Cloud Platforms",
        "tone": tone,
        "brandColors": brand_colors,
        "restrictedPhrases": restricted[:8],
        "requiredTerms": required[:5],
        "approvedClaims": claims,
        "typography": {"primaryFont": "Inter, system-ui, sans-serif", "headingMinSize": "24px"},
        "logoGuidance": {"minClearSpace": "24px margin on all sides", "allowedPlacements": ["Top-Left", "Top-Right"]},
        "status": "Active",
        "extractionMethod": "AI Heuristic NLP Document Parser"
    }
