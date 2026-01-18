'use client';

import { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useChecklistTemplate } from '@/modules/clinical/hooks/use-checklists';
import type { ChecklistTemplateItem } from '@/modules/clinical/types/checklist';
import { AddItemDialog } from './_components/add-item-dialog';

const groupItems = (items: ChecklistTemplateItem[]) => {
  const grouped = new Map<string, ChecklistTemplateItem[]>();
  items.forEach((item) => {
    const key = item.sectionName || 'General';
    const list = grouped.get(key) ?? [];
    list.push(item);
    grouped.set(key, list);
  });
  return Array.from(grouped.entries()).map(([section, list]) => ({
    section,
    items: list.sort((a, b) => a.sortOrder - b.sortOrder),
  }));
};

export default function ChecklistTemplateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const templateId = params.id as string;

  const { data: template, isLoading } = useChecklistTemplate(templateId);

  const sections = useMemo(() => {
    if (!template?.items) return [];
    return groupItems(template.items);
  }, [template?.items]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.push(`/${locale}/catalogs/checklists`)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">Checklist Template</h1>
            <p className="text-sm text-muted-foreground">Template details and item structure.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {template?.status && (
            <Badge variant="secondary" className="uppercase">
              {template.status}
            </Badge>
          )}
          {template && <AddItemDialog templateId={templateId} />}
        </div>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading template...</p>
      ) : !template ? (
        <p className="text-sm text-muted-foreground">Template not found.</p>
      ) : (
        <Card>
          <CardHeader className="space-y-3">
            <div>
              <CardTitle>{template.name}</CardTitle>
              {template.description && <p className="text-sm text-muted-foreground">{template.description}</p>}
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span>Code: {template.code}</span>
              <span>•</span>
              <span>Category: {template.category}</span>
              <span>•</span>
              <span>Version: v{template.version}</span>
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span>Requires verification: {template.requiresVerification ? 'Yes' : 'No'}</span>
              <span>•</span>
              <span>Auto-create: {template.autoCreateEnabled ? 'Enabled' : 'Disabled'}</span>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="space-y-6">
            {sections.length === 0 ? (
              <p className="text-sm text-muted-foreground">No items defined for this template.</p>
            ) : (
              sections.map((section) => (
                <div key={section.section} className="space-y-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    {section.section}
                  </h3>
                  <div className="space-y-3">
                    {section.items.map((item) => (
                      <div key={item.id} className="rounded-lg border border-border/50 p-4">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-medium">{item.label}</p>
                          <Badge variant="outline" className="text-[10px] uppercase">
                            {item.itemType}
                          </Badge>
                        </div>
                        {item.helpText && <p className="text-xs text-muted-foreground mt-1">{item.helpText}</p>}
                        <div className="mt-2 text-xs text-muted-foreground">
                          Key: <span className="font-mono">{item.itemKey}</span>
                          {item.isRequired ? ' · Required' : ' · Optional'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
