import React from 'react';
import Link from 'next/link';
import { learningHubs } from '@/data/learning-paths';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const metadata = {
  title: 'Learning Hubs - AI AnalyticsHub',
  description: 'Explore our comprehensive, AI-powered data analytics learning paths and tool hubs.',
};

export default function LearningIndexPage() {
  const paths = learningHubs.filter(h => h.category === 'Path');
  const tools = learningHubs.filter(h => h.category === 'Tool');
  const concepts = learningHubs.filter(h => h.category === 'Concept');

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="text-center max-w-3xl mx-auto pt-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
          Learning Ecosystem
        </h1>
        <p className="text-lg text-muted mt-4">
          Structured roadmaps, deep-dive tool hubs, and AI-powered concepts. Choose your path to mastery.
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-bold text-foreground mb-6">Structured Paths</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paths.map(hub => <HubCard key={hub.slug} hub={hub} />)}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-foreground mb-6">Tool Masterclasses</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map(hub => <HubCard key={hub.slug} hub={hub} />)}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-foreground mb-6">AI & Concepts</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {concepts.map(hub => <HubCard key={hub.slug} hub={hub} />)}
        </div>
      </section>
    </div>
  );
}

function HubCard({ hub }: { hub: any }) {
  return (
    <Link href={`/learning/${hub.slug}`} className="block group h-full">
      <Card className="h-full p-6 border-border bg-surface transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:border-brand/50 relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${hub.color} opacity-0 group-hover:opacity-[0.03] transition-opacity`} />
        
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex justify-between items-start mb-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-background border border-border text-2xl shadow-sm">
              {hub.icon}
            </span>
            <Badge variant="secondary" className="bg-background border-border text-xs">
              {hub.modules.length} Modules
            </Badge>
          </div>
          
          <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-brand transition-colors">
            {hub.title}
          </h3>
          <p className="text-sm text-muted mb-6 flex-1">
            {hub.subtitle}
          </p>

          <div className="flex items-center text-sm font-medium text-brand mt-auto">
            Explore Hub <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
