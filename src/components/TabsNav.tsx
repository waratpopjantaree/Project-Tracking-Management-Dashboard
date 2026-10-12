import React from 'react';
import { 
  LayoutDashboard, 
  FolderGit2, 
  ListTodo, 
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
      label: 'Dashboard (สรุปภาพรวม)',
      shortLabel: 'Dashboard',
      icon: LayoutDashboard,
      color: 'text-purple-600',
      activeBg: 'bg-purple-50 text-purple-700 border-purple-500'
    },
    {
      id: 'projects' as TabKey,
      label: 'Project_Master (ทะเบียนโครงการ)',
      shortLabel: 'Project_Master',
      icon: FolderGit2,
      count: counts.projects,
      color: 'text-sky-600',
      activeBg: 'bg-sky-50 text-sky-700 border-sky-500'
    },
    {
      id: 'tasks' as TabKey,
      label: 'Task_Tracking (ติดตามงานย่อย)',
      shortLabel: 'Task_Tracking',
      icon: ListTodo,
      count: counts.tasks,
      color: 'text-emerald-600',
      activeBg: 'bg-emerald-50 text-emerald-700 border-emerald-500'
    },
    {
      id: 'issues' as TabKey,
      label: 'Issue_Log (บันทึกปัญหา)',
      shortLabel: 'Issue_Log',
      icon: AlertCircle,
      count: counts.issues,
      color: 'text-rose-600',
      activeBg: 'bg-rose-50 text-rose-700 border-rose-500'
    },
    {
      id: 'timeline' as TabKey,
      label: 'Gantt / Timeline (แผนภูมิเวลา)',
      shortLabel: 'Timeline',
      icon: CalendarRange,
      color: 'text-amber-600',
      activeBg: 'bg-amber-50 text-amber-700 border-amber-500'
    },
    {
      id: 'settings' as TabKey,
      label: 'Settings (ตั้งค่าตัวเลือก)',
      shortLabel: 'Settings',
      icon: Settings2,
      color: 'text-slate-600',
      activeBg: 'bg-slate-100 text-slate-800 border-slate-500'
    },
    {
      id: 'blueprint' as TabKey,
      label: '📖 สูตร Google Sheets & Apps Script',
      shortLabel: 'สูตร & Script',
      icon: FileCode2,
      color: 'text-indigo-600',
      activeBg: 'bg-indigo-50 text-indigo-700 border-indigo-600'
    }
  ];

  return (
    <div className="bg-white border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 scrollbar-none" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all border ${
                  isActive
                    ? `${tab.activeBg} font-semibold shadow-2xs`
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${tab.color}`} />
                <span className="hidden md:inline">{tab.label}</span>
                <span className="md:hidden">{tab.shortLabel}</span>
                {tab.count !== undefined && (
                  <span
                    className={`ml-1.5 px-1.5 py-0.2 rounded-full text-xs font-semibold ${
                      isActive ? 'bg-white/80 text-slate-800' : 'bg-slate-100 text-slate-600'
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
