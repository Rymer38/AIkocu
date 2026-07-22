import React, { useState } from "react";
import { User, StudentData, TargetField } from "../types";
import { calculateGapAnalysis } from "../utils/yksCalculators";
import { getUsers, saveUsers } from "../utils/storage";
import { 
  Target, 
  Award, 
  TrendingUp, 
  CheckCircle, 
  AlertTriangle, 
  Sparkles, 
  GraduationCap,
  ChevronRight
} from "lucide-react";

interface TargetViewProps {
  currentUser: User;
  studentData: StudentData;
  onNavigateTab?: (tab: string) => void;
  onUpdateUser: (updatedUser: User) => void;
}

export const TargetView: React.FC<TargetViewProps> = ({
  currentUser,
  studentData,
  onUpdateUser,
}) => {
  const [targetUni, setTargetUni] = useState(currentUser.targetUni);
  const [targetDept, setTargetDept] = useState(currentUser.targetDept);
  const [targetRank, setTargetRank] = useState(currentUser.targetRank);
  const [targetField, setTargetField] = useState<TargetField>(currentUser.targetField);
  const [isSaved, setIsSaved] = useState(false);

  // Calculate current average TYT & AYT nets
  const tytExams = studentData.exams.filter((e) => e.type === "TYT");
  const aytExams = studentData.exams.filter((e) => e.type === "AYT");

  const avgTYT =
    tytExams.length > 0
      ? tytExams.reduce((acc, curr) => acc + curr.totalNet, 0) / tytExams.length
      : 80;

  const avgAYT =
    aytExams.length > 0
      ? aytExams.reduce((acc, curr) => acc + curr.totalNet, 0) / aytExams.length
      : 50;

  const gapReport = calculateGapAnalysis(targetRank, targetField, avgTYT, avgAYT);

  const handleSaveTarget = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser: User = {
      ...currentUser,
      targetUni,
      targetDept,
      targetRank: Number(targetRank) || 5000,
      targetField,
    };

    const users = getUsers();
    const newUsers = users.map((u) => (u.id === currentUser.id ? updatedUser : u));
    saveUsers(newUsers);
    onUpdateUser(updatedUser);

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h1 className="text-xl font-bold text-white flex items-center space-x-2">
          <Target className="w-5 h-5 text-indigo-400" />
          <span>Hedef Belirleme & Eksik Net Analiz Raporu</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Hayalinizdeki üniversite ve bölüm hedefini tanımlayın, mevcut ortalama netlerinizle arasındaki farkı inceleyin.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Target University Definition Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
            <div className="p-2.5 bg-indigo-600/20 text-indigo-400 rounded-xl">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Üniversite & Bölüm Kartı</h2>
              <p className="text-xs text-slate-400">Hedef parametrelerinizi güncelleyin</p>
            </div>
          </div>

          <form onSubmit={handleSaveTarget} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">YKS Alanınız</label>
              <select
                value={targetField}
                onChange={(e) => setTargetField(e.target.value as TargetField)}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="SAY">SAY (Sayısal)</option>
                <option value="EA">EA (Eşit Ağırlık)</option>
                <option value="SOZ">SÖZ (Sözel)</option>
                <option value="DIL">DİL (Yabancı Dil)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Hedef Üniversite</label>
              <input
                type="text"
                required
                value={targetUni}
                onChange={(e) => setTargetUni(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Hedef Bölüm</label>
              <input
                type="text"
                required
                value={targetDept}
                onChange={(e) => setTargetDept(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Hedef YKS Sıralaması (#)</label>
              <input
                type="number"
                required
                value={targetRank}
                onChange={(e) => setTargetRank(Number(e.target.value))}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500 font-bold text-amber-400"
              />
            </div>

            <button
              id="save-target-btn"
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
            >
              {isSaved ? "✓ Hedef Güncellendi!" : "Hedefleri Kaydet"}
            </button>
          </form>
        </div>

        {/* Gap Analysis Report (2 spans) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <Award className="w-5 h-5 text-amber-400" />
                <span>Hedef vs. Mevcut Durum Karşılaştırma Analizi</span>
              </h2>
              <p className="text-xs text-slate-400">Hedef sıralamanıza ulaşmak için gereken netler</p>
            </div>
            <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl text-xs font-bold">
              #{gapReport.targetRank.toLocaleString("tr-TR")} Hedef Sıralama
            </span>
          </div>

          {/* Comparative Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* TYT Gap Box */}
            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-400">TYT Net Durumu</span>
                <span className="text-[10px] text-slate-400 font-semibold">Gereken: {gapReport.estimatedTargetTYTNet} Net</span>
              </div>

              <div className="flex items-baseline justify-between">
                <div>
                  <div className="text-xs text-slate-400">Mevcut Ortalama:</div>
                  <div className="text-xl font-extrabold text-white">{gapReport.currentTYTNetAvg} Net</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400">Eksik Net:</div>
                  <div className={`text-xl font-extrabold ${gapReport.tytNetGap > 0 ? "text-rose-400" : "text-emerald-400"}`}>
                    {gapReport.tytNetGap > 0 ? `+${gapReport.tytNetGap}` : "Tamam"}
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (gapReport.currentTYTNetAvg / gapReport.estimatedTargetTYTNet) * 100)}%` }}
                />
              </div>
            </div>

            {/* AYT Gap Box */}
            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400">AYT Net Durumu</span>
                <span className="text-[10px] text-slate-400 font-semibold">Gereken: {gapReport.estimatedTargetAYTNet} Net</span>
              </div>

              <div className="flex items-baseline justify-between">
                <div>
                  <div className="text-xs text-slate-400">Mevcut Ortalama:</div>
                  <div className="text-xl font-extrabold text-white">{gapReport.currentAYTNetAvg} Net</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400">Eksik Net:</div>
                  <div className={`text-xl font-extrabold ${gapReport.aytNetGap > 0 ? "text-rose-400" : "text-emerald-400"}`}>
                    {gapReport.aytNetGap > 0 ? `+${gapReport.aytNetGap}` : "Tamam"}
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (gapReport.currentAYTNetAvg / gapReport.estimatedTargetAYTNet) * 100)}%` }}
                />
              </div>
            </div>

          </div>

          {/* Strategic Recommendations List */}
          <div className="p-4 bg-slate-950 border border-indigo-500/20 rounded-2xl space-y-2">
            <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Kişiselleştirilmiş İvme Ve Net Kazanım Stratejisi</span>
            </h3>
            <ul className="space-y-2 mt-2">
              {gapReport.recommendations.map((rec, idx) => (
                <li key={idx} className="text-xs text-slate-300 flex items-start space-x-2">
                  <span className="text-indigo-400 font-bold">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
};
