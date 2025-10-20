# 🏗️ Foundational Tables & RBAC Strategy

## 📍 **Current Situation**

The Prisma schema was simplified to only include `Patient` and `Appointment` models, but we need the foundational infrastructure tables for a complete system.

## 🎯 **Where Foundational Tables Should Go**

### **1. Core Infrastructure Tables (Priority 1)**

These should be added to the **main Prisma schema** at `/Users/sajithchandran/aira/zeal/backend/shared/database/prisma/schema.prisma`:

#### **Multi-Tenancy Foundation**
```prisma
model Tenant {
  id        String   @id @default(uuid()) @map("id") @db.Uuid
  name      String   @unique
  domain    String   @unique
  status    String   @default("active")
  settings  Json     @default("{}")
  createdAt DateTime @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt DateTime @updatedAt @map("updated_at") @db.Timestamptz(6)

  // Relations
  users       User[]
  patients    Patient[]
  facilities  Facility[]
  staff       Staff[]
  appointments Appointment[]

  @@map("tenants")
}

model User {
  id          String   @id @default(uuid()) @map("id") @db.Uuid
  tenantId    String   @map("tenant_id") @db.Uuid
  email       String
  firstName   String   @map("first_name")
  lastName    String   @map("last_name")
  passwordHash String  @map("password_hash")
  role        String
  status      String   @default("active")
  permissions Json     @default("{}")
  lastLogin   DateTime? @map("last_login") @db.Timestamptz(6)
  createdAt   DateTime @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt   DateTime @updatedAt @map("updated_at") @db.Timestamptz(6)

  // Relations
  tenant Tenant @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  @@unique([tenantId, email])
  @@map("users")
}
```

#### **Healthcare Infrastructure**
```prisma
model Facility {
  id           String   @id @default(uuid()) @map("id") @db.Uuid
  tenantId     String   @map("tenant_id") @db.Uuid
  name         String
  facilityType String   @map("facility_type") @default("clinic")
  licenseNumber String? @map("license_number")
  addressLine1 String?  @map("address_line1")
  addressLine2 String?  @map("address_line2")
  city         String?
  emirate      String?
  postalCode   String?  @map("postal_code")
  phoneNumber  String?  @map("phone_number")
  email        String?
  website      String?
  operatingHours Json?  @map("operating_hours")
  status       String   @default("active")
  createdAt    DateTime @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt    DateTime @updatedAt @map("updated_at") @db.Timestamptz(6)

  // Relations
  tenant       Tenant         @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  spaces       Space[]
  appointments Appointment[]
  encounters   Encounter[]

  @@map("facilities")
}

model Staff {
  id           String   @id @default(uuid()) @map("id") @db.Uuid
  tenantId     String   @map("tenant_id") @db.Uuid
  firstName    String   @map("first_name")
  lastName     String   @map("last_name")
  middleName   String?  @map("middle_name")
  dateOfBirth  DateTime @map("date_of_birth") @db.Date
  gender       String
  nationality  String   @default("UAE")
  phoneNumber  String?  @map("phone_number")
  email        String?
  employeeId   String   @map("employee_id")
  staffType    String   @map("staff_type")
  specialties  Json     @default("[]")
  licenseNumber String? @map("license_number")
  licenseExpiry DateTime? @map("license_expiry") @db.Date
  status       String   @default("active")
  createdAt    DateTime @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt    DateTime @updatedAt @map("updated_at") @db.Timestamptz(6)

  // Relations
  tenant       Tenant         @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  appointments Appointment[]
  encounters   Encounter[]

  @@map("staff")
}
```

### **2. RBAC Tables (Priority 2)**

#### **Core RBAC Models**
```prisma
model Role {
  id          String   @id @default(uuid()) @map("id") @db.Uuid
  tenantId    String   @map("tenant_id") @db.Uuid
  code        String   // e.g., "physician", "nurse", "admin"
  name        String   // readable name
  description String?
  isSystem    Boolean  @map("is_system") @default(false)
  createdAt   DateTime @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt   DateTime @updatedAt @map("updated_at") @db.Timestamptz(6)

  // Relations
  tenant         Tenant           @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  rolePermissions RolePermission[]
  userRoles      UserRole[]

  @@unique([tenantId, code])
  @@map("roles")
}

model Permission {
  id          String   @id @default(uuid()) @map("id") @db.Uuid
  code        String   @unique // e.g., "patients.read", "claims.submit"
  name        String
  description String?
  resource    String?  // e.g., "patients", "claims", "appointments"
  action      String?  // e.g., "read", "write", "delete", "approve"
  createdAt   DateTime @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt   DateTime @updatedAt @map("updated_at") @db.Timestamptz(6)

  // Relations
  rolePermissions RolePermission[]

  @@map("permissions")
}

model RolePermission {
  id           String     @id @default(uuid()) @map("id") @db.Uuid
  roleId       String     @map("role_id") @db.Uuid
  permissionId String     @map("permission_id") @db.Uuid
  createdAt    DateTime   @default(now()) @map("created_at") @db.Timestamptz(6)

  // Relations
  role       Role       @relation(fields: [roleId], references: [id], onDelete: Cascade)
  permission Permission @relation(fields: [permissionId], references: [id], onDelete: Cascade)

  @@unique([roleId, permissionId])
  @@map("role_permissions")
}

model UserRole {
  id         String    @id @default(uuid()) @map("id") @db.Uuid
  userId     String    @map("user_id") @db.Uuid
  roleId     String    @map("role_id") @db.Uuid
  assignedBy String?   @map("assigned_by") @db.Uuid
  assignedAt DateTime  @default(now()) @map("assigned_at") @db.Timestamptz(6)
  expiresAt  DateTime? @map("expires_at") @db.Timestamptz(6)
  isActive   Boolean   @map("is_active") @default(true)
  createdAt  DateTime  @default(now()) @map("created_at") @db.Timestamptz(6)

  // Relations
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  role Role @relation(fields: [roleId], references: [id], onDelete: Cascade)

  @@unique([userId, roleId])
  @@map("user_roles")
}
```

### **3. MFA & Security Tables (Priority 3)**

```prisma
model UserMfaSettings {
  id                String   @id @default(uuid()) @map("id") @db.Uuid
  userId            String   @map("user_id") @db.Uuid
  totpEnabled       Boolean  @map("totp_enabled") @default(false)
  totpSecret        String?  @map("totp_secret")
  smsEnabled        Boolean  @map("sms_enabled") @default(false)
  smsPhoneNumber    String?  @map("sms_phone_number")
  emailEnabled      Boolean  @map("email_enabled") @default(false)
  backupCodesCount  Int      @map("backup_codes_count") @default(0)
  lastUsedAt        DateTime? @map("last_used_at") @db.Timestamptz(6)
  createdAt         DateTime @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt         DateTime @updatedAt @map("updated_at") @db.Timestamptz(6)

  // Relations
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId])
  @@map("user_mfa_settings")
}

model UserMfaBackupCode {
  id        String   @id @default(uuid()) @map("id") @db.Uuid
  userId    String   @map("user_id") @db.Uuid
  codeHash  String   @map("code_hash")
  usedAt    DateTime? @map("used_at") @db.Timestamptz(6)
  createdAt DateTime @default(now()) @map("created_at") @db.Timestamptz(6)

  // Relations
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("user_mfa_backup_codes")
}

model UserMfaAttempt {
  id        String   @id @default(uuid()) @map("id") @db.Uuid
  userId    String   @map("user_id") @db.Uuid
  method    String   // 'totp', 'sms', 'email', 'backup_code'
  success   Boolean
  ipAddress String?  @map("ip_address")
  userAgent String?  @map("user_agent")
  createdAt DateTime @default(now()) @map("created_at") @db.Timestamptz(6)

  // Relations
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("user_mfa_attempts")
}

model UserTrustedDevice {
  id               String    @id @default(uuid()) @map("id") @db.Uuid
  userId           String    @map("user_id") @db.Uuid
  deviceFingerprint String   @map("device_fingerprint")
  deviceName       String?   @map("device_name")
  ipAddress        String?   @map("ip_address")
  userAgent        String?   @map("user_agent")
  trustedAt        DateTime  @default(now()) @map("trusted_at") @db.Timestamptz(6)
  lastUsedAt       DateTime  @default(now()) @map("last_used_at") @db.Timestamptz(6)
  expiresAt        DateTime? @map("expires_at") @db.Timestamptz(6)
  isActive         Boolean   @map("is_active") @default(true)
  createdAt        DateTime  @default(now()) @map("created_at") @db.Timestamptz(6)

  // Relations
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("user_trusted_devices")
}
```

## 🔄 **Updated Relations**

### **Patient Model Updates**
```prisma
model Patient {
  // ... existing fields ...
  tenantId    String   @map("tenant_id") @db.Uuid
  // ... other fields ...

  // Relations
  tenant       Tenant         @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  appointments Appointment[]
  encounters   Encounter[]

  @@map("patients")
}
```

### **Appointment Model Updates**
```prisma
model Appointment {
  // ... existing fields ...
  tenantId    String   @map("tenant_id") @db.Uuid
  facilityId  String   @map("facility_id") @db.Uuid
  staffId     String?  @map("staff_id") @db.Uuid
  // ... other fields ...

  // Relations
  tenant    Tenant     @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  patient   Patient    @relation(fields: [patientId], references: [id], onDelete: Cascade)
  facility  Facility   @relation(fields: [facilityId], references: [id], onDelete: Cascade)
  staff     Staff?     @relation(fields: [staffId], references: [id], onDelete: SetNull)

  @@map("appointments")
}
```

## 📋 **Implementation Strategy**

### **Phase 1: Core Infrastructure (Week 1)**
1. Add `Tenant` and `User` models
2. Update `Patient` and `Appointment` with tenant relations
3. Generate Prisma client
4. Test basic multi-tenancy

### **Phase 2: Healthcare Infrastructure (Week 2)**
1. Add `Facility` and `Staff` models
2. Update `Appointment` with facility/staff relations
3. Add `Space` model for room management
4. Test healthcare workflows

### **Phase 3: RBAC System (Week 3)**
1. Add `Role`, `Permission`, `RolePermission`, `UserRole` models
2. Implement RBAC service layer
3. Add permission guards to controllers
4. Test access control

### **Phase 4: Security & MFA (Week 4)**
1. Add MFA models (`UserMfaSettings`, `UserMfaBackupCode`, etc.)
2. Implement MFA service
3. Add security middleware
4. Test authentication flows

## 🎯 **File Locations**

### **Main Schema**
- **File**: `/Users/sajithchandran/aira/zeal/backend/shared/database/prisma/schema.prisma`
- **Purpose**: Core Prisma schema with all models

### **Reference Documentation**
- **File**: `/Users/sajithchandran/aira/zeal/docs/05-Data-Model.md`
- **Purpose**: Complete SQL schema reference (100+ tables)

### **RBAC Documentation**
- **File**: `/Users/sajithchandran/aira/zeal/docs/20-RBAC-Access-Control.md`
- **Purpose**: RBAC implementation guide

### **ADR Documentation**
- **File**: `/Users/sajithchandran/aira/zeal/docs/ADR/ADR-0005-rbac-access-control.md`
- **Purpose**: RBAC architectural decision record

## 🚀 **Next Steps**

1. **Add foundational models** to Prisma schema
2. **Update existing models** with tenant relations
3. **Generate Prisma client** and test
4. **Implement service layers** for each domain
5. **Add RBAC guards** to controllers
6. **Test multi-tenant isolation**

## 📊 **Current vs Target State**

| Component | Current | Target | Status |
|-----------|---------|--------|--------|
| **Core Models** | 2 (Patient, Appointment) | 10+ (Tenant, User, Facility, Staff, etc.) | ⚠️ Needs Implementation |
| **RBAC Models** | 0 | 4 (Role, Permission, RolePermission, UserRole) | ⚠️ Needs Implementation |
| **MFA Models** | 0 | 4 (UserMfaSettings, UserMfaBackupCode, etc.) | ⚠️ Needs Implementation |
| **Multi-tenancy** | ❌ No | ✅ Yes | ⚠️ Needs Implementation |
| **Access Control** | ❌ No | ✅ Yes | ⚠️ Needs Implementation |

---

**TL;DR**: Add foundational tables (Tenant, User, Facility, Staff) and RBAC tables (Role, Permission, etc.) to the main Prisma schema at `backend/shared/database/prisma/schema.prisma`, then implement the service layers and guards.









