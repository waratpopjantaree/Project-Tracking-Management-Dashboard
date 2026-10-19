import React, { useState, useEffect } from 'react';
import { Issue, IssueSeverity, IssueStatus, Project, AppSettings } from '../../types';
import { X, Save, AlertTriangle, Calendar, User, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

interface IssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (issue: Issue) => void;
  initialIssue?: Issue | null;
  generatedId: string;
  projects: Project[];
  settings: AppSettings;
  defaultProjectId?: string;
}

export const IssueModal: React.FC<IssueModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialIssue,
  generatedId,
  projects,
  settings,
  defaultProjectId
}) => {
  const [formData, setFormData] = useState<Partial<Issue>>({
    issueId: generatedId,
    projectId: defaultProjectId || (projects[0]?.projectId || ''),
    dateFound: new Date().toISOString().split('T')[0],
    title: '',
    description: '',
    rootCause: '',
    impact: '',
    severity: 'ปานกลาง',
    owner: settings.assignees[0] || '',
    solutionPlan: '',
    targetDate: '',
    resolvedDate: '',
    status: 'กำลังแก้ไข',
    note: ''
  });

  useEffect(() => {
    if (initialIssue) {
      setFormData(initialIssue);
    } else {
      setFormData({
        issueId: generatedId,
        projectId: defaultProjectId || (projects[0]?.projectId || ''),
        dateFound: new Date().toISOString().split('T')[0],
        title: '',
        description: '',
        rootCause: '',
        impact: '',
        severity: 'ปานกลาง',
        owner: settings.assignees[0] || '',
        solutionPlan: '',
        targetDate: '',
        resolvedDate: '',
        status: 'กำลังแก้ไข',
        note: ''
      });
    }
  }, [initialIssue, generatedId, projects, settings, defaultProjectId]);

  if (!isOpen) return null;

  const currentProject = projects.find(p => p.projectId === formData.projectId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.issueId || !formData.projectId) return;

    onSave({
      issueId: formData.issueId || generatedId,
      projectId: formData.projectId,
      dateFound: formData.dateFound || new Date().toISOString().split('T')[0],
      title: formData.title,
      description: formData.description || '',
      rootCause: formData.rootCause || '',
      impact: formData.impact || '',
      severity: (formData.severity as IssueSeverity) || 'ปานกลาง',
      owner: formData.owner || settings.assignees[0] || 'ไม่ระบุ',
      solutionPlan: formData.solutionPlan || '',
      targetDate: formData.targetDate || '',
      resolvedDate: formData.resolvedDate || '',
      status: (formData.status as IssueStatus) || 'กำลังแก้ไข',
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
            <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center font-bold">
              <AlertCircle className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {initialIssue ? 'แก้ไขบันทึกปัญหา / อะไหล่' : 'บันทึกปัญหาหน้างาน / ขออะไหล่ (Report Issue)'}
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                รหัสปัญหา: {formData.issueId}
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
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-800 font-medium focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
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

          {/* ID & Date Found */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                รหัสปัญหา (ISS_ID)
              </label>
              <input
                type="text"
                required
                value={formData.issueId || ''}
                onChange={e => setFormData({ ...formData, issueId: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono font-bold bg-slate-50 text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                วันที่พบปัญหา
              </label>
              <input
                type="date"
                required
                value={formData.dateFound || ''}
                onChange={e => setFormData({ ...formData, dateFound: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              หัวข้อปัญหา / อาการเสีย <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="เช่น อะไหล่โอริงคอมเพรสเซอร์ขาดตลาด, น็อตยึดหน้าแปลนเป็นสนิม..."
              value={formData.title || ''}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
            />
          </div>

          {/* Severity & Technician */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ระดับความรุนแรง
              </label>
              <select
                value={formData.severity}
                onChange={e => setFormData({ ...formData, severity: e.target.value as IssueSeverity })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
              >
                {settings.issueSeverities.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ช่างผู้รับผิดชอบแก้ไข
              </label>
              <select
                value={formData.owner}
                onChange={e => setFormData({ ...formData, owner: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
              >
                {settings.assignees.map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Root Cause & Impact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                สาเหตุที่แท้จริง (Root Cause)
              </label>
              <textarea
                rows={2}
                placeholder="เกิดจากอะไหล่เสื่อมสภาพ, ขาดการหล่อลื่น..."
                value={formData.rootCause || ''}
                onChange={e => setFormData({ ...formData, rootCause: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ผลกระทบต่องานซ่อม
              </label>
              <textarea
                rows={2}
                placeholder="ทำให้ขั้นตอนการประกอบล่าช้าไป 2 วัน..."
                value={formData.impact || ''}
                onChange={e => setFormData({ ...formData, impact: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Solution Plan */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              แนวทางแก้ไข / อะไหล่ที่ต้องจัดหา
            </label>
            <textarea
              rows={2}
              placeholder="ระบุเบอร์อะไหล่ แหล่งจำหน่าย หรือขั้นตอนแก้ปัญหาเฉพาะหน้า..."
              value={formData.solutionPlan || ''}
              onChange={e => setFormData({ ...formData, solutionPlan: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
            />
          </div>

          {/* Target Date & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                กำหนดแก้ไขเสร็จ
              </label>
              <input
                type="date"
                required
                value={formData.targetDate || ''}
                onChange={e => setFormData({ ...formData, targetDate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                สถานะปัญหา
              </label>
              <select
                value={formData.status}
                onChange={e => {
                  const s = e.target.value as IssueStatus;
                  setFormData({
                    ...formData,
                    status: s,
                    resolvedDate: s === 'ปิดปัญหา' || s === 'แก้ไขแล้ว' ? (formData.resolvedDate || new Date().toISOString().split('T')[0]) : formData.resolvedDate
                  });
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
              >
                {settings.issueStatuses.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                วันที่แก้ไขสำเร็จจริง
              </label>
              <input
                type="date"
                value={formData.resolvedDate || ''}
                onChange={e => setFormData({ ...formData, resolvedDate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Footer */}
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
              className="px-5 py-2 bg-rose-600 text-white rounded-lg text-xs font-semibold hover:bg-rose-700 flex items-center space-x-1.5 shadow-xs transition-all active:scale-98"
            >
              <Save className="w-3.5 h-3.5" />
              <span>บันทึกปัญหา</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
