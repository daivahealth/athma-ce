'use client';

import { Filter, Calendar, Building2, Stethoscope, X, User, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { SearchFilters, DocumentType, EncounterType } from '../types/search';
import { DOCUMENT_TYPE_LABELS, ENCOUNTER_TYPE_LABELS, GENDER_OPTIONS } from '../types/search';
import { cn } from '@/lib/utils';

interface SearchFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  facilities?: { id: string; name: string }[];
  departments?: { id: string; name: string }[];
  className?: string;
}

const ALL_DOCUMENT_TYPES: DocumentType[] = [
  'encounter_note',
  'discharge_summary',
  'clinical_note',
  'progress_note',
  'consultation_note',
  'procedure_note',
  'operative_note',
  'radiology_report',
  'lab_report',
  'pathology_report',
];

export function SearchFiltersPanel({
  filters,
  onFiltersChange,
  facilities = [],
  departments = [],
  className,
}: SearchFiltersProps) {
  const activeFilterCount = [
    filters.documentTypes?.length,
    filters.facilityId,
    filters.departmentId,
    filters.dateFrom || filters.dateTo,
    filters.patientName,
    filters.patientMrn,
    filters.patientGender,
    filters.patientAgeMin !== undefined || filters.patientAgeMax !== undefined,
    filters.encounterType,
    filters.authorName,
  ].filter(Boolean).length;

  const handleDocumentTypeToggle = (type: DocumentType, checked: boolean) => {
    const current = filters.documentTypes || [];
    const updated = checked
      ? [...current, type]
      : current.filter((t) => t !== type);

    onFiltersChange({
      ...filters,
      documentTypes: updated.length > 0 ? updated : undefined,
    });
  };

  const handleDateChange = (field: 'dateFrom' | 'dateTo', value: string) => {
    onFiltersChange({
      ...filters,
      [field]: value || undefined,
    });
  };

  const handleClearFilters = () => {
    onFiltersChange({});
  };

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Header */}
      <div className="p-3 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span className="font-medium text-sm">Filters</span>
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {activeFilterCount}
            </Badge>
          )}
        </div>
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="h-7 px-2 text-xs"
          >
            <X className="h-3 w-3 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Filters */}
      <ScrollArea className="flex-1">
        <div className="p-3">
          <Accordion type="multiple" defaultValue={['documentTypes', 'dateRange']}>
            {/* Document Types */}
            <AccordionItem value="documentTypes">
              <AccordionTrigger className="py-2 text-sm">
                <div className="flex items-center gap-2">
                  <Stethoscope className="h-4 w-4" />
                  Document Types
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pl-6">
                  {ALL_DOCUMENT_TYPES.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={`doctype-${type}`}
                        checked={filters.documentTypes?.includes(type) || false}
                        onChange={(event) =>
                          handleDocumentTypeToggle(type, event.target.checked)
                        }
                      />
                      <Label
                        htmlFor={`doctype-${type}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {DOCUMENT_TYPE_LABELS[type]}
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Date Range */}
            <AccordionItem value="dateRange">
              <AccordionTrigger className="py-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Date Range
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pl-6">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">From</Label>
                    <Input
                      type="date"
                      value={filters.dateFrom || ''}
                      onChange={(e) => handleDateChange('dateFrom', e.target.value)}
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">To</Label>
                    <Input
                      type="date"
                      value={filters.dateTo || ''}
                      onChange={(e) => handleDateChange('dateTo', e.target.value)}
                      className="h-9"
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Patient Filters */}
            <AccordionItem value="patient">
              <AccordionTrigger className="py-2 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Patient
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pl-6">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Patient Name</Label>
                    <Input
                      type="text"
                      placeholder="Search by name..."
                      value={filters.patientName || ''}
                      onChange={(e) =>
                        onFiltersChange({
                          ...filters,
                          patientName: e.target.value || undefined,
                        })
                      }
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">MRN</Label>
                    <Input
                      type="text"
                      placeholder="Search by MRN..."
                      value={filters.patientMrn || ''}
                      onChange={(e) =>
                        onFiltersChange({
                          ...filters,
                          patientMrn: e.target.value || undefined,
                        })
                      }
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Gender</Label>
                    <Select
                      value={filters.patientGender || ''}
                      onValueChange={(value) =>
                        onFiltersChange({
                          ...filters,
                          patientGender: value || undefined,
                        })
                      }
                    >
                      <SelectTrigger className="w-full h-9">
                        <SelectValue placeholder="All genders" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All genders</SelectItem>
                        {GENDER_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Age Range</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        min={0}
                        max={150}
                        value={filters.patientAgeMin ?? ''}
                        onChange={(e) =>
                          onFiltersChange({
                            ...filters,
                            patientAgeMin: e.target.value ? parseInt(e.target.value) : undefined,
                          })
                        }
                        className="h-9 w-20"
                      />
                      <span className="text-muted-foreground">to</span>
                      <Input
                        type="number"
                        placeholder="Max"
                        min={0}
                        max={150}
                        value={filters.patientAgeMax ?? ''}
                        onChange={(e) =>
                          onFiltersChange({
                            ...filters,
                            patientAgeMax: e.target.value ? parseInt(e.target.value) : undefined,
                          })
                        }
                        className="h-9 w-20"
                      />
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Encounter Type */}
            <AccordionItem value="encounterType">
              <AccordionTrigger className="py-2 text-sm">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Encounter Type
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pl-6">
                  <Select
                    value={filters.encounterType || ''}
                    onValueChange={(value) =>
                      onFiltersChange({
                        ...filters,
                        encounterType: value || undefined,
                      })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All encounter types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All encounter types</SelectItem>
                      {(Object.keys(ENCOUNTER_TYPE_LABELS) as EncounterType[]).map((type) => (
                        <SelectItem key={type} value={type}>
                          {ENCOUNTER_TYPE_LABELS[type]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Author */}
            <AccordionItem value="author">
              <AccordionTrigger className="py-2 text-sm">
                <div className="flex items-center gap-2">
                  <Stethoscope className="h-4 w-4" />
                  Author/Physician
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pl-6">
                  <Input
                    type="text"
                    placeholder="Search by physician name..."
                    value={filters.authorName || ''}
                    onChange={(e) =>
                      onFiltersChange({
                        ...filters,
                        authorName: e.target.value || undefined,
                      })
                    }
                    className="h-9"
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Facility */}
            {facilities.length > 0 && (
              <AccordionItem value="facility">
                <AccordionTrigger className="py-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Facility
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pl-6">
                    <Select
                      value={filters.facilityId || ''}
                      onValueChange={(value) =>
                        onFiltersChange({
                          ...filters,
                          facilityId: value || undefined,
                        })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="All facilities" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All facilities</SelectItem>
                        {facilities.map((facility) => (
                          <SelectItem key={facility.id} value={facility.id}>
                            {facility.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Department */}
            {departments.length > 0 && (
              <AccordionItem value="department">
                <AccordionTrigger className="py-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Stethoscope className="h-4 w-4" />
                    Department
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pl-6">
                    <Select
                      value={filters.departmentId || ''}
                      onValueChange={(value) =>
                        onFiltersChange({
                          ...filters,
                          departmentId: value || undefined,
                        })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="All departments" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All departments</SelectItem>
                        {departments.map((dept) => (
                          <SelectItem key={dept.id} value={dept.id}>
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </div>
      </ScrollArea>
    </div>
  );
}
