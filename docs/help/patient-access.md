---
title: 'Patient access'
group: 'Clinical care'
order: 20
routes: ['/patients', '/patients-ai', '/encounters', '/scheduling']
description: 'Finding and registering patients, the patient record with its documents, policies, Care Context, results and Patient AI+, encounters, appointments, the Staff Calendar and Staff Scheduling.'
---

Everything here sits under **Patient Access** in the sidebar: **Patients**, **Encounters**,
**Appointments**, **Staff Calendar** and **Staff Scheduling**. The usual day runs from left to right:
find or register the patient, book an appointment, turn the appointment into an encounter when the
patient arrives, then chart it (see [Charting and triage](clinical-charting.md)).

Staff must have availability set up on **Staff Scheduling** before they can be picked when booking
or viewed on the **Staff Calendar**. If a clinician is missing from those lists, start there.

## Patients

**Patients** (`/patients`) is the patient list for your organisation. It opens showing the first 20
patients and a count, "Found _n_ patients".

The table shows:

- **MRN**, the patient's medical record number;
- **Patient Name**;
- **Age**, worked out from the date of birth;
- **Gender**;
- **Phone Number**;
- **Status**, as a badge: **active** green, **inactive** amber, anything else (such as deceased) grey;
- **Actions**: **View**, **AI+**, and a round grid button that opens Care Context (shown only for
  patients with enough history; see [Care Context](#care-context)).

Click anywhere on a row, or press Enter on it, to open the patient record.

### Finding a patient

Type in **Search patients by name, MRN, or phone number...**. The list updates a moment after you stop
typing. Only the first 20 matches are shown ("Showing 20 of _n_ patients"), and there is no next page,
so if the person you want is not there, type more of the name or use the MRN.

**If instead:** the list says **No patients found**, try a different term, or press **Add Patient** to
register them. **Error loading patients** means the list could not be fetched; the message under it is
the server's reason.

## Registering a patient

**Go to:** **Patients**, then **New Patient**. This opens **Register New Patient** (`/patients/new`).

1. **Personal Information**: **Title** (optional), **First Name**, **Middle Name**, **Last Name**,
   **Date of Birth** and **Gender** (Male, Female or Other; it starts on Male, so check it).
2. **Contact Information**: **Phone Number**, **Alternate Contact**, **Email**, **Address**, **City**,
   **State**, **Country** and **Postal Code**. **Country**, **City** and **Nationality** are filled in
   from your organisation's registration defaults; change them if they are wrong for this patient.
3. **Identity Information**: **Nationality**, **National ID** and **Passport Number**.
4. **Emergency Contact**: **Name**, **Contact Number** and **Relation**.
5. Press **Save Patient**.

Fields marked * are required: first name, last name, date of birth, gender and phone number.

**Check:** the toast says "Patient registered successfully" and you are taken back to the patient
list. The new patient's MRN is given by the system.

**If instead:** the form will not save, read the red line under each field:

- "First name is required", "Last name is required", "Date of birth is required";
- "Valid phone number is required": the phone number needs at least 10 characters;
- "Invalid email" when **Email** is filled in but is not an email address.

If the server refuses, the toast shows its reason, or "Failed to register patient".

**Cancel**, or the back arrow, leaves without saving.

## The patient record

Open a patient from the list to see their record (`/patients/{id}`). The header shows the name, a
status badge (**ACTIVE** green, **INACTIVE** amber, **DECEASED** grey), the **MRN**, age and gender.

The buttons across the top:

- **Insurance Policies** opens the patient's policies ([Insurance policies](#insurance-policies)).
- **Patient AI+** opens the AI summary ([Patient AI+](#patient-ai)).
- The round grid button opens [Care Context](#care-context), when the patient has enough encounters.
- **Edit Patient** opens the same form as registration, headed **Edit Patient**
  (`/patients/{id}/edit`). Press **Save Changes**; the toast says "Patient updated successfully" and you
  return to the record.

The record is laid out in cards:

- **Upcoming Appointment**: the next appointment that is not cancelled, with its **Primary Staff**,
  **Date & Time**, status and type. Otherwise "No upcoming appointments scheduled."
- **Previous Encounter**: the most recent encounter, with its staff, time, status and encounter
  number. Otherwise "No previous encounters recorded."
- **Personal Information** and **Contact Information**.
- **Identity Documents**, **Emergency Contact**, **Medical Information** (allergies, chronic
  conditions, current medications) and **Insurance Information**: each appears only when there is
  something to show.
- **Patient Documents** (below).
- **Audit Information**: when the record was created and last updated, and by whom.

**If instead:** you see **Patient Not Found**, the patient does not exist or you do not have
permission to view them. Use **Back to Patient List**.

### Patient documents

The **Patient Documents** card lists scanned and uploaded files for this patient, each with its type,
document number, size, date and a verification badge: **Verified** green, **Rejected** red,
**Pending** grey.

1. Press **Upload Document**.
2. Drag a file onto the box, or click it to browse. PDF, image and Word files are accepted; the box
   says the limit is 10MB.
3. Choose the **Document Type**: Emirates ID, Passport, Visa, Insurance Card, Lab Report,
   Prescription, Referral Letter, Consent Form, Medical Report, Radiology Report, Discharge Summary or
   Other.
4. Optionally type the **Document Number (optional)**, such as the passport number.
5. Press **Upload Document**.

**If instead:** the dialog says "Upload failed. Please try again.", the file was not stored.

The eye button opens a document in a new tab. The bin button removes it after you confirm "Are you
sure you want to delete this document?".

## Insurance policies

**Patient Policies** (`/patients/{id}/policies`) lists the patient's insurance policies under
**Existing policies**. Each shows the payer, policy number, group, relationship, effective and expiry
dates, whether it is the primary policy, and a status badge: **active** in the theme colour,
**expired** red, **inactive** and **cancelled** grey.

To add one:

1. Press **Add policy**.
2. Choose the **Payer**. Only active payers are listed; your billing team sets them up (see
   [Billing setup](billing-setup.md)).
3. Type the **Policy number**, and if you have them the **Group number**, **Relationship**,
   **Effective date** and **Expiration date**.
4. **Benefits (JSON)** takes benefit details as JSON, for example `{"copay":"20%"}`. Leave it empty if
   you do not have them.
5. Turn on **Primary policy** if this is the main cover, and set the **Status**.
6. Press **Add policy**.

**Check:** the toast says "Policy added" and the policy appears in the list.

**If instead:**

- "Select a payer first." or "Policy number is required.": fill that field in.
- "Invalid JSON" / "Fix the benefits structure.": the benefits text is not valid JSON. Correct it or
  clear it.
- "Unable to save policy" with the server's reason.

**Deactivate** on a policy takes effect straight away, with no confirmation; the toast says "Policy
deactivated".

## Care Context

**Care Context** (`/patients/{id}/care-context`) is a three-pane workspace for patients with a long
history. It appears only once the patient has at least a set number of encounters, five unless your
administrator has changed the **care_context.min_encounters** setting under Configurations (see
[Administration](administration.md)). Open it with the round grid button on the patient list or the
patient record. If you open it for a patient below the threshold, you are sent to the patient record.

Opening it collapses the sidebar to give you room. Across the top: **View chart** (the patient record),
**Patient AI+**, **Results** and **Policies**.

**The left pane** is the patient summary:

- **Risk Flags**, in red chips, or "No risk flags on file."
- **New** starts an encounter with this patient already filled in ([Creating an encounter](#creating-an-encounter)).
- **Details** opens the patient's personal, contact, emergency, insurance and identity details.
- **Vitals**, with when they were last captured, and biomarkers.
- **Medical Information**: allergies, active conditions and active medications.
- **Care team**: click a clinician to show only their encounters in the middle pane; click again, or
  **Clear**, to show all.
- **Previous Encounter**, **Next Appointment** and **Audit Information**.

The collapse button folds this pane into a narrow strip showing the MRN, name, age and gender; the
expand button brings it back.

**The middle pane** has three views:

- **Encounters · _n_**: every encounter, newest first, as cards.
- **Timeline**: the same encounters on a timeline.
- **Cancer**: the oncology timeline, shown only for patients who have one (see [Oncology](oncology.md)).

Above the encounters is the **Care Narrative · AI Summary**, a written summary of the patient's
history. **Refresh** regenerates it. If the AI service is unavailable you see a local preview built
from the encounter data instead, and the panel says so. Use the arrow buttons, or the left and right
arrow keys, to step through encounters.

At the bottom, **External records** fetches the patient's records from a Health Information Exchange.
The badge shows the consent state: **Consent granted**, **Consent expiring**, **Consent expired**,
**Consent revoked** or **No consent**. Press **Request & fetch records** (or **Fetch records** when
consent is already in place). When it finishes it says how many records were ingested; they are saved
as patient documents. If the fetch fails, the reason is shown, with **Retry** when a retry is allowed.

**The right pane** shows the selected encounter: its class, priority and chief complaint, then
sections you can jump to: **Results**, **Documents**, **Claims**, **Pre-Auth**, **Invoices** and
**Policy**, each with a count. **Clinical charting** opens the chart for that encounter.

## Results

**Results** (`/patients/{id}/results`) lists the patient's lab, imaging and procedure results on a
timeline, with the selected result in full on the right. Filter with **All**, **Lab**, **Imaging** or
**Procedure**. Results come 20 to a page, with **Previous** and **Next**. The back arrow returns to
Care Context. For how results are entered and reported, see
[Imaging and procedure results](results-reporting.md) and [Laboratory](lab.md).

## Patient AI+

**Patient AI+** (`/patients-ai/{id}`) is marked **Beta · AI generated**. It shows the patient summary
on the left, the **AI Care Narrative** in the middle and **AI Recommendations** on the right. The
recommendations are considerations for the clinician, not orders. **Care Context** at the top opens
that workspace.

When the patient has an encounter open today (arrived, triaged, in progress or on leave), a banner
offers **Copy AI Summary to Chart**. It opens that encounter's chart with the summary ready as a
draft. Nothing is saved until you review and insert it on the charting page.

**If instead:** the cards say the narrative or recommendations are "unavailable for this patient right
now", the AI service could not produce them. Try again later.

## Encounters

**Clinical Encounters** (`/encounters`) lists visits. It opens on **Today**.

Filter with:

- **Search encounters by patient or MRN...**;
- the status list: **All Statuses**, **Planned**, **Arrived**, **Triaged**, **In Progress**,
  **Finished**, **Cancelled**;
- the date list: **Today**, **Yesterday** or **Date Range**, which opens a two-month calendar to pick
  the range.

The table shows **Patient** (name, MRN, gender and age), **Primary Staff**, **Priority**, **Start
Time**, **Status** and **Class**. Press **View** to open an encounter. When there is more than one
page, **Previous** and **Next** appear with "Showing _n_ of _m_ encounters".

| Status | Colour |
| --- | --- |
| **Planned** | Sky blue |
| **Arrived** | Cyan |
| **Triaged** | Amber |
| **In Progress** | Violet |
| **On leave** | Orange |
| **Finished** | Green |
| **Cancelled** | Rose |
| **Entered in error** | Red |

**Priority** is coloured too: **stat** solid red, **asap** orange, **urgent** amber, **routine** blue,
**elective** teal. **Class** uses the standard codes, each in its own colour: **AMB** ambulatory,
**EMER** emergency, **IMP** inpatient, **VR** virtual, **HH** home health, and so on.

**If instead:** **No encounters found** for today suggests trying yesterday or a date range.

## Creating an encounter

**Go to:** **Encounters**, then **New Encounter** (`/encounters/new`). You also get here from
**Create Encounter** on an appointment, and from **New** in Care Context.

1. Pick the patient in **Search by name, MRN, or mobile**.
2. Under **Primary Staff**, type in **Search by staff name or employee ID** and pick the clinician.
   **Change** lets you pick someone else.
3. Choose the **Encounter Class** (**Ambulatory**, **Emergency**, **Virtual**, **Inpatient**, **Home
   Health**) and **Priority** (**Routine**, **Urgent**, **ASAP**, **STAT**, **Elective**).
4. Set the **Start Date** and **Start Time**.
5. Press **Create Encounter**.

A new encounter starts as **Planned**.

**From an appointment**, a note says the patient and staff have been pre-filled from the appointment,
and the patient, staff, date and time are locked to the appointment's.

**Check:** the toast says "Encounter Created" and the encounter page opens.

**If instead:** the form shows "Please select a patient", "Please select a staff member", "Start date
is required" or "Invalid time format (HH:MM)". A refusal from the server shows its reason, or "Failed
to create encounter". "No staff found." under the staff search means nobody active matches.

## The encounter page

**Encounter Details** (`/encounters/{id}`) shows the patient, MRN, gender and age, and the
**Encounter #**.

**Encounter Information** shows the status, class, priority, start and end times, source and primary
staff.

**Triage** opens triage for this encounter; see [Charting and triage](clinical-charting.md).

### Changing the status

Pick a new status in the list at the top right: **Planned**, **Arrived**, **Triaged**, **In Progress**,
**Finished** or **Cancelled**. It saves as soon as you pick it, with no confirmation. The toast says
"Status Updated". If the change is refused, the toast shows the server's reason, or "Failed to update
status".

### Adding coverage

**Encounter Coverages** links the visit to a payer or policy, so eligibility, prior authorisation and
claims use the right cover.

1. Press **Add coverage**.
2. Choose a **Policy (optional)** from the patient's active policies; this fills in the payer and plan.
   Or choose the **Payer** directly.
3. Set the **Financial class** (**Insurance**, **Corporate**, **TPA**, **Government**, **Cash / Self
   Pay**) and **Coverage level** (**Primary**, **Secondary**, **Tertiary**, **Self-pay**).
4. Fill in what you have of **Plan name**, **Network**, **Member name**, **Member ID**, **Copay
   (currency)** and **Coinsurance (%)**. The two snapshot fields take JSON and can be left empty.
5. Press **Save coverage**.

**Check:** the toast says "Coverage added" and the coverage appears with an **Active** badge.

**If instead:** "Invalid JSON" means a snapshot field is not valid JSON. "Unable to save coverage"
shows the server's reason.

For what happens to coverage afterwards, see [Revenue cycle and claims](revenue-cycle.md).

## Appointments

**Appointments** (`/scheduling/appointments`) lists your facility's appointments for one day, starting
with today. Move between days with **Previous**, **Next** and **Today**.

Filter by status: **All Statuses**, **Scheduled**, **Confirmed**, **Checked In**, **In Progress**,
**Completed**, **Cancelled**, **No Show**.

The table shows **Time** (start and end), **Patient** (name, MRN, gender and age), **Type**, **Status**,
**Staff** ("Not assigned" when nobody is), **Visit Type** and **Actions**.

| Status | Colour |
| --- | --- |
| **scheduled** | Sky blue |
| **confirmed** | Blue |
| **checked in** | Cyan |
| **in progress** | Violet |
| **completed** | Green |
| **cancelled** | Rose |
| **no show** | Orange |
| **rescheduled** | Amber |

The **…** menu on each row has:

- **View Details**, the appointment page;
- **Create Encounter**, not offered for a cancelled appointment;
- **Reschedule**, not offered for a cancelled or completed appointment ([Rescheduling](#rescheduling)).

**If instead:** **No appointments found** with no filters set offers **Book Appointment**.

## Booking an appointment

**Go to:** **Appointments**, then **Book Appointment**. This opens **Book New Appointment**
(`/scheduling/appointments/new`).

1. Pick the patient in **Search by name, MRN, or mobile**.
2. Choose the **Appointment Type**: **Health Checkup**, **Consultation** (the default), **Follow-up**,
   **Vaccination**, **Lab Test**, **Imaging**, **Procedure** or **Emergency**.
3. Choose the **Preferred Staff (Optional)**. Only staff with availability on
   [Staff Scheduling](#staff-scheduling) are listed.
4. Set the **Appointment Duration**: 15, 30 (the default) or 45 minutes, 1, 1.5 or 2 hours.
5. Pick the date in **Select Date**. Past dates cannot be picked. For a **Consultation**, choosing a
   staff member sets the date to today for you.
6. With a staff member and date chosen, **Available Time Slots** shows their free start times in
   15-minute steps, with a count. Click one: it is highlighted with a tick, across the whole duration,
   and **Start Time** and **End Time** are filled in. Switch the list to **All Slots** to see the
   whole day from 8 am to 6 pm, with times that are not free greyed out.
7. Without a staff member there are no slots; type the **Start Time** and **End Time** yourself.
8. Choose the **Visit Type**: **In-Person**, **Telehealth** or **Home Visit**.
9. Add any **Notes**, then press **Book Appointment**.

**Check:** the toast says "Appointment Booked" and the new appointment's page opens.

**If instead:**

- "Please select a patient", "Appointment type is required", "Appointment date is required" or
  "Invalid time format (HH:MM)" under the field concerned.
- **No available slots**: the staff member has no availability that day. Pick another day or another
  clinician.
- A refusal from the server shows its reason, or "Failed to book appointment".

## The appointment page

**Appointment Details** (`/scheduling/appointments/{id}`) shows:

- **Appointment Information**: status, type, start and end time, visit type and notes;
- **Patient & Staff**: the patient with MRN, **Assigned Staff**, and the facility and space when set;
- **Allocated Resources**, when staff, equipment or rooms are attached, each with its role, status
  and time;
- **Cancellation Details** for a cancelled appointment: the reason and when it was cancelled;
- **Metadata**: when it was created and last updated.

The buttons at the top:

- **Create Encounter** starts an encounter from this appointment. Not shown once cancelled.
- **Reschedule** and **Cancel Appointment**. Not shown once cancelled or completed.

### Rescheduling

1. Press **Reschedule**. The **Reschedule Appointment** dialog opens on the current date and times.
2. Pick the **New Date** and **Duration**.
3. If the appointment has a staff member, **Available Slots** lists their free times; click one to
   fill in the times. Otherwise type the **Start Time** and **End Time**.
4. Add a **Reason (optional)** and press **Confirm**.

**Check:** the toast says "Appointment Rescheduled".

**If instead:** "Please pick a new date and time before rescheduling." or "End time must be after
start time." A server refusal shows under "Unable to reschedule".

### Cancelling

Press **Cancel Appointment** and confirm "Are you sure you want to cancel this appointment?". The
reason is recorded as "Cancelled by user". The toast says "Appointment Cancelled" and you return to
the list.

## Staff Calendar

**Staff Calendar** (`/scheduling/calendar`) shows one staff member's appointments and encounters as a
diary.

1. Pick someone in **Select a staff member...**. Only staff with availability on Staff Scheduling are
   listed.
2. Choose **Day**, **Week** (the default) or **Month**, and move with the arrows and **Today**. The
   range shown sits beside them.

The heading gives the staff member's name, type and the number of events. Each event shows the
patient, MRN, time and type, with a status badge and whether it is an **appointment** or an
**encounter**:

- appointments have a blue left edge, encounters a green one;
- an icon shows the source: calendar for scheduled, people for walk-in, alert for emergency, camera
  for telemedicine;
- the status dot is blue for scheduled, green for confirmed, yellow for in progress, grey for
  completed or finished, red for cancelled and orange for no show.

Today is highlighted. In **Month**, each day shows up to three events and "+_n_ more"; click a day to
open it in **Day** view. In **Week** and **Month**, hover over an event for its details. Click an
event to open the appointment or encounter. A legend under the diary repeats the colours and icons.

**Day** view runs from 7 am to 8 pm, so events outside those hours are not shown there; use **Week**.

## Staff Scheduling

**Staff Scheduling** (`/scheduling/staff`) sets each clinician's recurring weekly availability. It
drives the staff lists and free slots in booking, rescheduling and the Staff Calendar.

1. Pick the **Staff Member**; the first is chosen for you. Their qualification, languages and
   specialties show underneath.
2. **Effective date** (today by default) shows the slots in force on that date. Turn on **Include
   expired slots** to see old ones too.

**Weekly availability** lists the slots: **Day**, **Time**, **Effective** (from and to), **Availability**
(**Available** green, **Unavailable** red), **Type** and **Notes**.

### Adding one slot

1. Press **New slot**.
2. Choose the **Day of Week**, **Start Time** and **End Time** (9:00 to 17:00 to begin with).
3. Set **Effective From** (today) and, if it ends, **Effective To**.
4. **Schedule Type** is free text and starts as "regular".
5. **Facility** is your current facility and cannot be changed here.
6. Leave **Staff available during this slot** on for working time; turn it off to record time they
   are not available.
7. Add **Notes** if useful and press **Save schedule**.

**Check:** the toast says "Schedule created".

### Adding the same slot on several days

Press **Weekly slots**. Pick the **Weekdays** (Monday to Friday are chosen to begin with), then fill
in the same fields and press **Create weekly schedule**. With no day picked it says "Select at least
one weekday." and will not save. The toast says "Weekly schedule created".

### Changing or removing a slot

The pencil opens **Edit schedule**; press **Save schedule**. The bin removes the slot after you confirm
"Are you sure you want to delete this availability slot?".

**If instead:** a refusal shows as "Unable to create schedule", "Unable to update schedule", "Unable
to create weekly schedule" or "Unable to delete schedule", with the server's reason.

## Not live yet

- **Cancel** in the **…** menu on the Appointments list only shows "Cancel functionality will be
  implemented." Cancel from the appointment page instead.
- The Appointments search box matches the appointment type and the patient's internal ID only, not
  the patient's name or MRN.
- These screens have no control to confirm an appointment, check a patient in or mark a no-show.
- The patient list shows only the first 20 matches, with no next page.
- **Call** and **Message** in Care Context do nothing yet.
- Document verification (**Pending**, **Verified**, **Rejected**) is shown but cannot be changed from
  the patient record.
