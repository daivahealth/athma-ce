'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useCreateRemittance } from '@/modules/rcm/hooks/use-remittance';
import type { RemittanceFormat } from '@/modules/rcm/types/remittance';

const formatOptions: RemittanceFormat[] = ['ERA_835', 'EOB_PDF', 'MANUAL', 'JSON'];

export default function NewRemittancePage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const toast = useToast();
  const createRemittance = useCreateRemittance();

  const [payerId, setPayerId] = useState('');
  const [format, setFormat] = useState<RemittanceFormat>('ERA_835');
  const [checkNumber, setCheckNumber] = useState('');
  const [checkDate, setCheckDate] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [linesJson, setLinesJson] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!payerId.trim() || !paymentAmount.trim()) return;

    let lines: any[] | undefined;
    if (linesJson.trim()) {
      try {
        lines = JSON.parse(linesJson);
      } catch {
        toast({ variant: 'destructive', title: 'Invalid lines JSON' });
        return;
      }
    }

    await createRemittance.mutateAsync({
      remittance: {
        payerId: payerId.trim(),
        format,
        checkNumber: checkNumber.trim() || undefined,
        checkDate: checkDate ? new Date(checkDate).toISOString() : undefined,
        paymentAmount: Number(paymentAmount) || 0,
        fileContent: fileContent.trim() || undefined,
      },
      lines,
    });

    toast({ title: 'Remittance created' });
    router.push(`/${locale}/revenue-cycle/remittance`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/${locale}/revenue-cycle/remittance`} aria-label="Back to remittance">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            New remittance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Payer ID *</Label>
              <Input
                value={payerId}
                onChange={(event) => setPayerId(event.target.value)}
                placeholder="Payer UUID"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Format *</Label>
              <Select value={format} onValueChange={(value) => setFormat(value as RemittanceFormat)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  {formatOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Check number</Label>
              <Input value={checkNumber} onChange={(event) => setCheckNumber(event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Check date</Label>
              <Input type="date" value={checkDate} onChange={(event) => setCheckDate(event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Payment amount *</Label>
              <Input
                type="number"
                step="0.01"
                value={paymentAmount}
                onChange={(event) => setPaymentAmount(event.target.value)}
                required
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>File content</Label>
              <Textarea
                value={fileContent}
                onChange={(event) => setFileContent(event.target.value)}
                placeholder="Paste remittance payload or raw file content."
                rows={4}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Lines (JSON array)</Label>
              <Textarea
                value={linesJson}
                onChange={(event) => setLinesJson(event.target.value)}
                placeholder='[{"claimNumber":"CLM202502000001","billedAmount":100,"paidAmount":80}]'
                rows={5}
              />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <Button type="submit" disabled={createRemittance.isPending}>
                Create remittance
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
