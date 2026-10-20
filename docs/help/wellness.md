---
title: 'Wellness'
group: 'Engagement and wellness'
order: 130
routes: ['/wellness']
description: 'The Wellness section: the dashboard, assessments and their templates, biomarker results, program enrolment, longevity treatments, lifestyle plans and device sync.'
---

Shown when your organisation has Wellness switched on.

The **Wellness** section of the sidebar holds eight screens: **Wellness Dashboard**, **Assessments**,
**Assessment Templates**, **Biomarkers**, **Programs**, **Longevity**, **Lifestyle** and **Device Sync**.
Today the working parts are the assessment list, the template builder, and the "record" dialogs on the
Biomarkers, Programs, Longevity and Lifestyle screens. Most of those screens do not yet list what you have
recorded; see [Not live yet](#not-live-yet) before you rely on one.

Every dialog that needs a patient uses the same patient picker. Type a name, MRN or mobile number into
**Search by name, MRN, or mobile**. Matches appear as you type; if none do, it says "No patients found.".
Pick one and a card shows the patient's name, sex, age, MRN and phone. Press **Change** to pick someone else.

## Wellness Dashboard

**Wellness Dashboard** (`/wellness`) is a launch page headed "Comprehensive wellness and longevity
management". It shows one card per area; press a card to open it:

| Card | Opens | What it says |
| --- | --- | --- |
| **Assessments** | `/wellness/assessments` | Create and manage wellness assessments with scoring |
| **Biomarkers** | `/wellness/biomarkers` | Track biomarkers, trends, and alerts |
| **Programs** | `/wellness/programs` | Enroll patients in multi-session wellness programs |
| **Longevity** | `/wellness/longevity` | Longevity protocols and biological age tracking |
| **Lifestyle** | `/wellness/lifestyle` | Nutrition plans and exercise prescriptions |
| **Device Sync** | `/wellness/devices` | Connect wearables and sync health data |

There is no card for **Assessment Templates**; reach it from the sidebar. The dashboard shows no counts or
figures.

## Assessments

**Assessments** (`/wellness/assessments`) lists every wellness assessment started for your organisation, in
a table headed **Wellness Assessments**.

- **Patient**: the first eight characters of the patient's record id, not their name.
- **Template**: the template's name.
- **Status**: a coloured badge (below).
- **Score**: the overall score to one decimal place, or **—** if none has been calculated.
- **Date**: the day the assessment was created.

| Status | Colour | Meaning |
| --- | --- | --- |
| **Draft** | Grey | Started, nothing recorded yet. |
| **In Progress** | Blue | Being filled in. |
| **Completed** | Green | Finished and scored. |
| **Cancelled** | Red | Abandoned. |

With nothing recorded the table reads "No assessments yet. Click "New Assessment" to create one."

### Start an assessment

**Go to:** **Assessments** (`/wellness/assessments`), then **New Assessment**.

1. In **Create New Assessment**, find and pick the patient.
2. Choose an **Assessment Template \***. Only active templates are offered, shown as name and code, for
   example "Annual Wellness Check (WELLNESS_ANNUAL)".
3. Press **Create Assessment**.

**Check:** the dialog closes and the new row appears in the table.

**If instead:**

- **Create Assessment** stays greyed out until both a patient and a template are chosen.
- "No assessment templates available." appears instead of the template list when your organisation has no
  active template. Use the **Create a template** link, or see [Assessment Templates](#assessment-templates).
- "Failed to create assessment. Please try again." appears in red if the server refuses. The dialog stays
  open so you can try again or **Cancel**.

Creating an assessment only starts it. There is no screen yet to answer its questions; see
[Not live yet](#not-live-yet).

## Assessment Templates

**Assessment Templates** (`/wellness/templates`) shows each template as a card with:

- its name and a badge: **Active** (solid) or **Draft** (grey) when the template is not active;
- the description, or "No description provided.";
- **Code:** and the category;
- how many sections it has, for example "3 Sections";
- an **Edit Template** button.

Only **Active** templates can be chosen when starting an assessment. With no templates the page shows
"No templates found" and a **Create Template** button.

### Build a template

**Go to:** **Assessment Templates**, then **New Template**. This opens **Create New Template**
(`/wellness/templates/new`).

1. Under **Template Details**, fill in:
   - **Template Name \***, for example "Annual Wellness Check".
   - **Unique Code \***, for example "WELLNESS_ANNUAL". Letters, numbers, hyphens and underscores only.
   - **Category \***: **General** (the default), **Cardiology**, **Mental Health**, **Nutrition** or
     **Physical Therapy**.
   - **Description**, optional.
2. Each section is a card headed **Section 1**, **Section 2** and so on. The first is named "General
   Information" and holds one empty question. Click the name to rename it. The bin icon on the card removes
   the whole section.
3. For each question:
   - type the wording into **Question text...**;
   - choose its type: **Text Answer**, **Numeric**, **Yes/No**, **Single Select**, **Multi Select** or
     **Scale (1-N)**;
   - for **Single Select** and **Multi Select**, list the choices separated by commas, e.g. "Yes, No, Maybe";
   - for **Scale (1-N)**, give the **Min** and **Max**;
   - leave **Req** on if an answer is mandatory (new questions start on);
   - the bin icon beside the question removes it.
4. **Add Question** adds another question to that section; **Add Section** adds a new section at the
   bottom, named "New Section 2" and so on, with no questions.
5. Press **Save Template**.

**Check:** a "Template Created" message says "The assessment template has been successfully created.", and
you return to **Assessment Templates**.

**If instead:** the form will not save while a field is wrong, and shows the reason under it:

- "Template name is required"
- "Template code is required"
- "Code must be alphanumeric" (the code has a space or a character other than a letter, number, `-` or `_`)
- "Category is required"
- "Section name is required"
- "Question text is required"

If the server refuses, an "Error" message says "Failed to create template. Please check your input." A
common cause is a code another template already uses.

**Cancel** or **Back to Templates** leaves without saving.

## Biomarkers

**Biomarkers** (`/wellness/biomarkers`) records a single biomarker test result for a patient. The
**Biomarker Tracking** panel below is a placeholder; results you save are not listed here.

### Record a biomarker result

**Go to:** **Biomarkers**, then **Add Biomarker Result**.

1. Pick the **Patient**.
2. Choose the **Biomarker**. The list shows each active biomarker with its unit in brackets. Choosing
   one fills in **Unit**, which you cannot edit.
3. Enter the **Value**. Decimals are allowed.
4. **Date Recorded** starts at today. Press it to pick another day; future dates cannot be chosen.
5. Add **Notes (Optional)** if useful.
6. Press **Save Result**.

**Check:** "Biomarker result recorded" with "The result has been successfully added.", and the dialog
closes. The result is saved as a manual entry.

**If instead:**

- "Patient is required", "Biomarker is required", "Value must be a number" or "Date is required" appear
  under the field that needs it.
- "Failed to record result" with "An error occurred while saving the result." means the server refused. The
  dialog stays open.

## Programs

**Programs** (`/wellness/programs`) enrols a patient in a multi-session wellness program. The **Wellness
Programs** panel below is a placeholder; enrolments are not listed here.

### Enrol a patient

**Go to:** **Programs**, then **New Program Enrollment**.

1. Pick the **Patient**.
2. Choose the **Program**. Each active program shows its length in weeks in brackets. If there
   are none, the list says "No active programs found".
3. **Start Date** starts at today; press it to change.
4. Add **Notes (Optional)**.
5. Press **Enroll Patient**.

**Check:** "Patient enrolled successfully" with "The patient has been enrolled in the wellness program." The
server creates the program's schedule of sessions and milestones.

**If instead:** "Patient is required", "Program is required" or "Start date is required" under the field;
or "Enrollment failed" with "An error occurred while enrolling the patient." if the server refuses.

There is no screen to create a program itself; programs must already exist for your organisation.

## Longevity

**Longevity** (`/wellness/longevity`) schedules a longevity treatment for a patient against one of your
organisation's protocols. The **Longevity Treatments** panel below is a placeholder.

### Schedule a treatment

**Go to:** **Longevity**, then **New Treatment Protocol**.

1. Pick the **Patient**.
2. Choose the **Protocol**. Each active protocol shows its administration route in brackets, in capitals. If
   there are none, the list says "No active protocols found".
3. **Scheduled At** starts at now. Press it to pick another day. You can pick a day, not a time: the time
   shown is the time you opened the dialog.
4. Add **Pre-treatment Notes (Optional)**.
5. Press **Schedule Treatment**.

**Check:** "Treatment scheduled successfully" with "The longevity treatment protocol has been scheduled."

**If instead:** "Patient is required", "Protocol is required" or "Scheduled date is required" under the
field; or "Scheduling failed" with "An error occurred while scheduling the treatment." if the server
refuses.

## Lifestyle

**Lifestyle** (`/wellness/lifestyle`) creates nutrition plans and exercise prescriptions. Its two panels,
**Nutrition Plans** and **Exercise Prescriptions**, are placeholders.

Press **New Plan** to open **New Lifestyle Plan**. It has two tabs, **Nutrition Plan** and **Exercise
Prescription**, each saved separately. **Pick the patient on the Nutrition Plan tab, even for an exercise
prescription**: the Exercise tab has no patient picker and shows "No patient selected. Please select in
Nutrition tab." until you do.

### Create a nutrition plan

1. On **Nutrition Plan**, pick the **Patient**.
2. Enter a **Plan Name**, e.g. "Keto Diet".
3. Choose the **Plan Type**: **Weight Loss**, **Maintenance** (the default), **Muscle Gain** or
   **Therapeutic**.
4. Optionally enter **Target Calories**.
5. **Start Date** starts at today.
6. Add **Notes** if useful, then press **Create Nutrition Plan**.

**Check:** "Nutrition plan created successfully", and the dialog closes.

**If instead:** "Patient is required" or "Plan name is required" appear under the field; "Failed to create
nutrition plan" means the server refused.

### Create an exercise prescription

1. Pick the patient on the **Nutrition Plan** tab first, then switch to **Exercise Prescription**. Check the
   name after **Selected:**.
2. Enter a **Prescription Name**, e.g. "Cardio Routine".
3. Choose the **Goal**: **Weight Loss**, **Cardiovascular** (the default), **Strength** or **Flexibility**.
4. Set **Sessions per Week** (default 3) and **Minutes per Session** (default 30); each must be at least 1.
5. **Start Date** starts at today. Add **Notes** if useful.
6. Press **Create Prescription**.

**Check:** "Exercise prescription created successfully", and the dialog closes.

**If instead:**

- "Prescription name is required" appears under the field.
- If no patient was picked, **Create Prescription** does nothing and shows no message. Go back to the
  Nutrition Plan tab and pick one.
- "Failed to create exercise prescription" means the server refused.

The prescription is saved without a list of individual exercises; there is nowhere to add them yet.

## Device Sync

**Device Sync** (`/wellness/devices`) is meant to connect wearables (Apple Health, Fitbit, Oura Ring, and
Dexcom or Libre glucose monitors) and show their data. It is a placeholder today; see below.

## Not live yet

- **Device Sync** (`/wellness/devices`): the **Connect Device** button does nothing, and **Connected
  Devices** shows only a description of what is planned.
- **Biomarkers**, **Programs**, **Longevity** and **Lifestyle**: the panels under the buttons are
  placeholder text ("... will be displayed here."). What you save through the dialogs is stored, but these
  screens do not list it, show trends or alerts, or let you open, edit or cancel a record.
- **Assessments**: rows look clickable but do not open. There is no screen to answer an assessment's
  questions, submit it, or see its score breakdown, so new assessments stay as you created them.
  **Patient** shows a shortened record id rather than the patient's name.
- **Assessment Templates**: **Edit Template** opens a page that does not exist yet, so templates cannot be
  changed after saving, and there is no way to switch a template between **Active** and **Draft** from
  here. The template builder has no field for a maximum score or question weights.
- **Longevity**: every treatment is booked against one fixed default facility, not the facility you are
  working in, and **Scheduled At** cannot take a time.
- **Lifestyle**: nutrition plans take calories only; protein, carbohydrate and fat targets are not on the
  form.
- **Programs** and **Longevity** need programs and protocols already set up for your organisation; there is
  no screen here to create them.
- The **Create a template** link in **Create New Assessment** always opens the English version of the app.

For membership plans, see [Membership](membership.md). For outreach to patients, see
[Patient engagement](patient-engagement.md). Terms are explained in the [Glossary](glossary.md).
