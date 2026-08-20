import { useState } from 'react'
import type { Page } from '../App'
import RoleSelector from './RoleSelector'

interface Props {
  navigate: (p: Page) => void
  current?: Page
}

export default function Navbar({ navigate, current }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)

  const links: { label: string; page: Page }[] = [
    { label: 'Home', page: 'landing' },
    { label: 'Upload Rx', page: 'upload' },
    { label: 'Dashboard', page: 'dashboard' },
    { label: 'Audit Reports', page: 'reports' },
    { label: 'Drug Database', page: 'medicine' },
    { label: 'Admin Portal', page: 'admin' },
  ]

  return (
    <nav
      className="glass sticky top-0 z-50"
      style={{ borderBottom: '1px solid rgba(0,212,255,0.12)' }}
    >
      <div
        style={{
          maxWidth: 1440,
          margin: '0 auto',
          padding: '0 24px',
          height: 68,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
        }}
      >
        {/* Logo */}
        <button
          onClick={() => navigate('landing')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <ShieldIcon />
          <span
            className="font-display"
            style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em' }}
          >
            <span style={{ color: '#00d4ff' }}>Rx</span>
            <span style={{ color: '#e8f4fd' }}>Shield</span>
            <span style={{ color: '#00ff88', marginLeft: 4, fontSize: 12, fontWeight: 500 }}>AI</span>
          </span>
        </button>

        {/* Desktop links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="hidden-mobile">
          {links.map((l) => (
            <button
              key={l.page}
              onClick={() => navigate(l.page)}
              style={{
                background: 'none',
                border: 'none',
                padding: '6px 12px',
                borderRadius: 8,
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 500,
                color: current === l.page ? '#00d4ff' : '#a8c8e8',
                transition: 'all 0.2s',
                backgroundColor: current === l.page ? 'rgba(0,212,255,0.08)' : 'transparent',
              }}
              onMouseEnter={(e) => {
                if (current !== l.page) (e.currentTarget.style.color = '#e8f4fd')
              }}
              onMouseLeave={(e) => {
                if (current !== l.page) (e.currentTarget.style.color = '#a8c8e8')
              }}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* Right Actions & Role Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <RoleSelector />

          <button
            onClick={() => navigate('upload')}
            className="btn-primary"
            style={{ padding: '7px 16px', borderRadius: 8, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <span>⬆</span>
            <span>Upload Scan</span>
          </button>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#a8c8e8',
              fontSize: 20,
            }}
            className="menu-btn"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          style={{
            borderTop: '1px solid rgba(0,212,255,0.1)',
            padding: '12px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            background: '#071428',
          }}
        >
          {links.map((l) => (
            <button
              key={l.page}
              onClick={() => { navigate(l.page); setMenuOpen(false) }}
              style={{
                background: 'none',
                border: 'none',
                textAlign: 'left',
                padding: '10px 0',
                cursor: 'pointer',
                fontSize: 15,
                color: '#a8c8e8',
                borderBottom: '1px solid rgba(0,212,255,0.06)',
              }}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  )
}

function ShieldIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
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
  )
}
