import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Gemini client lazily/safely
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health API
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// AI YKS Coach Endpoint
app.post("/api/gemini/coach", async (req, res) => {
  try {
    const { studentName, targetField, targetUni, targetDept, targetRank, currentAverages, weakestTopics, routineStats, recentExams } = req.body;

    const ai = getGeminiClient();

    if (!ai) {
      // High-quality fallback response if API key is not configured
      const fallbackResponse = `### 🎯 Sayın ${studentName || "Öğrenci"}, YKS Koçluk Değerlendirmesi:

**1. Mevcut Durum & Hedef Analizi:**
Hedefiniz: **${targetUni || "Üniversite"} - ${targetDept || "Bölüm"}** (Hedef Sıralama: ${targetRank ? `#${targetRank}` : "Belirtilmedi"}).
Mevcut TYT Net Ortalamanız: **${currentAverages?.tytNet || 0} Net**, AYT Net Ortalamanız: **${currentAverages?.aytNet || 0} Net**.

**2. Kritik Odak Noktaları:**
${weakestTopics && weakestTopics.length > 0 
  ? `En çok yanlış yaptığınız konular: **${weakestTopics.join(", ")}**. Bu konulara haftalık 4 saatlik nokta atışı konu tekrarı ve soru çözümü ekleyin.`
  : "Eksik konularınızı belirlemek için Deneme Yanlış Soru Defterine yeni sorular eklemeyi unutmayın."}

**3. Günlük Rutin Ve Strateji:**
- Her gün mutlaka **20 Paragraf** ve **20 Problem** rutinine sadık kalın.
- AYT alanınızda (${targetField || "SAY"}) en yüksek katsayılı derslere ağırlık verin.
- Yanlış yaptığınız soruları Aralıklı Tekrar Sistemi ile 1., 3. ve 7. günlerde tekrar çözün.

*İpucu: Canlı yapay zeka analizleri için Sistem Ayarlarından GEMINI_API_KEY anahtarınızı ekleyebilirsiniz.*`;

      return res.json({ advice: fallbackResponse, source: "system_rules" });
    }

    const prompt = `Sen Türkiye YKS (TYT / AYT) sınavı konusunda uzman, motive edici ve yapıcı bir YKS Eğitim Koçusun.
Öğrencinin Adı: ${studentName || "Öğrenci"}
Hedef Alanı: ${targetField || "SAY"}
Hedef Üniversite & Bölüm: ${targetUni || "İTÜ"} - ${targetDept || "Bilgisayar Mühendisliği"} (Hedef Sıralama: #${targetRank || 5000})

Öğrenci Verileri:
- TYT Net Ortalaması: ${currentAverages?.tytNet || 0} (Türkçe: ${currentAverages?.tytTurkce || 0}, Mat: ${currentAverages?.tytMat || 0}, Sosyal: ${currentAverages?.tytSosyal || 0}, Fen: ${currentAverages?.tytFen || 0})
- AYT Net Ortalaması: ${currentAverages?.aytNet || 0}
- En Çok Yanlış Yapılan/Zorlanılan Konular: ${weakestTopics?.join(", ") || "Henüz kaydedilmedi"}
- Günlük Rutin Tamamlama Oranı: %${routineStats?.completionRate || 0}
- Son Deneme Sonuçları: ${JSON.stringify(recentExams || [])}

ÖNEMLİ KURAL: YANITLARINI KISA, ÖZ, NET VE MADDELER HALİNDE YAZ. Kesinlikle çok uzun paragraflar veya destan yazma! Maksimum 2-3 kısa bölüm ve 3-4 net madde ile doğrudan tavsiye ver.

Başlıklar:
1. 📊 Durum Değerlendirmesi
2. ⚡ Acil Konu & Net Hamlesi
3. 📅 Haftalık Çalışma Odağı
4. 🔥 Koçun Notu`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    res.json({ advice: response.text, source: "gemini" });
  } catch (error: any) {
    console.error("Gemini Coach Error:", error);
    res.status(500).json({ error: error.message || "Yapay zeka koçluk yanıtı üretilirken bir hata oluştu." });
  }
});

// AI Question Image Scan & OCR Topic Identification Endpoint
app.post("/api/gemini/scan-question-image", async (req, res) => {
  try {
    const { imageBase64 } = req.body;

    const ai = getGeminiClient();

    if (!ai || !imageBase64) {
      // Fallback response if API key is missing or no image
      return res.json({
        success: true,
        data: {
          subject: "Matematik (TYT)",
          topic: "Problem - Sayı Problemleri",
          difficulty: "Orta",
          wrongReason: "Bilgi Eksikliği",
          questionSummary: "Görselden tespit edilen YKS sorusu.",
          solutionText: "Görsel tespit edilemedi. Manuel kural kontrolü yapın.",
          aiHint: "Katsayıları ve soruda istenen denklem bağıntısını adım adım kurun.",
        },
        source: "fallback",
      });
    }

    // Clean base64 header if present (data:image/png;base64,...)
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    const mimeType = imageBase64.match(/^data:(image\/\w+);base64,/)?.[1] || "image/jpeg";

    const prompt = `Sen YKS (TYT / AYT) sorularını fotoğraftan tanıyan uzman bir öğretmensin.
Bu fotoğraftaki YKS sorusunu analiz et ve YALNIZCA geçerli bir JSON nesnesi döndür (başka hiçbir metin veya markdown tırnağı yazma):

{
  "subject": "Matematik (TYT) / Türkçe (TYT) / Fizik (AYT) / Kimya (AYT) / Biyoloji (AYT) / Edebiyat (AYT) derslerinden uygun olanı",
  "topic": "Sorusunun ait olduğu YKS konusu (Örn: Problem, Paragraf, Türev, Çembersel Hareket, Ses Bilgisi vb.)",
  "difficulty": "Kolay" veya "Orta" veya "Zor",
  "wrongReason": "Bilgi Eksikliği" veya "Dikkatsizlik" veya "Yanlış Anlama" veya "İşlem Hatası",
  "questionSummary": "Soru metninin 1-2 cümlelik kısa özeti",
  "solutionText": "Sorunun kısa kilit formülü veya çözüm püf noktası",
  "aiHint": "Öğrenciye 1 maddelik akılda kalıcı kısa ipucu"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: [
        {
          inlineData: {
            data: base64Data,
            mimeType: mimeType,
          },
        },
        prompt,
      ],
    });

    let rawText = response.text || "";
    // Clean code blocks if present
    rawText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();

    try {
      const parsed = JSON.parse(rawText);
      return res.json({ success: true, data: parsed, source: "gemini_vision" });
    } catch {
      return res.json({
        success: true,
        data: {
          subject: "Matematik (TYT)",
          topic: "Problem",
          difficulty: "Orta",
          wrongReason: "Bilgi Eksikliği",
          questionSummary: rawText.slice(0, 100),
          solutionText: "Formül kontrolü yapın.",
          aiHint: "Tüm adımları yazarak çözün.",
        },
        source: "parsed_raw",
      });
    }
  } catch (error: any) {
    console.error("Gemini Scan Error:", error);
    res.status(500).json({ error: error.message || "Görsel analiz edilemedi." });
  }
});

// AI Question Hint & Analysis Endpoint
app.post("/api/gemini/question-hint", async (req, res) => {
  try {
    const { subject, topic, questionText, wrongReason, difficulty } = req.body;

    const ai = getGeminiClient();

    if (!ai) {
      const fallbackAnalysis = `### 💡 ${subject || "Ders"} - ${topic || "Konu"} Soru Analiz Rehberi

**1. Yanlış Yapma Nedeni:** ${wrongReason || "Kavram Yanılgısı veya Dikkatsizlik"}
**2. Temel Kavram & Formül:** Bu konuda tanım ve temel kuralları bir kağıda özetleyip soru çözerken yanınızda bulundurun.
**3. Çözüm Stratejisi:**
- Soru kökünü (hangisi olamaz, kesinlikle doğrudur vb.) altını çizerek dikkatle okuyun.
- Verilen değerleri bağıntıya adım adım yerleştirin.
- Çözümü 3 gün sonra tekrar çözerek Aralıklı Tekrar defterinize işaretleyin.`;

      return res.json({ analysis: fallbackAnalysis, source: "system_rules" });
    }

    const prompt = `Sen YKS ${subject || ""} dersinde uzman bir öğretmensin. Soru için analiz ve rehberlik ipucu hazırla.
Soru: ${subject || ""} - ${topic || ""} (${wrongReason || "Bilgi Eksikliği"})
Not: "${questionText || ""}"

ÖNEMLİ KURAL: YANITINI MÜMKÜN OLDUĞUNCA KISA VE BİRKAÇ MADDEDE YAZ.
1. 🎯 Temel Mantık
2. 🔑 Kilit Formül / Tanım
3. 📝 Kısa İpucu`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    res.json({ analysis: response.text, source: "gemini" });
  } catch (error: any) {
    console.error("Gemini Question Hint Error:", error);
    res.status(500).json({ error: error.message || "Soru analizi üretilemedi." });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
