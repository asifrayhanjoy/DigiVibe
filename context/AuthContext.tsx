"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { User } from "@/types";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (updatedUser: Partial<User>) => void;
  requireAuth: (onSuccess?: () => void, redirectPath?: string) => boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  login: () => {},
  logout: () => {},
  updateUser: () => {},
  requireAuth: () => false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("digivibe_user");
      const savedToken = localStorage.getItem("digivibe_token");
      if (savedUser && savedToken) {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
        document.cookie = `token=${savedToken}; path=/; max-age=604800; SameSite=Lax`;
        document.cookie = `digivibe_token=${savedToken}; path=/; max-age=604800; SameSite=Lax`;
      }
    } catch (e) {
      console.error("Failed to parse saved auth state", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback((userData: User, authToken: string) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("digivibe_user", JSON.stringify(userData));
    localStorage.setItem("digivibe_token", authToken);
    document.cookie = `token=${authToken}; path=/; max-age=604800; SameSite=Lax`;
    document.cookie = `digivibe_token=${authToken}; path=/; max-age=604800; SameSite=Lax`;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("digivibe_user");
    localStorage.removeItem("digivibe_token");
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "digivibe_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }, []);

  const updateUser = useCallback((updatedFields: Partial<User>) => {
    setUser((prev) => {
      const newUser = prev ? { ...prev, ...updatedFields } : (updatedFields as User);
      localStorage.setItem("digivibe_user", JSON.stringify(newUser));
      return newUser;
    });
  }, []);

  const requireAuth = useCallback((onSuccess?: () => void, redirectPath?: string): boolean => {
    const isLogged = !!user || !!localStorage.getItem("digivibe_token");

    if (!isLogged) {
      const currentLocale = pathname?.split("/")[1] || "en";
      const targetRedirect = redirectPath || pathname || `/${currentLocale}`;
      router.push(`/${currentLocale}/auth/login?redirect=${encodeURIComponent(targetRedirect)}`);
      return false;
    }

    if (onSuccess) {
      onSuccess();
    }
    return true;
  }, [user, pathname, router]);

  const value = useMemo(() => ({
    user,
    token,
    isAuthenticated: !!user || !!token,
    isLoading,
    login,
    logout,
    updateUser,
    requireAuth,
  }), [user, token, isLoading, login, logout, updateUser, requireAuth]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
