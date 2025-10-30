import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "@/features/admin/hooks/useAdmin";
import ProtectedRoute from "@/features/admin/components/ProtectedRoute";
import { Coupon } from "@/types/strapi";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, ArrowLeft, Trash2, Edit } from "lucide-react";
import ThemeToggle from "@/features/admin/components/ThemeToggle";
import toast from "react-hot-toast";

function AdminCouponsContent() {
  const navigate = useNavigate();
  const { coupons, addCoupon, updateCoupon, deleteCoupon, products } =
    useAdmin();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [form, setForm] = useState<Coupon>({
    code: "",
    type: "percent",
    value: 10,
    active: true,
  });

  const openCreate = () => {
    setEditing(null);
    setForm({ code: "", type: "percent", value: 10, active: true });
    setIsDialogOpen(true);
  };

  const openEdit = (coupon: Coupon) => {
    setEditing(coupon);
    setForm(coupon);
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    const normalized: Coupon = {
      ...form,
      code: form.code.trim().toUpperCase(),
      applicableProductIds: form.applicableProductIds?.filter(Boolean),
    };
    if (!normalized.code || normalized.value <= 0) return;
    try {
      if (editing) {
        updateCoupon(editing.code, normalized);
        toast.success("تم تحديث الكوبون");
      } else {
        addCoupon(normalized);
        toast.success("تم إضافة الكوبون");
      }
      setIsDialogOpen(false);
      setEditing(null);
    } catch (error: any) {
      toast.error(error?.message || "فشل حفظ الكوبون");
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-card border-b">
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
              <h1 className="text-2xl font-bold">إدارة الأكواد الترويجية</h1>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button onClick={openCreate}>
                <Plus className="w-4 h-4 ml-2" />
                إضافة كوبون
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الكود</TableHead>
                <TableHead>النوع</TableHead>
                <TableHead>القيمة</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>المنتجات المطبقة</TableHead>
                <TableHead className="text-left">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coupons.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-muted-foreground"
                  >
                    لا توجد أكواد بعد
                  </TableCell>
                </TableRow>
              ) : (
                coupons.map((c) => (
                  <TableRow key={c.code}>
                    <TableCell className="font-mono">{c.code}</TableCell>
                    <TableCell>
                      {c.type === "percent" ? "نسبة" : "قيمة ثابتة"}
                    </TableCell>
                    <TableCell>
                      {c.type === "percent" ? `${c.value}%` : `${c.value} ج.م`}
                    </TableCell>
                    <TableCell>{c.active ? "مفعل" : "متوقف"}</TableCell>
                    <TableCell>
                      {c.applicableProductIds &&
                      c.applicableProductIds.length > 0
                        ? c.applicableProductIds
                            .map(
                              (id) =>
                                products.find((p) => p.id === id)?.attributes
                                  .name || `#${id}`
                            )
                            .join(", ")
                        : "كل المنتجات"}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEdit(c)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteCoupon(c.code)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {editing ? "تعديل الكوبون" : "إضافة كوبون"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">الكود</Label>
              <Input
                id="code"
                value={form.code}
                onChange={(e) =>
                  setForm({ ...form, code: e.target.value.toUpperCase() })
                }
                placeholder="DROG10"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>النوع</Label>
                <Select
                  value={form.type}
                  onValueChange={(v: "percent" | "fixed") =>
                    setForm({ ...form, type: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percent">نسبة %</SelectItem>
                    <SelectItem value="fixed">قيمة ثابتة</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>القيمة</Label>
                <Input
                  type="number"
                  value={form.value}
                  onChange={(e) =>
                    setForm({ ...form, value: Number(e.target.value) })
                  }
                  placeholder={form.type === "percent" ? "10" : "50"}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>
                المنتجات المطبقة (IDs مفصولة بفواصل، اتركه فارغًا لكل المنتجات)
              </Label>
              <Input
                value={(form.applicableProductIds || []).join(",")}
                onChange={(e) =>
                  setForm({
                    ...form,
                    applicableProductIds: e.target.value
                      .split(",")
                      .map((s) => parseInt(s.trim(), 10))
                      .filter((n) => !isNaN(n)),
                  })
                }
                placeholder="1,2,3"
              />
            </div>

            <div className="flex gap-2">
              <Button className="flex-1" onClick={handleSave}>
                حفظ
              </Button>
              <Button
                className="flex-1"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                إلغاء
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function AdminCoupons() {
  return (
    <ProtectedRoute>
      <AdminCouponsContent />
    </ProtectedRoute>
  );
}
