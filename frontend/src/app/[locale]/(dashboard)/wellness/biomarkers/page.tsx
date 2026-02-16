'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TestTube, Plus } from 'lucide-react';
import { BiomarkerResultDialog } from './_components/biomarker-result-dialog';

export default function BiomarkersPage() {
  const t = useTranslations();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TestTube className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">{t('nav.biomarkers')}</h1>
            <p className="text-muted-foreground">
              Track biomarkers, trends, and alerts
            </p>
          </div>
        </div>
        <BiomarkerResultDialog>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Biomarker Result
          </Button>
        </BiomarkerResultDialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Biomarker Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Biomarker dashboard with trend analysis and alerts will be displayed here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
