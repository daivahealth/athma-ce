---
title: 'Billing'
group: 'Billing and revenue'
order: 100
routes: ['/invoices', '/receipts', '/revenue-cycle/refunds', '/patient-ledger', '/revenue-cycle/credit-notes', '/revenue-cycle/debit-notes', '/billing-workspace', '/medical-coding']
description: 'Raising invoices, taking receipts, refunds, credit and debit notes, the patient ledger, the Billing Workspace for collecting at the desk, and the Medical Coding inbox.'
---

The **Billing** section of the sidebar holds the day-to-day money screens:

- **Invoices** (`/invoices`): what the patient has been charged.
- **Receipts** (`/receipts`): what the patient has paid.
- **Refunds** (`/revenue-cycle/refunds`): money going back to the patient, with an approval step.
- **Patient Ledger** (`/patient-ledger`): one patient's running balance, every document in date order.
- **Credit Notes** (`/revenue-cycle/credit-notes`) and **Debit Notes** (`/revenue-cycle/debit-notes`):
  corrections that lower or raise what a patient owes.
- **Billing Workspace** (`/billing-workspace`): a patient's invoices and a payment box side by side,
  for the cashier's desk.
- **Medical Coding** (`/medical-coding`): the coder's inbox of diagnosis and procedure coding sessions.

How the pieces fit:

1. Clinical work posts **charges** against the patient (automatically, through the rules and catalog
   mappings described in [Billing setup](billing-setup.md), or by hand on an invoice line).
2. An **invoice** gathers charges into a bill. Its lines lock those charges in as billed.
3. A **receipt** records money taken. Allocating it to an invoice reduces that invoice's balance.
4. **Credit notes**, **debit notes**, **refunds** and manual **adjustments** correct the balance.
5. The **Patient Ledger** shows the net effect of all of it.

Every money figure is shown with two decimals and the currency code after it, such as
"150.00 AED". The currency is your organisation's **finance.currency** setting; AED is used when
none is set.

## Invoices

**Invoices** (`/invoices`) lists invoices raised on the chosen day.

Above the table:

- **Search** by invoice number, patient name or MRN. The search only looks through the invoices
  already loaded for the date and status you picked.
- **Status**: **All statuses**, **Unpaid**, **Partial**, **Paid** or **Cancelled**.
- **Date**: **Today** (the default), **Yesterday** or **Date Range**. With **Date Range** a button
  appears showing the range; press it to pick a start and end date on a two-month calendar.

The columns are **Invoice #**, **Patient** (name, MRN, gender and age), **Date**, **Net amount**,
**Balance** and **Status**. Click a row, or **View**, to open the invoice.

| Status | Colour | Meaning |
| --- | --- | --- |
| **Unpaid** | Orange | Nothing paid yet. |
| **Partial** | Amber | Some paid, a balance remains. |
| **Paid** | Green | Balance is zero or less. |
| **Cancelled** | Rose | Cancelled; its charges are free to bill again. |

If the list cannot be read, a red box says "Failed to load invoices:" followed by the reason.

### Raising an invoice

**Go to:** **Invoices**, then **New invoice** (`/invoices/new`). The page is headed **Create invoice**
with the currency beside it.

1. **Patient**: search by name, MRN or mobile and pick the patient.
2. **Encounter** (optional): the patient's encounters are listed with date, time, doctor and status.
   Narrow them with **Date** and **Doctor name**, then click one. Press **Change** to pick another.
   When you pick an encounter, its **unbilled charges** are loaded as invoice lines straight away,
   replacing whatever lines you had.
3. **Invoice date** (today by default), **Due date** (optional) and **Amount paid** (anything already
   collected, 0 by default).
4. **Invoice lines**: each line needs a **Charge Item**. Type in **Search billing items...** and pick
   one; its description and list price fill in. Adjust **Qty**, **Unit price** and **Discount**.
   **Line total** is quantity times price less discount, never below zero. **Add line** adds a row;
   **Remove** deletes one (the last row cannot be removed).
5. Check the totals box: **Gross amount**, **Total discounts**, **Net amount**, **Amount paid** and
   **Balance due**.
6. Press **Create invoice**.

**Check:** a toast says "Invoice created" and you return to the list. The invoice number is made
from your organisation's invoice number format, prefix and start number settings. The status is set
from the figures: **Paid** if the balance is zero or less, **Partial** if something was paid,
otherwise **Unpaid**. Lines you added by hand become new manual charges for the patient.

**If instead:** pressing **Create invoice** does nothing. The screen gives no message; check that:

- a patient is selected;
- every line has a **Charge Item** picked (a blank line blocks the whole invoice, so remove it);
- your organisation's invoice numbering settings (**finance.invoice_number_format**,
  **finance.invoice_prefix**, **finance.invoice_start_number**) are set. Without them no number can
  be made and nothing is saved. Ask an administrator.

### Working an invoice

Open an invoice (`/invoices/{id}`). The header shows **Invoice #**, the net amount in large type
and the status badge. Three cards show the **Patient**, the **Invoice date** (with "Due" and the due
date if one was set) and the **Balance due**.

- **Invoice summary**: **Gross amount**, **Discounts**, **Net amount**, **Amount paid**,
  **Balance due**.
- **Invoice lines**: **#**, **Description** (with the charge it bills), **Qty**, **Unit**,
  **Discount** and **Amount**.

**Record payment**: enter an **Amount** and an optional **Reference** (receipt or transaction
number), then **Record payment**. The invoice's paid amount and balance update and its status
moves to **Partial** or **Paid**. The screen refuses a blank or zero amount with "Enter a payment
amount". The server refuses payment on a cancelled invoice.

Recording a payment here changes the invoice's figures only. It does not create a receipt, so it
does not appear on **Receipts** or in the **Patient Ledger**. To take money with a receipt, use
[Billing Workspace](#billing-workspace) or [Receipts](#receipts) instead.

**Update status**: pick a status and press **Update status**. This sets the badge only; it does not
change any amount.

**Cancel invoice** (under **Danger zone**): confirm the prompt "Cancel this invoice? (Only unpaid
invoices can be cancelled)". The invoice becomes **Cancelled**, its charges go back to unbilled so
they can be invoiced again, and the ledger entry is reversed. The button is greyed out once the
invoice is cancelled. The server refuses to cancel an invoice that has any amount paid ("Cannot
cancel invoice with payments").

When the server refuses a payment, status change or cancellation, the screen does not show the
reason; the invoice simply stays as it was.

## Receipts

**Receipts** (`/receipts`) lists receipts taken on the chosen day. It filters like Invoices:
**Search** (receipt number, patient name or MRN), **Payment method** (**All**, **Cash**, **Card**,
**UPI**, **Bank transfer**, **Wallet**) and the **Today**, **Yesterday** or **Date Range** filter.

The columns are **Receipt #**, **Patient**, **Date**, **Amount** and **Method**. Click a row or
**View** to open it.

### Taking a receipt

**Go to:** **Receipts**, then **New receipt** (`/receipts/new`), headed **Create receipt**.

1. **Patient**: search and pick.
2. **Invoice ID** (optional): the invoice's internal ID. This only records which invoice the
   receipt is for; it does not reduce the invoice's balance. Use an allocation for that (step 6).
3. **Receipt date**, today by default.
4. **Paid amount** and **Paid currency** (both required). The currency starts as your base
   currency.
5. **FX rate to** (your base currency): needed only when the patient paid in another currency. It is
   fixed at 1 and greyed out while the paid currency matches the base currency. The receipt is
   stored in the base currency at paid amount times rate.
6. **Payment method**, **Transaction reference** (such as the card machine's transaction ID) and
   **Notes**.
7. **Allocations (optional)**: to settle invoices, enter each **Invoice ID** and **Amount**. **Add
   allocation** adds a row. Rows with no invoice or a zero amount are ignored.
8. Press **Save receipt**.

**Check:** "Receipt created" and you return to the list. Each allocation adds to that invoice's
amount paid and lowers its balance, moving it to **Partial** or **Paid**. The receipt is posted to
the patient's ledger.

**If instead:** nothing happens on **Save receipt** when no patient is chosen, the paid amount is
zero or blank, the rate is zero, or the receipt numbering settings
(**finance.receipt_number_format**, **finance.receipt_prefix**, **finance.receipt_start_number**)
are missing. The server refuses allocations that add up to more than the receipt ("Total allocated
amount (...) exceeds receipt amount (...)").

### Working a receipt

Open a receipt (`/receipts/{id}`): **Receipt #**, the amount, the payment method badge, and cards
for **Patient**, **Receipt date** and **Reference**.

- **Edit receipt**: the same form as above, with **Update receipt**. A toast says "Receipt updated".
- **Allocations**: the allocations already made (**Invoice**, **Amount**, **Allocated at**), or "No
  allocations recorded." Below, add more: **Invoice ID** and **Amount** per row, **Add another
  invoice** for more rows, then **Allocate**. With no usable row the screen says "Add at least one
  allocation". On success, "Receipt allocated".
- **Delete receipt** (under **Danger zone**): confirm "Delete this receipt?". The server refuses to
  delete a receipt that has allocations ("Cannot delete receipt with allocations. Remove allocations
  first."), and this screen has no way to remove an allocation, so in practice only unallocated
  receipts can be deleted.

## Refunds

**Refunds** (`/revenue-cycle/refunds`) lists refunds for the chosen day. Filter by **Search** (refund
number, patient name or MRN), **Status**, **Method** and the date filter. The columns are
**Refund #**, **Patient**, **Date**, **Amount**, **Method** and **Status**.

| Status | Meaning |
| --- | --- |
| **Pending** | Raised, waiting for approval. Can be deleted. |
| **Approved** | Approved, waiting to be paid out. |
| **Rejected** | Turned down, with a reason. |
| **Processed** | Paid out. Invoice balances and the ledger are updated. |
| **Voided** | A processed refund reversed. |

Methods are **Cash**, **Card reversal**, **Bank transfer**, **Cheque**, **Wallet** and **Other**.

### Raising a refund

**Go to:** **Refunds**, then **New refund** (`/revenue-cycle/refunds/new`).

1. **Patient**: search and pick.
2. **Refund Date** (today by default) and **Receipt ID (optional)** to tie the refund to a receipt.
3. **Amount** (required, in the base currency) and **Refund Method**.
4. **Transaction Reference**, **Reason for Refund** and **Notes** as needed.
5. Press **Create Refund**.

**Check:** "Refund created" with the new refund number, and the refund opens as **Pending**.

**If instead:**

- "Please select a patient" when no patient is chosen.
- "Amount must be greater than 0".
- "Failed to create refund" with the server's reason, for example when the amount is more than is
  left unrefunded on the linked receipt ("Refund amount (...) exceeds unrefunded receipt balance
  (...)").

### Approving and paying out a refund

Open the refund (`/revenue-cycle/refunds/{id}`). The **Actions** card offers only the next step for
its status:

1. **Pending**: **Approve** (optional notes; "Refund approved") or **Reject** (a **Reason** is
   required; "Rejection reason is required" if you leave it blank; "Refund rejected").
2. **Approved**: **Process**, with an optional **Transaction Reference** and **Notes**. "Refund
   processed". Processing reverses the payment on each allocated invoice, raising its balance due,
   and posts the refund to the ledger.
3. **Processed**: **Void**, with a required **Reason** ("Void reason is required"). The dialog warns
   that voiding will reverse invoice balance changes. "Refund voided".

Any refusal from the server shows as "Failed to approve", "Failed to reject", "Failed to process" or
"Failed to void" with the reason.

The page also shows the **Patient**, **Refund date**, **Reference**, a **Details** card (reason,
notes, and any **Rejection Reason** in red), the **Linked Receipt**, the **Allocations** to invoices
and an **Audit Trail** of every action with its time. A pending refund can be removed under
**Danger zone** with **Delete refund** (confirm "Delete this refund?").

## Patient Ledger

**Patient Ledger** (`/patient-ledger`) shows one patient's financial history and running balance.
Search for the patient first; nothing else shows until you do.

Three cards head the page:

- **Total Debits** (red): charges, refunds, debit adjustments.
- **Total Credits** (green): payments and credit notes.
- **Outstanding Balance**: red with "Patient owes" when above zero, green with "Patient credit" when
  zero or below.

**Transaction History** lists every entry: **Date**, **Type**, **Doc No**, **Description**,
**Debit** (red), **Credit** (green), **Balance** after that entry (red when owed, green when not),
and **Status**. Filter by **Entry Type** (**Invoice**, **Receipt**, **Credit Note**, **Debit Note**,
**Adjustment**, **Refund**, **Opening Balance**) and **From Date** / **To Date**. The **Doc No** of
an invoice, receipt or refund links to that document.

Entries reach the ledger by themselves: an invoice when created, a receipt when saved, a credit or
debit note when posted, a refund when processed. Cancelling or voiding the document reverses its
entry.

| Status | Meaning |
| --- | --- |
| **Draft** | Not yet counted. |
| **Posted** | Counted in the balance. Can be reversed. |
| **Reversed** | Offset by a reversal entry. |
| **Void** | Cancelled. |

### Making a manual adjustment

1. Press **Create Adjustment**.
2. Choose **Credit (reduce balance)** or **Debit (increase balance)**.
3. Enter the **Amount** and a **Reason**; **Notes (optional)**.
4. Press **Create Adjustment**.

**Check:** "Adjustment created" and a posted **Adjustment** row appears.

**If instead:** "Enter a valid amount." or "Please provide a reason."; a server refusal shows as
"Failed to create adjustment" with the reason.

### Reversing an entry

A **Posted** row has a reverse button in **Actions**. The dialog shows the document, type and
amount; enter a **Reason for Reversal** and press **Reverse Entry**. A reversal entry is added to
offset the original. Without a reason: "Please provide a reason for reversal."

## Credit Notes and Debit Notes

A **credit note** lowers what a patient owes (for example, a service not given). A **debit note**
raises it (an extra charge after the invoice). The two screens work the same way.

**Credit Notes** (`/revenue-cycle/credit-notes`) and **Debit Notes** (`/revenue-cycle/debit-notes`)
list the notes with **Credit note #** / **Debit note #**, **Patient**, **Amount** and **Status**
(**Draft**, **Posted**, **Voided**). Search with **Search credit notes...** or **Search debit
notes...**. Use **View** to open one.

### Raising a note

**Go to:** **New credit note** (`/revenue-cycle/credit-notes/new`) or **New debit note**
(`/revenue-cycle/debit-notes/new`).

1. **Patient**: search and pick.
2. **Invoice (optional)**: press it to open **Select Invoice**, listing the patient's invoices with
   **Date**, **Status**, **Net Amount**, **Paid** and **Balance Due**. It reads "Select a patient
   first" until a patient is chosen.
3. **Date**, **Reason** and **Notes**.
4. **Line items**: a **Description** and **Amount** per line. **Add line** for more; **Remove** to
   delete one. The running **Total** shows above the lines.
5. Press **Create credit note** or **Create debit note**.

**Check:** the note opens as **Draft**. A draft does not touch the patient's balance yet.

The server refuses a note whose total is zero ("Amount must be greater than 0").

### Posting and voiding

Open the note (`/revenue-cycle/credit-notes/{id}` or `/revenue-cycle/debit-notes/{id}`). The status
badge is yellow for **Draft**, green for **Posted** and red for **Voided**. The page shows the
amount (green for a credit note, red for a debit note), patient, date, a **View Invoice** link if
an invoice was chosen, reason, notes and the **Line Items** with their **Total**.

- A **Draft** shows a yellow card: "This credit note is in draft status" (or debit note). Press
  **Post Credit Note** / **Post Debit Note** to apply it to the patient's ledger, or **Delete** to
  remove it (confirm "Are you sure you want to delete this credit note?").
- A **Posted** note shows **Void Credit Note** / **Void Debit Note**. Enter a **Reason for voiding**
  and press the button; the entry is reversed from the ledger. Without a reason: "Void reason is
  required".
- A **Voided** note says "This credit note has been voided" (or debit note) with the reason.

Only drafts can be posted or deleted, and only posted notes can be voided.

## Billing Workspace

**Billing Workspace** (`/billing-workspace`) puts a patient's invoices beside a payment box, so the
cashier can find a bill and take payment without leaving the page.

1. In **Search Patient**, find the patient. Their invoices appear with **Invoice**, **Amount**,
   **Balance** and **Status** (**Unpaid**, **Partially paid**, **Paid**, **Cancelled**). Narrow them
   with the status filter. "No invoices found for this patient." if there are none.
2. Click an invoice. The first one is selected for you. **Invoice detail** shows the net amount,
   status, **Patient**, **Balance due**, **Invoice date** and up to five **Recently linked
   receipts** for this patient.
3. In **Collect payment**, enter the **Amount** (the balance due shows as a hint), the **Payment
   method**, an optional **Reference** and **Notes**.
4. Press **Record payment**.

**Check:** "Payment recorded" with "Receipt created and allocated." A receipt is created for the
full amount and allocated to the selected invoice, so its balance and status update and the
payment shows on **Receipts** and the **Patient Ledger**.

**If instead:** "Enter an amount to collect." for a blank or zero amount.

Receipts made here are numbered "RCPT-" followed by a timestamp, not with your organisation's
receipt number format.

## Medical Coding

**Medical coding** (`/medical-coding`) is the coder's inbox, assignments and productivity.

- Four tiles: **Total sessions**, **Pending**, **In review** and **Submitted**.
- **Coder productivity**: per coder, sessions completed, diagnoses and procedures coded. "No
  productivity data." when there is none.
- **Pending inbox**: up to six pending sessions as buttons; click one to open it.
- **Coding sessions**: the full list with **Patient** (shortened patient and encounter IDs),
  **Status**, **Priority**, **Coder** (or **Unassigned**) and **Updated**. Search by patient or
  encounter ID, filter by status, or type a **Queue** name. **Review** opens the session.

Statuses are **New**, **Pending**, **In Review**, **Returned**, **Completed** and **Submitted**.

### Coding a session

Open a session (`/medical-coding/{id}`). **Session summary** shows the patient ID, encounter ID,
coder and last update.

1. For a **Pending** session, press **Start review**. "Review started".
2. **Diagnoses**: under **Add diagnosis**, enter the **Code**, **System** (ICD-10 by default) and
   **Description**, switch on **Primary diagnosis** if it is, and press **Add diagnosis**. In the
   list, **Toggle primary** flips the primary flag and **Delete** removes a code.
3. **Procedures**: under **Add procedure**, enter **Code**, **System** (CPT by default),
   **Description**, **Modifier** and **Units**, then **Add procedure**. **+1 unit** adds a unit;
   **Delete** removes it.
4. **Coder notes**: type and press **Save notes** ("Session updated").
5. Press **Submit session**. "Session submitted for claim generation".

A code field left blank means the add button does nothing. The **Audit trail** at the bottom lists
each action, who did it, notes and when.

## Not live yet

- **Credit and debit notes**: the **Edit** button on a draft note links to an edit page that does
  not exist yet. To change a draft, delete it and raise it again. The list pages do not open a note
  when you click the row; use **View**.
- **Invoices and receipts**: invoice and receipt IDs for allocations and the receipt's **Invoice
  ID** must be typed in as internal IDs; there is no invoice picker on these forms.
- **Invoice detail**: when the server refuses a payment, status change or cancellation, no message
  is shown.
- **Receipts**: an allocated receipt cannot be deleted, and there is no way to remove an allocation
  on screen.
- **Medical coding**: patients, encounters and coders show as internal IDs, not names. There is no
  button to create or assign a session on these screens.
