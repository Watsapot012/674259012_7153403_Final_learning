/**
 * Learning Resources API Service
 * จัดการการเรียก RESTful API ทั้งหมดของระบบสื่อการเรียนรู้
 */

// กำหนด BASE URL จาก Environment Variable VITE_API_URL หรือใช้ค่าเริ่มต้น /api
// ตัดเครื่องหมาย slash ท้ายสุดออกเพื่อป้องกันการต่อ URL ผิดพลาด
const RAW_URL = import.meta.env.VITE_API_URL || '/api';
const NORMALIZED_URL = RAW_URL.trim().replace(/\/+$/, '');
const API_BASE_URL = (() => {
  if (!/^https?:\/\//i.test(NORMALIZED_URL)) {
    return NORMALIZED_URL;
  }

  const url = new URL(NORMALIZED_URL);
  if (url.pathname === '/') {
    url.pathname = '/api';
  }
  return url.toString().replace(/\/+$/, '');
})();

/**
 * ฟังก์ชันช่วยแปลง Response และจัดการ Error จาก Backend
 */
async function handleResponse(response) {
  let data;
  try {
    data = await response.json();
  } catch (_e) {
    data = null;
  }

  if (!response.ok) {
    const errorMessage =
      (data && data.message) ||
      (data && data.errors && data.errors.join(', ')) ||
      `เกิดข้อผิดพลาดในการร้องขอข้อมูล (HTTP ${response.status})`;
    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

/**
 * 1. ดึงข้อมูลสื่อการเรียนรู้ทั้งหมด พร้อมรองรับการค้นหา (q) และกรองหมวดหมู่ (category)
 * Endpoint: GET /api/learning-resources?q=...&category=...
 */
export async function getResources({ q = '', category = '' } = {}) {
  const params = new URLSearchParams();

  if (q && q.trim()) {
    params.append('q', q.trim());
  }

  if (category && category.trim()) {
    params.append('category', category.trim());
  }

  const queryString = params.toString();
  const endpoint = `${API_BASE_URL}/learning-resources${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  const result = await handleResponse(response);
  // กรณี backend ตอบกลับมาเป็น array โดยตรง หรือหุ้มใน data property
  return Array.isArray(result) ? result : result.data || [];
}

/**
 * 2. ดึงข้อมูลสื่อการเรียนรู้รายชิ้นตาม ID
 * Endpoint: GET /api/learning-resources/:id
 */
export async function getResourceById(id) {
  const endpoint = `${API_BASE_URL}/learning-resources/${id}`;
  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  const result = await handleResponse(response);
  return result.data || result;
}

/**
 * 3. เพิ่มสื่อการเรียนรู้ใหม่
 * Endpoint: POST /api/learning-resources
 */
export async function createResource(resourceData) {
  const endpoint = `${API_BASE_URL}/learning-resources`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(resourceData),
  });

  const result = await handleResponse(response);
  return result.data || result;
}

/**
 * 4. แก้ไขข้อมูลสื่อการเรียนรู้
 * Endpoint: PUT /api/learning-resources/:id
 */
export async function updateResource(id, resourceData) {
  const endpoint = `${API_BASE_URL}/learning-resources/${id}`;
  const response = await fetch(endpoint, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(resourceData),
  });

  const result = await handleResponse(response);
  return result.data || result;
}

/**
 * 5. ลบสื่อการเรียนรู้
 * Endpoint: DELETE /api/learning-resources/:id
 */
export async function deleteResource(id) {
  const endpoint = `${API_BASE_URL}/learning-resources/${id}`;
  const response = await fetch(endpoint, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  return await handleResponse(response);
}

/**
 * 6. ตรวจสอบสถานะการเชื่อมต่อ Backend (Health Check)
 */
export async function checkBackendHealth() {
  const baseRoot = API_BASE_URL.endsWith('/api')
    ? API_BASE_URL.slice(0, -4)
    : API_BASE_URL;
  const endpoint = `${baseRoot}/health`;

  const response = await fetch(endpoint, {
    method: 'GET',
  });

  return await handleResponse(response);
}

export default {
  getResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
  checkBackendHealth,
};
