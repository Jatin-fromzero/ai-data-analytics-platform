import { useState } from "react";

// All code stored as .join("\n") arrays — no template literal conflicts

const POWER_QUERY_CODE = [
  "// Power Query (M Language) — common transformations",
  "// Access via: Home > Transform Data",
  "",
  "// Remove duplicate rows",
  "Table.Distinct(Source)",
  "",
  "// Filter to Completed orders only",
  "Table.SelectRows(Source, each [status] = \"Completed\")",
  "",
  "// Add a revenue column",
  "Table.AddColumn(Source, \"revenue\",",
  "  each [units] * [price], type number)",
  "",
  "// Change column type",
  "Table.TransformColumnTypes(Source, {",
  "  {\"order_date\", type date},",
  "  {\"revenue\",    type number}",
  "})",
  "",
  "// Rename columns",
  "Table.RenameColumns(Source, {",
  "  {\"OldName\", \"NewName\"},",
  "  {\"cust_id\",  \"customer_id\"}",
  "})",
  "",
  "// Merge two queries (like SQL JOIN)",
  "Table.NestedJoin(",
  "  Orders, {\"customer_id\"},",
  "  Customers, {\"customer_id\"},",
  "  \"CustomerData\", JoinKind.LeftOuter",
  ")",
].join("\n");

const DAX_BASIC_CODE = [
  "// DAX Measures — write in the formula bar or Modeling tab",
  "",
  "// Basic aggregations",
  "Total Revenue  = SUM(orders[revenue])",
  "Total Orders   = COUNTROWS(orders)",
  "Distinct Custs = DISTINCTCOUNT(orders[customer_id])",
  "Avg Order Val  = AVERAGE(orders[revenue])",
  "",
  "// Calculated column (row-level, stored in table)",
  "Profit = orders[revenue] - orders[cost_total]",
  "Margin % = DIVIDE(orders[Profit], orders[revenue], 0)",
  "",
  "// Conditional logic",
  "Revenue Tier =",
  "  IF(orders[revenue] >= 1000, \"High\",",
  "  IF(orders[revenue] >= 500,  \"Medium\", \"Low\"))",
  "",
  "// Safe division (avoids divide-by-zero error)",
  "Conversion Rate = DIVIDE([Completed Orders], [Total Orders], 0)",
].join("\n");

const DAX_TIME_CODE = [
  "// Time Intelligence — requires a Date table",
  "// Create one: Modeling > New Table",
  "// Date Table = CALENDAR(DATE(2024,1,1), DATE(2024,12,31))",
  "",
  "// Month-over-month comparison",
  "Revenue MoM =",
  "  VAR CurrentMonth = [Total Revenue]",
  "  VAR PrevMonth    =",
  "    CALCULATE([Total Revenue],",
  "      DATEADD(DateTable[Date], -1, MONTH))",
  "  RETURN",
  "    DIVIDE(CurrentMonth - PrevMonth, PrevMonth, 0)",
  "",
  "// Year-to-date",
  "Revenue YTD =",
  "  CALCULATE([Total Revenue],",
  "    DATESYTD(DateTable[Date]))",
  "",
  "// Same period last year",
  "Revenue SPLY =",
  "  CALCULATE([Total Revenue],",
  "    SAMEPERIODLASTYEAR(DateTable[Date]))",
  "",
  "// Running total",
  "Running Revenue =",
  "  CALCULATE([Total Revenue],",
  "    FILTER(ALL(DateTable),",
  "      DateTable[Date] <= MAX(DateTable[Date])))",
].join("\n");

const DAX_FILTER_CODE = [
  "// CALCULATE — the most important DAX function",
  "// Evaluates a measure in a modified filter context",
  "",
  "// Revenue for North region only",
  "North Revenue =",
  "  CALCULATE([Total Revenue],",
  "    orders[region] = \"North\")",
  "",
  "// Completed orders revenue",
  "Completed Revenue =",
  "  CALCULATE([Total Revenue],",
  "    orders[status] = \"Completed\")",
  "",
  "// Revenue ignoring region filter (like Tableau FIXED LOD)",
  "All Region Revenue =",
  "  CALCULATE([Total Revenue],",
  "    ALL(orders[region]))",
  "",
  "// % of grand total",
  "Revenue % of Total =",
  "  DIVIDE(",
  "    [Total Revenue],",
  "    CALCULATE([Total Revenue], ALL(orders)),",
  "    0",
  "  )",
  "",
  "// RANKX — rank products by revenue",
  "Product Rank =",
  "  RANKX(ALL(orders[product]),",
  "    [Total Revenue], , DESC, Dense)",
].join("\n");

const COPILOT_CODE = [
  "// Power BI Copilot — natural language to report",
  "// Access: Home ribbon > Copilot button (requires Fabric capacity)",
  "",
  "// Example prompts in the Copilot panel:",
  "",
  "// 1. Generate a full report page",
  "\"Create a sales performance report showing",
  " revenue by region, monthly trend,",
  " and top 10 products by revenue\"",
  "",
  "// 2. Add a specific visual",
  "\"Add a line chart showing revenue",
  " month-over-month for 2024\"",
  "",
  "// 3. Write a DAX measure",
  "\"Write a DAX measure for",
  " year-over-year revenue growth %\"",
  "",
  "// 4. Summarise the report",
  "\"Summarise the key insights",
  " from this report page\"",
  "",
  "// 5. Answer a data question",
  "\"Which category had the highest",
  " return rate last quarter?\"",
].join("\n");

const QA_CODE = [
  "// Q&A Visual — stakeholders ask questions in plain English",
  "// Add to report: Insert > Q&A",
  "",
  "// Example natural language queries users can type:",
  "\"total revenue by region as bar chart\"",
  "\"monthly orders in 2024 as line\"",
  "\"top 5 products by revenue\"",
  "\"return rate by category\"",
  "\"average order value this month vs last month\"",
  "",
  "// Improve Q&A accuracy:",
  "// 1. Add synonyms: Modeling > Q&A Setup",
  "//    e.g. 'sales' = 'revenue', 'clients' = 'customers'",
  "// 2. Mark tables as 'Featured table'",
  "// 3. Set linguistic schema for complex fields",
  "",
  "// Convert Q&A result to standard visual:",
  "// Click the chart icon in the Q&A visual header",
  "// This freezes the result as a permanent visual",
].join("\n");

const practiceSteps = [
  {
    task: "P1", title: "Connect Data and Build the Data Model",
    col: "#FFD700",
    steps: [
      "Download and install Power BI Desktop (free): powerbi.microsoft.com/desktop",
      "Open Power BI Desktop > Get Data > Text/CSV > select orders.csv",
      "Click Transform Data to open Power Query Editor",
      "Check column types: order_date = Date, revenue = Decimal Number, units = Whole Number",
      "Add a calculated column: revenue = units * price (Add Column > Custom Column)",
      "Add another column: profit = revenue - cost_total",
      "Click Close & Apply to load the data",
      "In Report view: check Fields pane shows all columns correctly",
      "Create a Date table: Modeling > New Table > DateTable = CALENDAR(DATE(2024,1,1), DATE(2024,12,31))",
      "Mark it as Date Table: right-click DateTable > Mark as Date Table > select the date column",
    ],
    aiPrompt: "I loaded orders.csv into Power BI Desktop. Walk me through creating a proper Date table in DAX, marking it as a Date Table, and creating a relationship between the orders[order_date] column and my Date table.",
  },
  {
    task: "P2", title: "Write DAX Measures and Build 4 Visuals",
    col: "#00A4EF",
    steps: [
      "Create measure: Total Revenue = SUM(orders[revenue])",
      "Create measure: Total Orders = COUNTROWS(orders)",
      "Create measure: Avg Order Value = AVERAGE(orders[revenue])",
      "Create measure: Return Rate = DIVIDE(CALCULATE(COUNTROWS(orders), orders[status]=\"Returned\"), COUNTROWS(orders), 0)",
      "Visual 1 — Card: Add 4 Card visuals for each measure. Format with bold numbers.",
      "Visual 2 — Bar chart: Revenue by Region. Sort descending. Add data labels.",
      "Visual 3 — Line chart: Monthly Revenue Trend. Use DateTable[Month] on X axis.",
      "Visual 4 — Clustered bar: Revenue by Category. Add conditional formatting (green = high).",
      "Add a slicer for Status (filter Completed / Returned / All). Format as dropdown.",
      "Add a slicer for Region. Format as a tile/button style.",
    ],
    aiPrompt: "Write DAX measures for Power BI: (1) Total Revenue, (2) Return Rate % = returned orders / total orders, (3) Revenue MoM change %, (4) Revenue % of grand total. I have a table called 'orders' with columns: revenue, status, order_date, region.",
  },
  {
    task: "P3", title: "Publish and Share",
    col: "#107C41",
    steps: [
      "Check the report looks clean: consistent font, no chart borders, white background",
      "Add a page title text box at top: 'RetailCo Sales Dashboard — Power BI'",
      "Add page-level filter for Status = Completed (Filters pane > Page level filters)",
      "Sign in to Power BI Service: app.powerbi.com (free Microsoft account works)",
      "Publish: Home > Publish > select 'My Workspace'",
      "Open the report in Power BI Service via the link in the success message",
      "Click Share > Copy link — add this to your portfolio GitHub README",
      "Optional: try Copilot if available — Home ribbon > Copilot > type a prompt",
      "Optional: add a Q&A visual — Insert > Q&A — test with 'total revenue by region'",
    ],
    aiPrompt: "I built a Power BI report with revenue, orders, and return rate metrics. How do I publish it to Power BI Service, set up row-level security so each regional manager only sees their region's data, and share it with a non-Power BI user via a public link?",
  },
];

const quizData = [
  {
    q: "What is the role of Power Query in Power BI?",
    opts: [
      "It is where you build charts and visuals",
      "It is the ETL layer — where you connect, clean, reshape, and transform data before it loads into the data model",
      "It is the formula language for creating calculated measures",
      "It is Power BI's AI feature for natural language queries"
    ],
    ans: 1,
    exp: "Power Query is the Extract-Transform-Load (ETL) engine. Every data connection goes through Power Query first. You clean column types, remove duplicates, filter rows, merge queries, and add calculated columns here — before the data reaches the model. Think of it as SQL for data prep, but visual and no-code."
  },
  {
    q: "What is the difference between a DAX Measure and a Calculated Column?",
    opts: [
      "Measures are for dates; calculated columns are for numbers",
      "Measures are evaluated dynamically at query time based on filter context; calculated columns are computed once at load time and stored in the table",
      "Calculated columns are faster than measures for large datasets",
      "There is no difference — they produce the same result"
    ],
    ans: 1,
    exp: "Calculated columns: computed row-by-row when the table loads, stored in the data model, use memory. Measures: computed dynamically when a visual is rendered, respond to all active filters, do not use storage. Use calculated columns for row-level logic (Profit = Revenue - Cost). Use measures for aggregations (Total Revenue = SUM)."
  },
  {
    q: "What does CALCULATE() do in DAX?",
    opts: [
      "It replaces SUM() for financial calculations",
      "It evaluates a measure or expression in a modified filter context — letting you override the filters applied to a visual",
      "It is used only for date calculations",
      "It connects to external data sources"
    ],
    ans: 1,
    exp: "CALCULATE() is the most important function in DAX. It evaluates any expression with additional or modified filters. CALCULATE([Total Revenue], orders[region]='North') gives revenue only for North, regardless of what region filter is active in the visual. It is how you write context-aware measures."
  },
  {
    q: "You write: Revenue % of Total = DIVIDE([Total Revenue], CALCULATE([Total Revenue], ALL(orders)), 0). What does ALL(orders) do?",
    opts: [
      "It adds all orders together",
      "It removes all filters on the orders table, so the denominator is always the grand total regardless of what is filtered in the visual",
      "It is the same as SUM(orders[revenue])",
      "It sorts the orders table"
    ],
    ans: 1,
    exp: "ALL() removes filters from the specified table or column. CALCULATE([Total Revenue], ALL(orders)) gives the grand total revenue ignoring any slicers or visual filters. This is essential for % of total calculations — the denominator must be the unfiltered total, not the filtered subtotal."
  },
  {
    q: "Power BI Copilot can be used to:",
    opts: [
      "Only format and colour visuals automatically",
      "Generate report pages from natural language prompts, write DAX measures, and summarise insights from existing reports",
      "Replace the data model entirely",
      "Only work with Microsoft Excel data sources"
    ],
    ans: 1,
    exp: "Power BI Copilot (requires Microsoft Fabric capacity or Copilot-enabled workspace) can: generate complete report pages from a text description, write DAX measures from plain English, answer questions about your data, and summarise key insights from a report page. It requires the Copilot button in the Home ribbon to be enabled."
  },
  {
    q: "The Q&A visual in Power BI allows:",
    opts: [
      "You to schedule automated email reports",
      "End users to type natural language questions and get visual answers without knowing DAX or Power BI",
      "You to query external SQL databases directly",
      "Automatic chart type selection only"
    ],
    ans: 1,
    exp: "The Q&A visual turns your data model into a natural language interface. A sales manager can type 'total revenue by region as bar chart' and get the answer instantly — without knowing DAX or building a visual. You can improve accuracy by adding synonyms in Q&A Setup (e.g. 'sales' = 'revenue', 'clients' = 'customers')."
  },
];

const sections = [
  { id: "intro",    label: "Overview"    },
  { id: "pquery",   label: "Power Query" },
  { id: "dax",      label: "DAX"         },
  { id: "visuals",  label: "Visuals"     },
  { id: "copilot",  label: "Copilot"     },
  { id: "model",    label: "Data Model"  },
  { id: "practice", label: "Practice"    },
  { id: "quiz",     label: "Quiz"        },
];

export default function Phase4Part2() {
  const [sec, setSec] = useState("intro");
  const [openEx, setOpenEx] = useState(null);
  const [checkedSteps, setCheckedSteps] = useState({});
  const [quiz, setQuiz] = useState({ idx: 0, sel: null, answered: false, score: 0, done: false });

  const ACC = "#FFD700";
  const toggleStep = (k) => setCheckedSteps(p => ({ ...p, [k]: !p[k] }));
  const answerQ = (i) => {
    if (quiz.answered) return;
    setQuiz(q => ({ ...q, sel: i, answered: true, score: q.score + (i === quizData[q.idx].ans ? 1 : 0) }));
  };
  const nextQ = () => {
    if (quiz.idx + 1 >= quizData.length) setQuiz(q => ({ ...q, done: true }));
    else setQuiz(q => ({ ...q, idx: q.idx + 1, sel: null, answered: false }));
  };

  return (
    <div style={{ minHeight: "100vh", background: "#07070E", color: "#DDD8F0", fontFamily: "Georgia, serif" }}>

      {/* NAV */}
      <div style={{ background: "#0A0A14", borderBottom: "1px solid #16162A", padding: "0 24px", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 940, margin: "0 auto", display: "flex", alignItems: "center", overflowX: "auto" }}>
          <div style={{ fontSize: 10, color: ACC, letterSpacing: "0.2em", textTransform: "uppercase", padding: "14px 20px 14px 0", borderRight: "1px solid #1A1A2E", marginRight: 12, whiteSpace: "nowrap" }}>
            P4 · PART 2
          </div>
          {sections.map(s => (
            <button key={s.id} onClick={() => setSec(s.id)} style={{
              background: "none", border: "none", cursor: "pointer", padding: "14px 12px",
              fontFamily: "inherit", fontSize: 11,
              color: sec === s.id ? ACC : "#444",
              borderBottom: sec === s.id ? "2px solid " + ACC : "2px solid transparent",
              transition: "all 0.2s", whiteSpace: "nowrap",
            }}>{s.label}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 940, margin: "0 auto", padding: "48px 24px 100px" }}>

        {/* ── INTRO ── */}
        {sec === "intro" && (
          <div>
            <div style={{ marginBottom: 48, borderLeft: "3px solid " + ACC, paddingLeft: 24 }}>
              <div style={{ fontSize: 10, color: ACC, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 12 }}>
                PHASE 4 · PART 2 OF 3 · WEEK 12
              </div>
              <h1 style={{ fontSize: "clamp(26px,5vw,44px)", fontWeight: 900, margin: "0 0 16px", lineHeight: 1.12, letterSpacing: "-0.02em" }}>
                Power BI<br />
                <span style={{ color: ACC }}>+ Microsoft Copilot</span><br />
                <span style={{ fontStyle: "italic", fontWeight: 400, fontSize: "0.65em", color: "#555" }}>DAX, Power Query and AI-Powered Reporting</span>
              </h1>
              <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, maxWidth: 580, margin: "0 0 24px" }}>
                Power BI is Microsoft's BI platform — free to download, deeply integrated with Excel, Teams, and the entire Microsoft 365 ecosystem. In this part you will master Power Query for ETL, DAX for calculations, the data model, professional report design, and Microsoft Copilot for generating reports and measures from plain English.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {["~5 hours", "Power BI Desktop (free)", "Power Query ETL", "DAX measures", "Time intelligence", "CALCULATE()", "Data model", "Microsoft Copilot", "Q&A visual", "6-question quiz"].map(t => (
                  <span key={t} style={{ padding: "4px 12px", background: "rgba(255,215,0,0.08)", border: "1px solid rgba(255,215,0,0.22)", borderRadius: 2, fontSize: 11, color: ACC }}>{t}</span>
                ))}
              </div>
            </div>

            <SH n="00" title="What You Will Learn" col={ACC} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 10, margin: "24px 0 36px" }}>
              {[
                { icon: "🔌", title: "Power Query ETL",    desc: "Connect, clean, reshape data — the M language, merging queries, column transforms", col: "#FFD700", s: "pquery"   },
                { icon: "📐", title: "DAX Formulas",       desc: "Measures vs columns, CALCULATE, FILTER, ALL, time intelligence, RANKX",           col: "#00A4EF", s: "dax"      },
                { icon: "📊", title: "Visuals and Design", desc: "Cards, bar, line, matrix, KPI visuals — formatting, conditional formatting, themes", col: "#107C41", s: "visuals"  },
                { icon: "🤖", title: "Microsoft Copilot",  desc: "Generate report pages from prompts, write DAX, summarise insights",               col: "#7B68EE", s: "copilot"  },
                { icon: "🗄️", title: "Data Modelling",     desc: "Star schema, relationships, fact vs dimension tables, cross-filter direction",     col: "#FF8A65", s: "model"    },
                { icon: "🔨", title: "Practice (3 tasks)", desc: "Load data → DAX measures + 4 visuals → publish and share",                        col: "#CE93D8", s: "practice" },
              ].map((item, i) => (
                <div key={i} onClick={() => setSec(item.s)} style={{
                  border: "1px solid " + item.col + "33", borderTop: "3px solid " + item.col,
                  borderRadius: 4, padding: "14px", background: "#0D0D18",
                  cursor: "pointer", transition: "background 0.2s",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = item.col + "08"}
                  onMouseLeave={e => e.currentTarget.style.background = "#0D0D18"}
                >
                  <div style={{ fontSize: 20, marginBottom: 8 }}>{item.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#DDD8F0", marginBottom: 5 }}>{item.title}</div>
                  <div style={{ fontSize: 11, color: "#444", lineHeight: 1.6 }}>{item.desc}</div>
                </div>
              ))}
            </div>

            <Box col={ACC} icon="⚡" title="Power BI vs Tableau — Key Differences">
              Power BI is stronger when: your organisation uses Microsoft 365, you need Excel integration, or budget is tight (free tier is generous). Tableau is stronger when: you need highly custom visualisations, you have complex analytical requirements, or your team already uses it. Most enterprise data teams use both — knowing both makes you significantly more hireable.
            </Box>
            <Nav onNext={() => setSec("pquery")} />
          </div>
        )}

        {/* ── POWER QUERY ── */}
        {sec === "pquery" && (
          <div>
            <SH n="01" title="Power Query — ETL Without Code" col="#FFD700" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 16px" }}>
              Power Query is Power BI's data preparation engine. <strong style={{ color: "#DDD8F0" }}>Every transformation you apply is recorded as a step</strong> — click buttons to clean data visually, and Power Query writes the M code for you. You never need to touch the M language directly, but understanding it helps when things go wrong.
            </p>

            <SH n="01a" title="The Power Query Workflow" col="#FFD700" />
            <div style={{ border: "1px solid #1A1A2E", borderRadius: 4, overflow: "hidden", margin: "0 0 20px" }}>
              {[
                { step: "1", action: "Connect",   desc: "Home > Get Data > choose source (CSV, Excel, SQL, Web, SharePoint). Every source gets its own Query.", col: "#FFD700" },
                { step: "2", action: "Transform", desc: "Transform Data opens the Query Editor. Apply steps: change types, remove columns, filter rows, add columns, merge queries.", col: "#00A4EF" },
                { step: "3", action: "Review Applied Steps", desc: "Right panel shows every step you took. Click any step to see the data at that point. Delete a step to undo it.", col: "#107C41" },
                { step: "4", action: "Close and Apply", desc: "Home > Close & Apply loads transformed data into the Power BI data model. Re-runs all steps on refresh.", col: "#FF8A65" },
              ].map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 14, padding: "12px 16px", borderBottom: i < 3 ? "1px solid #0F0F18" : "none", background: i % 2 === 0 ? "#0A0A14" : "#07070E", alignItems: "flex-start" }}>
                  <div style={{ width: 26, height: 26, borderRadius: "50%", background: s.col + "18", border: "1px solid " + s.col + "44", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: 10, color: s.col, fontWeight: 700 }}>{s.step}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#DDD8F0" }}>{s.action}</div>
                    <div style={{ fontSize: 12, color: "#666", marginTop: 3, lineHeight: 1.6 }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <SH n="01b" title="Most Used Power Query Operations" col="#FFD700" />
            <div style={{ border: "1px solid #1A1A2E", borderRadius: 4, overflow: "hidden", margin: "0 0 20px" }}>
              {[
                { op: "Change Data Type",    how: "Click the icon left of column name > select type",             why: "Dates stored as text will not work in time intelligence DAX" },
                { op: "Remove Duplicates",   how: "Right-click column header > Remove Duplicates",                why: "Duplicate order_id rows inflate all aggregate measures" },
                { op: "Filter Rows",         how: "Click dropdown arrow on column > filter values",               why: "Remove test data, cancelled orders, or specific date ranges at load time" },
                { op: "Add Custom Column",   how: "Add Column > Custom Column > write formula",                   why: "revenue = [units] * [price] — computed before data enters model" },
                { op: "Merge Queries",       how: "Home > Merge Queries > select key column and join type",       why: "Join orders to customers or products — the Power Query equivalent of SQL JOIN" },
                { op: "Unpivot Columns",     how: "Select columns > Transform > Unpivot Columns",                 why: "Convert wide format (Q1, Q2, Q3) to long format required for time analysis" },
                { op: "Split Column",        how: "Right-click column > Split Column > by delimiter",             why: "Split 'FirstName LastName' into two columns, or 'Region-Zone' into separate fields" },
                { op: "Replace Values",      how: "Right-click column > Replace Values",                          why: "Standardise: 'completed' and 'Completed' and 'COMPLETED' > all become 'Completed'" },
              ].map((r, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "140px 1fr 1fr", gap: 12, padding: "10px 16px", borderBottom: i < 7 ? "1px solid #0F0F18" : "none", background: i % 2 === 0 ? "#0A0A14" : "#07070E", alignItems: "start" }}>
                  <span style={{ fontSize: 12, color: "#FFD700", fontWeight: 700 }}>{r.op}</span>
                  <span style={{ fontSize: 11, color: "#888", fontFamily: "monospace" }}>{r.how}</span>
                  <span style={{ fontSize: 12, color: "#555", fontStyle: "italic" }}>{r.why}</span>
                </div>
              ))}
            </div>

            <CodeBlock col="#FFD700" label="POWER QUERY M CODE — COMMON TRANSFORMS" code={POWER_QUERY_CODE} />
            <Box col="#CE93D8" icon="🤖" title="AI Prompt for Power Query">
              "I am in Power Query in Power BI. I have an orders table with columns: order_id, customer_id, product, region, units, price, cost, status, order_date. Walk me through: (1) changing order_date to Date type, (2) adding a revenue column = units * price, (3) filtering to remove Cancelled status rows, (4) merging with a customers table on customer_id."
            </Box>
            <Nav onPrev={() => setSec("intro")} onNext={() => setSec("dax")} />
          </div>
        )}

        {/* ── DAX ── */}
        {sec === "dax" && (
          <div>
            <SH n="02" title="DAX — Data Analysis Expressions" col="#00A4EF" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 16px" }}>
              DAX is Power BI's formula language for creating calculations. It is used for both <strong style={{ color: "#DDD8F0" }}>Measures</strong> (dynamic aggregations that respond to filters) and <strong style={{ color: "#DDD8F0" }}>Calculated Columns</strong> (row-level values stored in the table). Understanding the difference is the single most important concept in Power BI.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, margin: "0 0 24px" }}>
              <div style={{ border: "1px solid rgba(0,164,239,0.3)", borderRadius: 4, padding: "16px", background: "rgba(0,164,239,0.04)" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#00A4EF", marginBottom: 10 }}>Measures</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  {["Calculated at query time", "Respond to all active filters", "Stored as formula only (no memory)", "Use for: SUM, COUNT, AVERAGE, ratios", "Example: Total Revenue = SUM(orders[revenue])"].map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: 8 }}>
                      <span style={{ color: "#00A4EF", flexShrink: 0 }}>→</span>
                      <span style={{ fontSize: 12, color: "#888" }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ border: "1px solid rgba(16,124,65,0.3)", borderRadius: 4, padding: "16px", background: "rgba(16,124,65,0.04)" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#107C41", marginBottom: 10 }}>Calculated Columns</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  {["Calculated at data load time", "Fixed value per row — ignores filters", "Stored in table (uses memory)", "Use for: row-level logic, categories", "Example: Profit = orders[revenue] - orders[cost]"].map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: 8 }}>
                      <span style={{ color: "#107C41", flexShrink: 0 }}>→</span>
                      <span style={{ fontSize: 12, color: "#888" }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <SH n="02a" title="Core DAX Functions" col="#00A4EF" />
            <CodeBlock col="#00A4EF" label="BASIC MEASURES AND CALCULATED COLUMNS" code={DAX_BASIC_CODE} />

            <SH n="02b" title="CALCULATE — The Most Important DAX Function" col="#FF8A65" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 12px" }}>
              CALCULATE() evaluates any expression with a modified filter context. It is how you write context-aware measures — computing totals for specific segments, overriding slicer filters, or calculating % of totals.
            </p>
            <CodeBlock col="#FF8A65" label="CALCULATE, ALL, FILTER AND RANKX" code={DAX_FILTER_CODE} />

            <SH n="02c" title="Time Intelligence" col="#107C41" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 12px" }}>
              Time intelligence functions require a <strong style={{ color: "#DDD8F0" }}>proper Date table</strong> marked as such in the model. They enable month-over-month, year-to-date, and same-period-last-year comparisons with just one function call.
            </p>
            <CodeBlock col="#107C41" label="TIME INTELLIGENCE — MOM, YTD, SPLY, RUNNING TOTAL" code={DAX_TIME_CODE} />

            <Box col="#CE93D8" icon="🤖" title="AI Prompt for DAX">
              "Write DAX measures for Power BI for a retail analytics dashboard. I need: (1) Total Revenue, (2) Revenue Month-over-Month % change, (3) Revenue Year-to-Date, (4) Return Rate % = returned orders / total orders, (5) Revenue % of Grand Total ignoring all filters. My table is called 'orders' with columns: revenue, status, order_date."
            </Box>
            <Nav onPrev={() => setSec("pquery")} onNext={() => setSec("visuals")} />
          </div>
        )}

        {/* ── VISUALS ── */}
        {sec === "visuals" && (
          <div>
            <SH n="03" title="Visuals, Formatting and Report Design" col="#107C41" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 16px" }}>
              Power BI has 30+ built-in visuals plus hundreds more in the marketplace. <strong style={{ color: "#DDD8F0" }}>Good formatting separates a professional report from a demo.</strong> Follow these rules consistently and your reports will look like they came from a top consulting firm.
            </p>

            <SH n="03a" title="Essential Visual Types" col="#107C41" />
            <div style={{ border: "1px solid #1A1A2E", borderRadius: 4, overflow: "hidden", margin: "0 0 20px" }}>
              {[
                { viz: "Card",              use: "Single KPI number — Revenue, Margin %, Orders",  tip: "Use Large text size, add a trend indicator. Group 4 cards in a row at top of every report.", col: "#FFD700" },
                { viz: "Bar / Column",      use: "Compare a metric across categories",             tip: "Sort descending. Add data labels. Use horizontal bar (bar chart) for long category names.", col: "#00A4EF" },
                { viz: "Line Chart",        use: "Trends over time",                               tip: "Use date hierarchy for drill-down. Add a forecast using Analytics pane.", col: "#107C41" },
                { viz: "Matrix",            use: "Multi-dimensional table — rows x columns x values", tip: "Enable conditional formatting with colour scales. Add subtotals and grand totals.", col: "#FF8A65" },
                { viz: "KPI Visual",        use: "Metric vs target with trend indicator",          tip: "Requires: Value, Target, Trend axis. Shows green/red based on whether target is met.", col: "#CE93D8" },
                { viz: "Slicer",            use: "Filter control for end users",                   tip: "Use 'Tile' style for small value sets (regions), 'Dropdown' for long lists.", col: "#80DEEA" },
                { viz: "Decomposition Tree", use: "Root cause analysis — drill into what drives a metric", tip: "Right-click a node > AI Splits to let Power BI AI suggest the best dimension to split on.", col: "#F48FB1" },
              ].map((r, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "140px 1fr 1fr", gap: 12, padding: "10px 16px", borderBottom: i < 6 ? "1px solid #0F0F18" : "none", background: i % 2 === 0 ? "#0A0A14" : "#07070E", alignItems: "start" }}>
                  <span style={{ fontSize: 12, color: r.col, fontWeight: 700 }}>{r.viz}</span>
                  <span style={{ fontSize: 12, color: "#888" }}>{r.use}</span>
                  <span style={{ fontSize: 12, color: "#555", fontStyle: "italic" }}>{r.tip}</span>
                </div>
              ))}
            </div>

            <SH n="03b" title="Formatting Rules" col="#107C41" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, margin: "0 0 20px" }}>
              {[
                { rule: "Consistent colour palette", detail: "Pick 3-4 brand colours. Use them for categories. Apply the same colour to the same category across all visuals on the page.", col: "#FFD700" },
                { rule: "Remove visual clutter", detail: "Turn off: chart borders, visual titles if obvious, gridlines, background fills on visuals. White space improves readability.", col: "#00A4EF" },
                { rule: "Conditional formatting", detail: "Format > Data colours > Conditional formatting. Use colour scales on matrices. Red-white-green for performance metrics.", col: "#107C41" },
                { rule: "Align everything", detail: "Select multiple visuals > Format > Align. Use the alignment guides. Misaligned visuals signal a lack of attention to detail.", col: "#FF8A65" },
                { rule: "Use a theme", detail: "View > Themes > browse built-in themes or import a custom JSON theme. Consistent fonts, colours, and styles across the report.", col: "#CE93D8" },
                { rule: "Mobile layout", detail: "View > Mobile Layout. Rearrange visuals for phones. Many stakeholders check dashboards on mobile — this is expected in enterprise.", col: "#80DEEA" },
              ].map((item, i) => (
                <div key={i} style={{ border: "1px solid " + item.col + "22", borderLeft: "3px solid " + item.col, borderRadius: 4, padding: "12px 14px", background: "#0D0D18" }}>
                  <div style={{ fontSize: 12, color: item.col, fontWeight: 700, marginBottom: 6 }}>{item.rule}</div>
                  <div style={{ fontSize: 12, color: "#666", lineHeight: 1.6 }}>{item.detail}</div>
                </div>
              ))}
            </div>
            <Nav onPrev={() => setSec("dax")} onNext={() => setSec("copilot")} />
          </div>
        )}

        {/* ── COPILOT ── */}
        {sec === "copilot" && (
          <div>
            <SH n="04" title="Microsoft Copilot in Power BI" col="#7B68EE" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 16px" }}>
              Microsoft Copilot is embedded directly in Power BI Desktop and Service. It can <strong style={{ color: "#DDD8F0" }}>generate entire report pages from a text description, write DAX measures, summarise a report's insights, and answer questions about your data</strong> — accelerating report building dramatically.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, margin: "0 0 20px" }}>
              {[
                { feat: "Report Generation",  desc: "Describe the report you want in plain English — Copilot builds it", col: "#FFD700"  },
                { feat: "DAX Writing",        desc: "Ask for any measure in English — Copilot writes the DAX formula",  col: "#00A4EF" },
                { feat: "Insight Summary",    desc: "Copilot reads your report and writes a business narrative",         col: "#107C41" },
              ].map((f, i) => (
                <div key={i} style={{ border: "1px solid " + f.col + "33", borderRadius: 4, padding: "14px", background: f.col + "06", textAlign: "center" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: f.col, marginBottom: 4 }}>{f.feat}</div>
                  <div style={{ fontSize: 12, color: "#666", lineHeight: 1.6 }}>{f.desc}</div>
                </div>
              ))}
            </div>

            <CodeBlock col="#7B68EE" label="COPILOT PROMPTS — REPORT AND DAX GENERATION" code={COPILOT_CODE} />

            <SH n="04b" title="Q&A Visual — Natural Language for Stakeholders" col="#7B68EE" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 12px" }}>
              The Q&A visual adds a search box to your report where stakeholders can type questions in plain English and get instant visual answers — without knowing Power BI, DAX, or data analysis.
            </p>
            <CodeBlock col="#00A4EF" label="Q&A VISUAL — SETUP AND EXAMPLE QUERIES" code={QA_CODE} />

            <Box col="#FFD700" icon="⚠️" title="Copilot Availability">
              Copilot in Power BI requires a Microsoft Fabric capacity (F64 or higher) or a Copilot-enabled Power BI Premium workspace. It is not available in the free tier. If you do not have access: use ChatGPT or Claude to write DAX measures from English descriptions — the workflow is identical, the measure just goes into the formula bar manually.
            </Box>

            <Box col="#7B68EE" icon="🤖" title="DAX from Plain English — Works Today Without Copilot">
              Paste this into ChatGPT or Claude: "I am building a Power BI report on retail orders. My table is called 'orders' with columns: revenue (decimal), status (text), order_date (date), region (text), cost (decimal). Write DAX measures for: (1) Total Revenue for Completed orders only, (2) Month-over-Month Revenue Change %, (3) Return Rate %. Use CALCULATE, DATEADD, and proper formatting."
            </Box>
            <Nav onPrev={() => setSec("visuals")} onNext={() => setSec("model")} />
          </div>
        )}

        {/* ── DATA MODEL ── */}
        {sec === "model" && (
          <div>
            <SH n="05" title="Data Modelling in Power BI" col="#FF8A65" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 16px" }}>
              The data model is where your tables connect. <strong style={{ color: "#DDD8F0" }}>A well-designed star schema model is the foundation of fast, accurate Power BI reports.</strong> A poorly-designed model causes wrong numbers, slow reports, and DAX that is impossible to write correctly.
            </p>

            <SH n="05a" title="Star Schema — The Gold Standard" col="#FF8A65" />
            <div style={{ background: "#0A0A14", border: "1px solid #FF8A6533", borderRadius: 4, padding: "20px", margin: "0 0 20px" }}>
              <div style={{ fontSize: 10, color: "#FF8A65", fontFamily: "monospace", letterSpacing: "0.12em", marginBottom: 16 }}>STAR SCHEMA DIAGRAM</div>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
                {[
                  { name: "dim_customers", type: "DIMENSION", col: "#81C784", keys: ["customer_id (PK)", "name", "country", "segment"] },
                  { name: "dim_products",  type: "DIMENSION", col: "#4FC3F7", keys: ["product_id (PK)", "product_name", "category", "cost"] },
                  { name: "dim_date",      type: "DIMENSION", col: "#FFD54F", keys: ["date (PK)", "month", "quarter", "year"] },
                ].map((t, i) => (
                  <div key={i} style={{ border: "1px solid " + t.col + "44", borderRadius: 3, padding: "10px 14px", minWidth: 140, textAlign: "center" }}>
                    <div style={{ fontSize: 11, color: t.col, fontFamily: "monospace", fontWeight: 700 }}>{t.name}</div>
                    <div style={{ fontSize: 9, color: "#555", marginBottom: 6 }}>{t.type}</div>
                    {t.keys.map((k, j) => <div key={j} style={{ fontSize: 10, color: "#666", lineHeight: 1.6 }}>{k}</div>)}
                  </div>
                ))}
              </div>
              <div style={{ textAlign: "center", margin: "12px 0", fontSize: 20, color: "#FF8A65" }}>↕ ↕ ↕</div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <div style={{ border: "2px solid #FF8A65", borderRadius: 4, padding: "14px 20px", minWidth: 220, textAlign: "center" }}>
                  <div style={{ fontSize: 12, color: "#FF8A65", fontFamily: "monospace", fontWeight: 700 }}>fact_orders</div>
                  <div style={{ fontSize: 9, color: "#555", marginBottom: 8 }}>FACT TABLE</div>
                  {["order_id", "customer_id (FK)", "product_id (FK)", "order_date (FK)", "units", "revenue", "status"].map((k, j) => (
                    <div key={j} style={{ fontSize: 10, color: "#AAA", lineHeight: 1.7 }}>{k}</div>
                  ))}
                </div>
              </div>
              <div style={{ marginTop: 12, fontSize: 11, color: "#555", textAlign: "center" }}>
                Fact table (transactions) connects to dimension tables (context) via foreign keys
              </div>
            </div>

            <div style={{ border: "1px solid #1A1A2E", borderRadius: 4, overflow: "hidden", margin: "0 0 20px" }}>
              {[
                { concept: "Fact table",         def: "Contains transactional data — orders, payments, events. Has foreign keys pointing to dimension tables. Typically large.", col: "#FF8A65" },
                { concept: "Dimension table",    def: "Contains descriptive attributes — customers, products, dates. Has a primary key. Typically small. Provides context to facts.", col: "#81C784" },
                { concept: "Relationship",       def: "Connects fact to dimension via matching keys. Always one-to-many (one customer > many orders). Set in Model view.", col: "#4FC3F7" },
                { concept: "Cross-filter direction", def: "Single: filter flows one way (dimension filters fact). Both: bidirectional. Use Single unless you have a specific reason for Both.", col: "#FFD54F" },
                { concept: "Date table",         def: "Required for time intelligence DAX. Must have one row per day with no gaps. Mark as Date Table in Model view.", col: "#CE93D8" },
              ].map((r, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: 14, padding: "11px 16px", borderBottom: i < 4 ? "1px solid #0F0F18" : "none", background: i % 2 === 0 ? "#0A0A14" : "#07070E", alignItems: "start" }}>
                  <span style={{ fontSize: 12, color: r.col, fontWeight: 700 }}>{r.concept}</span>
                  <span style={{ fontSize: 12, color: "#888" }}>{r.def}</span>
                </div>
              ))}
            </div>

            <Box col="#FFD700" icon="💡" title="The Most Common Data Model Mistake">
              Putting all your data in one flat table instead of separating facts from dimensions. This causes: slow performance, inability to write clean DAX, and wrong aggregate numbers. Before building any Power BI report, spend 10 minutes designing the model — fact table in the middle, dimension tables around it, relationships set correctly.
            </Box>
            <Nav onPrev={() => setSec("copilot")} onNext={() => setSec("practice")} />
          </div>
        )}

        {/* ── PRACTICE ── */}
        {sec === "practice" && (
          <div>
            <SH n="06" title="Practice — Build the RetailCo Power BI Report" col="#CE93D8" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 16px" }}>
              Three sequential tasks. By the end you will have a published Power BI report with DAX measures, 4 visuals, slicers, and a shareable link for your portfolio.
            </p>

            <Box col="#CE93D8" icon="🛠️" title="What You Need">
              Power BI Desktop (free download from powerbi.microsoft.com/desktop). RetailCo orders.csv from Phase 1. A free Microsoft account to publish to Power BI Service.
            </Box>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, margin: "20px 0 28px" }}>
              {practiceSteps.map((p, i) => {
                const open = openEx === i;
                const doneCount = p.steps.filter((_, j) => checkedSteps[i + "-" + j]).length;
                const prog = Math.round(doneCount / p.steps.length * 100);
                return (
                  <div key={i} style={{ border: "1px solid " + (open ? p.col + "55" : "#1A1A2E"), borderRadius: 4, overflow: "hidden" }}>
                    <button onClick={() => setOpenEx(open ? null : i)} style={{
                      width: "100%", background: open ? p.col + "0A" : "#0D0D18",
                      border: "none", cursor: "pointer", padding: "16px 20px",
                      display: "flex", alignItems: "center", gap: 14, fontFamily: "inherit", textAlign: "left",
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                          <span style={{ fontSize: 10, color: p.col, background: p.col + "18", padding: "2px 8px", borderRadius: 2, fontFamily: "monospace" }}>{p.task}</span>
                          <span style={{ fontSize: 14, fontWeight: 700, color: "#DDD8F0" }}>{p.title}</span>
                        </div>
                        <div style={{ fontSize: 12, color: "#555" }}>{doneCount}/{p.steps.length} steps complete</div>
                      </div>
                      {open && (
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                          <div style={{ width: 60, height: 4, background: "#1A1A2E", borderRadius: 2, overflow: "hidden" }}>
                            <div style={{ width: prog + "%", height: "100%", background: p.col, borderRadius: 2 }} />
                          </div>
                          <span style={{ fontSize: 10, color: p.col, fontFamily: "monospace" }}>{prog}%</span>
                        </div>
                      )}
                      <span style={{ color: p.col, fontSize: 18, transform: open ? "rotate(45deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }}>+</span>
                    </button>
                    {open && (
                      <div style={{ padding: "0 20px 20px 20px", background: p.col + "06" }}>
                        <div style={{ height: 1, background: p.col + "22", margin: "0 0 14px" }} />
                        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
                          {p.steps.map((step, j) => {
                            const key = i + "-" + j;
                            const done = checkedSteps[key];
                            return (
                              <div key={j} onClick={() => toggleStep(key)} style={{
                                display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 14px",
                                borderRadius: 3, cursor: "pointer",
                                background: done ? p.col + "08" : "#0D0D18",
                                border: "1px solid " + (done ? p.col + "44" : "#1A1A2E"),
                                transition: "all 0.2s",
                              }}>
                                <div style={{ width: 18, height: 18, borderRadius: 3, border: "1.5px solid " + (done ? p.col : "#333"), background: done ? p.col : "none", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                                  {done && <span style={{ fontSize: 10, color: "#07070E", fontWeight: 900 }}>✓</span>}
                                </div>
                                <span style={{ fontSize: 13, color: done ? "#DDD8F0" : "#777", lineHeight: 1.6 }}>{step}</span>
                              </div>
                            );
                          })}
                        </div>
                        <div style={{ background: "rgba(206,147,216,0.05)", border: "1px solid rgba(206,147,216,0.2)", borderRadius: 3, padding: "10px 12px" }}>
                          <span style={{ fontSize: 9, color: "#CE93D8", letterSpacing: "0.15em", fontFamily: "monospace", fontWeight: 700 }}>AI PROMPT</span>
                          <p style={{ fontSize: 12, color: "#CE93D8", margin: "6px 0 0", fontFamily: "monospace", lineHeight: 1.6 }}>{p.aiPrompt}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <Box col="#B2FF59" icon="🚀" title="Add to Your Portfolio">
              When published: copy the Power BI Service report link. Add it to your GitHub README alongside your Tableau Public link. Two live BI tool portfolios side-by-side is a strong signal to any employer who uses Microsoft or mixed-tool environments.
            </Box>
            <Nav onPrev={() => setSec("model")} onNext={() => setSec("quiz")} nxt="Take the Quiz →" />
          </div>
        )}

        {/* ── QUIZ ── */}
        {sec === "quiz" && (
          <div>
            <SH n="07" title="Part 2 Knowledge Check" col={ACC} />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 16px" }}>6 questions on Power Query, DAX, data modelling, and Copilot. Score 4+ to proceed to Part 3.</p>

            {!quiz.done ? (
              <div style={{ margin: "24px 0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
                  <span style={{ fontSize: 11, color: "#555", fontFamily: "monospace" }}>QUESTION {quiz.idx + 1} / {quizData.length}</span>
                  <span style={{ fontSize: 11, color: ACC, fontFamily: "monospace" }}>SCORE: {quiz.score} / {quiz.idx}</span>
                </div>
                <div style={{ height: 3, background: "#1A1A2E", borderRadius: 2, marginBottom: 24, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: (quiz.idx / quizData.length * 100) + "%", background: "linear-gradient(90deg, " + ACC + ", #00A4EF)", transition: "width 0.4s" }} />
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#DDD8F0", lineHeight: 1.65, marginBottom: 20 }}>
                  {quizData[quiz.idx].q}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {quizData[quiz.idx].opts.map((opt, i) => {
                    const sel = quiz.sel === i;
                    const correct = i === quizData[quiz.idx].ans;
                    let bg = "#0D0D18", border = "#1A1A2E", col = "#888";
                    if (quiz.answered) {
                      if (correct) { bg = "rgba(129,199,132,0.08)"; border = "#81C784"; col = "#81C784"; }
                      else if (sel) { bg = "rgba(255,100,100,0.08)"; border = "#FF6464"; col = "#FF6464"; }
                    } else if (sel) { bg = "rgba(255,215,0,0.08)"; border = ACC; col = ACC; }
                    return (
                      <button key={i} onClick={() => answerQ(i)} style={{
                        background: bg, border: "1px solid " + border, borderRadius: 4,
                        padding: "13px 18px", cursor: quiz.answered ? "default" : "pointer",
                        textAlign: "left", fontFamily: "inherit", fontSize: 13, color: col, lineHeight: 1.5, transition: "all 0.2s",
                      }}>
                        <span style={{ marginRight: 10, fontFamily: "monospace", fontSize: 11 }}>{String.fromCharCode(65 + i)}.</span>
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {quiz.answered && (
                  <div style={{ margin: "20px 0 0", padding: "14px 18px", background: "rgba(255,215,0,0.04)", border: "1px solid rgba(255,215,0,0.2)", borderRadius: 4 }}>
                    <div style={{ fontSize: 10, color: ACC, letterSpacing: "0.15em", marginBottom: 6, fontFamily: "monospace" }}>EXPLANATION</div>
                    <p style={{ fontSize: 13, color: "#888", margin: "0 0 14px", lineHeight: 1.7 }}>{quizData[quiz.idx].exp}</p>
                    <button onClick={nextQ} style={{ background: ACC, border: "none", borderRadius: 3, padding: "8px 20px", cursor: "pointer", fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: "#07070E" }}>
                      {quiz.idx < quizData.length - 1 ? "NEXT QUESTION →" : "SEE RESULTS →"}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ margin: "28px 0", textAlign: "center" }}>
                <div style={{ fontSize: 60, marginBottom: 12 }}>
                  {quiz.score >= 5 ? "🏆" : quiz.score >= 4 ? "✅" : "📚"}
                </div>
                <div style={{ fontSize: 44, fontWeight: 900, marginBottom: 8, color: quiz.score >= 5 ? "#81C784" : quiz.score >= 4 ? "#FFD700" : "#FF8A65" }}>
                  {quiz.score} / {quizData.length}
                </div>
                <p style={{ fontSize: 15, color: "#666", marginBottom: 24 }}>
                  {quiz.score === 6 ? "Power BI mastered. On to Part 3 — ThoughtSpot, Looker and the Phase 4 Capstone." : quiz.score >= 4 ? "Good pass. Review any weaker sections before Part 3." : "Revisit DAX and the data model before continuing."}
                </p>
                <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                  <button onClick={() => setQuiz({ idx: 0, sel: null, answered: false, score: 0, done: false })} style={{ background: "none", border: "1px solid #333", borderRadius: 3, padding: "8px 20px", cursor: "pointer", fontFamily: "monospace", fontSize: 11, color: "#555" }}>RETAKE</button>
                  <button onClick={() => setSec("intro")} style={{ background: ACC, border: "none", borderRadius: 3, padding: "8px 24px", cursor: "pointer", fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: "#07070E" }}>REVIEW ↑</button>
                </div>
                <div style={{ marginTop: 40, padding: "22px", background: "#0D0D18", border: "1px solid #1A1A2E", borderRadius: 4, textAlign: "left" }}>
                  <div style={{ fontSize: 11, color: "#555", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 10, fontFamily: "monospace" }}>WHAT IS IN PART 3</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#DDD8F0", marginBottom: 8 }}>ThoughtSpot + Looker + Phase 4 Capstone</div>
                  <p style={{ fontSize: 13, color: "#555", lineHeight: 1.7, margin: "0 0 14px" }}>
                    ThoughtSpot search-driven analytics, Looker Studio with Gemini AI, AI narrative tools, building a self-service analytics culture, and the Phase 4 capstone project combining Tableau, Power BI and Looker into an executive analytics suite.
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {["ThoughtSpot", "Looker Studio", "Gemini AI", "AI narratives", "Self-service analytics", "Phase 4 Capstone"].map(t => (
                      <span key={t} style={{ padding: "3px 10px", background: "rgba(255,215,0,0.07)", border: "1px solid rgba(255,215,0,0.2)", borderRadius: 2, fontSize: 11, color: ACC }}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div style={{ display: "flex", marginTop: 48, paddingTop: 24, borderTop: "1px solid #1A1A2E" }}>
              <button onClick={() => setSec("practice")} style={{ background: "none", border: "1px solid #1A1A2E", borderRadius: 3, padding: "8px 18px", cursor: "pointer", fontFamily: "monospace", fontSize: 11, color: "#555" }}>← Previous</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// ── Shared components ──────────────────────────────────────────
function SH({ n, title, col }) {
  return (
    <div style={{ marginBottom: 28, paddingBottom: 16, borderBottom: "1px solid #1A1A2E" }}>
      <div style={{ fontSize: 10, color: col, letterSpacing: "0.3em", fontFamily: "monospace", marginBottom: 6 }}>SECTION {n}</div>
      <h2 style={{ margin: 0, fontSize: "clamp(20px,3vw,28px)", fontWeight: 900, color: "#DDD8F0", letterSpacing: "-0.01em" }}>
        <span style={{ color: col }}>{n}. </span>{title}
      </h2>
    </div>
  );
}

function CodeBlock({ col, label, code }) {
  return (
    <div style={{ background: "#07070E", border: "1px solid " + col + "22", borderRadius: 3, overflow: "hidden", marginBottom: 16 }}>
      {label && (
        <div style={{ padding: "6px 14px", borderBottom: "1px solid " + col + "22" }}>
          <span style={{ fontSize: 9, color: col, letterSpacing: "0.15em", fontFamily: "monospace", fontWeight: 700 }}>{label}</span>
        </div>
      )}
      <pre style={{ margin: 0, padding: "14px 16px", fontSize: 12, color: col, fontFamily: "monospace", lineHeight: 1.75, overflowX: "auto" }}>{code}</pre>
    </div>
  );
}

function Box({ col, icon, title, children }) {
  return (
    <div style={{ margin: "16px 0", padding: "13px 17px", background: col + "07", border: "1px solid " + col + "28", borderLeft: "3px solid " + col, borderRadius: 4 }}>
      <div style={{ fontSize: 12, color: col, fontWeight: 700, marginBottom: 7 }}>{icon} {title}</div>
      <div style={{ fontSize: 13, color: "#666", lineHeight: 1.8 }}>{children}</div>
    </div>
  );
}

function Nav({ onPrev, onNext, nxt = "Next Section →" }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 48, paddingTop: 24, borderTop: "1px solid #1A1A2E" }}>
      {onPrev
        ? <button onClick={onPrev} style={{ background: "none", border: "1px solid #1A1A2E", borderRadius: 3, padding: "8px 18px", cursor: "pointer", fontFamily: "monospace", fontSize: 11, color: "#555" }}>← Previous</button>
        : <div />}
      {onNext && (
        <button onClick={onNext} style={{ background: "#FFD700", border: "none", borderRadius: 3, padding: "8px 24px", cursor: "pointer", fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: "#07070E" }}>{nxt}</button>
      )}
    </div>
  );
}
