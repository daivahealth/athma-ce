'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function InpatientWardsPage({ params }: { params: { locale: string } }) {
  const router = useRouter();
  const [wardId, setWardId] = useState('');

  const goTo = (path: string) => {
    if (!wardId.trim()) return;
    router.push(`/${params.locale}/inpatient/wards/${wardId.trim()}${path}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ward Board</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="wardId">Ward ID</Label>
          <Input
            id="wardId"
            value={wardId}
            onChange={(event) => setWardId(event.target.value)}
            placeholder="Enter ward UUID"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <Button type="button" variant="outline" onClick={() => goTo('/bed-board')} disabled={!wardId.trim()}>
            Bed Board
          </Button>
          <Button type="button" variant="outline" onClick={() => goTo('/dashboard')} disabled={!wardId.trim()}>
            Ward Dashboard
          </Button>
          <Button type="button" variant="outline" onClick={() => goTo('/patients')} disabled={!wardId.trim()}>
            Ward Patients
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
