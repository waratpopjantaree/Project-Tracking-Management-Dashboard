import React from 'react';
import { 
  FolderKanban, 
  PlusCircle, 
  AlertTriangle, 
  CheckSquare, 
  Code2, 
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface HeaderProps {
  onOpenNewProject: () => void;
  onOpenNewTask: () => void;
  onOpenNewIssue: () => void;
  onOpenBlueprint: () => void;
  onResetData: () => void;
  activeTab: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNewProject,
  onOpenNewTask,
  onOpenNewIssue,
  onOpenBlueprint,
  onResetData,
  activeTab
}) => {
  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & System Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center text-white shadow-sm shadow-sky-500/20">
              <FolderKanban className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  Repair tracking
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Google Sheets Ready
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                ระบบติดตามและบริหารงานซ่อม พร้อม Dashboard อัตโนมัติและ Apps Script
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-2.5">
            <button
              onClick={onResetData}
              title="รีเซ็ตเป็นข้อมูลตัวอย่างเริ่มต้น"
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors text-xs flex items-center"
            >
              <RotateCcw className="w-4 h-4 sm:mr-1" />
              <span className="hidden md:inline">รีเซ็ตข้อมูล</span>
            </button>

            <button
              onClick={onOpenBlueprint}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-xs ${
                activeTab === 'blueprint'
                  ? 'bg-purple-600 text-white shadow-purple-200'
                  : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>สูตร & Apps Script</span>
            </button>

            <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />

            <button
              onClick={onOpenNewProject}
              className="px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 flex items-center space-x-1 transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5 text-sky-600" />
              <span className="hidden sm:inline">+ โครงการใหม่</span>
              <span className="sm:hidden">+ โครงการ</span>
            </button>

            <button
              onClick={onOpenNewTask}
              className="px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 flex items-center space-x-1 transition-all"
            >
              <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">+ งานย่อย</span>
              <span className="sm:hidden">+ งาน</span>
            </button>

            <button
              onClick={onOpenNewIssue}
              className="px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 flex items-center space-x-1 transition-all"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <span className="hidden sm:inline">+ บันทึกปัญหา</span>
              <span className="sm:hidden">+ ปัญหา</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
