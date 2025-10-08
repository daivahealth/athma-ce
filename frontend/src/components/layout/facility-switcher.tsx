'use client';

import { useState, useEffect } from 'react';
import { Building2, Check, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { decodeAccessToken } from '@/lib/auth/tokens';
import { getSession, switchFacility } from '@/lib/api/client';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import type { Facility } from '@/types/auth';

export function FacilitySwitcher() {
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [switching, setSwitching] = useState(false);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const session = getSession();
  const claims = decodeAccessToken(session.accessToken);

  useEffect(() => {
    setMounted(true);
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    if (!claims?.userId) return;

    try {
      // TODO: Fetch from foundation service or use data from session
      // For now, we'll construct from JWT claims
      const facilityIds = claims.facilityIds || [];
      const currentFacilityId = claims.facilityId;
      const defaultFacilityId = claims.defaultFacilityId;

      // Mock facility data - in production, fetch from API
      const mockFacilities: Facility[] = facilityIds.map((id: string) => ({
        id,
        name: id === defaultFacilityId ? 'Default Facility' : `Facility ${id.substring(0, 8)}`,
        facilityType: 'clinic',
        isDefault: id === defaultFacilityId,
      }));

      setFacilities(mockFacilities);
    } catch (error) {
      console.error('Failed to fetch facilities:', error);
    }
  };

  const handleSwitchFacility = async (facilityId: string) => {
    if (facilityId === claims?.facilityId) return;

    setSwitching(true);
    try {
      await switchFacility(facilityId);
      
      toast({
        title: 'Facility switched',
        description: 'You are now working in the selected facility.',
        variant: 'default',
      });

      // Reload to update UI with new facility context
      window.location.reload();
    } catch (error: any) {
      console.error('Failed to switch facility:', error);
      toast({
        title: 'Unable to switch facility',
        description: error?.response?.data?.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSwitching(false);
    }
  };

  if (!mounted || !claims?.facilityId || facilities.length <= 1) {
    return null;
  }

  const currentFacility = facilities.find(f => f.id === claims.facilityId);
  const isAtDefaultFacility = claims.facilityId === claims.defaultFacilityId;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "gap-2 transition-all duration-200",
            !isAtDefaultFacility && "border-warning text-warning"
          )}
          disabled={switching}
        >
          <Building2 className="h-4 w-4" />
          <span className="hidden sm:inline max-w-32 truncate">
            {currentFacility?.name || 'Select Facility'}
          </span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          Switch Facility
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {facilities.map((facility) => {
          const isCurrent = facility.id === claims.facilityId;
          const isDefault = facility.id === claims.defaultFacilityId;

          return (
            <DropdownMenuItem
              key={facility.id}
              onClick={() => handleSwitchFacility(facility.id)}
              className={cn(
                "cursor-pointer",
                isCurrent && "bg-accent"
              )}
              disabled={isCurrent || switching}
            >
              <div className="flex w-full items-center justify-between">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{facility.name}</span>
                    {isDefault && (
                      <span className="text-xs text-muted-foreground">(Home)</span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground capitalize">
                    {facility.facilityType}
                  </span>
                </div>
                {isCurrent && <Check className="h-4 w-4" />}
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

