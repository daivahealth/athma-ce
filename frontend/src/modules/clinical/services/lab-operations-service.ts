import { clinicalClient } from '@/lib/api/client';
import type {
  AccessionLabSpecimenInput,
  PrepareLabSpecimenInput,
  PrepareLabSpecimenResult,
  CollectLabSpecimenInput,
  CompleteLabResultEntryInput,
  CreateLabProcessingRunInput,
  LabReportContext,
  LabCollectionWorklistItem,
  LabProcessingRun,
  LabProcessingWorklistItem,
  LabSpecimen,
  LabWorklistStage,
  ReceiveLabSpecimenInput,
  RejectLabSpecimenInput,
  StartLabResultEntryContext,
  StartLabResultEntryInput,
} from '../types/lab-operations';

class LabOperationsService {
  async getWorklist(
    stage: LabWorklistStage,
    params?: { encounterId?: string; patientId?: string },
  ): Promise<LabCollectionWorklistItem[] | LabSpecimen[] | LabProcessingWorklistItem[]> {
    const response = await clinicalClient.get(`/lab-operations/worklists/${stage}`, {
      params,
    });
    return response.data;
  }

  async getSpecimen(id: string): Promise<LabSpecimen> {
    const response = await clinicalClient.get(`/lab-operations/specimens/${id}`);
    return response.data;
  }

  async prepareSpecimen(payload: PrepareLabSpecimenInput): Promise<PrepareLabSpecimenResult> {
    const response = await clinicalClient.post('/lab-operations/collection/prepare', payload);
    return response.data;
  }

  async collectSpecimen(payload: CollectLabSpecimenInput): Promise<LabSpecimen> {
    const response = await clinicalClient.post('/lab-operations/collection', payload);
    return response.data;
  }

  async getSpecimenLabel(id: string): Promise<PrepareLabSpecimenResult['label']> {
    const response = await clinicalClient.post(`/lab-operations/specimens/${id}/print-label`, {});
    return response.data;
  }

  async receiveSpecimen(id: string, payload: ReceiveLabSpecimenInput = {}): Promise<LabSpecimen> {
    const response = await clinicalClient.post(`/lab-operations/specimens/${id}/receive`, payload);
    return response.data;
  }

  async accessionSpecimen(id: string, payload: AccessionLabSpecimenInput = {}): Promise<LabSpecimen> {
    const response = await clinicalClient.post(`/lab-operations/specimens/${id}/accession`, payload);
    return response.data;
  }

  async rejectSpecimen(id: string, payload: RejectLabSpecimenInput): Promise<LabSpecimen> {
    const response = await clinicalClient.post(`/lab-operations/specimens/${id}/reject`, payload);
    return response.data;
  }

  async createProcessingRun(payload: CreateLabProcessingRunInput): Promise<LabProcessingRun> {
    const response = await clinicalClient.post('/lab-operations/processing', payload);
    return response.data;
  }

  async getResultEntryContext(
    labOrderTestId: string,
    specimenId?: string,
  ): Promise<LabReportContext> {
    const response = await clinicalClient.get(`/lab-operations/result-entry/context/${labOrderTestId}`, {
      params: specimenId ? { specimenId } : undefined,
    });
    return response.data;
  }

  async startResultEntry(payload: StartLabResultEntryInput): Promise<StartLabResultEntryContext> {
    const response = await clinicalClient.post('/lab-operations/result-entry/start', payload);
    return response.data;
  }

  async completeResultEntry(payload: CompleteLabResultEntryInput): Promise<{
    reportId: string;
    specimenId: string;
    labOrderTestId: string;
    status: string;
  }> {
    const response = await clinicalClient.post('/lab-operations/result-entry/complete', payload);
    return response.data;
  }
}

export const labOperationsService = new LabOperationsService();
