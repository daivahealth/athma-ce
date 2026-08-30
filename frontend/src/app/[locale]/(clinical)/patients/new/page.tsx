'use client';

import { useParams, useRouter } from 'next/navigation';
import { useCreatePatient } from '@/modules/clinical/hooks/use-patients';
import { useToast } from '@/components/ui/use-toast';
import { PatientForm } from '@/components/clinical/patient-form';
import type { CreatePatientDto } from '@/modules/clinical/types/patient';
import { getApiErrorMessage } from '@/lib/api/errors';

export default function NewPatientPage() {
  const params = useParams() as { locale: string };
  const router = useRouter();
  const publishToast = useToast();
  const createMutation = useCreatePatient();

  const handleSubmit = async (data: CreatePatientDto) => {
    try {
      await createMutation.mutateAsync(data);

      publishToast({
        title: 'Success',
        description: 'Patient registered successfully',
        variant: 'success',
      });

      router.push(`/${params.locale}/patients`);
    } catch (error) {
      console.error('Error creating patient:', error);
      publishToast({
        title: 'Error',
        description: getApiErrorMessage(error, 'Failed to register patient'),
        variant: 'destructive',
      });
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <PatientForm
      mode="create"
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isSubmitting={createMutation.isPending}
      locale={params.locale}
    />
  );
}
