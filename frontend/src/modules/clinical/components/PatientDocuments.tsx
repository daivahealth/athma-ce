'use client';

import { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Upload,
  FileText,
  Trash2,
  Eye,
  X,
  File,
  Image,
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import {
  usePatientDocuments,
  useUploadDocument,
  useDeleteDocument,
} from '../hooks/use-patient-documents';
import { patientDocumentService } from '../services/patient-document-service';
import type { PatientDocument } from '../types/patient-document';

const DOCUMENT_TYPES = [
  { value: 'emirates_id', label: 'Emirates ID' },
  { value: 'passport', label: 'Passport' },
  { value: 'visa', label: 'Visa' },
  { value: 'insurance_card', label: 'Insurance Card' },
  { value: 'lab_report', label: 'Lab Report' },
  { value: 'prescription', label: 'Prescription' },
  { value: 'referral_letter', label: 'Referral Letter' },
  { value: 'consent_form', label: 'Consent Form' },
  { value: 'medical_report', label: 'Medical Report' },
  { value: 'radiology_report', label: 'Radiology Report' },
  { value: 'discharge_summary', label: 'Discharge Summary' },
  { value: 'other', label: 'Other' },
];

interface PatientDocumentsProps {
  patientId: string;
}

export function PatientDocuments({ patientId }: PatientDocumentsProps) {
  const { data: documents, isLoading } = usePatientDocuments(patientId);
  const uploadMutation = useUploadDocument(patientId);
  const deleteMutation = useDeleteDocument(patientId);

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState('other');
  const [documentNumber, setDocumentNumber] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = useCallback(() => {
    setSelectedFile(null);
    setDocumentType('other');
    setDocumentNumber('');
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
    }
  }, []);

  const handleUpload = async () => {
    if (!selectedFile) return;

    await uploadMutation.mutateAsync({
      file: selectedFile,
      documentType,
      documentNumber: documentNumber || undefined,
    });

    resetForm();
    setIsUploadOpen(false);
  };

  const handleDelete = async (documentId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    await deleteMutation.mutateAsync(documentId);
  };

  const getDocumentTypeLabel = (type: string) => {
    return DOCUMENT_TYPES.find((t) => t.value === type)?.label || type;
  };

  const getVerificationBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-500 text-white">Verified</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const getFileIcon = (doc: PatientDocument) => {
    const mimeType = doc.metadata?.mimeType || '';
    if (mimeType.startsWith('image/')) {
      return <Image className="h-5 w-5 text-blue-500" />;
    }
    return <File className="h-5 w-5 text-red-500" />;
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return '';
    try {
      return format(parseISO(dateStr), 'MMM dd, yyyy');
    } catch {
      return '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Patient Documents
          </CardTitle>
          <Dialog open={isUploadOpen} onOpenChange={(open) => {
            setIsUploadOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Upload Patient Document</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {/* Drag & Drop Zone */}
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                    dragActive
                      ? 'border-primary bg-primary/5'
                      : 'border-muted-foreground/25 hover:border-primary/50'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.tiff,.doc,.docx"
                    onChange={handleFileSelect}
                  />
                  {selectedFile ? (
                    <div className="flex items-center justify-center gap-2">
                      <File className="h-8 w-8 text-primary" />
                      <div className="text-left">
                        <p className="font-medium text-sm">{selectedFile.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(selectedFile.size)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFile(null);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Drag & drop a file here, or click to browse
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PDF, Images, Word documents (max 10MB)
                      </p>
                    </div>
                  )}
                </div>

                {/* Document Type */}
                <div className="space-y-2">
                  <Label>Document Type</Label>
                  <Select value={documentType} onValueChange={setDocumentType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DOCUMENT_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Document Number (optional) */}
                <div className="space-y-2">
                  <Label>Document Number (optional)</Label>
                  <Input
                    value={documentNumber}
                    onChange={(e) => setDocumentNumber(e.target.value)}
                    placeholder="e.g., passport number, ID number"
                  />
                </div>

                {/* Upload Button */}
                <Button
                  onClick={handleUpload}
                  disabled={!selectedFile || uploadMutation.isPending}
                  className="w-full"
                >
                  {uploadMutation.isPending ? 'Uploading...' : 'Upload Document'}
                </Button>

                {uploadMutation.isError && (
                  <p className="text-sm text-destructive">
                    Upload failed. Please try again.
                  </p>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : !documents || documents.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            No documents uploaded yet.
          </p>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                {getFileIcon(doc)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm truncate">
                      {doc.metadata?.originalName || `${getDocumentTypeLabel(doc.documentType)}`}
                    </span>
                    {getVerificationBadge(doc.verificationStatus)}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                    <span>{getDocumentTypeLabel(doc.documentType)}</span>
                    {doc.documentNumber && <span>#{doc.documentNumber}</span>}
                    {doc.metadata?.size && (
                      <span>{formatFileSize(doc.metadata.size)}</span>
                    )}
                    <span>{formatDate(doc.createdAt)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {doc.documentUrl && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const url = patientDocumentService.getDocumentViewUrl(doc.documentUrl!);
                        window.open(url, '_blank');
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(doc.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
