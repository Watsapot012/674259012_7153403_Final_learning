import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function ConfirmDialog({
  isOpen,
  title = 'ยืนยันการลบข้อมูล',
  resourceName = '',
  onConfirm,
  onCancel,
  isDeleting = false,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {title}
              </h3>
              <p className="text-sm text-slate-600 mb-2">
                คุณแน่ใจหรือไม่ว่าต้องการลบสื่อการเรียนรู้นี้? การกระทำนี้ไม่สามารถย้อนกลับได้
              </p>
              {resourceName && (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-sm font-medium text-slate-800 break-words mb-2">
                  &ldquo;{resourceName}&rdquo;
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:opacity-50 transition cursor-pointer"
          >
            ยกเลิก
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 disabled:opacity-50 transition shadow-xs cursor-pointer"
          >
            {isDeleting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span>กำลังลบ...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>ยืนยันการลบ</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
