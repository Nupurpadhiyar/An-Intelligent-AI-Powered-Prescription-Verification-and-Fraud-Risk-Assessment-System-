import { useState, useRef, useEffect } from 'react'

interface CameraScannerModalProps {
  isOpen: boolean
  onClose: () => void
  onCapture: (imageDataUrl: string) => void
}

export default function CameraScannerModal({ isOpen, onClose, onCapture }: CameraScannerModalProps) {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!isOpen) {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
        setStream(null)
      }
      setCameraError(null)
      return
    }

    let activeStream: MediaStream | null = null

    async function initCamera() {
      try {
        setCameraError(null)
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        })
        activeStream = mediaStream
        setStream(mediaStream)
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
        }
      } catch (err: any) {
        console.warn('Camera access denied or unavailable:', err)
        setCameraError(
          'Webcam access unavailable or permission denied. You can still test with simulated camera snapshot mode.'
        )
      }
    }

    initCamera()

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleTakePhoto = () => {
    setIsCapturing(true)
    setTimeout(() => {
      let dataUrl = ''
      if (videoRef.current && canvasRef.current && stream) {
        const video = videoRef.current
        const canvas = canvasRef.current
        canvas.width = video.videoWidth || 800
        canvas.height = video.videoHeight || 600
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
          dataUrl = canvas.toDataURL('image/jpeg', 0.9)
        }
      }

      if (!dataUrl) {
        // Create simulated camera canvas snapshot
        const canvas = document.createElement('canvas')
        canvas.width = 800
        canvas.height = 600
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.fillStyle = '#f8fafc'
          ctx.fillRect(0, 0, 800, 600)
          ctx.fillStyle = '#0f172a'
          ctx.font = 'bold 24px sans-serif'
          ctx.fillText('LIVE CAMERA PRESCRIPTION SCAN', 50, 60)
          ctx.font = '16px sans-serif'
          ctx.fillText('Northridge Medical Center • Dr. Sarah Chen, MD', 50, 100)
          ctx.fillText('Patient: Marcus Thompson • Date: 2026-08-15', 50, 130)
          ctx.fillStyle = '#0284c7'
          ctx.font = 'bold 20px serif'
          ctx.fillText('℞ Amoxicillin 500mg #21 TID x 7d', 50, 200)
          ctx.fillText('℞ Ibuprofen 400mg #30 PRN pain', 50, 240)
          ctx.fillStyle = '#059669'
          ctx.font = 'italic 18px cursive'
          ctx.fillText('Verified Digital Signature: S. Chen MD', 50, 320)
          dataUrl = canvas.toDataURL('image/jpeg', 0.85)
        }
      }

      setIsCapturing(false)
      onCapture(dataUrl)
      onClose()
    }, 400)
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        backgroundColor: 'rgba(2, 6, 23, 0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
    >
      <div
        className="glass"
        style={{
          width: '100%',
          maxWidth: 680,
          borderRadius: 20,
          border: '1px solid rgba(0, 212, 255, 0.3)',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 212, 255, 0.25)',
          background: '#071428',
          position: 'relative',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '18px 24px',
            borderBottom: '1px solid rgba(0, 212, 255, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 20 }}>📷</span>
            <h3 style={{ color: '#e8f4fd', fontSize: 18, fontWeight: 700, margin: 0 }}>
              Live Prescription Optical Scanner
            </h3>
          </div>
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
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
            }}
          >
            ✕
          </button>
        </div>

        {/* Viewfinder Content */}
        <div style={{ position: 'relative', background: '#020617', minHeight: 380, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {cameraError ? (
            <div style={{ textAlign: 'center', padding: 30, maxWidth: 460 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>⚡</div>
              <p style={{ color: '#fca5a5', fontSize: 14, marginBottom: 16 }}>{cameraError}</p>
              <button
                onClick={handleTakePhoto}
                className="btn-primary"
                style={{ padding: '10px 20px', borderRadius: 10, fontSize: 14 }}
              >
                📸 Capture Simulated Prescription Frame
              </button>
            </div>
          ) : (
            <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{ width: '100%', maxHeight: 420, objectFit: 'cover' }}
              />

              {/* Viewfinder Alignment Box */}
              <div
                style={{
                  position: 'absolute',
                  width: '82%',
                  height: '75%',
                  border: '2px dashed rgba(0, 212, 255, 0.7)',
                  borderRadius: 14,
                  boxShadow: '0 0 0 9999px rgba(4, 13, 26, 0.45)',
                  pointerEvents: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: 12,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ width: 18, height: 18, borderTop: '3px solid #00ff88', borderLeft: '3px solid #00ff88' }} />
                  <div style={{ width: 18, height: 18, borderTop: '3px solid #00ff88', borderRight: '3px solid #00ff88' }} />
                </div>
                <div style={{ textAlign: 'center', color: '#00d4ff', fontSize: 12, fontWeight: 600, letterSpacing: '0.05em' }}>
                  ALIGN PRESCRIPTION WITHIN FRAME
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ width: 18, height: 18, borderBottom: '3px solid #00ff88', borderLeft: '3px solid #00ff88' }} />
                  <div style={{ width: 18, height: 18, borderBottom: '3px solid #00ff88', borderRight: '3px solid #00ff88' }} />
                </div>
              </div>
            </div>
          )}
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid rgba(0, 212, 255, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(7, 20, 40, 0.95)',
          }}
        >
          <div style={{ color: '#6b8fad', fontSize: 13 }}>
            Auto-focus & optical exposure active
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={onClose}
              className="btn-outline"
              style={{ padding: '8px 16px', borderRadius: 8, fontSize: 13 }}
            >
              Cancel
            </button>
            <button
              onClick={handleTakePhoto}
              disabled={isCapturing}
              className="btn-primary"
              style={{ padding: '8px 24px', borderRadius: 8, fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}
            >
              {isCapturing ? 'Processing Frame...' : '📸 Snap & Analyze'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
