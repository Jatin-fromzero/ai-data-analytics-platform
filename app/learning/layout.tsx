import React from 'react';

export default function LearningLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      {/* We can add a breadcrumb or specific learning navigation here if needed */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {children}
      </div>
    </div>
  );
}
