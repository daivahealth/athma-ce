'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useCreatePayer } from '@/modules/rcm/hooks/use-payers';
import { PayerStatus } from '@/modules/rcm/types/payer';

export default function CreatePayerPage() {
  const params = useParams();
  const locale = params.locale as string;
  const router = useRouter();
  const toast = useToast();
  const createPayer = useCreatePayer();

  const [form, setForm] = useState({
    payerName: '',
    payerId: '',
    payerType: '',
    contactInfo: '',
    configuration: '',
    status: PayerStatus.ACTIVE,
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const payload = {
        payerName: form.payerName.trim(),
        payerId: form.payerId.trim() || undefined,
        payerType: form.payerType.trim() || undefined,
        status: form.status,
        contactInfo: form.contactInfo ? JSON.parse(form.contactInfo) : undefined,
        configuration: form.configuration ? JSON.parse(form.configuration) : undefined,
      };

      if (!payload.payerName) {
        toast({ variant: 'destructive', title: 'Payer name is required' });
        return;
      }

      await createPayer.mutateAsync(payload);
      toast({ title: 'Payer created', description: `${payload.payerName} added.` });
      router.push(`/${locale}/rcm-setup/payers`);
    } catch (error) {
      if (error instanceof SyntaxError) {
        toast({ variant: 'destructive', title: 'Invalid JSON', description: 'Check contact info/config fields.' });
        return;
      }
      toast({
        variant: 'destructive',
        title: 'Unable to create payer',
        description: error instanceof Error ? error.message : 'Please try again.',
      });
    }
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href={`/${locale}/rcm-setup/payers`}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to payers
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>New payer</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="payerName">Name *</Label>
                <Input
                  id="payerName"
                  value={form.payerName}
                  onChange={(event) => handleChange('payerName', event.target.value)}
                  placeholder="e.g., Gulf Cooperative Insurance"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="payerId">Payer ID</Label>
                <Input
                  id="payerId"
                  value={form.payerId}
                  onChange={(event) => handleChange('payerId', event.target.value)}
                  placeholder="Electronic ID"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="payerType">Type</Label>
                <Input
                  id="payerType"
                  value={form.payerType}
                  onChange={(event) => handleChange('payerType', event.target.value)}
                  placeholder="Insurance, government, etc"
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(value) => handleChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={PayerStatus.ACTIVE}>Active</SelectItem>
                    <SelectItem value={PayerStatus.INACTIVE}>Inactive</SelectItem>
                    <SelectItem value={PayerStatus.SUSPENDED}>Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactInfo">Contact info (JSON)</Label>
              <Textarea
                id="contactInfo"
                rows={4}
                value={form.contactInfo}
                onChange={(event) => handleChange('contactInfo', event.target.value)}
                placeholder='{"name":"Claims dept","email":"support@example.com"}'
                className="font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="configuration">Configuration (JSON)</Label>
              <Textarea
                id="configuration"
                rows={4}
                value={form.configuration}
                onChange={(event) => handleChange('configuration', event.target.value)}
                placeholder='{"clearinghouse":"Availity","electronicId":"12345"}'
                className="font-mono"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => router.push(`/${locale}/rcm-setup/payers`)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createPayer.isPending}>
                {createPayer.isPending ? 'Saving...' : 'Create payer'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
