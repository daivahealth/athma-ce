export const PRM_EVENT_TYPES = [
  'appointment_confirmed',
  'appointment_cancelled',
  'appointment_missed',
  'encounter_started',
  'encounter_completed',
  'invoice_generated',
  'payment_received',
  'payment_overdue',
  'care_plan_created',
  'medication_prescribed',
  'lab_result_ready',
  'imaging_completed',
];

export const PRM_EVENT_SUBTYPES: Record<string, string[]> = {
  appointment_confirmed: ['new_patient', 'existing_patient', 'rescheduled'],
  appointment_cancelled: ['patient_request', 'provider_request', 'no_show'],
  appointment_missed: ['no_show', 'late_cancel'],
  encounter_started: ['walk_in', 'scheduled', 'emergency'],
  encounter_completed: ['discharged', 'left_against_advice', 'transferred'],
  invoice_generated: ['self_pay', 'insurance'],
  payment_received: ['full', 'partial', 'online', 'cash'],
  payment_overdue: ['first_notice', 'second_notice'],
  care_plan_created: ['chronic_care', 'post_op', 'preventive'],
  medication_prescribed: ['new', 'refill', 'changed'],
  lab_result_ready: ['critical', 'normal'],
  imaging_completed: ['radiology', 'cardiology'],
};
