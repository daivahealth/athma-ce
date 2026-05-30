'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Pill, Beaker, Scan, Scissors, Stethoscope, NotebookPen, ListChecks, Package, ClipboardList, Activity, ClipboardCheck, Sparkles, Waypoints } from 'lucide-react';
import { useCatalogPopulationHistory } from '@/modules/clinical/hooks/use-catalog-population';

export default function CatalogsPage() {
  const params = useParams();
  const locale = params.locale as string;
  const { data: populationHistory } = useCatalogPopulationHistory();

  // Show setup banner if no population has ever been completed
  const hasCompletedPopulation = populationHistory?.some((j) => j.status === 'completed');
  const hasRunningJob = populationHistory?.some((j) => j.status === 'running' || j.status === 'pending');

  const catalogs = [
    {
      title: 'Value Sets',
      description: 'Manage standardized value sets with localization and tenant overrides',
      icon: ListChecks,
      href: `/${locale}/catalogs/value-sets`,
      count: '—',
    },
    {
      title: 'Packages',
      description: 'Configure bundled services such as health checks and surgical packages',
      icon: Package,
      href: `/${locale}/catalogs/packages`,
      count: '—',
    },
    {
      title: 'Administrative Services',
      description: 'Manage registration, consultation, and other administrative services',
      icon: ClipboardList,
      href: `/${locale}/catalogs/administrative-services`,
      count: '—',
    },
    {
      title: 'Vital Signs Templates',
      description: 'Standardize vitals capture by care setting and age group',
      icon: Activity,
      href: `/${locale}/catalogs/vital-signs-templates`,
      count: '—',
    },
    {
      title: 'Medications',
      description: 'Manage medication formulary, NDC codes, drug classes, and dosage forms',
      icon: Pill,
      href: `/${locale}/catalogs/medications`,
      count: '—',
    },
    {
      title: 'Diagnoses',
      description: 'Browse ICD releases, diagnoses, and tenant-specific overrides',
      icon: Stethoscope,
      href: `/${locale}/catalogs/diagnoses`,
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
      title: 'Observation Codes',
      description: 'Browse canonical coded analytes and observation definitions used in result entry and analytics',
      icon: Waypoints,
      href: `/${locale}/catalogs/observation-codes`,
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
    {
      title: 'Note Templates',
      description: 'Manage clinical note templates, versions, and specialty-specific documentation standards',
      icon: NotebookPen,
      href: `/${locale}/catalogs/note-templates`,
      count: '—',
    },
    {
      title: 'Checklist Templates',
      description: 'Manage template-driven checklists for inpatient and outpatient workflows',
      icon: ClipboardCheck,
      href: `/${locale}/catalogs/checklists`,
      count: '—',
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Clinical Catalogs</h1>
        <p className="text-muted-foreground">
          Manage healthcare master data including medications, diagnoses, lab tests, imaging studies, and procedures
        </p>
      </div>

      {/* Setup banner - shown when no catalogs have been populated */}
      {!hasCompletedPopulation && !hasRunningJob && (
        <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900">
          <Sparkles className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-800 dark:text-blue-300">Setup Your Catalogs</AlertTitle>
          <AlertDescription className="text-blue-700 dark:text-blue-400">
            <div className="flex items-center justify-between">
              <span>
                Auto-populate your catalogs with country-specific healthcare data using curated templates and AI generation.
              </span>
              <Link href={`/${locale}/catalogs/setup`}>
                <Button size="sm" className="ml-4 shrink-0">
                  <Sparkles className="mr-2 h-3.5 w-3.5" />
                  Setup Catalogs
                </Button>
              </Link>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {hasRunningJob && (
        <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900">
          <Sparkles className="h-4 w-4 text-amber-600 animate-pulse" />
          <AlertTitle className="text-amber-800 dark:text-amber-300">Catalog Population In Progress</AlertTitle>
          <AlertDescription className="text-amber-700 dark:text-amber-400">
            <div className="flex items-center justify-between">
              <span>A catalog population job is currently running. You can track its progress.</span>
              <Link href={`/${locale}/catalogs/setup`}>
                <Button variant="outline" size="sm" className="ml-4 shrink-0">
                  View Progress
                </Button>
              </Link>
            </div>
          </AlertDescription>
        </Alert>
      )}

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
