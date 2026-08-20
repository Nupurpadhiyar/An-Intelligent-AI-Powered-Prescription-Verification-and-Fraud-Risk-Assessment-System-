import { usePrescriptions } from '../context/PrescriptionContext'
import type { UserRole } from '../types/prescription'

export default function RoleSelector() {
  const { userRole, setUserRole } = usePrescriptions()

  const roles: { id: UserRole; label: string; icon: string; badge: string; color: string }[] = [
    { id: 'pharmacist', label: 'Staff Pharmacist', icon: '💊', badge: 'Dispensing', color: '#00d4ff' },
    { id: 'compliance_officer', label: 'Compliance Lead', icon: '🛡️', badge: 'Auditor', color: '#ffb800' },
    { id: 'doctor', label: 'Prescribing Physician', icon: '🩺', badge: 'Doctor', color: '#00ff88' },
    { id: 'admin', label: 'System Administrator', icon: '⚙️', badge: 'Full Access', color: '#a855f7' },
  ]

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(0, 212, 255, 0.06)',
        border: '1px solid rgba(0, 212, 255, 0.2)',
        borderRadius: 10,
        padding: '3px 6px',
        gap: 4,
      }}
    >
      <span style={{ fontSize: 11, color: '#6b8fad', fontWeight: 600, padding: '0 4px', textTransform: 'uppercase' }}>
        Role:
      </span>
      <div style={{ display: 'flex', gap: 2 }}>
        {roles.map((r) => {
          const isActive = userRole === r.id
          return (
            <button
              key={r.id}
              onClick={() => setUserRole(r.id)}
              style={{
                background: isActive ? 'rgba(0, 212, 255, 0.2)' : 'transparent',
                border: `1px solid ${isActive ? r.color : 'transparent'}`,
                color: isActive ? '#e8f4fd' : '#8bb0ce',
                padding: '4px 10px',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                transition: 'all 0.15s ease',
              }}
              title={`Switch role to ${r.label}`}
            >
              <span>{r.icon}</span>
              <span>{r.badge}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
