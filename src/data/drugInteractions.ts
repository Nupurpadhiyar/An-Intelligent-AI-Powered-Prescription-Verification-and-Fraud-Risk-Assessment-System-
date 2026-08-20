import type { DrugInteractionAlert, MedicineItem } from '../types/prescription'

export interface KnownInteraction {
  pair: [string, string]
  severity: 'mild' | 'moderate' | 'severe' | 'lethal'
  description: string
  recommendation: string
}

export const knownInteractions: KnownInteraction[] = [
  {
    pair: ['sildenafil', 'nitroglycerin'],
    severity: 'lethal',
    description: 'Co-administration can cause catastrophic, life-threatening hypotension and cardiovascular collapse.',
    recommendation: 'DO NOT DISPENSE. Absolute contraindication. Contact prescribing physician immediately.',
  },
  {
    pair: ['warfarin', 'ibuprofen'],
    severity: 'severe',
    description: 'NSAIDs strongly amplify anticoagulant effect and inhibit platelet aggregation, drastically increasing major GI hemorrhage risk.',
    recommendation: 'Use non-NSAID analgesic (e.g., Acetaminophen within safe limit) and monitor INR tightly.',
  },
  {
    pair: ['tramadol', 'sertraline'],
    severity: 'severe',
    description: 'Concurrent use increases risk of Serotonin Syndrome and lowers seizure threshold.',
    recommendation: 'Avoid combination. Monitor for agitation, hyperthermia, and tremor if clinically necessary.',
  },
  {
    pair: ['oxycodone', 'alprazolam'],
    severity: 'lethal',
    description: 'Combined Opioid + Benzodiazepine CNS depression can cause fatal respiratory arrest and coma.',
    recommendation: 'Black Box Warning: Avoid concurrent prescribing unless no alternative exists with reduced dosage & Naloxone co-prescribed.',
  },
  {
    pair: ['clarithromycin', 'atorvastatin'],
    severity: 'moderate',
    description: 'CYP3A4 inhibition increases statin plasma concentrations, elevating rhabdomyolysis and myopathy risk.',
    recommendation: 'Temporarily suspend Atorvastatin during antibiotic course or switch to Rosuvastatin / Azithromycin.',
  },
  {
    pair: ['methotrexate', 'amoxicillin'],
    severity: 'moderate',
    description: 'Penicillins reduce renal clearance of Methotrexate, potentially leading to toxic accumulation.',
    recommendation: 'Monitor complete blood count and renal function closely.',
  },
]

export const dosageThresholds: Record<string, { maxSingle: number; maxDaily: number; unit: string; schedule: MedicineItem['schedule'] }> = {
  amoxicillin: { maxSingle: 1000, maxDaily: 3000, unit: 'mg', schedule: 'Rx' },
  ibuprofen: { maxSingle: 800, maxDaily: 3200, unit: 'mg', schedule: 'OTC' },
  prednisone: { maxSingle: 60, maxDaily: 80, unit: 'mg', schedule: 'Rx' },
  oxycodone: { maxSingle: 20, maxDaily: 60, unit: 'mg', schedule: 'Schedule II' },
  alprazolam: { maxSingle: 1, maxDaily: 4, unit: 'mg', schedule: 'Schedule IV' },
  sildenafil: { maxSingle: 100, maxDaily: 100, unit: 'mg', schedule: 'Rx' },
  nitroglycerin: { maxSingle: 0.6, maxDaily: 1.8, unit: 'mg', schedule: 'Rx' },
  metformin: { maxSingle: 1000, maxDaily: 2550, unit: 'mg', schedule: 'Rx' },
  lisinopril: { maxSingle: 40, maxDaily: 80, unit: 'mg', schedule: 'Rx' },
  atorvastatin: { maxSingle: 80, maxDaily: 80, unit: 'mg', schedule: 'Rx' },
  tramadol: { maxSingle: 100, maxDaily: 400, unit: 'mg', schedule: 'Schedule IV' },
  sertraline: { maxSingle: 200, maxDaily: 200, unit: 'mg', schedule: 'Rx' },
  levothyroxine: { maxSingle: 300, maxDaily: 300, unit: 'mcg', schedule: 'Rx' },
  omeprazole: { maxSingle: 40, maxDaily: 80, unit: 'mg', schedule: 'Rx' },
}

export function checkInteractions(medications: string[], patientMedications: string[] = []): DrugInteractionAlert[] {
  const allDrugs = [...medications, ...patientMedications].map((d) => d.toLowerCase().trim())
  const alerts: DrugInteractionAlert[] = []

  for (const rule of knownInteractions) {
    const [d1, d2] = rule.pair
    const hasD1 = allDrugs.some((item) => item.includes(d1))
    const hasD2 = allDrugs.some((item) => item.includes(d2))

    if (hasD1 && hasD2) {
      alerts.push({
        drugs: [d1.toUpperCase(), d2.toUpperCase()],
        severity: rule.severity,
        description: rule.description,
        recommendation: rule.recommendation,
      })
    }
  }

  return alerts
}
