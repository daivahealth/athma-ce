'use client';

import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useTransferPatient } from '@/modules/clinical/hooks/use-inpatient';
import { TransferType, type TransferPatientInput } from '@/modules/clinical/types/inpatient';

const transferSchema = z.object({
  toWardId: z.string().uuid('Ward ID must be a UUID'),
  toBedId: z.string().uuid('Bed ID must be a UUID'),
  transferReason: z.string().min(1, 'Transfer reason is required'),
  transferType: z.nativeEnum(TransferType),
  notes: z.string().optional(),
});

type TransferFormValues = z.infer<typeof transferSchema>;

export default function TransferPage({ params }: { params: { locale: string; id: string } }) {
  const { toast } = useToast();
  const transferPatient = useTransferPatient(params.id);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TransferFormValues>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      transferType: TransferType.CLINICAL_NEED,
    },
  });

  const onSubmit = async (values: TransferFormValues) => {
    const payload: TransferPatientInput = {
      toWardId: values.toWardId.trim(),
      toBedId: values.toBedId.trim(),
      transferReason: values.transferReason.trim(),
      transferType: values.transferType,
      notes: values.notes?.trim() || undefined,
    };

    try {
      await transferPatient.mutateAsync(payload);
      toast({ title: 'Transfer completed', description: 'Patient moved successfully.', variant: 'success' });
    } catch (error: any) {
      const message = error?.response?.data?.message ?? 'Failed to transfer patient.';
      toast({ title: 'Transfer failed', description: message, variant: 'destructive' });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transfer Patient</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="toWardId">To Ward ID *</Label>
              <Input id="toWardId" {...register('toWardId')} />
              {errors.toWardId && <p className="text-sm text-destructive">{errors.toWardId.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="toBedId">To Bed ID *</Label>
              <Input id="toBedId" {...register('toBedId')} />
              {errors.toBedId && <p className="text-sm text-destructive">{errors.toBedId.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Transfer Type *</Label>
              <Controller
                control={control}
                name="transferType"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select transfer type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(TransferType).map((value) => (
                        <SelectItem key={value} value={value}>
                          {value.replace(/_/g, ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="transferReason">Transfer Reason *</Label>
              <Textarea id="transferReason" rows={3} {...register('transferReason')} />
              {errors.transferReason && (
                <p className="text-sm text-destructive">{errors.transferReason.message}</p>
              )}
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" rows={3} {...register('notes')} />
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting || transferPatient.isPending}>
              {transferPatient.isPending ? 'Transferring...' : 'Transfer Patient'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
