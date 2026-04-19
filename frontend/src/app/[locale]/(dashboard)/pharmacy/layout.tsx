'use client';

import { usePathname, useParams } from 'next/navigation';
import Link from 'next/link';
import { ClipboardList, Package, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/pharmacy/queue',  label: 'Dispensing',  icon: ClipboardList },
  { href: '/pharmacy/stock',  label: 'Stock',        icon: Package },
  { href: '/pharmacy/alerts', label: 'Alerts',       icon: Bell },
];

export default function PharmacyLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const params = useParams();
  const locale = params.locale as string;

  return (
    <div className="flex flex-col h-full">
      <div className="border-b bg-background px-6 pt-4">
        <h1 className="text-xl font-semibold mb-3">Pharmacy</h1>
        <nav className="flex gap-1">
          {navItems.map((item) => {
            const fullHref = `/${locale}${item.href}`;
            // "Dispensing" is active for /pharmacy/queue and /pharmacy/dispensings (detail pages)
            const isActive =
              item.href === '/pharmacy/queue'
                ? pathname.includes('/pharmacy/queue') || pathname.includes('/pharmacy/dispensings')
                : pathname.includes(item.href);
            return (
              <Link
                key={item.href}
                href={fullHref}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 text-sm rounded-t-md border-b-2 transition-colors',
                  isActive
                    ? 'border-primary text-primary font-medium'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted',
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="flex-1 overflow-auto p-6">{children}</div>
    </div>
  );
}
