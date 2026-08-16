import os
from config import settings
from services.guardrails import apply_socratic_guardrails

SYSTEM_PROMPT_TEMPLATE = """You are a supportive Thai Socratic AI Tutor for primary school students (สพฐ.).
Context: {retrieved_curriculum_text}
Student State: Stress Index = {stress_index} (0=relax, 1=extreme stress), Knowledge Mastery P(Lt) = {mastery_prob}.

RULES:
1. NEVER reveal direct numeric answers or final solution equations.
2. Ask ONE guiding, thought-provoking question at a time.
3. If Stress Index > 0.7, adopt a deeply encouraging tone, keep hints short, and offer a short break option.
4. Respond in polite Thai language (ใช้ครับ/ค่ะ อย่างสุภาพ).
"""

class GeminiService:
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

    def generate_socratic_response(
        self,
        student_message: str,
        curriculum_text: str,
        stress_index: float,
        mastery_prob: float
    ) -> str:
        prompt = SYSTEM_PROMPT_TEMPLATE.format(
            retrieved_curriculum_text=curriculum_text,
            stress_index=stress_index,
            mastery_prob=mastery_prob
        )

        if self.use_mock:
            # Smart Socratic fallback when running in offline/mock mode
            if stress_index > 0.7:
                response = f"พี่ติวเตอร์เห็นว่าน้องตั้งใจมากเลยนะ! ลองหยุดพักสายตา 10 วินาที แล้วคิดดูสิว่า {student_message} ตัวเศษกับตัวส่วนกำลังบอกอะไรเราครับ?"
            elif mastery_prob < 0.4:
                response = f"เกือบถูกแล้วครับ! ตามหลักการเรื่องนี้: '{curriculum_text[:60]}...' ลองบอกพี่หน่อยครับว่าขั้นตอนแรกเราควรทำอะไรก่อนดี?"
            else:
                response = f"เยี่ยมมากครับ! ลองอธิบายให้พี่ฟังหน่อยว่าถ้าเราเปลี่ยนขั้นตอนถัดไปในโจทย์นี้ ผลลัพธ์จะเปลี่ยนแปลงอย่างไรบ้างครับ?"
        else:
            try:
                full_prompt = f"{prompt}\n\nStudent Request: {student_message}"
                res = self.model.generate_content(full_prompt)
                response = res.text if res and res.text else "ลองคิดทบทวนดูอีกครั้งครับ"
            except Exception as e:
                response = f"พี่ติวเตอร์อยู่ตรงนี้เสมอครับ! ลองเล่าให้ฟังหน่อยว่าโจทย์ข้อนี้น้องคิดถึงขั้นตอนไหนแล้ว?"

        # Pass response through Guardrails
        guarded_response = apply_socratic_guardrails(response)
        return guarded_response

gemini_service = GeminiService()
