"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { axiosClient } from "@/lib/axiosClient";

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

interface SignupData {
  email: string;
  password: string;
  name?: string;
  company?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load token from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");
    const storedUser = localStorage.getItem("auth_user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setIsLoading(false);
  }, []);

  // Save token and user to localStorage whenever they change
  useEffect(() => {
    if (token && user) {
      localStorage.setItem("auth_token", token);
      localStorage.setItem("auth_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
    }
  }, [token, user]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockToken = "mock_jwt_token_" + Date.now();
      const mockUser: User = {
        id: "user_" + Date.now(),
        email: email,
        name: email.split("@")[0],
      };

      setToken(mockToken);
      setUser(mockUser);
    } catch (error) {
      throw new Error("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data: SignupData) => {
    setIsLoading(true);
    try {
      // call Next.js API route at /api/auth/signup
      const payload = {
        email: data.email,
        password: data.password,
        company_name: data.company ?? undefined,
      };

      const response = await axiosClient.post("/auth/signup", payload);

      // API returns { message, user }
      const returnedUser = response?.data?.user;
      const userObj: User = returnedUser
        ? {
            id: returnedUser.id,
            email: returnedUser.email,
            name:
              returnedUser.user_metadata?.full_name ||
              returnedUser.email.split("@")[0],
          }
        : {
            id: "user_" + Date.now(),
            email: data.email,
            name: data.name || data.email.split("@")[0],
          };

      // The route doesn't return a token; use a placeholder token for client auth state.
      const tokenFromServer = response?.data?.token ?? `supabase_${Date.now()}`;

      setToken(tokenFromServer);
      setUser(userObj);
    } catch (error) {
      console.error("Signup error:", error);
      // bubble a readable message to caller
      throw new Error((error as any)?.response?.data?.error || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    signup,
    logout,
    isAuthenticated: !!token && !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
