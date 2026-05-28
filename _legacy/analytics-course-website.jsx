import { useState, useEffect } from "react";

// ── COLOUR SYSTEM ─────────────────────────────────────────────
const C = {
  bg: "#07070E", surface: "#0D0D18", border: "#1A1A2E",
  text: "#DDD8F0", muted: "#888", dimmed: "#555",
  p1: "#81C784", p2: "#4FC3F7", p3: "#B2FF59",
  p4: "#FF8A65", p5: "#CE93D8", p6: "#FFD700",
  orange: "#FF6B35",
};

const PHASE_COLORS = [C.p1, C.p2, C.p3, C.p4, C.p5, C.p6];

// ── SHARED UI COMPONENTS ──────────────────────────────────────
function Tag({ children, col = C.p2 }) {
  return (
    <span style={{ padding: "3px 10px", background: col + "18", border: "1px solid " + col + "33", borderRadius: 2, fontSize: 11, color: col, fontFamily: "monospace", whiteSpace: "nowrap" }}>
      {children}
    </span>
  );
}
function SectionLabel({ children, col }) {
  return <div style={{ fontSize: 10, color: col, letterSpacing: "0.3em", fontFamily: "monospace", marginBottom: 6, textTransform: "uppercase" }}>{children}</div>;
}
function Heading({ children, size = 24, col = C.text }) {
  return <h2 style={{ margin: "0 0 12px", fontSize: size, fontWeight: 900, color: col, letterSpacing: "-0.02em", lineHeight: 1.2 }}>{children}</h2>;
}
function Body({ children }) {
  return <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.85, margin: "0 0 12px" }}>{children}</p>;
}
function Divider({ col = C.border }) {
  return <div style={{ height: 1, background: col, margin: "20px 0" }} />;
}
function CodeBlock({ code, col = C.p2, label }) {
  return (
    <div style={{ background: "#040408", border: "1px solid " + col + "22", borderRadius: 4, overflow: "hidden", marginBottom: 14 }}>
      {label && <div style={{ padding: "5px 14px", borderBottom: "1px solid " + col + "18" }}>
        <span style={{ fontSize: 9, color: col, letterSpacing: "0.15em", fontFamily: "monospace", fontWeight: 700 }}>{label}</span>
      </div>}
      <pre style={{ margin: 0, padding: "14px 16px", fontSize: 12, color: col, fontFamily: "monospace", lineHeight: 1.75, overflowX: "auto", whiteSpace: "pre" }}>{code}</pre>
    </div>
  );
}
function InfoBox({ children, col = C.p2, icon = "💡", title }) {
  return (
    <div style={{ margin: "12px 0", padding: "12px 16px", background: col + "08", border: "1px solid " + col + "25", borderLeft: "3px solid " + col, borderRadius: 4 }}>
      {title && <div style={{ fontSize: 12, color: col, fontWeight: 700, marginBottom: 5 }}>{icon} {title}</div>}
      <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.75 }}>{children}</div>
    </div>
  );
}
function PhaseChip({ num, col }) {
  return (
    <div style={{ width: 32, height: 32, borderRadius: "50%", background: col, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <span style={{ fontSize: 13, fontWeight: 900, color: C.bg }}>{num}</span>
    </div>
  );
}
function ConceptTable({ headers, rows, col }) {
  return (
    <div style={{ border: "1px solid " + C.border, borderRadius: 4, overflow: "hidden", marginBottom: 16 }}>
      {headers && (
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${headers.length}, 1fr)`, padding: "8px 14px", background: C.surface, borderBottom: "1px solid " + col + "33" }}>
          {headers.map((h, i) => <span key={i} style={{ fontSize: 9, color: col, fontFamily: "monospace", letterSpacing: "0.1em", fontWeight: 700 }}>{h}</span>)}
        </div>
      )}
      {rows.map((row, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: `repeat(${row.length}, 1fr)`, padding: "9px 14px", background: i % 2 === 0 ? "#0A0A14" : C.bg, borderBottom: i < rows.length - 1 ? "1px solid #0F0F18" : "none", alignItems: "start" }}>
          {row.map((cell, j) => <span key={j} style={{ fontSize: j === 0 ? 12 : 11, color: j === 0 ? col : C.muted, fontFamily: j === 0 ? "monospace" : "inherit", fontWeight: j === 0 ? 700 : 400, lineHeight: 1.5 }}>{cell}</span>)}
        </div>
      ))}
    </div>
  );
}

// ── NAVBAR ────────────────────────────────────────────────────
function Navbar({ page, setPage }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const phases = [
    { id: "p1", label: "P1 Excel", col: C.p1 },
    { id: "p2", label: "P2 SQL", col: C.p2 },
    { id: "p3", label: "P3 Python", col: C.p3 },
    { id: "p4", label: "P4 BI", col: C.p4 },
    { id: "p5", label: "P5 Cloud", col: C.p5 },
    { id: "p6", label: "P6 Career", col: C.p6 },
  ];
  const nav = (id) => { setPage(id); setMenuOpen(false); window.scrollTo(0,0); };
  return (
    <div style={{ background: C.surface, borderBottom: "1px solid " + C.border, position: "sticky", top: 0, zIndex: 200 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", height: 58 }}>
        <button onClick={() => nav("home")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, marginRight: 28 }}>
          <span style={{ fontSize: 15, fontWeight: 900, color: C.text, fontFamily: "monospace", letterSpacing: "-0.02em" }}>
            <span style={{ color: C.orange }}>101%</span> Analytics
          </span>
        </button>
        <div style={{ display: "flex", gap: 4, flex: 1, overflowX: "auto" }}>
          {phases.map(ph => (
            <button key={ph.id} onClick={() => nav(ph.id)} style={{
              background: page === ph.id ? ph.col + "15" : "none",
              border: "none", cursor: "pointer", padding: "5px 10px", borderRadius: 3,
              fontFamily: "monospace", fontSize: 10, color: page === ph.id ? ph.col : C.dimmed,
              whiteSpace: "nowrap", transition: "all 0.2s",
            }}>{ph.label}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, marginLeft: 12 }}>
          <button onClick={() => nav("curriculum")} style={{ background: "none", border: "1px solid " + C.border, borderRadius: 3, padding: "5px 12px", cursor: "pointer", fontFamily: "monospace", fontSize: 10, color: C.muted }}>Curriculum</button>
          <button onClick={() => nav("p1")} style={{ background: C.orange, border: "none", borderRadius: 3, padding: "5px 14px", cursor: "pointer", fontFamily: "monospace", fontSize: 10, fontWeight: 700, color: "#fff" }}>Start →</button>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// HOME PAGE
// ══════════════════════════════════════════════════════════════
function HomePage({ setPage }) {
  const features = [
    { icon: "🗄️", title: "SQL Mastery", desc: "From SELECT to window functions, RFM, cohort analysis and BigQuery", col: C.p2 },
    { icon: "🐍", title: "Python + ML", desc: "Pandas, EDA, Scikit-learn churn models, SHAP explainability", col: C.p3 },
    { icon: "📊", title: "4 BI Tools", desc: "Tableau LOD, Power BI DAX, Looker Studio, ThoughtSpot", col: C.p4 },
    { icon: "☁️", title: "Cloud + dbt", desc: "GCP, BigQuery, dbt models, Airflow DAGs, modern data stack", col: C.p5 },
    { icon: "🤖", title: "AI Integration", desc: "OpenAI API, LangChain RAG, Evidently monitoring, Copilot", col: C.p6 },
    { icon: "🎓", title: "Career Launch", desc: "Portfolio, CV, LinkedIn, 40 interview Q&As, salary negotiation", col: C.p6 },
  ];
  const stats = [
    { n: "16", label: "Weeks" }, { n: "6", label: "Phases" },
    { n: "5", label: "Live Projects" }, { n: "40+", label: "Interview Q&As" },
  ];
  const phases = [
    { n: 1, title: "Excel + Statistics + AI",        weeks: "Weeks 1-3", col: C.p1, tools: "Excel · Copilot · Power Query", id: "p1" },
    { n: 2, title: "SQL + BigQuery + Patterns",      weeks: "Weeks 4-6", col: C.p2, tools: "SQL · BigQuery · Gemini AI", id: "p2" },
    { n: 3, title: "Python + ML + Streamlit",        weeks: "Weeks 7-10", col: C.p3, tools: "Python · Scikit-learn · SHAP", id: "p3" },
    { n: 4, title: "BI Tools (4 Platforms)",         weeks: "Weeks 11-13", col: C.p4, tools: "Tableau · Power BI · Looker · ThoughtSpot", id: "p4" },
    { n: 5, title: "Cloud + Data Engineering + AI",  weeks: "Weeks 14-15", col: C.p5, tools: "dbt · Airflow · LangChain · OpenAI", id: "p5" },
    { n: 6, title: "Career Launch",                  weeks: "Week 16", col: C.p6, tools: "Portfolio · CV · Interviews · Salary", id: "p6" },
  ];
  return (
    <div>
      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #07070E 0%, #0D0510 100%)", borderBottom: "1px solid " + C.border, padding: "80px 24px 70px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.orange + "12", border: "1px solid " + C.orange + "25", borderRadius: 99, padding: "5px 16px", marginBottom: 24 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.orange, display: "inline-block" }} />
            <span style={{ fontSize: 12, color: C.orange, fontFamily: "monospace" }}>101% Job-Ready · 16-Week Course</span>
          </div>
          <h1 style={{ fontSize: "clamp(2.2rem,6vw,4rem)", fontWeight: 900, color: C.text, lineHeight: 1.08, letterSpacing: "-0.03em", margin: "0 0 20px" }}>
            Data Analytics with AI<br />
            <span style={{ color: C.orange }}>From Zero to Hired.</span>
          </h1>
          <p style={{ fontSize: 17, color: C.muted, lineHeight: 1.8, maxWidth: 580, margin: "0 auto 36px" }}>
            Master SQL, Python, Tableau, Power BI, dbt, Airflow and AI tools. Build 5 live portfolio projects. Land your first data analyst job.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 48 }}>
            <button onClick={() => setPage("p1")} style={{ background: C.orange, border: "none", borderRadius: 8, padding: "14px 32px", cursor: "pointer", fontFamily: "monospace", fontSize: 13, fontWeight: 700, color: "#fff", transition: "opacity 0.2s" }}>
              Start Phase 1 Free →
            </button>
            <button onClick={() => setPage("curriculum")} style={{ background: "none", border: "1px solid " + C.border, borderRadius: 8, padding: "14px 32px", cursor: "pointer", fontFamily: "monospace", fontSize: 13, color: C.muted }}>
              View Curriculum
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 1, maxWidth: 480, margin: "0 auto", borderRadius: 8, overflow: "hidden", border: "1px solid " + C.border }}>
            {stats.map((s, i) => (
              <div key={i} style={{ background: C.surface, padding: "16px 8px", textAlign: "center", borderRight: i < 3 ? "1px solid " + C.border : "none" }}>
                <div style={{ fontSize: 24, fontWeight: 900, color: C.text, fontFamily: "monospace" }}>{s.n}</div>
                <div style={{ fontSize: 11, color: C.dimmed }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "64px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <SectionLabel col={C.orange}>WHAT YOU WILL MASTER</SectionLabel>
          <Heading size={32}>Everything a Data Analyst Needs in 2025</Heading>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16 }}>
          {features.map((f, i) => (
            <div key={i} style={{ border: "1px solid " + f.col + "22", borderTop: "3px solid " + f.col, borderRadius: 6, padding: "20px", background: C.surface }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{f.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 6 }}>{f.title}</div>
              <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.65 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Phase overview */}
      <div style={{ background: C.surface, borderTop: "1px solid " + C.border, borderBottom: "1px solid " + C.border }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <SectionLabel col={C.orange}>THE CURRICULUM</SectionLabel>
            <Heading size={30}>6 Phases. 16 Weeks. 1 Job Offer.</Heading>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {phases.map((ph, i) => (
              <div key={i} onClick={() => setPage(ph.id)} style={{ border: "1px solid " + ph.col + "22", borderLeft: "4px solid " + ph.col, borderRadius: 5, padding: "16px 20px", background: C.bg, cursor: "pointer", display: "flex", alignItems: "center", gap: 16, transition: "background 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.background = ph.col + "07"}
                onMouseLeave={e => e.currentTarget.style.background = C.bg}>
                <PhaseChip num={ph.n} col={ph.col} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 3 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{ph.title}</span>
                    <span style={{ fontSize: 10, color: ph.col, fontFamily: "monospace" }}>{ph.weeks}</span>
                  </div>
                  <div style={{ fontSize: 12, color: C.dimmed }}>{ph.tools}</div>
                </div>
                <span style={{ color: ph.col, fontSize: 18 }}>→</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "64px 24px", textAlign: "center" }}>
        <Heading size={32} col={C.text}>Ready to Start?</Heading>
        <Body>Phase 1 is completely free. No credit card. No signup. Just open it and start learning.</Body>
        <div style={{ marginTop: 24 }}>
          <button onClick={() => setPage("p1")} style={{ background: C.orange, border: "none", borderRadius: 8, padding: "16px 40px", cursor: "pointer", fontFamily: "monospace", fontSize: 14, fontWeight: 700, color: "#fff" }}>
            Begin Phase 1 — Excel + Statistics →
          </button>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginTop: 24 }}>
          {["No prerequisites", "Beginner friendly", "AI tools throughout", "Real portfolio projects", "Job-ready in 16 weeks"].map(t => (
            <Tag key={t} col={C.p3}>{t}</Tag>
          ))}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// CURRICULUM PAGE
// ══════════════════════════════════════════════════════════════
function CurriculumPage({ setPage }) {
  const curriculum = [
    { n:1, col:C.p1, title:"Excel + Statistics + AI", weeks:"Weeks 1-3",
      parts:[
        { p:"Part 1", t:"Excel Fundamentals + Microsoft Copilot",          tools:"Excel · Copilot · Power Query" },
        { p:"Part 2", t:"Statistics for Analysts",                          tools:"Excel · ChatGPT · Python" },
        { p:"Part 3", t:"Advanced Excel + AI Integration",                  tools:"Excel · Julius AI · Copilot" },
        { p:"Part 4", t:"Phase 1 Capstone — RetailCo Sales Dashboard",      tools:"Excel · Power Query · Copilot" },
      ],
      capstone:"Automated Excel dashboard: £142K revenue, 4 regions, AI commentary",
      skills:["Pivot Tables","XLOOKUP","SUMIFS","Power Query","Descriptive Statistics","Correlation"],
    },
    { n:2, col:C.p2, title:"SQL + BigQuery + Business Analytics", weeks:"Weeks 4-6",
      parts:[
        { p:"Part 1", t:"SQL Fundamentals — SELECT to Subqueries",          tools:"MySQL · SQL · ChatGPT" },
        { p:"Part 2", t:"Advanced SQL — Window Functions + CTEs",           tools:"BigQuery · SQL" },
        { p:"Part 3", t:"BigQuery + RFM + Cohort + Funnel Analysis",        tools:"BigQuery · Gemini AI · SQLAI.ai" },
        { p:"Part 4", t:"E-Commerce Analytics Engine Capstone",             tools:"BigQuery · Looker Studio · SQL" },
      ],
      capstone:"SQL analytics engine: 50K orders, RFM segmentation, cohort retention, funnel",
      skills:["JOINs","Window Functions","CTEs","RFM","Cohort Analysis","Funnel Analysis"],
    },
    { n:3, col:C.p3, title:"Python for Analytics + Machine Learning", weeks:"Weeks 7-10",
      parts:[
        { p:"Part 1", t:"Python Fundamentals + AI Pair Programming",        tools:"Python · Pandas · GitHub Copilot" },
        { p:"Part 2", t:"Exploratory Data Analysis + Visualisation",        tools:"ydata-profiling · Plotly · Seaborn" },
        { p:"Part 3", t:"Data Wrangling + Scikit-learn + SHAP",            tools:"Pandas · Scikit-learn · SHAP · H2O" },
        { p:"Part 4", t:"Customer Intelligence Platform Capstone",          tools:"Python · Streamlit · Scikit-learn" },
      ],
      capstone:"Live Streamlit churn prediction app: 87% ROC-AUC, SHAP explanations",
      skills:["Pandas","EDA","Feature Engineering","Random Forest","SHAP","Streamlit"],
    },
    { n:4, col:C.p4, title:"BI Tools — 4 Platforms", weeks:"Weeks 11-13",
      parts:[
        { p:"Part 1", t:"Tableau + Einstein AI / Tableau Pulse",            tools:"Tableau · Einstein AI" },
        { p:"Part 2", t:"Power BI + DAX + Microsoft Copilot",               tools:"Power BI · DAX · Power Query" },
        { p:"Part 3", t:"ThoughtSpot + Looker Studio + Capstone",           tools:"ThoughtSpot · Looker · Gemini AI" },
      ],
      capstone:"Executive analytics suite: 4 live dashboards + written business narrative",
      skills:["Tableau LOD","DAX CALCULATE","Power Query","Data Blending","AI Narratives"],
    },
    { n:5, col:C.p5, title:"Cloud + Data Engineering + AI Ops", weeks:"Weeks 14-15",
      parts:[
        { p:"Part 1", t:"GCP + BigQuery + dbt + Apache Airflow",            tools:"GCP · dbt · Airflow" },
        { p:"Part 2", t:"LLMs + RAG + LangChain + Evidently + Capstone",    tools:"OpenAI · LangChain · Evidently" },
      ],
      capstone:"AI analytics platform: dbt + Airflow + RAG chatbot on Streamlit Cloud",
      skills:["Modern Data Stack","dbt Models","Airflow DAGs","RAG Pipeline","Drift Monitoring"],
    },
    { n:6, col:C.p6, title:"Career Launch", weeks:"Week 16",
      parts:[
        { p:"Part 1", t:"Portfolio + CV + LinkedIn + Interviews + Salary",  tools:"GitHub · LinkedIn · Streamlit Cloud" },
      ],
      capstone:"Job-ready portfolio, optimised CV, 40 interview Q&As, salary strategy",
      skills:["Portfolio","CV Writing","LinkedIn","SQL Interview","Case Studies","Negotiation"],
    },
  ];
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px 80px" }}>
      <SectionLabel col={C.orange}>FULL CURRICULUM</SectionLabel>
      <Heading size={34}>16-Week Course Breakdown</Heading>
      <Body>Every part includes: concept explanations, code examples, AI tool integration, practice exercises, and a 6-question quiz. Every phase ends with a capstone project that becomes part of your portfolio.</Body>
      <Divider />
      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 24 }}>
        {curriculum.map((ph, i) => (
          <div key={i} style={{ border: "1px solid " + ph.col + "33", borderRadius: 6, overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", background: ph.col + "0A", borderBottom: "1px solid " + ph.col + "22", display: "flex", alignItems: "center", gap: 14 }}>
              <PhaseChip num={ph.n} col={ph.col} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 2 }}>{ph.title}</div>
                <span style={{ fontSize: 10, color: ph.col, fontFamily: "monospace" }}>{ph.weeks} · {ph.parts.length} parts</span>
              </div>
              <button onClick={() => setPage("p" + ph.n)} style={{ background: ph.col, border: "none", borderRadius: 4, padding: "6px 14px", cursor: "pointer", fontFamily: "monospace", fontSize: 10, fontWeight: 700, color: C.bg }}>Open →</button>
            </div>
            <div style={{ padding: "14px 20px", background: C.bg }}>
              {ph.parts.map((p, j) => (
                <div key={j} style={{ display: "flex", gap: 12, marginBottom: j < ph.parts.length - 1 ? 10 : 0, paddingBottom: j < ph.parts.length - 1 ? 10 : 0, borderBottom: j < ph.parts.length - 1 ? "1px solid " + C.border : "none" }}>
                  <span style={{ fontSize: 10, color: ph.col, fontFamily: "monospace", minWidth: 44, paddingTop: 1 }}>{p.p}</span>
                  <div>
                    <div style={{ fontSize: 13, color: C.text, marginBottom: 3 }}>{p.t}</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {p.tools.split(" · ").map(t => <Tag key={t} col={ph.col}>{t}</Tag>)}
                    </div>
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 12, padding: "10px 12px", background: ph.col + "08", borderRadius: 3, border: "1px solid " + ph.col + "18" }}>
                <span style={{ fontSize: 10, color: ph.col, fontFamily: "monospace", fontWeight: 700 }}>CAPSTONE: </span>
                <span style={{ fontSize: 12, color: C.muted }}>{ph.capstone}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// PHASE 1 — EXCEL + STATISTICS + AI
// ══════════════════════════════════════════════════════════════
function Phase1() {
  const [tab, setTab] = useState("excel");
  const tabs = [
    { id:"excel", label:"Excel Fundamentals" },
    { id:"stats", label:"Statistics" },
    { id:"powerquery", label:"Power Query" },
    { id:"copilot", label:"Microsoft Copilot" },
  ];
  const excelCode = `-- Essential Excel Formulas
XLOOKUP(lookup, lookup_array, return_array)   -- modern VLOOKUP replacement
SUMIFS(sum_range, criteria_range, criteria)   -- conditional sum
COUNTIFS(range1, crit1, range2, crit2)        -- conditional count
AVERAGEIFS(avg_range, criteria_range, crit)   -- conditional average

-- Pivot Tables (most powerful Excel feature)
-- Insert > PivotTable > drag fields to:
-- Rows: Region | Columns: Quarter | Values: SUM(Revenue) | Filters: Status

-- Power Query transformations
-- Home > Transform Data
Table.RemoveDuplicates(Source)
Table.SelectRows(Source, each [status] = "Completed")
Table.AddColumn(Source, "revenue", each [units]*[price], type number)`;

  const statsCode = `-- Statistical concepts every analyst needs
Mean:        AVERAGE(B2:B1000)         -- affected by outliers
Median:      MEDIAN(B2:B1000)          -- robust to outliers
Mode:        MODE(B2:B1000)            -- most frequent value
Std Dev:     STDEV(B2:B1000)           -- spread around mean
Variance:    VAR(B2:B1000)             -- std dev squared
Percentile:  PERCENTILE(range, 0.75)   -- 75th percentile

-- Correlation (r): strength of linear relationship
CORREL(array1, array2)
-- r > 0.7  = strong | r > 0.9 = very strong
-- r < 0    = inverse | r = 0 = no correlation

-- When to use mean vs median:
-- Mean: symmetric data (heights, test scores)
-- Median: skewed data (income, house prices, revenue)`;

  const copilotCode = `-- Microsoft Copilot in Excel
-- Click Copilot button (top right) → type your request

"What are the top 3 trends in this revenue data?"
"Create a pivot table showing revenue by region and quarter"
"Write a formula to calculate year-over-year growth for each row"
"Find any anomalies or outliers in column B"
"Add a column calculating the running total of revenue"
"Which customers have the highest lifetime value?"

-- Copilot also:
-- Generates charts from your description
-- Writes complex formulas from plain English
-- Summarises your data in a paragraph
-- Creates conditional formatting rules`;

  const pqCode = `-- Power Query M Language patterns
-- Access: Home > Transform Data

// Filter rows
Table.SelectRows(Source, each [status] = "Completed")

// Add calculated column
Table.AddColumn(Source, "revenue", each [units] * [price])

// Change column type
Table.TransformColumnTypes(Source, {
    {"order_date", type date},
    {"revenue",    type number}
})

// Remove duplicates
Table.Distinct(Source)

// Merge queries (like SQL JOIN)
Table.NestedJoin(
    Orders, {"customer_id"},
    Customers, {"customer_id"},
    "CustomerData", JoinKind.LeftOuter
)`;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px 80px" }}>
      <div style={{ borderLeft: "3px solid " + C.p1, paddingLeft: 20, marginBottom: 36 }}>
        <SectionLabel col={C.p1}>PHASE 1 · WEEKS 1-3 · 4 PARTS</SectionLabel>
        <Heading size={34} col={C.text}>Excel + Statistics + AI Tools</Heading>
        <Body>Master Excel from the basics to advanced Power Query ETL, statistical analysis, and Microsoft Copilot AI. Build your first portfolio project — an automated RetailCo sales dashboard.</Body>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
          {["Excel","Pivot Tables","XLOOKUP","Power Query","Statistics","Microsoft Copilot","Julius AI"].map(t => <Tag key={t} col={C.p1}>{t}</Tag>)}
        </div>
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 24, borderBottom: "1px solid " + C.border, paddingBottom: 0 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ background:"none", border:"none", cursor:"pointer", padding:"10px 14px", fontFamily:"inherit", fontSize:12, color: tab===t.id ? C.p1 : C.dimmed, borderBottom: tab===t.id ? "2px solid "+C.p1 : "2px solid transparent", transition:"all 0.2s" }}>{t.label}</button>
        ))}
      </div>

      {tab === "excel" && (
        <div>
          <InfoBox col={C.p1} icon="📊" title="Why Excel First?">
            Excel is used by 750 million people. 80% of data analyst job postings mention it. Even SQL and Python users return to Excel for quick analysis. Master it properly — you use this knowledge forever.
          </InfoBox>
          <Heading size={18}>Essential Formulas</Heading>
          <CodeBlock code={excelCode} col={C.p1} label="EXCEL FORMULAS + PIVOT TABLES + POWER QUERY" />
          <Heading size={18}>Pivot Table Workflow</Heading>
          <ConceptTable headers={["Step","Action","Result"]} rows={[
            ["1. Select data","Click any cell in your data table","Excel detects the full table range"],
            ["2. Insert Pivot","Insert > PivotTable > New Sheet","Empty pivot table appears"],
            ["3. Add fields","Drag Region to Rows, Revenue to Values","Revenue grouped by region"],
            ["4. Add filters","Drag Status to Filters","Filter between Completed/Returned/All"],
            ["5. Add columns","Drag Quarter to Columns","Cross-tab: region × quarter"],
          ]} col={C.p1} />
        </div>
      )}
      {tab === "stats" && (
        <div>
          <InfoBox col={C.p1} icon="📈" title="Statistics is Pattern Recognition">
            Descriptive statistics describe what data looks like. Inferential statistics draw conclusions. As an analyst you need both — plus the judgement to know when mean vs median is appropriate.
          </InfoBox>
          <CodeBlock code={statsCode} col={C.p1} label="STATISTICAL FUNCTIONS IN EXCEL + INTERPRETATION" />
          <ConceptTable headers={["Concept","Formula","When to Use"]} rows={[
            ["Mean",        "AVERAGE(range)",          "Symmetric distributions: test scores, heights"],
            ["Median",      "MEDIAN(range)",            "Skewed data: income, house prices, revenue"],
            ["Std Dev",     "STDEV(range)",             "Measure of spread: low=consistent, high=volatile"],
            ["Correlation", "CORREL(arr1, arr2)",       "Linear relationship: r>0.7 is strong"],
            ["Percentile",  "PERCENTILE(range, 0.9)",   "90th percentile: top 10% threshold"],
            ["Normal test", "SKEW(range) near 0",       "Symmetric: SKEW()≈0. Right-skewed: SKEW()>1"],
          ]} col={C.p1} />
        </div>
      )}
      {tab === "powerquery" && (
        <div>
          <InfoBox col={C.p1} icon="⚙️" title="Power Query = ETL Without Code">
            Power Query records every transformation step. Click buttons to clean data visually — PQ writes the M code for you. This is how modern Excel analysts handle messy data.
          </InfoBox>
          <CodeBlock code={pqCode} col={C.p1} label="POWER QUERY M LANGUAGE — COMMON TRANSFORMS" />
          <ConceptTable headers={["Operation","How","Why"]} rows={[
            ["Change type",       "Click icon left of column name",            "Dates as text break all time analysis"],
            ["Remove duplicates", "Right-click column > Remove Duplicates",    "Duplicate order_id inflates all metrics"],
            ["Filter rows",       "Click dropdown arrow on column",            "Remove test orders, cancelled, date ranges"],
            ["Add column",        "Add Column > Custom Column",                "revenue = units * price — computed at load"],
            ["Merge queries",     "Home > Merge Queries > set join type",      "Join orders to customers (SQL JOIN equivalent)"],
            ["Unpivot",           "Select columns > Transform > Unpivot",      "Wide to long format for time analysis"],
          ]} col={C.p1} />
        </div>
      )}
      {tab === "copilot" && (
        <div>
          <InfoBox col={C.p1} icon="🤖" title="Microsoft Copilot in Excel">
            Copilot turns natural language into formulas, pivot tables, charts, and insights. Available in Microsoft 365 — the most practical AI tool for Excel-heavy workflows.
          </InfoBox>
          <CodeBlock code={copilotCode} col={C.p1} label="COPILOT PROMPTS — WHAT TO ASK" />
          <ConceptTable headers={["Use Case","Prompt Example"]} rows={[
            ["Formula writing",  "Write a SUMIFS formula to calculate revenue for North region, Completed orders only"],
            ["Trend analysis",   "What are the top 3 trends in this monthly revenue data? What is driving them?"],
            ["Anomaly detection","Find any outliers or anomalies in the revenue column and explain why they stand out"],
            ["Pivot creation",   "Create a pivot table showing total revenue by region with month-over-month comparison"],
            ["Narrative",        "Write a 3-bullet executive summary of this sales dashboard for a CEO who needs to act fast"],
          ]} col={C.p1} />
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// PHASE 2 — SQL + BIGQUERY
// ══════════════════════════════════════════════════════════════
function Phase2() {
  const [tab, setTab] = useState("fundamentals");
  const tabs = [
    { id:"fundamentals", label:"SQL Fundamentals" },
    { id:"windows", label:"Window Functions" },
    { id:"rfm", label:"RFM Analysis" },
    { id:"cohort", label:"Cohort + Funnel" },
  ];
  const fundamentalsCode = `-- SQL Execution Order (different from written order!)
-- FROM > JOIN > WHERE > GROUP BY > HAVING > SELECT > ORDER BY > LIMIT

-- Template: complete SELECT
SELECT
    region,
    SUM(revenue)           AS total_revenue,
    COUNT(*)               AS order_count,
    AVG(revenue)           AS avg_order_value
FROM     orders o
JOIN     customers c USING (customer_id)
WHERE    o.status = 'Completed'
  AND    o.order_date >= '2024-01-01'
GROUP BY region
HAVING   SUM(revenue) > 10000
ORDER BY total_revenue DESC
LIMIT    10;

-- JOIN types
INNER JOIN  -- only matching rows from BOTH tables
LEFT JOIN   -- all from left + matching from right (NULLs where no match)
FULL OUTER  -- all rows from BOTH tables

-- Subquery vs CTE (use CTE for readability)
WITH regional_totals AS (
    SELECT region, SUM(revenue) AS total
    FROM   orders WHERE status = 'Completed'
    GROUP BY region
)
SELECT *, total * 100.0 / SUM(total) OVER () AS pct_of_total
FROM   regional_totals;`;

  const windowCode = `-- Window Functions — compute across rows without collapsing
-- Syntax: function() OVER (PARTITION BY col ORDER BY col)

-- ROW_NUMBER: latest order per customer
SELECT *,
    ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date DESC) AS rn
FROM orders;
-- Filter WHERE rn = 1 to get each customer's most recent order

-- RANK vs DENSE_RANK
RANK()        -- 1, 1, 3 (skips 2 after tie)
DENSE_RANK()  -- 1, 1, 2 (no gaps)

-- LAG/LEAD — previous/next row value
LAG(revenue, 1) OVER (ORDER BY month)     -- previous month revenue
LEAD(revenue, 1) OVER (ORDER BY month)    -- next month revenue

-- Month-over-month change %
(revenue - LAG(revenue) OVER (ORDER BY month))
/ LAG(revenue) OVER (ORDER BY month) * 100 AS mom_growth_pct

-- Running total
SUM(revenue) OVER (ORDER BY order_date ROWS UNBOUNDED PRECEDING)

-- % of total per partition
revenue / SUM(revenue) OVER (PARTITION BY region) * 100 AS pct_of_region`;

  const rfmCode = `-- RFM Segmentation — gold standard customer analytics
-- Recency: days since last purchase (lower = better)
-- Frequency: number of orders (higher = better)
-- Monetary: total spend (higher = better)

WITH customer_rfm AS (
    SELECT
        customer_id,
        DATE_DIFF(CURRENT_DATE, MAX(order_date), DAY)  AS recency_days,
        COUNT(*)                                        AS frequency,
        SUM(revenue)                                    AS monetary
    FROM   orders
    WHERE  status = 'Completed'
    GROUP BY customer_id
),
rfm_scored AS (
    SELECT *,
        NTILE(4) OVER (ORDER BY recency_days ASC)  AS r_score,
        NTILE(4) OVER (ORDER BY frequency    DESC) AS f_score,
        NTILE(4) OVER (ORDER BY monetary     DESC) AS m_score
    FROM customer_rfm
)
SELECT *,
    CASE
        WHEN r_score = 4 AND f_score >= 3         THEN 'Champion'
        WHEN r_score >= 3 AND f_score >= 3        THEN 'Loyal'
        WHEN r_score = 4 AND f_score <= 2         THEN 'New Customer'
        WHEN r_score = 3 AND f_score <= 2         THEN 'Potential'
        WHEN r_score <= 2 AND f_score >= 3        THEN 'At Risk'
        WHEN r_score = 2 AND f_score <= 2         THEN 'Hibernating'
        ELSE                                           'Lost'
    END AS segment
FROM rfm_scored;`;

  const cohortCode = `-- COHORT RETENTION ANALYSIS
WITH cohorts AS (
    SELECT
        customer_id,
        DATE_TRUNC(MIN(order_date), MONTH) AS cohort_month
    FROM   orders
    GROUP BY customer_id
),
order_months AS (
    SELECT
        o.customer_id,
        c.cohort_month,
        DATE_TRUNC(o.order_date, MONTH) AS order_month,
        DATE_DIFF(
            DATE_TRUNC(o.order_date, MONTH),
            c.cohort_month, MONTH
        ) AS month_number
    FROM   orders o JOIN cohorts c USING (customer_id)
)
SELECT
    cohort_month,
    month_number,
    COUNT(DISTINCT customer_id)                               AS customers,
    COUNT(DISTINCT customer_id) * 100.0
        / FIRST_VALUE(COUNT(DISTINCT customer_id))
          OVER (PARTITION BY cohort_month ORDER BY month_number) AS retention_pct
FROM   order_months
GROUP BY cohort_month, month_number
ORDER BY cohort_month, month_number;

-- FUNNEL ANALYSIS
SELECT
    COUNT(DISTINCT CASE WHEN event='page_view'    THEN user_id END) AS step1_views,
    COUNT(DISTINCT CASE WHEN event='add_to_cart'  THEN user_id END) AS step2_cart,
    COUNT(DISTINCT CASE WHEN event='checkout'     THEN user_id END) AS step3_checkout,
    COUNT(DISTINCT CASE WHEN event='purchase'     THEN user_id END) AS step4_purchase
FROM user_events;`;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px 80px" }}>
      <div style={{ borderLeft: "3px solid " + C.p2, paddingLeft: 20, marginBottom: 36 }}>
        <SectionLabel col={C.p2}>PHASE 2 · WEEKS 4-6 · 4 PARTS</SectionLabel>
        <Heading size={34}>SQL + BigQuery + Business Analytics</Heading>
        <Body>Master SQL from the basics to advanced business intelligence patterns. RFM segmentation, cohort retention, funnel analysis, and BigQuery cloud analytics with Gemini AI.</Body>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
          {["SQL","BigQuery","Window Functions","CTEs","RFM","Cohort Analysis","Funnel","Gemini AI"].map(t => <Tag key={t} col={C.p2}>{t}</Tag>)}
        </div>
      </div>
      <div style={{ display: "flex", gap: 4, marginBottom: 24, borderBottom: "1px solid " + C.border, overflowX: "auto" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ background:"none", border:"none", cursor:"pointer", padding:"10px 14px", fontFamily:"inherit", fontSize:12, color: tab===t.id ? C.p2 : C.dimmed, borderBottom: tab===t.id ? "2px solid "+C.p2 : "2px solid transparent", whiteSpace:"nowrap" }}>{t.label}</button>
        ))}
      </div>
      {tab === "fundamentals" && (
        <div>
          <InfoBox col={C.p2} icon="📌" title="SQL Execution Order — Most Important Concept">
            Written order: SELECT FROM JOIN WHERE GROUP BY HAVING ORDER BY LIMIT. Execution order: FROM → JOIN → WHERE → GROUP BY → HAVING → SELECT → ORDER BY. You cannot filter on an alias in WHERE because SELECT runs after WHERE.
          </InfoBox>
          <CodeBlock code={fundamentalsCode} col={C.p2} label="SQL FUNDAMENTALS — SELECT TO CTEs" />
          <ConceptTable headers={["JOIN Type","Returns","Use When"]} rows={[
            ["INNER JOIN", "Rows matching in BOTH tables", "Only want clean matched records"],
            ["LEFT JOIN",  "All from left + matches from right", "Keep all orders, add customer data (NULLs where no match)"],
            ["RIGHT JOIN", "All from right + matches from left", "Rarely used — swap table order and use LEFT instead"],
            ["FULL OUTER", "All rows from BOTH tables", "Full audit — find unmatched records on either side"],
          ]} col={C.p2} />
        </div>
      )}
      {tab === "windows" && (
        <div>
          <InfoBox col={C.p2} icon="💡" title="Window Functions — the Most Powerful SQL Feature">
            Window functions compute a result across a set of rows related to the current row — without collapsing them into groups like GROUP BY. Every senior analyst uses them daily.
          </InfoBox>
          <CodeBlock code={windowCode} col={C.p2} label="WINDOW FUNCTIONS — ROW_NUMBER TO RUNNING TOTALS" />
        </div>
      )}
      {tab === "rfm" && (
        <div>
          <InfoBox col={C.p2} icon="👥" title="RFM — The Industry Standard for Customer Segmentation">
            RFM is used by Amazon, Netflix, and every major e-commerce company. Score each customer 1-4 on Recency, Frequency, and Monetary. Combine scores to label: Champion, Loyal, At Risk, Lost.
          </InfoBox>
          <CodeBlock code={rfmCode} col={C.p2} label="RFM SEGMENTATION — COMPLETE QUERY" />
          <ConceptTable headers={["Segment","R","F","M","Action"]} rows={[
            ["Champion",     "4", "3-4", "High",  "Reward and upsell"],
            ["Loyal",        "3-4","3-4","Medium","Loyalty program"],
            ["At Risk",      "1-2","3-4","High",  "Win-back campaign NOW"],
            ["New Customer", "4",  "1",  "Low",   "Onboarding sequence"],
            ["Hibernating",  "1-2","1-2","Low",   "Reactivation email"],
            ["Lost",         "1",  "1",  "Low",   "Sunset or last-ditch offer"],
          ]} col={C.p2} />
        </div>
      )}
      {tab === "cohort" && (
        <div>
          <InfoBox col={C.p2} icon="📉" title="Cohort Analysis reveals product quality over time">
            A cohort = customers who made their first purchase in the same month. Track what % return in Month 1, Month 2, Month 3. Improving cohort retention = your product is getting better.
          </InfoBox>
          <CodeBlock code={cohortCode} col={C.p2} label="COHORT RETENTION + FUNNEL ANALYSIS" />
          <ConceptTable headers={["Metric","Benchmark","Meaning if Low"]} rows={[
            ["Month 1 Retention","20-40% e-commerce","Onboarding problem or wrong customers"],
            ["Month 3 Retention","15-25% e-commerce","Product not delivering long-term value"],
            ["Funnel Step Drop","< 30% between steps","UX problem at that specific step"],
            ["Checkout Drop",   "60-80% is normal",   "Price shock, trust issue, payment friction"],
          ]} col={C.p2} />
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// PHASE 3 — PYTHON + ML
// ══════════════════════════════════════════════════════════════
function Phase3() {
  const [tab, setTab] = useState("pandas");
  const tabs = [
    { id:"pandas", label:"Pandas" },
    { id:"eda", label:"EDA Framework" },
    { id:"ml", label:"Scikit-learn" },
    { id:"shap", label:"SHAP + Deploy" },
  ];
  const pandasCode = `import pandas as pd
import numpy as np

df = pd.read_csv('orders.csv')

# First look — run these on EVERY new dataset
df.shape              # (rows, cols)
df.info()             # dtypes + null counts
df.describe()         # stats — compare mean vs 50% for skew
df.isnull().sum()     # nulls per column
df.duplicated().sum() # duplicate rows

# Filtering (boolean indexing)
completed = df[df['status'] == 'Completed']
north_big  = df[(df['region']=='North') & (df['revenue']>500)]

# GroupBy aggregation
summary = df.groupby('region').agg(
    total_revenue = ('revenue', 'sum'),
    order_count   = ('order_id', 'count'),
    avg_order_val = ('revenue', 'mean'),
    return_rate   = ('is_returned', 'mean'),
).reset_index()

# Derived columns
df['revenue']      = df['units'] * df['price']
df['profit']       = df['revenue'] - df['cost']
df['margin_pct']   = (df['profit'] / df['revenue'] * 100).round(1)
df['is_returned']  = (df['status'] == 'Returned').astype(int)
df['is_weekend']   = pd.to_datetime(df['order_date']).dt.dayofweek.isin([5,6]).astype(int)
df['order_month']  = pd.to_datetime(df['order_date']).dt.to_period('M')`;

  const edaCode = `# 7-Step EDA Framework — use on every new dataset

# Step 1: Shape and Schema
print(df.shape)          # (50000, 12) → 50K rows, 12 columns
print(df.dtypes)         # check object vs numeric vs datetime
print(df.columns.tolist())

# Step 2: Missing Values
missing = df.isnull().sum() / len(df) * 100
print(missing[missing > 0])  # show only columns with nulls
# > 20% missing = investigate upstream pipeline

# Step 3: Distributions
df['revenue'].hist(bins=50)             # right-skewed = use median
df['revenue'].skew()                    # > 1 = significantly skewed
df.describe()['revenue']                # min, 25%, 50%, 75%, max, std

# Step 4: Categorical Summaries
df['status'].value_counts()
df['region'].value_counts(normalize=True)  # as percentages
df['category'].nunique()                    # how many unique values

# Step 5: Correlations
df.corr(numeric_only=True)              # correlation matrix
df.corr()['revenue'].abs().sort_values(ascending=False)

# Step 6: Outlier Detection (IQR method)
Q1 = df['revenue'].quantile(0.25)
Q3 = df['revenue'].quantile(0.75)
IQR = Q3 - Q1
outliers = df[(df['revenue'] < Q1 - 1.5*IQR) | (df['revenue'] > Q3 + 1.5*IQR)]
print(f"{len(outliers)} outliers = {len(outliers)/len(df):.1%} of data")

# Step 7: One-line automated report
import ydata_profiling
profile = ydata_profiling.ProfileReport(df, title="RetailCo EDA")
profile.to_file("eda_report.html")      # opens in browser`;

  const mlCode = `from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing   import StandardScaler
from sklearn.ensemble        import RandomForestClassifier
from sklearn.metrics         import (classification_report,
                                     roc_auc_score, confusion_matrix)

# Feature engineering
features = ['recency_days', 'frequency', 'monetary',
            'avg_order_val', 'days_as_customer', 'return_rate']
X = df[features]
y = df['churned']     # 1 = churned, 0 = retained

# Split — stratify keeps class balance
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# Scale (required for distance-based models)
scaler = StandardScaler()
X_tr   = scaler.fit_transform(X_train)   # fit on train ONLY
X_te   = scaler.transform(X_test)        # same params on test

# Train Random Forest
rf = RandomForestClassifier(
    n_estimators=200,
    max_depth=None,
    min_samples_leaf=2,
    random_state=42,
    n_jobs=-1
)
rf.fit(X_tr, y_train)

# Evaluate
y_pred = rf.predict(X_te)
y_prob = rf.predict_proba(X_te)[:, 1]

print("ROC-AUC:", roc_auc_score(y_test, y_prob).round(4))
print(classification_report(y_test, y_pred))
# Target: ROC-AUC > 0.80 is good for churn prediction`;

  const shapCode = `import shap

# Create SHAP explainer
explainer   = shap.TreeExplainer(rf)
shap_values = explainer.shap_values(X_te)

# Global feature importance (which features matter most?)
shap.summary_plot(shap_values[1], X_te,
                  feature_names=features, plot_type='bar')

# Beeswarm plot (importance + direction)
shap.summary_plot(shap_values[1], X_te, feature_names=features)
# Points right (positive SHAP) = pushes toward churn
# Points left (negative SHAP)  = pushes away from churn

# Individual prediction explanation
shap.force_plot(
    explainer.expected_value[1],
    shap_values[1][0],
    X_te[0],
    feature_names=features
)

# Deploy as Streamlit app
import streamlit as st

st.title("RetailCo Churn Risk Dashboard")
st.metric("Model ROC-AUC", "87.3%")

uploaded = st.file_uploader("Upload customer CSV", type="csv")
if uploaded:
    new_df  = pd.read_csv(uploaded)
    X_new   = scaler.transform(new_df[features])
    probs   = rf.predict_proba(X_new)[:, 1]
    new_df['churn_risk'] = probs
    new_df['risk_label'] = pd.cut(probs, bins=[0,.3,.6,1],
                                   labels=['Low','Medium','High'])
    st.dataframe(new_df.sort_values('churn_risk', ascending=False))
    st.bar_chart(new_df['risk_label'].value_counts())`;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px 80px" }}>
      <div style={{ borderLeft: "3px solid " + C.p3, paddingLeft: 20, marginBottom: 36 }}>
        <SectionLabel col={C.p3}>PHASE 3 · WEEKS 7-10 · 4 PARTS</SectionLabel>
        <Heading size={34} col={C.text}>Python for Analytics + Machine Learning</Heading>
        <Body>Master Python data analysis with Pandas, the 7-step EDA framework, Scikit-learn machine learning, SHAP model explainability, and deploy a live Streamlit web app.</Body>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
          {["Python","Pandas","ydata-profiling","Scikit-learn","Random Forest","SHAP","H2O AutoML","Streamlit"].map(t => <Tag key={t} col={C.p3}>{t}</Tag>)}
        </div>
      </div>
      <div style={{ display: "flex", gap: 4, marginBottom: 24, borderBottom: "1px solid " + C.border, overflowX: "auto" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ background:"none", border:"none", cursor:"pointer", padding:"10px 14px", fontFamily:"inherit", fontSize:12, color: tab===t.id ? C.p3 : C.dimmed, borderBottom: tab===t.id ? "2px solid "+C.p3 : "2px solid transparent", whiteSpace:"nowrap" }}>{t.label}</button>
        ))}
      </div>
      {tab === "pandas" && (
        <div>
          <InfoBox col={C.p3} icon="🐼" title="Pandas — the Foundation of Python Analytics">
            Pandas is how analysts work with data in Python. Every data science role uses it daily. Master groupby, merge, and pivot_table and you can handle 90% of analytical tasks.
          </InfoBox>
          <CodeBlock code={pandasCode} col={C.p3} label="PANDAS — FROM LOAD TO PRODUCTION" />
        </div>
      )}
      {tab === "eda" && (
        <div>
          <InfoBox col={C.p3} icon="🔍" title="7-Step EDA Framework">
            Every data analyst runs EDA on every new dataset. This 7-step framework ensures you never miss a data quality issue, understand distributions before modelling, and discover the most important insights automatically.
          </InfoBox>
          <CodeBlock code={edaCode} col={C.p3} label="7-STEP EDA FRAMEWORK — COMPLETE" />
          <ConceptTable headers={["Step","What to Check","Red Flag"]} rows={[
            ["1 Shape","Row count vs source system","Missing rows = upstream pipeline failure"],
            ["2 Nulls","isnull().sum() / len(df)","More than 20% missing in key column"],
            ["3 Distributions","hist() + skew()","SKEW() > 1 means use median not mean"],
            ["4 Stats","describe() — mean vs 50%","Mean >> median = outliers pulling it up"],
            ["5 Categorical","value_counts()","Typos: 'completed' vs 'Completed' vs 'COMPLETED'"],
            ["6 Correlations","corr()","r > 0.95 between features = multicollinearity"],
            ["7 Outliers","IQR method","Investigate — may be data errors or real extremes"],
          ]} col={C.p3} />
        </div>
      )}
      {tab === "ml" && (
        <div>
          <InfoBox col={C.p3} icon="🤖" title="Machine Learning Pipeline">
            The standard ML pipeline: features → split → scale → train → evaluate. Always split before scaling to prevent data leakage. Target ROC-AUC over 0.80 for churn models.
          </InfoBox>
          <CodeBlock code={mlCode} col={C.p3} label="SCIKIT-LEARN CHURN PREDICTION PIPELINE" />
          <ConceptTable headers={["Metric","Meaning","Target"]} rows={[
            ["ROC-AUC","Ability to distinguish churn vs retain","> 0.80 is good; > 0.85 is excellent"],
            ["Precision","Of predicted churners, % actually churn","High = fewer wasted win-back campaigns"],
            ["Recall","Of actual churners, % we predicted","High = catch more real churners"],
            ["F1 Score","Harmonic mean of precision + recall","Balanced metric when classes are unequal"],
          ]} col={C.p3} />
        </div>
      )}
      {tab === "shap" && (
        <div>
          <InfoBox col={C.p3} icon="💡" title="SHAP — Explain Any ML Model in Plain English">
            SHAP (SHapley Additive exPlanations) tells you exactly WHY a model made a specific prediction. Not just which features are important globally — but how each feature pushed THIS customer's churn probability up or down.
          </InfoBox>
          <CodeBlock code={shapCode} col={C.p3} label="SHAP EXPLAINABILITY + STREAMLIT DEPLOYMENT" />
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// PHASE 4 — BI TOOLS
// ══════════════════════════════════════════════════════════════
function Phase4() {
  const [tab, setTab] = useState("tableau");
  const tabs = [
    { id:"tableau", label:"Tableau" },
    { id:"powerbi", label:"Power BI + DAX" },
    { id:"looker", label:"Looker + ThoughtSpot" },
    { id:"design", label:"Dashboard Design" },
  ];
  const tableauCode = `-- Tableau Calculated Fields

-- Basic aggregation
Margin %     = ([Revenue] - [Cost]) / [Revenue]
Profit       = SUM([Revenue]) - SUM([Cost])

-- Conditional logic
Revenue Tier = IF [Revenue] >= 1000 THEN 'High'
               ELSEIF [Revenue] >= 500 THEN 'Medium'
               ELSE 'Low' END

-- LOD Expressions (Level of Detail)
-- FIXED: compute at region level, ignore current view filters
Region Revenue  = { FIXED [Region] : SUM([Revenue]) }

-- FIXED: % of total (like CALCULATE ALL in DAX)
% of Total      = SUM([Revenue]) / { FIXED : SUM([Revenue]) }

-- INCLUDE: add a dimension to the current level
Customer Count  = { INCLUDE [Customer ID] : COUNTD([Customer ID]) }

-- EXCLUDE: remove a dimension from the current level
Brand Revenue   = { EXCLUDE [Product] : SUM([Revenue]) }

-- Parameter: dynamic metric switcher
Select Metric   = CASE [Metric Param]
                  WHEN 'Revenue' THEN SUM([Revenue])
                  WHEN 'Profit'  THEN SUM([Profit])
                  WHEN 'Orders'  THEN COUNTD([Order ID])
                  END`;

  const daxCode = `-- Power BI DAX Measures

-- Basic aggregations
Total Revenue  = SUM(orders[revenue])
Total Orders   = COUNTROWS(orders)
Return Rate    = DIVIDE(
                     CALCULATE(COUNTROWS(orders),
                               orders[status]="Returned"),
                     COUNTROWS(orders), 0)

-- CALCULATE: the most important DAX function
-- Evaluates expression with modified filter context
North Revenue  = CALCULATE([Total Revenue], orders[region]="North")
Completed Rev  = CALCULATE([Total Revenue], orders[status]="Completed")

-- ALL: remove filters (like FIXED LOD in Tableau)
% of Total     = DIVIDE([Total Revenue],
                     CALCULATE([Total Revenue], ALL(orders)), 0)

-- Time intelligence (requires a marked Date table)
Revenue YTD    = CALCULATE([Total Revenue],
                     DATESYTD(DateTable[Date]))

Revenue MoM %  = VAR curr  = [Total Revenue]
                 VAR prev   = CALCULATE([Total Revenue],
                                  DATEADD(DateTable[Date], -1, MONTH))
                 RETURN DIVIDE(curr - prev, prev, 0)

Revenue SPLY   = CALCULATE([Total Revenue],
                     SAMEPERIODLASTYEAR(DateTable[Date]))

-- RANKX: rank products by revenue
Product Rank   = RANKX(ALL(orders[product]),
                     [Total Revenue], , DESC, Dense)`;

  const lookerCode = `# Looker Studio — calculated fields
revenue    = units * price
profit     = units * (price - cost)
margin_pct = (revenue - cost) / revenue * 100
is_returned = CASE WHEN status = 'Returned' THEN 1 ELSE 0 END

# Gemini AI in Looker Studio — prompt examples
"Show total revenue by region as a bar chart"
"Create a line chart of monthly revenue trend for 2024"
"Summarise the key trends in this dashboard"
"Which region is underperforming vs last quarter?"

# ThoughtSpot search queries (type directly in search bar)
revenue by region
top 10 products by revenue 2024
monthly orders where status = completed
return rate by category pie chart
customers with more than 5 orders

# ThoughtSpot Spotter AI — conversational analytics
"Why did revenue drop in August?"
"What is driving the highest return rate?"
"Which customer segment is most at risk?"`;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px 80px" }}>
      <div style={{ borderLeft: "3px solid " + C.p4, paddingLeft: 20, marginBottom: 36 }}>
        <SectionLabel col={C.p4}>PHASE 4 · WEEKS 11-13 · 3 PARTS</SectionLabel>
        <Heading size={34} col={C.text}>BI Tools — 4 Platforms</Heading>
        <Body>Master Tableau with LOD expressions, Power BI with DAX and CALCULATE, Looker Studio with Gemini AI, and ThoughtSpot's search-driven analytics. Build an executive analytics suite as your capstone.</Body>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
          {["Tableau","LOD Expressions","Power BI","DAX","CALCULATE","Looker Studio","Gemini AI","ThoughtSpot"].map(t => <Tag key={t} col={C.p4}>{t}</Tag>)}
        </div>
      </div>
      <div style={{ display: "flex", gap: 4, marginBottom: 24, borderBottom: "1px solid " + C.border, overflowX: "auto" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ background:"none", border:"none", cursor:"pointer", padding:"10px 14px", fontFamily:"inherit", fontSize:12, color: tab===t.id ? C.p4 : C.dimmed, borderBottom: tab===t.id ? "2px solid "+C.p4 : "2px solid transparent", whiteSpace:"nowrap" }}>{t.label}</button>
        ))}
      </div>
      {tab === "tableau" && (
        <div>
          <InfoBox col={C.p4} icon="📊" title="Tableau LOD — the Most Powerful Tableau Feature">
            Level of Detail expressions compute at a different granularity than the current view. FIXED ignores all view filters. INCLUDE adds a dimension. EXCLUDE removes one. Master these and you can answer any analytical question in Tableau.
          </InfoBox>
          <CodeBlock code={tableauCode} col={C.p4} label="TABLEAU CALCULATED FIELDS + LOD EXPRESSIONS" />
          <ConceptTable headers={["LOD Type","Syntax","Use When"]} rows={[
            ["FIXED",   "{ FIXED [dim] : AGG([measure]) }","Compute metric at specific dim, ignoring view filters"],
            ["INCLUDE", "{ INCLUDE [dim] : AGG([measure]) }","Add granularity below current view level"],
            ["EXCLUDE", "{ EXCLUDE [dim] : AGG([measure]) }","Remove a dimension from the current context"],
          ]} col={C.p4} />
        </div>
      )}
      {tab === "powerbi" && (
        <div>
          <InfoBox col={C.p4} icon="⚡" title="CALCULATE — The Most Important DAX Function">
            CALCULATE(expression, filter1, filter2...) evaluates any measure with modified filters. It overrides the natural filter context of a visual. Without CALCULATE, you cannot write most useful DAX measures.
          </InfoBox>
          <CodeBlock code={daxCode} col={C.p4} label="DAX MEASURES — CALCULATE TO TIME INTELLIGENCE" />
          <ConceptTable headers={["Concept","Measure vs Column"]} rows={[
            ["Measure",     "Computed at query time, responds to all filters, no storage. Use for: SUM, COUNT, AVERAGE, ratios"],
            ["Calc Column", "Computed at load time, stored in table, ignores filters. Use for: Profit = Revenue - Cost (row-level)"],
            ["ALL()",       "Removes all filters from table. Used in % of total: denominator must be unfiltered grand total"],
            ["DATEADD",     "Time shift: DATEADD(DateTable[Date], -1, MONTH) = previous month. Requires a proper Date table"],
          ]} col={C.p4} />
        </div>
      )}
      {tab === "looker" && (
        <div>
          <InfoBox col={C.p4} icon="🆓" title="Looker Studio — Best Free BI Tool">
            Completely free. 800+ connectors. Gemini AI generates charts from text. Shareable via link — anyone with Google account can view. Perfect for Google Workspace organisations and portfolio demos.
          </InfoBox>
          <CodeBlock code={lookerCode} col={C.p4} label="LOOKER STUDIO + THOUGHTSPOT + GEMINI AI" />
          <ConceptTable headers={["Tool","Best For","Cost"]} rows={[
            ["Tableau",       "Complex interactive dashboards, LOD, custom visuals","$70/month"],
            ["Power BI",      "Microsoft 365 integration, DAX, enterprise reporting","Free + $10/month"],
            ["Looker Studio", "Google ecosystem, free sharing, quick dashboards",   "Free"],
            ["ThoughtSpot",   "Search-driven self-service, Spotter AI root cause",  "Enterprise"],
          ]} col={C.p4} />
        </div>
      )}
      {tab === "design" && (
        <div>
          <InfoBox col={C.p4} icon="🎨" title="Dashboard Design Principles">
            A beautiful dashboard that does not answer the right question is useless. A useful dashboard that is hard to read will not be used. You need both.
          </InfoBox>
          {[
            { p:"One question per dashboard", d:"Everything on the page should answer a single business question. More questions = more dashboards.", col: C.p4 },
            { p:"KPIs first, context second", d:"Put 3-4 metric cards at the top. Charts below. Data tables at the bottom if at all.", col: "#FFD54F" },
            { p:"Filter actions over separate pages", d:"Click a region bar to filter everything on the page — do not build 6 separate region dashboards.", col: "#81C784" },
            { p:"Remove everything that does not earn its place", d:"Turn off gridlines, borders, chart titles when obvious. White space improves readability dramatically.", col: "#4FC3F7" },
            { p:"Consistent colour with meaning", d:"Red = bad performance. Green = good. Grey = context. Use the same colour for the same category across all charts.", col: "#CE93D8" },
            { p:"Design for your audience", d:"CEO wants 3 numbers and a recommendation. Analyst wants 6 charts and drill-down. Build for who will use it.", col: "#F48FB1" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 14, padding: "12px 0", borderBottom: i < 5 ? "1px solid " + C.border : "none" }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: item.col, marginTop: 4, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 3 }}>{item.p}</div>
                <div style={{ fontSize: 13, color: C.muted }}>{item.d}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// PHASE 5 — CLOUD + AI OPS
// ══════════════════════════════════════════════════════════════
function Phase5() {
  const [tab, setTab] = useState("stack");
  const tabs = [
    { id:"stack", label:"Data Stack" },
    { id:"dbt", label:"dbt" },
    { id:"airflow", label:"Airflow" },
    { id:"rag", label:"RAG + LLMs" },
  ];
  const dbtCode = `-- dbt Staging Model: models/staging/stg_orders.sql
{{ config(materialized='view') }}

SELECT
    order_id,
    customer_id,
    UPPER(TRIM(region))              AS region,
    UPPER(TRIM(status))              AS status,
    order_date::DATE                 AS order_date,
    units::INTEGER                   AS units,
    price::NUMERIC                   AS unit_price,
    units * price                    AS revenue,
    units * (price - cost)           AS profit
FROM {{ source('raw', 'orders') }}
WHERE order_id IS NOT NULL;

-- dbt Mart Model: models/marts/fct_orders.sql
{{ config(materialized='table') }}

SELECT
    o.*,
    c.country,
    c.segment                        AS customer_segment,
    p.category,
    DATE_TRUNC(o.order_date, MONTH)  AS order_month
FROM {{ ref('stg_orders') }}      o
LEFT JOIN {{ ref('stg_customers') }} c USING (customer_id)
LEFT JOIN {{ ref('stg_products') }}  p USING (product_id);

-- schema.yml: data quality tests
-- unique, not_null, accepted_values, relationships
-- dbt run    → build all models
-- dbt test   → run all quality tests
-- dbt docs serve → open data catalogue`;

  const airflowCode = `# Apache Airflow DAG — RetailCo daily pipeline
from airflow import DAG
from airflow.operators.bash import BashOperator
from datetime import datetime, timedelta

with DAG(
    dag_id='retailco_daily_pipeline',
    schedule_interval='0 6 * * *',   # 6am every day
    start_date=datetime(2024, 1, 1),
    catchup=False,
    default_args={
        'retries': 2,
        'retry_delay': timedelta(minutes=5),
        'email_on_failure': True,
    },
) as dag:

    upload = BashOperator(
        task_id='upload_to_gcs',
        bash_command='gsutil cp /data/orders.csv gs://retailco-raw/'
    )
    load = BashOperator(
        task_id='load_to_bigquery',
        bash_command='bq load --autodetect retailco:staging.orders gs://retailco-raw/orders.csv'
    )
    run_dbt = BashOperator(
        task_id='dbt_run',
        bash_command='cd /dbt/retailco_dbt && dbt run --target prod'
    )
    test_dbt = BashOperator(
        task_id='dbt_test',
        bash_command='cd /dbt/retailco_dbt && dbt test --target prod'
    )

    # Define execution order
    upload >> load >> run_dbt >> test_dbt`;

  const ragCode = `# RAG Pipeline: LangChain + FAISS + OpenAI
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from langchain.schema import Document
import pandas as pd

# Step 1: Load data and convert to Documents
df = pd.read_csv('customer_features.csv')
docs = [Document(page_content=row.to_string())
        for _, row in df.iterrows()]

# Step 2: Embed into vector store
embeddings = OpenAIEmbeddings()
vectordb   = FAISS.from_documents(docs, embeddings)

# Step 3: Custom prompt — grounds LLM in YOUR data
prompt = PromptTemplate(
    input_variables=['context', 'question'],
    template=(
        'You are a RetailCo data analyst. '
        'Answer using ONLY the context below. '
        'If not in context, say you do not know.\\n\\n'
        'Context: {context}\\n\\nQuestion: {question}'
    )
)

# Step 4: Build Q&A chain
llm = ChatOpenAI(model='gpt-4o-mini', temperature=0)
qa  = RetrievalQA.from_chain_type(
    llm=llm,
    retriever=vectordb.as_retriever(search_kwargs={'k': 5}),
    chain_type_kwargs={'prompt': prompt}
)

# Step 5: Ask questions
print(qa.invoke('Which customers are most at risk of churning?'))
print(qa.invoke('What is the average monetary value for Champions?'))`;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px 80px" }}>
      <div style={{ borderLeft: "3px solid " + C.p5, paddingLeft: 20, marginBottom: 36 }}>
        <SectionLabel col={C.p5}>PHASE 5 · WEEKS 14-15 · 2 PARTS</SectionLabel>
        <Heading size={34} col={C.text}>Cloud + Data Engineering + AI Ops</Heading>
        <Body>Learn the modern data stack, build dbt transformation pipelines, schedule with Airflow, and integrate LLMs into your analytics workflow with RAG pipelines and model monitoring.</Body>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
          {["GCP","BigQuery","dbt","Apache Airflow","LangChain","OpenAI API","FAISS","Evidently"].map(t => <Tag key={t} col={C.p5}>{t}</Tag>)}
        </div>
      </div>
      <div style={{ display: "flex", gap: 4, marginBottom: 24, borderBottom: "1px solid " + C.border, overflowX: "auto" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ background:"none", border:"none", cursor:"pointer", padding:"10px 14px", fontFamily:"inherit", fontSize:12, color: tab===t.id ? C.p5 : C.dimmed, borderBottom: tab===t.id ? "2px solid "+C.p5 : "2px solid transparent", whiteSpace:"nowrap" }}>{t.label}</button>
        ))}
      </div>
      {tab === "stack" && (
        <div>
          <InfoBox col={C.p5} icon="🏗️" title="The Modern Data Stack">
            This 7-layer architecture is used by Spotify, Airbnb, GitLab, and every data-driven company. Understanding it makes you dramatically more effective — you know where data comes from, where it breaks, and how to fix it.
          </InfoBox>
          <ConceptTable headers={["Layer","Tools","Purpose"]} rows={[
            ["01 Sources",     "CRM · App DB · APIs · Spreadsheets",          "Where data is born"],
            ["02 Ingestion",   "Fivetran · Airbyte · Stitch",                  "Move raw data into warehouse automatically"],
            ["03 Warehouse",   "BigQuery · Snowflake · Databricks · Redshift", "Central analytics storage"],
            ["04 Transform",   "dbt (SQL models) · Python scripts",            "Clean, model, and enrich data"],
            ["05 Orchestrate", "Apache Airflow · Prefect · Dagster",           "Schedule and monitor pipelines"],
            ["06 Semantic",    "dbt metrics · Looker LookML",                  "Define business metrics once, use everywhere"],
            ["07 BI",          "Tableau · Power BI · Looker Studio",           "Visualise for analysts and stakeholders"],
          ]} col={C.p5} />
          <ConceptTable headers={["Concept","Definition"]} rows={[
            ["Data Warehouse", "Structured, SQL-queryable, column-oriented for fast analytics. BigQuery, Snowflake."],
            ["Data Lake",      "Raw files (CSV/JSON/Parquet), any format, cheap. GCS, S3. Needs processing before analysis."],
            ["Lakehouse",      "Combines warehouse performance with lake storage. Databricks Delta Lake, BigLake."],
            ["ELT vs ETL",     "ETL: transform before loading. ELT: load raw, transform in warehouse with dbt. Modern stacks use ELT."],
          ]} col={C.p5} />
        </div>
      )}
      {tab === "dbt" && (
        <div>
          <InfoBox col={C.p5} icon="🔧" title="dbt — SQL with Software Engineering">
            dbt adds version control, dependency management (ref()), automated testing, and auto-generated documentation to SQL. It is the single tool that most distinguishes modern data teams from traditional ones.
          </InfoBox>
          <CodeBlock code={dbtCode} col={C.p5} label="DBT STAGING + MART MODELS" />
          <ConceptTable headers={["Concept","Definition"]} rows={[
            ["ref()",          "Creates dependency between models. dbt builds stg_orders before anything that references it."],
            ["source()",       "References raw tables not built by dbt. Defined in sources.yml with freshness tests."],
            ["view",           "Runs SQL on every query. No storage cost. Use for staging models."],
            ["table",          "Built once at dbt run time. Stored result. Use for mart models queried by BI tools."],
            ["dbt test",       "Runs: unique, not_null, accepted_values, relationships. Fails = pipeline stops."],
          ]} col={C.p5} />
        </div>
      )}
      {tab === "airflow" && (
        <div>
          <InfoBox col={C.p5} icon="🌊" title="Apache Airflow — Pipeline Orchestration">
            Without Airflow, your dbt models run manually. With Airflow, they run automatically every morning before the business wakes up, with retry logic, alerts, and monitoring.
          </InfoBox>
          <CodeBlock code={airflowCode} col={C.p5} label="AIRFLOW DAG — COMPLETE RETAILCO PIPELINE" />
          <ConceptTable headers={["Concept","Definition"]} rows={[
            ["DAG",          "Directed Acyclic Graph — your pipeline definition. Tasks + dependencies."],
            ["Operator",     "BashOperator: shell. PythonOperator: Python function. BigQueryOperator: SQL."],
            ["task >> task", "Execution order. upload >> load >> dbt means: each must succeed before next starts."],
            ["retries",      "If task fails, wait retry_delay then try again. retries=2, retry_delay=5min is standard."],
            ["schedule",     "Cron expression: '0 6 * * *' = 6am every day. '@daily' = midnight. None = manual."],
          ]} col={C.p5} />
        </div>
      )}
      {tab === "rag" && (
        <div>
          <InfoBox col={C.p5} icon="🔍" title="RAG — Ground LLM Answers in YOUR Data">
            Plain LLMs answer from training data and hallucinate. RAG (Retrieval Augmented Generation) retrieves relevant chunks from your own database first, then generates answers grounded in your specific data. Always use temperature=0 for analytics tasks.
          </InfoBox>
          <CodeBlock code={ragCode} col={C.p5} label="LANGCHAIN RAG PIPELINE — COMPLETE" />
          <ConceptTable headers={["Concept","Definition"]} rows={[
            ["Embedding",      "A list of numbers representing the semantic meaning of text. Similar meanings = similar vectors."],
            ["Vector DB",      "Stores embeddings, searches by semantic similarity. FAISS (free), Pinecone (cloud)."],
            ["RAG",            "Retrieve relevant docs → pass as context to LLM → generate grounded answer."],
            ["temperature=0",  "Deterministic output — same question always gets same answer. Critical for analytics."],
            ["Data drift",     "Input distributions shift after model deployment. Evidently detects it. Retrain if >30% drift."],
          ]} col={C.p5} />
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// PHASE 6 — CAREER LAUNCH
// ══════════════════════════════════════════════════════════════
function Phase6({ setPage }) {
  const [tab, setTab] = useState("portfolio");
  const tabs = [
    { id:"portfolio", label:"Portfolio" },
    { id:"cv", label:"CV Guide" },
    { id:"interview", label:"Interviews" },
    { id:"salary", label:"Salary" },
  ];
  const projects = [
    { n:1, col:C.p1, title:"Excel Dashboard",      tools:"Excel · Copilot",    link:"Google Drive or GitHub",         pitch:"Automated Excel dashboard analysing £142K annual revenue across 4 regions. Used Power Query for data cleaning and Copilot to generate trend analysis commentary." },
    { n:2, col:C.p2, title:"SQL Analytics Engine", tools:"BigQuery · SQL",     link:"GitHub + Looker Studio URL",     pitch:"SQL analytics engine in BigQuery for 50,000-order e-commerce dataset. Production-grade RFM segmentation, monthly cohort retention (48% M1), 5-step funnel identifying 60% checkout drop-off." },
    { n:3, col:C.p3, title:"Churn Prediction App", tools:"Python · Streamlit", link:"GitHub + Streamlit Cloud URL",   pitch:"End-to-end churn prediction platform: 87% ROC-AUC Random Forest, SHAP explanations, deployed as live Streamlit web app on Streamlit Cloud." },
    { n:4, col:C.p4, title:"Executive BI Suite",   tools:"Tableau · Power BI", link:"Tableau Public + Power BI URL",  pitch:"Four-tool executive analytics suite: Tableau for operations, Power BI with DAX time intelligence, Looker Studio with Gemini AI, ThoughtSpot self-service." },
    { n:5, col:C.p5, title:"AI Analytics Platform",tools:"dbt · LangChain",   link:"GitHub + Streamlit Chatbot URL", pitch:"Production AI platform: dbt models in BigQuery, Airflow DAG (daily 6am), LangChain RAG chatbot deployed on Streamlit Cloud, Evidently drift monitoring." },
  ];
  const salaryData = [
    ["Junior (0-2 yrs)",   "£28-40K", "$60-85K",   "$50-70K"],
    ["Mid (2-5 yrs)",      "£40-60K", "$85-120K",  "$70-100K"],
    ["Senior (5+ yrs)",    "£60-90K", "$120-180K", "$100-150K"],
    ["Analytics Engineer", "£55-85K", "$130-190K", "$110-160K"],
  ];
  const topQuestions = [
    { type:"SQL", q:"Write a query to find the top 3 customers by revenue in each region.", a:"ROW_NUMBER() OVER (PARTITION BY region ORDER BY revenue DESC) — filter WHERE rn <= 3. Use DENSE_RANK() if you want ties included." },
    { type:"SQL", q:"What is the difference between WHERE and HAVING?", a:"WHERE filters individual rows BEFORE aggregation. HAVING filters groups AFTER GROUP BY. Use HAVING when filtering on an aggregate: HAVING SUM(revenue) > 1000." },
    { type:"Python", q:"How do you handle 30% null values in a key column?", a:"Investigate WHY they are null first. If random: impute with median/mode. If systematic: pipeline issue upstream. Never auto-drop without understanding the cause." },
    { type:"BI", q:"What does CALCULATE() do in DAX?", a:"Evaluates any measure with a modified filter context. Most important DAX function. CALCULATE([Revenue], ALL(orders)) removes all filters — used for % of total." },
    { type:"ML", q:"What is overfitting and how do you detect it?", a:"Model memorises training data, fails on new data. Detect: large gap between train vs test accuracy, or cross-validation score much lower than training score." },
    { type:"Case", q:"Revenue dropped 15% last month. Walk me through your investigation.", a:"(1) Verify: check for data pipeline issues first. (2) Segment: by region, product, channel. (3) Find the 80% driver. (4) Hypothesise cause. (5) Quantify and recommend action." },
    { type:"STAR", q:"Tell me about a time you found an insight that changed a business decision.", a:"Use STAR: Situation → Task → Action (specific steps) → Result (quantified). Prepare 4-5 stories from your portfolio projects that you can adapt." },
  ];
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px 80px" }}>
      <div style={{ borderLeft: "3px solid " + C.p6, paddingLeft: 20, marginBottom: 36 }}>
        <SectionLabel col={C.p6}>PHASE 6 · WEEK 16</SectionLabel>
        <Heading size={34} col={C.text}>Career Launch — Get Hired</Heading>
        <Body>Everything you need to turn 5 phases of skills into a job offer: portfolio review, CV writing, LinkedIn optimisation, 40 interview Q&As, and salary negotiation.</Body>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
          {["Portfolio","CV","LinkedIn","SQL Interviews","Python Interviews","Case Studies","Salary Negotiation"].map(t => <Tag key={t} col={C.p6}>{t}</Tag>)}
        </div>
      </div>
      <div style={{ display: "flex", gap: 4, marginBottom: 24, borderBottom: "1px solid " + C.border, overflowX: "auto" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ background:"none", border:"none", cursor:"pointer", padding:"10px 14px", fontFamily:"inherit", fontSize:12, color: tab===t.id ? C.p6 : C.dimmed, borderBottom: tab===t.id ? "2px solid "+C.p6 : "2px solid transparent", whiteSpace:"nowrap" }}>{t.label}</button>
        ))}
      </div>
      {tab === "portfolio" && (
        <div>
          <InfoBox col={C.p6} icon="📁" title="Your Portfolio — 5 Live Projects">
            Every project needs: (1) a live, clickable link, (2) a GitHub README explaining the business problem and your solution, (3) a screenshot of the most impressive view, (4) the tech stack listed. Dead links or empty READMEs = skipped.
          </InfoBox>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {projects.map((p, i) => (
              <div key={i} style={{ border: "1px solid " + p.col + "33", borderLeft: "4px solid " + p.col, borderRadius: 4, padding: "14px 18px", background: C.surface }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                  <PhaseChip num={p.n} col={p.col} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{p.title}</div>
                    <Tag col={p.col}>{p.tools}</Tag>
                  </div>
                </div>
                <p style={{ fontSize: 13, color: C.muted, margin: "8px 0 6px", lineHeight: 1.65 }}>{p.pitch}</p>
                <div style={{ fontSize: 11, color: p.col, fontFamily: "monospace" }}>Link: {p.link}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      {tab === "cv" && (
        <div>
          <InfoBox col={C.p6} icon="✍️" title="The CV Magic Formula">
            [Action Verb] + [what you did] + [using what tool] + [measurable outcome]. Example: "Automated monthly sales reporting using Python and Airflow, reducing analyst time from 8 hours to 15 minutes."
          </InfoBox>
          <ConceptTable headers={["Section","Must Include","Never Include"]} rows={[
            ["Header",      "Name, LinkedIn URL, GitHub URL, portfolio link, email",  "Photo (UK/US), date of birth, full address"],
            ["Summary",     "2-3 sentences: experience, tools, one quantified win",    "Buzzwords without specifics. More than 4 sentences"],
            ["Skills",      "SQL · Python · Tableau · Power BI · BigQuery · dbt",     "Rating bars %, soft skills in tech section, old tools"],
            ["Experience",  "STAR bullets, action verbs, quantities: %, £, hours",     "Responsibilities without outcomes. Passive voice"],
            ["Projects",    "5 portfolio projects with live links and tech stack",      "Projects with no live link or empty README"],
            ["Education",   "Degree, this course, certifications (Google, dbt, AWS)", "Secondary school if you have a degree"],
          ]} col={C.p6} />
          <InfoBox col="#81C784" icon="🎯" title="ATS Tip — Get Past the Robot">
            90% of applications are screened by ATS before a human sees them. Mirror exact keywords from the job description. If the JD says "Tableau" use "Tableau", not "data visualisation tool". Use standard section headings. Avoid tables and graphics in the CV file.
          </InfoBox>
        </div>
      )}
      {tab === "interview" && (
        <div>
          <InfoBox col={C.p6} icon="🎯" title="How to Prepare">
            Answer every question out loud — not just in your head. Practice SQL on paper or whiteboard. Prepare 4-5 STAR stories from your portfolio projects. Run AI mock interviews: ask ChatGPT to interview you and give detailed feedback.
          </InfoBox>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {topQuestions.map((q, i) => (
              <div key={i} style={{ border: "1px solid " + C.border, borderRadius: 4, padding: "14px 16px", background: C.surface }}>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 6 }}>
                  <Tag col={q.type === "SQL" ? C.p2 : q.type === "Python" ? C.p3 : q.type === "BI" ? C.p4 : q.type === "ML" ? C.p3 : q.type === "Case" ? C.p5 : C.p6}>{q.type}</Tag>
                  <span style={{ fontSize: 13, color: C.text, fontWeight: 600, lineHeight: 1.5 }}>{q.q}</span>
                </div>
                <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.65, paddingLeft: 4, borderLeft: "2px solid " + C.border, marginLeft: 2 }}>{q.a}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      {tab === "salary" && (
        <div>
          <InfoBox col={C.p6} icon="💰" title="Negotiate Every Offer — Always">
            The first person to name a number loses leverage. 80% of candidates never negotiate. A single 30-minute negotiation conversation is worth £3,000-£15,000 in Year 1 salary.
          </InfoBox>
          <ConceptTable headers={["Level","UK","US","Global Remote"]} rows={salaryData} col={C.p6} />
          {[
            { step:"1. Research first", d:"Glassdoor, Levels.fyi, LinkedIn Salary, job postings. Know the range before any conversation." },
            { step:"2. Delay the number", d:"'I'm focused on finding the right fit — what is the budgeted range for this role?' Make them go first." },
            { step:"3. Anchor high", d:"Name the TOP of the market range, not the middle. You can come down. You cannot go up." },
            { step:"4. Never accept on the spot", d:"'Thank you — I am excited. Can I have until [date 3-5 days away] to review the full package?'" },
            { step:"5. Counter-offer script", d:"'Based on my skills in [X, Y, Z], I was hoping we could reach £X. Is there flexibility there?' — then silence." },
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 14, padding: "12px 0", borderBottom: i < 4 ? "1px solid " + C.border : "none" }}>
              <Tag col={C.p6}>{s.step}</Tag>
              <span style={{ fontSize: 13, color: C.muted, lineHeight: 1.65 }}>{s.d}</span>
            </div>
          ))}
          <div style={{ marginTop: 40, padding: "28px", background: "linear-gradient(135deg, rgba(255,215,0,0.07) 0%, transparent 100%)", border: "1px solid " + C.p6 + "33", borderRadius: 6, textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>🎓</div>
            <Heading size={24} col={C.text}>Course Complete. Get the Job.</Heading>
            <Body>SQL · Python · Tableau · Power BI · dbt · Airflow · LangChain · SHAP · Streamlit · OpenAI</Body>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6, justifyContent:"center", marginTop:12 }}>
              {["Excel ✓","SQL ✓","Python ✓","BI Tools ✓","Cloud ✓","AI Ops ✓","Portfolio ✓"].map(t => <Tag key={t} col={C.p6}>{t}</Tag>)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// FOOTER
// ══════════════════════════════════════════════════════════════
function Footer({ setPage }) {
  return (
    <div style={{ background: C.surface, borderTop: "1px solid " + C.border, padding: "40px 24px 28px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 32 }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 900, color: C.text, fontFamily: "monospace", marginBottom: 10 }}><span style={{ color: C.orange }}>101%</span> Analytics</div>
          <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.7 }}>16-week data analytics course with AI. SQL to Python to BI to Cloud.</div>
        </div>
        {[
          { heading:"Phases", links:[{l:"Phase 1 — Excel",id:"p1"},{l:"Phase 2 — SQL",id:"p2"},{l:"Phase 3 — Python",id:"p3"},{l:"Phase 4 — BI Tools",id:"p4"},{l:"Phase 5 — Cloud + AI",id:"p5"},{l:"Phase 6 — Career",id:"p6"}] },
          { heading:"Tools", links:[{l:"SQL + BigQuery",id:"p2"},{l:"Python + Pandas",id:"p3"},{l:"Tableau",id:"p4"},{l:"Power BI + DAX",id:"p4"},{l:"dbt + Airflow",id:"p5"},{l:"LangChain + RAG",id:"p5"}] },
          { heading:"Course", links:[{l:"Full Curriculum",id:"curriculum"},{l:"Home",id:"home"}] },
        ].map((col, i) => (
          <div key={i}>
            <div style={{ fontSize: 11, color: C.dimmed, fontFamily: "monospace", letterSpacing: "0.15em", marginBottom: 10 }}>{col.heading.toUpperCase()}</div>
            {col.links.map(link => (
              <button key={link.l} onClick={() => { setPage(link.id); window.scrollTo(0,0); }} style={{ display:"block", background:"none", border:"none", cursor:"pointer", padding:"3px 0", fontSize:13, color:C.muted, fontFamily:"inherit", textAlign:"left" }}>{link.l}</button>
            ))}
          </div>
        ))}
      </div>
      <Divider />
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <span style={{ fontSize: 12, color: C.dimmed }}>© 2025 101% Job-Ready Data Analytics Course</span>
        <div style={{ display: "flex", gap: 6 }}>
          {[C.p1,C.p2,C.p3,C.p4,C.p5,C.p6].map((col,i) => (
            <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: col }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// ROOT APP — ROUTER
// ══════════════════════════════════════════════════════════════
export default function App() {
  const [page, setPage] = useState("home");

  const pages = {
    home:       <HomePage setPage={setPage} />,
    curriculum: <CurriculumPage setPage={setPage} />,
    p1:         <Phase1 />,
    p2:         <Phase2 />,
    p3:         <Phase3 />,
    p4:         <Phase4 />,
    p5:         <Phase5 />,
    p6:         <Phase6 setPage={setPage} />,
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "Georgia, serif" }}>
      <Navbar page={page} setPage={setPage} />
      <main>{pages[page] || pages.home}</main>
      <Footer setPage={setPage} />
    </div>
  );
}
