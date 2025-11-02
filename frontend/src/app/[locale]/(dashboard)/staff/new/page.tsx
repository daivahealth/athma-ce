'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert } from '@/components/ui/alert';
import { staffService, type CreateStaffDTO } from '@/modules/foundation/services/staff-service';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const staffFormSchema = z.object({
  prefix: z.string().optional(),
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  middleName: z.string().optional(),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['male', 'female', 'other'], { required_error: 'Gender is required' }),
  phoneNumber: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  employeeId: z.string().min(1, 'Employee ID is required'),
  staffType: z.enum(['physician', 'nurse', 'technician', 'administrative', 'support'], {
    required_error: 'Staff type is required',
  }),
  licenseNumber: z.string().optional(),
  licenseExpiry: z.string().optional(),
  qualification: z.string().max(150).optional(),
  languages: z.string().optional(), // Comma-separated string
});

type StaffFormData = z.infer<typeof staffFormSchema>;

export default function NewStaffPage({ params }: { params: { locale: string } }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [error, setError] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StaffFormData>({
    resolver: zodResolver(staffFormSchema),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateStaffDTO) => staffService.create(data),
    onSuccess: (newStaff) => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      toast({
        title: 'Staff created successfully',
        description: `${newStaff.displayName || newStaff.firstName + ' ' + newStaff.lastName} has been added.`,
      });
      router.push(`/${params.locale}/staff/${newStaff.id}`);
    },
    onError: (err: any) => {
      const errorMessage = err?.response?.data?.message || err.message || 'Failed to create staff member';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: StaffFormData) => {
    setError('');

    // Convert languages from comma-separated string to array
    const languages = data.languages
      ? data.languages.split(',').map(lang => lang.trim()).filter(Boolean)
      : [];

    const payload: CreateStaffDTO = {
      ...data,
      email: data.email || undefined,
      phoneNumber: data.phoneNumber || undefined,
      languages: languages.length > 0 ? languages : undefined,
    };

    createMutation.mutate(payload);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/${params.locale}/staff`)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Breadcrumb
          items={[
            { href: `/${params.locale}/dashboard`, label: 'Dashboard' },
            { href: `/${params.locale}/staff`, label: 'Staff' },
            { href: `/${params.locale}/staff/new`, label: 'New Staff' },
          ]}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Staff Member</CardTitle>
          <CardDescription>
            Enter the details of the new staff member. Fields marked with * are required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {error && (
              <Alert variant="destructive">
                <p>{error}</p>
              </Alert>
            )}

            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="prefix">Prefix</Label>
                  <Input
                    id="prefix"
                    {...register('prefix')}
                    placeholder="Dr., Mr., Ms."
                  />
                  {errors.prefix && (
                    <p className="text-sm text-red-500 mt-1">{errors.prefix.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="firstName">
                    First Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    {...register('firstName')}
                    placeholder="Enter first name"
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-500 mt-1">{errors.firstName.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="lastName">
                    Last Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    {...register('lastName')}
                    placeholder="Enter last name"
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-500 mt-1">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="middleName">Middle Name</Label>
                  <Input
                    id="middleName"
                    {...register('middleName')}
                    placeholder="Enter middle name"
                  />
                </div>

                <div>
                  <Label htmlFor="employeeId">
                    Employee ID <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="employeeId"
                    {...register('employeeId')}
                    placeholder="EMP001"
                  />
                  {errors.employeeId && (
                    <p className="text-sm text-red-500 mt-1">{errors.employeeId.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="dateOfBirth">
                    Date of Birth <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    {...register('dateOfBirth')}
                  />
                  {errors.dateOfBirth && (
                    <p className="text-sm text-red-500 mt-1">{errors.dateOfBirth.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="gender">
                    Gender <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="gender"
                    {...register('gender')}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.gender && (
                    <p className="text-sm text-red-500 mt-1">{errors.gender.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="staffType">
                    Staff Type <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="staffType"
                    {...register('staffType')}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="">Select type</option>
                    <option value="physician">Physician</option>
                    <option value="nurse">Nurse</option>
                    <option value="technician">Technician</option>
                    <option value="administrative">Administrative</option>
                    <option value="support">Support</option>
                  </select>
                  {errors.staffType && (
                    <p className="text-sm text-red-500 mt-1">{errors.staffType.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    placeholder="email@example.com"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    {...register('phoneNumber')}
                    placeholder="+971-50-1234567"
                  />
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Professional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="qualification">Qualification</Label>
                  <Input
                    id="qualification"
                    {...register('qualification')}
                    placeholder="MBBS, MD Cardiology"
                    maxLength={150}
                  />
                </div>

                <div>
                  <Label htmlFor="languages">Languages</Label>
                  <Input
                    id="languages"
                    {...register('languages')}
                    placeholder="English, Arabic (comma-separated)"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter languages separated by commas
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="licenseNumber">License Number</Label>
                  <Input
                    id="licenseNumber"
                    {...register('licenseNumber')}
                    placeholder="DHA-12345"
                  />
                </div>

                <div>
                  <Label htmlFor="licenseExpiry">License Expiry</Label>
                  <Input
                    id="licenseExpiry"
                    type="date"
                    {...register('licenseExpiry')}
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-4 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/${params.locale}/staff`)}
                disabled={createMutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Create Staff Member
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
