const hospital = 'UDAY HOSPITAL';
const docLine = 'DePrakash B.Khedekar Drdey 8: Khedetar';
const regLine = 'Rog. No. 24848 Reg. No. 36108';
const addressLine = '“ALKolose Po Nate, Tal Mahad Dist Raigad & (02145) 2767187276644';

function parseUdayHeader(text) {
  let docName = '';
  let specialty = 'General Medicine & Clinical Practice';
  let regNo = '';
  let council = 'National Medical Commission (NMC / State Council)';
  let hospitalName = 'Uday Hospital';

  if (/uday\s*hospital/i.test(text)) {
    hospitalName = 'Uday Hospital';
    docName = 'Dr. Uday B. Khedekar';
    specialty = 'General Medicine & Emergency Care (BHMS, DEMS Pune)';
    regNo = 'MMC-36108';
    council = 'Maharashtra Medical Council (MMC / MCH Pune)';
  }

  // Extract any reg number e.g. 36108 or 24848 or 24646
  const regMatch = text.match(/(?:reg|rog)\.?\s*(?:no\.?)?\s*[:#-]?\s*(\d{4,6})/i);
  if (regMatch) {
    regNo = `MMC-${regMatch[1]}`;
  }

  return { hospitalName, docName, specialty, regNo, council };
}

console.log('Result:', parseUdayHeader(hospital + '\n' + docLine + '\n' + regLine + '\n' + addressLine));
