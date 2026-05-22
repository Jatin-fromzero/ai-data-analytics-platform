'use client';

import type { ReactNode } from 'react';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { AuthProvider } from '@/lib/auth-context';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  );
}
