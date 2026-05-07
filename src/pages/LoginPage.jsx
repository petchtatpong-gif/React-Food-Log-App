import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppHeader from '../components/AppHeader'
import Footer from '../components/Footer'
import { SECURE_CODE } from '../lib/supabase'

export default function LoginPage() {
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  const handleLogin = () => {
    if (code === SECURE_CODE) {
      sessionStorage.setItem('food_auth', 'true')
      navigate('/showallfood')
    } else {
      setError('Secure Code ไม่ถูกต้อง กรุณาลองใหม่')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleLogin()
  }

  return (
    <div className="page-wrap">
      <div className="card" style={{ maxWidth: 440 }}>
        <AppHeader />
        {error && <div className="error-msg">⚠️ {error}</div>}
        <input
          className="login-input"
          type="password"
          placeholder="Secure Code: ?????"
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
