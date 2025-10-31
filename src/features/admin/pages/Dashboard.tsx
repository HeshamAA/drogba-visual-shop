import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/features/admin/components/ThemeToggle";
import ProtectedRoute from "@/features/admin/components/ProtectedRoute";
import {
  Package,
  ShoppingCart,
  TrendingUp,
  LogOut,
  TicketPercent,
  Home,
} from "lucide-react";
import { useAdminDashboard } from "@/features/admin/hooks/useAdminDashboard";

function AdminDashboardContent() {
  const {
    products,
    loading,
    pendingOrders,
    totalRevenue,
    handleLogout,
  } = useAdminDashboard();

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-card border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">لوحة تحكم الإدمن</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link to="/">
                <Home className="w-4 h-4 ml-2" />
                الصفحة الرئيسية
              </Link>
            </Button>
            <ThemeToggle />
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 ml-2" />
              تسجيل الخروج
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                إجمالي المنتجات
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
              <p className="text-xs text-muted-foreground">منتج متاح</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                الطلبات المعلقة
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingOrders}</div>
              <p className="text-xs text-muted-foreground">طلب في الانتظار</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                إجمالي الإيرادات
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalRevenue.toFixed(2)} ج.م
              </div>
              <p className="text-xs text-muted-foreground">من جميع الطلبات</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>إدارة المنتجات</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground mb-4">
                عرض وتعديل وإضافة منتجات جديدة
              </p>
              <Link to="/admin/products">
                <Button className="w-full" variant="gradient">
                  <Package className="w-4 h-4 ml-2" />
                  إدارة المنتجات
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>إدارة الطلبات</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground mb-4">
                عرض ومتابعة حالة الطلبات
              </p>
              <Link to="/admin/orders">
                <Button className="w-full" variant="gradient">
                  <ShoppingCart className="w-4 h-4 ml-2" />
                  إدارة الطلبات
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>إدارة الأكواد الترويجية</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground mb-4">
                إنشاء وتعديل أكواد الخصم وربطها بالمنتجات
              </p>
              <Link to="/admin/coupons">
                <Button className="w-full" variant="gradient">
                  <TicketPercent className="w-4 h-4 ml-2" />
                  إدارة الكوبونات
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <ProtectedRoute>
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}
