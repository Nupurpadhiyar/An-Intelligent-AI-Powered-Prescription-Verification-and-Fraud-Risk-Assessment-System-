import type { DoctorRegistryRecord } from '../types/prescription'
import { INDIAN_DOCTOR_REGISTRY, queryIndianDoctorRegistry } from '../services/indianDoctorService'

export const doctorRegistry: Record<string, DoctorRegistryRecord> = {
  // Indian Medical Council & NMC Doctors (Primary)
  'GMC-48201': INDIAN_DOCTOR_REGISTRY['GMC-48201'],
  'GMC-52190': INDIAN_DOCTOR_REGISTRY['GMC-52190'],
  'MMC-2016-03-8849': INDIAN_DOCTOR_REGISTRY['MMC-2016-03-8849'],
  'DMC-74829': INDIAN_DOCTOR_REGISTRY['DMC-74829'],
  'KMC-68492': INDIAN_DOCTOR_REGISTRY['KMC-68492'],
  'TNMC-81204': INDIAN_DOCTOR_REGISTRY['TNMC-81204'],
  'UPPMC-92014': INDIAN_DOCTOR_REGISTRY['UPPMC-92014'],

  // Indian Doctor Presets mapped to legacy IDs for sample prescriptions compatibility
  'NPI-1849201948': {
    npi: 'GMC-48201',
    name: 'Dr. Rajesh V. Sharma, MD',
    specialty: 'Internal Medicine & Critical Care',
    qualification: 'MBBS, MD (Medicine)',
    licenseNumber: 'GMC-48201',
    council: 'Gujarat Medical Council (GMC)',
    state: 'Gujarat',
    status: 'active',
    hospitalAffiliation: 'Apollo Hospitals International, Ahmedabad / Gandhinagar',
    abdmHprId: '91-4820-1948-2849@abdm',
    ndpsLicense: 'NDPS-GUJ-MED-2023-8812',
    deaNumber: 'NDPS-8812',
    deaStatus: 'active',
    phone: '+91 (79) 6670-1800',
    address: 'Plot No. 1A, GIDC Estate, Bhat, Gandhinagar, Gujarat 382428',
    verificationSource: 'NMC_INDIAN_REGISTRY',
    isLiveVerified: true,
  },
  'NPI-1049281920': {
    npi: 'GMC-52190',
    name: 'Dr. Priya N. Patel, MS',
    specialty: 'Cardiovascular Surgery',
    qualification: 'MBBS, MS (Surgery), MCh (CTVS)',
    licenseNumber: 'GMC-52190',
    council: 'Gujarat Medical Council (GMC)',
    state: 'Gujarat',
    status: 'active',
    hospitalAffiliation: 'Sterling Hospitals, Memnagar, Ahmedabad',
    abdmHprId: '91-5219-0941-1102@abdm',
    ndpsLicense: 'NDPS-GUJ-MED-2024-3401',
    deaNumber: 'NDPS-3401',
    deaStatus: 'active',
    phone: '+91 (79) 4001-1111',
    address: 'Sterling Hospital Road, Memnagar, Ahmedabad, Gujarat 380052',
    verificationSource: 'NMC_INDIAN_REGISTRY',
    isLiveVerified: true,
  },
  'NPI-1928374650': {
    npi: 'DMC-74829',
    name: 'Dr. Ananya Mukherjee, MD',
    specialty: 'Pulmonary Medicine & Infectious Diseases',
    qualification: 'MBBS, MD (Pulmonology)',
    licenseNumber: 'DMC-74829',
    council: 'Delhi Medical Council (DMC)',
    state: 'Delhi',
    status: 'active',
    hospitalAffiliation: 'All India Institute of Medical Sciences (AIIMS), New Delhi',
    abdmHprId: '91-7482-9014-4419@abdm',
    ndpsLicense: 'NDPS-DEL-AIIMS-2023-0182',
    deaNumber: 'NDPS-0182',
    deaStatus: 'active',
    phone: '+91 (11) 2658-8500',
    address: 'Sri Aurobindo Marg, Ansari Nagar East, New Delhi, Delhi 110029',
    verificationSource: 'NMC_INDIAN_REGISTRY',
    isLiveVerified: true,
  },
  'NPI-UNKNOWN': {
    npi: 'UNVERIFIED',
    name: 'Dr. J. K. Verma (Unregistered Prescriber)',
    specialty: 'General Practice (Fake Prescription Mill)',
    qualification: 'Forged Degree / Unverified',
    licenseNumber: 'FAKE-REG-9942',
    council: 'Not Listed in NMC / State Medical Councils',
    state: 'Unknown',
    status: 'revoked',
    hospitalAffiliation: 'No registered hospital affiliation found in India',
    deaNumber: 'NO-NDPS-RECORD',
    deaStatus: 'suspended',
    phone: '+91 99999-00000 (VoIP / Disposable)',
    address: 'Unlisted clinic address, suspicious letterhead',
    verificationSource: 'REGISTRY_FALLBACK',
    isLiveVerified: false,
  },
}

export function lookupDoctor(nameOrLicense: string): DoctorRegistryRecord {
  const query = nameOrLicense.toLowerCase()
  for (const record of Object.values(doctorRegistry)) {
    if (
      record.name.toLowerCase().includes(query) ||
      record.licenseNumber.toLowerCase().includes(query) ||
      record.npi.toLowerCase().includes(query)
    ) {
      return record
    }
  }
  return doctorRegistry['NPI-UNKNOWN']
}

/**
 * Real-time asynchronous lookup querying Indian NMC/SMC registry first,
 * then international CMS NPPES if needed.
 */
export async function lookupDoctorAsync(nameOrNpi: string, stateHint?: string): Promise<DoctorRegistryRecord> {
  try {
    // 1. Check Indian Medical Council registry first
    const indianResult = await queryIndianDoctorRegistry(nameOrNpi)
    if (indianResult.isFound) {
      return indianResult.record
    }

    // 2. Try CMS NPPES if it matches US query
    const { queryLiveNPPES } = await import('../services/nppesService')
    const res = await queryLiveNPPES(nameOrNpi, stateHint)
    if (res.isLiveVerified) {
      return res.record
    }

    // 3. Fallback to local
    return lookupDoctor(nameOrNpi)
  } catch {
    return lookupDoctor(nameOrNpi)
  }
}
