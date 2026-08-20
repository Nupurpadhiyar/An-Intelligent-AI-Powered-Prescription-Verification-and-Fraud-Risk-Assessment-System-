import type { Page } from '../App'

interface Props {
  navigate: (p: Page) => void
  current: Page
}

const items = [
  { page: 'upload' as Page, label: 'Upload Prescription', icon: '⬆' },
  { page: 'dashboard' as Page, label: 'Dashboard', icon: '◈' },
  { page: 'reports' as Page, label: 'Audit Reports & Stats', icon: '📋' },
  { page: 'medicine' as Page, label: 'Medicine Database', icon: '💊' },
  { page: 'admin' as Page, label: 'Admin Portal', icon: '🔒' },
  { page: 'settings' as Page, label: 'Settings', icon: '⚙' },
]

export default function Sidebar({ navigate, current }: Props) {
  return (
    <aside
      style={{
        width: 240,
        minHeight: '100vh',
        background: '#071428',
        borderRight: '1px solid rgba(0,212,255,0.1)',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 0',
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <button
        onClick={() => navigate('landing')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '0 20px',
          marginBottom: 32,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
          <path
            d="M16 2L4 7v10c0 6.627 5.144 11.637 12 13 6.856-1.363 12-6.373 12-13V7L16 2z"
            fill="rgba(0,212,255,0.15)"
            stroke="#00d4ff"
            strokeWidth="1.5"
          />
          <path
            d="M11 16l3.5 3.5L21 12"
            stroke="#00ff88"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="font-display" style={{ fontSize: 18, fontWeight: 700 }}>
          <span style={{ color: '#00d4ff' }}>Rx</span>
          <span style={{ color: '#e8f4fd' }}>Shield</span>
        </span>
      </button>

      {/* Label */}
      <div
        style={{
          padding: '0 20px',
          marginBottom: 8,
          fontSize: 10,
          letterSpacing: '0.12em',
          fontWeight: 600,
          color: '#6b8fad',
          textTransform: 'uppercase',
        }}
        className="font-mono"
      >
        Navigation
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1 }}>
        {items.map((item) => {
          const active = current === item.page
          return (
            <button
              key={item.page}
              onClick={() => navigate(item.page)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                width: '100%',
                padding: '12px 20px',
                background: active ? 'rgba(0,212,255,0.08)' : 'none',
                border: 'none',
                borderLeft: `3px solid ${active ? '#00d4ff' : 'transparent'}`,
                cursor: 'pointer',
                color: active ? '#00d4ff' : '#a8c8e8',
                fontSize: 14,
                fontWeight: active ? 600 : 400,
                textAlign: 'left',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.background = 'rgba(0,212,255,0.04)'
                  e.currentTarget.style.color = '#e8f4fd'
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.background = 'none'
                  e.currentTarget.style.color = '#a8c8e8'
                }
              }}
            >
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Bottom links */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(0,212,255,0.08)' }}>
        {[
          { page: 'about' as Page, label: 'About' },
          { page: 'help' as Page, label: 'Help & FAQ' },
          { page: 'contact' as Page, label: 'Contact' },
        ].map((l) => (
          <button
            key={l.page}
            onClick={() => navigate(l.page)}
            style={{
              display: 'block',
              width: '100%',
              padding: '8px 0',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#6b8fad',
              fontSize: 13,
              textAlign: 'left',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#a8c8e8')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#6b8fad')}
          >
            {l.label}
          </button>
        ))}
      </div>
    </aside>
  )
}
