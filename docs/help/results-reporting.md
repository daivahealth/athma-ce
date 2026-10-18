---
title: 'Imaging and procedure results'
group: 'Diagnostics and pharmacy'
order: 80
routes: ['/results/imaging', '/results/procedure']
description: 'Writing, submitting and finalising imaging and procedure reports: the Imaging Results and Procedure Results lists, the report screens, and where results show on a patient.'
---

Shown when your organisation has Results & Reporting switched on.

Imaging and procedure reports live under **Results & Reporting** in the sidebar, which has two entries:
**Imaging Results** and **Procedure Results**. Laboratory results sit beside them under **Lab**, and are
covered in [Laboratory](lab.md).

Every report belongs to a clinical order. An imaging report is written against an imaging order, a
procedure report against a procedure order. You cannot start a report from nothing: you pick the order
first, and the report takes the patient and encounter from it.

## Report statuses

Imaging and procedure reports share one set of statuses. The same coloured badge appears in the lists,
on the report screen and on the patient's results timeline.

| Status | Colour | Meaning |
| --- | --- | --- |
| **Draft** | Grey | Started, still being written. Only you have seen it. |
| **Preliminary** | Amber | Submitted as a first read. Still editable. |
| **Final** | Green | Signed off. Read-only. |
| **Amended** | Blue | A final report that has since been amended. Read-only. |
| **Corrected** | Orange | A final report that has since been corrected. Read-only. |
| **Cancelled** | Red | Withdrawn. |

The report screen also shows a small progress line, **Draft**, **Preliminary**, **Final**: steps already
passed are filled green, the current step has a green ring and bold label, and steps still to come are
grey. A cancelled report shows **Cancelled** in red instead. An amended or corrected report counts as
having reached **Final**.

A report on its second or later version shows **v2**, **v3** and so on beside its badge, with
**(amended)** or **(corrected)** where that applies.

## Imaging Results

**Imaging Results** (`/results/imaging`) lists every imaging report in your organisation, 20 to a page. The line above the table says how many there are, for example "Found 12 imaging results".

Each row shows:

- **Order Name**: the imaging order the report is for.
- **Patient**.
- **Modality** and **Body Part**, or a dash when they are not recorded.
- **Critical**: a red **Critical** badge when the report is flagged as a critical finding, otherwise a
  dash.
- **Status**: the report's status badge (see [Report statuses](#report-statuses)).
- **Reported**: when the report was last submitted as Preliminary or Final, or a dash for a report
  still in Draft.

Press a row, or its **View** button, to open the report.

### Filtering the list

Use the status filter beside the search box. Choose **All Statuses** (the default), **Draft**,
**Preliminary**, **Final**, **Amended** or **Cancelled**. The list goes back to page 1 each time you
change it. **Previous** and **Next** under the table move between pages when there is more than one;
the line beside them says "Page 2 of 5" and so on.

The search box (**Search imaging results...**) is greyed out: it does not search yet.

**If instead:**

- "No imaging results found": nothing matches the filter, or no imaging report has been started yet.
  Reports appear here once they are created from clinical orders.
- "Error loading imaging results": the list could not be fetched. The server's message is shown under
  it, or "Please try again or contact support."

### Starting an imaging report

1. Press **New Imaging Report** at the top right.
2. The **Create New Imaging Report** window lists imaging orders that do not have a report yet, newest
   order first (up to 30). Each shows its **Order Name**, **Patient**, order **Status** and the date it
   was **Ordered**. Type in **Search orders by name...** to narrow the list by order name.
3. Press **Create** on the order you are reporting.

**Check:** the window closes and the new report opens in **Draft**, ready to write.

**If instead:**

- "No reportable orders found" with "Try a different search term.": nothing matches your search.
- "No reportable orders found" with "All imaging orders already have reports, or no orders of this type
  exist.": there is nothing left to report. Cancelled orders are never listed, and nor is any order
  that has ever had a report, including one whose report was cancelled.
- If the report cannot be created, the window stays open with no message. Close it and try again.

The order status badge in the window is green for **completed**, blue for **in progress** and grey for
anything else. You can report on an order in any status except cancelled.

## Writing an imaging report

**Imaging Report** (`/results/imaging/{orderId}`) opens from a row in the list, from **New Imaging
Report**, or from **Continue editing** on a patient's results.

The band at the top shows:

- a back arrow to **Imaging Results**, **Imaging Report** and the report's status;
- the encounter number on the right, as **Encounter #...**;
- the patient's **Patient** name, **Age**, **Gender** and **MRN**;
- **Triage Vitals** from the encounter's triage, when recorded, for example "Temp 37.2°C · HR 82 bpm · BP
  120/80";
- **Allergies** recorded at triage, in red.

If the order has no report yet, the screen says "No imaging report exists for this order yet." Press
**Create Imaging Report** to start one in Draft.

### Writing and saving

While the report is **Draft** or **Preliminary** you can write it under **Report Content**. The editor
starts empty with a prompt to organise the report under headings such as Technique, Findings and
Impression.

The toolbar above the text gives you **Heading 1**, **Heading 2** and **Heading 3**, **Bold** and
**Italic**, **Bullet List**, **Numbered List**, **Quote**, a **Horizontal Rule**, and **Undo** and
**Redo** on the right. Hover over an icon to see its name.

The buttons under the editor:

- **Save Draft** saves what you have written and leaves the status as it is.
- **Submit as Preliminary** saves and moves a Draft report to **Preliminary**. It only shows while the
  report is a Draft.
- **Finalize Report** saves and moves the report to **Final**. You can finalise straight from Draft.

Submitting as Preliminary or Final records you as the reporter and stamps the time shown in the
**Reported** column.

**Check:** the status badge and the progress line change, and the list shows the new status and
reported time.

**If instead:** nothing on screen confirms a failed save. If the badge does not change after
**Submit as Preliminary** or **Finalize Report**, the save was refused; reload the page before writing
more, since text not saved is lost on reload.

### Reading a finalised imaging report

Once the report is **Final** (or **Amended**) the screen turns read-only and shows:

- a red **CRITICAL FINDING** banner when the report is flagged, with when it was **Notified** and
  **Acknowledged**, when those are recorded;
- **Modality**, **Body Part** and **Accession #**, when recorded;
- the **Report** text as written;
- for older reports written before the editor existed, separate **Technique**, **Comparison**,
  **Findings**, **Impression** and **Recommendations** sections;
- **Comments**, when there are any;
- when it was **Reported** and **Reviewed**.

## Procedure Results

**Procedure Results** (`/results/procedure`) lists every procedure report in your organisation, 20 to a
page, with "Found _n_ procedure results" above the table.

Each row shows:

- **Order Name** and **Patient**.
- **Duration**: how long the procedure took, as "45m" or "1h 30m", or a dash.
- **Complications**: the first 50 characters in amber, or **None**.
- **Status** and **Reported**, as on [Imaging Results](#imaging-results).

Press a row, or **View**, to open the report.

The status filter, paging and the greyed-out search box (**Search procedure results...**) work exactly
as on [Imaging Results](#filtering-the-list). The empty and error messages read "No procedure results
found" and "Error loading procedure results".

### Starting a procedure report

Press **New Procedure Report** and follow the same steps as [Starting an imaging
report](#starting-an-imaging-report). The window, **Create New Procedure Report**, lists procedure
orders that have no report yet. When none are left it says "All procedure orders already have reports,
or no orders of this type exist."

## Writing a procedure report

**Procedure Report** (`/results/procedure/{orderId}`) has the same patient band as the imaging report,
with its back arrow returning to **Procedure Results**. With no report yet it says "No procedure report
exists for this order yet." and offers **Create Procedure Report**.

While the report is **Draft** or **Preliminary**, fill in **Procedure Details** above the editor:

| Field | What to enter |
| --- | --- |
| **Anesthesia Type** | **None**, **Local**, **Regional**, **General** or **Conscious Sedation**. |
| **Estimated Blood Loss** | Free text, for example "50ml". |
| **Start Time** and **End Time** | Date and time the procedure started and ended. |
| **Duration (min)** | Minutes, as a whole number. It is not worked out from the times: type it in. |

None of these is required. Then write the narrative under **Report Content**, with sections such as
Indication, Procedure Description, Findings, Complications and Post-Procedure Instructions. The toolbar
and the **Save Draft**, **Submit as Preliminary** and **Finalize Report** buttons work as for an
[imaging report](#writing-and-saving), and the details are saved with the text each time.

### Reading a finalised procedure report

A **Final** or **Amended** procedure report is read-only and shows:

- **Procedure Details**: **Anesthesia**, **Est. Blood Loss**, **Start**, **End** and **Duration**, for
  whichever were filled in;
- the **Report** text;
- for older reports, separate **Indication**, **Procedure Description**, **Findings**,
  **Complications** and **Post-Procedure Instructions** sections;
- **Specimens**, each with where it was **Sent to** and its label, when recorded;
- **Comments**, and when it was **Reported**.

## On the patient

A patient's own results page (`/patients/{patientId}/results`), opened with **Results** on the patient's
care context, brings their lab, imaging and procedure reports together. Choose **All**, **Lab**,
**Imaging** or **Procedure** to narrow it.

The timeline on the left groups reports by date. Each entry shows the order name, status badge, version
and a one-line summary: for imaging, **Critical finding** or the start of the impression; for a
procedure, its complications. An imaging entry with a critical finding is tinted red.

Pick an entry to read it on the right. A Final or Amended report shows in full, as above. A Draft or
Preliminary report says "This report is still in progress and hasn't been finalized yet." with a
**Continue editing** button that opens it on the imaging or procedure report screen.

See [Patient access](patient-access.md) for finding a patient.

## Not live yet

- **Search** on both lists is disabled.
- **Amending, correcting, verifying or cancelling** a report cannot be done from these screens. Once a
  report is **Final** it stays read-only here; the **Amended**, **Corrected** and **Cancelled**
  statuses only appear on reports changed by other means.
- **Critical findings** cannot be flagged, notified or acknowledged from the imaging report screen. The
  **Critical** badge and banner only show for reports flagged elsewhere.
- **Modality**, **Body Part** and **Accession #** are not filled in when you start a report from these
  screens, so the list shows dashes for them on new reports.
- **Complications** and **Specimens** on a procedure report have no field on the form. New reports show
  **None** in the Complications column; write complications in the report text instead.
- **Comments** are shown when present but cannot be added here.
