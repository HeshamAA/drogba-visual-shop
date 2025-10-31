import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Package, CheckCircle2, XCircle, Clock, RefreshCw } from "lucide-react";
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

export default function AdminOrders() {
  const { t } = useTranslation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get("/orders?populate=order_products&sort=createdAt:desc");
      setOrders(data.data || []);
    } catch (error) {
      toast.error("فشل في تحميل الطلبات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingOrderId(orderId);
    try {
      await axiosInstance.put(`/orders/${orderId}`, {
        data: { order_status: newStatus },
      });
      
      toast.success("تم تحديث حالة الطلب بنجاح");
      fetchOrders(); // Refresh orders
    } catch (error) {
      toast.error("فشل في تحديث حالة الطلب");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            <CheckCircle2 className="w-4 h-4 mr-1" />
            مكتمل
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-500 hover:bg-red-600">
            <XCircle className="w-4 h-4 mr-1" />
            ملغي
          </Badge>
        );
      case "pending":
      default:
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600">
            <Clock className="w-4 h-4 mr-1" />
            قيد المراجعة
          </Badge>
        );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "border-green-200 bg-green-50";
      case "cancelled":
        return "border-red-200 bg-red-50";
      default:
        return "border-yellow-200 bg-yellow-50";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Package className="w-8 h-8" />
          إدارة الطلبات
        </h1>
        <Button onClick={fetchOrders} variant="outline" disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          تحديث
        </Button>
      </div>

      {loading && orders.length === 0 ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : orders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">لا توجد طلبات</h3>
            <p className="text-muted-foreground">لم يتم تقديم أي طلبات بعد</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className={`border-2 ${getStatusColor(order.order_status)}`}>
              <CardHeader>
                <div className="flex justify-between items-start flex-wrap gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">
                      طلب رقم: {order.documentId}
                    </CardTitle>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>العميل: {order.customer_name}</p>
                      <p>الهاتف: {order.customer_phone}</p>
                      <p>التاريخ: {new Date(order.createdAt).toLocaleDateString("ar-EG", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    {getStatusBadge(order.order_status)}
                    <p className="font-bold text-lg">{order.total_price} جنيه</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2 text-sm">العنوان</h4>
                    <p className="text-sm text-muted-foreground">{order.address}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-sm">طريقة الدفع</h4>
                    <p className="text-sm text-muted-foreground">{order.payment_method}</p>
                  </div>
                </div>

                {/* Order Products */}
                {order.order_products && order.order_products.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 text-sm">المنتجات</h4>
                    <div className="space-y-2">
                      {order.order_products.map((product) => (
                        <div
                          key={product.id}
                          className="flex justify-between items-center p-2 bg-white rounded border"
                        >
                          <div>
                            <p className="font-medium text-sm">{product.name}</p>
                            <p className="text-xs text-muted-foreground">
                              المقاس: {product.size} | الكمية: {product.quantity}
                            </p>
                          </div>
                          <p className="font-semibold text-sm">{product.price} جنيه</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Status Update */}
                <div className="flex gap-2 items-center pt-4 border-t">
                  <label className="text-sm font-medium">تغيير الحالة:</label>
                  <Select
                    value={order.order_status}
                    onValueChange={(value) => updateOrderStatus(order.documentId, value)}
                    disabled={updatingOrderId === order.documentId}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">قيد المراجعة</SelectItem>
                      <SelectItem value="completed">مكتمل</SelectItem>
                      <SelectItem value="cancelled">ملغي</SelectItem>
                    </SelectContent>
                  </Select>
                  {updatingOrderId === order.documentId && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
