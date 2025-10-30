import { useCallback, useState } from "react";
import toast from "react-hot-toast";

import { useAdmin } from "@/features/admin/hooks/useAdmin";
import { Coupon } from "@/types/strapi";
import { useAdminNavigation } from "@/features/admin/hooks/useAdminNavigation";

const defaultForm: Coupon = {
  code: "",
  type: "percent",
  value: 10,
  active: true,
};

export const useAdminCoupons = () => {
  const { coupons, addCoupon, updateCoupon, deleteCoupon, products } = useAdmin();
  const { goBackToDashboard } = useAdminNavigation();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [form, setForm] = useState<Coupon>(defaultForm);

  const openCreate = useCallback(() => {
    setEditing(null);
    setForm(defaultForm);
    setIsDialogOpen(true);
  }, []);

  const openEdit = useCallback((coupon: Coupon) => {
    setEditing(coupon);
    setForm(coupon);
    setIsDialogOpen(true);
  }, []);

  const handleSave = useCallback(() => {
    const normalized: Coupon = {
      ...form,
      code: form.code.trim().toUpperCase(),
      applicableProductIds: form.applicableProductIds?.filter(Boolean),
    };

    if (!normalized.code || normalized.value <= 0) {
      toast.error("يرجى إدخال بيانات صحيحة للكوبون");
      return;
    }

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
  }, [addCoupon, editing, form, updateCoupon]);

  const handleDelete = useCallback(
    (code: string) => {
      try {
        deleteCoupon(code);
        toast.success("تم حذف الكوبون");
      } catch (error: any) {
        toast.error(error?.message || "فشل حذف الكوبون");
      }
    },
    [deleteCoupon],
  );

  const handleFormChange = useCallback(
    <K extends keyof Coupon>(key: K, value: Coupon[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  return {
    coupons,
    products,
    isDialogOpen,
    editing,
    form,
    openCreate,
    openEdit,
    handleSave,
    handleDelete,
    handleFormChange,
    setIsDialogOpen,
    goBackToDashboard,
  };
};
