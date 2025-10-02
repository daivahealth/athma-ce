"use client";

import * as React from "react";
import { useIsMobile } from "@/hooks/use-mobile";

import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const isMobile = useIsMobile();

  const handleToggleSidebar = () => {
    if (isMobile) {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div
        className={`
          ${isMobile ? "fixed inset-y-0 left-0 z-50" : "relative"}
          ${isMobile && !isMobileMenuOpen ? "-translate-x-full" : ""}
          transition-transform duration-300 ease-in-out
        `}
      >
        <Sidebar
          isCollapsed={isCollapsed}
          onToggle={handleToggleSidebar}
        />
      </div>

      {/* Mobile overlay */}
      {isMobile && isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar
          onMenuClick={handleToggleSidebar}
          isMobile={isMobile}
        />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
