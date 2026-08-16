import { useState, useCallback } from 'react';
import { useAffectiveStore } from '../store/useAffectiveStore';
import { useKnowledgeStore } from '../store/useKnowledgeStore';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  timestamp: string;
  stressAdapted?: boolean;
}

export function useSocraticTutor(apiBaseUrl: string = 'http://localhost:8000') {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-init',
      sender: 'tutor',
      text: 'สวัสดีครับน้อง! พี่ติวเตอร์พร้อมช่วยเหลือเรื่องโจทย์คณิตศาสตร์และวิทยาศาสตร์แล้ว มีข้อไหนอยากให้ช่วยบอกได้เลยนะครับ!',
      timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { stressIndex } = useAffectiveStore();
  const { studentId, getStudent, updateSkillMastery, addXP } = useKnowledgeStore();

  const sendMessage = useCallback(
    async (text: string, currentSkill: string = 'fractions_addition') => {
      if (!text.trim()) return;

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        sender: 'user',
        text: text,
        timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      const currentStudent = getStudent();
      const currentMastery = (currentStudent && currentStudent.masteryMap[currentSkill]) || 0.40;

      try {
        const response = await fetch(`${apiBaseUrl}/api/socratic/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            student_id: studentId,
            message: text,
            stress_index: stressIndex,
            mastery_prob: currentMastery,
            topic: currentSkill
          })
        });

        const data = await response.json();

        const tutorMsg: ChatMessage = {
          id: `tutor-${Date.now()}`,
          sender: 'tutor',
          text: data.reply || 'ลองคิดทบทวนดูอีกครั้งครับ',
          timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
          stressAdapted: data.stress_adapted
        };

        setMessages((prev) => [...prev, tutorMsg]);
      } catch (err) {
        // Fallback response when offline
        const fallbackMsg: ChatMessage = {
          id: `tutor-err-${Date.now()}`,
          sender: 'tutor',
          text: stressIndex > 0.7 
            ? 'พี่ติวเตอร์ส่งกำลังใจให้นะครับ ลองพักผ่อนสักครู่ แล้วลองคิดดูสิว่าตัวเลขในโจทย์สัมพันธ์กันอย่างไร?' 
            : 'ลองพิจารณาดูอีกครั้งครับว่าขั้นตอนแรกของการคำนวณคืออะไร?',
          timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
          stressAdapted: stressIndex > 0.7
        };
        setMessages((prev) => [...prev, fallbackMsg]);
      } finally {
        setIsLoading(false);
      }
    },
    [apiBaseUrl, studentId, stressIndex, getStudent]
  );

  const submitProblemAttempt = useCallback(
    async (skillName: string, isCorrect: boolean) => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/bkt/update`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            student_id: studentId,
            skill_name: skillName,
            correct: isCorrect
          })
        });

        const data = await response.json();
        if (data && typeof data.updated_p_lt === 'number') {
          updateSkillMastery(skillName, data.updated_p_lt);
          if (isCorrect) addXP(50);
        }
      } catch (err) {
        // Offline BKT estimation
        const currentStudent = getStudent();
        const currentP = (currentStudent && currentStudent.masteryMap[skillName]) || 0.40;
        const newP = isCorrect ? Math.min(currentP + 0.1, 0.95) : Math.max(currentP - 0.08, 0.1);
        updateSkillMastery(skillName, parseFloat(newP.toFixed(2)));
        if (isCorrect) addXP(50);
      }
    },
    [apiBaseUrl, studentId, getStudent, updateSkillMastery, addXP]
  );

  return {
    messages,
    isLoading,
    sendMessage,
    submitProblemAttempt
  };
}
