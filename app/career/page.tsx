import React from 'react';
import Link from 'next/link';
import { careerGuides } from '@/data/career-guides';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Career & Portfolio Hub - AI AnalyticsHub',
  description: 'Actionable guides for building data analytics resumes, GitHub portfolios, and passing technical interviews.',
};

export default function CareerHubPage() {
  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* ── HEADER ── */}
      <div className="text-center max-w-3xl mx-auto pt-8">
        <Badge variant="secondary" className="bg-brand/10 text-brand border-brand/20 mb-4">
          Career Development
        </Badge>
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
          Get Hired in Analytics
        </h1>
        <p className="text-lg text-muted mt-4">
          Stop guessing what recruiters want. Follow our actionable, step-by-step guides to build a world-class portfolio and ace your technical interviews.
        </p>
      </div>

      {/* ── GUIDES GRID ── */}
      <section>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {careerGuides.map(guide => (
            <Link key={guide.slug} href={`/career/guide/${guide.slug}`} className="block group h-full">
              <Card className="h-full flex flex-col p-6 border-border bg-surface transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:border-brand/50 relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${guide.color}`} />
                
                <div className="flex justify-between items-start mb-6 pt-2">
                  <span className="text-4xl">{guide.icon}</span>
                  <Badge variant="outline" className="text-muted border-border">
                    {guide.readingTime}
                  </Badge>
                </div>
                
                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-brand transition-colors">
                  {guide.title}
                </h3>
                <p className="text-sm text-muted mb-6 flex-1">
                  {guide.description}
                </p>

                <div className="mt-auto border-t border-border pt-4">
                  <div className="flex items-center text-sm font-medium text-foreground group-hover:text-brand transition-colors">
                    Read Guide <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* ── CALL TO ACTION ── */}
      <section>
        <Card className="p-8 md:p-12 border-brand/20 bg-brand/5 text-center max-w-3xl mx-auto relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand/10 via-transparent to-transparent pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Need a personalized portfolio review?
            </h2>
            <p className="text-muted mb-8">
              Upgrade to the Pro tier to get 1-on-1 resume tear-downs and mock interviews with our elite AI Mentor.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="shadow-glow">Upgrade to Pro</Button>
              <Button size="lg" variant="secondary">View Pricing</Button>
            </div>
          </div>
        </Card>
      </section>

    </div>
  );
}
