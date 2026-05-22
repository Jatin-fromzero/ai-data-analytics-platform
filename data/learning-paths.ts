export interface LearningModule {
  title: string;
  description: string;
  duration: string;
  tools: string[];
}

export interface MiniProject {
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface LearningHub {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
  category: 'Path' | 'Tool' | 'Concept';
  outcomes: string[];
  modules: LearningModule[];
  projects: MiniProject[];
  aiTips: string[];
}

export const learningHubs: LearningHub[] = [
  // ─── TOOL HUBS ─────────────────────────────────────────────────────────────
  {
    slug: 'sql-foundations',
    title: 'SQL Learning Hub',
    subtitle: 'The universal language of data',
    description: 'Master SQL from basic SELECT statements to complex window functions and CTEs. SQL is the non-negotiable foundation of all data analytics.',
    icon: '🐘',
    color: 'from-blue-500 to-cyan-400',
    category: 'Tool',
    outcomes: ['Write complex multi-table joins', 'Optimize query performance', 'Analyze time-series data', 'Build data warehouse schemas'],
    modules: [
      { title: 'SQL Basics', description: 'SELECT, WHERE, GROUP BY, and basic aggregations.', duration: '1 Week', tools: ['PostgreSQL'] },
      { title: 'Joins & Relational Data', description: 'INNER, LEFT, RIGHT joins and understanding ERDs.', duration: '1 Week', tools: ['PostgreSQL', 'DBeaver'] },
      { title: 'Advanced SQL', description: 'CTEs, Window Functions, and Subqueries.', duration: '2 Weeks', tools: ['Snowflake', 'BigQuery'] }
    ],
    projects: [
      { title: 'E-Commerce User Funnel', description: 'Track user drop-offs across a multi-step checkout process using CTEs.', difficulty: 'Intermediate' },
      { title: 'Inventory Forecasting', description: 'Use window functions to calculate 7-day rolling averages of sales.', difficulty: 'Advanced' }
    ],
    aiTips: [
      'Use the AI Mentor to explain complex EXPLAIN ANALYZE plans.',
      'Ask the AI to generate mock SQL datasets for your practice.'
    ]
  },
  {
    slug: 'python-analytics',
    title: 'Python for Analytics',
    subtitle: 'Automate, analyze, and predict',
    description: 'Learn Python specifically tailored for data manipulation. Move beyond spreadsheets into the world of pandas, numpy, and automated pipelines.',
    icon: '🐍',
    color: 'from-yellow-400 to-orange-500',
    category: 'Tool',
    outcomes: ['Clean messy datasets with pandas', 'Automate reporting scripts', 'Perform exploratory data analysis (EDA)', 'Build foundation for Machine Learning'],
    modules: [
      { title: 'Python Basics', description: 'Variables, loops, functions, and data structures.', duration: '1 Week', tools: ['Jupyter'] },
      { title: 'Pandas & Data Wrangling', description: 'DataFrames, merging, cleaning, and pivoting.', duration: '2 Weeks', tools: ['Pandas', 'NumPy'] },
      { title: 'Data Visualization', description: 'Creating programmatic charts and graphs.', duration: '1 Week', tools: ['Matplotlib', 'Seaborn'] }
    ],
    projects: [
      { title: 'Financial API Dashboard', description: 'Pull stock data via API and clean it using pandas.', difficulty: 'Beginner' },
      { title: 'Customer Segmentation', description: 'Clean a CRM dataset and group users by purchasing behavior.', difficulty: 'Intermediate' }
    ],
    aiTips: [
      'Stuck on a pandas syntax? Paste your DataFrame structure to the AI Mentor for the exact code.',
      'Use AI to generate regex patterns for data cleaning.'
    ]
  },
  {
    slug: 'power-bi',
    title: 'Power BI Hub',
    subtitle: 'Enterprise business intelligence',
    description: 'Master Microsoft Power BI to transform raw data into stunning, interactive, and actionable corporate dashboards.',
    icon: '📊',
    color: 'from-yellow-500 to-amber-600',
    category: 'Tool',
    outcomes: ['Build interactive dashboards', 'Master DAX formulas', 'Design Star Schemas in Power Query', 'Publish enterprise reports'],
    modules: [
      { title: 'Power Query Engine', description: 'Importing, transforming, and loading data.', duration: '1 Week', tools: ['Power Query'] },
      { title: 'Data Modeling', description: 'Building robust relational models and star schemas.', duration: '1 Week', tools: ['Power BI Desktop'] },
      { title: 'DAX Mastery', description: 'Writing advanced measures and calculated columns.', duration: '2 Weeks', tools: ['DAX'] }
    ],
    projects: [
      { title: 'HR Analytics Dashboard', description: 'Visualize employee retention and salary distributions.', difficulty: 'Intermediate' },
      { title: 'Executive Sales Tracker', description: 'A high-level dashboard using complex DAX time-intelligence.', difficulty: 'Advanced' }
    ],
    aiTips: [
      'DAX can be confusing. Ask the AI Mentor to explain the difference between CALCULATE and FILTER.',
      'Use AI to suggest color palettes for your dashboards.'
    ]
  },
  // ─── CONCEPT HUBS ─────────────────────────────────────────────────────────────
  {
    slug: 'genai-for-analysts',
    title: 'GenAI for Analysts',
    subtitle: 'The future of analytics workflows',
    description: 'Learn how to integrate Large Language Models (LLMs) and Prompt Engineering into your daily data workflows to work 10x faster.',
    icon: '🤖',
    color: 'from-brand to-purple-600',
    category: 'Concept',
    outcomes: ['Write advanced analytical prompts', 'Automate Python script generation', 'Use AI for rapid EDA', 'Understand RAG limitations'],
    modules: [
      { title: 'Prompt Engineering', description: 'Structuring prompts for data analysis.', duration: '1 Week', tools: ['ChatGPT', 'Gemini'] },
      { title: 'AI-Assisted Coding', description: 'Using Copilots to write SQL and Python.', duration: '1 Week', tools: ['GitHub Copilot', 'Cursor'] },
      { title: 'Automated Reporting', description: 'Having AI summarize data findings into executive briefs.', duration: '1 Week', tools: ['LangChain'] }
    ],
    projects: [
      { title: 'Automated Insight Generator', description: 'A script that feeds data to an LLM and outputs a summary report.', difficulty: 'Advanced' }
    ],
    aiTips: [
      'Treat the AI like a junior analyst. Give it explicit instructions and persona contexts.',
      'Always verify AI-generated SQL against your actual schema.'
    ]
  },
  // ─── PATH HUBS ─────────────────────────────────────────────────────────────
  {
    slug: 'beginner-path',
    title: 'Beginner Analytics Path',
    subtitle: 'Your first steps into data',
    description: 'A highly structured, step-by-step roadmap for absolute beginners with no prior coding or math experience.',
    icon: '🌱',
    color: 'from-emerald-400 to-teal-500',
    category: 'Path',
    outcomes: ['Understand data types', 'Master Excel functions', 'Write basic SQL', 'Build a simple dashboard'],
    modules: [
      { title: 'Data Thinking', description: 'How to approach problems like an analyst.', duration: '1 Week', tools: ['Conceptual'] },
      { title: 'Excel Mastery', description: 'VLOOKUP, Pivot Tables, and logical functions.', duration: '2 Weeks', tools: ['Excel', 'Google Sheets'] },
      { title: 'Intro to SQL', description: 'Querying databases for answers.', duration: '2 Weeks', tools: ['PostgreSQL'] }
    ],
    projects: [
      { title: 'Personal Finance Tracker', description: 'Build a comprehensive budget dashboard in Excel.', difficulty: 'Beginner' }
    ],
    aiTips: [
      'Don\'t feel overwhelmed. Ask the AI Mentor to explain things "like I am 5 years old".',
      'Use the AI to quiz you on basic concepts.'
    ]
  }
];

export function getLearningHubBySlug(slug: string): LearningHub | undefined {
  return learningHubs.find(hub => hub.slug === slug);
}
