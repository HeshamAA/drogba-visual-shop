import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Card } from "@/shared/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Badge } from "@/shared/components/ui/badge";
import { Order } from "@/types/strapi";

interface OrdersTableProps {
  orders: Order[];
  onUpdateStatus: (orderId: number, status: Order["status"]) => void;
  isUpdating?: boolean;
}

const statusLabels = {
  pending: "قيد الانتظار",
  confirmed: "مؤكد",
  shipped: "تم الشحن",
  delivered: "تم التسليم",
} as const;

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
} as const;

export default function OrdersTable({
  orders,
  onUpdateStatus,
  isUpdating,
}: OrdersTableProps) {
  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>رقم الطلب</TableHead>
            <TableHead>العميل</TableHead>
            <TableHead>الهاتف</TableHead>
            <TableHead>المنتجات</TableHead>
            <TableHead>الإجمالي</TableHead>
            <TableHead>الحالة</TableHead>
            <TableHead>التاريخ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center py-8 text-muted-foreground"
              >
                لا توجد طلبات
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order, index) => (
              <TableRow key={String(order.id ?? order.createdAt ?? index)}>
                <TableCell className="font-mono text-sm">
                  {order.id ?? "—"}
                </TableCell>
                <TableCell className="font-medium">
                  {order.customer_name ?? "—"}
                </TableCell>
                <TableCell>{order.customer_phone ?? order.phone ?? "—"}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {Array.isArray(order.products) && order.products.length > 0 ? (
                      order.products.map((item, idx) => (
                        <div key={idx} className="text-sm">
                          {item?.name || item?.productName || "منتج"}{" "}
                          {item?.size ? `(${item.size})` : ""} x
                          {item?.quantity ?? 0}
                        </div>
                      ))
                    ) : (
                      <div className="text-sm">لا توجد منتجات</div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-semibold">
                  {order.total_price ?? 0} ج.م
                </TableCell>
                <TableCell>
                  <Select
                    value={order.status ?? "pending"}
                    onValueChange={(value) => {
                      if (order.id === undefined) return;
                      const numericId =
                        typeof order.id === "number"
                          ? order.id
                          : Number(order.id);
                      if (Number.isNaN(numericId)) {
                        return;
                      }
                      onUpdateStatus(numericId, value as Order["status"]);
                    }}
                    disabled={
                      isUpdating || order.id === undefined || order.id === null
                    }
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue>
                        <Badge
                          className={
                            statusColors[(order.status ?? "pending") as keyof typeof statusColors] ??
                            "bg-gray-100 text-gray-800"
                          }
                        >
                          {statusLabels[(order.status ?? "pending") as keyof typeof statusLabels] ||
                            order.status ||
                            "—"}
                        </Badge>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">قيد الانتظار</SelectItem>
                      <SelectItem value="confirmed">مؤكد</SelectItem>
                      <SelectItem value="shipped">تم الشحن</SelectItem>
                      <SelectItem value="delivered">تم التسليم</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString("ar-EG")
                    : "—"}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
