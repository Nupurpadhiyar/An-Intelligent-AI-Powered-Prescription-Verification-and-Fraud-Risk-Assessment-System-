import { useState } from 'react'
import type { Page } from '../App'

interface Props {
  navigate: (p: Page) => void
  mode: 'login' | 'register'
}

type StoredUser = {
  name: string
  email: string
  password: string
  role: string
}

const USERS_KEY = 'rxshield_users'
const SESSION_KEY = 'rxshield_session'

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: 10,
  border: '1px solid rgba(0,212,255,0.14)',
  background: 'rgba(4,13,26,0.75)',
  color: '#e8f4fd',
  outline: 'none',
  fontSize: 14,
  fontFamily: 'Inter, sans-serif',
  transition: 'all 0.2s ease',
}

const getUsers = (): StoredUser[] => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
  } catch {
    return []
  }
}

export default function Auth({ navigate, mode }: Props) {
  const isRegister = mode === 'register'
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'Doctor' })
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const update = (key: string, value: string) => {
    setForm((current) => ({ ...current, [key]: value }))
    setError('')
    setMessage('')
  }

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    const email = form.email.trim().toLowerCase()

    if (isRegister) {
      if (form.password.length < 6) {
        setError('Password must contain at least 6 characters.')
        return
      }
      if (form.password !== form.confirmPassword) {
        setError('Passwords do not match.')
        return
      }

      const users = getUsers()
      if (users.some((user) => user.email === email)) {
        setError('An account with this email already exists.')
        return
      }

      const newUser: StoredUser = {
        name: form.name.trim(),
        email,
        password: form.password,
        role: form.role,
      }
      localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]))
      setMessage('Account created successfully. Redirecting to login…')
      window.setTimeout(() => navigate('login'), 700)
      return
    }

    const users = getUsers()
    const user = users.find((item) => item.email === email && item.password === form.password)

    // Demo account so the page can be tested immediately.
    const demoUser = email === 'user@rxshield.ai' && form.password === 'user123'
      ? { name: 'RxShield User', email, role: 'Doctor' }
      : null

    if (!user && !demoUser) {
      setError('Invalid email or password. Try user@rxshield.ai / user123 for the demo.')
      return
    }

    localStorage.setItem(SESSION_KEY, JSON.stringify(user || demoUser))
    navigate('dashboard')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#040d1a', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div className="bg-grid" style={{ position: 'absolute', inset: 0, opacity: 0.55 }} />
      <div style={{ position: 'absolute', top: '12%', left: '8%', width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,255,0.08), transparent 68%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-10%', right: '5%', width: 520, height: 520, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,255,136,0.06), transparent 68%)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: isRegister ? 520 : 440 }} className="animate-fade-in-up">
        <button onClick={() => navigate('landing')} style={{ background: 'none', border: 'none', color: '#6b8fad', cursor: 'pointer', marginBottom: 28, fontSize: 13 }}>
          ← Back to RxShield AI
        </button>

        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div className="animate-glow-pulse" style={{ width: 68, height: 68, borderRadius: 20, margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,212,255,0.09)', border: '1px solid rgba(0,212,255,0.3)' }}>
            <ShieldIcon />
          </div>
          <div className="font-display" style={{ fontSize: 25, fontWeight: 800 }}>
            <span style={{ color: '#00d4ff' }}>Rx</span><span style={{ color: '#e8f4fd' }}>Shield</span><span style={{ color: '#00ff88', fontSize: 12, marginLeft: 4 }}>AI</span>
          </div>
          <h1 className="font-display" style={{ fontSize: 27, fontWeight: 800, margin: '20px 0 6px', color: '#e8f4fd' }}>
            {isRegister ? 'Create your account' : 'Welcome back'}
          </h1>
          <p style={{ margin: 0, color: '#6b8fad', fontSize: 14 }}>
            {isRegister ? 'Join the secure prescription verification platform.' : 'Sign in to continue to your RxShield workspace.'}
          </p>
        </div>

        <form onSubmit={submit} className="glass" style={{ borderRadius: 20, padding: 28, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {error && <div style={{ padding: '11px 13px', borderRadius: 9, background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.28)', color: '#ff7777', fontSize: 13 }}>{error}</div>}
          {message && <div style={{ padding: '11px 13px', borderRadius: 9, background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.25)', color: '#00ff88', fontSize: 13 }}>{message}</div>}

          {isRegister && <Field label="Full name" value={form.name} onChange={(v) => update('name', v)} placeholder="Enter your full name" />}
          <Field label="Email address" value={form.email} onChange={(v) => update('email', v)} placeholder="you@example.com" type="email" />

          {isRegister && (
            <div>
              <label style={labelStyle}>Professional role</label>
              <select value={form.role} onChange={(e) => update('role', e.target.value)} style={{ ...inputStyle, appearance: 'auto' }}>
                <option>Doctor</option>
                <option>Pharmacist</option>
                <option>Technician</option>
              </select>
            </div>
          )}

          <div>
            <label style={labelStyle}>Password</label>
            <div style={{ position: 'relative' }}>
              <input type={showPassword ? 'text' : 'password'} required value={form.password} onChange={(e) => update('password', e.target.value)} placeholder="••••••••" style={{ ...inputStyle, paddingRight: 72 }} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 10, top: 8, border: 'none', background: 'none', color: '#6b8fad', cursor: 'pointer', padding: 5, fontSize: 12 }}>{showPassword ? 'Hide' : 'Show'}</button>
            </div>
          </div>

          {isRegister && <Field label="Confirm password" value={form.confirmPassword} onChange={(v) => update('confirmPassword', v)} placeholder="Repeat your password" type="password" />}

          {!isRegister && <div style={{ textAlign: 'right', marginTop: -8 }}><button type="button" style={{ border: 'none', background: 'none', color: '#00d4ff', cursor: 'pointer', fontSize: 12 }}>Forgot password?</button></div>}

          <button type="submit" className="btn-primary" style={{ padding: '13px 16px', borderRadius: 10, fontSize: 15, marginTop: 2 }}>
            {isRegister ? 'Create Account' : 'Sign In'}
          </button>

          <div style={{ textAlign: 'center', color: '#6b8fad', fontSize: 13, paddingTop: 3 }}>
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button type="button" onClick={() => navigate(isRegister ? 'login' : 'register')} style={{ border: 'none', background: 'none', color: '#00d4ff', fontWeight: 600, cursor: 'pointer' }}>
              {isRegister ? 'Sign in' : 'Create one'}
            </button>
          </div>
        </form>

        {!isRegister && <div style={{ textAlign: 'center', marginTop: 14, color: '#385a79', fontSize: 11 }}>
          Demo login: user@rxshield.ai · user123
        </div>}
      </div>
    </div>
  )
}

function Field({ label, value, onChange, placeholder, type = 'text' }: { label: string; value: string; onChange: (value: string) => void; placeholder: string; type?: string }) {
  return <div>
    <label style={labelStyle}>{label}</label>
    <input required type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={inputStyle} />
  </div>
}

const labelStyle: React.CSSProperties = { display: 'block', fontSize: 12, color: '#8db0ce', marginBottom: 7, fontWeight: 600 }

function ShieldIcon() {
  return <svg width="34" height="34" viewBox="0 0 32 32" fill="none">
    <path d="M16 2L4 7v10c0 6.627 5.144 11.637 12 13 6.856-1.363 12-6.373 12-13V7L16 2z" fill="rgba(0,212,255,0.15)" stroke="#00d4ff" strokeWidth="1.5" />
    <path d="M11 16l3.5 3.5L21 12" stroke="#00ff88" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
}
