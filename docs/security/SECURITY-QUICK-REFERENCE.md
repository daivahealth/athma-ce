# Security Quick Reference

A developer cheat sheet for implementing security in Zeal Healthcare Platform.

---

## Quick Setup

### 1. Import Dependencies

```typescript
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard, PermissionsGuard, Permissions, Public } from '@zeal/shared-utils';
import { PATIENT_READ, PATIENT_CREATE } from '@zeal/contracts';
```

### 2. Apply Guards to Controller

```typescript
@Controller('patients')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PatientController {}
```

### 3. Add Permissions to Methods

```typescript
@Get()
@Permissions(PATIENT_READ)
findAll() {}

@Post()
@Permissions(PATIENT_CREATE)
create() {}
```

---

## Common Patterns

### Authenticated Endpoint (with Permission)

```typescript
@Get()
@Permissions(PATIENT_READ)
async findAll(@TenantId() tenantId: string) {
  return this.service.findAll(tenantId);
}
```

### Public Endpoint (No Auth)

```typescript
@Public()
@Get('health')
healthCheck() {
  return { status: 'ok' };
}
```

### Role-Based Access

```typescript
@Get('admin')
@Roles('super_admin', 'tenant_admin')
adminOnly() {}
```

### Multiple Permissions (All Required)

```typescript
@Delete(':id')
@Permissions(PATIENT_READ, PATIENT_DELETE)
hardDelete() {}
```

### Access User Info

```typescript
@Get('me')
@Permissions(USER_READ)
getProfile(@Req() req: any) {
  const { sub, email, roles, permissions } = req.user;
  return this.service.getProfile(sub);
}
```

---

## Permission Constants

### Patient
| Constant | Value |
|----------|-------|
| `PATIENT_READ` | `patient.read` |
| `PATIENT_CREATE` | `patient.create` |
| `PATIENT_UPDATE` | `patient.update` |
| `PATIENT_DELETE` | `patient.delete` |

### Appointment
| Constant | Value |
|----------|-------|
| `APPOINTMENT_READ` | `appointment.read` |
| `APPOINTMENT_CREATE` | `appointment.create` |
| `APPOINTMENT_UPDATE` | `appointment.update` |
| `APPOINTMENT_CANCEL` | `appointment.cancel` |
| `APPOINTMENT_RESCHEDULE` | `appointment.reschedule` |

### Encounter
| Constant | Value |
|----------|-------|
| `ENCOUNTER_READ` | `encounter.read` |
| `ENCOUNTER_CREATE` | `encounter.create` |
| `ENCOUNTER_UPDATE` | `encounter.update` |
| `ENCOUNTER_CLOSE` | `encounter.close` |

### Clinical Notes
| Constant | Value |
|----------|-------|
| `CLINICAL_NOTE_READ` | `clinical_note.read` |
| `CLINICAL_NOTE_CREATE` | `clinical_note.create` |
| `CLINICAL_NOTE_UPDATE` | `clinical_note.update` |
| `CLINICAL_NOTE_SIGN` | `clinical_note.sign` |

### Prescriptions
| Constant | Value |
|----------|-------|
| `PRESCRIPTION_READ` | `prescription.read` |
| `PRESCRIPTION_CREATE` | `prescription.create` |
| `PRESCRIPTION_UPDATE` | `prescription.update` |
| `PRESCRIPTION_DISPENSE` | `prescription.dispense` |

### Schedule
| Constant | Value |
|----------|-------|
| `SCHEDULE_READ` | `schedule.read` |
| `SCHEDULE_CREATE` | `schedule.create` |
| `SCHEDULE_UPDATE` | `schedule.update` |
| `SCHEDULE_DELETE` | `schedule.delete` |
| `CALENDAR_READ` | `calendar.read` |

### Inpatient
| Constant | Value |
|----------|-------|
| `ADMISSION_READ` | `admission.read` |
| `ADMISSION_CREATE` | `admission.create` |
| `ADMISSION_UPDATE` | `admission.update` |
| `DISCHARGE_CREATE` | `discharge.create` |
| `DISCHARGE_UPDATE` | `discharge.update` |
| `WARD_READ` | `ward.read` |
| `BED_MANAGE` | `bed.manage` |

### Admin
| Constant | Value |
|----------|-------|
| `USER_READ` | `user.read` |
| `USER_CREATE` | `user.create` |
| `USER_UPDATE` | `user.update` |
| `ROLE_CREATE` | `role.create` |
| `ROLE_ASSIGN` | `role.assign` |

---

## HTTP Status Codes

| Status | Meaning | Common Cause |
|--------|---------|--------------|
| 401 | Unauthorized | Missing/invalid/expired token |
| 403 | Forbidden | Missing required permission |
| 400 | Bad Request | Missing tenant headers |

---

## Required Headers

```bash
Authorization: Bearer <jwt-token>
x-tenant-id: <tenant-uuid>
x-user-id: <user-uuid>
x-facility-id: <facility-uuid>
Content-Type: application/json
```

---

## Testing Endpoints

### Without Auth (Expect 401)
```bash
curl http://localhost:3011/api/v1/patients
```

### With Auth (Expect Data)
```bash
curl http://localhost:3011/api/v1/patients \
  -H "Authorization: Bearer $TOKEN" \
  -H "x-tenant-id: $TENANT_ID"
```

---

## Checklist

- [ ] Import guards from `@zeal/shared-utils`
- [ ] Import permissions from `@zeal/contracts`
- [ ] Add `@UseGuards(JwtAuthGuard, PermissionsGuard)` to controller
- [ ] Add `@Permissions(...)` to each route handler
- [ ] Use `@Public()` for unauthenticated endpoints
- [ ] Access user via `req.user` when needed
- [ ] Validate tenant context (`@TenantId()`)

---

## Full Example

```typescript
import {
  Controller, Get, Post, Put, Delete,
  Body, Param, UseGuards, HttpCode, HttpStatus
} from '@nestjs/common';
import { JwtAuthGuard, PermissionsGuard, Permissions, Public } from '@zeal/shared-utils';
import {
  PATIENT_READ, PATIENT_CREATE,
  PATIENT_UPDATE, PATIENT_DELETE
} from '@zeal/contracts';
import { TenantId, Context } from '../../common/decorators';

@Controller('patients')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PatientController {
  constructor(private readonly service: PatientService) {}

  @Get()
  @Permissions(PATIENT_READ)
  findAll(@TenantId() tenantId: string) {
    return this.service.findAll(tenantId);
  }

  @Get(':id')
  @Permissions(PATIENT_READ)
  findOne(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.service.findOne(id, tenantId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Permissions(PATIENT_CREATE)
  create(@Body() dto: CreateDto, @Context() ctx: any) {
    return this.service.create(dto, ctx);
  }

  @Put(':id')
  @Permissions(PATIENT_UPDATE)
  update(@Param('id') id: string, @Body() dto: UpdateDto, @Context() ctx: any) {
    return this.service.update(id, dto, ctx);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Permissions(PATIENT_DELETE)
  delete(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.service.delete(id, tenantId);
  }
}
```

---

See [SECURITY-IMPLEMENTATION.md](./SECURITY-IMPLEMENTATION.md) for detailed documentation.
