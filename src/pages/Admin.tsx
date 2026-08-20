import { useState } from 'react'
import type { Page } from '../App'
import { usePrescriptions } from '../context/PrescriptionContext'
import AnalyticsCharts from '../components/AnalyticsCharts'

interface Props {
  navigate: (p: Page) => void
  darkMode: boolean
  setDarkMode: (v: boolean) => void
}

type AdminTab = 'overview' | 'analytics' | 'users' | 'medicines' | 'logs'

interface User {
  id: string
  name: string
  role: string
  email: string
  lastActive: string
  status: 'active' | 'inactive'
}

const initialUsers: User[] = [
  { id: 'U-001', name: 'Dr. Sarah Chen', role: 'Pharmacist', email: 's.chen@northridge.med', lastActive: '2026-08-16', status: 'active' },
  { id: 'U-002', name: 'Marcus Thompson', role: 'Compliance Lead', email: 'm.thompson@rxshield.ai', lastActive: '2026-08-16', status: 'active' },
  { id: 'U-003', name: 'Dr. Priya Patel', role: 'Physician', email: 'p.patel@suncoast.med', lastActive: '2026-08-15', status: 'active' },
  { id: 'U-004', name: 'James Liu', role: 'Admin', email: 'j.liu@rxshield.ai', lastActive: '2026-08-16', status: 'active' },
  { id: 'U-005', name: 'Elena Vasquez', role: 'Pharmacist', email: 'e.vasquez@mediplus.med', lastActive: '2026-08-10', status: 'inactive' },
]

const adminTabs = [
  { id: 'overview', label: 'Overview', icon: '⚡' },
  { id: 'analytics', label: 'Analytics', icon: '📊' },
  { id: 'users', label: 'User Roles', icon: '👥' },
  { id: 'medicines', label: 'Watchlist', icon: '💊' },
  { id: 'logs', label: 'Audit Logs', icon: '📜' },
]

const logColors: Record<string, string> = {
  upload: '#00d4ff',
  alert: '#ff4444',
  view: '#6b8fad',
  admin: '#a855f7',
  download: '#00ff88',
  dispense: '#00ff88',
  reject: '#ff4444',
  flag: '#ffb800',
}

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: 8,
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(0,212,255,0.2)',
  color: '#e8f4fd',
  fontSize: 14,
  outline: 'none',
}

export default function Admin({ navigate }: Props) {
  const { systemLogs, auditHistory, resetToDefaultData } = usePrescriptions()
  const [authed, setAuthed] = useState(false)
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [loginError, setLoginError] = useState(false)
  const [tab, setTab] = useState<AdminTab>('overview')
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [showAddUser, setShowAddUser] = useState(false)
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Pharmacist' })
  const [resetSuccess, setResetSuccess] = useState(false)

  const login = (e: React.FormEvent) => {
    e.preventDefault()
    if (loginForm.email === 'admin@rxshield.ai' && loginForm.password === 'admin123') {
      setAuthed(true)
    } else {
      setLoginError(true)
      setTimeout(() => setLoginError(false), 2500)
    }
  }

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) return
    const created: User = {
      id: `U-00${users.length + 1}`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      lastActive: new Date().toISOString().split('T')[0],
      status: 'active',
    }
    setUsers([...users, created])
    setShowAddUser(false)
    setNewUser({ name: '', email: '', role: 'Pharmacist' })
  }

  const handleResetData = () => {
    if (confirm('Are you sure you want to restore default prescription test fixtures?')) {
      resetToDefaultData()
      setResetSuccess(true)
      setTimeout(() => setResetSuccess(false), 3000)
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
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div
              style={{
                width: 68,
                height: 68,
                borderRadius: '50%',
                background: 'rgba(0,212,255,0.1)',
                border: '2px solid rgba(0,212,255,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                fontSize: 30,
              }}
            >
              🔒
            </div>
            <h1 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#e8f4fd', marginBottom: 6 }}>
              RxShield Admin Portal
            </h1>
            <p style={{ fontSize: 13, color: '#6b8fad' }}>Authorized compliance & security personnel only</p>
            <p style={{ fontSize: 12, color: '#00d4ff', marginTop: 8 }}>
              Demo Login: <strong>admin@rxshield.ai</strong> / <strong>admin123</strong>
            </p>
          </div>

          <div
            className="glass"
            style={{ borderRadius: 18, padding: 28, display: 'flex', flexDirection: 'column', gap: 16, background: '#071428' }}
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
                Invalid credentials. Use admin@rxshield.ai / admin123
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
              style={{ padding: '12px', borderRadius: 10, fontSize: 14, fontWeight: 700 }}
            >
              Sign In to Admin Portal
            </button>
          </div>

          <div style={{ textAlign: 'center', marginTop: 18 }}>
            <button
              type="button"
              onClick={() => navigate('landing')}
              style={{ background: 'none', border: 'none', color: '#6b8fad', cursor: 'pointer', fontSize: 13 }}
            >
              ← Back to main application
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#040d1a', display: 'flex', flexDirection: 'column' }}>
      {/* Admin Navbar */}
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
          background: '#071428',
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
              ADMINISTRATION
            </span>
          </span>
          <button
            onClick={() => navigate('dashboard')}
            style={{ background: 'none', border: 'none', color: '#6b8fad', cursor: 'pointer', fontSize: 13 }}
          >
            ← View App
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button
            onClick={handleResetData}
            style={{
              background: 'rgba(0,212,255,0.08)',
              border: '1px solid rgba(0,212,255,0.3)',
              color: '#00d4ff',
              borderRadius: 6,
              padding: '5px 12px',
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            Reset Fixtures
          </button>
          <span style={{ fontSize: 13, color: '#e8f4fd' }}>James Liu · System Administrator</span>
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

      {resetSuccess && (
        <div style={{ background: '#00ff8820', borderBottom: '1px solid #00ff88', padding: '8px 24px', color: '#00ff88', fontSize: 13, textAlign: 'center' }}>
          ✓ Test data fixtures restored successfully!
        </div>
      )}

      <div style={{ display: 'flex', flex: 1 }}>
        {/* Sidebar tabs */}
        <aside
          style={{
            width: 220,
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

        {/* Main Admin Tab Views */}
        <main style={{ flex: 1, padding: '36px', overflowY: 'auto' }}>
          {tab === 'overview' && (
            <div>
              <h2 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#e8f4fd', marginBottom: 24 }}>
                Executive System Overview
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
                <div className="glass" style={{ padding: 20, borderRadius: 14 }}>
                  <div style={{ fontSize: 26, marginBottom: 6 }}>📑</div>
                  <div className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#00d4ff' }}>{auditHistory.length}</div>
                  <div style={{ fontSize: 12, color: '#6b8fad', marginTop: 4 }}>Prescriptions Audited</div>
                </div>
                <div className="glass" style={{ padding: 20, borderRadius: 14 }}>
                  <div style={{ fontSize: 26, marginBottom: 6 }}>🚨</div>
                  <div className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#ff4444' }}>
                    {auditHistory.filter((a) => a.risk === 'suspicious').length}
                  </div>
                  <div style={{ fontSize: 12, color: '#6b8fad', marginTop: 4 }}>High-Risk Intercepts</div>
                </div>
                <div className="glass" style={{ padding: 20, borderRadius: 14 }}>
                  <div style={{ fontSize: 26, marginBottom: 6 }}>👥</div>
                  <div className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#a855f7' }}>{users.length}</div>
                  <div style={{ fontSize: 12, color: '#6b8fad', marginTop: 4 }}>Active Staff Users</div>
                </div>
                <div className="glass" style={{ padding: 20, borderRadius: 14 }}>
                  <div style={{ fontSize: 26, marginBottom: 6 }}>⚡</div>
                  <div className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#00ff88' }}>99.98%</div>
                  <div style={{ fontSize: 12, color: '#6b8fad', marginTop: 4 }}>System Uptime</div>
                </div>
              </div>

              {/* Real-Time System Event Feed */}
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#e8f4fd', marginBottom: 14 }}>
                Real-Time Security & Dispensing Event Stream
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {systemLogs.slice(0, 8).map((l) => (
                  <div
                    key={l.id}
                    className="glass"
                    style={{
                      borderRadius: 10,
                      padding: '12px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderLeft: `4px solid ${logColors[l.type] || '#00d4ff'}`,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ color: logColors[l.type] || '#00d4ff', fontSize: 16 }}>●</span>
                      <div>
                        <div style={{ fontSize: 13, color: '#e8f4fd', fontWeight: 600 }}>{l.action}</div>
                        <div style={{ fontSize: 11, color: '#6b8fad' }}>{l.user} ({l.role})</div>
                      </div>
                    </div>
                    <span style={{ fontSize: 11, color: '#6b8fad', fontFamily: 'monospace' }}>{l.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'analytics' && (
            <div>
              <h2 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#e8f4fd', marginBottom: 20 }}>
                Enterprise Fraud & Dispensing Analytics
              </h2>
              <AnalyticsCharts reports={auditHistory} />
            </div>
          )}

          {tab === 'users' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#e8f4fd' }}>
                  Role-Based User Permissions
                </h2>
                <button
                  onClick={() => setShowAddUser(true)}
                  className="btn-primary"
                  style={{ padding: '8px 16px', borderRadius: 8, fontSize: 13 }}
                >
                  + Add User
                </button>
              </div>

              {showAddUser && (
                <div className="glass" style={{ padding: 20, borderRadius: 12, marginBottom: 20, background: '#071428' }}>
                  <h4 style={{ color: '#e8f4fd', margin: '0 0 12px 0' }}>Add Authorized User</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 14 }}>
                    <input
                      placeholder="Full Name"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      style={inputStyle}
                    />
                    <input
                      placeholder="Email Address"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      style={inputStyle}
                    />
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                      style={inputStyle}
                    >
                      <option value="Pharmacist" style={{ background: '#071428' }}>Pharmacist</option>
                      <option value="Compliance Lead" style={{ background: '#071428' }}>Compliance Lead</option>
                      <option value="Physician" style={{ background: '#071428' }}>Physician</option>
                      <option value="Admin" style={{ background: '#071428' }}>Admin</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={handleAddUser} className="btn-primary" style={{ padding: '6px 14px', borderRadius: 6, fontSize: 12 }}>Save</button>
                    <button onClick={() => setShowAddUser(false)} className="btn-outline" style={{ padding: '6px 14px', borderRadius: 6, fontSize: 12 }}>Cancel</button>
                  </div>
                </div>
              )}

              <div className="glass" style={{ borderRadius: 14, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(0,212,255,0.15)', color: '#6b8fad', background: 'rgba(0,212,255,0.05)' }}>
                      <th style={{ padding: '12px 16px', textAlign: 'left' }}>User</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left' }}>Role</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left' }}>Email</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left' }}>Last Active</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#e8f4fd' }}>
                        <td style={{ padding: '12px 16px', fontWeight: 600 }}>{u.name}</td>
                        <td style={{ padding: '12px 16px', color: '#00d4ff' }}>{u.role}</td>
                        <td style={{ padding: '12px 16px', color: '#8bb0ce' }}>{u.email}</td>
                        <td style={{ padding: '12px 16px', color: '#6b8fad' }}>{u.lastActive}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ color: u.status === 'active' ? '#00ff88' : '#6b8fad', fontSize: 12, fontWeight: 700 }}>
                            {u.status.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === 'medicines' && (
            <div>
              <h2 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#e8f4fd', marginBottom: 12 }}>
                Controlled Substance Watchlist & Risk Thresholds
              </h2>
              <p style={{ color: '#6b8fad', fontSize: 14, marginBottom: 20 }}>
                Automated red-flags triggered for DEA Schedule II narcotics, rapid fill repeat requests, and maximum clinical single doses.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                {[
                  { name: 'Oxycodone', schedule: 'Schedule II', maxDose: '60mg/day', risk: 'Opioid Risk' },
                  { name: 'Alprazolam', schedule: 'Schedule IV', maxDose: '4mg/day', risk: 'Sedative Dependence' },
                  { name: 'Hydrocodone', schedule: 'Schedule II', maxDose: '40mg/day', risk: 'Respiratory Depression' },
                  { name: 'Carisoprodol', schedule: 'Schedule IV', maxDose: '1400mg/day', risk: 'Muscle Relaxant Potentiation' },
                ].map((item, idx) => (
                  <div key={idx} className="glass" style={{ padding: 18, borderRadius: 12, border: '1px solid rgba(255,68,68,0.2)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ color: '#e8f4fd', margin: 0, fontSize: 16 }}>{item.name}</h4>
                      <span style={{ background: '#ff444420', color: '#ff4444', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700 }}>
                        {item.schedule}
                      </span>
                    </div>
                    <div style={{ fontSize: 13, color: '#8bb0ce', marginTop: 8 }}>
                      Max Threshold: <strong style={{ color: '#e8f4fd' }}>{item.maxDose}</strong>
                    </div>
                    <div style={{ fontSize: 12, color: '#ffb800', marginTop: 4 }}>
                      Flag: {item.risk}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'logs' && (
            <div>
              <h2 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#e8f4fd', marginBottom: 20 }}>
                Immutable System Audit Log
              </h2>
              <div className="glass" style={{ borderRadius: 14, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(0,212,255,0.15)', color: '#6b8fad', background: 'rgba(0,212,255,0.05)' }}>
                      <th style={{ padding: '12px 16px', textAlign: 'left' }}>Time</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left' }}>Actor & Role</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left' }}>Action Performed</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left' }}>Rx Reference</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left' }}>Event Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {systemLogs.map((l) => (
                      <tr key={l.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#e8f4fd' }}>
                        <td style={{ padding: '12px 16px', fontFamily: 'monospace', color: '#6b8fad' }}>{l.timestamp}</td>
                        <td style={{ padding: '12px 16px', fontWeight: 600 }}>{l.user} ({l.role})</td>
                        <td style={{ padding: '12px 16px' }}>{l.action}</td>
                        <td style={{ padding: '12px 16px', color: '#00d4ff', fontFamily: 'monospace' }}>{l.rxId || '—'}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ color: logColors[l.type] || '#00d4ff', fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>
                            {l.type}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
