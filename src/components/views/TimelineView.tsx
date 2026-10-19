import React, { useState } from 'react';
import { Project, Task } from '../../types';
import { formatDateThai } from '../../utils/calculations';
import { CalendarRange, Wrench, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

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

  const minDateStr = allDates.length > 0 ? allDates.reduce((min, d) => d < min ? d : min, allDates[0]) : '2026-09-01';
  const maxDateStr = allDates.length > 0 ? allDates.reduce((max, d) => d > max ? d : max, allDates[0]) : '2026-11-30';

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
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <CalendarRange className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              ไทม์ไลน์งานซ่อม (Repair Schedule & Timeline)
            </h2>
            <p className="text-xs text-slate-500">
              แผนภูมิแกนต์แสดงช่วงเวลาเข้าซ่อมบำรุง วันกำหนดเสร็จ และความคืบหน้าของแต่ละขั้นตอน
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500">เลือกใบงานซ่อม:</span>
          <select
            value={selectedProjectId}
            onChange={e => setSelectedProjectId(e.target.value)}
            className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 text-slate-700 font-medium focus:ring-2 focus:ring-amber-500 focus:outline-hidden max-w-[240px] truncate"
          >
            <option value="all">ทุกใบงานซ่อม ({projects.length})</option>
            {projects.map(p => (
              <option key={p.projectId} value={p.projectId}>
                {p.projectId} - {p.projectName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Gantt Bar Chart Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-5">
        
        {/* Date Headers */}
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 border-b border-slate-100 pb-3">
          <span className="font-mono">เริ่มต้น: {formatDateThai(minDateStr)}</span>
          <span className="text-slate-400 font-normal font-mono">ช่วงเวลารวม {totalDays} วัน</span>
          <span className="font-mono">สิ้นสุด: {formatDateThai(maxDateStr)}</span>
        </div>

        {/* Task Timeline Bars */}
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              ไม่พบขั้นตอนงานซ่อมที่เลือก
            </div>
          ) : (
            filteredTasks.map((task) => {
              const startPct = getPositionPercent(task.startDate);
              const endPct = getPositionPercent(task.dueDate);
              const widthPct = Math.max(4, endPct - startPct);

              const isDone = task.status === 'เสร็จสิ้น';
              const isOverdue = (task.daysOverdue ?? 0) > 0;

              const barBg = isDone 
                ? 'bg-emerald-500' 
                : isOverdue 
                ? 'bg-rose-500' 
                : 'bg-blue-600';

              return (
                <div key={task.taskId} className="space-y-1.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-slate-700 bg-slate-100 px-1.5 py-0.2 rounded text-[11px]">
                        {task.taskId}
                      </span>
                      <span className="font-medium text-slate-800 line-clamp-1">
                        {task.taskName}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        ({task.projectId})
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 text-[11px] text-slate-500 shrink-0">
                      <span>ช่าง: {task.assignee.split(' ')[0]}</span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="font-mono tabular-nums">{task.progress}%</span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="font-mono tabular-nums">{formatDateThai(task.startDate)} - {formatDateThai(task.dueDate)}</span>
                    </div>
                  </div>

                  {/* Relative Timeline Bar */}
                  <div className="relative w-full bg-slate-100 h-6 rounded-lg overflow-hidden border border-slate-200/60">
                    <div
                      className={`absolute top-0 bottom-0 rounded-md ${barBg} transition-all duration-300 flex items-center justify-end px-2 text-[10px] text-white font-bold font-mono shadow-xs`}
                      style={{
                        left: `${startPct}%`,
                        width: `${widthPct}%`
                      }}
                    >
                      <span className="truncate">{task.progress}%</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Legend */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-4 text-xs text-slate-500">
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded bg-emerald-500" />
            <span>ซ่อมเสร็จสิ้น (100%)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded bg-blue-600" />
            <span>กำลังดำเนินการ</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded bg-rose-500" />
            <span>เลยกำหนดส่งมอบ (Overdue)</span>
          </div>
        </div>

      </div>

    </div>
  );
};
