import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { createServer as createViteServer } from 'vite';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sequelize = require('./backend/config/database.js');
const LearningResource = require('./backend/model/LearningResource.js');
const resourceRouter = require('./backend/router/resourceRouter.js');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Mount Backend RESTful API Router
app.use('/api/learning-resources', resourceRouter);

// Seed Data
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

async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    const count = await LearningResource.count();
    if (count === 0) {
      await LearningResource.bulkCreate(initialSeedData);
      console.log(`[Seed] Seeded ${initialSeedData.length} initial learning resources`);
    }

    if (process.env.NODE_ENV !== 'production') {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } else {
      app.use(express.static(path.resolve(__dirname, 'dist')));
      app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
      });
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on http://0.0.0.0:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
}

start();
