'use client';

import { useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  usePackage,
  usePackageCatalogTypes,
  usePackageTypes,
} from '@/modules/clinical/hooks/use-packages';
import type { PackageItem } from '@/modules/clinical/types/package';
import { CatalogBillingMappingsPanel } from '@/modules/rcm/components/catalog-billing-mappings-panel';

const careSettingLabels: Record<string, string> = {
  OP: 'Outpatient',
  IP: 'Inpatient',
  DAYCARE: 'Daycare',
  ANY: 'Any',
};

export default function PackageDetailPage() {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const id = params.id as string;

  const { data: packageTypes } = usePackageTypes();
  const { data: catalogTypes } = usePackageCatalogTypes();
  const {
    data: pkg,
    isLoading,
    error,
  } = usePackage(id);

  const packageTypeLookup = useMemo(
    () =>
      (packageTypes || []).reduce<Record<string, string>>((acc, type) => {
        acc[type.code] = type.name;
        return acc;
      }, {}),
    [packageTypes],
  );

  const catalogTypeLookup = useMemo(
    () =>
      (catalogTypes || []).reduce<Record<string, string>>((acc, type) => {
        acc[type.code] = type.name;
        return acc;
      }, {}),
    [catalogTypes],
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-9 w-48 animate-pulse rounded bg-muted" />
        <div className="h-32 animate-pulse rounded bg-muted" />
      </div>
    );
  }

  if (error || !pkg) {
    return (
      <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
        {error ? `Unable to load package: ${(error as Error).message}` : 'Package not found.'}
      </div>
    );
  }

  const ageRange =
    pkg.minAgeYears || pkg.maxAgeYears
      ? `${pkg.minAgeYears ?? 0} - ${pkg.maxAgeYears ?? '∞'}`
      : 'All ages';

  const items = (pkg.items || []).slice().sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  const renderItemRow = (item: PackageItem) => (
    <div key={item.id} className="grid grid-cols-12 items-start gap-4 rounded-lg border p-3">
      <div className="col-span-12 md:col-span-3">
        <p className="text-sm font-semibold">{catalogTypeLookup[item.catalogType] || item.catalogType}</p>
        <p className="font-mono text-xs text-muted-foreground">{item.catalogId}</p>
      </div>
      <div className="col-span-6 md:col-span-2">
        <p className="text-xs text-muted-foreground">Quantity</p>
        <p className="font-medium">{item.quantity ?? 1}</p>
      </div>
      <div className="col-span-6 md:col-span-2">
        <p className="text-xs text-muted-foreground">Mandatory</p>
        <Badge variant={item.isMandatory ? 'default' : 'secondary'}>
          {item.isMandatory ? 'Yes' : 'Optional'}
        </Badge>
      </div>
      <div className="col-span-6 md:col-span-2">
        <p className="text-xs text-muted-foreground">Clinical only</p>
        <Badge variant={item.clinicalOnly ? 'default' : 'secondary'}>
          {item.clinicalOnly ? 'Yes' : 'No'}
        </Badge>
      </div>
      <div className="col-span-6 md:col-span-3">
        <p className="text-xs text-muted-foreground">Notes</p>
        <p className="text-sm">{item.notes || '—'}</p>
      </div>
      {item.groupName && (
        <div className="col-span-12">
          <p className="text-xs text-muted-foreground">Group</p>
          <p className="text-sm font-medium">{item.groupName}</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => router.push(`/${locale}/catalogs/packages`)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to packages
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{pkg.name}</h1>
          <p className="font-mono text-sm text-muted-foreground">{pkg.code}</p>
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <Badge variant={pkg.isActive ? 'default' : 'secondary'}>
            {pkg.isActive ? 'Active' : 'Inactive'}
          </Badge>
          <Badge variant="outline">{pkg.isPublic ? 'Public' : 'Private'}</Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Package overview</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div>
            <p className="text-sm text-muted-foreground">Type</p>
            <p className="font-medium">{packageTypeLookup[pkg.packageType || ''] || '—'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Care setting</p>
            <p className="font-medium">{careSettingLabels[pkg.careSetting || 'ANY'] || '—'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Validity</p>
            <p className="font-medium">{pkg.validityDays ? `${pkg.validityDays} days` : '—'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Age range</p>
            <p className="font-medium">{ageRange}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Gender restriction</p>
            <p className="font-medium">{pkg.genderRestriction || 'None'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Description</p>
            <p className="font-medium">{pkg.description || 'No description provided.'}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Package items ({items.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground">No items defined for this package.</p>
          ) : (
            <div className="space-y-3">
              {items.map(renderItemRow)}
            </div>
          )}
        </CardContent>
      </Card>

      {pkg.metadata && Object.keys(pkg.metadata).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Metadata</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="rounded bg-muted p-3 text-xs">{JSON.stringify(pkg.metadata, null, 2)}</pre>
          </CardContent>
        </Card>
      )}

      {/* Billing Mappings */}
      <Card>
        <CardHeader>
          <CardTitle>Billing Mappings</CardTitle>
        </CardHeader>
        <CardContent>
          <CatalogBillingMappingsPanel
            catalogType="package"
            catalogItemId={id}
            catalogItemName={pkg.name}
            catalogItemCode={pkg.code}
          />
        </CardContent>
      </Card>

      <Separator />
      <p className="text-xs text-muted-foreground">
        Catalog package data is read-only in this UI. Use API or admin tools for changes.
      </p>
    </div>
  );
}
