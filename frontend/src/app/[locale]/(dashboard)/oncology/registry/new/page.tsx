'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ChevronsUpDown, Check, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { PatientSearchSelect } from '@/components/patient-search-select';
import {
  useCreateCancerDiagnosis,
  useCancerTypes,
  useSiteMappings,
  usePrimarySites,
  useHistologies,
} from '@/plugins/oncology/hooks/use-oncology';
import type {
  OncologyCancerType,
  OncologyCancerTypeSiteMapping,
  OncologyHistology,
  OncologyPrimarySite,
} from '@/plugins/oncology/types';
import type { Patient } from '@/modules/clinical/types/patient';

export default function NewDiagnosisPage({ params }: { params: { locale: string } }) {
  const router = useRouter();
  const back = () => router.push(`/${params.locale}/oncology/registry`);

  // Patient
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // Cancer Identity — catalog-driven
  const [cancerTypeOpen, setCancerTypeOpen] = useState(false);
  const [cancerTypeSearch, setCancerTypeSearch] = useState('');
  const [selectedCancerTypeId, setSelectedCancerTypeId] = useState('');
  const [cancerType, setCancerType] = useState('');
  const [selectedPrimarySiteId, setSelectedPrimarySiteId] = useState('');
  const [primarySite, setPrimarySite] = useState('');
  const [primarySiteCode, setPrimarySiteCode] = useState('');
  const [laterality, setLaterality] = useState('');
  const [selectedHistologyId, setSelectedHistologyId] = useState('');
  const [histologyMorphology, setHistologyMorphology] = useState('');
  const [morphologyCode, setMorphologyCode] = useState('');
  const [icdCode, setIcdCode] = useState('');

  // Clinical Assessment
  const [diagnosisDate, setDiagnosisDate] = useState('');
  const [clinicalStatus, setClinicalStatus] = useState('active');
  const [verificationStatus, setVerificationStatus] = useState('confirmed');
  const [grade, setGrade] = useState('');
  const [metastaticStatus, setMetastaticStatus] = useState('unknown');
  const [isRecurrence, setIsRecurrence] = useState(false);
  const [ecogAtDiagnosis, setEcogAtDiagnosis] = useState('');
  const [notes, setNotes] = useState('');

  // Catalog data
  const { data: cancerTypesData } = useCancerTypes({ active: 'true' });
  const { data: siteMappingsData } = useSiteMappings(
    selectedCancerTypeId ? { cancerTypeId: selectedCancerTypeId, active: 'true' } : undefined,
  );
  const { data: allPrimarySitesData } = usePrimarySites({ active: 'true' });
  const { data: histologiesData } = useHistologies({ active: 'true' });

  const cancerTypes: OncologyCancerType[] = cancerTypesData?.data ?? [];
  const siteMappings: OncologyCancerTypeSiteMapping[] = siteMappingsData?.data ?? [];
  const allPrimarySites: OncologyPrimarySite[] = allPrimarySitesData?.data ?? [];
  const histologies: OncologyHistology[] = histologiesData?.data ?? [];

  // Determine which primary site options to show
  const hasMappings = siteMappings.length > 0;
  const primarySiteOptions = hasMappings
    ? siteMappings.map((m) => ({
        id: m.primary_site_id,
        code: m.icdo_site_code ?? '',
        name: m.icdo_site_name ?? '',
        isDefault: m.is_default,
      }))
    : allPrimarySites.map((s) => ({
        id: s.id,
        code: s.icdo_site_code,
        name: s.icdo_site_name,
        isDefault: false,
      }));

  const createDiagnosis = useCreateCancerDiagnosis();

  const handleCancerTypeChange = (value: string) => {
    if (value === '__none') {
      setSelectedCancerTypeId('');
      setCancerType('');
    } else {
      const ct = cancerTypes.find((c) => c.id === value);
      setSelectedCancerTypeId(value);
      setCancerType(ct?.name ?? '');
    }
    // Reset downstream fields
    setSelectedPrimarySiteId('');
    setPrimarySite('');
    setPrimarySiteCode('');
  };

  const handlePrimarySiteChange = (value: string) => {
    if (value === '__none') {
      setSelectedPrimarySiteId('');
      setPrimarySite('');
      setPrimarySiteCode('');
      return;
    }
    const option = primarySiteOptions.find((o) => o.id === value);
    setSelectedPrimarySiteId(value);
    setPrimarySite(option?.name ?? '');
    setPrimarySiteCode(option?.code ?? '');
  };

  const handleHistologyChange = (value: string) => {
    if (value === '__none') {
      setSelectedHistologyId('');
      setHistologyMorphology('');
      setMorphologyCode('');
      return;
    }
    const h = histologies.find((x) => x.id === value);
    setSelectedHistologyId(value);
    setHistologyMorphology(h?.morphology_name ?? '');
    setMorphologyCode(h?.morphology_code ?? '');
  };

  const isValid = selectedPatient && cancerType && primarySite && diagnosisDate;

  const age = (selectedPatient as any)?.dateOfBirth
    ? Math.floor((Date.now() - new Date((selectedPatient as any).dateOfBirth).getTime()) / 31557600000)
    : null;

  const handleSubmit = async () => {
    if (!isValid) return;
    await createDiagnosis.mutateAsync({
      patientId: selectedPatient!.id,
      cancerType,
      primarySite,
      primarySiteCode: primarySiteCode || undefined,
      laterality: laterality || undefined,
      histologyMorphology: histologyMorphology || undefined,
      morphologyCode: morphologyCode || undefined,
      icdCode: icdCode || undefined,
      diagnosisDate,
      clinicalStatus,
      verificationStatus,
      grade: grade || undefined,
      metastaticStatus,
      isRecurrence,
      ecogAtDiagnosis: ecogAtDiagnosis ? parseInt(ecogAtDiagnosis, 10) : undefined,
      notes: notes || undefined,
    } as Record<string, unknown>);
    back();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={back}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Add to Oncology Registry</h1>
          <p className="text-muted-foreground text-sm">Register a new cancer diagnosis for a patient</p>
        </div>
      </div>

      <div className="space-y-6">

        {/* Step 1 — Patient (search card or blue banner) */}
        {!selectedPatient ? (
          <div className="relative overflow-hidden rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 dark:border-blue-900/40 dark:from-blue-950/40 dark:to-indigo-950/40 p-4">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blue-100/60 dark:bg-blue-900/20" />
            <div className="relative space-y-3">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-100 dark:bg-blue-900/50">
                  <Search className="h-3.5 w-3.5" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider">Select Patient</span>
              </div>
              <PatientSearchSelect
                required
                selectedPatient={selectedPatient}
                onSelect={(p) => setSelectedPatient(p as Patient)}
                onClear={() => setSelectedPatient(null)}
              />
            </div>
          </div>
        ) : (
          /* Blue patient banner (selected state) */
          <div className="relative overflow-hidden rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 dark:border-blue-900/40 dark:from-blue-950/40 dark:to-indigo-950/40 p-4">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blue-100/60 dark:bg-blue-900/20" />
            <div className="relative space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-100 dark:bg-blue-900/50">
                    <User className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider">Patient</span>
                </div>
                <Button
                  type="button" variant="outline" size="sm"
                  className="h-7 text-xs bg-white/70 dark:bg-white/10 border-blue-200 dark:border-blue-800"
                  onClick={() => setSelectedPatient(null)}
                >
                  Change
                </Button>
              </div>
              <p className="text-base font-bold text-foreground leading-tight">
                {(selectedPatient as any).fullName ||
                  `${(selectedPatient as any).firstName ?? ''} ${(selectedPatient as any).lastName ?? ''}`.trim() ||
                  (selectedPatient as any).displayName || '—'}
              </p>
              <div className="flex flex-wrap gap-2">
                {(selectedPatient as any).mrn && (
                  <span className="inline-flex items-center rounded-md bg-blue-100/70 dark:bg-blue-900/40 px-2 py-0.5 text-xs font-mono font-medium text-blue-700 dark:text-blue-300">
                    {(selectedPatient as any).mrn}
                  </span>
                )}
                {age !== null && (
                  <span className="inline-flex items-center rounded-md bg-white/70 dark:bg-white/10 border border-blue-100 dark:border-blue-900/50 px-2 py-0.5 text-xs text-muted-foreground">
                    {age} yrs
                  </span>
                )}
                {(selectedPatient as any).gender && (
                  <span className="inline-flex items-center rounded-md bg-white/70 dark:bg-white/10 border border-blue-100 dark:border-blue-900/50 px-2 py-0.5 text-xs capitalize text-muted-foreground">
                    {(selectedPatient as any).gender}
                  </span>
                )}
                {(selectedPatient as any).phoneNumber && (
                  <span className="inline-flex items-center rounded-md bg-white/70 dark:bg-white/10 border border-blue-100 dark:border-blue-900/50 px-2 py-0.5 text-xs text-muted-foreground">
                    {(selectedPatient as any).phoneNumber}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Cancer Identity + Clinical Assessment — gated on patient selection */}
        {selectedPatient && (<>
        <Card>
          <CardHeader><CardTitle>Cancer Identity</CardTitle></CardHeader>
          <CardContent className="space-y-4">

            {/* Cancer Type — searchable combobox */}
            <div className="space-y-2">
              <Label>Cancer Type *</Label>
              <Popover open={cancerTypeOpen} onOpenChange={(o) => { setCancerTypeOpen(o); if (o) setCancerTypeSearch(''); }}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={cancerTypeOpen}
                    className="w-full justify-between font-normal"
                  >
                    <span className={cn('truncate', !cancerType && 'text-muted-foreground')}>
                      {cancerType || 'Select cancer type...'}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-[--radix-popover-trigger-width] p-0">
                  {/* Search input */}
                  <div className="flex items-center border-b px-3 py-2 gap-2">
                    <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <input
                      autoFocus
                      className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                      placeholder="Search cancer type..."
                      value={cancerTypeSearch}
                      onChange={(e) => setCancerTypeSearch(e.target.value)}
                    />
                  </div>
                  {/* Filtered list */}
                  <div className="max-h-64 overflow-y-auto py-1">
                    {cancerTypes
                      .filter((ct) =>
                        !cancerTypeSearch ||
                        ct.name.toLowerCase().includes(cancerTypeSearch.toLowerCase()) ||
                        (ct.category ?? '').toLowerCase().includes(cancerTypeSearch.toLowerCase()),
                      )
                      .map((ct) => (
                        <button
                          key={ct.id}
                          type="button"
                          className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted/50 text-left"
                          onClick={() => {
                            handleCancerTypeChange(ct.id);
                            setCancerTypeOpen(false);
                          }}
                        >
                          <Check className={cn('h-4 w-4 shrink-0', selectedCancerTypeId === ct.id ? 'opacity-100' : 'opacity-0')} />
                          <span className="flex-1">{ct.name}</span>
                          {ct.category && (
                            <span className="text-xs text-muted-foreground">{ct.category}</span>
                          )}
                        </button>
                      ))}
                    {cancerTypes.filter((ct) =>
                      !cancerTypeSearch ||
                      ct.name.toLowerCase().includes(cancerTypeSearch.toLowerCase()) ||
                      (ct.category ?? '').toLowerCase().includes(cancerTypeSearch.toLowerCase()),
                    ).length === 0 && (
                      <p className="px-3 py-4 text-center text-sm text-muted-foreground">No cancer type found.</p>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Primary Site — filtered by cancer type via site mappings */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>
                  Primary Site *
                  {hasMappings && (
                    <span className="ml-2 text-xs text-muted-foreground font-normal">
                      (filtered for selected cancer type)
                    </span>
                  )}
                </Label>
                <Select
                  value={selectedPrimarySiteId || '__none'}
                  onValueChange={handlePrimarySiteChange}
                  disabled={!selectedCancerTypeId && primarySiteOptions.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select primary site..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-72 overflow-y-auto">
                    <SelectItem value="__none">— Select primary site —</SelectItem>
                    {primarySiteOptions.map((o) => (
                      <SelectItem key={o.id} value={o.id}>
                        <span className="font-mono text-xs text-muted-foreground mr-2">{o.code}</span>
                        {o.name}
                        {o.isDefault && <span className="ml-1 text-xs text-emerald-600">(default)</span>}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Site Code (ICD-O-3)</Label>
                <Input
                  placeholder="Auto-filled from site selection"
                  value={primarySiteCode}
                  onChange={(e) => setPrimarySiteCode(e.target.value)}
                  className={primarySiteCode ? 'bg-muted/30' : ''}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Laterality</Label>
                <Select value={laterality || '__none'} onValueChange={(v) => setLaterality(v === '__none' ? '' : v)}>
                  <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none">— Not applicable —</SelectItem>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                    <SelectItem value="bilateral">Bilateral</SelectItem>
                    <SelectItem value="not_applicable">Not Applicable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>ICD-10 Code</Label>
                <Input placeholder="e.g. C50.911" value={icdCode} onChange={(e) => setIcdCode(e.target.value)} />
              </div>
            </div>

            {/* Histology — from master */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Histology / Morphology</Label>
                <Select
                  value={selectedHistologyId || '__none'}
                  onValueChange={handleHistologyChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select histology..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-72 overflow-y-auto">
                    <SelectItem value="__none">— Select histology —</SelectItem>
                    {histologies.map((h) => (
                      <SelectItem key={h.id} value={h.id}>
                        {h.morphology_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Morphology Code (ICD-O-3)</Label>
                <Input
                  placeholder="Auto-filled from histology selection"
                  value={morphologyCode}
                  onChange={(e) => setMorphologyCode(e.target.value)}
                  className={morphologyCode ? 'bg-muted/30' : ''}
                />
              </div>
            </div>

          </CardContent>
        </Card>

        {/* Clinical Assessment */}
        <Card>
          <CardHeader><CardTitle>Clinical Assessment</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Diagnosis Date *</Label>
                <Input type="date" value={diagnosisDate} onChange={(e) => setDiagnosisDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Grade</Label>
                <Select value={grade || '__none'} onValueChange={(v) => setGrade(v === '__none' ? '' : v)}>
                  <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none">— Not assessed —</SelectItem>
                    <SelectItem value="G1">G1 - Well differentiated</SelectItem>
                    <SelectItem value="G2">G2 - Moderately differentiated</SelectItem>
                    <SelectItem value="G3">G3 - Poorly differentiated</SelectItem>
                    <SelectItem value="G4">G4 - Undifferentiated</SelectItem>
                    <SelectItem value="GX">GX - Cannot be assessed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Metastatic Status</Label>
                <Select value={metastaticStatus} onValueChange={setMetastaticStatus}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="localized">Localized</SelectItem>
                    <SelectItem value="regional">Regional</SelectItem>
                    <SelectItem value="distant">Distant (Metastatic)</SelectItem>
                    <SelectItem value="unknown">Unknown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>ECOG Performance Status</Label>
                <Select value={ecogAtDiagnosis || '__none'} onValueChange={(v) => setEcogAtDiagnosis(v === '__none' ? '' : v)}>
                  <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none">— Not recorded —</SelectItem>
                    <SelectItem value="0">0 - Fully active</SelectItem>
                    <SelectItem value="1">1 - Restricted strenuous activity</SelectItem>
                    <SelectItem value="2">2 - Ambulatory, capable of self-care</SelectItem>
                    <SelectItem value="3">3 - Limited self-care</SelectItem>
                    <SelectItem value="4">4 - Completely disabled</SelectItem>
                    <SelectItem value="5">5 - Dead</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Clinical Status</Label>
                <Select value={clinicalStatus} onValueChange={setClinicalStatus}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="remission">Remission</SelectItem>
                    <SelectItem value="recurrence">Recurrence</SelectItem>
                    <SelectItem value="relapsed">Relapsed</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Verification Status</Label>
                <Select value={verificationStatus} onValueChange={setVerificationStatus}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="provisional">Provisional</SelectItem>
                    <SelectItem value="differential">Differential</SelectItem>
                    <SelectItem value="refuted">Refuted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isRecurrence"
                checked={isRecurrence}
                onChange={(e) => setIsRecurrence(e.target.checked)}
                className="rounded border-gray-300"
              />
              <Label htmlFor="isRecurrence">This is a recurrence</Label>
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <textarea
                className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Additional clinical notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button variant="outline" onClick={back} disabled={createDiagnosis.isPending}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!isValid || createDiagnosis.isPending}>
            {createDiagnosis.isPending ? 'Saving...' : 'Add to Registry'}
          </Button>
        </div>
        </>)}
      </div>
    </div>
  );
}
