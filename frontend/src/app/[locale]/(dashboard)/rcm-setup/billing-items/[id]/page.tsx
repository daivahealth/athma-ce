'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ArrowLeft, Trash2 } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { BillingItemForm } from '@/modules/rcm/components/billing-item-form';
import { CatalogBillingMappingsPanel } from '@/modules/rcm/components/catalog-billing-mappings-panel';
import {
  useBillingItem,
  useUpdateBillingItem,
  useArchiveBillingItem,
  useHardDeleteBillingItem,
} from '@/modules/rcm/hooks/use-billing-items';
import type { CreateBillingItemInput } from '@/modules/rcm/types/billing-item';
import { useResolveConfig } from '@/modules/foundation/hooks/use-configs';

export default function BillingItemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const locale = params.locale as string;
  const itemId = params.id as string;

  const { data: billingItem, isLoading, error } = useBillingItem(itemId);
  const { data: currencyConfig } = useResolveConfig('finance.currency');
  const currency =
    typeof currencyConfig?.value === 'string' && currencyConfig.value.trim()
      ? currencyConfig.value.trim()
      : 'AED';
  const updateMutation = useUpdateBillingItem();
  const archiveMutation = useArchiveBillingItem();
  const hardDeleteMutation = useHardDeleteBillingItem();

  const handleUpdate = async (payload: CreateBillingItemInput) => {
    await updateMutation.mutateAsync({ id: itemId, payload });
    toast({ title: 'Billing item updated' });
  };

  const handleArchive = async () => {
    if (!billingItem) return;
    if (!window.confirm('Deactivate this billing item?')) return;
    await archiveMutation.mutateAsync(billingItem.id);
    toast({ title: 'Billing item deactivated' });
    router.push(`/${locale}/rcm-setup/billing-items`);
  };

  const handleHardDelete = async () => {
    if (!billingItem) return;
    if (!window.confirm('This will permanently delete the billing item. Continue?')) return;
    await hardDeleteMutation.mutateAsync(billingItem.id);
    toast({ title: 'Billing item removed' });
    router.push(`/${locale}/rcm-setup/billing-items`);
  };

  if (isLoading) {
    return <div className="h-48 animate-pulse rounded bg-muted" />;
  }

  if (error || !billingItem) {
    return (
      <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
        {error ? `Unable to load billing item: ${(error as Error).message}` : 'Billing item not found.'}
      </div>
    );
  }

  const scopeLabel = billingItem.tenantId ? 'Tenant-specific' : 'Global catalog item';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/${locale}/rcm-setup/billing-items`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">{billingItem.billingDescription}</h1>
        <Badge variant={billingItem.isActive ? 'default' : 'secondary'} className="ml-auto">
          {billingItem.isActive ? 'Active' : 'Inactive'}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Scope & metadata</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">Scope</p>
            <p className="font-medium">{scopeLabel}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Billing code</p>
            <p className="font-mono text-sm">{billingItem.billingCode}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">List price ({currency})</p>
            <p className="font-medium">
              {billingItem.listPrice != null
                ? Number(billingItem.listPrice).toFixed(2)
                : '—'}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Created</p>
            <p>{format(new Date(billingItem.createdAt), 'PPP p')}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Updated</p>
            <p>{format(new Date(billingItem.updatedAt), 'PPP p')}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Edit billing item</CardTitle>
        </CardHeader>
        <CardContent>
          <BillingItemForm
            initialValues={billingItem}
            submitLabel="Update billing item"
            isSubmitting={updateMutation.isPending}
            onSubmit={handleUpdate}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mapped Catalog Items</CardTitle>
        </CardHeader>
        <CardContent>
          <CatalogBillingMappingsPanel
            billingItemId={itemId}
            billingItem={billingItem}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danger zone</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-medium">Deactivate billing item</p>
            <p className="text-sm text-muted-foreground">Deactivated codes stay in history but are hidden from ordering.</p>
          </div>
          <Button variant="outline" className="text-destructive" onClick={handleArchive} disabled={archiveMutation.isPending}>
            {archiveMutation.isPending ? 'Deactivating...' : 'Deactivate'}
          </Button>
        </CardContent>
        <CardContent className="flex flex-col gap-3 border-t pt-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-medium text-destructive">Hard delete</p>
            <p className="text-sm text-muted-foreground">Permanently remove this billing item and all history.</p>
          </div>
          <Button variant="destructive" onClick={handleHardDelete} disabled={hardDeleteMutation.isPending}>
            <Trash2 className="mr-2 h-4 w-4" />
            {hardDeleteMutation.isPending ? 'Deleting...' : 'Delete permanently'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
