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
  Wrench, 
  Building2, 
  User, 
  Calendar, 
  DollarSign,
  Layers,
  AlertCircle,
  ExternalLink,
  ClipboardList
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
             (p.owner && p.owner.toLowerCase().includes(q));
    }
    return true;
  });

  const handleCopyTSV = () => {
    const tsv = exportProjectsToTSV(enriched);
    navigator.clipboard.writeText(tsv);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'เสร็จสิ้น':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'กำลังดำเนินการ':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'รอดำเนินการ':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'เสี่ยงล่าช้า':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'ล่าช้า':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
      
      {/* Top Banner & Control Center */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <ClipboardList className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-slate-900">
                  ทะเบียนใบงานซ่อม (Repair Orders Master)
                </h2>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-mono tabular-nums">
                  {projects.length} งาน
                </span>
              </div>
              <p className="text-xs text-slate-500">
                รายการใบแจ้งซ่อมหลัก รหัสอัตโนมัติ REP-xxx พร้อมระบบจัดการแผนกช่างและช่างผู้รับผิดชอบ
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            {/* Quick Manage Departments Button */}
            <button
              onClick={() => setIsDeptModalOpen(true)}
              className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg flex items-center space-x-1.5 transition-colors shadow-2xs"
              title="เพิ่ม หรือ ลบ แผนกช่าง/หน่วยงานรับผิดชอบในระบบ"
            >
              <Building2 className="w-3.5 h-3.5 text-blue-600" />
              <span>จัดการแผนกช่าง ({settings.departments.length})</span>
            </button>

            {/* Quick Manage Technicians Button */}
            <button
              onClick={() => setIsOwnerModalOpen(true)}
              className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg flex items-center space-x-1.5 transition-colors shadow-2xs"
              title="เพิ่ม หรือ ลบ ช่างผู้รับผิดชอบงานซ่อมในระบบ"
            >
              <User className="w-3.5 h-3.5 text-emerald-600" />
              <span>จัดการช่าง ({settings.assignees.length})</span>
            </button>

            <button
              onClick={handleCopyTSV}
              className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg flex items-center space-x-1.5 transition-colors border border-slate-200"
              title="คัดลอกตารางนี้ไปวางลง Google Sheets ได้ทันที"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copied ? 'คัดลอกแล้ว!' : 'คัดลอกไป Sheets'}</span>
            </button>

            <button
              onClick={onAddProject}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center space-x-1.5 shadow-xs transition-all active:scale-98"
            >
              <Plus className="w-4 h-4" />
              <span>+ เปิดใบแจ้งซ่อมใหม่</span>
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="ค้นหาชื่องานซ่อม, รหัส REP, แผนก, หรือช่าง..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg w-full bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
            {/* Department Filter */}
            <div className="flex items-center space-x-1.5">
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Building2 className="w-3 h-3 text-slate-400" />
                แผนกช่าง:
              </span>
              <select
                value={departmentFilter}
                onChange={e => setDepartmentFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-medium max-w-[180px] truncate"
              >
                <option value="all">ทุกแผนกช่าง</option>
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
                className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-medium"
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
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                <th className="py-3 px-3 w-24">รหัสงานซ่อม</th>
                <th className="py-3 px-4 min-w-[240px]">ชื่องานซ่อมและอาการเสีย</th>
                <th className="py-3 px-3">แผนกช่างรับผิดชอบ</th>
                <th className="py-3 px-3">ช่างผู้รับผิดชอบ</th>
                <th className="py-3 px-3">กำหนดการ</th>
                <th className="py-3 px-3 text-right">งบประมาณซ่อม</th>
                <th className="py-3 px-3 text-center">สถานะ</th>
                <th className="py-3 px-4 min-w-[140px]">ความคืบหน้า (%)</th>
                <th className="py-3 px-2 text-center">ขั้นตอน</th>
                <th className="py-3 px-2 text-center">ปัญหา</th>
                <th className="py-3 px-3 text-center w-28">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal">
              {filtered.map((p) => {
                const progress = p.progress ?? 0;
                const isDone = p.status === 'เสร็จสิ้น';
                const isDelayed = p.status === 'ล่าช้า';
                const isAtRisk = p.status === 'เสี่ยงล่าช้า';

                return (
                  <tr key={p.projectId} className="hover:bg-slate-50/70 transition-colors">
                    {/* ID */}
                    <td className="py-3.5 px-3 font-mono font-bold text-blue-700 bg-blue-50/30 whitespace-nowrap">
                      {p.projectId}
                    </td>

                    {/* Name & Desc */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{p.projectName}</div>
                      {p.description && (
                        <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                          {p.description}
                        </div>
                      )}
                    </td>

                    {/* Department */}
                    <td className="py-3.5 px-3 text-slate-600 whitespace-nowrap">
                      {p.department}
                    </td>

                    {/* Owner */}
                    <td className="py-3.5 px-3 text-slate-800 font-medium whitespace-nowrap">
                      {p.owner}
                    </td>

                    {/* Dates */}
                    <td className="py-3.5 px-3 whitespace-nowrap text-[11px] font-mono tabular-nums">
                      <div>เริ่ม: {formatDateThai(p.startDate)}</div>
                      <div className="text-slate-400">กำหนด: {formatDateThai(p.plannedEndDate)}</div>
                    </td>

                    {/* Budget */}
                    <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-800 whitespace-nowrap tabular-nums">
                      {formatCurrency(p.budget).replace('THB', '฿')}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-3 text-center whitespace-nowrap">
                      <span className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-medium border ${getStatusStyle(p.status)}`}>
                        {p.status}
                      </span>
                    </td>

                    {/* Progress bar */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 mb-1">
                        <span className="font-mono tabular-nums">{progress}%</span>
                        <span className="text-[10px] text-slate-400 font-normal font-mono tabular-nums">
                          {p.completedTasks}/{p.totalTasks} ขั้นตอน
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-1.5 rounded-full transition-all duration-500 ${
                            isDone ? 'bg-emerald-500' :
                            isDelayed ? 'bg-rose-500' :
                            isAtRisk ? 'bg-orange-500' :
                            'bg-blue-600'
                          }`}
                          style={{ width: `${Math.min(100, progress)}%` }}
                        />
                      </div>
                    </td>

                    {/* Tasks count */}
                    <td className="py-3.5 px-2 text-center font-bold text-slate-700">
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-mono tabular-nums">
                        {p.totalTasks}
                      </span>
                    </td>

                    {/* Issues count */}
                    <td className="py-3.5 px-2 text-center font-bold">
                      {(p.openIssues ?? 0) > 0 ? (
                        <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded text-xs font-mono font-bold tabular-nums">
                          {p.openIssues}
                        </span>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>

                    {/* Actions: Explicit Edit and Delete */}
                    <td className="py-3.5 px-3 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center space-x-1.5">
                        <button
                          onClick={() => onEditProject(p)}
                          title="แก้ไขใบงานซ่อม"
                          className="px-2 py-1 text-slate-600 hover:text-blue-700 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded text-xs flex items-center space-x-1 transition-colors"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>แก้ไข</span>
                        </button>
                        <button
                          onClick={() => onDeleteProject(p.projectId)}
                          title="ลบใบงานซ่อมนี้"
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
                        <Wrench className="w-6 h-6" />
                      </div>
                      <div className="font-bold text-slate-800 text-sm">ยังไม่มีรายการงานซ่อมในระบบ หรือไม่พบตามตัวกรอง</div>
                      <p className="text-slate-500 max-w-sm">
                        คุณสามารถเปิดใบแจ้งซ่อมใหม่เพื่อเริ่มต้นบันทึกขั้นตอนการซ่อมและติดตามสถานะได้ทันที
                      </p>
                      <button
                        onClick={onAddProject}
                        className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center space-x-1.5 shadow-xs transition-all"
                      >
                        <Plus className="w-4 h-4" />
                        <span>+ เปิดใบแจ้งซ่อมใหม่</span>
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
