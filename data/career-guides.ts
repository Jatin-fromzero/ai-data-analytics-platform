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
  steps: GuideStep[];
  commonMistakes: string[];
}

export const careerGuides: CareerGuide[] = [
  {
    slug: 'resume-builder',
    title: 'The Analytics Resume Builder',
    description: 'Stop sending out generic resumes. Learn how to write a data-driven, ATS-friendly resume that gets you past the recruiters and into the interview.',
    icon: '📄',
    color: 'from-blue-600 to-indigo-600',
    readingTime: '8 min read',
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
    slug: 'github-portfolio',
    title: 'GitHub Portfolio Guide',
    description: 'A data analyst without a portfolio is a ghost. Learn how to structure a GitHub repository that proves you can write clean code and document your findings.',
    icon: '💻',
    color: 'from-slate-700 to-slate-900',
    readingTime: '12 min read',
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
    slug: 'interview-prep',
    title: 'Analytics Interview Prep',
    description: 'Master the technical screening, the behavioral questions, and the dreaded live SQL coding challenge.',
    icon: '🎯',
    color: 'from-emerald-500 to-teal-700',
    readingTime: '15 min read',
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
  }
];

export function getCareerGuideBySlug(slug: string): CareerGuide | undefined {
  return careerGuides.find(guide => guide.slug === slug);
}
