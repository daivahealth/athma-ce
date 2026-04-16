'use client';

import { usePathname, useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ClipboardList, FileCheck, Package, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  { href: '/pharmacy/queue', label: 'Dispensing Queue', icon: ClipboardList },
  { href: '/pharmacy/dispensings', label: 'History', icon: FileCheck },
  { href: '/pharmacy/stock', label: 'Stock', icon: Package },
  { href: '/pharmacy/alerts', label: 'Alerts', icon: Bell },
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
          {tabs.map((tab) => {
            const fullHref = `/${locale}${tab.href}`;
            const isActive = pathname.includes(tab.href);
            return (
              <Link
                key={tab.href}
                href={fullHref}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 text-sm rounded-t-md border-b-2 transition-colors',
                  isActive
                    ? 'border-primary text-primary font-medium'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted',
                )}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="flex-1 overflow-auto p-6">{children}</div>
    </div>
  );
}
