'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Sidebar } from './sidebar';

interface MobileSidebarProps {
  locale: string;
  isOpen: boolean;
  onClose: () => void;
}

export function MobileSidebar({ locale, isOpen, onClose }: MobileSidebarProps) {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out md:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <Sidebar 
          locale={locale} 
          isCollapsed={false}
          onToggle={onClose}
        />
      </div>
    </>
  );
}