---
"@zeal/frontend": minor
---

Add a Patient **Care Context** workspace at `/patients/[id]/care-context`: a three-pane view that composes existing clinical + RCM data into one screen — a patient context rail (identity, vitals, demographics, coverage, conditions, medications, next appointment), an encounters/timeline column, and a per-encounter detail panel with a claim pipeline (Encounter, Claims, Pre-Auth, Denials).

It reuses existing hooks (`usePatient`, `usePatientEncounters`, `usePatientAppointments`, `usePatientPolicies`, `useClaims`, `usePreAuthRequests`) and adds a thin `useLatestObservations` hook for vitals. Capabilities that require net-new backend services — the AI care narrative, denials & appeals, claim-pipeline orchestration, and aggregate per-encounter financials — are rendered as clearly-labelled placeholders rather than fabricated data, and are tracked as follow-ups.

A circular `+` entry button is added next to every existing "Patient 360" button (patients list, patient chart, and Patient AI+) to open the Care Context view.
