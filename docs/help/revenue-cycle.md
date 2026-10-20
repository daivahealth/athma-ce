---
title: 'Revenue cycle and claims'
group: 'Billing and revenue'
order: 110
routes: ['/revenue-cycle', '/revenue-cycle/claims', '/revenue-cycle/batches', '/revenue-cycle/eligibility', '/revenue-cycle/preauth', '/revenue-cycle/remittance']
description: 'Insurance work: eligibility checks, pre-authorisation requests, claims, claim batches and remittance reconciliation.'
---

Shown when your organisation has Revenue Cycle switched on.

The **Revenue Cycle** section of the sidebar is the insurance side of billing:

- **Claims** (`/revenue-cycle/claims`): bills sent to an insurer.
- **Batches** (`/revenue-cycle/batches`): claims grouped for sending together.
- **Eligibility** (`/revenue-cycle/eligibility`): checking a patient's cover before treatment.
- **PreAuth** (`/revenue-cycle/preauth`): asking an insurer to approve a service in advance.
- **Remittance** (`/revenue-cycle/remittance`): the insurer's payment advice, matched back to claims.

Opening `/revenue-cycle` on its own shows a **Revenue Cycle** page with a tile for each of these.

Refunds, credit notes and debit notes have addresses under `/revenue-cycle` too, but they sit in
the **Billing** section of the sidebar and are described in [Billing](billing.md).

The usual order for an insured patient is: check **Eligibility**, raise a **PreAuth** if the
service needs one, treat, then raise and **Validate** a **Claim**, gather claims into a **Batch** and
submit, and finally record the **Remittance** and **Reconcile** it.

Insurers are set up under [Payers](billing-setup.md#payers). Several screens here ask for a
**Payer ID**: this is the payer's internal ID, which you copy from the payer record, not its name.

## Eligibility

**Eligibility requests** (`/revenue-cycle/eligibility`) lists every eligibility check with its
**Request ID**, **Patient**, **Payer** (the payer's internal ID) and **Status**. Search by request
ID, patient name or MRN.

| Status | Meaning |
| --- | --- |
| **Accepted** | The payer answered. Open it to see the benefits returned. |
| **Rejected** | The payer, or the connector, did not accept the request. |
| **Error** | The check could not be completed. |

### Checking a patient's cover

**Go to:** **Eligibility**, then **New request** (`/revenue-cycle/eligibility/new`), headed **New
eligibility request**.

1. **Patient**: search by name, MRN or mobile and pick.
2. **Payer ID** (required).
3. **Policy ID** and **Encounter ID** if you have them. When a policy is given, its policy number is
   sent to the payer as the member number.
4. **Request type**: **Eligibility** or **Benefits**.
5. **Service types (comma separated)**, for example "30, 47", and the **Service date** (today by
   default).
6. Press **Submit request**.

**Check:** "Eligibility request submitted" and you return to the list, where the new check shows
its status.

The check is sent through the eligibility connector named in the payer's **Configuration**
(`eligibilityConnector`). A payer with no connector set is answered by a built-in test connector,
so its answers are not real cover decisions.

**If instead:** nothing happens when the patient or **Payer ID** is missing. The server refuses an
ID that is not one of your payers ("Payer with ID ... not found"), and the screen does not show
that message.

### Reading the answer

Open a request (`/revenue-cycle/eligibility/{id}`). **Request details** shows the patient, payer,
policy, encounter, request type and service date. **Benefits summary** and **Errors** show what the
payer returned, as raw data, or "No benefits summary available." and "No errors recorded."

## PreAuth

**Pre-auth requests** (`/revenue-cycle/preauth`) lists requests with **PreAuth #**, **Patient**,
**Payer** and **Status**. Search by pre-auth number, patient name or MRN.

| Status | Meaning |
| --- | --- |
| **Draft** | Created, not yet sent. |
| **Pending** | Waiting to be sent. |
| **Submitted** | Sent to the payer. |
| **Approved** / **Partially approved** | The payer agreed, in full or in part. |
| **Denied** | The payer refused. |
| **Cancelled** / **Expired** | No longer usable. |

### Raising a pre-authorisation

**Go to:** **PreAuth**, then **New pre-auth** (`/revenue-cycle/preauth/new`), headed **New pre-auth
request**.

1. **Patient**: search and pick.
2. **Payer ID** (required), then **Policy ID** and **Encounter ID** if known.
3. **Urgency**: **Routine**, **Urgent** or **Emergency**.
4. **Clinical notes**: the justification.
5. **Requested services**: for each service, a **Procedure code** (required), **Description**,
   **Quantity**, **Estimated cost** and **Diagnosis codes (comma separated)**, such as "E11.9, I10".
   **Add service** adds another; **Remove** deletes one.
6. Press **Create request**.

**Check:** "Pre-auth request created". The request is saved as **Draft**. Services without a
procedure code are dropped.

**If instead:** nothing happens when the patient or **Payer ID** is missing or no service has a
procedure code.

### Sending it

Open the request (`/revenue-cycle/preauth/{id}`) and press **Submit**. "Pre-auth submitted".

- For a payer connected to the national claims exchange (NHCX, set by `nhcxParticipantCode` in the
  payer's configuration), the request is sent through the exchange. If the payer answers at once,
  the decision is applied to the request.
- For any other payer, the request is only marked **Submitted** here; nothing is sent.

Only a **Draft** or **Pending** request can be submitted. The page also shows **Request details**
(including the **Authorization #** once one is granted) and **Requested services** as raw data.

## Claims

**Claims** (`/revenue-cycle/claims`) lists claims for the chosen day.

- **Search** by claim number, patient name or MRN.
- **Status**: any of the claim statuses below.
- **Date**: **Today** (the default), **Yesterday** or **Date Range**.

The columns are **Claim #**, **Patient**, **Payer** (name, with a coloured type badge such as
insurance, TPA, government, corporate or self), **Service date**, **Total** and **Status**. Use
**View** to open a claim.

Status badges are coloured by where the claim is in its life: cool colours while being prepared,
blue and purple while with the payer, green when settled, red when refused.

| Status | Colour | Meaning |
| --- | --- | --- |
| **Draft** | Slate | Being prepared. |
| **Pending** | Amber | Generated from charges, waiting for work. |
| **Ready** | Sky | Ready to check. |
| **Scrubbing** | Cyan | Being checked. |
| **Validated** | Teal | Passed checks. |
| **Failed validation** | Orange | Failed checks; fix and try again. |
| **Submitted** | Blue | Sent to the payer. |
| **Acknowledged** | Indigo | The payer has received it. |
| **Rejected** | Red | The payer rejected it on receipt. |
| **Pending adjudication** | Purple | The payer is assessing it. |
| **Adjudicated** | Violet | The payer has decided. |
| **Paid** | Emerald | Paid in full. |
| **Partially paid** | Green | Paid in part. |
| **Denied** | Red | The payer refused payment. |
| **Appealed** | Fuchsia | The refusal is being appealed. |
| **Cancelled** | Rose | Withdrawn. |

### Raising a claim

**Go to:** **Claims**, then **New claim** (`/revenue-cycle/claims/new`), headed **Create claim**.

1. **Patient**: search and pick.
2. **Encounter**: the patient's encounters are listed; narrow them by **Date** or **Doctor name**
   and click one. Picking an encounter sets the **Service date** to the encounter's date. **Change**
   picks another.
3. **Payer ID**: the insurer's internal ID.
4. **Service date** (required) and **Currency** (AED by default).
5. Press **Create claim**.

**Check:** "Claim created" and you return to the list. The claim is saved as **Draft** with a total
of zero: this form creates the claim header only, with no lines.

**If instead:** nothing happens when no patient is chosen.

### Validating and submitting a claim

Open the claim (`/revenue-cycle/claims/{id}`). The header shows **Claim #**, the total and the
status. **Claim overview** shows the patient, **Encounter ID**, **Payer ID** and **Service date**;
**Claim lines** and **Diagnoses** show the claim's contents as raw data.

1. Press **Validate**. The claim is checked by the claim format set for its payer. "Claim
   validated" if it passes, or "Validation failed" if it does not.
2. Press **Submit**.
   - For an NHCX-connected payer, the claim is sent through the exchange and marked **Submitted**.
   - For any other payer, the claim is validated again; if it passes, a claim file is generated
     and the claim is marked **Submitted** ("Claim submitted").
   - If it fails, the claim is marked **Failed validation** and the screen says "Submission
     failed" with "Claim failed validation".

## Batches

**Batches** (`/revenue-cycle/batches`) lists claim batches: **Batch #**, **Status**, **Claims**
(how many), **Total**, **Format**. Search by batch number.

| Status | Meaning |
| --- | --- |
| **Open** | Claims can be added or removed. |
| **Closed** | Locked; ready to generate a file and submit. |
| **Submitting** / **Submitted** | Being sent, or sent. |
| **Acknowledged** | Received by the payer. |
| **Rejected** | Refused by the payer. |
| **Partially processed** | Some claims processed. |

### Making and sending a batch

1. **New batch** (`/revenue-cycle/batches/new`), headed **Create batch**: choose a **Batch type**
   (professional, institutional, dental, pharmacy), a **Claim format** (required) and, optionally, a
   **Payer ID**. Press **Create batch**. "Batch created". Nothing happens without a claim format.
2. Open the batch (`/revenue-cycle/batches/{id}`). Under **Manage claims in batch**, type claim IDs
   into **Claim IDs (comma separated)** and press **Add claims** ("Claims added to batch") or
   **Remove claims** ("Claims removed from batch"). Claims can be changed only while the batch is
   **Open**.
3. Press **Close** ("Batch closed"). An empty batch cannot be closed, and only an **Open** batch can
   be.
4. Press **Generate file**. "Batch file generated" with the file name, or "Generation failed" with
   the reason. The batch must be closed first.
5. Press **Submit** ("Batch submitted"). The batch must be closed first. Submitting marks the batch
   **Submitted**; it is not yet sent to a clearinghouse.

**Batch details** shows the format, payer, total and type; **Claims** lists the batch's claims as
raw data.

## Remittance

**Remittances** (`/revenue-cycle/remittance`) lists payment advices from payers: **Remittance ID**,
**Payer**, **Format**, **Paid** and **Status** (**Received**, **Processing**, **Processed**,
**Reconciled**, **Error**). Search by remittance ID.

### Recording a remittance

**Go to:** **New remittance** (`/revenue-cycle/remittance/new`).

1. **Payer ID** (required) and **Format**: **ERA_835**, **EOB_PDF**, **MANUAL** or **JSON**.
2. **Check number**, **Check date** and **Payment amount** (required).
3. **File content**: paste the remittance file or payload, if you have one.
4. **Lines (JSON array)**: one entry per claim paid, with its claim number, billed amount and paid
   amount, as the placeholder shows.
5. Press **Create remittance**. "Remittance created".

**If instead:** "Invalid lines JSON" if the lines are not valid JSON. Nothing happens without a
payer or payment amount.

### Reconciling

Open the remittance (`/revenue-cycle/remittance/{id}`) and press **Reconcile**. Each line is matched
to a claim by claim number. A matched claim becomes **Paid** if the line paid anything, or
**Denied** if it paid nothing. The toast says "Remittance reconciled" with how many lines matched
and how many did not. A line whose claim number is not found is left unmatched. A remittance can
be reconciled once.

**Remittance details** shows the payer, format, payment amount and check number; **Lines** shows
the lines as raw data.

## Not live yet

- **Payer, claim and encounter fields** on these forms take internal IDs typed in by hand; there is
  no payer picker. Lists show the payer's ID rather than its name, except on **Claims**.
- **Claims**: **Create claim** makes an empty draft with no lines; there is no screen to add claim
  lines. "Validation failed" says to review errors below, but the errors are not shown. Claim
  lines, diagnoses, batch claims, pre-auth services, benefits and remittance lines are shown as raw
  data, not tables. The claims list does not open a claim when you click the row; use **View**.
- **Batches**: **Submit** only changes the batch's status.
- **PreAuth**: for payers not on NHCX, **Submit** only changes the status. There is no screen to
  record the payer's decision.
- **Errors**: when the server refuses an action on these screens, the reason is not shown.
