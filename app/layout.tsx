import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import '../styles/globals.css';
import { Providers } from './providers';
import { siteConfig } from '@/config/site';
import { Shell } from '@/components/layout/shell';
import { GlobalAIMentor } from '@/components/GlobalAIMentor';

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} - Data Analytics Career Path`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  keywords: ['Data Analytics', 'SQL', 'Python', 'Tableau', 'AI Mentor', 'Data Engineering Course'],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: `${siteConfig.name} - Master Modern Data Analytics`,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: '/og-image.png', // Placeholder, we can add a real one later
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} Preview`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} - The Ultimate Analytics Path`,
    description: siteConfig.description,
    images: ['/og-image.png'],
    creator: '@aianalyticshub',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: '#020617', // slate-950
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1, // Prevents iOS input zoom
};

export default function RootLayout({ children }: { children: ReactNode }) {
  // JSON-LD Structured Data for Course SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: '16-Week Data Analytics Path',
    description: siteConfig.description,
    provider: {
      '@type': 'Organization',
      name: siteConfig.name,
      sameAs: siteConfig.url,
    },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
    },
    offers: {
      '@type': 'Offer',
      category: 'Paid',
    }
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Providers>
          <Shell>{children}</Shell>
          <GlobalAIMentor />
        </Providers>
      </body>
    </html>
  );
}
