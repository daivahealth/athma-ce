---
title: 'Laboratory'
group: 'Diagnostics and pharmacy'
order: 70
routes: ['/results/lab']
description: 'Taking specimens on Lab Collection, moving them through receiving, accessioning, processing and result entry on Lab Operations, and writing, finalising and printing reports from Lab Results.'
---

Shown when your organisation has Results & Reporting switched on.

The **Lab** section of the sidebar has three screens, used in this order as a specimen travels:

1. **Lab Collection**: the ward or phlebotomy desk prepares a barcode label, takes the specimen and marks
   it collected.
2. **Lab Operations**: the lab receives the specimen, registers it (accessions it), starts processing, and
   opens it for result entry.
3. **Lab Results**: the report itself. Results are entered, submitted as preliminary, finalised and
   printed here, and clinicians read them here.

Lab tests are ordered from the patient's chart; see [Charting and triage](clinical-charting.md). Imaging
and procedure reports have their own screens; see [Imaging and procedure results](results-reporting.md).

Two kinds of lab test are reported differently, and the screens switch between them for you:

- **Structured** tests (a blood count, chemistry, tumour markers) are reported as rows of analytes, each
  with a value, unit and reference range.
- **Narrative** tests (histopathology and similar) are reported as written sections: history, gross and
  microscopic description, diagnosis.

Which kind a test is comes from the lab test catalogue, not from anything you choose on these screens.

## Lab Collection

**Lab Collection** (`/results/lab/collection`) is the collection queue for nurses and phlebotomists:
every lab test that still needs a specimen, before it is handed to the lab.

**Go to:** **Lab** > **Lab Collection** in the sidebar.

### What the queue shows

Tests are grouped so that one row is one specimen to take: tests for the same patient that need the same
kind of specimen are collected together, even if they came from different orders. Each row shows:

- **Patient**: name, age, gender and MRN.
- **Specimen Group**: how many tests across how many orders the specimen covers ("3 tests across 2
  orders"), with a chip for each order.
- **Collection Profile**: the specimen type, the collection method, and a fasting badge.
- **Status**: where the row is in collection, and the barcode once a label has been prepared.
- **Tests**: a chip for each test the specimen is for.
- **Ordered**: when the order was placed.

| Badge | Colour | Meaning |
| --- | --- | --- |
| **Ready to Prepare** | Amber | No label yet. Prepare one before you collect. |
| **Label Prepared** | Green | A barcode exists. Print it if needed, take the specimen, mark it collected. |
| **Fasting** (with hours, such as **Fasting 12h**) | Orange | The patient must have fasted. Check before you draw. |
| **No fasting** | Grey | No fasting requirement. |

To see one patient's specimens only, use **Patient Filter** and search by name, MRN or mobile. Clear the
search to see the whole queue again.

When nothing is waiting, the queue says "No pending lab tests require specimen collection."

### Prepare a label and collect

1. Find the row. Its status is **Ready to Prepare**.
2. Press **Prepare Label**. A specimen and barcode are created for the tests in that row and the label is
   sent to print straight away.
3. Stick the label on the container and take the specimen.
4. Press **Mark Collected**. The row leaves the collection queue and appears on the **Receiving** tab of
   [Lab Operations](#lab-operations).

If the label did not come out, press **Print Label** on the row (shown once the status is **Label
Prepared**) to send it again.

**Check:** a toast says **Label ready** and "Barcode label sent to printer." The barcode appears under the
**Label Prepared** badge.

**If instead:**

- The toast says **Label ready** and "No printer bridge detected. Downloaded the PRN file instead." Your
  computer is not connected to the label printer, so the browser has downloaded the label as a `.prn`
  file. Send that file to the label printer, or ask IT to set up the printer bridge on this machine.
- The toast says **Label print failed**. The printer refused the label; the toast gives its reason, or
  "Unable to print barcode label." Fix the printer and press **Print Label**.

## Lab Operations

**Lab Operations** (`/results/lab/operations`) holds the lab's internal worklists. It has four tabs, one
per stage, each with a count of what is waiting in it:

| Tab | What it is for | What moves a row on |
| --- | --- | --- |
| **Receiving** | Collected specimens that have not yet physically arrived in the lab. | **Receive** |
| **Accessioning** | Received specimens to register into the lab workflow. | **Accession** |
| **Processing** | Accessioned work, one row per test, to start on the analyser or by hand. | **Start Processing** |
| **Result Entry** | Tests ready for results to be entered. | **Open Result Entry** |

**Go to:** **Lab** > **Lab Operations** in the sidebar.

### Receiving and Accessioning

Both tabs list specimens with the same columns:

- **Specimen**: the barcode and the specimen type.
- **Order**: the order name and code.
- **Tests**: a chip for each test on the specimen.
- **Collected**: when it was marked collected.

1. On **Receiving**, when the specimen is in your hands, press **Receive**. It moves to **Accessioning**.
2. On **Accessioning**, press **Accession**. The specimen is given an accession number and its tests move
   to **Processing**.

When a tab is empty it says "No specimens are waiting in this stage."

### Reject a specimen

A specimen can be rejected from **Receiving** or **Accessioning** (for example, haemolysed, unlabelled or
the wrong container).

1. Press **Reject** on its row. The **Reject Specimen** dialog opens, naming the specimen's barcode.
2. Type the **Rejection reason**. It is required.
3. Press **Reject**.

The specimen is removed from the worklists. A new specimen has to be collected for the tests.

**If instead:**

- "Rejection reason is required": you pressed **Reject** with the reason empty.
- **Failed to reject specimen**: the server refused; the toast gives the reason, or "Try again."

### Processing

One row per test on each accessioned specimen:

- **Specimen**: barcode and type.
- **Test**: name and code.
- **Accession**: the accession number, or **Pending**.
- **Status**: the test's current state, such as **accessioned** or **processing**.

Press **Start Processing** when the test goes on the analyser or bench. The button then reads **Processing
Started** and is greyed out. It is only available while the status is **accessioned**.

From the moment processing starts, the order also appears on [Lab Results](#lab-results).

When the tab is empty it says "No accessioned work is waiting for processing."

### Result Entry

Lists tests ready for results with their **Order**, **Test**, **Specimen** and **Accession**. Press
**Open Result Entry** to go to the order's report on [Lab results for an order](#lab-results-for-an-order),
where you enter the results.

When the tab is empty it says "No processed tests are waiting for result entry."

## Lab Results

**Lab Results** (`/results/lab`) lists lab reports across all patients, newest work included as soon as
processing starts.

**Go to:** **Lab** > **Lab Results** in the sidebar.

The count above the table says how many results match ("Found 42 lab results"). Each row shows:

- **Order Name** and **Patient**.
- **Specimen**: the specimen type, with the specimen number underneath.
- **Items**: how many analyte rows the report has, or **Narrative** for a narrative test.
- **Abnormal**: how many results are abnormal, in amber, with the number of critical ones in red after it
  ("(2 critical)"). A grey **0** means nothing is flagged.
- **Status**: the report status (below).
- **Reported**: when the report was issued, or **-** if it has not been.

Click a row, or press **View**, to open the report.

### Find a result

- Type in **Search lab results...** to search the list. It updates as you type.
- Use the status filter (**All Statuses**, **Draft**, **Preliminary**, **Final**, **Amended**,
  **Cancelled**) to narrow it.
- Twenty rows show at a time. Use **Previous** and **Next** under the table to page through.

When nothing matches the list says "No lab results found".

### Report statuses

| Status | Colour | Meaning |
| --- | --- | --- |
| **Draft** | Grey | Results are being entered. Not yet released. |
| **Preliminary** | Amber | Released early, still open for changes before sign-off. |
| **Final** | Green | Signed off. Read-only. |
| **Amended** | Blue | A final report that was later changed. Read-only. |
| **Corrected** | Orange | A final report that was corrected. Read-only. |
| **Cancelled** | Red | The report was cancelled. |

### Start a report for an order

Usually a report already exists by the time an order reaches you. If it does not, press **New Lab Report**
at the top of **Lab Results**.

1. The **Create New Lab Report** dialog lists lab orders that have no report yet. Search by order name if
   the list is long.
2. Press **Create** on the order.
3. The report opens, ready for results.

If the dialog says **No reportable orders found**, every lab order already has a report, or there are no
lab orders that match your search.

## Lab results for an order

The report page (`/results/lab/{orderId}`) is where results are entered and read. It is the same page
whether you came from **Lab Results** or from the **Result Entry** tab of Lab Operations.

If no report exists yet, the page says "No lab report exists for this order yet." Press **Create Lab
Report** to start one.

### The header

The top card shows **Lab Report**, the report status, the encounter number, and the patient's name, age,
gender and MRN. If the patient was triaged in this encounter it also shows their **Triage Vitals** and
their **Allergies** in red. The back arrow returns you to **Lab Results**.

### Order & Specimen Summary

This card shows where the order is and whether it is on time:

- **Order**: the order name, with badges for its priority (green for routine, red for stat, urgent or
  critical, amber otherwise), order code and order status, and how many lab orders the encounter has.
- **Specimen No.** and **Accession No.**, each with its current status.
- **Turnaround Time**: the target for this test ("4 hour target from order time"), with **Elapsed**, **Due
  By** and **Remaining** (or how long it is **overdue**).
- **Workflow Timeline**: when the order was **Ordered**, **Collected**, **Received**, **Processing** and
  **Reported**. Steps not reached yet say **Pending**. Press **Show timeline** for a larger view with
  separate dates and times; **Hide timeline** folds it back.
- When the order has more than one test, a table lists each **Ordered Test** with its **Code**,
  **Specimen**, **Accession** and **Status**.

| Turnaround badge | Colour | Meaning |
| --- | --- | --- |
| **Within TAT** | Green | Not yet reported and comfortably inside the target. |
| **Approaching TAT** | Amber | Not yet reported and within an hour (or a fifth of the target, if shorter) of the due time. |
| **TAT breached** | Red | Past the due time, whether or not it has since been reported. |
| **TAT met** | Green | Reported before the due time. |
| **TAT not configured** | Grey | The test has no turnaround target in the catalogue ("No lab test TAT configured"). |

### Enter structured results

While the report is **Draft** or **Preliminary**, the **Results** section is editable. A step indicator
on the right shows **Draft**, **Preliminary**, **Final** with the current step highlighted.

**Result Items** lists the analytes for the test, grouped under panel headings where the test has them
(for example, a blood count's differential). For each row you can edit:

- **Test Name** and **Code**.
- **Value** (numbers only), **Unit**, **Ref Low** and **Ref High**.
- **Comment**.

**Interpretation** fills itself in as you type a value against a low and high range:

| Interpretation | Row colour | When |
| --- | --- | --- |
| **normal** | Green label | Inside the range. |
| **low** / **high** | Amber | Below the low limit or above the high limit. |
| **critical_low** | Red, bold | At or below half the low limit. |
| **critical_high** | Red, bold | At or above one and a half times the high limit. |

These flags feed the **Abnormal** count on Lab Results.

Press **+ Add Item** to add an analyte row that is not on the template, and **x** at the end of a row to
remove it. Add any free-text remarks under **Comments**.

When you are ready:

1. **Save Draft** keeps your entries without changing the status.
2. **Submit as Preliminary** saves, marks the test as resulted in the lab worklists, and moves the report
   to **Preliminary**. It is only offered on a **Draft**.
3. **Finalize Report** saves, marks the test as resulted, and moves the report to **Final**. The report
   becomes read-only.

**Check:** after finalising, the page shows the read-only **Lab Report** with a **Print Result** button,
the order drops off the **Result Entry** tab, and the **Reported** time appears on Lab Results.

### Enter a narrative (pathology) report

For a narrative test the **Results** section is **Pathology Report Sections** instead:

- **Specimen Type**, **Collection Date** and **Received Date**.
- **Clinical History**, **Specimen Received**, **Gross Description**, **Microscopic Description** and
  **Diagnosis**.
- **Comment**, which is printed on the report.
- **Internal Notes**, which are not intended for the printed report.

The buttons are the same as for structured results: **Save Draft**, **Submit as Preliminary** (from Draft
only) and **Finalize Report**.

### Read and print a final report

A **Final** or **Amended** report opens read-only.

- A structured report shows a table of **Test Name**, **Code**, **Result**, **Unit**, **Reference
  Range**, **Status** and **Comment**. Abnormal rows are tinted amber and critical rows red, with the
  result in bold. Any **Comments** follow, then the **Reported** and **Verified** times.
- A narrative report shows each filled-in section under **Pathology Report**. Empty sections are left
  out, and **Internal Notes** are not shown.
- A version marker such as **v2 (amended)** appears next to the status when the report has been revised.

Press **Print Result** to print. The buttons and step indicator are left off the printout.

## Result entry by test

The page `/results/lab/operations/result-entry/{labOrderTestId}` opens result entry for a single ordered
test rather than the whole order. Nothing in the app links to it any more (the **Result Entry** tab opens
the order's report instead), but an old bookmark still works.

It shows the patient header, an **Ordered Test Context** card (**Order**, **Test**, **Specimen**,
**Accession**), and the same structured results form described in
[Enter structured results](#enter-structured-results). Two extra buttons sit at the bottom:

- **Back to Worklists** returns to [Lab Operations](#lab-operations).
- **Mark Result Entered** marks the test as resulted and returns to Lab Operations.

While it loads it says "Preparing result entry..."; if the test cannot be opened it says "Unable to open
lab result entry for this ordered test."

## Not live yet

- **No amend or correct action.** Final reports can be read and printed, and **Amended** and **Corrected**
  statuses display, but there is no button on these screens to amend a final report.
- **No confirmation on worklist actions.** **Receive**, **Accession**, **Start Processing** and **Mark
  Collected** show no success or error message; the row simply moves on. If a row does not move, refresh
  the page.
- **Structured and narrative rows look the same** on the Lab Operations worklists.
- **No lab-wide turnaround view.** Turnaround status is shown only on each order's report page.
- **Specimen type and dates on structured reports** are not editable on the results form; they come from
  the collection and lab workflow.
