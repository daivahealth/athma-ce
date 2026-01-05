'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function InpatientHubPage({ params }: { params: { locale: string } }) {
  const router = useRouter();
  const [wardId, setWardId] = useState('');
  const [admissionId, setAdmissionId] = useState('');

  const handleGo = (path: string) => {
    router.push(`/${params.locale}${path}`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Inpatient Hub</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="wardId">Ward ID</Label>
              <Input
                id="wardId"
                value={wardId}
                onChange={(event) => setWardId(event.target.value)}
                placeholder="Ward UUID"
              />
            </div>
            <div className="flex flex-wrap items-end gap-3">
              <Button type="button" variant="outline" disabled={!wardId.trim()} onClick={() => handleGo(`/inpatient/wards/${wardId.trim()}/bed-board`)}>
                Bed Board
              </Button>
              <Button type="button" variant="outline" disabled={!wardId.trim()} onClick={() => handleGo(`/inpatient/wards/${wardId.trim()}/dashboard`)}>
                Ward Dashboard
              </Button>
              <Button type="button" variant="outline" disabled={!wardId.trim()} onClick={() => handleGo(`/inpatient/wards/${wardId.trim()}/patients`)}>
                Ward Patients
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="admissionId">Admission ID</Label>
              <Input
                id="admissionId"
                value={admissionId}
                onChange={(event) => setAdmissionId(event.target.value)}
                placeholder="Admission UUID"
              />
            </div>
            <div className="flex flex-wrap items-end gap-3">
              <Button type="button" variant="outline" disabled={!admissionId.trim()} onClick={() => handleGo(`/inpatient/admissions/${admissionId.trim()}`)}>
                Admission Details
              </Button>
              <Button type="button" variant="outline" disabled={!admissionId.trim()} onClick={() => handleGo(`/inpatient/admissions/${admissionId.trim()}/events`)}>
                Events
              </Button>
              <Button type="button" variant="outline" disabled={!admissionId.trim()} onClick={() => handleGo(`/inpatient/admissions/${admissionId.trim()}/transfer`)}>
                Transfer
              </Button>
              <Button type="button" variant="outline" disabled={!admissionId.trim()} onClick={() => handleGo(`/inpatient/admissions/${admissionId.trim()}/discharge`)}>
                Discharge
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link href={`/${params.locale}/inpatient/admissions`}>Admissions</Link>
        </Button>
      </div>
    </div>
  );
}
