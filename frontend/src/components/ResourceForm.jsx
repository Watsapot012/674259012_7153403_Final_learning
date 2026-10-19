import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle, FilePlus, Edit3, CheckCircle2, FileEdit } from 'lucide-react';

const CATEGORIES = ['เทคโนโลยี', 'วิทยาศาสตร์', 'วรรณกรรม'];

export default function ResourceForm({
  isOpen,
  mode = 'create', // 'create' หรือ 'edit'
  initialData = null,
  onSubmit,
  onClose,
  isSubmitting = false,
  serverError = null,
}) {
  const [formData, setFormData] = useState({
    title: '',
    creator: '',
    category: 'เทคโนโลยี',
    publishedDate: new Date().toISOString().split('T')[0],
    description: '',
    status: true,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData({
        title: initialData.title || '',
        creator: initialData.creator || '',
        category: initialData.category || 'เทคโนโลยี',
        publishedDate: initialData.publishedDate || new Date().toISOString().split('T')[0],
        description: initialData.description || '',
        status: initialData.status !== undefined ? Boolean(initialData.status) : true,
      });
    } else {
      setFormData({
        title: '',
        creator: '',
        category: 'เทคโนโลยี',
        publishedDate: new Date().toISOString().split('T')[0],
        description: '',
        status: true,
      });
    }
    setErrors({});
  }, [initialData, mode, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let val = value;

    if (type === 'checkbox') {
      val = checked;
    } else if (name === 'status') {
      val = value === 'true';
    }

    setFormData((prev) => ({
      ...prev,
      [name]: val,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const setStatusValue = (newStatus) => {
    setFormData((prev) => ({
      ...prev,
      status: newStatus,
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title || formData.title.trim() === '') {
      newErrors.title = 'กรุณากรอกชื่อสื่อการเรียนรู้';
    } else if (formData.title.trim().length > 150) {
      newErrors.title = 'ชื่อสื่อการเรียนรู้ต้องไม่เกิน 150 ตัวอักษร';
    }

    if (!formData.creator || formData.creator.trim() === '') {
      newErrors.creator = 'กรุณากรอกชื่อผู้สร้างสื่อการเรียนรู้';
    } else if (formData.creator.trim().length > 100) {
      newErrors.creator = 'ชื่อผู้สร้างต้องไม่เกิน 100 ตัวอักษร';
    }

    if (!formData.category || !CATEGORIES.includes(formData.category)) {
      newErrors.category = 'กรุณาเลือกหมวดหมู่ที่ถูกต้อง';
    }

    if (!formData.publishedDate) {
      newErrors.publishedDate = 'กรุณาระบุวันที่เผยแพร่';
    } else if (isNaN(new Date(formData.publishedDate).getTime())) {
      newErrors.publishedDate = 'รูปแบบวันที่ไม่ถูกต้อง';
    }

    if (!formData.description || formData.description.trim() === '') {
      newErrors.description = 'กรุณากรอกรายละเอียดสื่อการเรียนรู้';
    } else if (formData.description.trim().length > 2000) {
      newErrors.description = 'รายละเอียดต้องไม่เกิน 2,000 ตัวอักษร';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      title: formData.title.trim(),
      creator: formData.creator.trim(),
      category: formData.category,
      publishedDate: formData.publishedDate,
      description: formData.description.trim(),
      status: Boolean(formData.status),
    });
  };

  const isEdit = mode === 'edit';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="px-6 py-4.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
              isEdit
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
            }`}>
              {isEdit ? <Edit3 className="w-4 h-4" /> : <FilePlus className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {isEdit ? 'แก้ไขสื่อการเรียนรู้' : 'เพิ่มสื่อการเรียนรู้ใหม่'}
              </h3>
              <p className="text-xs text-slate-400">
                {isEdit ? `กำลังแก้ไขรายการ #${initialData?.id}` : 'กรอกข้อมูลให้ครบถ้วนเพื่อบันทึกลงฐานข้อมูล'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition cursor-pointer"
            aria-label="ปิดหน้าต่าง"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {serverError && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-sm text-rose-800">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">ไม่สามารถบันทึกข้อมูลได้</p>
                <p className="text-xs text-rose-700 mt-0.5">{serverError}</p>
              </div>
            </div>
          )}

          {/* ชื่อสื่อการเรียนรู้ */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="title" className="text-sm font-semibold text-slate-800">
                ชื่อสื่อการเรียนรู้ <span className="text-rose-500">*</span>
              </label>
              <span className={`text-xs font-mono ${
                formData.title.length > 140 ? 'text-rose-500 font-bold' : 'text-slate-400'
              }`}>
                {formData.title.length}/150
              </span>
            </div>
            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="เช่น การพัฒนา Fullstack Web Application ด้วย React และ Sequelize"
              maxLength={150}
              className={`w-full px-3.5 py-2.5 text-sm rounded-lg border ${
                errors.title
                  ? 'border-rose-400 bg-rose-50/20 focus:ring-rose-200'
                  : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
              } focus:outline-none focus:ring-3 transition shadow-2xs`}
            />
            {errors.title && (
              <p className="mt-1 text-xs text-rose-600 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.title}</span>
              </p>
            )}
          </div>

          {/* ผู้สร้าง และ หมวดหมู่ (2 คอลัมน์) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="creator" className="text-sm font-semibold text-slate-800">
                  ผู้สร้างสื่อการเรียนรู้ <span className="text-rose-500">*</span>
                </label>
                <span className="text-xs font-mono text-slate-400">
                  {formData.creator.length}/100
                </span>
              </div>
              <input
                id="creator"
                type="text"
                name="creator"
                value={formData.creator}
                onChange={handleChange}
                placeholder="เช่น ผศ.ดร.สมชาย ใจดี"
                maxLength={100}
                className={`w-full px-3.5 py-2.5 text-sm rounded-lg border ${
                  errors.creator
                    ? 'border-rose-400 bg-rose-50/20 focus:ring-rose-200'
                    : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
                } focus:outline-none focus:ring-3 transition shadow-2xs`}
              />
              {errors.creator && (
                <p className="mt-1 text-xs text-rose-600 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.creator}</span>
                </p>
              )}
            </div>

            <div>
              <label htmlFor="category" className="text-sm font-semibold text-slate-800 block mb-1.5">
                หมวดหมู่ <span className="text-rose-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-white focus:border-blue-500 focus:ring-3 focus:ring-blue-100 focus:outline-none transition cursor-pointer shadow-2xs"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-xs text-rose-600 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.category}</span>
                </p>
              )}
            </div>
          </div>

          {/* วันที่เผยแพร่ และ สถานะการเผยแพร่ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="publishedDate" className="text-sm font-semibold text-slate-800 block mb-1.5">
                วันที่เผยแพร่ <span className="text-rose-500">*</span>
              </label>
              <input
                id="publishedDate"
                type="date"
                name="publishedDate"
                value={formData.publishedDate}
                onChange={handleChange}
                className={`w-full px-3.5 py-2.5 text-sm rounded-lg border ${
                  errors.publishedDate
                    ? 'border-rose-400 bg-rose-50/20 focus:ring-rose-200'
                    : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
                } focus:outline-none focus:ring-3 transition font-mono shadow-2xs`}
              />
              {errors.publishedDate && (
                <p className="mt-1 text-xs text-rose-600 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.publishedDate}</span>
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-800 block mb-1.5">
                สถานะการเผยแพร่ <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => setStatusValue(true)}
                  className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                    formData.status === true
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-2 ring-emerald-100'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>เผยแพร่ (Public)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStatusValue(false)}
                  className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                    formData.status === false
                      ? 'bg-amber-50 text-amber-800 border-amber-300 ring-2 ring-amber-100'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <FileEdit className="w-3.5 h-3.5 text-amber-600" />
                  <span>ฉบับร่าง (Draft)</span>
                </button>
              </div>
            </div>
          </div>

          {/* รายละเอียด */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="description" className="text-sm font-semibold text-slate-800">
                รายละเอียดสื่อการเรียนรู้ <span className="text-rose-500">*</span>
              </label>
              <span className={`text-xs font-mono ${
                formData.description.length > 1900 ? 'text-rose-500 font-bold' : 'text-slate-400'
              }`}>
                {formData.description.length}/2000
              </span>
            </div>
            <textarea
              id="description"
              name="description"
              rows={5}
              value={formData.description}
              onChange={handleChange}
              placeholder="ระบุเนื้อหา สรุปสาระสำคัญ และวัตถุประสงค์ของสื่อการเรียนรู้นี้..."
              maxLength={2000}
              className={`w-full px-3.5 py-2.5 text-sm rounded-lg border ${
                errors.description
                  ? 'border-rose-400 bg-rose-50/20 focus:ring-rose-200'
                  : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
              } focus:outline-none focus:ring-3 transition leading-relaxed shadow-2xs`}
            />
            {errors.description && (
              <p className="mt-1 text-xs text-rose-600 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.description}</span>
              </p>
            )}
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4.5 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg focus:outline-none focus:ring-3 focus:ring-blue-200 transition disabled:opacity-50 shadow-sm hover:shadow cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span>กำลังบันทึก...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{isEdit ? 'บันทึกการแก้ไข' : 'บันทึกสื่อการเรียนรู้'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
