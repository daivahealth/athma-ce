# Checklist Template List Pagination Update

## Summary

Added pagination support to the checklist template list endpoint to prevent performance issues with large datasets.

---

## Changes Made

### 1. Service Layer (`checklist-template.service.ts`)

**Before**:
```typescript
async listTemplates(filters: any, tenantId: string) {
  // ... build where clause

  const templates = await this.prisma.checklistTemplate.findMany({
    where,
    include: { _count: { select: { items: true, instances: true } } },
    orderBy: [{ category: 'asc' }, { name: 'asc' }],
    // ❌ No pagination - returns ALL templates
  });

  return templates;
}
```

**After**:
```typescript
async listTemplates(
  filters: any,
  tenantId: string,
  pagination?: { skip?: number; take?: number }
) {
  // ... build where clause

  const skip = pagination?.skip || 0;
  const take = pagination?.take || 50; // ✅ Default limit of 50

  // Get total count for pagination metadata
  const total = await this.prisma.checklistTemplate.count({ where });

  // Get templates with pagination
  const templates = await this.prisma.checklistTemplate.findMany({
    where,
    include: { _count: { select: { items: true, instances: true } } },
    orderBy: [{ category: 'asc' }, { name: 'asc' }],
    skip,  // ✅ Offset
    take,  // ✅ Limit
  });

  return {
    data: templates,
    meta: {
      total,
      skip,
      take,
      hasMore: skip + templates.length < total,
    },
  };
}
```

---

### 2. Controller Layer (`checklist-template.controller.ts`)

**Before**:
```typescript
@Get()
async listTemplates(
  @Query('category') category?: string,
  @Query('status') status?: ChecklistTemplateStatus,
  @Query('applicableToInpatient') applicableToInpatient?: string,
  @Query('applicableToOutpatient') applicableToOutpatient?: string,
  @TenantId() tenantId?: string,
) {
  // ... build filters

  return this.checklistTemplateService.listTemplates(filters, tenantId);
  // ❌ No pagination parameters
}
```

**After**:
```typescript
@Get()
async listTemplates(
  @Query('category') category?: string,
  @Query('status') status?: ChecklistTemplateStatus,
  @Query('applicableToInpatient') applicableToInpatient?: string,
  @Query('applicableToOutpatient') applicableToOutpatient?: string,
  @Query('skip') skip?: string,     // ✅ New parameter
  @Query('take') take?: string,     // ✅ New parameter
  @TenantId() tenantId?: string,
) {
  // ... build filters

  const pagination = {
    skip: skip ? parseInt(skip, 10) : 0,
    take: take ? parseInt(take, 10) : 50,
  };

  return this.checklistTemplateService.listTemplates(filters, tenantId, pagination);
}
```

---

## Database Query Comparison

### Before (Missing LIMIT)

```sql
SELECT ...
FROM "public"."checklist_template"
LEFT JOIN (SELECT ... COUNT(*) ...) AS "aggr_selection_0_ChecklistTemplateItem" ...
LEFT JOIN (SELECT ... COUNT(*) ...) AS "aggr_selection_1_ChecklistInstance" ...
WHERE ("public"."checklist_template"."tenant_id" = $1
  AND "public"."checklist_template"."applicable_to_inpatient" = $2)
ORDER BY "public"."checklist_template"."category" ASC,
         "public"."checklist_template"."name" ASC
OFFSET $3
-- ❌ No LIMIT - returns ALL templates from offset onwards
```

**Issue**: Without LIMIT, if there are 1000 templates and offset is 0, all 1000 templates are returned.

---

### After (With LIMIT)

```sql
-- Query 1: Count total templates
SELECT COUNT(*)
FROM "public"."checklist_template"
WHERE ("public"."checklist_template"."tenant_id" = $1
  AND "public"."checklist_template"."applicable_to_inpatient" = $2)

-- Query 2: Get paginated templates
SELECT ...
FROM "public"."checklist_template"
LEFT JOIN (SELECT ... COUNT(*) ...) AS "aggr_selection_0_ChecklistTemplateItem" ...
LEFT JOIN (SELECT ... COUNT(*) ...) AS "aggr_selection_1_ChecklistInstance" ...
WHERE ("public"."checklist_template"."tenant_id" = $1
  AND "public"."checklist_template"."applicable_to_inpatient" = $2)
ORDER BY "public"."checklist_template"."category" ASC,
         "public"."checklist_template"."name" ASC
LIMIT 50    -- ✅ Default limit of 50
OFFSET 0    -- ✅ Offset for pagination
```

**Benefit**: Only returns 50 templates at a time, regardless of total count.

---

## API Response Format

### Before

```json
[
  { "id": "...", "name": "Template 1", ... },
  { "id": "...", "name": "Template 2", ... },
  ...
]
```

### After

```json
{
  "data": [
    { "id": "...", "name": "Template 1", ... },
    { "id": "...", "name": "Template 2", ... },
    ...
  ],
  "meta": {
    "total": 125,      // Total templates matching filters
    "skip": 0,         // Current offset
    "take": 50,        // Items per page
    "hasMore": true    // More pages available
  }
}
```

---

## Frontend Usage

### Basic Usage (First Page)

```typescript
GET /api/v1/inpatient/checklists/templates?applicableToInpatient=true&skip=0&take=20

Response:
{
  "data": [ /* 20 templates */ ],
  "meta": { "total": 125, "skip": 0, "take": 20, "hasMore": true }
}
```

### Load Next Page

```typescript
GET /api/v1/inpatient/checklists/templates?applicableToInpatient=true&skip=20&take=20

Response:
{
  "data": [ /* 20 templates */ ],
  "meta": { "total": 125, "skip": 20, "take": 20, "hasMore": true }
}
```

### React Query Example

```tsx
import { useInfiniteQuery } from '@tanstack/react-query';

function ChecklistTemplateList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['checklist-templates', { applicableToInpatient: true }],
    queryFn: ({ pageParam = 0 }) =>
      checklistTemplateService.list({
        applicableToInpatient: true,
        skip: pageParam,
        take: 20,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasMore ? lastPage.meta.skip + lastPage.meta.take : undefined,
  });

  return (
    <div>
      {data?.pages.map((page) =>
        page.data.map((template) => (
          <TemplateCard key={template.id} template={template} />
        ))
      )}

      {hasNextPage && (
        <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          {isFetchingNextPage ? 'Loading...' : 'Load More'}
        </Button>
      )}
    </div>
  );
}
```

---

## Benefits

1. **Performance**: Only loads 50 templates at a time (default)
2. **Scalability**: Works efficiently even with 1000+ templates
3. **User Experience**: Faster initial page load
4. **Bandwidth**: Reduces data transfer for mobile users
5. **Server Load**: Reduces memory usage and query time
6. **Flexibility**: Frontend can choose page size (10, 20, 50, etc.)

---

## Default Values

| Parameter | Default | Max | Description |
|-----------|---------|-----|-------------|
| `skip` | `0` | - | Offset for pagination |
| `take` | `50` | `100` | Number of items per page |

**Note**: Max limit of 100 can be enforced in controller if needed.

---

## Migration Guide for Frontend

### Breaking Change

The API response structure has changed from an array to an object with `data` and `meta` properties.

**Before**:
```typescript
const templates = await api.get('/inpatient/checklists/templates');
// templates is an array
templates.forEach(template => { ... });
```

**After**:
```typescript
const response = await api.get('/inpatient/checklists/templates');
// response is an object with data and meta
const { data, meta } = response;
data.forEach(template => { ... });

console.log(`Showing ${data.length} of ${meta.total} templates`);
```

### Update Service Methods

```typescript
// Before
async listTemplates(filters: TemplateFilters): Promise<Template[]> {
  const response = await api.get('/inpatient/checklists/templates', { params: filters });
  return response.data;
}

// After
async listTemplates(
  filters: TemplateFilters & { skip?: number; take?: number }
): Promise<{ data: Template[]; meta: PaginationMeta }> {
  const response = await api.get('/inpatient/checklists/templates', { params: filters });
  return response.data; // Already in { data, meta } format
}
```

---

## Testing Checklist

- [ ] Verify query includes `LIMIT` clause
- [ ] Verify default pagination (skip=0, take=50)
- [ ] Verify custom pagination (skip=20, take=10)
- [ ] Verify `hasMore` is true when more pages exist
- [ ] Verify `hasMore` is false on last page
- [ ] Verify `total` count is accurate
- [ ] Verify response structure matches documentation
- [ ] Test with 0 templates (empty result)
- [ ] Test with exactly 50 templates (edge case)
- [ ] Test with 100+ templates (multiple pages)

---

## Performance Metrics

### Expected Improvements

| Scenario | Before | After | Improvement |
|----------|--------|-------|-------------|
| 100 templates | 100 rows | 50 rows | 50% reduction |
| 500 templates | 500 rows | 50 rows | 90% reduction |
| 1000 templates | 1000 rows | 50 rows | 95% reduction |

### Query Time Estimates

- **Before**: 13ms (current, with small dataset)
- **After (with COUNT)**: ~15-20ms (slight overhead for COUNT query)
- **After (large dataset)**: ~10-15ms (faster due to LIMIT)

**Note**: COUNT query adds minimal overhead but is cached by PostgreSQL for repeated queries.
