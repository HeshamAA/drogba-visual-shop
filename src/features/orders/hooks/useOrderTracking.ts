import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/api/client";

interface OrderProduct {
  id: number;
  documentId: string;
  name: string;
  size: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  documentId: string;
  customer_name: string;
  customer_phone: string;
  address: string;
  total_price: number;
  payment_method: string;
  order_status: "pending" | "completed" | "cancelled";
  createdAt: string;
  order_products?: OrderProduct[];
}

export function useOrderTracking() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchId, setSearchId] = useState("");

  const fetchOrder = async (id: string) => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get(`/orders/${id}?populate=order_products`);
      setOrder(data.data);
    } catch (error) {
      toast.error("لم يتم العثور على الطلب");
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchOrder(orderId);
    }
  }, [orderId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchId.trim()) {
      navigate(`/order-tracking/${searchId.trim()}`);
    }
  };

  const getStatusBadge = (status: string) => {
    return status;
  };

  return {
    // Data
    order,
    loading,
    orderId,
    
    // Search state
    searchId,
    setSearchId,
    
    // Actions
    handleSearch,
    getStatusBadge,
    
    // Helpers
    navigate,
    t,
  };
}
