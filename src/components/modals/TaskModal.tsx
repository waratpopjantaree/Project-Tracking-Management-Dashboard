import React, { useState, useEffect } from 'react';
import { Task, TaskStatus, Project, AppSettings } from '../../types';
import { X, Save, CheckSquare, Calendar, User, Percent, Layers } from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  initialTask?: Task | null;
  generatedId: string;
  projects: Project[];
  settings: AppSettings;
  defaultProjectId?: string;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialTask,
  generatedId,
  projects,
  settings,
  defaultProjectId
}) => {
  const [formData, setFormData] = useState<Partial<Task>>({
    taskId: generatedId,
    projectId: defaultProjectId || (projects[0]?.projectId || ''),
    taskOrder: 1,
    taskName: '',
    description: '',
    assignee: settings.assignees[0] || '',
    startDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    actualDate: '',
    weight: 10,
    progress: 0,
    status: 'ยังไม่เริ่ม',
    note: ''
  });

  useEffect(() => {
    if (initialTask) {
      setFormData(initialTask);
    } else {
      setFormData({
        taskId: generatedId,
        projectId: defaultProjectId || (projects[0]?.projectId || ''),
        taskOrder: 1,
        taskName: '',
        description: '',
        assignee: settings.assignees[0] || '',
        startDate: new Date().toISOString().split('T')[0],
        dueDate: '',
        actualDate: '',
        weight: 20,
        progress: 0,
        status: 'ยังไม่เริ่ม',
        note: ''
      });
    }
  }, [initialTask, generatedId, projects, settings, defaultProjectId]);

  if (!isOpen) return null;

  const currentProject = projects.find(p => p.projectId === formData.projectId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.taskName || !formData.taskId || !formData.projectId) return;

    onSave({
      taskId: formData.taskId || generatedId,
      projectId: formData.projectId,
      projectName: currentProject?.projectName || '',
      taskOrder: Number(formData.taskOrder) || 1,
      taskName: formData.taskName,
      description: formData.description || '',
      assignee: formData.assignee || settings.assignees[0] || 'ไม่ระบุ',
      startDate: formData.startDate || new Date().toISOString().split('T')[0],
      dueDate: formData.dueDate || '',
      actualDate: formData.actualDate || '',
      weight: Number(formData.weight) || 0,
      progress: Math.min(100, Math.max(0, Number(formData.progress) || 0)),
      status: (formData.status as TaskStatus) || 'ยังไม่เริ่ม',
      note: formData.note || ''
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">
                {initialTask ? 'แก้ไขงานย่อย' : 'เพิ่มงานย่อยใหม่ (Add Task)'}
              </h2>
              <p className="text-xs text-slate-500">
                บันทึกข้อมูลลงชีต Task_Tracking (รหัส: {formData.taskId})
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto px-6 py-4 space-y-4 flex-1">
          {/* Project Link */}
          <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100 space-y-2">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-emerald-900 mb-1">
                  เลือกโครงการ <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={formData.projectId || ''}
                  onChange={e => setFormData({ ...formData, projectId: e.target.value })}
                  className="w-full px-3 py-2 border border-emerald-200 rounded-lg text-xs bg-white font-mono font-bold text-emerald-800 focus:ring-2 focus:ring-emerald-400 focus:outline-hidden"
                >
                  {projects.map(p => (
                    <option key={p.projectId} value={p.projectId}>
                      {p.projectId}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-emerald-900 mb-1">
                  ชื่อโครงการ (Auto Lookup)
                </label>
                <input
                  type="text"
                  readOnly
                  value={currentProject?.projectName || 'ไม่พบโครงการ'}
                  className="w-full px-3 py-2 border border-emerald-200 bg-white/70 rounded-lg text-xs text-slate-700 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Task ID, Order & Name */}
          <div className="grid grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Task_ID
              </label>
              <input
                type="text"
                required
                value={formData.taskId || ''}
                onChange={e => setFormData({ ...formData, taskId: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono font-bold bg-slate-50 text-slate-700"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ลำดับงาน
              </label>
              <input
                type="number"
                min="1"
                required
                value={formData.taskOrder ?? 1}
                onChange={e => setFormData({ ...formData, taskOrder: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-400 focus:outline-hidden"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ชื่องานย่อย <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="ระบุชื่องานย่อย..."
                value={formData.taskName || ''}
                onChange={e => setFormData({ ...formData, taskName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-400 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              รายละเอียดงานย่อย
            </label>
            <textarea
              rows={2}
              placeholder="ขอบเขตงานและสิ่งที่ต้องส่งมอบ..."
              value={formData.description || ''}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-400 focus:outline-hidden"
            />
          </div>

          {/* Assignee & Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" />
                ผู้รับผิดชอบ
              </label>
              <select
                value={formData.assignee || ''}
                onChange={e => setFormData({ ...formData, assignee: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-emerald-400 focus:outline-hidden"
              >
                {settings.assignees.map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
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
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-400 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                วันครบกำหนด (Due) <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.dueDate || ''}
                onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-400 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Weight, Progress, Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50/70 p-3 rounded-xl border border-slate-200">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-slate-400" />
                น้ำหนักงาน (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.weight ?? 0}
                onChange={e => setFormData({ ...formData, weight: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-emerald-400 focus:outline-hidden"
              />
              <span className="text-[10px] text-slate-400">ใช้คำนวณความคืบหน้ารวม</span>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Percent className="w-3.5 h-3.5 text-slate-400" />
                ความคืบหน้า (0-100%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.progress ?? 0}
                onChange={e => {
                  const val = Number(e.target.value);
                  const newStatus = val === 100 ? 'เสร็จสิ้น' : val > 0 ? 'กำลังดำเนินการ' : formData.status;
                  const newActualDate = val === 100 && !formData.actualDate ? new Date().toISOString().split('T')[0] : formData.actualDate;
                  setFormData({ 
                    ...formData, 
                    progress: val,
                    status: newStatus as TaskStatus,
                    actualDate: newActualDate
                  });
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-emerald-400 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                สถานะงาน
              </label>
              <select
                value={formData.status || 'ยังไม่เริ่ม'}
                onChange={e => {
                  const val = e.target.value as TaskStatus;
                  const newProgress = val === 'เสร็จสิ้น' ? 100 : formData.progress;
                  const newActualDate = val === 'เสร็จสิ้น' && !formData.actualDate ? new Date().toISOString().split('T')[0] : formData.actualDate;
                  setFormData({ 
                    ...formData, 
                    status: val,
                    progress: newProgress,
                    actualDate: newActualDate
                  });
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-emerald-400 focus:outline-hidden"
              >
                {settings.taskStatuses.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Actual Date & Note */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                วันที่เสร็จจริง (กรณีเสร็จสิ้น)
              </label>
              <input
                type="date"
                value={formData.actualDate || ''}
                onChange={e => setFormData({ ...formData, actualDate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-400 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                หมายเหตุ
              </label>
              <input
                type="text"
                placeholder="หมายเหตุเพิ่มเติม..."
                value={formData.note || ''}
                onChange={e => setFormData({ ...formData, note: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-400 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-50 transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors flex items-center space-x-1.5 shadow-sm shadow-emerald-500/20"
            >
              <Save className="w-4 h-4" />
              <span>บันทึกงานย่อย</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
