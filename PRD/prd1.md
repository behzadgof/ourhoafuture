# OurHOAFuture.com — Transparency Portal Integration Spec (GitHub Pages)

Goal:
Turn the existing static site into a structured “financial transparency portal” for Turnberry on the Green residents. Keep it factual, neutral, document-backed. No inflammatory language. GitHub Pages compatible (static only).

Repo structure (target):
/
  index.html
  pages/
    financial.html
    projects.html
    legal.html
    documents.html
    about.html
    espanol.html
  assets/
    css/site.css
    js/site.js
    img/
  data/
    budget_anomalies.csv
    projects.csv
    legal_expenses.csv
    documents.csv

Requirements:
1) Implement a shared JS module (assets/js/site.js) with:
   - CSV loader (fetch + parse)
   - utility formatters:
       - formatCurrency(number)
       - formatPercent(number)
       - safeLink(url)
   - simple client-side filtering & sorting for tables
   - no external libraries; pure vanilla JS

2) Financial Analysis page (pages/financial.html)
   - Add 3 sections:
     A) "Budget Overview" (summary cards)
        - Total anomalies count
        - Top 3 largest changes (absolute)
        - Last updated date (from CSV column updated_at if present; else show "Updated: (today’s date is not required)")
     B) "Budget Anomalies" (table)
        - Render from data/budget_anomalies.csv
        - Columns:
            category
            period (optional)
            prior
            current
            change
            change_pct (optional)
            notes
            source_url
        - Features:
            - Search box (filters rows across category + notes)
            - Sort dropdown: Change (desc), Change (asc), Category (A–Z)
            - Toggle: show only "High Impact" (if severity column exists)
        - Format prior/current/change as currency if numeric
        - Render source_url as “View source” link when present and valid
     C) "Charts" (simple placeholders)
        - Do not build real charts yet; create containers and titles:
          "Budget by Category (Top Changes)"
          "Legal Expenses Trend"
          "Project Costs Overview"
        - Make sure layout looks good on mobile (stack)

3) Project Reviews page (pages/projects.html)
   - Render a projects table from data/projects.csv with:
       project_name
       date (optional)
       stated_amount
       additional_amount
       total_amount
       vendor (optional)
       notes
       source_url
   - Features:
       - Search and sort (Total desc/asc)
       - Each project row can expand (details) or link to a dedicated anchor
   - Include a “Garage Repair” spotlight card at the top if a row exists with project_name containing "Garage"

4) Legal & Admin page (pages/legal.html)
   - Render table from data/legal_expenses.csv:
       year_or_period
       amount
       vendor_or_firm (optional)
       notes
       source_url
   - Features:
       - Total sum for visible rows (display above table)
       - Search + sort by amount
       - Neutral framing text:
         "This page summarizes documented legal and administrative expenses with links to supporting records."

5) Documents & Records page (pages/documents.html)
   - Render a document library from data/documents.csv:
       title
       category (Budget, Contract, Invoice, Meeting Minutes, Notice, Other)
       date (optional)
       url
       description (optional)
   - UI:
       - Category filter chips (Budget/Contracts/Invoices/Minutes/Notices/Other)
       - Search box
       - Each item shows title + description + “Open” link
   - IMPORTANT: Avoid hosting sensitive data; provide a “Redaction guidance” note:
       "Documents may be redacted to remove personal info."

6) Home page (index.html)
   - Keep current hero, but add:
       - “Latest Updates” section pulling top 3 rows from budget_anomalies.csv (largest absolute change) OR from a new data/updates.csv if you choose.
   - Add three CTA buttons:
       Financial Analysis, Project Reviews, Documents

7) Español page (pages/espanol.html)
   - Create a Spanish summary page that links to the main analysis pages.
   - Keep it simple; no need to fully translate all tables yet.

Data specs (CSV formats):
A) data/budget_anomalies.csv
   Required header (minimum):
     category,prior,current,change,notes,source_url
   Optional columns:
     period,change_pct,severity,updated_at
   Data rules:
     - numeric columns should be raw numbers (no $ or commas) if possible
     - wrap text containing commas in quotes

B) data/projects.csv
   Required header:
     project_name,stated_amount,additional_amount,total_amount,notes,source_url
   Optional:
     date,vendor,category

C) data/legal_expenses.csv
   Required header:
     period,amount,notes,source_url
   Optional:
     vendor_or_firm,category

D) data/documents.csv
   Required header:
     title,category,url,description
   Optional:
     date

Implementation details:
- Add assets/js/site.js and reference it from all pages.
- Keep consistent header/nav/footer across pages.
- Ensure GitHub Pages relative paths work: use paths like ../assets/js/site.js inside /pages/*.html.
- Make table rendering accessible (thead, tbody).
- Make mobile friendly:
    - On small screens, tables should scroll horizontally (wrap in a div with overflow-x auto).
- Keep styling in assets/css/site.css; minimal inline styles.

Content tone:
- Neutral, factual, document-backed.
- Avoid personal attacks.
- Use “documented”, “summarized”, “as reflected in records”, “supporting documents linked”.

Deliverables:
- Updated pages/*.html for Financial/Projects/Legal/Documents/Home hooks
- assets/js/site.js
- Updated CSS for table filters, chips, summary cards
- New CSV templates in /data with 3 sample rows each (so site works immediately)

After implementation:
- Ensure all pages render locally by opening index.html and navigating.
- Ensure the GitHub Pages site works with correct relative links.

Proceed now: implement everything above.