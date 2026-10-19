import React, { useState } from 'react';
import { AppSettings, Project } from '../../types';
import { X, Building2, Plus, Trash2, AlertTriangle, Check, Wrench, Search } from 'lucide-react';

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
      setErrorMessage('กรุณาระบุชื่อแผนกช่างรับผิดชอบ');
      return;
    }

    if (settings.departments.some(d => d.toLowerCase() === trimmed.toLowerCase())) {
      setErrorMessage(`มีแผนก "${trimmed}" อยู่ในระบบแล้ว`);
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

  const executeConfirmDelete = () => {
    if (!deleteTargetDept) return;
    if (settings.departments.length <= 1) {
      setErrorMessage('ต้องมีแผนกช่างอย่างน้อย 1 รายการในระบบ');
      setDeleteTargetDept(null);
      return;
    }

    onUpdateSettings({
      ...settings,
      departments: settings.departments.filter(d => d !== deleteTargetDept.name)
    });

    setDeleteTargetDept(null);
    setErrorMessage(null);
  };

  const filteredDepts = settings.departments.filter(d =>
    d.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                จัดการแผนกช่างรับผิดชอบ (เพิ่ม / ลบ)
              </h2>
              <p className="text-xs text-slate-500 font-mono tabular-nums">
                รายการแผนกช่างในระบบ ({settings.departments.length} แผนก)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form to Add New Department */}
        <div className="p-5 border-b border-slate-200 bg-slate-50/50">
          <label className="block text-xs font-bold text-slate-800 mb-1.5">
            + เพิ่มแผนกช่างรับผิดชอบใหม่
          </label>
          <form onSubmit={handleAddDepartment} className="flex gap-2">
            <input
              type="text"
              placeholder="ระบุชื่อแผนก เช่น แผนกซ่อมบำรุงระบบไอน้ำ, แผนกโยธา..."
              value={newDeptInput}
              onChange={e => {
                setNewDeptInput(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>เพิ่มแผนก</span>
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
                placeholder="ค้นหาแผนก..."
                value={searchFilter}
                onChange={e => setSearchFilter(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-md focus:outline-hidden focus:border-blue-500"
              />
            </div>
          </div>
        )}

        {/* List of Departments */}
        <div className="p-5 overflow-y-auto flex-1 divide-y divide-slate-100">
          {filteredDepts.map((dept) => {
            const usageCount = projects.filter(p => p.department === dept).length;
            const isDeleting = deleteTargetDept?.name === dept;

            return (
              <div key={dept} className="py-3 flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5 flex-1 min-w-0 pr-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                    <span className="text-xs font-medium text-slate-800 truncate" title={dept}>
                      {dept}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded font-mono tabular-nums ${
                        usageCount > 0
                          ? 'bg-blue-50 text-blue-700 font-semibold'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {usageCount > 0 ? `${usageCount} ใบงานซ่อม` : 'ยังไม่มีงานซ่อม'}
                    </span>

                    <button
                      type="button"
                      onClick={() => promptDeleteDepartment(dept)}
                      className="px-2.5 py-1 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded transition-colors flex items-center space-x-1"
                      title={`ลบแผนก ${dept}`}
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                      <span>ลบ</span>
                    </button>
                  </div>
                </div>

                {/* Inline Confirmation for Deleting Department */}
                {isDeleting && (
                  <div className="mt-2 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-900 space-y-2 animate-in fade-in">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold">
                          ยืนยันการลบแผนก "{dept}"?
                        </div>
                        {usageCount > 0 ? (
                          <div className="text-[11px] text-rose-700 mt-0.5">
                            ⚠️ มีใบงานซ่อม <span className="font-bold">{usageCount} รายการ</span> ที่ใช้แผนกนี้อยู่
                          </div>
                        ) : (
                          <div className="text-[11px] text-rose-600 mt-0.5">
                            แผนกนี้ไม่มีงานซ่อมผูกไว้ สามารถลบได้อย่างปลอดภัย
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-end space-x-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setDeleteTargetDept(null)}
                        className="px-2.5 py-1 text-xs text-slate-600 bg-white border border-slate-200 rounded hover:bg-slate-50"
                      >
                        ยกเลิก
                      </button>
                      <button
                        type="button"
                        onClick={executeConfirmDelete}
                        className="px-3 py-1 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded shadow-xs"
                      >
                        ยืนยันการลบแผนก
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {filteredDepts.length === 0 && (
            <div className="py-8 text-center text-xs text-slate-400">
              ไม่พบแผนกช่างตามคำค้นหา
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>รวมทั้งหมด {settings.departments.length} แผนก</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
          >
            ปิดหน้าต่าง
          </button>
        </div>

      </div>
    </div>
  );
};
