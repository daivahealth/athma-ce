'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { format, parseISO, isToday } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading';
import { usePatient } from '@/modules/clinical/hooks/use-patients';
import { Sparkles, Lightbulb, NotebookText, Stethoscope, ArrowRight, ArrowLeft, Grid3x3 } from 'lucide-react';
import { PatientContextRail } from '@/modules/clinical/components/care-context/patient-context-rail';
import { SectionLabel } from '@/modules/clinical/components/care-context/parts';
import { useCareNarrative } from '@/modules/clinical/hooks/use-care-narrative';
import { useActivePatientEncounters } from '@/modules/clinical/hooks/use-encounters';
import { EncounterStatus } from '@/modules/clinical/types/encounter';
import { storeAiChartPrefill } from '@/modules/clinical/utils/ai-chart-prefill';
import type { CareNarrativeAvailable, CareNarrativeResult } from '@/modules/clinical/types/care-narrative';

function isNarrativeReady(r: CareNarrativeResult | undefined): r is CareNarrativeAvailable {
  return !!r && r.available;
}

// Statuses where a clinician would plausibly still be charting this encounter today.
const CHARTABLE_STATUSES: string[] = [
  EncounterStatus.ARRIVED,
  EncounterStatus.TRIAGED,
  EncounterStatus.IN_PROGRESS,
  EncounterStatus.ON_LEAVE,
];

function buildHistoryText(sections: CareNarrativeAvailable['sections']): string {
  return sections
    .map((section) => `${section.title}:\n${section.bullets.map((b) => `- ${b}`).join('\n')}`)
    .join('\n\n');
}

function buildRecommendationsNote(recommendations: string[]): string {
  return [
    'AI-generated recommendations — review before charting:',
    ...recommendations.map((r) => `- ${r}`),
  ].join('\n');
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
  const router = useRouter();
  const { data: patient, isLoading, error } = usePatient(params.patientId);

  // Live LLM-generated Care Narrative + Recommendations — same endpoint/cache as
  // Care Context's narrative card, so viewing that page first means this loads
  // from the Redis cache instead of spending tokens again.
  const { data: aiNarrative, isFetching: aiFetching } = useCareNarrative(params.patientId);
  const aiReady = isNarrativeReady(aiNarrative) ? aiNarrative : null;

  // If the patient has an encounter open today, offer to hand the AI narrative
  // off to that encounter's chart — the clinician still has to opt in on the
  // charting page before anything is inserted.
  const { data: activeEncounters } = useActivePatientEncounters(params.patientId);
  const todaysEncounter = useMemo(
    () =>
      (activeEncounters ?? []).find(
        (e) => CHARTABLE_STATUSES.includes(e.status) && isToday(parseISO(e.startTime))
      ),
    [activeEncounters]
  );

  const handleCopyToChart = () => {
    if (!aiReady || !todaysEncounter) return;
    storeAiChartPrefill(todaysEncounter.id, {
      chiefHpi: aiReady.snapshot,
      history: buildHistoryText(aiReady.sections),
      notes: buildRecommendationsNote(aiReady.recommendations),
      generatedAt: aiReady.generatedAt,
    });
    router.push(`/${params.locale}/encounters/${todaysEncounter.id}/charting`);
  };

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
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.back()} aria-label="Back">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2 text-primary">
            <Sparkles className="h-5 w-5" />
            <h1 className="text-xl font-semibold">Patient AI+</h1>
            <Badge variant="secondary" className="text-primary">
              Beta · AI generated
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild size="sm" variant="outline">
            <Link href={`/${params.locale}/patients/${params.patientId}/care-context`}>
              <Grid3x3 className="mr-2 h-4 w-4" /> Care Context
            </Link>
          </Button>
        </div>
      </div>

      {todaysEncounter && aiReady && (
        <Card className="border-primary/50 bg-primary/10">
          <CardContent className="flex flex-wrap items-center justify-between gap-4 py-4">
            <div className="flex items-center gap-3">
              <Stethoscope className="h-6 w-6 flex-shrink-0 text-primary" />
              <div>
                <p className="font-semibold text-foreground">
                  {patient.firstName} has an open encounter today
                  {todaysEncounter.encounterType ? ` (${todaysEncounter.encounterType})` : ''} — started{' '}
                  {formatDateTime(todaysEncounter.startTime)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Copy the AI summary and recommendations into that encounter&apos;s chart as a
                  starting draft. Nothing is saved until you review and insert it there.
                </p>
              </div>
            </div>
            <Button onClick={handleCopyToChart} className="flex-shrink-0">
              Copy AI Summary to Chart
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

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
          <Card className="border-violet-800/50 bg-gradient-to-b from-violet-950 to-indigo-950 text-violet-100 shadow-lg shadow-violet-950/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base text-violet-100">
                <Lightbulb className="h-4 w-4 text-violet-300" />
                AI Recommendations
              </CardTitle>
              <CardDescription className="text-violet-300/70">
                Considerations for the clinician to evaluate — not orders.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {aiFetching && !aiNarrative ? (
                <LoadingSpinner size="sm" text="Generating recommendations..." />
              ) : aiReady && (aiReady.recommendations?.length ?? 0) > 0 ? (
                <div className="space-y-3">
                  <ul className="space-y-2 text-sm">
                    {aiReady.recommendations.map((item, index) => (
                      <li key={`${item}-${index}`} className="flex items-start gap-2">
                        <Badge className="mt-0.5 flex-shrink-0 border-transparent bg-violet-500 text-white hover:bg-violet-500">
                          {index + 1}
                        </Badge>
                        <span className="text-violet-100/90">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="pt-1 text-xs text-violet-300/60">
                    AI generated · {aiReady.model} · {formatDateTime(aiReady.generatedAt)}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-violet-300/70">
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
