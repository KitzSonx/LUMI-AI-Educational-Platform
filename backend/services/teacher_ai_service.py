from config import settings

SYSTEM_PROMPT_TEMPLATE = """You are an expert Educational Data Analyst and Teacher Assistant in Thailand (สพฐ.).
Classroom Metrics:
- Total Students: {total_students}
- High Stress (Burnout/Frustration) Count: {high_stress_count}
- Lowest Mastery Skill: {lowest_skill} (Average P(Lt) = {lowest_p_lt})

Generate a concise 3-step action plan in Thai for the classroom teacher.
Focus on actionable interventions (e.g., group activities, short breaks, targeted micro-lessons).
Keep tone supportive, professional, and clear with numbered steps (1., 2., 3.).
"""

class TeacherAIService:
    def __init__(self):
        self.use_mock = True
        self.api_key = settings.GEMINI_API_KEY
        if self.api_key and self.api_key != "MOCK_GEMINI_KEY":
            try:
                import google.generativeai as genai
                genai.configure(api_key=self.api_key)
                self.model = genai.GenerativeModel("gemini-1.5-flash")
                self.use_mock = False
            except Exception:
                self.use_mock = True

    def generate_action_plan(
        self,
        total_students: int,
        high_stress_count: int,
        lowest_skill: str,
        lowest_p_lt: float
    ) -> list[str]:
        prompt = SYSTEM_PROMPT_TEMPLATE.format(
            total_students=total_students,
            high_stress_count=high_stress_count,
            lowest_skill=lowest_skill,
            lowest_p_lt=lowest_p_lt
        )

        if self.use_mock:
            # Fallback action plan when offline/mock mode
            return [
                f"1. ⏸️ จัดช่วงพักสายตา 3 นาที: มีนักเรียนมีความเครียดสูง {high_stress_count} คน เสนอทำกิจกรรมขยับร่างกายเบาๆ ก่อนเริ่มหัวข้อถัดไป",
                f"2. 🧩 ทบทวนเนื้อหาแบบ Micro-Lesson ในเรื่อง '{lowest_skill}' (ค่าเฉลย์ P(Lt) = {lowest_p_lt:.2f}): ใช้แบบจำลองภาพหรือรูปเค้กช่วยอธิบายการบวกเศษส่วน",
                "3. 🤝 จัดกลุ่มแบบ Peer Tutoring: จับคู่นักเรียนที่มี Mastery สูง ช่วยเหลือเพื่อนกลุ่ม At-Risk เพื่อสร้างบรรยากาศเรียนรู้แบบมีส่วนร่วม"
            ]

        try:
            res = self.model.generate_content(prompt)
            text = res.text if res and res.text else ""
            lines = [line.strip() for line in text.split("\n") if line.strip() and (line.startswith("1.") or line.startswith("2.") or line.startswith("3.") or line.startswith("-"))]
            if len(lines) >= 3:
                return lines[:3]
            return [
                "1. จัดช่วงพักสายตา 3 นาทีเพื่อลดสภาวะความเครียดของนักเรียนกลุ่มเสี่ยง",
                f"2. ทบทวนเนื้อหาเรื่อง {lowest_skill} โดยใช้สื่อการสอนเชิงรูปธรรม",
                "3. ประกบคู่นักเรียนเก่งช่วยเพื่อนกลุ่ม At-Risk"
            ]
        except Exception:
            return [
                "1. จัดช่วงพักสายตา 3 นาทีเพื่อลดสภาวะความเครียดของนักเรียนกลุ่มเสี่ยง",
                f"2. ทบทวนเนื้อหาเรื่อง {lowest_skill} โดยใช้สื่อการสอนเชิงรูปธรรม",
                "3. ประกบคู่นักเรียนเก่งช่วยเพื่อนกลุ่ม At-Risk"
            ]

teacher_ai_service = TeacherAIService()
