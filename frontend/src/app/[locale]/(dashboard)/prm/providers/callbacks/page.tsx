'use client';

import { useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProviderCallbacks } from '@/modules/prm/hooks/use-providers';
import { PRM_CHANNELS } from '@/modules/prm/constants/channels';
import type { ProviderCallbackFilters } from '@/modules/prm/services/providers-service';
import { DEFAULT_PAGE_SIZE, ListPagination, pageOffset } from '@/components/ui/list-pagination';

export default function ProviderCallbacksPage() {
  const params = useParams();
  const locale = params.locale as string;
  const [channel, setChannel] = useState('');
  const [processed, setProcessed] = useState('all');
  const [page, setPage] = useState(1);

  const filters = useMemo(() => {
    const next: ProviderCallbackFilters = {
      limit: DEFAULT_PAGE_SIZE,
      offset: pageOffset(page, DEFAULT_PAGE_SIZE),
    };
    if (channel.trim()) next.channel = channel.trim();
    if (processed === 'true') next.processed = true;
    if (processed === 'false') next.processed = false;
    return next;
  }, [channel, processed, page]);

  const { data, isLoading } = useProviderCallbacks(filters);
  const callbacks = data?.data ?? [];
  const total = data?.total ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/${locale}/pe-setup`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Provider Callbacks</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label>Channel</Label>
            <Select
              value={channel || 'all'}
              onValueChange={(value) => {
                setChannel(value === 'all' ? '' : value);
                setPage(1);
              }}
            >
              <SelectTrigger>
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {PRM_CHANNELS.map((channelOption) => (
                <SelectItem key={channelOption} value={channelOption}>
                  {channelOption.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
          <div className="space-y-2">
            <Label>Processed</Label>
            <Select
              value={processed}
              onValueChange={(value) => {
                setProcessed(value);
                setPage(1);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="true">Processed</SelectItem>
                <SelectItem value="false">Unprocessed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Callback Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading && <p className="text-sm text-muted-foreground">Loading callbacks...</p>}
          {!isLoading && callbacks.length === 0 && (
            <p className="text-sm text-muted-foreground">No callbacks found.</p>
          )}
          {!isLoading && callbacks.length > 0 && (
            <div className="divide-y rounded-md border">
              {callbacks.map((callback: any, index: number) => (
                <div key={callback.id ?? index} className="p-4">
                  <pre className="max-h-64 overflow-auto rounded-md bg-muted/40 p-3 text-xs">
                    {JSON.stringify(callback, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          )}
          {!isLoading && total > 0 && (
            <ListPagination
              page={page}
              pageSize={DEFAULT_PAGE_SIZE}
              total={total}
              onPageChange={setPage}
              itemLabel="callbacks"
              className="px-0"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
