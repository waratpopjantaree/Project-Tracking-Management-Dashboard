import React from 'react';
import { AlertTriangle, Trash2, X, AlertCircle } from 'lucide-react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  itemName: string;
  itemId: string;
  itemType: 'project' | 'task' | 'issue' | 'reset';
  associatedInfo?: {
    tasksCount?: number;
    issuesCount?: number;
  };
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  itemName,
  itemId,
  itemType,
  associatedInfo
}) => {
  if (!isOpen) return null;

  const hasAssociatedData = 
    (associatedInfo?.tasksCount && associatedInfo.tasksCount > 0) || 
    (associatedInfo?.issuesCount && associatedInfo.issuesCount > 0);

  const getItemTypeLabel = () => {
    switch (itemType) {
      case 'project':
        return 'ใบงานซ่อม';
      case 'task':
        return 'ขั้นตอนการซ่อม';
      case 'issue':
        return 'ปัญหา / รายการขออะไหล่';
      default:
        return 'ข้อมูล';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-rose-100 bg-rose-50/70">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center shadow-xs">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">{title}</h3>
              <p className="text-xs text-rose-600 font-medium">การกระทำนี้ไม่สามารถย้อนกลับได้</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-xs text-slate-600">
          {itemType === 'reset' ? (
            <p className="text-slate-700 leading-relaxed">
              คุณต้องการรีเซ็ตข้อมูลงานซ่อม ขั้นตอน และปัญหาทั้งหมด กลับเป็นข้อมูลตัวอย่างเริ่มต้นใช่หรือไม่? ข้อมูลที่คุณบันทึกใหม่ทั้งหมดจะถูกลบออก
            </p>
          ) : (
            <div>
              <p className="text-slate-700 leading-relaxed mb-3">
                คุณแน่ใจหรือไม่ว่าต้องการลบ{getItemTypeLabel()}นี้ออกจากระบบ?
              </p>

              {/* Item Card */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-blue-700 bg-white border border-slate-200 px-2 py-0.5 rounded text-[11px]">
                    {itemId}
                  </span>
                  <span className="font-semibold text-slate-900 truncate">
                    {itemName}
                  </span>
                </div>
              </div>

              {/* Associated data warning for repair orders */}
              {itemType === 'project' && hasAssociatedData && (
                <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 space-y-1.5">
                  <div className="flex items-center space-x-1.5 font-bold text-xs text-amber-900">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>ข้อมูลที่เกี่ยวข้องจะถูกลบไปด้วยโดยอัตโนมัติ:</span>
                  </div>
                  <ul className="pl-6 list-disc text-[11px] space-y-0.5">
                    {associatedInfo?.tasksCount ? (
                      <li>ขั้นตอนการซ่อมทั้งหมด {associatedInfo.tasksCount} รายการ</li>
                    ) : null}
                    {associatedInfo?.issuesCount ? (
                      <li>บันทึกปัญหาและอะไหล่ทั้งหมด {associatedInfo.issuesCount} รายการ</li>
                    ) : null}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            ยกเลิก
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors flex items-center space-x-1.5 shadow-xs"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>ยืนยันการลบ</span>
          </button>
        </div>
      </div>
    </div>
  );
};
