import React from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AdminNav } from './AdminNav';
import { AdminHeader } from './AdminHeader';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="flex min-h-screen bg-background text-slate-200">
        {/* Sidebar */}
        <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r border-border/60 bg-background lg:flex">
          <div className="flex h-16 shrink-0 items-center gap-3 border-b border-border/60 px-6">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-xs font-bold text-foreground shadow-glow">
              CEO
            </span>
            <span className="font-semibold text-foreground tracking-tight">Analytics Admin</span>
          </div>
          <div className="flex-1 overflow-y-auto py-6">
            <AdminNav />
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col lg:pl-64">
          <AdminHeader />
          <main className="flex-1 p-6 md:p-8">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
