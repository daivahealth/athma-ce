'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Edit,
  Trash2,
  LayoutGrid,
  BookOpen,
  CalendarDays,
  Tags,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useDiagnosis } from '@/modules/foundation/hooks/use-catalogs';

const formatList = (items?: string[]) => {
  if (!items || items.length === 0) return '—';
  return items.join(', ');
};

export default function DiagnosisDetailPage() {
  const params = useParams();
  const router = useRouter();
  const diagnosisId = params.id as string;
  const locale = params.locale as string;

  const { data: diagnosis, isLoading, error } = useDiagnosis(diagnosisId);

  const summaryCards = useMemo(() => {
    if (!diagnosis) return [];
    return [
      {
        label: 'Chapter',
        value: diagnosis.chapter || '—',
        helper: diagnosis.block || '—',
      },
      {
        label: 'Category',
        value: diagnosis.category || '—',
        helper: diagnosis.subcategory || '—',
      },
      {
        label: 'Billable',
        value: diagnosis.isBillable ? 'Yes' : 'No',
        helper: diagnosis.codeType ? `Type: ${diagnosis.codeType}` : '—',
      },
      {
        label: 'Scope',
        value: diagnosis.tenantId ? 'Tenant-specific' : 'Global catalog',
        helper: diagnosis.version?.codeSet || '—',
      },
    ];
  }, [diagnosis]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-1/4 animate-pulse rounded bg-muted" />
        <div className="h-44 animate-pulse rounded bg-muted" />
      </div>
    );
  }

  if (error || !diagnosis) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => router.push(`/${locale}/catalogs/diagnoses`)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Diagnoses
        </Button>
        <Card className="border-destructive/40 bg-destructive/10">
          <CardHeader>
            <CardTitle className="text-destructive">Unable to load diagnosis</CardTitle>
          </CardHeader>
          <CardContent>Diagnosis not found or you do not have permission to view it.</CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push(`/${locale}/catalogs/diagnoses`)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="secondary" className="font-mono text-lg">
                {diagnosis.code}
              </Badge>
              {diagnosis.isBillable ? (
                <Badge variant="outline" className="border-green-500 text-green-600">
                  Billable
                </Badge>
              ) : (
                <Badge variant="secondary">Reference</Badge>
              )}
              <Badge variant={diagnosis.isActive ? 'default' : 'secondary'}>
                {diagnosis.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <h1 className="mt-3 text-3xl font-bold">
              {diagnosis.shortDescription || diagnosis.description}
            </h1>
            <p className="text-muted-foreground">{diagnosis.description}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="outline" size="sm">
            <Trash2 className="mr-2 h-4 w-4" />
            Deactivate
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {summaryCards.map((card) => (
          <Card key={card.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold">{card.value}</p>
              <p className="text-xs text-muted-foreground">{card.helper}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Classification</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-muted-foreground">ICD Version</label>
            <p className="text-base">
              {diagnosis.version?.codeSet || '—'} ({diagnosis.version?.versionLabel || '—'})
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Code Type</label>
            <p className="text-base">{diagnosis.codeType || '—'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Chapter</label>
            <p className="text-base">{diagnosis.chapter || '—'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Block</label>
            <p className="text-base">{diagnosis.block || '—'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Category</label>
            <p className="text-base">{diagnosis.category || '—'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Subcategory</label>
            <p className="text-base">{diagnosis.subcategory || '—'}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LayoutGrid className="h-4 w-4" /> Clinical Concepts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Clinical Concepts</label>
            <p>{formatList(diagnosis.clinicalConcepts)}</p>
          </div>
          <Separator />
          <div>
            <label className="text-sm font-medium text-muted-foreground">Synonyms</label>
            <p>{formatList(diagnosis.synonyms)}</p>
          </div>
          <Separator />
          <div>
            <label className="text-sm font-medium text-muted-foreground">Search Terms</label>
            <p>{formatList(diagnosis.searchTerms)}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" /> Version Metadata
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Release Date</label>
            <p>{diagnosis.version?.releaseDate ? new Date(diagnosis.version.releaseDate).toLocaleDateString() : '—'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Import Status</label>
            <p className="capitalize">{diagnosis.version?.importStatus || '—'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Source</label>
            <p>{diagnosis.version?.sourceUrl ? (
              <Link href={diagnosis.version.sourceUrl} className="text-primary underline" target="_blank">
                {diagnosis.version.sourceUrl}
              </Link>
            ) : '—'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Checksum</label>
            <p className="font-mono text-xs">{diagnosis.version?.checksum || '—'}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" /> Effective Dates
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Effective From</label>
            <p>{diagnosis.effectiveFrom ? new Date(diagnosis.effectiveFrom).toLocaleDateString() : '—'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Effective To</label>
            <p>{diagnosis.effectiveTo ? new Date(diagnosis.effectiveTo).toLocaleDateString() : '—'}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tags className="h-4 w-4" /> Additional Info
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Tenant Scope</label>
            <p>{diagnosis.tenantId ? 'Tenant-specific' : 'Global catalog'} </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Created At</label>
            <p>{new Date(diagnosis.createdAt).toLocaleString()}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Updated At</label>
            <p>{new Date(diagnosis.updatedAt).toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
