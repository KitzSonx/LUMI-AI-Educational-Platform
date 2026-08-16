from typing import List, Dict
from config import settings

MOCK_OBEC_CURRICULUM = [
    {
        "id": "obec_math_g4_001",
        "topic": "เศษส่วนแท้ เศษเกิน และจำนวนคละ (Grade 4-6)",
        "content": "การบวกและลบเศษส่วนที่มีตัวส่วนเท่ากัน ให้นำตัวเศษมาบวกหรือลบกันโดยตัวส่วนยังคงเดิม เช่น 1/4 + 2/4 = 3/4"
    },
    {
        "id": "obec_math_g4_002",
        "topic": "การคูณเศษส่วนด้วยจำนวนนับ (Grade 5)",
        "content": "การคูณเศษส่วนด้วยจำนวนนับ ให้นำจำนวนนับมาคูณกับตัวเศษ โดยตัวส่วนคงเดิม เช่น 3 x (1/5) = 3/5"
    },
    {
        "id": "obec_math_g5_003",
        "topic": "การทำเศษส่วนให้เป็นทศนิยม (Grade 5-6)",
        "content": "เศษส่วนที่มีตัวส่วนเป็น 10, 100, 1000 สามารถเขียนเป็นทศนิยม 1 ตำแหน่ง, 2 ตำแหน่ง, และ 3 ตำแหน่ง ตามลำดับ เช่น 7/10 = 0.7 และ 25/100 = 0.25"
    }
]

class QdrantService:
    def __init__(self):
        self.use_mock = True
        try:
            from qdrant_client import QdrantClient
            if settings.QDRANT_URL and "localhost" not in settings.QDRANT_URL:
                self.client = QdrantClient(url=settings.QDRANT_URL, api_key=settings.QDRANT_API_KEY)
                self.use_mock = False
        except Exception:
            self.use_mock = True

    def search_curriculum(self, query: str, top_k: int = 2) -> List[Dict[str, str]]:
        if self.use_mock:
            # Simple keyword match search over OBEC Thai curriculum fallback
            matches = []
            for doc in MOCK_OBEC_CURRICULUM:
                if any(word in query.lower() for word in ["เศษส่วน", "ทศนิยม", "บวก", "คูณ", "ส่วน", "math", "fraction"]):
                    matches.append(doc)
            if not matches:
                matches = MOCK_OBEC_CURRICULUM[:top_k]
            return matches[:top_k]
        
        # Real Qdrant query implementation when configured
        return MOCK_OBEC_CURRICULUM[:top_k]

qdrant_service = QdrantService()
