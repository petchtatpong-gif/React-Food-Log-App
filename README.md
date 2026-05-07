# 🍔 Food Log App (การกินของฉัน)

**by Tatpong Srihongthong**  
มหาวิทยาลัยเอเชียอาคเนย์ (SAU)

---

## ✨ Features

- 🔐 Login ด้วย Secure Code
- 📋 ดูรายการอาหารทั้งหมดแบบตาราง
- ➕ เพิ่มข้อมูลการกิน (กินอะไร/ที่ไหน/กับใคร/เท่าไหร่/รูป)
- ✏️ แก้ไขข้อมูล
- 🗑️ ลบข้อมูล พร้อม confirm dialog
- 🖼️ อัปโหลดรูปอาหารลง Supabase Storage

---

## 🗄️ Supabase Setup

### 1. สร้างตาราง (SQL Editor)

```sql
create table if not exists public.food_tb (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  food_name text,
  food_where text,
  food_person text,
  food_pay float8,
  food_image_url text
);

alter table public.food_tb enable row level security;

create policy "Access all food_tb"
  on public.food_tb as PERMISSIVE for ALL to anon using (true);
```

### 2. สร้าง Storage Bucket

- ไปที่ Storage → New bucket
- ชื่อ: `food_bk`
- เปิด Public: ✅
- เพิ่ม Storage Policy → anon → INSERT + SELECT + DELETE

---

## 🚀 Deploy ลง Vercel

```bash
# Push ขึ้น GitHub
git init && git add . && git commit -m "init"
git push origin main

# Vercel → Import → Environment Variables:
# VITE_SUPABASE_URL = https://pqgwkabzhfxkysjncmtz.supabase.co
# VITE_SUPABASE_ANON_KEY = your-key
# VITE_SECURE_CODE = 12345  (เปลี่ยนได้ตามต้องการ)
```

## 💻 รัน Local

```bash
npm install
npm run dev
```

---

*© 2026 SAU. Designed by Tatpong Srihongthong*
