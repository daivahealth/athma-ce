'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useMemo, useState } from 'react';
import { format } from 'date-fns';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { PatientSearchSelect } from '@/components/patient-search-select';
import { useCreateClaim } from '@/modules/rcm/hooks/use-claims';
import { usePatientEncounters } from '@/modules/clinical/hooks/use-encounters';
import { useStaffList } from '@/modules/foundation/hooks/use-staff';
import type { CreateClaimInput } from '@/modules/rcm/types/claims';

export default function NewClaimPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const toast = useToast();
  const createClaim = useCreateClaim();

  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  const [patientId, setPatientId] = useState('');
  const [encounterDateFilter, setEncounterDateFilter] = useState('');
  const [encounterDoctorFilter, setEncounterDoctorFilter] = useState('');
  const [selectedEncounter, setSelectedEncounter] = useState<any | null>(null);
  const [encounterId, setEncounterId] = useState('');
  const [payerId, setPayerId] = useState('');
  const [serviceDate, setServiceDate] = useState(new Date().toISOString().slice(0, 10));
  const [currency, setCurrency] = useState('AED');

  const { data: encountersData, isLoading: isEncountersLoading } = usePatientEncounters(patientId);
  const { data: staffList = [] } = useStaffList();

  const staffLookup = useMemo(() => {
    return staffList.reduce<Record<string, string>>((acc, staff) => {
      acc[staff.id] = staff.displayName || `${staff.firstName} ${staff.lastName}`;
      return acc;
    }, {});
  }, [staffList]);

  const filteredEncounters = useMemo(() => {
    const encounters = encountersData ?? [];
    return encounters.filter((encounter) => {
      if (encounterDateFilter) {
        const encounterDate = format(new Date(encounter.startTime), 'yyyy-MM-dd');
        if (encounterDate !== encounterDateFilter) {
          return false;
        }
      }
      if (encounterDoctorFilter.trim()) {
        const doctorName = staffLookup[encounter.primaryStaffId] || '';
        if (!doctorName.toLowerCase().includes(encounterDoctorFilter.trim().toLowerCase())) {
          return false;
        }
      }
      return true;
    });
  }, [encountersData, encounterDateFilter, encounterDoctorFilter, staffLookup]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!patientId.trim()) return;

    const payload: CreateClaimInput = {
      patientId: patientId.trim(),
      encounterId: encounterId.trim() || undefined,
      payerId: payerId.trim() || undefined,
      serviceDate: new Date(serviceDate).toISOString(),
      currency: currency.trim() || undefined,
    };

    await createClaim.mutateAsync(payload);
    toast({ title: 'Claim created' });
    router.push(`/${locale}/revenue-cycle/claims`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/${locale}/revenue-cycle/claims`} aria-label="Back to claims">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            Create claim
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
                  setSelectedEncounter(null);
                  setEncounterId('');
                  setEncounterDateFilter('');
                  setEncounterDoctorFilter('');
                }}
                onClear={() => {
                  setSelectedPatient(null);
                  setPatientId('');
                  setSelectedEncounter(null);
                  setEncounterId('');
                  setEncounterDateFilter('');
                  setEncounterDoctorFilter('');
                }}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Encounter</Label>
              {!patientId && (
                <p className="text-xs text-muted-foreground">Select a patient to view encounters.</p>
              )}
              {patientId && !selectedEncounter && (
                <div className="space-y-3">
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Date</Label>
                      <Input
                        type="date"
                        value={encounterDateFilter}
                        onChange={(event) => setEncounterDateFilter(event.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Doctor name</Label>
                      <Input
                        placeholder="Search by doctor"
                        value={encounterDoctorFilter}
                        onChange={(event) => setEncounterDoctorFilter(event.target.value)}
                      />
                    </div>
                  </div>
                  {isEncountersLoading && (
                    <p className="text-xs text-muted-foreground">Loading encounters...</p>
                  )}
                  {!isEncountersLoading && filteredEncounters.length === 0 && (
                    <p className="text-xs text-muted-foreground">No encounters match your filters.</p>
                  )}
                  {filteredEncounters.length > 0 && (
                    <div className="max-h-48 overflow-auto rounded-md border p-2">
                      {filteredEncounters.map((encounter) => (
                        <button
                          key={encounter.id}
                          type="button"
                          onClick={() => {
                            setSelectedEncounter(encounter);
                            setEncounterId(encounter.id);
                            // Auto-set service date to encounter date
                            setServiceDate(format(new Date(encounter.startTime), 'yyyy-MM-dd'));
                          }}
                          className="flex w-full flex-col items-start gap-1 rounded-md px-2 py-2 text-left text-sm hover:bg-accent"
                        >
                          <span className="font-medium">
                            {format(new Date(encounter.startTime), 'PPP p')}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Dr. {staffLookup[encounter.primaryStaffId] || 'Unknown'} · {encounter.status}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {selectedEncounter && (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border bg-muted/30 p-3 text-sm">
                  <div>
                    <p className="font-medium">{format(new Date(selectedEncounter.startTime), 'PPP p')}</p>
                    <p className="text-xs text-muted-foreground">
                      Dr. {staffLookup[selectedEncounter.primaryStaffId] || 'Unknown'} · {selectedEncounter.status}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedEncounter(null);
                      setEncounterId('');
                    }}
                  >
                    Change
                  </Button>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label>Payer ID</Label>
              <Input
                value={payerId}
                onChange={(event) => setPayerId(event.target.value)}
                placeholder="Payer UUID"
              />
            </div>
            <div className="space-y-2">
              <Label>Service date *</Label>
              <Input
                type="date"
                value={serviceDate}
                onChange={(event) => setServiceDate(event.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Currency</Label>
              <Input
                value={currency}
                onChange={(event) => setCurrency(event.target.value)}
                placeholder="AED"
              />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <Button type="submit" disabled={createClaim.isPending}>
                Create claim
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
