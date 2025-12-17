'use client';

import { Fragment, useMemo, useState } from 'react';
import { ArrowLeft, Code2, List } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useVitalSignsTemplate } from '@/modules/clinical/hooks/use-vital-signs-templates';
import type { VitalGroup, VitalItem } from '@/modules/clinical/types/vital-signs-template';

const careSettingLabels: Record<string, string> = {
  OPD: 'OPD',
  ER: 'ER',
  IPD: 'IPD',
  ICU: 'ICU',
  DAYCARE: 'Daycare',
  ANY: 'Any',
};

const ageGroupLabels: Record<string, string> = {
  newborn: 'Newborn',
  infant: 'Infant',
  child: 'Child',
  adolescent: 'Adolescent',
  adult: 'Adult',
  elderly: 'Elderly',
  all: 'All',
};

function ItemRow({ item }: { item: VitalItem }) {
  return (
    <div className="rounded-lg border p-3">
      <div className="flex flex-wrap items-start gap-3">
        <div className="flex-1">
          <p className="font-semibold">{item.label?.en ?? item.id}</p>
          <p className="font-mono text-xs text-muted-foreground">{item.code}</p>
          {item.loincCode && <p className="text-xs text-muted-foreground">LOINC: {item.loincCode}</p>}
        </div>
        <Badge variant="secondary" className="text-xs capitalize">
          {item.type}
        </Badge>
        {item.required && <Badge variant="default">Required</Badge>}
        {item.readOnly && <Badge variant="outline">Read only</Badge>}
      </div>
      <div className="mt-2 grid gap-2 md:grid-cols-3">
        <div>
          <p className="text-xs text-muted-foreground">Unit</p>
          <p className="text-sm">{item.defaultUnit || item.unitOptions?.join(', ') || '—'}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Range</p>
          <p className="text-sm">
            {item.normalRange ? `${item.normalRange.min} - ${item.normalRange.max}` : '—'}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Dependencies</p>
          <p className="text-sm">{item.dependsOn?.join(', ') || '—'}</p>
        </div>
      </div>
      {item.options && item.options.length > 0 && (
        <div className="mt-2">
          <p className="text-xs text-muted-foreground">Options</p>
          <div className="flex flex-wrap gap-2">
            {item.options.map((option) => (
              <Badge key={option.value} variant="outline" className="text-xs">
                {option.label?.en ?? option.value}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function GroupSection({ group }: { group: VitalGroup }) {
  const items = useMemo(
    () => group.items.slice().sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
    [group.items],
  );

  return (
    <div className="space-y-3 rounded-lg border p-4">
      <div className="flex items-center gap-2">
        <p className="text-lg font-semibold">{group.label?.en ?? group.id}</p>
        <Badge variant="secondary" className="text-xs">
          {items.length} items
        </Badge>
      </div>
      <div className="space-y-3">
        {items.map((item, index) => (
          <Fragment key={item.id}>
            <ItemRow item={item} />
            {index < items.length - 1 && <Separator />}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export default function VitalSignsTemplateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const id = params.id as string;
  const [groupsViewMode, setGroupsViewMode] = useState<'table' | 'json'>('table');

  const {
    data: template,
    isLoading,
    error,
  } = useVitalSignsTemplate(id);

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

  const sortedGroups = template.groups
    ? template.groups.slice().sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/${locale}/catalogs/vital-signs-templates`)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to templates
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{template.name?.en ?? template.templateCode}</h1>
          <p className="font-mono text-sm text-muted-foreground">{template.templateCode}</p>
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <Badge variant="secondary">v{template.version}</Badge>
          {template.isDefault && <Badge variant="default">Default</Badge>}
          <Badge variant={template.isActive ? 'default' : 'secondary'}>
            {template.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Template overview</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div>
            <p className="text-sm text-muted-foreground">Care settings</p>
            <div className="flex flex-wrap gap-1">
              {template.careSetting.map((setting) => (
                <Badge key={setting} variant="secondary" className="text-xs">
                  {careSettingLabels[setting] || setting}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Age groups</p>
            <div className="flex flex-wrap gap-1">
              {template.ageGroup.map((age) => (
                <Badge key={age} variant="outline" className="text-xs">
                  {ageGroupLabels[age] || age}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Specialties</p>
            <p className="font-medium">
              {template.specialties.length ? template.specialties.join(', ') : 'All'}
            </p>
          </div>
          <div className="md:col-span-3">
            <p className="text-sm text-muted-foreground">Description</p>
            <p className="font-medium">
              {template.description?.en || template.description?.ar || 'No description provided.'}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Groups & Items</CardTitle>
            <div className="flex gap-1 rounded-md border p-1">
              <Button
                variant={groupsViewMode === 'table' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setGroupsViewMode('table')}
                className="h-7 px-2"
              >
                <List className="mr-1 h-3.5 w-3.5" />
                Table
              </Button>
              <Button
                variant={groupsViewMode === 'json' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setGroupsViewMode('json')}
                className="h-7 px-2"
              >
                <Code2 className="mr-1 h-3.5 w-3.5" />
                JSON
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {sortedGroups.length === 0 ? (
            <p className="text-sm text-muted-foreground">No groups configured.</p>
          ) : groupsViewMode === 'table' ? (
            <div className="space-y-4">
              {sortedGroups.map((group) => (
                <GroupSection key={group.id} group={group} />
              ))}
            </div>
          ) : (
            <pre className="overflow-auto rounded bg-muted p-4 text-xs">
              {JSON.stringify(sortedGroups, null, 2)}
            </pre>
          )}
        </CardContent>
      </Card>

      {template.metadata && Object.keys(template.metadata).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Metadata</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="rounded bg-muted p-3 text-xs">
              {JSON.stringify(template.metadata, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}

      <Separator />
      <p className="text-xs text-muted-foreground">
        Vital signs templates are read-only in this UI. Use API or admin tools for changes.
      </p>
    </div>
  );
}
