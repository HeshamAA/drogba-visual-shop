import { useState, useEffect, useCallback } from "react";
import { authApi, type User } from "@/features/auth/api/auth";
import { loadJson, loadString, saveJson, saveString, removeItem } from "@/shared/utils/storage";

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

  // Initialize auth state from localStorage
  useEffect(() => {
    const savedToken = loadString(AUTH_KEY);
    const savedUser = loadJson<User | null>(USER_KEY, null);

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(savedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (identifier: string, password: string) => {
    try {
      // Input validation
      if (!identifier.trim() || !password) {
        throw new Error('Email/username and password are required');
      }

      const { jwt, user } = await authApi.login({ identifier, password });

      // Update state and storage
      setToken(jwt);
      setUser(user);

      saveString(AUTH_KEY, jwt);
      saveJson(USER_KEY, user);

      // Remove any old authentication data for cleanup
      removeItem("admin_authenticated");
      
      console.log("✅ Login successful, user:", user.email);
    } catch (error: any) {
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.status === 400) {
        errorMessage = 'Invalid email/username or password';
      } else if (error.status === 401) {
        errorMessage = 'Invalid credentials. Please check your email/username and password.';
      } else if (error.status === 429) {
        errorMessage = 'Too many login attempts. Please try again later.';
      } else if (error.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      console.error('Login error:', error);
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    removeItem(AUTH_KEY);
    removeItem(USER_KEY);
    // Also remove the old admin_authenticated key for backwards compatibility
    removeItem("admin_authenticated");
  };

  const checkAuth = useCallback(async () => {
    const savedToken = loadString(AUTH_KEY);
    if (!savedToken) {
      setIsLoading(false);
      return;
    }

    try {
      // Get current user
      const currentUser = await authApi.getMe(savedToken);
      
      // Check if user is still authorized
      if (!currentUser || currentUser.blocked) {
        throw new Error('User is blocked');
      }

      // Update state with fresh user data
      setUser(currentUser);
      setToken(savedToken);

      // Update stored user data
      saveJson(USER_KEY, currentUser);
    } catch (error) {
      console.error("Auth check failed:", error);
      // Clear invalid auth data
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
