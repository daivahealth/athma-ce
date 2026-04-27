# Agent Architecture & Design Playbook

## Purpose & Scope
This document defines how AI agents are designed, deployed, and governed inside the athma-ce PMS/RCM platform. It translates platform architecture (docs/02-Architecture-Diagram.md) and AI strategy (docs/06-AI-Design.md) into concrete patterns so every new agent is:
- Tenant-aware and compliant with ADR-0003 (multi-tenancy via PostgreSQL RLS)
- Implemented in Python services per ADR-0001 while interoperating with Node.js transactional APIs via ADR-0002 contracts
- Deployed according to the hybrid AI model in ADR-0006 with human-in-the-loop safeguards

## Guiding Principles
- **Patient safety first**: clinical outputs remain suggestions until a licensed reviewer approves them (see docs/06-AI-Design.md HITL flows).
- **Data minimization**: only send the minimum required PHI/PII to an agent; mask or tokenize where possible (docs/08-Security-&-Compliance.md).
- **Deterministic shells, stochastic cores**: orchestrators run deterministic control logic; LLM calls remain side-effect free until explicitly committed via transactional services.
- **Contracts everywhere**: inputs/outputs use shared OpenAPI/Pydantic models; agents publish async events defined in ADR-0002.
- **Multi-tenancy by default**: every agent request carries `tenant_id`, `locale`, and `user_context`; enforcement happens in the orchestration layer before tool calls.
- **Observability baked in**: emit metrics/traces per docs/09-Observability-&-SRE.md (`zeal_ai_prediction_duration_seconds`, `zeal_ai_prediction_accuracy`).

## Agent Topology
Agents run inside dedicated Python/FastAPI services fronted by the AI gateway. Common components:
- **Agent Orchestrator**: validates input, fetches context, routes to specialized workers, applies guardrails.
- **Tooling Layer**: typed adapters for transactional APIs (`pms-core`, `billing-service`, `rules-engine`), vector search, document retrieval, and third-party connectors.
- **Policy Engine**: checks RBAC scopes (docs/20-RBAC-Access-Control.md) and compliance policies before executing tool calls.
- **Audit Sink**: writes immutable trails to the AI audit tables (see docs/05-Data-Model.md `ai_interactions` schemas) and S3 archive.

### Primary Agents
| Agent | Domain | Core Skills | Key Tools | Deployment Tier |
|-------|--------|-------------|-----------|-----------------|
| Clinical Scribe Agent | Encounter documentation | SOAP drafting, checklist validation | EHR context loader, terminology service, provider feedback loop | On-prem/VPC (PHI) |
| Coding Companion Agent | Revenue cycle | ICD/CPT suggestion, modifier reasoning | Coding rules engine, fee schedule lookup, denial rules | On-prem/VPC (PHI) |
| Scheduler Agent | Operations | Demand forecasting, slot negotiation | Scheduling API, resource calendar, no-show model | Cloud |
| Anomaly Sentinel Agent | Financial integrity | Denial risk scoring, underpayment alerts | Claims event stream, payment ledger analyzer | Cloud (anonymized) |
| Document Intake Agent | Document AI | OCR, entity extraction, reconciliation hints | OCR pipeline, templates repo, payment posting API | On-prem/VPC (PHI) |
| Patient Concierge Agent | Patient engagement | Appointment triage, FAQ, reminders | Patient portal APIs, language router, compliance guardrails | Cloud (de-identified) |

Each agent exposes REST endpoints (`POST /v1/agents/{agent_id}/run`) plus async triggers via Kafka/RabbitMQ topics (e.g., `note.draft.requested`, `claim.review.flagged`).

## Lifecycle & Interaction Flow
1. **Ingestion**: API gateway authenticates caller, injects `tenant_id`, device/user metadata, and forwards to the AI gateway with OIDC service token.
2. **Context Assembly**:
   - Fetch structured data through read-only contracts (`/patients/{id}`, `/encounters/{id}`) from Node services.
   - Retrieve unstructured artifacts (documents, transcripts) from object storage using signed URLs.
   - Pull embeddings from the vector store partitioned by `tenant_id` and language (Arabic/English) per ADR-0006 multilingual requirement.
3. **Planning**: Orchestrator formulates agent plan (tools, prompts, guardrail checks). Plans are persisted for replay/debug.
4. **Execution Loop**:
   - Issue LLM/tool calls with deterministic retries, circuit breakers, and latency budgets (<2s P95 per docs/01-Context.md NFRs).
   - For long-running flows (OCR, claim audit) emit async tasks to workers via the queue.
5. **Validation & Guardrails**:
   - Static validators (schema, clinical terminology) run before LLM outputs are returned.
   - Human review gating: outputs marked `requires_review=true` are pushed to the appropriate workflow inbox (`note.review.queue`, `coding.review.queue`).
6. **Response & Logging**: Return structured payload with confidence, rationale, and recommended next actions. Log full trace (inputs hashed, PHI redacted) plus metrics.

## Tooling & Knowledge Integration
- **Contracts Package**: Reuse generated Pydantic models from the shared `@contracts` repo; never hardcode DTOs.
- **Knowledge Sources**:
  - Structured: Postgres read replicas with RLS, cached via Redis.
  - Unstructured: Tenant-specific document stores with metadata tags (`tenant_id`, `locale`, `sensitivity_level`).
  - External: DHA/DOH connectors mediated via existing Node services; agents must not call third-party APIs directly.
- **Function Calling / Tools**:
  - Wrap tools with explicit ACLs; define max concurrency per tenant to avoid noisy neighbors (ADR-0003 §7).
  - Provide deterministic stubs for unit tests and shadow deployments.

## Deployment & Runtime Standards
- **Service Layout**: Each agent service ships with Helm charts aligning to docs/10-Deployment-&-Ops.md; sidecars include Istio proxy, OpenTelemetry collector, and secrets injection (Vault).
- **Environment Classes**:
  - `prod-secure`: on-prem or VPC enclave for PHI-sensitive agents; no outbound internet, GPU pools optional.
  - `prod-cloud`: managed Kubernetes cluster for low-sensitivity agents; leverages cloud-managed inference endpoints.
  - `shadow` and `staging`: mirror production topology, fed by anonymized replay traffic.
- **Feature Flags**: Use LaunchDarkly (or equivalent) to gate agent capabilities by tenant, locale, and role.

## Safety, Compliance & Governance
- Enforce RBAC scopes before executing any tool; deny if caller lacks `ai:{agent}:{action}` permission set.
- Apply PDPL data handling checks: consent status verification, purpose limitation tags, and automatic redaction before storing prompts/responses.
- Maintain full auditability: capture `trace_id`, `tenant_id`, `agent_id`, `model_version`, `tool_calls[]`, reviewer actions. Follow ADR-0006 audit trails and docs/05-Data-Model.md tables (`ai_audit_events`).
- Bias & fairness: monitor outputs for language bias (Arabic vs English), clinical disparities; corrective actions logged for compliance.

## Observability & Quality Management
- Metrics: latency histogram, accuracy gauge, suggestion acceptance rate, override ratio, review turnaround time. Emit labelled by `agent_id`, `tenant_id`, `locale`.
- Tracing: propagate `traceparent` through API → orchestrator → tool adapters → queues (docs/09-Observability-&-SRE.md).
- Logging: structured JSON with PHI redaction, severity-based sampling, and linkage to audit events.
- Evaluation loops: maintain regression test suites with golden transcripts; schedule nightly eval jobs comparing agent outputs to ground truth.
- Incident response: wire alerts (HighErrorRate, HighLatency) to on-call rotation; define runbooks in ops repository.

## Development Workflow
- **Languages & Frameworks**: Python 3.11+, FastAPI, Pydantic v2, SQLAlchemy for read-only data, LangChain/LlamaIndex (optional) with vendor-neutral abstractions.
- **Testing**: contract tests against mock OpenAPI servers, deterministic unit tests for tool wrappers, replay harness for scenario testing, bias evaluations.
- **CI/CD**: GitHub Actions pipelines with lint/mypy, pytest, model packaging, vulnerability scans (Trivy) and SBOM generation.
- **Shadow Mode**: every net-new agent ships in observe-only mode for two sprints before enabling assistive features; collect human feedback scores.
- **Documentation**: update agent-specific ADRs if decisions deviate; maintain prompt/version history in the AI service repository.

## Implementation Roadmap
1. Stand up shared agent runtime (context loader, policy engine, audit logging).
2. Migrate existing AI services (note, coding, document) onto runtime with minimal surface change.
3. Introduce orchestrated flows between agents (e.g., Scribe → Coding → Claim review) via event choreography.
4. Launch operational agents (Scheduler, Anomaly) with anonymized datasets in cloud tier.
5. Expand to patient-facing concierge with bilingual prompts, sentiment guardrails, and escalation paths.
6. Establish continuous improvement loop: feedback ingestion, model retraining, ADR updates.

## References
- docs/01-Context.md — business scope & NFRs
- docs/02-Architecture-Diagram.md — system & container views
- docs/05-Data-Model.md — AI audit schemas
- docs/06-AI-Design.md — detailed AI service specs
- docs/08-Security-&-Compliance.md — privacy & security controls
- docs/09-Observability-&-SRE.md — metrics & alerting
- docs/ADR/ADR-0001-language-split.md — language/runtime strategy
- docs/ADR/ADR-0002-comms.md — communication patterns
- docs/ADR/ADR-0003-multitenancy.md — tenant model
- docs/ADR/ADR-0006-ai-ml-architecture.md — hybrid AI deployment
