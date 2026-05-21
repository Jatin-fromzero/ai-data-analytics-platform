import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '../styles/globals.css';
import { Providers } from './providers';
import { siteConfig } from '@/config/site';
import { Shell } from '@/components/layout/shell';

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url)
};

export const viewport = {
  width: 'device-width',
  initialScale: 1
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <Shell>{children}</Shell>
        </Providers>
      </body>
    </html>
  );
}
