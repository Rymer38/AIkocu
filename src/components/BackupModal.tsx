import React, { useState } from "react";
import { exportAllDataAsJSON, importAllDataFromJSON } from "../utils/storage";
import { Download, Upload, RefreshCw, X, FileJson, CheckCircle2 } from "lucide-react";

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataRestored: () => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  onClose,
  onDataRestored,
}) => {
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExport = () => {
    const jsonStr = exportAllDataAsJSON();
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `yks_kocum_yedek_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        const success = importAllDataFromJSON(content);
        if (success) {
          setImportStatus("✓ YKS Verileri başarıyla içe aktarıldı!");
          setTimeout(() => {
            onDataRestored();
            onClose();
          }, 1200);
        } else {
          setImportStatus("❌ Hata: Geçersiz JSON yedek dosyası.");
        }
      };
      reader.readAsText(file);
    }
  };

  const handleResetDemoData = () => {
    if (confirm("Tüm yerel veriler silinip demo verilerine sıfırlanacak. Onaylıyor musunuz?")) {
      localStorage.clear();
      onDataRestored();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileJson className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white">Veri Yedekleme & Dışa/İçe Aktarma</h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {importStatus && (
            <div className={`p-3 rounded-xl text-xs font-semibold ${
              importStatus.includes("✓") ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
            }`}>
              {importStatus}
            </div>
          )}

          {/* Export */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
            <h3 className="text-xs font-bold text-white flex items-center space-x-2">
              <Download className="w-4 h-4 text-cyan-400" />
              <span>Verileri Dışa Aktar (JSON Export)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Deneme sınavı sonuçlarınızı, yanlış soru defterinizi ve günlük rutinlerinizi cihazınıza JSON dosyası olarak indirin.
            </p>
            <button
              id="export-json-btn"
              onClick={handleExport}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/20 mt-1"
            >
              JSON Yedeğini İndir
            </button>
          </div>

          {/* Import */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
            <h3 className="text-xs font-bold text-white flex items-center space-x-2">
              <Upload className="w-4 h-4 text-indigo-400" />
              <span>Veri Yükle (JSON Import)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Daha önce aldığınız `.json` uzantılı YKS yedeğinizi yükleyerek verilerinizi geri yükleyin.
            </p>
            <label className="block w-full text-center py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold cursor-pointer transition-colors mt-1">
              <span>JSON Dosyası Seç</span>
              <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
            </label>
          </div>

          {/* Reset */}
          <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
            <span className="text-[11px] text-slate-500">Varsayılan demo verilerine mi dönmek istiyorsunuz?</span>
            <button
              onClick={handleResetDemoData}
              className="text-xs text-rose-400 hover:underline font-semibold flex items-center space-x-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Demo Sıfırla</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
