import React, { useState } from 'react';
import { Project, Task } from '../../types';
import { formatDateThai } from '../../utils/calculations';
import { CalendarRange, Layers, CheckCircle2, Flame, Clock } from 'lucide-react';

interface TimelineViewProps {
  projects: Project[];
  tasks: Task[];
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  projects,
  tasks
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');

  const filteredTasks = tasks.filter(t => {
    if (selectedProjectId !== 'all' && t.projectId !== selectedProjectId) return false;
    return true;
  }).sort((a, b) => (a.startDate || '').localeCompare(b.startDate || ''));

  // Calculate overall timeline bounds
  const allDates = [
    ...projects.map(p => p.startDate),
    ...projects.map(p => p.plannedEndDate),
    ...tasks.map(t => t.startDate),
    ...tasks.map(t => t.dueDate)
  ].filter(Boolean);

  const minDateStr = allDates.length > 0 ? allDates.reduce((min, d) => d < min ? d : min, allDates[0]) : '2026-08-01';
  const maxDateStr = allDates.length > 0 ? allDates.reduce((max, d) => d > max ? d : max, allDates[0]) : '2026-12-31';

  const minTime = new Date(minDateStr).getTime();
  const maxTime = new Date(maxDateStr).getTime();
  const totalDays = Math.max(1, Math.ceil((maxTime - minTime) / (1000 * 60 * 60 * 24)));

  const getPositionPercent = (dateStr: string) => {
    if (!dateStr) return 0;
    const time = new Date(dateStr).getTime();
    const diff = time - minTime;
    return Math.max(0, Math.min(100, (diff / (maxTime - minTime)) * 100));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-amber-200/80 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <CalendarRange className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800">
              Gantt / Timeline View (แผนภูมิเวลาโครงการและงานย่อย)
            </h2>
            <p className="text-xs text-slate-500">
              แสดงช่วงเวลาดำเนินการ วันครบกำหนด และความคืบหน้าของงานย่อยบนเส้นเวลา
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500">เลือกโครงการ:</span>
          <select
            value={selectedProjectId}
            onChange={e => setSelectedProjectId(e.target.value)}
            className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-slate-50 text-slate-700 font-medium focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
          >
            <option value="all">ทุกโครงการ ({projects.length})</option>
            {projects.map(p => (
              <option key={p.projectId} value={p.projectId}>
                {p.projectId} - {p.projectName.length > 25 ? p.projectName.substring(0, 25) + '...' : p.projectName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Gantt Bar Chart Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-6">
        {/* Date Headers preview */}
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400 border-b border-slate-100 pb-2">
          <span>จุดเริ่มต้น: {formatDateThai(minDateStr)}</span>
          <span className="text-slate-300">ระยะเวลารวม ~{totalDays} วัน</span>
          <span>จุดสิ้นสุด: {formatDateThai(maxDateStr)}</span>
        </div>

        {/* Task Timeline Bars */}
        <div className="space-y-4">
          {filteredTasks.map((task) => {
            const startPct = getPositionPercent(task.startDate);
            const endPct = getPositionPercent(task.dueDate);
            const widthPct = Math.max(3, endPct - startPct);

            const isDone = task.status === 'เสร็จสิ้น';
            const isOverdue = (task.daysOverdue ?? 0) > 0;

            const barBg = isDone 
              ? 'bg-emerald-500' 
              : isOverdue 
              ? 'bg-orange-500' 
              : 'bg-sky-500';

            return (
              <div key={task.taskId} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-semibold">
                      {task.projectId}
                    </span>
                    <span className="font-medium text-slate-800 truncate max-w-xs">
                      {task.taskName}
                    </span>
                    <span className="text-[10px] text-slate-400 hidden sm:inline">
                      ({task.assignee.split(' ')[0]})
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-[11px]">
                    <span className="font-mono font-bold text-slate-600">{task.progress}%</span>
                    <span className="text-slate-400">
                      {formatDateThai(task.startDate)} → {formatDateThai(task.dueDate)}
                    </span>
                  </div>
                </div>

                {/* Timeline Bar Track */}
                <div className="relative h-6 bg-slate-50 rounded-lg overflow-hidden border border-slate-100">
                  {/* Active Bar Range */}
                  <div
                    className={`absolute top-1 bottom-1 rounded-md transition-all ${barBg} opacity-85 flex items-center px-2`}
                    style={{
                      left: `${startPct}%`,
                      width: `${widthPct}%`
                    }}
                  >
                    <span className="text-[10px] font-bold text-white whitespace-nowrap overflow-hidden">
                      {task.progress}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredTasks.length === 0 && (
            <div className="text-center py-12 text-xs text-slate-400">
              ไม่พบงานย่อยตามเงื่อนไขที่เลือก
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
