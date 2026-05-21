import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function CareerPage() {
  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <p className="text-sm uppercase tracking-[0.2em] text-brand">Career ecosystem</p>
        <h1 className="text-4xl font-bold tracking-tight text-white">Career support designed for analytics professionals.</h1>
        <p className="max-w-2xl text-slate-400">
          Build the future curriculum for career coaching, interview readiness, portfolio delivery, and employer-aligned outcomes.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {['Portfolio', 'Interview', 'Growth'].map((item) => (
          <Card key={item} className="space-y-4">
            <h2 className="text-xl font-semibold text-white">{item}</h2>
            <p className="text-slate-400">Placeholder section for {item.toLowerCase()} support and career services.</p>
          </Card>
        ))}
      </div>

      <Button size="lg">Prepare for launch</Button>
    </div>
  );
}
