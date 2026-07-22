export interface CurriculumItem {
  id: string;
  examType: "TYT" | "AYT";
  subject: string;
  topicName: string;
}

export const YKS_CURRICULUM: CurriculumItem[] = [
  // TYT Türkçe
  { id: "tyt_tur_1", examType: "TYT", subject: "Türkçe", topicName: "Sözcükte Anlam" },
  { id: "tyt_tur_2", examType: "TYT", subject: "Türkçe", topicName: "Cümlede Anlam" },
  { id: "tyt_tur_3", examType: "TYT", subject: "Türkçe", topicName: "Paragrafta Anlam & Yapı" },
  { id: "tyt_tur_4", examType: "TYT", subject: "Türkçe", topicName: "Ses Bilgisi" },
  { id: "tyt_tur_5", examType: "TYT", subject: "Türkçe", topicName: "Yazım Kuralları" },
  { id: "tyt_tur_6", examType: "TYT", subject: "Türkçe", topicName: "Noktalama İşaretleri" },
  { id: "tyt_tur_7", examType: "TYT", subject: "Türkçe", topicName: "Sözcük Türleri (Isim, Sıfat, Zamir, Zarf)" },
  { id: "tyt_tur_8", examType: "TYT", subject: "Türkçe", topicName: "Edat, Bağlaç, Ünlem" },
  { id: "tyt_tur_9", examType: "TYT", subject: "Türkçe", topicName: "Fiiller, Fiilimsi & Çatı" },
  { id: "tyt_tur_10", examType: "TYT", subject: "Türkçe", topicName: "Cümlenin Ögeleri" },
  { id: "tyt_tur_11", examType: "TYT", subject: "Türkçe", topicName: "Cümle Türleri" },
  { id: "tyt_tur_12", examType: "TYT", subject: "Türkçe", topicName: "Anlatım Bozuklukları" },

  // TYT Matematik
  { id: "tyt_mat_1", examType: "TYT", subject: "Matematik", topicName: "Temel Kavramlar & Sayı Kümeleri" },
  { id: "tyt_mat_2", examType: "TYT", subject: "Matematik", topicName: "Sayı Basamakları & Bölünebilme" },
  { id: "tyt_mat_3", examType: "TYT", subject: "Matematik", topicName: "EBOB - EKOK" },
  { id: "tyt_mat_4", examType: "TYT", subject: "Matematik", topicName: "Rasyonel Sayılar & Ondalık" },
  { id: "tyt_mat_5", examType: "TYT", subject: "Matematik", topicName: "Basit Eşitsizlikler" },
  { id: "tyt_mat_6", examType: "TYT", subject: "Matematik", topicName: "Mutlak Değer" },
  { id: "tyt_mat_7", examType: "TYT", subject: "Matematik", topicName: "Üslü & Köklü İfadeler" },
  { id: "tyt_mat_8", examType: "TYT", subject: "Matematik", topicName: "Çarpanlara Ayırma" },
  { id: "tyt_mat_9", examType: "TYT", subject: "Matematik", topicName: "Oran - Orantı" },
  { id: "tyt_mat_10", examType: "TYT", subject: "Matematik", topicName: "Denklem Çözme" },
  { id: "tyt_mat_11", examType: "TYT", subject: "Matematik", topicName: "Problemler (Sayı, Kesir, Yaş, Yüzde, Hız)" },
  { id: "tyt_mat_12", examType: "TYT", subject: "Matematik", topicName: "Kümeler & Mantık" },
  { id: "tyt_mat_13", examType: "TYT", subject: "Matematik", topicName: "Fonksiyonlar" },
  { id: "tyt_mat_14", examType: "TYT", subject: "Matematik", topicName: "Permütasyon, Kombinasyon, Olasılık" },
  { id: "tyt_mat_15", examType: "TYT", subject: "Matematik", topicName: "Veri & İstatistik" },

  // TYT Geometri
  { id: "tyt_geo_1", examType: "TYT", subject: "Geometri", topicName: "Doğruda ve Üçgende Açılar" },
  { id: "tyt_geo_2", examType: "TYT", subject: "Geometri", topicName: "Dik Üçgen & Pisagor" },
  { id: "tyt_geo_3", examType: "TYT", subject: "Geometri", topicName: "İkizkenar & Eşkenar Üçgen" },
  { id: "tyt_geo_4", examType: "TYT", subject: "Geometri", topicName: "Üçgende Açıortay & Kenarortay" },
  { id: "tyt_geo_5", examType: "TYT", subject: "Geometri", topicName: "Üçgende Alan & Benzerlik" },
  { id: "tyt_geo_6", examType: "TYT", subject: "Geometri", topicName: "Çokgenler & Dörtgenler" },
  { id: "tyt_geo_7", examType: "TYT", subject: "Geometri", topicName: "Paralelkenar & Eşkenar Dörtgen" },
  { id: "tyt_geo_8", examType: "TYT", subject: "Geometri", topicName: "Dikdörtgen & Kare" },
  { id: "tyt_geo_9", examType: "TYT", subject: "Geometri", topicName: "Yamuk" },
  { id: "tyt_geo_10", examType: "TYT", subject: "Geometri", topicName: "Çember ve Daire" },
  { id: "tyt_geo_11", examType: "TYT", subject: "Geometri", topicName: "Katı Cisimler (Prizma, Piramit, Küre)" },

  // TYT Fizik
  { id: "tyt_fiz_1", examType: "TYT", subject: "Fizik", topicName: "Fizik Bilimine Giriş" },
  { id: "tyt_fiz_2", examType: "TYT", subject: "Fizik", topicName: "Madde ve Özellikleri" },
  { id: "tyt_fiz_3", examType: "TYT", subject: "Fizik", topicName: "Sıvıların Kaldırma Kuvveti & Basınç" },
  { id: "tyt_fiz_4", examType: "TYT", subject: "Fizik", topicName: "Isı, Sıcaklık ve Genleşme" },
  { id: "tyt_fiz_5", examType: "TYT", subject: "Fizik", topicName: "Hareket ve Kuvvet" },
  { id: "tyt_fiz_6", examType: "TYT", subject: "Fizik", topicName: "İş, Güç ve Enerji" },
  { id: "tyt_fiz_7", examType: "TYT", subject: "Fizik", topicName: "Elektrik ve Mıknatıslık" },
  { id: "tyt_fiz_8", examType: "TYT", subject: "Fizik", topicName: "Dalgalar" },
  { id: "tyt_fiz_9", examType: "TYT", subject: "Fizik", topicName: "Optik (Aydınlanma, Gölge, Ayna, Mercek)" },

  // TYT Kimya
  { id: "tyt_kim_1", examType: "TYT", subject: "Kimya", topicName: "Kimya Bilimi" },
  { id: "tyt_kim_2", examType: "TYT", subject: "Kimya", topicName: "Atom ve Periyodik Sistem" },
  { id: "tyt_kim_3", examType: "TYT", subject: "Kimya", topicName: "Kimyasal Türler Arası Etkileşimler" },
  { id: "tyt_kim_4", examType: "TYT", subject: "Kimya", topicName: "Maddenin Halleri" },
  { id: "tyt_kim_5", examType: "TYT", subject: "Kimya", topicName: "Kimyanın Temel Kanunları & Mol Hesabı" },
  { id: "tyt_kim_6", examType: "TYT", subject: "Kimya", topicName: "Kimyasal Tepkimeler" },
  { id: "tyt_kim_7", examType: "TYT", subject: "Kimya", topicName: "Karışımlar" },
  { id: "tyt_kim_8", examType: "TYT", subject: "Kimya", topicName: "Asitler, Bazlar ve Tuzlar" },

  // TYT Biyoloji
  { id: "tyt_biy_1", examType: "TYT", subject: "Biyoloji", topicName: "Canlıların Ortak Özellikleri" },
  { id: "tyt_biy_2", examType: "TYT", subject: "Biyoloji", topicName: "Canlıların Temel Bileşenleri" },
  { id: "tyt_biy_3", examType: "TYT", subject: "Biyoloji", topicName: "Hücre ve Organeller" },
  { id: "tyt_biy_4", examType: "TYT", subject: "Biyoloji", topicName: "Canlıların Sınıflandırılması" },
  { id: "tyt_biy_5", examType: "TYT", subject: "Biyoloji", topicName: "Hücre Bölünmeleri (Mitoz & Mayoz)" },
  { id: "tyt_biy_6", examType: "TYT", subject: "Biyoloji", topicName: "Kalıtım ve Soyağaçları" },
  { id: "tyt_biy_7", examType: "TYT", subject: "Biyoloji", topicName: "Ekosistem Ekolojisi" },

  // AYT Matematik
  { id: "ayt_mat_1", examType: "AYT", subject: "Matematik", topicName: "Polinomlar" },
  { id: "ayt_mat_2", examType: "AYT", subject: "Matematik", topicName: "2. Dereceden Denklemler & Karmaşık Sayılar" },
  { id: "ayt_mat_3", examType: "AYT", subject: "Matematik", topicName: "Parabol" },
  { id: "ayt_mat_4", examType: "AYT", subject: "Matematik", topicName: "Eşitsizlikler" },
  { id: "ayt_mat_5", examType: "AYT", subject: "Matematik", topicName: "Diziler & Aritmetik/Geometrik Dizi" },
  { id: "ayt_mat_6", examType: "AYT", subject: "Matematik", topicName: "Logaritma" },
  { id: "ayt_mat_7", examType: "AYT", subject: "Matematik", topicName: "Trigonometri" },
  { id: "ayt_mat_8", examType: "AYT", subject: "Matematik", topicName: "Limit ve Süreklilik" },
  { id: "ayt_mat_9", examType: "AYT", subject: "Matematik", topicName: "Türev ve Uygulamaları" },
  { id: "ayt_mat_10", examType: "AYT", subject: "Matematik", topicName: "İntegral ve Alan Hesabı" },

  // AYT Fizik
  { id: "ayt_fiz_1", examType: "AYT", subject: "Fizik", topicName: "Vektörler & Bağıl Hareket" },
  { id: "ayt_fiz_2", examType: "AYT", subject: "Fizik", topicName: "Newton'un Hareket Yasaları & Atışlar" },
  { id: "ayt_fiz_3", examType: "AYT", subject: "Fizik", topicName: "İtme ve Çizgisel Momentum" },
  { id: "ayt_fiz_4", examType: "AYT", subject: "Fizik", topicName: "Tork, Denge ve Kütle Merkezi" },
  { id: "ayt_fiz_5", examType: "AYT", subject: "Fizik", topicName: "Basit Makineler" },
  { id: "ayt_fiz_6", examType: "AYT", subject: "Fizik", topicName: "Elektriksel Alan, Potansiyel & Sığaçlar" },
  { id: "ayt_fiz_7", examType: "AYT", subject: "Fizik", topicName: "Manyetizma & Elektromanyetik İndüksiyon" },
  { id: "ayt_fiz_8", examType: "AYT", subject: "Fizik", topicName: "Alternatif Akım & Transformatörler" },
  { id: "ayt_fiz_9", examType: "AYT", subject: "Fizik", topicName: "Düzgün Çembersel Hareket & Açısal Momentum" },
  { id: "ayt_fiz_10", examType: "AYT", subject: "Fizik", topicName: "Basit Harmonik Hareket" },
  { id: "ayt_fiz_11", examType: "AYT", subject: "Fizik", topicName: "Dalga Mekaniği & Doppler" },
  { id: "ayt_fiz_12", examType: "AYT", subject: "Fizik", topicName: "Modern Fizik & Fotoelektrik" },

  // AYT Kimya
  { id: "ayt_kim_1", examType: "AYT", subject: "Kimya", topicName: "Modern Atom Teorisi & Kuantum Sayıları" },
  { id: "ayt_kim_2", examType: "AYT", subject: "Kimya", topicName: "Gazlar & İdeal Gaz Yasası" },
  { id: "ayt_kim_3", examType: "AYT", subject: "Kimya", topicName: "Sıvı Çözeltiler & Koligatif Özellikler" },
  { id: "ayt_kim_4", examType: "AYT", subject: "Kimya", topicName: "Tepkimelerde Enerji & Entalpi" },
  { id: "ayt_kim_5", examType: "AYT", subject: "Kimya", topicName: "Tepkime Hızları" },
  { id: "ayt_kim_6", examType: "AYT", subject: "Kimya", topicName: "Kimyasal Denge & Asit-Baz Dengesi" },
  { id: "ayt_kim_7", examType: "AYT", subject: "Kimya", topicName: "Çözünürlük Dengesi (KÇÇ)" },
  { id: "ayt_kim_8", examType: "AYT", subject: "Kimya", topicName: "Kimya ve Elektrik (Pil & Elektroliz)" },
  { id: "ayt_kim_9", examType: "AYT", subject: "Kimya", topicName: "Organik Kimyaya Giriş & Hibritleşme" },
  { id: "ayt_kim_10", examType: "AYT", subject: "Kimya", topicName: "Organik Bileşikler (Hidrokarbonlar, Alkoller)" },

  // AYT Biyoloji
  { id: "ayt_biy_1", examType: "AYT", subject: "Biyoloji", topicName: "Sinir & Endokrin Sistem" },
  { id: "ayt_biy_2", examType: "AYT", subject: "Biyoloji", topicName: "Duyu Organları" },
  { id: "ayt_biy_3", examType: "AYT", subject: "Biyoloji", topicName: "Destek ve Hareket Sistemi" },
  { id: "ayt_biy_4", examType: "AYT", subject: "Biyoloji", topicName: "Sindirim & Dolaşım Sistemi" },
  { id: "ayt_biy_5", examType: "AYT", subject: "Biyoloji", topicName: "Solunum & Boşaltım Sistemi" },
  { id: "ayt_biy_6", examType: "AYT", subject: "Biyoloji", topicName: "Komünite ve Popülasyon Ekolojisi" },
  { id: "ayt_biy_7", examType: "AYT", subject: "Biyoloji", topicName: "Nükleik Asitler & Protein Sentezi" },
  { id: "ayt_biy_8", examType: "AYT", subject: "Biyoloji", topicName: "Fotosentez, Kemosentez & Hücresel Solunum" },
  { id: "ayt_biy_9", examType: "AYT", subject: "Biyoloji", topicName: "Bitki Biyolojisi (Dokular, Büyüme, Taşıma)" },

  // AYT Edebiyat
  { id: "ayt_edb_1", examType: "AYT", subject: "Edebiyat", topicName: "Şiir Bilgisi & Edebi Sanatlar" },
  { id: "ayt_edb_2", examType: "AYT", subject: "Edebiyat", topicName: "İslamiyet Öncesi & Türk-İslam Edebiyatı" },
  { id: "ayt_edb_3", examType: "AYT", subject: "Edebiyat", topicName: "Halk Edebiyatı (Anonim, Aşık, Tekke)" },
  { id: "ayt_edb_4", examType: "AYT", subject: "Edebiyat", topicName: "Divan Edebiyatı & Nazım Şekilleri" },
  { id: "ayt_edb_5", examType: "AYT", subject: "Edebiyat", topicName: "Tanzimat Edebiyatı" },
  { id: "ayt_edb_6", examType: "AYT", subject: "Edebiyat", topicName: "Servet-i Fünun & Fecr-i Ati" },
  { id: "ayt_edb_7", examType: "AYT", subject: "Edebiyat", topicName: "Milli Edebiyat" },
  { id: "ayt_edb_8", examType: "AYT", subject: "Edebiyat", topicName: "Cumhuriyet Dönemi Şiir & Roman" },
];
