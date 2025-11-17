'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { usePatient } from '@/modules/clinical/hooks/use-patients';
import { usePatientAppointments } from '@/modules/clinical/hooks/use-appointments';
import { usePatientEncounters } from '@/modules/clinical/hooks/use-encounters';
import { useStaff } from '@/modules/foundation/hooks/use-staff';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { LoadingSpinner } from '@/components/ui/loading';
import {
  ArrowLeft,
  Edit,
  Calendar,
  CalendarClock,
  Phone,
  User,
  FileText,
  AlertCircle,
  Shield,
  Activity,
  Stethoscope
} from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface PatientDetailPageProps {
  params: {
    locale: string;
    patientId: string;
  };
}

export default function PatientDetailPage({ params }: PatientDetailPageProps) {
  const router = useRouter();
  const { data: patient, isLoading, error } = usePatient(params.patientId);
  const { data: appointments, isLoading: isAppointmentsLoading } = usePatientAppointments(params.patientId);
  const { data: encounters, isLoading: isEncountersLoading } = usePatientEncounters(params.patientId);
  const { data: staffData } = useStaff({ status: 'active' });

  const staffMap = useMemo(() => {
    const map = new Map<string, string>();
    staffData?.data?.forEach((staff) => {
      const displayName = staff.displayName || `${staff.firstName} ${staff.lastName}`;
      map.set(staff.id, displayName);
    });
    return map;
  }, [staffData]);

  const upcomingAppointment = useMemo(() => {
    if (!appointments || appointments.length === 0) return null;
    const now = Date.now();
    return (
      appointments
        .filter((appointment) => {
          const startTime = new Date(appointment.startTime).getTime();
          return startTime >= now && appointment.status !== 'cancelled';
        })
        .sort(
          (a, b) =>
            new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        )[0] || null
    );
  }, [appointments]);

  const previousEncounter = useMemo(() => {
    if (!encounters || encounters.length === 0) return null;
    return (
      [...encounters].sort(
        (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
      )[0] || null
    );
  }, [encounters]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" text="Loading patient details..." />
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/${params.locale}/patients`)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Patients
          </Button>
        </div>
        <Card className="border-red-500">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Patient Not Found</h3>
              <p className="text-muted-foreground mb-4">
                The patient you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to view it.
              </p>
              <Button onClick={() => router.push(`/${params.locale}/patients`)}>
                Back to Patient List
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const calculateAge = (dob: string) => {
    const birthDate = parseISO(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch {
      return 'Invalid date';
    }
  };

  const formatDateTime = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy • h:mm a');
    } catch {
      return 'Invalid date';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'inactive':
        return 'bg-yellow-500';
      case 'deceased':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatStatusLabel = (status?: string | null) => {
    if (!status) return 'unknown';
    return status.replace(/-/g, ' ');
  };

  const getStaffName = (staffId?: string | null) => {
    if (!staffId) return 'Unassigned';
    return staffMap.get(staffId) || 'Unassigned';
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/${params.locale}/patients`)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold">
                  {patient.firstName} {patient.middleName && `${patient.middleName} `}
                  {patient.lastName}
                </h1>
                <Badge className={getStatusColor(patient.status)}>
                  {patient.status.toUpperCase()}
                </Badge>
              </div>
              <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                <span className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  MRN: {patient.mrn}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {calculateAge(patient.dateOfBirth)} years old
                </span>
                <span className="capitalize">{patient.gender}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/${params.locale}/patients/${patient.id}/edit`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Patient
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarClock className="h-5 w-5" />
              Upcoming Appointment
            </CardTitle>
            <CardDescription>Next scheduled visit for this patient</CardDescription>
          </CardHeader>
          <CardContent>
            {isAppointmentsLoading ? (
              <Skeleton className="h-20 w-full" />
            ) : upcomingAppointment ? (
              <div className="space-y-3">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Primary Staff</p>
                  <p className="text-lg font-semibold">{getStaffName(upcomingAppointment.staffId)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Date & Time</p>
                  <p className="font-medium">{formatDateTime(upcomingAppointment.startTime)}</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="secondary" className="capitalize">
                    {formatStatusLabel(upcomingAppointment.status)}
                  </Badge>
                  <span>{upcomingAppointment.appointmentType}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No upcoming appointments scheduled.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5" />
              Previous Encounter
            </CardTitle>
            <CardDescription>Most recent encounter details</CardDescription>
          </CardHeader>
          <CardContent>
            {isEncountersLoading ? (
              <Skeleton className="h-20 w-full" />
            ) : previousEncounter ? (
              <div className="space-y-3">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Primary Staff</p>
                  <p className="text-lg font-semibold">{getStaffName(previousEncounter.primaryStaffId)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Date & Time</p>
                  <p className="font-medium">{formatDateTime(previousEncounter.startTime)}</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="outline" className="capitalize">
                    {formatStatusLabel(previousEncounter.status)}
                  </Badge>
                  <span>Encounter #{previousEncounter.encounterNumber}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No previous encounters recorded.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <span className="text-muted-foreground">First Name:</span>
              <span className="col-span-2 font-medium">{patient.firstName}</span>
            </div>
            {patient.middleName && (
              <div className="grid grid-cols-3 gap-2">
                <span className="text-muted-foreground">Middle Name:</span>
                <span className="col-span-2 font-medium">{patient.middleName}</span>
              </div>
            )}
            <div className="grid grid-cols-3 gap-2">
              <span className="text-muted-foreground">Last Name:</span>
              <span className="col-span-2 font-medium">{patient.lastName}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-muted-foreground">Date of Birth:</span>
              <span className="col-span-2 font-medium">{formatDate(patient.dateOfBirth)}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-muted-foreground">Age:</span>
              <span className="col-span-2 font-medium">{calculateAge(patient.dateOfBirth)} years</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-muted-foreground">Gender:</span>
              <span className="col-span-2 font-medium capitalize">{patient.gender}</span>
            </div>
            {patient.nationality && (
              <div className="grid grid-cols-3 gap-2">
                <span className="text-muted-foreground">Nationality:</span>
                <span className="col-span-2 font-medium">{patient.nationality}</span>
              </div>
            )}
            {patient.bloodGroup && (
              <div className="grid grid-cols-3 gap-2">
                <span className="text-muted-foreground">Blood Group:</span>
                <span className="col-span-2 font-medium">{patient.bloodGroup}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <span className="text-muted-foreground">Phone:</span>
              <span className="col-span-2 font-medium">{patient.phoneNumber}</span>
            </div>
            {patient.alternateContactNumber && (
              <div className="grid grid-cols-3 gap-2">
                <span className="text-muted-foreground">Alternate Phone:</span>
                <span className="col-span-2 font-medium">{patient.alternateContactNumber}</span>
              </div>
            )}
            {patient.email && (
              <div className="grid grid-cols-3 gap-2">
                <span className="text-muted-foreground">Email:</span>
                <span className="col-span-2 font-medium">{patient.email}</span>
              </div>
            )}
            {patient.address && (
              <div className="grid grid-cols-3 gap-2">
                <span className="text-muted-foreground">Address:</span>
                <span className="col-span-2 font-medium">{patient.address}</span>
              </div>
            )}
            {patient.city && (
              <div className="grid grid-cols-3 gap-2">
                <span className="text-muted-foreground">City:</span>
                <span className="col-span-2 font-medium">{patient.city}</span>
              </div>
            )}
            {patient.state && (
              <div className="grid grid-cols-3 gap-2">
                <span className="text-muted-foreground">State:</span>
                <span className="col-span-2 font-medium">{patient.state}</span>
              </div>
            )}
            {patient.country && (
              <div className="grid grid-cols-3 gap-2">
                <span className="text-muted-foreground">Country:</span>
                <span className="col-span-2 font-medium">{patient.country}</span>
              </div>
            )}
            {patient.postalCode && (
              <div className="grid grid-cols-3 gap-2">
                <span className="text-muted-foreground">Postal Code:</span>
                <span className="col-span-2 font-medium">{patient.postalCode}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Identity Documents */}
        {(patient.nationalId || patient.passportNumber) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Identity Documents
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {patient.nationalId && (
                <>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-muted-foreground">National ID:</span>
                    <span className="col-span-2 font-medium">{patient.nationalId}</span>
                  </div>
                  {patient.nationalIdType && (
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-muted-foreground">ID Type:</span>
                      <span className="col-span-2 font-medium">{patient.nationalIdType}</span>
                    </div>
                  )}
                </>
              )}
              {patient.passportNumber && (
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-muted-foreground">Passport:</span>
                  <span className="col-span-2 font-medium">{patient.passportNumber}</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Emergency Contact */}
        {patient.emergencyContactName && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Emergency Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <span className="text-muted-foreground">Name:</span>
                <span className="col-span-2 font-medium">{patient.emergencyContactName}</span>
              </div>
              {patient.emergencyContactNumber && (
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-muted-foreground">Phone:</span>
                  <span className="col-span-2 font-medium">{patient.emergencyContactNumber}</span>
                </div>
              )}
              {patient.emergencyContactRelation && (
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-muted-foreground">Relation:</span>
                  <span className="col-span-2 font-medium">{patient.emergencyContactRelation}</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Medical Information */}
        {(patient.allergies || patient.chronicConditions || patient.currentMedications) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Medical Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {patient.allergies && (
                <div>
                  <span className="text-muted-foreground block mb-1">Allergies:</span>
                  <p className="font-medium">{patient.allergies}</p>
                </div>
              )}
              {patient.chronicConditions && (
                <div>
                  <span className="text-muted-foreground block mb-1">Chronic Conditions:</span>
                  <p className="font-medium">{patient.chronicConditions}</p>
                </div>
              )}
              {patient.currentMedications && (
                <div>
                  <span className="text-muted-foreground block mb-1">Current Medications:</span>
                  <p className="font-medium">{patient.currentMedications}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Insurance Information */}
        {patient.insuranceProvider && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Insurance Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <span className="text-muted-foreground">Provider:</span>
                <span className="col-span-2 font-medium">{patient.insuranceProvider}</span>
              </div>
              {patient.insurancePolicyNumber && (
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-muted-foreground">Policy Number:</span>
                  <span className="col-span-2 font-medium">{patient.insurancePolicyNumber}</span>
                </div>
              )}
              {patient.insuranceExpiryDate && (
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-muted-foreground">Expiry Date:</span>
                  <span className="col-span-2 font-medium">{formatDate(patient.insuranceExpiryDate)}</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Audit Information */}
      <Card>
        <CardHeader>
          <CardTitle>Audit Information</CardTitle>
          <CardDescription>Record creation and modification history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-2">
                <span className="text-muted-foreground">Created At:</span>
                <span className="col-span-2 font-medium">{formatDate(patient.createdAt)}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-muted-foreground">Created By:</span>
                <span className="col-span-2 font-medium font-mono text-xs">{patient.createdBy}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-muted-foreground">Facility:</span>
                <span className="col-span-2 font-medium font-mono text-xs">{patient.createdAtFacility}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-2">
                <span className="text-muted-foreground">Updated At:</span>
                <span className="col-span-2 font-medium">{formatDate(patient.updatedAt)}</span>
              </div>
              {patient.updatedBy && (
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-muted-foreground">Updated By:</span>
                  <span className="col-span-2 font-medium font-mono text-xs">{patient.updatedBy}</span>
                </div>
              )}
              {patient.updatedAtFacility && (
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-muted-foreground">Facility:</span>
                  <span className="col-span-2 font-medium font-mono text-xs">{patient.updatedAtFacility}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
