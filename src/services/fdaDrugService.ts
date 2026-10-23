import type { DrugInteractionAlert, MedicineItem } from '../types/prescription'
import { knownInteractions, dosageThresholds } from '../data/drugInteractions'

export interface LiveDrugAnalysisResult {
  drugName: string
  rxNormCui?: string
  fdaGenericName?: string
  fdaBoxedWarning?: string
  fdaContraindications?: string
  scheduleClass: MedicineItem['schedule']
  dosageAlert?: string
  allergyConflict?: string
  isFdaVerified: boolean
}

export interface ClinicalSafetyReport {
  analyzedDrugs: LiveDrugAnalysisResult[]
  interactions: DrugInteractionAlert[]
  allergyAlerts: string[]
  dosageAlerts: string[]
  overallClinicalRisk: 'none' | 'low' | 'moderate' | 'high' | 'critical'
}

// In-memory cache for API responses
const rxNormCache = new Map<string, string | null>()
const fdaLabelCache = new Map<string, any>()

/**
 * Normalizes drug name using the National Library of Medicine (NLM) RxNorm API.
 * 100% Free, Public, NIH NLM, No API key required.
 */
export async function queryRxNormCui(drugName: string): Promise<string | null> {
  const cleanName = drugName.replace(/\d+.*$/g, '').trim().toLowerCase()
  if (!cleanName) return null

  if (rxNormCache.has(cleanName)) {
    return rxNormCache.get(cleanName) || null
  }

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 4500)
    const url = `https://rxnav.nlm.nih.gov/REST/rxcui.json?name=${encodeURIComponent(cleanName)}`
    const res = await fetch(url, { headers: { Accept: 'application/json' }, signal: controller.signal })
    clearTimeout(timeout)

    if (res.ok) {
      const json = await res.json()
      const rxCui = json?.idGroup?.rxnormId?.[0] || null
      rxNormCache.set(cleanName, rxCui)
      return rxCui
    }
  } catch (err) {
    console.warn('[RxNorm Service] Network error or timeout:', err)
  }

  rxNormCache.set(cleanName, null)
  return null
}

/**
 * Queries the official US FDA Drug Labeling API for clinical safety information.
 * 100% Free, Public, OpenFDA, No key required.
 */
export async function queryOpenFdaDrugLabel(drugName: string): Promise<any | null> {
  const cleanName = drugName.replace(/\d+.*$/g, '').trim().toLowerCase()
  if (!cleanName) return null

  if (fdaLabelCache.has(cleanName)) {
    return fdaLabelCache.get(cleanName)
  }

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)
    const query = encodeURIComponent(`openfda.generic_name:"${cleanName}"+openfda.brand_name:"${cleanName}"`)
    const url = `https://api.fda.gov/drug/label.json?search=${query}&limit=1`
    const res = await fetch(url, { signal: controller.signal })
    clearTimeout(timeout)

    if (res.ok) {
      const json = await res.json()
      const label = json?.results?.[0] || null
      fdaLabelCache.set(cleanName, label)
      return label
    }
  } catch (err) {
    console.warn('[OpenFDA Service] Network error or timeout:', err)
  }

  fdaLabelCache.set(cleanName, null)
  return null
}

/**
 * Checks if prescribed medicine conflicts with patient's documented allergies.
 */
function checkAllergyConflict(drugName: string, allergies: string[]): string | undefined {
  const lowerDrug = drugName.toLowerCase()
  for (const allergy of allergies) {
    const lowerAllergy = allergy.toLowerCase()
    // Penicillin class cross-reactivity
    if (lowerAllergy.includes('penicillin') && (lowerDrug.includes('amoxicillin') || lowerDrug.includes('ampicillin') || lowerDrug.includes('augmentin') || lowerDrug.includes('penicillin'))) {
      return `Known Allergy Conflict: Patient allergic to "${allergy}", but prescribed penicillin-class derivative "${drugName}". Severe anaphylaxis risk.`
    }
    // Sulfa class cross-reactivity
    if (lowerAllergy.includes('sulfa') && (lowerDrug.includes('sulfamethoxazole') || lowerDrug.includes('bactrim') || lowerDrug.includes('sulfasalazine'))) {
      return `Known Allergy Conflict: Patient allergic to "${allergy}", but prescribed sulfonamide "${drugName}".`
    }
    // Direct string match
    if (lowerAllergy && lowerDrug.includes(lowerAllergy)) {
      return `Direct Allergy Match: Patient documented allergy to "${allergy}".`
    }
  }
  return undefined
}

/**
 * Comprehensive clinical verification combining RxNorm, OpenFDA, DDI, and Dosage thresholds.
 */
export async function evaluatePrescriptionClinicalSafety(
  medicines: MedicineItem[],
  patientAllergies: string[] = [],
  patientCurrentMeds: string[] = []
): Promise<ClinicalSafetyReport> {
  const analyzedDrugs: LiveDrugAnalysisResult[] = []
  const allergyAlerts: string[] = []
  const dosageAlerts: string[] = []
  const combinedDrugNames = medicines.map((m) => m.name.toLowerCase().trim())

  // Run live OpenFDA and RxNorm queries concurrently for all medicines
  const promises = medicines.map(async (med) => {
    const rawClean = med.name.replace(/\d+.*$/g, '').trim().toLowerCase()
    const [rxCui, fdaData] = await Promise.all([
      queryRxNormCui(rawClean),
      queryOpenFdaDrugLabel(rawClean),
    ])

    // Detect Schedule class
    let schedule = med.schedule || 'Rx'
    if (dosageThresholds[rawClean]?.schedule) {
      schedule = dosageThresholds[rawClean].schedule
    }

    // Check allergy
    const allergyIssue = checkAllergyConflict(med.name, patientAllergies)
    if (allergyIssue) {
      allergyAlerts.push(allergyIssue)
    }

    // Check dosage
    let dosageAlert: string | undefined
    const threshold = dosageThresholds[rawClean]
    if (threshold && med.dosage) {
      const matchNum = med.dosage.match(/(\d+(\.\d+)?)/)
      if (matchNum) {
        const val = parseFloat(matchNum[1])
        if (val > threshold.maxDaily) {
          dosageAlert = `Dose Exceeds Maximum: ${val}${threshold.unit} prescribed exceeds FDA maximum daily threshold of ${threshold.maxDaily}${threshold.unit}.`
          dosageAlerts.push(dosageAlert)
        }
      }
    }

    const boxedWarning = fdaData?.boxed_warning?.[0] ? fdaData.boxed_warning[0].slice(0, 260) + '...' : undefined
    const contra = fdaData?.contraindications?.[0] ? fdaData.contraindications[0].slice(0, 260) + '...' : undefined
    const generic = fdaData?.openfda?.generic_name?.[0] || undefined

    const analyzed: LiveDrugAnalysisResult = {
      drugName: med.name,
      rxNormCui: rxCui || undefined,
      fdaGenericName: generic,
      fdaBoxedWarning: boxedWarning,
      fdaContraindications: contra,
      scheduleClass: schedule,
      dosageAlert,
      allergyConflict: allergyIssue,
      isFdaVerified: Boolean(fdaData || rxCui),
    }

    return analyzed
  })

  const analyzedList = await Promise.all(promises)
  analyzedDrugs.push(...analyzedList)

  // Evaluate Drug-Drug Interactions
  const allMedNames = [...combinedDrugNames, ...patientCurrentMeds.map((m) => m.toLowerCase().trim())]
  const interactions: DrugInteractionAlert[] = []

  for (const rule of knownInteractions) {
    const [d1, d2] = rule.pair
    const hasD1 = allMedNames.some((m) => m.includes(d1))
    const hasD2 = allMedNames.some((m) => m.includes(d2))

    if (hasD1 && hasD2) {
      interactions.push({
        drugs: [d1.toUpperCase(), d2.toUpperCase()],
        severity: rule.severity,
        description: rule.description,
        recommendation: rule.recommendation,
      })
    }
  }

  // Calculate overall clinical risk
  let overallClinicalRisk: 'none' | 'low' | 'moderate' | 'high' | 'critical' = 'none'
  if (interactions.some((i) => i.severity === 'lethal') || allergyAlerts.length > 0) {
    overallClinicalRisk = 'critical'
  } else if (interactions.some((i) => i.severity === 'severe') || dosageAlerts.length > 0) {
    overallClinicalRisk = 'high'
  } else if (interactions.some((i) => i.severity === 'moderate')) {
    overallClinicalRisk = 'moderate'
  } else if (interactions.some((i) => i.severity === 'mild')) {
    overallClinicalRisk = 'low'
  }

  return {
    analyzedDrugs,
    interactions,
    allergyAlerts,
    dosageAlerts,
    overallClinicalRisk,
  }
}
