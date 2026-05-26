"use client";
// @ts-nocheck
import { useState } from "react";

// ─── DATASET SCHEMA ───────────────────────────────────────────
const schema = [
  { table: "orders", color: "#4FC3F7", rows: "50,000+",
    columns: [
      { col: "order_id",     type: "STRING",    desc: "Unique order identifier" },
      { col: "customer_id",  type: "STRING",    desc: "Links to customers table" },
      { col: "product_id",   type: "STRING",    desc: "Links to products table" },
      { col: "order_date",   type: "DATE",      desc: "Date of purchase" },
      { col: "quantity",     type: "INT64",     desc: "Units ordered" },
      { col: "unit_price",   type: "FLOAT64",   desc: "Price per unit at time of order" },
      { col: "status",       type: "STRING",    desc: "Completed / Returned / Cancelled" },
      { col: "channel",      type: "STRING",    desc: "Online / In-store / Mobile" },
    ]
  },
  { table: "customers", color: "#81C784", rows: "8,200+",
    columns: [
      { col: "customer_id",  type: "STRING",    desc: "Unique customer identifier" },
      { col: "signup_date",  type: "DATE",      desc: "Date of first account creation" },
      { col: "country",      type: "STRING",    desc: "Customer country" },
      { col: "segment",      type: "STRING",    desc: "B2B / B2C" },
      { col: "email",        type: "STRING",    desc: "Contact email" },
    ]
  },
  { table: "products", color: "#FFD54F", rows: "420",
    columns: [
      { col: "product_id",   type: "STRING",    desc: "Unique product identifier" },
      { col: "product_name", type: "STRING",    desc: "Display name" },
      { col: "category",     type: "STRING",    desc: "Electronics / Clothing / Home / Beauty" },
      { col: "cost_price",   type: "FLOAT64",   desc: "Unit cost to the business" },
    ]
  },
  { table: "events", color: "#FF8A65", rows: "500,000+",
    columns: [
      { col: "event_id",     type: "STRING",    desc: "Unique event identifier" },
      { col: "user_id",      type: "STRING",    desc: "Anonymous user (links to customer_id post-login)" },
      { col: "event_type",   type: "STRING",    desc: "page_view / product_view / add_to_cart / checkout / purchase" },
      { col: "event_date",   type: "DATE",      desc: "Date of event" },
      { col: "product_id",   type: "STRING",    desc: "Product involved (nullable)" },
      { col: "session_id",   type: "STRING",    desc: "Groups events in one browsing session" },
    ]
  },
];

// ─── TASKS ────────────────────────────────────────────────────
const tasks = [
  {
    num: "T1", title: "BigQuery Setup & Data Audit", color: "#4FC3F7", weight: 15,
    objective: "Load all 4 tables into BigQuery, verify data quality, and document your findings.",
    steps: [
      "Create a new BigQuery dataset called ecommerce_capstone",
      "Generate or download the 4 CSV files (orders, customers, products, events)",
      "Upload each CSV to BigQuery — auto-detect schema but verify column types manually",
      "Run SELECT COUNT(*) on each table — confirm row counts match expectations",
      "Check orders: run COUNTIF for NULL order_id, NULL customer_id, NULL order_date",
      "Check for duplicate order_id values using GROUP BY order_id HAVING COUNT(*) > 1",
      "Verify date range: MIN(order_date) and MAX(order_date) on orders table",
      "Check status column: SELECT DISTINCT status FROM orders — should only have 3 values",
      "Calculate overall return rate: returned orders / total orders as a percentage",
      "Document findings in a BigQuery comment block or a separate Google Sheet",
    ],
    aiPrompts: [
      '"I loaded a CSV into BigQuery. Write a SQL data audit query that checks: row count, null counts per column, duplicate primary keys, min/max dates, and distinct values in the status column. Table: ecommerce_capstone.orders"',
      '"Write a BigQuery SQL query to check data quality across all 4 tables in one script: orders, customers, products, events."',
    ],
    deliverable: "BigQuery dataset with 4 tables loaded + Data Audit query file (.sql) with findings",
    rubric: [
      "All 4 tables present in BigQuery with correct schema",
      "Correct row count verified for each table",
      "Null check query written and run",
      "Return rate correctly calculated and documented",
    ],
  },
  {
    num: "T2", title: "Core KPI Dashboard Queries", color: "#81C784", weight: 20,
    objective: "Write SQL queries to calculate the 8 KPIs that will power your Looker Studio dashboard.",
    steps: [
      "Total Revenue = SUM(quantity * unit_price) for Completed orders only",
      "Total Gross Profit = SUM(quantity * (unit_price - cost_price)) JOIN orders to products",
      "Gross Margin % = Gross Profit / Revenue * 100",
      "Average Order Value = Total Revenue / COUNT(DISTINCT order_id) for Completed orders",
      "Monthly Revenue Trend = GROUP BY MONTH, include MoM % change using LAG()",
      "Revenue by Category = JOIN orders to products, GROUP BY category",
      "Revenue by Channel = GROUP BY channel for Completed orders",
      "Return Rate % = COUNT Returned / COUNT all orders * 100, broken down by category",
    ],
    aiPrompts: [
      '"I have BigQuery tables: orders(order_id, customer_id, product_id, quantity, unit_price, status, order_date, channel) and products(product_id, category, cost_price). Write a KPI query calculating total revenue, gross profit, gross margin %, and AOV for completed orders."',
      '"Write a BigQuery SQL query showing monthly revenue for 2024 with month-over-month % change using LAG(). Use DATE_TRUNC for month grouping."',
    ],
    deliverable: "8 KPI queries in a single .sql file, each labelled with a comment",
    rubric: [
      "All 8 KPIs calculated correctly",
      "Revenue excludes Returned and Cancelled orders",
      "Gross profit query correctly JOINs orders to products",
      "MoM % change uses LAG() window function",
    ],
  },
  {
    num: "T3", title: "RFM Customer Segmentation", color: "#FFD54F", weight: 20,
    objective: "Segment all customers into Champion, Loyal, At Risk, and Lost using full RFM analysis.",
    steps: [
      "Calculate recency_days: DATEDIFF(CURRENT_DATE, MAX(order_date)) per customer",
      "Calculate frequency: COUNT(DISTINCT order_id) per customer from Completed orders",
      "Calculate monetary: SUM(quantity * unit_price) per customer from Completed orders",
      "Score each dimension 1-4 using NTILE(4) — 4 = best score",
      "Note: Recency NTILE should be ORDER BY recency_days ASC (recent = low days = score 4)",
      "Calculate total_rfm_score = r_score + f_score + m_score",
      "Add CASE WHEN labels: Champion (r=4, f>=3), Loyal (r>=3, f>=3), At Risk (r=2, f>=2), Lost (r=1, f=1)",
      "Count customers per segment and calculate % of total",
      "Find the average monetary value per segment",
      "Export or save results as a BigQuery view called vw_rfm_segments",
    ],
    aiPrompts: [
      '"Write a complete BigQuery RFM segmentation query for my orders table(customer_id, order_date, quantity, unit_price, status). Use NTILE(4) scoring for R, F, M. Add CASE WHEN labels. Save as a view called vw_rfm_segments."',
      '"I have an RFM segmentation query. Help me add a summary section at the end that counts customers per segment and shows average monetary value per segment."',
    ],
    deliverable: "RFM query file + BigQuery view vw_rfm_segments + segment summary table",
    rubric: [
      "Recency NTILE ordered ASC (lower days = better = score 4)",
      "All 4 segment labels present in output",
      "BigQuery view created successfully",
      "Segment summary count and avg monetary present",
    ],
  },
  {
    num: "T4", title: "Cohort Retention Analysis", color: "#FF8A65", weight: 20,
    objective: "Build a cohort retention table showing Month 0-6 retention rates for each signup cohort.",
    steps: [
      "Identify each customer's first order month using MIN(order_date) grouped by customer_id",
      "Use DATE_TRUNC(order_date, MONTH) for cohort_month grouping",
      "Join all orders back to first order date to tag each order with its customer's cohort",
      "Calculate month_number = DATE_DIFF(order_month, cohort_month, MONTH)",
      "Get cohort sizes: COUNT(DISTINCT customer_id) WHERE month_number = 0",
      "Calculate retained_customers per cohort per month",
      "Calculate retention_rate_pct = retained / cohort_size * 100",
      "Filter to cohorts with at least 3 months of data",
      "Save results as a BigQuery view called vw_cohort_retention",
      "Identify: which cohort has the best Month 1 retention? Which has declined?",
    ],
    aiPrompts: [
      '"Write a BigQuery cohort retention analysis query using my orders table(customer_id, order_date, status). Use DATE_TRUNC for monthly cohorts, DATE_DIFF for month numbers, and calculate retention_rate_pct. Save as view vw_cohort_retention."',
      '"My cohort query returns NULL for some months. How do I handle cohorts that are too recent to have data for Month 3 or Month 6? Show me how to filter these out cleanly."',
    ],
    deliverable: "Cohort SQL file + BigQuery view vw_cohort_retention + written insight: which cohort retains best and why",
    rubric: [
      "cohort_month correctly uses DATE_TRUNC",
      "month_number correctly uses DATE_DIFF",
      "Retention rate correctly calculated (retained / cohort_size * 100)",
      "BigQuery view created",
      "Written insight about best/worst cohort included",
    ],
  },
  {
    num: "T5", title: "Funnel Analysis", color: "#CE93D8", weight: 15,
    objective: "Calculate conversion rates at each stage of the purchase funnel using the events table.",
    steps: [
      "Count distinct user_ids at each event_type: page_view, product_view, add_to_cart, checkout, purchase",
      "Calculate each stage as % of page_view (top of funnel)",
      "Calculate step-by-step drop-off: % lost between each consecutive step",
      "Break funnel down by channel (if channel is in events — otherwise by date range)",
      "Identify the single biggest drop-off step",
      "Compare last 30 days vs previous 30 days — has conversion improved?",
      "Save results as a BigQuery view called vw_funnel_analysis",
      "Write 2-sentence insight: where is the biggest problem and what would you investigate?",
    ],
    aiPrompts: [
      '"My events table has columns: user_id, event_type (page_view/product_view/add_to_cart/checkout/purchase), event_date. Write a BigQuery funnel analysis query for the last 30 days showing users at each step, % of top, and step-by-step drop-off %."',
      '"Extend my funnel query to compare last 30 days vs previous 30 days for each funnel step. Show the change in conversion rate."',
    ],
    deliverable: "Funnel SQL file + view vw_funnel_analysis + written insight on biggest drop-off",
    rubric: [
      "All 5 funnel stages present",
      "% of top calculated correctly",
      "Step-by-step drop-off calculated",
      "Period comparison (last 30 vs prior 30) included",
      "Written insight about biggest opportunity included",
    ],
  },
  {
    num: "T6", title: "Looker Studio Dashboard", color: "#F48FB1", weight: 20,
    objective: "Connect BigQuery to Looker Studio and build a one-page executive dashboard.",
    steps: [
      "Go to lookerstudio.google.com — sign in with your Google account",
      "Click Blank Report → Add Data → BigQuery → select your project and dataset",
      "Add a Scorecard for each of the 4 headline KPIs: Revenue, Gross Margin %, AOV, Return Rate",
      "Add a Time Series chart: Monthly Revenue trend (from KPI query T2)",
      "Add a Bar chart: Revenue by Category (from KPI query T2)",
      "Add a Table: RFM Segment Summary (from vw_rfm_segments) — segment name, count, avg monetary",
      "Add a Date Range filter control at the top — connects to all charts",
      "Add a Channel filter control (dropdown) — let stakeholders filter by Online / In-store / Mobile",
      "Style the dashboard: consistent colours, clean title, remove chart borders",
      "Share the dashboard as View-only and copy the link for your portfolio",
    ],
    aiPrompts: [
      '"I am building a Looker Studio dashboard connected to BigQuery. What chart type should I use to show: (1) monthly revenue trend, (2) RFM segment breakdown, (3) funnel conversion rates, (4) cohort retention table?"',
      '"Write a BigQuery SQL view that combines all KPIs into one table optimised for a Looker Studio Scorecard: total_revenue, gross_margin_pct, aov, return_rate_pct."',
    ],
    deliverable: "Live Looker Studio dashboard with shareable link — 4 KPI scorecards + 3 charts + 2 filter controls",
    rubric: [
      "4 KPI scorecards present and correct",
      "Monthly trend chart present",
      "Revenue by category chart present",
      "Date Range filter works across all charts",
      "Dashboard has a clear title and is readable on one screen",
    ],
  },
];

// ─── RUBRIC ───────────────────────────────────────────────────
const rubricRows = [
  { task: "T1 Data Setup & Audit",    max: 15, criteria: "4 tables loaded, audit query run, return rate calculated" },
  { task: "T2 KPI Queries",           max: 20, criteria: "8 KPIs correct, revenue excludes returns, MoM uses LAG()" },
  { task: "T3 RFM Segmentation",      max: 20, criteria: "NTILE scoring correct, 4 segments labelled, view created" },
  { task: "T4 Cohort Analysis",       max: 20, criteria: "DATE_TRUNC / DATE_DIFF correct, retention % right, view created" },
  { task: "T5 Funnel Analysis",       max: 15, criteria: "5 stages, % of top + drop-off, period comparison" },
  { task: "T6 Looker Dashboard",      max: 20, criteria: "4 KPIs, 3 charts, 2 filters, shareable link" },
];

// ─── REVIEW FLASHCARDS ────────────────────────────────────────
const flashcards = [
  { q: "What are the 6 SQL clauses in written order?",                             a: "SELECT → FROM → JOIN → WHERE → GROUP BY → HAVING → ORDER BY → LIMIT. Execution order differs: FROM → JOIN → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT." },
  { q: "What is the difference between WHERE and HAVING?",                         a: "WHERE filters individual rows BEFORE aggregation. HAVING filters groups AFTER GROUP BY. You cannot use aggregate functions (SUM, COUNT) in WHERE — use HAVING instead." },
  { q: "What do INNER JOIN and LEFT JOIN return differently?",                     a: "INNER JOIN returns only rows matching in BOTH tables. LEFT JOIN returns ALL rows from the left table plus matches from the right — unmatched right rows show NULL." },
  { q: "What is a CTE and when should you use one?",                               a: "A Common Table Expression (WITH clause) is a named temporary result set. Use it when a subquery has more than 2 lines, or when you need multi-step logic. CTEs improve readability, not performance." },
  { q: "What is ROW_NUMBER() and what is it used for?",                            a: "ROW_NUMBER() assigns a unique sequential integer to every row within a PARTITION. Use it to get the latest record per group: filter WHERE rn = 1 after ranking by date DESC." },
  { q: "What is the difference between RANK() and DENSE_RANK()?",                  a: "RANK() skips numbers after ties (1,1,3). DENSE_RANK() does not skip (1,1,2). Use RANK() for leaderboards, DENSE_RANK() for Top N per group filtering." },
  { q: "What does LAG(revenue, 1) OVER (ORDER BY month) return?",                  a: "The revenue from the PREVIOUS row (1 row behind). Use LAG for month-over-month comparisons. LEAD() looks forward. Both eliminate the need for self-joins." },
  { q: "In BigQuery, what does SELECT * cost you?",                                a: "BigQuery charges per byte SCANNED. SELECT * scans all columns — very expensive on wide tables. Always SELECT only the columns you need to minimise cost." },
  { q: "What does RFM stand for and what does each letter measure?",               a: "Recency (how recently they bought), Frequency (how often they buy), Monetary (total spend). Each scored 1-4 with NTILE(4). High RFM = Champion. Low RFM = Lost." },
  { q: "What is a cohort in cohort analysis?",                                     a: "A group of users who share the same acquisition time period (e.g. all customers who made their first purchase in January 2024). You track what % return in subsequent months." },
  { q: "What does a 60% drop-off at Add to Cart → Checkout mean?",                a: "60% of users who added to cart did NOT proceed to checkout. Only 40% converted to the next step. This step is the biggest funnel leak and should be the first thing optimised." },
  { q: "Name 3 ways to make a slow SQL query faster",                              a: "1. SELECT only needed columns (never SELECT *). 2. Filter early with WHERE before JOINs. 3. Avoid wrapping indexed columns in functions — breaks index usage. Also: use EXISTS instead of IN, add LIMIT when exploring." },
];

// ─── LOOKER SETUP ─────────────────────────────────────────────
const lookerSteps = [
  { step: "01", title: "Connect BigQuery to Looker Studio", color: "#4FC3F7",
    detail: "Go to lookerstudio.google.com → Create → Report → Add Data → BigQuery → select your GCP project → ecommerce_capstone dataset → start with the orders table.",
    tip: "You can add multiple BigQuery tables as separate data sources and blend them in Looker Studio charts." },
  { step: "02", title: "Add KPI Scorecards", color: "#81C784",
    detail: "Insert → Scorecard. Set metric to SUM of revenue (calculated field). Repeat for Gross Margin %, AOV, Return Rate. Arrange 4 scorecards in a row at the top.",
    tip: "Use calculated fields in Looker Studio to compute derived metrics: revenue - cost for gross profit, etc." },
  { step: "03", title: "Add Time Series Chart", color: "#FFD54F",
    detail: "Insert → Time Series Chart. Set dimension to order_date (auto-groups by month). Set metric to SUM(revenue). This shows your monthly revenue trend.",
    tip: "In Chart → Style, enable Smooth lines and add a trend line to show direction clearly to executives." },
  { step: "04", title: "Add Bar Chart by Category", color: "#FF8A65",
    detail: "Insert → Bar Chart. Join orders to products in data blending or use your T2 BigQuery view. Dimension = category, metric = SUM(revenue). Sort descending.",
    tip: "Horizontal bar charts work better than vertical when category names are long. Easier to read at a glance." },
  { step: "05", title: "Add Filter Controls", color: "#CE93D8",
    detail: "Insert → Date Range Control → place at top right. Insert → Drop-down List → set field to channel. Connect both controls to ALL charts on the page.",
    tip: "Right-click a filter control → Manage Filter → enable it for all charts. This is what makes the dashboard interactive." },
  { step: "06", title: "Style and Share", color: "#F48FB1",
    detail: "Remove chart borders. Use a consistent 2-colour palette. Add a clear title. Set page background to white or dark. File → Share → Manage Access → Anyone with the link can view.",
    tip: "Copy the shareable link and add it to your GitHub README as your portfolio dashboard link. Employers will click it." },
];

const sections = [
  { id: "intro",    label: "Overview"   },
  { id: "brief",    label: "Brief"      },
  { id: "schema",   label: "Schema"     },
  { id: "tasks",    label: "Tasks (6)"  },
  { id: "looker",   label: "Looker"     },
  { id: "rubric",   label: "Rubric"     },
  { id: "review",   label: "Review"     },
  { id: "next",     label: "Phase 3"    },
];

export default function Phase2Part4() {
  const [activeSection, setActiveSection] = useState("intro");
  const [activeTask,    setActiveTask]    = useState(null);
  const [expandedLooker, setExpandedLooker] = useState(null);
  const [flipped,       setFlipped]       = useState({});
  const [scores,        setScores]        = useState({});
  const [checkedSteps,  setCheckedSteps]  = useState({});

  const ACC = "#F48FB1";
  const totalScore  = rubricRows.reduce((a, r) => a + (scores[r.task] || 0), 0);
  const maxScore    = rubricRows.reduce((a, r) => a + r.max, 0);
  const pct         = totalScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

  const toggleFlip  = (i)    => setFlipped(p => ({ ...p, [i]: !p[i] }));
  const toggleStep  = (key)  => setCheckedSteps(p => ({ ...p, [key]: !p[key] }));
  const setScore    = (task, val) => setScores(p => ({ ...p, [task]: Math.min(rubricRows.find(r => r.task === task).max, Math.max(0, Number(val))) }));

  return (
    <div style={{ minHeight: "100vh", background: "#07070E", color: "#DDD8F0", fontFamily: "Georgia, 'Times New Roman', serif" }}>

      {/* NAV */}
      <div style={{ background: "#0A0A14", borderBottom: "1px solid #16162A", padding: "0 24px", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 940, margin: "0 auto", display: "flex", alignItems: "center", overflowX: "auto" }}>
          <div style={{ fontSize: 10, color: ACC, letterSpacing: "0.22em", textTransform: "uppercase", padding: "14px 20px 14px 0", borderRight: "1px solid #1A1A2E", marginRight: 12, whiteSpace: "nowrap" }}>
            P2 · PART 4
          </div>
          {sections.map(s => (
            <button key={s.id} onClick={() => setActiveSection(s.id)} style={{
              background: "none", border: "none", cursor: "pointer",
              padding: "14px 11px", fontFamily: "inherit", fontSize: 11,
              color: activeSection === s.id ? ACC : "#444",
              borderBottom: activeSection === s.id ? `2px solid ${ACC}` : "2px solid transparent",
              transition: "all 0.2s", whiteSpace: "nowrap",
            }}>{s.label}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 940, margin: "0 auto", padding: "48px 24px 100px" }}>

        {/* ── INTRO ── */}
        {activeSection === "intro" && (
          <div>
            <div style={{ marginBottom: 52, borderLeft: `3px solid ${ACC}`, paddingLeft: 24 }}>
              <div style={{ fontSize: 10, color: ACC, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 12 }}>
                PHASE 2 · PART 4 OF 4 · CAPSTONE
              </div>
              <h1 style={{ fontSize: "clamp(26px,5vw,44px)", fontWeight: 900, margin: "0 0 16px", lineHeight: 1.12, letterSpacing: "-0.02em" }}>
                E-Commerce<br />
                <span style={{ color: ACC }}>Analytics Engine</span><br />
                <span style={{ fontStyle: "italic", fontWeight: 400, fontSize: "0.65em", color: "#555" }}>Phase 2 Capstone Project</span>
              </h1>
              <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, maxWidth: 580, margin: "0 0 24px" }}>
                This is your Phase 2 capstone — a complete, end-to-end analytics project on a realistic e-commerce dataset. You will set up BigQuery, write production SQL for RFM segmentation, cohort retention, and funnel analysis, then connect everything to a live Looker Studio dashboard that you can share as a portfolio piece.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {["4 tables", "6 tasks", "100 marks", "BigQuery + Looker Studio", "Portfolio-ready", "~8 hours"].map(tag => (
                  <span key={tag} style={{ padding: "4px 12px", background: "rgba(244,143,177,0.08)", border: "1px solid rgba(244,143,177,0.22)", borderRadius: 2, fontSize: 11, color: ACC }}>{tag}</span>
                ))}
              </div>
            </div>

            <SH num="00" title="Project at a Glance" color={ACC} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10, margin: "24px 0 36px" }}>
              {[
                { icon: "📋", label: "Brief",       desc: "Business scenario and stakeholder needs",     section: "brief"  },
                { icon: "🗄️", label: "Schema",      desc: "4-table database schema with column types",   section: "schema" },
                { icon: "✅", label: "6 Tasks",     desc: "Step-by-step with AI prompts per task",       section: "tasks"  },
                { icon: "📊", label: "Looker",      desc: "6-step Looker Studio dashboard guide",         section: "looker" },
                { icon: "🎯", label: "Rubric",      desc: "100-point self-assessment with score tracker", section: "rubric" },
                { icon: "🧠", label: "Review",      desc: "12 flip-card review of all Phase 2 concepts",  section: "review" },
                { icon: "🚀", label: "Phase 3",     desc: "Python for Analytics — what is coming next",   section: "next"   },
              ].map((item, i) => (
                <div key={i} onClick={() => setActiveSection(item.section)} style={{
                  border: `1px solid ${ACC}33`, borderTop: `3px solid ${ACC}`,
                  borderRadius: 4, padding: "14px", background: "#0D0D18",
                  cursor: "pointer", transition: "background 0.2s",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(244,143,177,0.06)"}
                  onMouseLeave={e => e.currentTarget.style.background = "#0D0D18"}
                >
                  <div style={{ fontSize: 22, marginBottom: 8 }}>{item.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#DDD8F0", marginBottom: 5 }}>{item.label}</div>
                  <div style={{ fontSize: 11, color: "#444", lineHeight: 1.6 }}>{item.desc}</div>
                </div>
              ))}
            </div>

            <div style={{ padding: "22px 26px", background: "linear-gradient(135deg, rgba(244,143,177,0.06) 0%, transparent 100%)", border: `1px solid ${ACC}33`, borderRadius: 4 }}>
              <div style={{ fontSize: 12, color: ACC, fontWeight: 700, marginBottom: 10 }}>🏆 What You Are Building</div>
              <p style={{ fontSize: 13, color: "#888", lineHeight: 1.8, margin: 0 }}>
                A complete <strong style={{ color: "#DDD8F0" }}>E-Commerce Analytics Engine</strong> — the type of deliverable a data analyst produces in their first 30 days at a company. By the end you will have: a clean BigQuery database, 6 SQL analysis files, 3 BigQuery views (RFM, cohort, funnel), and a live Looker Studio dashboard with a shareable link for your portfolio. This is real work, not an exercise.
              </p>
            </div>

            <NavBtns onNext={() => setActiveSection("brief")} />
          </div>
        )}

        {/* ── BRIEF ── */}
        {activeSection === "brief" && (
          <div>
            <SH num="01" title="Project Brief" color="#4FC3F7" />

            <div style={{ border: "1px solid #4FC3F733", borderLeft: "4px solid #4FC3F7", borderRadius: 4, padding: "22px 24px", background: "rgba(79,195,247,0.04)", marginBottom: 28 }}>
              <div style={{ fontSize: 10, color: "#4FC3F7", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 10, fontFamily: "monospace" }}>THE SCENARIO</div>
              <p style={{ fontSize: 14, color: "#AAA", lineHeight: 1.88, margin: "0 0 12px" }}>
                You have joined <strong style={{ color: "#DDD8F0" }}>ShopStream</strong> as a Data Analyst. ShopStream is a mid-size e-commerce platform with 8,000+ customers, 50,000+ orders per year, and an app with half a million user events tracked monthly.
              </p>
              <blockquote style={{ borderLeft: "2px solid #4FC3F7", paddingLeft: 16, margin: "0 0 12px", fontStyle: "italic", color: "#888", fontSize: 14, lineHeight: 1.8 }}>
                "We have all this data in BigQuery but nobody is actually using it. I need three things by end of week: who are our best and worst customers, why is revenue dropping in Q3, and where are we losing users in the checkout flow. Make it visual — something I can show the board."
              </blockquote>
              <p style={{ fontSize: 13, color: "#666", margin: 0, lineHeight: 1.7 }}>
                — Priya, Head of Growth, ShopStream
              </p>
            </div>

            <Subh title="Your Deliverables" color="#4FC3F7" />
            <div style={{ display: "flex", flexDirection: "column", gap: 8, margin: "16px 0 28px" }}>
              {[
                { item: "BigQuery project with 4 clean tables and data audit documentation",    color: "#4FC3F7" },
                { item: "8 KPI queries covering revenue, profit, AOV, return rate, and trends", color: "#81C784" },
                { item: "RFM segmentation view (vw_rfm_segments) with Champion → Lost labels",  color: "#FFD54F" },
                { item: "Cohort retention view (vw_cohort_retention) with Month 0-6 rates",     color: "#FF8A65" },
                { item: "Funnel analysis view (vw_funnel_analysis) with drop-off rates",        color: "#CE93D8" },
                { item: "Live Looker Studio dashboard with shareable link for your portfolio",   color: "#F48FB1" },
              ].map((d, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 14px", background: "#0D0D18", border: `1px solid ${d.color}22`, borderRadius: 3 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: d.color, flexShrink: 0, marginTop: 6 }} />
                  <span style={{ fontSize: 13, color: "#888", lineHeight: 1.5 }}>{d.item}</span>
                </div>
              ))}
            </div>

            <Subh title="Time Estimates" color="#4FC3F7" />
            <div style={{ border: "1px solid #1A1A2E", borderRadius: 4, overflow: "hidden", margin: "16px 0 28px" }}>
              {[
                { task: "T1 Setup & Audit",     time: "~45 min", note: "Mostly BigQuery UI work" },
                { task: "T2 KPI Queries",       time: "~60 min", note: "8 queries, use AI to accelerate" },
                { task: "T3 RFM Segmentation",  time: "~45 min", note: "Adapt the template from Part 3" },
                { task: "T4 Cohort Analysis",   time: "~60 min", note: "Most complex — take your time" },
                { task: "T5 Funnel Analysis",   time: "~45 min", note: "Adapt the template from Part 3" },
                { task: "T6 Looker Dashboard",  time: "~90 min", note: "Most visual — allow time for styling" },
              ].map((r, i, arr) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "160px 80px 1fr", gap: 16, padding: "10px 16px", borderBottom: i < arr.length - 1 ? "1px solid #0F0F18" : "none", background: i % 2 === 0 ? "#0A0A14" : "#07070E", alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: "#AAA", fontWeight: 700 }}>{r.task}</span>
                  <span style={{ fontSize: 12, color: "#4FC3F7", fontFamily: "monospace" }}>{r.time}</span>
                  <span style={{ fontSize: 12, color: "#555", fontStyle: "italic" }}>{r.note}</span>
                </div>
              ))}
              <div style={{ padding: "10px 16px", background: "#0D0D18", borderTop: "2px solid #1A1A2E", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#DDD8F0" }}>Total</span>
                <span style={{ fontSize: 12, color: "#4FC3F7", fontFamily: "monospace", fontWeight: 700 }}>~7-8 hours</span>
              </div>
            </div>

            <NavBtns onPrev={() => setActiveSection("intro")} onNext={() => setActiveSection("schema")} />
          </div>
        )}

        {/* ── SCHEMA ── */}
        {activeSection === "schema" && (
          <div>
            <SH num="02" title="Database Schema — 4 Tables" color="#81C784" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 20px" }}>
              ShopStream's data lives across four tables in BigQuery. <strong style={{ color: "#DDD8F0" }}>Study the schema before writing a single query</strong> — understanding how tables relate saves hours of debugging.
            </p>

            {/* ER Diagram simplified */}
            <div style={{ background: "#0A0A14", border: "1px solid #1A1A2E", borderRadius: 4, padding: "20px", margin: "0 0 28px", overflowX: "auto" }}>
              <div style={{ fontSize: 10, color: "#555", fontFamily: "monospace", letterSpacing: "0.15em", marginBottom: 16 }}>TABLE RELATIONSHIPS</div>
              <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
                {[
                  { table: "customers", pk: "customer_id", color: "#81C784" },
                  { table: "orders", pk: "order_id", fks: ["customer_id", "product_id"], color: "#4FC3F7" },
                  { table: "products", pk: "product_id", color: "#FFD54F" },
                  { table: "events", pk: "event_id", fks: ["user_id", "product_id"], color: "#FF8A65" },
                ].map((t, i) => (
                  <div key={i} style={{ border: `1px solid ${t.color}44`, borderTop: `3px solid ${t.color}`, borderRadius: 3, padding: "12px 14px", minWidth: 140 }}>
                    <div style={{ fontSize: 12, color: t.color, fontFamily: "monospace", fontWeight: 700, marginBottom: 8 }}>{t.table}</div>
                    <div style={{ fontSize: 10, color: "#555", fontFamily: "monospace" }}>PK: {t.pk}</div>
                    {t.fks && t.fks.map(fk => (
                      <div key={fk} style={{ fontSize: 10, color: "#444", fontFamily: "monospace" }}>FK: {fk}</div>
                    ))}
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 14, fontSize: 11, color: "#444" }}>
                orders.customer_id → customers.customer_id &nbsp;·&nbsp; orders.product_id → products.product_id &nbsp;·&nbsp; events.product_id → products.product_id
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {schema.map((tbl, i) => (
                <div key={i} style={{ border: `1px solid ${tbl.color}33`, borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ padding: "12px 18px", background: `${tbl.color}0A`, borderBottom: `1px solid ${tbl.color}22`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <code style={{ fontSize: 14, color: tbl.color, fontFamily: "monospace", fontWeight: 700 }}>{tbl.table}</code>
                      <span style={{ fontSize: 11, color: "#555", marginLeft: 12 }}>{tbl.rows} rows</span>
                    </div>
                    <span style={{ fontSize: 10, color: "#555", fontFamily: "monospace" }}>{tbl.columns.length} columns</span>
                  </div>
                  <div style={{ background: "#0A0A14" }}>
                    {tbl.columns.map((col, j) => (
                      <div key={j} style={{ display: "grid", gridTemplateColumns: "160px 80px 1fr", gap: 12, padding: "8px 18px", borderBottom: j < tbl.columns.length - 1 ? "1px solid #0F0F18" : "none", alignItems: "center" }}>
                        <code style={{ fontSize: 12, color: tbl.color, fontFamily: "monospace" }}>{col.col}</code>
                        <span style={{ fontSize: 10, color: "#444", fontFamily: "monospace", background: "#07070E", padding: "2px 6px", borderRadius: 2, textAlign: "center" }}>{col.type}</span>
                        <span style={{ fontSize: 12, color: "#666" }}>{col.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ margin: "24px 0", padding: "14px 18px", background: "rgba(255,213,79,0.06)", border: "1px solid rgba(255,213,79,0.25)", borderLeft: "3px solid #FFD54F", borderRadius: 4 }}>
              <div style={{ fontSize: 12, color: "#FFD54F", fontWeight: 700, marginBottom: 8 }}>💡 How to Generate the Dataset</div>
              <div style={{ fontSize: 13, color: "#666", lineHeight: 1.8 }}>
                Ask ChatGPT or Claude: <em style={{ color: "#FFD54F" }}>"Generate a realistic e-commerce CSV dataset with 500 rows matching this schema: [paste schema]. Include realistic product names, dates in 2024, a mix of statuses, and natural-looking patterns like higher sales in Q4."</em> Generate each table separately and upload to BigQuery.
              </div>
            </div>

            <NavBtns onPrev={() => setActiveSection("brief")} onNext={() => setActiveSection("tasks")} />
          </div>
        )}

        {/* ── TASKS ── */}
        {activeSection === "tasks" && (
          <div>
            <SH num="03" title="6 Project Tasks" color="#FFD54F" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 20px" }}>
              Complete tasks in order — each one builds on the previous. Every task has step-by-step instructions with <strong style={{ color: "#DDD8F0" }}>checkable steps</strong> and AI prompts to accelerate your work.
            </p>

            {/* Task selector */}
            <div style={{ display: "flex", gap: 6, margin: "0 0 28px", overflowX: "auto", paddingBottom: 4 }}>
              {tasks.map((t, i) => (
                <button key={i} onClick={() => setActiveTask(activeTask === i ? null : i)} style={{
                  background: activeTask === i ? `${t.color}18` : "#0D0D18",
                  border: `1px solid ${activeTask === i ? t.color : "#1A1A2E"}`,
                  borderTop: `3px solid ${t.color}`,
                  borderRadius: 4, padding: "12px 14px", cursor: "pointer",
                  fontFamily: "monospace", fontSize: 11,
                  color: activeTask === i ? t.color : "#555",
                  whiteSpace: "nowrap", minWidth: 100, textAlign: "left",
                  transition: "all 0.2s",
                }}>
                  <div style={{ fontWeight: 700, marginBottom: 4 }}>{t.num}</div>
                  <div style={{ fontSize: 10, lineHeight: 1.4 }}>{t.title.substring(0, 20)}</div>
                  <div style={{ marginTop: 6, fontSize: 10, color: "#444" }}>{t.weight} pts</div>
                </button>
              ))}
            </div>

            {activeTask !== null && (() => {
              const t = tasks[activeTask];
              const doneCount = t.steps.filter((_, j) => checkedSteps[`${activeTask}-${j}`]).length;
              const progress = Math.round((doneCount / t.steps.length) * 100);
              return (
                <div style={{ border: `1px solid ${t.color}44`, borderLeft: `4px solid ${t.color}`, borderRadius: 4, overflow: "hidden", marginBottom: 28 }}>
                  <div style={{ padding: "18px 22px", background: `${t.color}08`, borderBottom: `1px solid ${t.color}22` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                      <div>
                        <div style={{ fontSize: 10, color: t.color, letterSpacing: "0.2em", fontFamily: "monospace", marginBottom: 6 }}>{t.num} · {t.weight} MARKS</div>
                        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: "#DDD8F0" }}>{t.title}</h3>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 11, color: t.color, fontFamily: "monospace", marginBottom: 4 }}>{doneCount}/{t.steps.length} steps done</div>
                        <div style={{ width: 120, height: 4, background: "#1A1A2E", borderRadius: 2, overflow: "hidden" }}>
                          <div style={{ width: `${progress}%`, height: "100%", background: t.color, borderRadius: 2, transition: "width 0.3s" }} />
                        </div>
                      </div>
                    </div>
                    <p style={{ fontSize: 13, color: "#888", margin: "10px 0 0", lineHeight: 1.6 }}>{t.objective}</p>
                  </div>

                  <div style={{ padding: "20px 22px", background: "#0A0A14" }}>
                    <div style={{ fontSize: 9, color: t.color, letterSpacing: "0.18em", fontFamily: "monospace", fontWeight: 700, marginBottom: 12 }}>STEP-BY-STEP INSTRUCTIONS</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 20 }}>
                      {t.steps.map((step, j) => {
                        const key = `${activeTask}-${j}`;
                        const done = checkedSteps[key];
                        return (
                          <div key={j} onClick={() => toggleStep(key)} style={{
                            display: "flex", alignItems: "flex-start", gap: 12,
                            padding: "10px 14px", borderRadius: 3, cursor: "pointer",
                            background: done ? `${t.color}08` : "#0D0D18",
                            border: `1px solid ${done ? t.color + "44" : "#1A1A2E"}`,
                            transition: "all 0.2s",
                          }}>
                            <div style={{ width: 18, height: 18, borderRadius: 3, border: `1.5px solid ${done ? t.color : "#333"}`, background: done ? t.color : "none", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                              {done && <span style={{ fontSize: 10, color: "#07070E", fontWeight: 900 }}>✓</span>}
                            </div>
                            <span style={{ fontSize: 13, color: done ? "#DDD8F0" : "#777", lineHeight: 1.6 }}>{step}</span>
                          </div>
                        );
                      })}
                    </div>

                    <div style={{ fontSize: 9, color: "#CE93D8", letterSpacing: "0.18em", fontFamily: "monospace", fontWeight: 700, marginBottom: 10 }}>AI PROMPTS FOR THIS TASK</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 18 }}>
                      {t.aiPrompts.map((p, j) => (
                        <div key={j} style={{ background: "rgba(206,147,216,0.05)", border: "1px solid rgba(206,147,216,0.2)", borderRadius: 3, padding: "10px 12px" }}>
                          <code style={{ fontSize: 12, color: "#CE93D8", fontFamily: "monospace", lineHeight: 1.6 }}>{p}</code>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      <div style={{ background: `${t.color}08`, border: `1px solid ${t.color}33`, borderRadius: 3, padding: "12px 14px" }}>
                        <div style={{ fontSize: 9, color: t.color, letterSpacing: "0.15em", fontFamily: "monospace", fontWeight: 700, marginBottom: 8 }}>DELIVERABLE</div>
                        <p style={{ fontSize: 13, color: "#AAA", margin: 0, lineHeight: 1.6 }}>{t.deliverable}</p>
                      </div>
                      <div style={{ background: "#0D0D18", border: "1px solid #1A1A2E", borderRadius: 3, padding: "12px 14px" }}>
                        <div style={{ fontSize: 9, color: "#888", letterSpacing: "0.15em", fontFamily: "monospace", fontWeight: 700, marginBottom: 8 }}>MARKING CRITERIA</div>
                        <ul style={{ margin: 0, padding: "0 0 0 16px" }}>
                          {t.rubric.map((r, j) => (
                            <li key={j} style={{ fontSize: 12, color: "#666", lineHeight: 1.7 }}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {activeTask === null && (
              <div style={{ padding: "32px", background: "#0D0D18", border: "1px dashed #1A1A2E", borderRadius: 4, textAlign: "center", color: "#444", fontSize: 13 }}>
                ↑ Click any task card above to open step-by-step instructions
              </div>
            )}

            <NavBtns onPrev={() => setActiveSection("schema")} onNext={() => setActiveSection("looker")} />
          </div>
        )}

        {/* ── LOOKER ── */}
        {activeSection === "looker" && (
          <div>
            <SH num="04" title="Looker Studio Dashboard Guide" color="#CE93D8" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 20px" }}>
              Looker Studio (formerly Google Data Studio) is a <strong style={{ color: "#DDD8F0" }}>free, web-based BI tool that connects directly to BigQuery</strong>. You can build a professional, shareable dashboard in under 2 hours. No installation, no licence cost — and the shareable link goes straight into your portfolio.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, margin: "0 0 24px" }}>
              {[
                { stat: "Free", label: "Cost forever", color: "#81C784" },
                { stat: "Direct", label: "BigQuery connection", color: "#4FC3F7" },
                { stat: "Live", label: "Shareable URL for portfolio", color: "#FFD54F" },
              ].map((s, i) => (
                <div key={i} style={{ border: `1px solid ${s.color}33`, borderRadius: 4, padding: "16px", background: `${s.color}06`, textAlign: "center" }}>
                  <div style={{ fontSize: 24, fontWeight: 900, color: s.color, marginBottom: 6 }}>{s.stat}</div>
                  <div style={{ fontSize: 12, color: "#666" }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8, margin: "0 0 28px" }}>
              {lookerSteps.map((s, i) => {
                const open = expandedLooker === i;
                return (
                  <div key={i} style={{ border: `1px solid ${open ? s.color + "55" : "#1A1A2E"}`, borderRadius: 4, overflow: "hidden" }}>
                    <button onClick={() => setExpandedLooker(open ? null : i)} style={{
                      width: "100%", background: open ? `${s.color}0A` : "#0D0D18",
                      border: "none", cursor: "pointer", padding: "14px 18px",
                      display: "flex", alignItems: "flex-start", gap: 14,
                      fontFamily: "inherit", textAlign: "left",
                    }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: `${s.color}18`, border: `1px solid ${s.color}44`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ fontSize: 10, color: s.color, fontFamily: "monospace", fontWeight: 700 }}>{s.step}</span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#DDD8F0" }}>{s.title}</div>
                        {!open && <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>{s.detail.substring(0, 65)}...</div>}
                      </div>
                      <span style={{ color: s.color, fontSize: 16, transform: open ? "rotate(45deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }}>+</span>
                    </button>
                    {open && (
                      <div style={{ padding: "0 18px 18px 60px", background: `${s.color}06` }}>
                        <div style={{ height: 1, background: `${s.color}22`, margin: "0 0 14px" }} />
                        <p style={{ fontSize: 13, color: "#AAA", lineHeight: 1.7, margin: "0 0 10px" }}>{s.detail}</p>
                        <div style={{ display: "flex", gap: 8, background: "rgba(255,213,79,0.05)", border: "1px solid rgba(255,213,79,0.2)", borderRadius: 3, padding: "8px 12px" }}>
                          <span>💡</span>
                          <span style={{ fontSize: 12, color: "#FFD54F", lineHeight: 1.6 }}>{s.tip}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Dashboard layout wireframe */}
            <Subh title="Target Dashboard Layout" color="#CE93D8" />
            <div style={{ border: "1px solid #1A1A2E", borderRadius: 4, padding: "16px", background: "#0A0A14", margin: "16px 0 28px" }}>
              <div style={{ fontSize: 10, color: "#555", fontFamily: "monospace", letterSpacing: "0.15em", marginBottom: 12 }}>SHOPSTREAM ANALYTICS — LOOKER STUDIO WIREFRAME</div>
              {/* Header */}
              <div style={{ background: "#0D0D18", border: "1px solid #CE93D833", borderRadius: 3, padding: "8px 14px", marginBottom: 8, display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, color: "#CE93D8", fontWeight: 700 }}>ShopStream Analytics Dashboard</span>
                <div style={{ display: "flex", gap: 8 }}>
                  <span style={{ fontSize: 10, color: "#555", border: "1px solid #333", borderRadius: 2, padding: "2px 8px" }}>Date Range ▾</span>
                  <span style={{ fontSize: 10, color: "#555", border: "1px solid #333", borderRadius: 2, padding: "2px 8px" }}>Channel ▾</span>
                </div>
              </div>
              {/* KPIs */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, marginBottom: 8 }}>
                {["💰 Revenue", "📈 Gross Margin%", "📦 Avg Order", "↩️ Return Rate"].map((k, i) => (
                  <div key={i} style={{ background: "#0D0D18", border: "1px solid #4FC3F733", borderRadius: 3, padding: "10px", textAlign: "center" }}>
                    <div style={{ fontSize: 9, color: "#4FC3F7", fontFamily: "monospace" }}>{k}</div>
                    <div style={{ fontSize: 18, fontWeight: 900, color: "#DDD8F0", marginTop: 4 }}>—</div>
                  </div>
                ))}
              </div>
              {/* Charts row */}
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 6, marginBottom: 8 }}>
                <div style={{ background: "#0D0D18", border: "1px solid #81C78433", borderRadius: 3, padding: "10px", height: 64 }}>
                  <div style={{ fontSize: 9, color: "#81C784", fontFamily: "monospace", marginBottom: 8 }}>MONTHLY REVENUE TREND</div>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 36 }}>
                    {[35, 42, 38, 55, 48, 65, 58, 72, 68, 80, 90, 100].map((h, j) => (
                      <div key={j} style={{ flex: 1, height: `${h}%`, background: "#81C784", borderRadius: "2px 2px 0 0", opacity: 0.6 }} />
                    ))}
                  </div>
                </div>
                <div style={{ background: "#0D0D18", border: "1px solid #FFD54F33", borderRadius: 3, padding: "10px", height: 64 }}>
                  <div style={{ fontSize: 9, color: "#FFD54F", fontFamily: "monospace", marginBottom: 8 }}>REVENUE BY CATEGORY</div>
                  {["Electronics 42%", "Clothing 28%", "Home 18%", "Beauty 12%"].map((r, j) => (
                    <div key={j} style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 3 }}>
                      <div style={{ width: `${[42, 28, 18, 12][j]}%`, height: 5, background: "#FFD54F", borderRadius: 2, opacity: 0.7 }} />
                      <span style={{ fontSize: 8, color: "#555", fontFamily: "monospace" }}>{r}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Bottom table */}
              <div style={{ background: "#0D0D18", border: "1px solid #FF8A6533", borderRadius: 3, padding: "8px 12px" }}>
                <div style={{ fontSize: 9, color: "#FF8A65", fontFamily: "monospace", marginBottom: 6 }}>RFM SEGMENT SUMMARY</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                  {["Champion", "Loyal", "At Risk", "Lost"].map((seg, j) => (
                    <div key={j} style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 9, color: "#888", fontFamily: "monospace" }}>{seg}</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: ["#FFD700", "#81C784", "#FFD54F", "#FF8A65"][j] }}>—</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <NavBtns onPrev={() => setActiveSection("tasks")} onNext={() => setActiveSection("rubric")} />
          </div>
        )}

        {/* ── RUBRIC ── */}
        {activeSection === "rubric" && (
          <div>
            <SH num="05" title="Marking Rubric — Self Assessment" color="#FF8A65" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 20px" }}>
              Score your own work honestly. <strong style={{ color: "#DDD8F0" }}>75+ is a pass. 90+ is portfolio-ready.</strong> If you score below 75, identify the lowest-scoring task and redo it before starting Phase 3.
            </p>

            <div style={{ border: "1px solid #1A1A2E", borderRadius: 4, overflow: "hidden", margin: "0 0 24px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 70px 80px", gap: 12, padding: "10px 16px", background: "#0D0D18", borderBottom: "1px solid #1A1A2E" }}>
                {["Task", "Criteria", "Max", "Your Score"].map(h => (
                  <div key={h} style={{ fontSize: 9, color: "#555", letterSpacing: "0.12em", fontFamily: "monospace", textTransform: "uppercase" }}>{h}</div>
                ))}
              </div>
              {rubricRows.map((r, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 2fr 70px 80px", gap: 12, padding: "12px 16px", alignItems: "center", borderBottom: i < rubricRows.length - 1 ? "1px solid #0F0F18" : "none", background: i % 2 === 0 ? "#0A0A14" : "#07070E" }}>
                  <div style={{ fontSize: 11, color: "#FF8A65", fontFamily: "monospace", fontWeight: 700 }}>{r.task}</div>
                  <div style={{ fontSize: 12, color: "#666", lineHeight: 1.5 }}>{r.criteria}</div>
                  <div style={{ fontSize: 13, color: "#DDD8F0", fontFamily: "monospace", textAlign: "center" }}>{r.max}</div>
                  <input
                    type="number" min={0} max={r.max}
                    value={scores[r.task] ?? ""}
                    onChange={e => setScore(r.task, e.target.value)}
                    placeholder="0"
                    style={{ background: "#0D0D18", border: "1px solid #1A1A2E", borderRadius: 3, padding: "5px 8px", color: "#4ade80", fontFamily: "monospace", fontSize: 13, width: "60px", textAlign: "center", outline: "none" }}
                  />
                </div>
              ))}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 70px 80px", gap: 12, padding: "14px 16px", background: "#0D0D18", borderTop: "2px solid #1A1A2E" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#DDD8F0", gridColumn: "1/3" }}>TOTAL</div>
                <div style={{ fontSize: 14, fontWeight: 900, color: "#DDD8F0", fontFamily: "monospace", textAlign: "center" }}>{maxScore}</div>
                <div style={{ fontSize: 14, fontWeight: 900, fontFamily: "monospace", textAlign: "center", color: pct >= 90 ? "#4ade80" : pct >= 75 ? "#FFD54F" : totalScore > 0 ? "#FF8A65" : "#555" }}>{totalScore || "—"}</div>
              </div>
            </div>

            {/* Score result */}
            <div style={{ border: `1px solid ${pct >= 90 ? "#4ade80" : pct >= 75 ? "#FFD54F" : totalScore > 0 ? "#FF8A65" : "#1A1A2E"}33`, borderLeft: `4px solid ${pct >= 90 ? "#4ade80" : pct >= 75 ? "#FFD54F" : totalScore > 0 ? "#FF8A65" : "#333"}`, borderRadius: 4, padding: "20px 22px", background: pct >= 90 ? "rgba(74,222,128,0.04)" : pct >= 75 ? "rgba(255,213,79,0.04)" : "rgba(255,138,101,0.04)", marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap", marginBottom: 12 }}>
                <div style={{ fontSize: 44, fontWeight: 900, fontFamily: "monospace", color: pct >= 90 ? "#4ade80" : pct >= 75 ? "#FFD54F" : totalScore > 0 ? "#FF8A65" : "#333" }}>
                  {totalScore > 0 ? `${pct}%` : "—"}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#DDD8F0" }}>
                    {pct >= 90 ? "🏆 Portfolio Ready" : pct >= 75 ? "✅ Pass — Good Work" : totalScore > 0 ? "📚 Needs Improvement" : "Enter your scores →"}
                  </div>
                  <div style={{ fontSize: 12, color: "#555", marginTop: 3 }}>
                    {pct >= 90 ? "Upload to GitHub. Add the Looker Studio link to your LinkedIn." : pct >= 75 ? "Review lower-scoring tasks before Phase 3." : totalScore > 0 ? "Redo the weakest task before moving on." : "Click each task tab to score your work."}
                  </div>
                </div>
              </div>
              <div style={{ height: 6, background: "#1A1A2E", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, #FF8A65, ${pct >= 90 ? "#4ade80" : pct >= 75 ? "#FFD54F" : "#FF8A65"})`, borderRadius: 3, transition: "width 0.5s" }} />
              </div>
            </div>

            <div style={{ padding: "16px 18px", background: "#0D0D18", border: "1px solid #1A1A2E", borderRadius: 4 }}>
              <div style={{ fontSize: 11, color: "#555", letterSpacing: "0.15em", fontFamily: "monospace", marginBottom: 12 }}>PORTFOLIO UPLOAD CHECKLIST</div>
              {[
                "GitHub repo created (phase2-shopstream-analytics)",
                "All .sql query files committed to the repo",
                "README.md written with project summary and Looker Studio link",
                "Looker Studio dashboard shared as view-only",
                "Dashboard link added to GitHub README and LinkedIn profile",
                "Phase 2 added to CV under Projects section",
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8 }}>
                  <span style={{ color: "#4ade80", flexShrink: 0 }}>☐</span>
                  <span style={{ fontSize: 13, color: "#777" }}>{item}</span>
                </div>
              ))}
            </div>

            <NavBtns onPrev={() => setActiveSection("looker")} onNext={() => setActiveSection("review")} />
          </div>
        )}

        {/* ── REVIEW ── */}
        {activeSection === "review" && (
          <div>
            <SH num="06" title="Phase 2 Full Review — 12 Flashcards" color="#CE93D8" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 20px" }}>
              Flip each card to reveal the answer. These cover everything from Parts 1-4 of Phase 2. <strong style={{ color: "#DDD8F0" }}>If any card stumps you, go back to that section before starting Phase 3.</strong>
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12, margin: "0 0 36px" }}>
              {flashcards.map((card, i) => {
                const isFlipped = flipped[i];
                return (
                  <div key={i} onClick={() => toggleFlip(i)} style={{ cursor: "pointer", minHeight: 130 }}>
                    <div style={{
                      border: `1px solid ${isFlipped ? "#CE93D8" : "#1A1A2E"}`,
                      borderTop: `3px solid ${isFlipped ? "#CE93D8" : "#333"}`,
                      borderRadius: 4, padding: "16px",
                      background: isFlipped ? "rgba(206,147,216,0.06)" : "#0D0D18",
                      transition: "all 0.25s", minHeight: 130,
                      display: "flex", flexDirection: "column",
                    }}>
                      <div style={{ fontSize: 9, color: isFlipped ? "#CE93D8" : "#444", letterSpacing: "0.15em", fontFamily: "monospace", marginBottom: 10, textTransform: "uppercase" }}>
                        {isFlipped ? "ANSWER" : `QUESTION ${String(i + 1).padStart(2, "0")}`}
                      </div>
                      <div style={{ fontSize: 13, color: isFlipped ? "#AAA" : "#DDD8F0", lineHeight: 1.65, flex: 1 }}>
                        {isFlipped ? card.a : card.q}
                      </div>
                      <div style={{ fontSize: 10, color: "#333", marginTop: 12, textAlign: "right", fontFamily: "monospace" }}>
                        {isFlipped ? "← flip back" : "tap to reveal →"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Phase 2 concept map */}
            <Subh title="Phase 2 Concept Map" color="#CE93D8" />
            <div style={{ border: "1px solid #1A1A2E", borderRadius: 4, overflow: "hidden", margin: "16px 0 28px" }}>
              {[
                { part: "Part 1", color: "#FFD54F", topics: ["SELECT / WHERE / JOIN", "GROUP BY / HAVING / HAVING", "INNER / LEFT / RIGHT / FULL OUTER JOIN", "Subqueries: scalar, IN, derived table, EXISTS", "SQL execution order", "Common SQL mistakes"] },
                { part: "Part 2", color: "#FF8A65", topics: ["ROW_NUMBER / RANK / DENSE_RANK", "LAG / LEAD offset functions", "SUM() OVER() running totals", "CTEs: 4 patterns (WITH clause)", "Query performance: 6 rules", "Top N per group pattern"] },
                { part: "Part 3", color: "#CE93D8", topics: ["BigQuery setup and free tier", "Gemini AI: text-to-SQL, completion, explanation", "RFM segmentation with NTILE(4)", "Cohort retention with DATE_TRUNC / DATE_DIFF", "Funnel analysis with CASE WHEN counts", "SQLAI.ai / AI2sql / ChatGPT for SQL"] },
                { part: "Part 4", color: "#F48FB1", topics: ["End-to-end BigQuery project", "vw_rfm_segments view", "vw_cohort_retention view", "vw_funnel_analysis view", "Looker Studio dashboard", "Portfolio: GitHub + shareable link"] },
              ].map((p, i, arr) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 16, padding: "14px 18px", borderBottom: i < arr.length - 1 ? "1px solid #0F0F18" : "none", background: i % 2 === 0 ? "#0A0A14" : "#07070E" }}>
                  <div style={{ minWidth: 56, fontSize: 11, color: p.color, fontFamily: "monospace", fontWeight: 700, paddingTop: 2 }}>{p.part}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {p.topics.map(t => (
                      <span key={t} style={{ padding: "3px 9px", background: `${p.color}0D`, border: `1px solid ${p.color}30`, borderRadius: 2, fontSize: 11, color: p.color }}>{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <NavBtns onPrev={() => setActiveSection("rubric")} onNext={() => setActiveSection("next")} />
          </div>
        )}

        {/* ── PHASE 3 PREVIEW ── */}
        {activeSection === "next" && (
          <div>
            <SH num="07" title="Phase 2 Complete — What Is Next" color={ACC} />

            <div style={{ padding: "28px 30px", background: "linear-gradient(135deg, rgba(244,143,177,0.08) 0%, transparent 100%)", border: `1px solid ${ACC}33`, borderRadius: 4, marginBottom: 36, textAlign: "center" }}>
              <div style={{ fontSize: 52, marginBottom: 12 }}>🎉</div>
              <h2 style={{ margin: "0 0 10px", fontSize: 26, fontWeight: 900, color: "#DDD8F0" }}>Phase 2 Complete</h2>
              <p style={{ fontSize: 14, color: "#777", lineHeight: 1.8, maxWidth: 500, margin: "0 auto 20px" }}>
                You now speak SQL fluently — from basic SELECTs to window functions, CTEs, BigQuery, and three production-grade analytics patterns. You have a live dashboard in your portfolio. Phase 3 is where the real power kicks in: Python.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
                {["SQL Fundamentals ✓", "Advanced SQL ✓", "BigQuery + Gemini ✓", "RFM / Cohort / Funnel ✓", "Looker Studio ✓", "2nd Portfolio Project ✓"].map(tag => (
                  <span key={tag} style={{ padding: "5px 14px", background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.25)", borderRadius: 2, fontSize: 12, color: "#4ade80" }}>{tag}</span>
                ))}
              </div>
            </div>

            <Subh title="Phase 3 — Python for Analytics (Weeks 7–10)" color={ACC} />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 20px" }}>
              Python is where data analytics meets data science. You will go from zero Python to writing full EDA pipelines, machine learning models, and AI-assisted analysis — faster than you think with GitHub Copilot writing 40% of your code.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 8, margin: "0 0 28px" }}>
              {[
                { week: "Week 7", title: "Python + AI Pair Programming",     topics: ["Python fundamentals: pandas, numpy", "GitHub Copilot in VS Code — AI writes code with you", "ChatGPT Code Interpreter: upload CSV, chat with data", "Julius AI: drag-and-drop no-code data analysis"], color: "#B2FF59" },
                { week: "Week 8", title: "Exploratory Data Analysis (EDA)",  topics: ["ydata-profiling: one-line automated EDA reports", "Matplotlib + Seaborn + Plotly interactive charts", "PandasAI: query DataFrames in plain English", "Univariate, bivariate, multivariate analysis"], color: "#4FC3F7" },
                { week: "Week 9", title: "Data Wrangling & Transformation",  topics: ["Merging, joining, reshaping DataFrames", "GroupBy, pivot_table, melt", "Working with dates, text, categorical data", "Web scraping basics with BeautifulSoup"], color: "#FFD54F" },
                { week: "Week 10", title: "ML for Analysts + Generative AI",  topics: ["Scikit-learn: regression, classification, clustering", "H2O AutoML: train 100 models automatically", "SHAP values: explain predictions to stakeholders", "OpenAI API: build a Q&A chatbot over your CSV data"], color: "#FF8A65" },
              ].map((w, i) => (
                <div key={i} style={{ border: `1px solid ${w.color}33`, borderLeft: `3px solid ${w.color}`, borderRadius: 4, padding: "14px 18px", background: "#0D0D18" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 10, color: w.color, fontFamily: "monospace", letterSpacing: "0.15em" }}>{w.week}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#DDD8F0" }}>{w.title}</span>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {w.topics.map(t => (
                      <span key={t} style={{ padding: "3px 9px", background: `${w.color}0D`, border: `1px solid ${w.color}25`, borderRadius: 2, fontSize: 11, color: "#777" }}>{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Phase 3 project */}
            <div style={{ border: "1px solid #B2FF5944", borderLeft: "4px solid #B2FF59", borderRadius: 4, padding: "20px 22px", background: "rgba(178,255,89,0.04)", marginBottom: 28 }}>
              <div style={{ fontSize: 10, color: "#B2FF59", letterSpacing: "0.2em", fontFamily: "monospace", marginBottom: 8 }}>PHASE 3 PROJECT</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: "#DDD8F0", marginBottom: 8 }}>🤖 AI-Powered Customer Intelligence Platform</div>
              <p style={{ fontSize: 13, color: "#888", lineHeight: 1.7, margin: "0 0 14px" }}>
                Build a full Python analytics pipeline: auto-EDA with ydata-profiling, customer churn prediction with AutoML, SHAP explainability charts, and a LangChain chatbot that lets stakeholders ask questions about the data in plain English. Deployed as a Streamlit app.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {["Python", "Pandas", "Scikit-learn", "H2O AutoML", "SHAP", "LangChain", "Streamlit"].map(t => (
                  <span key={t} style={{ padding: "3px 10px", background: "rgba(178,255,89,0.08)", border: "1px solid rgba(178,255,89,0.2)", borderRadius: 2, fontSize: 11, color: "#B2FF59" }}>{t}</span>
                ))}
              </div>
            </div>

            {/* New AI tools */}
            <Subh title="New AI Tools in Phase 3" color={ACC} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(175px, 1fr))", gap: 8, margin: "16px 0 32px" }}>
              {[
                { name: "GitHub Copilot",    color: "#6E40C9" },
                { name: "Julius AI",         color: "#FF6D9D" },
                { name: "PandasAI",          color: "#B2FF59" },
                { name: "ydata-profiling",   color: "#4FC3F7" },
                { name: "H2O AutoML",        color: "#FFA500" },
                { name: "SHAP",              color: "#FFD54F" },
                { name: "LangChain",         color: "#CE93D8" },
                { name: "OpenAI API",        color: "#10A37F" },
              ].map(t => (
                <div key={t.name} style={{ border: `1px solid ${t.color}33`, borderRadius: 4, padding: "10px 14px", background: "#0D0D18", display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 14 }}>🤖</span>
                  <span style={{ fontSize: 12, color: t.color, fontFamily: "monospace" }}>{t.name}</span>
                </div>
              ))}
            </div>

            {/* Setup checklist */}
            <div style={{ padding: "20px 22px", background: "rgba(178,255,89,0.04)", border: "1px solid rgba(178,255,89,0.2)", borderRadius: 4, marginBottom: 28 }}>
              <div style={{ fontSize: 11, color: "#B2FF59", letterSpacing: "0.15em", fontFamily: "monospace", marginBottom: 14 }}>BEFORE PHASE 3 — SETUP CHECKLIST</div>
              {[
                "Phase 2 capstone scored 75+ and uploaded to GitHub",
                "Anaconda / Python 3.10+ installed and Jupyter Notebook working",
                "VS Code installed with Python + Jupyter + GitHub Copilot extensions",
                "GitHub Copilot activated (free for students via GitHub Education Pack)",
                "Run: pip install pandas numpy matplotlib seaborn scikit-learn ydata-profiling",
                "Optional: create a free Julius AI account at julius.ai",
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8 }}>
                  <span style={{ color: "#B2FF59", flexShrink: 0 }}>☐</span>
                  <span style={{ fontSize: 13, color: "#777" }}>{item}</span>
                </div>
              ))}
            </div>

            <div style={{ padding: "20px 24px", background: "#0D0D18", border: "1px solid #1A1A2E", borderRadius: 4, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#DDD8F0", marginBottom: 4 }}>Ready to start Phase 3?</div>
                <div style={{ fontSize: 12, color: "#555" }}>Say "Give me Phase 3 Part 1" to continue your journey.</div>
              </div>
              <div style={{ padding: "10px 20px", background: "rgba(178,255,89,0.1)", border: "1px solid rgba(178,255,89,0.3)", borderRadius: 3, fontSize: 12, color: "#B2FF59", fontFamily: "monospace", fontWeight: 700 }}>
                PHASE 3 → PYTHON ANALYTICS
              </div>
            </div>

            <NavBtns onPrev={() => setActiveSection("review")} />
          </div>
        )}

      </div>
    </div>
  );
}

// ─── SHARED COMPONENTS ────────────────────────────────────────
function SH({ num, title, color }) {
  return (
    <div style={{ marginBottom: 28, paddingBottom: 16, borderBottom: "1px solid #1A1A2E" }}>
      <div style={{ fontSize: 10, color: color, letterSpacing: "0.3em", fontFamily: "monospace", marginBottom: 6 }}>SECTION {num}</div>
      <h2 style={{ margin: 0, fontSize: "clamp(20px,3vw,28px)", fontWeight: 900, color: "#DDD8F0", letterSpacing: "-0.01em" }}>
        <span style={{ color: color }}>{num}. </span>{title}
      </h2>
    </div>
  );
}
function Subh({ title, color }) {
  return <h3 style={{ fontSize: 16, fontWeight: 700, color: "#DDD8F0", margin: "32px 0 12px", borderLeft: `3px solid ${color}`, paddingLeft: 12 }}>{title}</h3>;
}
function NavBtns({ onPrev, onNext, nextLabel = "Next Section →" }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 48, paddingTop: 24, borderTop: "1px solid #1A1A2E" }}>
      {onPrev
        ? <button onClick={onPrev} style={{ background: "none", border: "1px solid #1A1A2E", borderRadius: 3, padding: "8px 18px", cursor: "pointer", fontFamily: "monospace", fontSize: 11, color: "#555", letterSpacing: "0.1em" }}>← Previous</button>
        : <div />}
      {onNext && (
        <button onClick={onNext} style={{ background: "#F48FB1", border: "none", borderRadius: 3, padding: "8px 24px", cursor: "pointer", fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: "#07070E", letterSpacing: "0.1em" }}>{nextLabel}</button>
      )}
    </div>
  );
}
