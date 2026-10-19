import React, { useState, useMemo } from 'react';
import { 
  Project, 
  Task, 
  Issue, 
  AppSettings,
  DashboardFilter 
} from '../../types';
import { 
  computeDashboardSummary, 
  formatCurrency, 
  formatDateThai,
  enrichTasks,
  enrichProjects,
  enrichIssues 
} from '../../utils/calculations';
import { 
  Wrench, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  AlertCircle,
  Percent, 
  TrendingUp, 
  DollarSign, 
  Filter, 
  ArrowUpRight,
  ShieldAlert,
  Calendar,
  Layers,
  ChevronRight,
  Plus,
  Edit3,
  Trash2,
  Building2,
  User,
  Activity,
  Check
} from 'lucide-react';

interface DashboardViewProps {
  projects: Project[];
  tasks: Task[];
  issues: Issue[];
  settings: AppSettings;
  onNavigateToTab: (tab: any) => void;
  onSelectProject?: (projectId: string) => void;
  onOpenProjectModal?: () => void;
  onEditProject?: (project: Project) => void;
  onDeleteProject?: (projectId: string) => void;
  onOpenTaskModal: () => void;
  onOpenIssueModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  projects,
  tasks,
  issues,
  settings,
  onNavigateToTab,
  onOpenProjectModal,
  onEditProject,
  onDeleteProject,
  onOpenTaskModal,
  onOpenIssueModal
}) => {
  // Filters
  const [filter, setFilter] = useState<DashboardFilter>({
    projectId: 'all',
    assignee: 'all',
    status: 'all',
    search: '',
    department: 'all'
  });

  // Filtered dataset
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      if (filter.projectId !== 'all' && p.projectId !== filter.projectId) return false;
      if (filter.assignee !== 'all' && p.owner !== filter.assignee) return false;
      if (filter.status !== 'all' && p.status !== filter.status) return false;
      if (filter.department && filter.department !== 'all' && p.department !== filter.department) return false;
      if (filter.search) {
        const q = filter.search.toLowerCase();
        return p.projectName.toLowerCase().includes(q) || 
               p.projectId.toLowerCase().includes(q) ||
               p.department.toLowerCase().includes(q) ||
               (p.owner && p.owner.toLowerCase().includes(q));
      }
      return true;
    });
  }, [projects, filter]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      if (filter.projectId !== 'all' && t.projectId !== filter.projectId) return false;
      if (filter.assignee !== 'all' && t.assignee !== filter.assignee) return false;
      if (filter.status !== 'all' && t.status !== filter.status) return false;
      if (filter.search) {
        const q = filter.search.toLowerCase();
        return t.taskName.toLowerCase().includes(q) || 
               t.taskId.toLowerCase().includes(q);
      }
      return true;
    });
  }, [tasks, filter]);

  const filteredIssues = useMemo(() => {
    return issues.filter(i => {
      if (filter.projectId !== 'all' && i.projectId !== filter.projectId) return false;
      if (filter.assignee !== 'all' && i.owner !== filter.assignee) return false;
      if (filter.search) {
        const q = filter.search.toLowerCase();
        return i.title.toLowerCase().includes(q) || 
               i.issueId.toLowerCase().includes(q);
      }
      return true;
    });
  }, [issues, filter]);

  const summary = useMemo(() => {
    return computeDashboardSummary(filteredProjects, filteredTasks, filteredIssues);
  }, [filteredProjects, filteredTasks, filteredIssues]);

  const enrichedP = useMemo(() => enrichProjects(filteredProjects, tasks, issues), [filteredProjects, tasks, issues]);
  const enrichedT = useMemo(() => enrichTasks(filteredTasks, projects), [filteredTasks, projects]);
  const enrichedI = useMemo(() => enrichIssues(filteredIssues, projects), [filteredIssues, projects]);

  // Upcoming repair tasks in 7 days
  const upcomingTasks = useMemo(() => {
    return enrichedT
      .filter(t => t.status !== 'เสร็จสิ้น' && (t.daysRemaining ?? 999) <= 7 && (t.daysOverdue ?? 0) === 0)
      .sort((a, b) => (a.daysRemaining ?? 0) - (b.daysRemaining ?? 0))
      .slice(0, 5);
  }, [enrichedT]);

  // Delayed / Overdue repair tasks
  const delayedTasksList = useMemo(() => {
    return enrichedT
      .filter(t => t.status !== 'เสร็จสิ้น' && (t.daysOverdue ?? 0) > 0)
      .sort((a, b) => (b.daysOverdue ?? 0) - (a.daysOverdue ?? 0))
      .slice(0, 5);
  }, [enrichedT]);

  // Critical / High severity repair issues
  const urgentIssuesList = useMemo(() => {
    return enrichedI
      .filter(i => i.status !== 'ปิดปัญหา' && (i.severity === 'วิกฤต' || i.severity === 'สูง'))
      .sort((a, b) => {
        if (a.severity === 'วิกฤต' && b.severity !== 'วิกฤต') return -1;
        if (b.severity === 'วิกฤต' && a.severity !== 'วิกฤต') return 1;
        return (b.daysPending ?? 0) - (a.daysPending ?? 0);
      })
      .slice(0, 5);
  }, [enrichedI]);

  // Status badge styling helper
  const getStatusBadge = (status: string) => {
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

  const isFiltered = filter.projectId !== 'all' || 
                     filter.assignee !== 'all' || 
                     filter.status !== 'all' || 
                     (filter.department && filter.department !== 'all') || 
                     filter.search !== '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
          
          <div className="flex items-center space-x-2 w-full lg:w-auto">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="text-xs font-semibold text-slate-700 whitespace-nowrap">ตัวกรอง:</span>
            <input
              type="text"
              placeholder="ค้นหาชื่องานซ่อม, รหัส REP, แผนก, หรือช่าง..."
              value={filter.search}
              onChange={e => setFilter({ ...filter, search: e.target.value })}
              className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg w-full lg:w-64 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            {/* Filter by Repair Job */}
            <select
              value={filter.projectId}
              onChange={e => setFilter({ ...filter, projectId: e.target.value })}
              className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-slate-50 text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-medium max-w-[180px] truncate"
            >
              <option value="all">ทุกงานซ่อม ({projects.length})</option>
              {projects.map(p => (
                <option key={p.projectId} value={p.projectId}>
                  {p.projectId} - {p.projectName}
                </option>
              ))}
            </select>

            {/* Filter by Department */}
            <select
              value={filter.department || 'all'}
              onChange={e => setFilter({ ...filter, department: e.target.value })}
              className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-slate-50 text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-hidden max-w-[170px] truncate"
            >
              <option value="all">ทุกแผนกช่าง</option>
              {settings.departments.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            {/* Filter by Status */}
            <select
              value={filter.status}
              onChange={e => setFilter({ ...filter, status: e.target.value })}
              className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-slate-50 text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            >
              <option value="all">ทุกสถานะ</option>
              {settings.projectStatuses.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            {/* Filter by Assignee */}
            <select
              value={filter.assignee}
              onChange={e => setFilter({ ...filter, assignee: e.target.value })}
              className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-slate-50 text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-hidden max-w-[150px] truncate"
            >
              <option value="all">ช่างทุกคน</option>
              {settings.assignees.map(a => (
                <option key={a} value={a}>{a.split(' ')[0]}</option>
              ))}
            </select>

            {isFiltered && (
              <button
                onClick={() => setFilter({ projectId: 'all', assignee: 'all', status: 'all', department: 'all', search: '' })}
                className="px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg font-medium transition-colors border border-rose-200"
              >
                ล้างตัวกรอง
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Row 1: Primary KPI Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <Activity className="w-4 h-4 text-blue-600" />
            <span>ตัวชี้วัดภาพรวมงานซ่อมบำรุง (Maintenance KPIs)</span>
          </h2>
          <span className="text-xs text-slate-400 font-medium">อัปเดตแบบเรียลไทม์</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          
          {/* Card 1: Total Repair Jobs */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between text-slate-600">
              <span className="text-xs font-medium">ใบแจ้งซ่อมทั้งหมด</span>
              <Wrench className="w-4 h-4 text-blue-600" />
            </div>
            <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-slate-900">
              {summary.totalProjects}
            </div>
            <div className="mt-1 text-[11px] text-slate-500 truncate">
              งบรวม {formatCurrency(summary.totalBudget).replace('THB', '฿')}
            </div>
          </div>

          {/* Card 2: In Progress */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between text-slate-600">
              <span className="text-xs font-medium">กำลังซ่อมแซม</span>
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
            <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-blue-600">
              {summary.inProgressProjects}
            </div>
            <div className="mt-1 text-[11px] text-slate-500">
              รอดำเนินการ: {summary.notStartedProjects} รายการ
            </div>
          </div>

          {/* Card 3: Completed */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between text-slate-600">
              <span className="text-xs font-medium">ซ่อมเสร็จสิ้น</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-emerald-600">
              {summary.completedProjects}
            </div>
            <div className="mt-1 text-[11px] text-slate-500 font-mono tabular-nums">
              ขั้นตอนเสร็จ {summary.completedTasks}/{summary.totalTasks}
            </div>
          </div>

          {/* Card 4: Overdue / At Risk */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between text-slate-600">
              <span className="text-xs font-medium">เสี่ยง / ล่าช้า</span>
              <AlertTriangle className="w-4 h-4 text-orange-600" />
            </div>
            <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-orange-600">
              {summary.delayedProjects + summary.atRiskProjects}
            </div>
            <div className="mt-1 text-[11px] text-slate-500 font-mono tabular-nums">
              ล่าช้า {summary.delayedProjects} · เสี่ยง {summary.atRiskProjects}
            </div>
          </div>

          {/* Card 5: Open Issues & Parts Waiting */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between text-slate-600">
              <span className="text-xs font-medium">ปัญหา/รออะไหล่</span>
              <AlertCircle className="w-4 h-4 text-rose-600" />
            </div>
            <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-rose-600">
              {summary.openIssues}
            </div>
            <div className="mt-1 text-[11px] text-slate-500 font-mono tabular-nums">
              วิกฤต: {summary.criticalIssues} · สูง: {summary.highIssues}
            </div>
          </div>

          {/* Card 6: Overall Completion Rate */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between text-slate-600">
              <span className="text-xs font-medium">ความคืบหน้ารวม</span>
              <Percent className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-slate-900">
              {summary.overallProgress}%
            </div>
            <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, summary.overallProgress)}%` }}
              />
            </div>
          </div>

        </div>
      </div>

      {/* Row 2: Secondary Quick Metric Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center space-x-3 px-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs font-mono tabular-nums">
            {summary.totalTasks}
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-800">ขั้นตอนการซ่อมทั้งหมด</div>
            <div className="text-[11px] text-slate-500 font-mono tabular-nums">เสร็จ {summary.completedTasks} · กำลังทำ {summary.inProgressTasks}</div>
          </div>
        </div>

        <div className="flex items-center space-x-3 px-2 border-l border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-700 flex items-center justify-center font-bold text-xs font-mono tabular-nums">
            {summary.delayedTasks}
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-800">ขั้นตอนที่เลยกำหนด</div>
            <div className="text-[11px] text-orange-600">ต้องเร่งดำเนินการ</div>
          </div>
        </div>

        <div className="flex items-center space-x-3 px-2 border-l border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center font-bold text-xs font-mono tabular-nums">
            {summary.projectsWithIssues}
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-800">งานซ่อมที่ติดปัญหา</div>
            <div className="text-[11px] text-slate-500">จากทั้งหมด {summary.totalProjects} รายการ</div>
          </div>
        </div>

        <div className="flex items-center space-x-3 px-2 border-l border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs font-mono tabular-nums">
            {summary.resolvedIssues}
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-800">ปัญหาที่แก้ไขเสร็จแล้ว</div>
            <div className="text-[11px] text-emerald-600 font-mono tabular-nums">ปิดไปแล้ว {summary.resolvedIssues} จุด</div>
          </div>
        </div>
      </div>

      {/* Row 3: Progress by Repair Job & Operational Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Progress List */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span>ความคืบหน้าของแต่ละใบแจ้งซ่อม (% Progress)</span>
              </h3>
              <p className="text-xs text-slate-500">คำนวณจากน้ำหนักงานและขั้นตอนการซ่อมจริง</p>
            </div>
            <div className="flex items-center space-x-2">
              {onOpenProjectModal && (
                <button
                  onClick={onOpenProjectModal}
                  className="px-2.5 py-1 text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-lg flex items-center space-x-1 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ เปิดใบแจ้งซ่อม</span>
                </button>
              )}
              <button
                onClick={() => onNavigateToTab('projects')}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center ml-2"
              >
                ดูทั้งหมด <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </button>
            </div>
          </div>

          <div className="space-y-3.5">
            {enrichedP.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                ไม่พบข้อมูลใบงานซ่อมตามเงื่อนไขตัวกรอง
              </div>
            ) : (
              enrichedP.map((job) => {
                const progress = job.progress ?? 0;
                const isDone = job.status === 'เสร็จสิ้น';
                const isDelayed = job.status === 'ล่าช้า';
                const isAtRisk = job.status === 'เสี่ยงล่าช้า';

                const barColor = isDone 
                  ? 'bg-emerald-500' 
                  : isDelayed 
                  ? 'bg-rose-500' 
                  : isAtRisk 
                  ? 'bg-orange-500' 
                  : 'bg-blue-600';

                return (
                  <div 
                    key={job.projectId} 
                    className="p-3.5 rounded-lg border border-slate-100 hover:border-slate-300 hover:bg-slate-50/50 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded">
                          {job.projectId}
                        </span>
                        <span className="text-xs font-semibold text-slate-800 line-clamp-1">
                          {job.projectName}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 shrink-0">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${getStatusBadge(job.status)}`}>
                          {job.status}
                        </span>
                        <span className="font-mono text-xs font-bold tabular-nums text-slate-800 min-w-[36px] text-right">
                          {progress}%
                        </span>
                        {onEditProject && (
                          <button
                            onClick={() => onEditProject(job)}
                            className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-200 transition-colors"
                            title="แก้ไขใบงานซ่อม"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {onDeleteProject && (
                          <button
                            onClick={() => onDeleteProject(job.projectId)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors"
                            title="ลบใบงานซ่อม"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Progress Track */}
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${barColor}`}
                        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                      />
                    </div>

                    {/* Unboxed Metadata */}
                    <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-500">
                      <span className="text-slate-600">{job.department}</span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span>ช่าง: {job.owner.split(' ')[0]}</span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span>กำหนด: {formatDateThai(job.plannedEndDate)}</span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span>ขั้นตอน {job.completedTasks ?? 0}/{job.totalTasks ?? 0}</span>
                      {job.openIssues && job.openIssues > 0 ? (
                        <>
                          <span aria-hidden="true" className="text-slate-300">·</span>
                          <span className="text-rose-600 font-medium">รออะไหล่/ปัญหา {job.openIssues} จุด</span>
                        </>
                      ) : null}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Quick Operations Sidebar */}
        <div className="space-y-5">
          
          {/* Urgent Issues & Parts Widget */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>อาการเสียเร่งด่วน / รออะไหล่</span>
              </h3>
              <button
                onClick={() => onNavigateToTab('issues')}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                ดูทั้งหมด ({issues.filter(i => i.status !== 'ปิดปัญหา').length})
              </button>
            </div>

            <div className="space-y-2.5">
              {urgentIssuesList.length === 0 ? (
                <div className="py-6 text-center text-slate-400 text-xs">
                  ไม่มีปัญหาอาการเสียวิกฤตค้างอยู่
                </div>
              ) : (
                urgentIssuesList.map(issue => (
                  <div key={issue.issueId} className="p-2.5 rounded-lg border border-rose-100 bg-rose-50/30">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-mono text-[11px] font-bold text-rose-700 bg-rose-100/80 px-1.5 py-0.2 rounded">
                        {issue.issueId}
                      </span>
                      <span className="text-[11px] font-semibold text-rose-600 bg-white px-1.5 py-0.5 rounded border border-rose-200">
                        {issue.severity}
                      </span>
                    </div>
                    <div className="mt-1 text-xs font-semibold text-slate-800 line-clamp-1">
                      {issue.title}
                    </div>
                    <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
                      <span>รหัสงาน: {issue.projectId}</span>
                      <span>ค้าง {issue.daysPending ?? 0} วัน</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={onOpenIssueModal}
              className="mt-3 w-full py-1.5 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg flex items-center justify-center space-x-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ บันทึกปัญหา / แจ้งขออะไหล่</span>
            </button>
          </div>

          {/* Overdue / Upcoming Steps Widget */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-orange-600" />
                <span>ขั้นตอนที่ต้องเร่งดำเนินการ</span>
              </h3>
              <button
                onClick={() => onNavigateToTab('tasks')}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                ดูทั้งหมด ({tasks.length})
              </button>
            </div>

            <div className="space-y-2.5">
              {delayedTasksList.length === 0 && upcomingTasks.length === 0 ? (
                <div className="py-6 text-center text-slate-400 text-xs">
                  ทุกขั้นตอนดำเนินการตามกำหนดเวลา
                </div>
              ) : (
                [...delayedTasksList, ...upcomingTasks].slice(0, 4).map(task => {
                  const isOverdue = (task.daysOverdue ?? 0) > 0;
                  return (
                    <div 
                      key={task.taskId} 
                      className={`p-2.5 rounded-lg border ${
                        isOverdue ? 'border-orange-200 bg-orange-50/30' : 'border-slate-200 bg-slate-50/40'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[11px] font-semibold text-slate-700">
                          {task.taskId} · {task.projectId}
                        </span>
                        {isOverdue ? (
                          <span className="text-[11px] font-bold text-rose-600">
                            ล่าช้า {task.daysOverdue} วัน
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-500 font-mono">
                            เหลือ {task.daysRemaining} วัน
                          </span>
                        )}
                      </div>
                      <div className="mt-1 text-xs font-medium text-slate-800 line-clamp-1">
                        {task.taskName}
                      </div>
                      <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
                        <span>ช่าง: {task.assignee.split(' ')[0]}</span>
                        <span className="font-mono font-semibold">{task.progress}%</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <button
              onClick={onOpenTaskModal}
              className="mt-3 w-full py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg flex items-center justify-center space-x-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ เพิ่มขั้นตอนงานซ่อม</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
