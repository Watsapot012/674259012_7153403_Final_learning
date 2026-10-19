const express = require('express');
const router = express.Router();
const resourceController = require('../controller/resourceController');

// GET /api/learning-resources - อ่านข้อมูลทั้งหมด (รองรับ q และ category)
router.get('/', resourceController.getAllResources);

// GET /api/learning-resources/:id - อ่านรายละเอียดข้อมูลหนึ่งรายการ
router.get('/:id', resourceController.getResourceById);

// POST /api/learning-resources - เพิ่มข้อมูลใหม่
router.post('/', resourceController.createResource);

// PUT /api/learning-resources/:id - แก้ไขข้อมูล
router.put('/:id', resourceController.updateResource);

// DELETE /api/learning-resources/:id - ลบข้อมูล
router.delete('/:id', resourceController.deleteResource);

module.exports = router;
