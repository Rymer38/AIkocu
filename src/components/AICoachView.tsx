import React, { useState } from "react";
import { User, StudentData } from "../types";
import { Sparkles, Send, Bot, User as UserIcon, RefreshCw, BookOpen, Target, ShieldCheck } from "lucide-react";

interface AICoachViewProps {
  currentUser: User;
  studentData: StudentData;
}

export const AICoachView: React.FC<AICoachViewProps> = ({ currentUser, studentData }) => {
  const [adviceText, setAdviceText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [customQuestion, setCustomQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{ sender: "ai" | "user"; message: string }>>([]);

  const tytExams = studentData.exams.filter((e) => e.type === "TYT");
  const aytExams = studentData.exams.filter((e) => e.type === "AYT");

  const avgTYT =
    tytExams.length > 0
      ? Number((tytExams.reduce((acc, c) => acc + c.totalNet, 0) / tytExams.length).toFixed(1))
      : 0;

  const avgAYT =
    aytExams.length > 0
      ? Number((aytExams.reduce((acc, c) => acc + c.totalNet, 0) / aytExams.length).toFixed(1))
      : 0;

  const weakestTopics = Array.from(new Set(studentData.wrongQuestions.map((wq) => wq.topic))).slice(0, 5);

  const fetchCoachAdvice = async (questionPrompt?: string) => {
    setIsLoading(true);
    if (questionPrompt) {
      setChatHistory((prev) => [...prev, { sender: "user", message: questionPrompt }]);
    }

    try {
      const res = await fetch("/api/gemini/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName: currentUser.name,
          targetField: currentUser.targetField,
          targetUni: currentUser.targetUni,
          targetDept: currentUser.targetDept,
          targetRank: currentUser.targetRank,
          currentAverages: { tytNet: avgTYT, aytNet: avgAYT },
          weakestTopics,
          routineStats: {
            completionRate: Math.round(
              (studentData.routines.filter((r) => r.isDone).length / (studentData.routines.length || 1)) * 100
            ),
          },
          recentExams: studentData.exams.slice(0, 3).map((e) => ({
            title: e.title,
            type: e.type,
            totalNet: e.totalNet,
            score: e.calculatedScore,
          })),
          userPrompt: questionPrompt || "Genel haftalık YKS koçluk değerlendirmesi ve çalışma planı oluştur.",
        }),
      });

      const data = await res.json();
      if (data.advice) {
        setAdviceText(data.advice);
        setChatHistory((prev) => [...prev, { sender: "ai", message: data.advice }]);
      }
    } catch (err) {
      console.error("Coach API Error:", err);
    } finally {
      setIsLoading(false);
      setCustomQuestion("");
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-cyan-950 border border-indigo-500/30 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kişiselleştirilmiş Yapay Zeka YKS Eğitim Koçu</span>
          </div>
          <h1 className="text-xl font-bold text-white">Akıllı Koçluk Ve Strateji Merkezi</h1>
          <p className="text-xs text-slate-300 mt-1">
            Mevcut deneme netleriniz, zayıf olduğunuz konular ve hedefinize göre 7/24 rehberlik alın.
          </p>
        </div>

        <button
          id="generate-coach-advice-btn"
          onClick={() => fetchCoachAdvice()}
          disabled={isLoading}
          className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white rounded-xl text-xs font-bold shadow-lg flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          <span>{isLoading ? "Analiz Ediliyor..." : "Genel Koçluk Raporu Al"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Panel: Student Summary Feed into AI */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Bot className="w-4 h-4 text-indigo-400" />
            <span>Koça Gönderilen Öğrenci Verileri</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-400 block mb-0.5">Hedef:</span>
              <strong className="text-white">{currentUser.targetUni} - {currentUser.targetDept}</strong>
              <span className="text-amber-400 font-bold block mt-0.5">#{currentUser.targetRank.toLocaleString("tr-TR")} ({currentUser.targetField})</span>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 grid grid-cols-2 gap-2">
              <div>
                <span className="text-slate-400 block">TYT Net Ort.:</span>
                <strong className="text-cyan-400 text-sm font-extrabold">{avgTYT} Net</strong>
              </div>
              <div>
                <span className="text-slate-400 block">AYT Net Ort.:</span>
                <strong className="text-indigo-400 text-sm font-extrabold">{avgAYT} Net</strong>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-400 block mb-1">Tepedeki Yanlış Konuları:</span>
              {weakestTopics.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {weakestTopics.map((tp, i) => (
                    <span key={i} className="px-2 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded text-[10px] font-semibold">
                      {tp}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-slate-500 italic">Henüz kaydedilmedi</span>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel (2 Spans): Interactive AI Chat / Coach Report Feed */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between min-h-[480px]">
          
          <div className="space-y-4 overflow-y-auto max-h-[500px] pr-2">
            {chatHistory.length === 0 && !adviceText ? (
              <div className="flex flex-col items-center justify-center h-80 text-center">
                <Bot className="w-12 h-12 text-indigo-500/40 mb-3" />
                <h3 className="text-sm font-bold text-white">YKS Yapay Zeka Eğitim Koçunuz Hazır!</h3>
                <p className="text-xs text-slate-400 max-w-sm mt-1">
                  "Genel Koçluk Raporu Al" butonuna tıklayarak haftalık planınızı alabilir veya aşağıdaki alandan özel soru sorabilirsiniz.
                </p>
              </div>
            ) : (
              chatHistory.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border ${
                    item.sender === "ai"
                      ? "bg-slate-950 border-indigo-500/30 text-slate-200"
                      : "bg-indigo-600/20 border-indigo-500/40 text-indigo-100 ml-8"
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    {item.sender === "ai" ? (
                      <Bot className="w-4 h-4 text-cyan-400" />
                    ) : (
                      <UserIcon className="w-4 h-4 text-indigo-300" />
                    )}
                    <span className="text-xs font-bold">{item.sender === "ai" ? "YKS Koçu" : currentUser.name}</span>
                  </div>
                  <div className="text-xs leading-relaxed whitespace-pre-line font-sans">
                    {item.message}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Question Input Box */}
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center space-x-2">
            <input
              type="text"
              placeholder="Örn: 'AYT Matematik netlerimi 30 üzerine çıkarmak için günde kaç soru çözmeliyim?'"
              value={customQuestion}
              onChange={(e) => setCustomQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && customQuestion.trim()) {
                  fetchCoachAdvice(customQuestion);
                }
              }}
              className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
            />
            <button
              id="send-coach-question-btn"
              onClick={() => {
                if (customQuestion.trim()) {
                  fetchCoachAdvice(customQuestion);
                }
              }}
              disabled={isLoading || !customQuestion.trim()}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 flex items-center space-x-1"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Sor</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
