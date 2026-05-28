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
    <div className={cn('w-full max-w-md mx-auto relative z-10', className)}>
      {/* Logo mark */}
      <div className="mb-10 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-3 text-sm font-semibold tracking-tight text-foreground group"
        >
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-[1.25rem] bg-brand text-foreground shadow-[0_0_20px_rgba(255,107,53,0.3)] shrink-0 transition-transform group-hover:scale-105">
            AI
          </span>
          <span className="text-lg font-bold tracking-tight">Educare OS</span>
        </Link>
      </div>

      {/* Card */}
      <div className="rounded-[2.5rem] border border-white/[0.06] bg-[#0E0E11]/85 p-10 sm:p-12 shadow-[0_32px_96px_rgba(0,0,0,0.8)] backdrop-blur-3xl relative overflow-hidden">
        {/* Subtle top edge orange glow */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent" />
        
        {/* Header */}
        <div className="mb-10 space-y-2 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground leading-tight">{title}</h1>
          <p className="text-sm text-muted font-light leading-relaxed">{subtitle}</p>
        </div>

        {children}
      </div>

      {/* Footer link */}
      {footerText && footerLinkHref && footerLinkText && (
        <p className="mt-8 text-center text-sm text-muted font-light">
          {footerText}{' '}
          <Link
            href={footerLinkHref}
            className="font-semibold text-brand transition-colors hover:text-brand/80"
          >
            {footerLinkText}
          </Link>
        </p>
      )}
    </div>
  );
}
