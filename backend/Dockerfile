FROM node:22-alpine

WORKDIR /app

# คัดลอกไฟล์ dependencies
COPY package*.json ./

# ติดตั้ง dependencies สำหรับ production
RUN npm install --omit=dev

# คัดลอกซอร์สโค้ดของ Backend ทั้งหมด
COPY . .

# กำหนดพอร์ต
EXPOSE 5000

# กำหนดตัวแปรสภาพแวดล้อมเริ่มต้น
ENV PORT=5000
ENV NODE_ENV=production

# คำสั่งเริ่มต้นการทำงาน
CMD ["npm", "start"]
