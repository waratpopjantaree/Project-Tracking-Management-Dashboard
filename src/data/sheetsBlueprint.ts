export interface SheetColumnDef {
  name: string;
  key: string;
  type: string;
  formula?: string;
  description: string;
  example: string;
}

export interface SheetDefinition {
  title: string;
  sheetName: string;
  description: string;
  purpose: string;
  color: string;
  columns: SheetColumnDef[];
}

export const sheetsDefinitions: SheetDefinition[] = [
  {
    title: 'ชีตที่ 1: แดชบอร์ดสรุปภาพรวม (Dashboard)',
    sheetName: 'Dashboard',
    description: 'หน้าหลักสำหรับผู้บริหารและทีมงาน สรุป KPI ทั้งหมด กราฟวงกลม กราฟแท่งความคืบหน้า และตารางเตือนงานล่าช้า',
    purpose: 'แสดงสถานะโครงการแบบอัตโนมัติ Real-time ตรวจจับความเสี่ยงและงานล่าช้าโดยไม่ต้องคำนวณเอง',
    color: '#F3E8FF',
    columns: [
      { name: 'KPI Cards', key: 'kpi', type: 'Formula Cards', description: 'จำนวนโครงการรวม, แยกตามสถานะ, งานย่อย, ปัญหาค้าง, % ความคืบหน้ารวม', example: '12 การ์ดตัวชี้วัด' },
      { name: 'Charts Section', key: 'charts', type: 'Google Sheets Charts', description: 'กราฟวงกลมสถานะโครงการ, กราฟแท่งความคืบหน้ารายโครงการ, กราฟระดับความรุนแรงของปัญหา', example: '3 กราฟหลัก' },
      { name: 'Alerts Tables', key: 'alerts', type: 'Filter / Query Tables', description: 'ตารางงานใกล้ครบกำหนด 7 วัน, ตารางงานที่เลยกำหนด, ตารางปัญหาระดับวิกฤตและสูง', example: '3 ตารางเฝ้าระวัง' }
    ]
  },
  {
    title: 'ชีตที่ 2: ทะเบียนโครงการหลัก (Project_Master)',
    sheetName: 'Project_Master',
    description: 'เก็บข้อมูลหลักของทุกโครงการ รหัสโครงการ วันที่ งบประมาณ และคำนวณความคืบหน้าจากงานย่อยอัตโนมัติ',
    purpose: 'ฐานข้อมูลโครงการหลัก เป็นศูนย์กลางอ้างอิงให้ชีตงานย่อยและปัญหาเชื่อมโยง',
    color: '#E0F2FE',
    columns: [
      { name: 'Project_ID (A)', key: 'projectId', type: 'รหัสอัตโนมัติ (Text)', description: 'รหัสโครงการหลัก รูปแบบ PRJ-001, PRJ-002', example: 'PRJ-001' },
      { name: 'ชื่อโครงการ (B)', key: 'projectName', type: 'Text', description: 'ชื่อโครงการภาษาไทยหรืออังกฤษอย่างเป็นทางการ', example: 'ระบบบริหารจัดการโรงพยาบาลอัจฉริยะ' },
      { name: 'รายละเอียดโครงการ (C)', key: 'description', type: 'Text / Note', description: 'วัตถุประสงค์และขอบเขตงานโดยย่อ', example: 'พัฒนาระบบ ERP เชื่อมโยงเวชระเบียนและคลังยา' },
      { name: 'หน่วยงาน (D)', key: 'department', type: 'Dropdown (List)', description: 'ฝ่ายหรือสำนักที่รับผิดชอบ ดึงจากชีต Settings', example: 'สำนักเทคโนโลยีสารสนเทศ (IT)' },
      { name: 'ผู้รับผิดชอบโครงการ (E)', key: 'owner', type: 'Dropdown (List)', description: 'ผู้รับผิดชอบโครงการ', example: 'วิภาดา เลิศวิชา' },
      { name: 'วันที่เริ่มต้น (F)', key: 'startDate', type: 'Date (DD/MM/YYYY)', description: 'วันเริ่มดำเนินงานตามแผนงาน', example: '01/08/2026' },
      { name: 'วันสิ้นสุดตามแผน (G)', key: 'plannedEndDate', type: 'Date (DD/MM/YYYY)', description: 'กำหนดการส่งมอบงานโครงการทั้งหมด', example: '15/12/2026' },
      { name: 'วันสิ้นสุดจริง (H)', key: 'actualEndDate', type: 'Date (DD/MM/YYYY)', description: 'วันที่ปิดโครงการและตรวจรับงานจริง', example: '-' },
      { name: 'งบประมาณ (I)', key: 'budget', type: 'Currency (฿)', description: 'วงเงินงบประมาณที่ได้รับจัดสรร', example: '฿3,500,000' },
      { name: 'สถานะโครงการ (J)', key: 'status', type: 'Dropdown (List)', description: 'ยังไม่เริ่ม / กำลังดำเนินการ / รอดำเนินการ / เสี่ยงล่าช้า / ล่าช้า / เสร็จสิ้น / ยกเลิก', example: 'กำลังดำเนินการ' },
      { name: 'ความคืบหน้า (%) (K)', key: 'progress', type: 'Formula (%)', formula: '=IF(COUNTIF(Task_Tracking!B:B, A2)=0, 0, IFERROR(SUMPRODUCT((Task_Tracking!B$2:B=A2)*(Task_Tracking!K$2:K)*(Task_Tracking!L$2:L))/SUMIF(Task_Tracking!B$2:B, A2, Task_Tracking!K$2:K), AVERAGEIF(Task_Tracking!B:B, A2, Task_Tracking!L:L)))', description: 'คำนวณจากค่าน้ำหนักงานและเปอร์เซ็นต์ใน Task_Tracking อัตโนมัติ', example: '62.5%' },
      { name: 'จำนวนงานย่อยทั้งหมด (L)', key: 'totalTasks', type: 'Formula (Number)', formula: '=COUNTIF(Task_Tracking!B:B, A2)', description: 'นับจำนวนงานย่อยภายใต้รหัสโครงการนี้', example: '5' },
      { name: 'จำนวนงานที่เสร็จแล้ว (M)', key: 'completedTasks', type: 'Formula (Number)', formula: '=COUNTIFS(Task_Tracking!B:B, A2, Task_Tracking!M:M, "เสร็จสิ้น")', description: 'นับงานย่อยที่มีสถานะเป็น "เสร็จสิ้น"', example: '2' },
      { name: 'จำนวนปัญหาที่ยังไม่ปิด (N)', key: 'openIssues', type: 'Formula (Number)', formula: '=COUNTIFS(Issue_Log!B:B, A2, Issue_Log!N:N, "<>ปิดปัญหา")', description: 'นับปัญหาที่ยังไม่ปิดในชีต Issue_Log', example: '1' },
      { name: 'หมายเหตุ (O)', key: 'note', type: 'Text', description: 'ข้อมูลเพิ่มเติมหรือบันทึกสำคัญ', example: 'เฟส 1 มุ่งเน้นระบบ OPD' }
    ]
  },
  {
    title: 'ชีตที่ 3: ติดตามงานย่อย (Task_Tracking)',
    sheetName: 'Task_Tracking',
    description: 'บันทึกงานย่อยทุกขั้นตอนพร้อมค่าน้ำหนัก วันครบกำหนด และตรวจจับงานล่าช้าแบบ Real-time',
    purpose: 'บริหารงานย่อยอย่างละเอียด คำนวณความคืบหน้าตามน้ำหนักงานจริง และแจ้งเตือนวันเลยกำหนด',
    color: '#DCFCE7',
    columns: [
      { name: 'Task_ID (A)', key: 'taskId', type: 'รหัสอัตโนมัติ (Text)', description: 'รหัสงานย่อย รูปแบบ TASK-001, TASK-002', example: 'TASK-001' },
      { name: 'Project_ID (B)', key: 'projectId', type: 'Dropdown (From Master)', description: 'เลือกรหัสโครงการหลักจากชีต Project_Master', example: 'PRJ-001' },
      { name: 'ชื่อโครงการ (C)', key: 'projectName', type: 'Formula (Lookup)', formula: '=IFERROR(VLOOKUP(B2, Project_Master!A:B, 2, FALSE), "")', description: 'ดึงชื่อโครงการอัตโนมัติเมื่อเลือก Project_ID', example: 'ระบบบริหารจัดการโรงพยาบาลอัจฉริยะ' },
      { name: 'ลำดับงาน (D)', key: 'taskOrder', type: 'Number', description: 'ลำดับขั้นตอนการทำงาน (1, 2, 3...)', example: '1' },
      { name: 'ชื่องานย่อย (E)', key: 'taskName', type: 'Text', description: 'ชื่องานย่อยที่ต้องดำเนินการ', example: 'สำรวจและรวบรวม Requirement' },
      { name: 'รายละเอียดงาน (F)', key: 'description', type: 'Text', description: 'ขอบเขตงานและรายละเอียดส่งมอบ', example: 'สัมภาษณ์แพทย์ พยาบาล เภสัชกร' },
      { name: 'ผู้รับผิดชอบ (G)', key: 'assignee', type: 'Dropdown (List)', description: 'ผู้ปฏิบัติงานหลัก ดึงจาก Settings', example: 'วิภาดา เลิศวิชา (Lead PM)' },
      { name: 'วันที่เริ่มต้น (H)', key: 'startDate', type: 'Date (DD/MM/YYYY)', description: 'วันที่เริ่มลงมือทำงาน', example: '01/08/2026' },
      { name: 'วันครบกำหนด (I)', key: 'dueDate', type: 'Date (DD/MM/YYYY)', description: 'กำหนดส่งมอบงานย่อย (Deadline)', example: '25/08/2026' },
      { name: 'วันที่เสร็จจริง (J)', key: 'actualDate', type: 'Date (DD/MM/YYYY)', description: 'วันที่ส่งมอบงานจริง', example: '23/08/2026' },
      { name: 'น้ำหนักของงาน (%) (K)', key: 'weight', type: 'Number (%)', description: 'น้ำหนักความสำคัญของงาน (ผลรวมควรได้ 100%)', example: '15%' },
      { name: 'ความคืบหน้า (%) (L)', key: 'progress', type: 'Number (%)', description: 'เปอร์เซ็นต์ความคืบหน้าของงาน (0% - 100%)', example: '100%' },
      { name: 'สถานะงาน (M)', key: 'status', type: 'Dropdown (List)', description: 'ยังไม่เริ่ม / กำลังดำเนินการ / รอดำเนินการ / เสร็จสิ้น / ยกเลิก', example: 'เสร็จสิ้น' },
      { name: 'จำนวนวันที่เหลือ (N)', key: 'daysRemaining', type: 'Formula (Number)', formula: '=IF(OR(ISBLANK(I2), M2="เสร็จสิ้น"), "", MAX(0, I2 - TODAY()))', description: 'คำนวณจำนวนวันคงเหลือก่อนถึง Deadline', example: '0' },
      { name: 'จำนวนวันที่ล่าช้า (O)', key: 'daysOverdue', type: 'Formula (Number)', formula: '=IF(OR(ISBLANK(I2), M2="เสร็จสิ้น"), "", IF(TODAY() > I2, TODAY() - I2, 0))', description: 'ตรวจจับวันเลยกำหนดอัตโนมัติ (เป็น 0 ถ้าไม่ล่าช้า)', example: '0' },
      { name: 'หมายเหตุ (P)', key: 'note', type: 'Text', description: 'บันทึกอุปสรรคหรือประเด็นของงานย่อย', example: 'ผ่านการรับรองเอกสารแล้ว' }
    ]
  },
  {
    title: 'ชีตที่ 4: บันทึกปัญหาและอุปสรรค (Issue_Log)',
    sheetName: 'Issue_Log',
    description: 'บันทึกปัญหา ความเสี่ยง ข้อขัดข้อง พร้อมระดับความรุนแรง ผู้รับผิดชอบแก้ไข และวันกำหนดเสร็จ',
    purpose: 'บริหารจัดการความเสี่ยงและปัญหาแบบเข้มข้น ไม่ให้ปัญหาคั่งค้างส่งผลต่อวันส่งมอบโครงการ',
    color: '#FCE7F3',
    columns: [
      { name: 'Issue_ID (A)', key: 'issueId', type: 'รหัสอัตโนมัติ (Text)', description: 'รหัสปัญหา รูปแบบ ISS-001, ISS-002', example: 'ISS-001' },
      { name: 'Project_ID (B)', key: 'projectId', type: 'Dropdown (From Master)', description: 'เลือกรหัสโครงการที่เกิดปัญหา', example: 'PRJ-001' },
      { name: 'ชื่อโครงการ (C)', key: 'projectName', type: 'Formula (Lookup)', formula: '=IFERROR(VLOOKUP(B2, Project_Master!A:B, 2, FALSE), "")', description: 'ดึงชื่อโครงการอัตโนมัติเมื่อเลือก Project_ID', example: 'ระบบบริหารจัดการโรงพยาบาลอัจฉริยะ' },
      { name: 'วันที่พบปัญหา (D)', key: 'dateFound', type: 'Date (DD/MM/YYYY)', description: 'วันที่พบข้อผิดพลาดหรือปัญหา', example: '02/10/2026' },
      { name: 'หัวข้อปัญหา (E)', key: 'title', type: 'Text', description: 'สรุปประเด็นปัญหาแบบกระชับ', example: 'ไดรเวอร์เครื่องพิมพ์สติ๊กเกอร์ยาไม่รองรับ Web' },
      { name: 'รายละเอียดปัญหา (F)', key: 'description', type: 'Text', description: 'รายละเอียดและอาการของปัญหา', example: 'เครื่องพิมพ์ความร้อนไม่ตอบสนองต่อ Web Print' },
      { name: 'สาเหตุของปัญหา (G)', key: 'rootCause', type: 'Text', description: 'การวิเคราะห์สาเหตุที่แท้จริง (Root Cause)', example: 'อุปกรณ์รุ่นเก่าไม่มี Driver Web-USB' },
      { name: 'ผลกระทบ (H)', key: 'impact', type: 'Text', description: 'ผลกระทบต่อแผนงานหรือผู้ใช้งาน', example: 'เภสัชกรพิมพ์ฉลากยาอัตโนมัติไม่ได้' },
      { name: 'ระดับความรุนแรง (I)', key: 'severity', type: 'Dropdown (List)', description: 'ต่ำ / ปานกลาง / สูง / วิกฤต', example: 'สูง' },
      { name: 'ผู้รับผิดชอบแก้ไข (J)', key: 'owner', type: 'Dropdown (List)', description: 'ผู้ดำเนินการแก้ไข ดึงจาก Settings', example: 'กิตติศักดิ์ พงศ์ไพศาล' },
      { name: 'แนวทางแก้ไข (K)', key: 'solutionPlan', type: 'Text', description: 'วิธีการแก้ไขหรือ Workaround', example: 'พัฒนา Local Print Proxy Service' },
      { name: 'วันที่กำหนดแก้ไข (L)', key: 'targetDate', type: 'Date (DD/MM/YYYY)', description: 'กำหนดการแก้ไขเสร็จสิ้น', example: '18/10/2026' },
      { name: 'วันที่แก้ไขเสร็จ (M)', key: 'resolvedDate', type: 'Date (DD/MM/YYYY)', description: 'วันที่แก้ปัญหาและทดสอบผ่าน', example: '-' },
      { name: 'สถานะการแก้ไข (N)', key: 'status', type: 'Dropdown (List)', description: 'ยังไม่ดำเนินการ / กำลังแก้ไข / รอข้อมูล / รออนุมัติ / แก้ไขแล้ว / ปิดปัญหา', example: 'กำลังแก้ไข' },
      { name: 'จำนวนวันที่ค้าง (O)', key: 'daysPending', type: 'Formula (Number)', formula: '=IF(OR(ISBLANK(D2), N2="ปิดปัญหา", N2="แก้ไขแล้ว"), 0, TODAY() - D2)', description: 'นับวันค้างตั้งแต่พบปัญหาจนถึงปัจจุบัน (ถ้าปิดแล้วเป็น 0)', example: '9' },
      { name: 'หมายเหตุ (P)', key: 'note', type: 'Text', description: 'บันทึกเพิ่มเติมหรือติดตามสถานะ', example: 'ทำ POC ผ่านแล้ว' }
    ]
  },
  {
    title: 'ชีตที่ 5: ตั้งค่าระบบ (Settings)',
    sheetName: 'Settings',
    description: 'จัดเก็บค่าคงที่สำหรับทำ Dropdown (Data Validation) เพิ่ม-ลดได้โดยไม่ต้องแก้สูตร',
    purpose: 'ทำให้ระบบยืดหยุ่นและรองรับการขยายตัวขององค์กร',
    color: '#FEF9C3',
    columns: [
      { name: 'หน่วยงาน (คอลัมน์ A)', key: 'dept', type: 'List', description: 'A2:A - รายชื่อฝ่ายหรือสำนักในองค์กร', example: 'สำนักเทคโนโลยีสารสนเทศ (IT)' },
      { name: 'ผู้รับผิดชอบโครงการ (คอลัมน์ B)', key: 'staff', type: 'List', description: 'B2:B - รายชื่อผู้รับผิดชอบโครงการ', example: 'วิภาดา เลิศวิชา' },
      { name: 'สถานะโครงการ (คอลัมน์ C)', key: 'projStatus', type: 'List', description: 'C2:C - ยังไม่เริ่ม, กำลังดำเนินการ, เสี่ยงล่าช้า, ล่าช้า, เสร็จสิ้น ฯลฯ', example: 'กำลังดำเนินการ' },
      { name: 'สถานะงานย่อย (คอลัมน์ D)', key: 'taskStatus', type: 'List', description: 'D2:D - ยังไม่เริ่ม, กำลังดำเนินการ, รอดำเนินการ, เสร็จสิ้น, ยกเลิก', example: 'เสร็จสิ้น' },
      { name: 'ระดับความรุนแรง (คอลัมน์ E)', key: 'severity', type: 'List', description: 'E2:E - ต่ำ, ปานกลาง, สูง, วิกฤต', example: 'วิกฤต' },
      { name: 'สถานะการแก้ไขปัญหา (คอลัมน์ F)', key: 'issueStatus', type: 'List', description: 'F2:F - ยังไม่ดำเนินการ, กำลังแก้ไข, รอข้อมูล, รออนุมัติ, แก้ไขแล้ว, ปิดปัญหา', example: 'กำลังแก้ไข' }
    ]
  }
];

export const googleSheetsFormulas = [
  {
    category: '📊 สูตรในชีต Dashboard (การ์ด KPI)',
    items: [
      {
        cell: 'B4',
        name: 'จำนวนโครงการทั้งหมด',
        formula: '=COUNTA(Project_Master!A2:A) - COUNTBLANK(Project_Master!A2:A)',
        description: 'นับจำนวนโครงการทั้งหมดโดยตัดแถวว่างออก'
      },
      {
        cell: 'C4',
        name: 'โครงการ: ยังไม่เริ่ม',
        formula: '=COUNTIF(Project_Master!J2:J, "ยังไม่เริ่ม")',
        description: 'นับโครงการที่สถานะเท่ากับ "ยังไม่เริ่ม"'
      },
      {
        cell: 'D4',
        name: 'โครงการ: กำลังดำเนินการ',
        formula: '=COUNTIF(Project_Master!J2:J, "กำลังดำเนินการ")',
        description: 'นับโครงการที่กำลังดำเนินการอยู่'
      },
      {
        cell: 'E4',
        name: 'โครงการ: เสร็จสิ้นแล้ว',
        formula: '=COUNTIF(Project_Master!J2:J, "เสร็จสิ้น")',
        description: 'นับโครงการที่ปิดงานเสร็จสมบูรณ์'
      },
      {
        cell: 'F4',
        name: 'โครงการ: ล่าช้า / เสี่ยงล่าช้า',
        formula: '=COUNTIF(Project_Master!J2:J, "ล่าช้า") + COUNTIF(Project_Master!J2:J, "เสี่ยงล่าช้า")',
        description: 'รวมโครงการที่ล่าช้าหรือมีความเสี่ยงต่อกำหนดเวลา'
      },
      {
        cell: 'G4',
        name: 'โครงการที่มีปัญหาค้าง',
        formula: '=COUNTIF(Project_Master!N2:N, ">0")',
        description: 'นับโครงการที่มีปัญหาที่ยังไม่ปิดอย่างน้อย 1 รายการ'
      },
      {
        cell: 'B7',
        name: 'จำนวนงานย่อยทั้งหมด',
        formula: '=COUNTA(Task_Tracking!A2:A) - COUNTBLANK(Task_Tracking!A2:A)',
        description: 'นับงานย่อยทั้งหมดในระบบ'
      },
      {
        cell: 'C7',
        name: 'งานย่อย: เสร็จแล้ว',
        formula: '=COUNTIF(Task_Tracking!M2:M, "เสร็จสิ้น")',
        description: 'นับงานย่อยที่เสร็จสมบูรณ์'
      },
      {
        cell: 'D7',
        name: 'งานย่อย: กำลังทำ',
        formula: '=COUNTIF(Task_Tracking!M2:M, "กำลังดำเนินการ")',
        description: 'นับงานย่อยที่อยู่ระหว่างทำ'
      },
      {
        cell: 'E7',
        name: 'งานย่อย: ล่าช้า (เลยกำหนด)',
        formula: '=COUNTIF(Task_Tracking!O2:O, ">0")',
        description: 'นับงานย่อยที่จำนวนวันล่าช้ามากกว่า 0'
      },
      {
        cell: 'F7',
        name: 'ปัญหาที่ยังไม่แก้ไข (ยังไม่ปิด)',
        formula: '=COUNTIF(Issue_Log!N2:N, "<>ปิดปัญหา") - COUNTBLANK(Issue_Log!A2:A)',
        description: 'นับปัญหาที่ยังไม่ปิดทั้งหมด'
      },
      {
        cell: 'G7',
        name: 'เปอร์เซ็นต์ความคืบหน้ารวมของทุกโครงการ',
        formula: '=IFERROR(AVERAGE(FILTER(Project_Master!K2:K, ISNUMBER(Project_Master!K2:K), Project_Master!A2:A<>"")), 0)',
        description: 'เฉลี่ยความคืบหน้าของทุกโครงการอย่างแม่นยำ'
      }
    ]
  },
  {
    category: '📁 สูตรในชีต Project_Master (คอลัมน์คำนวณอัตโนมัติ)',
    items: [
      {
        cell: 'K2',
        name: 'เปอร์เซ็นต์ความคืบหน้า (คำนวณตามน้ำหนักงาน)',
        formula: '=IF(COUNTIF(Task_Tracking!B:B, A2)=0, 0, IFERROR(SUMPRODUCT((Task_Tracking!B$2:B=A2)*(Task_Tracking!K$2:K)*(Task_Tracking!L$2:L))/SUMIF(Task_Tracking!B$2:B, A2, Task_Tracking!K$2:K), AVERAGEIF(Task_Tracking!B:B, A2, Task_Tracking!L:L)))',
        description: 'คำนวณ (Weight × Progress) / Total Weight หากไม่ระบุน้ำหนักให้เฉลี่ย Progress ตรงๆ ลากลงมาทั้งคอลัมน์ K'
      },
      {
        cell: 'L2',
        name: 'จำนวนงานย่อยทั้งหมดในโครงการ',
        formula: '=COUNTIF(Task_Tracking!B:B, A2)',
        description: 'นับจำนวนงานย่อยที่มี Project_ID ตรงกับแถวนี้ ลากลงมาทั้งคอลัมน์ L'
      },
      {
        cell: 'M2',
        name: 'จำนวนงานย่อยที่เสร็จแล้ว',
        formula: '=COUNTIFS(Task_Tracking!B:B, A2, Task_Tracking!M:M, "เสร็จสิ้น")',
        description: 'นับเฉพาะงานย่อยที่สถานะเป็น "เสร็จสิ้น" ลากลงมาทั้งคอลัมน์ M'
      },
      {
        cell: 'N2',
        name: 'จำนวนปัญหาที่ยังไม่ปิด',
        formula: '=COUNTIFS(Issue_Log!B:B, A2, Issue_Log!N:N, "<>ปิดปัญหา")',
        description: 'นับปัญหาของโครงการนี้ที่ยังไม่ได้ปิด ลากลงมาทั้งคอลัมน์ N'
      }
    ]
  },
  {
    category: '📝 สูตรในชีต Task_Tracking (งานย่อย)',
    items: [
      {
        cell: 'C2',
        name: 'ดึงชื่อโครงการอัตโนมัติจากรหัส Project_ID',
        formula: '=IF(ISBLANK(B2), "", IFERROR(VLOOKUP(B2, Project_Master!A:B, 2, FALSE), "ไม่พบโครงการ"))',
        description: 'ใส่ที่ C2 แล้วลากลงมา เมื่อเลือก Project_ID ในคอลัมน์ B ชื่อโครงการจะแสดงทันที'
      },
      {
        cell: 'N2',
        name: 'คำนวณจำนวนวันที่เหลือจนถึงวันครบกำหนด',
        formula: '=IF(OR(ISBLANK(I2), M2="เสร็จสิ้น"), "", MAX(0, I2 - TODAY()))',
        description: 'หากงานเสร็จแล้วจะเว้นว่าง หากยังไม่เสร็จจะคำนวณวันคงเหลือ (ถ้าเลยกำหนดจะแสดง 0)'
      },
      {
        cell: 'O2',
        name: 'ตรวจจับและนับจำนวนวันที่ล่าช้าโดยอัตโนมัติ',
        formula: '=IF(OR(ISBLANK(I2), M2="เสร็จสิ้น"), "", IF(TODAY() > I2, TODAY() - I2, 0))',
        description: 'หากวันนี้เกิน Due Date และงานยังไม่เสร็จ จะแสดงจำนวนวันล่าช้าทันที'
      }
    ]
  },
  {
    category: '⚠️ สูตรในชีต Issue_Log (ปัญหาและอุปสรรค)',
    items: [
      {
        cell: 'C2',
        name: 'ดึงชื่อโครงการอัตโนมัติจากรหัส Project_ID',
        formula: '=IF(ISBLANK(B2), "", IFERROR(VLOOKUP(B2, Project_Master!A:B, 2, FALSE), "ไม่พบโครงการ"))',
        description: 'แสดงชื่อโครงการทันทีที่เลือก Project_ID'
      },
      {
        cell: 'O2',
        name: 'คำนวณจำนวนวันที่ปัญหาค้างอยู่ (นับถึงวันนี้)',
        formula: '=IF(OR(ISBLANK(D2), N2="ปิดปัญหา", N2="แก้ไขแล้ว"), 0, TODAY() - D2)',
        description: 'นับระยะเวลาที่ปัญหายังค้างอยู่เป็นจำนวนวัน หากปิดหรือแก้ไขแล้วจะรีเซ็ตเป็น 0'
      }
    ]
  },
  {
    category: '🔍 สูตรตารางสรุปเฝ้าระวังบน Dashboard (QUERY / FILTER)',
    items: [
      {
        cell: 'B12',
        name: 'ตารางงานย่อยที่ใกล้ครบกำหนดใน 7 วัน',
        formula: '=IFERROR(QUERY(Task_Tracking!A2:O, "SELECT B, E, G, I, N WHERE M <> \'เสร็จสิ้น\' AND N <= 7 AND N >= 0 AND A IS NOT NULL ORDER BY N ASC LIMIT 5", 0), "ไม่มีงานใกล้ครบกำหนด")',
        description: 'ดึงงานที่ต้องเร่งส่งมอบใน 7 วันมาแสดง 5 รายการแรก'
      },
      {
        cell: 'B20',
        name: 'ตารางงานย่อยที่ล่าช้ากว่ากำหนด (Overdue Alert)',
        formula: '=IFERROR(QUERY(Task_Tracking!A2:O, "SELECT B, E, G, I, O WHERE M <> \'เสร็จสิ้น\' AND O > 0 AND A IS NOT NULL ORDER BY O DESC LIMIT 5", 0), "ไม่มีงานล่าช้า")',
        description: 'ดึงงานที่เลยกำหนดแล้วเรียงตามจำนวนวันล่าช้ามากไปน้อย'
      },
      {
        cell: 'I12',
        name: 'ตารางปัญหาเร่งด่วนระดับ "วิกฤต" และ "สูง"',
        formula: '=IFERROR(QUERY(Issue_Log!A2:P, "SELECT B, E, I, J, L, O WHERE N <> \'ปิดปัญหา\' AND (I = \'วิกฤต\' OR I = \'สูง\') AND A IS NOT NULL ORDER BY I DESC, O DESC LIMIT 5", 0), "ไม่มีปัญหาเร่งด่วน")',
        description: 'ดึงปัญหาที่มีผลกระทบรุนแรงที่ยังไม่ปิดมาแสดงเพื่อให้ผู้บริหารตัดสินใจทันที'
      }
    ]
  }
];

export const pastelColorSpecs = [
  { name: 'พื้นหลังหลัก / บัตรข้อมูล', hex: '#FFFFFF / #F8FAFC', usage: 'พื้นหลังระบบ, การ์ดตาราง, ตัวหนังสือสีเทาเข้มเพื่อการอ่านง่าย' },
  { name: 'ฟ้าพาสเทล (Pastel Sky Blue)', hex: '#E0F2FE', textHex: '#0369A1', usage: 'ข้อมูลทั่วไป, สถานะ "กำลังดำเนินการ", หัวตาราง Project_Master' },
  { name: 'เขียวพาสเทล (Pastel Mint Green)', hex: '#DCFCE7', textHex: '#15803D', usage: 'สถานะ "เสร็จสิ้น", "แก้ไขแล้ว", "ปิดปัญหา", งานที่เสร็จสมบูรณ์' },
  { name: 'เหลืองพาสเทล (Pastel Cream Yellow)', hex: '#FEF9C3', textHex: '#A16207', usage: 'สถานะ "เสี่ยงล่าช้า", "รอดำเนินการ", งานใกล้ครบกำหนดใน 7 วัน' },
  { name: 'ส้มพาสเทล (Pastel Peach Orange)', hex: '#FFEDD5', textHex: '#C2410C', usage: 'สถานะ "ล่าช้า", งานที่เลยกำหนด (Overdue), ความรุนแรงระดับ "สูง"' },
  { name: 'ชมพูพาสเทล (Pastel Rose Pink)', hex: '#FCE7F3', textHex: '#BE185D', usage: 'ความรุนแรงระดับ "วิกฤต", ปัญหาที่ยังคั่งค้าง, หัวตาราง Issue_Log' },
  { name: 'ม่วงพาสเทล (Pastel Soft Lavender)', hex: '#F3E8FF', textHex: '#7E22CE', usage: 'หัวตาราง Dashboard, ตัวชี้วัดรวม, % ความคืบหน้ารวม' }
];

export const conditionalFormattingRules = [
  {
    sheet: 'Task_Tracking',
    range: 'M2:M1000 (สถานะงาน)',
    condition: 'ข้อความตรงกับ "เสร็จสิ้น"',
    bg: '#DCFCE7',
    textColor: '#15803D'
  },
  {
    sheet: 'Task_Tracking',
    range: 'M2:M1000 (สถานะงาน)',
    condition: 'ข้อความตรงกับ "กำลังดำเนินการ"',
    bg: '#E0F2FE',
    textColor: '#0369A1'
  },
  {
    sheet: 'Task_Tracking',
    range: 'O2:O1000 (จำนวนวันที่ล่าช้า)',
    condition: 'มากกว่า 0 (สูตร: =O2>0)',
    bg: '#FFEDD5',
    textColor: '#C2410C'
  },
  {
    sheet: 'Task_Tracking',
    range: 'N2:N1000 (จำนวนวันที่เหลือ)',
    condition: 'น้อยกว่าหรือเท่ากับ 3 และมากกว่า 0 (สูตร: =AND(N2<=3, N2>0))',
    bg: '#FEF9C3',
    textColor: '#A16207'
  },
  {
    sheet: 'Issue_Log',
    range: 'I2:I1000 (ระดับความรุนแรง)',
    condition: 'ข้อความตรงกับ "วิกฤต"',
    bg: '#FCE7F3',
    textColor: '#BE185D'
  },
  {
    sheet: 'Issue_Log',
    range: 'I2:I1000 (ระดับความรุนแรง)',
    condition: 'ข้อความตรงกับ "สูง"',
    bg: '#FFEDD5',
    textColor: '#C2410C'
  },
  {
    sheet: 'Project_Master',
    range: 'J2:J1000 (สถานะโครงการ)',
    condition: 'ข้อความตรงกับ "เสร็จสิ้น"',
    bg: '#DCFCE7',
    textColor: '#15803D'
  },
  {
    sheet: 'Project_Master',
    range: 'J2:J1000 (สถานะโครงการ)',
    condition: 'ข้อความตรงกับ "ล่าช้า"',
    bg: '#FFEDD5',
    textColor: '#C2410C'
  }
];

export const appsScriptCode = `/**
 * =========================================================================
 * Repair tracking - Google Apps Script
 * =========================================================================
 * สร้างขึ้นเพื่อการบริหารจัดการงานซ่อม งานย่อย และปัญหา บน Google Sheets
 * มีระบบสร้างรหัสอัตโนมัติ เมนูควบคุม และฟอร์มป้อนข้อมูลผ่าน Dialog
 */

// 1. สร้าง Custom Menu เมื่อเปิด Google Sheets
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🔧 Repair Tracking')
    .addItem('➕ เพิ่มโครงการใหม่ (Add Project)', 'showAddProjectDialog')
    .addItem('🗑️ ลบโครงการหลัก (Delete Project)', 'showDeleteProjectDialog')
    .addItem('📝 เพิ่มงานย่อย (Add Task)', 'showAddTaskDialog')
    .addItem('⚠️ บันทึกปัญหา (Add Issue)', 'showAddIssueDialog')
    .addSeparator()
    .addItem('🔄 คำนวณและอัปเดตระบบ (Recalculate & Sync)', 'recalculateAll')
    .addItem('🚨 ตรวจสอบงานล่าช้า & แจ้งเตือน', 'checkAlertsNotification')
    .addSeparator()
    .addItem('🛠️ สร้าง/ตั้งค่าชีตทั้งหมดเริ่มต้น (Setup Initial Sheets)', 'setupAllSheets')
    .addToUi();
}

// 2. ฟังก์ชันช่วยสร้างรหัสอัตโนมัติ (PRJ-001, TASK-001, ISS-001)
function getNextId(sheetName, idColIndex, prefix) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return prefix + '-001';
  
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) return prefix + '-001';
  
  const values = sheet.getRange(2, idColIndex, lastRow - 1, 1).getValues();
  let maxNum = 0;
  
  for (let i = 0; i < values.length; i++) {
    const val = String(values[i][0] || '');
    if (val.indexOf(prefix + '-') === 0) {
      const num = parseInt(val.replace(prefix + '-', ''), 10);
      if (!isNaN(num) && num > maxNum) {
        maxNum = num;
      }
    }
  }
  
  const nextNum = maxNum + 1;
  return prefix + '-' + ('000' + nextNum).slice(-3);
}

// 3. ฟังก์ชันเปิด Dialog ป้อนข้อมูล
function showAddProjectDialog() {
  const html = HtmlService.createHtmlOutput(getProjectFormHtml())
    .setWidth(550)
    .setHeight(620)
    .setTitle('➕ เพิ่มโครงการใหม่ (Add New Project)');
  SpreadsheetApp.getUi().showModalDialog(html, 'เพิ่มโครงการใหม่');
}

function showAddTaskDialog() {
  const html = HtmlService.createHtmlOutput(getTaskFormHtml())
    .setWidth(550)
    .setHeight(650)
    .setTitle('📝 เพิ่มงานย่อย (Add New Task)');
  SpreadsheetApp.getUi().showModalDialog(html, 'เพิ่มงานย่อยในโครงการ');
}

function showAddIssueDialog() {
  const html = HtmlService.createHtmlOutput(getIssueFormHtml())
    .setWidth(550)
    .setHeight(650)
    .setTitle('⚠️ บันทึกปัญหาและอุปสรรค (Add Issue)');
  SpreadsheetApp.getUi().showModalDialog(html, 'บันทึกปัญหาในโครงการ');
}

// 4. บันทึกข้อมูลโครงการใหม่ลงชีต Project_Master
function saveNewProject(data) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName('Project_Master');
    if (!sheet) {
      throw new Error('ไม่พบชีต Project_Master กรุณากดเมนูตั้งค่าเริ่มต้น');
    }
    
    const projectId = getNextId('Project_Master', 1, 'PRJ');
    const row = sheet.getLastRow() + 1;
    
    // ตั้งสูตรคำนวณอัตโนมัติ
    const progressFormula = '=IF(COUNTIF(Task_Tracking!B:B, A' + row + ')=0, 0, IFERROR(SUMPRODUCT((Task_Tracking!B$2:B=A' + row + ')*(Task_Tracking!K$2:K)*(Task_Tracking!L$2:L))/SUMIF(Task_Tracking!B$2:B, A' + row + ', Task_Tracking!K$2:K), AVERAGEIF(Task_Tracking!B:B, A' + row + ', Task_Tracking!L:L)))';
    const totalTasksFormula = '=COUNTIF(Task_Tracking!B:B, A' + row + ')';
    const completedTasksFormula = '=COUNTIFS(Task_Tracking!B:B, A' + row + ', Task_Tracking!M:M, "เสร็จสิ้น")';
    const openIssuesFormula = '=COUNTIFS(Issue_Log!B:B, A' + row + ', Issue_Log!N:N, "<>ปิดปัญหา")';
    
    sheet.appendRow([
      projectId,
      data.projectName,
      data.description || '',
      data.department || '',
      data.owner || '',
      data.startDate || '',
      data.plannedEndDate || '',
      '', // actualEndDate
      Number(data.budget) || 0,
      data.status || 'ยังไม่เริ่ม',
      progressFormula,
      totalTasksFormula,
      completedTasksFormula,
      openIssuesFormula,
      data.note || ''
    ]);
    
    // จัดรูปแบบคอลัมน์เงินและเปอร์เซ็นต์
    sheet.getRange(row, 9).setNumberFormat('฿#,##0');
    sheet.getRange(row, 11).setNumberFormat('0.0%');
    
    return { success: true, message: 'บันทึกโครงการสำเร็จ รหัส: ' + projectId };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

// 5. บันทึกงานย่อยใหม่ลงชีต Task_Tracking
function saveNewTask(data) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName('Task_Tracking');
    if (!sheet) throw new Error('ไม่พบชีต Task_Tracking');
    
    const taskId = getNextId('Task_Tracking', 1, 'TASK');
    const row = sheet.getLastRow() + 1;
    
    const nameFormula = '=IFERROR(VLOOKUP(B' + row + ', Project_Master!A:B, 2, FALSE), "")';
    const daysRemainingFormula = '=IF(OR(ISBLANK(I' + row + '), M' + row + '="เสร็จสิ้น"), "", MAX(0, I' + row + ' - TODAY()))';
    const daysOverdueFormula = '=IF(OR(ISBLANK(I' + row + '), M' + row + '="เสร็จสิ้น"), "", IF(TODAY() > I' + row + ', TODAY() - I' + row + ', 0))';
    
    sheet.appendRow([
      taskId,
      data.projectId,
      nameFormula,
      Number(data.taskOrder) || 1,
      data.taskName,
      data.description || '',
      data.assignee || '',
      data.startDate || '',
      data.dueDate || '',
      '', // actualDate
      (Number(data.weight) || 0) / 100,
      (Number(data.progress) || 0) / 100,
      data.status || 'ยังไม่เริ่ม',
      daysRemainingFormula,
      daysOverdueFormula,
      data.note || ''
    ]);
    
    sheet.getRange(row, 11).setNumberFormat('0.0%');
    sheet.getRange(row, 12).setNumberFormat('0.0%');
    
    return { success: true, message: 'บันทึกงานย่อยสำเร็จ รหัส: ' + taskId };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

// 6. บันทึกปัญหาใหม่ลงชีต Issue_Log
function saveNewIssue(data) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName('Issue_Log');
    if (!sheet) throw new Error('ไม่พบชีต Issue_Log');
    
    const issueId = getNextId('Issue_Log', 1, 'ISS');
    const row = sheet.getLastRow() + 1;
    
    const nameFormula = '=IFERROR(VLOOKUP(B' + row + ', Project_Master!A:B, 2, FALSE), "")';
    const daysPendingFormula = '=IF(OR(ISBLANK(D' + row + '), N' + row + '="ปิดปัญหา", N' + row + '="แก้ไขแล้ว"), 0, TODAY() - D' + row + ')';
    
    sheet.appendRow([
      issueId,
      data.projectId,
      nameFormula,
      data.dateFound || new Date().toISOString().split('T')[0],
      data.title,
      data.description || '',
      data.rootCause || '',
      data.impact || '',
      data.severity || 'ปานกลาง',
      data.owner || '',
      data.solutionPlan || '',
      data.targetDate || '',
      '', // resolvedDate
      data.status || 'ยังไม่ดำเนินการ',
      daysPendingFormula,
      data.note || ''
    ]);
    
    return { success: true, message: 'บันทึกปัญหาสำเร็จ รหัส: ' + issueId };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

// 7. ฟังก์ชันดึงรายชื่อโครงการสำหรับ Dropdown ใน Form
function getProjectOptions() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Project_Master');
  if (!sheet) return [];
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) return [];
  
  const values = sheet.getRange(2, 1, lastRow - 1, 2).getValues();
  return values.map(function(r) {
    return { id: r[0], name: r[1] };
  }).filter(function(p) { return p.id; });
}

// 8. แจ้งเตือนงานล่าช้าและปัญหาเร่งด่วน
function checkAlertsNotification() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const taskSheet = ss.getSheetByName('Task_Tracking');
  const issueSheet = ss.getSheetByName('Issue_Log');
  
  let overdueTasks = 0;
  let criticalIssues = 0;
  
  if (taskSheet && taskSheet.getLastRow() > 1) {
    const taskValues = taskSheet.getRange(2, 13, taskSheet.getLastRow() - 1, 3).getValues();
    for (let i = 0; i < taskValues.length; i++) {
      const status = taskValues[i][0];
      const overdue = Number(taskValues[i][2]);
      if (status !== 'เสร็จสิ้น' && overdue > 0) overdueTasks++;
    }
  }
  
  if (issueSheet && issueSheet.getLastRow() > 1) {
    const issueValues = issueSheet.getRange(2, 9, issueSheet.getLastRow() - 1, 6).getValues();
    for (let i = 0; i < issueValues.length; i++) {
      const severity = issueValues[i][0];
      const status = issueValues[i][5];
      if ((severity === 'วิกฤต' || severity === 'สูง') && status !== 'ปิดปัญหา') {
        criticalIssues++;
      }
    }
  }
  
  const msg = '📌 สรุปการตรวจสอบความเสี่ยง:\\n' +
    '• งานย่อยที่เลยกำหนด (Overdue): ' + overdueTasks + ' งาน\\n' +
    '• ปัญหาเร่งด่วนระดับสูงและวิกฤตที่ยังไม่ปิด: ' + criticalIssues + ' รายการ\\n\\n' +
    (overdueTasks > 0 || criticalIssues > 0 ? '⚠️ โปรดเข้าตรวจสอบชีต Dashboard เพื่อดูรายละเอียด' : '✅ ทุกงานดำเนินไปตามแผนงานอย่างเรียบร้อย');
    
  SpreadsheetApp.getUi().alert('รายงานสถานะความเสี่ยง', msg, SpreadsheetApp.getUi().ButtonSet.OK);
}

// 9. ฟังก์ชันลบโครงการหลัก (Dialog และกระบวนการลบ)
function showDeleteProjectDialog() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Project_Master');
  if (!sheet || sheet.getLastRow() <= 1) {
    SpreadsheetApp.getUi().alert('แจ้งเตือน', 'ยังไม่มีโครงการในระบบให้ลบ', SpreadsheetApp.getUi().ButtonSet.OK);
    return;
  }
  
  const options = getProjectOptions();
  let promptMsg = 'ระบุรหัสโครงการที่ต้องการลบ (เช่น PRJ-001):\\n\\nรายชื่อโครงการที่มีอยู่ในระบบ:\\n';
  options.forEach(function(p) {
    promptMsg += '• ' + p.id + ' : ' + p.name + '\\n';
  });
  
  const response = SpreadsheetApp.getUi().prompt('🗑️ ลบโครงการหลัก', promptMsg, SpreadsheetApp.getUi().ButtonSet.OK_CANCEL);
  if (response.getSelectedButton() === SpreadsheetApp.getUi().Button.OK) {
    const inputId = response.getResponseText().trim().toUpperCase();
    if (!inputId) return;
    
    const confirmResp = SpreadsheetApp.getUi().alert(
      'ยืนยันการลบโครงการ',
      'คุณแน่ใจว่าต้องการลบโครงการ ' + inputId + ' ใช่หรือไม่?\\n(งานย่อยและปัญหาทั้งหมดภายใต้โครงการนี้จะถูกลบออกด้วย)',
      SpreadsheetApp.getUi().ButtonSet.YES_NO
    );
    
    if (confirmResp === SpreadsheetApp.getUi().Button.YES) {
      const res = deleteProject(inputId);
      SpreadsheetApp.getUi().alert(res.success ? 'สำเร็จ' : 'ผิดพลาด', res.message, SpreadsheetApp.getUi().ButtonSet.OK);
    }
  }
}

function deleteProject(projectId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const projSheet = ss.getSheetByName('Project_Master');
    const taskSheet = ss.getSheetByName('Task_Tracking');
    const issueSheet = ss.getSheetByName('Issue_Log');
    
    if (!projSheet) throw new Error('ไม่พบชีต Project_Master');
    
    let deletedCount = 0;
    const pLastRow = projSheet.getLastRow();
    if (pLastRow > 1) {
      const pValues = projSheet.getRange(2, 1, pLastRow - 1, 1).getValues();
      for (let i = pValues.length - 1; i >= 0; i--) {
        if (pValues[i][0] === projectId) {
          projSheet.deleteRow(i + 2);
          deletedCount++;
        }
      }
    }
    
    if (deletedCount === 0) {
      return { success: false, message: 'ไม่พบรหัสโครงการ ' + projectId + ' ในระบบ' };
    }
    
    // ลบงานย่อยใน Task_Tracking ที่เชื่อมกับโครงการนี้
    let deletedTasks = 0;
    if (taskSheet && taskSheet.getLastRow() > 1) {
      const tLastRow = taskSheet.getLastRow();
      const tValues = taskSheet.getRange(2, 2, tLastRow - 1, 1).getValues();
      for (let i = tValues.length - 1; i >= 0; i--) {
        if (tValues[i][0] === projectId) {
          taskSheet.deleteRow(i + 2);
          deletedTasks++;
        }
      }
    }
    
    // ลบปัญหาใน Issue_Log ที่เชื่อมกับโครงการนี้
    let deletedIssues = 0;
    if (issueSheet && issueSheet.getLastRow() > 1) {
      const iLastRow = issueSheet.getLastRow();
      const iValues = issueSheet.getRange(2, 2, iLastRow - 1, 1).getValues();
      for (let i = iValues.length - 1; i >= 0; i--) {
        if (iValues[i][0] === projectId) {
          issueSheet.deleteRow(i + 2);
          deletedIssues++;
        }
      }
    }
    
    SpreadsheetApp.flush();
    return { 
      success: true, 
      message: 'ลบโครงการ ' + projectId + ' สำเร็จแล้ว!\\n(รวมงานย่อย ' + deletedTasks + ' งาน และปัญหา ' + deletedIssues + ' ข้อ)' 
    };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

// 10. คำนวณและอัปเดตชีตทั้งหมด
function recalculateAll() {
  SpreadsheetApp.flush();
  SpreadsheetApp.getUi().alert('สำเร็จ', 'อัปเดตและคำนวณข้อมูลในระบบเรียบร้อยแล้ว', SpreadsheetApp.getUi().ButtonSet.OK);
}
`;

export const appsScriptHtmlForm = `<!-- Form.html: โค้ด HTML สำหรับ Modal Dialog ใน Google Sheets -->
<!DOCTYPE html>
<html>
<head>
  <base target="_top">
  <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Sarabun', sans-serif; padding: 16px; color: #334155; background: #F8FAFC; }
    .form-group { margin-bottom: 12px; }
    label { display: block; font-weight: 500; font-size: 13px; margin-bottom: 4px; color: #475569; }
    input, select, textarea { width: 100%; padding: 8px 10px; border: 1px solid #CBD5E1; border-radius: 6px; font-size: 14px; box-sizing: border-box; }
    input:focus, select:focus, textarea:focus { outline: none; border-color: #38BDF8; box-shadow: 0 0 0 2px rgba(56,189,248,0.2); }
    .btn-row { display: flex; justify-content: flex-end; gap: 8px; margin-top: 18px; }
    .btn { padding: 8px 16px; border-radius: 6px; font-size: 14px; cursor: pointer; border: none; font-weight: 500; }
    .btn-primary { background: #0284C7; color: white; }
    .btn-secondary { background: #E2E8F0; color: #475569; }
    .required { color: #EF4444; }
  </style>
</head>
<body>
  <form id="dataForm" onsubmit="handleSubmit(event)">
    <div class="form-group">
      <label>ชื่อโครงการ / ชื่องาน <span class="required">*</span></label>
      <input type="text" id="name" required placeholder="ระบุชื่ออย่างเป็นทางการ">
    </div>
    <div class="form-group">
      <label>ผู้รับผิดชอบ <span class="required">*</span></label>
      <input type="text" id="owner" required placeholder="ชื่อ-นามสกุล">
    </div>
    <div class="form-group">
      <label>วันสิ้นสุด / กำหนดส่ง <span class="required">*</span></label>
      <input type="date" id="dueDate" required>
    </div>
    <div class="btn-row">
      <button type="button" class="btn btn-secondary" onclick="google.script.host.close()">ยกเลิก</button>
      <button type="submit" class="btn btn-primary">บันทึกข้อมูล</button>
    </div>
  </form>
</body>
</html>
`;
