import { useState, useEffect, useCallback } from "react";
import { authApi, type User } from "@/features/auth/api/auth";
import {
  loadJson,
  loadString,
  saveJson,
  saveString,
  removeItem,
} from "@/shared/utils/storage";

export type { User };

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

  // Load saved session from localStorage
  useEffect(() => {
    const savedToken = loadString(AUTH_KEY);
    const savedUser = loadJson<User | null>(USER_KEY, null);

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(savedUser);
    }
    setIsLoading(false);
  }, []);

  // 🔹 Login function
  const login = async (identifier: string, password: string) => {
    try {
      if (!identifier.trim() || !password) {
        throw new Error("Email/username and password are required");
      }

      const { jwt } = await authApi.login({ identifier, password });
      const currentUser = await authApi.getMe(jwt);

      // Save data
      setToken(jwt);
      setUser(currentUser);
      saveString(AUTH_KEY, jwt);
      saveJson(USER_KEY, currentUser);

      // Cleanup old key if it exists
      removeItem("admin_authenticated");

      console.log("✅ Login successful:", currentUser.email);
    } catch (error: any) {
      let errorMessage = "Login failed. Please try again.";

      if (error.response?.status === 400) {
        errorMessage = "Invalid email/username or password.";
      } else if (error.response?.status === 401) {
        errorMessage = "Unauthorized. Please check your credentials.";
      } else if (error.response?.status === 429) {
        errorMessage = "Too many login attempts. Please try again later.";
      } else if (error.response?.status >= 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      console.error("Login error:", error);
      throw new Error(errorMessage);
    }
  };

  // 🔹 Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    removeItem(AUTH_KEY);
    removeItem(USER_KEY);
    removeItem("admin_authenticated");
  };

  // 🔹 Check auth status (used on app start)
  const checkAuth = useCallback(async () => {
    const savedToken = loadString(AUTH_KEY);
    if (!savedToken) {
      setIsLoading(false);
      return;
    }

    try {
      const currentUser = await authApi.getMe(savedToken);

      if (!currentUser || currentUser.blocked) {
        throw new Error("User is blocked or invalid");
      }

      setUser(currentUser);
      setToken(savedToken);
      saveJson(USER_KEY, currentUser);
    } catch (error: any) {
      if (error.response?.status === 401) {
        console.warn("Token expired or invalid");
      }
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
