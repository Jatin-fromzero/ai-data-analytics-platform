'use client';

import React from 'react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';

export function AdminHeader() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-border/60 bg-background/80 px-6 backdrop-blur-md">
      <div className="flex items-center gap-4 lg:hidden">
        {/* Mobile menu trigger would go here */}
        <span className="font-semibold text-foreground tracking-tight">CEO Portal</span>
      </div>
      
      <div className="hidden lg:block">
        {/* Breadcrumb or Search could go here */}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-foreground">{user?.name}</p>
            <p className="text-xs text-brand font-medium">Administrator</p>
          </div>
          <div className="h-9 w-9 rounded-full bg-slate-800 overflow-hidden border border-border">
            {user?.avatar && <img src={user.avatar} alt="Avatar" className="h-full w-full object-cover" />}
          </div>
        </div>
        <div className="h-6 w-px bg-slate-800" />
        <Button variant="ghost" size="sm" onClick={logout} className="text-muted hover:text-foreground">
          Sign out
        </Button>
      </div>
    </header>
  );
}
