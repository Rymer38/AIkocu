import React, { useState } from "react";
import { StudentData, DailyRoutine, TaskItem } from "../types";
import { 
  Clock, 
  CheckSquare, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Flame, 
  Calendar,
  Sparkles,
  ListTodo,
  X
} from "lucide-react";

interface RoutinesViewProps {
  studentData: StudentData;
  onUpdateData: (data: StudentData) => void;
}

export const RoutinesView: React.FC<RoutinesViewProps> = ({
  studentData,
  onUpdateData,
}) => {
  // New Routine Modal
  const [isRoutineModalOpen, setIsRoutineModalOpen] = useState(false);
  const [newRoutineTitle, setNewRoutineTitle] = useState("");
  const [newRoutineCategory, setNewRoutineCategory] = useState<DailyRoutine["category"]>("Paragraf");
  const [newRoutineTarget, setNewRoutineTarget] = useState(20);

  // New Task Modal
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskSubject, setNewTaskSubject] = useState("Matematik");
  const [newTaskPriority, setNewTaskPriority] = useState<TaskItem["priority"]>("Orta");

  const todayStr = new Date().toISOString().split("T")[0];

  // Routine Actions
  const toggleRoutine = (rId: string) => {
    const updated = studentData.routines.map((r) => {
      if (r.id === rId) {
        return { ...r, isDone: !r.isDone };
      }
      return r;
    });
    onUpdateData({ ...studentData, routines: updated });
  };

  const handleAddRoutine = (e: React.FormEvent) => {
    e.preventDefault();
    const newR: DailyRoutine = {
      id: `r_${Date.now()}`,
      userId: studentData.routines[0]?.userId || "student_demo_1",
      title: newRoutineTitle,
      category: newRoutineCategory,
      targetCount: newRoutineTarget,
      completedCount: 0,
      completedDate: todayStr,
      isDone: false,
    };
    onUpdateData({ ...studentData, routines: [...studentData.routines, newR] });
    setIsRoutineModalOpen(false);
    setNewRoutineTitle("");
  };

  const handleDeleteRoutine = (rId: string) => {
    onUpdateData({
      ...studentData,
      routines: studentData.routines.filter((r) => r.id !== rId),
    });
  };

  // Task Actions
  const toggleTask = (tId: string) => {
    const updated = studentData.tasks.map((t) => {
      if (t.id === tId) {
        return { ...t, isCompleted: !t.isCompleted };
      }
      return t;
    });
    onUpdateData({ ...studentData, tasks: updated });
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    const newT: TaskItem = {
      id: `task_${Date.now()}`,
      userId: studentData.tasks[0]?.userId || "student_demo_1",
      title: newTaskTitle,
      subject: newTaskSubject,
      priority: newTaskPriority,
      dueDate: todayStr,
      isCompleted: false,
    };
    onUpdateData({ ...studentData, tasks: [newT, ...studentData.tasks] });
    setIsTaskModalOpen(false);
    setNewTaskTitle("");
  };

  const handleDeleteTask = (tId: string) => {
    onUpdateData({
      ...studentData,
      tasks: studentData.tasks.filter((t) => t.id !== tId),
    });
  };

  const completedRoutinesCount = studentData.routines.filter((r) => r.isDone).length;
  const completedTasksCount = studentData.tasks.filter((t) => t.isCompleted).length;

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center space-x-2">
            <ListTodo className="w-5 h-5 text-indigo-400" />
            <span>Günlük Çalışma Rutinleri & Görev Takibi</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Sabit paragraf/problem alışkanlıklarınızı ve günlük ders hedeflerinizi düzenli takip edin.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
          <div className="text-right">
            <span className="text-[11px] text-slate-400 block">Tamamlanan Rutin:</span>
            <strong className="text-amber-400 text-xs">{completedRoutinesCount} / {studentData.routines.length}</strong>
          </div>
          <div className="h-6 w-px bg-slate-800" />
          <div>
            <span className="text-[11px] text-slate-400 block">Tamamlanan Görev:</span>
            <strong className="text-indigo-400 text-xs">{completedTasksCount} / {studentData.tasks.length}</strong>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Daily Routines Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <Flame className="w-5 h-5 text-amber-400" />
                <span>Sabit Günlük Rutinler</span>
              </h2>
              <p className="text-xs text-slate-400">Paragraf, Problem, Geometri gibi her gün tekrarlanan alışkanlıklar</p>
            </div>

            <button
              id="add-routine-btn"
              onClick={() => setIsRoutineModalOpen(true)}
              className="flex items-center space-x-1 px-3 py-1.5 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-semibold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Rutin Ekle</span>
            </button>
          </div>

          <div className="space-y-2">
            {studentData.routines.length === 0 ? (
              <p className="text-xs text-slate-500 italic text-center py-6">Henüz rutin eklenmedi.</p>
            ) : (
              studentData.routines.map((r) => (
                <div
                  key={r.id}
                  className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                    r.isDone
                      ? "bg-emerald-950/20 border-emerald-500/30"
                      : "bg-slate-950/60 border-slate-800"
                  }`}
                >
                  <div className="flex items-center space-x-3 cursor-pointer" onClick={() => toggleRoutine(r.id)}>
                    <input
                      type="checkbox"
                      checked={r.isDone}
                      onChange={() => {}}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-0 cursor-pointer"
                    />
                    <div>
                      <span className={`text-xs font-bold ${r.isDone ? "line-through text-slate-400" : "text-white"}`}>
                        {r.title}
                      </span>
                      <span className="text-[10px] text-slate-400 block">Kategori: {r.category}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 text-xs font-semibold">
                      Hedef: {r.targetCount} Soru
                    </span>
                    <button
                      onClick={() => handleDeleteRoutine(r.id)}
                      className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Personal Task Planner */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <CheckSquare className="w-5 h-5 text-indigo-400" />
                <span>Kişisel Çalışma Görev Listesi</span>
              </h2>
              <p className="text-xs text-slate-400">Konu özetleri, fasikül çözümleri ve özel ödevler</p>
            </div>

            <button
              id="add-task-btn"
              onClick={() => setIsTaskModalOpen(true)}
              className="flex items-center space-x-1 px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-semibold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Görev Ekle</span>
            </button>
          </div>

          <div className="space-y-2">
            {studentData.tasks.length === 0 ? (
              <p className="text-xs text-slate-500 italic text-center py-6">Henüz eklenmiş görev yok.</p>
            ) : (
              studentData.tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                    task.isCompleted
                      ? "bg-slate-950/30 border-slate-800/60 opacity-60"
                      : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center space-x-3 cursor-pointer" onClick={() => toggleTask(task.id)}>
                    <input
                      type="checkbox"
                      checked={task.isCompleted}
                      onChange={() => {}}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-0 cursor-pointer"
                    />
                    <div>
                      <span className={`text-xs font-semibold ${task.isCompleted ? "line-through text-slate-400" : "text-slate-200"}`}>
                        {task.title}
                      </span>
                      {task.subject && <span className="text-[10px] text-indigo-400 block">{task.subject}</span>}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      task.priority === "Yüksek"
                        ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        : "bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                    }`}>
                      {task.priority}
                    </span>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Routine Add Modal */}
      {isRoutineModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Yeni Günlük Rutin Ekle</h3>
              <button
                onClick={() => setIsRoutineModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                title="Kapat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddRoutine} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Rutin Başlığı</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: 20 Geometri Soru Çözümü"
                  value={newRoutineTitle}
                  onChange={(e) => setNewRoutineTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Kategori</label>
                  <select
                    value={newRoutineCategory}
                    onChange={(e) => setNewRoutineCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
                  >
                    <option value="Paragraf">Paragraf</option>
                    <option value="Problem">Problem</option>
                    <option value="Geometri">Geometri</option>
                    <option value="Branş Denemesi">Branş Denemesi</option>
                    <option value="Konu Tekrarı">Konu Tekrarı</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Hedef Soru Sayısı</label>
                  <input
                    type="number"
                    value={newRoutineTarget}
                    onChange={(e) => setNewRoutineTarget(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsRoutineModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Task Add Modal */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Yeni Çalışma Görevi Ekle</h3>
              <button
                onClick={() => setIsTaskModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                title="Kapat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddTask} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Görev Açıklaması</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: AYT Fizik Vektörler testini çöz"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">İlgili Ders</label>
                  <input
                    type="text"
                    value={newTaskSubject}
                    onChange={(e) => setNewTaskSubject(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Öncelik</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
                  >
                    <option value="Düşük">Düşük</option>
                    <option value="Orta">Orta</option>
                    <option value="Yüksek">Yüksek</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsTaskModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
