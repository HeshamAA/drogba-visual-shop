import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
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
            orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-sm">{order.id}</TableCell>
                <TableCell className="font-medium">
                  {order.customer_name}
                </TableCell>
                <TableCell>{order.phone}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {order.products ? (
                      Array.isArray(order.products) ? (
                        order.products.map((item: any, idx: number) => (
                          <div key={idx} className="text-sm">
                            {item.name || item.productName}{" "}
                            {item.size ? `(${item.size})` : ""} x{item.quantity}
                          </div>
                        ))
                      ) : (
                        <div className="text-sm">منتجات الطلب</div>
                      )
                    ) : (
                      <div className="text-sm">لا توجد منتجات</div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-semibold">
                  {order.total_price} ج.م
                </TableCell>
                <TableCell>
                  <Select
                    value={order.status}
                    onValueChange={(value) =>
                      onUpdateStatus(order.id, value as Order["status"])
                    }
                    disabled={isUpdating}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue>
                        <Badge
                          className={
                            statusColors[order.status] ||
                            "bg-gray-100 text-gray-800"
                          }
                        >
                          {statusLabels[order.status] || order.status}
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
                  {new Date(order.createdAt).toLocaleDateString("ar-EG")}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
