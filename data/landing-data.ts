export interface TrustStat {
  value: string;
  label: string;
}

export interface Outcome {
  title: string;
  description: string;
  icon: string;
}

export interface AITool {
  name: string;
  description: string;
  icon: string;
}

export interface RoadmapStep {
  step: string;
  title: string;
  description: string;
}

export interface ProjectShowcase {
  title: string;
  highlight: string;
}

export interface PlatformFeature {
  title: string;
  description: string;
  icon: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

export const trustStats: TrustStat[] = [
  { value: '4.9/5', label: 'Learner satisfaction' },
  { value: '92%', label: 'Career advancement' },
  { value: '120+', label: 'Hands-on projects' }
];

export const quickHighlights: string[] = [
  'Project-driven learning',
  'AI-enhanced analytics workflows',
  'Job-ready portfolio deliverables'
];

export const outcomes: Outcome[] = [
  {
    title: 'Job-ready analytics skills',
    description: 'SQL, dashboards, storytelling, and AI-driven insights for business decisions.',
    icon: '📊'
  },
  {
    title: 'AI-powered workflow habits',
    description: 'Use modern automation, data prompts, and smart tools to work faster.',
    icon: '🤖'
  },
  {
    title: 'Portfolio-grade projects',
    description: 'Build a real analytics portfolio that hiring managers can review.',
    icon: '💼'
  }
];

export const aiTools: AITool[] = [
  {
    name: 'ChatGPT',
    description: 'Generate SQL, summarize data, and build analysis prompts.',
    icon: '💬'
  },
  {
    name: 'Looker Studio',
    description: 'Turn insights into dashboards with intuitive analytics reporting.',
    icon: '📈'
  },
  {
    name: 'GitHub Copilot',
    description: 'Auto-complete Python, SQL, and modeling logic inside VS Code.',
    icon: '🤝'
  },
  {
    name: 'Tableau',
    description: 'Create visual stories and communicate analytics to stakeholders.',
    icon: '🎨'
  }
];

export const roadmap: RoadmapStep[] = [
  {
    step: '01',
    title: 'Foundation',
    description: 'Analytics fundamentals, tools, and career clarity.'
  },
  {
    step: '02',
    title: 'Applied learning',
    description: 'Guided projects, dashboard builds, and realistic datasets.'
  },
  {
    step: '03',
    title: 'Career launch',
    description: 'Interview prep, portfolio polish, and role-ready positioning.'
  }
];

export const projects: ProjectShowcase[] = [
  {
    title: 'Customer churn analysis',
    highlight: 'Find drivers and recommend retention actions.'
  },
  {
    title: 'Sales performance dashboard',
    highlight: 'Build interactive visual insights for stakeholders.'
  },
  {
    title: 'AI forecasting prototype',
    highlight: 'Use predictive models to anticipate demand.'
  }
];

export const features: PlatformFeature[] = [
  {
    title: 'Structured learning path',
    description: 'Clear weekly lessons and milestones built for busy learners.',
    icon: '🧭'
  },
  {
    title: 'Project-based outcomes',
    description: 'Real deliverables you can show on your resume.',
    icon: '📁'
  },
  {
    title: 'AI-enhanced tools',
    description: 'Practical workflows with the latest analytics AI stack.',
    icon: '⚡'
  },
  {
    title: 'Career coaching support',
    description: 'Resume guidance, interview frameworks, and job search tips.',
    icon: '🎯'
  }
];

export const testimonials: Testimonial[] = [
  {
    quote: 'The AI-first curriculum helped me build complex Next.js applications and deploy them with confidence.',
    name: 'Ava Chen',
    role: 'Fullstack Developer'
  },
  {
    quote: 'I mastered programmatic ad campaigns and built a marketing portfolio that landed me my dream role.',
    name: 'Marcus Lee',
    role: 'Digital Marketing Strategist'
  },
  {
    quote: 'The AI tool guidance for data science made my Python ML workflows modern and incredibly productive.',
    name: 'Nina Sharma',
    role: 'Data Scientist'
  }
];
