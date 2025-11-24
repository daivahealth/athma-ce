'use client';

import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import type { ColumnDef } from '@tanstack/react-table';
import { Search, Eye, Plus } from 'lucide-react';

import { ResourceTable } from '@/components/tables/resource-table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useChargePostingRules } from '@/modules/rcm/hooks/use-charge-posting-rules';
import type { ChargePostingRule } from '@/modules/rcm/types/charge-posting-rule';
import {
  EventType,
  EventSource,
  BillingItemType,
} from '@/modules/rcm/types/charge-posting-rule';

const toLabel = (value: string) => value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

const createColumns = (locale: string, router: ReturnType<typeof useRouter>): ColumnDef<ChargePostingRule>[] => [
  {
    accessorKey: 'ruleName',
    header: 'Rule',
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.original.ruleName}</p>
        <p className="text-xs text-muted-foreground">Priority {row.original.priority}</p>
      </div>
    ),
  },
  {
    accessorKey: 'eventType',
    header: 'Event',
    cell: ({ getValue }) => toLabel(getValue<string>()),
  },
  {
    accessorKey: 'billingItemType',
    header: 'Billing item',
    cell: ({ getValue }) => toLabel(getValue<string>()),
  },
  {
    accessorKey: 'chargeCalculationMethod',
    header: 'Calculation',
    cell: ({ getValue }) => toLabel(getValue<string>()),
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ getValue }) => {
      const active = getValue<boolean>();
      return <Badge variant={active ? 'default' : 'secondary'}>{active ? 'Active' : 'Inactive'}</Badge>;
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <Button variant="ghost" size="sm" onClick={() => router.push(`/${locale}/rcm-setup/charge-posting-rules/${row.original.id}`)}>
        <Eye className="mr-2 h-4 w-4" /> View
      </Button>
    ),
  },
];

export default function ChargePostingRulesPage() {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;

  const [search, setSearch] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState<'all' | EventType>('all');
  const [eventSourceFilter, setEventSourceFilter] = useState<'all' | EventSource>('all');
  const [billingTypeFilter, setBillingTypeFilter] = useState<'all' | BillingItemType>('all');
  const [activeOnly, setActiveOnly] = useState(false);

  const filters = useMemo(
    () => ({
      eventType: eventTypeFilter === 'all' ? undefined : eventTypeFilter,
      eventSource: eventSourceFilter === 'all' ? undefined : eventSourceFilter,
      billingItemType: billingTypeFilter === 'all' ? undefined : billingTypeFilter,
      isActive: activeOnly ? true : undefined,
    }),
    [eventTypeFilter, eventSourceFilter, billingTypeFilter, activeOnly],
  );

  const { data: rules, isLoading, error } = useChargePostingRules(filters);
  const columns = useMemo(() => createColumns(locale, router), [locale, router]);
  const sanitized = useMemo(() => rules ?? [], [rules]);
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return sanitized;
    return sanitized.filter((rule) =>
      `${rule.ruleName} ${rule.description ?? ''}`.toLowerCase().includes(term),
    );
  }, [sanitized, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[240px] max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search rules by name or description..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={eventTypeFilter} onValueChange={(value) => setEventTypeFilter(value as 'all' | EventType)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Event type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All events</SelectItem>
            {Object.values(EventType).map((type) => (
              <SelectItem key={type} value={type}>
                {toLabel(type)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={eventSourceFilter} onValueChange={(value) => setEventSourceFilter(value as 'all' | EventSource)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Event source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All sources</SelectItem>
            {Object.values(EventSource).map((type) => (
              <SelectItem key={type} value={type}>
                {toLabel(type)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={billingTypeFilter} onValueChange={(value) => setBillingTypeFilter(value as 'all' | BillingItemType)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Billing type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All billing items</SelectItem>
            {Object.values(BillingItemType).map((type) => (
              <SelectItem key={type} value={type}>
                {toLabel(type)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2">
          <Switch checked={activeOnly} onCheckedChange={setActiveOnly} />
          <span className="text-sm">Active only</span>
        </div>
      </div>

      {error ? (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          Failed to load rules: {(error as Error).message}
        </div>
      ) : (
        <ResourceTable
          title="Charge posting rules"
          cta={
            <Button size="sm" asChild>
              <Link href={`/${locale}/rcm-setup/charge-posting-rules/new`}>
                <Plus className="mr-2 h-4 w-4" /> New rule
              </Link>
            </Button>
          }
          columns={columns}
          data={filtered}
          isLoading={isLoading}
          emptyState={search ? 'No rules match your search.' : 'No rules defined yet.'}
          onRowClick={(row) => router.push(`/${locale}/rcm-setup/charge-posting-rules/${row.id}`)}
        />
      )}
    </div>
  );
}
