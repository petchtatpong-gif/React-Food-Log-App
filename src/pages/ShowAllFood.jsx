import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, TABLE, STORAGE_BUCKET } from '../lib/supabase'
import AppHeader from '../components/AppHeader'
import Footer from '../components/Footer'

export default function ShowAllFood() {
  const navigate = useNavigate()
  const [foods, setFoods] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => { fetchFoods() }, [])

  async function fetchFoods() {
    setLoading(true)
    const { data, error: err } = await supabase
      .from(TABLE)
      .select('*')
      .order('created_at', { ascending: false })
    if (err) setError(err.message)
    else setFoods(data || [])
    setLoading(false)
  }

  function getImageUrl(url) {
    if (!url) return null
    if (url.startsWith('http')) return url
    const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(url)
    return data?.publicUrl || null
  }

  async function handleDelete(food) {
    const ok = window.confirm('คุณต้องการลบข้อมูลการกินนี้หรือไม่?')
    if (!ok) return
    setError('')
    try {
      // Delete image from storage if exists
      if (food.food_image_url && !food.food_image_url.startsWith('http')) {
        await supabase.storage.from(STORAGE_BUCKET).remove([food.food_image_url])
      }
      const { error: err } = await supabase.from(TABLE).delete().eq('id', food.id)
      if (err) throw new Error(err.message)
      setFoods(prev => prev.filter(f => f.id !== food.id))
      setSuccess('✅ ลบข้อมูลสำเร็จ')
      setTimeout(() => setSuccess(''), 3000)
    } catch (e) {
      setError('⚠️ ลบไม่สำเร็จ: ' + e.message)
    }
  }

  function handleLogout() {
    sessionStorage.removeItem('food_auth')
    navigate('/')
  }

  return (
    <div className="page-wrap">
      <div className="card">
        <AppHeader subtitle="🍔 🍟 🌭 ข้อมูลการกินทั้งหมด 🥙 🌮 🫔" />

        {error && <div className="error-msg">{error}</div>}
        {success && <div style={{ background: '#d4edda', color: '#155724', padding: 12, borderRadius: 6, marginBottom: 16 }}>{success}</div>}

        <button className="btn-add" onClick={() => navigate('/addfood')}>
          เพิ่มข้อมูลการกิน
        </button>

        {loading ? (
          <div className="loading">⏳ กำลังโหลดข้อมูล...</div>
        ) : (
          <table className="food-table">
            <thead>
              <tr>
                <th>รูป</th>
                <th>กินอะไร</th>
                <th>กินที่ไหน</th>
                <th>กินกับใคร</th>
                <th>กินไปเท่าไหร่</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {foods.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '32px', color: '#aaa' }}>
                    ยังไม่มีข้อมูลการกิน
                  </td>
                </tr>
              ) : (
                foods.map(food => (
                  <tr key={food.id}>
                    <td>
                      {getImageUrl(food.food_image_url) ? (
                        <img
                          src={getImageUrl(food.food_image_url)}
                          alt={food.food_name}
                          onError={e => { e.target.style.display = 'none' }}
                        />
                      ) : (
                        <div style={{ width: 70, height: 60, background: '#f0f0f0', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, margin: '0 auto' }}>
                          🍽️
                        </div>
                      )}
                    </td>
                    <td>{food.food_name}</td>
                    <td>{food.food_where}</td>
                    <td>{food.food_person}</td>
                    <td>{food.food_pay?.toLocaleString()}</td>
                    <td>
                      <button className="btn-edit" onClick={() => navigate(`/editfood/${food.id}`)}>
                        แก้ไข
                      </button>
                      {' | '}
                      <button className="btn-delete" onClick={() => handleDelete(food)}>
                        ลบ
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        <button className="link-logout" onClick={handleLogout}>
          ออกจากการทำงาน
        </button>
      </div>
      <Footer />
    </div>
  )
}
