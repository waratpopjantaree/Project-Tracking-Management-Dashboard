export type ProjectStatus = 
  | 'ยังไม่เริ่ม' 
  | 'กำลังดำเนินการ' 
  | 'รอดำเนินการ' 
  | 'เสี่ยงล่าช้า' 
  | 'ล่าช้า' 
  | 'เสร็จสิ้น' 
  | 'ยกเลิก';

export type TaskStatus = 
  | 'ยังไม่เริ่ม' 
  | 'กำลังดำเนินการ' 
  | 'รอดำเนินการ' 
  | 'เสร็จสิ้น' 
  | 'ยกเลิก';

export type IssueSeverity = 
  | 'ต่ำ' 
  | 'ปานกลาง' 
  | 'สูง' 
  | 'วิกฤต';

export type IssueStatus = 
  | 'ยังไม่ดำเนินการ' 
  | 'กำลังแก้ไข' 
  | 'รอข้อมูล' 
  | 'รออนุมัติ' 
  | 'แก้ไขแล้ว' 
  | 'ปิดปัญหา';

export interface Project {
  projectId: string;          // PRJ-001
  projectName: string;        // ชื่อโครงการ
  description: string;        // รายละเอียด
  department: string;         // หน่วยงาน
  owner: string;              // ผู้รับผิดชอบโครงการ
  startDate: string;          // YYYY-MM-DD
  plannedEndDate: string;     // วันสิ้นสุดตามแผน
  actualEndDate?: string;     // วันสิ้นสุดจริง
  budget: number;             // งบประมาณ (บาท)
  status: ProjectStatus;      // สถานะโครงการ
  progress?: number;          // % ความคืบหน้า (คำนวณจากงานย่อย)
  totalTasks?: number;        // คำนวณอัตโนมัติ
  completedTasks?: number;    // คำนวณอัตโนมัติ
  openIssues?: number;        // คำนวณอัตโนมัติ
  note?: string;              // หมายเหตุ
}

export interface Task {
  taskId: string;             // TASK-001
  projectId: string;          // PRJ-001
  projectName?: string;       // Auto-lookup
  taskOrder: number;          // ลำดับงาน
  taskName: string;           // ชื่องานย่อย
  description?: string;       // รายละเอียดงาน
  assignee: string;           // ผู้รับผิดชอบ
  startDate: string;          // YYYY-MM-DD
  dueDate: string;            // วันครบกำหนด
  actualDate?: string;        // วันที่เสร็จจริง
  weight: number;             // น้ำหนักของงาน (%)
  progress: number;           // % ความคืบหน้า (0-100)
  status: TaskStatus;         // สถานะงาน
  daysRemaining?: number;     // คำนวณอัตโนมัติ
  daysOverdue?: number;       // คำนวณอัตโนมัติ
  note?: string;              // หมายเหตุ
}

export interface Issue {
  issueId: string;            // ISS-001
  projectId: string;          // PRJ-001
  projectName?: string;       // Auto-lookup
  dateFound: string;          // วันที่พบปัญหา
  title: string;              // หัวข้อปัญหา
  description: string;        // รายละเอียดปัญหา
  rootCause?: string;         // สาเหตุของปัญหา
  impact?: string;            // ผลกระทบ
  severity: IssueSeverity;    // ระดับความรุนแรง
  owner: string;              // ผู้รับผิดชอบแก้ไข
  solutionPlan?: string;      // แนวทางแก้ไข
  targetDate: string;         // วันที่กำหนดแก้ไข
  resolvedDate?: string;      // วันที่แก้ไขเสร็จ
  status: IssueStatus;        // สถานะการแก้ไข
  daysPending?: number;       // จำนวนวันที่ค้าง
  note?: string;              // หมายเหตุ
}

export interface AppSettings {
  departments: string[];
  assignees: string[];
  projectStatuses: ProjectStatus[];
  taskStatuses: TaskStatus[];
  issueSeverities: IssueSeverity[];
  issueStatuses: IssueStatus[];
}

export interface DashboardFilter {
  projectId: string;
  assignee: string;
  status: string;
  search: string;
  department?: string;
}
