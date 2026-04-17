'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Search, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { useCreateStock, useResolveMedication } from '@/modules/pharmacy/hooks/use-pharmacy-stock';
import { useMedications } from '@/modules/foundation/hooks/use-catalogs';
import type { Medication } from '@/modules/foundation/types/catalog';

const schema = z.object({
  // Hidden — set programmatically when a medication is selected
  medicationId: z.string().optional(),
  drugCode: z.string().min(1, 'Drug code is required'),
  drugName: z.string().min(1, 'Drug name is required'),
  genericName: z.string().optional(),
  dosageForm: z.string().min(1, 'Dosage form is required'),
  strength: z.string().optional(),
  unit: z.string().min(1, 'Unit is required'),
  billingItemId: z.string().optional(),
  // Batch-specific
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

  const [medicationSearch, setMedicationSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const [selectedMedicationId, setSelectedMedicationId] = useState<string | undefined>();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: medications = [], isFetching: searchingMedications } = useMedications(
    medicationSearch.length >= 2 ? { search: medicationSearch, isActive: true } : undefined,
  );

  const { data: resolvedBilling, isFetching: resolvingBilling } = useResolveMedication(selectedMedicationId);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function selectMedication(med: Medication) {
    setSelectedMedication(med);
    setSelectedMedicationId(med.id);
    setMedicationSearch(med.medicationName);
    setShowDropdown(false);

    // Auto-populate drug fields from catalog
    setValue('medicationId', med.id);
    setValue('drugCode', med.ndcCode ?? med.localCode ?? med.atcCode ?? '');
    setValue('drugName', med.medicationName);
    setValue('genericName', med.genericName ?? '');
    setValue('dosageForm', med.dosageForm);
    setValue('strength', med.strength ?? '');
  }

  function clearMedication() {
    setSelectedMedication(null);
    setSelectedMedicationId(undefined);
    setMedicationSearch('');
    setValue('medicationId', undefined);
    setValue('drugCode', '');
    setValue('drugName', '');
    setValue('genericName', '');
    setValue('dosageForm', '');
    setValue('strength', '');
    setValue('billingItemId', undefined);
  }

  // Sync resolved billing item into form
  useEffect(() => {
    if (resolvedBilling?.billingItemId) {
      setValue('billingItemId', resolvedBilling.billingItemId);
    }
  }, [resolvedBilling, setValue]);

  const onSubmit = async (data: FormData) => {
    await createStock.mutateAsync({
      ...data,
      billingItemId: resolvedBilling?.billingItemId ?? data.billingItemId,
    });
    router.push(`/${locale}/pharmacy/stock`);
  };

  const drugFieldsReadOnly = Boolean(selectedMedication);

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
        {/* Medication Picker */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Medication</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search / picker */}
            <div className="space-y-1" ref={dropdownRef}>
              <Label>Search Medication Catalog *</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  value={medicationSearch}
                  onChange={(e) => {
                    setMedicationSearch(e.target.value);
                    if (selectedMedication && e.target.value !== selectedMedication.medicationName) {
                      clearMedication();
                    }
                    setShowDropdown(e.target.value.length >= 2);
                  }}
                  onFocus={() => {
                    if (medicationSearch.length >= 2) setShowDropdown(true);
                  }}
                  placeholder="Type at least 2 characters to search…"
                  className="pl-8"
                />
                {searchingMedications && (
                  <Loader2 className="absolute right-2.5 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
                )}

                {showDropdown && medications.length > 0 && (
                  <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md max-h-60 overflow-y-auto">
                    {medications.map((med) => (
                      <button
                        key={med.id}
                        type="button"
                        className="w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground flex flex-col gap-0.5"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          selectMedication(med);
                        }}
                      >
                        <span className="font-medium">{med.medicationName}</span>
                        <span className="text-xs text-muted-foreground">
                          {[med.genericName, med.dosageForm, med.strength].filter(Boolean).join(' · ')}
                          {med.ndcCode && <span className="ml-2 font-mono">{med.ndcCode}</span>}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {showDropdown && !searchingMedications && medications.length === 0 && medicationSearch.length >= 2 && (
                  <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md px-3 py-2 text-sm text-muted-foreground">
                    No medications found for &ldquo;{medicationSearch}&rdquo;
                  </div>
                )}
              </div>
              {!selectedMedication && (
                <p className="text-xs text-muted-foreground">
                  Select from the catalog to auto-fill drug details and link a billing item.
                </p>
              )}
            </div>

            {/* Billing item badge — shown after medication is resolved */}
            {selectedMedication && (
              <div className="rounded-md border bg-muted/40 px-3 py-2 text-sm space-y-1">
                {resolvingBilling ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Resolving billing item…
                  </div>
                ) : resolvedBilling?.billingItemId ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-600 shrink-0" />
                    <span>
                      Billing item resolved:{' '}
                      <Badge variant="outline" className="font-mono text-xs">
                        {resolvedBilling.billingCode ?? resolvedBilling.billingItemId.slice(0, 8)}
                      </Badge>
                      {resolvedBilling.billingDescription && (
                        <span className="ml-1 text-muted-foreground">{resolvedBilling.billingDescription}</span>
                      )}
                      {resolvedBilling.listPrice != null && (
                        <span className="ml-2 font-medium">AED {resolvedBilling.listPrice.toFixed(2)}</span>
                      )}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-amber-600">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    No billing item mapped for this medication. Stock will be created without a billing link.
                  </div>
                )}
              </div>
            )}

            {/* Auto-populated drug fields (read-only when medication is selected) */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Drug Code {!drugFieldsReadOnly && '*'}</Label>
                <Input
                  {...register('drugCode')}
                  placeholder="NDC or local code"
                  readOnly={drugFieldsReadOnly}
                  className={drugFieldsReadOnly ? 'bg-muted text-muted-foreground cursor-default' : ''}
                />
                {errors.drugCode && <p className="text-xs text-destructive">{errors.drugCode.message}</p>}
              </div>
              <div className="space-y-1">
                <Label>Dosage Form {!drugFieldsReadOnly && '*'}</Label>
                <Input
                  {...register('dosageForm')}
                  placeholder="tablet, capsule, injection…"
                  readOnly={drugFieldsReadOnly}
                  className={drugFieldsReadOnly ? 'bg-muted text-muted-foreground cursor-default' : ''}
                />
                {errors.dosageForm && <p className="text-xs text-destructive">{errors.dosageForm.message}</p>}
              </div>
              <div className="space-y-1 col-span-2">
                <Label>Drug Name {!drugFieldsReadOnly && '*'}</Label>
                <Input
                  {...register('drugName')}
                  placeholder="e.g. Amoxicillin 500mg Capsules"
                  readOnly={drugFieldsReadOnly}
                  className={drugFieldsReadOnly ? 'bg-muted text-muted-foreground cursor-default' : ''}
                />
                {errors.drugName && <p className="text-xs text-destructive">{errors.drugName.message}</p>}
              </div>
              <div className="space-y-1">
                <Label>Generic Name</Label>
                <Input
                  {...register('genericName')}
                  placeholder="e.g. Amoxicillin"
                  readOnly={drugFieldsReadOnly}
                  className={drugFieldsReadOnly ? 'bg-muted text-muted-foreground cursor-default' : ''}
                />
              </div>
              <div className="space-y-1">
                <Label>Strength</Label>
                <Input
                  {...register('strength')}
                  placeholder="e.g. 500mg, 10mg/ml"
                  readOnly={drugFieldsReadOnly}
                  className={drugFieldsReadOnly ? 'bg-muted text-muted-foreground cursor-default' : ''}
                />
              </div>
              <div className="space-y-1">
                <Label>Unit *</Label>
                <Input {...register('unit')} placeholder="tablets, vials, bottles…" />
                {errors.unit && <p className="text-xs text-destructive">{errors.unit.message}</p>}
              </div>
            </div>

            {drugFieldsReadOnly && (
              <p className="text-xs text-muted-foreground">
                Drug fields are auto-filled from the catalog.{' '}
                <button type="button" className="underline text-primary" onClick={clearMedication}>
                  Clear selection
                </button>{' '}
                to enter manually.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Batch Details */}
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
