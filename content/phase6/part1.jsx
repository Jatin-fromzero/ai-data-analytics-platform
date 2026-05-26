"use client";
// @ts-nocheck
import { useState } from "react";

// All content stored as plain strings — no template literal conflicts

const portfolioProjects = [
  {
    phase: "P1", title: "Excel Sales Dashboard", col: "#81C784",
    tools: ["Excel", "Microsoft Copilot", "Power Query"],
    skills: ["Pivot tables", "XLOOKUP", "Conditional formatting", "Forecasting"],
    link: "Excel workbook on Google Drive or GitHub",
    pitch: "Built an automated Excel dashboard for RetailCo analysing £142K annual revenue across 4 regions, 4 product categories, and 12 months. Used Power Query for data cleaning and Copilot to generate trend analysis commentary. Reduced monthly reporting time by 70%.",
    improvements: ["Add a macro to auto-refresh data on open", "Add a budget vs actual variance analysis", "Record a 2-minute Loom walkthrough video"],
  },
  {
    phase: "P2", title: "E-Commerce SQL Analytics Engine", col: "#4FC3F7",
    tools: ["BigQuery", "SQL", "Looker Studio", "Gemini AI"],
    skills: ["Window functions", "CTEs", "RFM segmentation", "Cohort analysis", "Funnel analysis"],
    link: "GitHub repo + live Looker Studio dashboard",
    pitch: "Built a complete SQL analytics engine in BigQuery for a 50,000-order e-commerce dataset. Wrote production-grade RFM segmentation (Champions to Lost), monthly cohort retention (48% Month 1 for Q4 cohort), and 5-step funnel analysis identifying a 60% drop-off at checkout. Visualised in Looker Studio with Gemini AI insights.",
    improvements: ["Add a GitHub Actions workflow to run SQL quality checks", "Write a README with the business questions answered", "Add a Gemini-generated narrative section to the dashboard"],
  },
  {
    phase: "P3", title: "Customer Intelligence Platform", col: "#B2FF59",
    tools: ["Python", "Scikit-learn", "SHAP", "Streamlit", "H2O AutoML"],
    skills: ["EDA", "Feature engineering", "Churn prediction", "SHAP explainability", "Streamlit deployment"],
    link: "GitHub repo + live Streamlit app URL",
    pitch: "Built an end-to-end customer analytics platform in Python predicting churn with 87% ROC-AUC. Used ydata-profiling for automated EDA, engineered 7 RFM-based features, trained a Random Forest model, and used SHAP to explain predictions in business language. Deployed as a live Streamlit web app.",
    improvements: ["Add a customer-level prediction table to the Streamlit app", "Write a SHAP narrative: top 3 drivers of churn at RetailCo", "Add H2O AutoML comparison showing leaderboard"],
  },
  {
    phase: "P4", title: "Executive Analytics Suite", col: "#FF8A65",
    tools: ["Tableau", "Power BI", "Looker Studio", "ThoughtSpot"],
    skills: ["LOD expressions", "DAX", "Dashboard design", "Data storytelling", "Self-service analytics"],
    link: "Tableau Public URL + Power BI Service URL + Looker Studio URL",
    pitch: "Designed and deployed a four-tool executive analytics suite for RetailCo's quarterly business review. Tableau for operational analysis with LOD expressions and filter actions, Power BI with DAX time intelligence measures and Microsoft Copilot, Looker Studio with Gemini AI narratives, and ThoughtSpot for search-driven self-service.",
    improvements: ["Record a 5-minute dashboard walkthrough video for LinkedIn", "Write a case study Medium post: 'How I built 4 dashboards in one week'", "Add mobile layout to the Power BI report"],
  },
  {
    phase: "P5", title: "AI Analytics Platform", col: "#CE93D8",
    tools: ["dbt", "Airflow", "LangChain", "OpenAI API", "Evidently"],
    skills: ["Data engineering", "RAG pipelines", "LLM integration", "Model monitoring", "Cloud deployment"],
    link: "GitHub repo + live Streamlit chatbot URL + dbt docs link",
    pitch: "Built a production-grade AI analytics platform: dbt models transforming RetailCo data in BigQuery (staging → marts → RFM segments), an Airflow DAG running daily at 6am, a LangChain RAG chatbot deployed on Streamlit Cloud letting stakeholders ask questions about customer data in plain English, and Evidently monitoring for model drift.",
    improvements: ["Add dbt source freshness tests to the pipeline", "Add conversation memory to the chatbot so users can refer back", "Write a LinkedIn post: key lessons from building a RAG analytics system"],
  },
];

const cvSections = [
  {
    section: "Header", col: "#4FC3F7",
    do: ["Full name in large font", "Location (city only — no full address)", "LinkedIn URL (customised, not auto-generated)", "GitHub URL", "Portfolio/Streamlit app URL", "Professional email"],
    dont: ["Photo (except Scandinavia/Germany where it is expected)", "Date of birth", "Marital status", "Full home address", "Phone number (only if recruiter asks)"],
    tip: "Your LinkedIn and GitHub URLs are as important as your contact details. Recruiters click them. Make sure both are up to date before you send a single application.",
  },
  {
    section: "Professional Summary", col: "#81C784",
    do: ["2-3 sentences maximum", "Lead with years of experience and your specialisation", "Mention 2-3 specific technologies", "Include one quantified achievement", "Match language to the job description"],
    dont: ["'I am a passionate, hardworking individual...'", "Generic buzzwords without specifics", "More than 4 sentences", "Mentioning what you want from the role"],
    tip: "Write your summary LAST — after you have written everything else. The best summaries distil the most impressive things from the rest of the CV.",
  },
  {
    section: "Technical Skills", col: "#FFD54F",
    do: ["Organise by category: Languages, BI Tools, Cloud, Databases", "List tools you can actually demonstrate in an interview", "Put the most in-demand skills first (SQL, Python, Tableau, Power BI)", "Include AI tools: ChatGPT, GitHub Copilot, Gemini AI"],
    dont: ["Rating bars or percentages (100% Excel is meaningless)", "Listing every tool you have touched once", "Soft skills in the technical section", "Outdated tools nobody uses"],
    tip: "Mirror the exact tool names from the job description. If the JD says 'Tableau' not 'Tableau Desktop', use 'Tableau'. ATS systems do literal keyword matching.",
  },
  {
    section: "Experience", col: "#FF8A65",
    do: ["STAR format: Situation > Task > Action > Result", "Every bullet starts with a strong action verb", "Quantify wherever possible: %, £, hours saved, rows of data", "3-5 bullets per role", "Most relevant experience at the top"],
    dont: ["Responsibilities without outcomes: 'Responsible for...'", "Passive voice: 'Reports were generated...'", "Too many bullets (> 6)", "Job descriptions copied from the company website"],
    tip: "The magic formula: [Action verb] + [what you did] + [using what tool/method] + [resulting in what measurable outcome]. 'Automated monthly sales reporting using Python, reducing analyst time from 8 hours to 15 minutes per month.'",
  },
  {
    section: "Projects", col: "#CE93D8",
    do: ["List your 5 portfolio projects from this course", "Include the live URL for each (GitHub + deployed app)", "One sentence description + one quantified result", "Mention the tech stack for each project"],
    dont: ["Projects with no live link or demo", "Group projects without specifying your specific contribution", "Personal projects that are not relevant to data analytics"],
    tip: "Projects section is CRITICAL if you are transitioning into data analytics. This is your evidence. Recruiters who cannot find your work will not call you.",
  },
  {
    section: "Education", col: "#F48FB1",
    do: ["Degree, university, graduation year", "Relevant modules if recent graduate", "This course: 'Data Analytics — AI-Powered (16-week intensive)'", "Certifications: Google Data Analytics, dbt Fundamentals, AWS Cloud Practitioner"],
    dont: ["Secondary school if you have a degree", "GPA unless above 3.8 or employer asks", "Modules that are completely unrelated to data"],
    tip: "Add 'Relevant coursework' for recent graduates if your degree modules align with analytics. 'Statistics, Database Systems, Business Intelligence' are worth listing.",
  },
];

const linkedinSections = [
  {
    section: "Headline",
    bad: "Student at University of Manchester",
    good: "Data Analyst | SQL · Python · Tableau · Power BI | Turning data into decisions",
    tip: "Your headline is the most-indexed field on LinkedIn. 220 characters max. Include your target job title AND your top 3-4 tools. Recruiters search by keywords, not job titles alone.",
  },
  {
    section: "About Section",
    bad: "I am looking for opportunities in data analytics and I enjoy working with data.",
    good: "I build analytics systems that help businesses make faster, more confident decisions. Over the past 6 months I have built 5 end-to-end data projects: SQL analytics engines in BigQuery, Python ML pipelines with 87% churn prediction accuracy, and live dashboards in Tableau, Power BI, and Looker Studio. Tools: SQL, Python, Pandas, Scikit-learn, dbt, Airflow, Tableau, Power BI. Open to Data Analyst and Analytics Engineer roles.",
    tip: "Use all 2,600 characters. Include: what you do, evidence (project outcomes), tools list, and what you are looking for. End with a call to action.",
  },
  {
    section: "Featured Section",
    bad: "Nothing — leaving it empty",
    good: "Pin 3 items: (1) Your best Tableau Public or Streamlit app link, (2) A LinkedIn post showing a dashboard screenshot with insight, (3) Your GitHub profile",
    tip: "The Featured section appears directly under your About section. It is prime real estate. Pin your best portfolio work here. A dashboard screenshot gets 10x more profile views.",
  },
  {
    section: "Experience Descriptions",
    bad: "Worked on various data projects and assisted with reporting.",
    good: "Built automated Jupyter notebook pipeline processing 50,000+ orders monthly. Wrote 12 SQL queries replacing manual Excel analysis, saving 6 hours/week. Created Tableau dashboard adopted by 3 department heads for weekly reviews.",
    tip: "Even if this is a project or self-study, write it like a role. 'Data Analyst (Portfolio Projects) | Self-Directed | 2024-Present'. Describe what you built and the outcomes.",
  },
  {
    section: "Skills Section",
    bad: "Microsoft Office, Teamwork, Communication, Problem Solving",
    good: "SQL (endorsed), Python (endorsed), Tableau (endorsed), Power BI, BigQuery, dbt, Apache Airflow, Machine Learning, Data Visualisation, Statistical Analysis",
    tip: "Add exactly the skills from your target job descriptions. Ask 3 connections to endorse your top 5 skills. Skills with 10+ endorsements show credibly in searches.",
  },
];

const interviewQuestions = [
  {
    type: "Technical — SQL",
    col: "#4FC3F7",
    questions: [
      "Write a query to find the top 3 customers by revenue in each region.",
      "Explain the difference between WHERE and HAVING. Give an example of when to use HAVING.",
      "What is a window function? Write a query using ROW_NUMBER() to get the latest order per customer.",
      "How would you calculate month-over-month revenue change in SQL?",
      "What is a CTE and when would you use one instead of a subquery?",
    ],
    answers: [
      "ROW_NUMBER() OVER (PARTITION BY region ORDER BY revenue DESC) — filter WHERE rank <= 3. Or use DENSE_RANK() for ties.",
      "WHERE filters individual rows before aggregation. HAVING filters groups after GROUP BY. Use HAVING when filtering on an aggregate: HAVING SUM(revenue) > 1000.",
      "Window functions compute across a set of related rows without collapsing them. ROW_NUMBER() assigns unique integers. Use: SELECT *, ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date DESC) AS rn — then filter WHERE rn = 1.",
      "LAG(revenue, 1) OVER (ORDER BY month) gives previous month. MoM % = (current - LAG) / LAG * 100. Or use DATEDIFF with DATEADD in date filtering.",
      "CTE = WITH clause. Use when a subquery is used more than once, when the logic is complex (> 3 lines), or to improve readability. Performance is usually identical to subquery.",
    ],
  },
  {
    type: "Technical — Python / Analytics",
    col: "#B2FF59",
    questions: [
      "How would you handle a DataFrame with 30% null values in a key column?",
      "What is the difference between a Measure and a Calculated Column in Power BI?",
      "Walk me through how you would do EDA on a new dataset.",
      "What is overfitting in machine learning? How do you detect and prevent it?",
      "Explain what SHAP values tell you about a machine learning model.",
    ],
    answers: [
      "First: investigate WHY they are null. If random: fill with median/mode or model imputation. If systematic: may indicate a data pipeline issue upstream. Document your decision. Never auto-drop without understanding the cause.",
      "Measure: computed dynamically at query time, responds to all filters, no storage. Calculated Column: computed once at load time, stored in the table, ignores filters. Use measures for aggregations, calculated columns for row-level logic.",
      "7-step EDA: (1) Shape/schema, (2) Missing values, (3) Distributions, (4) Descriptive stats, (5) Categorical summaries, (6) Correlations, (7) Outlier detection. Run ydata-profiling first for automated overview, then investigate alerts manually.",
      "Overfitting: model performs well on training data but poorly on new data — it memorised noise. Detect with: train vs test accuracy gap, cross-validation. Prevent with: regularisation, more data, feature selection, simpler model.",
      "SHAP values show each feature's contribution to each individual prediction — both magnitude AND direction. Positive SHAP = feature pushes prediction higher. The summary plot shows global feature importance. Force plot shows one specific prediction.",
    ],
  },
  {
    type: "Behavioural (STAR)",
    col: "#FFD54F",
    questions: [
      "Tell me about a time you found an insight in data that changed a business decision.",
      "Describe a project where the data was messy or incomplete. How did you handle it?",
      "Tell me about a time you had to explain complex analysis to a non-technical audience.",
      "Describe a situation where you had competing priorities. How did you decide what to work on?",
      "Tell me about a time your analysis was wrong. What happened and what did you learn?",
    ],
    answers: [
      "STAR structure: Situation (what was the context), Task (what were you asked to do), Action (what did you specifically do), Result (quantified outcome). Prepare 3-4 specific stories from your projects that you can adapt to different questions.",
      "Key elements: acknowledge the messiness, explain how you identified and fixed it, quantify the impact of the cleaning. Example: 'Revenue column had 15% nulls. Investigated and found they were all from one region where the CRM was misconfigured. Fixed at source + backfilled with estimates based on historical ratios.'",
      "The key: lead with the headline ('Revenue is down 12% and here is why'), then show the chart, then explain methodology if asked. Use analogies. Never say 'the correlation coefficient is 0.87' — say 'when we increase X, Y tends to go up by roughly 87% of the same amount'.",
      "Use prioritisation frameworks: impact vs effort matrix. High impact + low effort first. Communicate trade-offs upward: 'I can deliver A by Friday or B by Friday, not both — which matters more to the business?'",
      "Honesty is rewarded. Show you: identified the error yourself (rather than being told), understood the root cause, corrected it, and changed your process to prevent recurrence. Owning mistakes with a growth mindset is a green flag to interviewers.",
    ],
  },
  {
    type: "Case Study / Take-Home",
    col: "#FF8A65",
    questions: [
      "You are given a CSV of 100,000 transactions. Revenue has dropped 15% last month. How do you investigate?",
      "Design a dashboard for a Head of Sales. What questions does it need to answer?",
      "We have customer data but no churn labels. How would you define and build a churn model?",
      "You notice revenue figures in the BI tool don't match the finance team's Excel numbers. How do you resolve this?",
      "What metrics would you use to measure the health of a subscription business?",
    ],
    answers: [
      "Framework: (1) Verify the drop is real — check for data issues first. (2) Segment the drop: by region, product, channel, customer type. (3) Find where most of the drop is concentrated (80/20). (4) Hypothesise cause: price change, supply issue, competition, seasonal. (5) Quantify: which segment, how much, since when.",
      "Sales dashboard questions: What is our revenue vs target this month? Which reps are above/below quota? Which regions are growing vs declining? What is our pipeline coverage? What is the average deal size trend? Design around these 5 questions, not around showing all available data.",
      "Define churn without labels: (1) Choose a recency threshold (e.g. no purchase in 90 days = churned). (2) Build RFM features. (3) Train a binary classifier. (4) Validate with business logic. (5) Iterate the threshold with business stakeholders.",
      "Data reconciliation: (1) Agree on the definition: same time period, same status filter, same currency. (2) Start from a common ancestor (the raw database). (3) Trace each transformation to find where the divergence begins. (4) Document the agreed single source of truth. (5) Create a shared metrics definition document.",
      "SaaS/subscription health metrics: MRR and ARR, churn rate (customer and revenue), net revenue retention (NRR), customer acquisition cost (CAC), lifetime value (LTV), LTV:CAC ratio, monthly active users (MAU), activation rate.",
    ],
  },
];

const jobSearchStrategy = [
  { step: "01", title: "Define your target role clearly", col: "#4FC3F7", desc: "Data Analyst, Analytics Engineer, BI Analyst, or Data Scientist? Each has different expectations. Analyse 20 job descriptions in your target role. List the most common tools and skills. Your portfolio should speak directly to those requirements." },
  { step: "02", title: "Optimise applications for ATS", col: "#81C784", desc: "90% of applications are screened by Applicant Tracking Systems before a human sees them. Include exact keywords from the job description in your CV. Use standard section headings (Experience, Skills, Education). Avoid tables, headers/footers, and graphics in the CV file." },
  { step: "03", title: "Quality over quantity", col: "#FFD54F", desc: "10 tailored applications outperform 100 generic ones. For each application: customise your professional summary to match the role, reorder your skills to lead with what they asked for, and write 2 sentences in your cover email connecting your specific projects to their specific requirements." },
  { step: "04", title: "LinkedIn outreach strategy", col: "#FF8A65", desc: "70% of jobs are filled through networks. Message 3 data analysts at companies you want to work for each week. Not to ask for jobs — to ask for 20-minute informational calls about their work. A referral from an employee increases interview chance by 5x." },
  { step: "05", title: "Showcase work publicly", col: "#CE93D8", desc: "Post on LinkedIn 2x per week: a dashboard screenshot with 3 insights, a data finding from your projects, a tool you learned. Recruiters find candidates through content. Your Tableau Public profile, GitHub, and Streamlit apps all need links in your LinkedIn profile." },
  { step: "06", title: "Track every application", col: "#F48FB1", desc: "Use a spreadsheet: Company, Role, Date applied, Source, Status, Next step, Notes. Review weekly — follow up after 7 days if no response. Data shows 80% of candidates never follow up — it is a simple differentiator." },
];

const sections = [
  { id: "intro",     label: "Overview"    },
  { id: "portfolio", label: "Portfolio"   },
  { id: "cv",        label: "CV"          },
  { id: "linkedin",  label: "LinkedIn"    },
  { id: "interview", label: "Interviews"  },
  { id: "strategy",  label: "Job Search"  },
  { id: "salary",    label: "Salary"      },
];

export default function Phase6Part1() {
  const [sec, setSec] = useState("intro");
  const [openProject,   setOpenProject]   = useState(null);
  const [openCVSection, setOpenCVSection] = useState(null);
  const [openInterview, setOpenInterview] = useState(null);
  const [openAnswer,    setOpenAnswer]    = useState({});
  const [openStrategy,  setOpenStrategy]  = useState(null);

  const ACC = "#FFD700";

  const toggleAnswer = (ti, ai) => {
    const key = ti + "-" + ai;
    setOpenAnswer(p => ({ ...p, [key]: !p[key] }));
  };

  return (
    <div style={{ minHeight: "100vh", background: "#07070E", color: "#DDD8F0", fontFamily: "Georgia, serif" }}>

      {/* NAV */}
      <div style={{ background: "#0A0A14", borderBottom: "1px solid #16162A", padding: "0 24px", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 940, margin: "0 auto", display: "flex", alignItems: "center", overflowX: "auto" }}>
          <div style={{ fontSize: 10, color: ACC, letterSpacing: "0.2em", textTransform: "uppercase", padding: "14px 20px 14px 0", borderRight: "1px solid #1A1A2E", marginRight: 12, whiteSpace: "nowrap" }}>
            P6 · PART 1
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
                PHASE 6 · PART 1 OF 1 · WEEK 16
              </div>
              <h1 style={{ fontSize: "clamp(26px,5vw,44px)", fontWeight: 900, margin: "0 0 16px", lineHeight: 1.12, letterSpacing: "-0.02em" }}>
                Job-Ready<br />
                <span style={{ color: ACC }}>Career Launch</span><br />
                <span style={{ fontStyle: "italic", fontWeight: 400, fontSize: "0.65em", color: "#555" }}>Portfolio · CV · LinkedIn · Interviews</span>
              </h1>
              <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, maxWidth: 580, margin: "0 0 24px" }}>
                You have built the skills. Now you need to get hired. Phase 6 is entirely about translating 5 phases of work into a job offer — portfolio review and improvement, CV writing that beats ATS, LinkedIn that recruiters find, interview preparation for SQL, Python, BI, and behavioural questions, job search strategy, and salary negotiation.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {["5-project portfolio review", "CV writing guide", "LinkedIn optimisation", "Technical interview prep", "40 practice questions + answers", "Job search strategy", "Salary negotiation"].map(t => (
                  <span key={t} style={{ padding: "4px 12px", background: "rgba(255,215,0,0.08)", border: "1px solid rgba(255,215,0,0.22)", borderRadius: 2, fontSize: 11, color: ACC }}>{t}</span>
                ))}
              </div>
            </div>

            <SH n="00" title="The Hiring Reality in 2025" col={ACC} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, margin: "20px 0 24px" }}>
              {[
                { stat: "300+",   label: "Applications per data analyst job posting", col: "#FF6464" },
                { stat: "6 sec",  label: "Time a recruiter spends on first CV scan",  col: "#FFD54F" },
                { stat: "70%",    label: "Jobs filled through network referrals",       col: "#81C784" },
              ].map((s, i) => (
                <div key={i} style={{ border: "1px solid " + s.col + "33", borderRadius: 4, padding: "16px", background: s.col + "06", textAlign: "center" }}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: s.col, marginBottom: 4 }}>{s.stat}</div>
                  <div style={{ fontSize: 12, color: "#666" }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 10, margin: "20px 0 36px" }}>
              {[
                { icon: "📁", title: "Portfolio Review",    desc: "All 5 projects reviewed and improved with employer-facing pitch for each", col: "#4FC3F7",  s: "portfolio" },
                { icon: "📄", title: "CV Writing",          desc: "Section-by-section guide — what to include, what kills applications",      col: "#81C784",  s: "cv"        },
                { icon: "💼", title: "LinkedIn",            desc: "Headline, About, Featured, Skills — what recruiters see and search for",   col: "#FFD54F",  s: "linkedin"  },
                { icon: "🎯", title: "Interviews",          desc: "SQL, Python, BI, case studies and behavioural — 40 Q&As",                   col: "#FF8A65",  s: "interview" },
                { icon: "🔍", title: "Job Search",          desc: "6-step strategy: target roles, ATS, outreach, LinkedIn content",           col: "#CE93D8",  s: "strategy"  },
                { icon: "💰", title: "Salary",              desc: "How to research, when to bring it up, how to negotiate",                    col: "#F48FB1",  s: "salary"    },
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

            <Box col={ACC} icon="🎯" title="The Mindset Shift: From Student to Candidate">
              Everything you built in Phases 1-5 is evidence. Your job now is to present that evidence so compellingly that hiring managers see the analyst they need. You do not need to be perfect. You need to be clearly more prepared than the other 299 applicants. This phase is how.
            </Box>
            <Nav onNext={() => setSec("portfolio")} />
          </div>
        )}

        {/* ── PORTFOLIO ── */}
        {sec === "portfolio" && (
          <div>
            <SH n="01" title="Portfolio Review — 5 Projects" col="#4FC3F7" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 16px" }}>
              Your portfolio is your most powerful hiring tool. <strong style={{ color: "#DDD8F0" }}>Every project needs a live link, a one-sentence business pitch, and a clear demonstration of technical skill.</strong> Review each project below, implement the improvement suggestions, then write your pitch for each.
            </p>

            <Box col="#FFD54F" icon="⚡" title="Before You Start — The Portfolio Checklist">
              Every project must have: (1) a live, clickable link that works — test it right now, (2) a GitHub repo with a README explaining the business problem and your solution, (3) a screenshot or GIF showing the most impressive part, (4) the tech stack listed clearly. Projects with dead links or empty READMEs get skipped.
            </Box>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, margin: "20px 0 28px" }}>
              {portfolioProjects.map((proj, i) => {
                const open = openProject === i;
                return (
                  <div key={i} style={{ border: "1px solid " + (open ? proj.col + "55" : "#1A1A2E"), borderRadius: 4, overflow: "hidden" }}>
                    <button onClick={() => setOpenProject(open ? null : i)} style={{
                      width: "100%", background: open ? proj.col + "0A" : "#0D0D18",
                      border: "none", cursor: "pointer", padding: "16px 20px",
                      display: "flex", alignItems: "center", gap: 14, fontFamily: "inherit", textAlign: "left",
                    }}>
                      <span style={{ fontSize: 10, color: proj.col, background: proj.col + "18", padding: "3px 8px", borderRadius: 2, fontFamily: "monospace", flexShrink: 0 }}>{proj.phase}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#DDD8F0" }}>{proj.title}</div>
                        {!open && <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>{proj.tools.join(" · ")}</div>}
                      </div>
                      <span style={{ color: proj.col, fontSize: 18, transform: open ? "rotate(45deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }}>+</span>
                    </button>
                    {open && (
                      <div style={{ padding: "0 20px 22px 20px", background: proj.col + "06" }}>
                        <div style={{ height: 1, background: proj.col + "22", margin: "0 0 16px" }} />
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                          <div>
                            <span style={{ fontSize: 9, color: proj.col, letterSpacing: "0.15em", fontFamily: "monospace", fontWeight: 700 }}>TOOLS</span>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 6 }}>
                              {proj.tools.map(t => (
                                <span key={t} style={{ padding: "2px 8px", background: proj.col + "18", border: "1px solid " + proj.col + "33", borderRadius: 2, fontSize: 11, color: proj.col }}>{t}</span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <span style={{ fontSize: 9, color: proj.col, letterSpacing: "0.15em", fontFamily: "monospace", fontWeight: 700 }}>KEY SKILLS DEMONSTRATED</span>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 6 }}>
                              {proj.skills.map(s => (
                                <span key={s} style={{ padding: "2px 8px", background: "#0D0D18", border: "1px solid #1A1A2E", borderRadius: 2, fontSize: 11, color: "#888" }}>{s}</span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div style={{ background: "#07070E", border: "1px solid " + proj.col + "22", borderRadius: 3, padding: "12px 14px", marginBottom: 12 }}>
                          <span style={{ fontSize: 9, color: proj.col, letterSpacing: "0.15em", fontFamily: "monospace", fontWeight: 700 }}>CV / INTERVIEW PITCH</span>
                          <p style={{ fontSize: 13, color: "#AAA", margin: "8px 0 0", lineHeight: 1.7 }}>{proj.pitch}</p>
                        </div>

                        <div style={{ background: "rgba(255,213,79,0.05)", border: "1px solid rgba(255,213,79,0.2)", borderRadius: 3, padding: "12px 14px", marginBottom: 12 }}>
                          <span style={{ fontSize: 9, color: "#FFD54F", letterSpacing: "0.15em", fontFamily: "monospace", fontWeight: 700 }}>3 IMPROVEMENTS TO MAKE NOW</span>
                          <div style={{ marginTop: 8 }}>
                            {proj.improvements.map((imp, j) => (
                              <div key={j} style={{ display: "flex", gap: 8, marginBottom: 5 }}>
                                <span style={{ color: "#FFD54F", flexShrink: 0 }}>{j + 1}.</span>
                                <span style={{ fontSize: 12, color: "#888" }}>{imp}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div style={{ background: "#0D0D18", border: "1px solid #1A1A2E", borderRadius: 3, padding: "10px 14px" }}>
                          <span style={{ fontSize: 9, color: "#555", letterSpacing: "0.15em", fontFamily: "monospace", fontWeight: 700 }}>WHERE TO LINK IT</span>
                          <p style={{ fontSize: 12, color: "#666", margin: "6px 0 0" }}>{proj.link}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <Box col="#4FC3F7" icon="🤖" title="AI Prompt — Write Your Project Pitch">
              "I built a data analytics project. Here are the details: [describe your project, tools used, data size, and results]. Write a 3-sentence CV bullet point for this project that: (1) starts with an action verb, (2) mentions the specific tools, (3) ends with a quantified business outcome. Then write a 30-second verbal pitch I can use in an interview."
            </Box>
            <Nav onPrev={() => setSec("intro")} onNext={() => setSec("cv")} />
          </div>
        )}

        {/* ── CV ── */}
        {sec === "cv" && (
          <div>
            <SH n="02" title="CV Writing Guide" col="#81C784" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 16px" }}>
              A data analyst CV has one job: get you to a phone screen. <strong style={{ color: "#DDD8F0" }}>It is a marketing document, not a life history.</strong> Every word should answer the question: "why should they interview me?" Here is the complete section-by-section guide.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, margin: "0 0 24px" }}>
              {[
                { rule: "1 page for < 5 years experience", col: "#81C784" },
                { rule: "2 pages max for senior roles",    col: "#FFD54F" },
                { rule: "PDF format — always",             col: "#4FC3F7" },
              ].map((r, i) => (
                <div key={i} style={{ border: "1px solid " + r.col + "33", borderRadius: 3, padding: "12px 14px", background: r.col + "06", textAlign: "center" }}>
                  <span style={{ fontSize: 12, color: r.col, fontWeight: 700 }}>{r.rule}</span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, margin: "0 0 24px" }}>
              {cvSections.map((cvs, i) => {
                const open = openCVSection === i;
                return (
                  <div key={i} style={{ border: "1px solid " + (open ? cvs.col + "55" : "#1A1A2E"), borderRadius: 4, overflow: "hidden" }}>
                    <button onClick={() => setOpenCVSection(open ? null : i)} style={{
                      width: "100%", background: open ? cvs.col + "0A" : "#0D0D18",
                      border: "none", cursor: "pointer", padding: "14px 20px",
                      display: "flex", alignItems: "center", gap: 14, fontFamily: "inherit", textAlign: "left",
                    }}>
                      <div style={{ flex: 1, fontSize: 14, fontWeight: 700, color: open ? cvs.col : "#DDD8F0" }}>{cvs.section}</div>
                      <span style={{ color: cvs.col, fontSize: 18, transform: open ? "rotate(45deg)" : "none", transition: "transform 0.2s" }}>+</span>
                    </button>
                    {open && (
                      <div style={{ padding: "0 20px 20px 20px", background: cvs.col + "06" }}>
                        <div style={{ height: 1, background: cvs.col + "22", margin: "0 0 14px" }} />
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                          <div style={{ background: "rgba(129,199,132,0.05)", border: "1px solid rgba(129,199,132,0.2)", borderRadius: 3, padding: "12px 14px" }}>
                            <span style={{ fontSize: 9, color: "#81C784", letterSpacing: "0.15em", fontFamily: "monospace", fontWeight: 700 }}>DO INCLUDE</span>
                            <div style={{ marginTop: 8 }}>
                              {cvs.do.map((item, j) => (
                                <div key={j} style={{ display: "flex", gap: 8, marginBottom: 5 }}>
                                  <span style={{ color: "#81C784", flexShrink: 0 }}>✓</span>
                                  <span style={{ fontSize: 12, color: "#888" }}>{item}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div style={{ background: "rgba(255,100,100,0.05)", border: "1px solid rgba(255,100,100,0.2)", borderRadius: 3, padding: "12px 14px" }}>
                            <span style={{ fontSize: 9, color: "#FF6464", letterSpacing: "0.15em", fontFamily: "monospace", fontWeight: 700 }}>DO NOT INCLUDE</span>
                            <div style={{ marginTop: 8 }}>
                              {cvs.dont.map((item, j) => (
                                <div key={j} style={{ display: "flex", gap: 8, marginBottom: 5 }}>
                                  <span style={{ color: "#FF6464", flexShrink: 0 }}>✗</span>
                                  <span style={{ fontSize: 12, color: "#888" }}>{item}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div style={{ background: "rgba(255,215,0,0.05)", border: "1px solid rgba(255,215,0,0.2)", borderRadius: 3, padding: "8px 12px" }}>
                          <span style={{ fontSize: 12, color: "#FFD700" }}>💡 {cvs.tip}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <Box col="#81C784" icon="🤖" title="AI Prompt — Write Your CV Experience Bullets">
              "I am a data analyst. Help me write 4 CV bullet points for this experience: [describe your role or project, what tools you used, what problems you solved, any results you achieved]. Each bullet should: start with a strong action verb, include the specific tool or method, and end with a measurable outcome. Use STAR format."
            </Box>
            <Nav onPrev={() => setSec("portfolio")} onNext={() => setSec("linkedin")} />
          </div>
        )}

        {/* ── LINKEDIN ── */}
        {sec === "linkedin" && (
          <div>
            <SH n="03" title="LinkedIn Optimisation" col="#FFD54F" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 16px" }}>
              LinkedIn is where 87% of recruiters search for candidates. <strong style={{ color: "#DDD8F0" }}>Your profile is a live, searchable portfolio</strong> — not a copy of your CV. Recruiters type keywords into LinkedIn's search and filter by location, skills, and activity. These optimisations get you found.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, margin: "0 0 20px" }}>
              {[
                { stat: "87%", label: "of recruiters use LinkedIn to find candidates", col: "#FFD54F" },
                { stat: "14x", label: "more views with a professional profile photo",  col: "#4FC3F7" },
                { stat: "40x", label: "more opportunities for profiles with 500+ connections", col: "#81C784" },
              ].map((s, i) => (
                <div key={i} style={{ border: "1px solid " + s.col + "33", borderRadius: 4, padding: "16px", background: s.col + "06", textAlign: "center" }}>
                  <div style={{ fontSize: 26, fontWeight: 900, color: s.col, marginBottom: 4 }}>{s.stat}</div>
                  <div style={{ fontSize: 12, color: "#666" }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, margin: "0 0 24px" }}>
              {linkedinSections.map((ls, i) => (
                <div key={i} style={{ border: "1px solid #1A1A2E", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ padding: "14px 20px", background: "#0D0D18", borderBottom: "1px solid #1A1A2E" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#DDD8F0", marginBottom: 10 }}>{ls.section}</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 10 }}>
                      <div style={{ background: "rgba(255,100,100,0.05)", border: "1px solid rgba(255,100,100,0.2)", borderRadius: 3, padding: "10px 12px" }}>
                        <span style={{ fontSize: 9, color: "#FF6464", letterSpacing: "0.15em", fontFamily: "monospace", fontWeight: 700 }}>WEAK VERSION</span>
                        <p style={{ fontSize: 12, color: "#888", margin: "6px 0 0", lineHeight: 1.6, fontStyle: "italic" }}>{ls.bad}</p>
                      </div>
                      <div style={{ background: "rgba(129,199,132,0.05)", border: "1px solid rgba(129,199,132,0.2)", borderRadius: 3, padding: "10px 12px" }}>
                        <span style={{ fontSize: 9, color: "#81C784", letterSpacing: "0.15em", fontFamily: "monospace", fontWeight: 700 }}>STRONG VERSION</span>
                        <p style={{ fontSize: 12, color: "#AAA", margin: "6px 0 0", lineHeight: 1.6 }}>{ls.good}</p>
                      </div>
                    </div>
                    <div style={{ background: "rgba(255,215,0,0.05)", border: "1px solid rgba(255,215,0,0.2)", borderRadius: 3, padding: "8px 12px" }}>
                      <span style={{ fontSize: 12, color: "#FFD700" }}>💡 {ls.tip}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Box col="#FFD54F" icon="📣" title="LinkedIn Content Strategy — Post 2x Per Week">
              Content that performs well for data analysts: (1) Dashboard screenshot + 3 bullet insights — "Here is what I found in RetailCo's data". (2) Tool comparison — "I tried both Tableau and Power BI. Here is when to use each". (3) Lesson learned — "The most common SQL mistake I see". (4) Project showcase — "I built a RAG chatbot over customer data. Here is how." Consistency beats virality. Post for 12 weeks and watch your inbound grow.
            </Box>
            <Nav onPrev={() => setSec("cv")} onNext={() => setSec("interview")} />
          </div>
        )}

        {/* ── INTERVIEW ── */}
        {sec === "interview" && (
          <div>
            <SH n="04" title="Interview Preparation — 40 Questions and Answers" col="#FF8A65" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 16px" }}>
              Data analyst interviews test four things: <strong style={{ color: "#DDD8F0" }}>SQL skills, Python/analytics knowledge, BI tool experience, and how you think about business problems.</strong> Every question below was pulled from real data analyst interviews at mid-to-large companies in 2024-2025.
            </p>

            <Box col="#FF8A65" icon="🎯" title="How to Prepare">
              1. Answer every question out loud — not just in your head. 2. Practice SQL on a whiteboard or paper, not just in a SQL editor. 3. For behavioural questions, prepare 4-5 specific stories from your projects that can be adapted to multiple questions. 4. Run a mock interview with ChatGPT: "You are a data analyst interviewer. Ask me [question] and give me feedback on my answer."
            </Box>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, margin: "20px 0 28px" }}>
              {interviewQuestions.map((block, i) => {
                const open = openInterview === i;
                return (
                  <div key={i} style={{ border: "1px solid " + (open ? block.col + "55" : "#1A1A2E"), borderRadius: 4, overflow: "hidden" }}>
                    <button onClick={() => setOpenInterview(open ? null : i)} style={{
                      width: "100%", background: open ? block.col + "0A" : "#0D0D18",
                      border: "none", cursor: "pointer", padding: "14px 20px",
                      display: "flex", alignItems: "center", gap: 14, fontFamily: "inherit", textAlign: "left",
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: block.col }}>{block.type}</div>
                        {!open && <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>{block.questions.length} questions with model answers</div>}
                      </div>
                      <span style={{ color: block.col, fontSize: 18, transform: open ? "rotate(45deg)" : "none", transition: "transform 0.2s" }}>+</span>
                    </button>
                    {open && (
                      <div style={{ padding: "0 20px 20px 20px", background: block.col + "06" }}>
                        <div style={{ height: 1, background: block.col + "22", margin: "0 0 14px" }} />
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          {block.questions.map((q, j) => {
                            const ansKey = i + "-" + j;
                            const showAns = openAnswer[ansKey];
                            return (
                              <div key={j} style={{ background: "#0D0D18", border: "1px solid #1A1A2E", borderRadius: 3, overflow: "hidden" }}>
                                <div style={{ padding: "12px 14px" }}>
                                  <div style={{ fontSize: 13, color: "#DDD8F0", lineHeight: 1.6, marginBottom: 8 }}>
                                    <span style={{ color: block.col, fontFamily: "monospace", marginRight: 8, fontSize: 11 }}>Q{j + 1}.</span>
                                    {q}
                                  </div>
                                  <button onClick={() => toggleAnswer(i, j)} style={{
                                    background: showAns ? block.col + "18" : "none",
                                    border: "1px solid " + block.col + "44",
                                    borderRadius: 2, padding: "4px 12px", cursor: "pointer",
                                    fontFamily: "monospace", fontSize: 10, color: block.col,
                                  }}>
                                    {showAns ? "HIDE ANSWER" : "SHOW MODEL ANSWER"}
                                  </button>
                                </div>
                                {showAns && (
                                  <div style={{ padding: "10px 14px", borderTop: "1px solid " + block.col + "22", background: block.col + "06" }}>
                                    <p style={{ fontSize: 13, color: "#AAA", margin: 0, lineHeight: 1.7 }}>{block.answers[j]}</p>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <Box col="#CE93D8" icon="🤖" title="AI Mock Interviewer Prompt">
              "Act as a senior data analyst at a FAANG company interviewing me for a data analyst role. Ask me technical and behavioural interview questions one at a time. After each of my answers, give me: (1) a score out of 10, (2) what I did well, (3) what I should improve, (4) a stronger version of my answer. Start with a SQL question about window functions."
            </Box>
            <Nav onPrev={() => setSec("linkedin")} onNext={() => setSec("strategy")} />
          </div>
        )}

        {/* ── STRATEGY ── */}
        {sec === "strategy" && (
          <div>
            <SH n="05" title="Job Search Strategy" col="#CE93D8" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 16px" }}>
              Most candidates apply to 100+ jobs and get 2 interviews. <strong style={{ color: "#DDD8F0" }}>The top candidates apply to 20 targeted roles and get 8 interviews.</strong> The difference is strategy, not effort. Here is the 6-step system.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 8, margin: "0 0 24px" }}>
              {jobSearchStrategy.map((step, i) => {
                const open = openStrategy === i;
                return (
                  <div key={i} style={{ border: "1px solid " + (open ? step.col + "55" : "#1A1A2E"), borderRadius: 4, overflow: "hidden" }}>
                    <button onClick={() => setOpenStrategy(open ? null : i)} style={{
                      width: "100%", background: open ? step.col + "0A" : "#0D0D18",
                      border: "none", cursor: "pointer", padding: "14px 20px",
                      display: "flex", alignItems: "flex-start", gap: 14, fontFamily: "inherit", textAlign: "left",
                    }}>
                      <span style={{ fontSize: 10, color: step.col, fontFamily: "monospace", fontWeight: 700, minWidth: 24 }}>{step.step}</span>
                      <div style={{ flex: 1, fontSize: 14, fontWeight: 700, color: "#DDD8F0" }}>{step.title}</div>
                      <span style={{ color: step.col, fontSize: 18, transform: open ? "rotate(45deg)" : "none", transition: "transform 0.2s" }}>+</span>
                    </button>
                    {open && (
                      <div style={{ padding: "0 20px 14px 58px", background: step.col + "06" }}>
                        <div style={{ height: 1, background: step.col + "22", margin: "0 0 12px" }} />
                        <p style={{ fontSize: 13, color: "#AAA", margin: 0, lineHeight: 1.7 }}>{step.desc}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <Box col="#CE93D8" icon="📊" title="Your Weekly Job Search KPIs">
              Track these every week: Applications sent (target: 5-10 quality applications). LinkedIn connections added (target: 10-15, in data/analytics). LinkedIn posts published (target: 2). Informational calls booked (target: 1-2). Interviews scheduled (target: 1+ after week 4). If any metric is 0 for 2 weeks — investigate why.
            </Box>

            <Box col="#FFD54F" icon="🤖" title="AI Prompt — Tailor Your CV to a Job Description">
              "Here is a job description for a Data Analyst role: [paste JD]. Here is my current CV professional summary: [paste your summary]. Rewrite my professional summary to match this specific role — mirror their language, emphasise the skills they prioritised, and add one specific project that demonstrates what they are looking for."
            </Box>
            <Nav onPrev={() => setSec("interview")} onNext={() => setSec("salary")} />
          </div>
        )}

        {/* ── SALARY ── */}
        {sec === "salary" && (
          <div>
            <SH n="06" title="Salary Research and Negotiation" col="#F48FB1" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 16px" }}>
              Salary negotiation is the highest-ROI 30 minutes of your career. <strong style={{ color: "#DDD8F0" }}>The first person to name a number loses leverage.</strong> Knowing your market value and negotiating effectively can be worth £5,000-£15,000 in year-one salary alone.
            </p>

            <SH n="06a" title="Market Rates — Data Analyst (UK/US/Global 2025)" col="#F48FB1" />
            <div style={{ border: "1px solid #1A1A2E", borderRadius: 4, overflow: "hidden", margin: "0 0 20px" }}>
              {[
                { level: "Junior (0-2 yrs)",   uk: "£28-40K",  us: "$60-85K",   aus: "A$65-90K",  remote: "$50-70K", col: "#81C784" },
                { level: "Mid (2-5 yrs)",       uk: "£40-60K",  us: "$85-120K",  aus: "A$90-125K", remote: "$70-100K", col: "#FFD54F" },
                { level: "Senior (5+ yrs)",     uk: "£60-90K",  us: "$120-180K", aus: "A$125-175K", remote: "$100-150K", col: "#FF8A65" },
                { level: "Analytics Engineer",  uk: "£55-85K",  us: "$130-190K", aus: "A$120-165K", remote: "$110-160K", col: "#CE93D8" },
                { level: "Data Scientist",      uk: "£65-100K", us: "$140-200K", aus: "A$135-185K", remote: "$120-170K", col: "#4FC3F7" },
              ].map((r, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "160px 1fr 1fr 1fr 1fr", gap: 12, padding: "10px 16px", borderBottom: i < 4 ? "1px solid #0F0F18" : "none", background: i % 2 === 0 ? "#0A0A14" : "#07070E", alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: r.col, fontWeight: 700 }}>{r.level}</span>
                  <span style={{ fontSize: 12, color: "#888", fontFamily: "monospace" }}>{r.uk}</span>
                  <span style={{ fontSize: 12, color: "#888", fontFamily: "monospace" }}>{r.us}</span>
                  <span style={{ fontSize: 12, color: "#888", fontFamily: "monospace" }}>{r.aus}</span>
                  <span style={{ fontSize: 12, color: "#888", fontFamily: "monospace" }}>{r.remote}</span>
                </div>
              ))}
              <div style={{ display: "grid", gridTemplateColumns: "160px 1fr 1fr 1fr 1fr", gap: 12, padding: "8px 16px", background: "#0D0D18", borderTop: "1px solid #1A1A2E" }}>
                <span style={{ fontSize: 9, color: "#555", fontFamily: "monospace" }}> </span>
                {["UK", "US", "Australia", "Remote (global)"].map(h => (
                  <span key={h} style={{ fontSize: 9, color: "#555", fontFamily: "monospace", letterSpacing: "0.1em" }}>{h}</span>
                ))}
              </div>
            </div>

            <SH n="06b" title="The Negotiation Playbook" col="#F48FB1" />
            <div style={{ display: "flex", flexDirection: "column", gap: 8, margin: "0 0 24px" }}>
              {[
                { step: "1. Research first", desc: "Before any salary conversation: check Glassdoor, Levels.fyi, LinkedIn Salary, and job postings for the role. Know the range for your experience level in your city. Never go in blind.", col: "#4FC3F7" },
                { step: "2. Delay the number", desc: "If asked 'What is your expected salary?' in an early screening: 'I am more focused on finding the right role and learning more about the total compensation. What is the budgeted range for this position?' Make them go first.", col: "#81C784" },
                { step: "3. Anchor high — within reason", desc: "When you must give a number: name the top of the market range for your experience level, not the bottom. You can always come down. You cannot go up. 'Based on my research, I am targeting £50-58K for this level of role.'", col: "#FFD54F" },
                { step: "4. Never accept on the spot", desc: "When you receive an offer: 'Thank you so much — I am genuinely excited about this opportunity. Can I have until [specific date 3-5 days away] to review the full compensation package?' This is standard and expected.", col: "#FF8A65" },
                { step: "5. Negotiate the full package", desc: "Salary is one number. Total comp includes: bonus, equity/options, pension contributions, remote work flexibility, learning budget, holiday allowance, health insurance. A 10% lower salary with 5 days extra leave and a £2K learning budget may be a better deal.", col: "#CE93D8" },
                { step: "6. The counter-offer script", desc: "'Thank you for the offer. Based on my research and the skills I bring — particularly [2-3 specific skills relevant to their needs], I was hoping we could reach £X. Is there flexibility there?' Silence is your friend after this sentence.", col: "#F48FB1" },
              ].map((item, i) => (
                <div key={i} style={{ border: "1px solid " + item.col + "33", borderLeft: "3px solid " + item.col, borderRadius: 4, padding: "14px 16px", background: "#0D0D18" }}>
                  <div style={{ fontSize: 12, color: item.col, fontWeight: 700, marginBottom: 6 }}>{item.step}</div>
                  <div style={{ fontSize: 13, color: "#888", lineHeight: 1.7 }}>{item.desc}</div>
                </div>
              ))}
            </div>

            {/* Final section — course complete */}
            <div style={{ padding: "28px 30px", background: "linear-gradient(135deg, rgba(255,215,0,0.08) 0%, transparent 100%)", border: "1px solid " + ACC + "33", borderRadius: 4, marginTop: 40, textAlign: "center" }}>
              <div style={{ fontSize: 64, marginBottom: 14 }}>🎓</div>
              <h2 style={{ margin: "0 0 10px", fontSize: 28, fontWeight: 900, color: "#DDD8F0" }}>Course Complete.</h2>
              <p style={{ fontSize: 15, color: "#777", lineHeight: 1.8, maxWidth: 560, margin: "0 auto 24px" }}>
                16 weeks. 6 phases. SQL, Python, BI tools, cloud infrastructure, AI ops, and a complete career launch toolkit. You are not just job-ready — you are in the top 5% of applicants in every interview you walk into.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 24 }}>
                {[
                  "Excel + AI ✓", "SQL + BigQuery ✓", "Python + ML ✓",
                  "Tableau + Power BI ✓", "dbt + Airflow ✓", "LLMs + RAG ✓",
                  "5 Portfolio Projects ✓", "CV + LinkedIn ✓", "Interview Ready ✓",
                ].map(tag => (
                  <span key={tag} style={{ padding: "5px 14px", background: "rgba(255,215,0,0.08)", border: "1px solid rgba(255,215,0,0.25)", borderRadius: 2, fontSize: 12, color: ACC }}>{tag}</span>
                ))}
              </div>
              <div style={{ fontSize: 14, color: "#555", fontStyle: "italic" }}>
                Now go get the job. You earned it.
              </div>
            </div>
            <Nav onPrev={() => setSec("strategy")} />
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
      {onNext && <button onClick={onNext} style={{ background: "#FFD700", border: "none", borderRadius: 3, padding: "8px 24px", cursor: "pointer", fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: "#07070E" }}>{nxt}</button>}
    </div>
  );
}
