import * as React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-3xl border border-border/70 bg-white/5 p-6 shadow-glow backdrop-blur-xl transition-colors',
        className
      )}
      {...props}
    />
  );
}
