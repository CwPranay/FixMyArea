"use client";

import React, { createContext, useContext, useEffect, useState } from "react";


interface User {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role: "user" | "authority" | "admin";
  authorityDocs?: string[];
  authorityVerified: "pending" | "approved" | "rejected";
  createdAt?: string;
  updatedAt?: string;
}

interface AuthContextType {
  user: User | null;
  role: "user" | "authority" | "admin" | null;
  authorityVerified: "pending" | "approved" | "rejected" | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<"user" | "authority" | "admin" | null>(null);
  const [authorityVerified, setAuthorityVerified] = useState<
    "pending" | "approved" | "rejected" | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

const refreshUser = async () => {
  try {
    const res = await fetch("/api/auth/me", { 
      credentials: "include",
      headers: { 'Cache-Control': 'no-cache' }
    });
    
    // Handle 401 responses gracefully - they're normal when no user is logged in
    if (res.status === 401) {
      // 401 is expected when no user is authenticated - not an error condition
      setUser(null);
      setRole(null);
      setAuthorityVerified(null);
      setIsAuthenticated(false);
      return;
    }
    
    if (!res.ok) {
      // For other errors, still clear state but don't treat as abnormal
      setUser(null);
      setRole(null);
      setAuthorityVerified(null);
      setIsAuthenticated(false);
      return;
    }

    const data = await res.json();
    if (data.user) {
      setUser(data.user);
      setRole(data.user.role);
      setAuthorityVerified(data.user.authorityVerified);
      setIsAuthenticated(true);
    } else {
      setUser(null);
      setRole(null);
      setAuthorityVerified(null);
      setIsAuthenticated(false);
    }
  } catch (err) {
    // Network errors or other exceptions - silently handle without logging
    setUser(null);
    setRole(null);
      setAuthorityVerified(null);
      setIsAuthenticated(false);
  } finally {
    setLoading(false);
  }
};

 const login = async (email: string, password: string) => {
  setLoading(true);
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    if (res.status === 403) {
      // Handle pending authority users specifically
      const data = await res.json();
      throw new Error(data.error || "Account pending verification");
    }

    if (!res.ok) {
      throw new Error("Login failed");
    }

    const data = await res.json();

    if (data.user) {
      setUser(data.user);
      setRole(data.user.role);
      setAuthorityVerified(data.user.authorityVerified);
      setIsAuthenticated(true);
    }
  } catch (err: any) {
    // Rethrow the error so the login form can display it
    throw new Error(err.message || "Login failed");
  } finally {
    setLoading(false);
  }
};

  const logout = async () => {
  setLoading(true);
  try {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
  } catch (err) {
    // Even if the API call fails, ensure we clear client-side state
    console.error("Logout API call failed, but clearing client state anyway");
  } finally {
    // Always clear client state regardless of API success
    setUser(null);
    setRole(null);
    setAuthorityVerified(null);
    setIsAuthenticated(false);
    // Ensure token cookie is cleared on client side too
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setLoading(false);
  }
};

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, role, authorityVerified, isAuthenticated, loading, login, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
