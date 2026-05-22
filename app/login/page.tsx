'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AuthCard } from '@/components/auth/AuthCard';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading: isAuthLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login(email, password);
    } catch (err) {
      setError('Invalid email or password');
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async (demoEmail: string) => {
    setError('');
    setIsSubmitting(true);
    try {
      await login(demoEmail, 'demo123');
    } catch (err) {
      setError('Failed to login with demo account');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <AuthCard
        title="Welcome back"
        subtitle="Sign in to your analytics workspace"
        footerText="Don't have an account?"
        footerLinkText="Sign up for free"
        footerLinkHref="/signup"
      >
        <div className="mb-6 grid gap-3">
          <Button 
            variant="secondary" 
            onClick={() => handleDemoLogin('admin@analytics.com')}
            disabled={isSubmitting || isAuthLoading}
            className="border border-brand/30 bg-brand/5 hover:bg-brand/10 text-brand"
          >
            Demo: Login as CEO / Admin
          </Button>
          <Button 
            variant="secondary" 
            onClick={() => handleDemoLogin('student@analytics.com')}
            disabled={isSubmitting || isAuthLoading}
            className="border border-border bg-slate-800/50 hover:bg-slate-800"
          >
            Demo: Login as Student
          </Button>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-surface px-2 text-muted">Or continue with</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted" htmlFor="email">
              Email address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting || isAuthLoading}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-muted" htmlFor="password">
                Password
              </label>
              <Link href="/forgot-password" className="text-xs font-medium text-brand hover:underline">
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting || isAuthLoading}
            />
          </div>

          <Button type="submit" className="w-full shadow-lg shadow-brand/20" disabled={isSubmitting || isAuthLoading}>
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        <div className="mt-6">
          <GoogleSignInButton isLoading={isAuthLoading || isSubmitting} />
        </div>
      </AuthCard>
    </div>
  );
}
