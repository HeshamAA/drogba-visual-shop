import { lazy, Suspense } from "react";
import { Route } from "react-router-dom";
import GuestRoute from "@/features/admin/components/GuestRoute";
import ProtectedRoute from "@/features/admin/components/ProtectedRoute";
import AdminLayout from "@/features/admin/components/AdminLayout";
import PageLoader from "@/shared/components/PageLoader";

// Lazy load admin pages
const AdminLogin = lazy(() => import("@/features/admin/pages/Login"));
const AdminDashboard = lazy(() => import("@/features/admin/pages/Dashboard"));
const AdminProducts = lazy(() => import("@/features/admin/pages/Products"));
const AdminOrders = lazy(() => import("@/features/admin/pages/Orders"));
const AdminCoupons = lazy(() => import("@/features/admin/pages/Coupons"));

export const AdminRoutes = () => (
  <>
    {/* صفحة الدخول (خاصة بالضيوف فقط) */}
    <Route
      path="/admin/login"
      element={
        <GuestRoute>
          <Suspense fallback={<PageLoader />}>
            <AdminLogin />
          </Suspense>
        </GuestRoute>
      }
    />

    {/* صفحات الأدمن كلها داخل Layout واحد */}
    <Route
      path="/admin"
      element={
        <ProtectedRoute>
          <Suspense fallback={<PageLoader />}>
            <AdminLayout />
          </Suspense>
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
