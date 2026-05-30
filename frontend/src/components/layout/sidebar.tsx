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
  Handshake,
  Stethoscope,
  Bell,
  Layers,
  ShieldCheck,
  RotateCcw,
  BookOpen,
  Heart,
  Dumbbell,
  Salad,
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
  MonitorPlay,
} from 'lucide-react';

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
  const [displayName, setDisplayName] = React.useState('User');
  const [facilityName, setFacilityName] = React.useState('Facility');
  const [isLoadingProfile, setIsLoadingProfile] = React.useState(false);
  const session = getSession();
  const claims = decodeAccessToken(session.accessToken);
  const { flags: navFlags, isLoading: isLoadingNavFlags } = useNavFeatureFlags();
  const { sections: pluginSections } = usePluginNavSections();

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
  }, [locale, matchesPath]);

  const indentClass = (depth: number) => {
    if (depth === 0) return '';
    if (depth === 1) return 'pl-6';
    return 'pl-10';
  };

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

  const renderItems = (items: NavItem[], parentKey: string, depth: number) =>
    items.map((item) => {
      const itemKey = `${parentKey}-${item.labelKey}-${item.href ?? 'group'}`;
      const hasChildren = Boolean(item.children?.length);
      const isChildActive = hasChildren && itemHasActiveChild(item);
      const isOpen = Boolean(openSubmenus[itemKey] ?? isChildActive);
      const Icon = item.icon;

      if (hasChildren) {
        if (isCollapsed) {
          return (
            <Popover key={itemKey}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  aria-label={t(item.labelKey)}
                  className={cn(
                    "flex w-full items-center justify-center gap-3 rounded-md px-2 py-2 text-sm transition-colors",
                    isChildActive
                      ? "bg-primary/10 text-primary border-l-[3px] border-primary rounded-l-none font-semibold"
                      : "text-muted-foreground font-medium hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                </button>
              </PopoverTrigger>
              <PopoverContent align="start" side="right" sideOffset={12} className="w-56 p-2">
                <p className="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground/70">
                  {t(item.labelKey)}
                </p>
                <div className="space-y-1">
                  {item.children?.map((child) => {
                    if (!child.href) return null;
                    const childPath = `/${locale}${child.href}`;
                    const childActive = activeHref === childPath;
                    const ChildIcon = child.icon;

                    return (
                      <Link
                        key={child.href}
                        href={childPath}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                          childActive
                            ? "bg-primary/10 text-primary font-semibold"
                            : "text-muted-foreground font-medium hover:bg-accent hover:text-accent-foreground"
                        )}
                      >
                        <ChildIcon className="h-4 w-4" />
                        <span>{t(child.labelKey)}</span>
                      </Link>
                    );
                  })}
                </div>
              </PopoverContent>
            </Popover>
          );
        }

        return (
          <div key={itemKey} className="space-y-1">
            <button
              type="button"
              onClick={() =>
                setOpenSubmenus((prev) => ({
                  ...prev,
                  [itemKey]: !isOpen,
                }))
              }
              className={cn(
                "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                isChildActive
                  ? "bg-primary/10 text-primary border-l-[3px] border-primary rounded-l-none font-semibold"
                  : "text-muted-foreground font-medium hover:bg-accent hover:text-accent-foreground",
                isCollapsed && "justify-center px-2"
              )}
              aria-expanded={isOpen}
              aria-controls={`${itemKey}-submenu`}
            >
              <Icon className="h-4 w-4" />
              {!isCollapsed && <span className="flex-1 text-left">{t(item.labelKey)}</span>}
              {!isCollapsed && (
                <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
              )}
            </button>
            {isOpen && (
              <div
                id={`${itemKey}-submenu`}
                className={cn("space-y-1", indentClass(depth))}
              >
                {renderItems(item.children ?? [], itemKey, depth + 1)}
              </div>
            )}
          </div>
        );
      }

      if (!item.href) return null;
      const fullPath = `/${locale}${item.href}`;
      const isActive = activeHref === fullPath;

      return (
        <Link
          key={itemKey}
          href={fullPath}
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
            isActive
              ? "bg-primary/10 text-primary border-l-[3px] border-primary rounded-l-none font-semibold"
              : "text-muted-foreground font-medium hover:bg-accent hover:text-accent-foreground",
            isCollapsed && "justify-center px-2"
          )}
        >
          <Icon className="h-4 w-4" />
          {!isCollapsed && <span>{t(item.labelKey)}</span>}
        </Link>
      );
    });

  return (
    <div
      className={cn(
        "relative z-20 flex h-full flex-col bg-background/80 dark:bg-[#0f1115]/80 backdrop-blur-md transition-all duration-300 ease-in-out shadow-lg border-r border-border/40",
        isCollapsed ? "w-20" : "w-72"
      )}
    >
      {/* Header */}
      <div
        className={cn(
          'relative flex h-16 items-center',
          isCollapsed ? 'justify-center px-3' : 'px-4'
        )}
      >
        <Link
          href={`/${locale}/dashboard`}
          className={cn(
            'flex items-center hover:opacity-80 transition-opacity group',
            isCollapsed ? 'justify-center' : 'gap-3'
          )}
        >
          {isCollapsed ? (
            <>
              <Image
                src="/athma-mark.svg"
                alt="Athma"
                width={40}
                height={40}
                className="h-10 w-10 transition-all group-hover:scale-105 dark:hidden"
              />
              <Image
                src="/athma-mark-dark.svg"
                alt="Athma"
                width={40}
                height={40}
                className="hidden h-10 w-10 transition-all group-hover:scale-105 dark:block"
              />
            </>
          ) : (
            <>
              <Image
                src="/athma-logo.svg"
                alt="Athma"
                width={145}
                height={42}
                className="h-7 w-auto dark:hidden"
              />
              <Image
                src="/athma-logo-dark.svg"
                alt="Athma"
                width={145}
                height={42}
                className="hidden h-7 w-auto dark:block"
              />
            </>
          )}
        </Link>

      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-6 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/20 hover:scrollbar-thumb-muted-foreground/40">
        {visibleSections.map((section, sectionIndex) => (
          <div key={`${section.labelKey ?? 'section'}-${sectionIndex}`} className="space-y-6">
            {!isCollapsed && section.labelKey && (
              <p className="px-3 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-2">
                {t(section.labelKey)}
              </p>
            )}
            {renderItems(section.items, section.labelKey ?? 'section', 1)}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border/40 bg-background/50 backdrop-blur-sm">
        {!isCollapsed && (
          <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-card/40 px-3 py-3 shadow-sm hover:bg-card/60 transition-colors cursor-pointer group">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-primary/5 text-sm font-bold text-primary ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
              {initials}
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                {isLoadingProfile ? 'Loading user...' : displayName}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {isLoadingProfile ? 'Loading facility...' : facilityName}
              </span>
            </div>
          </div>
        )}
        {isCollapsed && (
          <div className="flex justify-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-primary/5 text-xs font-bold text-primary hover:scale-105 transition-transform cursor-pointer">
              {initials}
            </div>
          </div>
        )}
      </div>

      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggle();
        }}
        className={cn(
          'absolute -right-4 top-1/2 z-50 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow-md hover:bg-accent hover:text-foreground hover:scale-105 transition-all'
        )}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>
    </div>
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
