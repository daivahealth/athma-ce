---
title: 'Glossary'
group: 'Reference'
order: 900
routes: []
description: 'The clinical, billing and setup terms you meet across the app, with the statuses and values each screen shows.'
---

**ABDM** — Ayushman Bharat Digital Mission, India's national digital health network. Switched on per tenant under **ABDM Settings** (`/configurations/abdm`), which needs the **Activation** switch and working **Gateway credentials**. See [Administration](administration.md).

**ABHA** — a patient's ABDM health account (a 14-digit number). The **ABHA** button on **Identity Documents** verifies an existing ABHA by OTP or creates a new one from Aadhaar. See [Patient access](patient-access.md).

**ABHA address** — the readable handle claimed for an ABHA (for example name@sbx). A newly created ABHA needs one before it can be used.

**Accessioning** — the lab stage after **Receiving**, where a received specimen is registered into the lab workflow. Next comes **Processing**, then **Result Entry**. See [Laboratory](lab.md).

**Adjustment** — a manual entry on the **Patient Ledger**: **Credit (reduce balance)** or **Debit (increase balance)**.

**Admission** — an inpatient stay. Its type is Elective, Emergency, Maternity, Day case or Transfer. See [Inpatient care](inpatient-care.md).

**Appointment** — a booked slot with a clinician. Statuses: **Scheduled**, **Confirmed**, **Checked In**, **In Progress**, **Completed**, **Cancelled**, **No Show**.

**AUC** — area under the curve, the target used to dose carboplatin. The app works out the dose with the Calvert formula, AUC × (CrCl + 25), capping CrCl at 125 mL/min. It cannot calculate an AUC dose without a CrCl.

**Batch** — a group of claims sent to a payer together. Types: professional, institutional, dental or pharmacy. Statuses: **Open**, **Closed**, **Submitting**, **Submitted**, **Acknowledged**, **Rejected**, **Partially processed**. See [Revenue cycle and claims](revenue-cycle.md).

**Bed** — a bookable bed in a ward. In **Bed Browser** a bed shows as **Available** (green), **Occupied** (red), **Cleaning** (blue) or **Maintenance** (amber).

**Billing item** — a priced service you can charge for, such as a lab test, consult, procedure, pharmacy item or package. Set up under **RCM Setup**. See [Billing setup](billing-setup.md).

**Biomarker** — a measured health marker in Wellness, with reference ranges and optional optimal ranges. Categories: metabolic, hormonal, inflammatory, cardiovascular, genetic, cellular, nutrient. See [Wellness](wellness.md).

**BSA** — body surface area in m². The app calculates it from height and weight with the Mosteller formula and uses it for mg/m² chemo doses.

**Care Context** — a workspace that brings together one patient's encounters, timeline and external records. It opens from the round **Open Care Context** button, which only appears once the patient has enough encounters (5 unless your organisation has changed it).

**Care plan** — an oncology plan of planned treatment for a cancer diagnosis. Statuses: draft, active, on hold, revised, completed, cancelled. See [Oncology](oncology.md).

**Catalog** — a master list under **Clinical Catalogs** (`/catalogs`): Value Sets, Packages, Administrative Services, Vital Signs Templates, Medications, Diagnoses, Lab Tests, Observation Codes, Imaging Studies, Procedures, Note Templates, Checklist Templates and Form Master.

**Catalog mapping** — the link between a clinical catalog entry and the billing item that charges for it.

**Charge posting rule** — a rule that creates a charge automatically when something happens, such as a lab test being ordered, a medication being dispensed or the daily bed charge.

**Checklist template** — a reusable checklist for a step of care: Admission, Discharge, Transfer, Pre-operative, Post-operative, Surgery, Procedure, Outpatient visit or Emergency.

**Chemo order** — a single cycle of a chemo protocol ordered for a patient, with the BSA it was dosed on. Statuses: **Pending**, **Approved**, **Verified**, **In Progress**, **Completed**, **Held**, **Cancelled**.

**Chemo protocol** — a reusable chemotherapy template, made up of phases of identical cycles, each with its drug lines, doses, days and dose basis. See [Oncology](oncology.md).

**Claim** — a request for payment sent to a payer. Statuses run from **Draft**, **Pending**, **Ready**, **Scrubbing**, **Validated** or **Failed validation**, through **Submitted**, **Acknowledged**, **Pending adjudication** and **Adjudicated**, to **Paid**, **Partially paid**, **Rejected**, **Denied**, **Appealed** or **Cancelled**.

**Coding session** — a piece of medical coding work on an encounter. Statuses: New, Pending, In Review, Returned, Completed, Submitted. See [Billing](billing.md).

**Configuration level** — the layer a setting comes from in **System Configurations**: **Instance Level**, then tenant, then facility. The **Effective** view shows the values actually in use.

**Consent** — a patient's permission to pull their health records from an outside exchange. **External records** shows it as **Consent granted**, **Consent expiring**, **Consent expired**, **Consent revoked** or **No consent**.

**CPT** — the procedure coding system used by default for procedure codes in medical coding, and in the imaging and procedure catalogs.

**CrCl** — creatinine clearance in mL/min. You enter it when you create a treatment schedule. It is optional unless the protocol has AUC-dosed drugs.

**Credit note** — a document that reduces what a patient owes on a bill. Statuses: **Draft**, **Posted**, **Voided**.

**Critical value** — a lab result far outside its reference range: at or below half the low limit, or at or above one and a half times the high limit. Result entry flags it **critical_low** or **critical_high** in red. Results that are only out of range show **low** or **high** in amber.

**Cycle** — one repeat of a chemo protocol phase, lasting a set number of days. Doses are planned by cycle and day, for example C1 D1.

**Day-care Worklist** — the list of every scheduled treatment day on a given date, for the day-care unit and pharmacy.

**Debit note** — a document that adds to what a patient owes. Statuses: **Draft**, **Posted**, **Voided**.

**Discharge** — the process of ending an admission. Statuses: **Planning**, **Ready**, **Approved**, **Discharged**, **Cancelled**. **Start Planning** begins it.

**Discharge summary** — the clinical document written at discharge, listed under **Discharge Summaries**.

**Dispensing** — issuing medicines against a prescription or over the counter. Statuses: queued, verified, dispensed, partially dispensed, cancelled, returned. See [Pharmacy](pharmacy.md).

**Dose level** — a preset dose reduction on a protocol drug line, such as DL−1 or DL−2, used when a patient cannot take the full dose.

**Eligibility** — a check with a payer on whether a patient's cover is active and what it pays for. Results: **Accepted**, **Rejected**, **Error**.

**Encounter** — one episode of care for a patient: a clinic visit, emergency attendance, admission or virtual consult. See [Patient access](patient-access.md).

**Encounter class** — the care setting of an encounter. When you create one you choose **Ambulatory**, **Emergency**, **Virtual**, **Inpatient** or **Home Health**.

**Encounter priority** — **Routine**, **Urgent**, **ASAP**, **STAT** or **Elective**.

**Encounter status** — where an encounter has got to: **Planned**, **Arrived**, **Triaged**, **In Progress**, **Finished** or **Cancelled**.

**Facility** — one hospital or clinic site within a tenant. Its structure runs facility, department, ward or clinic, then space. The facility you are working in shows at the foot of the sidebar.

**Fee schedule** — a price list. **Authority** schedules come from a regulator (DHA, DOH, MOHAP, HAAD), **Tenant** schedules are your own prices, and **Contract** schedules belong to a payer contract. Statuses: active, inactive, draft, expired.

**Form Master** — OpenMedForm form definitions that you upload so clinicians can fill them in against a patient's encounter.

**Fraction** — one radiation treatment session. Statuses: scheduled, delivered, missed, cancelled, rescheduled.

**HIP** — Health Information Provider, the ABDM role a facility plays when it holds records. Each facility is usually its own HIP, so ABDM credentials are normally stored per facility.

**ICD-10** — the diagnosis coding system used by default for diagnosis codes in medical coding. The **Diagnoses** catalog holds the ICD releases.

**Invoice** — a patient bill. Statuses: **Unpaid** (orange), **Partial** (amber), **Paid** (green), **Cancelled** (rose). See [Billing](billing.md).

**Lab report status** — **Draft**, **Preliminary**, **Final**, **Amended**, **Corrected** or **Cancelled**.

**LOINC** — the coding system used for lab tests in the **Lab Tests** catalog.

**Membership plan** — a paid plan in a tier (basic, standard, premium, platinum, VIP) with benefits and a billing cycle: monthly, quarterly, semi-annual or annual. See [Membership](membership.md).

**MRN** — medical record number, the patient's identifier within your organisation. It appears in patient headers, and you can search by it on most patient lists.

**OT Board** — the live view of the operating theatres, showing what is happening in each room on the day.

**OT report** — the operation note for a case. Statuses: Draft, Signed, Amended, Cancelled.

**OT request** — a request to book surgery. Priority: Elective, Urgent or Emergency. Statuses: **Draft**, **Requested**, **Under Review**, **Approved**, **Rejected**, **Scheduled**, **Cancelled**, **Completed**. See [Operating theatre](operating-theatre.md).

**OT room** — a space set up for use as an operating theatre, with an optional specialty.

**OT schedule** — the booked slot for an approved request. Day-of-surgery statuses: **Planned**, **Confirmed**, **Patient Ready**, **Patient In Ot**, **Anaesthesia Started**, **Surgery Started**, **Surgery Completed**, **Patient Shifted To Recovery**, plus **Cancelled** and **Postponed**.

**Package** — a bundle of services sold as one item: health check, surgical bundle, maternity bundle, pre-employment, annual checkup or custom.

**Patient Ledger** — a patient's running account of invoices, receipts, credit notes, debit notes, refunds, adjustments and opening balance. Entries can be reversed.

**Payer** — whoever pays the bill: insurance, TPA, government, corporate, or self/cash. See [Billing setup](billing-setup.md).

**Payer contract** — your agreement with a payer: fee-for-service, capitation, bundled or value-based. Statuses: active, draft, suspended, expired.

**Permission** — a single allowed action in **RBAC**. Permissions are grouped into roles.

**Phase** — a block of identical cycles within a chemo protocol, for example AC then Paclitaxel. Each phase has its own colour on the schedule.

**Plugin** — an optional module that is switched on in **Plugin Management**. Oncology is a plugin.

**PreAuth** — prior approval from a payer before treatment. Urgency: routine, urgent or emergency. Statuses: **Draft**, **Pending**, **Submitted**, **Approved**, **Partially approved**, **Denied**, **Cancelled**, **Expired**.

**PRM event** — something that happened to a patient (for example an appointment confirmed, a lab result ready or a payment overdue) that engagement rules can react to. See [Patient engagement](patient-engagement.md).

**PRM rule** — an engagement rule. When a matching event arrives it either sends a message or creates a task, straight away or after a delay.

**PRM task** — a follow-up job created by a rule. Statuses: pending, in progress, completed, cancelled, skipped.

**PRM template** — message wording for a channel (SMS, WhatsApp, email, in-app or push). Statuses: draft, pending, approved, rejected.

**Receipt** — a record of payment allocated against one or more invoices. Methods: **Cash**, **Card**, **UPI**, **Bank transfer**, **Wallet**.

**Refund** — money returned to a patient. Statuses: **Pending**, **Approved**, **Rejected**, **Processed**, **Voided**. Methods: Cash, Card reversal, Bank transfer, Cheque, Wallet, Other.

**Regimen** — the drugs, doses, routes and days in a chemo protocol, laid out phase by phase.

**Remittance** — a payer's payment advice explaining what was paid on which claims. Statuses: **Received**, **Processing**, **Processed**, **Reconciled**, **Error**.

**Role** — a named set of permissions given to users, managed in **RBAC**. See [Administration](administration.md).

**Space** — a physical room or area in a facility, such as a bed, consulting room or theatre, with a type, floor and capacity.

**Specimen** — the sample taken for a lab test. It moves through **Lab Collection**, then **Receiving** (where it can be rejected with a reason), **Accessioning**, **Processing** and **Result Entry**.

**Staging system** — the scheme used to stage a cancer: AJCC TNM, UICC TNM, FIGO, Ann Arbor, Rai, Binet, Dukes, Gleason or Other.

**Subscription** — a patient's membership of a plan. Statuses: pending, active, paused, past due, cancelled, expired.

**Tenant** — your organisation's separate space in the app. Its data, settings, roles and catalogs are kept apart from every other tenant's.

**TNM** — tumour, node and metastasis staging. You record it as **Clinical**, **Pathological**, **Restaging** or **Recurrence**. A staging record's status is **Active**, **Superseded** or **Entered in Error**.

**Treatment day** — one day of a treatment schedule. Statuses: planned, ordered, given, held, skipped, cancelled.

**Treatment intent** — why a cancer is being treated: curative, adjuvant, neoadjuvant, palliative, surveillance or supportive.

**Treatment modality** — the kind of cancer treatment: surgery, chemotherapy, radiation, immunotherapy, hormonal, targeted, palliative or surveillance.

**Treatment schedule** — a patient's dated chemo course, built from a protocol, a C1 D1 date, height, weight and (if needed) CrCl. Statuses: active, on hold, completed, cancelled.

**Triage level** — urgency on a five-level scale: **Level 1 · Critical**, **Level 2 · Emergency**, **Level 3 · Urgent**, **Level 4 · Semi-urgent**, **Level 5 · Non-urgent**. New triage forms start at Level 5. See [Charting and triage](clinical-charting.md).

**Tumor board** — a multidisciplinary meeting that reviews a cancer case and agrees a recommendation. Statuses: scheduled, in review, completed, deferred.

**Value set** — a controlled list of coded options (concepts) behind dropdowns across the app. It can be translated and overridden per tenant.

**Ward** — an inpatient unit made up of beds. **Ward Board** shows each patient with flags such as **NPO**, **Telemetry**, **Isolation**, **Allergies** and fall risk.
