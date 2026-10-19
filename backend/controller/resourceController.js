const { Op } = require('sequelize');
const LearningResource = require('../model/LearningResource');
const sequelize = require('../config/database');

const ALLOWED_CATEGORIES = LearningResource.ALLOWED_CATEGORIES || [
  'เทคโนโลยี',
  'วิทยาศาสตร์',
  'วรรณกรรม',
];

/**
 * ตรวจสอบความถูกต้องของ ID ให้เป็นจำนวนเต็มบวก
 */
const validateId = (id) => {
  if (!id) return null;
  const strId = String(id).trim();
  if (!/^[1-9]\d*$/.test(strId)) {
    return null;
  }
  return parseInt(strId, 10);
};

/**
 * ตรวจสอบความถูกต้องของข้อมูล (Validation) สำหรับการสร้างและแก้ไข
 */
const validateResourceInput = (data) => {
  const errors = [];
  const { title, creator, category, publishedDate, description, status } = data;

  // 1. ตรวจสอบ title
  if (typeof title !== 'string' || title.trim() === '') {
    errors.push('กรุณากรอกชื่อสื่อการเรียนรู้');
  } else if (title.trim().length > 150) {
    errors.push('ชื่อสื่อการเรียนรู้ต้องมีความยาวไม่เกิน 150 ตัวอักษร');
  }

  // 2. ตรวจสอบ creator
  if (typeof creator !== 'string' || creator.trim() === '') {
    errors.push('กรุณากรอกชื่อผู้สร้างสื่อการเรียนรู้');
  } else if (creator.trim().length > 100) {
    errors.push('ชื่อผู้สร้างต้องมีความยาวไม่เกิน 100 ตัวอักษร');
  }

  // 3. ตรวจสอบ category
  if (!category || typeof category !== 'string' || !ALLOWED_CATEGORIES.includes(category.trim())) {
    errors.push('หมวดหมู่ต้องเป็น เทคโนโลยี, วิทยาศาสตร์ หรือ วรรณกรรม เท่านั้น');
  }

  // 4. ตรวจสอบ publishedDate
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!publishedDate || typeof publishedDate !== 'string' || !dateRegex.test(publishedDate.trim())) {
    errors.push('วันที่เผยแพร่ต้องเป็นวันที่ที่ถูกต้องในรูปแบบ YYYY-MM-DD');
  } else {
    const parsedDate = new Date(publishedDate.trim());
    if (isNaN(parsedDate.getTime())) {
      errors.push('วันที่เผยแพร่ไม่ถูกต้อง');
    }
  }

  // 5. ตรวจสอบ description
  if (typeof description !== 'string' || description.trim() === '') {
    errors.push('กรุณากรอกรายละเอียดสื่อการเรียนรู้');
  } else if (description.trim().length > 2000) {
    errors.push('รายละเอียดต้องมีความยาวไม่เกิน 2,000 ตัวอักษร');
  }

  // 6. ตรวจสอบ status (แปลงเป็น boolean ถ้าเป็น string หรือ boolean)
  let parsedStatus = true;
  if (status !== undefined) {
    if (typeof status === 'boolean') {
      parsedStatus = status;
    } else if (typeof status === 'string') {
      if (status.toLowerCase() === 'false' || status === '0') {
        parsedStatus = false;
      } else if (status.toLowerCase() === 'true' || status === '1') {
        parsedStatus = true;
      } else {
        errors.push('สถานะต้องเป็นเผยแพร่ (true) หรือฉบับร่าง (false)');
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitized: {
      title: title ? title.trim() : '',
      creator: creator ? creator.trim() : '',
      category: category ? category.trim() : '',
      publishedDate: publishedDate ? publishedDate.trim() : '',
      description: description ? description.trim() : '',
      status: parsedStatus,
    },
  };
};

/**
 * GET /api/learning-resources
 * อ่านข้อมูลทั้งหมด รองรับ q และ category
 */
const getAllResources = async (req, res) => {
  try {
    const { q, category } = req.query;
    const whereConditions = [];

    // ค้นหาชื่อบางส่วน (Partial Match)
    if (q && typeof q === 'string' && q.trim() !== '') {
      const searchTerm = q.trim();
      const dialect = sequelize.getDialect();
      if (dialect === 'postgres') {
        whereConditions.push({
          title: { [Op.iLike]: `%${searchTerm}%` },
        });
      } else {
        whereConditions.push({
          title: { [Op.like]: `%${searchTerm}%` },
        });
      }
    }

    // กรองหมวดหมู่
    if (category && typeof category === 'string' && category.trim() !== '') {
      whereConditions.push({
        category: category.trim(),
      });
    }

    const where = whereConditions.length > 0 ? { [Op.and]: whereConditions } : {};

    const resources = await LearningResource.findAll({
      where,
      order: [['id', 'ASC']],
    });

    // หากไม่พบข้อมูล ให้ตอบ HTTP 200 พร้อม Array ว่าง
    return res.status(200).json(resources);
  } catch (error) {
    console.error('Error fetching resources:', error.message);
    return res.status(500).json({ message: 'เกิดข้อผิดพลาดภายในระบบ' });
  }
};

/**
 * GET /api/learning-resources/:id
 * อ่านรายละเอียดข้อมูลหนึ่งรายการ
 */
const getResourceById = async (req, res) => {
  try {
    const numericId = validateId(req.params.id);
    if (!numericId) {
      return res.status(400).json({ message: 'รหัส id ต้องเป็นจำนวนเต็มบวก' });
    }

    const resource = await LearningResource.findByPk(numericId);
    if (!resource) {
      return res.status(404).json({ message: 'ไม่พบข้อมูลสื่อการเรียนรู้ตาม id ที่ระบุ' });
    }

    return res.status(200).json(resource);
  } catch (error) {
    console.error('Error fetching resource by id:', error.message);
    return res.status(500).json({ message: 'เกิดข้อผิดพลาดภายในระบบ' });
  }
};

/**
 * POST /api/learning-resources
 * เพิ่มข้อมูลใหม่
 */
const createResource = async (req, res) => {
  try {
    const { isValid, errors, sanitized } = validateResourceInput(req.body);
    if (!isValid) {
      return res.status(400).json({
        message: errors.join(', '),
        errors,
      });
    }

    const newResource = await LearningResource.create(sanitized);

    return res.status(201).json({
      message: 'สร้างข้อมูลสื่อการเรียนรู้สำเร็จ',
      data: newResource,
    });
  } catch (error) {
    console.error('Error creating resource:', error.message);
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map((e) => e.message);
      return res.status(400).json({ message: messages.join(', '), errors: messages });
    }
    return res.status(500).json({ message: 'เกิดข้อผิดพลาดภายในระบบ' });
  }
};

/**
 * PUT /api/learning-resources/:id
 * แก้ไขข้อมูลทุกฟิลด์ที่กำหนด
 */
const updateResource = async (req, res) => {
  try {
    const numericId = validateId(req.params.id);
    if (!numericId) {
      return res.status(400).json({ message: 'รหัส id ต้องเป็นจำนวนเต็มบวก' });
    }

    const resource = await LearningResource.findByPk(numericId);
    if (!resource) {
      return res.status(404).json({ message: 'ไม่พบข้อมูลสื่อการเรียนรู้ตาม id ที่ระบุ' });
    }

    const { isValid, errors, sanitized } = validateResourceInput(req.body);
    if (!isValid) {
      return res.status(400).json({
        message: errors.join(', '),
        errors,
      });
    }

    await resource.update(sanitized);

    return res.status(200).json({
      message: 'แก้ไขข้อมูลสื่อการเรียนรู้สำเร็จ',
      data: resource,
    });
  } catch (error) {
    console.error('Error updating resource:', error.message);
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map((e) => e.message);
      return res.status(400).json({ message: messages.join(', '), errors: messages });
    }
    return res.status(500).json({ message: 'เกิดข้อผิดพลาดภายในระบบ' });
  }
};

/**
 * DELETE /api/learning-resources/:id
 * ลบข้อมูลจากฐานข้อมูลจริง
 */
const deleteResource = async (req, res) => {
  try {
    const numericId = validateId(req.params.id);
    if (!numericId) {
      return res.status(400).json({ message: 'รหัส id ต้องเป็นจำนวนเต็มบวก' });
    }

    const resource = await LearningResource.findByPk(numericId);
    if (!resource) {
      return res.status(404).json({ message: 'ไม่พบข้อมูลสื่อการเรียนรู้ตาม id ที่ระบุ' });
    }

    await resource.destroy();

    return res.status(200).json({
      message: 'ลบข้อมูลสื่อการเรียนรู้สำเร็จ',
      id: numericId,
    });
  } catch (error) {
    console.error('Error deleting resource:', error.message);
    return res.status(500).json({ message: 'เกิดข้อผิดพลาดภายในระบบ' });
  }
};

module.exports = {
  getAllResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
  validateId,
  validateResourceInput,
};
