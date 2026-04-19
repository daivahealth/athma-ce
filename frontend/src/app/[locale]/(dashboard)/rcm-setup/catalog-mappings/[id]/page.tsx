'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Trash2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { useCatalogMapping, useDeleteCatalogMapping } from '@/modules/rcm/hooks/use-catalog-mappings';

const catalogTypeLabels: Record<string, string> = {
  medication: 'Medication',
  lab_test: 'Lab test',
  imaging_study: 'Imaging study',
  procedure: 'Procedure',
  package: 'Package',
  administrative_service: 'Administrative service',
};

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
      <div className="text-sm font-medium">{value ?? '—'}</div>
    </div>
  );
}

export default function CatalogMappingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const id = params.id as string;
  const toast = useToast();

  const { data: mapping, isLoading, error } = useCatalogMapping(id);
  const { mutateAsync: deleteMapping, isPending: isDeleting } = useDeleteCatalogMapping();

  const handleDelete = async () => {
    if (!confirm('Deactivate this mapping? It will no longer be used for charge posting.')) return;
    try {
      await deleteMapping(id);
      toast.toast({ title: 'Mapping deactivated' });
      router.push(`/${locale}/rcm-setup/catalog-mappings`);
    } catch (err) {
      toast.toast({ variant: 'destructive', title: 'Failed', description: (err as Error).message });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="h-48 bg-muted animate-pulse rounded-md" />
      </div>
    );
  }

  if (error || !mapping) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/${locale}/rcm-setup/catalog-mappings`}><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div className="flex items-center gap-2 rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          Mapping not found or failed to load.
        </div>
      </div>
    );
  }

  const b = mapping.billingItem;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/${locale}/rcm-setup/catalog-mappings`}><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Catalog Mapping</h1>
            <p className="text-sm text-muted-foreground font-mono">{id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {mapping.isActive ? (
            <Badge variant="default" className="bg-green-600">Active</Badge>
          ) : (
            <Badge variant="secondary">Inactive</Badge>
          )}
          <Button variant="outline" size="sm" className="text-destructive hover:text-destructive" onClick={handleDelete} disabled={isDeleting}>
            <Trash2 className="h-4 w-4 mr-1" />
            {isDeleting ? 'Deactivating…' : 'Deactivate'}
          </Button>
        </div>
      </div>

      {/* Catalog → Billing summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Mapping</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Catalog side */}
            <div className="flex-1 rounded-md border bg-muted/30 px-4 py-3">
              <p className="text-xs text-muted-foreground mb-1">Clinical catalog</p>
              <p className="font-semibold capitalize">{catalogTypeLabels[mapping.catalogType] ?? mapping.catalogType}</p>
              <p className="font-mono text-xs text-muted-foreground mt-0.5 break-all">{mapping.catalogItemId}</p>
            </div>

            <div className="text-2xl text-muted-foreground shrink-0 hidden sm:block">→</div>
            <div className="text-muted-foreground sm:hidden">↓</div>

            {/* Billing side */}
            <div className="flex-1 rounded-md border bg-muted/30 px-4 py-3">
              <p className="text-xs text-muted-foreground mb-1">Billing item</p>
              {b ? (
                <>
                  <p className="font-semibold">{b.billingDescription}</p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="font-mono text-xs text-muted-foreground">{b.billingCode}</span>
                    <Badge variant="outline" className="text-xs">{b.billingCodeType}</Badge>
                    {b.listPrice != null && <span className="text-xs text-muted-foreground">₹{Number(b.listPrice).toFixed(2)}</span>}
                  </div>
                </>
              ) : (
                <p className="font-mono text-xs text-muted-foreground break-all">{mapping.billingItemId}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Quantity" value={mapping.quantity ?? 1} />
            <Field label="Mapping reason" value={mapping.mappingReason} />
            <Field label="Notes" value={mapping.notes} />
          </div>

          <Separator />

          <div className="grid gap-4 sm:grid-cols-3">
            <Field
              label="Flags"
              value={
                <div className="flex gap-1 flex-wrap mt-0.5">
                  {mapping.isPrimary && <Badge variant="default" className="text-xs">Primary</Badge>}
                  {mapping.isAutomatic && <Badge variant="outline" className="text-xs">Auto</Badge>}
                  {mapping.requiresApproval && <Badge variant="secondary" className="text-xs">Needs approval</Badge>}
                  {!mapping.isPrimary && !mapping.isAutomatic && !mapping.requiresApproval && <span className="text-muted-foreground">None</span>}
                </div>
              }
            />
            <Field
              label="Effective date"
              value={mapping.effectiveDate ? format(new Date(mapping.effectiveDate), 'dd MMM yyyy') : 'Any'}
            />
            <Field
              label="Expiration date"
              value={mapping.expirationDate ? format(new Date(mapping.expirationDate), 'dd MMM yyyy') : 'No expiry'}
            />
          </div>

          <Separator />

          <div className="grid gap-4 sm:grid-cols-3">
            <Field
              label="Facility restriction"
              value={mapping.facilityIds?.length ? mapping.facilityIds.join(', ') : 'All facilities'}
            />
            <Field
              label="Payer restriction"
              value={mapping.payerIds?.length ? mapping.payerIds.join(', ') : 'All payers'}
            />
            <Field
              label="Patient type"
              value={mapping.patientTypes?.length ? mapping.patientTypes.join(', ') : 'All types'}
            />
          </div>

          <Separator />

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Created" value={mapping.createdAt ? format(new Date(mapping.createdAt), 'dd MMM yyyy, HH:mm') : '—'} />
            <Field label="Last updated" value={mapping.updatedAt ? format(new Date(mapping.updatedAt), 'dd MMM yyyy, HH:mm') : '—'} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
