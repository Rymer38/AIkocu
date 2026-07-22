export type TargetField = "SAY" | "EA" | "SOZ" | "DIL";

export type Role = "student" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: Role;
  targetField: TargetField;
  targetUni: string;
  targetDept: string;
  targetRank: number;
  createdAt: string;
}

export interface TYTBreakdown {
  turkce: { d: number; y: number; net: number };
  sosyal: { d: number; y: number; net: number };
  matematik: { d: number; y: number; net: number };
  fen: { d: number; y: number; net: number };
}

export interface AYTBreakdown {
  matematik?: { d: number; y: number; net: number };
  fizik?: { d: number; y: number; net: number };
  kimya?: { d: number; y: number; net: number };
  biyoloji?: { d: number; y: number; net: number };
  edebiyat?: { d: number; y: number; net: number };
  tarih1?: { d: number; y: number; net: number };
  cografya1?: { d: number; y: number; net: number };
  tarih2?: { d: number; y: number; net: number };
  cografya2?: { d: number; y: number; net: number };
  felsefe?: { d: number; y: number; net: number };
  dkab?: { d: number; y: number; net: number };
  dil?: { d: number; y: number; net: number };
}

export interface ExamRecord {
  id: string;
  userId: string;
  type: "TYT" | "AYT";
  publisher: string;
  title: string;
  date: string; // YYYY-MM-DD
  durationMinutes: number;
  notes?: string;
  tytDetails?: TYTBreakdown;
  aytDetails?: AYTBreakdown;
  totalNet: number;
  calculatedScore: number;
  estimatedRank: number;
}

export type WrongReason = "Dikkatsizlik" | "Bilgi Eksikliği" | "Zaman Yetmedi" | "Yanlış Anlama" | "İşlem Hatası" | "Diğer";

export type Difficulty = "Kolay" | "Orta" | "Zor";

export interface ReviewLog {
  date: string;
  isCorrect: boolean;
  notes?: string;
}

export interface WrongQuestion {
  id: string;
  userId: string;
  subject: string;
  topic: string;
  difficulty: Difficulty;
  wrongReason: WrongReason;
  questionText: string;
  imageUrl?: string;
  solutionText?: string;
  aiHint?: string;
  createdAt: string;
  examId?: string;
  examTitle?: string; // e.g. "Deneme A - 3D TYT-1", "Deneme B - Bilgi Sarmal"
  // Spaced Repetition (Aralıklı Tekrar)
  spacedRepetitionEnabled: boolean;
  intervalDaysIndex: number; // 0 -> 1 gün, 1 -> 3 gün, 2 -> 7 gün, 3 -> 14 gün, 4 -> 30 gün
  nextReviewDate: string; // YYYY-MM-DD
  isMastered: boolean;
  reviewLogs: ReviewLog[];
}

export interface DailyRoutine {
  id: string;
  userId: string;
  title: string;
  category: "Paragraf" | "Problem" | "Geometri" | "Branş Denemesi" | "Konu Tekrarı" | "Diğer";
  targetCount: number;
  completedCount: number;
  completedDate: string; // YYYY-MM-DD
  isDone: boolean;
}

export interface TaskItem {
  id: string;
  userId: string;
  title: string;
  subject?: string;
  priority: "Düşük" | "Orta" | "Yüksek";
  dueDate?: string;
  isCompleted: boolean;
}

export interface PomodoroSession {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD HH:mm
  durationMinutes: number;
  subject?: string;
  completed: boolean;
}

export interface TopicProgress {
  id: string;
  examType: "TYT" | "AYT";
  subject: string;
  topicName: string;
  isStudied: boolean;
  isSummaryDone: boolean;
  isTestSolved: boolean;
  isReviewed: boolean;
}

export interface WeeklyScheduleSlot {
  id: string;
  day: "Pazartesi" | "Salı" | "Çarşamba" | "Perşembe" | "Cuma" | "Cumartesi" | "Pazar";
  timeSlot: string; // e.g. "09:00 - 10:30"
  subject: string;
  topicOrTask: string;
  isCompleted: boolean;
}

export interface DailyWellness {
  date: string; // YYYY-MM-DD
  sleepHours: number;
  waterGlasses: number;
  moodRating: number; // 1-5
  notes?: string;
}

export interface StudentData {
  exams: ExamRecord[];
  wrongQuestions: WrongQuestion[];
  routines: DailyRoutine[];
  tasks: TaskItem[];
  pomodoroLogs: PomodoroSession[];
  targetDailyQuestions: number;
  targetDailyStudyMinutes: number;
  topicProgress?: TopicProgress[];
  weeklySchedule?: WeeklyScheduleSlot[];
  wellnessLogs?: DailyWellness[];
}
