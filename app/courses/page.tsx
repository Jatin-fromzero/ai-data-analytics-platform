import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CourseCard } from '@/types';

const sampleCourses: CourseCard[] = [
  {
    id: 'p1-excel-ai',
    title: 'Phase 1: Excel & AI Fundamentals',
    description: 'Foundational analytics workflows, spreadsheet automation, and Copilot-enabled dashboards.',
    category: 'Foundations',
    slug: 'phase-1-excel-ai',
    timeline: 'Weeks 1–3'
  },
  {
    id: 'p2-sql-cloud',
    title: 'Phase 2: SQL, BigQuery & Business Analytics',
    description: 'Cloud data modeling, query patterns, and analytics reporting with AI-assisted SQL.',
    category: 'Data Engineering',
    slug: 'phase-2-sql-cloud',
    timeline: 'Weeks 4–6'
  }
];

export default function CoursesPage() {
  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <p className="text-sm uppercase tracking-[0.2em] text-brand">Course catalog</p>
        <h1 className="text-4xl font-bold tracking-tight text-white">Structured modules for analytics and AI careers.</h1>
        <p className="max-w-2xl text-slate-400">
          The course layer should be built with reusable content blocks, modular lessons, and a clear phase-based curriculum.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {sampleCourses.map((course) => (
          <Card key={course.id} className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-300">{course.category}</p>
                <h2 className="text-2xl font-semibold text-white">{course.title}</h2>
              </div>
              <Badge variant="secondary">{course.timeline}</Badge>
            </div>
            <p className="text-slate-400">{course.description}</p>
            <Button asChild>
              <Link href={`/courses/${course.slug}`}>View details</Link>
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
