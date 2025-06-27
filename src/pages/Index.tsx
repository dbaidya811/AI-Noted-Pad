
import React, { useState, useEffect } from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import LoginScreen from '../components/auth/LoginScreen';
import NotesApp from '../components/NotesApp';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('authToken='));
    
    if (authToken) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          {isAuthenticated ? (
            <NotesApp onLogout={() => setIsAuthenticated(false)} />
          ) : (
            <LoginScreen onLogin={() => setIsAuthenticated(true)} />
          )}
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default Index;
