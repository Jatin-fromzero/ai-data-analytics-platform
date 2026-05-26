'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';

export function DashboardHeader() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border/60 bg-background/80 px-4 sm:px-6 lg:px-8 backdrop-blur-md">
      <div className="flex items-center gap-6">
        <Link href="/dashboard" className="flex items-center gap-3 text-sm font-semibold tracking-tight text-foreground">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-xs text-foreground shadow-glow shrink-0">AI</span>
          <span className="hidden sm:inline-block">Student Portal</span>
        </Link>
        <nav className="hidden md:flex gap-4 text-sm font-medium">
          <Link href="/dashboard" className="text-foreground">My Path</Link>
          <Link href="/syllabus" className="text-muted hover:text-foreground">Full Syllabus</Link>
          <Link href="/projects" className="text-muted hover:text-foreground">Projects</Link>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-foreground">{user?.name}</p>
            <p className="text-xs text-brand font-medium">Data Analytics Student</p>
          </div>
          <div className="h-8 w-8 rounded-full bg-slate-800 overflow-hidden border border-border">
            {user?.avatar && <Image src={user.avatar} alt="Avatar" width={32} height={32} className="h-full w-full object-cover" />}
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
