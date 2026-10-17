'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { getSession } from '@/lib/api/client';
import { decodeAccessToken } from '@/lib/auth/tokens';
import { userService } from '@/modules/foundation/services/user-service';
import { useNavFeatureFlags } from '@/modules/foundation/hooks/use-nav-feature-flags';
import { usePluginNavSections } from '@/lib/plugins/use-plugin-nav';
import { pluginIconMap } from '@/lib/plugins/icon-map';
// Register frontend plugins (oncology, …) wherever the sidebar renders, so their
// nav sections appear across every route group — not only under (dashboard).
import '@/plugins';
import {
  LayoutDashboard,
  Users,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Menu,
  CalendarClock,
  Calendar,
  FileCheck,
  FileText,
  Database,
  Settings,
  ClipboardList,
  Activity,
  Landmark,
  ReceiptText,
  Wallet,
  Split,
  Stethoscope,
  Bell,
  Layers,
  ShieldCheck,
  RotateCcw,
  BookOpen,
  Heart,
  Dumbbell,
  Smartphone,
  TestTube,
  Target,
  Crown,
  CreditCard,
  Timer,
  LayoutTemplate,
  BarChart3,
  Sparkles,
  Search,
  FlaskConical,
  ScanLine,
  Scissors,
  Pill,
  Package,
  MonitorPlay } from 'lucide-react';

type NavItem = {
  href?: string;
  icon: React.ElementType;
  labelKey: string;
  children?: NavItem[];
};

type NavSection = {
  labelKey?: string;
  items: NavItem[];
  featureFlag?: string;
};

const navSections: NavSection[] = [
  {
    items: [
      { href: '/dashboard', icon: LayoutDashboard, labelKey: 'nav.dashboard' },
    ],
  },
  {
    items: [
      {
        icon: Users,
        labelKey: 'nav.patientAccess',
        children: [
          { href: '/patients', icon: Users, labelKey: 'nav.patients' },
          { href: '/encounters', icon: FileText, labelKey: 'nav.encounters' },
          { href: '/scheduling/appointments', icon: Calendar, labelKey: 'nav.appointments' },
          { href: '/scheduling/calendar', icon: CalendarClock, labelKey: 'nav.staffCalendar' },
          { href: '/scheduling/staff', icon: CalendarClock, labelKey: 'nav.staffScheduling' },
        ],
      },
    ],
  },
  {
    items: [
      {
        icon: ClipboardList,
        labelKey: 'nav.clinical',
        children: [
          { href: '/charting', icon: ClipboardList, labelKey: 'nav.charting' },
          { href: '/triage', icon: Activity, labelKey: 'nav.triage' },
        ],
      },
    ],
  },
  {
    items: [
      {
        icon: Scissors,
        labelKey: 'nav.ot',
        children: [
          { href: '/ot/board', icon: MonitorPlay, labelKey: 'nav.otBoard' },
          { href: '/ot/requests', icon: ClipboardList, labelKey: 'nav.otRequests' },
          { href: '/ot/schedules', icon: CalendarClock, labelKey: 'nav.otSchedules' },
          { href: '/ot/reports', icon: FileText, labelKey: 'nav.otReports' },
          { href: '/ot/rooms', icon: ShieldCheck, labelKey: 'nav.otRooms' },
        ],
      },
    ],
  },
  {
    featureFlag: 'feature.nav.resultsReporting',
    items: [
      {
        icon: FlaskConical,
        labelKey: 'nav.lab',
        children: [
          { href: '/results/lab', icon: FlaskConical, labelKey: 'nav.labResults' },
          { href: '/results/lab/collection', icon: TestTube, labelKey: 'nav.labCollection' },
          { href: '/results/lab/operations', icon: ClipboardList, labelKey: 'nav.labOperations' },
        ],
      },
      {
        icon: FileText,
        labelKey: 'nav.resultsReporting',
        children: [
          { href: '/results/imaging', icon: ScanLine, labelKey: 'nav.imagingResults' },
          { href: '/results/procedure', icon: Scissors, labelKey: 'nav.procedureResults' },
        ],
      },
    ],
  },
  {
    featureFlag: 'feature.nav.inpatientCare',
    items: [
      {
        icon: Stethoscope,
        labelKey: 'nav.inpatientCare',
        children: [
          { href: '/inpatient/admissions', icon: ClipboardList, labelKey: 'nav.inpatientAdmissions' },
          { href: '/inpatient/discharges', icon: FileCheck, labelKey: 'nav.inpatientDischarges' },
          { href: '/inpatient/discharge-summaries', icon: FileText, labelKey: 'nav.inpatientDischargeSummaries' },
          { href: '/inpatient/bed-browser', icon: Stethoscope, labelKey: 'nav.inpatientBedBrowser' },
          { href: '/inpatient/wards', icon: CalendarClock, labelKey: 'nav.inpatientWardBoard' },
        ],
      },
    ],
  },
  {
    items: [
      {
        icon: ReceiptText,
        labelKey: 'nav.billing',
        children: [
          { href: '/invoices', icon: ReceiptText, labelKey: 'nav.invoices' },
          { href: '/receipts', icon: Wallet, labelKey: 'nav.receipts' },
          { href: '/revenue-cycle/refunds', icon: RotateCcw, labelKey: 'nav.refunds' },
          { href: '/patient-ledger', icon: BookOpen, labelKey: 'nav.patientLedger' },
          { href: '/revenue-cycle/credit-notes', icon: FileCheck, labelKey: 'nav.creditNotes' },
          { href: '/revenue-cycle/debit-notes', icon: FileText, labelKey: 'nav.debitNotes' },
          { href: '/billing-workspace', icon: Split, labelKey: 'nav.billingWorkspace' },
          { href: '/medical-coding', icon: Stethoscope, labelKey: 'nav.medicalCoding' },
        ],
      },
    ],
  },
  {
    featureFlag: 'feature.nav.revenueCycle',
    items: [
      {
        icon: Landmark,
        labelKey: 'nav.revenueCycle',
        children: [
          { href: '/revenue-cycle/claims', icon: FileText, labelKey: 'nav.claims' },
          { href: '/revenue-cycle/batches', icon: Layers, labelKey: 'nav.batches' },
          { href: '/revenue-cycle/eligibility', icon: ShieldCheck, labelKey: 'nav.eligibility' },
          { href: '/revenue-cycle/preauth', icon: ClipboardList, labelKey: 'nav.preauth' },
          { href: '/revenue-cycle/remittance', icon: ReceiptText, labelKey: 'nav.remittance' },
        ],
      },
    ],
  },
  {
    featureFlag: 'feature.nav.pharmacy',
    items: [
      {
        icon: Pill,
        labelKey: 'nav.pharmacy',
        children: [
          { href: '/pharmacy/queue', icon: ClipboardList, labelKey: 'nav.dispense' },
          { href: '/pharmacy/stock', icon: Package, labelKey: 'nav.pharmacyStock' },
          { href: '/pharmacy/alerts', icon: Bell, labelKey: 'nav.pharmacyAlerts' },
        ],
      },
    ],
  },
  {
    featureFlag: 'feature.nav.wellness',
    items: [
      {
        icon: Heart,
        labelKey: 'nav.wellness',
        children: [
          { href: '/wellness', icon: Heart, labelKey: 'nav.wellnessDashboard' },
          { href: '/wellness/assessments', icon: ClipboardList, labelKey: 'nav.wellnessAssessments' },
          { href: '/wellness/templates', icon: LayoutTemplate, labelKey: 'nav.assessmentTemplates' },
          { href: '/wellness/biomarkers', icon: TestTube, labelKey: 'nav.biomarkers' },
          { href: '/wellness/programs', icon: Target, labelKey: 'nav.wellnessPrograms' },
          { href: '/wellness/longevity', icon: Timer, labelKey: 'nav.longevity' },
          { href: '/wellness/lifestyle', icon: Dumbbell, labelKey: 'nav.lifestyle' },
          { href: '/wellness/devices', icon: Smartphone, labelKey: 'nav.devices' },
        ],
      },
    ],
  },
  {
    featureFlag: 'feature.nav.membership',
    items: [
      {
        icon: Crown,
        labelKey: 'nav.membership',
        children: [
          { href: '/membership', icon: Crown, labelKey: 'nav.membershipDashboard' },
          { href: '/membership/plans', icon: CreditCard, labelKey: 'nav.membershipPlans' },
          { href: '/membership/subscriptions', icon: Users, labelKey: 'nav.subscriptions' },
        ],
      },
    ],
  },
  {
    featureFlag: 'feature.nav.prm',
    items: [
      {
        icon: Bell,
        labelKey: 'nav.prm',
        children: [
          { href: '/prm/events', icon: Bell, labelKey: 'nav.prmEvents' },
          { href: '/prm/tasks', icon: ClipboardList, labelKey: 'nav.prmTasks' },
          { href: '/prm/messages', icon: Activity, labelKey: 'nav.prmMessages' },
        ],
      },
    ],
  },
  {
    featureFlag: 'feature.nav.analytics',
    items: [
      {
        icon: BarChart3,
        labelKey: 'nav.analytics',
        children: [
          { href: '/reports', icon: Sparkles, labelKey: 'nav.reportBuilder' },
          { href: '/search', icon: Search, labelKey: 'nav.clinicalSearch' },
        ],
      },
    ],
  },
  {
    items: [
      {
        icon: Settings,
        labelKey: 'nav.administration',
        children: [
          { href: '/configurations', icon: Settings, labelKey: 'nav.configurations' },
          { href: '/configurations/abdm', icon: ShieldCheck, labelKey: 'nav.abdmSettings' },
          { href: '/catalogs', icon: Database, labelKey: 'nav.catalogs' },
          { href: '/rcm-setup', icon: Landmark, labelKey: 'nav.rcmSetup' },
          { href: '/pe-setup', icon: Bell, labelKey: 'nav.peSetup' },
        ],
      },
    ],
  },
];

interface SidebarProps {
  locale: string;
  isCollapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ locale, isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const t = useTranslations();
  const [openSubmenus, setOpenSubmenus] = React.useState<Record<string, boolean>>({});
  const [openFlyoutKey, setOpenFlyoutKey] = React.useState<string | null>(null);
  const [displayName, setDisplayName] = React.useState('User');
  const [facilityName, setFacilityName] = React.useState('Facility');
  const [isLoadingProfile, setIsLoadingProfile] = React.useState(false);
  const session = getSession();
  const claims = decodeAccessToken(session.accessToken);
  const { flags: navFlags, isLoading: isLoadingNavFlags } = useNavFeatureFlags();
  const { sections: pluginSections } = usePluginNavSections();

  // Collapse state is controlled entirely by explicit clicks on the toggle
  // button (no hover-to-expand) so it doesn't fight the user's intent.
  const collapsed = isCollapsed;

  const visibleSections = React.useMemo(() => {
    const coreSections = isLoadingNavFlags
      ? navSections
      : navSections.filter((section) => {
          if (!section.featureFlag) return true;
          return navFlags[section.featureFlag] === true;
        });

    if (pluginSections.length === 0) return coreSections;

    const adminIdx = coreSections.findIndex(
      (s) => s.items[0]?.labelKey === 'nav.administration',
    );

    const pluginNavSections: NavSection[] = pluginSections.map((ps) => ({
      featureFlag: ps.featureFlag,
      items: ps.navigation.map((nav) => ({
        icon: pluginIconMap[nav.icon] || Stethoscope,
        labelKey: nav.labelKey,
        children: nav.children.map((child) => ({
          href: child.href,
          icon: pluginIconMap[child.icon] || Stethoscope,
          labelKey: child.labelKey,
        })),
      })),
    }));

    if (adminIdx >= 0) {
      return [
        ...coreSections.slice(0, adminIdx),
        ...pluginNavSections,
        ...coreSections.slice(adminIdx),
      ];
    }

    return [...coreSections, ...pluginNavSections];
  }, [navFlags, isLoadingNavFlags, pluginSections]);

  React.useEffect(() => {
    let isActive = true;
    const loadProfile = async () => {
      if (!claims?.userId) return;
      setIsLoadingProfile(true);
      try {
        const [user, access] = await Promise.all([
          userService.getById(claims.userId),
          userService.getUserFacilities(claims.userId),
        ]);
        const name =
          user.displayName ||
          [user.firstName, user.lastName].filter(Boolean).join(' ') ||
          user.email ||
          'User';
        const currentFacility =
          access.facilities?.find((facility) => facility.id === claims.facilityId) ||
          access.defaultFacility;
        if (isActive) {
          setDisplayName(name);
          setFacilityName(currentFacility?.name || 'Facility');
        }
      } catch {
        if (isActive) {
          setDisplayName(claims?.email ?? 'User');
          setFacilityName('Facility');
        }
      } finally {
        if (isActive) {
          setIsLoadingProfile(false);
        }
      }
    };
    loadProfile();
    return () => {
      isActive = false;
    };
  }, [claims?.userId, claims?.facilityId]);

  const matchesPath = React.useCallback(
    (fullPath: string) => pathname === fullPath || pathname.startsWith(`${fullPath}/`),
    [pathname]
  );

  const activeHref = React.useMemo(() => {
    let bestMatch = '';

    const visitItems = (items: NavItem[]) => {
      items.forEach((item) => {
        if (item.href) {
          const fullPath = `/${locale}${item.href}`;
          if (matchesPath(fullPath) && fullPath.length > bestMatch.length) {
            bestMatch = fullPath;
          }
        }

        if (item.children) {
          visitItems(item.children);
        }
      });
    };

    visibleSections.forEach((section) => visitItems(section.items));
    return bestMatch;
  }, [locale, matchesPath, visibleSections]);

  const initials = React.useMemo(() => {
    const parts = displayName.trim().split(' ').filter(Boolean);
    if (parts.length === 0) return 'U';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }, [displayName]);

  const itemHasActiveChild = React.useCallback(
    (item: NavItem) => {
      const visit = (node: NavItem): boolean => {
        if (node.href && activeHref === `/${locale}${node.href}`) {
          return true;
        }
        if (!node.children) return false;
        return node.children.some(visit);
      };
      return visit(item);
    },
    [activeHref, locale]
  );

  const renderSubItems = (items: NavItem[], parentKey: string, onNavigate?: () => void): React.ReactNode =>
    items.map((child) => {
      const childKey = `${parentKey}-${child.labelKey}-${child.href ?? 'group'}`;
      const ChildIcon = child.icon;

      if (child.children?.length) {
        return (
          <li key={childKey}>
            <p className={SECTION_LABEL}>{t(child.labelKey)}</p>
            <ul className="flex flex-col gap-1">{renderSubItems(child.children, childKey, onNavigate)}</ul>
          </li>
        );
      }

      if (!child.href) return null;
      const childPath = `/${locale}${child.href}`;
      const childActive = activeHref === childPath;

      return (
        <li key={childKey}>
          <Link
            href={childPath}
            onClick={onNavigate}
            aria-current={childActive ? 'page' : undefined}
            className={cn(SUB_ROW, childActive ? `${ROW_ACTIVE} font-normal [&>svg]:text-primary` : ROW_IDLE)}
          >
            <ChildIcon aria-hidden />
            <span className="truncate">{t(child.labelKey)}</span>
          </Link>
        </li>
      );
    });

  const renderItem = (item: NavItem, itemKey: string) => {
    const Icon = item.icon;
    const label = t(item.labelKey);
    const hasChildren = Boolean(item.children?.length);

    if (hasChildren) {
      const isChildActive = itemHasActiveChild(item);

      if (collapsed) {
        return (
          <CollapsedFlyout
            key={itemKey}
            menuKey={itemKey}
            title={label}
            icon={Icon}
            isActive={isChildActive}
            openKey={openFlyoutKey}
            onOpen={setOpenFlyoutKey}
            onClose={() => setOpenFlyoutKey(null)}
          >
            {renderSubItems(item.children ?? [], itemKey, () => setOpenFlyoutKey(null))}
          </CollapsedFlyout>
        );
      }

      const isOpen = Boolean(openSubmenus[itemKey] ?? isChildActive);

      return (
        <li key={itemKey}>
          <button
            type="button"
            onClick={() =>
              setOpenSubmenus((prev) => ({
                ...prev,
                [itemKey]: !isOpen,
              }))
            }
            className={cn(ROOT_ROW, isChildActive ? ROW_ACTIVE : ROW_IDLE)}
            aria-expanded={isOpen}
            aria-controls={`${itemKey}-submenu`}
          >
            <Icon aria-hidden />
            <span className="min-w-0 flex-1 truncate">{label}</span>
            {isOpen ? (
              <ChevronDown className="text-muted-foreground" aria-hidden />
            ) : (
              <ChevronRight className="text-muted-foreground" aria-hidden />
            )}
          </button>
          {isOpen && (
            <ul id={`${itemKey}-submenu`} className={SUB_LIST}>
              {renderSubItems(item.children ?? [], itemKey)}
            </ul>
          )}
        </li>
      );
    }

    if (!item.href) return null;
    const fullPath = `/${locale}${item.href}`;
    const isActive = activeHref === fullPath;

    return (
      <li key={itemKey}>
        <Link
          href={fullPath}
          title={collapsed ? label : undefined}
          aria-label={collapsed ? label : undefined}
          aria-current={isActive ? 'page' : undefined}
          className={cn(collapsed ? ICON_ROW : ROOT_ROW, isActive ? ROW_ACTIVE : ROW_IDLE)}
        >
          <Icon aria-hidden />
          {!collapsed && <span className="min-w-0 flex-1 truncate">{label}</span>}
        </Link>
      </li>
    );
  };

  return (
    <div
      className={cn(
        "relative h-full shrink-0 transition-[width] duration-200 ease-in-out",
        collapsed ? "w-14" : "w-64"
      )}
    >
      <div className="absolute inset-0 flex h-full flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
        {/* Header */}
        <div className={cn('flex h-14 shrink-0 items-center', collapsed ? 'justify-center px-2' : 'px-4')}>
          <Link
            href={`/${locale}/dashboard`}
            className="flex items-center rounded-md outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-sidebar-ring"
          >
            {collapsed ? (
              <>
                <Image src="/athma-mark.svg" alt="Athma" width={24} height={24} className="h-6 w-6 dark:hidden" />
                <Image src="/athma-mark-dark.svg" alt="Athma" width={24} height={24} className="hidden h-6 w-6 dark:block" />
              </>
            ) : (
              <>
                <Image src="/athma-logo.svg" alt="Athma" width={145} height={42} className="h-6 w-auto dark:hidden" />
                <Image src="/athma-logo-dark.svg" alt="Athma" width={145} height={42} className="hidden h-6 w-auto dark:block" />
              </>
            )}
          </Link>
        </div>

        {/* Collapse toggle, on the sidebar's right edge so it is in the same place open or closed. */}
        <button
          type="button"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggle();
          }}
          className="absolute -right-3 top-4 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-sidebar-border bg-background text-muted-foreground shadow-sm outline-none transition-colors hover:border-primary/25 hover:text-primary focus-visible:ring-2 focus-visible:ring-sidebar-ring"
        >
          {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
        </button>

        {/* Navigation */}
        <nav
          aria-label="Main"
          className={cn('pane-scroll flex-1 overflow-y-auto overflow-x-hidden', collapsed ? 'px-1 py-2' : 'px-2 py-3')}
        >
          <ul className={cn('flex min-w-0 flex-col gap-1', collapsed && 'items-center')}>
            {visibleSections.flatMap((section, sectionIndex) =>
              section.items.map((item) =>
                renderItem(item, `${section.labelKey ?? 'section'}-${sectionIndex}-${item.labelKey}-${item.href ?? 'group'}`)
              )
            )}
          </ul>
        </nav>

        {/* Footer */}
        <div className={cn('shrink-0 border-t border-sidebar-border bg-sidebar-footer', collapsed ? 'px-1 py-2' : 'p-1.5')}>
          <div
            className={cn('flex items-center rounded-md', collapsed ? 'justify-center' : 'gap-2 px-2 py-1.5')}
            title={collapsed ? `${displayName} · ${facilityName}` : undefined}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
              {initials}
            </div>
            {!collapsed && (
              <div className="flex min-w-0 flex-1 flex-col leading-tight">
                <span className="truncate text-sm font-medium text-sidebar-foreground">
                  {isLoadingProfile ? 'Loading user...' : displayName}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {isLoadingProfile ? 'Loading facility...' : facilityName}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/*
 * Row styles, after prrapp's sidebar: transparent until hovered, a faint
 * primary tint with a hairline primary border when active.
 */
const ROW_BASE =
  'flex items-center gap-2 overflow-hidden rounded-md border border-transparent text-left text-sm text-sidebar-foreground outline-none transition-colors focus-visible:ring-2 focus-visible:ring-sidebar-ring [&>svg]:h-4 [&>svg]:w-4 [&>svg]:shrink-0';
const ROOT_ROW = `${ROW_BASE} h-8 w-full px-2`;
const ICON_ROW = `${ROW_BASE} h-8 w-8 justify-center p-2`;
const SUB_ROW = `${ROW_BASE} h-7 w-full min-w-0 px-2 [&>svg]:text-sidebar-accent-foreground hover:[&>svg]:text-primary/90`;
const ROW_IDLE = 'hover:border-primary/15 hover:bg-primary/5 hover:text-primary/90';
const ROW_ACTIVE = 'border-primary/25 bg-primary/[0.08] font-medium text-primary';
/** The guide line down the left of an open group's children. */
const SUB_LIST = 'mx-3.5 mt-1 flex min-w-0 flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5';
const SECTION_LABEL = 'px-2 pb-1 pt-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground';

const FLYOUT_CLOSE_DELAY_MS = 120;

interface CollapsedFlyoutProps {
  menuKey: string;
  title: string;
  icon: React.ElementType;
  isActive: boolean;
  openKey: string | null;
  onOpen: (key: string) => void;
  onClose: () => void;
  children: React.ReactNode;
}

/** A group on the icon rail: hovering or clicking its icon opens its pages beside it. */
function CollapsedFlyout({ menuKey, title, icon: Icon, isActive, openKey, onOpen, onClose, children }: CollapsedFlyoutProps) {
  const closeTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const isOpen = openKey === menuKey;

  const clearCloseTimer = React.useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const scheduleClose = React.useCallback(() => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(onClose, FLYOUT_CLOSE_DELAY_MS);
  }, [clearCloseTimer, onClose]);

  const handleOpen = React.useCallback(() => {
    clearCloseTimer();
    onOpen(menuKey);
  }, [clearCloseTimer, menuKey, onOpen]);

  React.useEffect(() => () => clearCloseTimer(), [clearCloseTimer]);

  return (
    <li>
      <Popover open={isOpen} onOpenChange={(next) => (next ? handleOpen() : onClose())}>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label={title}
            className={cn(ICON_ROW, isActive || isOpen ? ROW_ACTIVE : ROW_IDLE)}
            onMouseEnter={handleOpen}
            onMouseLeave={scheduleClose}
          >
            <Icon aria-hidden />
          </button>
        </PopoverTrigger>
        <PopoverContent
          side="right"
          align="start"
          sideOffset={8}
          className="w-56 border-sidebar-border p-1"
          onMouseEnter={handleOpen}
          onMouseLeave={scheduleClose}
        >
          <p className={SECTION_LABEL}>{title}</p>
          <ul className="flex flex-col gap-0.5">{children}</ul>
        </PopoverContent>
      </Popover>
    </li>
  );
}

// Mobile Menu Button
export function MobileMenuButton({ onToggle }: { onToggle: () => void }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onToggle}
      className="md:hidden"
    >
      <Menu className="h-5 w-5" />
    </Button>
  );
}
