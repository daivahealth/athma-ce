'use client';

import { useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  useAdministrativeService,
  useAdministrativeServiceCategories,
  useAdministrativeServiceTypes,
} from '@/modules/clinical/hooks/use-administrative-services';

const careSettingLabels: Record<string, string> = {
  OP: 'Outpatient',
  IP: 'Inpatient',
  DAYCARE: 'Daycare',
  ANY: 'Any',
};

export default function AdministrativeServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const id = params.id as string;

  const { data: categoryOptions } = useAdministrativeServiceCategories();
  const { data: typeOptions } = useAdministrativeServiceTypes();
  const {
    data: service,
    isLoading,
    error,
  } = useAdministrativeService(id);

  const categoryLookup = useMemo(
    () =>
      (categoryOptions || []).reduce<Record<string, string>>((acc, opt) => {
        acc[opt.code] = opt.name;
        return acc;
      }, {}),
    [categoryOptions],
  );

  const typeLookup = useMemo(
    () =>
      (typeOptions || []).reduce<Record<string, string>>((acc, opt) => {
        acc[opt.code] = opt.name;
        return acc;
      }, {}),
    [typeOptions],
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-9 w-48 animate-pulse rounded bg-muted" />
        <div className="h-32 animate-pulse rounded bg-muted" />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
        {error ? `Unable to load service: ${(error as Error).message}` : 'Service not found.'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/${locale}/catalogs/administrative-services`)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to services
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{service.serviceName}</h1>
          <p className="font-mono text-sm text-muted-foreground">
            {service.serviceCode || 'No service code'}
          </p>
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <Badge variant={service.isActive ? 'default' : 'secondary'}>
            {service.isActive ? 'Active' : 'Inactive'}
          </Badge>
          {service.isTaxable && <Badge variant="outline">Taxable</Badge>}
          {service.requiresStaff && <Badge variant="outline">Staff Required</Badge>}
          {service.requiresRoom && <Badge variant="outline">Room Required</Badge>}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Service overview</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div>
            <p className="text-sm text-muted-foreground">Category</p>
            <p className="font-medium">
              {categoryLookup[service.serviceCategory] || service.serviceCategory}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Type</p>
            <p className="font-medium">
              {service.serviceType ? typeLookup[service.serviceType] || service.serviceType : '—'}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Care setting</p>
            <p className="font-medium">
              {careSettingLabels[service.careSetting || 'ANY'] || service.careSetting || '—'}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Department</p>
            <p className="font-medium">{service.department || '—'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Duration</p>
            <p className="font-medium">
              {service.durationMinutes ? `${service.durationMinutes} minutes` : '—'}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Billing code</p>
            <p className="font-medium">{service.billingCode || '—'}</p>
            {service.billingCodeType && (
              <p className="text-xs text-muted-foreground">Type: {service.billingCodeType}</p>
            )}
            {service.billingDescription && (
              <p className="text-xs text-muted-foreground">{service.billingDescription}</p>
            )}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Staff</p>
            <p className="font-medium">
              {service.requiresStaff ? service.staffType || 'Required' : 'Not required'}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Room</p>
            <p className="font-medium">
              {service.requiresRoom ? service.roomType || 'Required' : 'Not required'}
            </p>
          </div>
          <div className="md:col-span-3">
            <p className="text-sm text-muted-foreground">Description</p>
            <p className="font-medium">{service.description || 'No description provided.'}</p>
          </div>
        </CardContent>
      </Card>

      {service.metadata && Object.keys(service.metadata).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Metadata</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="rounded bg-muted p-3 text-xs">
              {JSON.stringify(service.metadata, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}

      <Separator />
      <p className="text-xs text-muted-foreground">
        Administrative services are read-only in this UI. Use API or admin tools for changes.
      </p>
    </div>
  );
}
