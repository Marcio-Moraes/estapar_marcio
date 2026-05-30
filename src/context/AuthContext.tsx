"use client";

import React, { createContext, useState, useEffect, ReactNode } from "react";
import { User } from "@/types";
import { authService } from "@/services/authService";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const activeUser = await authService.getCurrentUser();
        setUser(activeUser);

        // Redirect to login if user is not authenticated and is on panel routes
        if (!activeUser && pathname !== "/login") {
          router.replace("/login");
        } else if (activeUser && pathname === "/login") {
          router.replace("/");
        }
      } catch (error) {
        console.error("Erro ao verificar sessão do usuário:", error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [pathname, router]);

  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      const loggedUser = await authService.login(username, password);
      setUser(loggedUser);
      router.replace("/");
    } catch (error) {
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
      router.replace("/login");
    } catch (error) {
      console.error("Erro ao deslogar:", error);
    } finally {
      setLoading(false);
    }
  };

  const isPublicRoute = pathname === "/login";

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {loading ? (
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#F9FAFB] gap-3">
          <div className="w-8 h-8 border-4 border-[#7AD33E] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-bold text-gray-600">Verificando credenciais...</p>
        </div>
      ) : !user && !isPublicRoute ? (
        <div className="h-screen w-screen bg-[#F9FAFB]" />
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
