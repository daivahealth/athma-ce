'use client';

import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { useNoteTemplate, useArchiveNoteTemplate } from '@/modules/foundation/hooks/use-catalogs';
import { TemplateStatus } from '@/modules/foundation/types/catalog';

const statusLabels: Record<TemplateStatus, string> = {
  [TemplateStatus.ACTIVE]: 'Active',
  [TemplateStatus.INACTIVE]: 'Inactive',
  [TemplateStatus.ARCHIVED]: 'Archived',
};

const statusVariant: Record<TemplateStatus, 'default' | 'secondary' | 'outline'> = {
  [TemplateStatus.ACTIVE]: 'default',
  [TemplateStatus.INACTIVE]: 'secondary',
  [TemplateStatus.ARCHIVED]: 'outline',
};

export default function NoteTemplateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const templateId = params.id as string;
  const toast = useToast();
  const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);

  const {
    data: template,
    isLoading,
    error,
  } = useNoteTemplate(templateId);
  const { mutateAsync: archiveTemplate, isPending: isArchiving } = useArchiveNoteTemplate();

  const latestVersion = useMemo(() => template?.versions?.[0], [template]);
  const versions = template?.versions ?? [];

  const handleArchive = async () => {
    if (!template) return;
    try {
      await archiveTemplate(template.id);
      toast({ title: 'Template archived', description: `${template.name} moved to archive.` });
      setIsArchiveDialogOpen(false);
      router.push(`/${locale}/catalogs/note-templates`);
    } catch (err) {
      console.error(err);
      toast({
        variant: 'destructive',
        title: 'Unable to archive template',
        description: err instanceof Error ? err.message : 'Please try again.',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-9 w-48 animate-pulse rounded bg-muted" />
        <div className="h-32 animate-pulse rounded bg-muted" />
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
        {error ? `Unable to load template: ${(error as Error).message}` : 'Template not found.'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.push(`/${locale}/catalogs/note-templates`)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to templates
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{template.name}</h1>
          {template.description && <p className="text-muted-foreground">{template.description}</p>}
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <Badge variant={statusVariant[template.status]}>{statusLabels[template.status]}</Badge>
          <Badge variant="secondary" className="text-xs">v{template.currentVersion}</Badge>
          <Badge variant="outline" className="text-xs">
            {template.tenantId ? 'Tenant template' : 'Global default'}
          </Badge>
          {template.tenantId && template.status !== TemplateStatus.ARCHIVED && (
            <Button
              variant="outline"
              size="sm"
              className="text-destructive border-destructive/30"
              onClick={() => setIsArchiveDialogOpen(true)}
            >
              Archive template
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Template overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Specialty</p>
              <p>{template.specialtyId ?? 'All specialties'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Scope</p>
              <p>{template.tenantId ? 'Tenant-specific' : 'Global default'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Created</p>
              <p>{format(new Date(template.createdAt), 'PPpp')}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Last updated</p>
              <p>{format(new Date(template.updatedAt), 'PPpp')}</p>
            </div>
          </div>
          {template.description && (
            <div>
              <Separator className="my-4" />
              <p className="text-sm text-muted-foreground">{template.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Latest version</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {latestVersion ? (
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between text-sm">
                <span className="font-medium">Version {latestVersion.version}</span>
                <span className="text-muted-foreground">
                  {format(new Date(latestVersion.createdAt), 'PPpp')}
                </span>
              </div>
              {latestVersion.changeLog && (
                <p className="text-sm text-muted-foreground">{latestVersion.changeLog}</p>
              )}
              <div className="rounded-md border bg-muted/30 p-4 text-xs font-mono">
                <pre className="max-h-[400px] overflow-auto whitespace-pre-wrap break-words">
                  {JSON.stringify(latestVersion.schema, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No versions available.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Version history</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {versions.length ? (
            versions.map((version) => (
              <div key={version.id} className="rounded-md border p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-medium">Version {version.version}</div>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(version.createdAt), 'PPpp')}
                  </span>
                </div>
                {version.changeLog && (
                  <p className="text-sm text-muted-foreground">{version.changeLog}</p>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No version history available.</p>
          )}
        </CardContent>
      </Card>

      <Dialog open={isArchiveDialogOpen} onOpenChange={setIsArchiveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Archive template</DialogTitle>
            <DialogDescription>
              Archived templates are hidden from charting but remain in history. You can reactivate them later.
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to archive <span className="font-medium">{template.name}</span>?
          </p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsArchiveDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleArchive}
              disabled={isArchiving}
            >
              {isArchiving ? 'Archiving...' : 'Archive template'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
