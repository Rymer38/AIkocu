import React, { useState } from "react";
import { StudentData, WeeklyScheduleSlot, User } from "../types";
import { 
  Calendar, 
  Plus, 
  Sparkles, 
  CheckCircle, 
  Trash2, 
  Clock, 
  BookOpen, 
  RefreshCw,
  X
} from "lucide-react";

interface WeeklyScheduleViewProps {
  currentUser: User;
  studentData: StudentData;
  onUpdateData: (data: StudentData) => void;
}

const DAYS: WeeklyScheduleSlot["day"][] = [
  "Pazartesi",
  "Salı",
  "Çarşamba",
  "Perşembe",
  "Cuma",
  "Cumartesi",
  "Pazar",
];

export const WeeklyScheduleView: React.FC<WeeklyScheduleViewProps> = ({
  currentUser,
  studentData,
  onUpdateData,
}) => {
  const [selectedDay, setSelectedDay] = useState<WeeklyScheduleSlot["day"]>("Pazartesi");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // Modal Form State
  const [timeSlot, setTimeSlot] = useState("09:00 - 10:30");
  const [subject, setSubject] = useState("Matematik");
  const [topicOrTask, setTopicOrTask] = useState("");

  const schedule: WeeklyScheduleSlot[] = studentData.weeklySchedule || [
    {
      id: "ws_1",
      day: "Pazartesi",
      timeSlot: "09:00 - 10:30",
      subject: "Matematik (AYT)",
      topicOrTask: "Türev Alma Kuralları Soru Çözümü",
      isCompleted: true,
    },
    {
      id: "ws_2",
      day: "Pazartesi",
      timeSlot: "11:00 - 12:30",
      subject: "Fizik (AYT)",
      topicOrTask: "Çembersel Hareket Formül Tekrarı",
      isCompleted: false,
    },
    {
      id: "ws_3",
      day: "Salı",
      timeSlot: "09:00 - 10:30",
      subject: "Türkçe (TYT)",
      topicOrTask: "20 Paragraf Rutini + Ses Bilgisi",
      isCompleted: false,
    },
  ];

  const handleToggleSlot = (id: string) => {
    const updated = schedule.map((slot) => {
      if (slot.id === id) {
        return { ...slot, isCompleted: !slot.isCompleted };
      }
      return slot;
    });
    onUpdateData({ ...studentData, weeklySchedule: updated });
  };

  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    const newSlot: WeeklyScheduleSlot = {
      id: `ws_${Date.now()}`,
      day: selectedDay,
      timeSlot,
      subject,
      topicOrTask: topicOrTask || "Genel Çalışma",
      isCompleted: false,
    };

    onUpdateData({
      ...studentData,
      weeklySchedule: [...schedule, newSlot],
    });

    setIsModalOpen(false);
    setTopicOrTask("");
  };

  const handleDeleteSlot = (id: string) => {
    onUpdateData({
      ...studentData,
      weeklySchedule: schedule.filter((s) => s.id !== id),
    });
  };

  const handleGenerateAiSchedule = async () => {
    setIsAiGenerating(true);
    try {
      // Create a smart weekly schedule based on user's field
      const isSay = currentUser.targetField === "SAY";
      const isEa = currentUser.targetField === "EA";

      const generated: WeeklyScheduleSlot[] = [
        // Pazartesi
        {
          id: `ai_${Date.now()}_1`,
          day: "Pazartesi",
          timeSlot: "09:00 - 10:30",
          subject: isSay ? "AYT Matematik" : "AYT Edebiyat",
          topicOrTask: isSay ? "Türev & İntegral 40 Soru" : "Cumhuriyet Dönemi Şiir Grubu",
          isCompleted: false,
        },
        {
          id: `ai_${Date.now()}_2`,
          day: "Pazartesi",
          timeSlot: "11:00 - 12:30",
          subject: "TYT Paragraf & Problem",
          topicOrTask: "20 Paragraf + 20 Problem Rutini",
          isCompleted: false,
        },
        {
          id: `ai_${Date.now()}_3`,
          day: "Pazartesi",
          timeSlot: "14:00 - 15:30",
          subject: isSay ? "AYT Fizik" : "AYT Matematik",
          topicOrTask: isSay ? "Çembersel Hareket & Momentum" : "Logaritma & Diziler",
          isCompleted: false,
        },
        // Salı
        {
          id: `ai_${Date.now()}_4`,
          day: "Salı",
          timeSlot: "09:00 - 10:30",
          subject: isSay ? "AYT Kimya" : "AYT Tarih",
          topicOrTask: isSay ? "Organik Kimya İzomerlik" : "Milli Mücadele Dönemi",
          isCompleted: false,
        },
        {
          id: `ai_${Date.now()}_5`,
          day: "Salı",
          timeSlot: "11:00 - 12:30",
          subject: "TYT Geometri",
          topicOrTask: "Üçgende Alan & Benzerlik 30 Soru",
          isCompleted: false,
        },
        // Çarşamba
        {
          id: `ai_${Date.now()}_6`,
          day: "Çarşamba",
          timeSlot: "09:00 - 12:00",
          subject: "TYT Genel Deneme",
          topicOrTask: "3D veya Bilgi Sarmal TYT Denemesi (165 dk)",
          isCompleted: false,
        },
        {
          id: `ai_${Date.now()}_7`,
          day: "Çarşamba",
          timeSlot: "14:00 - 16:00",
          subject: "Yanlış Soru Defteri",
          topicOrTask: "Deneme Analizi & Aralıklı Tekrar Çözümü",
          isCompleted: false,
        },
        // Perşembe
        {
          id: `ai_${Date.now()}_8`,
          day: "Perşembe",
          timeSlot: "09:00 - 10:30",
          subject: isSay ? "AYT Biyoloji" : "AYT Coğrafya",
          topicOrTask: isSay ? "Bitki Biyolojisi Dokular" : "Türkiye'nin İklimi & Yerşekilleri",
          isCompleted: false,
        },
        {
          id: `ai_${Date.now()}_9`,
          day: "Perşembe",
          timeSlot: "11:00 - 12:30",
          subject: "AYT Matematik",
          topicOrTask: "Trigonometri Formülleri & Soru Çözümü",
          isCompleted: false,
        },
        // Cuma
        {
          id: `ai_${Date.now()}_10`,
          day: "Cuma",
          timeSlot: "09:00 - 10:30",
          subject: isSay ? "AYT Fizik" : "AYT Edebiyat",
          topicOrTask: isSay ? "Elektromanyetik İndüksiyon" : "Divan Edebiyatı Nazım Şekilleri",
          isCompleted: false,
        },
        {
          id: `ai_${Date.now()}_11`,
          day: "Cuma",
          timeSlot: "11:00 - 12:30",
          subject: "TYT Türkçe",
          topicOrTask: "Yazım Kuralları & Noktalama Testi",
          isCompleted: false,
        },
        // Cumartesi
        {
          id: `ai_${Date.now()}_12`,
          day: "Cumartesi",
          timeSlot: "09:00 - 12:00",
          subject: "AYT Branş Denemesi",
          topicOrTask: "AYT Matematik & Fen/Sosyal Branş Denemesi",
          isCompleted: false,
        },
        // Pazar
        {
          id: `ai_${Date.now()}_13`,
          day: "Pazar",
          timeSlot: "10:00 - 12:00",
          subject: "Haftalık Konu Tekrarı",
          topicOrTask: "Aralıklı Tekrar Defterindeki 30 Günlük Sorular",
          isCompleted: false,
        },
      ];

      onUpdateData({
        ...studentData,
        weeklySchedule: generated,
      });

      alert("🎉 Yapay Zeka kişiselleştirilmiş 7 günlük çalışma programınızı başarıyla oluşturdu!");
    } catch (err) {
      console.error("AI Schedule Error:", err);
    } finally {
      setIsAiGenerating(false);
    }
  };

  const currentDaySlots = schedule.filter((s) => s.day === selectedDay);

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>Haftalık Çalışma Planlayıcısı</span>
          </div>
          <h1 className="text-xl font-bold text-white">İnteraktif Ders Programı</h1>
          <p className="text-xs text-slate-400 mt-1">
            Gün gün ders saatlerinizi düzenleyin veya Yapay Zeka ile otomatik ideal YKS programı oluşturun.
          </p>
        </div>

        <button
          id="generate-ai-schedule-btn"
          onClick={handleGenerateAiSchedule}
          disabled={isAiGenerating}
          className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/20 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
        >
          <Sparkles className={`w-4 h-4 ${isAiGenerating ? "animate-spin" : ""}`} />
          <span>{isAiGenerating ? "Oluşturuluyor..." : "Yapay Zeka ile Program Oluştur"}</span>
        </button>
      </div>

      {/* Days Tabs Header */}
      <div className="flex items-center space-x-1.5 overflow-x-auto bg-slate-900/80 p-2 rounded-2xl border border-slate-800 scrollbar-none">
        {DAYS.map((day) => {
          const count = schedule.filter((s) => s.day === day).length;
          const completedCount = schedule.filter((s) => s.day === day && s.isCompleted).length;

          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center space-x-2 ${
                selectedDay === day
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800/80"
              }`}
            >
              <span>{day}</span>
              {count > 0 && (
                <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                  selectedDay === day ? "bg-indigo-700 text-white" : "bg-slate-800 text-slate-400"
                }`}>
                  {completedCount}/{count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Slots Card for Selected Day */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>{selectedDay} Günü Ders Programı</span>
          </h2>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-1 px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-semibold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Ders Blogu Ekle</span>
          </button>
        </div>

        <div className="space-y-3">
          {currentDaySlots.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              {selectedDay} günü için henüz tanımlanmış ders bloğu yok. Yukarıdaki butonla veya Yapay Zeka ile oluşturabilirsiniz.
            </div>
          ) : (
            currentDaySlots.map((slot) => (
              <div
                key={slot.id}
                className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                  slot.isCompleted
                    ? "bg-emerald-950/20 border-emerald-500/30"
                    : "bg-slate-950/80 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center space-x-4 cursor-pointer" onClick={() => handleToggleSlot(slot.id)}>
                  <input
                    type="checkbox"
                    checked={slot.isCompleted}
                    onChange={() => {}}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-0 cursor-pointer"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded font-mono text-[10px] font-bold">
                        {slot.timeSlot}
                      </span>
                      <strong className={`text-xs ${slot.isCompleted ? "line-through text-slate-400" : "text-white"}`}>
                        {slot.subject}
                      </strong>
                    </div>
                    <p className={`text-xs mt-1 ${slot.isCompleted ? "line-through text-slate-500" : "text-slate-300"}`}>
                      {slot.topicOrTask}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteSlot(slot.id)}
                  className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Slot Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">{selectedDay} Gününe Ders Ekle</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSlot} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Saat Dilimi</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: 09:00 - 10:30"
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Ders Adı</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: AYT Matematik"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Konu / Soru Hedefi</label>
                <textarea
                  rows={2}
                  placeholder="Örn: Türev türev alma kuralları 30 soru çözümü"
                  value={topicOrTask}
                  onChange={(e) => setTopicOrTask(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold"
                >
                  Program Ekle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
