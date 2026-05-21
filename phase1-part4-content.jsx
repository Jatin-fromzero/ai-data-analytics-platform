import { useState } from "react";

// ─── DATASET ──────────────────────────────────────────────────
const sampleData = [
  { id:"ORD-0001", date:"2024-01-03", region:"North", rep:"Alice Morgan",   category:"Electronics", product:"Wireless Headphones", units:3,  price:89.99,  cost:42.00, status:"Completed" },
  { id:"ORD-0002", date:"2024-01-05", region:"South", rep:"Ben Carter",     category:"Clothing",    product:"Winter Jacket",       units:2,  price:129.99, cost:58.00, status:"Completed" },
  { id:"ORD-0003", date:"2024-01-07", region:"East",  rep:"Clara Davis",    category:"Electronics", product:"Bluetooth Speaker",   units:1,  price:59.99,  cost:22.00, status:"Returned"  },
  { id:"ORD-0004", date:"2024-01-10", region:"West",  rep:"David Evans",    category:"Home",        product:"Coffee Maker",        units:4,  price:49.99,  cost:19.00, status:"Completed" },
  { id:"ORD-0005", date:"2024-01-12", region:"North", rep:"Alice Morgan",   category:"Clothing",    product:"Running Shoes",       units:1,  price:94.99,  cost:38.00, status:"Completed" },
  { id:"ORD-0006", date:"2024-02-01", region:"South", rep:"Ben Carter",     category:"Home",        product:"Air Purifier",        units:2,  price:199.99, cost:88.00, status:"Completed" },
  { id:"ORD-0007", date:"2024-02-08", region:"East",  rep:"Clara Davis",    category:"Electronics", product:"Smart Watch",         units:5,  price:249.99, cost:110.00,status:"Completed" },
  { id:"ORD-0008", date:"2024-02-14", region:"West",  rep:"Fiona Grant",    category:"Clothing",    product:"Yoga Pants",          units:3,  price:44.99,  cost:16.00, status:"Returned"  },
  { id:"ORD-0009", date:"2024-02-20", region:"North", rep:"Alice Morgan",   category:"Home",        product:"Robot Vacuum",        units:2,  price:299.99, cost:135.00,status:"Completed" },
  { id:"ORD-0010", date:"2024-03-03", region:"South", rep:"Ben Carter",     category:"Electronics", product:"Laptop Stand",        units:6,  price:39.99,  cost:12.00, status:"Completed" },
  { id:"ORD-0011", date:"2024-03-10", region:"East",  rep:"Clara Davis",    category:"Clothing",    product:"Linen Shirt",         units:4,  price:34.99,  cost:11.00, status:"Completed" },
  { id:"ORD-0012", date:"2024-03-18", region:"West",  rep:"David Evans",    category:"Home",        product:"Desk Lamp",           units:3,  price:29.99,  cost:9.00,  status:"Completed" },
  { id:"ORD-0013", date:"2024-03-25", region:"North", rep:"Fiona Grant",    category:"Electronics", product:"USB-C Hub",           units:10, price:24.99,  cost:8.00,  status:"Completed" },
  { id:"ORD-0014", date:"2024-04-02", region:"South", rep:"Ben Carter",     category:"Home",        product:"Plant Pot Set",       units:5,  price:19.99,  cost:6.00,  status:"Returned"  },
  { id:"ORD-0015", date:"2024-04-11", region:"East",  rep:"Clara Davis",    category:"Electronics", product:"Ring Light",          units:2,  price:54.99,  cost:18.00, status:"Completed" },
  { id:"ORD-0016", date:"2024-04-20", region:"West",  rep:"David Evans",    category:"Clothing",    product:"Denim Jeans",         units:3,  price:64.99,  cost:24.00, status:"Completed" },
  { id:"ORD-0017", date:"2024-05-05", region:"North", rep:"Alice Morgan",   category:"Home",        product:"Scented Candles",     units:8,  price:14.99,  cost:4.00,  status:"Completed" },
  { id:"ORD-0018", date:"2024-05-14", region:"South", rep:"Fiona Grant",    category:"Electronics", product:"Portable Charger",   units:7,  price:34.99,  cost:11.00, status:"Completed" },
  { id:"ORD-0019", date:"2024-05-22", region:"East",  rep:"Clara Davis",    category:"Clothing",    product:"Hoodie",             units:4,  price:54.99,  cost:20.00, status:"Completed" },
  { id:"ORD-0020", date:"2024-06-03", region:"West",  rep:"David Evans",    category:"Home",        product:"Throw Blanket",       units:6,  price:39.99,  cost:14.00, status:"Returned"  },
  { id:"ORD-0021", date:"2024-06-12", region:"North", rep:"Alice Morgan",   category:"Electronics", product:"Webcam HD",           units:3,  price:79.99,  cost:28.00, status:"Completed" },
  { id:"ORD-0022", date:"2024-06-20", region:"South", rep:"Ben Carter",     category:"Clothing",    product:"Formal Suit",         units:1,  price:299.99, cost:130.00,status:"Completed" },
  { id:"ORD-0023", date:"2024-07-04", region:"East",  rep:"Fiona Grant",    category:"Home",        product:"Air Fryer",           units:2,  price:89.99,  cost:36.00, status:"Completed" },
  { id:"ORD-0024", date:"2024-07-15", region:"West",  rep:"David Evans",    category:"Electronics", product:"Noise Cancelling Earbuds",units:4,price:119.99,cost:48.00,status:"Completed"},
  { id:"ORD-0025", date:"2024-07-28", region:"North", rep:"Alice Morgan",   category:"Clothing",    product:"Sports Shorts",       units:5,  price:24.99,  cost:8.00,  status:"Returned"  },
  { id:"ORD-0026", date:"2024-08-06", region:"South", rep:"Ben Carter",     category:"Home",        product:"Blender",             units:3,  price:69.99,  cost:26.00, status:"Completed" },
  { id:"ORD-0027", date:"2024-08-14", region:"East",  rep:"Clara Davis",    category:"Electronics", product:"Mechanical Keyboard", units:2,  price:109.99, cost:44.00, status:"Completed" },
  { id:"ORD-0028", date:"2024-08-22", region:"West",  rep:"Fiona Grant",    category:"Clothing",    product:"Raincoat",            units:3,  price:84.99,  cost:32.00, status:"Completed" },
  { id:"ORD-0029", date:"2024-09-03", region:"North", rep:"Alice Morgan",   category:"Home",        product:"Storage Boxes",       units:10, price:12.99,  cost:4.00,  status:"Completed" },
  { id:"ORD-0030", date:"2024-09-18", region:"South", rep:"Ben Carter",     category:"Electronics", product:"Gaming Mouse",        units:4,  price:49.99,  cost:18.00, status:"Completed" },
  { id:"ORD-0031", date:"2024-10-02", region:"East",  rep:"Clara Davis",    category:"Clothing",    product:"Cashmere Sweater",    units:2,  price:149.99, cost:62.00, status:"Returned"  },
  { id:"ORD-0032", date:"2024-10-14", region:"West",  rep:"David Evans",    category:"Home",        product:"Electric Kettle",     units:5,  price:39.99,  cost:13.00, status:"Completed" },
  { id:"ORD-0033", date:"2024-10-28", region:"North", rep:"Fiona Grant",    category:"Electronics", product:"Smart Plug x4",       units:6,  price:29.99,  cost:9.00,  status:"Completed" },
  { id:"ORD-0034", date:"2024-11-05", region:"South", rep:"Ben Carter",     category:"Clothing",    product:"Puffer Jacket",       units:4,  price:119.99, cost:48.00, status:"Completed" },
  { id:"ORD-0035", date:"2024-11-11", region:"East",  rep:"Clara Davis",    category:"Home",        product:"Humidifier",          units:3,  price:59.99,  cost:22.00, status:"Completed" },
  { id:"ORD-0036", date:"2024-11-22", region:"West",  rep:"David Evans",    category:"Electronics", product:"4K Monitor",          units:1,  price:399.99, cost:175.00,status:"Completed" },
  { id:"ORD-0037", date:"2024-11-29", region:"North", rep:"Alice Morgan",   category:"Clothing",    product:"Wool Scarf",          units:12, price:19.99,  cost:6.00,  status:"Completed" },
  { id:"ORD-0038", date:"2024-12-03", region:"South", rep:"Fiona Grant",    category:"Home",        product:"Christmas Lights",    units:8,  price:24.99,  cost:8.00,  status:"Completed" },
  { id:"ORD-0039", date:"2024-12-10", region:"East",  rep:"Clara Davis",    category:"Electronics", product:"Smart Speaker",       units:5,  price:79.99,  cost:30.00, status:"Completed" },
  { id:"ORD-0040", date:"2024-12-20", region:"West",  rep:"David Evans",    category:"Clothing",    product:"Leather Gloves",      units:7,  price:34.99,  cost:11.00, status:"Completed" },
];

// ─── TASKS ────────────────────────────────────────────────────
const tasks = [
  {
    num:"T1", title:"Data Audit & Cleaning", color:"#4FC3F7", weight:15,
    objective:"Perform a full data quality check and document your findings.",
    steps:[
      "Open the dataset — count rows (should be 40), count columns (10)",
      "Run =COUNTBLANK() on each column — record any blank cells found",
      "Check for duplicates on Order ID column using COUNTIFS",
      'Check the Status column for any values other than "Completed" or "Returned"',
      "Verify Date column: =ISNUMBER(A2) should return TRUE for all rows",
      "Calculate: what % of orders are Returns? (hint: COUNTIF / COUNTA)",
      "Create a 'Data Audit' tab documenting your findings",
    ],
    aiPrompts:[
      '"I have a sales dataset with 40 rows and these columns: [list them]. What data quality checks should I run first?"',
      '"Write a COUNTIFS formula to find how many orders have Status = \'Returned\' and Revenue above $100"',
    ],
    deliverable:"Data Audit tab with findings documented",
    rubric:["Correct row/column count reported","All 6 checks performed","Return rate correctly calculated","Findings clearly documented"],
  },
  {
    num:"T2", title:"KPI Calculations", color:"#81C784", weight:20,
    objective:"Calculate the 6 core business KPIs from the dataset using formulas.",
    steps:[
      "Total Revenue = SUM of (Units × Price) for Completed orders only",
      "Total Cost = SUM of (Units × Cost) for Completed orders only",
      "Gross Profit = Total Revenue − Total Cost",
      "Gross Margin % = Gross Profit / Total Revenue (format as %)",
      "Average Order Value = Total Revenue / COUNT of Completed orders",
      "Return Rate % = Returned orders / Total orders (format as %)",
      "Best Month by Revenue = use SUMIFS + find the max",
      "Top Region by Revenue = SUMIFS across all 4 regions, identify the max",
    ],
    aiPrompts:[
      '"Write a SUMIFS formula to calculate total revenue (Units × Price) for only rows where Status = \'Completed\'"',
      '"I need to find which of 4 regions (North, South, East, West) has the highest total revenue from a table. What Excel approach should I use?"',
    ],
    deliverable:"KPI Summary tab with all 8 metrics, clearly labelled",
    rubric:["Revenue formula uses SUMIFS to exclude Returns","Gross Margin % formatted correctly","AOV calculated correctly","All 8 KPIs present and accurate"],
  },
  {
    num:"T3", title:"PivotTable Analysis", color:"#FFD54F", weight:20,
    objective:"Build 3 PivotTables that answer specific business questions.",
    steps:[
      "PivotTable 1 — Revenue by Region × Category: Rows=Region, Columns=Category, Values=Revenue (SUM of Units×Price, Completed only)",
      "PivotTable 2 — Monthly Revenue Trend: Rows=Month (group Date by Month), Values=Revenue, add a running total as second value field",
      "PivotTable 3 — Sales Rep Leaderboard: Rows=Sales Rep, Values=Revenue DESC, Units, Avg Order Value",
      "Add a Slicer for 'Status' and connect it to all 3 PivotTables",
      "Add a Slicer for 'Region' — connect to PivotTables 1 and 3",
      "Format all values as currency. Add conditional formatting to highlight top performer in leaderboard.",
    ],
    aiPrompts:[
      '"How do I group a Date field by Month in a PivotTable? My dates are in format YYYY-MM-DD."',
      '"How do I add a Running Total as a second value field in a PivotTable alongside the regular SUM?"',
    ],
    deliverable:"3 PivotTables on a dedicated Analysis tab, with 2 connected slicers",
    rubric:["All 3 PivotTables correctly structured","Slicers connected to multiple PivotTables","Running total visible in monthly trend","Sales rep leaderboard sorted by revenue DESC"],
  },
  {
    num:"T4", title:"Excel Dashboard", color:"#FF8A65", weight:25,
    objective:"Build a one-page interactive dashboard for a Sales Manager.",
    steps:[
      "Create a new 'Dashboard' sheet — hide gridlines (View → Gridlines off)",
      "Add a title: 'RetailCo Sales Intelligence — FY2024' in large bold text",
      "KPI Row (top): 4 cards showing Revenue, Gross Margin %, AOV, Return Rate — link to your KPI tab formulas",
      "Main chart: Monthly Revenue trend (bar chart) — link to PivotTable 2",
      "Secondary chart: Revenue by Region (horizontal bar) — link to PivotTable 1",
      "Table: Top 5 products by revenue — use LARGE() or a filtered PivotTable",
      "Add a Slicer for Region and connect it to all PivotTables feeding the dashboard",
      "Apply colour scheme: use only 2–3 colours. Remove all gridlines from charts.",
    ],
    aiPrompts:[
      '"Design a layout for a Sales Manager dashboard with these sections: [describe]. What chart types work best for each?"',
      '"My KPI cards show raw numbers. Write formulas to show: (1) Revenue vs last month arrow indicator, (2) conditional colour if Return Rate > 15%"',
    ],
    deliverable:"One-page Dashboard tab, printable on A4/Letter, with interactive Region slicer",
    rubric:["4 KPI cards present and linked","2 charts present and update with slicer","Top 5 products visible","Dashboard fits one screen, no scrolling required","Chart junk removed (gridlines, borders)"],
  },
  {
    num:"T5", title:"AI-Assisted Insights Report", color:"#CE93D8", weight:20,
    objective:"Write a 1-page executive insights report using AI to help draft, you to validate.",
    steps:[
      "Open ChatGPT or Claude. Paste your KPIs and key findings.",
      "Prompt: 'You are a senior data analyst. Based on these KPIs: [paste], write a 3-bullet executive summary for a Sales Director. Focus on: top insight, main concern, and one recommendation.'",
      "Review every AI-generated statement — verify each claim against your actual data",
      "Edit the AI draft: correct any hallucinations, add specifics (actual numbers, actual months)",
      "Add a 4th bullet: 'My observation' — one insight the AI missed that you found yourself",
      "Format as a clean Word/Google Doc or a dedicated Excel sheet: Company logo placeholder, date, your name",
    ],
    aiPrompts:[
      '"You are a senior data analyst. Here are FY2024 KPIs for RetailCo: Revenue = $X, Gross Margin = X%, Return Rate = X%, Best Month = X, Top Region = X. Write a 3-bullet executive summary for the Sales Director."',
      '"Based on these sales figures by region [paste table], what are 3 strategic recommendations you would make?"',
    ],
    deliverable:"1-page Insights Report (PDF or dedicated Excel sheet) with your name, date, and validated AI-assisted findings",
    rubric:["3 AI-assisted bullets present","Each bullet includes a specific number from the data","Your own original observation included","No hallucinated facts — all claims verified against data"],
  },
];

// ─── RUBRIC ──────────────────────────────────────────────────
const rubricRows = [
  { task:"T1 Data Audit",       max:15, criteria:"All 6 checks run, return rate correct, findings documented"         },
  { task:"T2 KPI Calculations", max:20, criteria:"All 8 KPIs correct, proper use of SUMIFS to exclude returns"         },
  { task:"T3 PivotTables",      max:20, criteria:"3 correct PivotTables, slicers connected, conditional formatting"    },
  { task:"T4 Dashboard",        max:25, criteria:"One-page layout, linked KPIs, interactive slicer, charts clean"      },
  { task:"T5 Insights Report",  max:20, criteria:"3 validated AI bullets, your own insight, no hallucinated facts"     },
];

// ─── REVIEW FLASHCARDS ────────────────────────────────────────
const flashcards = [
  { q:"What is the difference between Descriptive and Diagnostic analytics?",   a:"Descriptive = WHAT happened (reports, dashboards). Diagnostic = WHY it happened (root cause analysis, drill-downs). Most daily analyst work is descriptive." },
  { q:"When should you use Median instead of Mean?",                             a:"When data is skewed (income, revenue, house prices). Outliers inflate the mean. Median represents the 'typical' value better in skewed distributions." },
  { q:"What does a p-value of 0.03 mean (with α = 0.05)?",                      a:"p < α → reject the null hypothesis. The result is statistically significant — only 3% chance of seeing this result if there were truly no effect." },
  { q:"What is the 68-95-99.7 rule?",                                            a:"For a normal distribution: 68% of data falls within 1σ of the mean, 95% within 2σ, 99.7% within 3σ. Use it to spot outliers instantly." },
  { q:"Why does Correlation ≠ Causation?",                                       a:"Two variables can move together due to a third hidden variable (confounder), coincidence, or reverse causation. Ice cream sales and drowning both rise in summer — heat causes both." },
  { q:"What is the syntax for XLOOKUP?",                                         a:"=XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found]). Searches lookup_array, returns corresponding value from return_array. Replaces VLOOKUP." },
  { q:"What does SUMIFS do that SUMIF can't?",                                   a:"SUMIFS applies MULTIPLE criteria simultaneously (AND logic). SUMIF only handles one condition. Real business data always needs multiple filters." },
  { q:"What is the first step of the Data Analytics Lifecycle?",                 a:"Business Understanding — define the question BEFORE touching data. 90% of failed projects fail here. 'What decision will this analysis inform?'" },
  { q:"What is standard deviation measuring?",                                   a:"The average distance of data points from the mean. High σ = data is spread out (inconsistent). Low σ = data clusters tightly around the mean (consistent)." },
  { q:"What are the 4 areas of a PivotTable field list?",                        a:"Filters (top-level), Columns (horizontal), Rows (vertical), Values (the metric — SUM by default). Drag fields into areas to build any cross-tabulation." },
  { q:"Name 3 things Excel Copilot can do from plain English prompts.",           a:"Generate formulas, create PivotTables, add calculated columns, identify trends/anomalies, suggest chart types, answer natural language questions about your data." },
  { q:"What is IQR and how is it used to detect outliers?",                      a:"IQR = Q3 − Q1 (the middle 50% spread). Outlier rule: value < Q1 − 1.5×IQR or > Q3 + 1.5×IQR. Resistant to extreme values unlike range." },
];

const sections = [
  { id:"intro",    label:"Overview"    },
  { id:"brief",    label:"Project Brief"},
  { id:"dataset",  label:"Dataset"     },
  { id:"tasks",    label:"Tasks (5)"   },
  { id:"rubric",   label:"Rubric"      },
  { id:"review",   label:"📋 Review"   },
  { id:"next",     label:"🚀 Phase 2"  },
];

// ─── MAIN COMPONENT ───────────────────────────────────────────
export default function Phase1Part4() {
  const [activeSection, setActiveSection]       = useState("intro");
  const [activeTask,    setActiveTask]          = useState(null);
  const [flipped,       setFlipped]             = useState({});
  const [checkedSteps,  setCheckedSteps]        = useState({});
  const [scores,        setScores]              = useState({});
  const [dataTab, setDataTab] = useState("preview");

  const toggleFlip  = (i)    => setFlipped(p => ({ ...p, [i]: !p[i] }));
  const toggleStep  = (key)  => setCheckedSteps(p => ({ ...p, [key]: !p[key] }));
  const setScore    = (task, val) => setScores(p => ({ ...p, [task]: Number(val) }));
  const totalScore  = rubricRows.reduce((a, r) => a + (scores[r.task] || 0), 0);
  const maxScore    = rubricRows.reduce((a, r) => a + r.max, 0);
  const pct         = Math.round((totalScore / maxScore) * 100);

  // compute revenue for dataset preview
  const enriched = sampleData.map(r => ({
    ...r,
    revenue: r.status === "Completed" ? +(r.units * r.price).toFixed(2) : 0,
  }));

  return (
    <div style={{ minHeight:"100vh", background:"#07070E", color:"#DDD8F0", fontFamily:"Georgia,'Times New Roman',serif" }}>

      {/* NAV */}
      <div style={{ background:"#0A0A14", borderBottom:"1px solid #16162A", padding:"0 24px", position:"sticky", top:0, zIndex:100 }}>
        <div style={{ maxWidth:940, margin:"0 auto", display:"flex", alignItems:"center", overflowX:"auto" }}>
          <div style={{ fontSize:10, color:"#FF8C42", letterSpacing:"0.22em", textTransform:"uppercase", padding:"14px 20px 14px 0", borderRight:"1px solid #1A1A2E", marginRight:12, whiteSpace:"nowrap" }}>
            P1 · PART 4
          </div>
          {sections.map(s => (
            <button key={s.id} onClick={() => setActiveSection(s.id)} style={{
              background:"none", border:"none", cursor:"pointer",
              padding:"14px 13px", fontFamily:"inherit", fontSize:11, letterSpacing:"0.07em",
              color: activeSection === s.id ? "#FF8C42" : "#444",
              borderBottom: activeSection === s.id ? "2px solid #FF8C42" : "2px solid transparent",
              transition:"all 0.2s", whiteSpace:"nowrap",
            }}>{s.label}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth:940, margin:"0 auto", padding:"48px 24px 100px" }}>

        {/* ── INTRO ── */}
        {activeSection === "intro" && (
          <div>
            <div style={{ marginBottom:52, borderLeft:"3px solid #FF8C42", paddingLeft:24 }}>
              <div style={{ fontSize:10, color:"#FF8C42", letterSpacing:"0.3em", textTransform:"uppercase", marginBottom:12 }}>
                PHASE 1 · PART 4 OF 4 · FINAL
              </div>
              <h1 style={{ fontSize:"clamp(26px,5vw,44px)", fontWeight:900, margin:"0 0 16px", lineHeight:1.12, letterSpacing:"-0.02em" }}>
                Phase 1<br />
                <span style={{ color:"#FF8C42" }}>Capstone Project</span><br />
                <span style={{ fontStyle:"italic", fontWeight:400, fontSize:"0.68em", color:"#555" }}>+ Full Review & Phase 2 Preview</span>
              </h1>
              <p style={{ fontSize:14, color:"#666", lineHeight:1.88, maxWidth:560, margin:"0 0 24px" }}>
                This is where learning becomes doing. You have one real dataset, five interconnected tasks, and a clear deliverable — a portfolio-ready Sales Intelligence Report that demonstrates everything from Parts 1, 2, and 3 in a single coherent project.
              </p>
              <div style={{ display:"flex", flexWrap:"wrap", gap:10 }}>
                {["40-row real dataset","5 tasks","100 marks","Portfolio output","AI-assisted","~6 hours"].map(tag => (
                  <span key={tag} style={{ padding:"4px 12px", background:"rgba(255,140,66,0.08)", border:"1px solid rgba(255,140,66,0.2)", borderRadius:2, fontSize:11, color:"#FF8C42" }}>{tag}</span>
                ))}
              </div>
            </div>

            <SectionHeader num="00" title="Part 4 at a Glance" color="#FF8C42" />
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:10, margin:"24px 0 36px" }}>
              {[
                { icon:"📋", label:"Project Brief",  desc:"Context, scenario, and what you're building",  color:"#4FC3F7",  section:"brief"   },
                { icon:"📁", label:"The Dataset",    desc:"40-row RetailCo sales data — preview + download", color:"#81C784",  section:"dataset" },
                { icon:"✅", label:"5 Tasks",        desc:"Step-by-step instructions with AI prompts per task", color:"#FFD54F",  section:"tasks"   },
                { icon:"🎯", label:"Marking Rubric", desc:"Self-assess your work against 100-point criteria",   color:"#FF8A65",  section:"rubric"  },
                { icon:"🧠", label:"Phase 1 Review", desc:"12 flashcards — test recall before Phase 2",         color:"#CE93D8",  section:"review"  },
                { icon:"🚀", label:"Phase 2 Preview",desc:"SQL & AI query assistants — what's coming next",     color:"#FF8C42",  section:"next"    },
              ].map((item, i) => (
                <div key={i} onClick={() => setActiveSection(item.section)} style={{
                  border:`1px solid ${item.color}33`, borderTop:`3px solid ${item.color}`,
                  borderRadius:4, padding:"16px", background:"#0D0D18",
                  cursor:"pointer", transition:"background 0.2s",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = `${item.color}08`}
                  onMouseLeave={e => e.currentTarget.style.background = "#0D0D18"}
                >
                  <div style={{ fontSize:22, marginBottom:10 }}>{item.icon}</div>
                  <div style={{ fontSize:13, fontWeight:700, color:"#DDD8F0", marginBottom:6 }}>{item.label}</div>
                  <div style={{ fontSize:12, color:"#444", lineHeight:1.6 }}>{item.desc}</div>
                </div>
              ))}
            </div>

            <Callout icon="🏆" color="#FF8C42" title="What You're Building">
              A complete, real-world <strong>Sales Intelligence Report</strong> for a fictional company called RetailCo. By the end you will have: a clean Excel workbook with 3 PivotTables, an interactive dashboard, a set of KPIs, and a 1-page AI-assisted executive insights document — the exact deliverable a junior data analyst would produce in their first week on the job.
            </Callout>
            <NavButtons onNext={() => setActiveSection("brief")} />
          </div>
        )}

        {/* ── BRIEF ── */}
        {activeSection === "brief" && (
          <div>
            <SectionHeader num="01" title="Project Brief" color="#4FC3F7" />

            {/* Scenario card */}
            <div style={{ border:"1px solid #4FC3F733", borderLeft:"4px solid #4FC3F7", borderRadius:4, padding:"22px 24px", background:"rgba(79,195,247,0.04)", marginBottom:28 }}>
              <div style={{ fontSize:10, color:"#4FC3F7", letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:10, fontFamily:"monospace" }}>THE SCENARIO</div>
              <p style={{ fontSize:14, color:"#AAA", lineHeight:1.85, margin:"0 0 12px" }}>
                You've just joined <strong style={{ color:"#DDD8F0" }}>RetailCo</strong> as a Junior Data Analyst. It's your first full week. Your manager, Sarah (Head of Sales), drops a CSV on your desk:
              </p>
              <blockquote style={{ borderLeft:"2px solid #4FC3F7", paddingLeft:16, margin:"0 0 12px", fontStyle:"italic", color:"#888", fontSize:14, lineHeight:1.8 }}>
                "Hey — can you look through last year's sales data and put together something for me? I need to know how we performed overall, which region is strongest, which products are driving returns, and who my best sales rep is. I'm presenting to the board on Friday. Make it clear, keep it simple."
              </blockquote>
              <p style={{ fontSize:13, color:"#666", margin:0, lineHeight:1.7 }}>
                You have the dataset (40 orders, FY2024), Excel, and the skills from Parts 1–3. This is your moment.
              </p>
            </div>

            {/* Deliverables */}
            <Subheading>What You'll Submit</Subheading>
            <div style={{ display:"flex", flexDirection:"column", gap:8, margin:"16px 0 32px" }}>
              {[
                { del:"Excel Workbook (.xlsx)",  desc:"Sheets: Raw Data, Data Audit, KPIs, Analysis (PivotTables), Dashboard", color:"#4FC3F7" },
                { del:"Executive Report",         desc:"1-page PDF or dedicated sheet: AI-assisted insights, validated, with your name", color:"#81C784" },
                { del:"GitHub Commit (optional)", desc:"Upload the .xlsx to a GitHub repo — first portfolio item", color:"#FFD54F" },
              ].map((d, i) => (
                <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:14, padding:"12px 16px", background:"#0D0D18", border:`1px solid ${d.color}33`, borderRadius:3 }}>
                  <div style={{ width:6, height:6, borderRadius:"50%", background:d.color, flexShrink:0, marginTop:6 }} />
                  <div>
                    <div style={{ fontSize:13, fontWeight:700, color:"#DDD8F0" }}>{d.del}</div>
                    <div style={{ fontSize:12, color:"#555", marginTop:3 }}>{d.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Workbook structure */}
            <Subheading>Recommended Workbook Structure</Subheading>
            <div style={{ border:"1px solid #1A1A2E", borderRadius:4, overflow:"hidden", margin:"16px 0 28px" }}>
              {[
                { tab:"📁 Raw Data",     purpose:"Paste the dataset here. Never modify this sheet.",                color:"#4FC3F7" },
                { tab:"🔍 Data Audit",   purpose:"Your cleaning checklist findings — row counts, blanks, return %", color:"#81C784" },
                { tab:"💰 KPIs",         purpose:"8 core metrics built with SUMIFS/COUNTIFS formulas",              color:"#FFD54F" },
                { tab:"📊 Analysis",     purpose:"3 PivotTables with slicers — your analytical engine",            color:"#FF8A65" },
                { tab:"📈 Dashboard",    purpose:"One-page executive dashboard — this is what Sarah sees",          color:"#CE93D8" },
                { tab:"📝 Insights",     purpose:"AI-assisted executive report (or link to your PDF)",              color:"#FF8C42" },
              ].map((t, i, arr) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:16, padding:"11px 18px", borderBottom: i < arr.length-1 ? "1px solid #0F0F18" : "none", background: i%2===0 ? "#0A0A14" : "#080811" }}>
                  <span style={{ fontSize:12, color:t.color, fontFamily:"monospace", fontWeight:700, minWidth:120 }}>{t.tab}</span>
                  <span style={{ fontSize:13, color:"#777" }}>{t.purpose}</span>
                </div>
              ))}
            </div>

            <Callout icon="⏱️" color="#FFD54F" title="Time Estimate">
              T1 Data Audit: ~30 min &nbsp;·&nbsp; T2 KPIs: ~45 min &nbsp;·&nbsp; T3 PivotTables: ~60 min &nbsp;·&nbsp; T4 Dashboard: ~90 min &nbsp;·&nbsp; T5 Report: ~45 min<br />
              <strong>Total: ~5–6 hours.</strong> Work through one task per session. Don't rush — quality beats speed.
            </Callout>
            <NavButtons onPrev={() => setActiveSection("intro")} onNext={() => setActiveSection("dataset")} />
          </div>
        )}

        {/* ── DATASET ── */}
        {activeSection === "dataset" && (
          <div>
            <SectionHeader num="02" title="The RetailCo Dataset (FY2024)" color="#81C784" />
            <Prose>
              Your dataset contains <Highlight>40 real-looking sales orders</Highlight> across FY2024. It includes all the complexity of real data — multiple regions, product categories, sales reps, and a mix of completed orders and returns. Use the preview below to get familiar before you start.
            </Prose>

            {/* Column schema */}
            <Subheading>Column Definitions</Subheading>
            <div style={{ border:"1px solid #1A1A2E", borderRadius:4, overflow:"hidden", margin:"16px 0 24px" }}>
              {[
                { col:"Order ID",   type:"Text",   desc:"Unique order identifier (ORD-XXXX)",               color:"#4FC3F7" },
                { col:"Date",       type:"Date",   desc:"Order date in YYYY-MM-DD format",                   color:"#81C784" },
                { col:"Region",     type:"Text",   desc:"Sales region: North, South, East, West",            color:"#FFD54F" },
                { col:"Sales Rep",  type:"Text",   desc:"Name of the sales representative",                  color:"#FF8A65" },
                { col:"Category",   type:"Text",   desc:"Product category: Electronics, Clothing, Home",     color:"#CE93D8" },
                { col:"Product",    type:"Text",   desc:"Product name",                                      color:"#F48FB1" },
                { col:"Units",      type:"Number", desc:"Quantity ordered",                                  color:"#4FC3F7" },
                { col:"Price ($)",  type:"Number", desc:"Unit selling price — Revenue = Units × Price",      color:"#81C784" },
                { col:"Cost ($)",   type:"Number", desc:"Unit cost — Profit = (Price − Cost) × Units",       color:"#FFD54F" },
                { col:"Status",     type:"Text",   desc:"'Completed' = revenue counted. 'Returned' = excluded from revenue.", color:"#FF8A65" },
              ].map((c, i, arr) => (
                <div key={i} style={{ display:"grid", gridTemplateColumns:"110px 70px 1fr", gap:12, alignItems:"center", padding:"10px 16px", borderBottom: i < arr.length-1 ? "1px solid #0F0F18" : "none", background: i%2===0 ? "#0A0A14" : "#080811" }}>
                  <span style={{ fontSize:12, color:c.color, fontFamily:"monospace", fontWeight:700 }}>{c.col}</span>
                  <span style={{ fontSize:10, color:"#444", fontFamily:"monospace", background:"#0D0D18", padding:"2px 6px", borderRadius:2, textAlign:"center" }}>{c.type}</span>
                  <span style={{ fontSize:12, color:"#777" }}>{c.desc}</span>
                </div>
              ))}
            </div>

            {/* Tab switch */}
            <div style={{ display:"flex", gap:4, marginBottom:16 }}>
              {["preview","stats"].map(t => (
                <button key={t} onClick={() => setDataTab(t)} style={{
                  background: dataTab===t ? "#81C784" : "none",
                  border:`1px solid ${dataTab===t ? "#81C784" : "#1A1A2E"}`,
                  borderRadius:3, padding:"6px 16px", cursor:"pointer",
                  fontFamily:"monospace", fontSize:11, letterSpacing:"0.1em",
                  color: dataTab===t ? "#07070E" : "#555", fontWeight: dataTab===t ? 700 : 400,
                }}>
                  {t === "preview" ? "DATA PREVIEW" : "QUICK STATS"}
                </button>
              ))}
            </div>

            {dataTab === "preview" && (
              <div style={{ overflowX:"auto", border:"1px solid #1A1A2E", borderRadius:4, marginBottom:24 }}>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:11, fontFamily:"monospace" }}>
                  <thead>
                    <tr style={{ background:"#0D0D18" }}>
                      {["Order ID","Date","Region","Sales Rep","Category","Product","Units","Price","Cost","Status","Revenue*"].map(h => (
                        <th key={h} style={{ padding:"8px 12px", textAlign:"left", color:"#81C784", fontWeight:700, letterSpacing:"0.08em", borderBottom:"1px solid #1A1A2E", whiteSpace:"nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {enriched.slice(0,15).map((r, i) => (
                      <tr key={i} style={{ background: i%2===0 ? "#0A0A14" : "#07070E", borderBottom:"1px solid #0F0F18" }}>
                        <td style={{ padding:"6px 12px", color:"#4FC3F7" }}>{r.id}</td>
                        <td style={{ padding:"6px 12px", color:"#888" }}>{r.date}</td>
                        <td style={{ padding:"6px 12px", color:"#FFD54F" }}>{r.region}</td>
                        <td style={{ padding:"6px 12px", color:"#AAA" }}>{r.rep.split(" ")[0]}</td>
                        <td style={{ padding:"6px 12px", color:"#CE93D8" }}>{r.category}</td>
                        <td style={{ padding:"6px 12px", color:"#DDD8F0", maxWidth:140, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{r.product}</td>
                        <td style={{ padding:"6px 12px", color:"#888", textAlign:"right" }}>{r.units}</td>
                        <td style={{ padding:"6px 12px", color:"#81C784", textAlign:"right" }}>${r.price}</td>
                        <td style={{ padding:"6px 12px", color:"#555", textAlign:"right" }}>${r.cost}</td>
                        <td style={{ padding:"6px 12px", color: r.status==="Returned" ? "#FF8A65" : "#81C784" }}>{r.status}</td>
                        <td style={{ padding:"6px 12px", color: r.revenue===0 ? "#333" : "#4FC3F7", textAlign:"right" }}>{r.revenue===0 ? "—" : `$${r.revenue.toFixed(2)}`}</td>
                      </tr>
                    ))}
                    <tr style={{ background:"#0A0A14" }}>
                      <td colSpan={11} style={{ padding:"8px 12px", color:"#444", fontStyle:"italic", textAlign:"center" }}>… 25 more rows · copy the full table from the dataset tab</td>
                    </tr>
                  </tbody>
                </table>
                <div style={{ padding:"8px 14px", background:"#080811", fontSize:10, color:"#444" }}>
                  * Revenue column = Units × Price for Completed orders only. Returns = $0 revenue. This is a DERIVED column — you'll calculate it with SUMIFS.
                </div>
              </div>
            )}

            {dataTab === "stats" && (() => {
              const completed = enriched.filter(r => r.status === "Completed");
              const returned  = enriched.filter(r => r.status === "Returned");
              const totalRev  = completed.reduce((a, r) => a + r.revenue, 0);
              const totalCost = completed.reduce((a, r) => a + r.units * r.cost, 0);
              const gp        = totalRev - totalCost;
              const aov       = totalRev / completed.length;
              const regions   = ["North","South","East","West"].map(reg => ({
                name:reg,
                rev: completed.filter(r => r.region===reg).reduce((a,r)=>a+r.revenue,0)
              })).sort((a,b)=>b.rev-a.rev);
              const maxRev = regions[0].rev;
              return (
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:10, marginBottom:24 }}>
                  {[
                    { label:"Total Revenue",   val:`$${totalRev.toFixed(2)}`,  color:"#81C784",  note:"Completed orders only" },
                    { label:"Gross Profit",    val:`$${gp.toFixed(2)}`,        color:"#4FC3F7",  note:`Margin: ${((gp/totalRev)*100).toFixed(1)}%` },
                    { label:"Avg Order Value", val:`$${aov.toFixed(2)}`,       color:"#FFD54F",  note:"Per completed order" },
                    { label:"Return Rate",     val:`${((returned.length/enriched.length)*100).toFixed(1)}%`, color:"#FF8A65", note:`${returned.length} of ${enriched.length} orders` },
                    { label:"Top Region",      val:regions[0].name,            color:"#CE93D8",  note:`$${regions[0].rev.toFixed(0)} revenue` },
                    { label:"Total Orders",    val:enriched.length,            color:"#F48FB1",  note:`${completed.length} completed, ${returned.length} returned` },
                  ].map((s,i) => (
                    <div key={i} style={{ border:`1px solid ${s.color}33`, borderTop:`3px solid ${s.color}`, borderRadius:4, padding:"16px", background:`${s.color}06` }}>
                      <div style={{ fontSize:11, color:s.color, fontFamily:"monospace", letterSpacing:"0.1em", marginBottom:6 }}>{s.label}</div>
                      <div style={{ fontSize:24, fontWeight:900, color:"#DDD8F0", marginBottom:4 }}>{s.val}</div>
                      <div style={{ fontSize:11, color:"#555" }}>{s.note}</div>
                    </div>
                  ))}
                  <div style={{ gridColumn:"1/-1", border:"1px solid #1A1A2E", borderRadius:4, padding:"16px", background:"#0A0A14" }}>
                    <div style={{ fontSize:10, color:"#555", fontFamily:"monospace", letterSpacing:"0.12em", marginBottom:12 }}>REVENUE BY REGION</div>
                    {regions.map(r => (
                      <div key={r.name} style={{ display:"flex", alignItems:"center", gap:12, marginBottom:8 }}>
                        <span style={{ fontSize:11, color:"#888", minWidth:48, fontFamily:"monospace" }}>{r.name}</span>
                        <div style={{ flex:1, height:18, background:"#0D0D18", borderRadius:2, overflow:"hidden" }}>
                          <div style={{ width:`${(r.rev/maxRev)*100}%`, height:"100%", background:"linear-gradient(90deg,#4FC3F7,#81C784)", borderRadius:2, display:"flex", alignItems:"center", paddingLeft:8 }}>
                            <span style={{ fontSize:10, color:"#07070E", fontFamily:"monospace", fontWeight:700, whiteSpace:"nowrap" }}>${r.rev.toFixed(0)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div style={{ fontSize:10, color:"#333", marginTop:8 }}>These are your ANSWER KEY values — your T2 KPI formulas should match.</div>
                  </div>
                </div>
              );
            })()}

            <Callout icon="📥" color="#81C784" title="How to Use This Data">
              Copy the data from the preview above into Excel row by row, OR paste the column headers and data manually. In a real job you'd receive this as a CSV — the manual entry here teaches you to understand every column before you start. Real analysts always audit the data schema before analysing it.
            </Callout>
            <NavButtons onPrev={() => setActiveSection("brief")} onNext={() => setActiveSection("tasks")} />
          </div>
        )}

        {/* ── TASKS ── */}
        {activeSection === "tasks" && (
          <div>
            <SectionHeader num="03" title="5 Project Tasks" color="#FFD54F" />
            <Prose>
              Each task builds on the previous one. Complete them in order. Every task has step-by-step instructions, AI prompts to accelerate your work, and a deliverable to check off when done.
            </Prose>

            {/* Task overview bar */}
            <div style={{ display:"flex", gap:6, margin:"20px 0 32px", overflowX:"auto", paddingBottom:4 }}>
              {tasks.map((t, i) => (
                <button key={i} onClick={() => setActiveTask(activeTask===i ? null : i)} style={{
                  background: activeTask===i ? `${t.color}18` : "#0D0D18",
                  border:`1px solid ${activeTask===i ? t.color : "#1A1A2E"}`,
                  borderTop:`3px solid ${t.color}`,
                  borderRadius:4, padding:"12px 16px", cursor:"pointer",
                  fontFamily:"monospace", fontSize:11, color: activeTask===i ? t.color : "#555",
                  whiteSpace:"nowrap", minWidth:120, textAlign:"left", transition:"all 0.2s",
                }}>
                  <div style={{ fontWeight:700, marginBottom:4 }}>{t.num}</div>
                  <div style={{ fontSize:10, lineHeight:1.4 }}>{t.title}</div>
                  <div style={{ marginTop:6, fontSize:10, color:"#444" }}>{t.weight} pts</div>
                </button>
              ))}
            </div>

            {/* Task detail */}
            {activeTask !== null && (() => {
              const t = tasks[activeTask];
              return (
                <div style={{ border:`1px solid ${t.color}44`, borderLeft:`4px solid ${t.color}`, borderRadius:4, overflow:"hidden", marginBottom:32 }}>
                  <div style={{ padding:"18px 22px", background:`${t.color}08`, borderBottom:`1px solid ${t.color}22` }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:8 }}>
                      <div>
                        <div style={{ fontSize:10, color:t.color, letterSpacing:"0.2em", fontFamily:"monospace", marginBottom:6 }}>{t.num} · {t.weight} MARKS</div>
                        <h3 style={{ margin:0, fontSize:20, fontWeight:900, color:"#DDD8F0" }}>{t.title}</h3>
                      </div>
                      <div style={{ fontSize:12, color:"#555", fontStyle:"italic", maxWidth:280, textAlign:"right" }}>{t.objective}</div>
                    </div>
                  </div>

                  <div style={{ padding:"20px 22px", background:"#0A0A14" }}>
                    <Label color={t.color}>STEP-BY-STEP INSTRUCTIONS</Label>
                    <div style={{ display:"flex", flexDirection:"column", gap:6, margin:"12px 0 20px" }}>
                      {t.steps.map((s, j) => {
                        const key = `${activeTask}-${j}`;
                        const done = checkedSteps[key];
                        return (
                          <div key={j} onClick={() => toggleStep(key)} style={{
                            display:"flex", alignItems:"flex-start", gap:12,
                            padding:"10px 14px", borderRadius:3, cursor:"pointer",
                            background: done ? `${t.color}08` : "#0D0D18",
                            border:`1px solid ${done ? t.color+"44" : "#1A1A2E"}`,
                            transition:"all 0.2s",
                          }}>
                            <div style={{ width:18, height:18, borderRadius:3, border:`1.5px solid ${done ? t.color : "#333"}`, background: done ? t.color : "none", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1 }}>
                              {done && <span style={{ fontSize:10, color:"#07070E", fontWeight:900 }}>✓</span>}
                            </div>
                            <span style={{ fontSize:13, color: done ? "#DDD8F0" : "#777", lineHeight:1.6, textDecoration: done ? "none" : "none" }}>{s}</span>
                          </div>
                        );
                      })}
                    </div>

                    <Label color="#CE93D8">🤖 AI PROMPTS FOR THIS TASK</Label>
                    <div style={{ display:"flex", flexDirection:"column", gap:6, margin:"10px 0 18px" }}>
                      {t.aiPrompts.map((p, j) => (
                        <div key={j} style={{ background:"rgba(206,147,216,0.05)", border:"1px solid rgba(206,147,216,0.2)", borderRadius:3, padding:"10px 14px" }}>
                          <code style={{ fontSize:12, color:"#CE93D8", fontFamily:"monospace", lineHeight:1.6 }}>{p}</code>
                        </div>
                      ))}
                    </div>

                    <div style={{ display:"flex", gap:12, alignItems:"flex-start", flexWrap:"wrap" }}>
                      <div style={{ flex:1, minWidth:220, background:`${t.color}08`, border:`1px solid ${t.color}33`, borderRadius:3, padding:"12px 14px" }}>
                        <Label color={t.color}>✓ DELIVERABLE</Label>
                        <p style={{ fontSize:13, color:"#AAA", margin:"6px 0 0", lineHeight:1.6 }}>{t.deliverable}</p>
                      </div>
                      <div style={{ flex:1, minWidth:220, background:"#0D0D18", border:"1px solid #1A1A2E", borderRadius:3, padding:"12px 14px" }}>
                        <Label color="#888">MARKING CRITERIA</Label>
                        <ul style={{ margin:"6px 0 0", padding:"0 0 0 16px" }}>
                          {t.rubric.map((r, j) => <li key={j} style={{ fontSize:12, color:"#666", lineHeight:1.7 }}>{r}</li>)}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {activeTask === null && (
              <div style={{ padding:"32px", background:"#0D0D18", border:"1px dashed #1A1A2E", borderRadius:4, textAlign:"center", color:"#444", fontSize:13 }}>
                ↑ Click any task card above to open the step-by-step instructions
              </div>
            )}

            <NavButtons onPrev={() => setActiveSection("dataset")} onNext={() => setActiveSection("rubric")} />
          </div>
        )}

        {/* ── RUBRIC ── */}
        {activeSection === "rubric" && (
          <div>
            <SectionHeader num="04" title="Marking Rubric — Self Assessment" color="#FF8A65" />
            <Prose>
              Use this rubric to <Highlight>score your own work before considering the project complete</Highlight>. Be honest — the point is to identify what needs improvement, not to give yourself full marks. A score of 75+ is a pass. 90+ is portfolio-ready.
            </Prose>

            <div style={{ border:"1px solid #1A1A2E", borderRadius:4, overflow:"hidden", margin:"24px 0 28px" }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 2fr 80px 80px", gap:12, padding:"10px 16px", background:"#0D0D18", borderBottom:"1px solid #1A1A2E" }}>
                {["Task","Criteria","Max","Your Score"].map(h => (
                  <div key={h} style={{ fontSize:10, color:"#555", letterSpacing:"0.12em", fontFamily:"monospace", textTransform:"uppercase" }}>{h}</div>
                ))}
              </div>
              {rubricRows.map((r, i) => (
                <div key={i} style={{ display:"grid", gridTemplateColumns:"1fr 2fr 80px 80px", gap:12, padding:"12px 16px", alignItems:"center", borderBottom: i<rubricRows.length-1 ? "1px solid #0F0F18" : "none", background: i%2===0 ? "#0A0A14" : "#07070E" }}>
                  <div style={{ fontSize:12, color:"#FF8A65", fontFamily:"monospace", fontWeight:700 }}>{r.task}</div>
                  <div style={{ fontSize:12, color:"#777", lineHeight:1.5 }}>{r.criteria}</div>
                  <div style={{ fontSize:13, color:"#DDD8F0", fontFamily:"monospace", textAlign:"center" }}>{r.max}</div>
                  <input
                    type="number" min={0} max={r.max}
                    value={scores[r.task] ?? ""}
                    onChange={e => setScore(r.task, Math.min(r.max, Math.max(0, e.target.value)))}
                    placeholder="0"
                    style={{ background:"#0D0D18", border:"1px solid #1A1A2E", borderRadius:3, padding:"5px 8px", color:"#4ade80", fontFamily:"monospace", fontSize:13, width:"60px", textAlign:"center", outline:"none" }}
                  />
                </div>
              ))}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 2fr 80px 80px", gap:12, padding:"14px 16px", background:"#0D0D18", borderTop:"2px solid #1A1A2E" }}>
                <div style={{ fontSize:12, fontWeight:700, color:"#DDD8F0", gridColumn:"1/3" }}>TOTAL</div>
                <div style={{ fontSize:14, fontWeight:900, color:"#DDD8F0", fontFamily:"monospace", textAlign:"center" }}>{maxScore}</div>
                <div style={{ fontSize:14, fontWeight:900, color: pct>=90 ? "#4ade80" : pct>=75 ? "#FFD54F" : "#FF8A65", fontFamily:"monospace", textAlign:"center" }}>{totalScore}</div>
              </div>
            </div>

            {/* Score feedback */}
            <div style={{ border:`1px solid ${pct>=90?"#4ade80":pct>=75?"#FFD54F":"#FF8A65"}33`, borderLeft:`4px solid ${pct>=90?"#4ade80":pct>=75?"#FFD54F":"#FF8A65"}`, borderRadius:4, padding:"20px 22px", background: pct>=90?"rgba(74,222,128,0.04)":pct>=75?"rgba(255,213,79,0.04)":"rgba(255,138,101,0.04)" }}>
              <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:12, flexWrap:"wrap" }}>
                <div style={{ fontSize:44, fontWeight:900, color: pct>=90?"#4ade80":pct>=75?"#FFD54F":"#FF8A65", fontFamily:"monospace" }}>
                  {totalScore > 0 ? `${pct}%` : "—"}
                </div>
                <div>
                  <div style={{ fontSize:14, fontWeight:700, color:"#DDD8F0" }}>
                    {pct>=90 ? "🏆 Portfolio Ready" : pct>=75 ? "✅ Pass — Good work" : pct>0 ? "📚 Needs improvement" : "Enter your scores →"}
                  </div>
                  <div style={{ fontSize:12, color:"#555", marginTop:3 }}>
                    {pct>=90 ? "Upload to GitHub. Add to your CV under Projects." : pct>=75 ? "Review the tasks you dropped marks on and refine before uploading." : pct>0 ? "Identify the lowest-scoring task and redo it before moving to Phase 2." : "Score each task above to get your result."}
                  </div>
                </div>
              </div>
              <div style={{ height:6, background:"#1A1A2E", borderRadius:3, overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${pct}%`, background:`linear-gradient(90deg,#FF8A65,${pct>=90?"#4ade80":pct>=75?"#FFD54F":"#FF8A65"})`, borderRadius:3, transition:"width 0.5s" }} />
              </div>
            </div>

            <Callout icon="📁" color="#4FC3F7" title="Uploading to GitHub (Optional but Recommended)">
              1. Create a free account at github.com<br />
              2. Click "New repository" → name it "phase1-retailco-project"<br />
              3. Upload your .xlsx file and the insights PDF/screenshot<br />
              4. Add a README.md: "Phase 1 project — FY2024 Sales Intelligence Report for RetailCo. Tools: Excel, Microsoft Copilot. Skills: PivotTables, SUMIFS, Data Cleaning, Dashboard Design."<br />
              This is your <strong>first portfolio item</strong>. Paste the link in your LinkedIn bio.
            </Callout>
            <NavButtons onPrev={() => setActiveSection("tasks")} onNext={() => setActiveSection("review")} />
          </div>
        )}

        {/* ── REVIEW FLASHCARDS ── */}
        {activeSection === "review" && (
          <div>
            <SectionHeader num="05" title="Phase 1 Full Review — 12 Flashcards" color="#CE93D8" />
            <Prose>
              Flip each card to reveal the answer. These cover the key concepts from Parts 1, 2, and 3. <Highlight>If any card stumps you, go back to that section before starting Phase 2.</Highlight>
            </Prose>

            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:12, margin:"28px 0 36px" }}>
              {flashcards.map((card, i) => {
                const isFlipped = flipped[i];
                return (
                  <div key={i} onClick={() => toggleFlip(i)} style={{ cursor:"pointer", minHeight:140, position:"relative" }}>
                    <div style={{
                      border:`1px solid ${isFlipped ? "#CE93D8" : "#1A1A2E"}`,
                      borderTop:`3px solid ${isFlipped ? "#CE93D8" : "#333"}`,
                      borderRadius:4, padding:"16px", background: isFlipped ? "rgba(206,147,216,0.06)" : "#0D0D18",
                      transition:"all 0.25s", minHeight:140, display:"flex", flexDirection:"column",
                    }}>
                      <div style={{ fontSize:9, color: isFlipped ? "#CE93D8" : "#444", letterSpacing:"0.15em", fontFamily:"monospace", marginBottom:10, textTransform:"uppercase" }}>
                        {isFlipped ? "ANSWER" : `QUESTION ${String(i+1).padStart(2,"0")}`}
                      </div>
                      <div style={{ fontSize:13, color: isFlipped ? "#AAA" : "#DDD8F0", lineHeight:1.65, flex:1 }}>
                        {isFlipped ? card.a : card.q}
                      </div>
                      <div style={{ fontSize:10, color:"#333", marginTop:12, textAlign:"right", fontFamily:"monospace" }}>
                        {isFlipped ? "← click to flip back" : "click to reveal →"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Concept map */}
            <Subheading>Phase 1 Concept Map</Subheading>
            <div style={{ border:"1px solid #1A1A2E", borderRadius:4, overflow:"hidden", margin:"16px 0 28px" }}>
              {[
                { part:"Part 1", topics:["Data vs. Information vs. Insight","4 Types of Analytics","Analytics Lifecycle (7 steps)","Roles: Analyst vs. Scientist vs. Engineer","Structured vs. Unstructured data","AI Tools: ChatGPT, Copilot, Perplexity"], color:"#FF8C42" },
                { part:"Part 2", topics:["Mean, Median, Mode — when to use each","Standard Deviation, IQR, Variance","Normal, Skewed, Uniform distributions","Hypothesis Testing — 6 steps + p-value","Test Chooser: t-test, ANOVA, chi-square","Correlation: Pearson vs. Spearman, r scale"], color:"#4FC3F7" },
                { part:"Part 3", topics:["XLOOKUP, SUMIFS, COUNTIFS, INDEX/MATCH","IFS, IFERROR, Text functions (TRIM, PROPER)","PivotTables: 6-step build process","6 data cleaning techniques","Dashboard design: 6 principles","Microsoft Copilot: 6 features + prompts"], color:"#4ade80" },
              ].map((p, i, arr) => (
                <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:16, padding:"14px 18px", borderBottom: i<arr.length-1 ? "1px solid #0F0F18" : "none", background: i%2===0 ? "#0A0A14" : "#07070E" }}>
                  <div style={{ minWidth:56, fontSize:11, color:p.color, fontFamily:"monospace", fontWeight:700, paddingTop:2 }}>{p.part}</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                    {p.topics.map(t => (
                      <span key={t} style={{ padding:"3px 9px", background:`${p.color}0D`, border:`1px solid ${p.color}30`, borderRadius:2, fontSize:11, color:p.color }}>{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <NavButtons onPrev={() => setActiveSection("rubric")} onNext={() => setActiveSection("next")} />
          </div>
        )}

        {/* ── PHASE 2 PREVIEW ── */}
        {activeSection === "next" && (
          <div>
            <SectionHeader num="06" title="Phase 1 Complete — What's Next" color="#FF8C42" />

            {/* Completion card */}
            <div style={{ padding:"28px 30px", background:"linear-gradient(135deg,rgba(255,140,66,0.08) 0%,transparent 100%)", border:"1px solid #FF8C4233", borderRadius:4, marginBottom:36, textAlign:"center" }}>
              <div style={{ fontSize:52, marginBottom:12 }}>🎉</div>
              <h2 style={{ margin:"0 0 10px", fontSize:26, fontWeight:900, color:"#DDD8F0" }}>Phase 1 Complete</h2>
              <p style={{ fontSize:14, color:"#777", lineHeight:1.8, maxWidth:480, margin:"0 auto 20px" }}>
                You've covered the foundations — analytics thinking, statistics, Excel, AI tools, and a complete capstone project. You now know more than most people who call themselves "Excel users." Phase 2 is where you level up to professional-grade querying.
              </p>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8, justifyContent:"center" }}>
                {["Analytics Lifecycle ✓","Statistics ✓","Excel Mastery ✓","Copilot AI ✓","First Portfolio Project ✓"].map(tag => (
                  <span key={tag} style={{ padding:"5px 14px", background:"rgba(74,222,128,0.08)", border:"1px solid rgba(74,222,128,0.25)", borderRadius:2, fontSize:12, color:"#4ade80" }}>{tag}</span>
                ))}
              </div>
            </div>

            {/* Phase 2 preview */}
            <Subheading>Phase 2 — SQL & AI Query Assistants (Weeks 4–6)</Subheading>
            <Prose>
              SQL is the language of data. Every database, data warehouse, and analytics platform speaks SQL. In Phase 2 you'll go from zero to writing complex queries — and you'll use AI tools to write SQL from plain English, debug errors, and generate analytics-ready queries in seconds.
            </Prose>

            <div style={{ display:"flex", flexDirection:"column", gap:8, margin:"20px 0 32px" }}>
              {[
                { week:"Week 4", title:"SQL Mastery",                  topics:["SELECT, WHERE, GROUP BY, JOINs, Subqueries","Window functions: RANK, ROW_NUMBER, LEAD/LAG","Aggregate functions deep dive","GitHub Copilot for SQL: autocomplete queries"], color:"#FFD54F" },
                { week:"Week 5", title:"AI-Powered SQL Workflows",     topics:["SQLAI.ai & AI2sql — text to SQL in seconds","Gemini in BigQuery: natural language queries","Reviewing and debugging AI-generated SQL","When AI SQL goes wrong: hallucinations and schema errors"], color:"#FF8A65" },
                { week:"Week 6", title:"Business SQL Analytics",       topics:["Cohort analysis and funnel analysis with SQL","RFM segmentation (Recency, Frequency, Monetary)","Google BigQuery + Looker Studio integration","dbt (data build tool) intro"], color:"#CE93D8" },
              ].map((w, i) => (
                <div key={i} style={{ border:`1px solid ${w.color}33`, borderLeft:`3px solid ${w.color}`, borderRadius:4, padding:"14px 18px", background:"#0D0D18" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10, flexWrap:"wrap", gap:8 }}>
                    <div>
                      <span style={{ fontSize:10, color:w.color, fontFamily:"monospace", letterSpacing:"0.15em", marginRight:12 }}>{w.week}</span>
                      <span style={{ fontSize:14, fontWeight:700, color:"#DDD8F0" }}>{w.title}</span>
                    </div>
                  </div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                    {w.topics.map(t => (
                      <span key={t} style={{ padding:"3px 9px", background:`${w.color}0D`, border:`1px solid ${w.color}25`, borderRadius:2, fontSize:11, color:"#777" }}>{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Phase 2 project preview */}
            <div style={{ border:"1px solid #FFD54F44", borderLeft:"4px solid #FFD54F", borderRadius:4, padding:"20px 22px", background:"rgba(255,213,79,0.04)", marginBottom:32 }}>
              <div style={{ fontSize:10, color:"#FFD54F", letterSpacing:"0.2em", fontFamily:"monospace", marginBottom:8 }}>PHASE 2 PROJECT</div>
              <div style={{ fontSize:18, fontWeight:900, color:"#DDD8F0", marginBottom:8 }}>🗃️ E-Commerce Analytics Engine</div>
              <p style={{ fontSize:13, color:"#888", lineHeight:1.7, margin:"0 0 14px" }}>
                Query a multi-million row e-commerce database in Google BigQuery. Use Gemini AI to write and optimise queries, build RFM customer segments, analyse conversion funnels, and create a Looker Studio report — exactly like a real data analyst job task.
              </p>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                {["BigQuery (free tier)","Gemini AI","Looker Studio","SQL (advanced)","RFM Segmentation"].map(t => (
                  <span key={t} style={{ padding:"3px 10px", background:"rgba(255,213,79,0.08)", border:"1px solid rgba(255,213,79,0.2)", borderRadius:2, fontSize:11, color:"#FFD54F" }}>{t}</span>
                ))}
              </div>
            </div>

            {/* AI tools coming in Phase 2 */}
            <Subheading>New AI Tools in Phase 2</Subheading>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:8, margin:"16px 0 36px" }}>
              {[
                { name:"GitHub Copilot for SQL", color:"#6E40C9" },
                { name:"SQLAI.ai",               color:"#FFD54F" },
                { name:"AI2sql",                 color:"#4FC3F7" },
                { name:"Gemini in BigQuery",     color:"#4285F4" },
                { name:"dbt + AI Docs",          color:"#FF694B" },
                { name:"Looker Studio AI",       color:"#34A853" },
              ].map(t => (
                <div key={t.name} style={{ border:`1px solid ${t.color}33`, borderRadius:4, padding:"12px 14px", background:"#0D0D18", display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ fontSize:14 }}>🤖</span>
                  <span style={{ fontSize:12, color:t.color, fontFamily:"monospace" }}>{t.name}</span>
                </div>
              ))}
            </div>

            <Callout icon="⚡" color="#FF8C42" title="Before You Start Phase 2 — Setup Checklist">
              ☐ Phase 1 project scored 75+ and saved<br />
              ☐ GitHub repo created with your Phase 1 workbook<br />
              ☐ Free Google account ready (needed for BigQuery + Looker Studio)<br />
              ☐ Google Cloud account created — <em>bigquery.cloud.google.com</em> (free tier: 10GB storage, 1TB queries/month)<br />
              ☐ GitHub Copilot enabled in VS Code (for SQL autocomplete)<br />
              ☐ Optional: Download DBeaver (free SQL client) for local SQL practice
            </Callout>

            <div style={{ marginTop:36, padding:"22px 26px", background:"#0D0D18", border:"1px solid #1A1A2E", borderRadius:4, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:16 }}>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:"#DDD8F0", marginBottom:4 }}>Ready to start Phase 2?</div>
                <div style={{ fontSize:12, color:"#555" }}>Say "Give me Phase 2 Part 1" to continue your journey.</div>
              </div>
              <div style={{ display:"flex", gap:10 }}>
                <div style={{ padding:"10px 20px", background:"rgba(255,140,66,0.12)", border:"1px solid rgba(255,140,66,0.3)", borderRadius:3, fontSize:12, color:"#FF8C42", fontFamily:"monospace", fontWeight:700 }}>
                  PHASE 2 → SQL MASTERY
                </div>
              </div>
            </div>

            <NavButtons onPrev={() => setActiveSection("review")} />
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
  return <h3 style={{ fontSize:16, fontWeight:700, color:"#DDD8F0", margin:"32px 0 12px", borderLeft:"3px solid #FF8C42", paddingLeft:12 }}>{children}</h3>;
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
        <button onClick={onNext} style={{ background:"#FF8C42", border:"none", borderRadius:3, padding:"8px 24px", cursor:"pointer", fontFamily:"monospace", fontSize:11, fontWeight:700, color:"#07070E", letterSpacing:"0.1em" }}>{nextLabel}</button>
      )}
    </div>
  );
}
