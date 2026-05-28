import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
  className?: string;
}

export function StatCard({ title, value, icon: Icon, trend, subtitle, className }: StatCardProps) {
  return (
    <div className={cn(
      "relative overflow-hidden rounded-2xl border border-white/5 bg-[#121214]/50 p-6 backdrop-blur-sm transition-all hover:bg-[#121214]/80",
      className
    )}>
      {/* Subtle background glow */}
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-brand/10 blur-2xl pointer-events-none opacity-50" />
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/5">
          <Icon className="h-5 w-5 text-brand" strokeWidth={2} />
        </div>
      </div>
      
      <div className="relative z-10">
        <p className="text-3xl font-semibold text-white tracking-tight">{value}</p>
        
        {(trend || subtitle) && (
          <div className="mt-2 flex items-center gap-2 text-sm">
            {trend && (
              <span className={cn(
                "flex items-center font-medium",
                trend.isPositive ? "text-emerald-400" : "text-rose-400"
              )}>
                {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
              </span>
            )}
            {subtitle && (
              <span className="text-muted-foreground/70">{subtitle}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
