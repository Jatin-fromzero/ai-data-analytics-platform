'use client';

import type { ReactNode } from 'react';
import { ThemeProvider } from '@/components/ui/theme-provider';

export function Providers({ children }: { children: ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
