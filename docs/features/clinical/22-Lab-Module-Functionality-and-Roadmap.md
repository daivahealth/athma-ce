# Lab Module Functionality and Roadmap

## Purpose

This document summarizes:

- what the lab module supports today
- how the current workflow behaves
- what remains pending

Use this as the feature-level reference for lab operations and reporting. For endpoint details, see [LAB-OPERATIONS-API.md](../../api/LAB-OPERATIONS-API.md).

## Current Scope

The lab module currently covers:

- lab order execution inside the clinical domain
- specimen lifecycle management
- accession and internal lab workflow
- structured analyte result reporting
- narrative pathology-style reporting
- order-level result viewing and printing
- TAT visibility on the order-level result screen

The lab module is still part of the same shared diagnostic order architecture:

- `clinical_orders`
- `lab_order_tests`
- `lab_specimens`
- `lab_accessions`
- `lab_processing_runs`
- `lab_reports` + `lab_result_items`
- `pathology_reports`

## Available Functionality

### 1. Order and Catalog Foundations

Available now:

- `lab_test_master` supports orderable lab tests and panels
- lab tests now carry:
  - `report_style`
  - `lab_discipline`
  - `turnaround_time_hours`
- the lab catalog frontend exposes these fields on:
  - the lab test list
  - the lab test detail page
  - the lab test maintenance dialog
- `observation_code_catalog` supports canonical analytes such as CBC components
- `lab_test_result_templates` supports panel hierarchies for structured result entry

Available report styles:

- `structured`
  - CBC, chemistry, routine analyte-style reporting
- `narrative`
  - histopathology and similar pathology-style reporting

Seeded examples:

- `LAB-001` Complete Blood Count (CBC) → `structured`
- `LAB-015` Blood Culture → `structured`
- `LAB-019` Histopathology Examination → `narrative`

### 2. Specimen Collection Workflow

Available now:

- pre-collection specimen preparation
- barcode generation and label preparation
- reprint of prepared labels
- grouped collection queue by normalized specimen profile
- collection handoff before the specimen reaches the lab

Current frontend route:

- `/results/lab/collection`

### 3. Lab Internal Operations Workflow

Available now:

- receiving
- accessioning
- specimen rejection with in-app rejection dialog
- processing start
- result-entry queue

Current frontend route:

- `/results/lab/operations`

Current worklist stages:

- `receiving`
- `accessioning`
- `processing`
- `result-entry`

### 4. Structured Lab Reporting

Available now:

- draft lab report creation
- analyte result entry through `lab_reports` and `lab_result_items`
- panel template seeding from `lab_test_result_templates`
- grouped panel rendering with flat underlying storage
- CBC hybrid layout:
  - flat CBC rows
  - grouped `Differential Count`
- preliminary/final/amended workflow
- printable order-level lab result screen

Current frontend route:

- `/results/lab/:orderId`

Key design rule:

- stored analyte values remain flat in `lab_result_items`
- grouped hierarchy is derived from the template layer

### 5. Narrative Pathology Reporting

Available now:

- pathology/histopathology remains inside the same lab module
- the same specimen/accession/processing workflow is reused
- narrative reporting is stored in `pathology_reports`
- the order-level report page automatically switches by `lab_test_master.report_style`
- sectioned pathology editor currently supports:
  - clinical history
  - specimen received
  - gross description
  - microscopic description
  - diagnosis
  - comment
  - internal notes

Current behavior:

- pathology orders still show in `/results/lab`
- pathology rows use the same lab queue and result pages
- narrative rows display as `Narrative` instead of `0` analyte items in the list

### 6. Result Visibility and Reporting Queue

Available now:

- `/results/lab` is fed by aggregated patient results
- lab orders become visible in the reporting queue as soon as processing starts
- specimen type and specimen number are shown in the list
- duplicate draft rows are collapsed to one visible row per lab order
- order-level pages show:
  - specimen number
  - accession number
  - collection date/time
  - received date/time
  - workflow timeline
  - TAT status

### 7. Workflow Consistency and TAT

Available now:

- manual result reporting backfills processing when needed
- reported results no longer remain logically ahead of processing
- order-level result pages compute TAT from `lab_test_master.turnaround_time_hours`
- TAT states currently shown:
  - within TAT
  - approaching TAT
  - TAT met
  - TAT breached

## Current Limitations

The lab module is functional, but still limited in several areas.

### Reporting Structure Gaps

- microbiology does not yet have a dedicated hybrid report model
- susceptibility, isolate, and culture-specific structured tables are not implemented
- pathology does not yet support block/cassette/slide/stain-level tracking
- pathology does not yet support addendum-specific workflow beyond standard report amendment/versioning

### Workflow/UI Gaps

- the legacy route `/results/lab/operations/result-entry/:labOrderTestId` still exists, although the preferred flow now opens `/results/lab/:orderId`
- the worklist does not yet visually distinguish structured vs narrative result-entry rows
- lab list search is still disabled on the frontend
- no dedicated dashboard yet exists for overdue TAT monitoring across all lab work

### Catalog and Governance Gaps

- only seeded/default narrative tests are available unless DB/API updates are done separately
- no dedicated governance screen yet exists for lab-discipline-specific reporting rules

### Analyzer/Interface Gaps

- analyzer ingestion is still primarily oriented around structured analyte rows
- no dedicated machine payload reconciliation workflow exists for narrative disciplines
- no instrument integration-specific microbiology or pathology adapter layer exists yet

## Pending Work

### High Priority

- add a lab-wide TAT queue or dashboard for breached/near-breach work
- clearly label structured vs narrative rows in the result-entry worklist
- add reportable seeded examples for cytology and additional pathology test types

### Medium Priority

- implement microbiology hybrid reporting
  - organism
  - colony count
  - sensitivities
  - narrative interpretation
- support printable pathology report formatting tuned for sign-out workflows
- support multiple narrative lab disciplines beyond histopathology with discipline-specific defaults

### Longer-Term / LIS Depth

- block/cassette/slide/stain tracking for pathology
- analyzer/interface reconciliation workflows
- addendum-specific pathology workflow
- richer lab QA and audit dashboards
- workload and TAT analytics by discipline, instrument, and operator

## Recommended Next Steps

Recommended implementation order:

1. Add a lab TAT monitoring list for overdue work.
2. Build microbiology hybrid reporting.
3. Expand pathology to support deeper specimen-part and sign-out workflows.

## Related Documentation

- [EMR / Clinical Data Capture](./21-EMR-Clinical-Data-Capture.md)
- [Clinical Order Design](../order-management/18-Order-Management.md)
- [Lab Operations API](../../api/LAB-OPERATIONS-API.md)
- [Data Model](../../architecture/05-Data-Model.md)
