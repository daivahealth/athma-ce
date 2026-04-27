# Report Pack

## Overview

This document provides a comprehensive KPI library for the athma-ce PMS/RCM platform, covering operational, clinical, financial, security, and compliance metrics essential for healthcare practice management and revenue cycle optimization.

**Categories**:
- Operational KPIs (system performance, scheduling, resource utilization)
- Clinical KPIs (quality measures, patient outcomes, preventive care)
- Financial KPIs (revenue cycle, collections, denials)
- Security KPIs (access control, MFA adoption, breach incidents)
- Compliance KPIs (data access audits, consent management, regulatory reporting)

**Last Updated**: October 2025

## Operational KPIs

### System Performance Metrics

#### Availability and Uptime
```yaml
availability_metrics:
  system_uptime:
    definition: "Percentage of time system is available"
    target: "99.9%"
    measurement: "Monthly rolling average"
    calculation: "(Total time - Downtime) / Total time * 100"
    alerting: "Alert if < 99.5%"
  
  service_availability:
    definition: "Individual service availability"
    target: "99.95%"
    measurement: "Per service monitoring"
    services:
      - "API Gateway"
      - "PMS Service"
      - "Billing Service"
      - "RCM Service"
      - "AI Services"
      - "Database"
      - "Cache"
  
  planned_maintenance:
    definition: "Scheduled maintenance windows"
    target: "< 4 hours/month"
    measurement: "Monthly total"
    scheduling: "Off-peak hours only"
```

#### Performance Metrics
```yaml
performance_metrics:
  response_time:
    definition: "API response time distribution"
    targets:
      p50: "< 500ms"
      p95: "< 2s"
      p99: "< 5s"
    measurement: "Real-time monitoring"
    alerting: "Alert if p95 > 2s for 5 minutes"
  
  throughput:
    definition: "Requests per second capacity"
    target: "1000 RPS sustained"
    measurement: "Peak load testing"
    scaling: "Auto-scale at 80% capacity"
  
  error_rate:
    definition: "Percentage of failed requests"
    target: "< 0.1%"
    measurement: "5xx HTTP status codes"
    alerting: "Alert if > 0.1% for 2 minutes"
  
  database_performance:
    definition: "Database query performance"
    targets:
      slow_queries: "< 1% of total queries"
      connection_pool: "80% utilization max"
      lock_wait_time: "< 100ms average"
```

### User Experience Metrics

#### User Engagement
```yaml
user_engagement:
  active_users:
    definition: "Daily/Monthly active users"
    measurement: "Unique user sessions"
    segmentation:
      - "By role (provider, admin, billing)"
      - "By clinic location"
      - "By specialty"
  
  session_duration:
    definition: "Average session length"
    target: "> 15 minutes"
    measurement: "User session analytics"
    optimization: "Improve workflow efficiency"
  
  feature_adoption:
    definition: "Feature usage rates"
    measurement: "Feature utilization tracking"
    key_features:
      - "AI note drafting"
      - "Smart scheduling"
      - "Automated coding"
      - "Patient portal"
  
  user_satisfaction:
    definition: "User satisfaction scores"
    target: "NPS > 50"
    measurement: "Quarterly surveys"
    feedback_channels:
      - "In-app feedback"
      - "Support tickets"
      - "User interviews"
```

#### System Usability
```yaml
usability_metrics:
  page_load_time:
    definition: "Frontend page load performance"
    target: "< 3 seconds"
    measurement: "Web vitals monitoring"
    optimization: "CDN and caching"
  
  mobile_performance:
    definition: "Mobile app performance"
    target: "< 2 seconds"
    measurement: "Mobile app analytics"
    platforms:
      - "iOS"
      - "Android"
  
  accessibility_score:
    definition: "WCAG compliance score"
    target: "AA compliance"
    measurement: "Automated accessibility testing"
    requirements:
      - "Screen reader compatibility"
      - "Keyboard navigation"
      - "Color contrast"
      - "Text scaling"
```

## Clinical KPIs

### Patient Care Metrics

#### Patient Flow
```yaml
patient_flow:
  appointment_scheduling:
    definition: "Appointment scheduling efficiency"
    metrics:
      - "Average booking time: < 2 minutes"
      - "Scheduling accuracy: > 95%"
      - "No-show rate: < 15%"
      - "Rescheduling rate: < 10%"
  
  wait_times:
    definition: "Patient wait time optimization"
    targets:
      check_in_to_room: "< 15 minutes"
      room_to_provider: "< 5 minutes"
      total_visit_time: "< 60 minutes"
    measurement: "Real-time tracking"
  
  provider_utilization:
    definition: "Provider time optimization"
    targets:
      patient_facing_time: "> 70%"
      documentation_time: "< 20%"
      administrative_time: "< 10%"
    measurement: "Time tracking analytics"
```

#### Clinical Quality
```yaml
clinical_quality:
  documentation_completeness:
    definition: "Clinical note completeness"
    target: "> 95%"
    measurement: "SOAP note analysis"
    ai_assistance: "AI completeness scoring"
  
  coding_accuracy:
    definition: "Medical coding accuracy"
    target: "> 98%"
    measurement: "Audit results"
    ai_assistance: "AI coding suggestions"
  
  medication_safety:
    definition: "e-Prescribing safety"
    metrics:
      - "Drug interaction alerts: 100% coverage"
      - "Allergy warnings: 100% coverage"
      - "Dosage validation: > 99%"
      - "Prescription errors: < 0.1%"
  
  follow_up_compliance:
    definition: "Patient follow-up adherence"
    target: "> 80%"
    measurement: "Appointment tracking"
    automation: "Automated reminders"
```

### AI Performance Metrics

#### AI Model Performance
```yaml
ai_performance:
  note_drafting:
    definition: "AI note generation quality"
    metrics:
      - "Acceptance rate: > 85%"
      - "Time savings: > 50%"
      - "Provider satisfaction: > 4.0/5"
      - "Accuracy score: > 90%"
  
  medical_coding:
    definition: "AI coding assistance"
    metrics:
      - "Code accuracy: > 95%"
      - "Confidence threshold: > 0.8"
      - "Time savings: > 60%"
      - "Audit pass rate: > 98%"
  
  scheduling_optimization:
    definition: "AI scheduling performance"
    metrics:
      - "No-show prediction: > 80% accuracy"
      - "Utilization improvement: > 15%"
      - "Patient satisfaction: > 4.2/5"
      - "Provider satisfaction: > 4.0/5"
  
  anomaly_detection:
    definition: "AI anomaly detection"
    metrics:
      - "False positive rate: < 5%"
      - "Detection accuracy: > 90%"
      - "Time to detection: < 24 hours"
      - "Prevention rate: > 75%"
```

## Financial KPIs

### Revenue Cycle Management

#### Claims Processing
```yaml
claims_processing:
  submission_rate:
    definition: "Claims submitted within 24 hours"
    target: "> 95%"
    measurement: "Daily submission tracking"
    automation: "Automated claim generation"
  
  first_pass_rate:
    definition: "Claims paid on first submission"
    target: "> 85%"
    measurement: "Payer response analysis"
    optimization: "Pre-submission validation"
  
  denial_rate:
    definition: "Claim denial percentage"
    target: "< 10%"
    measurement: "Denial reason analysis"
    prevention: "AI denial risk assessment"
  
  days_in_ar:
    definition: "Average days in accounts receivable"
    target: "< 35 days"
    measurement: "AR aging analysis"
    optimization: "Automated follow-up"
```

#### Payment Processing
```yaml
payment_processing:
  collection_rate:
    definition: "Net collection rate"
    target: "> 95%"
    measurement: "Payment vs. charges"
    calculation: "Payments / (Charges - Adjustments)"
  
  payment_posting:
    definition: "Payment posting accuracy"
    target: "> 99%"
    measurement: "Payment reconciliation"
    automation: "Automated ERA processing"
  
  underpayment_detection:
    definition: "Underpayment identification"
    target: "> 90% detection rate"
    measurement: "AI underpayment analysis"
    recovery: "Automated underpayment claims"
  
  write_off_rate:
    definition: "Bad debt write-off rate"
    target: "< 2%"
    measurement: "Uncollectible accounts"
    prevention: "Early intervention"
```

### Cost Management

#### Operational Costs
```yaml
operational_costs:
  cost_per_claim:
    definition: "Cost to process each claim"
    target: "< $5 per claim"
    measurement: "Total RCM costs / Claims processed"
    optimization: "Process automation"
  
  cost_per_patient:
    definition: "Cost per patient visit"
    target: "< $25 per visit"
    measurement: "Total costs / Patient visits"
    efficiency: "Workflow optimization"
  
  technology_costs:
    definition: "Technology cost per provider"
    target: "< $200/month"
    measurement: "Total tech costs / Providers"
    roi: "Cost vs. efficiency gains"
  
  staffing_efficiency:
    definition: "Staff productivity metrics"
    targets:
      - "Billing staff: > 500 claims/month"
      - "Coding staff: > 1000 codes/month"
      - "Support staff: < 2 tickets/day"
```

## Compliance and Security KPIs

### Regulatory Compliance
```yaml
compliance_metrics:
  pdpl_compliance:
    definition: "UAE PDPL compliance score"
    target: "100%"
    measurement: "Compliance audit results"
    areas:
      - "Data subject rights"
      - "Consent management"
      - "Data retention"
      - "Cross-border transfers"
  
  gdpr_compliance:
    definition: "GDPR compliance score"
    target: "100%"
    measurement: "Compliance assessment"
    areas:
      - "Lawful basis"
      - "Data minimization"
      - "Purpose limitation"
      - "Storage limitation"
  
  audit_readiness:
    definition: "Audit preparation score"
    target: "> 95%"
    measurement: "Internal audit results"
    components:
      - "Documentation completeness"
      - "Process compliance"
      - "Training completion"
      - "Incident response"
```

### Security Metrics
```yaml
security_metrics:
  security_incidents:
    definition: "Security incident rate"
    target: "0 critical incidents"
    measurement: "Incident tracking"
    categories:
      - "Critical: 0 tolerance"
      - "High: < 1 per month"
      - "Medium: < 5 per month"
      - "Low: < 20 per month"
  
  vulnerability_management:
    definition: "Vulnerability remediation"
    target: "> 95% within SLA"
    measurement: "Vulnerability tracking"
    slas:
      - "Critical: 24 hours"
      - "High: 7 days"
      - "Medium: 30 days"
      - "Low: 90 days"
  
  access_control:
    definition: "Access control effectiveness"
    target: "100% compliance"
    measurement: "Access audit results"
    areas:
      - "User provisioning"
      - "Role assignments"
      - "Access reviews"
      - "Privileged access"
```

## Reporting Framework

### Dashboard Configuration

#### Executive Dashboard
```yaml
executive_dashboard:
  financial_summary:
    - "Monthly revenue"
    - "Collection rate"
    - "Days in AR"
    - "Cost per claim"
  
  operational_summary:
    - "System uptime"
    - "User satisfaction"
    - "Feature adoption"
    - "Support tickets"
  
  clinical_summary:
    - "Patient satisfaction"
    - "Provider productivity"
    - "AI performance"
    - "Quality metrics"
  
  compliance_summary:
    - "Security incidents"
    - "Compliance score"
    - "Audit readiness"
    - "Risk assessment"
```

#### Operational Dashboard
```yaml
operational_dashboard:
  system_health:
    - "Service availability"
    - "Response times"
    - "Error rates"
    - "Resource utilization"
  
  user_activity:
    - "Active users"
    - "Session duration"
    - "Feature usage"
    - "User feedback"
  
  performance_metrics:
    - "Throughput"
    - "Latency"
    - "Database performance"
    - "Cache hit rates"
```

#### Clinical Dashboard
```yaml
clinical_dashboard:
  patient_flow:
    - "Appointment scheduling"
    - "Wait times"
    - "No-show rates"
    - "Provider utilization"
  
  clinical_quality:
    - "Documentation completeness"
    - "Coding accuracy"
    - "Medication safety"
    - "Follow-up compliance"
  
  ai_performance:
    - "Note drafting acceptance"
    - "Coding accuracy"
    - "Scheduling optimization"
    - "Anomaly detection"
```

#### Financial Dashboard
```yaml
financial_dashboard:
  revenue_cycle:
    - "Claims submission rate"
    - "First pass rate"
    - "Denial rate"
    - "Days in AR"
  
  payment_processing:
    - "Collection rate"
    - "Payment posting"
    - "Underpayment detection"
    - "Write-off rate"
  
  cost_management:
    - "Cost per claim"
    - "Cost per patient"
    - "Technology costs"
    - "Staffing efficiency"
```

### Report Generation

#### Automated Reports
```yaml
automated_reports:
  daily_reports:
    - "System health summary"
    - "User activity report"
    - "Security incident summary"
    - "Performance metrics"
  
  weekly_reports:
    - "Operational KPI summary"
    - "Clinical quality report"
    - "Financial performance"
    - "Compliance status"
  
  monthly_reports:
    - "Executive summary"
    - "Detailed KPI analysis"
    - "Trend analysis"
    - "Recommendations"
  
  quarterly_reports:
    - "Comprehensive assessment"
    - "Benchmark comparison"
    - "Strategic recommendations"
    - "ROI analysis"
```

#### Report Templates
```yaml
report_templates:
  executive_summary:
    sections:
      - "Key performance indicators"
      - "Financial highlights"
      - "Operational efficiency"
      - "Clinical outcomes"
      - "Compliance status"
      - "Strategic recommendations"
  
  detailed_analysis:
    sections:
      - "Metric definitions"
      - "Data sources"
      - "Calculation methods"
      - "Trend analysis"
      - "Benchmarking"
      - "Action items"
  
  compliance_report:
    sections:
      - "Regulatory compliance"
      - "Security posture"
      - "Audit readiness"
      - "Risk assessment"
      - "Remediation plans"
      - "Training status"
```

## Security & Compliance KPIs

### Access Control Metrics

```sql
-- MFA adoption rate
SELECT 
    COUNT(DISTINCT CASE WHEN mfa.mfa_enabled THEN u.id END)::DECIMAL / 
    COUNT(DISTINCT u.id) * 100 as mfa_adoption_percentage,
    COUNT(DISTINCT CASE WHEN mfa.mfa_enabled AND mfa.mfa_method = 'totp' THEN u.id END) as totp_users,
    COUNT(DISTINCT CASE WHEN mfa.mfa_enabled AND mfa.mfa_method = 'sms' THEN u.id END) as sms_users
FROM users u
LEFT JOIN user_mfa_settings mfa ON mfa.user_id = u.id
WHERE u.is_active = true
  AND u.tenant_id = 'tenant-uuid';

-- Users without MFA requiring enforcement
SELECT 
    u.email,
    u.full_name,
    r.name as role_name,
    r.requires_mfa
FROM users u
JOIN user_roles ur ON ur.user_id = u.id
JOIN roles r ON r.id = ur.role_id
WHERE r.requires_mfa = true
  AND NOT EXISTS (
    SELECT 1 FROM user_mfa_settings mfa
    WHERE mfa.user_id = u.id AND mfa.mfa_enabled = true
  )
  AND u.is_active = true;

-- Failed MFA attempts (potential security risk)
SELECT 
    DATE_TRUNC('day', attempted_at) as date,
    COUNT(*) as failed_attempts,
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(DISTINCT ip_address) as unique_ips
FROM user_mfa_attempts
WHERE success = false
  AND attempted_at > NOW() - INTERVAL '7 days'
GROUP BY DATE_TRUNC('day', attempted_at)
ORDER BY date DESC;
```

### Data Access Audit Metrics

```sql
-- Patient data access volume
SELECT 
    DATE_TRUNC('day', accessed_at) as date,
    COUNT(*) as total_accesses,
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(DISTINCT patient_id) as unique_patients,
    COUNT(CASE WHEN access_type = 'export' THEN 1 END) as export_count
FROM data_access_logs
WHERE accessed_at > NOW() - INTERVAL '30 days'
  AND tenant_id = 'tenant-uuid'
GROUP BY DATE_TRUNC('day', accessed_at)
ORDER BY date DESC;

-- Top data accessors (for audit)
SELECT 
    u.email,
    u.full_name,
    COUNT(*) as access_count,
    COUNT(DISTINCT dal.patient_id) as unique_patients,
    array_agg(DISTINCT dal.access_type) as access_types
FROM data_access_logs dal
JOIN users u ON u.id = dal.user_id
WHERE dal.accessed_at > NOW() - INTERVAL '30 days'
  AND dal.tenant_id = 'tenant-uuid'
GROUP BY u.id, u.email, u.full_name
ORDER BY access_count DESC
LIMIT 20;

-- Suspicious access patterns
SELECT 
    dal.user_id,
    u.email,
    COUNT(*) as access_count,
    COUNT(DISTINCT dal.patient_id) as patient_count,
    MIN(dal.accessed_at) as first_access,
    MAX(dal.accessed_at) as last_access,
    MAX(dal.accessed_at) - MIN(dal.accessed_at) as access_duration
FROM data_access_logs dal
JOIN users u ON u.id = dal.user_id
WHERE dal.accessed_at > NOW() - INTERVAL '1 day'
GROUP BY dal.user_id, u.email
HAVING COUNT(*) > 100 OR COUNT(DISTINCT dal.patient_id) > 50
ORDER BY access_count DESC;
```

### Consent Management Metrics

```sql
-- Consent status breakdown
SELECT 
    consent_type,
    consent_status,
    COUNT(*) as count,
    COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (PARTITION BY consent_type) as percentage
FROM patient_consents
WHERE tenant_id = 'tenant-uuid'
GROUP BY consent_type, consent_status
ORDER BY consent_type, count DESC;

-- Consent withdrawal trends
SELECT 
    DATE_TRUNC('month', withdrawn_at) as month,
    consent_type,
    COUNT(*) as withdrawal_count
FROM patient_consents
WHERE withdrawn_at IS NOT NULL
  AND withdrawn_at > NOW() - INTERVAL '12 months'
  AND tenant_id = 'tenant-uuid'
GROUP BY DATE_TRUNC('month', withdrawn_at), consent_type
ORDER BY month DESC, withdrawal_count DESC;
```

### Security Breach Metrics

```sql
-- Active security incidents
SELECT 
    severity_level,
    status,
    COUNT(*) as incident_count,
    AVG(EXTRACT(EPOCH FROM (COALESCE(resolution_date, NOW()) - discovery_date)) / 86400) as avg_resolution_days
FROM security_breaches
WHERE tenant_id = 'tenant-uuid'
GROUP BY severity_level, status
ORDER BY 
    CASE severity_level 
        WHEN 'critical' THEN 1
        WHEN 'high' THEN 2
        WHEN 'medium' THEN 3
        WHEN 'low' THEN 4
    END;

-- Breach notification compliance
SELECT 
    sb.id,
    sb.breach_type,
    sb.discovery_date,
    sb.regulatory_notification_date,
    sb.patient_notification_date,
    CASE 
        WHEN sb.regulatory_notification_required AND sb.regulatory_notification_date IS NULL 
        THEN 'OVERDUE'
        WHEN sb.patient_notification_required AND sb.patient_notification_date IS NULL
        THEN 'OVERDUE'
        ELSE 'COMPLIANT'
    END as compliance_status
FROM security_breaches sb
WHERE sb.tenant_id = 'tenant-uuid'
  AND sb.status != 'closed'
ORDER BY sb.discovery_date DESC;
```

## Clinical Quality KPIs

### Preventive Care Compliance

```sql
-- Patients due for preventive screenings
WITH patient_age AS (
    SELECT 
        id,
        mrn,
        first_name || ' ' || last_name as name,
        EXTRACT(YEAR FROM AGE(date_of_birth)) as age,
        sex
    FROM patients
    WHERE tenant_id = 'tenant-uuid'
      AND is_active = true
)
SELECT 
    'Mammography' as screening_type,
    COUNT(*) as patients_due,
    COUNT(*) * 100.0 / (SELECT COUNT(*) FROM patient_age WHERE sex = 'female' AND age >= 40) as due_percentage
FROM patient_age pa
WHERE pa.sex = 'female'
  AND pa.age >= 40
  AND NOT EXISTS (
    SELECT 1 FROM imaging_orders io
    JOIN orders o ON o.id = io.order_id
    JOIN encounters e ON e.id = o.encounter_id
    WHERE e.patient_id = pa.id
      AND io.cpt_code = '77067'  -- Screening mammography
      AND o.ordered_at > NOW() - INTERVAL '2 years'
  )

UNION ALL

SELECT 
    'Colonoscopy' as screening_type,
    COUNT(*) as patients_due,
    COUNT(*) * 100.0 / (SELECT COUNT(*) FROM patient_age WHERE age >= 50) as due_percentage
FROM patient_age pa
WHERE pa.age >= 50
  AND NOT EXISTS (
    SELECT 1 FROM procedure_orders po
    JOIN orders o ON o.id = po.order_id
    JOIN encounters e ON e.id = o.encounter_id
    WHERE e.patient_id = pa.id
      AND po.cpt_code = '45378'  -- Colonoscopy
      AND o.ordered_at > NOW() - INTERVAL '10 years'
  );
```

### Immunization Coverage

```sql
-- Immunization coverage rates by vaccine
SELECT 
    i.vaccine_name,
    COUNT(DISTINCT i.patient_id) as immunized_patients,
    COUNT(DISTINCT p.id) as total_eligible_patients,
    COUNT(DISTINCT i.patient_id) * 100.0 / COUNT(DISTINCT p.id) as coverage_percentage
FROM patients p
LEFT JOIN immunizations i ON i.patient_id = p.id 
    AND i.administered_at > NOW() - INTERVAL '1 year'
WHERE p.tenant_id = 'tenant-uuid'
  AND p.is_active = true
  AND EXTRACT(YEAR FROM AGE(p.date_of_birth)) >= 18  -- Adult population
GROUP BY i.vaccine_name
ORDER BY coverage_percentage DESC;

-- Patients with incomplete immunization series
SELECT 
    p.mrn,
    p.first_name || ' ' || p.last_name as patient_name,
    i.vaccine_name,
    i.dose_number,
    i.total_series,
    i.next_due_at
FROM immunizations i
JOIN patients p ON p.id = i.patient_id
WHERE i.dose_number < i.total_series
  AND (i.next_due_at IS NULL OR i.next_due_at <= NOW() + INTERVAL '30 days')
  AND p.tenant_id = 'tenant-uuid'
ORDER BY i.next_due_at;
```

### Care Plan Adherence

```sql
-- Care plan intervention completion rates
SELECT 
    cp.care_plan_type,
    COUNT(DISTINCT cp.id) as total_care_plans,
    COUNT(DISTINCT CASE WHEN cp.status = 'active' THEN cp.id END) as active_plans,
    COUNT(cpi.id) as total_interventions,
    COUNT(CASE WHEN cpi.completion_status = 'completed' THEN 1 END) as completed_interventions,
    COUNT(CASE WHEN cpi.completion_status = 'completed' THEN 1 END) * 100.0 / 
        NULLIF(COUNT(cpi.id), 0) as completion_percentage
FROM care_plans cp
LEFT JOIN care_plan_interventions cpi ON cpi.care_plan_id = cp.id
WHERE cp.tenant_id = 'tenant-uuid'
  AND cp.created_at > NOW() - INTERVAL '6 months'
GROUP BY cp.care_plan_type
ORDER BY completion_percentage DESC;
```

## Scheduling & Resource KPIs

### Resource Utilization

```sql
-- Daily resource utilization summary
SELECT 
    resource_type,
    AVG(utilization_percentage) as avg_utilization,
    MIN(utilization_percentage) as min_utilization,
    MAX(utilization_percentage) as max_utilization,
    COUNT(*) as days_tracked,
    COUNT(CASE WHEN utilization_percentage > 80 THEN 1 END) as days_over_80_percent
FROM resource_utilization
WHERE tenant_id = 'tenant-uuid'
  AND utilization_date > NOW() - INTERVAL '30 days'
GROUP BY resource_type
ORDER BY avg_utilization DESC;

-- Staff utilization by provider
SELECT 
    s.first_name || ' ' || s.last_name as staff_name,
    s.staff_type,
    AVG(ru.utilization_percentage) as avg_utilization,
    SUM(ru.appointment_count) as total_appointments,
    SUM(ru.no_show_count) as total_no_shows,
    SUM(ru.no_show_count) * 100.0 / NULLIF(SUM(ru.appointment_count), 0) as no_show_rate
FROM resource_utilization ru
JOIN staff s ON s.id = ru.resource_id
WHERE ru.resource_type = 'staff'
  AND ru.tenant_id = 'tenant-uuid'
  AND ru.utilization_date > NOW() - INTERVAL '30 days'
GROUP BY s.id, s.first_name, s.last_name, s.staff_type
ORDER BY avg_utilization DESC;
```

### No-Show Tracking

```sql
-- No-show trends and penalties
SELECT 
    DATE_TRUNC('month', no_show_date) as month,
    COUNT(*) as total_no_shows,
    COUNT(DISTINCT patient_id) as unique_patients,
    SUM(penalty_amount) as total_penalties,
    SUM(CASE WHEN penalty_waived THEN penalty_amount ELSE 0 END) as waived_penalties,
    AVG(penalty_amount) as avg_penalty
FROM no_show_tracking
WHERE tenant_id = 'tenant-uuid'
  AND no_show_date > NOW() - INTERVAL '12 months'
GROUP BY DATE_TRUNC('month', no_show_date)
ORDER BY month DESC;

-- Repeat no-show offenders
SELECT 
    p.mrn,
    p.first_name || ' ' || p.last_name as patient_name,
    COUNT(*) as no_show_count,
    SUM(nst.penalty_amount) as total_penalties,
    MAX(nst.no_show_date) as last_no_show
FROM no_show_tracking nst
JOIN patients p ON p.id = nst.patient_id
WHERE nst.tenant_id = 'tenant-uuid'
  AND nst.no_show_date > NOW() - INTERVAL '6 months'
GROUP BY p.id, p.mrn, p.first_name, p.last_name
HAVING COUNT(*) >= 3
ORDER BY no_show_count DESC;
```

## RCM Enhanced KPIs

### Denial Management

```sql
-- Denial rate by payer
SELECT 
    pa.name as payer_name,
    COUNT(DISTINCT ch.id) as total_claims,
    COUNT(DISTINCT cd.id) as denied_claims,
    COUNT(DISTINCT cd.id) * 100.0 / NULLIF(COUNT(DISTINCT ch.id), 0) as denial_rate,
    SUM(cl.billed_amount) as total_billed,
    SUM(CASE WHEN cd.id IS NOT NULL THEN cl.billed_amount ELSE 0 END) as denied_amount
FROM claim_headers ch
JOIN claim_lines cl ON cl.claim_header_id = ch.id
LEFT JOIN claim_denials cd ON cd.claim_line_id = cl.id
JOIN payers pa ON pa.id = ch.payer_id
WHERE ch.tenant_id = 'tenant-uuid'
  AND ch.service_date > NOW() - INTERVAL '6 months'
GROUP BY pa.id, pa.name
ORDER BY denial_rate DESC;

-- Appeal success rate
SELECT 
    cd.denial_type,
    COUNT(DISTINCT cd.id) as total_denials,
    COUNT(DISTINCT ca.id) as total_appeals,
    COUNT(DISTINCT CASE WHEN ca.status = 'approved' THEN ca.id END) as successful_appeals,
    COUNT(DISTINCT CASE WHEN ca.status = 'approved' THEN ca.id END) * 100.0 / 
        NULLIF(COUNT(DISTINCT ca.id), 0) as appeal_success_rate
FROM claim_denials cd
LEFT JOIN claim_appeals ca ON ca.denial_id = cd.id
WHERE cd.tenant_id = 'tenant-uuid'
  AND cd.denial_date > NOW() - INTERVAL '6 months'
GROUP BY cd.denial_type
ORDER BY appeal_success_rate DESC;
```

### Payment Posting & Collections

```sql
-- Payment posting turnaround time
SELECT 
    pp.payment_type,
    COUNT(*) as payment_count,
    SUM(pp.payment_amount) as total_amount,
    AVG(EXTRACT(EPOCH FROM (pp.posted_at - pp.payment_date)) / 86400) as avg_posting_delay_days,
    COUNT(CASE WHEN pp.is_reconciled THEN 1 END) * 100.0 / COUNT(*) as reconciliation_rate
FROM payment_postings pp
WHERE pp.tenant_id = 'tenant-uuid'
  AND pp.payment_date > NOW() - INTERVAL '3 months'
GROUP BY pp.payment_type
ORDER BY total_amount DESC;

-- Patient AR aging with dunning status
SELECT 
    CASE 
        WHEN NOW()::DATE - ps.due_date <= 30 THEN '0-30 days'
        WHEN NOW()::DATE - ps.due_date <= 60 THEN '31-60 days'
        WHEN NOW()::DATE - ps.due_date <= 90 THEN '61-90 days'
        WHEN NOW()::DATE - ps.due_date <= 120 THEN '91-120 days'
        ELSE '120+ days'
    END as aging_bucket,
    COUNT(*) as statement_count,
    SUM(ps.patient_responsibility) as total_outstanding,
    COUNT(CASE WHEN dn.notice_level = 1 THEN 1 END) as first_notice,
    COUNT(CASE WHEN dn.notice_level = 2 THEN 1 END) as second_notice,
    COUNT(CASE WHEN dn.notice_level = 3 THEN 1 END) as final_notice,
    COUNT(CASE WHEN c.id IS NOT NULL THEN 1 END) as in_collections
FROM patient_statements ps
LEFT JOIN dunning_notices dn ON dn.statement_id = ps.id
LEFT JOIN collections c ON c.statement_id = ps.id
WHERE ps.status IN ('open', 'partial', 'sent_to_collections')
  AND ps.tenant_id = 'tenant-uuid'
GROUP BY aging_bucket
ORDER BY 
    CASE aging_bucket
        WHEN '0-30 days' THEN 1
        WHEN '31-60 days' THEN 2
        WHEN '61-90 days' THEN 3
        WHEN '91-120 days' THEN 4
        ELSE 5
    END;
```

### Charge Capture Audit

```sql
-- Charge capture quality scores
SELECT 
    DATE_TRUNC('month', captured_at) as month,
    COUNT(*) as audits_performed,
    AVG(audit_score) as avg_audit_score,
    COUNT(CASE WHEN audit_score < 80 THEN 1 END) as audits_below_threshold,
    SUM(missed_charges_value) as total_missed_revenue
FROM charge_capture_audit
WHERE tenant_id = 'tenant-uuid'
  AND captured_at > NOW() - INTERVAL '12 months'
GROUP BY DATE_TRUNC('month', captured_at)
ORDER BY month DESC;

-- Most common missed charges
SELECT 
    unnest(missed_charges)::jsonb->>'code' as missed_code,
    unnest(missed_charges)::jsonb->>'description' as description,
    COUNT(*) as frequency,
    SUM((unnest(missed_charges)::jsonb->>'amount')::DECIMAL) as total_missed_revenue
FROM charge_capture_audit
WHERE tenant_id = 'tenant-uuid'
  AND captured_at > NOW() - INTERVAL '6 months'
  AND missed_charges != '[]'::jsonb
GROUP BY missed_code, description
ORDER BY frequency DESC
LIMIT 20;
```

## KPI Monitoring and Alerting

### Alert Configuration
```yaml
alert_configuration:
  critical_alerts:
    - "System downtime"
    - "Security incidents"
    - "Data breaches"
    - "Compliance violations"
  
  warning_alerts:
    - "Performance degradation"
    - "High error rates"
    - "Capacity thresholds"
    - "Quality issues"
  
  informational_alerts:
    - "Scheduled maintenance"
    - "Feature releases"
    - "Training reminders"
    - "Report availability"
```

### KPI Tracking Implementation
```typescript
// KPI tracking implementation
class KPITracker {
  private metrics: Map<string, KPIMetric> = new Map();

  async trackMetric(metricName: string, value: number, metadata?: any) {
    const metric = this.metrics.get(metricName);
    if (metric) {
      await metric.recordValue(value, metadata);
      
      // Check thresholds
      if (metric.isThresholdExceeded(value)) {
        await this.triggerAlert(metricName, value, metric.threshold);
      }
    }
  }

  async generateReport(reportType: string, period: string) {
    const reportData = await this.collectReportData(reportType, period);
    return this.formatReport(reportData);
  }

  private async collectReportData(reportType: string, period: string) {
    // Collect data from various sources
    const systemMetrics = await this.getSystemMetrics(period);
    const clinicalMetrics = await this.getClinicalMetrics(period);
    const financialMetrics = await this.getFinancialMetrics(period);
    
    return {
      systemMetrics,
      clinicalMetrics,
      financialMetrics,
      period,
      generatedAt: new Date()
    };
  }
}

// KPI metric definition
interface KPIMetric {
  name: string;
  target: number;
  threshold: number;
  unit: string;
  description: string;
  recordValue(value: number, metadata?: any): Promise<void>;
  isThresholdExceeded(value: number): boolean;
}
```

This comprehensive KPI library provides the foundation for monitoring, measuring, and optimizing the performance of the athma-ce PMS/RCM platform across all critical dimensions of healthcare practice management.
