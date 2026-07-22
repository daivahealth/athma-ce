'use client';

import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading';
import { usePatient } from '@/modules/clinical/hooks/use-patients';
import { Sparkles, Compass, Lightbulb, NotebookText } from 'lucide-react';
import { CareContextEntryButton } from '@/modules/clinical/components/care-context/care-context-entry-button';
import { PatientContextRail } from '@/modules/clinical/components/care-context/patient-context-rail';
import { SectionLabel } from '@/modules/clinical/components/care-context/parts';
import { useCareNarrative } from '@/modules/clinical/hooks/use-care-narrative';
import type { CareNarrativeAvailable, CareNarrativeResult } from '@/modules/clinical/types/care-narrative';

function isNarrativeReady(r: CareNarrativeResult | undefined): r is CareNarrativeAvailable {
  return !!r && r.available;
}

interface PatientAiPlusPageProps {
  params: {
    locale: string;
    patientId: string;
  };
}

const formatDateTime = (dateString?: string | null) => {
  if (!dateString) return 'Unknown';
  try {
    return format(parseISO(dateString), 'MMM dd, yyyy • h:mm a');
  } catch {
    return 'Invalid date';
  }
};

export default function PatientAiPlusPage({ params }: PatientAiPlusPageProps) {
  const { data: patient, isLoading, error } = usePatient(params.patientId);

  // Live LLM-generated Care Narrative + Recommendations — same endpoint/cache as
  // Care Context's narrative card, so viewing that page first means this loads
  // from the Redis cache instead of spending tokens again.
  const { data: aiNarrative, isFetching: aiFetching } = useCareNarrative(params.patientId);
  const aiReady = isNarrativeReady(aiNarrative) ? aiNarrative : null;

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner size="lg" text="Generating AI insights..." />
      </div>
    );
  }

  if (error || !patient) {
    return (
      <Card className="border-destructive/40">
        <CardHeader>
          <CardTitle>Unable to load AI insights</CardTitle>
          <CardDescription>Please refresh or try again later.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-primary">
          <Sparkles className="h-5 w-5" />
          <h1 className="text-xl font-semibold">Patient AI+</h1>
          <Badge variant="secondary" className="text-primary">
            Beta · AI generated
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild size="sm" variant="outline">
            <Link href={`/${params.locale}/patients/${params.patientId}/360`}>
              <Compass className="mr-2 h-4 w-4" /> View Patient 360
            </Link>
          </Button>
          <CareContextEntryButton patientId={params.patientId} locale={params.locale as string} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr_280px] lg:items-start">
        <Card>
          <CardContent className="pt-4">
            <PatientContextRail patient={patient} />
          </CardContent>
        </Card>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <NotebookText className="h-5 w-5 text-primary" />
                AI Care Narrative
              </CardTitle>
              <CardDescription>
                Live, LLM-generated clinical synthesis — the same engine behind Care Context.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {aiFetching && !aiNarrative ? (
                <LoadingSpinner size="sm" text="Generating care narrative..." />
              ) : aiReady ? (
                <div className="space-y-3 text-sm">
                  {aiReady.snapshot && (
                    <p className="font-semibold leading-snug text-foreground">{aiReady.snapshot}</p>
                  )}
                  <div className="space-y-3">
                    {aiReady.sections.map((section) => (
                      <div key={section.title}>
                        <SectionLabel>{section.title}</SectionLabel>
                        <ul className="mt-1.5 list-disc space-y-1 pl-4 text-muted-foreground">
                          {section.bullets.map((bullet, i) => (
                            <li key={i} className="leading-snug">{bullet}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <p className="pt-1 text-xs text-muted-foreground/70">
                    AI generated · {aiReady.model} · {formatDateTime(aiReady.generatedAt)}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">AI narrative unavailable for this patient right now.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Lightbulb className="h-4 w-4 text-primary" />
                AI Recommendations
              </CardTitle>
              <CardDescription>Considerations for the clinician to evaluate — not orders.</CardDescription>
            </CardHeader>
            <CardContent>
              {aiFetching && !aiNarrative ? (
                <LoadingSpinner size="sm" text="Generating recommendations..." />
              ) : aiReady && (aiReady.recommendations?.length ?? 0) > 0 ? (
                <div className="space-y-3">
                  <ul className="space-y-2 text-sm">
                    {aiReady.recommendations.map((item, index) => (
                      <li key={`${item}-${index}`} className="flex items-start gap-2">
                        <Badge variant="secondary" className="mt-0.5 flex-shrink-0">
                          {index + 1}
                        </Badge>
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="pt-1 text-xs text-muted-foreground/70">
                    AI generated · {aiReady.model} · {formatDateTime(aiReady.generatedAt)}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  AI recommendations unavailable for this patient right now.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
