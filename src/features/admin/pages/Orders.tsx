import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { useAdmin } from "@/features/admin/hooks/useAdmin";
import ProtectedRoute from "@/features/admin/components/ProtectedRoute";
import OrdersTable from "@/features/admin/components/OrdersTable";
import ThemeToggle from "@/features/admin/components/ThemeToggle";
import { ArrowLeft, RefreshCw, Filter, Download } from "lucide-react";
import toast from "react-hot-toast";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { AlertCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Input } from "@/shared/components/ui/input";
import { useAdminOrders } from "@/features/admin/hooks/useAdminOrders";

function AdminOrdersContent() {
  const {
    orders,
    filteredOrders,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    stats,
    loading,
    isUpdating,
    handleUpdateStatus,
    exportOrders,
    refetch,
    goBackToDashboard,
    showInitialLoading,
  } = useAdminOrders();

  if (showInitialLoading) {
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
                onClick={goBackToDashboard}
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
