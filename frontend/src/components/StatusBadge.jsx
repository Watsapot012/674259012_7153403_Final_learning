import React from 'react';
import { CheckCircle2, FileEdit } from 'lucide-react';

export default function StatusBadge({ status, showIcon = true }) {
  const isPublished = Boolean(status);

  if (isPublished) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs">
        {showIcon && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
        <span>เผยแพร่</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/80 shadow-2xs">
      {showIcon && <FileEdit className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
      <span>ฉบับร่าง</span>
    </span>
  );
}
