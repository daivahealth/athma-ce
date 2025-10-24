# User-Staff Relationship Design

**Version**: 1.0  
**Date**: October 8, 2025  
**Status**: ✅ Implemented  

---

## 🎯 **Executive Summary**

The Zeal PMS uses a **dual-identity model** to separate system access from clinical identity:

- **Users** = System accounts (authentication, authorization, RBAC)
- **Staff** = Healthcare personnel (clinical/operational identity)
- **Relationship** = Optional, one-to-one (when linked)

This design follows **healthcare IT best practices** and supports real-world scenarios where not all staff need system access, and not all users are healthcare providers.

---

## 🏗️ **Architecture**

### **Conceptual Model**

```
┌─────────────────────────────────────────────────────────┐
│                        Tenant                            │
└──────────┬────────────────────────┬─────────────────────┘
           │                        │
    ┌──────▼──────┐        ┌───────▼────────┐
    │    Users    │        │     Staff      │
    │  (System)   │◄──────►│  (Healthcare)  │
    └─────────────┘        └────────────────┘
     │          │                │        │
     │          │                │        │
     ▼          ▼                ▼        ▼
  Login      RBAC         Encounters  Schedules
  Audit      Permissions  Orders      Licenses
```

### **Database Schema**

```sql
-- Users Table (System Identity)
CREATE TABLE users (
  id                UUID PRIMARY KEY,
  tenant_id         UUID NOT NULL REFERENCES tenants(id),
  email             TEXT NOT NULL,
  first_name        TEXT NOT NULL,
  last_name         TEXT NOT NULL,
  password_hash     TEXT NOT NULL,
  role              TEXT NOT NULL,
  staff_id          UUID REFERENCES staff(id) ON DELETE SET NULL,  -- 👈 Optional link
  default_facility_id UUID REFERENCES facilities(id),
  ...
  UNIQUE (tenant_id, email),
  UNIQUE (staff_id)  -- One staff = one user max
);

-- Staff Table (Clinical Identity)
CREATE TABLE staff (
  id             UUID PRIMARY KEY,
  tenant_id      UUID NOT NULL REFERENCES tenants(id),
  first_name     TEXT NOT NULL,
  last_name      TEXT NOT NULL,
  employee_id    TEXT NOT NULL,
  staff_type     TEXT NOT NULL,  -- doctor, nurse, technician, etc.
  specialties    JSONB DEFAULT '[]',
  license_number TEXT,
  license_expiry DATE,
  ...
  UNIQUE (tenant_id, employee_id)
);
```

### **Prisma Schema**

```prisma
model User {
  id                String    @id @default(uuid())
  tenantId          String    @map("tenant_id") @db.Uuid
  email             String
  firstName         String    @map("first_name")
  lastName          String    @map("last_name")
  passwordHash      String    @map("password_hash")
  role              String
  staffId           String?   @map("staff_id") @db.Uuid  // 👈 Optional
  ...
  
  tenant            Tenant    @relation(fields: [tenantId], references: [id])
  staff             Staff?    @relation(fields: [staffId], references: [id], onDelete: SetNull)
  
  @@unique([tenantId, email])
  @@unique([staffId])
  @@index([tenantId, staffId])
  @@map("users")
}

model Staff {
  id            String    @id @default(uuid())
  tenantId      String    @map("tenant_id") @db.Uuid
  firstName     String    @map("first_name")
  lastName      String    @map("last_name")
  employeeId    String    @map("employee_id")
  staffType     String    @map("staff_type")
  specialties   Json      @default("[]")
  licenseNumber String?   @map("license_number")
  ...
  
  tenant        Tenant    @relation(fields: [tenantId], references: [id])
  user          User?     // 👈 Reverse relation
  appointments  Appointment[]
  encounters    Encounter[]
  
  @@unique([tenantId, employeeId])
  @@map("staff")
}
```

---

## 🔑 **Key Design Decisions**

### **1. Why Optional Relationship?**

#### **Not all staff need system access:**
- ✅ Janitors, maintenance workers
- ✅ Security personnel
- ✅ Outsourced lab technicians
- ✅ Temporary/contract workers
- ✅ Students, observers, volunteers
- ✅ Retired staff (for historical records)

**Example**: A janitor is tracked in `staff` for scheduling but doesn't need to log into the PMS.

#### **Not all users are healthcare staff:**
- ✅ IT administrators
- ✅ Billing specialists (non-clinical)
- ✅ System integration accounts
- ✅ Management/executive viewing accounts
- ✅ External auditors (temporary access)

**Example**: An IT admin can manage the system but isn't a healthcare provider.

### **2. Separation of Concerns**

| Aspect | Users Table | Staff Table |
|--------|-------------|-------------|
| **Purpose** | System access control | Clinical/operational identity |
| **Key Data** | Email, password, RBAC roles | License, specialty, employee ID |
| **Use Cases** | Login, permissions, audit | Encounters, orders, schedules |
| **Lifecycle** | Account created/deleted | Employment record |
| **Compliance** | PDPL (data privacy) | MOH/DHA (licensing) |

### **3. Cardinality**

```
Staff ◄──0 or 1──► User

- One staff member can have ZERO or ONE user account
- One user account can be linked to ZERO or ONE staff member
- Most clinical staff will have both records
- Non-clinical staff typically have only staff record
- Admin-only users typically have only user record
```

### **4. Deletion Behavior**

```sql
ON DELETE SET NULL
```

**Rationale**:
- If a staff member is deleted (e.g., terminated), their user account should remain for audit trails
- The user account becomes "unlinked" but still exists
- Historical data (who accessed what, when) is preserved

**Example**:
```sql
-- Staff Dr. Smith leaves the hospital
DELETE FROM staff WHERE employee_id = 'DOC123';

-- Their user account remains, but staff_id becomes NULL
SELECT * FROM users WHERE email = 'dr.smith@hospital.com';
-- Result: user exists, staff_id = NULL
```

### **5. Unique Constraint**

```sql
UNIQUE (staff_id)
```

**Rationale**:
- One staff member should have at most one login
- Prevents duplicate accounts for the same person
- If a doctor needs a second account (e.g., admin role), create a separate user without staff link

---

## 📊 **Real-World Scenarios**

### **Scenario 1: Doctor with System Access**

```typescript
// Create staff record
const doctor = await prisma.staff.create({
  data: {
    tenantId: 'tenant-uuid',
    firstName: 'Jane',
    lastName: 'Smith',
    employeeId: 'DOC123',
    staffType: 'doctor',
    specialties: ['cardiology', 'internal_medicine'],
    licenseNumber: 'MOH12345',
    licenseExpiry: new Date('2026-12-31'),
  },
});

// Create user account linked to staff
const user = await prisma.user.create({
  data: {
    tenantId: 'tenant-uuid',
    email: 'dr.smith@hospital.com',
    firstName: 'Dr. Jane',
    lastName: 'Smith',
    passwordHash: await hashPassword('secure-password'),
    role: 'doctor',
    staffId: doctor.id,  // 👈 Link to staff
  },
});
```

**Result**:
- Dr. Smith can log in with `dr.smith@hospital.com`
- Encounters she creates are linked to her staff ID
- Her license and specialty are validated from staff record
- Audit logs track both user actions and clinical activities

### **Scenario 2: Nurse without System Access**

```typescript
// Create staff record only
const nurse = await prisma.staff.create({
  data: {
    tenantId: 'tenant-uuid',
    firstName: 'John',
    lastName: 'Doe',
    employeeId: 'NRS456',
    staffType: 'nurse',
    specialties: ['icu', 'emergency'],
  },
});

// No user account created
// Nurse is assigned to patients via staff scheduling system
// Cannot log into PMS
```

**Result**:
- Nurse John Doe appears in schedules, ward assignments
- Can be assigned to patient care
- No system access (cannot view EMR, cannot create orders)
- If needed later, user account can be created and linked

### **Scenario 3: IT Administrator (Non-Staff)**

```typescript
// Create user account only
const admin = await prisma.user.create({
  data: {
    tenantId: 'tenant-uuid',
    email: 'admin@hospital.com',
    firstName: 'Alice',
    lastName: 'Johnson',
    passwordHash: await hashPassword('admin-password'),
    role: 'system_admin',
    staffId: null,  // 👈 Not linked to staff
  },
});
```

**Result**:
- Alice can log in and manage system settings
- No clinical identity (not a healthcare provider)
- Cannot be assigned to encounters or create orders
- Audit logs show admin actions only

### **Scenario 4: Janitor (Staff Only)**

```typescript
// Create staff record for scheduling
const janitor = await prisma.staff.create({
  data: {
    tenantId: 'tenant-uuid',
    firstName: 'Bob',
    lastName: 'Martinez',
    employeeId: 'JAN789',
    staffType: 'support',
    specialties: [],
  },
});

// No user account
```

**Result**:
- Bob appears in facility staff lists
- Can be scheduled for shifts
- No system access at all

---

## 🔍 **Common Queries**

### **1. Get User with Staff Details**

```typescript
const userWithStaff = await prisma.user.findUnique({
  where: { email: 'dr.smith@hospital.com' },
  include: {
    staff: true,  // Include staff details if linked
  },
});

if (userWithStaff.staff) {
  console.log('Healthcare provider:', userWithStaff.staff.staffType);
  console.log('Specialties:', userWithStaff.staff.specialties);
  console.log('License:', userWithStaff.staff.licenseNumber);
} else {
  console.log('Non-clinical user');
}
```

### **2. Find Staff Without System Access**

```typescript
const staffWithoutAccess = await prisma.staff.findMany({
  where: {
    tenantId: 'tenant-uuid',
    status: 'active',
    user: null,  // No user account
  },
  select: {
    employeeId: true,
    firstName: true,
    lastName: true,
    staffType: true,
  },
});

console.log('Staff without system access:', staffWithoutAccess);
```

### **3. Audit: Who Performed This Action?**

```typescript
// Clinical action (encounter creation)
const encounter = await prisma.encounter.findUnique({
  where: { id: 'encounter-uuid' },
  include: {
    provider: {  // Staff member
      include: {
        user: true,  // Their user account (if they have one)
      },
    },
  },
});

console.log('Clinical provider:', encounter.provider.firstName);
console.log('System user:', encounter.provider.user?.email || 'N/A');

// System action (record access)
const auditLog = await prisma.auditLog.findMany({
  where: { action: 'PATIENT_RECORD_VIEWED' },
  include: {
    user: {
      include: {
        staff: true,  // Link to clinical identity
      },
    },
  },
});
```

### **4. Validate Provider Credentials**

```typescript
async function canPerformProcedure(userId: string, procedure: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { staff: true },
  });

  if (!user.staff) {
    throw new Error('User is not a healthcare provider');
  }

  const specialties = user.staff.specialties as string[];
  if (!specialties.includes(procedure)) {
    throw new Error('Provider not qualified for this procedure');
  }

  // Check license expiry
  if (user.staff.licenseExpiry && user.staff.licenseExpiry < new Date()) {
    throw new Error('Provider license expired');
  }

  return true;
}
```

---

## 🚀 **API Design Patterns**

### **User Registration (with optional staff link)**

```typescript
// POST /api/users
interface CreateUserDto {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: string;
  staffId?: string;  // Optional link to existing staff
}

// If staffId provided, validate it exists and is not already linked
if (dto.staffId) {
  const staff = await prisma.staff.findUnique({
    where: { id: dto.staffId },
    include: { user: true },
  });

  if (!staff) throw new NotFoundException('Staff not found');
  if (staff.user) throw new ConflictException('Staff already has a user account');
}
```

### **Staff Management Endpoints**

```typescript
// GET /api/staff/:id
// Returns staff with optional user account info
{
  "id": "staff-uuid",
  "employeeId": "DOC123",
  "firstName": "Jane",
  "lastName": "Smith",
  "staffType": "doctor",
  "specialties": ["cardiology"],
  "licenseNumber": "MOH12345",
  "user": {  // Included if linked
    "email": "dr.smith@hospital.com",
    "role": "doctor",
    "status": "active"
  }
}

// GET /api/staff?hasAccess=false
// Find staff without system access
```

### **Current User Context**

```typescript
// GET /api/auth/me
// Returns current user with staff details
{
  "id": "user-uuid",
  "email": "dr.smith@hospital.com",
  "firstName": "Dr. Jane",
  "lastName": "Smith",
  "role": "doctor",
  "staff": {
    "employeeId": "DOC123",
    "staffType": "doctor",
    "specialties": ["cardiology"],
    "licenseNumber": "MOH12345"
  },
  "permissions": ["view_patients", "create_encounters", ...],
  "defaultFacility": { ... }
}
```

---

## ✅ **Benefits**

### **1. Flexibility**
- Support diverse user types (clinical, admin, hybrid)
- Easy onboarding (create staff first, add access later)
- Temporary access grants without staff record

### **2. Data Integrity**
- One source of truth for clinical actions (staff table)
- One source of truth for system actions (users table)
- No conflicting data between user and staff names/details

### **3. Compliance**
- RBAC permissions in users table (PDPL compliance)
- Clinical credentials in staff table (MOH/DHA compliance)
- Clear audit trail for both system and clinical actions

### **4. Performance**
- Indexed relationships (fast joins)
- Optional inclusion (load staff data only when needed)
- Separate tables avoid bloated user records

### **5. Maintainability**
- Clear separation of concerns
- Easy to understand and explain
- Matches real-world mental model

---

## 📋 **Migration Status**

✅ **Database Schema**
- [x] `staff_id` column added to `users` table
- [x] Foreign key constraint created
- [x] Unique constraint added
- [x] Index created for performance
- [x] Migration verified

✅ **Prisma Schema**
- [x] User model updated with `staffId` field
- [x] Staff model updated with `user` relation
- [x] Prisma client regenerated

✅ **Documentation**
- [x] Design document (this file)
- [x] Migration script with examples
- [x] SQL comments added

🔄 **Next Steps (Optional)**
- [ ] Update User DTOs to include `staffId`
- [ ] Create API endpoint to link user to staff
- [ ] Add staff details to JWT token
- [ ] Update frontend to show staff info for logged-in users

---

## 🎯 **Summary**

The **optional User-Staff relationship** provides:

1. **Flexibility**: Support clinical and non-clinical users
2. **Accuracy**: Match real-world healthcare operations
3. **Compliance**: Separate RBAC from clinical credentials
4. **Performance**: Indexed, normalized design
5. **Maintainability**: Clear, logical separation

**Key Takeaway**: Users authenticate, Staff deliver care. Link them when needed, keep them separate when not.

---

**Implementation Date**: October 8, 2025  
**Status**: ✅ **Implemented & Verified**  
**Migration File**: `migrations/add_user_staff_relationship.sql`  
**Schema File**: `prisma/schema.prisma`
