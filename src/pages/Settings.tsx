import { useState } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import type { Page } from '../App'

interface Props {
  navigate: (p: Page) => void
  darkMode: boolean
  setDarkMode: (v: boolean) => void
}

export default function Settings({ navigate, darkMode, setDarkMode }: Props) {
  const [name, setName] = useState('Dr. Alex Ramos')
  const [email, setEmail] = useState('a.ramos@northridge.med')
  const [role, setRole] = useState('Pharmacist')
  const [notifications, setNotifications] = useState(true)
  const [autoFlag, setAutoFlag] = useState(true)
  const [threshold, setThreshold] = useState(70)
  const [saved, setSaved] = useState(false)

  const save = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#040d1a' }}>
      <Sidebar navigate={navigate} current="settings" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Navbar navigate={navigate} current="settings" />
        <main style={{ flex: 1, padding: '36px 36px', overflowY: 'auto' }}>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>

            <div style={{ marginBottom: 32 }}>
              <h1 className="font-display" style={{ fontSize: 30, fontWeight: 800, color: '#e8f4fd', letterSpacing: '-0.02em', marginBottom: 6 }}>
                Settings
              </h1>
              <p style={{ color: '#6b8fad', fontSize: 14 }}>Manage your profile, preferences, and AI risk rules.</p>
            </div>

            {/* Profile */}
            <Section title="User Profile" icon="👤">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Field label="Full Name">
                  <input value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
                </Field>
                <Field label="Email">
                  <input value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
                </Field>
                <Field label="Role">
                  <select value={role} onChange={(e) => setRole(e.target.value)} style={inputStyle}>
                    <option>Pharmacist</option>
                    <option>Doctor</option>
                    <option>Admin</option>
                    <option>Technician</option>
                  </select>
                </Field>
                <Field label="Institution">
                  <input defaultValue="Northridge Medical Center" style={inputStyle} />
                </Field>
              </div>
              <div style={{ marginTop: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #00d4ff, #00ff88)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 24,
                      fontWeight: 700,
                      color: '#040d1a',
                    }}
                    className="font-display"
                  >
                    AR
                  </div>
                  <button
                    className="btn-outline"
                    style={{ padding: '8px 18px', borderRadius: 9, fontSize: 13 }}
                  >
                    Change Avatar
                  </button>
                </div>
              </div>
            </Section>

            {/* Preferences */}
            <Section title="Preferences" icon="🎨">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <Toggle
                  label="Dark Mode"
                  desc="Use dark theme throughout the application"
                  value={darkMode}
                  onChange={setDarkMode}
                />
                <Toggle
                  label="Email Notifications"
                  desc="Get notified when suspicious prescriptions are flagged"
                  value={notifications}
                  onChange={setNotifications}
                />
              </div>
            </Section>

            {/* Risk Rules */}
            <Section title="AI Risk Assessment Rules" icon="🧠">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <Toggle
                  label="Auto-flag Controlled Substances"
                  desc="Automatically flag prescriptions containing Schedule II–IV substances"
                  value={autoFlag}
                  onChange={setAutoFlag}
                />
                <Field label={`Suspicion Threshold: ${threshold}%`}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <input
                      type="range"
                      min="40"
                      max="95"
                      value={threshold}
                      onChange={(e) => setThreshold(Number(e.target.value))}
                      style={{
                        flex: 1,
                        accentColor: '#00d4ff',
                        cursor: 'pointer',
                      }}
                    />
                    <span
                      className="font-mono"
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: threshold < 60 ? '#ff4444' : threshold < 75 ? '#ffb800' : '#00ff88',
                        minWidth: 48,
                        textAlign: 'right',
                      }}
                    >
                      {threshold}%
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: '#6b8fad', marginTop: 6 }}>
                    Prescriptions with AI confidence below this threshold will be flagged as suspicious.
                  </p>
                </Field>
                <Field label="Restricted Medicine Watchlist">
                  <textarea
                    defaultValue="Oxycodone, Hydrocodone, Alprazolam, Adderall, Fentanyl"
                    rows={3}
                    style={{ ...inputStyle, resize: 'vertical' }}
                  />
                </Field>
              </div>
            </Section>

            {/* Security */}
            <Section title="Security" icon="🔒">
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button className="btn-outline" style={{ padding: '9px 20px', borderRadius: 9, fontSize: 13 }}>
                  Change Password
                </button>
                <button className="btn-outline" style={{ padding: '9px 20px', borderRadius: 9, fontSize: 13 }}>
                  Enable 2FA
                </button>
                <button
                  style={{
                    padding: '9px 20px',
                    borderRadius: 9,
                    fontSize: 13,
                    background: 'rgba(255,68,68,0.08)',
                    border: '1px solid rgba(255,68,68,0.25)',
                    color: '#ff4444',
                    cursor: 'pointer',
                  }}
                >
                  Download Audit Log
                </button>
              </div>
            </Section>

            {/* Save */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              {saved && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 16px',
                    borderRadius: 10,
                    background: 'rgba(0,255,136,0.1)',
                    border: '1px solid rgba(0,255,136,0.3)',
                    color: '#00ff88',
                    fontSize: 14,
                  }}
                >
                  ✓ Settings saved
                </div>
              )}
              <button
                onClick={save}
                className="btn-primary"
                style={{ padding: '11px 28px', borderRadius: 10, fontSize: 15 }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div
      className="glass"
      style={{ borderRadius: 16, padding: '24px 28px', marginBottom: 20 }}
    >
      <h2
        className="font-display"
        style={{ fontSize: 17, fontWeight: 700, color: '#e8f4fd', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}
      >
        <span>{icon}</span>
        {title}
      </h2>
      {children}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 12, color: '#6b8fad', marginBottom: 6, fontWeight: 500, letterSpacing: '0.03em' }}>
        {label}
      </label>
      {children}
    </div>
  )
}

function Toggle({ label, desc, value, onChange }: { label: string; desc: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24 }}>
      <div>
        <div style={{ fontSize: 14, color: '#e8f4fd', fontWeight: 500, marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: 12, color: '#6b8fad' }}>{desc}</div>
      </div>
      <button
        onClick={() => onChange(!value)}
        style={{
          width: 48,
          height: 26,
          borderRadius: 999,
          background: value ? 'linear-gradient(135deg, #00d4ff, #00ff88)' : 'rgba(0,212,255,0.1)',
          border: `1px solid ${value ? 'transparent' : 'rgba(0,212,255,0.2)'}`,
          cursor: 'pointer',
          position: 'relative',
          transition: 'all 0.3s',
          flexShrink: 0,
          boxShadow: value ? '0 0 12px rgba(0,212,255,0.3)' : 'none',
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: 3,
            left: value ? 24 : 3,
            width: 18,
            height: 18,
            borderRadius: '50%',
            background: '#fff',
            transition: 'left 0.3s',
            boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
          }}
        />
      </button>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: 9,
  background: 'rgba(0,212,255,0.05)',
  border: '1px solid rgba(0,212,255,0.15)',
  color: '#e8f4fd',
  fontSize: 14,
  outline: 'none',
  transition: 'border-color 0.2s',
}
