import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, TABLE, STORAGE_BUCKET, IS_DEMO_MODE, demoStorage } from '../lib/supabase'
import AppHeader from '../components/AppHeader'
import Footer from '../components/Footer'

export default function AddFood() {
  const navigate = useNavigate()
  const fileRef = useRef()
  const [form, setForm] = useState({ food_name: '', food_where: '', food_person: '', food_pay: '' })
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  function handleFileChange(e) {
    const f = e.target.files[0]
    if (!f) return
    // Revoke old blob URL to prevent memory leak
    if (preview && !preview.startsWith('http')) {
      URL.revokeObjectURL(preview)
    }
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  async function uploadImage(file) {
    if (IS_DEMO_MODE) {
      // In demo mode, just return a blob URL
      return URL.createObjectURL(file)
    }

    const ext = file.name.split('.').pop()
    const path = `food_${Date.now()}.${ext}`
    const { error: err } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(path, file, { upsert: true })
    if (err) throw new Error('อัปโหลดรูปไม่สำเร็จ: ' + err.message)
    return path
  }

  function handleCancel() {
    // Revoke blob URL to prevent memory leak
    if (preview && !preview.startsWith('http')) {
      URL.revokeObjectURL(preview)
    }
    setForm({ food_name: '', food_where: '', food_person: '', food_pay: '' })
    setPreview(null)
    setFile(null)
    setError('')
  }

  async function handleSave() {
    const trimmedName = form.food_name.trim()
    if (!trimmedName) { setError('กรุณากรอกชื่ออาหาร'); return }
    if (form.food_pay && (isNaN(form.food_pay) || parseFloat(form.food_pay) < 0)) {
      setError('กรุณากรอกจำนวนเงินที่ถูกต้อง')
      return
    }
    setLoading(true)
    setError('')
    try {
      let imageUrl = null
      if (file) imageUrl = await uploadImage(file)

      if (IS_DEMO_MODE) {
        demoStorage.addFood({
          food_name: trimmedName,
          food_where: form.food_where?.trim() || null,
          food_person: form.food_person?.trim() || null,
          food_pay: form.food_pay ? parseFloat(form.food_pay) : null,
          food_image_url: imageUrl,
        })
      } else {
        const { error: err } = await supabase.from(TABLE).insert([{
          food_name: trimmedName,
          food_where: form.food_where?.trim() || null,
          food_person: form.food_person?.trim() || null,
          food_pay: form.food_pay ? parseFloat(form.food_pay) : null,
          food_image_url: imageUrl,
        }])
        if (err) throw new Error(err.message)
      }

      navigate('/showallfood')
    } catch (e) {
      setError(e.message)
      setLoading(false)
    }
  }

  return (
    <div className="page-wrap">
      <div className="card">
        <AppHeader subtitle="🍔 🍟 🌭 เพิ่มข้อมูลการกิน 🥙 🌮 🫔" />

        {IS_DEMO_MODE && (
          <div style={{ background: '#d1ecf1', color: '#0c5460', padding: 12, borderRadius: 6, marginBottom: 16, fontSize: 14 }}>
            💾 <strong>Demo Mode:</strong> รูปภาพจะถูกเก็บในหน่วยความจำชั่วคราว
          </div>
        )}

        {error && <div className="error-msg">⚠️ {error}</div>}

        <div className="form-group">
          <label className="form-label">กินอะไร</label>
          <input className="form-input" type="text" placeholder="เช่น ข้าวผัดกะเพรา KFC Pizza"
            value={form.food_name} onChange={e => set('food_name', e.target.value)} />
        </div>

        <div className="form-group">
          <label className="form-label">กินที่ไหน</label>
          <input className="form-input" type="text" placeholder="เช่น ที่ร้าน ริมทะเล ห้องอาหาร"
            value={form.food_where} onChange={e => set('food_where', e.target.value)} />
        </div>

        <div className="form-group">
          <label className="form-label">กินกับใคร</label>
          <input className="form-input" type="text" placeholder="เช่น ครอบครัว เพื่อน คู่รัก"
            value={form.food_person} onChange={e => set('food_person', e.target.value)} />
        </div>

        <div className="form-group">
          <label className="form-label">กินไปเท่าไหร่</label>
          <input className="form-input" type="number" placeholder="เช่น 2000 500.75 15000"
            value={form.food_pay} onChange={e => set('food_pay', e.target.value)} />
        </div>

        <div className="form-group">
          <label className="form-label">เลือกรูป</label>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
            onChange={handleFileChange} />
          <button className="btn-browse" onClick={() => fileRef.current.click()}>
            Browse...
          </button>
          {preview && <img src={preview} alt="preview" className="preview-img" />}
        </div>

        <button className="btn-save" onClick={handleSave} disabled={loading}>
          {loading ? '⏳ กำลังบันทึก...' : 'บันทึก'}
        </button>
        <button className="btn-cancel" onClick={handleCancel}>
          ยกเลิก
        </button>
        <button className="link-back" onClick={() => navigate('/showallfood')}>
          กลับไปยังหน้าแสดงข้อมูลการกินทั้งหมด
        </button>
      </div>
      <Footer />
    </div>
  )
}
