import { create } from 'zustand';

export interface ClassroomStudent {
  student_id: string;
  name: string;
  avatar: string;
  stress_index: number;
  stress_level: 'LOW' | 'MEDIUM' | 'HIGH';
  zone: 'FLOW' | 'FRUSTRATION' | 'BURNOUT';
  current_skill: string;
  mastery_prob: number;
  status_flag: string;
  high_stress_seconds?: number;
}

export interface GuardrailAuditEntry {
  timestamp: string;
  student_id: string;
  query: string;
  guardrail_triggered: boolean;
  action: string;
}

export interface ClassSummaryData {
  class_id: string;
  class_name: string;
  total_students: number;
  average_stress_index: number;
  high_stress_count: number;
  pct_mastery_target: number;
  at_risk_students: ClassroomStudent[];
  alert_students: ClassroomStudent[];
  students: ClassroomStudent[];
  guardrail_audit_log: GuardrailAuditEntry[];
  skill_matrix: {
    skill_name: string;
    topic_th: string;
    class_avg_p_lt: number;
    status: string;
  }[];
}

interface TeacherState {
  classId: string;
  isWsConnected: boolean;
  students: ClassroomStudent[];
  activeAlerts: ClassroomStudent[];
  summary: ClassSummaryData | null;
  aiActionPlan: string[];
  isGeneratingPlan: boolean;

  // Actions
  setClassId: (id: string) => void;
  setWsConnected: (connected: boolean) => void;
  updateClassroomSnapshot: (students: ClassroomStudent[]) => void;
  setSummary: (summary: ClassSummaryData) => void;
  setAIActionPlan: (plan: string[]) => void;
  setIsGeneratingPlan: (loading: boolean) => void;
}

export const useTeacherStore = create<TeacherState>((set) => ({
  classId: 'cls_401',
  isWsConnected: false,
  students: [
    { student_id: 'std_001', name: 'student 1', avatar: '🐱', stress_index: 0.15, stress_level: 'LOW', zone: 'FLOW', current_skill: 'fractions_addition', mastery_prob: 0.55, status_flag: 'BALANCED_LEARNING', high_stress_seconds: 0 },
    { student_id: 'marcus', name: 'Marcus', avatar: '🦊', stress_index: 0.45, stress_level: 'MEDIUM', zone: 'FRUSTRATION', current_skill: 'fractions_addition', mastery_prob: 0.72, status_flag: 'REPEATED_ERASE', high_stress_seconds: 15 },
    { student_id: 'std_002', name: 'student 2', avatar: '🦋', stress_index: 0.20, stress_level: 'LOW', zone: 'FLOW', current_skill: 'science_energy_transfer', mastery_prob: 0.60, status_flag: 'BALANCED_LEARNING', high_stress_seconds: 0 },
    { student_id: 'std_003', name: 'student 3', avatar: '🦉', stress_index: 0.85, stress_level: 'HIGH', zone: 'BURNOUT', current_skill: 'fractions_addition', mastery_prob: 0.30, status_flag: 'FATIGUE_DETECTED', high_stress_seconds: 75 },
  ],
  activeAlerts: [
    { student_id: 'std_003', name: 'student 3', avatar: '🦉', stress_index: 0.85, stress_level: 'HIGH', zone: 'BURNOUT', current_skill: 'fractions_addition', mastery_prob: 0.30, status_flag: 'FATIGUE_DETECTED', high_stress_seconds: 75 }
  ],
  summary: null,
  aiActionPlan: [
    "1. ⏸️ จัดช่วงพักสายตา 3 นาที: มีนักเรียนมีความเครียดสูง 1 คน เสนอทำกิจกรรมขยับร่างกายเบาๆ ก่อนเริ่มหัวข้อถัดไป",
    "2. 🧩 ทบทวนเนื้อหาแบบ Micro-Lesson ในเรื่อง 'การบวกเศษส่วน' (ค่าเฉลี่ย P(Lt) = 0.54): ใช้แบบจำลองรูปเค้กหรือแผนภาพวงกลมช่วยอธิบาย",
    "3. 🤝 จัดกลุ่มแบบ Peer Tutoring: จับคู่ Marcus ช่วยเหลือ student 3 เพื่อสร้างบรรยากาศเรียนรู้แบบมีส่วนร่วม"
  ],
  isGeneratingPlan: false,

  setClassId: (id) => set({ classId: id }),
  setWsConnected: (connected) => set({ isWsConnected: connected }),

  updateClassroomSnapshot: (incomingStudents) =>
    set(() => {
      const alerts = incomingStudents.filter((s) => (s.high_stress_seconds || 0) > 60 || s.zone === 'BURNOUT');
      return {
        students: incomingStudents,
        activeAlerts: alerts,
      };
    }),

  setSummary: (summaryData) => set({ summary: summaryData }),
  setAIActionPlan: (plan) => set({ aiActionPlan: plan }),
  setIsGeneratingPlan: (loading) => set({ isGeneratingPlan: loading }),
}));
