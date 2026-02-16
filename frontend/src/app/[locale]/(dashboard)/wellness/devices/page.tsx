'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Smartphone, Plus } from 'lucide-react';

export default function DeviceSyncPage() {
  const t = useTranslations();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Smartphone className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">{t('nav.devices')}</h1>
            <p className="text-muted-foreground">
              Connect wearables and sync health data
            </p>
          </div>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Connect Device
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Connected Devices</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Device connection manager and health data dashboard will be displayed here.
            Supports Apple Health, Fitbit, Oura Ring, and CGM devices (Dexcom, Libre).
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
