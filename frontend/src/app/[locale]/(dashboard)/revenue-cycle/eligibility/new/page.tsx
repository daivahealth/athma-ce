'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { PatientSearchSelect } from '@/components/patient-search-select';
import { useCheckEligibility } from '@/modules/rcm/hooks/use-eligibility';
import type { EligibilityRequestType } from '@/modules/rcm/types/eligibility';

const requestTypes: EligibilityRequestType[] = ['eligibility', 'benefits'];

export default function NewEligibilityPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const toast = useToast();
  const checkEligibility = useCheckEligibility();

  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  const [patientId, setPatientId] = useState('');
  const [payerId, setPayerId] = useState('');
  const [policyId, setPolicyId] = useState('');
  const [encounterId, setEncounterId] = useState('');
  const [requestType, setRequestType] = useState<EligibilityRequestType>('eligibility');
  const [serviceTypes, setServiceTypes] = useState('');
  const [serviceDate, setServiceDate] = useState(new Date().toISOString().slice(0, 10));

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!patientId.trim() || !payerId.trim()) return;

    await checkEligibility.mutateAsync({
      patientId: patientId.trim(),
      payerId: payerId.trim(),
      policyId: policyId.trim() || undefined,
      encounterId: encounterId.trim() || undefined,
      requestType,
      serviceTypes: serviceTypes
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean),
      serviceDate: serviceDate ? new Date(serviceDate).toISOString() : undefined,
    });
    toast({ title: 'Eligibility request submitted' });
    router.push(`/${locale}/revenue-cycle/eligibility`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/${locale}/revenue-cycle/eligibility`} aria-label="Back to eligibility">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            New eligibility request
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
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
              <Label>Request type</Label>
              <Select value={requestType} onValueChange={(value) => setRequestType(value as EligibilityRequestType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {requestTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type === 'eligibility' ? 'Eligibility' : 'Benefits'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Service types (comma separated)</Label>
              <Input value={serviceTypes} onChange={(event) => setServiceTypes(event.target.value)} placeholder="30, 47" />
            </div>
            <div className="space-y-2">
              <Label>Service date</Label>
              <Input
                type="date"
                value={serviceDate}
                onChange={(event) => setServiceDate(event.target.value)}
              />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <Button type="submit" disabled={checkEligibility.isPending}>
                Submit request
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
