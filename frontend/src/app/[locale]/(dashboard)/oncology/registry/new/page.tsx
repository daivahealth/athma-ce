'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Activity, ChevronsUpDown, Check, Dna, Save, Search, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { PageHeader } from '@/components/ui/page-header';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { FIELD_CONTROL, FormActions, FormField, FormSection } from '@/components/forms/form-layout';
import { cn } from '@/lib/utils';
import {
  PatientContextCard,
  PatientPickerCard,
  patientFromSearch,
} from '@/plugins/oncology/components/FormContextCards';
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

/** The registry form also falls back to the search result's `displayName`. */
function patientSummary(p: Patient) {
  const summary = patientFromSearch(p);
  const displayName = (p as { displayName?: string }).displayName;
  return summary.name === '—' && displayName ? { ...summary, name: displayName } : summary;
}

export default function NewDiagnosisPage() {
  const params = useParams() as { locale: string };
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
    <div className="space-y-6 page-transition">
      <PageHeader
        title="Add to Oncology Registry"
        subtitle="Register a new cancer diagnosis for a patient"
        icon={UserRound}
        breadcrumb={
          <Breadcrumb items={[{ href: `/${params.locale}/oncology/registry`, label: 'Oncology Registry' }, { label: 'New' }]} />
        }
      />

      <div className="space-y-6">
        {!selectedPatient ? (
          <PatientPickerCard onSelect={(p) => setSelectedPatient(p as Patient)} onClear={() => setSelectedPatient(null)} />
        ) : (
          <PatientContextCard
            patient={patientSummary(selectedPatient)}
            onChange={() => setSelectedPatient(null)}
          />
        )}

        {selectedPatient && (
          <>
            <FormSection icon={Dna} title="Cancer Identity" description="Cancer type, primary site and histology from the oncology catalogs">
              {/* Cancer Type — searchable combobox */}
              <FormField id="cancerType" label="Cancer Type" required>
                <Popover open={cancerTypeOpen} onOpenChange={(o) => { setCancerTypeOpen(o); if (o) setCancerTypeSearch(''); }}>
                  <PopoverTrigger asChild>
                    <Button
                      id="cancerType"
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
              </FormField>

              {/* Primary Site — filtered by cancer type via site mappings */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  id="primarySite"
                  label={
                    <>
                      Primary Site
                      {hasMappings && (
                        <span className="ml-2 text-xs text-muted-foreground font-normal">
                          (filtered for selected cancer type)
                        </span>
                      )}
                    </>
                  }
                  required
                >
                  <Select
                    value={selectedPrimarySiteId || '__none'}
                    onValueChange={handlePrimarySiteChange}
                    disabled={!selectedCancerTypeId && primarySiteOptions.length === 0}
                  >
                    <SelectTrigger id="primarySite">
                      <SelectValue placeholder="Select primary site..." />
                    </SelectTrigger>
                    <SelectContent className="max-h-72 overflow-y-auto">
                      <SelectItem value="__none">— Select primary site —</SelectItem>
                      {primarySiteOptions.map((o) => (
                        <SelectItem key={o.id} value={o.id}>
                          <span className="font-mono text-xs text-muted-foreground mr-2">{o.code}</span>
                          {o.name}
                          {o.isDefault && <span className="ml-1 text-xs text-success">(default)</span>}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
                <FormField id="primarySiteCode" label="Site Code (ICD-O-3)">
                  <Input
                    id="primarySiteCode"
                    placeholder="Auto-filled from site selection"
                    value={primarySiteCode}
                    onChange={(e) => setPrimarySiteCode(e.target.value)}
                    className={primarySiteCode ? 'bg-muted/30' : ''}
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField id="laterality" label="Laterality">
                  <Select value={laterality || '__none'} onValueChange={(v) => setLaterality(v === '__none' ? '' : v)}>
                    <SelectTrigger id="laterality"><SelectValue placeholder="Select..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none">— Not applicable —</SelectItem>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                      <SelectItem value="bilateral">Bilateral</SelectItem>
                      <SelectItem value="not_applicable">Not Applicable</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
                <FormField id="icdCode" label="ICD-10 Code">
                  <Input id="icdCode" placeholder="e.g. C50.911" value={icdCode} onChange={(e) => setIcdCode(e.target.value)} />
                </FormField>
              </div>

              {/* Histology — from master */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField id="histology" label="Histology / Morphology">
                  <Select
                    value={selectedHistologyId || '__none'}
                    onValueChange={handleHistologyChange}
                  >
                    <SelectTrigger id="histology">
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
                </FormField>
                <FormField id="morphologyCode" label="Morphology Code (ICD-O-3)">
                  <Input
                    id="morphologyCode"
                    placeholder="Auto-filled from histology selection"
                    value={morphologyCode}
                    onChange={(e) => setMorphologyCode(e.target.value)}
                    className={morphologyCode ? 'bg-muted/30' : ''}
                  />
                </FormField>
              </div>
            </FormSection>

            <FormSection icon={Activity} title="Clinical Assessment" description="Diagnosis date, grade, spread and performance status">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField id="diagnosisDate" label="Diagnosis Date" required>
                  <Input id="diagnosisDate" type="date" className={FIELD_CONTROL} value={diagnosisDate} onChange={(e) => setDiagnosisDate(e.target.value)} />
                </FormField>
                <FormField id="grade" label="Grade">
                  <Select value={grade || '__none'} onValueChange={(v) => setGrade(v === '__none' ? '' : v)}>
                    <SelectTrigger id="grade"><SelectValue placeholder="Select..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none">— Not assessed —</SelectItem>
                      <SelectItem value="G1">G1 - Well differentiated</SelectItem>
                      <SelectItem value="G2">G2 - Moderately differentiated</SelectItem>
                      <SelectItem value="G3">G3 - Poorly differentiated</SelectItem>
                      <SelectItem value="G4">G4 - Undifferentiated</SelectItem>
                      <SelectItem value="GX">GX - Cannot be assessed</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField id="metastaticStatus" label="Metastatic Status">
                  <Select value={metastaticStatus} onValueChange={setMetastaticStatus}>
                    <SelectTrigger id="metastaticStatus"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="localized">Localized</SelectItem>
                      <SelectItem value="regional">Regional</SelectItem>
                      <SelectItem value="distant">Distant (Metastatic)</SelectItem>
                      <SelectItem value="unknown">Unknown</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
                <FormField id="ecogAtDiagnosis" label="ECOG Performance Status">
                  <Select value={ecogAtDiagnosis || '__none'} onValueChange={(v) => setEcogAtDiagnosis(v === '__none' ? '' : v)}>
                    <SelectTrigger id="ecogAtDiagnosis"><SelectValue placeholder="Select..." /></SelectTrigger>
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
                </FormField>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField id="clinicalStatus" label="Clinical Status">
                  <Select value={clinicalStatus} onValueChange={setClinicalStatus}>
                    <SelectTrigger id="clinicalStatus"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="remission">Remission</SelectItem>
                      <SelectItem value="recurrence">Recurrence</SelectItem>
                      <SelectItem value="relapsed">Relapsed</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
                <FormField id="verificationStatus" label="Verification Status">
                  <Select value={verificationStatus} onValueChange={setVerificationStatus}>
                    <SelectTrigger id="verificationStatus"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="provisional">Provisional</SelectItem>
                      <SelectItem value="differential">Differential</SelectItem>
                      <SelectItem value="refuted">Refuted</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isRecurrence"
                  checked={isRecurrence}
                  onChange={(e) => setIsRecurrence(e.target.checked)}
                  className="h-4 w-4 rounded border-input accent-primary"
                />
                <Label htmlFor="isRecurrence">This is a recurrence</Label>
              </div>
              <FormField id="notes" label="Notes">
                <Textarea
                  id="notes"
                  className="min-h-[80px]"
                  placeholder="Additional clinical notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </FormField>
            </FormSection>

            <FormActions onCancel={back} busy={createDiagnosis.isPending}>
              <Button onClick={handleSubmit} disabled={!isValid || createDiagnosis.isPending} className="gap-2">
                <Save className="h-4 w-4" />
                {createDiagnosis.isPending ? 'Saving...' : 'Add to Registry'}
              </Button>
            </FormActions>
          </>
        )}
      </div>
    </div>
  );
}
