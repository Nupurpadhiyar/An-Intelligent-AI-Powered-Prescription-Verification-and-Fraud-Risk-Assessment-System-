import Navbar from '../components/Navbar'
import type { Page } from '../App'

interface Props {
  navigate: (p: Page) => void
  darkMode: boolean
  setDarkMode: (v: boolean) => void
}

export default function About({ navigate }: Props) {
  return (
    <div style={{ minHeight: '100vh', background: '#040d1a' }}>
      <Navbar navigate={navigate} current="about" />
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 24px' }}>

        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: 80 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 16px',
              borderRadius: 999,
              background: 'rgba(0,212,255,0.08)',
              border: '1px solid rgba(0,212,255,0.2)',
              marginBottom: 24,
            }}
          >
            <span className="font-mono" style={{ fontSize: 11, color: '#00d4ff', letterSpacing: '0.1em' }}>
              ABOUT RXSHIELD AI
            </span>
          </div>
          <h1
            className="font-display"
            style={{ fontSize: 52, fontWeight: 900, color: '#e8f4fd', letterSpacing: '-0.03em', marginBottom: 20, lineHeight: 1.1 }}
          >
            Built to make{' '}
            <span style={{ background: 'linear-gradient(135deg, #00d4ff, #00ff88)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              prescriptions
            </span>{' '}
            safer.
          </h1>
          <p style={{ fontSize: 18, color: '#a8c8e8', maxWidth: 600, margin: '0 auto', lineHeight: 1.7 }}>
            RxShield AI was born from a simple observation: prescription fraud is rampant, yet
            the tools to catch it are decades behind modern technology.
          </p>
        </div>

        {/* Problem → Solution → Future */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 80 }}>
          {[
            {
              icon: '🚨',
              title: 'The Problem',
              color: '#ff4444',
              bg: 'rgba(255,68,68,0.06)',
              border: 'rgba(255,68,68,0.2)',
              points: [
                '10M+ forged prescriptions dispensed annually',
                'Opioid crisis fueled by fraudulent scripts',
                'Manual verification is slow and inconsistent',
                'Pharmacists overwhelmed — errors are inevitable',
              ],
            },
            {
              icon: '🛡️',
              title: 'Our Solution',
              color: '#00d4ff',
              bg: 'rgba(0,212,255,0.06)',
              border: 'rgba(0,212,255,0.2)',
              points: [
                'AI-powered OCR reads any prescription format',
                'Real-time risk scoring in under 2 seconds',
                'Controlled substance cross-referencing',
                'Tamper and forgery detection algorithms',
              ],
            },
            {
              icon: '🔭',
              title: 'Future Scope',
              color: '#00ff88',
              bg: 'rgba(0,255,136,0.06)',
              border: 'rgba(0,255,136,0.2)',
              points: [
                'Direct EHR / EMR system integration',
                'Real-time pharmacy network alerts',
                'Blockchain audit trail for prescriptions',
                'Multilingual prescription support',
              ],
            },
          ].map((card) => (
            <div
              key={card.title}
              style={{
                borderRadius: 18,
                padding: '28px',
                background: card.bg,
                border: `1px solid ${card.border}`,
              }}
            >
              <div style={{ fontSize: 36, marginBottom: 16 }}>{card.icon}</div>
              <h3 className="font-display" style={{ fontSize: 22, fontWeight: 800, color: card.color, marginBottom: 16 }}>
                {card.title}
              </h3>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {card.points.map((p) => (
                  <li key={p} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span style={{ color: card.color, marginTop: 2, fontSize: 12, flexShrink: 0 }}>→</span>
                    <span style={{ fontSize: 14, color: '#a8c8e8', lineHeight: 1.5 }}>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Tech stack */}
        <div style={{ marginBottom: 80 }}>
          <h2 className="font-display" style={{ fontSize: 32, fontWeight: 800, color: '#e8f4fd', letterSpacing: '-0.02em', marginBottom: 32, textAlign: 'center' }}>
            Technology Stack
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
            {techStack.map((t) => (
              <div
                key={t.name}
                className="glass card-hover"
                style={{ borderRadius: 14, padding: '20px', textAlign: 'center' }}
              >
                <div style={{ fontSize: 32, marginBottom: 10 }}>{t.icon}</div>
                <div className="font-display" style={{ fontSize: 15, fontWeight: 700, color: '#e8f4fd', marginBottom: 4 }}>{t.name}</div>
                <div style={{ fontSize: 12, color: '#6b8fad' }}>{t.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div>
          <h2 className="font-display" style={{ fontSize: 32, fontWeight: 800, color: '#e8f4fd', letterSpacing: '-0.02em', marginBottom: 32, textAlign: 'center' }}>
            The Team
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
            {team.map((member) => (
              <div key={member.name} className="glass card-hover" style={{ borderRadius: 16, padding: '24px', textAlign: 'center' }}>
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: '50%',
                    background: member.gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 28,
                    fontWeight: 800,
                    color: '#040d1a',
                    margin: '0 auto 16px',
                    border: '2px solid rgba(0,212,255,0.2)',
                  }}
                  className="font-display"
                >
                  {member.initials}
                </div>
                <div className="font-display" style={{ fontSize: 16, fontWeight: 700, color: '#e8f4fd', marginBottom: 4 }}>
                  {member.name}
                </div>
                <div style={{ fontSize: 13, color: '#00d4ff', marginBottom: 8 }}>{member.role}</div>
                <div style={{ fontSize: 12, color: '#6b8fad', lineHeight: 1.5 }}>{member.bio}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

const techStack = [
  { icon: '🧠', name: 'Deep Learning OCR', desc: 'Tesseract + Custom CNN' },
  { icon: '⚡', name: 'React + Vite', desc: 'Frontend' },
  { icon: '🐍', name: 'Python FastAPI', desc: 'Backend API' },
  { icon: '🔍', name: 'NLP Analysis', desc: 'spaCy + Transformers' },
  { icon: '🗄️', name: 'PostgreSQL', desc: 'Medicine database' },
  { icon: '🔐', name: 'AES-256', desc: 'Data encryption' },
]

const team = [
  {
    initials: 'AR',
    name: 'Alex Ramos',
    role: 'Lead Engineer',
    bio: 'Full-stack developer specializing in AI/ML pipeline integration.',
    gradient: 'linear-gradient(135deg, #00d4ff, #0099cc)',
  },
  {
    initials: 'MP',
    name: 'Maya Patel',
    role: 'AI/ML Researcher',
    bio: 'PhD candidate in medical informatics and computer vision.',
    gradient: 'linear-gradient(135deg, #00ff88, #00cc6a)',
  },
  {
    initials: 'JL',
    name: 'James Liu',
    role: 'Healthcare Advisor',
    bio: 'Registered pharmacist with 12 years in clinical practice.',
    gradient: 'linear-gradient(135deg, #a855f7, #7c3aed)',
  },
  {
    initials: 'SK',
    name: 'Sara Kim',
    role: 'UI/UX Designer',
    bio: 'Healthcare-focused UX designer passionate about clean interfaces.',
    gradient: 'linear-gradient(135deg, #ffb800, #ff8800)',
  },
]
