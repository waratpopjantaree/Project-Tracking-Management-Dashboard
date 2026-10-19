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
  Wrench, 
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

  const getStatusStyle = (status: TaskStatus) => {
    switch (status) {
      case 'เสร็จสิ้น':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'กำลังดำเนินการ':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'รอดำเนินการ':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'ยกเลิก':
        return 'bg-slate-100 text-slate-500 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
      
      {/* Top Banner & Actions */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <Wrench className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-slate-900">
                  ขั้นตอนการซ่อม (Repair Steps & Tasks)
                </h2>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-mono tabular-nums">
                  {tasks.length} ขั้นตอน
                </span>
              </div>
              <p className="text-xs text-slate-500">
                ติดตามขั้นตอนการซ่อมแต่ละจุด คำนวณน้ำหนักงาน (Weight %) วันคงเหลือ และตรวจจับงานล่าช้าอัตโนมัติ
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              onClick={handleCopyTSV}
              className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg flex items-center space-x-1.5 transition-colors border border-slate-200"
              title="คัดลอกตารางนี้ไปวางลง Google Sheets ได้ทันที"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copied ? 'คัดลอกแล้ว!' : 'คัดลอกไป Sheets'}</span>
            </button>

            <button
              onClick={onAddTask}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center space-x-1.5 shadow-xs transition-all active:scale-98"
            >
              <Plus className="w-4 h-4" />
              <span>+ เพิ่มขั้นตอนงานซ่อม</span>
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="ค้นหาชื่องานซ่อม, รหัสขั้นตอน, หรือชื่อช่าง..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg w-full bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
            {/* Filter by Repair Order */}
            <div className="flex items-center space-x-1.5">
              <span className="text-xs text-slate-500">ใบงานซ่อม:</span>
              <select
                value={projectFilter}
                onChange={e => setProjectFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-medium max-w-[200px] truncate"
              >
                <option value="all">ทุกใบงานซ่อม ({projects.length})</option>
                {projects.map(p => (
                  <option key={p.projectId} value={p.projectId}>
                    {p.projectId} - {p.projectName}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter by Status */}
            <div className="flex items-center space-x-1.5">
              <span className="text-xs text-slate-500">สถานะ:</span>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-medium"
              >
                <option value="all">ทุกสถานะ</option>
                {settings.taskStatuses.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Overdue toggle */}
            <button
              onClick={() => setOverdueOnly(!overdueOnly)}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors border ${
                overdueOnly
                  ? 'bg-rose-50 text-rose-700 border-rose-300'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              เฉพาะที่ล่าช้า
            </button>
          </div>
        </div>
      </div>

      {/* Sheet Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                <th className="py-3 px-3 w-28">รหัสขั้นตอน</th>
                <th className="py-3 px-3 w-28">ใบงานซ่อม</th>
                <th className="py-3 px-2 text-center w-12">ลำดับ</th>
                <th className="py-3 px-4 min-w-[240px]">ขั้นตอนการซ่อมและรายละเอียด</th>
                <th className="py-3 px-3">ช่างผู้รับผิดชอบ</th>
                <th className="py-3 px-3">กำหนดเสร็จ</th>
                <th className="py-3 px-2 text-right">น้ำหนัก</th>
                <th className="py-3 px-3 min-w-[120px]">ความคืบหน้า</th>
                <th className="py-3 px-3 text-center">สถานะ</th>
                <th className="py-3 px-3 text-center">กำหนดเวลา</th>
                <th className="py-3 px-3 text-center w-28">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal">
              {filtered.map((t) => {
                const isOverdue = (t.daysOverdue ?? 0) > 0 && t.status !== 'เสร็จสิ้น';
                const isCompleted = t.status === 'เสร็จสิ้น';

                return (
                  <tr key={t.taskId} className="hover:bg-slate-50/70 transition-colors">
                    {/* Task ID */}
                    <td className="py-3 px-3 font-mono font-bold text-emerald-700 bg-emerald-50/20 whitespace-nowrap">
                      {t.taskId}
                    </td>

                    {/* Project ID */}
                    <td className="py-3 px-3 whitespace-nowrap font-mono text-xs">
                      <span className="text-blue-700 font-bold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                        {t.projectId}
                      </span>
                    </td>

                    {/* Order */}
                    <td className="py-3 px-2 text-center font-bold text-slate-500 font-mono tabular-nums">
                      #{t.taskOrder}
                    </td>

                    {/* Task Name */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{t.taskName}</div>
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

                    {/* Due Date */}
                    <td className="py-3 px-3 whitespace-nowrap text-[11px] font-mono tabular-nums">
                      <div>{formatDateThai(t.dueDate)}</div>
                      {t.actualDate && (
                        <div className="text-emerald-600">เสร็จ: {formatDateThai(t.actualDate)}</div>
                      )}
                    </td>

                    {/* Weight */}
                    <td className="py-3 px-2 text-right font-mono text-slate-600 tabular-nums">
                      {t.weight}%
                    </td>

                    {/* Progress */}
                    <td className="py-3 px-3">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 mb-1 font-mono tabular-nums">
                        <span>{t.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-1.5 rounded-full transition-all duration-500 ${
                            isCompleted ? 'bg-emerald-500' : isOverdue ? 'bg-rose-500' : 'bg-blue-600'
                          }`}
                          style={{ width: `${Math.min(100, t.progress)}%` }}
                        />
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium border ${getStatusStyle(t.status)}`}>
                        {t.status}
                      </span>
                    </td>

                    {/* Timing Status */}
                    <td className="py-3 px-3 text-center whitespace-nowrap font-mono text-[11px] tabular-nums">
                      {isCompleted ? (
                        <span className="text-emerald-700 font-medium">เสร็จเรียบร้อย</span>
                      ) : isOverdue ? (
                        <span className="text-rose-600 font-bold bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                          ล่าช้า {t.daysOverdue} วัน
                        </span>
                      ) : (
                        <span className="text-slate-500">
                          เหลือ {t.daysRemaining} วัน
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center space-x-1.5">
                        <button
                          onClick={() => onEditTask(t)}
                          title="แก้ไขขั้นตอนการซ่อม"
                          className="px-2 py-1 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 rounded text-xs flex items-center space-x-1 transition-colors"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>แก้ไข</span>
                        </button>
                        <button
                          onClick={() => onDeleteTask(t.taskId)}
                          title="ลบขั้นตอนนี้"
                          className="px-2 py-1 text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 rounded text-xs flex items-center space-x-1 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>ลบ</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={11} className="py-16 text-center text-xs">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center">
                        <Wrench className="w-6 h-6" />
                      </div>
                      <div className="font-bold text-slate-800 text-sm">ยังไม่มีขั้นตอนการซ่อมตามตัวกรอง</div>
                      <p className="text-slate-500 max-w-sm">
                        คุณสามารถเพิ่มขั้นตอนการซ่อมย่อยเพื่อบันทึกและตรวจวัดความคืบหน้าของงานซ่อมได้ทันที
                      </p>
                      <button
                        onClick={onAddTask}
                        className="mt-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg flex items-center space-x-1.5 shadow-xs transition-all"
                      >
                        <Plus className="w-4 h-4" />
                        <span>+ เพิ่มขั้นตอนงานซ่อม</span>
                      </button>
                    </div>
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
