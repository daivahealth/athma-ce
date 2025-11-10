'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Pill, Beaker, Scan, Scissors } from 'lucide-react';

export default function CatalogsPage() {
  const params = useParams();
  const locale = params.locale as string;

  const catalogs = [
    {
      title: 'Medications',
      description: 'Manage medication formulary, NDC codes, drug classes, and dosage forms',
      icon: Pill,
      href: `/${locale}/catalogs/medications`,
      count: '—',
    },
    {
      title: 'Lab Tests',
      description: 'Manage lab test catalog with LOINC codes, specimen types, and reference ranges',
      icon: Beaker,
      href: `/${locale}/catalogs/lab-tests`,
      count: '—',
    },
    {
      title: 'Imaging Studies',
      description: 'Manage imaging catalog with modalities, body parts, and CPT codes',
      icon: Scan,
      href: `/${locale}/catalogs/imaging-studies`,
      count: '—',
    },
    {
      title: 'Procedures',
      description: 'Manage procedure catalog with CPT codes, ICD-10-PCS codes, and anesthesia types',
      icon: Scissors,
      href: `/${locale}/catalogs/procedures`,
      count: '—',
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Master Catalogs</h1>
        <p className="text-muted-foreground">
          Manage healthcare master data including medications, lab tests, imaging studies, and procedures
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {catalogs.map((catalog) => {
          const Icon = catalog.icon;
          return (
            <Link key={catalog.href} href={catalog.href}>
              <Card className="hover:border-primary transition-colors cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle>{catalog.title}</CardTitle>
                      <CardDescription className="text-xs">{catalog.count} entries</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{catalog.description}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
