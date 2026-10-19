import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Plus,
  RefreshCw,
  BookOpen,
  AlertCircle,
  CheckCircle2,
  Inbox,
  SearchX,
  FileCheck,
  FileEdit,
  Database,
  X,
} from 'lucide-react';
import {
  getResources,
  createResource,
  updateResource,
  deleteResource,
} from '../services/resourceService';
import ResourceTable from '../components/ResourceTable';
import SearchFilter from '../components/SearchFilter';
import ResourceForm from '../components/ResourceForm';
import ResourceDetail from '../components/ResourceDetail';
import ConfirmDialog from '../components/ConfirmDialog';

export default function ResourcesPage() {
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // เงื่อนไขการค้นหา
  const [searchParams, setSearchParams] = useState({ q: '', category: '' });

  // Quick Filter บน Metric Cards: 'all' | 'published' | 'draft'
  const [statusFilter, setStatusFilter] = useState('all');

  // Form Modal (สร้าง/แก้ไข)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [selectedResource, setSelectedResource] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  // Detail Modal
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailResource, setDetailResource] = useState(null);

  // Delete Dialog
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  /**
   * ดึงข้อมูลสื่อการเรียนรู้จาก Backend API
   */
  const fetchResources = useCallback(async (params = searchParams) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await getResources(params);
      setResources(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load resources:', err);
      setErrorMessage(err.message || 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchResources(searchParams);
  }, []);

  // ซ่อนข้อความแจ้งเตือนอัตโนมัติ
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  /**
   * คำนวณสถิติภาพรวม (Metrics)
   */
  const metrics = useMemo(() => {
    const total = resources.length;
    const published = resources.filter((r) => Boolean(r.status)).length;
    const draft = total - published;
    const techCount = resources.filter((r) => r.category === 'เทคโนโลยี').length;
    const sciCount = resources.filter((r) => r.category === 'วิทยาศาสตร์').length;
    const litCount = resources.filter((r) => r.category === 'วรรณกรรม').length;

    return { total, published, draft, techCount, sciCount, litCount };
  }, [resources]);

  /**
   * กรองเพิ่มเติมตาม statusFilter ถ้าผู้ใช้กดการ์ดสถานะ
   */
  const filteredResources = useMemo(() => {
    if (statusFilter === 'published') {
      return resources.filter((r) => Boolean(r.status));
    }
    if (statusFilter === 'draft') {
      return resources.filter((r) => !r.status);
    }
    return resources;
  }, [resources, statusFilter]);

  // ค้นหา
  const handleSearch = (newParams) => {
    setSearchParams(newParams);
    fetchResources(newParams);
  };

  // ล้างเงื่อนไข
  const handleClearSearch = () => {
    const emptyParams = { q: '', category: '' };
    setSearchParams(emptyParams);
    setStatusFilter('all');
    fetchResources(emptyParams);
  };

  // เปิด Form เพิ่ม
  const handleOpenCreate = () => {
    setFormMode('create');
    setSelectedResource(null);
    setFormError(null);
    setIsFormOpen(true);
  };

  // เปิด Form แก้ไข
  const handleOpenEdit = (resource) => {
    setFormMode('edit');
    setSelectedResource(resource);
    setFormError(null);
    setIsFormOpen(true);
  };

  // บันทึก Form
  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    setFormError(null);
    try {
      if (formMode === 'create') {
        await createResource(formData);
        setSuccessMessage('เพิ่มสื่อการเรียนรู้ใหม่ลงฐานข้อมูลเรียบร้อยแล้ว');
      } else {
        await updateResource(selectedResource.id, formData);
        setSuccessMessage('บันทึกการแก้ไขข้อมูลสื่อการเรียนรู้สำเร็จ');
      }
      setIsFormOpen(false);
      await fetchResources(searchParams);
    } catch (err) {
      console.error('Save failed:', err);
      setFormError(err.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ดูรายละเอียด
  const handleViewDetail = (resource) => {
    setDetailResource(resource);
    setIsDetailOpen(true);
  };

  // เปิดกล่องลบ
  const handleOpenDelete = (resource) => {
    setResourceToDelete(resource);
    setIsDeleteOpen(true);
  };

  // ยืนยันการลบ
  const handleConfirmDelete = async () => {
    if (!resourceToDelete) return;
    setIsDeleting(true);
    try {
      await deleteResource(resourceToDelete.id);
      setSuccessMessage(`ลบสื่อการเรียนรู้ "${resourceToDelete.title}" ออกจากฐานข้อมูลแล้ว`);
      setIsDeleteOpen(false);
      setResourceToDelete(null);
      await fetchResources(searchParams);
    } catch (err) {
      console.error('Delete failed:', err);
      alert(err.message || 'ไม่สามารถลบข้อมูลได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsDeleting(false);
    }
  };

  const isFiltered = Boolean(searchParams.q || searchParams.category || statusFilter !== 'all');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Top Bar Navigation (Strict 3-zone contract) */}
      <header className="bg-slate-900 text-white shadow-sm sticky top-0 z-30 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex items-center justify-between gap-8">
            {/* Zone 1: Brand wordmark */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <a
                  href="/"
                  className="text-base sm:text-lg font-bold tracking-tight text-white whitespace-nowrap block leading-tight font-display"
                >
                  Learning Resources System
                </a>
                <span className="text-xs text-slate-400 hidden sm:block">
                  วิชา 7153403 เทคโนโลยีการบริการเว็บ
                </span>
              </div>
            </div>

            {/* Zone 2: Navigation Links / Context */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`hover:text-white transition-colors whitespace-nowrap cursor-pointer ${
                  statusFilter === 'all' ? 'text-white font-semibold' : 'text-slate-400'
                }`}
              >
                สื่อทั้งหมด ({metrics.total})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('published')}
                className={`hover:text-white transition-colors whitespace-nowrap cursor-pointer ${
                  statusFilter === 'published' ? 'text-emerald-400 font-semibold' : 'text-slate-400'
                }`}
              >
                เผยแพร่แล้ว ({metrics.published})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('draft')}
                className={`hover:text-white transition-colors whitespace-nowrap cursor-pointer ${
                  statusFilter === 'draft' ? 'text-amber-400 font-semibold' : 'text-slate-400'
                }`}
              >
                ฉบับร่าง ({metrics.draft})
              </button>
            </nav>

            {/* Zone 3: 1 Primary Action */}
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => fetchResources(searchParams)}
                disabled={isLoading}
                title="รีเฟรชข้อมูลจากฐานข้อมูล"
                className="p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer border border-slate-700"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span className="sr-only">รีเฟรช</span>
              </button>

              <button
                type="button"
                onClick={handleOpenCreate}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm hover:shadow transition-all cursor-pointer whitespace-nowrap shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>เพิ่มสื่อการเรียนรู้</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-7">
        {/* Floating Success Alert Toast */}
        {successMessage && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between gap-3 text-emerald-900 shadow-sm animate-in fade-in duration-200">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="text-sm font-semibold">{successMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setSuccessMessage(null)}
              className="text-emerald-700 hover:text-emerald-900 p-1 rounded-md cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Floating Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-rose-900 shadow-sm">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span className="text-sm font-medium">{errorMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => fetchResources(searchParams)}
              className="px-3.5 py-1.5 text-xs font-semibold text-rose-700 bg-rose-100 hover:bg-rose-200 rounded-lg transition-colors cursor-pointer shrink-0"
            >
              ลองใหม่อีกครั้ง
            </button>
          </div>
        )}

        {/* KPI Metrics Summary Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 mb-6">
          {/* Card 1: Total */}
          <div
            onClick={() => setStatusFilter('all')}
            className={`p-4 bg-white rounded-xl border transition-all cursor-pointer shadow-2xs ${
              statusFilter === 'all'
                ? 'border-blue-400 ring-2 ring-blue-100'
                : 'border-slate-200/90 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                สื่อการเรียนรู้ทั้งหมด
              </span>
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Database className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 font-mono-num">
              {metrics.total}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              เชื่อมต่อ PostgreSQL สำเร็จ
            </div>
          </div>

          {/* Card 2: Published */}
          <div
            onClick={() => setStatusFilter('published')}
            className={`p-4 bg-white rounded-xl border transition-all cursor-pointer shadow-2xs ${
              statusFilter === 'published'
                ? 'border-emerald-400 ring-2 ring-emerald-100'
                : 'border-slate-200/90 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                สถานะเผยแพร่แล้ว
              </span>
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <FileCheck className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl font-bold text-emerald-700 font-mono-num">
              {metrics.published}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              พร้อมให้ผู้เรียนเข้าถึง
            </div>
          </div>

          {/* Card 3: Draft */}
          <div
            onClick={() => setStatusFilter('draft')}
            className={`p-4 bg-white rounded-xl border transition-all cursor-pointer shadow-2xs ${
              statusFilter === 'draft'
                ? 'border-amber-400 ring-2 ring-amber-100'
                : 'border-slate-200/90 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                ฉบับร่าง (รอตรวจ)
              </span>
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <FileEdit className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl font-bold text-amber-700 font-mono-num">
              {metrics.draft}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              กำลังปรับปรุงเนื้อหา
            </div>
          </div>

          {/* Card 4: Categories Breakdown */}
          <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                การกระจายหมวดหมู่
              </span>
              <span className="text-xs font-mono text-slate-400">ชุด A</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-700 pt-1">
              <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-mono-num">
                เทคโนฯ: {metrics.techCount}
              </span>
              <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 font-mono-num">
                วิทย์ฯ: {metrics.sciCount}
              </span>
              <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-mono-num">
                วรรณกรรม: {metrics.litCount}
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-2">
              ตรงตามข้อกำหนดหลักสูตร
            </div>
          </div>
        </div>

        {/* Search & Filter Component */}
        <SearchFilter
          onSearch={handleSearch}
          onClear={handleClearSearch}
          initialQuery={searchParams.q}
          initialCategory={searchParams.category}
          isLoading={isLoading}
        />

        {/* Status Bar Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 text-xs sm:text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <span>แสดงรายการ:</span>
            <span className="font-bold text-slate-800 font-mono-num">{filteredResources.length}</span>
            <span>จากทั้งหมด {metrics.total} รายการ</span>
            {isFiltered && (
              <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs border border-blue-200 font-medium">
                กำลังกรองผลลัพธ์
              </span>
            )}
          </div>
          {isFiltered && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 underline cursor-pointer self-start sm:self-auto"
            >
              แสดงทั้งหมด
            </button>
          )}
        </div>

        {/* Content View: Loading, Empty, Not Found, Table */}
        {isLoading ? (
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-3 border-slate-200 border-t-blue-600 mb-3"></div>
            <p className="text-sm text-slate-600 font-medium">กำลังโหลดข้อมูลสื่อการเรียนรู้จากฐานข้อมูล...</p>
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-12 text-center">
            {isFiltered ? (
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
                  <SearchX className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  ไม่พบข้อมูลสื่อการเรียนรู้
                </h3>
                <p className="text-sm text-slate-500 max-w-md mb-4">
                  ไม่พบรายการที่ตรงกับคำค้นหาหรือหมวดหมู่ที่คุณเลือกในฐานข้อมูล
                </p>
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="px-4 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                >
                  ล้างเงื่อนไขการค้นหา
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
                  <Inbox className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  ยังไม่มีสื่อการเรียนรู้ในระบบ
                </h3>
                <p className="text-sm text-slate-500 max-w-md mb-4">
                  เริ่มต้นเพิ่มสื่อการเรียนรู้ชิ้นแรกเข้าสู่ระบบฐานข้อมูลได้ง่ายๆ
                </p>
                <button
                  type="button"
                  onClick={handleOpenCreate}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>เพิ่มสื่อการเรียนรู้</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <ResourceTable
            resources={filteredResources}
            onViewDetail={handleViewDetail}
            onEdit={handleOpenEdit}
            onDelete={handleOpenDelete}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-semibold text-slate-700 font-display">
            Learning Resources Management System
          </p>
          <p className="mt-1">
            ข้อสอบปลายภาค วิชา 7153403 เทคโนโลยีการบริการเว็บ ภาคเรียนที่ 1 ปีการศึกษา 2569
          </p>
        </div>
      </footer>

      {/* Form Modal (เพิ่ม / แก้ไข) */}
      <ResourceForm
        isOpen={isFormOpen}
        mode={formMode}
        initialData={selectedResource}
        onSubmit={handleFormSubmit}
        onClose={() => setIsFormOpen(false)}
        isSubmitting={isSubmitting}
        serverError={formError}
      />

      {/* Detail Modal */}
      <ResourceDetail
        isOpen={isDetailOpen}
        resource={detailResource}
        onClose={() => {
          setIsDetailOpen(false);
          setDetailResource(null);
        }}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="ยืนยันการลบสื่อการเรียนรู้"
        resourceName={resourceToDelete?.title}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteOpen(false);
          setResourceToDelete(null);
        }}
        isDeleting={isDeleting}
      />
    </div>
  );
}
