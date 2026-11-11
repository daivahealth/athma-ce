'use client';

import { useRouter, useParams } from 'next/navigation';
import { LayoutTemplate, FileText } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading';
import { useToast } from '@/components/ui/use-toast';
import {
  useFormMasters,
  useFormResponsesByEncounter,
  useCreateFormResponse,
} from '@/modules/clinical/hooks/use-form-master';
import { FormMasterStatus, FormResponseStatus } from '@/modules/clinical/types/form-master';

interface EncounterFormsSectionProps {
  encounterId: string;
  patientId: string;
}

const STATUS_VARIANT: Record<FormResponseStatus, 'default' | 'secondary' | 'outline'> = {
  [FormResponseStatus.DRAFT]: 'secondary',
  [FormResponseStatus.FINAL]: 'default',
  [FormResponseStatus.AMENDED]: 'outline',
};

/**
 * Forms launcher for the Clinical Charting page: a compact "Forms" icon button
 * (with a count of responses already started) that opens a side drawer listing
 * responses for this encounter and active master forms available to fill.
 */
export function EncounterFormsSection({ encounterId, patientId }: EncounterFormsSectionProps) {
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) ?? 'en';
  const toast = useToast();

  const { data: formMasters, isLoading: mastersLoading } = useFormMasters(FormMasterStatus.ACTIVE);
  const { data: responses, isLoading: responsesLoading } = useFormResponsesByEncounter(encounterId);
  const createFormResponse = useCreateFormResponse();

  const respondedMasterIds = new Set((responses ?? []).map((r) => r.formMasterId));
  const availableMasters = (formMasters ?? []).filter((fm) => !respondedMasterIds.has(fm.id));

  const handleFill = async (formMasterId: string) => {
    try {
      const response = await createFormResponse.mutateAsync({
        formMasterId,
        patientId,
        encounterId,
      });
      router.push(`/${locale}/encounters/${encounterId}/forms/${response.id}`);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Unable to start form',
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  const isLoading = mastersLoading || responsesLoading;

  const responseCount = (responses ?? []).length;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2" aria-label="Open encounter forms">
          <LayoutTemplate className="h-4 w-4 text-primary" />
          Forms
          {responseCount > 0 && (
            <Badge variant="secondary" className="ml-0.5 h-5 min-w-5 justify-center px-1.5">
              {responseCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <LayoutTemplate className="h-5 w-5 text-primary" />
            Forms
          </SheetTitle>
          <SheetDescription>Structured forms for this encounter.</SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          {isLoading ? (
            <LoadingSpinner size="sm" text="Loading forms..." />
          ) : (
            <>
              {(responses ?? []).length > 0 && (
                <div className="space-y-2">
                  {responses!.map((response) => (
                    <div
                      key={response.id}
                      className="flex items-center justify-between rounded-lg border border-border/60 bg-card/40 p-3"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {response.formMaster?.name ?? response.formCode}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(response.updatedAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={STATUS_VARIANT[response.status]} className="capitalize">
                          {response.status.toLowerCase()}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            router.push(`/${locale}/encounters/${encounterId}/forms/${response.id}`)
                          }
                        >
                          {response.status === FormResponseStatus.DRAFT ? 'Continue' : 'View'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {availableMasters.length > 0 && (
                <div className="space-y-2">
                  {availableMasters.map((fm) => (
                    <div
                      key={fm.id}
                      className="flex items-center justify-between rounded-lg border border-dashed border-border/60 p-3"
                    >
                      <div>
                        <p className="text-sm font-medium text-foreground">{fm.name}</p>
                        <p className="text-xs text-muted-foreground">v{fm.formVersion}</p>
                      </div>
                      <Button
                        size="sm"
                        disabled={createFormResponse.isPending}
                        onClick={() => handleFill(fm.id)}
                      >
                        Fill
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {(responses ?? []).length === 0 && availableMasters.length === 0 && (
                <p className="text-sm text-muted-foreground">No forms available.</p>
              )}
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
