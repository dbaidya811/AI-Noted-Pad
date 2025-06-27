
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  signup: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  apiKey: string;
  setApiKey: (key: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [apiKey, setApiKeyState] = useState('');

  useEffect(() => {
    const savedUser = document.cookie
      .split('; ')
      .find(row => row.startsWith('user='))
      ?.split('=')[1];
    
    const savedApiKey = document.cookie
      .split('; ')
      .find(row => row.startsWith('openaiKey='))
      ?.split('=')[1];
    
    if (savedUser) {
      try {
        setUser(JSON.parse(decodeURIComponent(savedUser)));
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
    
    if (savedApiKey) {
      setApiKeyState(decodeURIComponent(savedApiKey));
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simulate login - in real app, this would call an API
    const userData = {
      id: Math.random().toString(36).substr(2, 9),
      username,
      email: `${username}@example.com`
    };
    
    setUser(userData);
    document.cookie = `user=${encodeURIComponent(JSON.stringify(userData))}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
    document.cookie = `authToken=${Math.random().toString(36)}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
    
    return true;
  };

  const signup = async (username: string, email: string, password: string): Promise<boolean> => {
    // Simulate signup - in real app, this would call an API
    const userData = {
      id: Math.random().toString(36).substr(2, 9),
      username,
      email
    };
    
    setUser(userData);
    document.cookie = `user=${encodeURIComponent(JSON.stringify(userData))}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
    document.cookie = `authToken=${Math.random().toString(36)}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
    
    return true;
  };

  const logout = () => {
    setUser(null);
    document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
  };

  const setApiKey = (key: string) => {
    setApiKeyState(key);
    document.cookie = `openaiKey=${encodeURIComponent(key)}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, apiKey, setApiKey }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
