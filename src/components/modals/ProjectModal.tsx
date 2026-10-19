import React, { useState, useEffect } from 'react';
import { Project, ProjectStatus, AppSettings } from '../../types';
import { X, Save, FolderPlus, Building2, User, Calendar, DollarSign, FileText, Trash2, Plus, Check, Settings2 } from 'lucide-react';
import { DepartmentManagerModal } from './DepartmentManagerModal';
import { OwnerManagerModal } from './OwnerManagerModal';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Project) => void;
  onDelete?: (projectId: string) => void;
  onUpdateSettings?: (newSettings: AppSettings) => void;
  initialProject?: Project | null;
  generatedId: string;
  settings: AppSettings;
  projects?: Project[];
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  onUpdateSettings,
  initialProject,
  generatedId,
  settings,
  projects = []
}) => {
  const [formData, setFormData] = useState<Partial<Project>>({
    projectId: generatedId,
    projectName: '',
    description: '',
    department: settings.departments[0] || '',
    owner: settings.assignees[0] || '',
    startDate: new Date().toISOString().split('T')[0],
    plannedEndDate: '',
    actualEndDate: '',
    budget: 0,
    status: 'กำลังดำเนินการ',
    note: ''
  });

  // Inline Add states for Department and Project Owner
  const [isAddingDept, setIsAddingDept] = useState(false);
  const [newDeptName, setNewDeptName] = useState('');
  const [isAddingOwner, setIsAddingOwner] = useState(false);
  const [newOwnerName, setNewOwnerName] = useState('');
  const [isDeptManagerModalOpen, setIsDeptManagerModalOpen] = useState(false);
  const [isOwnerManagerModalOpen, setIsOwnerManagerModalOpen] = useState(false);

  useEffect(() => {
    if (initialProject) {
      setFormData(initialProject);
    } else {
      setFormData({
        projectId: generatedId,
        projectName: '',
        description: '',
        department: settings.departments[0] || '',
        owner: settings.assignees[0] || '',
        startDate: new Date().toISOString().split('T')[0],
        plannedEndDate: '',
        actualEndDate: '',
        budget: 1000000,
        status: 'กำลังดำเนินการ',
        note: ''
      });
    }
  }, [initialProject, generatedId, settings]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.projectName || !formData.projectId) return;

    onSave({
      projectId: formData.projectId || generatedId,
      projectName: formData.projectName,
      description: formData.description || '',
      department: formData.department || settings.departments[0] || 'ทั่วไป',
      owner: formData.owner || settings.assignees[0] || 'ไม่ระบุ',
      startDate: formData.startDate || new Date().toISOString().split('T')[0],
      plannedEndDate: formData.plannedEndDate || '',
      actualEndDate: formData.actualEndDate || '',
      budget: Number(formData.budget) || 0,
      status: (formData.status as ProjectStatus) || 'ยังไม่เริ่ม',
      note: formData.note || ''
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">
                {initialProject ? 'แก้ไขข้อมูลโครงการ' : 'เพิ่มโครงการใหม่ (Add Project)'}
              </h2>
              <p className="text-xs text-slate-500">
                บันทึกข้อมูลลงชีต Project_Master (รหัสอัตโนมัติ: {formData.projectId})
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

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto px-6 py-4 space-y-4 flex-1">
          {/* Row 1: ID & Name */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Project_ID <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.projectId || ''}
                onChange={e => setFormData({ ...formData, projectId: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono font-bold bg-slate-50 text-slate-700"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ชื่อโครงการ <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="ระบุชื่อโครงการ เช่น ระบบบริหารจัดการ..."
                value={formData.projectName || ''}
                onChange={e => setFormData({ ...formData, projectName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-sky-400 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              รายละเอียดโครงการ
            </label>
            <textarea
              rows={2}
              placeholder="วัตถุประสงค์และขอบเขตงานโดยย่อ..."
              value={formData.description || ''}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-sky-400 focus:outline-hidden"
            />
          </div>

          {/* Department & Owner with Add & Delete capability */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-slate-50/70 p-3 rounded-xl border border-slate-200">
            {/* Department */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-sky-600" />
                  <span>หน่วยงานรับผิดชอบ</span>
                </label>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingDept(!isAddingDept)}
                    className="text-[11px] font-semibold text-sky-600 hover:text-sky-700 hover:underline flex items-center gap-0.5"
                  >
                    <Plus className="w-3 h-3" />
                    <span>{isAddingDept ? 'ปิด' : 'เพิ่ม'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsDeptManagerModalOpen(true)}
                    className="text-[11px] font-medium text-slate-500 hover:text-sky-700 flex items-center gap-0.5"
                    title="จัดการหน่วยงานทั้งหมด"
                  >
                    <Settings2 className="w-3 h-3" />
                    <span>จัดการ</span>
                  </button>
                </div>
              </div>

              {isAddingDept && (
                <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-lg border border-sky-200 shadow-2xs">
                  <input
                    type="text"
                    placeholder="พิมพ์ชื่อหน่วยงานใหม่..."
                    value={newDeptName}
                    onChange={e => setNewDeptName(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const trimmed = newDeptName.trim();
                        if (trimmed) {
                          if (!settings.departments.includes(trimmed)) {
                            onUpdateSettings?.({
                              ...settings,
                              departments: [...settings.departments, trimmed]
                            });
                          }
                          setFormData({ ...formData, department: trimmed });
                          setNewDeptName('');
                          setIsAddingDept(false);
                        }
                      }
                    }}
                    className="flex-1 px-2 py-1 text-xs border border-slate-200 rounded focus:ring-1 focus:ring-sky-400 focus:outline-hidden"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const trimmed = newDeptName.trim();
                      if (trimmed) {
                        if (!settings.departments.includes(trimmed)) {
                          onUpdateSettings?.({
                            ...settings,
                            departments: [...settings.departments, trimmed]
                          });
                        }
                        setFormData({ ...formData, department: trimmed });
                        setNewDeptName('');
                        setIsAddingDept(false);
                      }
                    }}
                    className="px-2.5 py-1 bg-sky-600 text-white rounded text-xs font-semibold hover:bg-sky-700 flex items-center gap-0.5"
                  >
                    <Check className="w-3 h-3" />
                    <span>บันทึก</span>
                  </button>
                </div>
              )}

              <div className="flex items-center gap-1.5">
                <select
                  value={formData.department || ''}
                  onChange={e => setFormData({ ...formData, department: e.target.value })}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-sky-400 focus:outline-hidden"
                >
                  {settings.departments.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => {
                    const current = formData.department || settings.departments[0];
                    const filtered = settings.departments.filter(d => d !== current);
                    onUpdateSettings?.({
                      ...settings,
                      departments: filtered.length > 0 ? filtered : ['ทั่วไป']
                    });
                    setFormData({ ...formData, department: filtered[0] || 'ทั่วไป' });
                  }}
                  title={`ลบหน่วยงาน "${formData.department}" ออกจากตัวเลือก`}
                  className="px-2 py-2 text-rose-600 hover:bg-rose-50 border border-slate-200 bg-white rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                  <span>ลบ</span>
                </button>
              </div>
            </div>

            {/* Project Owner (ผู้รับผิดชอบโครงการ) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-emerald-600" />
                  <span>ผู้รับผิดชอบโครงการ</span>
                </label>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingOwner(!isAddingOwner)}
                    className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-0.5"
                  >
                    <Plus className="w-3 h-3" />
                    <span>{isAddingOwner ? 'ปิด' : 'เพิ่ม'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsOwnerManagerModalOpen(true)}
                    className="text-[11px] font-medium text-slate-500 hover:text-emerald-700 flex items-center gap-0.5"
                    title="จัดการผู้รับผิดชอบทั้งหมด"
                  >
                    <Settings2 className="w-3 h-3" />
                    <span>จัดการ</span>
                  </button>
                </div>
              </div>

              {isAddingOwner && (
                <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-lg border border-emerald-200 shadow-2xs">
                  <input
                    type="text"
                    placeholder="พิมพ์ชื่อผู้รับผิดชอบโครงการ..."
                    value={newOwnerName}
                    onChange={e => setNewOwnerName(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const trimmed = newOwnerName.trim();
                        if (trimmed) {
                          if (!settings.assignees.includes(trimmed)) {
                            onUpdateSettings?.({
                              ...settings,
                              assignees: [...settings.assignees, trimmed]
                            });
                          }
                          setFormData({ ...formData, owner: trimmed });
                          setNewOwnerName('');
                          setIsAddingOwner(false);
                        }
                      }
                    }}
                    className="flex-1 px-2 py-1 text-xs border border-slate-200 rounded focus:ring-1 focus:ring-emerald-400 focus:outline-hidden"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const trimmed = newOwnerName.trim();
                      if (trimmed) {
                        if (!settings.assignees.includes(trimmed)) {
                          onUpdateSettings?.({
                            ...settings,
                            assignees: [...settings.assignees, trimmed]
                          });
                        }
                        setFormData({ ...formData, owner: trimmed });
                        setNewOwnerName('');
                        setIsAddingOwner(false);
                      }
                    }}
                    className="px-2.5 py-1 bg-emerald-600 text-white rounded text-xs font-semibold hover:bg-emerald-700 flex items-center gap-0.5"
                  >
                    <Check className="w-3 h-3" />
                    <span>บันทึก</span>
                  </button>
                </div>
              )}

              <div className="flex items-center gap-1.5">
                <select
                  value={formData.owner || ''}
                  onChange={e => setFormData({ ...formData, owner: e.target.value })}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-emerald-400 focus:outline-hidden"
                >
                  {settings.assignees.map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => {
                    const current = formData.owner || settings.assignees[0];
                    const filtered = settings.assignees.filter(a => a !== current);
                    onUpdateSettings?.({
                      ...settings,
                      assignees: filtered.length > 0 ? filtered : ['ผู้รับผิดชอบทั่วไป']
                    });
                    setFormData({ ...formData, owner: filtered[0] || 'ผู้รับผิดชอบทั่วไป' });
                  }}
                  title={`ลบผู้รับผิดชอบ "${formData.owner}" ออกจากตัวเลือก`}
                  className="px-2 py-2 text-rose-600 hover:bg-rose-50 border border-slate-200 bg-white rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                  <span>ลบ</span>
                </button>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                วันที่เริ่มต้น <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.startDate || ''}
                onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-sky-400 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                วันสิ้นสุดตามแผน <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.plannedEndDate || ''}
                onChange={e => setFormData({ ...formData, plannedEndDate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-sky-400 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                วันสิ้นสุดจริง (ถ้าเสร็จ)
              </label>
              <input
                type="date"
                value={formData.actualEndDate || ''}
                onChange={e => setFormData({ ...formData, actualEndDate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-sky-400 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Budget & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                งบประมาณ (บาท ฿)
              </label>
              <input
                type="number"
                min="0"
                step="1000"
                value={formData.budget ?? 0}
                onChange={e => setFormData({ ...formData, budget: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-sky-400 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                สถานะโครงการ
              </label>
              <select
                value={formData.status || 'กำลังดำเนินการ'}
                onChange={e => setFormData({ ...formData, status: e.target.value as ProjectStatus })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-sky-400 focus:outline-hidden"
              >
                {settings.projectStatuses.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              หมายเหตุ
            </label>
            <input
              type="text"
              placeholder="หมายเหตุเพิ่มเติม..."
              value={formData.note || ''}
              onChange={e => setFormData({ ...formData, note: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-sky-400 focus:outline-hidden"
            />
          </div>

          {/* Modal Footer */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            {initialProject && onDelete ? (
              <button
                type="button"
                onClick={() => {
                  onDelete(initialProject.projectId);
                  onClose();
                }}
                className="px-3 py-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>ลบโครงการนี้</span>
              </button>
            ) : (
              <div />
            )}
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-50 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-sky-600 text-white rounded-lg text-xs font-semibold hover:bg-sky-700 transition-colors flex items-center space-x-1.5 shadow-sm shadow-sky-500/20"
              >
                <Save className="w-4 h-4" />
                <span>บันทึกโครงการ</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Nested Department Manager Modal */}
      <DepartmentManagerModal
        isOpen={isDeptManagerModalOpen}
        onClose={() => setIsDeptManagerModalOpen(false)}
        settings={settings}
        projects={projects}
        onUpdateSettings={onUpdateSettings || (() => {})}
      />

      {/* Nested Owner Manager Modal */}
      <OwnerManagerModal
        isOpen={isOwnerManagerModalOpen}
        onClose={() => setIsOwnerManagerModalOpen(false)}
        settings={settings}
        projects={projects}
        onUpdateSettings={onUpdateSettings || (() => {})}
      />
    </div>
  );
};
