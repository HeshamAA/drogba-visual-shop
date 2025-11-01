import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Package, Search, CheckCircle2, XCircle, Clock } from "lucide-react";
import { useOrderTracking } from "@/features/orders/hooks/useOrderTracking";

export default function OrderTracking() {
  const {
    order,
    loading,
    orderId,
    searchId,
    setSearchId,
    handleSearch,
    navigate,
  } = useOrderTracking();

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

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
          <Package className="w-8 h-8" />
          تتبع الطلب
        </h1>

        {/* Search Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">ابحث عن طلبك</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                type="text"
                placeholder="أدخل رقم الطلب (Order ID)"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={!searchId.trim()}>
                <Search className="w-4 h-4 mr-2" />
                بحث
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {/* Order Details */}
      {!loading && order && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>طلب رقم: #{order.id}</CardTitle>
                  <p className="text-xs text-muted-foreground mt-1 font-mono">
                    {order.documentId}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    تاريخ الطلب: {new Date(order.createdAt).toLocaleDateString("ar-EG")}
                  </p>
                </div>
                {getStatusBadge(order.order_status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">معلومات العميل</h3>
                  <p className="text-sm">الاسم: {order.customer_name}</p>
                  <p className="text-sm">الهاتف: {order.customer_phone}</p>
                  <p className="text-sm">العنوان: {order.address}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">معلومات الدفع</h3>
                  <p className="text-sm">طريقة الدفع: {order.payment_method}</p>
                  <p className="text-sm font-bold text-lg mt-2">
                    الإجمالي: {order.total_price} جنيه
                  </p>
                </div>
              </div>

              {/* Order Products */}
              {order.order_products && order.order_products.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">المنتجات</h3>
                  <div className="space-y-2">
                    {order.order_products.map((product) => (
                      <div
                        key={product.id}
                        className="flex justify-between items-center p-3 bg-muted rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            المقاس: {product.size} | الكمية: {product.quantity}
                          </p>
                        </div>
                        <p className="font-semibold">{product.price} جنيه</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button onClick={() => navigate("/")} variant="outline" className="flex-1">
              العودة للرئيسية
            </Button>
            <Button onClick={() => navigate("/products")} className="flex-1">
              تسوق المزيد
            </Button>
          </div>
        </div>
      )}

      {/* No Order Found */}
      {!loading && !order && orderId && (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">لم يتم العثور على الطلب</h3>
            <p className="text-muted-foreground mb-6">
              تأكد من رقم الطلب وحاول مرة أخرى
            </p>
            <Button onClick={() => navigate("/")}>العودة للرئيسية</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
