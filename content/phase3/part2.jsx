"use client";
// @ts-nocheck
import { useState } from "react";

// ─── All Python code blocks stored as plain strings (no backtick template literals)
// to avoid JS template interpolation conflicts with Python f-strings and dicts

const edaSteps = [
  {
    step: "01", title: "Shape & Schema", color: "#4FC3F7",
    what: "How many rows and columns? What are the column names and data types?",
    code: [
      "import pandas as pd",
      "import numpy as np",
      "",
      "df = pd.read_csv('data/orders.csv')",
      "",
      "print(df.shape)          # (rows, cols) — check first",
      "print(df.columns.tolist())",
      "print(df.dtypes)         # column data types",
      "print(df.info())         # non-null counts + types",
    ].join("\n"),
    insight: "If a date column shows dtype=object it was read as text. Fix it before time-series analysis. Check row count matches source system.",
  },
  {
    step: "02", title: "Missing Values", color: "#81C784",
    what: "Which columns have nulls? What percentage? Are nulls random or systematic?",
    code: [
      "# Count and percentage of nulls per column",
      "null_report = pd.DataFrame({",
      "    'null_count': df.isnull().sum(),",
      "    'null_pct': (df.isnull().sum() / len(df) * 100).round(2)",
      "}).sort_values('null_pct', ascending=False)",
      "",
      "print(null_report[null_report['null_count'] > 0])",
      "",
      "# Visualise missing values",
      "import matplotlib.pyplot as plt",
      "df.isnull().sum().plot(kind='bar', color='tomato')",
      "plt.title('Missing Values per Column')",
      "plt.tight_layout()",
      "plt.show()",
    ].join("\n"),
    insight: "More than 20% missing in a key column is a red flag. Nulls in revenue or the target variable are especially dangerous.",
  },
  {
    step: "03", title: "Distributions", color: "#FFD54F",
    what: "What is the shape of each numeric column? Normal, skewed, bimodal? Any obvious outliers?",
    code: [
      "import matplotlib.pyplot as plt",
      "import seaborn as sns",
      "",
      "# Histogram for one column",
      "df['revenue'].hist(bins=50, figsize=(10,4), color='steelblue')",
      "plt.title('Revenue Distribution')",
      "plt.xlabel('Revenue ($)')",
      "plt.show()",
      "",
      "# All numeric columns at once",
      "df.hist(bins=30, figsize=(14, 10), layout=(3, 3))",
      "plt.tight_layout()",
      "plt.show()",
      "",
      "# Box plot — shows median, IQR, and outliers",
      "df.boxplot(column='revenue', by='region', figsize=(10, 5))",
      "plt.title('Revenue by Region')",
      "plt.show()",
    ].join("\n"),
    insight: "Right-skewed revenue (long tail right) means a few large orders inflate the mean. Always report median for skewed data.",
  },
  {
    step: "04", title: "Descriptive Statistics", color: "#FF8A65",
    what: "Central tendency and spread for each numeric column. Do mean and median differ significantly?",
    code: [
      "# Full descriptive stats",
      "print(df.describe())",
      "",
      "# Custom stats per group",
      "stats = df.groupby('region')['revenue'].agg([",
      "    'count', 'mean', 'median', 'std', 'min', 'max'",
      "])",
      "print(stats.round(2))",
      "",
      "# Skewness: > 1 = right-skewed, < -1 = left-skewed",
      "print('Revenue skewness:', df['revenue'].skew().round(3))",
      "print('Revenue kurtosis:', df['revenue'].kurtosis().round(3))",
    ].join("\n"),
    insight: "Skewness above 1 means right-skewed — use median not mean. If mean is 179 and median is 127, report 127 as typical order value.",
  },
  {
    step: "05", title: "Categorical Summaries", color: "#CE93D8",
    what: "What are the unique values in categorical columns? Unexpected categories, typos, inconsistencies?",
    code: [
      "# Value counts — frequency of each category",
      "print(df['region'].value_counts())",
      "print(df['status'].value_counts())",
      "",
      "# As proportions",
      "print(df['category'].value_counts(normalize=True).round(3))",
      "",
      "# Check for unexpected values",
      "print(df['status'].unique())",
      "# Should only be: Completed, Returned, Cancelled",
      "",
      "# Bar chart of frequencies",
      "df['category'].value_counts().plot(kind='barh', color='steelblue')",
      "plt.title('Orders by Category')",
      "plt.tight_layout()",
      "plt.show()",
    ].join("\n"),
    insight: "Values like 'london' vs 'London' vs 'LONDON' all count as different categories in groupby. Always check unique() before groupby on text columns.",
  },
  {
    step: "06", title: "Correlations", color: "#F48FB1",
    what: "Which numeric columns move together? Strong correlations may indicate redundancy.",
    code: [
      "import seaborn as sns",
      "",
      "# Correlation matrix",
      "corr = df[['revenue', 'units', 'price', 'cost']].corr()",
      "print(corr.round(2))",
      "",
      "# Heatmap",
      "plt.figure(figsize=(8, 6))",
      "sns.heatmap(corr, annot=True, fmt='.2f',",
      "            cmap='RdYlGn', vmin=-1, vmax=1, square=True)",
      "plt.title('Correlation Heatmap')",
      "plt.tight_layout()",
      "plt.show()",
    ].join("\n"),
    insight: "r above 0.9 between two features = high multicollinearity — problematic for models. r between feature and target above 0.5 = potentially predictive.",
  },
  {
    step: "07", title: "Outlier Detection", color: "#80DEEA",
    what: "Are there extreme values that might be errors, fraud, or unusual business events?",
    code: [
      "# IQR method",
      "Q1 = df['revenue'].quantile(0.25)",
      "Q3 = df['revenue'].quantile(0.75)",
      "IQR = Q3 - Q1",
      "lower = Q1 - 1.5 * IQR",
      "upper = Q3 + 1.5 * IQR",
      "",
      "outliers = df[",
      "    (df['revenue'] < lower) | (df['revenue'] > upper)",
      "]",
      "print(f'Outliers: {len(outliers)} rows')",
      "print(outliers[['order_id', 'customer_id', 'revenue']])",
      "",
      "# Z-score method",
      "from scipy import stats",
      "z = abs(stats.zscore(df['revenue'].dropna()))",
      "print(f'Z-score outliers (|z|>3): {(z > 3).sum()}')",
    ].join("\n"),
    insight: "Outliers are not always errors — a $50,000 enterprise order is real. Always investigate before removing. Never auto-delete outliers.",
  },
];

const chartTypes = [
  {
    chart: "Histogram",
    useFor: "Distribution of one continuous variable",
    notFor: "Comparing categories or trends over time",
    color: "#4FC3F7",
    code: [
      "import matplotlib.pyplot as plt",
      "import seaborn as sns",
      "",
      "fig, axes = plt.subplots(1, 2, figsize=(14, 5))",
      "",
      "# Matplotlib histogram",
      "axes[0].hist(df['revenue'], bins=40, color='#4FC3F7', edgecolor='white')",
      "axes[0].set_title('Revenue Distribution')",
      "axes[0].set_xlabel('Revenue ($)')",
      "",
      "# Seaborn with KDE curve",
      "sns.histplot(df['revenue'], bins=40, kde=True, ax=axes[1], color='#4FC3F7')",
      "axes[1].set_title('Revenue + KDE')",
      "",
      "plt.tight_layout()",
      "plt.show()",
    ].join("\n"),
    tip: "KDE (Kernel Density Estimate) adds a smooth curve showing the underlying shape. Use it to identify whether data is normal, skewed, or bimodal.",
  },
  {
    chart: "Bar Chart",
    useFor: "Comparing a metric across categories",
    notFor: "Showing distributions or time trends",
    color: "#81C784",
    code: [
      "import matplotlib.pyplot as plt",
      "import seaborn as sns",
      "",
      "# Grouped bar: revenue by region and category",
      "pivot = df.groupby(['region', 'category'])['revenue'].sum().unstack()",
      "pivot.plot(kind='bar', figsize=(12, 5), colormap='tab10', edgecolor='white')",
      "plt.title('Revenue by Region and Category')",
      "plt.xlabel('Region')",
      "plt.xticks(rotation=0)",
      "plt.tight_layout()",
      "plt.show()",
      "",
      "# Seaborn horizontal bar (better for long names)",
      "region_rev = df.groupby('region')['revenue'].sum().sort_values()",
      "sns.barplot(x=region_rev.values, y=region_rev.index, palette='viridis')",
      "plt.title('Revenue by Region')",
      "plt.tight_layout()",
      "plt.show()",
    ].join("\n"),
    tip: "Horizontal bars (barh) are better when category names are long. Sort bars by value so readers can compare without scanning.",
  },
  {
    chart: "Line Chart",
    useFor: "Trends over time",
    notFor: "Categorical comparisons",
    color: "#FFD54F",
    code: [
      "import matplotlib.pyplot as plt",
      "import numpy as np",
      "",
      "df['order_date'] = pd.to_datetime(df['order_date'])",
      "monthly = (",
      "    df[df['status'] == 'Completed']",
      "    .resample('M', on='order_date')['revenue']",
      "    .sum().reset_index()",
      ")",
      "",
      "fig, ax = plt.subplots(figsize=(12, 5))",
      "ax.plot(monthly['order_date'], monthly['revenue'],",
      "        marker='o', linewidth=2, color='#FFD54F')",
      "",
      "# Add trend line",
      "x = range(len(monthly))",
      "z = np.polyfit(x, monthly['revenue'], 1)",
      "p = np.poly1d(z)",
      "ax.plot(monthly['order_date'], p(x), '--', color='#FF8A65', alpha=0.7)",
      "",
      "ax.set_title('Monthly Revenue Trend 2024')",
      "ax.grid(axis='y', alpha=0.3)",
      "plt.tight_layout()",
      "plt.show()",
    ].join("\n"),
    tip: "resample('M') groups by month. Use 'W' for weekly, 'Q' for quarterly. A trend line (polyfit) quantifies the direction of change.",
  },
  {
    chart: "Scatter Plot",
    useFor: "Relationship between two continuous variables",
    notFor: "Single variable distributions or time trends",
    color: "#FF8A65",
    code: [
      "import matplotlib.pyplot as plt",
      "import numpy as np",
      "",
      "fig, ax = plt.subplots(figsize=(10, 6))",
      "",
      "# Scatter coloured by category",
      "for cat, col in zip(df['category'].unique(),",
      "                    ['#4FC3F7','#81C784','#FFD54F','#FF8A65']):",
      "    sub = df[df['category'] == cat]",
      "    ax.scatter(sub['units'], sub['revenue'],",
      "               alpha=0.5, label=cat, color=col, s=40)",
      "",
      "ax.set_xlabel('Units Ordered')",
      "ax.set_ylabel('Revenue ($)')",
      "ax.set_title('Units vs Revenue by Category')",
      "ax.legend()",
      "plt.tight_layout()",
      "plt.show()",
      "",
      "# Print correlation",
      "r = df['units'].corr(df['revenue'])",
      "print('Pearson r:', round(r, 3))",
    ].join("\n"),
    tip: "Colour by a third categorical variable to show whether the relationship differs between groups. Always print the correlation coefficient alongside the plot.",
  },
  {
    chart: "Box Plot",
    useFor: "Distribution comparison across groups, outlier visibility",
    notFor: "Very small datasets (< 20 rows) — show individual points instead",
    color: "#CE93D8",
    code: [
      "import seaborn as sns",
      "import matplotlib.pyplot as plt",
      "",
      "fig, axes = plt.subplots(1, 2, figsize=(14, 5))",
      "",
      "# Box plot",
      "sns.boxplot(data=df[df['status']=='Completed'],",
      "            x='region', y='revenue',",
      "            palette='Set2', ax=axes[0])",
      "axes[0].set_title('Revenue by Region')",
      "",
      "# Violin plot — shows distribution shape too",
      "sns.violinplot(data=df[df['status']=='Completed'],",
      "               x='category', y='revenue',",
      "               palette='Set3', ax=axes[1], inner='box')",
      "axes[1].set_title('Revenue by Category (Violin)')",
      "axes[1].tick_params(axis='x', rotation=20)",
      "",
      "plt.tight_layout()",
      "plt.show()",
    ].join("\n"),
    tip: "The box shows Q1, median, Q3. Whiskers extend to 1.5xIQR. Points beyond whiskers are potential outliers. Violin plots add the distribution shape.",
  },
  {
    chart: "Heatmap",
    useFor: "Correlation matrix or intensity across two categorical dimensions",
    notFor: "Time series or single-variable analysis",
    color: "#80DEEA",
    code: [
      "import seaborn as sns",
      "import matplotlib.pyplot as plt",
      "",
      "# Pivot: revenue by region and category",
      "pivot = (",
      "    df.groupby(['region','category'])['revenue']",
      "    .sum().unstack().fillna(0)",
      ")",
      "",
      "plt.figure(figsize=(10, 6))",
      "sns.heatmap(",
      "    pivot / 1000,       # divide by 1000 for readability",
      "    annot=True, fmt='.0f',",
      "    cmap='YlOrRd', linewidths=0.5,",
      "    cbar_kws={'label': 'Revenue ($K)'}",
      ")",
      "plt.title('Revenue Heatmap: Region vs Category ($K)')",
      "plt.tight_layout()",
      "plt.show()",
    ].join("\n"),
    tip: "Divide values by 1000 before annot=True to keep numbers readable. Use diverging colourmaps (RdYlGn) for correlation, sequential (YlOrRd) for magnitude.",
  },
];

const profilingCode = [
  "from ydata_profiling import ProfileReport",
  "import pandas as pd",
  "",
  "df = pd.read_csv('data/orders.csv')",
  "",
  "# Generate full HTML report — takes 30-60 seconds",
  "profile = ProfileReport(",
  "    df,",
  "    title='RetailCo Orders — EDA Report',",
  "    explorative=True",
  ")",
  "",
  "# Save to HTML and open in browser",
  "profile.to_file('outputs/eda_report.html')",
  "print('Report saved! Open outputs/eda_report.html')",
  "",
  "# Or display inline in Jupyter",
  "profile.to_notebook_iframe()",
].join("\n");

const plotlyCode = [
  "import plotly.express as px",
  "import pandas as pd",
  "",
  "df = pd.read_csv('data/orders.csv')",
  "df['order_date'] = pd.to_datetime(df['order_date'])",
  "df['revenue'] = df['units'] * df['price']",
  "completed = df[df['status'] == 'Completed'].copy()",
  "completed['month'] = completed['order_date'].dt.to_period('M').astype(str)",
  "",
  "# Interactive bar chart",
  "region_rev = completed.groupby('region')['revenue'].sum().reset_index()",
  "fig = px.bar(region_rev, x='region', y='revenue', color='region',",
  "             title='Total Revenue by Region',",
  "             color_discrete_sequence=px.colors.qualitative.Set2)",
  "fig.show()",
  "",
  "# Interactive line chart",
  "monthly = completed.groupby('month')['revenue'].sum().reset_index()",
  "fig2 = px.line(monthly, x='month', y='revenue',",
  "               title='Monthly Revenue Trend', markers=True)",
  "fig2.show()",
  "",
  "# Scatter with size and colour",
  "fig3 = px.scatter(completed.sample(min(500, len(completed))),",
  "    x='price', y='revenue', color='category', size='units',",
  "    hover_data=['product', 'region'],",
  "    title='Price vs Revenue (sized by units)', opacity=0.7)",
  "fig3.show()",
].join("\n");

const pandasaiCode = [
  "from pandasai import SmartDataframe",
  "from pandasai.llm.openai import OpenAI",
  "import pandas as pd",
  "import os",
  "",
  "os.environ['OPENAI_API_KEY'] = 'your-key-here'",
  "llm = OpenAI(api_token=os.environ['OPENAI_API_KEY'])",
  "",
  "df = pd.read_csv('data/orders.csv')",
  "smart_df = SmartDataframe(df, config={'llm': llm})",
  "",
  "# Ask questions in plain English",
  "result = smart_df.chat('What is the total revenue per region?')",
  "print(result)",
  "",
  "result2 = smart_df.chat('Which month had the highest revenue?')",
  "print(result2)",
  "",
  "# Generates and saves a chart automatically",
  "smart_df.chat('Show the top 5 products by revenue as a bar chart')",
  "",
  "result4 = smart_df.chat(",
  "    'What percentage of orders were returned in each region?'",
  ")",
  "print(result4)",
].join("\n");

const practiceExercises = [
  {
    level: "Beginner", color: "#81C784",
    title: "Automated EDA Report",
    task: "Load the RetailCo dataset, add a revenue column (units * price), run ydata-profiling, and save an HTML report. Open it and document: any alerts flagged, the revenue skewness, and any high correlations found.",
    hint: "from ydata_profiling import ProfileReport → ProfileReport(df, title='...') → profile.to_file('report.html')",
    solution: [
      "from ydata_profiling import ProfileReport",
      "import pandas as pd",
      "",
      "df = pd.read_csv('data/orders.csv')",
      "df['revenue'] = df['units'] * df['price']",
      "",
      "profile = ProfileReport(df, title='RetailCo EDA Report', explorative=True)",
      "profile.to_file('outputs/retailco_eda.html')",
      "print('Done. Open outputs/retailco_eda.html')",
      "print('Shape:', df.shape)",
      "print('Revenue skewness:', round(df['revenue'].skew(), 3))",
    ].join("\n"),
  },
  {
    level: "Beginner", color: "#81C784",
    title: "4-Chart EDA Dashboard",
    task: "Create a 2x2 subplot showing: (1) revenue histogram, (2) bar chart of orders by region, (3) box plot of revenue by category, (4) pie chart of order status. Use dark background style.",
    hint: "plt.subplots(2, 2, figsize=(14, 10)) → axes[0,0], axes[0,1] etc. Use plt.style.use('dark_background')",
    solution: [
      "import matplotlib.pyplot as plt",
      "import pandas as pd",
      "",
      "df = pd.read_csv('data/orders.csv')",
      "df['revenue'] = df['units'] * df['price']",
      "plt.style.use('dark_background')",
      "",
      "fig, axes = plt.subplots(2, 2, figsize=(14, 10))",
      "fig.suptitle('RetailCo EDA Dashboard', fontsize=16, fontweight='bold')",
      "",
      "# 1. Revenue histogram",
      "axes[0,0].hist(df['revenue'], bins=20, color='#4FC3F7', edgecolor='#333')",
      "axes[0,0].set_title('Revenue Distribution')",
      "axes[0,0].set_xlabel('Revenue ($)')",
      "",
      "# 2. Orders by region",
      "rc = df['region'].value_counts()",
      "axes[0,1].bar(rc.index, rc.values, color='#81C784', edgecolor='#333')",
      "axes[0,1].set_title('Orders by Region')",
      "",
      "# 3. Revenue box plot by category",
      "cats = df['category'].unique()",
      "data = [df[df['category']==c]['revenue'].values for c in cats]",
      "bp = axes[1,0].boxplot(data, labels=cats, patch_artist=True)",
      "colors = ['#FFD54F','#FF8A65','#CE93D8','#4FC3F7']",
      "for patch, c in zip(bp['boxes'], colors):",
      "    patch.set_facecolor(c)",
      "axes[1,0].set_title('Revenue by Category')",
      "axes[1,0].tick_params(axis='x', rotation=15)",
      "",
      "# 4. Status breakdown",
      "sc = df['status'].value_counts()",
      "axes[1,1].pie(sc.values, labels=sc.index, autopct='%1.1f%%')",
      "axes[1,1].set_title('Order Status')",
      "",
      "plt.tight_layout()",
      "plt.savefig('outputs/eda_dashboard.png', dpi=150)",
      "plt.show()",
    ].join("\n"),
  },
  {
    level: "Intermediate", color: "#FFD54F",
    title: "Correlation Heatmap + Top Pairs",
    task: "Calculate a correlation matrix for all numeric columns. Create a Seaborn heatmap with annotations. Print the top 3 strongest correlations excluding self-correlations. Flag any correlations above 0.8.",
    hint: "df.corr() → sns.heatmap(annot=True) → use .unstack().sort_values() on the matrix to find top pairs.",
    solution: [
      "import seaborn as sns",
      "import matplotlib.pyplot as plt",
      "import pandas as pd",
      "",
      "df = pd.read_csv('data/orders.csv')",
      "df['revenue'] = df['units'] * df['price']",
      "",
      "numeric = df.select_dtypes(include='number')",
      "corr = numeric.corr()",
      "",
      "# Heatmap",
      "plt.figure(figsize=(9, 7))",
      "sns.heatmap(corr, annot=True, fmt='.2f', cmap='RdYlGn',",
      "            vmin=-1, vmax=1, square=True, linewidths=0.5)",
      "plt.title('Correlation Matrix')",
      "plt.tight_layout()",
      "plt.show()",
      "",
      "# Top 3 pairs (exclude self-correlation)",
      "pairs = corr.unstack()",
      "pairs = pairs[pairs < 1.0].abs().sort_values(ascending=False)",
      "# Remove duplicate pairs",
      "seen = set()",
      "unique_pairs = []",
      "for idx, val in pairs.items():",
      "    key = frozenset(idx)",
      "    if key not in seen:",
      "        seen.add(key)",
      "        unique_pairs.append((idx, val))",
      "",
      "print('Top 3 correlations:')",
      "for pair, val in unique_pairs[:3]:",
      "    print(f'  {pair[0]} vs {pair[1]}: r={val:.3f}')",
      "",
      "print('High correlations (r > 0.8):')",
      "for pair, val in unique_pairs:",
      "    if val > 0.8:",
      "        print(f'  {pair[0]} vs {pair[1]}: r={val:.3f}')",
    ].join("\n"),
  },
  {
    level: "Advanced", color: "#FF8A65",
    title: "Interactive Outlier Detection with Plotly",
    task: "Detect revenue outliers using the IQR method. Create a Plotly scatter plot showing all orders coloured as Outlier or Normal, with hover data showing order_id, product, and revenue. Print an outlier summary.",
    hint: "IQR = Q3 - Q1 → lower/upper bounds → df['is_outlier'] = np.where(...) → px.scatter() with color='is_outlier'",
    solution: [
      "import plotly.express as px",
      "import pandas as pd",
      "import numpy as np",
      "",
      "df = pd.read_csv('data/orders.csv')",
      "df['revenue'] = df['units'] * df['price']",
      "df['order_date'] = pd.to_datetime(df['order_date'])",
      "",
      "# IQR outlier detection",
      "Q1 = df['revenue'].quantile(0.25)",
      "Q3 = df['revenue'].quantile(0.75)",
      "IQR = Q3 - Q1",
      "lower = Q1 - 1.5 * IQR",
      "upper = Q3 + 1.5 * IQR",
      "",
      "df['is_outlier'] = np.where(",
      "    (df['revenue'] < lower) | (df['revenue'] > upper),",
      "    'Outlier', 'Normal'",
      ")",
      "",
      "print('IQR bounds:', round(lower, 2), 'to', round(upper, 2))",
      "n_out = (df['is_outlier']=='Outlier').sum()",
      "print('Outliers found:', n_out, 'rows')",
      "",
      "print(df[df['is_outlier']=='Outlier']",
      "      [['order_id','product','region','revenue']]",
      "      .sort_values('revenue', ascending=False))",
      "",
      "# Interactive scatter",
      "fig = px.scatter(",
      "    df, x='order_date', y='revenue',",
      "    color='is_outlier',",
      "    color_discrete_map={'Normal':'#4FC3F7','Outlier':'#FF8A65'},",
      "    hover_data=['order_id','product','region'],",
      "    title='Revenue Orders — Outlier Detection (IQR Method)'",
      ")",
      "fig.add_hline(y=upper, line_dash='dash',",
      "              line_color='#FFD54F',",
      "              annotation_text='Upper bound')",
      "fig.show()",
    ].join("\n"),
  },
];

const quizQuestions = [
  {
    q: "What is the PRIMARY purpose of Exploratory Data Analysis (EDA)?",
    options: [
      "To build machine learning models on the data",
      "To understand the data's structure, distributions, relationships and anomalies before any modelling",
      "To clean all null values from the dataset",
      "To create the final stakeholder dashboard"
    ],
    answer: 1,
    explanation: "EDA is the discovery phase — getting to know the data before committing to any analysis. It surfaces distributions, outliers, correlations, and quality issues. Skipping EDA causes wrong analysis and failed models."
  },
  {
    q: "Which chart type is BEST for showing the distribution of a single continuous variable like revenue?",
    options: ["Bar chart", "Line chart", "Histogram", "Pie chart"],
    answer: 2,
    explanation: "A histogram bins continuous values into ranges showing how many points fall in each bin — revealing shape (normal, skewed, bimodal), range, and concentration. Bar charts are for categories. Line charts are for trends over time."
  },
  {
    q: "A scatter plot between ad_spend and revenue shows points scattered randomly with no clear pattern. What does this suggest?",
    options: [
      "Strong positive correlation",
      "The data has too many nulls",
      "Little to no linear correlation between the two variables",
      "A negative correlation"
    ],
    answer: 2,
    explanation: "Random scatter with no visible trend indicates weak or no linear correlation. Always calculate Pearson r to confirm what you see visually. A non-linear pattern could still exist."
  },
  {
    q: "df.describe() returns a row called '50%'. What does this represent?",
    options: [
      "The value at which 50% of data points have been removed",
      "The median — the middle value when all values are sorted",
      "The mean of the top 50% of values",
      "A percentage of null values"
    ],
    answer: 1,
    explanation: "df.describe() shows percentiles. 25% = Q1, 50% = median (Q2), 75% = Q3. If mean and 50% differ significantly, the data is skewed — a critical EDA finding that affects how you should report typical values."
  },
  {
    q: "ydata-profiling warns 'HIGH CORRELATION: column A and B (r=0.97)'. Why does this matter?",
    options: [
      "It means both columns should be deleted",
      "The columns carry nearly identical information — using both in a model causes multicollinearity",
      "It means the data is perfectly clean",
      "Correlation above 0.9 always means an error"
    ],
    answer: 1,
    explanation: "Near-perfect correlation means two columns are almost redundant. In regression or ML models this causes multicollinearity — the model cannot separate their individual effects. In EDA, it is a finding to investigate: are these two features measuring the same thing?"
  },
  {
    q: "Which is the correct IQR outlier detection rule?",
    options: [
      "Any value above the mean is an outlier",
      "Values below Q1 minus 1.5xIQR or above Q3 plus 1.5xIQR are potential outliers",
      "The top and bottom 1% of values are always outliers",
      "Values with z-score above 1.0 are outliers"
    ],
    answer: 1,
    explanation: "The IQR rule: outliers are below Q1 - 1.5xIQR or above Q3 + 1.5xIQR. This is resistant to extreme values. Z-score above 3 (not 1) is the z-score rule. Use IQR for skewed data, z-score for normally distributed data."
  },
];

const sections = [
  { id: "intro",     label: "Overview"    },
  { id: "eda",       label: "EDA Steps"   },
  { id: "charts",    label: "Charts"      },
  { id: "profiling", label: "Profiling"   },
  { id: "plotly",    label: "Plotly"      },
  { id: "pandasai",  label: "PandasAI"    },
  { id: "practice",  label: "Practice"    },
  { id: "quiz",      label: "Quiz"        },
];

export default function Phase3Part2() {
  const [sec,    setSec]    = useState("intro");
  const [openEDA,   setOpenEDA]   = useState(null);
  const [openChart, setOpenChart] = useState(null);
  const [openEx,    setOpenEx]    = useState(null);
  const [quizState, setQuizState] = useState({ idx: 0, selected: null, answered: false, score: 0, done: false });

  const ACC = "#4FC3F7";

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

  // Shared components
  const Code = ({ color, label, code }) => (
    <div style={{ background: "#07070E", border: `1px solid ${color}22`, borderRadius: 3, overflow: "hidden", marginBottom: 12 }}>
      {label && <div style={{ padding: "6px 14px", borderBottom: `1px solid ${color}22` }}>
        <span style={{ fontSize: 9, color: color, letterSpacing: "0.15em", fontFamily: "monospace", fontWeight: 700 }}>{label}</span>
      </div>}
      <pre style={{ margin: 0, padding: "14px 16px", fontSize: 12, color: color, fontFamily: "monospace", lineHeight: 1.75, overflowX: "auto" }}>{code}</pre>
    </div>
  );

  const Callout = ({ icon, color, title, children }) => (
    <div style={{ margin: "16px 0", padding: "13px 17px", background: `${color}07`, border: `1px solid ${color}28`, borderLeft: `3px solid ${color}`, borderRadius: 4 }}>
      <div style={{ fontSize: 12, color, fontWeight: 700, marginBottom: 7 }}>{icon} {title}</div>
      <div style={{ fontSize: 13, color: "#666", lineHeight: 1.8 }}>{children}</div>
    </div>
  );

  const NavBtns = ({ onPrev, onNext, nxt = "Next Section →" }) => (
    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 48, paddingTop: 24, borderTop: "1px solid #1A1A2E" }}>
      {onPrev ? <button onClick={onPrev} style={{ background: "none", border: "1px solid #1A1A2E", borderRadius: 3, padding: "8px 18px", cursor: "pointer", fontFamily: "monospace", fontSize: 11, color: "#555" }}>← Previous</button> : <div />}
      {onNext && <button onClick={onNext} style={{ background: ACC, border: "none", borderRadius: 3, padding: "8px 24px", cursor: "pointer", fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: "#07070E" }}>{nxt}</button>}
    </div>
  );

  const SH = ({ n, title, color }) => (
    <div style={{ marginBottom: 28, paddingBottom: 16, borderBottom: "1px solid #1A1A2E" }}>
      <div style={{ fontSize: 10, color, letterSpacing: "0.3em", fontFamily: "monospace", marginBottom: 6 }}>SECTION {n}</div>
      <h2 style={{ margin: 0, fontSize: "clamp(20px,3vw,28px)", fontWeight: 900, color: "#DDD8F0" }}>
        <span style={{ color }}>{n}. </span>{title}
      </h2>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#07070E", color: "#DDD8F0", fontFamily: "Georgia, 'Times New Roman', serif" }}>

      {/* NAV */}
      <div style={{ background: "#0A0A14", borderBottom: "1px solid #16162A", padding: "0 24px", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 940, margin: "0 auto", display: "flex", alignItems: "center", overflowX: "auto" }}>
          <div style={{ fontSize: 10, color: ACC, letterSpacing: "0.22em", textTransform: "uppercase", padding: "14px 20px 14px 0", borderRight: "1px solid #1A1A2E", marginRight: 12, whiteSpace: "nowrap" }}>P3 · PART 2</div>
          {sections.map(s => (
            <button key={s.id} onClick={() => setSec(s.id)} style={{
              background: "none", border: "none", cursor: "pointer", padding: "14px 12px",
              fontFamily: "inherit", fontSize: 11,
              color: sec === s.id ? ACC : "#444",
              borderBottom: sec === s.id ? `2px solid ${ACC}` : "2px solid transparent",
              transition: "all 0.2s", whiteSpace: "nowrap",
            }}>{s.label}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 940, margin: "0 auto", padding: "48px 24px 100px" }}>

        {/* ── INTRO ── */}
        {sec === "intro" && (
          <div>
            <div style={{ marginBottom: 52, borderLeft: `3px solid ${ACC}`, paddingLeft: 24 }}>
              <div style={{ fontSize: 10, color: ACC, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 12 }}>PHASE 3 · PART 2 OF 4 · WEEK 8</div>
              <h1 style={{ fontSize: "clamp(26px,5vw,44px)", fontWeight: 900, margin: "0 0 16px", lineHeight: 1.12, letterSpacing: "-0.02em" }}>
                Exploratory Data<br />
                <span style={{ color: ACC }}>Analysis + Visualisation</span><br />
                <span style={{ fontStyle: "italic", fontWeight: 400, fontSize: "0.65em", color: "#555" }}>AI-Powered EDA with Python</span>
              </h1>
              <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, maxWidth: 580, margin: "0 0 24px" }}>
                EDA is how you get to know a dataset before analysing it. You will master a 7-step framework, six chart types, automated profiling in one line, interactive Plotly charts, and how to write professional EDA findings that stakeholders can act on.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {["~5 hours", "7-step EDA framework", "6 chart types", "ydata-profiling", "Plotly interactive", "PandasAI", "4 practice exercises", "6-question quiz"].map(tag => (
                  <span key={tag} style={{ padding: "4px 12px", background: "rgba(79,195,247,0.08)", border: "1px solid rgba(79,195,247,0.22)", borderRadius: 2, fontSize: 11, color: ACC }}>{tag}</span>
                ))}
              </div>
            </div>

            <SH n="00" title="What You Will Learn" color={ACC} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(205px, 1fr))", gap: 10, margin: "24px 0 36px" }}>
              {[
                { icon: "🔍", title: "7-Step EDA", desc: "Shape → Nulls → Distributions → Stats → Categoricals → Correlations → Outliers", col: "#4FC3F7", s: "eda" },
                { icon: "📊", title: "6 Chart Types", desc: "Histogram, bar, line, scatter, box, heatmap with full code and use-for guide", col: "#81C784", s: "charts" },
                { icon: "⚡", title: "ydata-profiling", desc: "One-line automated EDA report — distributions, correlations, alerts", col: "#FFD54F", s: "profiling" },
                { icon: "✨", title: "Plotly Interactive", desc: "Hover, zoom, filter charts for stakeholder presentations", col: "#FF8A65", s: "plotly" },
                { icon: "🐼", title: "PandasAI", desc: "Ask questions about your DataFrame in plain English", col: "#B2FF59", s: "pandasai" },
                { icon: "🔨", title: "Practice (4 tasks)", desc: "Profiling, 4-chart dashboard, correlation heatmap, interactive outlier detection", col: "#CE93D8", s: "practice" },
              ].map((item, i) => (
                <div key={i} onClick={() => setSec(item.s)} style={{
                  border: `1px solid ${item.col}33`, borderTop: `3px solid ${item.col}`,
                  borderRadius: 4, padding: "14px", background: "#0D0D18", cursor: "pointer", transition: "background 0.2s",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = `${item.col}08`}
                  onMouseLeave={e => e.currentTarget.style.background = "#0D0D18"}
                >
                  <div style={{ fontSize: 20, marginBottom: 8 }}>{item.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#DDD8F0", marginBottom: 5 }}>{item.title}</div>
                  <div style={{ fontSize: 11, color: "#444", lineHeight: 1.6 }}>{item.desc}</div>
                </div>
              ))}
            </div>

            <Callout icon="🔍" color={ACC} title="EDA in Practice">
              A real EDA session: receive a CSV, run ydata-profiling for instant overview, investigate flagged alerts manually, build 4-6 targeted charts to dig deeper, identify 3-5 most important findings, write a half-page summary for your manager. Total time: 2-4 hours. This part teaches the entire workflow.
            </Callout>
            <NavBtns onNext={() => setSec("eda")} />
          </div>
        )}

        {/* ── EDA STEPS ── */}
        {sec === "eda" && (
          <div>
            <SH n="01" title="The 7-Step EDA Framework" color="#4FC3F7" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 16px" }}>
              Professional analysts follow a consistent EDA sequence. <strong style={{ color: "#DDD8F0" }}>Always run these 7 steps in order on every new dataset</strong> — before writing analysis queries or building models.
            </p>
            <Callout icon="🤖" color="#FFD54F" title="AI Shortcut">
              Run ydata-profiling first: it covers 80% of these steps automatically. Then use the steps below to investigate the alerts it flags.
            </Callout>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, margin: "20px 0 28px" }}>
              {edaSteps.map((step, i) => {
                const open = openEDA === i;
                return (
                  <div key={i} style={{ border: `1px solid ${open ? step.color + "55" : "#1A1A2E"}`, borderRadius: 4, overflow: "hidden" }}>
                    <button onClick={() => setOpenEDA(open ? null : i)} style={{
                      width: "100%", background: open ? `${step.color}0A` : "#0D0D18",
                      border: "none", cursor: "pointer", padding: "14px 20px",
                      display: "flex", alignItems: "flex-start", gap: 14, fontFamily: "inherit", textAlign: "left",
                    }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: `${step.color}18`, border: `1px solid ${step.color}44`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ fontSize: 10, color: step.color, fontFamily: "monospace", fontWeight: 700 }}>{step.step}</span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#DDD8F0" }}>{step.title}</div>
                        {!open && <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>{step.what.substring(0, 72)}...</div>}
                      </div>
                      <span style={{ color: step.color, fontSize: 16, transform: open ? "rotate(45deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }}>+</span>
                    </button>
                    {open && (
                      <div style={{ padding: "0 20px 20px 62px", background: `${step.color}06` }}>
                        <div style={{ height: 1, background: `${step.color}22`, margin: "0 0 14px" }} />
                        <p style={{ fontSize: 13, color: "#AAA", lineHeight: 1.7, margin: "0 0 12px" }}>{step.what}</p>
                        <Code color={step.color} label="CODE" code={step.code} />
                        <div style={{ background: "rgba(255,213,79,0.05)", border: "1px solid rgba(255,213,79,0.2)", borderRadius: 3, padding: "8px 12px" }}>
                          <span style={{ fontSize: 12, color: "#FFD54F" }}>💡 Analyst insight: {step.insight}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <NavBtns onPrev={() => setSec("intro")} onNext={() => setSec("charts")} />
          </div>
        )}

        {/* ── CHARTS ── */}
        {sec === "charts" && (
          <div>
            <SH n="02" title="6 Essential Chart Types" color="#81C784" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 16px" }}>
              <strong style={{ color: "#DDD8F0" }}>Each chart type answers a specific kind of question.</strong> Here are the six you will use in 95% of all data analysis work — with complete runnable code.
            </p>
            <div style={{ border: "1px solid #1A1A2E", borderRadius: 4, overflow: "hidden", margin: "0 0 24px" }}>
              {[
                { q: "What is the distribution of my continuous variable?",       c: "Histogram",  col: "#4FC3F7" },
                { q: "How does a metric compare across categories?",              c: "Bar Chart",  col: "#81C784" },
                { q: "How is a metric changing over time?",                       c: "Line Chart", col: "#FFD54F" },
                { q: "Is there a relationship between two continuous variables?", c: "Scatter",    col: "#FF8A65" },
                { q: "How is a metric spread within groups? Any outliers?",       c: "Box Plot",   col: "#CE93D8" },
                { q: "How does intensity vary across two categories?",            c: "Heatmap",    col: "#80DEEA" },
              ].map((row, i, arr) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 130px", gap: 16, padding: "10px 16px", borderBottom: i < arr.length - 1 ? "1px solid #0F0F18" : "none", background: i % 2 === 0 ? "#0A0A14" : "#07070E", alignItems: "center" }}>
                  <span style={{ fontSize: 13, color: "#888" }}>{row.q}</span>
                  <span style={{ fontSize: 12, color: row.col, fontWeight: 700 }}>→ {row.c}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, margin: "0 0 28px" }}>
              {chartTypes.map((c, i) => {
                const open = openChart === i;
                return (
                  <div key={i} style={{ border: `1px solid ${open ? c.color + "55" : "#1A1A2E"}`, borderRadius: 4, overflow: "hidden" }}>
                    <button onClick={() => setOpenChart(open ? null : i)} style={{
                      width: "100%", background: open ? `${c.color}0A` : "#0D0D18",
                      border: "none", cursor: "pointer", padding: "14px 20px",
                      display: "flex", alignItems: "center", gap: 14, fontFamily: "inherit", textAlign: "left",
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: c.color }}>{c.chart}</div>
                        {!open && <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>Use for: {c.useFor}</div>}
                      </div>
                      <span style={{ color: c.color, fontSize: 18, transform: open ? "rotate(45deg)" : "none", transition: "transform 0.2s" }}>+</span>
                    </button>
                    {open && (
                      <div style={{ padding: "0 20px 22px 20px", background: `${c.color}06` }}>
                        <div style={{ height: 1, background: `${c.color}22`, margin: "0 0 16px" }} />
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                          <div style={{ background: "rgba(129,199,132,0.06)", border: "1px solid rgba(129,199,132,0.2)", borderRadius: 3, padding: "10px 12px" }}>
                            <span style={{ fontSize: 9, color: "#81C784", letterSpacing: "0.15em", fontFamily: "monospace", fontWeight: 700 }}>USE FOR</span>
                            <p style={{ fontSize: 13, color: "#AAA", margin: "6px 0 0" }}>{c.useFor}</p>
                          </div>
                          <div style={{ background: "rgba(255,100,100,0.05)", border: "1px solid rgba(255,100,100,0.2)", borderRadius: 3, padding: "10px 12px" }}>
                            <span style={{ fontSize: 9, color: "#FF6464", letterSpacing: "0.15em", fontFamily: "monospace", fontWeight: 700 }}>NOT FOR</span>
                            <p style={{ fontSize: 13, color: "#AAA", margin: "6px 0 0" }}>{c.notFor}</p>
                          </div>
                        </div>
                        <Code color={c.color} label="COMPLETE CODE" code={c.code} />
                        <div style={{ background: "rgba(255,213,79,0.05)", border: "1px solid rgba(255,213,79,0.2)", borderRadius: 3, padding: "8px 12px" }}>
                          <span style={{ fontSize: 12, color: "#FFD54F" }}>💡 {c.tip}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <NavBtns onPrev={() => setSec("eda")} onNext={() => setSec("profiling")} />
          </div>
        )}

        {/* ── PROFILING ── */}
        {sec === "profiling" && (
          <div>
            <SH n="03" title="ydata-profiling — Automated EDA in One Line" color="#FFD54F" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 16px" }}>
              ydata-profiling generates a <strong style={{ color: "#DDD8F0" }}>complete interactive HTML EDA report from a single line of code</strong>. Distributions, correlations, missing values, duplicates, and alerts in 30–60 seconds. Use it at the start of every new dataset.
            </p>
            <Code color="#FFD54F" label="COMPLETE CODE — ONE-LINE AUTOMATED EDA" code={profilingCode} />

            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#DDD8F0", margin: "28px 0 12px", borderLeft: "3px solid #FFD54F", paddingLeft: 12 }}>What the Report Contains</h3>
            <div style={{ border: "1px solid #1A1A2E", borderRadius: 4, overflow: "hidden", margin: "0 0 20px" }}>
              {[
                { s: "Overview",      f: "Dataset shape, total missing cells, duplicate rows, memory usage, variable types" },
                { s: "Alerts",        f: "High correlation warnings, skewed distributions, constant columns, high cardinality" },
                { s: "Variables",     f: "For each column: distribution, statistics, missing %, unique values, most frequent" },
                { s: "Correlations",  f: "Pearson, Spearman, Kendall matrices — all in one interactive heatmap" },
                { s: "Missing",       f: "Pattern of missingness — is it random or always missing together with other columns?" },
                { s: "Duplicates",    f: "Exact duplicate rows flagged with examples — often reveals data pipeline errors" },
              ].map((row, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "130px 1fr", gap: 16, padding: "10px 16px", borderBottom: i < 5 ? "1px solid #0F0F18" : "none", background: i % 2 === 0 ? "#0A0A14" : "#07070E", alignItems: "start" }}>
                  <span style={{ fontSize: 12, color: "#FFD54F", fontFamily: "monospace", fontWeight: 700 }}>{row.s}</span>
                  <span style={{ fontSize: 13, color: "#777" }}>{row.f}</span>
                </div>
              ))}
            </div>

            <Callout icon="⚠️" color="#FF6464" title="When ydata-profiling Flags an ALERT — What to Do">
              <strong style={{ color: "#DDD8F0" }}>High Correlation:</strong> Are these columns measuring the same thing? May need to drop one for ML.<br />
              <strong style={{ color: "#DDD8F0" }}>High Cardinality:</strong> Too many unique values (e.g. free text). May need encoding or dropping.<br />
              <strong style={{ color: "#DDD8F0" }}>Many Zeros:</strong> Does zero mean missing, or genuinely zero? Critical difference for analysis.<br />
              <strong style={{ color: "#DDD8F0" }}>Constant:</strong> Column has only one value — drop it, provides no information for models.
            </Callout>
            <NavBtns onPrev={() => setSec("charts")} onNext={() => setSec("plotly")} />
          </div>
        )}

        {/* ── PLOTLY ── */}
        {sec === "plotly" && (
          <div>
            <SH n="04" title="Plotly — Interactive Visualisations" color="#FF8A65" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 16px" }}>
              Matplotlib creates static charts. Plotly creates <strong style={{ color: "#DDD8F0" }}>interactive charts</strong> — hover to see exact values, zoom into any region, click legend to filter. For stakeholder presentations, Plotly is dramatically more effective.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, margin: "0 0 20px" }}>
              {[
                { feat: "Hover tooltips", desc: "See exact values on mouse-over", color: "#4FC3F7" },
                { feat: "Zoom and pan",   desc: "Drill into any region of the chart", color: "#81C784" },
                { feat: "Click to filter", desc: "Hide/show series by clicking legend", color: "#FFD54F" },
              ].map((f, i) => (
                <div key={i} style={{ border: `1px solid ${f.color}33`, borderRadius: 4, padding: "14px", background: `${f.color}06`, textAlign: "center" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: f.color, marginBottom: 4 }}>{f.feat}</div>
                  <div style={{ fontSize: 12, color: "#666" }}>{f.desc}</div>
                </div>
              ))}
            </div>
            <Code color="#FF8A65" label="PLOTLY EXPRESS — BAR, LINE AND SCATTER" code={plotlyCode} />

            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#DDD8F0", margin: "28px 0 12px", borderLeft: "3px solid #FF8A65", paddingLeft: 12 }}>Matplotlib vs Seaborn vs Plotly</h3>
            <div style={{ border: "1px solid #1A1A2E", borderRadius: 4, overflow: "hidden", margin: "0 0 24px" }}>
              {[
                { lib: "Matplotlib", when: "Full control, publication-quality static charts, custom layouts", best: "Reports, academic papers, custom multi-panel figures", color: "#4FC3F7" },
                { lib: "Seaborn",    when: "Statistical plots with minimal code, beautiful defaults",         best: "Heatmaps, violin plots, pair plots, distribution comparisons", color: "#81C784" },
                { lib: "Plotly",     when: "Interactive dashboards and stakeholder presentations",            best: "Any chart where hover or zoom adds value — use it by default", color: "#FF8A65" },
              ].map((row, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "100px 1fr 1fr", gap: 14, padding: "11px 16px", borderBottom: i < 2 ? "1px solid #0F0F18" : "none", background: i % 2 === 0 ? "#0A0A14" : "#07070E", alignItems: "start" }}>
                  <span style={{ fontSize: 13, color: row.color, fontWeight: 700 }}>{row.lib}</span>
                  <span style={{ fontSize: 12, color: "#888" }}>{row.when}</span>
                  <span style={{ fontSize: 12, color: "#555", fontStyle: "italic" }}>{row.best}</span>
                </div>
              ))}
            </div>
            <NavBtns onPrev={() => setSec("profiling")} onNext={() => setSec("pandasai")} />
          </div>
        )}

        {/* ── PANDASAI ── */}
        {sec === "pandasai" && (
          <div>
            <SH n="05" title="PandasAI — Chat with Your DataFrame" color="#B2FF59" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 16px" }}>
              PandasAI wraps your DataFrame with an LLM so you can <strong style={{ color: "#DDD8F0" }}>ask questions in plain English and get answers or charts back</strong> — without writing pandas code. Useful for rapid exploration and stakeholder self-service tools.
            </p>
            <Code color="#B2FF59" label="PANDASAI — SETUP AND USAGE" code={pandasaiCode} />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, margin: "20px 0 20px" }}>
              <div style={{ border: "1px solid rgba(178,255,89,0.3)", borderRadius: 4, padding: "14px", background: "rgba(178,255,89,0.04)" }}>
                <div style={{ fontSize: 12, color: "#B2FF59", fontWeight: 700, marginBottom: 10 }}>PandasAI is good at</div>
                {["Simple aggregations and comparisons","Quick bar or line chart generation","Finding max/min/average with conditions","Ranking and filtering","Stakeholder Q&A tools"].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, marginBottom: 5 }}>
                    <span style={{ color: "#B2FF59", flexShrink: 0 }}>✓</span>
                    <span style={{ fontSize: 12, color: "#777" }}>{item}</span>
                  </div>
                ))}
              </div>
              <div style={{ border: "1px solid rgba(255,100,100,0.3)", borderRadius: 4, padding: "14px", background: "rgba(255,100,100,0.04)" }}>
                <div style={{ fontSize: 12, color: "#FF6464", fontWeight: 700, marginBottom: 10 }}>Where it struggles</div>
                {["Complex multi-step transformations","Window functions or rolling calculations","Large datasets — slow and expensive","Confidential data — goes to external API","Production code — non-deterministic"].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, marginBottom: 5 }}>
                    <span style={{ color: "#FF6464", flexShrink: 0 }}>✗</span>
                    <span style={{ fontSize: 12, color: "#777" }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <Callout icon="💡" color="#FFD54F" title="Free Alternative to PandasAI">
              No API key? Use <strong style={{ color: "#DDD8F0" }}>Julius AI (julius.ai)</strong> — drag your CSV, ask questions, get answers AND code, all free. Or <strong style={{ color: "#DDD8F0" }}>ChatGPT with Code Interpreter</strong> — upload the file and ask questions directly in chat.
            </Callout>
            <NavBtns onPrev={() => setSec("plotly")} onNext={() => setSec("practice")} />
          </div>
        )}

        {/* ── PRACTICE ── */}
        {sec === "practice" && (
          <div>
            <SH n="06" title="Practice Exercises" color="#FF8A65" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 16px" }}>
              Four exercises from one-line automated EDA up to interactive outlier detection. <strong style={{ color: "#DDD8F0" }}>Attempt each before revealing the solution.</strong>
            </p>

            <Callout icon="🛠️" color="#FF8A65" title="Before You Start">
              Put the RetailCo CSV from Phase 1 Part 4 in your data/ folder. Open a new Jupyter notebook called 02_eda_visualisation.ipynb. Each exercise is one notebook cell.
            </Callout>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, margin: "20px 0 28px" }}>
              {practiceExercises.map((ex, i) => {
                const open = openEx === i;
                return (
                  <div key={i} style={{ border: `1px solid ${open ? ex.color + "55" : "#1A1A2E"}`, borderRadius: 4, overflow: "hidden" }}>
                    <button onClick={() => setOpenEx(open ? null : i)} style={{
                      width: "100%", background: open ? `${ex.color}0A` : "#0D0D18",
                      border: "none", cursor: "pointer", padding: "16px 20px",
                      display: "flex", alignItems: "center", gap: 14, fontFamily: "inherit", textAlign: "left",
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                          <span style={{ fontSize: 10, color: ex.color, background: `${ex.color}18`, padding: "2px 8px", borderRadius: 2, fontFamily: "monospace" }}>{ex.level}</span>
                          <span style={{ fontSize: 15, fontWeight: 700, color: "#DDD8F0" }}>{ex.title}</span>
                        </div>
                        {!open && <div style={{ fontSize: 12, color: "#555" }}>{ex.task.substring(0, 78)}...</div>}
                      </div>
                      <span style={{ color: ex.color, fontSize: 18, transform: open ? "rotate(45deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }}>+</span>
                    </button>
                    {open && (
                      <div style={{ padding: "0 20px 22px 20px", background: `${ex.color}06` }}>
                        <div style={{ height: 1, background: `${ex.color}22`, margin: "0 0 14px" }} />
                        <p style={{ fontSize: 13, color: "#AAA", lineHeight: 1.7, margin: "0 0 12px" }}>{ex.task}</p>
                        <div style={{ background: "rgba(255,213,79,0.05)", border: "1px solid rgba(255,213,79,0.2)", borderRadius: 3, padding: "10px 14px", marginBottom: 12 }}>
                          <span style={{ fontSize: 9, color: "#FFD54F", letterSpacing: "0.15em", fontFamily: "monospace", fontWeight: 700 }}>HINT — TRY BEFORE LOOKING</span>
                          <p style={{ fontSize: 12, color: "#888", margin: "6px 0 0", lineHeight: 1.6, fontFamily: "monospace" }}>{ex.hint}</p>
                        </div>
                        <Code color={ex.color} label="SOLUTION" code={ex.solution} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <NavBtns onPrev={() => setSec("pandasai")} onNext={() => setSec("quiz")} nxt="Take the Quiz →" />
          </div>
        )}

        {/* ── QUIZ ── */}
        {sec === "quiz" && (
          <div>
            <SH n="07" title="Part 2 Knowledge Check" color={ACC} />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 16px" }}>6 questions on EDA, chart selection, and AI profiling tools. Score 4+ to proceed to Part 3.</p>

            {!quizState.done ? (
              <div style={{ margin: "28px 0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                  <span style={{ fontSize: 11, color: "#555", fontFamily: "monospace" }}>QUESTION {quizState.idx + 1} / {quizQuestions.length}</span>
                  <span style={{ fontSize: 11, color: ACC, fontFamily: "monospace" }}>SCORE: {quizState.score} / {quizState.idx}</span>
                </div>
                <div style={{ height: 3, background: "#1A1A2E", borderRadius: 2, marginBottom: 28, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${(quizState.idx / quizQuestions.length) * 100}%`, background: `linear-gradient(90deg, ${ACC}, #81C784)`, transition: "width 0.4s" }} />
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#DDD8F0", lineHeight: 1.65, marginBottom: 24 }}>
                  {quizQuestions[quizState.idx].q}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {quizQuestions[quizState.idx].options.map((opt, i) => {
                    const sel = quizState.selected === i;
                    const correct = i === quizQuestions[quizState.idx].answer;
                    let bg = "#0D0D18", border = "#1A1A2E", col = "#888";
                    if (quizState.answered) {
                      if (correct) { bg = "rgba(129,199,132,0.08)"; border = "#81C784"; col = "#81C784"; }
                      else if (sel) { bg = "rgba(255,100,100,0.08)"; border = "#FF6464"; col = "#FF6464"; }
                    } else if (sel) { bg = "rgba(79,195,247,0.08)"; border = ACC; col = ACC; }
                    return (
                      <button key={i} onClick={() => handleAnswer(i)} style={{
                        background: bg, border: `1px solid ${border}`, borderRadius: 4,
                        padding: "13px 18px", cursor: quizState.answered ? "default" : "pointer",
                        textAlign: "left", fontFamily: "inherit", fontSize: 13, color: col, lineHeight: 1.5, transition: "all 0.2s",
                      }}>
                        <span style={{ marginRight: 10, fontFamily: "monospace", fontSize: 11 }}>{String.fromCharCode(65 + i)}.</span>
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {quizState.answered && (
                  <div style={{ margin: "20px 0 0", padding: "14px 18px", background: "rgba(79,195,247,0.04)", border: "1px solid rgba(79,195,247,0.2)", borderRadius: 4 }}>
                    <div style={{ fontSize: 10, color: ACC, letterSpacing: "0.15em", marginBottom: 6, fontFamily: "monospace" }}>EXPLANATION</div>
                    <p style={{ fontSize: 13, color: "#888", margin: "0 0 16px", lineHeight: 1.7 }}>{quizQuestions[quizState.idx].explanation}</p>
                    <button onClick={nextQ} style={{ background: ACC, border: "none", borderRadius: 3, padding: "8px 20px", cursor: "pointer", fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: "#07070E" }}>
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
                <div style={{ fontSize: 44, fontWeight: 900, marginBottom: 8, color: quizState.score >= 5 ? "#81C784" : quizState.score >= 4 ? "#FFD54F" : "#FF8A65" }}>
                  {quizState.score} / {quizQuestions.length}
                </div>
                <div style={{ fontSize: 15, color: "#666", marginBottom: 28 }}>
                  {quizState.score === 6 ? "EDA mastery confirmed. On to Part 3 — Data Wrangling and ML." : quizState.score >= 4 ? "Good pass. Review any weak sections before Part 3." : "Revisit the EDA framework and chart types before moving on."}
                </div>
                <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                  <button onClick={() => setQuizState({ idx: 0, selected: null, answered: false, score: 0, done: false })} style={{ background: "none", border: "1px solid #333", borderRadius: 3, padding: "8px 20px", cursor: "pointer", fontFamily: "monospace", fontSize: 11, color: "#555" }}>RETAKE</button>
                  <button onClick={() => setSec("intro")} style={{ background: ACC, border: "none", borderRadius: 3, padding: "8px 24px", cursor: "pointer", fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: "#07070E" }}>REVIEW ↑</button>
                </div>
                <div style={{ marginTop: 40, padding: "22px", background: "#0D0D18", border: "1px solid #1A1A2E", borderRadius: 4, textAlign: "left" }}>
                  <div style={{ fontSize: 11, color: "#555", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 10, fontFamily: "monospace" }}>WHAT IS IN PART 3</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#DDD8F0", marginBottom: 8 }}>Data Wrangling + Machine Learning for Analysts</div>
                  <p style={{ fontSize: 13, color: "#555", lineHeight: 1.7, margin: "0 0 14px" }}>
                    Merging DataFrames, pivot tables, feature engineering, Scikit-learn regression and classification, H2O AutoML, and SHAP explainability for stakeholder-ready model interpretation.
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {["Merging DataFrames","pivot_table","Feature engineering","Scikit-learn","H2O AutoML","SHAP values"].map(t => (
                      <span key={t} style={{ padding: "3px 10px", background: "rgba(79,195,247,0.07)", border: "1px solid rgba(79,195,247,0.2)", borderRadius: 2, fontSize: 11, color: ACC }}>{t}</span>
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
