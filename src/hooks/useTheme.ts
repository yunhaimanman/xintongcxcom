import { useState, useEffect } from 'react';
import { getCurrentStyle, AppStyle } from '@/data/styles';

type Theme = 'light' | 'dark';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  
  const [style, setStyle] = useState<AppStyle>(() => {
    return getCurrentStyle();
  });

  // Apply theme mode (light/dark)
  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  // Load and apply selected style
  useEffect(() => {
    const loadStyle = () => {
      const currentStyle = getCurrentStyle();
      setStyle(currentStyle);
      
      // Apply root style variables
      if (currentStyle && currentStyle.variables) {
        Object.entries(currentStyle.variables).forEach(([key, value]) => {
          document.documentElement.style.setProperty(`--${key}`, value);
        });
      }
    };
    
    // Initial load
    loadStyle();
    
    // Listen for style changes
    const handleStyleChange = () => loadStyle();
    window.addEventListener('styleChanged', handleStyleChange);
    
    return () => {
      window.removeEventListener('styleChanged', handleStyleChange);
    };
    
    // Add style as dependency to ensure re-run when style changes
  }, [style]);

  
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return {
    theme,
    toggleTheme,  
    isDark: theme === 'dark',
    style,
    // Add helper method to apply style classes
    applyStyle: (baseClass: string, styleClass: string | undefined) => {
      return styleClass ? `${baseClass} ${styleClass}` : baseClass;
    }
  };
} 