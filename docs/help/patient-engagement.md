---
title: 'Patient engagement'
group: 'Engagement and wellness'
order: 150
routes: ['/prm', '/pe-setup']
description: 'Patient engagement events, tasks and messages, and the PE Setup screens for rules, templates, preferences, provider callbacks and the webhook tester.'
---

Patient engagement (PRM) reacts to things that happen to a patient, such as a confirmed appointment or a
ready lab result. Each of these is an **event**. **Rules** decide what an event should cause: send a message
from a **template**, or create a **task** for staff. This page covers the day-to-day screens and the setup
behind them.

The **Patient Engagement** section of the sidebar is shown when your organisation has patient engagement
switched on. It lists three screens: **Events**, **Tasks** and **Messages**. Opening `/prm` on its own takes
you straight to **Events**.

The setup screens (**Rules**, **Templates**, **Preferences**, **Provider callbacks** and **Webhook tester**)
are not in that section. You reach them from **PE Setup**, under **Administration** in the sidebar, which is
always shown. Their **Back** buttons return you to **PE Setup**.

## Finding a patient

Several screens below filter or record by patient using the same search box.

1. Type a name, MRN or mobile number in **Search by name, MRN, or mobile**.
2. Pick the patient from the list. Each row shows the name, phone (or **No phone**), sex, age and MRN.
3. The chosen patient appears in a card. Press **Change** to clear it and search again.

While it looks, the box says "Searching patients...". If nothing matches it says "No patients found."

## Events

**PRM Events** (`/prm/events`) lists the events the engagement service has received, across all patients,
25 to a page.

**Filters**:

- the patient search;
- **Event Type**, such as `appointment_confirmed`, `lab_result_ready` or `payment_overdue`;
- **Entity Type**, the kind of record the event is about, such as `appointment`, `invoice` or `lab_result`.

Each filter starts at **All**. Changing any filter returns you to page 1.

Each event row shows four columns:

| Column | What it shows |
| --- | --- |
| **Occurred** | The date and time the event happened. |
| **Patient** | The patient name (or **Unknown**) and **MRN** (or **N/A**). |
| **Event** | The event type and its subtype (a dash when there is none). |
| **Entity** | The entity type and the **Severity** number: 0 info, 1 warning, 2 critical. |

Under the list, "Showing 1-25 of 140" tells you where you are. Use **Previous** and **Next** to page; each is
greyed out at the start or end. If there is nothing to show you see "No events found."

### Recording an event by hand

**New PRM Event** (`/prm/events/new`) sends an event in yourself, as another system would. It is mainly for
testing rules. Press **New Event** on the events list.

1. Find the patient.
2. Choose **Source System** (it starts at `zeal-clinical`; the others are `zeal-rcm`, `zeal-foundation` and
   `external`).
3. Choose **Event Type**. **Event Subtype** then offers the subtypes for that type, for example
   `new_patient`, `existing_patient` or `rescheduled` for `appointment_confirmed`. Changing the type clears
   the subtype. Each has a **Clear** button.
4. Choose **Severity**: **Info**, **Warning** or **Critical**. It starts at **Info**.
5. Check **Occurred At**. It starts at now.
6. Choose **Entity Type** and type the record's **Entity ID**.
7. Type the event details in **Payload JSON**.
8. Optionally add a **Correlation ID**. Type a **Dedupe Key**: an event with a key already used is skipped.
9. Press **Ingest Event**. It says **Submitting...** while it sends.

**Check:** a toast says **Event ingested**, with how many jobs were created and rules evaluated, for example
"2 jobs created · 3 rules evaluated". A **Latest Ingestion** card shows the **Event ID**, **Duplicate**
(Yes or No), **Rules Evaluated** and **Jobs Created**. The form stays filled, so you can change a field and
send another. If the dedupe key was already used, the toast says **Duplicate event skipped** instead.

**If instead:** the form refuses and marks the field:

- "Enter a valid patient UUID": no patient chosen.
- "Event type is required", "Entity type is required", "Occurred at is required", "Dedupe key is required".
- "Enter a valid entity UUID": the **Entity ID** is not a UUID.
- "Payload must be valid JSON": the payload does not parse.
- If the server refuses, a toast says **Ingestion failed** with its reason, or "Failed to ingest event.".

## Tasks

**Tasks** (`/prm/tasks`) lists engagement tasks for staff, such as follow-up calls or document requests.
Rules with the **Create Task** action add them here; you can also create them by hand.

Filter by:

- the patient search;
- **Assigned User ID**: type a user's ID;
- **Status**: **All**, **Pending**, **In Progress**, **Completed**, **Cancelled** or **Skipped**.

**Task Results** shows each task's type, title (or **Untitled task**), the patient's ID, and its status in
plain text. Press **View** to open it. If nothing matches you see "No tasks found."

### Creating a task

**Create Task** (`/prm/tasks/new`). Press **Create Task** on the tasks list.

1. Find the patient.
2. Choose **Task Type**: `follow_up`, `document_request`, `consent_needed` or `payment_reminder`.
3. Type a **Title** and, optionally, a **Description**.
4. Optionally choose **Priority**: **Low**, **Medium**, **High** or **Urgent**.
5. Optionally fill **Assigned User ID**, **Assigned Role**, **Due At**, **Related Entity Type** and
   **Related Entity ID**.
6. Press **Create Task**.

**Check:** a toast says **Task created** ("Task is ready in PRM.") and you return to the tasks list.

**If instead:**

- "Patient ID must be a UUID": no patient chosen.
- "Task type is required" or "Title is required".
- If the server refuses, a toast says **Creation failed** with its reason, or "Failed to create task.".

### Working a task

**Task Details** (`/prm/tasks/{taskId}`) lets you move a task on. Change **Status**, **Assigned User ID**,
**Outcome** or **Completed At**, then press **Update Task**. A toast says **Task updated** ("Changes saved
successfully."). If the server refuses, it says **Update failed** with the reason.

To remove a task press **Delete**. The browser asks "Delete this task? This action cannot be undone." On
confirming, a toast says **Task deleted** and you return to the list.

The **Raw Payload** card underneath shows everything the server holds for the task, as JSON. There is no
**Back** button on this screen; use the sidebar or your browser.

## Messages

**Messages** (`/prm/messages`) lists the messages engagement has sent or tried to send to patients.

Filter by:

- the patient search;
- **Channel**: **All**, **Sms**, **Whatsapp**, **Email**, **In App** or **Push**;
- **Status**: type a status exactly as the server stores it.

**Message Results** shows each message's channel, subject (or **Message**) and **Status**. Press **View** to
open it. If nothing matches you see "No messages found."

**Message Details** (`/prm/messages/{messageId}`) shows the whole message record as JSON. It is read-only. If
the message cannot be found it says "Message not found."

## PE Setup

**PE Setup** (`/pe-setup`) is the front door to engagement configuration. It has five tiles; press one to open
that screen:

| Tile | Opens | Use it to |
| --- | --- | --- |
| **Rules** | `/prm/rules` | Configure event-driven rules. |
| **Templates** | `/prm/templates` | Manage message templates for each channel. |
| **Preferences** | `/prm/preferences` | Update a patient's communication preferences and consent. |
| **Provider callbacks** | `/prm/providers/callbacks` | Review delivery updates sent back by messaging providers. |
| **Webhook tester** | `/prm/providers/webhooks` | Send a test provider webhook. |

## Rules

**Rules** (`/prm/rules`) lists engagement rules. Filter by **Category** (type it) and **Active** (**All**,
**Active**, **Inactive**). **Rule Results** shows each rule's category (or **Uncategorized**), name, the
**Trigger** event type, and **Active** or **Inactive**. Press **View** to open a rule. If nothing matches you
see "No rules found."

### Creating a rule

**Create Rule** (`/prm/rules/new`). Press **Create Rule** on the rules list.

1. Type a **Code** and **Name**.
2. Choose **Category**: `appointment_reminders`, `billing_followup`, `care_coordination`, `wellness`,
   `chronic_care`, `post_op` or `marketing`.
3. Choose **Trigger Event Type** and, optionally, **Trigger Event Subtype**. The rule runs when a matching
   event arrives.
4. Choose **Schedule Mode**: **Immediate**, or **Delayed** with a **Delay (seconds)**.
5. Choose **Action Type**:
   - **Send Message**: a **Template** list appears, showing active templates. Picking one fills **Action
     Payload (JSON)** with its channel and code, and shows the template's **Channel** underneath.
   - **Create Task**: type the task details into **Action Payload (JSON)** yourself.
6. Optionally set **Priority**, **Cooldown (seconds)**, **Idempotency Window (seconds)**, **Max Executions Per
   Day**, **Effective From** and **Effective To**.
   - **Cooldown** is the least time before the rule can run again for the same patient. A repeat event
     inside it is skipped, so the patient is not spammed.
   - **Idempotency Window** stops near-identical events (retries, duplicates) triggering the rule twice
     within that many seconds.
7. Set **Active** (it starts at **Active**) and, optionally, a **Description**.
8. Type the rule's conditions in **Condition Expression (JSON)**.
9. Press **Create Rule**.

**Check:** a toast says **Rule created** and you return to the rules list.

**If instead:**

- "Code is required", "Name is required", "Category is required", "Trigger event type is required".
- "Condition JSON is required" or "Condition must be valid JSON".
- "Action payload JSON is required" or "Action payload must be valid JSON".
- If the server refuses, a toast says **Creation failed** with its reason, or "Failed to create rule.".

### Changing or deleting a rule

**Rule Details** (`/prm/rules/{ruleId}`) shows the same form filled in. Change it and press **Update Rule**; a
toast says **Rule updated**. To switch a rule off without deleting it, set **Active** to **Inactive**.

**Delete** asks "Delete this rule? This action cannot be undone." and, on confirming, says **Rule deleted**
and returns you to the list. A **Raw Payload** card shows the stored rule as JSON.

## Templates

**Templates** (`/prm/templates`) lists message templates. Filter by **Channel** (**SMS**, **WhatsApp**,
**Email**, **In App**, **Push**), **Language**, **Category** and **Active**. **Template Results** shows each
template's channel, name, **Category** and **Active** or **Inactive**. Press **View** to open one. If nothing
matches you see "No templates found."

### Creating a template

**Create Template** (`/prm/templates/new`). Press **Create Template** on the templates list.

1. Type a **Code** and **Name**. Rules refer to the template by its code.
2. Choose **Category**: `transactional`, `promotional`, `care` or `billing`.
3. Choose **Channel** (it starts at **Sms**).
4. Check **Language** (it starts at `en`) and, for email, type a **Subject**.
5. Set **Approval Status**: **Draft** (the default), **Pending**, **Approved** or **Rejected**.
6. Optionally type a **Version** number, set **Active** and add a **Description**.
7. Type the message text in **Body**.
8. Describe the template's placeholders in **Variables Schema (JSON)**.
9. Press **Create Template**.

**Check:** a toast says **Template created** ("Template is ready to use.") and you return to the list.

**If instead:**

- "Code is required", "Name is required", "Category is required", "Body is required".
- "Variables schema JSON is required" or "Variables schema must be valid JSON".
- If the server refuses, a toast says **Creation failed** with its reason, or "Failed to create template.".

### Changing or deleting a template

**Template Details** (`/prm/templates/{templateId}`) shows the form filled in. Press **Update Template** to
save (**Template updated**). **Delete** asks "Delete this template? This action cannot be undone." and then
says **Template deleted**. A **Raw Payload** card shows the stored template as JSON.

## Preferences

**Patient Preferences** (`/prm/preferences`) holds one patient's communication preferences and consent, edited
as JSON.

1. Find the patient.
2. Press **Load Preferences**. The **Preferences JSON** box fills with what is stored.
3. Edit the JSON.
4. Press **Save Preferences**.

**Check:** a toast says **Preferences updated** ("Patient preferences saved.").

**If instead:**

- No patient chosen: **Patient ID required**.
- The JSON does not parse: **Invalid JSON** ("Preferences must be valid JSON.").
- The server refuses: **Update failed** with its reason, or "Failed to update preferences.".

## Provider callbacks

**Provider Callbacks** (`/prm/providers/callbacks`) lists the delivery updates messaging providers have sent
back, such as delivered or failed receipts. Filter by **Channel** and **Processed** (**All**, **Processed**,
**Unprocessed**). Each callback is shown as raw JSON. If nothing matches you see "No callbacks found."

## Webhook tester

**Provider Webhook Tester** (`/prm/providers/webhooks`) posts a pretend provider webhook, to check how
engagement handles it.

1. Choose **Channel** (it starts at **Sms**).
2. Type the provider's payload in **Payload JSON**.
3. Press **Send Webhook**.

**Check:** a toast says **Webhook sent** ("Provider webhook was posted successfully.").

**If instead:** **Invalid JSON** ("Webhook payload must be valid JSON."), or **Webhook failed** with the
server's reason.

## Not live yet

- Most engagement screens are technical. Messages, message details, provider callbacks and the **Raw
  Payload** cards show raw JSON, and preferences, rule conditions, action payloads and template variables
  are edited as raw JSON with no guided form.
- Task and rule lists show statuses as plain text, not coloured badges. Tasks show the patient's ID rather
  than their name.
- **Assigned User ID** (on tasks) and **Status** (on messages) are free-text boxes; there is no user or status
  picker.
- **Task Details** has no **Back** button. **Rule Details** and **Template Details** go **Back** to **PE
  Setup**, not to their list.
- The **Patient ID required** toast on **Preferences** tells you to "Enter a patient UUID", but the screen
  uses the patient search; choose a patient there.
- After creating a rule the toast says "The rule is now active in PRM." even if you saved it as
  **Inactive**.

See also [Wellness](wellness.md), [Membership](membership.md) and [Administration](administration.md).
