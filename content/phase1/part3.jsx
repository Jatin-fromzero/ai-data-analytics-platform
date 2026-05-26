"use client";
// @ts-nocheck
import { useState } from "react";

// ─── QUIZ DATA ────────────────────────────────────────────────
const quizQuestions = [
  {
    q: "You need to look up a customer's email using their ID from another table. The ID might not be in the first column. Which function should you use?",
    options: ["VLOOKUP", "HLOOKUP", "XLOOKUP", "INDEX/MATCH"],
    answer: 2,
    explanation: "XLOOKUP is the modern replacement for VLOOKUP. It searches any column (not just the first), returns a value from any direction, and handles errors gracefully with its [if_not_found] argument. Always prefer XLOOKUP in 2025."
  },
  {
    q: "Your dataset has 12,000 rows of sales transactions. You want to see total revenue broken down by Region AND Product Category simultaneously. What's the fastest tool?",
    options: ["A series of SUMIF formulas", "A PivotTable", "Manual filtering + SUM", "COUNTIF"],
    answer: 1,
    explanation: "PivotTables summarize massive datasets in seconds with drag-and-drop. No formulas needed. You can cross-tabulate multiple dimensions (Region × Product) instantly — what would take hours with formulas takes 30 seconds with a PivotTable."
  },
  {
    q: "=SUMIFS(C2:C1000, A2:A1000, \"North\", B2:B1000, \"Q4\") — What does this formula do?",
    options: [
      "Counts all rows where Region is North OR Quarter is Q4",
      "Sums revenue only where Region = North AND Quarter = Q4",
      "Averages values in column C",
      "Returns an error — SUMIFS needs only one condition"
    ],
    answer: 1,
    explanation: "SUMIFS sums a range based on MULTIPLE conditions (all must be true — AND logic). This formula sums column C only where column A = 'North' AND column B = 'Q4'. It's one of the most powerful analytical functions in Excel."
  },
  {
    q: "You paste data from a CRM and the 'Date' column shows dates as text: '15-Jan-2024'. Formulas using this column return errors. What should you do FIRST?",
    options: [
      "Delete the column and re-enter dates manually",
      "Use Text to Columns or DATEVALUE() to convert text to proper date values",
      "Use COUNTIF to count the dates",
      "Apply a date format to the cells"
    ],
    answer: 1,
    explanation: "Dates stored as text are one of the most common data quality issues. 'Text to Columns' (Data tab) or the DATEVALUE() function converts text dates to Excel serial numbers that formulas can calculate with. Formatting alone won't fix it."
  },
  {
    q: "What is the key difference between a regular Excel chart and a PivotChart?",
    options: [
      "PivotCharts can only show bar charts",
      "PivotCharts are linked to a PivotTable and update dynamically when filters or slicers change",
      "Regular charts update automatically; PivotCharts need manual refresh",
      "There is no difference"
    ],
    answer: 1,
    explanation: "PivotCharts are directly connected to their PivotTable. When you filter, slice, or drill down in the PivotTable, the chart updates instantly. This makes them the foundation of interactive Excel dashboards."
  },
  {
    q: "Microsoft Copilot in Excel can do which of the following?",
    options: [
      "Only format cells and change colors",
      "Generate charts, write complex formulas, identify trends, and add calculated columns — all from plain English prompts",
      "Replace Excel entirely — you don't need to know Excel if you have Copilot",
      "Only works with data under 100 rows"
    ],
    answer: 1,
    explanation: "Excel Copilot can generate PivotTables, suggest charts, write DAX-style formulas, highlight insights, and add new columns — from natural language. But you still need to understand Excel to validate its output and guide it effectively."
  },
];

// ─── CONTENT DATA ─────────────────────────────────────────────

const coreFormulas = [
  {
    name: "XLOOKUP", category: "Lookup", color: "#4FC3F7",
    syntax: "=XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found])",
    replaces: "VLOOKUP, HLOOKUP, INDEX/MATCH",
    whatItDoes: "Searches for a value in one range and returns the corresponding value from another range. Works in any direction — left, right, up, down.",
    businessUse: "Match customer IDs to names, look up product prices from a price table, find manager names for each employee.",
    example: {
      desc: "Find the email address for Customer ID 'C-1042' from a customer master table:",
      formula: '=XLOOKUP("C-1042", CustomerTable[ID], CustomerTable[Email], "Not Found")',
      notes: "The [if_not_found] argument prevents #N/A errors — returns 'Not Found' instead."
    },
    vsOld: "VLOOKUP breaks if you insert a column. XLOOKUP references columns by name — insert all the columns you want.",
    aiPrompt: '"Write an XLOOKUP formula to find the unit price from Sheet2 column B, matching by product SKU in Sheet2 column A, using the SKU in cell A2. Return 0 if not found."',
  },
  {
    name: "SUMIFS", category: "Aggregate", color: "#81C784",
    syntax: "=SUMIFS(sum_range, criteria_range1, criteria1, [criteria_range2, criteria2], ...)",
    replaces: "SUMIF (single condition only)",
    whatItDoes: "Sums a range based on MULTIPLE conditions — all conditions must be TRUE simultaneously (AND logic).",
    businessUse: "Total revenue for a specific region AND product AND quarter. Count orders above $500 from a specific channel.",
    example: {
      desc: "Sum revenue where Region = 'North' AND Quarter = 'Q4' AND Sales Rep = 'Alice':",
      formula: '=SUMIFS(Revenue, Region, "North", Quarter, "Q4", SalesRep, "Alice")',
      notes: "Stack as many conditions as needed. Each pair = one filter applied simultaneously."
    },
    vsOld: "SUMIF only handles one condition. SUMIFS handles unlimited conditions.",
    aiPrompt: '"Write a SUMIFS formula to calculate total sales in column D, where column A = \'Online\' and column B is between dates in E1 and E2."',
  },
  {
    name: "COUNTIFS", category: "Aggregate", color: "#FFD54F",
    syntax: "=COUNTIFS(criteria_range1, criteria1, [criteria_range2, criteria2], ...)",
    replaces: "COUNTIF (single condition)",
    whatItDoes: "Counts rows that meet MULTIPLE criteria simultaneously. The counting version of SUMIFS.",
    businessUse: "Count customers who are in Region = West AND Status = Active AND Age > 30.",
    example: {
      desc: "Count orders where Status = 'Returned' AND Value > 1000:",
      formula: '=COUNTIFS(Status, "Returned", OrderValue, ">"&1000)',
      notes: 'For numeric comparisons, wrap operator in quotes: ">"&1000 or use ">1000"'
    },
    vsOld: "COUNTIF is limited to one condition. Real analysis always has multiple filters.",
    aiPrompt: '"Write a COUNTIFS formula to count how many employees have Department = \'Marketing\', Salary > 60000, and Start Date after 2022."',
  },
  {
    name: "INDEX / MATCH", category: "Lookup", color: "#FF8A65",
    syntax: "=INDEX(return_range, MATCH(lookup_val, lookup_range, 0))",
    replaces: "Complex VLOOKUP workarounds",
    whatItDoes: "The power-user lookup. INDEX returns a value at a position; MATCH finds the position. Combined: look up anything, anywhere.",
    businessUse: "Two-way lookup (row AND column), return value left of lookup column, dynamic range selection.",
    example: {
      desc: "Find Q3 sales for 'Product X' from a matrix where products are rows and quarters are columns:",
      formula: '=INDEX(SalesMatrix, MATCH("Product X", ProductList, 0), MATCH("Q3", QuarterList, 0))',
      notes: "This is a 2D lookup — XLOOKUP can't do this natively. INDEX/MATCH still wins for matrix lookups."
    },
    vsOld: "XLOOKUP covers 90% of use cases. Keep INDEX/MATCH for two-dimensional and advanced lookups.",
    aiPrompt: '"Write an INDEX/MATCH formula to find the sales figure at the intersection of a specific product row and quarter column in a named table called SalesMatrix."',
  },
  {
    name: "IF / IFS / IFERROR", category: "Logic", color: "#CE93D8",
    syntax: "=IF(condition, value_if_true, value_if_false)",
    replaces: "Nothing — logic is fundamental",
    whatItDoes: "IF evaluates a condition and returns different values based on TRUE/FALSE. IFS handles multiple conditions cleanly. IFERROR catches formula errors.",
    businessUse: "Classify customers (High/Mid/Low value), flag overdue invoices, segment products by margin tier, handle lookup errors gracefully.",
    example: {
      desc: "Classify customers into tiers based on annual spend:",
      formula: '=IFS(Spend>=10000,"Platinum", Spend>=5000,"Gold", Spend>=1000,"Silver", TRUE,"Bronze")',
      notes: "IFS is cleaner than nesting multiple IF statements. Always end with TRUE as the catch-all."
    },
    vsOld: "Nested IF formulas become unreadable. IFS is cleaner. Always wrap error-prone formulas in IFERROR.",
    aiPrompt: '"Write an IFS formula to categorize NPS scores: 9-10 = Promoter, 7-8 = Passive, 0-6 = Detractor. Handle blanks with IFERROR."',
  },
  {
    name: "TEXT Functions", category: "Cleaning", color: "#F48FB1",
    syntax: "TRIM, UPPER, LOWER, LEN, LEFT, RIGHT, MID, SUBSTITUTE, TEXTJOIN",
    replaces: "Manual text editing",
    whatItDoes: "Transform, clean, and parse text data. Essential for cleaning messy imported data from CRMs, ERPs, and web exports.",
    businessUse: "Remove extra spaces from names, extract area codes from phone numbers, combine first + last name, fix inconsistent capitalisation.",
    example: {
      desc: "Clean a messy name column: remove spaces, fix capitalisation, combine first + last:",
      formula: '=PROPER(TRIM(A2))&" "&PROPER(TRIM(B2))',
      notes: "TRIM removes leading/trailing/extra spaces. PROPER capitalises First Letter Of Each Word."
    },
    vsOld: "Manual editing of 10,000 rows takes hours. These functions run in milliseconds.",
    aiPrompt: '"Write a formula to extract the domain name from an email address in cell A2 (e.g., from name@company.com return company.com)."',
  },
];

const pivotSteps = [
  { step: "01", title: "Prepare your data", desc: "Data must have headers in row 1, no blank rows or columns, no merged cells. Each column = one field. Each row = one record.", tip: "Press Ctrl+T to convert your range to an Excel Table first — PivotTables built on Tables update automatically when new data is added.", color: "#4FC3F7" },
  { step: "02", title: "Insert → PivotTable", desc: "Select any cell in your data → Insert tab → PivotTable → New Worksheet. Excel detects your data range automatically.", tip: "Always place PivotTables on a new sheet to keep your raw data clean and separate.", color: "#81C784" },
  { step: "03", title: "Drag fields to areas", desc: "The Field List has 4 areas: Filters (top-level filter), Columns (horizontal categories), Rows (vertical categories), Values (what you're measuring).", tip: "Start with one field in Rows and Revenue in Values. Then add complexity. Don't build everything at once.", color: "#FFD54F" },
  { step: "04", title: "Change value calculation", desc: "By default, Values shows SUM. Right-click any value → Value Field Settings to change to COUNT, AVERAGE, MAX, MIN, % of Total, Running Total, etc.", tip: "'Show Values As → % of Column Total' instantly creates percentage breakdowns without any formulas.", color: "#FF8A65" },
  { step: "05", title: "Add Slicers for interactivity", desc: "PivotTable Analyze tab → Insert Slicer. Slicers are visual, clickable filters. Connect one slicer to multiple PivotTables for dashboard-level filtering.", tip: "Right-click a Slicer → Report Connections → connect to multiple PivotTables at once. This is how professional Excel dashboards work.", color: "#CE93D8" },
  { step: "06", title: "Insert PivotChart", desc: "PivotTable Analyze → PivotChart. The chart stays linked — when you filter the PivotTable, the chart updates automatically.", tip: "Use Combo charts (bar + line) to show revenue bars AND growth % line on the same chart. Looks professional, communicates more.", color: "#F48FB1" },
];

const cleaningTechniques = [
  {
    problem: "Duplicate rows", color: "#FF8A65",
    symptom: "Customer appears twice, sales double-counted, row count doesn't match source system",
    fix: "Data tab → Remove Duplicates. Select which columns define uniqueness (e.g., Order ID + Customer ID).",
    formula: "=COUNTIFS(A:A, A2, B:B, B2) — flag rows where count > 1 before deleting",
    copilotPrompt: '"Find and highlight all duplicate rows in this dataset based on Customer ID and Order Date."',
  },
  {
    problem: "Blank / missing values", color: "#FFD54F",
    symptom: "AVERAGE returns wrong result, COUNTIF misses rows, lookups fail on blank key fields",
    fix: "Select column → F5 → Special → Blanks → fills selection. Or: IFERROR/IF(A2='','N/A', A2). Decide: delete, fill forward, or flag.",
    formula: '=IF(A2="", "MISSING", A2) — flag blanks with visible label for review',
    copilotPrompt: '"Identify all blank cells in column C and fill them with the value \'Unknown\'."',
  },
  {
    problem: "Dates stored as text", color: "#81C784",
    symptom: "Date math returns errors, MONTH() returns #VALUE!, dates won't sort chronologically",
    fix: "Data tab → Text to Columns → Delimited → none → Date format. Or: =DATEVALUE(A2) to convert.",
    formula: "=ISNUMBER(A2) — returns FALSE if date is stored as text (text = not a number)",
    copilotPrompt: '"Convert all dates in column B from text format DD-Mon-YYYY to proper Excel date values."',
  },
  {
    problem: "Inconsistent text / typos", color: "#CE93D8",
    symptom: "'London', 'london', 'LONDON' treated as 3 different cities. PivotTable shows 3 separate rows.",
    fix: "PROPER() or UPPER() to normalise case. SUBSTITUTE() to fix specific typos. Find & Replace for bulk corrections.",
    formula: '=SUBSTITUTE(UPPER(TRIM(A2)), "  ", " ") — uppercase, trim, remove double spaces',
    copilotPrompt: '"Find all variations of the city name \'New York\' (including \'new york\', \'NY\', \'N.Y.\') and standardise them to \'New York\'."',
  },
  {
    problem: "Numbers stored as text", color: "#4FC3F7",
    symptom: "SUM returns 0, values have a green triangle, numbers left-aligned instead of right-aligned",
    fix: "Paste a blank cell with value 1, Copy → Paste Special → Multiply. Or: =VALUE(A2). Or: Data → Text to Columns → Finish.",
    formula: "=ISNUMBER(A2) — FALSE confirms it's text. =VALUE(A2) converts it.",
    copilotPrompt: '"Convert the Sales column from text to numbers and recalculate the total."',
  },
  {
    problem: "Extra whitespace", color: "#F48FB1",
    symptom: "XLOOKUP can't find 'Alice ' (note trailing space). EXACT() returns FALSE for visually identical values.",
    fix: "=TRIM(A2) removes leading, trailing, and internal double spaces. Apply to entire column.",
    formula: "=LEN(A2) vs =LEN(TRIM(A2)) — if different, there are hidden spaces",
    copilotPrompt: '"Clean the Customer Name column by removing all leading, trailing, and extra spaces."',
  },
];

const dashboardPrinciples = [
  { num: "01", title: "One screen, one story", desc: "A dashboard should answer one clear business question. 'How is sales performing this month?' — everything on the page supports that. Dashboards that try to show everything show nothing.", color: "#4FC3F7" },
  { num: "02", title: "KPIs at the top", desc: "The most important numbers go top-left — that's where eyes land first. Show 3–5 headline KPIs (Revenue, Growth %, Units Sold, Conversion Rate) as large bold numbers before any charts.", color: "#81C784" },
  { num: "03", title: "Hierarchy: summary → detail", desc: "Top = summary KPIs. Middle = trend charts. Bottom = detailed tables. Users should be able to grasp the story in 10 seconds, then drill down if needed.", color: "#FFD54F" },
  { num: "04", title: "Slicers, not separate tabs", desc: "A great dashboard has one view with slicers for Region, Time Period, Product, etc. — not 10 separate tabs. Slicers let the user self-serve without being overwhelmed.", color: "#FF8A65" },
  { num: "05", title: "Colour with purpose", desc: "Use colour to signal meaning — red = bad/alert, green = good, grey = neutral/context. Don't use 12 colours just to look colourful. Every colour should mean something.", color: "#CE93D8" },
  { num: "06", title: "Remove chart junk", desc: "Delete gridlines, borders, 3D effects, unnecessary legends, and chart titles that just repeat the axis. Every element must earn its place. White space is not wasted space.", color: "#F48FB1" },
];

const copilotFeatures = [
  {
    feature: "Formula Generation", icon: "⚡", color: "#4FC3F7",
    what: "Describe what you want in English — Copilot writes the formula and explains it",
    prompts: [
      '"Write a formula to calculate the year-over-year growth % comparing column B (this year) to column C (last year)"',
      '"Create a formula to flag orders where the discount > 20% AND the quantity > 100"',
      '"Write an XLOOKUP to get the manager name from the Employees table matching on Employee ID in column A"',
    ],
    warning: "Always review the formula before pressing Enter. Copilot can misunderstand table structure — verify range references."
  },
  {
    feature: "Instant PivotTable Creation", icon: "📊", color: "#81C784",
    what: "Tell Copilot what analysis you need — it builds the PivotTable, selects the fields, and applies the right calculation",
    prompts: [
      '"Create a PivotTable showing total revenue by Region and Product Category"',
      '"Show me the top 10 customers by total spend this year"',
      '"Build a monthly trend PivotTable showing sales count and average order value"',
    ],
    warning: "Copilot builds the structure but may not apply formatting or sorting as you'd expect. Refine manually."
  },
  {
    feature: "Data Insights & Anomaly Detection", icon: "🔍", color: "#FFD54F",
    what: "Ask Copilot to summarise your dataset, find outliers, spot trends, and flag unexpected patterns",
    prompts: [
      '"What are the 3 most important insights from this sales dataset?"',
      '"Are there any anomalies or outliers in the revenue column I should investigate?"',
      '"Which product category is underperforming compared to last quarter?"',
    ],
    warning: "Treat AI-generated insights as a starting point, not a conclusion. Verify each one against the raw data."
  },
  {
    feature: "Add Calculated Columns", icon: "➕", color: "#FF8A65",
    what: "Ask Copilot to add new derived columns to your table without writing formulas yourself",
    prompts: [
      '"Add a column called Profit Margin that calculates (Revenue - Cost) / Revenue as a percentage"',
      '"Add a column that categorises customers as High, Medium, or Low value based on their total spend"',
      '"Add a column showing how many days between Order Date and Delivery Date"',
    ],
    warning: "Check that the formula applied to the new column is correct for every row — test edge cases (nulls, zeros, dates)."
  },
  {
    feature: "Chart Suggestions", icon: "📈", color: "#CE93D8",
    what: "Copilot recommends the best chart type for your data and creates it — then explains why that chart works",
    prompts: [
      '"What chart type best shows my monthly revenue trend over 2 years?"',
      '"Create a chart comparing sales performance across regions with a benchmark line for the company average"',
      '"Suggest the best way to visualise the relationship between marketing spend and revenue"',
    ],
    warning: "Copilot defaults to common charts. For specialised charts (waterfall, Sankey, heatmap), you may need to build manually."
  },
  {
    feature: "Natural Language Data Q&A", icon: "💬", color: "#F48FB1",
    what: "Ask questions about your spreadsheet in plain English — like chatting with a data analyst who lives in Excel",
    prompts: [
      '"What was the best-performing month last year?"',
      '"Which sales rep had the highest average deal size in Q3?"',
      '"How does our North region compare to South in terms of units sold?"',
    ],
    warning: "For complex multi-step questions, Copilot may give oversimplified answers. Combine with your own PivotTable analysis."
  },
];

const sections = [
  { id: "intro", label: "Overview" },
  { id: "formulas", label: "Core Formulas" },
  { id: "pivot", label: "PivotTables" },
  { id: "cleaning", label: "Data Cleaning" },
  { id: "dashboard", label: "Dashboards" },
  { id: "copilot", label: "🤖 Excel Copilot" },
  { id: "workflow", label: "AI Workflow" },
  { id: "quiz", label: "🧠 Quiz" },
];

// ─── MAIN COMPONENT ───────────────────────────────────────────
export default function Phase1Part3() {
  const [activeSection, setActiveSection] = useState("intro");
  const [expanded, setExpanded] = useState(null);
  const [expandedPivot, setExpandedPivot] = useState(null);
  const [expandedClean, setExpandedClean] = useState(null);
  const [expandedCopilot, setExpandedCopilot] = useState(null);
  const [expandedDash, setExpandedDash] = useState(null);
  const [quizState, setQuizState] = useState({ idx: 0, selected: null, answered: false, score: 0, done: false });

  const handleAnswer = (i) => {
    if (quizState.answered) return;
    const correct = i === quizQuestions[quizState.idx].answer;
    setQuizState(s => ({ ...s, selected: i, answered: true, score: s.score + (correct ? 1 : 0) }));
  };
  const nextQ = () => {
    const next = quizState.idx + 1;
    if (next >= quizQuestions.length) setQuizState(s => ({ ...s, done: true }));
    else setQuizState(s => ({ ...s, idx: next, selected: null, answered: false }));
  };

  return (
    <div style={{ minHeight: "100vh", background: "#07070E", color: "#DDD8F0", fontFamily: "Georgia, 'Times New Roman', serif" }}>

      {/* TOP NAV */}
      <div style={{ background: "#0A0A14", borderBottom: "1px solid #16162A", padding: "0 24px", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", overflowX: "auto" }}>
          <div style={{ fontSize: 10, color: "#217346", letterSpacing: "0.22em", textTransform: "uppercase", padding: "14px 20px 14px 0", borderRight: "1px solid #1A1A2E", marginRight: 12, whiteSpace: "nowrap" }}>
            P1 · PART 3
          </div>
          {sections.map(s => (
            <button key={s.id} onClick={() => setActiveSection(s.id)} style={{
              background: "none", border: "none", cursor: "pointer",
              padding: "14px 13px", fontFamily: "inherit",
              fontSize: 11, letterSpacing: "0.07em",
              color: activeSection === s.id ? "#4ade80" : "#444",
              borderBottom: activeSection === s.id ? "2px solid #4ade80" : "2px solid transparent",
              transition: "all 0.2s", whiteSpace: "nowrap",
            }}>{s.label}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px 100px" }}>

        {/* ── INTRO ── */}
        {activeSection === "intro" && (
          <div>
            <div style={{ marginBottom: 56, borderLeft: "3px solid #4ade80", paddingLeft: 24 }}>
              <div style={{ fontSize: 10, color: "#4ade80", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 12 }}>
                PHASE 1 · PART 3 OF 4 · WEEK 3
              </div>
              <h1 style={{ fontSize: "clamp(26px,5vw,44px)", fontWeight: 900, margin: "0 0 16px", lineHeight: 1.15, letterSpacing: "-0.02em" }}>
                Excel for<br />
                <span style={{ color: "#4ade80" }}>Data Analytics</span><br />
                <span style={{ fontStyle: "italic", fontWeight: 400, fontSize: "0.68em", color: "#555" }}>+ Microsoft Copilot AI</span>
              </h1>
              <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, maxWidth: 560, margin: "0 0 24px" }}>
                Excel is still used in 90%+ of companies worldwide. Before Python, before SQL, before Tableau — there's Excel. In this part you'll master the formulas, PivotTables, data cleaning techniques, and dashboard skills every analyst needs, then layer in Microsoft Copilot to 10× your speed.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {["~4 hours", "6 core formulas", "PivotTables", "Data Cleaning", "Dashboard design", "Microsoft Copilot", "6-question quiz"].map(tag => (
                  <span key={tag} style={{ padding: "4px 12px", background: "rgba(74,222,128,0.07)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: 2, fontSize: 11, color: "#4ade80" }}>{tag}</span>
                ))}
              </div>
            </div>

            {/* Content map */}
            <SectionHeader num="00" title="What You'll Master in Part 3" color="#4ade80" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10, margin: "24px 0 36px" }}>
              {[
                { icon: "⚡", title: "6 Core Formulas", desc: "XLOOKUP, SUMIFS, COUNTIFS, INDEX/MATCH, IFS, Text functions — the analyst's daily toolkit", color: "#4FC3F7", section: "formulas" },
                { icon: "📊", title: "PivotTables", desc: "Summarise 100k rows in 30 seconds. Step-by-step from raw data to interactive summary", color: "#81C784", section: "pivot" },
                { icon: "🧹", title: "Data Cleaning", desc: "Fix duplicates, blanks, text-as-dates, typos, and whitespace — the 60% of real analyst work", color: "#FFD54F", section: "cleaning" },
                { icon: "📈", title: "Dashboard Design", desc: "6 principles of professional Excel dashboards that impress stakeholders and get promoted", color: "#FF8A65", section: "dashboard" },
                { icon: "🤖", title: "Microsoft Copilot", desc: "6 Copilot features with exact prompts: formulas, PivotTables, insights, columns, charts, Q&A", color: "#CE93D8", section: "copilot" },
                { icon: "🔄", title: "AI Workflow", desc: "The full Copilot-first workflow — how to combine AI speed with human judgment", color: "#4ade80", section: "workflow" },
              ].map((item, i) => (
                <div key={i} onClick={() => setActiveSection(item.section)} style={{
                  border: `1px solid ${item.color}33`, borderTop: `3px solid ${item.color}`,
                  borderRadius: 4, padding: "16px", background: "#0D0D18",
                  cursor: "pointer", transition: "background 0.2s",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = `${item.color}08`}
                  onMouseLeave={e => e.currentTarget.style.background = "#0D0D18"}
                >
                  <div style={{ fontSize: 22, marginBottom: 10 }}>{item.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#DDD8F0", marginBottom: 6 }}>{item.title}</div>
                  <div style={{ fontSize: 12, color: "#444", lineHeight: 1.6 }}>{item.desc}</div>
                </div>
              ))}
            </div>

            <Callout icon="💼" color="#4ade80" title="Why Excel Is Still Essential in 2025">
              "Just use Python" is wrong advice for most junior analyst roles. 78% of job postings for Data Analyst roles list Excel as a required skill. Most non-technical stakeholders live in Excel. Your dashboards, your ad-hoc analyses, your data exports — Excel is the universal language of business data. Master it first.
            </Callout>
            <NavButtons onNext={() => setActiveSection("formulas")} />
          </div>
        )}

        {/* ── CORE FORMULAS ── */}
        {activeSection === "formulas" && (
          <div>
            <SectionHeader num="01" title="6 Core Excel Formulas for Analysts" color="#4FC3F7" />
            <Prose>
              You don't need to know every Excel function — you need to know the <Highlight>20% that does 80% of the analytical work</Highlight>. These six formulas (and their families) cover the vast majority of what real analysts use daily. Master these and you can handle almost any Excel task on day one of a new job.
            </Prose>

            <Callout icon="🤖" color="#CE93D8" title="Copilot Shortcut for Every Formula">
              For every formula in this section, you can prompt Excel Copilot or ChatGPT: <em style={{ color: "#CE93D8" }}>"Write a [formula name] to [what you want to do]. My data is in [describe columns]."</em> — then read the output and understand it. The goal: understand the formula well enough to verify and modify what AI generates.
            </Callout>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, margin: "28px 0" }}>
              {coreFormulas.map((f, i) => {
                const open = expanded === `f-${i}`;
                return (
                  <div key={i} style={{ border: `1px solid ${open ? f.color + "55" : "#1A1A2E"}`, borderRadius: 4, overflow: "hidden" }}>
                    <button onClick={() => setExpanded(open ? null : `f-${i}`)} style={{
                      width: "100%", background: open ? `${f.color}0A` : "#0D0D18",
                      border: "none", cursor: "pointer", padding: "16px 20px",
                      display: "flex", alignItems: "center", gap: 16,
                      fontFamily: "inherit", textAlign: "left",
                    }}>
                      <div style={{ width: 48, height: 32, borderRadius: 3, background: `${f.color}18`, border: `1px solid ${f.color}33`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ fontSize: 9, color: f.color, fontFamily: "monospace", fontWeight: 700, letterSpacing: "0.05em" }}>{f.category}</span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: "#DDD8F0" }}>{f.name}</div>
                        {!open && <div style={{ fontSize: 12, color: "#555", marginTop: 2, fontFamily: "monospace" }}>{f.syntax.substring(0, 55)}...</div>}
                      </div>
                      <span style={{ color: f.color, fontSize: 20, fontWeight: 300, transform: open ? "rotate(45deg)" : "none", transition: "transform 0.2s" }}>+</span>
                    </button>

                    {open && (
                      <div style={{ padding: "0 20px 22px 20px", background: `${f.color}06` }}>
                        <div style={{ height: 1, background: `${f.color}22`, margin: "0 0 18px" }} />

                        {/* Syntax */}
                        <div style={{ background: "#07070E", border: `1px solid ${f.color}22`, borderRadius: 3, padding: "10px 14px", marginBottom: 16, overflowX: "auto" }}>
                          <div style={{ fontSize: 9, color: f.color, letterSpacing: "0.18em", fontFamily: "monospace", marginBottom: 6 }}>SYNTAX</div>
                          <code style={{ fontSize: 13, color: f.color, fontFamily: "monospace" }}>{f.syntax}</code>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
                          <div>
                            <Label color={f.color}>WHAT IT DOES</Label>
                            <p style={{ fontSize: 13, color: "#AAA", margin: "6px 0 0", lineHeight: 1.65 }}>{f.whatItDoes}</p>
                          </div>
                          <div>
                            <Label color={f.color}>BUSINESS USES</Label>
                            <p style={{ fontSize: 13, color: "#AAA", margin: "6px 0 0", lineHeight: 1.65 }}>{f.businessUse}</p>
                          </div>
                        </div>

                        {/* Example */}
                        <div style={{ border: `1px solid ${f.color}22`, borderRadius: 3, overflow: "hidden", marginBottom: 16 }}>
                          <div style={{ background: `${f.color}10`, padding: "8px 14px", borderBottom: `1px solid ${f.color}22` }}>
                            <Label color={f.color}>REAL EXAMPLE — {f.example.desc}</Label>
                          </div>
                          <div style={{ background: "#07070E", padding: "10px 14px" }}>
                            <code style={{ fontSize: 13, color: "#4ade80", fontFamily: "monospace", display: "block", marginBottom: 8 }}>{f.example.formula}</code>
                            <p style={{ fontSize: 12, color: "#555", margin: 0, fontStyle: "italic" }}>💡 {f.example.notes}</p>
                          </div>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                          <div style={{ background: "#07070E", border: "1px solid #1A1A2E", borderRadius: 3, padding: "10px 12px" }}>
                            <Label color="#888">VS OLD APPROACH</Label>
                            <p style={{ fontSize: 12, color: "#666", margin: "6px 0 0", lineHeight: 1.6 }}>{f.vsOld}</p>
                          </div>
                          <div style={{ background: "rgba(206,147,216,0.05)", border: "1px solid rgba(206,147,216,0.2)", borderRadius: 3, padding: "10px 12px" }}>
                            <Label color="#CE93D8">🤖 AI PROMPT</Label>
                            <p style={{ fontSize: 12, color: "#CE93D8", margin: "6px 0 0", lineHeight: 1.6, fontStyle: "italic" }}>{f.aiPrompt}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <Callout icon="⌨️" color="#4FC3F7" title="Keyboard Shortcuts That Save Hours">
              <span style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 24px", fontFamily: "monospace", fontSize: 12 }}>
                <span><strong style={{ color: "#4FC3F7" }}>Ctrl+T</strong> — Create Table</span>
                <span><strong style={{ color: "#4FC3F7" }}>Ctrl+Shift+L</strong> — Toggle filters</span>
                <span><strong style={{ color: "#4FC3F7" }}>Alt+H+O+I</strong> — Autofit columns</span>
                <span><strong style={{ color: "#4FC3F7" }}>Ctrl+Shift+$</strong> — Currency format</span>
                <span><strong style={{ color: "#4FC3F7" }}>F4</strong> — Lock cell reference ($A$1)</span>
                <span><strong style={{ color: "#4FC3F7" }}>Ctrl+`</strong> — Show all formulas</span>
              </span>
            </Callout>

            <NavButtons onPrev={() => setActiveSection("intro")} onNext={() => setActiveSection("pivot")} />
          </div>
        )}

        {/* ── PIVOTTABLES ── */}
        {activeSection === "pivot" && (
          <div>
            <SectionHeader num="02" title="PivotTables — The Analyst's Superpower" color="#81C784" />
            <Prose>
              If you learn only one Excel skill, make it PivotTables. A PivotTable lets you <Highlight>summarise, group, and cross-tabulate hundreds of thousands of rows in seconds — with zero formulas</Highlight>. Every analyst uses them daily. Interviewers test them. Stakeholders love the results.
            </Prose>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, margin: "24px 0 32px" }}>
              {[
                { stat: "100K+", label: "rows it handles effortlessly", color: "#4FC3F7" },
                { stat: "< 60s", label: "to build a full summary report", color: "#81C784" },
                { stat: "0", label: "formulas required to start", color: "#FFD54F" },
              ].map((s, i) => (
                <div key={i} style={{ border: `1px solid ${s.color}33`, borderRadius: 4, padding: "20px 16px", background: `${s.color}06`, textAlign: "center" }}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: s.color, marginBottom: 6 }}>{s.stat}</div>
                  <div style={{ fontSize: 12, color: "#666" }}>{s.label}</div>
                </div>
              ))}
            </div>

            <Subheading>Step-by-Step: Build Your First PivotTable</Subheading>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, margin: "20px 0 32px" }}>
              {pivotSteps.map((s, i) => {
                const open = expandedPivot === i;
                return (
                  <div key={i} style={{ border: `1px solid ${open ? s.color + "55" : "#1A1A2E"}`, borderRadius: 4, overflow: "hidden" }}>
                    <button onClick={() => setExpandedPivot(open ? null : i)} style={{
                      width: "100%", background: open ? `${s.color}08` : "#0D0D18",
                      border: "none", cursor: "pointer", padding: "14px 18px",
                      display: "flex", alignItems: "flex-start", gap: 14,
                      fontFamily: "inherit", textAlign: "left",
                    }}>
                      <div style={{ width: 30, height: 30, borderRadius: "50%", background: `${s.color}15`, border: `1px solid ${s.color}44`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ fontSize: 10, color: s.color, fontFamily: "monospace", fontWeight: 700 }}>{s.step}</span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#DDD8F0" }}>{s.title}</div>
                        {open && (
                          <>
                            <p style={{ fontSize: 13, color: "#888", lineHeight: 1.7, margin: "10px 0 12px" }}>{s.desc}</p>
                            <div style={{ display: "flex", gap: 8, alignItems: "flex-start", background: `${s.color}08`, border: `1px solid ${s.color}22`, borderRadius: 3, padding: "10px 12px" }}>
                              <span style={{ fontSize: 14 }}>💡</span>
                              <span style={{ fontSize: 12, color: s.color, lineHeight: 1.6 }}>{s.tip}</span>
                            </div>
                          </>
                        )}
                      </div>
                      <span style={{ color: s.color, fontSize: 16, transform: open ? "rotate(45deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }}>+</span>
                    </button>
                  </div>
                );
              })}
            </div>

            <Subheading>PivotTable Field Area Cheatsheet</Subheading>
            <div style={{ border: "1px solid #1A1A2E", borderRadius: 4, overflow: "hidden", margin: "16px 0 28px" }}>
              {[
                { area: "🔽 Filters", use: "Top-level filter for the entire table", example: "Year, Country — lets user select one value to focus the whole table", color: "#4FC3F7" },
                { area: "➡️ Columns", use: "Creates horizontal categories across the top", example: "Quarter (Q1 Q2 Q3 Q4), Gender, Product Size", color: "#81C784" },
                { area: "⬇️ Rows", use: "Creates vertical categories down the left", example: "Region, Product Name, Sales Rep, Date", color: "#FFD54F" },
                { area: "Σ Values", use: "The metric you're measuring — SUM by default", example: "Revenue, Orders, Units Sold — right-click to change to COUNT, AVERAGE, %", color: "#FF8A65" },
              ].map((row, i, arr) => (
                <div key={i} style={{
                  display: "flex", gap: 16, padding: "13px 18px",
                  borderBottom: i < arr.length - 1 ? "1px solid #0F0F18" : "none",
                  background: "#0A0A14", alignItems: "flex-start",
                }}>
                  <div style={{ width: 90, fontSize: 12, color: row.color, fontFamily: "monospace", fontWeight: 700, flexShrink: 0 }}>{row.area}</div>
                  <div style={{ flex: 1, fontSize: 13, color: "#888" }}>{row.use}</div>
                  <div style={{ fontSize: 12, color: "#444", maxWidth: 240, fontStyle: "italic", textAlign: "right" }}>{row.example}</div>
                </div>
              ))}
            </div>

            <Callout icon="🤖" color="#CE93D8" title="Excel Copilot for PivotTables">
              Select your data range and open Copilot sidebar. Type: <em style={{ color: "#CE93D8" }}>"Create a PivotTable showing total revenue by Region and Product Category, sorted by revenue descending, with a bar chart."</em> — Copilot builds the entire PivotTable and chart in one step. Then add slicers manually for interactivity.
            </Callout>

            <NavButtons onPrev={() => setActiveSection("formulas")} onNext={() => setActiveSection("cleaning")} />
          </div>
        )}

        {/* ── DATA CLEANING ── */}
        {activeSection === "cleaning" && (
          <div>
            <SectionHeader num="03" title="Data Cleaning in Excel" color="#FFD54F" />
            <Prose>
              <Highlight>60–80% of a real analyst's time is spent cleaning data</Highlight> — not analysing it. No dataset from a real business system arrives clean. CRM exports have duplicates. API responses have nulls. Finance dumps have numbers as text. Master these six cleaning scenarios and you'll handle 90% of what you encounter on the job.
            </Prose>

            <Callout icon="📐" color="#FFD54F" title="The Cleaning Mindset">
              Never clean directly on your raw data. Always: (1) Copy raw data to a new sheet. (2) Apply cleaning formulas in new columns. (3) Once validated, paste-as-values over the originals. This way, you can always go back to the source if something goes wrong.
            </Callout>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, margin: "28px 0" }}>
              {cleaningTechniques.map((t, i) => {
                const open = expandedClean === i;
                return (
                  <div key={i} style={{ border: `1px solid ${open ? t.color + "55" : "#1A1A2E"}`, borderRadius: 4, overflow: "hidden" }}>
                    <button onClick={() => setExpandedClean(open ? null : i)} style={{
                      width: "100%", background: open ? `${t.color}08` : "#0D0D18",
                      border: "none", cursor: "pointer", padding: "14px 20px",
                      display: "flex", alignItems: "center", gap: 14,
                      fontFamily: "inherit", textAlign: "left",
                    }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: t.color, flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#DDD8F0" }}>{t.problem}</div>
                        {!open && <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>{t.symptom.substring(0, 70)}...</div>}
                      </div>
                      <span style={{ color: t.color, fontSize: 18, fontWeight: 300, transform: open ? "rotate(45deg)" : "none", transition: "transform 0.2s" }}>+</span>
                    </button>
                    {open && (
                      <div style={{ padding: "0 20px 20px 42px", background: `${t.color}06` }}>
                        <div style={{ height: 1, background: `${t.color}22`, margin: "0 0 16px" }} />
                        <div style={{ marginBottom: 12 }}>
                          <Label color="#FF6464">SYMPTOM — HOW YOU KNOW YOU HAVE THIS PROBLEM</Label>
                          <p style={{ fontSize: 13, color: "#888", margin: "6px 0 0", lineHeight: 1.65 }}>{t.symptom}</p>
                        </div>
                        <div style={{ marginBottom: 12 }}>
                          <Label color={t.color}>FIX (Manual Approach)</Label>
                          <p style={{ fontSize: 13, color: "#AAA", margin: "6px 0 0", lineHeight: 1.65 }}>{t.fix}</p>
                        </div>
                        <div style={{ background: "#07070E", border: `1px solid ${t.color}22`, borderRadius: 3, padding: "10px 14px", marginBottom: 12 }}>
                          <Label color={t.color}>DIAGNOSTIC / FIX FORMULA</Label>
                          <code style={{ fontSize: 13, color: "#4ade80", fontFamily: "monospace", display: "block", marginTop: 6 }}>{t.formula}</code>
                        </div>
                        <div style={{ background: "rgba(206,147,216,0.05)", border: "1px solid rgba(206,147,216,0.2)", borderRadius: 3, padding: "10px 14px" }}>
                          <Label color="#CE93D8">🤖 COPILOT PROMPT</Label>
                          <p style={{ fontSize: 12, color: "#CE93D8", margin: "6px 0 0", fontStyle: "italic", lineHeight: 1.6 }}>{t.copilotPrompt}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <Subheading>Data Cleaning Checklist (Run This on Every New Dataset)</Subheading>
            <div style={{ border: "1px solid #1A1A2E", borderRadius: 4, overflow: "hidden", margin: "16px 0 28px" }}>
              {[
                "Check row count — does it match what the source says?",
                "Check column headers — are they clean, no special characters, no merged cells?",
                "Run: =COUNTBLANK(A:A) on each key column — flag any that return > 0",
                "Run: Data → Remove Duplicates — record how many were removed",
                "Check date columns: =ISNUMBER(A2) — should return TRUE for real dates",
                "Check numeric columns: are they right-aligned? Left = stored as text",
                "TRIM all text columns: look for leading/trailing space issues",
                "Standardise categorical columns: UPPER() or PROPER() + check for typo variants",
                "Check for outliers: =MAX(), =MIN(), sort descending and inspect top 10",
                "Document every change made — create a 'Cleaning Log' tab",
              ].map((item, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 16px",
                  borderBottom: i < 9 ? "1px solid #0F0F18" : "none",
                  background: i % 2 === 0 ? "#0A0A14" : "#080811",
                }}>
                  <span style={{ fontSize: 11, color: "#555", fontFamily: "monospace", minWidth: 22, marginTop: 2 }}>{String(i + 1).padStart(2, "0")}</span>
                  <span style={{ fontSize: 13, color: "#888", lineHeight: 1.6 }}>{item}</span>
                </div>
              ))}
            </div>

            <NavButtons onPrev={() => setActiveSection("pivot")} onNext={() => setActiveSection("dashboard")} />
          </div>
        )}

        {/* ── DASHBOARD ── */}
        {activeSection === "dashboard" && (
          <div>
            <SectionHeader num="04" title="Excel Dashboard Design Principles" color="#FF8A65" />
            <Prose>
              A dashboard is a <Highlight>single-screen visual summary that helps decision-makers answer a specific business question at a glance</Highlight>. The difference between a good analyst and a great one is often not technical skill — it's the ability to present data so clearly that a non-technical executive immediately understands what to do.
            </Prose>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 10, margin: "28px 0 32px" }}>
              {dashboardPrinciples.map((p, i) => {
                const open = expandedDash === i;
                return (
                  <div key={i} onClick={() => setExpandedDash(open ? null : i)} style={{
                    border: `1px solid ${open ? p.color + "55" : "#1A1A2E"}`,
                    borderTop: `3px solid ${p.color}`,
                    borderRadius: 4, padding: "16px",
                    background: open ? `${p.color}08` : "#0D0D18",
                    cursor: "pointer", transition: "all 0.2s",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                      <span style={{ fontSize: 10, color: p.color, fontFamily: "monospace", fontWeight: 700 }}>{p.num}</span>
                      <span style={{ color: p.color, fontSize: 14, transform: open ? "rotate(45deg)" : "none", transition: "transform 0.2s" }}>+</span>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#DDD8F0", marginBottom: open ? 10 : 0 }}>{p.title}</div>
                    {open && <p style={{ fontSize: 13, color: "#888", margin: 0, lineHeight: 1.7 }}>{p.desc}</p>}
                  </div>
                );
              })}
            </div>

            <Subheading>Standard Excel Dashboard Layout</Subheading>
            <div style={{ border: "1px solid #1A1A2E", borderRadius: 4, overflow: "hidden", margin: "16px 0 28px", background: "#0A0A14" }}>
              {/* Dashboard wireframe */}
              <div style={{ padding: "16px", borderBottom: "1px solid #1A1A2E" }}>
                <div style={{ fontSize: 10, color: "#555", letterSpacing: "0.15em", fontFamily: "monospace", marginBottom: 12 }}>DASHBOARD LAYOUT WIREFRAME</div>
                {/* Header */}
                <div style={{ background: "#0D0D18", border: "1px solid #FF8A6533", borderRadius: 3, padding: "8px 14px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: "#FF8A65" }}>📋 TITLE + SUBTITLE + LAST UPDATED</span>
                  <span style={{ fontSize: 11, color: "#444" }}>SLICERS →</span>
                </div>
                {/* KPIs */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, marginBottom: 8 }}>
                  {["💰 Revenue", "📦 Orders", "📈 Growth %", "👥 Customers"].map(k => (
                    <div key={k} style={{ background: "#0D0D18", border: "1px solid #81C78433", borderRadius: 3, padding: "10px 10px", textAlign: "center" }}>
                      <div style={{ fontSize: 10, color: "#81C784", fontFamily: "monospace" }}>{k}</div>
                      <div style={{ fontSize: 16, fontWeight: 900, color: "#DDD8F0", marginTop: 4 }}>$0.0M</div>
                    </div>
                  ))}
                </div>
                {/* Charts */}
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 6, marginBottom: 8 }}>
                  <div style={{ background: "#0D0D18", border: "1px solid #4FC3F733", borderRadius: 3, padding: "10px 12px", height: 70, display: "flex", alignItems: "flex-end", gap: 4 }}>
                    {[40, 55, 48, 70, 62, 80, 73, 90, 85, 100, 92, 108].map((h, j) => (
                      <div key={j} style={{ flex: 1, height: `${h * 0.6}%`, background: "#4FC3F7", borderRadius: "2px 2px 0 0", opacity: 0.7 }} />
                    ))}
                  </div>
                  <div style={{ background: "#0D0D18", border: "1px solid #FFD54F33", borderRadius: 3, padding: "10px 12px", height: 70, display: "flex", flexDirection: "column", justifyContent: "center", gap: 4 }}>
                    {["North 38%", "South 27%", "East 21%", "West 14%"].map((r, j) => (
                      <div key={j} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{ width: `${[38, 27, 21, 14][j]}%`, maxWidth: "70%", height: 6, background: "#FFD54F", borderRadius: 2, opacity: 0.7 }} />
                        <span style={{ fontSize: 9, color: "#555", fontFamily: "monospace" }}>{r}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Table */}
                <div style={{ background: "#0D0D18", border: "1px solid #1A1A2E", borderRadius: 3, padding: "8px 12px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 8, marginBottom: 4, borderBottom: "1px solid #1A1A2E", paddingBottom: 6 }}>
                    {["Product", "Revenue", "Units", "Margin"].map(h => <span key={h} style={{ fontSize: 9, color: "#555", fontFamily: "monospace" }}>{h}</span>)}
                  </div>
                  {[["Product A", "$142K", "1,204", "32%"], ["Product B", "$98K", "876", "28%"], ["Product C", "$71K", "642", "41%"]].map((row, j) => (
                    <div key={j} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 8, padding: "4px 0", borderBottom: j < 2 ? "1px solid #0F0F18" : "none" }}>
                      {row.map((cell, k) => <span key={k} style={{ fontSize: 9, color: k === 0 ? "#AAA" : "#666", fontFamily: "monospace" }}>{cell}</span>)}
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ padding: "10px 16px", background: "#080811" }}>
                <span style={{ fontSize: 11, color: "#555" }}>Top → KPI cards · Middle → Trend chart + breakdown · Bottom → Detail table · Slicers filter everything simultaneously</span>
              </div>
            </div>

            <Callout icon="🤖" color="#CE93D8" title="Let Copilot Design Your Dashboard Layout">
              <em style={{ color: "#CE93D8" }}>"I have a sales dataset with columns: Date, Region, Product, Sales Rep, Revenue, Units, Returns. Design a dashboard layout for a sales manager who needs to monitor monthly performance. What KPIs, charts, and filters should I include?"</em> — Copilot gives you a blueprint. You build it.
            </Callout>

            <NavButtons onPrev={() => setActiveSection("cleaning")} onNext={() => setActiveSection("copilot")} />
          </div>
        )}

        {/* ── COPILOT ── */}
        {activeSection === "copilot" && (
          <div>
            <SectionHeader num="05" title="Microsoft Copilot in Excel" color="#CE93D8" />
            <Prose>
              Excel Copilot (available in Microsoft 365) is an <Highlight>AI assistant embedded directly inside Excel</Highlight>. You interact with it through a chat panel on the right side of the screen. It reads your spreadsheet, understands your data structure, and executes tasks in natural language — from writing formulas to generating full PivotTable reports.
            </Prose>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, margin: "20px 0 16px" }}>
              <Callout icon="✅" color="#81C784" title="How to Access Copilot in Excel">
                Microsoft 365 Personal/Business/Enterprise. Open any Excel file → Home tab → Copilot button (top right). Your data must be formatted as a Table (Ctrl+T) for Copilot to work best.
              </Callout>
              <Callout icon="⚠️" color="#FFD54F" title="Before You Start">
                Copilot requires: (1) Microsoft 365 subscription, (2) data in an Excel Table, (3) internet connection. If unavailable, use ChatGPT or Claude to generate formulas + code — same prompts, same results.
              </Callout>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, margin: "24px 0" }}>
              {copilotFeatures.map((f, i) => {
                const open = expandedCopilot === i;
                return (
                  <div key={i} style={{ border: `1px solid ${open ? f.color + "55" : "#1A1A2E"}`, borderRadius: 4, overflow: "hidden" }}>
                    <button onClick={() => setExpandedCopilot(open ? null : i)} style={{
                      width: "100%", background: open ? `${f.color}0A` : "#0D0D18",
                      border: "none", cursor: "pointer", padding: "14px 20px",
                      display: "flex", alignItems: "center", gap: 14,
                      fontFamily: "inherit", textAlign: "left",
                    }}>
                      <span style={{ fontSize: 22, flexShrink: 0 }}>{f.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#DDD8F0" }}>{f.feature}</div>
                        {!open && <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>{f.what.substring(0, 65)}...</div>}
                      </div>
                      <span style={{ color: f.color, fontSize: 18, transform: open ? "rotate(45deg)" : "none", transition: "transform 0.2s" }}>+</span>
                    </button>
                    {open && (
                      <div style={{ padding: "0 20px 20px 58px", background: `${f.color}06` }}>
                        <div style={{ height: 1, background: `${f.color}22`, margin: "0 0 14px" }} />
                        <p style={{ fontSize: 13, color: "#AAA", lineHeight: 1.7, margin: "0 0 14px" }}>{f.what}</p>
                        <div style={{ marginBottom: 14 }}>
                          <Label color={f.color}>EXAMPLE PROMPTS TO TRY IN COPILOT</Label>
                          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
                            {f.prompts.map((p, j) => (
                              <div key={j} style={{ background: "#07070E", border: `1px solid ${f.color}22`, borderRadius: 3, padding: "10px 12px" }}>
                                <code style={{ fontSize: 12, color: f.color, fontFamily: "monospace", lineHeight: 1.6 }}>{p}</code>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 8, alignItems: "flex-start", background: "rgba(255,100,100,0.05)", border: "1px solid rgba(255,100,100,0.2)", borderRadius: 3, padding: "10px 12px" }}>
                          <span>⚠️</span>
                          <span style={{ fontSize: 12, color: "#FF8A65", lineHeight: 1.6 }}>{f.warning}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <NavButtons onPrev={() => setActiveSection("dashboard")} onNext={() => setActiveSection("workflow")} />
          </div>
        )}

        {/* ── WORKFLOW ── */}
        {activeSection === "workflow" && (
          <div>
            <SectionHeader num="06" title="The AI-First Excel Workflow" color="#4ade80" />
            <Prose>
              The goal is not to replace Excel skills with AI — it's to use AI to <Highlight>eliminate the tedious parts</Highlight> so you can spend your time on thinking, interpreting, and communicating. Here is the complete workflow combining Excel mastery with Copilot/AI acceleration.
            </Prose>

            {/* Full workflow */}
            <div style={{ margin: "28px 0 36px" }}>
              {[
                {
                  phase: "RECEIVE DATA", step: "01", color: "#4FC3F7",
                  human: "Check source, understand context, confirm row count matches expectation",
                  ai: '"I just received a CSV export from our CRM. It has columns: [list them]. What data quality issues should I check for first?"',
                  output: "You know what to look for before touching the data"
                },
                {
                  phase: "CLEAN DATA", step: "02", color: "#81C784",
                  human: "Run cleaning checklist — inspect flagged rows, make judgment calls on nulls",
                  ai: '"Clean this dataset: remove duplicates on Order ID, convert date column from text, TRIM the customer name column, flag blanks in Revenue as 0."',
                  output: "Clean, analysis-ready dataset with a documented cleaning log"
                },
                {
                  phase: "EXPLORE DATA", step: "03", color: "#FFD54F",
                  human: "Ask the right business questions. Sanity-check AI-generated summaries.",
                  ai: '"What are the 5 most important patterns in this sales data? Show me a PivotTable by Region and Month."',
                  output: "Initial hypotheses and areas to investigate further"
                },
                {
                  phase: "DEEP ANALYSIS", step: "04", color: "#FF8A65",
                  human: "Write SUMIFS/COUNTIFS for specific questions. Build custom PivotTables.",
                  ai: '"Write a SUMIFS formula to calculate Q4 revenue for the North region excluding returns. Explain each argument."',
                  output: "Validated, formula-backed answers to specific business questions"
                },
                {
                  phase: "VISUALISE", step: "05", color: "#CE93D8",
                  human: "Design the dashboard layout. Apply 6 design principles. Choose chart types.",
                  ai: '"What chart best shows revenue trend + growth % together? Create a combo chart with bars for revenue and a line for growth %."',
                  output: "Professional, stakeholder-ready dashboard"
                },
                {
                  phase: "NARRATE", step: "06", color: "#4ade80",
                  human: "Validate every AI-generated insight against the raw data before presenting",
                  ai: '"Write an executive summary of the key insights from this dashboard in 3 bullet points. Focus on revenue trend, top-performing region, and biggest risk."',
                  output: "Presentation-ready narrative that gets decisions made"
                },
              ].map((w, i, arr) => (
                <div key={i} style={{ position: "relative" }}>
                  {i < arr.length - 1 && (
                    <div style={{ position: "absolute", left: 15, top: "100%", width: 1, height: 8, background: "#1A1A2E", zIndex: 1 }} />
                  )}
                  <div style={{ border: `1px solid ${w.color}33`, borderRadius: 4, marginBottom: 8, overflow: "hidden" }}>
                    <div style={{ background: `${w.color}0A`, padding: "12px 18px", display: "flex", alignItems: "center", gap: 12, borderBottom: `1px solid ${w.color}22` }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: `${w.color}18`, border: `1px solid ${w.color}44`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ fontSize: 10, color: w.color, fontFamily: "monospace", fontWeight: 700 }}>{w.step}</span>
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: w.color, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "monospace" }}>{w.phase}</span>
                      <span style={{ marginLeft: "auto", fontSize: 11, color: "#444", fontStyle: "italic" }}>→ {w.output}</span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", background: "#0A0A14" }}>
                      <div style={{ padding: "12px 16px", borderRight: "1px solid #1A1A2E" }}>
                        <Label color="#888">👤 YOU DO</Label>
                        <p style={{ fontSize: 12, color: "#777", margin: "6px 0 0", lineHeight: 1.6 }}>{w.human}</p>
                      </div>
                      <div style={{ padding: "12px 16px" }}>
                        <Label color="#CE93D8">🤖 AI PROMPT</Label>
                        <p style={{ fontSize: 12, color: "#CE93D8", margin: "6px 0 0", lineHeight: 1.6, fontStyle: "italic" }}>{w.ai}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Callout icon="🎯" color="#4ade80" title="The Golden Rule of AI + Excel">
              You are the analyst. AI is your fast intern. A fast intern that makes mistakes you can't afford to publish. <strong>Always verify every number, every formula, every insight</strong> that AI generates against the raw data before it leaves your screen. Your name goes on the report — not the AI's.
            </Callout>

            <div style={{ margin: "32px 0 0", padding: "22px 24px", background: "#0D0D18", border: "1px solid #1A1A2E", borderRadius: 4 }}>
              <div style={{ fontSize: 11, color: "#555", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 16, fontFamily: "monospace" }}>PART 3 SUMMARY — WHAT YOU CAN NOW DO</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[
                  "Write XLOOKUP, SUMIFS, COUNTIFS, IFS formulas",
                  "Build PivotTables from raw data in under 2 minutes",
                  "Add slicers and connect to multiple PivotTables",
                  "Clean 6 types of data quality issues systematically",
                  "Design a stakeholder-ready Excel dashboard",
                  "Use Copilot to generate formulas from plain English",
                  "Use Copilot to find insights and anomalies in data",
                  "Combine AI speed with your own analytical judgment",
                ].map((skill, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                    <span style={{ color: "#4ade80", flexShrink: 0, fontSize: 13 }}>✓</span>
                    <span style={{ fontSize: 13, color: "#777", lineHeight: 1.5 }}>{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            <NavButtons onPrev={() => setActiveSection("copilot")} onNext={() => setActiveSection("quiz")} nextLabel="Take the Quiz →" />
          </div>
        )}

        {/* ── QUIZ ── */}
        {activeSection === "quiz" && (
          <div>
            <SectionHeader num="07" title="Part 3 Knowledge Check" color="#4ade80" />
            <Prose>6 questions. A score of 4+ means you're ready for Part 4 — the Phase 1 project.</Prose>

            {!quizState.done ? (
              <div style={{ margin: "28px 0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                  <span style={{ fontSize: 11, color: "#555", fontFamily: "monospace", letterSpacing: "0.15em" }}>QUESTION {quizState.idx + 1} / {quizQuestions.length}</span>
                  <span style={{ fontSize: 11, color: "#4ade80", fontFamily: "monospace" }}>SCORE: {quizState.score} / {quizState.idx}</span>
                </div>
                <div style={{ height: 3, background: "#1A1A2E", borderRadius: 2, marginBottom: 28, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${(quizState.idx / quizQuestions.length) * 100}%`, background: "linear-gradient(90deg, #4ade80, #4FC3F7)", transition: "width 0.4s" }} />
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#DDD8F0", lineHeight: 1.65, marginBottom: 24, fontFamily: "Georgia, serif" }}>
                  {quizQuestions[quizState.idx].q}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {quizQuestions[quizState.idx].options.map((opt, i) => {
                    const isSelected = quizState.selected === i;
                    const isCorrect = i === quizQuestions[quizState.idx].answer;
                    let bg = "#0D0D18", border = "#1A1A2E", col = "#888";
                    if (quizState.answered) {
                      if (isCorrect) { bg = "rgba(74,222,128,0.08)"; border = "#4ade80"; col = "#4ade80"; }
                      else if (isSelected && !isCorrect) { bg = "rgba(255,100,100,0.08)"; border = "#FF6464"; col = "#FF6464"; }
                    } else if (isSelected) { bg = "rgba(74,222,128,0.06)"; border = "#4ade80"; col = "#4ade80"; }
                    return (
                      <button key={i} onClick={() => handleAnswer(i)} style={{
                        background: bg, border: `1px solid ${border}`, borderRadius: 4,
                        padding: "13px 18px", cursor: quizState.answered ? "default" : "pointer",
                        textAlign: "left", fontFamily: "inherit", fontSize: 13,
                        color: col, lineHeight: 1.5, transition: "all 0.2s",
                      }}>
                        <span style={{ marginRight: 10, fontFamily: "monospace", fontSize: 11 }}>{String.fromCharCode(65 + i)}.</span>
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {quizState.answered && (
                  <div style={{ margin: "20px 0 0", padding: "14px 18px", background: "rgba(74,222,128,0.04)", border: "1px solid rgba(74,222,128,0.18)", borderRadius: 4 }}>
                    <div style={{ fontSize: 10, color: "#4ade80", letterSpacing: "0.15em", marginBottom: 6, fontFamily: "monospace" }}>EXPLANATION</div>
                    <p style={{ fontSize: 13, color: "#888", margin: "0 0 16px", lineHeight: 1.7 }}>
                      {quizQuestions[quizState.idx].explanation}
                    </p>
                    <button onClick={nextQ} style={{
                      background: "#4ade80", border: "none", borderRadius: 3,
                      padding: "8px 20px", cursor: "pointer", fontFamily: "monospace",
                      fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#07070E",
                    }}>
                      {quizState.idx < quizQuestions.length - 1 ? "NEXT QUESTION →" : "SEE RESULTS →"}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ margin: "28px 0", textAlign: "center" }}>
                <div style={{ fontSize: 60, marginBottom: 12 }}>
                  {quizState.score >= 5 ? "🏆" : quizState.score >= 4 ? "✅" : "📚"}
                </div>
                <div style={{ fontSize: 44, fontWeight: 900, marginBottom: 8, color: quizState.score >= 5 ? "#4ade80" : quizState.score >= 4 ? "#FFD54F" : "#FF8A65" }}>
                  {quizState.score} / {quizQuestions.length}
                </div>
                <div style={{ fontSize: 15, color: "#666", marginBottom: 28 }}>
                  {quizState.score === 6 ? "Perfect score — Excel mastery confirmed. On to Part 4!" : quizState.score >= 4 ? "Solid pass. Review any sections you found tricky before the project." : "Revisit the weak sections before moving to Part 4."}
                </div>
                <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                  <button onClick={() => setQuizState({ idx: 0, selected: null, answered: false, score: 0, done: false })} style={{ background: "none", border: "1px solid #333", borderRadius: 3, padding: "8px 20px", cursor: "pointer", fontFamily: "monospace", fontSize: 11, color: "#555", letterSpacing: "0.1em" }}>RETAKE</button>
                  <button onClick={() => setActiveSection("intro")} style={{ background: "#4ade80", border: "none", borderRadius: 3, padding: "8px 24px", cursor: "pointer", fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: "#07070E", letterSpacing: "0.1em" }}>REVIEW ↑</button>
                </div>

                <div style={{ marginTop: 40, padding: "22px", background: "#0D0D18", border: "1px solid #1A1A2E", borderRadius: 4, textAlign: "left" }}>
                  <div style={{ fontSize: 11, color: "#555", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 10, fontFamily: "monospace" }}>WHAT'S IN PART 4 → (FINAL)</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#DDD8F0", marginBottom: 8 }}>Phase 1 Capstone Project + Review</div>
                  <p style={{ fontSize: 13, color: "#555", lineHeight: 1.7, margin: "0 0 16px" }}>
                    Build the complete Phase 1 project: an AI-Assisted Sales Intelligence Report using everything from Parts 1–3. Full brief, dataset, step-by-step instructions, and a marking rubric.
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {["Real dataset provided", "Step-by-step brief", "AI prompts included", "Marking rubric", "Portfolio-ready output"].map(tag => (
                      <span key={tag} style={{ padding: "3px 10px", background: "rgba(74,222,128,0.07)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: 2, fontSize: 11, color: "#4ade80" }}>{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <NavButtons onPrev={() => setActiveSection("workflow")} />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── SHARED COMPONENTS ────────────────────────────────────────
function SectionHeader({ num, title, color }) {
  return (
    <div style={{ marginBottom: 28, paddingBottom: 16, borderBottom: "1px solid #1A1A2E" }}>
      <div style={{ fontSize: 10, color, letterSpacing: "0.3em", fontFamily: "monospace", marginBottom: 6 }}>SECTION {num}</div>
      <h2 style={{ margin: 0, fontSize: "clamp(20px,3vw,28px)", fontWeight: 900, color: "#DDD8F0", letterSpacing: "-0.01em" }}>
        <span style={{ color }}>{num}. </span>{title}
      </h2>
    </div>
  );
}
function Subheading({ children }) {
  return <h3 style={{ fontSize: 16, fontWeight: 700, color: "#DDD8F0", margin: "32px 0 12px", borderLeft: "3px solid #4ade80", paddingLeft: 12 }}>{children}</h3>;
}
function Prose({ children }) {
  return <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 16px" }}>{children}</p>;
}
function Highlight({ children }) {
  return <strong style={{ color: "#DDD8F0", fontWeight: 700 }}>{children}</strong>;
}
function Label({ color, children }) {
  return <div style={{ fontSize: 9, color, letterSpacing: "0.18em", textTransform: "uppercase", fontFamily: "monospace", fontWeight: 700 }}>{children}</div>;
}
function Callout({ icon, color, title, children }) {
  return (
    <div style={{ margin: "20px 0", padding: "14px 18px", background: `${color}07`, border: `1px solid ${color}30`, borderLeft: `3px solid ${color}`, borderRadius: 4 }}>
      <div style={{ fontSize: 12, color, fontWeight: 700, marginBottom: 8, display: "flex", gap: 8, alignItems: "center" }}>
        <span>{icon}</span>{title}
      </div>
      <div style={{ fontSize: 13, color: "#666", lineHeight: 1.8 }}>{children}</div>
    </div>
  );
}
function NavButtons({ onPrev, onNext, nextLabel = "Next Section →" }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 48, paddingTop: 24, borderTop: "1px solid #1A1A2E" }}>
      {onPrev
        ? <button onClick={onPrev} style={{ background: "none", border: "1px solid #1A1A2E", borderRadius: 3, padding: "8px 18px", cursor: "pointer", fontFamily: "monospace", fontSize: 11, color: "#555", letterSpacing: "0.1em" }}>← Previous</button>
        : <div />}
      {onNext && (
        <button onClick={onNext} style={{ background: "#4ade80", border: "none", borderRadius: 3, padding: "8px 24px", cursor: "pointer", fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: "#07070E", letterSpacing: "0.1em" }}>{nextLabel}</button>
      )}
    </div>
  );
}
