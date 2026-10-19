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
  Flame
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
      {/* Top Banner & Actions */}
      <div className="bg-white p-5 rounded-2xl border border-rose-200/80 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-slate-800">
                  ชีต Issue_Log (บันทึกปัญหาและอุปสรรค)
                </h2>
                <span className="text-xs bg-rose-50 text-rose-700 font-semibold px-2 py-0.5 rounded-full border border-rose-200">
                  {issues.length} ปัญหา
                </span>
              </div>
              <p className="text-xs text-slate-500">
                ติดตามความเสี่ยง ข้อขัดข้อง ระดับความรุนแรง วันค้าง และแนวทางแก้ไขเพื่อไม่ให้กระทบโครงการ
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              onClick={handleCopyTSV}
              className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center space-x-1.5 transition-colors border border-slate-200"
              title="คัดลอกตารางนี้ไปวางลง Google Sheets ได้ทันที"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'คัดลอกแล้ว!' : 'คัดลอกไป Google Sheets'}</span>
            </button>

            <button
              onClick={onAddIssue}
              className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg flex items-center space-x-1.5 shadow-xs shadow-rose-500/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>บันทึกปัญหาใหม่</span>
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="ค้นหาหัวข้อปัญหา, สาเหตุ, ผู้รับผิดชอบ..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg w-full bg-slate-50 focus:bg-white focus:ring-2 focus:ring-rose-400 focus:outline-hidden"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Filter by Project */}
            <select
              value={projectFilter}
              onChange={e => setProjectFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 text-slate-700 focus:ring-2 focus:ring-rose-400 focus:outline-hidden font-medium"
            >
              <option value="all">ทุกโครงการ ({projects.length})</option>
              {projects.map(p => (
                <option key={p.projectId} value={p.projectId}>
                  {p.projectId} - {p.projectName.length > 20 ? p.projectName.substring(0, 20) + '...' : p.projectName}
                </option>
              ))}
            </select>

            {/* Filter by Severity */}
            <select
              value={severityFilter}
              onChange={e => setSeverityFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 text-slate-700 focus:ring-2 focus:ring-rose-400 focus:outline-hidden font-medium"
            >
              <option value="all">ทุกระดับความรุนแรง</option>
              {settings.issueSeverities.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            {/* Open only toggle */}
            <label className="flex items-center space-x-1.5 text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-1.5 rounded-lg border border-rose-200 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={openOnly}
                onChange={e => setOpenOnly(e.target.checked)}
                className="rounded text-rose-600 focus:ring-rose-400"
              />
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              <span>เฉพาะปัญหาที่ยังไม่ปิด</span>
            </label>
          </div>
        </div>
      </div>

      {/* Interactive Sheet Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 border-collapse">
            <thead>
              <tr className="bg-rose-50/70 text-slate-800 font-bold border-b border-rose-100 text-[11px] uppercase tracking-wider">
                <th className="py-3 px-3 w-20">Issue_ID</th>
                <th className="py-3 px-3">Project_ID</th>
                <th className="py-3 px-4 min-w-[200px]">หัวข้อปัญหา & รายละเอียด</th>
                <th className="py-3 px-3 text-center">ระดับความรุนแรง</th>
                <th className="py-3 px-3">ผู้รับผิดชอบแก้ไข</th>
                <th className="py-3 px-3">กำหนดแก้ไข</th>
                <th className="py-3 px-3 text-center">สถานะ</th>
                <th className="py-3 px-3 text-center">วันค้าง</th>
                <th className="py-3 px-3 text-center w-20">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal">
              {filtered.map((i) => {
                const isClosed = i.status === 'ปิดปัญหา';
                const isResolved = i.status === 'แก้ไขแล้ว';

                return (
                  <tr 
                    key={i.issueId} 
                    className={`hover:bg-slate-50/80 transition-colors ${
                      i.severity === 'วิกฤต' && !isClosed ? 'bg-rose-50/30' : ''
                    }`}
                  >
                    {/* Issue ID */}
                    <td className="py-3 px-3 font-mono font-bold text-rose-700 bg-rose-50/20">
                      {i.issueId}
                    </td>

                    {/* Project ID */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="font-mono font-bold text-sky-700">{i.projectId}</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[120px]">
                        {i.projectName}
                      </div>
                    </td>

                    {/* Title & Description */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{i.title}</div>
                      {i.description && (
                        <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          {i.description}
                        </div>
                      )}
                      {i.solutionPlan && (
                        <div className="text-[10px] text-emerald-700 font-medium mt-1 bg-emerald-50/80 px-2 py-0.5 rounded inline-block">
                          แนวทาง: {i.solutionPlan}
                        </div>
                      )}
                    </td>

                    {/* Severity Badge */}
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        i.severity === 'วิกฤต' ? 'bg-rose-100 text-rose-800 border border-rose-300' :
                        i.severity === 'สูง' ? 'bg-orange-100 text-orange-800 border border-orange-300' :
                        i.severity === 'ปานกลาง' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                        'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      }`}>
                        {i.severity}
                      </span>
                    </td>

                    {/* Owner */}
                    <td className="py-3 px-3 text-slate-700 font-medium whitespace-nowrap">
                      {i.owner}
                    </td>

                    {/* Dates */}
                    <td className="py-3 px-3 whitespace-nowrap text-[11px]">
                      <div>กำหนด: {formatDateThai(i.targetDate)}</div>
                      {i.resolvedDate ? (
                        <div className="text-emerald-600 font-medium">ปิด: {formatDateThai(i.resolvedDate)}</div>
                      ) : (
                        <div className="text-slate-400">พบ: {formatDateThai(i.dateFound)}</div>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                        isClosed ? 'bg-slate-100 text-slate-600 border border-slate-200' :
                        isResolved ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                        i.status === 'กำลังแก้ไข' ? 'bg-sky-100 text-sky-800 border border-sky-200' :
                        i.status === 'รอข้อมูล' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                        'bg-rose-100 text-rose-800 border border-rose-200'
                      }`}>
                        {i.status}
                      </span>
                    </td>

                    {/* Days pending */}
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      {isClosed ? (
                        <span className="text-[11px] text-slate-400 font-medium">ปิดแล้ว</span>
                      ) : (
                        <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                          (i.daysPending ?? 0) > 7 ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {i.daysPending} วัน
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          onClick={() => onEditIssue(i)}
                          title="แก้ไขปัญหา"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteIssue(i.issueId)}
                          title="ลบปัญหานี้"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-xs text-slate-400">
                    ไม่พบข้อมูลปัญหาและอุปสรรคตามเงื่อนไขที่เลือก
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
