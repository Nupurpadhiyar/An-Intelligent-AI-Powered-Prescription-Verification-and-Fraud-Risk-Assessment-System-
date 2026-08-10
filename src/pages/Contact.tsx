import { useState } from 'react'
import Navbar from '../components/Navbar'
import type { Page } from '../App'

interface Props {
  navigate: (p: Page) => void
  darkMode: boolean
  setDarkMode: (v: boolean) => void
}

export default function Contact({ navigate }: Props) {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  return (
    <div style={{ minHeight: '100vh', background: '#040d1a' }}>
      <Navbar navigate={navigate} current="contact" />
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 24px' }}>

        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h1 className="font-display" style={{ fontSize: 48, fontWeight: 900, color: '#e8f4fd', letterSpacing: '-0.03em', marginBottom: 16 }}>
            Get in Touch
          </h1>
          <p style={{ color: '#a8c8e8', fontSize: 16, maxWidth: 520, margin: '0 auto', lineHeight: 1.6 }}>
            Questions, feedback, or partnership inquiries? We respond within one business day.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: 32 }}>
          {/* Form */}
          <div className="glass" style={{ borderRadius: 20, padding: '36px 32px' }}>
            {sent ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
                <h3 className="font-display" style={{ fontSize: 24, fontWeight: 800, color: '#00ff88', marginBottom: 12 }}>
                  Message Sent!
                </h3>
                <p style={{ color: '#a8c8e8', lineHeight: 1.6 }}>
                  Thanks for reaching out, {form.name || 'there'}. We'll get back to you at {form.email || 'your email'} within 24 hours.
                </p>
                <button
                  onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }) }}
                  className="btn-outline"
                  style={{ marginTop: 24, padding: '10px 24px', borderRadius: 10, fontSize: 14 }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={submit}>
                <h2 className="font-display" style={{ fontSize: 22, fontWeight: 700, color: '#e8f4fd', marginBottom: 24 }}>
                  Send us a message
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <Field label="Your Name">
                      <input
                        required
                        placeholder="Dr. Jane Smith"
                        value={form.name}
                        onChange={set('name')}
                        style={inputStyle}
                      />
                    </Field>
                    <Field label="Email Address">
                      <input
                        type="email"
                        required
                        placeholder="jane@hospital.org"
                        value={form.email}
                        onChange={set('email')}
                        style={inputStyle}
                      />
                    </Field>
                  </div>
                  <Field label="Subject">
                    <select value={form.subject} onChange={set('subject')} style={inputStyle} required>
                      <option value="">Select a topic...</option>
                      <option>Technical Support</option>
                      <option>Partnership Inquiry</option>
                      <option>Report an Issue</option>
                      <option>Feature Request</option>
                      <option>General Question</option>
                    </select>
                  </Field>
                  <Field label="Message">
                    <textarea
                      required
                      rows={6}
                      placeholder="Describe your question or message in detail..."
                      value={form.message}
                      onChange={set('message')}
                      style={{ ...inputStyle, resize: 'vertical' }}
                    />
                  </Field>
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ padding: '13px', borderRadius: 11, fontSize: 15 }}
                  >
                    Send Message →
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Contact info + illustration */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Abstract visual */}
            <div
              style={{
                borderRadius: 20,
                overflow: 'hidden',
                height: 200,
                background: 'linear-gradient(135deg, rgba(0,212,255,0.1) 0%, rgba(0,255,136,0.08) 100%)',
                border: '1px solid rgba(0,212,255,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              <NetworkIllustration />
              <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: 48 }}>🏥</div>
                <div className="font-display" style={{ fontSize: 14, fontWeight: 600, color: '#00d4ff', marginTop: 8 }}>
                  Northridge, CA — HQ
                </div>
              </div>
            </div>

            {/* Contact cards */}
            {contactInfo.map((c) => (
              <div
                key={c.label}
                className="glass card-hover"
                style={{ borderRadius: 14, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 16 }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    background: 'rgba(0,212,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 20,
                    flexShrink: 0,
                  }}
                >
                  {c.icon}
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#6b8fad', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 3 }}>
                    {c.label}
                  </div>
                  <div style={{ fontSize: 14, color: '#e8f4fd' }}>{c.value}</div>
                </div>
              </div>
            ))}

            <div
              className="glass"
              style={{ borderRadius: 14, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}
            >
              <span style={{ color: '#00ff88', fontSize: 10 }}>●</span>
              <span style={{ fontSize: 13, color: '#a8c8e8' }}>Support team online · Avg. response &lt;4 hours</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 12, color: '#6b8fad', marginBottom: 6, fontWeight: 500 }}>
        {label}
      </label>
      {children}
    </div>
  )
}

function NetworkIllustration() {
  const nodes = [
    { cx: 60, cy: 80 }, { cx: 200, cy: 40 }, { cx: 340, cy: 90 },
    { cx: 140, cy: 150 }, { cx: 270, cy: 160 },
  ]
  const edges = [[0,1],[1,2],[0,3],[1,3],[1,4],[2,4],[3,4]]
  return (
    <svg
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.3 }}
      viewBox="0 0 400 200"
      preserveAspectRatio="xMidYMid meet"
    >
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a].cx} y1={nodes[a].cy}
          x2={nodes[b].cx} y2={nodes[b].cy}
          stroke="#00d4ff" strokeWidth="1"
        />
      ))}
      {nodes.map((n, i) => (
        <circle key={i} cx={n.cx} cy={n.cy} r="5" fill="#00d4ff" />
      ))}
    </svg>
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
}

const contactInfo = [
  { icon: '✉️', label: 'Email', value: 'support@rxshield.ai' },
  { icon: '📞', label: 'Phone', value: '+1 (888) 779-4433' },
  { icon: '🏢', label: 'Address', value: '1400 Healthcare Blvd, Suite 200, Northridge, CA 91325' },
  { icon: '🕐', label: 'Hours', value: 'Mon–Fri 8:00 AM – 6:00 PM PST' },
]
