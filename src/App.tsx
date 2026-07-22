import React, { useState, useEffect } from "react";
import { User, StudentData } from "./types";
import { getCurrentUser, getStudentData, saveStudentData, setCurrentUser } from "./utils/storage";
import { Navbar } from "./components/Navbar";
import { AuthModal } from "./components/AuthModal";
import { DashboardView } from "./components/DashboardView";
import { ExamsView } from "./components/ExamsView";
import { WrongQuestionsView } from "./components/WrongQuestionsView";
import { RoutinesView } from "./components/RoutinesView";
import { TargetView } from "./components/TargetView";
import { AICoachView } from "./components/AICoachView";
import { AdminView } from "./components/AdminView";
import { BackupModal } from "./components/BackupModal";
import { TopicTrackerView } from "./components/TopicTrackerView";
import { WeeklyScheduleView } from "./components/WeeklyScheduleView";
import { ScoreCalculatorView } from "./components/ScoreCalculatorView";
import { WellnessTrackerView } from "./components/WellnessTrackerView";

export default function App() {
  const [currentUser, setCurrentUserState] = useState<User | null>(null);
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);

  // Initial Load
  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUserState(user);
    if (user) {
      const data = getStudentData(user.id);
      setStudentData(data);
    }
  }, []);

  const handleUserChange = (user: User | null) => {
    setCurrentUserState(user);
    if (user) {
      const data = getStudentData(user.id);
      setStudentData(data);
    } else {
      setStudentData(null);
    }
  };

  const handleUpdateStudentData = (data: StudentData) => {
    setStudentData(data);
    if (currentUser) {
      saveStudentData(currentUser.id, data);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    handleUserChange(null);
    setIsAuthOpen(true);
  };

  const refreshAllData = () => {
    const user = getCurrentUser();
    setCurrentUserState(user);
    if (user) {
      setStudentData(getStudentData(user.id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white flex flex-col">
      
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenBackup={() => setIsBackupOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentUser && studentData ? (
          <>
            {activeTab === "dashboard" && (
              <DashboardView
                currentUser={currentUser}
                studentData={studentData}
                onNavigateTab={setActiveTab}
                onUpdateData={handleUpdateStudentData}
              />
            )}

            {activeTab === "exams" && (
              <ExamsView
                studentData={studentData}
                targetField={currentUser.targetField}
                onUpdateData={handleUpdateStudentData}
              />
            )}

            {activeTab === "topic-tracker" && (
              <TopicTrackerView
                studentData={studentData}
                onUpdateData={handleUpdateStudentData}
              />
            )}

            {activeTab === "weekly-schedule" && (
              <WeeklyScheduleView
                currentUser={currentUser}
                studentData={studentData}
                onUpdateData={handleUpdateStudentData}
              />
            )}

            {activeTab === "score-calc" && (
              <ScoreCalculatorView
                studentData={studentData}
              />
            )}

            {activeTab === "wrong-questions" && (
              <WrongQuestionsView
                studentData={studentData}
                onUpdateData={handleUpdateStudentData}
              />
            )}

            {activeTab === "routines" && (
              <RoutinesView
                studentData={studentData}
                onUpdateData={handleUpdateStudentData}
              />
            )}

            {activeTab === "wellness" && (
              <WellnessTrackerView
                studentData={studentData}
                onUpdateData={handleUpdateStudentData}
              />
            )}

            {activeTab === "target" && (
              <TargetView
                currentUser={currentUser}
                studentData={studentData}
                onNavigateTab={setActiveTab}
                onUpdateUser={(updated) => setCurrentUserState(updated)}
              />
            )}

            {activeTab === "ai-coach" && (
              <AICoachView
                currentUser={currentUser}
                studentData={studentData}
              />
            )}

            {activeTab === "admin" && currentUser.role === "admin" && (
              <AdminView />
            )}
          </>
        ) : (
          /* Guest Screen */
          <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8 bg-slate-900 border border-slate-800 rounded-3xl max-w-lg mx-auto shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-2xl mb-4">
              YKS
            </div>
            <h2 className="text-xl font-bold text-white">YKS Koçluk ve Deneme Takip Platformu</h2>
            <p className="text-xs text-slate-400 mt-2 max-w-sm">
              Lütfen deneme sınavı kaydı, yanlış soru defteri ve yapay zeka koçluk hizmetlerine erişmek için giriş yapın veya demo hesabı deneyin.
            </p>
            <button
              onClick={() => setIsAuthOpen(true)}
              className="mt-6 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
            >
              Giriş Yap / Kayıt Ol
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 YKS Koçum — Akıllı TYT & AYT Hazırlık Sistemi</span>
          <span className="text-[11px] text-slate-600">GitHub Pages Uyumlu Client Architecture • Spaced Repetition System</span>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleUserChange}
      />

      {/* Backup Export/Import Modal */}
      <BackupModal
        isOpen={isBackupOpen}
        onClose={() => setIsBackupOpen(false)}
        onDataRestored={refreshAllData}
      />

    </div>
  );
}
