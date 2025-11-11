
'use client';

import * as React from 'react';
import { Check } from 'lucide-react';

import { cn } from '@/lib/utils';

type NativeCheckboxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>;

const Checkbox = React.forwardRef<HTMLInputElement, NativeCheckboxProps>(({ className, ...props }, ref) => (
  <label className="relative inline-flex items-center">
    <input
      ref={ref}
      type="checkbox"
      className={cn(
        'relative peer h-4 w-4 cursor-pointer appearance-none rounded border border-input bg-background ring-offset-background',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'checked:bg-primary checked:text-primary-foreground',
        className
      )}
      {...props}
    />
    <span className="pointer-events-none absolute left-0 inline-flex h-4 w-4 items-center justify-center text-primary-foreground opacity-0 transition-opacity peer-checked:opacity-100">
      <Check className="h-3 w-3" />
    </span>
  </label>
));
Checkbox.displayName = 'Checkbox';

export { Checkbox };
