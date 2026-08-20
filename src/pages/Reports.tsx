import { useState } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import AnalyticsCharts from '../components/AnalyticsCharts'
import AuditCertificateModal from '../components/AuditCertificateModal'
import { usePrescriptions } from '../context/PrescriptionContext'
import { samplePrescriptions } from '../data/samplePrescriptions'
import type { Page } from '../App'
import type { RiskLevel, AuditReportSummary, PrescriptionData } from '../types/prescription'

interface Props {
  navigate: (p: Page) => void
  darkMode: boolean
  setDarkMode: (v: boolean) => void
}

export default function Reports({ navigate }: Props) {
  const { auditHistory, deleteReport, setActiveRx } = usePrescriptions()
  const [search, setSearch] = useState('')
  const [filterRisk, setFilterRisk] = useState<RiskLevel | 'all'>('all')
  const [sortCol, setSortCol] = useState<'date' | 'confidence' | 'riskScore'>('date')
  const [showCharts, setShowCharts] = useState(true)
  const [selectedRxForCert, setSelectedRxForCert] = useState<PrescriptionData | null>(null)

  const filtered = auditHistory
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
    .sort((a, b) => {
      if (sortCol === 'date') return b.date.localeCompare(a.date)
      if (sortCol === 'confidence') return b.confidence - a.confidence
      return b.riskScore - a.riskScore
    })

  const exportCSV = () => {
    const headers = ['ID', 'Date', 'Doctor', 'Patient', 'Medicines', 'Risk Status', 'AI Confidence', 'Safety Score', 'Status']
    const rows = filtered.map((r) => [
      r.id,
      r.date,
      `"${r.doctor}"`,
      `"${r.patient}"`,
      `"${r.medicines}"`,
      r.risk.toUpperCase(),
      `${r.confidence}%`,
      `${r.riskScore}/100`,
      r.status,
    ])
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `RxShield_Audit_Reports_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleOpenReportInDashboard = (item: AuditReportSummary) => {
    const matchingPreset = samplePrescriptions.find((p) => p.id === item.id)
    if (matchingPreset) {
      setActiveRx(matchingPreset)
    } else {
      // Construct fallback rx data
      const fallbackRx: PrescriptionData = {
        ...samplePrescriptions[0],
        id: item.id,
        prescriptionNumber: item.prescriptionNumber,
        date: item.date,
        risk: item.risk,
        overallConfidence: item.confidence,
        riskScore: item.riskScore,
      }
      setActiveRx(fallbackRx)
    }
    navigate('dashboard')
  }

  const handleQuickPreviewCertificate = (item: AuditReportSummary) => {
    const matchingPreset = samplePrescriptions.find((p) => p.id === item.id) || samplePrescriptions[0]
    setSelectedRxForCert({
      ...matchingPreset,
      id: item.id,
      prescriptionNumber: item.prescriptionNumber,
      date: item.date,
      risk: item.risk,
      overallConfidence: item.confidence,
      riskScore: item.riskScore,
    })
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#040d1a' }}>
      <Sidebar navigate={navigate} current="reports" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Navbar navigate={navigate} current="reports" />
        <main style={{ flex: 1, padding: '36px 36px', overflowY: 'auto' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>

            {/* Header & Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
              <div>
                <h1 className="font-display" style={{ fontSize: 28, fontWeight: 800, color: '#e8f4fd', letterSpacing: '-0.02em', margin: '0 0 6px 0' }}>
                  Prescription Forensic Audit History & Analytics
                </h1>
                <p style={{ color: '#6b8fad', fontSize: 14, margin: 0 }}>
                  Permanent cryptographic log of scanned prescriptions, compliance verification scores, and fraud alerts.
                </p>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => setShowCharts(!showCharts)}
                  className="btn-outline"
                  style={{ padding: '8px 14px', borderRadius: 8, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <span>{showCharts ? '📊 Hide Analytics' : '📊 Show Analytics'}</span>
                </button>
                <button
                  onClick={exportCSV}
                  className="btn-primary"
                  style={{ padding: '8px 16px', borderRadius: 8, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <span>📥 Export CSV Log</span>
                </button>
              </div>
            </div>

            {/* Visual Analytics KPI & Trends Section */}
            {showCharts && <AnalyticsCharts reports={auditHistory} />}

            {/* Search and Filters Bar */}
            <div
              className="glass"
              style={{
                borderRadius: 14,
                padding: '16px 20px',
                marginBottom: 20,
                display: 'flex',
                gap: 16,
                alignItems: 'center',
                flexWrap: 'wrap',
                background: '#071428',
                border: '1px solid rgba(0,212,255,0.15)',
              }}
            >
              {/* Search input */}
              <div style={{ flex: '1 1 240px', position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Search by Doctor, Patient, Rx ID, or Medication..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(0,212,255,0.2)',
                    borderRadius: 8,
                    padding: '8px 14px',
                    color: '#e8f4fd',
                    fontSize: 13,
                    outline: 'none',
                  }}
                />
              </div>

              {/* Risk Filter Buttons */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {(['all', 'valid', 'incomplete', 'suspicious'] as const).map((r) => {
                  const active = filterRisk === r
                  const label = r.charAt(0).toUpperCase() + r.slice(1)
                  return (
                    <button
                      key={r}
                      onClick={() => setFilterRisk(r)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 6,
                        border: `1px solid ${active ? '#00d4ff' : 'rgba(255,255,255,0.1)'}`,
                        background: active ? 'rgba(0,212,255,0.15)' : 'transparent',
                        color: active ? '#00d4ff' : '#8bb0ce',
                        fontSize: 12,
                        fontWeight: active ? 700 : 500,
                        cursor: 'pointer',
                      }}
                    >
                      {label}
                    </button>
                  )
                })}
              </div>

              {/* Sort selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 12, color: '#6b8fad' }}>Sort:</span>
                <select
                  value={sortCol}
                  onChange={(e) => setSortCol(e.target.value as any)}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(0,212,255,0.2)',
                    color: '#e8f4fd',
                    padding: '6px 10px',
                    borderRadius: 6,
                    fontSize: 12,
                  }}
                >
                  <option value="date" style={{ background: '#071428' }}>Most Recent Date</option>
                  <option value="confidence" style={{ background: '#071428' }}>Highest Confidence</option>
                  <option value="riskScore" style={{ background: '#071428' }}>Highest Safety Score</option>
                </select>
              </div>
            </div>

            {/* Audit Table */}
            <div
              className="glass"
              style={{
                borderRadius: 16,
                overflow: 'hidden',
                border: '1px solid rgba(0,212,255,0.15)',
                background: '#071428',
              }}
            >
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: 'rgba(0,212,255,0.05)', borderBottom: '1px solid rgba(0,212,255,0.15)', color: '#6b8fad' }}>
                      <th style={{ padding: '12px 16px' }}>Rx ID / Date</th>
                      <th style={{ padding: '12px 16px' }}>Prescribing Physician</th>
                      <th style={{ padding: '12px 16px' }}>Patient Name</th>
                      <th style={{ padding: '12px 16px' }}>Extracted Medication Orders</th>
                      <th style={{ padding: '12px 16px' }}>Risk Verdict</th>
                      <th style={{ padding: '12px 16px' }}>Safety Score</th>
                      <th style={{ padding: '12px 16px' }}>Status</th>
                      <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={8} style={{ padding: 40, textAlign: 'center', color: '#6b8fad' }}>
                          No audit records found matching your query.
                        </td>
                      </tr>
                    ) : (
                      filtered.map((item) => {
                        const isSuspicious = item.risk === 'suspicious'
                        const isIncomplete = item.risk === 'incomplete'
                        const verdictColor = isSuspicious ? '#ff4444' : isIncomplete ? '#ffb800' : '#00ff88'

                        return (
                          <tr
                            key={item.id}
                            style={{
                              borderBottom: '1px solid rgba(255,255,255,0.05)',
                              transition: 'background 0.15s',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0,212,255,0.03)')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                          >
                            <td style={{ padding: '12px 16px' }}>
                              <div style={{ fontWeight: 700, color: '#00d4ff', fontFamily: 'monospace' }}>{item.id}</div>
                              <div style={{ fontSize: 11, color: '#6b8fad' }}>{item.date}</div>
                            </td>
                            <td style={{ padding: '12px 16px', color: '#e8f4fd', fontWeight: 600 }}>{item.doctor}</td>
                            <td style={{ padding: '12px 16px', color: '#cbd5e1' }}>{item.patient}</td>
                            <td style={{ padding: '12px 16px', color: '#8bb0ce', maxWidth: 260 }}>
                              <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {item.medicines}
                              </div>
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <span
                                style={{
                                  fontSize: 11,
                                  fontWeight: 700,
                                  padding: '3px 8px',
                                  borderRadius: 6,
                                  background: `${verdictColor}15`,
                                  border: `1px solid ${verdictColor}40`,
                                  color: verdictColor,
                                  textTransform: 'uppercase',
                                }}
                              >
                                {item.risk}
                              </span>
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <div style={{ fontWeight: 700, color: verdictColor }}>{item.riskScore}/100</div>
                              <div style={{ fontSize: 10, color: '#6b8fad' }}>{item.confidence}% conf</div>
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <span
                                style={{
                                  fontSize: 11,
                                  color: item.status === 'verified_dispensed' ? '#00ff88' : item.status === 'rejected' ? '#ff4444' : '#ffb800',
                                  fontWeight: 600,
                                }}
                              >
                                {item.status.replace('_', ' ').toUpperCase()}
                              </span>
                            </td>
                            <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                              <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                                <button
                                  onClick={() => handleOpenReportInDashboard(item)}
                                  style={{
                                    background: 'rgba(0,212,255,0.1)',
                                    border: '1px solid rgba(0,212,255,0.3)',
                                    color: '#00d4ff',
                                    padding: '4px 10px',
                                    borderRadius: 6,
                                    fontSize: 12,
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                  }}
                                  title="Open in Verification Dashboard"
                                >
                                  Inspect
                                </button>
                                <button
                                  onClick={() => handleQuickPreviewCertificate(item)}
                                  style={{
                                    background: 'rgba(255,255,255,0.06)',
                                    border: '1px solid rgba(255,255,255,0.15)',
                                    color: '#e8f4fd',
                                    padding: '4px 8px',
                                    borderRadius: 6,
                                    fontSize: 12,
                                    cursor: 'pointer',
                                  }}
                                  title="View Certificate"
                                >
                                  📜
                                </button>
                                <button
                                  onClick={() => deleteReport(item.id)}
                                  style={{
                                    background: 'rgba(255,68,68,0.08)',
                                    border: '1px solid rgba(255,68,68,0.25)',
                                    color: '#ff4444',
                                    padding: '4px 8px',
                                    borderRadius: 6,
                                    fontSize: 12,
                                    cursor: 'pointer',
                                  }}
                                  title="Delete record"
                                >
                                  🗑️
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* Quick Certificate Modal Preview */}
      {selectedRxForCert && (
        <AuditCertificateModal
          isOpen={true}
          onClose={() => setSelectedRxForCert(null)}
          rxData={selectedRxForCert}
        />
      )}
    </div>
  )
}
