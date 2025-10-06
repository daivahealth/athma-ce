'use client';

import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Tenant, useTenants } from '@/hooks/use-tenants';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogCloseButton } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { foundationClient } from '@/lib/api/client';
import { useToast } from '@/components/ui/use-toast';

const createTenantSchema = z.object({
  name: z.string().min(2),
  domain: z.string().min(4),
});

const columns: ColumnDef<Tenant>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'domain', header: 'Domain' },
  { accessorKey: 'status', header: 'Status' },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ getValue }) => formatDate(getValue() as string),
  },
];

export function TenantsTable() {
  const { data, isLoading, refetch } = useTenants();
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
      <CardContent className="p-0">
        <div className="flex items-center justify-between px-4 pb-3 pt-4">
          <div>
            <h2 className="text-lg font-semibold">Tenants</h2>
            <p className="text-sm text-muted-foreground">Unified tenant management across regions</p>
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
              ) : data?.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="bg-background">
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
