import { useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";

import { useAdmin } from "@/features/admin/hooks/useAdmin";
import { useAdminNavigation } from "@/features/admin/hooks/useAdminNavigation";

export const useAdminOrders = () => {
  const { orders, updateOrderStatus, loading, refetch } = useAdmin();
  const { goBackToDashboard } = useAdminNavigation();

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      const normalizedQuery = searchQuery.trim().toLowerCase();

      const matchesSearch =
        normalizedQuery === "" ||
        String(order.id ?? "").includes(normalizedQuery) ||
        order.customer_name?.toLowerCase().includes(normalizedQuery) ||
        (order.customer_phone ?? order.phone ?? "")
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesStatus && matchesSearch;
    });
  }, [orders, searchQuery, statusFilter]);

  const stats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter((o) => o.status === "pending" || o.order_status === "pending").length;
    const completed = orders.filter((o) => o.status === "completed" || o.order_status === "completed").length;
    const cancelled = orders.filter((o) => o.status === "cancelled" || o.order_status === "cancelled").length;
    const totalRevenue = orders
      .filter((o) => o.status === "completed" || o.order_status === "completed")
      .reduce((sum, order) => sum + (order.total_price || 0), 0);

    return {
      total,
      pending,
      completed,
      cancelled,
      totalRevenue,
    };
  }, [orders]);

  const handleUpdateStatus = useCallback(
    async (orderId: string | number, newStatus: string) => {
      setIsUpdating(true);
      try {
        console.log("Updating order:", orderId, "to status:", newStatus);
        await updateOrderStatus(String(orderId), newStatus as any);
        toast.success("تم تحديث حالة الطلب بنجاح");
        console.log("Refetching orders...");
        await refetch();
        console.log("Orders refetched");
      } catch (error: any) {
        console.error("Error updating order status:", error);
        toast.error(error?.message || "فشل في تحديث حالة الطلب");
      } finally {
        setIsUpdating(false);
      }
    },
    [refetch, updateOrderStatus],
  );

  const exportOrders = useCallback(() => {
    try {
      const csvContent = [
        ["ID", "العميل", "الهاتف", "الإجمالي", "الحالة", "التاريخ"],
        ...filteredOrders.map((order) => [
          order.id ?? "",
          order.customer_name ?? "",
          order.customer_phone ?? order.phone ?? "",
          order.total_price ?? 0,
          order.status ?? "",
          order.createdAt ? new Date(order.createdAt).toLocaleDateString("ar-EG") : "",
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
  }, [filteredOrders]);

  const showInitialLoading = loading && orders.length === 0;

  return {
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
  };
};
