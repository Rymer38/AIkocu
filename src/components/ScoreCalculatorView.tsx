import React, { useState } from "react";
import { StudentData } from "../types";
import { Calculator, Award, ArrowRight, Zap, Info, RotateCcw } from "lucide-react";

interface ScoreCalculatorViewProps {
  studentData: StudentData;
}

export const ScoreCalculatorView: React.FC<ScoreCalculatorViewProps> = ({ studentData }) => {
  const [obp, setObp] = useState<number>(85.0);

  // TYT Inputs
  const [tytTurkce, setTytTurkce] = useState({ d: 32, y: 5 });
  const [tytSosyal, setTytSosyal] = useState({ d: 15, y: 3 });
  const [tytMat, setTytMat] = useState({ d: 28, y: 4 });
  const [tytFen, setTytFen] = useState({ d: 14, y: 4 });

  // AYT Inputs
  const [aytMat, setAytMat] = useState({ d: 28, y: 3 });
  const [aytFiz, setAytFiz] = useState({ d: 10, y: 2 });
  const [aytKim, setAytKim] = useState({ d: 11, y: 1 });
  const [aytBiy, setAytBiy] = useState({ d: 10, y: 2 });
  const [aytEdb, setAytEdb] = useState({ d: 18, y: 3 });
  const [aytTar1, setAytTar1] = useState({ d: 7, y: 2 });
  const [aytCog1, setAytCog1] = useState({ d: 5, y: 1 });

  // Calculation helpers
  const calcNet = (d: number, y: number) => Math.max(0, Number((d - y * 0.25).toFixed(2)));

  const tytTurkceNet = calcNet(tytTurkce.d, tytTurkce.y);
  const tytSosyalNet = calcNet(tytSosyal.d, tytSosyal.y);
  const tytMatNet = calcNet(tytMat.d, tytMat.y);
  const tytFenNet = calcNet(tytFen.d, tytFen.y);
  const totalTytNet = Number((tytTurkceNet + tytSosyalNet + tytMatNet + tytFenNet).toFixed(2));

  const aytMatNet = calcNet(aytMat.d, aytMat.y);
  const aytFizNet = calcNet(aytFiz.d, aytFiz.y);
  const aytKimNet = calcNet(aytKim.d, aytKim.y);
  const aytBiyNet = calcNet(aytBiy.d, aytBiy.y);
  const aytEdbNet = calcNet(aytEdb.d, aytEdb.y);
  const aytTar1Net = calcNet(aytTar1.d, aytTar1.y);
  const aytCog1Net = calcNet(aytCog1.d, aytCog1.y);

  // ÖSYM Raw and Placement Score Formulas (Approximate official coefficients)
  // TYT Base: 100 + tytTurkce*3.3 + tytSosyal*3.4 + tytMat*3.3 + tytFen*3.4
  const rawTytScore = 100 + tytTurkceNet * 3.3 + tytSosyalNet * 3.4 + tytMatNet * 3.3 + tytFenNet * 3.4;
  const placementObp = obp * 0.6; // 0.12 * diplom notu = obp * 0.6

  // SAY Score = TYT (40%) + AYT SAY (60%) + ÖBP
  const rawSayScore = 100 + (rawTytScore - 100) * 0.4 + (aytMatNet * 3.0 + aytFizNet * 2.8 + aytKimNet * 2.8 + aytBiyNet * 2.8) * 0.72;
  const sayPlacementScore = Number((rawSayScore + placementObp).toFixed(2));

  // EA Score = TYT (40%) + AYT EA (60%) + ÖBP
  const rawEaScore = 100 + (rawTytScore - 100) * 0.4 + (aytMatNet * 3.0 + aytEdbNet * 3.0 + aytTar1Net * 2.8 + aytCog1Net * 3.3) * 0.65;
  const eaPlacementScore = Number((rawEaScore + placementObp).toFixed(2));

  // Estimated Ranks based on 2024 ÖSYM statistical curves
  const estimateSayRank = (score: number) => {
    if (score >= 500) return 500;
    if (score >= 480) return 2500;
    if (score >= 450) return 8000;
    if (score >= 420) return 18000;
    if (score >= 380) return 42000;
    if (score >= 340) return 78000;
    if (score >= 300) return 135000;
    return 220000;
  };

  const estimateEaRank = (score: number) => {
    if (score >= 480) return 800;
    if (score >= 440) return 3500;
    if (score >= 400) return 12000;
    if (score >= 360) return 32000;
    if (score >= 320) return 75000;
    return 150000;
  };

  const handleImportLatestExam = () => {
    if (!studentData.exams || studentData.exams.length === 0) {
      alert("Henüz kaydedilmiş deneme sınavınız bulunmuyor.");
      return;
    }
    const latest = studentData.exams[studentData.exams.length - 1];
    if (latest.tytDetails) {
      setTytTurkce({ d: latest.tytDetails.turkce.d, y: latest.tytDetails.turkce.y });
      setTytSosyal({ d: latest.tytDetails.sosyal.d, y: latest.tytDetails.sosyal.y });
      setTytMat({ d: latest.tytDetails.matematik.d, y: latest.tytDetails.matematik.y });
      setTytFen({ d: latest.tytDetails.fen.d, y: latest.tytDetails.fen.y });
    }
    if (latest.aytDetails) {
      if (latest.aytDetails.matematik) setAytMat({ d: latest.aytDetails.matematik.d, y: latest.aytDetails.matematik.y });
      if (latest.aytDetails.fizik) setAytFiz({ d: latest.aytDetails.fizik.d, y: latest.aytDetails.fizik.y });
      if (latest.aytDetails.kimya) setAytKim({ d: latest.aytDetails.kimya.d, y: latest.aytDetails.kimya.y });
      if (latest.aytDetails.biyoloji) setAytBiy({ d: latest.aytDetails.biyoloji.d, y: latest.aytDetails.biyoloji.y });
      if (latest.aytDetails.edebiyat) setAytEdb({ d: latest.aytDetails.edebiyat.d, y: latest.aytDetails.edebiyat.y });
      if (latest.aytDetails.tarih1) setAytTar1({ d: latest.aytDetails.tarih1.d, y: latest.aytDetails.tarih1.y });
      if (latest.aytDetails.cografya1) setAytCog1({ d: latest.aytDetails.cografya1.d, y: latest.aytDetails.cografya1.y });
    }
    alert("Son deneme verileriniz başarıyla aktarıldı!");
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Calculator className="w-3.5 h-3.5" />
            <span>ÖSYM YKS Puan & Sıralama Simülatörü</span>
          </div>
          <h1 className="text-xl font-bold text-white">YKS Net & Puan Hesaplama Robotu</h1>
          <p className="text-xs text-slate-400 mt-1">
            TYT ve AYT doğru/yanlış sayılarınızı ve ÖBP notunuzu girerek yerleştirme puanlarınızı ve tahmini sıralamanızı hesaplayın.
          </p>
        </div>

        <button
          onClick={handleImportLatestExam}
          className="px-4 py-2.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2"
        >
          <Zap className="w-4 h-4 text-amber-400" />
          <span>Son Kayıtlı Denememden Aktar</span>
        </button>
      </div>

      {/* Results Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* TYT Net Summary */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex items-center space-x-4">
          <div className="p-3 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 rounded-xl font-mono text-xl font-black">
            {totalTytNet}
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Toplam TYT Netiniz</div>
            <div className="text-sm font-bold text-white mt-0.5">TYT Ham Puan: {Number(rawTytScore.toFixed(1))}</div>
          </div>
        </div>

        {/* SAY Placement Score & Rank */}
        <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-5 shadow-xl flex items-center justify-between">
          <div>
            <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded font-bold text-[10px]">
              SAYISAL (SAY)
            </span>
            <div className="text-xl font-black text-amber-400 font-mono mt-1">
              {sayPlacementScore} <span className="text-xs font-normal text-slate-400">Puan</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-slate-400 uppercase font-bold">Tahmini Sıralama</div>
            <div className="text-base font-black text-white font-mono">
              #{estimateSayRank(sayPlacementScore).toLocaleString("tr-TR")}
            </div>
          </div>
        </div>

        {/* EA Placement Score & Rank */}
        <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl p-5 shadow-xl flex items-center justify-between">
          <div>
            <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded font-bold text-[10px]">
              EŞİT AĞIRLIK (EA)
            </span>
            <div className="text-xl font-black text-cyan-400 font-mono mt-1">
              {eaPlacementScore} <span className="text-xs font-normal text-slate-400">Puan</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-slate-400 uppercase font-bold">Tahmini Sıralama</div>
            <div className="text-base font-black text-white font-mono">
              #{estimateEaRank(eaPlacementScore).toLocaleString("tr-TR")}
            </div>
          </div>
        </div>

      </div>

      {/* Main Calculation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* TYT & ÖBP Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">1. ÖBP ve TYT Test Doğru / Yanlış Sayıları</h3>
            <span className="text-xs text-indigo-400 font-mono font-bold">TYT 120 Soru</span>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Diplom Notu / ÖBP (100 Üzerinden) — Ek ÖBP Puanınız: <strong className="text-amber-400">{placementObp.toFixed(2)}</strong>
            </label>
            <input
              type="number"
              min={50}
              max={100}
              step={0.5}
              value={obp}
              onChange={(e) => setObp(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none"
            />
          </div>

          <div className="space-y-3 pt-2">
            
            {/* Türkçe */}
            <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800/80">
              <div className="w-32">
                <div className="text-xs font-bold text-white">TYT Türkçe</div>
                <div className="text-[10px] text-slate-400">Net: {tytTurkceNet} / 40</div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min={0}
                  max={40}
                  value={tytTurkce.d}
                  onChange={(e) => setTytTurkce({ ...tytTurkce, d: Number(e.target.value) })}
                  className="w-16 px-2 py-1 bg-slate-900 border border-slate-800 rounded text-center text-xs text-emerald-400 font-bold"
                  placeholder="Doğru"
                />
                <input
                  type="number"
                  min={0}
                  max={40}
                  value={tytTurkce.y}
                  onChange={(e) => setTytTurkce({ ...tytTurkce, y: Number(e.target.value) })}
                  className="w-16 px-2 py-1 bg-slate-900 border border-slate-800 rounded text-center text-xs text-rose-400 font-bold"
                  placeholder="Yanlış"
                />
              </div>
            </div>

            {/* Sosyal */}
            <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800/80">
              <div className="w-32">
                <div className="text-xs font-bold text-white">TYT Sosyal</div>
                <div className="text-[10px] text-slate-400">Net: {tytSosyalNet} / 20</div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min={0}
                  max={20}
                  value={tytSosyal.d}
                  onChange={(e) => setTytSosyal({ ...tytSosyal, d: Number(e.target.value) })}
                  className="w-16 px-2 py-1 bg-slate-900 border border-slate-800 rounded text-center text-xs text-emerald-400 font-bold"
                />
                <input
                  type="number"
                  min={0}
                  max={20}
                  value={tytSosyal.y}
                  onChange={(e) => setTytSosyal({ ...tytSosyal, y: Number(e.target.value) })}
                  className="w-16 px-2 py-1 bg-slate-900 border border-slate-800 rounded text-center text-xs text-rose-400 font-bold"
                />
              </div>
            </div>

            {/* Matematik */}
            <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800/80">
              <div className="w-32">
                <div className="text-xs font-bold text-white">TYT Matematik</div>
                <div className="text-[10px] text-slate-400">Net: {tytMatNet} / 40</div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min={0}
                  max={40}
                  value={tytMat.d}
                  onChange={(e) => setTytMat({ ...tytMat, d: Number(e.target.value) })}
                  className="w-16 px-2 py-1 bg-slate-900 border border-slate-800 rounded text-center text-xs text-emerald-400 font-bold"
                />
                <input
                  type="number"
                  min={0}
                  max={40}
                  value={tytMat.y}
                  onChange={(e) => setTytMat({ ...tytMat, y: Number(e.target.value) })}
                  className="w-16 px-2 py-1 bg-slate-900 border border-slate-800 rounded text-center text-xs text-rose-400 font-bold"
                />
              </div>
            </div>

            {/* Fen */}
            <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800/80">
              <div className="w-32">
                <div className="text-xs font-bold text-white">TYT Fen Bilimleri</div>
                <div className="text-[10px] text-slate-400">Net: {tytFenNet} / 20</div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min={0}
                  max={20}
                  value={tytFen.d}
                  onChange={(e) => setTytFen({ ...tytFen, d: Number(e.target.value) })}
                  className="w-16 px-2 py-1 bg-slate-900 border border-slate-800 rounded text-center text-xs text-emerald-400 font-bold"
                />
                <input
                  type="number"
                  min={0}
                  max={20}
                  value={tytFen.y}
                  onChange={(e) => setTytFen({ ...tytFen, y: Number(e.target.value) })}
                  className="w-16 px-2 py-1 bg-slate-900 border border-slate-800 rounded text-center text-xs text-rose-400 font-bold"
                />
              </div>
            </div>

          </div>
        </div>

        {/* AYT Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">2. AYT Test Doğru / Yanlış Sayıları</h3>
            <span className="text-xs text-amber-400 font-mono font-bold">AYT Alan Testleri</span>
          </div>

          <div className="space-y-3">
            
            {/* AYT Mat */}
            <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800/80">
              <div className="w-32">
                <div className="text-xs font-bold text-white">AYT Matematik</div>
                <div className="text-[10px] text-slate-400">Net: {aytMatNet} / 40</div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min={0}
                  max={40}
                  value={aytMat.d}
                  onChange={(e) => setAytMat({ ...aytMat, d: Number(e.target.value) })}
                  className="w-16 px-2 py-1 bg-slate-900 border border-slate-800 rounded text-center text-xs text-emerald-400 font-bold"
                />
                <input
                  type="number"
                  min={0}
                  max={40}
                  value={aytMat.y}
                  onChange={(e) => setAytMat({ ...aytMat, y: Number(e.target.value) })}
                  className="w-16 px-2 py-1 bg-slate-900 border border-slate-800 rounded text-center text-xs text-rose-400 font-bold"
                />
              </div>
            </div>

            {/* AYT Fizik */}
            <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800/80">
              <div className="w-32">
                <div className="text-xs font-bold text-white">AYT Fizik</div>
                <div className="text-[10px] text-slate-400">Net: {aytFizNet} / 14</div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min={0}
                  max={14}
                  value={aytFiz.d}
                  onChange={(e) => setAytFiz({ ...aytFiz, d: Number(e.target.value) })}
                  className="w-16 px-2 py-1 bg-slate-900 border border-slate-800 rounded text-center text-xs text-emerald-400 font-bold"
                />
                <input
                  type="number"
                  min={0}
                  max={14}
                  value={aytFiz.y}
                  onChange={(e) => setAytFiz({ ...aytFiz, y: Number(e.target.value) })}
                  className="w-16 px-2 py-1 bg-slate-900 border border-slate-800 rounded text-center text-xs text-rose-400 font-bold"
                />
              </div>
            </div>

            {/* AYT Kimya */}
            <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800/80">
              <div className="w-32">
                <div className="text-xs font-bold text-white">AYT Kimya</div>
                <div className="text-[10px] text-slate-400">Net: {aytKimNet} / 13</div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min={0}
                  max={13}
                  value={aytKim.d}
                  onChange={(e) => setAytKim({ ...aytKim, d: Number(e.target.value) })}
                  className="w-16 px-2 py-1 bg-slate-900 border border-slate-800 rounded text-center text-xs text-emerald-400 font-bold"
                />
                <input
                  type="number"
                  min={0}
                  max={13}
                  value={aytKim.y}
                  onChange={(e) => setAytKim({ ...aytKim, y: Number(e.target.value) })}
                  className="w-16 px-2 py-1 bg-slate-900 border border-slate-800 rounded text-center text-xs text-rose-400 font-bold"
                />
              </div>
            </div>

            {/* AYT Biyoloji */}
            <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800/80">
              <div className="w-32">
                <div className="text-xs font-bold text-white">AYT Biyoloji</div>
                <div className="text-[10px] text-slate-400">Net: {aytBiyNet} / 13</div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min={0}
                  max={13}
                  value={aytBiy.d}
                  onChange={(e) => setAytBiy({ ...aytBiy, d: Number(e.target.value) })}
                  className="w-16 px-2 py-1 bg-slate-900 border border-slate-800 rounded text-center text-xs text-emerald-400 font-bold"
                />
                <input
                  type="number"
                  min={0}
                  max={13}
                  value={aytBiy.y}
                  onChange={(e) => setAytBiy({ ...aytBiy, y: Number(e.target.value) })}
                  className="w-16 px-2 py-1 bg-slate-900 border border-slate-800 rounded text-center text-xs text-rose-400 font-bold"
                />
              </div>
            </div>

            {/* AYT Edebiyat */}
            <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800/80">
              <div className="w-32">
                <div className="text-xs font-bold text-white">AYT Edebiyat</div>
                <div className="text-[10px] text-slate-400">Net: {aytEdbNet} / 24</div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min={0}
                  max={24}
                  value={aytEdb.d}
                  onChange={(e) => setAytEdb({ ...aytEdb, d: Number(e.target.value) })}
                  className="w-16 px-2 py-1 bg-slate-900 border border-slate-800 rounded text-center text-xs text-emerald-400 font-bold"
                />
                <input
                  type="number"
                  min={0}
                  max={24}
                  value={aytEdb.y}
                  onChange={(e) => setAytEdb({ ...aytEdb, y: Number(e.target.value) })}
                  className="w-16 px-2 py-1 bg-slate-900 border border-slate-800 rounded text-center text-xs text-rose-400 font-bold"
                />
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
