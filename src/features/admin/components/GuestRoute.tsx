import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { loadString } from "@/shared/utils/storage";

interface GuestRouteProps {
  children: React.ReactNode;
}

export default function GuestRoute({ children }: GuestRouteProps) {
  const { isAuthenticated, isLoading, checkAuth ,user } = useAuth();
  const role = user?.role?.name;
  
  useEffect(() => {
    const storedToken = loadString("admin_token");
    if (storedToken) {
      void checkAuth();
    }
  }, [checkAuth]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري التحقق من الهوية...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated && role === "superadmin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
}
