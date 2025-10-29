import { useState, useEffect, useCallback } from "react";
import { authApi, User } from "@/api/auth";

interface UseAuthReturn {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AUTH_KEY = "admin_token";
const USER_KEY = "admin_user";

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem(AUTH_KEY);
    const savedUser = localStorage.getItem(USER_KEY);

    if (savedToken && savedUser) {
      setToken(savedToken);
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Error parsing user data", e);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (identifier: string, password: string) => {
    try {
      const response = await authApi.login({ identifier, password });

      setToken(response.jwt);
      setUser(response.user);
      localStorage.setItem(AUTH_KEY, response.jwt);
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));

      console.log(
        "✅ Login successful, token saved:",
        response.jwt.substring(0, 20) + "..."
      );
      console.log("✅ User:", response.user);
    } catch (error: any) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(USER_KEY);
    // Also remove the old admin_authenticated key for backwards compatibility
    localStorage.removeItem("admin_authenticated");
  };

  const checkAuth = useCallback(async () => {
    const savedToken = localStorage.getItem(AUTH_KEY);
    if (!savedToken) {
      setIsLoading(false);
      return;
    }

    try {
      const currentUser = await authApi.getMe(savedToken);
      // Check if still superadmin
      if (currentUser.role?.name !== "superadmin") {
        logout();
      } else {
        setUser(currentUser);
        localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      logout();
    } finally {
      setIsLoading(false);
    }
  }, []);

  const isAuthenticated = !!token && !!user;
  const isSuperAdmin = user?.role?.name === "superadmin";

  return {
    user,
    token,
    isLoading,
    isAuthenticated,
    isSuperAdmin,
    login,
    logout,
    checkAuth,
  };
}
