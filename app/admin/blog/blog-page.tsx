'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/admin/PageHeader';
import { DataTable } from '@/components/admin/DataTable';
import { Search, Plus, MoreHorizontal, FileText, Globe, PenTool } from 'lucide-react';

type PostStatus = 'published' | 'draft';

interface BlogPost {
  id: string;
  title: string;
  author: string;
  status: PostStatus;
  views: number;
  publishedAt: string;
}

const mockPosts: BlogPost[] = [
  { id: '1', title: 'Why SQL is Still King in 2026', author: 'Alex Admin', status: 'published', views: 12450, publishedAt: '2 days ago' },
  { id: '2', title: 'Getting Started with Pandas Dataframes', author: 'Sarah Jenkins', status: 'published', views: 8230, publishedAt: '1 week ago' },
  { id: '3', title: 'How to build an AI Portfolio', author: 'Alex Admin', status: 'draft', views: 0, publishedAt: '-' },
];

export default function BlogCMSPage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const columns = [
    { 
      key: 'title', 
      header: 'Post Title',
      render: (post: BlogPost) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/5 border border-white/10">
            <FileText className="h-5 w-5 text-brand" />
          </div>
          <div>
            <p className="font-medium text-slate-200">{post.title}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">By {post.author}</p>
          </div>
        </div>
      )
    },
    { 
      key: 'status', 
      header: 'Status',
      render: (post: BlogPost) => (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider ${
          post.status === 'published' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
          'bg-amber-500/10 text-amber-400 border border-amber-500/20'
        }`}>
          {post.status}
        </span>
      )
    },
    { 
      key: 'views', 
      header: 'Views',
      render: (post: BlogPost) => (
        <span className="text-slate-300 font-medium">
          {post.views > 0 ? post.views.toLocaleString() : '-'}
        </span>
      )
    },
    { key: 'publishedAt', header: 'Published' },
    {
      key: 'actions',
      header: '',
      render: (post: BlogPost) => (
        <div className="flex items-center justify-end gap-2">
          {post.status === 'published' && (
             <button className="p-2 text-muted-foreground hover:text-white transition-colors rounded-lg hover:bg-white/5" title="View Live">
               <Globe className="h-4 w-4" />
             </button>
          )}
          <button className="p-2 text-muted-foreground hover:text-brand transition-colors rounded-lg hover:bg-white/5" title="Edit Post">
            <PenTool className="h-4 w-4" />
          </button>
          <button className="p-2 text-muted-foreground hover:text-white transition-colors rounded-lg hover:bg-white/5">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Content Management" 
        description="Draft, publish, and manage SEO-optimized blog posts and resources."
        actions={
          <button className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-brand/90 shadow-[0_0_15px_rgba(255,107,53,0.3)]">
            <Plus className="h-4 w-4" />
            New Post
          </button>
        }
      />
      
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#121214]/50 pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-muted-foreground focus:border-brand/50 focus:outline-none focus:ring-1 focus:ring-brand/50 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select className="bg-[#121214]/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:outline-none w-full sm:w-auto">
            <option>All Status</option>
            <option>Published</option>
            <option>Drafts</option>
          </select>
        </div>
      </div>

      <DataTable data={mockPosts} columns={columns} />
    </div>
  );
}
