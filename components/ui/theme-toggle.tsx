'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { Button } from './button';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = theme === 'dark' ? 'dark' : 'light';

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={() => setTheme(currentTheme === 'dark' ? 'light' : 'dark')}
      className="h-10 w-10 rounded-full p-0"
      aria-label="Toggle theme"
    >
      {mounted ? <>{currentTheme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}</> : <Moon className="h-4 w-4" />}
    </Button>
  );
}
