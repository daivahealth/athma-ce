'use client';

import { useParams, useRouter } from 'next/navigation';
import { Info, ListOrdered, Search, Table2 } from 'lucide-react';
import { format } from 'date-fns';

import { PageHeader } from '@/components/ui/page-header';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { FormSection } from '@/components/forms/form-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { FeeScheduleForm } from '@/modules/rcm/components/fee-schedule-form';
import { FeeScheduleItemForm } from '@/modules/rcm/components/fee-schedule-item-form';
import {
  useFeeSchedule,
  useFeeScheduleItems,
  useUpdateFeeSchedule,
  useCreateFeeScheduleItem,
  useUpdateFeeScheduleItem,
  useDeleteFeeScheduleItem,
  useFeeSchedulePriceLookup,
} from '@/modules/rcm/hooks/use-fee-schedules';
import type {
  CreateFeeScheduleInput,
  CreateFeeScheduleItemInput,
} from '@/modules/rcm/types/fee-schedule';
import { FeeScheduleCodeType } from '@/modules/rcm/types/fee-schedule';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useState } from 'react';

const toLabel = (value: string) =>
  value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

export default function FeeScheduleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const scheduleId = params.id as string;
  const toast = useToast();

  const { data: feeSchedule, isLoading, error } = useFeeSchedule(scheduleId);
  const { data: items, isLoading: isItemsLoading } = useFeeScheduleItems(scheduleId);
  const updateSchedule = useUpdateFeeSchedule();
  const createItem = useCreateFeeScheduleItem(scheduleId);
  const updateItem = useUpdateFeeScheduleItem(scheduleId);
  const deleteItem = useDeleteFeeScheduleItem(scheduleId);
  const priceLookup = useFeeSchedulePriceLookup();

  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [lookupCode, setLookupCode] = useState('');
  const [lookupCodeType, setLookupCodeType] = useState<FeeScheduleCodeType>(
    FeeScheduleCodeType.CPT,
  );
  const [lookupResult, setLookupResult] = useState<string>('');

  const handleUpdate = async (payload: CreateFeeScheduleInput) => {
    await updateSchedule.mutateAsync({ id: scheduleId, payload });
    toast({ title: 'Fee schedule updated' });
  };

  const handleCreateItem = async (payload: CreateFeeScheduleItemInput) => {
    await createItem.mutateAsync(payload);
    toast({ title: 'Fee schedule item added' });
  };

  const handleUpdateItem = async (itemId: string, payload: CreateFeeScheduleItemInput) => {
    await updateItem.mutateAsync({ id: itemId, payload });
    toast({ title: 'Fee schedule item updated' });
    setSelectedItem(null);
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!window.confirm('Delete this fee schedule item?')) return;
    await deleteItem.mutateAsync(itemId);
    toast({ title: 'Item deleted' });
  };

  const handleLookupPrice = async () => {
    if (!lookupCode.trim()) {
      toast({ variant: 'destructive', title: 'Enter a code to lookup.' });
      return;
    }
    const result = await priceLookup.mutateAsync({
      code: lookupCode.trim(),
      codeType: lookupCodeType,
      feeScheduleId: scheduleId,
    });
    if (result.price != null) {
      setLookupResult(`${result.price.toFixed(2)} ${result.currency ?? 'AED'}`);
    } else {
      setLookupResult(result.message ?? 'No price found');
    }
  };

  if (isLoading) {
    return <div className="h-48 animate-pulse rounded bg-muted" />;
  }

  if (error || !feeSchedule) {
    return (
      <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
        {error
          ? `Unable to load fee schedule: ${(error as Error).message}`
          : 'Fee schedule not found.'}
      </div>
    );
  }

  return (
    <div className="space-y-6 page-transition">
      <PageHeader
        title={feeSchedule.scheduleName}
        subtitle={`${toLabel(feeSchedule.scheduleType)} fee schedule${feeSchedule.version ? ` · ${feeSchedule.version}` : ''}`}
        icon={Table2}
        breadcrumb={
          <Breadcrumb
            items={[
              { href: `/${locale}/rcm-setup`, label: 'RCM Setup' },
              { href: `/${locale}/rcm-setup/fee-schedules`, label: 'Fee schedules' },
              { label: feeSchedule.scheduleName },
            ]}
          />
        }
        actions={
          <Badge variant={feeSchedule.status === 'active' ? 'default' : 'secondary'}>
            {toLabel(feeSchedule.status)}
          </Badge>
        }
      />

      <FormSection
        icon={Info}
        title="Schedule metadata"
        description="Type, version and validity period"
        contentClassName="grid gap-4 md:grid-cols-4"
      >
        <div>
          <p className="text-sm text-muted-foreground">Type</p>
          <p className="font-medium">{toLabel(feeSchedule.scheduleType)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Version</p>
          <p>{feeSchedule.version || '—'}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Effective from</p>
          <p>{format(new Date(feeSchedule.effectiveFrom), 'PPP')}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Effective to</p>
          <p>{feeSchedule.effectiveTo ? format(new Date(feeSchedule.effectiveTo), 'PPP') : '—'}</p>
        </div>
      </FormSection>

      <FeeScheduleForm
        initialValues={feeSchedule}
        onSubmit={handleUpdate}
        isSubmitting={updateSchedule.isPending}
        onCancel={() => router.push(`/${locale}/rcm-setup/fee-schedules`)}
      />

      <FormSection icon={ListOrdered} title="Items" description="Codes priced by this schedule">
        {isItemsLoading ? (
          <div className="h-32 animate-pulse rounded bg-muted" />
        ) : items && items.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="font-medium">{item.code}</div>
                    <p className="text-xs text-muted-foreground">{item.serviceGroup || '—'}</p>
                  </TableCell>
                  <TableCell>{item.codeType}</TableCell>
                  <TableCell>
                    {Number(item.baseAmount ?? 0).toFixed(2)} {item.currency}
                  </TableCell>
                  <TableCell>{item.priority}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => setSelectedItem(item.id)}>
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteItem(item.id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-sm text-muted-foreground">No items defined.</p>
        )}

        <div className="space-y-4 rounded-md border border-border p-4">
          <h3 className="font-medium">Add new item</h3>
          <FeeScheduleItemForm
            feeScheduleId={feeSchedule.id}
            onSubmit={handleCreateItem}
            isSubmitting={createItem.isPending}
          />
        </div>

        {selectedItem && (
          <div className="space-y-4 rounded-md border border-border p-4">
            <h3 className="font-medium">Edit item</h3>
            {items
              ?.filter((item) => item.id === selectedItem)
              .map((item) => (
                <FeeScheduleItemForm
                  key={item.id}
                  feeScheduleId={feeSchedule.id}
                  initialValues={item}
                  submitLabel="Update item"
                  isSubmitting={updateItem.isPending}
                  onSubmit={(payload) => handleUpdateItem(item.id, payload)}
                  onCancel={() => setSelectedItem(null)}
                />
              ))}
          </div>
        )}
      </FormSection>

      <FormSection
        icon={Search}
        title="Lookup price"
        description="Check the price this schedule resolves for a code"
        contentClassName="space-y-3"
      >
        <div className="grid gap-3 md:grid-cols-3">
          <div className="space-y-2">
            <Label>Code type</Label>
            <Select
              value={lookupCodeType}
              onValueChange={(value) => setLookupCodeType(value as FeeScheduleCodeType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(FeeScheduleCodeType).map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Code</Label>
            <Input
              value={lookupCode}
              onChange={(event) => setLookupCode(event.target.value)}
              placeholder="Enter code"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={handleLookupPrice} disabled={priceLookup.isPending}>
            {priceLookup.isPending ? 'Looking up…' : 'Lookup'}
          </Button>
          {lookupResult && <p className="text-sm text-muted-foreground">{lookupResult}</p>}
        </div>
      </FormSection>
    </div>
  );
}
