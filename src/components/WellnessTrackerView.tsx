import React, { useState } from "react";
import { StudentData, DailyWellness } from "../types";
import { Heart, Moon, Droplets, Smile, ShieldAlert, Sparkles, Plus, Calendar } from "lucide-react";

interface WellnessTrackerViewProps {
  studentData: StudentData;
  onUpdateData: (data: StudentData) => void;
}

export const WellnessTrackerView: React.FC<WellnessTrackerViewProps> = ({
  studentData,
  onUpdateData,
}) => {
  const getTodayStr = () => new Date().toISOString().split("T")[0];

  const logs: DailyWellness[] = studentData.wellnessLogs || [];
  const todayLog = logs.find((l) => l.date === getTodayStr()) || {
    date: getTodayStr(),
    sleepHours: 7.5,
    waterGlasses: 8,
    moodRating: 4,
    notes: "",
  };

  const [sleepHours, setSleepHours] = useState<number>(todayLog.sleepHours);
  const [waterGlasses, setWaterGlasses] = useState<number>(todayLog.waterGlasses);
  const [moodRating, setMoodRating] = useState<number>(todayLog.moodRating);
  const [notes, setNotes] = useState<string>(todayLog.notes || "");

  const handleSaveTodayWellness = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog: DailyWellness = {
      date: getTodayStr(),
      sleepHours,
      waterGlasses,
      moodRating,
      notes,
    };

    const updatedLogs = logs.filter((l) => l.date !== getTodayStr());
    updatedLogs.unshift(newLog);

    onUpdateData({
      ...studentData,
      wellnessLogs: updatedLogs,
    });

    alert("günlük sağlık ve mod verileriniz kaydedildi!");
  };

  // Burnout analysis
  const getBurnoutWarning = () => {
    if (sleepHours < 6) return "⚠️ Uyku süreniz 6 saatin altında. YKS hazırlık sürecinde hafıza ve odaklanma için en az 7 saat uyku kritik önem taşır.";
    if (moodRating <= 2) return "💙 Modunuz bugün biraz düşük görünüyor. 25 dakikalık açık hava yürüyüşü yapıp sevdiğiniz bir müzikle zihninizi dinlendirin.";
    if (waterGlasses < 5) return "💧 Su tüketiminiz az kaldı. Yeterli hidrasyon beyin fonksiyonlarını ve konsantrasyonu direkt artırır.";
    return "✅ Zihinsel ve fiziksel dengeniz gayet iyi durumda! Verimli çalışmaya devam edin.";
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Heart className="w-3.5 h-3.5" />
            <span>YKS Bütünsel Öğrenci Sağlık & Mod Takibi</span>
          </div>
          <h1 className="text-xl font-bold text-white">Uyku, Hidrasyon & Zihinsel Denge</h1>
          <p className="text-xs text-slate-400 mt-1">
            YKS maratonunda tükenmişlik (burnout) yaşamamak için uykunuzu, günlük su tüketiminizi ve zihinsel modunuzu takip edin.
          </p>
        </div>
      </div>

      {/* Burnout Alert */}
      <div className="bg-slate-900/90 border border-indigo-500/30 rounded-2xl p-4 flex items-start space-x-3 text-xs text-slate-300">
        <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-white block font-bold mb-0.5">Yapay Zeka Bütünsel Koç Analizi:</strong>
          {getBurnoutWarning()}
        </div>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSaveTodayWellness} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>Bugünün Sağlık & Mod Kaydı ({getTodayStr()})</span>
          </h2>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md"
          >
            Kaydet
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Uyku */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span className="flex items-center space-x-2">
                <Moon className="w-4 h-4 text-indigo-400" />
                <span>Gece Uykusu</span>
              </span>
              <span className="text-indigo-400 font-mono font-bold">{sleepHours} Saat</span>
            </div>
            <input
              type="range"
              min={3}
              max={12}
              step={0.5}
              value={sleepHours}
              onChange={(e) => setSleepHours(Number(e.target.value))}
              className="w-full accent-indigo-500"
            />
            <div className="text-[10px] text-slate-500 flex justify-between">
              <span>3 Saat</span>
              <span>Ideal: 7-8 Saat</span>
              <span>12 Saat</span>
            </div>
          </div>

          {/* Su Tüketimi */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span className="flex items-center space-x-2">
                <Droplets className="w-4 h-4 text-cyan-400" />
                <span>Su Tüketimi</span>
              </span>
              <span className="text-cyan-400 font-mono font-bold">{waterGlasses} Bardak ({waterGlasses * 250} ml)</span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setWaterGlasses(Math.max(0, waterGlasses - 1))}
                className="px-3 py-1 bg-slate-900 border border-slate-800 text-white text-xs font-bold rounded-lg"
              >
                -
              </button>
              <div className="flex space-x-1">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-6 rounded-sm ${
                      i < waterGlasses ? "bg-cyan-400" : "bg-slate-800"
                    }`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => setWaterGlasses(waterGlasses + 1)}
                className="px-3 py-1 bg-slate-900 border border-slate-800 text-white text-xs font-bold rounded-lg"
              >
                +
              </button>
            </div>
          </div>

          {/* Ruh Hali / Mod */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span className="flex items-center space-x-2">
                <Smile className="w-4 h-4 text-amber-400" />
                <span>Günlük Enerji & Mod</span>
              </span>
              <span className="text-amber-400 font-bold">{moodRating} / 5</span>
            </div>
            <div className="flex justify-between pt-1">
              {[
                { rating: 1, label: "😫 Çok Yorgun" },
                { rating: 2, label: "🙁 Düşük" },
                { rating: 3, label: "😐 Normal" },
                { rating: 4, label: "🙂 İyi" },
                { rating: 5, label: "🔥 Yüksek" },
              ].map((m) => (
                <button
                  key={m.rating}
                  type="button"
                  onClick={() => setMoodRating(m.rating)}
                  className={`p-2 rounded-xl text-xs font-bold transition-all ${
                    moodRating === m.rating
                      ? "bg-amber-500 text-slate-950 shadow"
                      : "bg-slate-900 text-slate-400 border border-slate-800"
                  }`}
                >
                  {m.rating}
                </button>
              ))}
            </div>
          </div>

        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Günün Notu / Duygu Durumu</label>
          <textarea
            rows={2}
            placeholder="Bugün kendimi nasıl hissediyorum, çalışma esnasında dikkatimi dağıtan ne oldu?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none"
          />
        </div>
      </form>

    </div>
  );
};
