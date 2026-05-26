import { useState } from "react";

// All code stored as .join("\n") arrays — no template literal conflicts

const OPENAI_BASIC_CODE = [
  "# OpenAI API — getting started",
  "# pip install openai",
  "",
  "import openai",
  "import os",
  "",
  "client = openai.OpenAI(api_key=os.environ['OPENAI_API_KEY'])",
  "",
  "# Basic chat completion",
  "response = client.chat.completions.create(",
  "    model='gpt-4o-mini',",
  "    messages=[",
  "        {'role': 'system',",
  "         'content': 'You are a data analyst assistant.'},",
  "        {'role': 'user',",
  "         'content': 'What are the top 3 SQL window functions?'}",
  "    ]",
  ")",
  "print(response.choices[0].message.content)",
  "",
  "# With structured JSON output",
  "response = client.chat.completions.create(",
  "    model='gpt-4o-mini',",
  "    messages=[",
  "        {'role': 'system',",
  "         'content': 'Return only valid JSON. No markdown.'},",
  "        {'role': 'user',",
  "         'content': 'List 3 KPIs for a retail analytics dashboard'}",
  "    ],",
  "    response_format={'type': 'json_object'}",
  ")",
  "import json",
  "result = json.loads(response.choices[0].message.content)",
  "print(result)",
].join("\n");

const LANGCHAIN_QA_CODE = [
  "# LangChain — Q&A chatbot over your CSV data",
  "# pip install langchain langchain-openai faiss-cpu",
  "",
  "import os",
  "import pandas as pd",
  "from langchain_openai import ChatOpenAI, OpenAIEmbeddings",
  "from langchain.text_splitter import RecursiveCharacterTextSplitter",
  "from langchain_community.vectorstores import FAISS",
  "from langchain.chains import RetrievalQA",
  "from langchain.schema import Document",
  "",
  "os.environ['OPENAI_API_KEY'] = 'your-key-here'",
  "",
  "# Step 1: Load and convert data to documents",
  "df = pd.read_csv('data/orders.csv')",
  "df['revenue'] = df['units'] * df['price']",
  "",
  "# Convert each row to a text document",
  "docs = []",
  "for _, row in df.iterrows():",
  "    text = (",
  "        f\"Order {row['order_id']}: region={row['region']}, \"",
  "        f\"category={row['category']}, product={row['product']}, \"",
  "        f\"revenue={row['revenue']:.2f}, status={row['status']}\"",
  "    )",
  "    docs.append(Document(page_content=text))",
  "",
  "# Step 2: Split and embed into vector store",
  "splitter   = RecursiveCharacterTextSplitter(chunk_size=500)",
  "chunks     = splitter.split_documents(docs)",
  "embeddings = OpenAIEmbeddings()",
  "vectordb   = FAISS.from_documents(chunks, embeddings)",
  "",
  "# Step 3: Build Q&A chain",
  "llm = ChatOpenAI(model='gpt-4o-mini', temperature=0)",
  "qa  = RetrievalQA.from_chain_type(",
  "    llm=llm,",
  "    retriever=vectordb.as_retriever(search_kwargs={'k': 5})",
  ")",
  "",
  "# Step 4: Ask questions",
  "questions = [",
  "    'What is the total revenue for the North region?',",
  "    'Which product has the highest return rate?',",
  "    'What are the top 3 categories by revenue?',",
  "]",
  "for q in questions:",
  "    print('Q:', q)",
  "    print('A:', qa.invoke(q)['result'])",
  "    print()",
].join("\n");

const VECTOR_DB_CODE = [
  "# Vector Databases — semantic search over data",
  "# Traditional search: exact keyword match",
  "# Semantic search: finds meaning, not just words",
  "",
  "# pip install chromadb sentence-transformers",
  "",
  "import chromadb",
  "from sentence_transformers import SentenceTransformer",
  "import pandas as pd",
  "",
  "# Load embedding model (free, runs locally)",
  "model = SentenceTransformer('all-MiniLM-L6-v2')",
  "",
  "# Create ChromaDB collection",
  "client = chromadb.Client()",
  "collection = client.create_collection('retailco_products')",
  "",
  "# Add product descriptions",
  "df = pd.read_csv('data/products.csv')",
  "descriptions = df['product_name'].tolist()",
  "embeddings   = model.encode(descriptions).tolist()",
  "ids          = [str(i) for i in df['product_id'].tolist()]",
  "",
  "collection.add(",
  "    documents=descriptions,",
  "    embeddings=embeddings,",
  "    ids=ids",
  ")",
  "",
  "# Semantic search — finds similar meaning, not exact words",
  "query  = 'wireless audio equipment'",
  "q_emb  = model.encode([query]).tolist()",
  "results = collection.query(",
  "    query_embeddings=q_emb,",
  "    n_results=3",
  ")",
  "print('Similar products:', results['documents'])",
  "# Returns: ['Bluetooth Headphones', 'Wireless Speaker', 'Earbuds Pro']",
  "# Even though none contain 'audio equipment'",
].join("\n");

const RAG_CODE = [
  "# RAG — Retrieval Augmented Generation",
  "# = Vector search + LLM generation",
  "# Grounds LLM answers in YOUR data, not training data",
  "",
  "# pip install langchain langchain-openai faiss-cpu",
  "",
  "import os",
  "import pandas as pd",
  "from langchain_openai import ChatOpenAI, OpenAIEmbeddings",
  "from langchain_community.vectorstores import FAISS",
  "from langchain.chains import RetrievalQA",
  "from langchain.prompts import PromptTemplate",
  "from langchain.schema import Document",
  "",
  "os.environ['OPENAI_API_KEY'] = 'your-key-here'",
  "",
  "# Build knowledge base from business documents",
  "business_docs = [",
  "    Document(page_content=(",
  "        'RetailCo Q3 revenue was $142K, down 12% from Q2. '",
  "        'Electronics returns increased 40%. North region leads at 38%.'",
  "    )),",
  "    Document(page_content=(",
  "        'Champion customers represent 18% of base but 64% of revenue. '",
  "        'At-risk segment grew 22% — requires win-back campaign.'",
  "    )),",
  "    Document(page_content=(",
  "        'Funnel analysis: 60% drop-off between Add to Cart and Checkout. '",
  "        'Mobile checkout abandonment 3x higher than desktop.'",
  "    )),",
  "]",
  "",
  "embeddings = OpenAIEmbeddings()",
  "vectordb   = FAISS.from_documents(business_docs, embeddings)",
  "",
  "# Custom prompt that forces grounding in retrieved context",
  "prompt = PromptTemplate(",
  "    input_variables=['context', 'question'],",
  "    template=(",
  "        'You are a RetailCo data analyst. '",
  "        'Answer using ONLY the context below. '",
  "        'If not in context, say you do not know.\\n\\n'",
  "        'Context: {context}\\n\\nQuestion: {question}'",
  "    )",
  ")",
  "",
  "llm = ChatOpenAI(model='gpt-4o-mini', temperature=0)",
  "qa  = RetrievalQA.from_chain_type(",
  "    llm=llm,",
  "    retriever=vectordb.as_retriever(),",
  "    chain_type_kwargs={'prompt': prompt}",
  ")",
  "",
  "print(qa.invoke('Why did revenue decline in Q3?')['result'])",
].join("\n");

const MONITORING_CODE = [
  "# ML Model Monitoring — detecting drift and degradation",
  "# pip install evidently scikit-learn pandas",
  "",
  "import pandas as pd",
  "import numpy as np",
  "from evidently.report import Report",
  "from evidently.metric_preset import (",
  "    DataDriftPreset, ClassificationPreset",
  ")",
  "",
  "# Simulate training data (reference) and new data (current)",
  "np.random.seed(42)",
  "reference = pd.DataFrame({",
  "    'recency_days': np.random.normal(45, 20, 500),",
  "    'frequency':    np.random.poisson(5, 500),",
  "    'monetary':     np.random.exponential(200, 500),",
  "    'churned':      np.random.binomial(1, 0.3, 500),",
  "})",
  "",
  "# 3 months later — data distribution has shifted",
  "current = pd.DataFrame({",
  "    'recency_days': np.random.normal(75, 30, 200),  # higher!",
  "    'frequency':    np.random.poisson(3, 200),       # lower!",
  "    'monetary':     np.random.exponential(150, 200),",
  "    'churned':      np.random.binomial(1, 0.45, 200),",
  "})",
  "",
  "# Generate data drift report",
  "report = Report(metrics=[DataDriftPreset()])",
  "report.run(reference_data=reference, current_data=current)",
  "report.save_html('outputs/drift_report.html')",
  "print('Drift report saved — open in browser')",
  "",
  "# Check drift programmatically",
  "result = report.as_dict()",
  "drifted = result['metrics'][0]['result']['share_of_drifted_columns']",
  "print(f'{drifted:.0%} of features have drifted')",
  "# If > 30% drift: retrain the model",
].join("\n");

const STREAMLIT_LLM_CODE = [
  "# app/analytics_chatbot.py",
  "# Streamlit + LangChain + OpenAI chatbot over your data",
  "# Run: streamlit run app/analytics_chatbot.py",
  "",
  "import streamlit as st",
  "import pandas as pd",
  "import os",
  "from langchain_openai import ChatOpenAI, OpenAIEmbeddings",
  "from langchain_community.vectorstores import FAISS",
  "from langchain.chains import RetrievalQA",
  "from langchain.schema import Document",
  "",
  "st.set_page_config(",
  "    page_title='RetailCo Analytics Chatbot',",
  "    page_icon='🤖', layout='wide'",
  ")",
  "st.title('RetailCo Analytics Chatbot')",
  "st.caption('Ask questions about your data in plain English')",
  "",
  "@st.cache_resource",
  "def build_qa_chain():",
  "    os.environ['OPENAI_API_KEY'] = st.secrets['OPENAI_API_KEY']",
  "    df = pd.read_csv('data/customer_features.csv')",
  "    docs = [",
  "        Document(page_content=row.to_string())",
  "        for _, row in df.iterrows()",
  "    ]",
  "    vectordb = FAISS.from_documents(",
  "        docs, OpenAIEmbeddings()",
  "    )",
  "    return RetrievalQA.from_chain_type(",
  "        llm=ChatOpenAI(model='gpt-4o-mini', temperature=0),",
  "        retriever=vectordb.as_retriever(search_kwargs={'k': 8})",
  "    )",
  "",
  "qa = build_qa_chain()",
  "",
  "# Chat history",
  "if 'messages' not in st.session_state:",
  "    st.session_state.messages = []",
  "",
  "for msg in st.session_state.messages:",
  "    with st.chat_message(msg['role']):",
  "        st.markdown(msg['content'])",
  "",
  "if prompt := st.chat_input('Ask about your customer data...'):",
  "    st.session_state.messages.append(",
  "        {'role': 'user', 'content': prompt}",
  "    )",
  "    with st.chat_message('user'):",
  "        st.markdown(prompt)",
  "    with st.chat_message('assistant'):",
  "        with st.spinner('Analysing...'):",
  "            answer = qa.invoke(prompt)['result']",
  "        st.markdown(answer)",
  "    st.session_state.messages.append(",
  "        {'role': 'assistant', 'content': answer}",
  "    )",
].join("\n");

const flashcards = [
  { q: "What is RAG (Retrieval Augmented Generation) and why is it used?", a: "RAG = Vector search + LLM. Instead of asking an LLM to answer from training data (which may be outdated or hallucinated), you first retrieve relevant documents from your own database, then pass them to the LLM as context. The LLM answers from YOUR data. Used to build chatbots over private business data." },
  { q: "What is the difference between a traditional database and a vector database?", a: "Traditional DB: stores structured data, searches by exact value match (WHERE name = 'Alice'). Vector DB: stores embeddings (numerical representations of meaning), searches by semantic similarity. Use vector DBs for: finding similar products, semantic search, powering RAG pipelines." },
  { q: "What is data drift and why does it matter for ML models?", a: "Data drift = the statistical properties of input data change after model deployment. Example: customers who churned before were mostly high-recency, but now many churners are low-recency. The model was trained on old patterns — it will make wrong predictions on new data. Monitor drift monthly and retrain when > 30% of features drift." },
  { q: "In dbt, what is the difference between source() and ref()?", a: "source('schema', 'table') references RAW tables loaded by your ingestion tool — not built by dbt. ref('model_name') references another dbt model — creates a dependency and resolves table names per environment. Use source() for the first staging models; use ref() for everything downstream." },
  { q: "What is an embedding in the context of LLMs?", a: "An embedding is a list of numbers (a vector) that represents the semantic meaning of text. Similar meanings have similar vectors. 'Bluetooth headphones' and 'wireless audio equipment' have similar embeddings even though they share no words. Embeddings enable semantic search and power RAG systems." },
  { q: "What does LangChain do and why use it instead of raw OpenAI API?", a: "LangChain is a framework that connects LLMs to data sources, tools, and memory. Raw API = one-shot prompts. LangChain = chains of operations: retrieve documents, format them as context, call LLM, parse output, store memory. Use LangChain for RAG pipelines, multi-step agents, and chatbots with history." },
  { q: "What is the modern data stack? List all 7 layers.", a: "1. Source systems (apps, CRMs). 2. Ingestion (Fivetran, Airbyte). 3. Cloud warehouse (BigQuery, Snowflake). 4. Transformation (dbt). 5. Orchestration (Airflow). 6. Semantic layer (dbt metrics, Looker LookML). 7. BI and consumption (Tableau, Power BI, notebooks)." },
  { q: "What Airflow concept ensures Task B only starts after Task A succeeds?", a: "Task dependencies using the >> operator: task_a >> task_b. This creates a Directed Acyclic Graph (DAG) — task_b only starts if task_a completes successfully. If task_a fails: task_b is skipped, Airflow retries task_a, and sends an alert." },
  { q: "Name 3 dbt test types and what each checks.", a: "1. unique: no duplicate values in a column (order_id must be unique). 2. not_null: no null values. 3. accepted_values: column only contains values in a defined list (status must be 'COMPLETED', 'RETURNED', or 'CANCELLED'). 4. relationships: foreign key integrity (customer_id exists in customers table)." },
  { q: "What is the difference between a data warehouse, data lake, and lakehouse?", a: "Warehouse: structured, schema-on-write, SQL-queryable, fast for analytics (BigQuery, Snowflake). Lake: raw files, any format (CSV/JSON/Parquet), cheap, needs processing before analysis (S3, GCS). Lakehouse: combines both — structured query performance on raw file storage (Databricks Delta Lake)." },
  { q: "What does temperature=0 mean in an LLM API call?", a: "Temperature controls randomness. 0 = fully deterministic (same input always gives same output). 1 = creative and varied. For analytics chatbots and structured data tasks: always use temperature=0. For creative writing or brainstorming: use 0.7-1.0. Analytics use cases almost always want deterministic, factual answers." },
  { q: "How do you deploy a Streamlit app with secrets (like an API key) to Streamlit Cloud?", a: "In your GitHub repo, create .streamlit/secrets.toml (never commit this). In Streamlit Cloud: go to the app settings > Secrets > paste your secrets as TOML. Access in code: st.secrets['OPENAI_API_KEY']. This keeps API keys secure and out of your public code." },
];

const quizData = [
  {
    q: "What is RAG (Retrieval Augmented Generation)?",
    opts: [
      "A type of neural network architecture",
      "A pattern that combines vector search over your own data with an LLM to generate grounded, accurate answers based on your specific documents",
      "A method for training LLMs from scratch",
      "A database design pattern"
    ],
    ans: 1,
    exp: "RAG = retrieve relevant chunks from your data using semantic search, then pass those chunks as context to an LLM which generates an answer grounded in YOUR data. This prevents hallucinations, keeps answers current (no retraining needed), and works on private data that the LLM was never trained on."
  },
  {
    q: "What is data drift and when should you retrain an ML model?",
    opts: [
      "Data drift is when your database runs slowly",
      "Data drift is when the statistical distribution of input features changes after deployment — making model predictions less accurate. Consider retraining when > 30% of features drift significantly.",
      "Data drift only occurs with image data",
      "Data drift means your training data has errors"
    ],
    ans: 1,
    exp: "Data drift: input feature distributions shift over time (e.g. average recency_days increases because customers bought less during a downturn). The model was trained on old patterns — predictions become increasingly wrong. Use Evidently or similar tools to monitor drift monthly. A common threshold: if > 30% of features drift, retrain."
  },
  {
    q: "Why use temperature=0 when calling an LLM for data analytics tasks?",
    opts: [
      "It makes the API call cheaper",
      "It makes the LLM deterministic — the same input always produces the same output, which is critical for reliable, consistent answers in analytics pipelines",
      "It speeds up response time",
      "It limits the response to 0 sentences"
    ],
    ans: 1,
    exp: "Temperature controls output randomness. At 0, the model always picks the highest-probability token — fully deterministic. At 1, it introduces variety. For analytics: you want the same question to get the same answer every time. Temperature=0 is standard for all structured data tasks, SQL generation, and factual Q&A."
  },
  {
    q: "What does an embedding represent in the context of LLMs and vector search?",
    opts: [
      "The number of tokens in a piece of text",
      "A list of numbers (a vector) encoding the semantic meaning of text — similar meanings have similar vectors, enabling search by meaning rather than exact keywords",
      "The compressed version of a model",
      "A type of database index"
    ],
    ans: 1,
    exp: "An embedding transforms text into a high-dimensional vector where similar concepts cluster together. 'Bluetooth headphones' and 'wireless audio device' will have very similar embedding vectors. This enables semantic search — finding relevant content based on meaning, not keyword matching — which powers RAG systems."
  },
  {
    q: "In the Phase 5 capstone, what is the primary deliverable?",
    opts: [
      "A single SQL query",
      "An end-to-end AI-powered analytics platform: dbt pipeline in BigQuery, an Airflow DAG, a LangChain chatbot deployed as a Streamlit app, and model drift monitoring",
      "A PowerPoint presentation about AI",
      "A trained machine learning model only"
    ],
    ans: 1,
    exp: "The Phase 5 capstone builds a complete production-grade analytics platform combining everything learned: dbt models transforming raw data in BigQuery, an Airflow DAG scheduling the pipeline, a RAG-powered Streamlit chatbot letting stakeholders ask questions in plain English, and Evidently monitoring for model drift. This is senior analyst / analytics engineer level work."
  },
  {
    q: "What is st.cache_resource used for in a Streamlit + LangChain app?",
    opts: [
      "It saves the app's CSS styles",
      "It caches expensive objects like the vector database and LLM chain so they are only built once, not on every user interaction — dramatically reducing API costs and load times",
      "It stores the user's chat history",
      "It caches the CSV data only"
    ],
    ans: 1,
    exp: "st.cache_resource persists objects across all users and sessions in Streamlit. Without it, every time a user sends a message, Streamlit would re-read the CSV, re-build the vector store, and re-create the LLM chain — costing money and taking 30+ seconds. With it: built once, reused forever. Essential for LLM apps."
  },
];

const capstoneTasks = [
  {
    num: "T1", title: "dbt Pipeline Refresh", col: "#4FC3F7", weight: 20,
    steps: [
      "Open your Phase 5 Part 1 dbt project (retailco_dbt)",
      "Add a new mart model: dim_rfm_segments.sql",
      "Use the RFM logic from Phase 2 Part 3 — recency_days, frequency, monetary, r_score, f_score, m_score, segment label",
      "Add dbt tests: unique customer_id, not_null on all score columns",
      "Run: dbt run --select dim_rfm_segments",
      "Run: dbt test --select dim_rfm_segments",
      "Add description fields to schema.yml for all columns in dim_rfm_segments",
      "Run: dbt docs generate -- verify the new model appears in the lineage graph",
      "Update your Airflow DAG to include the new model in the daily run",
    ],
    aiPrompt: "I have a dbt staging model stg_orders with columns: customer_id, order_date, revenue, status. Write a mart model dim_rfm_segments.sql that calculates recency_days, frequency, monetary per customer, scores them 1-4 using NTILE, adds a segment label (Champion to Lost), and uses materialized='table'. Also write the schema.yml tests.",
  },
  {
    num: "T2", title: "OpenAI API + Structured Outputs", col: "#81C784", weight: 20,
    steps: [
      "Set your OPENAI_API_KEY as an environment variable",
      "pip install openai",
      "Write a script: analytics_insights.py",
      "Load customer_features.csv into a pandas DataFrame",
      "Compute summary stats: churn rate, avg recency, avg monetary by segment",
      "Format stats as a string and pass to GPT-4o-mini with a system prompt asking for JSON insights",
      "Set response_format={'type': 'json_object'} for structured output",
      "Parse the JSON response and print formatted insights",
      "Run the script — verify it returns a structured JSON with 3 business insights",
      "Save output to outputs/ai_insights.json",
    ],
    aiPrompt: "Write a Python script using the OpenAI API that: (1) loads customer_features.csv, (2) computes churn rate, avg recency_days, avg monetary per RFM segment, (3) formats these as a prompt, (4) calls GPT-4o-mini with response_format=json_object asking for 3 business insights and 3 recommended actions, (5) saves the structured JSON output.",
  },
  {
    num: "T3", title: "RAG Analytics Chatbot", col: "#FFD54F", weight: 25,
    steps: [
      "pip install langchain langchain-openai faiss-cpu",
      "Create: notebooks/04_rag_chatbot.ipynb",
      "Load customer_features.csv — convert each row to a LangChain Document",
      "Split documents with RecursiveCharacterTextSplitter",
      "Create FAISS vector store with OpenAIEmbeddings",
      "Build a RetrievalQA chain with ChatOpenAI (temperature=0)",
      "Add a custom PromptTemplate that grounds answers in retrieved context",
      "Test with 5 business questions: churn risk, top customers, segment breakdown",
      "Log each question + answer to a results DataFrame",
      "Save results: results.to_csv('outputs/chatbot_qa_results.csv')",
    ],
    aiPrompt: "Write a LangChain RAG pipeline in Python that: loads customer_features.csv (columns: customer_id, recency_days, frequency, monetary, churned, segment), converts rows to Documents, builds a FAISS vector store, and creates a RetrievalQA chain with a custom prompt that answers RetailCo business questions using only the retrieved context.",
  },
  {
    num: "T4", title: "Streamlit Analytics Chatbot App", col: "#FF8A65", weight: 20,
    steps: [
      "Create: app/analytics_chatbot.py using the template in the Streamlit section",
      "Add st.sidebar with dataset stats: total customers, churn rate, segment counts",
      "Add the chat interface: st.chat_input and st.chat_message",
      "Use st.cache_resource to wrap the vector DB and QA chain build",
      "Test locally: streamlit run app/analytics_chatbot.py",
      "Test 5 questions in the chat interface",
      "Add .streamlit/secrets.toml with your OPENAI_API_KEY (DO NOT commit this file)",
      "Add .streamlit/secrets.toml to .gitignore",
      "Push to GitHub and deploy to Streamlit Cloud: share.streamlit.io",
      "Add the live app URL to your GitHub README and portfolio",
    ],
    aiPrompt: "I am building a Streamlit chatbot using LangChain RAG over customer_features.csv. Add: (1) a sidebar showing total customers, churn rate %, and a segment breakdown bar chart using Plotly, (2) example question buttons that auto-fill the chat input, (3) a source documents expander showing which records were used to answer each question.",
  },
  {
    num: "T5", title: "Model Drift Monitoring", col: "#CE93D8", weight: 15,
    steps: [
      "pip install evidently",
      "Create: notebooks/05_drift_monitoring.ipynb",
      "Split customer_features.csv: first 70% as reference (training data), last 30% as current",
      "Run Evidently DataDriftPreset report comparing reference vs current",
      "Save HTML report: report.save_html('outputs/drift_report.html')",
      "Open and review the drift report in your browser",
      "Check programmatically: print which features drifted and by how much",
      "Write a 3-sentence interpretation: what drifted, what it means, what to do",
      "Add drift monitoring as a final task in your Airflow DAG (runs monthly)",
      "Commit all notebooks and outputs to your GitHub repo",
    ],
    aiPrompt: "Write a Python script using Evidently to monitor data drift for a churn model. My reference data is customer_features.csv split at 70%. Generate a DataDriftPreset report, save it as HTML, then programmatically extract: which columns drifted, their drift scores, and whether I should retrain the model (threshold: > 30% columns drifted).",
  },
];

const sections = [
  { id: "intro",     label: "Overview"   },
  { id: "openai",    label: "OpenAI API" },
  { id: "langchain", label: "LangChain"  },
  { id: "vector",    label: "Vectors"    },
  { id: "rag",       label: "RAG"        },
  { id: "monitor",   label: "Monitoring" },
  { id: "capstone",  label: "Capstone"   },
  { id: "review",    label: "Review"     },
  { id: "quiz",      label: "Quiz"       },
];

export default function Phase5Part2() {
  const [sec, setSec] = useState("intro");
  const [activeTask, setActiveTask] = useState(null);
  const [checkedSteps, setCheckedSteps] = useState({});
  const [scores, setScores] = useState({});
  const [flipped, setFlipped] = useState({});
  const [quiz, setQuiz] = useState({ idx: 0, sel: null, answered: false, score: 0, done: false });

  const ACC = "#81C784";

  const rubricRows = [
    { task: "T1 dbt RFM Model",        max: 20, criteria: "dim_rfm_segments runs, tests pass, docs generated" },
    { task: "T2 OpenAI Structured",    max: 20, criteria: "Script runs, JSON insights saved, 3 findings present" },
    { task: "T3 RAG Chatbot Notebook", max: 25, criteria: "FAISS built, 5 QA pairs tested, results CSV saved" },
    { task: "T4 Streamlit App",        max: 20, criteria: "App runs, chat works, deployed to Streamlit Cloud" },
    { task: "T5 Drift Monitoring",     max: 15, criteria: "Evidently report saved, drift % calculated, written interpretation" },
  ];
  const maxScore   = rubricRows.reduce((a, r) => a + r.max, 0);
  const totalScore = rubricRows.reduce((a, r) => a + (scores[r.task] || 0), 0);
  const pct        = totalScore > 0 ? Math.round(totalScore / maxScore * 100) : 0;

  const setScore   = (task, val) => {
    const max = rubricRows.find(r => r.task === task).max;
    setScores(p => ({ ...p, [task]: Math.min(max, Math.max(0, Number(val))) }));
  };
  const toggleStep = (k) => setCheckedSteps(p => ({ ...p, [k]: !p[k] }));
  const flipCard   = (i) => setFlipped(p => ({ ...p, [i]: !p[i] }));
  const answerQ    = (i) => {
    if (quiz.answered) return;
    setQuiz(q => ({ ...q, sel: i, answered: true, score: q.score + (i === quizData[q.idx].ans ? 1 : 0) }));
  };
  const nextQ = () => {
    if (quiz.idx + 1 >= quizData.length) setQuiz(q => ({ ...q, done: true }));
    else setQuiz(q => ({ ...q, idx: q.idx + 1, sel: null, answered: false }));
  };

  return (
    <div style={{ minHeight: "100vh", background: "#07070E", color: "#DDD8F0", fontFamily: "Georgia, serif" }}>

      {/* NAV */}
      <div style={{ background: "#0A0A14", borderBottom: "1px solid #16162A", padding: "0 24px", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 940, margin: "0 auto", display: "flex", alignItems: "center", overflowX: "auto" }}>
          <div style={{ fontSize: 10, color: ACC, letterSpacing: "0.2em", textTransform: "uppercase", padding: "14px 20px 14px 0", borderRight: "1px solid #1A1A2E", marginRight: 12, whiteSpace: "nowrap" }}>
            P5 · PART 2
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
                PHASE 5 · PART 2 OF 2 · WEEK 15
              </div>
              <h1 style={{ fontSize: "clamp(26px,5vw,44px)", fontWeight: 900, margin: "0 0 16px", lineHeight: 1.12, letterSpacing: "-0.02em" }}>
                AI Ops<br />
                <span style={{ color: ACC }}>+ LLM Integration</span><br />
                <span style={{ fontStyle: "italic", fontWeight: 400, fontSize: "0.65em", color: "#555" }}>for Data Analytics</span>
              </h1>
              <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, maxWidth: 580, margin: "0 0 24px" }}>
                The final technical phase. You will integrate large language models directly into your analytics stack — calling the OpenAI API for structured insights, building RAG pipelines with LangChain so stakeholders can chat with your data, monitoring ML models for drift with Evidently, and deploying an AI-powered analytics chatbot on Streamlit Cloud.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {["~6 hours", "OpenAI API", "LangChain", "Vector databases", "RAG pipelines", "Evidently monitoring", "Streamlit chatbot", "5-task capstone", "12 review flashcards"].map(t => (
                  <span key={t} style={{ padding: "4px 12px", background: "rgba(129,199,132,0.08)", border: "1px solid rgba(129,199,132,0.22)", borderRadius: 2, fontSize: 11, color: ACC }}>{t}</span>
                ))}
              </div>
            </div>

            <SH n="00" title="What You Will Learn" col={ACC} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 10, margin: "24px 0 36px" }}>
              {[
                { icon: "🔑", title: "OpenAI API",         desc: "Chat completions, structured JSON outputs, cost-effective model selection",  col: "#4FC3F7", s: "openai"    },
                { icon: "⛓️", title: "LangChain",           desc: "Chains, retrievers, memory — build multi-step LLM applications",            col: "#FFD54F", s: "langchain" },
                { icon: "🗄️", title: "Vector Databases",    desc: "Embeddings, semantic search, ChromaDB and FAISS",                          col: "#FF8A65", s: "vector"    },
                { icon: "🔍", title: "RAG Pipelines",       desc: "Retrieval Augmented Generation — ground LLM answers in your data",          col: "#CE93D8", s: "rag"       },
                { icon: "📉", title: "Model Monitoring",    desc: "Evidently for data drift detection — know when to retrain",                 col: "#F48FB1", s: "monitor"   },
                { icon: "🏆", title: "Phase 5 Capstone",   desc: "dbt + Airflow + RAG chatbot + drift monitoring — end-to-end AI platform",   col: "#81C784", s: "capstone"  },
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

            <Box col={ACC} icon="🚀" title="Where This Takes You">
              Analysts who can build LLM-powered data tools are the most sought-after in the market right now. The combination of SQL mastery, Python analytics, BI tools, data engineering, and LLM integration is exactly what companies mean when they post for 'Senior Data Analyst', 'Analytics Engineer', or 'AI Data Analyst'. This phase puts you there.
            </Box>
            <Nav onNext={() => setSec("openai")} />
          </div>
        )}

        {/* ── OPENAI API ── */}
        {sec === "openai" && (
          <div>
            <SH n="01" title="OpenAI API for Analytics" col="#4FC3F7" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 16px" }}>
              The OpenAI API gives you programmatic access to GPT-4o and other models. For analytics, the most powerful use cases are: <strong style={{ color: "#DDD8F0" }}>generating structured insights from data summaries, writing SQL from plain English descriptions, and narrating metric changes</strong> — all in Python with a few lines of code.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, margin: "0 0 20px" }}>
              {[
                { model: "gpt-4o-mini",  cost: "Cheapest",  use: "Most analytics tasks — fast and accurate enough", col: "#81C784" },
                { model: "gpt-4o",       cost: "Moderate",  use: "Complex reasoning, long context, high accuracy",  col: "#4FC3F7" },
                { model: "o1-mini",      cost: "Higher",    use: "Multi-step reasoning, advanced SQL generation",    col: "#FFD54F" },
              ].map((m, i) => (
                <div key={i} style={{ border: "1px solid " + m.col + "33", borderRadius: 4, padding: "12px", background: m.col + "06" }}>
                  <div style={{ fontSize: 12, color: m.col, fontFamily: "monospace", fontWeight: 700, marginBottom: 4 }}>{m.model}</div>
                  <div style={{ fontSize: 11, color: "#555", marginBottom: 4 }}>{m.cost}</div>
                  <div style={{ fontSize: 11, color: "#888" }}>{m.use}</div>
                </div>
              ))}
            </div>

            <CodeBlock col="#4FC3F7" label="OPENAI API — BASIC AND STRUCTURED OUTPUT" code={OPENAI_BASIC_CODE} />

            <SH n="01b" title="Analytics Use Cases for the OpenAI API" col="#4FC3F7" />
            <div style={{ border: "1px solid #1A1A2E", borderRadius: 4, overflow: "hidden", margin: "0 0 20px" }}>
              {[
                { use: "Insight generation",   desc: "Pass summary stats as a prompt → get structured JSON insights and recommendations", col: "#4FC3F7" },
                { use: "SQL generation",        desc: "Describe the query in English → get BigQuery/PostgreSQL SQL back as a string",         col: "#81C784" },
                { use: "Data narratives",       desc: "Pass metric changes → get a plain-English paragraph for executives or Slack",          col: "#FFD54F" },
                { use: "Anomaly explanation",   desc: "Pass flagged outliers → get natural language explanations of why they are unusual",    col: "#FF8A65" },
                { use: "Report summarisation",  desc: "Pass a long EDA report → get a 3-bullet executive summary",                           col: "#CE93D8" },
                { use: "Schema documentation",  desc: "Pass column names and sample values → get table and column descriptions automatically", col: "#F48FB1" },
              ].map((r, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: 14, padding: "10px 16px", borderBottom: i < 5 ? "1px solid #0F0F18" : "none", background: i % 2 === 0 ? "#0A0A14" : "#07070E", alignItems: "start" }}>
                  <span style={{ fontSize: 12, color: r.col, fontWeight: 700 }}>{r.use}</span>
                  <span style={{ fontSize: 12, color: "#888" }}>{r.desc}</span>
                </div>
              ))}
            </div>

            <Box col="#FFD54F" icon="💰" title="Managing API Costs">
              Set a monthly budget limit in platform.openai.com/usage. For analytics tasks: gpt-4o-mini costs ~$0.0002 per 1K tokens — a 500-word prompt + response costs less than $0.001. For a daily pipeline generating 10 insights: roughly $0.01/day. Always use temperature=0 and concise prompts to minimise token usage.
            </Box>
            <Nav onPrev={() => setSec("intro")} onNext={() => setSec("langchain")} />
          </div>
        )}

        {/* ── LANGCHAIN ── */}
        {sec === "langchain" && (
          <div>
            <SH n="02" title="LangChain — Build LLM Applications" col="#FFD54F" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 16px" }}>
              LangChain is the framework for building applications with LLMs. Raw API calls handle one-shot prompts. <strong style={{ color: "#DDD8F0" }}>LangChain handles everything more complex</strong> — chaining multiple LLM calls, connecting to data sources, managing conversation history, and building agents that use tools.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, margin: "0 0 20px" }}>
              {[
                { feat: "Chains",     desc: "Connect multiple LLM calls sequentially. Output of step 1 feeds into step 2. Build complex multi-step reasoning.", col: "#FFD54F" },
                { feat: "Retrievers", desc: "Connect to vector stores for RAG. Given a question, retrieve the most relevant documents to pass as context.", col: "#4FC3F7" },
                { feat: "Memory",     desc: "Store and recall conversation history. Users can refer back to previous messages in a chat session.", col: "#81C784" },
                { feat: "Agents",     desc: "LLM that decides which tool to use. Give it access to a calculator, SQL database, or API — it figures out when to call each.", col: "#FF8A65" },
              ].map((f, i) => (
                <div key={i} style={{ border: "1px solid " + f.col + "33", borderRadius: 4, padding: "14px", background: f.col + "06" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: f.col, marginBottom: 6 }}>{f.feat}</div>
                  <div style={{ fontSize: 12, color: "#888", lineHeight: 1.6 }}>{f.desc}</div>
                </div>
              ))}
            </div>

            <CodeBlock col="#FFD54F" label="LANGCHAIN Q&A OVER CSV DATA" code={LANGCHAIN_QA_CODE} />

            <Box col="#CE93D8" icon="🤖" title="AI Prompt to Generate LangChain Code">
              "Write a LangChain RetrievalQA chain that: (1) loads a pandas DataFrame from customer_features.csv, (2) converts each row to a LangChain Document with all column values in the page_content, (3) creates a FAISS vector store using OpenAIEmbeddings, (4) builds a RetrievalQA chain with ChatOpenAI at temperature=0, (5) answers: 'Which customers are most at risk of churning?'"
            </Box>
            <Nav onPrev={() => setSec("openai")} onNext={() => setSec("vector")} />
          </div>
        )}

        {/* ── VECTOR ── */}
        {sec === "vector" && (
          <div>
            <SH n="03" title="Vector Databases and Semantic Search" col="#FF8A65" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 16px" }}>
              Traditional databases find exact matches. Vector databases find <strong style={{ color: "#DDD8F0" }}>semantic meaning</strong> — the technology that powers Google Search, ChatGPT memory, and every RAG pipeline. They store embeddings (numerical representations of meaning) and return the most semantically similar results to any query.
            </p>

            <div style={{ background: "#0A0A14", border: "1px solid #FF8A6533", borderRadius: 4, padding: "18px 20px", margin: "0 0 20px" }}>
              <div style={{ fontSize: 10, color: "#FF8A65", fontFamily: "monospace", letterSpacing: "0.12em", marginBottom: 14 }}>HOW SEMANTIC SEARCH WORKS</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { step: "1", desc: "Text is passed to an embedding model (OpenAI text-embedding-3-small, or sentence-transformers locally)", col: "#4FC3F7" },
                  { step: "2", desc: "The model returns a vector — a list of 1,536 numbers representing the semantic meaning of the text", col: "#81C784" },
                  { step: "3", desc: "These vectors are stored in a vector database (FAISS, ChromaDB, Pinecone, Weaviate)", col: "#FFD54F" },
                  { step: "4", desc: "At query time: the query is also embedded, then the DB finds the stored vectors with the smallest distance (most similar meaning)", col: "#FF8A65" },
                  { step: "5", desc: "The most similar documents are returned — regardless of whether they share exact words with the query", col: "#CE93D8" },
                ].map((s, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", background: s.col + "18", border: "1px solid " + s.col + "44", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ fontSize: 10, color: s.col, fontWeight: 700 }}>{s.step}</span>
                    </div>
                    <span style={{ fontSize: 13, color: "#888", lineHeight: 1.6 }}>{s.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            <CodeBlock col="#FF8A65" label="CHROMADB — SEMANTIC SEARCH OVER PRODUCTS" code={VECTOR_DB_CODE} />

            <SH n="03b" title="Vector DB Options" col="#FF8A65" />
            <div style={{ border: "1px solid #1A1A2E", borderRadius: 4, overflow: "hidden", margin: "0 0 20px" }}>
              {[
                { name: "FAISS",      type: "In-memory",  best: "Fast, simple, no server needed. Best for: prototypes, notebooks, small-medium datasets.", col: "#4FC3F7" },
                { name: "ChromaDB",   type: "Local/Cloud", best: "Open source, persistent storage, simple API. Best for: development, small production apps.", col: "#81C784" },
                { name: "Pinecone",   type: "Managed cloud", best: "Fully managed, scalable, fast. Best for: production apps with millions of vectors.", col: "#FFD54F" },
                { name: "Weaviate",   type: "Open source cloud", best: "Self-hosted or cloud, multi-modal. Best for: enterprise with compliance requirements.", col: "#FF8A65" },
              ].map((r, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "90px 110px 1fr", gap: 12, padding: "10px 16px", borderBottom: i < 3 ? "1px solid #0F0F18" : "none", background: i % 2 === 0 ? "#0A0A14" : "#07070E", alignItems: "start" }}>
                  <span style={{ fontSize: 12, color: r.col, fontWeight: 700 }}>{r.name}</span>
                  <span style={{ fontSize: 11, color: "#555" }}>{r.type}</span>
                  <span style={{ fontSize: 12, color: "#888" }}>{r.best}</span>
                </div>
              ))}
            </div>
            <Nav onPrev={() => setSec("langchain")} onNext={() => setSec("rag")} />
          </div>
        )}

        {/* ── RAG ── */}
        {sec === "rag" && (
          <div>
            <SH n="04" title="RAG — Retrieval Augmented Generation" col="#CE93D8" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 16px" }}>
              RAG is the most important LLM pattern for enterprise analytics. It solves the core problem with raw LLMs: <strong style={{ color: "#DDD8F0" }}>they hallucinate, they do not know your private data, and their knowledge is frozen at training time</strong>. RAG grounds every answer in retrieved documents from your own database.
            </p>

            <div style={{ background: "#0A0A14", border: "1px solid #CE93D833", borderRadius: 4, padding: "18px 20px", margin: "0 0 20px" }}>
              <div style={{ fontSize: 10, color: "#CE93D8", fontFamily: "monospace", letterSpacing: "0.12em", marginBottom: 14 }}>RAG vs PLAIN LLM</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div>
                  <div style={{ fontSize: 12, color: "#FF6464", fontWeight: 700, marginBottom: 8 }}>Plain LLM</div>
                  {["Answers from training data only", "Cannot access your private database", "May hallucinate numbers confidently", "Knowledge frozen at training cutoff", "No source citations possible"].map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, marginBottom: 5 }}>
                      <span style={{ color: "#FF6464", flexShrink: 0 }}>✗</span>
                      <span style={{ fontSize: 12, color: "#777" }}>{item}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ fontSize: 12, color: "#CE93D8", fontWeight: 700, marginBottom: 8 }}>RAG Pipeline</div>
                  {["Answers from YOUR specific data", "Retrieves from your vector store first", "Grounded answers — shows source documents", "Always current — just update the vector store", "Can cite which records informed the answer"].map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, marginBottom: 5 }}>
                      <span style={{ color: "#CE93D8", flexShrink: 0 }}>✓</span>
                      <span style={{ fontSize: 12, color: "#777" }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <CodeBlock col="#CE93D8" label="RAG PIPELINE WITH CUSTOM PROMPT TEMPLATE" code={RAG_CODE} />

            <Box col="#CE93D8" icon="🤖" title="Prompt Template for Analytics RAG">
              The system prompt is critical. Always include: (1) role definition — 'You are a RetailCo data analyst', (2) grounding instruction — 'Answer using ONLY the context provided', (3) fallback instruction — 'If not in context, say you do not know'. Without the fallback instruction, the LLM will hallucinate rather than admit ignorance.
            </Box>
            <Nav onPrev={() => setSec("vector")} onNext={() => setSec("monitor")} />
          </div>
        )}

        {/* ── MONITORING ── */}
        {sec === "monitor" && (
          <div>
            <SH n="05" title="ML Model Monitoring with Evidently" col="#F48FB1" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 16px" }}>
              A model that was 87% accurate when trained can degrade to 60% accuracy six months later if the data it was trained on no longer reflects reality. <strong style={{ color: "#DDD8F0" }}>Monitoring detects this degradation before it causes bad decisions.</strong> Evidently is the best open-source tool for this — one function call generates a full drift report.
            </p>

            <div style={{ border: "1px solid #1A1A2E", borderRadius: 4, overflow: "hidden", margin: "0 0 20px" }}>
              <div style={{ padding: "10px 16px", background: "#0D0D18", borderBottom: "1px solid #1A1A2E" }}>
                <span style={{ fontSize: 10, color: "#F48FB1", letterSpacing: "0.12em", fontFamily: "monospace", fontWeight: 700 }}>TYPES OF DRIFT TO MONITOR</span>
              </div>
              {[
                { type: "Data drift",          desc: "Input feature distributions change. Example: recency_days average shifts from 45 to 75. Model trained on old distribution makes wrong predictions.", col: "#4FC3F7" },
                { type: "Target drift",        desc: "The thing you are predicting changes distribution. Example: churn rate jumps from 30% to 50%. Model predictions no longer calibrated.", col: "#81C784" },
                { type: "Concept drift",       desc: "The relationship between features and target changes. Example: high recency used to mean churn — now it means seasonal. Most dangerous.", col: "#FFD54F" },
                { type: "Prediction drift",    desc: "Model output distribution changes. Example: model suddenly predicts 70% of customers will churn. May indicate upstream data issue.", col: "#FF8A65" },
              ].map((r, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "150px 1fr", gap: 14, padding: "10px 16px", borderBottom: i < 3 ? "1px solid #0F0F18" : "none", background: i % 2 === 0 ? "#0A0A14" : "#07070E", alignItems: "start" }}>
                  <span style={{ fontSize: 12, color: r.col, fontWeight: 700 }}>{r.type}</span>
                  <span style={{ fontSize: 12, color: "#888" }}>{r.desc}</span>
                </div>
              ))}
            </div>

            <CodeBlock col="#F48FB1" label="EVIDENTLY — DATA DRIFT MONITORING" code={MONITORING_CODE} />

            <Box col="#F48FB1" icon="📅" title="When to Run Drift Monitoring">
              Monthly: sufficient for most analytics models where data changes gradually. Weekly: for high-stakes models (churn, fraud) or fast-moving businesses. Daily: for real-time systems. Trigger: run after every significant business event (product launch, campaign, pricing change). Threshold: retrain if more than 30% of features show significant drift.
            </Box>
            <Nav onPrev={() => setSec("rag")} onNext={() => setSec("capstone")} />
          </div>
        )}

        {/* ── CAPSTONE ── */}
        {sec === "capstone" && (
          <div>
            <SH n="06" title="Phase 5 Capstone — AI Analytics Platform" col="#81C784" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 16px" }}>
              The Phase 5 capstone builds a complete, production-grade AI analytics platform: a dbt pipeline feeding a BigQuery warehouse, an Airflow DAG scheduling everything, a RAG chatbot on Streamlit Cloud, and Evidently monitoring model drift.
            </p>

            <Box col="#81C784" icon="🏆" title="What You Are Building">
              The RetailCo AI Analytics Platform — the type of system a data engineering team would build in 6 months. You will build it in a week using the modern stack. Every component is real and deployable: the dbt models run in BigQuery, the chatbot is live on Streamlit Cloud, and the drift report is scheduled in Airflow.
            </Box>

            <div style={{ display: "flex", gap: 6, margin: "20px 0 20px", overflowX: "auto", paddingBottom: 4 }}>
              {capstoneTasks.map((t, i) => (
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
                  <div style={{ fontSize: 10, lineHeight: 1.4 }}>{t.title.substring(0, 16)}</div>
                  <div style={{ marginTop: 5, fontSize: 10, color: "#444" }}>{t.weight} pts</div>
                </button>
              ))}
            </div>

            {activeTask !== null && (() => {
              const t = capstoneTasks[activeTask];
              const doneCount = t.steps.filter((_, j) => checkedSteps[activeTask + "-" + j]).length;
              const prog = Math.round(doneCount / t.steps.length * 100);
              return (
                <div style={{ border: "1px solid " + t.col + "44", borderLeft: "4px solid " + t.col, borderRadius: 4, overflow: "hidden", marginBottom: 20 }}>
                  <div style={{ padding: "16px 22px", background: t.col + "08", borderBottom: "1px solid " + t.col + "22" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                      <div>
                        <div style={{ fontSize: 10, color: t.col, fontFamily: "monospace", marginBottom: 5 }}>{t.num} · {t.weight} MARKS</div>
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
                    <div style={{ background: "rgba(206,147,216,0.05)", border: "1px solid rgba(206,147,216,0.2)", borderRadius: 3, padding: "10px 12px" }}>
                      <div style={{ fontSize: 9, color: "#CE93D8", letterSpacing: "0.15em", fontFamily: "monospace", fontWeight: 700, marginBottom: 5 }}>AI PROMPT</div>
                      <code style={{ fontSize: 12, color: "#CE93D8", fontFamily: "monospace", lineHeight: 1.6 }}>{t.aiPrompt}</code>
                    </div>
                  </div>
                </div>
              );
            })()}

            {activeTask === null && (
              <div style={{ padding: "28px", background: "#0D0D18", border: "1px dashed #1A1A2E", borderRadius: 4, textAlign: "center", color: "#444", fontSize: 13, marginBottom: 20 }}>
                ↑ Click any task card above to open step-by-step instructions
              </div>
            )}

            {/* Also show Streamlit code in this section */}
            <SH n="06b" title="Streamlit Chatbot Code Reference" col="#FF8A65" />
            <CodeBlock col="#FF8A65" label="COMPLETE STREAMLIT + LANGCHAIN CHATBOT" code={STREAMLIT_LLM_CODE} />

            {/* Rubric */}
            <SH n="06c" title="Marking Rubric" col="#81C784" />
            <div style={{ border: "1px solid #1A1A2E", borderRadius: 4, overflow: "hidden", margin: "0 0 16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 60px 80px", gap: 12, padding: "10px 16px", background: "#0D0D18", borderBottom: "1px solid #1A1A2E" }}>
                {["Task", "Criteria", "Max", "Score"].map(h => (
                  <span key={h} style={{ fontSize: 9, color: "#555", letterSpacing: "0.12em", fontFamily: "monospace", textTransform: "uppercase" }}>{h}</span>
                ))}
              </div>
              {rubricRows.map((r, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 2fr 60px 80px", gap: 12, padding: "11px 16px", alignItems: "center", borderBottom: i < rubricRows.length - 1 ? "1px solid #0F0F18" : "none", background: i % 2 === 0 ? "#0A0A14" : "#07070E" }}>
                  <span style={{ fontSize: 11, color: "#81C784", fontFamily: "monospace", fontWeight: 700 }}>{r.task}</span>
                  <span style={{ fontSize: 12, color: "#666" }}>{r.criteria}</span>
                  <span style={{ fontSize: 13, color: "#DDD8F0", fontFamily: "monospace", textAlign: "center" }}>{r.max}</span>
                  <input type="number" min={0} max={r.max} value={scores[r.task] ?? ""} onChange={e => setScore(r.task, e.target.value)} placeholder="0"
                    style={{ background: "#0D0D18", border: "1px solid #1A1A2E", borderRadius: 3, padding: "5px 8px", color: ACC, fontFamily: "monospace", fontSize: 13, width: "58px", textAlign: "center", outline: "none" }} />
                </div>
              ))}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 60px 80px", gap: 12, padding: "13px 16px", background: "#0D0D18", borderTop: "2px solid #1A1A2E" }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#DDD8F0", gridColumn: "1/3" }}>TOTAL</span>
                <span style={{ fontSize: 14, fontWeight: 900, color: "#DDD8F0", fontFamily: "monospace", textAlign: "center" }}>{maxScore}</span>
                <span style={{ fontSize: 14, fontWeight: 900, fontFamily: "monospace", textAlign: "center", color: pct >= 90 ? "#4ade80" : pct >= 75 ? "#FFD54F" : totalScore > 0 ? "#FF8A65" : "#555" }}>{totalScore || "—"}</span>
              </div>
            </div>

            {totalScore > 0 && (
              <div style={{ border: "1px solid " + (pct >= 90 ? "#4ade80" : pct >= 75 ? "#FFD54F" : "#FF8A65") + "33", borderLeft: "4px solid " + (pct >= 90 ? "#4ade80" : pct >= 75 ? "#FFD54F" : "#FF8A65"), borderRadius: 4, padding: "16px 20px", marginBottom: 20 }}>
                <div style={{ fontSize: 36, fontWeight: 900, fontFamily: "monospace", color: pct >= 90 ? "#4ade80" : pct >= 75 ? "#FFD54F" : "#FF8A65", marginBottom: 4 }}>{pct}%</div>
                <div style={{ fontSize: 13, color: "#DDD8F0", fontWeight: 700 }}>{pct >= 90 ? "🏆 Senior-Level Work — Phase 5 Complete" : pct >= 75 ? "✅ Pass — Ready for Phase 6" : "📚 Review and improve lower-scoring tasks"}</div>
                <div style={{ height: 5, background: "#1A1A2E", borderRadius: 3, overflow: "hidden", marginTop: 10 }}>
                  <div style={{ width: pct + "%", height: "100%", background: "linear-gradient(90deg, #FF8A65, " + (pct >= 90 ? "#4ade80" : pct >= 75 ? "#FFD54F" : "#FF8A65") + ")", borderRadius: 3, transition: "width 0.5s" }} />
                </div>
              </div>
            )}
            <Nav onPrev={() => setSec("monitor")} onNext={() => setSec("review")} />
          </div>
        )}

        {/* ── REVIEW ── */}
        {sec === "review" && (
          <div>
            <SH n="07" title="Phase 5 Full Review — 12 Flashcards" col="#CE93D8" />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 20px" }}>
              Flip each card. These cover all of Phase 5 — cloud, dbt, Airflow, LLMs, RAG, and monitoring.
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

            <SH n="07b" title="Phase 5 Concept Map" col="#CE93D8" />
            <div style={{ border: "1px solid #1A1A2E", borderRadius: 4, overflow: "hidden", margin: "0 0 28px" }}>
              {[
                { part: "Part 1", col: "#4FC3F7", topics: ["Cloud platforms: AWS, GCP, Azure", "BigQuery data warehouse", "Modern data stack — 7 layers", "dbt models, ref(), source()", "Staging vs mart models", "dbt tests and documentation", "Apache Airflow DAGs and operators"] },
                { part: "Part 2", col: "#81C784", topics: ["OpenAI API + structured outputs", "LangChain chains and retrievers", "Embeddings and vector databases", "FAISS, ChromaDB, Pinecone", "RAG pipeline architecture", "Evidently drift monitoring", "Streamlit + LangChain chatbot"] },
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

            {/* Phase 6 Preview */}
            <SH n="07c" title="Phase 6 — Job-Ready Capstone and Career Launch" col={ACC} />
            <div style={{ border: "1px solid " + ACC + "33", borderLeft: "3px solid " + ACC, borderRadius: 4, padding: "20px 22px", background: ACC + "06", marginBottom: 24 }}>
              <div style={{ fontSize: 10, color: ACC, letterSpacing: "0.2em", fontFamily: "monospace", marginBottom: 10 }}>WEEK 16 — FINAL PHASE</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#DDD8F0", marginBottom: 10 }}>The Hiring Gauntlet</div>
              <p style={{ fontSize: 13, color: "#888", lineHeight: 1.7, margin: "0 0 14px" }}>
                Phase 6 is not a technical phase — it is a career launch phase. You will build a job-application-ready portfolio, write a data analyst CV and LinkedIn that gets past ATS, prepare for technical and behavioural interviews, negotiate your salary, and complete a final capstone project that demonstrates every skill from the course.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {["Portfolio review", "CV and LinkedIn", "Technical interview prep", "SQL take-home test", "Case study framework", "Salary negotiation", "Final capstone project"].map(t => (
                  <span key={t} style={{ padding: "3px 10px", background: ACC + "0D", border: "1px solid " + ACC + "30", borderRadius: 2, fontSize: 11, color: ACC }}>{t}</span>
                ))}
              </div>
            </div>

            <div style={{ padding: "20px 24px", background: "#0D0D18", border: "1px solid #1A1A2E", borderRadius: 4, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#DDD8F0", marginBottom: 4 }}>One phase left.</div>
                <div style={{ fontSize: 12, color: "#555" }}>Say "Give me Phase 6 Part 1" to start your career launch.</div>
              </div>
              <div style={{ padding: "10px 20px", background: "rgba(129,199,132,0.1)", border: "1px solid rgba(129,199,132,0.3)", borderRadius: 3, fontSize: 12, color: ACC, fontFamily: "monospace", fontWeight: 700 }}>
                PHASE 6 → CAREER LAUNCH
              </div>
            </div>
            <Nav onPrev={() => setSec("capstone")} onNext={() => setSec("quiz")} nxt="Take the Quiz →" />
          </div>
        )}

        {/* ── QUIZ ── */}
        {sec === "quiz" && (
          <div>
            <SH n="08" title="Part 2 Knowledge Check" col={ACC} />
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.88, margin: "0 0 16px" }}>6 questions on LLMs, RAG, vector databases, and model monitoring. Score 4+ to complete Phase 5.</p>

            {!quiz.done ? (
              <div style={{ margin: "24px 0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
                  <span style={{ fontSize: 11, color: "#555", fontFamily: "monospace" }}>QUESTION {quiz.idx + 1} / {quizData.length}</span>
                  <span style={{ fontSize: 11, color: ACC, fontFamily: "monospace" }}>SCORE: {quiz.score} / {quiz.idx}</span>
                </div>
                <div style={{ height: 3, background: "#1A1A2E", borderRadius: 2, marginBottom: 24, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: (quiz.idx / quizData.length * 100) + "%", background: "linear-gradient(90deg, " + ACC + ", #4FC3F7)", transition: "width 0.4s" }} />
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
                    } else if (sel) { bg = "rgba(129,199,132,0.08)"; border = ACC; col = ACC; }
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
                  <div style={{ margin: "20px 0 0", padding: "14px 18px", background: "rgba(129,199,132,0.04)", border: "1px solid rgba(129,199,132,0.2)", borderRadius: 4 }}>
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
                  {quiz.score === 6 ? "AI Ops mastered. Five phases complete. One left — Phase 6: Career Launch." : quiz.score >= 4 ? "Phase 5 passed. Strong foundation for the final phase." : "Revisit RAG and monitoring before the career phase."}
                </p>
                <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                  <button onClick={() => setQuiz({ idx: 0, sel: null, answered: false, score: 0, done: false })} style={{ background: "none", border: "1px solid #333", borderRadius: 3, padding: "8px 20px", cursor: "pointer", fontFamily: "monospace", fontSize: 11, color: "#555" }}>RETAKE</button>
                  <button onClick={() => setSec("intro")} style={{ background: ACC, border: "none", borderRadius: 3, padding: "8px 24px", cursor: "pointer", fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: "#07070E" }}>REVIEW ↑</button>
                </div>

                <div style={{ marginTop: 40, padding: "28px", background: "linear-gradient(135deg, rgba(129,199,132,0.07) 0%, transparent 100%)", border: "1px solid " + ACC + "33", borderRadius: 4 }}>
                  <div style={{ fontSize: 52, marginBottom: 10 }}>🎉</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: "#DDD8F0", marginBottom: 8 }}>Phase 5 Complete!</div>
                  <p style={{ fontSize: 14, color: "#777", lineHeight: 1.8, maxWidth: 500, margin: "0 auto 20px" }}>
                    Five phases done. You can now build end-to-end analytics platforms from raw data to AI-powered chatbots. One phase left — the one that gets you hired.
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
                    {["Cloud + BigQuery ✓", "dbt pipelines ✓", "Apache Airflow ✓", "OpenAI API ✓", "RAG pipelines ✓", "Model monitoring ✓", "AI chatbot deployed ✓"].map(tag => (
                      <span key={tag} style={{ padding: "5px 14px", background: "rgba(129,199,132,0.08)", border: "1px solid rgba(129,199,132,0.25)", borderRadius: 2, fontSize: 12, color: ACC }}>{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div style={{ display: "flex", marginTop: 48, paddingTop: 24, borderTop: "1px solid #1A1A2E" }}>
              <button onClick={() => setSec("review")} style={{ background: "none", border: "1px solid #1A1A2E", borderRadius: 3, padding: "8px 18px", cursor: "pointer", fontFamily: "monospace", fontSize: 11, color: "#555" }}>← Previous</button>
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
      {onNext && <button onClick={onNext} style={{ background: "#81C784", border: "none", borderRadius: 3, padding: "8px 24px", cursor: "pointer", fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: "#07070E" }}>{nxt}</button>}
    </div>
  );
}
