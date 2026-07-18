# Shared Component Library

Conventions for the shared UI primitives in `frontend/src/components/ui/`. These
were introduced to replace ad-hoc, per-page markup for page titles, stat tiles,
empty states, and loading placeholders with one consistent visual language
across the app (light + dark).

## Page structure

### `PageHeader`

`frontend/src/components/ui/page-header.tsx`

The canonical page-title block. Use it at the top of every page instead of a
hand-rolled `<h1>` + `<p>` pair.

```tsx
<PageHeader
  title="Patients"
  subtitle="Manage patient records and information"
  icon={Users}
  actions={<Button>New Patient</Button>}
/>
```

- `gradient` applies the brand `.text-gradient` treatment to the title — reserve
  this for a page's single most prominent header (e.g. the dashboard home),
  not every page, or it loses its impact.
- `actions` is right-aligned and can hold arbitrarily complex content (dialogs,
  button groups), not just a single CTA.

### `StatCard`

`frontend/src/components/ui/stat-card.tsx`

KPI/metric tiles with count-up animation and an optional sparkline. Only pass
`delta`/`trend` when the underlying data genuinely supports it — do not
fabricate a trend series to make a tile look richer.

```tsx
<StatCard label="Total Patients" value={metrics.totalPatients} icon={Users} accent="info" delta={metrics.patientGrowth} deltaLabel="vs last month" />
```

`accent` maps to the semantic tokens below (`primary | success | warning | info | destructive`) — pick the one that matches the metric's meaning, not an arbitrary color.

### `EmptyState`

`frontend/src/components/ui/empty-state.tsx`

The canonical "no data" panel — icon in a soft primary-tinted circle, heading,
optional description, optional CTA. Use this instead of a single line of
muted text or a one-off hand-built empty block.

```tsx
<EmptyState icon={FileText} title="No encounters found" description="Try adjusting your search criteria" action={<Button>Create New Encounter</Button>} />
```

`ResourceTable` (`frontend/src/components/tables/resource-table.tsx`) renders
this automatically for its empty state — pass `emptyIcon`/`emptyDescription`
to customize it, don't reimplement the empty row yourself.

### Loading

`frontend/src/components/ui/skeleton.tsx` is the single sanctioned loading
idiom for new/touched code — it exports `Skeleton`, `TableSkeleton`,
`StatRowSkeleton`, and `PageSkeleton` (used by the route-level `loading.tsx`
files). Prefer these over ad-hoc `animate-pulse` divs or the older
`LoadingSpinner`/`PageLoading` components in `components/ui/loading.tsx`.

## Semantic color tokens

The theme defines `success`, `warning`, `info`, and `destructive` tokens
(`tailwind.config.ts`, alongside `primary`/`secondary`/`muted`) precisely so
status colors stay theme- and dark-mode-aware. **Do not use raw Tailwind
palette colors** (`bg-green-500`, `text-amber-600`, `bg-red-100`, etc.) for
status/severity styling in new or touched code — map them instead:

| Raw color (avoid) | Semantic token (use) | Typical meaning |
|---|---|---|
| green / emerald | `success` | active, completed, healthy |
| amber / yellow | `warning` | pending, moderate risk, inactive |
| blue / sky | `info` | informational, neutral-positive |
| red | `destructive` | error, cancelled, high risk |
| gray / slate | `muted` | disabled, superseded, neutral |

Typical usage is a soft tint, not a solid fill: `bg-success/10 text-success`
rather than `bg-green-500 text-white`.

This rule applies to new code and to any page you're already touching for
another reason — it does not require a standalone repo-wide sweep of
untouched files.

## Motion

- `.stagger` (in `frontend/src/styles/globals.css`) — apply to a grid/list
  container to fade its direct children in with an incrementing delay (capped
  at 10 items). Used for stat rows, card grids, and list entries.
- `.page-transition` — apply to a page's root `<div>` for a fade/slide-up on
  mount.
- `useCountUp` (`frontend/src/hooks/use-count-up.ts`) — animates a numeric
  value; used internally by `StatCard`.

All of the above respect `prefers-reduced-motion` automatically. The project
deliberately has no `framer-motion` dependency — these effects are CSS/
`tailwindcss-animate` based; keep it that way unless a future requirement
genuinely needs shared-layout or drag animations.

## Route-level states

Each route group (`(dashboard)`, `(clinical)`) has its own `loading.tsx` and
`error.tsx` at the group root, following the Next.js App Router convention —
`loading.tsx` renders `PageSkeleton`, `error.tsx` renders a branded retry
panel. A route group's own `page.tsx` files do not need to handle these
top-level loading/error states themselves; only page-specific empty states
(no rows returned) still belong in the page.

`404`s for genuinely unmatched URLs are handled by the root
`frontend/src/app/not-found.tsx` (Next.js only invokes the nested
`[locale]/not-found.tsx` for explicit `notFound()` calls within a matched
route, not for unmatched paths — keep both in sync if the design changes).
