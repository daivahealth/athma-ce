'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardList, FileText, Settings, Handshake, Split } from 'lucide-react';

export default function PeSetupPage() {
  const params = useParams();
  const locale = params.locale as string;

  const tiles = [
    {
      title: 'Rules',
      description: 'Configure event-driven engagement rules and automation logic.',
      icon: ClipboardList,
      href: `/${locale}/prm/rules`,
    },
    {
      title: 'Templates',
      description: 'Manage engagement message templates across channels.',
      icon: FileText,
      href: `/${locale}/prm/templates`,
    },
    {
      title: 'Preferences',
      description: 'Update patient communication preferences and consent.',
      icon: Settings,
      href: `/${locale}/prm/preferences`,
    },
    {
      title: 'Provider callbacks',
      description: 'Review inbound provider callbacks and delivery updates.',
      icon: Handshake,
      href: `/${locale}/prm/providers/callbacks`,
    },
    {
      title: 'Webhook tester',
      description: 'Simulate provider webhooks for debugging and validation.',
      icon: Split,
      href: `/${locale}/prm/providers/webhooks`,
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">PE Setup</h1>
        <p className="text-muted-foreground">
          Configure patient engagement rules, templates, preferences, and provider integrations.
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
