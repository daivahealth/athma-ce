# API Interfaces

## OpenAPI Specification Overview

This document outlines the OpenAPI 3.0 specifications for all major service endpoints in the athma-ce PMS/RCM platform. All APIs follow RESTful principles with consistent patterns for authentication, error handling, and response formats.

## Common API Patterns

### Authentication
All APIs use Bearer token authentication with JWT tokens:
```yaml
security:
  - bearerAuth: []
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
```

### Error Response Format
```yaml
ErrorResponse:
  type: object
  properties:
    error:
      type: object
      properties:
        code:
          type: string
        message:
          type: string
        details:
          type: object
        timestamp:
          type: string
          format: date-time
        requestId:
          type: string
```

### Pagination
```yaml
PaginationParams:
  type: object
  properties:
    page:
      type: integer
      minimum: 1
      default: 1
    limit:
      type: integer
      minimum: 1
      maximum: 100
      default: 20
    sort:
      type: string
    order:
      type: string
      enum: [asc, desc]
      default: asc

PaginationResponse:
  type: object
  properties:
    data:
      type: array
    pagination:
      type: object
      properties:
        page:
          type: integer
        limit:
          type: integer
        total:
          type: integer
        pages:
          type: integer
```

## PMS Core Service APIs

### Patient Management

```yaml
paths:
  /api/v1/patients:
    get:
      summary: List patients
      parameters:
        - $ref: '#/components/parameters/PaginationParams'
        - name: search
          in: query
          schema:
            type: string
        - name: status
          in: query
          schema:
            type: string
            enum: [active, inactive, archived]
      responses:
        '200':
          description: List of patients
          content:
            application/json:
              schema:
                allOf:
                  - $ref: '#/components/schemas/PaginationResponse'
                  - type: object
                    properties:
                      data:
                        type: array
                        items:
                          $ref: '#/components/schemas/Patient'
    
    post:
      summary: Create patient
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreatePatientRequest'
      responses:
        '201':
          description: Patient created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Patient'
        '400':
          description: Validation error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'

  /api/v1/patients/{patientId}:
    get:
      summary: Get patient by ID
      parameters:
        - name: patientId
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '200':
          description: Patient details
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Patient'
        '404':
          description: Patient not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
    
    put:
      summary: Update patient
      parameters:
        - name: patientId
          in: path
          required: true
          schema:
            type: string
            format: uuid
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UpdatePatientRequest'
      responses:
        '200':
          description: Patient updated
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Patient'

components:
  schemas:
    Patient:
      type: object
      properties:
        id:
          type: string
          format: uuid
        tenantId:
          type: string
          format: uuid
        emiratesId:
          type: string
        firstName:
          type: string
        lastName:
          type: string
        dateOfBirth:
          type: string
          format: date
        gender:
          type: string
          enum: [male, female, other]
        phone:
          type: string
        email:
          type: string
          format: email
        address:
          type: string
        city:
          type: string
        emirate:
          type: string
        postalCode:
          type: string
        emergencyContact:
          type: string
        demographics:
          type: object
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time
    
    CreatePatientRequest:
      type: object
      required: [firstName, lastName, dateOfBirth, gender]
      properties:
        emiratesId:
          type: string
        firstName:
          type: string
        lastName:
          type: string
        dateOfBirth:
          type: string
          format: date
        gender:
          type: string
          enum: [male, female, other]
        phone:
          type: string
        email:
          type: string
          format: email
        address:
          type: string
        city:
          type: string
        emirate:
          type: string
        postalCode:
          type: string
        emergencyContact:
          type: string
        demographics:
          type: object
```

### Appointment Management

```yaml
paths:
  /api/v1/appointments:
    get:
      summary: List appointments
      parameters:
        - $ref: '#/components/parameters/PaginationParams'
        - name: patientId
          in: query
          schema:
            type: string
            format: uuid
        - name: providerId
          in: query
          schema:
            type: string
            format: uuid
        - name: startDate
          in: query
          schema:
            type: string
            format: date
        - name: endDate
          in: query
          schema:
            type: string
            format: date
        - name: status
          in: query
          schema:
            type: string
            enum: [scheduled, confirmed, in_progress, completed, cancelled, no_show]
      responses:
        '200':
          description: List of appointments
          content:
            application/json:
              schema:
                allOf:
                  - $ref: '#/components/schemas/PaginationResponse'
                  - type: object
                    properties:
                      data:
                        type: array
                        items:
                          $ref: '#/components/schemas/Appointment'
    
    post:
      summary: Create appointment
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateAppointmentRequest'
      responses:
        '201':
          description: Appointment created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Appointment'

  /api/v1/appointments/{appointmentId}:
    get:
      summary: Get appointment by ID
      parameters:
        - name: appointmentId
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '200':
          description: Appointment details
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Appointment'
    
    put:
      summary: Update appointment
      parameters:
        - name: appointmentId
          in: path
          required: true
          schema:
            type: string
            format: uuid
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UpdateAppointmentRequest'
      responses:
        '200':
          description: Appointment updated
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Appointment'

components:
  schemas:
    Appointment:
      type: object
      properties:
        id:
          type: string
          format: uuid
        tenantId:
          type: string
          format: uuid
        patientId:
          type: string
          format: uuid
        providerId:
          type: string
          format: uuid
        roomId:
          type: string
          format: uuid
        scheduledAt:
          type: string
          format: date-time
        durationMinutes:
          type: integer
        appointmentType:
          type: string
        status:
          type: string
          enum: [scheduled, confirmed, in_progress, completed, cancelled, no_show]
        reason:
          type: string
        notes:
          type: string
        metadata:
          type: object
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time
    
    CreateAppointmentRequest:
      type: object
      required: [patientId, providerId, scheduledAt, durationMinutes]
      properties:
        patientId:
          type: string
          format: uuid
        providerId:
          type: string
          format: uuid
        roomId:
          type: string
          format: uuid
        scheduledAt:
          type: string
          format: date-time
        durationMinutes:
          type: integer
        appointmentType:
          type: string
        reason:
          type: string
        notes:
          type: string
        metadata:
          type: object
```

### Encounter Management

```yaml
paths:
  /api/v1/encounters:
    get:
      summary: List encounters
      parameters:
        - $ref: '#/components/parameters/PaginationParams'
        - name: patientId
          in: query
          schema:
            type: string
            format: uuid
        - name: providerId
          in: query
          schema:
            type: string
            format: uuid
        - name: startDate
          in: query
          schema:
            type: string
            format: date
        - name: endDate
          in: query
          schema:
            type: string
            format: date
      responses:
        '200':
          description: List of encounters
          content:
            application/json:
              schema:
                allOf:
                  - $ref: '#/components/schemas/PaginationResponse'
                  - type: object
                    properties:
                      data:
                        type: array
                        items:
                          $ref: '#/components/schemas/Encounter'
    
    post:
      summary: Create encounter
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateEncounterRequest'
      responses:
        '201':
          description: Encounter created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Encounter'

  /api/v1/encounters/{encounterId}/notes:
    post:
      summary: Add clinical note
      parameters:
        - name: encounterId
          in: path
          required: true
          schema:
            type: string
            format: uuid
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateClinicalNoteRequest'
      responses:
        '201':
          description: Clinical note created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ClinicalNote'

components:
  schemas:
    Encounter:
      type: object
      properties:
        id:
          type: string
          format: uuid
        appointmentId:
          type: string
          format: uuid
        patientId:
          type: string
          format: uuid
        providerId:
          type: string
          format: uuid
        startTime:
          type: string
          format: date-time
        endTime:
          type: string
          format: date-time
        encounterType:
          type: string
        status:
          type: string
          enum: [in_progress, completed, cancelled]
        chiefComplaint:
          type: string
        assessment:
          type: string
        plan:
          type: string
        vitalSigns:
          type: object
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time
    
    ClinicalNote:
      type: object
      properties:
        id:
          type: string
          format: uuid
        encounterId:
          type: string
          format: uuid
        noteType:
          type: string
        section:
          type: string
          enum: [subjective, objective, assessment, plan]
        content:
          type: string
        status:
          type: string
          enum: [draft, final, signed]
        createdBy:
          type: string
          format: uuid
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time
```

## Billing Service APIs

### Superbill Management

```yaml
paths:
  /api/v1/superbills:
    get:
      summary: List superbills
      parameters:
        - $ref: '#/components/parameters/PaginationParams'
        - name: patientId
          in: query
          schema:
            type: string
            format: uuid
        - name: providerId
          in: query
          schema:
            type: string
            format: uuid
        - name: status
          in: query
          schema:
            type: string
            enum: [draft, generated, submitted, paid]
      responses:
        '200':
          description: List of superbills
          content:
            application/json:
              schema:
                allOf:
                  - $ref: '#/components/schemas/PaginationResponse'
                  - type: object
                    properties:
                      data:
                        type: array
                        items:
                          $ref: '#/components/schemas/Superbill'
    
    post:
      summary: Generate superbill from encounter
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/GenerateSuperbillRequest'
      responses:
        '201':
          description: Superbill generated
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Superbill'

  /api/v1/superbills/{superbillId}/charges:
    get:
      summary: List charges for superbill
      parameters:
        - name: superbillId
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '200':
          description: List of charges
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Charge'

components:
  schemas:
    Superbill:
      type: object
      properties:
        id:
          type: string
          format: uuid
        encounterId:
          type: string
          format: uuid
        patientId:
          type: string
          format: uuid
        providerId:
          type: string
          format: uuid
        status:
          type: string
          enum: [draft, generated, submitted, paid]
        totalAmount:
          type: number
          format: decimal
        charges:
          type: array
          items:
            $ref: '#/components/schemas/Charge'
        generatedAt:
          type: string
          format: date-time
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time
    
    Charge:
      type: object
      properties:
        id:
          type: string
          format: uuid
        superbillId:
          type: string
          format: uuid
        procedureCode:
          type: string
        diagnosisCodes:
          type: array
          items:
            type: string
        quantity:
          type: number
          format: decimal
        unitPrice:
          type: number
          format: decimal
        totalAmount:
          type: number
          format: decimal
        status:
          type: string
          enum: [pending, validated, rejected]
        modifiers:
          type: array
          items:
            type: string
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time
```

## RCM Service APIs

### Eligibility Verification

```yaml
paths:
  /api/v1/eligibility/verify:
    post:
      summary: Verify patient eligibility
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/EligibilityVerificationRequest'
      responses:
        '200':
          description: Eligibility verification result
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/EligibilityVerificationResponse'
        '400':
          description: Validation error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'

components:
  schemas:
    EligibilityVerificationRequest:
      type: object
      required: [patientId, policyId, serviceDate]
      properties:
        patientId:
          type: string
          format: uuid
        policyId:
          type: string
          format: uuid
        serviceDate:
          type: string
          format: date
        procedureCodes:
          type: array
          items:
            type: string
    
    EligibilityVerificationResponse:
      type: object
      properties:
        isEligible:
          type: boolean
        effectiveDate:
          type: string
          format: date
        expirationDate:
          type: string
          format: date
        benefits:
          type: object
        copay:
          type: number
          format: decimal
        deductible:
          type: number
          format: decimal
        coinsurance:
          type: number
          format: decimal
        verificationDate:
          type: string
          format: date-time
```

### Prior Authorization

```yaml
paths:
  /api/v1/prior-auth:
    post:
      summary: Submit prior authorization request
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/PriorAuthRequest'
      responses:
        '201':
          description: Prior authorization submitted
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PriorAuthResponse'
        '400':
          description: Validation error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'

  /api/v1/prior-auth/{priorAuthId}/status:
    get:
      summary: Get prior authorization status
      parameters:
        - name: priorAuthId
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '200':
          description: Prior authorization status
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PriorAuthStatus'

components:
  schemas:
    PriorAuthRequest:
      type: object
      required: [patientId, providerId, procedureCodes, diagnosisCodes, serviceDate]
      properties:
        patientId:
          type: string
          format: uuid
        providerId:
          type: string
          format: uuid
        procedureCodes:
          type: array
          items:
            type: string
        diagnosisCodes:
          type: array
          items:
            type: string
        serviceDate:
          type: string
          format: date
        clinicalNotes:
          type: string
        attachments:
          type: array
          items:
            type: string
            format: uuid
    
    PriorAuthResponse:
      type: object
      properties:
        priorAuthId:
          type: string
          format: uuid
        status:
          type: string
          enum: [submitted, under_review, approved, denied, expired]
        submittedAt:
          type: string
          format: date-time
        expectedResponseDate:
          type: string
          format: date-time
        referenceNumber:
          type: string
```

### Claims Processing

```yaml
paths:
  /api/v1/claims/validate:
    post:
      summary: Validate claim before submission
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ClaimValidationRequest'
      responses:
        '200':
          description: Claim validation result
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ClaimValidationResponse'

  /api/v1/claims/submit:
    post:
      summary: Submit claim to payer
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ClaimSubmissionRequest'
      responses:
        '201':
          description: Claim submitted
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ClaimSubmissionResponse'

  /api/v1/claims/{claimId}/status:
    get:
      summary: Get claim status
      parameters:
        - name: claimId
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '200':
          description: Claim status
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ClaimStatus'

components:
  schemas:
    ClaimValidationRequest:
      type: object
      required: [superbillId, payerId]
      properties:
        superbillId:
          type: string
          format: uuid
        payerId:
          type: string
          format: uuid
        serviceDate:
          type: string
          format: date
    
    ClaimValidationResponse:
      type: object
      properties:
        isValid:
          type: boolean
        findings:
          type: array
          items:
            $ref: '#/components/schemas/ValidationFinding'
        warnings:
          type: array
          items:
            $ref: '#/components/schemas/ValidationFinding'
        errors:
          type: array
          items:
            $ref: '#/components/schemas/ValidationFinding'
    
    ValidationFinding:
      type: object
      properties:
        findingType:
          type: string
        severity:
          type: string
          enum: [info, warning, error]
        description:
          type: string
        field:
          type: string
        suggestedValue:
          type: string
```

## Remittance Service APIs

### ERA/EOB Processing

```yaml
paths:
  /api/v1/remittance/ingest:
    post:
      summary: Ingest ERA/EOB file
      requestBody:
        required: true
        content:
          multipart/form-data:
            schema:
              type: object
              properties:
                file:
                  type: string
                  format: binary
                fileType:
                  type: string
                  enum: [era_xml, eob_pdf, eob_xml]
                payerId:
                  type: string
                  format: uuid
      responses:
        '201':
          description: Remittance file ingested
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/RemittanceIngestionResponse'

  /api/v1/remittance/{remittanceId}/reconcile:
    post:
      summary: Reconcile remittance
      parameters:
        - name: remittanceId
          in: path
          required: true
          schema:
            type: string
            format: uuid
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ReconciliationRequest'
      responses:
        '200':
          description: Reconciliation completed
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ReconciliationResponse'

components:
  schemas:
    RemittanceIngestionResponse:
      type: object
      properties:
        remittanceId:
          type: string
          format: uuid
        status:
          type: string
          enum: [processing, completed, failed]
        totalAmount:
          type: number
          format: decimal
        paidAmount:
          type: number
          format: decimal
        processedAt:
          type: string
          format: date-time
        findings:
          type: array
          items:
            $ref: '#/components/schemas/ValidationFinding'
    
    ReconciliationResponse:
      type: object
      properties:
        reconciliationId:
          type: string
          format: uuid
        status:
          type: string
          enum: [completed, requires_review, failed]
        expectedAmount:
          type: number
          format: decimal
        actualAmount:
          type: number
          format: decimal
        variance:
          type: number
          format: decimal
        discrepancies:
          type: array
          items:
            $ref: '#/components/schemas/Discrepancy'
        reconciledAt:
          type: string
          format: date-time
    
    Discrepancy:
      type: object
      properties:
        claimId:
          type: string
          format: uuid
        expectedAmount:
          type: number
          format: decimal
        actualAmount:
          type: number
          format: decimal
        variance:
          type: number
          format: decimal
        reason:
          type: string
        adjustmentCode:
          type: string
```

## AI Services APIs

### AI Note Service

```yaml
paths:
  /api/v1/ai/notes/draft:
    post:
      summary: Draft clinical note using AI
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/NoteDraftRequest'
      responses:
        '200':
          description: AI-generated note draft
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/NoteDraftResponse'

components:
  schemas:
    NoteDraftRequest:
      type: object
      required: [encounterId, noteType, section]
      properties:
        encounterId:
          type: string
          format: uuid
        noteType:
          type: string
          enum: [soap, progress, discharge, consultation]
        section:
          type: string
          enum: [subjective, objective, assessment, plan]
        context:
          type: object
        template:
          type: string
    
    NoteDraftResponse:
      type: object
      properties:
        draftContent:
          type: string
        confidence:
          type: number
          format: float
          minimum: 0
          maximum: 1
        suggestions:
          type: array
          items:
            type: string
        metadata:
          type: object
```

### AI Coding Service

```yaml
paths:
  /api/v1/ai/coding/suggest:
    post:
      summary: Suggest medical codes
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CodingSuggestionRequest'
      responses:
        '200':
          description: AI coding suggestions
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CodingSuggestionResponse'

components:
  schemas:
    CodingSuggestionRequest:
      type: object
      required: [encounterId, codeType]
      properties:
        encounterId:
          type: string
          format: uuid
        codeType:
          type: string
          enum: [icd10, cpt, hcpcs]
        context:
          type: object
        existingCodes:
          type: array
          items:
            type: string
    
    CodingSuggestionResponse:
      type: object
      properties:
        suggestions:
          type: array
          items:
            $ref: '#/components/schemas/CodeSuggestion'
        confidence:
          type: number
          format: float
        rationale:
          type: string
    
    CodeSuggestion:
      type: object
      properties:
        code:
          type: string
        description:
          type: string
        confidence:
          type: number
          format: float
        rationale:
          type: string
        modifiers:
          type: array
          items:
            type: string
```

## Webhook Endpoints

### Webhook Configuration

```yaml
paths:
  /api/v1/webhooks:
    get:
      summary: List webhooks
      responses:
        '200':
          description: List of configured webhooks
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Webhook'
    
    post:
      summary: Create webhook
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateWebhookRequest'
      responses:
        '201':
          description: Webhook created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Webhook'

components:
  schemas:
    Webhook:
      type: object
      properties:
        id:
          type: string
          format: uuid
        url:
          type: string
          format: uri
        events:
          type: array
          items:
            type: string
        secret:
          type: string
        isActive:
          type: boolean
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time
```

### Webhook Events

```yaml
# Webhook payload examples
WebhookPayload:
  type: object
  properties:
    event:
      type: string
      enum: [remittance.received, claim.status.changed, appointment.scheduled, encounter.completed]
    data:
      type: object
    timestamp:
      type: string
      format: date-time
    webhookId:
      type: string
      format: uuid
```

## API Standards

### Idempotency
All POST and PUT operations support idempotency using the `Idempotency-Key` header:
```yaml
headers:
  Idempotency-Key:
    description: Unique key for idempotent operations
    schema:
      type: string
```

### Retry Semantics
- **Retry-After**: Standard HTTP header for rate limiting
- **Exponential Backoff**: Client-side retry with exponential backoff
- **Circuit Breaker**: Service-level circuit breaker pattern

### Dead Letter Queue (DLQ)
Failed webhook deliveries are queued for retry with exponential backoff:
- Initial retry: 1 minute
- Max retries: 5 attempts
- Final failure: Move to DLQ for manual intervention

### Rate Limiting
- **Per-tenant limits**: 1000 requests/minute
- **Per-user limits**: 100 requests/minute
- **Burst allowance**: 20% above limit for 1 minute
- **Headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

## HIE Integration APIs

### HIE Service Overview

The HIE Service provides APIs for integrating with UAE Health Information Exchange platforms (NABIDH, Malaffi, Riayati). All HIE operations follow FHIR R4 standards and support real-time, batch, and on-demand synchronization patterns.

### Authentication

HIE APIs use platform-specific authentication methods:

```yaml
# NABIDH - OAuth 2.0 Client Credentials
nabidh_auth:
  type: oauth2
  flows:
    clientCredentials:
      tokenUrl: https://auth.nabidh.ae/oauth2/token
      scopes:
        patient: "patient/*.read patient/*.write"
        encounter: "encounter/*.read encounter/*.write"
        observation: "observation/*.read observation/*.write"

# Malaffi - Certificate-based Authentication
malaffi_auth:
  type: apiKey
  in: header
  name: X-Client-Certificate
  description: Client certificate for mutual TLS

# Riayati - OAuth 2.0 with PKCE
riayati_auth:
  type: oauth2
  flows:
    authorizationCode:
      authorizationUrl: https://auth.riayati.ae/oauth2/authorize
      tokenUrl: https://auth.riayati.ae/oauth2/token
      scopes:
        patient: "patient/*.read patient/*.write"
        encounter: "encounter/*.read encounter/*.write"
```

### HIE Platform Management

#### List HIE Platforms
```yaml
/hie/platforms:
  get:
    summary: List available HIE platforms
    tags: [HIE]
    responses:
      '200':
        description: List of HIE platforms
        content:
          application/json:
            schema:
              type: object
              properties:
                platforms:
                  type: array
                  items:
                    $ref: '#/components/schemas/HIEPlatform'
```

#### Get HIE Platform Configuration
```yaml
/hie/platforms/{platformId}:
  get:
    summary: Get HIE platform configuration
    tags: [HIE]
    parameters:
      - name: platformId
        in: path
        required: true
        schema:
          type: string
          enum: [nabidh, malaffi, riayati]
    responses:
      '200':
        description: HIE platform configuration
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/HIEPlatform'
```

### Patient Synchronization

#### Sync Patient to HIE Platforms
```yaml
/hie/patients/{patientId}/sync:
  post:
    summary: Synchronize patient data to HIE platforms
    tags: [HIE]
    parameters:
      - name: patientId
        in: path
        required: true
        schema:
          type: string
          format: uuid
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            properties:
              platforms:
                type: array
                items:
                  type: string
                  enum: [nabidh, malaffi, riayati]
              syncType:
                type: string
                enum: [real_time, batch, on_demand]
                default: real_time
              resources:
                type: array
                items:
                  type: string
                  enum: [Patient, Encounter, Observation, DiagnosticReport]
                default: [Patient]
    responses:
      '202':
        description: Synchronization initiated
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/HIESyncResult'
```

#### Get Patient Sync Status
```yaml
/hie/patients/{patientId}/sync/status:
  get:
    summary: Get patient synchronization status
    tags: [HIE]
    parameters:
      - name: patientId
        in: path
        required: true
        schema:
          type: string
          format: uuid
      - name: platform
        in: query
        schema:
          type: string
          enum: [nabidh, malaffi, riayati]
      - name: resourceType
        in: query
        schema:
          type: string
    responses:
      '200':
        description: Synchronization status
        content:
          application/json:
            schema:
              type: object
              properties:
                patientId:
                  type: string
                  format: uuid
                syncStatus:
                  type: array
                  items:
                    $ref: '#/components/schemas/HIESyncStatus'
```

### Patient Consent Management

#### Get Patient Consents
```yaml
/hie/patients/{patientId}/consents:
  get:
    summary: Get patient HIE consents
    tags: [HIE]
    parameters:
      - name: patientId
        in: path
        required: true
        schema:
          type: string
          format: uuid
      - name: platform
        in: query
        schema:
          type: string
          enum: [nabidh, malaffi, riayati]
      - name: consentType
        in: query
        schema:
          type: string
          enum: [data_sharing, research, emergency_access]
    responses:
      '200':
        description: Patient consents
        content:
          application/json:
            schema:
              type: object
              properties:
                consents:
                  type: array
                  items:
                    $ref: '#/components/schemas/HIEPatientConsent'
```

#### Update Patient Consent
```yaml
/hie/patients/{patientId}/consents:
  put:
    summary: Update patient HIE consent
    tags: [HIE]
    parameters:
      - name: patientId
        in: path
        required: true
        schema:
          type: string
          format: uuid
    requestBody:
      required: true
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/HIEConsentUpdate'
    responses:
      '200':
        description: Consent updated
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/HIEPatientConsent'
```

### Data Query APIs

#### Query Patient Data from HIE
```yaml
/hie/patients/query:
  post:
    summary: Query patient data from HIE platforms
    tags: [HIE]
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            properties:
              emiratesId:
                type: string
                pattern: '^[0-9]{3}-[0-9]{4}-[0-9]{7}-[0-9]{1}$'
              platforms:
                type: array
                items:
                  type: string
                  enum: [nabidh, malaffi, riayati]
                default: [nabidh, malaffi, riayati]
              resources:
                type: array
                items:
                  type: string
                  enum: [Patient, Encounter, Observation, DiagnosticReport, MedicationRequest]
                default: [Patient]
              dateRange:
                type: object
                properties:
                  start:
                    type: string
                    format: date
                  end:
                    type: string
                    format: date
    responses:
      '200':
        description: Consolidated patient data
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/HIEConsolidatedPatientData'
```

#### Search Patients Across Platforms
```yaml
/hie/patients/search:
  post:
    summary: Search patients across HIE platforms
    tags: [HIE]
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            properties:
              searchCriteria:
                type: object
                properties:
                  name:
                    type: string
                  emiratesId:
                    type: string
                  dateOfBirth:
                    type: string
                    format: date
                  gender:
                    type: string
                    enum: [male, female, other, unknown]
              platforms:
                type: array
                items:
                  type: string
                  enum: [nabidh, malaffi, riayati]
    responses:
      '200':
        description: Search results
        content:
          application/json:
            schema:
              type: object
              properties:
                results:
                  type: array
                  items:
                    $ref: '#/components/schemas/HIEPatientSearchResult'
```

### Synchronization Management

#### Get Sync Logs
```yaml
/hie/sync/logs:
  get:
    summary: Get HIE synchronization logs
    tags: [HIE]
    parameters:
      - name: platform
        in: query
        schema:
          type: string
          enum: [nabidh, malaffi, riayati]
      - name: resourceType
        in: query
        schema:
          type: string
      - name: status
        in: query
        schema:
          type: string
          enum: [pending, success, failed, retry]
      - name: syncType
        in: query
        schema:
          type: string
          enum: [real_time, batch, on_demand]
      - name: startDate
        in: query
        schema:
          type: string
          format: date-time
      - name: endDate
        in: query
        schema:
          type: string
          format: date-time
      - name: page
        in: query
        schema:
          type: integer
          minimum: 1
          default: 1
      - name: limit
        in: query
        schema:
          type: integer
          minimum: 1
          maximum: 100
          default: 20
    responses:
      '200':
        description: Synchronization logs
        content:
          application/json:
            schema:
              type: object
              properties:
                logs:
                  type: array
                  items:
                    $ref: '#/components/schemas/HIESyncLog'
                pagination:
                  $ref: '#/components/schemas/PaginationInfo'
```

#### Retry Failed Synchronization
```yaml
/hie/sync/logs/{logId}/retry:
  post:
    summary: Retry failed synchronization
    tags: [HIE]
    parameters:
      - name: logId
        in: path
        required: true
        schema:
          type: string
          format: uuid
    responses:
      '202':
        description: Retry initiated
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/HIESyncResult'
```

### Platform Health Monitoring

#### Get Platform Health Status
```yaml
/hie/platforms/{platformId}/health:
  get:
    summary: Get HIE platform health status
    tags: [HIE]
    parameters:
      - name: platformId
        in: path
        required: true
        schema:
          type: string
          enum: [nabidh, malaffi, riayati]
      - name: checkType
        in: query
        schema:
          type: string
          enum: [connectivity, auth, api_response]
      - name: hours
        in: query
        schema:
          type: integer
          minimum: 1
          maximum: 168
          default: 24
    responses:
      '200':
        description: Platform health status
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/HIEPlatformHealth'
```

#### Get All Platforms Health
```yaml
/hie/platforms/health:
  get:
    summary: Get health status of all HIE platforms
    tags: [HIE]
    responses:
      '200':
        description: All platforms health status
        content:
          application/json:
            schema:
              type: object
              properties:
                platforms:
                  type: array
                  items:
                    $ref: '#/components/schemas/HIEPlatformHealth'
                overallHealth:
                  type: string
                  enum: [healthy, degraded, down]
```

### Data Conflict Management

#### Get Data Conflicts
```yaml
/hie/conflicts:
  get:
    summary: Get HIE data conflicts
    tags: [HIE]
    parameters:
      - name: patientId
        in: query
        schema:
          type: string
          format: uuid
      - name: conflictType
        in: query
        schema:
          type: string
          enum: [data_mismatch, version_conflict, deletion_conflict]
      - name: resolutionStatus
        in: query
        schema:
          type: string
          enum: [pending, resolved, escalated]
    responses:
      '200':
        description: Data conflicts
        content:
          application/json:
            schema:
              type: object
              properties:
                conflicts:
                  type: array
                  items:
                    $ref: '#/components/schemas/HIEDataConflict'
```

#### Resolve Data Conflict
```yaml
/hie/conflicts/{conflictId}/resolve:
  post:
    summary: Resolve data conflict
    tags: [HIE]
    parameters:
      - name: conflictId
        in: path
        required: true
        schema:
          type: string
          format: uuid
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            properties:
              resolutionStrategy:
                type: string
                enum: [source_wins, target_wins, manual_review]
              resolutionNotes:
                type: string
    responses:
      '200':
        description: Conflict resolved
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/HIEDataConflict'
```

### FHIR Resource Schemas

#### HIE Platform Schema
```yaml
HIEPlatform:
  type: object
  properties:
    id:
      type: string
      format: uuid
    name:
      type: string
      enum: [nabidh, malaffi, riayati]
    displayName:
      type: string
    authority:
      type: string
      enum: [DHA, DOH, MOHAP]
    baseUrl:
      type: string
      format: uri
    fhirVersion:
      type: string
      default: R4
    authType:
      type: string
      enum: [oauth2, certificate, oauth2_pkce]
    supportedResources:
      type: array
      items:
        type: string
    syncEnabled:
      type: boolean
    isActive:
      type: boolean
    createdAt:
      type: string
      format: date-time
    updatedAt:
      type: string
      format: date-time
```

#### HIE Sync Result Schema
```yaml
HIESyncResult:
  type: object
  properties:
    syncId:
      type: string
      format: uuid
    status:
      type: string
      enum: [initiated, in_progress, completed, failed]
    platforms:
      type: array
      items:
        type: object
        properties:
          platform:
            type: string
            enum: [nabidh, malaffi, riayati]
          status:
            type: string
            enum: [pending, success, failed]
          fhirId:
            type: string
          errorMessage:
            type: string
    estimatedCompletion:
      type: string
      format: date-time
    createdAt:
      type: string
      format: date-time
```

#### HIE Patient Consent Schema
```yaml
HIEPatientConsent:
  type: object
  properties:
    id:
      type: string
      format: uuid
    patientId:
      type: string
      format: uuid
    platformId:
      type: string
      format: uuid
    platformName:
      type: string
      enum: [nabidh, malaffi, riayati]
    consentType:
      type: string
      enum: [data_sharing, research, emergency_access]
    consentStatus:
      type: string
      enum: [granted, denied, partial, withdrawn]
    grantedResources:
      type: array
      items:
        type: string
    deniedResources:
      type: array
      items:
        type: string
    consentDate:
      type: string
      format: date-time
    expirationDate:
      type: string
      format: date-time
    withdrawalDate:
      type: string
      format: date-time
    consentMethod:
      type: string
      enum: [digital_signature, verbal, written]
    witnessUserId:
      type: string
      format: uuid
    notes:
      type: string
```

#### HIE Consolidated Patient Data Schema
```yaml
HIEConsolidatedPatientData:
  type: object
  properties:
    emiratesId:
      type: string
    patient:
      $ref: '#/components/schemas/FHIRPatient'
    platforms:
      type: array
      items:
        type: object
        properties:
          platform:
            type: string
            enum: [nabidh, malaffi, riayati]
          fhirId:
            type: string
          lastSync:
            type: string
            format: date-time
          resources:
            type: object
            properties:
              encounters:
                type: array
                items:
                  $ref: '#/components/schemas/FHIREncounter'
              observations:
                type: array
                items:
                  $ref: '#/components/schemas/FHIRObservation'
              diagnosticReports:
                type: array
                items:
                  $ref: '#/components/schemas/FHIRDiagnosticReport'
    conflicts:
      type: array
      items:
        $ref: '#/components/schemas/HIEDataConflict'
    lastUpdated:
      type: string
      format: date-time
```

#### FHIR Patient Schema
```yaml
FHIRPatient:
  type: object
  properties:
    resourceType:
      type: string
      enum: [Patient]
    id:
      type: string
    identifier:
      type: array
      items:
        type: object
        properties:
          use:
            type: string
            enum: [usual, official, temp, secondary]
          system:
            type: string
            format: uri
          value:
            type: string
    name:
      type: array
      items:
        type: object
        properties:
          use:
            type: string
            enum: [usual, official, temp, nickname, anonymous, old, maiden]
          family:
            type: string
          given:
            type: array
            items:
              type: string
    gender:
      type: string
      enum: [male, female, other, unknown]
    birthDate:
      type: string
      format: date
    address:
      type: array
      items:
        type: object
        properties:
          use:
            type: string
            enum: [home, work, temp, old, billing]
          line:
            type: array
            items:
              type: string
          city:
            type: string
          state:
            type: string
          postalCode:
            type: string
          country:
            type: string
    meta:
      type: object
      properties:
        versionId:
          type: string
        lastUpdated:
          type: string
          format: date-time
```

#### HIE Platform Health Schema
```yaml
HIEPlatformHealth:
  type: object
  properties:
    platformId:
      type: string
      format: uuid
    platformName:
      type: string
      enum: [nabidh, malaffi, riayati]
    overallStatus:
      type: string
      enum: [healthy, degraded, down]
    healthScore:
      type: integer
      minimum: 0
      maximum: 100
    checks:
      type: array
      items:
        type: object
        properties:
          checkType:
            type: string
            enum: [connectivity, auth, api_response]
          status:
            type: string
            enum: [healthy, degraded, down]
          responseTimeMs:
            type: integer
          errorRate:
            type: number
            format: float
          lastSuccessfulSync:
            type: string
            format: date-time
          lastFailedSync:
            type: string
            format: date-time
          consecutiveFailures:
            type: integer
          details:
            type: object
    lastChecked:
      type: string
      format: date-time
```

### Error Handling

HIE APIs use standard HTTP status codes with detailed error information:

```yaml
HIEErrorResponse:
  type: object
  properties:
    error:
      type: object
      properties:
        code:
          type: string
          enum: [HIE_PLATFORM_UNAVAILABLE, AUTHENTICATION_FAILED, CONSENT_REQUIRED, DATA_CONFLICT, SYNC_FAILED]
        message:
          type: string
        platform:
          type: string
          enum: [nabidh, malaffi, riayati]
        fhirError:
          type: object
          properties:
            code:
              type: string
            details:
              type: string
        retryAfter:
          type: integer
          description: Seconds to wait before retry
        timestamp:
          type: string
          format: date-time
        requestId:
          type: string
          format: uuid
```

### Rate Limiting

HIE APIs have platform-specific rate limits:

- **NABIDH**: 100 requests/minute per tenant
- **Malaffi**: 200 requests/minute per tenant  
- **Riayati**: 150 requests/minute per tenant
- **Burst allowance**: 20% above limit for 1 minute
- **Headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

### Webhooks

HIE events are published to webhook endpoints:

```yaml
HIEWebhookEvent:
  type: object
  properties:
    event:
      type: string
      enum: [hie.sync.completed, hie.sync.failed, hie.consent.changed, hie.conflict.detected]
    data:
      type: object
      properties:
        platform:
          type: string
          enum: [nabidh, malaffi, riayati]
        patientId:
          type: string
          format: uuid
        resourceType:
          type: string
        fhirId:
          type: string
        syncId:
          type: string
          format: uuid
    timestamp:
      type: string
      format: date-time
    webhookId:
      type: string
      format: uuid
```
