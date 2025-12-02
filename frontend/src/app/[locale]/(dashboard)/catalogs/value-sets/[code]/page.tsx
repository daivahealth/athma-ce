'use client';

import { useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowLeft, Info, Search } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

import { ResourceTable } from '@/components/tables/resource-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  useSearchConcepts,
  useValueSet,
  useValueSetConcepts,
} from '@/modules/clinical/hooks/use-valuesets';
import type { ValueSetConcept } from '@/modules/clinical/types/valueset';

type ConceptRow = Pick<ValueSetConcept, 'id' | 'code' | 'display' | 'definition' | 'status'>;

const conceptColumns: ColumnDef<ConceptRow>[] = [
  {
    accessorKey: 'code',
    header: 'Code',
    cell: ({ row }) => <span className="font-mono text-sm font-semibold">{row.original.code}</span>,
  },
  {
    accessorKey: 'display',
    header: 'Display',
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.original.display}</p>
        <p className="text-xs text-muted-foreground">
          {row.original.definition || 'No definition provided'}
        </p>
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) =>
      getValue<string>() === 'active' ? (
        <Badge variant="default" className="bg-green-600">
          Active
        </Badge>
      ) : (
        <Badge variant="secondary">Inactive</Badge>
      ),
  },
];

export default function ValueSetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const code = params.code as string;

  const [language, setLanguage] = useState('en');
  const [includeInactive, setIncludeInactive] = useState(false);
  const [search, setSearch] = useState('');

  const isSearching = search.trim().length > 0;

  const {
    data: valueSet,
    isLoading: isLoadingValueSet,
    error: valueSetError,
  } = useValueSet(code);

  const {
    data: conceptsResponse,
    isLoading: isLoadingConcepts,
    error: conceptsError,
  } = useValueSetConcepts(code, { language, includeInactive }, { enabled: !isSearching });

  const {
    data: searchResults,
    isLoading: isSearchingConcepts,
    error: searchError,
  } = useSearchConcepts(search.trim(), { valueSetCode: code, language }, { enabled: isSearching });

  const conceptRows: ConceptRow[] = useMemo(() => {
    if (isSearching && searchResults) {
      return searchResults.map((result) => ({
        id: result.id,
        code: result.code,
        display: result.display,
        definition: null,
        status: 'active',
      }));
    }

    return conceptsResponse?.concepts ?? [];
  }, [conceptsResponse?.concepts, isSearching, searchResults]);

  const isLoading = isSearching ? isSearchingConcepts : isLoadingConcepts;
  const loadError = valueSetError || conceptsError || searchError;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.push(`/${locale}/catalogs/value-sets`)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to value sets
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{valueSet?.name || code}</h1>
          <p className="text-muted-foreground font-mono text-sm">{valueSet?.code}</p>
        </div>
        {valueSet?.status && (
          <Badge
            variant={valueSet.status === 'active' ? 'default' : 'secondary'}
            className="ml-auto"
          >
            {valueSet.status === 'active' ? 'Active' : 'Inactive'}
          </Badge>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Value set overview</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div>
            <p className="text-sm text-muted-foreground">Category</p>
            <p className="font-medium capitalize">{valueSet?.category || 'Uncategorized'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Version</p>
            <p className="font-medium">{valueSet?.version || '—'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Concepts</p>
            <p className="font-medium">
              {valueSet?.conceptCount ?? conceptsResponse?.totalCount ?? '—'}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Source</p>
            <p className="font-medium">{valueSet?.source || 'Not specified'}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-muted-foreground">Description</p>
            <p className="font-medium">{valueSet?.description || 'No description available.'}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-4 w-4" /> Concepts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search concepts (code, display, definition)..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={language} onValueChange={(value) => setLanguage(value)}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English (en)</SelectItem>
                <SelectItem value="ar">Arabic (ar)</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <Switch
                id="include-inactive"
                checked={includeInactive}
                onCheckedChange={setIncludeInactive}
                disabled={isSearching}
              />
              <label htmlFor="include-inactive" className="text-sm text-muted-foreground">
                Include inactive
              </label>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            {isSearching
              ? 'Showing search results (top 50). Include inactive is disabled while searching.'
              : 'Concepts are localized when translations exist.'}
          </p>

          {loadError ? (
            <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
              Unable to load concepts: {(loadError as Error).message}
            </div>
          ) : (
            <ResourceTable
              title="Concepts"
              columns={conceptColumns}
              data={conceptRows}
              isLoading={isLoading || isLoadingValueSet}
              emptyState={isSearching ? 'No matching concepts found.' : 'No concepts available.'}
              cta={<div />}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
