---
title: 'Pharmacy'
group: 'Diagnostics and pharmacy'
order: 90
routes: ['/pharmacy', '/pharmacy/queue', '/pharmacy/dispensings', '/pharmacy/stock', '/pharmacy/alerts']
description: 'Dispensing prescriptions from the Dispense queue, direct (OTC and paper) dispensing, receiving and adjusting stock batches, and the low-stock and expiry alerts.'
---

Shown when your organisation has Pharmacy switched on.

The **Pharmacy** section of the sidebar has three entries:

- **Dispense** (`/pharmacy/queue`): the prescriptions waiting for the pharmacy, and the history of
  everything dispensed.
- **Stock Management** (`/pharmacy/stock`): every stock batch on the shelves.
- **Alerts** (`/pharmacy/alerts`): batches running low or about to expire.

Opening `/pharmacy` on its own takes you straight to **Dispense**. So does the old dispensing list
address, `/pharmacy/dispensings`, which now lives in the **History** tab.

The usual day runs like this: a clinician prescribes, the prescription appears in the queue, you
process it, verify it, pick a stock batch for each drug and dispense. Stock comes down as you
dispense, and the charge is posted to the patient's bill.

## The dispense queue

**Dispense** (`/pharmacy/queue`) opens on the **Queue** tab. It lists active prescriptions, one card
per prescription with all its drug lines. A prescription leaves the queue once it is dispensed, so
the queue is only the work still to do.

Above the cards:

- **Search by patient name or MRN...**: narrows the cards as you type.
- **Direct Dispense**: dispense without an electronic prescription (see
  [Direct dispense](#direct-dispense)).
- **All**, **Outpatient** and **Inpatient** tabs, each with a count in brackets.

Each card shows:

- the prescription number, with a **v2**, **v3** badge when the prescription has been amended, the
  encounter type (outpatient or inpatient) and the encounter number;
- the patient's name, **MRN**, age and gender;
- the drug lines: name, dosage, frequency, duration and **Qty**. Press the **_n_ drugs** line to fold
  them away or open them again;
- **Prescribed:** with the date and time, the prescriber, and for an inpatient the ward and bed;
- any note the prescriber left, after **Note:**;
- a status badge, and a button on the right.

| Badge | Meaning |
| --- | --- |
| **New** | Nobody in the pharmacy has started on it. The button says **Process**. |
| **queued** | A dispensing record exists but the prescription is not verified yet. The button says **View**. |
| **verified** | Verified and ready to dispense. The button says **View**. |

### Processing a prescription

1. Find the patient's card. Search by name or MRN if the queue is long.
2. Press **Process**. The system opens a dispensing record for the prescription: outpatient
   prescriptions go to the **Outpatient** counter channel, inpatient ones to the **Inpatient Ward**
   channel.
3. The dispensing record opens (`/pharmacy/dispensings/{id}`). Carry on from
   [The dispensing record](#the-dispensing-record).

**Check:** the card now says **queued** and its button says **View**. Pressing **View** takes you
back to the same record, so two pharmacists cannot open two records for one prescription.

**If instead:** the server refuses to open the record when one already exists ("A dispensing record
already exists for this prescription", with its number), or when the prescription is no longer
active ("Prescription is not active", with its status).

The queue says **No prescriptions in queue** when there is nothing to do.

## Dispensing history

The **History** tab on **Dispense** lists every dispensing record. Filter it with the
**All statuses** list. The columns:

- **Dispensing #**;
- **Patient**, with the **MRN** under the name;
- **Source**: digital prescription, otc, paper op (outpatient paper prescription) or paper ward;
- **Channel**: **Outpatient**, **Inpatient Ward**, **Bedside** or **Emergency**;
- **Status**;
- **Date**: when the record was opened.

Press the eye button at the end of a row to open the record.

## Direct dispense

**Direct Dispense** (`/pharmacy/dispensings/new`) is for a sale over the counter or a paper
prescription, when there is no electronic prescription to work from.

**Go to:** **Dispense**, then **Direct Dispense** next to the search.

1. Under **Patient**, search for and pick the patient. You must pick one.
2. The screen looks for the patient's active encounter:
   - If there is one, a blue panel says **Active Outpatient Encounter**, **Active Inpatient
     Encounter** or **Active Emergency Encounter**, with its number, status and start time, and
     "Dispensing type pre-selected based on encounter".
   - If not, it says **No active encounter found for this patient**, and the dispensing is not tied
     to any encounter.
3. Under **Dispensing Type**, choose one. Only the types that fit the encounter are offered:

   | Type | Offered for | Default for |
   | --- | --- | --- |
   | **Over the Counter (OTC)**: direct sale without a prescription | outpatient, emergency, no encounter | emergency, no encounter |
   | **Paper OP Prescription**: from an outpatient doctor | outpatient, no encounter | outpatient |
   | **Paper Ward Prescription**: from a ward or inpatient | inpatient, no encounter | inpatient |

   The chosen type is edged in the primary colour and says **Selected**. **Dispensing channel:**
   under the list shows where it will be recorded: **Inpatient Ward** for a ward prescription,
   **Outpatient Counter** for the rest.
4. For a paper prescription you can also fill in:
   - **Paper Prescription Reference** (optional): the number written on the paper.
   - **Upload Prescription Scan** (optional): press **Click to upload a photo or PDF of the
     prescription**. It uploads at once to the patient's documents and says **Uploaded successfully**
     with a **Saved** badge. Press the cross to remove it.
5. Press **Create & Process**. The dispensing opens straight on the dispense screen, with no
   medicines on it yet. Add them as in [Dispensing medicines](#dispensing-medicines).

**If instead:** the upload refuses a file that is not a PDF or image ("Only PDF, JPEG, PNG, or WebP
files are allowed"), a file over 10 MB ("File must be smaller than 10 MB"), or fails ("Upload failed.
Please try again."). **Create & Process** stays greyed out while a scan is still uploading.

OTC and paper dispensings skip the separate verify step: the system verifies them for you when you
dispense.

## The dispensing record

The dispensing record (`/pharmacy/dispensings/{id}`) is where you verify, dispense, and follow a
dispensing through to the ward.

The banner at the top shows **Dispensing**, the dispensing number, its status, and the encounter
number. Under it: **Patient**, **Age**, **Gender**, **MRN**, **Channel**, and for an inpatient the
**Ward** and bed. When the encounter was triaged, the banner also shows **Triage Vitals** and, in red,
**Allergies**. Check the allergies before you dispense.

The status badge is coloured:

| Status | Colour | Meaning |
| --- | --- | --- |
| **queued** | Grey | Opened, not verified. |
| **verified** | Amber | Verified, ready to dispense. |
| **dispensed** | Green | Medicines handed over and stock deducted. |
| **partially_dispensed** | Blue | Part of the prescription dispensed. |
| **cancelled** | Red | Cancelled before dispensing. |
| **returned** | Grey | Returned after dispensing. |

Below the banner:

- **Prescription**: for an electronic prescription, its number, version, status and each prescribed
  drug with dosage, frequency, duration, instructions and **Qty**, then **Prescribed by:** and any
  note.
- **Dispensed Medications**: once dispensed, each drug given with its strength, form, **Batch:**,
  **Expires:**, instructions, a **Substituted** badge where a substitute was given, the quantity and
  the line amount in AED.
- **Timeline**: **Queued**, **Verified**, **Dispensed**, **Dispatched to Ward** and **Ward Received**,
  each with its time once it has happened, and **Charge Posted** in green once the charge reached the
  bill.

### Verifying a prescription

An electronic prescription must be verified before it can be dispensed.

1. Read the prescription against the patient's allergies and vitals in the banner.
2. Press **Verify Prescription**.

**Check:** the status turns amber **verified**, **Verified** appears in the timeline, and the button
becomes **Dispense Medication**.

**If instead:** the server refuses if the prescription has been stopped or replaced since it was
queued ("Prescription is no longer active", with its status).

### The buttons

Which buttons you see depends on the status:

- **Verify Prescription**: a queued electronic prescription.
- **Dispense Medication**: a verified record. **Add Medicines & Dispense**: a queued OTC or paper
  dispensing. Both open the dispense screen.
- **Confirm Ward Receipt**: a dispensed record that has been dispatched to the ward but not yet
  received. Press it when the ward confirms they have the medicines; **Ward Received** is stamped on
  the timeline.
- **Cancel** (red): a queued or verified record. It cancels at once, with the reason "Cancelled by
  pharmacist", and there is no confirmation. A cancelled prescription goes back to **New** in the
  queue.

## Dispensing medicines

The dispense screen (`/pharmacy/dispensings/{id}/dispense`) opens from **Dispense Medication** or
**Add Medicines & Dispense**, and straight after **Create & Process** on a direct dispense. The
patient banner is the same as on the record.

**Medication Dispensing Plan** has one row per drug, in two halves: **Prescribed Medication** on the
left and **Stock Batch Selection** on the right. Its header counts **_n_ of _m_ batches selected**.

- For an electronic prescription, every prescribed drug is already listed, marked **Prescribed**,
  with its dosage, frequency and quantity. The prescriber's instructions are copied into
  **Instructions**.
- For OTC and paper dispensings the plan starts empty: "Use the search below to add medications".

### Picking stock and dispensing

1. On each prescribed row, under **Select Stock Batch**, the search is pre-filled with the drug code.
   Type at least two characters to search by batch or drug name. Only active batches are offered,
   each with its **Batch:**, **Exp:** and **On hand:**. Pick one.
2. Check the quantity. **Qty (max _n_)** starts at the prescribed quantity, or the stock on hand if
   that is less. Change it if you need to.
3. Edit **Instructions** if needed, for example "Take 1 tablet twice daily after food".
4. If you give a generic instead of the drug prescribed, tick **Generic substitution** and type the
   **Reason for substitution…**.
5. To use another batch, press **change** next to the batch. To drop a drug, press the bin.
6. To add a drug that is not on the prescription, use **Add medication by name or code…** under the
   plan. It adds a row with the batch already chosen. On a prescription this is labelled **Add extra
   or substitution drug**.
7. Under **Patient Counselling**, tick **Counselling provided to patient** if you counselled them, and
   add **Counselling Notes** on use, side effects and storage.
8. Press **Dispense _n_ Items**. Only rows with a batch chosen are dispensed; rows without one are
   left out.

**Check:** you land back on the record, the status is green **dispensed**, the drugs appear under
**Dispensed Medications**, the prescription leaves the queue, and stock on each batch has come down.
When the batch is linked to a billing item, the charge is posted to the patient's bill and **Charge
Posted** appears on the timeline.

**If instead:**

- The button stays greyed out until at least one row has a batch: "Select a stock batch for each drug
  to proceed", or with an empty plan "Add at least one medication to dispense".
- An electronic prescription that is not verified yet does not open the plan. The screen says the
  dispensing is **queued** and to "verify the prescription before dispensing", with **Go to Detail
  Page**.
- The server refuses a quantity larger than the batch has free (on hand less anything reserved):
  "Insufficient stock for" the drug and batch, with the amount available.

## Stock management

**Stock Management** (`/pharmacy/stock`) lists every stock batch, 20 to a page. Each batch of each
drug is its own row.

- **Search by name, code or batch…**: searches a moment after you stop typing.
- **All statuses**: filter by **active**, **quarantined**, **expired**, **depleted** or **recalled**.
- **Receive Stock**: book in a new batch.

The columns:

- **Drug**: name, generic name or code, form and strength. A **catalog** badge means the batch is
  linked to the medication catalogue; press it to open the catalogue entry.
- **Batch**.
- **On Hand**: in red with a warning sign when at or below the batch's reorder level.
- **Expiry**: month and year, in amber with a clock when it expires within 30 days.
- **Location**.
- **Status**: solid for **active**, red for **quarantined**, **expired** and **recalled**, grey for
  **depleted**.
- **Billing**: a **linked** badge when the batch is linked to a billing item; press it to open the
  item in billing setup ([Billing setup](billing-setup.md)). A dash means dispensing this batch posts
  no charge.

The foot of the table says **Showing _a_–_b_ of _n_ batches**, with **Previous** and **Next**. Press
the eye button on a row to open the batch.

### Receiving a stock batch

**Receive Stock Batch** (`/pharmacy/stock/new`).

1. Under **Search Medication Catalog**, type at least two characters and pick the medication. The
   drug code, name, generic name, dosage form and strength fill in and lock.
2. The screen looks up the billing item for that medication:
   - green **Billing item resolved:** with its code, description and AED price, or
   - amber "No billing item mapped for this medication. Stock will be created without a billing
     link." Dispensing that batch will then post no charge. Map the medication in billing setup first
     if it should be charged.
3. Fill in **Unit** (tablets, vials, bottles…).
4. Under **Batch Details**, fill in **Batch Number**, **Expiry Date** and **Quantity Received**, and
   if you have them **Manufacturer**, **Reorder Level** (the level that raises a low-stock alert),
   **Storage Location** and **Unit Cost Price (AED)**.
5. Press **Receive Stock**. You go back to the stock list with the new batch on it.

To enter a drug that is not in the catalogue, leave the search empty and type the drug fields
yourself, or press **Clear selection** to unlock them after picking one.

**If instead:** the form refuses missing fields: "Drug code is required", "Drug name is required",
"Dosage form is required", "Unit is required", "Batch number is required", "Expiry date is required",
and "Quantity must be positive".

### A stock batch

The batch page (`/pharmacy/stock/{id}`) is headed with the drug name and its status: solid for
**active**, red for anything else.

- **Drug Details**: **Drug Code**, **Dosage Form**, **Strength**, **Generic**, and in amber
  **Controlled substance** with its class where it applies.
- **Batch & Inventory**: **Batch #**, **Manufacturer**, **Expiry** (amber with **(Soon)** within 30
  days), **Received**, **On Hand** (red with a warning sign at or below the reorder level),
  **Reserved**, **Reorder Level**, **Location** and **Cost/Unit**.
- **Movement History**: every receipt, dispense, adjustment and other movement, with **Type**,
  **Qty** (green when stock came in, red when it went out), **Balance After**, **Reason** and
  **When**.

**Adjust Quantity** corrects the count after a stock-take, damage or write-off:

1. Press **Adjust Quantity**.
2. Type the **New Quantity On Hand**: the true count, not the difference.
3. Type a **Reason** (required), for example "cycle count".
4. Press **Save Adjustment**. The adjustment is added to **Movement History**.

**Quarantine Batch** (red, on an active batch only) takes the batch out of use at once, with no
confirmation. A quarantined batch is no longer offered when you pick stock on the dispense screen.

## Alerts

**Pharmacy Alerts** (`/pharmacy/alerts`) carries a red count of all alerts next to its title, and two
tabs:

- **Low Stock** (red count): batches at or below their reorder level, with batch, the amount **On
  hand** in red and the level it reorders at. "No low stock alerts" when there are none.
- **Expiring Soon** (amber count): batches expiring in the next 30 days, with batch, amount on hand
  and **Expires** with the date and days left: amber, turning red at seven days or less. "No batches
  expiring in the next 30 days" when there are none.

Press the eye button on any alert to open the batch, where you can adjust or quarantine it. A batch
only raises a low-stock alert if a reorder level was set when it was received.

## Not live yet

- **Dispatch to Ward**, offered on a dispensed inpatient record, opens a page that does not exist
  yet. Ward dispatch cannot be recorded from the screen, so **Confirm Ward Receipt** will not appear
  either.
- When the server refuses a step (verify, dispense, receive stock, adjust, quarantine), the screen
  does not show the reason yet: the button simply comes back. If nothing happens, check the
  conditions listed under each task.
- **Qty (max _n_)** on the dispense screen does not stop you typing more than is on hand; the server
  refuses it on dispensing.
- There is no screen for partial dispensing, returns, recording a recall, or editing a batch's
  details after it is received.
- On the queue, the search only narrows the **All** tab. On **Outpatient** and **Inpatient** the
  search is ignored, and each tab's count reflects the tab you are on rather than the whole queue.
