'use client';

import { useRouter } from 'next/navigation';
import { useCreatePatient } from '@/modules/clinical/hooks/use-patients';
import { useToast } from '@/components/ui/use-toast';
import { PatientForm, PatientFormData } from '@/components/clinical/patient-form';

export default function NewPatientPage({ params }: { params: { locale: string } }) {
  const router = useRouter();
  const showToast = useToast();
  const createMutation = useCreatePatient();

  const handleSubmit = async (data: PatientFormData) => {
    try {
      await createMutation.mutateAsync(data);

      showToast({
        title: 'Success',
        description: 'Patient registered successfully',
        variant: 'success',
      });

      router.push(`/${params.locale}/patients`);
    } catch (error: any) {
      console.error('Error creating patient:', error);
      showToast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to register patient',
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
