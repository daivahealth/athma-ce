# Features Documentation

This folder contains feature-specific documentation organized by domain and module.

## 📂 Feature Categories

### 🏥 Clinical Features

- **[clinical/](./clinical/)** - Clinical data capture, EMR, encounters
  - EMR clinical data capture
  - Encounter management
  - Visit types and workflows

- **[patient-management/](./patient-management/)** - Patient registration and management
  - Patient change history and audit trails
  - Patient consent management
  - Patient document management

- **[consent-management/](./consent-management/)** - Consent workflows and templates
  - Consent system architecture
  - Consent templates and workflows
  - Audit and compliance

- **[order-management/](./order-management/)** - Lab orders, prescriptions, etc.
  - Order workflows
  - Order tracking and fulfillment

### 🏢 Foundation Features

- **[facility-hierarchy/](./facility-hierarchy/)** - Multi-facility management
  - Facility hierarchy design
  - Facility-specialty relationships
  - User-facility mapping
  - API endpoints and workflows

- **[identity-management/](./identity-management/)** - Identity verification and management
  - National ID (Emirates ID) integration
  - Identity verification workflows
  - Identity document management

- **[user-management/](./user-management/)** - User and staff management
  - User-staff relationship
  - RBAC integration
  - Staff assignment workflows

- **[specialty-management/](./specialty-management/)** - Medical specialty management
  - Specialty master data
  - Facility-specialty relationships
  - Specialty APIs

### 📅 Scheduling Features

- **[scheduling/](./scheduling/)** - Appointment and resource scheduling
  - Multi-resource scheduling
  - Healthcare provider scalability
  - Appointment workflows

### 💰 Billing Features

- **[billing/](./billing/)** - Revenue cycle management
  - Billing workflows
  - Claims processing
  - Payment management

### 📖 Reference Data

- **[terminology/](./terminology/)** - Medical terminology and reference data
  - Terminology management
  - Master reference tables
  - Code systems and value sets

## 🗺️ Feature Map

```
athma-ce PMS/RCM System
│
├── Clinical Domain
│   ├── Patient Management
│   ├── Clinical Data Capture (EMR)
│   ├── Encounters & Visits
│   ├── Consent Management
│   └── Order Management
│
├── Foundation Domain
│   ├── Facility Hierarchy
│   ├── Identity Management
│   ├── User & Staff Management
│   ├── Specialty Management
│   └── Scheduling
│
├── RCM Domain
│   └── Billing & Claims
│
└── Cross-Cutting
    ├── Terminology Management
    ├── Multi-Tenancy
    └── RBAC & Security
```

## 📖 Related Documentation

- [Architecture](../architecture/)
- [Multi-Tenancy](../multitenancy/)
- [Security](../security/)
- [API Documentation](../api/)

## 🔗 Quick Links

- [Main README](../README.md)
- [Implementation Summaries](../implementation/summaries/)
- [Backend Overview](../implementation/backend/)
