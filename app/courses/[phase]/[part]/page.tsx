'use client';

import React from 'react';
import { notFound, useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { PageReveal } from '@/components/ui/motion';

// Loading Placeholder Component matching the premium dark AI theme
function LessonLoading() {
  return (
    <div className="min-h-screen bg-[#07070E] flex flex-col items-center justify-center p-6">
      <div className="space-y-4 text-center max-w-sm">
        <div className="w-12 h-12 border-2 border-brand border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-mono text-muted tracking-widest animate-pulse uppercase">
          Loading Educational Assets...
        </p>
      </div>
    </div>
  );
}

// Statically traceable Next.js dynamic imports map for code splitting
const LESSON_MAP: Record<string, Record<string, React.ComponentType<any>>> = {
  'phase-1': {
    'part-1': dynamic(() => import('@/content/phase1/part1'), { loading: LessonLoading, ssr: false }),
    'part-2': dynamic(() => import('@/content/phase1/part2'), { loading: LessonLoading, ssr: false }),
    'part-3': dynamic(() => import('@/content/phase1/part3'), { loading: LessonLoading, ssr: false }),
    'part-4': dynamic(() => import('@/content/phase1/part4'), { loading: LessonLoading, ssr: false }),
  },
  'phase-2': {
    'part-1': dynamic(() => import('@/content/phase2/part1'), { loading: LessonLoading, ssr: false }),
    'part-2': dynamic(() => import('@/content/phase2/part2'), { loading: LessonLoading, ssr: false }),
    'part-3': dynamic(() => import('@/content/phase2/part3'), { loading: LessonLoading, ssr: false }),
    'part-4': dynamic(() => import('@/content/phase2/part4'), { loading: LessonLoading, ssr: false }),
  },
  'phase-3': {
    'part-1': dynamic(() => import('@/content/phase3/part1'), { loading: LessonLoading, ssr: false }),
    'part-2': dynamic(() => import('@/content/phase3/part2'), { loading: LessonLoading, ssr: false }),
    'part-3': dynamic(() => import('@/content/phase3/part3'), { loading: LessonLoading, ssr: false }),
    'part-4': dynamic(() => import('@/content/phase3/part4'), { loading: LessonLoading, ssr: false }),
  },
  'phase-4': {
    'part-1': dynamic(() => import('@/content/phase4/part1'), { loading: LessonLoading, ssr: false }),
    'part-2': dynamic(() => import('@/content/phase4/part2'), { loading: LessonLoading, ssr: false }),
    'part-3': dynamic(() => import('@/content/phase4/part3'), { loading: LessonLoading, ssr: false }),
  },
  'phase-5': {
    'part-1': dynamic(() => import('@/content/phase5/part1'), { loading: LessonLoading, ssr: false }),
    'part-2': dynamic(() => import('@/content/phase5/part2'), { loading: LessonLoading, ssr: false }),
  },
  'phase-6': {
    'part-1': dynamic(() => import('@/content/phase6/part1'), { loading: LessonLoading, ssr: false }),
  }
};

export default function CourseDetailPage() {
  const params = useParams();

  const phaseSlug = params?.phase as string;
  const partSlug = params?.part as string;

  const LessonComponent = LESSON_MAP[phaseSlug]?.[partSlug];

  if (!LessonComponent) {
    notFound();
  }

  return (
    <PageReveal>
      <div className="min-h-screen bg-[#07070E] text-slate-100">
        <LessonComponent />
      </div>
    </PageReveal>
  );
}
