'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { getSession } from '@/lib/api/client';
import { useToast } from '@/components/ui/use-toast';
import { useStaffList } from '@/modules/foundation/hooks/use-staff';
import { useCreateUser } from '@/modules/foundation/hooks/use-user';
import type { CreateUserDTO } from '@/modules/foundation/types/user';

const userFormSchema = z.object({
  email: z.string().email('Enter a valid email'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  staffId: z.string().optional(),
});

type UserFormData = z.infer<typeof userFormSchema>;

export default function NewUserPage({ params }: { params: { locale: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const session = getSession();
  const tenantId = session.user?.tenantId;
  const [error, setError] = useState('');
  const { data: staffList = [], isLoading: isLoadingStaff } = useStaffList();
  const createUserMutation = useCreateUser();

  const staffOptions = useMemo(
    () =>
      staffList.map((staff) => ({
        id: staff.id,
        label: staff.displayName || `${staff.firstName} ${staff.lastName}`,
        meta: `${staff.employeeId || 'N/A'} · ${staff.staffType || 'staff'}`,
      })),
    [staffList],
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
  });

  const onSubmit = async (data: UserFormData) => {
    if (!tenantId) {
      setError('Tenant ID is missing. Please re-authenticate.');
      return;
    }

    setError('');
    const payload: CreateUserDTO = {
      tenantId,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      password: data.password,
      staffId: data.staffId || undefined,
    };

    try {
      const user = await createUserMutation.mutateAsync(payload);
      toast({
        title: 'User created',
        description: `${user.firstName} ${user.lastName} has been added.`,
      });
      router.push(`/${params.locale}/users/${user.id}`);
    } catch (err: any) {
      const message = err?.response?.data?.message || err.message || 'Failed to create user';
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
          onClick={() => router.push(`/${params.locale}/users`)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create User</CardTitle>
          <CardDescription>Set up a new user account and optional staff link.</CardDescription>
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
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input id="email" type="email" {...register('email')} />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="password">
                  Temporary Password <span className="text-red-500">*</span>
                </Label>
                <Input id="password" type="password" {...register('password')} />
                {errors.password && (
                  <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input id="firstName" {...register('firstName')} />
                {errors.firstName && (
                  <p className="text-sm text-red-500 mt-1">{errors.firstName.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="lastName">
                  Last Name <span className="text-red-500">*</span>
                </Label>
                <Input id="lastName" {...register('lastName')} />
                {errors.lastName && (
                  <p className="text-sm text-red-500 mt-1">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="staffId">Link Staff Profile</Label>
              <input type="hidden" {...register('staffId')} />
              <Select
                onValueChange={(value) => setValue('staffId', value === 'none' ? undefined : value)}
                disabled={isLoadingStaff}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a staff member (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No staff linked</SelectItem>
                  {staffOptions.map((staff) => (
                    <SelectItem key={staff.id} value={staff.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{staff.label}</span>
                        <span className="text-xs text-muted-foreground">{staff.meta}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={createUserMutation.isPending}>
                {createUserMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Create User
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/${params.locale}/users`)}
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
