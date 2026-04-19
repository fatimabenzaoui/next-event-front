import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { fetchMe, logout as apiLogout, type UserProfile } from '../api';

interface AuthContextType {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  loading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMe().then((profile) => {
      setUser(profile);
      setLoading(false);
    });
  }, []);

  function logout() {
    apiLogout();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
