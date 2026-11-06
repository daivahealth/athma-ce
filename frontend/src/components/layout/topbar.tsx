'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  LogOut,
  Settings,
  User,
  Building2,
  Hospital,
  Users,
  Stethoscope,
  SquareStack,
  ShieldCheck,
  Puzzle,
  Check,
  Plus,
  CircleHelp,
} from 'lucide-react';
import { useHelp } from '@/components/help/help-provider';
import { ThemeToggle } from './theme-toggle';
import { SidebarTrigger } from './sidebar';
import { PatientSearch } from './patient-search';
import { NotificationCenter } from './notification-center';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { decodeAccessToken } from '@/lib/auth/tokens';
import { getSession, logout, switchFacility } from '@/lib/api/client';
import { useToast } from '@/components/ui/use-toast';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { Facility } from '@/types/auth';
import { userService } from '@/modules/foundation/services/user-service';
import { getApiErrorMessage } from '@/lib/api/errors';

interface TopbarProps {
  locale: string;
  onSidebarToggle: () => void;
}

export function Topbar({ locale, onSidebarToggle }: TopbarProps) {
  const t = useTranslations();
  const toast = useToast();
  const router = useRouter();
  const { openHelp } = useHelp();
  const [session, setSession] = useState(getSession());
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [switching, setSwitching] = useState(false);

  useEffect(() => {
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
  }, [locale]);

  const claims = decodeAccessToken(session.accessToken);

  useEffect(() => {
    fetchFacilities();
  }, [claims?.userId]);

  const fetchFacilities = async () => {
    if (!claims?.userId) return;

    try {
      const data = await userService.getUserFacilities(claims.userId);
      const mappedFacilities: Facility[] = (data.facilities ?? []).map((facility) => ({
        id: facility.id,
        name: facility.name,
        facilityType: facility.facilityType ?? 'facility',
        city: facility.city ?? undefined,
        emirate: facility.emirate ?? undefined,
        accessLevel: facility.accessLevel ?? undefined,
        isDefault: Boolean(facility.isDefault),
      }));
      setFacilities(mappedFacilities);
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
    } catch (error) {
      console.error('Failed to switch facility:', error);
      toast({
        title: 'Unable to switch facility',
        description: getApiErrorMessage(error, 'Please try again.'),
        variant: 'destructive',
      });
    } finally {
      setSwitching(false);
    }
  };

  const handleLogout = async () => {
    try {
      // Call server-side logout API
      await logout();

      // Clear local session state
      setSession({ accessToken: null, refreshToken: null, user: null });

      // Show success message
      toast({
        title: 'Signed out successfully',
        description: 'You have been logged out securely.',
        variant: 'default'
      });

      // Redirect to login page
      router.push(`/${locale}/login`);

    } catch (error) {
      console.error('Logout error:', error);

      // Even if server logout fails, clear local session and redirect
      setSession({ accessToken: null, refreshToken: null, user: null });

      toast({
        title: 'Signed out locally',
        description: 'Local session cleared. Please log in again.',
        variant: 'default'
      });

      // Still redirect to login page
      router.push(`/${locale}/login`);
    }
  };

  return (
    <header className="flex h-14 min-w-0 items-center bg-background/95 backdrop-blur-md px-3 md:px-6 border-b border-border sticky top-0 z-40 transition-all">
      {/* Sidebar toggle (prrapp style): collapses the desktop sidebar, opens the drawer on mobile */}
      <SidebarTrigger onMobileToggle={onSidebarToggle} className="-ml-2" />
      <div className="mx-2 md:mx-3 h-4 w-px shrink-0 bg-sidebar-border" aria-hidden="true" />

      {/* min-w-0 lets the search shrink on phones instead of pushing the header past the viewport */}
      <div className="flex min-w-0 flex-1 items-center justify-between gap-2 md:gap-4">
        {/* Spacer for left side balance */}
        <div className="hidden lg:flex flex-1" />

        {/* Center Search Area */}
        <div className="flex min-w-0 flex-1 lg:flex-none w-full lg:w-auto items-center justify-center gap-2">
          <div className="min-w-0 w-full lg:w-[450px]">
            <PatientSearch locale={locale} />
          </div>
          <Button asChild className="shrink-0 whitespace-nowrap px-2.5 sm:px-4 bg-gradient-to-b from-primary/90 to-primary shadow-sm border border-primary/20 hover:shadow-md transition-all">
            <Link href={`/${locale}/patients/new`} aria-label="New Patient">
              <Plus className="h-4 w-4 sm:mr-2" />
              {/* Icon-only below sm so the search keeps usable width on phones */}
              <span className="hidden sm:inline">New Patient</span>
            </Link>
          </Button>
        </div>

        <div className="flex shrink-0 lg:flex-1 items-center justify-end gap-1 sm:gap-2">
          {/* Theme toggle and page help are hidden below sm to fit a 375px phone;
              the sidebar's Help Centre stays reachable from the mobile drawer */}
          <div className="hidden sm:flex items-center gap-2">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Help for the screen on hand, in a side panel; the sidebar's Help Centre has the whole manual */}
            <Button
              variant="ghost"
              size="icon"
              onClick={openHelp}
              title="Help for this page (?)"
              aria-label="Help for this page"
              aria-keyshortcuts="?"
            >
              <CircleHelp className="h-5 w-5" />
            </Button>
          </div>

          {/* Notifications */}
          <NotificationCenter />

          <Separator orientation="vertical" className="hidden sm:block h-6" />

          {/* Settings Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>{t('nav.administration')}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/${locale}/tenants`} className="flex items-center gap-2 cursor-pointer">
                  <Building2 className="h-4 w-4" />
                  {t('nav.tenants')}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/${locale}/facilities`} className="flex items-center gap-2 cursor-pointer">
                  <Hospital className="h-4 w-4" />
                  {t('nav.facilities')}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/${locale}/users`} className="flex items-center gap-2 cursor-pointer">
                  <Users className="h-4 w-4" />
                  {t('nav.users')}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/${locale}/staff`} className="flex items-center gap-2 cursor-pointer">
                  <Stethoscope className="h-4 w-4" />
                  {t('nav.staff')}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/${locale}/spaces`} className="flex items-center gap-2 cursor-pointer">
                  <SquareStack className="h-4 w-4" />
                  {t('nav.spaces')}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/${locale}/rbac/roles`} className="flex items-center gap-2 cursor-pointer">
                  <ShieldCheck className="h-4 w-4" />
                  {t('nav.rbac')}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/${locale}/plugin-management`} className="flex items-center gap-2 cursor-pointer">
                  <Puzzle className="h-4 w-4" />
                  {t('nav.pluginManagement')}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {claims?.email ?? 'Not authenticated'}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {claims?.roles?.length ? `Role: ${claims.roles[0]}` : 'No roles assigned'}
                  </p>
                </div>
              </DropdownMenuLabel>

              {/* Facility Switching Section */}
              {facilities.length > 1 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <Building2 className="h-3 w-3" />
                    Switch Facility
                  </DropdownMenuLabel>
                  {facilities.map((facility) => {
                    const isCurrent = facility.id === claims?.facilityId;
                    const isDefault = facility.id === claims?.defaultFacilityId;

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
                          <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{facility.name}</span>
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
                </>
              )}

              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/${locale}/profile`} className="flex items-center gap-2 cursor-pointer">
                  <User className="h-4 w-4" />
                  {t('nav.profile')}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 text-destructive cursor-pointer">
                <LogOut className="h-4 w-4" />
                {t('actions.logout')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
