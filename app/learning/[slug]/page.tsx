import { getLearningHubBySlug, learningHubs } from '@/data/learning-paths';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// Generate static params for all known hubs so Next.js pre-builds them
export function generateStaticParams() {
  return learningHubs.map((hub) => ({
    slug: hub.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const hub = getLearningHubBySlug(resolvedParams.slug);
  if (!hub) return { title: 'Not Found' };
  
  return {
    title: `${hub.title} - AI AnalyticsHub`,
    description: hub.description,
  };
}

export default async function LearningHubPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const hub = getLearningHubBySlug(resolvedParams.slug);
  
  if (!hub) {
    notFound();
  }

  return (
    <div className="space-y-16 pb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* ── HERO SECTION ── */}
      <section className="relative overflow-hidden rounded-[2.5rem] border border-border bg-surface p-8 sm:p-12 lg:p-16 shadow-2xl group">
        <div className={`absolute inset-0 bg-gradient-to-br ${hub.color} opacity-[0.03] transition-opacity group-hover:opacity-[0.05]`} />
        
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-4 mb-6">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-background border border-border text-3xl shadow-glow">
              {hub.icon}
            </span>
            <div>
              <Badge variant="secondary" className="bg-background border-border text-brand font-medium">
                {hub.category}
              </Badge>
              <h1 className="text-3xl sm:text-5xl font-bold text-foreground mt-2 tracking-tight">
                {hub.title}
              </h1>
            </div>
          </div>
          
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mt-8">
            {hub.subtitle}
          </h2>
          <p className="text-lg text-muted mt-4 leading-relaxed max-w-2xl">
            {hub.description}
          </p>
          
          <div className="mt-8 flex flex-wrap gap-4">
            <Button size="lg" className="rounded-full shadow-glow">Start Learning Now</Button>
            <Button size="lg" variant="secondary" className="rounded-full">Save for Later</Button>
          </div>
        </div>
      </section>

      {/* ── TWO COLUMN LAYOUT ── */}
      <div className="grid lg:grid-cols-3 gap-12">
        
        {/* LEFT COLUMN: CURRICULUM */}
        <div className="lg:col-span-2 space-y-12">
          
          <section>
            <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <span className="text-brand">✦</span> Learning Outcomes
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {hub.outcomes.map((outcome, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-2xl border border-border bg-surface/50">
                  <div className="mt-0.5 h-5 w-5 rounded-full bg-brand/10 text-brand flex items-center justify-center shrink-0">
                    ✓
                  </div>
                  <span className="text-sm font-medium text-foreground">{outcome}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <span className="text-brand">✦</span> Curriculum Roadmap
            </h3>
            <div className="space-y-6 relative before:absolute before:inset-y-0 before:left-6 before:w-px before:bg-border">
              {hub.modules.map((mod, i) => (
                <div key={i} className="relative flex gap-6">
                  <div className="h-12 w-12 rounded-full bg-background border border-brand flex items-center justify-center shrink-0 z-10 text-brand font-bold shadow-glow">
                    {i + 1}
                  </div>
                  <Card className="flex-1 p-6 border-border bg-surface hover:border-brand/50 transition-colors">
                    <div className="flex flex-wrap justify-between items-start gap-4 mb-2">
                      <h4 className="text-lg font-bold text-foreground">{mod.title}</h4>
                      <Badge variant="outline" className="text-muted border-border">{mod.duration}</Badge>
                    </div>
                    <p className="text-sm text-muted mb-4">{mod.description}</p>
                    <div className="flex gap-2">
                      {mod.tools.map(tool => (
                        <Badge key={tool} variant="secondary" className="bg-background text-xs text-foreground font-mono border-border">
                          {tool}
                        </Badge>
                      ))}
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: SIDEBAR */}
        <div className="space-y-8">
          
          {/* Mini Projects */}
          <section>
            <h3 className="text-xl font-bold text-foreground mb-4">Hands-On Projects</h3>
            <div className="space-y-4">
              {hub.projects.map((project, i) => (
                <Card key={i} className="p-5 border-border bg-surface">
                  <Badge variant="outline" className={`mb-3 ${
                    project.difficulty === 'Beginner' ? 'border-emerald-500/50 text-emerald-500' :
                    project.difficulty === 'Intermediate' ? 'border-amber-500/50 text-amber-500' :
                    'border-red-500/50 text-red-500'
                  }`}>
                    {project.difficulty}
                  </Badge>
                  <h4 className="font-semibold text-foreground mb-1">{project.title}</h4>
                  <p className="text-sm text-muted">{project.description}</p>
                </Card>
              ))}
            </div>
          </section>

          {/* AI Mentor Widget */}
          <section>
            <Card className="p-6 border-brand/30 bg-brand/5 relative overflow-hidden">
              <div className="absolute -right-4 -top-4 text-6xl opacity-10">🤖</div>
              <h3 className="text-lg font-bold text-brand mb-4 flex items-center gap-2">
                AI Mentor Tips
              </h3>
              <ul className="space-y-4">
                {hub.aiTips.map((tip, i) => (
                  <li key={i} className="text-sm text-foreground flex items-start gap-3">
                    <span className="text-brand shrink-0">💡</span>
                    {tip}
                  </li>
                ))}
              </ul>
              <Button className="w-full mt-6 shadow-glow" variant="default">Chat with Mentor</Button>
            </Card>
          </section>

        </div>
      </div>
    </div>
  );
}
