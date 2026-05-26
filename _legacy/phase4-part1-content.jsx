import { useState } from "react";

// All code stored as .join("\n") to avoid JS template literal conflicts

const CONNECT_CODE = [
  "# Tableau connection types:",
  "# File-based: Excel, CSV, JSON, PDF",
  "# Database: MySQL, PostgreSQL, BigQuery, Snowflake",
  "# Cloud: Google Sheets, Salesforce, Amazon Redshift",
  "",
  "# Steps to connect in Tableau Desktop:",
  "# 1. Open Tableau Desktop",
  "# 2. Under 'Connect' panel (left side) click your source type",
  "# 3. For CSV/Excel: browse to your file",
  "# 4. For database: enter server, port, credentials",
  "# 5. Drag tables to the canvas to join them",
  "# 6. Click 'Update Now' to preview data",
  "# 7. Click 'Sheet 1' tab to start building",
  "",
  "# Tableau Public (free) supports:",
  "# CSV, Excel, Google Sheets, JSON, PDF",
  "# Does NOT support live database connections",
].join("\n");

const CALCULATED_FIELD_CODE = [
  "# Calculated Fields in Tableau (syntax guide)",
  "",
  "# Basic arithmetic",
  "[Revenue] - [Cost]                    # Profit",
  "[Profit] / [Revenue]                  # Margin ratio",
  "([Revenue] - [Cost]) / [Revenue]      # Margin %",
  "",
  "# Conditional logic (like Excel IF)",
  "IF [Revenue] >= 1000 THEN 'High'",
  "ELSEIF [Revenue] >= 500 THEN 'Medium'",
  "ELSE 'Low'",
  "END",
  "",
  "# Date calculations",
  "DATEDIFF('day', [Order Date], TODAY())   # Days since order",
  "DATEPART('month', [Order Date])          # Month number",
  "DATENAME('month', [Order Date])          # Month name",
  "",
  "# Aggregate calculations",
  "SUM([Revenue]) / COUNTD([Customer ID])  # Revenue per customer",
  "COUNTD([Order ID])                       # Distinct order count",
  "",
  "# String functions",
  "UPPER([Region])                          # NORTH",
  "LEFT([Product Name], 10)                 # First 10 chars",
  "CONTAINS([Email], '@gmail.com')          # Boolean check",
  "",
  "# LOD (Level of Detail) expressions",
  "{ FIXED [Region] : SUM([Revenue]) }      # Revenue per region (row-level)",
  "{ INCLUDE [Product] : AVG([Revenue]) }   # Avg per product in current view",
  "{ EXCLUDE [Month] : SUM([Revenue]) }     # Total ignoring month filter",
].join("\n");

const LOD_CODE = [
  "# LOD Expressions — Most Powerful Tableau Feature",
  "",
  "# FIXED: compute at specified dimension, ignore view filters",
  "# Use: show region total on every row, even when filtered by product",
  "{ FIXED [Region] : SUM([Revenue]) }",
  "",
  "# INCLUDE: add a dimension not in the view",
  "# Use: average revenue per customer (even if customer not in view)",
  "{ INCLUDE [Customer ID] : SUM([Revenue]) }",
  "",
  "# EXCLUDE: remove a dimension from the computation",
  "# Use: show grand total next to filtered subtotal",
  "{ EXCLUDE [Category] : SUM([Revenue]) }",
  "",
  "# Practical example: % of total for each row",
  "# Create calculated field named [% of Total Revenue]:",
  "SUM([Revenue]) / { FIXED : SUM([Revenue]) }",
  "",
  "# Customer's first order date (for cohort analysis)",
  "{ FIXED [Customer ID] : MIN([Order Date]) }",
  "",
  "# Days since customer's first order (customer lifetime)",
  "DATEDIFF('day',",
  "  { FIXED [Customer ID] : MIN([Order Date]) },",
  "  { FIXED [Customer ID] : MAX([Order Date]) }",
  ")",
].join("\n");

const PARAMETER_CODE = [
  "# Parameters in Tableau",
  "# Parameters let users control values interactively",
  "",
  "# Step 1: Create a Parameter",
  "# Right-click blank area in Data pane > Create Parameter",
  "# Name: [Select Metric]",
  "# Data type: String",
  "# Allowable values: List",
  "# Add values: Revenue, Profit, Orders, Margin %",
  "",
  "# Step 2: Create a calculated field using the parameter",
  "# Name: [Dynamic Metric]",
  "CASE [Select Metric]",
  "  WHEN 'Revenue'  THEN SUM([Revenue])",
  "  WHEN 'Profit'   THEN SUM([Profit])",
  "  WHEN 'Orders'   THEN COUNTD([Order ID])",
  "  WHEN 'Margin %' THEN SUM([Profit]) / SUM([Revenue])",
  "END",
  "",
  "# Step 3: Use [Dynamic Metric] in your chart",
  "# Drag [Dynamic Metric] to Rows or Columns",
  "",
  "# Step 4: Show the parameter control",
  "# Right-click the parameter > Show Parameter",
  "# A dropdown appears on the viz for users to select metric",
].join("\n");

const PULSE_PROMPTS = [
  '"Show me total revenue by region for this month vs last month"',
  '"Which products are driving the revenue decline in Q3?"',
  '"What is the week-over-week change in order volume?"',
  '"Are there any anomalies in my sales data this week?"',
  '"Summarise the key insights from this dashboard"',
  '"Which customers are at risk based on recent purchase patterns?"',
];

const quizData = [
  {
    q: "In Tableau, what is the difference between a Dimension and a Measure?",
    opts: [
      "Dimensions are always numbers, measures are always text",
      "Dimensions are categorical fields used to slice data; Measures are numeric fields that get aggregated",
      "Dimensions go on Rows, Measures always go on Columns",
      "They are the same thing — just different names"
    ],
    ans: 1,
    exp: "Dimensions are categorical fields (Region, Product, Date) — they create headers, groups, and slices. Measures are numeric fields (Revenue, Profit, Units) — they get aggregated (SUM, AVG, COUNT). Tableau auto-classifies fields but you can manually change them."
  },
  {
    q: "What does a LOD expression like { FIXED [Region] : SUM([Revenue]) } do?",
    opts: [
      "Filters the view to show only one region",
      "Computes total revenue per region at the Region level, regardless of any other filters in the view",
      "Creates a parameter for users to select a region",
      "Excludes Revenue from the Region calculation"
    ],
    ans: 1,
    exp: "FIXED LOD expressions compute at the specified dimension level and ignore most view-level filters. { FIXED [Region] : SUM([Revenue]) } always gives you total revenue per region, even if the view is filtered to show only one product. This is one of Tableau's most powerful features."
  },
  {
    q: "What is the purpose of a Tableau Parameter?",
    opts: [
      "To connect to a new data source",
      "To create a user-controllable variable that can dynamically change calculations, filters, or reference lines",
      "To publish a workbook to Tableau Server",
      "To schedule a data refresh"
    ],
    ans: 1,
    exp: "Parameters are user-input variables. A stakeholder can use a dropdown parameter to switch between Revenue, Profit, or Orders on the same chart — without needing multiple worksheets. They power dynamic dashboards where one view shows many possible analyses."
  },
  {
    q: "Tableau Pulse is best described as:",
    opts: [
      "A real-time database connector for live data",
      "An AI feature that auto-generates metric summaries, anomaly alerts, and plain-English explanations of changes in your data",
      "A mobile app for viewing Tableau dashboards",
      "A tool for creating calculated fields with AI assistance"
    ],
    ans: 1,
    exp: "Tableau Pulse uses Einstein AI to automatically monitor metrics, detect anomalies, generate plain-English narratives explaining changes ('Revenue dropped 12% because Electronics returns increased'), and deliver personalised insights to stakeholders — without them needing to open a dashboard."
  },
  {
    q: "What is the correct order to build a Tableau dashboard?",
    opts: [
      "Dashboard > Worksheets > Data source",
      "Data source > Worksheets (individual charts) > Dashboard (assemble charts)",
      "Dashboard > Add filters > Connect data",
      "Filters > Data source > Charts > Dashboard"
    ],
    ans: 1,
    exp: "Always build bottom-up in Tableau: (1) Connect to data source, (2) Build individual worksheets (one chart per sheet), (3) Create a Dashboard and drag worksheets onto it, (4) Add filter actions and interactivity. Never try to build the dashboard before having finished charts."
  },
  {
    q: "Which Tableau chart type is best for showing how revenue is composed across regions and categories simultaneously?",
    opts: [
      "Line chart",
      "Scatter plot",
      "Treemap or stacked bar chart",
      "Histogram"
    ],
    ans: 2,
    exp: "A treemap shows part-to-whole relationships across two dimensions using nested rectangles — size = revenue, colour = category. A stacked bar chart shows the same data allowing easier comparison across regions. Both are better than a pie chart when you have multiple categories and need to compare totals."
  },
];

const sections = [
  { id: "intro",     label: "Overview"     },
  { id: "setup",     label: "Setup"        },
  { id: "basics",    label: "Basics"       },
  { id: "calcs",     label: "Calculations" },
  { id: "dashboard", label: "Dashboards"   },
  { id: "pulse",     label: "Pulse AI"     },
  { id: "practice",  label: "Practice"     },
  { id: "quiz",      label: "Quiz"         },
];

const chartTypes = [
  {
    name: "Bar Chart", icon: "▪", col: "#4FC3F7",
    use: "Compare a metric across categories",
    when: "Which region has highest revenue? How do products rank?",
    how: "Drag Dimension to Rows, Measure to Columns (or Ctrl+drag for both)",
    tip: "Sort descending by default — stakeholders always want to see best first."
  },
  {
    name: "Line Chart", icon: "∕", col: "#81C784",
    use: "Show trends over time",
    when: "Monthly revenue trend, daily order volume, weekly growth rate",
    how: "Drag Date to Columns (right-click > exact date vs truncated), Measure to Rows",
    tip: "Use dual-axis to show revenue (bars) + growth % (line) on one chart."
  },
  {
    name: "Scatter Plot", icon: "⬡", col: "#FFD54F",
    use: "Relationship between two measures",
    when: "Does marketing spend correlate with revenue? Customer value vs frequency",
    how: "One measure on Rows, one on Columns. Add Dimension to Detail for dot labels.",
    tip: "Add a Trend Line (Analytics pane > Trend Line) to show correlation direction."
  },
  {
    name: "Treemap", icon: "▦", col: "#FF8A65",
    use: "Part-to-whole relationships, hierarchical data",
    when: "Revenue contribution by product, customer share by segment",
    how: "Drag Measure to Size, Dimension to Label. Add second Dimension to Color.",
    tip: "Treemaps are great for showing 20+ categories where bar charts get too cramped."
  },
  {
    name: "Heatmap", icon: "▩", col: "#CE93D8",
    use: "Intensity across two categorical dimensions",
    when: "Revenue by region x category, performance by day x hour",
    how: "Drag two Dimensions to Rows/Columns. Drag Measure to Color. Change marks to Square.",
    tip: "Use diverging colour palette (red-white-green) for metrics with a meaningful midpoint like % change."
  },
  {
    name: "Map", icon: "◉", col: "#80DEEA",
    use: "Geographic data — show where things happen",
    when: "Revenue by country/state, customer density, sales territory performance",
    how: "Drag geographic field (Country, State, City) to canvas — Tableau auto-generates map",
    tip: "Use filled maps for aggregate metrics (revenue per state). Use point maps for individual locations."
  },
];

const dashboardPrinciples = [
  {
    n: "01", title: "One question, one dashboard",
    desc: "Every dashboard should answer one specific business question. 'How is sales performing this month?' — everything on the page supports that question. Dashboards that try to show everything show nothing.",
    col: "#4FC3F7"
  },
  {
    n: "02", title: "KPIs first, context second",
    desc: "Place the 3-5 most important numbers at the top-left — that's where eyes land first. Big bold numbers for Revenue, Growth %, Return Rate. Charts below provide context. Tables at bottom for drill-down.",
    col: "#81C784"
  },
  {
    n: "03", title: "Filter actions over separate dashboards",
    desc: "One dashboard with filter actions (clicking a region filters all charts) beats 4 separate regional dashboards. Use Dashboard > Actions > Filter to make every chart a filter control.",
    col: "#FFD54F"
  },
  {
    n: "04", title: "Remove everything that does not earn its place",
    desc: "Delete: gridlines, chart borders, axis tick marks, unnecessary legends, 3D effects, gradient backgrounds. Every pixel either conveys information or creates noise. White space is not wasted space.",
    col: "#FF8A65"
  },
  {
    n: "05", title: "Consistent colour with meaning",
    desc: "Assign one colour per category and use it consistently across all charts. Red = bad/alert, Green = good, Grey = neutral/context. Never use colour just for decoration — every colour should mean something.",
    col: "#CE93D8"
  },
  {
    n: "06", title: "Design for your audience, not for yourself",
    desc: "An executive wants 3 numbers and one trend. An analyst wants 6 charts and a table. A customer success manager wants customer-level data. Know who uses the dashboard and remove everything they do not need.",
    col: "#F48FB1"
  },
];

const practiceSteps = [
  {
    task: "P1", title: "Connect and Explore RetailCo Data",
    col: "#4FC3F7",
    steps: [
      "Open Tableau Public (public.tableau.com/en/software/public/download)",
      "Connect to Text File > browse to your RetailCo orders.csv",
      "In the Data Source tab: verify column types — order_date should be Date, revenue should be Number",
      "If types are wrong: click the icon above each column and change it",
      "Click Sheet 1 tab — explore the Dimensions and Measures panels",
      "Double-click Revenue — Tableau auto-builds a bar chart with SUM(Revenue)",
      "Drag Region to the Columns shelf — now you have revenue by region",
      "Sort descending: click the Sort icon on the axis",
    ],
    aiPrompt: "I connected RetailCo orders.csv to Tableau. I have columns: region, category, product, revenue, units, status, order_date. What 5 charts should I build first to give a sales manager a complete picture?",
  },
  {
    task: "P2", title: "Build 4 Core Charts",
    col: "#81C784",
    steps: [
      "Chart 1 — Bar: Drag Region to Columns, SUM(Revenue) to Rows. Sort descending.",
      "Chart 2 — Line: Drag Order Date to Columns (set to MONTH), SUM(Revenue) to Rows. Completed orders only (drag Status to Filters).",
      "Chart 3 — Treemap: Drag SUM(Revenue) to Size, Category to Color, Product to Label. Ctrl+drag Region to add as second level.",
      "Chart 4 — Scatter: Drag SUM(Units) to Columns, SUM(Revenue) to Rows. Drag Product to Detail. Add Trend Line (Analytics pane).",
      "On each chart: Format > Shading > set worksheet background to white",
      "Remove all gridlines: Format > Lines > set Row/Column dividers to None",
      "Name each sheet: double-click Sheet tab and rename (Revenue by Region, Monthly Trend, etc.)",
    ],
    aiPrompt: "I want to build a line chart in Tableau showing monthly revenue trend for 2024 with completed orders only. Walk me through every step including how to filter to Completed status and how to format the date axis to show month names.",
  },
  {
    task: "P3", title: "Assemble the Dashboard",
    col: "#FFD54F",
    steps: [
      "Click the New Dashboard icon (bottom tab bar) — or Dashboard > New Dashboard",
      "Set size: Fixed size, 1200 x 800px (Dashboard > Size)",
      "From the Sheets panel (left), drag each of your 4 charts onto the canvas",
      "Arrange: Revenue by Region (top-left), Monthly Trend (top-right), Treemap (bottom-left), Scatter (bottom-right)",
      "Add a title text box: 'RetailCo Sales Dashboard 2024' — Dashboard > Objects > Text",
      "Add a filter action: Dashboard > Actions > Add Action > Filter — select Source: any chart, Target: all sheets",
      "Test: click a bar in Revenue by Region — all other charts should filter to that region",
      "Add a Region filter control: drag Region to the Filters card on the dashboard",
    ],
    aiPrompt: "I have 4 Tableau worksheets: Revenue by Region (bar), Monthly Trend (line), Product Treemap, Units vs Revenue Scatter. How do I assemble them into a professional dashboard with filter actions so clicking one chart filters the others?",
  },
];

export default function Phase4Part1() {
  const [sec, setSec] = useState("intro");
  const [openChart, setOpenChart] = useState(null);
  const [openPrinciple, setOpenPrinciple] = useState(null);
  const [openPractice, setOpenPractice] = useState(null);
  const [checkedSteps, setCheckedSteps] = useState({});
  const [quiz, setQuiz] = useState({ idx: 0, sel: null, answered: false, score: 0, done: false });

  const ACC = "#4FC3F7";
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
            P4 · PART 1
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
                PHASE 4 · PART 1 OF 3 · WEEK 11
              </div>
              <h1 style={{ fontSize: "clamp(26px,5vw,44px)", fontWeight: 900, margin: "0 0 16px", lineHeight: 1.12, letterSpacing: "-0.02em" }}>
                Tableau for<br />
                <span style={{ color: ACC }}>Data Analytics</span><br />
                <span style={{ fontStyle: "italic", fontWeight: 400, fontSize: "0.65em", color: "#555" }}>+ Einstein AI and Tableau Pulse</span>
              </h1>
              <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, maxWidth: 580, margin: "0 0 24px" }}>
                Tableau is the world's most widely used data visualisation tool. In this part you will go from connecting your first data source to building production-grade interactive dashboards, writing LOD calculated fields, using parameters for dynamic analysis — and then layering in Tableau Pulse and Einstein AI to generate insights automatically.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {["~5 hours", "Tableau Public (free)", "6 chart types", "Calculated fields", "LOD expressions", "Parameters", "Dashboard design", "Tableau Pulse AI", "6-question quiz"].map(t => (
                  <span key={t} style={{ padding: "4px 12px", background: "rgba(79,195,247,0.08)", border: "1px solid rgba(79,195,247,0.22)", borderRadius: 2, fontSize: 11, color: ACC }}>{t}</span>
                ))}
              </div>
            </div>

            <SH n="00" title="What You Will Learn" col={ACC} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 10, margin: "24px 0 36px" }}>
              {[
                { icon: "⚙️", title: "Setup",            desc: "Install Tableau Public, connect to data, understand the interface", col: "#4FC3F7",  s: "setup"     },
                { icon: "📊", title: "Tableau Basics",   desc: "Dimensions vs Measures, 6 chart types, formatting essentials",    col: "#81C784",  s: "basics"    },
                { icon: "⚡", title: "Calculations",     desc: "Calculated fields, LOD expressions, parameters, table calcs",     col: "#FFD54F",  s: "calcs"     },
                { icon: "📈", title: "Dashboard Design", desc: "6 principles, filter actions, layout, colour, publishing",        col: "#FF8A65",  s: "dashboard" },
                { icon: "🤖", title: "Tableau Pulse AI", desc: "Einstein AI, Pulse metrics, auto-narratives, anomaly detection",  col: "#CE93D8",  s: "pulse"     },
                { icon: "🔨", title: "Practice (3 tasks)", desc: "Connect data → 4 charts → assemble dashboard with filter actions", col: "#F48FB1",  s: "practice"  },
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

            <Box col={ACC} icon="💼" title="Why Tableau is Still Essential in 2025">
              Tableau appears in 68% of data analyst and BI analyst job postings. Despite the rise of AI-powered BI tools, Tableau remains the enterprise standard for complex interactive dashboards. Tableau Public is completely free and lets you publish your work online — making it the single best tool for building a visible analytics portfolio that employers can click through before your interview.
            </Box>
            <Nav onNext={() => setSec("setup")} />
          </div>
        )}

        {/* ── SETUP ── */}
        {sec === "setup" && (
          <div>
            <SH n="01" title="Getting Set Up with Tableau" col="#81C784" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 16px" }}>
              There are two versions of Tableau you can use for free. <strong style={{ color: "#DDD8F0" }}>Tableau Public</strong> is free forever and lets you publish to the cloud. <strong style={{ color: "#DDD8F0" }}>Tableau Desktop</strong> has a 14-day free trial — use it if you have a company email for a student licence.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, margin: "0 0 24px" }}>
              <div style={{ border: "1px solid rgba(178,255,89,0.3)", borderRadius: 4, padding: "16px", background: "rgba(178,255,89,0.04)" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#B2FF59", marginBottom: 10 }}>Tableau Public (Free forever)</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  {["Free, no credit card", "Connect: CSV, Excel, Google Sheets, JSON", "Publish to public.tableau.com", "Cannot connect to live databases", "Best for: portfolio, learning, course exercises"].map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: 8 }}>
                      <span style={{ color: "#B2FF59", flexShrink: 0 }}>{i < 3 ? "✓" : "✗"}</span>
                      <span style={{ fontSize: 12, color: "#888" }}>{item}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 12, padding: "6px 12px", background: "rgba(178,255,89,0.1)", border: "1px solid rgba(178,255,89,0.2)", borderRadius: 3, fontSize: 11, color: "#B2FF59", fontFamily: "monospace" }}>
                  public.tableau.com/en/software/public/download
                </div>
              </div>
              <div style={{ border: "1px solid rgba(79,195,247,0.3)", borderRadius: 4, padding: "16px", background: "rgba(79,195,247,0.04)" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#4FC3F7", marginBottom: 10 }}>Tableau Desktop (14-day trial)</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  {["14-day trial then $35/month", "Connect to any database (MySQL, BigQuery, etc.)", "Publish to Tableau Server/Cloud", "Full enterprise features", "Students: free 1-year licence with edu email"].map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: 8 }}>
                      <span style={{ color: "#4FC3F7", flexShrink: 0 }}>{i === 4 ? "✓" : "→"}</span>
                      <span style={{ fontSize: 12, color: "#888" }}>{item}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 12, padding: "6px 12px", background: "rgba(79,195,247,0.1)", border: "1px solid rgba(79,195,247,0.2)", borderRadius: 3, fontSize: 11, color: "#4FC3F7", fontFamily: "monospace" }}>
                  tableau.com/academic/students
                </div>
              </div>
            </div>

            <SH n="01b" title="The Tableau Interface" col="#81C784" />
            <div style={{ border: "1px solid #1A1A2E", borderRadius: 4, overflow: "hidden", margin: "0 0 20px" }}>
              {[
                { area: "Data pane (left)",    desc: "Lists all fields. Blue = Dimensions (categorical). Green = Measures (numeric). Drag fields from here to shelves.", col: "#4FC3F7" },
                { area: "Columns shelf",       desc: "Fields here become chart columns (x-axis). Dimensions create headers; Measures create axes.", col: "#81C784" },
                { area: "Rows shelf",          desc: "Fields here become chart rows (y-axis). Stacking multiple measures creates multi-row charts.", col: "#FFD54F" },
                { area: "Marks card",          desc: "Controls visual encoding: Color, Size, Label, Detail, Tooltip. Drag fields here to add a third dimension.", col: "#FF8A65" },
                { area: "Filters card",        desc: "Drag any field here to filter the view. Right-click > Show Filter to expose it to dashboard users.", col: "#CE93D8" },
                { area: "Analytics pane",      desc: "Add reference lines, trend lines, forecasts, and cluster analysis without writing calculations.", col: "#F48FB1" },
                { area: "Sheet / Dashboard tabs", desc: "Bottom bar. Each sheet = one chart. Dashboard = assembled collection of charts.", col: "#80DEEA" },
              ].map((r, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: 14, padding: "10px 16px", borderBottom: i < 6 ? "1px solid #0F0F18" : "none", background: i % 2 === 0 ? "#0A0A14" : "#07070E", alignItems: "start" }}>
                  <span style={{ fontSize: 12, color: r.col, fontWeight: 700 }}>{r.area}</span>
                  <span style={{ fontSize: 12, color: "#888" }}>{r.desc}</span>
                </div>
              ))}
            </div>

            <CodeBlock col="#81C784" label="CONNECTING TO DATA" code={CONNECT_CODE} />
            <Nav onPrev={() => setSec("intro")} onNext={() => setSec("basics")} />
          </div>
        )}

        {/* ── BASICS ── */}
        {sec === "basics" && (
          <div>
            <SH n="02" title="Tableau Basics — 6 Chart Types" col="#FFD54F" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 16px" }}>
              Every Tableau chart is built the same way: drag a field to Columns, drag another to Rows, and Tableau picks the best chart type. Understanding <strong style={{ color: "#DDD8F0" }}>which chart to use for which question</strong> is what separates analysts who communicate clearly from those who just show data.
            </p>

            <Box col="#FFD54F" icon="🔑" title="The Golden Rule: Show > Tell">
              The right chart makes the answer obvious in under 5 seconds. If a stakeholder needs to read a legend, compare numbers in a table, or ask "what does this mean?" — the chart is wrong. Always ask: can someone understand the key insight from this chart without me explaining it?
            </Box>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, margin: "20px 0 28px" }}>
              {chartTypes.map((c, i) => {
                const open = openChart === i;
                return (
                  <div key={i} style={{ border: "1px solid " + (open ? c.col + "55" : "#1A1A2E"), borderRadius: 4, overflow: "hidden" }}>
                    <button onClick={() => setOpenChart(open ? null : i)} style={{
                      width: "100%", background: open ? c.col + "0A" : "#0D0D18",
                      border: "none", cursor: "pointer", padding: "14px 20px",
                      display: "flex", alignItems: "center", gap: 16, fontFamily: "inherit", textAlign: "left",
                    }}>
                      <span style={{ fontSize: 20, color: c.col, fontFamily: "monospace" }}>{c.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: c.col }}>{c.name}</div>
                        {!open && <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>{c.use}</div>}
                      </div>
                      <span style={{ color: c.col, fontSize: 18, transform: open ? "rotate(45deg)" : "none", transition: "transform 0.2s" }}>+</span>
                    </button>
                    {open && (
                      <div style={{ padding: "0 20px 20px 20px", background: c.col + "06" }}>
                        <div style={{ height: 1, background: c.col + "22", margin: "0 0 14px" }} />
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
                          <div>
                            <span style={{ fontSize: 9, color: c.col, letterSpacing: "0.15em", fontFamily: "monospace", fontWeight: 700 }}>USE FOR</span>
                            <p style={{ fontSize: 13, color: "#AAA", margin: "6px 0 0" }}>{c.use}</p>
                          </div>
                          <div>
                            <span style={{ fontSize: 9, color: c.col, letterSpacing: "0.15em", fontFamily: "monospace", fontWeight: 700 }}>EXAMPLE QUESTION</span>
                            <p style={{ fontSize: 13, color: "#AAA", margin: "6px 0 0" }}>{c.when}</p>
                          </div>
                          <div>
                            <span style={{ fontSize: 9, color: c.col, letterSpacing: "0.15em", fontFamily: "monospace", fontWeight: 700 }}>HOW TO BUILD</span>
                            <p style={{ fontSize: 13, color: "#AAA", margin: "6px 0 0" }}>{c.how}</p>
                          </div>
                        </div>
                        <div style={{ background: "rgba(255,213,79,0.05)", border: "1px solid rgba(255,213,79,0.2)", borderRadius: 3, padding: "8px 12px" }}>
                          <span style={{ fontSize: 12, color: "#FFD54F" }}>💡 {c.tip}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <Box col="#CE93D8" icon="🤖" title="AI Prompt — Chart Recommendation">
              "I have a Tableau data source with fields: Region (text), Category (text), Product (text), Revenue (number), Units (number), Order Date (date), Status (text). I want to show a sales manager how revenue is trending over time broken down by category. What chart type should I use and how do I build it step by step in Tableau?"
            </Box>
            <Nav onPrev={() => setSec("setup")} onNext={() => setSec("calcs")} />
          </div>
        )}

        {/* ── CALCULATIONS ── */}
        {sec === "calcs" && (
          <div>
            <SH n="03" title="Calculated Fields, LODs and Parameters" col="#FF8A65" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 16px" }}>
              Calculated fields are the most powerful feature in Tableau. They let you <strong style={{ color: "#DDD8F0" }}>create new fields from existing data</strong> — computing margins, applying business logic, building dynamic metrics, and performing analysis impossible with raw fields alone.
            </p>

            <SH n="03a" title="Calculated Fields — Basic and Conditional" col="#FF8A65" />
            <CodeBlock col="#FF8A65" label="CALCULATED FIELD SYNTAX REFERENCE" code={CALCULATED_FIELD_CODE} />

            <Box col="#FF8A65" icon="💡" title="How to Create a Calculated Field">
              In Tableau: right-click any blank space in the Data pane and select "Create Calculated Field". Name it, write the formula, and click OK. The new field appears in your Data pane like any other field — drag it to shelves and marks like normal.
            </Box>

            <SH n="03b" title="LOD Expressions — Level of Detail" col="#CE93D8" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 12px" }}>
              LOD expressions are Tableau's most advanced feature — and the most asked-about in interviews. They let you <strong style={{ color: "#DDD8F0" }}>compute a metric at a different level of granularity than the current view</strong>.
            </p>
            <CodeBlock col="#CE93D8" label="LOD EXPRESSIONS — FIXED, INCLUDE, EXCLUDE" code={LOD_CODE} />

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, margin: "16px 0 24px" }}>
              {[
                { type: "FIXED", use: "Compute at specified dimension, ignore view filters", col: "#4FC3F7", ex: "{ FIXED [Region] : SUM([Revenue]) }" },
                { type: "INCLUDE", use: "Add a dimension not currently in the view", col: "#81C784", ex: "{ INCLUDE [Customer ID] : SUM([Revenue]) }" },
                { type: "EXCLUDE", use: "Remove a dimension from the computation", col: "#FFD54F", ex: "{ EXCLUDE [Category] : SUM([Revenue]) }" },
              ].map((r, i) => (
                <div key={i} style={{ border: "1px solid " + r.col + "33", borderRadius: 4, padding: "14px", background: r.col + "06" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: r.col, marginBottom: 6 }}>{r.type}</div>
                  <div style={{ fontSize: 12, color: "#888", marginBottom: 10, lineHeight: 1.6 }}>{r.use}</div>
                  <code style={{ fontSize: 11, color: r.col, fontFamily: "monospace" }}>{r.ex}</code>
                </div>
              ))}
            </div>

            <SH n="03c" title="Parameters — User-Controlled Variables" col="#80DEEA" />
            <CodeBlock col="#80DEEA" label="CREATING A DYNAMIC METRIC PARAMETER" code={PARAMETER_CODE} />

            <Box col="#CE93D8" icon="🤖" title="AI Prompt for Tableau Calculations">
              "Write a Tableau calculated field that: (1) calculates gross margin % as (revenue - cost) / revenue, (2) classifies it as Good if above 30%, Acceptable if 20-30%, Poor if below 20%. Also write an LOD expression to show each product's revenue as a % of its category total."
            </Box>
            <Nav onPrev={() => setSec("basics")} onNext={() => setSec("dashboard")} />
          </div>
        )}

        {/* ── DASHBOARD ── */}
        {sec === "dashboard" && (
          <div>
            <SH n="04" title="Dashboard Design Principles" col="#CE93D8" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 16px" }}>
              A dashboard is not a collection of charts — it is a <strong style={{ color: "#DDD8F0" }}>decision-support tool</strong>. The best dashboards make the right action obvious without requiring any explanation. These six principles are what separate professional analyst work from academic exercises.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 8, margin: "0 0 24px" }}>
              {dashboardPrinciples.map((p, i) => {
                const open = openPrinciple === i;
                return (
                  <div key={i} style={{ border: "1px solid " + (open ? p.col + "55" : "#1A1A2E"), borderRadius: 4, overflow: "hidden" }}>
                    <button onClick={() => setOpenPrinciple(open ? null : i)} style={{
                      width: "100%", background: open ? p.col + "0A" : "#0D0D18",
                      border: "none", cursor: "pointer", padding: "14px 20px",
                      display: "flex", alignItems: "center", gap: 14, fontFamily: "inherit", textAlign: "left",
                    }}>
                      <span style={{ fontSize: 10, color: p.col, fontFamily: "monospace", fontWeight: 700, minWidth: 24 }}>{p.n}</span>
                      <div style={{ flex: 1, fontSize: 14, fontWeight: 700, color: "#DDD8F0" }}>{p.title}</div>
                      <span style={{ color: p.col, fontSize: 18, transform: open ? "rotate(45deg)" : "none", transition: "transform 0.2s" }}>+</span>
                    </button>
                    {open && (
                      <div style={{ padding: "0 20px 16px 58px", background: p.col + "06" }}>
                        <div style={{ height: 1, background: p.col + "22", margin: "0 0 12px" }} />
                        <p style={{ fontSize: 13, color: "#AAA", margin: 0, lineHeight: 1.7 }}>{p.desc}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <SH n="04b" title="Dashboard Layout Wireframe" col="#CE93D8" />
            <div style={{ border: "1px solid #1A1A2E", borderRadius: 4, padding: "16px", background: "#0A0A14", margin: "0 0 20px" }}>
              <div style={{ fontSize: 10, color: "#555", fontFamily: "monospace", letterSpacing: "0.15em", marginBottom: 14 }}>RETAILCO TABLEAU DASHBOARD LAYOUT</div>
              <div style={{ background: "#0D0D18", border: "1px solid #CE93D844", borderRadius: 3, padding: "8px 14px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "#CE93D8", fontWeight: 700 }}>RetailCo Sales Dashboard 2024</span>
                <div style={{ display: "flex", gap: 8 }}>
                  <span style={{ fontSize: 10, color: "#555", border: "1px solid #333", borderRadius: 2, padding: "2px 8px" }}>Region ▾</span>
                  <span style={{ fontSize: 10, color: "#555", border: "1px solid #333", borderRadius: 2, padding: "2px 8px" }}>Status ▾</span>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6, marginBottom: 8 }}>
                {["💰 $142K Revenue", "📈 34.2% Margin", "📦 1,204 Orders", "↩️ 15% Returns"].map((k, i) => (
                  <div key={i} style={{ background: "#0D0D18", border: "1px solid #4FC3F733", borderRadius: 3, padding: "10px", textAlign: "center" }}>
                    <div style={{ fontSize: 9, color: "#4FC3F7", fontFamily: "monospace" }}>{k}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 6, marginBottom: 6 }}>
                <div style={{ background: "#0D0D18", border: "1px solid #81C78433", borderRadius: 3, padding: "10px", height: 70 }}>
                  <div style={{ fontSize: 9, color: "#81C784", fontFamily: "monospace", marginBottom: 6 }}>MONTHLY REVENUE TREND (Line)</div>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 40 }}>
                    {[35, 42, 38, 55, 48, 65, 58, 72, 68, 80, 90, 100].map((h, j) => (
                      <div key={j} style={{ flex: 1, height: h + "%", background: "#81C784", borderRadius: "2px 2px 0 0", opacity: 0.6 }} />
                    ))}
                  </div>
                </div>
                <div style={{ background: "#0D0D18", border: "1px solid #FF8A6533", borderRadius: 3, padding: "10px", height: 70 }}>
                  <div style={{ fontSize: 9, color: "#FF8A65", fontFamily: "monospace", marginBottom: 6 }}>REVENUE BY REGION (Bar)</div>
                  {["North 38%", "South 27%", "East 21%", "West 14%"].map((r, j) => (
                    <div key={j} style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 3 }}>
                      <div style={{ width: [38, 27, 21, 14][j] + "%", height: 5, background: "#FF8A65", borderRadius: 2, opacity: 0.7 }} />
                      <span style={{ fontSize: 8, color: "#555", fontFamily: "monospace" }}>{r}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ background: "#0D0D18", border: "1px solid #CE93D833", borderRadius: 3, padding: "8px 12px" }}>
                <div style={{ fontSize: 9, color: "#CE93D8", fontFamily: "monospace", marginBottom: 4 }}>PRODUCT TREEMAP — click to filter all charts</div>
                <div style={{ display: "flex", gap: 4, height: 30 }}>
                  {[
                    { w: "40%", col: "#4FC3F7", label: "Electronics" },
                    { w: "28%", col: "#81C784", label: "Clothing" },
                    { w: "20%", col: "#FFD54F", label: "Home" },
                    { w: "12%", col: "#FF8A65", label: "Beauty" },
                  ].map((seg, j) => (
                    <div key={j} style={{ width: seg.w, background: seg.col, borderRadius: 2, opacity: 0.6, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: 8, color: "#07070E", fontWeight: 700 }}>{seg.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Box col="#CE93D8" icon="🤖" title="AI Prompt for Dashboard Design">
              "I have 4 Tableau worksheets for a sales dashboard: Revenue by Region (bar), Monthly Trend (line), Product Treemap, Return Rate by Category (bar). Describe the ideal layout, where each chart should go, what KPI numbers to show at the top, what filters to add, and how to connect the charts with filter actions."
            </Box>
            <Nav onPrev={() => setSec("calcs")} onNext={() => setSec("pulse")} />
          </div>
        )}

        {/* ── PULSE AI ── */}
        {sec === "pulse" && (
          <div>
            <SH n="05" title="Tableau Pulse and Einstein AI" col="#CE93D8" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 16px" }}>
              Tableau Pulse is Tableau's AI-powered metrics layer. Instead of stakeholders logging in and building their own views, <strong style={{ color: "#DDD8F0" }}>Pulse proactively delivers personalised metric summaries, anomaly alerts, and plain-English explanations</strong> directly to their inbox or Slack — without them needing to know anything about Tableau.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, margin: "0 0 20px" }}>
              {[
                { feat: "Auto-narratives", desc: "Plain-English explanation of why a metric changed — not just that it changed", col: "#4FC3F7" },
                { feat: "Anomaly detection", desc: "Einstein AI flags unexpected spikes or drops before you notice them manually", col: "#81C784" },
                { feat: "Personalised digests", desc: "Each stakeholder gets insights relevant to their role, delivered on a schedule", col: "#FFD54F" },
              ].map((f, i) => (
                <div key={i} style={{ border: "1px solid " + f.col + "33", borderRadius: 4, padding: "14px", background: f.col + "06", textAlign: "center" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: f.col, marginBottom: 4 }}>{f.feat}</div>
                  <div style={{ fontSize: 12, color: "#666", lineHeight: 1.6 }}>{f.desc}</div>
                </div>
              ))}
            </div>

            <SH n="05a" title="Tableau Pulse — How It Works" col="#CE93D8" />
            <div style={{ border: "1px solid #1A1A2E", borderRadius: 4, overflow: "hidden", margin: "0 0 20px" }}>
              {[
                { step: "1", title: "Define a Metric", desc: "In Tableau Cloud: go to Metrics > New Metric. Connect to a published data source. Define the metric (e.g. Total Revenue = SUM(Revenue)), its time dimension, and filters.", col: "#4FC3F7" },
                { step: "2", title: "Set Context", desc: "Tell Pulse how to interpret changes: comparison period (vs last week/month), business rules (higher is better), sensitivity for anomaly alerts.", col: "#81C784" },
                { step: "3", title: "Subscribe stakeholders", desc: "Add team members to the metric. They receive personalised email or Slack digests without ever opening Tableau Desktop.", col: "#FFD54F" },
                { step: "4", title: "Einstein explains changes", desc: "When revenue drops 12%, Pulse generates: 'Revenue decreased 12% vs last week. Electronics returns increased 40% — this category drove most of the decline.'", col: "#FF8A65" },
                { step: "5", title: "Natural language questions", desc: "Stakeholders can ask follow-up questions directly in the Pulse interface: 'Which region was most affected?' — Einstein answers from the data.", col: "#CE93D8" },
              ].map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 14, padding: "12px 16px", borderBottom: i < 4 ? "1px solid #0F0F18" : "none", background: i % 2 === 0 ? "#0A0A14" : "#07070E", alignItems: "flex-start" }}>
                  <div style={{ width: 26, height: 26, borderRadius: "50%", background: s.col + "18", border: "1px solid " + s.col + "44", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: 10, color: s.col, fontWeight: 700 }}>{s.step}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#DDD8F0" }}>{s.title}</div>
                    <div style={{ fontSize: 12, color: "#666", marginTop: 3, lineHeight: 1.6 }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <SH n="05b" title="Einstein Copilot — Natural Language to Viz" col="#CE93D8" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 16px" }}>
              Einstein Copilot (in Tableau Cloud) lets you type a question in plain English and have Tableau build the chart automatically. It reads your schema, generates the calculation, and builds the visualisation — the equivalent of asking a Tableau expert to build a chart for you in real time.
            </p>

            <div style={{ background: "#07070E", border: "1px solid #CE93D833", borderRadius: 4, padding: "16px 18px", margin: "0 0 20px" }}>
              <div style={{ fontSize: 9, color: "#CE93D8", letterSpacing: "0.15em", fontFamily: "monospace", fontWeight: 700, marginBottom: 14 }}>EINSTEIN COPILOT EXAMPLE PROMPTS</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {PULSE_PROMPTS.map((p, i) => (
                  <div key={i} style={{ background: "rgba(206,147,216,0.05)", border: "1px solid rgba(206,147,216,0.2)", borderRadius: 3, padding: "8px 12px" }}>
                    <code style={{ fontSize: 12, color: "#CE93D8", fontFamily: "monospace" }}>{p}</code>
                  </div>
                ))}
              </div>
            </div>

            <Box col="#FFD54F" icon="⚠️" title="Tableau Pulse and Einstein Copilot Availability">
              Tableau Pulse and Einstein Copilot require a Tableau Cloud subscription (not available in Tableau Public). If you do not have access: use ChatGPT or Claude with your Tableau workbook description to simulate the same workflow. Ask "I have this Tableau dashboard with these metrics. What insights should I highlight and why?"
            </Box>
            <Nav onPrev={() => setSec("dashboard")} onNext={() => setSec("practice")} />
          </div>
        )}

        {/* ── PRACTICE ── */}
        {sec === "practice" && (
          <div>
            <SH n="06" title="Practice — Build the RetailCo Dashboard" col="#F48FB1" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 16px" }}>
              Three sequential practice tasks that build on each other. By the end you will have a complete, published, interactive Tableau dashboard using the RetailCo dataset.
            </p>

            <Box col="#F48FB1" icon="🛠️" title="What You Need">
              Tableau Public installed. RetailCo orders.csv from Phase 1 Part 4. Internet connection to publish to Tableau Public at the end.
            </Box>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, margin: "20px 0 28px" }}>
              {practiceSteps.map((p, i) => {
                const open = openPractice === i;
                const doneCount = p.steps.filter((_, j) => checkedSteps[i + "-" + j]).length;
                const prog = Math.round(doneCount / p.steps.length * 100);
                return (
                  <div key={i} style={{ border: "1px solid " + (open ? p.col + "55" : "#1A1A2E"), borderRadius: 4, overflow: "hidden" }}>
                    <button onClick={() => setOpenPractice(open ? null : i)} style={{
                      width: "100%", background: open ? p.col + "0A" : "#0D0D18",
                      border: "none", cursor: "pointer", padding: "16px 20px",
                      display: "flex", alignItems: "center", gap: 14, fontFamily: "inherit", textAlign: "left",
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                          <span style={{ fontSize: 10, color: p.col, background: p.col + "18", padding: "2px 8px", borderRadius: 2, fontFamily: "monospace" }}>{p.task}</span>
                          <span style={{ fontSize: 14, fontWeight: 700, color: "#DDD8F0" }}>{p.title}</span>
                        </div>
                        {!open && <div style={{ fontSize: 12, color: "#555" }}>{doneCount}/{p.steps.length} steps complete</div>}
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

            <Box col="#B2FF59" icon="🚀" title="Publish to Tableau Public">
              When your dashboard is complete: File > Save to Tableau Public. Sign in with your Tableau Public account. Your dashboard gets a shareable URL like public.tableau.com/app/profile/yourname. Add this link to your GitHub README, LinkedIn, and CV. Tableau Public dashboards are the single most-clicked item on a data analyst's portfolio.
            </Box>
            <Nav onPrev={() => setSec("pulse")} onNext={() => setSec("quiz")} nxt="Take the Quiz →" />
          </div>
        )}

        {/* ── QUIZ ── */}
        {sec === "quiz" && (
          <div>
            <SH n="07" title="Part 1 Knowledge Check" col={ACC} />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 16px" }}>6 questions on Tableau fundamentals, LODs, parameters, and Tableau Pulse. Score 4+ to proceed to Part 2.</p>

            {!quiz.done ? (
              <div style={{ margin: "24px 0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
                  <span style={{ fontSize: 11, color: "#555", fontFamily: "monospace" }}>QUESTION {quiz.idx + 1} / {quizData.length}</span>
                  <span style={{ fontSize: 11, color: ACC, fontFamily: "monospace" }}>SCORE: {quiz.score} / {quiz.idx}</span>
                </div>
                <div style={{ height: 3, background: "#1A1A2E", borderRadius: 2, marginBottom: 24, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: (quiz.idx / quizData.length * 100) + "%", background: "linear-gradient(90deg, " + ACC + ", #81C784)", transition: "width 0.4s" }} />
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
                    } else if (sel) { bg = "rgba(79,195,247,0.08)"; border = ACC; col = ACC; }
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
                  <div style={{ margin: "20px 0 0", padding: "14px 18px", background: "rgba(79,195,247,0.04)", border: "1px solid rgba(79,195,247,0.2)", borderRadius: 4 }}>
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
                <div style={{ fontSize: 44, fontWeight: 900, marginBottom: 8, color: quiz.score >= 5 ? "#81C784" : quiz.score >= 4 ? "#FFD54F" : "#FF8A65" }}>
                  {quiz.score} / {quizData.length}
                </div>
                <p style={{ fontSize: 15, color: "#666", marginBottom: 24 }}>
                  {quiz.score === 6 ? "Tableau fundamentals mastered. On to Part 2 — Power BI + Microsoft Copilot." : quiz.score >= 4 ? "Good pass. Review any weaker sections before Part 2." : "Revisit the Calculations and Dashboard sections before moving on."}
                </p>
                <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                  <button onClick={() => setQuiz({ idx: 0, sel: null, answered: false, score: 0, done: false })} style={{ background: "none", border: "1px solid #333", borderRadius: 3, padding: "8px 20px", cursor: "pointer", fontFamily: "monospace", fontSize: 11, color: "#555" }}>RETAKE</button>
                  <button onClick={() => setSec("intro")} style={{ background: ACC, border: "none", borderRadius: 3, padding: "8px 24px", cursor: "pointer", fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: "#07070E" }}>REVIEW ↑</button>
                </div>
                <div style={{ marginTop: 40, padding: "22px", background: "#0D0D18", border: "1px solid #1A1A2E", borderRadius: 4, textAlign: "left" }}>
                  <div style={{ fontSize: 11, color: "#555", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 10, fontFamily: "monospace" }}>WHAT IS IN PART 2</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#DDD8F0", marginBottom: 8 }}>Power BI + Microsoft Copilot</div>
                  <p style={{ fontSize: 13, color: "#555", lineHeight: 1.7, margin: "0 0 14px" }}>
                    Power Query ETL, DAX measures, data modelling, Power BI Copilot for report generation from text prompts, Q&A visual for natural language queries, and publishing to Power BI Service.
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {["Power Query", "DAX", "Data modelling", "Power BI Copilot", "Q&A visual", "Publishing"].map(t => (
                      <span key={t} style={{ padding: "3px 10px", background: "rgba(79,195,247,0.07)", border: "1px solid rgba(79,195,247,0.2)", borderRadius: 2, fontSize: 11, color: ACC }}>{t}</span>
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
        <button onClick={onNext} style={{ background: "#4FC3F7", border: "none", borderRadius: 3, padding: "8px 24px", cursor: "pointer", fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: "#07070E" }}>{nxt}</button>
      )}
    </div>
  );
}
