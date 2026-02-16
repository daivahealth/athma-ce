'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Timer, Plus } from 'lucide-react';
import { TreatmentProtocolDialog } from './_components/treatment-protocol-dialog';

export default function LongevityPage() {
  const t = useTranslations();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Timer className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">{t('nav.longevity')}</h1>
            <p className="text-muted-foreground">
              Longevity protocols and biological age tracking
            </p>
          </div>
        </div>
        <TreatmentProtocolDialog>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Treatment Protocol
          </Button>
        </TreatmentProtocolDialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Longevity Treatments</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Longevity treatment protocols and biological age calculator will be displayed here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
