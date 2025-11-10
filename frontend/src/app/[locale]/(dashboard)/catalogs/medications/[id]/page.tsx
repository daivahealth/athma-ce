'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useMedication } from '@/modules/foundation/hooks/use-catalogs';

export default function MedicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const medicationId = params.id as string;
  const locale = params.locale as string;

  const { data: medication, isLoading, error } = useMedication(medicationId);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !medication) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center text-red-600">
          Error loading medication details
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push(`/${locale}/catalogs/medications`)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{medication.medicationName}</h1>
            {medication.genericName && (
              <p className="text-muted-foreground">{medication.genericName}</p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant={medication.isActive ? 'default' : 'secondary'}>
            {medication.isActive ? 'Active' : 'Inactive'}
          </Badge>
          {medication.controlledSubstance && (
            <Badge variant="destructive">
              Controlled {medication.controlledClass}
            </Badge>
          )}
          {medication.requiresPrescription && (
            <Badge variant="outline">Prescription Required</Badge>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
        <Button variant="outline" size="sm">
          <Trash2 className="h-4 w-4 mr-2" />
          Deactivate
        </Button>
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Medication Name</label>
              <p className="text-base">{medication.medicationName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Generic Name</label>
              <p className="text-base">{medication.genericName || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Brand Name</label>
              <p className="text-base">{medication.brandName || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Manufacturer</label>
              <p className="text-base">{medication.manufacturer || 'N/A'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Coding & Classification */}
      <Card>
        <CardHeader>
          <CardTitle>Coding & Classification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">NDC Code</label>
              <p className="text-base font-mono">{medication.ndcCode || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">ATC Code</label>
              <p className="text-base font-mono">{medication.atcCode || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Local Code</label>
              <p className="text-base font-mono">{medication.localCode || 'N/A'}</p>
            </div>
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Drug Class</label>
              <p className="text-base">{medication.drugClass || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Therapeutic Class</label>
              <p className="text-base">{medication.therapeuticClass || 'N/A'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dosage Information */}
      <Card>
        <CardHeader>
          <CardTitle>Dosage Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Dosage Form</label>
              <p className="text-base">{medication.dosageForm || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Strength</label>
              <p className="text-base">{medication.strength || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Route</label>
              <p className="text-base">{medication.route || 'N/A'}</p>
            </div>
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Default Frequency</label>
              <p className="text-base">{medication.defaultFrequency || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Default Duration</label>
              <p className="text-base">{medication.defaultDuration || 'N/A'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Safety Information */}
      <Card>
        <CardHeader>
          <CardTitle>Safety Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {medication.contraindications && medication.contraindications.length > 0 && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Contraindications</label>
              <ul className="mt-2 list-disc list-inside space-y-1">
                {medication.contraindications.map((item, index) => (
                  <li key={index} className="text-base">{item}</li>
                ))}
              </ul>
            </div>
          )}
          <Separator />
          {medication.commonSideEffects && medication.commonSideEffects.length > 0 && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Common Side Effects</label>
              <ul className="mt-2 list-disc list-inside space-y-1">
                {medication.commonSideEffects.map((item, index) => (
                  <li key={index} className="text-base">{item}</li>
                ))}
              </ul>
            </div>
          )}
          <Separator />
          {medication.drugInteractions && medication.drugInteractions.length > 0 && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Drug Interactions</label>
              <ul className="mt-2 list-disc list-inside space-y-1">
                {medication.drugInteractions.map((item, index) => (
                  <li key={index} className="text-base">{item}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Storage Requirements */}
      {medication.storageRequirements && (
        <Card>
          <CardHeader>
            <CardTitle>Storage Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base">{medication.storageRequirements}</p>
          </CardContent>
        </Card>
      )}

      {/* Metadata */}
      <Card>
        <CardHeader>
          <CardTitle>Metadata</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Created At</label>
              <p className="text-base">{new Date(medication.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Updated At</label>
              <p className="text-base">{new Date(medication.updatedAt).toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
