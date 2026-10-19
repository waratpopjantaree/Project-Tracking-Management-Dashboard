import React, { useState } from 'react';
import { Project, Task, Issue, AppSettings } from '../../types';
import { 
  formatCurrency, 
  formatDateThai, 
  enrichProjects 
} from '../../utils/calculations';
import { exportProjectsToTSV } from '../../utils/exportUtils';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Copy, 
  Check, 
  FolderGit2, 
  Building2, 
  User, 
  Calendar, 
  DollarSign,
  Layers,
  AlertCircle,
  ExternalLink
} from 'lucide-react';

import { DepartmentManagerModal } from '../modals/DepartmentManagerModal';
import { OwnerManagerModal } from '../modals/OwnerManagerModal';

interface ProjectMasterViewProps {
  projects: Project[];
  tasks: Task[];
  issues: Issue[];
  settings: AppSettings;
  onAddProject: () => void;
  onEditProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
  onSelectProjectFilter: (projectId: string) => void;
  onUpdateSettings?: (newSettings: AppSettings) => void;
}

export const ProjectMasterView: React.FC<ProjectMasterViewProps> = ({
  projects,
  tasks,
  issues,
  settings,
  onAddProject,
  onEditProject,
  onDeleteProject,
  onSelectProjectFilter,
  onUpdateSettings = () => {}
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [copied, setCopied] = useState(false);
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [isOwnerModalOpen, setIsOwnerModalOpen] = useState(false);

  const enriched = enrichProjects(projects, tasks, issues);

  const filtered = enriched.filter(p => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (departmentFilter !== 'all' && p.department !== departmentFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return p.projectName.toLowerCase().includes(q) ||
             p.projectId.toLowerCase().includes(q) ||
             p.department.toLowerCase().includes(q) ||
             p.owner.toLowerCase().includes(q);
    }
    return true;
  });

  const handleCopyTSV = () => {
    const tsv = exportProjectsToTSV(enriched);
    navigator.clipboard.writeText(tsv);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
      {/* Top Banner & Actions */}
      <div className="bg-white p-5 rounded-2xl border border-sky-200/80 shadow-2xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-slate-800">
                  ชีต Project_Master (ทะเบียนโครงการหลัก)
                </h2>
                <span className="text-xs bg-sky-50 text-sky-700 font-semibold px-2 py-0.5 rounded-full border border-sky-200">
                  {projects.length} โครงการ
                </span>
              </div>
              <p className="text-xs text-slate-500">
                ข้อมูลโครงการหลัก รหัสอัตโนมัติ PRJ-xxx พร้อมปุ่มเพิ่ม-ลบหน่วยงานรับผิดชอบและผู้รับผิดชอบ
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            {/* Quick Manage Departments Button */}
            <button
              onClick={() => setIsDeptModalOpen(true)}
              className="px-3 py-2 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg flex items-center space-x-1.5 transition-colors shadow-2xs"
              title="เพิ่ม หรือ ลบ หน่วยงานรับผิดชอบในระบบ"
            >
              <Building2 className="w-3.5 h-3.5 text-sky-600" />
              <span>จัดการหน่วยงาน ({settings.departments.length})</span>
            </button>

            {/* Quick Manage Assignees Button */}
            <button
              onClick={() => setIsOwnerModalOpen(true)}
              className="px-3 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg flex items-center space-x-1.5 transition-colors shadow-2xs"
              title="เพิ่ม หรือ ลบ ผู้รับผิดชอบโครงการในระบบ"
            >
              <User className="w-3.5 h-3.5 text-emerald-600" />
              <span>จัดการผู้รับผิดชอบ ({settings.assignees.length})</span>
            </button>

            <button
              onClick={handleCopyTSV}
              className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center space-x-1.5 transition-colors border border-slate-200"
              title="คัดลอกตารางนี้ไปวางลง Google Sheets ได้ทันที (Ctrl+V)"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'คัดลอกแล้ว!' : 'คัดลอกไป Sheets'}</span>
            </button>

            <button
              onClick={onAddProject}
              className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg flex items-center space-x-1.5 shadow-xs shadow-sky-500/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>เพิ่มโครงการใหม่</span>
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="ค้นหาชื่อโครงการ, รหัส, หน่วยงาน..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg w-full bg-slate-50 focus:bg-white focus:ring-2 focus:ring-sky-400 focus:outline-hidden"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
            {/* Department Filter */}
            <div className="flex items-center space-x-1.5">
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Building2 className="w-3 h-3 text-sky-600" />
                หน่วยงาน:
              </span>
              <select
                value={departmentFilter}
                onChange={e => setDepartmentFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 text-slate-700 focus:ring-2 focus:ring-sky-400 focus:outline-hidden font-medium max-w-[180px] truncate"
              >
                <option value="all">ทุกหน่วยงาน</option>
                {settings.departments.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-1.5">
              <span className="text-xs text-slate-500">สถานะ:</span>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 text-slate-700 focus:ring-2 focus:ring-sky-400 focus:outline-hidden font-medium"
              >
                <option value="all">ทุกสถานะ</option>
                {settings.projectStatuses.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Sheet Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 border-collapse">
            {/* Sheet Header */}
            <thead>
              <tr className="bg-sky-50/70 text-slate-800 font-bold border-b border-sky-100 text-[11px] uppercase tracking-wider">
                <th className="py-3 px-3 w-20">Project_ID</th>
                <th className="py-3 px-4 min-w-[220px]">ชื่อโครงการ</th>
                <th className="py-3 px-3">หน่วยงาน</th>
                <th className="py-3 px-3">ผู้รับผิดชอบโครงการ</th>
                <th className="py-3 px-3">กำหนดการ</th>
                <th className="py-3 px-3 text-right">งบประมาณ</th>
                <th className="py-3 px-3 text-center">สถานะ</th>
                <th className="py-3 px-4 min-w-[140px]">ความคืบหน้า (%)</th>
                <th className="py-3 px-2 text-center">งานย่อย</th>
                <th className="py-3 px-2 text-center">ปัญหา</th>
                <th className="py-3 px-3 text-center w-20">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal">
              {filtered.map((p) => {
                const progress = p.progress ?? 0;
                const isDone = p.status === 'เสร็จสิ้น';
                const isDelayed = p.status === 'ล่าช้า';
                const isAtRisk = p.status === 'เสี่ยงล่าช้า';

                return (
                  <tr key={p.projectId} className="hover:bg-slate-50/80 transition-colors">
                    {/* ID */}
                    <td className="py-3 px-3 font-mono font-bold text-sky-700 bg-sky-50/20">
                      {p.projectId}
                    </td>

                    {/* Name & Desc */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{p.projectName}</div>
                      {p.description && (
                        <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                          {p.description}
                        </div>
                      )}
                    </td>

                    {/* Department */}
                    <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                      {p.department}
                    </td>

                    {/* Owner */}
                    <td className="py-3 px-3 text-slate-700 font-medium whitespace-nowrap">
                      {p.owner}
                    </td>

                    {/* Dates */}
                    <td className="py-3 px-3 whitespace-nowrap text-[11px]">
                      <div>เริ่ม: {formatDateThai(p.startDate)}</div>
                      <div className="text-slate-400">แผน: {formatDateThai(p.plannedEndDate)}</div>
                    </td>

                    {/* Budget */}
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-800 whitespace-nowrap">
                      {formatCurrency(p.budget).replace('THB', '฿')}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                        isDone ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                        isDelayed ? 'bg-orange-100 text-orange-800 border border-orange-200' :
                        isAtRisk ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                        p.status === 'กำลังดำเนินการ' ? 'bg-sky-100 text-sky-800 border border-sky-200' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {p.status}
                      </span>
                    </td>

                    {/* Progress bar */}
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 mb-1">
                        <span>{progress}%</span>
                        <span className="text-[10px] text-slate-400 font-normal">
                          {p.completedTasks}/{p.totalTasks} งาน
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            isDone ? 'bg-emerald-500' :
                            isDelayed ? 'bg-orange-500' :
                            isAtRisk ? 'bg-amber-500' :
                            'bg-sky-500'
                          }`}
                          style={{ width: `${Math.min(100, progress)}%` }}
                        />
                      </div>
                    </td>

                    {/* Tasks count */}
                    <td className="py-3 px-2 text-center font-bold text-slate-700">
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-xs">
                        {p.totalTasks}
                      </span>
                    </td>

                    {/* Issues count */}
                    <td className="py-3 px-2 text-center font-bold">
                      {(p.openIssues ?? 0) > 0 ? (
                        <span className="bg-rose-100 text-rose-700 px-2 py-0.5 rounded text-xs font-bold">
                          {p.openIssues}
                        </span>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          onClick={() => onEditProject(p)}
                          title="แก้ไขโครงการ"
                          className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteProject(p.projectId)}
                          title="ลบโครงการนี้"
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
                  <td colSpan={11} className="py-16 text-center text-xs">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
                        <FolderGit2 className="w-6 h-6" />
                      </div>
                      <div className="font-bold text-slate-700 text-sm">ยังไม่มีโครงการในระบบ หรือไม่พบตามตัวกรอง</div>
                      <p className="text-slate-400 max-w-sm">
                        คุณสามารถเพิ่มโครงการหลักใหม่เพื่อเริ่มต้นติดตามงานย่อยและปัญหาได้ทันที
                      </p>
                      <button
                        onClick={onAddProject}
                        className="mt-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl flex items-center space-x-1.5 shadow-sm transition-all"
                      >
                        <Plus className="w-4 h-4" />
                        <span>เพิ่มโครงการหลักใหม่</span>
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Managing Responsible Departments */}
      <DepartmentManagerModal
        isOpen={isDeptModalOpen}
        onClose={() => setIsDeptModalOpen(false)}
        settings={settings}
        projects={projects}
        onUpdateSettings={onUpdateSettings}
      />

      {/* Modal for Managing Project Owners */}
      <OwnerManagerModal
        isOpen={isOwnerModalOpen}
        onClose={() => setIsOwnerModalOpen(false)}
        settings={settings}
        projects={projects}
        tasks={tasks}
        onUpdateSettings={onUpdateSettings}
      />
    </div>
  );
};
