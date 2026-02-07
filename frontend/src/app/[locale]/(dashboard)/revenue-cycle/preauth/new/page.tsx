'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { PatientSearchSelect } from '@/components/patient-search-select';
import { useCreatePreAuth } from '@/modules/rcm/hooks/use-preauth';
import type { PreAuthService, PreAuthUrgency } from '@/modules/rcm/types/preauth';

const urgencyOptions: PreAuthUrgency[] = ['routine', 'urgent', 'emergency'];

const createService = (): PreAuthService => ({
  procedureCode: '',
  description: '',
  quantity: 1,
  estimatedCost: undefined,
  diagnosisCodes: [],
});

export default function NewPreAuthPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const toast = useToast();
  const createPreAuth = useCreatePreAuth();

  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  const [patientId, setPatientId] = useState('');
  const [payerId, setPayerId] = useState('');
  const [policyId, setPolicyId] = useState('');
  const [encounterId, setEncounterId] = useState('');
  const [urgency, setUrgency] = useState<PreAuthUrgency>('routine');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [services, setServices] = useState<PreAuthService[]>([createService()]);

  const handleServiceChange = (index: number, field: keyof PreAuthService, value: string) => {
    setServices((prev) =>
      prev.map((service, idx) => {
        if (idx !== index) return service;
        if (field === 'quantity') {
          return { ...service, quantity: Number(value) || 0 };
        }
        if (field === 'estimatedCost') {
          return { ...service, estimatedCost: value ? Number(value) : undefined };
        }
        if (field === 'diagnosisCodes') {
          return {
            ...service,
            diagnosisCodes: value
              .split(',')
              .map((code) => code.trim())
              .filter(Boolean),
          };
        }
        return { ...service, [field]: value };
      }),
    );
  };

  const handleAddService = () => {
    setServices((prev) => [...prev, createService()]);
  };

  const handleRemoveService = (index: number) => {
    setServices((prev) => (prev.length === 1 ? prev : prev.filter((_, idx) => idx !== index)));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!patientId.trim() || !payerId.trim()) return;

    const cleanedServices = services.filter((service) => service.procedureCode.trim());
    if (cleanedServices.length === 0) return;

    await createPreAuth.mutateAsync({
      patientId: patientId.trim(),
      payerId: payerId.trim(),
      policyId: policyId.trim() || undefined,
      encounterId: encounterId.trim() || undefined,
      urgency,
      clinicalNotes: clinicalNotes.trim() || undefined,
      requestedServices: cleanedServices.map((service) => ({
        ...service,
        procedureCode: service.procedureCode.trim(),
        description: service.description?.trim() || undefined,
      })),
    });
    toast({ title: 'Pre-auth request created' });
    router.push(`/${locale}/revenue-cycle/preauth`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/${locale}/revenue-cycle/preauth`} aria-label="Back to pre-auth">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            New pre-auth request
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <PatientSearchSelect
                  required
                  selectedPatient={selectedPatient}
                  onSelect={(patient) => {
                    setSelectedPatient(patient);
                    setPatientId(patient.id);
                  }}
                  onClear={() => {
                    setSelectedPatient(null);
                    setPatientId('');
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Payer ID *</Label>
                <Input
                  value={payerId}
                  onChange={(event) => setPayerId(event.target.value)}
                  placeholder="Payer UUID"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Policy ID</Label>
                <Input value={policyId} onChange={(event) => setPolicyId(event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Encounter ID</Label>
                <Input value={encounterId} onChange={(event) => setEncounterId(event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Urgency</Label>
                <Select value={urgency} onValueChange={(value) => setUrgency(value as PreAuthUrgency)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select urgency" />
                  </SelectTrigger>
                  <SelectContent>
                    {urgencyOptions.map((value) => (
                      <SelectItem key={value} value={value}>
                        {value.charAt(0).toUpperCase() + value.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Clinical notes</Label>
                <Input
                  value={clinicalNotes}
                  onChange={(event) => setClinicalNotes(event.target.value)}
                  placeholder="Optional notes"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold">Requested services</h3>
                  <p className="text-sm text-muted-foreground">Add procedures that require authorization.</p>
                </div>
                <Button type="button" variant="outline" onClick={handleAddService}>
                  <Plus className="mr-2 h-4 w-4" /> Add service
                </Button>
              </div>
              {services.map((service, index) => (
                <div key={index} className="rounded-md border p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Service {index + 1}</p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveService(index)}
                      disabled={services.length === 1}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Remove
                    </Button>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Procedure code *</Label>
                      <Input
                        value={service.procedureCode}
                        onChange={(event) => handleServiceChange(index, 'procedureCode', event.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Input
                        value={service.description}
                        onChange={(event) => handleServiceChange(index, 'description', event.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Quantity</Label>
                      <Input
                        type="number"
                        step="1"
                        value={service.quantity ?? 1}
                        onChange={(event) => handleServiceChange(index, 'quantity', event.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Estimated cost</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={service.estimatedCost ?? ''}
                        onChange={(event) => handleServiceChange(index, 'estimatedCost', event.target.value)}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Diagnosis codes (comma separated)</Label>
                      <Input
                        value={(service.diagnosisCodes ?? []).join(', ')}
                        onChange={(event) => handleServiceChange(index, 'diagnosisCodes', event.target.value)}
                        placeholder="E11.9, I10"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={createPreAuth.isPending}>
                Create request
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
