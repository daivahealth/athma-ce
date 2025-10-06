'use client';

import { useTranslations } from 'next-intl';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Bell, ShieldAlert, Search } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { decodeAccessToken } from '@/lib/auth/tokens';
import { getSession, logout } from '@/lib/api/client';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

export function Topbar({ locale }: { locale: string }) {
  const t = useTranslations('app');
  const toast = useToast();
  const [masked, setMasked] = useState(true);
  const session = getSession();
  const claims = decodeAccessToken(session.accessToken);

  useEffect(() => {
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
  }, [locale]);

  const handleLogout = async () => {
    try {
      await logout();
      toast({ title: 'Signed out', description: 'Session cleared securely.', variant: 'success' });
    } catch (error) {
      toast({ title: 'Unable to sign out', description: 'Please try again.', variant: 'destructive' });
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center border-b border-border bg-background/75 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex flex-1 items-center gap-4">
        <div className="relative hidden w-80 lg:flex">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search records, patients, orders" aria-label="Search" />
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <ShieldAlert className="h-4 w-4 text-success" />
          <span>PDPL compliant</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-destructive" />
        </Button>
        <Separator orientation="vertical" className="h-6" />
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium">{claims?.email ?? 'Guest'}</p>
            <p className={cn('text-xs text-muted-foreground/80 transition', masked && 'blur-sm')} data-tenant-mask={masked}>
              Tenant: {claims?.tenantId ?? 'Unset'}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setMasked((prev) => !prev)}>
            {masked ? 'Reveal' : 'Mask'}
          </Button>
          <Button variant="destructive" size="sm" onClick={handleLogout}>
            {t('subtitle') ? 'Sign out' : 'Logout'}
          </Button>
        </div>
      </div>
    </header>
  );
}
