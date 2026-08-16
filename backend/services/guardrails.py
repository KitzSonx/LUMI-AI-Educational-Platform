import re

# Regex patterns matching direct answers like "x = 5", "ตอบ 12", "คำตอบคือ 3/4", "= 42"
DIRECT_ANSWER_PATTERNS = [
    r'ตอบ\s*[:=]?\s*[\d\.\/]+',
    r'x\s*=\s*[\d\.\/]+',
    r'คำตอบคือ\s*[\d\.\/]+',
    r'=\s*[\d\.\/]+\s*$'
]

def apply_socratic_guardrails(response_text: str) -> str:
    """
    Validates and transforms LLM output to guarantee non-direct answer disclosure.
    """
    clean_text = response_text
    contains_direct_answer = False

    for pattern in DIRECT_ANSWER_PATTERNS:
        if re.search(pattern, clean_text, re.IGNORECASE):
            contains_direct_answer = True
            clean_text = re.sub(pattern, "ลองคิดทบทวนดูอีกครั้ง", clean_text, flags=re.IGNORECASE)

    if contains_direct_answer:
        clean_text += "\n\n(ระบบติวเตอร์อัตโนมัติ: ซ่อนเฉลยตัวเลขเพื่อให้นักเรียนลองคิดขั้นตอนด้วยตนเอง)"

    return clean_text
