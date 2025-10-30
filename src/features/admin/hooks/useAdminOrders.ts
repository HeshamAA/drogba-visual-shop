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
    const pending = orders.filter((o) => o.status === "pending").length;
    const confirmed = orders.filter((o) => o.status === "confirmed").length;
    const shipped = orders.filter((o) => o.status === "shipped").length;
    const delivered = orders.filter((o) => o.status === "delivered").length;
    const totalRevenue = orders
      .filter((o) => o.status === "delivered")
      .reduce((sum, order) => sum + (order.total_price || 0), 0);

    return {
      total,
      pending,
      confirmed,
      shipped,
      delivered,
      totalRevenue,
    };
  }, [orders]);

  const handleUpdateStatus = useCallback(
    async (orderId: number, newStatus: string) => {
      setIsUpdating(true);
      try {
        await updateOrderStatus(String(orderId), newStatus as any);
        toast.success("تم تحديث حالة الطلب بنجاح");
        await refetch();
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
