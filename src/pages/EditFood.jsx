import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase, TABLE, STORAGE_BUCKET, IS_DEMO_MODE, demoStorage } from '../lib/supabase'
import AppHeader from '../components/AppHeader'
import Footer from '../components/Footer'

export default function EditFood() {
  const { id } = useParams()
  const navigate = useNavigate()
  const fileRef = useRef()
  const [form, setForm] = useState({ food_name: '', food_where: '', food_person: '', food_pay: '' })
  const [existingImagePath, setExistingImagePath] = useState(null)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  useEffect(() => {
    async function load() {
      setFetching(true)
      setError('')

      try {
        let data = null

        if (IS_DEMO_MODE) {
          const foods = demoStorage.getFoods()
          data = foods.find(f => f.id === parseInt(id))
        } else {
          const { data: fetchedData, error: err } = await supabase.from(TABLE).select('*').eq('id', id).single()
          if (err || !fetchedData) throw new Error('ไม่พบข้อมูล')
          data = fetchedData
        }

        if (!data) throw new Error('ไม่พบข้อมูล')

        setForm({
          food_name: data.food_name || '',
          food_where: data.food_where || '',
          food_person: data.food_person || '',
          food_pay: data.food_pay ?? '',
        })
        setExistingImagePath(data.food_image_url)
        if (data.food_image_url) {
          if (data.food_image_url.startsWith('http')) {
            setPreview(data.food_image_url)
          } else if (!IS_DEMO_MODE) {
            const { data: urlData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(data.food_image_url)
            setPreview(urlData?.publicUrl || null)
          }
        }
      } catch (e) {
        setError(e.message)
      } finally {
        setFetching(false)
      }
    }
    load()
  }, [id])

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

  async function uploadImage(f) {
    if (IS_DEMO_MODE) {
      // In demo mode, just return a blob URL
      return URL.createObjectURL(f)
    }

    const ext = f.name.split('.').pop()
    const path = `food_${Date.now()}.${ext}`
    const { error: err } = await supabase.storage.from(STORAGE_BUCKET).upload(path, f, { upsert: true })
    if (err) throw new Error('อัปโหลดรูปไม่สำเร็จ: ' + err.message)
    return path
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
      let imageUrl = existingImagePath
      if (file) {
        // Delete old image
        if (existingImagePath && !existingImagePath.startsWith('http') && !IS_DEMO_MODE) {
          await supabase.storage.from(STORAGE_BUCKET).remove([existingImagePath])
        }
        imageUrl = await uploadImage(file)
      }

      if (IS_DEMO_MODE) {
        demoStorage.updateFood(parseInt(id), {
          food_name: trimmedName,
          food_where: form.food_where?.trim() || null,
          food_person: form.food_person?.trim() || null,
          food_pay: form.food_pay ? parseFloat(form.food_pay) : null,
          food_image_url: imageUrl,
        })
      } else {
        const { error: err } = await supabase.from(TABLE).update({
          food_name: trimmedName,
          food_where: form.food_where?.trim() || null,
          food_person: form.food_person?.trim() || null,
          food_pay: form.food_pay ? parseFloat(form.food_pay) : null,
          food_image_url: imageUrl,
        }).eq('id', id)
        if (err) throw new Error(err.message)
      }

      navigate('/showallfood')
    } catch (e) {
      setError(e.message)
      setLoading(false)
    }
  }

  if (fetching) return (
    <div className="page-wrap">
      <div className="card"><div className="loading">⏳ กำลังโหลด...</div></div>
    </div>
  )

  return (
    <div className="page-wrap">
      <div className="card">
        <AppHeader subtitle="🍔 🍟 🌭 แก้ไขข้อมูลการกิน 🥙 🌮 🫔" />

        {IS_DEMO_MODE && (
          <div style={{ background: '#d1ecf1', color: '#0c5460', padding: 12, borderRadius: 6, marginBottom: 16, fontSize: 14 }}>
            💾 <strong>Demo Mode:</strong> รูปภาพจะถูกเก็บในหน่วยความจำชั่วคราว
          </div>
        )}

        {error && <div className="error-msg">⚠️ {error}</div>}

        <div className="form-group">
          <label className="form-label">กินอะไร</label>
          <input className="form-input" type="text"
            value={form.food_name} onChange={e => set('food_name', e.target.value)} />
        </div>

        <div className="form-group">
          <label className="form-label">กินที่ไหน</label>
          <input className="form-input" type="text"
            value={form.food_where} onChange={e => set('food_where', e.target.value)} />
        </div>

        <div className="form-group">
          <label className="form-label">กินกับใคร</label>
          <input className="form-input" type="text"
            value={form.food_person} onChange={e => set('food_person', e.target.value)} />
        </div>

        <div className="form-group">
          <label className="form-label">กินไปเท่าไหร่</label>
          <input className="form-input" type="number"
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
          {loading ? '⏳ กำลังบันทึก...' : 'บันทึกแก้ไข'}
        </button>
        <button className="link-back" onClick={() => {
          if (preview && !preview.startsWith('http')) URL.revokeObjectURL(preview)
          navigate('/showallfood')
        }}>
          กลับไปยังหน้าแสดงข้อมูลการกินทั้งหมด
        </button>
      </div>
      <Footer />
    </div>
  )
}
