import React, { useState, useEffect } from "react";
import { Clock, Calendar, Flame, Sparkles } from "lucide-react";

interface CountdownTimerProps {
  compact?: boolean;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ compact = false }) => {
  const [activeExam, setActiveExam] = useState<"TYT" | "AYT">("TYT");
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    year: 2027,
    dateLabel: "",
  });

  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date();
      let targetYear = now.getFullYear();

      // Estimated exam dates: 3rd weekend of June
      let tytTarget = new Date(`${targetYear}-06-20T10:15:00`).getTime();
      let aytTarget = new Date(`${targetYear}-06-21T10:15:00`).getTime();

      // If June 2026/current year exam has passed, target next year
      if (now.getTime() > aytTarget) {
        targetYear += 1;
        tytTarget = new Date(`${targetYear}-06-19T10:15:00`).getTime();
        aytTarget = new Date(`${targetYear}-06-20T10:15:00`).getTime();
      }

      const targetTime = activeExam === "TYT" ? tytTarget : aytTarget;
      const diff = Math.max(0, targetTime - now.getTime());

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const dateLabel = activeExam === "TYT" 
        ? `${targetYear === 2026 ? "20 Haziran" : "19 Haziran"} ${targetYear}` 
        : `${targetYear === 2026 ? "21 Haziran" : "20 Haziran"} ${targetYear}`;

      setTimeLeft({ days, hours, minutes, seconds, year: targetYear, dateLabel });
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, [activeExam]);

  if (compact) {
    return (
      <div className="flex items-center space-x-3 bg-slate-900 border border-amber-500/30 rounded-xl px-3.5 py-1.5 shadow-md">
        <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
        <div className="text-xs">
          <span className="text-slate-400 font-semibold mr-1">{activeExam} {timeLeft.year}:</span>
          <strong className="text-amber-400 font-mono font-bold">
            {timeLeft.days}G {timeLeft.hours}S {timeLeft.minutes}D {timeLeft.seconds}s
          </strong>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-amber-500/30 rounded-2xl p-5 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            YKS {timeLeft.year} Canlı Geri Sayım Sayacı
          </h2>
        </div>

        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setActiveExam("TYT")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              activeExam === "TYT" ? "bg-amber-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            TYT ({timeLeft.year})
          </button>
          <button
            onClick={() => setActiveExam("AYT")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              activeExam === "AYT" ? "bg-indigo-600 text-white shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            AYT ({timeLeft.year})
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3">
          <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">{timeLeft.days}</div>
          <div className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase mt-1">GÜN</div>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3">
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">{timeLeft.hours}</div>
          <div className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase mt-1">SAAT</div>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3">
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">{timeLeft.minutes}</div>
          <div className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase mt-1">DAKİKA</div>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3">
          <div className="text-2xl sm:text-3xl font-black text-indigo-400 font-mono">{timeLeft.seconds}</div>
          <div className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase mt-1">SANİYE</div>
        </div>
      </div>

      <div className="mt-3 text-center text-[11px] text-slate-400 flex items-center justify-center space-x-1.5">
        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
        <span>Sınav Tarihi: <strong>{timeLeft.dateLabel}</strong> • "Disiplin, ne istediğin ile şu an ne istediğin arasındaki seçimdir."</span>
      </div>
    </div>
  );
};

