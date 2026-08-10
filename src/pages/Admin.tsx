import { useState } from 'react'
import type { Page } from '../App'

interface Props {
  navigate: (p: Page) => void
  darkMode: boolean
  setDarkMode: (v: boolean) => void
}

type AdminTab = 'overview' | 'users' | 'medicines' | 'logs'

interface User {
  id: string
  name: string
  role: string
  email: string
  lastActive: string
  status: 'active' | 'inactive'
}

const users: User[] = [
  { id: 'U-001', name: 'Dr. Sarah Chen', role: 'Pharmacist', email: 's.chen@northridge.med', lastActive: '2026-07-28', status: 'active' },
  { id: 'U-002', name: 'Marcus Thompson', role: 'Technician', email: 'm.thompson@northridge.med', lastActive: '2026-07-28', status: 'active' },
  { id: 'U-003', name: 'Priya Patel', role: 'Doctor', email: 'p.patel@suncoast.med', lastActive: '2026-07-26', status: 'active' },
  { id: 'U-004', name: 'James Liu', role: 'Admin', email: 'j.liu@rxshield.ai', lastActive: '2026-07-28', status: 'active' },
  { id: 'U-005', name: 'Elena Vasquez', role: 'Pharmacist', email: 'e.vasquez@mediplus.med', lastActive: '2026-07-20', status: 'inactive' },
]

const logs = [
  { time: '14:32:01', user: 'Dr. Sarah Chen', action: 'Uploaded prescription RX-10291', type: 'upload' },
  { time: '14:29:44', user: 'System AI', action: 'Flagged RX-10289 as SUSPICIOUS — controlled substance', type: 'alert' },
  { time: '14:15:12', user: 'Marcus Thompson', action: 'Viewed report for RX-10290', type: 'view' },
  { time: '13:58:30', user: 'James Liu', action: 'Added user: Nina Flores (Pharmacist)', type: 'admin' },
  { time: '13:41:09', user: 'Priya Patel', action: 'Uploaded prescription RX-10288', type: 'upload' },
  { time: '13:22:55', user: 'System AI', action: 'Auto-flagged Alprazolam 4mg — exceeds safe dosage threshold', type: 'alert' },
  { time: '12:50:11', user: 'Dr. Sarah Chen', action: 'Downloaded PDF report — RX-10287', type: 'download' },
  { time: '11:30:00', user: 'James Liu', action: 'Updated medicine watchlist — added Carisoprodol', type: 'admin' },
]

const logColors = {
  upload: '#00d4ff',
  alert: '#ff4444',
  view: '#6b8fad',
  admin: '#a855f7',
  download: '#00ff88',
}

export default function Admin({ navigate }: Props) {
  const [authed, setAuthed] = useState(false)
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [loginError, setLoginError] = useState(false)
  const [tab, setTab] = useState<AdminTab>('overview')

  const login = (e: React.FormEvent) => {
    e.preventDefault()
    if (loginForm.email === 'admin@rxshield.ai' && loginForm.password === 'admin123') {
      setAuthed(true)
    } else {
      setLoginError(true)
      setTimeout(() => setLoginError(false), 2500)
    }
  }

  if (!authed) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#040d1a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div className="bg-grid" style={{ position: 'absolute', inset: 0, opacity: 0.5 }} />
        <div
          style={{
            position: 'absolute',
            top: '30%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600,
            height: 600,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <form
          onSubmit={login}
          style={{
            position: 'relative',
            zIndex: 1,
            width: '100%',
            maxWidth: 420,
            padding: '0 24px',
          }}
        >
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                background: 'rgba(0,212,255,0.1)',
                border: '2px solid rgba(0,212,255,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                fontSize: 32,
              }}
              className="animate-glow-pulse"
            >
              🔒
            </div>
            <h1 className="font-display" style={{ fontSize: 28, fontWeight: 800, color: '#e8f4fd', marginBottom: 6 }}>
              Admin Portal
            </h1>
            <p style={{ fontSize: 14, color: '#6b8fad' }}>Authorized personnel only</p>
            <p style={{ fontSize: 12, color: '#2a4a6b', marginTop: 8 }}>
              Demo: admin@rxshield.ai / admin123
            </p>
          </div>

          <div
            className="glass"
            style={{ borderRadius: 18, padding: '28px', display: 'flex', flexDirection: 'column', gap: 16 }}
          >
            {loginError && (
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: 8,
                  background: 'rgba(255,68,68,0.1)',
                  border: '1px solid rgba(255,68,68,0.3)',
                  color: '#ff4444',
                  fontSize: 13,
                }}
              >
                Invalid credentials. Please try again.
              </div>
            )}
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#6b8fad', marginBottom: 6, fontWeight: 500 }}>Email</label>
              <input
                type="email"
                required
                placeholder="admin@rxshield.ai"
                value={loginForm.email}
                onChange={(e) => setLoginForm((f) => ({ ...f, email: e.target.value }))}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#6b8fad', marginBottom: 6, fontWeight: 500 }}>Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={loginForm.password}
                onChange={(e) => setLoginForm((f) => ({ ...f, password: e.target.value }))}
                style={inputStyle}
              />
            </div>
            <button
              type="submit"
              className="btn-primary"
              style={{ padding: '13px', borderRadius: 10, fontSize: 15 }}
            >
              Sign In to Admin Portal
            </button>
          </div>

          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <button
              type="button"
              onClick={() => navigate('landing')}
              style={{ background: 'none', border: 'none', color: '#6b8fad', cursor: 'pointer', fontSize: 13 }}
            >
              ← Back to main site
            </button>
          </div>
        </form>
      </div>
    )
  }

  // Admin dashboard
  return (
    <div style={{ minHeight: '100vh', background: '#040d1a', display: 'flex', flexDirection: 'column' }}>
      {/* Admin navbar */}
      <nav
        className="glass"
        style={{
          borderBottom: '1px solid rgba(0,212,255,0.12)',
          padding: '0 32px',
          height: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span className="font-display" style={{ fontSize: 18, fontWeight: 700 }}>
            <span style={{ color: '#00d4ff' }}>Rx</span><span style={{ color: '#e8f4fd' }}>Shield</span>
            <span
              style={{
                marginLeft: 8,
                padding: '2px 8px',
                borderRadius: 4,
                background: 'rgba(168,85,247,0.15)',
                border: '1px solid rgba(168,85,247,0.3)',
                color: '#a855f7',
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              ADMIN
            </span>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 13, color: '#6b8fad' }}>James Liu · Admin</span>
          <button
            onClick={() => setAuthed(false)}
            style={{
              background: 'rgba(255,68,68,0.08)',
              border: '1px solid rgba(255,68,68,0.25)',
              color: '#ff4444',
              borderRadius: 8,
              padding: '6px 14px',
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            Sign Out
          </button>
        </div>
      </nav>

      <div style={{ display: 'flex', flex: 1 }}>
        {/* Sidebar tabs */}
        <aside
          style={{
            width: 200,
            borderRight: '1px solid rgba(0,212,255,0.1)',
            padding: '24px 0',
            background: '#071428',
          }}
        >
          {adminTabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as AdminTab)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                width: '100%',
                padding: '12px 20px',
                background: tab === t.id ? 'rgba(0,212,255,0.08)' : 'none',
                border: 'none',
                borderLeft: `3px solid ${tab === t.id ? '#00d4ff' : 'transparent'}`,
                color: tab === t.id ? '#00d4ff' : '#a8c8e8',
                fontSize: 14,
                cursor: 'pointer',
                fontWeight: tab === t.id ? 600 : 400,
                textAlign: 'left',
                transition: 'all 0.2s',
              }}
            >
              <span>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </aside>

        {/* Main content */}
        <main style={{ flex: 1, padding: '36px', overflowY: 'auto' }}>
          {tab === 'overview' && <OverviewTab />}
          {tab === 'users' && <UsersTab />}
          {tab === 'medicines' && <MedicinesTab />}
          {tab === 'logs' && <LogsTab />}
        </main>
      </div>
    </div>
  )
}

function OverviewTab() {
  return (
    <div>
      <h2 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#e8f4fd', marginBottom: 24, letterSpacing: '-0.02em' }}>
        System Overview
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
        {overviewStats.map((s) => (
          <div key={s.label} className="glass card-hover" style={{ borderRadius: 14, padding: '20px' }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
            <div className="font-display" style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: '#6b8fad', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Recent alerts */}
      <h3 className="font-display" style={{ fontSize: 18, fontWeight: 700, color: '#e8f4fd', marginBottom: 16 }}>
        Recent Alerts
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {logs.filter((l) => l.type === 'alert').map((l, i) => (
          <div key={i} className="glass" style={{ borderRadius: 12, padding: '14px 18px', borderColor: 'rgba(255,68,68,0.2)', display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ color: '#ff4444', fontSize: 18 }}>🚨</span>
            <div>
              <div style={{ fontSize: 14, color: '#e8f4fd' }}>{l.action}</div>
              <div className="font-mono" style={{ fontSize: 11, color: '#6b8fad', marginTop: 3 }}>{l.time} · {l.user}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function UsersTab() {
  const [showAdd, setShowAdd] = useState(false)
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#e8f4fd', letterSpacing: '-0.02em' }}>
          Manage Users
        </h2>
        <button
          onClick={() => setShowAdd(true)}
          className="btn-primary"
          style={{ padding: '9px 20px', borderRadius: 9, fontSize: 13 }}
        >
          + Add User
        </button>
      </div>

      {showAdd && (
        <div className="glass" style={{ borderRadius: 14, padding: '20px 24px', marginBottom: 20, borderColor: 'rgba(0,212,255,0.2)' }}>
          <h3 className="font-display" style={{ fontSize: 16, fontWeight: 700, color: '#e8f4fd', marginBottom: 16 }}>New User</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
            {['Full Name', 'Email', 'Role'].map((f) => (
              <input key={f} placeholder={f} style={{ ...inputStyle, fontSize: 13 }} />
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
            <button className="btn-primary" style={{ padding: '8px 20px', borderRadius: 8, fontSize: 13 }} onClick={() => setShowAdd(false)}>
              Create User
            </button>
            <button className="btn-outline" style={{ padding: '8px 20px', borderRadius: 8, fontSize: 13 }} onClick={() => setShowAdd(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="glass" style={{ borderRadius: 14, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(0,212,255,0.1)' }}>
              {['User', 'Role', 'Email', 'Last Active', 'Status', ''].map((h) => (
                <th key={h} style={{ padding: '13px 16px', textAlign: 'left', fontSize: 11, color: '#6b8fad', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }} className="font-mono">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={u.id} style={{ borderBottom: i < users.length - 1 ? '1px solid rgba(0,212,255,0.06)' : 'none' }}>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #00d4ff, #00ff88)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#040d1a', flexShrink: 0 }} className="font-display">
                      {u.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </div>
                    <span style={{ fontSize: 14, color: '#e8f4fd', fontWeight: 500 }}>{u.name}</span>
                  </div>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ fontSize: 13, color: '#a8c8e8' }}>{u.role}</span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span className="font-mono" style={{ fontSize: 12, color: '#6b8fad' }}>{u.email}</span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span className="font-mono" style={{ fontSize: 12, color: '#6b8fad' }}>{u.lastActive}</span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{
                    padding: '3px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600,
                    background: u.status === 'active' ? 'rgba(0,255,136,0.1)' : 'rgba(107,143,173,0.1)',
                    color: u.status === 'active' ? '#00ff88' : '#6b8fad',
                    border: `1px solid ${u.status === 'active' ? 'rgba(0,255,136,0.25)' : 'rgba(107,143,173,0.2)'}`,
                  }}>
                    {u.status}
                  </span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <button style={{ background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.2)', color: '#ff4444', borderRadius: 6, padding: '5px 12px', fontSize: 12, cursor: 'pointer' }}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function MedicinesTab() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#e8f4fd', letterSpacing: '-0.02em' }}>
          Medicine Database Admin
        </h2>
        <button className="btn-primary" style={{ padding: '9px 20px', borderRadius: 9, fontSize: 13 }}>
          + Add Medicine
        </button>
      </div>
      <div className="glass" style={{ borderRadius: 14, padding: '20px 24px', marginBottom: 16 }}>
        <h3 className="font-display" style={{ fontSize: 16, fontWeight: 700, color: '#e8f4fd', marginBottom: 12 }}>Prescription-Only Watchlist</h3>
        <textarea
          defaultValue="Oxycodone, Hydrocodone, Alprazolam, Adderall, Fentanyl, Carisoprodol, Tramadol, Zolpidem, Diazepam"
          rows={4}
          style={{ ...inputStyle, width: '100%', resize: 'vertical' }}
        />
        <button className="btn-primary" style={{ marginTop: 12, padding: '8px 20px', borderRadius: 8, fontSize: 13 }}>
          Save Watchlist
        </button>
      </div>
      <div
        style={{
          padding: '16px 20px',
          borderRadius: 12,
          background: 'rgba(255,184,0,0.06)',
          border: '1px solid rgba(255,184,0,0.2)',
        }}
      >
        <span style={{ fontSize: 13, color: '#ffb800' }}>
          ⚠ Database last synced: 2026-07-28 03:00 UTC · Next sync in 18 hours
        </span>
      </div>
    </div>
  )
}

function LogsTab() {
  return (
    <div>
      <h2 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#e8f4fd', marginBottom: 24, letterSpacing: '-0.02em' }}>
        User Activity Logs
      </h2>
      <div className="glass" style={{ borderRadius: 14, overflow: 'hidden' }}>
        {logs.map((l, i) => (
          <div
            key={i}
            style={{
              padding: '14px 20px',
              borderBottom: i < logs.length - 1 ? '1px solid rgba(0,212,255,0.06)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: (logColors as Record<string, string>)[l.type] || '#6b8fad',
                flexShrink: 0,
                boxShadow: `0 0 6px ${(logColors as Record<string, string>)[l.type] || '#6b8fad'}60`,
              }}
            />
            <span className="font-mono" style={{ fontSize: 12, color: '#6b8fad', minWidth: 70 }}>{l.time}</span>
            <span style={{ fontSize: 13, color: '#6b8fad', minWidth: 140 }}>{l.user}</span>
            <span style={{ fontSize: 14, color: '#a8c8e8', flex: 1 }}>{l.action}</span>
            <span
              style={{
                fontSize: 11,
                padding: '2px 8px',
                borderRadius: 4,
                background: `${(logColors as Record<string, string>)[l.type]}18`,
                color: (logColors as Record<string, string>)[l.type] || '#6b8fad',
                border: `1px solid ${(logColors as Record<string, string>)[l.type]}30`,
                textTransform: 'uppercase',
                fontWeight: 600,
                letterSpacing: '0.06em',
              }}
              className="font-mono"
            >
              {l.type}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

const adminTabs = [
  { id: 'overview', icon: '◈', label: 'Overview' },
  { id: 'users', icon: '👥', label: 'Users' },
  { id: 'medicines', icon: '💊', label: 'Medicines' },
  { id: 'logs', icon: '📋', label: 'Audit Logs' },
]

const overviewStats = [
  { icon: '📤', value: '2,847', label: 'Total Uploads', color: '#00d4ff' },
  { icon: '🚨', value: '6.7%', label: 'Flagged Suspicious', color: '#ff4444' },
  { icon: '⚠️', value: '11.0%', label: 'Incomplete', color: '#ffb800' },
  { icon: '✅', value: '82.3%', label: 'Valid', color: '#00ff88' },
  { icon: '👤', value: users.filter((u) => u.status === 'active').length.toString(), label: 'Active Users', color: '#a855f7' },
]

const inputStyle: React.CSSProperties = {
  padding: '10px 14px',
  borderRadius: 9,
  background: 'rgba(0,212,255,0.05)',
  border: '1px solid rgba(0,212,255,0.15)',
  color: '#e8f4fd',
  fontSize: 14,
  outline: 'none',
  width: '100%',
}
