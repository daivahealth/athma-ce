'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';
import {
  ArrowLeft,
  CalendarClock,
  ClipboardList,
  FileText,
  Loader2,
  Lock,
  Stethoscope,
  Trash2,
} from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ToneBadge } from '@/components/ui/tone-badge';
import type { BadgeTone } from '@/components/ui/tone-badge';
import { TONE_BAR, TONE_TEXT, TONE_WASH, toneOf } from '@/components/ui/tone-classes';
import { useToast } from '@/components/ui/use-toast';
import { OrderAutocomplete, type OrderSelection } from '@/components/autocomplete/catalog-autocomplete.order';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { cn } from '@/lib/utils';

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
import {
  encounterClassTone,
  encounterPriorityTone,
  encounterStatusTone,
} from '@/modules/clinical/utils/encounter-tone';
import { useStaff, useStaffSearch } from '@/modules/foundation/hooks/use-staff';
import type { StaffMember } from '@/modules/foundation/types/staff';

type CatalogOrderType = 'lab' | 'imaging' | 'procedure' | 'package';

const ORDER_TYPE_TONE: Record<CatalogOrderType, BadgeTone> = {
  lab: 'emerald',
  imaging: 'sky',
  procedure: 'violet',
  package: 'amber',
};

const CATALOG_TYPES: { value: CatalogOrderType; label: string; hint: string }[] = [
  { value: 'lab', label: 'Lab', hint: 'Lab tests' },
  { value: 'imaging', label: 'Imaging', hint: 'Imaging studies' },
  { value: 'procedure', label: 'Procedure', hint: 'Procedures' },
  { value: 'package', label: 'Package', hint: 'Grouped orders' },
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

const ORDER_MODE_TONE: Record<string, BadgeTone> = {
  direct: 'slate',
  verbal: 'fuchsia',
  telephone: 'cyan',
  written: 'indigo',
  protocol: 'teal',
};

const PRIORITY_OPTIONS: { value: OrderPriority; label: string }[] = [
  { value: OrderPriority.ROUTINE, label: 'Routine' },
  { value: OrderPriority.URGENT, label: 'Urgent' },
  { value: OrderPriority.STAT, label: 'STAT' },
];

const READ_BACK_MODES = new Set<OrderEntryMode>([OrderEntryMode.VERBAL, OrderEntryMode.TELEPHONE]);

const staffName = (staff?: Partial<StaffMember> | null) =>
  staff ? staff.displayName || `${staff.firstName ?? ''} ${staff.lastName ?? ''}`.trim() : '';

const initialsOf = (name?: string) =>
  (name ?? '?')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || '?';

const orderTypeTone = (type: string) => toneOf(ORDER_TYPE_TONE, type);
const orderModeTone = (mode?: string) => toneOf(ORDER_MODE_TONE, mode);

/** Numbered section heading used to make the two-step flow obvious. */
function StepHeading({ step, title, description, aside }: { step: number; title: string; description: string; aside?: ReactNode }) {
  return (
    <CardHeader className="space-y-0 pb-4">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
          {step}
        </span>
        <div className="min-w-0 flex-1 space-y-1">
          <CardTitle className="text-base">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        {aside}
      </div>
    </CardHeader>
  );
}

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
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
      {order.priority && (
        <ToneBadge tone={encounterPriorityTone(order.priority)} className="uppercase">
          {order.priority}
        </ToneBadge>
      )}
      {order.orderMode && order.orderMode !== OrderEntryMode.DIRECT && (
        <ToneBadge tone={orderModeTone(order.orderMode)} withDot>
          {ORDER_MODE_LABELS[order.orderMode] ?? order.orderMode} · on behalf
        </ToneBadge>
      )}
      <span className="inline-flex items-center gap-1">
        <Stethoscope className="h-3 w-3" />
        {staffMap.get(order.orderedBy) ?? 'Unknown physician'}
      </span>
      <span aria-hidden="true">·</span>
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
  const encounterPhysician = staffMap.get(encounter.primaryStaffId);
  const activeTypeTone = ORDER_TYPE_TONE[catalogType];
  const selectedModeLabel = ORDER_MODE_OPTIONS.find((option) => option.value === orderMode)?.label;

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div className="space-y-2">
        <Link
          href={`/${locale}/cpoe`}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to order entry
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Order Entry (CPOE)</h1>
          <p className="text-muted-foreground">
            Place orders for this encounter, including verbal, telephone and written orders on behalf of a physician.
          </p>
        </div>
      </div>

      {/* Patient & encounter banner */}
      <Card className="overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-primary/70 via-primary/40 to-transparent" aria-hidden="true" />
        <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:gap-6">
          <div className="flex min-w-0 flex-1 items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-base font-semibold text-primary ring-1 ring-primary/20">
              {initialsOf(patient?.displayName)}
            </div>
            <div className="min-w-0 space-y-1">
              <p className="truncate text-lg font-semibold leading-tight">{patient?.displayName ?? 'Unknown patient'}</p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                <span>
                  MRN <span className="font-mono text-foreground">{patient?.mrn ?? '—'}</span>
                </span>
                <span className="hidden h-3 w-px bg-border sm:block" aria-hidden="true" />
                <span className="capitalize">
                  {patient?.gender ?? '—'} · {patient?.age ?? '—'}y
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 border-t pt-4 text-sm sm:grid-cols-3 md:border-l md:border-t-0 md:pl-6 md:pt-0">
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Encounter</p>
              <p className="font-mono text-xs">{encounter.encounterNumber}</p>
              <div className="flex flex-wrap gap-1">
                <ToneBadge tone={encounterClassTone(encounter.encounterClass)}>{encounter.encounterClass}</ToneBadge>
                <ToneBadge tone={encounterStatusTone(encounter.status)} withDot className="capitalize">
                  {encounter.status.replace('-', ' ')}
                </ToneBadge>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Physician</p>
              <p className="flex items-center gap-1.5">
                <Stethoscope className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="truncate">{encounterPhysician ?? 'Unassigned'}</span>
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Started</p>
              <p className="flex items-center gap-1.5">
                <CalendarClock className="h-3.5 w-3.5 text-muted-foreground" />
                {format(new Date(encounter.startTime), 'MMM d, h:mm a')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {isEncounterClosed && (
        <Alert>
          <Lock className="h-4 w-4" />
          <AlertTitle>Encounter closed</AlertTitle>
          <AlertDescription>Orders can only be placed on open encounters.</AlertDescription>
        </Alert>
      )}

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)]">
        {/* Step 1 — who, how, how urgent */}
        <Card className="lg:sticky lg:top-20">
          <StepHeading
            step={1}
            title="Ordering details"
            description="Applies to every order you place. Your login is recorded as the person who entered it."
          />
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label>Ordering physician *</Label>
              {orderingPhysician && !isChangingPhysician ? (
                <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-background text-xs font-semibold ring-1 ring-border">
                    {initialsOf(orderingPhysician.name.replace(/^Dr\.?\s+/i, ''))}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{orderingPhysician.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {orderingPhysician.id === encounter.primaryStaffId ? 'Encounter physician' : 'Covering physician'}
                    </p>
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
                    <div className="max-h-48 overflow-auto rounded-lg border p-1">
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
                <div
                  className={cn(
                    'flex items-start gap-2.5 rounded-lg border p-3 text-sm transition-colors',
                    readBackConfirmed ? TONE_WASH.emerald : TONE_WASH.amber,
                  )}
                >
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

            <div className="space-y-2">
              <Label>Priority</Label>
              <div role="radiogroup" aria-label="Priority" className="grid grid-cols-3 gap-1 rounded-lg bg-muted/60 p-1">
                {PRIORITY_OPTIONS.map((option) => {
                  const isActive = priority === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      role="radio"
                      aria-checked={isActive}
                      onClick={() => setPriority(option.value)}
                      className={cn(
                        'rounded-md px-3 py-1.5 text-sm font-medium transition-all',
                        isActive
                          ? cn('bg-background shadow-sm ring-1 ring-border', TONE_TEXT[encounterPriorityTone(option.value)])
                          : 'text-muted-foreground hover:text-foreground',
                      )}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="clinicalIndication">Clinical indication</Label>
              <Textarea
                id="clinicalIndication"
                rows={3}
                value={clinicalIndication}
                onChange={(e) => setClinicalIndication(e.target.value)}
                placeholder="Reason for the order (optional)"
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* Step 2 — pick from the catalog */}
          <Card>
            <StepHeading
              step={2}
              title="Add orders"
              description="Each selection is placed immediately with the details from step 1."
            />
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {CATALOG_TYPES.map((type) => {
                  const tone = ORDER_TYPE_TONE[type.value];
                  const isActive = catalogType === type.value;
                  return (
                    <button
                      key={type.value}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => setCatalogType(type.value)}
                      className={cn(
                        'flex flex-col items-start rounded-lg border px-3 py-2 text-left transition-all',
                        isActive
                          ? cn(TONE_WASH[tone], 'shadow-sm')
                          : 'border-border hover:bg-muted/50',
                      )}
                    >
                      <span className={cn('flex items-center gap-1.5 text-sm font-semibold', isActive ? TONE_TEXT[tone] : '')}>
                        <span className={cn('h-2 w-2 rounded-full', TONE_BAR[tone])} aria-hidden="true" />
                        {type.label}
                      </span>
                      <span className="text-xs text-muted-foreground">{type.hint}</span>
                    </button>
                  );
                })}
              </div>

              {blockingReason ? (
                <div className="flex items-center gap-3 rounded-lg border border-dashed bg-muted/30 px-4 py-5 text-sm text-muted-foreground">
                  <Lock className="h-4 w-4 shrink-0" />
                  <span>{blockingReason}</span>
                </div>
              ) : (
                <div className={cn('transition-opacity', isSubmitting && 'pointer-events-none opacity-60')}>
                  <OrderAutocomplete
                    type={catalogType}
                    disabledCodes={existingCodes}
                    disabledIds={existingPackageIds}
                    onSelect={handleSelectItem}
                  />
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2 rounded-lg bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Ordering as</span>
                <span className="inline-flex items-center gap-1">
                  <Stethoscope className="h-3 w-3" />
                  {orderingPhysician?.name ?? 'No physician selected'}
                </span>
                {orderMode && (
                  <ToneBadge tone={orderModeTone(orderMode)} withDot>
                    {selectedModeLabel}
                  </ToneBadge>
                )}
                <ToneBadge tone={encounterPriorityTone(priority)} className="uppercase">
                  {priority}
                </ToneBadge>
                <ToneBadge tone={activeTypeTone}>{CATALOG_TYPES.find((t) => t.value === catalogType)?.label}</ToneBadge>
              </div>
            </CardContent>
          </Card>

          {/* Everything already on the encounter */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <ClipboardList className="h-4 w-4 text-muted-foreground" />
                    Orders on this encounter
                  </CardTitle>
                  <CardDescription>Includes orders placed from charting.</CardDescription>
                </div>
                <ToneBadge tone="slate">{totalOrders}</ToneBadge>
              </div>
            </CardHeader>
            <CardContent>
              {isOrdersLoading ? (
                <p className="text-sm text-muted-foreground">Loading orders…</p>
              ) : totalOrders === 0 ? (
                <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed py-10 text-center text-sm text-muted-foreground">
                  <FileText className="h-8 w-8 opacity-60" />
                  No orders yet.
                </div>
              ) : (
                <ul className="space-y-2">
                  {packageOrders.map((pkg) => (
                    <li
                      key={pkg.id}
                      className="relative flex flex-col gap-2 overflow-hidden rounded-lg border bg-card py-3 pl-4 pr-3 sm:flex-row sm:items-center"
                    >
                      <span className={cn('absolute inset-y-0 left-0 w-1', TONE_BAR.amber)} aria-hidden="true" />
                      <div className="min-w-0 flex-1 space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2 text-sm">
                          <ToneBadge tone="amber">Package</ToneBadge>
                          <span className="font-medium">{pkg.packageName}</span>
                          <span className="text-xs text-muted-foreground">
                            {pkg.childOrderCount} orders · <span className="capitalize">{pkg.status}</span>
                          </span>
                        </div>
                        {renderEntryMeta({ ...pkg, priority: pkg.clinicalOrders[0]?.priority })}
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
                    </li>
                  ))}
                  {standaloneOrders.map((order) => {
                    const hasResult = order.status === 'completed' || Boolean(order.resultStatus);
                    const tone = orderTypeTone(order.orderType);
                    return (
                      <li
                        key={order.id}
                        className="relative flex flex-col gap-2 overflow-hidden rounded-lg border bg-card py-3 pl-4 pr-3 sm:flex-row sm:items-center"
                      >
                        <span className={cn('absolute inset-y-0 left-0 w-1', TONE_BAR[tone])} aria-hidden="true" />
                        <div className="min-w-0 flex-1 space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2 text-sm">
                            <ToneBadge tone={tone} className="capitalize">{order.orderType}</ToneBadge>
                            <span className="font-medium">{order.orderName}</span>
                            <span className="font-mono text-xs text-muted-foreground">{order.orderCode}</span>
                          </div>
                          {renderEntryMeta(order)}
                        </div>
                        {hasResult ? (
                          <Button asChild variant="outline" size="sm" className="self-start sm:self-center">
                            <Link href={`/${locale}/results/${order.orderType}/${order.id}`}>
                              <FileText className="mr-1 h-3.5 w-3.5" /> Results
                            </Link>
                          </Button>
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
                      </li>
                    );
                  })}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
