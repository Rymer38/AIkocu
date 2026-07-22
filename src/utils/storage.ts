import { ExamRecord, StudentData, User, WrongQuestion, DailyRoutine, TaskItem, PomodoroSession } from "../types";

const USERS_KEY = "yks_app_users_v1";
const CURRENT_USER_KEY = "yks_current_user_id_v1";

const DEFAULT_DEMO_STUDENT: User = {
  id: "student_demo_1",
  name: "Ali Yılmaz",
  email: "ogrenci@yks.com",
  password: "123",
  role: "student",
  targetField: "SAY",
  targetUni: "İstanbul Teknik Üniversitesi",
  targetDept: "Bilgisayar Mühendisliği",
  targetRank: 3500,
  createdAt: "2026-03-01",
};

const DEFAULT_ADMIN: User = {
  id: "admin_demo_1",
  name: "YKS Rehber Admin",
  email: "admin@yks.com",
  password: "123",
  role: "admin",
  targetField: "SAY",
  targetUni: "Orta Doğu Teknik Üniversitesi",
  targetDept: "Endüstri Mühendisliği",
  targetRank: 1000,
  createdAt: "2026-01-01",
};

// Initial Sample Data for Demo Student
const SAMPLE_EXAMS: ExamRecord[] = [
  {
    id: "exam_1",
    userId: "student_demo_1",
    type: "TYT",
    publisher: "3D Yayınları",
    title: "3D Türkiye Geneli TYT-1",
    date: "2026-03-10",
    durationMinutes: 165,
    notes: "Süre yetiştirmede paragrafta biraz takıldım, mat iyiydi.",
    tytDetails: {
      turkce: { d: 32, y: 5, net: 30.75 },
      sosyal: { d: 15, y: 3, net: 14.25 },
      matematik: { d: 28, y: 4, net: 27.0 },
      fen: { d: 14, y: 4, net: 13.0 },
    },
    totalNet: 85.0,
    calculatedScore: 380.5,
    estimatedRank: 24500,
  },
  {
    id: "exam_2",
    userId: "student_demo_1",
    type: "TYT",
    publisher: "Bilgi Sarmal",
    title: "Bilgi Sarmal TYT Deneme-4",
    date: "2026-03-24",
    durationMinutes: 165,
    notes: "Türkçe ve Fen ağ geliştirildi.",
    tytDetails: {
      turkce: { d: 34, y: 4, net: 33.0 },
      sosyal: { d: 16, y: 2, net: 15.5 },
      matematik: { d: 31, y: 3, net: 30.25 },
      fen: { d: 16, y: 2, net: 15.5 },
    },
    totalNet: 94.25,
    calculatedScore: 411.0,
    estimatedRank: 12800,
  },
  {
    id: "exam_3",
    userId: "student_demo_1",
    type: "AYT",
    publisher: "Orijinal Matematik",
    title: "Orijinal AYT Sayısal Deneme-2",
    date: "2026-04-02",
    durationMinutes: 180,
    notes: "Türev-İntegral sorularında 2 boş kaldı.",
    aytDetails: {
      matematik: { d: 29, y: 3, net: 28.25 },
      fizik: { d: 10, y: 2, net: 9.5 },
      kimya: { d: 11, y: 1, net: 10.75 },
      biyoloji: { d: 10, y: 2, net: 9.5 },
    },
    totalNet: 58.0,
    calculatedScore: 405.0,
    estimatedRank: 9500,
  },
];

const getTodayFormatted = (): string => {
  const d = new Date();
  return d.toISOString().split("T")[0];
};

const SAMPLE_WRONG_QUESTIONS: WrongQuestion[] = [
  {
    id: "wq_1",
    userId: "student_demo_1",
    subject: "Matematik (AYT)",
    topic: "İntegral",
    difficulty: "Zor",
    wrongReason: "Bilgi Eksikliği",
    questionText: "Parabol ile doğru arasında kalan bölgenin alanı türev-bağıntısı dönüşümü sorusu.",
    solutionText: "İki eğrinin kesişim noktaları x=1 ve x=4 bulunur. f(x)-g(x) farkının integrali alınır.",
    aiHint: "Türevden alana geçerken önce kesim noktalarını bularak alt ve üst sınırları belirlemeyi unutmayın.",
    createdAt: "2026-03-25",
    examTitle: "Deneme 1 (3D TYT)",
    spacedRepetitionEnabled: true,
    intervalDaysIndex: 1,
    nextReviewDate: getTodayFormatted(),
    isMastered: false,
    reviewLogs: [{ date: "2026-03-26", isCorrect: false }],
  },
  {
    id: "wq_2",
    userId: "student_demo_1",
    subject: "Matematik (TYT)",
    topic: "Problem",
    difficulty: "Orta",
    wrongReason: "Dikkatsizlik",
    questionText: "Hız problemleri dairesel pist sorusu.",
    solutionText: "V1 ve V2 hızları toplamı pist çevresine bölünür.",
    createdAt: "2026-03-10",
    examTitle: "Deneme 1 (3D TYT)",
    spacedRepetitionEnabled: true,
    intervalDaysIndex: 1,
    nextReviewDate: getTodayFormatted(),
    isMastered: false,
    reviewLogs: [],
  },
  {
    id: "wq_3",
    userId: "student_demo_1",
    subject: "Matematik (TYT)",
    topic: "Problem",
    difficulty: "Orta",
    wrongReason: "Zaman Yetmedi",
    questionText: "Yüzde kar-zarar karışım problemi.",
    solutionText: "Miktar x Yüzde toplamı / Toplam Miktar.",
    createdAt: "2026-03-10",
    examTitle: "Deneme 1 (3D TYT)",
    spacedRepetitionEnabled: true,
    intervalDaysIndex: 1,
    nextReviewDate: getTodayFormatted(),
    isMastered: false,
    reviewLogs: [],
  },
  {
    id: "wq_4",
    userId: "student_demo_1",
    subject: "Matematik (TYT)",
    topic: "Problem",
    difficulty: "Zor",
    wrongReason: "İşlem Hatası",
    questionText: "İşçi-havuz problemi bağıntı denklemi.",
    solutionText: "Bir günde bitirme oranları 1/x + 1/y = 1/T olarak yazılır.",
    createdAt: "2026-03-10",
    examTitle: "Deneme 1 (3D TYT)",
    spacedRepetitionEnabled: true,
    intervalDaysIndex: 1,
    nextReviewDate: getTodayFormatted(),
    isMastered: false,
    reviewLogs: [],
  },
  {
    id: "wq_5",
    userId: "student_demo_1",
    subject: "Matematik (TYT)",
    topic: "Problem",
    difficulty: "Orta",
    wrongReason: "Dikkatsizlik",
    questionText: "Sayı problemleri merdiven basamak sorusu.",
    solutionText: "Basamak sayısı x, 2'şer çıkıp 3'er inme denklemi.",
    createdAt: "2026-03-10",
    examTitle: "Deneme 1 (3D TYT)",
    spacedRepetitionEnabled: true,
    intervalDaysIndex: 1,
    nextReviewDate: getTodayFormatted(),
    isMastered: false,
    reviewLogs: [],
  },
  {
    id: "wq_6",
    userId: "student_demo_1",
    subject: "Matematik (TYT)",
    topic: "Problem",
    difficulty: "Zor",
    wrongReason: "Bilgi Eksikliği",
    questionText: "Yaş problemi oran-orantı bağıntısı.",
    solutionText: "Fark zamanla değişmez prensibi kullanılır.",
    createdAt: "2026-03-10",
    examTitle: "Deneme 1 (3D TYT)",
    spacedRepetitionEnabled: true,
    intervalDaysIndex: 1,
    nextReviewDate: getTodayFormatted(),
    isMastered: false,
    reviewLogs: [],
  },
  {
    id: "wq_7",
    userId: "student_demo_1",
    subject: "Türkçe (TYT)",
    topic: "Paragraf",
    difficulty: "Orta",
    wrongReason: "Yanlış Anlama",
    questionText: "Özgünlük ve kalıcılık kavramları arasındaki fark sorusu.",
    solutionText: "Metindeki 'çağını aşmak' vurgusu kalıcılığı gösterir.",
    createdAt: "2026-03-10",
    examTitle: "Deneme 1 (3D TYT)",
    spacedRepetitionEnabled: true,
    intervalDaysIndex: 4,
    nextReviewDate: "2026-04-15",
    isMastered: true,
    reviewLogs: [{ date: "2026-03-18", isCorrect: true }],
  },
  {
    id: "wq_8",
    userId: "student_demo_1",
    subject: "Türkçe (TYT)",
    topic: "Paragraf",
    difficulty: "Orta",
    wrongReason: "Dikkatsizlik",
    questionText: "Ana düşünce çıkarma metin sorusu.",
    createdAt: "2026-03-10",
    examTitle: "Deneme 1 (3D TYT)",
    spacedRepetitionEnabled: true,
    intervalDaysIndex: 1,
    nextReviewDate: getTodayFormatted(),
    isMastered: false,
    reviewLogs: [],
  },
  {
    id: "wq_9",
    userId: "student_demo_1",
    subject: "Türkçe (TYT)",
    topic: "Paragraf",
    difficulty: "Zor",
    wrongReason: "Yanlış Anlama",
    questionText: "Paragrafta akışı bozan cümle.",
    createdAt: "2026-03-10",
    examTitle: "Deneme 1 (3D TYT)",
    spacedRepetitionEnabled: true,
    intervalDaysIndex: 1,
    nextReviewDate: getTodayFormatted(),
    isMastered: false,
    reviewLogs: [],
  },
  {
    id: "wq_10",
    userId: "student_demo_1",
    subject: "Türkçe (TYT)",
    topic: "Paragraf",
    difficulty: "Orta",
    wrongReason: "Zaman Yetmedi",
    questionText: "İki paragrafa bölme sorusu.",
    createdAt: "2026-03-10",
    examTitle: "Deneme 1 (3D TYT)",
    spacedRepetitionEnabled: true,
    intervalDaysIndex: 1,
    nextReviewDate: getTodayFormatted(),
    isMastered: false,
    reviewLogs: [],
  },
  // Deneme 2 (Bilgi Sarmal)
  {
    id: "wq_11",
    userId: "student_demo_1",
    subject: "Matematik (TYT)",
    topic: "Problem",
    difficulty: "Orta",
    wrongReason: "Dikkatsizlik",
    questionText: "Deneme 2 - Hız problemi.",
    createdAt: "2026-03-24",
    examTitle: "Deneme 2 (Bilgi Sarmal)",
    spacedRepetitionEnabled: true,
    intervalDaysIndex: 1,
    nextReviewDate: getTodayFormatted(),
    isMastered: false,
    reviewLogs: [],
  },
  {
    id: "wq_12",
    userId: "student_demo_1",
    subject: "Matematik (TYT)",
    topic: "Problem",
    difficulty: "Orta",
    wrongReason: "İşlem Hatası",
    questionText: "Deneme 2 - Sayı problemi.",
    createdAt: "2026-03-24",
    examTitle: "Deneme 2 (Bilgi Sarmal)",
    spacedRepetitionEnabled: true,
    intervalDaysIndex: 1,
    nextReviewDate: getTodayFormatted(),
    isMastered: false,
    reviewLogs: [],
  },
  {
    id: "wq_13",
    userId: "student_demo_1",
    subject: "Matematik (TYT)",
    topic: "Problem",
    difficulty: "Zor",
    wrongReason: "Zaman Yetmedi",
    questionText: "Deneme 2 - Karışım problemi.",
    createdAt: "2026-03-24",
    examTitle: "Deneme 2 (Bilgi Sarmal)",
    spacedRepetitionEnabled: true,
    intervalDaysIndex: 1,
    nextReviewDate: getTodayFormatted(),
    isMastered: false,
    reviewLogs: [],
  },
  {
    id: "wq_14",
    userId: "student_demo_1",
    subject: "Türkçe (TYT)",
    topic: "Paragraf",
    difficulty: "Zor",
    wrongReason: "Yanlış Anlama",
    questionText: "Deneme 2 - Paragrafta yardımcı düşünce.",
    createdAt: "2026-03-24",
    examTitle: "Deneme 2 (Bilgi Sarmal)",
    spacedRepetitionEnabled: true,
    intervalDaysIndex: 1,
    nextReviewDate: getTodayFormatted(),
    isMastered: false,
    reviewLogs: [],
  },
  {
    id: "wq_15",
    userId: "student_demo_1",
    subject: "Türkçe (TYT)",
    topic: "Paragraf",
    difficulty: "Orta",
    wrongReason: "Dikkatsizlik",
    questionText: "Deneme 2 - Paragraf tamamlama.",
    createdAt: "2026-03-24",
    examTitle: "Deneme 2 (Bilgi Sarmal)",
    spacedRepetitionEnabled: true,
    intervalDaysIndex: 1,
    nextReviewDate: getTodayFormatted(),
    isMastered: false,
    reviewLogs: [],
  },
  {
    id: "wq_16",
    userId: "student_demo_1",
    subject: "Türkçe (TYT)",
    topic: "Paragraf",
    difficulty: "Zor",
    wrongReason: "Zaman Yetmedi",
    questionText: "Deneme 2 - Paragrafta anlatım teknikleri.",
    createdAt: "2026-03-24",
    examTitle: "Deneme 2 (Bilgi Sarmal)",
    spacedRepetitionEnabled: true,
    intervalDaysIndex: 1,
    nextReviewDate: getTodayFormatted(),
    isMastered: false,
    reviewLogs: [],
  },
  {
    id: "wq_17",
    userId: "student_demo_1",
    subject: "Türkçe (TYT)",
    topic: "Paragraf",
    difficulty: "Orta",
    wrongReason: "Dikkatsizlik",
    questionText: "Deneme 2 - Sözcükte anlam.",
    createdAt: "2026-03-24",
    examTitle: "Deneme 2 (Bilgi Sarmal)",
    spacedRepetitionEnabled: true,
    intervalDaysIndex: 1,
    nextReviewDate: getTodayFormatted(),
    isMastered: false,
    reviewLogs: [],
  },
  {
    id: "wq_18",
    userId: "student_demo_1",
    subject: "Türkçe (TYT)",
    topic: "Paragraf",
    difficulty: "Zor",
    wrongReason: "Yanlış Anlama",
    questionText: "Deneme 2 - Cümlede anlam.",
    createdAt: "2026-03-24",
    examTitle: "Deneme 2 (Bilgi Sarmal)",
    spacedRepetitionEnabled: true,
    intervalDaysIndex: 1,
    nextReviewDate: getTodayFormatted(),
    isMastered: false,
    reviewLogs: [],
  },
  {
    id: "wq_19",
    userId: "student_demo_1",
    subject: "Türkçe (TYT)",
    topic: "Paragraf",
    difficulty: "Orta",
    wrongReason: "Yanlış Anlama",
    questionText: "Deneme 2 - Paragraf sıralama.",
    createdAt: "2026-03-24",
    examTitle: "Deneme 2 (Bilgi Sarmal)",
    spacedRepetitionEnabled: true,
    intervalDaysIndex: 1,
    nextReviewDate: getTodayFormatted(),
    isMastered: false,
    reviewLogs: [],
  },
  {
    id: "wq_20",
    userId: "student_demo_1",
    subject: "Türkçe (TYT)",
    topic: "Paragraf",
    difficulty: "Zor",
    wrongReason: "Zaman Yetmedi",
    questionText: "Deneme 2 - Paragrafta boşluk doldurma.",
    createdAt: "2026-03-24",
    examTitle: "Deneme 2 (Bilgi Sarmal)",
    spacedRepetitionEnabled: true,
    intervalDaysIndex: 1,
    nextReviewDate: getTodayFormatted(),
    isMastered: false,
    reviewLogs: [],
  },
];

const SAMPLE_ROUTINES: DailyRoutine[] = [
  {
    id: "r_1",
    userId: "student_demo_1",
    title: "Günlük Paragraf Çözümü",
    category: "Paragraf",
    targetCount: 20,
    completedCount: 20,
    completedDate: getTodayFormatted(),
    isDone: true,
  },
  {
    id: "r_2",
    userId: "student_demo_1",
    title: "Günlük Rutin Problem Çözümü",
    category: "Problem",
    targetCount: 20,
    completedCount: 15,
    completedDate: getTodayFormatted(),
    isDone: false,
  },
  {
    id: "r_3",
    userId: "student_demo_1",
    title: "Geometri 1 Konu Testi",
    category: "Geometri",
    targetCount: 15,
    completedCount: 0,
    completedDate: getTodayFormatted(),
    isDone: false,
  },
];

const SAMPLE_TASKS: TaskItem[] = [
  {
    id: "t_1",
    userId: "student_demo_1",
    title: "AYT Fizik Modern Fizik özet notlarını oku",
    subject: "Fizik",
    priority: "Yüksek",
    dueDate: getTodayFormatted(),
    isCompleted: false,
  },
  {
    id: "t_2",
    userId: "student_demo_1",
    title: "Organik Kimya izomerlik soru fasikülü bitir",
    subject: "Kimya",
    priority: "Orta",
    dueDate: "2026-04-05",
    isCompleted: true,
  },
  {
    id: "t_3",
    userId: "student_demo_1",
    title: "Aralıklı Tekrar Defterindeki 2 soruyu çöz",
    subject: "Matematik",
    priority: "Yüksek",
    dueDate: getTodayFormatted(),
    isCompleted: false,
  },
];

const SAMPLE_POMODOROS: PomodoroSession[] = [
  {
    id: "p_1",
    userId: "student_demo_1",
    date: `${getTodayFormatted()} 09:30`,
    durationMinutes: 25,
    subject: "AYT Matematik",
    completed: true,
  },
  {
    id: "p_2",
    userId: "student_demo_1",
    date: `${getTodayFormatted()} 10:15`,
    durationMinutes: 25,
    subject: "AYT Fizik",
    completed: true,
  },
];

// Helper to initialize LocalStorage users if empty
export function getUsers(): User[] {
  const raw = localStorage.getItem(USERS_KEY);
  if (!raw) {
    const initUsers = [DEFAULT_DEMO_STUDENT, DEFAULT_ADMIN];
    localStorage.setItem(USERS_KEY, JSON.stringify(initUsers));

    // Save initial sample student data
    saveStudentData(DEFAULT_DEMO_STUDENT.id, {
      exams: SAMPLE_EXAMS,
      wrongQuestions: SAMPLE_WRONG_QUESTIONS,
      routines: SAMPLE_ROUTINES,
      tasks: SAMPLE_TASKS,
      pomodoroLogs: SAMPLE_POMODOROS,
      targetDailyQuestions: 150,
      targetDailyStudyMinutes: 240,
    });

    return initUsers;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return [DEFAULT_DEMO_STUDENT, DEFAULT_ADMIN];
  }
}

export function saveUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getCurrentUser(): User | null {
  const currentId = localStorage.getItem(CURRENT_USER_KEY);
  const users = getUsers();
  if (currentId === "LOGGED_OUT") {
    return null;
  }
  if (!currentId) {
    // Default to demo student on first visit
    localStorage.setItem(CURRENT_USER_KEY, DEFAULT_DEMO_STUDENT.id);
    return DEFAULT_DEMO_STUDENT;
  }
  return users.find((u) => u.id === currentId) || null;
}

export function setCurrentUser(userId: string | null) {
  if (userId) {
    localStorage.setItem(CURRENT_USER_KEY, userId);
  } else {
    localStorage.setItem(CURRENT_USER_KEY, "LOGGED_OUT");
  }
}

// Student Data Storage Isolation by User ID
const getStudentDataKey = (userId: string) => `yks_student_data_${userId}`;

export function getStudentData(userId: string): StudentData {
  const raw = localStorage.getItem(getStudentDataKey(userId));
  if (!raw) {
    return {
      exams: [],
      wrongQuestions: [],
      routines: [],
      tasks: [],
      pomodoroLogs: [],
      targetDailyQuestions: 120,
      targetDailyStudyMinutes: 200,
    };
  }
  try {
    return JSON.parse(raw);
  } catch {
    return {
      exams: [],
      wrongQuestions: [],
      routines: [],
      tasks: [],
      pomodoroLogs: [],
      targetDailyQuestions: 120,
      targetDailyStudyMinutes: 200,
    };
  }
}

export function saveStudentData(userId: string, data: StudentData) {
  localStorage.setItem(getStudentDataKey(userId), JSON.stringify(data));
}

// Full Export / Import JSON functionality
export function exportAllDataAsJSON(): string {
  const users = getUsers();
  const allStudentData: Record<string, StudentData> = {};

  users.forEach((u) => {
    allStudentData[u.id] = getStudentData(u.id);
  });

  const exportPayload = {
    version: "1.0",
    exportDate: new Date().toISOString(),
    users,
    allStudentData,
  };

  return JSON.stringify(exportPayload, null, 2);
}

export function importAllDataFromJSON(jsonString: string): boolean {
  try {
    const payload = JSON.parse(jsonString);
    if (payload.users && Array.isArray(payload.users)) {
      saveUsers(payload.users);
      if (payload.allStudentData) {
        Object.keys(payload.allStudentData).forEach((uId) => {
          saveStudentData(uId, payload.allStudentData[uId]);
        });
      }
      return true;
    }
    return false;
  } catch (err) {
    console.error("Failed to import JSON:", err);
    return false;
  }
}
