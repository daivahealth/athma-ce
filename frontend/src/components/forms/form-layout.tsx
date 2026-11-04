import type { ReactNode } from 'react';
import { Save, type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

/**
 * Building blocks for create/edit pages that follow the "Form pages"
 * convention in docs/frontend/COMPONENTS.md (reference: the patient
 * registration form).
 */

/**
 * `dark:[color-scheme:dark]` makes the browser draw the native date picker and
 * option list dark when the app (not the OS) is dark.
 */
export const FIELD_CONTROL = 'dark:[color-scheme:dark]';

/** Native <select> drawn like `SelectTrigger`/`Input` from `components/ui`. */
export const NATIVE_SELECT = cn(
  'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-all',
  'hover:border-ring/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  'disabled:cursor-not-allowed disabled:opacity-50',
  FIELD_CONTROL,
);

/** aria + destructive styling for a control whose field failed validation. */
export function invalidProps(id: string, error: string | undefined, className?: string) {
  return {
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? `${id}-error` : undefined,
    className: cn(className, error && 'border-destructive focus-visible:ring-destructive hover:border-destructive'),
  };
}

/** A titled group of fields: icon chip, title, one-line description. */
export function FormSection({
  icon: Icon,
  title,
  description,
  actions,
  contentClassName,
  children,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  /** Right-aligned header controls, e.g. an "Add line" button. */
  actions?: ReactNode;
  /** Replaces the default `space-y-4` body layout, e.g. with a grid. */
  contentClassName?: string;
  children: ReactNode;
}) {
  return (
    <Card className="hover:translate-y-0">
      <CardHeader className="flex-row flex-wrap items-start gap-3 space-y-0 pb-4">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-4 w-4" aria-hidden />
        </span>
        <div className="min-w-0 flex-1 space-y-1">
          <CardTitle className="text-base">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </CardHeader>
      <CardContent className={contentClassName ?? 'space-y-4'}>{children}</CardContent>
    </Card>
  );
}

/** Label + control + inline validation message. */
export function FormField({
  id,
  label,
  required,
  error,
  hint,
  className,
  children,
}: {
  id?: string;
  label: string;
  required?: boolean;
  error?: string;
  /** Muted helper text under the control. */
  hint?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={id} className={cn(error && 'text-destructive')}>
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </Label>
      {children}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && (
        <p id={id ? `${id}-error` : undefined} role="alert" className="text-sm font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * Footer action row: the required-fields hint on the left, Cancel (outline)
 * and the primary submit on the right.
 */
export function FormActions({
  submitLabel,
  isSubmitting,
  onCancel,
  showRequiredHint = true,
}: {
  submitLabel: string;
  isSubmitting?: boolean;
  onCancel?: () => void;
  showRequiredHint?: boolean;
}) {
  return (
    <div className="flex flex-col-reverse gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
      {showRequiredHint ? (
        <p className="text-xs text-muted-foreground">
          Fields marked <span className="text-destructive">*</span> are required.
        </p>
      ) : (
        <span />
      )}
      <div className="flex flex-col-reverse gap-2 sm:flex-row">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting} className="gap-2">
          <Save className="h-4 w-4" />
          {isSubmitting ? 'Saving...' : submitLabel}
        </Button>
      </div>
    </div>
  );
}
