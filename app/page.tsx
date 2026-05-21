import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mainNav } from '@/config/site';

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="space-y-6">
          <p className="inline-flex rounded-full border border-brand/20 bg-brand/10 px-4 py-2 text-sm font-semibold text-brand">
            AI-powered Career Platform
          </p>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Build your data analytics career with a modern AI-first platform.
          </h1>
          <p className="max-w-2xl text-slate-400 sm:text-lg">
            A scalable foundation for course delivery, career coaching, analytics dashboards, and future commerce integrations.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg">Start exploring</Button>
            <Button variant="secondary" size="lg" asChild>
              <Link href="/career">Career path</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { title: 'Course catalog', description: 'Modular course pages with reusable content blocks.' },
            { title: 'Career toolkit', description: 'Future-ready resume, interview, and portfolio scaffold.' },
            { title: 'AI workflows', description: 'Content structure for analytics + AI integrations.' },
            { title: 'Dashboard foundation', description: 'Placeholder route for authenticated insights.' }
          ].map((card) => (
            <Card key={card.title} className="space-y-3">
              <Badge>{card.title}</Badge>
              <p className="text-sm text-slate-300">{card.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {mainNav.map((item) => (
          <Card key={item.href} className="rounded-3xl p-6">
            <h2 className="text-xl font-semibold text-white">{item.title}</h2>
            <p className="mt-2 text-sm text-slate-400">Placeholder route for the {item.title.toLowerCase()} experience.</p>
            <Button asChild className="mt-6">
              <Link href={item.href}>Open {item.title}</Link>
            </Button>
          </Card>
        ))}
      </section>
    </div>
  );
}
