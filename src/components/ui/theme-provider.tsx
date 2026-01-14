'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useAppStore } from '@/store';

type Theme = 'dark' | 'light' | 'system';

interface ThemeProviderContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'dark' | 'light';
}

const defaultContext: ThemeProviderContextType = {
  theme: 'dark',
  setTheme: () => {},
  resolvedTheme: 'dark',
};

const ThemeProviderContext = createContext<ThemeProviderContextType>(defaultContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { settings, updateSettings } = useAppStore();
  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = window.document.documentElement;

    const applyTheme = (theme: Theme) => {
      let resolved: 'dark' | 'light';

      if (theme === 'system') {
        resolved = window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
      } else {
        resolved = theme;
      }

      root.classList.remove('light', 'dark');
      root.classList.add(resolved);
      setResolvedTheme(resolved);
    };

    applyTheme(settings.theme);

    // Listen for system theme changes
    if (settings.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => applyTheme('system');
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, [settings.theme, mounted]);

  const setTheme = (theme: Theme) => {
    updateSettings({ theme });
  };

  const value: ThemeProviderContextType = {
    theme: settings.theme,
    setTheme,
    resolvedTheme,
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeProviderContext);
}
