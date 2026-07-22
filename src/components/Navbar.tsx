import React from "react";
import { User } from "../types";
import { 
  BookOpen, 
  BarChart3, 
  HelpCircle, 
  CheckSquare, 
  Target, 
  Sparkles, 
  ShieldCheck, 
  Download, 
  LogOut, 
  User as UserIcon,
  Clock,
  Calendar,
  Calculator,
  Heart,
  ListTodo
} from "lucide-react";

interface NavbarProps {
  currentUser: User | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAuth: () => void;
  onOpenBackup: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  onOpenAuth,
  onOpenBackup,
  onLogout,
}) => {
  const navItems = [
    { id: "dashboard", label: "Genel Bakış", icon: BarChart3 },
    { id: "exams", label: "Denemeler", icon: BookOpen },
    { id: "topic-tracker", label: "Konu Takip", icon: ListTodo },
    { id: "weekly-schedule", label: "Program", icon: Calendar },
    { id: "score-calc", label: "Puan Hesapla", icon: Calculator },
    { id: "wrong-questions", label: "Yanlış Soru", icon: HelpCircle },
    { id: "routines", label: "Rutin & Görev", icon: Clock },
    { id: "wellness", label: "Sağlık & Mod", icon: Heart },
    { id: "target", label: "Hedef", icon: Target },
    { id: "ai-coach", label: "AI Koç", icon: Sparkles },
  ];

  if (currentUser?.role === "admin") {
    navItems.push({ id: "admin", label: "Admin Paneli", icon: ShieldCheck });
  }

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab("dashboard")}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-indigo-500/20">
              YKS
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-white tracking-tight">YKS Koçum</span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  PRO
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Deneme & Soru Defteri Koçluğu</p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-0.5 lg:space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1.5 px-2 py-1.5 lg:px-2.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-sm"
                      : "text-slate-300 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-indigo-400" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center space-x-3">
            {/* Export/Import Backup */}
            <button
              id="backup-btn"
              onClick={onOpenBackup}
              title="Veri Yedekle / Yükle (JSON)"
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg border border-slate-700/60 transition-colors flex items-center space-x-1 text-xs"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span className="hidden lg:inline">Yedekle / Yükle</span>
            </button>

            {/* User Profile / Auth */}
            {currentUser ? (
              <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
                <div className="flex flex-col text-right hidden sm:block">
                  <span className="text-xs font-semibold text-slate-200">{currentUser.name}</span>
                  <span className="text-[10px] text-indigo-400">
                    {currentUser.role === "admin" ? "Yönetici" : `${currentUser.targetField} • ${currentUser.targetUni}`}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 font-bold text-xs">
                  {currentUser.name.charAt(0)}
                </div>
                <button
                  id="logout-btn"
                  onClick={onLogout}
                  title="Çıkış Yap"
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                id="login-btn"
                onClick={onOpenAuth}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-colors shadow-sm"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Giriş / Kayıt</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Tab Navigation */}
      <div className="md:hidden flex items-center overflow-x-auto px-4 py-2 border-t border-slate-800/80 space-x-1 scrollbar-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:text-white"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
