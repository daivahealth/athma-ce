import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  href?: string;
  label: string;
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-muted-foreground">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={item.href || item.label} className="flex items-center gap-2">
            {item.href ? (
              <Link
                href={item.href}
                className={cn('transition-colors hover:text-primary', isLast && 'text-foreground')}
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-foreground">{item.label}</span>
            )}
            {!isLast && <ChevronRight className="h-4 w-4" />}
          </span>
        );
      })}
    </nav>
  );
}
