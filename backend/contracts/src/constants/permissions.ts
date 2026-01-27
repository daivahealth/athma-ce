/**
 * Permission Constants
 *
 * Centralized permission definitions for RBAC.
 * Format: RESOURCE_ACTION (e.g., PATIENT_READ)
 * Database value: resource.action (e.g., patient.read)
 *
 * Usage:
 * @Permissions(Permissions.PATIENT_READ, Permissions.PATIENT_WRITE)
 */

// ============================================
// PATIENT PERMISSIONS
// ============================================
export const PATIENT_READ = 'patient.read';
export const PATIENT_CREATE = 'patient.create';
export const PATIENT_UPDATE = 'patient.update';
export const PATIENT_DELETE = 'patient.delete';
export const PATIENT_MERGE = 'patient.merge';
export const PATIENT_EXPORT = 'patient.export';

// ============================================
// APPOINTMENT PERMISSIONS
// ============================================
export const APPOINTMENT_READ = 'appointment.read';
export const APPOINTMENT_CREATE = 'appointment.create';
export const APPOINTMENT_UPDATE = 'appointment.update';
export const APPOINTMENT_DELETE = 'appointment.delete';
export const APPOINTMENT_CANCEL = 'appointment.cancel';
export const APPOINTMENT_RESCHEDULE = 'appointment.reschedule';
export const APPOINTMENT_CHECKIN = 'appointment.checkin';

// ============================================
// ENCOUNTER PERMISSIONS
// ============================================
export const ENCOUNTER_READ = 'encounter.read';
export const ENCOUNTER_CREATE = 'encounter.create';
export const ENCOUNTER_UPDATE = 'encounter.update';
export const ENCOUNTER_DELETE = 'encounter.delete';
export const ENCOUNTER_CLOSE = 'encounter.close';
export const ENCOUNTER_REOPEN = 'encounter.reopen';

// ============================================
// CLINICAL NOTES PERMISSIONS
// ============================================
export const CLINICAL_NOTE_READ = 'clinical_note.read';
export const CLINICAL_NOTE_CREATE = 'clinical_note.create';
export const CLINICAL_NOTE_UPDATE = 'clinical_note.update';
export const CLINICAL_NOTE_DELETE = 'clinical_note.delete';
export const CLINICAL_NOTE_SIGN = 'clinical_note.sign';
export const CLINICAL_NOTE_COSIGN = 'clinical_note.cosign';

// ============================================
// DIAGNOSIS PERMISSIONS
// ============================================
export const DIAGNOSIS_READ = 'diagnosis.read';
export const DIAGNOSIS_CREATE = 'diagnosis.create';
export const DIAGNOSIS_UPDATE = 'diagnosis.update';
export const DIAGNOSIS_DELETE = 'diagnosis.delete';

// ============================================
// VITAL SIGNS PERMISSIONS
// ============================================
export const VITALS_READ = 'vitals.read';
export const VITALS_CREATE = 'vitals.create';
export const VITALS_UPDATE = 'vitals.update';
export const VITALS_DELETE = 'vitals.delete';

// ============================================
// PRESCRIPTION/MEDICATION PERMISSIONS
// ============================================
export const PRESCRIPTION_READ = 'prescription.read';
export const PRESCRIPTION_CREATE = 'prescription.create';
export const PRESCRIPTION_UPDATE = 'prescription.update';
export const PRESCRIPTION_DELETE = 'prescription.delete';
export const PRESCRIPTION_DISPENSE = 'prescription.dispense';

// ============================================
// LAB ORDER PERMISSIONS
// ============================================
export const LAB_ORDER_READ = 'lab_order.read';
export const LAB_ORDER_CREATE = 'lab_order.create';
export const LAB_ORDER_UPDATE = 'lab_order.update';
export const LAB_ORDER_DELETE = 'lab_order.delete';
export const LAB_ORDER_CANCEL = 'lab_order.cancel';
export const LAB_RESULT_READ = 'lab_result.read';
export const LAB_RESULT_ENTER = 'lab_result.enter';

// ============================================
// IMAGING ORDER PERMISSIONS
// ============================================
export const IMAGING_ORDER_READ = 'imaging_order.read';
export const IMAGING_ORDER_CREATE = 'imaging_order.create';
export const IMAGING_ORDER_UPDATE = 'imaging_order.update';
export const IMAGING_ORDER_DELETE = 'imaging_order.delete';
export const IMAGING_RESULT_READ = 'imaging_result.read';
export const IMAGING_RESULT_ENTER = 'imaging_result.enter';

// ============================================
// SCHEDULING PERMISSIONS
// ============================================
export const SCHEDULE_READ = 'schedule.read';
export const SCHEDULE_CREATE = 'schedule.create';
export const SCHEDULE_UPDATE = 'schedule.update';
export const SCHEDULE_DELETE = 'schedule.delete';
export const CALENDAR_READ = 'calendar.read';

// ============================================
// INPATIENT PERMISSIONS
// ============================================
export const ADMISSION_READ = 'admission.read';
export const ADMISSION_CREATE = 'admission.create';
export const ADMISSION_UPDATE = 'admission.update';
export const DISCHARGE_CREATE = 'discharge.create';
export const DISCHARGE_UPDATE = 'discharge.update';
export const BED_MANAGE = 'bed.manage';
export const WARD_READ = 'ward.read';
export const WARD_MANAGE = 'ward.manage';

// ============================================
// TRIAGE PERMISSIONS
// ============================================
export const TRIAGE_READ = 'triage.read';
export const TRIAGE_CREATE = 'triage.create';
export const TRIAGE_UPDATE = 'triage.update';
export const TRIAGE_DELETE = 'triage.delete';

// ============================================
// CONSENT PERMISSIONS
// ============================================
export const CONSENT_READ = 'consent.read';
export const CONSENT_CREATE = 'consent.create';
export const CONSENT_UPDATE = 'consent.update';
export const CONSENT_DELETE = 'consent.delete';
export const CONSENT_TEMPLATE_READ = 'consent_template.read';
export const CONSENT_TEMPLATE_CREATE = 'consent_template.create';
export const CONSENT_TEMPLATE_UPDATE = 'consent_template.update';
export const CONSENT_TEMPLATE_DELETE = 'consent_template.delete';

// ============================================
// VALUESET PERMISSIONS
// ============================================
export const VALUESET_READ = 'valueset.read';
export const VALUESET_CREATE = 'valueset.create';
export const VALUESET_UPDATE = 'valueset.update';
export const VALUESET_DELETE = 'valueset.delete';

// ============================================
// CLINICAL ORDER PERMISSIONS
// ============================================
export const CLINICAL_ORDER_READ = 'clinical_order.read';
export const CLINICAL_ORDER_CREATE = 'clinical_order.create';
export const CLINICAL_ORDER_UPDATE = 'clinical_order.update';
export const CLINICAL_ORDER_DELETE = 'clinical_order.delete';
export const CLINICAL_ORDER_CANCEL = 'clinical_order.cancel';

// ============================================
// AVAILABILITY PERMISSIONS
// ============================================
export const AVAILABILITY_READ = 'availability.read';

// ============================================
// CARE CHANNEL PERMISSIONS
// ============================================
export const CARE_CHANNEL_READ = 'care_channel.read';
export const CARE_CHANNEL_CREATE = 'care_channel.create';
export const CARE_CHANNEL_UPDATE = 'care_channel.update';
export const CARE_CHANNEL_CLOSE = 'care_channel.close';

// ============================================
// CARE TEAM MEMBERSHIP PERMISSIONS
// ============================================
export const CARE_TEAM_READ = 'care_team.read';
export const CARE_TEAM_ADD = 'care_team.add';
export const CARE_TEAM_REMOVE = 'care_team.remove';

// ============================================
// CARE CHANNEL MESSAGE PERMISSIONS
// ============================================
export const CARE_MESSAGE_READ = 'care_message.read';
export const CARE_MESSAGE_CREATE = 'care_message.create';
export const CARE_MESSAGE_DELETE = 'care_message.delete';

// ============================================
// CHECKLIST PERMISSIONS
// ============================================
export const CHECKLIST_READ = 'checklist.read';
export const CHECKLIST_CREATE = 'checklist.create';
export const CHECKLIST_UPDATE = 'checklist.update';
export const CHECKLIST_DELETE = 'checklist.delete';
export const CHECKLIST_TEMPLATE_READ = 'checklist_template.read';
export const CHECKLIST_TEMPLATE_CREATE = 'checklist_template.create';
export const CHECKLIST_TEMPLATE_UPDATE = 'checklist_template.update';

// ============================================
// DISCHARGE SUMMARY PERMISSIONS
// ============================================
export const DISCHARGE_SUMMARY_READ = 'discharge_summary.read';
export const DISCHARGE_SUMMARY_CREATE = 'discharge_summary.create';
export const DISCHARGE_SUMMARY_UPDATE = 'discharge_summary.update';

// ============================================
// NOTE TEMPLATE PERMISSIONS
// ============================================
export const NOTE_TEMPLATE_READ = 'note_template.read';
export const NOTE_TEMPLATE_CREATE = 'note_template.create';
export const NOTE_TEMPLATE_UPDATE = 'note_template.update';
export const NOTE_TEMPLATE_DELETE = 'note_template.delete';

// ============================================
// BILLING PERMISSIONS (RCM)
// ============================================
export const INVOICE_READ = 'invoice.read';
export const INVOICE_CREATE = 'invoice.create';
export const INVOICE_UPDATE = 'invoice.update';
export const INVOICE_DELETE = 'invoice.delete';
export const INVOICE_VOID = 'invoice.void';
export const PAYMENT_READ = 'payment.read';
export const PAYMENT_CREATE = 'payment.create';
export const PAYMENT_REFUND = 'payment.refund';
export const CLAIM_READ = 'claim.read';
export const CLAIM_CREATE = 'claim.create';
export const CLAIM_SUBMIT = 'claim.submit';
export const CLAIM_UPDATE = 'claim.update';

// ============================================
// CATALOG PERMISSIONS
// ============================================
export const CATALOG_READ = 'catalog.read';
export const CATALOG_CREATE = 'catalog.create';
export const CATALOG_UPDATE = 'catalog.update';
export const CATALOG_DELETE = 'catalog.delete';

// ============================================
// USER MANAGEMENT PERMISSIONS
// ============================================
export const USER_READ = 'user.read';
export const USER_CREATE = 'user.create';
export const USER_UPDATE = 'user.update';
export const USER_DELETE = 'user.delete';
export const USER_ACTIVATE = 'user.activate';
export const USER_DEACTIVATE = 'user.deactivate';
export const USER_RESET_PASSWORD = 'user.reset_password';

// ============================================
// STAFF MANAGEMENT PERMISSIONS
// ============================================
export const STAFF_READ = 'staff.read';
export const STAFF_CREATE = 'staff.create';
export const STAFF_UPDATE = 'staff.update';
export const STAFF_DELETE = 'staff.delete';

// ============================================
// FACILITY MANAGEMENT PERMISSIONS
// ============================================
export const FACILITY_READ = 'facility.read';
export const FACILITY_CREATE = 'facility.create';
export const FACILITY_UPDATE = 'facility.update';
export const FACILITY_DELETE = 'facility.delete';

// ============================================
// RBAC PERMISSIONS
// ============================================
export const RBAC_READ = 'rbac.read';
export const RBAC_MANAGE = 'rbac.manage';
export const ROLE_CREATE = 'role.create';
export const ROLE_UPDATE = 'role.update';
export const ROLE_DELETE = 'role.delete';
export const ROLE_ASSIGN = 'role.assign';
export const PERMISSION_READ = 'permission.read';

// ============================================
// TENANT MANAGEMENT PERMISSIONS
// ============================================
export const TENANT_READ = 'tenant.read';
export const TENANT_CREATE = 'tenant.create';
export const TENANT_UPDATE = 'tenant.update';
export const TENANT_DELETE = 'tenant.delete';

// ============================================
// AUDIT PERMISSIONS
// ============================================
export const AUDIT_READ = 'audit.read';
export const AUDIT_EXPORT = 'audit.export';

// ============================================
// REPORT PERMISSIONS
// ============================================
export const REPORT_READ = 'report.read';
export const REPORT_CREATE = 'report.create';
export const REPORT_EXPORT = 'report.export';

// ============================================
// CONFIGURATION PERMISSIONS
// ============================================
export const CONFIG_READ = 'config.read';
export const CONFIG_UPDATE = 'config.update';

// ============================================
// NOTIFICATION PERMISSIONS (PRM)
// ============================================
export const NOTIFICATION_READ = 'notification.read';
export const NOTIFICATION_CREATE = 'notification.create';
export const NOTIFICATION_TEMPLATE_MANAGE = 'notification_template.manage';
export const NOTIFICATION_RULE_MANAGE = 'notification_rule.manage';

// ============================================
// PERMISSION GROUPS (for convenience)
// ============================================

/**
 * All patient-related permissions
 */
export const PATIENT_ALL = [
  PATIENT_READ,
  PATIENT_CREATE,
  PATIENT_UPDATE,
  PATIENT_DELETE,
  PATIENT_MERGE,
  PATIENT_EXPORT,
];

/**
 * All appointment-related permissions
 */
export const APPOINTMENT_ALL = [
  APPOINTMENT_READ,
  APPOINTMENT_CREATE,
  APPOINTMENT_UPDATE,
  APPOINTMENT_DELETE,
  APPOINTMENT_CANCEL,
  APPOINTMENT_RESCHEDULE,
  APPOINTMENT_CHECKIN,
];

/**
 * All encounter-related permissions
 */
export const ENCOUNTER_ALL = [
  ENCOUNTER_READ,
  ENCOUNTER_CREATE,
  ENCOUNTER_UPDATE,
  ENCOUNTER_DELETE,
  ENCOUNTER_CLOSE,
  ENCOUNTER_REOPEN,
];

/**
 * All clinical permissions (for doctors/clinicians)
 */
export const CLINICAL_ALL = [
  ...PATIENT_ALL,
  ...ENCOUNTER_ALL,
  CLINICAL_NOTE_READ,
  CLINICAL_NOTE_CREATE,
  CLINICAL_NOTE_UPDATE,
  CLINICAL_NOTE_SIGN,
  DIAGNOSIS_READ,
  DIAGNOSIS_CREATE,
  DIAGNOSIS_UPDATE,
  VITALS_READ,
  VITALS_CREATE,
  PRESCRIPTION_READ,
  PRESCRIPTION_CREATE,
  LAB_ORDER_READ,
  LAB_ORDER_CREATE,
  LAB_RESULT_READ,
  IMAGING_ORDER_READ,
  IMAGING_ORDER_CREATE,
  IMAGING_RESULT_READ,
];

/**
 * All admin permissions
 */
export const ADMIN_ALL = [
  USER_READ,
  USER_CREATE,
  USER_UPDATE,
  USER_DELETE,
  USER_ACTIVATE,
  USER_DEACTIVATE,
  USER_RESET_PASSWORD,
  STAFF_READ,
  STAFF_CREATE,
  STAFF_UPDATE,
  STAFF_DELETE,
  FACILITY_READ,
  FACILITY_CREATE,
  FACILITY_UPDATE,
  RBAC_READ,
  RBAC_MANAGE,
  ROLE_CREATE,
  ROLE_UPDATE,
  ROLE_DELETE,
  ROLE_ASSIGN,
  PERMISSION_READ,
  AUDIT_READ,
  CONFIG_READ,
  CONFIG_UPDATE,
];

/**
 * List of all permissions (for seeding)
 */
export const ALL_PERMISSIONS = [
  // Patient
  { code: PATIENT_READ, name: 'Read Patients', resource: 'patient', action: 'read' },
  { code: PATIENT_CREATE, name: 'Create Patients', resource: 'patient', action: 'create' },
  { code: PATIENT_UPDATE, name: 'Update Patients', resource: 'patient', action: 'update' },
  { code: PATIENT_DELETE, name: 'Delete Patients', resource: 'patient', action: 'delete' },
  { code: PATIENT_MERGE, name: 'Merge Patients', resource: 'patient', action: 'merge' },
  { code: PATIENT_EXPORT, name: 'Export Patients', resource: 'patient', action: 'export' },

  // Appointment
  { code: APPOINTMENT_READ, name: 'Read Appointments', resource: 'appointment', action: 'read' },
  { code: APPOINTMENT_CREATE, name: 'Create Appointments', resource: 'appointment', action: 'create' },
  { code: APPOINTMENT_UPDATE, name: 'Update Appointments', resource: 'appointment', action: 'update' },
  { code: APPOINTMENT_DELETE, name: 'Delete Appointments', resource: 'appointment', action: 'delete' },
  { code: APPOINTMENT_CANCEL, name: 'Cancel Appointments', resource: 'appointment', action: 'cancel' },
  { code: APPOINTMENT_RESCHEDULE, name: 'Reschedule Appointments', resource: 'appointment', action: 'reschedule' },
  { code: APPOINTMENT_CHECKIN, name: 'Check-in Appointments', resource: 'appointment', action: 'checkin' },

  // Encounter
  { code: ENCOUNTER_READ, name: 'Read Encounters', resource: 'encounter', action: 'read' },
  { code: ENCOUNTER_CREATE, name: 'Create Encounters', resource: 'encounter', action: 'create' },
  { code: ENCOUNTER_UPDATE, name: 'Update Encounters', resource: 'encounter', action: 'update' },
  { code: ENCOUNTER_DELETE, name: 'Delete Encounters', resource: 'encounter', action: 'delete' },
  { code: ENCOUNTER_CLOSE, name: 'Close Encounters', resource: 'encounter', action: 'close' },
  { code: ENCOUNTER_REOPEN, name: 'Reopen Encounters', resource: 'encounter', action: 'reopen' },

  // Clinical Notes
  { code: CLINICAL_NOTE_READ, name: 'Read Clinical Notes', resource: 'clinical_note', action: 'read' },
  { code: CLINICAL_NOTE_CREATE, name: 'Create Clinical Notes', resource: 'clinical_note', action: 'create' },
  { code: CLINICAL_NOTE_UPDATE, name: 'Update Clinical Notes', resource: 'clinical_note', action: 'update' },
  { code: CLINICAL_NOTE_DELETE, name: 'Delete Clinical Notes', resource: 'clinical_note', action: 'delete' },
  { code: CLINICAL_NOTE_SIGN, name: 'Sign Clinical Notes', resource: 'clinical_note', action: 'sign' },
  { code: CLINICAL_NOTE_COSIGN, name: 'Co-sign Clinical Notes', resource: 'clinical_note', action: 'cosign' },

  // Diagnosis
  { code: DIAGNOSIS_READ, name: 'Read Diagnoses', resource: 'diagnosis', action: 'read' },
  { code: DIAGNOSIS_CREATE, name: 'Create Diagnoses', resource: 'diagnosis', action: 'create' },
  { code: DIAGNOSIS_UPDATE, name: 'Update Diagnoses', resource: 'diagnosis', action: 'update' },
  { code: DIAGNOSIS_DELETE, name: 'Delete Diagnoses', resource: 'diagnosis', action: 'delete' },

  // Vitals
  { code: VITALS_READ, name: 'Read Vital Signs', resource: 'vitals', action: 'read' },
  { code: VITALS_CREATE, name: 'Create Vital Signs', resource: 'vitals', action: 'create' },
  { code: VITALS_UPDATE, name: 'Update Vital Signs', resource: 'vitals', action: 'update' },
  { code: VITALS_DELETE, name: 'Delete Vital Signs', resource: 'vitals', action: 'delete' },

  // Prescription
  { code: PRESCRIPTION_READ, name: 'Read Prescriptions', resource: 'prescription', action: 'read' },
  { code: PRESCRIPTION_CREATE, name: 'Create Prescriptions', resource: 'prescription', action: 'create' },
  { code: PRESCRIPTION_UPDATE, name: 'Update Prescriptions', resource: 'prescription', action: 'update' },
  { code: PRESCRIPTION_DELETE, name: 'Delete Prescriptions', resource: 'prescription', action: 'delete' },
  { code: PRESCRIPTION_DISPENSE, name: 'Dispense Prescriptions', resource: 'prescription', action: 'dispense' },

  // Lab Orders
  { code: LAB_ORDER_READ, name: 'Read Lab Orders', resource: 'lab_order', action: 'read' },
  { code: LAB_ORDER_CREATE, name: 'Create Lab Orders', resource: 'lab_order', action: 'create' },
  { code: LAB_ORDER_UPDATE, name: 'Update Lab Orders', resource: 'lab_order', action: 'update' },
  { code: LAB_ORDER_DELETE, name: 'Delete Lab Orders', resource: 'lab_order', action: 'delete' },
  { code: LAB_ORDER_CANCEL, name: 'Cancel Lab Orders', resource: 'lab_order', action: 'cancel' },
  { code: LAB_RESULT_READ, name: 'Read Lab Results', resource: 'lab_result', action: 'read' },
  { code: LAB_RESULT_ENTER, name: 'Enter Lab Results', resource: 'lab_result', action: 'enter' },

  // Imaging Orders
  { code: IMAGING_ORDER_READ, name: 'Read Imaging Orders', resource: 'imaging_order', action: 'read' },
  { code: IMAGING_ORDER_CREATE, name: 'Create Imaging Orders', resource: 'imaging_order', action: 'create' },
  { code: IMAGING_ORDER_UPDATE, name: 'Update Imaging Orders', resource: 'imaging_order', action: 'update' },
  { code: IMAGING_ORDER_DELETE, name: 'Delete Imaging Orders', resource: 'imaging_order', action: 'delete' },
  { code: IMAGING_RESULT_READ, name: 'Read Imaging Results', resource: 'imaging_result', action: 'read' },
  { code: IMAGING_RESULT_ENTER, name: 'Enter Imaging Results', resource: 'imaging_result', action: 'enter' },

  // Scheduling
  { code: SCHEDULE_READ, name: 'Read Schedules', resource: 'schedule', action: 'read' },
  { code: SCHEDULE_CREATE, name: 'Create Schedules', resource: 'schedule', action: 'create' },
  { code: SCHEDULE_UPDATE, name: 'Update Schedules', resource: 'schedule', action: 'update' },
  { code: SCHEDULE_DELETE, name: 'Delete Schedules', resource: 'schedule', action: 'delete' },
  { code: CALENDAR_READ, name: 'Read Calendar', resource: 'calendar', action: 'read' },

  // Inpatient
  { code: ADMISSION_READ, name: 'Read Admissions', resource: 'admission', action: 'read' },
  { code: ADMISSION_CREATE, name: 'Create Admissions', resource: 'admission', action: 'create' },
  { code: ADMISSION_UPDATE, name: 'Update Admissions', resource: 'admission', action: 'update' },
  { code: DISCHARGE_CREATE, name: 'Create Discharges', resource: 'discharge', action: 'create' },
  { code: DISCHARGE_UPDATE, name: 'Update Discharges', resource: 'discharge', action: 'update' },
  { code: BED_MANAGE, name: 'Manage Beds', resource: 'bed', action: 'manage' },
  { code: WARD_READ, name: 'Read Wards', resource: 'ward', action: 'read' },
  { code: WARD_MANAGE, name: 'Manage Wards', resource: 'ward', action: 'manage' },

  // Triage
  { code: TRIAGE_READ, name: 'Read Triage', resource: 'triage', action: 'read' },
  { code: TRIAGE_CREATE, name: 'Create Triage', resource: 'triage', action: 'create' },
  { code: TRIAGE_UPDATE, name: 'Update Triage', resource: 'triage', action: 'update' },
  { code: TRIAGE_DELETE, name: 'Delete Triage', resource: 'triage', action: 'delete' },

  // Consent
  { code: CONSENT_READ, name: 'Read Consent', resource: 'consent', action: 'read' },
  { code: CONSENT_CREATE, name: 'Create Consent', resource: 'consent', action: 'create' },
  { code: CONSENT_UPDATE, name: 'Update Consent', resource: 'consent', action: 'update' },
  { code: CONSENT_DELETE, name: 'Delete Consent', resource: 'consent', action: 'delete' },
  { code: CONSENT_TEMPLATE_READ, name: 'Read Consent Templates', resource: 'consent_template', action: 'read' },
  { code: CONSENT_TEMPLATE_CREATE, name: 'Create Consent Templates', resource: 'consent_template', action: 'create' },
  { code: CONSENT_TEMPLATE_UPDATE, name: 'Update Consent Templates', resource: 'consent_template', action: 'update' },
  { code: CONSENT_TEMPLATE_DELETE, name: 'Delete Consent Templates', resource: 'consent_template', action: 'delete' },

  // Valueset
  { code: VALUESET_READ, name: 'Read Value Sets', resource: 'valueset', action: 'read' },
  { code: VALUESET_CREATE, name: 'Create Value Sets', resource: 'valueset', action: 'create' },
  { code: VALUESET_UPDATE, name: 'Update Value Sets', resource: 'valueset', action: 'update' },
  { code: VALUESET_DELETE, name: 'Delete Value Sets', resource: 'valueset', action: 'delete' },

  // Clinical Orders
  { code: CLINICAL_ORDER_READ, name: 'Read Clinical Orders', resource: 'clinical_order', action: 'read' },
  { code: CLINICAL_ORDER_CREATE, name: 'Create Clinical Orders', resource: 'clinical_order', action: 'create' },
  { code: CLINICAL_ORDER_UPDATE, name: 'Update Clinical Orders', resource: 'clinical_order', action: 'update' },
  { code: CLINICAL_ORDER_DELETE, name: 'Delete Clinical Orders', resource: 'clinical_order', action: 'delete' },
  { code: CLINICAL_ORDER_CANCEL, name: 'Cancel Clinical Orders', resource: 'clinical_order', action: 'cancel' },

  // Availability
  { code: AVAILABILITY_READ, name: 'Read Availability', resource: 'availability', action: 'read' },

  // Care Channel
  { code: CARE_CHANNEL_READ, name: 'Read Care Channels', resource: 'care_channel', action: 'read' },
  { code: CARE_CHANNEL_CREATE, name: 'Create Care Channels', resource: 'care_channel', action: 'create' },
  { code: CARE_CHANNEL_UPDATE, name: 'Update Care Channels', resource: 'care_channel', action: 'update' },
  { code: CARE_CHANNEL_CLOSE, name: 'Close Care Channels', resource: 'care_channel', action: 'close' },

  // Care Team Membership
  { code: CARE_TEAM_READ, name: 'Read Care Team', resource: 'care_team', action: 'read' },
  { code: CARE_TEAM_ADD, name: 'Add Care Team Members', resource: 'care_team', action: 'add' },
  { code: CARE_TEAM_REMOVE, name: 'Remove Care Team Members', resource: 'care_team', action: 'remove' },

  // Care Channel Messages
  { code: CARE_MESSAGE_READ, name: 'Read Care Messages', resource: 'care_message', action: 'read' },
  { code: CARE_MESSAGE_CREATE, name: 'Create Care Messages', resource: 'care_message', action: 'create' },
  { code: CARE_MESSAGE_DELETE, name: 'Delete Care Messages', resource: 'care_message', action: 'delete' },

  // Checklist
  { code: CHECKLIST_READ, name: 'Read Checklists', resource: 'checklist', action: 'read' },
  { code: CHECKLIST_CREATE, name: 'Create Checklists', resource: 'checklist', action: 'create' },
  { code: CHECKLIST_UPDATE, name: 'Update Checklists', resource: 'checklist', action: 'update' },
  { code: CHECKLIST_DELETE, name: 'Delete Checklists', resource: 'checklist', action: 'delete' },
  { code: CHECKLIST_TEMPLATE_READ, name: 'Read Checklist Templates', resource: 'checklist_template', action: 'read' },
  { code: CHECKLIST_TEMPLATE_CREATE, name: 'Create Checklist Templates', resource: 'checklist_template', action: 'create' },
  { code: CHECKLIST_TEMPLATE_UPDATE, name: 'Update Checklist Templates', resource: 'checklist_template', action: 'update' },

  // Discharge Summary
  { code: DISCHARGE_SUMMARY_READ, name: 'Read Discharge Summaries', resource: 'discharge_summary', action: 'read' },
  { code: DISCHARGE_SUMMARY_CREATE, name: 'Create Discharge Summaries', resource: 'discharge_summary', action: 'create' },
  { code: DISCHARGE_SUMMARY_UPDATE, name: 'Update Discharge Summaries', resource: 'discharge_summary', action: 'update' },

  // Note Templates
  { code: NOTE_TEMPLATE_READ, name: 'Read Note Templates', resource: 'note_template', action: 'read' },
  { code: NOTE_TEMPLATE_CREATE, name: 'Create Note Templates', resource: 'note_template', action: 'create' },
  { code: NOTE_TEMPLATE_UPDATE, name: 'Update Note Templates', resource: 'note_template', action: 'update' },
  { code: NOTE_TEMPLATE_DELETE, name: 'Delete Note Templates', resource: 'note_template', action: 'delete' },

  // Billing
  { code: INVOICE_READ, name: 'Read Invoices', resource: 'invoice', action: 'read' },
  { code: INVOICE_CREATE, name: 'Create Invoices', resource: 'invoice', action: 'create' },
  { code: INVOICE_UPDATE, name: 'Update Invoices', resource: 'invoice', action: 'update' },
  { code: INVOICE_DELETE, name: 'Delete Invoices', resource: 'invoice', action: 'delete' },
  { code: INVOICE_VOID, name: 'Void Invoices', resource: 'invoice', action: 'void' },
  { code: PAYMENT_READ, name: 'Read Payments', resource: 'payment', action: 'read' },
  { code: PAYMENT_CREATE, name: 'Create Payments', resource: 'payment', action: 'create' },
  { code: PAYMENT_REFUND, name: 'Refund Payments', resource: 'payment', action: 'refund' },
  { code: CLAIM_READ, name: 'Read Claims', resource: 'claim', action: 'read' },
  { code: CLAIM_CREATE, name: 'Create Claims', resource: 'claim', action: 'create' },
  { code: CLAIM_SUBMIT, name: 'Submit Claims', resource: 'claim', action: 'submit' },
  { code: CLAIM_UPDATE, name: 'Update Claims', resource: 'claim', action: 'update' },

  // Catalog
  { code: CATALOG_READ, name: 'Read Catalogs', resource: 'catalog', action: 'read' },
  { code: CATALOG_CREATE, name: 'Create Catalogs', resource: 'catalog', action: 'create' },
  { code: CATALOG_UPDATE, name: 'Update Catalogs', resource: 'catalog', action: 'update' },
  { code: CATALOG_DELETE, name: 'Delete Catalogs', resource: 'catalog', action: 'delete' },

  // User Management
  { code: USER_READ, name: 'Read Users', resource: 'user', action: 'read' },
  { code: USER_CREATE, name: 'Create Users', resource: 'user', action: 'create' },
  { code: USER_UPDATE, name: 'Update Users', resource: 'user', action: 'update' },
  { code: USER_DELETE, name: 'Delete Users', resource: 'user', action: 'delete' },
  { code: USER_ACTIVATE, name: 'Activate Users', resource: 'user', action: 'activate' },
  { code: USER_DEACTIVATE, name: 'Deactivate Users', resource: 'user', action: 'deactivate' },
  { code: USER_RESET_PASSWORD, name: 'Reset User Passwords', resource: 'user', action: 'reset_password' },

  // Staff Management
  { code: STAFF_READ, name: 'Read Staff', resource: 'staff', action: 'read' },
  { code: STAFF_CREATE, name: 'Create Staff', resource: 'staff', action: 'create' },
  { code: STAFF_UPDATE, name: 'Update Staff', resource: 'staff', action: 'update' },
  { code: STAFF_DELETE, name: 'Delete Staff', resource: 'staff', action: 'delete' },

  // Facility Management
  { code: FACILITY_READ, name: 'Read Facilities', resource: 'facility', action: 'read' },
  { code: FACILITY_CREATE, name: 'Create Facilities', resource: 'facility', action: 'create' },
  { code: FACILITY_UPDATE, name: 'Update Facilities', resource: 'facility', action: 'update' },
  { code: FACILITY_DELETE, name: 'Delete Facilities', resource: 'facility', action: 'delete' },

  // RBAC
  { code: RBAC_READ, name: 'Read RBAC', resource: 'rbac', action: 'read' },
  { code: RBAC_MANAGE, name: 'Manage RBAC', resource: 'rbac', action: 'manage' },
  { code: ROLE_CREATE, name: 'Create Roles', resource: 'role', action: 'create' },
  { code: ROLE_UPDATE, name: 'Update Roles', resource: 'role', action: 'update' },
  { code: ROLE_DELETE, name: 'Delete Roles', resource: 'role', action: 'delete' },
  { code: ROLE_ASSIGN, name: 'Assign Roles', resource: 'role', action: 'assign' },
  { code: PERMISSION_READ, name: 'Read Permissions', resource: 'permission', action: 'read' },

  // Tenant
  { code: TENANT_READ, name: 'Read Tenants', resource: 'tenant', action: 'read' },
  { code: TENANT_CREATE, name: 'Create Tenants', resource: 'tenant', action: 'create' },
  { code: TENANT_UPDATE, name: 'Update Tenants', resource: 'tenant', action: 'update' },
  { code: TENANT_DELETE, name: 'Delete Tenants', resource: 'tenant', action: 'delete' },

  // Audit
  { code: AUDIT_READ, name: 'Read Audit Logs', resource: 'audit', action: 'read' },
  { code: AUDIT_EXPORT, name: 'Export Audit Logs', resource: 'audit', action: 'export' },

  // Reports
  { code: REPORT_READ, name: 'Read Reports', resource: 'report', action: 'read' },
  { code: REPORT_CREATE, name: 'Create Reports', resource: 'report', action: 'create' },
  { code: REPORT_EXPORT, name: 'Export Reports', resource: 'report', action: 'export' },

  // Configuration
  { code: CONFIG_READ, name: 'Read Configuration', resource: 'config', action: 'read' },
  { code: CONFIG_UPDATE, name: 'Update Configuration', resource: 'config', action: 'update' },

  // Notifications
  { code: NOTIFICATION_READ, name: 'Read Notifications', resource: 'notification', action: 'read' },
  { code: NOTIFICATION_CREATE, name: 'Create Notifications', resource: 'notification', action: 'create' },
  { code: NOTIFICATION_TEMPLATE_MANAGE, name: 'Manage Notification Templates', resource: 'notification_template', action: 'manage' },
  { code: NOTIFICATION_RULE_MANAGE, name: 'Manage Notification Rules', resource: 'notification_rule', action: 'manage' },
];

/**
 * Type-safe permission type
 */
export type PermissionCode = typeof ALL_PERMISSIONS[number]['code'];
