import { PatientDisplayDto } from '@zeal/contracts';
import { StandardPatientData } from '../common/constants/patient-select.constant';

function calculateAge(dateOfBirth: Date): number {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

export function buildOtPatientDisplay(
  patient?: StandardPatientData | null
): PatientDisplayDto | null {
  if (!patient) {
    return null;
  }

  const patientDisplay: PatientDisplayDto = {
    patientId: patient.id,
    mrn: patient.mrn,
    firstName: patient.firstName,
    lastName: patient.lastName,
    displayName: patient.displayName || `${patient.firstName} ${patient.lastName}`,
    age: calculateAge(patient.dateOfBirth),
    dateOfBirth: patient.dateOfBirth.toISOString().slice(0, 10),
    gender: patient.gender,
  };

  if (patient.nationalId) patientDisplay.nationalId = patient.nationalId;
  if (patient.nationalIdType) patientDisplay.nationalIdType = patient.nationalIdType;
  if (patient.phoneNumber) patientDisplay.phoneNumber = patient.phoneNumber;
  if (patient.email) patientDisplay.email = patient.email;
  if (patient.nationality) patientDisplay.nationality = patient.nationality;
  if (patient.preferredLanguage) patientDisplay.preferredLanguage = patient.preferredLanguage;

  return patientDisplay;
}
