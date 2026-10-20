---
title: 'Oncology'
group: 'Clinical care'
order: 60
routes: ['/oncology/registry', '/oncology/staging', '/oncology/tumor-board', '/oncology/care-plans', '/oncology/protocols', '/oncology/orders', '/oncology/treatment-plans', '/oncology/day-care', '/oncology/radiation', '/oncology/catalogs', '/oncology/timeline']
description: 'The cancer pathway from the Oncology Registry through staging, tumour board and care plans to chemo protocols, chemo orders, treatment schedules, the day-care worklist, radiation therapy, catalogs and the cancer timeline.'
---

Shown when your organisation has Oncology switched on.

The **Oncology** section of the sidebar follows a patient's cancer care in the order it happens. Each
step leans on the one before it:

1. **Oncology Registry**: record the cancer diagnosis. Everything else hangs off this record.
2. **Tumor Staging**: record a TNM (or other) staging against the diagnosis.
3. **Tumor Board**: schedule the case for the multidisciplinary team (MDT) and record its decision.
4. **Care Plans**: write the treatment plan, one row per modality (surgery, chemotherapy, radiation…),
   each with its own schedule and, for chemotherapy, its protocol.
5. **Chemo Protocols**: the hospital's library of regimens the care plan picks from.
6. **Treatment Schedules**: turn the care plan's chemotherapy into a dated, cycle-by-cycle schedule.
7. **Chemo Orders**: one order per treatment day, taken through approval, verification and
   administration.
8. **Day-care Worklist**: everyone due on a date, with administration sheets and a pharmacy prep list.
9. **Radiation Therapy**: prescriptions, simulation, planning, fractions and reviews.
10. **Catalogs**: the reference lists (cancer types, sites, histologies) the forms pick from.
11. **Cancer Timeline**: one patient's whole journey on a single line.

A patient can have more than one diagnosis (a second primary, or a recurrence tracked separately).
Staging, tumour board cases, care plans and orders always belong to one diagnosis.

### Picking the patient and the diagnosis

The **Add** and **Create** forms on these screens start the same way:

1. Under **Select Patient**, search for the patient. Once chosen, they show in a blue banner with their
   MRN, age, gender and phone. **Change** picks someone else.
2. If the patient has exactly one active diagnosis it is chosen for you and shows in a rose banner
   (cancer type, site, laterality, diagnosis date, spread, status, grade, histology). If they have more
   than one, pick it under **Select Cancer Diagnosis**; **Change** on the banner lets you pick again.
3. The rest of the form appears only once a diagnosis is chosen.

**If instead:** the card says "No active cancer diagnoses found." Only diagnoses with clinical status
**Active** are offered. Press **Add one first** to register the diagnosis, or edit the existing one back
to Active.

The save button stays greyed out until every field marked with `*` is filled. These screens do not show a
message when the server refuses a save: the form simply stays open. If that happens, check your entries
and try again, and report it if it persists.

### Status colours

Statuses on the care plan, tumour board, chemo order, treatment schedule and treatment day screens share
one set of colours, shown as a badge with a dot:

| Status | Colour | Meaning |
| --- | --- | --- |
| **draft** | Slate | Not yet in use |
| **planned** | Sky | A treatment day still to come |
| **pending** | Amber | A chemo order waiting for approval |
| **in review** | Purple | A tumour board case being discussed |
| **revised** | Cyan | A care plan replaced by a newer version |
| **scheduled**, **ordered** | Blue | Booked; a treatment day with an order |
| **approved** | Indigo | Order signed off by pharmacist or physician |
| **verified** | Teal | Order checked by the nurse at the bedside |
| **active** | Green | In force |
| **in progress** | Violet | Infusion under way |
| **given**, **completed** | Emerald | Done |
| **held**, **on hold** | Orange | Paused |
| **deferred** | Amber | Tumour board case put off |
| **skipped** | Slate | Deliberately left out |
| **cancelled** | Rose | Will not happen |

Treatment intents have their own colours: **curative** green, **adjuvant** blue, **neoadjuvant** indigo,
**palliative** purple, **surveillance** amber, **supportive** teal. So do modalities on a care plan:
surgery rose, chemotherapy violet, radiation amber, immunotherapy teal, hormonal fuchsia, targeted indigo,
palliative purple, surveillance sky.

A chemo protocol's phases are coloured by their position, in this order: sky, violet, emerald, orange,
fuchsia. The same colour marks the phase in the protocol builder, on the treatment schedule's cycle
cards and on the day-care worklist.

## Oncology Registry

**Oncology Registry** (`/oncology/registry`) lists every registered cancer diagnosis, one row per
diagnosis.

- **Patient**: name, MRN, gender and age.
- **Cancer Type** and **Primary Site**.
- **Stage**: the latest stage group, such as **Stage IIIA**, or **Not staged**.
- **Metastatic**: **localized** green, **regional** yellow, **distant** red, **unknown** grey.
- **Clinical Status**: active, remission, recurrence, relapsed or resolved.
- **Diagnosis Date**.
- **Care Plan**: the status of the diagnosis's care plan, or **None**.
- A pencil at the end of the row opens the diagnosis for editing.

Search by patient name or MRN, and filter by clinical status. The count of patients is under the table.

### Add a diagnosis

**Go to:** **Add to Registry** (`/oncology/registry/new`).

1. Pick the patient.
2. Under **Cancer Identity**, choose the **Cancer Type** (type to search). The **Primary Site** list then
   shows only the sites mapped to that cancer type, marked "(filtered for selected cancer type)", with the
   usual site marked **(default)**. If the cancer type has no mapped sites, every site is offered.
3. Choosing a site fills **Site Code (ICD-O-3)**; choosing a **Histology / Morphology** fills
   **Morphology Code (ICD-O-3)**. You can overwrite either code.
4. Optionally set **Laterality** and **ICD-10 Code**.
5. Under **Clinical Assessment**, enter the **Diagnosis Date** and, if known, **Grade** (G1 to G4, GX),
   **Metastatic Status**, **ECOG Performance Status**, **Clinical Status** (default Active),
   **Verification Status** (default Confirmed), **This is a recurrence** and **Notes**.
6. Press **Add to Registry**.

**Check:** you are back on the registry and the patient is listed.

The cancer types, sites and histologies come from [Catalogs](#catalogs). If what you need is missing,
ask whoever maintains the catalogs to add it.

### Edit a diagnosis

The pencil opens **Edit Diagnosis** (`/oncology/registry/diagnosis/{id}/edit`), headed with the patient.
The fields are the same, except that the patient cannot be changed and the cancer type is a plain
drop-down. **Cancer Type**, **Primary Site** and **Diagnosis Date** must stay filled. Set the clinical
status here when a patient goes into remission or relapses.

### Patient Cancer Profile

**Patient Cancer Profile** (`/oncology/registry/{patientId}`) is the whole oncology history of one
patient on one page:

- **Cancer Diagnoses**: a card per diagnosis with status, site, grade, laterality, spread, a red
  **Recurrence** tag where it applies, the diagnosis date and ECOG.
- **Recent Oncology Labs**: test, result, reference range and a flag: **Critical** red, **Abnormal**
  amber, **Normal** green.
- **Surgical History (OT)**: the patient's theatre requests with priority, status, preferred date and
  report status.
- **Staging History**, **Tumor Board Decisions** and **Care Plans** (plan number, version, intent,
  subspecialty and approval date).

**View Timeline** opens the patient's [Cancer Timeline](#cancer-timeline). The registry rows do not link
here; you reach the profile from the back arrow on the cancer timeline, or from a **Diagnosis** event on
it.

## Tumor Staging

**Tumor Staging** (`/oncology/staging`) lists staging assessments across all patients: **Patient**,
**Cancer Type** (with site), **System** (with edition), **Type**, **Stage**, **TNM**, **Grade**,
**Date** and **Status**.

- **Type** is coloured: **Clinical** blue, **Pathological** purple, **Restaging** yellow, **Recurrence**
  orange.
- **Status** is **active** green, **superseded** grey or **entered in error** red.
- TNM shows as `T2 N1 M0`, with `?` for a category not recorded.

Search by patient, MRN, cancer type, site, stage or system, and filter by staging type.

### Add a staging

**Go to:** **Add Staging** (`/oncology/staging/new`).

1. Pick the patient and the diagnosis.
2. Under **Staging**, choose the **System** (AJCC TNM, UICC TNM, FIGO, Ann Arbor, Dukes, Gleason or
   Other), and optionally the **Edition**, **Staging Type** (default Clinical), **Stage Group** and the
   **T Category**, **N Category** and **M Category**.
3. Under **Date & Status**, enter the **Staging Date**. **Status** defaults to Active. Add **Notes** if
   needed.
4. Press **Add Staging**.

**System** and **Staging Date** are required.

When a patient is restaged, add a new record with type **Restaging** and set the old one to
**Superseded** from its pencil (**Edit Tumor Staging**, `/oncology/staging/{id}/edit`, saved with **Save
Changes**). Use **Entered in Error** for a record made against the wrong patient or diagnosis.

The latest staging also shows on the patient's encounter, in the **Oncology Staging** panel of the chart.

## Tumor Board

**Tumor Board** (`/oncology/tumor-board`) lists MDT cases: **Patient**, **Cancer Type**, **Meeting
Date**, **Attendees** (the first two roles, then "+n more"), **Treatment Intent**, **MDT
Recommendation** (**Pending** until written), **Outcome** and **Status**.

**Outcome** is coloured: **Approved** green, **More Info Needed** yellow, **Second Opinion** orange,
**Clinical Trial** blue. Filter by status (Scheduled, In Review, Completed, Deferred) and search by
patient, cancer type, recommendation or intent.

### Schedule a case

**Go to:** **Schedule Case** (`/oncology/tumor-board/new`).

1. Pick the patient and the diagnosis.
2. Under **Meeting Details**, enter the **Meeting Date**. **Status** starts as Scheduled.
3. Under **Attendees**, choose a role and specialty for each person; **Add** gives another row. Rows with
   neither filled are dropped.
4. Under **Clinical Information**, fill in what will be presented: **Clinical Summary**, **Imaging
   Findings**, **Pathology Report** and **Molecular / Genomic Profile**.
5. Leave **MDT Decision** empty for now, or fill it in if the board has already met.
6. Press **Schedule Case**.

### Record the decision

After the meeting, open the case with its pencil (**Edit Tumor Board Case**,
`/oncology/tumor-board/{id}/edit`):

1. Set **Status** to **Completed** (or **Deferred**).
2. Under **MDT Decision**, choose the **Treatment Intent** and **Review Outcome** (Approved, Deferred —
   Needs more info, Second opinion required, Clinical trial referral) and write the **MDT
   Recommendation**.
3. Press **Save Changes**.

The decision does not create a care plan by itself. Write the care plan next.

## Care Plans

**Oncology Care Plans** (`/oncology/care-plans`) lists treatment plans: **Plan #** (numbered
`OCP-YYYYMM-NNNNN`), **Cancer Type**, **Treatment Intent**, **Subspecialty**, **Modalities** (the first
three as coloured tags, with the chemo protocol code in brackets), **Cycles** (such as `6 × 21d`, taken
from the chemotherapy modality), **Status** and **Version**.

Filter by status and intent; search by plan number, cancer type, site or notes. Each row has a pencil to
edit, and a plan with chemotherapy also has a calendar button, **Treatment schedule**, which opens the
plan's running schedule or starts one (see [Treatment Schedules](#treatment-schedules)).

### Create a care plan

**Go to:** **Create Care Plan** (`/oncology/care-plans/new`).

1. Pick the patient and the diagnosis.
2. Under **Treatment Plan**, choose the **Treatment Intent** (required) and optionally the **Oncology
   Subspecialty**.
3. Under **Planned Modalities**, set one row per modality, in the order they will happen. **Add** gives
   another row and the bin removes one. For each row:
   - choose the modality and its status (**Planned**, **In Progress**, **Completed**, **Cancelled**);
   - for **Chemotherapy**, choose the **Chemo Protocol**. Only protocols for the diagnosis's cancer type
     are offered. Choosing one fills **Planned Cycles** and **Cycle Duration (days)** from the protocol,
     and shows its cycles and emetogenic risk; you can still change the numbers. "No protocols found for
     …" means the library has none for that cancer type yet;
   - for **Immunotherapy**, **Hormonal Therapy** and **Targeted Therapy**, enter **Planned Cycles** and
     **Cycle Duration (days)**;
   - for **Radiation**, enter **Planned Fractions**;
   - for any modality, a **Start Date**, **End Date** and **Details (optional)**.
4. Optionally set the plan's overall **Start Date** and **End Date** under **Overall Schedule**.
5. Under **Status & Notes**, set the **Plan Status** (default **Draft**) and any notes.
6. Press **Create Care Plan**.

**Check:** the plan is listed with its modalities and, for chemotherapy, the protocol code.

Set the plan to **Active** when treatment is agreed. Only active care plans can start a treatment
schedule, and new chemo orders link to an active plan with a chemo protocol first.

### Edit a care plan

The pencil opens **Edit Care Plan** (`/oncology/care-plans/{id}/edit`), headed with the plan number and
patient. Change the intent, subspecialty, modalities, dates, status or notes, then **Save Changes**.
Changing the protocol here does not change a treatment schedule already started from the plan.

## Chemo Protocols

**Chemo Protocols** (`/oncology/protocols`) is the hospital's regimen library: **Code**, **Protocol
Name**, **Cancer Type**, **Intent**, **Cycles**, **Emetogenic Risk**, **Drugs** (how many different
drugs) and **Status**.

- **Cycles** shows each phase for a phased protocol, such as `AC 4×14d → Paclitaxel 4×14d`, or simply
  `6 × 21d`.
- **Emetogenic Risk**: **minimal** green, **low** blue, **moderate** amber, **high** red.
- **Status** is **Active** or **Inactive**.

Search by code, name or cancer type, and type a cancer type into **Filter by cancer type**. Inactive
protocols are hidden unless you tick **Show inactive**.

The power button on an active row deactivates the protocol at once, without asking. It is then no longer
offered on new care plans and orders; existing orders and schedules keep it. There is no button to
reactivate it.

### Create a protocol

**Go to:** **Create Protocol** (`/oncology/protocols/new`).

1. Under **Protocol Identity**, enter the **Protocol Code** (unique in your hospital, turned into capitals,
   such as `AC-T`), the **Protocol Name**, the **Cancer Type** (from the catalog), the **Treatment Intent**
   and optionally the **Emetogenic Risk** and a **Description**.
2. Build the regimen under **Regimen & Cycles** (below).
3. Add **Pre-medications**, a **Hydration Protocol** (fluid, rate in mL/hr, duration in hours, and **Pre**,
   **Concurrent** or **Post**), **Lab Prerequisites** (test, parameter, minimum value, unit, and how
   recent: within 24h, 48h, 7 days or 14 days) and **Supportive Care**.
4. Press **Create Protocol**.

**Protocol Code**, **Protocol Name**, **Cancer Type** and **Treatment Intent** are required.

### Phases

A protocol is split into **phases** when the drugs change partway through, for example AC × 4 then
Paclitaxel × 4. Each phase is a card with its own **Phase name**, **Cycles** and **Cycle length
(days)**, and a badge showing which cycles it covers, such as **C5–C8**: cycles are numbered straight
through all the phases. The heading totals the cycles and days.

- **Add Phase** adds a phase after the last, with the same cycle length.
- The arrows move a phase up or down, the copy button duplicates it (named "(copy)"), and the bin removes
  it.

Each phase has one line per drug: **Drug**, **Dose**, **Unit** (mg/m², mg/kg, mg, units/m², AUC),
**Route** (IV, PO, SC, IM, IT), **Days** in the cycle (such as `1, 8`), **Formula** (**BSA**,
**Weight**, **Fixed** or **AUC**) and **Infusion (min)**. **Add drug to …** adds a line.

The arrow at the end of a drug line opens its extras, with a count when any are set:

- **Diluent** and **Max dose (mg)**, which caps the calculated dose.
- **Dose level −1** and **Dose level −2**, the reduced doses used when a cycle is dose-reduced. The boxes
  suggest 80% and 60% of the dose.
- **Cycle-specific changes**: press **Add change**, then give the **Phase cycles** it applies to
  (numbered within the phase; the matching overall cycles show underneath, such as "= C1") and a new
  **Dose**, **Days** or **Infusion (min)**, or tick **Omit**. Leave a field blank to keep the phase
  default. A note such as "loading dose" is shown wherever the change appears. With no changes the line
  reads "Same dose and days every cycle."

### The cycle matrix

Under **Plan Overview**, the **Cycle matrix** tab is a grid of drugs against cycles, grouped under the
phase names. Each cell shows the dose and days for that cycle; a dash means the drug is not in that
phase, and **omit** means it is left out that cycle.

Click a cell to change that one cycle: set **Dose**, **Days** or **Infusion (min)**, tick **Omit this
cycle**, add a **Note**, and press **Apply**. A changed cell is tinted amber. **Reset** puts it back to the
phase default. This writes the same cycle-specific change as the drug line's extras.

### Day-by-day schedule

The **Day-by-day schedule** tab lists every treatment day counted from Day 1 of Cycle 1: **Day**,
**Week**, `C2 D8` with its phase dot, the phase name and each drug's dose, route, infusion time and
diluent. A changed dose is in amber. The top line totals the treatment days and weeks.

Enter a **Sample start date (optional)** to see calendar dates; a date falling on a weekend is in amber
and marked "weekend". This is only a preview. The patient's real dates are made when a treatment schedule
is started.

**If instead:** pressing **Create Protocol** lists problems under the phases. Each must be fixed first:

- "Add at least one phase."
- "AC: cycles must be at least 1." or "AC: cycle length must be at least 1 day."
- "AC: add at least one drug."
- "AC · Doxorubicin: dose must be greater than 0." or "… choose at least one day."
- "AC · Doxorubicin: day 15 is beyond the 14-day cycle."
- "AC · Doxorubicin: override for cycle 5 is outside this phase (1–4)."

### Edit a protocol

The pencil opens **Edit Protocol** (`/oncology/protocols/{id}/edit`), with the same builder. The
**Protocol Code** is read-only. Editing a protocol does not change treatment schedules already started
from it, because each schedule keeps a copy of the protocol as it was.

## Treatment Schedules

**Treatment Schedules** (`/oncology/treatment-plans`) lists each patient's dated chemotherapy schedule:
**Patient**, **Protocol** (code and number of cycles), **Cancer type**, **Start → end**, **Next
treatment**, **Progress** (a bar with days given out of all treatment days) and **Status**. It opens on
**Active** schedules; change the status filter to see **On hold**, **Completed**, **Cancelled** or all.
Search by patient, MRN, protocol or cancer type. **Day-care worklist** jumps to the
[worklist](#day-care-worklist).

### Start a schedule from a care plan

The usual way in is the calendar button on a care plan. It opens the plan's schedule if one is active or
on hold, and otherwise opens the start form with the care plan filled in.

**Go to:** **Start schedule** (`/oncology/treatment-plans/new`).

1. Under **Patient & Protocol**, choose the **Care plan**. Only active care plans are offered. The
   patient shows underneath.
2. The **Protocol** is filled from the care plan's chemotherapy modality; you can choose another protocol
   for the same cancer type. Its phases show underneath, such as `AC 4×14d → Paclitaxel 4×14d · 8 cycles`.
3. Under **Start Date & Dosing Basis**, set the **C1 D1 date** (today, or the care plan's planned start
   if that is later), **Height (cm)** and **Weight (kg)**. **BSA (Mosteller)** is worked out as you type.
   **CrCl (mL/min)** is required, and marked "Needed for AUC dosing", when any drug is dosed by AUC
   (carboplatin, for example); otherwise it is optional.
4. Check the **Schedule Preview**, which now shows the patient's real dates, with weekends in amber.
5. Press **Generate schedule**.

**Check:** the schedule opens, with one card per cycle.

**If instead:**

- "This care plan already has an active schedule — open it instead of starting another." Follow the link
  rather than starting a second schedule.
- **Generate schedule** stays greyed out until a care plan, protocol, a valid date, height and weight (and
  CrCl where needed) are filled.
- The server's refusal shows in red above the buttons, for example "Protocol has no regimen".

### The schedule

**Treatment Schedule** (`/oncology/treatment-plans/{id}`) is headed with the patient, MRN and protocol.
The summary card shows:

- **Status**, **Start → end** and **Next treatment** (date, cycle and day).
- **Progress**: treatment days given out of those still counted (skipped and cancelled days are left
  out).
- **Dosing basis**: BSA, weight, height and CrCl.

Below it is one card per cycle, edged in its phase colour: **Cycle 3**, the phase tag, "cycle 1 of 4 ·
starts 12 Nov", and an amber "delayed +7d" tag with the reason if it was delayed. A cycle whose days are
all given, skipped or cancelled is faded.

Each card lists the treatment days in that cycle:

- the date (amber on a weekend; the row is tinted and says "today" on the day itself) and `C3 D1`;
- the day's status;
- each chemo drug with the patient's calculated dose; a skipped or cancelled day is struck through;
- "needs attention" in amber when a dose carries a warning (see the day sheet);
- **Day sheet**, the order button and a **⋯** menu.

Only an **Active** schedule can be changed. On hold, completed and cancelled schedules are read-only.

### Day sheet

**Day sheet** opens a side panel for that day, headed with the date, cycle, day, phase, BSA and status,
and a link to the chemo order if there is one. It lists, in order:

- **Before treatment**: the lab checks from the protocol's lab prerequisites, on the first treatment day
  of each cycle.
- **Administration sequence**: pre-medications and hydration, then each chemo drug in turn, each with
  its time. Enter the **Chair start** time and every step shows its clock time as well as its offset
  from the start. Each drug shows the calculated dose, route and infusion time, the protocol dose it
  came from, the dose level, the diluent to prepare it in, "capped at max dose" where the cap applied,
  and any note.
- **Supportive care / take-home**, on the first day of each cycle.

A warning in amber explains a dose that needs checking:

- "BSA unavailable", "Weight unavailable" or "CrCl needed for Calvert (AUC) dosing": the measurement the
  formula needs is missing, so no dose could be worked out. Use **Update measurements**.
- "No dose level -1 defined — full dose used": the cycle is dose-reduced but the protocol gives no
  reduced dose for this drug. A drug with no dose levels at all (trastuzumab, for example) is never
  reduced and shows no warning.

Pre-medications and supportive care are free text on the protocol, so they appear on every treatment day
(or every first day of a cycle) rather than against particular drugs.

### Delay a cycle

1. On the cycle card, press **Delay**.
2. Enter **Delay by (days)** (1 to 90; default 7) and a **Reason**, such as "ANC 900 — count recovery".
3. Press **Delay cycle 3 and later**.

That cycle and every later cycle move back by that many days. The card shows the amber "delayed" tag.

**If instead:** **Delay** is greyed out ("Cancel this cycle's orders before delaying") once any day in
the cycle is ordered or given. The server also refuses when a later day is already ordered or given:
"C4 D1 is already ordered; cancel its order before delaying". Cancel that order first.

### Change the dose level

Choose **DL 0**, **DL −1** or **DL −2** under **Dose level** on the cycle card. With **and later
cycles** ticked (the default), every later cycle takes the same level. Doses are recalculated from the
protocol's dose levels, but only for days still **planned** or **held**; ordered and given days keep the
dose they were ordered with. The control is greyed out on a finished cycle.

### Hold, skip or restore a day

The **⋯** menu on a day without an order offers **Hold this day**, **Skip (omit) this day** and
**Restore to planned**, depending on its current status. A held day can still be ordered later; a
skipped day drops out of the progress count.

**If instead:** "This day is ordered; change it through its chemo order". Once an order exists the day
follows the order: hold or cancel the order instead.

### Create the order for a day

Press **Create order** on a **planned** or **held** day. The chemo order is made with the cycle, day,
date, BSA, weight, height, CrCl and dose level, and the day becomes **ordered**. The button then reads
**Order · pending** (or the order's current status) and opens the order.

From then on the day follows the order: completing the order marks the day **given**, holding it marks it
**held**, and cancelling it frees the day back to **planned**.

**If instead:** "An order already exists for this day", "Cannot order a skipped day", or "Treatment plan
is on_hold". Errors on this screen show in red at the top.

### Update measurements and plan status

On an active schedule the summary card has:

- **Update measurements**: change **Height (cm)**, **Weight (kg)** or **CrCl (mL/min)** and press
  **Recalculate doses**. "Only days that are not yet ordered or given are re-dosed."
- **Put on hold** and, on a held schedule, **Resume plan**.
- **Mark completed**.
- **Cancel plan**, after confirming "Cancel this treatment plan?".

## Chemo Orders

**Chemo Orders** (`/oncology/orders`) lists every order: **Patient**, **Protocol**, **Cancer Type**,
**Cycle / Day** (such as `C2 D1`), **Scheduled**, **BSA** and **Status**. Click a row to open it. Filter
by status and search by patient, MRN, protocol or cancer type.

Most orders are made from a treatment schedule with **Create order**. **New Order** makes one by hand.

### New order by hand

**Go to:** **New Order** (`/oncology/orders/new`).

1. Pick the patient and the diagnosis.
2. **Care Plan (Optional)**: an active care plan with a chemo protocol is linked for you, and its
   **Planned protocol** shows. Choose **— No care plan —** to leave it unlinked.
3. **Protocol**: filled from the care plan; otherwise choose one for the diagnosis's cancer type. The
   summary shows the cycles, drugs, emetogenic risk, which phase and drugs the entered cycle uses, the lab
   prerequisites and pre-meds.
4. **Patient Biometrics**: enter **Weight (kg)** and **Height (cm)**; **BSA (m²)** is worked out for you,
   and you can overwrite it. Add **Creatinine Clearance**, **Hepatic Function** (Child-Pugh A to C) and
   **Renal Function** if relevant.
5. **Calculated Doses** appears once there is a BSA: each drug of that cycle with its protocol dose,
   formula, calculated dose in mg (capped at the max dose), route, day and infusion time. "Verify
   calculated doses before submission."
6. **Cycle Details**: **Cycle Number**, **Day Number** and **Scheduled Date** (all required).
7. **Dose Adjustments**: **Add** a drug, the percentage of dose and the reason for any reduction.
8. **Pre-Chemo Safety Checklist**: tick what has been done (consent, allergies, labs reviewed and in
   range, weight/BSA verified today, doses verified, pre-meds ordered) and fill in **Consent Date**,
   **Allergies Summary** and **Labs Date**. Add notes.
9. Press **Submit Order**.

**Check:** the order is listed as **pending**.

**If instead:** "Cycle 9 is beyond this protocol's 8 cycles." The cycle number is past the end of the
protocol, so no doses are calculated.

### Work an order

**Chemo Order** (`/oncology/orders/{id}`) is headed with the protocol, cycle, day, date and status, and
shows the patient and diagnosis banners. Below the action card are the **Order Summary**, the **Protocol
Regimen** for that cycle, the **Pre-Chemo Safety Checklist** as ticks and crosses, any **Dose
Adjustments**, and **Workflow History** (**Ordered**, **Approved**, **Verified**, **Administered**, each
with its time).

The action card changes with the status:

1. **Pending**: **Pharmacist / Physician Approval**. Review the order, then press **Approve Order**.
2. **Approved**: press **Start Drug Prep & Verification**, then:
   - **Step 1 — Pharmacist Drug Preparation**: for each drug, **Prepared by**, **Prepared at**, **Lot
     number**, **Expiry date**, **Diluent** and **Final volume (mL)**;
   - **Step 2 — Nurse Bedside Verification (5 Rights)**: tick all nine checks (identity, drug, dose,
     route, time, expiry, allergy, IV line, patient educated). Until then the screen says "All checklist
     items must be confirmed before verifying.";
   - **Step 3 — Second Nurse / Independent Check (Optional)**;
   - press **Complete Verification**. **Back** leaves without saving.
3. **Verified**: **Ready for Administration**. Press **Start Administration**.
4. **In progress**: **Administration In Progress**, with the start time. For each drug, **Mark Started
   Now** and **Mark Completed Now** stamp the time (or type it), with **Rate (mL/hr)** and **IV Access
   Site**. Each drug is tagged **Pending**, **Infusing** (blue) or **Completed** (green). Under **Adverse
   Reactions**, **Report Reaction** adds the drug, CTCAE grade (1 Mild to 5 Fatal), type and
   description; the worst grade shows as a tag (yellow for 1–2, orange for 3, red for 4–5). Press **Save
   Progress** (or **Save Reactions**) as you go.
5. When the infusion is finished, press **Complete Cycle**, check the times and reactions in **Complete
   Cycle — Final Record**, add **Completion Notes** and press **Mark Cycle Complete**.

**Check:** the card reads **Cycle 2 Completed**, with the administration time and a reactions summary.
The treatment day on the schedule is now **given**. The read-only **Nurse Verification Record**, **Drug
Preparation Record**, **Administration Timeline** and **Adverse Reactions (CTCAE)** appear below.

### Hold or cancel an order

While an order is pending, approved or verified, the action card has **Hold** and **Cancel**. Each asks
for a reason ("Reason for hold", "Reason for cancellation"); confirm with **Confirm Hold** or **Confirm
Cancel**. The reason is added to the order's notes. Holding marks the treatment day **held**; cancelling
frees the day so a new order can be made. A held order shows "Order is on hold." with **Cancel Order**.

## Day-care Worklist

**Day-care Worklist** (`/oncology/day-care`) is everything scheduled on one date, across all patients,
from the treatment schedules. It opens on today. Use the arrows, the date box or **Today** to move; the
line beside them counts patients and chemo preparations. **Print** prints the page.

The **Administration** tab has a card per patient: name (linking to their schedule), MRN, protocol,
`C2/8 D1`, BSA, dose level if reduced, the phase tag, the day's status, and the order button (**Order ·
approved**, for example) or "No order yet". Under it is the patient's [day sheet](#day-sheet), without
the chair start time.

The **Pharmacy prep** tab is a table of every chemo drug to prepare: **Patient**, **Protocol** (with
cycle and day), **Drug**, **Dose** (with any warning in amber), **Basis** (protocol dose, dose level,
"capped"), **Diluent**, **Route / infusion** and **Order** status. **Totals by drug** underneath adds up
how many of each drug and the total dose.

"No chemotherapy scheduled on this date." means no treatment day falls on it.

## Radiation Therapy

**Radiation Oncology** (`/oncology/radiation`) lists radiation prescriptions: **Patient**, **Rx #**,
**Intent**, **Modality / Technique**, **Dose** (total, with Gy per fraction), **Fractions**, **Start
Date** and **Status**. Status is **DRAFT** grey, **APPROVED** blue, **ACTIVE** green, **COMPLETED** in
the primary colour, **CANCELLED** red. Search by patient, MRN or Rx number and filter by status.

### New prescription

**Go to:** **New Prescription** (`/oncology/radiation/new`).

1. Pick the patient (and, if offered, the diagnosis).
2. **Treatment Intent**: **Intent** (Curative, Adjuvant, Neoadjuvant, Palliative), **Laterality** and an
   optional **Prescription #**.
3. **Modality & Technique**: **Modality** (PHOTON, ELECTRON, PROTON, BRACHY) and **Technique** (3DCRT,
   IMRT, VMAT, SBRT, SRS, ELECTRON, HDR, LDR).
4. **Dose Prescription**: **Total Dose (Gy)** and **Dose / Fraction (Gy)**. **Planned Fractions** is
   worked out from them; you can change it. Tick **Concurrent chemotherapy** if it applies.
5. **Schedule**: **Planned Start Date**, **Planned End Date** and **Prescription Notes**.
6. Press **Create Prescription**.

Patient, intent, modality, both doses and the start date are required.

### Work a prescription

**Radiation Prescription** (`/oncology/radiation/{id}`) shows the **Prescription Details** and a
collapsible section for each stage:

1. **Approve Prescription** (on a draft), then **Activate (Start Treatment)** (on an approved one).
2. **CT Simulation**: **Add Simulation** records the date, **Patient Position**, **Immobilization
   Device**, **Scan Region**, **Setup Reference / Isocentre**, **Contrast used**, **Tattoo marking done**
   and notes. Press **Save Simulation**.
3. **Treatment Plan**: **Add Plan** records the planning system, **Treatment Machine**, the simulation it
   uses and notes (**Save Plan**). Each plan shows its machine, contouring and physics QA, and **Approve
   Plan** until it is approved, then a green tick.
4. **Fractions** (once there is a plan): **Generate Fractions** with the plan, **Number of Fractions**,
   **Dose / Fraction (Gy)**, **Start Date** and **Treatment Machine**, then **Generate**. The heading
   counts fractions delivered. On a scheduled fraction, **Deliver** asks for the delivered dose and
   **Miss** asks for a reason.
5. **On-Treatment Reviews**: **Add Review** with **Review Date** (required), **Week Number**, **Toxicity
   Grade (CTCAE)**, **Pain Score (0–10)**, **Weight (kg)**, **Treatment break required** and notes (**Save
   Review**).
6. **Completion Summary**: on an active prescription, **Record Completion** with the completion date,
   delivered dose and fractions, interruptions, acute toxicity, response assessment plan and follow-up
   plan. **Save Completion Summary** completes the prescription.

## Catalogs

**Oncology Catalogs** (`/oncology/catalogs`) holds the reference lists the registry and protocol forms
pick from, on four tabs. Each list can be searched, and inactive entries are hidden unless you tick
**Show inactive**.

- **Cancer Types**: **Code** (UPPER_SNAKE_CASE, unique per hospital, such as `BREAST_CA`), **Name**,
  **Category**, **Status**. **Add Cancer Type**.
- **Primary Sites**: **ICD-O Code** (such as `C50.9`), **Site Name**, **Body System**, **Laterality**,
  **Mapping**, **Status**. **Add Site**.
- **Site Mappings**: which sites belong to which cancer type, and which is the **Default**. **Add
  Mapping** picks the cancer type and site, with **Mark as default site for this cancer type**. **Set
  default** changes the default; the bin removes a mapping. These mappings decide which sites the
  registry form offers.
- **Histologies**: **Morphology Code** (ICD-O-3, such as `8500/3`), **Name**, **Behavior**, **Status**.
  **Add Histology**; choosing a **Behavior Code** fills the **Behavior Name**.

The pencil edits an entry (its code cannot be changed once created); **Deactivate** hides it from the
forms without deleting it, and **Activate** brings it back.

## Cancer Timeline

**Cancer Timeline** (`/oncology/timeline`) first asks you to "Select a patient to view their complete
cancer journey": search the registered patients by name or MRN and press **View Timeline**.

The patient's timeline (`/oncology/timeline/{patientId}`) runs down the page as dated events
along a date rail, each coloured by category: **Diagnosis**, **Staging**, **Tumor Board**, **Care Plan**,
**Chemotherapy**, **Radiation**, **Surgery**, **Response**, **Follow-up** and **Note**. The legend at the
top shows the categories present. A run of related events, such as the sessions of a chemo course, is
grouped into one card. Major milestones have a ring round their dot; warnings (a held chemo, for
example) amber; adverse events red.

Events are added automatically as records are made: diagnoses, staging, tumour board cases and
decisions, care plans, chemo started, completed and held, and radiation. Where an event has a source, its
card opens it (the staging, the order, the prescription…).

- **Filter Events** by type and by **From** and **To** dates; **Clear filters** resets them.
- **Add Event** (or **Add a manual note**) records something with no workflow of its own: a **Date**,
  **Category** (**Note**, **Surgery**, **Response Assessment**, **Follow-up**), **Title**, **Description**,
  an optional diagnosis, and **Mark as major milestone**. Press **Add Event**.
- Only manually added events can be deleted, with the bin on their card.
- **Print Summary** prints the timeline.

The back arrow goes to the [Patient Cancer Profile](#patient-cancer-profile).

## Not live yet

- **Re-activate** on a held chemo order does not release it: it records another hold, and the order stays
  **held**. To carry on, cancel the order and create a new one (from the treatment schedule, a cancelled
  order frees the day for **Create order**).
- **Step 3 — Second Nurse / Independent Check** takes free text, but the server stores it as a user ID.
  Typing a name makes **Complete Verification** fail, with no message. Leave it blank until this is
  fixed. The dual sign-off setting it mentions is not enforced.
- Care plans cannot be approved or revised from the screens. The **Revised** status can be filtered but
  not set, and the profile's "Approved" date only appears for plans approved some other way.
- A deactivated chemo protocol cannot be reactivated from the screens.
- Most of these screens give no message when a save fails; only the treatment schedule screens show the
  server's reason.
