import React, { useState } from "react";
import { User } from "../types";
import { getUsers, saveUsers, getStudentData } from "../utils/storage";
import { ShieldCheck, UserPlus, Key, Trash2, Users, Search, GraduationCap } from "lucide-react";

export const AdminView: React.FC = () => {
  const [users, setUsersState] = useState<User[]>(getUsers());
  const [searchTerm, setSearchTerm] = useState("");
  const [resetModalUser, setResetModalUser] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState("");

  const studentUsers = users.filter((u) => u.role === "student");

  const filteredStudents = studentUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.targetUni.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetModalUser || !newPassword) return;

    const updated = users.map((u) => {
      if (u.id === resetModalUser.id) {
        return { ...u, password: newPassword };
      }
      return u;
    });

    saveUsers(updated);
    setUsersState(updated);
    setResetModalUser(null);
    setNewPassword("");
    alert(`'${resetModalUser.name}' öğrencisinin şifresi başarıyla güncellendi.`);
  };

  const handleDeleteUser = (userId: string, name: string) => {
    if (confirm(`'${name}' isimli öğrenciyi ve tüm verilerini sistemden silmek istediğinize emin misiniz?`)) {
      const updated = users.filter((u) => u.id !== userId);
      saveUsers(updated);
      setUsersState(updated);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Sistem Yöneticisi Paneli</span>
          </div>
          <h1 className="text-xl font-bold text-white">Öğrenci Yönetimi & Performans İzleme</h1>
          <p className="text-xs text-slate-400 mt-1">
            Kayıtlı tüm YKS öğrencilerini listeleyin, şifre sıfırlama yapın ve çalışma verilerini denetleyin.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5">
          <Users className="w-5 h-5 text-indigo-400" />
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Kayıtlı Öğrenci Sayısı</div>
            <div className="text-base font-extrabold text-white">{studentUsers.length} Öğrenci</div>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-xl p-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Öğrenci adı, e-posta veya hedef üniversite ile ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Student List Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-bold uppercase text-slate-400">
                <th className="p-4">Öğrenci Adı / E-posta</th>
                <th className="p-4">YKS Alanı</th>
                <th className="p-4">Hedef Üniversite / Bölüm</th>
                <th className="p-4">Hedef Sıralama</th>
                <th className="p-4">Kayıtlı Deneme / Soru</th>
                <th className="p-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-slate-500">
                    Arama kriterinize uygun öğrenci kaydı bulunamadı.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const sData = getStudentData(student.id);
                  return (
                    <tr key={student.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-white">{student.name}</div>
                        <div className="text-[11px] text-slate-400">{student.email}</div>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold text-[10px]">
                          {student.targetField}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-slate-200">{student.targetUni}</div>
                        <div className="text-[11px] text-slate-400">{student.targetDept}</div>
                      </td>
                      <td className="p-4 font-bold text-amber-400">
                        #{student.targetRank.toLocaleString("tr-TR")}
                      </td>
                      <td className="p-4 text-slate-300">
                        <div>{sData.exams.length} Deneme Sınavı</div>
                        <div className="text-[11px] text-slate-400">{sData.wrongQuestions.length} Yanlış Soru Defteri</div>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => setResetModalUser(student)}
                          title="Şifre Sıfırla"
                          className="px-2.5 py-1 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-semibold transition-colors"
                        >
                          Şifre Sıfırla
                        </button>
                        <button
                          onClick={() => handleDeleteUser(student.id, student.name)}
                          title="Öğrenciyi Sil"
                          className="p-1 text-slate-500 hover:text-rose-400 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Password Reset Modal */}
      {resetModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2">Şifre Sıfırlama</h3>
            <p className="text-xs text-slate-400 mb-4">
              <strong>{resetModalUser.name}</strong> ({resetModalUser.email}) için yeni bir şifre belirleyin.
            </p>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Yeni Şifre</label>
                <input
                  type="text"
                  required
                  placeholder="Yeni şifre girin"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setResetModalUser(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold"
                >
                  Şifreyi Değiştir
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
