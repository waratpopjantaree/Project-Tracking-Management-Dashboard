import { Project, Task, Issue, AppSettings } from '../types';

export const initialSettings: AppSettings = {
  departments: [
    'สำนักเทคโนโลยีสารสนเทศ (IT)',
    'ฝ่ายพัฒนาระบบดิจิทัล (Digital Transformation)',
    'ฝ่ายการตลาดและสื่อสารองค์กร (Marketing)',
    'ฝ่ายบริหารจัดการทรัพยากรบุคคล (HR)',
    'ฝ่ายกำกับดูแลและตรวจสอบ (Compliance & Legal)',
    'ฝ่ายปฏิบัติการและการบริการลูกค้า (Operations)'
  ],
  assignees: [
    'สมชาย มุ่งมั่น (Project Director)',
    'วิภาดา เลิศวิชา (Lead PM)',
    'กิตติศักดิ์ พงศ์ไพศาล (System Architect)',
    'ณัฐธิดา ศรีสวัสดิ์ (Fullstack Developer)',
    'อนุรักษ์ เจริญผล (QA & Testing Lead)',
    'ชลธิชา วงศ์สุวรรณ (UX/UI Designer)',
    'ภาณุวัฒน์ บุญเรือง (Security Specialist)',
    'ปิยะพร รัตนโชติ (Data Analyst)'
  ],
  projectStatuses: [
    'ยังไม่เริ่ม',
    'กำลังดำเนินการ',
    'รอดำเนินการ',
    'เสี่ยงล่าช้า',
    'ล่าช้า',
    'เสร็จสิ้น',
    'ยกเลิก'
  ],
  taskStatuses: [
    'ยังไม่เริ่ม',
    'กำลังดำเนินการ',
    'รอดำเนินการ',
    'เสร็จสิ้น',
    'ยกเลิก'
  ],
  issueSeverities: [
    'ต่ำ',
    'ปานกลาง',
    'สูง',
    'วิกฤต'
  ],
  issueStatuses: [
    'ยังไม่ดำเนินการ',
    'กำลังแก้ไข',
    'รอข้อมูล',
    'รออนุมัติ',
    'แก้ไขแล้ว',
    'ปิดปัญหา'
  ]
};

export const sampleProjects: Project[] = [
  {
    projectId: 'PRJ-001',
    projectName: 'ระบบบริหารจัดการโรงพยาบาลอัจฉริยะ (Smart Hospital ERP)',
    description: 'พัฒนาระบบ ERP สำหรับเชื่อมโยงเวชระเบียน ระบบคลังยา และการเบิกจ่ายสิทธิประกันสังคม',
    department: 'สำนักเทคโนโลยีสารสนเทศ (IT)',
    owner: 'วิภาดา เลิศวิชา (Lead PM)',
    startDate: '2026-08-01',
    plannedEndDate: '2026-12-15',
    budget: 3500000,
    status: 'กำลังดำเนินการ',
    note: 'โครงการเฟส 1 มุ่งเน้นระบบผู้ป่วยนอก (OPD) และระบบคลังยา'
  },
  {
    projectId: 'PRJ-002',
    projectName: 'โครงการยกระดับความมั่นคงปลอดภัยไซเบอร์และ PDPA',
    description: 'ปรับปรุงโครงสร้างพื้นฐานด้านความปลอดภัย ติดตั้งระบบตรวจจับภัยคุกคาม และสอดคล้อง PDPA',
    department: 'ฝ่ายกำกับดูแลและตรวจสอบ (Compliance & Legal)',
    owner: 'ภาณุวัฒน์ บุญเรือง (Security Specialist)',
    startDate: '2026-07-15',
    plannedEndDate: '2026-10-31',
    budget: 1850000,
    status: 'เสี่ยงล่าช้า',
    note: 'รอการตรวจสอบและประเมินผลจากหน่วยงานภายนอก (Third-party audit)'
  },
  {
    projectId: 'PRJ-003',
    projectName: 'แอปพลิเคชันลูกค้าสัมพันธ์และสะสมแต้ม (Loyalty App 2.0)',
    description: 'พัฒนา Mobile App สำหรับสมาชิกลูกค้า เพื่อสะสมคะแนน แลกรับสิทธิพิเศษ และชำระเงินดิจิทัล',
    department: 'ฝ่ายพัฒนาระบบดิจิทัล (Digital Transformation)',
    owner: 'ณัฐธิดา ศรีสวัสดิ์ (Fullstack Developer)',
    startDate: '2026-09-01',
    plannedEndDate: '2026-11-30',
    budget: 2200000,
    status: 'กำลังดำเนินการ',
    note: 'เชื่อมต่อ Payment Gateway และ Core CRM เดิม'
  }
];

export const sampleTasks: Task[] = [
  // PRJ-001 Tasks
  {
    taskId: 'TASK-001',
    projectId: 'PRJ-001',
    taskOrder: 1,
    taskName: 'สำรวจและรวบรวม Requirement จากแผนกแพทย์และเภสัชกรรม',
    description: 'สัมภาษณ์แพทย์ พยาบาล และเภสัชกร เพื่อกำหนด Functional Specs',
    assignee: 'วิภาดา เลิศวิชา (Lead PM)',
    startDate: '2026-08-01',
    dueDate: '2026-08-25',
    actualDate: '2026-08-23',
    weight: 15,
    progress: 100,
    status: 'เสร็จสิ้น',
    note: 'ผ่านการรับรองเอกสาร Requirement เรียบร้อย'
  },
  {
    taskId: 'TASK-002',
    projectId: 'PRJ-001',
    taskOrder: 2,
    taskName: 'ออกแบบสถาปัตยกรรมระบบและฐานข้อมูล (Database Schema)',
    description: 'จัดทำ ER Diagram และ API Contract สำหรับระบบคลังยาและห้องตรวจ',
    assignee: 'กิตติศักดิ์ พงศ์ไพศาล (System Architect)',
    startDate: '2026-08-26',
    dueDate: '2026-09-20',
    actualDate: '2026-09-19',
    weight: 20,
    progress: 100,
    status: 'เสร็จสิ้น',
    note: 'รองรับมาตรฐานข้อมูล HL7 FHIR'
  },
  {
    taskId: 'TASK-003',
    projectId: 'PRJ-001',
    taskOrder: 3,
    taskName: 'พัฒนาระบบคลังยาและเวชภัณฑ์ (Pharmacy Management Module)',
    description: 'ระบบตัดสต็อกยาอัตโนมัติเมื่อแพทย์สั่งยา พร้อมระบบแจ้งเตือนยาใกล้หมดอายุ',
    assignee: 'ณัฐธิดา ศรีสวัสดิ์ (Fullstack Developer)',
    startDate: '2026-09-21',
    dueDate: '2026-10-25',
    weight: 30,
    progress: 75,
    status: 'กำลังดำเนินการ',
    note: 'กำลังทดสอบเชื่อมต่อเครื่องพิมพ์สติ๊กเกอร์ยา'
  },
  {
    taskId: 'TASK-004',
    projectId: 'PRJ-001',
    taskOrder: 4,
    taskName: 'พัฒนาระบบการบันทึกเวชระเบียนผู้ป่วยนอก (OPD Records)',
    description: 'ระบบบันทึกประวัติการรักษา ผลตรวจทางห้องปฏิบัติการ และคำวินิจฉัย',
    assignee: 'ณัฐธิดา ศรีสวัสดิ์ (Fullstack Developer)',
    startDate: '2026-10-01',
    dueDate: '2026-11-15',
    weight: 25,
    progress: 40,
    status: 'กำลังดำเนินการ',
    note: 'ส่วน UI และแบบฟอร์มคัดกรองเสร็จแล้ว 80%'
  },
  {
    taskId: 'TASK-005',
    projectId: 'PRJ-001',
    taskOrder: 5,
    taskName: 'ทดสอบระบบเจาะลึก (UAT & Integration Testing)',
    description: 'การทดสอบจำลองเหตุการณ์จริงในโรงพยาบาลก่อนเปิดใช้งานระบบ',
    assignee: 'อนุรักษ์ เจริญผล (QA & Testing Lead)',
    startDate: '2026-11-16',
    dueDate: '2026-12-10',
    weight: 10,
    progress: 0,
    status: 'ยังไม่เริ่ม',
    note: 'รอให้โมดูลหลักทั้ง 2 พัฒนาเสร็จสิ้น'
  },

  // PRJ-002 Tasks
  {
    taskId: 'TASK-006',
    projectId: 'PRJ-002',
    taskOrder: 1,
    taskName: 'ประเมินความเสี่ยงและช่องโหว่ระบบเครือข่าย (Vulnerability Assessment)',
    description: 'สแกนหาช่องโหว่ Server และ Network อุปกรณ์ทั้งหมดในองค์กร',
    assignee: 'ภาณุวัฒน์ บุญเรือง (Security Specialist)',
    startDate: '2026-07-15',
    dueDate: '2026-08-15',
    actualDate: '2026-08-14',
    weight: 25,
    progress: 100,
    status: 'เสร็จสิ้น',
    note: 'พบช่องโหว่ระดับปานกลาง 8 รายการและระดับสูง 2 รายการ'
  },
  {
    taskId: 'TASK-007',
    projectId: 'PRJ-002',
    taskOrder: 2,
    taskName: 'จัดทำนโยบายและมาตรการคุ้มครองข้อมูลส่วนบุคคล (PDPA Policy)',
    description: 'ร่างเอกสาร Data Privacy Consent และ RoPA ร่วมกับฝ่ายกฎหมาย',
    assignee: 'สมชาย มุ่งมั่น (Project Director)',
    startDate: '2026-08-16',
    dueDate: '2026-09-30',
    actualDate: '2026-10-02',
    weight: 25,
    progress: 100,
    status: 'เสร็จสิ้น',
    note: 'เสร็จล่าช้ากว่ากำหนด 2 วันเนื่องจากรอการอนุมัติจากคณะกรรมการ'
  },
  {
    taskId: 'TASK-008',
    projectId: 'PRJ-002',
    taskOrder: 3,
    taskName: 'ติดตั้งและตั้งค่าระบบตรวจจับภัยคุกคาม (SIEM & EDR Implementation)',
    description: 'ติดตั้ง Agent บนเครื่องลูกข่าย 450 เครื่อง และคอนฟิก Log Collector',
    assignee: 'ภาณุวัฒน์ บุญเรือง (Security Specialist)',
    startDate: '2026-09-15',
    dueDate: '2026-10-10', // Past due!
    weight: 35,
    progress: 60,
    status: 'กำลังดำเนินการ',
    note: 'ติดปัญหาเรื่องสิทธิ์ Admin ในแผนกสาขาต่างจังหวัด ทำให้ล่าช้า'
  },
  {
    taskId: 'TASK-009',
    projectId: 'PRJ-002',
    taskOrder: 4,
    taskName: 'การตรวจสอบรับรองความปลอดภัยภายนอก (Third-party Audit)',
    description: 'ให้บริษัทผู้เชี่ยวชาญภายนอกตรวจสอบและออกใบรับรองมาตรฐาน ISO 27001',
    assignee: 'ภาณุวัฒน์ บุญเรือง (Security Specialist)',
    startDate: '2026-10-15',
    dueDate: '2026-10-31',
    weight: 15,
    progress: 0,
    status: 'ยังไม่เริ่ม',
    note: 'ต้องรอผลการติดตั้ง SIEM ให้ครบถ้วนก่อน'
  },

  // PRJ-003 Tasks
  {
    taskId: 'TASK-010',
    projectId: 'PRJ-003',
    taskOrder: 1,
    taskName: 'วิจัยผู้ใช้และออกแบบ UX/UI Prototype (Figma)',
    description: 'จัดทำ User Journey, Wireframe และ High-fidelity Mockup สำหรับ iOS/Android',
    assignee: 'ชลธิชา วงศ์สุวรรณ (UX/UI Designer)',
    startDate: '2026-09-01',
    dueDate: '2026-09-25',
    actualDate: '2026-09-24',
    weight: 20,
    progress: 100,
    status: 'เสร็จสิ้น',
    note: 'ผ่านการทดสอบ Prototype กับผู้ใช้กลุ่มตัวอย่าง 20 คน'
  },
  {
    taskId: 'TASK-011',
    projectId: 'PRJ-003',
    taskOrder: 2,
    taskName: 'พัฒนา Frontend ด้วย React Native / Flutter',
    description: 'สร้างหน้า Dashboard ลูกค้า, บาร์โค้ดสะสมแต้ม, และหน้าแคตตาล็อกของรางวัล',
    assignee: 'ณัฐธิดา ศรีสวัสดิ์ (Fullstack Developer)',
    startDate: '2026-09-26',
    dueDate: '2026-10-28',
    weight: 35,
    progress: 55,
    status: 'กำลังดำเนินการ',
    note: 'หน้าจอหลักและหน้าประวัติแต้มเสร็จแล้ว'
  },
  {
    taskId: 'TASK-012',
    projectId: 'PRJ-003',
    taskOrder: 3,
    taskName: 'พัฒนา Backend API เชื่อมต่อ Payment Gateway และ POS',
    description: 'API ตัดแต้ม Real-time และเชื่อมโยงเครื่องแคชเชียร์หน้าร้าน',
    assignee: 'กิตติศักดิ์ พงศ์ไพศาล (System Architect)',
    startDate: '2026-10-05',
    dueDate: '2026-11-10',
    weight: 30,
    progress: 30,
    status: 'กำลังดำเนินการ',
    note: 'กำลังรอ Sandbox API Key จากธนาคารพาร์ทเนอร์'
  },
  {
    taskId: 'TASK-013',
    projectId: 'PRJ-003',
    taskOrder: 4,
    taskName: 'เตรียมขึ้นระบบ App Store & Google Play Console',
    description: 'เตรียมเอกสาร นโยบายความเป็นส่วนตัว แคตตาล็อกภาพประกอบ และยื่นตรวจแอป',
    assignee: 'ชลธิชา วงศ์สุวรรณ (UX/UI Designer)',
    startDate: '2026-11-11',
    dueDate: '2026-11-30',
    weight: 15,
    progress: 0,
    status: 'ยังไม่เริ่ม',
    note: 'รอให้การทดสอบระบบเสร็จสมบูรณ์'
  }
];

export const sampleIssues: Issue[] = [
  {
    issueId: 'ISS-001',
    projectId: 'PRJ-001',
    dateFound: '2026-10-02',
    title: 'ไดรเวอร์เครื่องพิมพ์สติ๊กเกอร์ยาเข้ากันไม่ได้กับ Web Browser',
    description: 'เครื่องพิมพ์ความร้อนแบรนด์เดิมที่ห้องยาไม่รองรับการสั่งพิมพ์ผ่าน Web API ทำให้พิมพ์บาร์โค้ดยาไม่ออก',
    rootCause: 'เครื่องพิมพ์รุ่นเก่าขาด Driver สำหรับ Web-USB / Web-Serial',
    impact: 'เภสัชกรไม่สามารถสั่งพิมพ์สลากยาอัตโนมัติจากหน้าจอได้',
    severity: 'สูง',
    owner: 'กิตติศักดิ์ พงศ์ไพศาล (System Architect)',
    solutionPlan: 'พัฒนา Local Print Proxy Service แบบ Lightweight บนเครื่องคอมพิวเตอร์ห้องจ่ายยา',
    targetDate: '2026-10-18',
    status: 'กำลังแก้ไข',
    note: 'จัดทำตัวจำลอง Proof-of-concept แล้ว ได้ผลดี'
  },
  {
    issueId: 'ISS-002',
    projectId: 'PRJ-002',
    dateFound: '2026-09-28',
    title: 'คอมพิวเตอร์สาขาต่างจังหวัดติดปัญหา Group Policy ไม่สามารถติดตั้ง Agent อัตโนมัติ',
    description: 'เครื่องลูกข่ายประมาณ 120 เครื่องในสาขาภูมิภาคไม่ได้รับสิทธิ์ติดตั้งซอฟต์แวร์ EDR จากส่วนกลาง',
    rootCause: 'การตั้งค่า AD Domain Controller ในสาขาต่างจังหวัดไม่ได้ Sync นโยบายใหม่',
    impact: 'ทำให้งานติดตั้งระบบตรวจจับภัยคุกคามล่าช้าเกินกำหนดไป 5 วัน',
    severity: 'วิกฤต',
    owner: 'ภาณุวัฒน์ บุญเรือง (Security Specialist)',
    solutionPlan: 'ประสานงาน Network Admin ในพื้นที่เพื่อรัน Batch Script Manual ควบคู่กับการแก้ไข Domain Sync',
    targetDate: '2026-10-14',
    status: 'กำลังแก้ไข',
    note: 'ดำเนินการติดตั้งแบบ Manual สำเร็จแล้ว 65 เครื่อง'
  },
  {
    issueId: 'ISS-003',
    projectId: 'PRJ-003',
    dateFound: '2026-10-06',
    title: 'ความล่าช้าในการอนุมัติ Payment Gateway Sandbox จากธนาคาร',
    description: 'ทีมผู้พัฒนาส่งเรื่องขอ API Credentials เพื่อทดสอบระบบชำระเงิน แต่ธนาคารยังไม่ส่งคู่มือเวอร์ชันล่าสุดมาให้',
    rootCause: 'ธนาคารมีการปรับปรุงระบบรักษาความปลอดภัย 2FA ของ Merchant Portal',
    impact: 'งานเชื่อมต่อระบบชำระเงินอาจชะงักหากไม่ได้รับเอกสารภายในสัปดาห์นี้',
    severity: 'ปานกลาง',
    owner: 'วิภาดา เลิศวิชา (Lead PM)',
    solutionPlan: 'ติดตามผลกับผู้จัดการฝ่ายพันธมิตรของธนาคารโดยตรง และพัฒนาส่วนอื่นรอไปก่อน',
    targetDate: '2026-10-16',
    status: 'รอข้อมูล',
    note: 'นัดประชุมเร่งด่วนกับทีมเทคนิคของธนาคารวันพุธนี้'
  },
  {
    issueId: 'ISS-004',
    projectId: 'PRJ-001',
    dateFound: '2026-08-18',
    title: 'ข้อมูลรหัสยาเดิมในระบบเก่ามีรูปแบบไม่ตรงกัน (Data Inconsistency)',
    description: 'ฐานข้อมูลยาเก่ามีการใส่รหัสซ้ำซ้อนและไม่มีรหัสมาตรฐาน TMT ของกระทรวงสาธารณสุข',
    rootCause: 'ในอดีตมีการคีย์ข้อมูลโดยไม่มี Data Validation',
    impact: 'ไม่สามารถนำเข้าข้อมูลยาเข้าสู่ระบบใหม่ได้โดยตรง',
    severity: 'ปานกลาง',
    owner: 'ปิยะพร รัตนโชติ (Data Analyst)',
    solutionPlan: 'จัดทำ Data Cleansing Script พร้อมให้หัวหน้าเภสัชกรตรวจทานและจับคู่รหัส TMT',
    targetDate: '2026-09-05',
    resolvedDate: '2026-09-04',
    status: 'ปิดปัญหา',
    note: 'ทำความสะอาดข้อมูลครบ 2,400 รายการเรียบร้อยแล้ว'
  }
];
