import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('theme', JSON.stringify(isDark));
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const theme = useMemo(() => ({
    isDark,
    colors: isDark ? {
      primary: '#0f1111',
      secondary: '#131a22',
      accent: '#ff9900',
      accentSecondary: '#ffad33',
      text: '#ffffff',
      textSecondary: '#cccccc',
      border: '#3a4553',
      header: '#131a22',
      background: '#0f1111',
      card: '#1b2028',
      cardHover: '#232f3e',
      success: '#067d62',
      error: '#d13212',
      warning: '#f79400'
    } : {
      primary: '#ffffff',
      secondary: '#f3f3f3',
      accent: '#ff9900',
      accentSecondary: '#ffad33',
      text: '#0f1111',
      textSecondary: '#565959',
      border: '#d5d9d9',
      header: '#131a22',
      background: '#eaeded',
      card: '#ffffff',
      cardHover: '#f7f8f8',
      success: '#067d62',
      error: '#d13212',
      warning: '#f79400'
    },
    gradients: {
      primary: 'linear-gradient(180deg, #ff9900 0%, #ffad33 100%)',
      secondary: 'linear-gradient(180deg, #ffad33 0%, #ff9900 100%)',
      accent: 'linear-gradient(180deg, #ff9900 0%, #e47911 100%)',
      card: isDark 
        ? 'linear-gradient(145deg, #1b2028 0%, #131a22 100%)'
        : 'linear-gradient(145deg, #ffffff 0%, #f7f8f8 100%)'
    },
    shadows: {
      small: '0 2px 5px 0 rgba(213,217,217,.5)',
      medium: '0 4px 8px 0 rgba(213,217,217,.5)',
      large: '0 8px 16px 0 rgba(213,217,217,.5)',
      accent: '0 2px 5px 0 rgba(255,153,0,.3)'
    }
  }), [isDark]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};