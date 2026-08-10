import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import type { Page } from '../App'

interface Props {
  navigate: (p: Page) => void
  darkMode: boolean
  setDarkMode: (v: boolean) => void
}

type Risk = 'valid' | 'incomplete' | 'suspicious'

interface RxData {
  doctor: string
  patient: string
  date: string
  medicines: { name: string; dosage: string; qty: string; risk?: string }[]
  hospital: string
  licenseNo: string
  signature: boolean
  risk: Risk
  confidence: number
  riskReasons: string[]
}

const sampleRx: RxData = {
  doctor: 'Dr. Sarah Chen, MD',
  patient: 'Marcus Thompson',
  date: '2026-07-28',
  hospital: 'Northridge Medical Center',
  licenseNo: 'CA-MED-4821',
  signature: true,
  risk: 'valid',
  confidence: 97.4,
  riskReasons: [],
  medicines: [
    { name: 'Amoxicillin', dosage: '500mg', qty: '21 capsules' },
    { name: 'Ibuprofen', dosage: '400mg', qty: '30 tablets' },
    { name: 'Prednisone', dosage: '20mg', qty: '7 tablets', risk: 'moderate' },
  ],
}

const suspiciousRx: RxData = {
  doctor: 'Dr. J. Morrison',
  patient: 'Unknown Patient',
  date: '2026-06-01',
  hospital: '—',
  licenseNo: 'UNVERIFIED',
  signature: false,
  risk: 'suspicious',
  confidence: 23.1,
  riskReasons: [
    'No hospital letterhead detected',
    'Doctor license number not found in registry',
    'Missing patient information',
    'Signature field blank',
    'Oxycodone — Schedule II controlled substance',
  ],
  medicines: [
    { name: 'Oxycodone', dosage: '80mg', qty: '120 tablets', risk: 'high' },
  ],
}

const incompleteRx: RxData = {
  doctor: 'Dr. Priya Patel',
  patient: 'Elena Vasquez',
  date: '2026-07-15',
  hospital: 'Suncoast Clinic',
  licenseNo: 'FL-MED-7732',
  signature: false,
  risk: 'incomplete',
  confidence: 61.8,
  riskReasons: [
    'Missing doctor signature',
    'Dosage frequency not specified for Metformin',
  ],
  medicines: [
    { name: 'Metformin', dosage: '1000mg', qty: '60 tablets' },
    { name: 'Lisinopril', dosage: '10mg', qty: '30 tablets' },
  ],
}

const samples = [sampleRx, incompleteRx, suspiciousRx]
const sampleLabels = ['Prescription #A-10291', 'Prescription #A-10290', 'Prescription #A-10289']

const riskConfig = {
  valid: { label: '✅ Valid Prescription', color: '#00ff88', bg: 'rgba(0,255,136,0.08)', border: 'rgba(0,255,136,0.25)', glow: 'glow-green' },
  incomplete: { label: '⚠️ Incomplete Prescription', color: '#ffb800', bg: 'rgba(255,184,0,0.08)', border: 'rgba(255,184,0,0.25)', glow: 'glow-yellow' },
  suspicious: { label: '🚨 Suspicious Prescription', color: '#ff4444', bg: 'rgba(255,68,68,0.08)', border: 'rgba(255,68,68,0.25)', glow: 'glow-red' },
}

export default function Dashboard({ navigate }: Props) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#040d1a' }}>
      <Sidebar navigate={navigate} current="dashboard" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Navbar navigate={navigate} current="dashboard" />
        <main style={{ flex: 1, padding: '36px 36px', overflowY: 'auto' }}>

          {/* Top stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 32 }}>
            {statsCards.map((s) => (
              <div key={s.label} className="glass card-hover" style={{ borderRadius: 14, padding: '20px 20px' }}>
                <div className="font-mono" style={{ fontSize: 11, color: '#6b8fad', letterSpacing: '0.08em', marginBottom: 10, textTransform: 'uppercase' }}>
                  {s.label}
                </div>
                <div className="font-display" style={{ fontSize: 28, fontWeight: 800, color: s.color }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 12, color: '#6b8fad', marginTop: 4 }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Sample prescriptions */}
          <h2 className="font-display" style={{ fontSize: 20, fontWeight: 700, color: '#e8f4fd', marginBottom: 20, letterSpacing: '-0.01em' }}>
            Recent Analyses
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {samples.map((rx, i) => (
              <RxCard key={i} rx={rx} label={sampleLabels[i]} navigate={navigate} />
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}

function RxCard({ rx, label, navigate }: { rx: RxData; label: string; navigate: (p: Page) => void }) {
  const cfg = riskConfig[rx.risk]
  return (
    <div
      className="glass card-hover"
      style={{
        borderRadius: 16,
        padding: '24px 28px',
        border: `1px solid ${cfg.border}`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top accent */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: `linear-gradient(90deg, ${cfg.color}, transparent)`,
        }}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 24, alignItems: 'start' }}>
        {/* Left: prescription details */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
            <span className="font-mono" style={{ fontSize: 12, color: '#6b8fad' }}>{label}</span>
            <span
              style={{
                padding: '3px 10px',
                borderRadius: 6,
                background: cfg.bg,
                border: `1px solid ${cfg.border}`,
                color: cfg.color,
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {cfg.label}
            </span>
            <span className="font-mono" style={{ fontSize: 11, color: '#6b8fad' }}>
              Confidence: <span style={{ color: cfg.color }}>{rx.confidence}%</span>
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px 24px', marginBottom: 20 }}>
            {[
              { label: 'Doctor', value: rx.doctor },
              { label: 'Patient', value: rx.patient },
              { label: 'Date', value: rx.date },
              { label: 'Hospital', value: rx.hospital },
              { label: 'License No.', value: rx.licenseNo },
              { label: 'Signature', value: rx.signature ? '✓ Present' : '✗ Missing' },
            ].map((f) => (
              <div key={f.label}>
                <div className="font-mono" style={{ fontSize: 10, color: '#6b8fad', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 2 }}>
                  {f.label}
                </div>
                <div
                  style={{
                    fontSize: 14,
                    color: f.label === 'Signature'
                      ? (rx.signature ? '#00ff88' : '#ff4444')
                      : '#e8f4fd',
                    fontWeight: 500,
                  }}
                >
                  {f.value}
                </div>
              </div>
            ))}
          </div>

          {/* Medicines */}
          <div>
            <div className="font-mono" style={{ fontSize: 10, color: '#6b8fad', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>
              Prescribed Medicines
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {rx.medicines.map((m) => (
                <div
                  key={m.name}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 8,
                    background: m.risk === 'high' ? 'rgba(255,68,68,0.1)' : m.risk === 'moderate' ? 'rgba(255,184,0,0.08)' : 'rgba(0,212,255,0.06)',
                    border: `1px solid ${m.risk === 'high' ? 'rgba(255,68,68,0.3)' : m.risk === 'moderate' ? 'rgba(255,184,0,0.25)' : 'rgba(0,212,255,0.12)'}`,
                    fontSize: 13,
                  }}
                >
                  <span style={{ color: '#e8f4fd', fontWeight: 500 }}>{m.name}</span>
                  <span style={{ color: '#6b8fad', marginLeft: 6 }}>{m.dosage} · {m.qty}</span>
                  {m.risk === 'high' && (
                    <span style={{ color: '#ff4444', marginLeft: 6, fontSize: 11, fontWeight: 600 }}>⚠ Controlled</span>
                  )}
                  {m.risk === 'moderate' && (
                    <span style={{ color: '#ffb800', marginLeft: 6, fontSize: 11, fontWeight: 600 }}>⚠ Caution</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Risk reasons */}
          {rx.riskReasons.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <div className="font-mono" style={{ fontSize: 10, color: '#ff4444', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
                Risk Factors Detected
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
                {rx.riskReasons.map((r) => (
                  <li key={r} style={{ fontSize: 13, color: '#a8c8e8', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: '#ff4444', fontSize: 10 }}>●</span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right: confidence gauge */}
        <div style={{ textAlign: 'center', flexShrink: 0 }}>
          <ConfidenceGauge value={rx.confidence} color={cfg.color} />
          <button
            onClick={() => navigate('reports')}
            className="btn-outline"
            style={{ marginTop: 14, padding: '7px 16px', borderRadius: 8, fontSize: 12, display: 'block', width: '100%' }}
          >
            Full Report
          </button>
        </div>
      </div>
    </div>
  )
}

function ConfidenceGauge({ value, color }: { value: number; color: string }) {
  const r = 36
  const circ = 2 * Math.PI * r
  const fill = (value / 100) * circ
  return (
    <div style={{ position: 'relative', width: 100, height: 100, margin: '0 auto' }}>
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(0,212,255,0.1)" strokeWidth="6" />
        <circle
          cx="50" cy="50" r={r}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeDasharray={`${fill} ${circ - fill}`}
          strokeDashoffset={circ / 4}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px ${color}80)` }}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span className="font-display" style={{ fontSize: 18, fontWeight: 800, color }}>{value}%</span>
        <span style={{ fontSize: 9, color: '#6b8fad', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI Score</span>
      </div>
    </div>
  )
}

const statsCards = [
  { label: 'Total Verified', value: '2,847', color: '#00d4ff', sub: 'All time' },
  { label: 'Valid', value: '2,341', color: '#00ff88', sub: '82.3%' },
  { label: 'Incomplete', value: '312', color: '#ffb800', sub: '11.0%' },
  { label: 'Suspicious', value: '194', color: '#ff4444', sub: '6.7%' },
  { label: "Today's Uploads", value: '47', color: '#00d4ff', sub: 'Last 24h' },
]
