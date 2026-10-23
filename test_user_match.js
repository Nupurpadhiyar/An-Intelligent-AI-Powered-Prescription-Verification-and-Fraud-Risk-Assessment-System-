import { CLINICAL_LEXICON, matchHandwrittenMedicine } from './src/data/indianClinicalLexicon.ts';

// Add Turmix and Youngovit to lexicon test
const testTurmix = {
  brandName: 'Turmix',
  genericName: 'Curcuma Longa (Curcumin extract) + Piperine',
  defaultDosage: '300mg',
  commonDosages: ['300mg', '60 Tablets'],
  standardFrequency: 'Twice daily after meals (1-0-1)',
  schedule: 'OTC',
  category: 'Herbal Anti-inflammatory / Sanat Products Ltd.',
  aliases: ['turmix', 'tngmix', 'turnix', 'tummix', 'tumix', 'turm-ix', 'sanat', 'sanat product']
};

const testYoungovit = {
  brandName: 'Youngovit',
  genericName: 'Multivitamins, Multiminerals & Antioxidants',
  defaultDosage: '10ml / 1 Tablet',
  commonDosages: ['10ml', '200ml'],
  standardFrequency: 'Once daily after breakfast',
  schedule: 'OTC',
  category: 'Nutritional Multivitamin Supplement',
  aliases: ['youngovit', 'voungovit', 'youngvit', 'voungvit', 'yungovit', 'voungovlt']
};

console.log('Testing match on Tngmix:');
const clean = 'Tngmix'.toLowerCase();
for (const alias of testTurmix.aliases) {
  if (clean === alias || clean.includes(alias)) {
    console.log('Matched alias:', alias, '->', testTurmix.brandName);
  }
}
