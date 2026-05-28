import { useState } from "react";

const syllabus = [
  {
    phase: "Phase 1",
    title: "Foundations + AI Accelerators",
    duration: "Weeks 1–3",
    color: "#00E5FF",
    icon: "◈",
    jobReadyScore: 15,
    aiTools: ["ChatGPT", "Gemini", "Perplexity"],
    modules: [
      {
        week: "Week 1",
        topic: "Data Analytics in the AI Era",
        subtopics: [
          "The modern analyst stack: where AI fits in 2025",
          "Using ChatGPT & Gemini to accelerate data exploration",
          "Prompt engineering for data tasks (summarize, clean, explain)",
          "Setting up: Jupyter, VS Code + GitHub Copilot, Anaconda",
          "AI tools landscape: what automates vs. what still needs YOU",
        ],
        aiHighlight: "Use ChatGPT to generate EDA summaries from raw data descriptions"
      },
      {
        week: "Week 2",
        topic: "Statistics — Supercharged with AI",
        subtopics: [
          "Core stats: mean, median, std dev, distributions, hypothesis testing",
          "Using AI assistants to interpret p-values and statistical output",
          "Correlation vs. causation — AI misconceptions to avoid",
          "NotebookLM for learning and summarizing stats papers",
        ],
        aiHighlight: "Use Claude/ChatGPT to explain statistical results in plain English"
      },
      {
        week: "Week 3",
        topic: "Excel + AI Add-ins",
        subtopics: [
          "Excel Copilot: auto-generate formulas, insights, charts via chat",
          "Advanced Excel: PivotTables, XLOOKUP, dynamic arrays",
          "Cleaning messy data: AI suggestions vs. manual methods",
          "Excel + ChatGPT workflow: paste data, ask questions, get answers",
        ],
        aiHighlight: "Microsoft Copilot in Excel — chat with your spreadsheet"
      },
    ],
    project: {
      title: "📊 AI-Assisted Sales Intelligence Report",
      desc: "Analyze 2 years of sales data in Excel using Copilot + ChatGPT. Generate automated insights, create a dynamic dashboard, and write an executive summary using AI — then validate and refine every output yourself.",
      deliverable: "Excel Dashboard + AI prompt log + Insights PDF",
      jobSkills: ["Business reporting", "Stakeholder communication", "AI-assisted analysis"],
    },
  },
  {
    phase: "Phase 2",
    title: "SQL + AI Query Assistants",
    duration: "Weeks 4–6",
    color: "#FFD600",
    icon: "◉",
    jobReadyScore: 30,
    aiTools: ["GitHub Copilot", "AI2sql", "SQLAI.ai", "Gemini in BigQuery"],
    modules: [
      {
        week: "Week 4",
        topic: "SQL Mastery",
        subtopics: [
          "SELECT, WHERE, GROUP BY, JOINs, subqueries",
          "Window functions: RANK, ROW_NUMBER, LEAD/LAG, NTILE",
          "CTEs & recursive queries",
          "GitHub Copilot for SQL: auto-complete complex queries",
        ],
        aiHighlight: "GitHub Copilot writes JOIN queries from plain-English comments"
      },
      {
        week: "Week 5",
        topic: "AI-Powered SQL Workflows",
        subtopics: [
          "SQLAI.ai & AI2sql: text-to-SQL in seconds",
          "Gemini in BigQuery: ask questions in natural language",
          "Reviewing, debugging, and optimizing AI-generated SQL",
          "When AI SQL goes wrong: hallucinations and schema errors",
        ],
        aiHighlight: "Gemini in BigQuery: type a question, get a SQL query"
      },
      {
        week: "Week 6",
        topic: "Business SQL Analytics",
        subtopics: [
          "Cohort analysis, funnel analysis, retention metrics",
          "RFM segmentation (Recency, Frequency, Monetary)",
          "Google BigQuery + Looker Studio integration",
          "dbt (data build tool) intro — modern analytics engineering",
        ],
        aiHighlight: "Use dbt + AI docs to build self-documenting data models"
      },
    ],
    project: {
      title: "🗃️ E-Commerce Analytics Engine",
      desc: "Query a multi-million row e-commerce DB in BigQuery. Use Gemini AI to write and optimize queries, build RFM segments, analyze funnels, and create a Looker Studio report — just like a real data analyst job task.",
      deliverable: "SQL scripts + BigQuery project + Looker Studio report",
      jobSkills: ["BigQuery", "dbt basics", "Business metrics", "AI query generation"],
    },
  },
  {
    phase: "Phase 3",
    title: "Python + AI-Powered Analytics",
    duration: "Weeks 7–10",
    color: "#B2FF59",
    icon: "◐",
    jobReadyScore: 55,
    aiTools: ["GitHub Copilot", "ChatGPT Code Interpreter", "Julius AI", "Pandas AI"],
    modules: [
      {
        week: "Week 7",
        topic: "Python with AI Pair Programming",
        subtopics: [
          "Python fundamentals: pandas, numpy, data structures",
          "GitHub Copilot in VS Code — AI writes 40% of your code",
          "ChatGPT Code Interpreter: upload CSV, chat with your data",
          "Julius AI: drag-and-drop data analysis with AI explanations",
        ],
        aiHighlight: "Julius AI — no code needed, just ask questions about your data"
      },
      {
        week: "Week 8",
        topic: "EDA + AI Insight Generation",
        subtopics: [
          "Automated EDA: ydata-profiling, sweetviz, dtale",
          "Matplotlib, Seaborn, Plotly interactive charts",
          "PandasAI: query DataFrames in plain English",
          "AI-generated EDA reports vs manual analysis — when to trust",
        ],
        aiHighlight: "PandasAI: df.chat('What are the top 5 products by revenue?')"
      },
      {
        week: "Week 9",
        topic: "Machine Learning for Analysts",
        subtopics: [
          "Regression, classification, clustering with Scikit-learn",
          "AutoML tools: Google AutoML, H2O.ai, AutoSklearn",
          "Feature engineering with AI suggestions (Featuretools)",
          "Model explainability: SHAP values — explain predictions to stakeholders",
        ],
        aiHighlight: "H2O AutoML: trains 100 models and picks the best automatically"
      },
      {
        week: "Week 10",
        topic: "Generative AI for Analytics",
        subtopics: [
          "LLMs for data tasks: text classification, sentiment, extraction",
          "OpenAI API: build a data Q&A chatbot over your own dataset",
          "LangChain basics: RAG pipeline for document analytics",
          "AI ethics in analytics: bias, fairness, responsible AI",
        ],
        aiHighlight: "Build a chatbot that answers questions from your company's CSV files"
      },
    ],
    project: {
      title: "🤖 AI-Powered Customer Intelligence Platform",
      desc: "Build a full Python analytics pipeline: auto-EDA with ydata-profiling → churn prediction with AutoML → SHAP explainability → a LangChain chatbot that answers business questions about the data in plain English.",
      deliverable: "Jupyter Notebook + Streamlit app + GitHub repo",
      jobSkills: ["Python", "AutoML", "LLM integration", "Model explainability", "Streamlit"],
    },
  },
  {
    phase: "Phase 4",
    title: "AI-Enhanced BI & Visualization",
    duration: "Weeks 11–13",
    color: "#FF6D9D",
    icon: "◑",
    jobReadyScore: 75,
    aiTools: ["Tableau Pulse (Einstein AI)", "Power BI Copilot", "Looker Studio + Gemini", "ThoughtSpot"],
    modules: [
      {
        week: "Week 11",
        topic: "Tableau + Einstein AI / Tableau Pulse",
        subtopics: [
          "Tableau Desktop: calculated fields, LOD expressions, parameters",
          "Tableau Pulse: AI-generated metric explanations & anomaly alerts",
          "Einstein Copilot: natural language to Tableau viz",
          "Publishing to Tableau Cloud + embedding dashboards",
        ],
        aiHighlight: "Tableau Pulse auto-narrates dashboard changes in plain English"
      },
      {
        week: "Week 12",
        topic: "Power BI + Microsoft Copilot",
        subtopics: [
          "Power Query ETL, DAX measures, data modeling",
          "Power BI Copilot: generate reports from a text description",
          "Copilot for DAX: write complex measures with AI",
          "Q&A visual: let stakeholders query data in natural language",
        ],
        aiHighlight: "Power BI Copilot: 'Create a report showing revenue by region over time'"
      },
      {
        week: "Week 13",
        topic: "Next-Gen BI: ThoughtSpot & AI Narratives",
        subtopics: [
          "ThoughtSpot: search-driven analytics (Google for your data)",
          "AI narrative tools: Narrative Science, Quill for auto-insights",
          "Looker Studio + Gemini AI integration",
          "Building a self-service analytics culture for non-technical teams",
        ],
        aiHighlight: "ThoughtSpot: business users query million-row datasets by typing questions"
      },
    ],
    project: {
      title: "📈 360° AI Business Intelligence Suite",
      desc: "Build a full BI suite: Tableau Pulse dashboard with AI anomaly detection + Power BI Copilot report generated from scratch using text prompts + a Looker Studio report. Present all three to a simulated executive audience.",
      deliverable: "3 live dashboards + stakeholder presentation deck",
      jobSkills: ["Tableau", "Power BI", "DAX", "Stakeholder presentation", "AI BI tools"],
    },
  },
  {
    phase: "Phase 5",
    title: "Cloud, Data Engineering & AI Ops",
    duration: "Weeks 14–15",
    color: "#CF9FFF",
    icon: "◆",
    jobReadyScore: 90,
    aiTools: ["BigQuery ML", "Databricks AI", "Amazon Q", "dbt + AI docs"],
    modules: [
      {
        week: "Week 14",
        topic: "Cloud Analytics & Big Data",
        subtopics: [
          "Google Cloud: BigQuery, Looker, Vertex AI for analysts",
          "AWS: Redshift, QuickSight, Amazon Q (AI analytics assistant)",
          "Databricks: collaborative notebooks + Delta Lake + AI/BI dashboards",
          "BigQuery ML: run ML models with SQL — no Python needed",
        ],
        aiHighlight: "Amazon Q: ask your entire AWS data warehouse questions in chat"
      },
      {
        week: "Week 15",
        topic: "Modern Data Stack & Analytics Engineering",
        subtopics: [
          "Modern data stack: Fivetran → Snowflake/BigQuery → dbt → Tableau",
          "dbt (data build tool): transform data with SQL + version control",
          "Airflow basics: automating data pipelines",
          "DataOps practices: CI/CD for analytics, testing data quality",
        ],
        aiHighlight: "dbt + AI: auto-generate documentation and data tests from code"
      },
    ],
    project: {
      title: "☁️ Cloud Data Pipeline + ML",
      desc: "Build an end-to-end cloud pipeline: ingest raw data → transform with dbt in BigQuery → run a classification model with BigQuery ML (SQL only) → serve results in Looker Studio. Fully automated, cloud-native.",
      deliverable: "GitHub repo with dbt models + BigQuery ML + Looker report",
      jobSkills: ["BigQuery", "dbt", "BigQuery ML", "Cloud architecture", "DataOps"],
    },
  },
  {
    phase: "Phase 6",
    title: "Job-Ready Capstone & Career Launch",
    duration: "Week 16",
    color: "#FF8C42",
    icon: "★",
    jobReadyScore: 101,
    aiTools: ["AI Resume Builders", "LinkedIn AI", "ChatGPT Interview Prep", "Teal HQ"],
    modules: [
      {
        week: "Week 16A",
        topic: "Capstone Project",
        subtopics: [
          "End-to-end project: raw data → SQL → Python → BI → AI insights",
          "Choose a domain: Healthcare, Finance, Retail, Sports, or SaaS",
          "Present findings as a mock business case to a panel",
          "Peer review & iterative feedback loop",
        ],
        aiHighlight: "Use AI to generate an executive summary of your entire project"
      },
      {
        week: "Week 16B",
        topic: "Career Launch Kit",
        subtopics: [
          "Resume: ATS-optimized with AI tools (Teal HQ, Kickresume)",
          "LinkedIn: profile optimization, AI-assisted 'About' section",
          "Portfolio: GitHub + personal analytics portfolio website",
          "Job hunt: Boolean search, networking scripts, cold outreach templates",
        ],
        aiHighlight: "Teal HQ AI: match your resume to job descriptions automatically"
      },
      {
        week: "Week 16C",
        topic: "Interview Mastery",
        subtopics: [
          "SQL interview: 30 most common questions with solutions",
          "Python/stats interview questions with AI practice sessions",
          "Case study interviews: structured framework (STAR method)",
          "Mock interviews with ChatGPT: roleplay technical + behavioral rounds",
        ],
        aiHighlight: "ChatGPT mock interview: 'Interview me for a data analyst role at a fintech'"
      },
    ],
    project: {
      title: "🏆 Capstone + Job Application Package",
      desc: "Deliver a complete, real-world analytics project in a domain of your choice — fully documented on GitHub. Plus: ATS-ready resume, optimized LinkedIn, portfolio site, and complete interview prep kit. You leave job-ready, not just course-complete.",
      deliverable: "GitHub capstone + Portfolio site + Resume + LinkedIn + Interview scripts",
      jobSkills: ["Portfolio presentation", "Technical interviews", "Networking", "Resume writing", "Job search strategy"],
    },
  },
];

const jobReadyElements = [
  { icon: "💼", label: "6 Real-World Projects", desc: "Every phase has a job-simulaton project" },
  { icon: "🤖", label: "20+ AI Tools", desc: "Modern tools used in real companies today" },
  { icon: "☁️", label: "Cloud Certified Path", desc: "BigQuery, Databricks, AWS QuickSight" },
  { icon: "📄", label: "ATS-Ready Resume", desc: "AI-optimized for data analyst roles" },
  { icon: "🔗", label: "GitHub Portfolio", desc: "Live projects employers can review" },
  { icon: "🎯", label: "Interview Prep Kit", desc: "SQL, Python, case studies, behavioral" },
  { icon: "🌐", label: "LinkedIn Optimization", desc: "Profile that attracts recruiters" },
  { icon: "📊", label: "BI Certifications Path", desc: "Tableau & Power BI cert preparation" },
];

const aiToolsAll = [
  { name: "ChatGPT / GPT-4o", category: "Analysis", color: "#10A37F" },
  { name: "GitHub Copilot", category: "Coding", color: "#6E40C9" },
  { name: "Excel Copilot", category: "Spreadsheets", color: "#217346" },
  { name: "Power BI Copilot", category: "BI", color: "#F2C811" },
  { name: "Tableau Pulse", category: "BI", color: "#1F77B4" },
  { name: "Gemini in BigQuery", category: "Cloud", color: "#4285F4" },
  { name: "PandasAI", category: "Python", color: "#B2FF59" },
  { name: "Julius AI", category: "No-Code", color: "#FF6D9D" },
  { name: "ThoughtSpot", category: "Search BI", color: "#FF4F00" },
  { name: "H2O AutoML", category: "ML", color: "#FFA500" },
  { name: "Amazon Q", category: "Cloud", color: "#FF9900" },
  { name: "dbt + AI", category: "Engineering", color: "#FF694B" },
  { name: "BigQuery ML", category: "Cloud ML", color: "#4285F4" },
  { name: "LangChain", category: "LLM", color: "#CF9FFF" },
  { name: "Teal HQ", category: "Career", color: "#00BCD4" },
  { name: "Databricks AI", category: "Big Data", color: "#FF3621" },
  { name: "ydata-profiling", category: "Python", color: "#B2FF59" },
  { name: "SHAP", category: "Explainability", color: "#FFD600" },
  { name: "SQLAI.ai", category: "SQL", color: "#FFD600" },
  { name: "NotebookLM", category: "Learning", color: "#10A37F" },
];

export default function DataAnalyticsSyllabus() {
  const [activePhase, setActivePhase] = useState(0);
  const [expandedModules, setExpandedModules] = useState({});
  const [activeTab, setActiveTab] = useState("curriculum"); // curriculum | aitools | jobready

  const toggleModule = (key) => {
    setExpandedModules((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const phase = syllabus[activePhase];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#080810",
      color: "#E8E8F0",
      fontFamily: "'Courier New', monospace",
    }}>
      {/* HEADER */}
      <div style={{
        background: "linear-gradient(160deg, #0D0D1A 0%, #080810 100%)",
        borderBottom: "1px solid #1A1A2E",
        padding: "36px 28px 28px",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position:"absolute",top:0,right:0,width:500,height:300,
          background:"radial-gradient(ellipse at top right, rgba(207,159,255,0.07) 0%, transparent 60%)",
          pointerEvents:"none"}} />
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10,
            fontSize:10, color:"#CF9FFF", letterSpacing:"0.25em", textTransform:"uppercase" }}>
            <span style={{width:20,height:1,background:"#CF9FFF",display:"inline-block"}}/>
            AI-ENHANCED · 16 WEEKS · 6 PHASES · 101% JOB READY
          </div>
          <h1 style={{ fontSize:"clamp(24px,5vw,48px)", fontWeight:900, margin:"0 0 10px",
            letterSpacing:"-0.02em", lineHeight:1.1 }}>
            <span style={{color:"#00E5FF"}}>DATA ANALYTICS</span><br/>
            <span style={{color:"#CF9FFF"}}>AI-POWERED</span>{" "}
            <span style={{color:"#E8E8F0",fontWeight:300}}>CURRICULUM 2025</span>
          </h1>
          <p style={{ color:"#666", fontSize:13, margin:"0 0 20px", maxWidth:540, lineHeight:1.6 }}>
            Master data analytics with 20+ modern AI tools. Every phase mirrors real job tasks.
            Graduate with a portfolio, optimized resume, and interview-ready skills.
          </p>
          {/* Progress bar */}
          <div style={{display:"flex", alignItems:"center", gap:12, marginBottom:4}}>
            <span style={{fontSize:10, color:"#555", letterSpacing:"0.15em"}}>JOB READINESS</span>
            <div style={{flex:1, maxWidth:300, height:6, background:"#1A1A2E", borderRadius:3, overflow:"hidden"}}>
              <div style={{
                width: `${phase.jobReadyScore}%`, height:"100%",
                background: `linear-gradient(90deg, #00E5FF, ${phase.color})`,
                borderRadius:3, transition:"width 0.5s ease",
              }}/>
            </div>
            <span style={{fontSize:13, fontWeight:700, color: phase.color}}>
              {phase.jobReadyScore}%
            </span>
          </div>
          <div style={{fontSize:10, color:"#444"}}>
            After completing {phase.phase}: {phase.title}
          </div>

          {/* Tab bar */}
          <div style={{display:"flex", gap:4, marginTop:24}}>
            {["curriculum","aitools","jobready"].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                background: activeTab===tab ? "rgba(255,255,255,0.08)" : "none",
                border: activeTab===tab ? "1px solid #333" : "1px solid transparent",
                borderRadius:4, padding:"7px 16px", cursor:"pointer",
                fontFamily:"inherit", fontSize:11, letterSpacing:"0.12em",
                textTransform:"uppercase",
                color: activeTab===tab ? "#E8E8F0" : "#555",
                transition:"all 0.2s",
              }}>
                {tab === "curriculum" ? "📚 Curriculum" : tab === "aitools" ? "🤖 AI Tools (20+)" : "💼 Job-Ready Kit"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── CURRICULUM TAB ── */}
      {activeTab === "curriculum" && (
        <div style={{maxWidth:1000, margin:"0 auto", padding:"0 28px 80px"}}>
          {/* Phase nav */}
          <div style={{overflowX:"auto", borderBottom:"1px solid #1A1A2E", marginBottom:32}}>
            <div style={{display:"flex", gap:0, minWidth:"max-content"}}>
              {syllabus.map((p,i) => (
                <button key={i} onClick={() => setActivePhase(i)} style={{
                  background:"none", border:"none", cursor:"pointer",
                  padding:"14px 16px",
                  borderBottom: activePhase===i ? `2px solid ${p.color}` : "2px solid transparent",
                  color: activePhase===i ? p.color : "#444",
                  fontSize:11, fontFamily:"inherit", fontWeight: activePhase===i ? 700 : 400,
                  letterSpacing:"0.08em", textTransform:"uppercase",
                  transition:"all 0.2s", whiteSpace:"nowrap",
                }}>
                  {p.icon} {p.phase}
                </button>
              ))}
            </div>
          </div>

          {/* Phase header */}
          <div style={{marginBottom:28}}>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start",
              flexWrap:"wrap", gap:12, marginBottom:16}}>
              <div>
                <div style={{fontSize:10, color:phase.color, letterSpacing:"0.2em",
                  textTransform:"uppercase", marginBottom:6}}>
                  {phase.phase} · {phase.duration}
                </div>
                <h2 style={{margin:"0 0 8px", fontSize:"clamp(20px,3vw,30px)", fontWeight:900,
                  letterSpacing:"-0.01em"}}>
                  <span style={{color:phase.color}}>{phase.icon} </span>{phase.title}
                </h2>
              </div>
            </div>
            {/* AI Tools for this phase */}
            <div style={{display:"flex", flexWrap:"wrap", gap:6}}>
              <span style={{fontSize:10, color:"#555", letterSpacing:"0.1em", alignSelf:"center"}}>
                AI TOOLS:
              </span>
              {phase.aiTools.map(t => (
                <span key={t} style={{
                  padding:"3px 10px", borderRadius:2,
                  background:"rgba(207,159,255,0.08)",
                  border:"1px solid rgba(207,159,255,0.2)",
                  fontSize:11, color:"#CF9FFF",
                }}>🤖 {t}</span>
              ))}
            </div>
          </div>

          {/* Modules */}
          <div style={{display:"flex", flexDirection:"column", gap:10, marginBottom:28}}>
            {phase.modules.map((mod, mi) => {
              const key = `${activePhase}-${mi}`;
              const open = expandedModules[key];
              return (
                <div key={mi} style={{
                  border:`1px solid ${open ? phase.color+"55" : "#1E1E2E"}`,
                  borderRadius:4, overflow:"hidden", transition:"border-color 0.2s",
                }}>
                  <button onClick={() => toggleModule(key)} style={{
                    width:"100%", background: open ? `${phase.color}0D` : "#0D0D18",
                    border:"none", cursor:"pointer", padding:"14px 18px",
                    display:"flex", justifyContent:"space-between", alignItems:"center",
                    fontFamily:"inherit", textAlign:"left", transition:"background 0.2s",
                  }}>
                    <div style={{display:"flex", alignItems:"center", gap:14}}>
                      <span style={{fontSize:10, color:phase.color,
                        letterSpacing:"0.15em", fontWeight:700, minWidth:56}}>
                        {mod.week}
                      </span>
                      <span style={{fontSize:14, fontWeight:700, color:"#E8E8F0"}}>
                        {mod.topic}
                      </span>
                    </div>
                    <span style={{color:phase.color, fontSize:18, fontWeight:300,
                      transform:open?"rotate(45deg)":"none",
                      transition:"transform 0.2s", lineHeight:1}}>+</span>
                  </button>
                  {open && (
                    <div style={{padding:"0 18px 18px 88px", background:`${phase.color}06`}}>
                      <div style={{width:"100%",height:1,background:`${phase.color}22`,marginBottom:14}}/>
                      <ul style={{margin:0,padding:0,listStyle:"none",display:"flex",flexDirection:"column",gap:7}}>
                        {mod.subtopics.map((s, si) => (
                          <li key={si} style={{display:"flex",alignItems:"flex-start",gap:10,
                            fontSize:13, color:"#AAAACC", lineHeight:1.5}}>
                            <span style={{width:4,height:4,borderRadius:"50%",
                              background:phase.color,marginTop:7,flexShrink:0}}/>
                            {s}
                          </li>
                        ))}
                      </ul>
                      {/* AI Highlight */}
                      <div style={{
                        marginTop:16, padding:"10px 14px",
                        background:"rgba(207,159,255,0.06)",
                        border:"1px solid rgba(207,159,255,0.2)",
                        borderRadius:3, display:"flex", alignItems:"flex-start", gap:10,
                      }}>
                        <span style={{fontSize:14}}>🤖</span>
                        <div>
                          <div style={{fontSize:9, color:"#CF9FFF", letterSpacing:"0.15em",
                            textTransform:"uppercase", marginBottom:3}}>AI SHORTCUT</div>
                          <div style={{fontSize:12, color:"#CF9FFF"}}>{mod.aiHighlight}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Project Card */}
          <div style={{
            border:`1px solid ${phase.color}44`,
            borderLeft:`4px solid ${phase.color}`,
            borderRadius:4, padding:"22px 26px",
            background:`linear-gradient(135deg, ${phase.color}0D 0%, transparent 100%)`,
            position:"relative", overflow:"hidden",
          }}>
            <div style={{position:"absolute",top:-10,right:-10,fontSize:100,
              opacity:0.03,pointerEvents:"none",lineHeight:1,fontWeight:900}}>PROJECT</div>
            <div style={{fontSize:10,color:phase.color,letterSpacing:"0.2em",
              textTransform:"uppercase",marginBottom:10,fontWeight:700}}>▶ PHASE PROJECT</div>
            <h3 style={{margin:"0 0 8px", fontSize:18, fontWeight:900, color:"#F0F0FF"}}>
              {phase.project.title}
            </h3>
            <p style={{margin:"0 0 14px", fontSize:13, color:"#888", lineHeight:1.7}}>
              {phase.project.desc}
            </p>
            <div style={{display:"flex", flexWrap:"wrap", gap:8, marginBottom:12}}>
              {phase.project.jobSkills.map(s => (
                <span key={s} style={{
                  padding:"3px 10px", borderRadius:2,
                  background:"rgba(255,255,255,0.04)",
                  border:"1px solid rgba(255,255,255,0.1)",
                  fontSize:11, color:"#888",
                }}>✓ {s}</span>
              ))}
            </div>
            <div style={{
              display:"inline-flex", alignItems:"center", gap:8,
              padding:"5px 12px",
              background:`${phase.color}18`, border:`1px solid ${phase.color}33`,
              borderRadius:2, fontSize:11, color:phase.color, letterSpacing:"0.08em",
            }}>
              📦 {phase.project.deliverable}
            </div>
          </div>

          {/* Phase timeline */}
          <div style={{marginTop:40}}>
            <div style={{fontSize:10,color:"#333",letterSpacing:"0.2em",
              textTransform:"uppercase",marginBottom:16}}>── ALL PHASES</div>
            {syllabus.map((p,i) => (
              <div key={i} onClick={() => setActivePhase(i)} style={{
                display:"flex", alignItems:"center", gap:14,
                padding:"9px 0",
                borderBottom: i < syllabus.length-1 ? "1px solid #0F0F18" : "none",
                cursor:"pointer",
              }}>
                <div style={{width:7,height:7,borderRadius:"50%",flexShrink:0,
                  background: activePhase===i ? p.color : "transparent",
                  border:`1px solid ${p.color}44`}}/>
                <span style={{fontSize:10,color:p.color,minWidth:72,
                  letterSpacing:"0.1em",fontWeight:700}}>{p.duration}</span>
                <span style={{fontSize:13,
                  color: activePhase===i ? "#F0F0FF" : "#555",
                  fontWeight: activePhase===i ? 700 : 400}}>
                  {p.phase}: {p.title}
                </span>
                <div style={{
                  marginLeft:"auto",
                  width: `${p.jobReadyScore}%`, maxWidth:80, height:3,
                  background:`linear-gradient(90deg, #00E5FF, ${p.color})`,
                  borderRadius:2,
                }}/>
                <span style={{fontSize:10,color:p.color,minWidth:30,textAlign:"right"}}>
                  {p.jobReadyScore}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── AI TOOLS TAB ── */}
      {activeTab === "aitools" && (
        <div style={{maxWidth:1000,margin:"0 auto",padding:"36px 28px 80px"}}>
          <div style={{marginBottom:32}}>
            <h2 style={{margin:"0 0 8px",fontSize:26,fontWeight:900}}>
              <span style={{color:"#CF9FFF"}}>20+</span> AI Tools You'll Master
            </h2>
            <p style={{color:"#555",fontSize:13,margin:0}}>
              Tools actively used in data teams at top companies right now.
            </p>
          </div>
          <div style={{
            display:"grid",
            gridTemplateColumns:"repeat(auto-fill, minmax(200px, 1fr))",
            gap:12,
          }}>
            {aiToolsAll.map((t,i) => (
              <div key={i} style={{
                border:"1px solid #1A1A2E",
                borderRadius:4, padding:"16px 16px",
                background:"#0D0D18",
                transition:"border-color 0.2s",
                cursor:"default",
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = t.color+"66"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#1A1A2E"}
              >
                <div style={{
                  display:"inline-block",
                  padding:"2px 8px", borderRadius:2,
                  background:`${t.color}15`,
                  border:`1px solid ${t.color}33`,
                  fontSize:9, color:t.color, letterSpacing:"0.12em",
                  textTransform:"uppercase", marginBottom:10,
                }}>{t.category}</div>
                <div style={{fontSize:14,fontWeight:700,color:"#E8E8F0"}}>
                  {t.name}
                </div>
              </div>
            ))}
          </div>

          {/* AI Tool categories */}
          <div style={{marginTop:48}}>
            <div style={{fontSize:10,color:"#333",letterSpacing:"0.2em",
              textTransform:"uppercase",marginBottom:20}}>── AI INTEGRATION BY PHASE</div>
            {syllabus.map((p,i) => (
              <div key={i} style={{
                padding:"16px 0",
                borderBottom: i < syllabus.length-1 ? "1px solid #0F0F18" : "none",
                display:"flex", flexWrap:"wrap", alignItems:"flex-start", gap:12,
              }}>
                <div style={{minWidth:130}}>
                  <div style={{fontSize:10,color:p.color,letterSpacing:"0.12em",
                    textTransform:"uppercase",marginBottom:4,fontWeight:700}}>
                    {p.phase}
                  </div>
                  <div style={{fontSize:12,color:"#666"}}>{p.duration}</div>
                </div>
                <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                  {p.aiTools.map(t => (
                    <span key={t} style={{
                      padding:"4px 10px", borderRadius:2,
                      background:`${p.color}0D`,
                      border:`1px solid ${p.color}33`,
                      fontSize:11, color:p.color,
                    }}>🤖 {t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── JOB READY TAB ── */}
      {activeTab === "jobready" && (
        <div style={{maxWidth:1000,margin:"0 auto",padding:"36px 28px 80px"}}>
          <div style={{marginBottom:32}}>
            <h2 style={{margin:"0 0 8px",fontSize:26,fontWeight:900}}>
              <span style={{color:"#FF8C42"}}>101%</span> Job-Ready Framework
            </h2>
            <p style={{color:"#555",fontSize:13,margin:0,lineHeight:1.6,maxWidth:560}}>
              This isn't just a skills course. Every module, project, and deliverable is designed to land you a data analyst job.
            </p>
          </div>

          {/* 8 pillars */}
          <div style={{
            display:"grid",
            gridTemplateColumns:"repeat(auto-fill, minmax(220px, 1fr))",
            gap:12, marginBottom:48,
          }}>
            {jobReadyElements.map((el,i) => (
              <div key={i} style={{
                border:"1px solid #1A1A2E", borderRadius:4,
                padding:"18px", background:"#0D0D18",
              }}>
                <div style={{fontSize:24, marginBottom:10}}>{el.icon}</div>
                <div style={{fontSize:13,fontWeight:700,color:"#E8E8F0",marginBottom:4}}>
                  {el.label}
                </div>
                <div style={{fontSize:12,color:"#555",lineHeight:1.5}}>{el.desc}</div>
              </div>
            ))}
          </div>

          {/* Job titles you'll qualify for */}
          <div style={{marginBottom:40}}>
            <div style={{fontSize:10,color:"#333",letterSpacing:"0.2em",
              textTransform:"uppercase",marginBottom:20}}>── JOB TITLES YOU'LL QUALIFY FOR</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {[
                {title:"Data Analyst", salary:"$65K–$95K", color:"#00E5FF"},
                {title:"Business Intelligence Analyst", salary:"$70K–$105K", color:"#FFD600"},
                {title:"Marketing Analyst", salary:"$60K–$88K", color:"#FF6D9D"},
                {title:"Operations Analyst", salary:"$62K–$90K", color:"#B2FF59"},
                {title:"Product Analyst", salary:"$75K–$115K", color:"#CF9FFF"},
                {title:"Data & AI Analyst", salary:"$80K–$125K", color:"#FF8C42"},
                {title:"Analytics Engineer (Jr)", salary:"$85K–$120K", color:"#00E5FF"},
                {title:"BI Developer", salary:"$72K–$108K", color:"#FFD600"},
              ].map((j,i) => (
                <div key={i} style={{
                  padding:"10px 16px",
                  border:`1px solid ${j.color}33`,
                  background:`${j.color}08`,
                  borderRadius:3,
                }}>
                  <div style={{fontSize:13,fontWeight:700,color:"#E8E8F0",marginBottom:2}}>
                    {j.title}
                  </div>
                  <div style={{fontSize:11,color:j.color}}>{j.salary}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Week 16 checklist */}
          <div>
            <div style={{fontSize:10,color:"#333",letterSpacing:"0.2em",
              textTransform:"uppercase",marginBottom:20}}>── GRADUATION CHECKLIST</div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {[
                {item:"✅ 6 completed projects in GitHub portfolio", done:true},
                {item:"✅ ATS-optimized resume (AI-reviewed)", done:true},
                {item:"✅ LinkedIn profile with 500+ connections strategy", done:true},
                {item:"✅ Personal portfolio website live", done:true},
                {item:"✅ 30 SQL interview questions solved", done:true},
                {item:"✅ Python EDA & ML projects documented", done:true},
                {item:"✅ Tableau & Power BI dashboards published", done:true},
                {item:"✅ Capstone project: end-to-end case study", done:true},
                {item:"✅ Mock interview completed (technical + behavioral)", done:true},
                {item:"✅ 20+ AI tools proficient — real competitive edge", done:true},
              ].map((c,i) => (
                <div key={i} style={{
                  padding:"10px 14px",
                  background: "#0D0D18",
                  border:"1px solid #1A1A2E",
                  borderRadius:3,
                  fontSize:13, color:"#AAAACC",
                  display:"flex", alignItems:"center", gap:10,
                }}>
                  <span style={{color:"#B2FF59", fontSize:14}}>{c.item.slice(0,2)}</span>
                  <span>{c.item.slice(3)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
