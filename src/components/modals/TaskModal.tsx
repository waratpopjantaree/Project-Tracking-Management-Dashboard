import React, { useState, useEffect } from 'react';
import { Task, TaskStatus, Project, AppSettings } from '../../types';
import { X, Save, Wrench, Calendar, User, Percent, Layers, CheckSquare } from 'lucide-react';

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
    weight: 20,
    progress: 0,
    status: 'กำลังดำเนินการ',
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
        status: 'กำลังดำเนินการ',
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
      taskOrder: Number(formData.taskOrder) || 1,
      taskName: formData.taskName,
      description: formData.description || '',
      assignee: formData.assignee || settings.assignees[0] || 'ไม่ระบุช่าง',
      startDate: formData.startDate || new Date().toISOString().split('T')[0],
      dueDate: formData.dueDate || '',
      actualDate: formData.actualDate || '',
      weight: Number(formData.weight) || 10,
      progress: Number(formData.progress) || 0,
      status: (formData.status as TaskStatus) || 'กำลังดำเนินการ',
      note: formData.note || ''
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <Wrench className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {initialTask ? 'แก้ไขขั้นตอนการซ่อม' : 'เพิ่มขั้นตอนการซ่อม (Add Repair Step)'}
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                รหัสขั้นตอน: {formData.taskId}
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto px-6 py-4 space-y-4 flex-1">
          {/* Repair Job Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              สังกัดใบงานซ่อม <span className="text-rose-500">*</span>
            </label>
            <select
              required
              value={formData.projectId}
              onChange={e => setFormData({ ...formData, projectId: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            >
              {projects.map(p => (
                <option key={p.projectId} value={p.projectId}>
                  {p.projectId} - {p.projectName}
                </option>
              ))}
            </select>
            {currentProject && (
              <div className="mt-1 text-[11px] text-slate-500">
                แผนก: <span className="font-medium text-slate-700">{currentProject.department}</span>
              </div>
            )}
          </div>

          {/* ID & Order */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                รหัสขั้นตอน (REP_TSK_ID)
              </label>
              <input
                type="text"
                required
                value={formData.taskId || ''}
                onChange={e => setFormData({ ...formData, taskId: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono font-bold bg-slate-50 text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ลำดับขั้นตอน
              </label>
              <input
                type="number"
                min="1"
                required
                value={formData.taskOrder || 1}
                onChange={e => setFormData({ ...formData, taskOrder: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono text-center focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Task Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              ชื่อขั้นตอนการซ่อม <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="เช่น ถอดลูกปืนแบริ่ง, อัดน้ำยาแอร์ R-134a, ทดสอบระบบไฟฟ้า..."
              value={formData.taskName || ''}
              onChange={e => setFormData({ ...formData, taskName: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              รายละเอียดการปฏิบัติงาน
            </label>
            <textarea
              rows={2}
              placeholder="เครื่องมือที่ใช้ จุดที่ต้องระวังความปลอดภัย หรือผลการตรวจวัด..."
              value={formData.description || ''}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          {/* Assignee */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              ช่างผู้รับผิดชอบขั้นตอนนี้
            </label>
            <select
              value={formData.assignee}
              onChange={e => setFormData({ ...formData, assignee: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            >
              {settings.assignees.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                วันที่เริ่ม
              </label>
              <input
                type="date"
                required
                value={formData.startDate || ''}
                onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                กำหนดแล้วเสร็จ
              </label>
              <input
                type="date"
                required
                value={formData.dueDate || ''}
                onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-mono"
              />
            </div>
          </div>

          {/* Weight & Progress */}
          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>น้ำหนักงาน (Weight)</span>
                <span className="font-mono text-emerald-700">{formData.weight}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={formData.weight || 20}
                onChange={e => setFormData({ ...formData, weight: Number(e.target.value) })}
                className="w-full accent-emerald-600"
              />
            </div>
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>ความคืบหน้า (Progress)</span>
                <span className="font-mono text-emerald-700 font-bold">{formData.progress}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={formData.progress || 0}
                onChange={e => {
                  const val = Number(e.target.value);
                  setFormData({
                    ...formData,
                    progress: val,
                    status: val === 100 ? 'เสร็จสิ้น' : val > 0 ? 'กำลังดำเนินการ' : 'ยังไม่เริ่ม',
                    actualDate: val === 100 ? (formData.actualDate || new Date().toISOString().split('T')[0]) : ''
                  });
                }}
                className="w-full accent-emerald-600"
              />
            </div>
          </div>

          {/* Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                สถานะขั้นตอน
              </label>
              <select
                value={formData.status}
                onChange={e => {
                  const s = e.target.value as TaskStatus;
                  setFormData({
                    ...formData,
                    status: s,
                    progress: s === 'เสร็จสิ้น' ? 100 : formData.progress,
                    actualDate: s === 'เสร็จสิ้น' ? (formData.actualDate || new Date().toISOString().split('T')[0]) : formData.actualDate
                  });
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                {settings.taskStatuses.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                วันที่เสร็จจริง (ถ้ามี)
              </label>
              <input
                type="date"
                value={formData.actualDate || ''}
                onChange={e => setFormData({ ...formData, actualDate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 flex items-center space-x-1.5 shadow-xs transition-all active:scale-98"
            >
              <Save className="w-3.5 h-3.5" />
              <span>บันทึกขั้นตอนการซ่อม</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
