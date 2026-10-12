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
  FolderKanban, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Flame, 
  Percent, 
  TrendingUp, 
  DollarSign, 
  Filter, 
  ArrowUpRight,
  ShieldAlert,
  Calendar,
  Layers,
  ChevronRight
} from 'lucide-react';

interface DashboardViewProps {
  projects: Project[];
  tasks: Task[];
  issues: Issue[];
  settings: AppSettings;
  onNavigateToTab: (tab: any) => void;
  onSelectProject?: (projectId: string) => void;
  onOpenTaskModal: () => void;
  onOpenIssueModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  projects,
  tasks,
  issues,
  settings,
  onNavigateToTab,
  onSelectProject,
  onOpenTaskModal,
  onOpenIssueModal
}) => {
  // Filters
  const [filter, setFilter] = useState<DashboardFilter>({
    projectId: 'all',
    assignee: 'all',
    status: 'all',
    search: ''
  });

  // Filtered dataset
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      if (filter.projectId !== 'all' && p.projectId !== filter.projectId) return false;
      if (filter.assignee !== 'all' && p.owner !== filter.assignee) return false;
      if (filter.status !== 'all' && p.status !== filter.status) return false;
      if (filter.search) {
        const q = filter.search.toLowerCase();
        return p.projectName.toLowerCase().includes(q) || 
               p.projectId.toLowerCase().includes(q) ||
               p.department.toLowerCase().includes(q);
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

  // Upcoming tasks in 7 days
  const upcomingTasks = useMemo(() => {
    return enrichedT
      .filter(t => t.status !== 'เสร็จสิ้น' && (t.daysRemaining ?? 999) <= 7 && (t.daysOverdue ?? 0) === 0)
      .sort((a, b) => (a.daysRemaining ?? 0) - (b.daysRemaining ?? 0))
      .slice(0, 5);
  }, [enrichedT]);

  // Delayed tasks (Overdue)
  const delayedTasksList = useMemo(() => {
    return enrichedT
      .filter(t => t.status !== 'เสร็จสิ้น' && (t.daysOverdue ?? 0) > 0)
      .sort((a, b) => (b.daysOverdue ?? 0) - (a.daysOverdue ?? 0))
      .slice(0, 5);
  }, [enrichedT]);

  // Urgent Issues (Critical / High & not closed)
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

  // Project status distribution for donut chart
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      'กำลังดำเนินการ': 0,
      'เสร็จสิ้น': 0,
      'เสี่ยงล่าช้า': 0,
      'ล่าช้า': 0,
      'ยังไม่เริ่ม': 0,
      'รอดำเนินการ': 0
    };
    enrichedP.forEach(p => {
      counts[p.status] = (counts[p.status] || 0) + 1;
    });
    return counts;
  }, [enrichedP]);

  // Issue severity distribution
  const severityCounts = useMemo(() => {
    const counts: Record<string, number> = {
      'วิกฤต': 0,
      'สูง': 0,
      'ปานกลาง': 0,
      'ต่ำ': 0
    };
    filteredIssues.forEach(i => {
      if (i.status !== 'ปิดปัญหา') {
        counts[i.severity] = (counts[i.severity] || 0) + 1;
      }
    });
    return counts;
  }, [filteredIssues]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-semibold text-slate-700 whitespace-nowrap">ตัวกรองแดชบอร์ด:</span>
            <input
              type="text"
              placeholder="ค้นหาชื่อโครงการ, งาน, รหัส..."
              value={filter.search}
              onChange={e => setFilter({ ...filter, search: e.target.value })}
              className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg w-full md:w-56 focus:ring-2 focus:ring-sky-400 focus:outline-hidden"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Filter by Project */}
            <select
              value={filter.projectId}
              onChange={e => setFilter({ ...filter, projectId: e.target.value })}
              className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-slate-50 text-slate-700 focus:ring-2 focus:ring-sky-400 focus:outline-hidden font-medium"
            >
              <option value="all">ทุกโครงการ ({projects.length})</option>
              {projects.map(p => (
                <option key={p.projectId} value={p.projectId}>
                  {p.projectId} - {p.projectName.length > 25 ? p.projectName.substring(0, 25) + '...' : p.projectName}
                </option>
              ))}
            </select>

            {/* Filter by Status */}
            <select
              value={filter.status}
              onChange={e => setFilter({ ...filter, status: e.target.value })}
              className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-slate-50 text-slate-700 focus:ring-2 focus:ring-sky-400 focus:outline-hidden"
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
              className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-slate-50 text-slate-700 focus:ring-2 focus:ring-sky-400 focus:outline-hidden"
            >
              <option value="all">ทุกคน</option>
              {settings.assignees.map(a => (
                <option key={a} value={a}>{a.split(' ')[0]}</option>
              ))}
            </select>

            {(filter.projectId !== 'all' || filter.assignee !== 'all' || filter.status !== 'all' || filter.search) && (
              <button
                onClick={() => setFilter({ projectId: 'all', assignee: 'all', status: 'all', search: '' })}
                className="px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg font-medium transition-colors"
              >
                ล้างตัวกรอง
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Row 1: Primary KPI Pastel Metric Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-800 flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" />
            <span>ภาพรวมโครงการและตัวชี้วัดหลัก (KPI Metrics)</span>
          </h2>
          <span className="text-xs text-slate-400">อัปเดตอัตโนมัติ Real-time</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Card 1: Total Projects (Purple pastel) */}
          <div className="bg-[#FAF5FF] border border-[#E9D5FF] rounded-2xl p-4 shadow-2xs">
            <div className="flex items-center justify-between text-[#7E22CE]">
              <span className="text-xs font-semibold">โครงการทั้งหมด</span>
              <FolderKanban className="w-4 h-4" />
            </div>
            <div className="mt-2 text-2xl font-black text-[#581C87]">
              {summary.totalProjects}
            </div>
            <div className="mt-1 text-[11px] text-[#9333EA] flex items-center justify-between">
              <span>งบรวม {formatCurrency(summary.totalBudget).replace('THB', '฿')}</span>
            </div>
          </div>

          {/* Card 2: In Progress (Sky blue pastel) */}
          <div className="bg-[#F0F9FF] border border-[#BAE6FD] rounded-2xl p-4 shadow-2xs">
            <div className="flex items-center justify-between text-[#0369A1]">
              <span className="text-xs font-semibold">กำลังดำเนินการ</span>
              <Clock className="w-4 h-4" />
            </div>
            <div className="mt-2 text-2xl font-black text-[#075985]">
              {summary.inProgressProjects}
            </div>
            <div className="mt-1 text-[11px] text-[#0284C7]">
              ยังไม่เริ่ม: {summary.notStartedProjects} โครงการ
            </div>
          </div>

          {/* Card 3: Completed (Mint green pastel) */}
          <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-2xl p-4 shadow-2xs">
            <div className="flex items-center justify-between text-[#15803D]">
              <span className="text-xs font-semibold">เสร็จสิ้นแล้ว</span>
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="mt-2 text-2xl font-black text-[#166534]">
              {summary.completedProjects}
            </div>
            <div className="mt-1 text-[11px] text-[#16A34A]">
              งานย่อยเสร็จ: {summary.completedTasks}/{summary.totalTasks}
            </div>
          </div>

          {/* Card 4: Delayed / Risk (Peach orange pastel) */}
          <div className="bg-[#FFF7ED] border border-[#FED7AA] rounded-2xl p-4 shadow-2xs">
            <div className="flex items-center justify-between text-[#C2410C]">
              <span className="text-xs font-semibold">ล่าช้า / เสี่ยงล่าช้า</span>
              <Flame className="w-4 h-4" />
            </div>
            <div className="mt-2 text-2xl font-black text-[#9A3412]">
              {summary.delayedProjects + summary.atRiskProjects}
            </div>
            <div className="mt-1 text-[11px] text-[#EA580C]">
              ล่าช้า {summary.delayedProjects} | เสี่ยง {summary.atRiskProjects}
            </div>
          </div>

          {/* Card 5: Unresolved Issues (Rose pink pastel) */}
          <div className="bg-[#FFF1F2] border border-[#FECDD3] rounded-2xl p-4 shadow-2xs">
            <div className="flex items-center justify-between text-[#BE185D]">
              <span className="text-xs font-semibold">ปัญหาค้าง (ยังไม่ปิด)</span>
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div className="mt-2 text-2xl font-black text-[#9F1239]">
              {summary.openIssues}
            </div>
            <div className="mt-1 text-[11px] text-[#E11D48]">
              วิกฤต: {summary.criticalIssues} | สูง: {summary.highIssues}
            </div>
          </div>

          {/* Card 6: Overall Progress (Soft Lavender) */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl p-4 shadow-2xs">
            <div className="flex items-center justify-between text-purple-700">
              <span className="text-xs font-semibold">ความคืบหน้ารวม</span>
              <Percent className="w-4 h-4" />
            </div>
            <div className="mt-2 text-2xl font-black text-purple-900">
              {summary.overallProgress}%
            </div>
            <div className="mt-2 w-full bg-purple-200/60 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-purple-600 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, summary.overallProgress)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Secondary Metric Bar (Tasks & Issues count details) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center space-x-3 px-2">
          <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center font-bold text-xs">
            {summary.totalTasks}
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">จำนวนงานย่อยทั้งหมด</div>
            <div className="text-[11px] text-slate-500">เสร็จ {summary.completedTasks} | ทำอยู่ {summary.inProgressTasks}</div>
          </div>
        </div>

        <div className="flex items-center space-x-3 px-2 border-l border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
            {summary.delayedTasks}
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">งานย่อยที่ล่าช้า (Overdue)</div>
            <div className="text-[11px] text-rose-500">เลยกำหนดส่งมอบแล้ว</div>
          </div>
        </div>

        <div className="flex items-center space-x-3 px-2 border-l border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">
            {summary.projectsWithIssues}
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">โครงการที่มีปัญหา</div>
            <div className="text-[11px] text-slate-500">จากทั้งหมด {summary.totalProjects} โครงการ</div>
          </div>
        </div>

        <div className="flex items-center space-x-3 px-2 border-l border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
            {summary.resolvedIssues}
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">ปัญหาที่แก้ไข/ปิดแล้ว</div>
            <div className="text-[11px] text-emerald-600">ปิดสำเร็จ {summary.resolvedIssues} รายการ</div>
          </div>
        </div>
      </div>

      {/* Row 3: Charts Section (Visual Data Visualization) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Chart 1: Project Progress Bars */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-1.5">
                <TrendingUp className="w-4 h-4 text-sky-600" />
                <span>กราฟแสดงความคืบหน้าของแต่ละโครงการ (% Progress)</span>
              </h3>
              <p className="text-xs text-slate-400">คำนวณจากน้ำหนักงานจริงใน Task_Tracking</p>
            </div>
            <button
              onClick={() => onNavigateToTab('projects')}
              className="text-xs text-sky-600 hover:text-sky-700 font-medium flex items-center"
            >
              ดูทั้งหมด <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>

          <div className="space-y-4">
            {enrichedP.map((project) => {
              const progress = project.progress ?? 0;
              const isDone = project.status === 'เสร็จสิ้น';
              const isDelayed = project.status === 'ล่าช้า';
              const isAtRisk = project.status === 'เสี่ยงล่าช้า';

              const barColor = isDone 
                ? 'bg-emerald-500' 
                : isDelayed 
                ? 'bg-orange-500' 
                : isAtRisk 
                ? 'bg-amber-500' 
                : 'bg-sky-500';

              return (
                <div key={project.projectId} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                        {project.projectId}
                      </span>
                      <span className="font-semibold text-slate-800 truncate max-w-[200px] sm:max-w-xs">
                        {project.projectName}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        isDone ? 'bg-emerald-100 text-emerald-800' :
                        isDelayed ? 'bg-orange-100 text-orange-800' :
                        isAtRisk ? 'bg-amber-100 text-amber-800' :
                        'bg-sky-100 text-sky-800'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    <div className="font-bold text-slate-700 font-mono">
                      {progress}%
                    </div>
                  </div>

                  {/* Progress Bar Container */}
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-2.5 rounded-full transition-all duration-700 ${barColor}`}
                      style={{ width: `${Math.min(100, progress)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                    <span>งาน: {project.completedTasks}/{project.totalTasks} งานย่อย</span>
                    <span>งบ: {formatCurrency(project.budget).replace('THB', '฿')}</span>
                    <span>สิ้นสุด: {formatDateThai(project.plannedEndDate)}</span>
                  </div>
                </div>
              );
            })}

            {enrichedP.length === 0 && (
              <div className="text-center py-8 text-xs text-slate-400">
                ไม่พบโครงการที่ตรงกับเงื่อนไขการค้นหา
              </div>
            )}
          </div>
        </div>

        {/* Chart 2: Project Status Distribution (Donut Breakdown) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800 mb-1 flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block" />
              <span>สัดส่วนสถานะโครงการ</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">สถานะโครงการทั้งหมด {summary.totalProjects} โครงการ</p>

            {/* Donut representation */}
            <div className="flex items-center justify-center my-3">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  {/* Background Circle */}
                  <circle
                    cx="18"
                    cy="18"
                    r="15.91549430918954"
                    fill="transparent"
                    stroke="#F1F5F9"
                    strokeWidth="3.8"
                  />
                  {/* Progress segment */}
                  <circle
                    cx="18"
                    cy="18"
                    r="15.91549430918954"
                    fill="transparent"
                    stroke="#38BDF8"
                    strokeWidth="3.8"
                    strokeDasharray={`${(summary.inProgressProjects / Math.max(1, summary.totalProjects)) * 100} 100`}
                    strokeDashoffset="0"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="15.91549430918954"
                    fill="transparent"
                    stroke="#4ADE80"
                    strokeWidth="3.8"
                    strokeDasharray={`${(summary.completedProjects / Math.max(1, summary.totalProjects)) * 100} 100`}
                    strokeDashoffset={`${-((summary.inProgressProjects / Math.max(1, summary.totalProjects)) * 100)}`}
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="15.91549430918954"
                    fill="transparent"
                    stroke="#FB923C"
                    strokeWidth="3.8"
                    strokeDasharray={`${((summary.delayedProjects + summary.atRiskProjects) / Math.max(1, summary.totalProjects)) * 100} 100`}
                    strokeDashoffset={`${-(((summary.inProgressProjects + summary.completedProjects) / Math.max(1, summary.totalProjects)) * 100)}`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xl font-black text-slate-800">{summary.totalProjects}</span>
                  <span className="text-[10px] text-slate-400 font-medium">โครงการ</span>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-2 mt-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-1.5 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                  <span>กำลังดำเนินการ</span>
                </span>
                <span className="font-bold text-slate-800">{summary.inProgressProjects} โครงการ</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-1.5 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span>เสร็จสิ้น</span>
                </span>
                <span className="font-bold text-slate-800">{summary.completedProjects} โครงการ</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-1.5 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span>เสี่ยงล่าช้า</span>
                </span>
                <span className="font-bold text-slate-800">{summary.atRiskProjects} โครงการ</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-1.5 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-400" />
                  <span>ล่าช้า</span>
                </span>
                <span className="font-bold text-slate-800">{summary.delayedProjects} โครงการ</span>
              </div>
            </div>
          </div>

          {/* Issue Severity Breakdown mini card */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="text-xs font-semibold text-slate-700 mb-2 flex items-center justify-between">
              <span>ปัญหาแยกตามระดับความรุนแรง (ค้าง)</span>
              <span className="text-[11px] text-rose-500 font-bold">{summary.openIssues} ข้อ</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5 text-center text-[10px]">
              <div className="bg-rose-50 border border-rose-200 rounded-lg p-1.5 text-rose-800">
                <div className="font-bold text-xs">{severityCounts['วิกฤต']}</div>
                <div>วิกฤต</div>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-1.5 text-orange-800">
                <div className="font-bold text-xs">{severityCounts['สูง']}</div>
                <div>สูง</div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-1.5 text-amber-800">
                <div className="font-bold text-xs">{severityCounts['ปานกลาง']}</div>
                <div>ปานกลาง</div>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-1.5 text-emerald-800">
                <div className="font-bold text-xs">{severityCounts['ต่ำ']}</div>
                <div>ต่ำ</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 4: Alert Tables (Early Warning & Overdue Monitoring) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Table 1: Overdue Tasks (🚨 งานล่าช้าที่ต้องเร่งรัด) */}
        <div className="bg-white rounded-2xl border border-orange-200 shadow-2xs overflow-hidden">
          <div className="bg-orange-50/70 px-4 py-3 border-b border-orange-100 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-orange-800">
              <Flame className="w-4 h-4 text-orange-600" />
              <h4 className="text-xs font-bold">ตารางงานที่ล่าช้า (Overdue Tasks)</h4>
            </div>
            <span className="text-[10px] bg-orange-200 text-orange-900 font-bold px-2 py-0.5 rounded-full">
              {delayedTasksList.length} งาน
            </span>
          </div>

          <div className="p-3 divide-y divide-slate-100 text-xs">
            {delayedTasksList.map(task => (
              <div key={task.taskId} className="py-2.5 first:pt-1 last:pb-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center space-x-1.5">
                      <span className="font-mono text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-semibold">
                        {task.projectId}
                      </span>
                      <span className="font-medium text-slate-800 line-clamp-1">{task.taskName}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      ผู้รับผิดชอบ: {task.assignee.split(' ')[0]} | ครบกำหนด: {formatDateThai(task.dueDate)}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block bg-orange-100 text-orange-800 font-bold px-2 py-0.5 rounded text-[11px] whitespace-nowrap">
                      ล่าช้า {task.daysOverdue} วัน
                    </span>
                    <div className="text-[10px] text-slate-400 mt-0.5">{task.progress}%</div>
                  </div>
                </div>
              </div>
            ))}

            {delayedTasksList.length === 0 && (
              <div className="py-6 text-center text-xs text-emerald-600 font-medium">
                ✅ ยอดเยี่ยม! ไม่มีงานย่อยที่เลยกำหนดส่งมอบ
              </div>
            )}
          </div>
        </div>

        {/* Table 2: Near Deadline (⏰ งานใกล้ครบกำหนด 7 วัน) */}
        <div className="bg-white rounded-2xl border border-amber-200 shadow-2xs overflow-hidden">
          <div className="bg-amber-50/70 px-4 py-3 border-b border-amber-100 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-amber-800">
              <Clock className="w-4 h-4 text-amber-600" />
              <h4 className="text-xs font-bold">ตารางงานใกล้ครบกำหนดใน 7 วัน</h4>
            </div>
            <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded-full">
              {upcomingTasks.length} งาน
            </span>
          </div>

          <div className="p-3 divide-y divide-slate-100 text-xs">
            {upcomingTasks.map(task => (
              <div key={task.taskId} className="py-2.5 first:pt-1 last:pb-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center space-x-1.5">
                      <span className="font-mono text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-semibold">
                        {task.projectId}
                      </span>
                      <span className="font-medium text-slate-800 line-clamp-1">{task.taskName}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      ผู้รับผิดชอบ: {task.assignee.split(' ')[0]} | ส่งมอบ: {formatDateThai(task.dueDate)}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded text-[11px] whitespace-nowrap">
                      เหลือ {task.daysRemaining} วัน
                    </span>
                    <div className="text-[10px] text-slate-400 mt-0.5">{task.progress}%</div>
                  </div>
                </div>
              </div>
            ))}

            {upcomingTasks.length === 0 && (
              <div className="py-6 text-center text-xs text-slate-400">
                ไม่มีงานย่อยที่ครบกำหนดภายใน 7 วันนี้
              </div>
            )}
          </div>
        </div>

        {/* Table 3: Urgent Issues (⚠️ ปัญหาเร่งด่วนระดับ วิกฤต/สูง) */}
        <div className="bg-white rounded-2xl border border-rose-200 shadow-2xs overflow-hidden">
          <div className="bg-rose-50/70 px-4 py-3 border-b border-rose-100 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-rose-800">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <h4 className="text-xs font-bold">ปัญหาเร่งด่วน (ระดับวิกฤต & สูง)</h4>
            </div>
            <span className="text-[10px] bg-rose-200 text-rose-900 font-bold px-2 py-0.5 rounded-full">
              {urgentIssuesList.length} ข้อ
            </span>
          </div>

          <div className="p-3 divide-y divide-slate-100 text-xs">
            {urgentIssuesList.map(issue => (
              <div key={issue.issueId} className="py-2.5 first:pt-1 last:pb-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center space-x-1.5">
                      <span className={`font-bold px-1.5 py-0.2 rounded text-[10px] ${
                        issue.severity === 'วิกฤต' ? 'bg-rose-100 text-rose-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {issue.severity}
                      </span>
                      <span className="font-medium text-slate-800 line-clamp-1">{issue.title}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      แก้โดย: {issue.owner.split(' ')[0]} | สถานะ: {issue.status}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                      ค้าง {issue.daysPending} วัน
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {urgentIssuesList.length === 0 && (
              <div className="py-6 text-center text-xs text-emerald-600 font-medium">
                ✅ ไม่มีปัญหาระดับวิกฤตหรือระดับสูงที่ยังคั่งค้าง
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
