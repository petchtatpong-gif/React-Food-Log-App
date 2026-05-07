import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppHeader from '../components/AppHeader'
import Footer from '../components/Footer'
import { SECURE_CODE, IS_DEMO_MODE } from '../lib/supabase'

export default function LoginPage() {
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  const handleLogin = () => {
    if (code.trim()) {
      sessionStorage.setItem('food_auth', 'true')
      navigate('/showallfood')
    } else {
      setError('กรุณากรอกรหัสผ่าน')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleLogin()
  }

  return (
    <div className="page-wrap">
      <div className="card" style={{ maxWidth: 440 }}>
        <AppHeader />
        {IS_DEMO_MODE && (
          <div style={{ background: '#e3f2fd', color: '#1565c0', padding: 12, borderRadius: 6, marginBottom: 16, fontSize: 14 }}>
            🎯 <strong>Demo Mode:</strong> กรอกรหัสอะไรก็ได้เพื่อเข้าสู่ระบบ
          </div>
        )}
        {error && <div className="error-msg">⚠️ {error}</div>}
        <input
          className="login-input"
          type="password"
          placeholder={IS_DEMO_MODE ? "รหัสอะไรก็ได้ เช่น: demo, 123, abc" : "Secure Code: ?????"}
          value={code}
          onChange={e => { setCode(e.target.value); setError('') }}
          onKeyDown={handleKeyDown}
        />
        <button className="btn-login" onClick={handleLogin}>
          เข้าใช้งาน
        </button>
      </div>
      <Footer />
    </div>
  )
}
