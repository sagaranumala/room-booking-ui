"use client";

import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/services/api";

interface User {
  _id: string;
  email: string;
  role?: "user" | "admin";
  name?: string;
  phone?: string;
  token?: string;
}

interface LoginResponse {
  success: boolean;
  data: {
    user: User;
    token?: string;
  };
  message?: string;
}

interface RegisterResponse {
  success: boolean;
  data: User & { token?: string };
  message?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<User>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  login: async () => {
    throw new Error("login not implemented");
  },
  register: async () => {
    throw new Error("register not implemented");
  },
  logout: () => {},
  isAdmin: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  // Load user from session storage
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // -----------------------------
  // LOGIN
  // -----------------------------
  const login = async (email: string, password: string): Promise<User> => {
    setLoading(true);
    try {
      const res = await api.post<LoginResponse>(
        "/auth/login",
        { email, password },
        { withCredentials: true }
      );

      if (res.status === 200 && res.data.success) {
        const loggedUser = res.data.data.user;

        setUser(loggedUser);
        sessionStorage.setItem("user", JSON.stringify(loggedUser));
        if (res.data.data.token) {
          sessionStorage.setItem("token", res.data.data.token);
        }

        return loggedUser;
      }

      throw new Error(res.data.message || "Login failed");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Login failed. Check credentials.";

      setUser(null);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // REGISTER
  // -----------------------------
  const register = async (
    name: string,
    email: string,
    password: string,
    phone?: string
  ): Promise<User> => {
    setLoading(true);

    try {
      const res = await api.post<RegisterResponse>(
        "/auth/register",
        { name, email, password, phone },
        { withCredentials: true }
      );

      if (res.status === 201 && res.data.success) {
        const registeredUser = res.data.data;

        setUser(registeredUser);
        sessionStorage.setItem("user", JSON.stringify(registeredUser));

        if (registeredUser.token) {
          sessionStorage.setItem("token", registeredUser.token);
        }

        return registeredUser;
      }

      throw new Error(res.data.message || "Registration failed");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Registration failed";
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // LOGOUT
  // -----------------------------
  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    router.push("/auth/login");
  };

  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
