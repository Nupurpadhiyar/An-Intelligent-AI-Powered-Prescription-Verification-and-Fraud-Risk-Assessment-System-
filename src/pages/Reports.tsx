import { useState } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import type { Page } from '../App'

interface Props {
  navigate: (p: Page) => void
  darkMode: boolean
  setDarkMode: (v: boolean) => void
}

type Risk = 'valid' | 'incomplete' | 'suspicious'

interface Report {
  id: string
  date: string
  doctor: string
  patient: string
  medicines: string
  risk: Risk
  confidence: number
}

const allReports: Report[] = [
  { id: 'RX-10291', date: '2026-07-28', doctor: 'Dr. Sarah Chen', patient: 'Marcus Thompson', medicines: 'Amoxicillin, Ibuprofen, Prednisone', risk: 'valid', confidence: 97.4 },
  { id: 'RX-10290', date: '2026-07-28', doctor: 'Dr. Priya Patel', patient: 'Elena Vasquez', medicines: 'Metformin, Lisinopril', risk: 'incomplete', confidence: 61.8 },
  { id: 'RX-10289', date: '2026-07-27', doctor: 'Dr. J. Morrison', patient: 'Unknown', medicines: 'Oxycodone 80mg', risk: 'suspicious', confidence: 23.1 },
  { id: 'RX-10288', date: '2026-07-27', doctor: 'Dr. James Liu', patient: 'Aisha Okonkwo', medicines: 'Atorvastatin, Metoprolol', risk: 'valid', confidence: 94.2 },
  { id: 'RX-10287', date: '2026-07-26', doctor: 'Dr. Angela Ross', patient: 'David Park', medicines: 'Sertraline 50mg', risk: 'valid', confidence: 91.7 },
  { id: 'RX-10286', date: '2026-07-26', doctor: 'Dr. R. Kapoor', patient: 'Sofia Mendez', medicines: 'Alprazolam 2mg', risk: 'suspicious', confidence: 31.5 },
  { id: 'RX-10285', date: '2026-07-25', doctor: 'Dr. Marcus Webb', patient: 'Hiroshi Tanaka', medicines: 'Levothyroxine', risk: 'valid', confidence: 99.1 },
  { id: 'RX-10284', date: '2026-07-25', doctor: 'Dr. Nina Flores', patient: 'Karen O\'Brien', medicines: 'Hydrocodone', risk: 'incomplete', confidence: 54.3 },
  { id: 'RX-10283', date: '2026-07-24', doctor: 'Dr. Tyler Grant', patient: 'Antoine Dubois', medicines: 'Omeprazole, Pantoprazole', risk: 'valid', confidence: 96.0 },
  { id: 'RX-10282', date: '2026-07-24', doctor: 'Dr. Sarah Chen', patient: 'Yuki Watanabe', medicines: 'Amoxicillin, Prednisone', risk: 'valid', confidence: 98.3 },
]

const riskCfg = {
  valid: { label: 'Valid', color: '#00ff88', bg: 'rgba(0,255,136,0.1)', border: 'rgba(0,255,136,0.25)' },
  incomplete: { label: 'Incomplete', color: '#ffb800', bg: 'rgba(255,184,0,0.1)', border: 'rgba(255,184,0,0.25)' },
  suspicious: { label: 'Suspicious', color: '#ff4444', bg: 'rgba(255,68,68,0.1)', border: 'rgba(255,68,68,0.25)' },
}

export default function Reports({ navigate }: Props) {
  const [search, setSearch] = useState('')
  const [filterRisk, setFilterRisk] = useState<Risk | 'all'>('all')
  const [sortCol, setSortCol] = useState<'date' | 'confidence'>('date')

  const filtered = allReports
    .filter((r) => {
      const q = search.toLowerCase()
      return (
        (filterRisk === 'all' || r.risk === filterRisk) &&
        (r.doctor.toLowerCase().includes(q) ||
          r.patient.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q) ||
          r.medicines.toLowerCase().includes(q))
      )
    })
    .sort((a, b) => sortCol === 'date' ? b.date.localeCompare(a.date) : b.confidence - a.confidence)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#040d1a' }}>
      <Sidebar navigate={navigate} current="reports" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Navbar navigate={navigate} current="reports" />
        <main style={{ flex: 1, padding: '36px 36px', overflowY: 'auto' }}>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h1 className="font-display" style={{ fontSize: 30, fontWeight: 800, color: '#e8f4fd', letterSpacing: '-0.02em', marginBottom: 6 }}>
                Prescription Reports
              </h1>
              <p style={{ color: '#6b8fad', fontSize: 14 }}>
                {filtered.length} record{filtered.length !== 1 ? 's' : ''} found
              </p>
            </div>
            <button
              onClick={() => alert('PDF export initiated')}
              className="btn-outline"
              style={{ padding: '9px 20px', borderRadius: 10, fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}
            >
              ⬇ Download PDF Report
            </button>
          </div>

          {/* Filters */}
          <div className="glass" style={{ borderRadius: 14, padding: '16px 20px', marginBottom: 20, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Search by doctor, patient, medicine..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                flex: 1,
                minWidth: 220,
                padding: '9px 14px',
                borderRadius: 9,
                background: 'rgba(0,212,255,0.05)',
                border: '1px solid rgba(0,212,255,0.15)',
                color: '#e8f4fd',
                fontSize: 14,
                outline: 'none',
              }}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              {(['all', 'valid', 'incomplete', 'suspicious'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setFilterRisk(r)}
                  style={{
                    padding: '7px 14px',
                    borderRadius: 8,
                    border: `1px solid ${filterRisk === r ? (r === 'all' ? 'rgba(0,212,255,0.4)' : riskCfg[r]?.border || 'rgba(0,212,255,0.4)') : 'rgba(0,212,255,0.1)'}`,
                    background: filterRisk === r ? (r === 'all' ? 'rgba(0,212,255,0.1)' : riskCfg[r]?.bg || 'rgba(0,212,255,0.1)') : 'transparent',
                    color: filterRisk === r ? (r === 'all' ? '#00d4ff' : riskCfg[r]?.color || '#00d4ff') : '#6b8fad',
                    fontSize: 13,
                    cursor: 'pointer',
                    fontWeight: filterRisk === r ? 600 : 400,
                    transition: 'all 0.2s',
                    textTransform: 'capitalize',
                  }}
                >
                  {r === 'all' ? 'All' : r}
                </button>
              ))}
            </div>
            <select
              value={sortCol}
              onChange={(e) => setSortCol(e.target.value as 'date' | 'confidence')}
              style={{
                padding: '8px 14px',
                borderRadius: 9,
                background: 'rgba(0,212,255,0.05)',
                border: '1px solid rgba(0,212,255,0.15)',
                color: '#a8c8e8',
                fontSize: 13,
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="date">Sort: Date</option>
              <option value="confidence">Sort: Confidence</option>
            </select>
          </div>

          {/* Table */}
          <div className="glass" style={{ borderRadius: 14, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(0,212,255,0.1)' }}>
                  {['RX ID', 'Date', 'Doctor', 'Patient', 'Medicines', 'Confidence', 'Status', ''].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: '14px 16px',
                        textAlign: 'left',
                        fontSize: 11,
                        fontWeight: 600,
                        color: '#6b8fad',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        whiteSpace: 'nowrap',
                      }}
                      className="font-mono"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => {
                  const cfg = riskCfg[r.risk]
                  return (
                    <tr
                      key={r.id}
                      style={{
                        borderBottom: i < filtered.length - 1 ? '1px solid rgba(0,212,255,0.06)' : 'none',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0,212,255,0.03)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '14px 16px' }}>
                        <span className="font-mono" style={{ fontSize: 13, color: '#00d4ff' }}>{r.id}</span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span className="font-mono" style={{ fontSize: 13, color: '#a8c8e8' }}>{r.date}</span>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 14, color: '#e8f4fd' }}>{r.doctor}</td>
                      <td style={{ padding: '14px 16px', fontSize: 14, color: '#a8c8e8' }}>{r.patient}</td>
                      <td style={{ padding: '14px 16px', maxWidth: 200 }}>
                        <span style={{ fontSize: 13, color: '#6b8fad', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
                          {r.medicines}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div
                            style={{
                              width: 60,
                              height: 4,
                              borderRadius: 999,
                              background: 'rgba(0,212,255,0.1)',
                              overflow: 'hidden',
                            }}
                          >
                            <div
                              style={{
                                height: '100%',
                                width: `${r.confidence}%`,
                                background: cfg.color,
                                borderRadius: 999,
                              }}
                            />
                          </div>
                          <span className="font-mono" style={{ fontSize: 12, color: cfg.color }}>{r.confidence}%</span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span
                          style={{
                            padding: '4px 10px',
                            borderRadius: 6,
                            background: cfg.bg,
                            border: `1px solid ${cfg.border}`,
                            color: cfg.color,
                            fontSize: 12,
                            fontWeight: 600,
                            textTransform: 'capitalize',
                          }}
                        >
                          {cfg.label}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <button
                          onClick={() => navigate('dashboard')}
                          style={{
                            background: 'none',
                            border: '1px solid rgba(0,212,255,0.2)',
                            borderRadius: 6,
                            color: '#00d4ff',
                            fontSize: 12,
                            padding: '5px 12px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,212,255,0.1)' }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'none' }}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px', color: '#6b8fad' }}>
                No records match your filters.
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
