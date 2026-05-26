"use client";
// @ts-nocheck
import { useState } from "react";

const quizQuestions = [
  {
    q: "In Google BigQuery, you are charged based on:",
    options: [
      "Number of queries you run per day",
      "Amount of data scanned by each query",
      "Number of rows returned",
      "Time the query takes to run"
    ],
    answer: 1,
    explanation: "BigQuery charges per byte scanned — not per query or row returned. This is why SELECT * is expensive: it scans all columns. Always SELECT only the columns you need, and use WHERE clauses to reduce the data scanned. The free tier gives 1TB of queries per month."
  },
  {
    q: "In RFM segmentation, what do R, F, and M stand for?",
    options: [
      "Revenue, Frequency, Margin",
      "Recency, Frequency, Monetary",
      "Retention, Funnel, Monetisation",
      "Revenue, Funnel, Monthly"
    ],
    answer: 1,
    explanation: "RFM = Recency (how recently did they buy?), Frequency (how often do they buy?), Monetary (how much do they spend?). These three dimensions together predict customer value and churn risk better than any single metric alone."
  },
  {
    q: "A cohort analysis groups customers by:",
    options: [
      "Their total lifetime spend",
      "Their geographic region",
      "The time period when they first became a customer",
      "Their product category preference"
    ],
    answer: 2,
    explanation: "Cohort analysis groups users by their acquisition date (the month/week they first signed up or purchased). You then track each cohort over time to see retention, revenue, and behaviour patterns. It answers: 'Are customers acquired this year better than last year?'"
  },
  {
    q: "A funnel analysis shows drop-off of 60% between 'Add to Cart' and 'Checkout'. What does this mean?",
    options: [
      "60% of customers complete a purchase",
      "60% of customers who added to cart did NOT proceed to checkout",
      "The checkout page loads 60% slower than the cart page",
      "60% of revenue comes from checkout"
    ],
    answer: 1,
    explanation: "A 60% drop-off means 60% of users who reached 'Add to Cart' did NOT go to 'Checkout'. Only 40% converted to the next step. This signals a major friction point between cart and checkout — a priority for the product team to fix."
  },
  {
    q: "Gemini AI in BigQuery allows you to:",
    options: [
      "Only format and clean data automatically",
      "Write SQL from natural language questions about your data",
      "Replace BigQuery entirely with AI-generated tables",
      "Only work with Google Sheets data"
    ],
    answer: 1,
    explanation: "Gemini in BigQuery (Duet AI) lets you type a plain English question like 'Show me total revenue by region for Q4' and it generates the SQL query for you. You can also ask it to explain existing queries, suggest optimisations, and complete partial SQL."
  },
  {
    q: "What is the correct SQL pattern to calculate 30-day retention for a cohort?",
    options: [
      "GROUP BY signup_month and COUNT all users",
      "JOIN the cohort's first order to subsequent orders within 30 days, then divide retained users by total cohort size",
      "Use RANK() OVER to sort users by order date",
      "Use a HAVING clause to filter users with more than one order"
    ],
    answer: 1,
    explanation: "Retention = users who came back / total users in cohort. You JOIN users' first order date to any subsequent order within 30 days. Count how many users appear in the join (retained). Divide by total cohort size. Multiply by 100 for percentage."
  },
];

const bigquerySetup = [
  { step: "01", title: "Create a Google Account", color: "#4FC3F7", desc: "You need a Google account. Use an existing Gmail or create one. Go to console.cloud.google.com.", cmd: "# Go to: console.cloud.google.com\n# Sign in with your Google account\n# Accept terms of service", note: "Free tier: 10GB storage + 1TB queries/month — enough for all course exercises." },
  { step: "02", title: "Create a GCP Project", color: "#81C784", desc: "Click 'Select a project' at the top → New Project → name it 'data-analytics-course'.", cmd: "Project name: data-analytics-course\nProject ID: auto-generated\nBilling: NOT required for free tier queries", note: "You do NOT need to add a credit card for the free tier. BigQuery free tier requires no billing setup." },
  { step: "03", title: "Open BigQuery Console", color: "#FFD54F", desc: "In the left menu: Big Data → BigQuery. Or go directly to bigquery.cloud.google.com.", cmd: "# Direct URL:\n# https://console.cloud.google.com/bigquery\n# Bookmark this — you will use it daily", note: "The BigQuery console has a SQL editor, schema browser, query results, and job history all in one view." },
  { step: "04", title: "Load the RetailCo Dataset", color: "#FF8A65", desc: "Click your project → Create Dataset → name it 'retailco'. Then Create Table → upload the CSV from Phase 1 Part 4.", cmd: "Dataset: retailco\nTable: orders\nSource: Upload CSV from Phase 1\nAuto-detect schema: ON", note: "BigQuery auto-detects column types from your CSV. Review them after upload — dates sometimes import as strings." },
  { step: "05", title: "Run Your First Query", color: "#CE93D8", desc: "In the SQL editor, run this to verify your data loaded correctly.", cmd: "SELECT\n  COUNT(*) AS total_rows,\n  MIN(order_date) AS first_order,\n  MAX(order_date) AS last_order,\n  SUM(units * price) AS total_revenue\nFROM `your-project.retailco.orders`\nWHERE status = 'Completed';", note: "Replace 'your-project' with your actual GCP project ID. BigQuery uses backtick table references: `project.dataset.table`." },
  { step: "06", title: "Enable Gemini AI (Duet AI)", color: "#F48FB1", desc: "In BigQuery console → click the Gemini icon (sparkle) in the top right → Enable Duet AI for BigQuery.", cmd: "# Click the sparkle/Gemini icon in BigQuery editor\n# Select 'Enable Duet AI'\n# Sign terms\n# Gemini panel opens on the right side", note: "Duet AI may not be available on all free accounts. If unavailable, use ChatGPT or Claude with your schema for the same result." },
];

const geminiPatterns = [
  {
    type: "Text to SQL",
    color: "#4285F4",
    desc: "Type a business question in the Gemini panel — it writes the SQL for you.",
    prompts: [
      "Show me total revenue by region and product category for completed orders",
      "Which sales rep had the highest average order value last quarter?",
      "Find all customers who placed more than 3 orders in 2024",
      "Show me monthly revenue with month-over-month percentage change"
    ],
    tip: "Gemini reads your schema automatically. Still review every generated query before running — column name hallucinations do happen."
  },
  {
    type: "SQL Completion",
    color: "#34A853",
    desc: "Start typing a query and Gemini auto-completes the rest — like GitHub Copilot but inside BigQuery.",
    prompts: [
      "-- Start typing: SELECT region, SUM( → Gemini suggests the rest",
      "-- Type: WITH monthly_rev AS ( → Gemini fills in the CTE",
      "-- Type: WHERE order_date BETWEEN → Gemini suggests date range"
    ],
    tip: "Accept suggestions with Tab. Press Escape to dismiss. You can keep typing to override the suggestion."
  },
  {
    type: "Query Explanation",
    color: "#FBBC05",
    desc: "Highlight any SQL query and ask Gemini to explain it in plain English.",
    prompts: [
      "Explain this query in simple language",
      "What does the PARTITION BY clause do in this window function?",
      "Why does this query return fewer rows than expected?",
      "What would happen if I removed the HAVING clause here?"
    ],
    tip: "Great for understanding legacy SQL written by colleagues. Paste any query and ask 'explain each line in plain English'."
  },
  {
    type: "Query Optimisation",
    color: "#EA4335",
    desc: "Ask Gemini to review your query for performance issues and suggest improvements.",
    prompts: [
      "How can I make this query scan less data?",
      "Is there a more efficient way to write this JOIN?",
      "This query processes 2GB — how can I reduce that?",
      "Suggest partitioning or clustering for this table"
    ],
    tip: "BigQuery shows estimated bytes scanned before you run a query. Aim to reduce this. Gemini can advise on partition pruning."
  },
];

const rfmSQL = `-- RFM SEGMENTATION QUERY
-- Calculates Recency, Frequency, Monetary for each customer
-- Then scores each dimension 1-4 (4 = best)

WITH customer_metrics AS (
  SELECT
    customer_id,
    -- Recency: days since last purchase (lower = better)
    DATEDIFF(CURRENT_DATE, MAX(order_date))   AS recency_days,
    -- Frequency: number of completed orders
    COUNT(*)                                   AS frequency,
    -- Monetary: total revenue from this customer
    SUM(units * price)                         AS monetary
  FROM orders
  WHERE status = 'Completed'
  GROUP BY customer_id
),
rfm_scored AS (
  SELECT
    customer_id,
    recency_days,
    frequency,
    ROUND(monetary, 2) AS monetary,
    -- Score recency: recent buyers score 4, oldest score 1
    NTILE(4) OVER (ORDER BY recency_days ASC)  AS r_score,
    -- Score frequency: most frequent score 4
    NTILE(4) OVER (ORDER BY frequency DESC)    AS f_score,
    -- Score monetary: highest spenders score 4
    NTILE(4) OVER (ORDER BY monetary DESC)     AS m_score
  FROM customer_metrics
)
SELECT
  customer_id,
  recency_days,
  frequency,
  monetary,
  r_score, f_score, m_score,
  -- Combined RFM score (max 12)
  r_score + f_score + m_score AS total_rfm_score,
  -- Customer segment labels
  CASE
    WHEN r_score = 4 AND f_score >= 3 THEN 'Champion'
    WHEN r_score >= 3 AND f_score >= 3 THEN 'Loyal Customer'
    WHEN r_score = 4 AND f_score <= 2 THEN 'Recent Customer'
    WHEN r_score >= 3 AND f_score = 1 THEN 'Promising'
    WHEN r_score = 2 AND f_score >= 2 THEN 'At Risk'
    WHEN r_score <= 2 AND f_score >= 3 THEN 'Cant Lose Them'
    WHEN r_score = 1 AND f_score = 1 THEN 'Lost'
    ELSE 'Needs Attention'
  END AS customer_segment
FROM rfm_scored
ORDER BY total_rfm_score DESC;`;

const cohortSQL = `-- COHORT RETENTION ANALYSIS
-- Groups customers by their first purchase month
-- Tracks what % of each cohort returns in subsequent months

WITH first_orders AS (
  -- Step 1: Find each customer's first order month
  SELECT
    customer_id,
    DATE_TRUNC(MIN(order_date), MONTH) AS cohort_month
  FROM orders
  WHERE status = 'Completed'
  GROUP BY customer_id
),
customer_orders AS (
  -- Step 2: Tag every order with the customer's cohort month
  SELECT
    o.customer_id,
    f.cohort_month,
    DATE_TRUNC(o.order_date, MONTH) AS order_month
  FROM orders o
  JOIN first_orders f ON o.customer_id = f.customer_id
  WHERE o.status = 'Completed'
),
cohort_data AS (
  -- Step 3: Calculate month number (0 = acquisition month)
  SELECT
    cohort_month,
    DATE_DIFF(order_month, cohort_month, MONTH) AS month_number,
    COUNT(DISTINCT customer_id) AS retained_customers
  FROM customer_orders
  GROUP BY cohort_month, month_number
),
cohort_sizes AS (
  -- Step 4: Get total size of each cohort (month 0)
  SELECT cohort_month, retained_customers AS cohort_size
  FROM cohort_data
  WHERE month_number = 0
)
-- Step 5: Calculate retention rate
SELECT
  c.cohort_month,
  cs.cohort_size,
  c.month_number,
  c.retained_customers,
  ROUND(
    c.retained_customers * 100.0 / cs.cohort_size, 1
  ) AS retention_rate_pct
FROM cohort_data c
JOIN cohort_sizes cs ON c.cohort_month = cs.cohort_month
ORDER BY c.cohort_month, c.month_number;`;

const funnelSQL = `-- FUNNEL ANALYSIS QUERY
-- Measures conversion between each stage of a user journey
-- Calculates drop-off % at every step

WITH funnel_counts AS (
  SELECT
    -- Count distinct users at each funnel stage
    COUNT(DISTINCT CASE WHEN event = 'page_view'
      THEN user_id END)    AS step1_page_views,
    COUNT(DISTINCT CASE WHEN event = 'product_view'
      THEN user_id END)    AS step2_product_views,
    COUNT(DISTINCT CASE WHEN event = 'add_to_cart'
      THEN user_id END)    AS step3_add_to_cart,
    COUNT(DISTINCT CASE WHEN event = 'checkout_start'
      THEN user_id END)    AS step4_checkout,
    COUNT(DISTINCT CASE WHEN event = 'purchase'
      THEN user_id END)    AS step5_purchase
  FROM user_events
  WHERE event_date >= DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY)
)
SELECT
  'Page View'       AS stage, step1_page_views AS users,
  100.0             AS pct_of_top,
  NULL              AS dropoff_pct FROM funnel_counts
UNION ALL
SELECT 'Product View', step2_product_views,
  ROUND(step2_product_views*100.0/step1_page_views,1),
  ROUND(100-(step2_product_views*100.0/step1_page_views),1)
  FROM funnel_counts
UNION ALL
SELECT 'Add to Cart', step3_add_to_cart,
  ROUND(step3_add_to_cart*100.0/step1_page_views,1),
  ROUND(100-(step3_add_to_cart*100.0/step2_product_views),1)
  FROM funnel_counts
UNION ALL
SELECT 'Checkout', step4_checkout,
  ROUND(step4_checkout*100.0/step1_page_views,1),
  ROUND(100-(step4_checkout*100.0/step3_add_to_cart),1)
  FROM funnel_counts
UNION ALL
SELECT 'Purchase', step5_purchase,
  ROUND(step5_purchase*100.0/step1_page_views,1),
  ROUND(100-(step5_purchase*100.0/step4_checkout),1)
  FROM funnel_counts;`;

const businessPatterns = [
  {
    name: "RFM Customer Segmentation",
    icon: "👥",
    color: "#4FC3F7",
    business: "Which customers are most valuable? Who is about to churn? Who should we re-engage?",
    segments: ["Champion: bought recently, buys often, spends most", "Loyal Customer: buys regularly, high frequency", "At Risk: used to buy regularly, not seen recently", "Lost: low recency, low frequency, low spend"],
    sql: rfmSQL,
    insight: "Champions (top RFM) often represent 20% of customers but 60%+ of revenue. At Risk customers need a win-back campaign before they become Lost."
  },
  {
    name: "Cohort Retention Analysis",
    icon: "📅",
    color: "#81C784",
    business: "Are customers acquired this year sticking around better than last year? Which acquisition channel retains best?",
    segments: ["Month 0: 100% (acquisition month)", "Month 1: % of cohort that orders again in month 2", "Month 3: % still active after 90 days", "Month 6+: long-term retention benchmark"],
    sql: cohortSQL,
    insight: "A healthy e-commerce cohort retains 20-40% at Month 3. If Month 1 retention drops below 15%, your onboarding or product needs work urgently."
  },
  {
    name: "Funnel Analysis",
    icon: "🔽",
    color: "#FFD54F",
    business: "Where exactly in the user journey are we losing potential customers? What is the biggest opportunity to fix?",
    segments: ["Page View → Product View: discovery quality", "Product View → Add to Cart: product-market fit", "Add to Cart → Checkout: cart abandonment rate", "Checkout → Purchase: checkout friction"],
    sql: funnelSQL,
    insight: "Focus optimisation on the step with the highest drop-off first. A 10% improvement in the worst step beats a 30% improvement in any other step."
  },
];

const sqlaiTools = [
  {
    name: "SQLAI.ai",
    color: "#FFD54F",
    url: "sqlai.ai",
    desc: "Type a business question in plain English, paste your schema, and get SQL instantly. Free tier available.",
    bestFor: "Quick ad-hoc queries when you know what you want but not the exact syntax.",
    prompt: "I have a table called orders with columns: customer_id, region, product, units, price, status, order_date. Show me the top 5 customers by total spend from completed orders in 2024.",
    tip: "Paste your full schema (CREATE TABLE statement or column list) for best results. Without schema, it guesses column names."
  },
  {
    name: "AI2sql.io",
    color: "#4FC3F7",
    url: "ai2sql.io",
    desc: "Upload your schema, choose your SQL dialect (BigQuery, MySQL, PostgreSQL), and query in English.",
    bestFor: "When you need dialect-specific SQL — especially BigQuery vs standard SQL differences.",
    prompt: "Show monthly revenue trend for 2024 with percentage change from previous month. Use BigQuery syntax with DATE_TRUNC.",
    tip: "Specify your database dialect explicitly. BigQuery SQL differs from MySQL in date functions and string handling."
  },
  {
    name: "ChatGPT / Claude",
    color: "#10A37F",
    url: "chatgpt.com / claude.ai",
    desc: "The most flexible option. Paste schema, describe the question, specify the dialect, get SQL plus explanation.",
    bestFor: "Complex multi-step queries, debugging, learning — anything requiring context and iteration.",
    prompt: "I am using Google BigQuery. My table is: orders(customer_id STRING, region STRING, product STRING, units INT64, price FLOAT64, status STRING, order_date DATE). Write an RFM analysis query that segments customers into Champions, Loyal, At Risk, and Lost using NTILE(4) scoring. Explain each step.",
    tip: "Include the CREATE TABLE or column definitions in your first message. Then iterate: 'now add a column for...' or 'fix this error: ...'."
  },
  {
    name: "GitHub Copilot in VS Code",
    color: "#6E40C9",
    url: "github.com/features/copilot",
    desc: "Write SQL comments describing what you want — Copilot autocompletes the query as you type.",
    bestFor: "Analysts writing SQL files in VS Code, dbt projects, or any code editor workflow.",
    prompt: "-- Calculate 30-day cohort retention for each signup month\n-- Join first_orders to subsequent orders within 30 days\n-- Return cohort_month, cohort_size, retained_count, retention_pct",
    tip: "The comment is your prompt. The more specific the comment, the better the suggestion. Accept with Tab, reject with Esc."
  },
];

const sections = [
  { id: "intro",     label: "Overview"    },
  { id: "bigquery",  label: "BigQuery"    },
  { id: "gemini",    label: "Gemini AI"   },
  { id: "rfm",       label: "RFM"         },
  { id: "cohort",    label: "Cohort"      },
  { id: "funnel",    label: "Funnel"      },
  { id: "aitools",   label: "AI Tools"    },
  { id: "quiz",      label: "Quiz"        },
];

export default function Phase2Part3() {
  const [activeSection, setActiveSection] = useState("intro");
  const [expandedSetup, setExpandedSetup] = useState(null);
  const [expandedGemini, setExpandedGemini] = useState(null);
  const [expandedPattern, setExpandedPattern] = useState(null);
  const [expandedTool, setExpandedTool] = useState(null);
  const [showSQL, setShowSQL] = useState({});
  const [quizState, setQuizState] = useState({ idx: 0, selected: null, answered: false, score: 0, done: false });

  const ACC = "#CE93D8";

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
  const toggleSQL = (key) => setShowSQL(p => ({ ...p, [key]: !p[key] }));

  return (
    <div style={{ minHeight: "100vh", background: "#07070E", color: "#DDD8F0", fontFamily: "Georgia, 'Times New Roman', serif" }}>

      {/* NAV */}
      <div style={{ background: "#0A0A14", borderBottom: "1px solid #16162A", padding: "0 24px", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 920, margin: "0 auto", display: "flex", alignItems: "center", overflowX: "auto" }}>
          <div style={{ fontSize: 10, color: ACC, letterSpacing: "0.22em", textTransform: "uppercase", padding: "14px 20px 14px 0", borderRight: "1px solid #1A1A2E", marginRight: 12, whiteSpace: "nowrap" }}>
            P2 · PART 3
          </div>
          {sections.map(s => (
            <button key={s.id} onClick={() => setActiveSection(s.id)} style={{
              background: "none", border: "none", cursor: "pointer",
              padding: "14px 12px", fontFamily: "inherit", fontSize: 11,
              color: activeSection === s.id ? ACC : "#444",
              borderBottom: activeSection === s.id ? `2px solid ${ACC}` : "2px solid transparent",
              transition: "all 0.2s", whiteSpace: "nowrap",
            }}>{s.label}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 920, margin: "0 auto", padding: "48px 24px 100px" }}>

        {/* ── INTRO ── */}
        {activeSection === "intro" && (
          <div>
            <div style={{ marginBottom: 52, borderLeft: `3px solid ${ACC}`, paddingLeft: 24 }}>
              <div style={{ fontSize: 10, color: ACC, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 12 }}>
                PHASE 2 · PART 3 OF 4 · WEEK 5
              </div>
              <h1 style={{ fontSize: "clamp(26px,5vw,44px)", fontWeight: 900, margin: "0 0 16px", lineHeight: 1.12, letterSpacing: "-0.02em" }}>
                AI-Powered SQL<br />
                <span style={{ color: ACC }}>BigQuery + Gemini</span><br />
                <span style={{ fontStyle: "italic", fontWeight: 400, fontSize: "0.65em", color: "#555" }}>RFM, Cohort and Funnel Analysis</span>
              </h1>
              <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, maxWidth: 580, margin: "0 0 24px" }}>
                This is where SQL meets cloud scale and AI acceleration. You will set up Google BigQuery, use Gemini AI to generate queries from plain English, and build the three business analytics patterns every data team runs: RFM segmentation, cohort retention, and funnel analysis.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {["~5 hours", "BigQuery setup", "Gemini AI", "4 AI SQL tools", "RFM segmentation", "Cohort analysis", "Funnel analysis", "6-question quiz"].map(tag => (
                  <span key={tag} style={{ padding: "4px 12px", background: "rgba(206,147,216,0.08)", border: "1px solid rgba(206,147,216,0.22)", borderRadius: 2, fontSize: 11, color: ACC }}>{tag}</span>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 28, paddingBottom: 16, borderBottom: "1px solid #1A1A2E" }}>
              <div style={{ fontSize: 10, color: ACC, letterSpacing: "0.3em", fontFamily: "monospace", marginBottom: 6 }}>SECTION 00</div>
              <h2 style={{ margin: 0, fontSize: "clamp(20px,3vw,28px)", fontWeight: 900, color: "#DDD8F0" }}>
                <span style={{ color: ACC }}>00. </span>What You Will Learn
              </h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 10, margin: "24px 0 36px" }}>
              {[
                { icon: "☁️", title: "BigQuery Setup", desc: "Free tier setup, loading the RetailCo dataset, first queries in the cloud", color: "#4FC3F7", section: "bigquery" },
                { icon: "♊", title: "Gemini AI in BigQuery", desc: "Text-to-SQL, autocomplete, query explanation, and optimisation prompts", color: "#4285F4", section: "gemini" },
                { icon: "👥", title: "RFM Segmentation", desc: "Recency, Frequency, Monetary scoring with NTILE — full production SQL", color: "#81C784", section: "rfm" },
                { icon: "📅", title: "Cohort Analysis", desc: "Group customers by acquisition month, track retention over time", color: "#FFD54F", section: "cohort" },
                { icon: "🔽", title: "Funnel Analysis", desc: "Measure conversion drop-off at every step of the user journey", color: "#FF8A65", section: "funnel" },
                { icon: "🤖", title: "AI SQL Tools", desc: "SQLAI.ai, AI2sql, ChatGPT, GitHub Copilot — text-to-SQL comparison", color: "#CE93D8", section: "aitools" },
              ].map((item, i) => (
                <div key={i} onClick={() => setActiveSection(item.section)} style={{
                  border: `1px solid ${item.color}33`, borderTop: `3px solid ${item.color}`,
                  borderRadius: 4, padding: "14px", background: "#0D0D18",
                  cursor: "pointer", transition: "background 0.2s",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = `${item.color}08`}
                  onMouseLeave={e => e.currentTarget.style.background = "#0D0D18"}
                >
                  <div style={{ fontSize: 22, marginBottom: 8 }}>{item.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#DDD8F0", marginBottom: 5 }}>{item.title}</div>
                  <div style={{ fontSize: 11, color: "#444", lineHeight: 1.6 }}>{item.desc}</div>
                </div>
              ))}
            </div>

            <div style={{ margin: "20px 0", padding: "14px 18px", background: "rgba(206,147,216,0.07)", border: "1px solid rgba(206,147,216,0.3)", borderLeft: `3px solid ${ACC}`, borderRadius: 4 }}>
              <div style={{ fontSize: 12, color: ACC, fontWeight: 700, marginBottom: 8 }}>☁️ Why BigQuery + AI Changes Everything</div>
              <div style={{ fontSize: 13, color: "#666", lineHeight: 1.82 }}>
                BigQuery lets you query terabytes of data in seconds with no infrastructure. Gemini AI means analysts who understand the business question can get SQL written for them instantly. The combination — cloud scale + AI generation + human validation — is the stack used at Google, Spotify, Twitter, and thousands of data teams in 2025.
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 48, paddingTop: 24, borderTop: "1px solid #1A1A2E" }}>
              <button onClick={() => setActiveSection("bigquery")} style={{ background: ACC, border: "none", borderRadius: 3, padding: "8px 24px", cursor: "pointer", fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: "#07070E", letterSpacing: "0.1em" }}>Next Section →</button>
            </div>
          </div>
        )}

        {/* ── BIGQUERY ── */}
        {activeSection === "bigquery" && (
          <div>
            <SH num="01" title="Google BigQuery Setup" color="#4FC3F7" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 16px" }}>
              BigQuery is Google's <strong style={{ color: "#DDD8F0" }}>serverless, cloud-native data warehouse</strong>. No server to manage, no installation, scales to petabytes automatically. The free tier gives you enough to run every query in this course — 1TB of queries and 10GB of storage per month at zero cost.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, margin: "20px 0 28px" }}>
              {[
                { stat: "1 TB", label: "Free queries per month", color: "#4FC3F7" },
                { stat: "10 GB", label: "Free storage per month", color: "#81C784" },
                { stat: "$0", label: "Credit card required", color: "#FFD54F" },
              ].map((s, i) => (
                <div key={i} style={{ border: `1px solid ${s.color}33`, borderRadius: 4, padding: "18px", background: `${s.color}06`, textAlign: "center" }}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: s.color, marginBottom: 6 }}>{s.stat}</div>
                  <div style={{ fontSize: 12, color: "#666" }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8, margin: "0 0 28px" }}>
              {bigquerySetup.map((s, i) => {
                const open = expandedSetup === i;
                return (
                  <div key={i} style={{ border: `1px solid ${open ? s.color + "55" : "#1A1A2E"}`, borderRadius: 4, overflow: "hidden" }}>
                    <button onClick={() => setExpandedSetup(open ? null : i)} style={{
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
                        {!open && <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>{s.desc}</div>}
                      </div>
                      <span style={{ color: s.color, fontSize: 16, transform: open ? "rotate(45deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }}>+</span>
                    </button>
                    {open && (
                      <div style={{ padding: "0 18px 18px 60px", background: `${s.color}06` }}>
                        <div style={{ height: 1, background: `${s.color}22`, margin: "0 0 14px" }} />
                        <p style={{ fontSize: 13, color: "#AAA", lineHeight: 1.7, margin: "0 0 12px" }}>{s.desc}</p>
                        <div style={{ background: "#07070E", border: `1px solid ${s.color}22`, borderRadius: 3, padding: "12px 14px", marginBottom: 10, overflowX: "auto" }}>
                          <span style={{ fontSize: 9, color: s.color, letterSpacing: "0.15em", fontFamily: "monospace", fontWeight: 700 }}>STEPS / CODE</span>
                          <pre style={{ margin: "8px 0 0", fontSize: 12, color: s.color, fontFamily: "monospace", lineHeight: 1.7 }}>{s.cmd}</pre>
                        </div>
                        <div style={{ background: "rgba(255,213,79,0.05)", border: "1px solid rgba(255,213,79,0.2)", borderRadius: 3, padding: "8px 12px" }}>
                          <span style={{ fontSize: 12, color: "#FFD54F" }}>💡 {s.note}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div style={{ margin: "20px 0", padding: "14px 18px", background: "rgba(79,195,247,0.07)", border: "1px solid rgba(79,195,247,0.3)", borderLeft: "3px solid #4FC3F7", borderRadius: 4 }}>
              <div style={{ fontSize: 12, color: "#4FC3F7", fontWeight: 700, marginBottom: 8 }}>⚡ BigQuery vs Standard SQL — Key Differences</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {[
                  { diff: "Table references", bq: "`project.dataset.table`", std: "just table_name" },
                  { diff: "Date truncation", bq: "DATE_TRUNC(date, MONTH)", std: "DATETRUNC(MONTH, date)" },
                  { diff: "String aggregation", bq: "STRING_AGG(col, ',')", std: "GROUP_CONCAT(col)" },
                  { diff: "Current date", bq: "CURRENT_DATE()", std: "GETDATE() or NOW()" },
                  { diff: "Regex match", bq: "REGEXP_CONTAINS(col, r'pattern')", std: "col REGEXP 'pattern'" },
                ].map((r, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "120px 1fr 1fr", gap: 12, padding: "6px 0", borderBottom: i < 4 ? "1px solid #0F0F18" : "none" }}>
                    <span style={{ fontSize: 11, color: "#666" }}>{r.diff}</span>
                    <code style={{ fontSize: 11, color: "#4FC3F7", fontFamily: "monospace" }}>{r.bq}</code>
                    <code style={{ fontSize: 11, color: "#555", fontFamily: "monospace" }}>{r.std}</code>
                  </div>
                ))}
              </div>
            </div>

            <NavBtns onPrev={() => setActiveSection("intro")} onNext={() => setActiveSection("gemini")} />
          </div>
        )}

        {/* ── GEMINI ── */}
        {activeSection === "gemini" && (
          <div>
            <SH num="02" title="Gemini AI in BigQuery" color="#4285F4" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 16px" }}>
              Gemini AI (formerly Duet AI) is <strong style={{ color: "#DDD8F0" }}>embedded directly in the BigQuery console</strong>. It reads your schema automatically, understands your tables, and can write, complete, explain, and optimise SQL from natural language — without leaving the editor.
            </p>

            <div style={{ background: "#07070E", border: "1px solid #4285F433", borderRadius: 4, padding: "20px", margin: "20px 0 28px" }}>
              <div style={{ fontSize: 10, color: "#4285F4", fontFamily: "monospace", letterSpacing: "0.15em", marginBottom: 12 }}>HOW TO USE GEMINI IN BIGQUERY</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { n: "1", action: "Open BigQuery console", detail: "console.cloud.google.com/bigquery" },
                  { n: "2", action: "Click the Gemini sparkle icon", detail: "Top right of the SQL editor — opens the AI chat panel" },
                  { n: "3", action: "Type your question in plain English", detail: "e.g. 'Show me total revenue by region for 2024'" },
                  { n: "4", action: "Gemini generates SQL in the editor", detail: "Review the query before clicking Run" },
                  { n: "5", action: "Iterate with follow-up questions", detail: "e.g. 'Now add month-over-month % change'" },
                ].map((step, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(66,133,244,0.2)", border: "1px solid rgba(66,133,244,0.4)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ fontSize: 10, color: "#4285F4", fontWeight: 700 }}>{step.n}</span>
                    </div>
                    <div>
                      <div style={{ fontSize: 13, color: "#DDD8F0", fontWeight: 700 }}>{step.action}</div>
                      <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>{step.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, margin: "0 0 28px" }}>
              {geminiPatterns.map((g, i) => {
                const open = expandedGemini === i;
                return (
                  <div key={i} style={{ border: `1px solid ${open ? g.color + "55" : "#1A1A2E"}`, borderRadius: 4, overflow: "hidden" }}>
                    <button onClick={() => setExpandedGemini(open ? null : i)} style={{
                      width: "100%", background: open ? "#0D1520" : "#0D0D18",
                      border: "none", cursor: "pointer", padding: "14px 20px",
                      display: "flex", alignItems: "center", gap: 14,
                      fontFamily: "inherit", textAlign: "left",
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#DDD8F0" }}>{g.type}</div>
                        {!open && <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>{g.desc}</div>}
                      </div>
                      <span style={{ color: g.color, fontSize: 18, transform: open ? "rotate(45deg)" : "none", transition: "transform 0.2s" }}>+</span>
                    </button>
                    {open && (
                      <div style={{ padding: "0 20px 20px 20px", background: "#0A0F18" }}>
                        <div style={{ height: 1, background: `${g.color}33`, margin: "0 0 14px" }} />
                        <p style={{ fontSize: 13, color: "#AAA", lineHeight: 1.7, margin: "0 0 14px" }}>{g.desc}</p>
                        <div style={{ marginBottom: 12 }}>
                          <span style={{ fontSize: 9, color: g.color, letterSpacing: "0.15em", fontFamily: "monospace", fontWeight: 700 }}>EXAMPLE PROMPTS</span>
                          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
                            {g.prompts.map((p, j) => (
                              <div key={j} style={{ background: "#07070E", border: `1px solid ${g.color}22`, borderRadius: 3, padding: "8px 12px" }}>
                                <code style={{ fontSize: 12, color: g.color, fontFamily: "monospace", lineHeight: 1.6 }}>{p}</code>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div style={{ background: "rgba(255,213,79,0.05)", border: "1px solid rgba(255,213,79,0.2)", borderRadius: 3, padding: "8px 12px" }}>
                          <span style={{ fontSize: 12, color: "#FFD54F" }}>💡 {g.tip}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div style={{ margin: "20px 0", padding: "14px 18px", background: "rgba(255,100,100,0.05)", border: "1px solid rgba(255,100,100,0.2)", borderLeft: "3px solid #FF6464", borderRadius: 4 }}>
              <div style={{ fontSize: 12, color: "#FF6464", fontWeight: 700, marginBottom: 8 }}>⚠️ Gemini Not Available? Use These Alternatives</div>
              <div style={{ fontSize: 13, color: "#666", lineHeight: 1.8 }}>
                If Gemini is not available on your account: use <strong style={{ color: "#DDD8F0" }}>ChatGPT or Claude</strong> with your schema pasted in. The workflow is identical — type your question, get SQL, review it, run it in BigQuery. The AI lives outside the editor instead of inside, but the result is the same.
              </div>
            </div>

            <NavBtns onPrev={() => setActiveSection("bigquery")} onNext={() => setActiveSection("rfm")} />
          </div>
        )}

        {/* ── RFM ── */}
        {activeSection === "rfm" && (
          <div>
            <SH num="03" title="RFM Customer Segmentation" color="#81C784" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 16px" }}>
              RFM is the most widely used customer segmentation model in analytics. It scores every customer on three dimensions — <strong style={{ color: "#DDD8F0" }}>Recency, Frequency, and Monetary value</strong> — and uses those scores to classify customers into actionable segments that drive marketing, retention, and revenue decisions.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, margin: "20px 0 24px" }}>
              {[
                { letter: "R", word: "Recency", q: "How recently did they buy?", good: "Yesterday", bad: "12 months ago", color: "#4FC3F7" },
                { letter: "F", word: "Frequency", q: "How often do they buy?", good: "10+ orders", bad: "1 order ever", color: "#81C784" },
                { letter: "M", word: "Monetary", q: "How much do they spend?", good: "$5,000 LTV", bad: "$12 lifetime", color: "#FFD54F" },
              ].map((d, i) => (
                <div key={i} style={{ border: `1px solid ${d.color}33`, borderTop: `3px solid ${d.color}`, borderRadius: 4, padding: "16px", background: `${d.color}06` }}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: d.color, marginBottom: 4, fontFamily: "monospace" }}>{d.letter}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#DDD8F0", marginBottom: 6 }}>{d.word}</div>
                  <div style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>{d.q}</div>
                  <div style={{ fontSize: 11, color: "#4ade80" }}>Best: {d.good}</div>
                  <div style={{ fontSize: 11, color: "#FF8A65" }}>Worst: {d.bad}</div>
                </div>
              ))}
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#DDD8F0", margin: "32px 0 12px", borderLeft: "3px solid #81C784", paddingLeft: 12 }}>Customer Segments and What to Do With Them</h3>
            <div style={{ border: "1px solid #1A1A2E", borderRadius: 4, overflow: "hidden", margin: "16px 0 24px" }}>
              {[
                { seg: "Champion", score: "10-12", desc: "Recent, frequent, high spend", action: "Reward them. Ask for reviews. Early access to new products.", color: "#FFD700" },
                { seg: "Loyal Customer", score: "8-10", desc: "Regular buyers, decent spend", action: "Upsell premium. Loyalty programme. Personal outreach.", color: "#81C784" },
                { seg: "At Risk", score: "5-7", desc: "Good history but not recent", action: "Win-back campaign. Personalised discount. Ask why they left.", color: "#FFD54F" },
                { seg: "Recent Customer", score: "7-9", desc: "Bought recently, low frequency", action: "Onboarding sequence. Educate about products. Second purchase incentive.", color: "#4FC3F7" },
                { seg: "Lost", score: "3-5", desc: "Low recency, low frequency, low spend", action: "Re-engagement email. Last-chance offer. If no response, deprioritise.", color: "#FF8A65" },
              ].map((row, i, arr) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "130px 60px 1fr 1fr", gap: 12, padding: "11px 16px", borderBottom: i < arr.length - 1 ? "1px solid #0F0F18" : "none", background: i % 2 === 0 ? "#0A0A14" : "#07070E", alignItems: "start" }}>
                  <span style={{ fontSize: 13, color: row.color, fontWeight: 700 }}>{row.seg}</span>
                  <span style={{ fontSize: 11, color: "#555", fontFamily: "monospace" }}>{row.score}</span>
                  <span style={{ fontSize: 12, color: "#777" }}>{row.desc}</span>
                  <span style={{ fontSize: 12, color: "#666", fontStyle: "italic" }}>{row.action}</span>
                </div>
              ))}
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#DDD8F0", margin: "32px 0 12px", borderLeft: "3px solid #81C784", paddingLeft: 12 }}>Full RFM SQL Query (BigQuery compatible)</h3>
            <div style={{ background: "#07070E", border: "1px solid #81C78433", borderRadius: 4, overflow: "hidden", margin: "0 0 24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 16px", borderBottom: "1px solid #1A1A2E" }}>
                <span style={{ fontSize: 9, color: "#81C784", letterSpacing: "0.15em", fontFamily: "monospace", fontWeight: 700 }}>RFM SEGMENTATION — COMPLETE QUERY</span>
                <button onClick={() => toggleSQL("rfm")} style={{ background: "#81C78420", border: "1px solid #81C78444", borderRadius: 2, padding: "4px 10px", cursor: "pointer", fontFamily: "monospace", fontSize: 10, color: "#81C784" }}>
                  {showSQL["rfm"] ? "HIDE SQL" : "SHOW SQL"}
                </button>
              </div>
              {showSQL["rfm"] && (
                <pre style={{ margin: 0, padding: "16px", fontSize: 12, color: "#81C784", fontFamily: "monospace", lineHeight: 1.75, overflowX: "auto" }}>{rfmSQL}</pre>
              )}
              {!showSQL["rfm"] && (
                <div style={{ padding: "16px", fontSize: 13, color: "#444", textAlign: "center" }}>
                  Click SHOW SQL to reveal the full production-ready RFM query
                </div>
              )}
            </div>

            <div style={{ margin: "20px 0", padding: "14px 18px", background: "rgba(129,199,132,0.07)", border: "1px solid rgba(129,199,132,0.3)", borderLeft: "3px solid #81C784", borderRadius: 4 }}>
              <div style={{ fontSize: 12, color: "#81C784", fontWeight: 700, marginBottom: 8 }}>🤖 AI Prompt for RFM</div>
              <div style={{ background: "#07070E", border: "1px solid #81C78422", borderRadius: 3, padding: "10px 12px" }}>
                <code style={{ fontSize: 12, color: "#81C784", fontFamily: "monospace", lineHeight: 1.6 }}>
                  "I use BigQuery. My table is orders(customer_id, order_date, units, price, status). Write a complete RFM segmentation query using NTILE(4) for R, F, and M scoring. Add a CASE WHEN at the end to label each customer as Champion, Loyal, At Risk, or Lost based on their combined RFM score. Comment every step."
                </code>
              </div>
            </div>

            <NavBtns onPrev={() => setActiveSection("gemini")} onNext={() => setActiveSection("cohort")} />
          </div>
        )}

        {/* ── COHORT ── */}
        {activeSection === "cohort" && (
          <div>
            <SH num="04" title="Cohort Retention Analysis" color="#FFD54F" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 16px" }}>
              Cohort analysis <strong style={{ color: "#DDD8F0" }}>groups users by when they first joined</strong>, then tracks their behaviour over time. It is the single best way to measure product improvement — if your January cohort retains at 30% and your June cohort retains at 45%, your product got better. Investors love this chart.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, margin: "20px 0 28px" }}>
              <div style={{ border: "1px solid #FFD54F33", borderRadius: 4, padding: "16px", background: "rgba(255,213,79,0.05)" }}>
                <div style={{ fontSize: 12, color: "#FFD54F", fontWeight: 700, marginBottom: 10 }}>What cohort analysis answers</div>
                {["Are newer customers sticking around better?", "Which acquisition channel has the best retention?", "At what month do most customers churn?", "Is a product change improving retention?", "What is our 90-day retention benchmark?"].map((q, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                    <span style={{ color: "#FFD54F", flexShrink: 0 }}>→</span>
                    <span style={{ fontSize: 12, color: "#888" }}>{q}</span>
                  </div>
                ))}
              </div>
              <div style={{ border: "1px solid #4FC3F733", borderRadius: 4, padding: "16px", background: "rgba(79,195,247,0.05)" }}>
                <div style={{ fontSize: 12, color: "#4FC3F7", fontWeight: 700, marginBottom: 10 }}>Industry benchmarks</div>
                {[
                  { label: "E-commerce Month 1", val: "20-40%" },
                  { label: "E-commerce Month 3", val: "15-25%" },
                  { label: "SaaS Month 1", val: "40-70%" },
                  { label: "SaaS Month 6", val: "25-50%" },
                  { label: "Below 10% Month 1", val: "Investigate urgently" },
                ].map((b, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: "#888" }}>{b.label}</span>
                    <span style={{ fontSize: 12, color: "#4FC3F7", fontFamily: "monospace" }}>{b.val}</span>
                  </div>
                ))}
              </div>
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#DDD8F0", margin: "32px 0 12px", borderLeft: "3px solid #FFD54F", paddingLeft: 12 }}>How to Read a Cohort Table</h3>
            <div style={{ border: "1px solid #1A1A2E", borderRadius: 4, overflow: "hidden", margin: "0 0 24px" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, fontFamily: "monospace" }}>
                <thead>
                  <tr style={{ background: "#0D0D18" }}>
                    <th style={{ padding: "8px 12px", textAlign: "left", color: "#FFD54F", borderBottom: "1px solid #1A1A2E", fontWeight: 700 }}>Cohort</th>
                    <th style={{ padding: "8px 12px", textAlign: "center", color: "#FFD54F", borderBottom: "1px solid #1A1A2E", fontWeight: 700 }}>Size</th>
                    {["M0", "M1", "M2", "M3", "M6"].map(m => (
                      <th key={m} style={{ padding: "8px 12px", textAlign: "center", color: "#FFD54F", borderBottom: "1px solid #1A1A2E", fontWeight: 700 }}>{m}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { cohort: "Jan 2024", size: 120, rates: [100, 38, 28, 22, 15] },
                    { cohort: "Feb 2024", size: 98, rates: [100, 41, 31, 24, 18] },
                    { cohort: "Mar 2024", size: 145, rates: [100, 44, 34, 27, null] },
                    { cohort: "Apr 2024", size: 112, rates: [100, 46, 35, null, null] },
                    { cohort: "May 2024", size: 130, rates: [100, 48, null, null, null] },
                  ].map((row, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? "#0A0A14" : "#07070E", borderBottom: "1px solid #0F0F18" }}>
                      <td style={{ padding: "8px 12px", color: "#AAA" }}>{row.cohort}</td>
                      <td style={{ padding: "8px 12px", color: "#888", textAlign: "center" }}>{row.size}</td>
                      {row.rates.map((r, j) => (
                        <td key={j} style={{ padding: "8px 12px", textAlign: "center", color: r === null ? "#222" : r === 100 ? "#81C784" : r >= 40 ? "#FFD54F" : r >= 25 ? "#FF8A65" : "#FF6464" }}>
                          {r === null ? "—" : `${r}%`}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ padding: "8px 14px", background: "#080811", fontSize: 11, color: "#444" }}>
                Trend: each cohort retains slightly better (Jan 38% → May 48% at M1). Product is improving. M6 data not yet available for recent cohorts.
              </div>
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#DDD8F0", margin: "32px 0 12px", borderLeft: "3px solid #FFD54F", paddingLeft: 12 }}>Cohort SQL Query (BigQuery)</h3>
            <div style={{ background: "#07070E", border: "1px solid #FFD54F33", borderRadius: 4, overflow: "hidden", margin: "0 0 24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 16px", borderBottom: "1px solid #1A1A2E" }}>
                <span style={{ fontSize: 9, color: "#FFD54F", letterSpacing: "0.15em", fontFamily: "monospace", fontWeight: 700 }}>5-STEP COHORT RETENTION — COMPLETE QUERY</span>
                <button onClick={() => toggleSQL("cohort")} style={{ background: "#FFD54F20", border: "1px solid #FFD54F44", borderRadius: 2, padding: "4px 10px", cursor: "pointer", fontFamily: "monospace", fontSize: 10, color: "#FFD54F" }}>
                  {showSQL["cohort"] ? "HIDE SQL" : "SHOW SQL"}
                </button>
              </div>
              {showSQL["cohort"] && (
                <pre style={{ margin: 0, padding: "16px", fontSize: 12, color: "#FFD54F", fontFamily: "monospace", lineHeight: 1.75, overflowX: "auto" }}>{cohortSQL}</pre>
              )}
              {!showSQL["cohort"] && (
                <div style={{ padding: "16px", fontSize: 13, color: "#444", textAlign: "center" }}>Click SHOW SQL to reveal the 5-step cohort retention query</div>
              )}
            </div>

            <NavBtns onPrev={() => setActiveSection("rfm")} onNext={() => setActiveSection("funnel")} />
          </div>
        )}

        {/* ── FUNNEL ── */}
        {activeSection === "funnel" && (
          <div>
            <SH num="05" title="Funnel Analysis" color="#FF8A65" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 16px" }}>
              A funnel measures <strong style={{ color: "#DDD8F0" }}>how many users move from one step to the next</strong> in a defined journey. Every product team uses funnel analysis to find where users drop off — and then focuses engineering and design resources on the biggest leaks.
            </p>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#DDD8F0", margin: "16px 0 12px", borderLeft: "3px solid #FF8A65", paddingLeft: 12 }}>Visualising the Funnel</h3>
            <div style={{ margin: "16px 0 28px" }}>
              {[
                { stage: "Page View",      users: 10000, pct: 100, drop: null,  color: "#4FC3F7" },
                { stage: "Product View",   users: 6200,  pct: 62,  drop: 38,   color: "#81C784" },
                { stage: "Add to Cart",    users: 2480,  pct: 24.8, drop: 60,  color: "#FFD54F" },
                { stage: "Checkout",       users: 1488,  pct: 14.9, drop: 40,  color: "#FF8A65" },
                { stage: "Purchase",       users: 893,   pct: 8.9,  drop: 40,  color: "#CE93D8" },
              ].map((row, i) => (
                <div key={i} style={{ marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 13, color: "#DDD8F0", fontWeight: i === 0 ? 700 : 400 }}>{row.stage}</span>
                    <div style={{ display: "flex", gap: 16 }}>
                      <span style={{ fontSize: 12, color: "#888", fontFamily: "monospace" }}>{row.users.toLocaleString()} users</span>
                      <span style={{ fontSize: 12, color: row.color, fontFamily: "monospace", minWidth: 40, textAlign: "right" }}>{row.pct}%</span>
                      {row.drop && <span style={{ fontSize: 11, color: "#FF6464", fontFamily: "monospace" }}>-{row.drop}%</span>}
                    </div>
                  </div>
                  <div style={{ height: 28, background: "#0D0D18", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ width: `${row.pct}%`, height: "100%", background: row.color, borderRadius: 3, opacity: 0.7, transition: "width 0.5s" }} />
                  </div>
                </div>
              ))}
              <div style={{ padding: "10px 12px", background: "#0D0D18", border: "1px solid #1A1A2E", borderRadius: 3, marginTop: 12 }}>
                <span style={{ fontSize: 12, color: "#FF8A65" }}>⚠️ Biggest opportunity: Product View → Add to Cart (60% drop-off). Fix this and overall conversion improves most.</span>
              </div>
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#DDD8F0", margin: "32px 0 12px", borderLeft: "3px solid #FF8A65", paddingLeft: 12 }}>Funnel SQL Query</h3>
            <div style={{ background: "#07070E", border: "1px solid #FF8A6533", borderRadius: 4, overflow: "hidden", margin: "0 0 24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 16px", borderBottom: "1px solid #1A1A2E" }}>
                <span style={{ fontSize: 9, color: "#FF8A65", letterSpacing: "0.15em", fontFamily: "monospace", fontWeight: 700 }}>FUNNEL ANALYSIS — COMPLETE QUERY</span>
                <button onClick={() => toggleSQL("funnel")} style={{ background: "#FF8A6520", border: "1px solid #FF8A6544", borderRadius: 2, padding: "4px 10px", cursor: "pointer", fontFamily: "monospace", fontSize: 10, color: "#FF8A65" }}>
                  {showSQL["funnel"] ? "HIDE SQL" : "SHOW SQL"}
                </button>
              </div>
              {showSQL["funnel"] && (
                <pre style={{ margin: 0, padding: "16px", fontSize: 12, color: "#FF8A65", fontFamily: "monospace", lineHeight: 1.75, overflowX: "auto" }}>{funnelSQL}</pre>
              )}
              {!showSQL["funnel"] && (
                <div style={{ padding: "16px", fontSize: 13, color: "#444", textAlign: "center" }}>Click SHOW SQL to reveal the funnel analysis query</div>
              )}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, margin: "0 0 24px" }}>
              <div style={{ border: "1px solid #81C78433", borderRadius: 4, padding: "14px", background: "rgba(129,199,132,0.04)" }}>
                <div style={{ fontSize: 12, color: "#81C784", fontWeight: 700, marginBottom: 8 }}>What to do with funnel data</div>
                {["Identify the single biggest drop-off step", "Hypothesise WHY users drop (friction, confusion, price)", "A/B test a fix for that step specifically", "Measure improvement in that step's conversion", "Repeat — funnels always have a next bottleneck"].map((a, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, marginBottom: 5 }}>
                    <span style={{ color: "#81C784", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
                    <span style={{ fontSize: 12, color: "#777" }}>{a}</span>
                  </div>
                ))}
              </div>
              <div style={{ border: "1px solid #CE93D833", borderRadius: 4, padding: "14px", background: "rgba(206,147,216,0.04)" }}>
                <div style={{ fontSize: 12, color: "#CE93D8", fontWeight: 700, marginBottom: 8 }}>🤖 AI prompt for funnel analysis</div>
                <div style={{ background: "#07070E", border: "1px solid #CE93D822", borderRadius: 3, padding: "10px" }}>
                  <code style={{ fontSize: 11, color: "#CE93D8", fontFamily: "monospace", lineHeight: 1.6 }}>
                    "I have a user_events table with columns: user_id, event (page_view / product_view / add_to_cart / checkout / purchase), event_date. Write a funnel analysis query for the last 30 days showing users at each step, % of total, and drop-off % from the previous step."
                  </code>
                </div>
              </div>
            </div>

            <NavBtns onPrev={() => setActiveSection("cohort")} onNext={() => setActiveSection("aitools")} />
          </div>
        )}

        {/* ── AI TOOLS ── */}
        {activeSection === "aitools" && (
          <div>
            <SH num="06" title="AI SQL Tools — Text-to-SQL Comparison" color="#CE93D8" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 16px" }}>
              There are now 10+ AI tools that convert plain English to SQL. They vary in accuracy, dialect support, and workflow integration. Here are the <strong style={{ color: "#DDD8F0" }}>four tools used most in real data teams</strong> — each suited to a different situation.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, margin: "24px 0 28px" }}>
              {sqlaiTools.map((tool, i) => {
                const open = expandedTool === i;
                return (
                  <div key={i} style={{ border: `1px solid ${open ? tool.color + "55" : "#1A1A2E"}`, borderRadius: 4, overflow: "hidden" }}>
                    <button onClick={() => setExpandedTool(open ? null : i)} style={{
                      width: "100%", background: open ? `${tool.color}0A` : "#0D0D18",
                      border: "none", cursor: "pointer", padding: "16px 20px",
                      display: "flex", alignItems: "center", gap: 14,
                      fontFamily: "inherit", textAlign: "left",
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                          <span style={{ fontSize: 15, fontWeight: 700, color: "#DDD8F0" }}>{tool.name}</span>
                          <span style={{ fontSize: 10, color: tool.color, fontFamily: "monospace", background: `${tool.color}18`, padding: "2px 8px", borderRadius: 2 }}>{tool.url}</span>
                        </div>
                        {!open && <div style={{ fontSize: 12, color: "#555" }}>{tool.desc.substring(0, 70)}...</div>}
                      </div>
                      <span style={{ color: tool.color, fontSize: 18, transform: open ? "rotate(45deg)" : "none", transition: "transform 0.2s" }}>+</span>
                    </button>
                    {open && (
                      <div style={{ padding: "0 20px 20px 20px", background: `${tool.color}06` }}>
                        <div style={{ height: 1, background: `${tool.color}22`, margin: "0 0 14px" }} />
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                          <div>
                            <span style={{ fontSize: 9, color: tool.color, letterSpacing: "0.15em", fontFamily: "monospace", fontWeight: 700 }}>WHAT IT DOES</span>
                            <p style={{ fontSize: 13, color: "#AAA", margin: "6px 0 0", lineHeight: 1.65 }}>{tool.desc}</p>
                          </div>
                          <div>
                            <span style={{ fontSize: 9, color: tool.color, letterSpacing: "0.15em", fontFamily: "monospace", fontWeight: 700 }}>BEST FOR</span>
                            <p style={{ fontSize: 13, color: "#AAA", margin: "6px 0 0", lineHeight: 1.65 }}>{tool.bestFor}</p>
                          </div>
                        </div>
                        <div style={{ background: "#07070E", border: `1px solid ${tool.color}22`, borderRadius: 3, padding: "10px 14px", marginBottom: 12 }}>
                          <span style={{ fontSize: 9, color: tool.color, letterSpacing: "0.15em", fontFamily: "monospace", fontWeight: 700 }}>EXAMPLE PROMPT</span>
                          <p style={{ fontSize: 12, color: tool.color, margin: "8px 0 0", fontFamily: "monospace", lineHeight: 1.6 }}>{tool.prompt}</p>
                        </div>
                        <div style={{ background: "rgba(255,213,79,0.05)", border: "1px solid rgba(255,213,79,0.2)", borderRadius: 3, padding: "8px 12px" }}>
                          <span style={{ fontSize: 12, color: "#FFD54F" }}>💡 {tool.tip}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#DDD8F0", margin: "32px 0 12px", borderLeft: `3px solid ${ACC}`, paddingLeft: 12 }}>Which Tool to Use When</h3>
            <div style={{ border: "1px solid #1A1A2E", borderRadius: 4, overflow: "hidden", margin: "16px 0 28px" }}>
              {[
                { situation: "Quick ad-hoc query, know what you want", tool: "SQLAI.ai", color: "#FFD54F" },
                { situation: "Need BigQuery-specific syntax", tool: "AI2sql.io or Gemini in BigQuery", color: "#4FC3F7" },
                { situation: "Complex multi-step query needing explanation", tool: "ChatGPT or Claude", color: "#10A37F" },
                { situation: "Writing SQL in VS Code or dbt project", tool: "GitHub Copilot", color: "#6E40C9" },
                { situation: "Already in BigQuery console", tool: "Gemini AI (Duet AI)", color: "#4285F4" },
                { situation: "Learning — need the query explained line by line", tool: "ChatGPT or Claude", color: "#10A37F" },
              ].map((row, i, arr) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 200px", gap: 16, padding: "11px 16px", borderBottom: i < arr.length - 1 ? "1px solid #0F0F18" : "none", background: i % 2 === 0 ? "#0A0A14" : "#07070E", alignItems: "center" }}>
                  <span style={{ fontSize: 13, color: "#888" }}>{row.situation}</span>
                  <span style={{ fontSize: 12, color: row.color, fontWeight: 700 }}>→ {row.tool}</span>
                </div>
              ))}
            </div>

            <NavBtns onPrev={() => setActiveSection("funnel")} onNext={() => setActiveSection("quiz")} nextLabel="Take the Quiz →" />
          </div>
        )}

        {/* ── QUIZ ── */}
        {activeSection === "quiz" && (
          <div>
            <SH num="07" title="Part 3 Knowledge Check" color="#FFD54F" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 16px" }}>6 questions covering BigQuery, Gemini AI, RFM, cohort analysis, and funnel analysis. Score 4+ to proceed to Part 4.</p>

            {!quizState.done ? (
              <div style={{ margin: "28px 0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                  <span style={{ fontSize: 11, color: "#555", fontFamily: "monospace", letterSpacing: "0.15em" }}>QUESTION {quizState.idx + 1} / {quizQuestions.length}</span>
                  <span style={{ fontSize: 11, color: ACC, fontFamily: "monospace" }}>SCORE: {quizState.score} / {quizState.idx}</span>
                </div>
                <div style={{ height: 3, background: "#1A1A2E", borderRadius: 2, marginBottom: 28, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${(quizState.idx / quizQuestions.length) * 100}%`, background: `linear-gradient(90deg, ${ACC}, #FFD54F)`, transition: "width 0.4s" }} />
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#DDD8F0", lineHeight: 1.65, marginBottom: 24 }}>
                  {quizQuestions[quizState.idx].q}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {quizQuestions[quizState.idx].options.map((opt, i) => {
                    const sel = quizState.selected === i;
                    const correct = i === quizQuestions[quizState.idx].answer;
                    let bg = "#0D0D18", border = "#1A1A2E", col = "#888";
                    if (quizState.answered) {
                      if (correct) { bg = "rgba(129,199,132,0.08)"; border = "#81C784"; col = "#81C784"; }
                      else if (sel) { bg = "rgba(255,100,100,0.08)"; border = "#FF6464"; col = "#FF6464"; }
                    } else if (sel) { bg = "rgba(206,147,216,0.08)"; border = ACC; col = ACC; }
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
                  <div style={{ margin: "20px 0 0", padding: "14px 18px", background: "rgba(206,147,216,0.04)", border: `1px solid rgba(206,147,216,0.2)`, borderRadius: 4 }}>
                    <div style={{ fontSize: 10, color: ACC, letterSpacing: "0.15em", marginBottom: 6, fontFamily: "monospace" }}>EXPLANATION</div>
                    <p style={{ fontSize: 13, color: "#888", margin: "0 0 16px", lineHeight: 1.7 }}>
                      {quizQuestions[quizState.idx].explanation}
                    </p>
                    <button onClick={nextQ} style={{ background: ACC, border: "none", borderRadius: 3, padding: "8px 20px", cursor: "pointer", fontFamily: "monospace", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#07070E" }}>
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
                <div style={{ fontSize: 44, fontWeight: 900, marginBottom: 8, color: quizState.score >= 5 ? "#81C784" : quizState.score >= 4 ? "#FFD54F" : "#FF8A65" }}>
                  {quizState.score} / {quizQuestions.length}
                </div>
                <div style={{ fontSize: 15, color: "#666", marginBottom: 28 }}>
                  {quizState.score === 6 ? "Cloud SQL and business analytics patterns mastered." : quizState.score >= 4 ? "Good pass. Review any sections you found tricky." : "Revisit the RFM and cohort sections before Part 4."}
                </div>
                <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                  <button onClick={() => setQuizState({ idx: 0, selected: null, answered: false, score: 0, done: false })} style={{ background: "none", border: "1px solid #333", borderRadius: 3, padding: "8px 20px", cursor: "pointer", fontFamily: "monospace", fontSize: 11, color: "#555", letterSpacing: "0.1em" }}>RETAKE</button>
                  <button onClick={() => setActiveSection("intro")} style={{ background: ACC, border: "none", borderRadius: 3, padding: "8px 24px", cursor: "pointer", fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: "#07070E", letterSpacing: "0.1em" }}>REVIEW ↑</button>
                </div>
                <div style={{ marginTop: 40, padding: "22px", background: "#0D0D18", border: "1px solid #1A1A2E", borderRadius: 4, textAlign: "left" }}>
                  <div style={{ fontSize: 11, color: "#555", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 10, fontFamily: "monospace" }}>WHAT IS IN PART 4 — FINAL</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#DDD8F0", marginBottom: 8 }}>Phase 2 Capstone — E-Commerce Analytics Engine</div>
                  <p style={{ fontSize: 13, color: "#555", lineHeight: 1.7, margin: "0 0 14px" }}>
                    Build an end-to-end analytics project in BigQuery: clean a real dataset, write the SQL for RFM + cohort + funnel, connect to Looker Studio, and produce a stakeholder-ready report. Full marking rubric and portfolio instructions included.
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {["BigQuery project", "RFM + Cohort + Funnel SQL", "Looker Studio dashboard", "Portfolio deliverable", "Marking rubric"].map(t => (
                      <span key={t} style={{ padding: "3px 10px", background: "rgba(206,147,216,0.07)", border: "1px solid rgba(206,147,216,0.2)", borderRadius: 2, fontSize: 11, color: ACC }}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-start", marginTop: 48, paddingTop: 24, borderTop: "1px solid #1A1A2E" }}>
              <button onClick={() => setActiveSection("aitools")} style={{ background: "none", border: "1px solid #1A1A2E", borderRadius: 3, padding: "8px 18px", cursor: "pointer", fontFamily: "monospace", fontSize: 11, color: "#555", letterSpacing: "0.1em" }}>← Previous</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

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

function NavBtns({ onPrev, onNext, nextLabel = "Next Section →" }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 48, paddingTop: 24, borderTop: "1px solid #1A1A2E" }}>
      {onPrev
        ? <button onClick={onPrev} style={{ background: "none", border: "1px solid #1A1A2E", borderRadius: 3, padding: "8px 18px", cursor: "pointer", fontFamily: "monospace", fontSize: 11, color: "#555", letterSpacing: "0.1em" }}>← Previous</button>
        : <div />}
      {onNext && (
        <button onClick={onNext} style={{ background: "#CE93D8", border: "none", borderRadius: 3, padding: "8px 24px", cursor: "pointer", fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: "#07070E", letterSpacing: "0.1em" }}>{nextLabel}</button>
      )}
    </div>
  );
}
