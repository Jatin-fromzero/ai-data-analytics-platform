'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, Role } from '@/lib/auth-context';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace('/login');
      } else if (allowedRoles && user) {
        // Expand legacy 'user' and 'admin' strings for backward compatibility
        const expandedAllowedRoles = allowedRoles.flatMap(role => {
          if ((role as string) === 'user') return ['student', 'demo_user'] as Role[];
          if ((role as string) === 'admin') return ['admin', 'super_admin'] as Role[];
          return [role];
        });

        if (!expandedAllowedRoles.includes(user.role)) {
          const isAdmin = user.role === 'admin' || user.role === 'super_admin';
          router.replace(isAdmin ? '/admin' : '/dashboard');
        }
      }
    }
  }, [isLoading, isAuthenticated, user, router, allowedRoles]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
      </div>
    );
  }

  // Double check before rendering
  const expandedAllowedRoles = allowedRoles?.flatMap(role => {
    if ((role as string) === 'user') return ['student', 'demo_user'] as Role[];
    if ((role as string) === 'admin') return ['admin', 'super_admin'] as Role[];
    return [role];
  });

  if (!isAuthenticated || (expandedAllowedRoles && user && !expandedAllowedRoles.includes(user.role))) {
    return null;
  }

  return <>{children}</>;
}
