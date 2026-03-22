'use client';

import { useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  Sparkles,
  FileText,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  SkipForward,
  Clock,
} from 'lucide-react';
import {
  useCatalogPopulationStart,
  useCatalogPopulationStatus,
  useCatalogPopulationCancel,
  useCatalogPopulationCountries,
} from '@/modules/clinical/hooks/use-catalog-population';
import type { CatalogType, CatalogProgressDetail } from '@/modules/clinical/types/catalog-population';
import { CATALOG_TYPE_LABELS, ALL_CATALOG_TYPES } from '@/modules/clinical/types/catalog-population';

/** Well-known countries available even without template data (AI will generate) */
const KNOWN_COUNTRIES = [
  { iso: 'AE', name: 'United Arab Emirates' },
  { iso: 'IN', name: 'India' },
  { iso: 'GB', name: 'United Kingdom' },
  { iso: 'US', name: 'United States' },
  { iso: 'SA', name: 'Saudi Arabia' },
  { iso: 'SG', name: 'Singapore' },
  { iso: 'QA', name: 'Qatar' },
  { iso: 'KW', name: 'Kuwait' },
  { iso: 'BH', name: 'Bahrain' },
  { iso: 'OM', name: 'Oman' },
];

type WizardStep = 'country' | 'catalogs' | 'confirm' | 'progress';

export default function CatalogSetupPage() {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;

  // Wizard state
  const [step, setStep] = useState<WizardStep>('country');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCatalogs, setSelectedCatalogs] = useState<Set<CatalogType>>(new Set(ALL_CATALOG_TYPES));
  const [jobId, setJobId] = useState<string | null>(null);

  // API hooks
  const { data: countries } = useCatalogPopulationCountries();
  const startMutation = useCatalogPopulationStart();
  const cancelMutation = useCatalogPopulationCancel();
  const { data: jobStatus } = useCatalogPopulationStatus(jobId);

  const countryInfo = countries?.find((c) => c.countryIso === selectedCountry);
  const countryName = KNOWN_COUNTRIES.find((c) => c.iso === selectedCountry)?.name || selectedCountry;

  const toggleCatalog = useCallback((ct: CatalogType) => {
    setSelectedCatalogs((prev) => {
      const next = new Set(prev);
      if (next.has(ct)) next.delete(ct);
      else next.add(ct);
      return next;
    });
  }, []);

  const selectAll = useCallback(() => setSelectedCatalogs(new Set(ALL_CATALOG_TYPES)), []);
  const selectNone = useCallback(() => setSelectedCatalogs(new Set()), []);

  const handleStart = async () => {
    try {
      const result = await startMutation.mutateAsync({
        countryIso: selectedCountry,
        catalogTypes: Array.from(selectedCatalogs),
      });
      setJobId(result.jobId);
      setStep('progress');
    } catch (error) {
      // error handled by mutation state
    }
  };

  const handleCancel = () => {
    if (jobId) cancelMutation.mutate(jobId);
  };

  const progressPercent = jobStatus
    ? Math.round((jobStatus.completed / Math.max(jobStatus.total, 1)) * 100)
    : 0;

  const isJobFinished = jobStatus?.status === 'completed' || jobStatus?.status === 'failed' || jobStatus?.status === 'cancelled';

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/${locale}/catalogs`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Setup Catalogs</h1>
          <p className="text-sm text-muted-foreground">
            Auto-populate your clinical catalogs with country-specific data using curated templates and AI
          </p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 text-sm">
        {(['country', 'catalogs', 'confirm', 'progress'] as WizardStep[]).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            {i > 0 && <div className="h-px w-8 bg-border" />}
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium ${
                step === s
                  ? 'bg-primary text-primary-foreground'
                  : ['country', 'catalogs', 'confirm', 'progress'].indexOf(step) > i
                    ? 'bg-primary/20 text-primary'
                    : 'bg-muted text-muted-foreground'
              }`}
            >
              {['country', 'catalogs', 'confirm', 'progress'].indexOf(step) > i ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                i + 1
              )}
            </div>
            <span className={step === s ? 'font-medium' : 'text-muted-foreground'}>
              {s === 'country' ? 'Country' : s === 'catalogs' ? 'Catalogs' : s === 'confirm' ? 'Confirm' : 'Progress'}
            </span>
          </div>
        ))}
      </div>

      {/* Step 1: Country Selection */}
      {step === 'country' && (
        <Card>
          <CardHeader>
            <CardTitle>Select Country</CardTitle>
            <CardDescription>
              Choose the country for your healthcare facility. Catalog data will be tailored to your country's healthcare standards and regulations.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger>
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
              <SelectContent>
                {KNOWN_COUNTRIES.map((country) => {
                  const hasTemplates = countries?.some((c) => c.countryIso === country.iso);
                  return (
                    <SelectItem key={country.iso} value={country.iso}>
                      <span className="flex items-center gap-2">
                        {country.name}
                        {hasTemplates && (
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                            Curated
                          </Badge>
                        )}
                      </span>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>

            {selectedCountry && countryInfo && (
              <div className="rounded-lg border p-3 text-sm space-y-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-green-600" />
                  <span className="font-medium">Template data available:</span>
                  <span>{countryInfo.templateCatalogs.map((ct) => CATALOG_TYPE_LABELS[ct]).join(', ')}</span>
                </div>
                {countryInfo.aiGeneratedCatalogs.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">AI-generated:</span>
                    <span>{countryInfo.aiGeneratedCatalogs.map((ct) => CATALOG_TYPE_LABELS[ct]).join(', ')}</span>
                  </div>
                )}
              </div>
            )}

            {selectedCountry && !countryInfo && (
              <Alert>
                <Sparkles className="h-4 w-4" />
                <AlertTitle>AI-generated data</AlertTitle>
                <AlertDescription>
                  No curated templates are available for this country. All catalog data will be generated by AI using international standards and country-specific context. We recommend reviewing AI-generated data before clinical use.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end">
              <Button onClick={() => setStep('catalogs')} disabled={!selectedCountry}>
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Catalog Selection */}
      {step === 'catalogs' && (
        <Card>
          <CardHeader>
            <CardTitle>Select Catalogs</CardTitle>
            <CardDescription>
              Choose which catalogs to populate. Template-based catalogs use curated data; AI-generated catalogs use intelligent generation.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={selectAll}>
                Select All
              </Button>
              <Button variant="outline" size="sm" onClick={selectNone}>
                Clear
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {ALL_CATALOG_TYPES.map((ct) => {
                const isTemplate = countryInfo?.templateCatalogs.includes(ct);
                const selected = selectedCatalogs.has(ct);

                return (
                  <div
                    key={ct}
                    className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                      selected ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                    }`}
                    onClick={() => toggleCatalog(ct)}
                  >
                    <Checkbox checked={selected} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{CATALOG_TYPE_LABELS[ct]}</span>
                        {isTemplate ? (
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                            <FileText className="mr-1 h-2.5 w-2.5" />
                            Template
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-blue-600 border-blue-200">
                            <Sparkles className="mr-1 h-2.5 w-2.5" />
                            AI
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep('country')}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button onClick={() => setStep('confirm')} disabled={selectedCatalogs.size === 0}>
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Confirm */}
      {step === 'confirm' && (
        <Card>
          <CardHeader>
            <CardTitle>Review & Confirm</CardTitle>
            <CardDescription>
              Review your selections before starting the catalog population process.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Country</span>
                <span className="font-medium">{countryName} ({selectedCountry})</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Catalogs to populate</span>
                <span className="font-medium">{selectedCatalogs.size} of {ALL_CATALOG_TYPES.length}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex flex-wrap gap-1.5">
                  {Array.from(selectedCatalogs).map((ct) => (
                    <Badge key={ct} variant="secondary" className="text-xs">
                      {CATALOG_TYPE_LABELS[ct]}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Review notice</AlertTitle>
              <AlertDescription>
                AI-generated catalog items will be active immediately but flagged for review. We recommend that a clinical administrator reviews AI-generated content before using it in patient encounters.
              </AlertDescription>
            </Alert>

            {startMutation.isError && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Failed to start</AlertTitle>
                <AlertDescription>
                  {(startMutation.error as Error)?.message || 'An unexpected error occurred'}
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep('catalogs')}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button onClick={handleStart} disabled={startMutation.isPending}>
                {startMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Starting...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Start Population
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Progress */}
      {step === 'progress' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {jobStatus?.status === 'completed' ? (
                <><CheckCircle2 className="h-5 w-5 text-green-600" /> Population Complete</>
              ) : jobStatus?.status === 'failed' ? (
                <><XCircle className="h-5 w-5 text-destructive" /> Population Failed</>
              ) : jobStatus?.status === 'cancelled' ? (
                <><XCircle className="h-5 w-5 text-muted-foreground" /> Population Cancelled</>
              ) : (
                <><Loader2 className="h-5 w-5 animate-spin" /> Populating Catalogs...</>
              )}
            </CardTitle>
            <CardDescription>
              {jobStatus?.status === 'completed'
                ? `Successfully inserted ${jobStatus.totalInserted} items across ${jobStatus.completed} catalogs`
                : jobStatus?.status === 'running'
                  ? `Processing ${jobStatus.currentCatalog ? CATALOG_TYPE_LABELS[jobStatus.currentCatalog as CatalogType] || jobStatus.currentCatalog : '...'}`
                  : jobStatus?.errorMessage || 'Preparing...'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={progressPercent} className="h-2" />
            <p className="text-sm text-muted-foreground text-center">
              {jobStatus?.completed ?? 0} of {jobStatus?.total ?? 0} catalogs ({progressPercent}%)
            </p>

            {/* Per-catalog details */}
            <div className="space-y-2">
              {jobStatus?.details.map((detail: CatalogProgressDetail) => (
                <div
                  key={detail.catalogType}
                  className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <StatusIcon status={detail.status} />
                    <span>{CATALOG_TYPE_LABELS[detail.catalogType]}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {detail.itemsInserted > 0 && (
                      <span className="text-muted-foreground">{detail.itemsInserted} items</span>
                    )}
                    <Badge
                      variant={detail.dataSource === 'template' ? 'secondary' : 'outline'}
                      className="text-[10px] px-1.5 py-0"
                    >
                      {detail.dataSource === 'template' ? 'Template' : detail.dataSource === 'ai-enriched' ? 'AI Enriched' : 'AI Generated'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between">
              {!isJobFinished ? (
                <Button variant="destructive" size="sm" onClick={handleCancel} disabled={cancelMutation.isPending}>
                  Cancel
                </Button>
              ) : (
                <div />
              )}
              <div className="flex gap-2">
                {isJobFinished && (
                  <>
                    <Button variant="outline" onClick={() => { setStep('country'); setJobId(null); }}>
                      Start New
                    </Button>
                    <Link href={`/${locale}/catalogs`}>
                      <Button>
                        View Catalogs <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

/** Render a status icon for a catalog progress detail */
function StatusIcon({ status }: { status: string }) {
  switch (status) {
    case 'completed':
      return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    case 'failed':
      return <XCircle className="h-4 w-4 text-destructive" />;
    case 'in_progress':
      return <Loader2 className="h-4 w-4 animate-spin text-primary" />;
    case 'skipped':
      return <SkipForward className="h-4 w-4 text-muted-foreground" />;
    default:
      return <Clock className="h-4 w-4 text-muted-foreground" />;
  }
}
