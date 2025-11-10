'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Trash2, Clock, AlertCircle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useProcedure } from '@/modules/foundation/hooks/use-catalogs';

export default function ProcedureDetailPage() {
  const params = useParams();
  const router = useRouter();
  const procedureId = params.id as string;
  const locale = params.locale as string;

  const { data: procedure, isLoading, error } = useProcedure(procedureId);

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

  if (error || !procedure) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center text-red-600">
          Error loading procedure details
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
            onClick={() => router.push(`/${locale}/catalogs/procedures`)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{procedure.procedureName}</h1>
            {procedure.procedureCategory && (
              <p className="text-muted-foreground">{procedure.procedureCategory} - {procedure.bodySystem}</p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant={procedure.isActive ? 'default' : 'secondary'}>
            {procedure.isActive ? 'Active' : 'Inactive'}
          </Badge>
          {procedure.consentRequired && (
            <Badge variant="outline">
              <FileText className="h-3 w-3 mr-1" />
              Consent Required
            </Badge>
          )}
          {procedure.estimatedDurationMinutes && (
            <Badge variant="secondary">
              <Clock className="h-3 w-3 mr-1" />
              {procedure.estimatedDurationMinutes} min
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
              <label className="text-sm font-medium text-muted-foreground">Procedure Name</label>
              <p className="text-base">{procedure.procedureName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Procedure Category</label>
              <p className="text-base">{procedure.procedureCategory || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Body System</label>
              <p className="text-base">{procedure.bodySystem || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Procedure Type</label>
              <p className="text-base">{procedure.procedureType || 'N/A'}</p>
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
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">CPT Code</label>
              <p className="text-base font-mono">{procedure.cptCode || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">ICD-10-PCS Code</label>
              <p className="text-base font-mono">{procedure.icd10PcsCode || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Local Code</label>
              <p className="text-base font-mono">{procedure.localCode || 'N/A'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Anesthesia & Facility */}
      <Card>
        <CardHeader>
          <CardTitle>Anesthesia & Facility Requirements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Anesthesia Type</label>
              <p className="text-base">{procedure.anesthesiaType || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Facility Required</label>
              <p className="text-base">{procedure.facilityRequired || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Estimated Duration</label>
              <p className="text-base">{procedure.estimatedDurationMinutes ? `${procedure.estimatedDurationMinutes} minutes` : 'N/A'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Consent Information */}
      <Card>
        <CardHeader>
          <CardTitle>Consent Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Consent Required</label>
              <p className="text-base">{procedure.consentRequired ? 'Yes' : 'No'}</p>
            </div>
            {procedure.consentRequired && procedure.consentType && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Consent Type</label>
                <p className="text-base">{procedure.consentType}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pre-Procedure Requirements */}
      {procedure.preProcedureRequirements && procedure.preProcedureRequirements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pre-Procedure Requirements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="list-disc list-inside space-y-1">
              {procedure.preProcedureRequirements.map((item, index) => (
                <li key={index} className="text-base">{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Preparation Instructions */}
      {procedure.preparationInstructions && (
        <Card>
          <CardHeader>
            <CardTitle>Preparation Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base">{procedure.preparationInstructions}</p>
          </CardContent>
        </Card>
      )}

      {/* Safety Information */}
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              Safety Information
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {procedure.risksAndComplications && procedure.risksAndComplications.length > 0 && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Risks & Complications</label>
              <ul className="mt-2 list-disc list-inside space-y-1">
                {procedure.risksAndComplications.map((item, index) => (
                  <li key={index} className="text-base">{item}</li>
                ))}
              </ul>
            </div>
          )}
          {procedure.contraindications && procedure.contraindications.length > 0 && (
            <>
              <Separator />
              <div>
                <label className="text-sm font-medium text-muted-foreground">Contraindications</label>
                <ul className="mt-2 list-disc list-inside space-y-1">
                  {procedure.contraindications.map((item, index) => (
                    <li key={index} className="text-base">{item}</li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Post-Procedure Care */}
      <Card>
        <CardHeader>
          <CardTitle>Post-Procedure Care</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {procedure.postProcedureInstructions && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Post-Procedure Instructions</label>
              <p className="text-base mt-2">{procedure.postProcedureInstructions}</p>
            </div>
          )}
          <Separator />
          {procedure.postProcedureMonitoring && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Post-Procedure Monitoring</label>
              <p className="text-base mt-2">{procedure.postProcedureMonitoring}</p>
            </div>
          )}
          <Separator />
          <div className="grid grid-cols-2 gap-4">
            {procedure.recoveryTimeHours && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Recovery Time</label>
                <p className="text-base">{procedure.recoveryTimeHours} hours</p>
              </div>
            )}
          </div>
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
              <p className="text-base">{new Date(procedure.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Updated At</label>
              <p className="text-base">{new Date(procedure.updatedAt).toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
