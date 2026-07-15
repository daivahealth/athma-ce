# ADR-0012: Health Information Exchange (HIE) Integration Architecture

## Status
**ACCEPTED** - 2024-10-15
**AMENDED** - 2026-07-15 (see "Amendment: Generic, Region-Agnostic Provider Abstraction")

> **Amendment summary (2026-07-15):** The first delivered increment implements a
> **generic, region-agnostic HIE provider abstraction** inside the clinical
> service rather than a UAE-specific service. The concrete network (UAE
> NABIDH/Malaffi/Riayati, India ABDM, or any other HIE) is treated as a
> **configuration/future concern** selected behind a single provider interface.
> The original UAE-specific design below remains the target end-state for a
> dedicated HIE microservice; the amendment section records what exists today
> and why. See "Amendment: Generic, Region-Agnostic Provider Abstraction".

## Context

The UAE has established three major Health Information Exchange (HIE) platforms to enable seamless health information exchange across the country:

1. **NABIDH** (Dubai Health Authority) - Dubai's unified electronic health records
2. **Malaffi** (Department of Health Abu Dhabi) - Abu Dhabi's health information exchange  
3. **Riayati** (Ministry of Health and Prevention) - National unified medical record

These platforms are critical for:
- **Interoperability**: Seamless data exchange between healthcare providers
- **Care Coordination**: Improved patient care through shared medical records
- **Regulatory Compliance**: Meeting UAE healthcare data sharing requirements
- **Patient Safety**: Reducing medical errors through comprehensive patient data
- **Operational Efficiency**: Eliminating duplicate data entry and improving workflows

## Decision

We will implement a comprehensive HIE integration architecture that:

### 1. **Dedicated HIE Service**
- Create a separate `HIE Service` microservice for all HIE platform integrations
- Use FHIR R4 as the primary standard for data exchange
- Implement OAuth 2.0 and certificate-based authentication
- Support both real-time and batch synchronization

### 2. **FHIR Gateway Pattern**
- Implement a centralized FHIR Gateway for data transformation
- Convert internal data models to FHIR R4 resources
- Handle FHIR validation and error processing
- Support multiple FHIR versions if required

### 3. **Multi-Platform Support**
- Support all three UAE HIE platforms (NABIDH, Malaffi, Riayati)
- Implement platform-specific adapters for authentication and API differences
- Provide unified interface for cross-platform data synchronization
- Handle platform-specific data requirements and constraints

### 4. **Data Synchronization Strategy**
- **Real-time sync** for critical data (patient registration, emergency encounters)
- **Batch sync** for routine data (scheduled appointments, routine observations)
- **On-demand sync** for specific queries and data retrieval
- **Conflict resolution** for data inconsistencies across platforms

### 5. **Consent and Privacy Management**
- Implement granular consent management for data sharing
- Support patient preferences for platform participation
- Provide audit trails for all data access and sharing
- Ensure compliance with UAE PDPL and healthcare regulations

## Technical Implementation

### Architecture Components

```typescript
// HIE Service Architecture
class HIEService {
  private nabidhClient: NABIDHClient;
  private malaffiClient: MalaffiClient;
  private riayatiClient: RiayatiClient;
  private fhirGateway: FHIRGateway;
  private consentManager: ConsentManager;
  private auditLogger: AuditLogger;
}
```

### Supported FHIR Resources

```typescript
interface SupportedFHIRResources {
  // Core Resources
  Patient: Patient;
  Practitioner: Practitioner;
  Organization: Organization;
  Location: Location;
  
  // Clinical Resources
  Encounter: Encounter;
  Observation: Observation;
  DiagnosticReport: DiagnosticReport;
  MedicationRequest: MedicationRequest;
  Procedure: Procedure;
  Condition: Condition;
  AllergyIntolerance: AllergyIntolerance;
  
  // Administrative Resources
  Appointment: Appointment;
  Schedule: Schedule;
  Coverage: Coverage;
  Claim: Claim;
}
```

### Authentication Methods

```yaml
# Platform-specific authentication
nabidh:
  auth_type: "oauth2_client_credentials"
  token_url: "https://auth.nabidh.ae/oauth2/token"
  scope: "patient/*.read patient/*.write encounter/*.read encounter/*.write"

malaffi:
  auth_type: "certificate_based"
  certificate_path: "/certs/malaffi-client.pem"
  private_key_path: "/certs/malaffi-private.key"

riayati:
  auth_type: "oauth2_pkce"
  auth_url: "https://auth.riayati.ae/oauth2/authorize"
  token_url: "https://auth.riayati.ae/oauth2/token"
```

### Data Synchronization Patterns

```typescript
interface SyncPatterns {
  real_time: {
    triggers: ["patient_registration", "emergency_encounter", "critical_result"];
    platforms: ["nabidh", "malaffi", "riayati"];
    timeout: 5000; // milliseconds
  };
  
  batch: {
    interval: "15m"; // every 15 minutes
    batch_size: 100;
    platforms: ["nabidh", "malaffi", "riayati"];
    resources: ["encounter", "observation", "diagnostic_report"];
  };
  
  on_demand: {
    triggers: ["patient_query", "data_retrieval", "audit_request"];
    platforms: ["nabidh", "malaffi", "riayati"];
    caching: true;
    cache_ttl: 300; // 5 minutes
  };
}
```

## Consequences

### Positive
- **Enhanced Interoperability**: Seamless data exchange with UAE healthcare ecosystem
- **Improved Care Quality**: Comprehensive patient data available across providers
- **Regulatory Compliance**: Meets UAE healthcare data sharing requirements
- **Operational Efficiency**: Reduces duplicate data entry and improves workflows
- **Patient Safety**: Reduces medical errors through complete patient history
- **Scalability**: Supports future HIE platforms and standards

### Negative
- **Complexity**: Additional service and integration complexity
- **Performance Impact**: Network latency for real-time synchronization
- **Data Consistency**: Challenges with cross-platform data synchronization
- **Security Overhead**: Multiple authentication mechanisms and security controls
- **Maintenance**: Ongoing maintenance for multiple platform integrations
- **Cost**: Additional infrastructure and development costs

### Risks
- **Platform Changes**: HIE platforms may change APIs or requirements
- **Data Conflicts**: Inconsistent data across platforms
- **Network Failures**: Synchronization failures during network issues
- **Privacy Breaches**: Increased attack surface for patient data
- **Performance Degradation**: System slowdown during high synchronization load

## Mitigation Strategies

### 1. **Resilience and Reliability**
- Implement circuit breakers for HIE platform failures
- Use retry policies with exponential backoff
- Implement dead letter queues for failed synchronizations
- Provide fallback mechanisms for offline operation

### 2. **Data Consistency**
- Implement conflict resolution strategies
- Use timestamps and versioning for data changes
- Provide manual review processes for conflicts
- Maintain audit trails for all data modifications

### 3. **Security and Privacy**
- Encrypt all data in transit and at rest
- Implement comprehensive access controls
- Regular security audits and penetration testing
- Monitor and alert on suspicious activities

### 4. **Performance Optimization**
- Implement caching for frequently accessed data
- Use asynchronous processing for non-critical synchronizations
- Optimize FHIR resource serialization
- Monitor and optimize database queries

## Implementation Phases

### Phase 1: Foundation (Weeks 1-4)
- Implement HIE Service architecture
- Set up FHIR Gateway with basic resource support
- Implement authentication for all three platforms
- Create basic patient synchronization

### Phase 2: Core Clinical Data (Weeks 5-8)
- Implement encounter synchronization
- Add observation and diagnostic report support
- Implement consent management
- Add audit logging and monitoring

### Phase 3: Advanced Features (Weeks 9-12)
- Implement batch synchronization
- Add conflict resolution mechanisms
- Implement cross-platform data queries
- Add performance optimizations

### Phase 4: Production Readiness (Weeks 13-16)
- Comprehensive testing and validation
- Security audits and penetration testing
- Performance tuning and optimization
- Documentation and training

## Monitoring and Metrics

### Key Performance Indicators
- **Sync Success Rate**: Percentage of successful synchronizations
- **Sync Latency**: Average time for data synchronization
- **Data Consistency**: Percentage of consistent data across platforms
- **Error Rate**: Frequency of synchronization errors
- **Platform Availability**: Uptime of HIE platforms

### Monitoring Tools
- **Prometheus**: Metrics collection and alerting
- **Grafana**: Dashboards and visualization
- **Jaeger**: Distributed tracing for HIE operations
- **ELK Stack**: Log aggregation and analysis

## Compliance and Standards

### UAE Healthcare Standards
- **UAE PDPL**: Personal data protection compliance
- **DHA Regulations**: Dubai Health Authority requirements
- **DOH Standards**: Department of Health Abu Dhabi standards
- **MOHAP Guidelines**: Ministry of Health and Prevention guidelines

### International Standards
- **FHIR R4**: Fast Healthcare Interoperability Resources
- **HL7 v2**: Health Level Seven version 2
- **IHE Profiles**: Integrating the Healthcare Enterprise profiles
- **OAuth 2.0**: Authorization framework
- **TLS 1.3**: Transport layer security

## Amendment: Generic, Region-Agnostic Provider Abstraction (2026-07-15)

### Motivation

The original decision scoped HIE integration tightly to the three UAE networks
and a dedicated microservice. In practice the first shippable increment needs to
be **region-neutral**: the same consent-driven "fetch external records" workflow
must work whether the concrete network is UAE (NABIDH/Malaffi/Riayati), India
(ABDM), or a sandbox/mock during development. Hardcoding a region into the code
path couples clinical workflow to a specific regulatory network and blocks reuse.

### Decision (delta)

1. **Provider interface, not a hardcoded network.** External-record retrieval is
   expressed through a single `HieProvider` interface. The concrete network is
   an implementation detail selected at composition/config time, not in the
   controller or service.

   ```typescript
   interface HieProvider {
     readonly name: string;                                   // e.g. "mock", "abdm", "nabidh"
     fetchRecords(request: HieFetchRequest): Promise<HieFetchResponse>;
   }
   ```

   - `HieFetchRequest` carries a **provider-neutral** `patientReference`
     (ABHA address / Emirates ID / MRN — the provider maps it) and an optional
     `consentReference`.
   - `HieFetchResponse` returns normalised `ExternalHealthRecord`s (lab report,
     discharge summary, imaging, ...) that are ingested as patient documents.
   - Providers signal transient failures via a `HieProviderError` carrying a
     `retryable` flag, which the service maps onto a retryable job state.

2. **First implementation is `MockHieProvider`.** It returns a small deterministic
   set of sample records and can simulate a transient failure to exercise the
   fetch/retry path. It is bound to the `HIE_PROVIDER` DI token; swapping in a
   real network is a one-line provider binding (or a config-driven factory) with
   **no change** to the controller, service, or data model.

3. **Consent reuse, not a parallel consent system.** External fetch is gated on
   the existing clinical consent module using the `hie_participation` consent
   type (grant / expiry / renewal already supported). No new consent primitives
   were introduced; `hie_participation` now carries a 365-day validity so
   expiry/renewal semantics apply.

4. **Lives in the clinical service (for now).** Rather than stand up a separate
   HIE microservice immediately, the abstraction ships as a `hie` module inside
   the clinical service, reusing consent and patient-document boundaries. The
   dedicated-service end-state in the original decision is preserved as future
   direction; the `HieProvider` seam is exactly what would move into that
   service later.

5. **Region specialisation is deferred to configuration.** Network selection,
   FHIR mapping specifics, authentication (OAuth2 vs certificate), and endpoint
   URLs are all provider-implementation concerns chosen by environment/config —
   not baked into the generic workflow.

### State model

A `hie_fetch_jobs` table (clinical schema) tracks each consent-driven fetch:
`status` (`pending` → `fetching` → `completed` | `failed`), `attempts`,
`provider`, `record_types`, ingested `document_ids`, a fetch `summary`, and
`error_code`/`error_message` for the retry path. Migration
`009_add_hie_fetch_jobs.sql` is provided but **not auto-applied** to the shared
database.

### Consequences of the amendment

- **Positive:** region-neutral, testable offline, no new consent system, minimal
  surface area, clean seam for a future dedicated service and real networks.
- **Trade-off:** the mock returns canned data; real FHIR mapping, network auth,
  and conflict resolution from the original decision remain to be implemented per
  provider.

## Conclusion

The HIE integration architecture provides a robust foundation for seamless health information exchange across UAE healthcare platforms. While it introduces complexity, the benefits of improved interoperability, care quality, and regulatory compliance far outweigh the challenges. The phased implementation approach ensures manageable complexity while delivering incremental value.

This decision aligns with our strategic goals of becoming the leading healthcare platform in the UAE and supporting the country's digital health transformation initiatives.
