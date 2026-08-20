export type RiskLevel = 'valid' | 'incomplete' | 'suspicious'

export type DrugRiskLevel = 'none' | 'low' | 'moderate' | 'high' | 'critical'

export interface MedicineItem {
  name: string
  dosage: string
  frequency: string
  duration: string
  quantity: string
  schedule?: 'OTC' | 'Rx' | 'Schedule II' | 'Schedule III' | 'Schedule IV'
  risk?: DrugRiskLevel
  riskNotes?: string
  maxDailyDose?: string
  prescribedDailyDose?: string
}

export interface DrugInteractionAlert {
  drugs: [string, string]
  severity: 'mild' | 'moderate' | 'severe' | 'lethal'
  description: string
  recommendation: string
}

export interface DoctorRegistryRecord {
  npi: string
  name: string
  specialty: string
  licenseNumber: string
  state: string
  status: 'active' | 'suspended' | 'expired' | 'revoked' | 'unverified'
  hospitalAffiliation: string
  deaNumber?: string
  deaStatus?: 'active' | 'suspended' | 'not_found'
  phone: string
  address: string
}

export interface RiskFactor {
  category: 'license' | 'tamper' | 'controlled_substance' | 'clinical' | 'patient_history'
  title: string
  score: number // 0 to 100 (100 = safest, 0 = highest risk)
  status: 'pass' | 'warning' | 'fail'
  details: string
}

export interface OCRBoundingBox {
  id: string
  label: string
  field: string
  x: number // percentage 0-100
  y: number // percentage 0-100
  width: number // percentage 0-100
  height: number // percentage 0-100
  confidence: number // percentage 0-100
  value: string
  flagged?: boolean
}

export interface PrescriptionData {
  id: string
  prescriptionNumber: string
  date: string
  patient: {
    name: string
    age: number
    gender: string
    dob: string
    phone: string
    address: string
    allergies: string[]
    currentMedications?: string[]
    recentFillCount30Days?: number
  }
  doctor: {
    name: string
    npi: string
    licenseNo: string
    specialty: string
    hospital: string
    phone: string
    signaturePresent: boolean
    signatureConfidence: number
  }
  medicines: MedicineItem[]
  hospitalLetterheadDetected: boolean
  tamperDetected: boolean
  tamperConfidence: number
  tamperDetails?: string[]
  risk: RiskLevel
  overallConfidence: number
  riskScore: number // 0 (fraud) to 100 (clean)
  riskReasons: string[]
  riskFactors: RiskFactor[]
  interactions: DrugInteractionAlert[]
  doctorVerification: DoctorRegistryRecord
  boundingBoxes: OCRBoundingBox[]
  rawImage?: string
  sourceType: 'uploaded_file' | 'camera_scan' | 'sample_preset'
  status: 'pending_review' | 'verified_dispensed' | 'flagged_investigation' | 'rejected'
  reviewerNotes?: string
  reviewedBy?: string
  reviewedAt?: string
  certificateHash?: string
}

export type UserRole = 'pharmacist' | 'compliance_officer' | 'doctor' | 'admin'

export interface AuditReportSummary {
  id: string
  prescriptionNumber: string
  date: string
  doctor: string
  patient: string
  medicines: string
  risk: RiskLevel
  confidence: number
  riskScore: number
  status: 'pending_review' | 'verified_dispensed' | 'flagged_investigation' | 'rejected'
  flagCount: number
  reviewedAt?: string
}

export interface SystemAuditLog {
  id: string
  timestamp: string
  user: string
  role: string
  action: string
  type: 'upload' | 'alert' | 'dispense' | 'flag' | 'reject' | 'admin' | 'download'
  rxId?: string
}
