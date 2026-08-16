from fastapi import APIRouter
from pydantic import BaseModel
from services.bkt_service import bkt_service

router = APIRouter(prefix="/api/bkt", tags=["bkt"])

class BKTUpdateRequest(BaseModel):
    student_id: str
    skill_name: str
    correct: bool

@router.get("/skills/{student_id}")
async def get_skills(student_id: str):
    skills = bkt_service.get_student_skills(student_id)
    return {
        "student_id": student_id,
        "skills": skills
    }

@router.post("/update")
async def update_skill_mastery(payload: BKTUpdateRequest):
    result = bkt_service.update_mastery(
        student_id=payload.student_id,
        skill_name=payload.skill_name,
        correct=payload.correct
    )
    return result
