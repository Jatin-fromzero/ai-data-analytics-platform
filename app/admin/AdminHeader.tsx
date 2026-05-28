'use client';

import React from 'react';
import Image from 'next/image';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

interface AdminHeaderProps {
  onMenuClick?: () => void;
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-white/5 bg-[#0A0A0A]/80 px-4 sm:px-6 backdrop-blur-xl">
      <div className="flex items-center gap-4 lg:hidden">
        <button 
          onClick={onMenuClick}
          className="p-2 -ml-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-brand/50"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        <span className="font-semibold text-white tracking-wide text-sm">Platform OS</span>
      </div>
      
      <div className="hidden lg:block">
        {/* Breadcrumb or Search could go here */}
      </div>

      <div className="flex items-center gap-4 ml-auto">
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-white">{user?.name || 'Admin User'}</p>
            <p className="text-[11px] text-brand font-medium tracking-wider uppercase">Administrator</p>
          </div>
          <div className="h-9 w-9 rounded-full bg-brand/20 overflow-hidden border border-brand/30 flex items-center justify-center text-brand font-bold text-sm">
            {user?.avatar ? (
              <Image src={user.avatar} alt="Avatar" width={36} height={36} className="h-full w-full object-cover" />
            ) : (
              (user?.name?.[0] || 'A')
            )}
          </div>
        </div>
        <div className="h-5 w-px bg-white/10" />
        <button 
          onClick={logout} 
          className="text-sm font-medium text-muted-foreground hover:text-white transition-colors"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
