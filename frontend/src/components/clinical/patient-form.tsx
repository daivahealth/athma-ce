'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save } from 'lucide-react';
import { useRegistrationDefaults } from '@/modules/clinical/hooks/use-patients';
import { useCountries, useNationalities } from '@/modules/foundation/hooks/use-valuesets';

const patientSchema = z.object({
  // Required fields
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['male', 'female', 'other'], {
    required_error: 'Gender is required',
  }),
  phoneNumber: z.string().min(10, 'Valid phone number is required'),

  // Optional fields
  middleName: z.string().optional(),
  nationality: z.string().optional(),
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
});

export type PatientFormData = z.infer<typeof patientSchema>;

interface PatientFormProps {
  mode: 'create' | 'edit';
  initialData?: Partial<PatientFormData>;
  onSubmit: (data: PatientFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
  patientInfo?: {
    firstName?: string;
    lastName?: string;
    mrn?: string;
  };
  locale: string;
}

export function PatientForm({
  mode,
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
  patientInfo,
  locale,
}: PatientFormProps) {
  const form = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      firstName: '',
      middleName: '',
      lastName: '',
      dateOfBirth: '',
      gender: 'male',
      phoneNumber: '',
      email: '',
      nationality: '',
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
    },
  });

  // Fetch registration defaults for create mode
  const { data: registrationDefaults } = useRegistrationDefaults();

  // Fetch countries from valueset API using the current locale language
  const language = locale.split('-')[0] || 'en';
  const { data: countriesData, isLoading: isLoadingCountries } = useCountries(language);

  // Fetch nationalities from valueset API
  const { data: nationalitiesData, isLoading: isLoadingNationalities } = useNationalities(language);

  // Populate form with registration defaults when in create mode
  useEffect(() => {
    if (mode === 'create' && registrationDefaults) {
      form.setValue('country', registrationDefaults.country.isoCode);
      form.setValue('city', registrationDefaults.city);
      form.setValue('nationality', registrationDefaults.nationality.isoCode);
    }
  }, [mode, registrationDefaults, form]);

  // Populate form with initial data when in edit mode
  useEffect(() => {
    if (initialData) {
      form.reset(initialData as any);
    }
  }, [initialData, form]);

  const handleSubmit = async (data: PatientFormData) => {
    const cleanedData = {
      ...data,
      // Convert empty strings to undefined for optional fields
      middleName: data.middleName || undefined,
      email: data.email || undefined,
      nationality: data.nationality || undefined,
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
    };

    await onSubmit(cleanedData as PatientFormData);
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={onCancel}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {mode === 'create' ? 'Register New Patient' : 'Edit Patient'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {mode === 'create'
              ? 'Enter patient information to create a new record'
              : `Update patient information for ${patientInfo?.firstName} ${patientInfo?.lastName}${patientInfo?.mrn ? ` (MRN: ${patientInfo.mrn})` : ''}`}
          </p>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <Label htmlFor="phoneNumber">Phone Number *</Label>
                <Input
                  id="phoneNumber"
                  {...form.register('phoneNumber')}
                  className={form.formState.errors.phoneNumber ? 'border-destructive' : ''}
                />
                {form.formState.errors.phoneNumber && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.phoneNumber.message}
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
                <select
                  id="country"
                  {...form.register('country')}
                  disabled={isLoadingCountries}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">{isLoadingCountries ? 'Loading countries...' : 'Select country'}</option>
                  {countriesData?.concepts.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.display}
                    </option>
                  ))}
                </select>
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
                <select
                  id="nationality"
                  {...form.register('nationality')}
                  disabled={isLoadingNationalities}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">{isLoadingNationalities ? 'Loading nationalities...' : 'Select nationality'}</option>
                  {nationalitiesData?.concepts.map((nationality) => (
                    <option key={nationality.code} value={nationality.code}>
                      {nationality.display}
                    </option>
                  ))}
                </select>
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

        {/* Actions */}
        <div className="flex gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            {isSubmitting ? 'Saving...' : mode === 'create' ? 'Save Patient' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}
