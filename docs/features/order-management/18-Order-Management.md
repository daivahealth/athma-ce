# Clinical Order Design in athma-ce

## Overview

This document defines the recommended clinical order design for athma-ce based on the current clinical schema, catalog model, and planned diagnostic workflows.

It replaces older generic documentation that described `orders`, `lab_orders`, and `imaging_orders` as the primary runtime tables. The current athma-ce implementation already uses `clinical_orders` as the shared clinical order header, plus report-oriented tables such as `lab_reports`, `lab_result_items`, `imaging_reports`, and `procedure_reports`.

## Purpose

The design must support:

- Direct clinician ordering of lab, imaging, and procedure items
- Package-driven ordering, such as annual health checks
- Shared encounter-level order history across order domains
- Specialty-specific execution workflows after the order is placed
- Tenant-level enablement of lab-only, imaging-only, or combined diagnostics
- Future extension without forcing specialty plugins for core diagnostics

## Core Design Decision

athma-ce uses a **shared order header plus specialty execution details** pattern.

The core runtime tables are:

- `clinical_orders`
- `package_orders` (proposed)
- `lab_order_tests` (proposed)
- future imaging/procedure detail tables
- existing result/report tables

The design principle is:

- `clinical_orders` records the shared EMR fact that a clinician placed an executable order
- specialty tables record what that department must actually perform
- report tables record the final clinical output

## Why `clinical_orders` Exists

`clinical_orders` is required because the EMR needs one shared runtime concept for:

- patient and encounter linkage
- who ordered and when
- priority
- broad order status
- cancellation
- clinical indication
- unified order history across lab, imaging, and procedures

Without `clinical_orders`, these shared fields would be duplicated in multiple specialty tables, and every patient or encounter order history query would become a union across lab, imaging, and procedure order tables.

## Current Runtime Tables in the Clinical Schema

The current schema already includes:

| Table | Role |
|---|---|
| `clinical_orders` | Shared order header for lab, imaging, and procedure orders |
| `lab_reports` | Lab reporting record linked to `clinical_orders` |
| `lab_result_items` | Structured analyte-level lab results |
| `imaging_reports` | Imaging reporting record linked to `clinical_orders` |
| `procedure_reports` | Procedure reporting record linked to `clinical_orders` |
| `packages` | Package catalog definition |
| `package_items` | Package composition definition |
| `lab_test_master` | Lab catalog |
| `imaging_study_master` | Imaging catalog |

The current `clinical_orders` table is the correct base header for future order design. The missing layer is not the header. The missing layer is the execution detail between ordering and final reporting.

## Recommended Runtime Model

### Shared Order Header

Use `clinical_orders` for all executable orders.

Recommended meaning:

- one row represents one executable departmental order
- `order_type` remains the shared discriminator, such as `lab`, `imaging`, or `procedure`
- the row is clinician-facing and cross-domain

Recommended shared fields in `clinical_orders`:

- `tenant_id`
- `encounter_id`
- `patient_id`
- `order_type`
- `order_code`
- `code_system`
- `order_name`
- `priority`
- `status`
- `clinical_indication`
- `special_instructions`
- `ordered_by`
- `ordered_at`
- coarse result summary fields such as `result_status` and `resulted_at`
- nullable `package_order_id` for package-derived orders

Do not overload `clinical_orders` with specialty operational fields such as specimen barcode, accession number, analyzer payload, modality scheduling specifics, or procedure anesthesia details.

### Package Ordering

Packages already exist as catalog definitions:

- `packages`
- `package_items`

These catalog tables should not be used as runtime patient order records.

Add a runtime table:

- `package_orders`

Recommended meaning:

- one row records that a patient or encounter has been assigned a package
- package fulfillment is then expanded into real executable `clinical_orders`

Recommended fields for `package_orders`:

- `id`
- `tenant_id`
- `package_id`
- `encounter_id`
- `patient_id`
- `ordered_by`
- `ordered_at`
- `status`
- `notes`

Recommended linkage:

- `clinical_orders.package_order_id` nullable foreign key to `package_orders`

This replaces any need for a separate boolean like `part_of_package`. The relationship itself already answers that question.

### Lab Ordering

For lab orders, add:

- `lab_order_tests`

Recommended meaning:

- one row per ordered lab test or panel member
- this is an ordering/execution detail table, not a report table

Recommended fields:

- `id`
- `tenant_id`
- `order_id`
- `lab_test_master_id`
- `test_code`
- `code_system`
- `test_name`
- `loinc_code`
- `cpt_code`
- `specimen_type`
- `collection_method`
- `fasting_required`
- `fasting_duration_hours`
- `sort_order`
- `status`

`lab_order_details` is optional and should be deferred for now. Add it only if order-level lab-only metadata grows enough that it no longer belongs in the shared header.

### Post-Order Lab Operations

Lab operations begin after ordering and are now modeled outside `clinical_orders` and `lab_order_tests`.

Current operational tables:

- `lab_specimens`
- `lab_specimen_tests`
- `lab_accessions`
- `lab_specimen_events`
- `lab_processing_runs`

Current meaning:

- `lab_specimens`: specimen workflow records linked to a lab `clinical_order`, including prepared pre-collection specimens and later collected physical samples
- `lab_specimen_tests`: junction rows allowing one specimen to satisfy one or more ordered lab tests, including tests coming from multiple compatible lab orders in the same patient encounter
- `lab_accessions`: lab-side receiving and accession registration state
- `lab_specimen_events`: append-only operational audit for collection, receiving, accessioning, rejection, processing, and result-entry milestones
- `lab_processing_runs`: manual/analyzer processing context per specimen and ordered test

Operational stage boundary in athma-ce v1:

1. `collection`
2. `receiving`
3. `accessioning`
4. `processing`
5. `result_entry`

The reporting layer remains separate:

- `lab_reports`
- `lab_result_items`
- `report_status_history`

Collection worklist design:

- collection is **specimen-first**, not order-row-first
- pending tests are grouped by patient encounter plus canonical lab collection profile
- canonical profile comes from `lab_test_master` with order-row values as fallback
- fasting is treated as a collection instruction on the group, not a primary splitter
- collection is surfaced in a separate pre-lab UI workspace, while `/results/lab/operations` begins at receiving
- collection uses a two-step workflow:
  1. prepare the specimen label and reserve barcode on a `pending_collection` specimen record
  2. confirm the actual blood draw by moving that prepared specimen to `collected`
- label printing is initiated from the collection workstation/app using the returned `.prn` payload; backend v1 does not directly manage Wi-Fi/Bluetooth printer connectivity

### Imaging Ordering

Imaging should use the same architectural pattern as lab, but with imaging-specific execution tables.

Recommended future tables:

- `imaging_order_details` or `imaging_order_studies`

Recommended meaning:

- one or more rows that capture imaging execution details such as modality, body part, contrast, scheduling, accession, and performing facility

Do not reuse lab tables for imaging execution. The architecture is shared. The operational tables are specialty-specific.

### Procedure Ordering

Procedure workflows should also use the same pattern.

Recommended future tables:

- `procedure_order_details`

Recommended meaning:

- procedure execution details such as anesthesia, facility requirements, estimated duration, pre-procedure instructions, and consent-related workflow hooks

## Order Granularity

### Direct Ordering

When a doctor directly orders:

- CBC
- Lipid Panel
- Serum Creatinine

the recommended model is:

- three separate rows in `clinical_orders`
- each row has `order_type = 'lab'`
- each row expands into its own `lab_order_tests` row or rows

Reason:

- each item is independently cancellable
- each item may have a different specimen requirement
- each item may have a different execution, result, and billing path
- each item is a real executable clinical order

### Package Ordering

When a doctor orders a package such as an annual health check:

the recommended model is:

1. create one row in `package_orders`
2. read package composition from `package_items`
3. expand package items into executable `clinical_orders`
4. create specialty detail rows under those generated orders

Example:

- annual health check package contains:
  - CBC
  - Lipid Panel
  - Serum Creatinine
  - Chest X-ray

Recommended runtime expansion:

- one row in `package_orders`
- one or more rows in `clinical_orders`
  - either:
    - three lab orders and one imaging order
  - or:
    - one grouped lab executable order plus one imaging executable order

For the current athma-ce direction, the simpler and more consistent recommendation is:

- direct orders stay atomic
- package expansion also produces atomic executable `clinical_orders`

That keeps package-derived work and directly ordered work on the same runtime model.

## Recommended v1 Decision for athma-ce

For the first implementation pass:

- keep `clinical_orders` as the shared runtime header
- add `package_orders`
- add `lab_order_tests`
- keep using existing `lab_reports` and `lab_result_items` for final lab results
- defer `lab_order_details`
- defer imaging and procedure detail tables until those modules are implemented

This gives athma-ce:

- a clean core order model
- package support without abusing catalog tables as runtime tables
- a realistic lab execution seam
- future imaging and procedure extensibility

## Status Boundaries

Use status fields at the correct level.

Recommended boundaries:

- `clinical_orders.status`
  - broad clinician-facing order state
  - examples: `ordered`, `in_progress`, `completed`, `cancelled`
- `lab_order_tests.status`
  - per-test execution state
  - examples: `ordered`, `queued`, `processing`, `resulted`, `cancelled`
- `lab_specimens.status`
  - per-specimen operational state
  - examples: `collected`, `received`, `rejected`, `stored`
- `lab_reports.report_status`
  - final reporting workflow
  - examples: `DRAFT`, `PRELIMINARY`, `FINAL`, `AMENDED`

Do not try to represent all operational states in `clinical_orders.status`.

## Reporting and Result Publication

The existing reporting model should remain the final output layer:

- `lab_reports`
- `lab_result_items`
- `imaging_reports`
- `procedure_reports`

These tables are not part of the initial clinician ordering act. They are generated or updated after specialty execution begins.

For lab specifically:

- `clinical_orders` + `lab_order_tests` represent the ordering layer
- specimen and accession tables represent the operational layer
- `lab_reports` + `lab_result_items` represent the reporting layer

This separation keeps “what was ordered,” “what was handled,” and “what was reported” distinct.

## Why Diagnostics Stay in Core Clinical Service

Lab and imaging should remain core clinical-service modules, not specialty plugins.

Reason:

- diagnostics are foundational EMR workflows
- they are needed across tenants, not only in niche specialties
- they must integrate deeply with encounters, charting, results, and patient history
- tenant-level enablement can be handled by feature flags and permissions without moving them into plugins

Specialty plugins remain appropriate for workflows that build on diagnostics, such as oncology overlays, but not for the base diagnostic order model itself.

## Tenant-Level Enablement

The design should support tenants using:

- lab only
- imaging only
- both
- neither

This is best handled by:

- module-level activation flags
- module-specific permissions
- validation that allowed `order_type` values match tenant or facility activation

This does not require separate pluginization of core diagnostic modules.

## Performance Considerations

Inserting into multiple tables for one clinical workflow is acceptable and expected.

Examples:

- direct lab order:
  - 1 row in `clinical_orders`
  - 1 or more rows in `lab_order_tests`
- package order:
  - 1 row in `package_orders`
  - multiple rows in `clinical_orders`
  - multiple rows in specialty detail tables

This is not a meaningful performance concern for normal OLTP healthcare workloads if:

- writes are wrapped in one database transaction
- foreign keys are indexed
- read paths are designed carefully
- unnecessary denormalization is avoided

The main risks are poor indexing and unclear runtime semantics, not the number of inserts by itself.

For patient-chart rendering specifically:

- do not flatten package-expanded child orders into the top-level chart list
- use a chart-facing grouped read model instead
- return standalone `clinical_orders` separately from `package_orders`
- include child executable orders under the package row only for expand or drilldown

Recommended chart-facing API behavior:

- `GET /clinical-orders/encounter/:encounterId`
  - raw executable orders for operational workflows
- `GET /clinical-orders/encounter/:encounterId/chart-view`
  - chart-facing grouped response with:
    - standalone direct orders
    - package summary rows
    - child executable orders nested under the package summary

This avoids changing the backend write model while keeping the doctor-facing chart concise.

## Example Runtime Flows

### Flow A: Direct Lab Ordering

Doctor orders:

- CBC
- Lipid Panel
- Serum Creatinine

Recommended runtime records:

- 3 rows in `clinical_orders`
- 3 rows in `lab_order_tests`
- later specimen, accession, and report rows as workflow progresses

### Flow B: Package Ordering

Doctor orders:

- Annual Health Check package

Package definition contains:

- CBC
- Lipid Panel
- Serum Creatinine
- Chest X-ray

Recommended runtime records:

- 1 row in `package_orders`
- expanded executable `clinical_orders` rows
- lab detail rows in `lab_order_tests`
- future imaging detail rows in imaging execution tables

Recommended patient-chart presentation:

- 1 package row in the chart
- expandable child orders nested beneath it
- no duplicate top-level child rows for orders generated from that package

## Non-Goals

This document does not define:

- the final API contract for new order-entry endpoints
- specimen/barcode schema in full detail
- imaging scheduling and accession details in full detail
- billing posting behavior for package expansion
- migration scripts

Those should be documented when implementation work begins.

## Relationship to Existing Documentation

This document is the canonical feature-level design for clinical order modeling in athma-ce.

Related references:

- `docs/features/clinical/21-EMR-Clinical-Data-Capture.md`
- `docs/architecture/03-Domain-Model.md`
- `docs/architecture/22-Data-Model-Summary.md`
- `docs/architecture/TABLE-DEFINITIONS.md`

Known documentation mismatch:

- some architecture and feature documents still describe older generic tables such as `orders`, `lab_orders`, and `imaging_orders`
- the actual schema already uses `clinical_orders` and report tables linked to it

Any implementation work on orders should reconcile those docs in the same session so code and docs do not drift further apart.
