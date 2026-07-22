import React, { useState } from "react";
import { StudentData, TopicProgress } from "../types";
import { YKS_CURRICULUM } from "../data/yksCurriculum";
import { 
  CheckCircle2, 
  BookOpen, 
  Search, 
  Filter, 
  FileText, 
  CheckSquare, 
  RotateCcw,
  Sparkles,
  BarChart2
} from "lucide-react";

interface TopicTrackerViewProps {
  studentData: StudentData;
  onUpdateData: (data: StudentData) => void;
}

export const TopicTrackerView: React.FC<TopicTrackerViewProps> = ({
  studentData,
  onUpdateData,
}) => {
  const [activeExamType, setActiveExamType] = useState<"TYT" | "AYT">("TYT");
  const [selectedSubject, setSelectedSubject] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Existing user topic progress map or fallback
  const savedTopics: TopicProgress[] = studentData.topicProgress || [];

  // Helper to get or create topic state
  const getTopicState = (curriculumId: string, examType: "TYT" | "AYT", subject: string, topicName: string): TopicProgress => {
    const found = savedTopics.find((t) => t.id === curriculumId);
    if (found) return found;
    return {
      id: curriculumId,
      examType,
      subject,
      topicName,
      isStudied: false,
      isSummaryDone: false,
      isTestSolved: false,
      isReviewed: false,
    };
  };

  const handleToggleStep = (
    curriculumId: string,
    examType: "TYT" | "AYT",
    subject: string,
    topicName: string,
    field: "isStudied" | "isSummaryDone" | "isTestSolved" | "isReviewed"
  ) => {
    const currentState = getTopicState(curriculumId, examType, subject, topicName);
    const updatedState: TopicProgress = {
      ...currentState,
      [field]: !currentState[field],
    };

    const newTopicList = savedTopics.filter((t) => t.id !== curriculumId);
    newTopicList.push(updatedState);

    onUpdateData({
      ...studentData,
      topicProgress: newTopicList,
    });
  };

  // Filter curriculum items
  const filteredCurriculum = YKS_CURRICULUM.filter((item) => {
    if (item.examType !== activeExamType) return false;
    if (selectedSubject !== "ALL" && item.subject !== selectedSubject) return false;
    if (searchTerm && !item.topicName.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  // Extract available subjects for dropdown
  const availableSubjects = Array.from(
    new Set(YKS_CURRICULUM.filter((i) => i.examType === activeExamType).map((i) => i.subject))
  );

  // Calculate Progress Stats
  const activeCurriculumItems = YKS_CURRICULUM.filter((i) => i.examType === activeExamType);
  let completedTopicsCount = 0;

  activeCurriculumItems.forEach((item) => {
    const state = getTopicState(item.id, item.examType, item.subject, item.topicName);
    if (state.isStudied && state.isTestSolved) {
      completedTopicsCount++;
    }
  });

  const overallProgressPct = activeCurriculumItems.length > 0
    ? Math.round((completedTopicsCount / activeCurriculumItems.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>ÖSYM YKS Müfredat Takip Sistemi</span>
          </div>
          <h1 className="text-xl font-bold text-white flex items-center space-x-2">
            <span>Konu Takip & Tamamlama Çizelgesi</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            TYT ve AYT ders konularını adım adım bitirin; konu anlatımı, özet ve test çözümlerini işaretleyin.
          </p>
        </div>

        {/* Progress Badge */}
        <div className="bg-slate-950 border border-indigo-500/30 rounded-2xl p-4 flex items-center space-x-4 min-w-[220px]">
          <div className="relative w-12 h-12 flex items-center justify-center bg-indigo-600/20 rounded-xl text-indigo-400 border border-indigo-500/30 font-black text-sm">
            %{overallProgressPct}
          </div>
          <div>
            <div className="text-xs font-bold text-white">{activeExamType} Tamamlama Oranı</div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {completedTopicsCount} / {activeCurriculumItems.length} Konu Bitti
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
        
        {/* Exam Type Selector */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setActiveExamType("TYT");
              setSelectedSubject("ALL");
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeExamType === "TYT"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "bg-slate-800 text-slate-300 hover:text-white"
            }`}
          >
            TYT Konuları
          </button>
          <button
            onClick={() => {
              setActiveExamType("AYT");
              setSelectedSubject("ALL");
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeExamType === "AYT"
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-slate-800 text-slate-300 hover:text-white"
            }`}
          >
            AYT Konuları
          </button>
        </div>

        {/* Search & Subject Select */}
        <div className="flex items-center space-x-2 flex-1 max-w-lg">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Konu adı ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none"
          >
            <option value="ALL">Tüm Dersler</option>
            {availableSubjects.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Topics List Table / Cards */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs font-bold text-slate-300">
          <span>Ders & Konu Adı</span>
          <div className="hidden sm:flex items-center space-x-6 text-[11px] text-slate-400">
            <span className="w-20 text-center">📘 Konu Çalışıldı</span>
            <span className="w-20 text-center">✍️ Özet Notu</span>
            <span className="w-20 text-center">✏️ 1. Test</span>
            <span className="w-20 text-center">🔄 Tekrar</span>
          </div>
        </div>

        <div className="divide-y divide-slate-800/60 max-h-[600px] overflow-y-auto">
          {filteredCurriculum.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              Arama kriterinize uygun konu bulunamadı.
            </div>
          ) : (
            filteredCurriculum.map((item) => {
              const state = getTopicState(item.id, item.examType, item.subject, item.topicName);
              const isFullyDone = state.isStudied && state.isTestSolved;

              return (
                <div
                  key={item.id}
                  className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-800/30 transition-colors ${
                    isFullyDone ? "bg-emerald-950/10" : ""
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        isFullyDone ? "bg-emerald-400 shadow-sm shadow-emerald-500" : "bg-slate-700"
                      }`}
                    />
                    <div>
                      <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold text-[10px] mr-2">
                        {item.subject}
                      </span>
                      <span className={`text-xs font-semibold ${isFullyDone ? "text-emerald-300 font-bold" : "text-slate-200"}`}>
                        {item.topicName}
                      </span>
                    </div>
                  </div>

                  {/* Step Buttons */}
                  <div className="flex items-center justify-between sm:justify-end space-x-2 sm:space-x-6 text-xs">
                    
                    {/* Konu Çalışıldı */}
                    <button
                      onClick={() =>
                        handleToggleStep(item.id, item.examType, item.subject, item.topicName, "isStudied")
                      }
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center space-x-1 ${
                        state.isStudied
                          ? "bg-indigo-600 text-white shadow"
                          : "bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200"
                      }`}
                    >
                      <span>{state.isStudied ? "✓ Çalışıldı" : "Konu"}</span>
                    </button>

                    {/* Özet Notu */}
                    <button
                      onClick={() =>
                        handleToggleStep(item.id, item.examType, item.subject, item.topicName, "isSummaryDone")
                      }
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center space-x-1 ${
                        state.isSummaryDone
                          ? "bg-cyan-600 text-white shadow"
                          : "bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200"
                      }`}
                    >
                      <span>{state.isSummaryDone ? "✓ Özet" : "Özet"}</span>
                    </button>

                    {/* 1. Test */}
                    <button
                      onClick={() =>
                        handleToggleStep(item.id, item.examType, item.subject, item.topicName, "isTestSolved")
                      }
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center space-x-1 ${
                        state.isTestSolved
                          ? "bg-emerald-600 text-white shadow"
                          : "bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200"
                      }`}
                    >
                      <span>{state.isTestSolved ? "✓ Test" : "Test"}</span>
                    </button>

                    {/* Tekrar */}
                    <button
                      onClick={() =>
                        handleToggleStep(item.id, item.examType, item.subject, item.topicName, "isReviewed")
                      }
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center space-x-1 ${
                        state.isReviewed
                          ? "bg-amber-600 text-white shadow"
                          : "bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200"
                      }`}
                    >
                      <span>{state.isReviewed ? "✓ Tekrar" : "Tekrar"}</span>
                    </button>

                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
};
