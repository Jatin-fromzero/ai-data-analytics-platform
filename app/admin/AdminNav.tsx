'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Home, 
  BookOpen, 
  Users, 
  GraduationCap, 
  BrainCircuit, 
  MonitorPlay, 
  BarChart3, 
  FileText, 
  Settings, 
  Search, 
  Bell 
} from 'lucide-react';

const navGroups = [
  {
    label: 'Overview',
    items: [
      { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
      { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    ]
  },
  {
    label: 'Platform Content',
    items: [
      { name: 'Homepage Builder', href: '/admin/homepage', icon: Home },
      { name: 'Courses', href: '/admin/courses', icon: BookOpen },
      { name: 'Blog / CMS', href: '/admin/blog', icon: FileText },
    ]
  },
  {
    label: 'Student Management',
    items: [
      { name: 'Users & Roles', href: '/admin/users', icon: Users },
      { name: 'Enrollments', href: '/admin/enrollments', icon: GraduationCap },
      { name: 'Dashboards', href: '/admin/dashboards', icon: MonitorPlay },
    ]
  },
  {
    label: 'AI & System',
    items: [
      { name: 'AI Mentor', href: '/admin/ai-mentor', icon: BrainCircuit },
      { name: 'Notifications', href: '/admin/notifications', icon: Bell },
      { name: 'SEO Management', href: '/admin/seo', icon: Search },
      { name: 'Settings', href: '/admin/settings', icon: Settings },
    ]
  }
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-6 px-4 pb-8">
      {navGroups.map((group) => (
        <div key={group.label} className="flex flex-col gap-1.5">
          <h4 className="px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 mb-1">
            {group.label}
          </h4>
          {group.items.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin');
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-brand/10 text-brand shadow-sm'
                    : 'text-muted hover:bg-slate-800/40 hover:text-foreground'
                )}
              >
                <Icon 
                  className={cn(
                    "h-[18px] w-[18px] transition-colors duration-200",
                    isActive ? "text-brand" : "text-muted-foreground group-hover:text-foreground"
                  )} 
                  strokeWidth={2}
                />
                <span className="tracking-wide">{item.name}</span>
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
