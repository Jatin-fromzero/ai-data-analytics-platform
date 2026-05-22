import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface AuthCardProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  footerText?: string;
  footerLinkText?: string;
  footerLinkHref?: string;
  className?: string;
}

export function AuthCard({
  children,
  title,
  subtitle,
  footerText,
  footerLinkText,
  footerLinkHref,
  className,
}: AuthCardProps) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className={cn('w-full max-w-md', className)}>
        {/* Logo mark */}
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-3 text-sm font-semibold tracking-tight text-foreground"
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-brand text-foreground">
              AI
            </span>
            <span className="text-base">AnalyticsHub</span>
          </Link>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-border/80 bg-surface/60 p-8 shadow-2xl backdrop-blur-sm">
          {/* Header */}
          <div className="mb-8 space-y-1 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
            <p className="text-sm text-muted">{subtitle}</p>
          </div>

          {children}
        </div>

        {/* Footer link */}
        {footerText && footerLinkHref && footerLinkText && (
          <p className="mt-6 text-center text-sm text-muted">
            {footerText}{' '}
            <Link
              href={footerLinkHref}
              className="font-medium text-brand transition-colors hover:text-brand/80"
            >
              {footerLinkText}
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
