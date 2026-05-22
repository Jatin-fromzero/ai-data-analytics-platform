import * as React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        'flex h-11 w-full rounded-2xl border border-border bg-background/80 px-4 py-2 text-sm text-slate-100 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20',
        className
      )}
      {...props}
    />
  );
}
