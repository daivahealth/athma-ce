import { foundationClient, clinicalClient } from '@/lib/api/client';
import type {
  Medication,
  LabTest,
  ImagingStudy,
  Procedure,
  CatalogFilters,
  Diagnosis,
  DiagnosisVersion,
  DiagnosisFilters,
  DiagnosisVersionFilters,
  NoteTemplate,
  NoteTemplateVersion,
  NoteTemplateFilters,
  NoteTemplateStatistics,
  CreateNoteTemplateInput,
} from '../types/catalog';

class CatalogService {
  // ========================================
  // MEDICATIONS
  // ========================================

  async listMedications(filters?: CatalogFilters): Promise<Medication[]> {
    const response = await foundationClient.get('/catalogs/medications', {
      params: filters,
    });
    return response.data;
  }

  async getMedicationById(id: string): Promise<Medication> {
    const response = await foundationClient.get(`/catalogs/medications/${id}`);
    return response.data;
  }

  async createMedication(data: Partial<Medication>): Promise<Medication> {
    const response = await foundationClient.post('/catalogs/medications', data);
    return response.data;
  }

  async updateMedication(id: string, data: Partial<Medication>): Promise<Medication> {
    const response = await foundationClient.put(`/catalogs/medications/${id}`, data);
    return response.data;
  }

  async deleteMedication(id: string): Promise<void> {
    await foundationClient.delete(`/catalogs/medications/${id}`);
  }

  // ========================================
  // LAB TESTS
  // ========================================

  async listLabTests(filters?: CatalogFilters): Promise<LabTest[]> {
    const response = await foundationClient.get('/catalogs/lab-tests', {
      params: filters,
    });
    return response.data;
  }

  async getLabTestById(id: string): Promise<LabTest> {
    const response = await foundationClient.get(`/catalogs/lab-tests/${id}`);
    return response.data;
  }

  async createLabTest(data: Partial<LabTest>): Promise<LabTest> {
    const response = await foundationClient.post('/catalogs/lab-tests', data);
    return response.data;
  }

  async updateLabTest(id: string, data: Partial<LabTest>): Promise<LabTest> {
    const response = await foundationClient.put(`/catalogs/lab-tests/${id}`, data);
    return response.data;
  }

  async deleteLabTest(id: string): Promise<void> {
    await foundationClient.delete(`/catalogs/lab-tests/${id}`);
  }

  // ========================================
  // IMAGING STUDIES
  // ========================================

  async listImagingStudies(filters?: CatalogFilters): Promise<ImagingStudy[]> {
    const response = await foundationClient.get('/catalogs/imaging-studies', {
      params: filters,
    });
    return response.data;
  }

  async getImagingStudyById(id: string): Promise<ImagingStudy> {
    const response = await foundationClient.get(`/catalogs/imaging-studies/${id}`);
    return response.data;
  }

  async createImagingStudy(data: Partial<ImagingStudy>): Promise<ImagingStudy> {
    const response = await foundationClient.post('/catalogs/imaging-studies', data);
    return response.data;
  }

  async updateImagingStudy(id: string, data: Partial<ImagingStudy>): Promise<ImagingStudy> {
    const response = await foundationClient.put(`/catalogs/imaging-studies/${id}`, data);
    return response.data;
  }

  async deleteImagingStudy(id: string): Promise<void> {
    await foundationClient.delete(`/catalogs/imaging-studies/${id}`);
  }

  // ========================================
  // PROCEDURES
  // ========================================

  async listProcedures(filters?: CatalogFilters): Promise<Procedure[]> {
    const response = await foundationClient.get('/catalogs/procedures', {
      params: filters,
    });
    return response.data;
  }

  async getProcedureById(id: string): Promise<Procedure> {
    const response = await foundationClient.get(`/catalogs/procedures/${id}`);
    return response.data;
  }

  async createProcedure(data: Partial<Procedure>): Promise<Procedure> {
    const response = await foundationClient.post('/catalogs/procedures', data);
    return response.data;
  }

  async updateProcedure(id: string, data: Partial<Procedure>): Promise<Procedure> {
    const response = await foundationClient.put(`/catalogs/procedures/${id}`, data);
    return response.data;
  }

  async deleteProcedure(id: string): Promise<void> {
    await foundationClient.delete(`/catalogs/procedures/${id}`);
  }

  // ========================================
  // DIAGNOSIS VERSIONS & DIAGNOSES
  // ========================================

  async listDiagnosisVersions(filters?: DiagnosisVersionFilters): Promise<DiagnosisVersion[]> {
    const response = await foundationClient.get('/catalogs/diagnosis-versions', {
      params: filters,
    });
    return response.data;
  }

  async getDiagnosisVersionById(id: string): Promise<DiagnosisVersion> {
    const response = await foundationClient.get(`/catalogs/diagnosis-versions/${id}`);
    return response.data;
  }

  async listDiagnoses(filters?: DiagnosisFilters): Promise<Diagnosis[]> {
    const response = await foundationClient.get('/catalogs/diagnoses', {
      params: filters,
    });
    return response.data;
  }

  async getDiagnosisById(id: string): Promise<Diagnosis> {
    const response = await foundationClient.get(`/catalogs/diagnoses/${id}`);
    return response.data;
  }

  // ========================================
  // NOTE TEMPLATES
  // ========================================

  async listNoteTemplates(filters?: NoteTemplateFilters): Promise<NoteTemplate[]> {
    const response = await clinicalClient.get('/note-templates', { params: filters });
    return response.data;
  }

  async getNoteTemplateById(id: string): Promise<NoteTemplate> {
    const response = await clinicalClient.get(`/note-templates/${id}`);
    return response.data;
  }

  async getNoteTemplateVersion(id: string, version: number): Promise<NoteTemplate> {
    const response = await clinicalClient.get(`/note-templates/${id}/version/${version}`);
    return response.data;
  }

  async getNoteTemplateStatistics(): Promise<NoteTemplateStatistics> {
    const response = await clinicalClient.get('/note-templates/statistics/summary');
    return response.data;
  }

  async createNoteTemplate(data: CreateNoteTemplateInput): Promise<NoteTemplate> {
    const response = await clinicalClient.post('/note-templates', data);
    return response.data;
  }

  async updateNoteTemplate(id: string, data: Partial<NoteTemplate>): Promise<NoteTemplate> {
    const response = await clinicalClient.put(`/note-templates/${id}`, data);
    return response.data;
  }

  async createNoteTemplateVersion(
    id: string,
    data: Partial<NoteTemplateVersion>
  ): Promise<NoteTemplateVersion> {
    const response = await clinicalClient.post(`/note-templates/${id}/versions`, data);
    return response.data;
  }

  async archiveNoteTemplate(id: string): Promise<void> {
    await clinicalClient.delete(`/note-templates/${id}`);
  }
}

export const catalogService = new CatalogService();
