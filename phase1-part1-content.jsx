import { useState } from "react";

// ─── QUIZ DATA ───────────────────────────────────────────────
const quizQuestions = [
  {
    q: "A company notices sales dropped 30% last month and wants to know WHY. Which type of analytics do they need?",
    options: ["Descriptive Analytics", "Diagnostic Analytics", "Predictive Analytics", "Prescriptive Analytics"],
    answer: 1,
    explanation: "Diagnostic Analytics answers 'Why did it happen?' — it digs into root causes using drill-down, data discovery, and correlations."
  },
  {
    q: "Which step comes FIRST in the Data Analytics Lifecycle?",
    options: ["Data Cleaning", "Data Visualization", "Business Understanding", "Model Building"],
    answer: 2,
    explanation: "You must understand the business problem first. Every analytics project starts by defining the question — not by touching data."
  },
  {
    q: "What is the PRIMARY role of a Data Analyst vs. a Data Scientist?",
    options: [
      "Data Analysts write more code",
      "Data Analysts focus on past/present insights; Data Scientists build predictive models",
      "Data Scientists only work with SQL",
      "They are the same role"
    ],
    answer: 1,
    explanation: "Analysts answer business questions from existing data (descriptive/diagnostic). Scientists build ML models to predict the future (predictive/prescriptive)."
  },
  {
    q: "Which AI tool can help you understand a dataset you've never seen before — in seconds?",
    options: ["GitHub Copilot", "ChatGPT / Gemini (Code Interpreter)", "Power BI", "Tableau"],
    answer: 1,
    explanation: "ChatGPT Code Interpreter & Gemini let you upload a CSV and instantly ask 'What's in this data?' — generating summaries, finding anomalies, and suggesting analyses."
  },
  {
    q: "Structured data is stored in rows and columns. Which of these is an example of UNSTRUCTURED data?",
    options: ["Excel spreadsheet", "SQL database table", "Customer reviews in a text file", "CSV export from a CRM"],
    answer: 2,
    explanation: "Unstructured data has no predefined schema — emails, reviews, images, videos, and social media posts are all unstructured. Most of the world's data is unstructured."
  },
];

// ─── LESSON SECTIONS ─────────────────────────────────────────
const sections = [
  { id: "what", label: "What is Analytics?" },
  { id: "types", label: "4 Types" },
  { id: "lifecycle", label: "Lifecycle" },
  { id: "roles", label: "Roles & Stack" },
  { id: "aitools", label: "AI Tools" },
  { id: "setup", label: "Setup" },
  { id: "quiz", label: "🧠 Quiz" },
];

const analyticsTypes = [
  {
    type: "Descriptive",
    question: "What happened?",
    color: "#4FC3F7",
    bg: "#0A1F2E",
    pct: 80,
    example: "Monthly sales report showing revenue was $2.4M in Q3.",
    tools: ["Excel", "SQL", "Tableau", "Power BI"],
    used: "Most common — 80% of analytics work is descriptive.",
    icon: "📊",
  },
  {
    type: "Diagnostic",
    question: "Why did it happen?",
    color: "#81C784",
    bg: "#0A1F12",
    pct: 60,
    example: "Sales dropped because 3 top clients churned after a pricing change.",
    tools: ["SQL drill-down", "Python EDA", "Correlation analysis"],
    used: "Root cause analysis, used when performance deviates.",
    icon: "🔍",
  },
  {
    type: "Predictive",
    question: "What will happen?",
    color: "#FFD54F",
    bg: "#1F1A0A",
    pct: 40,
    example: "Based on trends, Q4 sales will likely be $2.8M.",
    tools: ["Python ML", "Scikit-learn", "Time series", "AutoML"],
    used: "Forecasting, churn prediction, demand planning.",
    icon: "🔮",
  },
  {
    type: "Prescriptive",
    question: "What should we do?",
    color: "#FF8A65",
    bg: "#1F0F0A",
    pct: 20,
    example: "Offer a 10% discount to at-risk clients to reduce churn by 35%.",
    tools: ["Optimization models", "A/B testing", "Decision engines", "AI agents"],
    used: "Most advanced — drives automated decisions.",
    icon: "⚡",
  },
];

const lifecycle = [
  { step: "01", name: "Business Understanding", desc: "Define the problem. What question are you answering? Who is the stakeholder? What decision will the data inform?", color: "#4FC3F7", tip: "90% of failed analytics projects fail here — wrong question, wasted effort." },
  { step: "02", name: "Data Collection", desc: "Identify data sources: databases, APIs, spreadsheets, third-party tools. Understand what data exists and what's missing.", color: "#81C784", tip: "Use SQL to query existing databases. Use APIs for real-time data." },
  { step: "03", name: "Data Cleaning", desc: "Handle nulls, duplicates, wrong formats, outliers, and inconsistencies. This is 60–80% of real analyst work.", color: "#FFD54F", tip: "In Python: df.isnull().sum() shows missing values. In Excel: Remove Duplicates." },
  { step: "04", name: "Exploratory Data Analysis", desc: "Understand the shape, distributions, and relationships in the data. Use visualizations and statistics.", color: "#FF8A65", tip: "Always plot before modeling. Histograms, scatter plots, and correlation matrices are your best friends." },
  { step: "05", name: "Analysis / Modeling", desc: "Answer the business question: calculate metrics, build models, segment customers, find patterns.", color: "#CE93D8", tip: "Start simple. A well-framed SQL query often beats a complex ML model." },
  { step: "06", name: "Visualization & Reporting", desc: "Present findings in dashboards, charts, and slides. Translate data into decisions for non-technical stakeholders.", color: "#F48FB1", tip: "The best insight is worthless if nobody understands it. Design for your audience." },
  { step: "07", name: "Action & Monitoring", desc: "Implement the recommendation. Monitor KPIs. Measure impact. Feed results back into the next cycle.", color: "#80DEEA", tip: "Analytics is a loop, not a one-time task. Always measure the outcome of decisions." },
];

const roles = [
  { title: "Data Analyst", focus: "Answering business questions from existing data", tools: "SQL, Excel, Tableau, Power BI", salary: "$65K–$95K", icon: "📊", color: "#4FC3F7", yours: true },
  { title: "Business Analyst", focus: "Bridging business needs and data solutions", tools: "Excel, SQL, Tableau, PowerPoint", salary: "$60K–$90K", icon: "💼", color: "#81C784", yours: true },
  { title: "Data Scientist", focus: "Predictive modeling, ML, statistical research", tools: "Python, R, Scikit-learn, TensorFlow", salary: "$100K–$140K", icon: "🔬", color: "#FFD54F", yours: false },
  { title: "Data Engineer", focus: "Building data pipelines and infrastructure", tools: "Spark, Airflow, dbt, SQL, Python", salary: "$110K–$150K", icon: "⚙️", color: "#FF8A65", yours: false },
  { title: "Analytics Engineer", focus: "Transform raw data into clean analytics models", tools: "dbt, SQL, BigQuery, Python", salary: "$90K–$130K", icon: "🛠️", color: "#CE93D8", yours: true },
  { title: "BI Developer", focus: "Build enterprise dashboards and reports", tools: "Power BI, Tableau, DAX, SQL", salary: "$75K–$110K", icon: "📈", color: "#F48FB1", yours: true },
];

const aiToolsIntro = [
  { name: "ChatGPT / GPT-4o", use: "Explain datasets, generate SQL, write Python, summarize reports", icon: "💬", color: "#10A37F", prompt: '"Here is my dataset description: [paste]. What analyses should I do?"' },
  { name: "Gemini (Google)", use: "Integrated into Google Sheets, BigQuery, and Looker Studio", icon: "♊", color: "#4285F4", prompt: '"Analyze this Google Sheet and tell me the 3 most important trends."' },
  { name: "GitHub Copilot", use: "Autocomplete Python & SQL code as you type in VS Code", icon: "🤖", color: "#6E40C9", prompt: "# Write a function to clean null values in a pandas DataFrame" },
  { name: "Perplexity AI", use: "Research data topics with cited sources — better than Google for learning", icon: "🔎", color: "#20B2AA", prompt: '"What is the difference between OLAP and OLTP databases?"' },
  { name: "NotebookLM", use: "Upload course PDFs and chat with them — your AI study tutor", icon: "📓", color: "#FF8C42", prompt: "Upload this PDF → 'Summarize the key concepts in 10 bullet points.'" },
];

const setupSteps = [
  { step: 1, title: "Install Anaconda", desc: "One installer gives you Python, Jupyter Notebook, and 250+ data science libraries. Free.", link: "anaconda.com/download", color: "#4FC3F7", cmd: "# After install, open Anaconda Navigator\n# Launch Jupyter Notebook from there" },
  { step: 2, title: "Install VS Code", desc: "Best code editor for data analytics. Lightweight, fast, supports every language.", link: "code.visualstudio.com", color: "#81C784", cmd: "# Install these VS Code extensions:\n# 1. Python (Microsoft)\n# 2. Jupyter\n# 3. GitHub Copilot (free trial)" },
  { step: 3, title: "Create GitHub Account", desc: "Your portfolio lives here. Every project you build gets uploaded. Employers check this.", link: "github.com", color: "#FFD54F", cmd: "git init my-analytics-portfolio\ncd my-analytics-portfolio\ngit remote add origin https://github.com/YOU/repo" },
  { step: 4, title: "Get ChatGPT Free Account", desc: "GPT-4o free tier is enough to start. Use it alongside every lesson.", link: "chatgpt.com", color: "#FF8A65", cmd: '# First prompt to try:\n"I am starting to learn data analytics.\nI have a CSV with sales data.\nWhat 5 analyses should I start with?"' },
  { step: 5, title: "Install GitHub Copilot", desc: "Free for students via GitHub Education Pack. AI pair programmer inside VS Code.", link: "github.com/features/copilot", color: "#CE93D8", cmd: "# In VS Code:\n# Press Ctrl+Shift+X → search 'GitHub Copilot'\n# Sign in with GitHub account\n# Start typing — Copilot completes your code" },
];

// ─── MAIN COMPONENT ──────────────────────────────────────────
export default function Phase1Part1() {
  const [activeSection, setActiveSection] = useState("what");
  const [expandedType, setExpandedType] = useState(null);
  const [expandedStep, setExpandedStep] = useState(null);
  const [expandedRole, setExpandedRole] = useState(null);
  const [quizState, setQuizState] = useState({ idx: 0, selected: null, answered: false, score: 0, done: false });
  const [expandedSetup, setExpandedSetup] = useState(null);
  const [expandedAI, setExpandedAI] = useState(null);

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

  const scrollTo = (id) => setActiveSection(id);

  return (
    <div style={{ minHeight: "100vh", background: "#07070E", color: "#DDD8F0", fontFamily: "Georgia, 'Times New Roman', serif" }}>

      {/* TOP BAR */}
      <div style={{ background: "#0A0A14", borderBottom: "1px solid #16162A", padding: "0 24px", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", alignItems: "center", gap: 0, overflowX: "auto" }}>
          <div style={{ fontSize: 10, color: "#FF8C42", letterSpacing: "0.2em", textTransform: "uppercase", paddingRight: 20, borderRight: "1px solid #1A1A2E", marginRight: 16, whiteSpace: "nowrap", padding: "14px 20px 14px 0" }}>
            P1 · PART 1
          </div>
          {sections.map(s => (
            <button key={s.id} onClick={() => scrollTo(s.id)} style={{
              background: "none", border: "none", cursor: "pointer",
              padding: "14px 14px", fontFamily: "inherit",
              fontSize: 11, letterSpacing: "0.08em",
              color: activeSection === s.id ? "#FF8C42" : "#444",
              borderBottom: activeSection === s.id ? "2px solid #FF8C42" : "2px solid transparent",
              transition: "all 0.2s", whiteSpace: "nowrap",
            }}>{s.label}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "48px 24px 100px" }}>

        {/* HERO */}
        <div style={{ marginBottom: 64, borderLeft: "3px solid #FF8C42", paddingLeft: 24 }}>
          <div style={{ fontSize: 10, color: "#FF8C42", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 12 }}>
            PHASE 1 · PART 1 OF 4 · WEEK 1
          </div>
          <h1 style={{ fontSize: "clamp(26px,5vw,46px)", fontWeight: 900, margin: "0 0 16px", lineHeight: 1.15, letterSpacing: "-0.02em", fontFamily: "Georgia, serif" }}>
            Introduction to<br />
            <span style={{ color: "#FF8C42" }}>Data Analytics</span><br />
            <span style={{ fontStyle: "italic", fontWeight: 400, fontSize: "0.7em", color: "#888" }}>& The AI Era</span>
          </h1>
          <p style={{ fontSize: 15, color: "#888", lineHeight: 1.8, maxWidth: 560, margin: "0 0 24px" }}>
            Before writing a single line of code or query, you need to understand the landscape — what data analytics actually is, how it's done, who does it, and how AI tools are reshaping the entire field in 2025.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {["~3 hours", "5 concepts", "1 quiz", "5 AI tools introduced"].map(tag => (
              <span key={tag} style={{ padding: "4px 12px", background: "rgba(255,140,66,0.08)", border: "1px solid rgba(255,140,66,0.2)", borderRadius: 2, fontSize: 11, color: "#FF8C42" }}>{tag}</span>
            ))}
          </div>
        </div>

        {/* ─── SECTION 1: WHAT IS DATA ANALYTICS ─── */}
        {(activeSection === "what") && (
          <div>
            <SectionHeader num="01" title="What Is Data Analytics?" color="#FF8C42" />

            <Prose>
              Data analytics is the process of <Highlight>examining raw data to draw conclusions and support decision-making</Highlight>. It's the discipline of turning numbers, records, and logs into insights that businesses can act on.
            </Prose>
            <Prose>
              Think of it this way: every company generates enormous amounts of data — transactions, clicks, signups, support tickets, returns. Most of that data sits untouched in databases. A data analyst's job is to <Highlight>ask the right questions</Highlight>, find the right data, and surface the answers clearly enough that a manager, executive, or product team can make better decisions.
            </Prose>

            <CalloutBox icon="💡" color="#FFD54F" title="The Core Skill">
              Data analytics is NOT primarily about math or coding. It's about <strong>asking better questions than the next person</strong>. Every technical skill you learn — SQL, Python, Tableau — is just a tool to answer questions faster.
            </CalloutBox>

            <Subheading>Data vs. Information vs. Insight</Subheading>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, margin: "24px 0 32px" }}>
              {[
                { label: "Data", value: "42,000 rows of transaction records with timestamps, amounts, and user IDs", color: "#4FC3F7", icon: "🗄️" },
                { label: "Information", value: "Total revenue last month was $1.2M, with 3,400 unique customers", color: "#81C784", icon: "📋" },
                { label: "Insight", value: "Revenue is down 18% MoM because mobile checkout has a 67% cart abandonment rate", color: "#FF8C42", icon: "💡" },
              ].map(d => (
                <div key={d.label} style={{ border: `1px solid ${d.color}33`, borderTop: `3px solid ${d.color}`, borderRadius: 4, padding: "16px 14px", background: `${d.color}06` }}>
                  <div style={{ fontSize: 20, marginBottom: 8 }}>{d.icon}</div>
                  <div style={{ fontSize: 11, color: d.color, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8, fontFamily: "monospace" }}>{d.label}</div>
                  <div style={{ fontSize: 12, color: "#888", lineHeight: 1.6 }}>{d.value}</div>
                </div>
              ))}
            </div>

            <Subheading>Structured vs. Unstructured Data</Subheading>
            <Prose>
              Not all data is equal. As an analyst, you'll work with both types constantly.
            </Prose>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, margin: "20px 0 32px" }}>
              <div style={{ border: "1px solid #4FC3F755", borderRadius: 4, padding: "18px 16px", background: "#0A1F2E" }}>
                <div style={{ fontSize: 12, color: "#4FC3F7", fontFamily: "monospace", letterSpacing: "0.1em", marginBottom: 12, textTransform: "uppercase" }}>📋 Structured</div>
                <ul style={{ margin: 0, padding: "0 0 0 16px", color: "#AAA", fontSize: 13, lineHeight: 2 }}>
                  <li>Lives in tables (rows + columns)</li>
                  <li>SQL databases, Excel, CSV files</li>
                  <li>Easy to query and analyze</li>
                  <li>~20% of all data in the world</li>
                  <li><em style={{ color: "#4FC3F7" }}>Example: Sales transactions, user records</em></li>
                </ul>
              </div>
              <div style={{ border: "1px solid #FF8A6555", borderRadius: 4, padding: "18px 16px", background: "#1F0F0A" }}>
                <div style={{ fontSize: 12, color: "#FF8A65", fontFamily: "monospace", letterSpacing: "0.1em", marginBottom: 12, textTransform: "uppercase" }}>📂 Unstructured</div>
                <ul style={{ margin: 0, padding: "0 0 0 16px", color: "#AAA", fontSize: 13, lineHeight: 2 }}>
                  <li>No predefined schema</li>
                  <li>Text, images, video, audio</li>
                  <li>Requires NLP/AI to process</li>
                  <li>~80% of all data in the world</li>
                  <li><em style={{ color: "#FF8A65" }}>Example: Customer reviews, emails, images</em></li>
                </ul>
              </div>
            </div>

            <CalloutBox icon="🤖" color="#CF9FFF" title="AI Shortcut">
              Paste any raw data sample into ChatGPT and ask: <br />
              <em style={{ color: "#CF9FFF" }}>"Is this structured or unstructured data? What type of analysis can I do with it?"</em><br />
              — You'll instantly know how to approach any unfamiliar dataset.
            </CalloutBox>

            <NavButtons onNext={() => scrollTo("types")} />
          </div>
        )}

        {/* ─── SECTION 2: 4 TYPES ─── */}
        {activeSection === "types" && (
          <div>
            <SectionHeader num="02" title="The 4 Types of Analytics" color="#4FC3F7" />
            <Prose>
              Analytics is not one thing. There are four distinct types, each answering a different business question — and each requiring progressively more skill and sophistication. As a data analyst, you'll spend most of your time in the first two, but you need to understand all four.
            </Prose>

            <div style={{ margin: "32px 0" }}>
              {/* Maturity bar */}
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#555", letterSpacing: "0.1em", marginBottom: 8, textTransform: "uppercase" }}>
                <span>Lower complexity</span><span>Higher business value →</span>
              </div>
              <div style={{ display: "flex", height: 6, borderRadius: 3, overflow: "hidden" }}>
                {analyticsTypes.map(t => <div key={t.type} style={{ flex: 1, background: t.color }} />)}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {analyticsTypes.map((t, i) => {
                const open = expandedType === i;
                return (
                  <div key={i} style={{ border: `1px solid ${open ? t.color + "66" : "#1A1A2E"}`, borderRadius: 4, overflow: "hidden", transition: "border-color 0.2s" }}>
                    <button onClick={() => setExpandedType(open ? null : i)} style={{
                      width: "100%", background: open ? t.bg : "#0D0D18", border: "none", cursor: "pointer",
                      padding: "16px 20px", display: "flex", alignItems: "center", gap: 16,
                      fontFamily: "inherit", textAlign: "left", transition: "background 0.2s",
                    }}>
                      <span style={{ fontSize: 22 }}>{t.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 11, color: t.color, letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "monospace" }}>{t.type} Analytics</div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: "#DDD8F0" }}>{t.question}</div>
                      </div>
                      <span style={{ color: t.color, fontSize: 18, fontWeight: 300, transform: open ? "rotate(45deg)" : "none", transition: "transform 0.2s" }}>+</span>
                    </button>
                    {open && (
                      <div style={{ padding: "0 20px 20px 20px", background: t.bg }}>
                        <div style={{ height: 1, background: `${t.color}22`, margin: "0 0 16px" }} />
                        <p style={{ fontSize: 13, color: "#AAA", lineHeight: 1.7, margin: "0 0 14px" }}>
                          <strong style={{ color: t.color }}>Example: </strong>{t.example}
                        </p>
                        <p style={{ fontSize: 13, color: "#777", lineHeight: 1.7, margin: "0 0 14px" }}>{t.used}</p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                          <span style={{ fontSize: 10, color: "#555", letterSpacing: "0.1em", alignSelf: "center" }}>TOOLS:</span>
                          {t.tools.map(tool => (
                            <span key={tool} style={{ padding: "3px 10px", background: `${t.color}10`, border: `1px solid ${t.color}30`, borderRadius: 2, fontSize: 11, color: t.color, fontFamily: "monospace" }}>{tool}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <CalloutBox icon="📌" color="#81C784" title="Key Takeaway for Job Interviews">
              Interviewers LOVE asking: <em>"Describe the difference between the 4 types of analytics."</em> Know this cold. The example of sales dropping → diagnosing it → forecasting next quarter → prescribing a promotion is a perfect answer.
            </CalloutBox>

            <NavButtons onPrev={() => scrollTo("what")} onNext={() => scrollTo("lifecycle")} />
          </div>
        )}

        {/* ─── SECTION 3: LIFECYCLE ─── */}
        {activeSection === "lifecycle" && (
          <div>
            <SectionHeader num="03" title="The Data Analytics Lifecycle" color="#81C784" />
            <Prose>
              Real analytics projects don't happen in a straight line — but they follow a <Highlight>predictable lifecycle</Highlight>. Understanding this process is what separates analysts who get results from those who spin their wheels. Every project, from a one-day analysis to a six-month ML initiative, follows these seven steps.
            </Prose>

            <div style={{ margin: "32px 0", display: "flex", flexDirection: "column", gap: 8 }}>
              {lifecycle.map((l, i) => {
                const open = expandedStep === i;
                return (
                  <div key={i} style={{ display: "flex", gap: 0, position: "relative" }}>
                    {/* Connector line */}
                    {i < lifecycle.length - 1 && (
                      <div style={{ position: "absolute", left: 24, top: "100%", width: 1, height: 8, background: "#1A1A2E", zIndex: 1 }} />
                    )}
                    <button onClick={() => setExpandedStep(open ? null : i)} style={{
                      width: "100%", background: open ? `${l.color}0A` : "#0D0D18",
                      border: `1px solid ${open ? l.color + "55" : "#1A1A2E"}`,
                      borderRadius: 4, cursor: "pointer", padding: "14px 18px",
                      display: "flex", alignItems: "flex-start", gap: 16,
                      fontFamily: "inherit", textAlign: "left", transition: "all 0.2s",
                    }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: `${l.color}18`, border: `1px solid ${l.color}44`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ fontSize: 10, color: l.color, fontFamily: "monospace", fontWeight: 700 }}>{l.step}</span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#DDD8F0", marginBottom: open ? 10 : 0 }}>{l.name}</div>
                        {open && (
                          <>
                            <p style={{ fontSize: 13, color: "#888", lineHeight: 1.7, margin: "0 0 12px" }}>{l.desc}</p>
                            <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                              <span style={{ fontSize: 14 }}>💡</span>
                              <span style={{ fontSize: 12, color: l.color, fontStyle: "italic" }}>{l.tip}</span>
                            </div>
                          </>
                        )}
                      </div>
                      <span style={{ color: l.color, fontSize: 16, fontWeight: 300, transform: open ? "rotate(45deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }}>+</span>
                    </button>
                  </div>
                );
              })}
            </div>

            <CalloutBox icon="⚠️" color="#FFD54F" title="The #1 Mistake New Analysts Make">
              Jumping straight to data without defining the question. Ask yourself: <strong>"What decision will this analysis inform?"</strong> If you can't answer that, stop — you don't have a clear enough brief yet.
            </CalloutBox>

            <NavButtons onPrev={() => scrollTo("types")} onNext={() => scrollTo("roles")} />
          </div>
        )}

        {/* ─── SECTION 4: ROLES & STACK ─── */}
        {activeSection === "roles" && (
          <div>
            <SectionHeader num="04" title="Roles, Career Paths & The Modern Stack" color="#CE93D8" />
            <Prose>
              The data world has many distinct roles. Understanding where <Highlight>Data Analyst</Highlight> fits in the ecosystem helps you know what to learn, what to skip, and what path to take. Click each role to explore — the ones <span style={{ color: "#81C784" }}>highlighted green</span> are directly accessible after this course.
            </Prose>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 10, margin: "28px 0 36px" }}>
              {roles.map((r, i) => {
                const open = expandedRole === i;
                return (
                  <div key={i} onClick={() => setExpandedRole(open ? null : i)} style={{
                    border: `1px solid ${r.yours ? r.color + "44" : "#1A1A2E"}`,
                    borderTop: `3px solid ${r.yours ? r.color : "#1A1A2E"}`,
                    borderRadius: 4, padding: "16px 16px", background: open ? `${r.color}08` : "#0D0D18",
                    cursor: "pointer", transition: "all 0.2s", position: "relative",
                  }}>
                    {r.yours && <div style={{ position: "absolute", top: 8, right: 8, fontSize: 9, color: "#81C784", letterSpacing: "0.1em", background: "rgba(129,199,132,0.1)", padding: "2px 6px", borderRadius: 2 }}>YOURS ✓</div>}
                    <div style={{ fontSize: 22, marginBottom: 8 }}>{r.icon}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#DDD8F0", marginBottom: 4 }}>{r.title}</div>
                    <div style={{ fontSize: 11, color: r.color, marginBottom: open ? 12 : 0 }}>{r.salary}</div>
                    {open && (
                      <>
                        <p style={{ fontSize: 12, color: "#888", lineHeight: 1.6, margin: "0 0 10px" }}>{r.focus}</p>
                        <div style={{ fontSize: 11, color: "#666", fontFamily: "monospace" }}>🛠 {r.tools}</div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            <Subheading>The Modern Analyst Tech Stack (2025)</Subheading>
            <div style={{ border: "1px solid #1A1A2E", borderRadius: 4, overflow: "hidden", margin: "20px 0 32px" }}>
              {[
                { layer: "AI Layer", tools: "ChatGPT, Copilot, PandasAI, Gemini", color: "#CF9FFF", desc: "Accelerates every part of the stack" },
                { layer: "Visualization", tools: "Tableau, Power BI, Looker Studio", color: "#F48FB1", desc: "Present insights to stakeholders" },
                { layer: "Analytics / ML", tools: "Python, Scikit-learn, Excel", color: "#FFD54F", desc: "Analyze, model, and experiment" },
                { layer: "Query Layer", tools: "SQL, BigQuery, dbt", color: "#81C784", desc: "Extract and transform data" },
                { layer: "Storage Layer", tools: "Databases, Data Warehouses, Data Lakes", color: "#4FC3F7", desc: "Where the data lives" },
                { layer: "Data Sources", tools: "CRMs, APIs, spreadsheets, logs, forms", color: "#FF8A65", desc: "Raw inputs to the pipeline" },
              ].map((l, i, arr) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 16, padding: "12px 18px",
                  borderBottom: i < arr.length - 1 ? "1px solid #12121F" : "none",
                  background: "#0A0A14",
                }}>
                  <div style={{ width: 110, flexShrink: 0 }}>
                    <div style={{ fontSize: 11, color: l.color, fontFamily: "monospace", fontWeight: 700 }}>{l.layer}</div>
                  </div>
                  <div style={{ flex: 1, fontSize: 12, color: "#888", fontFamily: "monospace" }}>{l.tools}</div>
                  <div style={{ fontSize: 11, color: "#444", maxWidth: 180, textAlign: "right" }}>{l.desc}</div>
                </div>
              ))}
            </div>

            <NavButtons onPrev={() => scrollTo("lifecycle")} onNext={() => scrollTo("aitools")} />
          </div>
        )}

        {/* ─── SECTION 5: AI TOOLS ─── */}
        {activeSection === "aitools" && (
          <div>
            <SectionHeader num="05" title="AI Tools for Data Analytics (2025)" color="#CF9FFF" />
            <Prose>
              AI tools don't replace data analysts — they make good analysts <Highlight>10× faster</Highlight>. The analysts getting hired right now are those who know how to use AI as a co-pilot: using it to speed up repetitive work, generate starting points, and explain complex output — while applying their own judgment to validate everything.
            </Prose>

            <CalloutBox icon="⚠️" color="#FFD54F" title="The Golden Rule of AI in Analytics">
              <strong>AI generates. You validate.</strong> AI-generated SQL can have subtle bugs. AI-generated insights can miss context. Your job is to verify, refine, and add business judgment. Blind trust in AI output is the fastest way to publish wrong insights.
            </CalloutBox>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, margin: "28px 0 36px" }}>
              {aiToolsIntro.map((t, i) => {
                const open = expandedAI === i;
                return (
                  <div key={i} style={{ border: `1px solid ${open ? t.color + "44" : "#1A1A2E"}`, borderRadius: 4, overflow: "hidden" }}>
                    <button onClick={() => setExpandedAI(open ? null : i)} style={{
                      width: "100%", background: open ? `${t.color}08` : "#0D0D18",
                      border: "none", cursor: "pointer", padding: "14px 18px",
                      display: "flex", alignItems: "center", gap: 14,
                      fontFamily: "inherit", textAlign: "left",
                    }}>
                      <span style={{ fontSize: 20 }}>{t.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#DDD8F0" }}>{t.name}</div>
                        {!open && <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>{t.use.substring(0, 60)}...</div>}
                      </div>
                      <span style={{ color: t.color, fontSize: 16, transform: open ? "rotate(45deg)" : "none", transition: "transform 0.2s" }}>+</span>
                    </button>
                    {open && (
                      <div style={{ padding: "0 18px 18px 52px", background: `${t.color}06` }}>
                        <div style={{ height: 1, background: `${t.color}22`, margin: "0 0 14px" }} />
                        <p style={{ fontSize: 13, color: "#AAA", lineHeight: 1.7, margin: "0 0 14px" }}>{t.use}</p>
                        <div style={{ background: "#07070E", border: `1px solid ${t.color}33`, borderRadius: 3, padding: "12px 14px" }}>
                          <div style={{ fontSize: 9, color: t.color, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8, fontFamily: "monospace" }}>TRY THIS PROMPT</div>
                          <code style={{ fontSize: 12, color: t.color, fontFamily: "monospace", whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{t.prompt}</code>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <Subheading>How to Use AI Alongside This Course</Subheading>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, margin: "16px 0 32px" }}>
              {[
                { do: true, text: "Use AI to explain concepts you don't understand" },
                { do: true, text: "Use AI to generate starter code, then read and modify it" },
                { do: true, text: "Use AI to generate datasets for practice" },
                { do: true, text: "Use AI to debug errors by pasting the error message" },
                { do: false, text: "Copy-paste AI code without understanding it" },
                { do: false, text: "Trust AI-generated statistics without verifying" },
                { do: false, text: "Let AI write your entire project and call it yours" },
                { do: false, text: "Skip learning fundamentals because AI can do it" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 14px", background: item.do ? "rgba(129,199,132,0.05)" : "rgba(255,100,100,0.05)", border: `1px solid ${item.do ? "rgba(129,199,132,0.2)" : "rgba(255,100,100,0.2)"}`, borderRadius: 3 }}>
                  <span style={{ fontSize: 14, flexShrink: 0 }}>{item.do ? "✅" : "❌"}</span>
                  <span style={{ fontSize: 12, color: "#888", lineHeight: 1.5 }}>{item.text}</span>
                </div>
              ))}
            </div>

            <NavButtons onPrev={() => scrollTo("roles")} onNext={() => scrollTo("setup")} />
          </div>
        )}

        {/* ─── SECTION 6: SETUP ─── */}
        {activeSection === "setup" && (
          <div>
            <SectionHeader num="06" title="Setting Up Your Environment" color="#81C784" />
            <Prose>
              Your dev environment is your workshop. Setting it up correctly from day one saves hours of frustration later. Complete all 5 steps below before moving to Part 2 — every lesson from here forward assumes these tools are ready.
            </Prose>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, margin: "28px 0 36px" }}>
              {setupSteps.map((s, i) => {
                const open = expandedSetup === i;
                return (
                  <div key={i} style={{ border: `1px solid ${open ? s.color + "55" : "#1A1A2E"}`, borderRadius: 4, overflow: "hidden" }}>
                    <button onClick={() => setExpandedSetup(open ? null : i)} style={{
                      width: "100%", background: open ? `${s.color}0A` : "#0D0D18",
                      border: "none", cursor: "pointer", padding: "14px 18px",
                      display: "flex", alignItems: "center", gap: 14,
                      fontFamily: "inherit", textAlign: "left",
                    }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: `${s.color}18`, border: `1px solid ${s.color}44`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ fontSize: 11, color: s.color, fontFamily: "monospace", fontWeight: 700 }}>{s.step}</span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#DDD8F0" }}>{s.title}</div>
                        {!open && <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>{s.desc}</div>}
                      </div>
                      <span style={{ color: s.color, fontSize: 16, transform: open ? "rotate(45deg)" : "none", transition: "transform 0.2s" }}>+</span>
                    </button>
                    {open && (
                      <div style={{ padding: "0 18px 18px 60px", background: `${s.color}06` }}>
                        <div style={{ height: 1, background: `${s.color}22`, margin: "0 0 14px" }} />
                        <p style={{ fontSize: 13, color: "#AAA", lineHeight: 1.7, margin: "0 0 6px" }}>{s.desc}</p>
                        <p style={{ fontSize: 12, color: s.color, margin: "0 0 14px" }}>🔗 <a href={`https://${s.link}`} style={{ color: s.color }}>{s.link}</a></p>
                        <div style={{ background: "#07070E", border: `1px solid #1A1A2E`, borderRadius: 3, padding: "12px 14px" }}>
                          <div style={{ fontSize: 9, color: "#555", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8, fontFamily: "monospace" }}>TERMINAL / NOTES</div>
                          <code style={{ fontSize: 12, color: "#81C784", fontFamily: "monospace", whiteSpace: "pre-wrap", lineHeight: 1.7 }}>{s.cmd}</code>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <CalloutBox icon="✅" color="#81C784" title="Setup Checklist">
              Before moving to Part 2, confirm: <br />
              <span style={{ color: "#81C784" }}>□</span> Jupyter Notebook launches successfully&nbsp;&nbsp;
              <span style={{ color: "#81C784" }}>□</span> VS Code installed with Python extension&nbsp;&nbsp;
              <span style={{ color: "#81C784" }}>□</span> GitHub account created&nbsp;&nbsp;
              <span style={{ color: "#81C784" }}>□</span> ChatGPT account active&nbsp;&nbsp;
              <span style={{ color: "#81C784" }}>□</span> GitHub Copilot enabled in VS Code
            </CalloutBox>

            <NavButtons onPrev={() => scrollTo("aitools")} onNext={() => scrollTo("quiz")} nextLabel="Take the Quiz →" />
          </div>
        )}

        {/* ─── SECTION 7: QUIZ ─── */}
        {activeSection === "quiz" && (
          <div>
            <SectionHeader num="07" title="Part 1 Knowledge Check" color="#FFD54F" />
            <Prose>5 questions. Test what you've learned before moving to Part 2.</Prose>

            {!quizState.done ? (
              <div style={{ margin: "28px 0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <span style={{ fontSize: 11, color: "#555", letterSpacing: "0.15em", fontFamily: "monospace" }}>
                    QUESTION {quizState.idx + 1} / {quizQuestions.length}
                  </span>
                  <span style={{ fontSize: 11, color: "#81C784", fontFamily: "monospace" }}>
                    SCORE: {quizState.score} / {quizState.idx}
                  </span>
                </div>
                <div style={{ height: 3, background: "#1A1A2E", borderRadius: 2, marginBottom: 28, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${((quizState.idx) / quizQuestions.length) * 100}%`, background: "linear-gradient(90deg, #4FC3F7, #FFD54F)", borderRadius: 2, transition: "width 0.4s" }} />
                </div>

                <div style={{ fontSize: 16, fontWeight: 700, color: "#DDD8F0", lineHeight: 1.6, marginBottom: 24, fontFamily: "Georgia, serif" }}>
                  {quizQuestions[quizState.idx].q}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {quizQuestions[quizState.idx].options.map((opt, i) => {
                    const isSelected = quizState.selected === i;
                    const isCorrect = i === quizQuestions[quizState.idx].answer;
                    let bg = "#0D0D18", border = "#1A1A2E", col = "#888";
                    if (quizState.answered) {
                      if (isCorrect) { bg = "rgba(129,199,132,0.1)"; border = "#81C784"; col = "#81C784"; }
                      else if (isSelected) { bg = "rgba(255,100,100,0.1)"; border = "#FF6464"; col = "#FF6464"; }
                    } else if (isSelected) { bg = "rgba(255,214,79,0.1)"; border = "#FFD54F"; col = "#FFD54F"; }
                    return (
                      <button key={i} onClick={() => handleAnswer(i)} style={{
                        background: bg, border: `1px solid ${border}`, borderRadius: 4,
                        padding: "13px 18px", cursor: quizState.answered ? "default" : "pointer",
                        textAlign: "left", fontFamily: "inherit", fontSize: 13, color: col,
                        lineHeight: 1.5, transition: "all 0.2s",
                      }}>
                        <span style={{ marginRight: 10, fontFamily: "monospace", fontSize: 11 }}>
                          {String.fromCharCode(65 + i)}.
                        </span>
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {quizState.answered && (
                  <div style={{ margin: "20px 0 0", padding: "14px 18px", background: "rgba(255,213,79,0.06)", border: "1px solid rgba(255,213,79,0.2)", borderRadius: 4 }}>
                    <div style={{ fontSize: 10, color: "#FFD54F", letterSpacing: "0.15em", marginBottom: 6, fontFamily: "monospace" }}>EXPLANATION</div>
                    <p style={{ fontSize: 13, color: "#AAA", margin: "0 0 16px", lineHeight: 1.7 }}>
                      {quizQuestions[quizState.idx].explanation}
                    </p>
                    <button onClick={nextQ} style={{
                      background: "#FFD54F", border: "none", borderRadius: 3,
                      padding: "8px 20px", cursor: "pointer", fontFamily: "monospace",
                      fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
                      color: "#07070E",
                    }}>
                      {quizState.idx < quizQuestions.length - 1 ? "NEXT QUESTION →" : "SEE RESULTS →"}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ margin: "28px 0", textAlign: "center" }}>
                <div style={{ fontSize: 64, marginBottom: 12 }}>
                  {quizState.score >= 4 ? "🏆" : quizState.score >= 3 ? "✅" : "📚"}
                </div>
                <div style={{ fontSize: 40, fontWeight: 900, color: quizState.score >= 4 ? "#81C784" : quizState.score >= 3 ? "#FFD54F" : "#FF8A65", marginBottom: 8 }}>
                  {quizState.score} / {quizQuestions.length}
                </div>
                <div style={{ fontSize: 16, color: "#888", marginBottom: 24 }}>
                  {quizState.score === 5 ? "Perfect! You're ready for Part 2." : quizState.score >= 3 ? "Solid understanding. Review any missed topics above." : "Review Sections 01–05 before continuing to Part 2."}
                </div>
                <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                  <button onClick={() => setQuizState({ idx: 0, selected: null, answered: false, score: 0, done: false })} style={{
                    background: "none", border: "1px solid #333", borderRadius: 3,
                    padding: "8px 20px", cursor: "pointer", fontFamily: "monospace",
                    fontSize: 11, color: "#666", letterSpacing: "0.1em",
                  }}>RETAKE QUIZ</button>
                  <button onClick={() => scrollTo("what")} style={{
                    background: "#FF8C42", border: "none", borderRadius: 3,
                    padding: "8px 24px", cursor: "pointer", fontFamily: "monospace",
                    fontSize: 11, fontWeight: 700, color: "#07070E", letterSpacing: "0.1em",
                  }}>REVIEW MATERIAL ↑</button>
                </div>

                <div style={{ marginTop: 40, padding: "20px", background: "#0D0D18", border: "1px solid #1A1A2E", borderRadius: 4, textAlign: "left" }}>
                  <div style={{ fontSize: 11, color: "#555", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12, fontFamily: "monospace" }}>WHAT'S IN PART 2 →</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#DDD8F0", marginBottom: 6 }}>Statistics for Data Analytics — Supercharged with AI</div>
                  <p style={{ fontSize: 13, color: "#666", lineHeight: 1.7, margin: 0 }}>
                    Mean, median, standard deviation, distributions, hypothesis testing, correlation — with AI tools that explain every output in plain English.
                  </p>
                </div>
              </div>
            )}

            <NavButtons onPrev={() => scrollTo("setup")} />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── REUSABLE SUB-COMPONENTS ─────────────────────────────────

function SectionHeader({ num, title, color }) {
  return (
    <div style={{ marginBottom: 28, paddingBottom: 16, borderBottom: `1px solid #1A1A2E` }}>
      <div style={{ fontSize: 10, color: color, letterSpacing: "0.3em", fontFamily: "monospace", marginBottom: 6 }}>SECTION {num}</div>
      <h2 style={{ margin: 0, fontSize: "clamp(20px,3vw,28px)", fontWeight: 900, color: "#DDD8F0", letterSpacing: "-0.01em" }}>
        <span style={{ color }}>{num}. </span>{title}
      </h2>
    </div>
  );
}

function Subheading({ children }) {
  return <h3 style={{ fontSize: 16, fontWeight: 700, color: "#DDD8F0", margin: "32px 0 12px", borderLeft: "3px solid #FF8C42", paddingLeft: 12 }}>{children}</h3>;
}

function Prose({ children }) {
  return <p style={{ fontSize: 14, color: "#888", lineHeight: 1.9, margin: "0 0 18px" }}>{children}</p>;
}

function Highlight({ children }) {
  return <strong style={{ color: "#DDD8F0", fontWeight: 700 }}>{children}</strong>;
}

function CalloutBox({ icon, color, title, children }) {
  return (
    <div style={{ margin: "24px 0", padding: "16px 20px", background: `${color}08`, border: `1px solid ${color}33`, borderLeft: `3px solid ${color}`, borderRadius: 4 }}>
      <div style={{ fontSize: 12, color: color, fontWeight: 700, marginBottom: 8, display: "flex", gap: 8, alignItems: "center" }}>
        <span>{icon}</span>{title}
      </div>
      <div style={{ fontSize: 13, color: "#888", lineHeight: 1.7 }}>{children}</div>
    </div>
  );
}

function NavButtons({ onPrev, onNext, nextLabel = "Next Section →" }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 48, paddingTop: 24, borderTop: "1px solid #1A1A2E" }}>
      {onPrev ? (
        <button onClick={onPrev} style={{ background: "none", border: "1px solid #1A1A2E", borderRadius: 3, padding: "8px 18px", cursor: "pointer", fontFamily: "monospace", fontSize: 11, color: "#555", letterSpacing: "0.1em" }}>
          ← Previous
        </button>
      ) : <div />}
      {onNext && (
        <button onClick={onNext} style={{ background: "#FF8C42", border: "none", borderRadius: 3, padding: "8px 24px", cursor: "pointer", fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: "#07070E", letterSpacing: "0.1em" }}>
          {nextLabel}
        </button>
      )}
    </div>
  );
}
