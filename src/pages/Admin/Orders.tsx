import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAdmin } from "@/contexts/AdminContext";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import OrdersTable from "@/components/admin/OrdersTable";
import ThemeToggle from "@/components/admin/ThemeToggle";
import { ArrowLeft, RefreshCw, Filter, Download } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

function AdminOrdersContent() {
  const navigate = useNavigate();
  const { orders, updateOrderStatus, loading, refetch } = useAdmin();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateStatus = async (orderId: number, newStatus: string) => {
    setIsUpdating(true);
    try {
      await updateOrderStatus(String(orderId), newStatus as any);
      toast.success("تم تحديث حالة الطلب بنجاح");
      await refetch();
    } catch (error: any) {
      console.error("Error updating order status:", error);
      toast.error(error.message || "فشل في تحديث حالة الطلب");
    } finally {
      setIsUpdating(false);
    }
  };

  // Filter orders based on status and search
  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    const matchesSearch =
      searchQuery === "" ||
      order.id.toString().includes(searchQuery) ||
      order.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.phone?.includes(searchQuery);

    return matchesStatus && matchesSearch;
  });

  // Calculate statistics
  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    confirmed: orders.filter((o) => o.status === "confirmed").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    totalRevenue: orders
      .filter((o) => o.status === "delivered")
      .reduce((sum, order) => sum + (order.total_price || 0), 0),
  };

  const exportOrders = () => {
    try {
      const csvContent = [
        ["ID", "العميل", "الهاتف", "الإجمالي", "الحالة", "التاريخ"],
        ...filteredOrders.map((order) => [
          order.id,
          order.customer_name || "",
          order.phone || "",
          order.total_price || 0,
          order.status || "",
          new Date(order.createdAt || "").toLocaleDateString("ar-EG"),
        ]),
      ]
        .map((row) => row.join(","))
        .join("\n");

      const blob = new Blob(["\ufeff" + csvContent], {
        type: "text/csv;charset=utf-8;",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `orders-${new Date().toISOString().split("T")[0]}.csv`;
      link.click();
      toast.success("تم تصدير الطلبات بنجاح");
    } catch (error) {
      toast.error("فشل في تصدير الطلبات");
    }
  };

  if (loading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري تحميل الطلبات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-card border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/admin/dashboard")}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">إدارة الطلبات</h1>
                <p className="text-sm text-muted-foreground">
                  {filteredOrders.length} من {orders.length} طلب
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={refetch}
                disabled={loading}
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={exportOrders}
                disabled={filteredOrders.length === 0}
              >
                <Download className="w-4 h-4 ml-2" />
                تصدير CSV
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-card rounded-lg p-4 border">
            <p className="text-sm text-muted-foreground mb-1">إجمالي الطلبات</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-card rounded-lg p-4 border border-yellow-500/20">
            <p className="text-sm text-muted-foreground mb-1">قيد الانتظار</p>
            <p className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </p>
          </div>
          <div className="bg-card rounded-lg p-4 border border-blue-500/20">
            <p className="text-sm text-muted-foreground mb-1">مؤكد</p>
            <p className="text-2xl font-bold text-blue-600">
              {stats.confirmed}
            </p>
          </div>
          <div className="bg-card rounded-lg p-4 border border-purple-500/20">
            <p className="text-sm text-muted-foreground mb-1">تم الشحن</p>
            <p className="text-2xl font-bold text-purple-600">
              {stats.shipped}
            </p>
          </div>
          <div className="bg-card rounded-lg p-4 border border-green-500/20">
            <p className="text-sm text-muted-foreground mb-1">تم التسليم</p>
            <p className="text-2xl font-bold text-green-600">
              {stats.delivered}
            </p>
          </div>
          <div className="bg-card rounded-lg p-4 border border-primary/20">
            <p className="text-sm text-muted-foreground mb-1">
              إجمالي المبيعات
            </p>
            <p className="text-2xl font-bold text-primary">
              {stats.totalRevenue} ج.م
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-lg p-4 mb-6 border">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-4 h-4" />
            <h2 className="font-semibold">الفلاتر</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">الحالة</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  <SelectItem value="pending">قيد الانتظار</SelectItem>
                  <SelectItem value="confirmed">مؤكد</SelectItem>
                  <SelectItem value="shipped">تم الشحن</SelectItem>
                  <SelectItem value="delivered">تم التسليم</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">البحث</label>
              <Input
                type="text"
                placeholder="ابحث برقم الطلب، الاسم أو الهاتف..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Orders Table */}
        {filteredOrders.length === 0 ? (
          <div className="bg-card rounded-lg p-12 text-center border">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">لا توجد طلبات</h3>
            <p className="text-muted-foreground">
              {searchQuery || statusFilter !== "all"
                ? "لا توجد طلبات تطابق معايير البحث"
                : "لم يتم تقديم أي طلبات بعد"}
            </p>
          </div>
        ) : (
          <OrdersTable
            orders={filteredOrders}
            onUpdateStatus={handleUpdateStatus}
            isUpdating={isUpdating}
          />
        )}
      </main>
    </div>
  );
}

export default function AdminOrders() {
  return (
    <ProtectedRoute>
      <AdminOrdersContent />
    </ProtectedRoute>
  );
}
