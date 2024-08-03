import React, { createContext, useState, useEffect } from 'react';

// Create context object
export const AuthContext = createContext();

// Create a provider for components to consume and subscribe to changes
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Retrieve the initial authentication state from localStorage
    const storedAuthState = localStorage.getItem('isAuthenticated');
    return storedAuthState === 'true'; // Convert to boolean
  });

  useEffect(() => {
    // Store the authentication state in localStorage whenever it changes
    localStorage.setItem('isAuthenticated', isAuthenticated);
  }, [isAuthenticated]);

  const login = () => {
    // Logic to authenticate user
    setIsAuthenticated(true);
  };

  const logout = () => {
    // Logic to log out user
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
 