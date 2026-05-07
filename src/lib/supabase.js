import { createClient } from '@supabase/supabase-js'
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
export const SECURE_CODE = import.meta.env.VITE_SECURE_CODE || '12345'
export const STORAGE_BUCKET = 'food_bk'
export const TABLE = 'food_tb'
