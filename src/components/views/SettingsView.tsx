import React, { useState } from 'react';
import { AppSettings } from '../../types';
import { Settings2, Plus, Trash2, Building2, Users, Sliders, AlertCircle, Wrench, ShieldCheck } from 'lucide-react';

interface SettingsViewProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings
}) => {
  const [newDept, setNewDept] = useState('');
  const [newAssignee, setNewAssignee] = useState('');
  const [deptFeedback, setDeptFeedback] = useState<string | null>(null);
  const [assigneeFeedback, setAssigneeFeedback] = useState<string | null>(null);

  const handleAddDept = (e: React.FormEvent) => {
    e.preventDefault();
    const val = newDept.trim();
    if (!val) return;
    if (settings.departments.includes(val)) {
      setDeptFeedback('แผนกนี้มีอยู่ในระบบแล้ว');
      setTimeout(() => setDeptFeedback(null), 3000);
      return;
    }
    onUpdateSettings({
      ...settings,
      departments: [...settings.departments, val]
    });
    setNewDept('');
    setDeptFeedback(`เพิ่มแผนก "${val}" เรียบร้อยแล้ว`);
    setTimeout(() => setDeptFeedback(null), 3000);
  };

  const handleRemoveDept = (dept: string) => {
    if (settings.departments.length <= 1) {
      setDeptFeedback('ต้องมีแผนกช่างอย่างน้อย 1 รายการ');
      setTimeout(() => setDeptFeedback(null), 3000);
      return;
    }
    onUpdateSettings({
      ...settings,
      departments: settings.departments.filter(d => d !== dept)
    });
    setDeptFeedback(`ลบแผนก "${dept}" เรียบร้อยแล้ว`);
    setTimeout(() => setDeptFeedback(null), 3000);
  };

  const handleAddAssignee = (e: React.FormEvent) => {
    e.preventDefault();
    const val = newAssignee.trim();
    if (!val) return;
    if (settings.assignees.includes(val)) {
      setAssigneeFeedback('ชื่อช่างท่านนี้มีอยู่ในระบบแล้ว');
      setTimeout(() => setAssigneeFeedback(null), 3000);
      return;
    }
    onUpdateSettings({
      ...settings,
      assignees: [...settings.assignees, val]
    });
    setNewAssignee('');
    setAssigneeFeedback(`เพิ่มช่าง "${val}" เรียบร้อยแล้ว`);
    setTimeout(() => setAssigneeFeedback(null), 3000);
  };

  const handleRemoveAssignee = (name: string) => {
    if (settings.assignees.length <= 1) {
      setAssigneeFeedback('ต้องมีช่างผู้รับผิดชอบอย่างน้อย 1 ท่าน');
      setTimeout(() => setAssigneeFeedback(null), 3000);
      return;
    }
    onUpdateSettings({
      ...settings,
      assignees: settings.assignees.filter(a => a !== name)
    });
    setAssigneeFeedback(`ลบช่าง "${name}" เรียบร้อยแล้ว`);
    setTimeout(() => setAssigneeFeedback(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold">
            <Settings2 className="w-5 h-5 text-slate-700" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              ตั้งค่าระบบงานซ่อม (Maintenance Master Settings)
            </h2>
            <p className="text-xs text-slate-500">
              จัดการตัวเลือกแผนกช่างรับผิดชอบ, ช่างเทคนิคผู้ปฏิบัติงาน, สถานะ และการตรวจสอบข้อมูลในแบบฟอร์ม
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Section 1: Maintenance Departments */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>แผนกช่างรับผิดชอบ (Maintenance Departments)</span>
            </h3>
            <span className="text-xs bg-slate-100 text-slate-700 font-semibold px-2.5 py-0.5 rounded-md border border-slate-200 font-mono tabular-nums">
              {settings.departments.length} แผนก
            </span>
          </div>
          <p className="text-xs text-slate-500">
            รายการแผนกสำหรับเลือกในใบแจ้งซ่อม (REP_Master) สามารถเพิ่มและลบได้อย่างอิสระ
          </p>

          {deptFeedback && (
            <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-800 font-medium flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{deptFeedback}</span>
            </div>
          )}

          <form onSubmit={handleAddDept} className="flex gap-2">
            <input
              type="text"
              placeholder="พิมพ์ชื่อแผนกช่างใหม่ เช่น แผนกหม้อน้ำและความร้อน..."
              value={newDept}
              onChange={e => setNewDept(e.target.value)}
              className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
            <button
              type="submit"
              className="px-3.5 py-2 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>เพิ่มแผนก</span>
            </button>
          </form>

          <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto pr-1">
            {settings.departments.map((dept) => (
              <div key={dept} className="py-2.5 px-2 flex items-center justify-between text-xs text-slate-700 hover:bg-slate-50 rounded-lg group transition-colors">
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span className="font-medium text-slate-800">{dept}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveDept(dept)}
                  className="px-2 py-1 text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 rounded transition-colors flex items-center gap-1 text-[11px] font-semibold"
                  title={`ลบแผนก "${dept}"`}
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                  <span>ลบ</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Technicians & Leads */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Users className="w-4 h-4 text-emerald-600" />
              <span>ช่าง / ผู้รับผิดชอบงานซ่อม (Technicians & Leads)</span>
            </h3>
            <span className="text-xs bg-slate-100 text-slate-700 font-semibold px-2.5 py-0.5 rounded-md border border-slate-200 font-mono tabular-nums">
              {settings.assignees.length} ท่าน
            </span>
          </div>
          <p className="text-xs text-slate-500">
            รายชื่อช่างและวิศวกรผู้รับผิดชอบ สำหรับมอบหมายงานในใบแจ้งซ่อมและขั้นตอนย่อย
          </p>

          {assigneeFeedback && (
            <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{assigneeFeedback}</span>
            </div>
          )}

          <form onSubmit={handleAddAssignee} className="flex gap-2">
            <input
              type="text"
              placeholder="พิมพ์ชื่อช่างใหม่ เช่น ช่างธีรศักดิ์ (ช่างเครื่องกล)..."
              value={newAssignee}
              onChange={e => setNewAssignee(e.target.value)}
              className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
            <button
              type="submit"
              className="px-3.5 py-2 text-xs font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>เพิ่มช่าง</span>
            </button>
          </form>

          <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto pr-1">
            {settings.assignees.map((name) => (
              <div key={name} className="py-2.5 px-2 flex items-center justify-between text-xs text-slate-700 hover:bg-slate-50 rounded-lg group transition-colors">
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="font-medium text-slate-800">{name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveAssignee(name)}
                  className="px-2 py-1 text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 rounded transition-colors flex items-center gap-1 text-[11px] font-semibold"
                  title={`ลบช่าง "${name}"`}
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                  <span>ลบ</span>
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Section 3: Statuses Reference */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
          <Sliders className="w-4 h-4 text-purple-600" />
          <span>มาตรฐานสถานะงานซ่อมและการควบคุมคุณภาพ</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="font-semibold text-slate-800 mb-2">สถานะใบงานซ่อมหลัก:</div>
            <div className="flex flex-wrap gap-1.5">
              {settings.projectStatuses.map(s => (
                <span key={s} className="px-2 py-0.5 bg-white rounded border border-slate-200 text-slate-700">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="font-semibold text-slate-800 mb-2">สถานะขั้นตอนย่อย:</div>
            <div className="flex flex-wrap gap-1.5">
              {settings.taskStatuses.map(s => (
                <span key={s} className="px-2 py-0.5 bg-white rounded border border-slate-200 text-slate-700">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="font-semibold text-slate-800 mb-2">ระดับความรุนแรงของอาการเสีย:</div>
            <div className="flex flex-wrap gap-1.5">
              {settings.issueSeverities.map(s => (
                <span key={s} className="px-2 py-0.5 bg-white rounded border border-slate-200 text-slate-700">
                  {s}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
