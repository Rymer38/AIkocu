import React from "react";
import { User, StudentData } from "../types";
import { CountdownTimer } from "./CountdownTimer";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from "recharts";
import { 
  Target, 
  Award, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  PlusCircle, 
  Sparkles, 
  ArrowRight,
  BookOpen,
  Calendar,
  ListTodo,
  Calculator,
  Heart
} from "lucide-react";

interface DashboardViewProps {
  currentUser: User;
  studentData: StudentData;
  onNavigateTab: (tab: string) => void;
  onUpdateData: (data: StudentData) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  studentData,
  onNavigateTab,
  onUpdateData,
}) => {
  // Calculate key metrics
  const tytExams = studentData.exams.filter((e) => e.type === "TYT");
  const aytExams = studentData.exams.filter((e) => e.type === "AYT");

  const lastTYT = tytExams[tytExams.length - 1];
  const lastAYT = aytExams[aytExams.length - 1];

  const avgTYTNet =
    tytExams.length > 0
      ? Number((tytExams.reduce((acc, curr) => acc + curr.totalNet, 0) / tytExams.length).toFixed(1))
      : 0;

  const avgAYTNet =
    aytExams.length > 0
      ? Number((aytExams.reduce((acc, curr) => acc + curr.totalNet, 0) / aytExams.length).toFixed(1))
      : 0;

  // Best estimated rank
  const latestRank = lastAYT?.estimatedRank || lastTYT?.estimatedRank || 50000;

  // Today's Spaced Repetition Due Questions
  const todayStr = new Date().toISOString().split("T")[0];
  const dueWrongQuestions = studentData.wrongQuestions.filter(
    (wq) => wq.spacedRepetitionEnabled && !wq.isMastered && wq.nextReviewDate <= todayStr
  );

  // Routines status
  const completedRoutines = studentData.routines.filter((r) => r.isDone).length;
  const totalRoutines = studentData.routines.length;

  // Recharts data pipeline
  const chartData = studentData.exams.map((ex) => ({
    date: ex.date.slice(5), // MM-DD
    name: ex.title.length > 12 ? ex.title.slice(0, 12) + "..." : ex.title,
    tytNet: ex.type === "TYT" ? ex.totalNet : null,
    aytNet: ex.type === "AYT" ? ex.totalNet : null,
  }));

  const toggleRoutine = (routineId: string) => {
    const updated = studentData.routines.map((r) => {
      if (r.id === routineId) {
        return { ...r, isDone: !r.isDone };
      }
      return r;
    });
    onUpdateData({ ...studentData, routines: updated });
  };

  return (
    <div className="space-y-6">
      
      {/* Live YKS 2026 Countdown Banner */}
      <CountdownTimer />

      {/* Quick Access Feature Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => onNavigateTab("topic-tracker")}
          className="bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-indigo-500/40 p-3.5 rounded-2xl text-left transition-all flex items-center space-x-3 group shadow-md"
        >
          <div className="p-2.5 bg-indigo-600/20 text-indigo-400 rounded-xl group-hover:scale-105 transition-transform">
            <ListTodo className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white group-hover:text-indigo-300">Konu Takip</div>
            <div className="text-[10px] text-slate-400">YKS Müfredatı</div>
          </div>
        </button>

        <button
          onClick={() => onNavigateTab("weekly-schedule")}
          className="bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/40 p-3.5 rounded-2xl text-left transition-all flex items-center space-x-3 group shadow-md"
        >
          <div className="p-2.5 bg-cyan-600/20 text-cyan-400 rounded-xl group-hover:scale-105 transition-transform">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white group-hover:text-cyan-300">Haftalık Program</div>
            <div className="text-[10px] text-slate-400">Ders Saatleri</div>
          </div>
        </button>

        <button
          onClick={() => onNavigateTab("score-calc")}
          className="bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/40 p-3.5 rounded-2xl text-left transition-all flex items-center space-x-3 group shadow-md"
        >
          <div className="p-2.5 bg-amber-600/20 text-amber-400 rounded-xl group-hover:scale-105 transition-transform">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white group-hover:text-amber-300">Puan Hesaplama</div>
            <div className="text-[10px] text-slate-400">ÖSYM Simülatörü</div>
          </div>
        </button>

        <button
          onClick={() => onNavigateTab("wellness")}
          className="bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-rose-500/40 p-3.5 rounded-2xl text-left transition-all flex items-center space-x-3 group shadow-md"
        >
          <div className="p-2.5 bg-rose-600/20 text-rose-400 rounded-xl group-hover:scale-105 transition-transform">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white group-hover:text-rose-300">Sağlık & Mod</div>
            <div className="text-[10px] text-slate-400">Tükenmişlik Takibi</div>
          </div>
        </button>
      </div>

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-indigo-500/5 blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>YKS 2027 Hazırlık Programı</span>
            </div>
            <h1 className="text-2xl font-bold text-white">
              Hoş Geldin, {currentUser.name}! 👋
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              Hedefin: <span className="font-semibold text-cyan-300">{currentUser.targetUni}</span> —{" "}
              <span className="text-indigo-300">{currentUser.targetDept}</span>
            </p>
          </div>

          {/* Target Rank Badge */}
          <div className="flex items-center space-x-3 bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-3">
            <div className="p-2.5 bg-indigo-600/20 text-indigo-400 rounded-lg">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] font-medium text-slate-400 uppercase">Hedef Sıralama</div>
              <div className="text-lg font-extrabold text-white">#{currentUser.targetRank.toLocaleString("tr-TR")}</div>
              <div className="text-[10px] text-indigo-400 font-semibold uppercase">{currentUser.targetField} Alanı</div>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Son TYT Net */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Son TYT Neti</span>
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-bold text-[10px]">TYT</span>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-white">{lastTYT ? lastTYT.totalNet : "—"}</span>
            <span className="text-xs text-slate-400">Net</span>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Ortalama: <span className="text-slate-200 font-semibold">{avgTYTNet} Net</span>
          </div>
        </div>

        {/* Son AYT Net */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Son AYT Neti</span>
            <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-bold text-[10px]">AYT</span>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-white">{lastAYT ? lastAYT.totalNet : "—"}</span>
            <span className="text-xs text-slate-400">Net</span>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Ortalama: <span className="text-slate-200 font-semibold">{avgAYTNet} Net</span>
          </div>
        </div>

        {/* Tahmini Sıralama */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Tahmini ÖSYM Sıralaması</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-amber-400">#{latestRank.toLocaleString("tr-TR")}</span>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Hedef: <span className="text-indigo-300 font-semibold">#{currentUser.targetRank.toLocaleString("tr-TR")}</span>
          </div>
        </div>

        {/* Tekrar Bekleyen Yanlış Sorular */}
        <div className={`bg-slate-900 border rounded-2xl p-4 shadow-md transition-colors ${
          dueWrongQuestions.length > 0 ? "border-amber-500/40 bg-amber-500/5" : "border-slate-800"
        }`}>
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Bugün Tekrar Edilecek</span>
            <AlertCircle className={`w-4 h-4 ${dueWrongQuestions.length > 0 ? "text-amber-400" : "text-slate-500"}`} />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-white">{dueWrongQuestions.length}</span>
            <span className="text-xs text-slate-400">Soru</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-slate-400">Aralıklı Tekrar Defteri</span>
            <button
              id="goto-wrong-questions-btn"
              onClick={() => onNavigateTab("wrong-questions")}
              className="text-xs text-amber-400 hover:underline font-semibold flex items-center space-x-1"
            >
              <span>İncele</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>

      {/* Main Grid: Performance Graph & Daily Routines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recharts Net Trend Graph */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-indigo-400" />
                <span>Deneme Net İlerleme Grafiği</span>
              </h2>
              <p className="text-xs text-slate-400">Tarihe göre TYT ve AYT netlerinizdeki değişim</p>
            </div>
            <button
              id="add-exam-quick-btn"
              onClick={() => onNavigateTab("exams")}
              className="flex items-center space-x-1 px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-semibold transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Deneme Ekle</span>
            </button>
          </div>

          {chartData.length > 0 ? (
            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} domain={[0, 120]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "0.75rem", color: "#fff", fontSize: "12px" }}
                  />
                  <Line type="monotone" dataKey="tytNet" name="TYT Net" stroke="#06b6d4" strokeWidth={3} dot={{ r: 4, fill: "#06b6d4" }} connectNulls />
                  <Line type="monotone" dataKey="aytNet" name="AYT Net" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: "#6366f1" }} connectNulls />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center border border-dashed border-slate-800 rounded-xl p-6 text-center">
              <BookOpen className="w-8 h-8 text-slate-600 mb-2" />
              <p className="text-sm font-medium text-slate-400">Henüz kaydedilmiş deneme sınavı bulunmuyor.</p>
              <button
                onClick={() => onNavigateTab("exams")}
                className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-500 transition-colors"
              >
                İlk Denemeyi Kaydet
              </button>
            </div>
          )}
        </div>

        {/* Daily Routine Widget */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Günlük Rutinler</span>
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {completedRoutines} / {totalRoutines} Tamamlandı
              </span>
            </div>

            <div className="space-y-2 mt-4">
              {studentData.routines.map((routine) => (
                <div
                  key={routine.id}
                  onClick={() => toggleRoutine(routine.id)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    routine.isDone
                      ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-300"
                      : "bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={routine.isDone}
                      onChange={() => {}} // Handled by div click
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-0 cursor-pointer"
                    />
                    <span className={`text-xs font-medium ${routine.isDone ? "line-through opacity-70" : ""}`}>
                      {routine.title}
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    {routine.targetCount} Soru
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              id="ai-coach-quick-btn"
              onClick={() => onNavigateTab("ai-coach")}
              className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 shadow-md transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Yapay Zeka Koç Tavsiyesi Al</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
