'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Target, Plus } from 'lucide-react';

import { ProgramEnrollmentDialog } from './_components/program-enrollment-dialog';

export default function WellnessProgramsPage() {
  const t = useTranslations();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Target className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">{t('nav.wellnessPrograms')}</h1>
            <p className="text-muted-foreground">
              Enroll patients in multi-session wellness programs
            </p>
          </div>
        </div>
        <ProgramEnrollmentDialog>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Program Enrollment
          </Button>
        </ProgramEnrollmentDialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Wellness Programs</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Program catalog and patient enrollments will be displayed here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
