'use client';

import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { useCreateStock } from '@/modules/pharmacy/hooks/use-pharmacy-stock';

const schema = z.object({
  drugCode: z.string().min(1, 'Drug code is required'),
  codeSystem: z.string().default('NDC'),
  drugName: z.string().min(1, 'Drug name is required'),
  genericName: z.string().optional(),
  dosageForm: z.string().min(1, 'Dosage form is required'),
  strength: z.string().optional(),
  unit: z.string().min(1, 'Unit is required'),
  batchNumber: z.string().min(1, 'Batch number is required'),
  manufacturer: z.string().optional(),
  expiryDate: z.string().min(1, 'Expiry date is required'),
  quantityReceived: z.coerce.number().positive('Quantity must be positive'),
  reorderLevel: z.coerce.number().min(0).optional(),
  storageLocation: z.string().optional(),
  unitCostPrice: z.coerce.number().min(0).optional(),
});

type FormData = z.infer<typeof schema>;

export default function NewStockPage() {
  const params = useParams();
  const locale = params.locale as string;
  const router = useRouter();
  const createStock = useCreateStock();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    await createStock.mutateAsync(data);
    router.push(`/${locale}/pharmacy/stock`);
  };

  return (
    <div className="max-w-2xl space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <h2 className="text-lg font-semibold">Receive Stock Batch</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Drug Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Drug Code *</Label>
              <Input {...register('drugCode')} placeholder="NDC or local code" />
              {errors.drugCode && <p className="text-xs text-destructive">{errors.drugCode.message}</p>}
            </div>
            <div className="space-y-1">
              <Label>Code System</Label>
              <Select defaultValue="NDC" onValueChange={(v) => setValue('codeSystem', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NDC">NDC</SelectItem>
                  <SelectItem value="RXNORM">RxNorm</SelectItem>
                  <SelectItem value="LOCAL">Local</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1 col-span-2">
              <Label>Drug Name (English) *</Label>
              <Input {...register('drugName')} placeholder="e.g. Amoxicillin 500mg Capsules" />
              {errors.drugName && <p className="text-xs text-destructive">{errors.drugName.message}</p>}
            </div>
            <div className="space-y-1">
              <Label>Generic Name</Label>
              <Input {...register('genericName')} placeholder="e.g. Amoxicillin" />
            </div>
            <div className="space-y-1">
              <Label>Dosage Form *</Label>
              <Input {...register('dosageForm')} placeholder="tablet, capsule, injection..." />
              {errors.dosageForm && <p className="text-xs text-destructive">{errors.dosageForm.message}</p>}
            </div>
            <div className="space-y-1">
              <Label>Strength</Label>
              <Input {...register('strength')} placeholder="e.g. 500mg, 10mg/ml" />
            </div>
            <div className="space-y-1">
              <Label>Unit *</Label>
              <Input {...register('unit')} placeholder="tablets, vials, bottles..." />
              {errors.unit && <p className="text-xs text-destructive">{errors.unit.message}</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Batch Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Batch Number *</Label>
              <Input {...register('batchNumber')} />
              {errors.batchNumber && <p className="text-xs text-destructive">{errors.batchNumber.message}</p>}
            </div>
            <div className="space-y-1">
              <Label>Manufacturer</Label>
              <Input {...register('manufacturer')} />
            </div>
            <div className="space-y-1">
              <Label>Expiry Date *</Label>
              <Input {...register('expiryDate')} type="date" />
              {errors.expiryDate && <p className="text-xs text-destructive">{errors.expiryDate.message}</p>}
            </div>
            <div className="space-y-1">
              <Label>Quantity Received *</Label>
              <Input {...register('quantityReceived')} type="number" min="0.001" step="0.001" />
              {errors.quantityReceived && <p className="text-xs text-destructive">{errors.quantityReceived.message}</p>}
            </div>
            <div className="space-y-1">
              <Label>Reorder Level</Label>
              <Input {...register('reorderLevel')} type="number" min="0" step="1" placeholder="Trigger low-stock alert" />
            </div>
            <div className="space-y-1">
              <Label>Storage Location</Label>
              <Input {...register('storageLocation')} placeholder="e.g. Fridge-A, Shelf-3B" />
            </div>
            <div className="space-y-1">
              <Label>Unit Cost Price (AED)</Label>
              <Input {...register('unitCostPrice')} type="number" min="0" step="0.01" />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" disabled={isSubmitting || createStock.isPending}>
            {createStock.isPending ? 'Saving...' : 'Receive Stock'}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
