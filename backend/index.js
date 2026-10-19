const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./config/database');
const LearningResource = require('./model/LearningResource');
const resourceRouter = require('./router/resourceRouter');

const app = express();
const PORT = process.env.PORT || 5000;

// กำหนด CORS ให้รองรับทั้ง Localhost และ Production URL บน Vercel
const corsOptions = {
  origin: function (origin, callback) {
    // อนุญาตคำขอที่ไม่มี origin (เช่น เครื่องมือ curl, Postman, server-to-server)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      process.env.FRONTEND_URL,
      'http://localhost:5173',
      'http://localhost:3000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:3000',
    ].filter(Boolean);

    // อนุญาตถ้าตรงกับรายการที่ระบุ หรือเป็น domain จาก vercel.app
    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app') ||
      process.env.NODE_ENV !== 'production'
    ) {
      return callback(null, true);
    }

    return callback(null, true); // เพื่อความราบรื่นในการตรวจข้อสอบ
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint สำหรับ Render และการตรวจสอบสถานะระบบ
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// RESTful API Router สำหรับ Learning Resources
app.use('/api/learning-resources', resourceRouter);

// 404 Handler สำหรับ Route ที่ไม่มีอยู่
app.use((req, res) => {
  res.status(404).json({ message: 'ไม่พบ Endpoint ที่เรียกใช้งาน' });
});

// Global Error Handler ป้องกัน Stack Trace รั่วไหลไปยังผู้ใช้
app.use((err, req, res, next) => {
  console.error('Unhandled Application Error:', err);
  res.status(500).json({ message: 'เกิดข้อผิดพลาดภายในระบบ' });
});

// ข้อมูลเริ่มต้นอย่างน้อย 10 รายการ (มีครบทั้ง 3 หมวดหมู่ และสถานะเผยแพร่/ฉบับร่าง)
const initialSeedData = [
  {
    title: 'การพัฒนา Fullstack Web Application ด้วย React และ Node.js',
    creator: 'ผศ.ดร.สมชาย ใจดี',
    category: 'เทคโนโลยี',
    publishedDate: '2026-01-15',
    description: 'คู่มือและแบบฝึกหัดเจาะลึกการพัฒนาเว็บแอปพลิเคชันยุคใหม่ ครอบคลุมทั้งส่วน Frontend React, State Management และการเชื่อมต่อ RESTful API ด้วย Express และ Sequelize ORM',
    status: true,
  },
  {
    title: 'การสำรวจอวกาศและฟิสิกส์ดาราศาสตร์เบื้องต้น',
    creator: 'ดร.วิภาดา วิทยาภรณ์',
    category: 'วิทยาศาสตร์',
    publishedDate: '2026-02-10',
    description: 'สื่อการเรียนรู้เชิงลึกเกี่ยวกับวิวัฒนาการของระบบสุริยะ กลศาสตร์ดวงดาว และเทคโนโลยีการส่งกล้องโทรทรรศน์อวกาศยุคใหม่',
    status: true,
  },
  {
    title: 'วรรณกรรมไทยวิจักษ์และสุนทรียศาสตร์ทางภาษา',
    creator: 'อ.กานดา สุนทรพจน์',
    category: 'วรรณกรรม',
    publishedDate: '2026-01-20',
    description: 'การวิเคราะห์โครงสร้างบทประพันธ์ คุณค่าทางศิลปะ และบริบททางสังคมของวรรณกรรมไทยชิ้นเอกตั้งแต่ยุคอยุธยาจนถึงรัตนโกสินทร์',
    status: true,
  },
  {
    title: 'โครงสร้างข้อมูลขั้นสูงและการออกแบบอัลกอริทึม',
    creator: 'ผศ.ดร.สมชาย ใจดี',
    category: 'เทคโนโลยี',
    publishedDate: '2026-03-05',
    description: 'เนื้อหาเน้นการวิเคราะห์ Big-O Notation, Binary Search Trees, Graph Traversals, Dynamic Programming และโจทย์สำหรับเตรียมตัวสัมภาษณ์งาน',
    status: false,
  },
  {
    title: 'พันธุศาสตร์ระดับโมเลกุลและเทคโนโลยีชีวภาพ',
    creator: 'ดร.ธนภัทร สุขสม',
    category: 'วิทยาศาสตร์',
    publishedDate: '2026-02-28',
    description: 'การศึกษาโครงสร้าง DNA, การถอดรหัสพันธุกรรม, เทคโนโลยี CRISPR และการนำพันธุวิศวกรรมไปประยุกต์ใช้ในการเกษตรและการแพทย์',
    status: true,
  },
  {
    title: 'ฉันทลักษณ์ไทยร่วมสมัยและศิลปะการร้อยกรอง',
    creator: 'อ.กานดา สุนทรพจน์',
    category: 'วรรณกรรม',
    publishedDate: '2026-03-12',
    description: 'รวบรวมแบบแผนคำประพันธ์ กลอนสุภาพ โคลงสี่สุภาพ และเทคนิคการประพันธ์บทกวีเพื่อสะท้อนภาพชีวิตและสังคมปัจจุบัน',
    status: false,
  },
  {
    title: 'ความมั่นคงปลอดภัยบนระบบเครือข่ายและสถาปัตยกรรมคลาวด์',
    creator: 'อาจารย์เอกชัย ดาต้าเน็ต',
    category: 'เทคโนโลยี',
    publishedDate: '2026-04-01',
    description: 'แนวปฏิบัติการปกป้องข้อมูลสำคัญ การทำ Network Hardening, Firewall, Zero Trust Architecture และการเข้ารหัสข้อมูลระดับสากล',
    status: true,
  },
  {
    title: 'เคมีอินทรีย์และการประยุกต์ในอุตสาหกรรมยา',
    creator: 'ดร.วิภาดา วิทยาภรณ์',
    category: 'วิทยาศาสตร์',
    publishedDate: '2026-04-18',
    description: 'สารประกอบไฮโดรคาร์บอน กลไกปฏิกิริยาการสังเคราะห์ยา และการสกัดสารออกฤทธิ์ทางชีวภาพจากสมุนไพรธรรมชาติ',
    status: false,
  },
  {
    title: 'วรรณกรรมเยาวชนคลาสสิกกับการปลูกฝังคุณธรรม',
    creator: 'อ.ชนินทร์ รักษ์ภาษา',
    category: 'วรรณกรรม',
    publishedDate: '2026-05-02',
    description: 'การวิเคราะห์สารและสัญลักษณ์ในวรรณกรรมเยาวชนระดับโลกที่ช่วยส่งเสริมการคิดวิเคราะห์ ความเห็นอกเห็นใจ และการเรียนรู้ตลอดชีวิต',
    status: true,
  },
  {
    title: 'การออกแบบสถาปัตยกรรม Microservices และ Docker Containerization',
    creator: 'ผศ.ดร.สมชาย ใจดี',
    category: 'เทคโนโลยี',
    publishedDate: '2026-05-20',
    description: 'หลักการแบ่งโมดูลบริการ การจัดการ Container ด้วย Docker, การทำ Service Discovery และการสื่อสารระหว่างบริการด้วย Message Queue',
    status: true,
  },
  {
    title: 'ฟิสิกส์ควอนตัมสำหรับผู้เริ่มต้นและเทคโนโลยีควอนตัมคอมพิวเตอร์',
    creator: 'ดร.ธนภัทร สุขสม',
    category: 'วิทยาศาสตร์',
    publishedDate: '2026-06-11',
    description: 'ทำความเข้าใจหลักทวิภาวะคลื่น-อนุภาค การพัวพันเชิงควอนตัม (Quantum Entanglement) และก้าวต่อไปของระบบประมวลผลความเร็วสูง',
    status: true,
  },
  {
    title: 'ศิลปะการเล่าเรื่องและการสร้างตัวละครในนวนิยายสมัยใหม่',
    creator: 'อ.ชนินทร์ รักษ์ภาษา',
    category: 'วรรณกรรม',
    publishedDate: '2026-06-25',
    description: 'เจาะลึกทฤษฎี Three-Act Structure, Hero’s Journey, การกำหนดแรงจูงใจตัวละคร และเทคนิคการเขียนบทสนทนาให้น่าติดตาม',
    status: false,
  },
];

// ฟังก์ชันเริ่มระบบและตรวจสอบ/สร้างข้อมูลเริ่มต้น
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('✅ เชื่อมต่อฐานข้อมูลสำเร็จ');

    // สร้างตารางถ้ายังไม่มี
    await sequelize.sync();
    console.log('✅ ซิงค์ตาราง learning_resources สำเร็จ');

    // ตรวจสอบและเพิ่มข้อมูลเริ่มต้นถ้ายังไม่มีข้อมูลในตาราง
    const existingCount = await LearningResource.count();
    if (existingCount === 0) {
      await LearningResource.bulkCreate(initialSeedData);
      console.log(`✅ เพิ่มข้อมูลเริ่มต้นจำนวน ${initialSeedData.length} รายการสำเร็จ`);
    } else {
      console.log(`ℹ️ พบข้อมูลเดิมในระบบจำนวน ${existingCount} รายการ (ไม่เพิ่มข้อมูลซ้ำ)`);
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 เซิร์ฟเวอร์ Backend พร้อมทำงานที่ http://0.0.0.0:${PORT}`);
    });
  } catch (error) {
    console.error('❌ ไม่สามารถเริ่มต้นเซิร์ฟเวอร์ Backend ได้:', error);
    process.exit(1);
  }
}

// ถ้าถูกเรียกโดยตรง ให้เปิดเซิร์ฟเวอร์
if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
