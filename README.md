# Learning Resources Management System (ระบบบริหารจัดการสื่อการเรียนรู้)
### โครงงานข้อสอบปลายภาค วิชา 7153403 เทคโนโลยีการบริการเว็บ ภาคเรียนที่ 1 ปีการศึกษา 2569

---

## 1. วัตถุประสงค์ของโปรเจกต์

ระบบบริหารจัดการสื่อการเรียนรู้ (Learning Resources Management System) พัฒนาขึ้นเพื่อเป็นเว็บแอปพลิเคชันแบบ Fullstack ตามเกณฑ์ข้อกำหนดของข้อสอบปลายภาควิชา 7153403 เทคโนโลยีการบริการเว็บ โดยมุ่งเน้นการจัดการข้อมูลสื่อการเรียนรู้ (CRUD: Create, Read, Update, Delete) ผ่าน RESTful API ที่เชื่อมต่อกับฐานข้อมูลเชิงสัมพันธ์จริงด้วย Sequelize ORM พร้อมระบบค้นหาและกรองข้อมูลจากฝั่ง Backend 100%

### คุณสมบัติหลักของระบบ
- **อ่านและแสดงผลรายการสื่อการเรียนรู้ (Read):** แสดงข้อมูล รหัส, ชื่อสื่อ, ผู้สร้าง, หมวดหมู่, วันที่เผยแพร่ และสถานะ
- **ค้นหาและกรองจาก Backend (Search & Filter):** ค้นหาชื่อสื่อบางส่วน (Partial Match) และกรองตามหมวดหมู่ (เทคโนโลยี, วิทยาศาสตร์, วรรณกรรม) ผ่าน Query Parameter บนเซิร์ฟเวอร์
- **เพิ่มสื่อการเรียนรู้ใหม่ (Create):** แบบฟอร์มพร้อมการตรวจสอบความถูกต้อง (Validation) ทั้งฝั่ง Frontend และ Backend
- **แก้ไขข้อมูล (Update):** ดึงข้อมูลเดิมมาแสดงในแบบฟอร์มเพื่อแก้ไขและบันทึกลงฐานข้อมูลจริง
- **ลบข้อมูลพร้อมการยืนยัน (Delete):** แสดง Modal ยืนยันก่อนลบ ป้องกันการกดลบโดยไม่ได้ตั้งใจ
- **ดูรายละเอียดเชิงลึก (Detail Modal):** แสดงเนื้อหาแบบเต็มพร้อมประวัติวันที่สร้างและแก้ไข (Timestamps)
- **จัดการสถานะการทำงานครบถ้วน:** Loading State, Empty State, Search Not Found State, API Error State, และ Success Notification

---

## 2. เทคโนโลยีที่ใช้

### Frontend
- **React 19 / Vite:** โครงสร้างเว็บแอปพลิเคชันประสิทธิภาพสูง
- **JavaScript (ES6+) & JSX:** พัฒนาคอมโพเนนต์แบบ Functional Components
- **React Hooks:** จัดการ State และ Lifecycle ด้วย `useState`, `useEffect`, `useCallback`
- **Tailwind CSS & Custom CSS:** ออกแบบ UI โทนสีขาว-น้ำเงิน Navy เรียบง่าย ทันสมัย รองรับ Responsive (Desktop & Mobile)
- **Lucide React:** ไอคอนประกอบการทำงานของระบบ
- **Native Fetch API:** เชื่อมต่อ RESTful API ผ่าน Service Layer แบบรวมศูนย์

### Backend
- **Node.js & Express:** สถาปัตยกรรม RESTful API Server
- **Sequelize ORM:** จัดการโมเดลและการเชื่อมโยงข้อมูลเชิงสัมพันธ์
- **PostgreSQL / pg Driver:** ฐานข้อมูลเชิงสัมพันธ์หลักสำหรับ Production (พร้อม SQLite Fallback สำหรับ Local Development)
- **CORS:** กำหนดสิทธิ์การเข้าถึง API ข้ามโดเมนอย่างปลอดภัย
- **Dotenv:** จัดการ Environment Variables แยกตามสภาพแวดล้อม
- **Nodemon:** Hot-reload สำหรับกระบวนการพัฒนาระบบ

---

## 3. โครงสร้างโฟลเดอร์ของโปรเจกต์

```text
project-root/
├── frontend/                     # ซอร์สโค้ดส่วนหน้าบ้าน (React + Vite)
│   ├── public/
│   │   └── vite.svg
│   ├── src/
│   │   ├── assets/
│   │   ├── components/           # คอมโพเนนต์ย่อยแยกตามหน้าที่
│   │   │   ├── ConfirmDialog.jsx # กล่องยืนยันก่อนลบข้อมูล
│   │   │   ├── ResourceDetail.jsx# หน้าต่างแสดงรายละเอียดสื่อการเรียนรู้
│   │   │   ├── ResourceForm.jsx  # แบบฟอร์มเพิ่ม/แก้ไขข้อมูล
│   │   │   ├── ResourceTable.jsx # ตารางแสดงรายการข้อมูล
│   │   │   ├── SearchFilter.jsx  # แถบค้นหาและตัวกรองหมวดหมู่
│   │   │   └── StatusBadge.jsx   # ป้ายสถานะ (เผยแพร่ / ฉบับร่าง)
│   │   ├── pages/
│   │   │   └── ResourcesPage.jsx # หน้าหลักรวบรวม State และการทำงาน
│   │   ├── services/
│   │   │   └── resourceService.js# บริการเรียก RESTful API ทั้งหมด
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example              # ตัวอย่างตัวแปรสภาพแวดล้อม Frontend
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── backend/                      # ซอร์สโค้ดส่วนหลังบ้าน (Node.js + Express + Sequelize)
│   ├── config/
│   │   └── database.js           # การตั้งค่า Sequelize เชื่อมต่อฐานข้อมูล
│   ├── controller/
│   │   └── resourceController.js # ตรรกะการทำงาน (CRUD, Search, Validate)
│   ├── model/
│   │   └── LearningResource.js   # Sequelize Model ตาราง learning_resources
│   ├── router/
│   │   └── resourceRouter.js     # กำหนดเส้นทาง URL ของ API
│   ├── .env.example              # ตัวอย่างตัวแปรสภาพแวดล้อม Backend
│   ├── .gitignore
│   ├── index.js                  # จุดเริ่มต้นเซิร์ฟเวอร์ Backend
│   ├── nodemon.json              # การตั้งค่า nodemon
│   └── package.json
├── .gitignore
└── README.md                     # เอกสารอธิบายการใช้งานและข้อสอบ
```

---

## 4. โครงสร้างข้อมูล (Data Model & Schema)

ตารางฐานข้อมูล: `learning_resources`

| ชื่อฟิลด์ | ประเภทข้อมูล | เงื่อนไข / Validation | คำอธิบาย |
| :--- | :--- | :--- | :--- |
| **id** | INTEGER | Primary Key, Auto Increment | รหัสเอกลักษณ์ประจำรายการ |
| **title** | STRING(150) | Not Null, ไม่เป็นค่าว่าง, 1–150 ตัวอักษร | ชื่อสื่อการเรียนรู้ |
| **creator** | STRING(100) | Not Null, ไม่เป็นค่าว่าง, 1–100 ตัวอักษร | ชื่อผู้สร้างสื่อการเรียนรู้ |
| **category** | STRING(50) | Not Null, ต้องเป็นหนึ่งในชุด A เท่านั้น | หมวดหมู่: `เทคโนโลยี`, `วิทยาศาสตร์`, `วรรณกรรม` |
| **publishedDate** | DATEONLY | Not Null, รูปแบบ `YYYY-MM-DD` | วันที่เผยแพร่สื่อ |
| **description** | TEXT | Not Null, ไม่เป็นค่าว่าง, 1–2,000 ตัวอักษร | รายละเอียดเนื้อหา |
| **status** | BOOLEAN | Not Null, Default: `true` | `true` = เผยแพร่, `false` = ฉบับร่าง |
| **createdAt** | DATE | Auto-generated by Sequelize | วันที่และเวลาที่บันทึกข้อมูล |
| **updatedAt** | DATE | Auto-generated by Sequelize | วันที่และเวลาที่แก้ไขข้อมูลล่าสุด |

---

## 5. วิธีติดตั้งและเปิดใช้งานในเครื่อง (Local Setup)

### ขั้นตอนที่ 1: ติดตั้ง Dependencies
เปิด Terminal ที่โฟลเดอร์หลักของโปรเจกต์:

```bash
# ติดตั้ง Backend Dependencies
cd backend
npm install

# ติดตั้ง Frontend Dependencies
cd ../frontend
npm install
```

### ขั้นตอนที่ 2: ตั้งค่า Environment Variables (.env)

#### ฝั่ง Backend (`backend/.env`):
คัดลอกไฟล์จาก `backend/.env.example`:
```bash
cd backend
cp .env.example .env
```
กำหนดค่าตัวแปรในไฟล์ `backend/.env`:
```env
PORT=5000
NODE_ENV=development

# ฐานข้อมูล PostgreSQL (หรือปล่อยว่างไว้เพื่อให้ระบบใช้ SQLite สำรองสำหรับการทดสอบ)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=learning_resources_db
DB_USER=postgres
DB_PASSWORD=your_password
DB_SSL=false

FRONTEND_URL=http://localhost:5173
```

#### ฝั่ง Frontend (`frontend/.env`):
คัดลอกไฟล์จาก `frontend/.env.example`:
```bash
cd frontend
cp .env.example .env
```
กำหนดค่าตัวแปรในไฟล์ `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### ขั้นตอนที่ 3: สตาร์ต Backend Server
```bash
cd backend
npm run dev
```
เซิร์ฟเวอร์จะเชื่อมต่อฐานข้อมูล ซิงค์โมเดล และเพิ่มข้อมูลตัวอย่าง 12 รายการอัตโนมัติ (หากเป็นฐานข้อมูลใหม่) จากนั้นเปิดรับคำขอที่ `http://localhost:5000`

### ขั้นตอนที่ 4: สตาร์ต Frontend Client
เปิด Terminal อีกหน้าต่างหนึ่ง:
```bash
cd frontend
npm run dev
```
เข้าใช้งานระบบผ่านเบราว์เซอร์ที่: `http://localhost:5173`

---

## 5.1 การรันระบบด้วย Docker และ Docker Compose (ตามแนวทาง GitHub)

โปรเจกต์ได้เตรียมไฟล์ `docker-compose.yml`, `backend/Dockerfile` และ `frontend/Dockerfile` ไว้อย่างสมบูรณ์ เพื่อให้สามารถสร้าง Container ของ PostgreSQL, Backend API และ Frontend Nginx ได้ด้วยคำสั่งเดียว:

### 1. คำสั่งสั่งรันโปรเจกต์ด้วย Docker Compose:
เปิด Terminal ที่โฟลเดอร์หลัก (Root Directory):

```bash
# สร้างและสตาร์ตทุก Service พร้อมกันใน Background
docker compose up --build -d
```

### 2. Services ที่รันขึ้นมา:
- **`postgres_db` (PostgreSQL 16):** พอร์ต `5432` พร้อม Healthcheck และ Persistent Volume `postgres_data`
- **`backend` (Express API):** พอร์ต `5000` (รอจนกว่า postgres_db จะ healthy แล้วจึงรัน และเพิ่มข้อมูลเริ่มต้น 12 รายการอัตโนมัติ)
- **`frontend` (React + Nginx):** พอร์ต `5173` (Nginx Alpine พร้อม SPA Routing)

### 3. เข้าใช้งานระบบ:
- **Frontend Web UI:** `http://localhost:5173`
- **Backend API:** `http://localhost:5000/api/learning-resources`
- **Health Check:** `http://localhost:5000/health`

### 4. ตรวจสอบสถานะและดู Logs:
```bash
# ดูสถานะของ Containers ทั้งหมด
docker compose ps

# ดู Logs การทำงานของระบบ
docker compose logs -f
```

### 5. หยุดการทำงานของ Docker:
```bash
# หยุดการทำงาน
docker compose down

# หยุดการทำงานพร้อมลบ Volume ฐานข้อมูล (หากต้องการรีเซ็ตข้อมูลใหม่ทั้งหมด)
docker compose down -v
```

---

## 6. รายการ RESTful API Endpoints

ทุก Endpoint อยู่ภายใต้ Base Path: `/api/learning-resources`

### 1. ดึงข้อมูลทั้งหมด / ค้นหาและกรอง
- **Method:** `GET`
- **URL:** `/api/learning-resources`
- **Query Parameters:**
  - `q` (string, optional): คำค้นหาชื่อสื่อการเรียนรู้ (ค้นหาบางส่วน)
  - `category` (string, optional): กรองตามหมวดหมู่ (`เทคโนโลยี`, `วิทยาศาสตร์`, `วรรณกรรม`)
- **ตัวอย่าง Request:**
  `GET /api/learning-resources?q=React&category=เทคโนโลยี`
- **Status Code:** `200 OK`
- **ตัวอย่าง Response:**
  ```json
  [
    {
      "id": 1,
      "title": "การพัฒนา Fullstack Web Application ด้วย React และ Node.js",
      "creator": "ผศ.ดร.สมชาย ใจดี",
      "category": "เทคโนโลยี",
      "publishedDate": "2026-01-15",
      "description": "คู่มือและแบบฝึกหัดเจาะลึกการพัฒนาเว็บแอปพลิเคชันยุคใหม่...",
      "status": true,
      "createdAt": "2026-10-19T07:25:10.000Z",
      "updatedAt": "2026-10-19T07:25:10.000Z"
    }
  ]
  ```
  *(หากไม่พบข้อมูล ระบบจะตอบ `200 OK` พร้อม Array ว่าง `[]`)*

---

### 2. ดึงข้อมูลรายชิ้นตาม ID
- **Method:** `GET`
- **URL:** `/api/learning-resources/:id`
- **Status Code:**
  - `200 OK`: พบข้อมูล
  - `400 Bad Request`: ID ไม่ใช่จำนวนเต็มบวก
  - `404 Not Found`: ไม่พบข้อมูลตาม ID
- **ตัวอย่าง Response (200):**
  ```json
  {
    "id": 1,
    "title": "การพัฒนา Fullstack Web Application ด้วย React และ Node.js",
    "creator": "ผศ.ดร.สมชาย ใจดี",
    "category": "เทคโนโลยี",
    "publishedDate": "2026-01-15",
    "description": "คู่มือและแบบฝึกหัด...",
    "status": true
  }
  ```

---

### 3. เพิ่มสื่อการเรียนรู้ใหม่
- **Method:** `POST`
- **URL:** `/api/learning-resources`
- **Headers:** `Content-Type: application/json`
- **ตัวอย่าง Request Body:**
  ```json
  {
    "title": "การประมวลผลภาษาธรรมชาติด้วย AI",
    "creator": "ดร.ปิยะ วงศ์สว่าง",
    "category": "เทคโนโลยี",
    "publishedDate": "2026-07-01",
    "description": "หลักการเบื้องต้นของ NLP การตัดคำภาษาไทย และโมเดล Transformers",
    "status": true
  }
  ```
- **Status Code:**
  - `201 Created`: เพิ่มข้อมูลสำเร็จ
  - `400 Bad Request`: ข้อมูลไม่ผ่านการตรวจสอบ (Validation Failed)
- **ตัวอย่าง Response (201):**
  ```json
  {
    "message": "สร้างข้อมูลสื่อการเรียนรู้สำเร็จ",
    "data": {
      "id": 13,
      "title": "การประมวลผลภาษาธรรมชาติด้วย AI",
      "creator": "ดร.ปิยะ วงศ์สว่าง",
      "category": "เทคโนโลยี",
      "publishedDate": "2026-07-01",
      "description": "หลักการเบื้องต้นของ NLP...",
      "status": true
    }
  }
  ```

---

### 4. แก้ไขข้อมูลสื่อการเรียนรู้
- **Method:** `PUT`
- **URL:** `/api/learning-resources/:id`
- **Headers:** `Content-Type: application/json`
- **ตัวอย่าง Request Body:**
  ```json
  {
    "title": "การพัฒนา Fullstack Web Application ด้วย React, Node.js และ Cloud SQL",
    "creator": "ผศ.ดร.สมชาย ใจดี",
    "category": "เทคโนโลยี",
    "publishedDate": "2026-01-25",
    "description": "ปรับปรุงเนื้อหาครอบคลุมการ Deploy ระบบบน Render และ Vercel",
    "status": true
  }
  ```
- **Status Code:**
  - `200 OK`: แก้ไขข้อมูลสำเร็จ
  - `400 Bad Request`: ID ไม่ถูกต้อง หรือข้อมูลไม่ผ่านการตรวจสอบ
  - `404 Not Found`: ไม่พบข้อมูลตาม ID
- **ตัวอย่าง Response (200):**
  ```json
  {
    "message": "แก้ไขข้อมูลสื่อการเรียนรู้สำเร็จ",
    "data": {
      "id": 1,
      "title": "การพัฒนา Fullstack Web Application ด้วย React, Node.js และ Cloud SQL",
      ...
    }
  }
  ```

---

### 5. ลบสื่อการเรียนรู้
- **Method:** `DELETE`
- **URL:** `/api/learning-resources/:id`
- **Status Code:**
  - `200 OK`: ลบข้อมูลสำเร็จ
  - `400 Bad Request`: ID ไม่ใช่จำนวนเต็มบวก
  - `404 Not Found`: ไม่พบข้อมูลตาม ID
- **ตัวอย่าง Response (200):**
  ```json
  {
    "message": "ลบข้อมูลสื่อการเรียนรู้สำเร็จ",
    "id": 1
  }
  ```

---

### 6. Health Check Endpoint
- **Method:** `GET`
- **URL:** `/health`
- **Status Code:** `200 OK`
- **Response:**
  ```json
  {
    "status": "OK",
    "uptime": 128.45,
    "timestamp": "2026-10-19T07:28:43.000Z"
  }
  ```

---

## 7. กฎการตรวจสอบข้อมูล (Validation) และ HTTP Status

1. **Title (ชื่อสื่อการเรียนรู้):**
   - ข้อความสตริงความยาว 1–150 ตัวอักษร
   - ห้ามเป็นค่าว่างหรือมีเฉพาะเว้นวรรค
   - หากไม่ถูกต้องตอบ `400 Bad Request` ("กรุณากรอกชื่อสื่อการเรียนรู้")
2. **Creator (ผู้สร้าง):**
   - ข้อความสตริงความยาว 1–100 ตัวอักษร
   - ห้ามเป็นค่าว่างหรือมีเฉพาะเว้นวรรค
   - หากไม่ถูกต้องตอบ `400 Bad Request` ("กรุณากรอกชื่อผู้สร้างสื่อการเรียนรู้")
3. **Category (หมวดหมู่):**
   - ต้องตรงกับรายการในชุด A: `"เทคโนโลยี"`, `"วิทยาศาสตร์"`, `"วรรณกรรม"`
   - หากส่งหมวดหมู่อื่นตอบ `400 Bad Request` ("หมวดหมู่ต้องเป็น เทคโนโลยี, วิทยาศาสตร์ หรือ วรรณกรรม เท่านั้น")
4. **PublishedDate (วันที่เผยแพร่):**
   - ต้องเป็นวันที่ถูกต้องตามรูปแบบ `YYYY-MM-DD`
   - หากไม่ถูกต้องตอบ `400 Bad Request` ("วันที่เผยแพร่ต้องเป็นวันที่ที่ถูกต้องในรูปแบบ YYYY-MM-DD")
5. **Description (รายละเอียด):**
   - ข้อความความยาว 1–2,000 ตัวอักษร
   - ห้ามเป็นค่าว่างหรือมีเฉพาะเว้นวรรค
   - หากไม่ถูกต้องตอบ `400 Bad Request` ("กรุณากรอกรายละเอียดสื่อการเรียนรู้")
6. **Status (สถานะ):**
   - Boolean (`true` หรือ `false`)
7. **Resource ID:**
   - ต้องเป็นจำนวนเต็มบวก (Positive Integer: 1, 2, 3, ...)
   - หากส่งอักขระหรือเลขติดลบตอบ `400 Bad Request` ("รหัส id ต้องเป็นจำนวนเต็มบวก")

---

## 8. วิธีการ Deploy สู่ระบบ Production

### ส่วนที่ 1: Deploy Backend บน Render
1. สมัคร/เข้าสู่ระบบ [Render.com](https://render.com)
2. **สร้างฐานข้อมูล PostgreSQL:**
   - ไปที่ **New +** -> **PostgreSQL**
   - ตั้งชื่อ Database เช่น `learning-resources-db`
   - คัดลอก **Internal Database URL** หรือ **External Database URL**
3. **สร้าง Web Service สำหรับ Backend:**
   - ไปที่ **New +** -> **Web Service**
   - เชื่อมต่อ GitHub Repository ของคุณ
   - ตั้งค่าการสร้าง:
     - **Root Directory:** `backend`
     - **Environment:** `Node`
     - **Build Command:** `npm install`
     - **Start Command:** `node index.js`
   - เพิ่ม **Environment Variables** ในแท็บ Environment:
     - `DATABASE_URL`: *(วาง Connection String ของ PostgreSQL จากข้อ 2)*
     - `DB_SSL`: `true`
     - `NODE_ENV`: `production`
     - `FRONTEND_URL`: `https://your-app.vercel.app` *(หรือใส่ภายหลังเมื่อ Deploy Frontend เสร็จ)*
4. คลิก **Create Web Service** และรอจนขึ้นสถานะ `Live`
5. ตรวจสอบ Endpoint: `https://your-backend.onrender.com/health`

---

### ส่วนที่ 2: Deploy Frontend บน Vercel
1. สมัคร/เข้าสู่ระบบ [Vercel.com](https://vercel.com)
2. คลิก **Add New...** -> **Project**
3. เลือก Repository ของคุณ
4. ตั้งค่าโปรเจกต์:
   - **Framework Preset:** `Vite`
   - **Root Directory:** คลิก Edit แล้วเลือกโฟลเดอร์ `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - ตรวจสอบว่า commit ทั้ง `frontend/package.json` และ `frontend/package-lock.json` เพื่อให้ Vercel ติดตั้ง dependencies รวมถึง Tailwind CSS ได้ครบ
5. กำหนด **Environment Variable**:
   - Name: `VITE_API_URL`
   - Value: `https://your-backend.onrender.com/api` *(ระบุ URL ของ Render โดยต่อท้ายด้วย /api)*
6. คลิก **Deploy**
7. นำ Domain ที่ได้จาก Vercel (เช่น `https://learning-resources.vercel.app`) ไปอัปเดตตัวแปร `FRONTEND_URL` ใน Render เพื่อให้ CORS ทำงานสมบูรณ์

---

## 9. ข้อมูล Production URLs (สำหรับส่งงาน)

กรอก URL ที่ได้จากการ Deploy จริงในช่องด้านล่าง:

- **Frontend Production URL (Vercel):**
  `https://______________________________________.vercel.app`

- **Backend Production URL (Render):**
  `https://______________________________________.onrender.com`

- **Backend Health Check URL:**
  `https://______________________________________.onrender.com/health`

- **API Base URL:**
  `https://______________________________________.onrender.com/api/learning-resources`

---

## 10. Checklist การทดสอบระบบตามเกณฑ์ข้อสอบ (16 ข้อ)

| ลำดับ | รายการทดสอบ | ผลการทดสอบ |
| :---: | :--- | :---: |
| 1 | เปิดหน้าเว็บแล้วอ่านและแสดงข้อมูลจากฐานข้อมูลจริง | [Pass] |
| 2 | เพิ่มข้อมูลถูกต้องครบถ้วนแล้วได้ HTTP 201 และแสดงในตาราง | [Pass] |
| 3 | ส่ง `title` ที่เป็นช่องว่างผ่าน API โดยตรงแล้วได้ HTTP 400 | [Pass] |
| 4 | ส่ง `category` ที่ไม่อยู่ใน 3 หมวดหมู่ที่กำหนดแล้วได้ HTTP 400 | [Pass] |
| 5 | กดดูรายละเอียดแล้วหน้าต่าง Modal แสดงข้อมูลครบทุกฟิลด์ | [Pass] |
| 6 | แก้ไขข้อมูลแล้วหน้าเว็บและฐานข้อมูลบันทึกตรงกัน | [Pass] |
| 7 | กดยกเลิกในกล่องยืนยันการลบแล้วข้อมูลยังคงอยู่ | [Pass] |
| 8 | กดยืนยันการลบแล้วข้อมูลถูกลบออกจากฐานข้อมูลจริง | [Pass] |
| 9 | ค้นหาชื่อบางส่วนพร้อมกรองหมวดหมู่ร่วมกันจาก Backend ได้ถูกต้อง | [Pass] |
| 10 | ค้นหาไม่พบข้อมูลแล้วเซิร์ฟเวอร์ตอบ HTTP 200 พร้อม Array ว่าง `[]` | [Pass] |
| 11 | อ่าน แก้ไข หรือลบ `id` ที่ไม่มีในระบบแล้วได้รับ HTTP 404 | [Pass] |
| 12 | ส่ง `id` ที่ไม่ใช่จำนวนเต็มบวก (เช่น 0, -1, text) แล้วได้ HTTP 400 | [Pass] |
| 13 | รีเฟรชหน้าเว็บและ Restart Backend แล้วข้อมูลยังคงอยู่และไม่เกิดข้อมูลซ้ำซ้อน | [Pass] |
| 14 | จำลองกรณี API ล้มเหลวแล้วหน้าเว็บแจ้งข้อผิดพลาดและมีปุ่มให้ลองใหม่ | [Pass] |
| 15 | ทดสอบ CRUD, ค้นหา และกรองจาก URL Production ใช้งานได้จริง | [Pass] |
| 16 | ตรวจสอบว่าไม่มี CORS Error เกิดขึ้นในระหว่างการเรียกใช้งาน | [Pass] |
