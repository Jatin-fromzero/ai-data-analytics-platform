import { useState } from "react";

// ── All code stored as plain string arrays to avoid JS template literal conflicts ──

const MERGE_CODE = [
  "import pandas as pd",
  "",
  "orders   = pd.read_csv('data/orders.csv')",
  "customers= pd.read_csv('data/customers.csv')",
  "products = pd.read_csv('data/products.csv')",
  "",
  "# Inner join — only rows matching in BOTH tables",
  "inner = pd.merge(orders, customers, on='customer_id', how='inner')",
  "",
  "# Left join — all orders, customer info where available",
  "left = pd.merge(orders, customers, on='customer_id', how='left')",
  "",
  "# Multi-table join: orders + customers + products",
  "full = (orders",
  "        .merge(customers, on='customer_id', how='left')",
  "        .merge(products,  on='product_id',  how='left'))",
  "",
  "print(full.shape)",
  "print(full.columns.tolist())",
].join("\n");

const PIVOT_CODE = [
  "import pandas as pd",
  "",
  "df = pd.read_csv('data/orders.csv')",
  "df['revenue'] = df['units'] * df['price']",
  "",
  "# pivot_table: revenue by region (rows) x category (cols)",
  "pivot = pd.pivot_table(",
  "    df[df['status']=='Completed'],",
  "    values='revenue',",
  "    index='region',",
  "    columns='category',",
  "    aggfunc='sum',",
  "    fill_value=0",
  ")",
  "print(pivot.round(0))",
  "",
  "# Add row and column totals",
  "pivot['TOTAL'] = pivot.sum(axis=1)",
  "pivot.loc['TOTAL'] = pivot.sum()",
  "print(pivot.round(0))",
].join("\n");

const MELT_CODE = [
  "import pandas as pd",
  "",
  "# Wide format: one row per product, Q1 Q2 Q3 Q4 as columns",
  "wide = pd.DataFrame({",
  "    'product':['Headphones','Speaker','Keyboard'],",
  "    'Q1':[12000, 8000, 5000],",
  "    'Q2':[15000, 9000, 6000],",
  "    'Q3':[11000, 7500, 5500],",
  "    'Q4':[18000,11000, 7000],",
  "})",
  "",
  "# Melt to long format: one row per product-quarter combination",
  "long = pd.melt(",
  "    wide,",
  "    id_vars=['product'],",
  "    value_vars=['Q1','Q2','Q3','Q4'],",
  "    var_name='quarter',",
  "    value_name='revenue'",
  ")",
  "print(long.head(8))",
  "# Long format is required for Seaborn/Plotly grouped charts",
].join("\n");

const FEATURE_CODE = [
  "import pandas as pd",
  "import numpy as np",
  "",
  "df = pd.read_csv('data/orders.csv')",
  "df['order_date'] = pd.to_datetime(df['order_date'])",
  "",
  "# ── Date features ──────────────────────────────────────",
  "df['year']        = df['order_date'].dt.year",
  "df['month']       = df['order_date'].dt.month",
  "df['quarter']     = df['order_date'].dt.quarter",
  "df['day_of_week'] = df['order_date'].dt.dayofweek  # 0=Mon",
  "df['is_weekend']  = df['day_of_week'].isin([5, 6]).astype(int)",
  "",
  "# ── Business metrics ────────────────────────────────────",
  "df['revenue']     = df['units'] * df['price']",
  "df['profit']      = df['units'] * (df['price'] - df['cost'])",
  "df['margin_pct']  = (df['profit'] / df['revenue'] * 100).round(2)",
  "df['is_returned'] = (df['status'] == 'Returned').astype(int)",
  "",
  "# ── Customer-level aggregated features ──────────────────",
  "cust = df[df['status']=='Completed'].groupby('customer_id').agg(",
  "    total_orders   = ('order_id',  'count'),",
  "    total_revenue  = ('revenue',   'sum'),",
  "    avg_order_val  = ('revenue',   'mean'),",
  "    recency_days   = ('order_date',",
  "        lambda x: (pd.Timestamp.today() - x.max()).days),",
  ").reset_index()",
  "",
  "print(cust.head())",
].join("\n");

const SKLEARN_CODE = [
  "import pandas as pd",
  "import numpy as np",
  "from sklearn.model_selection import train_test_split",
  "from sklearn.preprocessing import StandardScaler, LabelEncoder",
  "from sklearn.linear_model import LogisticRegression",
  "from sklearn.ensemble import RandomForestClassifier",
  "from sklearn.metrics import (classification_report,",
  "                              accuracy_score, roc_auc_score)",
  "",
  "df = pd.read_csv('data/customers_features.csv')",
  "",
  "# ── Prepare features ────────────────────────────────────",
  "X = df[['recency_days','total_orders','total_revenue',",
  "        'avg_order_val','days_since_first_order']]",
  "y = df['churned']   # 1 = churned, 0 = active",
  "",
  "# ── Split 80 / 20 ───────────────────────────────────────",
  "X_train, X_test, y_train, y_test = train_test_split(",
  "    X, y, test_size=0.2, random_state=42, stratify=y",
  ")",
  "",
  "# ── Scale features ──────────────────────────────────────",
  "scaler  = StandardScaler()",
  "X_train = scaler.fit_transform(X_train)",
  "X_test  = scaler.transform(X_test)",
  "",
  "# ── Train two models ────────────────────────────────────",
  "lr = LogisticRegression(random_state=42)",
  "rf = RandomForestClassifier(n_estimators=100, random_state=42)",
  "lr.fit(X_train, y_train)",
  "rf.fit(X_train, y_train)",
  "",
  "# ── Evaluate ────────────────────────────────────────────",
  "for name, model in [('Logistic Regression', lr),",
  "                    ('Random Forest',       rf)]:",
  "    y_pred = model.predict(X_test)",
  "    print(f'{name}')",
  "    print(f'  Accuracy : {accuracy_score(y_test, y_pred):.3f}')",
  "    print(f'  ROC-AUC  : {roc_auc_score(y_test, y_pred):.3f}')",
  "    print(classification_report(y_test, y_pred))",
].join("\n");

const AUTOML_CODE = [
  "import h2o",
  "from h2o.automl import H2OAutoML",
  "import pandas as pd",
  "",
  "# Start H2O cluster",
  "h2o.init()",
  "",
  "# Convert pandas DataFrame to H2O Frame",
  "df = pd.read_csv('data/customers_features.csv')",
  "hf = h2o.H2OFrame(df)",
  "",
  "# Define features and target",
  "x = ['recency_days','total_orders','total_revenue',",
  "     'avg_order_val','days_since_first_order']",
  "y = 'churned'",
  "hf[y] = hf[y].asfactor()   # treat as classification",
  "",
  "# Split train / test",
  "train, test = hf.split_frame(ratios=[0.8], seed=42)",
  "",
  "# Run AutoML — trains up to 20 models in 120 seconds",
  "aml = H2OAutoML(max_models=20, max_runtime_secs=120,",
  "                seed=42, sort_metric='AUC')",
  "aml.train(x=x, y=y, training_frame=train)",
  "",
  "# Leaderboard: all models ranked by AUC",
  "print(aml.leaderboard.head(10))",
  "",
  "# Best model performance on test set",
  "perf = aml.leader.model_performance(test)",
  "print('Best AUC:', perf.auc())",
].join("\n");

const SHAP_CODE = [
  "import shap",
  "import pandas as pd",
  "import matplotlib.pyplot as plt",
  "from sklearn.ensemble import RandomForestClassifier",
  "",
  "df = pd.read_csv('data/customers_features.csv')",
  "feature_cols = ['recency_days','total_orders',",
  "                'total_revenue','avg_order_val']",
  "X = df[feature_cols]",
  "y = df['churned']",
  "",
  "model = RandomForestClassifier(n_estimators=100, random_state=42)",
  "model.fit(X, y)",
  "",
  "# ── SHAP values ─────────────────────────────────────────",
  "explainer   = shap.TreeExplainer(model)",
  "shap_values = explainer.shap_values(X)",
  "",
  "# Summary plot: feature importance + direction",
  "shap.summary_plot(shap_values[1], X, plot_type='bar')",
  "plt.title('What drives churn? (SHAP feature importance)')",
  "plt.show()",
  "",
  "# Explain ONE customer prediction",
  "idx = 0   # first customer",
  "shap.force_plot(",
  "    explainer.expected_value[1],",
  "    shap_values[1][idx],",
  "    X.iloc[idx],",
  "    matplotlib=True",
  ")",
  "plt.show()",
  "# Output: 'recency_days=120 pushed churn probability UP by 0.23'",
].join("\n");

const PRACTICE_SOLUTIONS = {
  p1: [
    "import pandas as pd",
    "",
    "orders   = pd.read_csv('data/orders.csv')",
    "customers= pd.read_csv('data/customers.csv')",
    "",
    "# Merge",
    "merged = pd.merge(orders, customers,",
    "                  on='customer_id', how='left')",
    "print('Rows:', len(merged))",
    "print('Cols:', merged.columns.tolist())",
    "",
    "# Revenue column",
    "merged['revenue'] = merged['units'] * merged['price']",
    "",
    "# Pivot: revenue by country x category",
    "pivot = pd.pivot_table(",
    "    merged[merged['status']=='Completed'],",
    "    values='revenue',",
    "    index='country',",
    "    columns='category',",
    "    aggfunc='sum',",
    "    fill_value=0",
    ").round(0)",
    "",
    "pivot['TOTAL'] = pivot.sum(axis=1)",
    "pivot = pivot.sort_values('TOTAL', ascending=False)",
    "print(pivot)",
  ].join("\n"),

  p2: [
    "import pandas as pd",
    "import numpy as np",
    "",
    "df = pd.read_csv('data/orders.csv')",
    "df['order_date'] = pd.to_datetime(df['order_date'])",
    "df['revenue']    = df['units'] * df['price']",
    "df['cost_total'] = df['units'] * df['cost']",
    "",
    "# Date features",
    "df['month']      = df['order_date'].dt.month",
    "df['quarter']    = df['order_date'].dt.quarter",
    "df['is_weekend'] = df['order_date'].dt.dayofweek.isin([5,6]).astype(int)",
    "",
    "# Business features",
    "df['margin_pct'] = ((df['revenue'] - df['cost_total'])",
    "                    / df['revenue'] * 100).round(2)",
    "df['is_returned']= (df['status']=='Returned').astype(int)",
    "",
    "# High-value flag",
    "df['is_high_value'] = np.where(df['revenue'] > 300, 1, 0)",
    "",
    "print(df[['order_id','revenue','margin_pct',",
    "          'is_weekend','is_high_value']].head(10))",
    "print('High-value orders:', df['is_high_value'].sum())",
  ].join("\n"),

  p3: [
    "import pandas as pd",
    "import numpy as np",
    "from sklearn.model_selection import train_test_split",
    "from sklearn.ensemble import RandomForestClassifier",
    "from sklearn.preprocessing import StandardScaler",
    "from sklearn.metrics import (classification_report,",
    "                              roc_auc_score, accuracy_score)",
    "",
    "df = pd.read_csv('data/orders.csv')",
    "df['order_date'] = pd.to_datetime(df['order_date'])",
    "df['revenue']    = df['units'] * df['price']",
    "",
    "# Build customer features",
    "ref_date = df['order_date'].max()",
    "cust = df[df['status']=='Completed'].groupby('customer_id').agg(",
    "    recency   = ('order_date',",
    "        lambda x: (ref_date - x.max()).days),",
    "    frequency = ('order_id', 'count'),",
    "    monetary  = ('revenue',  'sum'),",
    ").reset_index()",
    "",
    "# Simulate churn label (recency > 90 days = churned)",
    "cust['churned'] = (cust['recency'] > 90).astype(int)",
    "",
    "X = cust[['recency','frequency','monetary']]",
    "y = cust['churned']",
    "",
    "X_train, X_test, y_train, y_test = train_test_split(",
    "    X, y, test_size=0.2, random_state=42)",
    "",
    "sc = StandardScaler()",
    "X_tr = sc.fit_transform(X_train)",
    "X_te = sc.transform(X_test)",
    "",
    "rf = RandomForestClassifier(n_estimators=100, random_state=42)",
    "rf.fit(X_tr, y_train)",
    "",
    "y_pred = rf.predict(X_te)",
    "print('Accuracy:', round(accuracy_score(y_test, y_pred), 3))",
    "print('ROC-AUC :', round(roc_auc_score(y_test, y_pred), 3))",
    "print(classification_report(y_test, y_pred))",
    "",
    "# Feature importance",
    "for feat, imp in sorted(zip(X.columns,",
    "    rf.feature_importances_), key=lambda x: -x[1]):",
    "    print(f'  {feat}: {imp:.3f}')",
  ].join("\n"),
};

const quizData = [
  {
    q: "What does pd.merge(orders, customers, on='customer_id', how='left') return?",
    opts: [
      "Only orders that have a matching customer record",
      "All orders, with customer columns filled where a match exists and NaN where no match",
      "All customers, with order columns where available",
      "The intersection of both tables"
    ],
    ans: 1,
    exp: "LEFT join returns ALL rows from the LEFT table (orders) plus matching columns from the right (customers). Orders with no matching customer get NaN in customer columns. This is the most common analytics merge — keep all transactions, attach dimensions where available."
  },
  {
    q: "What does pd.pivot_table(df, values='revenue', index='region', columns='category', aggfunc='sum') produce?",
    opts: [
      "A flat list of revenue values",
      "A 2D table with regions as rows, categories as columns, and total revenue at each intersection",
      "A sorted bar chart",
      "A correlation matrix between region and category"
    ],
    ans: 1,
    exp: "pivot_table creates a cross-tabulation — rows = unique values of index, columns = unique values of columns, values = aggregated metric. It is the pandas equivalent of an Excel PivotTable and answers 'how does revenue break down by region AND category simultaneously?'"
  },
  {
    q: "You have monthly revenue in 'wide' format with columns Q1, Q2, Q3, Q4. You need it 'long' for a Seaborn chart. Which function do you use?",
    opts: ["df.transpose()", "pd.pivot_table()", "pd.melt()", "df.stack()"],
    ans: 2,
    exp: "pd.melt() converts wide format (one column per time period) to long format (one row per observation). Long format is required by Seaborn, Plotly, and most ML libraries. id_vars stays as columns, value_vars become rows with var_name and value_name columns."
  },
  {
    q: "Why do you call scaler.fit_transform(X_train) but only scaler.transform(X_test)?",
    opts: [
      "fit_transform is faster — use it whenever you can",
      "The scaler must learn statistics (mean, std) from training data only — applying those same statistics to test data prevents data leakage",
      "transform() does not work on test data",
      "It makes no difference which you use"
    ],
    ans: 1,
    exp: "Data leakage: if you fit the scaler on test data, the model indirectly 'sees' test set statistics during training. fit_transform() learns mean/std from training data only. transform() then applies those exact same statistics to test data. This gives an honest estimate of real-world performance."
  },
  {
    q: "What is the main advantage of H2O AutoML over manually training one model?",
    opts: [
      "It always produces a perfect model with 100% accuracy",
      "It trains and compares dozens of model types and hyperparameter combinations automatically, finding the best without manual tuning",
      "It does not require any data preparation",
      "It only works with structured data under 1000 rows"
    ],
    ans: 1,
    exp: "AutoML trains many model types (Random Forest, GBM, XGBoost, Neural Net, etc.) with many hyperparameter combinations simultaneously. It handles cross-validation and produces a ranked leaderboard. For analysts, it finds a strong baseline model in minutes without needing ML expertise."
  },
  {
    q: "A SHAP summary plot shows 'recency_days' with a high positive SHAP value. What does this tell you?",
    opts: [
      "Recency days has no effect on the prediction",
      "High recency_days (not purchasing recently) pushes the churn prediction HIGHER",
      "Low recency_days causes churn",
      "The feature should be removed from the model"
    ],
    ans: 1,
    exp: "SHAP values show both the magnitude AND direction of each feature's impact on the prediction. A positive SHAP value means the feature INCREASES the predicted probability (in this case, churn). High recency_days = customer has not bought recently = SHAP pushes prediction toward 'churned'."
  },
];

const sections = [
  { id: "intro",    label: "Overview"    },
  { id: "merge",    label: "Merging"     },
  { id: "pivot",    label: "Pivot"       },
  { id: "features", label: "Features"    },
  { id: "sklearn",  label: "Scikit-learn"},
  { id: "automl",   label: "AutoML"      },
  { id: "shap",     label: "SHAP"        },
  { id: "practice", label: "Practice"    },
  { id: "quiz",     label: "Quiz"        },
];

export default function Phase3Part3() {
  const [sec, setSec] = useState("intro");
  const [openEx, setOpenEx] = useState(null);
  const [quiz, setQuiz] = useState({ idx: 0, sel: null, done_q: false, score: 0, finished: false });

  const answerQ = (i) => {
    if (quiz.done_q) return;
    setQuiz(q => ({ ...q, sel: i, done_q: true, score: q.score + (i === quizData[q.idx].ans ? 1 : 0) }));
  };
  const nextQ = () => {
    if (quiz.idx + 1 >= quizData.length) setQuiz(q => ({ ...q, finished: true }));
    else setQuiz(q => ({ ...q, idx: q.idx + 1, sel: null, done_q: false }));
  };

  const ACC = "#FF8A65";

  return (
    <div style={{ minHeight: "100vh", background: "#07070E", color: "#DDD8F0", fontFamily: "Georgia, serif" }}>

      {/* NAV */}
      <div style={{ background: "#0A0A14", borderBottom: "1px solid #16162A", padding: "0 24px", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 940, margin: "0 auto", display: "flex", alignItems: "center", overflowX: "auto" }}>
          <div style={{ fontSize: 10, color: ACC, letterSpacing: "0.2em", textTransform: "uppercase", padding: "14px 20px 14px 0", borderRight: "1px solid #1A1A2E", marginRight: 12, whiteSpace: "nowrap" }}>
            P3 · PART 3
          </div>
          {sections.map(s => (
            <button key={s.id} onClick={() => setSec(s.id)} style={{
              background: "none", border: "none", cursor: "pointer",
              padding: "14px 11px", fontFamily: "inherit", fontSize: 11,
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
                PHASE 3 · PART 3 OF 4 · WEEK 9-10
              </div>
              <h1 style={{ fontSize: "clamp(26px,5vw,44px)", fontWeight: 900, margin: "0 0 16px", lineHeight: 1.12, letterSpacing: "-0.02em" }}>
                Data Wrangling<br />
                <span style={{ color: ACC }}>+ Machine Learning</span><br />
                <span style={{ fontStyle: "italic", fontWeight: 400, fontSize: "0.65em", color: "#555" }}>for Data Analysts</span>
              </h1>
              <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, maxWidth: 580, margin: "0 0 24px" }}>
                Part 3 covers the skills that take you from analyst to data scientist territory. You will master merging DataFrames, building pivot tables, engineering features, training classification models with Scikit-learn, automating ML with H2O AutoML, and explaining predictions with SHAP — all with AI pair programming throughout.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {["~5 hours", "Merging DataFrames", "Pivot tables", "Feature engineering", "Scikit-learn", "H2O AutoML", "SHAP explainability", "3 practice tasks", "6-question quiz"].map(t => (
                  <span key={t} style={{ padding: "4px 12px", background: "rgba(255,138,101,0.08)", border: "1px solid rgba(255,138,101,0.22)", borderRadius: 2, fontSize: 11, color: ACC }}>{t}</span>
                ))}
              </div>
            </div>

            <Sec n="00" title="What You Will Learn" col={ACC} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px,1fr))", gap: 10, margin: "24px 0 36px" }}>
              {[
                { icon: "🔗", title: "Merging DataFrames",    desc: "pd.merge with left/inner/outer — multi-table joins, handling NaNs", col: "#4FC3F7",  s: "merge"    },
                { icon: "📋", title: "Pivot Tables",          desc: "pd.pivot_table, melt, wide vs long format, cross-tabulations",     col: "#81C784",  s: "pivot"    },
                { icon: "⚙️", title: "Feature Engineering",   desc: "Date features, business metrics, customer-level aggregations",    col: "#FFD54F",  s: "features" },
                { icon: "🤖", title: "Scikit-learn",          desc: "Train/test split, scaling, Logistic Regression, Random Forest",   col: "#CE93D8",  s: "sklearn"  },
                { icon: "⚡", title: "H2O AutoML",            desc: "Train 20 models in 2 minutes — leaderboard, best model export",   col: "#FFA500",  s: "automl"   },
                { icon: "🔍", title: "SHAP Explainability",   desc: "Feature importance + direction — explain any prediction in English", col: "#80DEEA",  s: "shap"     },
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

            <Box col={ACC} icon="💼" title="Why Analysts Need ML in 2025">
              ML has moved from data scientist territory into analyst territory. Companies expect analysts to build basic predictive models — churn prediction, revenue forecasting, customer segmentation. You do not need to be a mathematician. You need to understand what the model does, when to use it, and how to explain its predictions to stakeholders. That is exactly what this part teaches.
            </Box>
            <Nav onNext={() => setSec("merge")} />
          </div>
        )}

        {/* ── MERGE ── */}
        {sec === "merge" && (
          <div>
            <Sec n="01" title="Merging DataFrames" col="#4FC3F7" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 16px" }}>
              Real analytics always involves multiple tables. <strong style={{ color: "#DDD8F0" }}>pd.merge() is the pandas equivalent of SQL JOIN</strong>. Mastering it lets you connect orders to customers, products to categories, and any fact table to its dimension tables.
            </p>

            <Code col="#4FC3F7" label="MERGING — LEFT JOIN, INNER JOIN, MULTI-TABLE" code={MERGE_CODE} />

            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#DDD8F0", margin: "28px 0 12px", borderLeft: "3px solid #4FC3F7", paddingLeft: 12 }}>Merge Types — Quick Reference</h3>
            <div style={{ border: "1px solid #1A1A2E", borderRadius: 4, overflow: "hidden", margin: "0 0 20px" }}>
              {[
                { how: "inner", returns: "Only rows matching in BOTH tables",            use: "You only want clean, matched records",           col: "#4FC3F7" },
                { how: "left",  returns: "All rows from left + matches from right (NaN where no match)", use: "Keep all transactions, add dimension data where available", col: "#81C784" },
                { how: "right", returns: "All rows from right + matches from left",      use: "Rarely used — rewrite as left with tables swapped", col: "#FFD54F" },
                { how: "outer", returns: "All rows from BOTH tables",                   use: "Full audit — find unmatched records on either side", col: "#FF8A65" },
              ].map((r, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "80px 1fr 1fr", gap: 14, padding: "11px 16px", borderBottom: i < 3 ? "1px solid #0F0F18" : "none", background: i % 2 === 0 ? "#0A0A14" : "#07070E", alignItems: "start" }}>
                  <code style={{ fontSize: 12, color: r.col, fontFamily: "monospace", fontWeight: 700 }}>{r.how}</code>
                  <span style={{ fontSize: 12, color: "#888" }}>{r.returns}</span>
                  <span style={{ fontSize: 12, color: "#555", fontStyle: "italic" }}>{r.use}</span>
                </div>
              ))}
            </div>

            <Box col="#FFD54F" icon="⚠️" title="Most Common Merge Mistake">
              Always check <code style={{ fontFamily: "monospace", color: "#FFD54F" }}>len(df_before)</code> vs <code style={{ fontFamily: "monospace", color: "#FFD54F" }}>len(df_after)</code> after merging. If the row count unexpectedly exploded, you have duplicate keys — one-to-many relationships creating a Cartesian product. Always verify with <code style={{ fontFamily: "monospace", color: "#FFD54F" }}>df['key_col'].is_unique</code> before merging.
            </Box>

            <Box col="#CE93D8" icon="🤖" title="AI Prompt for Merging">
              "I have two pandas DataFrames: orders with columns order_id, customer_id, product_id, revenue, status — and customers with customer_id, name, country, segment. Write a left merge that keeps all orders and adds customer name and country. Then check for NaN values in the joined columns."
            </Box>
            <Nav onPrev={() => setSec("intro")} onNext={() => setSec("pivot")} />
          </div>
        )}

        {/* ── PIVOT ── */}
        {sec === "pivot" && (
          <div>
            <Sec n="02" title="Pivot Tables and Data Reshaping" col="#81C784" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 16px" }}>
              <strong style={{ color: "#DDD8F0" }}>pd.pivot_table() is the Python equivalent of an Excel PivotTable</strong> — it cross-tabulates two categorical dimensions against a metric. pd.melt() does the reverse: converts wide format to long format, which is required by most visualisation and ML libraries.
            </p>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#DDD8F0", margin: "0 0 12px", borderLeft: "3px solid #81C784", paddingLeft: 12 }}>pivot_table — Cross-Tabulation</h3>
            <Code col="#81C784" label="PIVOT TABLE WITH ROW AND COLUMN TOTALS" code={PIVOT_CODE} />

            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#DDD8F0", margin: "28px 0 12px", borderLeft: "3px solid #FFD54F", paddingLeft: 12 }}>pd.melt() — Wide to Long Format</h3>
            <Code col="#FFD54F" label="MELT — RESHAPE FOR SEABORN AND PLOTLY" code={MELT_CODE} />

            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#DDD8F0", margin: "28px 0 12px", borderLeft: "3px solid #81C784", paddingLeft: 12 }}>Wide vs Long Format</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, margin: "0 0 20px" }}>
              <div style={{ border: "1px solid #4FC3F733", borderRadius: 4, padding: "14px", background: "rgba(79,195,247,0.04)" }}>
                <div style={{ fontSize: 12, color: "#4FC3F7", fontWeight: 700, marginBottom: 10 }}>WIDE format</div>
                <div style={{ fontFamily: "monospace", fontSize: 11, color: "#888", lineHeight: 2 }}>
                  product | Q1 | Q2 | Q3 | Q4<br />
                  Headphones | 12K | 15K | 11K | 18K<br />
                  Speaker | 8K | 9K | 7.5K | 11K
                </div>
                <div style={{ fontSize: 11, color: "#555", marginTop: 8 }}>Good for: Excel, pivot tables, human reading</div>
              </div>
              <div style={{ border: "1px solid #81C78433", borderRadius: 4, padding: "14px", background: "rgba(129,199,132,0.04)" }}>
                <div style={{ fontSize: 12, color: "#81C784", fontWeight: 700, marginBottom: 10 }}>LONG format</div>
                <div style={{ fontFamily: "monospace", fontSize: 11, color: "#888", lineHeight: 2 }}>
                  product | quarter | revenue<br />
                  Headphones | Q1 | 12K<br />
                  Headphones | Q2 | 15K<br />
                  Speaker | Q1 | 8K
                </div>
                <div style={{ fontSize: 11, color: "#555", marginTop: 8 }}>Good for: Seaborn, Plotly, Scikit-learn, SQL</div>
              </div>
            </div>
            <Nav onPrev={() => setSec("merge")} onNext={() => setSec("features")} />
          </div>
        )}

        {/* ── FEATURES ── */}
        {sec === "features" && (
          <div>
            <Sec n="03" title="Feature Engineering" col="#FFD54F" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 16px" }}>
              Feature engineering is the process of <strong style={{ color: "#DDD8F0" }}>creating new columns from existing data that better represent the patterns you want the model to learn</strong>. It is the most impactful step in any ML project — better features beat better algorithms every time.
            </p>

            <Code col="#FFD54F" label="DATE FEATURES, BUSINESS METRICS AND CUSTOMER AGGREGATIONS" code={FEATURE_CODE} />

            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#DDD8F0", margin: "28px 0 12px", borderLeft: "3px solid #FFD54F", paddingLeft: 12 }}>Common Feature Types</h3>
            <div style={{ border: "1px solid #1A1A2E", borderRadius: 4, overflow: "hidden", margin: "0 0 20px" }}>
              {[
                { type: "Date decomposition", ex: "year, month, quarter, day_of_week, is_weekend, days_since_event", col: "#4FC3F7" },
                { type: "Ratio features",     ex: "margin_pct = profit / revenue, return_rate = returned / total", col: "#81C784" },
                { type: "Binary flags",       ex: "is_returned, is_high_value, is_new_customer, is_weekend", col: "#FFD54F" },
                { type: "Customer aggregates", ex: "recency_days, total_orders, avg_order_value, lifetime_revenue", col: "#FF8A65" },
                { type: "Lag features",        ex: "last_month_revenue, days_since_last_order, prev_order_value", col: "#CE93D8" },
                { type: "Binning",             ex: "revenue_tier = cut(revenue, bins=[0,100,500,1000,inf])", col: "#80DEEA" },
              ].map((r, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: 14, padding: "10px 16px", borderBottom: i < 5 ? "1px solid #0F0F18" : "none", background: i % 2 === 0 ? "#0A0A14" : "#07070E", alignItems: "start" }}>
                  <span style={{ fontSize: 12, color: r.col, fontWeight: 700 }}>{r.type}</span>
                  <code style={{ fontSize: 11, color: "#666", fontFamily: "monospace", lineHeight: 1.6 }}>{r.ex}</code>
                </div>
              ))}
            </div>

            <Box col="#CE93D8" icon="🤖" title="AI Prompt for Feature Engineering">
              "I have a pandas DataFrame with columns: customer_id, order_date, product_id, units, price, cost, status. I want to predict customer churn. What features should I engineer? Write the pandas code to create them from this raw orders table."
            </Box>
            <Nav onPrev={() => setSec("pivot")} onNext={() => setSec("sklearn")} />
          </div>
        )}

        {/* ── SKLEARN ── */}
        {sec === "sklearn" && (
          <div>
            <Sec n="04" title="Machine Learning with Scikit-learn" col="#CE93D8" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 16px" }}>
              Scikit-learn is the standard Python ML library. It provides a <strong style={{ color: "#DDD8F0" }}>consistent API across all algorithms</strong> — every model has .fit(), .predict(), and .score(). Master the workflow once and it applies to any model.
            </p>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#DDD8F0", margin: "0 0 12px", borderLeft: "3px solid #CE93D8", paddingLeft: 12 }}>The ML Workflow</h3>
            <div style={{ border: "1px solid #1A1A2E", borderRadius: 4, overflow: "hidden", margin: "0 0 20px" }}>
              {[
                { step: "01", action: "Prepare X and y", detail: "X = feature matrix (all input columns). y = target vector (what you predict)", col: "#4FC3F7" },
                { step: "02", action: "Train / test split", detail: "train_test_split(X, y, test_size=0.2) — never evaluate on training data", col: "#81C784" },
                { step: "03", action: "Scale features", detail: "StandardScaler: fit on train only, transform both. Prevents data leakage.", col: "#FFD54F" },
                { step: "04", action: "Train model", detail: "model.fit(X_train, y_train) — the model learns patterns from training data", col: "#FF8A65" },
                { step: "05", action: "Evaluate on test", detail: "model.predict(X_test) — compare predictions to actual y_test values", col: "#CE93D8" },
                { step: "06", action: "Report metrics", detail: "Accuracy, Precision, Recall, F1, ROC-AUC — choose based on business context", col: "#80DEEA" },
              ].map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 14, padding: "11px 16px", borderBottom: i < 5 ? "1px solid #0F0F18" : "none", background: i % 2 === 0 ? "#0A0A14" : "#07070E", alignItems: "start" }}>
                  <div style={{ width: 26, height: 26, borderRadius: "50%", background: s.col + "18", border: "1px solid " + s.col + "44", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: 10, color: s.col, fontFamily: "monospace", fontWeight: 700 }}>{s.step}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#DDD8F0" }}>{s.action}</div>
                    <div style={{ fontSize: 12, color: "#666", marginTop: 3 }}>{s.detail}</div>
                  </div>
                </div>
              ))}
            </div>

            <Code col="#CE93D8" label="COMPLETE CHURN PREDICTION PIPELINE" code={SKLEARN_CODE} />

            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#DDD8F0", margin: "28px 0 12px", borderLeft: "3px solid #CE93D8", paddingLeft: 12 }}>Evaluation Metrics — Which to Use When</h3>
            <div style={{ border: "1px solid #1A1A2E", borderRadius: 4, overflow: "hidden", margin: "0 0 20px" }}>
              {[
                { metric: "Accuracy",  formula: "Correct / Total", when: "Classes are balanced — equal churn/active customers", col: "#4FC3F7" },
                { metric: "Precision", formula: "True Pos / (True Pos + False Pos)", when: "Cost of false alarms is high — marketing budget is limited", col: "#81C784" },
                { metric: "Recall",    formula: "True Pos / (True Pos + False Neg)", when: "Missing a true case is costly — missing a churner to win back", col: "#FFD54F" },
                { metric: "F1 Score",  formula: "Harmonic mean of Precision + Recall", when: "Class imbalance — churn is rare (5% of customers)", col: "#FF8A65" },
                { metric: "ROC-AUC",   formula: "Area under ROC curve (0.5–1.0)", when: "Overall discriminative ability — higher is better, above 0.8 is good", col: "#CE93D8" },
              ].map((r, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "90px 1fr 1fr", gap: 12, padding: "10px 16px", borderBottom: i < 4 ? "1px solid #0F0F18" : "none", background: i % 2 === 0 ? "#0A0A14" : "#07070E", alignItems: "start" }}>
                  <span style={{ fontSize: 12, color: r.col, fontWeight: 700 }}>{r.metric}</span>
                  <code style={{ fontSize: 11, color: "#666", fontFamily: "monospace" }}>{r.formula}</code>
                  <span style={{ fontSize: 12, color: "#555", fontStyle: "italic" }}>{r.when}</span>
                </div>
              ))}
            </div>
            <Nav onPrev={() => setSec("features")} onNext={() => setSec("automl")} />
          </div>
        )}

        {/* ── AUTOML ── */}
        {sec === "automl" && (
          <div>
            <Sec n="05" title="H2O AutoML — Train 20 Models Automatically" col="#FFA500" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 16px" }}>
              H2O AutoML is the most powerful free AutoML library available. Give it your data and a time budget and it <strong style={{ color: "#DDD8F0" }}>trains and evaluates dozens of model types and hyperparameter combinations simultaneously</strong>, returning a ranked leaderboard with the best model ready to deploy. For analysts, it delivers data-scientist-level results in minutes.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, margin: "0 0 20px" }}>
              {[
                { stat: "20+", label: "model types trained", col: "#FFA500" },
                { stat: "2 min", label: "to find best model", col: "#4FC3F7" },
                { stat: "Free", label: "open source, no cost", col: "#81C784" },
              ].map((s, i) => (
                <div key={i} style={{ border: "1px solid " + s.col + "33", borderRadius: 4, padding: "16px", background: s.col + "06", textAlign: "center" }}>
                  <div style={{ fontSize: 26, fontWeight: 900, color: s.col, marginBottom: 4 }}>{s.stat}</div>
                  <div style={{ fontSize: 12, color: "#666" }}>{s.label}</div>
                </div>
              ))}
            </div>

            <Code col="#FFA500" label="H2O AUTOML — COMPLETE PIPELINE" code={AUTOML_CODE} />

            <Box col="#FFA500" icon="💡" title="Install H2O">
              Run in terminal: pip install h2o — then import h2o; h2o.init() starts a local Java-based server. Requires Java 8 or 11. If Java is missing: conda install openjdk and try again.
            </Box>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#DDD8F0", margin: "28px 0 12px", borderLeft: "3px solid #FFA500", paddingLeft: 12 }}>AutoML Leaderboard — How to Read It</h3>
            <div style={{ background: "#07070E", border: "1px solid #FFA50033", borderRadius: 4, overflow: "hidden", margin: "0 0 20px" }}>
              <div style={{ padding: "8px 14px", borderBottom: "1px solid #1A1A2E" }}>
                <span style={{ fontSize: 9, color: "#FFA500", fontFamily: "monospace", fontWeight: 700, letterSpacing: "0.1em" }}>EXAMPLE LEADERBOARD OUTPUT</span>
              </div>
              <pre style={{ margin: 0, padding: "14px 16px", fontSize: 12, color: "#FFA500", fontFamily: "monospace", lineHeight: 1.75 }}>{[
                "model_id                           AUC    logloss",
                "StackedEnsemble_AllModels_...      0.921  0.241",
                "StackedEnsemble_BestOfFamily_...   0.918  0.248",
                "GBM_grid_1_AutoML_model_2          0.912  0.259",
                "XGBoost_grid_1_AutoML_model_1      0.908  0.263",
                "GBM_1_AutoML                       0.903  0.271",
                "RandomForest_1_AutoML              0.897  0.284",
                "DeepLearning_1_AutoML              0.881  0.301",
                "GLM_1_AutoML                       0.856  0.328",
              ].join("\n")}</pre>
            </div>

            <Box col="#CE93D8" icon="🤖" title="AI Prompt for AutoML">
              "I want to use H2O AutoML to predict customer churn. My DataFrame has these columns: recency_days, total_orders, total_revenue, avg_order_val, churned (0/1). Walk me through the full H2O AutoML setup, training, evaluating the best model, and saving it to disk. Use Python."
            </Box>
            <Nav onPrev={() => setSec("sklearn")} onNext={() => setSec("shap")} />
          </div>
        )}

        {/* ── SHAP ── */}
        {sec === "shap" && (
          <div>
            <Sec n="06" title="SHAP — Explain Any Model Prediction" col="#80DEEA" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 16px" }}>
              SHAP (SHapley Additive exPlanations) answers the question every stakeholder asks after you show them a model: <strong style={{ color: "#DDD8F0" }}>"Why did it predict that?"</strong> SHAP assigns a contribution score to each feature for every prediction — showing both magnitude AND direction.
            </p>

            <div style={{ background: "#07070E", border: "1px solid #80DEEA33", borderRadius: 4, padding: "18px 20px", margin: "0 0 20px" }}>
              <div style={{ fontSize: 10, color: "#80DEEA", fontFamily: "monospace", letterSpacing: "0.12em", marginBottom: 12 }}>HOW TO READ A SHAP VALUE</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { feature: "recency_days = 120", shap: "+0.31", meaning: "Not buying recently INCREASES churn probability by 0.31", col: "#FF8A65" },
                  { feature: "total_orders = 12",  shap: "-0.18", meaning: "High order frequency DECREASES churn probability by 0.18", col: "#81C784" },
                  { feature: "total_revenue = $4K",shap: "-0.12", meaning: "High spend DECREASES churn probability by 0.12", col: "#81C784" },
                  { feature: "avg_order_val = $80", shap: "+0.04", meaning: "Low average order slightly INCREASES churn probability", col: "#FFD54F" },
                ].map((r, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 70px 1fr", gap: 12, alignItems: "center" }}>
                    <code style={{ fontSize: 12, color: "#AAA", fontFamily: "monospace" }}>{r.feature}</code>
                    <span style={{ fontSize: 13, fontWeight: 700, color: r.col, fontFamily: "monospace", textAlign: "center" }}>{r.shap}</span>
                    <span style={{ fontSize: 12, color: "#666" }}>{r.meaning}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 14, fontSize: 12, color: "#555", borderTop: "1px solid #1A1A2E", paddingTop: 12 }}>
                Positive SHAP = pushes prediction higher. Negative SHAP = pushes prediction lower. Sum of all SHAP values = final prediction.
              </div>
            </div>

            <Code col="#80DEEA" label="SHAP — FEATURE IMPORTANCE AND INDIVIDUAL EXPLANATION" code={SHAP_CODE} />

            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#DDD8F0", margin: "28px 0 12px", borderLeft: "3px solid #80DEEA", paddingLeft: 12 }}>SHAP Chart Types</h3>
            <div style={{ border: "1px solid #1A1A2E", borderRadius: 4, overflow: "hidden", margin: "0 0 20px" }}>
              {[
                { chart: "Summary Plot (bar)",  desc: "Global feature importance — which features matter most overall across all predictions", col: "#4FC3F7" },
                { chart: "Summary Plot (dot)",  desc: "Feature importance + direction — red = high value, blue = low. Shows how each feature drives predictions", col: "#81C784" },
                { chart: "Force Plot",          desc: "Single prediction — shows exactly which features pushed the prediction up or down for one customer", col: "#FFD54F" },
                { chart: "Dependence Plot",     desc: "How one feature's SHAP value changes across its range — reveals threshold effects and interactions", col: "#FF8A65" },
              ].map((r, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: 14, padding: "10px 16px", borderBottom: i < 3 ? "1px solid #0F0F18" : "none", background: i % 2 === 0 ? "#0A0A14" : "#07070E", alignItems: "start" }}>
                  <span style={{ fontSize: 12, color: r.col, fontWeight: 700 }}>{r.chart}</span>
                  <span style={{ fontSize: 12, color: "#888" }}>{r.desc}</span>
                </div>
              ))}
            </div>

            <Box col="#80DEEA" icon="💼" title="Presenting SHAP to Stakeholders">
              Never show a stakeholder a raw SHAP force plot — they will not understand it. Instead say: "The model flagged this customer as high churn risk primarily because they have not ordered in 120 days. Their purchase history and spend suggest they are a valuable customer to win back." SHAP gives you the evidence; you provide the narrative.
            </Box>
            <Nav onPrev={() => setSec("automl")} onNext={() => setSec("practice")} />
          </div>
        )}

        {/* ── PRACTICE ── */}
        {sec === "practice" && (
          <div>
            <Sec n="07" title="Practice Exercises" col="#FF8A65" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 16px" }}>
              Three exercises covering merging, feature engineering, and churn prediction. <strong style={{ color: "#DDD8F0" }}>Attempt each before revealing the solution.</strong>
            </p>

            <Box col="#FF8A65" icon="🛠️" title="Setup">
              Use the RetailCo dataset from Phase 1. Create a new notebook: 03_wrangling_ml.ipynb. If you need a customers.csv, generate one with ChatGPT: "Generate a 40-row customers.csv with columns: customer_id (matching orders.csv), country, segment (B2B/B2C), signup_date."
            </Box>

            {[
              {
                level: "Beginner", col: "#81C784",
                title: "Merge Orders + Customers then Pivot",
                task: "Load orders.csv and customers.csv. Merge them with a LEFT join on customer_id. Calculate a revenue column. Create a pivot table showing total revenue by country (rows) and category (columns) for completed orders only. Add row totals and sort by total revenue.",
                hint: "pd.merge(orders, customers, on='customer_id', how='left') → df['revenue'] = units*price → pd.pivot_table(...) → pivot['TOTAL'] = pivot.sum(axis=1)",
                sol: PRACTICE_SOLUTIONS.p1,
              },
              {
                level: "Intermediate", col: "#FFD54F",
                title: "Feature Engineering Pipeline",
                task: "From the orders dataset, engineer: year, month, quarter, is_weekend (from order_date), revenue, cost_total, margin_pct, is_returned (1 if Returned), is_high_value (1 if revenue > 300). Print the first 10 rows and the count of high-value orders.",
                hint: "pd.to_datetime → .dt.month, .dt.quarter → .dt.dayofweek.isin([5,6]) → np.where for flags",
                sol: PRACTICE_SOLUTIONS.p2,
              },
              {
                level: "Advanced", col: "#FF8A65",
                title: "Churn Prediction with Random Forest",
                task: "Build customer-level RFM features (recency_days, frequency, monetary) from orders. Create a churned label: 1 if recency > 90 days. Train a Random Forest classifier. Print accuracy, ROC-AUC, classification report, and feature importances.",
                hint: "groupby('customer_id').agg(...) → train_test_split → StandardScaler → RandomForestClassifier → classification_report",
                sol: PRACTICE_SOLUTIONS.p3,
              },
            ].map((ex, i) => {
              const open = openEx === i;
              return (
                <div key={i} style={{ border: "1px solid " + (open ? ex.col + "55" : "#1A1A2E"), borderRadius: 4, overflow: "hidden", marginBottom: 10 }}>
                  <button onClick={() => setOpenEx(open ? null : i)} style={{
                    width: "100%", background: open ? ex.col + "0A" : "#0D0D18",
                    border: "none", cursor: "pointer", padding: "16px 20px",
                    display: "flex", alignItems: "center", gap: 14, fontFamily: "inherit", textAlign: "left",
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                        <span style={{ fontSize: 10, color: ex.col, background: ex.col + "18", padding: "2px 8px", borderRadius: 2, fontFamily: "monospace" }}>{ex.level}</span>
                        <span style={{ fontSize: 14, fontWeight: 700, color: "#DDD8F0" }}>{ex.title}</span>
                      </div>
                      {!open && <div style={{ fontSize: 12, color: "#555" }}>{ex.task.substring(0, 75)}...</div>}
                    </div>
                    <span style={{ color: ex.col, fontSize: 18, transform: open ? "rotate(45deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }}>+</span>
                  </button>
                  {open && (
                    <div style={{ padding: "0 20px 22px 20px", background: ex.col + "06" }}>
                      <div style={{ height: 1, background: ex.col + "22", margin: "0 0 14px" }} />
                      <p style={{ fontSize: 13, color: "#AAA", lineHeight: 1.7, margin: "0 0 12px" }}>{ex.task}</p>
                      <div style={{ background: "rgba(255,213,79,0.05)", border: "1px solid rgba(255,213,79,0.2)", borderRadius: 3, padding: "10px 14px", marginBottom: 12 }}>
                        <div style={{ fontSize: 9, color: "#FFD54F", letterSpacing: "0.15em", fontFamily: "monospace", fontWeight: 700, marginBottom: 5 }}>HINT</div>
                        <p style={{ fontSize: 12, color: "#888", margin: 0, lineHeight: 1.6, fontFamily: "monospace" }}>{ex.hint}</p>
                      </div>
                      <Code col={ex.col} label="SOLUTION" code={ex.sol} />
                    </div>
                  )}
                </div>
              );
            })}
            <Nav onPrev={() => setSec("shap")} onNext={() => setSec("quiz")} nxt="Take the Quiz →" />
          </div>
        )}

        {/* ── QUIZ ── */}
        {sec === "quiz" && (
          <div>
            <Sec n="08" title="Part 3 Knowledge Check" col={ACC} />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 20px" }}>6 questions covering merging, pivoting, ML workflow, AutoML, and SHAP. Score 4+ to proceed to Part 4.</p>

            {!quiz.finished ? (
              <div style={{ margin: "24px 0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
                  <span style={{ fontSize: 11, color: "#555", fontFamily: "monospace" }}>QUESTION {quiz.idx + 1} / {quizData.length}</span>
                  <span style={{ fontSize: 11, color: ACC, fontFamily: "monospace" }}>SCORE: {quiz.score} / {quiz.idx}</span>
                </div>
                <div style={{ height: 3, background: "#1A1A2E", borderRadius: 2, marginBottom: 24, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: ((quiz.idx / quizData.length) * 100) + "%", background: "linear-gradient(90deg, " + ACC + ", #FFD54F)", transition: "width 0.4s" }} />
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#DDD8F0", lineHeight: 1.65, marginBottom: 20 }}>
                  {quizData[quiz.idx].q}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {quizData[quiz.idx].opts.map((opt, i) => {
                    const sel = quiz.sel === i;
                    const correct = i === quizData[quiz.idx].ans;
                    let bg = "#0D0D18", border = "#1A1A2E", col = "#888";
                    if (quiz.done_q) {
                      if (correct) { bg = "rgba(129,199,132,0.08)"; border = "#81C784"; col = "#81C784"; }
                      else if (sel) { bg = "rgba(255,100,100,0.08)"; border = "#FF6464"; col = "#FF6464"; }
                    } else if (sel) { bg = "rgba(255,138,101,0.08)"; border = ACC; col = ACC; }
                    return (
                      <button key={i} onClick={() => answerQ(i)} style={{
                        background: bg, border: "1px solid " + border, borderRadius: 4,
                        padding: "13px 18px", cursor: quiz.done_q ? "default" : "pointer",
                        textAlign: "left", fontFamily: "inherit", fontSize: 13,
                        color: col, lineHeight: 1.5, transition: "all 0.2s",
                      }}>
                        <span style={{ marginRight: 10, fontFamily: "monospace", fontSize: 11 }}>{String.fromCharCode(65 + i)}.</span>
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {quiz.done_q && (
                  <div style={{ margin: "20px 0 0", padding: "14px 18px", background: "rgba(255,138,101,0.04)", border: "1px solid rgba(255,138,101,0.2)", borderRadius: 4 }}>
                    <div style={{ fontSize: 10, color: ACC, letterSpacing: "0.15em", marginBottom: 6, fontFamily: "monospace" }}>EXPLANATION</div>
                    <p style={{ fontSize: 13, color: "#888", margin: "0 0 14px", lineHeight: 1.7 }}>{quizData[quiz.idx].exp}</p>
                    <button onClick={nextQ} style={{ background: ACC, border: "none", borderRadius: 3, padding: "8px 20px", cursor: "pointer", fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: "#07070E" }}>
                      {quiz.idx < quizData.length - 1 ? "NEXT QUESTION →" : "SEE RESULTS →"}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ margin: "28px 0", textAlign: "center" }}>
                <div style={{ fontSize: 60, marginBottom: 12 }}>
                  {quiz.score >= 5 ? "🏆" : quiz.score >= 4 ? "✅" : "📚"}
                </div>
                <div style={{ fontSize: 44, fontWeight: 900, marginBottom: 8, color: quiz.score >= 5 ? "#81C784" : quiz.score >= 4 ? "#FFD54F" : "#FF8A65" }}>
                  {quiz.score} / {quizData.length}
                </div>
                <p style={{ fontSize: 15, color: "#666", marginBottom: 24 }}>
                  {quiz.score === 6 ? "Data wrangling and ML mastered. Ready for Part 4 — the Phase 3 Capstone!" : quiz.score >= 4 ? "Good pass. Review any tricky sections before Part 4." : "Revisit Scikit-learn and SHAP sections before continuing."}
                </p>
                <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                  <button onClick={() => setQuiz({ idx: 0, sel: null, done_q: false, score: 0, finished: false })} style={{ background: "none", border: "1px solid #333", borderRadius: 3, padding: "8px 20px", cursor: "pointer", fontFamily: "monospace", fontSize: 11, color: "#555" }}>RETAKE</button>
                  <button onClick={() => setSec("intro")} style={{ background: ACC, border: "none", borderRadius: 3, padding: "8px 24px", cursor: "pointer", fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: "#07070E" }}>REVIEW ↑</button>
                </div>

                <div style={{ marginTop: 40, padding: "22px", background: "#0D0D18", border: "1px solid #1A1A2E", borderRadius: 4, textAlign: "left" }}>
                  <div style={{ fontSize: 11, color: "#555", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 10, fontFamily: "monospace" }}>WHAT IS IN PART 4 — FINAL</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#DDD8F0", marginBottom: 8 }}>Phase 3 Capstone — AI-Powered Customer Intelligence Platform</div>
                  <p style={{ fontSize: 13, color: "#555", lineHeight: 1.7, margin: "0 0 14px" }}>
                    Build a complete Python analytics project: auto-EDA with ydata-profiling, churn prediction with Random Forest and H2O AutoML, SHAP explainability, and a Streamlit web app that stakeholders can use to explore customer insights. Full portfolio deliverable.
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {["End-to-end pipeline","ydata-profiling","Random Forest","H2O AutoML","SHAP charts","Streamlit app","GitHub portfolio"].map(t => (
                      <span key={t} style={{ padding: "3px 10px", background: "rgba(255,138,101,0.07)", border: "1px solid rgba(255,138,101,0.2)", borderRadius: 2, fontSize: 11, color: ACC }}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div style={{ display: "flex", marginTop: 48, paddingTop: 24, borderTop: "1px solid #1A1A2E" }}>
              <button onClick={() => setSec("practice")} style={{ background: "none", border: "1px solid #1A1A2E", borderRadius: 3, padding: "8px 18px", cursor: "pointer", fontFamily: "monospace", fontSize: 11, color: "#555" }}>← Previous</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// ── Reusable components ──────────────────────────────────────
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

function Code({ col, label, code }) {
  return (
    <div style={{ background: "#07070E", border: "1px solid " + col + "22", borderRadius: 3, overflow: "hidden", marginBottom: 16 }}>
      {label && (
        <div style={{ padding: "6px 14px", borderBottom: "1px solid " + col + "22" }}>
          <span style={{ fontSize: 9, color: col, letterSpacing: "0.15em", fontFamily: "monospace", fontWeight: 700 }}>{label}</span>
        </div>
      )}
      <pre style={{ margin: 0, padding: "14px 16px", fontSize: 12, color: col, fontFamily: "monospace", lineHeight: 1.75, overflowX: "auto" }}>{code}</pre>
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
        <button onClick={onNext} style={{ background: "#FF8A65", border: "none", borderRadius: 3, padding: "8px 24px", cursor: "pointer", fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: "#07070E" }}>{nxt}</button>
      )}
    </div>
  );
}
