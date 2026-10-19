const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ALLOWED_CATEGORIES = ['เทคโนโลยี', 'วิทยาศาสตร์', 'วรรณกรรม'];

const LearningResource = sequelize.define(
  'LearningResource',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'กรุณากรอกชื่อสื่อการเรียนรู้',
        },
        notEmpty: {
          msg: 'ชื่อสื่อการเรียนรู้ต้องไม่เป็นค่าว่าง',
        },
        isValidLength(value) {
          if (!value || typeof value !== 'string' || value.trim().length < 1 || value.trim().length > 150) {
            throw new Error('ชื่อสื่อการเรียนรู้ต้องมีความยาว 1-150 ตัวอักษร');
          }
        },
      },
    },
    creator: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'กรุณากรอกชื่อผู้สร้างสื่อการเรียนรู้',
        },
        notEmpty: {
          msg: 'ชื่อผู้สร้างสื่อการเรียนรู้ต้องไม่เป็นค่าว่าง',
        },
        isValidLength(value) {
          if (!value || typeof value !== 'string' || value.trim().length < 1 || value.trim().length > 100) {
            throw new Error('ชื่อผู้สร้างต้องมีความยาว 1-100 ตัวอักษร');
          }
        },
      },
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'กรุณาเลือกหมวดหมู่สื่อการเรียนรู้',
        },
        isIn: {
          args: [ALLOWED_CATEGORIES],
          msg: 'หมวดหมู่ต้องเป็น เทคโนโลยี, วิทยาศาสตร์ หรือ วรรณกรรม เท่านั้น',
        },
      },
    },
    publishedDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'กรุณาระบุวันที่เผยแพร่',
        },
        isDate: {
          msg: 'วันที่เผยแพร่ต้องเป็นรูปแบบวันที่ที่ถูกต้อง (YYYY-MM-DD)',
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'กรุณากรอกรายละเอียดสื่อการเรียนรู้',
        },
        notEmpty: {
          msg: 'รายละเอียดสื่อการเรียนรู้ต้องไม่เป็นค่าว่าง',
        },
        isValidLength(value) {
          if (!value || typeof value !== 'string' || value.trim().length < 1 || value.trim().length > 2000) {
            throw new Error('รายละเอียดต้องมีความยาว 1-2,000 ตัวอักษร');
          }
        },
      },
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: 'learning_resources',
    timestamps: true,
  }
);

LearningResource.ALLOWED_CATEGORIES = ALLOWED_CATEGORIES;

module.exports = LearningResource;
