import { useState, useRef, useCallback } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import type { Page } from '../App'

interface Props {
  navigate: (p: Page) => void
  darkMode: boolean
  setDarkMode: (v: boolean) => void
}

type Stage = 'idle' | 'uploading' | 'ocr' | 'analyzing' | 'done'

export default function Upload({ navigate }: Props) {
  const [stage, setStage] = useState<Stage>('idle')
  const [progress, setProgress] = useState(0)
  const [fileName, setFileName] = useState('')
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const stageLabels: Record<Stage, string> = {
    idle: '',
    uploading: 'Uploading file...',
    ocr: 'Running OCR extraction...',
    analyzing: 'AI risk analysis...',
    done: 'Analysis complete!',
  }

  const stageProgress: Record<Stage, number> = {
    idle: 0,
    uploading: 35,
    ocr: 65,
    analyzing: 90,
    done: 100,
  }

  const simulateProcess = (name: string) => {
    setFileName(name)
    const stages: Stage[] = ['uploading', 'ocr', 'analyzing', 'done']
    let i = 0
    const next = () => {
      if (i >= stages.length) return
      setStage(stages[i])
      setProgress(stageProgress[stages[i]])
      if (stages[i] !== 'done') {
        i++
        setTimeout(next, 1200 + Math.random() * 600)
      }
    }
    setStage('uploading')
    setProgress(10)
    setTimeout(() => { i = 1; next() }, 800)
  }

  const handleFile = (file: File) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
    if (!allowed.includes(file.type)) return
    simulateProcess(file.name)
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
        <main style={{ flex: 1, padding: '40px 40px', overflowY: 'auto' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            {/* Header */}
            <div style={{ marginBottom: 36 }}>
              <h1
                className="font-display"
                style={{ fontSize: 32, fontWeight: 800, color: '#e8f4fd', letterSpacing: '-0.02em', marginBottom: 8 }}
              >
                Upload Prescription
              </h1>
              <p style={{ color: '#6b8fad', fontSize: 15 }}>
                Upload an image or PDF of any prescription for instant AI verification.
              </p>
            </div>

            {/* Steps guide */}
            <div
              className="glass"
              style={{ borderRadius: 16, padding: '20px 24px', marginBottom: 32, display: 'flex', gap: 24, flexWrap: 'wrap' }}
            >
              {uploadSteps.map((s, i) => (
                <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: 'rgba(0,212,255,0.15)',
                      border: '1px solid rgba(0,212,255,0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                      fontWeight: 700,
                      color: '#00d4ff',
                      flexShrink: 0,
                    }}
                    className="font-mono"
                  >
                    {i + 1}
                  </div>
                  <span style={{ fontSize: 13, color: '#a8c8e8' }}>{s.label}</span>
                  {i < uploadSteps.length - 1 && (
                    <span style={{ color: '#2a4a6b', marginLeft: 8 }}>→</span>
                  )}
                </div>
              ))}
            </div>

            {/* Drop zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              onClick={() => stage === 'idle' && fileRef.current?.click()}
              style={{
                borderRadius: 20,
                border: `2px dashed ${dragging ? '#00d4ff' : 'rgba(0,212,255,0.25)'}`,
                background: dragging ? 'rgba(0,212,255,0.06)' : 'rgba(7,20,40,0.8)',
                padding: '60px 40px',
                textAlign: 'center',
                cursor: stage === 'idle' ? 'pointer' : 'default',
                transition: 'all 0.3s',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: dragging ? '0 0 32px rgba(0,212,255,0.15)' : 'none',
              }}
            >
              {/* Background decoration */}
              <div className="bg-dots" style={{ position: 'absolute', inset: 0, opacity: 0.4 }} />

              <input
                ref={fileRef}
                type="file"
                accept="image/*,.pdf"
                style={{ display: 'none' }}
                onChange={onInputChange}
              />

              {stage === 'idle' ? (
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div
                    style={{ fontSize: 56, marginBottom: 16 }}
                    className="animate-float"
                  >
                    📋
                  </div>
                  <h3
                    className="font-display"
                    style={{ fontSize: 22, fontWeight: 700, color: '#e8f4fd', marginBottom: 10 }}
                  >
                    Drag & drop your prescription here
                  </h3>
                  <p style={{ color: '#6b8fad', marginBottom: 24, fontSize: 14 }}>
                    Supports JPEG, PNG, WebP, and PDF
                  </p>
                  <button
                    className="btn-primary"
                    style={{ padding: '12px 28px', borderRadius: 10, fontSize: 15 }}
                    onClick={(e) => { e.stopPropagation(); fileRef.current?.click() }}
                  >
                    Choose File
                  </button>
                  <div
                    style={{
                      marginTop: 20,
                      display: 'flex',
                      gap: 16,
                      justifyContent: 'center',
                      flexWrap: 'wrap',
                    }}
                  >
                    {['JPG / PNG', 'PDF', 'WebP', 'Max 10MB'].map((f) => (
                      <span
                        key={f}
                        className="font-mono"
                        style={{
                          fontSize: 11,
                          padding: '4px 10px',
                          borderRadius: 6,
                          background: 'rgba(0,212,255,0.08)',
                          border: '1px solid rgba(0,212,255,0.15)',
                          color: '#6b8fad',
                        }}
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ position: 'relative', zIndex: 1 }}>
                  {/* File name */}
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '8px 16px',
                      borderRadius: 8,
                      background: 'rgba(0,212,255,0.08)',
                      border: '1px solid rgba(0,212,255,0.2)',
                      marginBottom: 28,
                    }}
                  >
                    <span style={{ color: '#00d4ff' }}>📄</span>
                    <span className="font-mono" style={{ fontSize: 13, color: '#a8c8e8' }}>{fileName}</span>
                  </div>

                  {/* Progress bar */}
                  <div style={{ marginBottom: 16 }}>
                    <div
                      style={{
                        height: 6,
                        borderRadius: 999,
                        background: 'rgba(0,212,255,0.1)',
                        overflow: 'hidden',
                        marginBottom: 10,
                      }}
                    >
                      <div
                        className="progress-bar"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 13, color: '#a8c8e8' }}>{stageLabels[stage]}</span>
                      <span className="font-mono" style={{ fontSize: 12, color: '#00d4ff' }}>{progress}%</span>
                    </div>
                  </div>

                  {/* Stage steps */}
                  <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginTop: 24 }}>
                    {(['uploading', 'ocr', 'analyzing', 'done'] as Stage[]).map((s) => {
                      const stageOrder = ['uploading', 'ocr', 'analyzing', 'done']
                      const currentIdx = stageOrder.indexOf(stage)
                      const sIdx = stageOrder.indexOf(s)
                      const isDone = sIdx < currentIdx
                      const isCurrent = s === stage
                      return (
                        <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              background: isDone ? '#00ff88' : isCurrent ? '#00d4ff' : 'rgba(0,212,255,0.2)',
                              boxShadow: isCurrent ? '0 0 8px rgba(0,212,255,0.6)' : 'none',
                            }}
                          />
                          <span
                            style={{
                              fontSize: 12,
                              color: isDone ? '#00ff88' : isCurrent ? '#00d4ff' : '#2a4a6b',
                              fontWeight: isCurrent ? 600 : 400,
                            }}
                          >
                            {stageLabels[s]}
                          </span>
                        </div>
                      )
                    })}
                  </div>

                  {stage === 'done' && (
                    <button
                      onClick={() => navigate('dashboard')}
                      className="btn-primary"
                      style={{ marginTop: 28, padding: '12px 28px', borderRadius: 10, fontSize: 15 }}
                    >
                      View Results in Dashboard →
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Demo trigger */}
            {stage === 'idle' && (
              <div style={{ textAlign: 'center', marginTop: 20 }}>
                <button
                  onClick={() => simulateProcess('prescription_dr_chen_2026.jpg')}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#6b8fad',
                    fontSize: 13,
                    textDecoration: 'underline',
                  }}
                >
                  Try with a demo prescription
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

const uploadSteps = [
  { label: 'Select or drag file' },
  { label: 'Auto OCR extraction' },
  { label: 'AI risk analysis' },
  { label: 'View results' },
]
