import { getCareerGuideBySlug, careerGuides } from '@/data/career-guides';
import { notFound } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function generateStaticParams() {
  return careerGuides.map((guide) => ({
    slug: guide.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const guide = getCareerGuideBySlug(resolvedParams.slug);
  if (!guide) return { title: 'Not Found' };
  
  return {
    title: `${guide.title} | Career Guide - AI AnalyticsHub`,
    description: guide.description,
  };
}

export default async function CareerGuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const guide = getCareerGuideBySlug(resolvedParams.slug);
  
  if (!guide) {
    notFound();
  }

  return (
    <article className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* ── HEADER ── */}
      <header className="text-center space-y-6 pb-8 border-b border-border">
        <div className="inline-flex items-center justify-center h-20 w-20 rounded-3xl bg-surface border border-border shadow-glow text-4xl mb-2">
          {guide.icon}
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight">
          {guide.title}
        </h1>
        <p className="text-lg text-muted max-w-2xl mx-auto leading-relaxed">
          {guide.description}
        </p>
        <div className="flex items-center justify-center gap-3 pt-4">
          <Badge variant="secondary" className="bg-surface text-muted border-border">Career Guide</Badge>
          <Badge variant="outline" className="text-muted border-border">⏱ {guide.readingTime}</Badge>
        </div>
      </header>

      {/* ── STEPS ── */}
      <section className="space-y-8">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <span className="text-brand">✦</span> Step-by-Step Breakdown
        </h2>
        
        <div className="space-y-6">
          {guide.steps.map((step, i) => (
            <Card key={i} className="p-6 md:p-8 border-border bg-surface relative overflow-hidden group">
              <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${guide.color}`} />
              <div className="flex gap-4 sm:gap-6 items-start">
                <div className="h-10 w-10 shrink-0 rounded-full bg-background border border-border flex items-center justify-center text-foreground font-bold shadow-sm">
                  {i + 1}
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-foreground">{step.title}</h3>
                  <p className="text-muted leading-relaxed">{step.content}</p>
                  
                  <div className="mt-4 p-4 rounded-xl bg-brand/5 border border-brand/20">
                    <p className="text-sm font-semibold text-brand mb-1">Action Item:</p>
                    <p className="text-sm text-foreground">{step.actionItem}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ── MISTAKES TO AVOID ── */}
      <section>
        <Card className="p-6 md:p-8 border-red-500/20 bg-red-500/5">
          <h2 className="text-xl font-bold text-red-500 mb-6 flex items-center gap-2">
            <span>⚠️</span> Critical Mistakes to Avoid
          </h2>
          <ul className="space-y-4">
            {guide.commonMistakes.map((mistake, i) => (
              <li key={i} className="flex gap-3 text-foreground items-start">
                <span className="text-red-500 shrink-0 mt-0.5">✖</span>
                {mistake}
              </li>
            ))}
          </ul>
        </Card>
      </section>

      {/* ── FOOTER CTA ── */}
      <section className="text-center pt-8">
        <Button size="lg" className="shadow-glow rounded-full px-8">Return to Career Hub</Button>
      </section>

    </article>
  );
}
