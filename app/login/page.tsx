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

  return (
    <div className="relative min-h-screen bg-[#07070E] flex flex-col items-center justify-center px-4 py-16 overflow-hidden">
      {/* Background radial glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand/5 blur-[120px] rounded-full pointer-events-none" />
      
      {/* Back to Home Button */}
      <Link href="/" className="absolute top-8 left-8 text-xs text-muted hover:text-foreground transition-colors flex items-center gap-1.5 font-medium">
        ← Back to home
      </Link>

      <AuthCard
        title="Welcome back"
        subtitle="Sign in to your learning workspace"
        footerText="Don't have an account?"
        footerLinkText="Sign up for free"
        footerLinkHref="/signup"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3.5 text-sm text-red-400">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted" htmlFor="email">
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
              <label className="text-xs font-medium text-muted" htmlFor="password">
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

          <Button type="submit" className="w-full shadow-lg shadow-brand/20 h-11" disabled={isSubmitting || isAuthLoading}>
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/[0.06]" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
            <span className="bg-[#0E0E11] px-3 text-muted">Or continue with</span>
          </div>
        </div>

        <GoogleSignInButton isLoading={isAuthLoading || isSubmitting} />
      </AuthCard>
    </div>
  );
}
