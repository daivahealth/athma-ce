'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Building2, Users, Hospital, Stethoscope, SquareStack, ShieldCheck, UserCircle2 } from 'lucide-react';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, labelKey: 'nav.dashboard' },
  { href: '/tenants', icon: Building2, labelKey: 'nav.tenants' },
  { href: '/users', icon: Users, labelKey: 'nav.users' },
  { href: '/facilities', icon: Hospital, labelKey: 'nav.facilities' },
  { href: '/staff', icon: Stethoscope, labelKey: 'nav.staff' },
  { href: '/spaces', icon: SquareStack, labelKey: 'nav.spaces' },
  { href: '/rbac/roles', icon: ShieldCheck, labelKey: 'nav.rbac' },
  { href: '/profile', icon: UserCircle2, labelKey: 'nav.profile' },
];

export function Sidebar({ locale }: { locale: string }) {
  const pathname = usePathname();
  const t = useTranslations();

  return (
    <aside className="group flex h-full w-64 shrink-0 flex-col border-r border-border bg-card/40 backdrop-blur-lg">
      <div className="flex items-center gap-3 px-6 py-6">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
          <span className="text-xl font-semibold">Z</span>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Zeal Care</p>
          <p className="text-lg font-bold">PMS · EHR · ECM</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-4">
        {navItems.map(({ href, icon: Icon, labelKey }) => {
          const fullPath = `/${locale}${href}`;
          const isActive = pathname === fullPath;
          return (
            <Link
              key={href}
              href={fullPath}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{t(labelKey)}</span>
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border px-4 py-4 text-xs text-muted-foreground">
        <p>PDPL compliant · Audit ready</p>
      </div>
    </aside>
  );
}
