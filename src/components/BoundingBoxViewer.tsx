import { useState } from 'react'
import type { OCRBoundingBox, PrescriptionData } from '../types/prescription'

interface BoundingBoxViewerProps {
  rxData: PrescriptionData
}

export default function BoundingBoxViewer({ rxData }: BoundingBoxViewerProps) {
  const [activeBox, setActiveBox] = useState<OCRBoundingBox | null>(null)
  const [showOverlays, setShowOverlays] = useState(true)
  const [showRealDocument, setShowRealDocument] = useState(Boolean(rxData.rawImage))

  return (
    <div
      className="glass"
      style={{
        borderRadius: 16,
        padding: 24,
        border: '1px solid rgba(0,212,255,0.18)',
        background: '#071428',
      }}
    >
      {/* Top Bar with Toggles */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 18 }}>🔍</span>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#e8f4fd', margin: 0 }}>
              AI Vision OCR Extraction & Spatial Heatmap
            </h3>
            <p style={{ fontSize: 12, color: '#6b8fad', margin: 0 }}>
              Interactive bounding boxes mapped directly to scanned prescription document regions
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {rxData.rawImage && (
            <button
              onClick={() => setShowRealDocument(!showRealDocument)}
              style={{
                background: showRealDocument ? 'rgba(0,255,136,0.15)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${showRealDocument ? 'rgba(0,255,136,0.4)' : 'rgba(255,255,255,0.1)'}`,
                color: showRealDocument ? '#00ff88' : '#6b8fad',
                padding: '6px 12px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <span>{showRealDocument ? '📄 Scanned Paper View' : '💻 Structured Grid View'}</span>
            </button>
          )}

          <button
            onClick={() => setShowOverlays(!showOverlays)}
            style={{
              background: showOverlays ? 'rgba(0,212,255,0.15)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${showOverlays ? 'rgba(0,212,255,0.4)' : 'rgba(255,255,255,0.1)'}`,
              color: showOverlays ? '#00d4ff' : '#6b8fad',
              padding: '6px 14px',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span>{showOverlays ? '👁️ Overlays Visible' : '👁️‍🗨️ Overlays Hidden'}</span>
          </button>
        </div>
      </div>

      {/* Document Viewport with Bounding Boxes */}
      <div
        style={{
          position: 'relative',
          minHeight: 520,
          background: '#f8fafc',
          borderRadius: 12,
          overflow: 'hidden',
          boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.15), 0 10px 25px rgba(0,0,0,0.3)',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          padding: showRealDocument && rxData.rawImage ? 0 : 28,
          color: '#0f172a',
          fontFamily: 'Inter, system-ui, sans-serif',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {showRealDocument && rxData.rawImage ? (
          /* Real High-Resolution Scanned Document Image */
          <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center' }}>
            <img
              src={rxData.rawImage}
              alt="Prescription Scan"
              style={{
                width: '100%',
                maxHeight: 640,
                objectFit: 'contain',
                display: 'block',
              }}
            />
          </div>
        ) : (
          /* Clean Paper Layout Fallback */
          <div style={{ width: '100%' }}>
            <div style={{ borderBottom: '2px solid #0284c7', paddingBottom: 14, marginBottom: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#0369a1', letterSpacing: '-0.01em' }}>
                    {rxData.doctor.hospital || 'CLINICAL MEDICAL CENTER'}
                  </div>
                  <div style={{ fontSize: 13, color: '#334155', fontWeight: 600 }}>
                    {rxData.doctor.name} • {rxData.doctor.specialty}
                  </div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>
                    License: {rxData.doctor.licenseNo} • NPI: {rxData.doctor.npi}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>
                    Rx ID: {rxData.prescriptionNumber}
                  </div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>Date: {rxData.date}</div>
                </div>
              </div>
            </div>

            {/* Patient Block */}
            <div
              style={{
                background: '#f1f5f9',
                padding: '10px 14px',
                borderRadius: 8,
                marginBottom: 20,
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 12,
                color: '#1e293b',
              }}
            >
              <div>
                <strong>Patient:</strong> {rxData.patient.name} ({rxData.patient.age}y / {rxData.patient.gender})
              </div>
              <div>
                <strong>DOB:</strong> {rxData.patient.dob}
              </div>
              <div>
                <strong>Allergies:</strong> {rxData.patient.allergies.join(', ') || 'NKDA'}
              </div>
            </div>

            {/* Prescription Rx Symbol & Medications */}
            <div style={{ marginBottom: 24, minHeight: 160 }}>
              <div style={{ fontSize: 32, fontWeight: 900, color: '#0284c7', fontFamily: 'serif', marginBottom: 8 }}>
                ℞
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingLeft: 12 }}>
                {rxData.medicines.map((med, idx) => (
                  <div key={idx} style={{ borderBottom: '1px dashed #cbd5e1', paddingBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>
                        {med.name}
                      </span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#0284c7', background: '#e0f2fe', padding: '2px 8px', borderRadius: 4 }}>
                        {med.dosage}
                      </span>
                      <span style={{ fontSize: 12, color: '#475569' }}>
                        Qty: {med.quantity}
                      </span>
                      {med.schedule && med.schedule !== 'OTC' && (
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            padding: '2px 6px',
                            borderRadius: 4,
                            background: med.schedule === 'Schedule II' ? '#fee2e2' : '#fef3c7',
                            color: med.schedule === 'Schedule II' ? '#dc2626' : '#d97706',
                          }}
                        >
                          {med.schedule}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: '#475569', marginTop: 3 }}>
                      Sig: {med.frequency} • Duration: {med.duration}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Signature & Security Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: 16, borderTop: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: 10, color: '#94a3b8', maxWidth: 300 }}>
                DISPENSED SUBJECT TO SECURITY VERIFICATION. ELECTRONIC AUDIT RECORD HASH: {rxData.certificateHash?.substring(0, 16)}...
              </div>
              <div style={{ textAlign: 'center', width: 220 }}>
                <div
                  style={{
                    fontFamily: 'cursive',
                    fontSize: 18,
                    color: rxData.doctor.signaturePresent ? '#047857' : '#dc2626',
                    fontStyle: 'italic',
                    borderBottom: '1px solid #94a3b8',
                    paddingBottom: 4,
                    marginBottom: 4,
                  }}
                >
                  {rxData.doctor.signaturePresent ? rxData.doctor.name : '— [SIGNATURE MISSING] —'}
                </div>
                <div style={{ fontSize: 11, color: '#64748b' }}>Authorized Prescriber Signature</div>
              </div>
            </div>
          </div>
        )}

        {/* Spatial OCR Bounding Box Overlays */}
        {showOverlays &&
          rxData.boundingBoxes.map((box) => {
            const isFlagged = box.flagged
            const isHovered = activeBox?.id === box.id
            const strokeColor = isFlagged ? '#ef4444' : isHovered ? '#00d4ff' : '#0284c7'
            const bgColor = isFlagged
              ? 'rgba(239, 68, 68, 0.22)'
              : isHovered
              ? 'rgba(0, 212, 255, 0.25)'
              : 'rgba(2, 132, 199, 0.12)'

            return (
              <div
                key={box.id}
                onMouseEnter={() => setActiveBox(box)}
                onMouseLeave={() => setActiveBox(null)}
                style={{
                  position: 'absolute',
                  left: `${box.x}%`,
                  top: `${box.y}%`,
                  width: `${box.width}%`,
                  height: `${box.height}%`,
                  border: `2px solid ${strokeColor}`,
                  backgroundColor: bgColor,
                  borderRadius: 6,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  zIndex: isHovered ? 30 : 20,
                  boxShadow: isFlagged ? '0 0 14px rgba(239, 68, 68, 0.6)' : undefined,
                }}
              >
                {/* Badge Label */}
                <div
                  style={{
                    position: 'absolute',
                    top: -12,
                    left: 6,
                    backgroundColor: isFlagged ? '#dc2626' : '#0369a1',
                    color: '#ffffff',
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '1px 7px',
                    borderRadius: 4,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    whiteSpace: 'nowrap',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  }}
                >
                  <span>{box.label}</span>
                  <span style={{ opacity: 0.85, fontSize: 9 }}>{box.confidence}%</span>
                </div>
              </div>
            )
          })}
      </div>

      {/* Active Box Details Card */}
      {activeBox && (
        <div
          style={{
            marginTop: 14,
            padding: '10px 16px',
            background: 'rgba(0,212,255,0.06)',
            borderRadius: 10,
            border: '1px solid rgba(0,212,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#00d4ff' }}>
              [{activeBox.label}]
            </span>
            <span style={{ fontSize: 13, color: '#e8f4fd' }}>
              Extracted: <code style={{ color: '#00ff88', background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: 4 }}>{activeBox.value}</code>
            </span>
          </div>
          <div style={{ fontSize: 12, color: '#a8c8e8', fontWeight: 600 }}>
            OCR Confidence: {activeBox.confidence}%
          </div>
        </div>
      )}
    </div>
  )
}
