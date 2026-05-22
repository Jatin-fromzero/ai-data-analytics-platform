'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export type Role = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo Credentials Database
const DEMO_USERS: Record<string, User> = {
  'admin@analytics.com': {
    id: 'adm-001',
    name: 'Jatin (CEO)',
    email: 'admin@analytics.com',
    role: 'admin',
    avatar: 'https://ui-avatars.com/api/?name=Jatin&background=FF6B35&color=fff',
  },
  'student@analytics.com': {
    id: 'usr-001',
    name: 'Alex Student',
    email: 'student@analytics.com',
    role: 'user',
    avatar: 'https://ui-avatars.com/api/?name=Alex+Student&background=0f172a&color=fff',
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Load session on mount
  useEffect(() => {
    const savedSession = sessionStorage.getItem('auth_session');
    if (savedSession) {
      try {
        setUser(JSON.parse(savedSession));
      } catch (e) {
        console.error('Failed to parse session');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password?: string) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const foundUser = DEMO_USERS[email];
    if (foundUser) {
      setUser(foundUser);
      sessionStorage.setItem('auth_session', JSON.stringify(foundUser));
      
      // Route based on role
      if (foundUser.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('auth_session');
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
