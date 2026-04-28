'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ExternalLink, User, Calendar, Building2, Stethoscope, FileText, Hash, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useLocale } from 'next-intl';
import type { SearchResult, DocumentType } from '../types/search';
import { DOCUMENT_TYPE_LABELS } from '../types/search';
import { cn } from '@/lib/utils';

interface DocumentPreviewProps {
  result: SearchResult | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function getDocumentTypeColor(type: DocumentType): string {
  const colors: Record<DocumentType, string> = {
    encounter_note: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    discharge_summary: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    clinical_note: 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary',
    progress_note: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
    consultation_note: 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300',
    procedure_note: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300',
    operative_note: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    radiology_report: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
    lab_report: 'bg-lime-100 text-lime-700 dark:bg-lime-900 dark:text-lime-300',
    pathology_report: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
  };
  return colors[type] || 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
}

/**
 * Get the navigation URL for a document based on its type
 */
function getDocumentUrl(result: SearchResult, locale: string): string {
  const { documentType, encounterId, patientId, documentId } = result;

  switch (documentType) {
    case 'encounter_note':
    case 'clinical_note':
    case 'progress_note':
    case 'consultation_note':
    case 'procedure_note':
    case 'operative_note':
      // Navigate to encounter charting page
      if (encounterId) {
        return `/${locale}/encounters/${encounterId}/charting`;
      }
      // Fallback to patient page
      return `/${locale}/patients/${patientId}`;

    case 'discharge_summary':
      // Navigate to encounter page or inpatient view
      if (encounterId) {
        return `/${locale}/encounters/${encounterId}`;
      }
      return `/${locale}/patients/${patientId}`;

    case 'radiology_report':
    case 'lab_report':
    case 'pathology_report':
      // Navigate to patient 360 view or encounter
      if (encounterId) {
        return `/${locale}/encounters/${encounterId}`;
      }
      return `/${locale}/patients/${patientId}/360`;

    default:
      return `/${locale}/patients/${patientId}`;
  }
}

export function DocumentPreview({ result, open, onOpenChange }: DocumentPreviewProps) {
  const router = useRouter();
  const locale = useLocale();

  if (!result) return null;

  const similarityPercent = Math.round(result.similarity * 100);
  const documentUrl = getDocumentUrl(result, locale);

  const handleViewFull = () => {
    onOpenChange(false);
    router.push(documentUrl);
  };

  const handleViewPatient = () => {
    onOpenChange(false);
    router.push(`/${locale}/patients/${result.patientId}`);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl">
        <SheetHeader className="space-y-3">
          <div className="flex items-center justify-between">
            <Badge className={cn('text-xs', getDocumentTypeColor(result.documentType))}>
              {DOCUMENT_TYPE_LABELS[result.documentType] || result.documentType}
            </Badge>
            <span className="text-sm font-medium text-green-600">
              {similarityPercent}% match
            </span>
          </div>
          <SheetTitle className="text-left">Document Preview</SheetTitle>
          <SheetDescription className="text-left">
            {result.encounterNumber ? `Encounter: ${result.encounterNumber}` : `Document ID: ${result.documentId.slice(0, 8)}...`}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Patient Info */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">Patient Information</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {result.patientName && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{result.patientName}</span>
                  {result.patientAge && (
                    <span className="text-muted-foreground">({result.patientAge}y)</span>
                  )}
                </div>
              )}
              {result.patientMrn && (
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <span>MRN: {result.patientMrn}</span>
                </div>
              )}
              {result.patientGender && (
                <div className="flex items-center gap-2 capitalize">
                  <span className="text-muted-foreground">Gender:</span>
                  <span>{result.patientGender}</span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Document Info */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">Document Details</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {result.authorName && (
                <div className="flex items-center gap-2">
                  <Stethoscope className="h-4 w-4 text-muted-foreground" />
                  <span>Dr. {result.authorName}</span>
                </div>
              )}
              {result.encounterType && (
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="capitalize">{result.encounterType.replace('_', ' ')}</span>
                </div>
              )}
              {result.facilityName && (
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span>{result.facilityName}</span>
                </div>
              )}
              {result.departmentName && (
                <div className="flex items-center gap-2 col-span-2">
                  <span className="text-muted-foreground">Dept:</span>
                  <span>{result.departmentName}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{new Date(result.documentDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Matched Content */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">Matched Content</h4>
            <ScrollArea className="h-[200px]">
              <div className="bg-muted/50 rounded-lg p-4 text-sm leading-relaxed">
                <div
                  dangerouslySetInnerHTML={{
                    __html: (result.highlightedText || result.chunkText)
                      .replace(/\*\*(.*?)\*\*/g, '<mark class="bg-yellow-200 dark:bg-yellow-800 px-0.5 rounded">$1</mark>')
                  }}
                />
              </div>
            </ScrollArea>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button onClick={handleViewFull} className="flex-1">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Full Document
            </Button>
            <Button variant="outline" onClick={handleViewPatient}>
              <User className="h-4 w-4 mr-2" />
              Patient Profile
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
