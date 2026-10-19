import React, { useState } from 'react';
import { AppSettings, Project, Task } from '../../types';
import { X, Users, Plus, Trash2, AlertTriangle, FolderGit2, CheckSquare, Search } from 'lucide-react';

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
      setErrorMessage('กรุณาระบุชื่อผู้รับผิดชอบโครงการ');
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

  const confirmDeleteOwner = () => {
    if (!deleteTargetOwner) return;
    const targetName = deleteTargetOwner.name;

    const updatedAssignees = settings.assignees.filter(a => a !== targetName);
    onUpdateSettings({
      ...settings,
      assignees: updatedAssignees.length > 0 ? updatedAssignees : ['ผู้รับผิดชอบทั่วไป']
    });

    setDeleteTargetOwner(null);
  };

  const filteredOwners = settings.assignees.filter(a =>
    a.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-emerald-50/50">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">
                จัดการผู้รับผิดชอบโครงการ (เพิ่ม / ลบ)
              </h2>
              <p className="text-xs text-slate-500">
                รายชื่อผู้รับผิดชอบโครงการในระบบ ({settings.assignees.length} ท่าน)
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

        {/* Form to Add New Owner */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/40">
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            ➕ เพิ่มผู้รับผิดชอบโครงการใหม่
          </label>
          <form onSubmit={handleAddOwner} className="flex gap-2">
            <input
              type="text"
              placeholder="ระบุชื่อ-นามสกุล เช่น กิตติศักดิ์ พงศ์ไพศาล..."
              value={newOwnerInput}
              onChange={e => {
                setNewOwnerInput(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-emerald-400 focus:outline-hidden"
            />
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>เพิ่มรายชื่อ</span>
            </button>
          </form>
          {errorMessage && (
            <div className="mt-2 text-xs text-rose-600 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Search */}
        {settings.assignees.length > 5 && (
          <div className="px-5 pt-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="ค้นหาชื่อผู้รับผิดชอบ..."
                value={searchFilter}
                onChange={e => setSearchFilter(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-emerald-400 focus:outline-hidden"
              />
            </div>
          </div>
        )}

        {/* Owner List */}
        <div className="flex-1 overflow-y-auto p-5 divide-y divide-slate-100 space-y-1">
          {filteredOwners.map((owner) => {
            const usedInProjects = projects.filter(p => p.owner === owner).length;
            const usedInTasks = tasks.filter(t => t.assignee === owner).length;
            return (
              <div
                key={owner}
                className="py-2.5 flex items-center justify-between group hover:bg-slate-50 px-2 rounded-xl transition-colors"
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                  <span className="text-xs font-medium text-slate-800 truncate">{owner}</span>
                  <div className="flex items-center gap-1.5">
                    {usedInProjects > 0 && (
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 font-medium">
                        <FolderGit2 className="w-3 h-3" />
                        {usedInProjects} โครงการ
                      </span>
                    )}
                    {usedInTasks > 0 && (
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 font-medium">
                        <CheckSquare className="w-3 h-3" />
                        {usedInTasks} งานย่อย
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-1 shrink-0 ml-2">
                  <button
                    type="button"
                    onClick={() => promptDeleteOwner(owner)}
                    title={`ลบผู้รับผิดชอบ "${owner}"`}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-100 flex items-center gap-1 text-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                    <span className="text-[11px] font-medium text-rose-600">ลบ</span>
                  </button>
                </div>
              </div>
            );
          })}

          {filteredOwners.length === 0 && (
            <div className="py-8 text-center text-xs text-slate-400">
              ไม่พบผู้รับผิดชอบตามคำค้นหา
            </div>
          )}
        </div>

        {/* Delete Confirmation Warning Inside Modal */}
        {deleteTargetOwner && (
          <div className="p-4 bg-rose-50 border-t border-rose-100 animate-in fade-in duration-150">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="flex-1 text-xs text-rose-800">
                <p className="font-bold">
                  ต้องการลบผู้รับผิดชอบ &ldquo;{deleteTargetOwner.name}&rdquo; หรือไม่?
                </p>
                {deleteTargetOwner.projectCount > 0 ? (
                  <p className="text-rose-600 mt-1">
                    คำเตือน: มี <b>{deleteTargetOwner.projectCount} โครงการ</b> และ <b>{deleteTargetOwner.taskCount} งานย่อย</b> ที่มอบหมายให้ท่านนี้
                    (โครงการจะยังคงอยู่ แต่ชื่อนี้จะถูกลบออกจากตัวเลือก Dropdown)
                  </p>
                ) : (
                  <p className="text-rose-600 mt-1">
                    ไม่มีโครงการหรือภาระงานค้างอยู่ สามารถลบได้อย่างปลอดภัย
                  </p>
                )}
                <div className="mt-3 flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={confirmDeleteOwner}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold text-xs transition-colors flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>ยืนยันลบผู้รับผิดชอบ</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTargetOwner(null)}
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
