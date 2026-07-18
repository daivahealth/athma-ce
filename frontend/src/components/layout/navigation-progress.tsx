'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [width, setWidth] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const hideTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!pathname) return;

    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
      hideTimeout.current = null;
    }

    setIsVisible(true);
    setWidth(20);

    const advanceTimeout = setTimeout(() => setWidth(70), 150);

    hideTimeout.current = setTimeout(() => {
      setWidth(100);
      hideTimeout.current = setTimeout(() => {
        setIsVisible(false);
        setWidth(0);
      }, 200);
    }, 400);

    return () => {
      clearTimeout(advanceTimeout);
      if (hideTimeout.current) {
        clearTimeout(hideTimeout.current);
        hideTimeout.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams?.toString()]);

  return (
    <div className="fixed inset-x-0 top-0 z-50 h-0.5">
      <div
        className="h-full bg-gradient-to-r from-primary to-warning shadow-[0_0_8px_hsl(var(--primary)/0.6)] transition-all duration-200"
        style={{ width: `${width}%`, opacity: isVisible ? 1 : 0 }}
      />
    </div>
  );
}
