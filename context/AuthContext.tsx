"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { User } from "@/types";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  requireAuth: (onSuccess?: () => void, redirectPath?: string) => boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  login: () => {},
  logout: () => {},
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

  const login = (userData: User, authToken: string) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("digivibe_user", JSON.stringify(userData));
    localStorage.setItem("digivibe_token", authToken);
    document.cookie = `token=${authToken}; path=/; max-age=604800; SameSite=Lax`;
    document.cookie = `digivibe_token=${authToken}; path=/; max-age=604800; SameSite=Lax`;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("digivibe_user");
    localStorage.removeItem("digivibe_token");
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "digivibe_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  };

  /**
   * Helper function to guard protected actions/routes.
   * Returns true if user is logged in.
   * If user is NOT logged in, redirects immediately to login page.
   */
  const requireAuth = (onSuccess?: () => void, redirectPath?: string): boolean => {
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
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user || !!token,
        isLoading,
        login,
        logout,
        requireAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
