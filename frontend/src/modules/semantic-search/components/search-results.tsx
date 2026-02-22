'use client';

import { FileText, User, Building2, Calendar, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import type { SearchResult, SearchResponse, DocumentType } from '../types/search';
import { DOCUMENT_TYPE_LABELS } from '../types/search';
import { cn } from '@/lib/utils';

interface SearchResultsProps {
  response: SearchResponse | null;
  isLoading?: boolean;
  onSelectDocument?: (result: SearchResult) => void;
  onFindSimilar?: (result: SearchResult) => void;
  className?: string;
}

function getDocumentTypeColor(type: DocumentType): string {
  const colors: Record<DocumentType, string> = {
    encounter_note: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    discharge_summary: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    clinical_note: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
    progress_note: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
    consultation_note: 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300',
    procedure_note: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300',
    operative_note: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    radiology_report: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
    lab_report: 'bg-lime-100 text-lime-700 dark:bg-lime-900 dark:text-lime-300',
    pathology_report: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300',
  };
  return colors[type] || 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
}

function getSimilarityColor(similarity: number): string {
  if (similarity >= 0.9) return 'text-green-600';
  if (similarity >= 0.8) return 'text-blue-600';
  if (similarity >= 0.7) return 'text-amber-600';
  return 'text-gray-600';
}

function ResultCard({
  result,
  onSelect,
  onFindSimilar,
}: {
  result: SearchResult;
  onSelect?: (result: SearchResult) => void;
  onFindSimilar?: (result: SearchResult) => void;
}) {
  const similarityPercent = Math.round(result.similarity * 100);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={cn('text-xs', getDocumentTypeColor(result.documentType))}>
                {DOCUMENT_TYPE_LABELS[result.documentType] || result.documentType}
              </Badge>
              <span className={cn('text-sm font-medium', getSimilarityColor(result.similarity))}>
                {similarityPercent}% match
              </span>
            </div>
            <CardTitle className="text-sm font-medium mt-2 flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="truncate">
                Document ID: {result.documentId.slice(0, 8)}...
              </span>
            </CardTitle>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onSelect?.(result)}
              title="View document"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {/* Similarity bar */}
        <div className="mb-3">
          <Progress value={similarityPercent} className="h-1" />
        </div>

        {/* Highlighted chunk text */}
        <div className="bg-muted/50 rounded-md p-3 text-sm">
          <p
            className="line-clamp-4"
            dangerouslySetInnerHTML={{
              __html: result.highlightedText || result.chunkText,
            }}
          />
        </div>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-muted-foreground">
          {result.patientName && (
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span>{result.patientName}</span>
            </div>
          )}
          {result.facilityName && (
            <div className="flex items-center gap-1">
              <Building2 className="h-3 w-3" />
              <span>{result.facilityName}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{new Date(result.documentDate).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Actions */}
        {onFindSimilar && (
          <div className="mt-3 pt-3 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onFindSimilar(result)}
              className="text-xs"
            >
              Find similar documents
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function SearchResults({
  response,
  isLoading = false,
  onSelectDocument,
  onFindSimilar,
  className,
}: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className={cn('space-y-4', className)}>
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-48 mt-2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
              <div className="flex gap-4 mt-3">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!response) {
    return (
      <div className={cn('flex flex-col items-center justify-center h-64 text-muted-foreground', className)}>
        <FileText className="h-12 w-12 mb-4" />
        <p className="text-lg font-medium">Search clinical documents</p>
        <p className="text-sm">Enter a search query to find relevant documents</p>
      </div>
    );
  }

  if (response.results.length === 0) {
    return (
      <div className={cn('flex flex-col items-center justify-center h-64 text-muted-foreground', className)}>
        <FileText className="h-12 w-12 mb-4" />
        <p className="text-lg font-medium">No results found</p>
        <p className="text-sm">Try adjusting your search query or filters</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Results summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Found {response.totalCount} result{response.totalCount !== 1 ? 's' : ''}
        </span>
        <span>
          Search took {response.queryEmbeddingTimeMs + response.searchTimeMs}ms
        </span>
      </div>

      {/* Results list */}
      <ScrollArea className="h-[calc(100vh-400px)]">
        <div className="space-y-4 pr-4">
          {response.results.map((result, idx) => (
            <ResultCard
              key={`${result.documentId}-${result.chunkIndex}-${idx}`}
              result={result}
              onSelect={onSelectDocument}
              onFindSimilar={onFindSimilar}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
