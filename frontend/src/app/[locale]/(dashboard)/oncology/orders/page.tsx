'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { ChevronRight, Plus, Search, Syringe } from 'lucide-react';
import { useChemoOrders } from '@/plugins/oncology/hooks/use-oncology';
import { LoadingState, StatusBadge } from '@/plugins/oncology/components/shared';
import type { ChemoOrder } from '@/plugins/oncology/types';

export default function ChemoOrdersPage({ params }: { params: { locale: string } }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const { data, isLoading } = useChemoOrders(statusFilter ? { status: statusFilter } : undefined);
  const allOrders: ChemoOrder[] = data?.data ?? [];

  const orders = allOrders.filter((o) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      o.protocol_name?.toLowerCase().includes(q) ||
      o.protocol_code?.toLowerCase().includes(q) ||
      o.patientDisplay?.displayName?.toLowerCase().includes(q) ||
      o.patientDisplay?.mrn?.toLowerCase().includes(q) ||
      o.cancer_type?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Chemo Orders</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Patient-specific chemotherapy orders with safety workflow
          </p>
        </div>
        <Button onClick={() => router.push(`/${params.locale}/oncology/orders/new`)}>
          <Plus className="h-4 w-4 mr-2" />New Order
        </Button>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by patient, protocol, cancer type..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter || 'all'} onValueChange={(v) => setStatusFilter(v === 'all' ? '' : v)}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="verified">Verified</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="held">Held</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <LoadingState />
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-60 border rounded-lg bg-muted/20 space-y-4">
          <Syringe className="h-10 w-10 text-muted-foreground/40" />
          <p className="text-muted-foreground">
            {allOrders.length === 0 ? 'No chemo orders yet' : 'No orders match the current filters'}
          </p>
          {allOrders.length === 0 && (
            <Button variant="outline" onClick={() => router.push(`/${params.locale}/oncology/orders/new`)}>
              <Plus className="h-4 w-4 mr-2" />Create First Order
            </Button>
          )}
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 font-medium">Patient</th>
                <th className="text-left p-3 font-medium">Protocol</th>
                <th className="text-left p-3 font-medium">Cancer Type</th>
                <th className="text-left p-3 font-medium">Cycle / Day</th>
                <th className="text-left p-3 font-medium">Scheduled</th>
                <th className="text-left p-3 font-medium">BSA</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="p-3 w-10" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-muted/30 transition-colors cursor-pointer"
                  onClick={() => router.push(`/${params.locale}/oncology/orders/${order.id}`)}
                >
                  <td className="p-3">
                    <div className="font-medium">{order.patientDisplay?.displayName ?? '—'}</div>
                    {order.patientDisplay?.mrn && <div className="text-xs text-muted-foreground">MRN: {order.patientDisplay.mrn}</div>}
                  </td>
                  <td className="p-3">
                    <div className="font-mono text-xs font-semibold">{order.protocol_code}</div>
                    <div className="text-xs text-muted-foreground">{order.protocol_name}</div>
                  </td>
                  <td className="p-3 text-xs text-muted-foreground">{order.cancer_type ?? '—'}</td>
                  <td className="p-3 text-xs text-muted-foreground">
                    C{order.cycle_number} D{order.day_number}
                  </td>
                  <td className="p-3 text-xs text-muted-foreground">{order.scheduled_date}</td>
                  <td className="p-3 text-xs text-muted-foreground">
                    {order.bsa ? `${order.bsa} m²` : '—'}
                  </td>
                  <td className="p-3"><StatusBadge status={order.status} /></td>
                  <td className="p-3"><ChevronRight className="h-4 w-4 text-muted-foreground" /></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-3 py-2 bg-muted/20 border-t text-xs text-muted-foreground">
            {orders.length} order{orders.length !== 1 ? 's' : ''}
            {orders.length !== allOrders.length && ` (filtered from ${allOrders.length})`}
          </div>
        </div>
      )}
    </div>
  );
}
