import React from 'react';

export default function CareerGuideLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background pt-8 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}
