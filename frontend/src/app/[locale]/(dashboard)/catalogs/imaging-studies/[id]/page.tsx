'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Trash2, Clock, Radiation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useImagingStudy } from '@/modules/foundation/hooks/use-catalogs';
import { CatalogBillingMappingsPanel } from '@/modules/rcm/components/catalog-billing-mappings-panel';

export default function ImagingStudyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const studyId = params.id as string;
  const locale = params.locale as string;

  const { data: study, isLoading, error } = useImagingStudy(studyId);

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

  if (error || !study) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center text-red-600">
          Error loading imaging study details
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
            onClick={() => router.push(`/${locale}/catalogs/imaging-studies`)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{study.studyName}</h1>
            {study.modality && (
              <p className="text-muted-foreground">{study.modality} - {study.bodyPart}</p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant={study.isActive ? 'default' : 'secondary'}>
            {study.isActive ? 'Active' : 'Inactive'}
          </Badge>
          {study.contrastRequired && (
            <Badge variant="outline">Contrast Required</Badge>
          )}
          {study.radiologistRequired && (
            <Badge variant="outline">Radiologist Required</Badge>
          )}
          {study.radiationDose && study.radiationDose !== 'No radiation' && (
            <Badge variant="secondary">
              <Radiation className="h-3 w-3 mr-1" />
              {study.radiationDose}
            </Badge>
          )}
          {study.estimatedDurationMinutes && (
            <Badge variant="secondary">
              <Clock className="h-3 w-3 mr-1" />
              {study.estimatedDurationMinutes} min
            </Badge>
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
              <label className="text-sm font-medium text-muted-foreground">Study Name</label>
              <p className="text-base">{study.studyName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Study Category</label>
              <p className="text-base">{study.studyCategory || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Modality</label>
              <p className="text-base">{study.modality || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Body Part</label>
              <p className="text-base">{study.bodyPart || 'N/A'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Coding Information */}
      <Card>
        <CardHeader>
          <CardTitle>Coding Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">CPT Code</label>
              <p className="text-base font-mono">{study.cptCode || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Local Code</label>
              <p className="text-base font-mono">{study.localCode || 'N/A'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contrast Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contrast Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Contrast Required</label>
              <p className="text-base">{study.contrastRequired ? 'Yes' : 'No'}</p>
            </div>
            {study.contrastRequired && study.contrastType && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Contrast Type</label>
                <p className="text-base">{study.contrastType}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Preparation & Positioning */}
      <Card>
        <CardHeader>
          <CardTitle>Preparation & Positioning</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {study.preparationInstructions && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Preparation Instructions</label>
              <p className="text-base mt-2">{study.preparationInstructions}</p>
            </div>
          )}
          {study.positioningInstructions && (
            <>
              <Separator />
              <div>
                <label className="text-sm font-medium text-muted-foreground">Positioning Instructions</label>
                <p className="text-base mt-2">{study.positioningInstructions}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Safety Information */}
      {study.contraindications && study.contraindications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Safety Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Contraindications</label>
              <ul className="mt-2 list-disc list-inside space-y-1">
                {study.contraindications.map((item, index) => (
                  <li key={index} className="text-base">{item}</li>
                ))}
              </ul>
            </div>
            {study.radiationDose && (
              <>
                <Separator />
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Radiation Dose</label>
                  <p className="text-base">{study.radiationDose}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Facility & Equipment Requirements */}
      <Card>
        <CardHeader>
          <CardTitle>Facility & Equipment Requirements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Facility Requirements</label>
              <p className="text-base">{study.facilityRequirements || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Equipment Requirements</label>
              <p className="text-base">{study.equipmentRequirements || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Radiologist Required</label>
              <p className="text-base">{study.radiologistRequired ? 'Yes' : 'No'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Estimated Duration</label>
              <p className="text-base">{study.estimatedDurationMinutes ? `${study.estimatedDurationMinutes} minutes` : 'N/A'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Billing Mappings */}
      <Card>
        <CardHeader>
          <CardTitle>Billing Mappings</CardTitle>
        </CardHeader>
        <CardContent>
          <CatalogBillingMappingsPanel
            catalogType="imaging_study"
            catalogItemId={studyId}
            catalogItemName={study.studyName}
            catalogItemCode={study.cptCode ?? null}
          />
        </CardContent>
      </Card>

      {/* Metadata */}
      <Card>
        <CardHeader>
          <CardTitle>Metadata</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Created At</label>
              <p className="text-base">{new Date(study.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Updated At</label>
              <p className="text-base">{new Date(study.updatedAt).toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
