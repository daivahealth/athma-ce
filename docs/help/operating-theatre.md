---
title: 'Operating theatre'
group: 'Clinical care'
order: 50
routes: ['/ot']
description: 'Running theatres day to day: the OT Board, OT Requests, OT Schedules with the day-of-surgery steps, OT Reports, and setting up OT Rooms.'
---

The **Operating Theatre** section of the sidebar holds five screens: **OT Board**, **OT Requests**,
**OT Schedules**, **OT Reports** and **OT Rooms**. Opening `/ot` on its own takes you straight to the
board.

A case moves through them in this order:

1. A clinician raises an **OT request** for a patient's operation. It starts as a draft.
2. The request is submitted, reviewed if needed, and approved.
3. A theatre scheduler books an approved request into a room and time slot: an **OT schedule**.
4. On the day, the team steps the schedule through the theatre stages, from **Confirm** to
   **Shift To Recovery**. The **OT Board** shows each room's current and next case as this happens.
5. The surgeon writes the **OT report** (the operative note) and signs it.

Shifting the patient to recovery completes the request automatically.

What you can see and press depends on your role's OT permissions. If a list loads with a red message
instead of rows, your role may not have access to that part of the module; ask your administrator.

## OT Board

**OT Board** (`/ot/board`) is the live picture of every theatre for one day. It is headed **Live
theatre operations**.

**Go to:** **Operating Theatre** > **OT Board**.

### Choosing the day and refreshing

- **Board date** picks the day. It opens on today.
- **Refresh** reloads the board. It does not update by itself, so press **Refresh** to see the latest
  state. The bar under the tiles says when the data was fetched, for example "Last updated 2 minutes
  ago".
- **Open OT Schedules** and **Open OT Rooms** jump to those screens.

### The tiles

Six tiles count the rooms for the chosen day: **Active rooms**, **Occupied**, **Idle**, **Blocked**,
**Next up** and **Cases in progress**.

### Room cards

Each configured OT room has a card, with a coloured strip along the top and a state badge. Under the
room name is its space number and specialty (or its notes).

| State badge | Colour | Meaning |
| --- | --- | --- |
| **Case in progress** | Green | A case is live in the room now: the patient is in theatre, under anaesthesia, or in surgery. |
| **Next case pending** | Amber | Nothing live now, but another case is booked later that day. |
| **Room blocked** | Red | The room has an approved block covering the time. The reason shows in a red box under the name. |
| **Idle** | Grey | The room is active with nothing live and nothing more booked that day. |
| **Inactive** | Pale grey | The room is switched off in **OT Rooms**. |

For a past or future date the board judges "now" as the start of that day, so cases appear as next
cases rather than live ones.

Each card shows two panels:

- **Current case**: the procedure, its planned start and end times, the patient's name, MRN, gender
  and age, and the schedule's status badge. Empty, it says "No case in progress."
- **Next case**: the same details for the next booked case. Empty, it says "No more cases queued for
  today."

The strip along the bottom of the card summarises the room's day:

- **Scheduled**, **Completed** and **Cancelled** case counts.
- **Planned** and **Actual** theatre minutes.
- **Delay**: minutes behind the planned start, in amber, or **On time**.

**If instead:** the board says **No OT rooms configured**, no rooms have been set up yet. Configure
them in [OT Rooms](#ot-rooms) first.

## OT Requests

**OT Requests** (`/ot/requests`) lists every theatre request, newest first. Each row shows the
**Procedure** (with its code or surgery type, and any remarks), the **Patient** (name, MRN, gender and
age), **Priority**, **Preferred Date**, **Status** and **Requested At**.

- Search by patient name, MRN or phone in **Search patients by name, MRN, or phone...**.
- Filter by status with the drop-down (**All statuses** by default).
- Click a row, or **View**, to open the request.

### Priority and status badges

| Priority | Colour |
| --- | --- |
| **Elective** | Teal |
| **Urgent** | Amber |
| **Emergency** | Solid red, so it stands out on the list |

| Status | Colour | Meaning |
| --- | --- | --- |
| **Draft** | Slate | Saved but not yet sent. |
| **Requested** | Blue | Submitted and waiting for review or approval. |
| **Under Review** | Amber | Being reviewed. |
| **Approved** | Green | Ready to be scheduled. |
| **Rejected** | Red | Turned down. |
| **Scheduled** | Indigo | Booked into a theatre slot. |
| **Cancelled** | Rose | Withdrawn. |
| **Completed** | Teal | The operation is done. |

### Raising a request

**Go to:** **OT Requests** > **New OT Request** (`/ot/requests/new`).

1. In **Patient**, search for and pick the patient. If the patient has an oncology diagnosis, a grey
   box shows it with the latest stage and clinical status.
2. Pick the **Active Encounter** the operation belongs to. Only the patient's active encounters are
   listed.
3. In **Procedure Name**, start typing and pick from the surgical procedures in the catalogue. Picking
   one fills **Procedure Code**, and, where the catalogue has them, **Surgery Type**, **Expected
   Duration (minutes)** and **Anaesthesia Plan**. You can change those afterwards; the code cannot be
   typed.
4. Set **Priority** (**ELECTIVE** by default), and add **Diagnosis** if you wish.
5. Optionally set **Preferred Date**, **Preferred OT Room** (active rooms only) and **Primary
   Surgeon**.
6. List any **Special Equipment** and **Implants Required**, separated by commas (for example "C-arm,
   microscope").
7. Tick **Anaesthetist required** or **Blood required** if they apply, and add **Remarks**.
8. Press **Save Draft**.

**Reset** clears the form.

**Check:** a toast says "OT request created: The request was saved in draft status." and you are back
on the list with the new row at **Draft**.

**If instead:**

- "Missing required fields: Patient, encounter, and procedure name are required." Pick all three.
- "Unable to create OT request" with the server's reason, for example that the encounter was not found
  for the patient.

### Moving a request along

The list shows only the buttons that fit each row's status:

| Status | Buttons |
| --- | --- |
| **Draft** | **Submit**, **Cancel** |
| **Requested** | **Review**, **Approve**, **Cancel** |
| **Under Review** | **Approve**, **Cancel** |
| **Approved** | **Cancel** |
| **Scheduled** | **Complete**, **Cancel** |

Each press shows "OT request updated" on success, or "Workflow action failed" with the reason.

- **Approve** works straight from **Requested**; you do not have to **Review** first.
- **Complete** only works once the case's schedule has reached **Surgery Completed** or **Patient
  Shifted To Recovery**. Otherwise it is refused with "OT request can only be completed after surgery
  is completed or shifted to recovery". You rarely need it: shifting the patient to recovery completes
  the request for you.
- **Cancel** on a scheduled request is refused with "Cancel the active OT schedule before cancelling
  the OT request". Cancel or postpone the schedule first.

### The request page

Opening a request (`/ot/requests/{id}`) shows the procedure with its status badge, the patient, and
the plan: **Priority**, **Surgery Type**, **Procedure Code**, **Expected Duration**, **Preferred
Date**, **Preferred Room**, **Primary Surgeon**, **Anaesthesia**, **Blood Required**, **Requested
At**, and, when filled in, **Diagnosis**, **Remarks**, **Special Equipment**, **Implants** and
**Rejection Reason**.

Below it:

- **OT Schedules**: every slot this request has been booked into, with its status. Click one to open
  it.
- **OT Reports**: the operative reports for the case. Click one to open it.
- **Status History**: each status change, newest first, with its time.

The request page is read-only. Use the buttons on the list to change its status.

## OT Schedules

**OT Schedules** (`/ot/schedules`) lists booked theatre slots in start-time order. Each row shows the
**Start Time** (and when it ends), the **Room**, the **Patient**, the **Status**, the **Anaesthesia**
type, and **Current** or **Historical**. A request rebooked into a new slot keeps its old slot as
**Historical**.

Search by patient and filter by status as on the requests list. Click a row, or **View**, to open it.

### Booking a case

**Go to:** **OT Schedules** > **New OT Schedule** (`/ot/schedules/new`).

1. Pick the **OT Request**. Only **Approved** requests, and already **Scheduled** ones you want to
   rebook, are listed.
2. Pick the **OT Room**. Only active rooms are listed.
3. Set **Scheduled Start** and **Scheduled End**.
4. Pick the team: **Primary Surgeon**, **Anaesthetist**, **Scrub Nurse**, **Circulating Nurse** and
   **Technician**. Each list shows all staff.
5. Type the **Anaesthesia Type** if known.
6. Press **Create Schedule**.

As soon as the room and both times are set, the screen checks the slot. If the room or any chosen
team member is already booked, unavailable, or the room is blocked, an amber box headed **Scheduling
conflicts detected** lists each clash, and **Create Schedule** is greyed out until you change the
room, time or team.

**Check:** a toast says "OT schedule created: The OT request is now scheduled." The schedule starts at
**Planned** and its request moves to **Scheduled**.

**If instead:**

- "Missing required fields: Request, room, start time, and end time are required."
- "Unable to create OT schedule" with the reason, such as "Scheduled end time must be after scheduled
  start time" or "OT schedule conflicts detected".

**Rebooking:** booking a new slot for a request that is already scheduled replaces the old slot. The
old one becomes **Postponed** and **Historical**, with the reason "Superseded by a newer OT schedule".

### The day of surgery

Each row offers the next step for its status. Press it as the case moves on:

| Status | Colour | Next button |
| --- | --- | --- |
| **Planned** | Sky | **Confirm** |
| **Confirmed** | Blue | **Patient Ready** |
| **Patient Ready** | Cyan | **Patient In OT** |
| **Patient In OT** | Violet | **Anaesthesia Started** |
| **Anaesthesia Started** | Amber | **Surgery Started** |
| **Surgery Started** | Orange | **Surgery Completed** |
| **Surgery Completed** | Green | **Shift To Recovery** |
| **Patient Shifted To Recovery** | Teal | None: the case is finished and its request is completed. |
| **Postponed** | Fuchsia | None |
| **Cancelled** | Rose | None |

The colours run cool to warm to green through the day, so a list or board reads at a glance. While a
case is at **Patient In OT**, **Anaesthesia Started** or **Surgery Started**, its room shows as
**Case in progress** on the board.

Each step shows "OT schedule updated" on success, or "Workflow action failed" with the reason.

### Postponing or cancelling a slot

- **Postpone** is offered while the case is **Planned**, **Confirmed** or **Patient Ready**.
- **Cancel** is offered at any status except **Cancelled**, **Postponed** and **Patient Shifted To
  Recovery**.

Both act at once, with no confirmation, and send the request back to **Approved** so it can be booked
again.

### The schedule page

Opening a schedule (`/ot/schedules/{id}`) shows the room with the status badge, the patient, the
**Scheduled Start** and **Scheduled End**, the **Actual Start** and **Actual End**, the team by name,
the **Anaesthesia Type**, and, when set, **Assistant Surgeons**, **Postponed Reason** and **Cancelled
Reason**.

Below it are the **Team Members** roster, the case's **OT Reports** (click to open), and the **Status
History**, newest first. The page is read-only; use the buttons on the list to move the case on.

## OT Reports

**OT Reports** (`/ot/reports`) lists the operative reports, newest first. Each row shows the
**Report** number with its remarks, the **Schedule** start time, the **Patient**, the **Status**,
**Created At** (and when it was signed, or **Not signed**), and the number of **Versions**.

Search by patient and filter by status as on the other lists.

| Status | Colour | Meaning |
| --- | --- | --- |
| **Draft** | Slate | Written but not signed. |
| **Signed** | Green | Signed off. |
| **Amended** | Amber | Changed after signing; needs signing again. |
| **Cancelled** | Rose | Withdrawn. |

### Writing a report

**Go to:** **OT Reports** > **New OT Report** (`/ot/reports/new`).

1. Pick the **OT Schedule**. Cases from **Confirmed** through **Patient Shifted To Recovery** are
   listed, shown by patient, start time and MRN.
2. Add **Remarks** if you wish.
3. Fill in **Report Data (JSON)**. The box starts with a template of fields: procedure summary,
   findings, operative steps, complications, blood loss in ml, implants used and disposition. Type
   your text between the quotation marks, and keep the brackets and commas as they are.
4. Press **Save Draft**.

**Check:** a toast says "OT report created: Draft operative report saved." and the report is listed
at **Draft**.

**If instead:**

- "Schedule required: Select an OT schedule before creating the report."
- "Unable to save OT report" with a message about the JSON: a quotation mark, bracket or comma is
  missing or extra. Check the text against the template.
- "Unable to save OT report" saying an active report already exists for the schedule. Each case has
  one report; open and amend the existing one instead.

### Signing

Press **Sign** on a **Draft** or **Amended** report, on the list or on the report page. A toast says
"OT report signed: The operative report is now signed." If refused, it says "Unable to sign OT
report" with the reason.

### Amending a signed report

1. Press **Amend** on a **Signed** report. The **Amend OT Report** screen opens with the current
   remarks and content filled in, and the schedule locked.
2. Change what you need.
3. Press **Save Amendment**.

**Check:** "OT report amended: A new report version has been created." The report moves to
**Amended** and must be signed again. Earlier versions are kept.

### Cancelling a report

**Cancel** is on every report row that is not already **Cancelled**. It acts at once, with no
confirmation, and says "OT report cancelled: The report was moved to cancelled status."

### The report page

Opening a report (`/ot/reports/{id}`) shows the report number with its status, the patient,
**Created**, **Signed** and **Schedule** times, any **Remarks**, and the **Operative Report** itself,
laid out field by field. Lists show as bullets; empty fields say **Not documented** or **None**.
**Sign** and **Amend** are here too.

When a report has more than one version, **Version History** lists them, newest first, with the
current one marked **(current)**.

## OT Rooms

**OT Rooms** (`/ot/rooms`) lists the rooms set up for theatre scheduling, active and inactive, by
name. Each row shows the **Room** and its space number, the **Facility** and floor, the
**Specialty**, the **Space Type**, the **Status** (**Active** or **Inactive**) and **Notes**.

Rooms come from the facility's spaces, which are set up in
[Administration](administration.md). This screen marks a space as a theatre and adds OT details.

### Configuring a room

**Go to:** **OT Rooms** > **Configure OT Room** (`/ot/rooms/new`).

1. Pick the **Facility**. It starts on your current facility.
2. Pick the **Space**. Only active spaces are listed.
3. Add a **Specialty** (for example "Cardiac, ortho, neuro") and **Notes** (for example "Laminar flow,
   robotics, hybrid theatre setup") if you wish.
4. Leave **OT room is active and schedulable** ticked for a room that takes bookings. Untick it to
   keep the room on file but out of scheduling.
5. Press **Save Room Config**.

**Check:** "OT room saved: The room configuration was updated successfully." The room appears on the
list and the board.

**If instead:** "Space required: Select a Foundation space to configure it as an OT room.", or
"Unable to save OT room" with the reason.

To change a room's specialty, notes or active setting, configure the same space again: saving
replaces its OT details.

## Not live yet

- **Reject** a request: there is no reject button, so a request can be approved or cancelled but not
  rejected from the screens. A **Rejection Reason** only shows on requests rejected some other way.
- Request, schedule and room pages have no edit. Details entered on a request or schedule cannot be
  changed afterwards; rebook the case or raise a new request.
- On **New OT Schedule**, the **Notes** box is not saved, and assistant surgeons and extra team
  members cannot be added, so **Assistant Surgeons** and **Team Members** stay empty for schedules
  made here.
- **Postpone** and **Cancel** on schedules do not ask for a reason, so **Postponed Reason** and
  **Cancelled Reason** stay blank unless the slot was superseded by a rebooking.
- The OT report is entered as raw JSON text; there is no form for it yet.
- The board does not refresh by itself.
