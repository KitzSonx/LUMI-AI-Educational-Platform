import { create } from 'zustand';

export type StressLevel = 'LOW' | 'MEDIUM' | 'HIGH';

const STUDENT_AFFECT_BASELINES: Record<string, { stressIndex: number; stressLevel: StressLevel; recommendation: string }> = {
  std_001: {
    stressIndex: 0.15,
    stressLevel: 'LOW',
    recommendation: 'นักเรียนผ่อนคลาย พร้อมเรียนรู้ต่อ',
  },
  marcus: {
    stressIndex: 0.45,
    stressLevel: 'MEDIUM',
    recommendation: 'นักเรียนมีความลังเล ให้คำแนะนำเบาๆ',
  },
  std_002: {
    stressIndex: 0.20,
    stressLevel: 'LOW',
    recommendation: 'สมาธิดีเยี่ยม ลุยต่อบทเรียนถัดไปได้เลย',
  },
  std_003: {
    stressIndex: 0.75,
    stressLevel: 'HIGH',
    recommendation: 'นักเรียนมีระดับความเครียดสูง ควรให้กำลังใจและเสนอพักเบรก',
  },
};

interface AffectiveState {
  currentStudentId: string;
  isCameraActive: boolean;
  ear: number;
  earHistory: number[];
  headPitch: number;
  headYaw: number;
  headRoll: number;
  gazeOffscreen: boolean;
  canvasErases: number;
  stressIndex: number; // 0.0 to 1.0
  stressLevel: StressLevel;
  recommendation: string;

  // Actions
  switchStudent: (studentId: string) => void;
  setCameraActive: (active: boolean) => void;
  updateVisionMetrics: (metrics: {
    ear: number;
    headPitch: number;
    headYaw: number;
    headRoll: number;
    gazeOffscreen: boolean;
  }) => void;
  incrementCanvasErases: () => void;
  resetCanvasErases: () => void;
  updateStressTelemetry: (data: {
    stress_index: number;
    stress_level: StressLevel;
    recommendation: string;
  }) => void;
}

export const useAffectiveStore = create<AffectiveState>((set) => ({
  currentStudentId: 'std_001',
  isCameraActive: false,
  ear: 0.28,
  earHistory: [0.28, 0.27, 0.29, 0.26, 0.28],
  headPitch: 0,
  headYaw: 0,
  headRoll: 0,
  gazeOffscreen: false,
  canvasErases: 0,
  stressIndex: 0.15,
  stressLevel: 'LOW',
  recommendation: 'นักเรียนผ่อนคลาย พร้อมเรียนรู้ต่อ',

  switchStudent: (studentId) => {
    const baseline = STUDENT_AFFECT_BASELINES[studentId] || STUDENT_AFFECT_BASELINES['std_001'];
    set({
      currentStudentId: studentId,
      stressIndex: baseline.stressIndex,
      stressLevel: baseline.stressLevel,
      recommendation: baseline.recommendation,
      canvasErases: 0,
    });
  },

  setCameraActive: (active) => set({ isCameraActive: active }),

  updateVisionMetrics: (metrics) =>
    set((state) => {
      const newHistory = [...state.earHistory, metrics.ear].slice(-30);
      return {
        ear: metrics.ear,
        earHistory: newHistory,
        headPitch: metrics.headPitch,
        headYaw: metrics.headYaw,
        headRoll: metrics.headRoll,
        gazeOffscreen: metrics.gazeOffscreen,
      };
    }),

  incrementCanvasErases: () =>
    set((state) => ({ canvasErases: state.canvasErases + 1 })),

  resetCanvasErases: () => set({ canvasErases: 0 }),

  updateStressTelemetry: (data) =>
    set({
      stressIndex: data.stress_index,
      stressLevel: data.stress_level,
      recommendation: data.recommendation,
    }),
}));
