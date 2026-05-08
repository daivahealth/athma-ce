'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useCreateProtocol } from '@/plugins/oncology/hooks/use-oncology';
import type { RegimenItem, LabPrerequisite, HydrationOrder } from '@/plugins/oncology/types';

interface RegimenRow extends RegimenItem { day: number }

const emptyDrug = (): RegimenRow => ({ drug: '', dose: 0, unit: 'mg/m²', route: 'IV', day: 1, doseFormula: 'bsa' });
const emptyPremed = (): string => '';
const emptyHydration = (): HydrationOrder => ({ fluid: '', ratePerHour: 0, durationHours: 0, timing: 'pre' });
const emptyLab = (): LabPrerequisite => ({ test: '', parameter: '', unit: '', timing: 'within 7 days' });

export default function NewProtocolPage({ params }: { params: { locale: string } }) {
  const router = useRouter();
  const back = () => router.push(`/${params.locale}/oncology/protocols`);
  const createProtocol = useCreateProtocol();

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [cancerType, setCancerType] = useState('');
  const [intent, setIntent] = useState('');
  const [emetogenicRisk, setEmetogenicRisk] = useState('');
  const [totalCycles, setTotalCycles] = useState('');
  const [cycleDurationDays, setCycleDurationDays] = useState('');
  const [description, setDescription] = useState('');
  const [regimen, setRegimen] = useState<RegimenRow[]>([emptyDrug()]);
  const [premedications, setPremedications] = useState<string[]>(['']);
  const [supportiveCare, setSupportiveCare] = useState<string[]>(['']);
  const [hydration, setHydration] = useState<HydrationOrder[]>([]);
  const [labPrerequisites, setLabPrerequisites] = useState<LabPrerequisite[]>([]);

  const isValid = code && name && cancerType && intent && totalCycles && cycleDurationDays &&
    regimen.some((r) => r.drug && r.dose > 0);

  const handleSubmit = async () => {
    if (!isValid) return;
    await createProtocol.mutateAsync({
      code,
      name,
      description: description || undefined,
      cancerType,
      intent,
      emetogenicRisk: emetogenicRisk || undefined,
      totalCycles: parseInt(totalCycles, 10),
      cycleDurationDays: parseInt(cycleDurationDays, 10),
      regimen: regimen.filter((r) => r.drug && r.dose > 0),
      premedications: premedications.filter(Boolean),
      supportiveCare: supportiveCare.filter(Boolean),
      hydration: hydration.filter((h) => h.fluid),
      labPrerequisites: labPrerequisites.filter((l) => l.test && l.parameter),
    } as Parameters<typeof createProtocol.mutateAsync>[0]);
    back();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={back}>
          <ArrowLeft className="mr-2 h-4 w-4" />Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Create Chemo Protocol</h1>
          <p className="text-muted-foreground text-sm">Define a standardised chemotherapy regimen</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Protocol Identity */}
        <Card>
          <CardHeader><CardTitle>Protocol Identity</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Protocol Code * <span className="text-xs text-muted-foreground">(unique per tenant)</span></Label>
                <Input placeholder="e.g. AC-T, FOLFOX, BEP" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} />
              </div>
              <div className="space-y-2">
                <Label>Protocol Name *</Label>
                <Input placeholder="e.g. Doxorubicin + Cyclophosphamide → Paclitaxel" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Cancer Type *</Label>
                <Input placeholder="e.g. Breast Cancer, NSCLC" value={cancerType} onChange={(e) => setCancerType(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Treatment Intent *</Label>
                <Select value={intent || '__none'} onValueChange={(v) => setIntent(v === '__none' ? '' : v)}>
                  <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none">— Select —</SelectItem>
                    <SelectItem value="curative">Curative</SelectItem>
                    <SelectItem value="adjuvant">Adjuvant</SelectItem>
                    <SelectItem value="neoadjuvant">Neoadjuvant</SelectItem>
                    <SelectItem value="palliative">Palliative</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Emetogenic Risk</Label>
                <Select value={emetogenicRisk || '__none'} onValueChange={(v) => setEmetogenicRisk(v === '__none' ? '' : v)}>
                  <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none">— Not specified —</SelectItem>
                    <SelectItem value="minimal">Minimal (&lt;10%)</SelectItem>
                    <SelectItem value="low">Low (10–30%)</SelectItem>
                    <SelectItem value="moderate">Moderate (30–90%)</SelectItem>
                    <SelectItem value="high">High (&gt;90%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <textarea className="w-full min-h-[60px] rounded-md border border-input bg-background px-3 py-2 text-sm" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Clinical notes, evidence base, references..." />
            </div>
          </CardContent>
        </Card>

        {/* Regimen */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Regimen *</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">At least one drug required</p>
              </div>
              <Button type="button" variant="ghost" size="sm" onClick={() => setRegimen((p) => [...p, emptyDrug()])}>
                <Plus className="h-4 w-4 mr-1" />Add Drug
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-8 gap-2 text-xs font-medium text-muted-foreground px-1">
              <span className="col-span-2">Drug Name</span>
              <span>Dose</span>
              <span>Unit</span>
              <span>Route</span>
              <span>Day(s)</span>
              <span>Formula</span>
              <span>Infusion (min)</span>
            </div>
            {regimen.map((drug, i) => (
              <div key={i} className="grid grid-cols-8 gap-2 items-center">
                <Input className="h-8 col-span-2" placeholder="Drug name" value={drug.drug} onChange={(e) => setRegimen((p) => p.map((d, idx) => idx === i ? { ...d, drug: e.target.value } : d))} />
                <Input className="h-8" type="number" min={0} placeholder="0" value={drug.dose || ''} onChange={(e) => setRegimen((p) => p.map((d, idx) => idx === i ? { ...d, dose: parseFloat(e.target.value) || 0 } : d))} />
                <Select value={drug.unit} onValueChange={(v) => setRegimen((p) => p.map((d, idx) => idx === i ? { ...d, unit: v } : d))}>
                  <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mg/m²">mg/m²</SelectItem>
                    <SelectItem value="mg/kg">mg/kg</SelectItem>
                    <SelectItem value="mg">mg</SelectItem>
                    <SelectItem value="AUC">AUC</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={drug.route} onValueChange={(v) => setRegimen((p) => p.map((d, idx) => idx === i ? { ...d, route: v } : d))}>
                  <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IV">IV</SelectItem>
                    <SelectItem value="PO">PO</SelectItem>
                    <SelectItem value="SC">SC</SelectItem>
                    <SelectItem value="IM">IM</SelectItem>
                  </SelectContent>
                </Select>
                <Input className="h-8" type="number" min={1} placeholder="1" value={drug.day || ''} onChange={(e) => setRegimen((p) => p.map((d, idx) => idx === i ? { ...d, day: parseInt(e.target.value, 10) || 1 } : d))} />
                <Select value={drug.doseFormula} onValueChange={(v) => setRegimen((p) => p.map((d, idx) => idx === i ? { ...d, doseFormula: v as RegimenItem['doseFormula'] } : d))}>
                  <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bsa">BSA</SelectItem>
                    <SelectItem value="weight">Weight</SelectItem>
                    <SelectItem value="fixed">Fixed</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex gap-1 items-center">
                  <Input className="h-8" type="number" min={0} placeholder="—" value={drug.infusionDurationMin ?? ''} onChange={(e) => setRegimen((p) => p.map((d, idx) => idx === i ? { ...d, infusionDurationMin: parseInt(e.target.value, 10) || undefined } : d))} />
                  {regimen.length > 1 && (
                    <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive flex-shrink-0" onClick={() => setRegimen((p) => p.filter((_, idx) => idx !== i))}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Cycle Schedule */}
        <Card>
          <CardHeader><CardTitle>Cycle Schedule</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Total Cycles *</Label>
                <Input type="number" min={1} placeholder="e.g. 6" value={totalCycles} onChange={(e) => setTotalCycles(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Cycle Duration (days) *</Label>
                <Input type="number" min={1} placeholder="e.g. 21" value={cycleDurationDays} onChange={(e) => setCycleDurationDays(e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pre-medications */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Pre-medications</CardTitle>
              <Button type="button" variant="ghost" size="sm" onClick={() => setPremedications((p) => [...p, ''])}>
                <Plus className="h-4 w-4 mr-1" />Add
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {premedications.map((pm, i) => (
              <div key={i} className="flex gap-2 items-center">
                <Input className="h-8" placeholder="e.g. Dexamethasone 8mg IV pre" value={pm} onChange={(e) => setPremedications((p) => p.map((x, idx) => idx === i ? e.target.value : x))} />
                {premedications.length > 1 && (
                  <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive" onClick={() => setPremedications((p) => p.filter((_, idx) => idx !== i))}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Hydration */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Hydration Protocol</CardTitle>
              <Button type="button" variant="ghost" size="sm" onClick={() => setHydration((p) => [...p, emptyHydration()])}>
                <Plus className="h-4 w-4 mr-1" />Add
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {hydration.length === 0 && <p className="text-xs text-muted-foreground">No hydration orders — add if protocol requires IV fluids</p>}
            {hydration.map((h, i) => (
              <div key={i} className="grid grid-cols-4 gap-2 items-center">
                <Input className="h-8" placeholder="Fluid (e.g. NS 1L)" value={h.fluid} onChange={(e) => setHydration((p) => p.map((x, idx) => idx === i ? { ...x, fluid: e.target.value } : x))} />
                <div className="flex gap-1 items-center">
                  <Input className="h-8" type="number" min={0} placeholder="Rate (mL/hr)" value={h.ratePerHour || ''} onChange={(e) => setHydration((p) => p.map((x, idx) => idx === i ? { ...x, ratePerHour: parseInt(e.target.value, 10) || 0 } : x))} />
                </div>
                <div className="flex gap-1 items-center">
                  <Input className="h-8" type="number" min={0} placeholder="Duration (hr)" value={h.durationHours || ''} onChange={(e) => setHydration((p) => p.map((x, idx) => idx === i ? { ...x, durationHours: parseInt(e.target.value, 10) || 0 } : x))} />
                </div>
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
          </CardContent>
        </Card>

        {/* Lab Prerequisites */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Lab Prerequisites</CardTitle>
              <Button type="button" variant="ghost" size="sm" onClick={() => setLabPrerequisites((p) => [...p, emptyLab()])}>
                <Plus className="h-4 w-4 mr-1" />Add
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {labPrerequisites.length === 0 && <p className="text-xs text-muted-foreground">No lab prerequisites — add required tests before each cycle (e.g. ANC ≥ 1500/mm³)</p>}
            {labPrerequisites.map((lab, i) => (
              <div key={i} className="grid grid-cols-5 gap-2 items-center">
                <Input className="h-8" placeholder="Test (e.g. CBC)" value={lab.test} onChange={(e) => setLabPrerequisites((p) => p.map((x, idx) => idx === i ? { ...x, test: e.target.value } : x))} />
                <Input className="h-8" placeholder="Parameter (e.g. ANC)" value={lab.parameter} onChange={(e) => setLabPrerequisites((p) => p.map((x, idx) => idx === i ? { ...x, parameter: e.target.value } : x))} />
                <Input className="h-8" type="number" placeholder="Min value" value={lab.minValue ?? ''} onChange={(e) => setLabPrerequisites((p) => p.map((x, idx) => idx === i ? { ...x, minValue: parseFloat(e.target.value) || undefined } : x))} />
                <Input className="h-8" placeholder="Unit (e.g. /mm³)" value={lab.unit} onChange={(e) => setLabPrerequisites((p) => p.map((x, idx) => idx === i ? { ...x, unit: e.target.value } : x))} />
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
          </CardContent>
        </Card>

        {/* Supportive Care */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Supportive Care</CardTitle>
              <Button type="button" variant="ghost" size="sm" onClick={() => setSupportiveCare((p) => [...p, ''])}>
                <Plus className="h-4 w-4 mr-1" />Add
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {supportiveCare.map((sc, i) => (
              <div key={i} className="flex gap-2 items-center">
                <Input className="h-8" placeholder="e.g. G-CSF Day 4–10, Pegfilgrastim Day 2" value={sc} onChange={(e) => setSupportiveCare((p) => p.map((x, idx) => idx === i ? e.target.value : x))} />
                {supportiveCare.length > 1 && (
                  <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive" onClick={() => setSupportiveCare((p) => p.filter((_, idx) => idx !== i))}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button variant="outline" onClick={back} disabled={createProtocol.isPending}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!isValid || createProtocol.isPending}>
            {createProtocol.isPending ? 'Saving...' : 'Create Protocol'}
          </Button>
        </div>
      </div>
    </div>
  );
}
