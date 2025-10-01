# ADR-0005: Role-Based Access Control (RBAC) — Granular Permission System

- **Status**: Accepted
- **Date**: 2025-10-01
- **Owners**: Architecture Team, Security Team
- **Related**: ADR-0003 (Multi-Tenancy), ADR-0004 (Multi-Language Support)
- **Context**: Healthcare data requires granular access control with audit trails for compliance

## 1) Decision

Implement a comprehensive **Role-Based Access Control (RBAC)** system with:

- **Granular permissions** using `resource.action` format
- **Tenant-scoped roles** with global permission definitions
- **Multi-factor authentication (MFA)** for sensitive operations
- **Temporal role assignments** with expiration
- **Complete audit trail** for all access and permission changes
- **Least privilege principle** enforcement

## 2) Drivers

- **Healthcare Compliance**: HIPAA, UAE PDPL, GDPR require granular access control
- **Security Requirements**: Sensitive patient data needs role-based protection
- **Audit Requirements**: Complete audit trail for compliance and forensics
- **Operational Efficiency**: Centralized permission management across tenants
- **Scalability**: Support for 500+ clinics with different permission needs

## 3) Scope

Applies to all system access including:
- **Patient data access** (demographics, medical records, billing)
- **Clinical operations** (appointments, encounters, notes, orders)
- **Administrative functions** (user management, system configuration)
- **Financial operations** (billing, claims, payments, reports)
- **System administration** (tenant management, integrations)

## 4) Non-Goals

- Not implementing Attribute-Based Access Control (ABAC) initially
- Not supporting dynamic permissions based on context
- Not covering external identity provider integration (future ADR)

## 5) Data Model

### Core Tables
```sql
-- Roles (tenant-scoped)
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_system_role BOOLEAN DEFAULT FALSE,
    requires_mfa BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(tenant_id, name)
);

-- Permissions (global)
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resource VARCHAR(100) NOT NULL,        -- 'patients', 'claims', 'users'
    action VARCHAR(50) NOT NULL,           -- 'read', 'write', 'delete', 'submit'
    description TEXT,
    is_sensitive BOOLEAN DEFAULT FALSE,   -- requires MFA
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(resource, action)
);

-- Role-Permission mapping
CREATE TABLE role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    granted_at TIMESTAMPTZ DEFAULT NOW(),
    granted_by UUID REFERENCES users(id),
    UNIQUE(role_id, permission_id)
);

-- User-Role assignments
CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    assigned_by UUID REFERENCES users(id),
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE(user_id, role_id)
);
```

### MFA Tables
```sql
-- MFA settings
CREATE TABLE user_mfa_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    mfa_enabled BOOLEAN DEFAULT FALSE,
    mfa_method VARCHAR(20) NOT NULL,      -- 'totp', 'sms', 'email', 'backup_codes'
    mfa_secret VARCHAR(255),              -- encrypted TOTP secret
    phone_number VARCHAR(20),             -- for SMS
    email_address VARCHAR(255),           -- for email codes
    is_verified BOOLEAN DEFAULT FALSE,
    enrolled_at TIMESTAMPTZ,
    last_used_at TIMESTAMPTZ,
    backup_codes_generated_at TIMESTAMPTZ,
    require_mfa_for_sensitive_actions BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, mfa_method)
);

-- Backup codes
CREATE TABLE user_mfa_backup_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    code_hash VARCHAR(255) NOT NULL,      -- hashed backup code
    used_at TIMESTAMPTZ,
    is_used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- MFA attempts audit
CREATE TABLE user_mfa_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    mfa_method VARCHAR(20) NOT NULL,
    code_entered VARCHAR(10),             -- sanitized/masked
    success BOOLEAN NOT NULL,
    ip_address INET,
    user_agent TEXT,
    attempted_at TIMESTAMPTZ DEFAULT NOW(),
    failure_reason VARCHAR(100)
);

-- Trusted devices
CREATE TABLE user_trusted_devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    device_fingerprint VARCHAR(255) NOT NULL, -- hash of browser/device info
    device_name VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    trusted_at TIMESTAMPTZ DEFAULT NOW(),
    last_used_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 6) Permission Model

### Permission Format
- **Resource**: The entity being accessed (`patients`, `claims`, `users`, `appointments`)
- **Action**: The operation being performed (`read`, `write`, `delete`, `submit`, `approve`)
- **Examples**: `patients.read`, `claims.submit`, `users.write`, `appointments.delete`

### Permission Categories

| Category | Resources | Actions | Description |
|----------|-----------|---------|-------------|
| **Patient Data** | patients, encounters, clinical_notes | read, write, delete | Patient medical records |
| **Clinical Operations** | appointments, orders, prescriptions | read, write, delete, approve | Clinical workflows |
| **Billing & RCM** | claims, superbills, payments | read, write, submit, approve | Financial operations |
| **Administrative** | users, roles, tenants | read, write, delete, manage | System administration |
| **Reports** | reports, analytics | read, export | Data access and reporting |
| **Integrations** | connectors, webhooks | read, write, manage | External integrations |

### System Roles

| Role | Description | Key Permissions |
|------|-------------|-----------------|
| **super_admin** | System administrator | All permissions |
| **tenant_admin** | Tenant administrator | Tenant-scoped admin permissions |
| **physician** | Medical doctor | Patient data, clinical operations |
| **nurse** | Nursing staff | Patient data, clinical operations (limited) |
| **billing_staff** | Billing specialist | Claims, superbills, payments |
| **receptionist** | Front desk staff | Appointments, patient registration |
| **lab_technician** | Lab staff | Lab orders, results |
| **pharmacist** | Pharmacy staff | Prescriptions, medication orders |
| **auditor** | Compliance auditor | Read-only access to all data |
| **api_user** | System integration | API access permissions |

## 7) MFA Implementation

### Supported Methods
- **TOTP** (Time-based One-Time Password) - Google Authenticator, Authy
- **SMS** - Text message codes
- **Email** - Email verification codes
- **Backup Codes** - One-time recovery codes
- **Trusted Devices** - 30-day device trust

### MFA Enforcement
- **Sensitive Actions**: Require MFA for high-risk operations
- **Admin Roles**: All administrative roles require MFA
- **API Access**: MFA required for API authentication
- **New Device**: MFA required for new device login

### Brute Force Protection
- **Account Lockout**: After 5 failed MFA attempts
- **Rate Limiting**: 1 attempt per 30 seconds
- **IP Blocking**: Temporary IP blocks for repeated failures
- **Audit Logging**: All MFA attempts logged

## 8) Security Features

### Session Management
- **JWT Tokens**: 15-minute access tokens
- **Refresh Tokens**: 7-day refresh tokens
- **Session Invalidation**: On logout, password change, role change
- **Concurrent Sessions**: Limited per user

### Audit Trail
- **Access Logging**: Every data access logged
- **Permission Changes**: Role assignments tracked
- **MFA Events**: All authentication events logged
- **Data Modifications**: Before/after values for sensitive data

### Encryption
- **MFA Secrets**: Encrypted with tenant-specific keys
- **Backup Codes**: Hashed with bcrypt
- **Session Data**: Encrypted in Redis
- **Audit Logs**: Immutable, encrypted storage

## 9) API Authorization

### Authorization Flow
```typescript
// Permission check middleware
async function checkPermission(resource: string, action: string) {
  const user = await getCurrentUser();
  const permissions = await getUserPermissions(user.id);
  
  const requiredPermission = `${resource}.${action}`;
  if (!permissions.includes(requiredPermission)) {
    throw new ForbiddenError('Insufficient permissions');
  }
  
  // Check MFA for sensitive actions
  if (isSensitiveAction(requiredPermission)) {
    await requireMFA(user.id);
  }
}
```

### Permission Caching
- **Redis Cache**: User permissions cached for 5 minutes
- **Cache Invalidation**: On role changes, logout
- **Fallback**: Database lookup if cache miss

## 10) Alternatives Considered

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| **Simple User Roles** | Simple implementation | Not granular enough for healthcare | ❌ |
| **ACL (Access Control Lists)** | Fine-grained control | Complex management, performance issues | ❌ |
| **ABAC (Attribute-Based)** | Context-aware permissions | Complex implementation, hard to audit | ❌ |
| **RBAC with MFA** | Granular, auditable, secure | Moderate complexity, requires MFA setup | ✅ **Chosen** |

## 11) Implementation Phases

### Phase 1: Core RBAC (Week 1-2)
- [x] Create RBAC tables (roles, permissions, role_permissions, user_roles)
- [x] Implement permission checking middleware
- [x] Create system roles and permissions
- [x] Add RLS policies for RBAC tables

### Phase 2: MFA Integration (Week 3-4)
- [x] Create MFA tables (mfa_settings, backup_codes, attempts, trusted_devices)
- [x] Implement TOTP, SMS, Email MFA methods
- [x] Add MFA enforcement for sensitive actions
- [x] Implement brute force protection

### Phase 3: API Integration (Week 5-6)
- [ ] Add permission checks to all API endpoints
- [ ] Implement permission caching
- [ ] Add MFA requirements to sensitive endpoints
- [ ] Create permission management APIs

### Phase 4: Audit & Compliance (Week 7-8)
- [ ] Implement comprehensive audit logging
- [ ] Add data access logging
- [ ] Create audit reports and dashboards
- [ ] Implement audit log retention policies

### Phase 5: Testing & Validation (Week 9-10)
- [ ] Security testing (penetration testing)
- [ ] Performance testing with large permission sets
- [ ] Compliance validation (HIPAA, PDPL, GDPR)
- [ ] User acceptance testing

## 12) Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Permission Complexity** | High | Clear documentation, role templates, training |
| **MFA Adoption** | Medium | Gradual rollout, user training, backup methods |
| **Performance Impact** | Medium | Permission caching, optimized queries |
| **Audit Log Volume** | Low | Log rotation, archival, compression |

## 13) Monitoring & Observability

### Metrics
- **Permission Checks**: Success/failure rates by resource
- **MFA Adoption**: Percentage of users with MFA enabled
- **Failed Attempts**: MFA failure rates and patterns
- **Session Duration**: Average session length by role

### Alerts
- **Failed Permission Checks**: Unusual access patterns
- **MFA Failures**: Brute force attempts
- **Role Changes**: Administrative role modifications
- **Audit Log Issues**: Logging failures or gaps

## 14) Compliance Features

### HIPAA Compliance
- **Access Controls**: Role-based access to PHI
- **Audit Controls**: Complete audit trail
- **Person Authentication**: MFA for user authentication
- **Transmission Security**: Encrypted data transmission

### UAE PDPL Compliance
- **Data Subject Rights**: Access, rectification, deletion
- **Consent Management**: Granular consent tracking
- **Data Breach Notification**: Automated breach detection
- **Data Residency**: UAE region data storage

### GDPR Compliance
- **Data Minimization**: Least privilege access
- **Purpose Limitation**: Role-based data access
- **Storage Limitation**: Time-based access controls
- **Accountability**: Complete audit trail

## 15) Cost Considerations

- **Storage**: Minimal overhead (~5% increase for audit logs)
- **Performance**: Permission caching minimizes impact
- **MFA Costs**: SMS costs for MFA (optional)
- **Compliance**: Avoids regulatory penalties

## 16) Triggers to Revisit

- **New Compliance Requirements**: Additional regulations
- **Performance Issues**: Large-scale permission complexity
- **Security Incidents**: Breach or access violations
- **Team Changes**: Security team composition changes

## 17) Acceptance Criteria

- [x] RBAC tables created with proper RLS policies
- [x] MFA tables and functions implemented
- [x] System roles and permissions defined
- [x] Audit logging framework in place
- [ ] API endpoints protected with permission checks
- [ ] MFA enforcement working for sensitive actions
- [ ] Comprehensive audit trail implemented
- [ ] Security testing completed
- [ ] Compliance validation passed

## 18) Related Documentation

- [RBAC Access Control](../20-RBAC-Access-Control.md) - Detailed implementation guide
- [Security & Compliance](../08-Security-&-Compliance.md) - Security framework
- [Data Model](../05-Data-Model.md) - RBAC table schemas
- [Multi-Tenancy ADR](./ADR-0003-multitenancy.md) - Tenant isolation
