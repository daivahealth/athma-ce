'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Droplets, FlaskConical, HeartPulse, IdCard, Pill, Plus, Save, TestTube, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { PageHeader } from '@/components/ui/page-header';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { FormActions, FormField, FormSection } from '@/components/forms/form-layout';
import { LoadingState } from '@/plugins/oncology/components/shared';
import { useProtocol, useUpdateProtocol, useCancerTypes } from '@/plugins/oncology/hooks/use-oncology';
import type { LabPrerequisite, HydrationOrder, OncologyCancerType, ProtocolPhase } from '@/plugins/oncology/types';
import { ProtocolRegimenBuilder } from '@/plugins/oncology/components/protocol-builder/ProtocolRegimenBuilder';
import { cleanPhases, emptyPhase, getProtocolPhases, validatePhases } from '@/plugins/oncology/lib/protocol-phases';

export default function EditProtocolPage() {
  const params = useParams() as { locale: string; id: string };
  const router = useRouter();
  const back = () => router.push(`/${params.locale}/oncology/protocols`);
  const { data: protocol, isLoading } = useProtocol(params.id);
  const updateProtocol = useUpdateProtocol();
  const { data: cancerTypesData } = useCancerTypes({ active: 'true' });
  const cancerTypes: OncologyCancerType[] = cancerTypesData?.data ?? [];

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [cancerType, setCancerType] = useState('');
  const [intent, setIntent] = useState('');
  const [emetogenicRisk, setEmetogenicRisk] = useState('');
  const [description, setDescription] = useState('');
  const [phases, setPhases] = useState<ProtocolPhase[]>([emptyPhase(0)]);
  const [showErrors, setShowErrors] = useState(false);
  const [premedications, setPremedications] = useState<string[]>(['']);
  const [supportiveCare, setSupportiveCare] = useState<string[]>(['']);
  const [hydration, setHydration] = useState<HydrationOrder[]>([]);
  const [labPrerequisites, setLabPrerequisites] = useState<LabPrerequisite[]>([]);

  useEffect(() => {
    if (protocol) {
      setCode(protocol.code ?? '');
      setName(protocol.name ?? '');
      setCancerType(protocol.cancer_type ?? '');
      setIntent(protocol.intent ?? '');
      setEmetogenicRisk(protocol.emetogenic_risk ?? '');
      setDescription(protocol.description ?? '');
      const ph = getProtocolPhases(protocol);
      setPhases(ph.length ? ph : [emptyPhase(0)]);
      setPremedications(protocol.premedications?.length ? protocol.premedications : ['']);
      setSupportiveCare(protocol.supportive_care?.length ? protocol.supportive_care : ['']);
      setHydration(protocol.hydration ?? []);
      setLabPrerequisites(protocol.lab_prerequisites ?? []);
    }
  }, [protocol]);

  const phaseErrors = validatePhases(cleanPhases(phases));
  const isValid = code && name && cancerType && intent;

  const handleSubmit = async () => {
    if (!isValid) return;
    if (phaseErrors.length) { setShowErrors(true); return; }
    await updateProtocol.mutateAsync({
      id: params.id,
      data: {
        name,
        description: description || undefined,
        cancerType,
        intent,
        emetogenicRisk: emetogenicRisk || undefined,
        phases: cleanPhases(phases),
        premedications: premedications.filter(Boolean),
        supportiveCare: supportiveCare.filter(Boolean),
        hydration: hydration.filter((h) => h.fluid),
        labPrerequisites: labPrerequisites.filter((l) => l.test && l.parameter),
      } as Parameters<typeof updateProtocol.mutateAsync>[0]['data'],
    });
    back();
  };

  const header = (
    <PageHeader
      title="Edit Protocol"
      subtitle={protocol ? `${protocol.code} · ${protocol.name}` : undefined}
      icon={FlaskConical}
      breadcrumb={
        <Breadcrumb items={[{ href: `/${params.locale}/oncology/protocols`, label: 'Chemo Protocols' }, { label: 'Edit' }]} />
      }
    />
  );

  if (isLoading) {
    return (
      <div className="space-y-6 page-transition">
        {header}
        <LoadingState />
      </div>
    );
  }

  return (
    <div className="space-y-6 page-transition">
      {header}

      <div className="space-y-6">
        <FormSection icon={IdCard} title="Protocol Identity" description="Code, name, cancer type, intent and emetogenic risk">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField id="code" label={<>Protocol Code <span className="text-xs text-muted-foreground">(read-only)</span></>}>
              <Input id="code" value={code} disabled className="bg-muted/30" />
            </FormField>
            <FormField id="name" label="Protocol Name" required>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </FormField>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <FormField id="cancerType" label="Cancer Type" required>
              <Select
                value={cancerType || '__none'}
                onValueChange={(v) => setCancerType(v === '__none' ? '' : v)}
              >
                <SelectTrigger id="cancerType"><SelectValue placeholder="Select cancer type..." /></SelectTrigger>
                <SelectContent className="max-h-72 overflow-y-auto">
                  <SelectItem value="__none">— Select cancer type —</SelectItem>
                  {cancerTypes.map((ct) => (
                    <SelectItem key={ct.id} value={ct.name}>
                      {ct.name}
                      {ct.category && (
                        <span className="ml-2 text-xs text-muted-foreground">({ct.category})</span>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {cancerType && !cancerTypes.some((ct) => ct.name === cancerType) && cancerTypes.length > 0 && (
                <p className="text-xs text-warning">
                  Current value &ldquo;{cancerType}&rdquo; not in catalog — select a replacement above.
                </p>
              )}
            </FormField>
            <FormField id="intent" label="Treatment Intent" required>
              <Select value={intent || '__none'} onValueChange={(v) => setIntent(v === '__none' ? '' : v)}>
                <SelectTrigger id="intent"><SelectValue placeholder="Select..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none">— Select —</SelectItem>
                  <SelectItem value="curative">Curative</SelectItem>
                  <SelectItem value="adjuvant">Adjuvant</SelectItem>
                  <SelectItem value="neoadjuvant">Neoadjuvant</SelectItem>
                  <SelectItem value="palliative">Palliative</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            <FormField id="emetogenicRisk" label="Emetogenic Risk">
              <Select value={emetogenicRisk || '__none'} onValueChange={(v) => setEmetogenicRisk(v === '__none' ? '' : v)}>
                <SelectTrigger id="emetogenicRisk"><SelectValue placeholder="Select..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none">— Not specified —</SelectItem>
                  <SelectItem value="minimal">Minimal</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
          </div>
          <FormField id="description" label="Description">
            <Textarea id="description" className="min-h-[60px]" value={description} onChange={(e) => setDescription(e.target.value)} />
          </FormField>
        </FormSection>

        <ProtocolRegimenBuilder phases={phases} onChange={setPhases} errors={showErrors ? phaseErrors : []} />

        <FormSection
          icon={Pill}
          title="Pre-medications"
          description="Drugs given before each administration"
          contentClassName="space-y-2"
          actions={
            <Button type="button" variant="ghost" size="sm" onClick={() => setPremedications((p) => [...p, ''])}>
              <Plus className="h-4 w-4 mr-1" />Add
            </Button>
          }
        >
          {premedications.map((pm, i) => (
            <div key={i} className="flex gap-2 items-center">
              <Input className="h-8" value={pm} onChange={(e) => setPremedications((p) => p.map((x, idx) => idx === i ? e.target.value : x))} />
              {premedications.length > 1 && (
                <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive" onClick={() => setPremedications((p) => p.filter((_, idx) => idx !== i))}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          ))}
        </FormSection>

        <FormSection
          icon={Droplets}
          title="Hydration Protocol"
          description="IV fluids before, with or after the regimen"
          contentClassName="space-y-3"
          actions={
            <Button type="button" variant="ghost" size="sm" onClick={() => setHydration((p) => [...p, { fluid: '', ratePerHour: 0, durationHours: 0, timing: 'pre' }])}>
              <Plus className="h-4 w-4 mr-1" />Add
            </Button>
          }
        >
          {hydration.length === 0 && <p className="text-xs text-muted-foreground">No hydration orders</p>}
          {hydration.map((h, i) => (
            <div key={i} className="grid grid-cols-4 gap-2 items-center">
              <Input className="h-8" value={h.fluid} onChange={(e) => setHydration((p) => p.map((x, idx) => idx === i ? { ...x, fluid: e.target.value } : x))} placeholder="Fluid" />
              <Input className="h-8" type="number" value={h.ratePerHour || ''} onChange={(e) => setHydration((p) => p.map((x, idx) => idx === i ? { ...x, ratePerHour: parseInt(e.target.value, 10) || 0 } : x))} placeholder="Rate (mL/hr)" />
              <Input className="h-8" type="number" value={h.durationHours || ''} onChange={(e) => setHydration((p) => p.map((x, idx) => idx === i ? { ...x, durationHours: parseInt(e.target.value, 10) || 0 } : x))} placeholder="Duration (hr)" />
              <div className="flex gap-1 items-center">
                <Select value={h.timing} onValueChange={(v) => setHydration((p) => p.map((x, idx) => idx === i ? { ...x, timing: v as HydrationOrder['timing'] } : x))}>
                  <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pre">Pre</SelectItem>
                    <SelectItem value="concurrent">Concurrent</SelectItem>
                    <SelectItem value="post">Post</SelectItem>
                  </SelectContent>
                </Select>
                <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive flex-shrink-0" onClick={() => setHydration((p) => p.filter((_, idx) => idx !== i))}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </FormSection>

        <FormSection
          icon={TestTube}
          title="Lab Prerequisites"
          description="Results required before each cycle can start"
          contentClassName="space-y-3"
          actions={
            <Button type="button" variant="ghost" size="sm" onClick={() => setLabPrerequisites((p) => [...p, { test: '', parameter: '', unit: '', timing: 'within 7 days' }])}>
              <Plus className="h-4 w-4 mr-1" />Add
            </Button>
          }
        >
          {labPrerequisites.length === 0 && <p className="text-xs text-muted-foreground">No lab prerequisites</p>}
          {labPrerequisites.map((lab, i) => (
            <div key={i} className="grid grid-cols-5 gap-2 items-center">
              <Input className="h-8" value={lab.test} onChange={(e) => setLabPrerequisites((p) => p.map((x, idx) => idx === i ? { ...x, test: e.target.value } : x))} placeholder="Test" />
              <Input className="h-8" value={lab.parameter} onChange={(e) => setLabPrerequisites((p) => p.map((x, idx) => idx === i ? { ...x, parameter: e.target.value } : x))} placeholder="Parameter" />
              <Input className="h-8" type="number" value={lab.minValue ?? ''} onChange={(e) => setLabPrerequisites((p) => p.map((x, idx) => idx === i ? { ...x, minValue: parseFloat(e.target.value) || undefined } : x))} placeholder="Min value" />
              <Input className="h-8" value={lab.unit} onChange={(e) => setLabPrerequisites((p) => p.map((x, idx) => idx === i ? { ...x, unit: e.target.value } : x))} placeholder="Unit" />
              <div className="flex gap-1 items-center">
                <Select value={lab.timing} onValueChange={(v) => setLabPrerequisites((p) => p.map((x, idx) => idx === i ? { ...x, timing: v } : x))}>
                  <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="within 24 hours">Within 24h</SelectItem>
                    <SelectItem value="within 48 hours">Within 48h</SelectItem>
                    <SelectItem value="within 7 days">Within 7 days</SelectItem>
                    <SelectItem value="within 14 days">Within 14 days</SelectItem>
                  </SelectContent>
                </Select>
                <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive flex-shrink-0" onClick={() => setLabPrerequisites((p) => p.filter((_, idx) => idx !== i))}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </FormSection>

        <FormSection
          icon={HeartPulse}
          title="Supportive Care"
          description="Growth factors, antiemetics and other supportive orders"
          contentClassName="space-y-2"
          actions={
            <Button type="button" variant="ghost" size="sm" onClick={() => setSupportiveCare((p) => [...p, ''])}>
              <Plus className="h-4 w-4 mr-1" />Add
            </Button>
          }
        >
          {supportiveCare.map((sc, i) => (
            <div key={i} className="flex gap-2 items-center">
              <Input className="h-8" value={sc} onChange={(e) => setSupportiveCare((p) => p.map((x, idx) => idx === i ? e.target.value : x))} />
              {supportiveCare.length > 1 && (
                <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive" onClick={() => setSupportiveCare((p) => p.filter((_, idx) => idx !== i))}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          ))}
        </FormSection>

        <FormActions onCancel={back} busy={updateProtocol.isPending}>
          <Button onClick={handleSubmit} disabled={!isValid || updateProtocol.isPending} className="gap-2">
            <Save className="h-4 w-4" />
            {updateProtocol.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </FormActions>
      </div>
    </div>
  );
}
