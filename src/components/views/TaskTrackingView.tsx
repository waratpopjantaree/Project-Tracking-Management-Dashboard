import React, { useState } from 'react';
import { Task, Project, AppSettings, TaskStatus } from '../../types';
import { 
  formatDateThai, 
  enrichTasks 
} from '../../utils/calculations';
import { exportTasksToTSV } from '../../utils/exportUtils';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Copy, 
  Check, 
  ListTodo, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Flame,
  Filter,
  Layers
} from 'lucide-react';

interface TaskTrackingViewProps {
  tasks: Task[];
  projects: Project[];
  settings: AppSettings;
  onAddTask: () => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

export const TaskTrackingView: React.FC<TaskTrackingViewProps> = ({
  tasks,
  projects,
  settings,
  onAddTask,
  onEditTask,
  onDeleteTask
}) => {
  const [search, setSearch] = useState('');
  const [projectFilter, setProjectFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [overdueOnly, setOverdueOnly] = useState(false);
  const [copied, setCopied] = useState(false);

  const enriched = enrichTasks(tasks, projects);

  const filtered = enriched.filter(t => {
    if (projectFilter !== 'all' && t.projectId !== projectFilter) return false;
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    if (overdueOnly && (t.daysOverdue ?? 0) <= 0) return false;
    if (search) {
      const q = search.toLowerCase();
      return t.taskName.toLowerCase().includes(q) ||
             t.taskId.toLowerCase().includes(q) ||
             t.assignee.toLowerCase().includes(q) ||
             (t.projectName && t.projectName.toLowerCase().includes(q));
    }
    return true;
  });

  const handleCopyTSV = () => {
    const tsv = exportTasksToTSV(enriched);
    navigator.clipboard.writeText(tsv);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
      {/* Top Banner & Actions */}
      <div className="bg-white p-5 rounded-2xl border border-emerald-200/80 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <ListTodo className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-slate-800">
                  ชีต Task_Tracking (ติดตามงานย่อย)
                </h2>
                <span className="text-xs bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                  {tasks.length} งานย่อย
                </span>
              </div>
              <p className="text-xs text-slate-500">
                เชื่อมโยงกับ Project_Master คำนวณน้ำหนักงาน (Weight %) วันคงเหลือ และตรวจจับงานล่าช้าอัตโนมัติ
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              onClick={handleCopyTSV}
              className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center space-x-1.5 transition-colors border border-slate-200"
              title="คัดลอกตารางนี้ไปวางลง Google Sheets ได้ทันที"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'คัดลอกแล้ว!' : 'คัดลอกไป Google Sheets'}</span>
            </button>

            <button
              onClick={onAddTask}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center space-x-1.5 shadow-xs shadow-emerald-500/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>เพิ่มงานย่อยใหม่</span>
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="ค้นหาชื่องานย่อย, รหัส, ผู้รับผิดชอบ..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg w-full bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-400 focus:outline-hidden"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Filter by Project */}
            <select
              value={projectFilter}
              onChange={e => setProjectFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 text-slate-700 focus:ring-2 focus:ring-emerald-400 focus:outline-hidden font-medium"
            >
              <option value="all">ทุกโครงการ ({projects.length})</option>
              {projects.map(p => (
                <option key={p.projectId} value={p.projectId}>
                  {p.projectId} - {p.projectName.length > 20 ? p.projectName.substring(0, 20) + '...' : p.projectName}
                </option>
              ))}
            </select>

            {/* Filter by Status */}
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 text-slate-700 focus:ring-2 focus:ring-emerald-400 focus:outline-hidden"
            >
              <option value="all">ทุกสถานะ</option>
              {settings.taskStatuses.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            {/* Overdue checkbox */}
            <label className="flex items-center space-x-1.5 text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-1.5 rounded-lg border border-rose-200 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={overdueOnly}
                onChange={e => setOverdueOnly(e.target.checked)}
                className="rounded text-rose-600 focus:ring-rose-400"
              />
              <Flame className="w-3.5 h-3.5 text-rose-600" />
              <span>เฉพาะงานที่ล่าช้า</span>
            </label>
          </div>
        </div>
      </div>

      {/* Interactive Sheet Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 border-collapse">
            <thead>
              <tr className="bg-emerald-50/70 text-slate-800 font-bold border-b border-emerald-100 text-[11px] uppercase tracking-wider">
                <th className="py-3 px-3 w-20">Task_ID</th>
                <th className="py-3 px-3">Project_ID</th>
                <th className="py-3 px-4 min-w-[200px]">ชื่องานย่อย</th>
                <th className="py-3 px-3">ผู้รับผิดชอบ</th>
                <th className="py-3 px-3">กำหนดการ</th>
                <th className="py-3 px-2 text-center">น้ำหนัก</th>
                <th className="py-3 px-3 min-w-[120px]">ความคืบหน้า</th>
                <th className="py-3 px-3 text-center">สถานะ</th>
                <th className="py-3 px-3 text-center">เหลือ / ล่าช้า</th>
                <th className="py-3 px-3 text-center w-20">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal">
              {filtered.map((t) => {
                const isDone = t.status === 'เสร็จสิ้น';
                const isOverdue = (t.daysOverdue ?? 0) > 0;
                const isNearDue = (t.daysRemaining ?? 99) <= 3 && !isDone && !isOverdue;

                return (
                  <tr 
                    key={t.taskId} 
                    className={`hover:bg-slate-50/80 transition-colors ${
                      isOverdue ? 'bg-orange-50/30' : ''
                    }`}
                  >
                    {/* Task ID */}
                    <td className="py-3 px-3 font-mono font-bold text-emerald-700 bg-emerald-50/20">
                      {t.taskId}
                    </td>

                    {/* Project ID & Lookup Name */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="font-mono font-bold text-sky-700">{t.projectId}</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[120px]">
                        {t.projectName}
                      </div>
                    </td>

                    {/* Task Name & Details */}
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1 py-0.2 rounded">
                          #{t.taskOrder}
                        </span>
                        <span className="font-semibold text-slate-900">{t.taskName}</span>
                      </div>
                      {t.description && (
                        <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                          {t.description}
                        </div>
                      )}
                    </td>

                    {/* Assignee */}
                    <td className="py-3 px-3 text-slate-700 font-medium whitespace-nowrap">
                      {t.assignee}
                    </td>

                    {/* Dates */}
                    <td className="py-3 px-3 whitespace-nowrap text-[11px]">
                      <div>กำหนด: {formatDateThai(t.dueDate)}</div>
                      {t.actualDate ? (
                        <div className="text-emerald-600 font-medium">เสร็จ: {formatDateThai(t.actualDate)}</div>
                      ) : (
                        <div className="text-slate-400">เริ่ม: {formatDateThai(t.startDate)}</div>
                      )}
                    </td>

                    {/* Weight */}
                    <td className="py-3 px-2 text-center font-bold text-slate-700">
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-xs">
                        {t.weight}%
                      </span>
                    </td>

                    {/* Progress */}
                    <td className="py-3 px-3">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 mb-1">
                        <span>{t.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            isDone ? 'bg-emerald-500' :
                            isOverdue ? 'bg-orange-500' :
                            'bg-sky-500'
                          }`}
                          style={{ width: `${Math.min(100, t.progress)}%` }}
                        />
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                        isDone ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                        t.status === 'กำลังดำเนินการ' ? 'bg-sky-100 text-sky-800 border border-sky-200' :
                        t.status === 'รอดำเนินการ' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {t.status}
                      </span>
                    </td>

                    {/* Remaining / Overdue Alert */}
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      {isDone ? (
                        <span className="text-[11px] text-emerald-600 font-semibold flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> เสร็จสิ้น
                        </span>
                      ) : isOverdue ? (
                        <span className="inline-block px-2 py-0.5 bg-orange-100 text-orange-800 font-bold rounded text-[11px]">
                          ล่าช้า {t.daysOverdue} วัน
                        </span>
                      ) : isNearDue ? (
                        <span className="inline-block px-2 py-0.5 bg-amber-100 text-amber-800 font-bold rounded text-[11px]">
                          เหลือ {t.daysRemaining} วัน
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-500">
                          เหลือ {t.daysRemaining} วัน
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          onClick={() => onEditTask(t)}
                          title="แก้ไขงานย่อย"
                          className="p-1 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`ยืนยันการลบงาน ${t.taskId}: ${t.taskName} ?`)) {
                              onDeleteTask(t.taskId);
                            }
                          }}
                          title="ลบงานย่อย"
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-xs text-slate-400">
                    ไม่พบข้อมูลงานย่อยตามเงื่อนไขที่เลือก
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
