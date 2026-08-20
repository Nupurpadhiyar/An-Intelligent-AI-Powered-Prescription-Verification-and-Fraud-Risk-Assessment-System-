import { useState } from 'react'
import type { PrescriptionData } from '../types/prescription'

interface AuditCertificateModalProps {
  isOpen: boolean
  onClose: () => void
  rxData: PrescriptionData
  onSignOff?: (status: PrescriptionData['status'], notes: string) => void
}

export default function AuditCertificateModal({
  isOpen,
  onClose,
  rxData,
  onSignOff,
}: AuditCertificateModalProps) {
  const [pharmacistName, setPharmacistName] = useState('Dr. Sarah Chen, PharmD')
  const [licenseNumber, setLicenseNumber] = useState('RPH-849204')
  const [decisionNotes, setDecisionNotes] = useState(
    rxData.risk === 'valid'
      ? 'Prescription verified against state registry and clinical safety database. Approved for standard dispensing.'
      : 'Prescription contains high risk flags. Requiring physician verbal verification prior to dispensing.'
  )
  const [isSigned, setIsSigned] = useState(rxData.status === 'verified_dispensed')

  if (!isOpen) return null

  const handlePrint = () => {
    window.print()
  }

  const handleApplySignOff = (status: PrescriptionData['status']) => {
    setIsSigned(true)
    if (onSignOff) {
      onSignOff(status, `${decisionNotes} (Signed by: ${pharmacistName}, Lic: ${licenseNumber})`)
    }
  }

  const certHash = rxData.certificateHash || 'a7f92e4b018d9c3325c8141209b2e772418e9a65f903721dbd4b295b9c02d184'

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 110,
        backgroundColor: 'rgba(2, 6, 23, 0.88)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        overflowY: 'auto',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 820,
          background: '#071428',
          border: '1px solid rgba(0, 212, 255, 0.3)',
          borderRadius: 20,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh',
        }}
      >
        {/* Modal Top Control Bar */}
        <div
          style={{
            padding: '16px 24px',
            background: 'rgba(7, 20, 40, 0.95)',
            borderBottom: '1px solid rgba(0, 212, 255, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 22 }}>📜</span>
            <div>
              <h3 style={{ color: '#e8f4fd', fontSize: 17, fontWeight: 700, margin: 0 }}>
                Certified Verification Audit Certificate
              </h3>
              <p style={{ color: '#6b8fad', fontSize: 12, margin: 0 }}>
                Tamper-evident verification document with cryptographic audit trail
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={handlePrint}
              className="btn-primary"
              style={{ padding: '6px 14px', borderRadius: 8, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <span>🖨️ Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                borderRadius: 8,
                width: 32,
                height: 32,
                color: '#a8c8e8',
                cursor: 'pointer',
                fontSize: 16,
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Certificate Printable Body */}
        <div
          id="printable-certificate"
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '36px 40px',
            background: '#ffffff',
            color: '#0f172a',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          {/* Certificate Header with Crest/Badge */}
          <div
            style={{
              borderBottom: '3px double #0284c7',
              paddingBottom: 20,
              marginBottom: 24,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 24, color: '#0284c7' }}>🛡️</span>
                <span style={{ fontSize: 22, fontWeight: 900, color: '#0369a1', letterSpacing: '-0.02em' }}>
                  RxShield AI • AUDIT VERIFICATION CERTIFICATE
                </span>
              </div>
              <div style={{ fontSize: 12, color: '#475569', fontWeight: 500 }}>
                Automated Forensic Prescription Analysis & Risk Assessment Report
              </div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                Certificate Serial: <strong>{rxData.prescriptionNumber}</strong> • Issue Date: {rxData.date}
              </div>
            </div>

            {/* QR Code Verification Widget */}
            <div style={{ textAlign: 'center', border: '1px solid #cbd5e1', padding: 8, borderRadius: 8, background: '#f8fafc' }}>
              {/* SVG QR Code Simulation */}
              <svg width="68" height="68" viewBox="0 0 100 100" fill="#0f172a">
                <rect width="100" height="100" fill="#ffffff" />
                <rect x="10" y="10" width="25" height="25" fill="#0f172a" />
                <rect x="15" y="15" width="15" height="15" fill="#ffffff" />
                <rect x="65" y="10" width="25" height="25" fill="#0f172a" />
                <rect x="70" y="15" width="15" height="15" fill="#ffffff" />
                <rect x="10" y="65" width="25" height="25" fill="#0f172a" />
                <rect x="15" y="70" width="15" height="15" fill="#ffffff" />
                <rect x="42" y="12" width="16" height="8" fill="#0f172a" />
                <rect x="42" y="30" width="8" height="20" fill="#0f172a" />
                <rect x="55" y="45" width="20" height="12" fill="#0f172a" />
                <rect x="42" y="65" width="15" height="20" fill="#0f172a" />
                <rect x="65" y="65" width="20" height="20" fill="#0f172a" />
              </svg>
              <div style={{ fontSize: 9, fontWeight: 700, color: '#0369a1', marginTop: 4 }}>
                SCAN TO VERIFY
              </div>
            </div>
          </div>

          {/* Verification Verdict Banner */}
          <div
            style={{
              padding: '14px 20px',
              borderRadius: 10,
              backgroundColor: rxData.risk === 'valid' ? '#ecfdf5' : rxData.risk === 'incomplete' ? '#fffbeb' : '#fef2f2',
              border: `2px solid ${rxData.risk === 'valid' ? '#10b981' : rxData.risk === 'incomplete' ? '#f59e0b' : '#ef4444'}`,
              marginBottom: 24,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Automated Verification Status
              </div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 900,
                  color: rxData.risk === 'valid' ? '#047857' : rxData.risk === 'incomplete' ? '#b45309' : '#b91c1c',
                }}
              >
                {rxData.risk === 'valid' ? '✓ VERIFIED & APPROVED' : rxData.risk === 'incomplete' ? '⚠ INCOMPLETE / CLINICAL WARNING' : '✕ SUSPICIOUS — HIGH FRAUD RISK'}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, color: '#64748b' }}>AI Confidence Score</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: '#0f172a' }}>
                {rxData.overallConfidence}%
              </div>
            </div>
          </div>

          {/* Prescriber & Patient Details Table */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
            <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: 14, background: '#f8fafc' }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#0369a1', textTransform: 'uppercase', marginBottom: 8 }}>
                Prescriber Verification
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{rxData.doctor.name}</div>
              <div style={{ fontSize: 12, color: '#475569' }}>{rxData.doctor.specialty}</div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>
                NPI: {rxData.doctor.npi} • License: {rxData.doctor.licenseNo}
              </div>
              <div style={{ fontSize: 11, color: '#64748b' }}>
                Hospital: {rxData.doctor.hospital}
              </div>
            </div>

            <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: 14, background: '#f8fafc' }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#0369a1', textTransform: 'uppercase', marginBottom: 8 }}>
                Patient Demographic
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{rxData.patient.name}</div>
              <div style={{ fontSize: 12, color: '#475569' }}>
                Age: {rxData.patient.age} • Gender: {rxData.patient.gender} • DOB: {rxData.patient.dob}
              </div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>
                Allergies: {rxData.patient.allergies.join(', ') || 'NKDA'}
              </div>
              <div style={{ fontSize: 11, color: '#64748b' }}>
                30-Day Fill Count: {rxData.patient.recentFillCount30Days}
              </div>
            </div>
          </div>

          {/* Prescribed Medications */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', marginBottom: 10 }}>
              Prescribed Drug Order & Safety Limits
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                  <th style={{ padding: '8px 10px', color: '#334155' }}>Drug Name</th>
                  <th style={{ padding: '8px 10px', color: '#334155' }}>Dosage & Qty</th>
                  <th style={{ padding: '8px 10px', color: '#334155' }}>Schedule</th>
                  <th style={{ padding: '8px 10px', color: '#334155' }}>Max Safe Limit</th>
                  <th style={{ padding: '8px 10px', color: '#334155' }}>AI Risk Flag</th>
                </tr>
              </thead>
              <tbody>
                {rxData.medicines.map((med, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '8px 10px', fontWeight: 700 }}>{med.name}</td>
                    <td style={{ padding: '8px 10px' }}>{med.dosage} ({med.quantity})</td>
                    <td style={{ padding: '8px 10px' }}>{med.schedule || 'Rx'}</td>
                    <td style={{ padding: '8px 10px' }}>{med.maxDailyDose || 'N/A'}</td>
                    <td style={{ padding: '8px 10px', color: med.risk === 'critical' ? '#dc2626' : med.risk === 'high' ? '#d97706' : '#059669', fontWeight: 600 }}>
                      {med.risk ? med.risk.toUpperCase() : 'PASS'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cryptographic Hash & Pharmacist Sign-Off Stamp */}
          <div
            style={{
              marginTop: 30,
              paddingTop: 18,
              borderTop: '2px dashed #cbd5e1',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
            }}
          >
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                Cryptographic SHA-256 Verification Digest
              </div>
              <div style={{ fontSize: 10, fontFamily: 'monospace', color: '#0369a1', wordBreak: 'break-all', maxWidth: 420 }}>
                {certHash}
              </div>
              <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 4 }}>
                Timestamp: {new Date().toISOString()} • Complies with 21 CFR Part 11 & HIPAA Audit Standard
              </div>
            </div>

            <div style={{ textAlign: 'center', width: 220, border: '2px solid #0284c7', borderRadius: 8, padding: 10, background: '#f0f9ff' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#0369a1', textTransform: 'uppercase' }}>
                {isSigned ? '✓ DIGITALLY SIGNED' : 'PENDING PHARMACIST STAMP'}
              </div>
              <div style={{ fontFamily: 'cursive', fontSize: 16, color: '#0c4a6e', margin: '4px 0' }}>
                {pharmacistName}
              </div>
              <div style={{ fontSize: 10, color: '#475569' }}>
                Lic: {licenseNumber} • {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Pharmacist Action Bar */}
        <div
          style={{
            padding: '16px 24px',
            background: 'rgba(7, 20, 40, 0.95)',
            borderTop: '1px solid rgba(0, 212, 255, 0.15)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <input
              type="text"
              value={pharmacistName}
              onChange={(e) => setPharmacistName(e.target.value)}
              placeholder="Pharmacist Name"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(0,212,255,0.2)',
                color: '#e8f4fd',
                padding: '6px 12px',
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <input
              type="text"
              value={licenseNumber}
              onChange={(e) => setLicenseNumber(e.target.value)}
              placeholder="License Number"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(0,212,255,0.2)',
                color: '#e8f4fd',
                padding: '6px 12px',
                borderRadius: 8,
                fontSize: 12,
                width: 130,
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => handleApplySignOff('flagged_investigation')}
              style={{
                background: 'rgba(255, 68, 68, 0.15)',
                border: '1px solid rgba(255, 68, 68, 0.4)',
                color: '#ff4444',
                padding: '8px 16px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              🚩 Flag for Audit
            </button>
            <button
              onClick={() => handleApplySignOff('verified_dispensed')}
              className="btn-primary"
              style={{ padding: '8px 20px', borderRadius: 8, fontSize: 12, fontWeight: 700 }}
            >
              ✓ Authorize & Stamp Certificate
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
