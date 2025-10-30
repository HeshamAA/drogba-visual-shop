import { Route } from "react-router-dom";

import AdminLogin from "@/features/admin/pages/Login";
import AdminDashboard from "@/features/admin/pages/Dashboard";
import AdminProducts from "@/features/admin/pages/Products";
import AdminOrders from "@/features/admin/pages/Orders";
import AdminCoupons from "@/features/admin/pages/Coupons";

export const AdminRoutes = () => (
  <>
    <Route path="/admin/login" element={<AdminLogin />} />
    <Route path="/admin/dashboard" element={<AdminDashboard />} />
    <Route path="/admin/products" element={<AdminProducts />} />
    <Route path="/admin/orders" element={<AdminOrders />} />
    <Route path="/admin/coupons" element={<AdminCoupons />} />
  </>
);
