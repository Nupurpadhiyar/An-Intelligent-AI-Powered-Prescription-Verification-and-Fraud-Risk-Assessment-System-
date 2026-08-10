import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import type { Page } from '../App'

interface Props {
  navigate: (p: Page) => void
  darkMode: boolean
  setDarkMode: (v: boolean) => void
}

export default function Landing({ navigate }: Props) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const target = 847293
    const duration = 2000
    const steps = 60
    const increment = target / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(current))
    }, duration / steps)
    return () => clearInterval(timer)
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#040d1a', overflowX: 'hidden' }}>
      <Navbar navigate={navigate} current="landing" />

      {/* Hero */}
      <section
        style={{
          position: 'relative',
          minHeight: '92vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Background layers */}
        <div className="bg-grid" style={{ position: 'absolute', inset: 0, opacity: 0.6 }} />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0,212,255,0.08) 0%, transparent 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '20%',
            left: '10%',
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '10%',
            right: '10%',
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,255,136,0.05) 0%, transparent 70%)',
          }}
        />

        {/* Floating orbs */}
        <FloatingOrbs />

        {/* Scan line */}
        <div
          className="animate-scan-line"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.3), transparent)',
            pointerEvents: 'none',
          }}
        />

        {/* Content */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            textAlign: 'center',
            maxWidth: 900,
            padding: '0 24px',
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 16px',
              borderRadius: 999,
              background: 'rgba(0,212,255,0.08)',
              border: '1px solid rgba(0,212,255,0.2)',
              marginBottom: 32,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00ff88', display: 'inline-block', boxShadow: '0 0 8px #00ff88' }} />
            <span className="font-mono" style={{ fontSize: 11, color: '#00d4ff', letterSpacing: '0.1em' }}>
              SYSTEM ONLINE — AI ENGINE v2.4.1
            </span>
          </div>

          <h1
            className="font-display"
            style={{
              fontSize: 'clamp(40px, 7vw, 80px)',
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              marginBottom: 24,
              color: '#e8f4fd',
            }}
          >
            AI-powered{' '}
            <span style={{
              background: 'linear-gradient(135deg, #00d4ff, #00ff88)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Prescription Verification
            </span>{' '}
            for Safer Healthcare.
          </h1>

          <p
            style={{
              fontSize: 18,
              color: '#a8c8e8',
              maxWidth: 640,
              margin: '0 auto 40px',
              lineHeight: 1.7,
            }}
          >
            RxShield AI uses advanced OCR and machine learning to detect forged, incomplete, or
            high-risk prescriptions in seconds — protecting patients and pharmacies alike.
          </p>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('upload')}
              className="btn-primary"
              style={{ padding: '14px 32px', borderRadius: 12, fontSize: 16 }}
            >
              Upload Prescription →
            </button>
            <button
              onClick={() => navigate('about')}
              className="btn-outline"
              style={{ padding: '14px 32px', borderRadius: 12, fontSize: 16 }}
            >
              Learn More
            </button>
          </div>

          {/* Stats row */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 48,
              marginTop: 64,
              flexWrap: 'wrap',
            }}
          >
            {[
              { value: count.toLocaleString(), label: 'Prescriptions Verified' },
              { value: '99.7%', label: 'Accuracy Rate' },
              { value: '<2s', label: 'Avg. Processing Time' },
            ].map((stat) => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <div
                  className="font-display"
                  style={{
                    fontSize: 36,
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #00d4ff, #00ff88)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {stat.value}
                </div>
                <div style={{ fontSize: 13, color: '#6b8fad', marginTop: 4 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem / Solution Cards */}
      <section style={{ padding: '80px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2
            className="font-display"
            style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-0.02em', color: '#e8f4fd', marginBottom: 16 }}
          >
            The Problem. The Solution.
          </h2>
          <p style={{ color: '#6b8fad', maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
            Prescription fraud costs the healthcare system billions annually. RxShield AI is built
            to stop it at the source.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 24,
          }}
        >
          {problemCards.map((card) => (
            <div
              key={card.title}
              className="glass card-hover"
              style={{ borderRadius: 16, padding: 28 }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: card.iconBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22,
                  marginBottom: 16,
                }}
              >
                {card.icon}
              </div>
              <h3
                className="font-display"
                style={{ fontSize: 18, fontWeight: 700, color: card.color, marginBottom: 10 }}
              >
                {card.title}
              </h3>
              <p style={{ color: '#a8c8e8', lineHeight: 1.7, fontSize: 14 }}>{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '80px 24px', background: 'rgba(7,20,40,0.6)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2
              className="font-display"
              style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-0.02em', color: '#e8f4fd', marginBottom: 16 }}
            >
              How RxShield AI Works
            </h2>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 32,
              position: 'relative',
            }}
          >
            {steps.map((step, i) => (
              <div key={step.label} style={{ textAlign: 'center', position: 'relative' }}>
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    border: '2px solid rgba(0,212,255,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                    background: 'rgba(0,212,255,0.06)',
                    fontSize: 24,
                    position: 'relative',
                  }}
                  className="animate-glow-pulse"
                >
                  {step.icon}
                  <span
                    className="font-mono"
                    style={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      background: '#00d4ff',
                      color: '#040d1a',
                      fontSize: 10,
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {i + 1}
                  </span>
                </div>
                <h4 className="font-display" style={{ fontSize: 16, fontWeight: 700, color: '#e8f4fd', marginBottom: 8 }}>
                  {step.label}
                </h4>
                <p style={{ fontSize: 13, color: '#6b8fad', lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ padding: '80px 24px' }}>
        <div
          style={{
            maxWidth: 800,
            margin: '0 auto',
            textAlign: 'center',
            padding: '56px 40px',
            borderRadius: 24,
            background: 'linear-gradient(135deg, rgba(0,212,255,0.08) 0%, rgba(0,255,136,0.06) 100%)',
            border: '1px solid rgba(0,212,255,0.2)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: -60,
              right: -60,
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(0,212,255,0.12) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />
          <h2 className="font-display" style={{ fontSize: 36, fontWeight: 800, color: '#e8f4fd', marginBottom: 16 }}>
            Start Protecting Patients Today
          </h2>
          <p style={{ color: '#a8c8e8', marginBottom: 32, lineHeight: 1.7 }}>
            Join thousands of pharmacies using RxShield AI to verify prescriptions in real time.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('upload')} className="btn-primary" style={{ padding: '13px 28px', borderRadius: 10 }}>
              Upload Your First Prescription
            </button>
            <button onClick={() => navigate('admin')} className="btn-outline" style={{ padding: '13px 28px', borderRadius: 10 }}>
              Admin Portal
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid rgba(0,212,255,0.08)',
          padding: '40px 24px',
          textAlign: 'center',
          color: '#6b8fad',
          fontSize: 13,
        }}
      >
        <div style={{ marginBottom: 8 }}>
          <span className="font-display" style={{ color: '#00d4ff', fontWeight: 700 }}>RxShield AI</span>
          {' '}— AI-powered Prescription Verification
        </div>
        <div>© 2026 RxShield AI. All rights reserved. Not a substitute for professional medical advice.</div>
      </footer>
    </div>
  )
}

function FloatingOrbs() {
  const orbs = [
    { top: '15%', left: '5%', size: 80, color: 'rgba(0,212,255,0.15)', delay: '0s' },
    { top: '70%', left: '8%', size: 50, color: 'rgba(0,255,136,0.12)', delay: '1s' },
    { top: '25%', right: '6%', size: 100, color: 'rgba(0,212,255,0.1)', delay: '2s' },
    { top: '60%', right: '4%', size: 60, color: 'rgba(0,255,136,0.1)', delay: '0.5s' },
  ]
  return (
    <>
      {orbs.map((orb, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: orb.size,
            height: orb.size,
            borderRadius: '50%',
            background: orb.color,
            filter: 'blur(20px)',
            top: orb.top,
            left: (orb as any).left,
            right: (orb as any).right,
            animation: `float 4s ease-in-out ${orb.delay} infinite`,
            pointerEvents: 'none',
          }}
        />
      ))}
    </>
  )
}

const problemCards = [
  {
    icon: '⚠️',
    title: 'Prescription Fraud',
    desc: 'Over 10 million forged prescriptions are dispensed annually. Traditional verification is slow and error-prone.',
    color: '#ff4444',
    iconBg: 'rgba(255,68,68,0.1)',
  },
  {
    icon: '🧠',
    title: 'AI-Powered OCR',
    desc: 'Our deep learning OCR extracts text from handwritten or printed prescriptions with 99.7% accuracy.',
    color: '#00d4ff',
    iconBg: 'rgba(0,212,255,0.1)',
  },
  {
    icon: '🛡️',
    title: 'Tamper Detection',
    desc: 'Signature and layout analysis catch alterations, photocopied seals, and inconsistent formatting.',
    color: '#00ff88',
    iconBg: 'rgba(0,255,136,0.1)',
  },
  {
    icon: '📊',
    title: 'Instant Risk Score',
    desc: 'Each prescription receives a real-time risk score: Valid, Incomplete, or Suspicious — with detailed reasoning.',
    color: '#ffb800',
    iconBg: 'rgba(255,184,0,0.1)',
  },
  {
    icon: '💊',
    title: 'Medicine Database',
    desc: 'Cross-reference against a live database of 40,000+ medicines including controlled substance classifications.',
    color: '#a855f7',
    iconBg: 'rgba(168,85,247,0.1)',
  },
  {
    icon: '🔒',
    title: 'HIPAA Compliant',
    desc: 'End-to-end encryption, zero data retention, and full audit trails keep patient data secure.',
    color: '#00d4ff',
    iconBg: 'rgba(0,212,255,0.1)',
  },
]

const steps = [
  { icon: '📤', label: 'Upload', desc: 'Drag & drop your prescription image or PDF.' },
  { icon: '🔍', label: 'OCR Extract', desc: 'AI reads and structures all text fields instantly.' },
  { icon: '🧬', label: 'AI Analysis', desc: 'Cross-checks signatures, seals, and medicine data.' },
  { icon: '📋', label: 'Risk Report', desc: 'Receive a full report with confidence scores.' },
]
