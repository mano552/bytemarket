import React, { createContext, useContext, useState, useEffect } from "react";
import type { PublicUser } from "../types";
import { apiRequest } from "../api/client";

interface AuthResult {
  user: PublicUser;
  token: string;
}

interface AuthContextValue {
  user: PublicUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<string | null>; // returns error message or null
  register: (name: string, email: string, password: string) => Promise<string | null>;
  loginWithGoogle: (idToken: string) => Promise<string | null>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Restore session from memory on mount (kept in React state only per artifact rules)
  useEffect(() => {
    // Intentionally left blank: in a real app you'd persist token in an httpOnly cookie
    // via the backend rather than client-side storage.
  }, []);

  async function login(email: string, password: string): Promise<string | null> {
    const res = await apiRequest<AuthResult>("/auth/login", {
      method: "POST",
      body: { email, password },
    });

    if (!res.success || !res.data) {
      return res.message ?? "Login failed";
    }

    setUser(res.data.user);
    setToken(res.data.token);
    return null;
  }

  async function register(name: string, email: string, password: string): Promise<string | null> {
    const res = await apiRequest<AuthResult>("/auth/register", {
      method: "POST",
      body: { name, email, password },
    });

    if (!res.success || !res.data) {
      return res.message ?? "Registration failed";
    }

    setUser(res.data.user);
    setToken(res.data.token);
    return null;
  }

  async function loginWithGoogle(idToken: string): Promise<string | null> {
    const res = await apiRequest<AuthResult>("/auth/google", {
      method: "POST",
      body: { idToken },
    });

    if (!res.success || !res.data) {
      return res.message ?? "Google sign-in failed";
    }

    setUser(res.data.user);
    setToken(res.data.token);
    return null;
  }

  function logout(): void {
    setUser(null);
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook with a runtime guard - throws a clear error if used outside the provider
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
