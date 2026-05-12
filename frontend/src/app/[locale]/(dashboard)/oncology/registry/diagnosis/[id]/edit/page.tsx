'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  useCancerDiagnosis,
  useUpdateCancerDiagnosis,
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

export default function EditDiagnosisPage({ params }: { params: { locale: string; id: string } }) {
  const router = useRouter();
  const back = () => router.push(`/${params.locale}/oncology/registry`);

  const { data: diagnosis, isLoading } = useCancerDiagnosis(params.id);
  const updateDiagnosis = useUpdateCancerDiagnosis();

  // Cancer Identity — catalog-driven
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

  // Catalog data — always load all for edit (need to match existing values)
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

  // Populate form from loaded diagnosis, matching catalog entries by name/code
  useEffect(() => {
    if (!diagnosis) return;

    setCancerType(diagnosis.cancer_type ?? '');
    setPrimarySite(diagnosis.primary_site ?? '');
    setPrimarySiteCode(diagnosis.primary_site_code ?? '');
    setLaterality(diagnosis.laterality ?? '');
    setHistologyMorphology(diagnosis.histology_morphology ?? '');
    setMorphologyCode(diagnosis.morphology_code ?? '');
    setIcdCode(diagnosis.icd_code ?? '');
    setDiagnosisDate(diagnosis.diagnosis_date?.substring(0, 10) ?? '');
    setClinicalStatus(diagnosis.clinical_status ?? 'active');
    setVerificationStatus(diagnosis.verification_status ?? 'confirmed');
    setGrade(diagnosis.grade ?? '');
    setMetastaticStatus(diagnosis.metastatic_status ?? 'unknown');
    setIsRecurrence(diagnosis.is_recurrence ?? false);
    setEcogAtDiagnosis(diagnosis.ecog_at_diagnosis?.toString() ?? '');
    setNotes(diagnosis.notes ?? '');
  }, [diagnosis]);

  // Match catalog entries once catalogs are loaded
  useEffect(() => {
    if (!diagnosis || cancerTypes.length === 0) return;
    const matched = cancerTypes.find(
      (c) => c.name.toLowerCase() === (diagnosis.cancer_type ?? '').toLowerCase(),
    );
    if (matched) setSelectedCancerTypeId(matched.id);
  }, [diagnosis, cancerTypes]);

  useEffect(() => {
    if (!diagnosis || allPrimarySites.length === 0) return;
    const code = diagnosis.primary_site_code;
    if (code) {
      const matched = allPrimarySites.find((s) => s.icdo_site_code === code);
      if (matched) setSelectedPrimarySiteId(matched.id);
    }
  }, [diagnosis, allPrimarySites]);

  useEffect(() => {
    if (!diagnosis || histologies.length === 0) return;
    const code = diagnosis.morphology_code;
    if (code) {
      const matched = histologies.find((h) => h.morphology_code === code);
      if (matched) setSelectedHistologyId(matched.id);
    }
  }, [diagnosis, histologies]);

  const handleCancerTypeChange = (value: string) => {
    if (value === '__none') {
      setSelectedCancerTypeId('');
      setCancerType('');
    } else {
      const ct = cancerTypes.find((c) => c.id === value);
      setSelectedCancerTypeId(value);
      setCancerType(ct?.name ?? '');
    }
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

  const isValid = cancerType && primarySite && diagnosisDate;

  const handleSubmit = async () => {
    if (!isValid) return;
    await updateDiagnosis.mutateAsync({
      id: params.id,
      data: {
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
      },
    });
    back();
  };

  if (isLoading) {
    return <div className="text-muted-foreground p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={back}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Edit Diagnosis</h1>
          <p className="text-muted-foreground text-sm">Update cancer diagnosis details</p>
        </div>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Cancer Identity</CardTitle></CardHeader>
          <CardContent className="space-y-4">

            {/* Cancer Type */}
            <div className="space-y-2">
              <Label>Cancer Type *</Label>
              <Select
                value={selectedCancerTypeId || '__none'}
                onValueChange={handleCancerTypeChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select cancer type..." />
                </SelectTrigger>
                <SelectContent className="max-h-72 overflow-y-auto">
                  <SelectItem value="__none">— Select cancer type —</SelectItem>
                  {cancerTypes.map((ct) => (
                    <SelectItem key={ct.id} value={ct.id}>
                      {ct.name}
                      {ct.category && (
                        <span className="ml-2 text-xs text-muted-foreground">({ct.category})</span>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {cancerType && !selectedCancerTypeId && (
                <p className="text-xs text-amber-600">
                  Current value &ldquo;{cancerType}&rdquo; not found in catalog — select a replacement above.
                </p>
              )}
            </div>

            {/* Primary Site */}
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
                {primarySite && !selectedPrimarySiteId && (
                  <p className="text-xs text-amber-600">
                    Current value &ldquo;{primarySite}&rdquo; not in catalog — select above.
                  </p>
                )}
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
                <Input value={icdCode} onChange={(e) => setIcdCode(e.target.value)} />
              </div>
            </div>

            {/* Histology */}
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
                {histologyMorphology && !selectedHistologyId && (
                  <p className="text-xs text-amber-600">
                    Current value &ldquo;{histologyMorphology}&rdquo; not in catalog — select above.
                  </p>
                )}
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
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button variant="outline" onClick={back} disabled={updateDiagnosis.isPending}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!isValid || updateDiagnosis.isPending}>
            {updateDiagnosis.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}
