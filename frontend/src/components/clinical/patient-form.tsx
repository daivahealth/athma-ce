'use client';

import { useEffect, type ReactNode } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Fingerprint, IdCard, Phone, Save, Siren, UserCog, UserPlus, type LucideIcon } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { cn } from '@/lib/utils';
import { useRegistrationDefaults } from '@/modules/clinical/hooks/use-patients';
import { useCountries, useNationalities, useNameTitles } from '@/modules/clinical/hooks/use-valuesets';
import type { CreatePatientDto } from '@/modules/clinical/types/patient';

const patientSchema = z.object({
  // Required fields
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['male', 'female', 'other'], {
    error: 'Gender is required',
  }),
  phoneNumber: z.string().min(10, 'Valid phone number is required'),

  // Optional fields
  title: z.string().optional(),
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
  onSubmit: (data: CreatePatientDto) => Promise<void>;
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
      title: undefined,
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

  // Fetch valuesets from API using the current locale language
  const language = locale.split('-')[0] || 'en';
  const { data: countriesData, isLoading: isLoadingCountries } = useCountries(language);
  const { data: nationalitiesData, isLoading: isLoadingNationalities } = useNationalities(language);
  const { data: nameTitlesData, isLoading: isLoadingNameTitles } = useNameTitles(language);

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
      form.reset(initialData);
    }
  }, [initialData, form]);

  const handleSubmit = async (data: PatientFormData) => {
    const payload: CreatePatientDto = {
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      dateOfBirth: data.dateOfBirth,
      gender: data.gender as 'male' | 'female' | 'other',
      phoneNumber: data.phoneNumber.trim(),
    };

    // Add title - use display value from valueset instead of code
    if (data.title && data.title.trim().length > 0) {
      const titleCode = data.title.trim();
      const titleConcept = nameTitlesData?.concepts?.find((t) => t.code === titleCode);
      payload.title = titleConcept?.display || titleCode;
    }

    const optionalString = (value?: string) => (value && value.trim().length > 0 ? value.trim() : undefined);

    const optionalFields: Array<[keyof CreatePatientDto, string | undefined]> = [
      ['middleName', optionalString(data.middleName)],
      ['nationality', optionalString(data.nationality)],
      ['nationalId', optionalString(data.nationalId)],
      ['nationalIdType', optionalString(data.nationalIdType)],
      ['passportNumber', optionalString(data.passportNumber)],
      ['preferredLanguage', optionalString((data as PatientFormData & { preferredLanguage?: string }).preferredLanguage)],
      ['alternateContactNumber', optionalString(data.alternateContactNumber)],
      ['email', optionalString(data.email)],
      ['address', optionalString(data.address)],
      ['city', optionalString(data.city)],
      ['state', optionalString(data.state)],
      ['country', optionalString(data.country)],
      ['postalCode', optionalString(data.postalCode)],
      ['emergencyContactName', optionalString(data.emergencyContactName)],
      ['emergencyContactNumber', optionalString(data.emergencyContactNumber)],
      ['emergencyContactRelation', optionalString(data.emergencyContactRelation)],
    ];

    optionalFields.forEach(([key, value]) => {
      if (value !== undefined) {
        (payload as unknown as Record<string, unknown>)[key] = value;
      }
    });

    await onSubmit(payload);
  };

  const { errors } = form.formState;
  const patientsHref = `/${locale}/patients`;
  const patientName = [patientInfo?.firstName, patientInfo?.lastName].filter(Boolean).join(' ');

  return (
    <div className="space-y-6 page-transition">
      <PageHeader
        title={mode === 'create' ? 'Register New Patient' : 'Edit Patient'}
        subtitle={
          mode === 'create'
            ? 'Enter patient information to create a new record'
            : `Update patient information for ${patientName}${patientInfo?.mrn ? ` (MRN: ${patientInfo.mrn})` : ''}`
        }
        icon={mode === 'create' ? UserPlus : UserCog}
        breadcrumb={
          <Breadcrumb
            items={[
              { href: patientsHref, label: 'Patients' },
              { label: mode === 'create' ? 'Register' : patientName || 'Edit' },
            ]}
          />
        }
      />

      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormSection icon={IdCard} title="Personal Information" description="Basic patient details">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Field id="title" label="Title">
              <Controller
                name="title"
                control={form.control}
                render={({ field }) => (
                  <Select
                    value={field.value || undefined}
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                    disabled={isLoadingNameTitles}
                  >
                    <SelectTrigger id="title" className={FIELD_CONTROL}>
                      <SelectValue placeholder="Select title (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {nameTitlesData?.concepts?.map((title) => (
                        <SelectItem key={title.code} value={title.code}>
                          {title.display}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>

            <Field id="firstName" label="First Name" required error={errors.firstName?.message}>
              <Input
                id="firstName"
                autoComplete="given-name"
                {...form.register('firstName')}
                {...invalidProps('firstName', errors.firstName?.message)}
              />
            </Field>

            <Field id="middleName" label="Middle Name">
              <Input id="middleName" autoComplete="additional-name" {...form.register('middleName')} />
            </Field>

            <Field id="lastName" label="Last Name" required error={errors.lastName?.message}>
              <Input
                id="lastName"
                autoComplete="family-name"
                {...form.register('lastName')}
                {...invalidProps('lastName', errors.lastName?.message)}
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field id="dateOfBirth" label="Date of Birth" required error={errors.dateOfBirth?.message}>
              <Input
                id="dateOfBirth"
                type="date"
                {...form.register('dateOfBirth')}
                {...invalidProps('dateOfBirth', errors.dateOfBirth?.message, FIELD_CONTROL)}
              />
            </Field>

            <Field id="gender" label="Gender" required error={errors.gender?.message}>
              <select
                id="gender"
                {...form.register('gender')}
                {...invalidProps('gender', errors.gender?.message, NATIVE_SELECT)}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </Field>
          </div>
        </FormSection>

        <FormSection icon={Phone} title="Contact Information" description="How to reach the patient">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field id="phoneNumber" label="Phone Number" required error={errors.phoneNumber?.message}>
              <Input
                id="phoneNumber"
                type="tel"
                autoComplete="tel"
                {...form.register('phoneNumber')}
                {...invalidProps('phoneNumber', errors.phoneNumber?.message)}
              />
            </Field>

            <Field id="alternateContactNumber" label="Alternate Contact">
              <Input id="alternateContactNumber" type="tel" {...form.register('alternateContactNumber')} />
            </Field>

            <Field id="email" label="Email" error={errors.email?.message}>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                {...form.register('email')}
                {...invalidProps('email', errors.email?.message)}
              />
            </Field>
          </div>

          <Field id="address" label="Address">
            <Textarea id="address" autoComplete="street-address" {...form.register('address')} rows={2} />
          </Field>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Field id="city" label="City">
              <Input id="city" autoComplete="address-level2" {...form.register('city')} />
            </Field>

            <Field id="state" label="State">
              <Input id="state" autoComplete="address-level1" {...form.register('state')} />
            </Field>

            <Field id="country" label="Country">
              <select id="country" {...form.register('country')} disabled={isLoadingCountries} className={NATIVE_SELECT}>
                <option value="">{isLoadingCountries ? 'Loading countries...' : 'Select country'}</option>
                {countriesData?.concepts.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.display}
                  </option>
                ))}
              </select>
            </Field>

            <Field id="postalCode" label="Postal Code">
              <Input id="postalCode" autoComplete="postal-code" {...form.register('postalCode')} />
            </Field>
          </div>
        </FormSection>

        <FormSection icon={Fingerprint} title="Identity Information" description="Nationality and identity documents">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field id="nationality" label="Nationality">
              <select
                id="nationality"
                {...form.register('nationality')}
                disabled={isLoadingNationalities}
                className={NATIVE_SELECT}
              >
                <option value="">{isLoadingNationalities ? 'Loading nationalities...' : 'Select nationality'}</option>
                {nationalitiesData?.concepts.map((nationality) => (
                  <option key={nationality.code} value={nationality.code}>
                    {nationality.display}
                  </option>
                ))}
              </select>
            </Field>

            <Field id="nationalId" label="National ID">
              <Input id="nationalId" {...form.register('nationalId')} />
            </Field>

            <Field id="passportNumber" label="Passport Number">
              <Input id="passportNumber" {...form.register('passportNumber')} />
            </Field>
          </div>
        </FormSection>

        <FormSection icon={Siren} title="Emergency Contact" description="Who to call on the patient's behalf">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field id="emergencyContactName" label="Name">
              <Input id="emergencyContactName" {...form.register('emergencyContactName')} />
            </Field>

            <Field id="emergencyContactNumber" label="Contact Number">
              <Input id="emergencyContactNumber" type="tel" {...form.register('emergencyContactNumber')} />
            </Field>

            <Field id="emergencyContactRelation" label="Relation">
              <Input id="emergencyContactRelation" {...form.register('emergencyContactRelation')} />
            </Field>
          </div>
        </FormSection>

        <div className="flex flex-col-reverse gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            Fields marked <span className="text-destructive">*</span> are required.
          </p>
          <div className="flex flex-col-reverse gap-2 sm:flex-row">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              <Save className="h-4 w-4" />
              {isSubmitting ? 'Saving...' : mode === 'create' ? 'Save Patient' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

/**
 * Shared control sizing. `dark:[color-scheme:dark]` makes the browser draw the
 * native date picker and option list dark when the app (not the OS) is dark.
 */
const FIELD_CONTROL = 'dark:[color-scheme:dark]';

/** Native <select> drawn like `SelectTrigger`/`Input` from `components/ui`. */
const NATIVE_SELECT = cn(
  'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-all',
  'hover:border-ring/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  'disabled:cursor-not-allowed disabled:opacity-50',
  FIELD_CONTROL,
);

/** aria + destructive styling for a control whose field failed validation. */
function invalidProps(id: string, error: string | undefined, className?: string) {
  return {
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? `${id}-error` : undefined,
    className: cn(className, error && 'border-destructive focus-visible:ring-destructive hover:border-destructive'),
  };
}

function FormSection({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <Card className="hover:translate-y-0">
      <CardHeader className="flex-row items-start gap-3 space-y-0 pb-4">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-4 w-4" aria-hidden />
        </span>
        <div className="space-y-1">
          <CardTitle className="text-base">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}

function Field({
  id,
  label,
  required,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className={cn(error && 'text-destructive')}>
        {label}
        {required && (
          <span className="ml-0.5 text-destructive">
            *
          </span>
        )}
      </Label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-sm font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
