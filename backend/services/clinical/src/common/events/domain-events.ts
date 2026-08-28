/**
 * Event catalog v1 (ADR-0015 §5, issue #112).
 *
 * Envelope rule: payloads carry ids and minimal denormalization only —
 * consumers fetch PHI through authorized APIs, never from the event stream.
 * Types are versioned via eventVersion; breaking payload changes bump it.
 */

export const DOMAIN_EVENTS = {
  /** A national identity was linked/verified on a patient. */
  PATIENT_IDENTITY_LINKED: 'patient.identity.linked',
  /** An encounter reached a terminal 'finished' status. */
  ENCOUNTER_CLOSED: 'encounter.closed',
  /** A clinical document was signed/finalized. (No emitter yet — M2 FHIR work.) */
  CLINICAL_DOCUMENT_FINALIZED: 'clinical_document.finalized',
} as const;

export type DomainEventType = (typeof DOMAIN_EVENTS)[keyof typeof DOMAIN_EVENTS];

export interface DomainEventInput {
  eventType: DomainEventType;
  tenantId: string;
  facilityId?: string | undefined;
  aggregateType: 'patient' | 'encounter' | 'clinical_document';
  aggregateId: string;
  /** Ids + minimal denormalization only. Never identifiers, tokens, or documents. */
  payload: Record<string, unknown>;
}
