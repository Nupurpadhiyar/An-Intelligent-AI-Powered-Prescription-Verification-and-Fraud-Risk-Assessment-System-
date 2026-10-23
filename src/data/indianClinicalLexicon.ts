/**
 * Comprehensive Indian Clinical Pharmacopeia & Fuzzy Handwriting Lexicon.
 * Designed to decode handwritten prescription abbreviations, typos, and shorthand (e.g. "Dlo 650", "Augmntn", "1-0-1", "TDS").
 */

export interface ClinicalDrugEntry {
  brandName: string
  genericName: string
  defaultDosage: string
  commonDosages: string[]
  standardFrequency: string
  schedule: 'OTC' | 'Rx' | 'Schedule II' | 'Schedule III' | 'Schedule IV' | 'Schedule H' | 'Schedule H1' | 'Schedule X'
  category: string
  aliases: string[]
}

/**
 * Top 100+ frequently prescribed Indian medications (Brand + Generic Molecules).
 * Covers Antibiotics, Analgesics, Antacids/PPIs, Cardiovascular, Antidiabetic, Respiratory & Antiallergic.
 */
export const CLINICAL_LEXICON: ClinicalDrugEntry[] = [
  // Cardiovascular, Gastrointestinal & Glaucoma (Riverside & Clinical Trials)
  {
    brandName: 'Betaloc',
    genericName: 'Metoprolol Tartrate',
    defaultDosage: '100mg',
    commonDosages: ['25mg', '50mg', '100mg', '200mg'],
    standardFrequency: '1 tab BID (Twice daily)',
    schedule: 'Rx',
    category: 'Selective Beta-1 Adrenergic Receptor Blocker / Antihypertensive',
    aliases: ['betaloc', 'betaloc-100', 'metoprolol', 'lopressor', 'toprol', 'betaloc 100mg', 'betalok', 'betaloc100', 'shultersto'],
  },
  {
    brandName: 'Dorzolamidum',
    genericName: 'Dorzolamide Hydrochloride',
    defaultDosage: '10mg',
    commonDosages: ['10mg', '20mg', '2%', '5ml'],
    standardFrequency: '1 tab / drop BID (Twice daily)',
    schedule: 'Rx',
    category: 'Carbonic Anhydrase Inhibitor / Glaucoma & Ocular Pressure',
    aliases: ['dorzolamidum', 'dorzolamide', 'trusopt', 'dorzox', 'orzolamidum', 'dorzolam', 'orzolamid'],
  },
  {
    brandName: 'Cimetidine',
    genericName: 'Cimetidine',
    defaultDosage: '50mg',
    commonDosages: ['50mg', '200mg', '400mg', '800mg'],
    standardFrequency: '2 tabs TID (Three times daily)',
    schedule: 'Rx',
    category: 'Histamine H2 Receptor Antagonist & CYP450 Inhibitor',
    aliases: ['cimetidine', 'tagamet', 'cimetidin', 'cimetidine 50mg', 'cimet', 'cimetidne'],
  },
  {
    brandName: 'Oxprelol',
    genericName: 'Oxprenolol Hydrochloride',
    defaultDosage: '50mg',
    commonDosages: ['20mg', '40mg', '50mg', '80mg', '160mg'],
    standardFrequency: '1 tab QD (Once daily)',
    schedule: 'Rx',
    category: 'Non-Selective Beta-Adrenergic Blocker / Antiarrhythmic',
    aliases: ['oxprelol', 'oxprenolol', 'trasicor', 'oxprelol 50mg', 'oxprenol', 'oxprel'],
  },

  // Herbal & Curcumin Formulations
  {
    brandName: 'Turmix',
    genericName: 'Curcuma Longa (Curcumin 95%) + Piperine',
    defaultDosage: '300mg',
    commonDosages: ['300mg', '60 Tablets'],
    standardFrequency: 'Twice daily after meals (1-0-1)',
    schedule: 'OTC',
    category: 'Herbal Anti-inflammatory & Mucosa Healing (Sanat Products Ltd.)',
    aliases: ['turmix', 'tngmix', 'turnix', 'tummix', 'tumix', 'turm-ix', 'turmix-60', 'sanat', 'sanat product', 'sanat products', 'curcumin'],
  },
  {
    brandName: 'Youngovit',
    genericName: 'Multivitamins, Multiminerals & Antioxidants',
    defaultDosage: '10ml / 1 Tab',
    commonDosages: ['10ml', '200ml', '1 Tablet'],
    standardFrequency: 'Once daily after breakfast',
    schedule: 'OTC',
    category: 'Nutritional Multivitamin & Vitality Supplement',
    aliases: ['youngovit', 'voungovit', 'youngvit', 'voungvit', 'yungovit', 'voungovlt', 'youngovlt', 'young-vit', 'voungov', 'youngov'],
  },
  {
    brandName: 'Vomikind',
    genericName: 'Ondansetron',
    defaultDosage: '4mg',
    commonDosages: ['4mg', '8mg'],
    standardFrequency: 'Twice daily or SOS for nausea',
    schedule: 'Rx',
    category: 'Antiemetic / Anti-Nausea',
    aliases: ['vomikind', 'vomi-kind', 'vomigon', 'vomigone', 'vominorm', 'vomistop'],
  },

  // Analgesics & Antipyretics
  {
    brandName: 'Dolo 650',
    genericName: 'Paracetamol',
    defaultDosage: '650mg',
    commonDosages: ['500mg', '650mg'],
    standardFrequency: 'Twice daily after meals (TID if fever)',
    schedule: 'OTC',
    category: 'Analgesic & Antipyretic',
    aliases: ['dolo', 'dlo', 'd0l0', 'dolo650', 'dlo650', 'dola', 'dlo-650', 'dolo-650'],
  },
  {
    brandName: 'Calpol',
    genericName: 'Paracetamol',
    defaultDosage: '500mg',
    commonDosages: ['250mg', '500mg', '650mg'],
    standardFrequency: 'Every 6-8 hours SOS for fever',
    schedule: 'OTC',
    category: 'Analgesic & Antipyretic',
    aliases: ['calpol', 'clpol', 'calpol-650', 'calpl', 'crocin'],
  },
  {
    brandName: 'Crocin Advance',
    genericName: 'Paracetamol Fast Release',
    defaultDosage: '500mg',
    commonDosages: ['500mg', '650mg'],
    standardFrequency: 'SOS for pain / fever',
    schedule: 'OTC',
    category: 'Analgesic & Antipyretic',
    aliases: ['crocin', 'crocn', 'crocin650', 'crocin-advance'],
  },
  {
    brandName: 'Combiflam',
    genericName: 'Ibuprofen + Paracetamol',
    defaultDosage: '400mg/325mg',
    commonDosages: ['400mg'],
    standardFrequency: 'Twice daily after meals',
    schedule: 'Rx',
    category: 'NSAID / Pain Relief',
    aliases: ['combiflam', 'cmbiflam', 'combi', 'combiflm', 'combi-flam'],
  },
  {
    brandName: 'Zerodol-SP',
    genericName: 'Aceclofenac + Paracetamol + Serratiopeptidase',
    defaultDosage: '100mg/325mg/15mg',
    commonDosages: ['100mg'],
    standardFrequency: 'Twice daily after food',
    schedule: 'Rx',
    category: 'NSAID & Anti-inflammatory',
    aliases: ['zerodol', 'zerodol-sp', 'zerodol sp', 'zrdl-sp', 'zerodol-p', 'zerodol p', 'zrdl', 'aceclo-sp'],
  },
  {
    brandName: 'Meftal-Spas',
    genericName: 'Mefenamic Acid + Dicyclomine',
    defaultDosage: '250mg/10mg',
    commonDosages: ['250mg', '500mg'],
    standardFrequency: 'Twice daily or SOS for abdominal spasms',
    schedule: 'Rx',
    category: 'Antispasmodic & NSAID',
    aliases: ['meftal', 'meftal-spas', 'meftal spas', 'mftl', 'meftal-p', 'meftal-forte'],
  },
  {
    brandName: 'Ultracet',
    genericName: 'Tramadol + Paracetamol',
    defaultDosage: '37.5mg/325mg',
    commonDosages: ['37.5mg'],
    standardFrequency: 'Once or twice daily for severe pain',
    schedule: 'Schedule IV',
    category: 'Opioid Analgesic Combination',
    aliases: ['ultracet', 'ultract', 'ultrct', 'tramadol-p', 'uracet'],
  },
  {
    brandName: 'Ibuprofen',
    genericName: 'Ibuprofen',
    defaultDosage: '400mg',
    commonDosages: ['200mg', '400mg', '600mg', '800mg'],
    standardFrequency: 'Every 6-8 hours as needed for pain with food',
    schedule: 'OTC',
    category: 'NSAID / Anti-inflammatory',
    aliases: ['ibuprofen', 'ibup', 'ibu', 'advil', 'motrin', 'brufen', 'brufen-400', 'brufen-600'],
  },
  {
    brandName: 'Amoxicillin',
    genericName: 'Amoxicillin',
    defaultDosage: '500mg',
    commonDosages: ['250mg', '500mg', '875mg'],
    standardFrequency: 'Three times daily (TID) for 7-10 days',
    schedule: 'Rx',
    category: 'Penicillin Antibiotic',
    aliases: ['amoxicillin', 'amox', 'amoxicilin', 'amoxyl', 'amoxil', 'novamox', 'mox-500'],
  },
  {
    brandName: 'Sildenafil',
    genericName: 'Sildenafil Citrate',
    defaultDosage: '50mg',
    commonDosages: ['25mg', '50mg', '100mg'],
    standardFrequency: 'Take 30-60 minutes prior to activity (max once daily)',
    schedule: 'Rx',
    category: 'PDE-5 Inhibitor / Vasodilator',
    aliases: ['sildenafil', 'viagra', 'manforce', 'kamagra', 'revatio', 'penegra'],
  },
  {
    brandName: 'Lisinopril',
    genericName: 'Lisinopril',
    defaultDosage: '10mg',
    commonDosages: ['5mg', '10mg', '20mg', '40mg'],
    standardFrequency: 'Once daily in the morning for hypertension',
    schedule: 'Rx',
    category: 'ACE Inhibitor / Antihypertensive',
    aliases: ['lisinopril', 'prinivil', 'zestril', 'lipril', 'lisoril'],
  },
  {
    brandName: 'Oxycodone HCl',
    genericName: 'Oxycodone Hydrochloride',
    defaultDosage: '10mg',
    commonDosages: ['5mg', '10mg', '15mg', '20mg', '30mg', '40mg', '80mg'],
    standardFrequency: 'Every 12 hours as needed for severe pain',
    schedule: 'Schedule II',
    category: 'Opioid Agonist (Schedule II Controlled Substance)',
    aliases: ['oxycodone', 'oxycontin', 'roxicodone', 'oxy', 'percocet'],
  },
  {
    brandName: 'Prednisone',
    genericName: 'Prednisone / Prednisolone',
    defaultDosage: '20mg',
    commonDosages: ['5mg', '10mg', '20mg', '40mg'],
    standardFrequency: 'Once daily in the morning with food',
    schedule: 'Rx',
    category: 'Corticosteroid / Anti-inflammatory',
    aliases: ['prednisone', 'prednisolone', 'deltasone', 'omnipred', 'wysolone'],
  },

  // Antibiotics & Anti-Infectives
  {
    brandName: 'Augmentin 625 Duo',
    genericName: 'Amoxicillin and Potassium Clavulanate',
    defaultDosage: '625mg',
    commonDosages: ['375mg', '625mg', '1000mg', '1g'],
    standardFrequency: 'Twice daily after meals for 5 days',
    schedule: 'Rx',
    category: 'Broad-Spectrum Penicillin Antibiotic',
    aliases: ['augmentin', 'augmntn', 'augmntin', 'aug-625', 'augm-625', 'augmentin625', 'agmtn', 'amoxyclav', 'amoxclav', 'moxclav', 'clavum', 'clavum-625'],
  },
  {
    brandName: 'Azithral 500',
    genericName: 'Azithromycin',
    defaultDosage: '500mg',
    commonDosages: ['250mg', '500mg'],
    standardFrequency: 'Once daily 1 hour before or 2 hours after meals',
    schedule: 'Schedule H',
    category: 'Macrolide Antibiotic',
    aliases: ['azithral', 'azithral-500', 'azithro', 'azithromycin', 'azee', 'azee-500', 'azith', 'azit', 'azith-500', 'zithromax'],
  },
  {
    brandName: 'Taxim-O 200',
    genericName: 'Cefixime',
    defaultDosage: '200mg',
    commonDosages: ['100mg', '200mg'],
    standardFrequency: 'Twice daily after food for 5-7 days',
    schedule: 'Schedule H1',
    category: 'Cephalosporin Antibiotic',
    aliases: ['taxim', 'taxim-o', 'taximo', 'cefixime', 'cefix', 'cefix-200', 'mahacef', 'omnicef', 'zifi', 'zifi-200'],
  },
  {
    brandName: 'Ciplox 500',
    genericName: 'Ciprofloxacin',
    defaultDosage: '500mg',
    commonDosages: ['250mg', '500mg', '750mg'],
    standardFrequency: 'Twice daily with water',
    schedule: 'Schedule H',
    category: 'Fluoroquinolone Antibiotic',
    aliases: ['ciplox', 'ciplox-500', 'cipro', 'ciprofloxacin', 'cifran', 'cifran-500'],
  },
  {
    brandName: 'Oflox 200',
    genericName: 'Ofloxacin',
    defaultDosage: '200mg',
    commonDosages: ['200mg', '400mg'],
    standardFrequency: 'Twice daily after food',
    schedule: 'Schedule H',
    category: 'Fluoroquinolone Antibiotic',
    aliases: ['oflox', 'oflox-200', 'ofloxacin', 'zanocin', 'zanocin-200', 'oflomac'],
  },
  {
    brandName: 'Metrogyl 400',
    genericName: 'Metronidazole',
    defaultDosage: '400mg',
    commonDosages: ['200mg', '400mg'],
    standardFrequency: 'Three times daily with meals',
    schedule: 'Schedule H',
    category: 'Antiprotozoal & Antibacterial',
    aliases: ['metrogyl', 'metrogyl-400', 'metro', 'metronidazole', 'flagyl'],
  },
  {
    brandName: 'Doxt-SL',
    genericName: 'Doxycycline + L. Rhamnosus',
    defaultDosage: '100mg',
    commonDosages: ['100mg'],
    standardFrequency: 'Once or twice daily after meals with water',
    schedule: 'Schedule H',
    category: 'Tetracycline Antibiotic',
    aliases: ['doxt', 'doxt-sl', 'doxy', 'doxycycline', 'doxy-100', 'minocycline'],
  },

  // Gastrointestinal & Antacids (PPIs / H2 Blockers)
  {
    brandName: 'Pan-D',
    genericName: 'Pantoprazole (40mg) + Domperidone (30mg SR)',
    defaultDosage: '40mg/30mg',
    commonDosages: ['40mg'],
    standardFrequency: 'Once daily in morning 30 minutes before breakfast',
    schedule: 'Schedule H',
    category: 'Proton Pump Inhibitor + Prokinetic',
    aliases: ['pan-d', 'pand', 'pan d', 'pan 40', 'pan-40', 'pan40', 'pantocid', 'pantocid-d', 'pantop', 'pantop-d', 'pnd', 'panto-d'],
  },
  {
    brandName: 'Razo-D',
    genericName: 'Rabeprazole + Domperidone',
    defaultDosage: '20mg/30mg',
    commonDosages: ['20mg'],
    standardFrequency: 'Once daily before breakfast',
    schedule: 'Schedule H',
    category: 'Proton Pump Inhibitor',
    aliases: ['razo', 'razo-d', 'razo d', 'rablet', 'rablet-d', 'rabeprazole', 'rabicip', 'happi-d', 'veloz'],
  },
  {
    brandName: 'Omez 20',
    genericName: 'Omeprazole',
    defaultDosage: '20mg',
    commonDosages: ['20mg', '40mg'],
    standardFrequency: 'Once daily morning empty stomach',
    schedule: 'Schedule H',
    category: 'Proton Pump Inhibitor',
    aliases: ['omez', 'omez-20', 'omez-d', 'omeprazole', 'omiz', 'omz'],
  },
  {
    brandName: 'Nexpro-RD 40',
    genericName: 'Esomeprazole + Domperidone',
    defaultDosage: '40mg/30mg',
    commonDosages: ['20mg', '40mg'],
    standardFrequency: 'Once daily before breakfast',
    schedule: 'Schedule H',
    category: 'Proton Pump Inhibitor',
    aliases: ['nexpro', 'nexpro-rd', 'nexpro-40', 'esomeprazole', 'sompraz', 'sompraz-d'],
  },
  {
    brandName: 'Emeset 4',
    genericName: 'Ondansetron',
    defaultDosage: '4mg',
    commonDosages: ['4mg', '8mg'],
    standardFrequency: 'SOS for nausea/vomiting',
    schedule: 'Schedule H',
    category: 'Antiemetic',
    aliases: ['emeset', 'emeset-4', 'ondansetron', 'ondem', 'ondem-4', 'vomikind'],
  },

  // Antiallergic, Cough & Respiratory
  {
    brandName: 'Montek-LC',
    genericName: 'Montelukast (10mg) + Levocetirizine (5mg)',
    defaultDosage: '10mg/5mg',
    commonDosages: ['10mg/5mg'],
    standardFrequency: 'Once daily at bedtime (Night)',
    schedule: 'Schedule H',
    category: 'Antiallergic & Bronchodilator',
    aliases: ['montek', 'montek-lc', 'montek lc', 'monteklc', 'montair-lc', 'montair lc', 'montina-l', 'mntk-lc', 'levocet-m', 'monticope'],
  },
  {
    brandName: 'Allegra 120',
    genericName: 'Fexofenadine',
    defaultDosage: '120mg',
    commonDosages: ['120mg', '180mg'],
    standardFrequency: 'Once daily before food',
    schedule: 'Rx',
    category: 'Non-Sedating Antihistamine',
    aliases: ['allegra', 'allegra-120', 'allegra-180', 'fexo', 'fexofenadine', 'fexova'],
  },
  {
    brandName: 'Cetzine 10',
    genericName: 'Cetirizine',
    defaultDosage: '10mg',
    commonDosages: ['5mg', '10mg'],
    standardFrequency: 'Once daily at night',
    schedule: 'OTC',
    category: 'Antihistamine',
    aliases: ['cetzine', 'cetirizine', 'citrizine', 'ctz', 'alerid', 'okacet', 'zyrtec'],
  },
  {
    brandName: 'Ascoril-D Plus',
    genericName: 'Dextromethorphan + Phenylephrine + Chlorpheniramine',
    defaultDosage: '10ml',
    commonDosages: ['5ml', '10ml'],
    standardFrequency: '5ml Three times daily after meals',
    schedule: 'Schedule H',
    category: 'Cough Suppressant Syrup',
    aliases: ['ascoril', 'ascoril-d', 'ascoril-ls', 'alex', 'benadryl', 'grilinctus', 't-rex', 'cheston-cold'],
  },
  {
    brandName: 'Asthalin Inhaler',
    genericName: 'Salbutamol (Albuterol)',
    defaultDosage: '100mcg/puff',
    commonDosages: ['100mcg', '200mcg'],
    standardFrequency: '2 Puffs SOS when breathless',
    schedule: 'Schedule H',
    category: 'Bronchodilator / Beta-2 Agonist',
    aliases: ['asthalin', 'salbutamol', 'ventorlin', 'albuterol', 'duolin', 'budecort', 'foracort'],
  },

  // Cardiovascular & Hypertension
  {
    brandName: 'Telma 40',
    genericName: 'Telmisartan',
    defaultDosage: '40mg',
    commonDosages: ['20mg', '40mg', '80mg'],
    standardFrequency: 'Once daily in morning after breakfast',
    schedule: 'Schedule H',
    category: 'Angiotensin Receptor Blocker (ARB)',
    aliases: ['telma', 'telma-40', 'telma-80', 'telma-h', 'telmikind', 'telmisartan', 'telsartan', 'crescendo'],
  },
  {
    brandName: 'Amlong 5',
    genericName: 'Amlodipine',
    defaultDosage: '5mg',
    commonDosages: ['2.5mg', '5mg', '10mg'],
    standardFrequency: 'Once daily in morning',
    schedule: 'Schedule H',
    category: 'Calcium Channel Blocker',
    aliases: ['amlong', 'amlong-5', 'stamlo', 'stamlo-5', 'amlodipine', 'amlo', 'amlopres', 'norvasc'],
  },
  {
    brandName: 'Ecosprin 75',
    genericName: 'Aspirin (Enteric Coated)',
    defaultDosage: '75mg',
    commonDosages: ['75mg', '150mg'],
    standardFrequency: 'Once daily after heavy meal (Lunch)',
    schedule: 'Schedule H',
    category: 'Antiplatelet / Blood Thinner',
    aliases: ['ecosprin', 'ecosprin-75', 'ecosprin-150', 'aspirin', 'asa', 'ecosp', 'disprin'],
  },
  {
    brandName: 'Atorva 10',
    genericName: 'Atorvastatin',
    defaultDosage: '10mg',
    commonDosages: ['10mg', '20mg', '40mg'],
    standardFrequency: 'Once daily at bedtime',
    schedule: 'Schedule H',
    category: 'Statin / Lipid Lowering',
    aliases: ['atorva', 'atorva-10', 'atorva-20', 'storvas', 'atorvastatin', 'lipitor', 'atocor'],
  },
  {
    brandName: 'Rosuvas 10',
    genericName: 'Rosuvastatin',
    defaultDosage: '10mg',
    commonDosages: ['5mg', '10mg', '20mg'],
    standardFrequency: 'Once daily at night',
    schedule: 'Schedule H',
    category: 'HMG-CoA Reductase Inhibitor (Statin)',
    aliases: ['rosuvas', 'rosuvas-10', 'rosuvas-20', 'rosuvastatin', 'crestor', 'rozavel', 'rosave'],
  },
  {
    brandName: 'Metolar 25',
    genericName: 'Metoprolol Succinate ER',
    defaultDosage: '25mg',
    commonDosages: ['25mg', '50mg'],
    standardFrequency: 'Once daily morning after food',
    schedule: 'Schedule H',
    category: 'Beta Blocker',
    aliases: ['metolar', 'metolar-25', 'metolar-50', 'betaloc', 'metoprolol', 'prolomet'],
  },

  // Diabetes
  {
    brandName: 'Glycomet 500 SR',
    genericName: 'Metformin Hydrochloride (Sustained Release)',
    defaultDosage: '500mg',
    commonDosages: ['500mg', '850mg', '1000mg'],
    standardFrequency: 'Twice daily with or immediately after meals',
    schedule: 'Schedule H',
    category: 'Biguanide Antidiabetic',
    aliases: ['glycomet', 'glycomet-500', 'glycomet-850', 'glycomet-gp', 'metformin', 'glucophage', 'glyciphage', 'cetapin'],
  },
  {
    brandName: 'Amaryl 1',
    genericName: 'Glimepiride',
    defaultDosage: '1mg',
    commonDosages: ['1mg', '2mg'],
    standardFrequency: 'Once daily immediately before breakfast',
    schedule: 'Schedule H',
    category: 'Sulfonylurea Antidiabetic',
    aliases: ['amaryl', 'amaryl-1', 'amaryl-2', 'glimepiride', 'glimy', 'glimestar', 'gp-1'],
  },
  {
    brandName: 'Januvia 100',
    genericName: 'Sitagliptin',
    defaultDosage: '100mg',
    commonDosages: ['50mg', '100mg'],
    standardFrequency: 'Once daily with or without food',
    schedule: 'Schedule H',
    category: 'DPP-4 Inhibitor',
    aliases: ['januvia', 'januvia-100', 'sitagliptin', 'istavel', 'zita', 'galvus', 'vildagliptin'],
  },
  {
    brandName: 'Forxiga 10',
    genericName: 'Dapagliflozin',
    defaultDosage: '10mg',
    commonDosages: ['5mg', '10mg'],
    standardFrequency: 'Once daily morning with water',
    schedule: 'Schedule H',
    category: 'SGLT2 Inhibitor',
    aliases: ['forxiga', 'forxiga-10', 'dapagliflozin', 'oxra', 'dapa', 'jardiance', 'empagliflozin'],
  },

  // Vitamins, Minerals & Supplements
  {
    brandName: 'Shelcal 500',
    genericName: 'Calcium Carbonate (500mg) + Vitamin D3 (250 IU)',
    defaultDosage: '500mg',
    commonDosages: ['500mg'],
    standardFrequency: 'Once daily after lunch with water',
    schedule: 'OTC',
    category: 'Calcium & Vitamin D3 Supplement',
    aliases: ['shelcal', 'shelcal-500', 'shelcal-hd', 'shlcal', 'calcimax', 'cipcal', 'gemcal'],
  },
  {
    brandName: 'Becosules Z',
    genericName: 'B-Complex with Vitamin C + Zinc',
    defaultDosage: '1 Capsule',
    commonDosages: ['1 Capsule'],
    standardFrequency: 'Once daily after food',
    schedule: 'OTC',
    category: 'Multivitamin & Zinc Supplement',
    aliases: ['becosules', 'becosule', 'becosules-z', 'b-complex', 'bcomplex', 'supradyn', 'zincovit', 'neurobion', 'neurobion-forte'],
  },
  {
    brandName: 'Uprise-D3 60K',
    genericName: 'Cholecalciferol (Vitamin D3 60,000 IU)',
    defaultDosage: '60,000 IU',
    commonDosages: ['60000 IU', '60K'],
    standardFrequency: 'Once weekly with milk after dinner for 8 weeks',
    schedule: 'OTC',
    category: 'High-Potency Vitamin D3 Supplement',
    aliases: ['uprise-d3', 'uprise', 'd3-60k', 'calcirol', 'd-rise', 'tayagol-d3', 'gen-d3'],
  },
  {
    brandName: 'Orofer-XT',
    genericName: 'Ferrous Ascorbate (Iron) + Folic Acid',
    defaultDosage: '100mg/1.5mg',
    commonDosages: ['100mg'],
    standardFrequency: 'Once daily after meals (avoid milk/calcium)',
    schedule: 'Rx',
    category: 'Hematinic / Iron Supplement',
    aliases: ['orofer', 'orofer-xt', 'autrin', 'folvite', 'feronia-xt', 'iron-folic'],
  },

  // Neurology, Psychiatry & Sleep
  {
    brandName: 'Restyl 0.25',
    genericName: 'Alprazolam',
    defaultDosage: '0.25mg',
    commonDosages: ['0.25mg', '0.5mg'],
    standardFrequency: 'Once daily at bedtime as prescribed (Short term)',
    schedule: 'Schedule IV',
    category: 'Benzodiazepine / Anxiolytic',
    aliases: ['restyl', 'restyl-0.25', 'restyl-0.5', 'alprax', 'alprazolam', 'zolax', 'trika'],
  },
  {
    brandName: 'Clonafit 0.5',
    genericName: 'Clonazepam',
    defaultDosage: '0.5mg',
    commonDosages: ['0.25mg', '0.5mg'],
    standardFrequency: 'Once daily at bedtime',
    schedule: 'Schedule IV',
    category: 'Benzodiazepine / Anticonvulsant',
    aliases: ['clonafit', 'clonazepam', 'clonotril', 'rivotril', 'lonazep'],
  },
  {
    brandName: 'Pregeb 75',
    genericName: 'Pregabalin',
    defaultDosage: '75mg',
    commonDosages: ['75mg', '150mg'],
    standardFrequency: 'Once daily at bedtime for neuropathic pain',
    schedule: 'Schedule H',
    category: 'Neuropathic Analgesic',
    aliases: ['pregeb', 'pregeb-75', 'pregabalin', 'lyrica', 'maxgalin', 'neugaba'],
  },
  {
    brandName: 'Nexito 10',
    genericName: 'Escitalopram',
    defaultDosage: '10mg',
    commonDosages: ['5mg', '10mg', '20mg'],
    standardFrequency: 'Once daily in morning or night',
    schedule: 'Schedule H',
    category: 'SSRI Antidepressant',
    aliases: ['nexito', 'nexito-10', 'escitalopram', 'cipralex', 'stalopam'],
  },
]

/**
 * Calculates Levenshtein edit distance between two strings.
 */
export function calculateLevenshtein(a: string, b: string): number {
  const m = a.length
  const n = b.length
  if (m === 0) return n
  if (n === 0) return m

  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0))

  for (let i = 0; i <= m; i++) dp[i][0] = i
  for (let j = 0; j <= n; j++) dp[0][j] = j

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1, // deletion
        dp[i][j - 1] + 1, // insertion
        dp[i - 1][j - 1] + cost // substitution
      )
    }
  }

  return dp[m][n]
}

/**
 * Calculates similarity percentage (0 to 100%) between two tokens.
 */
export function stringSimilarity(strA: string, strB: string): number {
  const a = strA.toLowerCase().trim()
  const b = strB.toLowerCase().trim()
  if (a === b) return 100
  if (a.length === 0 || b.length === 0) return 0

  const maxLen = Math.max(a.length, b.length)
  const dist = calculateLevenshtein(a, b)
  return Math.round(((maxLen - dist) / maxLen) * 100)
}

export interface MatchResult {
  entry: ClinicalDrugEntry
  matchedTerm: string
  confidence: number
  isHandwrittenFuzzy: boolean
}

const COMMON_MED_STOP_WORDS = /^(mg|mcg|ml|g|gm|iu|k|tab|tabs|tablet|tablets|cap|caps|capsule|capsules|syp|syrup|inj|injection|drop|drops|od|bd|tds|qid|hs|sos|days|daily|mouth|take|taking|every|hours|needed|pain|disp|dispense|refill|refills|prn|for|and|with|water|once|twice|three|four|date|patient|sig)$/i

/**
 * Fuzzy matches an OCR extracted handwritten text line against the Indian clinical drug database.
 */
export function matchHandwrittenMedicine(rawSnippet: string): MatchResult | null {
  if (!rawSnippet || rawSnippet.trim().length < 3) return null

  // Clean OCR noise and common medical line headers: "Tab.", "Cap.", "Syp.", "Inj.", "1.", "2.", "Rx"
  const cleanLine = rawSnippet
    .replace(/^[\s|!i:;[\](){}<>_~#-]+|[\s|!i:;[\](){}<>_~#-]+$/g, '')
    .replace(/^(?:(?:tab(?:let)?|cap(?:sule)?|syp(?:rup)?|inj(?:ection)?|drop|rx|drx|med|item|no\.?)\s*|\d+[\s.)-]+\s*)+/i, '')
    .trim()
    .toLowerCase()

  if (cleanLine.length < 3) return null

  // 1. Direct Alias Match with Word Boundary (Prevents accidental substring matches)
  for (const drug of CLINICAL_LEXICON) {
    for (const alias of drug.aliases) {
      const aliasRegex = new RegExp(`(^|[^a-z0-9])${alias.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}([^a-z0-9]|$)`, 'i')
      if (aliasRegex.test(cleanLine)) {
        return {
          entry: drug,
          matchedTerm: alias,
          confidence: 97,
          isHandwrittenFuzzy: false,
        }
      }
    }
  }

  // 2. Tokenized Fuzzy Levenshtein Matching for Handwritten typos (e.g. "Augmntn", "Dlo", "Azithro", "PanD")
  const tokens = cleanLine.split(/[\s,+/]+/).filter((t) => t.length >= 3 && !/^\d+$/.test(t))
  let bestMatch: MatchResult | null = null
  let highestScore = 0

  for (const token of tokens) {
    // Skip dosage forms, frequency shorthands, and directions
    if (COMMON_MED_STOP_WORDS.test(token)) continue

    for (const drug of CLINICAL_LEXICON) {
      for (const alias of drug.aliases) {
        // Only compare tokens of comparable length
        if (Math.abs(token.length - alias.length) > 2) continue

        const score = stringSimilarity(token, alias)
        // High confidence threshold (78% for longer words, 85% for short words)
        const threshold = alias.length <= 5 ? 85 : 78
        if (score >= threshold && score > highestScore) {
          highestScore = score
          bestMatch = {
            entry: drug,
            matchedTerm: token,
            confidence: score,
            isHandwrittenFuzzy: score < 95,
          }
        }
      }
    }
  }

  return bestMatch
}

export interface DecodedFrequency {
  frequency: string
  duration: string
  instructions: string
  isHandwrittenShorthand: boolean
}

/**
 * Decodes standard Indian doctor numerical prescription shorthand ("1-0-1", "OD", "TDS", "SOS", etc.).
 */
export function decodePrescriptionShorthand(rawText: string): DecodedFrequency {
  const lower = rawText.toLowerCase()
  let freq = 'Twice daily after meals'
  let duration = '5 Days'
  let instructions = 'Take after food with water'
  let isHandwrittenShorthand = false

  // 1. Numerical Daily Schedulers (e.g., 1-0-1, 1-1-1, 1-0-0, 0-0-1, 0-1-0)
  if (/\b1\s*[-/:]\s*0\s*[-/:]\s*1\b/.test(lower)) {
    freq = 'Twice daily (Morning & Night: 1-0-1)'
    instructions = 'Take 1 tablet in morning and 1 tablet at night after meals'
    isHandwrittenShorthand = true
  } else if (/\b1\s*[-/:]\s*1\s*[-/:]\s*1\b/.test(lower)) {
    freq = 'Three times daily (Morning, Noon & Night: 1-1-1)'
    instructions = 'Take 1 tablet morning, afternoon and night after meals'
    isHandwrittenShorthand = true
  } else if (/\b1\s*[-/:]\s*0\s*[-/:]\s*0\b/.test(lower)) {
    freq = 'Once daily in the morning (1-0-0)'
    instructions = 'Take 1 tablet in the morning after breakfast'
    isHandwrittenShorthand = true
  } else if (/\b0\s*[-/:]\s*0\s*[-/:]\s*1\b/.test(lower) || /\bhs\b|\bh\.s\b/.test(lower)) {
    freq = 'Once daily at bedtime (Night: 0-0-1)'
    instructions = 'Take 1 tablet at night before sleeping'
    isHandwrittenShorthand = true
  } else if (/\b0\s*[-/:]\s*1\s*[-/:]\s*0\b/.test(lower)) {
    freq = 'Once daily in the afternoon (0-1-0)'
    instructions = 'Take 1 tablet after lunch'
    isHandwrittenShorthand = true
  } else if (/\b1\s*[-/:]\s*1\s*[-/:]\s*0\b/.test(lower)) {
    freq = 'Twice daily (Morning & Noon: 1-1-0)'
    instructions = 'Take morning and afternoon after meals'
    isHandwrittenShorthand = true
  }
  // 2. Classical Latin / Clinical abbreviations
  else if (/\b(?:od|o\.d\.)\b/.test(lower)) {
    freq = 'Once daily (OD)'
    instructions = 'Take once every 24 hours'
    isHandwrittenShorthand = true
  } else if (/\b(?:bd|b\.d\.|bid|b\.i\.d\.)\b/.test(lower)) {
    freq = 'Twice daily (BD / BID)'
    instructions = 'Take every 12 hours after meals'
    isHandwrittenShorthand = true
  } else if (/\b(?:tds|t\.d\.s\.|tid|t\.i\.d\.)\b/.test(lower)) {
    freq = 'Three times daily (TDS / TID)'
    instructions = 'Take every 8 hours after meals'
    isHandwrittenShorthand = true
  } else if (/\b(?:qid|q\.i\.d\.)\b/.test(lower)) {
    freq = 'Four times daily (QID)'
    instructions = 'Take every 6 hours'
    isHandwrittenShorthand = true
  } else if (/\b(?:sos|s\.o\.s\.|prn|p\.r\.n\.)\b/.test(lower)) {
    freq = 'As needed in emergency (SOS / PRN)'
    instructions = 'Take only when necessary or experiencing symptoms'
    isHandwrittenShorthand = true
  }

  // 3. Detect Timing Relation to Food (Empty stomach / Before meals vs After meals)
  if (/\b(?:ac|a\.c\.|before\s+meals?|before\s+food|empty\s+stomach)\b/.test(lower)) {
    instructions += ' • Strictly on an empty stomach (30 mins before food)'
  } else if (/\b(?:pc|p\.c\.|after\s+meals?|after\s+food)\b/.test(lower)) {
    instructions += ' • After food'
  }

  // 4. Extract Duration (e.g., "x 5 days", "for 7 days", "3d", "1 week")
  const durationMatch =
    rawText.match(/\b(?:x|for)?\s*(\d{1,2})\s*(?:days?|d)\b/i) ||
    rawText.match(/\b(?:x|for)?\s*(\d{1,2})\s*(?:weeks?|w)\b/i) ||
    rawText.match(/\b(?:x|for)?\s*(\d{1,2})\s*(?:months?|m)\b/i)

  if (durationMatch) {
    const num = durationMatch[1]
    if (/week|w/i.test(durationMatch[0])) duration = `${num} Week${parseInt(num) > 1 ? 's' : ''}`
    else if (/month|m/i.test(durationMatch[0])) duration = `${num} Month${parseInt(num) > 1 ? 's' : ''}`
    else duration = `${num} Days`
  }

  return {
    frequency: freq,
    duration,
    instructions,
    isHandwrittenShorthand,
  }
}
