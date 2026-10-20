---
title: 'Charting and triage'
group: 'Clinical care'
order: 30
routes: ['/charting', '/triage']
description: 'Triaging an arrival on the Triage Queue and Triage Assessment, then charting the encounter in Smart Charting: notes, diagnoses, orders, prescriptions, AI coding suggestions and structured forms.'
---

Both screens sit under **Clinical** in the sidebar: **Clinical Charting** and **Triage**. They work on
encounters, so the patient must already be registered and have an encounter open (see
[Patient access](patient-access.md)).

The usual order for a visit is:

1. The nurse finds the arrival on the **Triage Queue** and records the triage.
2. The clinician finds the same encounter on **Clinical Charting** and opens the charting workspace.
3. The clinician writes the note, adds diagnoses, orders and prescriptions, and fills any forms.

Nothing forces that order. You can chart an encounter that was never triaged; the triage summary in the
chart header simply does not appear.

## Triage Queue

**Triage Queue** (`/triage`) lists encounters so you can pick the one to triage. It opens on **Today**.

**Go to:** **Clinical** > **Triage** in the sidebar.

The filters along the top:

- **Search by patient or MRN**: type a name or MRN. The list narrows as you type.
- The status filter: **All statuses**, **Arrived**, **Triaged** or **In progress**. **All statuses**
  shows every encounter in the date window, including finished and cancelled ones.
- The date filter: **Today**, **Yesterday** or **Date Range**. Choosing **Date Range** shows a button with
  the range on it; press it to pick a start and end date on a two-month calendar. Pick one day for a
  single-day range.

Each row shows:

| Column | What it shows |
| --- | --- |
| **Patient** | Name, then MRN and gender / age underneath. |
| **Primary staff** | The encounter's primary clinician, or **Unassigned**. |
| **Encounter class** | The class the encounter was opened with, as a grey badge. |
| **Start time** | When the encounter started. |
| **Status** | The encounter status as a coloured badge (see below). |
| **Actions** | **Open triage**. |

The list shows 15 encounters a page. When there is more than one page, **Previous** and **Next** appear
under the table with "Showing _n_ of _total_ encounters".

### Status colours

The same badge colours are used on the Triage Queue and on Clinical Charting.

| Status | Colour | Meaning |
| --- | --- | --- |
| **PLANNED** | Blue | Booked, patient not yet arrived. |
| **ARRIVED** | Primary (theme colour) | Checked in, waiting for triage. |
| **TRIAGED** | Yellow | Triage recorded, waiting for the clinician. |
| **IN PROGRESS** | Green | Being seen. |
| **FINISHED** | Grey | Encounter closed. |
| **CANCELLED** | Red | Encounter cancelled. |

Any other status shows in a neutral grey badge.

**If instead** the list is empty, the screen says "No encounters match your filters." with a hint:

- "Try adjusting your search or status filter." when you have typed a search or chosen a status.
- "No encounters scheduled for today. Try selecting yesterday or a date range." on **Today**.
- "No encounters scheduled for yesterday. Try selecting today or a date range." on **Yesterday**.
- "No encounters in the selected date range. Try widening your range." on **Date Range**.

If the encounters cannot be loaded, a red **Unable to load encounters** box shows the reason.

## Triage Assessment

**Triage Assessment** (`/encounters/{id}/triage`) is where you record the triage for one encounter. Open it
with **Open triage** on the queue. The back arrow beside the title returns you to the **Triage Queue**.

The top card names the patient and shows the encounter number, class and status, then **Age**, **Gender**
and **MRN**. Underneath are the **Start time** and, once a triage exists, **Last triaged** with the time it
was last saved.

### Record a triage

1. Choose the **Triage level**. It starts on **Level 5 · Non-urgent**. The levels are:

   | Level | Label |
   | --- | --- |
   | 1 | **Level 1 · Critical** |
   | 2 | **Level 2 · Emergency** |
   | 3 | **Level 3 · Urgent** |
   | 4 | **Level 4 · Semi-urgent** |
   | 5 | **Level 5 · Non-urgent** |

2. Check the **Triage clinician**. It is filled with the encounter's primary clinician; change it to
   whoever did the triage. Any active staff member can be chosen.
3. Enter a **Pain score (0-10)** if you have one. It is optional.
4. Write the **Chief complaint & HPI**. This is the one field you must fill.
5. Enter the **Vital signs** you took. Every vital is optional; leave blank what you did not measure.
6. Add **Allergies**: **Allergen**, **Reaction** and **Severity** for each. Press **Add allergy** for
   another row and **Remove** to drop one (shown once there is more than one row). A row with no
   allergen is ignored on save.
7. Add **Current medications**: **Name**, **Dosage** and **Frequency**. **Add medication** and **Remove**
   work the same way. A row with no name is ignored.
8. Add **Additional notes** for observations or quick interventions.
9. Press **Save triage**. The button reads **Saving...** while it works.

**Check:** the toast says **Triage created** ("Triage record saved successfully."), the footer now shows
an **Existing triage record** badge, and the button changes to **Update triage**. If the encounter was
**ARRIVED**, it moves to **TRIAGED**, which you will see on both queues.

**If instead** nothing happens when you press **Save triage**, a required field is empty: the label of
**Chief complaint & HPI** (or **Triage clinician**) turns red. Fill it and save again. If the server
refuses, the toast reads **Unable to save triage** with the server's reason, or "Please try again later."

### Which vital signs you see

The vital sign fields come from a vital signs template when one fits the encounter. The screen chooses
the care setting from the encounter class (emergency, ICU, inpatient, day care, otherwise outpatient)
and the age group from the patient's date of birth (newborn, infant, child, adolescent, adult, elderly).
When a template is found, a badge says **Loaded from template _code_** and the fields are the
template's, labelled as the template labels them.

With no matching template you get the standard set: **Temperature**, **Heart rate**, **Respiratory
rate**, **Systolic BP**, **Diastolic BP**, **SpO₂ %**, **Weight**, **Height** and **BMI**. BMI is
typed in; it is not worked out from height and weight.

### Change a triage

Open the encounter's triage again. The form loads what was saved. Change what you need and press
**Update triage**.

**Check:** the toast says **Triage updated** and **Last triaged** shows the new time.

An encounter has one triage. Updating replaces the saved values; the screen keeps no earlier versions.

## Clinical Charting

**Clinical Charting** (`/charting`) is the list you start charting from. It works exactly like the
Triage Queue: the same **Search by patient or MRN** box, date filter (**Today**, **Yesterday**,
**Date Range**), columns, status colours, empty-list messages and 15-a-page paging.

**Go to:** **Clinical** > **Clinical Charting** in the sidebar.

The differences:

- The status filter offers every status: **All statuses**, **In Progress**, **Arrived**, **Triaged**,
  **Planned**, **Finished** and **Cancelled**.
- Each row has two actions:
  - **AI+** opens Patient AI+ for the patient, where you can read an AI summary and copy a draft into the
    chart (see [Insert an AI draft](#insert-an-ai-draft)).
  - **Open charting** opens the charting workspace. **It is greyed out for a FINISHED encounter**, so a
    closed encounter cannot be charted from here.

## The charting workspace

The charting workspace (`/encounters/{id}/charting`) has three parts, top to bottom: the patient header,
**Smart Charting**, and **Forms**.

**If instead** the page says **Encounter not found** ("Please return to encounters and select another
record."), the encounter id is wrong or no longer reachable. Go back to **Clinical Charting** and pick the
encounter from the list.

### The patient header

The header card says **Clinical Charting** and the encounter number, then the **Patient**, **Age**,
**Gender**, **MRN** and encounter **Status**.

When the encounter has been triaged, the right of the header also shows:

- **Triage vitals**: a one-line summary such as "Temp 37.2°C · HR 88 bpm · BP 120/80 · SpO2 98%", or
  "No vitals recorded".
- **Allergies**: each allergen with its severity and reaction, or "No allergies documented".

These come from the triage and are read-only here. To correct them, change the triage (see
[Change a triage](#change-a-triage)).

## Smart Charting

**Smart Charting** is the encounter note. It is built from blocks, one of each kind, which you add as you
need them. A badge by the **Save** button counts the blocks, for example **3 blocks**.

There are six kinds of block, each with a coloured bar down its left edge:

| Block | Bar colour | What it holds | How it saves |
| --- | --- | --- | --- |
| **Chief Complaints and HPI** | Blue | Free text: presenting complaints and history of present illness. | With **Save**. |
| **History** | Amber | Free text: past medical, surgical, family or social history. | With **Save**. |
| **Notes** | Slate | Free text: clinical notes and observations. | With **Save**. |
| **Diagnosis** | Rose | ICD-10 diagnoses from the catalogue. | Each one at once. |
| **Orders** | Theme colour | Lab tests, imaging studies, procedures and packages. | Each one at once. |
| **Prescription** | Emerald | Medicines from the medication catalogue. | Each one at once. |

**The two kinds save differently.** Text in the three text blocks is kept only when you press **Save**.
A diagnosis, order or prescription is recorded against the encounter the moment you pick it, and a toast
confirms it. There is no autosave and no warning if you leave with unsaved text, so press **Save** before
you go.

### Add a block

1. Press **Add Block** under the note, or press **⌘/** (**Ctrl+/** on Windows) anywhere on the page.
2. Pick the block from the menu. Each entry has a short description.

The menu only offers blocks the note does not have yet. Once all six are in, **Add Block** disappears.
While the note is empty you cannot type into it; the line "Press ⌘/ or click the button to add blocks"
reminds you to add a block first.

New blocks go to the bottom of the note. A new text block puts your cursor straight into it.

### Remove a block

Hover over the block's heading and press the bin icon at its right.

Removing a text block removes its text from the note when you next **Save**. **Removing a Diagnosis,
Orders or Prescription block does not remove what is in it.** The diagnoses, orders and prescriptions
stay on the encounter; add the block again and they are all still listed. To take one off, remove it
inside the block (see below).

### Save the note

Press **Save** at the top right. It reads **Saving...** while it works.

**Check:** the toast says **Saved** ("Smart charting content saved successfully.") and the toolbar shows
**Saved just now**, which later reads "Saved 5m ago" and then the time.

**If instead** the toast says **Unable to save**, the message under it is the reason. Your text is still
on screen; try **Save** again.

The note is filed under the encounter's primary clinician as a progress note titled "Smart Charting".
Opening the chart again reloads the saved blocks.

### Diagnosis

1. Choose the type in the box beside the search: **primary**, **secondary**, **rule out** or
   **differential**. It starts on **primary** and applies to the next diagnosis you add.
2. Type into **Search ICD catalog...**. Matches show the description, the code and its chapter or category.
3. Click a match.

**Check:** the toast says **Diagnosis added** ("_code_ attached to encounter.") and the diagnosis appears
under the search with its code, its type badge and, for a chronic condition, a red **Chronic** badge.

Diagnoses are ranked in the order you add them, and recorded as diagnosed by the encounter's primary
clinician.

**If instead**:

- A code already on the encounter is greyed out in the results and cannot be picked again. If it does
  get through, the toast reads **Diagnosis already added**.
- "No diagnoses found." means nothing in your ICD catalogue matches what you typed.
- **Unable to add diagnosis** gives the server's reason.

To remove a diagnosis, hover over it and press its bin icon. The toast says **Diagnosis removed**.

### Orders

1. Choose what to order with the pills at the top: **Lab**, **Imaging**, **Procedure** or **Package**.
   The line under the search says what the choice does, for example "Add lab tests directly to the
   encounter." or "Packages create grouped orders for the encounter."
2. Type into the search (**Search lab tests...**, **Search imaging studies...**, **Search procedures...** or
   **Search packages...**).
3. Click a match.

**Check:** for a single order the toast says **Order added** ("_name_ created."). For a package it says
**Package added** ("_name_ expanded into _n_ clinical orders.").

Every order from this screen is placed at **Routine** priority and recorded as ordered by the
encounter's primary clinician. There is no priority choice here.

The list under the search shows:

- **Packages** first, in a box with an amber **Package** badge, the package name and code, how many
  orders it made and of what kind ("2 lab · 1 imaging"), and its status. Press the arrow by the name to
  show the orders inside it.
- **Single orders**, each with a coloured type badge (Lab green, Imaging sky blue, Procedure violet), the
  name and the code.
- A blue **Results** link on any order that is completed or has a result. It opens that result (see
  [Imaging and procedure results](results-reporting.md) and [Laboratory](lab.md)).

To take an order off, press its bin icon: the toast says **Order removed**. The bin on a package
**cancels the package and its open orders**: the toast says **Package cancelled** ("_name_ and its open
child orders were cancelled.").

**If instead**:

- An item already on the encounter, or a package already added, is greyed out in the results. If it
  does get through, the toast reads **Order already added** or **Package already added**.
- "No matches found." means nothing in the catalogue matches.
- **Unable to add order**, **Unable to add package**, **Unable to remove order** or **Unable to cancel
  package** give the server's reason.

### Prescription

1. Type into **Search medications...**. A list opens under the box as you type.
2. Each medicine shows its name, code system and code, and the dose, route and frequency it will be
   prescribed with.
3. Click a medicine.

**Check:** the toast says **Prescription added** ("_name_ created.") and the medicine appears in the list
with its status, dose, route and frequency.

**The dose, route and frequency come from the medication catalogue and cannot be changed here.** A
medicine with no strength is prescribed "As directed", with no route "oral", and with no default
frequency "once daily". The prescription is recorded under the encounter's primary clinician.

**If instead**:

- A medicine already prescribed on the encounter is faded and says **Already prescribed**. If it does
  get through, the toast reads **Prescription already exists**.
- "No medications found." means nothing in the medication catalogue matches.
- **Unable to add prescription** gives the server's reason.

To remove a prescription, hover over it and press its bin icon. The toast says **Prescription removed**.

For dispensing, see [Pharmacy](pharmacy.md).

### Insert an AI draft

If you used **Copy AI Summary to Chart** on Patient AI+ for this encounter, the chart opens with a violet
banner: **AI-drafted content is ready for this encounter**, with when it was generated.

- **Insert AI Draft** adds the drafted **Chief Complaints and HPI**, **History** and **Notes** as new
  blocks, skipping any of those the note already has. The toast says **AI draft inserted** ("Review the
  inserted content, then Save when ready.").
- **Dismiss** throws the draft away.

Nothing is saved until you press **Save**. The draft is held only in your browser tab, so it is lost if
you close the tab before inserting it.

### AI Coding Suggestions

Shown when your organisation has AI clinical coding switched on.

The **AI Coding Suggestions** panel runs down the right of Smart Charting. It reads only the three text
blocks (never diagnoses, orders or prescriptions) and suggests codes once you have written enough text
(20 characters or more). It waits for you to pause typing before it asks.

Each suggestion card shows:

- the code, in blue for ICD-10;
- the code system;
- a type badge when it is not a diagnosis: **history** (amber), **symptom** (orange), **finding**
  (teal) or **procedure**;
- a red **Not in catalog** badge when the ICD-10 code is not in your catalogue, so it cannot be added;
- a short description and the reason it was suggested;
- a confidence bar: green at 80% or more, yellow from 50%, red below.

Press **+** on an ICD-10 suggestion that is in your catalogue to add it as a **primary** diagnosis. The
toast says **Diagnosis added**. Change its type afterwards only by removing it and adding it again from
the Diagnosis block with the right type.

The refresh icon asks again. The arrow collapses the panel to a thin **AI Coding** strip; your choice is
remembered in this browser.

The panel's messages:

- "Start typing clinical notes to get AI-powered coding suggestions." until there is enough text.
- "No coding suggestions for the current text."
- "Failed to fetch suggestions." with **Retry**.

When you press **Save**, the suggestions on screen are kept with the encounter, marked as accepted
(those you added) or suggested.

## Forms

The **Forms** card under Smart Charting holds structured forms for the encounter. The forms on offer are
the active ones in the form master catalogue (see [Administration](administration.md)).

- Forms already started are listed with their name, when they were last changed, and a status badge:
  **draft**, **final** or **amended**. Press **Continue** on a draft or **View** on the others.
- Forms not yet started are listed below in dashed boxes with their version. Press **Fill** to start
  one.
- "No forms available." means there are no active forms and none started.

Each form can be started once per encounter. If starting fails, the toast reads **Unable to start form**.

### Fill a form

The form opens on its own page (`/encounters/{id}/forms/{formResponseId}`) with its name, version and code,
and its status.

1. Fill the fields.
2. Press **Save Draft** to keep your progress. The toast says **Draft saved**.
3. Press **Submit** when it is complete.

**Check:** the toast says **Form submitted** ("The response has been recorded.") and you are taken back to
the charting workspace, where the form now shows **final**.

**If instead** the toast says **Form incomplete** ("Please fix the highlighted fields before
submitting."), the fields with problems are now highlighted. Fix them and submit again.

A submitted form is read-only: the page says "This form has been submitted as final." and the buttons
are gone. The back arrow returns you to the charting workspace.

## Not live yet

- **Drag handles.** Blocks show a grip icon by their heading on hover, but reordering blocks by dragging
  has not been confirmed to work. New blocks always go to the bottom.
- **Order priority and prescription details.** Smart Charting places every order as **Routine** and
  every prescription with the catalogue's default dose, route and frequency. There is no way to change
  these on this screen.
- **Author.** Notes, diagnoses, orders and prescriptions are recorded under the encounter's primary
  clinician, not under the person signed in.
