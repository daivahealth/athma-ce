'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  Hospital, 
  Stethoscope, 
  SquareStack, 
  ShieldCheck, 
  UserCircle2,
  ChevronLeft,
  ChevronRight,
  Menu,
  CalendarClock
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, labelKey: 'nav.dashboard' },
  { href: '/patients', icon: Users, labelKey: 'nav.patients' },
  { href: '/tenants', icon: Building2, labelKey: 'nav.tenants' },
  { href: '/users', icon: UserCircle2, labelKey: 'nav.users' },
  { href: '/facilities', icon: Hospital, labelKey: 'nav.facilities' },
  { href: '/staff', icon: Stethoscope, labelKey: 'nav.staff' },
  { href: '/scheduling/staff', icon: CalendarClock, labelKey: 'nav.staffScheduling' },
  { href: '/spaces', icon: SquareStack, labelKey: 'nav.spaces' },
  { href: '/rbac/roles', icon: ShieldCheck, labelKey: 'nav.rbac' },
  { href: '/profile', icon: UserCircle2, labelKey: 'nav.profile' },
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
        "flex h-full flex-col bg-gradient-to-b from-background to-muted/30 transition-all duration-300 ease-in-out shadow-lg",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-sm font-bold">Z</span>
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold">Zeal PMS</span>
            </div>
          )}
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggle();
          }}
          className="h-8 w-8 hover:bg-accent"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
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
