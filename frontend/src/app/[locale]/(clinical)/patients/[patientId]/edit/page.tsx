'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { usePatient, useUpdatePatient } from '@/modules/clinical/hooks/use-patients';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { LoadingSpinner } from '@/components/ui/loading';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';

const patientSchema = z.object({
  // Required fields
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['male', 'female', 'other'], {
    required_error: 'Gender is required',
  }),
  contactNumber: z.string().min(10, 'Valid contact number is required'),

  // Optional fields
  middleName: z.string().optional(),
  nationality: z.string().optional(),
  bloodGroup: z.string().optional(),
  nationalId: z.string().optional(),
  nationalIdType: z.string().optional(),
  passportNumber: z.string().optional(),
  alternateContactNumber: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  postalCode: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactNumber: z.string().optional(),
  emergencyContactRelation: z.string().optional(),
  allergies: z.string().optional(),
  chronicConditions: z.string().optional(),
  currentMedications: z.string().optional(),
  insuranceProvider: z.string().optional(),
  insurancePolicyNumber: z.string().optional(),
  insuranceExpiryDate: z.string().optional(),
});

type PatientFormData = z.infer<typeof patientSchema>;

interface EditPatientPageProps {
  params: {
    locale: string;
    patientId: string;
  };
}

export default function EditPatientPage({ params }: EditPatientPageProps) {
  const router = useRouter();
  const showToast = useToast();
  const { data: patient, isLoading, error } = usePatient(params.patientId);
  const updateMutation = useUpdatePatient();

  const form = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      firstName: '',
      middleName: '',
      lastName: '',
      dateOfBirth: '',
      gender: 'male',
      contactNumber: '',
      email: '',
      nationality: '',
      bloodGroup: '',
      nationalId: '',
      nationalIdType: '',
      passportNumber: '',
      alternateContactNumber: '',
      address: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
      emergencyContactName: '',
      emergencyContactNumber: '',
      emergencyContactRelation: '',
      allergies: '',
      chronicConditions: '',
      currentMedications: '',
      insuranceProvider: '',
      insurancePolicyNumber: '',
      insuranceExpiryDate: '',
    },
  });

  // Populate form when patient data is loaded
  useEffect(() => {
    if (patient) {
      // Format date to YYYY-MM-DD for input[type="date"]
      const formatDate = (dateString: string | null | undefined) => {
        if (!dateString) return '';
        try {
          return dateString.split('T')[0]; // Get YYYY-MM-DD part
        } catch {
          return '';
        }
      };

      form.reset({
        firstName: patient.firstName || '',
        middleName: patient.middleName || '',
        lastName: patient.lastName || '',
        dateOfBirth: formatDate(patient.dateOfBirth),
        gender: patient.gender,
        contactNumber: patient.contactNumber || '',
        email: patient.email || '',
        nationality: patient.nationality || '',
        bloodGroup: patient.bloodGroup || '',
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
        allergies: patient.allergies || '',
        chronicConditions: patient.chronicConditions || '',
        currentMedications: patient.currentMedications || '',
        insuranceProvider: patient.insuranceProvider || '',
        insurancePolicyNumber: patient.insurancePolicyNumber || '',
        insuranceExpiryDate: formatDate(patient.insuranceExpiryDate),
      });
    }
  }, [patient, form]);

  const onSubmit = async (data: PatientFormData) => {
    try {
      const cleanedData = {
        ...data,
        // Convert empty strings to undefined for optional fields
        middleName: data.middleName || undefined,
        email: data.email || undefined,
        nationality: data.nationality || undefined,
        bloodGroup: data.bloodGroup || undefined,
        nationalId: data.nationalId || undefined,
        nationalIdType: data.nationalIdType || undefined,
        passportNumber: data.passportNumber || undefined,
        alternateContactNumber: data.alternateContactNumber || undefined,
        address: data.address || undefined,
        city: data.city || undefined,
        state: data.state || undefined,
        country: data.country || undefined,
        postalCode: data.postalCode || undefined,
        emergencyContactName: data.emergencyContactName || undefined,
        emergencyContactNumber: data.emergencyContactNumber || undefined,
        emergencyContactRelation: data.emergencyContactRelation || undefined,
        allergies: data.allergies || undefined,
        chronicConditions: data.chronicConditions || undefined,
        currentMedications: data.currentMedications || undefined,
        insuranceProvider: data.insuranceProvider || undefined,
        insurancePolicyNumber: data.insurancePolicyNumber || undefined,
        insuranceExpiryDate: data.insuranceExpiryDate || undefined,
      };

      await updateMutation.mutateAsync({
        id: params.patientId,
        data: cleanedData,
      });

      showToast({
        title: 'Success',
        description: 'Patient updated successfully',
        variant: 'success',
      });

      router.push(`/${params.locale}/patients/${params.patientId}`);
    } catch (error: any) {
      console.error('Error updating patient:', error);
      showToast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update patient',
        variant: 'destructive',
      });
    }
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

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(`/${params.locale}/patients/${params.patientId}`)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Patient</h1>
          <p className="text-muted-foreground mt-1">
            Update patient information for {patient.firstName} {patient.lastName} (MRN: {patient.mrn})
          </p>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Basic patient details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  {...form.register('firstName')}
                  className={form.formState.errors.firstName ? 'border-destructive' : ''}
                />
                {form.formState.errors.firstName && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.firstName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="middleName">Middle Name</Label>
                <Input id="middleName" {...form.register('middleName')} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  {...form.register('lastName')}
                  className={form.formState.errors.lastName ? 'border-destructive' : ''}
                />
                {form.formState.errors.lastName && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  {...form.register('dateOfBirth')}
                  className={form.formState.errors.dateOfBirth ? 'border-destructive' : ''}
                />
                {form.formState.errors.dateOfBirth && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.dateOfBirth.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <select
                  id="gender"
                  {...form.register('gender')}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bloodGroup">Blood Group</Label>
                <select
                  id="bloodGroup"
                  {...form.register('bloodGroup')}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select...</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactNumber">Contact Number *</Label>
                <Input
                  id="contactNumber"
                  {...form.register('contactNumber')}
                  className={form.formState.errors.contactNumber ? 'border-destructive' : ''}
                />
                {form.formState.errors.contactNumber && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.contactNumber.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="alternateContactNumber">Alternate Contact</Label>
                <Input id="alternateContactNumber" {...form.register('alternateContactNumber')} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...form.register('email')}
                  className={form.formState.errors.email ? 'border-destructive' : ''}
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea id="address" {...form.register('address')} rows={2} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" {...form.register('city')} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input id="state" {...form.register('state')} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input id="country" {...form.register('country')} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input id="postalCode" {...form.register('postalCode')} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Identity */}
        <Card>
          <CardHeader>
            <CardTitle>Identity Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nationality">Nationality</Label>
                <Input id="nationality" {...form.register('nationality')} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nationalId">National ID</Label>
                <Input id="nationalId" {...form.register('nationalId')} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="passportNumber">Passport Number</Label>
                <Input id="passportNumber" {...form.register('passportNumber')} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card>
          <CardHeader>
            <CardTitle>Emergency Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyContactName">Name</Label>
                <Input id="emergencyContactName" {...form.register('emergencyContactName')} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyContactNumber">Contact Number</Label>
                <Input id="emergencyContactNumber" {...form.register('emergencyContactNumber')} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyContactRelation">Relation</Label>
                <Input id="emergencyContactRelation" {...form.register('emergencyContactRelation')} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Medical Information */}
        <Card>
          <CardHeader>
            <CardTitle>Medical Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="allergies">Allergies</Label>
              <Textarea id="allergies" {...form.register('allergies')} rows={2} placeholder="List any known allergies..." />
            </div>

            <div className="space-y-2">
              <Label htmlFor="chronicConditions">Chronic Conditions</Label>
              <Textarea id="chronicConditions" {...form.register('chronicConditions')} rows={2} placeholder="List any chronic conditions..." />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentMedications">Current Medications</Label>
              <Textarea id="currentMedications" {...form.register('currentMedications')} rows={2} placeholder="List current medications..." />
            </div>
          </CardContent>
        </Card>

        {/* Insurance */}
        <Card>
          <CardHeader>
            <CardTitle>Insurance Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="insuranceProvider">Insurance Provider</Label>
                <Input id="insuranceProvider" {...form.register('insuranceProvider')} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="insurancePolicyNumber">Policy Number</Label>
                <Input id="insurancePolicyNumber" {...form.register('insurancePolicyNumber')} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="insuranceExpiryDate">Expiry Date</Label>
                <Input id="insuranceExpiryDate" type="date" {...form.register('insuranceExpiryDate')} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/${params.locale}/patients/${params.patientId}`)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={updateMutation.isPending}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}
