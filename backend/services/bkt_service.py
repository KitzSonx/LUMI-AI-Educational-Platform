from typing import Dict, Any

# In-memory storage for student skill mastery state P(Lt)
# Initial P(L0) set to 0.40 baseline
student_mastery_db: Dict[str, Dict[str, float]] = {}

DEFAULT_SKILLS = {
    "fractions_addition": 0.45,
    "fractions_multiplication": 0.35,
    "decimals_conversion": 0.40,
    "science_energy_transfer": 0.50
}

# Standard BKT Parameters: P(L0)=0.4, P(T)=0.15 (Learn), P(S)=0.1 (Slip), P(G)=0.2 (Guess)
P_TRANSITION = 0.15
P_SLIP = 0.10
P_GUESS = 0.20

class BKTEngineService:
    def __init__(self):
        try:
            from pyBKT.models import Model
            self.model = Model()
            self.has_pybkt = True
        except Exception:
            self.model = None
            self.has_pybkt = False

    def get_student_skills(self, student_id: str) -> Dict[str, float]:
        if student_id not in student_mastery_db:
            student_mastery_db[student_id] = DEFAULT_SKILLS.copy()
        return student_mastery_db[student_id]

    def update_mastery(self, student_id: str, skill_name: str, correct: bool) -> Dict[str, Any]:
        skills = self.get_student_skills(student_id)
        p_prev = skills.get(skill_name, 0.40)

        # Standard Bayesian Knowledge Tracing Update Step
        if correct:
            # P(L_t | Correct) = (P(L_t) * (1 - P(S))) / (P(L_t)*(1-P(S)) + (1-P(L_t))*P(G))
            p_posterior = (p_prev * (1.0 - P_SLIP)) / ((p_prev * (1.0 - P_SLIP)) + ((1.0 - p_prev) * P_GUESS))
        else:
            # P(L_t | Incorrect) = (P(L_t) * P(S)) / (P(L_t)*P(S) + (1-P(L_t))*(1-P(G)))
            p_posterior = (p_prev * P_SLIP) / ((p_prev * P_SLIP) + ((1.0 - p_prev) * (1.0 - P_GUESS)))

        # Next state P(L_{t+1}) = P(L_t | obs) + (1 - P(L_t | obs)) * P(Transition)
        p_next = p_posterior + (1.0 - p_posterior) * P_TRANSITION
        p_next = round(float(min(max(p_next, 0.01), 0.99)), 3)

        skills[skill_name] = p_next

        return {
            "student_id": student_id,
            "skill_name": skill_name,
            "correct": correct,
            "previous_p_lt": p_prev,
            "updated_p_lt": p_next,
            "all_skills": skills,
            "pybkt_active": self.has_pybkt
        }

bkt_service = BKTEngineService()
