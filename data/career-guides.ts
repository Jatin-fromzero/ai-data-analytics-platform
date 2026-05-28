export interface GuideStep {
  title: string;
  content: string;
  actionItem: string;
}

export interface CareerGuide {
  slug: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  readingTime: string;
  domain: string; // Which course this belongs to
  steps: GuideStep[];
  commonMistakes: string[];
}

export const careerGuides: CareerGuide[] = [

  // ═══════════════════════════════════════════════════════════════════════════
  // DATA ANALYTICS
  // ═══════════════════════════════════════════════════════════════════════════

  {
    slug: 'analytics-resume',
    title: 'The Analytics Resume Builder',
    description: 'Stop sending out generic resumes. Learn how to write a data-driven, ATS-friendly resume that gets you past the recruiters and into the interview.',
    icon: '📄',
    color: 'from-blue-600 to-indigo-600',
    readingTime: '8 min read',
    domain: 'Data Analytics',
    steps: [
      {
        title: 'Quantify Your Impact',
        content: 'Never say "Created dashboards". Always say "Developed automated Power BI dashboards that reduced reporting time by 15 hours/week for the executive team."',
        actionItem: 'Rewrite 3 bullet points using the XYZ formula (Accomplished X, as measured by Y, by doing Z).'
      },
      {
        title: 'The Skills Matrix',
        content: 'Group your skills logically. Do not mix soft skills with hard skills. Create sections for: Languages (SQL, Python), Tools (Tableau, Excel), and Concepts (A/B Testing, Machine Learning).',
        actionItem: 'Reorganize your skills section into 3 distinct categories.'
      },
      {
        title: 'Project Showcases',
        content: 'If you lack experience, your projects ARE your experience. Include links to the GitHub repository and a live interactive dashboard if possible.',
        actionItem: 'Add a "Selected Projects" section above your Education section.'
      }
    ],
    commonMistakes: [
      'Using progress bars or charts to rate your own skills (e.g., Python: 80%).',
      'Listing generic responsibilities instead of measurable outcomes.',
      'Saving the resume as a Word document instead of a clean PDF.'
    ]
  },
  {
    slug: 'analytics-portfolio',
    title: 'Analytics GitHub Portfolio Guide',
    description: 'A data analyst without a portfolio is a ghost. Learn how to structure a GitHub repository that proves you can write clean code and document your findings.',
    icon: '💻',
    color: 'from-slate-700 to-slate-900',
    readingTime: '12 min read',
    domain: 'Data Analytics',
    steps: [
      {
        title: 'The README is Everything',
        content: 'Recruiters will not read your code. They will read your README.md. Include the business problem, the methodology, the final insights, and screenshots of the visualizations.',
        actionItem: 'Write a comprehensive README for your best project using Markdown.'
      },
      {
        title: 'Clean Code Practices',
        content: 'Use Jupyter Notebooks for exploratory data analysis (EDA), but ensure the notebook is clean. Remove debugging cells, add markdown headers, and comment your complex SQL queries.',
        actionItem: 'Refactor your latest Python script to include docstrings and modular functions.'
      },
      {
        title: 'Pin Your Best Work',
        content: 'Use GitHub\'s "Pinned Repositories" feature to highlight your top 4 projects. Make sure they cover different skills (e.g., one SQL, one Python, one Dashboard).',
        actionItem: 'Pin exactly 3 diverse projects to your GitHub profile.'
      }
    ],
    commonMistakes: [
      'Committing massive dataset files (.csv > 50MB) instead of using .gitignore.',
      'Leaving the default repository name (e.g., "Untitled-1").',
      'Having 0 commits in the last 6 months.'
    ]
  },
  {
    slug: 'analytics-interview',
    title: 'Analytics Interview Prep',
    description: 'Master the technical screening, the behavioral questions, and the dreaded live SQL coding challenge.',
    icon: '🎯',
    color: 'from-emerald-500 to-teal-700',
    readingTime: '15 min read',
    domain: 'Data Analytics',
    steps: [
      {
        title: 'The Technical Screen',
        content: 'Expect live SQL challenges. You must know how to use CTEs, Window Functions (ROW_NUMBER, RANK), and aggregations under pressure. Practice on LeetCode or StrataScratch.',
        actionItem: 'Solve 3 medium-level SQL questions on StrataScratch today.'
      },
      {
        title: 'The Case Study',
        content: 'Many companies give take-home assignments. The key is not just getting the right answer, but explaining your thought process. Always include an "Executive Summary" slide.',
        actionItem: 'Practice a mock take-home assignment and present it to a friend.'
      },
      {
        title: 'Behavioral (STAR Method)',
        content: 'When asked "Tell me about a time you...", use the Situation, Task, Action, Result framework. Keep it concise and focus on the business impact.',
        actionItem: 'Write down 3 STAR stories from your past experience.'
      }
    ],
    commonMistakes: [
      'Jumping straight into writing SQL without clarifying the database schema first.',
      'Failing to tie data insights back to business revenue or cost savings.',
      'Not asking intelligent questions at the end of the interview.'
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // DIGITAL MARKETING
  // ═══════════════════════════════════════════════════════════════════════════

  {
    slug: 'marketing-resume',
    title: 'The Growth Marketer Resume',
    description: 'Learn how to craft a conversion-focused marketing resume that highlights ROAS, CPA metrics, and campaign performance — the language hiring managers speak.',
    icon: '📋',
    color: 'from-pink-500 to-rose-600',
    readingTime: '8 min read',
    domain: 'Digital Marketing',
    steps: [
      {
        title: 'Lead with Metrics',
        content: 'Marketing resumes live and die by numbers. Never say "Managed social media." Say "Scaled Instagram engagement 340% YoY, driving 12K qualified leads at $2.30 CPL."',
        actionItem: 'Rewrite your top 3 achievements with specific ROAS, CPA, or conversion metrics.'
      },
      {
        title: 'Show Your Funnel Thinking',
        content: 'Hiring managers want to see that you think in funnels — awareness → consideration → conversion → retention. Structure your experience to show full-funnel impact.',
        actionItem: 'Map each role to which funnel stage you primarily impacted.'
      },
      {
        title: 'Certifications That Matter',
        content: 'Google Ads Certification, Meta Blueprint, and HubSpot Inbound are baseline requirements. List them prominently — they\'re your "proof of competence" for ATS scanners.',
        actionItem: 'Complete at least 2 industry certifications and add them to your resume header.'
      }
    ],
    commonMistakes: [
      'Saying "creative thinker" without showing specific campaign results.',
      'Not including any quantified metrics (impressions, conversions, ROAS).',
      'Listing every social platform instead of focusing on your strongest channels.'
    ]
  },
  {
    slug: 'marketing-portfolio',
    title: 'Marketing Case Study Portfolio',
    description: 'Build a portfolio of 3-5 real campaign case studies that demonstrate your strategic thinking, execution skills, and measurable business results.',
    icon: '📊',
    color: 'from-fuchsia-500 to-pink-600',
    readingTime: '10 min read',
    domain: 'Digital Marketing',
    steps: [
      {
        title: 'The Case Study Framework',
        content: 'Every case study follows: Challenge → Strategy → Execution → Results. Include screenshots of dashboards, ad creatives, and before/after metrics.',
        actionItem: 'Write one complete case study for your best-performing campaign.'
      },
      {
        title: 'Include Real Dashboards',
        content: 'Don\'t just say "increased traffic." Show the GA4 dashboard with the traffic spike circled. Visual proof converts skeptical hiring managers.',
        actionItem: 'Screenshot 3 key dashboards and annotate them with insights.'
      },
      {
        title: 'Host It Professionally',
        content: 'Use Notion, a personal website, or a Google Sites portfolio. Make it clean, branded, and shareable via a single link.',
        actionItem: 'Build a 3-page portfolio site with your top case studies.'
      }
    ],
    commonMistakes: [
      'Only showing "vanity metrics" (likes, followers) instead of business outcomes (revenue, MQLs).',
      'Not explaining your specific role in team campaigns.',
      'Using low-resolution screenshots that are hard to read.'
    ]
  },
  {
    slug: 'marketing-interview',
    title: 'Marketing Interview Prep',
    description: 'Ace the marketing interview — from strategic whiteboard exercises and campaign audits to behavioral questions about cross-functional collaboration.',
    icon: '🎤',
    color: 'from-rose-500 to-red-600',
    readingTime: '12 min read',
    domain: 'Digital Marketing',
    steps: [
      {
        title: 'The Campaign Audit',
        content: 'Many companies will show you a live campaign and ask you to critique it. Look for: targeting gaps, creative fatigue, budget allocation issues, and missing attribution tracking.',
        actionItem: 'Audit 3 real ad campaigns you can find online and write critiques.'
      },
      {
        title: 'Whiteboard Strategy Session',
        content: 'You might be asked "How would you launch our product in market X?" Structure your answer: audience research → channel selection → budget → KPIs → testing framework.',
        actionItem: 'Practice a 10-minute GTM strategy pitch for a product you love.'
      },
      {
        title: 'Cross-Functional Collaboration',
        content: 'Modern marketers work with product, sales, and engineering. Prepare examples of how you\'ve collaborated cross-functionally to drive results.',
        actionItem: 'Prepare 2 STAR stories about working with non-marketing teams.'
      }
    ],
    commonMistakes: [
      'Only talking about creative ideas without tying them to business goals.',
      'Not knowing the company\'s current marketing channels and competitors.',
      'Ignoring the measurement/attribution question entirely.'
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // DATA SCIENCE
  // ═══════════════════════════════════════════════════════════════════════════

  {
    slug: 'datascience-resume',
    title: 'The ML Engineer Resume',
    description: 'Build a resume that speaks the language of ML hiring managers — model architectures, evaluation metrics, and production deployment experience.',
    icon: '🧪',
    color: 'from-violet-500 to-purple-700',
    readingTime: '9 min read',
    domain: 'Data Science',
    steps: [
      {
        title: 'Highlight Model Performance',
        content: 'Don\'t just say "Built a model." Say "Trained an XGBoost classifier achieving 94% AUC-ROC on a 2M-row imbalanced dataset, reducing false negatives by 37%."',
        actionItem: 'Add specific accuracy, F1, AUC-ROC, or RMSE scores to every ML project.'
      },
      {
        title: 'Show End-to-End Thinking',
        content: 'Hiring managers want to see: data collection → preprocessing → feature engineering → modeling → evaluation → deployment. Show the full pipeline.',
        actionItem: 'Add a "Pipeline Architecture" bullet to each ML project on your resume.'
      },
      {
        title: 'Research Paper Style',
        content: 'For senior roles, format projects like mini papers: Abstract, Method, Results. This signals academic rigor and structured thinking.',
        actionItem: 'Restructure your best project description using Abstract/Method/Results format.'
      }
    ],
    commonMistakes: [
      'Listing every ML algorithm without showing which ones you actually used in production.',
      'Not mentioning the dataset size, which is critical for credibility.',
      'Ignoring deployment — models that never shipped don\'t count.'
    ]
  },
  {
    slug: 'datascience-portfolio',
    title: 'Kaggle & GitHub Portfolio',
    description: 'Stand out with a Kaggle competition portfolio and GitHub repos that demonstrate real ML engineering skills — not just tutorial copies.',
    icon: '🏆',
    color: 'from-indigo-500 to-violet-600',
    readingTime: '14 min read',
    domain: 'Data Science',
    steps: [
      {
        title: 'Kaggle Competition Strategy',
        content: 'Don\'t aim for 1st place. Aim for a top 20% finish and a detailed write-up explaining your approach. Hiring managers value explanation over rank.',
        actionItem: 'Enter one active Kaggle competition and submit a baseline model this week.'
      },
      {
        title: 'End-to-End ML Notebooks',
        content: 'Your notebook should tell a story: EDA → feature engineering → model comparison → error analysis → business recommendations. Add markdown sections with insights.',
        actionItem: 'Refactor one Kaggle notebook into a professional storytelling format.'
      },
      {
        title: 'Deployed Model Demos',
        content: 'Deploy at least one model as a live Streamlit app. An interactive demo is 10x more impressive than a static notebook.',
        actionItem: 'Deploy your best model as a Streamlit app on Streamlit Cloud.'
      }
    ],
    commonMistakes: [
      'Only doing Kaggle tutorials (Titanic, House Prices) without original work.',
      'Not writing any documentation — just raw code with no explanation.',
      'Ignoring version control — committing everything in one massive push.'
    ]
  },
  {
    slug: 'datascience-interview',
    title: 'Data Science Interview Prep',
    description: 'Prepare for the ML interview gauntlet — from probability theory and coding screens to system design and business case presentations.',
    icon: '🧠',
    color: 'from-purple-600 to-indigo-700',
    readingTime: '18 min read',
    domain: 'Data Science',
    steps: [
      {
        title: 'ML Theory Deep Dive',
        content: 'Know bias-variance tradeoff, regularization (L1/L2), gradient descent, overfitting, cross-validation, and the difference between precision and recall by heart.',
        actionItem: 'Create flashcards for 20 core ML concepts and review daily for a week.'
      },
      {
        title: 'The Coding Challenge',
        content: 'Expect Python coding problems involving data manipulation (Pandas), algorithm implementation (e.g., K-Means from scratch), and SQL complex queries.',
        actionItem: 'Solve 5 LeetCode Easy/Medium problems using Python + Pandas.'
      },
      {
        title: 'ML System Design',
        content: 'For senior roles, you\'ll be asked "How would you design a recommendation system for X?" Practice: data pipeline → feature store → model training → serving → monitoring.',
        actionItem: 'Draw out an ML system design for a real-world product (Netflix, Spotify, etc.).'
      }
    ],
    commonMistakes: [
      'Memorizing algorithms without understanding when to use each one.',
      'Not being able to explain your own projects\' decisions under questioning.',
      'Failing to discuss model monitoring, drift detection, and retraining strategies.'
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // WEB DEVELOPMENT
  // ═══════════════════════════════════════════════════════════════════════════

  {
    slug: 'webdev-resume',
    title: 'The Developer Resume',
    description: 'Craft a clean, ATS-optimized developer resume that highlights your tech stack, shipped products, and quantified engineering impact.',
    icon: '📝',
    color: 'from-emerald-500 to-teal-600',
    readingTime: '8 min read',
    domain: 'Web Development',
    steps: [
      {
        title: 'Lead with Shipped Products',
        content: 'Instead of "Built a React application," say "Shipped a Next.js e-commerce platform serving 50K monthly users with 99.9% uptime and sub-200ms TTFB."',
        actionItem: 'Rewrite 3 project descriptions with deployed URLs, user counts, or performance metrics.'
      },
      {
        title: 'Tech Stack Clarity',
        content: 'Organize skills by layer: Frontend (React, Next.js, Tailwind), Backend (Node.js, Prisma, REST), DevOps (Vercel, Docker, GitHub Actions). Don\'t mix them.',
        actionItem: 'Create a 3-layer skills section: Frontend / Backend / DevOps.'
      },
      {
        title: 'Open Source & Contributions',
        content: 'Even small PRs to popular repos signal collaboration skills. List any npm packages, open-source contributions, or community involvement.',
        actionItem: 'Make one meaningful PR to an open-source project and add it to your resume.'
      }
    ],
    commonMistakes: [
      'Listing 20+ technologies without demonstrating depth in any.',
      'Not including live deployed URLs for your projects.',
      'Using a flashy, non-ATS-friendly resume template with columns and icons.'
    ]
  },
  {
    slug: 'webdev-portfolio',
    title: 'Developer GitHub Portfolio',
    description: 'Build a GitHub profile that screams "hire me" — with pinned repos, clean READMEs, and a personal portfolio site that showcases your engineering quality.',
    icon: '🌐',
    color: 'from-teal-500 to-cyan-600',
    readingTime: '11 min read',
    domain: 'Web Development',
    steps: [
      {
        title: 'The Personal Portfolio Site',
        content: 'Build your own portfolio website using the stack you know best. Deploy it live. This IS your resume — make it beautiful, fast, and technically impressive.',
        actionItem: 'Build and deploy a personal portfolio site using Next.js + Vercel.'
      },
      {
        title: 'Project Diversity',
        content: 'Show range: one fullstack CRUD app, one API integration project, one UI-focused creative project. Cover different skills with each.',
        actionItem: 'Ensure your pinned repos demonstrate at least 3 different skill areas.'
      },
      {
        title: 'Green Contribution Graph',
        content: 'A consistently green GitHub contribution graph signals discipline and active coding habits. Aim for at least 3-4 commits per week.',
        actionItem: 'Set a goal to commit code at least 4 times per week for the next month.'
      }
    ],
    commonMistakes: [
      'Having a portfolio that loads slowly or has broken links.',
      'Only showcasing tutorial clones (todo apps, weather apps) without customization.',
      'Neglecting responsive design — your portfolio should work on mobile.'
    ]
  },
  {
    slug: 'webdev-interview',
    title: 'Web Dev Interview Prep',
    description: 'Prepare for the frontend/fullstack interview — from React component design and system architecture to live coding and behavioral questions.',
    icon: '⚡',
    color: 'from-green-500 to-emerald-600',
    readingTime: '15 min read',
    domain: 'Web Development',
    steps: [
      {
        title: 'Frontend Coding Challenge',
        content: 'Build a component from scratch (e.g., autocomplete, infinite scroll, modal). Focus on: state management, edge cases, accessibility, and performance.',
        actionItem: 'Build 3 common UI components from scratch without a library.'
      },
      {
        title: 'System Design for Frontend',
        content: 'For senior roles: "Design a real-time collaborative editor" or "Design a dashboard with live data." Think: data flow, caching, WebSockets, component architecture.',
        actionItem: 'Practice designing 2 frontend system architectures on a whiteboard.'
      },
      {
        title: 'JavaScript Fundamentals',
        content: 'Know closures, prototypal inheritance, event loop, promises/async-await, and the difference between == and ===. These come up in every interview.',
        actionItem: 'Solve 10 JavaScript conceptual questions on a platform like GreatFrontEnd.'
      }
    ],
    commonMistakes: [
      'Over-engineering simple components with unnecessary state management.',
      'Not testing edge cases: empty states, loading states, error boundaries.',
      'Forgetting accessibility — keyboard navigation, ARIA labels, focus management.'
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GRAPHIC DESIGN
  // ═══════════════════════════════════════════════════════════════════════════

  {
    slug: 'design-resume',
    title: 'The Creative Resume',
    description: 'Design a visually stunning yet ATS-scannable resume that balances creative flair with professional structure — the designer\'s paradox solved.',
    icon: '🎨',
    color: 'from-amber-500 to-orange-600',
    readingTime: '7 min read',
    domain: 'Graphic Design',
    steps: [
      {
        title: 'Design Your Resume as a Portfolio Piece',
        content: 'Your resume IS a design sample. Use your brand colors, clean typography, and thoughtful white space. But ensure it passes ATS — use a single-column layout with standard headings.',
        actionItem: 'Redesign your resume in Figma with your personal brand system, then export as clean PDF.'
      },
      {
        title: 'Show Business Impact of Design',
        content: 'Don\'t just say "Designed a website." Say "Redesigned the product landing page, increasing conversion rate from 2.1% to 4.7% — a 124% improvement."',
        actionItem: 'Add conversion metrics or engagement numbers to 3 project bullet points.'
      },
      {
        title: 'Link to Your Behance/Dribbble',
        content: 'Include a clickable link to your online portfolio prominently at the top. This is the single most important element on a designer\'s resume.',
        actionItem: 'Ensure your Behance/Dribbble link is the first thing visible after your name.'
      }
    ],
    commonMistakes: [
      'Making a beautiful resume that ATS software can\'t parse (multi-column, image-based text).',
      'Not linking to any online portfolio.',
      'Listing software skills (Figma, Photoshop) without showing what you designed with them.'
    ]
  },
  {
    slug: 'design-portfolio',
    title: 'Behance & Dribbble Portfolio',
    description: 'Curate a Behance/Dribbble portfolio that attracts clients, impresses art directors, and showcases your unique design voice with real-world case studies.',
    icon: '🖼️',
    color: 'from-orange-500 to-red-500',
    readingTime: '10 min read',
    domain: 'Graphic Design',
    steps: [
      {
        title: 'Case Study Format',
        content: 'Don\'t just post final mockups. Show the process: brief → research → sketches → iterations → final design → results. This tells a story of your thinking.',
        actionItem: 'Convert your best project into a 10-slide Behance case study with process shots.'
      },
      {
        title: 'Cohesive Visual Brand',
        content: 'Your portfolio should itself be beautifully designed. Use consistent cover images, a defined color palette, and clean project thumbnails.',
        actionItem: 'Redesign all your project cover images to follow a cohesive visual system.'
      },
      {
        title: 'Include Diverse Work',
        content: 'Show range: branding, UI/UX, illustration, social media graphics, packaging. But curate — only show your best 6-8 projects, not everything you\'ve ever made.',
        actionItem: 'Remove your weakest projects and replace with your 2 strongest recent pieces.'
      }
    ],
    commonMistakes: [
      'Posting 50+ mediocre projects instead of 6-8 excellent ones.',
      'No process documentation — just final mockups without context.',
      'Using generic stock imagery that doesn\'t represent your design voice.'
    ]
  },
  {
    slug: 'design-interview',
    title: 'Design Interview Prep',
    description: 'Navigate the design interview — from portfolio walkthroughs and whiteboard exercises to design critiques and culture fit questions.',
    icon: '✏️',
    color: 'from-yellow-500 to-amber-600',
    readingTime: '10 min read',
    domain: 'Graphic Design',
    steps: [
      {
        title: 'The Portfolio Walkthrough',
        content: 'You\'ll present 2-3 case studies. For each, explain: the problem, your process, key decisions, trade-offs, and measurable results. Practice the 5-minute version.',
        actionItem: 'Practice presenting each case study in exactly 5 minutes. Time yourself.'
      },
      {
        title: 'The Whiteboard Exercise',
        content: 'You may be given a design challenge (e.g., "Design a checkout flow for X"). Think out loud: clarify requirements → sketch wireframes → discuss trade-offs → iterate.',
        actionItem: 'Practice 3 whiteboard exercises with a friend timing you (20 minutes each).'
      },
      {
        title: 'Design Critique Skills',
        content: 'You might be asked to critique an existing design. Be constructive, specific, and always suggest alternatives. "I notice the CTA is below the fold — moving it up could improve conversions."',
        actionItem: 'Critique 3 real websites and write up structured feedback for each.'
      }
    ],
    commonMistakes: [
      'Spending too long on one case study and rushing through the others.',
      'Not explaining your decision-making process — just showing final designs.',
      'Being unable to accept constructive criticism gracefully during the critique.'
    ]
  }
];

// ── Domain groupings for filtering ──────────────────────────────────────────
export const careerDomains = [
  { key: 'all', label: 'All Domains', icon: '🎯' },
  { key: 'Data Analytics', label: 'Data Analytics', icon: '📊' },
  { key: 'Digital Marketing', label: 'Digital Marketing', icon: '📢' },
  { key: 'Data Science', label: 'Data Science', icon: '🧬' },
  { key: 'Web Development', label: 'Web Development', icon: '💻' },
  { key: 'Graphic Design', label: 'Graphic Design', icon: '🎨' },
];

export function getCareerGuideBySlug(slug: string): CareerGuide | undefined {
  return careerGuides.find(guide => guide.slug === slug);
}

export function getGuidesByDomain(domain: string): CareerGuide[] {
  if (domain === 'all') return careerGuides;
  return careerGuides.filter(guide => guide.domain === domain);
}
