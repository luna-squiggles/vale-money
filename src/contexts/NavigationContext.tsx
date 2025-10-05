import React, { createContext, useState, useContext, ReactNode } from 'react';

interface NavigationContextType {
  isNavigating: boolean;
  setIsNavigating: (isNavigating: boolean) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isNavigating, setIsNavigating] = useState(false);

  return (
    <NavigationContext.Provider value={{ isNavigating, setIsNavigating }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigationContext = (): NavigationContextType => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigationContext must be used within a NavigationProvider');
  }
  return context;
}; 