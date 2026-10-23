import { parsePrescriptionText } from './src/services/ocrService.ts';

const text = `UDAY HOSPITAL
DePrakash B.Khedekar Drdey 8: Khedetar
SEM thm) + ® DEUS Cw
Rog. No. 24848 Reg. No. 36108
“ALKolose Po Nate, Tal Mahad Dist Raigad & (02145) 2767187276644
Re Date :
bo
Tngmix
\ 2) i v TE pe
ANE i ft ;`;

const res = parsePrescriptionText(text);
console.log('=== TEST RESULT FOR USER IMAGE ===');
console.log('DOCTOR:', res.doctor.name, '| Lic:', res.doctor.licenseNo, '| Specialty:', res.doctor.specialty);
console.log('COUNCIL:', res.doctorVerification.council);
console.log('PATIENT:', res.patient.name, '| Age:', res.patient.age, '| DOB:', res.patient.dob, '| Addr:', res.patient.address);
console.log('MEDICINES:', res.medicines.map(m => `${m.name} (${m.matchedGeneric}) - ${m.quantity}`));
