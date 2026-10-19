import React from 'react';
import { 
  Wrench, 
  Plus, 
  AlertTriangle, 
  CheckSquare, 
  Code2, 
  RotateCcw,
  ShieldCheck,
  ClipboardList
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
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Zone 1: Brand & Identity */}
          <div className="flex items-center space-x-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center shadow-xs">
              <Wrench className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  การติดตามงานซ่อม
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  ระบบงานซ่อมบำรุง
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                ระบบบริหารจัดการ ติดตามใบแจ้งซ่อม และควบคุมงานบำรุงรักษา
              </p>
            </div>
          </div>

          {/* Zone 3: Primary Action Affordances */}
          <div className="flex items-center space-x-2 sm:space-x-2.5 shrink-0">
            <button
              onClick={onResetData}
              title="รีเซ็ตเป็นข้อมูลงานซ่อมตัวอย่างเริ่มต้น"
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors text-xs flex items-center"
            >
              <RotateCcw className="w-3.5 h-3.5 sm:mr-1 text-slate-400" />
              <span className="hidden md:inline">รีเซ็ตข้อมูล</span>
            </button>

            <button
              onClick={onOpenBlueprint}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-xs ${
                activeTab === 'blueprint'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">สูตร Google Sheets</span>
              <span className="sm:hidden">สูตร Sheets</span>
            </button>

            <div className="h-5 w-px bg-slate-200 mx-0.5 hidden sm:block" />

            <button
              onClick={onOpenNewTask}
              className="px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 flex items-center space-x-1 transition-all"
              title="เพิ่มขั้นตอนงานซ่อมย่อย"
            >
              <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">+ ขั้นตอนซ่อม</span>
              <span className="sm:hidden">+ ขั้นตอน</span>
            </button>

            <button
              onClick={onOpenNewIssue}
              className="px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 flex items-center space-x-1 transition-all"
              title="บันทึกปัญหาอาการเสียหรือรออะไหล่"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <span className="hidden sm:inline">+ ปัญหา/อะไหล่</span>
              <span className="sm:hidden">+ ปัญหา</span>
            </button>

            {/* Primary Dominant Action */}
            <button
              onClick={onOpenNewProject}
              className="px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-xs flex items-center space-x-1.5 transition-all active:scale-98"
            >
              <Plus className="w-4 h-4" />
              <span className="whitespace-nowrap font-medium">+ เปิดใบแจ้งซ่อม</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
