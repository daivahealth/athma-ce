# Zeal Platform - Documentation Index

## Overview

This documentation package provides a **complete architecture and technology design** for the Zeal Platform, an AI-driven, multi-tenant Practice Management System (PMS) + Revenue Cycle Management (RCM) SaaS for healthcare providers in the UAE.

**Last Updated**: October 2025  
**Version**: 1.0.0  
**Target Audience**: Solution Architects, Technical Leads, Development Teams, Compliance Officers

---

## Documentation Structure

### 📋 Core Documentation

| # | Document | Description | Pages |
|---|----------|-------------|-------|
| **01** | [Context](./01-Context.md) | Business scope, UAE requirements, non-functional targets | ~20 |
| **02** | [Architecture Diagrams](./02-Architecture-Diagram.md) | C4 diagrams, sequence diagrams, system flow | ~25 |
| **03** | [Domain Model](./03-Domain-Model.md) | Entity relationship diagram (ERD), 80+ entities | ~30 |
| **04** | [Interfaces](./04-Interfaces.md) | OpenAPI specifications for all services | ~40 |
| **05** | [Data Model](./05-Data-Model.md) | Complete database schema, RLS policies, indexes | ~180 |

### 🤖 AI & Integration

| # | Document | Description | Pages |
|---|----------|-------------|-------|
| **06** | [AI Design](./06-AI-Design.md) | AI services, models, prompts, guardrails, evaluation | ~25 |
| **07** | [UAE Integrations](./07-Integrations-UAE.md) | DHA eClaimLink, DOH Shafafiya, XML schemas | ~20 |

### 🔒 Security & Compliance

| # | Document | Description | Pages |
|---|----------|-------------|-------|
| **08** | [Security & Compliance](./08-Security-&-Compliance.md) | UAE PDPL, GDPR, OWASP ASVS, VAPT plan | ~30 |
| **09** | [Observability & SRE](./09-Observability-&-SRE.md) | SLOs, monitoring, runbooks, DR plans | ~25 |
| **20** | [RBAC & Access Control](./20-RBAC-Access-Control.md) | Role-based access, permissions, MFA/2FA | ~50 |

### 🚀 Deployment & Operations

| # | Document | Description | Pages |
|---|----------|-------------|-------|
| **10** | [Deployment & Ops](./10-Deployment-&-Ops.md) | IaC (AWS/Azure), environments, data residency | ~35 |
| **11** | [Report Pack](./11-Report-Pack.md) | KPIs: Operational, Clinical, Financial | ~15 |

### 🏥 Clinical & Operations

| # | Document | Description | Pages |
|---|----------|-------------|-------|
| **12** | [Scalability - Healthcare Providers](./12-Scalability-Healthcare-Providers.md) | Clinic → Hospital → Diagnostic → Surgery scaling | ~15 |
| **13** | [Multi-Resource Scheduling](./13-Multi-Resource-Scheduling.md) | Staff, equipment, space scheduling | ~20 |
| **14** | [Billing Workflows](./14-Billing-Workflows.md) | 12+ billing scenarios with SQL examples | ~50 |
| **16** | [Terminology Management](./16-Terminology-Management.md) | Code systems, concepts, value sets | ~25 |
| **17** | [Encounter Sources](./17-Encounter-Sources.md) | Appointment, walk-in, emergency, telemedicine | ~15 |
| **18** | [Order Management](./18-Order-Management.md) | Lab, imaging, medication, procedure orders | ~20 |
| **19** | [Master Reference Tables](./19-Master-Reference-Tables.md) | Medication, lab, imaging, procedure catalogs | ~20 |
| **21** | [EMR/Clinical Data Capture](./21-EMR-Clinical-Data-Capture.md) | Clinical workflow, SOAP notes, CDS, integrations | ~35 |
| **22** | [Data Model Summary](./22-Data-Model-Summary.md) | Executive summary of database schema | ~20 |
| **23** | [Arabic Compliance Checklist](./23-Arabic-Compliance-Checklist.md) | UAE healthcare Arabic language requirements | ~25 |

### 📐 Architecture Decision Records (ADRs)

| # | ADR | Decision | Rationale |
|---|-----|----------|-----------|
| **001** | [Language Split](./ADR/ADR-0001-language-split.md) | Node.js/TypeScript + Python | Transactional APIs vs AI/ETL workloads |
| **002** | [Event Bus](./ADR/ADR-0002-comms.md) | Apache Kafka | Event streaming, replay, audit |
| **003** | [Multi-Tenancy](./ADR/ADR-0003-multitenancy.md) | PostgreSQL RLS | Security, compliance, performance |

### 📅 Roadmap

| Document | Description |
|----------|-------------|
| [Backlog](../roadmap/Backlog.md) | MVP → MMR → GA milestones with AI integration |

---

## Quick Navigation

### By Role

#### **Solution Architect**
Start here:
1. [Context](./01-Context.md) — Understand business scope
2. [Architecture Diagrams](./02-Architecture-Diagram.md) — System overview
3. [Domain Model](./03-Domain-Model.md) — Entity relationships
4. [ADRs](./ADR/) — Key architectural decisions

#### **Backend Developer**
Start here:
1. [Data Model](./05-Data-Model.md) — Database schema
2. [Interfaces](./04-Interfaces.md) — API contracts
3. [Order Management](./18-Order-Management.md) — Clinical workflows
4. [Billing Workflows](./14-Billing-Workflows.md) — RCM workflows

#### **Frontend Developer**
Start here:
1. [Interfaces](./04-Interfaces.md) — API endpoints
2. [RBAC](./20-RBAC-Access-Control.md) — Permission model
3. [EMR/Clinical](./21-EMR-Clinical-Data-Capture.md) — Clinical UI flows

#### **DevOps Engineer**
Start here:
1. [Deployment & Ops](./10-Deployment-&-Ops.md) — Infrastructure
2. [Observability](./09-Observability-&-SRE.md) — Monitoring & SRE
3. [Security & Compliance](./08-Security-&-Compliance.md) — Security controls

#### **Data Analyst**
Start here:
1. [Data Model](./05-Data-Model.md) — Schema design
2. [Report Pack](./11-Report-Pack.md) — KPI definitions
3. [Domain Model](./03-Domain-Model.md) — Entity relationships

#### **Compliance Officer**
Start here:
1. [Security & Compliance](./08-Security-&-Compliance.md) — PDPL, GDPR mapping
2. [RBAC](./20-RBAC-Access-Control.md) — Access controls
3. [EMR/Clinical](./21-EMR-Clinical-Data-Capture.md) — Clinical data protection

---

## By Feature

### Patient Management
- [Data Model](./05-Data-Model.md) — `patients`, `patient_problems`, `family_history`
- [EMR/Clinical](./21-EMR-Clinical-Data-Capture.md) — Registration, demographics
- [Terminology](./16-Terminology-Management.md) — Coded values

### Scheduling
- [Multi-Resource Scheduling](./13-Multi-Resource-Scheduling.md) — Staff, equipment, spaces
- [Data Model](./05-Data-Model.md) — `appointments`, `schedule_blocks`

### Clinical Documentation
- [EMR/Clinical](./21-EMR-Clinical-Data-Capture.md) — SOAP notes, vitals, orders
- [Order Management](./18-Order-Management.md) — Lab, imaging, medications
- [Master Reference Tables](./19-Master-Reference-Tables.md) — Catalogs

### Billing & RCM
- [Billing Workflows](./14-Billing-Workflows.md) — 12+ scenarios
- [Data Model](./05-Data-Model.md) — Claims, denials, appeals, statements
- [UAE Integrations](./07-Integrations-UAE.md) — DHA, DOH connectors

### Security & Access
- [RBAC](./20-RBAC-Access-Control.md) — Roles, permissions, MFA
- [Security & Compliance](./08-Security-&-Compliance.md) — PDPL, VAPT

### AI & Automation
- [AI Design](./06-AI-Design.md) — Models, prompts, evaluation
- [EMR/Clinical](./21-EMR-Clinical-Data-Capture.md) — AI-assisted documentation

---

## Database Schema Summary

### Total Tables: 100+

#### Core (10)
- tenants, users, locations, facilities, spaces, staff, equipment, patients, episodes, documents

#### RBAC & Security (8)
- roles, permissions, role_permissions, user_roles, user_mfa_settings, user_mfa_backup_codes, user_mfa_attempts, user_trusted_devices

#### Clinical (15)
- appointments, encounters, vitals, clinical_notes, patient_problems, care_plans, care_plan_interventions, immunizations, screenings, family_history, patient_allergies_enhanced, encounter_links, episodes

#### Orders & Results (10)
- orders, medication_orders, lab_orders, imaging_orders, procedure_orders, referral_orders, lab_results, imaging_results, procedure_results, medication_dispensing

#### Master Reference (4)
- medication_master, lab_test_master, imaging_study_master, procedure_master

#### Billing & Claims (15)
- superbills, superbill_items, claim_headers, claim_lines, claim_submission_batches, claim_batch_items, claim_acknowledgments, claim_denials, claim_appeals, claim_resubmissions, validation_findings, submission_logs

#### Payments & AR (10)
- patient_payments, payment_postings, remittance_headers, remittance_lines, reconciliations, patient_statements, patient_statement_items, dunning_notices, collections, underpayment_analysis

#### Payers & Insurance (8)
- payers, policies, policy_benefits, fee_schedules, fee_schedule_versions, payer_networks, copay_exemptions, eligibility_requests, eligibility_benefits

#### Scheduling (8)
- staff_schedules, equipment_schedules, schedule_blocks, appointment_resources, appointment_resource_requirements, resource_conflicts, no_show_tracking, resource_utilization

#### Compliance & Audit (8)
- data_access_logs, patient_consents, consent_sharing_agreements, security_breaches, breach_notifications, audit_logs, data_retention_policies

#### Terminology (5)
- code_systems, concepts, concept_translations, value_sets, value_set_members

#### UAE-Specific (5)
- post_offices, staff_licenses, specialties, uae_eclaims_fields, uae_drg_tariffs

---

## Key Technologies

### Backend
- **Language**: Node.js/TypeScript (APIs), Python (AI/ETL)
- **Framework**: Express.js, FastAPI
- **Database**: PostgreSQL 16 with Row-Level Security (RLS)
- **Cache**: Redis 7
- **Message Queue**: Apache Kafka
- **Search**: OpenSearch/Elasticsearch

### Frontend
- **Web**: React/TypeScript
- **Mobile**: React Native
- **UI**: Material-UI/Ant Design with RTL support

### AI/ML
- **LLM**: GPT-4, Claude (note drafting, coding assist)
- **Classical ML**: scikit-learn, XGBoost (scheduling, anomaly detection)
- **NLP**: spaCy, Hugging Face (clinical NLP)
- **OCR**: Tesseract, AWS Textract (document processing)

### Infrastructure
- **Cloud**: AWS, Azure (UAE regions)
- **IaC**: Terraform
- **Orchestration**: Kubernetes (EKS, AKS)
- **CI/CD**: GitHub Actions
- **Monitoring**: Prometheus, Grafana, Jaeger, OpenTelemetry

### Integration
- **HL7**: v2.x for lab/imaging orders and results
- **FHIR**: R4 for HIE and interoperability
- **DICOM**: Imaging studies
- **NCPDP SCRIPT**: ePrescribing
- **XML**: DHA eClaimLink, DOH Shafafiya

---

## Compliance Framework

### Regulatory Requirements

| Regulation | Scope | Documentation |
|------------|-------|---------------|
| **UAE PDPL** | Personal Data Protection | [Security & Compliance](./08-Security-&-Compliance.md) |
| **GDPR** | International clinics | [Security & Compliance](./08-Security-&-Compliance.md) |
| **DHA Standards** | Dubai healthcare | [UAE Integrations](./07-Integrations-UAE.md) |
| **DOH Standards** | Abu Dhabi healthcare | [UAE Integrations](./07-Integrations-UAE.md) |
| **HIPAA** | US-based patients | [Security & Compliance](./08-Security-&-Compliance.md) |

### Security Controls

| Control | Implementation | Documentation |
|---------|----------------|---------------|
| **RBAC** | Roles, permissions, least privilege | [RBAC](./20-RBAC-Access-Control.md) |
| **MFA** | TOTP, SMS, Email, Backup codes | [RBAC](./20-RBAC-Access-Control.md) |
| **RLS** | PostgreSQL row-level security | [Data Model](./05-Data-Model.md) |
| **Encryption** | TLS 1.3, AES-256 | [Security & Compliance](./08-Security-&-Compliance.md) |
| **Audit Logging** | Data access logs, audit trails | [Data Model](./05-Data-Model.md) |
| **Breach Management** | Incident tracking, notifications | [Data Model](./05-Data-Model.md) |

---

## Implementation Roadmap

### Phase 1: MVP (90 days)
- Core PMS (patients, appointments, encounters)
- Basic billing (superbills, charge capture)
- Eligibility checking
- Manual claim submission
- Basic reporting

### Phase 2: MMR (180 days)
- Prior authorization
- ePrescribing
- Automated claim submission (DHA, DOH)
- Remittance processing
- AI coding assistant v1
- Smart scheduling v1

### Phase 3: GA (270 days)
- Advanced analytics
- Payer-specific rule packs
- AI note drafting
- Denial management & appeals
- Patient portal
- Arabic/RTL UI
- RBAC & MFA enforcement

See [Roadmap](../roadmap/Backlog.md) for detailed milestones.

---

## Seed Data

Pre-configured sample data for development and testing:

| Phase | Files | Description |
|-------|-------|-------------|
| **1** | 01-06 | Tenants, specialties, code systems, value sets |
| **2** | 07-11 | Users, locations, facilities, spaces, equipment |
| **3** | 12-16 | Staff, schedules, licenses |
| **4** | 17-19 | Payers, fee schedules, codesets |
| **4.5** | 19-22 | Master reference tables (medications, labs, imaging, procedures) |
| **5** | 23-25 | Patients, policies |
| **6-10** | 26-45 | Clinical, billing, rules |

See [Seed Data](../seed/README.md) for execution guide.

---

## Key Features

### ✅ Multi-Tenant SaaS
- Complete tenant isolation with RLS
- Per-tenant customization (roles, fee schedules, rules)
- Data residency in UAE regions

### ✅ Complete PMS
- Patient registration with Emirates ID
- Multi-resource scheduling (staff, equipment, spaces)
- SOAP clinical notes
- Order management (lab, imaging, medications, procedures)
- ePrescribing
- Document management
- Patient portal

### ✅ Complete RCM
- Eligibility verification
- Prior authorization
- Charge capture with auto-coding
- Claim validation and submission
- Batch processing for DHA/DOH/MOHAP
- Denial management and appeals
- Remittance processing (ERA/EOB)
- Payment posting and reconciliation
- Patient statements and collections

### ✅ AI Everywhere
- Clinical note drafting from voice
- Medical coding assistance (ICD/CPT)
- Smart scheduling with no-show prediction
- Denial risk scoring
- Anomaly detection for underpayments
- Document AI (OCR for EOB, attachments)
- Chatbots (patient, staff)

### ✅ UAE-Specific
- DHA eClaimLink connector (XML)
- DOH Shafafiya connector (XML)
- MOHAP/Riayati ready
- Payer-specific rules
- Standards Notice timelines
- Arabic/English UI with RTL
- Local coding systems

### ✅ Enterprise Security
- RBAC with 200+ granular permissions
- MFA/2FA (TOTP, SMS, Email)
- Trusted device management
- Data access logging (every patient view)
- Breach notification management
- Consent management with digital signatures
- Encryption (TLS 1.3, AES-256)

### ✅ Clinical Decision Support
- Drug-drug interaction checking
- Allergy alerts
- Duplicate order detection
- Preventive care reminders
- Clinical guidelines integration
- Lab result auto-flagging

### ✅ Interoperability
- HL7 v2.x (lab/imaging orders and results)
- FHIR R4 (HIE, care coordination)
- DICOM (imaging studies)
- NCPDP SCRIPT (ePrescribing)
- XML (DHA, DOH)
- RESTful APIs

---

## Technical Highlights

### Database Design
- **100+ tables** with complete RLS policies
- **300+ indexes** for performance
- **Partitioning** for high-volume tables
- **JSONB** for flexible data structures
- **Generated columns** for calculated fields
- **Triggers** for business logic
- **Functions** for complex operations

### API Design
- **RESTful** architecture
- **OpenAPI 3.0** specifications
- **JWT** authentication (15-min expiry + refresh)
- **Idempotency** keys for safe retries
- **Rate limiting** per tenant/user
- **Versioning** (v1, v2)

### AI Architecture
- **LLM-based** for note drafting, coding
- **Classical ML** for scheduling, anomaly detection
- **RAG** for UAE rules and payer bulletins
- **Human-in-the-loop** for critical decisions
- **Shadow mode** rollout for AI features
- **A/B testing** for optimization

### Deployment
- **Multi-region**: UAE (Dubai, Abu Dhabi)
- **High availability**: 99.9%+ SLA
- **Auto-scaling**: Horizontal pod autoscaling
- **Blue-green deployments**: Zero-downtime
- **DR**: RPO ≤ 15 min, RTO ≤ 1 hr

---

## Getting Started

### For Developers

1. **Read Core Documentation**
   - [Context](./01-Context.md)
   - [Architecture](./02-Architecture-Diagram.md)
   - [Data Model](./05-Data-Model.md)

2. **Set Up Development Environment**
   - Clone repository
   - Run database migrations
   - Load seed data: `./seed/execute-all-seeds.sh`
   - Start services

3. **Understand Key Workflows**
   - [EMR/Clinical](./21-EMR-Clinical-Data-Capture.md)
   - [Billing Workflows](./14-Billing-Workflows.md)
   - [Order Management](./18-Order-Management.md)

### For Architects

1. **Review Architecture**
   - [Architecture Diagrams](./02-Architecture-Diagram.md)
   - [Domain Model](./03-Domain-Model.md)
   - [ADRs](./ADR/)

2. **Understand Scalability**
   - [Scalability](./12-Scalability-Healthcare-Providers.md)
   - [Multi-Resource Scheduling](./13-Multi-Resource-Scheduling.md)

3. **Plan Integration**
   - [Interfaces](./04-Interfaces.md)
   - [UAE Integrations](./07-Integrations-UAE.md)

### For Compliance

1. **Review Compliance Framework**
   - [Security & Compliance](./08-Security-&-Compliance.md)
   - [RBAC](./20-RBAC-Access-Control.md)

2. **Understand Data Protection**
   - [Data Model](./05-Data-Model.md) — RLS policies
   - [EMR/Clinical](./21-EMR-Clinical-Data-Capture.md) — PHI protection

---

## Support & Contact

For questions or clarifications:
- **Technical**: Review relevant documentation section
- **Architecture**: Check ADRs for design decisions
- **Compliance**: Refer to security and compliance documentation
- **Implementation**: Use code examples in documentation

---

## Document Conventions

### Code Blocks
- **SQL**: Database schema and queries
- **TypeScript**: API implementation examples
- **Python**: AI service implementation
- **YAML**: OpenAPI specifications, configuration

### Diagrams
- **Mermaid**: C4 diagrams, sequence diagrams, ERDs, flowcharts
- **PlantUML**: Detailed sequence diagrams (future)

### Terminology
- **PMS**: Practice Management System
- **RCM**: Revenue Cycle Management
- **EMR**: Electronic Medical Record
- **EHR**: Electronic Health Record
- **RBAC**: Role-Based Access Control
- **MFA**: Multi-Factor Authentication
- **RLS**: Row-Level Security
- **DHA**: Dubai Health Authority
- **DOH**: Department of Health (Abu Dhabi)
- **MOHAP**: Ministry of Health and Prevention
- **PDPL**: UAE Personal Data Protection Law
- **GDPR**: General Data Protection Regulation
- **HL7**: Health Level 7
- **FHIR**: Fast Healthcare Interoperability Resources
- **LOINC**: Logical Observation Identifiers Names and Codes
- **CPT**: Current Procedural Terminology
- **ICD-10**: International Classification of Diseases, 10th Revision
- **SNOMED**: Systematized Nomenclature of Medicine

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0.0 | Oct 2025 | Initial comprehensive design | Solution Architecture Team |
| 0.9.0 | Sep 2025 | Added RBAC, MFA, clinical enhancements | Solution Architecture Team |
| 0.8.0 | Sep 2025 | Added master reference tables, order management | Solution Architecture Team |
| 0.7.0 | Sep 2025 | Added multi-resource scheduling | Solution Architecture Team |
| 0.6.0 | Aug 2025 | Added terminology management, visit classification | Solution Architecture Team |
| 0.5.0 | Aug 2025 | Added billing workflows, RCM enhancements | Solution Architecture Team |
| 0.4.0 | Jul 2025 | Added UAE integrations, compliance framework | Solution Architecture Team |

---

**© 2025 Zeal Platform. All rights reserved.**

