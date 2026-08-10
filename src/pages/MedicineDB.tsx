import { useState } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import type { Page } from '../App'

interface Props {
  navigate: (p: Page) => void
  darkMode: boolean
  setDarkMode: (v: boolean) => void
}

type Category = 'OTC' | 'Rx' | 'Controlled'

interface Medicine {
  name: string
  class: string
  category: Category
  schedule?: string
  warning?: string
  uses: string
}

const medicines: Medicine[] = [
  { name: 'Amoxicillin', class: 'Antibiotic', category: 'Rx', uses: 'Bacterial infections', warning: 'Allergy risk' },
  { name: 'Ibuprofen', class: 'NSAID', category: 'OTC', uses: 'Pain, fever, inflammation' },
  { name: 'Oxycodone', class: 'Opioid Analgesic', category: 'Controlled', schedule: 'Schedule II', uses: 'Severe pain', warning: 'High abuse potential — strict monitoring required' },
  { name: 'Metformin', class: 'Biguanide', category: 'Rx', uses: 'Type 2 Diabetes management' },
  { name: 'Lisinopril', class: 'ACE Inhibitor', category: 'Rx', uses: 'Hypertension, heart failure' },
  { name: 'Atorvastatin', class: 'Statin', category: 'Rx', uses: 'Cholesterol management' },
  { name: 'Alprazolam', class: 'Benzodiazepine', category: 'Controlled', schedule: 'Schedule IV', uses: 'Anxiety disorders', warning: 'Dependency risk — limited short-term use' },
  { name: 'Prednisone', class: 'Corticosteroid', category: 'Rx', uses: 'Inflammation, immune disorders', warning: 'Long-term use caution' },
  { name: 'Sertraline', class: 'SSRI', category: 'Rx', uses: 'Depression, anxiety, OCD' },
  { name: 'Levothyroxine', class: 'Thyroid Hormone', category: 'Rx', uses: 'Hypothyroidism' },
  { name: 'Hydrocodone', class: 'Opioid', category: 'Controlled', schedule: 'Schedule II', uses: 'Moderate to severe pain', warning: 'Abuse and addiction risk' },
  { name: 'Acetaminophen', class: 'Analgesic', category: 'OTC', uses: 'Pain, fever' },
  { name: 'Loratadine', class: 'Antihistamine', category: 'OTC', uses: 'Allergic rhinitis, hives' },
  { name: 'Omeprazole', class: 'Proton Pump Inhibitor', category: 'OTC', uses: 'Acid reflux, GERD' },
  { name: 'Metoprolol', class: 'Beta Blocker', category: 'Rx', uses: 'Hypertension, angina, heart failure' },
  { name: 'Warfarin', class: 'Anticoagulant', category: 'Rx', uses: 'Blood clot prevention', warning: 'Narrow therapeutic index — frequent monitoring' },
  { name: 'Adderall', class: 'CNS Stimulant', category: 'Controlled', schedule: 'Schedule II', uses: 'ADHD, narcolepsy', warning: 'High abuse potential in non-ADHD patients' },
  { name: 'Pantoprazole', class: 'Proton Pump Inhibitor', category: 'Rx', uses: 'Erosive esophagitis, H. pylori' },
]

const catCfg = {
  OTC: { color: '#00ff88', bg: 'rgba(0,255,136,0.1)', border: 'rgba(0,255,136,0.25)', label: 'OTC' },
  Rx: { color: '#00d4ff', bg: 'rgba(0,212,255,0.1)', border: 'rgba(0,212,255,0.25)', label: 'Rx Only' },
  Controlled: { color: '#ff4444', bg: 'rgba(255,68,68,0.1)', border: 'rgba(255,68,68,0.25)', label: 'Controlled' },
}

export default function MedicineDB({ navigate }: Props) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<Category | 'all'>('all')
  const [selected, setSelected] = useState<Medicine | null>(null)

  const filtered = medicines.filter((m) => {
    const q = search.toLowerCase()
    return (
      (filter === 'all' || m.category === filter) &&
      (m.name.toLowerCase().includes(q) || m.class.toLowerCase().includes(q) || m.uses.toLowerCase().includes(q))
    )
  })

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#040d1a' }}>
      <Sidebar navigate={navigate} current="medicine" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Navbar navigate={navigate} current="medicine" />
        <main style={{ flex: 1, padding: '36px 36px', overflowY: 'auto' }}>

          <div style={{ marginBottom: 28 }}>
            <h1 className="font-display" style={{ fontSize: 30, fontWeight: 800, color: '#e8f4fd', letterSpacing: '-0.02em', marginBottom: 6 }}>
              Medicine Database
            </h1>
            <p style={{ color: '#6b8fad', fontSize: 14 }}>{medicines.length} medicines indexed · Updated daily</p>
          </div>

          {/* Search + filters */}
          <div className="glass" style={{ borderRadius: 14, padding: '16px 20px', marginBottom: 24, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Search medicines, drug class, uses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                flex: 1,
                minWidth: 220,
                padding: '10px 16px',
                borderRadius: 10,
                background: 'rgba(0,212,255,0.05)',
                border: '1px solid rgba(0,212,255,0.15)',
                color: '#e8f4fd',
                fontSize: 14,
                outline: 'none',
              }}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              {(['all', 'OTC', 'Rx', 'Controlled'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 8,
                    border: `1px solid ${filter === f ? (f === 'all' ? 'rgba(0,212,255,0.4)' : catCfg[f]?.border) : 'rgba(0,212,255,0.1)'}`,
                    background: filter === f ? (f === 'all' ? 'rgba(0,212,255,0.08)' : catCfg[f]?.bg) : 'transparent',
                    color: filter === f ? (f === 'all' ? '#00d4ff' : catCfg[f]?.color) : '#6b8fad',
                    fontSize: 13,
                    cursor: 'pointer',
                    fontWeight: filter === f ? 600 : 400,
                    transition: 'all 0.2s',
                  }}
                >
                  {f === 'all' ? 'All' : f === 'OTC' ? 'OTC' : f === 'Rx' ? 'Prescription Only' : '⚠ Controlled'}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 340px' : '1fr', gap: 20 }}>
            {/* List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {filtered.map((m) => {
                const cfg = catCfg[m.category]
                return (
                  <div
                    key={m.name}
                    onClick={() => setSelected(selected?.name === m.name ? null : m)}
                    className="glass card-hover"
                    style={{
                      borderRadius: 12,
                      padding: '16px 20px',
                      cursor: 'pointer',
                      borderColor: selected?.name === m.name ? cfg.border : undefined,
                      background: selected?.name === m.name ? cfg.bg : undefined,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
                          <span className="font-display" style={{ fontSize: 16, fontWeight: 700, color: '#e8f4fd' }}>
                            {m.name}
                          </span>
                          {m.warning && (
                            <span style={{ fontSize: 11, color: '#ffb800' }}>⚠</span>
                          )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <span style={{ fontSize: 13, color: '#6b8fad' }}>{m.class}</span>
                          <span style={{ fontSize: 12, color: '#2a4a6b' }}>·</span>
                          <span style={{ fontSize: 13, color: '#a8c8e8' }}>{m.uses}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {m.schedule && (
                          <span
                            className="font-mono"
                            style={{
                              fontSize: 11,
                              padding: '3px 8px',
                              borderRadius: 5,
                              background: 'rgba(255,68,68,0.08)',
                              color: '#ff4444',
                              border: '1px solid rgba(255,68,68,0.2)',
                            }}
                          >
                            {m.schedule}
                          </span>
                        )}
                        <span
                          style={{
                            padding: '4px 12px',
                            borderRadius: 8,
                            background: cfg.bg,
                            border: `1px solid ${cfg.border}`,
                            color: cfg.color,
                            fontSize: 12,
                            fontWeight: 600,
                          }}
                        >
                          {cfg.label}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
              {filtered.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', color: '#6b8fad' }}>
                  No medicines found. Try a different search.
                </div>
              )}
            </div>

            {/* Detail panel */}
            {selected && (
              <div
                className="glass"
                style={{
                  borderRadius: 16,
                  padding: '24px',
                  height: 'fit-content',
                  position: 'sticky',
                  top: 20,
                  border: `1px solid ${catCfg[selected.category].border}`,
                }}
              >
                <button
                  onClick={() => setSelected(null)}
                  style={{ float: 'right', background: 'none', border: 'none', color: '#6b8fad', cursor: 'pointer', fontSize: 18 }}
                >
                  ×
                </button>
                <h3 className="font-display" style={{ fontSize: 22, fontWeight: 800, color: '#e8f4fd', marginBottom: 4 }}>
                  {selected.name}
                </h3>
                <div style={{ color: '#6b8fad', fontSize: 14, marginBottom: 20 }}>{selected.class}</div>

                {[
                  { label: 'Category', value: catCfg[selected.category].label, color: catCfg[selected.category].color },
                  { label: 'Schedule', value: selected.schedule || 'N/A', color: selected.schedule ? '#ff4444' : '#6b8fad' },
                  { label: 'Uses', value: selected.uses, color: '#a8c8e8' },
                ].map((f) => (
                  <div key={f.label} style={{ marginBottom: 14 }}>
                    <div className="font-mono" style={{ fontSize: 10, color: '#6b8fad', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>
                      {f.label}
                    </div>
                    <div style={{ fontSize: 14, color: f.color, fontWeight: 500 }}>{f.value}</div>
                  </div>
                ))}

                {selected.warning && (
                  <div
                    style={{
                      marginTop: 16,
                      padding: '12px 16px',
                      borderRadius: 10,
                      background: 'rgba(255,68,68,0.08)',
                      border: '1px solid rgba(255,68,68,0.25)',
                    }}
                  >
                    <div style={{ fontSize: 11, color: '#ff4444', fontWeight: 700, marginBottom: 4 }}>⚠ WARNING</div>
                    <div style={{ fontSize: 13, color: '#ffb8b8', lineHeight: 1.5 }}>{selected.warning}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
