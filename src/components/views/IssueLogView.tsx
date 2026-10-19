import React, { useState } from 'react';
import { Issue, Project, AppSettings, IssueSeverity, IssueStatus } from '../../types';
import { 
  formatDateThai, 
  enrichIssues 
} from '../../utils/calculations';
import { exportIssuesToTSV } from '../../utils/exportUtils';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Copy, 
  Check, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ShieldAlert,
  Flame,
  AlertCircle
} from 'lucide-react';

interface IssueLogViewProps {
  issues: Issue[];
  projects: Project[];
  settings: AppSettings;
  onAddIssue: () => void;
  onEditIssue: (issue: Issue) => void;
  onDeleteIssue: (issueId: string) => void;
}

export const IssueLogView: React.FC<IssueLogViewProps> = ({
  issues,
  projects,
  settings,
  onAddIssue,
  onEditIssue,
  onDeleteIssue
}) => {
  const [search, setSearch] = useState('');
  const [projectFilter, setProjectFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [openOnly, setOpenOnly] = useState(false);
  const [copied, setCopied] = useState(false);

  const enriched = enrichIssues(issues, projects);

  const filtered = enriched.filter(i => {
    if (projectFilter !== 'all' && i.projectId !== projectFilter) return false;
    if (severityFilter !== 'all' && i.severity !== severityFilter) return false;
    if (openOnly && i.status === 'ปิดปัญหา') return false;
    if (search) {
      const q = search.toLowerCase();
      return i.title.toLowerCase().includes(q) ||
             i.issueId.toLowerCase().includes(q) ||
             i.owner.toLowerCase().includes(q) ||
             (i.rootCause && i.rootCause.toLowerCase().includes(q)) ||
             (i.projectName && i.projectName.toLowerCase().includes(q));
    }
    return true;
  });

  const handleCopyTSV = () => {
    const tsv = exportIssuesToTSV(enriched);
    navigator.clipboard.writeText(tsv);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getSeverityStyle = (severity: IssueSeverity) => {
    switch (severity) {
      case 'วิกฤต':
        return 'bg-rose-50 text-rose-700 border-rose-300 font-bold';
      case 'สูง':
        return 'bg-orange-50 text-orange-700 border-orange-300 font-semibold';
      case 'ปานกลาง':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'ต่ำ':
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusStyle = (status: IssueStatus) => {
    switch (status) {
      case 'ปิดปัญหา':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'แก้ไขแล้ว':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'กำลังแก้ไข':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'รอข้อมูล':
      case 'รออนุมัติ':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-rose-50 text-rose-700 border-rose-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
      
      {/* Top Banner & Actions */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold">
              <AlertCircle className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-slate-900">
                  บันทึกปัญหา & อะไหล่ (Repair Issues & Parts Log)
                </h2>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-mono tabular-nums">
                  {issues.length} รายการ
                </span>
              </div>
              <p className="text-xs text-slate-500">
                ติดตามอาการเสียที่ไม่คาดคิด ปัญหาหน้างาน การรอเบิกอะไหล่ และแนวทางแก้ไขเพื่อไม่ให้งานซ่อมหยุดชะงัก
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              onClick={handleCopyTSV}
              className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg flex items-center space-x-1.5 transition-colors border border-slate-200"
              title="คัดลอกตารางนี้ไปวางลง Google Sheets ได้ทันที"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copied ? 'คัดลอกแล้ว!' : 'คัดลอกไป Sheets'}</span>
            </button>

            <button
              onClick={onAddIssue}
              className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg flex items-center space-x-1.5 shadow-xs transition-all active:scale-98"
            >
              <Plus className="w-4 h-4" />
              <span>+ บันทึกปัญหา / อะไหล่</span>
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="ค้นหาหัวข้อปัญหา, รหัส, สาเหตุ, ช่าง..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg w-full bg-slate-50 focus:bg-white focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
            {/* Filter by Repair Order */}
            <div className="flex items-center space-x-1.5">
              <span className="text-xs text-slate-500">ใบงานซ่อม:</span>
              <select
                value={projectFilter}
                onChange={e => setProjectFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 text-slate-700 focus:ring-2 focus:ring-rose-500 focus:outline-hidden font-medium max-w-[200px] truncate"
              >
                <option value="all">ทุกใบงานซ่อม ({projects.length})</option>
                {projects.map(p => (
                  <option key={p.projectId} value={p.projectId}>
                    {p.projectId} - {p.projectName}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter by Severity */}
            <div className="flex items-center space-x-1.5">
              <span className="text-xs text-slate-500">ความรุนแรง:</span>
              <select
                value={severityFilter}
                onChange={e => setSeverityFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 text-slate-700 focus:ring-2 focus:ring-rose-500 focus:outline-hidden font-medium"
              >
                <option value="all">ทุกระดับ</option>
                {settings.issueSeverities.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Unresolved only toggle */}
            <button
              onClick={() => setOpenOnly(!openOnly)}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors border ${
                openOnly
                  ? 'bg-rose-50 text-rose-700 border-rose-300'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              เฉพาะที่ยังไม่ปิด
            </button>
          </div>
        </div>
      </div>

      {/* Sheet Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                <th className="py-3 px-3 w-24">รหัสปัญหา</th>
                <th className="py-3 px-3 w-28">ใบงานซ่อม</th>
                <th className="py-3 px-3">วันที่พบ</th>
                <th className="py-3 px-4 min-w-[220px]">หัวข้อปัญหาและอาการเสีย</th>
                <th className="py-3 px-4 min-w-[200px]">สาเหตุ / ผลกระทบ</th>
                <th className="py-3 px-3 text-center">ระดับ</th>
                <th className="py-3 px-3">ช่างผู้รับผิดชอบ</th>
                <th className="py-3 px-3">เป้าหมายแก้ไข</th>
                <th className="py-3 px-3 text-center">สถานะ</th>
                <th className="py-3 px-2 text-center">ค้าง (วัน)</th>
                <th className="py-3 px-3 text-center w-28">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal">
              {filtered.map((i) => {
                const isClosed = i.status === 'ปิดปัญหา';

                return (
                  <tr key={i.issueId} className="hover:bg-slate-50/70 transition-colors">
                    {/* Issue ID */}
                    <td className="py-3 px-3 font-mono font-bold text-rose-700 bg-rose-50/20 whitespace-nowrap">
                      {i.issueId}
                    </td>

                    {/* Project ID */}
                    <td className="py-3 px-3 whitespace-nowrap font-mono text-xs">
                      <span className="text-blue-700 font-bold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                        {i.projectId}
                      </span>
                    </td>

                    {/* Date Found */}
                    <td className="py-3 px-3 whitespace-nowrap text-[11px] font-mono tabular-nums text-slate-600">
                      {formatDateThai(i.dateFound)}
                    </td>

                    {/* Title & Desc */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{i.title}</div>
                      {i.description && (
                        <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                          {i.description}
                        </div>
                      )}
                    </td>

                    {/* Root Cause & Impact */}
                    <td className="py-3 px-4 text-[11px]">
                      {i.rootCause && (
                        <div className="text-slate-700 line-clamp-1">
                          <span className="font-semibold text-slate-500">สาเหตุ: </span>{i.rootCause}
                        </div>
                      )}
                      {i.impact && (
                        <div className="text-rose-600 line-clamp-1 mt-0.5">
                          <span className="font-semibold">กระทบ: </span>{i.impact}
                        </div>
                      )}
                    </td>

                    {/* Severity */}
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <span className={`inline-block px-2 py-0.5 rounded text-[11px] border ${getSeverityStyle(i.severity)}`}>
                        {i.severity}
                      </span>
                    </td>

                    {/* Owner */}
                    <td className="py-3 px-3 text-slate-800 font-medium whitespace-nowrap">
                      {i.owner}
                    </td>

                    {/* Target Date */}
                    <td className="py-3 px-3 whitespace-nowrap text-[11px] font-mono tabular-nums">
                      <div>{formatDateThai(i.targetDate)}</div>
                      {i.resolvedDate && (
                        <div className="text-emerald-600">ปิด: {formatDateThai(i.resolvedDate)}</div>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium border ${getStatusStyle(i.status)}`}>
                        {i.status}
                      </span>
                    </td>

                    {/* Days Pending */}
                    <td className="py-3 px-2 text-center font-mono text-[11px] tabular-nums font-bold">
                      {isClosed ? (
                        <span className="text-slate-300">-</span>
                      ) : (i.daysPending ?? 0) > 7 ? (
                        <span className="text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                          {i.daysPending} วัน
                        </span>
                      ) : (
                        <span className="text-slate-700">{i.daysPending ?? 0}</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center space-x-1.5">
                        <button
                          onClick={() => onEditIssue(i)}
                          title="แก้ไขบันทึกปัญหา"
                          className="px-2 py-1 text-slate-600 hover:text-rose-700 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded text-xs flex items-center space-x-1 transition-colors"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>แก้ไข</span>
                        </button>
                        <button
                          onClick={() => onDeleteIssue(i.issueId)}
                          title="ลบบันทึกปัญหานี้"
                          className="px-2 py-1 text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 rounded text-xs flex items-center space-x-1 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>ลบ</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={11} className="py-16 text-center text-xs">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center">
                        <AlertCircle className="w-6 h-6" />
                      </div>
                      <div className="font-bold text-slate-800 text-sm">ไม่พบรายการปัญหาตามเงื่อนไข</div>
                      <p className="text-slate-500 max-w-sm">
                        คุณสามารถบันทึกข้อขัดข้อง อะไหล่ที่ต้องสั่งซื้อ หรืออุปสรรคหน้างานเพื่อติดตามการแก้ไขได้ทันที
                      </p>
                      <button
                        onClick={onAddIssue}
                        className="mt-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-medium rounded-lg flex items-center space-x-1.5 shadow-xs transition-all"
                      >
                        <Plus className="w-4 h-4" />
                        <span>+ บันทึกปัญหา / อะไหล่</span>
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
