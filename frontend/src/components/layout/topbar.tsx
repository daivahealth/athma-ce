'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  Bell, 
  Search, 
  ShieldAlert, 
  LogOut
} from 'lucide-react';
import { ThemeToggle } from './theme-toggle';
import { MobileMenuButton } from './sidebar';
import { FacilitySwitcher } from './facility-switcher';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { decodeAccessToken } from '@/lib/auth/tokens';
import { getSession, logout } from '@/lib/api/client';
import { useToast } from '@/components/ui/use-toast';

interface TopbarProps {
  locale: string;
  onSidebarToggle: () => void;
}

export function Topbar({ locale, onSidebarToggle }: TopbarProps) {
  const t = useTranslations('app');
  const toast = useToast();
  const router = useRouter();
  const [session, setSession] = useState(getSession());

  useEffect(() => {
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
  }, [locale]);

  const claims = decodeAccessToken(session.accessToken);

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
    <header className="flex h-16 items-center bg-gradient-to-r from-background to-muted/20 px-6 shadow-sm">
      <div className="flex flex-1 items-center gap-4">
        {/* Mobile Menu Button */}
        <MobileMenuButton onToggle={onSidebarToggle} />
        
        {/* Search */}
        <div className="relative hidden w-80 lg:flex">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            className="pl-9" 
            placeholder="Search records, patients, orders" 
            aria-label="Search" 
          />
        </div>
        
        {/* Status */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <ShieldAlert className="h-4 w-4 text-success" />
          <span className="hidden sm:inline">PDPL compliant</span>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        {/* Facility Switcher */}
        <FacilitySwitcher />
        
        {/* Theme Toggle */}
        <ThemeToggle />
        
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-destructive" />
        </Button>
        
        <Separator orientation="vertical" className="h-6" />
        
        {/* User Section */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium">
              {claims?.email ?? 'Not authenticated'}
            </p>
            <p className="text-xs text-muted-foreground">
              {claims?.roles?.length ? `Role: ${claims.roles[0]}` : 'No roles assigned'}
            </p>
          </div>
          
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Sign out</span>
          </Button>
        </div>
      </div>
    </header>
  );
}