import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <p className="text-sm uppercase tracking-[0.2em] text-brand">Dashboard placeholder</p>
        <h1 className="text-4xl font-bold tracking-tight text-white">Analytics workspace coming soon.</h1>
        <p className="max-w-2xl text-slate-400">
          This route is intentionally reserved for future authenticated dashboards, user progress tracking, and analytics insights.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {['Progress', 'Recommendations', 'Insights'].map((metric) => (
          <Card key={metric} className="space-y-3">
            <p className="text-sm uppercase tracking-[0.2em] text-brand">{metric}</p>
            <h2 className="text-2xl font-semibold text-white">Placeholder</h2>
            <p className="text-sm text-slate-400">Future dashboard widget for {metric.toLowerCase()}.</p>
          </Card>
        ))}
      </div>

      <Button variant="secondary" size="lg">Launch auth flow</Button>
    </div>
  );
}
