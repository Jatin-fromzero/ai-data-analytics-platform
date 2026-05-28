'use client';

import type { ReactNode } from 'react';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { AuthProvider } from '@/lib/auth-context';
import { SessionProvider } from 'next-auth/react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <AuthProvider>{children}</AuthProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
