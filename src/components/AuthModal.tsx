import React, { useState, useEffect } from "react";
import { User, TargetField } from "../types";
import { getUsers, saveUsers, setCurrentUser } from "../utils/storage";
import { X, UserCheck, Lock, Mail, GraduationCap, Target, Shield, CheckSquare } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [name, setName] = useState("");
  const [targetField, setTargetField] = useState<TargetField>("SAY");
  const [targetUni, setTargetUni] = useState("İstanbul Teknik Üniversitesi");
  const [targetDept, setTargetDept] = useState("Bilgisayar Mühendisliği");
  const [targetRank, setTargetRank] = useState<number>(5000);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      const savedRemember = localStorage.getItem("yks_remember_me") === "true";
      const savedEmail = localStorage.getItem("yks_remember_email") || "";
      setRememberMe(savedRemember);
      if (savedRemember && savedEmail) {
        setEmail(savedEmail);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Lütfen hem e-posta adresinizi hem de şifrenizi giriniz.");
      return;
    }

    const users = getUsers();
    const found = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    );

    if (!found) {
      setError("E-posta adresi veya şifre hatalı! Lütfen bilgilerinizi kontrol edin.");
      return;
    }

    if (rememberMe) {
      localStorage.setItem("yks_remember_me", "true");
      localStorage.setItem("yks_remember_email", email.trim());
    } else {
      localStorage.setItem("yks_remember_me", "false");
      localStorage.removeItem("yks_remember_email");
    }

    setCurrentUser(found.id);
    onSuccess(found);
    onClose();
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name || !email || !password) {
      setError("Lütfen gerekli tüm alanları doldurun.");
      return;
    }
    const users = getUsers();
    if (users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
      setError("Bu e-posta adresi ile zaten bir hesap mevcut.");
      return;
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      name,
      email: email.trim(),
      password,
      role: "student",
      targetField,
      targetUni,
      targetDept,
      targetRank: Number(targetRank) || 10000,
      createdAt: new Date().toISOString().split("T")[0],
    };

    users.push(newUser);
    saveUsers(users);

    if (rememberMe) {
      localStorage.setItem("yks_remember_me", "true");
      localStorage.setItem("yks_remember_email", newUser.email);
    }

    setCurrentUser(newUser.id);
    onSuccess(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-3 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative my-auto max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header with Close X Button */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-indigo-900/50 to-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
              YKS
            </div>
            <h2 className="text-base font-bold text-white">
              {isRegister ? "Öğrenci Kaydı Oluştur" : "Hesabınıza Giriş Yapın"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors flex items-center justify-center"
            title="Kapat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-4 overflow-y-auto space-y-3">
          {error && (
            <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={isRegister ? handleRegister : handleLogin} className="space-y-3">
            {isRegister && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Ad Soyad</label>
                <input
                  type="text"
                  required
                  placeholder="Ahmet Yılmaz"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">E-posta Adresi</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  placeholder="ornek@yks.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Şifre</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-0 cursor-pointer"
                />
                <span>Beni Hatırla</span>
              </label>
            </div>

            {isRegister && (
              <>
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">YKS Alanı</label>
                    <select
                      value={targetField}
                      onChange={(e) => setTargetField(e.target.value as TargetField)}
                      className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                    >
                      <option value="SAY">SAY (Sayısal)</option>
                      <option value="EA">EA (Eşit Ağırlık)</option>
                      <option value="SOZ">SÖZ (Sözel)</option>
                      <option value="DIL">DİL (Yabancı Dil)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Hedef Sıralama</label>
                    <input
                      type="number"
                      placeholder="5000"
                      value={targetRank}
                      onChange={(e) => setTargetRank(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Hedef Üniversite</label>
                  <input
                    type="text"
                    placeholder="İTÜ / ODTÜ / Boğaziçi"
                    value={targetUni}
                    onChange={(e) => setTargetUni(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Hedef Bölüm</label>
                  <input
                    type="text"
                    placeholder="Bilgisayar Mühendisliği / Tıp"
                    value={targetDept}
                    onChange={(e) => setTargetDept(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </>
            )}

            <button
              id="auth-submit-btn"
              type="submit"
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all duration-200 mt-1"
            >
              {isRegister ? "Kayıt Ol ve Başla" : "Şifre ile Giriş Yap"}
            </button>
          </form>

          <div className="pt-2 border-t border-slate-800 text-center">
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setError("");
              }}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
            >
              {isRegister
                ? "Zaten bir hesabınız var mı? Giriş Yapın"
                : "Hesabınız yok mu? Hemen Ücretsiz Kayıt Olun"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
