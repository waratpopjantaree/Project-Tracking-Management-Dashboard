import { Project, Task, Issue, ProjectStatus, TaskStatus, IssueSeverity } from '../types';

export function calculateTaskStats(task: Task, todayStr = new Date().toISOString().split('T')[0]): { daysRemaining: number; daysOverdue: number } {
  if (!task.dueDate) return { daysRemaining: 0, daysOverdue: 0 };
  
  const today = new Date(todayStr);
  const due = new Date(task.dueDate);
  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (task.status === 'เสร็จสิ้น') {
    return { daysRemaining: 0, daysOverdue: 0 };
  }

  if (diffDays < 0) {
    return { daysRemaining: 0, daysOverdue: Math.abs(diffDays) };
  } else {
    return { daysRemaining: diffDays, daysOverdue: 0 };
  }
}

export function calculateIssueStats(issue: Issue, todayStr = new Date().toISOString().split('T')[0]): { daysPending: number; isOverdue: boolean } {
  const today = new Date(todayStr);
  const found = new Date(issue.dateFound);
  const target = issue.targetDate ? new Date(issue.targetDate) : null;
  
  if (issue.status === 'ปิดปัญหา' || issue.status === 'แก้ไขแล้ว') {
    return { daysPending: 0, isOverdue: false };
  }

  const diffTime = today.getTime() - found.getTime();
  const daysPending = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));

  const isOverdue = target ? today.getTime() > target.getTime() : false;

  return { daysPending, isOverdue };
}

export function calculateProjectProgress(projectId: string, tasks: Task[]): number {
  const projectTasks = tasks.filter(t => t.projectId === projectId);
  if (projectTasks.length === 0) return 0;

  const totalWeight = projectTasks.reduce((sum, t) => sum + (t.weight || 0), 0);
  
  if (totalWeight > 0) {
    const weightedProgress = projectTasks.reduce((sum, t) => {
      const weight = t.weight || 0;
      const progress = Math.min(100, Math.max(0, t.progress || 0));
      return sum + (weight * progress);
    }, 0);
    return Math.round((weightedProgress / totalWeight) * 10) / 10;
  } else {
    // If weights are 0 or not assigned, use plain average
    const totalProgress = projectTasks.reduce((sum, t) => sum + (t.progress || 0), 0);
    return Math.round((totalProgress / projectTasks.length) * 10) / 10;
  }
}

export function enrichProjects(projects: Project[], tasks: Task[], issues: Issue[]): Project[] {
  return projects.map(p => {
    const projectTasks = tasks.filter(t => t.projectId === p.projectId);
    const completedTasks = projectTasks.filter(t => t.status === 'เสร็จสิ้น').length;
    const projectIssues = issues.filter(i => i.projectId === p.projectId);
    const openIssues = projectIssues.filter(i => i.status !== 'ปิดปัญหา').length;
    const progress = calculateProjectProgress(p.projectId, tasks);

    return {
      ...p,
      progress,
      totalTasks: projectTasks.length,
      completedTasks,
      openIssues
    };
  });
}

export function enrichTasks(tasks: Task[], projects: Project[]): Task[] {
  const projectMap = new Map(projects.map(p => [p.projectId, p.projectName]));
  return tasks.map(t => {
    const { daysRemaining, daysOverdue } = calculateTaskStats(t);
    return {
      ...t,
      projectName: projectMap.get(t.projectId) || t.projectId,
      daysRemaining,
      daysOverdue
    };
  });
}

export function enrichIssues(issues: Issue[], projects: Project[]): Issue[] {
  const projectMap = new Map(projects.map(p => [p.projectId, p.projectName]));
  return issues.map(i => {
    const { daysPending } = calculateIssueStats(i);
    return {
      ...i,
      projectName: projectMap.get(i.projectId) || i.projectId,
      daysPending
    };
  });
}

export interface DashboardSummary {
  // Projects
  totalProjects: number;
  notStartedProjects: number;
  inProgressProjects: number;
  pendingProjects: number;
  atRiskProjects: number;
  delayedProjects: number;
  completedProjects: number;
  cancelledProjects: number;
  projectsWithIssues: number;

  // Tasks
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  delayedTasks: number;
  pendingTasks: number;
  notStartedTasks: number;

  // Issues
  totalIssues: number;
  openIssues: number;
  criticalIssues: number;
  highIssues: number;
  resolvedIssues: number;
  overdueIssues: number;

  // Overall
  overallProgress: number;
  totalBudget: number;
}

export function computeDashboardSummary(projects: Project[], tasks: Task[], issues: Issue[]): DashboardSummary {
  const enrichedP = enrichProjects(projects, tasks, issues);
  const enrichedT = enrichTasks(tasks, projects);
  const enrichedI = enrichIssues(issues, projects);

  const totalProjects = enrichedP.length;
  const notStartedProjects = enrichedP.filter(p => p.status === 'ยังไม่เริ่ม').length;
  const inProgressProjects = enrichedP.filter(p => p.status === 'กำลังดำเนินการ').length;
  const pendingProjects = enrichedP.filter(p => p.status === 'รอดำเนินการ').length;
  const atRiskProjects = enrichedP.filter(p => p.status === 'เสี่ยงล่าช้า').length;
  const delayedProjects = enrichedP.filter(p => p.status === 'ล่าช้า').length;
  const completedProjects = enrichedP.filter(p => p.status === 'เสร็จสิ้น').length;
  const cancelledProjects = enrichedP.filter(p => p.status === 'ยกเลิก').length;
  const projectsWithIssues = enrichedP.filter(p => (p.openIssues || 0) > 0).length;

  const totalTasks = enrichedT.length;
  const completedTasks = enrichedT.filter(t => t.status === 'เสร็จสิ้น').length;
  const inProgressTasks = enrichedT.filter(t => t.status === 'กำลังดำเนินการ').length;
  const delayedTasks = enrichedT.filter(t => (t.daysOverdue || 0) > 0).length;
  const pendingTasks = enrichedT.filter(t => t.status === 'รอดำเนินการ').length;
  const notStartedTasks = enrichedT.filter(t => t.status === 'ยังไม่เริ่ม').length;

  const totalIssues = enrichedI.length;
  const openIssues = enrichedI.filter(i => i.status !== 'ปิดปัญหา').length;
  const criticalIssues = enrichedI.filter(i => i.severity === 'วิกฤต' && i.status !== 'ปิดปัญหา').length;
  const highIssues = enrichedI.filter(i => i.severity === 'สูง' && i.status !== 'ปิดปัญหา').length;
  const resolvedIssues = enrichedI.filter(i => i.status === 'ปิดปัญหา' || i.status === 'แก้ไขแล้ว').length;
  
  const today = new Date().toISOString().split('T')[0];
  const overdueIssues = enrichedI.filter(i => {
    if (i.status === 'ปิดปัญหา') return false;
    return i.targetDate && i.targetDate < today;
  }).length;

  const overallProgress = totalProjects > 0
    ? Math.round(enrichedP.reduce((sum, p) => sum + (p.progress || 0), 0) / totalProjects * 10) / 10
    : 0;

  const totalBudget = enrichedP.reduce((sum, p) => sum + (p.budget || 0), 0);

  return {
    totalProjects,
    notStartedProjects,
    inProgressProjects,
    pendingProjects,
    atRiskProjects,
    delayedProjects,
    completedProjects,
    cancelledProjects,
    projectsWithIssues,
    totalTasks,
    completedTasks,
    inProgressTasks,
    delayedTasks,
    pendingTasks,
    notStartedTasks,
    totalIssues,
    openIssues,
    criticalIssues,
    highIssues,
    resolvedIssues,
    overdueIssues,
    overallProgress,
    totalBudget
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', maximumFractionDigits: 0 }).format(amount);
}

export function formatDateThai(dateStr: string): string {
  if (!dateStr) return '-';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const yearCE = parseInt(parts[0], 10);
    const yearBE = yearCE + 543;
    return `${parts[2]}/${parts[1]}/${yearBE}`;
  }
  return dateStr;
}

export function generateNextId(prefix: string, items: { projectId?: string; taskId?: string; issueId?: string }[]): string {
  const ids = items.map(item => {
    const raw = item.projectId || item.taskId || item.issueId || '';
    if (raw.startsWith(prefix + '-')) {
      const num = parseInt(raw.replace(prefix + '-', ''), 10);
      return isNaN(num) ? 0 : num;
    }
    return 0;
  });
  const max = ids.length > 0 ? Math.max(...ids) : 0;
  const next = max + 1;
  return `${prefix}-${String(next).padStart(3, '0')}`;
}
