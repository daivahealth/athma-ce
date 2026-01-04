'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { usePatientPreferences, useUpdatePatientPreferences } from '@/modules/prm/hooks/use-preferences';

export default function PrmPreferencesPage() {
  const { toast } = useToast();
  const [patientId, setPatientId] = useState('');
  const [shouldFetch, setShouldFetch] = useState(false);
  const [payload, setPayload] = useState('{\n  \n}');

  const { data, isLoading, refetch } = usePatientPreferences(patientId, shouldFetch);
  const updatePreferences = useUpdatePatientPreferences(patientId);

  useEffect(() => {
    if (data) {
      try {
        setPayload(JSON.stringify(data, null, 2));
      } catch {
        setPayload('{\n  \n}');
      }
    }
  }, [data]);

  const handleLoad = async () => {
    if (!patientId.trim()) {
      toast({ title: 'Patient ID required', description: 'Enter a patient UUID to load preferences.', variant: 'destructive' });
      return;
    }
    setShouldFetch(true);
    await refetch();
  };

  const handleUpdate = async () => {
    if (!patientId.trim()) {
      toast({ title: 'Patient ID required', description: 'Enter a patient UUID to update preferences.', variant: 'destructive' });
      return;
    }

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(payload);
    } catch {
      toast({ title: 'Invalid JSON', description: 'Preferences must be valid JSON.', variant: 'destructive' });
      return;
    }

    try {
      await updatePreferences.mutateAsync(parsed);
      toast({ title: 'Preferences updated', description: 'Patient preferences saved.', variant: 'success' });
    } catch (error: any) {
      const message = error?.response?.data?.message ?? 'Failed to update preferences.';
      toast({ title: 'Update failed', description: message, variant: 'destructive' });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="patientId">Patient ID</Label>
            <Input id="patientId" value={patientId} onChange={(event) => setPatientId(event.target.value)} />
          </div>
          <div className="flex items-end gap-3">
            <Button type="button" onClick={handleLoad} disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Load Preferences'}
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="payload">Preferences JSON</Label>
          <Textarea
            id="payload"
            rows={12}
            value={payload}
            onChange={(event) => setPayload(event.target.value)}
          />
        </div>
        <div className="flex justify-end">
          <Button type="button" onClick={handleUpdate} disabled={updatePreferences.isPending}>
            {updatePreferences.isPending ? 'Saving...' : 'Save Preferences'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
