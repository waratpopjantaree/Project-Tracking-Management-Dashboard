import React, { useState } from 'react';
import { AppSettings, Project, Task } from '../../types';
import { X, Users, Plus, Trash2, AlertTriangle, Wrench, CheckSquare, Search } from 'lucide-react';

interface OwnerManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  projects: Project[];
  tasks?: Task[];
  onUpdateSettings: (newSettings: AppSettings) => void;
}

export const OwnerManagerModal: React.FC<OwnerManagerModalProps> = ({
  isOpen,
  onClose,
  settings,
  projects,
  tasks = [],
  onUpdateSettings
}) => {
  const [newOwnerInput, setNewOwnerInput] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [deleteTargetOwner, setDeleteTargetOwner] = useState<{
    name: string;
    projectCount: number;
    taskCount: number;
  } | null>(null);

  if (!isOpen) return null;

  const handleAddOwner = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newOwnerInput.trim();
    if (!trimmed) {
      setErrorMessage('กรุณาระบุชื่อช่างหรือผู้รับผิดชอบงานซ่อม');
      return;
    }

    if (settings.assignees.some(a => a.toLowerCase() === trimmed.toLowerCase())) {
      setErrorMessage(`มีชื่อ "${trimmed}" อยู่ในระบบแล้ว`);
      return;
    }

    onUpdateSettings({
      ...settings,
      assignees: [...settings.assignees, trimmed]
    });

    setNewOwnerInput('');
    setErrorMessage(null);
  };

  const promptDeleteOwner = (ownerName: string) => {
    const projectCount = projects.filter(p => p.owner === ownerName).length;
    const taskCount = tasks.filter(t => t.assignee === ownerName).length;
    setDeleteTargetOwner({
      name: ownerName,
      projectCount,
      taskCount
    });
  };

  const executeConfirmDelete = () => {
    if (!deleteTargetOwner) return;
    if (settings.assignees.length <= 1) {
      setErrorMessage('ต้องมีช่างผู้รับผิดชอบอย่างน้อย 1 ท่านในระบบ');
      setDeleteTargetOwner(null);
      return;
    }

    onUpdateSettings({
      ...settings,
      assignees: settings.assignees.filter(a => a !== deleteTargetOwner.name)
    });

    setDeleteTargetOwner(null);
    setErrorMessage(null);
  };

  const filteredOwners = settings.assignees.filter(a =>
    a.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <Users className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                จัดการช่าง / ผู้รับผิดชอบงานซ่อม (เพิ่ม / ลบ)
              </h2>
              <p className="text-xs text-slate-500 font-mono tabular-nums">
                รายชื่อช่างและวิศวกรในระบบ ({settings.assignees.length} ท่าน)
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

        {/* Form to Add New Owner */}
        <div className="p-5 border-b border-slate-200 bg-slate-50/50">
          <label className="block text-xs font-bold text-slate-800 mb-1.5">
            + เพิ่มช่าง / ผู้รับผิดชอบงานซ่อมใหม่
          </label>
          <form onSubmit={handleAddOwner} className="flex gap-2">
            <input
              type="text"
              placeholder="ระบุชื่อ เช่น ช่างประเสริฐ (ช่างเครื่องปรับอากาศ)..."
              value={newOwnerInput}
              onChange={e => {
                setNewOwnerInput(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>เพิ่มช่าง</span>
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
        {settings.assignees.length > 5 && (
          <div className="px-5 pt-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="ค้นหาชื่อช่าง..."
                value={searchFilter}
                onChange={e => setSearchFilter(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-md focus:outline-hidden focus:border-emerald-500"
              />
            </div>
          </div>
        )}

        {/* List of Assignees */}
        <div className="p-5 overflow-y-auto flex-1 divide-y divide-slate-100">
          {filteredOwners.map((owner) => {
            const projectCount = projects.filter(p => p.owner === owner).length;
            const taskCount = tasks.filter(t => t.assignee === owner).length;
            const isDeleting = deleteTargetOwner?.name === owner;

            return (
              <div key={owner} className="py-3 flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5 flex-1 min-w-0 pr-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <span className="text-xs font-medium text-slate-800 truncate" title={owner}>
                      {owner}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <div className="flex items-center space-x-1.5 text-[11px] font-mono tabular-nums">
                      <span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">
                        {projectCount} งานซ่อม
                      </span>
                      <span className="bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded">
                        {taskCount} ขั้นตอน
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => promptDeleteOwner(owner)}
                      className="px-2.5 py-1 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded transition-colors flex items-center space-x-1"
                      title={`ลบ "${owner}"`}
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                      <span>ลบ</span>
                    </button>
                  </div>
                </div>

                {/* Inline Confirmation for Deleting Owner */}
                {isDeleting && (
                  <div className="mt-2 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-900 space-y-2 animate-in fade-in">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold">
                          ยืนยันการลบช่าง "{owner}"?
                        </div>
                        {projectCount > 0 || taskCount > 0 ? (
                          <div className="text-[11px] text-rose-700 mt-0.5">
                            ⚠️ มีใบงานซ่อม {projectCount} งาน และขั้นตอน {taskCount} จุด ที่มอบหมายให้ท่านนี้
                          </div>
                        ) : (
                          <div className="text-[11px] text-rose-600 mt-0.5">
                            ท่านนี้ยังไม่มีงานซ่อมผูกไว้ สามารถลบได้อย่างปลอดภัย
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-end space-x-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setDeleteTargetOwner(null)}
                        className="px-2.5 py-1 text-xs text-slate-600 bg-white border border-slate-200 rounded hover:bg-slate-50"
                      >
                        ยกเลิก
                      </button>
                      <button
                        type="button"
                        onClick={executeConfirmDelete}
                        className="px-3 py-1 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded shadow-xs"
                      >
                        ยืนยันการลบ
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {filteredOwners.length === 0 && (
            <div className="py-8 text-center text-xs text-slate-400">
              ไม่พบรายชื่อช่างตามคำค้นหา
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>รวมทั้งหมด {settings.assignees.length} ท่าน</span>
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
