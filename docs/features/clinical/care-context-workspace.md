# Care Context Workspace

The Care Context workspace is a single-screen clinician view that composes a
patient's clinical, revenue-cycle, and wellness data into three panes. It opens
at `/[locale]/patients/[patientId]/care-context`.

## Purpose

Care Context gives a clinician the full context of a patient in one screen:
who the patient is, what has happened clinically, the administrative and
financial state of each encounter, and — for oncology patients — the cancer
journey. It reuses existing hooks and services rather than adding new read
paths, and renders honest placeholders where a backing service is absent.

## Access & gating

- Entry points: a circular icon button next to every **View Patient 360**
  button (patients list, patient chart, Patient AI+).
- The workspace is intended for information-rich patients. A patient with fewer
  than 10 encounters is redirected to the existing Patient 360 view.
- Opening the workspace auto-collapses the app sidebar to maximize width.

## Layout

Three panes, each scrolls independently with a subtle scrollbar and a fixed
header section:

| Pane | Contents |
|------|----------|
| Left rail | Patient identity and context (see below) |
| Center | Encounter/clinical timeline with a view toggle |
| Right | Selected-encounter detail and claim pipeline |

### Left rail — Patient Context

Sections, top to bottom:

- **Identity** (fixed) — avatar, name, status, age, MRN, **Risk Flags**, and
  **Call / Message / New encounter** actions. Collapsing the rail shows a
  vertical MRN · name · age · gender summary plus the three action buttons.
- **Vitals** — latest observations.
- **Biomarkers** — results recorded within the past **3 months**, each with
  value, an interpretation status (High / Low / Borderline / In range), and the
  collection date. Hidden when the patient has no results in the window.
- **Personal Information**, **Contact Information**, **Emergency Contact** —
  rendered as inline label/value rows.
- **Medical Information** — allergies, active conditions, active medications.
- **Care Team** — every clinician the patient has seen, **doctors first**, then
  other members, most-recent first. Each entry shows the clinician's name, role
  (staff type and primary specialty), the encounter type they were seen for, and
  the visit count. Clicking a member filters the center encounter list to that
  practitioner and selects their most recent encounter; a clear control removes
  the filter.
- **Insurance Information**, **Identity Documents**, **Previous Encounter**,
  **Next Appointment**, **Audit Information**.

### Center — Timeline

A fixed toggle selects one of three views; the encounter cycler (also bound to
the `←` / `→` arrow keys) steps through encounters:

| View | Shows |
|------|-------|
| **Encounters** | Flat list with an administrative/financial summary per encounter (pre-auth, claims, denials, invoice balance) |
| **Timeline** | Reverse-chronological encounters with the clinical narrative, plus a Care Narrative AI summary card |
| **Cancer** | The oncology Cancer Timeline (see below); shown only for patients with more than 10 cancer-timeline events |

The center pane also hosts the **Care Narrative** card and the **External
Records** (HIE) panel.

### Right — Encounter detail

A fixed header shows the selected encounter (number, type, status, date,
practitioner, class and priority chips, chief complaint) with **Results** and
**Clinical charting** actions. Below it, stacked scrollable sections:

- **Results** — encounter-linked observations.
- **Documents** — the encounter's reports (see [Documents](#documents)).
- **Claims**, **Pre-Auth**, **Denials & Appeals**, **Invoices**, **Policy** —
  the RCM claim pipeline for the encounter.

## Data sources

The workspace composes existing endpoints. Notable ones:

| Section | Endpoint |
|---------|----------|
| Encounters / patient | `GET /encounters`, `GET /patients/:id` |
| Biomarkers | `GET /wellness/biomarkers/results/patient/:patientId` (filtered by `startDate`) |
| Care Team | derived from the patient's encounters + `GET /staff` |
| Cancer Timeline | `GET /plugins/oncology/timeline/:patientId` |
| Documents | `GET /patient-results/encounter/:encounterId` |
| Claim pipeline | RCM claims / pre-auth / denials / invoices endpoints |
| Care Narrative | `POST /ai/patients/:patientId/narrative` (falls back to a local preview when no LLM provider is configured) |
| External Records | `POST /plugins/oncology`-independent HIE fetch endpoints |

### Documents

The **Documents** section lists an encounter's reports via
`GET /patient-results/encounter/:encounterId`, which aggregates lab, imaging,
and procedure reports scoped to the tenant and encounter. Each row shows the
report name, a type chip, the report status, the date, and a type-specific
summary (imaging impression, lab result counts, or procedure description). This
section covers reports and imaging; uploaded file attachments and referrals are
not yet in scope.

## Cancer Timeline

For oncology patients, the **Cancer** tab renders the same grouped, color-coded
timeline as the standalone `/oncology/timeline/[patientId]` page: diagnosis,
staging, tumor board, care plan, a grouped chemotherapy course, surgery,
response assessment, and follow-ups. It reads from
`GET /plugins/oncology/timeline/:patientId`, which is populated from the
`plugin_oncology.cancer_timeline_events` append-only log.

## Demo data

The oncology demo patient (MRN `MRN-2025-003`) is seeded with a five-year
Stage IIIB colorectal journey. Relevant seeds:

| Seed | Populates |
|------|-----------|
| `seed/clinical/28-oncology-demo-journey.sql` | Encounters, observations, and the oncology registry tables |
| `seed/clinical/29-oncology-timeline-events.sql` | `cancer_timeline_events` for the Cancer tab |
| `seed/clinical/30-encounter-charts.sql` | Smart-charting `encounter_notes` + `encounter_diagnoses` (filled charts) |
| `seed/clinical/31-encounter-documents.sql` | Orders + lab/imaging/procedure reports for the Documents section |
| `seed/clinical/32-biomarker-results.sql` | Recent biomarker results for the Biomarkers section |

The navigation modules that surface these features are enabled via the
`feature.nav.*` flags seeded in `seed/foundation/01-core.sql`.
