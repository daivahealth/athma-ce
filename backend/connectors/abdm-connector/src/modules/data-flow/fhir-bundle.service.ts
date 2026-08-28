/**
 * NRCES-profiled FHIR R4 document bundles (issue #116).
 *
 * v1 ships the OPConsultRecord shape — the composition every outpatient
 * encounter can produce from core data alone (patient + encounter +
 * chief complaint). Profile URLs are versioned constants; richer sections
 * (diagnoses, prescriptions, reports) land as the clinical internal summary
 * grows. Reconciliation pass against NRCES validators expected once sandbox
 * interop runs.
 */

import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

const NRCES = 'https://nrces.in/ndhm/fhir/r4/StructureDefinition';

export interface EncounterSummary {
  encounter: {
    id: string;
    encounterNumber?: string;
    encounterClass?: string;
    encounterType?: string;
    status?: string;
    startTime?: string;
    endTime?: string | null;
    chiefComplaint?: string | null;
    facilityName?: string | null;
    departmentName?: string | null;
  };
  patient: {
    id: string;
    mrn?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    gender?: string | null;
    dateOfBirth?: string | null;
  };
}

@Injectable()
export class FhirBundleService {
  buildOpConsultBundle(summary: EncounterSummary, abhaAddress: string): Record<string, unknown> {
    const now = new Date().toISOString();
    const bundleId = crypto.randomUUID();
    const compositionId = crypto.randomUUID();
    const patientUrn = `urn:uuid:${summary.patient.id}`;
    const encounterUrn = `urn:uuid:${summary.encounter.id}`;
    const name = [summary.patient.firstName, summary.patient.lastName].filter(Boolean).join(' ') || 'Unknown';

    return {
      resourceType: 'Bundle',
      id: bundleId,
      meta: { profile: [`${NRCES}/DocumentBundle`], lastUpdated: now },
      identifier: { system: 'https://athma.dev/bundle', value: bundleId },
      type: 'document',
      timestamp: now,
      entry: [
        {
          fullUrl: `urn:uuid:${compositionId}`,
          resource: {
            resourceType: 'Composition',
            id: compositionId,
            meta: { profile: [`${NRCES}/OPConsultRecord`] },
            status: 'final',
            type: {
              coding: [
                { system: 'http://snomed.info/sct', code: '371530004', display: 'Clinical consultation report' },
              ],
              text: 'OP Consultation Record',
            },
            subject: { reference: patientUrn, display: name },
            encounter: { reference: encounterUrn },
            date: summary.encounter.endTime ?? summary.encounter.startTime ?? now,
            author: [{ display: summary.encounter.facilityName ?? 'Facility' }],
            title: 'OP Consultation Record',
            section: [
              {
                title: 'Chief complaint',
                code: {
                  coding: [
                    { system: 'http://snomed.info/sct', code: '422843007', display: 'Chief complaint section' },
                  ],
                },
                text: {
                  status: 'generated',
                  div: `<div xmlns="http://www.w3.org/1999/xhtml">${this.escape(summary.encounter.chiefComplaint ?? 'Not recorded')}</div>`,
                },
              },
            ],
          },
        },
        {
          fullUrl: patientUrn,
          resource: {
            resourceType: 'Patient',
            id: summary.patient.id,
            meta: { profile: [`${NRCES}/Patient`] },
            identifier: [
              ...(summary.patient.mrn
                ? [{ type: { text: 'MRN' }, value: summary.patient.mrn }]
                : []),
              { system: 'https://healthid.ndhm.gov.in', value: abhaAddress },
            ],
            name: [{ text: name }],
            ...(summary.patient.gender
              ? { gender: this.fhirGender(summary.patient.gender) }
              : {}),
            ...(summary.patient.dateOfBirth
              ? { birthDate: summary.patient.dateOfBirth.slice(0, 10) }
              : {}),
          },
        },
        {
          fullUrl: encounterUrn,
          resource: {
            resourceType: 'Encounter',
            id: summary.encounter.id,
            meta: { profile: [`${NRCES}/Encounter`] },
            ...(summary.encounter.encounterNumber
              ? { identifier: [{ value: summary.encounter.encounterNumber }] }
              : {}),
            status: summary.encounter.status === 'finished' ? 'finished' : 'unknown',
            class: {
              system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
              code: summary.encounter.encounterClass ?? 'AMB',
            },
            subject: { reference: patientUrn },
            period: {
              ...(summary.encounter.startTime ? { start: summary.encounter.startTime } : {}),
              ...(summary.encounter.endTime ? { end: summary.encounter.endTime } : {}),
            },
            ...(summary.encounter.departmentName
              ? { serviceType: { text: summary.encounter.departmentName } }
              : {}),
          },
        },
      ],
    };
  }

  private fhirGender(raw: string): string {
    const g = raw.toLowerCase();
    if (g.startsWith('m')) return 'male';
    if (g.startsWith('f')) return 'female';
    if (g.startsWith('o')) return 'other';
    return 'unknown';
  }

  private escape(value: string): string {
    return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}
