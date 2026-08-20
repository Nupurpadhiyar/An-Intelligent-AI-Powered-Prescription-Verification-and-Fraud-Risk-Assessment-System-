import React, { createContext, useContext, useState, useEffect } from 'react'
import type {
  PrescriptionData,
  AuditReportSummary,
  SystemAuditLog,
  UserRole,
} from '../types/prescription'
import { samplePrescriptions } from '../data/samplePrescriptions'

interface PrescriptionContextType {
  activeRx: PrescriptionData
  setActiveRx: (rx: PrescriptionData) => void
  auditHistory: AuditReportSummary[]
  systemLogs: SystemAuditLog[]
  userRole: UserRole
  setUserRole: (role: UserRole) => void
  processUploadedPrescription: (data: PrescriptionData) => void
  updatePrescriptionStatus: (
    id: string,
    status: PrescriptionData['status'],
    notes?: string
  ) => void
  deleteReport: (id: string) => void
  addSystemLog: (action: string, type: SystemAuditLog['type'], rxId?: string) => void
  resetToDefaultData: () => void
}

const PrescriptionContext = createContext<PrescriptionContextType | undefined>(undefined)

const INITIAL_AUDIT_HISTORY: AuditReportSummary[] = [
  {
    id: 'RX-10291',
    prescriptionNumber: 'RX-2026-10291',
    date: '2026-08-15',
    doctor: 'Dr. Sarah Chen, MD',
    patient: 'Marcus Thompson',
    medicines: 'Amoxicillin 500mg, Ibuprofen 400mg, Prednisone 20mg',
    risk: 'valid',
    confidence: 97.4,
    riskScore: 96,
    status: 'verified_dispensed',
    flagCount: 0,
    reviewedAt: '2026-08-15 14:32',
  },
  {
    id: 'RX-10290',
    prescriptionNumber: 'RX-2026-10290',
    date: '2026-08-16',
    doctor: 'Dr. Priya Patel, MD',
    patient: 'Elena Vasquez',
    medicines: 'Sildenafil 100mg, Lisinopril 20mg',
    risk: 'incomplete',
    confidence: 62.5,
    riskScore: 58,
    status: 'pending_review',
    flagCount: 2,
    reviewedAt: '2026-08-16 11:15',
  },
  {
    id: 'RX-10289',
    prescriptionNumber: 'RX-2026-10289',
    date: '2026-08-14',
    doctor: 'Dr. J. Morrison',
    patient: 'Unverified John Doe',
    medicines: 'Oxycodone HCl 80mg',
    risk: 'suspicious',
    confidence: 18.4,
    riskScore: 14,
    status: 'flagged_investigation',
    flagCount: 5,
    reviewedAt: '2026-08-14 16:45',
  },
  {
    id: 'RX-10288',
    prescriptionNumber: 'RX-2026-10288',
    date: '2026-08-13',
    doctor: 'Dr. James Liu, MD',
    patient: 'Aisha Okonkwo',
    medicines: 'Atorvastatin 40mg, Metoprolol 50mg',
    risk: 'valid',
    confidence: 94.2,
    riskScore: 94,
    status: 'verified_dispensed',
    flagCount: 0,
    reviewedAt: '2026-08-13 10:20',
  },
  {
    id: 'RX-10287',
    prescriptionNumber: 'RX-2026-10287',
    date: '2026-08-12',
    doctor: 'Dr. Angela Ross, MD',
    patient: 'David Park',
    medicines: 'Sertraline 50mg',
    risk: 'valid',
    confidence: 91.7,
    riskScore: 92,
    status: 'verified_dispensed',
    flagCount: 0,
    reviewedAt: '2026-08-12 09:15',
  },
  {
    id: 'RX-10286',
    prescriptionNumber: 'RX-2026-10286',
    date: '2026-08-16',
    doctor: 'Dr. R. Kapoor, MD',
    patient: 'Sofia Mendez',
    medicines: 'Alprazolam 4mg #120',
    risk: 'suspicious',
    confidence: 31.5,
    riskScore: 28,
    status: 'rejected',
    flagCount: 4,
    reviewedAt: '2026-08-16 17:02',
  },
]

const INITIAL_LOGS: SystemAuditLog[] = [
  { id: 'LOG-1', timestamp: '14:32:01', user: 'Dr. Sarah Chen', role: 'Pharmacist', action: 'Uploaded prescription RX-10291', type: 'upload', rxId: 'RX-10291' },
  { id: 'LOG-2', timestamp: '14:29:44', user: 'System AI Engine', role: 'System', action: 'Flagged RX-10289 as SUSPICIOUS (Schedule II Opioid)', type: 'alert', rxId: 'RX-10289' },
  { id: 'LOG-3', timestamp: '14:15:12', user: 'Marcus Thompson', role: 'Technician', action: 'Viewed risk report for RX-10290', type: 'upload', rxId: 'RX-10290' },
  { id: 'LOG-4', timestamp: '13:58:30', user: 'James Liu (Admin)', role: 'Admin', action: 'Updated doctor license registry cache', type: 'admin' },
  { id: 'LOG-5', timestamp: '13:41:09', user: 'Priya Patel', role: 'Doctor', action: 'Generated digital audit certificate for RX-10288', type: 'download', rxId: 'RX-10288' },
  { id: 'LOG-6', timestamp: '13:22:55', user: 'System AI Engine', role: 'System', action: 'Auto-flagged Alprazolam 4mg — dosage exceeds safe maximum', type: 'alert', rxId: 'RX-10286' },
]

export const PrescriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeRx, setActiveRxState] = useState<PrescriptionData>(() => {
    const saved = localStorage.getItem('rxshield_active_rx')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error('Failed to parse saved active Rx', e)
      }
    }
    return samplePrescriptions[0]
  })

  const [auditHistory, setAuditHistory] = useState<AuditReportSummary[]>(() => {
    const saved = localStorage.getItem('rxshield_audit_history')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error('Failed to parse saved audit history', e)
      }
    }
    return INITIAL_AUDIT_HISTORY
  })

  const [systemLogs, setSystemLogs] = useState<SystemAuditLog[]>(() => {
    const saved = localStorage.getItem('rxshield_system_logs')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error('Failed to parse saved system logs', e)
      }
    }
    return INITIAL_LOGS
  })

  const [userRole, setUserRoleState] = useState<UserRole>(() => {
    const saved = localStorage.getItem('rxshield_user_role')
    return (saved as UserRole) || 'pharmacist'
  })

  useEffect(() => {
    localStorage.setItem('rxshield_active_rx', JSON.stringify(activeRx))
  }, [activeRx])

  useEffect(() => {
    localStorage.setItem('rxshield_audit_history', JSON.stringify(auditHistory))
  }, [auditHistory])

  useEffect(() => {
    localStorage.setItem('rxshield_system_logs', JSON.stringify(systemLogs))
  }, [systemLogs])

  useEffect(() => {
    localStorage.setItem('rxshield_user_role', userRole)
  }, [userRole])

  const setActiveRx = (rx: PrescriptionData) => {
    setActiveRxState(rx)
  }

  const setUserRole = (role: UserRole) => {
    setUserRoleState(role)
    addSystemLog(`Switched active workspace role to ${role.toUpperCase().replace('_', ' ')}`, 'admin')
  }

  const addSystemLog = (action: string, type: SystemAuditLog['type'], rxId?: string) => {
    const now = new Date()
    const timeStr = now.toTimeString().split(' ')[0]
    const newLog: SystemAuditLog = {
      id: `LOG-${Date.now()}`,
      timestamp: timeStr,
      user: userRole === 'admin' ? 'Administrator' : userRole === 'compliance_officer' ? 'Compliance Officer' : userRole === 'doctor' ? 'Dr. Sarah Chen' : 'Staff Pharmacist',
      role: userRole,
      action,
      type,
      rxId,
    }
    setSystemLogs((prev) => [newLog, ...prev.slice(0, 49)])
  }

  const processUploadedPrescription = (data: PrescriptionData) => {
    setActiveRxState(data)

    // Add to audit history
    const summary: AuditReportSummary = {
      id: data.id,
      prescriptionNumber: data.prescriptionNumber,
      date: data.date,
      doctor: data.doctor.name,
      patient: data.patient.name,
      medicines: data.medicines.map((m) => `${m.name} ${m.dosage}`).join(', '),
      risk: data.risk,
      confidence: data.overallConfidence,
      riskScore: data.riskScore,
      status: data.status,
      flagCount: data.riskReasons.length,
      reviewedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    }

    setAuditHistory((prev) => [summary, ...prev.filter((item) => item.id !== data.id)])
    addSystemLog(`Processed & verified prescription ${data.id} via AI OCR Engine`, 'upload', data.id)
  }

  const updatePrescriptionStatus = (
    id: string,
    status: PrescriptionData['status'],
    notes?: string
  ) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16)
    if (activeRx && activeRx.id === id) {
      setActiveRxState((prev) => ({
        ...prev,
        status,
        reviewerNotes: notes || prev.reviewerNotes,
        reviewedBy: userRole === 'pharmacist' ? 'Staff Pharmacist' : userRole === 'compliance_officer' ? 'Compliance Lead' : 'System Admin',
        reviewedAt: nowStr,
      }))
    }

    setAuditHistory((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status, reviewedAt: nowStr } : item
      )
    )

    const actionText =
      status === 'verified_dispensed'
        ? `Approved and dispensed prescription ${id}`
        : status === 'flagged_investigation'
        ? `Flagged prescription ${id} for compliance audit`
        : status === 'rejected'
        ? `Rejected prescription ${id} due to security/clinical risk`
        : `Updated status of prescription ${id}`

    addSystemLog(actionText, status === 'verified_dispensed' ? 'dispense' : status === 'rejected' ? 'reject' : 'flag', id)
  }

  const deleteReport = (id: string) => {
    setAuditHistory((prev) => prev.filter((item) => item.id !== id))
    addSystemLog(`Deleted audit record ${id}`, 'admin', id)
  }

  const resetToDefaultData = () => {
    setActiveRxState(samplePrescriptions[0])
    setAuditHistory(INITIAL_AUDIT_HISTORY)
    setSystemLogs(INITIAL_LOGS)
    localStorage.removeItem('rxshield_active_rx')
    localStorage.removeItem('rxshield_audit_history')
    localStorage.removeItem('rxshield_system_logs')
  }

  return (
    <PrescriptionContext.Provider
      value={{
        activeRx,
        setActiveRx,
        auditHistory,
        systemLogs,
        userRole,
        setUserRole,
        processUploadedPrescription,
        updatePrescriptionStatus,
        deleteReport,
        addSystemLog,
        resetToDefaultData,
      }}
    >
      {children}
    </PrescriptionContext.Provider>
  )
}

export function usePrescriptions() {
  const context = useContext(PrescriptionContext)
  if (!context) {
    throw new Error('usePrescriptions must be used within a PrescriptionProvider')
  }
  return context
}
