"use client";
// @ts-nocheck
import { useState } from "react";

const quizQuestions = [
  {
    q: "What is the key difference between ROW_NUMBER() and RANK()?",
    options: [
      "ROW_NUMBER() skips numbers after ties; RANK() does not",
      "RANK() skips numbers after ties; ROW_NUMBER() always assigns unique consecutive numbers",
      "They are identical — just different names",
      "ROW_NUMBER() only works with ORDER BY DESC"
    ],
    answer: 1,
    explanation: "ROW_NUMBER() always gives 1,2,3,4 — no ties. RANK() gives 1,1,3 (skips 2 after a tie). DENSE_RANK() gives 1,1,2 (no skip). Choose based on whether you want gaps in ranking after ties."
  },
  {
    q: "LEAD(revenue, 1) OVER (ORDER BY month) — what does this return?",
    options: [
      "The revenue from the PREVIOUS month",
      "The revenue from the NEXT month",
      "The running total of revenue",
      "The rank of the current revenue"
    ],
    answer: 1,
    explanation: "LEAD() looks FORWARD in the result set. LEAD(revenue, 1) returns the value from the next row. LAG() looks BACKWARD. Use LEAD/LAG to calculate month-over-month changes without self-joins."
  },
  {
    q: "A CTE (WITH clause) is best described as:",
    options: [
      "A permanent table stored in the database",
      "A named temporary result set that exists only for the duration of the query",
      "A stored procedure that runs on a schedule",
      "A type of index that speeds up queries"
    ],
    answer: 1,
    explanation: "A CTE is a named subquery defined at the top of a query with WITH. It exists only while the query runs. CTEs make complex queries readable by breaking them into named steps. They are NOT faster than subqueries but are much more readable."
  },
  {
    q: "SUM(revenue) OVER (PARTITION BY region ORDER BY month ROWS UNBOUNDED PRECEDING) calculates:",
    options: [
      "Total revenue for the entire table",
      "Total revenue per region (same as GROUP BY)",
      "Running total of revenue within each region, resetting per region",
      "Average revenue per month"
    ],
    answer: 2,
    explanation: "PARTITION BY region means the running total resets for each region. ORDER BY month defines the accumulation order. ROWS UNBOUNDED PRECEDING means sum all rows from the start of the partition to the current row — a running total per region."
  },
  {
    q: "Which approach is generally FASTEST for large tables?",
    options: [
      "SELECT * with a filter in WHERE",
      "SELECT only needed columns with an index on the WHERE column",
      "SELECT * with no WHERE clause",
      "Subquery in SELECT clause for every row"
    ],
    answer: 1,
    explanation: "Two performance rules: (1) Never SELECT * — retrieve only columns you need. (2) Filter on indexed columns. A correlated subquery in SELECT runs once per row — extremely slow on large tables."
  },
  {
    q: "You want the top 3 products by revenue WITHIN EACH region. What is the correct approach?",
    options: [
      "GROUP BY region, product — then LIMIT 3",
      "GROUP BY with HAVING rank <= 3",
      "RANK() OVER (PARTITION BY region ORDER BY revenue DESC) then filter WHERE rank <= 3",
      "DISTINCT with ORDER BY"
    ],
    answer: 2,
    explanation: "This is a classic 'top N per group' problem — perfect for window functions. RANK() OVER (PARTITION BY region ORDER BY revenue DESC) assigns ranks within each region. Wrap in a CTE or subquery, then filter WHERE rank <= 3. GROUP BY alone cannot solve this."
  },
];

const windowFunctions = [
  {
    fn: "ROW_NUMBER()",
    color: "#4FC3F7",
    category: "Ranking",
    desc: "Assigns a unique sequential number to every row within the partition. No ties — always 1, 2, 3, 4.",
    when: "Deduplicate rows, pick the most recent record per customer, create unique row IDs within a group.",
    example: `SELECT
  customer_id,
  order_date,
  revenue,
  ROW_NUMBER() OVER (
    PARTITION BY customer_id
    ORDER BY order_date DESC
  ) AS rn
FROM orders`,
    result: "rn=1 is the most recent order per customer. Filter WHERE rn=1 to get latest order per customer.",
    tip: "ROW_NUMBER() + CTE + WHERE rn=1 is the standard pattern for 'latest record per group' — one of the most common analytics queries."
  },
  {
    fn: "RANK()",
    color: "#81C784",
    category: "Ranking",
    desc: "Ranks rows within a partition. Ties get the same rank, and the next rank is skipped. Result: 1, 1, 3, 4.",
    when: "Sales leaderboards where ties should share a rank. Sports standings. Competition results.",
    example: `SELECT
  sales_rep,
  total_revenue,
  RANK() OVER (
    ORDER BY total_revenue DESC
  ) AS revenue_rank
FROM rep_summary`,
    result: "Two reps with identical revenue both get rank 2. Next rep gets rank 4 (rank 3 is skipped).",
    tip: "Use RANK() when ties sharing a rank matters to the business. Use DENSE_RANK() when you don't want gaps (1,1,2,3 instead of 1,1,3,4)."
  },
  {
    fn: "DENSE_RANK()",
    color: "#FFD54F",
    category: "Ranking",
    desc: "Like RANK() but no gaps after ties. Result: 1, 1, 2, 3 — not 1, 1, 3, 4.",
    when: "Medal tables, tier assignment, anywhere you want compact rank numbers without gaps.",
    example: `SELECT
  product,
  revenue,
  DENSE_RANK() OVER (
    PARTITION BY category
    ORDER BY revenue DESC
  ) AS category_rank
FROM product_summary`,
    result: "Ranks products 1,2,3 within each category. Top product in Electronics = 1, top in Clothing = 1.",
    tip: "DENSE_RANK() is best for 'Top N per category' filtering because rank numbers stay compact — no gaps to account for."
  },
  {
    fn: "LAG(col, n)",
    color: "#FF8A65",
    category: "Offset",
    desc: "Returns the value from n rows BEHIND the current row in the ordered partition.",
    when: "Month-over-month comparison, previous period revenue, detect changes from prior state.",
    example: `SELECT
  month,
  revenue,
  LAG(revenue, 1) OVER (
    ORDER BY month
  ) AS prev_month_revenue,
  revenue - LAG(revenue, 1) OVER (
    ORDER BY month
  ) AS mom_change
FROM monthly_sales`,
    result: "Each row shows current revenue, last month's revenue, and the difference — without a self-join.",
    tip: "LAG() with a default value: LAG(revenue, 1, 0) returns 0 instead of NULL for the first row — prevents NULL in calculations."
  },
  {
    fn: "LEAD(col, n)",
    color: "#CE93D8",
    category: "Offset",
    desc: "Returns the value from n rows AHEAD of the current row in the ordered partition.",
    when: "Preview next period, calculate days until next event, forward-looking projections.",
    example: `SELECT
  customer_id,
  order_date,
  LEAD(order_date, 1) OVER (
    PARTITION BY customer_id
    ORDER BY order_date
  ) AS next_order_date
FROM orders`,
    result: "Each order row shows when the customer ordered next — useful for calculating repeat purchase intervals.",
    tip: "LEAD/LAG eliminate the need for self-joins when comparing current vs adjacent rows. Much more readable and faster."
  },
  {
    fn: "SUM() OVER ()",
    color: "#F48FB1",
    category: "Aggregate Window",
    desc: "Calculates a running or partitioned sum without collapsing rows — unlike GROUP BY.",
    when: "Running totals, cumulative revenue, percentage of total — while keeping all individual rows visible.",
    example: `SELECT
  month,
  region,
  revenue,
  SUM(revenue) OVER (
    PARTITION BY region
    ORDER BY month
    ROWS UNBOUNDED PRECEDING
  ) AS running_total,
  ROUND(
    revenue * 100.0 /
    SUM(revenue) OVER (PARTITION BY region), 1
  ) AS pct_of_region
FROM monthly_regional_sales`,
    result: "Each row keeps its own revenue PLUS shows the running total and percentage of the region's total.",
    tip: "ROWS UNBOUNDED PRECEDING = from start of partition to current row (running total). Omit ORDER BY for a full partition sum on every row."
  },
];

const ctePatterns = [
  {
    name: "Basic CTE — Replace a Subquery",
    color: "#4FC3F7",
    why: "A subquery buried in FROM is hard to read and debug. A CTE gives it a name and pulls it to the top.",
    before: `SELECT region, avg_rev
FROM (
  SELECT region,
         AVG(units * price) AS avg_rev
  FROM orders
  WHERE status = 'Completed'
  GROUP BY region
) AS r
WHERE avg_rev > 200;`,
    after: `WITH region_avg AS (
  SELECT region,
         AVG(units * price) AS avg_rev
  FROM orders
  WHERE status = 'Completed'
  GROUP BY region
)
SELECT region, avg_rev
FROM region_avg
WHERE avg_rev > 200;`,
    tip: "Rule of thumb: if a subquery has more than 2 lines, turn it into a CTE with a descriptive name."
  },
  {
    name: "Chained CTEs — Multi-Step Logic",
    color: "#81C784",
    why: "Real business queries need multiple steps. CTEs let you build step by step, each referencing the previous one.",
    before: `-- Impossible to read as nested subqueries
-- Multiple levels of brackets
-- Hard to debug, impossible to maintain`,
    after: `WITH
monthly_rev AS (
  SELECT
    MONTH(order_date) AS month,
    SUM(units * price) AS revenue
  FROM orders
  WHERE status = 'Completed'
  GROUP BY MONTH(order_date)
),
with_prev AS (
  SELECT month, revenue,
    LAG(revenue, 1) OVER (ORDER BY month)
      AS prev_revenue
  FROM monthly_rev
),
mom_change AS (
  SELECT *,
    revenue - prev_revenue AS change,
    ROUND((revenue - prev_revenue)
      * 100.0 / prev_revenue, 1) AS pct_change
  FROM with_prev
  WHERE prev_revenue IS NOT NULL
)
SELECT * FROM mom_change
WHERE change < 0
ORDER BY month;`,
    tip: "Chain up to 5-6 CTEs before considering a view. Each CTE should do exactly ONE thing — name it accordingly."
  },
  {
    name: "CTE + Window Function — Top N Per Group",
    color: "#FFD54F",
    why: "The most common advanced SQL pattern: rank rows within a group, then filter to top N. Impossible with GROUP BY alone.",
    before: `-- Cannot do this with GROUP BY alone
-- GROUP BY collapses rows — you lose
-- the ability to compare within groups`,
    after: `WITH ranked_products AS (
  SELECT
    region,
    product,
    SUM(units * price) AS revenue,
    RANK() OVER (
      PARTITION BY region
      ORDER BY SUM(units * price) DESC
    ) AS rnk
  FROM orders
  WHERE status = 'Completed'
  GROUP BY region, product
)
SELECT region, product, revenue, rnk
FROM ranked_products
WHERE rnk <= 2
ORDER BY region, rnk;`,
    tip: "This pattern answers: Top 2 products per region, best 3 reps per quarter, most recent order per customer. Memorise it."
  },
  {
    name: "CTE for Data Cleaning Before Analysis",
    color: "#FF8A65",
    why: "Clean and prepare data in a CTE, then analyse the clean version. Keeps raw table untouched and logic transparent.",
    before: `-- Mixing cleaning + analysis in one query
-- Hard to debug: is the error in
-- cleaning logic or analysis logic?`,
    after: `WITH clean_orders AS (
  SELECT
    id,
    TRIM(UPPER(region))    AS region,
    TRIM(product)           AS product,
    units,
    price,
    COALESCE(status,'Unknown') AS status,
    order_date
  FROM orders
  WHERE order_date IS NOT NULL
    AND units > 0 AND price > 0
),
completed AS (
  SELECT * FROM clean_orders
  WHERE status = 'Completed'
)
SELECT
  region,
  COUNT(*)           AS orders,
  SUM(units * price) AS revenue
FROM completed
GROUP BY region
ORDER BY revenue DESC;`,
    tip: "The first CTE is a cleaning layer. Anyone reading the query can see exactly what 'clean' means before analysis begins."
  },
];

const performanceTips = [
  {
    rule: "SELECT only what you need — never SELECT *",
    impact: "High",
    color: "#FF8A65",
    bad: "SELECT * FROM orders",
    good: "SELECT id, region, revenue FROM orders",
    why: "SELECT * transfers all columns across the network. On wide tables (50+ columns) this can be 10x slower. Always name your columns."
  },
  {
    rule: "Filter early with WHERE before JOIN",
    impact: "High",
    color: "#FF8A65",
    bad: "FROM orders\nJOIN customers ON ...\nWHERE orders.status = 'Completed'",
    good: "FROM (SELECT * FROM orders\n  WHERE status = 'Completed') o\nJOIN customers c ON o.customer_id = c.id",
    why: "Filtering before the JOIN means fewer rows to join. On million-row tables this changes seconds into milliseconds."
  },
  {
    rule: "Use indexed columns in WHERE and JOIN ON",
    impact: "Very High",
    color: "#FF8A65",
    bad: "WHERE YEAR(order_date) = 2024\n-- function on column breaks index",
    good: "WHERE order_date\n  BETWEEN '2024-01-01' AND '2024-12-31'",
    why: "Wrapping a column in a function (YEAR(), UPPER()) prevents the index from being used. The database must scan every single row."
  },
  {
    rule: "Avoid correlated subqueries in SELECT",
    impact: "Very High",
    color: "#FFD54F",
    bad: "SELECT id,\n  (SELECT COUNT(*) FROM orders\n   WHERE customer_id = c.id)\nFROM customers c",
    good: "SELECT c.id, COUNT(o.id)\nFROM customers c\nLEFT JOIN orders o ON c.id = o.customer_id\nGROUP BY c.id",
    why: "A subquery in SELECT runs once per row. 100,000 customers = 100,000 subqueries. The JOIN version runs once total."
  },
  {
    rule: "Use EXISTS instead of IN for large subqueries",
    impact: "Medium",
    color: "#FFD54F",
    bad: "WHERE customer_id IN\n  (SELECT id FROM customers\n   WHERE country = 'UK')",
    good: "WHERE EXISTS\n  (SELECT 1 FROM customers c\n   WHERE c.id = o.customer_id\n   AND c.country = 'UK')",
    why: "IN evaluates the full subquery list first. EXISTS stops as soon as it finds one match — faster for large tables."
  },
  {
    rule: "Always add LIMIT when exploring data",
    impact: "Medium",
    color: "#81C784",
    bad: "SELECT * FROM big_table\nORDER BY date DESC",
    good: "SELECT * FROM big_table\nORDER BY date DESC\nLIMIT 100",
    why: "Without LIMIT, a query on a 50M-row table returns 50M rows to your screen. LIMIT 100 returns 100. Always explore first."
  },
];

const practiceQueries = [
  {
    level: "Intermediate",
    color: "#FFD54F",
    title: "Latest Order Per Customer",
    scenario: "Get the most recent completed order for each customer — exactly one row per customer.",
    hint: "Use ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date DESC). Wrap in a CTE then filter WHERE rn = 1.",
    solution: `WITH ranked AS (
  SELECT
    customer_id,
    order_date,
    product,
    units * price AS revenue,
    ROW_NUMBER() OVER (
      PARTITION BY customer_id
      ORDER BY order_date DESC
    ) AS rn
  FROM orders
  WHERE status = 'Completed'
)
SELECT customer_id, order_date, product, revenue
FROM ranked
WHERE rn = 1
ORDER BY order_date DESC;`
  },
  {
    level: "Intermediate",
    color: "#FFD54F",
    title: "Month-over-Month Revenue Change",
    scenario: "Show each month's revenue, the previous month's revenue, the change amount, and a GROWTH / DECLINE / FLAT flag.",
    hint: "Use LAG(revenue,1) OVER (ORDER BY month_num). Calculate the difference. Use CASE WHEN to label the trend.",
    solution: `WITH monthly AS (
  SELECT
    MONTH(order_date)      AS month_num,
    MONTHNAME(order_date)  AS month_name,
    SUM(units * price)     AS revenue
  FROM orders
  WHERE status = 'Completed'
  GROUP BY MONTH(order_date), MONTHNAME(order_date)
),
with_lag AS (
  SELECT
    month_num, month_name, revenue,
    LAG(revenue, 1, 0) OVER (ORDER BY month_num)
      AS prev_revenue
  FROM monthly
)
SELECT
  month_name,
  ROUND(revenue, 2)                  AS revenue,
  ROUND(prev_revenue, 2)             AS prev_month,
  ROUND(revenue - prev_revenue, 2)   AS change,
  ROUND((revenue - prev_revenue)
    * 100.0 / NULLIF(prev_revenue,0), 1) AS pct_change,
  CASE
    WHEN revenue > prev_revenue THEN 'GROWTH'
    WHEN revenue < prev_revenue THEN 'DECLINE'
    ELSE 'FLAT'
  END AS trend
FROM with_lag
ORDER BY month_num;`
  },
  {
    level: "Advanced",
    color: "#FF8A65",
    title: "Top 2 Products per Category",
    scenario: "Find the top 2 best-selling products within each category by total revenue from completed orders.",
    hint: "GROUP BY category + product first to get totals. Then RANK() OVER (PARTITION BY category ORDER BY revenue DESC). Filter WHERE rnk <= 2 in a CTE.",
    solution: `WITH product_rev AS (
  SELECT
    category,
    product,
    SUM(units * price)  AS total_revenue,
    COUNT(*)            AS total_orders
  FROM orders
  WHERE status = 'Completed'
  GROUP BY category, product
),
ranked AS (
  SELECT
    category, product,
    total_revenue, total_orders,
    RANK() OVER (
      PARTITION BY category
      ORDER BY total_revenue DESC
    ) AS rnk
  FROM product_rev
)
SELECT category, rnk, product,
  ROUND(total_revenue, 2) AS revenue,
  total_orders
FROM ranked
WHERE rnk <= 2
ORDER BY category, rnk;`
  },
  {
    level: "Advanced",
    color: "#FF8A65",
    title: "Running Total and % of Year",
    scenario: "Show monthly revenue, the cumulative running total, and what percentage each month contributes to the full year.",
    hint: "SUM() OVER with ORDER BY + ROWS UNBOUNDED PRECEDING for running total. SUM() OVER () with no ORDER BY for grand total.",
    solution: `WITH monthly AS (
  SELECT
    MONTH(order_date)      AS month_num,
    MONTHNAME(order_date)  AS month_name,
    SUM(units * price)     AS revenue
  FROM orders
  WHERE status = 'Completed'
  GROUP BY MONTH(order_date), MONTHNAME(order_date)
)
SELECT
  month_name,
  ROUND(revenue, 2) AS monthly_revenue,
  ROUND(
    SUM(revenue) OVER (
      ORDER BY month_num
      ROWS UNBOUNDED PRECEDING
    ), 2
  ) AS running_total,
  ROUND(
    revenue * 100.0 / SUM(revenue) OVER (), 1
  ) AS pct_of_year
FROM monthly
ORDER BY month_num;`
  },
];

const sections = [
  { id: "intro",       label: "Overview"         },
  { id: "window",      label: "Window Functions"  },
  { id: "cte",         label: "CTEs"              },
  { id: "performance", label: "Performance"       },
  { id: "practice",    label: "Practice"          },
  { id: "aitools",     label: "AI + SQL"          },
  { id: "quiz",        label: "Quiz"              },
];

export default function Phase2Part2() {
  const [activeSection, setActiveSection] = useState("intro");
  const [expandedWF,    setExpandedWF]    = useState(null);
  const [expandedCTE,   setExpandedCTE]   = useState(null);
  const [expandedPerf,  setExpandedPerf]  = useState(null);
  const [expandedPQ,    setExpandedPQ]    = useState(null);
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

  const ACCENT = "#FF8A65";

  return (
    <div style={{ minHeight: "100vh", background: "#07070E", color: "#DDD8F0", fontFamily: "Georgia, 'Times New Roman', serif" }}>

      {/* NAV */}
      <div style={{ background: "#0A0A14", borderBottom: "1px solid #16162A", padding: "0 24px", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 920, margin: "0 auto", display: "flex", alignItems: "center", overflowX: "auto" }}>
          <div style={{ fontSize: 10, color: ACCENT, letterSpacing: "0.22em", textTransform: "uppercase", padding: "14px 20px 14px 0", borderRight: "1px solid #1A1A2E", marginRight: 12, whiteSpace: "nowrap" }}>
            P2 · PART 2
          </div>
          {sections.map(s => (
            <button key={s.id} onClick={() => setActiveSection(s.id)} style={{
              background: "none", border: "none", cursor: "pointer",
              padding: "14px 12px", fontFamily: "inherit", fontSize: 11,
              color: activeSection === s.id ? ACCENT : "#444",
              borderBottom: activeSection === s.id ? `2px solid ${ACCENT}` : "2px solid transparent",
              transition: "all 0.2s", whiteSpace: "nowrap",
            }}>{s.label}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 920, margin: "0 auto", padding: "48px 24px 100px" }}>

        {/* ── INTRO ── */}
        {activeSection === "intro" && (
          <div>
            <div style={{ marginBottom: 52, borderLeft: `3px solid ${ACCENT}`, paddingLeft: 24 }}>
              <div style={{ fontSize: 10, color: ACCENT, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 12 }}>
                PHASE 2 · PART 2 OF 4 · WEEK 4 CONTINUED
              </div>
              <h1 style={{ fontSize: "clamp(26px,5vw,44px)", fontWeight: 900, margin: "0 0 16px", lineHeight: 1.12, letterSpacing: "-0.02em" }}>
                Advanced SQL<br />
                <span style={{ color: ACCENT }}>Window Functions</span><br />
                <span style={{ fontStyle: "italic", fontWeight: 400, fontSize: "0.65em", color: "#555" }}>CTEs, Performance and Pro Patterns</span>
              </h1>
              <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, maxWidth: 580, margin: "0 0 24px" }}>
                Part 1 gave you the foundation. Part 2 is where you separate yourself from 80% of candidates. Window functions, CTEs, and query optimisation are what senior analysts use daily — and what interviewers use to filter junior from mid-level hires.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {["~4 hours", "6 window functions", "4 CTE patterns", "6 performance rules", "4 practice queries", "6-question quiz"].map(tag => (
                  <span key={tag} style={{ padding: "4px 12px", background: "rgba(255,138,101,0.08)", border: "1px solid rgba(255,138,101,0.22)", borderRadius: 2, fontSize: 11, color: ACCENT }}>{tag}</span>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 28, paddingBottom: 16, borderBottom: "1px solid #1A1A2E" }}>
              <div style={{ fontSize: 10, color: ACCENT, letterSpacing: "0.3em", fontFamily: "monospace", marginBottom: 6 }}>SECTION 00</div>
              <h2 style={{ margin: 0, fontSize: "clamp(20px,3vw,28px)", fontWeight: 900, color: "#DDD8F0" }}>
                <span style={{ color: ACCENT }}>00. </span>What You Will Learn
              </h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 10, margin: "24px 0 36px" }}>
              {[
                { icon: "🪟", title: "Window Functions", desc: "ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD, SUM OVER — the functions that power real analytics", color: "#4FC3F7", section: "window" },
                { icon: "🔗", title: "CTEs (WITH clause)", desc: "Write readable multi-step queries. 4 patterns with before/after code comparisons", color: "#81C784", section: "cte" },
                { icon: "⚡", title: "Query Performance", desc: "6 rules to make slow queries fast — SELECT *, indexes, correlated subqueries, filter early", color: "#FFD54F", section: "performance" },
                { icon: "🔨", title: "Practice (4 queries)", desc: "Intermediate to Advanced: running totals, MoM change, top-N per group, deduplication", color: "#FF8A65", section: "practice" },
                { icon: "🤖", title: "AI for Advanced SQL", desc: "Prompts for window functions, debugging slow queries, explaining execution plans", color: "#CE93D8", section: "aitools" },
                { icon: "🧠", title: "Quiz (6 questions)", desc: "Test your advanced SQL knowledge before moving to Part 3", color: "#F48FB1", section: "quiz" },
              ].map((item, i) => (
                <div key={i} onClick={() => setActiveSection(item.section)} style={{
                  border: `1px solid ${item.color}33`, borderTop: `3px solid ${item.color}`,
                  borderRadius: 4, padding: "14px", background: "#0D0D18",
                  cursor: "pointer", transition: "background 0.2s",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = `${item.color}08`}
                  onMouseLeave={e => e.currentTarget.style.background = "#0D0D18"}
                >
                  <div style={{ fontSize: 20, marginBottom: 8 }}>{item.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#DDD8F0", marginBottom: 5 }}>{item.title}</div>
                  <div style={{ fontSize: 11, color: "#444", lineHeight: 1.6 }}>{item.desc}</div>
                </div>
              ))}
            </div>

            <div style={{ margin: "20px 0", padding: "14px 18px", background: "rgba(255,138,101,0.07)", border: "1px solid rgba(255,138,101,0.3)", borderLeft: `3px solid ${ACCENT}`, borderRadius: 4 }}>
              <div style={{ fontSize: 12, color: ACCENT, fontWeight: 700, marginBottom: 8 }}>💼 Why This Gets You Hired</div>
              <div style={{ fontSize: 13, color: "#666", lineHeight: 1.82 }}>
                Every mid-level data analyst job posting asks for window functions. They separate candidates who write basic queries from those who build production analytics. A RANK() OVER (PARTITION BY ...) in your interview answer signals immediately that you know real SQL.
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 48, paddingTop: 24, borderTop: "1px solid #1A1A2E" }}>
              <button onClick={() => setActiveSection("window")} style={{ background: ACCENT, border: "none", borderRadius: 3, padding: "8px 24px", cursor: "pointer", fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: "#07070E", letterSpacing: "0.1em" }}>Next Section →</button>
            </div>
          </div>
        )}

        {/* ── WINDOW FUNCTIONS ── */}
        {activeSection === "window" && (
          <div>
            <SH num="01" title="Window Functions" color="#4FC3F7" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 16px" }}>
              Window functions perform calculations <strong style={{ color: "#DDD8F0" }}>across a set of rows related to the current row</strong> — without collapsing them into a single result like GROUP BY does. They enable rankings, running totals, period comparisons, and deduplication patterns that are impossible with GROUP BY alone.
            </p>

            <div style={{ margin: "20px 0", padding: "14px 18px", background: "rgba(79,195,247,0.07)", border: "1px solid rgba(79,195,247,0.3)", borderLeft: "3px solid #4FC3F7", borderRadius: 4 }}>
              <div style={{ fontSize: 12, color: "#4FC3F7", fontWeight: 700, marginBottom: 8 }}>🔑 The OVER() Clause — How Window Functions Work</div>
              <code style={{ fontFamily: "monospace", color: "#4FC3F7", display: "block", marginBottom: 8, fontSize: 12 }}>{"FUNCTION() OVER (PARTITION BY col1 ORDER BY col2 ROWS ...)"}</code>
              <div style={{ fontSize: 13, color: "#666", lineHeight: 1.8 }}>
                <strong style={{ color: "#DDD8F0" }}>PARTITION BY</strong> divides rows into groups (rows stay separate, unlike GROUP BY)<br />
                <strong style={{ color: "#DDD8F0" }}>ORDER BY</strong> sets row order within each partition<br />
                <strong style={{ color: "#DDD8F0" }}>ROWS/RANGE</strong> defines which rows in the partition to include (optional)
              </div>
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#DDD8F0", margin: "32px 0 12px", borderLeft: "3px solid #4FC3F7", paddingLeft: 12 }}>GROUP BY vs Window Functions</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, margin: "16px 0 28px" }}>
              <div style={{ border: "1px solid #FF8A6544", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ padding: "8px 14px", background: "rgba(255,138,101,0.08)", borderBottom: "1px solid #FF8A6533" }}>
                  <span style={{ fontSize: 9, color: "#FF8A65", letterSpacing: "0.18em", textTransform: "uppercase", fontFamily: "monospace", fontWeight: 700 }}>GROUP BY — collapses rows</span>
                </div>
                <pre style={{ margin: 0, fontSize: 11, color: "#888", fontFamily: "monospace", lineHeight: 1.7, padding: "12px 14px" }}>{`SELECT region, SUM(revenue)
FROM orders
GROUP BY region;
-- Returns 4 rows (one per region)
-- Individual order rows are GONE`}</pre>
              </div>
              <div style={{ border: "1px solid #4FC3F744", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ padding: "8px 14px", background: "rgba(79,195,247,0.08)", borderBottom: "1px solid #4FC3F733" }}>
                  <span style={{ fontSize: 9, color: "#4FC3F7", letterSpacing: "0.18em", textTransform: "uppercase", fontFamily: "monospace", fontWeight: 700 }}>Window — keeps all rows</span>
                </div>
                <pre style={{ margin: 0, fontSize: 11, color: "#888", fontFamily: "monospace", lineHeight: 1.7, padding: "12px 14px" }}>{`SELECT order_id, region, revenue,
  SUM(revenue) OVER (
    PARTITION BY region
  ) AS region_total
FROM orders;
-- Returns ALL rows (40 rows)
-- Each row gets its region's total`}</pre>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, margin: "16px 0" }}>
              {windowFunctions.map((wf, i) => {
                const open = expandedWF === i;
                return (
                  <div key={i} style={{ border: `1px solid ${open ? wf.color + "55" : "#1A1A2E"}`, borderRadius: 4, overflow: "hidden" }}>
                    <button onClick={() => setExpandedWF(open ? null : i)} style={{
                      width: "100%", background: open ? `${wf.color}0A` : "#0D0D18",
                      border: "none", cursor: "pointer", padding: "14px 20px",
                      display: "flex", alignItems: "center", gap: 16,
                      fontFamily: "inherit", textAlign: "left",
                    }}>
                      <span style={{ fontSize: 9, color: wf.color, fontFamily: "monospace", background: `${wf.color}18`, padding: "3px 8px", borderRadius: 2, flexShrink: 0 }}>{wf.category}</span>
                      <div style={{ flex: 1 }}>
                        <code style={{ fontSize: 14, color: wf.color, fontFamily: "monospace", fontWeight: 700 }}>{wf.fn}</code>
                        {!open && <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>{wf.desc.substring(0, 68)}...</div>}
                      </div>
                      <span style={{ color: wf.color, fontSize: 18, transform: open ? "rotate(45deg)" : "none", transition: "transform 0.2s" }}>+</span>
                    </button>
                    {open && (
                      <div style={{ padding: "0 20px 22px 20px", background: `${wf.color}06` }}>
                        <div style={{ height: 1, background: `${wf.color}22`, margin: "0 0 18px" }} />
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
                          <div>
                            <span style={{ fontSize: 9, color: wf.color, letterSpacing: "0.18em", textTransform: "uppercase", fontFamily: "monospace", fontWeight: 700 }}>WHAT IT DOES</span>
                            <p style={{ fontSize: 13, color: "#AAA", margin: "6px 0 0", lineHeight: 1.65 }}>{wf.desc}</p>
                          </div>
                          <div>
                            <span style={{ fontSize: 9, color: wf.color, letterSpacing: "0.18em", textTransform: "uppercase", fontFamily: "monospace", fontWeight: 700 }}>USE WHEN</span>
                            <p style={{ fontSize: 13, color: "#AAA", margin: "6px 0 0", lineHeight: 1.65 }}>{wf.when}</p>
                          </div>
                        </div>
                        <div style={{ background: "#07070E", border: `1px solid ${wf.color}22`, borderRadius: 3, padding: "14px 16px", marginBottom: 14, overflowX: "auto" }}>
                          <span style={{ fontSize: 9, color: wf.color, letterSpacing: "0.18em", textTransform: "uppercase", fontFamily: "monospace", fontWeight: 700 }}>SQL EXAMPLE</span>
                          <pre style={{ margin: "8px 0 0", fontSize: 12, color: wf.color, fontFamily: "monospace", lineHeight: 1.75 }}>{wf.example}</pre>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                          <div style={{ background: "#07070E", border: "1px solid #1A1A2E", borderRadius: 3, padding: "10px 12px" }}>
                            <span style={{ fontSize: 9, color: "#888", letterSpacing: "0.18em", textTransform: "uppercase", fontFamily: "monospace", fontWeight: 700 }}>RESULT</span>
                            <p style={{ fontSize: 12, color: "#666", margin: "6px 0 0", lineHeight: 1.6 }}>{wf.result}</p>
                          </div>
                          <div style={{ background: "rgba(255,213,79,0.05)", border: "1px solid rgba(255,213,79,0.2)", borderRadius: 3, padding: "10px 12px" }}>
                            <span style={{ fontSize: 9, color: "#FFD54F", letterSpacing: "0.18em", textTransform: "uppercase", fontFamily: "monospace", fontWeight: 700 }}>PRO TIP</span>
                            <p style={{ fontSize: 12, color: "#888", margin: "6px 0 0", lineHeight: 1.6 }}>{wf.tip}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <NavBtns onPrev={() => setActiveSection("intro")} onNext={() => setActiveSection("cte")} />
          </div>
        )}

        {/* ── CTEs ── */}
        {activeSection === "cte" && (
          <div>
            <SH num="02" title="CTEs — SQL You Can Actually Read" color="#81C784" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 16px" }}>
              A CTE (Common Table Expression) is a <strong style={{ color: "#DDD8F0" }}>named temporary result set defined at the start of a query</strong> using the WITH keyword. CTEs do not make queries faster — they make them dramatically more readable, debuggable, and maintainable. In professional teams, unreadable SQL is a bigger problem than slow SQL.
            </p>

            <div style={{ margin: "20px 0", padding: "14px 18px", background: "rgba(129,199,132,0.07)", border: "1px solid rgba(129,199,132,0.3)", borderLeft: "3px solid #81C784", borderRadius: 4 }}>
              <div style={{ fontSize: 12, color: "#81C784", fontWeight: 700, marginBottom: 8 }}>📐 CTE Syntax Template</div>
              <pre style={{ margin: 0, fontSize: 12, color: "#81C784", fontFamily: "monospace", lineHeight: 1.8 }}>{`WITH
cte_name_1 AS (
  SELECT ...  -- first step
),
cte_name_2 AS (
  SELECT ...  -- references cte_name_1
  FROM cte_name_1
)
SELECT *     -- final query uses any CTE
FROM cte_name_2;`}</pre>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, margin: "28px 0" }}>
              {ctePatterns.map((cte, i) => {
                const open = expandedCTE === i;
                return (
                  <div key={i} style={{ border: `1px solid ${open ? cte.color + "55" : "#1A1A2E"}`, borderRadius: 4, overflow: "hidden" }}>
                    <button onClick={() => setExpandedCTE(open ? null : i)} style={{
                      width: "100%", background: open ? `${cte.color}0A` : "#0D0D18",
                      border: "none", cursor: "pointer", padding: "16px 20px",
                      display: "flex", alignItems: "center", gap: 16,
                      fontFamily: "inherit", textAlign: "left",
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: "#DDD8F0" }}>{cte.name}</div>
                        {!open && <div style={{ fontSize: 12, color: "#555", marginTop: 3 }}>{cte.why.substring(0, 70)}...</div>}
                      </div>
                      <span style={{ color: cte.color, fontSize: 18, transform: open ? "rotate(45deg)" : "none", transition: "transform 0.2s" }}>+</span>
                    </button>
                    {open && (
                      <div style={{ padding: "0 20px 22px 20px", background: `${cte.color}06` }}>
                        <div style={{ height: 1, background: `${cte.color}22`, margin: "0 0 18px" }} />
                        <p style={{ fontSize: 13, color: "#888", lineHeight: 1.7, margin: "0 0 16px" }}>{cte.why}</p>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                          <div style={{ background: "#07070E", border: "1px solid rgba(255,138,101,0.3)", borderRadius: 3, padding: "12px 14px", overflowX: "auto" }}>
                            <span style={{ fontSize: 9, color: "#FF8A65", letterSpacing: "0.18em", textTransform: "uppercase", fontFamily: "monospace", fontWeight: 700 }}>BEFORE (harder)</span>
                            <pre style={{ margin: "8px 0 0", fontSize: 11, color: "#666", fontFamily: "monospace", lineHeight: 1.7 }}>{cte.before}</pre>
                          </div>
                          <div style={{ background: "#07070E", border: `1px solid ${cte.color}33`, borderRadius: 3, padding: "12px 14px", overflowX: "auto" }}>
                            <span style={{ fontSize: 9, color: cte.color, letterSpacing: "0.18em", textTransform: "uppercase", fontFamily: "monospace", fontWeight: 700 }}>WITH CTE (clean)</span>
                            <pre style={{ margin: "8px 0 0", fontSize: 11, color: cte.color, fontFamily: "monospace", lineHeight: 1.7 }}>{cte.after}</pre>
                          </div>
                        </div>
                        <div style={{ background: "rgba(255,213,79,0.05)", border: "1px solid rgba(255,213,79,0.2)", borderRadius: 3, padding: "10px 12px" }}>
                          <span style={{ fontSize: 9, color: "#FFD54F", letterSpacing: "0.18em", textTransform: "uppercase", fontFamily: "monospace", fontWeight: 700 }}>PRO TIP</span>
                          <p style={{ fontSize: 12, color: "#888", margin: "6px 0 0", lineHeight: 1.6 }}>{cte.tip}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <NavBtns onPrev={() => setActiveSection("window")} onNext={() => setActiveSection("performance")} />
          </div>
        )}

        {/* ── PERFORMANCE ── */}
        {activeSection === "performance" && (
          <div>
            <SH num="03" title="Query Performance — Make Slow Queries Fast" color="#FFD54F" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 16px" }}>
              A correct query that takes 10 minutes to run is a broken query in production. Understanding <strong style={{ color: "#DDD8F0" }}>why queries are slow and how to fix them</strong> is what separates analysts who work with real data from those stuck on spreadsheet-sized datasets.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, margin: "28px 0" }}>
              {performanceTips.map((tip, i) => {
                const open = expandedPerf === i;
                return (
                  <div key={i} style={{ border: `1px solid ${open ? tip.color + "55" : "#1A1A2E"}`, borderRadius: 4, overflow: "hidden" }}>
                    <button onClick={() => setExpandedPerf(open ? null : i)} style={{
                      width: "100%", background: open ? `${tip.color}08` : "#0D0D18",
                      border: "none", cursor: "pointer", padding: "14px 20px",
                      display: "flex", alignItems: "center", gap: 14,
                      fontFamily: "inherit", textAlign: "left",
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#DDD8F0" }}>{tip.rule}</div>
                        {!open && (
                          <span style={{ fontSize: 10, color: tip.color, background: `${tip.color}15`, padding: "2px 8px", borderRadius: 2, fontFamily: "monospace", marginTop: 5, display: "inline-block" }}>
                            IMPACT: {tip.impact}
                          </span>
                        )}
                      </div>
                      <span style={{ color: tip.color, fontSize: 18, transform: open ? "rotate(45deg)" : "none", transition: "transform 0.2s" }}>+</span>
                    </button>
                    {open && (
                      <div style={{ padding: "0 20px 20px 20px", background: `${tip.color}06` }}>
                        <div style={{ height: 1, background: `${tip.color}22`, margin: "0 0 16px" }} />
                        <p style={{ fontSize: 13, color: "#888", lineHeight: 1.7, margin: "0 0 14px" }}>{tip.why}</p>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                          <div style={{ background: "#07070E", border: "1px solid rgba(255,138,101,0.3)", borderRadius: 3, padding: "12px 14px", overflowX: "auto" }}>
                            <span style={{ fontSize: 9, color: "#FF8A65", letterSpacing: "0.18em", textTransform: "uppercase", fontFamily: "monospace", fontWeight: 700 }}>SLOW</span>
                            <pre style={{ margin: "8px 0 0", fontSize: 11, color: "#666", fontFamily: "monospace", lineHeight: 1.7 }}>{tip.bad}</pre>
                          </div>
                          <div style={{ background: "#07070E", border: `1px solid ${tip.color}33`, borderRadius: 3, padding: "12px 14px", overflowX: "auto" }}>
                            <span style={{ fontSize: 9, color: tip.color, letterSpacing: "0.18em", textTransform: "uppercase", fontFamily: "monospace", fontWeight: 700 }}>FAST</span>
                            <pre style={{ margin: "8px 0 0", fontSize: 11, color: tip.color, fontFamily: "monospace", lineHeight: 1.7 }}>{tip.good}</pre>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <NavBtns onPrev={() => setActiveSection("cte")} onNext={() => setActiveSection("practice")} />
          </div>
        )}

        {/* ── PRACTICE ── */}
        {activeSection === "practice" && (
          <div>
            <SH num="04" title="Practice Queries — Advanced Patterns" color="#FF8A65" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 16px" }}>
              These 4 queries use window functions and CTEs together — the <strong style={{ color: "#DDD8F0" }}>real patterns you will write on the job and in interviews</strong>. Attempt each one before revealing the solution.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, margin: "28px 0" }}>
              {practiceQueries.map((q, i) => {
                const open = expandedPQ === i;
                return (
                  <div key={i} style={{ border: `1px solid ${open ? q.color + "55" : "#1A1A2E"}`, borderRadius: 4, overflow: "hidden" }}>
                    <button onClick={() => setExpandedPQ(open ? null : i)} style={{
                      width: "100%", background: open ? `${q.color}0A` : "#0D0D18",
                      border: "none", cursor: "pointer", padding: "16px 20px",
                      display: "flex", alignItems: "center", gap: 14,
                      fontFamily: "inherit", textAlign: "left",
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                          <span style={{ fontSize: 10, color: q.color, background: `${q.color}18`, padding: "2px 8px", borderRadius: 2, fontFamily: "monospace" }}>{q.level}</span>
                          <span style={{ fontSize: 15, fontWeight: 700, color: "#DDD8F0" }}>{q.title}</span>
                        </div>
                        {!open && <div style={{ fontSize: 12, color: "#555" }}>{q.scenario.substring(0, 72)}...</div>}
                      </div>
                      <span style={{ color: q.color, fontSize: 18, transform: open ? "rotate(45deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }}>+</span>
                    </button>
                    {open && (
                      <div style={{ padding: "0 20px 22px 20px", background: `${q.color}06` }}>
                        <div style={{ height: 1, background: `${q.color}22`, margin: "0 0 16px" }} />
                        <p style={{ fontSize: 13, color: "#AAA", lineHeight: 1.7, margin: "0 0 14px" }}>{q.scenario}</p>
                        <div style={{ background: "rgba(255,213,79,0.05)", border: "1px solid rgba(255,213,79,0.2)", borderRadius: 3, padding: "10px 14px", marginBottom: 14 }}>
                          <span style={{ fontSize: 9, color: "#FFD54F", letterSpacing: "0.18em", textTransform: "uppercase", fontFamily: "monospace", fontWeight: 700 }}>HINT — try before looking</span>
                          <p style={{ fontSize: 12, color: "#888", margin: "6px 0 0", lineHeight: 1.65 }}>{q.hint}</p>
                        </div>
                        <div style={{ background: "#07070E", border: `1px solid ${q.color}22`, borderRadius: 3, padding: "14px 16px", overflowX: "auto" }}>
                          <span style={{ fontSize: 9, color: q.color, letterSpacing: "0.18em", textTransform: "uppercase", fontFamily: "monospace", fontWeight: 700 }}>SOLUTION</span>
                          <pre style={{ margin: "8px 0 0", fontSize: 12, color: "#81C784", fontFamily: "monospace", lineHeight: 1.75 }}>{q.solution}</pre>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#DDD8F0", margin: "32px 0 12px", borderLeft: `3px solid ${ACCENT}`, paddingLeft: 12 }}>Advanced SQL Pattern Cheatsheet</h3>
            <div style={{ border: "1px solid #1A1A2E", borderRadius: 4, overflow: "hidden", margin: "16px 0 28px" }}>
              {[
                { pattern: "Latest record per group",       sql: "ROW_NUMBER() OVER (PARTITION BY x ORDER BY date DESC) — filter rn=1",        color: "#4FC3F7" },
                { pattern: "Top N per group",              sql: "RANK() OVER (PARTITION BY x ORDER BY metric DESC) — filter rank<=N",          color: "#81C784" },
                { pattern: "Running total",                 sql: "SUM(x) OVER (PARTITION BY g ORDER BY t ROWS UNBOUNDED PRECEDING)",           color: "#FFD54F" },
                { pattern: "% of group total",             sql: "x * 100.0 / SUM(x) OVER (PARTITION BY group)",                               color: "#FF8A65" },
                { pattern: "Period-over-period change",     sql: "x - LAG(x,1) OVER (ORDER BY period)",                                        color: "#CE93D8" },
                { pattern: "Multi-step readable query",    sql: "WITH step1 AS (...), step2 AS (...) SELECT * FROM step2",                     color: "#80DEEA" },
              ].map((row, i, arr) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 16, padding: "11px 16px", borderBottom: i < arr.length - 1 ? "1px solid #0F0F18" : "none", background: i % 2 === 0 ? "#0A0A14" : "#07070E", alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: row.color, fontWeight: 700 }}>{row.pattern}</span>
                  <code style={{ fontSize: 11, color: "#666", fontFamily: "monospace", lineHeight: 1.6 }}>{row.sql}</code>
                </div>
              ))}
            </div>

            <NavBtns onPrev={() => setActiveSection("performance")} onNext={() => setActiveSection("aitools")} />
          </div>
        )}

        {/* ── AI TOOLS ── */}
        {activeSection === "aitools" && (
          <div>
            <SH num="05" title="AI Tools for Advanced SQL" color="#CE93D8" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 16px" }}>
              Window functions and CTEs are where AI assistance becomes most valuable — the syntax is verbose, bugs are subtle, and logic is multi-step. Use these prompts to write, debug, and optimise advanced SQL with AI as your co-pilot.
            </p>

            {[
              {
                title: "Generate Window Functions from Plain English",
                color: "#4FC3F7",
                prompts: [
                  '"Write SQL using ROW_NUMBER() to get the single most recent completed order per customer. Table: orders(id, customer_id, product, units, price, status, order_date)."',
                  '"Write a query using RANK() to find the top 3 products by revenue within each region. Show region, product, revenue, and rank within region."',
                  '"Write SQL with LAG() to calculate month-over-month revenue change and % change. Flag months with decline using CASE WHEN."',
                ],
                warning: "Always paste your actual table schema. Without it, AI invents column names that may not exist in your database.",
              },
              {
                title: "Refactor Subqueries to CTEs",
                color: "#81C784",
                prompts: [
                  '"Refactor this SQL to use CTEs instead of nested subqueries. Keep the exact same logic: [paste query]"',
                  '"Break this query into clearly named CTE steps. Name each CTE after what it does: [paste query]"',
                  '"This query has 4 levels of nested subqueries. Rewrite it using CTEs so a junior analyst can understand it."',
                ],
                warning: "CTEs do not change query performance — they improve readability. If AI claims CTEs are faster, that is incorrect for most databases.",
              },
              {
                title: "Debug and Optimise Slow Queries",
                color: "#FFD54F",
                prompts: [
                  '"This query takes 45 seconds on a 2M row table. Identify what is making it slow and rewrite it: [paste query]"',
                  '"I have this EXPLAIN ANALYZE output from PostgreSQL. What is the bottleneck and how do I fix it? [paste plan]"',
                  '"My query uses a correlated subquery in SELECT. Rewrite it using a JOIN to improve performance."',
                ],
                warning: "Performance advice is database-specific. Always mention which database you are using: MySQL, PostgreSQL, BigQuery, or SQL Server.",
              },
            ].map((section, i) => (
              <div key={i} style={{ border: `1px solid ${section.color}33`, borderLeft: `3px solid ${section.color}`, borderRadius: 4, padding: "18px 20px", marginBottom: 12, background: `${section.color}06` }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#DDD8F0", marginBottom: 14 }}>{section.title}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
                  {section.prompts.map((p, j) => (
                    <div key={j} style={{ background: "#07070E", border: `1px solid ${section.color}22`, borderRadius: 3, padding: "10px 12px" }}>
                      <code style={{ fontSize: 12, color: section.color, fontFamily: "monospace", lineHeight: 1.6 }}>{p}</code>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 8, background: "rgba(255,100,100,0.05)", border: "1px solid rgba(255,100,100,0.2)", borderRadius: 3, padding: "8px 12px" }}>
                  <span style={{ fontSize: 12 }}>⚠️</span>
                  <span style={{ fontSize: 12, color: "#FF8A65", lineHeight: 1.5 }}>{section.warning}</span>
                </div>
              </div>
            ))}

            <NavBtns onPrev={() => setActiveSection("practice")} onNext={() => setActiveSection("quiz")} nextLabel="Take the Quiz →" />
          </div>
        )}

        {/* ── QUIZ ── */}
        {activeSection === "quiz" && (
          <div>
            <SH num="06" title="Part 2 Knowledge Check" color="#FFD54F" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 16px" }}>6 questions on window functions, CTEs, and performance. Score 4+ to proceed to Part 3.</p>

            {!quizState.done ? (
              <div style={{ margin: "28px 0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                  <span style={{ fontSize: 11, color: "#555", fontFamily: "monospace", letterSpacing: "0.15em" }}>QUESTION {quizState.idx + 1} / {quizQuestions.length}</span>
                  <span style={{ fontSize: 11, color: ACCENT, fontFamily: "monospace" }}>SCORE: {quizState.score} / {quizState.idx}</span>
                </div>
                <div style={{ height: 3, background: "#1A1A2E", borderRadius: 2, marginBottom: 28, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${(quizState.idx / quizQuestions.length) * 100}%`, background: `linear-gradient(90deg, ${ACCENT}, #FFD54F)`, transition: "width 0.4s" }} />
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
                    } else if (sel) { bg = "rgba(255,138,101,0.08)"; border = ACCENT; col = ACCENT; }
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
                  <div style={{ margin: "20px 0 0", padding: "14px 18px", background: "rgba(255,138,101,0.04)", border: `1px solid rgba(255,138,101,0.2)`, borderRadius: 4 }}>
                    <div style={{ fontSize: 10, color: ACCENT, letterSpacing: "0.15em", marginBottom: 6, fontFamily: "monospace" }}>EXPLANATION</div>
                    <p style={{ fontSize: 13, color: "#888", margin: "0 0 16px", lineHeight: 1.7 }}>
                      {quizQuestions[quizState.idx].explanation}
                    </p>
                    <button onClick={nextQ} style={{ background: ACCENT, border: "none", borderRadius: 3, padding: "8px 20px", cursor: "pointer", fontFamily: "monospace", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#07070E" }}>
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
                <div style={{ fontSize: 44, fontWeight: 900, marginBottom: 8, color: quizState.score >= 5 ? "#81C784" : quizState.score >= 4 ? "#FFD54F" : ACCENT }}>
                  {quizState.score} / {quizQuestions.length}
                </div>
                <div style={{ fontSize: 15, color: "#666", marginBottom: 28 }}>
                  {quizState.score === 6 ? "Advanced SQL mastered. Ready for BigQuery and AI SQL tools." : quizState.score >= 4 ? "Good pass. Review any tricky sections before Part 3." : "Revisit window functions and CTEs before moving on."}
                </div>
                <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                  <button onClick={() => setQuizState({ idx: 0, selected: null, answered: false, score: 0, done: false })} style={{ background: "none", border: "1px solid #333", borderRadius: 3, padding: "8px 20px", cursor: "pointer", fontFamily: "monospace", fontSize: 11, color: "#555", letterSpacing: "0.1em" }}>RETAKE</button>
                  <button onClick={() => setActiveSection("intro")} style={{ background: ACCENT, border: "none", borderRadius: 3, padding: "8px 24px", cursor: "pointer", fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: "#07070E", letterSpacing: "0.1em" }}>REVIEW ↑</button>
                </div>
                <div style={{ marginTop: 40, padding: "22px", background: "#0D0D18", border: "1px solid #1A1A2E", borderRadius: 4, textAlign: "left" }}>
                  <div style={{ fontSize: 11, color: "#555", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 10, fontFamily: "monospace" }}>WHAT IS IN PART 3</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#DDD8F0", marginBottom: 8 }}>AI-Powered SQL — BigQuery, Gemini AI and Text-to-SQL</div>
                  <p style={{ fontSize: 13, color: "#555", lineHeight: 1.7, margin: "0 0 14px" }}>
                    Google BigQuery setup, Gemini AI for natural language queries, SQLAI.ai, business analytics patterns (RFM, cohort, funnel), and Looker Studio integration.
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {["Google BigQuery", "Gemini in BigQuery", "SQLAI.ai", "RFM Segmentation", "Cohort Analysis", "Looker Studio"].map(t => (
                      <span key={t} style={{ padding: "3px 10px", background: "rgba(255,138,101,0.07)", border: "1px solid rgba(255,138,101,0.2)", borderRadius: 2, fontSize: 11, color: ACCENT }}>{t}</span>
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
        <button onClick={onNext} style={{ background: "#FF8A65", border: "none", borderRadius: 3, padding: "8px 24px", cursor: "pointer", fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: "#07070E", letterSpacing: "0.1em" }}>{nextLabel}</button>
      )}
    </div>
  );
}
