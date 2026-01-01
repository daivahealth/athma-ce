'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  LayoutDashboard,
  Users,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Menu,
  CalendarClock,
  Calendar,
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
        icon: ReceiptText,
        labelKey: 'nav.billing',
        children: [
          { href: '/invoices', icon: ReceiptText, labelKey: 'nav.invoices' },
          { href: '/receipts', icon: Wallet, labelKey: 'nav.receipts' },
          { href: '/billing-workspace', icon: Split, labelKey: 'nav.billingWorkspace' },
          { href: '/medical-coding', icon: Stethoscope, labelKey: 'nav.medicalCoding' },
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

    navSections.forEach((section) => visitItems(section.items));
    return bestMatch;
  }, [locale, matchesPath]);

  const indentClass = (depth: number) => {
    if (depth === 0) return '';
    if (depth === 1) return 'pl-6';
    return 'pl-10';
  };

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
                    "flex w-full items-center justify-center gap-3 rounded-md px-2 py-2 text-sm font-medium transition-colors",
                    isChildActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
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
                          "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                          childActive
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
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
                "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isChildActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
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
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            isActive
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
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
        "flex h-full flex-col bg-background/90 dark:bg-[#0f1115] transition-all duration-300 ease-in-out shadow-lg border-r border-border/30",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex h-14 items-center justify-between px-4 border-b border-border/40 dark:border-white/5">
        <Link href={`/${locale}/dashboard`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md">
            <span className="text-base font-bold">Z</span>
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-base font-bold leading-tight">Zeal</span>
              <span className="text-xs text-muted-foreground leading-tight">Healthcare Platform</span>
            </div>
          )}
        </Link>

        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggle();
          }}
          className={cn("h-8 w-8 hover:bg-accent", isCollapsed && "mx-auto")}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-6 p-4 overflow-y-auto">
        {navSections.map((section, sectionIndex) => (
          <div key={`${section.labelKey ?? 'section'}-${sectionIndex}`} className="space-y-1">
            {!isCollapsed && section.labelKey && (
              <p className="px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground/70">
                {t(section.labelKey)}
              </p>
            )}
            {renderItems(section.items, section.labelKey ?? 'section', 1)}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4">
        {!isCollapsed && (
          <p className="text-xs text-muted-foreground text-center">
            PDPL compliant · Audit ready
          </p>
        )}
        {isCollapsed && (
          <div className="flex justify-center">
            <div className="h-0.5 w-6 rounded-full bg-muted-foreground/30" />
          </div>
        )}
      </div>
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
