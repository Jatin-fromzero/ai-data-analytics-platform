import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Learning Hubs - AI Tech Educare OS',
  description: 'Explore comprehensive AI-powered learning paths and technical tool hubs. Master SQL, Python, Power BI, and GenAI workflows.',
};

export default function LearningLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}
