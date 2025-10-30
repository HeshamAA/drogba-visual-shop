import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

type Destination = "dashboard" | "products" | "orders" | "coupons" | string;

const ADMIN_ROUTES: Record<Exclude<Destination, string>, string> = {
  dashboard: "/admin/dashboard",
  products: "/admin/products",
  orders: "/admin/orders",
  coupons: "/admin/coupons",
};

const resolveRoute = (destination: Destination): string => {
  if (destination in ADMIN_ROUTES) {
    return ADMIN_ROUTES[destination as Exclude<Destination, string>];
  }
  if (destination.startsWith("/")) {
    return destination;
  }
  return `/admin/${destination}`;
};

export const useAdminNavigation = () => {
  const navigate = useNavigate();

  const goTo = useCallback(
    (destination: Destination = "dashboard") => {
      navigate(resolveRoute(destination), { replace: false });
    },
    [navigate],
  );

  const goBackToDashboard = useCallback(() => {
    goTo("dashboard");
  }, [goTo]);

  return {
    goTo,
    goBackToDashboard,
  };
};
