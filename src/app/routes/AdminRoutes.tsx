import { Route } from "react-router-dom";
import AdminLogin from "@/features/admin/pages/Login";
import AdminDashboard from "@/features/admin/pages/Dashboard";
import AdminProducts from "@/features/admin/pages/Products";
import AdminOrders from "@/features/admin/pages/Orders";
import AdminCoupons from "@/features/admin/pages/Coupons";
import GuestRoute from "@/features/admin/components/GuestRoute";
import ProtectedRoute from "@/features/admin/components/ProtectedRoute";
import AdminLayout from "@/features/admin/components/AdminLayout";

export const AdminRoutes = () => (
  <>
    {/* صفحة الدخول (خاصة بالضيوف فقط) */}
    <Route
      path="/admin/login"
      element={
        <GuestRoute>
          <AdminLogin />
        </GuestRoute>
      }
    />

    {/* صفحات الأدمن كلها داخل Layout واحد */}
    <Route
      path="/admin"
      element={
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<AdminDashboard />} />
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="products" element={<AdminProducts />} />
      <Route path="orders" element={<AdminOrders />} />
      <Route path="coupons" element={<AdminCoupons />} />
    </Route>
  </>
);
