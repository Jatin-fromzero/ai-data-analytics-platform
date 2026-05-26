"use client";
// @ts-nocheck
import { useState } from "react";

// ─── QUIZ ────────────────────────────────────────────────────
const quizQuestions = [
  {
    q: "A dataset has values: 2, 4, 4, 4, 5, 5, 7, 9. What is the MODE?",
    options: ["4", "5", "4.5", "9"],
    answer: 0,
    explanation: "Mode is the most frequently occurring value. '4' appears 3 times — more than any other value. Always check mode first in skewed datasets."
  },
  {
    q: "Sales data has a mean of $5,000 but a median of $1,200. What does this tell you?",
    options: [
      "The data is normally distributed",
      "A few extremely high sales are pulling the mean up — use median to represent 'typical' sales",
      "The median is wrong",
      "Standard deviation is low"
    ],
    answer: 1,
    explanation: "When mean >> median, the data is right-skewed — a few large outliers inflate the mean. Median is more representative of the 'typical' value in skewed distributions."
  },
  {
    q: "Your A/B test returns p-value = 0.03. Your significance threshold is α = 0.05. What do you conclude?",
    options: [
      "Fail to reject H₀ — no significant difference",
      "Reject H₀ — the difference is statistically significant",
      "The test is inconclusive",
      "You need more data"
    ],
    answer: 1,
    explanation: "p-value (0.03) < α (0.05) → reject the null hypothesis. The result is statistically significant — the observed difference is unlikely to be due to chance."
  },
  {
    q: "Correlation coefficient r = -0.87 between ad spend and product returns. What does this mean?",
    options: [
      "Higher ad spend causes more returns",
      "There is no relationship",
      "As ad spend increases, returns tend to decrease — strong negative correlation",
      "As ad spend increases, returns increase"
    ],
    answer: 2,
    explanation: "r = -0.87 is a strong negative correlation. As one variable increases, the other tends to decrease. IMPORTANT: correlation ≠ causation — there may be a confounding variable."
  },
  {
    q: "You are comparing average revenue across 4 different product categories to see if at least one is different. Which test is appropriate?",
    options: ["t-test", "Chi-square test", "ANOVA", "Pearson correlation"],
    answer: 2,
    explanation: "ANOVA (Analysis of Variance) is used to compare means across 3+ groups simultaneously. A t-test only compares 2 groups. Chi-square is for categorical data."
  },
  {
    q: "A normal distribution has mean = 100 and std dev = 15. Approximately what % of data falls between 70 and 130?",
    options: ["50%", "68%", "95%", "99.7%"],
    answer: 2,
    explanation: "The 68-95-99.7 rule: 68% within 1σ, 95% within 2σ, 99.7% within 3σ. 70–130 is mean ± 2σ (100 ± 30) → approximately 95% of data falls here."
  },
];

// ─── SECTION DATA ─────────────────────────────────────────────

const centralTendency = [
  {
    name: "Mean", symbol: "x̄", color: "#4FC3F7",
    formula: "Sum of all values ÷ Number of values",
    when: "Normally distributed data with no extreme outliers",
    weakness: "Heavily affected by outliers. One $1M sale inflates average revenue.",
    example: { values: [10, 12, 11, 13, 9, 1000], result: "Mean = 175.8 — misleading!" },
    aiPrompt: '"My sales data is: [10, 12, 11, 13, 9, 1000]. Is the mean a good measure of central tendency here? Why?"',
    icon: "∑"
  },
  {
    name: "Median", symbol: "M", color: "#81C784",
    formula: "Middle value when data is sorted (or average of two middle values)",
    when: "Skewed distributions, income data, housing prices — anywhere outliers exist",
    weakness: "Ignores the magnitude of values — doesn't reflect extreme highs/lows.",
    example: { values: [10, 12, 11, 13, 9, 1000], result: "Median = 11.5 — much more representative!" },
    aiPrompt: '"When should I use median instead of mean? Give me 3 real business examples."',
    icon: "↕"
  },
  {
    name: "Mode", symbol: "Mo", color: "#FFD54F",
    formula: "Most frequently occurring value(s) in the dataset",
    when: "Categorical data, customer preferences, most-purchased products",
    weakness: "Can be multiple modes (bimodal), or meaningless for continuous data.",
    example: { values: ["Red", "Blue", "Red", "Green", "Red", "Blue"], result: 'Mode = "Red" — most common color choice' },
    aiPrompt: '"What type of data analysis uses mode most often? Give retail business examples."',
    icon: "#"
  },
];

const dispersionMetrics = [
  {
    name: "Range", formula: "Max − Min", color: "#4FC3F7",
    desc: "Simplest spread measure. Tells you the total span of data.",
    weakness: "Extremely sensitive to a single outlier.",
    example: "Salaries: $30K to $200K → Range = $170K. But most earn $30K–$60K.",
  },
  {
    name: "Variance (σ²)", formula: "Average of squared deviations from mean", color: "#81C784",
    desc: "Measures how spread out data is from the mean. Hard to interpret directly (squared units).",
    weakness: "Units are squared — $² doesn't make sense. Use std dev instead.",
    example: "Useful internally for calculations, not for communicating to stakeholders.",
  },
  {
    name: "Standard Deviation (σ)", formula: "√Variance", color: "#FFD54F",
    desc: "The most used spread metric. Same units as the data. 'On average, values are σ away from the mean.'",
    weakness: "Assumes roughly normal distribution for easy interpretation.",
    example: "Avg customer spend = $150, σ = $20 → most customers spend between $130–$170.",
  },
  {
    name: "IQR (Interquartile Range)", formula: "Q3 − Q1 (middle 50% spread)", color: "#FF8A65",
    desc: "Measures spread of the middle 50% of data. Outlier-resistant.",
    weakness: "Ignores extreme values — misses tail behavior.",
    example: "Used in box plots. Great for outlier detection: outlier if value < Q1−1.5×IQR or > Q3+1.5×IQR",
  },
];

const distributions = [
  {
    name: "Normal Distribution", emoji: "🔔",
    color: "#4FC3F7",
    aka: "Bell Curve / Gaussian",
    shape: "Symmetric bell — mean = median = mode",
    rule: "68-95-99.7 Rule: 68% within 1σ, 95% within 2σ, 99.7% within 3σ",
    examples: ["Heights of people", "IQ scores", "Measurement errors", "Daily stock returns (roughly)"],
    whyItMatters: "Many statistical tests assume normality. Always check before applying t-tests, ANOVA.",
    bars: [2, 7, 18, 30, 22, 13, 6, 2],
  },
  {
    name: "Right-Skewed (Positive Skew)", emoji: "📈",
    color: "#FFD54F",
    aka: "Long right tail",
    shape: "Most values cluster low, few extreme high values pull mean right (Mean > Median)",
    rule: "Use median, not mean. Log-transform often helps normalize.",
    examples: ["Income distribution", "Website traffic", "Sales revenue", "House prices"],
    whyItMatters: "Very common in business data. If you use mean, you overstate typical performance.",
    bars: [28, 22, 18, 13, 8, 5, 4, 2],
  },
  {
    name: "Left-Skewed (Negative Skew)", emoji: "📉",
    color: "#FF8A65",
    aka: "Long left tail",
    shape: "Most values cluster high, few extreme low values pull mean left (Mean < Median)",
    rule: "Less common. Check for floor effects (min possible value).",
    examples: ["Exam scores (when exam is easy)", "Age at retirement", "Product ratings (often skew high)"],
    whyItMatters: "Signals a natural ceiling in your data — most things hit the top, few are very bad.",
    bars: [2, 4, 5, 8, 13, 18, 22, 28],
  },
  {
    name: "Uniform Distribution", emoji: "⬜",
    color: "#CE93D8",
    aka: "Flat distribution",
    shape: "Every value equally likely — completely flat",
    rule: "Rare in nature. Often signals something artificial or a sampling issue.",
    examples: ["Rolling a fair die", "Random number generators", "Assigned shifts (if truly random)"],
    whyItMatters: "If your data looks uniform unexpectedly — investigate. Something may be wrong with collection.",
    bars: [15, 15, 14, 15, 15, 14, 16, 15],
  },
];

const hypothesisSteps = [
  { step: "01", title: "State H₀ and H₁", color: "#4FC3F7", desc: "H₀ (Null Hypothesis): No effect, no difference — the 'boring' default. H₁ (Alternative): The thing you're trying to prove.", example: 'H₀: "New button color has no effect on click rate"\nH₁: "New button color increases click rate"' },
  { step: "02", title: "Choose significance level α", color: "#81C784", desc: "α is your tolerance for false positives. Standard choices: α = 0.05 (5%) for most business tests, α = 0.01 (1%) for medical/high-stakes decisions.", example: "If α = 0.05: you accept a 5% chance of wrongly rejecting H₀" },
  { step: "03", title: "Choose the right test", color: "#FFD54F", desc: "Match the test to your data type and question. The wrong test gives meaningless results.", example: "2 groups, continuous: t-test\n3+ groups, continuous: ANOVA\nCategorical: chi-square\nRelationship: Pearson/Spearman" },
  { step: "04", title: "Calculate p-value", color: "#FF8A65", desc: "p-value = probability of seeing your result (or more extreme) if H₀ were true. It does NOT measure effect size or importance.", example: "p = 0.03 means: 'If there were truly no difference, there's only a 3% chance we'd see this result by chance.'" },
  { step: "05", title: "Decision: Reject or Fail to Reject H₀", color: "#CE93D8", desc: "p < α → reject H₀ (statistically significant result)\np ≥ α → fail to reject H₀ (insufficient evidence)", example: "p = 0.03, α = 0.05 → 0.03 < 0.05 → REJECT H₀\n\"The new button significantly increases clicks\"" },
  { step: "06", title: "Report effect size, not just p-value", color: "#F48FB1", desc: "p-value tells you IF there's an effect. Effect size tells you HOW BIG it is. A 0.1% increase can be 'significant' with a huge sample but meaningless in practice.", example: "Cohen's d (means), r (correlation), odds ratio (categorical)\nAlways report both: 'significant (p=0.03, d=0.8)'" },
];

const testChooser = [
  { q: "Comparing means of 2 groups", test: "Independent t-test", example: "Do male/female customers spend differently?", color: "#4FC3F7" },
  { q: "Comparing means before/after on SAME group", test: "Paired t-test", example: "Did training improve employee scores?", color: "#81C784" },
  { q: "Comparing means of 3+ groups", test: "ANOVA", example: "Do 4 product categories have different avg. revenue?", color: "#FFD54F" },
  { q: "Relationship between 2 categorical variables", test: "Chi-square test", example: "Is region related to product preference?", color: "#FF8A65" },
  { q: "Relationship between 2 continuous variables", test: "Pearson Correlation", example: "Does ad spend relate to sales revenue?", color: "#CE93D8" },
  { q: "Relationship (non-normal or ranked data)", test: "Spearman Correlation", example: "Does customer satisfaction rank predict retention?", color: "#F48FB1" },
];

const correlationScale = [
  { range: "0.9 to 1.0", label: "Very Strong Positive", color: "#00C853", desc: "Almost perfectly move together" },
  { range: "0.7 to 0.9", label: "Strong Positive", color: "#69F0AE" },
  { range: "0.5 to 0.7", label: "Moderate Positive", color: "#B9F6CA" },
  { range: "0.3 to 0.5", label: "Weak Positive", color: "#E8F5E9" },
  { range: "-0.3 to 0.3", label: "No/Negligible", color: "#555", desc: "No meaningful relationship" },
  { range: "-0.5 to -0.3", label: "Weak Negative", color: "#FFCCBC" },
  { range: "-0.7 to -0.5", label: "Moderate Negative", color: "#FF8A65" },
  { range: "-0.9 to -0.7", label: "Strong Negative", color: "#FF5722" },
  { range: "-1.0 to -0.9", label: "Very Strong Negative", color: "#BF360C", desc: "Almost perfectly move opposite" },
];

const aiStatsTools = [
  {
    name: "ChatGPT / Claude", icon: "💬", color: "#10A37F",
    uses: [
      "Explain what a p-value means in plain English for your specific results",
      "Describe your data → get recommended statistical test",
      "Paste Python/Excel output → get interpretation",
      "Generate synthetic datasets for practice",
    ],
    prompts: [
      '"My t-test returned t=2.34, p=0.021, df=48. Interpret this for a non-technical stakeholder."',
      '"I have two groups of customer spending data. What statistical test should I use and why?"',
      '"Generate a realistic dataset of 100 rows: customer_id, age, spend, region, churned (0/1)"',
    ]
  },
  {
    name: "Julius AI", icon: "📊", color: "#FF6D9D",
    uses: [
      "Upload CSV → automatically runs descriptive statistics",
      "Creates histograms and box plots from natural language",
      "Detects outliers and explains them",
      "No code required — pure drag-and-drop stats",
    ],
    prompts: [
      '"Show me the distribution of the revenue column"',
      '"Are there any outliers in this dataset? Show me a box plot."',
      '"What is the correlation between customer_age and purchase_value?"',
    ]
  },
  {
    name: "Python: ydata-profiling", icon: "🐍", color: "#B2FF59",
    uses: [
      "One line of code generates a complete statistical report",
      "Distributions, correlations, missing values, duplicates — all automatic",
      "Export to HTML for sharing with stakeholders",
      "Detects high correlations and warns about them",
    ],
    prompts: [
      "from ydata_profiling import ProfileReport",
      "profile = ProfileReport(df, title='Sales Data Report')",
      "profile.to_file('report.html')",
    ]
  },
];

const sections = [
  { id: "intro", label: "Overview" },
  { id: "central", label: "Central Tendency" },
  { id: "dispersion", label: "Dispersion" },
  { id: "distributions", label: "Distributions" },
  { id: "hypothesis", label: "Hypothesis Testing" },
  { id: "correlation", label: "Correlation" },
  { id: "aitools", label: "🤖 AI for Stats" },
  { id: "quiz", label: "🧠 Quiz" },
];

// ─── MAIN COMPONENT ───────────────────────────────────────────
export default function Phase1Part2() {
  const [activeSection, setActiveSection] = useState("intro");
  const [expandedCard, setExpandedCard] = useState(null);
  const [expandedStep, setExpandedStep] = useState(null);
  const [expandedDist, setExpandedDist] = useState(null);
  const [expandedAI, setExpandedAI] = useState(null);
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

  return (
    <div style={{ minHeight: "100vh", background: "#07070E", color: "#DDD8F0", fontFamily: "Georgia, 'Times New Roman', serif" }}>

      {/* TOP NAV */}
      <div style={{ background: "#0A0A14", borderBottom: "1px solid #16162A", padding: "0 24px", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 880, margin: "0 auto", display: "flex", alignItems: "center", gap: 0, overflowX: "auto" }}>
          <div style={{ fontSize: 10, color: "#4FC3F7", letterSpacing: "0.2em", textTransform: "uppercase", padding: "14px 20px 14px 0", borderRight: "1px solid #1A1A2E", marginRight: 12, whiteSpace: "nowrap" }}>
            P1 · PART 2
          </div>
          {sections.map(s => (
            <button key={s.id} onClick={() => setActiveSection(s.id)} style={{
              background: "none", border: "none", cursor: "pointer",
              padding: "14px 12px", fontFamily: "inherit",
              fontSize: 11, letterSpacing: "0.07em",
              color: activeSection === s.id ? "#4FC3F7" : "#444",
              borderBottom: activeSection === s.id ? "2px solid #4FC3F7" : "2px solid transparent",
              transition: "all 0.2s", whiteSpace: "nowrap",
            }}>{s.label}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 880, margin: "0 auto", padding: "48px 24px 100px" }}>

        {/* ── INTRO ── */}
        {activeSection === "intro" && (
          <div>
            <div style={{ marginBottom: 56, borderLeft: "3px solid #4FC3F7", paddingLeft: 24 }}>
              <div style={{ fontSize: 10, color: "#4FC3F7", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 12 }}>
                PHASE 1 · PART 2 OF 4 · WEEK 2
              </div>
              <h1 style={{ fontSize: "clamp(26px,5vw,44px)", fontWeight: 900, margin: "0 0 16px", lineHeight: 1.15, letterSpacing: "-0.02em" }}>
                Statistics for<br />
                <span style={{ color: "#4FC3F7" }}>Data Analytics</span><br />
                <span style={{ fontStyle: "italic", fontWeight: 400, fontSize: "0.68em", color: "#666" }}>Supercharged with AI</span>
              </h1>
              <p style={{ fontSize: 14, color: "#777", lineHeight: 1.85, maxWidth: 560, margin: "0 0 24px" }}>
                Statistics is the backbone of all data analytics. You don't need to be a mathematician — but you do need to understand the core concepts well enough to choose the right method, interpret output correctly, and communicate results with confidence. AI tools now make this faster than ever.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {["~4 hours", "6 core concepts", "6-question quiz", "3 AI tools", "Real business examples"].map(tag => (
                  <span key={tag} style={{ padding: "4px 12px", background: "rgba(79,195,247,0.08)", border: "1px solid rgba(79,195,247,0.2)", borderRadius: 2, fontSize: 11, color: "#4FC3F7" }}>{tag}</span>
                ))}
              </div>
            </div>

            {/* What you'll learn map */}
            <SectionHeader num="00" title="What You'll Learn in Part 2" color="#4FC3F7" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 10, margin: "24px 0 36px" }}>
              {[
                { icon: "∑", title: "Central Tendency", desc: "Mean, Median, Mode — when to use each and how AI explains the difference", color: "#4FC3F7", section: "central" },
                { icon: "σ", title: "Dispersion", desc: "Standard deviation, variance, IQR — measuring how spread out your data is", color: "#81C784", section: "dispersion" },
                { icon: "🔔", title: "Distributions", desc: "Normal, skewed, uniform — recognizing shape to pick the right analysis", color: "#FFD54F", section: "distributions" },
                { icon: "H₀", title: "Hypothesis Testing", desc: "p-values, significance, t-test, ANOVA — the framework every A/B test uses", color: "#FF8A65", section: "hypothesis" },
                { icon: "r", title: "Correlation", desc: "Pearson, Spearman, r values — and why correlation ≠ causation", color: "#CE93D8", section: "correlation" },
                { icon: "🤖", title: "AI for Statistics", desc: "ChatGPT, Julius AI, ydata-profiling — let AI run stats and explain results", color: "#F48FB1", section: "aitools" },
              ].map((item, i) => (
                <div key={i} onClick={() => setActiveSection(item.section)} style={{
                  border: `1px solid ${item.color}33`, borderTop: `3px solid ${item.color}`,
                  borderRadius: 4, padding: "16px", background: "#0D0D18",
                  cursor: "pointer", transition: "background 0.2s",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = `${item.color}08`}
                  onMouseLeave={e => e.currentTarget.style.background = "#0D0D18"}
                >
                  <div style={{ fontSize: 22, color: item.color, fontFamily: "monospace", marginBottom: 10, fontWeight: 700 }}>{item.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#DDD8F0", marginBottom: 6 }}>{item.title}</div>
                  <div style={{ fontSize: 12, color: "#555", lineHeight: 1.6 }}>{item.desc}</div>
                </div>
              ))}
            </div>

            <Callout icon="🎯" color="#4FC3F7" title="The Analyst's Mindset for Statistics">
              You are not here to prove statistical theory. You are here to answer business questions. Every formula and concept in this part maps directly to something a real data analyst does in their job — from A/B testing a landing page to presenting revenue trends to a CEO.
            </Callout>
            <NavButtons onNext={() => setActiveSection("central")} />
          </div>
        )}

        {/* ── CENTRAL TENDENCY ── */}
        {activeSection === "central" && (
          <div>
            <SectionHeader num="01" title="Measures of Central Tendency" color="#4FC3F7" />
            <Prose>
              Central tendency answers: <Highlight>"What is the typical value in my dataset?"</Highlight> There are three measures — and choosing the wrong one is one of the most common mistakes junior analysts make, especially when outliers are present.
            </Prose>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, margin: "28px 0" }}>
              {centralTendency.map((m, i) => {
                const open = expandedCard === `ct-${i}`;
                return (
                  <div key={i} style={{ border: `1px solid ${open ? m.color + "55" : "#1A1A2E"}`, borderRadius: 4, overflow: "hidden" }}>
                    <button onClick={() => setExpandedCard(open ? null : `ct-${i}`)} style={{
                      width: "100%", background: open ? `${m.color}0A` : "#0D0D18",
                      border: "none", cursor: "pointer", padding: "16px 20px",
                      display: "flex", alignItems: "center", gap: 18,
                      fontFamily: "inherit", textAlign: "left", transition: "background 0.2s",
                    }}>
                      <div style={{ width: 44, height: 44, borderRadius: 4, background: `${m.color}18`, border: `1px solid ${m.color}33`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ fontSize: 18, color: m.color, fontFamily: "monospace", fontWeight: 900 }}>{m.icon}</span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 11, color: m.color, letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 3 }}>{m.symbol}</div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: "#DDD8F0" }}>{m.name}</div>
                        {!open && <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>{m.formula}</div>}
                      </div>
                      <span style={{ color: m.color, fontSize: 20, fontWeight: 300, transform: open ? "rotate(45deg)" : "none", transition: "transform 0.2s" }}>+</span>
                    </button>
                    {open && (
                      <div style={{ padding: "0 20px 22px 82px", background: `${m.color}06` }}>
                        <div style={{ height: 1, background: `${m.color}22`, margin: "0 0 18px" }} />
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
                          <div>
                            <Label color={m.color}>FORMULA</Label>
                            <p style={{ fontSize: 13, color: "#AAA", margin: "6px 0 0", fontFamily: "monospace", lineHeight: 1.6 }}>{m.formula}</p>
                          </div>
                          <div>
                            <Label color={m.color}>BEST USED WHEN</Label>
                            <p style={{ fontSize: 13, color: "#AAA", margin: "6px 0 0", lineHeight: 1.6 }}>{m.when}</p>
                          </div>
                        </div>
                        <div style={{ marginBottom: 14 }}>
                          <Label color="#FF6464">WEAKNESS</Label>
                          <p style={{ fontSize: 13, color: "#888", margin: "6px 0 0", lineHeight: 1.6 }}>{m.weakness}</p>
                        </div>
                        <div style={{ background: "#07070E", border: `1px solid ${m.color}22`, borderRadius: 3, padding: "12px 14px", marginBottom: 14 }}>
                          <Label color={m.color}>EXAMPLE (same dataset: [10, 12, 11, 13, 9, 1000])</Label>
                          <p style={{ fontSize: 13, color: m.color, margin: "6px 0 0", fontFamily: "monospace" }}>{m.example.result}</p>
                        </div>
                        <div style={{ background: "rgba(207,159,255,0.05)", border: "1px solid rgba(207,159,255,0.2)", borderRadius: 3, padding: "12px 14px" }}>
                          <Label color="#CF9FFF">🤖 AI PROMPT TO TRY</Label>
                          <p style={{ fontSize: 12, color: "#CF9FFF", margin: "8px 0 0", fontFamily: "monospace", lineHeight: 1.6, fontStyle: "italic" }}>{m.aiPrompt}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <Callout icon="📌" color="#FFD54F" title="The Golden Rule — Interview Favourite">
              Always check if data is skewed before choosing mean vs. median.<br />
              <strong>Right-skewed data (income, revenue, sales)</strong> → use <em>median</em>.<br />
              <strong>Normally distributed data (heights, test scores)</strong> → use <em>mean</em>.<br />
              Interviewers ask: <em>"If a CEO asks for our 'average' customer value, what should you report?"</em> — Answer: check the distribution first.
            </Callout>

            <NavButtons onPrev={() => setActiveSection("intro")} onNext={() => setActiveSection("dispersion")} />
          </div>
        )}

        {/* ── DISPERSION ── */}
        {activeSection === "dispersion" && (
          <div>
            <SectionHeader num="02" title="Measures of Dispersion (Spread)" color="#81C784" />
            <Prose>
              Two datasets can have the <Highlight>same mean but completely different spreads</Highlight>. A call center with average handle time of 5 minutes could have agents ranging from 1–30 minutes (high variance) or 4–6 minutes (low variance). Dispersion tells you how reliable and consistent your central tendency actually is.
            </Prose>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10, margin: "28px 0 32px" }}>
              {dispersionMetrics.map((m, i) => {
                const open = expandedCard === `disp-${i}`;
                return (
                  <div key={i} onClick={() => setExpandedCard(open ? null : `disp-${i}`)} style={{
                    border: `1px solid ${open ? m.color + "55" : "#1A1A2E"}`,
                    borderTop: `3px solid ${m.color}`,
                    borderRadius: 4, padding: "16px", background: open ? `${m.color}08` : "#0D0D18",
                    cursor: "pointer", transition: "all 0.2s",
                  }}>
                    <div style={{ fontSize: 11, color: m.color, fontFamily: "monospace", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>{m.formula}</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#DDD8F0", marginBottom: open ? 12 : 0 }}>{m.name}</div>
                    {open && (
                      <>
                        <p style={{ fontSize: 13, color: "#AAA", lineHeight: 1.7, margin: "0 0 10px" }}>{m.desc}</p>
                        <p style={{ fontSize: 12, color: "#FF8A65", margin: "0 0 10px" }}>⚠️ {m.weakness}</p>
                        <p style={{ fontSize: 12, color: "#666", fontStyle: "italic", margin: 0, lineHeight: 1.6 }}>💼 {m.example}</p>
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Visual comparison */}
            <Subheading>Why Std Dev Matters More Than Mean — Visual Example</Subheading>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, margin: "16px 0 28px" }}>
              {[
                { label: "Team A", mean: 50, data: [48, 49, 50, 51, 52, 50, 50, 49, 51, 50], sd: "~1.1", color: "#81C784", verdict: "Very consistent. Predictable performance." },
                { label: "Team B", mean: 50, data: [20, 70, 35, 80, 15, 90, 40, 60, 25, 65], sd: "~25.6", color: "#FF8A65", verdict: "Same mean. Wildly inconsistent. Unreliable." },
              ].map((t, i) => (
                <div key={i} style={{ border: `1px solid ${t.color}33`, borderRadius: 4, padding: "18px 16px", background: `${t.color}06` }}>
                  <div style={{ fontSize: 12, color: t.color, fontFamily: "monospace", fontWeight: 700, marginBottom: 6 }}>{t.label} — Mean = {t.mean}, σ = {t.sd}</div>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 50, marginBottom: 10 }}>
                    {t.data.map((v, j) => (
                      <div key={j} style={{ flex: 1, height: `${(v / 100) * 100}%`, background: t.color, borderRadius: 2, opacity: 0.7 }} />
                    ))}
                  </div>
                  <div style={{ fontSize: 12, color: "#888" }}>{t.verdict}</div>
                </div>
              ))}
            </div>

            <Callout icon="🤖" color="#CF9FFF" title="AI Prompt for Dispersion Analysis">
              Paste your dataset into ChatGPT and ask:<br />
              <em style={{ color: "#CF9FFF" }}>"Calculate mean, median, standard deviation, and IQR for this data. Identify any outliers using the IQR method and explain what they mean."</em><br />
              — You get a full dispersion analysis explained in plain English in seconds.
            </Callout>

            <NavButtons onPrev={() => setActiveSection("central")} onNext={() => setActiveSection("distributions")} />
          </div>
        )}

        {/* ── DISTRIBUTIONS ── */}
        {activeSection === "distributions" && (
          <div>
            <SectionHeader num="03" title="Probability Distributions" color="#FFD54F" />
            <Prose>
              A distribution shows <Highlight>how values are spread across your dataset</Highlight>. Before doing any statistical test, you must understand your data's distribution — it determines which tests are valid and how to interpret your metrics.
            </Prose>
            <Prose>
              The shape of your distribution reveals the story of your data. A normal bell curve tells you something very different from a long right tail.
            </Prose>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, margin: "28px 0 36px" }}>
              {distributions.map((d, i) => {
                const open = expandedDist === i;
                return (
                  <div key={i} style={{ border: `1px solid ${open ? d.color + "55" : "#1A1A2E"}`, borderRadius: 4, overflow: "hidden" }}>
                    <button onClick={() => setExpandedDist(open ? null : i)} style={{
                      width: "100%", background: open ? `${d.color}08` : "#0D0D18",
                      border: "none", cursor: "pointer", padding: "14px 20px",
                      display: "flex", alignItems: "center", gap: 16,
                      fontFamily: "inherit", textAlign: "left",
                    }}>
                      <span style={{ fontSize: 24, flexShrink: 0 }}>{d.emoji}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 11, color: d.color, fontFamily: "monospace", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 2 }}>{d.aka}</div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: "#DDD8F0" }}>{d.name}</div>
                        {!open && (
                          <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 22, marginTop: 6 }}>
                            {d.bars.map((v, j) => (
                              <div key={j} style={{ flex: 1, height: `${v * 3}%`, background: d.color, borderRadius: 1, opacity: 0.5 }} />
                            ))}
                          </div>
                        )}
                      </div>
                      <span style={{ color: d.color, fontSize: 18, transform: open ? "rotate(45deg)" : "none", transition: "transform 0.2s" }}>+</span>
                    </button>
                    {open && (
                      <div style={{ padding: "0 20px 22px 20px", background: `${d.color}06` }}>
                        <div style={{ height: 1, background: `${d.color}22`, margin: "0 0 18px" }} />

                        {/* Mini bar chart */}
                        <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 70, marginBottom: 16, padding: "0 2px" }}>
                          {d.bars.map((v, j) => (
                            <div key={j} style={{ flex: 1, height: `${v * 3}%`, background: d.color, borderRadius: "2px 2px 0 0", transition: "height 0.5s" }} />
                          ))}
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
                          <div>
                            <Label color={d.color}>SHAPE</Label>
                            <p style={{ fontSize: 13, color: "#AAA", margin: "6px 0 0", lineHeight: 1.6 }}>{d.shape}</p>
                          </div>
                          <div>
                            <Label color={d.color}>KEY RULE</Label>
                            <p style={{ fontSize: 13, color: "#AAA", margin: "6px 0 0", lineHeight: 1.6 }}>{d.rule}</p>
                          </div>
                        </div>

                        <div style={{ marginBottom: 14 }}>
                          <Label color={d.color}>REAL-WORLD EXAMPLES</Label>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                            {d.examples.map(ex => (
                              <span key={ex} style={{ padding: "3px 10px", background: `${d.color}12`, border: `1px solid ${d.color}30`, borderRadius: 2, fontSize: 11, color: d.color }}>
                                {ex}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div style={{ background: "#07070E", border: `1px solid ${d.color}22`, borderRadius: 3, padding: "12px 14px" }}>
                          <Label color="#FFD54F">WHY ANALYSTS CARE</Label>
                          <p style={{ fontSize: 13, color: "#888", margin: "6px 0 0", lineHeight: 1.6 }}>{d.whyItMatters}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <Callout icon="🤖" color="#CF9FFF" title="AI Prompt — Identify Distribution">
              <em style={{ color: "#CF9FFF" }}>"Here is a histogram of my data: [describe what you see — e.g., 'most values are between 10–30, with a long tail extending to 500']. What distribution does this look like, and what does that tell me about how to analyze it?"</em>
            </Callout>

            <NavButtons onPrev={() => setActiveSection("dispersion")} onNext={() => setActiveSection("hypothesis")} />
          </div>
        )}

        {/* ── HYPOTHESIS TESTING ── */}
        {activeSection === "hypothesis" && (
          <div>
            <SectionHeader num="04" title="Hypothesis Testing" color="#FF8A65" />
            <Prose>
              Hypothesis testing is the <Highlight>statistical framework behind every A/B test, product experiment, and business decision that uses data</Highlight>. It answers: "Is this difference real, or just random noise?" Every time you ask "did our new feature actually improve conversions?" — you're doing hypothesis testing.
            </Prose>

            <Callout icon="🏭" color="#FF8A65" title="Real-World Context">
              Netflix tests thousands of thumbnail images. Amazon tests button placement. Every tech company runs A/B tests daily. Hypothesis testing is the math that tells them whether a 2% conversion uplift is a real win or just lucky randomness. This is one of the most valuable skills you can have as an analyst.
            </Callout>

            <Subheading>The 6-Step Hypothesis Testing Process</Subheading>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, margin: "20px 0 32px" }}>
              {hypothesisSteps.map((s, i) => {
                const open = expandedStep === i;
                return (
                  <div key={i} style={{ border: `1px solid ${open ? s.color + "55" : "#1A1A2E"}`, borderRadius: 4, overflow: "hidden" }}>
                    <button onClick={() => setExpandedStep(open ? null : i)} style={{
                      width: "100%", background: open ? `${s.color}08` : "#0D0D18",
                      border: "none", cursor: "pointer", padding: "14px 18px",
                      display: "flex", alignItems: "flex-start", gap: 14,
                      fontFamily: "inherit", textAlign: "left",
                    }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: `${s.color}15`, border: `1px solid ${s.color}44`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ fontSize: 10, color: s.color, fontFamily: "monospace", fontWeight: 700 }}>{s.step}</span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#DDD8F0" }}>{s.title}</div>
                        {open && (
                          <>
                            <p style={{ fontSize: 13, color: "#888", lineHeight: 1.7, margin: "10px 0 12px" }}>{s.desc}</p>
                            <div style={{ background: "#07070E", border: `1px solid ${s.color}22`, borderRadius: 3, padding: "10px 12px" }}>
                              <code style={{ fontSize: 12, color: s.color, fontFamily: "monospace", whiteSpace: "pre-wrap", lineHeight: 1.7 }}>{s.example}</code>
                            </div>
                          </>
                        )}
                      </div>
                      <span style={{ color: s.color, fontSize: 16, transform: open ? "rotate(45deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }}>+</span>
                    </button>
                  </div>
                );
              })}
            </div>

            <Subheading>Which Statistical Test to Use?</Subheading>
            <Prose>Use this quick-reference to pick the right test for any business question:</Prose>
            <div style={{ border: "1px solid #1A1A2E", borderRadius: 4, overflow: "hidden", margin: "16px 0 28px" }}>
              {testChooser.map((t, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "flex-start", gap: 14, padding: "14px 18px",
                  borderBottom: i < testChooser.length - 1 ? "1px solid #0F0F18" : "none",
                  background: "#0A0A14",
                }}>
                  <div style={{ flex: 1.2, fontSize: 13, color: "#888" }}>{t.q}</div>
                  <div style={{ width: 1, background: "#1A1A2E", alignSelf: "stretch" }} />
                  <div style={{ flex: 0.8 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: t.color, marginBottom: 3, fontFamily: "monospace" }}>{t.test}</div>
                    <div style={{ fontSize: 11, color: "#555", fontStyle: "italic" }}>{t.example}</div>
                  </div>
                </div>
              ))}
            </div>

            <Callout icon="🤖" color="#CF9FFF" title="Let AI Pick Your Test">
              <em style={{ color: "#CF9FFF" }}>"I want to know if there's a significant difference in average order value between customers who received a discount email vs. those who didn't. I have 500 customers in each group. What statistical test should I use and how do I interpret the results?"</em><br />
              — ChatGPT will pick the test, explain why, write the Python/Excel code, and interpret the output.
            </Callout>

            <NavButtons onPrev={() => setActiveSection("distributions")} onNext={() => setActiveSection("correlation")} />
          </div>
        )}

        {/* ── CORRELATION ── */}
        {activeSection === "correlation" && (
          <div>
            <SectionHeader num="05" title="Correlation & Causation" color="#CE93D8" />
            <Prose>
              Correlation measures <Highlight>how strongly two variables move together</Highlight>. It's one of the most used — and most misinterpreted — tools in analytics. The key rule every analyst must tattoo to memory:
            </Prose>

            <div style={{ margin: "24px 0", padding: "20px 24px", background: "rgba(206,147,216,0.08)", border: "2px solid rgba(206,147,216,0.4)", borderRadius: 4, textAlign: "center" }}>
              <div style={{ fontSize: "clamp(16px,3vw,24px)", fontWeight: 900, color: "#CE93D8", letterSpacing: "0.05em" }}>
                CORRELATION ≠ CAUSATION
              </div>
              <p style={{ fontSize: 13, color: "#777", margin: "10px 0 0", lineHeight: 1.7 }}>
                Ice cream sales and drowning rates are highly correlated — both rise in summer. Ice cream doesn't cause drowning. Hot weather is the hidden cause.
              </p>
            </div>

            <Subheading>Pearson Correlation Coefficient (r)</Subheading>
            <Prose>
              r ranges from <strong style={{ color: "#00C853" }}>+1.0</strong> (perfect positive) to <strong style={{ color: "#BF360C" }}>−1.0</strong> (perfect negative). <strong style={{ color: "#888" }}>0</strong> means no linear relationship.
            </Prose>

            <div style={{ margin: "20px 0 32px" }}>
              {correlationScale.map((c, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 14,
                  padding: "9px 0",
                  borderBottom: i < correlationScale.length - 1 ? "1px solid #0F0F18" : "none",
                }}>
                  <div style={{ width: 90, fontSize: 11, color: "#555", fontFamily: "monospace", flexShrink: 0 }}>{c.range}</div>
                  <div style={{ width: 14, height: 14, borderRadius: "50%", background: c.color, flexShrink: 0, border: "1px solid rgba(255,255,255,0.1)" }} />
                  <div style={{ flex: 1, fontSize: 13, color: "#AAA" }}>{c.label}</div>
                  {c.desc && <div style={{ fontSize: 11, color: "#444", fontStyle: "italic", textAlign: "right", maxWidth: 200 }}>{c.desc}</div>}
                </div>
              ))}
            </div>

            <Subheading>Pearson vs. Spearman</Subheading>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, margin: "16px 0 28px" }}>
              {[
                { name: "Pearson", color: "#CE93D8", when: "Both variables are continuous and roughly normally distributed", use: "Ad spend vs. revenue, height vs. weight", assumption: "Linear relationship, no extreme outliers" },
                { name: "Spearman", color: "#80DEEA", when: "Ordinal data, or non-normal continuous data", use: "Customer satisfaction rank vs. retention rate", assumption: "Monotonic relationship (as one goes up, other tends to go up/down)" },
              ].map(t => (
                <div key={t.name} style={{ border: `1px solid ${t.color}33`, borderRadius: 4, padding: "16px", background: `${t.color}06` }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: t.color, marginBottom: 12 }}>{t.name} Correlation</div>
                  <Label color={t.color}>USE WHEN</Label>
                  <p style={{ fontSize: 12, color: "#888", margin: "4px 0 10px", lineHeight: 1.6 }}>{t.when}</p>
                  <Label color={t.color}>BUSINESS EXAMPLE</Label>
                  <p style={{ fontSize: 12, color: "#888", margin: "4px 0 10px", fontStyle: "italic", lineHeight: 1.6 }}>{t.use}</p>
                  <Label color={t.color}>ASSUMES</Label>
                  <p style={{ fontSize: 12, color: "#888", margin: "4px 0 0", lineHeight: 1.6 }}>{t.assumption}</p>
                </div>
              ))}
            </div>

            <Subheading>Spurious Correlations — Don't Be Fooled</Subheading>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, margin: "16px 0 28px" }}>
              {[
                { a: "Nicolas Cage films per year", b: "Pool drowning deaths", r: "+0.67", lesson: "Both peaked in the 1990s. Coincidence, not causation." },
                { a: "Organic food sales", b: "Autism diagnoses", r: "+0.99", lesson: "Both increased over time due to unrelated societal trends (confounding: time)." },
                { a: "Ice cream sales", b: "Violent crime rate", r: "+0.84", lesson: "Both rise in summer. Hidden cause: hot weather increases both." },
              ].map((s, i) => (
                <div key={i} style={{ background: "#0D0D18", border: "1px solid #1A1A2E", borderRadius: 3, padding: "12px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 12, color: "#DDD8F0", fontFamily: "monospace" }}>{s.a}</span>
                    <span style={{ fontSize: 11, color: "#CE93D8" }}>↔ r={s.r}</span>
                    <span style={{ fontSize: 12, color: "#DDD8F0", fontFamily: "monospace" }}>{s.b}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "#FF8A65" }}>⚠️ {s.lesson}</div>
                </div>
              ))}
            </div>

            <Callout icon="🤖" color="#CF9FFF" title="AI for Correlation Analysis">
              <em style={{ color: "#CF9FFF" }}>"I found a correlation of r=0.74 between marketing spend and revenue. Does this mean marketing spend causes revenue growth? What other variables should I investigate to determine causation?"</em><br />
              — Claude/ChatGPT will walk you through confounders, time lags, and how to design a proper causal analysis.
            </Callout>

            <NavButtons onPrev={() => setActiveSection("hypothesis")} onNext={() => setActiveSection("aitools")} />
          </div>
        )}

        {/* ── AI TOOLS ── */}
        {activeSection === "aitools" && (
          <div>
            <SectionHeader num="06" title="AI Tools for Statistics" color="#F48FB1" />
            <Prose>
              AI has fundamentally changed how analysts work with statistics. You no longer need to memorize every formula — you need to <Highlight>understand the concepts well enough to ask the right questions, and validate the AI's output</Highlight>. Here are the three AI tools you'll use most for statistical analysis.
            </Prose>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, margin: "28px 0 36px" }}>
              {aiStatsTools.map((t, i) => {
                const open = expandedAI === i;
                return (
                  <div key={i} style={{ border: `1px solid ${open ? t.color + "44" : "#1A1A2E"}`, borderRadius: 4, overflow: "hidden" }}>
                    <button onClick={() => setExpandedAI(open ? null : i)} style={{
                      width: "100%", background: open ? `${t.color}08` : "#0D0D18",
                      border: "none", cursor: "pointer", padding: "16px 20px",
                      display: "flex", alignItems: "center", gap: 16,
                      fontFamily: "inherit", textAlign: "left",
                    }}>
                      <span style={{ fontSize: 26 }}>{t.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: "#DDD8F0" }}>{t.name}</div>
                        {!open && <div style={{ fontSize: 12, color: "#555", marginTop: 3 }}>{t.uses[0]}</div>}
                      </div>
                      <span style={{ color: t.color, fontSize: 18, transform: open ? "rotate(45deg)" : "none", transition: "transform 0.2s" }}>+</span>
                    </button>
                    {open && (
                      <div style={{ padding: "0 20px 22px 62px", background: `${t.color}06` }}>
                        <div style={{ height: 1, background: `${t.color}22`, margin: "0 0 16px" }} />
                        <div style={{ marginBottom: 16 }}>
                          <Label color={t.color}>WHAT YOU CAN DO</Label>
                          <ul style={{ margin: "8px 0 0", padding: "0 0 0 16px", display: "flex", flexDirection: "column", gap: 6 }}>
                            {t.uses.map((u, j) => <li key={j} style={{ fontSize: 13, color: "#AAA", lineHeight: 1.6 }}>{u}</li>)}
                          </ul>
                        </div>
                        <div>
                          <Label color={t.color}>EXAMPLE PROMPTS / CODE</Label>
                          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
                            {t.prompts.map((p, j) => (
                              <div key={j} style={{ background: "#07070E", border: `1px solid ${t.color}22`, borderRadius: 3, padding: "10px 12px" }}>
                                <code style={{ fontSize: 12, color: t.color, fontFamily: "monospace", lineHeight: 1.6 }}>{p}</code>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <Subheading>The AI Statistics Workflow</Subheading>
            <div style={{ border: "1px solid #1A1A2E", borderRadius: 4, overflow: "hidden", margin: "16px 0 28px" }}>
              {[
                { step: "1", action: "Upload or describe your dataset to Julius AI or ChatGPT", why: "Get instant descriptive stats and distribution shape" },
                { step: "2", action: "Ask AI: 'What statistical test should I use for my question?'", why: "Avoids wrong test selection — the most common error" },
                { step: "3", action: "Run the test (Python / Excel / AI generates code for you)", why: "Get p-value, confidence intervals, effect size" },
                { step: "4", action: "Paste output into ChatGPT: 'Interpret this for a non-technical stakeholder'", why: "Translate stats into plain English for presentations" },
                { step: "5", action: "Validate: does the result make business sense?", why: "Your job — AI can't know the business context" },
              ].map((s, i, arr) => (
                <div key={i} style={{
                  display: "flex", gap: 16, padding: "12px 18px",
                  borderBottom: i < arr.length - 1 ? "1px solid #0F0F18" : "none",
                  background: "#0A0A14", alignItems: "flex-start",
                }}>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(244,143,177,0.15)", border: "1px solid rgba(244,143,177,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: 10, color: "#F48FB1", fontFamily: "monospace", fontWeight: 700 }}>{s.step}</span>
                  </div>
                  <div style={{ flex: 1, fontSize: 13, color: "#AAA", lineHeight: 1.6 }}>{s.action}</div>
                  <div style={{ fontSize: 12, color: "#555", maxWidth: 200, textAlign: "right", fontStyle: "italic" }}>{s.why}</div>
                </div>
              ))}
            </div>

            <NavButtons onPrev={() => setActiveSection("correlation")} onNext={() => setActiveSection("quiz")} nextLabel="Take the Quiz →" />
          </div>
        )}

        {/* ── QUIZ ── */}
        {activeSection === "quiz" && (
          <div>
            <SectionHeader num="07" title="Part 2 Knowledge Check" color="#FFD54F" />
            <Prose>6 questions covering everything in Part 2. You need 4/6 to proceed confidently to Part 3.</Prose>

            {!quizState.done ? (
              <div style={{ margin: "28px 0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                  <span style={{ fontSize: 11, color: "#555", fontFamily: "monospace", letterSpacing: "0.15em" }}>
                    QUESTION {quizState.idx + 1} / {quizQuestions.length}
                  </span>
                  <span style={{ fontSize: 11, color: "#81C784", fontFamily: "monospace" }}>
                    SCORE: {quizState.score} / {quizState.idx}
                  </span>
                </div>
                <div style={{ height: 3, background: "#1A1A2E", borderRadius: 2, marginBottom: 28, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${(quizState.idx / quizQuestions.length) * 100}%`, background: "linear-gradient(90deg, #4FC3F7, #FFD54F)", transition: "width 0.4s" }} />
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#DDD8F0", lineHeight: 1.65, marginBottom: 24, fontFamily: "Georgia, serif" }}>
                  {quizQuestions[quizState.idx].q}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {quizQuestions[quizState.idx].options.map((opt, i) => {
                    const isSelected = quizState.selected === i;
                    const isCorrect = i === quizQuestions[quizState.idx].answer;
                    let bg = "#0D0D18", border = "#1A1A2E", col = "#888";
                    if (quizState.answered) {
                      if (isCorrect) { bg = "rgba(129,199,132,0.1)"; border = "#81C784"; col = "#81C784"; }
                      else if (isSelected && !isCorrect) { bg = "rgba(255,100,100,0.1)"; border = "#FF6464"; col = "#FF6464"; }
                    } else if (isSelected) { bg = "rgba(79,195,247,0.08)"; border = "#4FC3F7"; col = "#4FC3F7"; }
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
                  <div style={{ margin: "20px 0 0", padding: "14px 18px", background: "rgba(255,213,79,0.05)", border: "1px solid rgba(255,213,79,0.2)", borderRadius: 4 }}>
                    <div style={{ fontSize: 10, color: "#FFD54F", letterSpacing: "0.15em", marginBottom: 6, fontFamily: "monospace" }}>EXPLANATION</div>
                    <p style={{ fontSize: 13, color: "#AAA", margin: "0 0 16px", lineHeight: 1.7 }}>
                      {quizQuestions[quizState.idx].explanation}
                    </p>
                    <button onClick={nextQ} style={{
                      background: "#4FC3F7", border: "none", borderRadius: 3,
                      padding: "8px 20px", cursor: "pointer", fontFamily: "monospace",
                      fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#07070E",
                    }}>
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
                <div style={{ fontSize: 44, fontWeight: 900, color: quizState.score >= 5 ? "#81C784" : quizState.score >= 4 ? "#FFD54F" : "#FF8A65", marginBottom: 8 }}>
                  {quizState.score} / {quizQuestions.length}
                </div>
                <div style={{ fontSize: 15, color: "#777", marginBottom: 28 }}>
                  {quizState.score === 6 ? "Excellent. You've mastered Part 2 statistics." : quizState.score >= 4 ? "Good grasp. Review any sections you found tricky." : "Revisit the sections above before continuing."}
                </div>
                <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                  <button onClick={() => setQuizState({ idx: 0, selected: null, answered: false, score: 0, done: false })} style={{ background: "none", border: "1px solid #333", borderRadius: 3, padding: "8px 20px", cursor: "pointer", fontFamily: "monospace", fontSize: 11, color: "#666", letterSpacing: "0.1em" }}>RETAKE</button>
                  <button onClick={() => setActiveSection("intro")} style={{ background: "#4FC3F7", border: "none", borderRadius: 3, padding: "8px 24px", cursor: "pointer", fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: "#07070E", letterSpacing: "0.1em" }}>REVIEW ↑</button>
                </div>
                <div style={{ marginTop: 40, padding: "20px", background: "#0D0D18", border: "1px solid #1A1A2E", borderRadius: 4, textAlign: "left" }}>
                  <div style={{ fontSize: 11, color: "#555", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 10, fontFamily: "monospace" }}>WHAT'S IN PART 3 →</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#DDD8F0", marginBottom: 6 }}>Excel + Microsoft Copilot for Data Analytics</div>
                  <p style={{ fontSize: 13, color: "#555", lineHeight: 1.7, margin: 0 }}>
                    PivotTables, XLOOKUP, dynamic arrays, data cleaning, and building dashboards — all accelerated with Excel Copilot AI. Your first real business tool.
                  </p>
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
    <div style={{ marginBottom: 28, paddingBottom: 16, borderBottom: "1px solid #1A1A2E" }}>
      <div style={{ fontSize: 10, color, letterSpacing: "0.3em", fontFamily: "monospace", marginBottom: 6 }}>SECTION {num}</div>
      <h2 style={{ margin: 0, fontSize: "clamp(20px,3vw,28px)", fontWeight: 900, color: "#DDD8F0", letterSpacing: "-0.01em" }}>
        <span style={{ color }}>{num}. </span>{title}
      </h2>
    </div>
  );
}
function Subheading({ children }) {
  return <h3 style={{ fontSize: 16, fontWeight: 700, color: "#DDD8F0", margin: "32px 0 12px", borderLeft: "3px solid #4FC3F7", paddingLeft: 12 }}>{children}</h3>;
}
function Prose({ children }) {
  return <p style={{ fontSize: 14, color: "#777", lineHeight: 1.9, margin: "0 0 16px" }}>{children}</p>;
}
function Highlight({ children }) {
  return <strong style={{ color: "#DDD8F0", fontWeight: 700 }}>{children}</strong>;
}
function Label({ color, children }) {
  return <div style={{ fontSize: 9, color, letterSpacing: "0.18em", textTransform: "uppercase", fontFamily: "monospace", fontWeight: 700 }}>{children}</div>;
}
function Callout({ icon, color, title, children }) {
  return (
    <div style={{ margin: "24px 0", padding: "16px 20px", background: `${color}08`, border: `1px solid ${color}33`, borderLeft: `3px solid ${color}`, borderRadius: 4 }}>
      <div style={{ fontSize: 12, color, fontWeight: 700, marginBottom: 8, display: "flex", gap: 8, alignItems: "center" }}>
        <span>{icon}</span>{title}
      </div>
      <div style={{ fontSize: 13, color: "#777", lineHeight: 1.8 }}>{children}</div>
    </div>
  );
}
function NavButtons({ onPrev, onNext, nextLabel = "Next Section →" }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 48, paddingTop: 24, borderTop: "1px solid #1A1A2E" }}>
      {onPrev ? (
        <button onClick={onPrev} style={{ background: "none", border: "1px solid #1A1A2E", borderRadius: 3, padding: "8px 18px", cursor: "pointer", fontFamily: "monospace", fontSize: 11, color: "#555", letterSpacing: "0.1em" }}>← Previous</button>
      ) : <div />}
      {onNext && (
        <button onClick={onNext} style={{ background: "#4FC3F7", border: "none", borderRadius: 3, padding: "8px 24px", cursor: "pointer", fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: "#07070E", letterSpacing: "0.1em" }}>{nextLabel}</button>
      )}
    </div>
  );
}
