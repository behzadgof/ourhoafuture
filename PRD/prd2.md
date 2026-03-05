Implement “Summary-Only Mode” across the site.

Rules:
- Do NOT host or link publicly to raw HOA documents (PDFs, invoices, emails, bank statements).
- Do NOT include personal identifying info.
- Documents page must be a “Reference Library” (titles + where residents can find them), not file hosting.

Update the site as follows:

1) Financial page (pages/financial.html)
- Rename the anomaly table to “Budget Observations (Summary)”
- Columns must be summary-only:
  category, period, prior_total, current_total, change, notes, source_reference
- Remove any “source_url” link and replace with plain text “source_reference” such as:
  “HOA portal: 2025 Adopted Budget”
  “Management response: 2025-01-12”
- Add a short note at top:
  “This page summarizes high-level figures. Supporting records are available to residents via official association channels.”

2) Projects page (pages/projects.html)
- Show summary-only project rows:
  project_name, period, stated_total, total_estimated, variance, notes, source_reference
- No invoice details.
- Add a “Method” expandable section:
  “Stated totals are based on board/management communications; total estimates are based on recorded totals available to residents.”

3) Legal page (pages/legal.html)
- Summary only:
  period, total_legal_expense, notes, source_reference
- Add a callout:
  “This is a high-level summary of legal/admin totals reflected in association records.”

4) Documents page (pages/documents.html)
- Convert to “Resident Reference Library” that lists:
  title, category, date, where_to_find (e.g., “HOA Portal > Documents > Budgets”), description
- Add filters + search, but no URLs to hosted docs.
- Add a “How to access records” section.

5) Data files
Replace existing CSV formats:
- data/budget_anomalies.csv header:
  category,period,prior_total,current_total,change,notes,source_reference
- data/projects.csv header:
  project_name,period,stated_total,total_estimated,variance,notes,source_reference
- data/legal_expenses.csv header:
  period,total_legal_expense,notes,source_reference
- data/documents.csv header:
  title,category,date,where_to_find,description

6) Rendering
- Update assets/js/site.js CSV rendering to support the new headers.
- Keep filtering + sorting.
- Currency-format numeric totals.

7) Site-wide disclaimer
Add to footer on all pages:
“Disclaimer: This site provides high-level summaries and analysis for informational purposes. No confidential personal information is published. Supporting records referenced are available to residents through official association channels.”

Proceed to implement these changes now.