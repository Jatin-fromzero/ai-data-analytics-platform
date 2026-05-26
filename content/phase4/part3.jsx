"use client";
// @ts-nocheck
import { useState } from "react";

// All code stored as .join("\n") arrays — no template literal conflicts

const LOOKER_CONNECT_CODE = [
  "# Looker Studio — connect BigQuery data source",
  "# Go to: lookerstudio.google.com",
  "# Click: Create > Report > Add Data > BigQuery",
  "",
  "# Step 1: Select your GCP project",
  "# Step 2: Select dataset (e.g. retailco)",
  "# Step 3: Select table (e.g. orders)",
  "# Step 4: Click Add > Add to Report",
  "",
  "# You can blend multiple data sources:",
  "# Resource > Manage Added Data Sources > Add a Data Source",
  "# Then use Resource > Add a Blend > join on a shared key",
  "",
  "# Calculated fields in Looker Studio:",
  "# Edit Data Source > Add a Field > write formula",
  "Revenue = units * price",
  "Margin_Pct = (revenue - cost) / revenue",
  "Is_Completed = CASE WHEN status = 'Completed' THEN 1 ELSE 0 END",
].join("\n");

const LOOKER_GEMINI_CODE = [
  "# Gemini AI in Looker Studio",
  "# Click the Gemini sparkle icon (top right of editor)",
  "",
  "# Text-to-chart prompts:",
  "\"Show total revenue by region as a bar chart\"",
  "\"Create a line chart of monthly revenue trend for 2024\"",
  "\"Add a scorecard for total orders this month\"",
  "\"Show return rate by product category\"",
  "",
  "# Insight generation prompts:",
  "\"Summarise the key trends in this dashboard\"",
  "\"What is driving the revenue drop in Q3?\"",
  "\"Which region is underperforming vs target?\"",
  "",
  "# Auto-narrative (Looker Studio Pro feature):",
  "# Insert > Gemini Insights > select a chart",
  "# Gemini writes a plain-English paragraph",
  "# describing what the chart shows",
].join("\n");

const THOUGHTSPOT_CODE = [
  "# ThoughtSpot — search-driven analytics",
  "# Free trial: thoughtspot.com/trial",
  "",
  "# Natural language search examples:",
  "# Type these directly in the ThoughtSpot search bar:",
  "",
  "revenue by region",
  "top 10 products by revenue 2024",
  "monthly orders where status = completed",
  "revenue growth this year vs last year",
  "customers with more than 5 orders",
  "return rate by category pie chart",
  "",
  "# ThoughtSpot AI (Spotter) — conversational analytics:",
  "# Click the Spotter AI icon",
  "# Ask: 'Why did revenue drop in August?'",
  "# Spotter analyses the data and responds with:",
  "# - The root cause (e.g. Electronics returns spiked)",
  "# - Supporting evidence charts",
  "# - Suggested follow-up questions",
].join("\n");

const NARRATIVE_CODE = [
  "# AI Narrative Tools — auto-generate text from data",
  "",
  "# Option 1: Looker Studio Gemini Insights (free)",
  "# Insert > Gemini Insights > select chart > generate",
  "# Output: 'Revenue grew 23% in Q4 driven by Electronics'",
  "",
  "# Option 2: Narrative Science / Quill (enterprise)",
  "# Connects to Tableau/Power BI > generates full reports",
  "",
  "# Option 3: Write your own with ChatGPT/Claude",
  "# Prompt template:",
  "\"My dashboard shows: Revenue = $142K (+18% MoM),",
  " Top region = North (38%), Return rate = 15%.",
  " Electronics returns increased 40% vs last month.",
  " Write a 3-bullet executive summary in plain English",
  " that a non-technical CEO can act on immediately.\"",
  "",
  "# Option 4: Python + OpenAI API (custom narratives)",
  "# See Phase 5 for building narrative automation pipelines",
].join("\n");

const CAPSTONE_EDA_CODE = [
  "// Looker Studio — connect all 3 tables",
  "// 1. Resource > Manage Data Sources > Add",
  "// 2. Connect: orders, customers, products (3 separate sources)",
  "// 3. Resource > Add a Blend",
  "//    Primary: orders | Left join: customers on customer_id",
  "//    Left join: products on product_id",
  "",
  "// Calculated fields to create in the blended source:",
  "revenue    = units * price",
  "profit     = units * (price - cost)",
  "margin_pct = (profit / revenue) * 100",
  "is_returned = CASE WHEN status = 'Returned' THEN 1 ELSE 0 END",
].join("\n");

const quizData = [
  {
    q: "What makes ThoughtSpot fundamentally different from Tableau and Power BI?",
    opts: [
      "It only works with Google Cloud data",
      "It uses a search-first interface — users type natural language questions and get instant visualisations, rather than building charts manually",
      "It is a Python-based tool for data scientists only",
      "It can only display pre-built dashboards"
    ],
    ans: 1,
    exp: "ThoughtSpot is built around search-driven analytics. Instead of dragging fields onto a canvas, users type 'revenue by region 2024' and get an instant chart. Its AI (Spotter) can also answer conversational questions about why metrics changed. This makes it ideal for self-service analytics at scale — business users can get answers without needing an analyst."
  },
  {
    q: "Looker Studio is best described as:",
    opts: [
      "A paid enterprise BI tool like Tableau Desktop",
      "A free, web-based reporting tool by Google that connects to BigQuery, Sheets, and 800+ data sources, with Gemini AI for chart generation",
      "A Python library for creating interactive charts",
      "A database management tool"
    ],
    ans: 1,
    exp: "Looker Studio (formerly Google Data Studio) is completely free. It connects to BigQuery, Google Sheets, Google Analytics, and 800+ partner connectors. Gemini AI can generate charts from text prompts and write narrative summaries. It is the best free BI tool for anyone already using Google Workspace or BigQuery."
  },
  {
    q: "What is a 'self-service analytics culture' and why does it matter?",
    opts: [
      "A culture where analysts build all reports themselves without stakeholder input",
      "An environment where business users can answer their own data questions without needing to request reports from analysts — reducing bottlenecks and increasing data-driven decision making",
      "A strategy to replace all analysts with AI tools",
      "An approach where only senior leaders have access to dashboards"
    ],
    ans: 1,
    exp: "Self-service analytics culture means stakeholders can answer their own questions using BI tools — without waiting for analysts to build custom reports. Tools like ThoughtSpot (search), Power BI Q&A, and Tableau's Ask Data enable this. Analysts shift from report-builders to data infrastructure owners and insight generators."
  },
  {
    q: "Gemini AI in Looker Studio can do which of the following?",
    opts: [
      "Only format and colour charts automatically",
      "Generate charts from natural language prompts, write narrative summaries of chart insights, and suggest relevant metrics to track",
      "Connect to databases that Looker Studio does not support natively",
      "Replace the need for calculated fields"
    ],
    ans: 1,
    exp: "Gemini in Looker Studio can: generate new chart visuals from text prompts ('show monthly revenue trend'), write Gemini Insights — plain-English paragraphs describing what a chart shows, and proactively suggest insights from your data. It requires signing into Google and enabling the Gemini features in Looker Studio settings."
  },
  {
    q: "What is the primary output of a Phase 4 capstone executive analytics suite?",
    opts: [
      "A Python notebook with visualisations",
      "Three connected live dashboards — Tableau for operations, Power BI for finance, Looker Studio for executives — with a one-page written narrative explaining the key findings",
      "A single spreadsheet with pivot tables",
      "A machine learning model"
    ],
    ans: 1,
    exp: "The Phase 4 capstone delivers an enterprise analytics suite: three BI tools each used for their strengths (Tableau for complex interactivity, Power BI for Microsoft-integrated reporting, Looker Studio for free shareable dashboards), plus a written executive narrative that tells the story of the data. This combination demonstrates full BI tool competency to employers."
  },
  {
    q: "When presenting data insights to an executive, you should lead with:",
    opts: [
      "The methodology and data sources used to produce the analysis",
      "The business implication and recommended action — then support it with evidence from the data",
      "A full technical explanation of all the DAX measures and LOD expressions",
      "All charts and tables first, conclusions last"
    ],
    ans: 1,
    exp: "Executives make decisions, not analyse data. Lead with: 'Revenue is down 12% — we recommend investigating Electronics returns which increased 40% last month.' Then show the evidence. Pyramid principle: conclusion first, then supporting data. Never make a busy executive hunt through 10 charts to find the key message."
  },
];

const flashcards = [
  { q: "What are the 4 BI tools covered in Phase 4 and what is each best for?", a: "Tableau: complex interactive dashboards and custom visualisations. Power BI: Microsoft 365 integration, DAX calculations, enterprise reporting. Looker Studio: free, Google-integrated, shareable links. ThoughtSpot: search-driven self-service, AI-powered root cause analysis." },
  { q: "What is a LOD expression in Tableau? Give an example.", a: "Level of Detail expression — computes a metric at a different granularity than the current view. FIXED: { FIXED [Region] : SUM([Revenue]) } — total revenue per region regardless of other filters. INCLUDE adds a dimension; EXCLUDE removes one." },
  { q: "What is CALCULATE() in DAX and why is it the most important function?", a: "CALCULATE(expression, filter1, filter2...) evaluates any measure with modified filters. It overrides the natural filter context of a visual. Used for: region-specific totals, % of grand total with ALL(), time intelligence, and context-aware measures. Without CALCULATE, most useful DAX cannot be written." },
  { q: "What is the difference between Power Query and DAX in Power BI?", a: "Power Query runs before data loads — it is for ETL (cleaning, reshaping, merging). DAX runs after data loads — it is for calculations (measures, calculated columns). Both are required. Power Query = prepare the data. DAX = analyse the data." },
  { q: "What is a star schema and why does it matter for Power BI?", a: "A star schema has one fact table (transactions) in the centre connected to multiple dimension tables (customers, products, dates) via foreign keys. It enables clean DAX, fast query performance, and correct cross-filtering. A flat single table causes wrong numbers and slow reports." },
  { q: "Name 3 ways AI is integrated into modern BI tools.", a: "1. Text-to-chart: Gemini in Looker Studio, Einstein Copilot in Tableau, Copilot in Power BI — type a prompt, get a chart. 2. Auto-narratives: AI writes plain-English summaries of what a chart shows. 3. Anomaly detection: Tableau Pulse and Power BI Anomaly Detection flag unexpected metric changes automatically." },
  { q: "What is the Pyramid Principle for presenting data insights?", a: "Lead with your conclusion (the 'so what'), then provide supporting evidence (charts, numbers), then show methodology if asked. Executives want the recommendation first, not the journey. 'Revenue is down 12% — here is why and what to do' beats showing 8 charts then explaining what they mean." },
  { q: "What is ThoughtSpot Spotter and what does it do?", a: "Spotter is ThoughtSpot's conversational AI. Users ask 'Why did revenue drop in August?' and Spotter analyses the data, identifies the root cause (e.g. a spike in returns for Electronics), generates supporting charts, and suggests follow-up questions — all in natural language." },
  { q: "What 6 dashboard design principles should you follow?", a: "1. One question per dashboard. 2. KPIs first, context second. 3. Filter actions over separate dashboards. 4. Remove everything that does not earn its place. 5. Consistent colour with meaning. 6. Design for your audience, not for yourself." },
  { q: "What is DAX time intelligence and what does it require?", a: "Time intelligence functions (DATESYTD, DATEADD, SAMEPERIODLASTYEAR) compute period comparisons automatically. They require a proper Date table — one row per day, no gaps, marked as Date Table in Power BI. Without a Date table, time intelligence functions return errors." },
  { q: "How does Looker Studio data blending work?", a: "Looker Studio can join multiple data sources on a shared key. Resource > Add a Blend > select primary source, add secondary sources, set join keys and join type. The blended source acts as a single merged table for charts. Useful for joining orders to customers or products without ETL." },
  { q: "What makes a portfolio-ready BI dashboard?", a: "Live shareable link (Tableau Public, Power BI Service, Looker Studio). Real dataset — not synthetic toy data. Multiple interacting charts with filter actions. Clean design with consistent colours and no clutter. A written README explaining the business question it answers. Measures that demonstrate DAX or calculated field knowledge." },
];

const sections = [
  { id: "intro",      label: "Overview"     },
  { id: "thoughtspot", label: "ThoughtSpot" },
  { id: "looker",     label: "Looker"       },
  { id: "narrative",  label: "Narratives"   },
  { id: "selfservice", label: "Self-Service" },
  { id: "capstone",   label: "Capstone"     },
  { id: "review",     label: "Review"       },
  { id: "quiz",       label: "Quiz"         },
];

export default function Phase4Part3() {
  const [sec, setSec] = useState("intro");
  const [flipped, setFlipped] = useState({});
  const [activeTask, setActiveTask] = useState(null);
  const [checkedSteps, setCheckedSteps] = useState({});
  const [scores, setScores] = useState({});
  const [quiz, setQuiz] = useState({ idx: 0, sel: null, answered: false, score: 0, done: false });

  const ACC = "#FF8A65";

  const rubricRows = [
    { task: "T1 Looker Studio Dashboard",  max: 25, criteria: "3+ charts, 2+ filters, Gemini AI used, shareable link" },
    { task: "T2 ThoughtSpot Exploration",  max: 20, criteria: "5+ searches, Spotter AI used, 3 findings documented" },
    { task: "T3 Tableau Dashboard",        max: 20, criteria: "Published to Tableau Public, filter actions working" },
    { task: "T4 Power BI Report",          max: 20, criteria: "Published to Power BI Service, DAX measures present" },
    { task: "T5 Executive Narrative",      max: 15, criteria: "1-page written summary, pyramid structure, 3 actions" },
  ];
  const maxScore = rubricRows.reduce((a, r) => a + r.max, 0);
  const totalScore = rubricRows.reduce((a, r) => a + (scores[r.task] || 0), 0);
  const pct = totalScore > 0 ? Math.round(totalScore / maxScore * 100) : 0;

  const setScore = (task, val) => {
    const max = rubricRows.find(r => r.task === task).max;
    setScores(p => ({ ...p, [task]: Math.min(max, Math.max(0, Number(val))) }));
  };
  const toggleStep = (k) => setCheckedSteps(p => ({ ...p, [k]: !p[k] }));
  const flipCard = (i) => setFlipped(p => ({ ...p, [i]: !p[i] }));
  const answerQ = (i) => {
    if (quiz.answered) return;
    setQuiz(q => ({ ...q, sel: i, answered: true, score: q.score + (i === quizData[q.idx].ans ? 1 : 0) }));
  };
  const nextQ = () => {
    if (quiz.idx + 1 >= quizData.length) setQuiz(q => ({ ...q, done: true }));
    else setQuiz(q => ({ ...q, idx: q.idx + 1, sel: null, answered: false }));
  };

  const capstoneTasks = [
    {
      num: "T1", title: "Looker Studio Executive Dashboard", col: "#4FC3F7", weight: 25,
      objective: "Build a free, shareable Looker Studio dashboard connected to your RetailCo BigQuery dataset.",
      steps: [
        "Go to lookerstudio.google.com and sign in with your Google account",
        "Create > Report > Add Data > BigQuery > select your ecommerce_capstone dataset",
        "Add a blended data source joining orders + customers + products (Resource > Add a Blend)",
        "Create calculated fields: revenue = units * price, margin_pct = (revenue-cost)/revenue * 100",
        "Add 4 KPI scorecards: Total Revenue, Gross Margin %, Return Rate, Total Customers",
        "Add a time series chart: Monthly Revenue Trend (use order_date as time dimension)",
        "Add a bar chart: Revenue by Region (sorted descending)",
        "Add a table: Top 10 Products by Revenue with conditional formatting",
        "Add a Date Range filter and a Region dropdown filter — connect to all charts",
        "Click Gemini sparkle icon > generate one Gemini Insight for the revenue trend chart",
        "Share > Anyone with link can view > copy the URL for your portfolio",
      ],
      aiPrompt: "I am building a Looker Studio dashboard connected to BigQuery. My blended source has: order_id, customer_id, region, category, product, units, price, cost, status, order_date, country. Write calculated field formulas for: revenue, gross profit, margin %, return rate, and a CASE statement classifying margin as Good/Acceptable/Poor.",
    },
    {
      num: "T2", title: "ThoughtSpot Exploration", col: "#81C784", weight: 20,
      objective: "Use ThoughtSpot's search-driven interface to find 3 business insights about RetailCo data.",
      steps: [
        "Go to thoughtspot.com/trial and start a free trial",
        "Upload RetailCo orders.csv (or connect to BigQuery if available)",
        "Try 5 natural language searches — start simple: 'revenue by region', 'top 10 products by revenue'",
        "Try time-based searches: 'monthly orders 2024', 'revenue growth this year vs last year'",
        "Try filter searches: 'revenue where status = completed by category'",
        "Click the Spotter AI icon > ask: 'What is driving the highest return rate?'",
        "Save 3 charts as a Liveboard (ThoughtSpot's dashboard equivalent)",
        "Document 3 findings: what question you asked, what the answer was, what action you would recommend",
      ],
      aiPrompt: "I am using ThoughtSpot for the first time with a retail orders dataset (columns: region, category, product, units, price, status, order_date). Give me 10 natural language search queries that would surface the most useful business insights for a sales manager.",
    },
    {
      num: "T3", title: "Polish and Publish Tableau Dashboard", col: "#FF8A65", weight: 20,
      objective: "Finalise and publish your RetailCo Tableau dashboard from Part 1 with professional formatting.",
      steps: [
        "Open your Phase 4 Part 1 Tableau workbook",
        "Apply consistent colour palette across all 4 charts (use the Color pane)",
        "Remove all chart borders: Format > Shading > uncheck 'Default'",
        "Add a calculated field for Gross Margin %: ([Revenue] - [Cost]) / [Revenue]",
        "Add a LOD for % of total: SUM([Revenue]) / { FIXED : SUM([Revenue]) }",
        "Create a parameter: [Select Metric] with options Revenue, Profit, Orders",
        "Update one chart to use the parameter so stakeholders can switch metrics",
        "Add a tooltip to each chart with relevant context details",
        "File > Save to Tableau Public — copy the shareable URL",
        "Add the Tableau Public link to your GitHub portfolio README",
      ],
      aiPrompt: "I have a Tableau dashboard with 4 charts: Revenue by Region (bar), Monthly Trend (line), Product Treemap, and Scatter (units vs revenue). Walk me through adding a parameter that lets users switch between Revenue, Profit, and Orders across all 4 charts simultaneously.",
    },
    {
      num: "T4", title: "Polish and Publish Power BI Report", col: "#FFD700", weight: 20,
      objective: "Finalise and publish your RetailCo Power BI report from Part 2 with advanced DAX.",
      steps: [
        "Open your Phase 4 Part 2 Power BI file",
        "Add a DAX measure: Revenue MoM % = see Part 2 time intelligence section",
        "Add a DAX measure: Revenue % of Total using ALL(orders)",
        "Add a KPI visual: Total Revenue as value, previous month as target",
        "Add a Decomposition Tree visual > right-click a node > AI Splits",
        "Apply consistent theme: View > Themes > browse built-in options",
        "Set up Mobile Layout: View > Mobile Layout > rearrange for phones",
        "Home > Publish > My Workspace — then open in Power BI Service",
        "In Power BI Service: try inserting a Q&A visual on a new report page",
        "Share the report link and add it to your GitHub portfolio README",
      ],
      aiPrompt: "I have a Power BI report with measures: Total Revenue, Total Orders, Return Rate. Add these DAX measures: (1) Revenue vs previous month as absolute change, (2) Revenue vs previous month as % change, (3) Revenue running total YTD. I have a Date table called DateTable with a Date column.",
    },
    {
      num: "T5", title: "Executive Analytics Narrative", col: "#CE93D8", weight: 15,
      objective: "Write a one-page executive summary that brings together insights from all three dashboards.",
      steps: [
        "Review all three dashboards: Looker Studio, Tableau, Power BI",
        "Identify the 3 most important business findings across all dashboards",
        "Write an Executive Summary headline: 'RetailCo Q4 Performance: Key Actions Required'",
        "Use Pyramid Principle: Lead with conclusion, then evidence, then methodology",
        "Finding 1: State the finding + number + which dashboard shows it + recommended action",
        "Finding 2: Same structure as Finding 1",
        "Finding 3: Same structure as Finding 2",
        "Add a 'Data Notes' section: date range, tables used, any caveats",
        "Format as a PDF or Google Doc — professional font, 1 page maximum",
        "Add links to all three live dashboards at the bottom of the document",
      ],
      aiPrompt: "I have 3 BI dashboards showing RetailCo data. Key findings: (1) Revenue up 18% MoM driven by North region, (2) Electronics return rate is 67% vs 15% average — the biggest risk, (3) Q4 cohort retains 48% at Month 1 vs Q1 cohort at 38% — product improving. Write a one-page executive summary using the Pyramid Principle that a CEO can act on in 5 minutes.",
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#07070E", color: "#DDD8F0", fontFamily: "Georgia, serif" }}>

      {/* NAV */}
      <div style={{ background: "#0A0A14", borderBottom: "1px solid #16162A", padding: "0 24px", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 940, margin: "0 auto", display: "flex", alignItems: "center", overflowX: "auto" }}>
          <div style={{ fontSize: 10, color: ACC, letterSpacing: "0.2em", textTransform: "uppercase", padding: "14px 20px 14px 0", borderRight: "1px solid #1A1A2E", marginRight: 12, whiteSpace: "nowrap" }}>
            P4 · PART 3
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
                PHASE 4 · PART 3 OF 3 · CAPSTONE
              </div>
              <h1 style={{ fontSize: "clamp(26px,5vw,44px)", fontWeight: 900, margin: "0 0 16px", lineHeight: 1.12, letterSpacing: "-0.02em" }}>
                ThoughtSpot + Looker<br />
                <span style={{ color: ACC }}>+ Phase 4 Capstone</span><br />
                <span style={{ fontStyle: "italic", fontWeight: 400, fontSize: "0.65em", color: "#555" }}>AI Narratives and Executive Analytics Suite</span>
              </h1>
              <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, maxWidth: 580, margin: "0 0 24px" }}>
                The final part of Phase 4 completes your BI tool mastery. You will learn ThoughtSpot's search-driven analytics, Looker Studio with Gemini AI, AI narrative tools, and self-service analytics culture. Then you will build the Phase 4 Capstone — a complete executive analytics suite using all four BI tools, with a written narrative tying the insights together.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {["~6 hours", "ThoughtSpot", "Looker Studio", "Gemini AI", "AI narratives", "Self-service analytics", "5-task capstone", "100 marks", "12 review flashcards"].map(t => (
                  <span key={t} style={{ padding: "4px 12px", background: "rgba(255,138,101,0.08)", border: "1px solid rgba(255,138,101,0.22)", borderRadius: 2, fontSize: 11, color: ACC }}>{t}</span>
                ))}
              </div>
            </div>

            <SH n="00" title="What You Will Learn" col={ACC} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 10, margin: "24px 0 36px" }}>
              {[
                { icon: "🔍", title: "ThoughtSpot",         desc: "Search-driven analytics, Spotter AI, root cause analysis, Liveboards", col: "#81C784",  s: "thoughtspot"  },
                { icon: "📊", title: "Looker Studio",        desc: "Free Google BI, Gemini AI charts, data blending, shareable dashboards", col: "#4FC3F7",  s: "looker"       },
                { icon: "📝", title: "AI Narratives",        desc: "Auto-generated insights, Gemini Insights, custom narrative prompts",   col: "#FFD54F",  s: "narrative"    },
                { icon: "🏢", title: "Self-Service Culture", desc: "Enabling business users to answer their own questions — analyst as enabler", col: "#CE93D8",  s: "selfservice"  },
                { icon: "🏆", title: "Phase 4 Capstone",    desc: "5-task executive analytics suite across all 4 BI tools + written narrative", col: "#FF8A65",  s: "capstone"    },
                { icon: "🧠", title: "Review",               desc: "12 flashcards covering all of Phase 4 — Tableau, Power BI, Looker, ThoughtSpot", col: "#F48FB1",  s: "review"       },
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

            <Box col={ACC} icon="🏆" title="Phase 4 Capstone — What You Are Building">
              An executive analytics suite — four live dashboards (Tableau, Power BI, Looker Studio, ThoughtSpot Liveboard) covering different aspects of RetailCo performance, plus a one-page written executive narrative using the Pyramid Principle. This is the type of deliverable a senior data analyst produces for a quarterly business review. All four dashboards shareable via public links for your portfolio.
            </Box>
            <Nav onNext={() => setSec("thoughtspot")} />
          </div>
        )}

        {/* ── THOUGHTSPOT ── */}
        {sec === "thoughtspot" && (
          <div>
            <SH n="01" title="ThoughtSpot — Search-Driven Analytics" col="#81C784" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 16px" }}>
              ThoughtSpot flips the BI model. Instead of analysts building dashboards for stakeholders to consume, <strong style={{ color: "#DDD8F0" }}>stakeholders search their data directly like a Google search</strong> — and get instant, AI-generated visualisations. No SQL, no drag-and-drop, no waiting for a report request to be fulfilled.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, margin: "0 0 20px" }}>
              {[
                { stat: "< 1 sec", label: "to get an answer from a search", col: "#81C784" },
                { stat: "0",       label: "SQL or BI skills required by users", col: "#4FC3F7" },
                { stat: "Free",    label: "trial at thoughtspot.com/trial", col: "#FFD54F" },
              ].map((s, i) => (
                <div key={i} style={{ border: "1px solid " + s.col + "33", borderRadius: 4, padding: "16px", background: s.col + "06", textAlign: "center" }}>
                  <div style={{ fontSize: 26, fontWeight: 900, color: s.col, marginBottom: 4 }}>{s.stat}</div>
                  <div style={{ fontSize: 12, color: "#666" }}>{s.label}</div>
                </div>
              ))}
            </div>

            <SH n="01a" title="How ThoughtSpot Works" col="#81C784" />
            <div style={{ border: "1px solid #1A1A2E", borderRadius: 4, overflow: "hidden", margin: "0 0 20px" }}>
              {[
                { step: "1", title: "Connect your data",       desc: "Connect ThoughtSpot to BigQuery, Snowflake, Databricks, or upload a CSV. ThoughtSpot indexes all columns.", col: "#4FC3F7" },
                { step: "2", title: "Type a search",           desc: "Go to Search Data > type natural language: 'revenue by region 2024'. ThoughtSpot parses intent and queries the data.", col: "#81C784" },
                { step: "3", title: "Get instant chart",       desc: "ThoughtSpot auto-selects the best chart type (bar, line, pie) based on what you asked and displays results instantly.", col: "#FFD54F" },
                { step: "4", title: "Ask Spotter AI why",      desc: "Click the Spotter AI icon: ask 'Why did revenue drop in August?' Spotter analyses and explains root cause with supporting charts.", col: "#FF8A65" },
                { step: "5", title: "Pin to Liveboard",        desc: "Click the pin icon to save any chart to a Liveboard (ThoughtSpot's dashboard). Share the Liveboard link with stakeholders.", col: "#CE93D8" },
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

            <CodeBlock col="#81C784" label="THOUGHTSPOT SEARCH EXAMPLES" code={THOUGHTSPOT_CODE} />

            <SH n="01b" title="ThoughtSpot vs Traditional BI" col="#81C784" />
            <div style={{ border: "1px solid #1A1A2E", borderRadius: 4, overflow: "hidden", margin: "0 0 20px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 0, padding: "10px 16px", background: "#0D0D18", borderBottom: "1px solid #1A1A2E" }}>
                <span style={{ fontSize: 9, color: "#555", letterSpacing: "0.12em", fontFamily: "monospace" }}>ASPECT</span>
                <span style={{ fontSize: 9, color: "#4FC3F7", letterSpacing: "0.12em", fontFamily: "monospace" }}>TRADITIONAL BI (Tableau/Power BI)</span>
                <span style={{ fontSize: 9, color: "#81C784", letterSpacing: "0.12em", fontFamily: "monospace" }}>THOUGHTSPOT</span>
              </div>
              {[
                { aspect: "Who builds charts",  trad: "Analyst builds, stakeholder views",    ts: "Stakeholder builds instantly via search" },
                { aspect: "Time to insight",    trad: "Hours to days (report request queue)", ts: "Seconds (type and press Enter)" },
                { aspect: "Skills required",    trad: "Drag-and-drop, DAX/LOD knowledge",     ts: "None — natural language only" },
                { aspect: "Best for",           trad: "Curated dashboards, complex visuals",   ts: "Ad-hoc questions, self-service scale" },
                { aspect: "AI integration",     trad: "Copilot, Einstein (add-ons)",           ts: "Native — Spotter AI built into search" },
              ].map((r, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 0, padding: "10px 16px", borderBottom: i < 4 ? "1px solid #0F0F18" : "none", background: i % 2 === 0 ? "#0A0A14" : "#07070E" }}>
                  <span style={{ fontSize: 12, color: "#888", fontWeight: 700 }}>{r.aspect}</span>
                  <span style={{ fontSize: 12, color: "#666" }}>{r.trad}</span>
                  <span style={{ fontSize: 12, color: "#81C784" }}>{r.ts}</span>
                </div>
              ))}
            </div>
            <Nav onPrev={() => setSec("intro")} onNext={() => setSec("looker")} />
          </div>
        )}

        {/* ── LOOKER ── */}
        {sec === "looker" && (
          <div>
            <SH n="02" title="Looker Studio + Gemini AI" col="#4FC3F7" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 16px" }}>
              Looker Studio is Google's free, web-based BI tool — the natural partner to BigQuery. With <strong style={{ color: "#DDD8F0" }}>800+ connectors, collaborative editing, and Gemini AI for chart generation</strong>, it is the best free option for building shareable dashboards quickly, especially for organisations already using Google Workspace.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, margin: "0 0 20px" }}>
              {[
                { feat: "Free forever",     desc: "No subscription, no credit card, no row limits on reports", col: "#4FC3F7" },
                { feat: "800+ connectors",  desc: "BigQuery, Sheets, GA4, Ads, SQL, and hundreds of partner tools", col: "#81C784" },
                { feat: "Shareable links",  desc: "Anyone with a Google account can view — no Looker licence required", col: "#FFD54F" },
              ].map((f, i) => (
                <div key={i} style={{ border: "1px solid " + f.col + "33", borderRadius: 4, padding: "14px", background: f.col + "06", textAlign: "center" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: f.col, marginBottom: 4 }}>{f.feat}</div>
                  <div style={{ fontSize: 12, color: "#666", lineHeight: 1.6 }}>{f.desc}</div>
                </div>
              ))}
            </div>

            <CodeBlock col="#4FC3F7" label="LOOKER STUDIO — CONNECTING AND CALCULATED FIELDS" code={LOOKER_CONNECT_CODE} />
            <CodeBlock col="#34A853" label="GEMINI AI IN LOOKER STUDIO — PROMPTS" code={LOOKER_GEMINI_CODE} />

            <SH n="02b" title="Looker Studio vs Tableau vs Power BI" col="#4FC3F7" />
            <div style={{ border: "1px solid #1A1A2E", borderRadius: 4, overflow: "hidden", margin: "0 0 20px" }}>
              {[
                { tool: "Looker Studio", cost: "Free",      strength: "Google ecosystem, shareable, no install",      weakness: "Limited advanced visualisations, no offline", col: "#4FC3F7" },
                { tool: "Tableau",       cost: "$70/month",  strength: "Most powerful visuals, LOD, complex analysis", weakness: "Expensive, steeper learning curve",           col: "#FF8A65" },
                { tool: "Power BI",      cost: "Free + $10", strength: "Microsoft integration, DAX, strong data model", weakness: "Less flexible design than Tableau",           col: "#FFD700" },
              ].map((r, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "110px 80px 1fr 1fr", gap: 12, padding: "11px 16px", borderBottom: i < 2 ? "1px solid #0F0F18" : "none", background: i % 2 === 0 ? "#0A0A14" : "#07070E", alignItems: "start" }}>
                  <span style={{ fontSize: 12, color: r.col, fontWeight: 700 }}>{r.tool}</span>
                  <span style={{ fontSize: 11, color: "#555", fontFamily: "monospace" }}>{r.cost}</span>
                  <span style={{ fontSize: 12, color: "#888" }}>{r.strength}</span>
                  <span style={{ fontSize: 12, color: "#555", fontStyle: "italic" }}>{r.weakness}</span>
                </div>
              ))}
            </div>

            <Box col="#34A853" icon="🤖" title="AI Prompt for Looker Studio">
              "I am building a Looker Studio dashboard connected to BigQuery. My blended data source has: region, category, product, units, price, cost, status, order_date, country. I want to build: 4 KPI scorecards, a monthly trend line, a revenue by region bar chart, and a product performance table. Walk me through each chart including the dimension, metric, and any calculated fields I need."
            </Box>
            <Nav onPrev={() => setSec("thoughtspot")} onNext={() => setSec("narrative")} />
          </div>
        )}

        {/* ── NARRATIVES ── */}
        {sec === "narrative" && (
          <div>
            <SH n="03" title="AI Narrative Tools" col="#FFD54F" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 16px" }}>
              The gap between a chart and a decision is a sentence. <strong style={{ color: "#DDD8F0" }}>AI narrative tools bridge that gap</strong> by automatically generating plain-English summaries of what data shows — so stakeholders understand the insight without needing to interpret the visualisation themselves.
            </p>

            <CodeBlock col="#FFD54F" label="AI NARRATIVE OPTIONS — FROM FREE TO ENTERPRISE" code={NARRATIVE_CODE} />

            <SH n="03a" title="The Pyramid Principle for Data Narratives" col="#FFD54F" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 16px" }}>
              The Pyramid Principle (Barbara Minto, McKinsey) is the standard framework for executive communication. <strong style={{ color: "#DDD8F0" }}>Lead with the conclusion. Support with evidence. Methodology last if at all.</strong>
            </p>
            <div style={{ border: "1px solid #FFD54F33", borderRadius: 4, overflow: "hidden", margin: "0 0 20px" }}>
              <div style={{ background: "rgba(255,213,79,0.06)", padding: "16px 18px", borderBottom: "1px solid #FFD54F22" }}>
                <div style={{ fontSize: 10, color: "#FFD54F", fontFamily: "monospace", letterSpacing: "0.12em", marginBottom: 14 }}>PYRAMID PRINCIPLE — APPLIED TO DATA INSIGHTS</div>
                {[
                  { level: "01 — CONCLUSION", text: "Electronics returns are causing a 12% revenue decline and require immediate product quality review.", col: "#FFD54F", size: 14 },
                  { level: "02 — KEY POINTS", text: "Electronics return rate is 67% vs 15% average. Returns spiked in August by 40%. North region most affected. Affects $18K of revenue per month.", col: "#FF8A65", size: 13 },
                  { level: "03 — EVIDENCE", text: "Source: RetailCo orders dataset, Aug-Oct 2024, 40 completed orders. Looker Studio dashboard, Power BI return analysis. Verified against raw data.", col: "#888", size: 12 },
                ].map((r, i) => (
                  <div key={i} style={{ display: "flex", gap: 14, marginBottom: i < 2 ? 14 : 0, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 9, color: r.col, fontFamily: "monospace", fontWeight: 700, minWidth: 110, paddingTop: 2 }}>{r.level}</span>
                    <span style={{ fontSize: r.size, color: r.col, lineHeight: 1.65 }}>{r.text}</span>
                  </div>
                ))}
              </div>
              <div style={{ padding: "10px 18px", background: "#07070E" }}>
                <span style={{ fontSize: 12, color: "#555" }}>Executives read top to bottom — if they stop after the first sentence, they still got the key message. Data analysts who lead with charts lose the audience before they make the point.</span>
              </div>
            </div>

            <SH n="03b" title="AI Narrative Prompt Templates" col="#FFD54F" />
            <div style={{ display: "flex", flexDirection: "column", gap: 8, margin: "0 0 24px" }}>
              {[
                { label: "Executive 3-bullet summary", prompt: "My dashboard shows: [paste your 3-5 key metrics and numbers]. Write a 3-bullet executive summary for a CEO. Lead with the most important business impact. Keep each bullet under 2 sentences. End with a specific recommended action.", col: "#FFD54F" },
                { label: "Root cause narrative", prompt: "Revenue declined 12% in Q3 vs Q2. Electronics returns increased 40%. North region was most affected. Write a paragraph explaining the root cause in plain English for a sales manager with no analytics background.", col: "#FF8A65" },
                { label: "Positive performance summary", prompt: "Revenue grew 23% MoM. Champions segment increased by 15 customers. Q4 cohort retaining at 48% vs Q1 at 38%. Write a brief positive performance summary for a company all-hands presentation.", col: "#81C784" },
              ].map((item, i) => (
                <div key={i} style={{ border: "1px solid " + item.col + "33", borderLeft: "3px solid " + item.col, borderRadius: 4, padding: "14px 16px", background: "#0D0D18" }}>
                  <div style={{ fontSize: 12, color: item.col, fontWeight: 700, marginBottom: 8 }}>{item.label}</div>
                  <code style={{ fontSize: 12, color: "#888", fontFamily: "monospace", lineHeight: 1.6 }}>{item.prompt}</code>
                </div>
              ))}
            </div>
            <Nav onPrev={() => setSec("looker")} onNext={() => setSec("selfservice")} />
          </div>
        )}

        {/* ── SELF-SERVICE ── */}
        {sec === "selfservice" && (
          <div>
            <SH n="04" title="Building a Self-Service Analytics Culture" col="#CE93D8" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 16px" }}>
              The biggest bottleneck in most data teams is not the analysis — it is the <strong style={{ color: "#DDD8F0" }}>queue of report requests from stakeholders who cannot answer their own questions</strong>. Self-service analytics culture eliminates this bottleneck by enabling business users to get their own answers — and frees analysts to focus on higher-value work.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, margin: "0 0 24px" }}>
              <div style={{ border: "1px solid rgba(255,100,100,0.3)", borderRadius: 4, padding: "16px", background: "rgba(255,100,100,0.04)" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#FF6464", marginBottom: 10 }}>Without self-service</div>
                {["Stakeholder emails analyst: 'Can you pull revenue by region for last month?'", "Analyst adds to backlog — 2 day wait", "Analyst builds report in 1 hour", "Stakeholder asks a follow-up question", "Another 2 day wait", "Analyst spends 60% of time on report requests"].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, marginBottom: 5 }}>
                    <span style={{ color: "#FF6464", flexShrink: 0 }}>✗</span>
                    <span style={{ fontSize: 12, color: "#888" }}>{item}</span>
                  </div>
                ))}
              </div>
              <div style={{ border: "1px solid rgba(129,199,132,0.3)", borderRadius: 4, padding: "16px", background: "rgba(129,199,132,0.04)" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#81C784", marginBottom: 10 }}>With self-service</div>
                {["Stakeholder types 'revenue by region last month' in ThoughtSpot", "Instant result — 0 wait time", "Stakeholder asks follow-up directly", "Analyst spends time on complex insights", "Analyst builds infrastructure, not reports", "Analyst perceived as strategic, not a report-builder"].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, marginBottom: 5 }}>
                    <span style={{ color: "#81C784", flexShrink: 0 }}>✓</span>
                    <span style={{ fontSize: 12, color: "#888" }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <SH n="04b" title="Analyst Role in a Self-Service Culture" col="#CE93D8" />
            <div style={{ border: "1px solid #1A1A2E", borderRadius: 4, overflow: "hidden", margin: "0 0 20px" }}>
              {[
                { from: "Report builder",        to: "Data infrastructure owner — builds the semantic layer, maintains data quality, governs access", col: "#4FC3F7" },
                { from: "Query writer",          to: "Insight generator — finds the non-obvious patterns stakeholders would not know to ask for", col: "#81C784" },
                { from: "Dashboard creator",     to: "Analytics enabler — trains stakeholders, designs for self-service, defines metrics",         col: "#FFD54F" },
                { from: "Ticket resolver",       to: "Strategic partner — presents at leadership meetings, drives data-informed decisions",          col: "#FF8A65" },
              ].map((r, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 14, padding: "12px 16px", borderBottom: i < 3 ? "1px solid #0F0F18" : "none", background: i % 2 === 0 ? "#0A0A14" : "#07070E", alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: "#FF6464", textDecoration: "line-through" }}>{r.from}</span>
                  <span style={{ color: r.col, fontSize: 16 }}>→</span>
                  <span style={{ fontSize: 12, color: r.col }}>{r.to}</span>
                </div>
              ))}
            </div>

            <Box col="#CE93D8" icon="🎯" title="The 5 Tools That Enable Self-Service">
              ThoughtSpot (search-driven): business users find their own answers. Power BI Q&A visual: type questions in Power BI reports. Tableau Ask Data: search Tableau data sources naturally. Looker Studio (free sharing): anyone with a link can explore. ChatGPT/Claude + your data: advanced self-service for analysts who know how to prompt.
            </Box>
            <Nav onPrev={() => setSec("narrative")} onNext={() => setSec("capstone")} />
          </div>
        )}

        {/* ── CAPSTONE ── */}
        {sec === "capstone" && (
          <div>
            <SH n="05" title="Phase 4 Capstone — Executive Analytics Suite" col="#FF8A65" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 16px" }}>
              The Phase 4 capstone brings all four BI tools together into a single, cohesive analytics deliverable. You will build four live dashboards — each using a different tool for a different audience — and write an executive narrative tying the insights together.
            </p>

            <Box col="#FF8A65" icon="💼" title="The Scenario">
              RetailCo's board has asked for a quarterly business review pack. The CFO wants financial metrics. The Head of Sales wants regional performance. The Head of Customer Success wants churn and cohort data. The CEO wants a one-page summary with the three things they need to decide on. You are delivering all four.
            </Box>

            {/* Task selector */}
            <div style={{ display: "flex", gap: 6, margin: "24px 0 20px", overflowX: "auto", paddingBottom: 4 }}>
              {capstoneTasks.map((t, i) => (
                <button key={i} onClick={() => setActiveTask(activeTask === i ? null : i)} style={{
                  background: activeTask === i ? t.col + "18" : "#0D0D18",
                  border: "1px solid " + (activeTask === i ? t.col : "#1A1A2E"),
                  borderTop: "3px solid " + t.col,
                  borderRadius: 4, padding: "12px 14px", cursor: "pointer",
                  fontFamily: "monospace", fontSize: 11,
                  color: activeTask === i ? t.col : "#555",
                  whiteSpace: "nowrap", minWidth: 90, textAlign: "left",
                  transition: "all 0.2s",
                }}>
                  <div style={{ fontWeight: 700, marginBottom: 3 }}>{t.num}</div>
                  <div style={{ fontSize: 10, lineHeight: 1.4 }}>{t.title.substring(0, 16)}</div>
                  <div style={{ marginTop: 5, fontSize: 10, color: "#444" }}>{t.weight} pts</div>
                </button>
              ))}
            </div>

            {activeTask !== null && (() => {
              const t = capstoneTasks[activeTask];
              const doneCount = t.steps.filter((_, j) => checkedSteps[activeTask + "-" + j]).length;
              const prog = Math.round(doneCount / t.steps.length * 100);
              return (
                <div style={{ border: "1px solid " + t.col + "44", borderLeft: "4px solid " + t.col, borderRadius: 4, overflow: "hidden", marginBottom: 24 }}>
                  <div style={{ padding: "18px 22px", background: t.col + "08", borderBottom: "1px solid " + t.col + "22" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                      <div>
                        <div style={{ fontSize: 10, color: t.col, letterSpacing: "0.2em", fontFamily: "monospace", marginBottom: 5 }}>{t.num} · {t.weight} MARKS</div>
                        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: "#DDD8F0" }}>{t.title}</h3>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 11, color: t.col, fontFamily: "monospace", marginBottom: 4 }}>{doneCount}/{t.steps.length} done</div>
                        <div style={{ width: 100, height: 4, background: "#1A1A2E", borderRadius: 2, overflow: "hidden" }}>
                          <div style={{ width: prog + "%", height: "100%", background: t.col, borderRadius: 2, transition: "width 0.3s" }} />
                        </div>
                      </div>
                    </div>
                    <p style={{ fontSize: 13, color: "#888", margin: "10px 0 0" }}>{t.objective}</p>
                  </div>
                  <div style={{ padding: "20px 22px", background: "#0A0A14" }}>
                    <div style={{ fontSize: 9, color: t.col, letterSpacing: "0.18em", fontFamily: "monospace", fontWeight: 700, marginBottom: 12 }}>STEP-BY-STEP</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 18 }}>
                      {t.steps.map((step, j) => {
                        const key = activeTask + "-" + j;
                        const done = checkedSteps[key];
                        return (
                          <div key={j} onClick={() => toggleStep(key)} style={{
                            display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 14px",
                            borderRadius: 3, cursor: "pointer",
                            background: done ? t.col + "08" : "#0D0D18",
                            border: "1px solid " + (done ? t.col + "44" : "#1A1A2E"),
                            transition: "all 0.2s",
                          }}>
                            <div style={{ width: 18, height: 18, borderRadius: 3, border: "1.5px solid " + (done ? t.col : "#333"), background: done ? t.col : "none", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                              {done && <span style={{ fontSize: 10, color: "#07070E", fontWeight: 900 }}>✓</span>}
                            </div>
                            <span style={{ fontSize: 13, color: done ? "#DDD8F0" : "#777", lineHeight: 1.6 }}>{step}</span>
                          </div>
                        );
                      })}
                    </div>
                    <div style={{ background: "rgba(206,147,216,0.05)", border: "1px solid rgba(206,147,216,0.2)", borderRadius: 3, padding: "10px 14px" }}>
                      <div style={{ fontSize: 9, color: "#CE93D8", letterSpacing: "0.15em", fontFamily: "monospace", fontWeight: 700, marginBottom: 5 }}>AI PROMPT</div>
                      <code style={{ fontSize: 12, color: "#CE93D8", fontFamily: "monospace", lineHeight: 1.6 }}>{t.aiPrompt}</code>
                    </div>
                  </div>
                </div>
              );
            })()}

            {activeTask === null && (
              <div style={{ padding: "32px", background: "#0D0D18", border: "1px dashed #1A1A2E", borderRadius: 4, textAlign: "center", color: "#444", fontSize: 13, marginBottom: 24 }}>
                ↑ Click any task card to open step-by-step instructions
              </div>
            )}

            {/* Rubric */}
            <SH n="05b" title="Marking Rubric" col="#FF8A65" />
            <div style={{ border: "1px solid #1A1A2E", borderRadius: 4, overflow: "hidden", margin: "0 0 20px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 60px 80px", gap: 12, padding: "10px 16px", background: "#0D0D18", borderBottom: "1px solid #1A1A2E" }}>
                {["Task", "Criteria", "Max", "Score"].map(h => (
                  <span key={h} style={{ fontSize: 9, color: "#555", letterSpacing: "0.12em", fontFamily: "monospace", textTransform: "uppercase" }}>{h}</span>
                ))}
              </div>
              {rubricRows.map((r, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 2fr 60px 80px", gap: 12, padding: "11px 16px", alignItems: "center", borderBottom: i < rubricRows.length - 1 ? "1px solid #0F0F18" : "none", background: i % 2 === 0 ? "#0A0A14" : "#07070E" }}>
                  <span style={{ fontSize: 11, color: "#FF8A65", fontFamily: "monospace", fontWeight: 700 }}>{r.task}</span>
                  <span style={{ fontSize: 12, color: "#666" }}>{r.criteria}</span>
                  <span style={{ fontSize: 13, color: "#DDD8F0", fontFamily: "monospace", textAlign: "center" }}>{r.max}</span>
                  <input type="number" min={0} max={r.max} value={scores[r.task] ?? ""} onChange={e => setScore(r.task, e.target.value)} placeholder="0"
                    style={{ background: "#0D0D18", border: "1px solid #1A1A2E", borderRadius: 3, padding: "5px 8px", color: "#81C784", fontFamily: "monospace", fontSize: 13, width: "58px", textAlign: "center", outline: "none" }} />
                </div>
              ))}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 60px 80px", gap: 12, padding: "13px 16px", background: "#0D0D18", borderTop: "2px solid #1A1A2E" }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#DDD8F0", gridColumn: "1/3" }}>TOTAL</span>
                <span style={{ fontSize: 14, fontWeight: 900, color: "#DDD8F0", fontFamily: "monospace", textAlign: "center" }}>{maxScore}</span>
                <span style={{ fontSize: 14, fontWeight: 900, fontFamily: "monospace", textAlign: "center", color: pct >= 90 ? "#4ade80" : pct >= 75 ? "#FFD54F" : totalScore > 0 ? "#FF8A65" : "#555" }}>{totalScore || "—"}</span>
              </div>
            </div>

            {totalScore > 0 && (
              <div style={{ border: "1px solid " + (pct >= 90 ? "#4ade80" : pct >= 75 ? "#FFD54F" : "#FF8A65") + "33", borderLeft: "4px solid " + (pct >= 90 ? "#4ade80" : pct >= 75 ? "#FFD54F" : "#FF8A65"), borderRadius: 4, padding: "16px 20px", margin: "0 0 20px" }}>
                <div style={{ fontSize: 36, fontWeight: 900, fontFamily: "monospace", color: pct >= 90 ? "#4ade80" : pct >= 75 ? "#FFD54F" : "#FF8A65", marginBottom: 6 }}>{pct}%</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#DDD8F0", marginBottom: 4 }}>
                  {pct >= 90 ? "🏆 Portfolio Ready — Phase 4 Complete" : pct >= 75 ? "✅ Pass — Good Work" : "📚 Review lower-scoring tasks"}
                </div>
                <div style={{ height: 6, background: "#1A1A2E", borderRadius: 3, overflow: "hidden", marginTop: 10 }}>
                  <div style={{ width: pct + "%", height: "100%", background: "linear-gradient(90deg, #FF8A65, " + (pct >= 90 ? "#4ade80" : pct >= 75 ? "#FFD54F" : "#FF8A65") + ")", borderRadius: 3, transition: "width 0.5s" }} />
                </div>
              </div>
            )}
            <Nav onPrev={() => setSec("selfservice")} onNext={() => setSec("review")} />
          </div>
        )}

        {/* ── REVIEW ── */}
        {sec === "review" && (
          <div>
            <SH n="06" title="Phase 4 Full Review — 12 Flashcards" col="#CE93D8" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 20px" }}>
              Flip each card to reveal the answer. These cover all four parts of Phase 4. If any stumps you, go back to that section before Phase 5.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 12, margin: "0 0 36px" }}>
              {flashcards.map((card, i) => {
                const isFlipped = flipped[i];
                return (
                  <div key={i} onClick={() => flipCard(i)} style={{ cursor: "pointer", minHeight: 130 }}>
                    <div style={{
                      border: "1px solid " + (isFlipped ? "#CE93D8" : "#1A1A2E"),
                      borderTop: "3px solid " + (isFlipped ? "#CE93D8" : "#333"),
                      borderRadius: 4, padding: "16px",
                      background: isFlipped ? "rgba(206,147,216,0.06)" : "#0D0D18",
                      transition: "all 0.25s", minHeight: 130,
                      display: "flex", flexDirection: "column",
                    }}>
                      <div style={{ fontSize: 9, color: isFlipped ? "#CE93D8" : "#444", letterSpacing: "0.15em", fontFamily: "monospace", marginBottom: 10, textTransform: "uppercase" }}>
                        {isFlipped ? "ANSWER" : "Q" + String(i + 1).padStart(2, "0")}
                      </div>
                      <div style={{ fontSize: 13, color: isFlipped ? "#AAA" : "#DDD8F0", lineHeight: 1.65, flex: 1 }}>
                        {isFlipped ? card.a : card.q}
                      </div>
                      <div style={{ fontSize: 10, color: "#333", marginTop: 10, textAlign: "right", fontFamily: "monospace" }}>
                        {isFlipped ? "← flip back" : "tap to reveal →"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <SH n="06b" title="Phase 4 Concept Map" col="#CE93D8" />
            <div style={{ border: "1px solid #1A1A2E", borderRadius: 4, overflow: "hidden", margin: "0 0 28px" }}>
              {[
                { part: "Part 1", col: "#4FC3F7", topics: ["Tableau Public vs Desktop", "Dimensions vs Measures", "6 chart types", "Calculated fields + LOD expressions", "Parameters", "Dashboard design principles", "Tableau Pulse + Einstein AI"] },
                { part: "Part 2", col: "#FFD700", topics: ["Power Query ETL", "M language transforms", "DAX Measures vs Columns", "CALCULATE + ALL + FILTER", "Time intelligence (MoM, YTD, SPLY)", "Star schema data model", "Microsoft Copilot + Q&A visual"] },
                { part: "Part 3", col: "#FF8A65", topics: ["ThoughtSpot search-driven analytics", "Spotter AI root cause analysis", "Looker Studio free BI", "Gemini AI chart generation", "AI narrative tools + Pyramid Principle", "Self-service analytics culture", "Phase 4 Capstone — executive suite"] },
              ].map((p, i, arr) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 16, padding: "14px 18px", borderBottom: i < arr.length - 1 ? "1px solid #0F0F18" : "none", background: i % 2 === 0 ? "#0A0A14" : "#07070E" }}>
                  <div style={{ minWidth: 56, fontSize: 11, color: p.col, fontFamily: "monospace", fontWeight: 700, paddingTop: 2 }}>{p.part}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {p.topics.map(t => (
                      <span key={t} style={{ padding: "3px 9px", background: p.col + "0D", border: "1px solid " + p.col + "30", borderRadius: 2, fontSize: 11, color: p.col }}>{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Phase 5 preview */}
            <SH n="06c" title="Phase 5 — Cloud, Data Engineering and AI Ops" col={ACC} />
            <div style={{ display: "flex", flexDirection: "column", gap: 8, margin: "0 0 24px" }}>
              {[
                { week: "Week 14", title: "Cloud Platforms + dbt + Airflow", col: "#4FC3F7", topics: ["AWS, GCP, Azure basics for analysts", "dbt: transform data with SQL and version control", "Airflow: schedule and monitor pipelines", "Data warehouse vs data lake vs lakehouse"] },
                { week: "Week 15", title: "AI Ops + LLM Integration for Analytics", col: "#81C784", topics: ["LangChain: build Q&A chatbots over your data", "OpenAI API + structured outputs", "Vector databases and semantic search", "Monitoring ML models in production"] },
              ].map((w, i) => (
                <div key={i} style={{ border: "1px solid " + w.col + "33", borderLeft: "3px solid " + w.col, borderRadius: 4, padding: "14px 18px", background: "#0D0D18" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                    <span style={{ fontSize: 10, color: w.col, fontFamily: "monospace", letterSpacing: "0.15em" }}>{w.week}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#DDD8F0" }}>{w.title}</span>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {w.topics.map(t => (
                      <span key={t} style={{ padding: "3px 9px", background: w.col + "0D", border: "1px solid " + w.col + "25", borderRadius: 2, fontSize: 11, color: "#777" }}>{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ padding: "20px 24px", background: "#0D0D18", border: "1px solid #1A1A2E", borderRadius: 4, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#DDD8F0", marginBottom: 4 }}>Ready for Phase 5?</div>
                <div style={{ fontSize: 12, color: "#555" }}>Say "Give me Phase 5 Part 1" to start Cloud and Data Engineering.</div>
              </div>
              <div style={{ padding: "10px 20px", background: "rgba(79,195,247,0.1)", border: "1px solid rgba(79,195,247,0.3)", borderRadius: 3, fontSize: 12, color: "#4FC3F7", fontFamily: "monospace", fontWeight: 700 }}>
                PHASE 5 → CLOUD + AI OPS
              </div>
            </div>
            <Nav onPrev={() => setSec("capstone")} onNext={() => setSec("quiz")} nxt="Take the Quiz →" />
          </div>
        )}

        {/* ── QUIZ ── */}
        {sec === "quiz" && (
          <div>
            <SH n="07" title="Part 3 Knowledge Check" col={ACC} />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 16px" }}>6 questions on ThoughtSpot, Looker Studio, AI narratives and the capstone. Score 4+ to complete Phase 4.</p>

            {!quiz.done ? (
              <div style={{ margin: "24px 0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
                  <span style={{ fontSize: 11, color: "#555", fontFamily: "monospace" }}>QUESTION {quiz.idx + 1} / {quizData.length}</span>
                  <span style={{ fontSize: 11, color: ACC, fontFamily: "monospace" }}>SCORE: {quiz.score} / {quiz.idx}</span>
                </div>
                <div style={{ height: 3, background: "#1A1A2E", borderRadius: 2, marginBottom: 24, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: (quiz.idx / quizData.length * 100) + "%", background: "linear-gradient(90deg, " + ACC + ", #FFD54F)", transition: "width 0.4s" }} />
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
                    } else if (sel) { bg = "rgba(255,138,101,0.08)"; border = ACC; col = ACC; }
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
                  <div style={{ margin: "20px 0 0", padding: "14px 18px", background: "rgba(255,138,101,0.04)", border: "1px solid rgba(255,138,101,0.2)", borderRadius: 4 }}>
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
                  {quiz.score === 6 ? "Phase 4 complete. Four BI tools mastered. On to Phase 5 — Cloud and AI Ops." : quiz.score >= 4 ? "Phase 4 passed. Review any weak spots before Phase 5." : "Revisit ThoughtSpot and Looker sections before continuing."}
                </p>
                <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                  <button onClick={() => setQuiz({ idx: 0, sel: null, answered: false, score: 0, done: false })} style={{ background: "none", border: "1px solid #333", borderRadius: 3, padding: "8px 20px", cursor: "pointer", fontFamily: "monospace", fontSize: 11, color: "#555" }}>RETAKE</button>
                  <button onClick={() => setSec("intro")} style={{ background: ACC, border: "none", borderRadius: 3, padding: "8px 24px", cursor: "pointer", fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: "#07070E" }}>REVIEW ↑</button>
                </div>

                <div style={{ marginTop: 40, padding: "28px", background: "linear-gradient(135deg, rgba(255,138,101,0.07) 0%, transparent 100%)", border: "1px solid " + ACC + "33", borderRadius: 4 }}>
                  <div style={{ fontSize: 52, marginBottom: 10 }}>🎉</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: "#DDD8F0", marginBottom: 8 }}>Phase 4 Complete!</div>
                  <p style={{ fontSize: 14, color: "#777", lineHeight: 1.8, maxWidth: 500, margin: "0 auto 20px" }}>
                    You now speak the language of four enterprise BI tools. Four more portfolio pieces. Four phases down, two to go. Phase 5 is where data analytics meets data engineering — the skills that take you from analyst to senior analyst.
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
                    {["Tableau + Einstein AI ✓", "Power BI + Copilot ✓", "Looker Studio + Gemini ✓", "ThoughtSpot ✓", "Executive Narratives ✓", "4th Portfolio Project ✓"].map(tag => (
                      <span key={tag} style={{ padding: "5px 14px", background: "rgba(255,138,101,0.08)", border: "1px solid rgba(255,138,101,0.25)", borderRadius: 2, fontSize: 12, color: ACC }}>{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div style={{ display: "flex", marginTop: 48, paddingTop: 24, borderTop: "1px solid #1A1A2E" }}>
              <button onClick={() => setSec("review")} style={{ background: "none", border: "1px solid #1A1A2E", borderRadius: 3, padding: "8px 18px", cursor: "pointer", fontFamily: "monospace", fontSize: 11, color: "#555" }}>← Previous</button>
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
      {label && <div style={{ padding: "6px 14px", borderBottom: "1px solid " + col + "22" }}>
        <span style={{ fontSize: 9, color: col, letterSpacing: "0.15em", fontFamily: "monospace", fontWeight: 700 }}>{label}</span>
      </div>}
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
      {onPrev ? <button onClick={onPrev} style={{ background: "none", border: "1px solid #1A1A2E", borderRadius: 3, padding: "8px 18px", cursor: "pointer", fontFamily: "monospace", fontSize: 11, color: "#555" }}>← Previous</button> : <div />}
      {onNext && <button onClick={onNext} style={{ background: "#FF8A65", border: "none", borderRadius: 3, padding: "8px 24px", cursor: "pointer", fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: "#07070E" }}>{nxt}</button>}
    </div>
  );
}
