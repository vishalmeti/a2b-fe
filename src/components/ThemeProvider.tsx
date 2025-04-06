import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { theme } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    // Apply the theme to the HTML element
    const root = window.document.documentElement;
    
    // Remove both classes first
    root.classList.remove('light', 'dark');
    
    // Add the current theme class
    root.classList.add(theme);
    
    // Update the color-scheme property for system UI elements
    root.style.colorScheme = theme;
  }, [theme]);

  return <>{children}</>;
}
