import { useState } from "react";

const PHASES = [
  {
    num: 1, title: "Excel + Statistics + AI",
    weeks: "Weeks 1-3", col: "#81C784", icon: "📊",
    parts: [
      { part: "Part 1", topic: "Intro to Analytics + Excel Fundamentals", tools: ["Excel", "Microsoft Copilot", "Power Query"], key: "Pivot Tables, XLOOKUP, SUMIFS, COUNTIFS" },
      { part: "Part 2", topic: "Statistics for Analysts", tools: ["Excel", "ChatGPT"], key: "Mean, Median, Std Dev, Correlation, Normal distribution" },
      { part: "Part 3", topic: "Advanced Excel + AI Integration", tools: ["Excel", "Copilot", "Julius AI"], key: "Power Query ETL, What-If Analysis, Solver, Copilot insights" },
      { part: "Part 4", topic: "Phase 1 Capstone — RetailCo Sales Dashboard", tools: ["Excel", "Power Query", "Copilot"], key: "End-to-end Excel dashboard, portfolio deliverable" },
    ],
    keyLearnings: [
      "Pivot Tables and Power Query for data prep",
      "Statistical fundamentals every analyst must know",
      "Microsoft Copilot for formula generation and insights",
      "Portfolio-ready Excel dashboard",
    ],
    capstone: "RetailCo Sales Dashboard — automated Excel workbook with pivot tables, trend analysis and AI-generated commentary",
  },
  {
    num: 2, title: "SQL + BigQuery + Business Analytics",
    weeks: "Weeks 4-6", col: "#4FC3F7", icon: "🗄️",
    parts: [
      { part: "Part 1", topic: "SQL Fundamentals", tools: ["SQL", "MySQL", "ChatGPT"], key: "SELECT, JOIN, GROUP BY, HAVING, subqueries, execution order" },
      { part: "Part 2", topic: "Advanced SQL — Window Functions + CTEs", tools: ["SQL", "BigQuery"], key: "ROW_NUMBER, RANK, LAG/LEAD, CTEs, query performance" },
      { part: "Part 3", topic: "BigQuery + Gemini AI + RFM/Cohort/Funnel", tools: ["BigQuery", "Gemini AI", "SQLAI.ai"], key: "Cloud SQL, RFM segmentation, cohort retention, funnel analysis" },
      { part: "Part 4", topic: "E-Commerce Analytics Engine Capstone", tools: ["BigQuery", "Looker Studio", "SQL"], key: "Full pipeline: audit → KPIs → RFM → cohort → funnel → dashboard" },
    ],
    keyLearnings: [
      "Complete SQL from SELECT to complex window functions",
      "BigQuery free tier setup and Gemini AI text-to-SQL",
      "RFM segmentation: Champions → Loyal → At Risk → Lost",
      "Cohort retention analysis and funnel drop-off identification",
    ],
    capstone: "E-Commerce Analytics Engine — BigQuery pipeline with RFM, cohort, funnel SQL + Looker Studio dashboard",
  },
  {
    num: 3, title: "Python for Analytics + Machine Learning",
    weeks: "Weeks 7-10", col: "#B2FF59", icon: "🐍",
    parts: [
      { part: "Part 1", topic: "Python Fundamentals + AI Pair Programming", tools: ["Python", "Pandas", "GitHub Copilot"], key: "Variables, DataFrames, groupby, cleaning, GitHub Copilot patterns" },
      { part: "Part 2", topic: "EDA + Visualisation", tools: ["ydata-profiling", "Matplotlib", "Seaborn", "Plotly"], key: "7-step EDA framework, 6 chart types, automated profiling, Plotly interactive" },
      { part: "Part 3", topic: "Data Wrangling + ML + SHAP", tools: ["Pandas", "Scikit-learn", "SHAP", "H2O AutoML"], key: "Merging, pivot tables, churn prediction, SHAP explainability" },
      { part: "Part 4", topic: "Customer Intelligence Platform Capstone", tools: ["Python", "Streamlit", "Scikit-learn", "SHAP"], key: "Full pipeline + Streamlit web app deployed to cloud" },
    ],
    keyLearnings: [
      "Pandas from load to production-ready transformations",
      "ydata-profiling automated EDA in one line",
      "Churn prediction with Random Forest + SHAP explanations",
      "Deployed Streamlit web app as portfolio piece",
    ],
    capstone: "Customer Intelligence Platform — churn prediction model + SHAP charts + live Streamlit app on Streamlit Cloud",
  },
  {
    num: 4, title: "BI Tools — Tableau, Power BI, Looker",
    weeks: "Weeks 11-13", col: "#FF8A65", icon: "📈",
    parts: [
      { part: "Part 1", topic: "Tableau + Einstein AI / Tableau Pulse", tools: ["Tableau", "Einstein AI", "Tableau Pulse"], key: "Charts, LOD expressions, parameters, dashboard design, Pulse AI" },
      { part: "Part 2", topic: "Power BI + Microsoft Copilot + DAX", tools: ["Power BI", "DAX", "Power Query", "Copilot"], key: "Power Query ETL, DAX measures, CALCULATE, time intelligence, Copilot" },
      { part: "Part 3", topic: "ThoughtSpot + Looker + Capstone", tools: ["ThoughtSpot", "Looker Studio", "Gemini AI"], key: "Search-driven analytics, Spotter AI, Gemini, AI narratives, self-service" },
    ],
    keyLearnings: [
      "Tableau LOD expressions and parameters for dynamic dashboards",
      "DAX: CALCULATE, ALL, time intelligence (MoM, YTD, SPLY)",
      "ThoughtSpot search-driven analytics + Spotter AI root cause",
      "Pyramid Principle for data narratives",
    ],
    capstone: "Executive Analytics Suite — 4 live dashboards (Tableau + Power BI + Looker + ThoughtSpot) + written executive narrative",
  },
  {
    num: 5, title: "Cloud + Data Engineering + AI Ops",
    weeks: "Weeks 14-15", col: "#CE93D8", icon: "☁️",
    parts: [
      { part: "Part 1", topic: "GCP + BigQuery + dbt + Apache Airflow", tools: ["GCP", "BigQuery", "dbt", "Airflow"], key: "Modern data stack, dbt models/tests/docs, Airflow DAGs, orchestration" },
      { part: "Part 2", topic: "LLMs + RAG + LangChain + Evidently + Capstone", tools: ["OpenAI API", "LangChain", "FAISS", "Evidently", "Streamlit"], key: "RAG pipelines, vector databases, analytics chatbot, model drift monitoring" },
    ],
    keyLearnings: [
      "7-layer modern data stack architecture",
      "dbt: SQL with version control, testing, and auto-documentation",
      "RAG pipeline: LangChain + FAISS + OpenAI for data chatbots",
      "Evidently drift monitoring: know when to retrain your model",
    ],
    capstone: "AI Analytics Platform — dbt + Airflow + RAG chatbot deployed on Streamlit Cloud + Evidently drift monitoring",
  },
  {
    num: 6, title: "Career Launch",
    weeks: "Week 16", col: "#FFD700", icon: "🎓",
    parts: [
      { part: "Part 1", topic: "Portfolio + CV + LinkedIn + Interviews + Salary", tools: ["GitHub", "LinkedIn", "Streamlit Cloud", "Tableau Public"], key: "Portfolio review, CV guide, LinkedIn optimisation, 40 interview Q&As, salary negotiation" },
    ],
    keyLearnings: [
      "5-project portfolio review with employer-facing pitch for each",
      "CV section-by-section: do and don't, STAR format, ATS optimisation",
      "LinkedIn: headline formula, About section, Featured section",
      "40 interview questions (SQL, Python, BI, case study, behavioural) + model answers",
      "2025 salary benchmarks + 6-step negotiation playbook",
    ],
    capstone: "Job-ready portfolio with live links, optimised CV, LinkedIn profile, and full interview preparation",
  },
];

const AI_TOOLS = [
  { name: "GitHub Copilot",      phase: "P3",  type: "Code generation",     desc: "Write pandas/Python code from comments in VS Code" },
  { name: "ChatGPT / Claude",    phase: "All", type: "General AI",           desc: "SQL generation, EDA analysis, DAX measures, CV writing" },
  { name: "Microsoft Copilot",   phase: "P1",  type: "Excel AI",             desc: "Formula generation, pivot tables, data insights in Excel" },
  { name: "Gemini AI (BigQuery)", phase: "P2",  type: "SQL AI",               desc: "Text-to-SQL inside BigQuery console" },
  { name: "Julius AI",           phase: "P3",  type: "No-code analytics",    desc: "Drag CSV, ask questions, get charts and code" },
  { name: "ydata-profiling",     phase: "P3",  type: "Auto-EDA",             desc: "One line generates full HTML EDA report" },
  { name: "PandasAI",            phase: "P3",  type: "DataFrame chat",       desc: "Ask questions about pandas DataFrames in plain English" },
  { name: "H2O AutoML",          phase: "P3",  type: "AutoML",               desc: "Train 20+ models automatically, ranked leaderboard" },
  { name: "SHAP",                phase: "P3",  type: "Explainability",       desc: "Explain any ML model prediction in plain English" },
  { name: "Tableau Pulse",       phase: "P4",  type: "BI AI",                desc: "Einstein AI auto-narratives and anomaly detection" },
  { name: "Power BI Copilot",    phase: "P4",  type: "Report generation",    desc: "Generate Power BI reports from text prompts" },
  { name: "ThoughtSpot Spotter", phase: "P4",  type: "Search analytics AI",  desc: "Root cause analysis from natural language questions" },
  { name: "Looker Gemini",       phase: "P4",  type: "Chart generation",     desc: "Generate Looker Studio charts from text prompts" },
  { name: "LangChain",           phase: "P5",  type: "LLM framework",        desc: "Build RAG pipelines and analytics chatbots" },
  { name: "OpenAI API",          phase: "P5",  type: "LLM API",              desc: "Structured JSON insights, SQL generation, narratives" },
  { name: "Evidently",           phase: "P5",  type: "Model monitoring",     desc: "Data drift detection — know when to retrain" },
];

const QUICK_REFS = [
  {
    title: "SQL Cheat Sheet",
    col: "#4FC3F7",
    items: [
      "SELECT cols FROM tbl JOIN ... ON key WHERE ... GROUP BY ... HAVING ... ORDER BY ... LIMIT",
      "INNER: only matches | LEFT: all left + matches | FULL OUTER: all from both",
      "ROW_NUMBER() OVER (PARTITION BY col ORDER BY col DESC)",
      "LAG(col,1) OVER (ORDER BY date) → previous row value",
      "{ FIXED [dim] : AGG([measure]) } → Tableau LOD",
      "CALCULATE(expr, filter) → Power BI context override",
    ]
  },
  {
    title: "Python Pandas Cheat Sheet",
    col: "#B2FF59",
    items: [
      "df[df['col']=='val'] → filter rows",
      "df.groupby('col').agg(name=('col','sum')).reset_index()",
      "pd.merge(left, right, on='key', how='left')",
      "pd.pivot_table(df, values, index, columns, aggfunc='sum')",
      "pd.melt(df, id_vars=['prod'], value_vars=['Q1','Q2'])",
      "np.where(condition, true_val, false_val) → like Excel IF",
    ]
  },
  {
    title: "Interview Answer Templates",
    col: "#FFD700",
    items: [
      "SQL window fn: 'Window functions compute across rows without collapsing. ROW_NUMBER OVER PARTITION BY...'",
      "CALCULATE: 'Most important DAX function — evaluates expression with modified filter context'",
      "RAG: 'Retrieves your own data first, passes as context to LLM — grounds answers, prevents hallucination'",
      "Overfitting: 'Model memorised training data. Detect: train vs test gap. Fix: regularisation, cross-val'",
      "Data drift: 'Input distributions shift after deployment. Retrain when >30% features drift significantly'",
      "STAR: Situation → Task → Action (specific) → Result (quantified number)",
    ]
  },
];

export default function CourseNavigator() {
  const [activePhase, setActivePhase] = useState(null);
  const [activeTab,   setActiveTab]   = useState("phases");

  const ACC = "#FFD700";

  return (
    <div style={{ minHeight: "100vh", background: "#07070E", color: "#DDD8F0", fontFamily: "Georgia, serif" }}>

      {/* TOP NAV */}
      <div style={{ background: "#0A0A14", borderBottom: "1px solid #1A1A2E", padding: "0 24px", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 980, margin: "0 auto", display: "flex", alignItems: "center", gap: 0 }}>
          <div style={{ fontSize: 10, color: ACC, letterSpacing: "0.2em", textTransform: "uppercase", padding: "14px 20px 14px 0", borderRight: "1px solid #1A1A2E", marginRight: 16, whiteSpace: "nowrap", fontFamily: "monospace" }}>
            101% Job-Ready
          </div>
          {["phases","ai-tools","quick-ref"].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              background: "none", border: "none", cursor: "pointer", padding: "14px 14px",
              fontFamily: "inherit", fontSize: 11,
              color: activeTab === tab ? ACC : "#444",
              borderBottom: activeTab === tab ? "2px solid " + ACC : "2px solid transparent",
              transition: "all 0.2s", whiteSpace: "nowrap",
            }}>
              {tab === "phases" ? "All Phases" : tab === "ai-tools" ? "AI Tools (16)" : "Quick Reference"}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 980, margin: "0 auto", padding: "40px 24px 80px" }}>

        {/* ── PHASES TAB ── */}
        {activeTab === "phases" && (
          <div>
            {/* Hero */}
            <div style={{ marginBottom: 40, textAlign: "center" }}>
              <div style={{ fontSize: 10, color: ACC, letterSpacing: "0.3em", fontFamily: "monospace", marginBottom: 12 }}>COMPLETE COURSE NAVIGATOR</div>
              <h1 style={{ fontSize: "clamp(28px,5vw,48px)", fontWeight: 900, margin: "0 0 12px", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
                101% Job-Ready<br />
                <span style={{ color: ACC }}>Data Analytics Course</span>
              </h1>
              <p style={{ fontSize: 14, color: "#666", maxWidth: 560, margin: "0 auto 20px" }}>
                16 weeks · 6 phases · 20+ parts · 5 portfolio projects · SQL → Python → BI → Cloud → AI → Career
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
                {["16 Weeks", "6 Phases", "5 Portfolio Projects", "16 AI Tools", "40 Interview Q&As", "Salary Negotiation Guide"].map(tag => (
                  <span key={tag} style={{ padding: "4px 12px", background: "rgba(255,215,0,0.08)", border: "1px solid rgba(255,215,0,0.2)", borderRadius: 2, fontSize: 11, color: ACC }}>{tag}</span>
                ))}
              </div>
            </div>

            {/* Phase grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 12, marginBottom: 32 }}>
              {PHASES.map((ph, i) => {
                const open = activePhase === i;
                return (
                  <div key={i} onClick={() => setActivePhase(open ? null : i)} style={{
                    border: "1px solid " + (open ? ph.col + "66" : "#1A1A2E"),
                    borderTop: "3px solid " + ph.col,
                    borderRadius: 6, padding: 0, cursor: "pointer",
                    background: open ? ph.col + "07" : "#0D0D18",
                    transition: "all 0.2s",
                  }}>
                    {/* Header */}
                    <div style={{ padding: "14px 16px", borderBottom: open ? "1px solid " + ph.col + "22" : "none" }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                        <span style={{ fontSize: 22 }}>{ph.icon}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                            <span style={{ fontSize: 9, color: ph.col, fontFamily: "monospace", fontWeight: 700 }}>PHASE {ph.num} · {ph.weeks}</span>
                            <span style={{ fontSize: 9, color: ph.col, fontFamily: "monospace" }}>{ph.parts.length} parts</span>
                          </div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: "#DDD8F0", lineHeight: 1.3 }}>{ph.title}</div>
                        </div>
                      </div>
                    </div>

                    {/* Expanded */}
                    {open && (
                      <div style={{ padding: "12px 16px" }}>
                        {/* Parts */}
                        <div style={{ fontSize: 9, color: ph.col, letterSpacing: "0.15em", fontFamily: "monospace", fontWeight: 700, marginBottom: 8 }}>PARTS</div>
                        {ph.parts.map((p, j) => (
                          <div key={j} style={{ marginBottom: 8, padding: "8px 10px", background: "#07070E", borderRadius: 3, border: "1px solid #1A1A2E" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                              <span style={{ fontSize: 10, color: ph.col, fontFamily: "monospace" }}>{p.part}</span>
                              <div style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "flex-end" }}>
                                {p.tools.slice(0, 3).map(t => (
                                  <span key={t} style={{ fontSize: 8, color: "#555", background: "#0D0D18", padding: "1px 5px", borderRadius: 2 }}>{t}</span>
                                ))}
                              </div>
                            </div>
                            <div style={{ fontSize: 12, color: "#DDD8F0", fontWeight: 600, marginBottom: 2 }}>{p.topic}</div>
                            <div style={{ fontSize: 11, color: "#555" }}>{p.key}</div>
                          </div>
                        ))}

                        {/* Key learnings */}
                        <div style={{ fontSize: 9, color: ph.col, letterSpacing: "0.15em", fontFamily: "monospace", fontWeight: 700, margin: "10px 0 6px" }}>KEY LEARNINGS</div>
                        {ph.keyLearnings.map((k, j) => (
                          <div key={j} style={{ display: "flex", gap: 8, marginBottom: 4 }}>
                            <span style={{ color: ph.col, flexShrink: 0, fontSize: 10 }}>→</span>
                            <span style={{ fontSize: 11, color: "#888" }}>{k}</span>
                          </div>
                        ))}

                        {/* Capstone */}
                        <div style={{ marginTop: 10, padding: "8px 10px", background: ph.col + "08", border: "1px solid " + ph.col + "22", borderRadius: 3 }}>
                          <div style={{ fontSize: 9, color: ph.col, letterSpacing: "0.15em", fontFamily: "monospace", fontWeight: 700, marginBottom: 4 }}>CAPSTONE DELIVERABLE</div>
                          <div style={{ fontSize: 11, color: "#AAA" }}>{ph.capstone}</div>
                        </div>
                      </div>
                    )}

                    {/* Collapsed preview */}
                    {!open && (
                      <div style={{ padding: "8px 16px 12px" }}>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                          {ph.parts[0].tools.concat(ph.parts.length > 1 ? ph.parts[1].tools : []).slice(0, 5).map(t => (
                            <span key={t} style={{ fontSize: 9, color: "#555", background: "#07070E", padding: "2px 6px", borderRadius: 2, border: "1px solid #1A1A2E" }}>{t}</span>
                          ))}
                          {ph.parts.length > 1 && <span style={{ fontSize: 9, color: ph.col }}>+ more</span>}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Course progress bar */}
            <div style={{ background: "#0D0D18", border: "1px solid #1A1A2E", borderRadius: 6, padding: "20px 24px" }}>
              <div style={{ fontSize: 11, color: "#555", fontFamily: "monospace", letterSpacing: "0.15em", marginBottom: 14 }}>COURSE COMPLETION PATH</div>
              <div style={{ display: "flex", gap: 0, alignItems: "center" }}>
                {PHASES.map((ph, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", flex: i < 5 ? 1 : "none" }}>
                    <div style={{ background: ph.col, borderRadius: "50%", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ fontSize: 11, fontWeight: 900, color: "#07070E" }}>{ph.num}</span>
                    </div>
                    {i < 5 && <div style={{ flex: 1, height: 2, background: PHASES[i+1].col + "44" }} />}
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 0, marginTop: 6 }}>
                {PHASES.map((ph, i) => (
                  <div key={i} style={{ flex: i < 5 ? 1 : "none", minWidth: i === 5 ? 28 : undefined }}>
                    <div style={{ fontSize: 8, color: ph.col, fontFamily: "monospace", maxWidth: 60 }}>{ph.weeks.split(" ")[0]} {ph.weeks.split(" ")[1]}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── AI TOOLS TAB ── */}
        {activeTab === "ai-tools" && (
          <div>
            <h2 style={{ fontSize: 28, fontWeight: 900, color: "#DDD8F0", margin: "0 0 8px" }}>16 AI Tools in This Course</h2>
            <p style={{ fontSize: 14, color: "#666", margin: "0 0 28px" }}>Every AI tool used across all 6 phases — what it does and when to use it.</p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 10 }}>
              {AI_TOOLS.map((tool, i) => {
                const phaseNum = parseInt(tool.phase.replace("P","")) || 0;
                const phColor = phaseNum > 0 ? PHASES[phaseNum-1]?.col : ACC;
                return (
                  <div key={i} style={{ border: "1px solid " + phColor + "33", borderLeft: "3px solid " + phColor, borderRadius: 4, padding: "12px 14px", background: "#0D0D18" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#DDD8F0" }}>{tool.name}</span>
                      <span style={{ fontSize: 9, color: phColor, fontFamily: "monospace", background: phColor + "15", padding: "2px 6px", borderRadius: 2 }}>{tool.phase}</span>
                    </div>
                    <div style={{ fontSize: 10, color: phColor, marginBottom: 5, fontFamily: "monospace" }}>{tool.type}</div>
                    <div style={{ fontSize: 12, color: "#777", lineHeight: 1.5 }}>{tool.desc}</div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: 32, padding: "20px 24px", background: "#0D0D18", border: "1px solid #1A1A2E", borderRadius: 6 }}>
              <div style={{ fontSize: 12, color: ACC, fontWeight: 700, marginBottom: 12 }}>AI Tool Selection Guide — When to Use What</div>
              {[
                { situation: "Writing analysis code in VS Code",         tool: "GitHub Copilot",            col: "#6E40C9" },
                { situation: "Quick SQL query from a business question", tool: "ChatGPT / Claude / Gemini",  col: "#10A37F" },
                { situation: "Exploring unfamiliar CSV data",            tool: "Julius AI or ChatGPT",       col: "#FF6D9D" },
                { situation: "Automated EDA on a new dataset",           tool: "ydata-profiling",            col: "#4FC3F7" },
                { situation: "Training ML models without expertise",     tool: "H2O AutoML",                 col: "#FFA500" },
                { situation: "Explaining model predictions to stakeholders", tool: "SHAP",                   col: "#80DEEA" },
                { situation: "Building in-editor Tableau / BI charts",   tool: "Tableau Pulse / Copilot",    col: "#FF8A65" },
                { situation: "Q&A chatbot over private business data",   tool: "LangChain + RAG + OpenAI",   col: "#81C784" },
                { situation: "Knowing when to retrain ML model",         tool: "Evidently",                  col: "#F48FB1" },
              ].map((r, i, arr) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 200px", gap: 16, padding: "9px 0", borderBottom: i < arr.length-1 ? "1px solid #1A1A2E" : "none", alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: "#888" }}>{r.situation}</span>
                  <span style={{ fontSize: 12, color: r.col, fontWeight: 700 }}>→ {r.tool}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── QUICK REF TAB ── */}
        {activeTab === "quick-ref" && (
          <div>
            <h2 style={{ fontSize: 28, fontWeight: 900, color: "#DDD8F0", margin: "0 0 8px" }}>Quick Reference</h2>
            <p style={{ fontSize: 14, color: "#666", margin: "0 0 28px" }}>The most important formulas, patterns, and templates from all 6 phases.</p>

            {QUICK_REFS.map((ref, i) => (
              <div key={i} style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: ref.col, margin: "0 0 10px", borderLeft: "3px solid " + ref.col, paddingLeft: 12 }}>{ref.title}</h3>
                <div style={{ background: "#07070E", border: "1px solid " + ref.col + "22", borderRadius: 4, padding: "14px 16px" }}>
                  {ref.items.map((item, j) => (
                    <div key={j} style={{ display: "flex", gap: 10, marginBottom: 6 }}>
                      <span style={{ color: ref.col, flexShrink: 0, fontFamily: "monospace" }}>→</span>
                      <code style={{ fontSize: 12, color: ref.col, fontFamily: "monospace", lineHeight: 1.6 }}>{item}</code>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Full curriculum summary */}
            <div style={{ marginTop: 8 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: ACC, margin: "0 0 10px", borderLeft: "3px solid " + ACC, paddingLeft: 12 }}>Full Curriculum at a Glance</h3>
              <div style={{ border: "1px solid #1A1A2E", borderRadius: 4, overflow: "hidden" }}>
                {PHASES.map((ph, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "100px 1fr 1fr", gap: 12, padding: "10px 16px", borderBottom: i < 5 ? "1px solid #0F0F18" : "none", background: i % 2 === 0 ? "#0A0A14" : "#07070E", alignItems: "start" }}>
                    <span style={{ fontSize: 12, color: ph.col, fontWeight: 700 }}>{ph.icon} Phase {ph.num}</span>
                    <span style={{ fontSize: 12, color: "#DDD8F0", fontWeight: 700 }}>{ph.title}</span>
                    <span style={{ fontSize: 11, color: "#555", fontStyle: "italic" }}>{ph.weeks} · {ph.parts.length} parts</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Portfolio checklist */}
            <div style={{ marginTop: 24, padding: "20px 24px", background: "#0D0D18", border: "1px solid #1A1A2E", borderRadius: 6 }}>
              <div style={{ fontSize: 12, color: "#81C784", fontWeight: 700, marginBottom: 12 }}>Portfolio Deployment Checklist</div>
              {[
                ["P1", "Excel dashboard uploaded to Google Drive or GitHub", "#81C784"],
                ["P2", "GitHub repo created + Looker Studio dashboard live", "#4FC3F7"],
                ["P3", "GitHub repo + Streamlit app deployed to Streamlit Cloud", "#B2FF59"],
                ["P4", "Tableau Public published + Power BI Service published", "#FF8A65"],
                ["P5", "GitHub repo + AI chatbot deployed + dbt docs live", "#CE93D8"],
                ["P6", "CV polished + LinkedIn updated + all portfolio links in profile", "#FFD700"],
              ].map(([phase, item, col], j) => (
                <div key={j} style={{ display: "flex", gap: 10, marginBottom: 7 }}>
                  <span style={{ fontSize: 9, color: col, background: col + "18", padding: "2px 6px", borderRadius: 2, fontFamily: "monospace", flexShrink: 0 }}>{phase}</span>
                  <span style={{ fontSize: 12, color: "#777" }}>{item}</span>
                </div>
              ))}
            </div>

            {/* Final message */}
            <div style={{ marginTop: 24, padding: "24px", background: "linear-gradient(135deg, rgba(255,215,0,0.07) 0%, transparent 100%)", border: "1px solid rgba(255,215,0,0.3)", borderRadius: 6, textAlign: "center" }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>🎓</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: "#DDD8F0", marginBottom: 6 }}>Course Complete. Get the Job.</div>
              <p style={{ fontSize: 13, color: "#666", maxWidth: 500, margin: "0 auto" }}>
                SQL · Python · Tableau · Power BI · Looker · BigQuery · dbt · Airflow · LangChain · SHAP · Streamlit
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
