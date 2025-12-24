import React, { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react';
import { themeApi, ActiveThemeResponse } from '../services/themeApi';

interface ThemeContextType {
  theme: ActiveThemeResponse | null;
  loading: boolean;
  error: Error | null;
  refreshTheme: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<ActiveThemeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const themeRef = useRef<ActiveThemeResponse | null>(null);

  const applyTheme = (themeData: ActiveThemeResponse) => {
    // We strictly use themes for scrolling banner only now.
    // No global CSS variables or body classes are applied.
  };

  const fetchTheme = async () => {
    try {
      setLoading(true);
      setError(null);
      const themeData = await themeApi.getActiveTheme();
      setTheme(themeData);
      themeRef.current = themeData;
      applyTheme(themeData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      console.error('Failed to fetch theme:', err);
      // Apply default theme on error
      const defaultTheme: ActiveThemeResponse = {
        theme_key: 'default',
        theme: {
          name: 'Default',
          scrolling_message: '',
          scrolling_background_color: '#000000',
        },
        event: null,
      };
      setTheme(defaultTheme);
      themeRef.current = defaultTheme;
      applyTheme(defaultTheme);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTheme();

    // Refresh theme every 5 minutes
    const interval = setInterval(fetchTheme, 5 * 60 * 1000);

    // Listen for dark mode changes and reapply theme
    const observer = new MutationObserver(() => {
      if (themeRef.current) {
        applyTheme(themeRef.current);
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, []);

  // Update ref when theme changes
  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        loading,
        error,
        refreshTheme: fetchTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

