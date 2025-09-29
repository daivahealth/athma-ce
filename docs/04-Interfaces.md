# API Interfaces

## OpenAPI Specification Overview

This document outlines the OpenAPI 3.0 specifications for all major service endpoints in the Zeal PMS/RCM platform. All APIs follow RESTful principles with consistent patterns for authentication, error handling, and response formats.

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
