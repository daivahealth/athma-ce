'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMessages } from '@/modules/prm/hooks/use-messages';

export default function PrmMessagesPage({ params }: { params: { locale: string } }) {
  const [patientId, setPatientId] = useState('');
  const [channel, setChannel] = useState('all');
  const [status, setStatus] = useState('');

  const filters = useMemo(() => {
    const next: { patientId?: string; channel?: string; status?: string } = {};
    if (patientId.trim()) next.patientId = patientId.trim();
    if (channel !== 'all' && channel.trim()) next.channel = channel.trim();
    if (status.trim()) next.status = status.trim();
    return next;
  }, [patientId, channel, status]);

  const { data, isLoading } = useMessages(filters);
  const messages = Array.isArray(data) ? data : [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Messages</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="patientId">Patient ID</Label>
            <Input id="patientId" value={patientId} onChange={(event) => setPatientId(event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Channel</Label>
            <Select value={channel} onValueChange={setChannel}>
              <SelectTrigger>
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="in_app">In App</SelectItem>
                <SelectItem value="push">Push</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Input id="status" value={status} onChange={(event) => setStatus(event.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Message Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading && <p className="text-sm text-muted-foreground">Loading messages...</p>}
          {!isLoading && messages.length === 0 && (
            <p className="text-sm text-muted-foreground">No messages found.</p>
          )}
          {!isLoading && messages.length > 0 && (
            <div className="divide-y rounded-md border">
              {messages.map((message: any, index: number) => {
                const id = message.id || message.message_id || String(index);
                return (
                  <div key={id} className="flex flex-wrap items-center justify-between gap-4 p-4">
                    <div>
                      <p className="text-sm text-muted-foreground">{message.channel ?? 'Unknown channel'}</p>
                      <p className="text-base font-semibold">{message.subject ?? message.title ?? 'Message'}</p>
                      <p className="text-xs text-muted-foreground">
                        Status: {message.status ?? 'unknown'}
                      </p>
                    </div>
                    {message.id && (
                      <Link
                        href={`/${params.locale}/prm/messages/${message.id}`}
                        className="text-sm font-medium text-primary"
                      >
                        View
                      </Link>
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
