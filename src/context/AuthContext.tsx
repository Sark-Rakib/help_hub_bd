import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { SafeUser } from "@/types";

interface AuthContextValue {
  user: SafeUser | null;
  loading: boolean;
  login: (
    identifier: string,
    password: string
  ) => Promise<{ ok: boolean; error?: string; role?: "user" | "provider" | "admin" }>;
  register: (data: {
    name: string;
    phone: string;
    email?: string;
    password: string;
    role?: "user" | "provider";
  }) => Promise<{ ok: boolean; error?: string }>;
  updateProfile: (data: {
    name?: string;
    email?: string;
    avatar?: string;
    phone?: string;
  }) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setUser: (user: SafeUser | null) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<SafeUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      const json = await res.json();
      if (json.success && json.data?.user) {
        setUser(json.data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/me", { cache: "no-store" })
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return;
        if (json.success && json.data?.user) {
          setUser(json.data.user);
        } else {
          setUser(null);
        }
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (identifier: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });
      const json = await res.json();
      if (!res.ok) return { ok: false, error: json.error };
      setUser(json.data.user);
      return { ok: true, role: json.data.user?.role }; 
    } catch {
      return { ok: false, error: "Something went wrong. Please try again." };
    }
  }, []);

  const register = useCallback(
    async (data: {
      name: string;
      phone: string;
      email?: string;
      password: string;
      role?: "user" | "provider";
    }) => {
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const json = await res.json();
        if (!res.ok) return { ok: false, error: json.error };
        setUser(json.data.user);
        return { ok: true };
      } catch {
        return { ok: false, error: "Something went wrong. Please try again." };
      }
    },
    []
  );

  const updateProfile = useCallback(
    async (data: { name?: string; email?: string; avatar?: string; phone?: string }) => {
      try {
        const res = await fetch("/api/auth/me", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const json = await res.json();
        if (!res.ok) return { ok: false, error: json.error };
        setUser(json.data.user);
        return { ok: true };
      } catch {
        return { ok: false, error: "Something went wrong. Please try again." };
      }
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      setUser(null);
      queryClient.clear();
      // Hard reload is intentional — resets query cache & client state after session change.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.href = "/";
    }
  }, [queryClient]);

  const value = useMemo(
    () => ({ user, loading, login, register, updateProfile, logout, refreshUser, setUser }),
    [user, loading, login, register, updateProfile, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}