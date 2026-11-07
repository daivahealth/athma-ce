import type { ReactNode } from 'react';
import { Save, type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

/**
 * Building blocks of a create/edit page, as described under "Form pages" in
 * `docs/frontend/COMPONENTS.md`: section cards, labelled fields with a
 * required marker and an inline error, and the footer action row.
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

/** A group of fields: a card with an icon chip, a title and a one-line description. */
export function FormSection({
  icon: Icon,
  title,
  description,
  actions,
  children,
  contentClassName,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  /** Right-aligned header controls, e.g. an "Add" button for a repeating list. */
  actions?: ReactNode;
  children: ReactNode;
  /** Replaces the default `space-y-4` body layout, e.g. with a grid. */
  contentClassName?: string;
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

/** A label, its control, and the validation message under it. */
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
  label: ReactNode;
  required?: boolean;
  error?: string;
  /** Muted helper text under the control (hidden while an error shows). */
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
      {error ? (
        <p id={id ? `${id}-error` : undefined} role="alert" className="text-sm font-medium text-destructive">
          {error}
        </p>
      ) : (
        hint && <p className="text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}

/**
 * Footer row under a `border-t`: the required-fields hint on the left,
 * Cancel (outline, when `onCancel` is given) then the submit on the right.
 * Pass the submit control(s) as children, or just a `submitLabel` for the
 * default primary button with a save icon.
 */
export function FormActions({
  onCancel,
  busy,
  submitLabel,
  showRequiredHint = true,
  children,
}: {
  onCancel?: () => void;
  busy?: boolean;
  /** Label of the default submit button; ignored when children are given. */
  submitLabel?: string;
  showRequiredHint?: boolean;
  children?: ReactNode;
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
          <Button type="button" variant="outline" onClick={onCancel} disabled={busy}>
            Cancel
          </Button>
        )}
        {children ??
          (submitLabel && (
            <Button type="submit" disabled={busy} className="gap-2">
              <Save className="h-4 w-4" />
              {busy ? 'Saving...' : submitLabel}
            </Button>
          ))}
      </div>
    </div>
  );
}
