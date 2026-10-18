'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';

/** The drawer, and with it the whole manual, loads only once help is first opened. */
const HelpDrawer = dynamic(() => import('@/components/help/help-drawer'), { ssr: false });

interface HelpContextValue {
  openHelp: () => void;
}

const HelpContext = React.createContext<HelpContextValue | null>(null);

function isTypingTarget(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement ||
    (target instanceof HTMLElement && target.isContentEditable)
  );
}

/**
 * Contextual help for the app shell: `?` from anywhere that is not a text
 * field, or the sidebar's Help item, opens the manual page for the screen the
 * user is on. Capture phase so a focused menu item cannot swallow the key.
 */
export function HelpProvider({ locale, children }: { locale: string; children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);

  const openHelp = React.useCallback(() => {
    setLoaded(true);
    setOpen(true);
  }, []);

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== '?' || event.ctrlKey || event.metaKey || event.altKey) return;
      if (isTypingTarget(event.target)) return;
      event.preventDefault();
      openHelp();
    }
    document.addEventListener('keydown', onKeyDown, true);
    return () => document.removeEventListener('keydown', onKeyDown, true);
  }, [openHelp]);

  const value = React.useMemo(() => ({ openHelp }), [openHelp]);

  return (
    <HelpContext.Provider value={value}>
      {children}
      {loaded ? <HelpDrawer locale={locale} open={open} onOpenChange={setOpen} /> : null}
    </HelpContext.Provider>
  );
}

/** Opens the help drawer; a no-op outside a {@link HelpProvider}. */
export function useHelp(): HelpContextValue {
  return React.useContext(HelpContext) ?? { openHelp: () => undefined };
}
