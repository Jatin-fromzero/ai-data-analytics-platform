import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface SectionHeadingProps {
  badge?: string;
  title: string;
  description: string;
  className?: string;
}

export function SectionHeading({ badge, title, description, className }: SectionHeadingProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {badge ? (
        <Badge className="bg-brand/10 text-brand border-brand/20">{badge}</Badge>
      ) : null}
      <div className="space-y-3">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">{title}</h2>
        <p className="max-w-2xl text-base leading-7 text-muted sm:text-lg">{description}</p>
      </div>
    </div>
  );
}
