// Inline SVG food icon matching the Figma design (burger + fries + drink)
export function FoodLogo() {
  return (
    <svg width="100" height="90" viewBox="0 0 100 90" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Drink cup */}
      <rect x="58" y="28" width="28" height="36" rx="4" fill="#64cfff" stroke="#222" strokeWidth="1.5"/>
      <rect x="58" y="28" width="28" height="10" rx="3" fill="#4ab8f0" stroke="#222" strokeWidth="1.5"/>
      <rect x="64" y="18" width="4" height="12" rx="2" fill="#ffd166" stroke="#222" strokeWidth="1.2"/>
      <rect x="61" y="62" width="22" height="4" rx="2" fill="#3ab0e0" stroke="#222" strokeWidth="1"/>
      {/* Fries box */}
      <rect x="30" y="40" width="26" height="28" rx="3" fill="#ff6b35" stroke="#222" strokeWidth="1.5"/>
      <rect x="30" y="40" width="26" height="10" rx="3" fill="#ff4500" stroke="#222" strokeWidth="1.5"/>
      <rect x="34" y="24" width="5" height="18" rx="2.5" fill="#ffd166" stroke="#222" strokeWidth="1.2"/>
      <rect x="41" y="20" width="5" height="22" rx="2.5" fill="#ffd166" stroke="#222" strokeWidth="1.2"/>
      <rect x="48" y="24" width="5" height="18" rx="2.5" fill="#ffd166" stroke="#222" strokeWidth="1.2"/>
      {/* Burger bottom bun */}
      <ellipse cx="22" cy="70" rx="20" ry="7" fill="#f4a535" stroke="#222" strokeWidth="1.5"/>
      {/* Patty */}
      <ellipse cx="22" cy="62" rx="18" ry="5" fill="#8b4513" stroke="#222" strokeWidth="1.5"/>
      {/* Cheese */}
      <ellipse cx="22" cy="57" rx="19" ry="4" fill="#ffd700" stroke="#222" strokeWidth="1.2"/>
      {/* Lettuce */}
      <ellipse cx="22" cy="53" rx="20" ry="4" fill="#5cb85c" stroke="#222" strokeWidth="1.2"/>
      {/* Top bun */}
      <ellipse cx="22" cy="46" rx="18" ry="9" fill="#f4a535" stroke="#222" strokeWidth="1.5"/>
      <ellipse cx="22" cy="40" rx="14" ry="5" fill="#f8bc55" stroke="#222" strokeWidth="1"/>
      {/* Sesame seeds */}
      <ellipse cx="16" cy="38" rx="2" ry="1.2" fill="#fff" stroke="#ccc" strokeWidth="0.5"/>
      <ellipse cx="23" cy="36" rx="2" ry="1.2" fill="#fff" stroke="#ccc" strokeWidth="0.5"/>
      <ellipse cx="29" cy="39" rx="2" ry="1.2" fill="#fff" stroke="#ccc" strokeWidth="0.5"/>
    </svg>
  )
}

export default function AppHeader({ subtitle }) {
  return (
    <div className="app-header">
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
        <FoodLogo />
      </div>
      <div className="app-title">Food Log App (การกินของฉัน)</div>
      {subtitle && <div className="app-subtitle">{subtitle}</div>}
    </div>
  )
}
