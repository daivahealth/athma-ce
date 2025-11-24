/**
 * Charge Posting Event Emitter
 *
 * Simple HTTP-based emitter for sending clinical events to the RCM service
 * for automated charge posting via the charge posting rules engine.
 *
 * This is a fire-and-forget implementation - clinical operations will not fail
 * if the RCM service is unavailable.
 */

import axios, { AxiosError } from 'axios';
import { Injectable, Logger } from '@nestjs/common';

export interface ChargePostingEvent {
  eventType: string;
  eventSource: string;
  eventId: string;
  patientId: string;
  encounterId?: string | null;
  eventData: Record<string, any>;
  occurredAt?: Date;
}

@Injectable()
export class ChargePostingEmitter {
  private readonly logger = new Logger(ChargePostingEmitter.name);
  private readonly rcmServiceUrl: string;
  private readonly enabled: boolean;

  constructor() {
    this.rcmServiceUrl = process.env.RCM_SERVICE_URL || 'http://localhost:3012';
    this.enabled = process.env.CHARGE_POSTING_ENABLED !== 'false'; // Enabled by default
  }

  /**
   * Emit a clinical event to the RCM service for charge posting
   *
   * @param tenantId - Tenant UUID
   * @param event - Event details
   * @returns Promise<boolean> - true if successful, false otherwise
   */
  async emitEvent(tenantId: string, event: ChargePostingEvent): Promise<boolean> {
    if (!this.enabled) {
      this.logger.debug('Charge posting is disabled, skipping event emission');
      return false;
    }

    if (!tenantId) {
      this.logger.error('Cannot emit charge posting event: tenantId is required');
      return false;
    }

    try {
      const response = await axios.post(
        `${this.rcmServiceUrl}/api/v1/charge-posting-rules/process-event`,
        {
          eventType: event.eventType,
          eventSource: event.eventSource,
          eventId: event.eventId,
          patientId: event.patientId,
          encounterId: event.encounterId,
          eventData: event.eventData,
          occurredAt: event.occurredAt || new Date(),
        },
        {
          headers: {
            'x-tenant-id': tenantId,
            'Content-Type': 'application/json',
          },
          timeout: 5000, // 5 second timeout
        }
      );

      this.logger.log(
        `Charge posting event emitted: ${event.eventType} for patient ${event.patientId}. ` +
        `Matched ${response.data?.rulesMatched || 0} rules, created ${response.data?.chargesCreated || 0} charges`
      );

      return true;
    } catch (error) {
      this.logError(error as AxiosError, event);
      return false;
    }
  }

  /**
   * Emit multiple events in parallel
   * Useful when a single clinical action creates multiple billable items
   */
  async emitEvents(tenantId: string, events: ChargePostingEvent[]): Promise<boolean[]> {
    const promises = events.map(event => this.emitEvent(tenantId, event));
    return Promise.all(promises);
  }

  /**
   * Helper method for lab test orders
   */
  async emitLabTestOrder(
    tenantId: string,
    orderId: string,
    patientId: string,
    encounterId: string | null,
    labTestDetails: {
      testCode: string;
      testName: string;
      quantity?: number;
      urgent?: boolean;
      category?: string;
      [key: string]: any;
    }
  ): Promise<boolean> {
    return this.emitEvent(tenantId, {
      eventType: 'lab_test_ordered',
      eventSource: 'order',
      eventId: orderId,
      patientId,
      encounterId,
      eventData: {
        quantity: 1,
        urgent: false,
        ...labTestDetails,
      },
    });
  }

  /**
   * Helper method for medication dispensing
   */
  async emitMedicationDispensed(
    tenantId: string,
    dispenseId: string,
    patientId: string,
    encounterId: string | null,
    medicationDetails: {
      medicationCode: string;
      medicationName: string;
      quantity: number;
      unitPrice?: number;
      [key: string]: any;
    }
  ): Promise<boolean> {
    return this.emitEvent(tenantId, {
      eventType: 'medication_dispensed',
      eventSource: 'pharmacy',
      eventId: dispenseId,
      patientId,
      encounterId,
      eventData: medicationDetails,
    });
  }

  /**
   * Helper method for procedure performance
   */
  async emitProcedurePerformed(
    tenantId: string,
    procedureId: string,
    patientId: string,
    encounterId: string | null,
    procedureDetails: {
      procedureCode: string;
      procedureName: string;
      procedureCategory?: string;
      performedBy?: string;
      [key: string]: any;
    }
  ): Promise<boolean> {
    return this.emitEvent(tenantId, {
      eventType: 'procedure_performed',
      eventSource: 'encounter',
      eventId: procedureId,
      patientId,
      encounterId,
      eventData: procedureDetails,
    });
  }

  /**
   * Helper method for imaging study orders
   */
  async emitImagingStudyOrder(
    tenantId: string,
    orderId: string,
    patientId: string,
    encounterId: string | null,
    imagingDetails: {
      studyCode: string;
      studyName: string;
      modality: string;
      bodyPart: string;
      urgent?: boolean;
      contrastRequired?: boolean;
      [key: string]: any;
    }
  ): Promise<boolean> {
    return this.emitEvent(tenantId, {
      eventType: 'imaging_study_ordered',
      eventSource: 'order',
      eventId: orderId,
      patientId,
      encounterId,
      eventData: {
        quantity: 1,
        urgent: false,
        contrastRequired: false,
        ...imagingDetails,
      },
    });
  }

  /**
   * Helper method for consultation completion
   */
  async emitConsultationCompleted(
    tenantId: string,
    encounterId: string,
    patientId: string,
    consultationDetails: {
      encounterType: string;
      specialty?: string;
      duration?: number;
      consultantId?: string;
      [key: string]: any;
    }
  ): Promise<boolean> {
    return this.emitEvent(tenantId, {
      eventType: 'consultation_completed',
      eventSource: 'encounter',
      eventId: encounterId,
      patientId,
      encounterId,
      eventData: consultationDetails,
    });
  }

  private logError(error: AxiosError, event: ChargePostingEvent): void {
    if (error.code === 'ECONNREFUSED') {
      this.logger.warn(
        `RCM service is not available at ${this.rcmServiceUrl}. ` +
        `Event ${event.eventType} for patient ${event.patientId} was not processed. ` +
        `Clinical operations continue normally.`
      );
    } else if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
      this.logger.warn(
        `RCM service request timeout for event ${event.eventType}. ` +
        `Patient ${event.patientId}. Clinical operations continue normally.`
      );
    } else {
      this.logger.error(
        `Failed to emit charge posting event: ${event.eventType} for patient ${event.patientId}`,
        error.message
      );
    }
  }
}
