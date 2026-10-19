import React from 'react';
import { 
  LayoutDashboard, 
  ClipboardList, 
  Wrench, 
  AlertCircle, 
  Settings2, 
  FileCode2,
  CalendarRange
} from 'lucide-react';

export type TabKey = 'dashboard' | 'projects' | 'tasks' | 'issues' | 'timeline' | 'settings' | 'blueprint';

interface TabsNavProps {
  activeTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
  counts: {
    projects: number;
    tasks: number;
    issues: number;
  };
}

export const TabsNav: React.FC<TabsNavProps> = ({
  activeTab,
  onSelectTab,
  counts
}) => {
  const tabs = [
    {
      id: 'dashboard' as TabKey,
      label: 'ภาพรวมงานซ่อม',
      sublabel: 'Dashboard',
      icon: LayoutDashboard,
      activeColor: 'text-blue-600 border-blue-600 bg-blue-50/60'
    },
    {
      id: 'projects' as TabKey,
      label: 'ทะเบียนใบงานซ่อม',
      sublabel: 'Repair Orders',
      icon: ClipboardList,
      count: counts.projects,
      activeColor: 'text-sky-600 border-sky-600 bg-sky-50/60'
    },
    {
      id: 'tasks' as TabKey,
      label: 'ขั้นตอนการซ่อม',
      sublabel: 'Repair Steps',
      icon: Wrench,
      count: counts.tasks,
      activeColor: 'text-emerald-600 border-emerald-600 bg-emerald-50/60'
    },
    {
      id: 'issues' as TabKey,
      label: 'ปัญหา & อะไหล่',
      sublabel: 'Issues & Parts',
      icon: AlertCircle,
      count: counts.issues,
      activeColor: 'text-rose-600 border-rose-600 bg-rose-50/60'
    },
    {
      id: 'timeline' as TabKey,
      label: 'ไทม์ไลน์งานซ่อม',
      sublabel: 'Gantt Schedule',
      icon: CalendarRange,
      activeColor: 'text-amber-600 border-amber-600 bg-amber-50/60'
    },
    {
      id: 'settings' as TabKey,
      label: 'ตั้งค่าแผนก & ช่าง',
      sublabel: 'Settings',
      icon: Settings2,
      activeColor: 'text-slate-800 border-slate-700 bg-slate-100/70'
    },
    {
      id: 'blueprint' as TabKey,
      label: 'โครงสร้าง Sheets',
      sublabel: 'Apps Script',
      icon: FileCode2,
      activeColor: 'text-indigo-600 border-indigo-600 bg-indigo-50/60'
    }
  ];

  return (
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-1 sm:space-x-1.5 overflow-x-auto py-2 scrollbar-none" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all border ${
                  isActive
                    ? `${tab.activeColor} font-semibold shadow-2xs`
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? '' : 'text-slate-400'}`} />
                <span className="font-medium">{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`ml-1 px-1.5 py-0.5 rounded-md text-[11px] font-mono tabular-nums leading-none ${
                      isActive ? 'bg-white text-slate-800 shadow-2xs' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
