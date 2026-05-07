-- ============================================================
-- Food Log App - SQL Schema
-- วางใน Supabase SQL Editor แล้วกด Run
-- ============================================================

-- 1. สร้างตาราง food_tb
create table if not exists public.food_tb (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now() not null,
  food_name text,
  food_where text,
  food_person text,
  food_pay float8,
  food_image_url text
);

-- 2. เปิด RLS
alter table public.food_tb enable row level security;

-- 3. Policy: anon เข้าถึงได้ทั้งหมด (ตาม Figma design)
create policy "Access all food_tb"
  on public.food_tb
  as PERMISSIVE
  for ALL
  to anon
  using (true);

-- ============================================================
-- Storage Bucket: food_bk
-- ทำใน Supabase Dashboard → Storage → New Bucket
-- ชื่อ: food_bk  |  Public: ON
-- แล้ว add Storage policy สำหรับ anon upload/delete
-- ============================================================
