'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProviderCallbacks } from '@/modules/prm/hooks/use-providers';

export default function ProviderCallbacksPage() {
  const [channel, setChannel] = useState('');
  const [processed, setProcessed] = useState('all');

  const filters = useMemo(() => {
    const next: { channel?: string; processed?: boolean } = {};
    if (channel.trim()) next.channel = channel.trim();
    if (processed === 'true') next.processed = true;
    if (processed === 'false') next.processed = false;
    return next;
  }, [channel, processed]);

  const { data, isLoading } = useProviderCallbacks(filters);
  const callbacks = Array.isArray(data) ? data : [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Provider Callbacks</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="channel">Channel</Label>
            <Input id="channel" value={channel} onChange={(event) => setChannel(event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Processed</Label>
            <Select value={processed} onValueChange={setProcessed}>
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
        </CardContent>
      </Card>
    </div>
  );
}
