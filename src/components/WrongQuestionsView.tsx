import React, { useState } from "react";
import { StudentData, WrongQuestion, WrongReason, Difficulty } from "../types";
import { 
  HelpCircle, 
  Plus, 
  Sparkles, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Filter, 
  Trash2, 
  X, 
  Image as ImageIcon,
  Clock,
  BookOpen,
  Tag,
  TrendingUp,
  TrendingDown,
  BarChart3,
  AlertTriangle,
  Camera,
  Loader2
} from "lucide-react";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid, 
  LineChart, 
  Line 
} from "recharts";

interface WrongQuestionsViewProps {
  studentData: StudentData;
  onUpdateData: (data: StudentData) => void;
}

export const WrongQuestionsView: React.FC<WrongQuestionsViewProps> = ({
  studentData,
  onUpdateData,
}) => {
  const [activeTab, setActiveTab] = useState<"LIST" | "ANALYTICS">("LIST");
  const [filterMode, setFilterMode] = useState<"ALL" | "TODAY_DUE" | "MASTERED">("TODAY_DUE");
  const [selectedSubject, setSelectedSubject] = useState<string>("ALL");
  const [selectedExamFilter, setSelectedExamFilter] = useState<string>("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeQuestionForDetail, setActiveQuestionForDetail] = useState<WrongQuestion | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isScanningImage, setIsScanningImage] = useState(false);
  const [scanStatusMsg, setScanStatusMsg] = useState("");

  // Form State
  const [subject, setSubject] = useState("Matematik (TYT)");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("Orta");
  const [wrongReason, setWrongReason] = useState<WrongReason>("Bilgi Eksikliği");
  const [questionText, setQuestionText] = useState("");
  const [solutionText, setSolutionText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [examTitle, setExamTitle] = useState("Deneme 1 (3D TYT)");
  const [customExamTitle, setCustomExamTitle] = useState("");

  const todayStr = new Date().toISOString().split("T")[0];

  // List of unique exams recorded in the user's exam records + wrong questions
  const availableExams = Array.from(
    new Set([
      "Deneme 1 (3D TYT)",
      "Deneme 2 (Bilgi Sarmal)",
      ...studentData.exams.map((e) => e.title),
      ...studentData.wrongQuestions.map((q) => q.examTitle).filter(Boolean) as string[],
    ])
  );

  // Filtered Wrong Questions
  const filteredQuestions = studentData.wrongQuestions.filter((wq) => {
    if (filterMode === "TODAY_DUE") {
      if (wq.isMastered || !wq.spacedRepetitionEnabled) return false;
      if (wq.nextReviewDate > todayStr) return false;
    } else if (filterMode === "MASTERED") {
      if (!wq.isMastered) return false;
    }

    if (selectedSubject !== "ALL" && !wq.subject.includes(selectedSubject)) {
      return false;
    }

    if (selectedExamFilter !== "ALL" && wq.examTitle !== selectedExamFilter) {
      return false;
    }

    return true;
  });

  const dueCount = studentData.wrongQuestions.filter(
    (wq) => wq.spacedRepetitionEnabled && !wq.isMastered && wq.nextReviewDate <= todayStr
  ).length;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // AI OCR Photo Scan function
  const handleAiScanImage = async () => {
    if (!imageUrl) {
      alert("Lütfen önce bir soru fotoğrafı yükleyin!");
      return;
    }

    setIsScanningImage(true);
    setScanStatusMsg("Yapay Zeka soruyu okuyor ve YKS konusunu tespit ediyor...");

    try {
      const res = await fetch("/api/gemini/scan-question-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: imageUrl }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        const d = json.data;
        if (d.subject) setSubject(d.subject);
        if (d.topic) setTopic(d.topic);
        if (d.difficulty) setDifficulty(d.difficulty);
        if (d.wrongReason) setWrongReason(d.wrongReason);
        if (d.questionSummary) setQuestionText(d.questionSummary);
        if (d.solutionText) setSolutionText(d.solutionText);
        setScanStatusMsg("✨ Yapay Zeka konuyu başarıyla tespit etti!");
      }
    } catch (err) {
      console.error("AI Scan error:", err);
      setScanStatusMsg("Resim tarama sırasında bir hata oluştu, bilgileri elle girebilirsiniz.");
    } finally {
      setIsScanningImage(false);
    }
  };

  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    const finalExamTitle = examTitle === "CUSTOM" ? customExamTitle || "Özel Deneme" : examTitle;

    const newWq: WrongQuestion = {
      id: `wq_${Date.now()}`,
      userId: studentData.wrongQuestions[0]?.userId || "user_active",
      subject,
      topic: topic || "Genel Soru",
      difficulty,
      wrongReason,
      questionText,
      imageUrl,
      solutionText,
      createdAt: todayStr,
      examTitle: finalExamTitle,
      spacedRepetitionEnabled: true,
      intervalDaysIndex: 0,
      nextReviewDate: todayStr,
      isMastered: false,
      reviewLogs: [],
    };

    onUpdateData({
      ...studentData,
      wrongQuestions: [newWq, ...studentData.wrongQuestions],
    });

    setIsModalOpen(false);
    // Reset Form
    setQuestionText("");
    setSolutionText("");
    setImageUrl("");
    setTopic("");
    setScanStatusMsg("");
  };

  const handleReviewAction = (wqId: string, isCorrect: boolean) => {
    const intervals = [1, 3, 7, 14, 30];

    const updated = studentData.wrongQuestions.map((wq) => {
      if (wq.id === wqId) {
        let newIndex = wq.intervalDaysIndex;
        let mastered = false;

        if (isCorrect) {
          newIndex += 1;
          if (newIndex >= intervals.length) {
            mastered = true;
          }
        } else {
          newIndex = 0;
        }

        const nextDateObj = new Date();
        nextDateObj.setDate(nextDateObj.getDate() + (intervals[newIndex] || 1));
        const nextDateStr = nextDateObj.toISOString().split("T")[0];

        return {
          ...wq,
          intervalDaysIndex: newIndex,
          nextReviewDate: nextDateStr,
          isMastered: mastered,
          reviewLogs: [
            ...wq.reviewLogs,
            { date: todayStr, isCorrect },
          ],
        };
      }
      return wq;
    });

    onUpdateData({ ...studentData, wrongQuestions: updated });
    if (activeQuestionForDetail?.id === wqId) {
      setActiveQuestionForDetail(null);
    }
  };

  const handleDeleteQuestion = (id: string) => {
    if (confirm("Bu yanlış soruyu defterinizden silmek istediğinize emin misiniz?")) {
      onUpdateData({
        ...studentData,
        wrongQuestions: studentData.wrongQuestions.filter((q) => q.id !== id),
      });
      if (activeQuestionForDetail?.id === id) {
        setActiveQuestionForDetail(null);
      }
    }
  };

  const handleFetchAiHint = async (wq: WrongQuestion) => {
    setIsAiLoading(true);
    try {
      const res = await fetch("/api/gemini/question-hint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: wq.subject,
          topic: wq.topic,
          difficulty: wq.difficulty,
          wrongReason: wq.wrongReason,
          questionText: wq.questionText || "Görsel Soru",
        }),
      });
      const data = await res.json();
      if (data.analysis) {
        const updated = studentData.wrongQuestions.map((q) => {
          if (q.id === wq.id) {
            return { ...q, aiHint: data.analysis };
          }
          return q;
        });
        onUpdateData({ ...studentData, wrongQuestions: updated });
        setActiveQuestionForDetail({ ...wq, aiHint: data.analysis });
      }
    } catch (err) {
      console.error("AI Hint Fetch Error:", err);
    } finally {
      setIsAiLoading(false);
    }
  };

  // --- TOPIC & EXAM ERROR TREND CALCULATIONS ---
  // Group questions by Exam Title and Topic
  const examTitlesList = Array.from(
    new Set(studentData.wrongQuestions.map((q) => q.examTitle || "Belirtilmedi"))
  ).filter((t) => t !== "Belirtilmedi");

  // Get list of top topics with wrong questions
  const topicCountsMap: Record<string, number> = {};
  studentData.wrongQuestions.forEach((q) => {
    if (q.topic) {
      topicCountsMap[q.topic] = (topicCountsMap[q.topic] || 0) + 1;
    }
  });

  const topTopics = Object.entries(topicCountsMap)
    .sort((a, b) => b[1] - a[1])
    .map(([topicName]) => topicName);

  // Prepare Chart Data for Recharts: Each row is an Exam, with keys for each Top Topic
  const chartData = examTitlesList.map((examName) => {
    const row: Record<string, any> = { examName };
    topTopics.forEach((t) => {
      const count = studentData.wrongQuestions.filter(
        (q) => (q.examTitle || "Belirtilmedi") === examName && q.topic === t
      ).length;
      row[t] = count;
    });
    return row;
  });

  // Calculate trends for top topics between first exam and last exam
  const topicTrends = topTopics.map((topicName) => {
    const countsPerExam = examTitlesList.map((examName) => {
      return studentData.wrongQuestions.filter(
        (q) => (q.examTitle || "Belirtilmedi") === examName && q.topic === topicName
      ).length;
    });

    const firstVal = countsPerExam[0] || 0;
    const lastVal = countsPerExam[countsPerExam.length - 1] || 0;
    const diff = lastVal - firstVal;

    return {
      topicName,
      firstVal,
      lastVal,
      diff,
      status: diff > 0 ? "INCREASED" : diff < 0 ? "DECREASED" : "STABLE",
    };
  });

  const colorPalette = ["#6366f1", "#f59e0b", "#ec4899", "#10b981", "#06b6d4", "#8b5cf6", "#f43f5e"];

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Fotoğraf Taraması & Deneme Konu Kıyaslama</span>
          </div>
          <h1 className="text-xl font-bold text-white flex items-center space-x-2">
            <HelpCircle className="w-5 h-5 text-indigo-400" />
            <span>Yanlış Soru Defteri ve Deneme Analizi</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Sorunun fotoğrafını yükleyin, AI konuyu tespit etsin. Denemeler arası hangi konuda yanlışın arttığını ve düştüğünü grafikle takip edin.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            id="open-add-wq-modal-btn"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-amber-600/20 transition-all"
          >
            <Camera className="w-4 h-4" />
            <span>Fotoğraf Çek / Soru Ekle</span>
          </button>
        </div>
      </div>

      {/* Primary Navigation Tabs: Defter vs Grafik Kıyaslama */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab("LIST")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "LIST"
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
              : "bg-slate-900 text-slate-400 hover:text-white"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Soru Defterim ({studentData.wrongQuestions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("ANALYTICS")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "ANALYTICS"
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
              : "bg-slate-900 text-slate-400 hover:text-white"
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Denemeler Arası Konu Yanlış Grafiği</span>
        </button>
      </div>

      {/* TAB 1: LIST VIEW */}
      {activeTab === "LIST" && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
            <div className="flex items-center space-x-2 overflow-x-auto scrollbar-none">
              <button
                onClick={() => setFilterMode("TODAY_DUE")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 whitespace-nowrap ${
                  filterMode === "TODAY_DUE"
                    ? "bg-amber-500 text-slate-950 shadow-md"
                    : "bg-slate-800 text-slate-300 hover:text-white"
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Bugünün Tekrarları ({dueCount})</span>
              </button>

              <button
                onClick={() => setFilterMode("ALL")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                  filterMode === "ALL"
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-800 text-slate-300 hover:text-white"
                }`}
              >
                Tümü ({studentData.wrongQuestions.length})
              </button>

              <button
                onClick={() => setFilterMode("MASTERED")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                  filterMode === "MASTERED"
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-800 text-slate-300 hover:text-white"
                }`}
              >
                Tamamen Öğrenilenler ({studentData.wrongQuestions.filter((q) => q.isMastered).length})
              </button>
            </div>

            {/* Subject and Exam Filter */}
            <div className="flex items-center space-x-2">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none"
              >
                <option value="ALL">Tüm Dersler</option>
                <option value="Matematik">Matematik</option>
                <option value="Fizik">Fizik</option>
                <option value="Kimya">Kimya</option>
                <option value="Biyoloji">Biyoloji</option>
                <option value="Türkçe">Türkçe / Edebiyat</option>
              </select>

              <select
                value={selectedExamFilter}
                onChange={(e) => setSelectedExamFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none max-w-[150px]"
              >
                <option value="ALL">Tüm Denemeler</option>
                {availableExams.map((ex) => (
                  <option key={ex} value={ex}>
                    {ex}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Questions Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredQuestions.length === 0 ? (
              <div className="col-span-full bg-slate-900 border border-dashed border-slate-800 rounded-2xl p-10 text-center">
                <HelpCircle className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-300">
                  {filterMode === "TODAY_DUE"
                    ? "🎉 Harika! Bugün tekrar edilmesi gereken soru kalmadı."
                    : "Bu filtreye uygun yanlış soru kaydı bulunmuyor."}
                </p>
              </div>
            ) : (
              filteredQuestions.map((wq) => (
                <div
                  key={wq.id}
                  onClick={() => setActiveQuestionForDetail(wq)}
                  className={`bg-slate-900 border hover:border-slate-700 rounded-2xl p-4 shadow-lg cursor-pointer transition-all flex flex-col justify-between ${
                    wq.nextReviewDate <= todayStr && !wq.isMastered
                      ? "border-amber-500/50 bg-amber-500/5"
                      : "border-slate-800"
                  }`}
                >
                  <div>
                    {/* Image or Text Preview */}
                    {wq.imageUrl ? (
                      <div className="w-full h-40 rounded-xl overflow-hidden mb-3 bg-slate-950 flex items-center justify-center border border-slate-800">
                        <img src={wq.imageUrl} alt="Soru Görseli" className="max-h-full object-contain" />
                      </div>
                    ) : (
                      <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl mb-3 text-xs text-slate-300 line-clamp-3">
                        "{wq.questionText || "Görsel veya detay metni eklenmedi"}"
                      </div>
                    )}

                    {/* Question Info Tags */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-indigo-400">{wq.subject}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        wq.difficulty === "Zor" ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}>
                        {wq.difficulty}
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-white mb-1">{wq.topic}</div>

                    {wq.examTitle && (
                      <div className="text-[11px] text-cyan-400 font-medium mb-2">
                        📋 Deneme: {wq.examTitle}
                      </div>
                    )}

                    <div className="flex items-center space-x-1.5 text-[11px] text-slate-400 mb-3">
                      <Tag className="w-3 h-3 text-rose-400" />
                      <span>Yanlış Sebebi: <strong className="text-slate-200">{wq.wrongReason}</strong></span>
                    </div>
                  </div>

                  {/* Bottom Repetition Badge & Actions */}
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                    {wq.isMastered ? (
                      <span className="text-emerald-400 font-semibold flex items-center space-x-1">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Öğrenildi</span>
                      </span>
                    ) : (
                      <span className="text-amber-400 font-semibold flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Tekrar: {wq.nextReviewDate}</span>
                      </span>
                    )}

                    <span className="text-indigo-400 hover:underline font-semibold flex items-center space-x-1">
                      <span>İncele / Çöz</span>
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 2: ANALYTICS & TREND GRAPH VIEW */}
      {activeTab === "ANALYTICS" && (
        <div className="space-y-6">
          
          {/* Trend Cards Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Increasing Error Topics */}
            <div className="bg-slate-900 border border-rose-500/30 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <TrendingUp className="w-4 h-4" />
                  <span>Yanlışı Artan Konular (Dikkat!)</span>
                </span>
                <span className="p-1 bg-rose-500/10 text-rose-400 rounded-lg text-xs font-bold">
                  {topicTrends.filter((t) => t.status === "INCREASED").length} Konu
                </span>
              </div>
              <div className="space-y-2">
                {topicTrends.filter((t) => t.status === "INCREASED").length === 0 ? (
                  <p className="text-xs text-slate-400 italic">Harika! Son denemelerde yanlışı artan konu bulunmuyor.</p>
                ) : (
                  topicTrends.filter((t) => t.status === "INCREASED").slice(0, 4).map((t) => (
                    <div key={t.topicName} className="flex items-center justify-between p-2 bg-slate-950 border border-rose-500/20 rounded-xl text-xs">
                      <span className="font-semibold text-white">{t.topicName}</span>
                      <span className="text-rose-400 font-bold">
                        {t.firstVal} → {t.lastVal} (+{t.diff} Yanlış)
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Decreasing Error Topics */}
            <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <TrendingDown className="w-4 h-4" />
                  <span>Yanlışı Azalan Konular (Tebrikler!)</span>
                </span>
                <span className="p-1 bg-emerald-500/10 text-emerald-400 rounded-lg text-xs font-bold">
                  {topicTrends.filter((t) => t.status === "DECREASED").length} Konu
                </span>
              </div>
              <div className="space-y-2">
                {topicTrends.filter((t) => t.status === "DECREASED").length === 0 ? (
                  <p className="text-xs text-slate-400 italic">Henüz belirgin düşüş kaydedilmedi.</p>
                ) : (
                  topicTrends.filter((t) => t.status === "DECREASED").slice(0, 4).map((t) => (
                    <div key={t.topicName} className="flex items-center justify-between p-2 bg-slate-950 border border-emerald-500/20 rounded-xl text-xs">
                      <span className="font-semibold text-white">{t.topicName}</span>
                      <span className="text-emerald-400 font-bold">
                        {t.firstVal} → {t.lastVal} ({t.diff} Yanlış)
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Stable Error Topics */}
            <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Sabit / Tekrar Eden Yanlışlar</span>
                </span>
                <span className="p-1 bg-amber-500/10 text-amber-400 rounded-lg text-xs font-bold">
                  {topicTrends.filter((t) => t.status === "STABLE" && t.lastVal > 0).length} Konu
                </span>
              </div>
              <div className="space-y-2">
                {topicTrends.filter((t) => t.status === "STABLE" && t.lastVal > 0).slice(0, 4).map((t) => (
                  <div key={t.topicName} className="flex items-center justify-between p-2 bg-slate-950 border border-amber-500/20 rounded-xl text-xs">
                    <span className="font-semibold text-white">{t.topicName}</span>
                    <span className="text-amber-400 font-bold">{t.lastVal} Yanlış (Sabit)</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Main Chart Section */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <h2 className="text-base font-bold text-white flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-indigo-400" />
                  <span>Denemeler Arası Konu Bazlı Yanlış Sayısı Kıyaslaması</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Fotoğraflardan ve kayıtlardan derlenen deneme bazlı yanlış soru dağılımı.
                </p>
              </div>
            </div>

            {chartData.length === 0 || topTopics.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-sm">
                Grafik oluşturabilmek için en az 2 denemeye ait yanlış sorular ekleyin.
              </div>
            ) : (
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="examName" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px", fontSize: "12px" }} />
                    <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                    {topTopics.slice(0, 5).map((topicName, idx) => (
                      <Bar key={topicName} dataKey={topicName} fill={colorPalette[idx % colorPalette.length]} radius={[6, 6, 0, 0]} />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* AI Coach Summary on Error Trends */}
          <div className="bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Yapay Zeka Konu Trend Değerlendirmesi</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {topicTrends.some((t) => t.status === "INCREASED") ? (
                <>
                  Özel Yapay Zeka Analizi: Son denemelerinizde özellikle <strong className="text-rose-400">{topicTrends.filter((t) => t.status === "INCREASED").map((t) => t.topicName).join(", ")}</strong> konularında yanlış sayınız artış gösterdi. Bu haftaki çalışma programınıza bu konularla ilgili nokta atışı 20'şer soruluk soru fasikülü eklemeniz net hamlesi yapmanızı sağlayacaktır.
                </>
              ) : (
                <>
                  Özel Yapay Zeka Analizi: Yanlış soru takibiniz oldukça başarılı ilerliyor. Aralıklı tekrar sisteminizi aksatmadan devam ettirerek mevcut net seviyenizi koruyun.
                </>
              )}
            </p>
          </div>

        </div>
      )}

      {/* Add Wrong Question Modal with AI Photo OCR Scan */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden my-8">
            <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <Camera className="w-5 h-5 text-amber-400" />
                <span>Yanlış Soru Ekle & AI Fotoğraf Taraması</span>
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-white rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateQuestion} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              
              {/* Image Upload & AI Scan Button */}
              <div className="p-4 bg-slate-950 border border-indigo-500/30 rounded-2xl space-y-3">
                <label className="block text-xs font-bold text-indigo-300">1. Soru Fotoğrafı Yükle / Çek</label>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <label className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl cursor-pointer text-xs font-semibold flex items-center justify-center space-x-2 transition-colors">
                    <ImageIcon className="w-4 h-4" />
                    <span>Fotoğraf Seç</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>

                  {imageUrl && (
                    <button
                      type="button"
                      onClick={handleAiScanImage}
                      disabled={isScanningImage}
                      className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shadow-lg shadow-cyan-600/20 disabled:opacity-50"
                    >
                      {isScanningImage ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>AI Taranıyor...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>AI ile Konuyu Otomatik Bul</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {imageUrl && (
                  <div className="w-full h-32 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex items-center justify-center">
                    <img src={imageUrl} alt="Soru" className="max-h-full object-contain" />
                  </div>
                )}

                {scanStatusMsg && (
                  <p className="text-xs font-semibold text-cyan-400 bg-cyan-950/40 p-2 rounded-xl border border-cyan-500/30">
                    {scanStatusMsg}
                  </p>
                )}
              </div>

              {/* Exam Assignment */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Hangi Denemeye Ait?</label>
                <select
                  value={examTitle}
                  onChange={(e) => setExamTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                >
                  <option value="Deneme 1 (3D TYT)">Deneme 1 (3D TYT)</option>
                  <option value="Deneme 2 (Bilgi Sarmal)">Deneme 2 (Bilgi Sarmal)</option>
                  {studentData.exams.map((ex) => (
                    <option key={ex.id} value={ex.title}>
                      {ex.title}
                    </option>
                  ))}
                  <option value="CUSTOM">+ Yeni Deneme İsmi Yaz</option>
                </select>

                {examTitle === "CUSTOM" && (
                  <input
                    type="text"
                    required
                    placeholder="Örn: Deneme 3 (3D AYT)"
                    value={customExamTitle}
                    onChange={(e) => setCustomExamTitle(e.target.value)}
                    className="w-full px-3 py-2 mt-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
                  />
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Ders</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                  >
                    <option value="Matematik (TYT)">Matematik (TYT)</option>
                    <option value="Matematik (AYT)">Matematik (AYT)</option>
                    <option value="Türkçe (TYT)">Türkçe (TYT)</option>
                    <option value="Fizik (AYT)">Fizik (AYT)</option>
                    <option value="Kimya (AYT)">Kimya (AYT)</option>
                    <option value="Biyoloji (AYT)">Biyoloji (AYT)</option>
                    <option value="Edebiyat (AYT)">Edebiyat (AYT)</option>
                    <option value="Tarih / Coğrafya">Tarih / Coğrafya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Konu Adı (AI Otomatik Doldurabilir)</label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Problem / Paragraf / Türev"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Zorluk Derecesi</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                  >
                    <option value="Kolay">Kolay</option>
                    <option value="Orta">Orta</option>
                    <option value="Zor">Zor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Yanlış Yapma Sebebi</label>
                  <select
                    value={wrongReason}
                    onChange={(e) => setWrongReason(e.target.value as WrongReason)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                  >
                    <option value="Dikkatsizlik">Dikkatsizlik</option>
                    <option value="Bilgi Eksikliği">Bilgi Eksikliği</option>
                    <option value="Zaman Yetmedi">Zaman Yetmedi</option>
                    <option value="Yanlış Anlama">Yanlış Anlama</option>
                    <option value="İşlem Hatası">İşlem Hatası</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Soru Özeti / Notu</label>
                <textarea
                  rows={2}
                  placeholder="Sorunun kısa özeti..."
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Doğru Çözüm / Formül Notu</label>
                <textarea
                  rows={2}
                  placeholder="Doğru çözüm püf noktası..."
                  value={solutionText}
                  onChange={(e) => setSolutionText(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  İptal
                </button>
                <button
                  id="submit-wrong-question-btn"
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold shadow-md shadow-amber-600/20"
                >
                  Deftere Kaydet
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Question Detail & Repetition Review Modal */}
      {activeQuestionForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-8">
            <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-amber-400">{activeQuestionForDetail.subject}</span>
                <h3 className="text-base font-bold text-white">{activeQuestionForDetail.topic}</h3>
                {activeQuestionForDetail.examTitle && (
                  <span className="text-xs text-cyan-400 block mt-0.5">Deneme: {activeQuestionForDetail.examTitle}</span>
                )}
              </div>
              <button
                onClick={() => setActiveQuestionForDetail(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Question Image */}
              {activeQuestionForDetail.imageUrl && (
                <div className="w-full max-h-72 rounded-xl bg-slate-950 overflow-hidden flex items-center justify-center border border-slate-800">
                  <img src={activeQuestionForDetail.imageUrl} alt="Soru" className="max-h-72 object-contain" />
                </div>
              )}

              {/* Question Text */}
              {activeQuestionForDetail.questionText && (
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-sm text-slate-200">
                  <strong className="text-xs text-slate-400 block mb-1">Soru Metni:</strong>
                  {activeQuestionForDetail.questionText}
                </div>
              )}

              {/* Solution Note */}
              {activeQuestionForDetail.solutionText && (
                <div className="p-3 bg-indigo-950/20 border border-indigo-500/30 rounded-xl text-sm text-indigo-200">
                  <strong className="text-xs text-indigo-400 block mb-1">💡 Doğru Çözüm Notunuz:</strong>
                  {activeQuestionForDetail.solutionText}
                </div>
              )}

              {/* AI Question Hint Section */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-cyan-400 flex items-center space-x-1.5">
                    <Sparkles className="w-4 h-4" />
                    <span>Yapay Zeka Soru Analiz Rehberi</span>
                  </h4>
                  <button
                    id="fetch-ai-hint-btn"
                    onClick={() => handleFetchAiHint(activeQuestionForDetail)}
                    disabled={isAiLoading}
                    className="px-3 py-1 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-colors disabled:opacity-50"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>{isAiLoading ? "Analiz Yapılıyor..." : "Yapay Zeka İpucu Üret"}</span>
                  </button>
                </div>

                {activeQuestionForDetail.aiHint ? (
                  <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-line border-t border-slate-800/80 pt-3">
                    {activeQuestionForDetail.aiHint}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">
                    Bu soruya özel yapay zeka formül ve mantık analizi üretmek için yukarıdaki butona tıklayın.
                  </p>
                )}
              </div>

              {/* Spaced Repetition Review Decision Box */}
              <div className="p-4 bg-slate-950/80 border border-amber-500/30 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-amber-300">
                    Aralıklı Tekrar Değerlendirmesi (Adım {activeQuestionForDetail.intervalDaysIndex + 1} / 5)
                  </span>
                  <span className="text-xs text-slate-400">
                    Sonraki Tekrar: {activeQuestionForDetail.nextReviewDate}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    id="mark-correct-btn"
                    onClick={() => handleReviewAction(activeQuestionForDetail.id, true)}
                    className="py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Doğru Çözdüm (İlerle)</span>
                  </button>
                  <button
                    id="mark-wrong-btn"
                    onClick={() => handleReviewAction(activeQuestionForDetail.id, false)}
                    className="py-2.5 bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-300 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Yine Takıldım (Sıfırla)</span>
                  </button>
                </div>
              </div>

              {/* Delete Button */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => handleDeleteQuestion(activeQuestionForDetail.id)}
                  className="text-xs text-rose-400 hover:underline flex items-center space-x-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Bu Soruyu Defterden Sil</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};
