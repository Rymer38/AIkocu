import { AYTBreakdown, TargetField, TYTBreakdown } from "../types";

export function calcNet(d: number, y: number): number {
  const n = d - y * 0.25;
  return Math.max(0, Number(n.toFixed(2)));
}

export function calculateTYTTotalNet(details: TYTBreakdown): number {
  const tNet = calcNet(details.turkce.d, details.turkce.y);
  const mNet = calcNet(details.matematik.d, details.matematik.y);
  const sNet = calcNet(details.sosyal.d, details.sosyal.y);
  const fNet = calcNet(details.fen.d, details.fen.y);
  return Number((tNet + mNet + sNet + fNet).toFixed(2));
}

export function calculateTYTScore(details: TYTBreakdown): number {
  const tNet = calcNet(details.turkce.d, details.turkce.y);
  const mNet = calcNet(details.matematik.d, details.matematik.y);
  const sNet = calcNet(details.sosyal.d, details.sosyal.y);
  const fNet = calcNet(details.fen.d, details.fen.y);

  // ÖSYM TYT Ham Puan Formül Yaklaşımı (Taban: 100)
  const score = 100 + tNet * 3.3 + mNet * 3.3 + sNet * 3.4 + fNet * 3.4;
  return Math.min(500, Math.max(100, Number(score.toFixed(2))));
}

export function calculateAYTTotalNet(details: AYTBreakdown): number {
  let total = 0;
  Object.values(details).forEach((sub) => {
    if (sub) {
      total += calcNet(sub.d, sub.y);
    }
  });
  return Number(total.toFixed(2));
}

export function calculateAYTScore(
  tytNet: number,
  aytDetails: AYTBreakdown,
  field: TargetField
): number {
  const tytContrib = (tytNet / 120) * 160; // TYT %40 etki (~160 puan)

  let aytScorePart = 0;

  if (field === "SAY") {
    const mat = calcNet(aytDetails.matematik?.d || 0, aytDetails.matematik?.y || 0);
    const fiz = calcNet(aytDetails.fizik?.d || 0, aytDetails.fizik?.y || 0);
    const kim = calcNet(aytDetails.kimya?.d || 0, aytDetails.kimya?.y || 0);
    const bio = calcNet(aytDetails.biyoloji?.d || 0, aytDetails.biyoloji?.y || 0);

    // AYT %60 etki (~240 puan)
    aytScorePart = mat * 3.0 + fiz * 2.85 + kim * 3.07 + bio * 3.07;
  } else if (field === "EA") {
    const mat = calcNet(aytDetails.matematik?.d || 0, aytDetails.matematik?.y || 0);
    const edb = calcNet(aytDetails.edebiyat?.d || 0, aytDetails.edebiyat?.y || 0);
    const tar1 = calcNet(aytDetails.tarih1?.d || 0, aytDetails.tarih1?.y || 0);
    const cog1 = calcNet(aytDetails.cografya1?.d || 0, aytDetails.cografya1?.y || 0);

    aytScorePart = mat * 3.0 + edb * 3.0 + tar1 * 2.8 + cog1 * 3.33;
  } else if (field === "SOZ") {
    const edb = calcNet(aytDetails.edebiyat?.d || 0, aytDetails.edebiyat?.y || 0);
    const tar1 = calcNet(aytDetails.tarih1?.d || 0, aytDetails.tarih1?.y || 0);
    const cog1 = calcNet(aytDetails.cografya1?.d || 0, aytDetails.cografya1?.y || 0);
    const tar2 = calcNet(aytDetails.tarih2?.d || 0, aytDetails.tarih2?.y || 0);
    const cog2 = calcNet(aytDetails.cografya2?.d || 0, aytDetails.cografya2?.y || 0);
    const fel = calcNet(aytDetails.felsefe?.d || 0, aytDetails.felsefe?.y || 0);
    const dkab = calcNet(aytDetails.dkab?.d || 0, aytDetails.dkab?.y || 0);

    aytScorePart = edb * 3.0 + tar1 * 2.8 + cog1 * 3.3 + tar2 * 2.91 + cog2 * 2.91 + fel * 3.0 + dkab * 3.33;
  } else {
    // DIL
    const dil = calcNet(aytDetails.dil?.d || 0, aytDetails.dil?.y || 0);
    aytScorePart = dil * 3.0;
  }

  const totalScore = 100 + tytContrib + aytScorePart;
  return Math.min(500, Math.max(100, Number(totalScore.toFixed(2))));
}

// Tahmini Sıralama Algoritması (YKS İstatistiksel Eğrisi)
export function estimateTYTRank(score: number): number {
  if (score >= 480) return Math.round(1 + (500 - score) * 20); // 1 - 400
  if (score >= 440) return Math.round(400 + (480 - score) * 115); // 400 - 5.000
  if (score >= 380) return Math.round(5000 + (440 - score) * 416); // 5.000 - 30.000
  if (score >= 320) return Math.round(30000 + (380 - score) * 1166); // 30.000 - 100.000
  if (score >= 250) return Math.round(100000 + (320 - score) * 2857); // 100.000 - 300.000
  return Math.round(300000 + (250 - score) * 5000);
}

export function estimateAYTRank(score: number, field: TargetField): number {
  let multiplier = 1;
  if (field === "EA") multiplier = 0.85;
  if (field === "SOZ") multiplier = 0.7;
  if (field === "DIL") multiplier = 0.4;

  const baseRank = estimateTYTRank(score);
  return Math.max(1, Math.round(baseRank * multiplier));
}

export interface NeededNetsReport {
  targetRank: number;
  targetField: TargetField;
  estimatedTargetTYTNet: number;
  estimatedTargetAYTNet: number;
  currentTYTNetAvg: number;
  currentAYTNetAvg: number;
  tytNetGap: number;
  aytNetGap: number;
  recommendations: string[];
}

export function calculateGapAnalysis(
  targetRank: number,
  field: TargetField,
  currentTYTAvg: number,
  currentAYTAvg: number
): NeededNetsReport {
  // Hedef sıralama için tahmini gereken net haritası
  let reqTYT = 100;
  let reqAYT = 70;

  if (targetRank <= 1000) {
    reqTYT = 108;
    reqAYT = 74;
  } else if (targetRank <= 5000) {
    reqTYT = 100;
    reqAYT = 68;
  } else if (targetRank <= 15000) {
    reqTYT = 92;
    reqAYT = 60;
  } else if (targetRank <= 30000) {
    reqTYT = 85;
    reqAYT = 52;
  } else if (targetRank <= 60000) {
    reqTYT = 76;
    reqAYT = 44;
  } else if (targetRank <= 100000) {
    reqTYT = 68;
    reqAYT = 36;
  } else {
    reqTYT = 58;
    reqAYT = 28;
  }

  if (field === "EA" || field === "SOZ") {
    reqAYT = Math.round(reqAYT * 0.9);
  }

  const tytGap = Number(Math.max(0, reqTYT - currentTYTAvg).toFixed(1));
  const aytGap = Number(Math.max(0, reqAYT - currentAYTAvg).toFixed(1));

  const recs: string[] = [];
  if (tytGap === 0 && aytGap === 0) {
    recs.push("🎉 Tebrikler! Mevcut ortalama netleriniz hedeflenen sıralamaya oldukça yakın veya üzerinde.");
    recs.push("Hızınızı korumak için deneme çözümlerini ve yanlış soru tekrarlarını aksatmayın.");
  } else {
    if (tytGap > 0) {
      recs.push(`Hedef sıralamanıza ulaşmak için ortalama +${tytGap} TYT netine daha ihtiyacınız var.`);
      if (tytGap > 15) {
        recs.push("TYT'de Paragraf & Problem rutinleri ile Türkçe ve Temel Matematik tabanını güçlendirin.");
      } else {
        recs.push("TYT Sosyal ve Fen derslerinden haftada 2 branş denemesi çözerek eksikleri kapatabilirsiniz.");
      }
    }
    if (aytGap > 0) {
      recs.push(`Hedef sıralamanıza ulaşmak için ortalama +${aytGap} AYT netine daha ihtiyacınız var.`);
      if (field === "SAY") {
        recs.push("AYT Matematik ve Fizik konularına ağırlık verin, bu derslerin katsayısı ve belirleyiciliği en yüksektir.");
      } else if (field === "EA") {
        recs.push("AYT Matematik ve Edebiyat konularında nokta atışı soru çözümleri planlayın.");
      } else {
        recs.push("AYT Sözel/Dil alanında günlük düzenli ezber ve branş denemeleri ivmenizi artıracaktır.");
      }
    }
  }

  return {
    targetRank,
    targetField: field,
    estimatedTargetTYTNet: reqTYT,
    estimatedTargetAYTNet: reqAYT,
    currentTYTNetAvg: Number(currentTYTAvg.toFixed(1)),
    currentAYTNetAvg: Number(currentAYTAvg.toFixed(1)),
    tytNetGap: tytGap,
    aytNetGap: aytGap,
    recommendations: recs,
  };
}
