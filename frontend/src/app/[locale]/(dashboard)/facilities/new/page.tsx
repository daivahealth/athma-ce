'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { getSession } from '@/lib/api/client';
import { useCreateFacility } from '@/modules/foundation/hooks/use-facility';
import type { CreateFacilityDTO } from '@/modules/foundation/types/facility';

const facilitySchema = z.object({
  name: z.string().min(2, 'Facility name is required').max(150),
  facilityType: z.string().optional(),
  code: z.string().optional(),
  licenseNumber: z.string().optional(),
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  emirate: z.string().optional(),
  postalCode: z.string().optional(),
  phoneNumber: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  website: z.string().optional(),
});

type FacilityFormData = z.infer<typeof facilitySchema>;

export default function NewFacilityPage({ params }: { params: { locale: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const session = getSession();
  const tenantId = session.user?.tenantId;
  const [error, setError] = useState('');
  const createFacilityMutation = useCreateFacility();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FacilityFormData>({
    resolver: zodResolver(facilitySchema),
  });

  const onSubmit = async (data: FacilityFormData) => {
    if (!tenantId) {
      setError('Tenant ID is missing. Please re-authenticate.');
      return;
    }

    setError('');
    const payload: CreateFacilityDTO = {
      tenantId,
      name: data.name.trim(),
      facilityType: data.facilityType?.trim() || undefined,
      code: data.code?.trim() || undefined,
      licenseNumber: data.licenseNumber?.trim() || undefined,
      addressLine1: data.addressLine1?.trim() || undefined,
      addressLine2: data.addressLine2?.trim() || undefined,
      city: data.city?.trim() || undefined,
      emirate: data.emirate?.trim() || undefined,
      postalCode: data.postalCode?.trim() || undefined,
      phoneNumber: data.phoneNumber?.trim() || undefined,
      email: data.email?.trim() || undefined,
      website: data.website?.trim() || undefined,
    };

    try {
      const facility = await createFacilityMutation.mutateAsync(payload);
      toast({
        title: 'Facility created',
        description: `${facility.name} has been added.`,
      });
      router.push(`/${params.locale}/facilities/${facility.id}`);
    } catch (err: any) {
      const message = err?.response?.data?.message || err.message || 'Failed to create facility';
      setError(message);
      toast({ title: 'Error', description: message, variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/${params.locale}/facilities`)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create Facility</CardTitle>
          <CardDescription>Enter the primary details for the new facility.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <p>{error}</p>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">
                  Facility Name <span className="text-red-500">*</span>
                </Label>
                <Input id="name" {...register('name')} />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="facilityType">Facility Type</Label>
                <Input id="facilityType" placeholder="clinic, hospital" {...register('facilityType')} />
              </div>
              <div>
                <Label htmlFor="code">Code</Label>
                <Input id="code" {...register('code')} />
              </div>
              <div>
                <Label htmlFor="licenseNumber">License Number</Label>
                <Input id="licenseNumber" {...register('licenseNumber')} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="addressLine1">Address Line 1</Label>
                <Input id="addressLine1" {...register('addressLine1')} />
              </div>
              <div>
                <Label htmlFor="addressLine2">Address Line 2</Label>
                <Input id="addressLine2" {...register('addressLine2')} />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" {...register('city')} />
              </div>
              <div>
                <Label htmlFor="emirate">Emirate</Label>
                <Input id="emirate" {...register('emirate')} />
              </div>
              <div>
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input id="postalCode" {...register('postalCode')} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input id="phoneNumber" {...register('phoneNumber')} />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register('email')} />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input id="website" {...register('website')} />
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={createFacilityMutation.isPending}>
                {createFacilityMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Create Facility
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/${params.locale}/facilities`)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
