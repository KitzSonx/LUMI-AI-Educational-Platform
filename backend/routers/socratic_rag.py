from fastapi import APIRouter
from pydantic import BaseModel
from services.qdrant_service import qdrant_service
from services.gemini_service import gemini_service

router = APIRouter(prefix="/api/socratic", tags=["socratic"])

class SocraticChatRequest(BaseModel):
    student_id: str
    message: str
    stress_index: float = 0.2
    mastery_prob: float = 0.4
    topic: str = "fractions"

@router.post("/chat")
async def socratic_chat(payload: SocraticChatRequest):
    # Step 1: Retrieve relevant curriculum context via Qdrant Service
    curriculum_docs = qdrant_service.search_curriculum(payload.message)
    curriculum_context = " ".join([d["content"] for d in curriculum_docs]) if curriculum_docs else "การเรียนเรื่องเศษส่วนและทศนิยม"

    # Step 2: Generate Socratic Tutor Response via Gemini Service
    response_text = gemini_service.generate_socratic_response(
        student_message=payload.message,
        curriculum_text=curriculum_context,
        stress_index=payload.stress_index,
        mastery_prob=payload.mastery_prob
    )

    return {
        "student_id": payload.student_id,
        "reply": response_text,
        "retrieved_context": [d["topic"] for d in curriculum_docs],
        "stress_adapted": payload.stress_index > 0.7
    }
