import React, { useState } from 'react';
import { Project, AppSettings } from '../../types';
import { X, Building2, Plus, Trash2, AlertCircle, Check, FolderGit2 } from 'lucide-react';

interface DepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  projects: Project[];
  onUpdateSettings: (newSettings: AppSettings) => void;
  onDepartmentDeleted?: (deletedDept: string) => void;
}

export const DepartmentModal: React.FC<DepartmentModalProps> = ({
  isOpen,
  onClose,
  settings,
  projects,
  onUpdateSettings,
  onDepartmentDeleted
}) => {
  const [newDeptName, setNewDeptName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleAddDepartment = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newDeptName.trim();
    if (!trimmed) {
      setErrorMsg('กรุณาระบุชื่อหน่วยงานรับผิดชอบ');
      return;
    }
    if (settings.departments.some(d => d.toLowerCase() === trimmed.toLowerCase())) {
      setErrorMsg(`หน่วยงาน "${trimmed}" มีอยู่ในระบบแล้ว`);
      return;
    }

    const updated = {
      ...settings,
      departments: [...settings.departments, trimmed]
    };
    onUpdateSettings(updated);
    setNewDeptName('');
    setErrorMsg('');
    setSuccessMsg(`เพิ่มหน่วยงาน "${trimmed}" เรียบร้อยแล้ว`);
    setTimeout(() => setSuccessMsg(''), 2500);
  };

  const handleDeleteDepartment = (deptName: string) => {
    if (settings.departments.length <= 1) {
      setErrorMsg('ระบบต้องมีหน่วยงานรับผิดชอบอย่างน้อย 1 รายการ');
      setTimeout(() => setErrorMsg(''), 3000);
      return;
    }

    const linkedCount = projects.filter(p => p.department === deptName).length;
    if (linkedCount > 0) {
      const confirmDelete = window.confirm(
        `หน่วยงาน "${deptName}" กำลังถูกใช้งานอยู่ใน ${linkedCount} โครงการหลัก\\nคุณต้องการลบหน่วยงานนี้ออกจากตัวเลือกใช่หรือไม่?`
      );
      if (!confirmDelete) return;
    }

    const filtered = settings.departments.filter(d => d !== deptName);
    onUpdateSettings({
      ...settings,
      departments: filtered
    });

    if (onDepartmentDeleted) {
      onDepartmentDeleted(deptName);
    }

    setSuccessMsg(`ลบหน่วยงาน "${deptName}" เรียบร้อยแล้ว`);
    setTimeout(() => setSuccessMsg(''), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full flex flex-col max-h-[85vh] overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150"
        role="dialog"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-sky-100 bg-sky-50/70">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shadow-xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                จัดการหน่วยงานรับผิดชอบ (เพิ่ม / ลบ)
              </h3>
              <p className="text-xs text-slate-500">
                เพิ่มหรือลบรายชื่อหน่วยงานรับผิดชอบในชีต Project_Master และระบบ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Add Form */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <label className="block text-xs font-bold text-slate-800">
              ➕ เพิ่มหน่วยงานรับผิดชอบใหม่
            </label>
            <form onSubmit={handleAddDepartment} className="flex gap-2">
              <input
                type="text"
                placeholder="ระบุชื่อหน่วยงานรับผิดชอบ (เช่น ฝ่ายบริหารงานทั่วไป)..."
                value={newDeptName}
                onChange={e => {
                  setNewDeptName(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-sky-400 focus:outline-hidden"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold flex items-center space-x-1 shrink-0 shadow-xs transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>เพิ่ม</span>
              </button>
            </form>

            {errorMsg && (
              <div className="text-[11px] text-rose-600 flex items-center space-x-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div className="text-[11px] text-emerald-600 flex items-center space-x-1 font-medium">
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}
          </div>

          {/* List of Departments */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center space-x-1.5">
                <span>รายชื่อหน่วยงานรับผิดชอบในระบบ</span>
                <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[11px]">
                  {settings.departments.length} หน่วยงาน
                </span>
              </span>
              <span className="text-slate-400 font-normal text-[11px]">กดปุ่ม 🗑️ เพื่อลบ</span>
            </div>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
              {settings.departments.map((dept) => {
                const projectCount = projects.filter(p => p.department === dept).length;

                return (
                  <div 
                    key={dept} 
                    className="p-3 flex items-center justify-between hover:bg-slate-50/70 transition-colors gap-3"
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                        <Building2 className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-slate-800 truncate">
                          {dept}
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center space-x-1">
                          <FolderGit2 className="w-3 h-3" />
                          <span>ใช้งานอยู่ใน {projectCount} โครงการ</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      {settings.departments.length > 1 ? (
                        <button
                          type="button"
                          onClick={() => handleDeleteDepartment(dept)}
                          className="px-2.5 py-1 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-lg flex items-center space-x-1 transition-colors"
                          title={`ลบ "${dept}"`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>ลบ</span>
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-300 italic">ค่าสุดท้าย</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
