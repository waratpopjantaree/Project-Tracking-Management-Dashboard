import { Project, Task, Issue } from '../types';

export function exportProjectsToTSV(projects: Project[]): string {
  const headers = [
    'Project_ID',
    'ชื่อโครงการ',
    'รายละเอียดโครงการ',
    'หน่วยงาน',
    'ผู้รับผิดชอบโครงการ',
    'วันที่เริ่มต้น',
    'วันสิ้นสุดตามแผน',
    'วันสิ้นสุดจริง',
    'งบประมาณ',
    'สถานะโครงการ',
    'เปอร์เซ็นต์ความคืบหน้า',
    'จำนวนงานย่อยทั้งหมด',
    'จำนวนงานย่อยที่เสร็จแล้ว',
    'จำนวนปัญหาที่ยังไม่ปิด',
    'หมายเหตุ'
  ];

  const rows = projects.map(p => [
    p.projectId,
    p.projectName,
    p.description || '',
    p.department || '',
    p.owner || '',
    p.startDate || '',
    p.plannedEndDate || '',
    p.actualEndDate || '',
    p.budget || 0,
    p.status || '',
    `${p.progress || 0}%`,
    p.totalTasks || 0,
    p.completedTasks || 0,
    p.openIssues || 0,
    p.note || ''
  ]);

  return [headers.join('\t'), ...rows.map(r => r.join('\t'))].join('\n');
}

export function exportTasksToTSV(tasks: Task[]): string {
  const headers = [
    'Task_ID',
    'Project_ID',
    'ชื่อโครงการ',
    'ลำดับงาน',
    'ชื่องานย่อย',
    'รายละเอียดงาน',
    'ผู้รับผิดชอบ',
    'วันที่เริ่มต้น',
    'วันครบกำหนด',
    'วันที่เสร็จจริง',
    'น้ำหนักของงาน (%)',
    'เปอร์เซ็นต์ความคืบหน้า',
    'สถานะงาน',
    'จำนวนวันที่เหลือ',
    'จำนวนวันที่ล่าช้า',
    'หมายเหตุ'
  ];

  const rows = tasks.map(t => [
    t.taskId,
    t.projectId,
    t.projectName || '',
    t.taskOrder,
    t.taskName,
    t.description || '',
    t.assignee || '',
    t.startDate || '',
    t.dueDate || '',
    t.actualDate || '',
    `${t.weight || 0}%`,
    `${t.progress || 0}%`,
    t.status || '',
    t.daysRemaining || 0,
    t.daysOverdue || 0,
    t.note || ''
  ]);

  return [headers.join('\t'), ...rows.map(r => r.join('\t'))].join('\n');
}

export function exportIssuesToTSV(issues: Issue[]): string {
  const headers = [
    'Issue_ID',
    'Project_ID',
    'ชื่อโครงการ',
    'วันที่พบปัญหา',
    'หัวข้อปัญหา',
    'รายละเอียดปัญหา',
    'สาเหตุของปัญหา',
    'ผลกระทบ',
    'ระดับความรุนแรง',
    'ผู้รับผิดชอบแก้ไข',
    'แนวทางแก้ไข',
    'วันที่กำหนดแก้ไข',
    'วันที่แก้ไขเสร็จ',
    'สถานะการแก้ไข',
    'จำนวนวันที่ค้าง',
    'หมายเหตุ'
  ];

  const rows = issues.map(i => [
    i.issueId,
    i.projectId,
    i.projectName || '',
    i.dateFound || '',
    i.title,
    i.description || '',
    i.rootCause || '',
    i.impact || '',
    i.severity || '',
    i.owner || '',
    i.solutionPlan || '',
    i.targetDate || '',
    i.resolvedDate || '',
    i.status || '',
    i.daysPending || 0,
    i.note || ''
  ]);

  return [headers.join('\t'), ...rows.map(r => r.join('\t'))].join('\n');
}

export function downloadFile(content: string, filename: string, mimeType = 'text/plain') {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
