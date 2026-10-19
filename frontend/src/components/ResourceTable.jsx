import React from 'react';
import { Eye, Edit3, Trash2, Calendar, User, Tag } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function ResourceTable({
  resources = [],
  onViewDetail,
  onEdit,
  onDelete,
}) {
  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (_e) {
      return dateStr;
    }
  };

  const getCategoryStyle = (category) => {
    switch (category) {
      case 'เทคโนโลยี':
        return 'bg-blue-50/90 text-blue-700 border-blue-200/90';
      case 'วิทยาศาสตร์':
        return 'bg-purple-50/90 text-purple-700 border-purple-200/90';
      case 'วรรณกรรม':
        return 'bg-amber-50/90 text-amber-800 border-amber-200/90';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
      {/* Desktop & Tablet Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/90 border-b border-slate-200 text-xs font-semibold text-slate-600 tracking-wider">
              <th className="py-3.5 px-4 text-center w-20">รหัส</th>
              <th className="py-3.5 px-4 min-w-[260px]">ชื่อสื่อการเรียนรู้</th>
              <th className="py-3.5 px-4 min-w-[150px]">ผู้สร้าง</th>
              <th className="py-3.5 px-4 min-w-[130px]">หมวดหมู่</th>
              <th className="py-3.5 px-4 min-w-[130px]">วันที่เผยแพร่</th>
              <th className="py-3.5 px-4 text-center min-w-[110px]">สถานะ</th>
              <th className="py-3.5 px-4 text-center min-w-[150px]">การจัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {resources.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-blue-50/30 transition-colors group"
              >
                {/* รหัส ID */}
                <td className="py-4 px-4 text-center">
                  <span className="font-mono text-xs font-medium text-slate-500 bg-slate-100/80 px-2 py-0.5 rounded">
                    #{item.id}
                  </span>
                </td>

                {/* ชื่อสื่อการเรียนรู้ */}
                <td className="py-4 px-4">
                  <button
                    type="button"
                    onClick={() => onViewDetail(item)}
                    className="text-left font-semibold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-1 cursor-pointer"
                  >
                    {item.title}
                  </button>
                  {item.description && (
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5 max-w-xl">
                      {item.description}
                    </p>
                  )}
                </td>

                {/* ผู้สร้าง */}
                <td className="py-4 px-4 text-slate-700 font-medium">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate max-w-[160px]">{item.creator}</span>
                  </div>
                </td>

                {/* หมวดหมู่ */}
                <td className="py-4 px-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${getCategoryStyle(
                      item.category
                    )}`}
                  >
                    {item.category}
                  </span>
                </td>

                {/* วันที่เผยแพร่ */}
                <td className="py-4 px-4 text-slate-600 font-mono text-xs whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{formatDate(item.publishedDate)}</span>
                  </div>
                </td>

                {/* สถานะ */}
                <td className="py-4 px-4 text-center whitespace-nowrap">
                  <StatusBadge status={item.status} />
                </td>

                {/* ปุ่มจัดการ */}
                <td className="py-4 px-4 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      type="button"
                      onClick={() => onViewDetail(item)}
                      className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                      title="ดูรายละเอียด"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="sr-only">ดูรายละเอียด</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onEdit(item)}
                      className="p-1.5 text-slate-500 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                      title="แก้ไขข้อมูล"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span className="sr-only">แก้ไข</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(item)}
                      className="p-1.5 text-slate-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="ลบข้อมูล"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="sr-only">ลบ</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View (For small screens) */}
      <div className="md:hidden divide-y divide-slate-100">
        {resources.map((item) => (
          <div key={item.id} className="p-4 space-y-3 hover:bg-slate-50/50 transition-colors">
            <div className="flex items-start justify-between gap-3">
              <span className="font-mono text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                #{item.id}
              </span>
              <StatusBadge status={item.status} />
            </div>

            <div>
              <h3
                onClick={() => onViewDetail(item)}
                className="font-semibold text-slate-900 leading-snug cursor-pointer"
              >
                {item.title}
              </h3>
              {item.description && (
                <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                  {item.description}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-500 pt-1">
              <div className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-medium text-slate-700">{item.creator}</span>
              </div>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <div className="flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                <span className={`px-1.5 py-0.2 rounded border ${getCategoryStyle(item.category)}`}>
                  {item.category}
                </span>
              </div>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <div className="flex items-center gap-1 font-mono">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{formatDate(item.publishedDate)}</span>
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => onViewDetail(item)}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>ดูรายละเอียด</span>
              </button>
              <button
                type="button"
                onClick={() => onEdit(item)}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-md transition cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>แก้ไข</span>
              </button>
              <button
                type="button"
                onClick={() => onDelete(item)}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-md transition cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>ลบ</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
