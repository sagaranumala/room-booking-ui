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
  login: async () => { throw new Error("login not implemented"); },
  register: async () => { throw new Error("register not implemented"); },
  logout: () => {},
  isAdmin: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  // Load user from sessionStorage on mount
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const login = async (email: string, password: string) => {
  setLoading(true);
  try {
    const res = await api.post("/auth/login", { email, password }, { withCredentials: true });

    if (res.status === 200 && res.data.success) {
      const loggedUser = res.data.data.user as User;
      setUser(loggedUser);
      sessionStorage.setItem("user", JSON.stringify(loggedUser));
      if (res.data.data.token) sessionStorage.setItem("token", res.data.data.token);
      return loggedUser; // ✅ return user
    } else {
      throw new Error(res.data?.message || "Login failed");
    }
  } catch (err: any) {
    setUser(null);
    throw new Error(err.response?.data?.message || "Login failed. Check credentials.");
  } finally {
    setLoading(false);
  }
};


  const register = async (name: string, email: string, password: string, phone?: string) => {
  setLoading(true);
  try {
    const res = await api.post(
      "/auth/register",
      { name, email, password, phone },
      { withCredentials: true }
    );

    if (res.status === 201 && res.data.success) {
      const registeredUser = res.data.data as User; // same style as login

      setUser(registeredUser);
      sessionStorage.setItem("user", JSON.stringify(registeredUser));

      // if token is returned, store it
      if (res.data.data.token) {
        sessionStorage.setItem("token", res.data.data.token);
      }

      return registeredUser;
    } else {
      throw new Error(res.data?.message || "Registration failed");
    }
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Registration failed");
  } finally {
    setLoading(false);
  }
};

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    router.push("/auth/login");
  };

  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
