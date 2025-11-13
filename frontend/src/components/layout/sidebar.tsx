'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Users,
  ChevronLeft,
  ChevronRight,
  Menu,
  CalendarClock,
  Calendar,
  FileText,
  Database,
  Settings,
  ClipboardList,
  Activity,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, labelKey: 'nav.dashboard' },
  { href: '/patients', icon: Users, labelKey: 'nav.patients' },
  { href: '/encounters', icon: FileText, labelKey: 'nav.encounters' },
  { href: '/charting', icon: ClipboardList, labelKey: 'nav.charting' },
  { href: '/triage', icon: Activity, labelKey: 'nav.triage' },
  { href: '/scheduling/staff', icon: CalendarClock, labelKey: 'nav.staffScheduling' },
  { href: '/scheduling/appointments', icon: Calendar, labelKey: 'nav.appointments' },
  { href: '/catalogs', icon: Database, labelKey: 'nav.catalogs' },
  { href: '/configurations', icon: Settings, labelKey: 'nav.configurations' },
];

interface SidebarProps {
  locale: string;
  isCollapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ locale, isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const t = useTranslations();

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
      <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
        {navItems.map(({ href, icon: Icon, labelKey }) => {
          const fullPath = `/${locale}${href}`;
          const isActive = pathname === fullPath;

          return (
            <Link
              key={href}
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
              {!isCollapsed && <span>{t(labelKey)}</span>}
            </Link>
          );
        })}
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
