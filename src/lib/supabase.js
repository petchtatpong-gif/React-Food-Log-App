import { createClient } from '@supabase/supabase-js'

// Demo mode configuration
const DEMO_MODE = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = DEMO_MODE ? null : createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export const SECURE_CODE = import.meta.env.VITE_SECURE_CODE || '12345'
export const STORAGE_BUCKET = 'food_bk'
export const TABLE = 'food_tb'
export const IS_DEMO_MODE = DEMO_MODE

// Demo storage functions
const DEMO_STORAGE_KEY = 'food_log_demo_data'

export const demoStorage = {
  getFoods: () => {
    const data = localStorage.getItem(DEMO_STORAGE_KEY)
    return data ? JSON.parse(data) : []
  },

  saveFoods: (foods) => {
    localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(foods))
  },

  addFood: (food) => {
    const foods = demoStorage.getFoods()
    const newFood = { ...food, id: Date.now(), created_at: new Date().toISOString() }
    foods.unshift(newFood)
    demoStorage.saveFoods(foods)
    return newFood
  },

  updateFood: (id, updates) => {
    const foods = demoStorage.getFoods()
    const index = foods.findIndex(f => f.id === id)
    if (index !== -1) {
      foods[index] = { ...foods[index], ...updates }
      demoStorage.saveFoods(foods)
      return foods[index]
    }
    return null
  },

  deleteFood: (id) => {
    const foods = demoStorage.getFoods()
    const filtered = foods.filter(f => f.id !== id)
    demoStorage.saveFoods(filtered)
    return true
  }
}
