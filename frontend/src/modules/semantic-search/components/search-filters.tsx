'use client';

import { Filter, Calendar, Building2, Stethoscope, X } from 'lucide-react';
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
import type { SearchFilters, DocumentType, DateRange } from '../types/search';
import { DOCUMENT_TYPE_LABELS } from '../types/search';
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
    filters.dateRange?.from || filters.dateRange?.to,
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

  const handleDateChange = (field: 'from' | 'to', value: string) => {
    const currentRange = filters.dateRange || {};
    const newRange: DateRange = {
      ...currentRange,
      [field]: value || undefined,
    };

    // Remove empty range
    if (!newRange.from && !newRange.to) {
      onFiltersChange({
        ...filters,
        dateRange: undefined,
      });
    } else {
      onFiltersChange({
        ...filters,
        dateRange: newRange,
      });
    }
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
                        onCheckedChange={(checked) =>
                          handleDocumentTypeToggle(type, checked as boolean)
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
                      value={filters.dateRange?.from || ''}
                      onChange={(e) => handleDateChange('from', e.target.value)}
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">To</Label>
                    <Input
                      type="date"
                      value={filters.dateRange?.to || ''}
                      onChange={(e) => handleDateChange('to', e.target.value)}
                      className="h-9"
                    />
                  </div>
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
