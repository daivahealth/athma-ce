import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { patientDocumentService } from '../services/patient-document-service';
import type { UploadDocumentDto } from '../types/patient-document';

const DOCUMENT_KEYS = {
  all: (patientId: string) => ['patient-documents', patientId] as const,
};

export function usePatientDocuments(patientId: string) {
  return useQuery({
    queryKey: DOCUMENT_KEYS.all(patientId),
    queryFn: () => patientDocumentService.getDocuments(patientId),
    enabled: !!patientId,
    staleTime: 30_000,
  });
}

export function useUploadDocument(patientId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: UploadDocumentDto) =>
      patientDocumentService.uploadDocument(patientId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DOCUMENT_KEYS.all(patientId) });
    },
  });
}

export function useDeleteDocument(patientId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (documentId: string) =>
      patientDocumentService.deleteDocument(patientId, documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DOCUMENT_KEYS.all(patientId) });
    },
  });
}
