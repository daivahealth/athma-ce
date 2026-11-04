---
"@zeal/frontend": minor
---

Enforce chemotherapy order safety rules in the oncology plugin on the server, not just on screen:

- New orders can only start as `pending` or `draft`; the ordering provider is always the signed-in user, and the protocol must be active.
- The ordering provider cannot approve their own order, the approver cannot verify it, and approval requires a complete pre-chemo checklist (consent, allergies, labs reviewed and in range, BSA and doses verified).
- The `oncology.chemo.require_dual_sign` setting (default on) is now honoured: verification needs an independent second verifier chosen from staff, and administration can only start after verification.
- Hold and cancel respect the order's status; held orders can be resumed (back to pending, sign-offs cleared). New `submit` and `resume` endpoints.
- Care plan and radiation prescription approvals are attributed to the signed-in user; radiation prescriptions keep the original prescriber and record `approved_by` / `approved_at` (run `npm run db:push` in `plugins/oncology` with `CLINICAL_DATABASE_URL` set).
- Foundation staff responses now include the linked login (`user: { id, email, firstName, lastName, status }` or `null`), so the second-verifier picker can list staff who can sign in.
- The order screen gets an editable pre-chemo checklist, a staff picker for the second verifier, a working **Resume** for held orders, and shows the server's reason when an action is refused.
