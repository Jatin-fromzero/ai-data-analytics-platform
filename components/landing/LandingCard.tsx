import * as React from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

interface LandingCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  eyebrow?: string;
  className?: string;
  children?: React.ReactNode;
}

export function LandingCard({ title, description, icon, eyebrow, className, children }: LandingCardProps) {
  return (
    <Card className={cn('space-y-5 rounded-[2rem] p-6', className)}>
      {eyebrow ? <p className="text-sm uppercase tracking-[0.25em] text-brand">{eyebrow}</p> : null}
      <div className="flex items-start gap-4">
        {icon ? (
          <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-surface text-2xl">
            {icon}
          </div>
        ) : null}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-foreground">{title}</h3>
          <p className="text-sm leading-6 text-muted">{description}</p>
        </div>
      </div>
      {children}
    </Card>
  );
}
