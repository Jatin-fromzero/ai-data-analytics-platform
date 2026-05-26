import { useState } from "react";

// ─── QUIZ ─────────────────────────────────────────────────────
const quizQuestions = [
  {
    q: "Which clause do you use to filter rows AFTER aggregation (e.g. only show categories with total sales > $10,000)?",
    options: ["WHERE", "FILTER", "HAVING", "GROUP BY"],
    answer: 2,
    explanation: "HAVING filters groups AFTER GROUP BY runs. WHERE filters individual rows BEFORE aggregation. Rule: WHERE = row-level filter. HAVING = group-level filter. You cannot use WHERE with aggregate functions like SUM() or COUNT()."
  },
  {
    q: "You want all customers, including those who have never placed an order. Which JOIN keeps unmatched customers?",
    options: ["INNER JOIN", "RIGHT JOIN", "LEFT JOIN on customers table", "CROSS JOIN"],
    answer: 2,
    explanation: "LEFT JOIN returns ALL rows from the left table (customers) plus matching rows from the right (orders). Customers with no orders appear with NULL in the order columns. This is the most common JOIN for finding 'things with no related records'."
  },
  {
    q: "What does this query return?\nSELECT region, COUNT(*) as total_orders, AVG(revenue) as avg_revenue\nFROM orders\nWHERE status = 'Completed'\nGROUP BY region\nORDER BY avg_revenue DESC;",
    options: [
      "One row per order, sorted by revenue",
      "One row per region showing order count and avg revenue for completed orders, highest avg first",
      "All completed orders with their region",
      "An error — you cannot use both COUNT and AVG together"
    ],
    answer: 1,
    explanation: "WHERE filters to Completed orders first → GROUP BY collapses to one row per region → COUNT(*) counts orders per region → AVG(revenue) averages revenue per region → ORDER BY sorts highest average first. This is the classic analytical query pattern."
  },
  {
    q: "What is the correct order of SQL clauses?",
    options: [
      "SELECT → FROM → GROUP BY → WHERE → HAVING → ORDER BY",
      "FROM → WHERE → SELECT → GROUP BY → HAVING → ORDER BY",
      "SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY",
      "FROM → SELECT → WHERE → GROUP BY → ORDER BY → HAVING"
    ],
    answer: 2,
    explanation: "Written order: SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY → LIMIT. Execution order is different: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT. Understanding execution order helps you know what's available at each step."
  },
  {
    q: "You have a customers table and an orders table. orders.customer_id links to customers.id. Which query correctly counts orders per customer name?",
    options: [
      "SELECT name, COUNT(*) FROM customers, orders GROUP BY name",
      "SELECT c.name, COUNT(o.id) as orders FROM customers c LEFT JOIN orders o ON c.id = o.customer_id GROUP BY c.name",
      "SELECT COUNT(*) FROM orders JOIN customers WHERE id = customer_id",
      "SELECT name FROM customers WHERE COUNT(orders) > 0"
    ],
    answer: 1,
    explanation: "LEFT JOIN links customers to their orders using ON c.id = o.customer_id. GROUP BY c.name collapses to one row per customer. COUNT(o.id) counts only non-NULL order IDs — customers with no orders show 0. Table aliases (c, o) keep the query readable."
  },
  {
    q: "A subquery in the WHERE clause: SELECT * FROM products WHERE price > (SELECT AVG(price) FROM products). What does this return?",
    options: [
      "All products with price equal to the average",
      "An error — you cannot compare to a subquery",
      "All products whose price is above the overall average product price",
      "The average price of all products"
    ],
    answer: 2,
    explanation: "The inner query (SELECT AVG(price) FROM products) runs first and returns a single number — the average price. The outer query then filters products where price > that average. This is a correlated/scalar subquery — one of SQL's most powerful patterns."
  },
];

// ─── SQL CONCEPT DATA ─────────────────────────────────────────
const selectClauses = [
  { clause:"SELECT",   color:"#4FC3F7", role:"Choose which columns to return",          exec:"5th", example:"SELECT name, email, created_at" },
  { clause:"FROM",     color:"#81C784", role:"Specify the table(s) to read from",        exec:"1st", example:"FROM customers" },
  { clause:"JOIN",     color:"#FFD54F", role:"Combine rows from another table",           exec:"2nd", example:"LEFT JOIN orders ON customers.id = orders.customer_id" },
  { clause:"WHERE",    color:"#FF8A65", role:"Filter individual rows (before grouping)",  exec:"3rd", example:"WHERE status = 'Active' AND region = 'North'" },
  { clause:"GROUP BY", color:"#CE93D8", role:"Collapse rows into groups",                 exec:"4th", example:"GROUP BY region, category" },
  { clause:"HAVING",   color:"#F48FB1", role:"Filter groups (after GROUP BY)",            exec:"5th", example:"HAVING SUM(revenue) > 10000" },
  { clause:"ORDER BY", color:"#80DEEA", role:"Sort the result set",                       exec:"6th", example:"ORDER BY total_revenue DESC" },
  { clause:"LIMIT",    color:"#A5D6A7", role:"Cap the number of rows returned",           exec:"7th", example:"LIMIT 10" },
];

const filterOperators = [
  { op:"=",             use:"Exact match",                    ex:"WHERE status = 'Active'",              color:"#4FC3F7" },
  { op:"!=  /  <>",     use:"Not equal",                      ex:"WHERE region != 'West'",               color:"#4FC3F7" },
  { op:"> >= < <=",     use:"Numeric / date comparisons",     ex:"WHERE revenue >= 1000",                color:"#81C784" },
  { op:"BETWEEN",       use:"Range (inclusive on both ends)", ex:"WHERE price BETWEEN 10 AND 100",       color:"#81C784" },
  { op:"IN (...)",      use:"Match any value in a list",      ex:"WHERE region IN ('North','South')",    color:"#FFD54F" },
  { op:"NOT IN (...)",  use:"Exclude list of values",         ex:"WHERE status NOT IN ('Returned','Cancelled')", color:"#FFD54F" },
  { op:"LIKE",          use:"Pattern match on text",          ex:"WHERE email LIKE '%@gmail.com'",       color:"#FF8A65" },
  { op:"IS NULL",       use:"Find missing / blank values",    ex:"WHERE phone IS NULL",                  color:"#CE93D8" },
  { op:"IS NOT NULL",   use:"Find rows with a value present", ex:"WHERE manager_id IS NOT NULL",         color:"#CE93D8" },
  { op:"AND / OR",      use:"Combine multiple conditions",    ex:"WHERE region='North' AND revenue>500", color:"#F48FB1" },
];

const aggregateFns = [
  { fn:"COUNT(*)",      returns:"Number of rows in the group",                     nulls:"Counts ALL rows including NULLs",           ex:"COUNT(*) → 1,204 orders",                       color:"#4FC3F7" },
  { fn:"COUNT(column)", returns:"Number of non-NULL values in that column",        nulls:"Ignores NULLs — use to count non-empty fields", ex:"COUNT(email) → 1,180 customers with email",   color:"#4FC3F7" },
  { fn:"SUM(column)",   returns:"Total of all numeric values",                     nulls:"Ignores NULLs automatically",               ex:"SUM(revenue) → $142,300",                       color:"#81C784" },
  { fn:"AVG(column)",   returns:"Mean of all numeric values",                      nulls:"Ignores NULLs — watch out with sparse data", ex:"AVG(order_value) → $118.24",                   color:"#FFD54F" },
  { fn:"MAX(column)",   returns:"Largest value (works on numbers, dates, text)",   nulls:"Ignores NULLs",                             ex:"MAX(order_date) → most recent order date",      color:"#FF8A65" },
  { fn:"MIN(column)",   returns:"Smallest value",                                  nulls:"Ignores NULLs",                             ex:"MIN(price) → cheapest product",                 color:"#CE93D8" },
];

const joinTypes = [
  {
    type:"INNER JOIN", icon:"⬡", color:"#4FC3F7",
    desc:"Returns only rows where there is a match in BOTH tables. The most common join — but it silently drops unmatched rows.",
    when:"You only care about records that exist in both tables.",
    businessEx:"Find all orders AND their customer details — orders with no matching customer are excluded.",
    sql:"SELECT o.id, o.revenue, c.name\nFROM orders o\nINNER JOIN customers c ON o.customer_id = c.id",
    warning:"If a customer_id in orders doesn't exist in customers, that order disappears silently. Always verify row counts.",
  },
  {
    type:"LEFT JOIN", icon:"◧", color:"#81C784",
    desc:"Returns ALL rows from the left table, plus matching rows from the right. Unmatched right-table values appear as NULL.",
    when:"You want all records from one table, whether or not they have related records in another.",
    businessEx:"All customers — including those who've never ordered. Unordered customers show NULL in order columns.",
    sql:"SELECT c.name, COUNT(o.id) as total_orders\nFROM customers c\nLEFT JOIN orders o ON c.id = o.customer_id\nGROUP BY c.name",
    warning:"The most useful join for analytics — finding 'customers with no orders', 'products never sold', etc.",
  },
  {
    type:"RIGHT JOIN", icon:"◨", color:"#FFD54F",
    desc:"Returns ALL rows from the right table, plus matching rows from the left. Mirror of LEFT JOIN.",
    when:"Rarely used — you can always rewrite a RIGHT JOIN as a LEFT JOIN by swapping table order.",
    businessEx:"All orders, including those referencing deleted/missing customers (NULLs in customer columns).",
    sql:"SELECT c.name, o.id, o.revenue\nFROM customers c\nRIGHT JOIN orders o ON c.id = o.customer_id",
    warning:"Most analysts prefer LEFT JOIN for readability. RIGHT JOIN is technically equivalent with tables swapped.",
  },
  {
    type:"FULL OUTER JOIN", icon:"◈", color:"#FF8A65",
    desc:"Returns ALL rows from BOTH tables. Unmatched rows from either side appear as NULL on the opposite side.",
    when:"When you need a complete picture of both tables — matches AND mismatches from both sides.",
    businessEx:"Full audit: all customers AND all orders, including orphaned orders and customers who never ordered.",
    sql:"SELECT c.name, o.id, o.revenue\nFROM customers c\nFULL OUTER JOIN orders o ON c.id = o.customer_id",
    warning:"Not supported in MySQL — use UNION of LEFT JOIN and RIGHT JOIN as a workaround.",
  },
];

const subqueryPatterns = [
  {
    name:"Scalar Subquery (WHERE)",
    color:"#4FC3F7",
    desc:"Returns a single value. Used in WHERE to compare against a calculated threshold.",
    useCase:"Find all products priced above average. Find orders above mean order value.",
    sql:`SELECT product_name, price
FROM products
WHERE price > (
  SELECT AVG(price) FROM products
)
ORDER BY price DESC;`,
    tip:"The inner query runs once, returns one number. Outer query uses it as a comparison value.",
  },
  {
    name:"IN Subquery",
    color:"#81C784",
    desc:"Returns a list of values. Used with IN to filter the outer query by that list.",
    useCase:"Find customers who placed orders in December. Find products that were ever returned.",
    sql:`SELECT name, email
FROM customers
WHERE id IN (
  SELECT DISTINCT customer_id
  FROM orders
  WHERE MONTH(order_date) = 12
    AND status = 'Completed'
);`,
    tip:"DISTINCT prevents duplicates in the subquery list. Always add it unless you're certain IDs are unique.",
  },
  {
    name:"Subquery as Derived Table (FROM)",
    color:"#FFD54F",
    desc:"Wraps a query in FROM as if it were a table. Lets you filter or join on aggregated results.",
    useCase:"Find regions where average order value > $200. Rank sales reps within each region.",
    sql:`SELECT region, avg_revenue
FROM (
  SELECT region, AVG(revenue) as avg_revenue
  FROM orders
  WHERE status = 'Completed'
  GROUP BY region
) AS region_summary
WHERE avg_revenue > 200
ORDER BY avg_revenue DESC;`,
    tip:"Always alias your derived table (AS region_summary). Some databases require it. Makes the query readable.",
  },
  {
    name:"EXISTS Subquery",
    color:"#FF8A65",
    desc:"Returns TRUE/FALSE. Checks whether the subquery returns any rows. Faster than IN for large datasets.",
    useCase:"Find customers who have at least one completed order. Find products with active inventory.",
    sql:`SELECT c.name, c.email
FROM customers c
WHERE EXISTS (
  SELECT 1
  FROM orders o
  WHERE o.customer_id = c.id
    AND o.status = 'Completed'
);`,
    tip:"SELECT 1 inside EXISTS is convention — the actual value doesn't matter, only whether rows exist.",
  },
];

const practiceQueries = [
  {
    level:"Beginner", color:"#81C784", badge:"⬢",
    title:"Top 5 Products by Revenue",
    scenario:"The product team wants to know which 5 products generated the most revenue from completed orders.",
    hint:"You need: filter to Completed, calculate revenue per product (SUM of units × price), sort descending, limit to 5.",
    solution:`SELECT 
  product,
  SUM(units * price) AS total_revenue,
  COUNT(*) AS total_orders
FROM orders
WHERE status = 'Completed'
GROUP BY product
ORDER BY total_revenue DESC
LIMIT 5;`,
    expectedCols:["product","total_revenue","total_orders"],
  },
  {
    level:"Beginner", color:"#81C784", badge:"⬢",
    title:"Monthly Order Count & Revenue",
    scenario:"Sarah needs a month-by-month breakdown of order volume and revenue for FY2024.",
    hint:"Extract month from the date column. GROUP BY month. Include both COUNT and SUM.",
    solution:`SELECT
  MONTH(order_date)   AS month_num,
  MONTHNAME(order_date) AS month_name,
  COUNT(*)            AS total_orders,
  SUM(units * price)  AS revenue
FROM orders
WHERE status = 'Completed'
  AND YEAR(order_date) = 2024
GROUP BY MONTH(order_date), MONTHNAME(order_date)
ORDER BY month_num;`,
    expectedCols:["month_num","month_name","total_orders","revenue"],
  },
  {
    level:"Intermediate", color:"#FFD54F", badge:"⬡",
    title:"Customers with No Orders (LEFT JOIN)",
    scenario:"Marketing wants a list of registered customers who have never placed an order — to re-engage them.",
    hint:"LEFT JOIN orders. Filter WHERE order_id IS NULL — those are the unmatched customers.",
    solution:`SELECT
  c.id,
  c.name,
  c.email,
  c.signup_date
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
WHERE o.id IS NULL
ORDER BY c.signup_date DESC;`,
    expectedCols:["id","name","email","signup_date"],
  },
  {
    level:"Intermediate", color:"#FFD54F", badge:"⬡",
    title:"Sales Rep Performance with JOIN",
    scenario:"Build a sales rep leaderboard: name, total orders, total revenue, avg order value — from completed orders only.",
    hint:"JOIN reps table to orders. GROUP BY rep name. Use COUNT, SUM, AVG. Sort by revenue DESC.",
    solution:`SELECT
  r.name                        AS sales_rep,
  COUNT(o.id)                   AS total_orders,
  SUM(o.units * o.price)        AS total_revenue,
  AVG(o.units * o.price)        AS avg_order_value,
  MAX(o.units * o.price)        AS biggest_deal
FROM sales_reps r
LEFT JOIN orders o 
  ON r.id = o.rep_id
  AND o.status = 'Completed'
GROUP BY r.name
ORDER BY total_revenue DESC;`,
    expectedCols:["sales_rep","total_orders","total_revenue","avg_order_value","biggest_deal"],
  },
  {
    level:"Advanced", color:"#FF8A65", badge:"◈",
    title:"Products Above Average Price (Subquery)",
    scenario:"Find all products priced above the average product price. Show product name, category, price, and difference from average.",
    hint:"Use a scalar subquery in WHERE. Alias the subquery result. Show the difference: price - avg_price.",
    solution:`SELECT
  product_name,
  category,
  price,
  ROUND(price - (SELECT AVG(price) FROM products), 2) AS above_avg_by
FROM products
WHERE price > (SELECT AVG(price) FROM products)
ORDER BY above_avg_by DESC;`,
    expectedCols:["product_name","category","price","above_avg_by"],
  },
  {
    level:"Advanced", color:"#FF8A65", badge:"◈",
    title:"Region Performance vs. Company Average (Subquery in FROM)",
    scenario:"Compare each region's average order value against the company-wide average. Label regions as 'Above' or 'Below' average.",
    hint:"Use a derived table (subquery in FROM) to calculate per-region AVG. Join to company-wide AVG. Use CASE WHEN.",
    solution:`SELECT
  region_summary.region,
  region_summary.avg_order_value,
  company_avg.overall_avg,
  ROUND(region_summary.avg_order_value - company_avg.overall_avg, 2) AS difference,
  CASE 
    WHEN region_summary.avg_order_value > company_avg.overall_avg 
    THEN 'Above Average'
    ELSE 'Below Average'
  END AS performance
FROM (
  SELECT region, AVG(units * price) AS avg_order_value
  FROM orders
  WHERE status = 'Completed'
  GROUP BY region
) AS region_summary
CROSS JOIN (
  SELECT AVG(units * price) AS overall_avg
  FROM orders
  WHERE status = 'Completed'
) AS company_avg
ORDER BY avg_order_value DESC;`,
    expectedCols:["region","avg_order_value","overall_avg","difference","performance"],
  },
];

const aiSQLTools = [
  {
    name:"GitHub Copilot (in VS Code)", icon:"🤖", color:"#6E40C9",
    how:"Type a comment describing what you want → Copilot writes the SQL query as you type",
    prompts:[
      "-- Select all customers who signed up in the last 30 days",
      "-- Count orders grouped by region and category, only completed orders",
      "-- Find customers with total spend above $500 and at least 3 orders",
    ],
    tip:"Write your comment in plain English first. Tab to accept Copilot's suggestion. Then read every line before running it.",
    setup:"Install GitHub Copilot extension in VS Code. Connect a .sql file. Start typing a comment.",
  },
  {
    name:"ChatGPT / Claude for SQL", icon:"💬", color:"#10A37F",
    how:"Describe your table schema and what you want → AI writes the full query and explains every clause",
    prompts:[
      '"I have a table called orders with columns: id, customer_id, product, revenue, status, order_date, region. Write a query to find the top 3 products by total revenue for completed orders in each region."',
      '"My SQL query is returning more rows than expected. Here it is: [paste query]. What might be wrong?"',
      '"Explain what this query does line by line: [paste query]. Use simple language."',
    ],
    tip:"Always paste your schema (table name + column names) into the prompt. Without schema context, AI guesses column names and may get them wrong.",
    setup:"No setup. Use chatgpt.com or claude.ai. Always paste schema first.",
  },
  {
    name:"SQLAI.ai", icon:"⚡", color:"#FFD54F",
    how:"Connect your database schema → type a question in English → get SQL instantly",
    prompts:[
      "Show me total revenue by product category for this year",
      "Which customers have not placed an order in the last 90 days?",
      "Compare this month's sales to last month across all regions",
    ],
    tip:"Best for quick queries when you know what you want but not how to write it. Always test the output on a small dataset first.",
    setup:"sqlai.ai — free tier available. Paste your schema or connect a database.",
  },
];

const commonMistakes = [
  { mistake:"Using WHERE instead of HAVING with aggregates",    color:"#FF8A65", fix:'WHERE revenue > 1000 → ERROR if revenue = SUM(...)\nFix: HAVING SUM(revenue) > 1000', },
  { mistake:"Forgetting ON clause in JOIN (produces CROSS JOIN)",color:"#FF8A65", fix:"FROM orders JOIN customers → returns every order × every customer\nFix: INNER JOIN customers ON orders.customer_id = customers.id", },
  { mistake:"SELECT * in JOINs — ambiguous column names",        color:"#FFD54F", fix:"SELECT * with two tables having 'id' → error or wrong column\nFix: SELECT o.id, c.name — always qualify with alias", },
  { mistake:"GROUP BY missing columns from SELECT",              color:"#FFD54F", fix:"SELECT region, product, SUM(rev) GROUP BY region → error\nFix: GROUP BY region, product — all non-aggregate SELECTs must be in GROUP BY", },
  { mistake:"NULL comparisons using = instead of IS NULL",       color:"#CE93D8", fix:"WHERE phone = NULL → returns 0 rows always\nFix: WHERE phone IS NULL", },
  { mistake:"Trusting AI SQL without checking row counts",       color:"#CE93D8", fix:"Always run SELECT COUNT(*) before and after a JOIN\nCheck: does the output row count make sense for your data?", },
];

const sections = [
  { id:"intro",      label:"Overview"      },
  { id:"anatomy",    label:"SQL Anatomy"   },
  { id:"select",     label:"SELECT & WHERE"},
  { id:"aggregate",  label:"GROUP BY"      },
  { id:"joins",      label:"JOINs"         },
  { id:"subqueries", label:"Subqueries"    },
  { id:"practice",   label:"🔨 Practice"   },
  { id:"aitools",    label:"🤖 AI + SQL"   },
  { id:"quiz",       label:"🧠 Quiz"       },
];

// ─── MAIN COMPONENT ───────────────────────────────────────────
export default function Phase2Part1() {
  const [activeSection, setActiveSection] = useState("intro");
  const [expandedJoin,  setExpandedJoin]  = useState(null);
  const [expandedSub,   setExpandedSub]   = useState(null);
  const [expandedPQ,    setExpandedPQ]    = useState(null);
  const [expandedAI,    setExpandedAI]    = useState(null);
  const [quizState, setQuizState] = useState({ idx:0, selected:null, answered:false, score:0, done:false });

  const handleAnswer = (i) => {
    if (quizState.answered) return;
    const correct = i === quizQuestions[quizState.idx].answer;
    setQuizState(s => ({ ...s, selected:i, answered:true, score: s.score + (correct ? 1 : 0) }));
  };
  const nextQ = () => {
    const next = quizState.idx + 1;
    if (next >= quizQuestions.length) setQuizState(s => ({ ...s, done:true }));
    else setQuizState(s => ({ ...s, idx:next, selected:null, answered:false }));
  };

  return (
    <div style={{ minHeight:"100vh", background:"#07070E", color:"#DDD8F0", fontFamily:"Georgia,'Times New Roman',serif" }}>

      {/* NAV */}
      <div style={{ background:"#0A0A14", borderBottom:"1px solid #16162A", padding:"0 24px", position:"sticky", top:0, zIndex:100 }}>
        <div style={{ maxWidth:920, margin:"0 auto", display:"flex", alignItems:"center", overflowX:"auto" }}>
          <div style={{ fontSize:10, color:"#FFD54F", letterSpacing:"0.22em", textTransform:"uppercase", padding:"14px 20px 14px 0", borderRight:"1px solid #1A1A2E", marginRight:12, whiteSpace:"nowrap" }}>
            P2 · PART 1
          </div>
          {sections.map(s => (
            <button key={s.id} onClick={() => setActiveSection(s.id)} style={{
              background:"none", border:"none", cursor:"pointer",
              padding:"14px 11px", fontFamily:"inherit", fontSize:11,
              letterSpacing:"0.07em",
              color: activeSection === s.id ? "#FFD54F" : "#444",
              borderBottom: activeSection === s.id ? "2px solid #FFD54F" : "2px solid transparent",
              transition:"all 0.2s", whiteSpace:"nowrap",
            }}>{s.label}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth:920, margin:"0 auto", padding:"48px 24px 100px" }}>

        {/* ── INTRO ── */}
        {activeSection === "intro" && (
          <div>
            <div style={{ marginBottom:52, borderLeft:"3px solid #FFD54F", paddingLeft:24 }}>
              <div style={{ fontSize:10, color:"#FFD54F", letterSpacing:"0.3em", textTransform:"uppercase", marginBottom:12 }}>
                PHASE 2 · PART 1 OF 4 · WEEK 4
              </div>
              <h1 style={{ fontSize:"clamp(26px,5vw,46px)", fontWeight:900, margin:"0 0 16px", lineHeight:1.12, letterSpacing:"-0.02em" }}>
                SQL Fundamentals<br />
                <span style={{ color:"#FFD54F" }}>for Data Analytics</span><br />
                <span style={{ fontStyle:"italic", fontWeight:400, fontSize:"0.65em", color:"#555" }}>The language every database speaks</span>
              </h1>
              <p style={{ fontSize:14, color:"#666", lineHeight:1.88, maxWidth:580, margin:"0 0 24px" }}>
                SQL (Structured Query Language) is the single most in-demand skill on every data analyst job posting. It's how you talk to databases — and databases are where all real business data lives. In this part you'll go from zero to writing analytical queries that answer real business questions, with AI accelerating every step.
              </p>
              <div style={{ display:"flex", flexWrap:"wrap", gap:10 }}>
                {["~5 hours","8 SQL clauses","4 JOIN types","Subqueries","6 practice queries","AI SQL tools","6-question quiz"].map(tag => (
                  <span key={tag} style={{ padding:"4px 12px", background:"rgba(255,213,79,0.08)", border:"1px solid rgba(255,213,79,0.2)", borderRadius:2, fontSize:11, color:"#FFD54F" }}>{tag}</span>
                ))}
              </div>
            </div>

            <SectionHeader num="00" title="What You'll Learn in Part 1" color="#FFD54F" />

            {/* Why SQL matters */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, margin:"24px 0 32px" }}>
              {[
                { stat:"#1", label:"Most requested skill in data analyst job postings", color:"#FFD54F" },
                { stat:"50+", label:"Years SQL has been the standard — it's not going away", color:"#4FC3F7" },
                { stat:"10×", label:"Faster than Excel for querying millions of rows", color:"#81C784" },
              ].map((s,i) => (
                <div key={i} style={{ border:`1px solid ${s.color}33`, borderTop:`3px solid ${s.color}`, borderRadius:4, padding:"18px 16px", background:`${s.color}06`, textAlign:"center" }}>
                  <div style={{ fontSize:32, fontWeight:900, color:s.color, marginBottom:8 }}>{s.stat}</div>
                  <div style={{ fontSize:12, color:"#666", lineHeight:1.6 }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))", gap:10, margin:"0 0 36px" }}>
              {[
                { icon:"🔬", title:"SQL Anatomy",    desc:"8 clauses, written vs execution order, how SQL thinks", color:"#4FC3F7",  section:"anatomy"    },
                { icon:"⚙️", title:"SELECT & WHERE", desc:"Filtering rows, operators, NULL handling, pattern matching", color:"#81C784",  section:"select"     },
                { icon:"∑",  title:"GROUP BY",       desc:"Aggregations, HAVING, COUNT/SUM/AVG/MAX/MIN", color:"#FFD54F",  section:"aggregate"  },
                { icon:"⬡",  title:"JOINs",          desc:"INNER, LEFT, RIGHT, FULL OUTER — visual + SQL + business use", color:"#FF8A65",  section:"joins"      },
                { icon:"⊂",  title:"Subqueries",     desc:"Scalar, IN, derived tables, EXISTS — 4 patterns with examples", color:"#CE93D8",  section:"subqueries" },
                { icon:"🔨", title:"Practice (6x)",  desc:"Beginner → Advanced queries to write and run yourself",  color:"#F48FB1",  section:"practice"   },
                { icon:"🤖", title:"AI + SQL",       desc:"Copilot, ChatGPT, SQLAI — text-to-SQL tools and safe usage", color:"#6E40C9",  section:"aitools"    },
                { icon:"🧠", title:"Quiz (6Q)",      desc:"Test your SQL knowledge before Part 2",                   color:"#FFD54F",  section:"quiz"       },
              ].map((item, i) => (
                <div key={i} onClick={() => setActiveSection(item.section)} style={{
                  border:`1px solid ${item.color}33`, borderTop:`3px solid ${item.color}`,
                  borderRadius:4, padding:"14px", background:"#0D0D18",
                  cursor:"pointer", transition:"background 0.2s",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = `${item.color}08`}
                  onMouseLeave={e => e.currentTarget.style.background = "#0D0D18"}
                >
                  <div style={{ fontSize:20, marginBottom:8 }}>{item.icon}</div>
                  <div style={{ fontSize:13, fontWeight:700, color:"#DDD8F0", marginBottom:5 }}>{item.title}</div>
                  <div style={{ fontSize:11, color:"#444", lineHeight:1.6 }}>{item.desc}</div>
                </div>
              ))}
            </div>

            <Callout icon="🗄️" color="#FFD54F" title="Which SQL flavour are we using?">
              SQL has dialects — MySQL, PostgreSQL, SQLite, BigQuery SQL, T-SQL (SQL Server). The syntax in this lesson is <strong>standard SQL</strong>, compatible with 95% of databases. The tiny differences (e.g. LIMIT vs TOP, date functions) are noted where they matter. You'll learn BigQuery-specific SQL in Part 3 of this phase.
            </Callout>
            <NavButtons onNext={() => setActiveSection("anatomy")} />
          </div>
        )}

        {/* ── SQL ANATOMY ── */}
        {activeSection === "anatomy" && (
          <div>
            <SectionHeader num="01" title="SQL Anatomy — How a Query Is Built" color="#4FC3F7" />
            <Prose>
              Every SQL query is built from the same set of clauses, always written in the same order. Understanding what each clause does — and the difference between <Highlight>written order</Highlight> and <Highlight>execution order</Highlight> — is the foundation of debugging and writing correct SQL.
            </Prose>

            {/* Visual query */}
            <Subheading>A Complete Analytical Query</Subheading>
            <div style={{ background:"#07070E", border:"1px solid #1A1A2E", borderRadius:4, padding:"20px 22px", margin:"16px 0 28px", overflowX:"auto" }}>
              {[
                { clause:"SELECT",   code:"  region,",                                       color:"#4FC3F7" },
                { clause:"",         code:"  COUNT(*) AS total_orders,",                     color:"#4FC3F7" },
                { clause:"",         code:"  SUM(units * price) AS total_revenue,",          color:"#4FC3F7" },
                { clause:"",         code:"  AVG(units * price) AS avg_order_value",         color:"#4FC3F7" },
                { clause:"FROM",     code:"  orders",                                        color:"#81C784" },
                { clause:"JOIN",     code:"  sales_reps ON orders.rep_id = sales_reps.id",   color:"#FFD54F" },
                { clause:"WHERE",    code:"  status = 'Completed'",                          color:"#FF8A65" },
                { clause:"",         code:"  AND YEAR(order_date) = 2024",                   color:"#FF8A65" },
                { clause:"GROUP BY", code:"  region",                                        color:"#CE93D8" },
                { clause:"HAVING",   code:"  SUM(units * price) > 5000",                    color:"#F48FB1" },
                { clause:"ORDER BY", code:"  total_revenue DESC",                            color:"#80DEEA" },
                { clause:"LIMIT",    code:"  10;",                                           color:"#A5D6A7" },
              ].map((line, i) => (
                <div key={i} style={{ display:"flex", gap:0, marginBottom:2 }}>
                  <span style={{ width:80, fontSize:12, color: line.color, fontFamily:"monospace", fontWeight:700, flexShrink:0, opacity: line.clause ? 1 : 0 }}>{line.clause}</span>
                  <span style={{ fontSize:13, color:"#AAA", fontFamily:"monospace", lineHeight:1.7 }}>{line.code}</span>
                </div>
              ))}
            </div>

            {/* Clause table */}
            <Subheading>The 8 Clauses — Written Order vs. Execution Order</Subheading>
            <div style={{ border:"1px solid #1A1A2E", borderRadius:4, overflow:"hidden", margin:"16px 0 32px" }}>
              <div style={{ display:"grid", gridTemplateColumns:"90px 1fr 2fr 60px", gap:12, padding:"10px 16px", background:"#0D0D18", borderBottom:"1px solid #1A1A2E" }}>
                {["Clause","What it does","Example","Exec #"].map(h => (
                  <span key={h} style={{ fontSize:9, color:"#555", letterSpacing:"0.15em", fontFamily:"monospace", textTransform:"uppercase" }}>{h}</span>
                ))}
              </div>
              {selectClauses.map((c, i) => (
                <div key={i} style={{ display:"grid", gridTemplateColumns:"90px 1fr 2fr 60px", gap:12, padding:"11px 16px", alignItems:"center", borderBottom: i < selectClauses.length-1 ? "1px solid #0F0F18":"none", background: i%2===0 ? "#0A0A14":"#07070E" }}>
                  <span style={{ fontSize:13, color:c.color, fontFamily:"monospace", fontWeight:700 }}>{c.clause}</span>
                  <span style={{ fontSize:12, color:"#777" }}>{c.role}</span>
                  <code style={{ fontSize:11, color:"#555", fontFamily:"monospace" }}>{c.example}</code>
                  <span style={{ fontSize:11, color:c.color, fontFamily:"monospace", textAlign:"center" }}>{c.exec}</span>
                </div>
              ))}
            </div>

            <Callout icon="⚡" color="#FF8A65" title="The Most Important Thing About SQL Execution Order">
              SQL executes in this order: <strong>FROM → JOIN → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT</strong>.<br /><br />
              This is why you <strong>cannot use a SELECT alias in a WHERE clause</strong> — WHERE runs before SELECT.<br />
              And why <strong>HAVING</strong> (not WHERE) must filter aggregates — aggregates only exist after GROUP BY.<br /><br />
              When a query breaks, trace through execution order. 9/10 bugs happen because of order confusion.
            </Callout>

            <NavButtons onPrev={() => setActiveSection("intro")} onNext={() => setActiveSection("select")} />
          </div>
        )}

        {/* ── SELECT & WHERE ── */}
        {activeSection === "select" && (
          <div>
            <SectionHeader num="02" title="SELECT, FROM, WHERE — The Core Filter" color="#81C784" />
            <Prose>
              Every SQL query starts with SELECT, FROM, and WHERE. These three clauses alone let you answer the majority of basic business questions — filter a table, pick the columns you need, and sort the result.
            </Prose>

            <Subheading>SELECT Essentials</Subheading>
            <div style={{ background:"#07070E", border:"1px solid #1A1A2E", borderRadius:4, padding:"18px 20px", margin:"16px 0 24px", overflowX:"auto" }}>
              <div style={{ fontSize:9, color:"#555", fontFamily:"monospace", letterSpacing:"0.15em", marginBottom:12 }}>SELECT PATTERNS</div>
              {[
                { code:"SELECT * FROM orders;",                                            note:"All columns — avoid in production, slow and fragile" },
                { code:"SELECT id, product, revenue FROM orders;",                         note:"Specific columns only — always prefer this" },
                { code:"SELECT id, units * price AS revenue FROM orders;",                 note:"Calculated column with alias (AS)" },
                { code:"SELECT DISTINCT region FROM orders;",                              note:"Unique values only — like Excel's Remove Duplicates" },
                { code:"SELECT *, UPPER(region) AS region_upper FROM orders;",             note:"All columns + a new derived column" },
                { code:"SELECT COUNT(*) AS total_rows FROM orders;",                       note:"Count all rows — sanity check your data" },
              ].map((r, i) => (
                <div key={i} style={{ display:"flex", gap:16, alignItems:"flex-start", marginBottom:8, flexWrap:"wrap" }}>
                  <code style={{ fontSize:12, color:"#81C784", fontFamily:"monospace", minWidth:320, flexShrink:0 }}>{r.code}</code>
                  <span style={{ fontSize:11, color:"#444", fontStyle:"italic" }}>— {r.note}</span>
                </div>
              ))}
            </div>

            <Subheading>WHERE Operators — Complete Reference</Subheading>
            <div style={{ border:"1px solid #1A1A2E", borderRadius:4, overflow:"hidden", margin:"16px 0 28px" }}>
              {filterOperators.map((op, i) => (
                <div key={i} style={{ display:"grid", gridTemplateColumns:"120px 1fr 1fr", gap:12, padding:"10px 16px", borderBottom: i < filterOperators.length-1 ? "1px solid #0F0F18":"none", background: i%2===0 ? "#0A0A14":"#07070E", alignItems:"center" }}>
                  <code style={{ fontSize:13, color:op.color, fontFamily:"monospace", fontWeight:700 }}>{op.op}</code>
                  <span style={{ fontSize:12, color:"#777" }}>{op.use}</span>
                  <code style={{ fontSize:11, color:"#555", fontFamily:"monospace" }}>{op.ex}</code>
                </div>
              ))}
            </div>

            <Subheading>LIKE Pattern Matching</Subheading>
            <div style={{ background:"#07070E", border:"1px solid #1A1A2E", borderRadius:4, padding:"16px 18px", margin:"0 0 24px", overflowX:"auto" }}>
              {[
                { pattern:"LIKE 'A%'",       meaning:"Starts with A",              ex:"WHERE name LIKE 'A%' → Alice, Aaron, Anna" },
                { pattern:"LIKE '%com'",      meaning:"Ends with 'com'",            ex:"WHERE email LIKE '%com' → @gmail.com, @yahoo.com" },
                { pattern:"LIKE '%Pro%'",     meaning:"Contains 'Pro' anywhere",    ex:"WHERE product LIKE '%Pro%' → MacBook Pro, AirPods Pro" },
                { pattern:"LIKE 'ORD-00__'",  meaning:"_ matches exactly 1 char",  ex:"WHERE id LIKE 'ORD-00__' → ORD-0001 to ORD-0099" },
              ].map((r, i) => (
                <div key={i} style={{ display:"grid", gridTemplateColumns:"130px 180px 1fr", gap:12, marginBottom:6, alignItems:"center" }}>
                  <code style={{ fontSize:12, color:"#FF8A65", fontFamily:"monospace" }}>{r.pattern}</code>
                  <span style={{ fontSize:12, color:"#777" }}>{r.meaning}</span>
                  <code style={{ fontSize:11, color:"#444", fontFamily:"monospace" }}>{r.ex}</code>
                </div>
              ))}
            </div>

            <Callout icon="⚠️" color="#FFD54F" title="The NULL Trap — Most Common SQL Bug">
              <strong>NULL is not a value — it's the absence of a value.</strong><br />
              <code style={{ color:"#FFD54F" }}>WHERE phone = NULL</code> → always returns 0 rows. NULL cannot equal anything.<br />
              <code style={{ color:"#81C784" }}>WHERE phone IS NULL</code> → correctly finds rows with no phone.<br /><br />
              This catches out even experienced analysts. <strong>Any comparison with NULL returns UNKNOWN</strong> (not TRUE/FALSE), which SQL treats as FALSE in WHERE clauses.
            </Callout>

            <Callout icon="🤖" color="#6E40C9" title="AI Shortcut — WHERE Clause Builder">
              <em style={{ color:"#CE93D8" }}>"Write a SQL WHERE clause to filter orders where: region is North or South, status is Completed, order date is in Q4 2024, and revenue is above $500."</em><br />
              — ChatGPT or Copilot writes the multi-condition WHERE clause instantly. You verify the logic.
            </Callout>

            <NavButtons onPrev={() => setActiveSection("anatomy")} onNext={() => setActiveSection("aggregate")} />
          </div>
        )}

        {/* ── GROUP BY ── */}
        {activeSection === "aggregate" && (
          <div>
            <SectionHeader num="03" title="GROUP BY, HAVING & Aggregate Functions" color="#FFD54F" />
            <Prose>
              Aggregation is where SQL becomes a true analytical tool. <Highlight>GROUP BY collapses rows into groups</Highlight> — one row per unique value (or combination of values). Aggregate functions then calculate a metric for each group. This single pattern answers 70% of all business analytics questions.
            </Prose>

            <Subheading>The 6 Aggregate Functions</Subheading>
            <div style={{ display:"flex", flexDirection:"column", gap:8, margin:"16px 0 28px" }}>
              {aggregateFns.map((fn, i) => (
                <div key={i} style={{ display:"grid", gridTemplateColumns:"140px 1fr 1fr 1fr", gap:12, padding:"12px 16px", background: i%2===0 ? "#0A0A14":"#07070E", borderRadius:3, border:"1px solid #0F0F18", alignItems:"start" }}>
                  <code style={{ fontSize:13, color:fn.color, fontFamily:"monospace", fontWeight:700 }}>{fn.fn}</code>
                  <span style={{ fontSize:12, color:"#888", lineHeight:1.5 }}>{fn.returns}</span>
                  <span style={{ fontSize:11, color:"#555", fontStyle:"italic", lineHeight:1.5 }}>⚠️ {fn.nulls}</span>
                  <code style={{ fontSize:11, color:"#444", fontFamily:"monospace", lineHeight:1.5 }}>{fn.ex}</code>
                </div>
              ))}
            </div>

            <Subheading>GROUP BY — Step by Step</Subheading>
            <div style={{ background:"#07070E", border:"1px solid #1A1A2E", borderRadius:4, padding:"20px 22px", margin:"16px 0 24px", overflowX:"auto" }}>
              <div style={{ fontSize:9, color:"#555", fontFamily:"monospace", letterSpacing:"0.15em", marginBottom:12 }}>EXAMPLE — Revenue & Orders per Region, Completed Only</div>
              <div style={{ display:"grid", gridTemplateColumns:"90px 1fr", gap:2 }}>
                {[
                  { kw:"SELECT",   code:"  region,",                                        color:"#4FC3F7" },
                  { kw:"",         code:"  COUNT(*)              AS total_orders,",          color:"#4FC3F7" },
                  { kw:"",         code:"  SUM(units * price)    AS total_revenue,",         color:"#4FC3F7" },
                  { kw:"",         code:"  AVG(units * price)    AS avg_order_value,",       color:"#4FC3F7" },
                  { kw:"",         code:"  MAX(units * price)    AS biggest_order",          color:"#4FC3F7" },
                  { kw:"FROM",     code:"  orders",                                          color:"#81C784" },
                  { kw:"WHERE",    code:"  status = 'Completed'",                            color:"#FF8A65" },
                  { kw:"GROUP BY", code:"  region",                                          color:"#CE93D8" },
                  { kw:"HAVING",   code:"  SUM(units * price) > 5000",                       color:"#F48FB1" },
                  { kw:"ORDER BY", code:"  total_revenue DESC;",                             color:"#80DEEA" },
                ].map((line, i) => (
                  <div key={i} style={{ display:"contents" }}>
                    <span style={{ fontSize:12, color:line.color, fontFamily:"monospace", fontWeight:700, opacity: line.kw ? 1 : 0 }}>{line.kw}</span>
                    <span style={{ fontSize:13, color:"#AAA", fontFamily:"monospace", lineHeight:1.8 }}>{line.code}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Annotated result */}
            <div style={{ border:"1px solid #1A1A2E", borderRadius:4, overflow:"hidden", margin:"0 0 24px" }}>
              <div style={{ padding:"10px 16px", background:"#0D0D18", borderBottom:"1px solid #1A1A2E" }}>
                <span style={{ fontSize:10, color:"#555", fontFamily:"monospace", letterSpacing:"0.15em" }}>EXPECTED OUTPUT (example values)</span>
              </div>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12, fontFamily:"monospace" }}>
                <thead>
                  <tr style={{ background:"#0A0A14" }}>
                    {["region","total_orders","total_revenue","avg_order_value","biggest_order"].map(h => (
                      <th key={h} style={{ padding:"8px 14px", textAlign:"left", color:"#FFD54F", borderBottom:"1px solid #1A1A2E", fontWeight:700 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["North","9","$4,820","$535.56","$1,199"],
                    ["East", "8","$3,940","$492.50","$999"],
                    ["South","8","$3,710","$463.75","$899"],
                    ["West", "7","$2,140","$305.71","$599"],
                  ].map((row, i) => (
                    <tr key={i} style={{ background: i%2===0 ? "#07070E":"#0A0A14", borderBottom:"1px solid #0F0F18" }}>
                      {row.map((cell, j) => (
                        <td key={j} style={{ padding:"8px 14px", color: j===0?"#CE93D8":j===2?"#81C784":"#777" }}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ padding:"8px 14px", background:"#080811", fontSize:11, color:"#333" }}>
                WHERE filtered to Completed → GROUP BY created 4 rows → HAVING removed groups under $5,000 (removed West) → ORDER BY sorted by revenue.
              </div>
            </div>

            <Callout icon="🎯" color="#FFD54F" title="WHERE vs. HAVING — The Rule">
              <strong>WHERE</strong> filters <em>before</em> grouping — use for row-level conditions (status, date, region).<br />
              <strong>HAVING</strong> filters <em>after</em> grouping — use for aggregate conditions (SUM > X, COUNT > Y).<br /><br />
              Mental model: WHERE decides which rows enter the GROUP BY. HAVING decides which groups survive.
            </Callout>

            <NavButtons onPrev={() => setActiveSection("select")} onNext={() => setActiveSection("joins")} />
          </div>
        )}

        {/* ── JOINS ── */}
        {activeSection === "joins" && (
          <div>
            <SectionHeader num="04" title="JOINs — Combining Tables" color="#FF8A65" />
            <Prose>
              Real databases never store everything in one table. Customer names are in <code style={{ color:"#4FC3F7", fontFamily:"monospace" }}>customers</code>. Their orders are in <code style={{ color:"#4FC3F7", fontFamily:"monospace" }}>orders</code>. Products are in <code style={{ color:"#4FC3F7", fontFamily:"monospace" }}>products</code>. <Highlight>JOINs are how you connect these tables</Highlight> to answer questions that span multiple tables — which is almost every real analytics question.
            </Prose>

            <Callout icon="🔑" color="#FF8A65" title="The JOIN Golden Rule">
              Every JOIN needs an <strong>ON clause</strong> that specifies the relationship. The relationship is always between a <strong>primary key</strong> (unique ID in one table) and a <strong>foreign key</strong> (reference to that ID in another table).<br /><br />
              <code style={{ color:"#FF8A65", fontFamily:"monospace" }}>JOIN orders ON customers.id = orders.customer_id</code><br />
              customers.id = primary key &nbsp;·&nbsp; orders.customer_id = foreign key
            </Callout>

            <div style={{ display:"flex", flexDirection:"column", gap:10, margin:"28px 0" }}>
              {joinTypes.map((j, i) => {
                const open = expandedJoin === i;
                return (
                  <div key={i} style={{ border:`1px solid ${open ? j.color+"55":"#1A1A2E"}`, borderRadius:4, overflow:"hidden" }}>
                    <button onClick={() => setExpandedJoin(open ? null : i)} style={{
                      width:"100%", background: open ? `${j.color}0A`:"#0D0D18",
                      border:"none", cursor:"pointer", padding:"16px 20px",
                      display:"flex", alignItems:"center", gap:16,
                      fontFamily:"inherit", textAlign:"left", transition:"background 0.2s",
                    }}>
                      <span style={{ fontSize:24, color:j.color, flexShrink:0 }}>{j.icon}</span>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:15, fontWeight:700, color:"#DDD8F0" }}>{j.type}</div>
                        {!open && <div style={{ fontSize:12, color:"#555", marginTop:2 }}>{j.desc.substring(0,72)}...</div>}
                      </div>
                      <span style={{ color:j.color, fontSize:18, fontWeight:300, transform:open?"rotate(45deg)":"none", transition:"transform 0.2s" }}>+</span>
                    </button>
                    {open && (
                      <div style={{ padding:"0 20px 22px 60px", background:`${j.color}06` }}>
                        <div style={{ height:1, background:`${j.color}22`, margin:"0 0 18px" }} />
                        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:16 }}>
                          <div>
                            <Label color={j.color}>WHAT IT RETURNS</Label>
                            <p style={{ fontSize:13, color:"#AAA", margin:"6px 0 0", lineHeight:1.65 }}>{j.desc}</p>
                          </div>
                          <div>
                            <Label color={j.color}>USE WHEN</Label>
                            <p style={{ fontSize:13, color:"#AAA", margin:"6px 0 0", lineHeight:1.65 }}>{j.when}</p>
                          </div>
                        </div>
                        <div style={{ marginBottom:16 }}>
                          <Label color={j.color}>BUSINESS EXAMPLE</Label>
                          <p style={{ fontSize:13, color:"#888", margin:"6px 0 0", fontStyle:"italic", lineHeight:1.65 }}>{j.businessEx}</p>
                        </div>
                        <div style={{ background:"#07070E", border:`1px solid ${j.color}22`, borderRadius:3, padding:"14px 16px", marginBottom:14, overflowX:"auto" }}>
                          <Label color={j.color}>SQL EXAMPLE</Label>
                          <pre style={{ margin:"8px 0 0", fontSize:12, color:j.color, fontFamily:"monospace", lineHeight:1.7 }}>{j.sql}</pre>
                        </div>
                        <div style={{ display:"flex", gap:8, alignItems:"flex-start", background:"rgba(255,213,79,0.05)", border:"1px solid rgba(255,213,79,0.2)", borderRadius:3, padding:"10px 12px" }}>
                          <span>💡</span>
                          <span style={{ fontSize:12, color:"#FFD54F", lineHeight:1.6 }}>{j.warning}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* JOIN visual cheatsheet */}
            <Subheading>JOIN Visual Cheatsheet</Subheading>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, margin:"16px 0 28px" }}>
              {[
                { type:"INNER",      left:"A", right:"B", overlap:true,  leftFill:false, rightFill:false, color:"#4FC3F7", desc:"Only matching rows" },
                { type:"LEFT",       left:"A", right:"B", overlap:true,  leftFill:true,  rightFill:false, color:"#81C784", desc:"All A + matches in B" },
                { type:"RIGHT",      left:"A", right:"B", overlap:true,  leftFill:false, rightFill:true,  color:"#FFD54F", desc:"All B + matches in A" },
                { type:"FULL OUTER", left:"A", right:"B", overlap:true,  leftFill:true,  rightFill:true,  color:"#FF8A65", desc:"Everything from both" },
              ].map((v, i) => (
                <div key={i} style={{ border:`1px solid ${v.color}33`, borderRadius:4, padding:"16px 12px", background:"#0D0D18", textAlign:"center" }}>
                  <div style={{ fontSize:10, color:v.color, fontFamily:"monospace", letterSpacing:"0.1em", marginBottom:12 }}>{v.type} JOIN</div>
                  <div style={{ display:"flex", justifyContent:"center", alignItems:"center", height:44, marginBottom:12, position:"relative" }}>
                    <div style={{ width:36, height:36, borderRadius:"50%", border:`2px solid ${v.color}`, background: v.leftFill ? `${v.color}44`:"transparent", position:"absolute", left:"50%", transform:"translateX(-60%)" }} />
                    <div style={{ width:36, height:36, borderRadius:"50%", border:`2px solid ${v.color}`, background: v.rightFill ? `${v.color}44`:"transparent", position:"absolute", left:"50%", transform:"translateX(-40%)" }} />
                    <div style={{ position:"absolute", left:"50%", transform:"translateX(-50%)", width:12, height:36, background: v.overlap ? `${v.color}88`:"transparent", borderRadius:2 }} />
                  </div>
                  <div style={{ fontSize:11, color:"#666" }}>{v.desc}</div>
                </div>
              ))}
            </div>

            <NavButtons onPrev={() => setActiveSection("aggregate")} onNext={() => setActiveSection("subqueries")} />
          </div>
        )}

        {/* ── SUBQUERIES ── */}
        {activeSection === "subqueries" && (
          <div>
            <SectionHeader num="05" title="Subqueries — Queries Inside Queries" color="#CE93D8" />
            <Prose>
              A subquery is a <Highlight>complete SELECT statement nested inside another query</Highlight>. They let you use the result of one query as input to another — enabling multi-step logic within a single SQL statement. Master these four patterns and you can answer almost any complex business question.
            </Prose>

            <div style={{ display:"flex", flexDirection:"column", gap:10, margin:"28px 0" }}>
              {subqueryPatterns.map((s, i) => {
                const open = expandedSub === i;
                return (
                  <div key={i} style={{ border:`1px solid ${open ? s.color+"55":"#1A1A2E"}`, borderRadius:4, overflow:"hidden" }}>
                    <button onClick={() => setExpandedSub(open ? null : i)} style={{
                      width:"100%", background: open ? `${s.color}0A`:"#0D0D18",
                      border:"none", cursor:"pointer", padding:"14px 20px",
                      display:"flex", alignItems:"center", gap:16,
                      fontFamily:"inherit", textAlign:"left",
                    }}>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:15, fontWeight:700, color:"#DDD8F0" }}>{s.name}</div>
                        {!open && <div style={{ fontSize:12, color:"#555", marginTop:2 }}>{s.desc.substring(0,65)}...</div>}
                      </div>
                      <span style={{ color:s.color, fontSize:18, transform:open?"rotate(45deg)":"none", transition:"transform 0.2s" }}>+</span>
                    </button>
                    {open && (
                      <div style={{ padding:"0 20px 22px 20px", background:`${s.color}06` }}>
                        <div style={{ height:1, background:`${s.color}22`, margin:"0 0 16px" }} />
                        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:16 }}>
                          <div>
                            <Label color={s.color}>HOW IT WORKS</Label>
                            <p style={{ fontSize:13, color:"#AAA", margin:"6px 0 0", lineHeight:1.65 }}>{s.desc}</p>
                          </div>
                          <div>
                            <Label color={s.color}>BUSINESS USE CASES</Label>
                            <p style={{ fontSize:13, color:"#AAA", margin:"6px 0 0", lineHeight:1.65 }}>{s.useCase}</p>
                          </div>
                        </div>
                        <div style={{ background:"#07070E", border:`1px solid ${s.color}22`, borderRadius:3, padding:"14px 16px", marginBottom:14, overflowX:"auto" }}>
                          <Label color={s.color}>SQL</Label>
                          <pre style={{ margin:"8px 0 0", fontSize:12, color:s.color, fontFamily:"monospace", lineHeight:1.7 }}>{s.sql}</pre>
                        </div>
                        <div style={{ display:"flex", gap:8, alignItems:"flex-start", background:"rgba(255,213,79,0.05)", border:"1px solid rgba(255,213,79,0.2)", borderRadius:3, padding:"10px 12px" }}>
                          <span>💡</span>
                          <span style={{ fontSize:12, color:"#FFD54F", lineHeight:1.6 }}>{s.tip}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <Callout icon="🤖" color="#6E40C9" title="AI for Subqueries">
              Subqueries trip up even experienced analysts. When stuck:<br />
              <em style={{ color:"#CE93D8" }}>"I need a SQL query that [describe in plain English]. My tables are: orders (id, customer_id, revenue, status, date) and customers (id, name, email). Use a subquery to solve it."</em><br /><br />
              Then read the output line by line. Understanding the AI's subquery teaches you the pattern faster than any textbook.
            </Callout>

            <NavButtons onPrev={() => setActiveSection("joins")} onNext={() => setActiveSection("practice")} />
          </div>
        )}

        {/* ── PRACTICE ── */}
        {activeSection === "practice" && (
          <div>
            <SectionHeader num="06" title="Practice Queries — Write & Run These" color="#F48FB1" />
            <Prose>
              Reading SQL is not enough. You must <Highlight>write it, break it, and fix it</Highlight>. Use these 6 practice queries on the RetailCo dataset from Phase 1 (or any SQL tool with sample data). Each query has a scenario, a hint, and the solution — attempt it before revealing the answer.
            </Prose>

            <Callout icon="🛠️" color="#F48FB1" title="Where to Run These Queries">
              <strong>Option A:</strong> DB Browser for SQLite (free, desktop) — import the RetailCo CSV as a table.<br />
              <strong>Option B:</strong> Google BigQuery (free tier) — upload CSV to a dataset, run standard SQL.<br />
              <strong>Option C:</strong> SQLiteOnline.com — paste data, run queries in-browser, no install.<br />
              <strong>Option D:</strong> Paste the schema into ChatGPT and ask it to simulate running queries.
            </Callout>

            <div style={{ display:"flex", flexDirection:"column", gap:10, margin:"28px 0" }}>
              {practiceQueries.map((q, i) => {
                const open = expandedPQ === i;
                return (
                  <div key={i} style={{ border:`1px solid ${open ? q.color+"55":"#1A1A2E"}`, borderRadius:4, overflow:"hidden" }}>
                    <button onClick={() => setExpandedPQ(open ? null : i)} style={{
                      width:"100%", background: open ? `${q.color}0A`:"#0D0D18",
                      border:"none", cursor:"pointer", padding:"14px 20px",
                      display:"flex", alignItems:"center", gap:14,
                      fontFamily:"inherit", textAlign:"left",
                    }}>
                      <div style={{ display:"flex", flexDirection:"column", gap:4, flex:1 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                          <span style={{ fontSize:11, color:q.color, fontFamily:"monospace", background:`${q.color}18`, padding:"2px 8px", borderRadius:2, letterSpacing:"0.08em" }}>{q.badge} {q.level}</span>
                          <span style={{ fontSize:14, fontWeight:700, color:"#DDD8F0" }}>{q.title}</span>
                        </div>
                        {!open && <div style={{ fontSize:12, color:"#555" }}>{q.scenario.substring(0,65)}...</div>}
                      </div>
                      <span style={{ color:q.color, fontSize:18, transform:open?"rotate(45deg)":"none", transition:"transform 0.2s", flexShrink:0 }}>+</span>
                    </button>
                    {open && (
                      <div style={{ padding:"0 20px 22px 20px", background:`${q.color}06` }}>
                        <div style={{ height:1, background:`${q.color}22`, margin:"0 0 16px" }} />
                        <div style={{ marginBottom:14 }}>
                          <Label color={q.color}>SCENARIO</Label>
                          <p style={{ fontSize:13, color:"#AAA", margin:"6px 0 0", lineHeight:1.65 }}>{q.scenario}</p>
                        </div>
                        <div style={{ background:"rgba(255,213,79,0.05)", border:"1px solid rgba(255,213,79,0.2)", borderRadius:3, padding:"10px 14px", marginBottom:16 }}>
                          <Label color="#FFD54F">💡 HINT (try before revealing solution)</Label>
                          <p style={{ fontSize:12, color:"#888", margin:"6px 0 0", lineHeight:1.65 }}>{q.hint}</p>
                        </div>
                        <div style={{ background:"#07070E", border:`1px solid ${q.color}22`, borderRadius:3, padding:"14px 16px", marginBottom:14, overflowX:"auto" }}>
                          <Label color={q.color}>SOLUTION</Label>
                          <pre style={{ margin:"8px 0 0", fontSize:12, color:"#81C784", fontFamily:"monospace", lineHeight:1.75 }}>{q.solution}</pre>
                        </div>
                        <div>
                          <Label color="#555">EXPECTED COLUMNS IN OUTPUT</Label>
                          <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginTop:8 }}>
                            {q.expectedCols.map(col => (
                              <code key={col} style={{ padding:"3px 10px", background:"#0D0D18", border:"1px solid #1A1A2E", borderRadius:2, fontSize:11, color:"#888", fontFamily:"monospace" }}>{col}</code>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Common mistakes */}
            <Subheading>6 Common SQL Mistakes & How to Fix Them</Subheading>
            <div style={{ display:"flex", flexDirection:"column", gap:6, margin:"16px 0 28px" }}>
              {commonMistakes.map((m, i) => (
                <div key={i} style={{ border:`1px solid ${m.color}33`, borderRadius:3, padding:"12px 16px", background:"#0A0A14" }}>
                  <div style={{ fontSize:13, fontWeight:700, color:m.color, marginBottom:8 }}>❌ {m.mistake}</div>
                  <pre style={{ margin:0, fontSize:12, color:"#666", fontFamily:"monospace", lineHeight:1.7, whiteSpace:"pre-wrap" }}>{m.fix}</pre>
                </div>
              ))}
            </div>

            <NavButtons onPrev={() => setActiveSection("subqueries")} onNext={() => setActiveSection("aitools")} />
          </div>
        )}

        {/* ── AI TOOLS ── */}
        {activeSection === "aitools" && (
          <div>
            <SectionHeader num="07" title="AI Tools for SQL — Write Queries Faster" color="#6E40C9" />
            <Prose>
              AI has made SQL more accessible than ever. You can now describe what you want in plain English and get a complete, working query in seconds. But here's what separates analysts who thrive from those who struggle: <Highlight>AI writes the draft, you understand and validate it</Highlight>. A wrong query on production data causes real damage.
            </Prose>

            <div style={{ display:"flex", flexDirection:"column", gap:10, margin:"24px 0 32px" }}>
              {aiSQLTools.map((t, i) => {
                const open = expandedAI === i;
                return (
                  <div key={i} style={{ border:`1px solid ${open ? t.color+"44":"#1A1A2E"}`, borderRadius:4, overflow:"hidden" }}>
                    <button onClick={() => setExpandedAI(open ? null : i)} style={{
                      width:"100%", background: open ? `${t.color}08`:"#0D0D18",
                      border:"none", cursor:"pointer", padding:"16px 20px",
                      display:"flex", alignItems:"center", gap:14,
                      fontFamily:"inherit", textAlign:"left",
                    }}>
                      <span style={{ fontSize:24, flexShrink:0 }}>{t.icon}</span>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:15, fontWeight:700, color:"#DDD8F0" }}>{t.name}</div>
                        {!open && <div style={{ fontSize:12, color:"#555", marginTop:2 }}>{t.how.substring(0,65)}...</div>}
                      </div>
                      <span style={{ color:t.color, fontSize:18, transform:open?"rotate(45deg)":"none", transition:"transform 0.2s" }}>+</span>
                    </button>
                    {open && (
                      <div style={{ padding:"0 20px 22px 58px", background:`${t.color}06` }}>
                        <div style={{ height:1, background:`${t.color}22`, margin:"0 0 14px" }} />
                        <div style={{ marginBottom:14 }}>
                          <Label color={t.color}>HOW IT WORKS</Label>
                          <p style={{ fontSize:13, color:"#AAA", margin:"6px 0 0", lineHeight:1.65 }}>{t.how}</p>
                        </div>
                        <div style={{ marginBottom:14 }}>
                          <Label color={t.color}>EXAMPLE PROMPTS</Label>
                          <div style={{ display:"flex", flexDirection:"column", gap:6, marginTop:8 }}>
                            {t.prompts.map((p, j) => (
                              <div key={j} style={{ background:"#07070E", border:`1px solid ${t.color}22`, borderRadius:3, padding:"10px 12px" }}>
                                <code style={{ fontSize:12, color:t.color, fontFamily:"monospace", lineHeight:1.6 }}>{p}</code>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                          <div style={{ background:"rgba(255,213,79,0.05)", border:"1px solid rgba(255,213,79,0.2)", borderRadius:3, padding:"10px 12px" }}>
                            <Label color="#FFD54F">💡 PRO TIP</Label>
                            <p style={{ fontSize:12, color:"#888", margin:"6px 0 0", lineHeight:1.6 }}>{t.tip}</p>
                          </div>
                          <div style={{ background:"#0D0D18", border:"1px solid #1A1A2E", borderRadius:3, padding:"10px 12px" }}>
                            <Label color="#555">SETUP</Label>
                            <p style={{ fontSize:12, color:"#555", margin:"6px 0 0", lineHeight:1.6 }}>{t.setup}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* The AI SQL workflow */}
            <Subheading>The Safe AI SQL Workflow</Subheading>
            <div style={{ border:"1px solid #1A1A2E", borderRadius:4, overflow:"hidden", margin:"16px 0 28px" }}>
              {[
                { step:"01", action:"Describe the business question clearly in writing", why:"Vague question = vague query. 'Show me sales' is useless. 'Show total revenue by region for completed orders in 2024' is precise.", color:"#4FC3F7" },
                { step:"02", action:"Paste your schema into the AI prompt", why:"Table names + column names + data types. Without this, AI invents column names that don't exist.", color:"#81C784" },
                { step:"03", action:"Let AI generate the query", why:"Read every clause. Don't just run it. Understand what each line does.", color:"#FFD54F" },
                { step:"04", action:"Run SELECT COUNT(*) first", why:"Check: does the FROM + JOIN return the right number of rows before you add aggregates?", color:"#FF8A65" },
                { step:"05", action:"Test on a LIMIT 10 slice first", why:"Add LIMIT 10 to any query before running on full data. Validate the shape looks right.", color:"#CE93D8" },
                { step:"06", action:"Validate one known answer", why:"Pick a row you know the answer to (e.g. Alice Morgan's total from your Excel work). Does SQL match?", color:"#F48FB1" },
                { step:"07", action:"Remove LIMIT, run the full query", why:"Only run full query after validation. AI-generated SQL on unvalidated schemas on production = data incidents.", color:"#6E40C9" },
              ].map((w, i, arr) => (
                <div key={i} style={{ display:"flex", gap:14, padding:"12px 18px", borderBottom: i < arr.length-1 ? "1px solid #0F0F18":"none", background: i%2===0 ? "#0A0A14":"#07070E", alignItems:"flex-start" }}>
                  <div style={{ width:28, height:28, borderRadius:"50%", background:`${w.color}15`, border:`1px solid ${w.color}44`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <span style={{ fontSize:10, color:w.color, fontFamily:"monospace", fontWeight:700 }}>{w.step}</span>
                  </div>
                  <div style={{ flex:1, fontSize:13, color:"#AAA", lineHeight:1.5 }}>{w.action}</div>
                  <div style={{ fontSize:11, color:"#444", maxWidth:260, fontStyle:"italic", lineHeight:1.5 }}>{w.why}</div>
                </div>
              ))}
            </div>

            <NavButtons onPrev={() => setActiveSection("practice")} onNext={() => setActiveSection("quiz")} nextLabel="Take the Quiz →" />
          </div>
        )}

        {/* ── QUIZ ── */}
        {activeSection === "quiz" && (
          <div>
            <SectionHeader num="08" title="Part 1 Knowledge Check" color="#FFD54F" />
            <Prose>6 SQL questions — covering clauses, JOINs, aggregation, and subqueries. Score 4+ to proceed to Part 2.</Prose>

            {!quizState.done ? (
              <div style={{ margin:"28px 0" }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:20 }}>
                  <span style={{ fontSize:11, color:"#555", fontFamily:"monospace", letterSpacing:"0.15em" }}>QUESTION {quizState.idx+1} / {quizQuestions.length}</span>
                  <span style={{ fontSize:11, color:"#FFD54F", fontFamily:"monospace" }}>SCORE: {quizState.score} / {quizState.idx}</span>
                </div>
                <div style={{ height:3, background:"#1A1A2E", borderRadius:2, marginBottom:28, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${(quizState.idx/quizQuestions.length)*100}%`, background:"linear-gradient(90deg,#FFD54F,#FF8A65)", transition:"width 0.4s" }} />
                </div>

                <div style={{ fontSize:15, fontWeight:700, color:"#DDD8F0", lineHeight:1.65, marginBottom:24, fontFamily:"Georgia,serif" }}>
                  {quizQuestions[quizState.idx].q.split("\n").map((line, i) => (
                    <span key={i}>
                      {line.startsWith("SELECT") || line.startsWith("FROM") || line.startsWith("WHERE") || line.startsWith("GROUP") || line.startsWith("ORDER")
                        ? <code style={{ display:"block", fontSize:12, color:"#81C784", fontFamily:"monospace", background:"#07070E", padding:"8px 12px", borderRadius:3, margin:"8px 0", lineHeight:1.7 }}>{line}</code>
                        : <span style={{ display:"block" }}>{line}</span>
                      }
                    </span>
                  ))}
                </div>

                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {quizQuestions[quizState.idx].options.map((opt, i) => {
                    const isSelected = quizState.selected === i;
                    const isCorrect  = i === quizQuestions[quizState.idx].answer;
                    let bg = "#0D0D18", border = "#1A1A2E", col = "#888";
                    if (quizState.answered) {
                      if (isCorrect) { bg="rgba(129,199,132,0.08)"; border="#81C784"; col="#81C784"; }
                      else if (isSelected && !isCorrect) { bg="rgba(255,100,100,0.08)"; border="#FF6464"; col="#FF6464"; }
                    } else if (isSelected) { bg="rgba(255,213,79,0.06)"; border="#FFD54F"; col="#FFD54F"; }
                    return (
                      <button key={i} onClick={() => handleAnswer(i)} style={{
                        background:bg, border:`1px solid ${border}`, borderRadius:4,
                        padding:"13px 18px", cursor:quizState.answered?"default":"pointer",
                        textAlign:"left", fontFamily:"inherit", fontSize:13,
                        color:col, lineHeight:1.5, transition:"all 0.2s",
                      }}>
                        <span style={{ marginRight:10, fontFamily:"monospace", fontSize:11 }}>{String.fromCharCode(65+i)}.</span>
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {quizState.answered && (
                  <div style={{ margin:"20px 0 0", padding:"14px 18px", background:"rgba(255,213,79,0.04)", border:"1px solid rgba(255,213,79,0.18)", borderRadius:4 }}>
                    <div style={{ fontSize:10, color:"#FFD54F", letterSpacing:"0.15em", marginBottom:6, fontFamily:"monospace" }}>EXPLANATION</div>
                    <p style={{ fontSize:13, color:"#888", margin:"0 0 16px", lineHeight:1.7 }}>
                      {quizQuestions[quizState.idx].explanation}
                    </p>
                    <button onClick={nextQ} style={{ background:"#FFD54F", border:"none", borderRadius:3, padding:"8px 20px", cursor:"pointer", fontFamily:"monospace", fontSize:11, fontWeight:700, letterSpacing:"0.1em", color:"#07070E" }}>
                      {quizState.idx < quizQuestions.length-1 ? "NEXT QUESTION →" : "SEE RESULTS →"}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ margin:"28px 0", textAlign:"center" }}>
                <div style={{ fontSize:60, marginBottom:12 }}>
                  {quizState.score >= 5 ? "🏆" : quizState.score >= 4 ? "✅" : "📚"}
                </div>
                <div style={{ fontSize:44, fontWeight:900, marginBottom:8, color: quizState.score>=5?"#81C784":quizState.score>=4?"#FFD54F":"#FF8A65" }}>
                  {quizState.score} / {quizQuestions.length}
                </div>
                <div style={{ fontSize:15, color:"#666", marginBottom:28 }}>
                  {quizState.score===6 ? "SQL fundamentals mastered. On to Part 2 — Advanced SQL." : quizState.score>=4 ? "Good foundation. Review the sections you dropped marks on." : "Revisit JOINs and GROUP BY sections before Part 2."}
                </div>
                <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap" }}>
                  <button onClick={() => setQuizState({ idx:0, selected:null, answered:false, score:0, done:false })} style={{ background:"none", border:"1px solid #333", borderRadius:3, padding:"8px 20px", cursor:"pointer", fontFamily:"monospace", fontSize:11, color:"#555", letterSpacing:"0.1em" }}>RETAKE</button>
                  <button onClick={() => setActiveSection("intro")} style={{ background:"#FFD54F", border:"none", borderRadius:3, padding:"8px 24px", cursor:"pointer", fontFamily:"monospace", fontSize:11, fontWeight:700, color:"#07070E", letterSpacing:"0.1em" }}>REVIEW ↑</button>
                </div>

                <div style={{ marginTop:40, padding:"22px", background:"#0D0D18", border:"1px solid #1A1A2E", borderRadius:4, textAlign:"left" }}>
                  <div style={{ fontSize:11, color:"#555", letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:10, fontFamily:"monospace" }}>WHAT'S IN PART 2 →</div>
                  <div style={{ fontSize:15, fontWeight:700, color:"#DDD8F0", marginBottom:8 }}>Advanced SQL — Window Functions, CTEs & Query Optimisation</div>
                  <p style={{ fontSize:13, color:"#555", lineHeight:1.7, margin:"0 0 14px" }}>
                    ROW_NUMBER, RANK, DENSE_RANK, LEAD, LAG, NTILE — the window functions that power cohort analysis, running totals, and rankings. Plus CTEs (WITH clauses) for readable multi-step queries, and query performance basics.
                  </p>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                    {["Window Functions","ROW_NUMBER / RANK","LEAD / LAG","CTEs (WITH clause)","Query Optimisation","GitHub Copilot SQL"].map(t => (
                      <span key={t} style={{ padding:"3px 10px", background:"rgba(255,213,79,0.07)", border:"1px solid rgba(255,213,79,0.2)", borderRadius:2, fontSize:11, color:"#FFD54F" }}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <NavButtons onPrev={() => setActiveSection("aitools")} />
          </div>
        )}

      </div>
    </div>
  );
}

// ─── SHARED COMPONENTS ────────────────────────────────────────
function SectionHeader({ num, title, color }) {
  return (
    <div style={{ marginBottom:28, paddingBottom:16, borderBottom:"1px solid #1A1A2E" }}>
      <div style={{ fontSize:10, color, letterSpacing:"0.3em", fontFamily:"monospace", marginBottom:6 }}>SECTION {num}</div>
      <h2 style={{ margin:0, fontSize:"clamp(20px,3vw,28px)", fontWeight:900, color:"#DDD8F0", letterSpacing:"-0.01em" }}>
        <span style={{ color }}>{num}. </span>{title}
      </h2>
    </div>
  );
}
function Subheading({ children }) {
  return <h3 style={{ fontSize:16, fontWeight:700, color:"#DDD8F0", margin:"32px 0 12px", borderLeft:"3px solid #FFD54F", paddingLeft:12 }}>{children}</h3>;
}
function Prose({ children }) {
  return <p style={{ fontSize:14, color:"#666", lineHeight:1.88, margin:"0 0 16px" }}>{children}</p>;
}
function Highlight({ children }) {
  return <strong style={{ color:"#DDD8F0", fontWeight:700 }}>{children}</strong>;
}
function Label({ color, children }) {
  return <div style={{ fontSize:9, color, letterSpacing:"0.18em", textTransform:"uppercase", fontFamily:"monospace", fontWeight:700 }}>{children}</div>;
}
function Callout({ icon, color, title, children }) {
  return (
    <div style={{ margin:"20px 0", padding:"14px 18px", background:`${color}07`, border:`1px solid ${color}30`, borderLeft:`3px solid ${color}`, borderRadius:4 }}>
      <div style={{ fontSize:12, color, fontWeight:700, marginBottom:8, display:"flex", gap:8, alignItems:"center" }}>
        <span>{icon}</span>{title}
      </div>
      <div style={{ fontSize:13, color:"#666", lineHeight:1.82 }}>{children}</div>
    </div>
  );
}
function NavButtons({ onPrev, onNext, nextLabel="Next Section →" }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", marginTop:48, paddingTop:24, borderTop:"1px solid #1A1A2E" }}>
      {onPrev
        ? <button onClick={onPrev} style={{ background:"none", border:"1px solid #1A1A2E", borderRadius:3, padding:"8px 18px", cursor:"pointer", fontFamily:"monospace", fontSize:11, color:"#555", letterSpacing:"0.1em" }}>← Previous</button>
        : <div />}
      {onNext && (
        <button onClick={onNext} style={{ background:"#FFD54F", border:"none", borderRadius:3, padding:"8px 24px", cursor:"pointer", fontFamily:"monospace", fontSize:11, fontWeight:700, color:"#07070E", letterSpacing:"0.1em" }}>{nextLabel}</button>
      )}
    </div>
  );
}
