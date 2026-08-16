from fastapi import APIRouter
from pydantic import BaseModel
from services.teacher_ai_service import teacher_ai_service
from services.bkt_service import bkt_service

router = APIRouter(prefix="/api/teacher", tags=["teacher"])

class ActionPlanRequest(BaseModel):
    class_id: str = "cls_401"
    total_students: int = 4
    high_stress_count: int = 1
    lowest_skill: str = "fractions_addition"
    lowest_p_lt: float = 0.45

# Mock classroom database snapshot for demo
MOCK_CLASSROOM_DATA = {
    "cls_401": {
        "class_name": "ประถมศึกษาปีที่ 4/1 (สพฐ.)",
        "total_students": 4,
        "students": [
            {
                "student_id": "std_001",
                "name": "student 1",
                "avatar": "🐱",
                "stress_index": 0.15,
                "stress_level": "LOW",
                "zone": "FLOW",
                "current_skill": "fractions_addition",
                "mastery_prob": 0.55,
                "high_stress_seconds": 0
            },
            {
                "student_id": "marcus",
                "name": "Marcus",
                "avatar": "🦊",
                "stress_index": 0.45,
                "stress_level": "MEDIUM",
                "zone": "FRUSTRATION",
                "current_skill": "fractions_addition",
                "mastery_prob": 0.72,
                "high_stress_seconds": 15
            },
            {
                "student_id": "std_002",
                "name": "student 2",
                "avatar": "🦋",
                "stress_index": 0.20,
                "stress_level": "LOW",
                "zone": "FLOW",
                "current_skill": "science_energy_transfer",
                "mastery_prob": 0.60,
                "high_stress_seconds": 0
            },
            {
                "student_id": "std_003",
                "name": "student 3",
                "avatar": "🦉",
                "stress_index": 0.85,
                "stress_level": "HIGH",
                "zone": "BURNOUT",
                "current_skill": "fractions_addition",
                "mastery_prob": 0.30,
                "high_stress_seconds": 75  # Triggers alert (>60s)
            }
        ],
        "guardrail_audit": [
          { "timestamp": "12:45", "student_id": "std_003", "query": "x เท่ากับกี่ครับ", "guardrail_triggered": True, "action": "Stripped direct numeric answer, rewritten to Socratic prompt." },
          { "timestamp": "12:48", "student_id": "marcus", "query": "ขอเฉลยบวกเศษส่วน", "guardrail_triggered": True, "action": "Prompt rewritten to ask guiding question on numerators." }
        ]
    }
}

@router.get("/class-summary/{class_id}")
async def get_class_summary(class_id: str):
    class_info = MOCK_CLASSROOM_DATA.get(class_id, MOCK_CLASSROOM_DATA["cls_401"])
    students = class_info["students"]
    
    total = len(students)
    avg_stress = sum(s["stress_index"] for s in students) / total if total > 0 else 0.0
    high_stress_count = sum(1 for s in students if s["stress_level"] == "HIGH")
    
    # pyBKT class mastery calculation
    mastered_count = sum(1 for s in students if s["mastery_prob"] >= 0.85)
    pct_mastered = (mastered_count / total * 100) if total > 0 else 0.0
    
    at_risk_students = [s for s in students if s["mastery_prob"] < 0.5]
    alert_students = [s for s in students if s["high_stress_seconds"] > 60]

    return {
        "class_id": class_id,
        "class_name": class_info["class_name"],
        "total_students": total,
        "average_stress_index": round(avg_stress, 2),
        "high_stress_count": high_stress_count,
        "pct_mastery_target": round(pct_mastered, 1),
        "at_risk_students": at_risk_students,
        "alert_students": alert_students,
        "students": students,
        "guardrail_audit_log": class_info["guardrail_audit"],
        "skill_matrix": [
            { "skill_name": "fractions_addition", "topic_th": "การบวกเศษส่วน", "class_avg_p_lt": 0.54, "status": "NEEDS_RECAP" },
            { "skill_name": "fractions_multiplication", "topic_th": "การคูณเศษส่วน", "class_avg_p_lt": 0.61, "status": "ON_TRACK" },
            { "skill_name": "decimals_conversion", "topic_th": "การแปลงทศนิยม", "class_avg_p_lt": 0.59, "status": "ON_TRACK" },
            { "skill_name": "science_energy_transfer", "topic_th": "พลังงานและระบบนิเวศ", "class_avg_p_lt": 0.66, "status": "ON_TRACK" }
        ]
    }

@router.post("/generate-action-plan")
async def generate_action_plan(payload: ActionPlanRequest):
    action_plan = teacher_ai_service.generate_action_plan(
        total_students=payload.total_students,
        high_stress_count=payload.high_stress_count,
        lowest_skill=payload.lowest_skill,
        lowest_p_lt=payload.lowest_p_lt
    )
    return {
        "class_id": payload.class_id,
        "action_plan": action_plan
    }
