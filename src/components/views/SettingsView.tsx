import React, { useState } from 'react';
import { AppSettings } from '../../types';
import { Settings2, Plus, Trash2, Building2, Users, Sliders, AlertCircle } from 'lucide-react';

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

  const handleAddDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDept.trim() || settings.departments.includes(newDept.trim())) return;
    onUpdateSettings({
      ...settings,
      departments: [...settings.departments, newDept.trim()]
    });
    setNewDept('');
  };

  const handleRemoveDept = (dept: string) => {
    if (settings.departments.length <= 1) return;
    onUpdateSettings({
      ...settings,
      departments: settings.departments.filter(d => d !== dept)
    });
  };

  const handleAddAssignee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssignee.trim() || settings.assignees.includes(newAssignee.trim())) return;
    onUpdateSettings({
      ...settings,
      assignees: [...settings.assignees, newAssignee.trim()]
    });
    setNewAssignee('');
  };

  const handleRemoveAssignee = (name: string) => {
    if (settings.assignees.length <= 1) return;
    onUpdateSettings({
      ...settings,
      assignees: settings.assignees.filter(a => a !== name)
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
            <Settings2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800">
              ชีต Settings (ตั้งค่าตัวเลือก Dropdown ระบบ)
            </h2>
            <p className="text-xs text-slate-500">
              จัดการรายการ Dropdown สำหรับ Google Sheets Data Validation สามารถเพิ่ม-ลบได้ตลอดเวลาโดยไม่ต้องแก้สูตร
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section 1: Departments */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-sky-600" />
              <span>หน่วยงานรับผิดชอบ (คอลัมน์ A)</span>
            </h3>
            <span className="text-xs bg-sky-50 text-sky-700 font-semibold px-2.5 py-0.5 rounded-full border border-sky-100">
              {settings.departments.length} หน่วยงาน
            </span>
          </div>
          <p className="text-xs text-slate-500">
            รายการหน่วยงานรับผิดชอบสำหรับเลือกในแบบฟอร์มโครงการหลัก (Project_Master)
          </p>

          <form onSubmit={handleAddDept} className="flex gap-2">
            <input
              type="text"
              placeholder="พิมพ์ชื่อหน่วยงานรับผิดชอบใหม่ เช่น ฝ่ายประชาสัมพันธ์..."
              value={newDept}
              onChange={e => setNewDept(e.target.value)}
              className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-400 focus:outline-hidden"
            />
            <button
              type="submit"
              className="px-3.5 py-2 text-xs font-semibold bg-sky-600 text-white rounded-xl hover:bg-sky-700 flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>เพิ่มหน่วยงาน</span>
            </button>
          </form>

          <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto pr-1">
            {settings.departments.map((dept) => (
              <div key={dept} className="py-2.5 px-2 flex items-center justify-between text-xs text-slate-700 hover:bg-slate-50 rounded-lg group transition-colors">
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                  <span className="font-medium text-slate-800">{dept}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveDept(dept)}
                  className="px-2 py-1 text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 rounded-md transition-colors flex items-center gap-1 text-[11px] font-semibold"
                  title={`ลบหน่วยงาน "${dept}" ออกจากตัวเลือก`}
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                  <span>ลบ</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Assignees / Project Owners */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
              <Users className="w-4 h-4 text-emerald-600" />
              <span>ผู้รับผิดชอบโครงการ (คอลัมน์ B)</span>
            </h3>
            <span className="text-xs bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-0.5 rounded-full border border-emerald-100">
              {settings.assignees.length} ท่าน
            </span>
          </div>
          <p className="text-xs text-slate-500">
            รายชื่อผู้รับผิดชอบโครงการ สำหรับเลือกในโครงการหลักและงานย่อย
          </p>

          <form onSubmit={handleAddAssignee} className="flex gap-2">
            <input
              type="text"
              placeholder="พิมพ์ชื่อผู้รับผิดชอบใหม่ เช่น กิตติศักดิ์ พงศ์ไพศาล..."
              value={newAssignee}
              onChange={e => setNewAssignee(e.target.value)}
              className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-hidden"
            />
            <button
              type="submit"
              className="px-3.5 py-2 text-xs font-semibold bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>เพิ่มผู้รับผิดชอบ</span>
            </button>
          </form>

          <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto pr-1">
            {settings.assignees.map((a) => (
              <div key={a} className="py-2.5 px-2 flex items-center justify-between text-xs text-slate-700 hover:bg-slate-50 rounded-lg group transition-colors">
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="font-medium text-slate-800">{a}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveAssignee(a)}
                  className="px-2 py-1 text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 rounded-md transition-colors flex items-center gap-1 text-[11px] font-semibold"
                  title={`ลบผู้รับผิดชอบ "${a}" ออกจากตัวเลือก`}
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                  <span>ลบ</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Statuses & Severities Summary */}
        <div className="md:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-purple-600" />
            <span>สถานะระบบมาตรฐาน (Standard Statuses & Severity Scales)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            {/* Project Status */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="font-bold text-slate-700 mb-2">สถานะโครงการ (คอลัมน์ C)</div>
              <ul className="space-y-1 text-slate-600">
                {settings.projectStatuses.map(s => (
                  <li key={s} className="flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Task Status */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="font-bold text-slate-700 mb-2">สถานะงานย่อย (คอลัมน์ D)</div>
              <ul className="space-y-1 text-slate-600">
                {settings.taskStatuses.map(s => (
                  <li key={s} className="flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Issue Severity */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="font-bold text-slate-700 mb-2">ระดับความรุนแรง (คอลัมน์ E)</div>
              <ul className="space-y-1 text-slate-600">
                {settings.issueSeverities.map(s => (
                  <li key={s} className="flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Issue Status */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="font-bold text-slate-700 mb-2">สถานะการแก้ปัญหา (คอลัมน์ F)</div>
              <ul className="space-y-1 text-slate-600">
                {settings.issueStatuses.map(s => (
                  <li key={s} className="flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
