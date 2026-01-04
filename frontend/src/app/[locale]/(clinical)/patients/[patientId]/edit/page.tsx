'use client';

import { useRouter } from 'next/navigation';
import { usePatient, useUpdatePatient } from '@/modules/clinical/hooks/use-patients';
import { useToast } from '@/components/ui/use-toast';
import { LoadingSpinner } from '@/components/ui/loading';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import type { PatientFormData } from '@/components/clinical/patient-form';
import { PatientForm } from '@/components/clinical/patient-form';
import type { CreatePatientDto } from '@/modules/clinical/types/patient';

interface EditPatientPageProps {
  params: {
    locale: string;
    patientId: string;
  };
}

export default function EditPatientPage({ params }: EditPatientPageProps) {
  const router = useRouter();
  const publishToast = useToast();
  const { data: patient, isLoading, error } = usePatient(params.patientId);
  const updateMutation = useUpdatePatient();

  const handleSubmit = async (data: CreatePatientDto) => {
    try {
      await updateMutation.mutateAsync({
        id: params.patientId,
        data,
      });

      publishToast({
        title: 'Success',
        description: 'Patient updated successfully',
        variant: 'success',
      });

      router.push(`/${params.locale}/patients/${params.patientId}`);
    } catch (error: any) {
      console.error('Error updating patient:', error);
      publishToast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update patient',
        variant: 'destructive',
      });
    }
  };

  const handleCancel = () => {
    router.push(`/${params.locale}/patients/${params.patientId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" text="Loading patient details..." />
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/${params.locale}/patients`)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Patients
          </Button>
        </div>
        <Card className="border-red-500">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Patient Not Found</h3>
              <p className="text-muted-foreground mb-4">
                The patient you're trying to edit doesn't exist or you don't have permission to edit it.
              </p>
              <Button onClick={() => router.push(`/${params.locale}/patients`)}>
                Back to Patient List
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Format date to YYYY-MM-DD for input[type="date"]
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '';
    try {
      return dateString.split('T')[0]; // Get YYYY-MM-DD part
    } catch {
      return '';
    }
  };

  // Transform patient data to form format
  const initialData: Partial<PatientFormData> = {
    title: (patient as any).title || '',
    firstName: patient.firstName || '',
    middleName: patient.middleName || '',
    lastName: patient.lastName || '',
    dateOfBirth: formatDate(patient.dateOfBirth),
    gender: patient.gender,
    phoneNumber: patient.phoneNumber || '',
    email: patient.email || '',
    nationality: patient.nationality || '',
    nationalId: patient.nationalId || '',
    nationalIdType: patient.nationalIdType || '',
    passportNumber: patient.passportNumber || '',
    alternateContactNumber: patient.alternateContactNumber || '',
    address: patient.address || '',
    city: patient.city || '',
    state: patient.state || '',
    country: patient.country || '',
    postalCode: patient.postalCode || '',
    emergencyContactName: patient.emergencyContactName || '',
    emergencyContactNumber: patient.emergencyContactNumber || '',
    emergencyContactRelation: patient.emergencyContactRelation || '',
  };

  return (
    <PatientForm
      mode="edit"
      initialData={initialData}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isSubmitting={updateMutation.isPending}
      patientInfo={{
        firstName: patient.firstName,
        lastName: patient.lastName,
        mrn: patient.mrn,
      }}
      locale={params.locale}
    />
  );
}
