import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<User>;
  registerUser: (data: { name: string; email: string; phone?: string; password: string; role?: string }) => Promise<User>;
  logout: () => void;
  isAuthenticated: boolean;
  role: UserRole | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('smart_bus_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await api.getMe();
        if (response.success && response.data?.user) {
          const u = response.data.user;
          setUser({
            id: u._id || u.id,
            name: u.name,
            email: u.email,
            phone: u.phone,
            role: u.role,
          });
        } else {
          logout();
        }
      } catch (err) {
        console.warn('Stored token check failed:', err);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [token]);

  const login = async (email: string, pass: string): Promise<User> => {
    const response = await api.login({ email, password: pass });
    if (response.success && response.data?.token) {
      const newToken = response.data.token;
      const rawUser = response.data.user;
      const formattedUser: User = {
        id: rawUser.id || rawUser._id,
        name: rawUser.name,
        email: rawUser.email,
        phone: rawUser.phone,
        role: rawUser.role,
      };

      localStorage.setItem('smart_bus_token', newToken);
      setToken(newToken);
      setUser(formattedUser);
      return formattedUser;
    }
    throw new Error(response.message || 'Login failed.');
  };

  const registerUser = async (data: { name: string; email: string; phone?: string; password: string; role?: string }): Promise<User> => {
    const response = await api.register(data);
    if (response.success && response.data?.token) {
      const newToken = response.data.token;
      const rawUser = response.data.user;
      const formattedUser: User = {
        id: rawUser.id || rawUser._id,
        name: rawUser.name,
        email: rawUser.email,
        phone: rawUser.phone,
        role: rawUser.role,
      };

      localStorage.setItem('smart_bus_token', newToken);
      setToken(newToken);
      setUser(formattedUser);
      return formattedUser;
    }
    throw new Error(response.message || 'Registration failed.');
  };

  const logout = () => {
    localStorage.removeItem('smart_bus_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        registerUser,
        logout,
        isAuthenticated: !!user,
        role: user?.role || null,
      }}
    >
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
