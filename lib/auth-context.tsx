'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';

export type Role = 'guest' | 'demo_user' | 'student' | 'admin' | 'super_admin' | 'user';

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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (session?.user) {
      const serverRole = (session.user as any).role || 'STUDENT';
      
      const roleMapping: Record<string, Role> = {
        GUEST: 'guest',
        DEMO: 'demo_user',
        STUDENT: 'student',
        ADMIN: 'admin',
        SUPER_ADMIN: 'super_admin',
      };
      
      const clientRole: Role = roleMapping[serverRole] || 'student';

      setUser({
        id: session.user.id || '',
        name: session.user.name || '',
        email: session.user.email || '',
        role: clientRole,
        avatar: session.user.image || `https://ui-avatars.com/api/?name=${session.user.name}&background=FF6B35&color=fff`,
      });
    } else {
      setUser(null);
    }
  }, [session]);

  const login = async (email: string, password?: string) => {
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      throw new Error(result.error || 'Invalid credentials');
    }

    // After login redirect based on role
    const updatedSession = await fetch('/api/auth/session').then(res => res.json());
    const role = updatedSession?.user?.role || 'STUDENT';
    
    if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
      router.push('/admin');
    } else {
      router.push('/dashboard');
    }
  };

  const logout = async () => {
    await signOut({ redirect: false });
    setUser(null);
    router.push('/');
  };

  const isLoading = status === 'loading';

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
