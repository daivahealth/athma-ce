---
title: 'Reports and search'
group: 'Insights'
order: 160
routes: ['/reports', '/search']
description: 'The Analytics section: asking questions of your data in Report Builder, charting and exporting the answer, and finding clinical documents by meaning in Clinical Search.'
---

Shown when your organisation has Analytics switched on.

The **Analytics** section of the sidebar holds two screens, both marked **AI-Powered**:

- **Report Builder** (`/reports`): type a question about your data in plain English and get a table or
  chart back, which you can export.
- **Clinical Search** (`/search`): type what you are looking for and find clinical notes, discharge
  summaries and reports that mean it, even when they use different words.

**Clinical Search is not the patient search box.** The box in the topbar, **Search patients by name, MRN,
phone**, finds a patient by name, MRN or phone and opens their record; see
[Finding a patient](getting-started.md#finding-a-patient). **Clinical Search** looks inside the text of
clinical documents across all patients. Use the topbar box when you know who you want; use **Clinical
Search** when you know what was written.

## Report Builder

**Report Builder** (`/reports`) is headed "Ask questions about your data in plain English". Across the top
right are **Catalog**, **History** and the **AI-Powered** badge.

The question is turned into a report by an AI service, which picks the figures and groupings it thinks you
mean and runs them against your organisation's data. Always read the **Interpretation** it gives back
before you rely on the numbers.

### Ask a question

**Go to:** **Analytics** > **Report Builder**.

1. In **Ask a Question**, type your question into the box, for example "What is the total revenue by
   department for this month?".
2. Press Enter, or the send button to the right of the box. Shift+Enter starts a new line instead. The send
   button is greyed out while the box is empty, and spins while the report runs.

Two small buttons sit inside the box:

- the sparkle button (**Example queries**) lists ready-made questions, such as "What's today's total
  revenue?", "Show me patient count by department" and "List all unpaid invoices from last month". Pick one
  to put it in the box, then send it;
- the clock button (**Recent queries**) lists your last five questions that worked. It appears only once you
  have one.

**Check:** the **Results** panel fills with a table and says how many rows were found, for example "42 rows
found". Above it you may see:

- **Interpretation**: how the question was understood. If it is not what you meant, rephrase and ask again.
- **Related Questions**: follow-up questions as chips. Press one to run it straight away.

**If instead:** a red **Error** panel appears above the results with the reason the report could not be
built, or "Failed to generate report" when no reason was given. If the request itself fails (for example the
service is unreachable), a red toast also says "Query failed" with the reason. Rephrase the question, or
use **Catalog** to see what can be asked about.

A report returns at most 1,000 rows. Money is shown in your organisation's billing currency (INR when none
is set).

### Read the table

- Press a column heading to sort by it; press again to reverse. An arrow shows the direction.
- The table shows 25 rows a page. Use **Previous** and **Next**; the footer says "Showing 1 to 25 of 42 rows"
  and "Page 1 of 2".
- Columns of money or counts get a **Total** row at the bottom of the page, adding up every row returned.
- Under the table, "Query executed in ...ms" says how long it took.

Before you ask anything the panel says "Enter a query to see results". A question that matches nothing says
"No results found for this query".

### See it as a chart

Above the results, switch between **Table** and **Chart**.

**Chart** is greyed out unless the answer suits a chart: at least one row and no more than 50, with at least
one column of numbers and at least one column of names or dates to plot them against.

In chart view, four buttons choose the chart: bar, line, pie and area. The screen picks one for you each time
a new answer arrives:

| Answer looks like | Chart picked |
| --- | --- |
| Has a date column | Line |
| Eight rows or fewer, one column of numbers | Pie |
| Anything else | Bar |

A pie chart uses only the first column of numbers. If the chart cannot be drawn it says "No data available
for chart visualization".

### Export

**Export** (beside the view buttons) offers **Excel (.xlsx)**, **CSV (.csv)** and **PDF (.pdf)**. It is
greyed out until a question has returned at least one row. The file downloads to your computer, named from
the start of your question and today's date.

**Check:** a toast says "Export successful" with, for example, "Report exported as CSV.".

**If instead:** a red toast says "Export failed" with "There was an error exporting the report. Please try
again.". Read the warning about exports under [Not live yet](#not-live-yet).

### History

**History** opens **Recent Queries**: your last 20 questions, newest first, each with when it ran and either
a row count or a red **Failed** badge. The badge on the **History** button counts them.

- Press a question to run it again.
- **Clear** empties the list; a toast says "History cleared" with "Your report history has been cleared.".

History is kept in this browser only. It does not follow you to another computer, and clearing your
browser data clears it. When it is empty it says "No recent queries".

### Catalog

**Catalog** opens **Available Metrics & Dimensions**: the figures (**Metrics**, such as revenue or patient
counts) and the groupings (**Dimensions**, such as department or date) that questions can use. Each list
shows a count and is grouped by category.

- Type in **Search metrics & dimensions...** to narrow both lists.
- Hover over an entry to see its description and its field name.
- Use the names you see here in your question; for example a metric "Total Revenue" and a dimension
  "Department" make "Show total revenue by department".

If nothing matches it says "No metrics found" or "No dimensions found". If the catalog cannot be fetched it
says "Failed to load catalog".

## Clinical Search

**Clinical Search** (`/search`) is headed "Search clinical documents using natural language". Across the
top right are **Filters**, **Index Status** and the **AI-Powered** badge.

It compares the meaning of what you type with the meaning of each indexed document, so "uncontrolled blood
sugar" can find a note that says "poor glycaemic control". Until you search, a **How it works** panel
explains this.

### Search

**Go to:** **Analytics** > **Clinical Search**.

1. In **Search Clinical Documents**, describe what you are looking for, for example "Find notes mentioning
   diabetes with uncontrolled blood sugar".
2. Press Enter, or the search button to the right. The button is greyed out while the box is empty.

The sparkle button inside the box (**Example searches**) offers ready-made searches. They change to suit the
document types you have ticked under **Filters**.

**Check:** **Results** says how many documents were found, for example "12 documents found", and lists them
best match first. Up to 20 are shown, and only documents that are at least a 30% match.

**If instead:** a red **Search Error** panel shows the reason (or "Search failed"), and a red toast says
"Search failed". A search that finds nothing says "No results found" and "Try adjusting your search query
or filters".

### Reading a result

Each result is a card showing the passage that matched, not the whole document:

- a coloured badge for the document type (for example **Discharge Summaries** or **Lab Reports**);
- the match as a percentage, with a bar under it;
- the matching passage, with key words highlighted in yellow;
- the patient's name and age, **MRN**, the encounter type, the author, the facility and department, and the
  document's date, where they are known;
- a shortened **Document ID**.

The match percentage is coloured:

| Match | Colour |
| --- | --- |
| 90% and above | Green |
| 80% to 89% | Blue |
| 70% to 79% | Amber |
| Below 70% | Grey |

Above the cards, "Found 12 results" and "Search took ...ms".

### Open a document

Press the open button at the top right of a card (**View document**). A **Document Preview** panel slides in
from the right with:

- the encounter number (or the shortened document ID);
- **Patient Information**: name, age, MRN and gender;
- **Document Details**: author, encounter type, facility and department;
- **Matched Content**: the passage that matched.

Then:

- **View Full Document** opens where the document lives: the encounter's charting screen
  (`/encounters/{id}/charting`) for encounter, clinical, progress, consultation, procedure and operative
  notes; the encounter (`/encounters/{id}`) for discharge summaries and radiology, lab and pathology
  reports; or the patient's record when the document has no encounter.
- **Patient Profile** opens the patient's record (`/patients/{id}`).

See [Patient access](patient-access.md) for those screens.

### Find similar documents

Press **Find similar documents** at the foot of a card to replace the results with up to ten documents most
like that one.

**Check:** a toast says "Similar documents found" with "Found 8 similar documents.".

**If instead:** a red toast says "Failed to find similar documents" with the reason, and the results you had
stay on screen.

To go back to your own search, type it again.

### Filters

**Filters** opens **Search Filters**. Narrow the search by:

- **Document Types**: tick any of **Encounter Notes**, **Discharge Summaries**, **Clinical Notes**,
  **Progress Notes**, **Consultation Notes**, **Procedure Notes**, **Operative Notes**, **Radiology Reports**,
  **Lab Reports** and **Pathology Reports**. Tick none to search them all.
- **Date Range**: **From** and **To**.
- **Patient**: **Patient Name**, **MRN**, **Gender** (**Male**, **Female**, **Other**) and **Age Range**
  (**Min** and **Max**).
- **Encounter Type**: **Outpatient**, **Inpatient**, **Emergency**, **Day Case** or **Virtual**.
- **Author/Physician**: the clinician's name.

A count beside **Filters** inside the panel shows how many filters are set; **Clear** removes them all.
Changing a filter re-runs your current search, but see [Not live yet](#not-live-yet): press search again
after you finish setting filters.

### Index Status

**Index Status** opens **Embedding Index Status**. Clinical documents have to be indexed before Clinical
Search can find them. The panel shows:

- **Documents** and **Chunks** indexed (long documents are split into chunks);
- **_n_ pending** in amber and **_n_ failed** in red, or **All synced** in green when neither;
- **Last sync** and its time.

**Reindex** starts a fresh indexing run. Choose one of:

- **Full Re-index (all documents)**: "Re-generates embeddings for all documents. Use after model upgrades."
- **New Documents Only**: "Only indexes documents that do not have embeddings yet."
- **Update Metadata Only**: "Updates patient/author metadata for existing embeddings without regenerating
  vectors."

A toast says "Reindex started" with the server's message, or "Failed to start reindex" with "There was an
error starting the reindex job.". While it runs the panel shows **Reindexing...**, how many documents are
done out of the total, a progress bar and an ETA. **Cancel Reindex** stops it ("Reindex cancelled"; or
"Failed to cancel reindex" if it could not).

A full re-index works through every document and can take a long time. Leave it to whoever looks after the
system unless you have been asked to run it.

## Not live yet

- **Report Builder, Catalog**: pressing a metric or dimension closes the catalog but does not put anything in
  the question box. Read the names in the catalog and type them yourself.
- **Report Builder, Export**: the export runs the question again rather than saving the table on screen, and
  it uses only the first 30 characters of your question. A longer question can export a different answer
  from the one you see, or fail. Check the file before you share it, or keep questions short when you mean
  to export them.
- **Report Builder**: there is no way to save a report, name it, mark it as a favourite or schedule it. Use
  **History** to rerun recent questions.
- **Clinical Search, Filters**: when you change a filter, the automatic re-run uses the filters as they were
  just before your change, so the results are one step behind. Press search again once you have finished.
  Typing in a text filter re-runs the search on every keystroke.
- **Clinical Search, Filters**: the count on the **Filters** button counts only document types and dates;
  patient, encounter type and author filters are set but not counted there. There is no facility or
  department filter on this screen.
- **Clinical Search**: the match percentage in **Document Preview** is always green, whatever the score.
- **Index Status**: anyone who can open Clinical Search can start or cancel a re-index from here.

For the patient search box in the topbar, see [Getting started](getting-started.md#finding-a-patient).
Terms are explained in the [Glossary](glossary.md).
