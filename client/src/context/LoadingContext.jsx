// client/src/context/LoadingContext.jsx
import React, { createContext, useContext, useState } from 'react';

const LoadingContext = createContext();

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  const showLoading = React.useCallback(() => setIsLoading(true), []);
  const hideLoading = React.useCallback(() => setIsLoading(false), []);

  const navigateWithLoading = React.useCallback((url, delay = 800) => {
    setIsLoading(true);
    setTimeout(() => {
      window.location.href = url;
    }, delay);
  }, []);

  const contextValue = React.useMemo(() => ({
    isLoading,
    showLoading,
    hideLoading,
    navigateWithLoading
  }), [isLoading, showLoading, hideLoading, navigateWithLoading]);

  return (
    <LoadingContext.Provider value={contextValue}>
      {children}
    </LoadingContext.Provider>
  );
};