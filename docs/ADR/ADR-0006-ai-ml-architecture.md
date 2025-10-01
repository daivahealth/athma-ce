# ADR-0006: AI/ML Architecture — Hybrid Cloud and On-Premises Model Serving

- **Status**: Accepted
- **Date**: 2025-10-01
- **Owners**: Architecture Team, AI/ML Team
- **Related**: ADR-0001 (Language Split), ADR-0003 (Multi-Tenancy)
- **Context**: Healthcare AI requires privacy-preserving, explainable, and auditable model serving

## 1) Decision

Implement a **hybrid AI/ML architecture** with:

- **Cloud-hosted models** for non-sensitive tasks (scheduling, analytics)
- **On-premises/VPC models** for PHI-sensitive tasks (clinical notes, coding)
- **Human-in-the-loop validation** for all clinical AI outputs
- **Shadow mode deployment** for model evaluation
- **A/B testing framework** for model comparison
- **Comprehensive audit trails** for all AI decisions

## 2) Drivers

- **Healthcare Privacy**: PHI must remain in secure environments
- **Regulatory Compliance**: UAE PDPL, HIPAA require data residency controls
- **Model Explainability**: Clinical decisions must be auditable
- **Performance Requirements**: Real-time inference for clinical workflows
- **Cost Optimization**: Balance cloud costs with privacy requirements

## 3) Scope

Applies to all AI services including:
- **Clinical AI**: Note generation, coding assistance, clinical decision support
- **Operational AI**: Scheduling optimization, no-show prediction, resource utilization
- **Financial AI**: Denial prediction, underpayment detection, charge optimization
- **Document AI**: OCR, EOB parsing, form extraction
- **Patient AI**: Chatbots, symptom checking, appointment scheduling

## 4) Non-Goals

- Not implementing real-time model training in production
- Not supporting edge deployment initially
- Not covering model versioning and MLOps (future ADR)

## 5) Architecture Overview

### Model Serving Strategy

| AI Service | Deployment | Model Type | Data Sensitivity | Reasoning |
|------------|------------|------------|------------------|-----------|
| **Clinical Notes** | On-premises/VPC | LLM (GPT-4/Claude) | High (PHI) | PHI must stay in secure environment |
| **Medical Coding** | On-premises/VPC | LLM + Classical ML | High (PHI) | Coding decisions affect billing |
| **Scheduling AI** | Cloud | Classical ML | Low (anonymized) | No PHI, performance critical |
| **Denial Prediction** | Cloud | Classical ML | Medium (anonymized) | Patterns, not individual data |
| **Document OCR** | On-premises/VPC | Computer Vision | High (PHI) | Documents contain PHI |
| **Patient Chatbot** | Cloud | LLM | Medium (anonymized) | Patient-facing, no clinical decisions |

### Infrastructure Components

```yaml
# AI Service Architecture
ai-services:
  clinical-ai:
    deployment: on-premises-vpc
    models: [gpt-4, claude-3, local-fine-tuned]
    data: phi-sensitive
    validation: human-in-loop
    
  operational-ai:
    deployment: cloud
    models: [scikit-learn, xgboost, prophet]
    data: anonymized
    validation: automated
    
  document-ai:
    deployment: on-premises-vpc
    models: [tesseract, custom-cv, layoutlm]
    data: phi-sensitive
    validation: human-review
```

## 6) Model Types and Technologies

### Large Language Models (LLMs)
- **Primary**: GPT-4, Claude-3 for clinical note generation
- **Fallback**: Local fine-tuned models for offline capability
- **Specialized**: Medical coding models (ICD-10, CPT)
- **Multilingual**: Arabic-English models for UAE compliance

### Classical ML Models
- **Scheduling**: Time series forecasting, optimization algorithms
- **Predictive**: Denial risk, no-show prediction, resource utilization
- **Anomaly Detection**: Unusual billing patterns, outlier detection
- **Clustering**: Patient segmentation, provider performance

### Computer Vision Models
- **OCR**: Document text extraction (EOB, prescriptions, forms)
- **Layout Analysis**: Document structure understanding
- **Handwriting Recognition**: Provider notes, patient forms
- **Image Classification**: Medical imaging (future expansion)

## 7) Data Privacy and Security

### PHI Handling
- **Data Minimization**: Only necessary data sent to models
- **PII Masking**: Automatic redaction before model inference
- **Encryption**: Data encrypted in transit and at rest
- **Access Controls**: RBAC for AI service access
- **Audit Logging**: All AI operations logged

### Data Residency
- **UAE Region**: All PHI processed in UAE data centers
- **On-Premises**: Critical clinical AI in tenant-controlled environments
- **Cloud Isolation**: VPC with strict egress controls
- **Data Sovereignty**: Compliance with UAE data residency laws

### Privacy-Preserving Techniques
- **Differential Privacy**: Statistical noise for analytics
- **Federated Learning**: Model training without data sharing
- **Homomorphic Encryption**: Computation on encrypted data
- **Secure Multi-Party Computation**: Collaborative analysis

## 8) Human-in-the-Loop (HITL) Framework

### Clinical AI Validation
- **Note Generation**: Provider review and edit before finalization
- **Medical Coding**: Coding suggestions require approval
- **Clinical Decision Support**: Recommendations with confidence scores
- **Prescription AI**: Drug interaction checks with provider override

### Validation Workflows
```typescript
interface HITLWorkflow {
  aiSuggestion: AISuggestion;
  confidenceScore: number;
  validationRequired: boolean;
  reviewerRole: string;
  timeLimit: number; // hours
  escalationPath: string[];
}
```

### Quality Assurance
- **Confidence Thresholds**: Auto-approve high-confidence suggestions
- **Expert Review**: Low-confidence suggestions require human review
- **Feedback Loop**: Provider feedback improves model performance
- **Audit Trail**: All AI decisions and human overrides logged

## 9) Model Evaluation and Monitoring

### Shadow Mode Deployment
- **Parallel Processing**: Run new models alongside existing ones
- **Performance Comparison**: Compare accuracy, latency, cost
- **Gradual Rollout**: Progressive traffic shifting
- **Rollback Capability**: Quick revert to previous model

### A/B Testing Framework
- **Traffic Splitting**: Percentage-based model routing
- **Metrics Tracking**: Accuracy, latency, user satisfaction
- **Statistical Significance**: Proper test design and analysis
- **Business Impact**: Revenue, efficiency, quality metrics

### Model Monitoring
- **Performance Metrics**: Accuracy, precision, recall, F1-score
- **Drift Detection**: Data distribution changes over time
- **Bias Monitoring**: Fairness across patient demographics
- **Alerting**: Performance degradation notifications

## 10) API Design

### AI Service APIs
```typescript
// Clinical Note Generation
POST /api/v1/ai/clinical-notes/generate
{
  "encounter_id": "uuid",
  "voice_input": "base64_audio",
  "template_preferences": {},
  "language": "en|ar"
}

// Medical Coding Assistance
POST /api/v1/ai/coding/suggest
{
  "encounter_id": "uuid",
  "diagnosis_text": "string",
  "procedure_text": "string",
  "specialty": "string"
}

// Scheduling Optimization
POST /api/v1/ai/scheduling/optimize
{
  "facility_id": "uuid",
  "date_range": "date_range",
  "constraints": {},
  "objectives": ["minimize_wait_time", "maximize_utilization"]
}
```

### Response Format
```typescript
interface AIResponse<T> {
  suggestion: T;
  confidence: number;
  explanation: string;
  alternatives: T[];
  requiresReview: boolean;
  metadata: {
    model_version: string;
    processing_time: number;
    tokens_used: number;
  };
}
```

## 11) Alternatives Considered

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| **Cloud-Only** | Simple, scalable, cost-effective | PHI privacy concerns, data residency issues | ❌ |
| **On-Premises-Only** | Maximum privacy, full control | High cost, complex maintenance, limited scalability | ❌ |
| **Hybrid Architecture** | Privacy + scalability, compliance, cost optimization | Complex architecture, dual maintenance | ✅ **Chosen** |

## 12) Implementation Phases

### Phase 1: Foundation (Week 1-4)
- [ ] Set up on-premises model serving infrastructure
- [ ] Implement cloud AI service endpoints
- [ ] Create model deployment pipeline
- [ ] Establish monitoring and logging

### Phase 2: Clinical AI (Week 5-8)
- [ ] Deploy clinical note generation service
- [ ] Implement medical coding assistance
- [ ] Add HITL validation workflows
- [ ] Create provider feedback mechanisms

### Phase 3: Operational AI (Week 9-12)
- [ ] Deploy scheduling optimization
- [ ] Implement denial prediction models
- [ ] Add resource utilization analytics
- [ ] Create operational dashboards

### Phase 4: Document AI (Week 13-16)
- [ ] Deploy OCR and document processing
- [ ] Implement EOB parsing
- [ ] Add form extraction capabilities
- [ ] Create document workflow automation

### Phase 5: Advanced Features (Week 17-20)
- [ ] Implement A/B testing framework
- [ ] Add shadow mode deployment
- [ ] Create model performance monitoring
- [ ] Implement bias detection and mitigation

## 13) Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Model Accuracy** | High | HITL validation, confidence thresholds, expert review |
| **Privacy Breach** | High | On-premises deployment, encryption, access controls |
| **Performance Issues** | Medium | Caching, optimization, fallback models |
| **Cost Overrun** | Medium | Hybrid approach, usage monitoring, cost controls |

## 14) Monitoring & Observability

### Metrics
- **Model Performance**: Accuracy, latency, throughput
- **Usage Patterns**: API calls, model popularity, error rates
- **Cost Metrics**: Compute costs, API usage, storage costs
- **Quality Metrics**: Provider satisfaction, error rates, feedback scores

### Alerts
- **Performance Degradation**: Accuracy drops, latency increases
- **Privacy Violations**: Unauthorized access, data leaks
- **Cost Thresholds**: Usage exceeding budget limits
- **Model Drift**: Data distribution changes

## 15) Compliance Features

### UAE PDPL Compliance
- **Data Minimization**: Only necessary data for AI processing
- **Purpose Limitation**: AI used only for stated purposes
- **Consent Management**: Patient consent for AI processing
- **Data Residency**: AI processing in UAE regions

### HIPAA Compliance
- **Administrative Safeguards**: AI access controls and training
- **Physical Safeguards**: Secure AI infrastructure
- **Technical Safeguards**: Encryption, audit logs, access controls
- **Business Associate Agreements**: AI service provider contracts

### Clinical Validation
- **FDA Guidelines**: Medical device software compliance
- **Clinical Evidence**: Model validation studies
- **Risk Management**: Clinical risk assessment and mitigation
- **Quality Assurance**: Clinical quality metrics and monitoring

## 16) Cost Considerations

- **Infrastructure**: On-premises hardware + cloud compute
- **Model Licensing**: LLM API costs, model training costs
- **Storage**: Model artifacts, training data, inference logs
- **Personnel**: AI/ML engineers, clinical validators, compliance experts

## 17) Triggers to Revisit

- **New Privacy Regulations**: Additional compliance requirements
- **Model Performance Issues**: Accuracy or performance degradation
- **Cost Optimization**: Significant cost increases or budget constraints
- **Technology Advances**: New AI/ML technologies or deployment patterns

## 18) Acceptance Criteria

- [ ] On-premises model serving infrastructure operational
- [ ] Cloud AI services deployed and tested
- [ ] HITL validation workflows implemented
- [ ] Model monitoring and alerting configured
- [ ] Privacy and security controls validated
- [ ] Performance benchmarks met
- [ ] Compliance requirements satisfied
- [ ] Cost projections within budget

## 19) Related Documentation

- [AI Design](../06-AI-Design.md) - Detailed AI service specifications
- [Security & Compliance](../08-Security-&-Compliance.md) - Privacy and security framework
- [Data Model](../05-Data-Model.md) - AI-related database schemas
- [Multi-Tenancy ADR](./ADR-0003-multitenancy.md) - Tenant isolation for AI services
