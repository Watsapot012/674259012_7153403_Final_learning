import React, { useState, useEffect } from 'react';
import { Search, RotateCcw, X, Layers } from 'lucide-react';

const CATEGORIES = [
  { id: '', label: 'ทุกหมวดหมู่' },
  { id: 'เทคโนโลยี', label: 'เทคโนโลยี' },
  { id: 'วิทยาศาสตร์', label: 'วิทยาศาสตร์' },
  { id: 'วรรณกรรม', label: 'วรรณกรรม' },
];

export default function SearchFilter({
  onSearch,
  onClear,
  initialQuery = '',
  initialCategory = '',
  isLoading = false,
}) {
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  // อัปเดต state เมื่อ initialQuery หรือ initialCategory เปลี่ยนจากภายนอก
  useEffect(() => {
    setSearchTerm(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    setSelectedCategory(initialCategory);
  }, [initialCategory]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    onSearch({
      q: searchTerm.trim(),
      category: selectedCategory,
    });
  };

  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    onSearch({
      q: searchTerm.trim(),
      category: catId,
    });
  };

  const handleClear = () => {
    setSearchTerm('');
    setSelectedCategory('');
    onClear();
  };

  const hasActiveFilters = Boolean(searchTerm.trim() || selectedCategory);

  return (
    <div className="bg-white rounded-xl shadow-xs border border-slate-200/90 p-4 sm:p-5 mb-6">
      <div className="flex flex-col gap-4">
        {/* Category Segmented Control Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>หมวดหมู่สื่อการเรียนรู้</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100/90 rounded-lg">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id || 'all'}
                  type="button"
                  onClick={() => handleCategoryChange(cat.id)}
                  disabled={isLoading}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-white text-blue-700 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Search Input & Action Row */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหาชื่อสื่อการเรียนรู้ หรือหัวข้อบทเรียน..."
              className="w-full pl-10 pr-9 py-2.5 text-sm rounded-lg border border-slate-300 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-blue-500 focus:ring-3 focus:ring-blue-100 focus:outline-none transition placeholder:text-slate-400"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                title="ล้างข้อความค้นหา"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors shadow-xs hover:shadow focus:ring-3 focus:ring-blue-200 focus:outline-none disabled:opacity-50 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>ค้นหา</span>
            </button>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClear}
                disabled={isLoading}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                title="ล้างเงื่อนไขทั้งหมด"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="hidden sm:inline">ล้างเงื่อนไข</span>
              </button>
            )}
          </div>
        </form>

        {/* Active Filters Pill Feedback */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
            <span className="font-medium text-slate-700">เงื่อนไขการค้นหาปัจจุบัน:</span>
            {searchTerm.trim() && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-200">
                ชื่อ: &ldquo;{searchTerm.trim()}&rdquo;
              </span>
            )}
            {selectedCategory && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded border border-indigo-200">
                หมวด: {selectedCategory}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
