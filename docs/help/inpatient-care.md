---
title: 'Inpatient care'
group: 'Clinical care'
order: 40
routes: ['/inpatient']
description: 'Admitting a patient to a bed, the Ward Board and inpatient channel, transfers, bed status on the Bed Browser, discharges and discharge summaries.'
---

Shown when your organisation has Inpatient Care switched on.

Everything here sits under **Inpatient Care** in the sidebar:

- **Admission** (`/inpatient/admissions`): find admissions and create new ones.
- **Discharges** (`/inpatient/discharges`): start, track and execute discharges.
- **Discharge Summaries** (`/inpatient/discharge-summaries`): write the summary document.
- **Bed Browser** (`/inpatient/bed-browser`): every bed's status, and cleaning or maintenance.
- **Ward Board** (`/inpatient/wards`): the live board of beds and patients, with meds, orders and transfers.

A typical stay runs: admit to a bed, care for the patient from the Ward Board and the inpatient channel,
transfer if needed, start the discharge, write the summary, execute the discharge, then send the bed for
cleaning on the Bed Browser.

## Admissions

**Inpatient Admissions** (`/inpatient/admissions`) lists admissions, newest first, 20 to a page.

Filter with:

- **Search**: patient name or MRN.
- **Ward**: **All wards** or one ward.
- **Admission Status**: **Admitted**, **Transferred**, **Discharged**, **Deceased**, **Absconded**.
- **Discharge Status**: **Not Started**, **Planning Initiated**, **Ready for Discharge**, **Discharged**.
- **Date**: **Today** (the default), **Yesterday** or **Date Range**, by admission date.

The list opens on today's admissions only. To find a patient admitted last week, switch **Date** to
**Date Range** and pick the dates.

Columns are **Admission #**, **Patient** (name, MRN, gender and age), **Bed** (ward and bed), **Status**
and **Discharge Status**. Click a row to open the admission.

| Discharge Status badge | Look | Meaning |
| --- | --- | --- |
| **Ready** | Green, tick | Discharge marked ready |
| **Planning** | Grey, clock | Discharge planning started |
| **Discharged** | Outlined | Discharge confirmed |
| — | Dash | Not started |

**Discharge Status** filters only the page of results already loaded, not the whole list. If a patient you
expect is missing, clear that filter and use the search instead.

### Admit a patient

**Go to:** **New Admission** on the list, **+ Admit Patient** on the Bed Browser, or **Admit Patient To This
Bed** on a free bed in the Bed Browser. The form is **Create Admission** (`/inpatient/admissions/new`).

1. **Search Patient** and pick the patient. Picking a different patient clears the bed and encounter you had
   chosen.
2. **Attending Physician**: type a name and pick from the active physicians listed. **Change** lets you pick
   again.
3. **Encounter Option**:
   - **Create New Encounter** (the default) starts a new inpatient encounter.
   - **Link to Existing Encounter** links an active ER or OPD encounter. Press **Select Encounter** and pick
     one from **Select Active Encounter**. It says "No active encounters found." if there are none.
4. **Admission Date** defaults to now. Set **Admission Type** (Elective, Emergency, Maternity, Day case,
   Transfer) and **Admission Source** (Emergency room, Outpatient dept, Transfer in, Direct, Physician
   referral).
5. Find a bed. Optionally narrow by **Bed Type** (General, ICU, Isolation, Pediatric, Maternity) and
   **Gender Restriction** (Male only, Female only, Mixed), then press **Search Beds**. The patient's gender
   is shown under the filters to help you choose. Click a bed to select it; **Change bed** clears it.
   If you came from the Bed Browser the bed is already selected.
6. Optional: **Isolation Type**, **Vitals Frequency** (Q1H to DAILY), **Fall Risk Score** (1 to 5),
   **Insurance Auth Number**, **Estimated Cost**, and **Clinical Alerts** (separate several with commas).
7. Press **Create Admission**.

**Check:** "Admission created" appears and the admission opens.

**If instead:** the form stays put and says why:

- "Patient ID must be a UUID": no patient picked.
- "Attending physician ID must be a UUID": no physician picked.
- "Select an available bed.": no bed picked.
- "Select an active encounter.": you chose **Link to Existing Encounter** but did not pick one.
- "Admission date is required".
- "No available beds match the filters.": loosen the filters and search again.
- "Facility context missing. Re-login to load facility-specific beds.": sign out and back in.
- "Admission failed" with the server's reason.

A **Fall Risk Score** outside 1 to 5 blocks the save without showing a message by the field. If **Create
Admission** seems to do nothing, check that score.

### Admission details

**Admission Details** (`/inpatient/admissions/{id}`) shows the **Admission Number**, **Admission Status**,
**Discharge Status**, **Patient** (name, MRN, age, gender), **Attending Physician** and **Current Bed**.

Under **Update Admission** you can change **Isolation Type**, **Vitals Frequency**, **Fall Risk Score**,
**Expected Discharge Date**, **Discharge Notes**, **Insurance Auth Number**, **Estimated Cost** and
**Clinical Alerts**, then press **Update Admission**. The attending physician is shown but cannot be changed
here. Success says "Admission updated"; a refusal says "Update failed" with the reason.

To move or discharge the patient, use the [Ward Board](#ward-board) and [Discharges](#discharges).

## Ward Board

**Ward Board** (`/inpatient/wards`) shows every bed in your facility, grouped by ward, with the patient in
each.

- **Grid** and **List** switch the layout.
- **Ward Filter**: **All Wards** shows the whole facility. Click ward chips to show only those wards;
  **Select All** picks every chip. The heading says "All wards" or how many are selected.
- Status chips filter the beds, each with its count: **All Beds**, **Occupied**, **Available**,
  **Cleaning**, **Maintenance**.

Each ward heading counts its occupied, available and cleaning beds.

| Bed badge | Edge | Meaning |
| --- | --- | --- |
| **Occupied** | Green | A patient is in the bed |
| **Available** | Grey, dashed card | "Bed Available", ready for admission |
| **Cleaning** | Amber | "Bed in Cleaning", awaiting environmental services |
| **Maintenance** | Amber | Out of use for maintenance |

An occupied bed shows the patient's initials, name, age, gender and MRN, and up to three flags (a **+n**
chip counts the rest):

| Flag | Colour |
| --- | --- |
| **Low / Moderate / High Fall Risk** | Amber |
| **NPO** | Rose |
| **Telemetry** | Sky |
| **Isolation** | Theme colour |
| **Allergies** | Orange |

Occupied beds carry four buttons: **Meds**, **Orders**, **Transfer** and **Channel**.

### Prescribe from the board

1. Press **Meds** on the bed. **Medications** opens for that patient.
2. Type in **Search medications to prescribe...** and click a medicine. Each shows its code, dose, route and
   frequency. One already prescribed is greyed and says **Already prescribed**.
3. "Prescription added" confirms it. It joins the list of active prescriptions below, with its status.
   The bin icon removes one ("Prescription removed").

**If instead:** "Cannot open Meds" with "No encounter or patient is linked to this admission." or
"Prescriber identity is missing or invalid.". The prescriber is the attending physician, or you if none is
set. "Prescription already exists" means that drug code is already on the encounter.

### Order from the board

1. Press **Orders**. **Orders** opens for that patient.
2. Choose the catalogue: **Lab Tests**, **Imaging Studies** or **Procedures**, then search and pick an item.
   It is added as a routine order ("Order added").
3. Each order shows its type, name, code and **Priority**. The pencil opens **Edit clinical order**: add
   **Clinical indications** or **Special instructions** and press **Save changes**. Saving with both empty
   says "No updates provided". The bin removes the order.

**If instead:** "Cannot open Orders" with the same reasons as Meds, or "Order already added" if that code
is already on the encounter.

### Transfer a patient

1. Press **Transfer** on the bed. **Transfer Patient** shows **Transfer From** (the current bed).
2. Under **Transfer To**, **Select available bed**. Only free beds in your facility are listed, as
   "Ward · Bed".
3. Pick a **Transfer Type**: **Clinical need**, **Bed availability**, **Patient request** or **Infection
   control**.
4. Enter a **Transfer Reason** (required) and any **Notes**.
5. Press **Transfer Patient**. It stays greyed until a bed and a reason are given.

**Check:** "Transfer completed" and the patient appears in the new bed.

**If instead:** "Missing transfer details", "Invalid target bed", "No available beds found for this
facility." or "Transfer failed" with the server's reason.

**View History** in the dialog lists earlier transfers for this admission: type, when, ward and bed, who
assigned it, when the bed was released, and the reason and notes. It says "No transfers recorded for this
admission." if there are none.

## Inpatient channel

Press **Channel** on an occupied bed to open **Inpatient Channel** (`/inpatient/ward-board/{admissionId}`),
the patient's page for the stay.

The header shows the admission status, **Acuity**, and the discharge badge (**Ready for Discharge**,
**Planning Initiated** or **Discharged**) once discharge has started. Below it are the patient (age, gender,
MRN), **Location**, **Provider** (attending physician), **Admission Date** and **Discharge Status**.

### Care Channel

The **Care Channel** is the care team's message thread for this admission, with its status badge.

- Messages are edged by kind: blue for team messages, amber for clinical events, grey for system events
  (such as "Patient transferred from ... to ..."). **High** messages are marked amber, **Urgent** rose.
- **Send message**: type in **Type an update or note for the care team...**, choose **Normal**, **High** or
  **Urgent**, and press **Send**. Sending needs the channel to be **ACTIVE** and the admission to have an
  attending physician.
- **Meds**, **Orders** and **Transfer** here open the same dialogs as on the Ward Board. A prescription,
  order or transfer made from here also posts a line into the channel, such as "Transfer completed: ...".
- **Team** opens **Care Team Members**. Under **Add Team Member** pick a staff member and a role (Attending
  Physician, Resident Physician, Consulting Physician, Primary Nurse, Charge Nurse, Staff Nurse, Pharmacist,
  Case Manager, Respiratory Therapist, Physical Therapist, Dietitian, Other) and press **Add**. Removed
  members show when they were removed.
- **Sync** refreshes the member list from the admission.

If there is no channel the card says "No care channel found for this admission.".

### Active Medications and Checklists

**Active Medications** lists the encounter's prescriptions with dose, route, frequency and status, or says
"No clinical encounter linked" or "No active prescriptions".

**Checklists** lists the admission's checklists with category, percent complete, due time and status.
**Open** takes you to the checklist.

### Fill in a checklist

**Checklist** (`/inpatient/checklists/{instanceId}`) shows the template's items by section. Required items
carry a red asterisk. Some items only appear once an earlier answer makes them relevant.

1. Answer the items: tick boxes, text, numbers, dates, choices or a staff member.
2. **Save Draft** saves your answers ("Checklist saved"). With nothing filled in it says "Nothing to save".
3. **Mark Complete** when done, then a second person can **Verify**. **Cancel** cancels the checklist.

**Checklist Actions** shows the **Status**, **Completion** percentage and **Due** time. Once a checklist is
completed, verified or cancelled it becomes read-only. File-upload items say "File upload not yet
supported."

## Bed Browser

**Central Bed Management** (`/inpatient/bed-browser`) is every bed in the facility at a glance.

Tiles count **Total Beds**, **Available**, **Occupied**, **Cleaning** and **Maintenance**. Filter by ward
and by status. Each bed is a small card with its number, a coloured dot and badge, and the occupant's name:

| Status | Colour |
| --- | --- |
| **Available** | Green |
| **Occupied** | Rose |
| **Cleaning** | Blue |
| **Maintenance** | Amber |

Click a bed to open its details: ward, status, and for an occupied bed the patient, age and gender, MRN,
admission number, admission status and admission date.

### Change a bed's status

From the bed's details:

- **Mark Cleaning Required** sends it to **Cleaning**; on a bed in cleaning, **Mark Cleaning Complete**
  frees it.
- **Mark Maintenance** takes it out of use; **Clear Maintenance** brings it back.
- On an available bed, **Admit Patient To This Bed** opens [Create Admission](#admit-a-patient) with this bed
  already chosen.

The dialog closes and the board refreshes when the change succeeds. If it fails, the dialog stays open with
no message; check the bed's status before trying again.

## Discharges

**Discharges** (`/inpatient/discharges`) tracks each discharge from planning to execution.

Search by patient name or MRN, filter by status, and pick dates with **Today**, **Yesterday** or **Range**.
The dates filter on the actual discharge date and default to **Today**, so discharges still in planning may
not show until you widen the range.

Columns are **Admission #**, **Patient**, **Admission Date**, **Bed**, **Discharge Status** and **Actions**
(**View**).

| Status | Colour | Meaning |
| --- | --- | --- |
| **Planning** | Amber | Discharge started, being prepared |
| **Ready** | Green | Marked ready |
| **Approved** | Sky | Approved (only when approval is required) |
| **Discharged** | Dark slate | Executed; the patient has left |
| **Cancelled** | Rose | Discharge called off |

### Start a discharge

**Go to:** **New Discharge** on Discharges or Discharge Summaries. This opens **Create Discharge**
(`/inpatient/discharges/new`).

1. Search by patient name or MRN. Only patients currently admitted are listed.
2. Press **Select** on the admission (it changes to **Selected**).
3. Press **Start Discharge**.

**Check:** "Discharge initiated" and the discharge opens in **Planning**.

**If instead:** "Discharge failed" with the reason, for example when one is already under way.

### Work a discharge

**Discharge Overview** (`/inpatient/discharges/{admissionId}`) shows the patient, admission, **Discharge
Status**, **Approval Required** and **Length of Stay**. **Discharge Summary** opens the summary.

A stepper runs **Initiate**, **Mark Ready**, **Approve**, **Execute**. Each step reads **Completed** (green),
**Active** (blue), **Upcoming** or **Skipped**. **Approve** is skipped when approval is not required.

1. **Initiate Discharge**: if the discharge was not started yet, set a **Target date** and **Target time**,
   toggle **Approval required** (**Required** / **Not required**), add **Internal notes**, and press
   **Start Planning**.
2. **Mark Ready**: add optional remarks and press **Mark Ready** ("Marked ready").
3. **Approve Discharge**: only when approval is required. Add remarks and press **Approve** ("Discharge
   approved").
4. **Execute Discharge**: choose a **Discharge type** (Routine, Against Medical Advice, Transfer Acute Care,
   Transfer Snf, Transfer Rehabilitation, Expired, Eloped, Left Without Being Seen) and **Discharge
   destination** (Home, Home With Home Health, Skilled Nursing Facility, Acute Care Hospital, Rehabilitation
   Facility, Hospice Home, Hospice Facility, Psychiatric Facility, Deceased, Other). Optionally add the
   **Discharge summary ID** and **Follow-up instructions**. Press **Execute Discharge**.

**Check:** "Discharge executed" and the status turns **Discharged**. Afterwards, mark the bed for cleaning
on the [Bed Browser](#change-a-beds-status).

**If instead:** each button stays greyed until the discharge is at its step: **Mark Ready** needs
**Planning**; **Approve** needs **Ready** with approval required; **Execute Discharge** needs **Ready** or
**Approved**. A refusal from the server shows as "Update failed", "Approval failed" or "Execution failed"
with the reason.

**Back** on each step lets you look at the previous step.

### Cancel a discharge

Under **Cancel Discharge**, type a **Cancellation reason** and press **Cancel Discharge**. The button stays
greyed until there is a reason, and is not offered once the patient is discharged.

**Discharge Timeline** on the right records when the discharge was **Initiated**, **Ready**, **Approved**
(or "Skipped (approval not required)") and **Executed / Cancelled**.

## Discharge summaries

**Discharge Summaries** (`/inpatient/discharge-summaries`) lists patients still admitted whose discharge has
started, with **Admission #** and date, **Patient** and **Status**. Press **Open Summary**.

### Write a discharge summary

**Discharge Summary** (`/inpatient/discharge-summaries/{admissionId}`) is headed with the patient, MRN and
admission, and a status badge (**Draft** until saved otherwise).

1. Under **Load Template**, pick a **Note Template**. Templates are discharge-summary note templates kept in
   the **Note Templates catalog** (linked under the box). Loading one replaces the sections on screen with
   empty ones, so load the template before you write.
2. Fill in each section under **Summary Document**. Required sections carry a red asterisk.
3. Optionally add a **Change reason**.
4. Press **Save Discharge Summary**.

**Check:** "Summary saved" and a new row in **Version History** (version, when, author and change reason).
Each save is a new version; reopening the summary shows the latest version's sections.

**If instead:**

- "No content": load a template first.
- "Required fields missing" names the sections still empty.
- "Template not found", "No template version", "Template has no schema" or "Invalid template": the template
  is not usable; fix it in the catalogue.
- **Save Discharge Summary** stays greyed if no summary record exists yet for the admission.
- "Save failed" with the reason.

## Not live yet

- **Admit Patient** on a free bed in the Ward Board does nothing yet. Use **Admit Patient To This Bed** on
  the [Bed Browser](#bed-browser) or **New Admission** on [Admissions](#admissions).
- Some screens exist but are not linked from anywhere and are early or technical. Reach them only by
  typing the address:
  - **Transfer Patient** (`/inpatient/admissions/{id}/transfer`) asks for raw ward and bed IDs. Use
    [Transfer](#transfer-a-patient) on the Ward Board instead.
  - **Event Timeline** (`/inpatient/admissions/{id}/events`) shows and creates admission events as raw
    JSON.
  - **Discharge Planning** (`/inpatient/admissions/{id}/discharge`) is an older checklist-based discharge
    (medical clearance, medications, follow-up, education, equipment, transport, administrative, then
    **Proceed to Discharge Patient**). Use [Discharges](#discharges) instead.
  - **Ward Dashboard** (`/inpatient/wards/{wardId}/dashboard`) shows raw data; **Ward Patients**
    (`/inpatient/wards/{wardId}/patients`) shows IDs, not names.
  - A single-ward board (`/inpatient/wards/{wardId}/bed-board`) with **Critical** and **Pending
    Discharge** filters and **Include Discharged Today**.
