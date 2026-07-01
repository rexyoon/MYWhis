import React, { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '@/api/auth';
import { authStorage } from '@/lib/authStorage';

type User = { email: string | null; nickname: string };

type AuthState = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, nickname: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authStorage.get().then((stored) => {
      if (stored) setUser({ email: stored.email, nickname: stored.nickname });
      setLoading(false);
    });
  }, []);

  async function signIn(email: string, password: string) {
    const res = await authApi.login({ email, password });
    await authStorage.set(res);
    setUser({ email: res.email, nickname: res.nickname });
  }

  async function signUp(email: string, password: string, nickname: string) {
    const res = await authApi.signup({ email, password, nickname });
    await authStorage.set(res);
    setUser({ email: res.email, nickname: res.nickname });
  }

  async function signOut() {
    await authStorage.clear();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
