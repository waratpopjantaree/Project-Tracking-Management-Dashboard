import React, { useState } from 'react';
import { AppSettings, Project } from '../../types';
import { X, Building2, Plus, Trash2, AlertTriangle, Check, FolderGit2, Search } from 'lucide-react';

interface DepartmentManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  projects: Project[];
  onUpdateSettings: (newSettings: AppSettings) => void;
  onDepartmentDeleted?: (deptName: string) => void;
}

export const DepartmentManagerModal: React.FC<DepartmentManagerModalProps> = ({
  isOpen,
  onClose,
  settings,
  projects,
  onUpdateSettings
}) => {
  const [newDeptInput, setNewDeptInput] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [deleteTargetDept, setDeleteTargetDept] = useState<{
    name: string;
    projectCount: number;
  } | null>(null);

  if (!isOpen) return null;

  const handleAddDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newDeptInput.trim();
    if (!trimmed) {
      setErrorMessage('กรุณาระบุชื่อหน่วยงานรับผิดชอบ');
      return;
    }

    if (settings.departments.some(d => d.toLowerCase() === trimmed.toLowerCase())) {
      setErrorMessage(`มีหน่วยงาน "${trimmed}" อยู่ในระบบแล้ว`);
      return;
    }

    onUpdateSettings({
      ...settings,
      departments: [...settings.departments, trimmed]
    });

    setNewDeptInput('');
    setErrorMessage(null);
  };

  const promptDeleteDepartment = (deptName: string) => {
    const projectCount = projects.filter(p => p.department === deptName).length;
    setDeleteTargetDept({
      name: deptName,
      projectCount
    });
  };

  const confirmDeleteDepartment = () => {
    if (!deleteTargetDept) return;
    const targetName = deleteTargetDept.name;

    const updatedDepartments = settings.departments.filter(d => d !== targetName);
    onUpdateSettings({
      ...settings,
      departments: updatedDepartments.length > 0 ? updatedDepartments : ['ทั่วไป']
    });

    setDeleteTargetDept(null);
  };

  const filteredDepts = settings.departments.filter(d =>
    d.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-sky-50/50">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">
                จัดการหน่วยงานรับผิดชอบ (เพิ่ม / ลบ)
              </h2>
              <p className="text-xs text-slate-500">
                รายการหน่วยงานรับผิดชอบในระบบ ({settings.departments.length} หน่วยงาน)
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

        {/* Form to Add New Department */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/40">
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            ➕ เพิ่มหน่วยงานรับผิดชอบใหม่
          </label>
          <form onSubmit={handleAddDepartment} className="flex gap-2">
            <input
              type="text"
              placeholder="ระบุชื่อหน่วยงาน เช่น กองการเงินและพัสดุ, ฝ่ายประชาสัมพันธ์..."
              value={newDeptInput}
              onChange={e => {
                setNewDeptInput(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-sky-400 focus:outline-hidden"
            />
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold bg-sky-600 text-white rounded-xl hover:bg-sky-700 flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>เพิ่มหน่วยงาน</span>
            </button>
          </form>
          {errorMessage && (
            <div className="mt-2 text-xs text-rose-600 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Search bar inside modal */}
        {settings.departments.length > 5 && (
          <div className="px-5 pt-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="ค้นหาหน่วยงาน..."
                value={searchFilter}
                onChange={e => setSearchFilter(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-sky-400 focus:outline-hidden"
              />
            </div>
          </div>
        )}

        {/* Department List */}
        <div className="flex-1 overflow-y-auto p-5 divide-y divide-slate-100 space-y-1">
          {filteredDepts.map((dept) => {
            const usedInProjects = projects.filter(p => p.department === dept).length;
            return (
              <div
                key={dept}
                className="py-2.5 flex items-center justify-between group hover:bg-slate-50 px-2 rounded-xl transition-colors"
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-sky-400 shrink-0" />
                  <span className="text-xs font-medium text-slate-800 truncate">{dept}</span>
                  {usedInProjects > 0 ? (
                    <span className="text-[10px] bg-sky-50 text-sky-700 border border-sky-100 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 font-medium">
                      <FolderGit2 className="w-3 h-3" />
                      {usedInProjects} โครงการใช้งาน
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 shrink-0">
                      (ไม่มีโครงการผูก)
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-1 shrink-0 ml-2">
                  <button
                    type="button"
                    onClick={() => promptDeleteDepartment(dept)}
                    title={`ลบหน่วยงาน "${dept}"`}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-100 flex items-center gap-1 text-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                    <span className="text-[11px] font-medium text-rose-600">ลบ</span>
                  </button>
                </div>
              </div>
            );
          })}

          {filteredDepts.length === 0 && (
            <div className="py-8 text-center text-xs text-slate-400">
              ไม่พบหน่วยงานรับผิดชอบตามคำค้นหา
            </div>
          )}
        </div>

        {/* Delete Confirmation Warning Inside Modal */}
        {deleteTargetDept && (
          <div className="p-4 bg-rose-50 border-t border-rose-100 animate-in fade-in duration-150">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="flex-1 text-xs text-rose-800">
                <p className="font-bold">
                  ต้องการลบหน่วยงาน &ldquo;{deleteTargetDept.name}&rdquo; หรือไม่?
                </p>
                {deleteTargetDept.projectCount > 0 ? (
                  <p className="text-rose-600 mt-1">
                    คำเตือน: ปัจจุบันมี <b>{deleteTargetDept.projectCount} โครงการ</b> ที่สังกัดหน่วยงานนี้
                    (โครงการจะยังคงอยู่ แต่ชื่อหน่วยงานนี้จะถูกลบออกจากตัวเลือก)
                  </p>
                ) : (
                  <p className="text-rose-600 mt-1">
                    ไม่มีโครงการใดสังกัดหน่วยงานนี้ สามารถลบได้อย่างปลอดภัย
                  </p>
                )}
                <div className="mt-3 flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={confirmDeleteDepartment}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold text-xs transition-colors flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>ยืนยันลบหน่วยงาน</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTargetDept(null)}
                    className="px-3 py-1.5 bg-white border border-rose-200 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-medium transition-colors"
                  >
                    ยกเลิก
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            * การเพิ่มหรือลบจะอัปเดตลงตัวเลือกชีต Settings อัตโนมัติ
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-100 transition-colors"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
};
