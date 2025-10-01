# RBAC (Role-Based Access Control) - Zeal Platform

## Overview

The Zeal Platform implements a comprehensive **Role-Based Access Control (RBAC)** system to ensure secure, granular, and auditable access to sensitive healthcare data and operations. This document outlines the RBAC architecture, permission model, implementation guidelines, and best practices.

---

## Table of Contents

1. [Core Concepts](#core-concepts)
2. [Data Model](#data-model)
3. [Permission Hierarchy](#permission-hierarchy)
4. [System Roles](#system-roles)
5. [Permission Categories](#permission-categories)
6. [Multi-Tenancy & RBAC](#multi-tenancy--rbac)
7. [Implementation Guidelines](#implementation-guidelines)
8. [API Authorization](#api-authorization)
9. [Audit & Compliance](#audit--compliance)
10. [Best Practices](#best-practices)
11. [Examples](#examples)

---

## Core Concepts

### Roles
- **Definition**: A named collection of permissions that defines what actions a user can perform
- **Scope**: Tenant-specific (each tenant can define custom roles)
- **Types**:
  - **System Roles**: Pre-defined roles that cannot be deleted (e.g., `super_admin`, `physician`)
  - **Custom Roles**: Tenant-specific roles created by administrators

### Permissions
- **Definition**: Granular access rights to perform specific actions on resources
- **Format**: `resource.action` (e.g., `patients.read`, `claims.submit`)
- **Scope**: Global (same permissions across all tenants)

### User-Role Assignment
- **Many-to-Many**: Users can have multiple roles
- **Temporal**: Role assignments can expire
- **Auditable**: Track who assigned roles and when

### Least Privilege Principle
- Users are granted only the minimum permissions necessary to perform their job functions
- Permissions are explicitly granted, never assumed

---

## Data Model

### Tables

```sql
roles
├── id (UUID)
├── tenant_id (UUID) → tenants.id
├── code (VARCHAR) -- e.g., "physician", "nurse"
├── name (VARCHAR) -- readable name
├── description (TEXT)
├── is_system (BOOLEAN) -- system role cannot be deleted
├── created_at, updated_at

permissions
├── id (UUID)
├── code (VARCHAR) -- e.g., "patients.read"
├── name (VARCHAR)
├── description (TEXT)
├── resource (VARCHAR) -- e.g., "patients"
├── action (VARCHAR) -- e.g., "read", "write"
├── created_at, updated_at

role_permissions
├── id (UUID)
├── role_id (UUID) → roles.id
├── permission_id (UUID) → permissions.id
├── created_at

user_roles
├── id (UUID)
├── user_id (UUID) → users.id
├── role_id (UUID) → roles.id
├── assigned_by (UUID) → users.id
├── assigned_at (TIMESTAMPTZ)
├── expires_at (TIMESTAMPTZ) -- optional expiration
├── is_active (BOOLEAN)
├── created_at
```

### Relationships

```
users (1) ──< (M) user_roles (M) >── (1) roles
                                            │
                                            │
                                            V
                            role_permissions (M) >── (1) permissions
```

---

## Permission Hierarchy

### Naming Convention

**Format**: `<resource>.<action>[.<sub_resource>]`

**Examples**:
- `patients.read`
- `patients.write`
- `patients.delete`
- `patients.vitals.read`
- `claims.submit`
- `claims.approve`

### Resource Categories

| Resource | Description | Example Permissions |
|----------|-------------|---------------------|
| `patients` | Patient management | `patients.read`, `patients.write`, `patients.delete` |
| `appointments` | Scheduling | `appointments.read`, `appointments.create`, `appointments.cancel` |
| `encounters` | Clinical encounters | `encounters.read`, `encounters.create`, `encounters.sign` |
| `orders` | Medical orders | `orders.read`, `orders.create`, `orders.approve`, `orders.cancel` |
| `prescriptions` | ePrescribing | `prescriptions.read`, `prescriptions.create`, `prescriptions.sign` |
| `documents` | Medical documents | `documents.read`, `documents.upload`, `documents.delete` |
| `claims` | Billing claims | `claims.read`, `claims.submit`, `claims.approve`, `claims.void` |
| `payments` | Payment processing | `payments.read`, `payments.post`, `payments.refund` |
| `reports` | Analytics & reports | `reports.financial`, `reports.clinical`, `reports.operational` |
| `admin` | System administration | `admin.users`, `admin.roles`, `admin.settings` |

### Action Types

| Action | Description | Common Use |
|--------|-------------|------------|
| `read` | View/read data | All roles need this for their domain |
| `write` | Create/update data | Clinical staff, billing staff |
| `delete` | Delete/soft-delete data | Administrators, specific workflows |
| `approve` | Approve/sign/authorize | Physicians, billing managers |
| `submit` | Submit for processing | Billing staff, clinical staff |
| `cancel` | Cancel/void | Appointment desk, billing corrections |
| `export` | Export data | Compliance, reporting |
| `import` | Import data | Data migration, integrations |

---

## System Roles

### Clinical Roles

#### 1. **Physician** (`physician`)
**Permissions:**
- `patients.*` (full patient access)
- `appointments.read`, `appointments.create`
- `encounters.*` (full encounter management)
- `orders.*` (full order management)
- `prescriptions.*` (full prescribing rights)
- `lab_results.read`, `imaging_results.read`
- `documents.read`, `documents.upload`
- `reports.clinical`

**Use Case**: Licensed physicians who diagnose, prescribe, and manage patient care

#### 2. **Nurse** (`nurse`)
**Permissions:**
- `patients.read`, `patients.vitals.write`
- `appointments.read`
- `encounters.read`, `encounters.vitals.write`
- `orders.read`, `orders.execute`
- `prescriptions.read`
- `lab_results.read`, `imaging_results.read`
- `documents.read`, `documents.upload`

**Use Case**: Nurses who assist with patient care, administer treatments, record vitals

#### 3. **Medical Assistant** (`medical_assistant`)
**Permissions:**
- `patients.read`, `patients.vitals.write`
- `appointments.read`, `appointments.create`, `appointments.reschedule`
- `encounters.read`, `encounters.vitals.write`
- `orders.read`
- `documents.read`, `documents.upload`

**Use Case**: Medical assistants who handle patient intake, vitals, appointment scheduling

#### 4. **Lab Technician** (`lab_technician`)
**Permissions:**
- `patients.read`
- `orders.read` (lab orders only)
- `lab_results.read`, `lab_results.write`
- `documents.upload` (lab reports)

**Use Case**: Lab technicians who process lab orders and record results

#### 5. **Radiologist** (`radiologist`)
**Permissions:**
- `patients.read`
- `orders.read` (imaging orders only)
- `imaging_results.read`, `imaging_results.write`, `imaging_results.sign`
- `documents.upload` (imaging reports)

**Use Case**: Radiologists who read imaging studies and provide interpretations

---

### Administrative Roles

#### 6. **Front Desk** (`front_desk`)
**Permissions:**
- `patients.read`, `patients.create`, `patients.update` (demographics only)
- `appointments.*` (full scheduling access)
- `documents.read`, `documents.upload` (insurance cards, IDs)
- `eligibility.check`

**Use Case**: Front desk staff who handle scheduling, check-in, insurance verification

#### 7. **Billing Specialist** (`billing_specialist`)
**Permissions:**
- `patients.read`
- `encounters.read`
- `superbills.read`, `superbills.create`
- `claims.read`, `claims.create`, `claims.submit`
- `payments.read`, `payments.post`
- `reports.financial`

**Use Case**: Billing staff who code encounters, submit claims, post payments

#### 8. **Billing Manager** (`billing_manager`)
**Permissions:**
- All `billing_specialist` permissions
- `claims.approve`, `claims.void`
- `payments.refund`, `payments.write_off`
- `reports.financial.full`
- `denials.appeal`

**Use Case**: Billing managers who oversee revenue cycle, approve refunds, handle appeals

#### 9. **Compliance Officer** (`compliance_officer`)
**Permissions:**
- `patients.read` (audit trail only)
- `encounters.read`
- `claims.read`
- `audit_logs.read`
- `data_access_logs.read`
- `security_breaches.read`, `security_breaches.manage`
- `reports.*` (all reports)
- `export.*` (audit exports)

**Use Case**: Compliance officers who audit access, investigate breaches, ensure regulatory compliance

#### 10. **System Administrator** (`system_admin`)
**Permissions:**
- `admin.*` (full admin access)
- `users.read`, `users.create`, `users.update`, `users.deactivate`
- `roles.read`, `roles.create`, `roles.update`
- `settings.*`
- `integrations.*`
- `reports.*`

**Use Case**: System administrators who manage users, roles, system settings

#### 11. **Super Administrator** (`super_admin`)
**Permissions:**
- `*` (all permissions)

**Use Case**: Platform administrators with unrestricted access (use sparingly)

---

## Permission Categories

### Patient Management
```
patients.read
patients.create
patients.update
patients.delete
patients.merge
patients.demographics.read
patients.demographics.write
patients.clinical.read
patients.clinical.write
patients.vitals.read
patients.vitals.write
patients.allergies.read
patients.allergies.write
patients.problems.read
patients.problems.write
patients.family_history.read
patients.family_history.write
patients.immunizations.read
patients.immunizations.write
patients.export
```

### Appointment & Scheduling
```
appointments.read
appointments.create
appointments.update
appointments.cancel
appointments.reschedule
appointments.check_in
appointments.no_show
appointments.waitlist.manage
schedule_blocks.read
schedule_blocks.create
schedule_blocks.update
schedule_blocks.delete
```

### Clinical Encounters
```
encounters.read
encounters.create
encounters.update
encounters.sign
encounters.void
encounters.vitals.write
encounters.assessment.write
encounters.plan.write
encounters.export
```

### Orders & Results
```
orders.read
orders.create
orders.approve
orders.cancel
orders.execute
lab_results.read
lab_results.write
lab_results.verify
imaging_results.read
imaging_results.write
imaging_results.sign
procedure_results.read
procedure_results.write
```

### Prescriptions
```
prescriptions.read
prescriptions.create
prescriptions.sign
prescriptions.cancel
prescriptions.refill
prescriptions.send_to_pharmacy
```

### Billing & Claims
```
superbills.read
superbills.create
superbills.update
claims.read
claims.create
claims.submit
claims.approve
claims.void
claims.resubmit
denials.read
denials.review
denials.appeal
```

### Payments
```
payments.read
payments.post
payments.refund
payments.write_off
payments.adjust
patient_statements.read
patient_statements.create
patient_statements.send
```

### Documents
```
documents.read
documents.upload
documents.delete
documents.sign
documents.share
documents.export
```

### Reports & Analytics
```
reports.operational
reports.clinical
reports.financial
reports.compliance
reports.export
analytics.dashboard
```

### Administration
```
admin.users.read
admin.users.create
admin.users.update
admin.users.deactivate
admin.roles.read
admin.roles.create
admin.roles.update
admin.roles.delete
admin.settings.read
admin.settings.update
admin.integrations.manage
admin.audit_logs.read
```

---

## Multi-Tenancy & RBAC

### Tenant Isolation

1. **Roles are tenant-specific**
   - Each tenant defines its own roles
   - Role codes can be reused across tenants
   - System roles are pre-created for each tenant

2. **Permissions are global**
   - Same set of permissions across all tenants
   - Centralized permission management
   - Consistent authorization logic

3. **User roles respect tenant boundaries**
   - Users can have different roles in different tenants
   - Role assignment is scoped to a specific tenant
   - Cross-tenant access requires explicit role assignment

### Row-Level Security (RLS)

**Roles Table:**
```sql
CREATE POLICY tenant_isolation_roles ON roles
  FOR ALL TO application_role
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);
```

**User Roles Table:**
```sql
CREATE POLICY tenant_isolation_user_roles ON user_roles
  FOR ALL TO application_role
  USING (
    EXISTS (
      SELECT 1 FROM roles r
      WHERE r.id = user_roles.role_id
        AND r.tenant_id = current_setting('app.current_tenant_id')::uuid
    )
  );
```

---

## Implementation Guidelines

### 1. Authorization Middleware

**Node.js/TypeScript Example:**

```typescript
import { Request, Response, NextFunction } from 'express';

interface AuthRequest extends Request {
  user: {
    id: string;
    tenantId: string;
    permissions: string[];
  };
}

// Permission check middleware
export function requirePermission(permission: string) {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      // Get user permissions from cache or database
      const userPermissions = await getUserPermissions(req.user.id, req.user.tenantId);
      
      // Check if user has required permission
      if (userPermissions.includes(permission) || userPermissions.includes('*')) {
        return next();
      }
      
      // Log unauthorized access attempt
      await logUnauthorizedAccess(req.user.id, permission, req.path);
      
      return res.status(403).json({
        error: 'Forbidden',
        message: `Missing required permission: ${permission}`
      });
    } catch (error) {
      console.error('Authorization error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}

// Usage in routes
router.get('/patients', 
  requirePermission('patients.read'),
  async (req, res) => {
    // Handler code
  }
);

router.post('/claims/submit',
  requirePermission('claims.submit'),
  async (req, res) => {
    // Handler code
  }
);
```

### 2. Permission Checking Function

```typescript
async function getUserPermissions(userId: string, tenantId: string): Promise<string[]> {
  // Check cache first
  const cacheKey = `permissions:${tenantId}:${userId}`;
  const cached = await redis.get(cacheKey);
  
  if (cached) {
    return JSON.parse(cached);
  }
  
  // Query database
  const result = await db.query(`
    SELECT DISTINCT p.code
    FROM permissions p
    JOIN role_permissions rp ON rp.permission_id = p.id
    JOIN user_roles ur ON ur.role_id = rp.role_id
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = $1
      AND r.tenant_id = $2
      AND ur.is_active = true
      AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
  `, [userId, tenantId]);
  
  const permissions = result.rows.map(r => r.code);
  
  // Cache for 5 minutes
  await redis.setex(cacheKey, 300, JSON.stringify(permissions));
  
  return permissions;
}
```

### 3. Invalidating Permission Cache

```typescript
async function invalidateUserPermissions(userId: string, tenantId: string): Promise<void> {
  const cacheKey = `permissions:${tenantId}:${userId}`;
  await redis.del(cacheKey);
}

// Call this when:
// - User roles are assigned/revoked
// - Role permissions are modified
// - User is deactivated
```

---

## API Authorization

### RESTful API Endpoints

| Method | Endpoint | Required Permission | Description |
|--------|----------|---------------------|-------------|
| GET | `/api/v1/patients` | `patients.read` | List patients |
| POST | `/api/v1/patients` | `patients.create` | Create patient |
| GET | `/api/v1/patients/:id` | `patients.read` | Get patient details |
| PUT | `/api/v1/patients/:id` | `patients.update` | Update patient |
| DELETE | `/api/v1/patients/:id` | `patients.delete` | Delete patient |
| GET | `/api/v1/appointments` | `appointments.read` | List appointments |
| POST | `/api/v1/appointments` | `appointments.create` | Create appointment |
| PUT | `/api/v1/appointments/:id/cancel` | `appointments.cancel` | Cancel appointment |
| POST | `/api/v1/claims/submit` | `claims.submit` | Submit claim batch |
| PUT | `/api/v1/claims/:id/approve` | `claims.approve` | Approve claim |
| POST | `/api/v1/denials/:id/appeal` | `denials.appeal` | File claim appeal |
| POST | `/api/v1/payments/refund` | `payments.refund` | Process refund |

### Resource-Level Authorization

For resources that support fine-grained access control:

```typescript
async function canAccessPatient(userId: string, tenantId: string, patientId: string): Promise<boolean> {
  // Check if user has general patient read permission
  const hasPermission = await hasPermission(userId, tenantId, 'patients.read');
  if (!hasPermission) return false;
  
  // Additional checks (e.g., assigned provider, care team)
  const isAssignedProvider = await db.query(`
    SELECT 1 FROM encounters
    WHERE patient_id = $1
      AND primary_staff_id = $2
      AND tenant_id = $3
    LIMIT 1
  `, [patientId, userId, tenantId]);
  
  return isAssignedProvider.rows.length > 0;
}
```

---

## Audit & Compliance

### Access Logging

Every permission check should be logged for audit purposes:

```typescript
async function logUnauthorizedAccess(
  userId: string,
  permission: string,
  resourcePath: string
): Promise<void> {
  await db.query(`
    INSERT INTO data_access_logs (
      tenant_id,
      user_id,
      accessed_table,
      access_type,
      access_reason,
      accessed_at
    ) VALUES (
      current_setting('app.current_tenant_id')::uuid,
      $1,
      'unauthorized_access',
      'denied',
      $2,
      NOW()
    )
  `, [userId, `Attempted: ${permission} on ${resourcePath}`]);
}
```

### Permission Audit Reports

```sql
-- Users with specific permission
SELECT u.email, u.full_name, r.name AS role_name
FROM users u
JOIN user_roles ur ON ur.user_id = u.id
JOIN roles r ON r.id = ur.role_id
JOIN role_permissions rp ON rp.role_id = r.id
JOIN permissions p ON p.id = rp.permission_id
WHERE p.code = 'patients.delete'
  AND ur.is_active = true
  AND r.tenant_id = 'tenant-uuid';

-- Role permission matrix
SELECT r.name AS role_name, 
       array_agg(p.code ORDER BY p.code) AS permissions
FROM roles r
JOIN role_permissions rp ON rp.role_id = r.id
JOIN permissions p ON p.id = rp.permission_id
WHERE r.tenant_id = 'tenant-uuid'
GROUP BY r.id, r.name
ORDER BY r.name;

-- Users with expiring roles
SELECT u.email, r.name AS role_name, ur.expires_at
FROM users u
JOIN user_roles ur ON ur.user_id = u.id
JOIN roles r ON r.id = ur.role_id
WHERE ur.expires_at > NOW()
  AND ur.expires_at < NOW() + INTERVAL '30 days'
  AND r.tenant_id = 'tenant-uuid'
ORDER BY ur.expires_at;
```

---

## Best Practices

### 1. **Principle of Least Privilege**
- Grant only the minimum permissions required
- Review and revoke unnecessary permissions regularly
- Use temporary role assignments for elevated access

### 2. **Role Composition**
- Create granular roles for specific job functions
- Avoid creating "super roles" that grant too many permissions
- Use role inheritance patterns when appropriate

### 3. **Permission Naming**
- Follow consistent naming convention: `resource.action`
- Be descriptive: `claims.submit` not `claims.do`
- Group related permissions: `patients.*`, `appointments.*`

### 4. **Caching**
- Cache user permissions for performance
- Invalidate cache on role changes
- Set reasonable TTL (5-15 minutes)

### 5. **Audit Logging**
- Log all permission checks (authorized and denied)
- Include context (user, resource, timestamp)
- Retain logs per regulatory requirements

### 6. **Regular Reviews**
- Quarterly access reviews
- Remove inactive users
- Revoke expired role assignments
- Audit super admin access

### 7. **Temporal Access**
- Use `expires_at` for temporary elevated access
- Automatically revoke expired roles
- Alert users before role expiration

### 8. **System Roles Protection**
- Mark critical roles as `is_system = true`
- Prevent deletion of system roles
- Require additional approval for system role modifications

### 9. **Multi-Factor Authentication**
- Require MFA for sensitive permissions
- Enforce MFA for admin roles
- Log MFA failures

### 10. **Segregation of Duties**
- Separate clinical and financial access
- Prevent conflicts of interest
- Implement approval workflows

---

## Examples

### Example 1: Assigning a Role to a User

```sql
-- Assign physician role to a user
INSERT INTO user_roles (user_id, role_id, assigned_by, is_active)
SELECT 
  'user-uuid',
  r.id,
  'admin-user-uuid',
  true
FROM roles r
WHERE r.code = 'physician'
  AND r.tenant_id = 'tenant-uuid';
```

### Example 2: Creating a Custom Role

```sql
-- Create custom role
INSERT INTO roles (tenant_id, code, name, description, is_system)
VALUES (
  'tenant-uuid',
  'care_coordinator',
  'Care Coordinator',
  'Coordinates patient care across multiple providers',
  false
);

-- Assign permissions to role
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
  r.id,
  p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.code = 'care_coordinator'
  AND r.tenant_id = 'tenant-uuid'
  AND p.code IN (
    'patients.read',
    'appointments.read',
    'appointments.create',
    'encounters.read',
    'orders.read',
    'documents.read',
    'documents.upload'
  );
```

### Example 3: Checking Multiple Permissions

```typescript
async function canSubmitClaim(userId: string, tenantId: string): Promise<boolean> {
  const permissions = await getUserPermissions(userId, tenantId);
  
  return permissions.includes('claims.submit') || 
         permissions.includes('claims.*') ||
         permissions.includes('*');
}
```

### Example 4: Temporary Role Assignment

```sql
-- Assign billing manager role for 30 days
INSERT INTO user_roles (user_id, role_id, assigned_by, expires_at, is_active)
SELECT 
  'user-uuid',
  r.id,
  'admin-user-uuid',
  NOW() + INTERVAL '30 days',
  true
FROM roles r
WHERE r.code = 'billing_manager'
  AND r.tenant_id = 'tenant-uuid';
```

### Example 5: Permission Hierarchy Check

```typescript
function hasPermission(userPermissions: string[], required: string): boolean {
  // Wildcard check
  if (userPermissions.includes('*')) {
    return true;
  }
  
  // Exact match
  if (userPermissions.includes(required)) {
    return true;
  }
  
  // Resource wildcard (e.g., patients.* grants patients.read)
  const [resource, action] = required.split('.');
  if (userPermissions.includes(`${resource}.*`)) {
    return true;
  }
  
  return false;
}
```

---

## Regulatory Compliance

### UAE PDPL Compliance
- **Data Subject Rights**: RBAC ensures only authorized users access patient data
- **Purpose Limitation**: Permissions tied to job functions
- **Access Logging**: All access is logged in `data_access_logs`

### HIPAA Compliance (for international clinics)
- **Minimum Necessary Rule**: Least privilege enforcement
- **Audit Controls**: Comprehensive audit logging
- **Access Management**: Role-based access with regular reviews

### DHA/DOH/MOHAP Requirements
- **Licensed Provider Verification**: Only licensed physicians can prescribe
- **Billing Authorization**: Only authorized staff can submit claims
- **Data Export Controls**: Export permissions restricted to compliance officers

---

## Migration & Rollout

### Phase 1: System Roles Creation
1. Create standard roles in each tenant
2. Define default permission sets
3. Test with pilot users

### Phase 2: User Migration
1. Map existing users to roles
2. Assign roles based on current access patterns
3. Validate permission grants

### Phase 3: API Integration
1. Add permission checks to all endpoints
2. Update middleware and guards
3. Test authorization flows

### Phase 4: Monitoring & Tuning
1. Monitor denied access attempts
2. Adjust permissions based on feedback
3. Conduct access reviews

---

## Summary

The Zeal Platform RBAC system provides:

✅ **Granular Access Control** — Fine-grained permissions per resource and action  
✅ **Multi-Role Support** — Users can have multiple roles  
✅ **Temporal Access** — Time-limited role assignments  
✅ **Tenant Isolation** — Roles scoped to tenants  
✅ **Audit Trail** — Complete logging of access attempts  
✅ **Regulatory Compliance** — Meets UAE PDPL, HIPAA, DHA requirements  
✅ **Performance** — Permission caching for fast checks  
✅ **Flexibility** — Custom roles per tenant  
✅ **Security** — Least privilege by default  

**Key Benefit**: The RBAC system ensures that sensitive healthcare data is accessed only by authorized users, with complete audit trails for regulatory compliance and security investigations.

