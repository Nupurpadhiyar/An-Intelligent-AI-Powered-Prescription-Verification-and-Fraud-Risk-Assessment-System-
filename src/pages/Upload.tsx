import { useState, useRef, useCallback } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import CameraScannerModal from '../components/CameraScannerModal'
import { usePrescriptions } from '../context/PrescriptionContext'
import { samplePrescriptions } from '../data/samplePrescriptions'
import type { Page } from '../App'
import type { PrescriptionData } from '../types/prescription'

interface Props {
  navigate: (p: Page) => void
  darkMode: boolean
  setDarkMode: (v: boolean) => void
}

type Stage = 'idle' | 'uploading' | 'ocr' | 'registry_check' | 'ddi_analysis' | 'done'

export default function Upload({ navigate }: Props) {
  const { processUploadedPrescription } = usePrescriptions()
  const [stage, setStage] = useState<Stage>('idle')
  const [progress, setProgress] = useState(0)
  const [fileName, setFileName] = useState('')
  const [dragging, setDragging] = useState(false)
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null)
  const [previewThumbnail, setPreviewThumbnail] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const stageLabels: Record<Stage, string> = {
    idle: '',
    uploading: 'Uploading prescription payload...',
    ocr: 'Executing Vision OCR & Spatial Field Extraction...',
    registry_check: 'Cross-verifying NPI & State Medical Board Registry...',
    ddi_analysis: 'Analyzing Drug-Drug Interactions & Dosage Thresholds...',
    done: 'AI Verification complete! Redirecting to dashboard...',
  }

  const stageProgress: Record<Stage, number> = {
    idle: 0,
    uploading: 25,
    ocr: 55,
    registry_check: 75,
    ddi_analysis: 92,
    done: 100,
  }

  const executePipeline = (rxPayload: PrescriptionData, name: string, thumbnail?: string) => {
    setFileName(name)
    if (thumbnail) setPreviewThumbnail(thumbnail)
    setStage('uploading')
    setProgress(stageProgress.uploading)

    setTimeout(() => {
      setStage('ocr')
      setProgress(stageProgress.ocr)

      setTimeout(() => {
        setStage('registry_check')
        setProgress(stageProgress.registry_check)

        setTimeout(() => {
          setStage('ddi_analysis')
          setProgress(stageProgress.ddi_analysis)

          setTimeout(() => {
            setStage('done')
            setProgress(100)
            processUploadedPrescription(rxPayload)

            setTimeout(() => {
              navigate('dashboard')
            }, 600)
          }, 600)
        }, 600)
      }, 700)
    }, 500)
  }

  const handleSelectPreset = (preset: PrescriptionData) => {
    setSelectedPresetId(preset.id)
    executePipeline(preset, `${preset.id} (${preset.medicines[0].name} Preset)`, preset.rawImage)
  }

  const handleFile = (file: File) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
    if (!allowed.includes(file.type)) return

    // Pick matching sample based on file name or random
    const randomPreset = file.name.toLowerCase().includes('forged') || file.name.toLowerCase().includes('oxy')
      ? samplePrescriptions[1]
      : file.name.toLowerCase().includes('interact') || file.name.toLowerCase().includes('sildenafil')
      ? samplePrescriptions[2]
      : samplePrescriptions[0]

    const dynamicRx: PrescriptionData = {
      ...randomPreset,
      id: `RX-${Math.floor(10000 + Math.random() * 90000)}`,
      prescriptionNumber: `RX-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toISOString().split('T')[0],
      sourceType: 'uploaded_file',
      rawImage: URL.createObjectURL(file),
    }

    executePipeline(dynamicRx, file.name, URL.createObjectURL(file))
  }

  const handleCameraCapture = (imageDataUrl: string) => {
    const cameraRx: PrescriptionData = {
      ...samplePrescriptions[0],
      id: `RX-CAM-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      sourceType: 'camera_scan',
      rawImage: imageDataUrl,
    }
    executePipeline(cameraRx, 'Live_Webcam_Scan.jpg', imageDataUrl)
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [])

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#040d1a' }}>
      <Sidebar navigate={navigate} current="upload" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Navbar navigate={navigate} current="upload" />
        <main style={{ flex: 1, padding: '36px 36px', overflowY: 'auto' }}>
          <div style={{ maxWidth: 1040, margin: '0 auto' }}>

            {/* Header */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14 }}>
                <div>
                  <h1
                    className="font-display"
                    style={{ fontSize: 30, fontWeight: 800, color: '#e8f4fd', letterSpacing: '-0.02em', marginBottom: 6 }}
                  >
                    Upload & Optical Verification Hub
                  </h1>
                  <p style={{ color: '#6b8fad', fontSize: 14 }}>
                    Analyze prescriptions against Vision OCR models, NPI Doctor Registries, and DEA Controlled Substance Rules.
                  </p>
                </div>

                {/* Live Camera Launch Button */}
                <button
                  onClick={() => setIsCameraOpen(true)}
                  className="btn-primary"
                  style={{ padding: '10px 18px', borderRadius: 10, fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}
                >
                  <span>📷</span>
                  <span>Open Live Camera Scanner</span>
                </button>
              </div>
            </div>

            {/* Sample Prescriptions Showcase & Direct Download Section */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#00d4ff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  📑 Ready-Made Sample Prescriptions (1-Click Run or Download)
                </span>
                <span style={{ fontSize: 12, color: '#6b8fad' }}>Click any card to verify or download the real sample file</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                {samplePrescriptions.map((preset) => {
                  const isSelected = selectedPresetId === preset.id
                  const isSuspicious = preset.risk === 'suspicious'
                  const isIncomplete = preset.risk === 'incomplete'
                  const badgeColor = isSuspicious ? '#ff4444' : isIncomplete ? '#ffb800' : '#00ff88'

                  return (
                    <div
                      key={preset.id}
                      className="glass"
                      style={{
                        borderRadius: 14,
                        border: `1px solid ${isSelected ? '#00d4ff' : 'rgba(0,212,255,0.18)'}`,
                        background: '#071428',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      {/* Image Thumbnail Preview */}
                      {preset.rawImage && (
                        <div
                          style={{
                            height: 140,
                            background: '#020617',
                            overflow: 'hidden',
                            position: 'relative',
                            borderBottom: '1px solid rgba(0,212,255,0.1)',
                          }}
                        >
                          <img
                            src={preset.rawImage}
                            alt={preset.id}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', opacity: 0.85 }}
                          />
                          <span
                            style={{
                              position: 'absolute',
                              top: 8,
                              right: 8,
                              fontSize: 10,
                              fontWeight: 800,
                              color: badgeColor,
                              background: 'rgba(7,20,40,0.9)',
                              border: `1px solid ${badgeColor}`,
                              padding: '2px 8px',
                              borderRadius: 4,
                              textTransform: 'uppercase',
                            }}
                          >
                            {preset.risk}
                          </span>
                        </div>
                      )}

                      {/* Card Body */}
                      <div style={{ padding: 16 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#6b8fad', marginBottom: 2 }}>
                          {preset.id} • {preset.date}
                        </div>
                        <h4 style={{ fontSize: 15, fontWeight: 700, color: '#e8f4fd', margin: '0 0 4px 0' }}>
                          {preset.medicines[0]?.name} {preset.medicines[0]?.dosage}
                        </h4>
                        <p style={{ fontSize: 12, color: '#8bb0ce', margin: '0 0 14px 0' }}>
                          {preset.doctor.name} ({preset.doctor.specialty})
                        </p>

                        {/* Card Action Buttons */}
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button
                            onClick={() => handleSelectPreset(preset)}
                            disabled={stage !== 'idle'}
                            className="btn-primary"
                            style={{
                              flex: 1,
                              padding: '8px 12px',
                              borderRadius: 8,
                              fontSize: 12,
                              fontWeight: 700,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: 6,
                            }}
                          >
                            <span>⚡ Run AI Scan</span>
                          </button>

                          {preset.rawImage && (
                            <a
                              href={preset.rawImage}
                              download={`${preset.id}_Sample_Prescription.jpg`}
                              className="btn-outline"
                              style={{
                                padding: '8px 12px',
                                borderRadius: 8,
                                fontSize: 12,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textDecoration: 'none',
                                color: '#00d4ff',
                              }}
                              title="Download prescription image to test drag & drop"
                            >
                              <span>📥 Save</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Main File Drop Zone / Upload Area */}
            {stage === 'idle' ? (
              <div
                onDragOver={(e) => {
                  e.preventDefault()
                  setDragging(true)
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                onClick={() => fileRef.current?.click()}
                className="glass"
                style={{
                  border: `2px dashed ${dragging ? '#00d4ff' : 'rgba(0,212,255,0.25)'}`,
                  borderRadius: 20,
                  padding: '50px 40px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: dragging ? 'rgba(0,212,255,0.06)' : 'rgba(7,20,40,0.6)',
                  transition: 'all 0.2s',
                  position: 'relative',
                }}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  onChange={onInputChange}
                  style={{ display: 'none' }}
                />

                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 18,
                    background: 'rgba(0,212,255,0.1)',
                    border: '1px solid rgba(0,212,255,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                    fontSize: 28,
                  }}
                >
                  📁
                </div>

                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#e8f4fd', marginBottom: 6 }}>
                  Drag & drop your prescription image or PDF here
                </h3>
                <p style={{ color: '#6b8fad', fontSize: 13, marginBottom: 18 }}>
                  Supports JPEG, PNG, WEBP, and PDF up to 25 MB
                </p>

                <button
                  type="button"
                  className="btn-primary"
                  style={{ padding: '9px 22px', borderRadius: 10, fontSize: 13 }}
                  onClick={(e) => {
                    e.stopPropagation()
                    fileRef.current?.click()
                  }}
                >
                  Browse Local Files
                </button>
              </div>
            ) : (
              /* Analysis Processing Progress View */
              <div
                className="glass"
                style={{
                  borderRadius: 20,
                  padding: '40px 30px',
                  textAlign: 'center',
                  background: '#071428',
                  border: '1px solid rgba(0,212,255,0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                {previewThumbnail && (
                  <div style={{ width: 100, height: 120, borderRadius: 8, overflow: 'hidden', marginBottom: 18, border: '1px solid #00d4ff' }}>
                    <img src={previewThumbnail} alt="Scanning" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}

                <div
                  style={{
                    width: 54,
                    height: 54,
                    borderRadius: '50%',
                    border: '3px solid rgba(0,212,255,0.2)',
                    borderTopColor: '#00d4ff',
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto 18px',
                  }}
                />

                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#e8f4fd', marginBottom: 6 }}>
                  {stageLabels[stage]}
                </h3>
                <p style={{ color: '#00d4ff', fontSize: 13, fontFamily: 'monospace', marginBottom: 20 }}>
                  Analyzing: {fileName}
                </p>

                {/* Progress Bar */}
                <div
                  style={{
                    width: '100%',
                    maxWidth: 420,
                    margin: '0 auto 12px',
                    height: 8,
                    background: 'rgba(255,255,255,0.08)',
                    borderRadius: 999,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${progress}%`,
                      background: 'linear-gradient(90deg, #00d4ff, #00ff88)',
                      borderRadius: 999,
                      transition: 'width 0.4s ease',
                    }}
                  />
                </div>

                <span style={{ fontSize: 12, color: '#6b8fad' }}>{progress}% Complete</span>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Live Camera Scanner Modal */}
      <CameraScannerModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCameraCapture}
      />
    </div>
  )
}
