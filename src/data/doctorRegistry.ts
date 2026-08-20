import type { DoctorRegistryRecord } from '../types/prescription'

export const doctorRegistry: Record<string, DoctorRegistryRecord> = {
  'NPI-1849201948': {
    npi: '1849201948',
    name: 'Dr. Sarah Chen, MD',
    specialty: 'Internal Medicine / Pediatrics',
    licenseNumber: 'CA-MED-4821',
    state: 'California',
    status: 'active',
    hospitalAffiliation: 'Northridge Medical Center, San Francisco',
    deaNumber: 'BC1928374',
    deaStatus: 'active',
    phone: '+1 (415) 555-0192',
    address: '450 Sutter St, Suite 1200, San Francisco, CA 94108',
  },
  'NPI-1049281920': {
    npi: '1049281920',
    name: 'Dr. Priya Patel, MD',
    specialty: 'Cardiovascular Disease & Endocrinology',
    licenseNumber: 'CA-MED-9204',
    state: 'California',
    status: 'active',
    hospitalAffiliation: 'Suncoast Regional Hospital, Oakland',
    deaNumber: 'BP9284710',
    deaStatus: 'active',
    phone: '+1 (510) 555-8392',
    address: '1200 Broadway, Suite 400, Oakland, CA 94612',
  },
  'NPI-1928374650': {
    npi: '1928374650',
    name: 'Dr. James Liu, MD',
    specialty: 'Cardiology',
    licenseNumber: 'CA-MED-3910',
    state: 'California',
    status: 'active',
    hospitalAffiliation: 'Bayview Heart & Vascular Institute',
    deaNumber: 'BL3819204',
    deaStatus: 'active',
    phone: '+1 (415) 555-7381',
    address: '2200 Post St, San Francisco, CA 94115',
  },
  'NPI-UNKNOWN': {
    npi: 'UNVERIFIED',
    name: 'Dr. J. Morrison',
    specialty: 'General Practice (Unclaimed)',
    licenseNumber: 'INVALID-9942',
    state: 'Unknown',
    status: 'revoked',
    hospitalAffiliation: 'No registered medical institution affiliation',
    deaNumber: 'UNKNOWN',
    deaStatus: 'suspended',
    phone: 'Unregistered / VoIP Number',
    address: 'P.O. Box 8192, Unincorporated Area',
  },
  'NPI-1492048192': {
    npi: '1492048192',
    name: 'Dr. Angela Ross, MD',
    specialty: 'Psychiatry & Neurology',
    licenseNumber: 'CA-MED-5921',
    state: 'California',
    status: 'active',
    hospitalAffiliation: 'Pacific Neuroscience Medical Center',
    deaNumber: 'BR5829103',
    deaStatus: 'active',
    phone: '+1 (415) 555-3849',
    address: '3838 California St, San Francisco, CA 94118',
  },
  'NPI-EXPIRED': {
    npi: '1294820194',
    name: 'Dr. R. Kapoor, MD',
    specialty: 'Family Medicine',
    licenseNumber: 'CA-MED-1029',
    state: 'California',
    status: 'expired',
    hospitalAffiliation: 'Former St. Jude Clinic (Inactive)',
    deaNumber: 'BK1029384',
    deaStatus: 'suspended',
    phone: '+1 (408) 555-9102',
    address: '800 E Santa Clara St, San Jose, CA 95112',
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
