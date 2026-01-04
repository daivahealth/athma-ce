'use client';

import type { ColumnDef} from '@tanstack/react-table';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import type { Tenant} from '@/hooks/use-tenants';
import { useTenants } from '@/hooks/use-tenants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogCloseButton } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { foundationClient } from '@/lib/api/client';
import { useToast } from '@/components/ui/use-toast';
import { Building2, Globe, Clock, Settings } from 'lucide-react';

const createTenantSchema = z.object({
  name: z.string().min(2),
  domain: z.string().min(4),
});

const columns: ColumnDef<Tenant>[] = [
  {
    accessorKey: 'name',
    header: 'Tenant Name',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Building2 className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium">{row.getValue('name')}</span>
      </div>
    ),
  },
  {
    accessorKey: 'domain',
    header: 'Domain',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Globe className="h-4 w-4 text-muted-foreground" />
        <span className="font-mono text-sm">{row.getValue('domain')}</span>
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <Badge variant={status === 'active' ? 'default' : 'secondary'}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'settings',
    header: 'Settings',
    cell: ({ row }) => {
      const settings = row.getValue('settings') as Tenant['settings'];
      return (
        <div className="flex items-center gap-2">
          <Settings className="h-4 w-4 text-muted-foreground" />
          <div className="text-sm">
            {settings.language && (
              <div className="text-muted-foreground">Lang: {settings.language}</div>
            )}
            {settings.timezone && (
              <div className="text-muted-foreground">TZ: {settings.timezone}</div>
            )}
            {!settings.language && !settings.timezone && (
              <span className="text-muted-foreground">Default</span>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm">{formatDate(row.getValue('createdAt') as string)}</span>
      </div>
    ),
  },
];

export function TenantsTable() {
  const { data, isLoading, error, refetch } = useTenants();
  const toast = useToast();
  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const form = useForm<z.infer<typeof createTenantSchema>>({
    resolver: zodResolver(createTenantSchema),
    defaultValues: { name: '', domain: '' },
  });

  async function onCreate(values: z.infer<typeof createTenantSchema>) {
    try {
      await foundationClient.post('/tenants', { ...values, settings: { timezone: 'Asia/Dubai' } });
      toast({ title: 'Tenant created', description: `${values.name} is now available.`, variant: 'success' });
      form.reset();
      await refetch();
    } catch (error: any) {
      toast({
        title: 'Unable to create tenant',
        description: error?.response?.data?.message ?? 'Please check inputs and retry.',
        variant: 'destructive',
      });
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Tenants
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Unified tenant management across regions
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">Create tenant</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogCloseButton />
              <DialogHeader>
                <DialogTitle>Create tenant</DialogTitle>
                <DialogDescription>Provision a new clinic or network. Mandatory PDPL fields required.</DialogDescription>
              </DialogHeader>
              <form
                className="space-y-4"
                onSubmit={form.handleSubmit((values) => onCreate(values))}
              >
                <div className="space-y-2">
                  <Label htmlFor="tenant-name">Tenant name</Label>
                  <Input id="tenant-name" {...form.register('name')} placeholder="DXB Downtown Clinic" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tenant-domain">Domain</Label>
                  <Input id="tenant-domain" {...form.register('domain')} placeholder="dxb-clinic.zeal.health" />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? 'Creating...' : 'Save tenant'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/40 text-left text-sm text-muted-foreground">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="px-4 py-3 font-medium">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <tr key={index}>
                    <td colSpan={columns.length} className="px-4 py-4">
                      <Skeleton className="h-4 w-full" />
                    </td>
                  </tr>
                ))
              ) : error ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-6 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-sm text-destructive">Failed to load tenants</p>
                      <Button variant="outline" size="sm" onClick={() => refetch()}>
                        Retry
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : data?.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="bg-background hover:bg-muted/50 transition-colors">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-6 text-center text-sm text-muted-foreground">
                    No tenants found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
