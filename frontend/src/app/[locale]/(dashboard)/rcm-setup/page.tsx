'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, ReceiptText, Puzzle, Table, Handshake, Link2 } from 'lucide-react';

export default function RcmSetupPage() {
  const params = useParams();
  const locale = params.locale as string;

  const tiles = [
    {
      title: 'Payers',
      description: 'Manage insurance and government payers, contact info, and configuration.',
      icon: Building2,
      href: `/${locale}/rcm-setup/payers`,
    },
    {
      title: 'Billing items',
      description: 'Maintain CPT/internal codes, pricing, and charge master details.',
      icon: ReceiptText,
      href: `/${locale}/rcm-setup/billing-items`,
    },
    {
      title: 'Charge posting rules',
      description: 'Configure event-driven charge automation and pricing logic.',
      icon: Puzzle,
      href: `/${locale}/rcm-setup/charge-posting-rules`,
    },
    {
      title: 'Fee schedules',
      description: 'Manage base rates and payer-specific fee schedules.',
      icon: Table,
      href: `/${locale}/rcm-setup/fee-schedules`,
    },
    {
      title: 'Payer contracts',
      description: 'Configure payer agreements and contract adjustments.',
      icon: Handshake,
      href: `/${locale}/rcm-setup/payer-contracts`,
    },
    {
      title: 'Catalog mappings',
      description: 'Map clinical catalogs to billing items for automated charge capture.',
      icon: Link2,
      href: `/${locale}/rcm-setup/catalog-mappings`,
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">RCM Setup</h1>
        <p className="text-muted-foreground">
          Configure revenue cycle partners including payers, clearinghouses, and billing preferences.
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
                    Click to manage {tile.title.toLowerCase()} details.
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
