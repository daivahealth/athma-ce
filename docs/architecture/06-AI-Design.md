# AI Design

## AI Services Architecture

The athma-ce platform integrates AI capabilities across clinical, operational, and financial workflows with a focus on safety, explainability, and human-in-the-loop validation.

## AI Service Components

### 1. AI Note Service

#### Purpose
Generate clinical notes from encounter data, voice dictation, and structured inputs using large language models.

#### Models and Technology
- **Primary Model**: GPT-4 or Claude-3 for note generation
- **Fallback Model**: Local fine-tuned model for offline capability
- **Voice Processing**: Whisper for speech-to-text
- **Template Engine**: Custom prompt templates for different specialties

#### Input Features
```json
{
  "encounter_data": {
    "patient_demographics": "object",
    "vital_signs": "object", 
    "chief_complaint": "string",
    "history_present_illness": "string",
    "physical_exam": "string",
    "lab_results": "array",
    "imaging_results": "array"
  },
  "voice_input": {
    "audio_file": "base64_encoded",
    "language": "en|ar",
    "speaker_id": "provider_uuid"
  },
  "context": {
    "specialty": "string",
    "note_type": "soap|progress|discharge",
    "template_preferences": "object"
  }
}
```

#### Output Schema
```json
{
  "draft_content": {
    "subjective": "string",
    "objective": "string", 
    "assessment": "string",
    "plan": "string"
  },
  "confidence_score": "float (0-1)",
  "suggestions": ["string"],
  "metadata": {
    "model_version": "string",
    "processing_time_ms": "integer",
    "template_used": "string"
  }
}
```

#### Guardrails
- **PHI Masking**: Automatic detection and masking of patient identifiers
- **Content Validation**: Medical accuracy checks against clinical guidelines
- **Length Limits**: Maximum note length to prevent hallucination
- **Human Review**: All AI-generated notes require provider review before finalization

### 2. AI Coding Service

#### Purpose
Assist with medical coding by suggesting ICD-10, CPT, and HCPCS codes based on clinical documentation.

#### Models and Technology
- **Primary Model**: Fine-tuned BERT for medical coding
- **Code Database**: Comprehensive UAE-specific code sets
- **Confidence Scoring**: Ensemble methods for accuracy assessment
- **Modifier Suggestions**: Rule-based modifier recommendations

#### Input Features
```json
{
  "clinical_data": {
    "diagnosis_text": "string",
    "procedure_text": "string",
    "encounter_type": "string",
    "patient_age": "integer",
    "patient_gender": "string"
  },
  "existing_codes": {
    "icd_codes": ["string"],
    "cpt_codes": ["string"],
    "modifiers": ["string"]
  },
  "context": {
    "specialty": "string",
    "payer_rules": "object",
    "uae_guidelines": "object"
  }
}
```

#### Output Schema
```json
{
  "suggestions": [
    {
      "code": "string",
      "description": "string",
      "confidence": "float (0-1)",
      "rationale": "string",
      "modifiers": ["string"],
      "documentation_requirements": ["string"]
    }
  ],
  "validation_warnings": [
    {
      "type": "string",
      "message": "string",
      "severity": "info|warning|error"
    }
  ]
}
```

#### Guardrails
- **Code Validation**: Cross-reference with UAE coding guidelines
- **Documentation Requirements**: Ensure sufficient documentation for codes
- **Confidence Thresholds**: Only suggest codes above 0.8 confidence
- **Human Approval**: All coding suggestions require provider approval

### 3. AI Scheduler Service

#### Purpose
Optimize appointment scheduling through demand forecasting, no-show prediction, and resource utilization.

#### Models and Technology
- **Time Series Models**: Prophet for demand forecasting
- **Classification Models**: XGBoost for no-show prediction
- **Optimization**: OR-Tools for scheduling optimization
- **Real-time Updates**: Stream processing for dynamic adjustments

#### Input Features
```json
{
  "historical_data": {
    "appointment_history": "array",
    "no_show_patterns": "object",
    "provider_availability": "object",
    "patient_preferences": "object"
  },
  "current_state": {
    "scheduled_appointments": "array",
    "provider_schedules": "object",
    "room_availability": "object",
    "patient_queue": "array"
  },
  "constraints": {
    "business_rules": "object",
    "provider_preferences": "object",
    "patient_preferences": "object"
  }
}
```

#### Output Schema
```json
{
  "recommendations": [
    {
      "appointment_slot": "datetime",
      "provider_id": "uuid",
      "room_id": "uuid",
      "confidence": "float",
      "reasoning": "string"
    }
  ],
  "no_show_predictions": [
    {
      "appointment_id": "uuid",
      "no_show_probability": "float",
      "risk_factors": ["string"],
      "mitigation_suggestions": ["string"]
    }
  ],
  "demand_forecast": {
    "daily_capacity": "integer",
    "peak_hours": ["string"],
    "recommended_slots": ["datetime"]
  }
}
```

#### Guardrails
- **Fairness Constraints**: Ensure equitable access across patient demographics
- **Provider Preferences**: Respect provider scheduling preferences
- **Emergency Override**: Allow manual overrides for urgent cases
- **Performance Monitoring**: Track accuracy of predictions

### 4. AI Anomaly Service

#### Purpose
Detect anomalies in claims, payments, and clinical patterns to identify potential issues.

#### Models and Technology
- **Anomaly Detection**: Isolation Forest and One-Class SVM
- **Time Series Anomalies**: LSTM autoencoders
- **Statistical Methods**: Z-score and IQR-based detection
- **Ensemble Methods**: Multiple models for robust detection

#### Input Features
```json
{
  "claims_data": {
    "claim_amounts": "array",
    "procedure_codes": "array",
    "diagnosis_codes": "array",
    "provider_patterns": "object",
    "payer_patterns": "object"
  },
  "payment_data": {
    "payment_amounts": "array",
    "payment_timings": "array",
    "adjustment_patterns": "object",
    "denial_patterns": "object"
  },
  "clinical_data": {
    "lab_values": "array",
    "vital_signs": "array",
    "medication_patterns": "object",
    "outcome_patterns": "object"
  }
}
```

#### Output Schema
```json
{
  "anomalies": [
    {
      "type": "string",
      "entity_id": "uuid",
      "anomaly_score": "float",
      "description": "string",
      "risk_level": "low|medium|high|critical",
      "recommended_actions": ["string"],
      "confidence": "float"
    }
  ],
  "trends": {
    "denial_rate_trend": "object",
    "payment_delay_trend": "object",
    "cost_trend": "object"
  }
}
```

#### Guardrails
- **False Positive Reduction**: High precision thresholds to minimize false alarms
- **Context Awareness**: Consider seasonal and regional variations
- **Human Review**: All high-risk anomalies require manual review
- **Feedback Loop**: Learn from human corrections to improve accuracy

### 5. AI Document Service

#### Purpose
Process documents using OCR, extract structured data, and classify document types.

#### Models and Technology
- **OCR Engine**: PaddleOCR for Arabic/English text extraction
- **Document Classification**: Custom CNN for document type identification
- **Data Extraction**: Named Entity Recognition (NER) models
- **Layout Analysis**: Computer vision for form field detection

#### Input Features
```json
{
  "document": {
    "file_path": "string",
    "file_type": "pdf|image|scanned",
    "language": "ar|en|mixed",
    "document_type": "era|eob|lab_report|imaging"
  },
  "extraction_rules": {
    "fields_to_extract": ["string"],
    "validation_rules": "object",
    "confidence_thresholds": "object"
  }
}
```

#### Output Schema
```json
{
  "extracted_data": {
    "structured_fields": "object",
    "confidence_scores": "object",
    "validation_status": "object"
  },
  "document_analysis": {
    "document_type": "string",
    "language_detected": "string",
    "quality_score": "float",
    "processing_notes": ["string"]
  },
  "raw_text": "string",
  "layout_analysis": {
    "regions": "array",
    "tables": "array",
    "forms": "array"
  }
}
```

#### Guardrails
- **Data Validation**: Cross-reference extracted data with known patterns
- **Quality Checks**: Assess document quality and extraction confidence
- **Manual Review**: Flag low-confidence extractions for human review
- **Privacy Protection**: Ensure no PHI leakage in processing logs

## AI Infrastructure

### Model Serving Architecture

```yaml
# Kubernetes deployment for AI services
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ai-note-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: ai-note-service
  template:
    metadata:
      labels:
        app: ai-note-service
    spec:
      containers:
      - name: ai-note-service
        image: zeal/ai-note-service:latest
        ports:
        - containerPort: 8000
        env:
        - name: MODEL_ENDPOINT
          value: "http://model-server:8080"
        - name: REDIS_URL
          value: "redis://redis:6379"
        resources:
          requests:
            memory: "2Gi"
            cpu: "1000m"
          limits:
            memory: "4Gi"
            cpu: "2000m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 8000
          initialDelaySeconds: 5
          periodSeconds: 5
```

### Model Management

#### Model Versioning
- **MLflow**: Model versioning and experiment tracking
- **Model Registry**: Centralized model storage and metadata
- **A/B Testing**: Gradual rollout of new model versions
- **Rollback Capability**: Quick rollback to previous model versions

#### Model Monitoring
- **Performance Metrics**: Accuracy, latency, throughput monitoring
- **Data Drift Detection**: Monitor input data distribution changes
- **Model Drift Detection**: Monitor model performance degradation
- **Alerting**: Automated alerts for performance issues

### Privacy and Security

#### PHI Handling
```python
# PHI masking example
class PHIMasker:
    def __init__(self):
        self.patterns = {
            'emirates_id': r'\b\d{3}-\d{4}-\d{7}-\d{1}\b',
            'phone': r'\b(?:\+971|0)?[1-9]\d{8}\b',
            'email': r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
            'patient_name': r'\b[A-Z][a-z]+ [A-Z][a-z]+\b'
        }
    
    def mask_text(self, text: str) -> str:
        masked_text = text
        for pattern_name, pattern in self.patterns.items():
            masked_text = re.sub(pattern, f'[{pattern_name.upper()}]', masked_text)
        return masked_text
```

#### Secure Inference
- **VPC Deployment**: AI models deployed in private VPC
- **TLS Encryption**: All model inference encrypted in transit
- **Access Control**: Role-based access to AI services
- **Audit Logging**: Complete audit trail for AI interactions

## Evaluation Framework

### Offline Evaluation

#### Gold Dataset Creation
```python
# Evaluation dataset structure
evaluation_datasets = {
    "clinical_notes": {
        "size": 10000,
        "sources": ["provider_notes", "specialist_reviews"],
        "metrics": ["bleu_score", "rouge_score", "medical_accuracy"],
        "annotators": ["board_certified_physicians"]
    },
    "medical_coding": {
        "size": 50000,
        "sources": ["certified_coders", "audit_results"],
        "metrics": ["precision", "recall", "f1_score"],
        "annotators": ["certified_coding_specialists"]
    },
    "scheduling": {
        "size": 100000,
        "sources": ["historical_appointments", "outcome_data"],
        "metrics": ["accuracy", "utilization_rate", "patient_satisfaction"],
        "annotators": ["scheduling_coordinators"]
    }
}
```

#### Evaluation Metrics
- **Clinical Notes**: BLEU, ROUGE, Medical Accuracy Score
- **Medical Coding**: Precision, Recall, F1-Score, Code Coverage
- **Scheduling**: Accuracy, Utilization Rate, Patient Satisfaction
- **Anomaly Detection**: Precision, Recall, False Positive Rate

### Online Evaluation

#### Shadow Mode Deployment
```python
# Shadow mode implementation
class ShadowModeEvaluator:
    def __init__(self, production_model, shadow_model):
        self.production_model = production_model
        self.shadow_model = shadow_model
        self.results = []
    
    def evaluate(self, input_data):
        # Get production prediction
        prod_prediction = self.production_model.predict(input_data)
        
        # Get shadow prediction
        shadow_prediction = self.shadow_model.predict(input_data)
        
        # Compare predictions
        comparison = {
            "input_data": input_data,
            "production_prediction": prod_prediction,
            "shadow_prediction": shadow_prediction,
            "difference": self.calculate_difference(prod_prediction, shadow_prediction),
            "timestamp": datetime.now()
        }
        
        self.results.append(comparison)
        return prod_prediction  # Always return production prediction
```

#### A/B Testing Framework
- **Traffic Splitting**: Gradual rollout with configurable percentages
- **Statistical Significance**: Ensure sufficient sample sizes
- **Multiple Metrics**: Monitor both primary and secondary metrics
- **Safety Monitoring**: Early stopping for negative impacts

### Continuous Learning

#### Feedback Collection
```python
# Feedback collection system
class FeedbackCollector:
    def __init__(self):
        self.feedback_queue = Queue()
    
    def collect_feedback(self, prediction_id, user_feedback):
        feedback = {
            "prediction_id": prediction_id,
            "user_feedback": user_feedback,
            "timestamp": datetime.now(),
            "user_id": get_current_user_id()
        }
        self.feedback_queue.put(feedback)
    
    def process_feedback(self):
        while not self.feedback_queue.empty():
            feedback = self.feedback_queue.get()
            self.update_model_training_data(feedback)
```

#### Model Retraining Pipeline
- **Automated Retraining**: Scheduled retraining with new data
- **Performance Monitoring**: Continuous monitoring of model performance
- **Gradual Deployment**: Phased rollout of retrained models
- **Rollback Capability**: Quick rollback if performance degrades

## Prompt Engineering

### Prompt Templates

#### Clinical Note Generation
```python
CLINICAL_NOTE_PROMPT = """
You are an expert medical scribe assisting a healthcare provider in generating clinical notes.

Patient Information:
- Age: {patient_age}
- Gender: {patient_gender}
- Chief Complaint: {chief_complaint}

Encounter Details:
- Provider: {provider_name}
- Specialty: {specialty}
- Encounter Type: {encounter_type}

Instructions:
1. Generate a comprehensive SOAP note based on the provided information
2. Use medical terminology appropriate for the specialty
3. Ensure all sections (Subjective, Objective, Assessment, Plan) are complete
4. Do not include any patient identifiers or PHI
5. Focus on clinical accuracy and completeness

Generate the note:
"""

def generate_clinical_note(encounter_data):
    prompt = CLINICAL_NOTE_PROMPT.format(
        patient_age=encounter_data['patient_age'],
        patient_gender=encounter_data['patient_gender'],
        chief_complaint=encounter_data['chief_complaint'],
        provider_name=encounter_data['provider_name'],
        specialty=encounter_data['specialty'],
        encounter_type=encounter_data['encounter_type']
    )
    
    response = llm_client.generate(
        prompt=prompt,
        max_tokens=1000,
        temperature=0.3,
        stop_sequences=["END_NOTE"]
    )
    
    return response
```

#### Medical Coding Assistance
```python
MEDICAL_CODING_PROMPT = """
You are a certified medical coder assisting with ICD-10 and CPT coding.

Clinical Information:
- Diagnosis: {diagnosis_text}
- Procedures: {procedure_text}
- Patient Age: {patient_age}
- Patient Gender: {patient_gender}

Coding Guidelines:
1. Use the most specific codes available
2. Follow UAE coding guidelines
3. Ensure documentation supports the codes
4. Consider comorbidities and complications
5. Provide confidence scores for each suggestion

Suggest appropriate codes:
"""

def suggest_medical_codes(clinical_data):
    prompt = MEDICAL_CODING_PROMPT.format(
        diagnosis_text=clinical_data['diagnosis_text'],
        procedure_text=clinical_data['procedure_text'],
        patient_age=clinical_data['patient_age'],
        patient_gender=clinical_data['patient_gender']
    )
    
    response = llm_client.generate(
        prompt=prompt,
        max_tokens=500,
        temperature=0.1,
        stop_sequences=["END_CODES"]
    )
    
    return parse_coding_response(response)
```

### Prompt Security

#### Injection Prevention
```python
class PromptSanitizer:
    def __init__(self):
        self.dangerous_patterns = [
            r'ignore\s+previous\s+instructions',
            r'forget\s+everything',
            r'you\s+are\s+now',
            r'system\s+prompt',
            r'jailbreak'
        ]
    
    def sanitize_prompt(self, prompt: str) -> str:
        # Remove dangerous patterns
        for pattern in self.dangerous_patterns:
            prompt = re.sub(pattern, '[FILTERED]', prompt, flags=re.IGNORECASE)
        
        # Limit prompt length
        if len(prompt) > 4000:
            prompt = prompt[:4000] + "..."
        
        return prompt
```

#### Content Policy Enforcement
```python
class ContentPolicyChecker:
    def __init__(self):
        self.policy_rules = [
            "no_personal_health_information",
            "no_inappropriate_content",
            "no_medical_advice",
            "no_diagnosis_suggestions"
        ]
    
    def check_content(self, content: str) -> dict:
        violations = []
        
        # Check for PHI
        if self.contains_phi(content):
            violations.append("contains_phi")
        
        # Check for inappropriate content
        if self.contains_inappropriate_content(content):
            violations.append("inappropriate_content")
        
        return {
            "is_safe": len(violations) == 0,
            "violations": violations,
            "confidence": self.calculate_confidence(content)
        }
```

## Human-in-the-Loop (HITL) Design

### Approval Workflows

#### Clinical Note Approval
```python
class ClinicalNoteWorkflow:
    def __init__(self):
        self.approval_states = ["draft", "pending_review", "approved", "rejected"]
    
    def submit_for_review(self, note_id, provider_id):
        # Update note status
        note = self.get_note(note_id)
        note.status = "pending_review"
        note.reviewer_id = provider_id
        note.submitted_at = datetime.now()
        
        # Send notification to reviewer
        self.send_review_notification(note)
        
        # Log workflow event
        self.log_workflow_event("note_submitted_for_review", note_id)
    
    def approve_note(self, note_id, reviewer_id, comments=""):
        note = self.get_note(note_id)
        note.status = "approved"
        note.approved_at = datetime.now()
        note.approver_id = reviewer_id
        note.approval_comments = comments
        
        # Make note final
        note.is_final = True
        
        # Log workflow event
        self.log_workflow_event("note_approved", note_id)
    
    def reject_note(self, note_id, reviewer_id, rejection_reason):
        note = self.get_note(note_id)
        note.status = "rejected"
        note.rejected_at = datetime.now()
        note.rejector_id = reviewer_id
        note.rejection_reason = rejection_reason
        
        # Return to draft status
        note.status = "draft"
        
        # Log workflow event
        self.log_workflow_event("note_rejected", note_id)
```

#### Coding Approval
```python
class CodingApprovalWorkflow:
    def __init__(self):
        self.confidence_thresholds = {
            "high": 0.9,
            "medium": 0.7,
            "low": 0.5
        }
    
    def process_coding_suggestions(self, encounter_id):
        suggestions = self.ai_coding_service.get_suggestions(encounter_id)
        
        approved_codes = []
        pending_review = []
        
        for suggestion in suggestions:
            if suggestion.confidence >= self.confidence_thresholds["high"]:
                # Auto-approve high confidence suggestions
                approved_codes.append(suggestion)
            elif suggestion.confidence >= self.confidence_thresholds["medium"]:
                # Require review for medium confidence
                pending_review.append(suggestion)
            else:
                # Reject low confidence suggestions
                self.reject_suggestion(suggestion)
        
        return {
            "approved_codes": approved_codes,
            "pending_review": pending_review
        }
```

### Escalation Procedures

#### Critical Anomaly Escalation
```python
class AnomalyEscalationSystem:
    def __init__(self):
        self.escalation_levels = {
            "low": ["billing_staff"],
            "medium": ["billing_manager", "clinical_director"],
            "high": ["medical_director", "compliance_officer"],
            "critical": ["ceo", "legal_counsel", "external_auditor"]
        }
    
    def escalate_anomaly(self, anomaly):
        risk_level = anomaly.risk_level
        escalation_recipients = self.escalation_levels[risk_level]
        
        # Send immediate notifications
        for recipient in escalation_recipients:
            self.send_urgent_notification(recipient, anomaly)
        
        # Create escalation ticket
        ticket = self.create_escalation_ticket(anomaly)
        
        # Log escalation
        self.log_escalation_event(anomaly, escalation_recipients)
        
        return ticket
```

## Performance Optimization

### Model Optimization

#### Quantization
```python
# Model quantization for faster inference
import torch
from torch.quantization import quantize_dynamic

def quantize_model(model):
    # Dynamic quantization for LSTM models
    quantized_model = quantize_dynamic(
        model, 
        {torch.nn.LSTM, torch.nn.Linear}, 
        dtype=torch.qint8
    )
    return quantized_model
```

#### Caching Strategy
```python
class ModelCache:
    def __init__(self, max_size=1000):
        self.cache = {}
        self.max_size = max_size
    
    def get_prediction(self, input_hash):
        if input_hash in self.cache:
            return self.cache[input_hash]
        return None
    
    def store_prediction(self, input_hash, prediction):
        if len(self.cache) >= self.max_size:
            # Remove oldest entry
            oldest_key = next(iter(self.cache))
            del self.cache[oldest_key]
        
        self.cache[input_hash] = prediction
```

### Scalability Considerations

#### Horizontal Scaling
- **Load Balancing**: Distribute AI requests across multiple instances
- **Auto-scaling**: Scale based on request volume and latency
- **Model Replication**: Deploy models across multiple regions
- **Caching**: Redis-based caching for frequent requests

#### Resource Management
- **GPU Utilization**: Optimize GPU usage for model inference
- **Memory Management**: Efficient memory usage for large models
- **Batch Processing**: Process multiple requests in batches
- **Async Processing**: Non-blocking AI service calls
