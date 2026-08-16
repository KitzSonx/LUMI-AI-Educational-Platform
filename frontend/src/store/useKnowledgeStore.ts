import { create } from 'zustand';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export interface YesterdayProgress {
  unitTopic: string;
  yesterdayPct: number;
  todayPct: number;
}

export interface StudentProfile {
  id: string;
  name: string;
  age: number;
  avatar: string;
  color: string;
  bg: string;
  level: number;
  xp: number;
  streakDays: number;
  dailyDone: number;
  dailyGoal: number;
  mood: string;
  greeting: string;
  yesterdayProgress: YesterdayProgress;
  subjectProgress: number[];
  masteryMap: Record<string, number>;
  badges: Badge[];
}

const INITIAL_STUDENTS: Record<string, StudentProfile> = {
  std_001: {
    id: 'std_001',
    name: 'student 1',
    age: 7,
    avatar: '🐱',
    color: '#E91E8C',
    bg: '#FCE4EC',
    level: 3,
    xp: 210,
    streakDays: 4,
    dailyDone: 1,
    dailyGoal: 2,
    mood: '😊',
    greeting: 'Ready to explore today?',
    yesterdayProgress: {
      unitTopic: 'Fractions & Decimals (Unit 6)',
      yesterdayPct: 40,
      todayPct: 55,
    },
    subjectProgress: [55, 40, 70, 20, 80, 30],
    masteryMap: {
      fractions_addition: 0.55,
      fractions_multiplication: 0.40,
      decimals_conversion: 0.70,
      science_energy_transfer: 0.30,
    },
    badges: [
      { id: 'b1', name: 'Fraction Master', description: 'Solved 10 fraction problems', icon: '🎯', unlocked: true },
      { id: 'b2', name: 'Calm & Focused', description: 'Maintained low stress for 15 mins', icon: '🧠', unlocked: true },
      { id: 'b3', name: 'Socratic Thinker', description: 'Answered 5 thought questions', icon: '💡', unlocked: false },
    ],
  },
  marcus: {
    id: 'marcus',
    name: 'Marcus',
    age: 14,
    avatar: '🦊',
    color: '#1E88E5',
    bg: '#E3F2FD',
    level: 7,
    xp: 580,
    streakDays: 12,
    dailyDone: 2,
    dailyGoal: 3,
    mood: '😎',
    greeting: "Back at it — let's keep the streak going.",
    yesterdayProgress: {
      unitTopic: 'Fractions & Decimals (Unit 6)',
      yesterdayPct: 62,
      todayPct: 72,
    },
    subjectProgress: [72, 65, 50, 44, 38, 80],
    masteryMap: {
      fractions_addition: 0.72,
      fractions_multiplication: 0.65,
      decimals_conversion: 0.50,
      science_energy_transfer: 0.80,
    },
    badges: [
      { id: 'b1', name: 'Fraction Master', description: 'Solved 10 fraction problems', icon: '🎯', unlocked: true },
      { id: 'b2', name: 'Calm & Focused', description: 'Maintained low stress for 15 mins', icon: '🧠', unlocked: true },
      { id: 'b3', name: 'Socratic Thinker', description: 'Answered 5 thought questions', icon: '💡', unlocked: true },
      { id: 'b4', name: 'Streak Legend', description: '12 day streak achieved', icon: '🔥', unlocked: true },
    ],
  },
  std_002: {
    id: 'std_002',
    name: 'student 2',
    age: 32,
    avatar: '🦋',
    color: '#4CAF50',
    bg: '#E8F5E9',
    level: 5,
    xp: 390,
    streakDays: 7,
    dailyDone: 2,
    dailyGoal: 2,
    mood: '🌿',
    greeting: 'Good to see you. Take it at your own pace.',
    yesterdayProgress: {
      unitTopic: 'Plants & Ecosystems (Unit 4)',
      yesterdayPct: 75,
      todayPct: 85,
    },
    subjectProgress: [60, 85, 35, 70, 45, 55],
    masteryMap: {
      fractions_addition: 0.60,
      fractions_multiplication: 0.85,
      decimals_conversion: 0.35,
      science_energy_transfer: 0.55,
    },
    badges: [
      { id: 'b1', name: 'Ecosystem Explorer', description: 'Mastered plant biology', icon: '🌱', unlocked: true },
      { id: 'b2', name: 'Calm & Focused', description: 'Maintained low stress for 15 mins', icon: '🧠', unlocked: true },
    ],
  },
  std_003: {
    id: 'std_003',
    name: 'student 3',
    age: 58,
    avatar: '🦉',
    color: '#FF8C42',
    bg: '#FFF0E6',
    level: 4,
    xp: 290,
    streakDays: 2,
    dailyDone: 1,
    dailyGoal: 1,
    mood: '📚',
    greeting: 'Every lesson counts. No rush.',
    yesterdayProgress: {
      unitTopic: 'Story Comprehension (Unit 9)',
      yesterdayPct: 72,
      todayPct: 80,
    },
    subjectProgress: [30, 55, 80, 60, 25, 40],
    masteryMap: {
      fractions_addition: 0.30,
      fractions_multiplication: 0.55,
      decimals_conversion: 0.80,
      science_energy_transfer: 0.40,
    },
    badges: [
      { id: 'b1', name: 'Wise Reader', description: 'Read 20 story units', icon: '📖', unlocked: true },
    ],
  },
};

interface KnowledgeState {
  studentId: string;
  students: Record<string, StudentProfile>;

  // Computed / Getter helper
  getStudent: () => StudentProfile;

  // Actions
  setStudentId: (id: string) => void;
  updateSkillMastery: (skillName: string, pLt: number) => void;
  addXP: (amount: number) => void;
  unlockBadge: (badgeId: string) => void;
}

export const useKnowledgeStore = create<KnowledgeState>((set, get) => ({
  studentId: 'std_001',
  students: INITIAL_STUDENTS,

  getStudent: () => {
    const { studentId, students } = get();
    return students[studentId] || students['std_001'];
  },

  setStudentId: (id) =>
    set((state) => ({
      studentId: id in state.students ? id : 'std_001',
    })),

  updateSkillMastery: (skillName, pLt) =>
    set((state) => {
      const current = state.students[state.studentId];
      if (!current) return state;

      const updatedStudent: StudentProfile = {
        ...current,
        masteryMap: {
          ...current.masteryMap,
          [skillName]: pLt,
        },
        yesterdayProgress: {
          ...current.yesterdayProgress,
          todayPct: Math.round(pLt * 100),
        },
      };

      return {
        students: {
          ...state.students,
          [state.studentId]: updatedStudent,
        },
      };
    }),

  addXP: (amount) =>
    set((state) => {
      const current = state.students[state.studentId];
      if (!current) return state;

      const updatedStudent: StudentProfile = {
        ...current,
        xp: current.xp + amount,
      };

      return {
        students: {
          ...state.students,
          [state.studentId]: updatedStudent,
        },
      };
    }),

  unlockBadge: (badgeId) =>
    set((state) => {
      const current = state.students[state.studentId];
      if (!current) return state;

      const updatedStudent: StudentProfile = {
        ...current,
        badges: current.badges.map((b) =>
          b.id === badgeId ? { ...b, unlocked: true } : b
        ),
      };

      return {
        students: {
          ...state.students,
          [state.studentId]: updatedStudent,
        },
      };
    }),
}));
