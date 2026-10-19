import React, { useState, useEffect } from 'react';
import { Project, ProjectStatus, AppSettings } from '../../types';
import { X, Save, Wrench, Building2, User, Calendar, DollarSign, FileText, Trash2, Plus, Check, Settings2 } from 'lucide-react';
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
        budget: 50000,
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
      department: formData.department || settings.departments[0] || 'แผนกช่างทั่วไป',
      owner: formData.owner || settings.assignees[0] || 'ไม่ระบุช่าง',
      startDate: formData.startDate || new Date().toISOString().split('T')[0],
      plannedEndDate: formData.plannedEndDate || '',
      actualEndDate: formData.actualEndDate || '',
      budget: Number(formData.budget) || 0,
      status: (formData.status as ProjectStatus) || 'กำลังดำเนินการ',
      note: formData.note || ''
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Wrench className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {initialProject ? 'แก้ไขข้อมูลใบงานซ่อม' : 'เปิดใบแจ้งซ่อมใหม่ (New Repair Order)'}
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                รหัสใบงาน: {formData.projectId}
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

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto px-6 py-4 space-y-4 flex-1">
          {/* Row 1: ID & Name */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                รหัสงานซ่อม (REP_ID) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.projectId || ''}
                onChange={e => setFormData({ ...formData, projectId: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono font-bold bg-slate-50 text-slate-800"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ชื่องานซ่อมและอาการเสีย <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="เช่น ซ่อมบำรุง Chiller ประจำอาคาร 1, เปลี่ยนปั๊มน้ำ..."
                value={formData.projectName || ''}
                onChange={e => setFormData({ ...formData, projectName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              รายละเอียดและอาการเสียเบื้องต้น
            </label>
            <textarea
              rows={2}
              placeholder="ระบุอาการผิดปกติ สถานที่ติดตั้ง และขอบเขตการซ่อมบำรุง..."
              value={formData.description || ''}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          {/* Department & Technician with Add & Delete capability */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
            {/* Department */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>แผนกช่างรับผิดชอบ</span>
                </label>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingDept(!isAddingDept)}
                    className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-0.5"
                  >
                    <Plus className="w-3 h-3" />
                    <span>{isAddingDept ? 'ปิด' : '+ เพิ่ม'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsDeptManagerModalOpen(true)}
                    className="text-[11px] font-medium text-slate-500 hover:text-blue-700 flex items-center gap-0.5"
                    title="จัดการแผนกช่างทั้งหมด"
                  >
                    <Settings2 className="w-3 h-3" />
                    <span>จัดการ</span>
                  </button>
                </div>
              </div>

              {isAddingDept && (
                <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-lg border border-blue-200 shadow-2xs">
                  <input
                    type="text"
                    placeholder="พิมพ์ชื่อแผนกใหม่..."
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
                    className="flex-1 px-2 py-1 text-xs border border-slate-200 rounded focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
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
                    className="px-2.5 py-1 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700 flex items-center gap-0.5"
                  >
                    <Check className="w-3 h-3" />
                    <span>ตกลง</span>
                  </button>
                </div>
              )}

              <div className="flex items-center gap-1.5">
                <select
                  value={formData.department}
                  onChange={e => setFormData({ ...formData, department: e.target.value })}
                  className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-hidden truncate"
                >
                  {settings.departments.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>

                {settings.departments.length > 1 && formData.department && (
                  <button
                    type="button"
                    onClick={() => {
                      const target = formData.department;
                      if (!target) return;
                      const updated = settings.departments.filter(d => d !== target);
                      onUpdateSettings?.({
                        ...settings,
                        departments: updated
                      });
                      setFormData({ ...formData, department: updated[0] || '' });
                    }}
                    className="px-2 py-1.5 text-xs text-rose-600 hover:bg-rose-50 hover:text-rose-700 border border-slate-200 hover:border-rose-300 rounded-lg flex items-center gap-1 transition-colors shrink-0"
                    title={`ลบแผนก "${formData.department}" ออกจากตัวเลือก`}
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                    <span className="text-[11px] font-semibold">ลบ</span>
                  </button>
                )}
              </div>
            </div>

            {/* Technician / Owner */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-emerald-600" />
                  <span>ช่างผู้รับผิดชอบ</span>
                </label>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingOwner(!isAddingOwner)}
                    className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-0.5"
                  >
                    <Plus className="w-3 h-3" />
                    <span>{isAddingOwner ? 'ปิด' : '+ เพิ่ม'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsOwnerManagerModalOpen(true)}
                    className="text-[11px] font-medium text-slate-500 hover:text-emerald-700 flex items-center gap-0.5"
                    title="จัดการรายชื่อช่างทั้งหมด"
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
                    placeholder="พิมพ์ชื่อช่างใหม่..."
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
                    <span>ตกลง</span>
                  </button>
                </div>
              )}

              <div className="flex items-center gap-1.5">
                <select
                  value={formData.owner}
                  onChange={e => setFormData({ ...formData, owner: e.target.value })}
                  className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden truncate"
                >
                  {settings.assignees.map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>

                {settings.assignees.length > 1 && formData.owner && (
                  <button
                    type="button"
                    onClick={() => {
                      const target = formData.owner;
                      if (!target) return;
                      const updated = settings.assignees.filter(a => a !== target);
                      onUpdateSettings?.({
                        ...settings,
                        assignees: updated
                      });
                      setFormData({ ...formData, owner: updated[0] || '' });
                    }}
                    className="px-2 py-1.5 text-xs text-rose-600 hover:bg-rose-50 hover:text-rose-700 border border-slate-200 hover:border-rose-300 rounded-lg flex items-center gap-1 transition-colors shrink-0"
                    title={`ลบช่าง "${formData.owner}" ออกจากตัวเลือก`}
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                    <span className="text-[11px] font-semibold">ลบ</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Dates & Budget */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                วันที่เริ่มซ่อม
              </label>
              <input
                type="date"
                required
                value={formData.startDate || ''}
                onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                กำหนดแล้วเสร็จ
              </label>
              <input
                type="date"
                required
                value={formData.plannedEndDate || ''}
                onChange={e => setFormData({ ...formData, plannedEndDate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                งบประมาณค่าซ่อม (บาท)
              </label>
              <input
                type="number"
                min="0"
                step="500"
                value={formData.budget || 0}
                onChange={e => setFormData({ ...formData, budget: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono tabular-nums text-right focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Status & Actual End Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                สถานะงานซ่อม
              </label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as ProjectStatus })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-white"
              >
                {settings.projectStatuses.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                วันที่ซ่อมเสร็จจริง (ถ้ามี)
              </label>
              <input
                type="date"
                value={formData.actualEndDate || ''}
                onChange={e => setFormData({ ...formData, actualEndDate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-mono"
              />
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              หมายเหตุ / ข้อมูลอะไหล่เพิ่มเติม
            </label>
            <input
              type="text"
              placeholder="เช่น รอส่งมอบอะไหล่วันที่ 20, ต้องใช้อุปกรณ์เซฟตี้พิเศษ..."
              value={formData.note || ''}
              onChange={e => setFormData({ ...formData, note: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            {initialProject && onDelete ? (
              <button
                type="button"
                onClick={() => {
                  onDelete(initialProject.projectId);
                  onClose();
                }}
                className="px-3 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-lg flex items-center space-x-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>ลบใบงานซ่อมนี้</span>
              </button>
            ) : <div />}

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 flex items-center space-x-1.5 shadow-xs transition-all active:scale-98"
              >
                <Save className="w-3.5 h-3.5" />
                <span>บันทึกใบงานซ่อม</span>
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

      {/* Nested Technician / Owner Manager Modal */}
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
