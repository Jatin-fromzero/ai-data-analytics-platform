"use client";
// @ts-nocheck
import { useState } from "react";

// All code stored as .join("\n") arrays — no template literal conflicts

const GCP_SETUP_CODE = [
  "# GCP Quick Setup for Analysts",
  "# console.cloud.google.com",
  "",
  "# 1. Create project",
  "gcloud projects create retailco-analytics",
  "gcloud config set project retailco-analytics",
  "",
  "# 2. Enable key services",
  "gcloud services enable bigquery.googleapis.com",
  "gcloud services enable storage.googleapis.com",
  "gcloud services enable dataflow.googleapis.com",
  "",
  "# 3. Create a BigQuery dataset",
  "bq mk --dataset retailco-analytics:production",
  "bq mk --dataset retailco-analytics:staging",
  "",
  "# 4. Load a CSV into BigQuery",
  "bq load --autodetect --source_format=CSV",
  "  retailco-analytics:production.orders",
  "  gs://your-bucket/orders.csv",
  "",
  "# 5. Run a query from CLI",
  "bq query --use_legacy_sql=false",
  "  'SELECT COUNT(*) FROM production.orders'",
].join("\n");

const DBT_INTRO_CODE = [
  "# dbt (data build tool) — SQL with superpowers",
  "# pip install dbt-bigquery",
  "",
  "# dbt project structure:",
  "# retailco_dbt/",
  "# |-- dbt_project.yml       project config",
  "# |-- profiles.yml          database connection",
  "# |-- models/               your SQL files",
  "#     |-- staging/          raw data cleaning",
  "#     |-- marts/            business-ready tables",
  "# |-- tests/                data quality checks",
  "# |-- macros/               reusable SQL snippets",
  "",
  "# Initialize a new dbt project",
  "dbt init retailco_dbt",
  "",
  "# Run all models",
  "dbt run",
  "",
  "# Test data quality",
  "dbt test",
  "",
  "# Generate documentation",
  "dbt docs generate",
  "dbt docs serve",
].join("\n");

const DBT_MODEL_CODE = [
  "-- models/staging/stg_orders.sql",
  "-- Staging model: clean raw orders data",
  "",
  "{{ config(materialized='view') }}",
  "",
  "SELECT",
  "    order_id,",
  "    customer_id,",
  "    product_id,",
  "    order_date::DATE                          AS order_date,",
  "    UPPER(TRIM(region))                       AS region,",
  "    UPPER(TRIM(status))                       AS status,",
  "    units::INTEGER                            AS units,",
  "    price::NUMERIC                            AS unit_price,",
  "    cost::NUMERIC                             AS unit_cost,",
  "    units * price                             AS revenue,",
  "    units * (price - cost)                    AS profit",
  "FROM {{ source('raw', 'orders') }}",
  "WHERE order_id IS NOT NULL",
  "  AND order_date IS NOT NULL",
  "",
  "-- models/marts/fct_orders.sql",
  "-- Fact table: business-ready orders",
  "",
  "{{ config(materialized='table') }}",
  "",
  "SELECT",
  "    o.*,",
  "    c.country,",
  "    c.segment                                 AS customer_segment,",
  "    p.category,",
  "    p.product_name,",
  "    DATE_TRUNC(o.order_date, MONTH)           AS order_month,",
  "    EXTRACT(YEAR FROM o.order_date)           AS order_year",
  "FROM {{ ref('stg_orders') }}             o",
  "LEFT JOIN {{ ref('stg_customers') }}     c USING (customer_id)",
  "LEFT JOIN {{ ref('stg_products') }}      p USING (product_id)",
].join("\n");

const DBT_TEST_CODE = [
  "# schema.yml — dbt data quality tests",
  "# Place in models/ folder alongside your SQL files",
  "",
  "version: 2",
  "",
  "models:",
  "  - name: stg_orders",
  "    description: Cleaned orders from raw source",
  "    columns:",
  "      - name: order_id",
  "        description: Unique order identifier",
  "        tests:",
  "          - unique",
  "          - not_null",
  "      - name: status",
  "        tests:",
  "          - not_null",
  "          - accepted_values:",
  "              values: ['COMPLETED', 'RETURNED', 'CANCELLED']",
  "      - name: revenue",
  "        tests:",
  "          - not_null",
  "          - dbt_utils.expression_is_true:",
  "              expression: '>= 0'",
  "      - name: customer_id",
  "        tests:",
  "          - not_null",
  "          - relationships:",
  "              to: ref('stg_customers')",
  "              field: customer_id",
  "",
  "# Run just the tests:",
  "# dbt test --select stg_orders",
].join("\n");

const AIRFLOW_CODE = [
  "# Apache Airflow DAG — RetailCo daily pipeline",
  "# File: dags/retailco_daily_pipeline.py",
  "",
  "from airflow import DAG",
  "from airflow.operators.bash import BashOperator",
  "from airflow.operators.python import PythonOperator",
  "from airflow.providers.google.cloud.transfers.local_to_gcs import (",
  "    LocalFilesystemToGCSOperator",
  ")",
  "from datetime import datetime, timedelta",
  "",
  "default_args = {",
  "    'owner': 'data-team',",
  "    'retries': 2,",
  "    'retry_delay': timedelta(minutes=5),",
  "    'email_on_failure': True,",
  "    'email': ['analyst@retailco.com'],",
  "}",
  "",
  "with DAG(",
  "    dag_id='retailco_daily_pipeline',",
  "    default_args=default_args,",
  "    schedule_interval='0 6 * * *',   # 6am every day",
  "    start_date=datetime(2024, 1, 1),",
  "    catchup=False,",
  "    tags=['retailco', 'daily'],",
  ") as dag:",
  "",
  "    # Task 1: Upload CSV to GCS",
  "    upload_to_gcs = LocalFilesystemToGCSOperator(",
  "        task_id='upload_orders_to_gcs',",
  "        src='/data/orders_latest.csv',",
  "        dst='raw/orders/orders_{{ ds }}.csv',",
  "        bucket='retailco-raw-data',",
  "    )",
  "",
  "    # Task 2: Load to BigQuery",
  "    load_to_bq = BashOperator(",
  "        task_id='load_to_bigquery',",
  "        bash_command=(",
  "            'bq load --autodetect --source_format=CSV'",
  "            ' retailco-analytics:staging.orders_raw'",
  "            ' gs://retailco-raw-data/raw/orders/orders_{{ ds }}.csv'",
  "        ),",
  "    )",
  "",
  "    # Task 3: Run dbt transformations",
  "    run_dbt = BashOperator(",
  "        task_id='run_dbt_models',",
  "        bash_command='cd /dbt/retailco_dbt && dbt run --target prod',",
  "    )",
  "",
  "    # Task 4: Run dbt tests",
  "    test_dbt = BashOperator(",
  "        task_id='test_dbt_models',",
  "        bash_command='cd /dbt/retailco_dbt && dbt test --target prod',",
  "    )",
  "",
  "    # Define dependencies (order of execution)",
  "    upload_to_gcs >> load_to_bq >> run_dbt >> test_dbt",
].join("\n");

const CLOUD_COMPARE_CODE = [
  "# Cloud provider comparison for analysts",
  "",
  "# AWS (Amazon Web Services)",
  "# Compute:  EC2, Lambda (serverless)",
  "# Storage:  S3 (object), RDS (relational)",
  "# Analytics: Redshift (warehouse), Athena (query S3)",
  "# BI:        QuickSight",
  "",
  "# GCP (Google Cloud Platform)",
  "# Compute:  Compute Engine, Cloud Functions",
  "# Storage:  Cloud Storage, Cloud SQL",
  "# Analytics: BigQuery (best in class), Dataflow",
  "# BI:        Looker, Looker Studio",
  "",
  "# Azure (Microsoft)",
  "# Compute:  Azure VMs, Azure Functions",
  "# Storage:  Blob Storage, Azure SQL",
  "# Analytics: Synapse Analytics, Azure Data Factory",
  "# BI:        Power BI (native integration)",
  "",
  "# For analytics: GCP / BigQuery is easiest to start",
  "# For Microsoft shops: Azure + Synapse + Power BI",
  "# For AWS shops: Redshift + Athena + QuickSight",
  "# Most enterprise teams use 2-3 providers",
].join("\n");

const quizData = [
  {
    q: "What does dbt (data build tool) do that raw SQL alone cannot?",
    opts: [
      "It replaces SQL entirely with Python",
      "It adds version control, testing, documentation, modular references, and CI/CD to SQL transformations — treating data pipelines like software engineering",
      "It is only used for loading data from CSV files",
      "It connects to BI tools directly without a database"
    ],
    ans: 1,
    exp: "dbt transforms SQL from a one-off script into a managed software project. ref() creates dependencies between models, tests validate data quality automatically, docs generate searchable documentation, and version control via Git means every change is tracked and reversible. This is the standard in modern data teams."
  },
  {
    q: "In dbt, what is the difference between materialized='view' and materialized='table'?",
    opts: [
      "Views are faster; tables are slower",
      "View: SQL query runs on every access, no storage cost. Table: query runs once at dbt run time, results stored physically — faster to query but uses storage.",
      "Tables are only for staging; views for marts",
      "There is no practical difference"
    ],
    ans: 1,
    exp: "View: every time a downstream model or BI tool queries it, the SQL executes fresh. Zero storage cost, always current, can be slow on large data. Table: dbt runs the SQL once and stores the result. Queries are fast, but you need dbt run to refresh it. Use views for staging (fast iteration), tables for marts (query performance)."
  },
  {
    q: "What is Apache Airflow used for in a data engineering stack?",
    opts: [
      "It is a BI tool for building dashboards",
      "It orchestrates and schedules data pipelines — defining tasks, dependencies between them, retry logic, and alerting on failures",
      "It replaces dbt for data transformations",
      "It is a cloud storage service"
    ],
    ans: 1,
    exp: "Airflow is an orchestration platform — a scheduler and monitor for data pipelines. You define a DAG (Directed Acyclic Graph) of tasks with dependencies: upload file > load to BigQuery > run dbt > test dbt. Airflow runs this on schedule (e.g. 6am daily), retries failed tasks, and emails on failure."
  },
  {
    q: "What is the modern data stack? Name the correct combination.",
    opts: [
      "Excel + Access + SSRS",
      "A cloud data warehouse (BigQuery/Snowflake) + dbt for transforms + Airflow/Fivetran for ingestion + a BI tool (Tableau/Power BI/Looker)",
      "MySQL + PHP + Tableau",
      "Python + pandas + matplotlib"
    ],
    ans: 1,
    exp: "The modern data stack: (1) Source systems (CRMs, apps), (2) Ingestion tools (Fivetran, Airbyte) to pull data in, (3) Cloud warehouse (BigQuery, Snowflake, Redshift) to store it, (4) dbt to transform it, (5) Orchestration (Airflow, Prefect) to schedule it, (6) BI tools (Tableau, Power BI, Looker) to visualise it."
  },
  {
    q: "In dbt, {{ ref('stg_orders') }} inside a model does what?",
    opts: [
      "Imports a Python function called stg_orders",
      "Creates a dependency on the stg_orders model — dbt runs stg_orders first, then this model, and resolves the correct table name for any environment",
      "References an external API",
      "It is a comment and is ignored at runtime"
    ],
    ans: 1,
    exp: "ref() is dbt's dependency management system. It creates a lineage graph — dbt knows stg_orders must run before any model that references it. It also resolves the full table name automatically for dev/staging/prod environments. This is what allows dbt to run models in the right order automatically."
  },
  {
    q: "What is a DAG in Apache Airflow?",
    opts: [
      "A type of database index",
      "A Directed Acyclic Graph — a collection of tasks with defined dependencies that cannot form circular loops, ensuring tasks run in the correct order",
      "A data quality test",
      "A cloud storage bucket"
    ],
    ans: 1,
    exp: "DAG = Directed Acyclic Graph. Directed: tasks run in a defined direction (A before B). Acyclic: no circular dependencies (A cannot depend on itself). Graph: tasks are nodes, dependencies are edges. In Airflow, a DAG defines your entire pipeline: which tasks exist, what order they run in, and what to do on failure."
  },
];

const sections = [
  { id: "intro",   label: "Overview"   },
  { id: "cloud",   label: "Cloud 101"  },
  { id: "stack",   label: "Data Stack" },
  { id: "dbt",     label: "dbt"        },
  { id: "airflow", label: "Airflow"    },
  { id: "project", label: "Project"    },
  { id: "quiz",    label: "Quiz"       },
];

export default function Phase5Part1() {
  const [sec, setSec] = useState("intro");
  const [openStep, setOpenStep] = useState(null);
  const [checkedSteps, setCheckedSteps] = useState({});
  const [quiz, setQuiz] = useState({ idx: 0, sel: null, answered: false, score: 0, done: false });

  const ACC = "#4FC3F7";

  const toggleStep = (k) => setCheckedSteps(p => ({ ...p, [k]: !p[k] }));
  const answerQ = (i) => {
    if (quiz.answered) return;
    setQuiz(q => ({ ...q, sel: i, answered: true, score: q.score + (i === quizData[q.idx].ans ? 1 : 0) }));
  };
  const nextQ = () => {
    if (quiz.idx + 1 >= quizData.length) setQuiz(q => ({ ...q, done: true }));
    else setQuiz(q => ({ ...q, idx: q.idx + 1, sel: null, answered: false }));
  };

  const projectTasks = [
    {
      num: "T1", title: "GCP + BigQuery Setup", col: "#4FC3F7",
      steps: [
        "Go to console.cloud.google.com — sign in with your Google account",
        "Create a new project called 'retailco-analytics'",
        "Enable BigQuery API: APIs & Services > Enable APIs > search BigQuery",
        "Open BigQuery console: navigate to BigQuery in the left menu",
        "Create dataset 'production': click your project > Create Dataset",
        "Create dataset 'staging': same process",
        "Upload orders.csv: Create Table > Upload > CSV > auto-detect schema",
        "Upload customers.csv and products.csv the same way",
        "Run verification query: SELECT COUNT(*) FROM production.orders",
        "Note your project ID — you will need it for dbt profiles.yml",
      ],
      code: GCP_SETUP_CODE,
      aiPrompt: "I am setting up Google Cloud Platform for data analytics. I need to: (1) create a BigQuery dataset with staging and production environments, (2) load 3 CSV files (orders, customers, products) into the production dataset, (3) set up service account credentials for dbt. Walk me through each step.",
    },
    {
      num: "T2", title: "dbt Project Setup", col: "#81C784",
      steps: [
        "Install dbt-bigquery: pip install dbt-bigquery",
        "Run: dbt init retailco_dbt — enter your project name and BigQuery settings",
        "Edit profiles.yml: set project to your GCP project ID, dataset to 'production'",
        "Test connection: dbt debug — should show 'All checks passed'",
        "Create models/staging/ folder",
        "Create stg_orders.sql using the template in this section",
        "Create stg_customers.sql and stg_products.sql — follow same pattern",
        "Create sources.yml in models/staging/ defining the raw source tables",
        "Run: dbt run — check BigQuery for new views",
        "Create schema.yml with not_null and unique tests for order_id",
        "Run: dbt test — all tests should pass",
      ],
      code: DBT_MODEL_CODE,
      aiPrompt: "I am setting up a dbt project connected to BigQuery. My raw orders table has columns: order_id, customer_id, product_id, order_date, units, price, cost, status, region. Write: (1) a staging model that cleans and standardises this table, (2) a schema.yml with data quality tests for the key columns.",
    },
    {
      num: "T3", title: "dbt Marts and Documentation", col: "#FFD54F",
      steps: [
        "Create models/marts/ folder",
        "Create fct_orders.sql: join stg_orders to stg_customers and stg_products",
        "Add derived columns: order_month, order_year, margin_pct, is_returned",
        "Set materialized='table' in the config block for fct_orders",
        "Create dim_customers.sql: customer-level aggregations (total orders, total revenue, first order date)",
        "Add schema.yml tests for fct_orders: unique order_id, revenue >= 0",
        "Run: dbt run --select marts — only run mart models",
        "Run: dbt test --select fct_orders",
        "Run: dbt docs generate && dbt docs serve",
        "Open the documentation in browser — explore the lineage graph",
      ],
      code: DBT_TEST_CODE,
      aiPrompt: "I have staging models in dbt: stg_orders (order_id, customer_id, product_id, order_date, units, unit_price, unit_cost, revenue, profit, status, region) and stg_customers (customer_id, country, segment). Write a fct_orders mart model that joins them, adds order_month and margin_pct columns, and uses materialized='table'.",
    },
    {
      num: "T4", title: "Airflow Pipeline", col: "#FF8A65",
      steps: [
        "Install Airflow: pip install apache-airflow apache-airflow-providers-google",
        "Initialise: airflow db init",
        "Start webserver: airflow webserver --port 8080",
        "Start scheduler: airflow scheduler (in a separate terminal)",
        "Open browser: localhost:8080 — login (admin/admin default)",
        "Create dags/ folder in your project",
        "Create retailco_daily_pipeline.py using the template in this section",
        "Edit the file paths and GCS bucket names to match your setup",
        "In Airflow UI: Dags tab > find your DAG > toggle it on",
        "Trigger a manual run: click the play button",
        "Monitor: click the DAG name > Graph View to see task status",
        "Check logs: click any task > Logs to debug failures",
      ],
      code: AIRFLOW_CODE,
      aiPrompt: "Write an Apache Airflow DAG that runs daily at 6am and: (1) checks if a new orders CSV exists at /data/orders_latest.csv, (2) uploads it to a GCS bucket, (3) loads it into a BigQuery staging table, (4) runs dbt run, (5) runs dbt test, (6) sends an email alert if any step fails. Include retry logic and proper default_args.",
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#07070E", color: "#DDD8F0", fontFamily: "Georgia, serif" }}>

      {/* NAV */}
      <div style={{ background: "#0A0A14", borderBottom: "1px solid #16162A", padding: "0 24px", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 940, margin: "0 auto", display: "flex", alignItems: "center", overflowX: "auto" }}>
          <div style={{ fontSize: 10, color: ACC, letterSpacing: "0.2em", textTransform: "uppercase", padding: "14px 20px 14px 0", borderRight: "1px solid #1A1A2E", marginRight: 12, whiteSpace: "nowrap" }}>
            P5 · PART 1
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
                PHASE 5 · PART 1 OF 2 · WEEK 14
              </div>
              <h1 style={{ fontSize: "clamp(26px,5vw,44px)", fontWeight: 900, margin: "0 0 16px", lineHeight: 1.12, letterSpacing: "-0.02em" }}>
                Cloud Platforms<br />
                <span style={{ color: ACC }}>+ dbt + Airflow</span><br />
                <span style={{ fontStyle: "italic", fontWeight: 400, fontSize: "0.65em", color: "#555" }}>Data Engineering for Analysts</span>
              </h1>
              <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, maxWidth: 580, margin: "0 0 24px" }}>
                Phase 5 is where you cross from analyst into data engineer territory. You will learn the modern data stack — GCP and BigQuery, dbt for SQL transformations with version control and testing, and Apache Airflow for scheduling and monitoring production pipelines. These skills are what separate mid-level from senior data analysts in 2025.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {["~6 hours", "GCP + BigQuery", "dbt fundamentals", "Staging and mart models", "Data quality tests", "dbt docs", "Apache Airflow", "DAG pipelines", "6-question quiz"].map(t => (
                  <span key={t} style={{ padding: "4px 12px", background: "rgba(79,195,247,0.08)", border: "1px solid rgba(79,195,247,0.22)", borderRadius: 2, fontSize: 11, color: ACC }}>{t}</span>
                ))}
              </div>
            </div>

            <SH n="00" title="What You Will Learn" col={ACC} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 10, margin: "24px 0 36px" }}>
              {[
                { icon: "☁️", title: "Cloud 101",     desc: "AWS vs GCP vs Azure for analysts — what each offers and when to use each", col: "#4FC3F7",  s: "cloud"   },
                { icon: "🏗️", title: "Modern Data Stack", desc: "Ingestion → warehouse → transform → BI — the full pipeline architecture", col: "#81C784",  s: "stack"   },
                { icon: "🔧", title: "dbt",            desc: "SQL models, ref(), staging vs marts, data tests, auto-documentation",      col: "#FFD54F",  s: "dbt"     },
                { icon: "🌊", title: "Apache Airflow", desc: "DAGs, tasks, schedule intervals, retry logic, monitoring pipelines",       col: "#FF8A65",  s: "airflow" },
                { icon: "🔨", title: "Project (4 tasks)", desc: "GCP setup → dbt staging → dbt marts → Airflow pipeline",               col: "#CE93D8",  s: "project" },
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

            <Box col={ACC} icon="🎯" title="Why Analysts Need Data Engineering Skills">
              The line between analyst and data engineer is blurring. Senior analyst roles in 2025 regularly list dbt, Airflow, and cloud warehouses in job descriptions. Even if you never build a production pipeline alone, understanding how data moves from source to BI tool makes you dramatically more effective — you can debug data quality issues, talk to engineers as an equal, and build your own pipelines when you need to move fast.
            </Box>
            <Nav onNext={() => setSec("cloud")} />
          </div>
        )}

        {/* ── CLOUD 101 ── */}
        {sec === "cloud" && (
          <div>
            <SH n="01" title="Cloud Platforms 101 for Analysts" col="#4FC3F7" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 16px" }}>
              Cloud platforms have replaced on-premise data infrastructure. <strong style={{ color: "#DDD8F0" }}>For analysts, cloud means: no server to manage, infinite scale, pay only for what you use, and access to the best analytics tools in the world from a browser.</strong> You do not need to be a cloud engineer — but you need to know what each service does and why.
            </p>

            <CodeBlock col="#4FC3F7" label="CLOUD PROVIDER COMPARISON" code={CLOUD_COMPARE_CODE} />

            <SH n="01b" title="GCP Services Analysts Actually Use" col="#4FC3F7" />
            <div style={{ border: "1px solid #1A1A2E", borderRadius: 4, overflow: "hidden", margin: "0 0 20px" }}>
              {[
                { service: "BigQuery",       tier: "★★★★★", desc: "Serverless SQL warehouse. Query terabytes in seconds. Pay per query. The best analytics database in the cloud.", col: "#4FC3F7" },
                { service: "Cloud Storage",  tier: "★★★★",  desc: "Object storage for raw files (CSV, JSON, Parquet). Feeds into BigQuery. S3 equivalent. Cheap and reliable.", col: "#81C784" },
                { service: "Looker Studio",  tier: "★★★★",  desc: "Free BI tool — covered in Phase 4. Connects natively to BigQuery. Zero config, shareable links.", col: "#FFD54F" },
                { service: "Cloud Run",      tier: "★★★",   desc: "Run containerised apps without managing servers. Deploy a Streamlit app or Python script as a scalable service.", col: "#FF8A65" },
                { service: "Vertex AI",      tier: "★★★",   desc: "Managed ML platform. Train, deploy, and monitor models. AutoML included. BigQuery ML lets you train models in SQL.", col: "#CE93D8" },
                { service: "Dataflow",       tier: "★★",    desc: "Managed Apache Beam for real-time streaming pipelines. Advanced — for when batch processing is not fast enough.", col: "#F48FB1" },
              ].map((r, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "130px 70px 1fr", gap: 12, padding: "10px 16px", borderBottom: i < 5 ? "1px solid #0F0F18" : "none", background: i % 2 === 0 ? "#0A0A14" : "#07070E", alignItems: "start" }}>
                  <span style={{ fontSize: 12, color: r.col, fontWeight: 700 }}>{r.service}</span>
                  <span style={{ fontSize: 11, color: "#555", fontFamily: "monospace" }}>{r.tier}</span>
                  <span style={{ fontSize: 12, color: "#888" }}>{r.desc}</span>
                </div>
              ))}
            </div>

            <Box col="#FFD54F" icon="💡" title="GCP Free Tier — What You Get Without Paying">
              BigQuery: 1TB queries + 10GB storage per month free. Cloud Storage: 5GB free. This covers all course exercises and most portfolio projects. You do NOT need a credit card to start. Go to console.cloud.google.com and create a project — the free tier activates automatically.
            </Box>

            <SH n="01c" title="Cloud Concepts Every Analyst Should Know" col="#4FC3F7" />
            <div style={{ border: "1px solid #1A1A2E", borderRadius: 4, overflow: "hidden", margin: "0 0 20px" }}>
              {[
                { concept: "Data warehouse",  def: "Structured, query-optimised storage for analytics. Examples: BigQuery, Snowflake, Redshift. Column-oriented for fast aggregations.", col: "#4FC3F7" },
                { concept: "Data lake",       def: "Raw, unstructured storage at scale. Files in any format (CSV, JSON, Parquet). Examples: S3, GCS. Cheap but requires processing before analysis.", col: "#81C784" },
                { concept: "Lakehouse",       def: "Combines warehouse query performance with lake storage flexibility. Examples: Databricks, BigLake. The emerging standard.", col: "#FFD54F" },
                { concept: "ETL vs ELT",      def: "ETL: Extract-Transform-Load (transform before loading). ELT: Extract-Load-Transform (load raw, transform in warehouse with SQL/dbt). Modern stacks use ELT.", col: "#FF8A65" },
                { concept: "Partitioning",    def: "Split a large table into smaller chunks by date or key. BigQuery queries only relevant partitions — reduces bytes scanned and cost dramatically.", col: "#CE93D8" },
                { concept: "Cluster keys",    def: "Within each partition, sort rows by a frequently filtered column (e.g. region). Speeds up WHERE region = 'North' queries significantly.", col: "#F48FB1" },
              ].map((r, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 14, padding: "10px 16px", borderBottom: i < 5 ? "1px solid #0F0F18" : "none", background: i % 2 === 0 ? "#0A0A14" : "#07070E", alignItems: "start" }}>
                  <span style={{ fontSize: 12, color: r.col, fontWeight: 700 }}>{r.concept}</span>
                  <span style={{ fontSize: 12, color: "#888" }}>{r.def}</span>
                </div>
              ))}
            </div>
            <Nav onPrev={() => setSec("intro")} onNext={() => setSec("stack")} />
          </div>
        )}

        {/* ── DATA STACK ── */}
        {sec === "stack" && (
          <div>
            <SH n="02" title="The Modern Data Stack" col="#81C784" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 16px" }}>
              The modern data stack is the architecture used by data-driven companies like Spotify, Airbnb, and GitLab. It is a collection of best-in-class tools, each doing one job well, connected together. <strong style={{ color: "#DDD8F0" }}>Understanding this architecture makes you a dramatically more effective analyst</strong> — you know where data comes from, where it breaks, and how to fix it.
            </p>

            {/* Stack diagram */}
            <div style={{ background: "#0A0A14", border: "1px solid #81C78433", borderRadius: 4, padding: "20px", margin: "0 0 24px" }}>
              <div style={{ fontSize: 10, color: "#81C784", fontFamily: "monospace", letterSpacing: "0.12em", marginBottom: 16 }}>THE MODERN DATA STACK — LAYER BY LAYER</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { layer: "01  SOURCE SYSTEMS",    tools: "CRM (Salesforce), App DB (PostgreSQL), APIs, Spreadsheets, Events (Segment)", col: "#F48FB1",  desc: "Where data is born" },
                  { layer: "02  INGESTION",         tools: "Fivetran, Airbyte, Stitch, custom Python scripts",                              col: "#CE93D8",  desc: "Moves raw data into the warehouse" },
                  { layer: "03  CLOUD WAREHOUSE",   tools: "BigQuery, Snowflake, Databricks, Amazon Redshift",                              col: "#4FC3F7",  desc: "Central store for all data" },
                  { layer: "04  TRANSFORMATION",    tools: "dbt (SQL), Python scripts, Spark",                                              col: "#81C784",  desc: "Clean, model, and enrich data" },
                  { layer: "05  ORCHESTRATION",     tools: "Apache Airflow, Prefect, Dagster, dbt Cloud Scheduler",                         col: "#FFD54F",  desc: "Schedule and monitor pipelines" },
                  { layer: "06  SEMANTIC LAYER",    tools: "dbt metrics, Looker LookML, AtScale",                                           col: "#FF8A65",  desc: "Defines business metrics consistently" },
                  { layer: "07  BI + CONSUMPTION",  tools: "Tableau, Power BI, Looker Studio, ThoughtSpot, Notebooks",                      col: "#B2FF59",  desc: "Analysts and stakeholders" },
                ].map((row, i, arr) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "180px 1fr 140px", gap: 14, padding: "10px 14px", background: row.col + "08", border: "1px solid " + row.col + "22", borderRadius: 3, alignItems: "center" }}>
                    <span style={{ fontSize: 10, color: row.col, fontFamily: "monospace", fontWeight: 700 }}>{row.layer}</span>
                    <span style={{ fontSize: 12, color: "#888" }}>{row.tools}</span>
                    <span style={{ fontSize: 11, color: row.col, textAlign: "right", fontStyle: "italic" }}>{row.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            <SH n="02b" title="How Data Flows Through the Stack" col="#81C784" />
            <div style={{ border: "1px solid #1A1A2E", borderRadius: 4, overflow: "hidden", margin: "0 0 20px" }}>
              {[
                { step: "1", title: "Source → Warehouse (Ingestion)", desc: "Fivetran or Airbyte connects to your Salesforce CRM and PostgreSQL app database. Every hour, it pulls new and updated records and loads them into BigQuery raw tables — no transformation, just raw data.", col: "#4FC3F7" },
                { step: "2", title: "Warehouse → Staging (dbt)", desc: "dbt staging models clean the raw data: fix column types, standardise text, remove test records, add derived columns. These run as views — no storage cost.", col: "#81C784" },
                { step: "3", title: "Staging → Marts (dbt)", desc: "dbt mart models join staging tables together and build business-ready tables: fct_orders, dim_customers. These run as tables — fast to query by BI tools.", col: "#FFD54F" },
                { step: "4", title: "Orchestration (Airflow)", desc: "Airflow runs the entire pipeline on schedule: trigger ingestion at 5am, run dbt at 5:30am, run tests at 6am, send success/failure notification at 6:15am.", col: "#FF8A65" },
                { step: "5", title: "Marts → BI Tools", desc: "Tableau, Power BI, and Looker Studio connect directly to fct_orders and dim_customers. Stakeholders see fresh, clean, tested data by the time they open their dashboards at 9am.", col: "#B2FF59" },
              ].map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 14, padding: "12px 16px", borderBottom: i < 4 ? "1px solid #0F0F18" : "none", background: i % 2 === 0 ? "#0A0A14" : "#07070E", alignItems: "flex-start" }}>
                  <div style={{ width: 26, height: 26, borderRadius: "50%", background: s.col + "18", border: "1px solid " + s.col + "44", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: 10, color: s.col, fontWeight: 700 }}>{s.step}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#DDD8F0" }}>{s.title}</div>
                    <div style={{ fontSize: 12, color: "#666", marginTop: 3, lineHeight: 1.6 }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <Nav onPrev={() => setSec("cloud")} onNext={() => setSec("dbt")} />
          </div>
        )}

        {/* ── DBT ── */}
        {sec === "dbt" && (
          <div>
            <SH n="03" title="dbt — SQL with Software Engineering" col="#FFD54F" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 16px" }}>
              dbt (data build tool) makes SQL a first-class engineering practice. Instead of one-off query files with no structure or testing, <strong style={{ color: "#DDD8F0" }}>dbt gives your SQL version control, dependency management, automated testing, and auto-generated documentation</strong>. It is the single tool that most distinguishes modern data teams from traditional ones.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, margin: "0 0 20px" }}>
              <div style={{ border: "1px solid rgba(255,100,100,0.25)", borderRadius: 4, padding: "14px", background: "rgba(255,100,100,0.04)" }}>
                <div style={{ fontSize: 12, color: "#FF6464", fontWeight: 700, marginBottom: 8 }}>SQL without dbt</div>
                {["Queries stored in random folders or emails", "No one knows what runs in what order", "No automated data quality tests", "Impossible to trace where a number comes from", "Someone changes a query — nothing updates downstream", "No documentation — ask Steve what this does"].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, marginBottom: 5 }}>
                    <span style={{ color: "#FF6464", flexShrink: 0 }}>✗</span>
                    <span style={{ fontSize: 12, color: "#777" }}>{item}</span>
                  </div>
                ))}
              </div>
              <div style={{ border: "1px solid rgba(129,199,132,0.25)", borderRadius: 4, padding: "14px", background: "rgba(129,199,132,0.04)" }}>
                <div style={{ fontSize: 12, color: "#81C784", fontWeight: 700, marginBottom: 8 }}>SQL with dbt</div>
                {["All models in Git — full version history", "ref() defines dependencies — runs in right order", "Tests run automatically on every dbt run", "Lineage graph shows every data dependency", "Change a staging model — dbt rebuilds downstream", "Docs auto-generated — searchable, with column descriptions"].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, marginBottom: 5 }}>
                    <span style={{ color: "#81C784", flexShrink: 0 }}>✓</span>
                    <span style={{ fontSize: 12, color: "#777" }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <CodeBlock col="#FFD54F" label="DBT SETUP AND COMMANDS" code={DBT_INTRO_CODE} />
            <CodeBlock col="#81C784" label="DBT MODELS — STAGING AND MARTS" code={DBT_MODEL_CODE} />
            <CodeBlock col="#4FC3F7" label="DBT TESTS — SCHEMA.YML DATA QUALITY CHECKS" code={DBT_TEST_CODE} />

            <SH n="03b" title="dbt Key Concepts" col="#FFD54F" />
            <div style={{ border: "1px solid #1A1A2E", borderRadius: 4, overflow: "hidden", margin: "0 0 20px" }}>
              {[
                { concept: "Models",          def: "SQL SELECT statements. Each file = one table or view in your warehouse. Name the file what you want the table to be called.", col: "#FFD54F" },
                { concept: "ref()",           def: "{{ ref('model_name') }} — creates a dependency. dbt builds in the right order and resolves table names per environment automatically.", col: "#81C784" },
                { concept: "source()",        def: "{{ source('schema', 'table') }} — references raw tables not built by dbt. Defined in sources.yml with freshness tests.", col: "#4FC3F7" },
                { concept: "Materialisations", def: "view: runs SQL on every query. table: builds once at dbt run, stores result. incremental: only processes new rows. ephemeral: inline CTE.", col: "#FF8A65" },
                { concept: "Tests",           def: "Built-in: unique, not_null, accepted_values, relationships. Custom: write any SQL test. Run with dbt test. Fail = pipeline stops.", col: "#CE93D8" },
                { concept: "Docs",            def: "dbt docs generate builds a full data catalogue with descriptions, column types, test results, and a lineage graph. dbt docs serve opens it.", col: "#F48FB1" },
              ].map((r, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "130px 1fr", gap: 14, padding: "10px 16px", borderBottom: i < 5 ? "1px solid #0F0F18" : "none", background: i % 2 === 0 ? "#0A0A14" : "#07070E", alignItems: "start" }}>
                  <span style={{ fontSize: 12, color: r.col, fontWeight: 700 }}>{r.concept}</span>
                  <span style={{ fontSize: 12, color: "#888" }}>{r.def}</span>
                </div>
              ))}
            </div>

            <Box col="#CE93D8" icon="🤖" title="AI Prompt for dbt">
              "I am new to dbt connected to BigQuery. I have a raw orders table with columns: order_id, customer_id, product_id, order_date (string), units, price, cost, status, region. Write: (1) a staging model stg_orders.sql that casts types, cleans text, adds revenue and profit columns, (2) a schema.yml with not_null, unique, and accepted_values tests, (3) a sources.yml defining the raw table as a source."
            </Box>
            <Nav onPrev={() => setSec("stack")} onNext={() => setSec("airflow")} />
          </div>
        )}

        {/* ── AIRFLOW ── */}
        {sec === "airflow" && (
          <div>
            <SH n="04" title="Apache Airflow — Pipeline Orchestration" col="#FF8A65" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 16px" }}>
              Airflow is the industry-standard tool for scheduling and monitoring data pipelines. <strong style={{ color: "#DDD8F0" }}>A DAG in Airflow defines exactly what runs, in what order, on what schedule, with retry logic and alerting</strong>. Without Airflow, your dbt models run manually — with Airflow, they run automatically every morning before the business wakes up.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, margin: "0 0 20px" }}>
              {[
                { stat: "DAG",    label: "Directed Acyclic Graph — your pipeline definition", col: "#FF8A65" },
                { stat: "Task",   label: "One unit of work — run a script, call an API, run dbt", col: "#FFD54F" },
                { stat: "Sensor", label: "Wait for a condition before proceeding — file arrived, API available", col: "#4FC3F7" },
              ].map((s, i) => (
                <div key={i} style={{ border: "1px solid " + s.col + "33", borderRadius: 4, padding: "14px", background: s.col + "06", textAlign: "center" }}>
                  <div style={{ fontSize: 18, fontWeight: 900, color: s.col, marginBottom: 6, fontFamily: "monospace" }}>{s.stat}</div>
                  <div style={{ fontSize: 12, color: "#666", lineHeight: 1.6 }}>{s.label}</div>
                </div>
              ))}
            </div>

            <CodeBlock col="#FF8A65" label="AIRFLOW DAG — COMPLETE RETAILCO PIPELINE" code={AIRFLOW_CODE} />

            <SH n="04b" title="Airflow Concepts" col="#FF8A65" />
            <div style={{ border: "1px solid #1A1A2E", borderRadius: 4, overflow: "hidden", margin: "0 0 20px" }}>
              {[
                { concept: "schedule_interval", def: "Cron expression for when the DAG runs. '0 6 * * *' = 6am every day. '@daily' = midnight daily. '@hourly' = every hour. None = manual only.", col: "#FF8A65" },
                { concept: "Operators",         def: "BashOperator: run a shell command. PythonOperator: run a Python function. BigQueryOperator: run a BigQuery SQL. EmailOperator: send email.", col: "#FFD54F" },
                { concept: "task >> task",      def: "Sets execution order. upload >> load >> run_dbt means: upload must succeed before load starts. Chain with >> or set_downstream().", col: "#4FC3F7" },
                { concept: "retries",           def: "If a task fails, Airflow waits retry_delay then tries again, up to retries times. Set retries=3, retry_delay=timedelta(minutes=5) for robustness.", col: "#81C784" },
                { concept: "XCom",              def: "Cross-communication between tasks. Task A can push a value, Task B can pull it. Used to pass dynamic values like file names or row counts.", col: "#CE93D8" },
                { concept: "Backfill",          def: "Run historical DAG executions. airflow dags backfill -s 2024-01-01 -e 2024-03-01 my_dag. Useful when you add a new pipeline to historical data.", col: "#F48FB1" },
              ].map((r, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "150px 1fr", gap: 14, padding: "10px 16px", borderBottom: i < 5 ? "1px solid #0F0F18" : "none", background: i % 2 === 0 ? "#0A0A14" : "#07070E", alignItems: "start" }}>
                  <span style={{ fontSize: 12, color: r.col, fontWeight: 700, fontFamily: "monospace" }}>{r.concept}</span>
                  <span style={{ fontSize: 12, color: "#888" }}>{r.def}</span>
                </div>
              ))}
            </div>

            <Box col="#81C784" icon="☁️" title="Airflow in the Cloud — Managed Options">
              Running Airflow locally is fine for learning. In production, use a managed service: Google Cloud Composer (Airflow on GCP), Amazon MWAA (Airflow on AWS), or Astronomer (fully managed). These handle server management, scaling, and updates. For this course, local Airflow is sufficient.
            </Box>
            <Nav onPrev={() => setSec("dbt")} onNext={() => setSec("project")} />
          </div>
        )}

        {/* ── PROJECT ── */}
        {sec === "project" && (
          <div>
            <SH n="05" title="Project — Build the RetailCo Data Pipeline" col="#CE93D8" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 16px" }}>
              Four sequential tasks. By the end you will have a production-style data pipeline: raw CSVs in GCS, cleaned and modelled in BigQuery via dbt, scheduled by Airflow, and ready for BI tools to connect.
            </p>

            <Box col="#CE93D8" icon="🛠️" title="What You Need">
              Google account (for GCP free tier). Python 3.10+. pip install dbt-bigquery apache-airflow. The RetailCo CSVs from Phase 1 (orders, customers, products).
            </Box>

            <div style={{ display: "flex", gap: 6, margin: "20px 0 20px", overflowX: "auto", paddingBottom: 4 }}>
              {projectTasks.map((t, i) => (
                <button key={i} onClick={() => setOpenStep(openStep === i ? null : i)} style={{
                  background: openStep === i ? t.col + "18" : "#0D0D18",
                  border: "1px solid " + (openStep === i ? t.col : "#1A1A2E"),
                  borderTop: "3px solid " + t.col,
                  borderRadius: 4, padding: "12px 14px", cursor: "pointer",
                  fontFamily: "monospace", fontSize: 11,
                  color: openStep === i ? t.col : "#555",
                  whiteSpace: "nowrap", minWidth: 100, textAlign: "left",
                  transition: "all 0.2s",
                }}>
                  <div style={{ fontWeight: 700, marginBottom: 3 }}>{t.num}</div>
                  <div style={{ fontSize: 10 }}>{t.title.substring(0, 18)}</div>
                </button>
              ))}
            </div>

            {openStep !== null && (() => {
              const t = projectTasks[openStep];
              const doneCount = t.steps.filter((_, j) => checkedSteps[openStep + "-" + j]).length;
              const prog = Math.round(doneCount / t.steps.length * 100);
              return (
                <div style={{ border: "1px solid " + t.col + "44", borderLeft: "4px solid " + t.col, borderRadius: 4, overflow: "hidden", marginBottom: 24 }}>
                  <div style={{ padding: "16px 22px", background: t.col + "08", borderBottom: "1px solid " + t.col + "22" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                      <div>
                        <div style={{ fontSize: 10, color: t.col, fontFamily: "monospace", marginBottom: 5 }}>{t.num}</div>
                        <h3 style={{ margin: 0, fontSize: 17, fontWeight: 900, color: "#DDD8F0" }}>{t.title}</h3>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 11, color: t.col, fontFamily: "monospace", marginBottom: 4 }}>{doneCount}/{t.steps.length} done</div>
                        <div style={{ width: 80, height: 4, background: "#1A1A2E", borderRadius: 2, overflow: "hidden" }}>
                          <div style={{ width: prog + "%", height: "100%", background: t.col, borderRadius: 2 }} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: "18px 22px", background: "#0A0A14" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
                      {t.steps.map((step, j) => {
                        const key = openStep + "-" + j;
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
                    <div style={{ background: "#07070E", border: "1px solid " + t.col + "22", borderRadius: 3, overflow: "hidden", marginBottom: 14 }}>
                      <div style={{ padding: "6px 14px", borderBottom: "1px solid " + t.col + "22" }}>
                        <span style={{ fontSize: 9, color: t.col, letterSpacing: "0.15em", fontFamily: "monospace", fontWeight: 700 }}>CODE REFERENCE</span>
                      </div>
                      <pre style={{ margin: 0, padding: "12px 16px", fontSize: 11, color: t.col, fontFamily: "monospace", lineHeight: 1.75, overflowX: "auto" }}>{t.code}</pre>
                    </div>
                    <div style={{ background: "rgba(206,147,216,0.05)", border: "1px solid rgba(206,147,216,0.2)", borderRadius: 3, padding: "10px 12px" }}>
                      <div style={{ fontSize: 9, color: "#CE93D8", letterSpacing: "0.15em", fontFamily: "monospace", fontWeight: 700, marginBottom: 5 }}>AI PROMPT</div>
                      <code style={{ fontSize: 12, color: "#CE93D8", fontFamily: "monospace", lineHeight: 1.6 }}>{t.aiPrompt}</code>
                    </div>
                  </div>
                </div>
              );
            })()}

            {openStep === null && (
              <div style={{ padding: "28px", background: "#0D0D18", border: "1px dashed #1A1A2E", borderRadius: 4, textAlign: "center", color: "#444", fontSize: 13, marginBottom: 24 }}>
                ↑ Click any task card to open step-by-step instructions
              </div>
            )}
            <Nav onPrev={() => setSec("airflow")} onNext={() => setSec("quiz")} nxt="Take the Quiz →" />
          </div>
        )}

        {/* ── QUIZ ── */}
        {sec === "quiz" && (
          <div>
            <SH n="06" title="Part 1 Knowledge Check" col={ACC} />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 16px" }}>6 questions on cloud platforms, dbt, and Airflow. Score 4+ to proceed to Part 2.</p>

            {!quiz.done ? (
              <div style={{ margin: "24px 0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
                  <span style={{ fontSize: 11, color: "#555", fontFamily: "monospace" }}>QUESTION {quiz.idx + 1} / {quizData.length}</span>
                  <span style={{ fontSize: 11, color: ACC, fontFamily: "monospace" }}>SCORE: {quiz.score} / {quiz.idx}</span>
                </div>
                <div style={{ height: 3, background: "#1A1A2E", borderRadius: 2, marginBottom: 24, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: (quiz.idx / quizData.length * 100) + "%", background: "linear-gradient(90deg, " + ACC + ", #81C784)", transition: "width 0.4s" }} />
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#DDD8F0", lineHeight: 1.65, marginBottom: 20 }}>
                  {quizData[quiz.idx].q}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {quizData[quiz.idx].opts.map((opt, i) => {
                    const sel = quiz.sel === i;
                    const correct = i === quizData[quiz.idx].ans;
                    let bg = "#0D0D18", border = "#1A1A2E", col = "#888";
                    if (quiz.answered) {
                      if (correct) { bg = "rgba(129,199,132,0.08)"; border = "#81C784"; col = "#81C784"; }
                      else if (sel) { bg = "rgba(255,100,100,0.08)"; border = "#FF6464"; col = "#FF6464"; }
                    } else if (sel) { bg = "rgba(79,195,247,0.08)"; border = ACC; col = ACC; }
                    return (
                      <button key={i} onClick={() => answerQ(i)} style={{
                        background: bg, border: "1px solid " + border, borderRadius: 4,
                        padding: "13px 18px", cursor: quiz.answered ? "default" : "pointer",
                        textAlign: "left", fontFamily: "inherit", fontSize: 13, color: col, lineHeight: 1.5, transition: "all 0.2s",
                      }}>
                        <span style={{ marginRight: 10, fontFamily: "monospace", fontSize: 11 }}>{String.fromCharCode(65 + i)}.</span>
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {quiz.answered && (
                  <div style={{ margin: "20px 0 0", padding: "14px 18px", background: "rgba(79,195,247,0.04)", border: "1px solid rgba(79,195,247,0.2)", borderRadius: 4 }}>
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
                  {quiz.score === 6 ? "Cloud and data engineering fundamentals mastered. On to Part 2 — AI Ops and LLMs." : quiz.score >= 4 ? "Good pass. Review any weak sections before Part 2." : "Revisit dbt and Airflow sections before continuing."}
                </p>
                <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                  <button onClick={() => setQuiz({ idx: 0, sel: null, answered: false, score: 0, done: false })} style={{ background: "none", border: "1px solid #333", borderRadius: 3, padding: "8px 20px", cursor: "pointer", fontFamily: "monospace", fontSize: 11, color: "#555" }}>RETAKE</button>
                  <button onClick={() => setSec("intro")} style={{ background: ACC, border: "none", borderRadius: 3, padding: "8px 24px", cursor: "pointer", fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: "#07070E" }}>REVIEW ↑</button>
                </div>
                <div style={{ marginTop: 40, padding: "22px", background: "#0D0D18", border: "1px solid #1A1A2E", borderRadius: 4, textAlign: "left" }}>
                  <div style={{ fontSize: 11, color: "#555", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 10, fontFamily: "monospace" }}>WHAT IS IN PART 2</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#DDD8F0", marginBottom: 8 }}>AI Ops + LLM Integration for Analytics</div>
                  <p style={{ fontSize: 13, color: "#555", lineHeight: 1.7, margin: "0 0 14px" }}>
                    LangChain for building Q&A chatbots over your data, the OpenAI API with structured outputs, vector databases and semantic search, and monitoring ML models in production — plus the Phase 5 capstone.
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {["LangChain", "OpenAI API", "Vector databases", "Semantic search", "RAG pipelines", "Model monitoring", "Phase 5 Capstone"].map(t => (
                      <span key={t} style={{ padding: "3px 10px", background: "rgba(79,195,247,0.07)", border: "1px solid rgba(79,195,247,0.2)", borderRadius: 2, fontSize: 11, color: ACC }}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div style={{ display: "flex", marginTop: 48, paddingTop: 24, borderTop: "1px solid #1A1A2E" }}>
              <button onClick={() => setSec("project")} style={{ background: "none", border: "1px solid #1A1A2E", borderRadius: 3, padding: "8px 18px", cursor: "pointer", fontFamily: "monospace", fontSize: 11, color: "#555" }}>← Previous</button>
            </div>
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
function CodeBlock({ col, label, code }) {
  return (
    <div style={{ background: "#07070E", border: "1px solid " + col + "22", borderRadius: 3, overflow: "hidden", marginBottom: 16 }}>
      {label && <div style={{ padding: "6px 14px", borderBottom: "1px solid " + col + "22" }}>
        <span style={{ fontSize: 9, color: col, letterSpacing: "0.15em", fontFamily: "monospace", fontWeight: 700 }}>{label}</span>
      </div>}
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
      {onPrev ? <button onClick={onPrev} style={{ background: "none", border: "1px solid #1A1A2E", borderRadius: 3, padding: "8px 18px", cursor: "pointer", fontFamily: "monospace", fontSize: 11, color: "#555" }}>← Previous</button> : <div />}
      {onNext && <button onClick={onNext} style={{ background: "#4FC3F7", border: "none", borderRadius: 3, padding: "8px 24px", cursor: "pointer", fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: "#07070E" }}>{nxt}</button>}
    </div>
  );
}
