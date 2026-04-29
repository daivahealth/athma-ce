# ADR-0011: Integration Architecture — UAE Healthcare Ecosystem Connectors

- **Status**: Accepted
- **Date**: 2025-10-01
- **Last Reviewed**: 2026-04-29
- **Owners**: Architecture Team, Integration Team, Compliance Team
- **Related**: ADR-0001 (Language Split), ADR-0007 (Security & Compliance)
- **Context**: UAE healthcare systems require integration with multiple government and private systems for compliance and interoperability

> Implementation note
> This ADR is a target-state integration design. It should not be read as evidence that every connector, gateway component, or message-driven integration described below already exists in the repository.

## 1) Decision

Implement a **comprehensive integration architecture** with:

- **Connector Abstraction Layer**: Unified interface for all external systems
- **UAE Government Integration**: DHA eClaimLink, DOH Shafafiya, MOHAP connectors
- **Healthcare Standards**: FHIR R4, HL7 v2, DICOM for interoperability
- **Clearinghouse Integration**: Multiple clearinghouse and post-office connectors
- **API Gateway**: Centralized API management and security
- **Event-Driven Architecture**: Asynchronous integration patterns

### Current Repository State

- The repository contains domain services and supporting architecture documents, but not a complete implemented connector platform matching every element in this ADR.
- API gateway and event-driven integration references in this document should be interpreted as design direction unless backed by concrete service, infra, or runtime assets.

## 2) Drivers

- **UAE Compliance**: Mandatory integration with government healthcare systems
- **Interoperability**: Healthcare data exchange standards compliance
- **Scalability**: Support for multiple integration partners and protocols
- **Reliability**: High availability and fault tolerance for critical integrations
- **Security**: Secure data exchange with external systems

## 3) Scope

Applies to all integration components including:
- **Government Systems**: DHA, DOH, MOHAP, Emirates ID integration
- **Healthcare Standards**: FHIR, HL7, DICOM, IHE profiles
- **Clearinghouses**: Multiple clearinghouse and post-office integrations
- **Third-Party Systems**: Laboratory, imaging, pharmacy system integrations
- **Patient Portals**: External patient portal and mobile app integrations

## 4) Non-Goals

- Not implementing custom healthcare protocols (use industry standards)
- Not covering legacy system migrations (future ADR)
- Not supporting real-time streaming integrations initially

## 5) Integration Architecture

### Connector Abstraction Layer
```yaml
# Integration Architecture
integration:
  connector_layer:
    - dha_eclaimlink: [eligibility, claims, remittance]
    - doh_shafafiya: [prior_auth, claims, reporting]
    - mohap: [licensing, reporting, compliance]
    - clearinghouse: [claims_submission, remittance]
    
  protocol_adapters:
    - fhir: [r4, patient, encounter, observation]
    - hl7: [v2, adt, oru, mdm]
    - dicom: [imaging, storage, query]
    - xml: [custom, government_schemas]
    
  api_gateway:
    - authentication: [oauth2, api_keys, mTLS]
    - rate_limiting: [per_client, per_endpoint]
    - monitoring: [metrics, logging, alerting]
```

### Integration Patterns
- **Request-Response**: Synchronous API calls for real-time data
- **Event-Driven**: Asynchronous messaging for workflow integration
- **Batch Processing**: Scheduled data exchange for large volumes
- **Real-Time Streaming**: Continuous data flow for critical systems

## 6) UAE Government Integration

### DHA eClaimLink Integration
```yaml
# DHA eClaimLink Connector
dha_eclaimlink:
  endpoints:
    - eligibility: "https://eclaimlink.dha.gov.ae/api/eligibility"
    - claims: "https://eclaimlink.dha.gov.ae/api/claims"
    - remittance: "https://eclaimlink.dha.gov.ae/api/remittance"
    
  authentication:
    - method: "certificate_based"
    - certificate: "dha_client_cert.p12"
    - validation: "dha_root_ca.pem"
    
  data_formats:
    - request: "XML"
    - response: "XML"
    - schema: "DHA_eClaimLink_v2.1"
    
  workflows:
    - eligibility_check: [real_time, batch]
    - claim_submission: [real_time, batch]
    - remittance_processing: [batch, real_time]
```

### DOH Shafafiya Integration
```yaml
# DOH Shafafiya Connector
doh_shafafiya:
  endpoints:
    - prior_auth: "https://shafafiya.doh.gov.ae/api/prior-auth"
    - claims: "https://shafafiya.doh.gov.ae/api/claims"
    - reporting: "https://shafafiya.doh.gov.ae/api/reporting"
    
  authentication:
    - method: "oauth2"
    - client_id: "zeal_shafafiya_client"
    - scope: "prior_auth claims reporting"
    
  data_formats:
    - request: "JSON"
    - response: "JSON"
    - schema: "DOH_Shafafiya_v1.0"
    
  workflows:
    - prior_auth_request: [real_time]
    - claim_submission: [real_time, batch]
    - compliance_reporting: [batch]
```

### MOHAP Integration
```yaml
# MOHAP Connector
mohap:
  endpoints:
    - licensing: "https://mohap.gov.ae/api/licensing"
    - reporting: "https://mohap.gov.ae/api/reporting"
    - compliance: "https://mohap.gov.ae/api/compliance"
    
  authentication:
    - method: "api_key"
    - key: "mohap_api_key"
    - validation: "mohap_signature"
    
  data_formats:
    - request: "XML"
    - response: "XML"
    - schema: "MOHAP_v1.2"
    
  workflows:
    - provider_licensing: [batch]
    - compliance_reporting: [batch]
    - quality_metrics: [batch]
```

## 7) Healthcare Standards Integration

### FHIR R4 Integration
```yaml
# FHIR R4 Connector
fhir_r4:
  base_url: "https://fhir.zeal.healthcare/fhir/r4"
  
  resources:
    - Patient: [create, read, update, search]
    - Encounter: [create, read, update, search]
    - Observation: [create, read, update, search]
    - DiagnosticReport: [create, read, update, search]
    - MedicationRequest: [create, read, update, search]
    
  operations:
    - $validate: "resource_validation"
    - $everything: "patient_data_export"
    - $match: "patient_matching"
    
  security:
    - authentication: "OAuth2"
    - authorization: "SMART_on_FHIR"
    - encryption: "TLS_1.3"
```

### HL7 v2 Integration
```yaml
# HL7 v2 Connector
hl7_v2:
  message_types:
    - ADT: [A01, A02, A03, A04, A05, A08]
    - ORU: [R01, R02, R03]
    - MDM: [T01, T02, T03]
    - SIU: [S12, S13, S14, S15]
    
  message_format:
    - encoding: "ER7"
    - version: "2.5.1"
    - charset: "UTF-8"
    
  workflows:
    - patient_registration: "ADT^A04"
    - lab_results: "ORU^R01"
    - document_management: "MDM^T02"
    - appointment_scheduling: "SIU^S12"
```

### DICOM Integration
```yaml
# DICOM Connector
dicom:
  services:
    - C-STORE: "image_storage"
    - C-FIND: "query_retrieve"
    - C-MOVE: "image_transfer"
    - C-GET: "image_retrieve"
    
  sop_classes:
    - CT: "1.2.840.10008.5.1.4.1.1.2"
    - MR: "1.2.840.10008.5.1.4.1.1.4"
    - US: "1.2.840.10008.5.1.4.1.1.6"
    - CR: "1.2.840.10008.5.1.4.1.1.1"
    
  workflows:
    - image_storage: [real_time]
    - image_retrieval: [real_time]
    - study_management: [batch]
```

## 8) Clearinghouse Integration

### Multi-Clearinghouse Support
```yaml
# Clearinghouse Connectors
clearinghouses:
  emirates_clearinghouse:
    endpoints:
      - claims: "https://claims.emirates-clearinghouse.ae/api"
      - remittance: "https://remittance.emirates-clearinghouse.ae/api"
    protocol: "X12_837"
    
  gulf_clearinghouse:
    endpoints:
      - claims: "https://api.gulf-clearinghouse.com/claims"
      - remittance: "https://api.gulf-clearinghouse.com/remittance"
    protocol: "XML_837"
    
  international_clearinghouse:
    endpoints:
      - claims: "https://api.international-clearinghouse.com/claims"
      - remittance: "https://api.international-clearinghouse.com/remittance"
    protocol: "FHIR_Claim"
```

### Clearinghouse Abstraction
```typescript
// Clearinghouse Interface
interface ClearinghouseConnector {
  submitClaim(claim: Claim): Promise<SubmissionResult>;
  getRemittance(remittanceId: string): Promise<Remittance>;
  checkEligibility(patient: Patient, service: Service): Promise<EligibilityResult>;
  getClaimStatus(claimId: string): Promise<ClaimStatus>;
}

// Implementation Example
class EmiratesClearinghouseConnector implements ClearinghouseConnector {
  async submitClaim(claim: Claim): Promise<SubmissionResult> {
    // Convert to X12 837 format
    const x12Claim = this.convertToX12(claim);
    
    // Submit to clearinghouse
    const response = await this.httpClient.post('/claims', x12Claim);
    
    // Convert response to standard format
    return this.convertFromX12(response);
  }
}
```

## 9) API Gateway

> Current-state clarification
> A local or repo-implemented API gateway is not currently part of the default runtime described in `TECHNICAL-ARCHITECTURE.md`.

### Gateway Configuration
```yaml
# API Gateway Configuration
api_gateway:
  authentication:
    - oauth2: [client_credentials, authorization_code]
    - api_keys: [per_client, per_endpoint]
    - mTLS: [certificate_validation]
    
  rate_limiting:
    - per_client: "1000 requests/hour"
    - per_endpoint: "100 requests/minute"
    - burst_limit: "200 requests/minute"
    
  monitoring:
    - metrics: [request_count, response_time, error_rate]
    - logging: [request_logs, response_logs, error_logs]
    - alerting: [rate_limit_exceeded, error_rate_high]
    
  security:
    - waf: [sql_injection, xss, rate_limiting]
    - cors: [allowed_origins, allowed_methods]
    - headers: [security_headers, custom_headers]
```

### Gateway Features
- **Authentication**: OAuth2, API keys, mTLS support
- **Authorization**: Role-based access control
- **Rate Limiting**: Per-client and per-endpoint limits
- **Monitoring**: Comprehensive metrics and logging
- **Security**: WAF, CORS, security headers

## 10) Event-Driven Integration

### Event Bus Configuration
```yaml
# Event Bus Configuration
event_bus:
  technology: "Apache Kafka"
  
  topics:
    - patient.registered: [patient_data, demographics]
    - encounter.completed: [encounter_data, clinical_notes]
    - claim.submitted: [claim_data, billing_info]
    - remittance.received: [remittance_data, payment_info]
    
  consumers:
    - dha_connector: [patient.registered, encounter.completed]
    - clearinghouse_connector: [claim.submitted]
    - remittance_processor: [remittance.received]
    
  producers:
    - pms_core: [patient.registered, encounter.completed]
    - rcm_core: [claim.submitted]
    - external_systems: [remittance.received]
```

### Event Patterns
- **Event Sourcing**: Complete event history for audit trails
- **CQRS**: Separate read and write models for performance
- **Saga Pattern**: Distributed transaction management
- **Event Replay**: Replay events for system recovery

## 11) Data Transformation

### Transformation Engine
```yaml
# Data Transformation Configuration
transformation:
  engine: "Apache NiFi"
  
  processors:
    - convert_format: [xml_to_json, json_to_xml, hl7_to_fhir]
    - validate_data: [schema_validation, business_rules]
    - enrich_data: [lookup_tables, reference_data]
    - route_data: [conditional_routing, load_balancing]
    
  schemas:
    - fhir_r4: "fhir_r4_schema.json"
    - hl7_v2: "hl7_v2_schema.json"
    - dha_xml: "dha_eclaimlink_schema.xsd"
    - doh_json: "doh_shafafiya_schema.json"
```

### Transformation Use Cases
- **Format Conversion**: XML to JSON, HL7 to FHIR
- **Data Enrichment**: Add reference data, lookup values
- **Data Validation**: Schema validation, business rule validation
- **Data Routing**: Route data based on content or destination

## 12) Error Handling and Retry

### Retry Strategy
```yaml
# Retry Configuration
retry_strategy:
  exponential_backoff:
    - initial_delay: "1 second"
    - max_delay: "60 seconds"
    - multiplier: "2"
    - max_attempts: "5"
    
  circuit_breaker:
    - failure_threshold: "5 failures"
    - timeout: "30 seconds"
    - half_open_max_calls: "3"
    
  dead_letter_queue:
    - max_retries: "3"
    - dlq_topic: "integration.dlq"
    - alert_on_dlq: true
```

### Error Handling
- **Exponential Backoff**: Progressive delay for retry attempts
- **Circuit Breaker**: Prevent cascading failures
- **Dead Letter Queue**: Handle permanently failed messages
- **Error Notification**: Alert on critical integration failures

## 13) Security and Compliance

### Data Security
- **Encryption**: TLS 1.3 for all data transmission
- **Authentication**: Strong authentication for all integrations
- **Authorization**: Role-based access control
- **Audit Logging**: Complete audit trails for all integrations

### Compliance
- **UAE PDPL**: Personal data protection compliance
- **HIPAA**: Healthcare data protection compliance
- **Data Residency**: All data processing in UAE regions
- **Audit Requirements**: Complete audit trails for compliance

## 14) Monitoring and Observability

### Integration Metrics
- **Performance**: Response times, throughput, error rates
- **Reliability**: Success rates, failure rates, availability
- **Usage**: API usage, data volumes, user patterns
- **Cost**: Integration costs, data transfer costs

### Alerting
- **Performance**: Slow response times, high error rates
- **Reliability**: Integration failures, service unavailability
- **Security**: Authentication failures, unauthorized access
- **Compliance**: Data residency violations, audit failures

## 15) Alternatives Considered

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| **Point-to-Point** | Simple, direct | Scalability issues, maintenance overhead | ❌ |
| **ESB Only** | Centralized, standardized | Single point of failure, vendor lock-in | ❌ |
| **API Gateway Only** | Simple, REST-focused | Limited protocol support, no event handling | ❌ |
| **Comprehensive Architecture** | Complete coverage, flexible, scalable | Complex architecture, requires expertise | ✅ **Chosen** |

## 16) Implementation Phases

### Phase 1: Foundation (Week 1-4)
- [ ] Deploy API gateway and basic connectors
- [ ] Implement DHA eClaimLink integration
- [ ] Set up basic monitoring and logging
- [ ] Configure security and authentication

### Phase 2: Government Integration (Week 5-8)
- [ ] Implement DOH Shafafiya integration
- [ ] Deploy MOHAP connector
- [ ] Set up Emirates ID integration
- [ ] Configure compliance monitoring

### Phase 3: Healthcare Standards (Week 9-12)
- [ ] Implement FHIR R4 integration
- [ ] Deploy HL7 v2 connectors
- [ ] Set up DICOM integration
- [ ] Configure IHE profiles

### Phase 4: Clearinghouse Integration (Week 13-16)
- [ ] Implement multi-clearinghouse support
- [ ] Deploy clearinghouse abstraction layer
- [ ] Set up batch processing
- [ ] Configure error handling and retry

### Phase 5: Advanced Features (Week 17-20)
- [ ] Implement event-driven integration
- [ ] Deploy data transformation engine
- [ ] Set up advanced monitoring
- [ ] Configure compliance validation

## 17) Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Integration Failures** | High | Circuit breakers, retry logic, monitoring |
| **Compliance Violations** | High | Automated compliance validation, audit trails |
| **Performance Issues** | Medium | Caching, optimization, load balancing |
| **Security Breaches** | High | Encryption, authentication, monitoring |

## 18) Cost Considerations

- **Infrastructure**: API gateway, message bus, monitoring tools
- **Licensing**: Commercial integration tools and connectors
- **Personnel**: Integration engineers, compliance specialists
- **Compliance**: Audit and compliance costs

## 19) Triggers to Revisit

- **New Standards**: New healthcare standards or protocols
- **Regulatory Changes**: New UAE healthcare regulations
- **Technology Changes**: New integration technologies
- **Performance Issues**: Integration performance problems

## 20) Acceptance Criteria

- [ ] API gateway deployed and operational
- [ ] DHA eClaimLink integration implemented and tested
- [ ] DOH Shafafiya integration deployed and validated
- [ ] FHIR R4 integration operational and tested
- [ ] Multi-clearinghouse support implemented
- [ ] Event-driven integration architecture deployed
- [ ] Security and compliance controls implemented
- [ ] Monitoring and alerting configured
- [ ] Performance and reliability requirements satisfied

## 21) Related Documentation

- [UAE Integrations](../07-Integrations-UAE.md) - Detailed integration specifications
- [Security & Compliance ADR](./ADR-0007-security-compliance.md) - Security framework
- [Language Split ADR](./ADR-0001-language-split.md) - Integration service implementation
- [Deployment & Infrastructure ADR](./ADR-0008-deployment-infrastructure.md) - Infrastructure deployment
