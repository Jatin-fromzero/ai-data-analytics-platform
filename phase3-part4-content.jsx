import { useState } from "react";

// All Python code stored as .join("\n") arrays — no template literal conflicts

const SETUP_CODE = [
  "# Install required libraries (run in terminal)",
  "# pip install pandas numpy matplotlib seaborn plotly",
  "# pip install scikit-learn ydata-profiling streamlit",
  "# pip install shap h2o",
  "",
  "# Project folder structure",
  "# customer-intelligence/",
  "# |-- data/           raw CSV files",
  "# |-- notebooks/      Jupyter .ipynb files",
  "# |-- app/            Streamlit app",
  "# |-- outputs/        charts, reports",
  "# |-- README.md",
].join("\n");

const LOAD_CODE = [
  "import pandas as pd",
  "import numpy as np",
  "from ydata_profiling import ProfileReport",
  "",
  "# Load dataset",
  "df = pd.read_csv('data/orders.csv')",
  "df['order_date'] = pd.to_datetime(df['order_date'])",
  "df['revenue']    = df['units'] * df['price']",
  "df['profit']     = df['units'] * (df['price'] - df['cost'])",
  "",
  "# Quick sanity check",
  "print('Shape:', df.shape)",
  "print('Date range:', df['order_date'].min(), 'to', df['order_date'].max())",
  "print('Null counts:')",
  "print(df.isnull().sum())",
  "print('Status counts:')",
  "print(df['status'].value_counts())",
  "",
  "# Automated EDA report",
  "profile = ProfileReport(df, title='RetailCo EDA', minimal=True)",
  "profile.to_file('outputs/01_eda_report.html')",
  "print('EDA report saved to outputs/01_eda_report.html')",
].join("\n");

const FEATURES_CODE = [
  "import pandas as pd",
  "import numpy as np",
  "",
  "def build_customer_features(df):",
  "    completed = df[df['status'] == 'Completed'].copy()",
  "    ref_date  = completed['order_date'].max()",
  "",
  "    rfm = completed.groupby('customer_id').agg(",
  "        recency_days   = ('order_date',",
  "            lambda x: (ref_date - x.max()).days),",
  "        frequency      = ('order_id',  'count'),",
  "        monetary       = ('revenue',   'sum'),",
  "        avg_order_val  = ('revenue',   'mean'),",
  "        total_units    = ('units',     'sum'),",
  "        unique_products= ('product',   'nunique'),",
  "        first_order    = ('order_date','min'),",
  "    ).reset_index()",
  "",
  "    # Derived features",
  "    rfm['days_as_customer'] = (",
  "        ref_date - rfm['first_order']",
  "    ).dt.days",
  "    rfm['orders_per_month'] = (",
  "        rfm['frequency'] / (rfm['days_as_customer'] / 30 + 1)",
  "    ).round(3)",
  "",
  "    # Churn label: no purchase in last 90 days",
  "    rfm['churned'] = (rfm['recency_days'] > 90).astype(int)",
  "",
  "    rfm.drop(columns=['first_order'], inplace=True)",
  "    return rfm",
  "",
  "customer_df = build_customer_features(df)",
  "print('Customer features shape:', customer_df.shape)",
  "print('Churn rate:',",
  "      round(customer_df['churned'].mean() * 100, 1), '%')",
  "print(customer_df.describe().round(2))",
].join("\n");

const MODEL_CODE = [
  "import pandas as pd",
  "import numpy as np",
  "import matplotlib.pyplot as plt",
  "import shap",
  "from sklearn.model_selection import train_test_split, cross_val_score",
  "from sklearn.preprocessing   import StandardScaler",
  "from sklearn.ensemble        import RandomForestClassifier",
  "from sklearn.linear_model    import LogisticRegression",
  "from sklearn.metrics         import (",
  "    classification_report, roc_auc_score,",
  "    confusion_matrix, ConfusionMatrixDisplay",
  ")",
  "",
  "FEATURES = ['recency_days', 'frequency', 'monetary',",
  "            'avg_order_val', 'unique_products',",
  "            'orders_per_month', 'days_as_customer']",
  "",
  "X = customer_df[FEATURES]",
  "y = customer_df['churned']",
  "",
  "# Train / test split",
  "X_train, X_test, y_train, y_test = train_test_split(",
  "    X, y, test_size=0.2, random_state=42, stratify=y",
  ")",
  "",
  "# Scale",
  "scaler  = StandardScaler()",
  "Xtr_sc  = scaler.fit_transform(X_train)",
  "Xte_sc  = scaler.transform(X_test)",
  "",
  "# Train models",
  "rf = RandomForestClassifier(n_estimators=200, random_state=42)",
  "lr = LogisticRegression(max_iter=1000, random_state=42)",
  "rf.fit(Xtr_sc, y_train)",
  "lr.fit(Xtr_sc, y_train)",
  "",
  "# Evaluate",
  "for name, mdl in [('Random Forest', rf), ('Logistic Reg', lr)]:",
  "    yp  = mdl.predict(Xte_sc)",
  "    auc = roc_auc_score(y_test, yp)",
  "    print(f'{name}  ROC-AUC: {auc:.3f}')",
  "    print(classification_report(y_test, yp))",
  "",
  "# Confusion matrix",
  "fig, ax = plt.subplots(figsize=(6, 5))",
  "ConfusionMatrixDisplay.from_predictions(",
  "    y_test, rf.predict(Xte_sc), ax=ax,",
  "    display_labels=['Active', 'Churned'],",
  "    colorbar=False)",
  "plt.title('Random Forest — Confusion Matrix')",
  "plt.savefig('outputs/03_confusion_matrix.png', dpi=150)",
  "plt.show()",
].join("\n");

const SHAP_CODE = [
  "import shap",
  "import matplotlib.pyplot as plt",
  "",
  "# SHAP values for Random Forest",
  "explainer   = shap.TreeExplainer(rf)",
  "shap_values = explainer.shap_values(Xte_sc)",
  "",
  "# Global feature importance",
  "plt.figure(figsize=(10, 6))",
  "shap.summary_plot(",
  "    shap_values[1],",
  "    pd.DataFrame(Xte_sc, columns=FEATURES),",
  "    plot_type='bar', show=False",
  ")",
  "plt.title('What drives churn? SHAP Feature Importance')",
  "plt.tight_layout()",
  "plt.savefig('outputs/04_shap_importance.png', dpi=150)",
  "plt.show()",
  "",
  "# Explain one specific customer",
  "cust_idx = 0",
  "shap.force_plot(",
  "    explainer.expected_value[1],",
  "    shap_values[1][cust_idx],",
  "    pd.DataFrame(Xte_sc, columns=FEATURES).iloc[cust_idx],",
  "    matplotlib=True",
  ")",
  "plt.savefig('outputs/04_shap_force_plot.png',",
  "            dpi=150, bbox_inches='tight')",
  "plt.show()",
].join("\n");

const STREAMLIT_CODE = [
  "# app/streamlit_app.py",
  "# Run with: streamlit run app/streamlit_app.py",
  "",
  "import streamlit as st",
  "import pandas as pd",
  "import numpy as np",
  "import plotly.express as px",
  "import joblib",
  "",
  "st.set_page_config(",
  "    page_title='Customer Intelligence Platform',",
  "    layout='wide',",
  "    page_icon='🧠'",
  ")",
  "",
  "# Load model and data",
  "@st.cache_data",
  "def load_data():",
  "    return pd.read_csv('data/customer_features.csv')",
  "",
  "df = load_data()",
  "",
  "# ── Sidebar filters ─────────────────────────────────────",
  "st.sidebar.title('Filters')",
  "seg = st.sidebar.multiselect(",
  "    'Customer Segment',",
  "    options=['Champion','Loyal','At Risk','Lost'],",
  "    default=['Champion','Loyal','At Risk','Lost']",
  ")",
  "churn_only = st.sidebar.checkbox('Show churned customers only')",
  "",
  "filtered = df[df['segment'].isin(seg)]",
  "if churn_only:",
  "    filtered = filtered[filtered['churned'] == 1]",
  "",
  "# ── KPI row ─────────────────────────────────────────────",
  "col1, col2, col3, col4 = st.columns(4)",
  "col1.metric('Total Customers', len(filtered))",
  "col2.metric('Churn Rate',",
  "    str(round(filtered['churned'].mean()*100, 1)) + '%')",
  "col3.metric('Avg Order Value',",
  "    '$' + str(round(filtered['avg_order_val'].mean(), 0)))",
  "col4.metric('Avg Recency (days)',",
  "    str(int(filtered['recency_days'].mean())))",
  "",
  "# ── Charts ──────────────────────────────────────────────",
  "c1, c2 = st.columns(2)",
  "with c1:",
  "    fig = px.histogram(filtered, x='recency_days',",
  "                       color='churned', barmode='overlay',",
  "                       title='Recency Distribution by Churn')",
  "    st.plotly_chart(fig, use_container_width=True)",
  "",
  "with c2:",
  "    seg_counts = filtered['segment'].value_counts().reset_index()",
  "    fig2 = px.pie(seg_counts, names='segment', values='count',",
  "                  title='Customer Segment Distribution')",
  "    st.plotly_chart(fig2, use_container_width=True)",
  "",
  "# ── Data table ──────────────────────────────────────────",
  "st.subheader('Customer Data')",
  "st.dataframe(filtered.sort_values('churned',",
  "    ascending=False), use_container_width=True)",
].join("\n");

const RFM_SEGMENT_CODE = [
  "import pandas as pd",
  "import numpy as np",
  "",
  "def add_rfm_segments(customer_df):",
  "    df = customer_df.copy()",
  "",
  "    # Score each dimension 1-4 using quartiles",
  "    # Recency: lower days = better = higher score",
  "    df['r_score'] = pd.qcut(",
  "        df['recency_days'],",
  "        q=4, labels=[4, 3, 2, 1]",
  "    ).astype(int)",
  "",
  "    df['f_score'] = pd.qcut(",
  "        df['frequency'].rank(method='first'),",
  "        q=4, labels=[1, 2, 3, 4]",
  "    ).astype(int)",
  "",
  "    df['m_score'] = pd.qcut(",
  "        df['monetary'].rank(method='first'),",
  "        q=4, labels=[1, 2, 3, 4]",
  "    ).astype(int)",
  "",
  "    df['rfm_total'] = df['r_score'] + df['f_score'] + df['m_score']",
  "",
  "    def label(row):",
  "        r, f = row['r_score'], row['f_score']",
  "        if r == 4 and f >= 3: return 'Champion'",
  "        if r >= 3 and f >= 3: return 'Loyal'",
  "        if r == 4 and f <= 2: return 'New Customer'",
  "        if r <= 2 and f >= 3: return 'At Risk'",
  "        if r == 1 and f == 1: return 'Lost'",
  "        return 'Needs Attention'",
  "",
  "    df['segment'] = df.apply(label, axis=1)",
  "    return df",
  "",
  "customer_df = add_rfm_segments(customer_df)",
  "print(customer_df['segment'].value_counts())",
].join("\n");

const GITHUB_README = [
  "# Customer Intelligence Platform",
  "",
  "**Phase 3 Capstone — Data Analytics Course**",
  "",
  "## Overview",
  "End-to-end customer analytics pipeline built with Python.",
  "Predicts customer churn and segments customers using RFM.",
  "",
  "## What it does",
  "- Automated EDA with ydata-profiling",
  "- RFM customer segmentation (Champion to Lost)",
  "- Churn prediction with Random Forest (ROC-AUC: 0.87)",
  "- SHAP explainability charts",
  "- Streamlit web app for stakeholder exploration",
  "",
  "## Tech stack",
  "Python, Pandas, Scikit-learn, SHAP, Streamlit, Plotly",
  "",
  "## Run the app",
  "pip install -r requirements.txt",
  "streamlit run app/streamlit_app.py",
  "",
  "## Live demo",
  "[Streamlit Cloud link here]",
  "",
  "## Dataset",
  "RetailCo FY2024 orders — 40 orders, 5 customers",
].join("\n");

const flashcards = [
  { q: "What is the difference between pd.merge() how='left' and how='inner'?", a: "LEFT: all rows from left table, NaN where no match. INNER: only rows matching in BOTH tables. Use LEFT for analytics (keep all transactions), INNER only when you need clean matched records." },
  { q: "What does pd.melt() do and when do you need it?", a: "Converts wide format (one column per period: Q1, Q2, Q3) to long format (one row per observation). Seaborn, Plotly, and Scikit-learn all require long format." },
  { q: "What are the 7 steps of the EDA framework in order?", a: "1-Shape/Schema, 2-Missing Values, 3-Distributions, 4-Descriptive Stats, 5-Categorical Summaries, 6-Correlations, 7-Outlier Detection. Always run in this order on every new dataset." },
  { q: "Why do you call scaler.fit_transform(X_train) but scaler.transform(X_test)?", a: "The scaler must learn mean/std from training data ONLY. Fitting on test data causes data leakage — the model indirectly sees test statistics. Always fit on train, transform both." },
  { q: "What does a positive SHAP value mean for a feature?", a: "A positive SHAP value means that feature pushed the prediction HIGHER. For churn: high recency_days with positive SHAP means not buying recently increases churn probability." },
  { q: "Name 3 evaluation metrics and when to use each", a: "Accuracy: balanced classes. Precision: cost of false alarms is high. Recall: cost of missing a true case is high. ROC-AUC: overall discriminative ability, handles class imbalance better than accuracy." },
  { q: "What does pd.pivot_table() produce?", a: "A 2D cross-tabulation — rows = unique values of index, columns = unique values of columns parameter, values = aggregated metric. It is the Python equivalent of an Excel PivotTable." },
  { q: "What is feature engineering and why does it matter?", a: "Creating new columns from existing data that better represent patterns for models to learn. Better features beat better algorithms. Examples: margin_pct from price/cost, is_weekend from order_date, recency from last order." },
  { q: "What does H2O AutoML do that manual Scikit-learn does not?", a: "AutoML trains 20+ model types (GBM, XGBoost, Random Forest, Neural Net) with many hyperparameter combinations simultaneously, cross-validates each, and returns a ranked leaderboard. Manual Scikit-learn trains one model at a time." },
  { q: "How does ydata-profiling save you time in EDA?", a: "One line generates a complete HTML report covering all 7 EDA steps: distributions, correlations, missing values, duplicates, and alerts for high correlation, skewness, and constant columns. Saves 30-60 minutes of manual code." },
  { q: "What is the IQR outlier detection rule?", a: "Outlier if value < Q1 - 1.5xIQR or > Q3 + 1.5xIQR. Resistant to extreme values themselves. Use IQR for skewed data. Z-score above 3 is the alternative for normally distributed data." },
  { q: "How do you launch a Streamlit app and what does it do?", a: "Run: streamlit run app.py in terminal. Opens a local web server at localhost:8501. Streamlit converts Python scripts into interactive web apps — sliders, dropdowns, charts — with no HTML/CSS required." },
];

const rubricRows = [
  { task: "T1 Setup & EDA",          max: 15, criteria: "4 libraries installed, data loaded and cleaned, ydata-profiling report generated" },
  { task: "T2 Feature Engineering",  max: 20, criteria: "RFM features correct, churn label defined, segment labels applied" },
  { task: "T3 ML Model",             max: 25, criteria: "Train/test split, scaling correct, 2 models trained, metrics reported" },
  { task: "T4 SHAP",                 max: 20, criteria: "Summary plot saved, force plot for 1 customer, written interpretation" },
  { task: "T5 Streamlit App",        max: 20, criteria: "App runs, KPIs displayed, 2 charts, filter control, shared/deployed" },
];

const sections = [
  { id: "intro",   label: "Overview"   },
  { id: "brief",   label: "Brief"      },
  { id: "tasks",   label: "Tasks (5)"  },
  { id: "app",     label: "Streamlit"  },
  { id: "rubric",  label: "Rubric"     },
  { id: "review",  label: "Review"     },
  { id: "next",    label: "Phase 4"    },
];

export default function Phase3Part4() {
  const [sec,          setSec]          = useState("intro");
  const [activeTask,   setActiveTask]   = useState(null);
  const [checkedSteps, setCheckedSteps] = useState({});
  const [scores,       setScores]       = useState({});
  const [flipped,      setFlipped]      = useState({});

  const ACC = "#B2FF59";

  const totalScore = rubricRows.reduce((a, r) => a + (scores[r.task] || 0), 0);
  const maxScore   = rubricRows.reduce((a, r) => a + r.max, 0);
  const pct        = totalScore > 0 ? Math.round(totalScore / maxScore * 100) : 0;

  const toggleStep = (key) => setCheckedSteps(p => ({ ...p, [key]: !p[key] }));
  const setScore   = (task, val) => {
    const max = rubricRows.find(r => r.task === task).max;
    setScores(p => ({ ...p, [task]: Math.min(max, Math.max(0, Number(val))) }));
  };
  const flipCard = (i) => setFlipped(p => ({ ...p, [i]: !p[i] }));

  const tasks = [
    {
      num: "T1", title: "Setup, Load & Auto-EDA", col: "#4FC3F7", weight: 15,
      objective: "Set up the project, load the RetailCo dataset, run ydata-profiling.",
      steps: [
        "Create project folder: customer-intelligence/ with data/, notebooks/, app/, outputs/",
        "Install libraries: pandas numpy scikit-learn ydata-profiling shap streamlit plotly",
        "Copy RetailCo orders.csv from Phase 1 Part 4 into data/",
        "Open Jupyter notebook: 01_eda.ipynb",
        "Load the CSV, convert order_date to datetime, add revenue = units * price",
        "Run df.shape, df.info(), df.isnull().sum(), df.describe()",
        "Run ydata-profiling — ProfileReport(df, minimal=True) — save to outputs/",
        "Open the HTML report and document 3 key findings",
        "Fix any data quality issues found (whitespace, wrong dtypes)",
      ],
      code: LOAD_CODE,
      aiPrompt: "I have a CSV with columns: order_id, customer_id, product, region, units, price, cost, status, order_date. Write pandas code to load it, fix the date column, add revenue and profit columns, run a data quality check, and generate a ydata-profiling report.",
      deliverable: "outputs/01_eda_report.html + 3 written EDA findings",
    },
    {
      num: "T2", title: "Feature Engineering + RFM", col: "#81C784", weight: 20,
      objective: "Build customer-level features and apply RFM segmentation.",
      steps: [
        "Open notebook: 02_features.ipynb",
        "Build RFM metrics: recency_days, frequency, monetary per customer (completed orders only)",
        "Add derived features: avg_order_val, unique_products, orders_per_month, days_as_customer",
        "Create churn label: churned = 1 if recency_days > 90, else 0",
        "Apply NTILE scoring (use pd.qcut) for r_score, f_score, m_score (1-4 each)",
        "Apply segment labels using a function: Champion, Loyal, New Customer, At Risk, Lost",
        "Print: customer count, churn rate %, segment distribution",
        "Save as data/customer_features.csv for use in T3 and T5",
      ],
      code: FEATURES_CODE,
      aiPrompt: "I have a pandas DataFrame of orders with customer_id, order_date, revenue, status columns. Write a function that builds customer-level RFM features (recency_days, frequency, monetary), scores each 1-4 using pd.qcut, assigns segment labels (Champion to Lost), and adds a churned binary column.",
      deliverable: "data/customer_features.csv with RFM features and segment labels",
    },
    {
      num: "T3", title: "Churn Prediction Model", col: "#FFD54F", weight: 25,
      objective: "Train and evaluate a churn prediction model using Scikit-learn.",
      steps: [
        "Open notebook: 03_model.ipynb — load data/customer_features.csv",
        "Define X (feature columns) and y (churned column)",
        "Split 80/20 with train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)",
        "Scale with StandardScaler — fit on train only, transform both",
        "Train LogisticRegression and RandomForestClassifier",
        "For each model: print accuracy, ROC-AUC, and classification_report",
        "Plot confusion matrix for the best model — save to outputs/",
        "Cross-validate best model: cross_val_score(model, X, y, cv=5, scoring='roc_auc')",
        "Print feature importances for Random Forest",
      ],
      code: MODEL_CODE,
      aiPrompt: "I have a customer_features.csv with columns: recency_days, frequency, monetary, avg_order_val, unique_products, orders_per_month, churned. Write a complete Scikit-learn churn prediction pipeline: split, scale, train Logistic Regression and Random Forest, print classification reports, plot confusion matrix.",
      deliverable: "outputs/03_confusion_matrix.png + printed metrics for both models",
    },
    {
      num: "T4", title: "SHAP Explainability", col: "#CE93D8", weight: 20,
      objective: "Use SHAP to explain model predictions globally and individually.",
      steps: [
        "Continue in 03_model.ipynb or open 04_shap.ipynb",
        "Create SHAP TreeExplainer for the Random Forest model",
        "Compute shap_values on X_test",
        "Generate summary bar plot — save to outputs/04_shap_importance.png",
        "Generate summary dot plot (default) — save separately",
        "Run force_plot for the top 3 highest-risk churn customers",
        "Write a 3-bullet interpretation: 'What drives churn at ShopStream?'",
        "Translate each SHAP finding into business language (no jargon)",
      ],
      code: SHAP_CODE,
      aiPrompt: "I trained a Random Forest churn model on customer features: recency_days, frequency, monetary, avg_order_val. Generate SHAP TreeExplainer values, plot the summary bar chart and summary dot plot, run a force plot for one customer, and write a 3-bullet business interpretation of the findings.",
      deliverable: "outputs/04_shap_importance.png + 3 written business insights",
    },
    {
      num: "T5", title: "Streamlit Dashboard App", col: "#FF8A65", weight: 20,
      objective: "Build a Streamlit web app that stakeholders can use to explore customer data.",
      steps: [
        "Create app/streamlit_app.py",
        "Add page config: title = 'Customer Intelligence Platform', layout='wide'",
        "Load customer_features.csv with st.cache_data",
        "Add sidebar filters: segment multiselect, churn-only checkbox",
        "Add 4 KPI metrics row: total customers, churn rate %, avg order value, avg recency",
        "Add 2 Plotly charts: recency histogram coloured by churn, segment pie chart",
        "Add a sortable data table: st.dataframe() sorted by churn risk",
        "Run locally: streamlit run app/streamlit_app.py",
        "Deploy to Streamlit Cloud (free): go to share.streamlit.io → connect GitHub repo",
        "Copy the shareable link for your portfolio and GitHub README",
      ],
      code: STREAMLIT_CODE,
      aiPrompt: "Write a complete Streamlit app that loads customer_features.csv (with columns: customer_id, recency_days, frequency, monetary, churned, segment, avg_order_val). Include: sidebar filters for segment and churn, 4 KPI metric cards, a Plotly histogram, a Plotly pie chart, and a sortable data table.",
      deliverable: "Live Streamlit app URL + app/streamlit_app.py committed to GitHub",
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#07070E", color: "#DDD8F0", fontFamily: "Georgia, serif" }}>

      {/* NAV */}
      <div style={{ background: "#0A0A14", borderBottom: "1px solid #16162A", padding: "0 24px", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 940, margin: "0 auto", display: "flex", alignItems: "center", overflowX: "auto" }}>
          <div style={{ fontSize: 10, color: ACC, letterSpacing: "0.2em", textTransform: "uppercase", padding: "14px 20px 14px 0", borderRight: "1px solid #1A1A2E", marginRight: 12, whiteSpace: "nowrap" }}>P3 · PART 4</div>
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
                PHASE 3 · PART 4 OF 4 · CAPSTONE
              </div>
              <h1 style={{ fontSize: "clamp(26px,5vw,44px)", fontWeight: 900, margin: "0 0 16px", lineHeight: 1.12, letterSpacing: "-0.02em" }}>
                Customer Intelligence<br />
                <span style={{ color: ACC }}>Platform</span><br />
                <span style={{ fontStyle: "italic", fontWeight: 400, fontSize: "0.65em", color: "#555" }}>Phase 3 Capstone Project</span>
              </h1>
              <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, maxWidth: 580, margin: "0 0 24px" }}>
                Your Phase 3 capstone is a complete, end-to-end Python analytics project. You will build a customer churn prediction system with automated EDA, RFM segmentation, a machine learning model, SHAP explainability, and a live Streamlit web app — all portfolio-ready and deployed to the cloud.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {["5 tasks", "100 marks", "~8 hours", "Portfolio-ready", "Live Streamlit app", "GitHub + cloud deploy"].map(t => (
                  <span key={t} style={{ padding: "4px 12px", background: "rgba(178,255,89,0.08)", border: "1px solid rgba(178,255,89,0.2)", borderRadius: 2, fontSize: 11, color: ACC }}>{t}</span>
                ))}
              </div>
            </div>

            <Sec n="00" title="Project at a Glance" col={ACC} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 10, margin: "24px 0 36px" }}>
              {[
                { icon: "📋", label: "Brief",       desc: "Scenario, deliverables, time estimate",           s: "brief"  },
                { icon: "✅", label: "5 Tasks",     desc: "Step-by-step with AI prompts and code per task",  s: "tasks"  },
                { icon: "🌐", label: "Streamlit",   desc: "Build and deploy the web app to the cloud",       s: "app"    },
                { icon: "🎯", label: "Rubric",      desc: "100-point self-assessment with live score",       s: "rubric" },
                { icon: "🧠", label: "Review",      desc: "12 flashcards covering all of Phase 3",           s: "review" },
                { icon: "🚀", label: "Phase 4",     desc: "What comes next — BI Tools and the big picture",  s: "next"   },
              ].map((item, i) => (
                <div key={i} onClick={() => setSec(item.s)} style={{
                  border: "1px solid " + ACC + "33", borderTop: "3px solid " + ACC,
                  borderRadius: 4, padding: "14px", background: "#0D0D18",
                  cursor: "pointer", transition: "background 0.2s",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = ACC + "08"}
                  onMouseLeave={e => e.currentTarget.style.background = "#0D0D18"}
                >
                  <div style={{ fontSize: 22, marginBottom: 8 }}>{item.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#DDD8F0", marginBottom: 4 }}>{item.label}</div>
                  <div style={{ fontSize: 11, color: "#444", lineHeight: 1.6 }}>{item.desc}</div>
                </div>
              ))}
            </div>

            <Box col={ACC} icon="🏆" title="What You Are Building">
              A complete Customer Intelligence Platform — the type of project a data analyst builds in their first 60 days. You will have: a Jupyter notebook pipeline from raw CSV to predictions, SHAP charts explaining every model decision, and a live Streamlit web app where stakeholders can filter, explore, and act on customer insights. This is real portfolio work.
            </Box>
            <Nav onNext={() => setSec("brief")} />
          </div>
        )}

        {/* ── BRIEF ── */}
        {sec === "brief" && (
          <div>
            <Sec n="01" title="Project Brief" col="#4FC3F7" />

            <div style={{ border: "1px solid #4FC3F733", borderLeft: "4px solid #4FC3F7", borderRadius: 4, padding: "22px 24px", background: "rgba(79,195,247,0.04)", marginBottom: 24 }}>
              <div style={{ fontSize: 10, color: "#4FC3F7", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 10, fontFamily: "monospace" }}>THE SCENARIO</div>
              <p style={{ fontSize: 14, color: "#AAA", lineHeight: 1.88, margin: "0 0 12px" }}>
                You are a Data Analyst at <strong style={{ color: "#DDD8F0" }}>RetailCo</strong>. The Head of Customer Success walks over to your desk:
              </p>
              <blockquote style={{ borderLeft: "2px solid #4FC3F7", paddingLeft: 16, margin: "0 0 12px", fontStyle: "italic", color: "#888", fontSize: 14, lineHeight: 1.8 }}>
                "We're losing customers and we don't know who's about to leave until it's too late. I need a tool that tells me which customers are at risk of churning, why they're at risk, and shows this to the whole customer success team without them needing to know Python. Can you build something by next Friday?"
              </blockquote>
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#DDD8F0", margin: "28px 0 12px", borderLeft: "3px solid #4FC3F7", paddingLeft: 12 }}>Your Deliverables</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, margin: "0 0 24px" }}>
              {[
                { d: "Jupyter Notebooks (01_eda.ipynb through 04_shap.ipynb)", col: "#4FC3F7" },
                { d: "data/customer_features.csv — RFM features and predictions", col: "#81C784" },
                { d: "outputs/ folder — EDA report, confusion matrix, SHAP charts", col: "#FFD54F" },
                { d: "app/streamlit_app.py — interactive web dashboard", col: "#FF8A65" },
                { d: "GitHub repo with README.md and live Streamlit Cloud link", col: "#CE93D8" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 14px", background: "#0D0D18", border: "1px solid " + item.col + "22", borderRadius: 3 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: item.col, flexShrink: 0, marginTop: 6 }} />
                  <span style={{ fontSize: 13, color: "#888" }}>{item.d}</span>
                </div>
              ))}
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#DDD8F0", margin: "28px 0 12px", borderLeft: "3px solid #4FC3F7", paddingLeft: 12 }}>Time Estimates</h3>
            <div style={{ border: "1px solid #1A1A2E", borderRadius: 4, overflow: "hidden", margin: "0 0 24px" }}>
              {[
                { t: "T1 Setup and Auto-EDA",    time: "~60 min",  note: "Follow the code template" },
                { t: "T2 Feature Engineering",   time: "~60 min",  note: "Hardest part — take your time" },
                { t: "T3 Churn Prediction",      time: "~75 min",  note: "Follow the Scikit-learn template" },
                { t: "T4 SHAP Explainability",   time: "~45 min",  note: "Writing insights takes longest" },
                { t: "T5 Streamlit App",         time: "~90 min",  note: "Deploy adds 20 min" },
              ].map((r, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 80px 1fr", gap: 14, padding: "10px 16px", borderBottom: i < 4 ? "1px solid #0F0F18" : "none", background: i % 2 === 0 ? "#0A0A14" : "#07070E", alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: "#AAA", fontWeight: 700 }}>{r.t}</span>
                  <span style={{ fontSize: 12, color: "#4FC3F7", fontFamily: "monospace" }}>{r.time}</span>
                  <span style={{ fontSize: 12, color: "#555", fontStyle: "italic" }}>{r.note}</span>
                </div>
              ))}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 1fr", gap: 14, padding: "10px 16px", background: "#0D0D18", borderTop: "2px solid #1A1A2E" }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#DDD8F0" }}>Total</span>
                <span style={{ fontSize: 12, color: "#4FC3F7", fontFamily: "monospace", fontWeight: 700 }}>~7-8 hrs</span>
                <span style={{ fontSize: 12, color: "#555" }}>Work in sessions, one task per sitting</span>
              </div>
            </div>
            <Nav onPrev={() => setSec("intro")} onNext={() => setSec("tasks")} />
          </div>
        )}

        {/* ── TASKS ── */}
        {sec === "tasks" && (
          <div>
            <Sec n="02" title="5 Project Tasks" col="#FFD54F" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 20px" }}>
              Complete tasks in order — each one builds on the previous. Every task has checkable steps, AI prompts, and full code to reference.
            </p>

            {/* Task selector */}
            <div style={{ display: "flex", gap: 6, marginBottom: 24, overflowX: "auto", paddingBottom: 4 }}>
              {tasks.map((t, i) => (
                <button key={i} onClick={() => setActiveTask(activeTask === i ? null : i)} style={{
                  background: activeTask === i ? t.col + "18" : "#0D0D18",
                  border: "1px solid " + (activeTask === i ? t.col : "#1A1A2E"),
                  borderTop: "3px solid " + t.col,
                  borderRadius: 4, padding: "12px 14px", cursor: "pointer",
                  fontFamily: "monospace", fontSize: 11,
                  color: activeTask === i ? t.col : "#555",
                  whiteSpace: "nowrap", minWidth: 90, textAlign: "left",
                  transition: "all 0.2s",
                }}>
                  <div style={{ fontWeight: 700, marginBottom: 3 }}>{t.num}</div>
                  <div style={{ fontSize: 10, lineHeight: 1.4 }}>{t.title.substring(0, 18)}</div>
                  <div style={{ marginTop: 5, fontSize: 10, color: "#444" }}>{t.weight} pts</div>
                </button>
              ))}
            </div>

            {activeTask !== null && (() => {
              const t = tasks[activeTask];
              const doneCount = t.steps.filter((_, j) => checkedSteps[activeTask + "-" + j]).length;
              const prog = Math.round(doneCount / t.steps.length * 100);
              return (
                <div style={{ border: "1px solid " + t.col + "44", borderLeft: "4px solid " + t.col, borderRadius: 4, overflow: "hidden", marginBottom: 24 }}>
                  <div style={{ padding: "18px 22px", background: t.col + "08", borderBottom: "1px solid " + t.col + "22" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                      <div>
                        <div style={{ fontSize: 10, color: t.col, letterSpacing: "0.2em", fontFamily: "monospace", marginBottom: 5 }}>{t.num} · {t.weight} MARKS</div>
                        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: "#DDD8F0" }}>{t.title}</h3>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 11, color: t.col, fontFamily: "monospace", marginBottom: 4 }}>{doneCount}/{t.steps.length} done</div>
                        <div style={{ width: 100, height: 4, background: "#1A1A2E", borderRadius: 2, overflow: "hidden" }}>
                          <div style={{ width: prog + "%", height: "100%", background: t.col, borderRadius: 2, transition: "width 0.3s" }} />
                        </div>
                      </div>
                    </div>
                    <p style={{ fontSize: 13, color: "#888", margin: "10px 0 0" }}>{t.objective}</p>
                  </div>

                  <div style={{ padding: "20px 22px", background: "#0A0A14" }}>
                    <div style={{ fontSize: 9, color: t.col, letterSpacing: "0.18em", fontFamily: "monospace", fontWeight: 700, marginBottom: 12 }}>STEP-BY-STEP INSTRUCTIONS</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 20 }}>
                      {t.steps.map((step, j) => {
                        const key = activeTask + "-" + j;
                        const done = checkedSteps[key];
                        return (
                          <div key={j} onClick={() => toggleStep(key)} style={{
                            display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 14px",
                            borderRadius: 3, cursor: "pointer",
                            background: done ? t.col + "08" : "#0D0D18",
                            border: "1px solid " + (done ? t.col + "44" : "#1A1A2E"),
                            transition: "all 0.2s",
                          }}>
                            <div style={{ width: 18, height: 18, borderRadius: 3, border: "1.5px solid " + (done ? t.col : "#333"), background: done ? t.col : "none", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                              {done && <span style={{ fontSize: 10, color: "#07070E", fontWeight: 900 }}>✓</span>}
                            </div>
                            <span style={{ fontSize: 13, color: done ? "#DDD8F0" : "#777", lineHeight: 1.6 }}>{step}</span>
                          </div>
                        );
                      })}
                    </div>

                    <div style={{ fontSize: 9, color: "#CE93D8", letterSpacing: "0.18em", fontFamily: "monospace", fontWeight: 700, marginBottom: 8 }}>AI PROMPT</div>
                    <div style={{ background: "rgba(206,147,216,0.05)", border: "1px solid rgba(206,147,216,0.2)", borderRadius: 3, padding: "10px 14px", marginBottom: 18 }}>
                      <code style={{ fontSize: 12, color: "#CE93D8", fontFamily: "monospace", lineHeight: 1.6 }}>{t.aiPrompt}</code>
                    </div>

                    <div style={{ fontSize: 9, color: t.col, letterSpacing: "0.18em", fontFamily: "monospace", fontWeight: 700, marginBottom: 8 }}>CODE REFERENCE</div>
                    <div style={{ background: "#07070E", border: "1px solid " + t.col + "22", borderRadius: 3, overflow: "hidden", marginBottom: 14 }}>
                      <pre style={{ margin: 0, padding: "14px 16px", fontSize: 12, color: t.col, fontFamily: "monospace", lineHeight: 1.75, overflowX: "auto" }}>{t.code}</pre>
                    </div>

                    <div style={{ background: t.col + "08", border: "1px solid " + t.col + "33", borderRadius: 3, padding: "12px 14px" }}>
                      <div style={{ fontSize: 9, color: t.col, letterSpacing: "0.15em", fontFamily: "monospace", fontWeight: 700, marginBottom: 6 }}>DELIVERABLE</div>
                      <p style={{ fontSize: 13, color: "#AAA", margin: 0 }}>{t.deliverable}</p>
                    </div>
                  </div>
                </div>
              );
            })()}

            {activeTask === null && (
              <div style={{ padding: "32px", background: "#0D0D18", border: "1px dashed #1A1A2E", borderRadius: 4, textAlign: "center", color: "#444", fontSize: 13 }}>
                ↑ Click any task card to open step-by-step instructions
              </div>
            )}
            <Nav onPrev={() => setSec("brief")} onNext={() => setSec("app")} />
          </div>
        )}

        {/* ── STREAMLIT ── */}
        {sec === "app" && (
          <div>
            <Sec n="03" title="Streamlit App + Cloud Deployment" col="#FF8A65" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 16px" }}>
              Streamlit turns your Python script into a <strong style={{ color: "#DDD8F0" }}>live interactive web app</strong> — no HTML, no CSS, no JavaScript. Write Python, get a web dashboard that anyone with a browser can use. Free hosting on Streamlit Cloud makes this a shareable portfolio piece within minutes.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, margin: "0 0 20px" }}>
              {[
                { stat: "Free",   label: "Streamlit Cloud hosting", col: "#81C784" },
                { stat: "0",      label: "HTML/CSS/JS required", col: "#4FC3F7"   },
                { stat: "< 5min", label: "to deploy from GitHub", col: "#FFD54F"  },
              ].map((s, i) => (
                <div key={i} style={{ border: "1px solid " + s.col + "33", borderRadius: 4, padding: "16px", background: s.col + "06", textAlign: "center" }}>
                  <div style={{ fontSize: 24, fontWeight: 900, color: s.col, marginBottom: 4 }}>{s.stat}</div>
                  <div style={{ fontSize: 12, color: "#666" }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ background: "#07070E", border: "1px solid #FF8A6533", borderRadius: 4, overflow: "hidden", margin: "0 0 20px" }}>
              <div style={{ padding: "8px 14px", borderBottom: "1px solid #1A1A2E" }}>
                <span style={{ fontSize: 9, color: "#FF8A65", letterSpacing: "0.15em", fontFamily: "monospace", fontWeight: 700 }}>COMPLETE STREAMLIT APP CODE</span>
              </div>
              <pre style={{ margin: 0, padding: "14px 16px", fontSize: 12, color: "#FF8A65", fontFamily: "monospace", lineHeight: 1.75, overflowX: "auto" }}>{STREAMLIT_CODE}</pre>
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#DDD8F0", margin: "28px 0 12px", borderLeft: "3px solid #FF8A65", paddingLeft: 12 }}>Deploy to Streamlit Cloud (Free)</h3>
            <div style={{ border: "1px solid #1A1A2E", borderRadius: 4, overflow: "hidden", margin: "0 0 20px" }}>
              {[
                { step: "1", action: "Push code to GitHub", detail: "git add . → git commit -m 'Add Streamlit app' → git push" },
                { step: "2", action: "Go to share.streamlit.io", detail: "Sign in with your GitHub account" },
                { step: "3", action: "Click New app", detail: "Select your repo, branch (main), and the file path: app/streamlit_app.py" },
                { step: "4", action: "Add requirements.txt", detail: "Streamlit needs a requirements.txt in root: pandas, numpy, plotly, scikit-learn, shap" },
                { step: "5", action: "Click Deploy", detail: "Streamlit installs dependencies and builds your app — takes 2-3 minutes" },
                { step: "6", action: "Copy the URL", detail: "Add it to your GitHub README and LinkedIn profile. It is your live portfolio piece." },
              ].map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 14, padding: "11px 16px", borderBottom: i < 5 ? "1px solid #0F0F18" : "none", background: i % 2 === 0 ? "#0A0A14" : "#07070E", alignItems: "flex-start" }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(255,138,101,0.15)", border: "1px solid rgba(255,138,101,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: 10, color: "#FF8A65", fontWeight: 700 }}>{s.step}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#DDD8F0" }}>{s.action}</div>
                    <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>{s.detail}</div>
                  </div>
                </div>
              ))}
            </div>

            <Box col="#4FC3F7" icon="📁" title="GitHub README Template">
              <div style={{ background: "#07070E", border: "1px solid #4FC3F722", borderRadius: 3, padding: "12px 14px", marginTop: 8 }}>
                <pre style={{ margin: 0, fontSize: 11, color: "#4FC3F7", fontFamily: "monospace", lineHeight: 1.75 }}>{GITHUB_README}</pre>
              </div>
            </Box>
            <Nav onPrev={() => setSec("tasks")} onNext={() => setSec("rubric")} />
          </div>
        )}

        {/* ── RUBRIC ── */}
        {sec === "rubric" && (
          <div>
            <Sec n="04" title="Marking Rubric — Self Assessment" col="#CE93D8" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 20px" }}>
              Score your own work. <strong style={{ color: "#DDD8F0" }}>75+ is a pass. 90+ is portfolio-ready.</strong>
            </p>

            <div style={{ border: "1px solid #1A1A2E", borderRadius: 4, overflow: "hidden", margin: "0 0 20px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 70px 80px", gap: 12, padding: "10px 16px", background: "#0D0D18", borderBottom: "1px solid #1A1A2E" }}>
                {["Task", "Criteria", "Max", "Score"].map(h => (
                  <span key={h} style={{ fontSize: 9, color: "#555", letterSpacing: "0.12em", fontFamily: "monospace", textTransform: "uppercase" }}>{h}</span>
                ))}
              </div>
              {rubricRows.map((r, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 2fr 70px 80px", gap: 12, padding: "12px 16px", alignItems: "center", borderBottom: i < rubricRows.length - 1 ? "1px solid #0F0F18" : "none", background: i % 2 === 0 ? "#0A0A14" : "#07070E" }}>
                  <span style={{ fontSize: 11, color: "#CE93D8", fontFamily: "monospace", fontWeight: 700 }}>{r.task}</span>
                  <span style={{ fontSize: 12, color: "#666", lineHeight: 1.5 }}>{r.criteria}</span>
                  <span style={{ fontSize: 13, color: "#DDD8F0", fontFamily: "monospace", textAlign: "center" }}>{r.max}</span>
                  <input type="number" min={0} max={r.max} value={scores[r.task] ?? ""} onChange={e => setScore(r.task, e.target.value)} placeholder="0"
                    style={{ background: "#0D0D18", border: "1px solid #1A1A2E", borderRadius: 3, padding: "5px 8px", color: ACC, fontFamily: "monospace", fontSize: 13, width: "60px", textAlign: "center", outline: "none" }} />
                </div>
              ))}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 70px 80px", gap: 12, padding: "14px 16px", background: "#0D0D18", borderTop: "2px solid #1A1A2E" }}>
                <span style={{ gridColumn: "1/3", fontSize: 12, fontWeight: 700, color: "#DDD8F0" }}>TOTAL</span>
                <div style={{ fontSize: 14, fontWeight: 900, color: "#DDD8F0", fontFamily: "monospace", textAlign: "center" }}>{maxScore}</div>
                <div style={{ fontSize: 14, fontWeight: 900, fontFamily: "monospace", textAlign: "center", color: pct >= 90 ? "#4ade80" : pct >= 75 ? "#FFD54F" : totalScore > 0 ? "#FF8A65" : "#555" }}>{totalScore || "—"}</div>
              </div>
            </div>

            {/* Score bar */}
            <div style={{ border: "1px solid " + (pct >= 90 ? "#4ade80" : pct >= 75 ? "#FFD54F" : totalScore > 0 ? "#FF8A65" : "#333") + "33", borderLeft: "4px solid " + (pct >= 90 ? "#4ade80" : pct >= 75 ? "#FFD54F" : totalScore > 0 ? "#FF8A65" : "#333"), borderRadius: 4, padding: "20px 22px", margin: "0 0 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap", marginBottom: 12 }}>
                <div style={{ fontSize: 44, fontWeight: 900, fontFamily: "monospace", color: pct >= 90 ? "#4ade80" : pct >= 75 ? "#FFD54F" : totalScore > 0 ? "#FF8A65" : "#333" }}>
                  {totalScore > 0 ? pct + "%" : "—"}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#DDD8F0" }}>
                    {pct >= 90 ? "🏆 Portfolio Ready" : pct >= 75 ? "✅ Pass — Good Work" : totalScore > 0 ? "📚 Needs Improvement" : "Enter your scores above"}
                  </div>
                  <div style={{ fontSize: 12, color: "#555", marginTop: 3 }}>
                    {pct >= 90 ? "Deploy to Streamlit Cloud, push to GitHub, add link to LinkedIn." : pct >= 75 ? "Review lower-scoring tasks before Phase 4." : totalScore > 0 ? "Redo weakest task before moving on." : ""}
                  </div>
                </div>
              </div>
              <div style={{ height: 6, background: "#1A1A2E", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ height: "100%", width: pct + "%", background: "linear-gradient(90deg, #FF8A65, " + (pct >= 90 ? "#4ade80" : pct >= 75 ? "#FFD54F" : "#FF8A65") + ")", borderRadius: 3, transition: "width 0.5s" }} />
              </div>
            </div>

            <Box col={ACC} icon="📦" title="Portfolio Checklist">
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 4 }}>
                {["GitHub repo created and public (customer-intelligence)", "All notebooks committed to repo", "requirements.txt added to root", "README.md written with project description and app link", "Streamlit app deployed and live link working", "LinkedIn: add 'Customer Intelligence Platform' under Projects", "Phase 3 project added to CV"].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 10 }}>
                    <span style={{ color: ACC, flexShrink: 0 }}>☐</span>
                    <span style={{ fontSize: 13, color: "#777" }}>{item}</span>
                  </div>
                ))}
              </div>
            </Box>
            <Nav onPrev={() => setSec("app")} onNext={() => setSec("review")} />
          </div>
        )}

        {/* ── REVIEW FLASHCARDS ── */}
        {sec === "review" && (
          <div>
            <Sec n="05" title="Phase 3 Full Review — 12 Flashcards" col="#CE93D8" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 20px" }}>
              Flip each card. If any stumps you, go back to that section before Phase 4.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 12, margin: "0 0 36px" }}>
              {flashcards.map((card, i) => {
                const isFlipped = flipped[i];
                return (
                  <div key={i} onClick={() => flipCard(i)} style={{ cursor: "pointer", minHeight: 130 }}>
                    <div style={{
                      border: "1px solid " + (isFlipped ? "#CE93D8" : "#1A1A2E"),
                      borderTop: "3px solid " + (isFlipped ? "#CE93D8" : "#333"),
                      borderRadius: 4, padding: "16px",
                      background: isFlipped ? "rgba(206,147,216,0.06)" : "#0D0D18",
                      transition: "all 0.25s", minHeight: 130,
                      display: "flex", flexDirection: "column",
                    }}>
                      <div style={{ fontSize: 9, color: isFlipped ? "#CE93D8" : "#444", letterSpacing: "0.15em", fontFamily: "monospace", marginBottom: 10, textTransform: "uppercase" }}>
                        {isFlipped ? "ANSWER" : "Q" + String(i + 1).padStart(2, "0")}
                      </div>
                      <div style={{ fontSize: 13, color: isFlipped ? "#AAA" : "#DDD8F0", lineHeight: 1.65, flex: 1 }}>
                        {isFlipped ? card.a : card.q}
                      </div>
                      <div style={{ fontSize: 10, color: "#333", marginTop: 10, textAlign: "right", fontFamily: "monospace" }}>
                        {isFlipped ? "← flip back" : "tap to reveal →"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#DDD8F0", margin: "0 0 12px", borderLeft: "3px solid #CE93D8", paddingLeft: 12 }}>Phase 3 Concept Map</h3>
            <div style={{ border: "1px solid #1A1A2E", borderRadius: 4, overflow: "hidden", margin: "0 0 28px" }}>
              {[
                { part: "Part 1", col: "#B2FF59", topics: ["Python basics: variables, dicts, functions", "Pandas: load, select, groupby, clean, derive", "GitHub Copilot comment-driven coding", "Julius AI, ChatGPT Code Interpreter, PandasAI"] },
                { part: "Part 2", col: "#4FC3F7", topics: ["7-step EDA framework", "6 chart types: histogram, bar, line, scatter, box, heatmap", "ydata-profiling one-line automated report", "Plotly interactive charts, EDA report writing"] },
                { part: "Part 3", col: "#FF8A65", topics: ["pd.merge() — left, inner, outer joins", "pd.pivot_table(), pd.melt() wide-to-long", "Feature engineering: dates, ratios, aggregations", "Scikit-learn pipeline: split, scale, train, evaluate", "H2O AutoML leaderboard", "SHAP summary and force plots"] },
                { part: "Part 4", col: "#B2FF59", topics: ["End-to-end project pipeline", "RFM segmentation in Python", "Churn prediction with Random Forest", "Streamlit web app", "Cloud deployment on Streamlit Cloud", "GitHub portfolio with live link"] },
              ].map((p, i, arr) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 16, padding: "14px 18px", borderBottom: i < arr.length - 1 ? "1px solid #0F0F18" : "none", background: i % 2 === 0 ? "#0A0A14" : "#07070E" }}>
                  <div style={{ minWidth: 56, fontSize: 11, color: p.col, fontFamily: "monospace", fontWeight: 700, paddingTop: 2 }}>{p.part}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {p.topics.map(t => (
                      <span key={t} style={{ padding: "3px 9px", background: p.col + "0D", border: "1px solid " + p.col + "30", borderRadius: 2, fontSize: 11, color: p.col }}>{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <Nav onPrev={() => setSec("rubric")} onNext={() => setSec("next")} />
          </div>
        )}

        {/* ── PHASE 4 PREVIEW ── */}
        {sec === "next" && (
          <div>
            <Sec n="06" title="Phase 3 Complete — What Is Next" col={ACC} />

            <div style={{ padding: "28px 30px", background: "linear-gradient(135deg, rgba(178,255,89,0.07) 0%, transparent 100%)", border: "1px solid " + ACC + "33", borderRadius: 4, marginBottom: 32, textAlign: "center" }}>
              <div style={{ fontSize: 52, marginBottom: 12 }}>🎉</div>
              <h2 style={{ margin: "0 0 10px", fontSize: 26, fontWeight: 900, color: "#DDD8F0" }}>Phase 3 Complete</h2>
              <p style={{ fontSize: 14, color: "#777", lineHeight: 1.8, maxWidth: 500, margin: "0 auto 20px" }}>
                You have gone from Python beginner to building production ML pipelines and deploying web apps. Three phases down. Phase 4 brings everything together — BI tools, cloud platforms, and job-ready career skills.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
                {["Python Fundamentals ✓", "EDA + Visualisation ✓", "ML Pipeline ✓", "SHAP Explainability ✓", "Streamlit App ✓", "3rd Portfolio Project ✓"].map(tag => (
                  <span key={tag} style={{ padding: "5px 14px", background: "rgba(178,255,89,0.08)", border: "1px solid rgba(178,255,89,0.25)", borderRadius: 2, fontSize: 12, color: ACC }}>{tag}</span>
                ))}
              </div>
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#DDD8F0", margin: "0 0 12px", borderLeft: "3px solid " + ACC, paddingLeft: 12 }}>Phase 4 — AI-Enhanced BI and Visualisation (Weeks 11–13)</h3>
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 20px" }}>
              Phase 4 is where analysis meets enterprise. You will master Tableau, Power BI with Copilot, Looker Studio with Gemini, and learn how to present data insights so powerfully that executives make decisions the same day they see your dashboard.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 8, margin: "0 0 24px" }}>
              {[
                { week: "Week 11", title: "Tableau + Einstein AI / Tableau Pulse",    col: "#4FC3F7", topics: ["Tableau calculated fields, LOD expressions", "Tableau Pulse: AI-generated metric narration", "Einstein Copilot: natural language to viz", "Publishing to Tableau Cloud"] },
                { week: "Week 12", title: "Power BI + Microsoft Copilot",             col: "#FFD54F", topics: ["Power Query ETL, DAX measures", "Power BI Copilot: report from text prompt", "Q&A visual: stakeholders query in English", "Publishing and sharing reports"] },
                { week: "Week 13", title: "ThoughtSpot, Looker + AI Narratives",      col: "#FF8A65", topics: ["ThoughtSpot: search-driven analytics", "Looker Studio + Gemini AI", "AI narrative tools for auto-insights", "Building self-service analytics culture"] },
              ].map((w, i) => (
                <div key={i} style={{ border: "1px solid " + w.col + "33", borderLeft: "3px solid " + w.col, borderRadius: 4, padding: "14px 18px", background: "#0D0D18" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                    <span style={{ fontSize: 10, color: w.col, fontFamily: "monospace", letterSpacing: "0.15em" }}>{w.week}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#DDD8F0" }}>{w.title}</span>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {w.topics.map(t => (
                      <span key={t} style={{ padding: "3px 9px", background: w.col + "0D", border: "1px solid " + w.col + "25", borderRadius: 2, fontSize: 11, color: "#777" }}>{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <Box col={ACC} icon="⚡" title="Before You Start Phase 4 — Checklist">
              <div style={{ display: "flex", flexDirection: "column", gap: 5, marginTop: 4 }}>
                {["Phase 3 capstone scored 75+ and GitHub repo is public", "Streamlit app deployed and live URL in your README", "Free Tableau Public account created (public.tableau.com)", "Microsoft 365 account with Power BI Desktop installed", "Google account ready (for Looker Studio + BigQuery)"].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 10 }}>
                    <span style={{ color: ACC, flexShrink: 0 }}>☐</span>
                    <span style={{ fontSize: 13, color: "#777" }}>{item}</span>
                  </div>
                ))}
              </div>
            </Box>

            <div style={{ marginTop: 24, padding: "20px 24px", background: "#0D0D18", border: "1px solid #1A1A2E", borderRadius: 4, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#DDD8F0", marginBottom: 4 }}>Ready to start Phase 4?</div>
                <div style={{ fontSize: 12, color: "#555" }}>Say "Give me Phase 4 Part 1" to continue.</div>
              </div>
              <div style={{ padding: "10px 20px", background: "rgba(178,255,89,0.1)", border: "1px solid rgba(178,255,89,0.3)", borderRadius: 3, fontSize: 12, color: ACC, fontFamily: "monospace", fontWeight: 700 }}>
                PHASE 4 → BI TOOLS + AI
              </div>
            </div>

            <Nav onPrev={() => setSec("review")} />
          </div>
        )}

      </div>
    </div>
  );
}

// ── Shared components ──────────────────────────────────────────
function Sec({ n, title, col }) {
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
      {onPrev
        ? <button onClick={onPrev} style={{ background: "none", border: "1px solid #1A1A2E", borderRadius: 3, padding: "8px 18px", cursor: "pointer", fontFamily: "monospace", fontSize: 11, color: "#555" }}>← Previous</button>
        : <div />}
      {onNext && (
        <button onClick={onNext} style={{ background: "#B2FF59", border: "none", borderRadius: 3, padding: "8px 24px", cursor: "pointer", fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: "#07070E" }}>{nxt}</button>
      )}
    </div>
  );
}
