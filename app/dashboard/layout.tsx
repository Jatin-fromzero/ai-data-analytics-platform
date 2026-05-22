import React from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardHeader } from './DashboardHeader';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['user']}>
      <div className="flex min-h-screen flex-col bg-background">
        <DashboardHeader />
        <main className="flex-1 container py-8">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
