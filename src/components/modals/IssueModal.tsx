import React, { useState, useEffect } from 'react';
import { Issue, IssueSeverity, IssueStatus, Project, AppSettings } from '../../types';
import { X, Save, AlertTriangle, Calendar, User, FileText, CheckCircle2 } from 'lucide-react';

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
    status: 'ยังไม่ดำเนินการ',
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
        status: 'ยังไม่ดำเนินการ',
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
      projectName: currentProject?.projectName || '',
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
      status: (formData.status as IssueStatus) || 'ยังไม่ดำเนินการ',
      note: formData.note || ''
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-rose-50/50">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">
                {initialIssue ? 'แก้ไขบันทึกปัญหา' : 'บันทึกปัญหาและอุปสรรคใหม่ (Add Issue)'}
              </h2>
              <p className="text-xs text-slate-500">
                บันทึกข้อมูลลงชีต Issue_Log (รหัส: {formData.issueId})
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
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  เลือกโครงการ <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={formData.projectId || ''}
                  onChange={e => setFormData({ ...formData, projectId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white font-mono font-bold text-slate-800 focus:ring-2 focus:ring-rose-400 focus:outline-hidden"
                >
                  {projects.map(p => (
                    <option key={p.projectId} value={p.projectId}>
                      {p.projectId}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ชื่อโครงการ (Auto Lookup)
                </label>
                <input
                  type="text"
                  readOnly
                  value={currentProject?.projectName || 'ไม่พบโครงการ'}
                  className="w-full px-3 py-2 border border-slate-200 bg-white rounded-lg text-xs text-slate-700 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Issue ID, Date Found, Title */}
          <div className="grid grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Issue_ID
              </label>
              <input
                type="text"
                required
                value={formData.issueId || ''}
                onChange={e => setFormData({ ...formData, issueId: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono font-bold bg-slate-50 text-slate-700"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                วันที่พบปัญหา <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.dateFound || ''}
                onChange={e => setFormData({ ...formData, dateFound: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-rose-400 focus:outline-hidden"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                หัวข้อปัญหา <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="สรุปประเด็นปัญหา..."
                value={formData.title || ''}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-rose-400 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Description & Impact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                รายละเอียดปัญหา
              </label>
              <textarea
                rows={2}
                placeholder="อาการของปัญหาที่พบ..."
                value={formData.description || ''}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-rose-400 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ผลกระทบต่องาน
              </label>
              <textarea
                rows={2}
                placeholder="ผลกระทบต่อแผนงานหรือผู้ใช้..."
                value={formData.impact || ''}
                onChange={e => setFormData({ ...formData, impact: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-rose-400 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Root Cause & Solution Plan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                สาเหตุของปัญหา (Root Cause)
              </label>
              <input
                type="text"
                placeholder="สาเหตุที่แท้จริง..."
                value={formData.rootCause || ''}
                onChange={e => setFormData({ ...formData, rootCause: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-rose-400 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                แนวทางแก้ไข (Solution Plan)
              </label>
              <input
                type="text"
                placeholder="วิธีแก้ไขที่วางแผนไว้..."
                value={formData.solutionPlan || ''}
                onChange={e => setFormData({ ...formData, solutionPlan: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-rose-400 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Severity & Owner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ระดับความรุนแรง
              </label>
              <select
                value={formData.severity || 'ปานกลาง'}
                onChange={e => setFormData({ ...formData, severity: e.target.value as IssueSeverity })}
                className={`w-full px-3 py-2 border rounded-lg text-xs font-semibold focus:ring-2 focus:ring-rose-400 focus:outline-hidden ${
                  formData.severity === 'วิกฤต' ? 'bg-rose-100 text-rose-800 border-rose-300' :
                  formData.severity === 'สูง' ? 'bg-orange-100 text-orange-800 border-orange-300' :
                  formData.severity === 'ปานกลาง' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                  'bg-emerald-100 text-emerald-800 border-emerald-300'
                }`}
              >
                {settings.issueSeverities.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" />
                ผู้รับผิดชอบแก้ไข
              </label>
              <select
                value={formData.owner || ''}
                onChange={e => setFormData({ ...formData, owner: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-rose-400 focus:outline-hidden"
              >
                {settings.assignees.map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Dates & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                วันที่กำหนดแก้ไข <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.targetDate || ''}
                onChange={e => setFormData({ ...formData, targetDate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-rose-400 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                สถานะการแก้ไข
              </label>
              <select
                value={formData.status || 'ยังไม่ดำเนินการ'}
                onChange={e => {
                  const val = e.target.value as IssueStatus;
                  const newResolvedDate = (val === 'แก้ไขแล้ว' || val === 'ปิดปัญหา') && !formData.resolvedDate 
                    ? new Date().toISOString().split('T')[0] 
                    : formData.resolvedDate;
                  setFormData({ 
                    ...formData, 
                    status: val,
                    resolvedDate: newResolvedDate
                  });
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-rose-400 focus:outline-hidden"
              >
                {settings.issueStatuses.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                วันที่แก้ไขเสร็จ (ถ้าปิด)
              </label>
              <input
                type="date"
                value={formData.resolvedDate || ''}
                onChange={e => setFormData({ ...formData, resolvedDate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-rose-400 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              หมายเหตุ
            </label>
            <input
              type="text"
              placeholder="หมายเหตุเพิ่มเติม..."
              value={formData.note || ''}
              onChange={e => setFormData({ ...formData, note: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-rose-400 focus:outline-hidden"
            />
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
              className="px-5 py-2 bg-rose-600 text-white rounded-lg text-xs font-semibold hover:bg-rose-700 transition-colors flex items-center space-x-1.5 shadow-sm shadow-rose-500/20"
            >
              <Save className="w-4 h-4" />
              <span>บันทึกปัญหา</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
