'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthCard } from '@/components/auth/AuthCard';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/frontend/lib/api-client';
import { useAuth } from '@/lib/auth-context';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const getPasswordStrength = (pw: string) => {
    if (pw.length === 0) return null;
    if (pw.length < 6) return { label: 'Too short', color: 'bg-red-500', width: 'w-1/4' };
    if (pw.length < 8) return { label: 'Weak', color: 'bg-orange-500', width: 'w-2/4' };
    if (!/[A-Z]/.test(pw) || !/[0-9]/.test(pw)) return { label: 'Fair', color: 'bg-yellow-500', width: 'w-3/4' };
    return { label: 'Strong', color: 'bg-green-500', width: 'w-full' };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (!agreedToTerms) {
      setError('Please agree to the Terms of Service to continue.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await apiClient.post<any>('/api/auth/signup', { name, email, password });
      if (!res.success) {
        setError(res.error || 'Signup failed.');
        setIsLoading(false);
        return;
      }

      // If signup succeeded, log them in instantly and redirect
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Failed to create account.');
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#07070E] flex flex-col items-center justify-center px-4 py-16 overflow-hidden">
      {/* Background radial glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand/5 blur-[120px] rounded-full pointer-events-none" />
      
      {/* Back to Home Button */}
      <Link href="/" className="absolute top-8 left-8 text-xs text-muted hover:text-foreground transition-colors flex items-center gap-1.5 font-medium">
        ← Back to home
      </Link>

      <AuthCard
        title="Create your account"
        subtitle="Start your AI learning journey today — free"
        footerText="Already have an account?"
        footerLinkText="Sign in"
        footerLinkHref="/login"
      >
      {/* Google sign-up */}
      <GoogleSignInButton isLoading={isLoading} label="Sign up with Google" />

      {/* Divider */}
      <div className="my-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-slate-800" />
        <span className="text-xs text-slate-600">or sign up with email</span>
        <div className="h-px flex-1 bg-slate-800" />
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="name" className="text-xs font-medium text-muted">Full name</label>
          <Input
            id="name"
            type="text"
            placeholder="Jane Doe"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="email" className="text-xs font-medium text-muted">Email address</label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="password" className="text-xs font-medium text-muted">Password</label>
          <Input
            id="password"
            type="password"
            placeholder="At least 8 characters"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required
          />
          {/* Password strength indicator */}
          {strength && (
            <div className="space-y-1 pt-1">
              <div className="h-1 w-full overflow-hidden rounded-full bg-slate-800">
                <div className={`h-full rounded-full transition-all duration-300 ${strength.color} ${strength.width}`} />
              </div>
              <p className="text-xs text-muted">{strength.label}</p>
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="confirmPassword" className="text-xs font-medium text-muted">
            Confirm password
          </label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isLoading}
            required
          />
          {confirmPassword && password !== confirmPassword && (
            <p className="text-xs text-red-400">Passwords do not match</p>
          )}
          {confirmPassword && password === confirmPassword && confirmPassword.length > 0 && (
            <p className="text-xs text-green-400">Passwords match ✓</p>
          )}
        </div>

        {/* Terms checkbox */}
        <div className="flex items-start gap-2.5">
          <button
            type="button"
            role="checkbox"
            aria-checked={agreedToTerms}
            onClick={() => setAgreedToTerms(!agreedToTerms)}
            className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
              agreedToTerms
                ? 'border-brand bg-brand'
                : 'border-border bg-background hover:border-slate-600'
            }`}
          >
            {agreedToTerms && (
              <svg className="h-2.5 w-2.5 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
            <span className="text-xs leading-relaxed text-muted">
              I agree to the{' '}
              <Link href="/terms" className="text-brand underline underline-offset-2 hover:text-brand/80">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-brand underline underline-offset-2 hover:text-brand/80">
                Privacy Policy
              </Link>
            </span>
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Creating account...
            </span>
          ) : (
            'Create account'
          )}
        </Button>
      </form>
    </AuthCard>
    </div>
  );
}
