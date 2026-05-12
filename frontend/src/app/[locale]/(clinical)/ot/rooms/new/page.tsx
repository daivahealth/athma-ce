'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { decodeAccessToken } from '@/lib/auth/tokens';
import { getSession } from '@/lib/api/client';
import { useFacilitySpaces } from '@/modules/foundation/hooks/use-facility-spaces';
import { useTenantFacilities } from '@/modules/foundation/hooks/use-tenant-facilities';
import { useUpsertOtRoomConfig } from '@/modules/ot/hooks/use-ot';

export default function NewOtRoomPage({ params }: { params: { locale: string } }) {
  const router = useRouter();
  const publishToast = useToast();
  const claims = decodeAccessToken(getSession().accessToken);
  const [facilityId, setFacilityId] = useState(claims?.facilityId ?? claims?.defaultFacilityId ?? '');
  const [spaceId, setSpaceId] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [notes, setNotes] = useState('');
  const [isActive, setIsActive] = useState(true);

  const { data: facilities } = useTenantFacilities(claims?.tenantId, { enabled: Boolean(claims?.tenantId) });
  const { data: spaces } = useFacilitySpaces(facilityId || undefined);
  const upsertRoom = useUpsertOtRoomConfig();

  const handleSave = async () => {
    if (!spaceId) {
      publishToast({
        variant: 'destructive',
        title: 'Space required',
        description: 'Select a Foundation space to configure it as an OT room.',
      });
      return;
    }

    try {
      await upsertRoom.mutateAsync({
        spaceId,
        specialty: specialty || undefined,
        notes: notes || undefined,
        isActive,
      });
      publishToast({
        title: 'OT room saved',
        description: 'The room configuration was updated successfully.',
      });
      router.push(`/${params.locale}/ot/rooms`);
    } catch (error) {
      publishToast({
        variant: 'destructive',
        title: 'Unable to save OT room',
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.push(`/${params.locale}/ot/rooms`)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configure OT Room</CardTitle>
          <CardDescription>Map a facility space into the OT scheduling workflow.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Facility</Label>
            <Select value={facilityId || undefined} onValueChange={setFacilityId}>
              <SelectTrigger>
                <SelectValue placeholder="Select facility" />
              </SelectTrigger>
              <SelectContent>
                {(facilities ?? []).map((facility) => (
                  <SelectItem key={facility.id} value={facility.id}>
                    {facility.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Space</Label>
            <Select value={spaceId || undefined} onValueChange={setSpaceId}>
              <SelectTrigger>
                <SelectValue placeholder="Select active space" />
              </SelectTrigger>
              <SelectContent>
                {(spaces ?? []).filter((space) => space.isActive).map((space) => (
                  <SelectItem key={space.id} value={space.id}>
                    {space.name} {space.spaceNumber ? `• ${space.spaceNumber}` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Specialty</Label>
            <Input value={specialty} onChange={(e) => setSpecialty(e.target.value)} placeholder="Cardiac, ortho, neuro" />
          </div>

          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Laminar flow, robotics, hybrid theatre setup" />
          </div>

          <label className="flex items-center gap-3 rounded-lg border p-3 text-sm">
            <Checkbox checked={isActive} onChange={(event) => setIsActive(event.target.checked)} />
            OT room is active and schedulable
          </label>

          <div className="flex gap-3">
            <Button onClick={handleSave} disabled={upsertRoom.isPending}>
              <ShieldCheck className="mr-2 h-4 w-4" />
              Save Room Config
            </Button>
            <Button variant="outline" onClick={() => router.push(`/${params.locale}/ot/rooms`)}>Cancel</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
