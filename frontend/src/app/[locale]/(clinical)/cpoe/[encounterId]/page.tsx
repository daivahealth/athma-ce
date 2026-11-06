'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';
import { ArrowLeft, FileText, Loader2, Stethoscope, Trash2, UserRound } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useToast } from '@/components/ui/use-toast';
import { OrderAutocomplete, type OrderSelection } from '@/components/autocomplete/catalog-autocomplete.order';
import { useDebouncedValue } from '@/hooks/use-debounced-value';

import { useEncounter } from '@/modules/clinical/hooks/use-encounters';
import {
  useCancelPackageOrder,
  useCreateClinicalOrder,
  useCreatePackageOrder,
  useDeleteClinicalOrder,
  useEncounterChartOrders,
} from '@/modules/clinical/hooks/use-charting';
import { OrderEntryMode, OrderPriority } from '@/modules/clinical/types/charting';
import type { ChartPackageOrder, ClinicalOrder } from '@/modules/clinical/types/charting';
import { EncounterStatus } from '@/modules/clinical/types/encounter';
import {
  buildClinicalOrderPayload,
  buildPackageOrderPayload,
} from '@/modules/clinical/utils/build-order-payload';
import { useStaff, useStaffSearch } from '@/modules/foundation/hooks/use-staff';
import type { StaffMember } from '@/modules/foundation/types/staff';

type CatalogOrderType = 'lab' | 'imaging' | 'procedure' | 'package';

const CATALOG_TYPES: { value: CatalogOrderType; label: string }[] = [
  { value: 'lab', label: 'Lab' },
  { value: 'imaging', label: 'Imaging' },
  { value: 'procedure', label: 'Procedure' },
  { value: 'package', label: 'Package' },
];

const ORDER_MODE_OPTIONS: { value: OrderEntryMode; label: string; hint: string }[] = [
  { value: OrderEntryMode.VERBAL, label: 'Verbal order', hint: 'Physician gave the order in person.' },
  { value: OrderEntryMode.TELEPHONE, label: 'Telephone order', hint: 'Physician gave the order by phone.' },
  { value: OrderEntryMode.WRITTEN, label: 'Written order', hint: 'Transcribed from a signed paper order or prescription.' },
  { value: OrderEntryMode.PROTOCOL, label: 'Standing protocol', hint: 'Ordered under an approved standing protocol.' },
  { value: OrderEntryMode.DIRECT, label: 'Direct (I am the ordering physician)', hint: 'Entered by the physician personally.' },
];

const ORDER_MODE_LABELS: Record<string, string> = {
  direct: 'Direct',
  verbal: 'Verbal',
  telephone: 'Telephone',
  written: 'Written',
  protocol: 'Protocol',
};

const PRIORITY_STYLES: Record<string, string> = {
  routine: 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300',
  urgent: 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300',
  stat: 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300',
};

const READ_BACK_MODES = new Set<OrderEntryMode>([OrderEntryMode.VERBAL, OrderEntryMode.TELEPHONE]);

const staffName = (staff?: Partial<StaffMember> | null) =>
  staff ? staff.displayName || `${staff.firstName ?? ''} ${staff.lastName ?? ''}`.trim() : '';

export default function CpoeOrderEntryPage() {
  const params = useParams() as { locale: string; encounterId: string };
  const { locale, encounterId } = params;
  const toast = useToast();

  const { data: encounter, isLoading: isEncounterLoading, error: encounterError } = useEncounter(encounterId);
  const { data: chartOrders, isLoading: isOrdersLoading } = useEncounterChartOrders(encounterId);
  const { data: staffData } = useStaff({ status: 'active' });
  const { mutateAsync: createOrder, isPending: isCreatingOrder } = useCreateClinicalOrder();
  const { mutateAsync: createPackageOrder, isPending: isCreatingPackage } = useCreatePackageOrder();
  const { mutateAsync: deleteOrder } = useDeleteClinicalOrder();
  const { mutateAsync: cancelPackageOrder } = useCancelPackageOrder();

  // Ordering details
  const [orderingPhysician, setOrderingPhysician] = useState<{ id: string; name: string } | null>(null);
  const [isChangingPhysician, setIsChangingPhysician] = useState(false);
  const [physicianSearch, setPhysicianSearch] = useState('');
  const debouncedPhysicianSearch = useDebouncedValue(physicianSearch, 300);
  const [orderMode, setOrderMode] = useState<OrderEntryMode | ''>('');
  const [readBackConfirmed, setReadBackConfirmed] = useState(false);
  const [priority, setPriority] = useState<OrderPriority>(OrderPriority.ROUTINE);
  const [clinicalIndication, setClinicalIndication] = useState('');
  const [catalogType, setCatalogType] = useState<CatalogOrderType>('lab');
  const [removingId, setRemovingId] = useState<string | null>(null);

  const staffMap = useMemo(() => {
    const map = new Map<string, string>();
    (staffData?.data ?? []).forEach((staff) => {
      const name = staffName(staff);
      if (staff.id && name) map.set(staff.id, name);
    });
    return map;
  }, [staffData]);

  // Default the ordering physician to the encounter's primary staff.
  useEffect(() => {
    if (!encounter || orderingPhysician) return;
    if (encounter.primaryStaffId) {
      setOrderingPhysician({
        id: encounter.primaryStaffId,
        name: staffMap.get(encounter.primaryStaffId) ?? 'Primary physician',
      });
    }
  }, [encounter, orderingPhysician, staffMap]);

  // Backfill the name once the staff list resolves.
  useEffect(() => {
    if (orderingPhysician && orderingPhysician.name === 'Primary physician') {
      const name = staffMap.get(orderingPhysician.id);
      if (name) setOrderingPhysician({ ...orderingPhysician, name });
    }
  }, [orderingPhysician, staffMap]);

  const { data: physicianSearchData, isLoading: isPhysicianLoading } = useStaffSearch({
    displayName: debouncedPhysicianSearch,
    staffType: 'physician',
    status: 'active',
    limit: 8,
    offset: 0,
  });
  const physicianResults = debouncedPhysicianSearch.trim() ? physicianSearchData?.data ?? [] : [];

  const standaloneOrders = useMemo(() => chartOrders?.standaloneOrders ?? [], [chartOrders?.standaloneOrders]);
  const packageOrders = useMemo(() => chartOrders?.packageOrders ?? [], [chartOrders?.packageOrders]);

  const existingCodes = useMemo(
    () =>
      new Set([
        ...standaloneOrders.map((order) => order.orderCode),
        ...packageOrders.flatMap((pkg) => pkg.clinicalOrders.map((order) => order.orderCode)),
      ]),
    [packageOrders, standaloneOrders],
  );
  const existingPackageIds = useMemo(() => new Set(packageOrders.map((pkg) => pkg.packageId)), [packageOrders]);

  const isEncounterClosed =
    encounter?.status === EncounterStatus.FINISHED || encounter?.status === EncounterStatus.CANCELLED;
  const needsReadBack = orderMode !== '' && READ_BACK_MODES.has(orderMode);

  const blockingReason = (() => {
    if (isEncounterClosed) return 'This encounter is closed. Orders can only be placed on open encounters.';
    if (!orderingPhysician) return 'Select the ordering physician.';
    if (!orderMode) return 'Select how the order was received.';
    if (needsReadBack && !readBackConfirmed) return 'Confirm the order was read back to the physician.';
    return null;
  })();

  const isSubmitting = isCreatingOrder || isCreatingPackage;

  const handleSelectItem = async (selection: OrderSelection) => {
    if (!encounter || !orderingPhysician || !orderMode || blockingReason) return;

    const ctx = {
      encounterId,
      patientId: encounter.patientId,
      orderedBy: orderingPhysician.id,
      priority,
      clinicalIndication: clinicalIndication.trim(),
      orderMode,
    };

    if (selection.type === 'package') {
      if (existingPackageIds.has(selection.id)) {
        toast({ variant: 'destructive', title: 'Package already ordered', description: selection.label });
        return;
      }
      try {
        const pkg = await createPackageOrder(buildPackageOrderPayload(selection, ctx));
        toast({
          title: 'Package ordered',
          description: `${selection.label} expanded into ${pkg.clinicalOrders.length} orders for ${orderingPhysician.name}.`,
        });
      } catch (err) {
        toast({
          variant: 'destructive',
          title: 'Unable to order package',
          description: err instanceof Error ? err.message : 'Please try again.',
        });
      }
      return;
    }

    if (existingCodes.has(selection.code)) {
      toast({ variant: 'destructive', title: 'Already ordered', description: `${selection.label} is already on this encounter.` });
      return;
    }

    try {
      await createOrder(buildClinicalOrderPayload(selection, ctx));
      toast({ title: 'Order placed', description: `${selection.label} for ${orderingPhysician.name}.` });
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Unable to place order',
        description: err instanceof Error ? err.message : 'Please try again.',
      });
    }
  };

  const handleRemoveOrder = async (order: ClinicalOrder) => {
    setRemovingId(order.id);
    try {
      await deleteOrder({ id: order.id, encounterId });
      toast({ title: 'Order removed', description: order.orderName });
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Unable to remove order',
        description: err instanceof Error ? err.message : 'Please try again.',
      });
    } finally {
      setRemovingId(null);
    }
  };

  const handleCancelPackage = async (pkg: ChartPackageOrder) => {
    setRemovingId(pkg.id);
    try {
      await cancelPackageOrder({ id: pkg.id, encounterId });
      toast({ title: 'Package cancelled', description: pkg.packageName });
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Unable to cancel package',
        description: err instanceof Error ? err.message : 'Please try again.',
      });
    } finally {
      setRemovingId(null);
    }
  };

  const renderEntryMeta = (order: { orderedBy: string; orderedAt: Date | string; orderMode?: string; priority?: string }) => (
    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
      {order.priority && (
        <Badge variant="outline" className={`text-[11px] uppercase ${PRIORITY_STYLES[order.priority] ?? ''}`}>
          {order.priority}
        </Badge>
      )}
      {order.orderMode && order.orderMode !== OrderEntryMode.DIRECT && (
        <Badge variant="secondary" className="text-[11px]">
          {ORDER_MODE_LABELS[order.orderMode] ?? order.orderMode} · on behalf
        </Badge>
      )}
      <span>by {staffMap.get(order.orderedBy) ?? 'Unknown physician'}</span>
      <span>·</span>
      <span>{format(new Date(order.orderedAt), 'MMM d, h:mm a')}</span>
    </div>
  );

  if (isEncounterLoading) {
    return (
      <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading encounter…
      </div>
    );
  }

  if (encounterError || !encounter) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Unable to load encounter</AlertTitle>
        <AlertDescription>
          {encounterError instanceof Error ? encounterError.message : 'The encounter could not be found.'}
        </AlertDescription>
      </Alert>
    );
  }

  const patient = encounter.patientDisplay;
  const totalOrders = standaloneOrders.length + packageOrders.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="space-y-1">
          <Link
            href={`/${locale}/cpoe`}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back to order entry
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Order Entry (CPOE)</h1>
        </div>
        <Card className="md:min-w-[320px]">
          <CardContent className="flex items-center gap-3 p-4">
            <UserRound className="h-8 w-8 text-muted-foreground" />
            <div className="space-y-0.5 text-sm">
              <p className="font-semibold">{patient?.displayName ?? 'Unknown patient'}</p>
              <p className="text-xs text-muted-foreground">
                MRN: {patient?.mrn ?? '—'} · {patient?.gender ?? '—'} / {patient?.age ?? '—'}y
              </p>
              <p className="text-xs text-muted-foreground">
                {encounter.encounterNumber} · {encounter.encounterClass} · {encounter.status.replace('-', ' ')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {isEncounterClosed && (
        <Alert>
          <AlertTitle>Encounter closed</AlertTitle>
          <AlertDescription>Orders can only be placed on open encounters.</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Ordering details</CardTitle>
            <CardDescription>
              Applies to every order you place below. Your user is recorded as the person who entered the order.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label>Ordering physician *</Label>
              {orderingPhysician && !isChangingPhysician ? (
                <div className="flex items-center justify-between gap-3 rounded-md border bg-muted/30 p-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Stethoscope className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{orderingPhysician.name}</span>
                    {orderingPhysician.id === encounter.primaryStaffId && (
                      <Badge variant="outline" className="text-[11px]">Encounter physician</Badge>
                    )}
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={() => setIsChangingPhysician(true)}>
                    Change
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Input
                    autoFocus
                    value={physicianSearch}
                    onChange={(e) => setPhysicianSearch(e.target.value)}
                    placeholder="Search physician by name"
                  />
                  {isPhysicianLoading && debouncedPhysicianSearch.trim() && (
                    <p className="text-xs text-muted-foreground">Searching physicians…</p>
                  )}
                  {!isPhysicianLoading && debouncedPhysicianSearch.trim() && physicianResults.length === 0 && (
                    <p className="text-xs text-muted-foreground">No physicians found.</p>
                  )}
                  {physicianResults.length > 0 && (
                    <div className="max-h-48 overflow-auto rounded-md border p-1">
                      {physicianResults.map((physician) => (
                        <button
                          key={physician.id}
                          type="button"
                          onClick={() => {
                            setOrderingPhysician({ id: physician.id, name: staffName(physician) });
                            setIsChangingPhysician(false);
                            setPhysicianSearch('');
                          }}
                          className="flex w-full flex-col items-start rounded-md px-2 py-2 text-left text-sm hover:bg-accent"
                        >
                          <span className="font-medium">{staffName(physician)}</span>
                          <span className="text-xs text-muted-foreground">
                            ID: {physician.employeeId} · {physician.staffType}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                  {orderingPhysician && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => setIsChangingPhysician(false)}>
                      Keep {orderingPhysician.name}
                    </Button>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Order received as *</Label>
              <Select
                value={orderMode}
                onValueChange={(value) => {
                  setOrderMode(value as OrderEntryMode);
                  setReadBackConfirmed(false);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select how the order was received" />
                </SelectTrigger>
                <SelectContent>
                  {ORDER_MODE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {orderMode && (
                <p className="text-xs text-muted-foreground">
                  {ORDER_MODE_OPTIONS.find((option) => option.value === orderMode)?.hint}
                </p>
              )}
              {needsReadBack && (
                <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm dark:border-amber-800 dark:bg-amber-950/40">
                  <Checkbox
                    id="readBackConfirmed"
                    checked={readBackConfirmed}
                    onChange={(e) => setReadBackConfirmed(e.target.checked)}
                    className="mt-0.5"
                  />
                  <Label htmlFor="readBackConfirmed" className="font-normal leading-snug">
                    I read the order back to <strong>{orderingPhysician?.name ?? 'the physician'}</strong> and they
                    confirmed it.
                  </Label>
                </div>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-[160px_minmax(0,1fr)]">
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={priority} onValueChange={(value) => setPriority(value as OrderPriority)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={OrderPriority.ROUTINE}>Routine</SelectItem>
                    <SelectItem value={OrderPriority.URGENT}>Urgent</SelectItem>
                    <SelectItem value={OrderPriority.STAT}>STAT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="clinicalIndication">Clinical indication</Label>
                <Textarea
                  id="clinicalIndication"
                  rows={2}
                  value={clinicalIndication}
                  onChange={(e) => setClinicalIndication(e.target.value)}
                  placeholder="Reason for the order (optional)"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Add orders</CardTitle>
            <CardDescription>Pick from the lab, imaging, procedure or package catalog.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ToggleGroup
              type="single"
              value={catalogType}
              onValueChange={(value) => value && setCatalogType(value as CatalogOrderType)}
              className="flex flex-wrap justify-start gap-2"
            >
              {CATALOG_TYPES.map((type) => (
                <ToggleGroupItem key={type.value} value={type.value} variant="outline" className="rounded-full px-3">
                  {type.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            {blockingReason ? (
              <Alert>
                <AlertDescription>{blockingReason}</AlertDescription>
              </Alert>
            ) : (
              <div className={isSubmitting ? 'pointer-events-none opacity-60' : undefined}>
                <OrderAutocomplete
                  type={catalogType}
                  disabledCodes={existingCodes}
                  disabledIds={existingPackageIds}
                  onSelect={handleSelectItem}
                />
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Each selection is placed immediately as a{' '}
              <strong>{priority === OrderPriority.STAT ? 'STAT' : priority}</strong> order
              {orderingPhysician ? <> for <strong>{orderingPhysician.name}</strong></> : null}.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Orders on this encounter</CardTitle>
          <CardDescription>
            Includes orders placed from charting. Orders entered on behalf of a physician are tagged with how they
            were received.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isOrdersLoading ? (
            <p className="text-sm text-muted-foreground">Loading orders…</p>
          ) : totalOrders === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center text-sm text-muted-foreground">
              <FileText className="h-8 w-8" />
              No orders yet.
            </div>
          ) : (
            <div className="divide-y">
              {packageOrders.map((pkg) => (
                <div key={pkg.id} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:gap-3">
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <Badge variant="outline" className="text-[11px] uppercase">Package</Badge>
                      <span className="font-medium">{pkg.packageName}</span>
                      <span className="text-xs text-muted-foreground">
                        {pkg.childOrderCount} orders · {pkg.status}
                      </span>
                    </div>
                    {renderEntryMeta({
                      ...pkg,
                      priority: pkg.clinicalOrders[0]?.priority,
                    })}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="self-start text-muted-foreground hover:text-destructive sm:self-center"
                    onClick={() => handleCancelPackage(pkg)}
                    disabled={removingId === pkg.id || pkg.status === 'cancelled'}
                  >
                    <Trash2 className="mr-1 h-3.5 w-3.5" /> Cancel
                  </Button>
                </div>
              ))}
              {standaloneOrders.map((order) => {
                const hasResult = order.status === 'completed' || Boolean(order.resultStatus);
                return (
                  <div key={order.id} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:gap-3">
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <Badge variant="outline" className="text-[11px] capitalize">{order.orderType}</Badge>
                        <span className="font-medium">{order.orderName}</span>
                        <span className="text-xs text-muted-foreground">{order.orderCode}</span>
                      </div>
                      {renderEntryMeta(order)}
                    </div>
                    {hasResult ? (
                      <Link
                        href={`/${locale}/results/${order.orderType}/${order.id}`}
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                      >
                        <FileText className="h-3 w-3" /> Results
                      </Link>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="self-start text-muted-foreground hover:text-destructive sm:self-center"
                        onClick={() => handleRemoveOrder(order)}
                        disabled={removingId === order.id}
                      >
                        <Trash2 className="mr-1 h-3.5 w-3.5" /> Remove
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
