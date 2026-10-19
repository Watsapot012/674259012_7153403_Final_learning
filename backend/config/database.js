const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

if (process.env.DATABASE_URL) {
  // รองรับ Cloud Database เช่น Render PostgreSQL, Supabase, Neon
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: process.env.DB_SSL === 'false' ? false : {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
  });
} else if (process.env.DB_HOST && process.env.DB_NAME && process.env.DB_USER) {
  // รองรับการเชื่อมต่อกับเซิร์ฟเวอร์ PostgreSQL (เช่น Localhost หรือ External Database)
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD || '',
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
      dialect: 'postgres',
      dialectOptions: process.env.DB_SSL === 'true' ? {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      } : {},
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
    }
  );
} else {
  // สภาพแวดล้อมสำหรับรันในเครื่อง Local หรือ Preview ที่ยังไม่ได้ต่อกับโฮสต์ PostgreSQL ภายนอก
  // ใช้ PostgreSQL Dialect แบบ Pure JavaScript ในหน่วยความจำ (pg-mem)
  const { newDb } = require('pg-mem');
  const memDb = newDb();
  const pgModule = memDb.adapters.createPg();

  sequelize = new Sequelize({
    dialect: 'postgres',
    dialectModule: pgModule,
    logging: false,
  });
}

module.exports = sequelize;
