const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

const databaseUrlEntry = [
  ['DATABASE_URL', process.env.DATABASE_URL],
  ['DATABASE_URL_UNPOOLED', process.env.DATABASE_URL_UNPOOLED],
].find(([, value]) => typeof value === 'string' && value.trim());

if (databaseUrlEntry) {
  const [variableName, value] = databaseUrlEntry;
  const databaseUrl = value.trim();
  let parsedUrl;

  try {
    parsedUrl = new URL(databaseUrl);
  } catch {
    throw new Error(
      `${variableName} must be a complete PostgreSQL URL beginning with postgres:// or postgresql://.`
    );
  }

  if (!['postgres:', 'postgresql:'].includes(parsedUrl.protocol)) {
    throw new Error(
      `${variableName} must use the postgres:// or postgresql:// protocol.`
    );
  }

  // รองรับ Cloud Database เช่น Render PostgreSQL, Supabase, Neon
  sequelize = new Sequelize(databaseUrl, {
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
  throw new Error(
    'Database is not configured. Set DATABASE_URL (or DATABASE_URL_UNPOOLED), or provide DB_HOST, DB_NAME, and DB_USER.'
  );
}

module.exports = sequelize;
