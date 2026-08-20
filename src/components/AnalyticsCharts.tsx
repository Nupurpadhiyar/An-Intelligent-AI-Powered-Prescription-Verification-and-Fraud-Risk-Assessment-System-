import type { AuditReportSummary } from '../types/prescription'

interface AnalyticsChartsProps {
  reports: AuditReportSummary[]
}

export default function AnalyticsCharts({ reports }: AnalyticsChartsProps) {
  const total = reports.length || 1
  const validCount = reports.filter((r) => r.risk === 'valid').length
  const incompleteCount = reports.filter((r) => r.risk === 'incomplete').length
  const suspiciousCount = reports.filter((r) => r.risk === 'suspicious').length

  const validPct = Math.round((validCount / total) * 100)
  const incompletePct = Math.round((incompleteCount / total) * 100)
  const suspiciousPct = Math.round((suspiciousCount / total) * 100)

  const topFlaggedMeds = [
    { name: 'Oxycodone 80mg', count: 14, risk: 'critical', schedule: 'Schedule II' },
    { name: 'Alprazolam 4mg', count: 11, risk: 'high', schedule: 'Schedule IV' },
    { name: 'Sildenafil + Nitrates', count: 8, risk: 'critical', schedule: 'DDI Contraindicated' },
    { name: 'Hydrocodone 10mg', count: 6, risk: 'high', schedule: 'Schedule II' },
    { name: 'Carisoprodol 350mg', count: 4, risk: 'moderate', schedule: 'Schedule IV' },
  ]

  const weeklyTrend = [
    { day: 'Mon', total: 42, flagged: 4 },
    { day: 'Tue', total: 58, flagged: 7 },
    { day: 'Wed', total: 64, flagged: 5 },
    { day: 'Thu', total: 71, flagged: 11 },
    { day: 'Fri', total: 85, flagged: 14 },
    { day: 'Sat', total: 50, flagged: 3 },
    { day: 'Sun', total: 32, flagged: 2 },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginBottom: 28 }}>
      {/* Top Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        <div className="glass" style={{ padding: '18px 20px', borderRadius: 14, border: '1px solid rgba(0,212,255,0.15)' }}>
          <div style={{ fontSize: 12, color: '#6b8fad', fontWeight: 600, textTransform: 'uppercase' }}>Total Audited Prescriptions</div>
          <div className="font-display" style={{ fontSize: 28, fontWeight: 800, color: '#e8f4fd', marginTop: 4 }}>
            {reports.length}
          </div>
          <div style={{ fontSize: 12, color: '#00ff88', marginTop: 4 }}>+18.4% this week</div>
        </div>

        <div className="glass" style={{ padding: '18px 20px', borderRadius: 14, border: '1px solid rgba(0,255,136,0.15)' }}>
          <div style={{ fontSize: 12, color: '#6b8fad', fontWeight: 600, textTransform: 'uppercase' }}>Clean Dispensing Rate</div>
          <div className="font-display" style={{ fontSize: 28, fontWeight: 800, color: '#00ff88', marginTop: 4 }}>
            {validPct}%
          </div>
          <div style={{ fontSize: 12, color: '#6b8fad', marginTop: 4 }}>{validCount} verified authentic</div>
        </div>

        <div className="glass" style={{ padding: '18px 20px', borderRadius: 14, border: '1px solid rgba(255,68,68,0.15)' }}>
          <div style={{ fontSize: 12, color: '#6b8fad', fontWeight: 600, textTransform: 'uppercase' }}>Fraud & Tamper Intercepts</div>
          <div className="font-display" style={{ fontSize: 28, fontWeight: 800, color: '#ff4444', marginTop: 4 }}>
            {suspiciousCount}
          </div>
          <div style={{ fontSize: 12, color: '#ff4444', marginTop: 4 }}>High-risk fills prevented</div>
        </div>

        <div className="glass" style={{ padding: '18px 20px', borderRadius: 14, border: '1px solid rgba(255,184,0,0.15)' }}>
          <div style={{ fontSize: 12, color: '#6b8fad', fontWeight: 600, textTransform: 'uppercase' }}>Clinical Incomplete Flags</div>
          <div className="font-display" style={{ fontSize: 28, fontWeight: 800, color: '#ffb800', marginTop: 4 }}>
            {incompleteCount}
          </div>
          <div style={{ fontSize: 12, color: '#6b8fad', marginTop: 4 }}>Requiring pharmacist review</div>
        </div>
      </div>

      {/* Grid: 2 Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 20 }}>
        {/* Verification Outcomes & Risk Breakdown */}
        <div className="glass" style={{ padding: 22, borderRadius: 16, border: '1px solid rgba(0,212,255,0.15)', background: '#071428' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h4 style={{ fontSize: 16, fontWeight: 700, color: '#e8f4fd', margin: 0 }}>
              Risk Distribution Breakdown
            </h4>
            <span style={{ fontSize: 12, color: '#6b8fad' }}>Live Cohort</span>
          </div>

          {/* Multi-segmented distribution bar */}
          <div style={{ height: 16, width: '100%', borderRadius: 999, overflow: 'hidden', display: 'flex', marginBottom: 20 }}>
            <div style={{ width: `${validPct}%`, background: '#00ff88', transition: 'width 0.5s' }} title={`Valid: ${validPct}%`} />
            <div style={{ width: `${incompletePct}%`, background: '#ffb800', transition: 'width 0.5s' }} title={`Incomplete: ${incompletePct}%`} />
            <div style={{ width: `${suspiciousPct}%`, background: '#ff4444', transition: 'width 0.5s' }} title={`Suspicious: ${suspiciousPct}%`} />
          </div>

          {/* Legend Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: '#00ff88' }} />
                <span style={{ color: '#e8f4fd' }}>Legitimate / Clean Prescriptions</span>
              </div>
              <span style={{ fontWeight: 700, color: '#00ff88' }}>{validCount} ({validPct}%)</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: '#ffb800' }} />
                <span style={{ color: '#e8f4fd' }}>Incomplete / Clinical Interaction</span>
              </div>
              <span style={{ fontWeight: 700, color: '#ffb800' }}>{incompleteCount} ({incompletePct}%)</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: '#ff4444' }} />
                <span style={{ color: '#e8f4fd' }}>Suspicious / High Forgery Probability</span>
              </div>
              <span style={{ fontWeight: 700, color: '#ff4444' }}>{suspiciousCount} ({suspiciousPct}%)</span>
            </div>
          </div>
        </div>

        {/* Top Flagged High-Risk Medications */}
        <div className="glass" style={{ padding: 22, borderRadius: 16, border: '1px solid rgba(0,212,255,0.15)', background: '#071428' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h4 style={{ fontSize: 16, fontWeight: 700, color: '#e8f4fd', margin: 0 }}>
              Top Flagged Controlled Substances
            </h4>
            <span style={{ fontSize: 12, color: '#ff4444', fontWeight: 600 }}>Watchlist</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {topFlaggedMeds.map((med, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: '#e8f4fd', fontWeight: 600 }}>{med.name}</span>
                  <span style={{ color: '#6b8fad' }}>{med.count} flags • <span style={{ color: med.risk === 'critical' ? '#ff4444' : '#ffb800' }}>{med.schedule}</span></span>
                </div>
                <div style={{ width: '100%', height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 999, overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${(med.count / 15) * 100}%`,
                      background: med.risk === 'critical' ? 'linear-gradient(90deg, #ff4444, #ef4444)' : 'linear-gradient(90deg, #ffb800, #f59e0b)',
                      borderRadius: 999,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly Velocity Chart */}
      <div className="glass" style={{ padding: 22, borderRadius: 16, border: '1px solid rgba(0,212,255,0.15)', background: '#071428' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div>
            <h4 style={{ fontSize: 16, fontWeight: 700, color: '#e8f4fd', margin: 0 }}>
              Weekly Verification Velocity & Interception Trends
            </h4>
            <p style={{ fontSize: 12, color: '#6b8fad', margin: '2px 0 0 0' }}>Daily volume vs flagged high-risk prescription intercepts</p>
          </div>
          <div style={{ display: 'flex', gap: 14, fontSize: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 10, height: 10, background: '#00d4ff', borderRadius: 2 }} />
              <span style={{ color: '#a8c8e8' }}>Verified Volume</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 10, height: 10, background: '#ff4444', borderRadius: 2 }} />
              <span style={{ color: '#a8c8e8' }}>Risk Flags</span>
            </div>
          </div>
        </div>

        {/* SVG Velocity Bar Chart */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: 120, paddingTop: 10, paddingBottom: 10, borderBottom: '1px solid rgba(0,212,255,0.1)' }}>
          {weeklyTrend.map((item, idx) => {
            const maxVal = 90
            const totalHeight = (item.total / maxVal) * 100
            const flagHeight = (item.flagged / maxVal) * 100
            return (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 90 }}>
                  {/* Total Volume Bar */}
                  <div
                    style={{
                      width: 14,
                      height: `${totalHeight}%`,
                      background: 'linear-gradient(180deg, #00d4ff 0%, rgba(0,212,255,0.4) 100%)',
                      borderRadius: '4px 4px 0 0',
                    }}
                    title={`${item.day}: ${item.total} total verifications`}
                  />
                  {/* Flagged Bar */}
                  <div
                    style={{
                      width: 14,
                      height: `${flagHeight}%`,
                      background: 'linear-gradient(180deg, #ff4444 0%, rgba(255,68,68,0.4) 100%)',
                      borderRadius: '4px 4px 0 0',
                    }}
                    title={`${item.day}: ${item.flagged} flagged`}
                  />
                </div>
                <span style={{ fontSize: 11, color: '#6b8fad', fontWeight: 600 }}>{item.day}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
