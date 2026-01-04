'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useSendProviderWebhook } from '@/modules/prm/hooks/use-providers';

export default function ProviderWebhooksPage() {
  const { toast } = useToast();
  const sendWebhook = useSendProviderWebhook();
  const [channel, setChannel] = useState('sms');
  const [payload, setPayload] = useState('{\n  \n}');

  const handleSend = async () => {
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(payload);
    } catch {
      toast({ title: 'Invalid JSON', description: 'Webhook payload must be valid JSON.', variant: 'destructive' });
      return;
    }

    if (!channel.trim()) {
      toast({ title: 'Channel required', description: 'Enter a provider channel.', variant: 'destructive' });
      return;
    }

    try {
      await sendWebhook.mutateAsync({ channel: channel.trim(), payload: parsed });
      toast({ title: 'Webhook sent', description: 'Provider webhook was posted successfully.', variant: 'success' });
    } catch (error: any) {
      const message = error?.response?.data?.message ?? 'Failed to send webhook.';
      toast({ title: 'Webhook failed', description: message, variant: 'destructive' });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Provider Webhook Tester</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="channel">Channel</Label>
          <Input id="channel" value={channel} onChange={(event) => setChannel(event.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="payload">Payload JSON</Label>
          <Textarea
            id="payload"
            rows={10}
            value={payload}
            onChange={(event) => setPayload(event.target.value)}
          />
        </div>
        <div className="flex justify-end">
          <Button type="button" onClick={handleSend} disabled={sendWebhook.isPending}>
            {sendWebhook.isPending ? 'Sending...' : 'Send Webhook'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
