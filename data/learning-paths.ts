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

  // ═══════════════════════════════════════════════════════════════════════════
  // COURSE PATHS — Main AI-Powered Courses (5 total)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    slug: 'ai-data-analytics',
    title: 'AI-Powered Data Analytics',
    subtitle: 'Master cloud pipelines, BigQuery, executive dashboards, and AI-assisted SQL',
    description: 'A comprehensive 16-week path from fundamental spreadsheets to orchestrating cloud data transformations, executive BI storytelling, and AI-augmented analytics operations.',
    icon: '📊',
    color: 'from-blue-500 to-cyan-400',
    category: 'Path',
    outcomes: [
      'Write complex multi-table SQL JOINs and window functions',
      'Build executive Tableau & Power BI dashboards',
      'Automate Python data pipelines with Pandas',
      'Deploy AI-assisted analytics workflows with BigQuery & Gemini',
      'Create ATS-optimized analyst portfolios',
      'Master dbt transformations and Airflow DAGs'
    ],
    modules: [
      { title: 'Excel & Statistical Foundations', description: 'Data cleaning, Power Query ETL, descriptive statistics, and spreadsheet automation.', duration: 'Weeks 1–3', tools: ['Excel', 'Microsoft Copilot'] },
      { title: 'SQL & Cloud Data Warehousing', description: 'Relational queries, multi-layer JOINs, CTEs, window functions, and BigQuery.', duration: 'Weeks 4–6', tools: ['SQL', 'BigQuery', 'Gemini AI'] },
      { title: 'Python & Automated Analytics', description: 'Pandas data wrangling, programmatic EDA, and Streamlit web applications.', duration: 'Weeks 7–10', tools: ['Python', 'Pandas', 'Streamlit'] },
      { title: 'Business Intelligence & Storytelling', description: 'Stakeholder-ready dashboards, DAX measures, and narrative reporting.', duration: 'Weeks 11–13', tools: ['Tableau', 'Power BI', 'Looker Studio'] },
      { title: 'Modern Data Engineering & AI Ops', description: 'dbt transformations, Airflow DAGs, LLMs, and RAG chatbot stacks.', duration: 'Weeks 14–15', tools: ['dbt', 'Airflow', 'LangChain'] },
      { title: 'Employer Portfolio & Placement', description: 'ATS-optimized resumes, LinkedIn profiles, and interview preparation.', duration: 'Week 16', tools: ['GitHub', 'LinkedIn'] }
    ],
    projects: [
      { title: 'RetailCo Sales Performance Analyzer', description: 'Build an automated Excel dashboard with Power Query ETL pipelines.', difficulty: 'Beginner' },
      { title: 'E-Commerce Funnel Analytics Engine', description: 'Track user drop-offs across a multi-step checkout using CTEs and window functions.', difficulty: 'Intermediate' },
      { title: 'Customer Intelligence Platform', description: 'Build a Python-powered customer segmentation and cohort analysis system.', difficulty: 'Advanced' },
      { title: 'Executive Enterprise BI Suite', description: 'Design cross-platform Tableau + Power BI dashboards for C-suite stakeholders.', difficulty: 'Advanced' }
    ],
    aiTips: [
      'Use AI to generate mock SQL datasets for practice — ask the Mentor to create realistic e-commerce schemas.',
      'Paste your DataFrame structure to the AI Mentor for instant Pandas code suggestions.',
      'Ask AI to explain complex EXPLAIN ANALYZE plans step by step.'
    ]
  },

  {
    slug: 'ai-digital-marketing',
    title: 'AI-Powered Digital Marketing',
    subtitle: 'Build automated funnels, scale programmatic ads, and master attribution',
    description: 'A modern 12-week blueprint covering AI-generated copywriting, conversion funnel creation, programmatic ad network scaling, multi-touch web attribution, and SEO optimization.',
    icon: '📢',
    color: 'from-pink-500 to-rose-400',
    category: 'Path',
    outcomes: [
      'Build high-converting AI-powered landing pages and lead funnels',
      'Scale Google Ads and Meta campaigns with algorithmic budget allocation',
      'Configure GA4 custom event tracking and attribution models',
      'Generate SEO content clusters with AI-assisted keyword research',
      'Design automated email CRM nurture sequences',
      'Calculate and optimize LTV/CPA ratios across channels'
    ],
    modules: [
      { title: 'Funnel Automation & AI Copywriting', description: 'Landing page architecture, lead magnets, and generative ad copy systems.', duration: 'Weeks 1–3', tools: ['Microsoft Copilot', 'Zapier', 'Mailchimp'] },
      { title: 'Paid Traffic Scaling & Programmatic Ads', description: 'Google Search campaigns, Meta budget systems, and algorithmic ad templates.', duration: 'Weeks 4–7', tools: ['Google Ads', 'Meta Manager', 'AdCreative AI'] },
      { title: 'Advanced Web Analytics & Attribution', description: 'GA4 custom events, user journey tracking, and multi-touch attribution modeling.', duration: 'Weeks 8–10', tools: ['GA4', 'Looker Studio', 'BigQuery'] },
      { title: 'SEO & Brand Content Optimization', description: 'Data-driven SEO structures, Core Web Vitals, and generative asset loops.', duration: 'Weeks 11–12', tools: ['Semrush', 'Screaming Frog', 'Figma'] }
    ],
    projects: [
      { title: 'Programmatic Copywriting Pipeline', description: 'Build an AI system that generates, A/B tests, and optimizes ad copy at scale.', difficulty: 'Intermediate' },
      { title: 'Cross-Channel Ad Allocation Engine', description: 'Design an algorithmic budget distributor across Google, Meta, and LinkedIn.', difficulty: 'Advanced' },
      { title: 'LTV/CPA Executive Dashboard', description: 'Build a Looker Studio dashboard tracking customer lifetime value vs acquisition cost.', difficulty: 'Advanced' }
    ],
    aiTips: [
      'Use AI to generate 50+ ad copy variations instantly — then A/B test the top performers.',
      'Ask the Mentor to build GA4 custom event schemas for your specific business model.',
      'Let AI analyze your competitors\' SEO keyword gaps and suggest content clusters.'
    ]
  },

  {
    slug: 'ai-data-science',
    title: 'AI-Powered Data Science',
    subtitle: 'Build ML pipelines, neural networks, and explainable AI models',
    description: 'An advanced 16-week curriculum covering statistical regression, machine learning pipelines, deep learning architectures, SHAP interpretability, and production model deployment.',
    icon: '🧬',
    color: 'from-violet-500 to-purple-400',
    category: 'Path',
    outcomes: [
      'Build supervised regression and classification models from scratch',
      'Master Random Forest, XGBoost, and ensemble techniques',
      'Architect and train neural networks with TensorFlow/Keras',
      'Explain model predictions using SHAP and feature attribution',
      'Deploy ML models via Streamlit interactive dashboards',
      'Write robust data preprocessing and feature engineering pipelines'
    ],
    modules: [
      { title: 'Statistics & Advanced Modeling', description: 'Linear/logistic regression, ANOVA, hypothesis testing, and cohort algorithms.', duration: 'Weeks 1–4', tools: ['Python', 'SciPy', 'Statsmodels'] },
      { title: 'Machine Learning Pipelines', description: 'Ensemble modeling, hyperparameter tuning, cross-validation, and feature engineering.', duration: 'Weeks 5–8', tools: ['Scikit-Learn', 'XGBoost', 'Python'] },
      { title: 'Deep Learning & Neural Networks', description: 'Backpropagation, CNNs, transfer learning, and pre-trained weights deployment.', duration: 'Weeks 9–12', tools: ['TensorFlow', 'Keras', 'Python'] },
      { title: 'Interpretability & Model Deployment', description: 'SHAP explainability, pipeline serialization, and Streamlit model showcases.', duration: 'Weeks 13–16', tools: ['SHAP', 'Streamlit', 'GitHub'] }
    ],
    projects: [
      { title: 'Relational Cohort Algorithm Engine', description: 'Build statistical models to identify and predict user cohort behaviors.', difficulty: 'Intermediate' },
      { title: 'Predictive Customer Churn Engine', description: 'Train an XGBoost classifier to predict at-risk customers with 90%+ accuracy.', difficulty: 'Advanced' },
      { title: 'Neural Image Classifier Pipeline', description: 'Build a CNN that classifies product images with transfer learning.', difficulty: 'Advanced' },
      { title: 'Explainable AI Model Platform', description: 'Deploy an ML model with SHAP dashboards showing feature importance.', difficulty: 'Advanced' }
    ],
    aiTips: [
      'Use AI to generate synthetic training datasets when real data is limited.',
      'Ask the Mentor to explain the math behind backpropagation step by step.',
      'Let AI help you tune hyperparameters — describe your model and get optimal grid search ranges.'
    ]
  },

  {
    slug: 'ai-web-development',
    title: 'AI-Powered Web Development',
    subtitle: 'Architect fullstack apps with Next.js, APIs, databases, and CI/CD',
    description: 'A high-octane 14-week fullstack track building Next.js dynamic portals, secure REST APIs, Prisma databases, Stripe integrations, and automated CI/CD deployment pipelines.',
    icon: '💻',
    color: 'from-emerald-400 to-teal-500',
    category: 'Path',
    outcomes: [
      'Build responsive UIs with React, Tailwind CSS, and Framer Motion',
      'Architect Next.js App Router with dynamic routes and server actions',
      'Design and query Prisma ORM databases with MySQL',
      'Implement JWT authentication and middleware security',
      'Integrate Stripe payment webhooks and checkout flows',
      'Deploy to Vercel with GitHub Actions CI/CD pipelines'
    ],
    modules: [
      { title: 'Frontend Autolayouts & Styling', description: 'Responsive Tailwind grids, React hooks, and Framer Motion animations.', duration: 'Weeks 1–4', tools: ['React', 'Tailwind CSS', 'Framer Motion'] },
      { title: 'Fullstack Architecture Loops', description: 'Next.js App Router, Prisma ORM, MySQL, and REST API development.', duration: 'Weeks 5–8', tools: ['Next.js', 'Prisma', 'MySQL', 'Zod'] },
      { title: 'Enterprise Security & Integrations', description: 'JWT sessions, middleware route shields, and Stripe webhook processing.', duration: 'Weeks 9–11', tools: ['NextAuth.js', 'Stripe API', 'JWT'] },
      { title: 'Edge Deployment & AI Workflows', description: 'Vercel edge functions, GitHub Actions CI/CD, and AI-assisted debugging.', duration: 'Weeks 12–14', tools: ['Vercel', 'GitHub Actions', 'Copilot'] }
    ],
    projects: [
      { title: 'Premium Glassmorphic Dashboard UI', description: 'Build a stunning dark-mode dashboard with animations and responsive layouts.', difficulty: 'Beginner' },
      { title: 'Dynamic REST API Database Portal', description: 'Create a fullstack CRUD application with Prisma and Next.js API routes.', difficulty: 'Intermediate' },
      { title: 'Audited Secure E-Commerce Backend', description: 'Build a payment-enabled platform with Stripe, JWT auth, and role-based access.', difficulty: 'Advanced' },
      { title: 'Orchestrated Deployed Web OS', description: 'Deploy a production app with CI/CD, edge functions, and AI-assisted code review.', difficulty: 'Advanced' }
    ],
    aiTips: [
      'Use Copilot to scaffold React components — then customize the design system yourself.',
      'Ask AI to generate Prisma schema migrations from a plain-English database description.',
      'Let the Mentor debug your API route errors — paste the full error stack for instant fixes.'
    ]
  },

  {
    slug: 'ai-graphic-design',
    title: 'AI-Powered Graphic Design',
    subtitle: 'Design premium brands, UI prototypes, and generative visual assets',
    description: 'A premier 10-week visual arts curriculum covering Adobe branding frameworks, Figma dynamic component auto-layouts, Midjourney generative art, and portfolio-ready design systems.',
    icon: '🎨',
    color: 'from-amber-400 to-orange-500',
    category: 'Path',
    outcomes: [
      'Design vectorized brand logos and corporate identity systems',
      'Master Adobe Illustrator paths and Photoshop compositing',
      'Build responsive Figma auto-layouts with dynamic components',
      'Create high-fidelity interactive prototypes with transitions',
      'Generate AI art with Midjourney prompt engineering',
      'Publish professional design portfolios on Behance/Dribbble'
    ],
    modules: [
      { title: 'Creative Suite Branding', description: 'Vector logos, color palettes, Photoshop masking, and brand guidelines.', duration: 'Weeks 1–3', tools: ['Adobe Illustrator', 'Photoshop'] },
      { title: 'Figma Component Systems', description: 'Auto-layouts, master UI components, variants, and dynamic prototyping.', duration: 'Weeks 4–7', tools: ['Figma'] },
      { title: 'Generative Asset Engineering', description: 'Midjourney prompts, layout optimization, and digital portfolio publishing.', duration: 'Weeks 8–10', tools: ['Midjourney', 'Figma', 'GitHub Pages'] }
    ],
    projects: [
      { title: 'Brand Identity Vector Guideline', description: 'Design a complete corporate brand identity with logo, colors, and typography.', difficulty: 'Beginner' },
      { title: 'Premium SaaS Console UI Prototype', description: 'Build a high-fidelity Figma prototype for a SaaS dashboard with interactions.', difficulty: 'Intermediate' },
      { title: 'Generative Visual Design Portfolio', description: 'Curate an AI-generated art collection and publish on Behance/Dribbble.', difficulty: 'Advanced' }
    ],
    aiTips: [
      'Use Midjourney with detailed style prompts — specify "minimalist, vector, flat design, brand identity".',
      'Ask AI to suggest complementary color palettes based on your brand\'s primary color.',
      'Let the Mentor critique your UI layouts — describe the screen and get accessibility feedback.'
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TOOL HUBS — Cross-course deep dives
  // ═══════════════════════════════════════════════════════════════════════════

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

  // ═══════════════════════════════════════════════════════════════════════════
  // CONCEPT HUBS — Advanced cross-course concepts
  // ═══════════════════════════════════════════════════════════════════════════

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
