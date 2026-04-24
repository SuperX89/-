# วิธี Deploy ระบบขึ้น Cloud (ฟรี 100%)

ใช้ **Neon Postgres + Vercel Blob + Vercel Hosting** ทุกอย่างฟรี

ใช้เวลาทั้งหมดประมาณ **20-30 นาที** ครั้งเดียวจบ หลังจากนั้นเข้าใช้งานจากมือถือได้ตลอด 24/7

---

## 📋 เตรียมตัว

ต้องสมัคร 3 account (ทั้งหมดใช้ GitHub หรือ Google login ได้):
- [ ] GitHub — https://github.com
- [ ] Neon — https://neon.tech
- [ ] Vercel — https://vercel.com

---

## ขั้นที่ 1 — สมัคร Neon + สร้าง Database

1. ไปที่ https://console.neon.tech → Sign up (ใช้ GitHub login สะดวกสุด)
2. คลิก **Create Project**
   - Name: `toy-resale`
   - Postgres version: 16
   - Region: **Singapore** (ใกล้ไทยที่สุด ความเร็วดี)
   - คลิก **Create Project**
3. หน้าถัดไปจะมี **Connection string** ให้ copy
   - เลือกแท็บ **Pooled connection** (สำคัญ! ต้องเลือก pooled ไม่งั้น Prisma จะ connection leak)
   - Copy ทั้งบรรทัด `postgresql://...?sslmode=require`
4. เก็บไว้ก่อน — จะใช้ในขั้นที่ 4

---

## ขั้นที่ 2 — Push โค้ดขึ้น GitHub

### ถ้ายังไม่มี git
```bash
cd "C:\Users\pc\Documents\โปรเจค"
git init
git add .
git commit -m "Initial commit"
```

### สร้าง repo บน GitHub
1. ไปที่ https://github.com/new
2. Name: `toy-resale`
3. **Private** (แนะนำ เพราะมีข้อมูลร้าน)
4. **อย่าติ๊ก** "Add a README" / ".gitignore" / "license"
5. คลิก **Create repository**
6. หน้าถัดไปจะเห็นคำสั่ง copy-paste ประมาณนี้:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/toy-resale.git
   git branch -M main
   git push -u origin main
   ```
   รันในเทอร์มินัล

---

## ขั้นที่ 3 — Deploy ขึ้น Vercel

1. ไปที่ https://vercel.com/new
2. คลิก **Import** ข้างๆ repo `toy-resale`
3. หน้าถัดไป **อย่ากด Deploy เลย** — ต้องตั้ง env vars ก่อน
4. เลื่อนลงไปที่ **Environment Variables** เพิ่ม 1 ตัวก่อน:
   - Name: `DATABASE_URL`
   - Value: วาง connection string จาก Neon (ขั้นที่ 1 ข้อ 3)
5. คลิก **Deploy** — รอประมาณ 1-2 นาที
6. จะเจอ error "BLOB_READ_WRITE_TOKEN not found" → ไม่เป็นไร ไปขั้นต่อไป

---

## ขั้นที่ 4 — สร้าง Vercel Blob (ที่เก็บรูป)

1. ใน Vercel project → แท็บ **Storage**
2. คลิก **Create Database** → เลือก **Blob**
3. Name: `toy-resale-images` → **Create**
4. หลังสร้างเสร็จ Vercel จะ auto-link ให้กับ project พร้อมเซ็ต env var `BLOB_READ_WRITE_TOKEN` อัตโนมัติ
5. กลับไปที่แท็บ **Deployments** → คลิกที่ deployment ล่าสุด → **Redeploy** (ปุ่มมุมขวาบน)
6. รออีก 1-2 นาที

---

## ขั้นที่ 5 — สร้างตารางใน Neon

ครั้งแรกต้องบอก Neon ให้สร้างตาราง

### วิธี A — จากเครื่องคุณ (เร็วที่สุด)

1. เปิดไฟล์ `.env` ในโปรเจกต์ → ใส่ `DATABASE_URL` จาก Neon (อย่า commit)
2. ในเทอร์มินัลรัน:
   ```bash
   cd "C:\Users\pc\Documents\โปรเจค"
   npx prisma db push
   ```
3. จะเห็นข้อความ `Your database is now in sync with your Prisma schema`

### วิธี B — จาก Vercel CLI (ถ้าไม่อยากเก็บ DATABASE_URL ในเครื่อง)

```bash
npm i -g vercel
vercel link
vercel env pull .env.production
npx prisma db push
```

---

## ขั้นที่ 6 — เข้าใช้งาน

1. กลับไปที่ Vercel project → คลิก URL ที่ขึ้นด้านบน เช่น `https://toy-resale-xxx.vercel.app`
2. ลองเพิ่มสินค้า + อัปโหลดรูปดู
3. เปิดมือถือ → URL เดียวกัน ใช้งานได้เลย

### เก็บเป็นแอปบนมือถือ (PWA-like)
- **Safari** (iOS): กด Share → Add to Home Screen
- **Chrome** (Android): กดเมนูขวาบน → ติดตั้งแอป

---

## 🎉 เสร็จแล้ว!

หลังจากนี้ เมื่อคุณ `git push` โค้ดใหม่ Vercel จะ deploy ให้อัตโนมัติภายใน 1-2 นาที

---

## 📌 สรุป URL / ข้อมูลที่ควรจด

| ชื่อ | ที่ไหน |
|---|---|
| ลิงก์เว็บ | `https://xxx.vercel.app` (Vercel dashboard) |
| ฐานข้อมูล | console.neon.tech |
| ไฟล์รูป | vercel.com → Storage → Blob |
| Deployment | vercel.com → Deployments |

---

## 🔧 ปัญหาที่เจอบ่อย

### "Internal Server Error" หลัง deploy
- **เช็ค env var**: `DATABASE_URL` และ `BLOB_READ_WRITE_TOKEN` ถูกตั้งหรือยัง
- **ยังไม่ได้ `prisma db push`**: ตารางใน Neon ยังไม่มี ให้ไปขั้นที่ 5
- **เช็ค logs**: Vercel → Deployments → คลิก deployment → Runtime Logs

### Image upload error "BLOB_READ_WRITE_TOKEN not found"
- ยังไม่ได้สร้าง Blob ในขั้นที่ 4 หรือยังไม่ได้ **Redeploy** หลังสร้าง

### รูปเก่าหายหลัง deploy
- เพราะรูปที่อัปโหลดในเครื่องตอนทดสอบ local จะอยู่ใน `public/uploads/` ซึ่งไม่ถูก push
- **Fresh start** — แค่อัปโหลดใหม่ใน production

### Prisma connection pool error
- เลือก **Pooled connection** จาก Neon ไม่ใช่ Direct connection

---

## 💾 Backup ข้อมูล

Neon มี **Branch** (เหมือน git branch ของ database) ใช้ backup ได้:

1. Neon Console → Branches → Create Branch
2. ตั้งเวลา retention หรือ snapshot ได้ผ่าน Neon dashboard

หรือใช้ `pg_dump` ผ่าน DATABASE_URL เอาลงเครื่อง

---

## 💰 ค่าใช้จ่าย

ใช้งานระดับร้านเล็ก (สินค้า < 1000 ชิ้น, รูป < 5000 รูป):

| บริการ | ฟรี quota | แนวโน้มเกินฟรี |
|---|---|---|
| Neon | 0.5GB storage, 10GB transfer/เดือน | ไม่มีทางเกิน |
| Vercel Blob | 5GB storage, bandwidth ฟรีบน Hobby | รูปขนาดเฉลี่ย 500KB → ~10,000 รูป |
| Vercel Hosting | 100GB bandwidth/เดือน | ไม่มีทางเกินถ้าใช้คนเดียว |

**สรุป: ฟรีตลอดชีวิตถ้าไม่ขยายเป็นร้านใหญ่**
