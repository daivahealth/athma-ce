'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dumbbell, Plus } from 'lucide-react';
import { LifestylePlanDialog } from './_components/lifestyle-plan-dialog';

export default function LifestylePage() {
  const t = useTranslations();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Dumbbell className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">{t('nav.lifestyle')}</h1>
            <p className="text-muted-foreground">
              Nutrition plans and exercise prescriptions
            </p>
          </div>
        </div>
        <LifestylePlanDialog>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Plan
          </Button>
        </LifestylePlanDialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Nutrition Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Patient nutrition plans and dietary recommendations will be displayed here.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Exercise Prescriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Exercise prescriptions and activity tracking will be displayed here.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
