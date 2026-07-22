import React, { useState } from "react";
import { ExamRecord, StudentData, TargetField, AYTBreakdown, TYTBreakdown } from "../types";
import { 
  calculateTYTTotalNet, 
  calculateTYTScore, 
  calculateAYTTotalNet, 
  calculateAYTScore, 
  estimateTYTRank, 
  estimateAYTRank 
} from "../utils/yksCalculators";
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  X, 
  Award, 
  Calendar, 
  Clock, 
  ChevronRight,
  BarChart2
} from "lucide-react";

interface ExamsViewProps {
  studentData: StudentData;
  targetField: TargetField;
  onUpdateData: (data: StudentData) => void;
}

export const ExamsView: React.FC<ExamsViewProps> = ({
  studentData,
  targetField,
  onUpdateData,
}) => {
  const [filterType, setFilterType] = useState<"ALL" | "TYT" | "AYT">("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [examType, setExamType] = useState<"TYT" | "AYT">("TYT");
  const [publisher, setPublisher] = useState("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [durationMinutes, setDurationMinutes] = useState(165);
  const [notes, setNotes] = useState("");

  // TYT Inputs
  const [tytTurkce, setTytTurkce] = useState({ d: 30, y: 5 });
  const [tytSosyal, setTytSosyal] = useState({ d: 15, y: 3 });
  const [tytMat, setTytMat] = useState({ d: 25, y: 4 });
  const [tytFen, setTytFen] = useState({ d: 12, y: 4 });

  // AYT Inputs
  const [aytMat, setAytMat] = useState({ d: 25, y: 3 });
  const [aytFizik, setAytFizik] = useState({ d: 10, y: 2 });
  const [aytKimya, setAytKimya] = useState({ d: 10, y: 1 });
  const [aytBiyoloji, setAytBiyoloji] = useState({ d: 10, y: 2 });
  const [aytEdebiyat, setAytEdebiyat] = useState({ d: 18, y: 3 });
  const [aytTarih1, setAytTarih1] = useState({ d: 7, y: 2 });
  const [aytCog1, setAytCog1] = useState({ d: 5, y: 1 });

  const filteredExams = studentData.exams.filter((e) => {
    if (filterType === "ALL") return true;
    return e.type === filterType;
  });

  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();

    let totalNet = 0;
    let score = 0;
    let rank = 0;

    let tytDetailsObj: TYTBreakdown | undefined;
    let aytDetailsObj: AYTBreakdown | undefined;

    if (examType === "TYT") {
      tytDetailsObj = {
        turkce: { d: tytTurkce.d, y: tytTurkce.y, net: tytTurkce.d - tytTurkce.y * 0.25 },
        sosyal: { d: tytSosyal.d, y: tytSosyal.y, net: tytSosyal.d - tytSosyal.y * 0.25 },
        matematik: { d: tytMat.d, y: tytMat.y, net: tytMat.d - tytMat.y * 0.25 },
        fen: { d: tytFen.d, y: tytFen.y, net: tytFen.d - tytFen.y * 0.25 },
      };
      totalNet = calculateTYTTotalNet(tytDetailsObj);
      score = calculateTYTScore(tytDetailsObj);
      rank = estimateTYTRank(score);
    } else {
      aytDetailsObj = {
        matematik: { d: aytMat.d, y: aytMat.y, net: aytMat.d - aytMat.y * 0.25 },
        fizik: { d: aytFizik.d, y: aytFizik.y, net: aytFizik.d - aytFizik.y * 0.25 },
        kimya: { d: aytKimya.d, y: aytKimya.y, net: aytKimya.d - aytKimya.y * 0.25 },
        biyoloji: { d: aytBiyoloji.d, y: aytBiyoloji.y, net: aytBiyoloji.d - aytBiyoloji.y * 0.25 },
        edebiyat: { d: aytEdebiyat.d, y: aytEdebiyat.y, net: aytEdebiyat.d - aytEdebiyat.y * 0.25 },
        tarih1: { d: aytTarih1.d, y: aytTarih1.y, net: aytTarih1.d - aytTarih1.y * 0.25 },
        cografya1: { d: aytCog1.d, y: aytCog1.y, net: aytCog1.d - aytCog1.y * 0.25 },
      };

      // Find average TYT from existing exams or default to 80
      const pastTYTExams = studentData.exams.filter((x) => x.type === "TYT");
      const avgTYT = pastTYTExams.length > 0 ? pastTYTExams[pastTYTExams.length - 1].totalNet : 80;

      totalNet = calculateAYTTotalNet(aytDetailsObj);
      score = calculateAYTScore(avgTYT, aytDetailsObj, targetField);
      rank = estimateAYTRank(score, targetField);
    }

    const newRecord: ExamRecord = {
      id: `exam_${Date.now()}`,
      userId: studentData.exams[0]?.userId || "student_demo_1",
      type: examType,
      publisher: publisher || "Genel Deneme",
      title: title || `${publisher || "Genel"} ${examType} Denemesi`,
      date,
      durationMinutes,
      notes,
      tytDetails: tytDetailsObj,
      aytDetails: aytDetailsObj,
      totalNet,
      calculatedScore: score,
      estimatedRank: rank,
    };

    onUpdateData({
      ...studentData,
      exams: [newRecord, ...studentData.exams],
    });

    setIsModalOpen(false);
  };

  const handleDeleteExam = (id: string) => {
    if (confirm("Bu deneme sınavı kaydını silmek istediğinize emin misiniz?")) {
      onUpdateData({
        ...studentData,
        exams: studentData.exams.filter((e) => e.id !== id),
      });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <span>Deneme Sınavı Kaydı & İstatistikleri</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            TYT ve AYT deneme netlerinizi kaydedip ÖSYM puan ve sıralamanızı takip edin.
          </p>
        </div>

        <button
          id="open-add-exam-modal-btn"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Deneme Sınavı Ekle</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
        {(["ALL", "TYT", "AYT"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              filterType === t
                ? "bg-indigo-600 text-white"
                : "bg-slate-900 text-slate-400 hover:text-white"
            }`}
          >
            {t === "ALL" ? "Tüm Denemeler" : `${t} Denemeleri`}
          </button>
        ))}
      </div>

      {/* Exam Cards List */}
      <div className="space-y-4">
        {filteredExams.length === 0 ? (
          <div className="bg-slate-900 border border-dashed border-slate-800 rounded-2xl p-8 text-center">
            <BarChart2 className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-400">Henüz filtrenize uygun deneme kaydı bulunamadı.</p>
          </div>
        ) : (
          filteredExams.map((exam) => (
            <div
              key={exam.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
                <div className="flex items-start space-x-3">
                  <span
                    className={`px-3 py-1 rounded-xl font-bold text-xs ${
                      exam.type === "TYT"
                        ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                        : "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                    }`}
                  >
                    {exam.type}
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-white">{exam.title}</h3>
                    <div className="flex items-center space-x-3 text-xs text-slate-400 mt-1">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{exam.date}</span>
                      </span>
                      <span>•</span>
                      <span>Yayın: {exam.publisher}</span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{exam.durationMinutes} dk</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Net & Rank Summary Badge */}
                <div className="flex items-center space-x-4 bg-slate-950/60 border border-slate-800/80 rounded-xl px-4 py-2.5">
                  <div className="text-center border-r border-slate-800 pr-4">
                    <div className="text-[10px] text-slate-400 font-semibold uppercase">Toplam Net</div>
                    <div className="text-lg font-extrabold text-white">{exam.totalNet}</div>
                  </div>
                  <div className="text-center border-r border-slate-800 pr-4">
                    <div className="text-[10px] text-slate-400 font-semibold uppercase">Hesaplanan Puan</div>
                    <div className="text-sm font-bold text-cyan-300">{exam.calculatedScore}</div>
                  </div>
                  <div className="text-center pr-2">
                    <div className="text-[10px] text-slate-400 font-semibold uppercase">Tahmini Sıralama</div>
                    <div className="text-sm font-bold text-amber-400">#{exam.estimatedRank.toLocaleString("tr-TR")}</div>
                  </div>
                  <button
                    onClick={() => handleDeleteExam(exam.id)}
                    title="Denemeyi Sil"
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Subject Net Breakdown Grid */}
              <div className="mt-4 pt-2">
                <div className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider mb-2">Ders Bazlı Doğru / Yanlış / Net Dağılımı:</div>
                {exam.type === "TYT" && exam.tytDetails && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-2.5 bg-slate-950/40 border border-slate-800/60 rounded-xl">
                      <div className="text-xs font-semibold text-slate-300">Türkçe (40S)</div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        <span className="text-emerald-400 font-bold">{exam.tytDetails.turkce.d}D</span> /{" "}
                        <span className="text-rose-400 font-bold">{exam.tytDetails.turkce.y}Y</span> →{" "}
                        <span className="text-white font-extrabold">{exam.tytDetails.turkce.net} Net</span>
                      </div>
                    </div>
                    <div className="p-2.5 bg-slate-950/40 border border-slate-800/60 rounded-xl">
                      <div className="text-xs font-semibold text-slate-300">Sosyal (20S)</div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        <span className="text-emerald-400 font-bold">{exam.tytDetails.sosyal.d}D</span> /{" "}
                        <span className="text-rose-400 font-bold">{exam.tytDetails.sosyal.y}Y</span> →{" "}
                        <span className="text-white font-extrabold">{exam.tytDetails.sosyal.net} Net</span>
                      </div>
                    </div>
                    <div className="p-2.5 bg-slate-950/40 border border-slate-800/60 rounded-xl">
                      <div className="text-xs font-semibold text-slate-300">Temel Mat (40S)</div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        <span className="text-emerald-400 font-bold">{exam.tytDetails.matematik.d}D</span> /{" "}
                        <span className="text-rose-400 font-bold">{exam.tytDetails.matematik.y}Y</span> →{" "}
                        <span className="text-white font-extrabold">{exam.tytDetails.matematik.net} Net</span>
                      </div>
                    </div>
                    <div className="p-2.5 bg-slate-950/40 border border-slate-800/60 rounded-xl">
                      <div className="text-xs font-semibold text-slate-300">Fen Bil. (20S)</div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        <span className="text-emerald-400 font-bold">{exam.tytDetails.fen.d}D</span> /{" "}
                        <span className="text-rose-400 font-bold">{exam.tytDetails.fen.y}Y</span> →{" "}
                        <span className="text-white font-extrabold">{exam.tytDetails.fen.net} Net</span>
                      </div>
                    </div>
                  </div>
                )}

                {exam.type === "AYT" && exam.aytDetails && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {Object.entries(exam.aytDetails).map(([subKey, subVal]) => {
                      if (!subVal) return null;
                      const val = subVal as { d: number; y: number; net: number };
                      const titleMap: Record<string, string> = {
                        matematik: "AYT Mat (40S)",
                        fizik: "Fizik (14S)",
                        kimya: "Kimya (13S)",
                        biyoloji: "Biyoloji (13S)",
                        edebiyat: "Edebiyat (24S)",
                        tarih1: "Tarih-1 (10S)",
                        cografya1: "Coğrafya-1 (6S)",
                      };
                      return (
                        <div key={subKey} className="p-2.5 bg-slate-950/40 border border-slate-800/60 rounded-xl">
                          <div className="text-xs font-semibold text-slate-300">{titleMap[subKey] || subKey}</div>
                          <div className="text-xs text-slate-400 mt-0.5">
                            <span className="text-emerald-400 font-bold">{val.d}D</span> /{" "}
                            <span className="text-rose-400 font-bold">{val.y}Y</span> →{" "}
                            <span className="text-white font-extrabold">{val.net} Net</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {exam.notes && (
                  <div className="mt-3 p-2.5 bg-slate-950/30 border border-slate-800/40 rounded-xl text-xs text-slate-400 italic">
                    💡 Not: "{exam.notes}"
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Exam Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-8">
            <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                <span>Yeni Deneme Sınavı Kaydet</span>
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateExam} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              
              {/* Type Switcher */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setExamType("TYT")}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                    examType === "TYT"
                      ? "bg-cyan-600 text-white shadow-lg shadow-cyan-600/30"
                      : "bg-slate-950 text-slate-400 hover:text-white"
                  }`}
                >
                  TYT (Temel Yeterlilik Testi)
                </button>
                <button
                  type="button"
                  onClick={() => setExamType("AYT")}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                    examType === "AYT"
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                      : "bg-slate-950 text-slate-400 hover:text-white"
                  }`}
                >
                  AYT (Alan Yeterlilik Testi)
                </button>
              </div>

              {/* General Exam Meta */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Yayın / Kurum Adı</label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: 3D Yayınları / Bilgi Sarmal"
                    value={publisher}
                    onChange={(e) => setPublisher(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Deneme Başlığı / Adı</label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Türkiye Geneli 2. Deneme"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Sınav Tarihi</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Çözüm Süresi (Dakika)</label>
                  <input
                    type="number"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* TYT Inputs Breakdown */}
              {examType === "TYT" ? (
                <div className="space-y-3 pt-2 border-t border-slate-800">
                  <h4 className="text-xs font-bold uppercase text-cyan-400 tracking-wider">TYT Ders Doğru/Yanlış Sayıları</h4>
                  <div className="grid grid-cols-2 gap-3">
                    
                    {/* Türkçe */}
                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                      <label className="block text-xs font-bold text-slate-200 mb-1">Türkçe (40 Soruda)</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          placeholder="Doğru"
                          value={tytTurkce.d}
                          onChange={(e) => setTytTurkce({ ...tytTurkce, d: Number(e.target.value) })}
                          className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-emerald-400 font-bold text-xs"
                        />
                        <input
                          type="number"
                          placeholder="Yanlış"
                          value={tytTurkce.y}
                          onChange={(e) => setTytTurkce({ ...tytTurkce, y: Number(e.target.value) })}
                          className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-rose-400 font-bold text-xs"
                        />
                      </div>
                    </div>

                    {/* Sosyal */}
                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                      <label className="block text-xs font-bold text-slate-200 mb-1">Sosyal Bil. (20 Soruda)</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          placeholder="Doğru"
                          value={tytSosyal.d}
                          onChange={(e) => setTytSosyal({ ...tytSosyal, d: Number(e.target.value) })}
                          className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-emerald-400 font-bold text-xs"
                        />
                        <input
                          type="number"
                          placeholder="Yanlış"
                          value={tytSosyal.y}
                          onChange={(e) => setTytSosyal({ ...tytSosyal, y: Number(e.target.value) })}
                          className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-rose-400 font-bold text-xs"
                        />
                      </div>
                    </div>

                    {/* Matematik */}
                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                      <label className="block text-xs font-bold text-slate-200 mb-1">Temel Mat. (40 Soruda)</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          placeholder="Doğru"
                          value={tytMat.d}
                          onChange={(e) => setTytMat({ ...tytMat, d: Number(e.target.value) })}
                          className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-emerald-400 font-bold text-xs"
                        />
                        <input
                          type="number"
                          placeholder="Yanlış"
                          value={tytMat.y}
                          onChange={(e) => setTytMat({ ...tytMat, y: Number(e.target.value) })}
                          className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-rose-400 font-bold text-xs"
                        />
                      </div>
                    </div>

                    {/* Fen */}
                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                      <label className="block text-xs font-bold text-slate-200 mb-1">Fen Bil. (20 Soruda)</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          placeholder="Doğru"
                          value={tytFen.d}
                          onChange={(e) => setTytFen({ ...tytFen, d: Number(e.target.value) })}
                          className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-emerald-400 font-bold text-xs"
                        />
                        <input
                          type="number"
                          placeholder="Yanlış"
                          value={tytFen.y}
                          onChange={(e) => setTytFen({ ...tytFen, y: Number(e.target.value) })}
                          className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-rose-400 font-bold text-xs"
                        />
                      </div>
                    </div>

                  </div>
                </div>
              ) : (
                /* AYT Inputs Breakdown */
                <div className="space-y-3 pt-2 border-t border-slate-800">
                  <h4 className="text-xs font-bold uppercase text-indigo-400 tracking-wider">AYT Ders Doğru/Yanlış Sayıları</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    
                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                      <label className="block text-xs font-bold text-slate-200 mb-1">AYT Mat (40S)</label>
                      <div className="grid grid-cols-2 gap-1.5">
                        <input
                          type="number"
                          placeholder="D"
                          value={aytMat.d}
                          onChange={(e) => setAytMat({ ...aytMat, d: Number(e.target.value) })}
                          className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-emerald-400 font-bold text-xs"
                        />
                        <input
                          type="number"
                          placeholder="Y"
                          value={aytMat.y}
                          onChange={(e) => setAytMat({ ...aytMat, y: Number(e.target.value) })}
                          className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-rose-400 font-bold text-xs"
                        />
                      </div>
                    </div>

                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                      <label className="block text-xs font-bold text-slate-200 mb-1">Fizik (14S)</label>
                      <div className="grid grid-cols-2 gap-1.5">
                        <input
                          type="number"
                          placeholder="D"
                          value={aytFizik.d}
                          onChange={(e) => setAytFizik({ ...aytFizik, d: Number(e.target.value) })}
                          className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-emerald-400 font-bold text-xs"
                        />
                        <input
                          type="number"
                          placeholder="Y"
                          value={aytFizik.y}
                          onChange={(e) => setAytFizik({ ...aytFizik, y: Number(e.target.value) })}
                          className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-rose-400 font-bold text-xs"
                        />
                      </div>
                    </div>

                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                      <label className="block text-xs font-bold text-slate-200 mb-1">Kimya (13S)</label>
                      <div className="grid grid-cols-2 gap-1.5">
                        <input
                          type="number"
                          placeholder="D"
                          value={aytKimya.d}
                          onChange={(e) => setAytKimya({ ...aytKimya, d: Number(e.target.value) })}
                          className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-emerald-400 font-bold text-xs"
                        />
                        <input
                          type="number"
                          placeholder="Y"
                          value={aytKimya.y}
                          onChange={(e) => setAytKimya({ ...aytKimya, y: Number(e.target.value) })}
                          className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-rose-400 font-bold text-xs"
                        />
                      </div>
                    </div>

                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                      <label className="block text-xs font-bold text-slate-200 mb-1">Biyoloji (13S)</label>
                      <div className="grid grid-cols-2 gap-1.5">
                        <input
                          type="number"
                          placeholder="D"
                          value={aytBiyoloji.d}
                          onChange={(e) => setAytBiyoloji({ ...aytBiyoloji, d: Number(e.target.value) })}
                          className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-emerald-400 font-bold text-xs"
                        />
                        <input
                          type="number"
                          placeholder="Y"
                          value={aytBiyoloji.y}
                          onChange={(e) => setAytBiyoloji({ ...aytBiyoloji, y: Number(e.target.value) })}
                          className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-rose-400 font-bold text-xs"
                        />
                      </div>
                    </div>

                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                      <label className="block text-xs font-bold text-slate-200 mb-1">Edebiyat (24S)</label>
                      <div className="grid grid-cols-2 gap-1.5">
                        <input
                          type="number"
                          placeholder="D"
                          value={aytEdebiyat.d}
                          onChange={(e) => setAytEdebiyat({ ...aytEdebiyat, d: Number(e.target.value) })}
                          className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-emerald-400 font-bold text-xs"
                        />
                        <input
                          type="number"
                          placeholder="Y"
                          value={aytEdebiyat.y}
                          onChange={(e) => setAytEdebiyat({ ...aytEdebiyat, y: Number(e.target.value) })}
                          className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-rose-400 font-bold text-xs"
                        />
                      </div>
                    </div>

                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                      <label className="block text-xs font-bold text-slate-200 mb-1">Tarih-1 (10S)</label>
                      <div className="grid grid-cols-2 gap-1.5">
                        <input
                          type="number"
                          placeholder="D"
                          value={aytTarih1.d}
                          onChange={(e) => setAytTarih1({ ...aytTarih1, d: Number(e.target.value) })}
                          className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-emerald-400 font-bold text-xs"
                        />
                        <input
                          type="number"
                          placeholder="Y"
                          value={aytTarih1.y}
                          onChange={(e) => setAytTarih1({ ...aytTarih1, y: Number(e.target.value) })}
                          className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-rose-400 font-bold text-xs"
                        />
                      </div>
                    </div>

                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Sınav Notu / Değerlendirmesi</label>
                <textarea
                  rows={2}
                  placeholder="Zaman yönetimi, sınav anındaki stres veya dikkat hataları hakkında kısa notlar..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  İptal
                </button>
                <button
                  id="submit-exam-btn"
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30"
                >
                  Hesapla & Kaydet
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
