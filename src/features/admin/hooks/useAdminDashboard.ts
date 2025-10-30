import { useMemo, useCallback } from "react";

import { useAdmin } from "@/features/admin/hooks/useAdmin";
import { useAuth } from "@/features/auth/hooks/useAuth";

export const useAdminDashboard = () => {
  const { products, orders, loading } = useAdmin();
  const { logout } = useAuth();

  const pendingOrders = useMemo(
    () => orders.filter((order) => order.status === "pending").length,
    [orders],
  );

  const totalRevenue = useMemo(
    () => orders.reduce((sum, order) => sum + (order.total_price ?? 0), 0),
    [orders],
  );

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  return {
    products,
    orders,
    loading,
    pendingOrders,
    totalRevenue,
    handleLogout,
  };
};
