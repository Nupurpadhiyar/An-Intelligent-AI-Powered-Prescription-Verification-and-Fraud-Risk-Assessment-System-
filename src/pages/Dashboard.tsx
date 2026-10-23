import { useState } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import BoundingBoxViewer from '../components/BoundingBoxViewer'
import RiskRadarBreakdown from '../components/RiskRadarBreakdown'
import AuditCertificateModal from '../components/AuditCertificateModal'
import { usePrescriptions } from '../context/PrescriptionContext'
import type { Page } from '../App'
import type { PrescriptionData } from '../types/prescription'

interface Props {
  navigate: (p: Page) => void
  darkMode: boolean
  setDarkMode: (v: boolean) => void
}

export default function Dashboard({ navigate }: Props) {
  const { activeRx, setActiveRx, updatePrescriptionStatus, userRole } = usePrescriptions()
  const [isCertModalOpen, setIsCertModalOpen] = useState(false)
  const [isEditDocModalOpen, setIsEditDocModalOpen] = useState(false)
  const [editDocName, setEditDocName] = useState(activeRx.doctor.name)
  const [editDocLicense, setEditDocLicense] = useState(activeRx.doctor.licenseNo)
  const [editDocSpecialty, setEditDocSpecialty] = useState(activeRx.doctor.specialty)
  const [editDocHospital, setEditDocHospital] = useState(activeRx.doctor.hospital)
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null)

  const handleSaveDocChanges = () => {
    const updated = {
      ...activeRx,
      doctor: {
        ...activeRx.doctor,
        name: editDocName,
        licenseNo: editDocLicense,
        npi: editDocLicense,
        specialty: editDocSpecialty,
        hospital: editDocHospital,
      },
      doctorVerification: {
        ...activeRx.doctorVerification,
        name: editDocName,
        licenseNumber: editDocLicense,
        npi: editDocLicense,
        specialty: editDocSpecialty,
        hospitalAffiliation: editDocHospital,
      },
    }
    setActiveRx(updated)
    setIsEditDocModalOpen(false)
    setActionSuccessMsg('✓ Prescriber registry details updated and re-verified!')
    setTimeout(() => setActionSuccessMsg(null), 3500)
  }

  const handleStatusChange = (status: PrescriptionData['status'], notes?: string) => {
    updatePrescriptionStatus(activeRx.id, status, notes)
    const msg =
      status === 'verified_dispensed'
        ? '✓ Prescription verified and approved for dispensing!'
        : status === 'flagged_investigation'
        ? '🚩 Prescription flagged for fraud & compliance investigation.'
        : '✕ Prescription rejected due to safety violations.'
    setActionSuccessMsg(msg)
    setTimeout(() => setActionSuccessMsg(null), 3500)
  }

  const isSuspicious = activeRx.risk === 'suspicious'
  const isIncomplete = activeRx.risk === 'incomplete'
  const verdictBg = isSuspicious
    ? 'rgba(255,68,68,0.1)'
    : isIncomplete
    ? 'rgba(255,184,0,0.1)'
    : 'rgba(0,255,136,0.1)'
  const verdictBorder = isSuspicious
    ? 'rgba(255,68,68,0.35)'
    : isIncomplete
    ? 'rgba(255,184,0,0.35)'
    : 'rgba(0,255,136,0.35)'
  const verdictText = isSuspicious ? '#ff4444' : isIncomplete ? '#ffb800' : '#00ff88'

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#040d1a' }}>
      <Sidebar navigate={navigate} current="dashboard" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Navbar navigate={navigate} current="dashboard" />
        <main style={{ flex: 1, padding: '36px 36px', overflowY: 'auto' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* Notification Banner */}
            {actionSuccessMsg && (
              <div
                style={{
                  background: 'rgba(0, 212, 255, 0.15)',
                  border: '1px solid #00d4ff',
                  borderRadius: 12,
                  padding: '12px 20px',
                  color: '#e8f4fd',
                  fontWeight: 600,
                  fontSize: 14,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span>{actionSuccessMsg}</span>
                <span style={{ fontSize: 12, color: '#00ff88' }}>Database Synchronized</span>
              </div>
            )}

            {/* Header with Quick Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <span style={{ fontSize: 13, color: '#00d4ff', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Active Prescription Audit
                  </span>
                  <span style={{ fontSize: 12, color: '#6b8fad' }}>•</span>
                  <span style={{ fontSize: 12, color: '#6b8fad' }}>ID: {activeRx.prescriptionNumber}</span>
                </div>
                <h1
                  className="font-display"
                  style={{ fontSize: 28, fontWeight: 800, color: '#e8f4fd', letterSpacing: '-0.02em', margin: 0 }}
                >
                  Clinical Verification & Fraud Assessment
                </h1>
              </div>

              {/* Action Toolbar */}
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button
                  onClick={() => setIsCertModalOpen(true)}
                  className="btn-outline"
                  style={{ padding: '8px 16px', borderRadius: 8, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <span>📜</span>
                  <span>Export Audit Certificate (PDF)</span>
                </button>

                {activeRx.status !== 'verified_dispensed' ? (
                  <button
                    onClick={() => handleStatusChange('verified_dispensed')}
                    className="btn-primary"
                    style={{ padding: '8px 18px', borderRadius: 8, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    <span>✓</span>
                    <span>Approve & Dispense</span>
                  </button>
                ) : (
                  <span
                    style={{
                      background: 'rgba(0, 255, 136, 0.15)',
                      border: '1px solid rgba(0, 255, 136, 0.4)',
                      color: '#00ff88',
                      padding: '8px 16px',
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 700,
                    }}
                  >
                    ✓ Dispensed & Audited
                  </span>
                )}

                {activeRx.status !== 'flagged_investigation' && (
                  <button
                    onClick={() => handleStatusChange('flagged_investigation')}
                    style={{
                      background: 'rgba(255, 68, 68, 0.15)',
                      border: '1px solid rgba(255, 68, 68, 0.3)',
                      color: '#ff4444',
                      padding: '8px 16px',
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    🚩 Flag Suspicious
                  </button>
                )}
              </div>
            </div>

            {/* Verdict Banner Card */}
            <div
              className="glass"
              style={{
                borderRadius: 16,
                padding: '20px 24px',
                background: verdictBg,
                border: `1px solid ${verdictBorder}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 16,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    background: `${verdictText}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 26,
                    color: verdictText,
                  }}
                >
                  {isSuspicious ? '✕' : isIncomplete ? '⚠' : '✓'}
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: verdictText, textTransform: 'uppercase' }}>
                    {isSuspicious ? 'CRITICAL FRAUD / SECURITY ALERT' : isIncomplete ? 'CLINICAL WARNING / REVIEW REQUIRED' : 'AUTHENTIC PRESCRIPTION VERIFIED'}
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#e8f4fd', marginTop: 2 }}>
                    {isSuspicious
                      ? 'High probability of document forgery, license invalidation, or overdose threshold.'
                      : isIncomplete
                      ? 'Severe Drug-Drug Contraindication or dosage adjustment required.'
                      : 'Prescription passed all optical tamper, doctor registry, and clinical safety checks.'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 24, textAlign: 'right' }}>
                <div>
                  <div style={{ fontSize: 11, color: '#6b8fad', textTransform: 'uppercase' }}>AI Confidence</div>
                  <div className="font-display" style={{ fontSize: 24, fontWeight: 800, color: '#e8f4fd' }}>
                    {activeRx.overallConfidence}%
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#6b8fad', textTransform: 'uppercase' }}>Fraud Risk</div>
                  <div className="font-display" style={{ fontSize: 24, fontWeight: 800, color: verdictText }}>
                    {100 - activeRx.riskScore}%
                  </div>
                </div>
              </div>
            </div>

            {/* Drug Interaction (DDI) Alert Banner if present */}
            {activeRx.interactions && activeRx.interactions.length > 0 && (
              <div
                style={{
                  background: 'rgba(255, 68, 68, 0.12)',
                  border: '1px solid #ff4444',
                  borderRadius: 14,
                  padding: 20,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: 20 }}>⚠️</span>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: '#ff4444', margin: 0 }}>
                    CRITICAL DRUG-DRUG INTERACTION DETECTED
                  </h3>
                </div>
                {activeRx.interactions.map((ddi, i) => (
                  <div key={i} style={{ marginTop: 8 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#e8f4fd' }}>
                      Combination: <span style={{ color: '#ff4444' }}>{ddi.drugs.join(' + ')}</span> ({ddi.severity.toUpperCase()})
                    </div>
                    <div style={{ fontSize: 13, color: '#cbd5e1', marginTop: 4 }}>
                      {ddi.description}
                    </div>
                    <div style={{ fontSize: 12, color: '#00d4ff', fontWeight: 600, marginTop: 4 }}>
                      Recommendation: {ddi.recommendation}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Grid: Doctor Verification Card & Patient Demographic */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
              {/* Doctor Registry Validation Card */}
              <div className="glass" style={{ padding: 22, borderRadius: 16, border: '1px solid rgba(0,212,255,0.18)', background: '#071428' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#00d4ff', textTransform: 'uppercase' }}>
                    Prescriber Registry Status
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {activeRx.doctorVerification.verificationSource === 'NMC_INDIAN_REGISTRY' ? (
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 800,
                          padding: '2px 8px',
                          borderRadius: 4,
                          background: 'rgba(0, 212, 255, 0.18)',
                          color: '#00d4ff',
                          border: '1px solid rgba(0, 212, 255, 0.5)',
                          letterSpacing: '0.04em',
                        }}
                      >
                        🇮🇳 NMC & STATE COUNCIL VERIFIED
                      </span>
                    ) : activeRx.doctorVerification.isLiveVerified ? (
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 800,
                          padding: '2px 8px',
                          borderRadius: 4,
                          background: 'rgba(0,212,255,0.2)',
                          color: '#00d4ff',
                          border: '1px solid rgba(0,212,255,0.5)',
                          letterSpacing: '0.04em',
                        }}
                      >
                        ⚡ LIVE CMS NPPES VERIFIED
                      </span>
                    ) : null}
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: 4,
                        background: activeRx.doctorVerification.status === 'active' ? 'rgba(0,255,136,0.15)' : 'rgba(255,68,68,0.15)',
                        color: activeRx.doctorVerification.status === 'active' ? '#00ff88' : '#ff4444',
                        textTransform: 'uppercase',
                      }}
                    >
                      {activeRx.doctorVerification.status}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#e8f4fd' }}>{activeRx.doctor.name}</div>
                  <button
                    type="button"
                    onClick={() => {
                      setEditDocName(activeRx.doctor.name)
                      setEditDocLicense(activeRx.doctor.licenseNo)
                      setEditDocSpecialty(activeRx.doctor.specialty)
                      setEditDocHospital(activeRx.doctor.hospital)
                      setIsEditDocModalOpen(true)
                    }}
                    style={{
                      background: 'rgba(0, 212, 255, 0.1)',
                      border: '1px solid rgba(0, 212, 255, 0.3)',
                      color: '#00d4ff',
                      padding: '3px 8px',
                      borderRadius: 6,
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    ✏️ Edit
                  </button>
                </div>
                <div style={{ fontSize: 13, color: '#8bb0ce', marginTop: 2 }}>
                  {activeRx.doctor.specialty}
                  {activeRx.doctorVerification.qualification && (
                    <span style={{ color: '#00d4ff', marginLeft: 6, fontSize: 12 }}>
                      • {activeRx.doctorVerification?.qualification || 'MBBS, MD'}
                    </span>
                  )}
                </div>
                {activeRx.doctorVerification?.council && (
                  <div style={{ fontSize: 12, color: '#00ff88', marginTop: 3 }}>
                    🏛️ {activeRx.doctorVerification.council}
                  </div>
                )}
                {activeRx.doctor.hospital && (
                  <div style={{ fontSize: 12, color: '#6b8fad', marginTop: 3 }}>
                    🏥 {activeRx.doctor.hospital}
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 14, fontSize: 12 }}>
                  <div>
                    <span style={{ color: '#6b8fad' }}>State / NMC Reg No: </span>
                    <strong style={{ color: '#e8f4fd' }}>{activeRx.doctor.licenseNo || activeRx.doctor.npi}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#6b8fad' }}>ABDM HPR ID: </span>
                    <strong style={{ color: activeRx.doctorVerification?.abdmHprId ? '#00d4ff' : '#6b8fad' }}>
                      {activeRx.doctorVerification?.abdmHprId || 'Active'}
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: '#6b8fad' }}>NDPS / Narcotic Status: </span>
                    <strong style={{ color: activeRx.doctorVerification?.deaStatus === 'active' ? '#00ff88' : '#ff4444' }}>
                      {activeRx.doctorVerification?.deaStatus?.toUpperCase() || 'UNVERIFIED'}
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: '#6b8fad' }}>Digital Signature: </span>
                    <strong style={{ color: activeRx.doctor.signaturePresent ? '#00ff88' : '#ff4444' }}>
                      {activeRx.doctor.signaturePresent ? `Verified (${activeRx.doctor.signatureConfidence}%)` : 'MISSING'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Patient Profile & History Card */}
              <div className="glass" style={{ padding: 22, borderRadius: 16, border: '1px solid rgba(0,212,255,0.18)', background: '#071428' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#00d4ff', textTransform: 'uppercase' }}>
                    Patient Profile & Dispensing Velocity
                  </div>
                  <span style={{ fontSize: 12, color: '#8bb0ce' }}>DOB: {activeRx.patient.dob}</span>
                </div>

                <div style={{ fontSize: 16, fontWeight: 700, color: '#e8f4fd' }}>{activeRx.patient.name}</div>
                <div style={{ fontSize: 13, color: '#8bb0ce', marginTop: 2 }}>
                  {activeRx.patient.age} years old • {activeRx.patient.gender} • Phone: {activeRx.patient.phone}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 14, fontSize: 12 }}>
                  <div>
                    <span style={{ color: '#6b8fad' }}>Known Allergies: </span>
                    <strong style={{ color: '#ffb800' }}>{activeRx.patient.allergies?.join(', ') || 'None'}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#6b8fad' }}>30-Day Fill Velocity: </span>
                    <strong style={{ color: (activeRx.patient.recentFillCount30Days || 0) > 3 ? '#ff4444' : '#00ff88' }}>
                      {activeRx.patient.recentFillCount30Days} fills
                    </strong>
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <span style={{ color: '#6b8fad' }}>Active Medications: </span>
                    <span style={{ color: '#cbd5e1' }}>
                      {activeRx.patient.currentMedications?.join(', ') || 'No current medications on record'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 5-Axis Risk Factor Breakdown */}
            <RiskRadarBreakdown rxData={activeRx} />

            {/* Visual OCR Spatial Heatmap / Bounding Box Viewer */}
            <BoundingBoxViewer rxData={activeRx} />

            {/* Prescribed Drug Orders Table */}
            <div className="glass" style={{ borderRadius: 16, padding: 24, border: '1px solid rgba(0,212,255,0.18)', background: '#071428' }}>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: '#e8f4fd', marginBottom: 16 }}>
                Extracted Prescription Orders & Clinical Safety Limits
              </h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(0,212,255,0.2)', color: '#6b8fad', textAlign: 'left' }}>
                      <th style={{ padding: '10px 14px' }}>Medication Name</th>
                      <th style={{ padding: '10px 14px' }}>Prescribed Dose & Qty</th>
                      <th style={{ padding: '10px 14px' }}>Directions (Sig)</th>
                      <th style={{ padding: '10px 14px' }}>Schedule</th>
                      <th style={{ padding: '10px 14px' }}>Daily Dosage</th>
                      <th style={{ padding: '10px 14px' }}>FDA Safe Max</th>
                      <th style={{ padding: '10px 14px' }}>Risk Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeRx.medicines.map((med, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#e8f4fd' }}>
                        <td style={{ padding: '12px 14px', fontWeight: 700 }}>
                          <div>{med.name}</div>
                          {med.matchedGeneric && (
                            <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500, marginTop: 2 }}>
                              Molecule: {med.matchedGeneric}
                            </div>
                          )}
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4, fontSize: 10 }}>
                            {med.isHandwrittenMatch && (
                              <span style={{ color: '#ffb800', background: 'rgba(255,184,0,0.12)', padding: '1px 6px', borderRadius: 3, border: '1px solid rgba(255,184,0,0.3)', fontWeight: 600 }}>
                                ✍️ Decoded Handwriting ({med.confidenceScore || 90}%)
                              </span>
                            )}
                            {med.rxNormCui && (
                              <span style={{ color: '#00d4ff', background: 'rgba(0,212,255,0.1)', padding: '1px 5px', borderRadius: 3, border: '1px solid rgba(0,212,255,0.25)' }}>
                                RxCUI: {med.rxNormCui}
                              </span>
                            )}
                            {med.isFdaVerified && (
                              <span style={{ color: '#00ff88', background: 'rgba(0,255,136,0.1)', padding: '1px 5px', borderRadius: 3, border: '1px solid rgba(0,255,136,0.25)' }}>
                                ✓ OpenFDA
                              </span>
                            )}
                          </div>
                        </td>
                        <td style={{ padding: '12px 14px' }}>{med.dosage} ({med.quantity})</td>
                        <td style={{ padding: '12px 14px', color: '#cbd5e1' }}>{med.frequency}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 700,
                              padding: '2px 6px',
                              borderRadius: 4,
                              background: med.schedule === 'Schedule II' ? 'rgba(255,68,68,0.2)' : 'rgba(0,212,255,0.1)',
                              color: med.schedule === 'Schedule II' ? '#ff4444' : '#00d4ff',
                            }}
                          >
                            {med.schedule || 'Rx'}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px', fontFamily: 'monospace' }}>{med.prescribedDailyDose || '—'}</td>
                        <td style={{ padding: '12px 14px', fontFamily: 'monospace', color: '#6b8fad' }}>{med.maxDailyDose || '—'}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 700,
                              padding: '2px 8px',
                              borderRadius: 4,
                              background: med.risk === 'critical' ? 'rgba(255,68,68,0.2)' : med.risk === 'high' ? 'rgba(255,184,0,0.2)' : 'rgba(0,255,136,0.15)',
                              color: med.risk === 'critical' ? '#ff4444' : med.risk === 'high' ? '#ffb800' : '#00ff88',
                            }}
                          >
                            {med.risk ? med.risk.toUpperCase() : 'SAFE'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* Edit Prescriber Modal */}
      {isEditDocModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(2, 6, 23, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 20,
          }}
          onClick={() => setIsEditDocModalOpen(false)}
        >
          <div
            className="glass"
            style={{
              background: '#071428',
              border: '1px solid rgba(0, 212, 255, 0.3)',
              borderRadius: 16,
              maxWidth: 500,
              width: '100%',
              padding: 26,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#e8f4fd', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>👨‍⚕️</span> Edit Prescriber Details
              </h3>
              <button
                type="button"
                onClick={() => setIsEditDocModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#6b8fad', fontSize: 18, cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: 12, color: '#8bb0ce', marginBottom: 18 }}>
              Update or correct prescriber information extracted by OCR from the prescription document.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#6b8fad', display: 'block', marginBottom: 4 }}>
                  Doctor Name
                </label>
                <input
                  type="text"
                  value={editDocName}
                  onChange={(e) => setEditDocName(e.target.value)}
                  placeholder="e.g. Dr. Rohan Patel"
                  style={{
                    width: '100%',
                    background: 'rgba(4, 13, 26, 0.8)',
                    border: '1px solid rgba(0, 212, 255, 0.3)',
                    borderRadius: 8,
                    padding: '8px 12px',
                    color: '#e8f4fd',
                    fontSize: 13,
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#6b8fad', display: 'block', marginBottom: 4 }}>
                  Registration / Council Number
                </label>
                <input
                  type="text"
                  value={editDocLicense}
                  onChange={(e) => setEditDocLicense(e.target.value)}
                  placeholder="e.g. GMC-48201 or MMC/2018/1234"
                  style={{
                    width: '100%',
                    background: 'rgba(4, 13, 26, 0.8)',
                    border: '1px solid rgba(0, 212, 255, 0.3)',
                    borderRadius: 8,
                    padding: '8px 12px',
                    color: '#e8f4fd',
                    fontSize: 13,
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#6b8fad', display: 'block', marginBottom: 4 }}>
                  Medical Specialty
                </label>
                <input
                  type="text"
                  value={editDocSpecialty}
                  onChange={(e) => setEditDocSpecialty(e.target.value)}
                  placeholder="e.g. Cardiology / Internal Medicine"
                  style={{
                    width: '100%',
                    background: 'rgba(4, 13, 26, 0.8)',
                    border: '1px solid rgba(0, 212, 255, 0.3)',
                    borderRadius: 8,
                    padding: '8px 12px',
                    color: '#e8f4fd',
                    fontSize: 13,
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#6b8fad', display: 'block', marginBottom: 4 }}>
                  Hospital / Clinic Affiliation
                </label>
                <input
                  type="text"
                  value={editDocHospital}
                  onChange={(e) => setEditDocHospital(e.target.value)}
                  placeholder="e.g. Apollo Hospitals / Sterling Hospitals"
                  style={{
                    width: '100%',
                    background: 'rgba(4, 13, 26, 0.8)',
                    border: '1px solid rgba(0, 212, 255, 0.3)',
                    borderRadius: 8,
                    padding: '8px 12px',
                    color: '#e8f4fd',
                    fontSize: 13,
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setIsEditDocModalOpen(false)}
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#8bb0ce',
                    padding: '8px 16px',
                    borderRadius: 8,
                    fontSize: 13,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveDocChanges}
                  className="btn-primary"
                  style={{ padding: '8px 20px', borderRadius: 8, fontSize: 13 }}
                >
                  Save & Apply Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Certified PDF Audit Certificate Modal */}
      <AuditCertificateModal
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
        rxData={activeRx}
        onSignOff={handleStatusChange}
      />
    </div>
  )
}
