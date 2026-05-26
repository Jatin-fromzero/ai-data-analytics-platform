import { useState } from "react";

const quizQuestions = [
  {
    q: "What does df.shape return for a DataFrame with 1000 rows and 8 columns?",
    options: ["1000", "(1000, 8)", "[1000, 8]", "8000"],
    answer: 1,
    explanation: "df.shape returns a tuple (rows, columns). For 1000 rows and 8 columns it returns (1000, 8). Use df.shape[0] for just row count and df.shape[1] for just column count. This is always the first thing to check when loading a new dataset."
  },
  {
    q: "You want to select only rows where the 'status' column equals 'Completed'. Which is correct?",
    options: [
      "df.where(df['status'] == 'Completed')",
      "df[df['status'] == 'Completed']",
      "df.select(status='Completed')",
      "df.filter('status == Completed')"
    ],
    answer: 1,
    explanation: "Boolean indexing: df[condition] filters rows where condition is True. df[df['status'] == 'Completed'] creates a boolean mask, then filters. This is the most fundamental pandas operation — memorise this pattern."
  },
  {
    q: "What does df.groupby('region')['revenue'].sum() return?",
    options: [
      "Total revenue for the entire DataFrame",
      "A Series with one row per region showing total revenue per region",
      "A new DataFrame with revenue column only",
      "An error — you need to use GROUP BY in pandas"
    ],
    answer: 1,
    explanation: "groupby() groups rows by the specified column, then the aggregation (.sum(), .mean(), .count() etc.) is applied per group. Returns a Series indexed by the group values — one row per region with total revenue. This is pandas' equivalent of SQL GROUP BY."
  },
  {
    q: "What is the difference between df.dropna() and df.fillna(0)?",
    options: [
      "They are identical — both remove null values",
      "dropna() removes rows with any null; fillna(0) replaces nulls with 0",
      "dropna() fills nulls with 0; fillna() removes rows",
      "dropna() only works on columns; fillna() only works on rows"
    ],
    answer: 1,
    explanation: "dropna() removes rows (or columns) that contain null values — you lose data. fillna(value) replaces nulls with a specified value — you keep all rows. Choose based on context: drop if missing data is truly missing, fill if 0 or a default makes business sense."
  },
  {
    q: "In GitHub Copilot, how do you trigger a suggestion?",
    options: [
      "Press Ctrl+Space to open a menu",
      "Write a descriptive comment (# ...) and start typing — Copilot suggests the code",
      "Type 'copilot:' followed by your request",
      "Right-click and select 'Generate Code'"
    ],
    answer: 1,
    explanation: "Copilot watches what you type and offers inline suggestions. The most reliable trigger is writing a clear comment explaining what you want (e.g. # calculate total revenue per region excluding returns), then pressing Enter. Copilot generates the code. Press Tab to accept, Esc to dismiss."
  },
  {
    q: "df['revenue'] = df['units'] * df['price'] — what does this do?",
    options: [
      "Filters rows where revenue equals units times price",
      "Creates a new column called 'revenue' by multiplying units and price for every row",
      "Overwrites both units and price columns",
      "Returns an error — you cannot multiply columns directly"
    ],
    answer: 1,
    explanation: "This creates a derived column. Pandas applies the operation element-wise across all rows simultaneously — no loop needed. This is vectorisation: operations on entire columns at once, much faster than Python loops. This is one of the most used patterns in pandas data prep."
  },
];

const pythonFundamentals = [
  {
    topic: "Variables, Types & Lists",
    color: "#4FC3F7",
    code: `# Python basics — no semicolons, indentation matters
name = "Alice"          # string
revenue = 142300.50     # float
orders = 1204           # integer
is_active = True        # boolean

# Lists — ordered, mutable, allows duplicates
regions = ["North", "South", "East", "West"]
print(regions[0])       # → "North" (0-indexed)
print(regions[-1])      # → "West" (last item)
print(len(regions))     # → 4

# List operations
regions.append("Central")   # add to end
regions.remove("East")      # remove by value
sorted_regions = sorted(regions)  # returns new sorted list`,
    explanation: "Python uses duck typing — you don't declare types. Variables are just labels pointing to values. Lists are the workhorse data structure for sequences of items.",
    analogy: "A Python list is like an Excel column — ordered, can contain anything, and you access items by position."
  },
  {
    topic: "Dictionaries & Control Flow",
    color: "#81C784",
    code: `# Dictionaries — key:value pairs (like a lookup table)
customer = {
    "id": "C-1042",
    "name": "Alice Morgan",
    "region": "North",
    "total_spend": 4820.50
}
print(customer["name"])      # → "Alice Morgan"
customer["tier"] = "Gold"    # add new key
print(customer.keys())       # → dict_keys(['id', 'name'...])

# if / elif / else
score = 85
if score >= 90:
    tier = "Platinum"
elif score >= 75:
    tier = "Gold"
elif score >= 60:
    tier = "Silver"
else:
    tier = "Bronze"

# for loop over list
for region in ["North", "South", "East", "West"]:
    print(f"Processing: {region}")`,
    explanation: "Dictionaries are Python's key-value store — like a hash map. Control flow (if/for) in Python uses indentation instead of braces. Always 4 spaces.",
    analogy: "A Python dictionary is like an Excel VLOOKUP table — you look up a key and get a value back."
  },
  {
    topic: "Functions & List Comprehensions",
    color: "#FFD54F",
    code: `# Functions — reusable blocks of logic
def calculate_margin(revenue, cost):
    """Calculate gross margin percentage."""
    if revenue == 0:
        return 0
    return round((revenue - cost) / revenue * 100, 2)

# Call the function
margin = calculate_margin(142300, 89000)
print(f"Gross Margin: {margin}%")  # → "Gross Margin: 37.46%"

# Lambda — single-line anonymous function
categorise = lambda score: "High" if score >= 8 else "Low"
print(categorise(9))   # → "High"

# List comprehension — concise way to transform lists
revenues = [120, 450, 80, 320, 210]
high_value = [r for r in revenues if r >= 200]
# → [450, 320, 210]

doubled = [r * 2 for r in revenues]
# → [240, 900, 160, 640, 420]`,
    explanation: "Functions make code reusable and testable. List comprehensions are Python's elegant one-liner for transforming or filtering lists — much faster than writing a for loop with append.",
    analogy: "A function is like an Excel formula you can reuse — define it once, call it anywhere."
  },
  {
    topic: "File I/O & Error Handling",
    color: "#FF8A65",
    code: `import pandas as pd  # the data analysis library

# Reading files — the most common operation
df = pd.read_csv("orders.csv")
df_excel = pd.read_excel("sales.xlsx", sheet_name="Orders")
df_json = pd.read_json("data.json")

# Writing files
df.to_csv("output.csv", index=False)  # index=False avoids row numbers
df.to_excel("report.xlsx", sheet_name="Results", index=False)

# Try/except — graceful error handling
try:
    df = pd.read_csv("orders.csv")
    print(f"Loaded {len(df)} rows successfully")
except FileNotFoundError:
    print("File not found — check the path")
except Exception as e:
    print(f"Unexpected error: {e}")

# Check current directory
import os
print(os.getcwd())        # where Python is running from
print(os.listdir("."))    # list files in current directory`,
    explanation: "Reading and writing files is how Python connects to real data. Always use try/except when reading external files — files move, names change, formats break. This prevents your script crashing on the first error.",
    analogy: "pd.read_csv() is Python's version of opening a spreadsheet. The DataFrame you get back is like an in-memory Excel table you can manipulate with code."
  },
];

const pandasEssentials = [
  {
    operation: "Load & First Look",
    color: "#4FC3F7",
    desc: "The first 5 commands to run on any new dataset",
    code: `import pandas as pd

df = pd.read_csv("orders.csv")

df.shape        # (rows, columns) — always check first
df.head(5)      # first 5 rows
df.tail(5)      # last 5 rows
df.info()       # column types, non-null counts, memory usage
df.describe()   # stats: count, mean, std, min, 25%, 50%, 75%, max`,
    tip: "df.info() and df.describe() together give you a complete first-pass audit of any dataset in 2 lines."
  },
  {
    operation: "Selecting Data",
    color: "#81C784",
    desc: "Select columns, rows, and specific cells",
    code: `# Select one column → returns a Series
df["revenue"]

# Select multiple columns → returns a DataFrame
df[["region", "product", "revenue"]]

# Filter rows by condition (boolean indexing)
df[df["status"] == "Completed"]
df[df["revenue"] > 500]

# Multiple conditions: use & for AND, | for OR
completed_north = df[(df["status"] == "Completed") & (df["region"] == "North")]

# Select by position: .iloc[row, col]
df.iloc[0]          # first row
df.iloc[0:5, 0:3]   # rows 0-4, columns 0-2

# Select by label: .loc[row_label, col_label]
df.loc[df["region"] == "North", "revenue"]`,
    tip: "Boolean indexing is the most important pandas skill. df[condition] is how you filter rows. Use & (and), | (or), ~ (not) for compound conditions — always wrap each condition in parentheses."
  },
  {
    operation: "Aggregation & GroupBy",
    color: "#FFD54F",
    desc: "SQL-style GROUP BY and aggregate functions",
    code: `# Simple aggregation
df["revenue"].sum()
df["revenue"].mean()
df["revenue"].max()
df["revenue"].count()
df["revenue"].nunique()  # count of unique values

# GroupBy — one metric per group
df.groupby("region")["revenue"].sum()
df.groupby("region")["revenue"].mean()

# GroupBy — multiple metrics at once
df.groupby("region").agg(
    total_revenue = ("revenue", "sum"),
    order_count   = ("order_id", "count"),
    avg_order     = ("revenue", "mean"),
    max_order     = ("revenue", "max")
).reset_index()

# GroupBy with multiple columns (like SQL GROUP BY region, category)
df.groupby(["region", "category"])["revenue"].sum().reset_index()`,
    tip: "Always call .reset_index() after groupby to turn the result back into a normal DataFrame with numbered rows. Without it, the grouped column becomes the index, which is harder to work with."
  },
  {
    operation: "Data Cleaning",
    color: "#FF8A65",
    desc: "Handle nulls, duplicates, types, and whitespace",
    code: `# Check for missing values
df.isnull().sum()           # count nulls per column
df.isnull().sum() / len(df) # null % per column

# Handle nulls
df.dropna()                     # drop rows with ANY null
df.dropna(subset=["order_id"])  # drop only if this column is null
df["revenue"].fillna(0)         # fill nulls with 0
df["region"].fillna("Unknown")  # fill with string

# Remove duplicates
df.drop_duplicates()                    # based on all columns
df.drop_duplicates(subset=["order_id"]) # based on key column

# Fix data types
df["order_date"] = pd.to_datetime(df["order_date"])
df["revenue"] = pd.to_numeric(df["revenue"], errors="coerce")

# Clean text columns
df["region"] = df["region"].str.strip().str.upper()
df["product"] = df["product"].str.strip().str.title()`,
    tip: "errors='coerce' in pd.to_numeric() turns unconvertible values into NaN instead of throwing an error — essential for real-world messy data where text is mixed with numbers."
  },
  {
    operation: "Create New Columns",
    color: "#CE93D8",
    desc: "Derive new columns from existing data",
    code: `# Simple derived column (vectorised — applies to all rows at once)
df["revenue"] = df["units"] * df["unit_price"]
df["profit"]  = df["revenue"] - df["cost"]
df["margin_pct"] = (df["profit"] / df["revenue"] * 100).round(2)

# Conditional column with np.where (like Excel IF)
import numpy as np
df["is_high_value"] = np.where(df["revenue"] > 500, "High", "Low")

# Multi-tier classification with pd.cut
df["revenue_tier"] = pd.cut(
    df["revenue"],
    bins=[0, 100, 500, 1000, float("inf")],
    labels=["Bronze", "Silver", "Gold", "Platinum"]
)

# Date parts from datetime column
df["order_date"] = pd.to_datetime(df["order_date"])
df["year"]  = df["order_date"].dt.year
df["month"] = df["order_date"].dt.month
df["month_name"] = df["order_date"].dt.month_name()
df["quarter"] = df["order_date"].dt.quarter`,
    tip: "np.where(condition, value_if_true, value_if_false) is Python's equivalent of Excel's IF formula. pd.cut() automatically bins continuous values into categories — perfect for RFM scoring or customer tiers."
  },
  {
    operation: "Sorting & Ranking",
    color: "#F48FB1",
    desc: "Sort DataFrames and rank rows",
    code: `# Sort by single column
df.sort_values("revenue", ascending=False)  # highest first

# Sort by multiple columns
df.sort_values(["region", "revenue"], ascending=[True, False])

# Rank within groups (like SQL RANK() OVER PARTITION BY)
df["rank_in_region"] = df.groupby("region")["revenue"].rank(
    method="dense", ascending=False
)

# Get top N rows per group (like SQL TOP N PARTITION BY)
top2_per_region = (
    df.sort_values("revenue", ascending=False)
      .groupby("region")
      .head(2)
      .reset_index(drop=True)
)

# Value counts — frequency of each unique value
df["region"].value_counts()
df["status"].value_counts(normalize=True)  # as percentages`,
    tip: "groupby().head(N) after sort_values is the pandas equivalent of SQL's RANK() OVER (PARTITION BY ... ORDER BY ...) WHERE rank <= N. It is the top-N-per-group pattern in pure pandas."
  },
];

const copilotPatterns = [
  {
    scenario: "Write data cleaning code",
    comment: "# Clean the orders DataFrame:\n# 1. Remove rows where order_id is null\n# 2. Convert order_date to datetime\n# 3. Strip whitespace from region column\n# 4. Fill null revenue values with 0",
    generated: `df = df.dropna(subset=['order_id'])
df['order_date'] = pd.to_datetime(df['order_date'])
df['region'] = df['region'].str.strip()
df['revenue'] = df['revenue'].fillna(0)`,
    color: "#4FC3F7",
    tip: "The more specific your comment, the better the suggestion. List each step explicitly."
  },
  {
    scenario: "Generate aggregation query",
    comment: "# Calculate monthly revenue by region for completed orders\n# Include: order count, total revenue, avg order value\n# Sort by year, month, then region",
    generated: `monthly_regional = (
    df[df['status'] == 'Completed']
    .groupby(['year', 'month', 'region'])
    .agg(
        order_count=('order_id', 'count'),
        total_revenue=('revenue', 'sum'),
        avg_order_value=('revenue', 'mean')
    )
    .reset_index()
    .sort_values(['year', 'month', 'region'])
)`,
    color: "#81C784",
    tip: "Copilot is excellent at generating groupby + agg patterns. Always read the output before running to verify column names match your actual DataFrame."
  },
  {
    scenario: "Create RFM scoring",
    comment: "# Calculate RFM scores for each customer\n# Recency: days since last order (lower = better)\n# Frequency: number of completed orders\n# Monetary: total revenue\n# Score each 1-4 using pd.qcut (quartile-based)",
    generated: `from datetime import date

rfm = df[df['status'] == 'Completed'].groupby('customer_id').agg(
    recency_days=('order_date', lambda x: (date.today() - x.max().date()).days),
    frequency=('order_id', 'count'),
    monetary=('revenue', 'sum')
).reset_index()

rfm['r_score'] = pd.qcut(rfm['recency_days'], q=4, labels=[4, 3, 2, 1])
rfm['f_score'] = pd.qcut(rfm['frequency'].rank(method='first'), q=4, labels=[1, 2, 3, 4])
rfm['m_score'] = pd.qcut(rfm['monetary'], q=4, labels=[1, 2, 3, 4])
rfm['rfm_score'] = rfm['r_score'].astype(int) + rfm['f_score'].astype(int) + rfm['m_score'].astype(int)`,
    color: "#FFD54F",
    tip: "Use rank(method='first') with qcut to handle duplicate values — prevents the 'non-unique bin edges' error on real data."
  },
  {
    scenario: "Debug an error",
    comment: "# Getting KeyError: 'revenue' when running this code\n# df.groupby('region')['revenue'].sum()\n# The column might be named differently — check and fix",
    generated: `# First, check actual column names
print(df.columns.tolist())
# Output: ['Region', 'Revenue', 'Units', 'Price', 'Status']
# Column names are capitalised — fix:
df.columns = df.columns.str.lower().str.replace(' ', '_')
# Now try again:
df.groupby('region')['revenue'].sum()`,
    color: "#FF8A65",
    tip: "Paste the error message directly into a comment and ask Copilot to diagnose and fix it. This works remarkably well for common errors."
  },
];

const aiAnalyticsTools = [
  {
    name: "GitHub Copilot",
    icon: "🤖",
    color: "#6E40C9",
    type: "In-editor code completion",
    how: "Write descriptive comments in VS Code → Copilot generates code inline as you type → Tab to accept",
    bestFor: "Writing pandas transformations, SQL queries in .sql files, data cleaning scripts, function writing",
    setup: "VS Code → Extensions → GitHub Copilot → Sign in with GitHub. Free for students via GitHub Education Pack.",
    prompts: [
      "# Load orders.csv, check for nulls, and print a summary of data quality issues",
      "# Merge orders and customers DataFrames on customer_id, keep all orders",
      "# Create a pivot table showing revenue by region and product category",
    ],
    warning: "Copilot can confidently generate wrong column names. Always verify column names with df.columns before running generated code."
  },
  {
    name: "ChatGPT Code Interpreter",
    icon: "📊",
    color: "#10A37F",
    type: "Upload CSV, chat with your data",
    how: "ChatGPT Plus → Attach your CSV file → ask questions in plain English → gets Python code and runs it",
    bestFor: "Quick EDA on unfamiliar datasets, explaining what analysis to do, generating visualisation code",
    setup: "ChatGPT Plus ($20/month) or use free tier with Claude. Upload file directly in the chat.",
    prompts: [
      '"Here is my orders CSV. What are the 5 most important insights I should investigate?"',
      '"Show me a distribution of the revenue column and flag any outliers"',
      '"Which customers have the highest lifetime value? Show me a ranked table."',
    ],
    warning: "Code Interpreter runs code on OpenAI servers — do not upload confidential or proprietary company data."
  },
  {
    name: "Julius AI",
    icon: "⚡",
    color: "#FF6D9D",
    type: "No-code drag-and-drop analysis",
    how: "Go to julius.ai → Upload CSV → ask questions in plain English → Julius writes AND runs the code",
    bestFor: "Non-coders who want Python-level analysis, rapid prototyping, learning what code does what",
    setup: "julius.ai — free tier available. Drag your CSV onto the page and start asking questions.",
    prompts: [
      '"Show me a bar chart of total revenue by region"',
      '"Which product has the highest return rate?"',
      '"Create a monthly trend chart for 2024 with a trendline"',
    ],
    warning: "Julius generates great starter code but sometimes misidentifies column types. Always review the generated Python before copying it into your own scripts."
  },
  {
    name: "PandasAI",
    icon: "🐼",
    color: "#B2FF59",
    type: "Query DataFrames in plain English",
    how: "Install pandasai → wrap your DataFrame → call df.chat('your question') → returns answer or plot",
    bestFor: "Business stakeholders who need to explore a prepared DataFrame without knowing pandas syntax",
    setup: "pip install pandasai pandasai[openai] then set your OpenAI API key as environment variable.",
    prompts: [
      'df.chat("What is the average revenue per region?")',
      'df.chat("Show me the top 5 customers by total spend as a bar chart")',
      'df.chat("Which month had the highest return rate?")',
    ],
    warning: "PandasAI requires an OpenAI API key and costs per query. Better for demos and stakeholder tools than daily personal use."
  },
];

const practiceExercises = [
  {
    level: "Beginner",
    color: "#81C784",
    title: "Load, Inspect, and Clean",
    task: "Load the RetailCo dataset from Phase 1. Run the 5 first-look commands. Fix: convert order_date to datetime, strip whitespace from region, calculate a revenue column (units * price), and report the null count per column.",
    hint: "pd.read_csv() → df.info() → df.shape → df.isnull().sum() → pd.to_datetime() → str.strip() → df['col'] = df['a'] * df['b']",
    solution: `import pandas as pd

# Load
df = pd.read_csv("orders.csv")

# First look
print(df.shape)
print(df.info())
print(df.head())
print(df.isnull().sum())

# Clean
df['order_date'] = pd.to_datetime(df['order_date'])
df['region'] = df['region'].str.strip().str.upper()
df['product'] = df['product'].str.strip().str.title()

# Derive revenue column
df['revenue'] = df['units'] * df['price']

# Final check
print(f"Rows: {df.shape[0]}")
print(f"Date range: {df['order_date'].min()} to {df['order_date'].max()}")
print(f"Nulls remaining: {df.isnull().sum().sum()}")`
  },
  {
    level: "Beginner",
    color: "#81C784",
    title: "GroupBy Analysis",
    task: "Using the RetailCo dataset (completed orders only), calculate: total revenue per region, average order value per sales rep, and a count of orders per product category. Sort each result by the metric descending.",
    hint: "df[df['status']=='Completed'] first, then groupby().agg() with reset_index(). Use sort_values(ascending=False).",
    solution: `completed = df[df['status'] == 'Completed']

# Revenue by region
region_rev = (
    completed.groupby('region')['revenue']
    .sum()
    .reset_index()
    .rename(columns={'revenue': 'total_revenue'})
    .sort_values('total_revenue', ascending=False)
)
print(region_rev)

# AOV by sales rep
rep_aov = (
    completed.groupby('rep')['revenue']
    .mean()
    .reset_index()
    .rename(columns={'revenue': 'avg_order_value'})
    .sort_values('avg_order_value', ascending=False)
)
print(rep_aov.round(2))

# Order count by category
cat_count = (
    completed.groupby('category')['order_id']
    .count()
    .reset_index()
    .rename(columns={'order_id': 'order_count'})
    .sort_values('order_count', ascending=False)
)
print(cat_count)`
  },
  {
    level: "Intermediate",
    color: "#FFD54F",
    title: "Monthly Trend with Derived Columns",
    task: "Build a monthly revenue trend table for 2024. Include: month number, month name, order count, total revenue, and month-over-month change amount and percentage. Flag months where revenue declined.",
    hint: "Extract month with dt.month and dt.month_name(). Use .shift(1) on the revenue column for previous month. np.where() for the flag.",
    solution: `import numpy as np

completed = df[df['status'] == 'Completed'].copy()
completed['month_num']  = completed['order_date'].dt.month
completed['month_name'] = completed['order_date'].dt.month_name()

monthly = (
    completed.groupby(['month_num', 'month_name'])
    .agg(
        orders=('order_id', 'count'),
        revenue=('revenue', 'sum')
    )
    .reset_index()
    .sort_values('month_num')
)

monthly['prev_revenue'] = monthly['revenue'].shift(1)
monthly['mom_change']   = monthly['revenue'] - monthly['prev_revenue']
monthly['mom_pct']      = (
    monthly['mom_change'] / monthly['prev_revenue'] * 100
).round(1)
monthly['trend'] = np.where(
    monthly['mom_change'] > 0, 'GROWTH',
    np.where(monthly['mom_change'] < 0, 'DECLINE', 'FLAT')
)
print(monthly[['month_name','orders','revenue','mom_pct','trend']].round(2))`
  },
  {
    level: "Advanced",
    color: "#FF8A65",
    title: "Top 2 Products Per Region",
    task: "Find the top 2 products by revenue within each region (completed orders only). Output: region, rank, product, revenue, order count. This is the pandas equivalent of the SQL window function pattern from Phase 2.",
    hint: "groupby(['region','product']).agg() for totals, then groupby('region')['revenue'].rank(method='dense', ascending=False) for ranks. Filter rank <= 2.",
    solution: `completed = df[df['status'] == 'Completed']

# Step 1: revenue per region-product combination
product_region = (
    completed.groupby(['region', 'product'])
    .agg(
        revenue=('revenue', 'sum'),
        orders=('order_id', 'count')
    )
    .reset_index()
)

# Step 2: rank within each region
product_region['rank'] = (
    product_region.groupby('region')['revenue']
    .rank(method='dense', ascending=False)
    .astype(int)
)

# Step 3: filter to top 2 per region
top2 = (
    product_region[product_region['rank'] <= 2]
    .sort_values(['region', 'rank'])
    .reset_index(drop=True)
)

print(top2[['region', 'rank', 'product', 'revenue', 'orders']].round(2))`
  },
];

const sections = [
  { id: "intro",     label: "Overview"     },
  { id: "setup",     label: "Setup"        },
  { id: "python",    label: "Python Basics" },
  { id: "pandas",    label: "Pandas"       },
  { id: "copilot",   label: "Copilot"      },
  { id: "aitools",   label: "AI Tools"     },
  { id: "practice",  label: "Practice"     },
  { id: "quiz",      label: "Quiz"         },
];

export default function Phase3Part1() {
  const [activeSection, setActiveSection] = useState("intro");
  const [expandedPy,    setExpandedPy]    = useState(null);
  const [expandedPd,    setExpandedPd]    = useState(null);
  const [expandedCop,   setExpandedCop]   = useState(null);
  const [expandedAI,    setExpandedAI]    = useState(null);
  const [expandedEx,    setExpandedEx]    = useState(null);
  const [quizState, setQuizState] = useState({ idx: 0, selected: null, answered: false, score: 0, done: false });

  const ACC = "#B2FF59";

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

      {/* NAV */}
      <div style={{ background: "#0A0A14", borderBottom: "1px solid #16162A", padding: "0 24px", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 940, margin: "0 auto", display: "flex", alignItems: "center", overflowX: "auto" }}>
          <div style={{ fontSize: 10, color: ACC, letterSpacing: "0.22em", textTransform: "uppercase", padding: "14px 20px 14px 0", borderRight: "1px solid #1A1A2E", marginRight: 12, whiteSpace: "nowrap" }}>
            P3 · PART 1
          </div>
          {sections.map(s => (
            <button key={s.id} onClick={() => setActiveSection(s.id)} style={{
              background: "none", border: "none", cursor: "pointer",
              padding: "14px 12px", fontFamily: "inherit", fontSize: 11,
              color: activeSection === s.id ? ACC : "#444",
              borderBottom: activeSection === s.id ? `2px solid ${ACC}` : "2px solid transparent",
              transition: "all 0.2s", whiteSpace: "nowrap",
            }}>{s.label}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 940, margin: "0 auto", padding: "48px 24px 100px" }}>

        {/* ── INTRO ── */}
        {activeSection === "intro" && (
          <div>
            <div style={{ marginBottom: 52, borderLeft: `3px solid ${ACC}`, paddingLeft: 24 }}>
              <div style={{ fontSize: 10, color: ACC, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 12 }}>
                PHASE 3 · PART 1 OF 4 · WEEK 7
              </div>
              <h1 style={{ fontSize: "clamp(26px,5vw,44px)", fontWeight: 900, margin: "0 0 16px", lineHeight: 1.12, letterSpacing: "-0.02em" }}>
                Python for<br />
                <span style={{ color: ACC }}>Data Analytics</span><br />
                <span style={{ fontStyle: "italic", fontWeight: 400, fontSize: "0.65em", color: "#555" }}>With AI Pair Programming</span>
              </h1>
              <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, maxWidth: 580, margin: "0 0 24px" }}>
                Python is the most powerful tool in any analyst's arsenal. In Phase 3 you will go from zero to building full data pipelines, machine learning models, and AI-powered analysis tools. Part 1 starts with the fundamentals — Python syntax, Pandas, and the AI tools that make you 10x faster from day one.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {["~5 hours", "Python fundamentals", "Pandas essentials", "GitHub Copilot", "4 AI tools", "4 practice exercises", "6-question quiz"].map(tag => (
                  <span key={tag} style={{ padding: "4px 12px", background: "rgba(178,255,89,0.08)", border: "1px solid rgba(178,255,89,0.22)", borderRadius: 2, fontSize: 11, color: ACC }}>{tag}</span>
                ))}
              </div>
            </div>

            <SH num="00" title="What You Will Learn" color={ACC} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 10, margin: "24px 0 36px" }}>
              {[
                { icon: "⚙️", title: "Environment Setup",   desc: "Anaconda, Jupyter, VS Code + Copilot — everything working before line 1", color: "#4FC3F7",  section: "setup"   },
                { icon: "🐍", title: "Python Fundamentals", desc: "Variables, lists, dicts, functions, file I/O — the 20% you use 80% of the time", color: "#81C784",  section: "python"  },
                { icon: "🐼", title: "Pandas Essentials",   desc: "6 core operations: load, select, groupby, clean, derive columns, sort/rank", color: "#FFD54F",  section: "pandas"  },
                { icon: "🤖", title: "GitHub Copilot",      desc: "4 real patterns: how to use comments to generate data analysis code", color: "#6E40C9",  section: "copilot" },
                { icon: "✨", title: "AI Analytics Tools",  desc: "Copilot, ChatGPT Code Interpreter, Julius AI, PandasAI — when to use each", color: "#FF6D9D",  section: "aitools" },
                { icon: "🔨", title: "Practice (4 tasks)",  desc: "Beginner to Advanced: load/clean, groupby, monthly trends, top-N per group", color: "#FF8A65",  section: "practice"},
              ].map((item, i) => (
                <div key={i} onClick={() => setActiveSection(item.section)} style={{
                  border: `1px solid ${item.color}33`, borderTop: `3px solid ${item.color}`,
                  borderRadius: 4, padding: "14px", background: "#0D0D18",
                  cursor: "pointer", transition: "background 0.2s",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = `${item.color}08`}
                  onMouseLeave={e => e.currentTarget.style.background = "#0D0D18"}
                >
                  <div style={{ fontSize: 20, marginBottom: 8 }}>{item.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#DDD8F0", marginBottom: 5 }}>{item.title}</div>
                  <div style={{ fontSize: 11, color: "#444", lineHeight: 1.6 }}>{item.desc}</div>
                </div>
              ))}
            </div>

            <div style={{ margin: "0 0 20px", padding: "14px 18px", background: "rgba(178,255,89,0.07)", border: "1px solid rgba(178,255,89,0.3)", borderLeft: `3px solid ${ACC}`, borderRadius: 4 }}>
              <div style={{ fontSize: 12, color: ACC, fontWeight: 700, marginBottom: 8 }}>🐍 Why Python for Data Analytics in 2025?</div>
              <div style={{ fontSize: 13, color: "#666", lineHeight: 1.82 }}>
                Python has become the universal language of data. SQL answers questions about structured data. Python goes further — it transforms, visualises, models, and automates. 87% of data analyst job postings now mention Python. With GitHub Copilot, you will write production-quality code even as a beginner. The gap between knowing Python and not knowing it is the gap between junior and mid-level analyst.
              </div>
            </div>

            <NavBtns onNext={() => setActiveSection("setup")} />
          </div>
        )}

        {/* ── SETUP ── */}
        {activeSection === "setup" && (
          <div>
            <SH num="01" title="Environment Setup" color="#4FC3F7" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 20px" }}>
              Getting your environment right the first time saves hours of frustration. Follow these steps in order — do not skip any. By the end you will have Python, Jupyter, VS Code, and GitHub Copilot all working together.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 8, margin: "0 0 28px" }}>
              {[
                { step: "01", title: "Install Anaconda", color: "#4FC3F7",
                  desc: "Anaconda installs Python + 250 data science libraries (pandas, numpy, matplotlib, scikit-learn) in one click.",
                  cmd: "# Download from: anaconda.com/download\n# Choose Python 3.11+, 64-bit\n# After install, open Anaconda Navigator\n# Verify: open terminal → type: python --version",
                  note: "Anaconda is the standard for data science environments. It avoids the nightmare of manually installing and managing conflicting library versions." },
                { step: "02", title: "Launch Jupyter Notebook", color: "#81C784",
                  desc: "Jupyter is the interactive environment where you will write and run Python — one cell at a time. Perfect for exploration and analysis.",
                  cmd: "# From Anaconda Navigator: click Launch on Jupyter Notebook\n# OR from terminal:\njupyter notebook\n\n# Creates a local server at http://localhost:8888\n# Your browser opens automatically",
                  note: "Create a folder called 'phase3-analytics' and keep all your notebooks there. Name each notebook clearly: 01_data_loading.ipynb, 02_eda.ipynb etc." },
                { step: "03", title: "Install VS Code", color: "#FFD54F",
                  desc: "VS Code is the best code editor for Python. Lighter than PyCharm, more powerful than Jupyter for writing scripts and longer projects.",
                  cmd: "# Download from: code.visualstudio.com\n# After install, add these extensions:\n# 1. Python (Microsoft) — Ctrl+Shift+X → search Python\n# 2. Jupyter — run .ipynb notebooks in VS Code\n# 3. GitHub Copilot — AI code completion",
                  note: "You will use both Jupyter (for exploration) and VS Code (for scripts). They complement each other — Jupyter for discovery, VS Code for production." },
                { step: "04", title: "Activate GitHub Copilot", color: "#6E40C9",
                  desc: "Copilot is the AI that writes code with you. It reads your comments and generates suggestions inline as you type.",
                  cmd: "# In VS Code:\n# Ctrl+Shift+X → search 'GitHub Copilot' → Install\n# Sign in with your GitHub account\n# Test it: create a new .py file\n# Type: # load a CSV file and print the first 5 rows\n# Press Enter — Copilot suggests the code",
                  note: "Free for students via GitHub Education Pack (github.com/education). For non-students: $10/month or $19/month for Pro. Worth every penny." },
                { step: "05", title: "Install Key Libraries", color: "#FF8A65",
                  desc: "A few libraries are not in Anaconda by default. Install them now so they are ready when you need them.",
                  cmd: "# Open Anaconda Prompt (Windows) or Terminal (Mac)\n# Run these commands:\npip install ydata-profiling\npip install pandasai\npip install plotly\npip install openpyxl\n\n# Verify all core libraries work:\npython -c \"import pandas, numpy, matplotlib, sklearn; print('All good!')\"",
                  note: "If pip install fails, try: conda install package-name. Some packages work better through conda on Windows." },
                { step: "06", title: "Create Your Project Structure", color: "#CE93D8",
                  desc: "A clean folder structure now saves confusion later. Set this up before writing a single line of analysis.",
                  cmd: "phase3-analytics/\n├── data/           ← raw CSV files go here\n├── notebooks/      ← Jupyter .ipynb files\n├── scripts/        ← reusable .py scripts\n├── outputs/        ← charts, reports, CSVs\n└── README.md       ← what this project is",
                  note: "Always keep raw data separate from processed data. Never overwrite your raw files. Name notebooks with numbers: 01_, 02_ to maintain order." },
              ].map((s, i) => (
                <div key={i} style={{ border: `1px solid ${s.color}33`, borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ padding: "14px 18px", background: `${s.color}0A`, display: "flex", alignItems: "flex-start", gap: 14 }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: `${s.color}18`, border: `1px solid ${s.color}44`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ fontSize: 10, color: s.color, fontFamily: "monospace", fontWeight: 700 }}>{s.step}</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#DDD8F0", marginBottom: 4 }}>{s.title}</div>
                      <p style={{ fontSize: 13, color: "#888", lineHeight: 1.6, margin: "0 0 10px" }}>{s.desc}</p>
                      <div style={{ background: "#07070E", border: `1px solid ${s.color}22`, borderRadius: 3, padding: "10px 14px", marginBottom: 8, overflowX: "auto" }}>
                        <pre style={{ margin: 0, fontSize: 12, color: s.color, fontFamily: "monospace", lineHeight: 1.7 }}>{s.cmd}</pre>
                      </div>
                      <div style={{ background: "rgba(255,213,79,0.05)", border: "1px solid rgba(255,213,79,0.2)", borderRadius: 3, padding: "8px 12px" }}>
                        <span style={{ fontSize: 12, color: "#FFD54F" }}>💡 {s.note}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <NavBtns onPrev={() => setActiveSection("intro")} onNext={() => setActiveSection("python")} />
          </div>
        )}

        {/* ── PYTHON BASICS ── */}
        {activeSection === "python" && (
          <div>
            <SH num="02" title="Python Fundamentals for Analysts" color="#81C784" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 20px" }}>
              You do not need to be a software engineer to use Python for analytics. You need to know the <strong style={{ color: "#DDD8F0" }}>20% of Python that does 80% of the work</strong>. These four concepts cover everything a data analyst uses daily — with analogies to Excel so it clicks immediately.
            </p>

            <div style={{ margin: "0 0 20px", padding: "14px 18px", background: "rgba(129,199,132,0.07)", border: "1px solid rgba(129,199,132,0.3)", borderLeft: "3px solid #81C784", borderRadius: 4 }}>
              <div style={{ fontSize: 12, color: "#81C784", fontWeight: 700, marginBottom: 8 }}>🤖 How to Use GitHub Copilot While Learning Python</div>
              <div style={{ fontSize: 13, color: "#666", lineHeight: 1.8 }}>
                As you work through these examples, type the comments into VS Code. Let Copilot generate the code. Then <strong style={{ color: "#DDD8F0" }}>read it, understand it, run it</strong>. Learning happens when you predict what the code does before running — not when you just copy and paste.
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, margin: "0 0 28px" }}>
              {pythonFundamentals.map((item, i) => {
                const open = expandedPy === i;
                return (
                  <div key={i} style={{ border: `1px solid ${open ? item.color + "55" : "#1A1A2E"}`, borderRadius: 4, overflow: "hidden" }}>
                    <button onClick={() => setExpandedPy(open ? null : i)} style={{
                      width: "100%", background: open ? `${item.color}0A` : "#0D0D18",
                      border: "none", cursor: "pointer", padding: "16px 20px",
                      display: "flex", alignItems: "center", gap: 16,
                      fontFamily: "inherit", textAlign: "left",
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: "#DDD8F0" }}>{item.topic}</div>
                        {!open && <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>{item.explanation.substring(0, 70)}...</div>}
                      </div>
                      <span style={{ color: item.color, fontSize: 18, transform: open ? "rotate(45deg)" : "none", transition: "transform 0.2s" }}>+</span>
                    </button>
                    {open && (
                      <div style={{ padding: "0 20px 22px 20px", background: `${item.color}06` }}>
                        <div style={{ height: 1, background: `${item.color}22`, margin: "0 0 16px" }} />
                        <p style={{ fontSize: 13, color: "#888", lineHeight: 1.7, margin: "0 0 14px" }}>{item.explanation}</p>
                        <div style={{ background: "rgba(255,213,79,0.05)", border: "1px solid rgba(255,213,79,0.2)", borderRadius: 3, padding: "8px 12px", marginBottom: 14 }}>
                          <span style={{ fontSize: 12, color: "#FFD54F" }}>📊 Excel analogy: {item.analogy}</span>
                        </div>
                        <div style={{ background: "#07070E", border: `1px solid ${item.color}22`, borderRadius: 3, padding: "14px 16px", overflowX: "auto" }}>
                          <span style={{ fontSize: 9, color: item.color, letterSpacing: "0.15em", fontFamily: "monospace", fontWeight: 700 }}>CODE — TYPE THIS IN JUPYTER</span>
                          <pre style={{ margin: "8px 0 0", fontSize: 12, color: item.color, fontFamily: "monospace", lineHeight: 1.75 }}>{item.code}</pre>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <NavBtns onPrev={() => setActiveSection("setup")} onNext={() => setActiveSection("pandas")} />
          </div>
        )}

        {/* ── PANDAS ── */}
        {activeSection === "pandas" && (
          <div>
            <SH num="03" title="Pandas — The Analyst's Python Library" color="#FFD54F" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 20px" }}>
              Pandas is the most important Python library for data analytics. It provides the <strong style={{ color: "#DDD8F0" }}>DataFrame</strong> — a table of rows and columns that you can manipulate, filter, aggregate, and transform entirely in memory. Think of it as Excel with 10 million rows and no slow-downs.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, margin: "0 0 24px" }}>
              {[
                { stat: "10M+", label: "rows handled easily", color: "#4FC3F7" },
                { stat: "#1", label: "Python data library globally", color: "#FFD54F" },
                { stat: "~2hrs", label: "to learn enough for real work", color: "#81C784" },
              ].map((s, i) => (
                <div key={i} style={{ border: `1px solid ${s.color}33`, borderRadius: 4, padding: "16px", background: `${s.color}06`, textAlign: "center" }}>
                  <div style={{ fontSize: 26, fontWeight: 900, color: s.color, marginBottom: 4 }}>{s.stat}</div>
                  <div style={{ fontSize: 12, color: "#666" }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, margin: "0 0 28px" }}>
              {pandasEssentials.map((item, i) => {
                const open = expandedPd === i;
                return (
                  <div key={i} style={{ border: `1px solid ${open ? item.color + "55" : "#1A1A2E"}`, borderRadius: 4, overflow: "hidden" }}>
                    <button onClick={() => setExpandedPd(open ? null : i)} style={{
                      width: "100%", background: open ? `${item.color}0A` : "#0D0D18",
                      border: "none", cursor: "pointer", padding: "14px 20px",
                      display: "flex", alignItems: "center", gap: 16,
                      fontFamily: "inherit", textAlign: "left",
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <code style={{ fontSize: 14, color: item.color, fontFamily: "monospace", fontWeight: 700 }}>{item.operation}</code>
                        </div>
                        {!open && <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>{item.desc}</div>}
                      </div>
                      <span style={{ color: item.color, fontSize: 18, transform: open ? "rotate(45deg)" : "none", transition: "transform 0.2s" }}>+</span>
                    </button>
                    {open && (
                      <div style={{ padding: "0 20px 22px 20px", background: `${item.color}06` }}>
                        <div style={{ height: 1, background: `${item.color}22`, margin: "0 0 14px" }} />
                        <p style={{ fontSize: 13, color: "#888", lineHeight: 1.7, margin: "0 0 14px" }}>{item.desc}</p>
                        <div style={{ background: "#07070E", border: `1px solid ${item.color}22`, borderRadius: 3, padding: "14px 16px", marginBottom: 14, overflowX: "auto" }}>
                          <span style={{ fontSize: 9, color: item.color, letterSpacing: "0.15em", fontFamily: "monospace", fontWeight: 700 }}>CODE</span>
                          <pre style={{ margin: "8px 0 0", fontSize: 12, color: item.color, fontFamily: "monospace", lineHeight: 1.75 }}>{item.code}</pre>
                        </div>
                        <div style={{ background: "rgba(255,213,79,0.05)", border: "1px solid rgba(255,213,79,0.2)", borderRadius: 3, padding: "8px 12px" }}>
                          <span style={{ fontSize: 12, color: "#FFD54F" }}>💡 {item.tip}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div style={{ margin: "0 0 24px", padding: "14px 18px", background: "rgba(255,213,79,0.07)", border: "1px solid rgba(255,213,79,0.3)", borderLeft: "3px solid #FFD54F", borderRadius: 4 }}>
              <div style={{ fontSize: 12, color: "#FFD54F", fontWeight: 700, marginBottom: 8 }}>🤖 AI Shortcut — Generate Pandas Code</div>
              <div style={{ background: "#07070E", border: "1px solid rgba(255,213,79,0.2)", borderRadius: 3, padding: "10px 12px", marginBottom: 8 }}>
                <code style={{ fontSize: 12, color: "#FFD54F", fontFamily: "monospace", lineHeight: 1.6 }}>
                  "I have a pandas DataFrame called df with columns: customer_id, order_date, product, region, units, price, status. Write code to: (1) filter to completed orders, (2) calculate revenue = units * price, (3) group by region and calculate total revenue, order count, and average order value, (4) sort by total revenue descending."
                </code>
              </div>
              <span style={{ fontSize: 12, color: "#888" }}>Paste your column names and describe what you need — Copilot or ChatGPT generates the full pandas pipeline.</span>
            </div>

            <NavBtns onPrev={() => setActiveSection("python")} onNext={() => setActiveSection("copilot")} />
          </div>
        )}

        {/* ── COPILOT ── */}
        {activeSection === "copilot" && (
          <div>
            <SH num="04" title="GitHub Copilot for Data Analysis" color="#6E40C9" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 20px" }}>
              GitHub Copilot is an AI that <strong style={{ color: "#DDD8F0" }}>writes code inside your editor as you type</strong>. For data analysts, it is transformative — write a comment describing what you want to analyse, and Copilot generates the pandas code. It does not replace understanding; it eliminates the time spent looking up syntax.
            </p>

            <div style={{ background: "#07070E", border: "1px solid #6E40C944", borderRadius: 4, padding: "20px", margin: "0 0 24px" }}>
              <div style={{ fontSize: 10, color: "#6E40C9", fontFamily: "monospace", letterSpacing: "0.15em", marginBottom: 14 }}>HOW COPILOT WORKS IN YOUR EDITOR</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { n: "1", action: "Write a comment describing what you want", example: "# Calculate total revenue per region for completed orders only" },
                  { n: "2", action: "Press Enter and start typing", example: "completed = df[  ← Copilot takes over here" },
                  { n: "3", action: "Copilot shows a grey suggestion inline", example: "df[df['status'] == 'Completed'].groupby('region')['revenue'].sum()" },
                  { n: "4", action: "Press Tab to accept, Esc to dismiss", example: "Keep typing to override the suggestion with your own code" },
                  { n: "5", action: "Read the accepted code before running it", example: "Check column names match your actual DataFrame" },
                ].map((step, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(110,64,201,0.2)", border: "1px solid rgba(110,64,201,0.4)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ fontSize: 10, color: "#6E40C9", fontWeight: 700 }}>{step.n}</span>
                    </div>
                    <div>
                      <div style={{ fontSize: 13, color: "#DDD8F0", fontWeight: 700 }}>{step.action}</div>
                      <code style={{ fontSize: 11, color: "#6E40C9", fontFamily: "monospace", lineHeight: 1.7 }}>{step.example}</code>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#DDD8F0", margin: "32px 0 12px", borderLeft: "3px solid #6E40C9", paddingLeft: 12 }}>4 Real Copilot Patterns for Data Analysts</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, margin: "0 0 28px" }}>
              {copilotPatterns.map((p, i) => {
                const open = expandedCop === i;
                return (
                  <div key={i} style={{ border: `1px solid ${open ? p.color + "55" : "#1A1A2E"}`, borderRadius: 4, overflow: "hidden" }}>
                    <button onClick={() => setExpandedCop(open ? null : i)} style={{
                      width: "100%", background: open ? `${p.color}0A` : "#0D0D18",
                      border: "none", cursor: "pointer", padding: "14px 20px",
                      display: "flex", alignItems: "center", gap: 14,
                      fontFamily: "inherit", textAlign: "left",
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#DDD8F0" }}>{p.scenario}</div>
                        {!open && <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>Click to see the comment pattern and generated code</div>}
                      </div>
                      <span style={{ color: p.color, fontSize: 18, transform: open ? "rotate(45deg)" : "none", transition: "transform 0.2s" }}>+</span>
                    </button>
                    {open && (
                      <div style={{ padding: "0 20px 20px 20px", background: `${p.color}06` }}>
                        <div style={{ height: 1, background: `${p.color}22`, margin: "0 0 14px" }} />
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
                          <div style={{ background: "#07070E", border: `1px solid ${p.color}33`, borderRadius: 3, padding: "12px 14px", overflowX: "auto" }}>
                            <span style={{ fontSize: 9, color: p.color, letterSpacing: "0.15em", fontFamily: "monospace", fontWeight: 700 }}>YOU TYPE (comment)</span>
                            <pre style={{ margin: "8px 0 0", fontSize: 12, color: "#666", fontFamily: "monospace", lineHeight: 1.7 }}>{p.comment}</pre>
                          </div>
                          <div style={{ background: "#07070E", border: `1px solid ${p.color}44`, borderRadius: 3, padding: "12px 14px", overflowX: "auto" }}>
                            <span style={{ fontSize: 9, color: p.color, letterSpacing: "0.15em", fontFamily: "monospace", fontWeight: 700 }}>COPILOT GENERATES</span>
                            <pre style={{ margin: "8px 0 0", fontSize: 12, color: p.color, fontFamily: "monospace", lineHeight: 1.7 }}>{p.generated}</pre>
                          </div>
                        </div>
                        <div style={{ background: "rgba(255,213,79,0.05)", border: "1px solid rgba(255,213,79,0.2)", borderRadius: 3, padding: "8px 12px" }}>
                          <span style={{ fontSize: 12, color: "#FFD54F" }}>💡 {p.tip}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <NavBtns onPrev={() => setActiveSection("pandas")} onNext={() => setActiveSection("aitools")} />
          </div>
        )}

        {/* ── AI TOOLS ── */}
        {activeSection === "aitools" && (
          <div>
            <SH num="05" title="AI Tools for Python Analytics" color="#FF6D9D" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 20px" }}>
              In 2025, every data analyst has a suite of AI tools running alongside their code. These four tools cover every scenario — from writing code to exploring data without code at all. <strong style={{ color: "#DDD8F0" }}>Know which tool to reach for in each situation.</strong>
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, margin: "0 0 28px" }}>
              {aiAnalyticsTools.map((tool, i) => {
                const open = expandedAI === i;
                return (
                  <div key={i} style={{ border: `1px solid ${open ? tool.color + "55" : "#1A1A2E"}`, borderRadius: 4, overflow: "hidden" }}>
                    <button onClick={() => setExpandedAI(open ? null : i)} style={{
                      width: "100%", background: open ? `${tool.color}0A` : "#0D0D18",
                      border: "none", cursor: "pointer", padding: "16px 20px",
                      display: "flex", alignItems: "center", gap: 14,
                      fontFamily: "inherit", textAlign: "left",
                    }}>
                      <span style={{ fontSize: 24, flexShrink: 0 }}>{tool.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 3 }}>
                          <span style={{ fontSize: 15, fontWeight: 700, color: "#DDD8F0" }}>{tool.name}</span>
                          <span style={{ fontSize: 10, color: tool.color, background: `${tool.color}18`, padding: "2px 8px", borderRadius: 2, fontFamily: "monospace" }}>{tool.type}</span>
                        </div>
                        {!open && <div style={{ fontSize: 12, color: "#555" }}>{tool.how.substring(0, 72)}...</div>}
                      </div>
                      <span style={{ color: tool.color, fontSize: 18, transform: open ? "rotate(45deg)" : "none", transition: "transform 0.2s" }}>+</span>
                    </button>
                    {open && (
                      <div style={{ padding: "0 20px 22px 20px", background: `${tool.color}06` }}>
                        <div style={{ height: 1, background: `${tool.color}22`, margin: "0 0 16px" }} />
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                          <div>
                            <span style={{ fontSize: 9, color: tool.color, letterSpacing: "0.15em", fontFamily: "monospace", fontWeight: 700 }}>HOW TO USE</span>
                            <p style={{ fontSize: 13, color: "#AAA", margin: "6px 0 0", lineHeight: 1.65 }}>{tool.how}</p>
                          </div>
                          <div>
                            <span style={{ fontSize: 9, color: tool.color, letterSpacing: "0.15em", fontFamily: "monospace", fontWeight: 700 }}>BEST FOR</span>
                            <p style={{ fontSize: 13, color: "#AAA", margin: "6px 0 0", lineHeight: 1.65 }}>{tool.bestFor}</p>
                          </div>
                        </div>
                        <div style={{ marginBottom: 14 }}>
                          <span style={{ fontSize: 9, color: tool.color, letterSpacing: "0.15em", fontFamily: "monospace", fontWeight: 700 }}>EXAMPLE PROMPTS</span>
                          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
                            {tool.prompts.map((p, j) => (
                              <div key={j} style={{ background: "#07070E", border: `1px solid ${tool.color}22`, borderRadius: 3, padding: "8px 12px" }}>
                                <code style={{ fontSize: 12, color: tool.color, fontFamily: "monospace", lineHeight: 1.6 }}>{p}</code>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                          <div style={{ background: "#07070E", border: "1px solid #1A1A2E", borderRadius: 3, padding: "10px 12px" }}>
                            <span style={{ fontSize: 9, color: "#888", letterSpacing: "0.15em", fontFamily: "monospace", fontWeight: 700 }}>SETUP</span>
                            <p style={{ fontSize: 12, color: "#555", margin: "6px 0 0", lineHeight: 1.6 }}>{tool.setup}</p>
                          </div>
                          <div style={{ background: "rgba(255,100,100,0.05)", border: "1px solid rgba(255,100,100,0.2)", borderRadius: 3, padding: "10px 12px" }}>
                            <span style={{ fontSize: 9, color: "#FF6464", letterSpacing: "0.15em", fontFamily: "monospace", fontWeight: 700 }}>WATCH OUT</span>
                            <p style={{ fontSize: 12, color: "#888", margin: "6px 0 0", lineHeight: 1.6 }}>{tool.warning}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#DDD8F0", margin: "32px 0 12px", borderLeft: `3px solid ${ACC}`, paddingLeft: 12 }}>Which Tool to Use When</h3>
            <div style={{ border: "1px solid #1A1A2E", borderRadius: 4, overflow: "hidden", margin: "16px 0 28px" }}>
              {[
                { situation: "Writing analysis code in VS Code or Jupyter",    tool: "GitHub Copilot",          color: "#6E40C9" },
                { situation: "Exploring an unfamiliar CSV quickly",             tool: "ChatGPT Code Interpreter", color: "#10A37F" },
                { situation: "No-code drag and drop analysis",                  tool: "Julius AI",                color: "#FF6D9D" },
                { situation: "Letting stakeholders query a prepared DataFrame", tool: "PandasAI",                 color: "#B2FF59" },
                { situation: "Complex multi-step analysis needing explanation", tool: "ChatGPT or Claude",        color: "#10A37F" },
                { situation: "Debugging a pandas error",                        tool: "GitHub Copilot or ChatGPT", color: "#6E40C9" },
              ].map((row, i, arr) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 200px", gap: 16, padding: "11px 16px", borderBottom: i < arr.length - 1 ? "1px solid #0F0F18" : "none", background: i % 2 === 0 ? "#0A0A14" : "#07070E", alignItems: "center" }}>
                  <span style={{ fontSize: 13, color: "#888" }}>{row.situation}</span>
                  <span style={{ fontSize: 12, color: row.color, fontWeight: 700 }}>→ {row.tool}</span>
                </div>
              ))}
            </div>

            <NavBtns onPrev={() => setActiveSection("copilot")} onNext={() => setActiveSection("practice")} />
          </div>
        )}

        {/* ── PRACTICE ── */}
        {activeSection === "practice" && (
          <div>
            <SH num="06" title="Practice Exercises — Write and Run These" color="#FF8A65" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 20px" }}>
              These 4 exercises use the RetailCo dataset from Phase 1. <strong style={{ color: "#DDD8F0" }}>Attempt each one before revealing the solution.</strong> Open Jupyter, load the CSV, and write the code yourself — even if Copilot helps. The act of typing and running is what builds the muscle memory.
            </p>

            <div style={{ margin: "0 0 20px", padding: "14px 18px", background: "rgba(255,138,101,0.07)", border: "1px solid rgba(255,138,101,0.3)", borderLeft: "3px solid #FF8A65", borderRadius: 4 }}>
              <div style={{ fontSize: 12, color: "#FF8A65", fontWeight: 700, marginBottom: 8 }}>🛠️ Before You Start</div>
              <div style={{ fontSize: 13, color: "#666", lineHeight: 1.8 }}>
                Put the RetailCo CSV from Phase 1 Part 4 in your <code style={{ fontFamily: "monospace", color: "#FF8A65" }}>data/</code> folder. Open a new Jupyter notebook called <code style={{ fontFamily: "monospace", color: "#FF8A65" }}>01_python_fundamentals.ipynb</code>. Each exercise is one notebook cell. Write your attempt first — then reveal the solution to compare.
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, margin: "0 0 28px" }}>
              {practiceExercises.map((ex, i) => {
                const open = expandedEx === i;
                return (
                  <div key={i} style={{ border: `1px solid ${open ? ex.color + "55" : "#1A1A2E"}`, borderRadius: 4, overflow: "hidden" }}>
                    <button onClick={() => setExpandedEx(open ? null : i)} style={{
                      width: "100%", background: open ? `${ex.color}0A` : "#0D0D18",
                      border: "none", cursor: "pointer", padding: "16px 20px",
                      display: "flex", alignItems: "center", gap: 14,
                      fontFamily: "inherit", textAlign: "left",
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                          <span style={{ fontSize: 10, color: ex.color, background: `${ex.color}18`, padding: "2px 8px", borderRadius: 2, fontFamily: "monospace" }}>{ex.level}</span>
                          <span style={{ fontSize: 15, fontWeight: 700, color: "#DDD8F0" }}>{ex.title}</span>
                        </div>
                        {!open && <div style={{ fontSize: 12, color: "#555" }}>{ex.task.substring(0, 75)}...</div>}
                      </div>
                      <span style={{ color: ex.color, fontSize: 18, transform: open ? "rotate(45deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }}>+</span>
                    </button>
                    {open && (
                      <div style={{ padding: "0 20px 22px 20px", background: `${ex.color}06` }}>
                        <div style={{ height: 1, background: `${ex.color}22`, margin: "0 0 16px" }} />
                        <p style={{ fontSize: 13, color: "#AAA", lineHeight: 1.7, margin: "0 0 14px" }}>{ex.task}</p>
                        <div style={{ background: "rgba(255,213,79,0.05)", border: "1px solid rgba(255,213,79,0.2)", borderRadius: 3, padding: "10px 14px", marginBottom: 14 }}>
                          <span style={{ fontSize: 9, color: "#FFD54F", letterSpacing: "0.15em", fontFamily: "monospace", fontWeight: 700 }}>HINT — try before solution</span>
                          <p style={{ fontSize: 12, color: "#888", margin: "6px 0 0", lineHeight: 1.6, fontFamily: "monospace" }}>{ex.hint}</p>
                        </div>
                        <div style={{ background: "#07070E", border: `1px solid ${ex.color}22`, borderRadius: 3, padding: "14px 16px", overflowX: "auto" }}>
                          <span style={{ fontSize: 9, color: ex.color, letterSpacing: "0.15em", fontFamily: "monospace", fontWeight: 700 }}>SOLUTION</span>
                          <pre style={{ margin: "8px 0 0", fontSize: 12, color: "#81C784", fontFamily: "monospace", lineHeight: 1.75 }}>{ex.solution}</pre>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <NavBtns onPrev={() => setActiveSection("aitools")} onNext={() => setActiveSection("quiz")} nextLabel="Take the Quiz →" />
          </div>
        )}

        {/* ── QUIZ ── */}
        {activeSection === "quiz" && (
          <div>
            <SH num="07" title="Part 1 Knowledge Check" color={ACC} />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 16px" }}>6 questions covering Python basics, pandas operations, and AI tool usage. Score 4+ to proceed to Part 2.</p>

            {!quizState.done ? (
              <div style={{ margin: "28px 0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                  <span style={{ fontSize: 11, color: "#555", fontFamily: "monospace", letterSpacing: "0.15em" }}>QUESTION {quizState.idx + 1} / {quizQuestions.length}</span>
                  <span style={{ fontSize: 11, color: ACC, fontFamily: "monospace" }}>SCORE: {quizState.score} / {quizState.idx}</span>
                </div>
                <div style={{ height: 3, background: "#1A1A2E", borderRadius: 2, marginBottom: 28, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${(quizState.idx / quizQuestions.length) * 100}%`, background: `linear-gradient(90deg, ${ACC}, #4FC3F7)`, transition: "width 0.4s" }} />
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
                    } else if (sel) { bg = "rgba(178,255,89,0.06)"; border = ACC; col = ACC; }
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
                  <div style={{ margin: "20px 0 0", padding: "14px 18px", background: "rgba(178,255,89,0.04)", border: `1px solid rgba(178,255,89,0.2)`, borderRadius: 4 }}>
                    <div style={{ fontSize: 10, color: ACC, letterSpacing: "0.15em", marginBottom: 6, fontFamily: "monospace" }}>EXPLANATION</div>
                    <p style={{ fontSize: 13, color: "#888", margin: "0 0 16px", lineHeight: 1.7 }}>
                      {quizQuestions[quizState.idx].explanation}
                    </p>
                    <button onClick={nextQ} style={{ background: ACC, border: "none", borderRadius: 3, padding: "8px 20px", cursor: "pointer", fontFamily: "monospace", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#07070E" }}>
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
                  {quizState.score === 6 ? "Python foundations solid. Ready for EDA and visualisation in Part 2." : quizState.score >= 4 ? "Good pass. Review any sections before Part 2." : "Revisit pandas essentials before moving on."}
                </div>
                <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                  <button onClick={() => setQuizState({ idx: 0, selected: null, answered: false, score: 0, done: false })} style={{ background: "none", border: "1px solid #333", borderRadius: 3, padding: "8px 20px", cursor: "pointer", fontFamily: "monospace", fontSize: 11, color: "#555", letterSpacing: "0.1em" }}>RETAKE</button>
                  <button onClick={() => setActiveSection("intro")} style={{ background: ACC, border: "none", borderRadius: 3, padding: "8px 24px", cursor: "pointer", fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: "#07070E", letterSpacing: "0.1em" }}>REVIEW ↑</button>
                </div>
                <div style={{ marginTop: 40, padding: "22px", background: "#0D0D18", border: "1px solid #1A1A2E", borderRadius: 4, textAlign: "left" }}>
                  <div style={{ fontSize: 11, color: "#555", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 10, fontFamily: "monospace" }}>WHAT IS IN PART 2</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#DDD8F0", marginBottom: 8 }}>Exploratory Data Analysis (EDA) + AI-Powered Profiling</div>
                  <p style={{ fontSize: 13, color: "#555", lineHeight: 1.7, margin: "0 0 14px" }}>
                    Automated EDA with ydata-profiling, Matplotlib and Seaborn visualisations, Plotly interactive charts, PandasAI natural language queries, and how to write a professional EDA report for stakeholders.
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {["ydata-profiling", "Matplotlib", "Seaborn", "Plotly", "PandasAI", "EDA report writing"].map(t => (
                      <span key={t} style={{ padding: "3px 10px", background: "rgba(178,255,89,0.07)", border: "1px solid rgba(178,255,89,0.2)", borderRadius: 2, fontSize: 11, color: ACC }}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "flex-start", marginTop: 48, paddingTop: 24, borderTop: "1px solid #1A1A2E" }}>
              <button onClick={() => setActiveSection("practice")} style={{ background: "none", border: "1px solid #1A1A2E", borderRadius: 3, padding: "8px 18px", cursor: "pointer", fontFamily: "monospace", fontSize: 11, color: "#555", letterSpacing: "0.1em" }}>← Previous</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function SH({ num, title, color }) {
  return (
    <div style={{ marginBottom: 28, paddingBottom: 16, borderBottom: "1px solid #1A1A2E" }}>
      <div style={{ fontSize: 10, color: color, letterSpacing: "0.3em", fontFamily: "monospace", marginBottom: 6 }}>SECTION {num}</div>
      <h2 style={{ margin: 0, fontSize: "clamp(20px,3vw,28px)", fontWeight: 900, color: "#DDD8F0", letterSpacing: "-0.01em" }}>
        <span style={{ color: color }}>{num}. </span>{title}
      </h2>
    </div>
  );
}

function NavBtns({ onPrev, onNext, nextLabel = "Next Section →" }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 48, paddingTop: 24, borderTop: "1px solid #1A1A2E" }}>
      {onPrev
        ? <button onClick={onPrev} style={{ background: "none", border: "1px solid #1A1A2E", borderRadius: 3, padding: "8px 18px", cursor: "pointer", fontFamily: "monospace", fontSize: 11, color: "#555", letterSpacing: "0.1em" }}>← Previous</button>
        : <div />}
      {onNext && (
        <button onClick={onNext} style={{ background: "#B2FF59", border: "none", borderRadius: 3, padding: "8px 24px", cursor: "pointer", fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: "#07070E", letterSpacing: "0.1em" }}>{nextLabel}</button>
      )}
    </div>
  );
}
