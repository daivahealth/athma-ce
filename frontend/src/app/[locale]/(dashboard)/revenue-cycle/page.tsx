'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Layers, ShieldCheck, ClipboardList, ReceiptText } from 'lucide-react';

export default function RevenueCyclePage() {
  const params = useParams();
  const locale = params.locale as string;

  const tiles = [
    {
      title: 'Claims',
      description: 'Draft, validate, submit, and track insurance claims.',
      icon: FileText,
      href: `/${locale}/revenue-cycle/claims`,
    },
    {
      title: 'Batches',
      description: 'Group claims into batches and manage submissions.',
      icon: Layers,
      href: `/${locale}/revenue-cycle/batches`,
    },
    {
      title: 'Eligibility',
      description: 'Verify coverage and benefits for patients.',
      icon: ShieldCheck,
      href: `/${locale}/revenue-cycle/eligibility`,
    },
    {
      title: 'PreAuth',
      description: 'Manage prior authorization requests and approvals.',
      icon: ClipboardList,
      href: `/${locale}/revenue-cycle/preauth`,
    },
    {
      title: 'Remittance',
      description: 'Upload and reconcile ERA/EOB remittances.',
      icon: ReceiptText,
      href: `/${locale}/revenue-cycle/remittance`,
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Revenue Cycle</h1>
        <p className="text-muted-foreground">
          Manage claims processing, eligibility checks, prior auth, and remittance workflows.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {tiles.map((tile) => {
          const Icon = tile.icon;
          return (
            <Link key={tile.href} href={tile.href}>
              <Card className="hover:border-primary transition-colors cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle>{tile.title}</CardTitle>
                      <CardDescription>{tile.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Click to manage {tile.title.toLowerCase()}.
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
