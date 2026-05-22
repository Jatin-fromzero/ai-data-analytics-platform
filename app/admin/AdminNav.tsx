'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Overview', href: '/admin', icon: '📊' },
  { name: 'User Management', href: '/admin/users', icon: '👥' },
  { name: 'Revenue Analytics', href: '/admin/revenue', icon: '💰' },
  { name: 'Course Content', href: '/admin/content', icon: '📚' },
  { name: 'API Integrations', href: '/admin/integrations', icon: '⚙️' },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 px-4">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
              isActive
                ? 'bg-brand/10 text-brand'
                : 'text-muted hover:bg-surface hover:text-foreground'
            )}
          >
            <span className="text-lg">{item.icon}</span>
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
