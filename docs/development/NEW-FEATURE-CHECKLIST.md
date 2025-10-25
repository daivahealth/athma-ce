# New Feature Development Checklist

**Feature Name**: _________________
**Developer**: _________________
**Start Date**: _________________
**Target Date**: _________________

## Pre-Development

- [ ] Feature requirements documented
- [ ] Domain identified (Foundation/Clinical/RCM/Analytics)
- [ ] Database schema designed on paper
- [ ] API endpoints planned
- [ ] Dependencies identified
- [ ] Development environment set up

## Database & Schema

- [ ] Prisma model created in correct database package
- [ ] All required fields included:
  - [ ] `id` (UUID primary key)
  - [ ] `tenantId` (UUID for multi-tenant)
  - [ ] `createdBy` (UUID)
  - [ ] `createdAtFacility` (UUID)
  - [ ] `createdAt` (DateTime)
  - [ ] `updatedBy` (UUID, nullable)
  - [ ] `updatedAtFacility` (UUID, nullable)
  - [ ] `updatedAt` (DateTime)
  - [ ] `status` (String, default 'active')
- [ ] Indexes added:
  - [ ] `tenantId` index
  - [ ] Composite indexes for common queries
  - [ ] Foreign key indexes
- [ ] Migration generated: `npx prisma migrate dev --name add_xxx`
- [ ] Prisma client regenerated: `npx prisma generate`
- [ ] Model added to `TENANT_ISOLATED_MODELS` in middleware
- [ ] Database package rebuilt

## DTOs (Data Transfer Objects)

- [ ] Folder created: `src/modules/{entity}/dto/`
- [ ] `create-{entity}.dto.ts` created with validation
- [ ] `update-{entity}.dto.ts` created
- [ ] `search-{entity}.dto.ts` created (if needed)
- [ ] All DTOs use class-validator decorators
- [ ] Optional fields properly marked

## Service Layer

- [ ] Service file created: `{entity}.service.ts`
- [ ] `RequestContext` interface imported
- [ ] PrismaService injected
- [ ] CRUD methods implemented:
  - [ ] `create(dto, context)` - with audit fields
  - [ ] `findAll(tenantId, options)` - with pagination
  - [ ] `findOne(id, tenantId)` - with not found handling
  - [ ] `update(id, dto, context)` - with audit fields
  - [ ] `remove(id, context)` - soft delete preferred
- [ ] Business logic implemented
- [ ] Error handling added
- [ ] Transactions used where needed

## Controller Layer

- [ ] Controller file created: `{entity}.controller.ts`
- [ ] Service injected
- [ ] Decorators imported (`@TenantId()`, `@Context()`)
- [ ] Endpoints implemented:
  - [ ] `POST /{entities}` - Create
  - [ ] `GET /{entities}` - List with pagination
  - [ ] `GET /{entities}/:id` - Get by ID
  - [ ] `PUT /{entities}/:id` - Update
  - [ ] `DELETE /{entities}/:id` - Delete
- [ ] Validation pipes applied
- [ ] Documentation comments added

## Module Configuration

- [ ] Module file created: `{entity}.module.ts`
- [ ] Controller registered
- [ ] Service registered as provider
- [ ] Service exported (if needed by other modules)
- [ ] Module imported in `app.module.ts`
- [ ] Service compiles without errors

## Testing

### Unit Tests
- [ ] Service test file created: `{entity}.service.spec.ts`
- [ ] PrismaService mocked
- [ ] Create method tested
- [ ] FindAll method tested
- [ ] FindOne method tested
- [ ] Update method tested
- [ ] Remove method tested
- [ ] Error scenarios tested
- [ ] All tests passing

### Integration Tests
- [ ] Postman collection created
- [ ] Environment variables set
- [ ] Create request added and tested
- [ ] List request added and tested
- [ ] Get by ID request added and tested
- [ ] Update request added and tested
- [ ] Delete request added and tested
- [ ] Error scenarios tested:
  - [ ] Missing tenant ID
  - [ ] Missing user ID
  - [ ] Missing facility ID
  - [ ] Invalid UUIDs
  - [ ] Invalid data
  - [ ] Not found scenarios
- [ ] Cross-tenant isolation verified

## Security & Validation

- [ ] Authentication required on all endpoints
- [ ] Tenant isolation working (verified via tests)
- [ ] User context required (userId, facilityId)
- [ ] Input validation working
- [ ] SQL injection protected (Prisma handles this)
- [ ] No sensitive data exposed in responses
- [ ] Audit fields populated correctly

## Documentation

- [ ] API documentation created in `docs/features/{domain}/`
- [ ] README updated with new endpoints
- [ ] Postman collection exported to `docs/api/postman/`
- [ ] Code comments added for complex logic
- [ ] Example requests documented

## Performance

- [ ] Database indexes verified
- [ ] Pagination implemented for list queries
- [ ] N+1 query issues avoided
- [ ] Response time acceptable (<200ms for simple queries)

## Code Quality

- [ ] TypeScript compiles without errors
- [ ] ESLint passes
- [ ] Code formatted with Prettier
- [ ] No console.log statements in production code
- [ ] Proper error handling
- [ ] No hardcoded values

## Pre-Commit

- [ ] All tests passing
- [ ] Build succeeds: `npm run build`
- [ ] Service starts: `npm run dev`
- [ ] Manual testing completed
- [ ] Postman tests passing
- [ ] Documentation complete

## Deployment Preparation

- [ ] Database migration tested on dev environment
- [ ] Environment variables documented
- [ ] Seed data created (if needed)
- [ ] Rollback plan documented
- [ ] Team notified of changes

---

## Common Issues Checklist

If you encounter errors, check:

### "Invalid UUID" Error
- [ ] All context fields (userId, facilityId) are valid UUIDs
- [ ] Headers `x-user-id` and `x-facility-id` provided
- [ ] No default string values like 'system' or 'default'

### "Tenant ID Required" Error
- [ ] `x-tenant-id` header included in request
- [ ] Tenant ID is a valid UUID format
- [ ] Middleware registered in app.module.ts

### "Not Found" Error
- [ ] Entity exists in database
- [ ] Querying with correct tenant ID
- [ ] Tenant isolation not blocking access

### Compilation Errors
- [ ] Prisma client regenerated after schema changes
- [ ] Database package rebuilt
- [ ] TypeScript types updated
- [ ] Imports correct

### Build Errors
- [ ] All dependencies installed
- [ ] Database connection configured
- [ ] Environment variables set
- [ ] No circular dependencies

---

## Sign-Off

- [ ] **Developer**: Code complete and tested
- [ ] **Code Review**: Approved by reviewer
- [ ] **QA**: Tests passed
- [ ] **Documentation**: Complete
- [ ] **Ready for Deployment**

**Reviewer**: _________________
**Date**: _________________
**Comments**:

_____________________________________________
_____________________________________________
_____________________________________________

---

**Template Version**: 1.0
**Last Updated**: 2025-10-24
