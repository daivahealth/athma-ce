'use client';

import { useState, useCallback, useMemo } from 'react';
import {
  Sparkles,
  RefreshCw,
  ChevronRight,
  ChevronLeft,
  Plus,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useToast } from '@/components/ui/use-toast';
import {
  useClinicalCodingSuggestions,
  useAiCodingEnabled,
} from '@/modules/clinical/hooks/use-clinical-coding';
import { useCreateDiagnosis, useDiagnosesByEncounter } from '@/modules/clinical/hooks/use-charting';
import { useEncounter } from '@/modules/clinical/hooks/use-encounters';
import { DiagnosisType } from '@/modules/clinical/types/charting';
import type { ClinicalCodingSuggestion } from '@/modules/clinical/types/clinical-coding';

interface AiCodingSuggestionsPanelProps {
  clinicalText: string;
  blockTypes: string[];
  encounterId: string;
  patientId: string;
}

const COLLAPSE_KEY = 'ai-coding-panel-collapsed';

function ConfidenceBar({ confidence }: { confidence: number }) {
  const pct = Math.round(confidence * 100);
  const color =
    pct >= 80 ? 'bg-green-500' : pct >= 50 ? 'bg-yellow-500' : 'bg-red-500';
  return (
    <div className="flex items-center gap-1.5">
      <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[10px] text-muted-foreground">{pct}%</span>
    </div>
  );
}

function SuggestionCard({
  suggestion,
  onAdd,
  isAdding,
}: {
  suggestion: ClinicalCodingSuggestion;
  onAdd: (s: ClinicalCodingSuggestion) => void;
  isAdding: boolean;
}) {
  const isIcd = suggestion.codeSystem === 'ICD-10';
  const canAdd = isIcd && suggestion.catalogMatch;

  return (
    <div className="border rounded-lg p-3 space-y-2 bg-card hover:bg-accent/5 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <Badge
            variant="outline"
            className={`font-mono text-xs ${
              isIcd
                ? 'border-blue-300 text-blue-700 bg-blue-50'
                : 'border-purple-300 text-purple-700 bg-purple-50'
            }`}
          >
            {suggestion.code}
          </Badge>
          <Badge variant="secondary" className="text-[10px]">
            {suggestion.codeSystem}
          </Badge>
          {!suggestion.catalogMatch && isIcd && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Badge variant="destructive" className="text-[10px]">
                    Not in catalog
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>This code is not in your ICD-10 catalog and cannot be added directly.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        {canAdd && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 shrink-0"
            onClick={() => onAdd(suggestion)}
            disabled={isAdding}
          >
            {isAdding ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Plus className="h-3.5 w-3.5" />
            )}
          </Button>
        )}
      </div>
      <p className="text-xs leading-snug">{suggestion.shortDescription}</p>
      <p className="text-[11px] text-muted-foreground leading-snug">{suggestion.rationale}</p>
      <ConfidenceBar confidence={suggestion.confidence} />
    </div>
  );
}

export function AiCodingSuggestionsPanel({
  clinicalText,
  blockTypes,
  encounterId,
  patientId,
}: AiCodingSuggestionsPanelProps) {
  const isEnabled = useAiCodingEnabled();
  const toast = useToast();
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(COLLAPSE_KEY) === 'true';
  });
  const [addingCode, setAddingCode] = useState<string | null>(null);

  const { data: encounter } = useEncounter(encounterId);
  const { data: diagnoses = [] } = useDiagnosesByEncounter(encounterId);
  const { mutateAsync: createDiagnosis } = useCreateDiagnosis();

  const existingCodes = useMemo(
    () => diagnoses.map((d) => d.icdCode),
    [diagnoses],
  );

  const { data, isLoading, isFetching, error, refetch } = useClinicalCodingSuggestions({
    clinicalText,
    blockTypes,
    existingCodes,
  });

  const toggleCollapse = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(COLLAPSE_KEY, String(next));
      return next;
    });
  }, []);

  const handleAdd = useCallback(
    async (suggestion: ClinicalCodingSuggestion) => {
      if (!encounter) return;
      setAddingCode(suggestion.code);
      try {
        await createDiagnosis({
          encounterId,
          patientId,
          icdCode: suggestion.code,
          diagnosisName: suggestion.shortDescription || suggestion.description,
          diagnosisType: DiagnosisType.PRIMARY,
          diagnosisRank: diagnoses.length + 1,
          diagnosedBy: encounter.primaryStaffId,
        });
        toast({
          title: 'Diagnosis added',
          description: `${suggestion.code} added to encounter.`,
        });
      } catch (err) {
        toast({
          variant: 'destructive',
          title: 'Unable to add diagnosis',
          description: err instanceof Error ? err.message : 'Please try again.',
        });
      } finally {
        setAddingCode(null);
      }
    },
    [encounter, encounterId, patientId, diagnoses.length, createDiagnosis, toast],
  );

  if (!isEnabled) return null;

  // Collapsed toggle button
  if (collapsed) {
    return (
      <div className="flex flex-col items-center pt-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleCollapse}
          className="h-8 w-8 p-0"
          title="Show AI Coding Suggestions"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="mt-2 [writing-mode:vertical-lr] text-xs text-muted-foreground tracking-wider rotate-180">
          AI Coding
        </div>
      </div>
    );
  }

  const suggestions = data?.suggestions ?? [];
  const hasText = clinicalText.length >= 20;

  return (
    <div className="w-80 border-l flex flex-col bg-background shrink-0">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2.5 border-b">
        <Sparkles className="h-4 w-4 text-amber-500" />
        <span className="text-sm font-medium flex-1">AI Coding Suggestions</span>
        {isFetching && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />}
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={() => refetch()}
          disabled={isFetching || !hasText}
          title="Refresh suggestions"
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={toggleCollapse}
          title="Collapse panel"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {!hasText && (
          <div className="text-center py-8 text-xs text-muted-foreground">
            <Sparkles className="h-8 w-8 mx-auto mb-2 text-muted-foreground/30" />
            <p>Start typing clinical notes to get AI-powered coding suggestions.</p>
          </div>
        )}

        {hasText && isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-lg p-3 space-y-2 animate-pulse">
                <div className="flex gap-2">
                  <div className="h-5 w-14 bg-muted rounded" />
                  <div className="h-5 w-10 bg-muted rounded" />
                </div>
                <div className="h-3 w-full bg-muted rounded" />
                <div className="h-3 w-3/4 bg-muted rounded" />
              </div>
            ))}
          </div>
        )}

        {hasText && error && !isLoading && (
          <div className="text-center py-8 text-xs text-muted-foreground">
            <AlertCircle className="h-8 w-8 mx-auto mb-2 text-destructive/50" />
            <p className="mb-2">Failed to fetch suggestions.</p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        )}

        {hasText && !isLoading && !error && suggestions.length === 0 && (
          <div className="text-center py-8 text-xs text-muted-foreground">
            <p>No coding suggestions for the current text.</p>
          </div>
        )}

        {suggestions.map((suggestion) => (
          <SuggestionCard
            key={`${suggestion.codeSystem}-${suggestion.code}`}
            suggestion={suggestion}
            onAdd={handleAdd}
            isAdding={addingCode === suggestion.code}
          />
        ))}

        {data?.fromCache && suggestions.length > 0 && (
          <p className="text-[10px] text-muted-foreground text-center pt-1">
            Cached result ({data.processingTimeMs}ms)
          </p>
        )}
      </div>
    </div>
  );
}
