'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useSendProviderWebhook } from '@/modules/prm/hooks/use-providers';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PRM_CHANNELS } from '@/modules/prm/constants/channels';

export default function ProviderWebhooksPage() {
  const params = useParams();
  const locale = params.locale as string;
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
          <CardTitle>Provider Webhook Tester</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Channel</Label>
          <Select value={channel} onValueChange={setChannel}>
            <SelectTrigger>
              <SelectValue placeholder="Select channel" />
            </SelectTrigger>
            <SelectContent>
              {PRM_CHANNELS.map((channelOption) => (
                <SelectItem key={channelOption} value={channelOption}>
                  {channelOption.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
    </div>
  );
}
