import React, { useState } from 'react';
import { X, Calendar, User, Tag, BookOpen, Clock, Copy, Check } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function ResourceDetail({ isOpen, resource, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !resource) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (_e) {
      return dateStr;
    }
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return '-';
    try {
      const date = new Date(dateStr);
      return date.toLocaleString('th-TH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (_e) {
      return dateStr;
    }
  };

  const handleCopyTitle = () => {
    if (resource.title) {
      navigator.clipboard.writeText(resource.title);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="px-6 py-4.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600/30 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">รายละเอียดสื่อการเรียนรู้</h3>
              <p className="text-xs text-slate-400">รหัสอ้างอิง: #{resource.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition cursor-pointer"
            aria-label="ปิดหน้าต่าง"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Title Header with Copy Action */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs font-semibold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                  ID: #{resource.id}
                </span>
                <StatusBadge status={resource.status} />
              </div>
              <h2 className="text-lg font-bold text-slate-900 leading-snug mt-1">
                {resource.title}
              </h2>
            </div>
            <button
              type="button"
              onClick={handleCopyTitle}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer shrink-0"
              title="คัดลอกชื่อสื่อ"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">คัดลอกแล้ว</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>คัดลอกชื่อ</span>
                </>
              )}
            </button>
          </div>

          {/* Metadata Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="p-3.5 bg-white rounded-xl border border-slate-200/90 shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
                <User className="w-4 h-4 text-blue-600" />
                <span>ผู้สร้างสื่อ</span>
              </div>
              <div className="text-sm font-semibold text-slate-900 break-words">
                {resource.creator}
              </div>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-slate-200/90 shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
                <Tag className="w-4 h-4 text-purple-600" />
                <span>หมวดหมู่</span>
              </div>
              <div className="text-sm font-semibold text-slate-900">
                {resource.category}
              </div>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-slate-200/90 shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>วันที่เผยแพร่</span>
              </div>
              <div className="text-sm font-semibold text-slate-900 font-mono">
                {formatDate(resource.publishedDate)}
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              รายละเอียดเนื้อหา
            </h4>
            <div className="p-4.5 bg-slate-50/70 rounded-xl border border-slate-200 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
              {resource.description}
            </div>
          </div>

          {/* Audit Timestamps */}
          {(resource.createdAt || resource.updatedAt) && (
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-400 font-mono">
              {resource.createdAt && (
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>บันทึกเมื่อ: {formatDateTime(resource.createdAt)}</span>
                </div>
              )}
              {resource.updatedAt && (
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>แก้ไขล่าสุด: {formatDateTime(resource.updatedAt)}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition cursor-pointer shadow-2xs"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
}
