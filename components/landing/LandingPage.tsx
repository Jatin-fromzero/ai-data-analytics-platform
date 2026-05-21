import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SectionHeading } from './SectionHeading';

const trustStats = [
  { value: '4.9/5', label: 'Learner satisfaction' },
  { value: '92%', label: 'Career advancement' },
  { value: '120+', label: 'Hands-on projects' }
];

const outcomes = [
  { title: 'Job-ready analytics skills', description: 'SQL, dashboards, storytelling, and AI-driven insights for business decisions.', icon: '📊' },
  { title: 'AI-powered workflow habits', description: 'Use modern automation, data prompts, and smart tools to work faster.', icon: '🤖' },
  { title: 'Portfolio-grade projects', description: 'Build a real analytics portfolio that hiring managers can review.', icon: '💼' }
];

const aiTools = [
  { name: 'ChatGPT', description: 'Generate SQL, summarize data, and build analysis prompts.', icon: '💬' },
  { name: 'Looker Studio', description: 'Turn insights into dashboards with intuitive analytics reporting.', icon: '📈' },
  { name: 'GitHub Copilot', description: 'Auto-complete Python, SQL, and modeling logic inside VS Code.', icon: '🤝' },
  { name: 'Tableau', description: 'Create visual stories and communicate analytics to stakeholders.', icon: '🎨' }
];

const roadmap = [
  { step: '01', title: 'Foundation', description: 'Analytics fundamentals, tools, and career clarity.' },
  { step: '02', title: 'Applied learning', description: 'Guided projects, dashboard builds, and realistic datasets.' },
  { step: '03', title: 'Career launch', description: 'Interview prep, portfolio polish, and role-ready positioning.' }
];

const projects = [
  { title: 'Customer churn analysis', highlight: 'Find drivers and recommend retention actions.' },
  { title: 'Sales performance dashboard', highlight: 'Build interactive visual insights for stakeholders.' },
  { title: 'AI forecasting prototype', highlight: 'Use predictive models to anticipate demand.' }
];

const features = [
  { title: 'Structured learning path', description: 'Clear weekly lessons and milestones built for busy learners.' },
  { title: 'Project-based outcomes', description: 'Real deliverables you can show on your resume.' },
  { title: 'AI-enhanced tools', description: 'Practical workflows with the latest analytics AI stack.' },
  { title: 'Career coaching support', description: 'Resume guidance, interview frameworks, and job search tips.' }
];

const testimonials = [
  {
    quote: 'The curriculum helped me move from spreadsheets to data storytelling with confidence.',
    name: 'Ava Chen',
    role: 'Data Analyst'
  },
  {
    quote: 'I built a portfolio project in weeks and felt ready to apply for roles.',
    name: 'Marcus Lee',
    role: 'Analytics Associate'
  },
  {
    quote: 'The AI tool guidance made my workflow feel modern and highly productive.',
    name: 'Nina Sharma',
    role: 'Business Intelligence Specialist'
  }
];

export default function LandingPage() {
  return (
    <div className="space-y-24">
      <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/95 px-6 py-12 shadow-glow sm:px-10 sm:py-16 lg:px-12">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.95fr_0.8fr] lg:items-center">
          <div className="space-y-6">
            <Badge className="bg-brand/10 text-brand border-brand/20">AI-powered career platform</Badge>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Launch your data analytics career with AI-first training, portfolio projects, and hiring-ready outcomes.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
              Build skills that matter in today’s analytics teams — from SQL and visualization to AI workflows, real projects, and career-ready coaching.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button size="lg">Start exploring</Button>
              <Button variant="secondary" size="lg" asChild>
                <Link href="/career">See career path</Link>
              </Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {trustStats.map((item) => (
                <div key={item.label} className="rounded-3xl border border-slate-800/80 bg-white/5 px-5 py-4 text-slate-200">
                  <p className="text-2xl font-semibold text-white">{item.value}</p>
                  <p className="mt-1 text-sm text-slate-400">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-6">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 ring-1 ring-white/5">
              <p className="text-sm uppercase tracking-[0.3em] text-brand">Career-ready tracks</p>
              <h2 className="mt-4 text-2xl font-semibold text-white">Build projects that hiring managers notice.</h2>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                Learn outcome-oriented analytics with AI-enhanced workflows, polished dashboards, and real performance stories.
              </p>
              <div className="mt-8 space-y-4">
                <div className="rounded-3xl bg-slate-900/90 p-4 text-sm text-slate-200">Live analytics dashboard builds</div>
                <div className="rounded-3xl bg-slate-900/90 p-4 text-sm text-slate-200">Interview-ready storytelling frameworks</div>
                <div className="rounded-3xl bg-slate-900/90 p-4 text-sm text-slate-200">Portfolio pieces with business impact</div>
              </div>
            </div>
            <div className="hidden rounded-[2rem] border border-white/10 bg-brand/5 p-6 text-slate-100 ring-1 ring-brand/10 sm:block">
              <p className="text-sm uppercase tracking-[0.2em] text-brand">Fast, modern workflow</p>
              <h3 className="mt-4 text-2xl font-semibold">AI tools, data stories, and polished output in one path.</h3>
              <p className="mt-3 text-sm leading-6 text-slate-200">The platform blends analytics fundamentals with career-ready delivery and AI-powered efficiency.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <div className="mx-auto max-w-6xl px-6 sm:px-10">
          <SectionHeading
            badge="Trusted by learners"
            title="Real outcomes from a modern analytics experience"
            description="A clear path from beginner to job-ready, with practical projects, AI workflows, and hiring tools built into every step."
          />
        </div>
        <div className="mx-auto grid max-w-6xl gap-5 px-6 sm:px-10 sm:grid-cols-3">
          {outcomes.map((item) => (
            <Card key={item.title} className="space-y-4 rounded-[2rem] bg-slate-950/90 p-6">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-900 text-2xl">{item.icon}</div>
              <div>
                <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{item.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-slate-950/95 px-6 py-14 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            title="AI tools for every analytics workflow"
            description="Use the tools modern teams rely on to speed analysis, automate tasks, and produce polished results." 
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {aiTools.map((tool) => (
              <Card key={tool.name} className="space-y-4 rounded-[2rem] bg-slate-900/80 p-6">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-800 text-2xl">{tool.icon}</div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{tool.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{tool.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            badge="Learning roadmap"
            title="A clear path from first lesson to first hire"
            description="Each stage focuses on outcomes: skill foundation, hands-on projects, and career launch preparation."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {roadmap.map((step) => (
              <Card key={step.step} className="space-y-4 rounded-[2rem] p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand">{step.step}</div>
                <div>
                  <h3 className="text-xl font-semibold text-white">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{step.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950/95 px-6 py-14 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            badge="Real-world projects"
            title="Build portfolio-ready analytics work"
            description="Apply every skill with project-based learning that mirrors real business problems and hiring expectations."
          />
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {projects.map((project) => (
              <Card key={project.title} className="space-y-4 rounded-[2rem] p-6">
                <p className="text-sm uppercase tracking-[0.25em] text-brand">Project</p>
                <h3 className="text-xl font-semibold text-white">{project.title}</h3>
                <p className="text-sm leading-6 text-slate-400">{project.highlight}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            title="Job-ready platform features"
            description="Everything is designed to help you move from learning to hiring with focus, portfolio work, and modern analytics workflows."
          />
          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            {features.map((feature) => (
              <Card key={feature.title} className="rounded-[2rem] p-6">
                <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950/95 px-6 py-14 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            badge="Testimonials"
            title="Hear how learners are accelerating their analytics careers"
            description="These placeholders show the experience of learners who moved from study to confidence, projects, and interviews." 
          />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="space-y-5 rounded-[2rem] p-6">
                <p className="text-sm leading-7 text-slate-300">“{testimonial.quote}”</p>
                <div>
                  <p className="font-semibold text-white">{testimonial.name}</p>
                  <p className="text-sm text-slate-500">{testimonial.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-gradient-to-r from-brand/10 via-slate-950/80 to-slate-900/90 px-6 py-14 text-white sm:px-10">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-brand">Ready to launch your analytics career?</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">Start building skills, projects, and confidence today.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            Join the platform designed for modern analytics talent, with AI workflows and career momentum built in.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg">Explore the platform</Button>
            <Button variant="secondary" size="lg" asChild>
              <Link href="/courses">Browse courses</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
