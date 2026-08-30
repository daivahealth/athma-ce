'use client';

import { useParams, useRouter } from 'next/navigation';
import { Plus, LayoutTemplate, Eye, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading';
import { EmptyState } from '@/components/ui/empty-state';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useFormMasters } from '@/modules/clinical/hooks/use-form-master';
import type { FrequencyUnit } from '@/modules/clinical/types/form-master';
import { FrequencyType } from '@/modules/clinical/types/form-master';

const FREQUENCY_LABELS: Record<FrequencyType, string> = {
  [FrequencyType.EVERY_N_HOURS]: 'Every {n} hours',
  [FrequencyType.EVERY_N_DAYS]: 'Every {n} days',
  [FrequencyType.DAILY]: 'Daily',
  [FrequencyType.WEEKLY]: 'Weekly',
  [FrequencyType.ONCE_PER_SHIFT]: 'Once per shift',
  [FrequencyType.ONCE_PER_ADMISSION]: 'Once per admission',
  [FrequencyType.ONCE_PER_EPISODE]: 'Once per episode',
  [FrequencyType.ON_DEMAND]: 'Fill whenever needed',
  [FrequencyType.EVENT_BASED]: 'Trigger after an event',
};

function formatFrequency(type: FrequencyType, value?: number | null, unit?: FrequencyUnit | null): string {
  const label = FREQUENCY_LABELS[type] ?? type;
  if (label.includes('{n}') && value != null) {
    return label.replace('{n}', String(value));
  }
  if ((type === 'EVERY_N_HOURS' || type === 'EVERY_N_DAYS') && value != null && unit) {
    return `Every ${value} ${unit.toLowerCase()}${value === 1 ? '' : 's'}`;
  }
  return label;
}

export default function FormMasterListPage() {
  const params = useParams() as { locale: string };
  const router = useRouter();
  const { data: formMasters, isLoading, error } = useFormMasters();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Form Master</h1>
          <p className="text-muted-foreground">
            Master forms uploaded from OpenMedForm, available for clinicians to fill against a patient encounter.
          </p>
        </div>
        <Button onClick={() => router.push(`/${params.locale}/catalogs/form-master/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Upload Form
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <LoadingSpinner size="lg" text="Loading form masters..." />
          ) : error ? (
            <p className="text-sm text-destructive">Unable to load form masters.</p>
          ) : !formMasters || formMasters.length === 0 ? (
            <EmptyState
              icon={LayoutTemplate}
              title="No forms uploaded yet"
              description="Upload a form definition exported from OpenMedForm to make it available for clinicians to fill."
              action={
                <Button onClick={() => router.push(`/${params.locale}/catalogs/form-master/new`)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Upload First Form
                </Button>
              }
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Form Code</TableHead>
                  <TableHead>Version</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Uploaded</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {formMasters.map((fm) => (
                  <TableRow
                    key={fm.id}
                    className="cursor-pointer"
                    onClick={() => router.push(`/${params.locale}/catalogs/form-master/${fm.id}`)}
                  >
                    <TableCell className="font-medium">{fm.name}</TableCell>
                    <TableCell className="font-mono text-xs">{fm.formCode}</TableCell>
                    <TableCell>v{fm.formVersion}</TableCell>
                    <TableCell>{formatFrequency(fm.frequencyType, fm.frequencyValue, fm.frequencyUnit)}</TableCell>
                    <TableCell>
                      <Badge variant={fm.status === 'ACTIVE' ? 'default' : 'secondary'} className="capitalize">
                        {fm.status.toLowerCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(fm.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/${params.locale}/catalogs/form-master/${fm.id}`);
                        }}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Button>
                      {fm.status === 'ACTIVE' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(
                              `/${params.locale}/catalogs/form-master/new?formCode=${encodeURIComponent(fm.formCode)}`
                            );
                          }}
                        >
                          <History className="mr-2 h-4 w-4" />
                          New Version
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
