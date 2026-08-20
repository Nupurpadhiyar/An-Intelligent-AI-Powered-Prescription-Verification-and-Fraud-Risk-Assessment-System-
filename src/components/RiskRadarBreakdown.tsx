import type { PrescriptionData, RiskFactor } from '../types/prescription'

interface RiskRadarBreakdownProps {
  rxData: PrescriptionData
}

export default function RiskRadarBreakdown({ rxData }: RiskRadarBreakdownProps) {
  const getStatusColor = (status: RiskFactor['status']) => {
    switch (status) {
      case 'pass':
        return { text: '#00ff88', bg: 'rgba(0,255,136,0.1)', border: 'rgba(0,255,136,0.3)', icon: '✓ PASS' }
      case 'warning':
        return { text: '#ffb800', bg: 'rgba(255,184,0,0.1)', border: 'rgba(255,184,0,0.3)', icon: '⚠ WARN' }
      case 'fail':
        return { text: '#ff4444', bg: 'rgba(255,68,68,0.1)', border: 'rgba(255,68,68,0.3)', icon: '✕ FAIL' }
    }
  }

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'linear-gradient(90deg, #00ff88, #00d4ff)'
    if (score >= 50) return 'linear-gradient(90deg, #ffb800, #f59e0b)'
    return 'linear-gradient(90deg, #ff4444, #ef4444)'
  }

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
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#e8f4fd', margin: 0 }}>
            5-Axis Multi-Factor Fraud & Clinical Risk Breakdown
          </h3>
          <p style={{ fontSize: 13, color: '#6b8fad', margin: '4px 0 0 0' }}>
            Automated compliance checks across state registries, vision OCR models, and clinical datasets
          </p>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 11, color: '#6b8fad', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Composite Safety Score
          </div>
          <div
            className="font-display"
            style={{
              fontSize: 28,
              fontWeight: 900,
              color: rxData.riskScore >= 80 ? '#00ff88' : rxData.riskScore >= 50 ? '#ffb800' : '#ff4444',
            }}
          >
            {rxData.riskScore}<span style={{ fontSize: 14, color: '#6b8fad' }}>/100</span>
          </div>
        </div>
      </div>

      {/* Progress Bar Header */}
      <div
        style={{
          width: '100%',
          height: 8,
          background: 'rgba(255,255,255,0.06)',
          borderRadius: 999,
          overflow: 'hidden',
          marginBottom: 24,
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${rxData.riskScore}%`,
            background: getScoreGradient(rxData.riskScore),
            borderRadius: 999,
            transition: 'width 0.8s ease-in-out',
          }}
        />
      </div>

      {/* 5 Risk Factors Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {rxData.riskFactors.map((factor, idx) => {
          const statusCfg = getStatusColor(factor.status)
          return (
            <div
              key={idx}
              style={{
                padding: '14px 18px',
                borderRadius: 12,
                background: 'rgba(255,255,255,0.02)',
                border: `1px solid ${statusCfg.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 16,
                flexWrap: 'wrap',
              }}
            >
              <div style={{ flex: '1 1 300px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: statusCfg.text,
                      background: statusCfg.bg,
                      padding: '2px 8px',
                      borderRadius: 6,
                      border: `1px solid ${statusCfg.border}`,
                    }}
                  >
                    {statusCfg.icon}
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#e8f4fd' }}>
                    {factor.title}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: '#8bb0ce', lineHeight: 1.4 }}>
                  {factor.details}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
                <div style={{ width: 90, height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 999, overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${factor.score}%`,
                      background: getScoreGradient(factor.score),
                      borderRadius: 999,
                    }}
                  />
                </div>
                <span
                  className="font-mono"
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: statusCfg.text,
                    width: 42,
                    textAlign: 'right',
                  }}
                >
                  {factor.score}%
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
