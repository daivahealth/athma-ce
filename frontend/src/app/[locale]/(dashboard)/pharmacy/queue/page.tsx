'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Search, Pill, User, ClipboardCheck, Building2, Plus } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import { usePharmacyQueue } from '@/modules/pharmacy/hooks/use-pharmacy-queue';
import { useCreateDispensing } from '@/modules/pharmacy/hooks/use-pharmacy-dispensing';
import type { PharmacyQueueItem } from '@/modules/pharmacy/types/queue';
import type { DispensingChannel } from '@/modules/pharmacy/types/dispensing';

export default function PharmacyQueuePage() {
  const params = useParams();
  const locale = params.locale as string;
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'outpatient' | 'inpatient'>('all');

  const filters = {
    ...(activeTab !== 'all' && { encounterType: activeTab }),
    ...(search && { search }),
  };

  const { data: queue = [], isLoading } = usePharmacyQueue(filters);
  const createDispensing = useCreateDispensing();

  const handleQueue = async (item: PharmacyQueueItem) => {
    if (item.dispensingId) {
      router.push(`/${locale}/pharmacy/dispensings/${item.dispensingId}`);
      return;
    }

    const channel: DispensingChannel =
      item.encounterType === 'inpatient' ? 'inpatient_ward' : 'outpatient_counter';

    const result = await createDispensing.mutateAsync({
      prescriptionOrderId: item.prescriptionOrderId,
      encounterId: item.encounterId,
      patientId: item.patientId,
      dispensingChannel: channel,
    });

    router.push(`/${locale}/pharmacy/dispensings/${result.id}`);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
      pending: 'outline',
      queued: 'secondary',
      verified: 'default',
      dispensed: 'default',
      cancelled: 'destructive',
    };
    return <Badge variant={variants[status] ?? 'outline'}>{status}</Badge>;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by patient name or MRN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button asChild>
          <Link href={`/${locale}/pharmacy/dispensings/new`}>
            <Plus className="h-4 w-4 mr-2" />
            Direct Dispense
          </Link>
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
        <TabsList>
          <TabsTrigger value="all">All ({queue.length})</TabsTrigger>
          <TabsTrigger value="outpatient">
            Outpatient ({queue.filter((i) => i.encounterType === 'outpatient').length})
          </TabsTrigger>
          <TabsTrigger value="inpatient">
            Inpatient ({queue.filter((i) => i.encounterType === 'inpatient').length})
          </TabsTrigger>
        </TabsList>

        {(['all', 'outpatient', 'inpatient'] as const).map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-4">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-24 w-full rounded-lg" />
                ))}
              </div>
            ) : queue.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Pill className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p>No prescriptions in queue</p>
              </div>
            ) : (
              <div className="space-y-3">
                {queue.map((item) => (
                  <Card key={item.prescriptionOrderId} className="hover:shadow-sm transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="font-medium truncate">
                              {item.patientDisplayName ?? 'Unknown Patient'}
                            </span>
                            {item.mrn && (
                              <span className="text-xs text-muted-foreground">MRN: {item.mrn}</span>
                            )}
                            <Badge variant="outline" className="text-xs">
                              {item.encounterType}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-2 mb-2">
                            <Pill className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="font-medium text-sm">{item.drugName}</span>
                            <span className="text-xs text-muted-foreground">
                              {item.dosage} — {item.frequency}
                            </span>
                            <span className="text-xs text-muted-foreground">Qty: {item.quantity}</span>
                          </div>

                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Prescribed: {format(new Date(item.prescribedAt), 'dd MMM yyyy HH:mm')}</span>
                            {item.wardName && (
                              <span className="flex items-center gap-1">
                                <Building2 className="h-3 w-3" />
                                {item.wardName} {item.bedNumber && `— Bed ${item.bedNumber}`}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          {getStatusBadge(item.dispensingStatus)}
                          <Button
                            size="sm"
                            variant={item.dispensingId ? 'outline' : 'default'}
                            onClick={() => handleQueue(item)}
                            disabled={createDispensing.isPending}
                          >
                            {item.dispensingId ? (
                              <>
                                <ClipboardCheck className="h-4 w-4 mr-1" />
                                View
                              </>
                            ) : (
                              <>
                                <Pill className="h-4 w-4 mr-1" />
                                Process
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
